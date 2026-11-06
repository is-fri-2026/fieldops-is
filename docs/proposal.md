# Predlog projekta: FieldOps

**Informacijski sistemi, UL FRI, 2026/27 · 6. november 2026 · status: predlog za pregled.** Dokument opisuje načrtovane funkcije; aplikacija še ni implementirana. Rok iz uporabnikovega briefa: 6. 11. 2026 ob 23:59 Europe/Ljubljana; uradni portal določa oddajo do konca vaj v 4. tednu. Termina ne predstavljamo kot neodvisno preverjenega Moodle roka.

## Problem in ciljni uporabniki

V majhni delavnici ali laboratoriju se okvare pogosto prijavijo ustno, po sporočilih ali v preglednici. Tehnik ob napravi težko ugotovi, ali je okvara že prijavljena; vodja ne vidi zanesljivo, kdo jo obravnava, spremembe pa nimajo povezane zgodovine. FieldOps poveže napravo, prijavo, odgovorne tehnike in časovnico, da vsaka okvara dobi sledljivo obravnavo od OPEN do RESOLVED.

Ciljamo na eno manjšo ekipo z nekaj deset napravami in nekaj tehniki, ne na več podjetij. Preglednica pomaga pri inventarju, vendar sama ne uveljavlja pravic, dovoljenih prehodov ali transakcijske zgodovine; sporočila teh povezav ne ohranijo. Obsežen CMMS bi za ta študentski primer dodal nepotrebne urnike, nabavo in integracije. Potrebe so projektna hipoteza iz briefa, ne izmišljena uporabniška raziskava ali že potrjeno poslovno povpraševanje.

## Uporabniki, vloge in pravice

| Dejanje | admin – vodja vzdrževanja | technician – izvajalec |
|---|---|---|
| Prijava, ogled opreme | Da | Da |
| Ustvari/uredi/izbriši opremo | Da; izbris brez prijav | Ne |
| Ustvari prijavo okvare | Ne v MVP; upravlja že ustvarjene | Da, avtor iz JWT |
| Seznam in podrobnosti prijav | Vse neumaknjene | Lastne ustvarjene ali dodeljene |
| Uredi naslov/opis/prioriteto/kategorijo | Odprte prijave | Lastne odprte prijave |
| Umakni prijavo (DELETE) | Samo OPEN brez dodelitev | Ne |
| Dodeli tehnika | Aktivni technician; prijava OPEN/IN_PROGRESS | Ne |
| Spremeni status | Ne; admin ni obvoz tega pravila | Samo dodeljene: OPEN → IN_PROGRESS → RESOLVED |
| Zgodovina | Vse, tudi umaknjene | Samo dovoljene neumaknjene prijave |
| Strukturirani LLM predlog | Ne | Da, vedno ročno preveri |
| Agentovo priporočilo/potrditev | Da | Ne |

En račun ima eno vlogo. Pravila veljajo na API pri vsakem klicu in niso odvisna od skritih gumbov. Tuji Ticket GET se skrije z 404; prepovedan znan zapis vrne 403. Računi so pripravljeni s seed; samoregistracija ni del MVP.

## Uporabniške zgodbe in MoSCoW

Vsaka zgodba ima dejanski issue, prioriteto in mejnik. [Kanonični backlog](backlog.json) vsebuje iste zgodbe in podrobne kriterije kot GitHub. Izrazi Should označujejo zaporedje po jedru; **Android, LLM, agent in oblak ostajajo obvezni za končni zagovor**, četudi jih za midterm še ni.

| ID | Uporabniška zgodba | MoSCoW | Mejnik | Issue |
|---|---|---|---|---|
| M1 | Kot tehnik ali skrbnik se želim varno prijaviti in odpreti svoje delovno okolje, da dostopam samo do dovoljenih podatkov in dejanj. | Must | midterm | [#1](https://github.com/is-fri-2026/fieldops-is/issues/1) |
| M2 | Kot skrbnik želim ustvariti, pregledati, urediti in izbrisati opremo, da tehniki prijavljajo okvare na pravilni napravi. | Must | midterm | [#2](https://github.com/is-fri-2026/fieldops-is/issues/2) |
| M3 | Kot tehnik želim prijaviti okvaro opreme in popraviti njeno odprto prijavo, da ekipa prejme uporaben opis težave. | Must | midterm | [#3](https://github.com/is-fri-2026/fieldops-is/issues/3) |
| M4 | Kot skrbnik želim pregledati vse prijave, kot tehnik pa svoje ustvarjene ali dodeljene prijave, da vem, katere okvare zahtevajo obravnavo. | Must | midterm | [#4](https://github.com/is-fri-2026/fieldops-is/issues/4) |
| M5 | Kot skrbnik želim prijavi dodeliti enega ali več aktivnih tehnikov, da je jasno, kdo je odgovoren za popravilo. | Must | midterm | [#5](https://github.com/is-fri-2026/fieldops-is/issues/5) |
| M6 | Kot dodeljeni tehnik želim označiti začetek in zaključek popravila, da ekipa pozna dejansko stanje okvare. | Must | midterm | [#6](https://github.com/is-fri-2026/fieldops-is/issues/6) |
| M7 | Kot skrbnik ali upravičeni tehnik želim videti časovno zgodovino prijave, da razumem, kdo je kaj spremenil in kdaj. | Must | midterm | [#7](https://github.com/is-fri-2026/fieldops-is/issues/7) |
| S1 | Kot tehnik želim ob napravi skenirati QR-kodo, pregledati opremo, prijaviti okvaro in urediti svojo odprto prijavo, da ne prepisujem oznake naprave. | Should | final | [#8](https://github.com/is-fri-2026/fieldops-is/issues/8) |
| S2 | Kot tehnik želim iz opisa okvare dobiti predlog naslova, prioritete in kategorije, da pripravim bolj jasno prijavo, ki jo pred oddajo sam preverim. | Should | final | [#9](https://github.com/is-fri-2026/fieldops-is/issues/9) |
| S3 | Kot skrbnik želim, da agent preveri prijavo in obremenitve tehnikov ter po moji izrecni potrditvi izvede dodelitev, da manj časa porabim za razporejanje. | Should | final | [#10](https://github.com/is-fri-2026/fieldops-is/issues/10) |
| S4 | Kot član ekipe želim iz main samodejno namestiti preverjeno različico na javni HTTPS naslov z upravljano bazo, da jo lahko uporabniki in ocenjevalec zanesljivo preizkusijo. | Should | final | [#11](https://github.com/is-fri-2026/fieldops-is/issues/11) |

**Could:** dodatna polirava prikaza filtrov/časovnice, samo če ostane čas; ne nova entiteta ali funkcionalni podsistem. **Won't:** IoT, napovedovanje okvar, chat, plačila, GPS, push, fotografije, zahtevni urniki, rezervni deli, nabava, integracije, več organizacij, samoregistracija, ponastavitev gesla, prerazporejanje in ponovno odpiranje RESOLVED. Ne dodajamo šestega domenskega objekta.

## Pogoji za sprejem vseh Must zgodb

Pogoji so načrt testov, ne rezultati opravljenih testov. Vse napake imajo `application/problem+json` po RFC 9457; neveljaven JSON 400, kršitev sheme 422.

### M1 – prijava in vloge

- **Given** aktiven račun in pravilno geslo, **When** uporabnik odda prijavo, **Then** prejme 30-minutni JWT in javni User DTO; splet pokaže delovno okolje vloge, brez passwordHash.
- **Given** napačno geslo/neaktiven račun, **When** se prijavi, **Then** prejme generičen 401; ponavljanje je omejeno s 429. **Given** manjka ali je potekel JWT, **When** kliče zaščiten API, **Then** prejme 401 brez spremembe podatkov.
- **Given** tehnik, **When** zahteva admin zapis, **Then** 403. Ob odjavi odjemalec odstrani JWT; že izdan JWT poteče po 30 minutah, brez refresh toka.

### M2 – oprema, celoten CRUD

- **Given** admin in nova veljavna inventoryCode, **When** ustvari napravo, **Then** 201 z Location; GET, seznam in sprememba imena/lokacije delujejo za dovoljeno vlogo, PATCH vrne 200.
- **Given** naprava brez prijav, **When** jo admin izbriše, **Then** 204 in naslednji GET 404.
- **Given** podvojena oznaka ali naprava s prijavami, **When** admin zahteva vnos/izbris, **Then** 409. Neveljaven vhod → 422; technician zapis → 403. Seznam podpira page in pageSize največ 100.

### M3 – prijava in popravljanje, celoten CRUD

- **Given** technician in obstoječa oprema, **When** odda naslov 3–120 in opis 10–2000 znakov, **Then** 201 z Location, Ticket OPEN/version 1 in CREATED dogodek v isti transakciji; reporterId je iz JWT, privzeta priority MEDIUM/category OTHER.
- **Given** avtor ali admin in OPEN, **When** z aktualno version popravi metapodatke, **Then** 200 in UPDATED dogodek. Avtorstvo, naprava in status niso del te spremembe.
- **Given** admin in OPEN brez dodelitev, **When** DELETE vsebuje aktualno version, **Then** 204, deletedAt in DELETED dogodek; redni GET 404, zgodovina za admin ostane.
- **Given** neobstoječa naprava, neveljaven opis, nedovoljen zapis, zastarela version ali dodeljena/začeta prijava za izbris, **When** zahteva doseže API, **Then** 404/422/403/409 brez delnega zapisa.

### M4 – dovoljeni seznami in podrobnosti

- **Given** admin oziroma technician, **When** odpre prijave, **Then** vidi vse neumaknjene oziroma samo svoje ustvarjene/dodeljene. Filtri status/assetId delujejo pred izračunom total; vrstni red createdAt DESC, id ASC.
- **Given** več strani, **When** uporabi page/pageSize, **Then** dobi items/total/page/pageSize brez uhajanja tujih podatkov; prazno stanje je jasno ločeno od nalaganja in napake.
- **Given** tuja/umaknjena prijava ali neveljaven filter, **When** zahteva podrobnosti/seznam, **Then** 404 oziroma 422; neprijavljen 401.

### M5 – dodelitev

- **Given** admin, OPEN/IN_PROGRESS in aktiven technician, **When** potrdi dodelitev z aktualno version, **Then** 201, Assignment z assignedById/assignedAt, povečana version in ASSIGNED dogodek v eni transakciji. Več različnih tehnikov je dovoljeno.
- **Given** isti par ticketId/technicianId, **When** se ponovi tudi sočasno, **Then** UNIQUE prepreči drugo dodelitev in ročni klic vrne 409.
- **Given** technician kot klicatelj ali kandidat admin/neaktiven oziroma RESOLVED prijava, **When** zahteva dodelitev, **Then** 403 oziroma 409, brez zapisa.

### M6 – status

- **Given** aktivni dodeljeni tehnik in OPEN, **When** zahteva IN_PROGRESS z aktualno version, **Then** 200 in STATUS_CHANGED; naslednji IN_PROGRESS → RESOLVED zapiše tudi resolvedAt.
- **Given** nedodeljen tehnik ali admin, **When** zahteva prehod, **Then** 403. **Given** preskok OPEN → RESOLVED, povratek, isti status ali zastarela version, **When** zahteva prehod, **Then** 409.
- **Given** sočasni zahtevi, **When** uporabita isto version, **Then** uspe največ ena, brez izgubljene spremembe ali dodatnega dogodka.

### M7 – zgodovina

- **Given** uspešno ustvarjanje/urejanje/dodelitev/status/umik, **When** transakcija uspe, **Then** obstaja natanko pripadajoči TicketEvent z actorId, časom in dovoljenimi starimi/novimi vrednostmi.
- **Given** dovoljen bralec, **When** odpre zgodovino, **Then** dobi ostranjene dogodke po createdAt ASC, id ASC; admin tudi po umiku.
- **Given** zavrnjena sprememba ali neuspešen zapis dogodka, **When** se operacija konča, **Then** ni niti spremembe niti uspešnega dogodka. Nedovoljen bralec → 404; urejanje/brisanje dogodkov ne obstaja.

## Mobilni primer uporabe

Tehnik stoji ob centrifugi/laboratorijski napravi. Na telefonu se prijavi, skenira QR z Asset UUID, dobi podrobnosti naprave in odda opis okvare. Telefon je smiseln zaradi kamere in neposredne uporabe ob napravi. V isti aplikaciji vidi seznam svojih/dodeljenih prijav, podrobnosti ter popravi lastno OPEN prijavo oziroma kot dodeljeni tehnik posodobi status. S tem mobilni del prek **nameščenega API izpiše, ustvari in ureja Ticket**, ne ostane pri skeniranju.

JWT je v SecureStore. Nalaganje, napačen QR, nedovoljena kamera, potek seje in offline imajo jasna stanja; ročni UUID je fallback. Offline ne ustvarjamo skrite čakalne vrste ali prikazujemo lažnega uspeha. QR vsebuje samo UUID, ne poljubnega URL-ja, gesla ali osebnih podatkov.

### S1 – pogoji za sprejem na Androidu

Pri mejniku `final` na telefonu z Androidom preverimo naslednje scenarije prek nameščenega API:

- **Izbira naprave.** Ko tehnik skenira UUID znane naprave, telefon pokaže njeno inventarno oznako in ime, da ju lahko primerja z nalepko. Če zavrne dostop do kamere, lahko isto napravo izbere z ročnim vnosom UUID. QR s spletnim naslovom se zavrne brez odpiranja povezave; pri neznanem UUID (404) oddaja za to napravo ni na voljo.
- **Oddaja in seznam.** Ko tehnik na izbrani napravi odda veljaven naslov in opis, se potrditev prikaže šele po odgovoru 201. Po ponovnem odprtju seznama vidi ustvarjeno prijavo v stanju OPEN in v podrobnostih isto napravo ter opis. Dodeljena prijava drugega avtorja je prav tako vidna, tuja nedodeljena prijava pa je izključena.
- **Urejanje in sočasnost.** Ko avtor popravi opis lastne OPEN prijave, po odgovoru 200 in osvežitvi vidi novi opis. Če je med urejanjem drug odjemalec spremenil prijavo, telefon ob 409 ponudi ponovni prikaz aktualnih podatkov. Stare spremembe ne pošlje znova samodejno.
- **Izguba povezave ali seje.** Če je telefon brez povezave pred oddajo, obrazec ohrani vnos in pokaže napako. Po vrnitvi povezave se zahteva pošlje šele ob ponovnem dotiku gumba za oddajo. Če API vrne 401 zaradi poteklega JWT, aplikacija odstrani žeton iz SecureStore in zahteva ponovno prijavo.

## Ločeni funkciji LLM in agenta

**S2 – en klic modela:** opis → `{ title, priority, category }`, priority LOW/MEDIUM/HIGH, category MECHANICAL/ELECTRICAL/SOFTWARE/OTHER. Rezultat se preveri z Zod, uporabnik ga pregleda. Ni orodij ali samodejnega Ticket zapisa; napačen JSON/timeout vrne 503, ročni vnos deluje.

**S3 – več korakov in potrditev:** »Za to prijavo prek API preberi podrobnosti in obremenitve aktivnih tehnikov, priporoči kandidata ter ga šele po moji izrecni potrditvi dodeli prek istega API.« Obvezna getTicket + listTechnicians; kandidat z najmanj aktivnimi dodelitvami, razlaga, vezani podpisani token 5 min. Ločena potrditev v UI sproži pisanje; backend ponovno preveri pravice, version, kandidata in replay. Največ 6 orodnih/4 modelskih klicev in 30 s za priporočilo. [Specifikacija agenta](agent.md) določa varovala in neizvedene evalvacijske scenarije.

## Načrt in razdelitev dela

| Faza | Rezultat in dokaz |
|---|---|
| Predlog, 3.–4. teden | Ta dokument, model, arhitektura, ADR, pogodba, 11 issuejev, PR; resnični skupni pregled še potreben |
| 5.–6. teden | Migracije/seed, avtentikacija, CRUD opreme/prijav, enotska pravila in začetni API testi |
| [midterm, 7. teden](https://github.com/is-fri-2026/fieldops-is/milestone/1) | M1–M7: delujoči glavni spletni poteki obeh vlog, REST/OpenAPI, vloge/pravice, zgodovina, ≥3 integracije, CI build/test in Docker; demonstracija na seed podatkih |
| 8.–9. teden | S4 namestitev in migracije, S1 Android z nameščenim API; dopolnitev ADR za auth/deploy/mobile |
| 10.–11. teden | S2 preverjen predlog, S3 prava orodna zanka s potrditvijo, mock testi in ročna evalvacija |
| [final, 12. teden](https://github.com/is-fri-2026/fieldops-is/milestone/2) | S1–S4, javni HTTPS splet/API in baza, CD iz main, health/logs, Android build, štirje vsebinski ADR, končni pregled in zagovor |

Koledarskih rokov midterm/final ne izmišljamo; nastavijo se po potrditvi urnika predmeta. Ocenjen skupni proračun je 12–16 ur/teden za ekipo, približno 108–144 ur; to je delovna ocena, ne potrjena razpoložljivost članov. Jedro približno 60 ur, Android 18, AI 18, oblak/dokazi 12, ostanek rezerva.

Predlagana delitev: @luka1222424 vodi model, API, transakcije, auth, teste in CI/CD; @amarkrasniqi54321-ctrl vodi splet, Android, UI potrditve ter odjemalske teste. Pri AI prvi pripravi adapter/orodja, drugi potrditev/oceno uporabnosti. Vsak PR pregleda drugi, oba morata razumeti celoten predlog. Delitev še zahteva dejansko skupno potrditev; avtomatizirani prispevki niso predstavljeni kot sočlanovi commiti.

## Tveganja in ukrepi

| Tveganje | Ukrep in preverba |
|---|---|
| Neznanje sklada ali premalo časa | Najprej M1–M3 vertikalni rez, tedenski pregled ur, brez novega obsega; ob težavah prej obvestilo asistentu |
| Nezdružljive knjižnice | Zaklenjene odvisnosti, preverjanje major različic pred uvedbo, najprej lokalni build in CI |
| Uhajanje podatkov/pravic | API matrika, filtriranje pred pagination, testi tuje prijave/role, brez mass assignment |
| Izguba sprememb/zgodovine | version, transakcije, UNIQUE, rollback in konkurentni integracijski testi |
| LLM si izmišlja/prekorači kvoto | Zaprti enum, Zod, ročni pregled, časovna/porabna omejitev, mock v CI in ročni fallback |
| Agent piše brez potrditve | Ločeni handler, podpisan vezan token, TTL, ponovno branje in nonce v transakciji; injection/replay testi |
| Mobilna kamera ali omrežje | Fizični Android test že pri 9. tednu; ročni UUID; jasen offline brez samodejnih dvojnih oddaj |
| Stroški ali izpad oblaka | Pred namestitvijo preveriti kvote/stroške, dodajalne migracije, health, logs in načrt obnove; brez izmišljenih brezplačnih paketov |
| Manjkajoči dejanski pregled/prispevki | Ne označimo opravljenega; drugi član prispeva svoj pregled in lasten commit, učni asistent odobri v PR |

## Viri in status oddaje

Uporabljeni so [uradna delavnica](https://is-professor.github.io/is-labs/sl/weeks/03-proposal/), [zahteve](https://is-professor.github.io/is-labs/sl/project/requirements/), [rubrika](https://is-professor.github.io/is-labs/sl/project/rubrics/proposal/), [API navodila](https://is-professor.github.io/is-labs/sl/weeks/04-api-design/) in [izvorna predloga](https://github.com/is-fri-2026/is-project-template). Matrika preverbe je v [poročilu](proposal-verification.md); uporaba Codexa v [dnevniku](ai-usage-log.md).

GitHub PR ni dokaz opravljenega predmeta. Zahtevana sta dejanski pregled/prispevek obeh članov in asistentova odobritev; ne mergeamo ali tagamo samodejno. V Moodle oba oddasta `https://github.com/is-fri-2026/fieldops-is` v »Predlog projekta – Project proposal«; dejanska oddaja mora biti posebej preverjena.
