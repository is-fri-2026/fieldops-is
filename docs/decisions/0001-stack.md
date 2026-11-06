# 0001. Enoten TypeScript sklad za FieldOps

- **Status:** proposed – predlog za skupno potrditev ekipe; ne trditev o človeškem pregledu.
- **Datum:** 2026-11-06
- **Nosilca odločitve:** @luka1222424, @amarkrasniqi54321-ctrl
- **Obseg:** dve osebi in približno devet tednov izvedbe po predlogu.

## Kontekst

Potrebujemo dve vlogi, relacijsko M:N, REST CRUD za dve entiteti, Android, preverjen LLM in agent prek istega API. Zahtevana sta Docker in upravljana oblačna baza. Dejanske izkušnje obeh članov niso potrjene; ne trdimo, da sta strokovnjaka za sklad. Brief daje prednost Next.js/TypeScript in Expo. Ne potrebujemo več servisov ali posebne infrastrukture.

## Možnosti

| Možnost | Prednosti za projekt | Slabosti in tveganja |
|---|---|---|
| **A – Next.js + TypeScript, PostgreSQL/Prisma, Zod, Expo** | En jezik za splet, API, mobilne DTO in agent; en deploy spleta/API; relacijske transakcije; skupna validacija. | Nejasna strežniška/odjemalska meja lahko razkrije skrivnosti; Prisma zahteva pozornost pri SQL omejitvah in konkurenci; Expo kamero je treba fizično preizkusiti. |
| **B – ASP.NET Core 10 + EF Core, PostgreSQL, React, .NET MAUI Android** | Jasne plasti, močni tipi, zrela varnost in transakcije, EF migracije, Android prek .NET. | TypeScript in C#, MAUI orodna veriga ter dva aplikacijska builda; več preklopov in usklajevanja DTO za dve osebi. |
| **C – Django 5.2 LTS + Django REST Framework, PostgreSQL, React, Expo** | Zrela avtentikacija/administracija, DRF validacija in pravice, migracije, dobra Python podpora LLM. | Dva jezika in dve shemi validacije; Django admin ne nadomesti dejanskih uporabniških potekov; več usklajevanja API in odvisnosti. |

B je smiselna ob močnem skupnem .NET znanju, C ob Python znanju. Izberemo A zaradi briefa in majhnega števila delov; skupni pregled lahko z dokazljivim razlogom odločitev spremeni.

## Predlagana odločitev

1. Next.js 16 Route Handlers, TypeScript 5, React 19, Node.js 22. Servisni sloj ločen od handlerjev/UI.
2. PostgreSQL 17 in Prisma 6 za pet entitet, izrecne UNIQUE/FK/CHECK, migracije in seed. Brez Redis ali druge baze.
3. Zod 4 za DTO in LLM; OpenAPI 3.1 design-first pogodba, preverjena s testi implementacije.
4. Expo SDK 54 z združljivim React Native za Android; QR, SecureStore in isti REST. iOS ni obvezen.
5. Gemini API prek strežniškega adapterja za strukturirani JSON in function calling. Podprt model se ob implementaciji izbere/zaklene v `LLM_MODEL`; življenjske dobe modela ne predpostavljamo. [Uradni opis zmogljivosti](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash) potrjuje oba načina, ne zagotavlja trajne razpoložljivosti te različice.
6. Omejena orodna zanka brez dodatnega agentnega ogrodja. Pisanje samo po strežniško preverjeni potrditvi.
7. GitHub Actions; načrtovani Vitest, HTTP integracije s PostgreSQL in izbrani Playwright poteki. V proposal fazi samo dokumentacijski validatorji.
8. Večstopenjski Dockerfile, Railway runtime in upravljani PostgreSQL, HTTPS, dnevniki/health; CD samo po uspešnem main CI. Namestitev še ni izvedena.

To so ciljne glavne izdaje; ob uvedbi preverimo združljivost, zaklenemo odvisnosti in spremembe utemeljimo v ADR.

## Posledice

Enotni DTO in manj delov olajšajo delo. Cena je strožji nadzor strežniških meja in del lastne avtentikacije; kratkoživi JWT brez refresh zahteva ponovno prijavo. ORM ne nadomesti transakcij in pravil. TicketEvent JSON je omejen audit payload, ne nadomestek relacij.

Cloud in LLM lahko zahtevata plačilo/kvoto. Pred final preverimo račun in omejimo porabo; testi uporabljajo mock. Ob izpadu LLM ostane ročni vnos. Obveznih funkcij pri final ne izpustimo zaradi notranje oznake Should. Ta PR ne kupuje storitev ali kliče LLM.

Do konca vsaj štirje vsebinski ADR: sklad, avtentikacija, namestitev/migracije in mobilni pristop; agentova potrditev dodatno, če se načrt spremeni. `0000-template.md` ostane namenska predloga in ne šteje kot odločitev.
