# FA-PLATTFORM-02B · Bericht · Partnergewinnung: die vier Unterseiten im Admin pflegbar

Stand 2026-11-16 · Stufe 2 · Anforderung FA-22-36 · kein git, kein Server, keine Formularsendung, kein neues Datenschema.

## GEÄNDERTE DATEIEN
- `src/lib/partner/gewinnung.ts`: neu `GewinnungPflege`, `gewinnungRoute()`, `gewinnungSeiteMitPflege()` (Rückfall-Logik). Die Seitentexte selbst sind unverändert.
- `src/app/(site)/partner-werden/auftraege-erhalten/page.tsx`, `.../netzwerk-deutschland/page.tsx`, `.../kfz-betriebe/page.tsx`, `.../kooperation/page.tsx`: von festem `metadata` auf `generateMetadata` und `getPageContent(ROUTE)` umgestellt.
- `content/seo.json`: vier neue Einträge direkt nach `partner-werden` (nur additiv).
- `src/lib/data/defaults/content.ts`: dieselben vier Einträge wortgleich im JSON-Rückfall `pages()` (nur additiv).
- `src/lib/data/seo-laengen.test.ts`: neuer Test zum Gleichlauf (Modell A) und Test je Zahlweg über `gewinnungSeiteMitPflege`, Dublettenprüfung angepasst (siehe unten).
- `src/lib/partner/gewinnung.test.ts`: vier neue Tests zur Pflege.
- `docs/betrieb/admin-alltag.md`: neuer Unterabschnitt „Partner und Partnerseiten“ unter „7. Text einer Seite ändern“.
- dieser Bericht.

## WAS UND WARUM
- **Muster wie `/partner-werden`:** Jede der vier Seiten liest ihren Eintrag aus der Sammlung Seiten. Die Route ist der Pfad ohne führenden Schrägstrich, also z. B. `partner-werden/kfz-betriebe`. Titel und Beschreibung für Suchmaschinen kommen aus `generateMetadata`. Das Canonical bleibt fest `SEITE.pfad`. Ohne Eintrag gilt der Text aus `gewinnung.ts`.
- **Feldzuordnung (Entscheidung):** `headline` ist die Überschrift, `intro` (im Admin „Einleitung“) die Einleitung, also der Text unter der Überschrift. `subline` (im Admin „Unterzeile“) ist der Kurztext, `seo.title` und `seo.description` sind die Suchtexte. Die Namen „Einleitung“ und „Kurztext“ folgen den Feldern in `gewinnung.ts` (`einleitung`, `kurztext`), wie es die Paketdatei verlangt.
- **Leerer Wert:** Ein leerer Wert, einer aus Leerzeichen, `null` oder ein fehlender Wert löscht den Rückfall nicht. Gepflegte Werte werden getrimmt. Das ist anders als auf `/partner-werden`, wo `??` einen leeren Text durchlässt; das Paket verlangt hier ausdrücklich, dass leer nicht löscht.
- **Zahlweg (G9):** Kurztext und Beschreibung von „Aufträge erhalten“ hängen vom Zahlweg ab (`ZAHLWEG.A` und `.B`). Seed und Rückfall tragen den Wortlaut von Modell A, das heute gilt. Steht in der Sammlung noch der unveränderte Text eines der beiden Modelle, zeigt die Seite den Text des aktiven Modells. So stehen nach einem Wechsel von `PARTNERMODELL_B` nie zwei Zahlwege zugleich. Selbst gepflegte Texte bleiben stehen; die Betreiberanleitung weist auf die Prüfung von Hand bei einem Wechsel hin.
- **Im Code geblieben:** Abschnitte, Ablauf, Klarstellung „Nur Autoschlüssel und Fahrzeugschlüssel“, neun Leistungen (`leistungen.ts`), Qualitätsstandard, Bundesländer, nächster Schritt, Augenbraue, Kurzname und Pfad. `gewinnungSeiteMitPflege` ersetzt nur die fünf Textfelder; der Test sichert, dass Abschnitte und nächster Schritt dieselben Objekte bleiben.
- **Einträge ohne eigene Verweise:** `internalLinks` ist leer, weil die Seiten sich über `gewinnung.ts` gegenseitig verlinken. Gepflegte Verweise würden über `verweise.ts` Rückverweise auf anderen Seiten erzeugen. `noindex` wird nicht gesetzt.
- **Rückfall wortgleich (G6):** Der neue Test in `seo-laengen.test.ts` prüft für jede Partnerseite, dass `content/seo.json` und `pages()` Titel, Beschreibung, Überschrift, Kurztext und Einleitung genau wie `gewinnung.ts` tragen und nicht auf noindex stehen. Die Prüfung „kein Titel und keine Beschreibung doppelt über alle Seiten beider Teile“ zählt Partnerseiten, die schon in `content/seo.json` stehen, nicht zusätzlich aus `GEWINNUNG_SEITEN`. Sonst wären sie doppelt gezählt. Die Prüfung ist dadurch nicht gelockert (G8): Längen- und Zusagenregeln greifen weiter über `eintraege` und `Partnerseite %s: Suchtexte in den Grenzen`.
- **Seed:** Der Seed gleicht die Sammlung `seiten` über `route` mit `content/seo.json` ab (`src/payload/seed.ts:662-677`, nicht geändert). Die vier Einträge erscheinen danach im Admin unter Inhalte, Seitentexte. Sitemap: `eigeneSeiteAdresse` nimmt Adressen mit Schrägstrich nicht auf, also gibt es keinen doppelten Sitemap-Eintrag. Die vier Pfade bekommen jetzt `lastModified` aus der Sammlung.
- **Öffentliche Partnerprofile:** nicht gebaut (MA-54, Zustimmung fehlt). Das steht auch in der Anleitung.
- **G12:** `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` gelesen. `generateMetadata` liest dieselben gecachten Daten wie die Seite, `alternates.canonical` wie bisher.

## GEMEINSAME DATEIEN (gewünschte Änderungen, nicht in meinen Schreibrechten)
1. `src/components/partner/gewinnung-seite.tsx`: Die Verweisliste „weitere Partnerseiten“ (`weitereGewinnungSeiten`) liest heute den Kurztext aus dem Code. Damit der gepflegte Kurztext (`subline`) sichtbar wird, müsste die Seite die Kurztexte der drei anderen Einträge aus der Sammlung mitgeben. Mein Vorschlag: eine optionale Prop `weitere?: GewinnungSeite[]`, die jede Unterseite mit `gewinnungSeiteMitPflege` je Route füllt.
2. `src/app/(site)/partner-werden/page.tsx`, Abschnitt 04 „Alles zum Partnernetz“: dieselbe Umstellung für `GEWINNUNG_SEITEN.map(… seite.kurztext)`.
3. `src/app/llms.txt/route.ts:58`: Die Unterliste unter „Partner werden“ nimmt `kurzname` und `kurztext` aus `GEWINNUNG_SEITEN`. Bei der Umstellung den Kurztext dort ebenfalls je Route über `getPageContent` und `gewinnungSeiteMitPflege` lesen.

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run`: 249 Testdateien, 3933 Tests bestanden, 0 Fehler.
- `sicher.sh -- npm run typecheck` (`tsc --noEmit`): Exit 0, ohne Fehler.
- `sicher.sh -- npm run lint` (`eslint .`): Exit 0, ohne Fehler und Warnungen.
- `sicher.sh --json -- npm run build`: Exit 0. Die vier Seiten werden weiter statisch erzeugt (○). Die gebaute `.next/server/app/partner-werden/kfz-betriebe.html` hat `<title>Kfz-Schlüssel-Partner für Werkstätten | SCHLÜSSELMACHER24</title>` und die Überschrift im Wortlaut. Keine Wiederholung wegen FA-PLATTFORM-03 nötig.

## BELEGE
- Muster: `src/app/(site)/partner-werden/page.tsx:31-40` (`getPageContent(ROUTE)` mit Rückfall).
- Admin-Felder: `src/payload/collections/Seiten.ts:41-43` (Überschrift, Unterzeile, Einleitung). Die Route ist nach dem Anlegen fest (`:31-32`). Nach jeder Änderung erneuert der Hook `erneuernHooks` alle Seiten (`src/payload/hooks/revalidate.ts`).
- Seed-Abgleich: `src/payload/seed.ts:662-677`.
- Tests: `src/lib/partner/gewinnung.test.ts` („Partnergewinnung: Pflege im Admin“: Route und Quelltext, gepflegt ersetzt, leer löscht nicht, Zahlweg folgt dem Schalter) und `src/lib/data/seo-laengen.test.ts` („Partnerseite %s: content/seo.json und pages() tragen …“). Die vorhandenen Tests zu Canonical, Zahlweg, Waisen, Verweisen und Sitemap bleiben grün.

## NACHBESSERUNG (nach Gegenprüfung, 2026-11-16)
1. **[rot] Anleitung zu Verweisen und noindex – behoben.** Zutreffend: `quellenAusSeiten` (`src/components/seo/verweise.ts:90-94`) macht aus `seo.interneLinks` der vier Einträge Rückverweise im Block „Passt dazu“ der verlinkten Seiten und filtert noindex-Einträge heraus; die Sitemap nimmt Routen mit Schrägstrich ohnehin nicht auf. `docs/betrieb/admin-alltag.md` sagt jetzt: Abschnitte, Fragen und Vorschaubild erscheinen nicht; **Verwandte Seiten** bitte leer lassen, weil ein Eintrag als Rückverweis auf der verlinkten Seite erscheint; den Haken **Nicht in Suchmaschinen aufnehmen** bitte nicht setzen, weil er die Partnerseite selbst nicht aus den Suchmaschinen nimmt, sondern nur aus diesen Rückverweisen.
2. **[gelb] llms.txt liest den Kurztext aus dem Code – behoben im Bericht.** Zutreffend (`src/app/llms.txt/route.ts:58`). Die Datei liegt nicht in den Schreibrechten; sie steht jetzt als GEMEINSAME DATEIEN 3, OFFENE FRAGE 1 nennt sie und empfiehlt die Kennzeichnung „noch ohne Wirkung“; die Anleitung nennt `/llms.txt` ebenfalls.
3. **[gelb] Feldnamen wie am Bildschirm – behoben.** Zutreffend (`src/payload/fields/gemeinsam.ts:190-216`): Die Anleitung sagt jetzt **Seitentitel** und **Beschreibung** im Bereich **Suchmaschinen** und **Verwandte Seiten**.
4. **[gelb] Gleichlauf-Test hängt am Schalter – behoben.** Zutreffend: Der Test verglich mit `GEWINNUNG_SEITEN` (aktiver Zahlweg). Er vergleicht Seed und Rückfall jetzt mit `gewinnungSeitenFuer('A')`. Neu: Für Modell A und B prüft ein Test je Partnerseite, dass `gewinnungSeiteMitPflege` mit dem Eintrag aus `content/seo.json` und `pages()` genau die Texte des jeweiligen Modells liefert. Mit `PARTNERMODELL_B=aktiv` ist `seo-laengen.test.ts` jetzt grün (545 Tests); unter B scheitert weiterhin nur der ältere, nicht von diesem Paket stammende Test „nimmt ohne Schalter Modell A“ in `gewinnung.test.ts`.
5. **[gelb] derselbe Befund wie 4 – behoben** mit derselben Änderung (Variante `gewinnungSeitenFuer('A')` plus Fall Modell B über `gewinnungSeiteMitPflege`, ohne `vi.stubEnv`).
6. **[gelb] Unterzeile ohne Wirkung – behoben, soweit in den Schreibrechten.** Zutreffend. OFFENE FRAGE 1 geht ausdrücklich an den Inhaber, mit Empfehlung (eigenes Paket für die drei Stellen, bis dahin Hinweis in der Anleitung, Feldbeschreibung im Admin sobald Payload-Code frei ist). Die Anleitung bittet jetzt, das Feld unverändert zu lassen. Payload-Code (`src/payload/**`) bleibt unberührt (Hinweis FA-PLATTFORM-03).

Prüfung nach der Nachbesserung: `sicher.sh --json -- npx vitest run` 249 Dateien, 3941 Tests bestanden, 0 Fehler · `npm run typecheck` Exit 0 (ein Zwischenlauf zeigte Fehler nur in `scripts/orte-import.test.ts` aus dem parallelen FA-PLATTFORM-03; Wiederholung ohne Fehler) · `npm run lint` Exit 0 · `sicher.sh --json -- npm run build` erfolgreich.

## OFFENE FRAGEN
1. **Kurztext ohne Wirkung (Inhaber entscheidet):** Die Unterzeile (Kurztext) ist gepflegt und im Admin sichtbar, wirkt aber erst, wenn GEMEINSAME DATEIEN 1 bis 3 umgesetzt sind (Verweislisten der Partnerseiten, Hauptseite, `/llms.txt`). Empfehlung: die drei Stellen in einem eigenen Paket umstellen; bis dahin sagt die Anleitung „wirkt heute noch nirgends, bitte unverändert lassen“, und sobald Payload-Code wieder freigegeben ist, bekommt das Feld im Admin eine kurze Beschreibung „noch ohne Wirkung“. Alternative: die Unterzeile bis dahin nicht als pflegbar anbieten. Bitte entscheiden.
2. **Ein Absatz unter der Einleitung:** Auf `/partner-werden` ist `subline` die Zeile unter der Überschrift und `intro` ein Absatz darunter. Auf den vier Unterseiten gibt es nur einen solchen Text (`einleitung`), den ich `intro` zugeordnet habe. Ein zusätzlicher frei pflegbarer Absatz bräuchte eine Änderung an `gewinnung-seite.tsx`. Das liegt nicht in meinen Schreibrechten und war nicht verlangt.
3. **Gepflegte Zahlwegtexte bei einem Wechsel:** Hat das Team Kurztext oder Beschreibung von „Aufträge erhalten“ selbst geändert, folgen sie einem Wechsel auf Modell B nicht von selbst. Soll das gesperrt oder im Admin gewarnt werden? Das ginge nur mit einem Hook oder Feld und damit mit Schema- bzw. Payload-Code. Nicht gebaut.

## FÜR MENSCHEN
- Inhaber: Die Texte der vier Partnerseiten sind jetzt im Admin pflegbar. Ihre Freigabe der Texte (offen aus FA-PLATTFORM-02, OFFENE FRAGE 2) gilt weiter. Neue Texte bitte ohne Provisionssätze, Fristen oder Zusagen über den Partnervertrag hinaus (R4, R10).
- Betrieb: Nach dem nächsten Seed erscheinen die vier Einträge unter Inhalte, Seitentexte. Die Anleitung steht in `docs/betrieb/admin-alltag.md` unter „Partner und Partnerseiten“.
- Öffentliche Partnerprofile erst nach Entscheidung und Zustimmung der Partner (MA-54).
