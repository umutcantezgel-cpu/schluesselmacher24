# FA-PLATTFORM-03B (Teil B) · Ortsseiten am Stamm, Prioritätsorte im Admin, Veröffentlichung nur mit Substanz

Stand 16.11.2026. Grundlage: Teil A (Ortsstamm, abgenommen A-068), Paketdatei mit Zusätzen FA-09-04 und FA-AA-05. Keine neue Ortsseite geschrieben, kein git, kein Server, keine Netzabrufe.

## GEÄNDERTE DATEIEN

Neu:
- `src/lib/orte/ortsseiten.ts` (rein): Lage je Ortsseite, Reihenfolge, Kontaktweg, Partnerbezug, Zählung der Vorgänge, Zeilen der Prioritätsorte
- `src/lib/orte/ortsseiten.test.ts` (18 Tests)
- `src/app/(site)/standorte/quellenvermerk.tsx` (Baustein Quellenvermerk)
- `src/payload/components/Ortsseiten.tsx` (Admin über der Liste der Einsatzgebiete)
- `src/migrations/20261116_134901_ortsseiten_stamm.ts` und `.json`
- `src/app/sitemap-orte.test.ts` (Wetzlar mit echten Inhalten, 2 Tests)
- `src/payload/ortsseiten.db.test.ts` (4 Datenbanktests)
- `docs/betrieb/orte-pflegen.md`

Geändert:
- `src/payload/collections/Einsatzgebiete.ts` (Felder, Hook Stufe, Admin-Baustein)
- `src/lib/types.ts` (CityPage um sieben Felder und `lage`, Typ `OrtsseitenLage`)
- `src/lib/rechtliches/indexierung.ts` (Substanzregel, `stadtIndexierbar` erweitert)
- `src/lib/data/index.ts` (`getCities` mit Lage und Reihenfolge), `src/lib/data/payload-mapping.ts` (Mapping der neuen Felder)
- `src/lib/orte/stamm.ts` (ergänzt: `ortsseitenAnreichern`, `gemeindenMitPartnerAbfragen`), `src/lib/orte/dateien.ts` (ergänzt: `prioritaetLesen`)
- `src/app/(site)/standorte/page.tsx`, `src/app/(site)/standorte/[city]/page.tsx`, `src/app/sitemap.ts` (Kommentar)
- `src/components/seo/json-ld.tsx` (nur `serviceAreaSchema`)
- `content/cities.json` (nur `"gemeindeschluessel": "06532023"` bei Wetzlar)
- `src/payload/seed.ts` (nur Plan Einsatzgebiete: Abgleich `gemeindeschluessel` mit `leerErgaenzen`)
- `src/migrations/index.ts`, `src/payload-types.ts` (erzeugt, nur Zusätze)
- `src/app/(payload)/admin/importMap.js` (erzeugt mit `payload generate:importmap`, eine Zeile Import und ein Eintrag; nötig, damit der Admin-Baustein lädt; nicht ausdrücklich in den Schreibrechten, siehe Offene Frage 6)
- Tests: `src/app/sitemap.test.ts`, `src/components/seo/verweise.test.ts`, `src/components/seo/json-ld.test.ts`, `src/lib/orte/grenze.test.ts` (`ortsseiten.ts` in die Liste der reinen Module)

## WAS UND WARUM

1. Ortsseiten am Stamm (Punkt 1). `Einsatzgebiete` hat einen aufklappbaren Abschnitt „Ortsstamm und Veröffentlichung“: Gemeindeschlüssel (Text, acht Ziffern, eindeutig), Priorität (Zahl, leer erlaubt), Stufe „in Anhang A“ (nur lesbar, setzt ein `beforeChange`-Hook aus `content/orte/prioritaet.json` über `prioritaetLesen`, das auch unter `payload run` läuft), Suchvolumen und Fahrzeit (leer, pflegbar, Hinweis „nur belegte Zahl“, R4), Partnerregion (Beziehung auf Partnerbetriebe, mehrere, leer erlaubt), Konkrete Verfügbarkeit (Text). Landkreis, Postleitzahlen und Koordinaten werden nicht gespeichert, sondern beim Lesen aus dem Stamm geholt (eine Quelle, keine Doppelpflege). Wetzlar verweist in `content/cities.json` auf 06532023; der Seed ergänzt den Schlüssel bei bestehenden Datenbanken nur, wo er leer ist.
2. Lage beim Lesen. `getCities()` liefert jede veröffentlichte Ortsseite mit `lage` (Gemeinde, Kreis, Land, Postleitzahlen, Koordinaten, Werkstatt im Ort oder Kreis, Partner deckt ab, Verfügbarkeit eingetragen, wirksame Priorität, Gründe gegen die Indexierung), je Anfrage einmal (React `cache`). Der Stamm wird per dynamischem Import aus `stamm.ts` (server-only) geladen, weil `stamm.ts` selbst `getSettings` aus der Datenschicht liest. Werkstatt: Postleitzahl der Werkstattadresse aus den Einstellungen, sonst Firmensitz (heute 35576), über den Stamm auf Gemeinden und Kreise abgebildet. Partner: `deckendePartner` aus `src/lib/partner/region.ts` mit dem Sammelwert für Autoschlüssel über alle Postleitzahlen der Gemeinde, Partnerliste aus `partnerFuerAbdeckung` (nur freigeschaltet, nur Stand, Muster, Auftragsarten). Ist der Stamm nicht lesbar, bleiben alle Ortsseiten erreichbar, aber noindex mit Grund (Log `[orte]`).
3. Veröffentlichung nur mit Substanz (Punkt 3). `ortsseiteGruende` in `indexierung.ts` sammelt die Gründe: noindex im Admin; Platzhalter; Einleitung kürzer als 160 Zeichen (`EINLEITUNG_MINDESTLAENGE`); Einleitung gleich einer anderen Ortsseite (paarweise, beide Ortsnamen ersetzt, klein, ohne Satzzeichen; so fallen Kopien mit getauschtem Ortsnamen auf, und beide Seiten bleiben draußen); kein Leistungsweg (Werkstatt nicht im Ort oder Landkreis, kein freigeschalteter Partner, keine Verfügbarkeit von mindestens 20 Zeichen ohne Platzhalter). `stadtIndexierbar` verlangt jetzt zusätzlich eine berechnete Lage ohne Gründe; ohne Lage ist keine Ortsseite indexierbar. Damit gilt die Regel überall, wo `stadtIndexierbar` schon stand: Metadaten der Ortsseite, `/standorte`, Sitemap, Vor-Ort-Seite, Werkstatt-Verweis der Modellseiten, „Passt dazu“.
4. Verknüpfung auf der Ortsseite (Punkt 4). Neuer Abschnitt „Region“: Kreis mit Art („Landkreis Lahn-Dill-Kreis“, bei kreisfreien Städten „Kreisfreie Stadt“ ohne „, Stadt“), Postleitzahlen (nur wenn der Stamm welche führt; Wesertal und Oberzent zeigen den Teil nicht), eingetragene Verfügbarkeit (sichtbar, weil sie als Leistungsweg zählt), Partnerbezug „In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner.“ nur bei abdeckendem Partner, ohne Namen. Kontaktweg je Lage (`kontaktweg`): „Termin in der Werkstatt“ (Werkstatt im Ort oder Kreis und Autoschlüssel angeboten), „Termin bei einem Partner anfragen“ (nur mit `PARTNERMODELL_B=aktiv` und Partner), sonst „Anfrage stellen“ (`/service-und-termin/anfrage`). Der bisher feste Knopf „Autoschlüssel-Termin“ ist damit abgelöst. Leistungen und Erreichbarkeit bleiben wie im Bestand (R9, Baustein `Erreichbarkeit` unverändert). Abschnittsnummern laufen jetzt mit.
5. Strukturdaten (R8). `serviceAreaSchema` nennt den Kreis als `AdministrativeArea` zwischen Stadt und Land nur, wenn die Lage einen Kreis hat; genau dann zeigt die Seite ihn (dieselbe Anzeige `kreisAnzeige`). Postleitzahlen und Partner stehen nicht in den Strukturdaten.
6. Quellenvermerk (Punkt 5). Baustein `Quellenvermerk` aus `ORTSSTAMM_QUELLEN` mit Link auf die Quelle und bei GeoNames auf die Lizenz, in `text-caption` (14 px). Auf `/standorte` immer, im Fuß der Ortsseite, sobald sie Daten aus dem Stamm zeigt (GeoNames nur mit Postleitzahlen).
7. Reihenfolge (FA-09-04). `getCities` ordnet nach wirksamer Priorität aufsteigend (gepflegte Zahl, sonst Rang aus Anhang A, sonst hinten), dann nach Name (deutsch). `/standorte` und die Vor-Ort-Seite lesen beide über `getCities`, die Vor-Ort-Seite ist deshalb nicht geändert.
8. Admin (Punkt 2, FA-AA-05). Über der Liste der Einsatzgebiete (`beforeListTable`, nur Inhaber und Mitarbeiter): Tabelle „Veröffentlichung der Ortsseiten“ (Ort, Gemeindeschlüssel oder „nicht im Stamm“, Landkreis, Priorität, in Suchmaschinen ja oder nein, Grund; Entwürfe mit „Entwurf“) und aufklappbar „Prioritätsorte des Inhabers“: Land, Rang, Ort, Seite vorhanden, veröffentlicht, Partner vorhanden, Vorgänge der letzten zwölf Monate. Die Zählung (`vorgaengeJeGemeinde`) läuft über `kontakt.plz` des Vorgangs und die Postleitzahl-Abfrage des Stamms; eine Postleitzahl mit mehreren Gemeinden zählt bei jeder, eine unbekannte (Großempfänger) nirgends. Amberg erscheint als „offen, bitte bestätigen“ mit beiden Kandidaten; nichts wird zugeordnet. Aus der Liste entsteht keine Seite.
9. Build (Punkt 6). `generateStaticParams` und Sitemap gehen nur über veröffentlichte Einsatzgebiete, nie über Gemeinden des Stamms (Test „die Sitemap nennt keine Gemeinde des Stamms ohne Ortsseite“).
10. Migration `ortsseiten_stamm`: Das erzeugte `up` enthält nur dieses Paket (sechs Spalten in `einsatzgebiete` und `_einsatzgebiete_v`, Tabellen `einsatzgebiete_rels` und `_einsatzgebiete_v_rels` für die Partnerregion, Fremdschlüssel, Indizes, eindeutiger Index auf `gemeindeschluessel`). Nichts Fremdes, nur additiv (G6). `down` neu geordnet wie in Teil A: zuerst Fremdschlüssel, Indizes und Spalten mit `IF EXISTS`, dann die Tabellen mit `IF EXISTS`. JSON-Fallback: die Felder stehen optional in `CityPage`, `content/cities.json` trägt den Schlüssel.
11. Betreiberanleitung `docs/betrieb/orte-pflegen.md`: Ortsseite aus dem Stamm anlegen, Regel für die Veröffentlichung mit Grundanzeige, Partnerregion zuordnen, Prioritätsorte, Stamm aktualisieren, Quellen.

## PRÜFUNG UND ERGEBNIS

Über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 258 Dateien, 4.069 von 4.069 grün (Teil A meldete 4.047; neu hier 22: 18 in `ortsseiten.test.ts`, 2 in `sitemap-orte.test.ts`, je einer in `sitemap.test.ts` und `json-ld.test.ts`).
- `sicher.sh --json -- npm run typecheck`: grün. `sicher.sh --json -- npm run lint`: grün (beide nach der letzten Änderung erneut).
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 29 Dateien, 175 von 175 grün, 152,8 s (vorher 28 Dateien, 171 Tests; neu `ortsseiten.db.test.ts` mit 4). Migration `ortsseiten_stamm` läuft dabei an. Das neue `down` habe ich nicht gegen die Datenbank ausgeführt.
- `sicher.sh --json -- npm run build`: grün.
  - Seiten: vorher 181, nachher 181 (`/standorte/wetzlar` die einzige Ortsseite).
  - Dauer gesamt vorher 47,9 s (Kompilieren 2,0 s aus dem Zwischenspeicher, Typprüfung 33,5 s, statische Seiten 6,9 s).
  - Nachher erster Lauf 72,9 s (Kompilieren 29,4 s ohne Zwischenspeicher nach den Änderungen, Typprüfung 32,6 s, statische Seiten 6,0 s); nachher zweiter Lauf 41,0 s (Kompilieren 2,4 s, Typprüfung 27,6 s, statische Seiten 6,3 s). Vergleichbar sind die Läufe mit warmem Zwischenspeicher: 47,9 s gegen 41,0 s, kein Mehraufwand messbar.

Verlangte Tests (alle grün):
- Ortsseite mit Platzhaltertext bleibt noindex: `ortsseiten.test.ts` „Ortsseite mit Platzhaltertext bleibt noindex“; dazu `sitemap.test.ts`.
- Zwei wortgleiche Ortsseiten bleiben beide noindex: `ortsseiten.test.ts` (gleicher Text und Text mit getauschtem Ortsnamen), `sitemap.test.ts` (beide fehlen in der Sitemap).
- Ortsseite ohne Leistungsweg bleibt noindex und nennt den Grund: `ortsseiten.test.ts` (Grund „Kein Leistungsweg …“), `sitemap.test.ts`.
- Wetzlar bleibt indexierbar und in der Sitemap: `sitemap-orte.test.ts` (echte Datenschicht im JSON-Modus, echter Stamm, echte Sitemap), `ortsseiten.test.ts` (echter Stamm), `ortsseiten.db.test.ts` (Seed hängt Wetzlar an den Stamm).
- Partnerbezug erscheint nur mit abdeckendem Partner: `ortsseiten.test.ts` (ohne Partner, mit Partner anderer Region, pausiert, gesperrt: kein Satz; freigeschaltet und abdeckend: Satz).
- Weitere: Reihenfolge nach Priorität, Kontaktweg mit und ohne Schalter, Zählung der Vorgänge (Zeitraum, Großempfänger, leere und kaputte Werte), Zeilen der Prioritätsorte mit offenem Eintrag, Gemeinde ohne Postleitzahl, Kreis in den Strukturdaten nur mit Lage, Stufe aus Anhang A und Format des Schlüssels in der Datenbank, Partnerregion nur als Kennung.

## BELEGE

- Gebaute Seite `/standorte/wetzlar` (`.next/server/app/standorte/wetzlar.html`): enthält „Lahn-Dill-Kreis“, die Postleitzahl 35576, „Quellen der Ortsdaten“ und den Knopf „Termin in der Werkstatt“. `/standorte` enthält den GeoNames-Vermerk mit Link auf die Lizenz. Beide tragen im JSON-Build „noindex, nofollow“; das ist die bestehende Sperre der Schaufenster- und JSON-Builds (`src/lib/umgebung.ts`), nicht die neue Regel. Die neue Regel für Wetzlar ist über die Tests belegt.
- Kein Stammwert im Browser-Bündel: Suche nach 06532023 und 065320023023 in `.next/static` ohne Treffer.
- Wetzlar im Stamm: Gemeinde 06532023, Kreis 06532 Lahn-Dill-Kreis (landkreis), Land Hessen, Werkstatt-Postleitzahl 35576 gehört zur Gemeinde 06532023, also Werkstatt „im Ort“; Einleitung 268 Zeichen, keine zweite Ortsseite.
- Anhang A in der Ansicht: 348 Zeilen, Amberg (Bayern, Rang 23) „offen, bitte bestätigen: Amberg (09361000), Amberg (09778111)“.

## OFFENE FRAGEN

1. Mindestlänge der Einleitung: 160 Zeichen (etwa zwei Sätze) ist meine Festlegung; die Vorgabe nennt keine Zahl. Bitte bestätigen oder ändern (`EINLEITUNG_MINDESTLAENGE`). Ebenso 20 Zeichen für die Verfügbarkeit.
2. Wirksame Priorität ohne gepflegte Zahl: Rang innerhalb des Landes aus Anhang A. Damit stehen die Ersten aller Länder gleichauf (dann nach Name). Gibt der Inhaber eine bundesweite Reihenfolge vor, gehört sie in das Feld „Priorität“.
3. Partnerregion: Das Feld dokumentiert die Zuordnung; für „Partner deckt ab“ zählen wie verlangt nur die Postleitzahlen-Muster freigeschalteter Partner (`deckendePartner`). Soll ein zugeordneter Partner auch ohne passende Postleitzahl zählen, oder soll nur er zählen?
4. „Werkstatt im Landkreis“ gilt als Leistungsweg für jede Gemeinde des Lahn-Dill-Kreises. Für eine künftige Ortsseite im Kreis reicht damit eigener Text. Bitte bestätigen, dass das gewollt ist.
5. Der Knopf der Ortsseite Wetzlar heißt jetzt „Termin in der Werkstatt“ statt „Autoschlüssel-Termin“ (gleiche Adresse). Wortlaut bitte prüfen.
6. `src/app/(payload)/admin/importMap.js` ist erzeugt, liegt aber nicht ausdrücklich in den Schreibrechten; ohne den Eintrag lädt der Admin-Baustein nicht.
7. Vorgemerkt aus Teil A, nicht in meinen Schreibrechten: `next.config` (Tracing von `content/orte` auf die Routen mit `stamm.ts` beschränken; jetzt liest jede Route mit `getCities` den Stamm, also gehört er in diese Funktionen) und `docs/betrieb/partner-pruefen.md` Zeile 71 (Umkreis wird noch nicht ausgewertet).
8. Das neue `down` der Migration ist nicht gegen die Datenbank gelaufen; die Reihenfolge folgt Teil A.

## FÜR MENSCHEN

- Inhaber: Mindestlänge, Priorität ohne gepflegte Zahl, Rolle der Partnerregion, Landkreis als Leistungsweg, Knopftext (Offene Fragen 1 bis 5). Amberg bestätigen (aus Teil A, weiter offen).
- Betrieb: Suchvolumen und Fahrzeiten erst mit belegter Quelle eintragen; Ortsseiten nur mit eigenem Text anlegen (`docs/betrieb/orte-pflegen.md`).
- Rechtsprüfung: Quellenvermerke Destatis und GeoNames auf `/standorte` und im Fuß der Ortsseiten (Entwurf, R10); Partnerbezug ohne Namen auf öffentlichen Seiten (Satz „In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner.“).
- Orchestrator: `next.config` und `partner-pruefen.md` einem Paket zuweisen (Offene Frage 7); Eintrag in `importMap.js` bestätigen (Offene Frage 6). Hinweis: Im Arbeitsbaum liegen geänderte und neue Dateien unter `_werkstatt/ausbau/protokolle/FA-SEO-03/` aus dem gleichzeitig laufenden Paket; nicht von mir.

## Nachbesserung

Stand 16.11.2026, nach zwei Gegenprüfungen (10 Befunde). Jeder Befund wurde am Code geprüft. Kein git, kein Server, keine Netzabrufe.

### Je Befund

1. [rot] Partnerbetriebe erneuern keine Seiten. **Zutreffend, in meinen Schreibrechten nicht behebbar.** `src/payload/collections/Partnerbetriebe.ts` hat nur `afterChange: [partnerbetriebNachAenderung]`; `/standorte/[city]` ist statisch erzeugt, die Sitemap ebenso. Wird der einzige abdeckende Partner pausiert, gesperrt oder beendet, bleiben Partnersatz, Knopf, `index` und Sitemap-Eintrag bis zur nächsten Änderung an einer Sammlung mit `erneuernHooks` oder bis zum nächsten Build stehen. Die Datei liegt außerhalb der Schreibrechte; eine zeitbasierte Erneuerung der Ortsseiten als Ersatz habe ich bewusst nicht eingebaut (sie änderte das Zwischenspeichern ohne Auftrag). Offene Frage 9 mit fertigem Vorschlag.
2. [gelb] Admin-Baustein wirft ohne Stamm. **Behoben.** `ortsstamm()` und `gemeindenMitPartnerAbfragen` stehen in einem eigenen `try`. Ohne Stamm zeigt der Baustein die Tabelle der Ortsseiten (mit dem Grund aus `getCities`), den Hinweis „Ortsstamm nicht lesbar.“ und lässt nur die Prioritätsorte weg; die Liste der Einsatzgebiete darunter bleibt.
3. [gelb] „Termin in der Werkstatt“ ohne Ort und Anschrift. **Behoben.** Neue reine Funktion `werkstattAnschrift` (`src/lib/orte/ortsseiten.ts`): gepflegte Werkstattadresse, sonst Firmensitz (wie schon `ortsseitenAnreichern` für die Postleitzahl der Werkstatt). Der Knopf heißt jetzt „Termin in unserer Werkstatt in Wetzlar“ (Ort aus der Anschrift). Werkstatt im Ort: Kopf mit Anschrift und Abschnitt „Werkstatt in Wetzlar“ mit Anschrift und Erreichbarkeit (Baustein `Erreichbarkeit` unverändert, R9); Werkstatt im Landkreis: Kopf „Unsere Werkstatt: Langgasse 61, 35576 Wetzlar. …“. Firmendaten werden nur gelesen, nicht geändert (G9). Gebaute Seite `/standorte/wetzlar`: Knopf „Termin in unserer Werkstatt in Wetzlar“ und Anschrift vorhanden. Damit ändert sich Offene Frage 5: der Wortlaut des Knopfs ist jetzt dieser.
4. [gelb] Fehlender oder unbekannter Gemeindeschlüssel kein Grund. **Behoben.** `ortsseiteGruende` nennt jetzt „Gemeindeschlüssel fehlt oder steht nicht im Ortsstamm: Landkreis und Postleitzahlen sind nicht verknüpft.“, auch wenn eine Verfügbarkeit eingetragen ist. `Leistungsweg` ist jetzt `Pick<OrtsseitenLage, 'gemeinde' | 'werkstatt' | 'partnerDeckt' | 'verfuegbarkeit'>`. Die Admin-Tabelle zeigt neben dem Schlüssel den Namen der Gemeinde im Stamm und, wenn er nicht zum Ort passt (`gemeindeNamePasst`: Zusätze wie „am Main“ oder „(Saale)“ zählen nicht), den Hinweis „Name im Stamm passt nicht zum Ort, bitte Schlüssel prüfen.“ Der abweichende Name ist bewusst nur ein Hinweis, kein Grund gegen die Indexierung (Kurznamen wie „Frankfurt“ sind üblich). Tests: ohne Schlüssel mit Verfügbarkeit noindex mit Grund, unbekannter Schlüssel noindex, Namensvergleich.
5. [gelb] Partner mit Abrechnungsmodell A zählt als Abdeckung. **Zutreffend als Beobachtung, nicht geändert:** Die Vorgabe sagt „freigeschalteter, nicht pausierter und nicht gesperrter Partner“ und nennt kein Modell; Modell A kennt Vermittlung mit Provision (`src/lib/partner/vermittlung.ts`), nur der automatische Partnerweg nimmt Modell B. Ob ein Modell-A-Partner als plausibler Leistungsweg zählt, entscheidet der Inhaber (Offene Frage 10). Der Partnerweg-Knopf erscheint ohnehin nur mit `PARTNERMODELL_B=aktiv`.
6. [rot] Wie Befund 1 (gleiche Ursache, zweiter Prüfer). **Zutreffend, nicht in meinen Schreibrechten**; zusammen mit Befund 1 in Offene Frage 9.
7. [gelb] Wie Befund 2, dazu „(nicht im Stamm)“ ohne Stamm. **Behoben.** Ohne gelesenen Stamm zeigt die Zelle nur die Ziffern, ohne den Zusatz; die Spalte „Partner deckt ab“ bleibt dann leer.
8. [gelb] Eindeutiger Schlüssel und Papierkorb. **Behoben.** Am Feld `gemeindeschluessel` prüft `gemeindeschluesselPruefen` (`Einsatzgebiete.ts`) neben dem Format, ob der Schlüssel schon an einer anderen Seite hängt, auch im Papierkorb, und meldet: „Dieser Gemeindeschlüssel hängt an der Ortsseite „…“ im Papierkorb. Bitte diese Seite wiederherstellen oder dort den Schlüssel leeren.“ (sonst „… hängt schon an der Ortsseite „…“. Je Gemeinde gibt es eine Ortsseite.“). Scheitert die Abfrage, bleibt der eindeutige Index die Sperre. Die Anleitung nennt den Fall. Datenbanktest dazu.
9. [gelb] Anleitung nennt eine Partner-Spalte, die fehlt. **Behoben.** Die Tabelle „Veröffentlichung der Ortsseiten“ hat jetzt die Spalte „Partner deckt ab“ (`lage.partnerDeckt`), die Anleitung nennt sie. Die Anleitung nennt außerdem den Gemeindeschlüssel als dritte Bedingung, den Namensabgleich und den neuen Knopftext; die Beschreibung am Admin-Abschnitt nennt den Schlüssel ebenfalls.
10. [gelb] `importMap.js` außerhalb der Schreibrechte. **Zutreffend, keine Codeänderung nötig.** Der Unterschied ist genau eine Importzeile und ein Eintrag für `Ortsseiten` (geprüft mit `git diff`), nichts Fremdes. Bestätigung durch den Orchestrator bleibt Offene Frage 6.

### Geänderte Dateien in der Nachbesserung

- `src/lib/orte/ortsseiten.ts` (ergänzt: `werkstattAnschrift`, `gemeindeNamePasst`; `kontaktweg` mit Ort der Werkstatt)
- `src/lib/rechtliches/indexierung.ts` (Grund „Gemeindeschlüssel fehlt …“, Typ `Leistungsweg`)
- `src/app/(site)/standorte/[city]/page.tsx` (Werkstattanschrift im Kopf und im Abschnitt, Knopftext)
- `src/payload/components/Ortsseiten.tsx` (eigenes Abfangen des Stamms, Spalte „Partner deckt ab“, Name der Gemeinde mit Hinweis)
- `src/payload/collections/Einsatzgebiete.ts` (Prüfung des Schlüssels mit Meldung, Beschreibung)
- `docs/betrieb/orte-pflegen.md`
- Tests: `src/lib/orte/ortsseiten.test.ts` (6 neue, eine Erwartung ergänzt), `src/payload/ortsseiten.db.test.ts` (1 neuer), `src/app/sitemap.test.ts` und `src/components/seo/verweise.test.ts` (Lage mit Gemeinde, sonst unverändert)

### Prüfung nach der Nachbesserung (über die Datenweiche)

- `sicher.sh --json -- npx vitest run`: 258 Dateien, 4.075 von 4.075 grün (vorher 4.069; neu 6 in `ortsseiten.test.ts`).
- `sicher.sh --json -- npm run typecheck`: grün. `sicher.sh --json -- npm run lint`: grün.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 29 Dateien, 176 von 176 grün, 150,5 s (neu: Meldung bei Schlüssel im Papierkorb).
- `sicher.sh --json -- npm run build`: grün, 181 Seiten (unverändert), 72 s gesamt (Kompilieren 29,4 s ohne Zwischenspeicher nach den Änderungen, statische Seiten 5,8 s).

### Offene Fragen aus der Nachbesserung

9. An den Orchestrator (Befunde 1 und 6): In `src/payload/collections/Partnerbetriebe.ts` die Seiten nach jeder Änderung erneuern, etwa
   `afterChange: [partnerbetriebNachAenderung, nachAenderung]` und `afterDelete: [nachLoeschen]` (aus `../hooks/revalidate`), dazu ein Test, dass Partnerbetriebe einen Erneuerungs-Hook haben (oder ein Statuswechsel `revalidatePath` auslöst). Bis dahin gilt: Pausieren, Sperren oder Beenden eines Partners wirkt auf Ortsseiten und Sitemap erst mit der nächsten Inhaltsänderung oder dem nächsten Build. Wetzlar, heute die einzige Ortsseite, ist über die Werkstatt indexierbar und hängt nicht an Partnern; ihr Partnersatz könnte aber nach einem Statuswechsel veraltet stehen bleiben.
10. An den Inhaber (Befund 5): Zählt ein freigeschalteter Partner mit Abrechnungsmodell A, der keine Aufträge automatisch vermittelt bekommt, als plausibler Leistungsweg einer Ortsseite und für den Satz „In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner.“? Wenn nein, rechnet die Abdeckung nur mit Partnern, die vermittelt werden können (dann braucht `partnerFuerAbdeckung` das Abrechnungsmodell).
11. Knopftext neu „Termin in unserer Werkstatt in Wetzlar“ (ersetzt Offene Frage 5); Wetzlar zeigt jetzt den Abschnitt „Werkstatt in Wetzlar“ mit Anschrift des Firmensitzes und Erreichbarkeit. Bitte Wortlaut prüfen.

=== ENDE FA-PLATTFORM-03B · BEREIT ZUR RÜCKGABE ===
