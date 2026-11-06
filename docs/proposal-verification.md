# Preverba predloga in meje dokazov

Datum: 2026-11-06. To je samopreverba Codexa, ne človeški pregled ali ocena »opravil«. Rezultati izvršljivih preverjanj so v CI pripadajočega PR; ukaz za lokalno ponovitev je `npm ci` in `npm run validate`.

## Rubrika: vse vrstice minimuma

| Kriterij | Dokaz v predlogu | Stanje |
|---|---|---|
| Problem/uporabniki | [Predlog](proposal.md): ena mala delavnica/laboratorij, okvara in sledljivost | Opisano; hipoteza, ne intervju |
| Najmanj dve vlogi | Admin/technician in matrika po operacijah | Opisano |
| ≥5 Must z MoSCoW | Sedem Must, štiri Should, Could/Won't in kriteriji za vse Must | Opisano; 11 issuejev |
| ≥3 entitete, 1:N in M:N | [ER](data-model.md): natanko pet, Assignment s časom/avtorjem | Opisano; Mermaid parser |
| Arhitektura/tehnologije | [Arhitektura](architecture.md) in [ADR 0001](decisions/0001-stack.md), tri resne možnosti | Opisano; Mermaid parser |
| Mobilno/LLM/agent | QR + mobilni list/create/edit, ločen strukturiran klic, agent prek API s potrditvijo | Opisano, še ni implementirano |
| Načrt/backlog | Must → midterm, Should → final, tveganja/ure in razdelitev | Dejanski issueji in milestones na GitHub |
| PR in člana | PR nosilca računa; drugi račun preverjen | Lasten commit in celoten pregled drugega člana še potrebna; ne ponarejamo |

## Dodatno usklajevanje s končnimi zahtevami

- CRUD za dva vira: Asset in Ticket; Ticket DELETE je logični umik brez izgube zgodovine.
- PostgreSQL, migracije, seed, plasti, DTO, ostranjevanje, validacija in RFC 9457 so načrtovani.
- Pravice na strežniku, JWT, HTTPS, CORS in skrivnosti so opisani.
- Midterm vključuje Docker, CI build/test, poslovne enotske in ≥3 API integracijske teste. Trenutni CI preverja samo dokumentacijo.
- Final vključuje Android prek nameščenega API, preverjen LLM, agent, upravljano bazo, javni splet/API, avtomatizacijo iz main, health in logs.
- Štirje vsebinski ADR so končna zahteva; ta mejnik vsebuje zahtevanega 0001 in ohranjeno predlogo 0000.

## Izvedljiva validacija

`npm run validate` uporablja zaklenjeni Redocly CLI za OpenAPI 3.1 in reference, Mermaid parser za vse diagrame ter lokalni validator za povezave, pet entitet, enajst zgodb, statusne enum, zaprte DTO in strukturo CRUD/potrditve. `git diff --check` preveri format razlik. GitHub issueji/milestones in remote push se preverijo ločeno z avtenticiranim GitHub CLI.

Ne trdimo, da parser pomeni vizualni render diagrama, da lint pomeni delujoč strežnik ali da samopregled pomeni človeško odobritev. Izvedljivi testi aplikacije ne obstajajo, ker ta naloga izrecno ne implementira aplikacije.

## Preostali človeški koraki

1. Oba člana razumeta in pregledata celoten predlog, potrdita razdelitev ter opravita resnične lastne prispevke. Prvotna predloga je imela samo začetni commit; prispevkov sočlana ne ustvarja avtomatizacija pod njegovim imenom.
2. Zahtevati dejanski pregled od sočlana; če GitHub zavrne, urediti sodelovanje/dostop. Sočlanov račun je @amarkrasniqi54321-ctrl. Uporabniško ime učnega asistenta ni bilo podano, zato se ga ne ugiba.
3. Preveriti dodatni AI-POLICY.md v gradivih, dostopnih ekipi; javni poskusi so vrnili 404. [Dnevnik UI](ai-usage-log.md) to izrecno pove.
4. Oba člana oddasta `https://github.com/is-fri-2026/fieldops-is` v pravilno Moodle nalogo, če oddaje ni mogoče dejansko preveriti v avtenticirani seji. GitHub ni potrdilo Moodle oddaje.
5. Po dejanski odobritvi asistenta ekipa združi in označi predlog skladno z navodili predmeta. Ta naloga PR ne združi.
