# Dnevnik uporabe UI

| Datum | Kdo je naročil | Orodje | Naročilo in dejanska uporaba | Obravnava rezultata |
|---|---|---|---|---|
| 2026-11-06 | Nosilec računa @luka1222424 | Codex, aktivna seja | Iz briefa in uradne predloge pripraviti predlog FieldOps, pet entitet, zgodbe, arhitekturo, ADR, OpenAPI, issueje, milestones in PR; uporabnik poda sočlanov račun @amarkrasniqi54321-ctrl. | Besedilo pripravljeno z UI; sprejeto v predlog za pregled, ne predstavljeno kot študentski samostojni pregled. Člana ga morata še razumeti, preveriti in po potrebi spremeniti. |
| 2026-11-06 | Ista seja | Codex in deterministični validatorji | Primerjati brief z uradnimi zahtevami; odkrita zahteva CRUD dveh virov, mobilni list/create/edit, Docker, testi/CI in štirje ADR do final. | Vključeno v zgodbe in načrt; ločena notranja prioriteta Should od obveznosti predmeta. Zavržene možnosti dodatnih domen/servisov. |
| 2026-11-06 | Ista seja | Codex, GitHub CLI | Preverjanje repozitorija in računov, objava 11 zgodb in 2 mejnikov, priprava PR, lokalna preverba pogodb/diagramov. | Številke issuejev so vrnjene iz GitHub, ne izmišljene. Podatki o človeškem pregledu in Moodle se ne sklepajo iz uspeha avtomatizacije. |
| 2026-11-06 | Na zahtevo @amarkrasniqi54321-ctrl | Codex | Primerjava predloga z rubriko, zgodbo S1 in pogodbo API; priprava mobilnih pogojev za sprejem ter popravek povezav na skupni repozitorij. | Scenariji so načrt za končni mejnik. Prispevek je pripravljen s pomočjo UI; človeški pregled in preizkus na telefonu še čakata. |

## Viri in omejitve

Prebrani so uradna delavnica predloga, zahteve, rubrika, API navodila in dejanske datoteke predloge; povezave so v [predlogu](proposal.md). Tehnološki predlog je iz briefa; ne trdimo, da so bile preference ali izkušnje sočlana dodatno preverjene.

Predloga napotuje na `AI-POLICY.md` v repozitoriju gradiv. GitHub povezava na `is-fri-2026/is-labs` je v tej seji vrnila 404, poskusa javnega `AI-POLICY.md` na portalu prav tako. Ločenega dokumenta zato nismo prebrali in ne trdimo, da je njegova skladnost potrjena. Upoštevan je dostopni del navodil: zabeležiti pomembno uporabo UI, predlog razumeti in opraviti resnični skupni pregled. Člana naj preverita morebitna dodatna navodila v svojem dostopnem gradivu pred oddajo.

Ni bil izveden živ klic LLM, build aplikacije, uporabniški intervju ali živa agentova evalvacija. Prispevkov, človeških imen in pregledov ne pripisujemo brez dokaza. Preverba s strani istega Codexa je samopreverba, ne neodvisen pregled sočlana ali asistenta.

## Ugotovitve

UI pomaga pri usklajevanju petih entitet, DTO in pravic. Največje tveganje je navidezna dokončanost: dokumentacijski lint ne dokazuje delovanja API, objavljen PR pa ne opravljenega predmeta. Posebej sta potrebna človeško preverjanje razumljivosti in lasten prispevek obeh članov.
