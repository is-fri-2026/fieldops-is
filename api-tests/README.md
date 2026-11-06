# Načrt testov API

API še ni implementiran; ta mapa ohranja mesto iz uradne predloge. Trenutni izvedljivi pregled je `npm run validate`, ki preveri pogodbo in dokumentacijo, ne HTTP implementacije.

Do `midterm` bodo dodani avtomatizirani integracijski testi na ločeni PostgreSQL bazi:

1. Prijava aktivnega računa → JWT; napačno geslo 401; technician na admin operaciji 403; brez JWT 401.
2. Asset create/read/update/delete → 201/200/200/204; duplicate inventoryCode 409; izbris z vezanim Ticket 409; manjkajoč Asset 404.
3. Ticket create → Assignment → IN_PROGRESS → RESOLVED → časovnica; preveriti dogodke, nedodeljenega tehnika 403, preskok/zastarelo version 409 ter nedovoljen vhod 422.
4. Filtriranje/pagination ne razkrijeta tujih prijav ali total; rollback ob napaki dogodka; sočasna sprememba uspe največ enkrat.
5. Logični umik OPEN brez dodelitev → GET 404, admin zgodovina ostane; ni fizičnega izbrisa dogodkov.

Do `final`: mock LLM veljaven/neveljaven izhod, timeout; agent dejansko prebere prek orodij, pred potrditvijo nič ne zapiše, preveri TTL/identiteto/version in replay. Testi ne uporabljajo plačljivih modelskih klicev. Ročni `.http` primeri bodo uporabljali okoljske žetone, nikoli commitanih poverilnic.
