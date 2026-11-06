# Agent za potrjeno dodelitev tehnika

**Status: specifikacija S3, implementacija in evalvacija še nista opravljeni.** Admin prosi agenta, naj prek REST prebere prijavo in obremenitve tehnikov, priporoči aktivnega kandidata ter ga šele po izrecni potrditvi dodeli.

## Izvajanje in orodja

Agent teče na strežniku v istem Next.js runtime, z omejeno function-calling zanko prek adapterja Gemini API. Model je iz `LLM_MODEL`, ključ samo na strežniku. To ni enkratni LLM predlog S2 in ne generičen chatbot. Klient ne pošlje lastnega system prompta ali poljubnega imena orodja.

| Orodje | Opis za model in argumenti | REST | Pisanje |
|---|---|---|---|
| `getTicket` | Preberi dovoljene podrobnosti in version za `ticketId: UUID` | GET `/api/tickets/{ticketId}` | Ne |
| `listTechnicians` | Vrni aktivne tehnike in število neumaknjenih OPEN/IN_PROGRESS dodelitev; `page`, `pageSize <= 100` | GET `/api/technicians?page=1&pageSize=100` | Ne |
| `assignTechnician` | Dodeli preverjeni `ticketId`, `technicianId`, `version`, `confirmationToken` | POST `/api/tickets/{ticketId}/assignments` | Da, samo ločeni potrditveni handler |

Vsako orodje pokliče isti REST API z **uporabnikovim JWT**, ne s servisnim admin ključem ali neposrednim SQL. Spletna ročna dodelitev uporablja isti endpoint in poslovno storitev. Backend preveri aktualno vlogo in aktivnost; tehnik ne more zagnati admin agenta.

## Potek in meja potrditve

1. Admin izbere Ticket in zažene POST `/api/agent/assignment-recommendations`.
2. Model prek orodij prebere Ticket in seznam tehnikov z obremenitvami. Za majhno ekipo zadostuje ena stran; če `total > 100`, strežnik ne sklepa iz delnega seznama: priporočilo zavrne s 409 in zahteva ročno izbiro. Ni neskončnega ostranjevanja.
3. Izbere aktivnega še nedodeljenega kandidata z najmanj aktivnimi dodelitvami; ob izenačenju stabilen ID. Strežnik preveri, da kandidat izvira iz orodnega odgovora, je pravilen in Ticket še dovoljuje dodelitev. Brez kandidata vrne 409; brez veljavnega modelskega izhoda 503.
4. Strežnik izda podpisan token: actorId, ticketId, technicianId, ticketVersion, random nonce, exp = zdaj + 5 min. UI pokaže ime kandidata, prijavo, razlago in gumba Potrdi/Zavrni. Odgovor modela ni potrditev. Do te točke ni domenskega pisanja.
5. Samo uporabnikov klik pošlje token na POST `/api/agent/assignment-confirmations`. Handler preveri podpis, TTL in identiteto. Model ni več potreben; pisalno orodje pokliče REST dodelitev z istim JWT in tokenom.
6. REST ponovno preveri vlogo/aktivnost, kandidata, Ticket/version in replay. Assignment, povečanje version in ASSIGNED dogodek z confirmationNonce nastanejo v eni transakciji. Prvi uspeh vrne 201. Isti že uporabljen veljaven token istega uporabnika vrne prvotni Assignment z 200, brez drugega dogodka. Podvojen ročni par ali zastarela nepotrjena version → 409.
7. Ob zavrnitvi uporabnika ni API za pisanje; token poteče. Ob spremembi Ticket ali kandidata se zahteva novo priporočilo. Tokena ne beležimo v logih.

Nonce je nullable UNIQUE polje v obstoječem TicketEvent, zato ni dodatne domenske entitete. JWT in podpis tokena se preverita pred idempotentnim branjem; pri prvem pisanju version in nonce v transakciji preprečita TOCTOU in dvojno izvedbo. Če uporabnik po novem priporočilu uporabi star token, ga zastarela version zavrne. Redni admin ročni zapis ostaja samostojno eksplicitno dejanje; model do njega nima neomejenega orodnega dostopa.

## Varovala – zahteve, ne že izvedene kljukice

- Uporabnikov JWT in aktualna vloga; allowlist samo treh imen in fiksni lokalni API base URL.
- Med priporočilom sta dovoljeni samo branji; pisanje omeji potrdilni handler, ne prompt.
- Zod za vse argumente in modelov strukturirani odgovor; ticket/candidate se ne vzameta iz prostega besedila.
- Največ **6 orodnih klicev**, **4 modelskih klicev**, **30 sekund** za priporočilo; ena potrjena dodelitev na token. Ni samodejnega retry mutacije.
- Opis Ticket je nezaupan podatek, ne navodilo. Prompt injection ne razširi pravic, orodij ali URL-jev.
- Provider dobi minimalne podatke: opis, ID in obremenitev; brez gesel, e-pošt ali tokenov. Orodja JWT dodajo zunaj prompta.
- Dnevniki: correlationId, zaporedje, ime orodja, rezultat/status in trajanje; brez surovih promptov ali poverilnic. Domenski uspeh v TicketEvent.
- 5 zahtev priporočila/minuto/admin; limit provider porabe in fallback na ročno dodelitev.

## Načrt evalvacije

| Scenarij | Pričakovano | Rezultat |
|---|---|---|
| Veljavna prijava, dva kandidata | Obe branji, preverjen najmanj obremenjen kandidat; brez zapisa pred klikom | Še ni izvedeno |
| Potrditev veljavnega priporočila | Ena dodelitev, ena povečana version, en ASSIGNED | Še ni izvedeno |
| Zavrni/zapri dialog | Ni zapisa | Še ni izvedeno |
| Technician kliče agent | 403, brez orodnega pisanja | Še ni izvedeno |
| Neaktiven kandidat ali ni kandidatov | 409 in ročna izbira, brez izmišljene osebe | Še ni izvedeno |
| Injection v opisu | Obravnavano kot podatek, brez novih orodij/URL | Še ni izvedeno |
| Poškodovan/potekel/tuji token | 422 za format, 403 za neveljavno vezavo/podpis/potek, brez zapisa | Še ni izvedeno |
| Dvakrat isti veljaven token | Prvotni rezultat 200, en zapis in dogodek | Še ni izvedeno |
| Sočasna sprememba Ticket | 409, novo priporočilo | Še ni izvedeno |
| >100 tehnikov, timeout ali neveljaven modelov JSON | 409 za obseg, 503 za model; jasna napaka, brez pisanja | Še ni izvedeno |

Automatizirane scenarije izvedemo z mock modelom in resničnimi API storitvami na testni bazi; preverimo tudi dejanski klic orodij. Živo evalvacijo opravimo z anonimiziranimi podatki in zabeležimo dejanski datum/model/rezultat pri final.
