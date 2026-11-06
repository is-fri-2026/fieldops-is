# FieldOps – navodila za asistente

## Projekt in trenutna faza

Predlog pri IS, UL FRI 2026/27. FieldOps podpira prijavo okvare opreme, dodelitev tehnikov in zgodovino. Trenutno obstajata dokumentacija in njeno preverjanje; aplikacija še ni implementirana. Ne izmišljaj človeških pregledov, imen, javnih URL-jev ali rezultatov testov.

## Sklad

Načrtovane različice: Node.js 22 LTS, Next.js 16, React 19, TypeScript 5, PostgreSQL 17, Prisma 6, Zod 4, Expo SDK 54 z njegovim združljivim React Native. Točne različice in testni ogrodji Vitest/Playwright se zaklenejo ob implementaciji. LLM: Gemini API prek strežniškega adapterja; model iz konfiguracije se preveri pred implementacijo. Trenutne točne različice dokumentacijskih orodij so v `package.json` in `package-lock.json`.

## Struktura in ukazi

- `src/`: rezervirano za splet, Route Handlers, storitve in dostop do podatkov.
- `mobile/`: rezervirano za Expo Android.
- `docs/`: predlog; `docs/api/openapi.yaml` je pogodba API.
- `docs/backlog.json`: kanonične zgodbe in dejanske povezave na GitHub.
- `api-tests/`: načrt preverjanja API; izvedljivi testi še ne obstajajo.
- `scripts/validate-docs.mjs`: struktura, lokalne povezave in Mermaid.
- Namestitev orodij: `npm ci`; preverjanje: `npm run validate`.
- Zagon/testi aplikacije: še niso na voljo; ne uporabljaj izmišljenih ukazov.

## Pravila izvedbe

- Natanko pet glavnih entitet: User, Asset, Ticket, Assignment, TicketEvent. M:N med User in Ticket gre prek Assignment.
- API uporablja DTO in Zod; nikoli ne vrača passwordHash ali dovoljuje mass assignment vlog/avtorstva.
- Poslovna pravila so v storitvah, ne v odjemalcu ali handlerju. Strežnik preveri vlogo, aktivnost in lastništvo/dodelitev pri vsaki zahtevi; ne zaupa samo JWT trditvi o vlogi.
- Prehoda statusa sta samo OPEN → IN_PROGRESS → RESOLVED; izvede ju dodeljeni tehnik.
- Sprememba Ticket/Assignment in TicketEvent sta ena transakcija; version varuje sočasnost.
- OpenAPI popravi skupaj z API; shemo spreminjaj samo z migracijami.
- Skrivnosti so v strežniškem okolju; v logih ni JWT, gesel, API ključev ali celotnih opisov.
- Agent uporablja isti API z uporabnikovim JWT. Pisanje je dosegljivo samo po izrecni potrditvi in preverbi podpisanega tokena na strežniku; model ne ustvarja dokaza potrditve.
- Aplikacijske vedenjske spremembe zahtevajo poslovne enotske in API integracijske teste. Testi LLM so brez zunanjih klicev.
- Pomembno uporabo UI zabeleži v `docs/ai-usage-log.md`. Ne simuliraj prispevka, commita ali pregleda drugega člana.
- Za predlog ne implementiraj aplikacije, ne združuj PR in ne ustvarjaj taga odobritve.
