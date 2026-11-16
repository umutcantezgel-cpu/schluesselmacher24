# FA-SHOP-02C · Bericht: gewünschte Leistung in der Gehäuse-Anfrage

Stand 16.11.2026 · Rolle Baumeister · Anforderungen FA-14-04, FA-14-05, FA-22-29, FA-22-30 · Grundlage: `berichte/FA-SHOP-02B.md`, offene Frage 8 und Abnahme.

## GEÄNDERTE DATEIEN

- `src/app/(site)/autoschluessel/gehaeuse/anfrage/leistung.ts` (neu): Werteliste an einer Stelle
- `src/app/(site)/autoschluessel/gehaeuse/anfrage/leistung.test.ts` (neu)
- `src/app/(site)/autoschluessel/gehaeuse/anfrage/kern.ts`, `kern.test.ts`
- `src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx`
- `src/app/(site)/autoschluessel/gehaeuse/leistungen.ts`, `leistungen.test.ts`, `page.tsx`
- `src/app/(site)/autoschluessel/customizing/page.tsx`, `texte.ts`, `texte.test.ts`
- `docs/betrieb/gehaeuse-pflegen.md`
- Gemeinsam (einzelne Stellen, Edit-Werkzeug): `src/lib/actions/records.ts`, `src/lib/actions/security.test.ts`
- dieser Bericht

Nicht berührt: Preise, Datenschema, Migrationen, `content/rubriken.json`, `src/lib/data/defaults/rubriken.ts`, Navigation, Startseite, Einsendeformular, Warenkorb, Kasse, `src/lib/server/unterlagen-pflicht.ts`, Vorgangsblatt, Mailtexte.

## WAS UND WARUM

1. **Werteliste** (`anfrage/leistung.ts`): `gehaeusetausch`, `reparatur`, `umbau` kommen als Kennungen und Titel unverändert aus `GEHAEUSE_LEISTUNGEN` (sie passten schon), dazu `unklar` mit dem Titel „Weiß ich noch nicht, bitte beraten“. Je Antwort ein kurzer Satz für Laien, ohne Preis, Frist oder Zahlungslink. Dazu reine Funktionen: `leistungAusAdresse` (Vorbelegung, nur die drei Leistungen), `leistungPruefen` (Server, vier Werte, sonst `unklar`), `anfrageAdresse` (Verweis mit `?leistung=`), `gehaeuseLeistungSichern` (Server: Nutzlast und Zeile der Zusammenfassung aus dem geprüften Wert). Die Datei hat keine React- und keine Serverabhängigkeit, damit Formular, Seiten und `records.ts` dieselbe Liste nutzen.
2. **Formular**: Die Frage „Was sollen wir für Sie tun?“ steht im ersten Schritt (Fahrzeug) als `fieldset` mit `legend` und vier `OptionCard` (native Radioknöpfe, mit der Tastatur bedienbar), vor Marke, Modell und Baujahr. Pflicht über `schrittGueltig('fahrzeug')`; ohne Antwort greift die bestehende Sperre am Weiter-Knopf mit Hinweis (`blockedHints.fahrzeug` nennt jetzt auch die Leistung), wie bei den anderen Feldern. Die Schrittüberschrift heißt „Ihr Wunsch und Ihr Fahrzeug“ (Nachbesserung, Befund 3), die Kurzform bleibt „Fahrzeug“. Die Zahl der Schritte bleibt fünf; „Fünf Schritte: Fahrzeug, Tasten, Fotos, Kontakt und Absenden“ bleibt wahr. Hilfeblock, Fehlermeldung beim Absenden, Fortschritt, Warnung beim Verlassen und `OffenerSchritt` sind unverändert (FA-QA-02).
3. **Vorbelegung**: `AnfrageFormular` liest `?leistung=` mit `useSearchParams` in `FormularMitAdresse` unter einer `Suspense`-Grenze (Anleitung `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md`, Abschnitt Prerendering, gelesen). Rückfall der Grenze ist dasselbe Formular ohne Vorbelegung, das statische HTML enthält also das vollständige Formular. Die Seite liest kein `searchParams` und bleibt statisch (Build: `○ /autoschluessel/gehaeuse/anfrage`); `canonical` bleibt die Adresse ohne Parameter. Die Vorbelegung wird nicht gespeichert: `mitVorbelegung` füllt nur eine leere Antwort, die eigene Wahl des Kunden (auch aus dem Zwischenstand) hat Vorrang. Ein unbekannter Wert und `unklar` in der Adresse werden übergangen. Die Version des Zwischenstands bleibt 1. Ein alter Stand ohne `leistung` setzt am gespeicherten Schritt fort; das Absenden ist dann gesperrt, bis die Frage beantwortet ist (Vorbelegung zählt), und ein Hinweis führt zurück in den Schritt Fahrzeug (Nachbesserung, Befund 1).
4. **Mitnahme**: `payloadAus` gibt `leistung` mit (ohne gültige Antwort leer; erst der Server setzt `unklar`, Nachbesserung Befund 2), `gehaeuseZusammenfassung` zeigt „Gewünschte Leistung“ direkt vor „Ihr Anliegen“.
5. **Server** (`records.ts`, eine Stelle): Für den Weg `gehaeuse` ersetzt `gehaeuseLeistungSichern` die Leistung in der Nutzlast durch den geprüften Wert und baut die Zeile „Gewünschte Leistung“ der Zusammenfassung neu; eine Zeile gleichen Namens aus dem Browser fällt weg. So wird ein erfundener Wert weder in den Daten noch im Text gespeichert. Die Pflichtregel für Unterlagen ist unverändert und gilt für jede Leistung gleich (Test).
6. **Verweise**: Customizing: alle drei Knöpfe „Umbau anfragen“ (Kopf, Ablauf aus den Rubrikdaten, Leerzustand der Auswahl) führen nach `?leistung=umbau`. Gehäuse-Seite: jede Leistung in Abschnitt 03 hat einen eigenen Verweis („Gehäusetausch anfragen“, „Reparatur anfragen“, „Umbau anfragen“) mit ihrer Kennung; die beiden allgemeinen Knöpfe „Anfrage stellen“ bleiben ohne Parameter. Der Behelfssatz `ANFRAGE_LEISTUNG_NENNEN` ist entfallen, ebenso sein Gegenstück in `LEISTUNGEN_ABLAUF_VERWEIS` (jetzt: „Wie es abläuft, steht oben unter 01. Ihren Schlüssel schicken Sie erst nach unserer Rückmeldung.“). Tests umgestellt, nicht gelöscht (G8).
7. **Anleitung**: `docs/betrieb/gehaeuse-pflegen.md`, Abschnitt 4: Absatz, wo der Betrieb die Leistung sieht (ersetzt den alten Hinweis auf die Beschreibung).

## GEMEINSAME DATEIEN

- `src/lib/actions/records.ts` Z. 45: Import `gehaeuseLeistungSichern`; Z. 448 bis 452: Block `if (weg === 'gehaeuse') { ({ payload, summary } = gehaeuseLeistungSichern(payload, summary)); }` direkt nach der Tastenprüfung. Hinweis: `records.ts` importiert damit aus `src/app/(site)/…` (Schreibrechte des Pakets); die Datei ist rein und ohne React. Wer das lieber unter `src/lib` sähe, kann sie dorthin ziehen (OFFENE FRAGE 3).
- `src/lib/actions/security.test.ts`: zwei neue Tests im Block „Pflichtunterlagen je Weg“ (Serverprüfung des Werts; Pflichtregel gleich für jede Leistung).
- Während der Arbeit hat ein anderes Paket `records.ts` an anderer Stelle geändert (Partner-Bewerbung); das ist nicht von mir und wurde nicht angefasst.

## PRÜFUNG UND ERGEBNIS

Alle über die Datenweiche, nach dem letzten Eingriff:
- `sicher.sh --json -- npx vitest run`: 237 Dateien, 3692 Tests, alle grün.
- `sicher.sh -- npm run typecheck`: ohne Fehler. (Ein früher Lauf zeigte Fehler in `partner-werden/partner-formular.tsx` aus einem gleichzeitig laufenden Partner-Paket; der Lauf danach war sauber.)
- `sicher.sh -- npm run lint`: ohne Befund.
- `sicher.sh --json -- npm run build`: erfolgreich, 180 von 180 Seiten; `/autoschluessel/gehaeuse/anfrage` und `/autoschluessel/customizing` statisch (○).
Kein Server, kein git, keine Formularsendung (G5).

## BELEGE

Weg der Angabe vom Formular bis zu Vorgang, Bestätigung, Mail und Vorgangsblatt:
- Formular: `anfrage-formular.tsx` Z. 134 und 135 `payload: payloadAus(data)`, `summary` an `submitRecord`; Z. 167 `summary={summary}` an `WegBestaetigung` (Bestätigungsseite), dort `src/components/weg/bestaetigung.tsx` Z. 136 bis 139 `SummaryList`.
- Server: `src/lib/actions/records.ts` Z. 451 prüft und baut neu; Z. 551 und 552 `payload`, `summary` an `createRecord`.
- Vorgang: `src/lib/server/create-record.ts` Z. 147 und 148 `payload: input.payload, summary: input.summary`; Speicherung `src/lib/data/payload-mapping.ts` Z. 1919 (`zusammenfassung`), Nutzlast als `daten` (JSON, kein neues Feld, Z. 1820 beim Lesen); Admin `src/payload/collections/Vorgaenge.ts` Z. 377 Feld `zusammenfassung`, Bezeichnung „Angaben des Kunden“ im Reiter „Übersicht“.
- Vorgangsblatt (PDF): `src/lib/pdf/vorgangsblatt.ts` Z. 208 bis 213, jede Zeile der Zusammenfassung als „Angaben des Kunden: Fahrzeug und Schlüssel“.
- Mail: Betrieb `src/lib/server/benachrichtigungen.ts` Z. 141 bis 146 mit dem Vorgangsblatt als Anhang; die Betriebsmail selbst nennt laut `betrieb-neuer-vorgang.ts` Z. 4 bewusst keine Zusammenfassung. Die Eingangsmail an den Kunden (`kunde-eingang.ts`) enthält keine Zusammenfassung; die Leistung steht dort also nicht (unverändert, Mailtexte nicht angefasst). `team-hinweis.ts` Z. 18 gibt die Zusammenfassung bei späteren Hinweisen aus.
- Serverprüfung: `security.test.ts` „nimmt beim Gehäuse nur die vier Leistungen an …“ (sieben Fälle, darunter `testwert-erfunden`, fehlend, Zahl → `unklar` in Nutzlast und Zeile; Zeile vor „Ihr Anliegen“); „die Pflichtregel für Unterlagen gilt … für jede Leistung gleich“.
- Werteliste, Vorbelegung (gültig, ungültig, fehlt), Verweise: `anfrage/leistung.test.ts`; Pflicht im Schritt, Nutzlast, Zusammenfassung, Vorbelegung: `anfrage/kern.test.ts`; Verweise der Seiten: `gehaeuse/leistungen.test.ts`, `customizing/texte.test.ts`.
- Build-Ausgabe (statisches HTML): Customizing dreimal `href="/autoschluessel/gehaeuse/anfrage?leistung=umbau"`; Gehäuse je einmal `?leistung=gehaeusetausch`, `reparatur`, `umbau` und dreimal ohne Parameter; „Schreiben Sie in der Anfrage“ auf beiden Seiten nicht mehr vorhanden; die Anfrage-Seite enthält „Was sollen wir für Sie tun?“ und `canonical` ohne Parameter.

## OFFENE FRAGEN

1. OFFENE FRAGE: Die Eingangsmail an den Kunden nennt die gewünschte Leistung nicht (sie zeigt keine Zusammenfassung). Soll sie das? Das wäre eine Änderung der Mailtexte außerhalb dieses Pakets.
2. OFFENE FRAGE: Die Titel „Gehäusetausch im Einsendeservice“ und „Umbau auf anderes Gehäuse (Customizing)“ (Benennung der Vorgabe) stehen jetzt auch als Antworten im Formular; „Customizing“ ist für ältere Kunden ein Fremdwort (Gegenprüfung, Befund 4). Der Einsendeweg für Gehäuse hängt weiter an MA-27 (FA-SHOP-02B, Frage 2); der Kunde schickt erst nach der Rückmeldung. Passen die Titel so, oder sollen die Antworten für Laien kürzer heißen (etwa „Neues Gehäuse“, „Reparatur“, „Umbau auf eine andere Form“; die Benennung der Vorgabe bliebe in `LEISTUNG_TEXT` für Vorgang und Vorgangsblatt)? Entscheidet der Inhaber, Schlussredaktion MA-41.
3. OFFENE FRAGE (Technik): `records.ts` importiert die Werteliste aus `src/app/(site)/autoschluessel/gehaeuse/anfrage/leistung.ts`. Soll die Datei nach `src/lib` umziehen? Außerhalb der Schreibrechte, darum nicht gemacht.
4. Hinweis: Die Wortwahl der Laiensätze ist meine; bitte mit den übrigen Formulartexten in MA-41 freigeben.
5. Kein Datenbankfeld nötig: die Angabe steht in `daten` (JSON) und in der Zusammenfassung.

## FÜR MENSCHEN

- Orchestrator: Sichtprobe im Browser mit Attrappen, ohne Absenden (G5): `/autoschluessel/gehaeuse/anfrage?leistung=umbau` (Umbau vorgewählt, änderbar), `?leistung=testwert` (keine Vorwahl, Weiter gesperrt mit Hinweis), Zwischenstand mit eigener Wahl und anderem Parameter (eigene Wahl bleibt), Tastatur durch die vier Antworten, 390 und 1280 px; Verweise auf `/autoschluessel/gehaeuse` und `/autoschluessel/customizing`.
- Inhaber: Fragen 1 und 2; Laiensätze in MA-41.

## Nachbesserung

Stand 16.11.2026, nach zwei Gegenprüfungen. Geänderte Dateien: `anfrage/kern.ts`, `anfrage/kern.test.ts`, `anfrage/anfrage-formular.tsx`, `gehaeuse/teile/ansicht.ts`, `gehaeuse/page.tsx` (nur Kommentar), `gehaeuse/leistungen.test.ts`, dieser Bericht. Keine gemeinsame Datei berührt.

1. [rot] Pflichtfrage umgehbar: **behoben.** Zutreffend für einen gespeicherten Stand von vor diesem Paket, der hinter Schritt 1 fortsetzt (`use-flow.ts` setzt am gespeicherten `stepId` fort, `canContinue` prüft nur den aktuellen Schritt). Ein neuer Stand beginnt dagegen immer bei Schritt 1 und wird dort gefragt; dieser Teil des Befunds trifft nicht zu. Jetzt verlangt `schrittGueltig(…, 'absenden')` `istLeistungWunsch(daten.leistung)` (die Vorbelegung zählt, weil das Formular mit `mitVorbelegung` prüft). Im Schritt Absenden steht dann zusätzlich ein `OffenerSchritt` „Bitte wählen Sie, was wir für Sie tun sollen.“ mit „Zum Schritt ‚Fahrzeug‘“ (`flow.goTo('fahrzeug')`), und der Sperrhinweis am Absende-Knopf nennt die Leistung. Hilfeblock, bestehende Fehlermeldungen, der Foto-Hinweis, Fortschritt und Warnung beim Verlassen sind unverändert (FA-QA-02, nur ergänzt). Test: `kern.test.ts` „sperrt das Absenden ohne gewünschte Leistung, auch bei einem alten Zwischenstand hinter Schritt 1“ (Stand wie in useFlow zusammengesetzt, ohne Feld `leistung`: Kontakt gültig, Absenden gesperrt, erfundener Wert gesperrt, Vorbelegung und alle vier Antworten frei). Der bisherige Test „Absenden immer gültig“ prüft jetzt mit beantworteter Frage (angepasst, nicht gelöscht, G8). Der Satz in WAS UND WARUM 3 ist richtiggestellt.
2. [gelb] Stiller Rückfall `unklar` im Browser: **behoben.** `payloadAus` schickt ohne gültige Antwort jetzt `leistung: ''`; nur der Server (`gehaeuseLeistungSichern`, unverändert) macht daraus `unklar`. Mit Befund 1 kommt der Fall im Formular praktisch nicht mehr vor. Der Satz in der Betreiberanleitung („oder es kam kein gültiger Wert an“) bleibt, er beschreibt die Serverseite. Test in `kern.test.ts` angepasst (leer, erfundener Wert leer, `unklar` bleibt `unklar`); die Servertests in `security.test.ts` decken den fehlenden Wert schon ab.
3. [gelb] Schrittüberschrift: **behoben.** Neu „Ihr Wunsch und Ihr Fahrzeug“, Kurzform „Fahrzeug“ unverändert. Kein Test und keine Anleitung nannte die alte Überschrift.
4. [gelb] Antworttitel „im Einsendeservice“ und „(Customizing)“: **nicht umgesetzt, als Entscheidung beim Inhaber.** Der Befund ist in der Sache berechtigt, aber Punkt 1 der Paketdatei verlangt ausdrücklich die Benennung der Vorgabe („nicht neu erfinden“), und der Befund selbst legt die Entscheidung zum Inhaber (MA-41); offene Frage 2 ist um „Customizing“ und den Vorschlag eigener Antworttitel erweitert.
5. und 7. [gelb] Adresse dreimal als Konstante: **behoben, soweit es die Prüfung auf Waisen zulässt.** Die eine Stelle ist `ANFRAGE_PFAD` in `anfrage/leistung.ts`; `teile/ansicht.ts` exportiert `GEHAEUSE_ANFRAGE_PFAD` jetzt nur noch als Weiterleitung davon (`export { ANFRAGE_PFAD as GEHAEUSE_ANFRAGE_PFAD } from '../anfrage/leistung'`), Artikel- und Teileseite laufen damit über dieselbe Stelle. `const ANFRAGE` in `gehaeuse/page.tsx` bleibt als Text ausgeschrieben: Ein Versuch mit `anfrageAdresse()` ließ `src/components/seo/waisen.test.ts` scheitern, weil diese Prüfung Verweise statisch im Quelltext liest und die Anfrage-Seite dann als Waise meldete; die Prüfung zu lockern ist nicht erlaubt (G8). Stattdessen hält `leistungen.test.ts` den ausgeschriebenen Wert jetzt gegen `ANFRAGE_PFAD` (ausgelesen aus `page.tsx`), statt einen festen Wortlaut zu erwarten; laufen die Adressen auseinander, schlägt der Test an. Ein Kommentar in `page.tsx` sagt das.
6. [gelb] Bericht falsch zum alten Zwischenstand: **behoben** mit Befund 1 (Code) und dem richtiggestellten Satz in WAS UND WARUM 3.

Prüfung nach der Nachbesserung, alle über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 238 Dateien, 3719 Tests, alle grün (der Zwischenlauf mit `anfrageAdresse()` in `page.tsx` hatte 1 Fehler in `waisen.test.ts`, siehe Befund 5).
- `sicher.sh -- npm run typecheck`: ohne Fehler.
- `sicher.sh -- npm run lint`: ohne Befund.
- `sicher.sh --json -- npm run build`: erfolgreich, 180 von 180 Seiten; `/autoschluessel/gehaeuse/anfrage` und `/autoschluessel/customizing` weiter statisch (○).
Kein Server, kein git, keine Formularsendung (G5).

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-PLATTFORM-01`, beide Pakete gemeinsam im Arbeitsbaum, nach allen Eingriffen): Typprüfung grün, Lint grün, Unit 3723 von 3723, Datenbanktests 157 von 157 (die neue Migration läuft dabei auf einer frischen Datenbank), Build 180 von 180 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 136 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Browserprobe (Attrappen, nichts abgesendet, G5; lokale Entwicklungsinstanz auf eigenem Port): 19 von 19 Prüfungen bestanden.
- `?leistung=umbau` wählt den Umbau vor; die Vorwahl ist änderbar; die eigene Wahl bleibt nach dem Neuladen und geht der Adresse vor; `canonical` ohne Parameter.
- Unbekannter Wert: keine Vorwahl; ohne Antwort ist „Weiter“ gesperrt, auch wenn das Fahrzeug ausgefüllt ist; mit der Tastatur bedienbar (Leertaste wählt, Pfeil wechselt); Antwortkarten 89 px hoch.
- Alter Zwischenstand ohne Leistung im Schritt Absenden: Hinweis „Bitte wählen Sie, was wir für Sie tun sollen.“, Absenden gesperrt, der Hinweis führt zum Schritt mit der Frage.
- Verweise: Gehäuse-Seite je Leistung mit Kennung, „Anfrage stellen“ ohne Parameter; Customizing immer `?leistung=umbau`; der Behelfssatz steht auf keiner der beiden Seiten mehr.

Entschieden bei der Abnahme:
- Die Antworten heißen wie in der Arbeitsanweisung („Gehäusetausch im Einsendeservice“, „Reparatur (Tasten, Mechanik)“, „Umbau auf anderes Gehäuse (Customizing)“), weil jede Antwort einen Satz für Laien trägt und Zusammenfassung, Vorgang und Vorgangsblatt dann dieselben Worte zeigen. Kürzere Titel ohne Fremdwort sind eine Frage an den Inhaber (MA-53, Punkt 11).
- Die Eingangsmail an den Kunden nennt die Leistung nicht, weil sie keine Zusammenfassung enthält (Bestand). Keine Änderung; die Betriebsmail und das Vorgangsblatt tragen die Angabe.
- `records.ts` importiert die Werteliste aus dem Ordner der Seite. Das bleibt so; ein Umzug nach `src/lib` ist eine Aufräumarbeit ohne Wirkung für Kunden.

=== ENDE FA-SHOP-02C · BEREIT ZUR RÜCKGABE ===
