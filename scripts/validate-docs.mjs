import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { parseDocument } from 'yaml';

// Mermaid sanitizes labels while parsing. Provide a DOM, never a browser session.
const dom = new JSDOM('');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFile(path.join(root, file), 'utf8');
const required = [
  'README.md', 'AGENTS.md', 'docs/proposal.md', 'docs/data-model.md',
  'docs/architecture.md', 'docs/decisions/0001-stack.md', 'docs/agent.md',
  'docs/ai-usage-log.md', 'docs/api/openapi.yaml', 'docs/proposal-verification.md',
  'docs/backlog.json', 'api-tests/README.md', '.github/workflows/ci.yml',
];
for (const file of required) assert((await read(file)).trim().length > 100, `Missing/empty: ${file}`);

async function markdownFiles(directory) {
  const result = [];
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const name = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await markdownFiles(name));
    else if (entry.name.endsWith('.md') && entry.name !== '0000-template.md') result.push(name);
  }
  return result;
}
const files = ['README.md', 'AGENTS.md', ...await markdownFiles('docs'), ...await markdownFiles('api-tests')];
let diagrams = 0;
let links = 0;
for (const file of files) {
  const source = await read(file);
  assert(!/TODO-AUTHOR|# Project name|As a …|#…|example\.invalid|<!--/u.test(source), `Unfilled template: ${file}`);
  for (const match of source.matchAll(/```mermaid\s*\r?\n([\s\S]*?)```/g)) {
    assert(await mermaid.parse(match[1]), `Invalid diagram: ${file}`);
    diagrams++;
  }
  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const resolved = path.resolve(root, path.dirname(file), decodeURIComponent(target));
    assert(resolved.startsWith(root + path.sep), `Link escapes repository: ${file}: ${target}`);
    await access(resolved);
    links++;
  }
}
assert(diagrams >= 4, 'Expected ER, architecture, delivery and README diagrams');
const model = await read('docs/data-model.md');
const entities = [...model.matchAll(/^\s{4}([A-Z_]+) \{/gm)].map((m) => m[1]).sort();
assert.deepEqual(entities, ['ASSET', 'ASSIGNMENT', 'TICKET', 'TICKET_EVENT', 'USER']);
assert(model.includes('UNIQUE(`ticketId`, `technicianId`)'), 'Missing M:N uniqueness');

const { stories } = JSON.parse(await read('docs/backlog.json'));
assert.equal(stories.length, 11);
assert.equal(stories.filter((s) => s.priority === 'Must').length, 7);
assert.equal(stories.filter((s) => s.priority === 'Should').length, 4);
assert.equal(new Set(stories.map((s) => s.id)).size, 11);
assert.equal(new Set(stories.map((s) => s.issueNumber)).size, 11);
const proposal = await read('docs/proposal.md');
for (const story of stories) {
  assert.equal(story.milestone, story.priority === 'Must' ? 'midterm' : 'final');
  assert(story.story.startsWith('Kot ') && / želim(?:\s|,)/u.test(story.story));
  assert(story.criteria.length >= 3 && story.criteria.every((c) => /Given.+When.+Then/.test(c)));
  assert(Number.isInteger(story.issueNumber) && story.issueNumber > 0);
  assert.equal(story.issueUrl, `https://github.com/is-fri-2026/fieldops-is/issues/${story.issueNumber}`);
  assert(proposal.includes(story.issueUrl), `Missing proposal link: ${story.id}`);
  if (story.priority === 'Must') {
    const section = proposal.match(new RegExp(`### ${story.id}[^]*?(?=\\n### |\\n## |$)`))?.[0];
    assert(section && section.includes('Given') && section.includes('When') && section.includes('Then'));
    assert(/401|403|404|409|422/.test(section), `No unhappy path: ${story.id}`);
  }
}
const yaml = parseDocument(await read('docs/api/openapi.yaml'), { uniqueKeys: true });
assert.deepEqual(yaml.errors, [], 'YAML parse/duplicate keys');
const api = yaml.toJS();
assert.equal(api.openapi, '3.1.0');
for (const [collection, detail] of [['/api/assets', '/api/assets/{assetId}'], ['/api/tickets', '/api/tickets/{ticketId}']]) {
  assert(api.paths[collection].get && api.paths[collection].post);
  assert(api.paths[detail].get && api.paths[detail].patch && api.paths[detail].delete);
}
const operations = [];
for (const [url, item] of Object.entries(api.paths)) {
  for (const [method, op] of Object.entries(item)) {
    if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
    operations.push(op.operationId);
    assert(op.summary && op.description, `${method} ${url}: missing behavior/authorization`);
    assert(Object.keys(op.responses).some((code) => /^2/.test(code)));
    if (!['/health', '/api/auth/login'].includes(url)) assert(op.responses['401']);
    for (const [code, response] of Object.entries(op.responses)) {
      if (!/^[45]/.test(code)) continue;
      const resolved = response.$ref ? api.components.responses[response.$ref.split('/').at(-1)] : response;
      assert(resolved.content?.['application/problem+json'], `No Problem Details: ${url} ${code}`);
    }
  }
}
assert.equal(new Set(operations).size, operations.length, 'Duplicate operationId');
for (const name of ['TicketCreate', 'TicketUpdate', 'AssetCreate', 'AssetUpdate', 'StatusChange', 'AssignmentCreate', 'TicketSuggestion']) {
  assert.equal(api.components.schemas[name].additionalProperties, false, `Permissive DTO: ${name}`);
}
assert(!('reporterId' in api.components.schemas.TicketCreate.properties));
assert(!('status' in api.components.schemas.TicketUpdate.properties));
assert.deepEqual(api.components.schemas.TicketStatus.enum, ['OPEN', 'IN_PROGRESS', 'RESOLVED']);
assert.equal(api.components.parameters.PageSize.schema.maximum, 100);
assert(api.paths['/api/agent/assignment-confirmations'].post.requestBody);
assert(api.paths['/api/tickets/{ticketId}/events'].get);
dom.window.close();
console.log(`PASS: ${files.length} Markdown files; ${diagrams} Mermaid diagrams; ${links} local links; 5 entities; 11 stories; ${operations.length} API operations.`);
console.log('Scope: documentation validation only; no application, human review or live LLM tests claimed.');
