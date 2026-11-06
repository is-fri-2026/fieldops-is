# FieldOps Project Proposal Implementation Plan

> **For agentic workers:** Execute this documentation-only plan task-by-task in the current session. The user explicitly requested autonomous execution, commits, push, issues and a pull request; no additional execution-choice prompt is needed.

**Goal:** Publish a consistent Slovenian project proposal, an OpenAPI contract, eleven real GitHub issues and two milestones, and an unmerged `Project proposal` pull request.

**Architecture:** Preserve the official template directories. Describe a planned five-entity maintenance system; implement only documentation validation, never the application. Treat the two students' actual review and contributions as facts to verify, not checkboxes to invent.

**Tech Stack:** Planned Next.js/TypeScript REST API and web, PostgreSQL/Prisma, Zod, Expo Android, a structured-output LLM adapter, bounded assignment agent, GitHub Actions and Railway. Proposal tooling: Redocly and Mermaid parsers.

## Task 1: Establish requirements and protect existing work

- [x] Inspect `git status --short`, branch and remotes; confirmed clean `proposal`, correct origin and initial template commit.
- [x] Read repository and parent `AGENTS.md`, official proposal instructions, requirements, rubric and API guidance.
- [x] Verify both GitHub usernames; `amarkrasniqi54321-ctrl` exists but is not currently a repository collaborator.
- [ ] Read the course AI policy and retain honest attribution in `docs/ai-usage-log.md`.

## Task 2: Establish the backlog without duplicates

Files: `docs/proposal.md` (links), `docs/backlog.json` (issue payloads and returned numbers).

- [ ] Prepare seven Must stories for `midterm` and four Should stories for `final`, each with concrete positive and negative Given/When/Then criteria.
- [ ] Reuse milestones or create `midterm` and `final` with descriptions, without guessing course dates.
- [ ] List existing issues; reuse matching story IDs or create eleven `user-story` issues using the actual template fields. Persist returned issue numbers and URLs.

## Task 3: Complete the proposal and technical design

Files: `README.md`, `AGENTS.md`, `docs/proposal.md`, `docs/data-model.md`, `docs/architecture.md`, `docs/decisions/0001-stack.md`, `docs/agent.md`, `docs/ai-usage-log.md`, `docs/api/openapi.yaml`, `api-tests/README.md`.

- [ ] Specify roles, scope, all stories, mobile list/create/edit workflow, one-call LLM assistance and confirmed multi-step agent.
- [ ] Define exactly `User`, `Asset`, `Ticket`, `Assignment`, `TicketEvent`, with keys, constraints and transitions.
- [ ] Plan full CRUD for Assets and Tickets, pagination, DTOs, uniform Problem Details, server-enforced authorization, concurrency and audit rules.
- [ ] Specify authentication, five-entity persistence, bounded agent confirmation without a sixth domain table, seed/migrations, Docker, CI/CD, deployment and costs.
- [ ] Compare the selected stack against two serious alternatives. Reserve subsequent ADR decisions for implementation milestones.
- [ ] Remove generic template content from completed deliverables while preserving the reusable ADR template and original directory structure.

## Task 4: Validate the documentation

Files: `package.json`, lockfile, `scripts/validate-docs.mjs`, `.github/workflows/ci.yml`, `.gitignore`, `docs/proposal-verification.md`.

- [ ] Install pinned documentation validators; run `npm run validate` to lint OpenAPI, parse every Mermaid block, verify local links, story counts, five entities and no generic unfinished content.
- [ ] Run `git diff --check` and scan the pending changes for credentials.
- [ ] Verify actual GitHub issue numbers, story count and milestone assignments.
- [ ] Record rubric coverage and any missing real human review/contribution in the verification document.

## Task 5: Publish and inspect external state

- [ ] Commit only this proposal work under the authenticated user's identity; do not impersonate the teammate.
- [ ] Push `origin/proposal`; open/reuse PR `Project proposal` against `main` with the complete official checklist and truthful review status.
- [ ] Request review from `amarkrasniqi54321-ctrl`; if permissions prevent it, record the actual failure and next administrative step. Never guess a TA account.
- [ ] Inspect GitHub Actions and correct failures attributable to this proposal. Verify remote HEAD, PR and issues.
- [ ] Inspect available browser sessions for authenticated Moodle access; submit only to the identifiable course assignment. If inaccessible, report the exact repository URL for both students to submit.
- [ ] Report verified URLs, checks and remaining human actions. Do not merge or tag the unapproved proposal.
