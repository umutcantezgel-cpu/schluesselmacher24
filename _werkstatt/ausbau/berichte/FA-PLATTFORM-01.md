# FA-PLATTFORM-01 · Teil A · Neun Leistungen, Partnerformular, Felder am Partnerbetrieb

Stand 16.11.2026. Baumeister, Teil A laut Zuschnitt (Punkte 1, 2 und 7 unter „So bauen“). Teil B (Prüfliste, Pausieren und Sperren, Region mit Abdeckungsfunktion, Lead-Verlauf) ist nicht angefasst.

## GEÄNDERTE DATEIEN
Neu:
- `src/lib/partner/leistungen.ts`: die eine Liste der neun Leistungen, Sammelwert, frühere Werte, Hilfsfunktionen
- `src/lib/partner/bewerbungsformular.ts`: Felder, Serverprüfung, Zusammenfassung, Übernahme in den Partnerbetrieb
- `src/payload/hooks/partner-bewerbung.ts`: Übernahme der Bewerbung beim Verknüpfen, Prüfung der Auftragsarten
- `src/migrations/20261116_072304_partner_qualitaet.ts` und `.json` (erzeugt mit `migrate:create partner_qualitaet`)
- `src/lib/partner/leistungen.test.ts`

Geändert:
- `src/payload/collections/Partnerbetriebe.ts`: Auswahl aus der Liste, neue Felder `plz`, `werkstatt`, `geraete`, `erfahrung`, Hooks
- `src/app/(site)/partner-werden/partner-formular.tsx`: sieben Schritte, neue Felder, Satz „nur Autoschlüssel“
- `src/lib/actions/records.ts`: nur der Zweig der Partner-Bewerbung (Serverprüfung, Daten und Zusammenfassung neu gebaut)
- `src/lib/partner/gewinnung.ts`: `PARTNER_LEISTUNGEN` kommt jetzt aus `leistungen.ts`, Wortlaut gleich
- `src/lib/partner/vermittlung.ts`: `darfVermitteln` nutzt `decktAuftragsart` (Sammelwert)
- `src/lib/partner/index.ts`: Export von `leistungen`
- `src/lib/pdf/partnervertrag.ts`: Namen der Auftragsarten aus der Liste (nur Verweis, kein Vertragstext)
- `src/migrations/index.ts`, `src/payload-types.ts` (erzeugt)
- Tests: `src/lib/actions/security.test.ts`, `src/lib/partner/partnerbetriebe.db.test.ts`, `src/lib/partner/vermittlung.db.test.ts`

## WAS UND WARUM
1. Eine Liste (`PARTNER_LEISTUNGEN_LISTE`, Werte `schluessel-nachmachen`, `programmierung-anlernen`, `schluesselverlust`, `keyless-smart-key`, `transponder`, `funk`, `fahrzeugoeffnung`, `reparatur-gehaeuse`, `motorrad-weitere`) speist Formular, Sammlung (Auftragsarten, Provisionen, Auftragsart am Vorgang über den Import `AUFTRAGSARTEN`), Partnerseiten (`PARTNER_LEISTUNGEN`) und Vertrags-PDF. FA-07-02, FA-07-04 bis FA-07-12.
2. Alte Werte bleiben lesbar (G6): Die Migration ergänzt die Postgres-Enums nur (`ADD VALUE … BEFORE`), nichts wird gelöscht. In der Auswahl tragen Schlüsseldienst vor Ort, Montage Zylinder, Montage Schließanlage, Beratung vor Ort und Einbau Elektronik den Zusatz „früher:“. Neu setzen lassen sie sich nirgends: an den Auftragsarten des Partnerbetriebs (`auftragsartenPruefen`), an den Provisionen (`provisionenPruefen`) und an der Auftragsart der Vermittlung am Vorgang (`auftragsartAmVorgangPruefen` in `hooks/vermittlung.ts`); bei Provisionen und Vorgang bleibt der Sammelwert wählbar. Was schon gespeichert ist, bleibt speicherbar und lässt sich entfernen (Nachbesserung).
3. Sammelwert `autoschluessel-vor-ort`: Der Server setzt ihn bisher an jedem Autoschlüssel-Vorgang (FA-KERN-03/04, `AUFTRAGSART_AUTOSCHLUESSEL` in `src/lib/auftragsweg.ts`, nicht in meinen Schreibrechten). Damit neue Partner mit nur den neun Leistungen nicht aus jeder Zuordnung fallen, deckt jede der neun den Sammelwert ab (`decktAuftragsart`, genutzt von `darfVermitteln`). Am Partnerbetrieb ist der Sammelwert nicht mehr neu wählbar, am Vorgang schon. Pausierte Partner bleiben ausgeschlossen (Test).
4. Partnerformular: Schritte Betrieb (Kontakt) · Region (PLZ und Ort des Betriebs, mobil ja oder nein, Radius in km, Einsatzgebiet als Postleitzahlen) · Leistungen (die neun, mit dem Satz „Nur Autoschlüssel und Fahrzeugschlüssel“) · Werkstatt und Geräte (feste Werkstatt ja oder nein mit Anschrift; Geräte als Liste mit Art Schlüsselfräsmaschine, Programmiergerät oder Diagnosegerät, Hersteller und Typ frei) · Erfahrung (Jahre Pflicht, Schwerpunkte, Fahrzeugabdeckung, Qualifikationen) · Nachweise wie im Bestand · Absenden. Fortschrittsanzeige, Zurück ohne Datenverlust (Zwischenstand `useFlow`, Version auf 2 gehoben, damit kein alter Stand mit früheren Leistungen zurückkommt), Fehlertext am gesperrten Knopf je Schritt (`schrittFehler`), Hilfeblock, `AbsendeFehler` und Rückfrage vor dem Verlassen aus FA-QA-02 bleiben.
5. Serverprüfung (`bewerbungPruefen`): Firma, Name, E-Mail, Telefon, PLZ mit fünf Ziffern, Ort, Postleitzahlen-Muster, Radius 1 bis 300 km, mobil und Werkstatt beantwortet, Anschrift bei Werkstatt, ohne Werkstatt nur mit mobilem Einsatz, Radius bei mobilem Einsatz, Umkreis oder Postleitzahlen, mindestens eine Leistung, nur die neun (sonst Ablehnung mit „Das Partnernetz betrifft nur Autoschlüssel und Fahrzeugschlüssel …“), Geräteart, Erfahrung in Jahren, Einwilligung. Der Server speichert nur die geprüften Felder und baut die Zusammenfassung selbst; Fremdfelder und eine gefälschte Zusammenfassung fallen weg.
6. Felder am Partnerbetrieb, die das Formular füllt: `plz`, `werkstatt.{vorhanden,mobil,anschrift}`, `geraete[]{art,hersteller,typ}`, `erfahrung.{jahre,schwerpunkte,fahrzeugabdeckung}`; Bestand `firma`, `ansprechpartner`, `email`, `telefon`, `ort`, `einsatzgebiet.{postleitzahlen,radiusKm}`, `auftragsarten`. Verknüpft das Team die Bewerbung (`bewerbung`), füllt der Hook `bewerbungUebernehmen` nur leere Felder. Bewerbungen aus dem früheren Formular werden gelesen; ihre alten Leistungen gehen nicht in die Auftragsarten, sondern als Hinweis in die interne Notiz.
7. Radius einheitlich 300 km (`MAX_RADIUS_KM`) in Formular und Sammlung (FA-07-16); vorher erlaubte das Formular 1000 km.
8. Punkt 7: Kein Partnerzugang, keine neue Mail. Es wird nichts versendet; die Eingangsbestätigung der Bewerbung läuft wie im Bestand über den allgemeinen Vorgangsweg.

## PRÜFUNG UND ERGEBNIS
Alle über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 238 Dateien, 3718 Tests, alle grün
- `sicher.sh --json -- npm run typecheck`: ohne Fehler
- `sicher.sh --json -- npm run lint`: ohne Befund
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 26 Dateien, 154 Tests, alle grün (die Migration läuft dabei auf der frischen Datenbank)
- `sicher.sh --json -- npm run build`: erfolgreich

Pflichttest Teil A „Bewerbung mit Türöffnung als Leistung abgelehnt“: `src/lib/actions/security.test.ts` („lehnt eine Partner-Bewerbung mit Türöffnung als Leistung ab“, über die öffentliche Aktion) und `src/lib/partner/leistungen.test.ts` („lehnt eine Bewerbung mit Türöffnung als Leistung ab“).

## BELEGE
- Liste und Kennzeichnung „früher“: `leistungen.test.ts`, Block „Leistungen des Partnernetzes“
- Serverprüfung je Pflichtfeld (13 Fälle): `leistungen.test.ts`, „lehnt ab: …“; Datenneubau: `security.test.ts`, „prüft die Pflichtfelder der Partner-Bewerbung auf dem Server und baut die Daten neu“
- Datenbank: frühere Auftragsart beim Anlegen abgelehnt, Altbestand lesbar und speicherbar, Übernahme der Bewerbung in den Partnerbetrieb: `partnerbetriebe.db.test.ts`
- Sammelwert und Pause: `vermittlung.db.test.ts` (Partner mit `schluessel-nachmachen` bekommt den Autoschlüssel-Auftrag, pausiert nicht)
- Migration nur additiv: `src/migrations/20261116_072304_partner_qualitaet.ts`, `up` enthält nur `CREATE TYPE`, `ADD VALUE`, `CREATE TABLE`, `ADD COLUMN`, Index und Fremdschlüssel

## OFFENE FRAGEN
- Sammelwert: Soll jede der neun Leistungen den allgemeinen Autoschlüssel-Auftrag abdecken (heute so, auch Reparatur oder Motorrad allein), oder soll die Leistung des Auftrags (`carKeyServices`) einer der neun zugeordnet werden? Das gehört zur Zuordnung in Teil B und berührt `src/lib/auftragsweg.ts` (FA-KERN-03).
- Radius 300 km als Obergrenze für Formular und Admin: passt das dem Inhaber, oder gibt es bundesweit mobile Betriebe?
- Sollen Geräte im Formular Pflicht sein (heute freiwillig, um nichts zu erzwingen, was ein Betrieb nicht hat)?
- Bestehende Partnerbetriebe mit früheren Werten oder nur dem Sammelwert: Das Team sollte sie auf die neun umstellen. Gibt es solche Betriebe in der echten Datenbank?

## FÜR MENSCHEN
- Inhaber: Liste der neun Leistungen bestätigen (FA-08-10 „Leistungsliste bestätigen“), Obergrenze Radius, Umgang mit dem Sammelwert.
- Team: vorhandene Partnerbetriebe mit „früher“-Werten prüfen und auf die neun umstellen. Die Provisionen je Auftragsart (nur Inhaber) hängen an diesen Werten; Provisionen für die neun Leistungen trägt nur der Inhaber ein (G9, G13).
- Inhaber, Provisionen: Vorgänge tragen heute immer den Sammelwert „Autoschlüssel allgemein“. Für den Vorschlag des Plattformanteils gilt: eine Provision auf „Autoschlüssel allgemein“ zuerst; fehlt sie, gelten die Provisionen der neun Leistungen nur, wenn sie alle gleich sind. Weichen sie ab, kommt kein Vorschlag, sondern der Hinweis, den Anteil von Hand einzutragen. Am einfachsten trägt der Inhaber je Partner eine Provision auf „Autoschlüssel allgemein“ ein. Die Regel bitte bestätigen.
- Team: Partnerbetriebe ohne Postleitzahlen im Einsatzgebiet bekommen keine Vorschläge, auch mit Umkreis; der Umkreis wird erst in Teil B ausgewertet. Bis dahin Postleitzahlen eintragen (Hinweis steht am Feld).
- Datenschutz: Die Bewerbung erhebt jetzt mehr Angaben (Werkstattanschrift, Geräte, Erfahrung). Ob `src/lib/rechtliches/verarbeitungen.ts` und die Datenschutzhinweise das abdecken, prüft der Anwalt (R10).
- Weitere Stellen für FA-PLATTFORM-02: „Bewerben Sie sich mit wenigen Angaben“ stimmt bei sieben Schritten nicht mehr ganz: `src/app/(site)/partner-werden/page.tsx` Zeile 38, `src/lib/partner/gewinnung.ts` Zeile 364, `content/seo.json` Zeilen 693 und 698, `src/lib/data/defaults/content.ts` Zeilen 436 und 441. Vorschlag: „Bewerben Sie sich mit Angaben zu Betrieb, Leistungen, Ausstattung und Einsatzgebiet.“
- Weitere Stellen außerhalb meiner Schreibrechte, die nicht zu den neun passen: Rubrik „Schlüsseldienst vor Ort“ mit Verweis auf Partner (`content/rubriken.json`, siehe FA-ABGLEICH Block 03), Partner-Gewinnungsseiten nennen Leistungen nur über `PARTNER_LEISTUNGEN` (passt). Der Partnervertrag (MA-29) bleibt Entwurf.
- Öffentliche Partnerprofile (Punkt 8, nicht gebaut): nötig wären schriftliche Zustimmung jedes Partners zur Veröffentlichung von Name, Ort und Leistungen, eigene Felder für freigegebene Profiltexte und Logo, ein Schalter „Profil öffentlich“ am Partnerbetrieb, Ergänzung der Datenschutzhinweise und Transparenz, wer ausführt (R4, R5, R8).

## Stand für Teil B
Nutzbar:
- `src/lib/partner/leistungen.ts`: `PartnerLeistung` (Typ), `PARTNER_LEISTUNGEN_LISTE`, `AUFTRAGSART_OPTIONEN`, `AUFTRAGSART_SAMMELWERT`, `AUFTRAGSART_SAMMELWERT_NAME`, `FRUEHERE_AUFTRAGSARTEN`, `istPartnerLeistung`, `auftragsartName`, `nichtMehrWaehlbar`, `nichtMehrWaehlbarFuerAuftrag`, `decktAuftragsart(partnerArten, auftragsart)`, `provisionsEintragWaehlen(eintraege, auftragsart)`.
- `src/payload/hooks/partner-bewerbung.ts`: `auftragsartenPruefen`, `provisionenPruefen`, `auftragsartAmVorgangPruefen`, `meldungNichtMehrWaehlbar`, `bewerbungEinsetzen`.
- `src/lib/partner/vermittlung.ts`: `darfVermitteln(partner, auftragsart)` prüft Stand `freigeschaltet` und `decktAuftragsart`.
- `src/lib/partner/bewerbungsformular.ts`: `MAX_RADIUS_KM`, `GERAETE_ARTEN`, `plzGueltig`, `plzListeTeile`, `plzListeGueltig`, `radiusAusEingabe`, `partnerbetriebAusBewerbung`.
- `src/lib/auftragsweg.ts` (Bestand): `plzMusterAusText`, `plzPasst`, `passendePartner` als Grundlage der Abdeckungsfunktion.
- Sammlung `partnerbetriebe` (`src/payload-types.ts`, Typ `Partnerbetriebe`): `plz` (text), `ort` (text), `einsatzgebiet.postleitzahlen` (text), `einsatzgebiet.radiusKm` (number, 0 bis 300), `auftragsarten` (select hasMany), `werkstatt.vorhanden` ('ja' | 'nein'), `werkstatt.mobil` (boolean), `werkstatt.anschrift` (text), `geraete[]` (`art`, `hersteller`, `typ`), `erfahrung.jahre` (number), `erfahrung.schwerpunkte`, `erfahrung.fahrzeugabdeckung` (textarea), `pruefung.{gewerbeGeprueft,identitaetGeprueft,eignungGeprueft,notiz}` (Bestand), `bewerbung` (Relation Vorgang), Hooks `beforeValidate: [bewerbungUebernehmen]` und ein `beforeChange` (Auftragsarten, Statusautomat, Modell B).
- Statusautomat `src/lib/partner/bewerbung.ts` unverändert (`BEWERBUNG_STATUS`, `statuswechselPruefen`, `fehltFuerFreischaltung`).

Fehlt noch (Teil B):
- Prüfliste mit Datum, Prüfer und Notiz je Punkt, Besuch vor Ort mit Fotos als interne Dateien und dem Vermerk „Besuch nicht möglich“ mit Grund, Qualitätsstandard als Datei oder Vertragsverweis; Gate in `fehltFuerFreischaltung`.
- Stand `gesperrt` mit Grund und Datum (neuer Enum-Wert in `enum_partnerbetriebe_status`), Übergänge in `BEWERBUNG_UEBERGAENGE`, Warnung am Vorgang, Markierung laufender Aufträge.
- Relation zu Orten und Landkreisen (darf leer sein, FA-PLATTFORM-03) und die Funktion „welche freigeschalteten Partner decken diese Postleitzahl für diese Leistung ab“; der Radius ist heute nur gespeichert, nicht ausgewertet (es gibt keine Geodaten zur Postleitzahl).
- Lead-Verlauf am Vorgang, Gegenansicht am Partnerbetrieb, Filter „wartet auf Zuordnung“.
- Zuordnung Leistung des Auftrags zu einer der neun (siehe Offene Fragen, Sammelwert). Erst dann greifen Provisionen der einzelnen Leistungen gezielt; bis dahin gilt die Regel in `provisionsEintragWaehlen` (Sammelwert zuerst, sonst nur gleiche Einträge der neun).
- Pflichtpunkt: Umkreis auswerten. `passendePartner` und `plzPasst` (`src/lib/auftragsweg.ts`) werten nur Postleitzahlen-Muster aus; ein Partner nur mit Umkreis bekommt keinen Vorschlag. Bis dahin steht am Feld `einsatzgebiet.postleitzahlen` der Hinweis „Ohne Postleitzahlen keine Zuordnung“.
- Eine neue Migration in Teil B braucht einen eigenen Namen; diese hier heißt `partner_qualitaet`.

Hinweis: Während dieses Pakets lagen im Arbeitsbaum fremde, nicht von mir stammende Änderungen (Gehäuse und Customizing, Bericht FA-SHOP-02C). Ich habe sie nicht angefasst; `payload-types.ts` und die Migration enthalten nur Partneränderungen.

## Nachbesserung (16.11.2026, nach zwei Gegenprüfungen)
1. [rot] Auftragsart am Vorgang mit früheren Werten wählbar: behoben. `vermittlungVorAenderung` (`src/payload/hooks/vermittlung.ts`) lehnt einen neu gesetzten früheren Wert ab (`auftragsartAmVorgangPruefen`, gleiche Meldung wie am Partnerbetrieb); der Sammelwert bleibt, ein gespeicherter Altwert bleibt speicherbar. `Vorgaenge.ts` blieb unberührt (Schreibrecht nur Lead-Verlauf). Tests: `leistungen.test.ts`, `vermittlung.db.test.ts` („lässt eine frühere Auftragsart am Vorgang nicht neu setzen“). Der Bestandstest in `hooks/vermittlung.test.ts` wechselte bisher auf `montage-zylinder`; er nutzt jetzt `transponder` und prüft weiter dieselbe Wechselregel.
2. [rot] `provisionFuer` fand Provisionen der neun nie: behoben. Regel in `provisionsEintragWaehlen` (`src/lib/partner/leistungen.ts`): gleicher Wert zuerst; für den Sammelwert ohne eigenen Eintrag gelten die Einträge der neun, wenn sie alle gleich sind; weichen sie ab, kein Vorschlag und der Hinweis `HINWEIS_PROVISION_MEHRDEUTIG` mit „von Hand eintragen“. Es bleibt ein Vorschlag, von Hand änderbar; die Regel steht unter FÜR MENSCHEN zur Bestätigung. Tests: `leistungen.test.ts` („wählt die Provision für den Sammelwert nach fester Regel“), `vermittlung.db.test.ts` (Partner mit `schluessel-nachmachen` und 12 Prozent, Vorgang mit Sammelwert, Vorschlag 36,00 Euro).
3. [gelb] Hilfesatz im Formular: behoben. Neu: „Das Netz betrifft nur Autoschlüssel und Fahrzeugschlüssel. Fehlt eine Leistung rund um Fahrzeugschlüssel, beschreiben Sie sie unter „Erfahrung“ oder rufen Sie uns an.“
4. [gelb] Label Fahrzeugöffnung: behoben. Label jetzt im Wortlaut des Inhabers „Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln“ (Admin, Zusammenfassung, PDF, Partnerseiten über `PARTNER_LEISTUNGEN`); Beschreibung „Etwa wenn der Autoschlüssel im Fahrzeug liegt.“ Tests angepasst (`leistungen.test.ts`, `gewinnung.test.ts`).
5. [gelb] „mit wenigen Angaben“: zutreffend, außerhalb meiner Schreibrechte; als weitere Stellen für FA-PLATTFORM-02 unter FÜR MENSCHEN nachgetragen, mit Wortlautvorschlag.
6. [gelb] Partner nur mit Umkreis ohne Zuordnung: behoben im Rahmen von Teil A. Am Feld `einsatzgebiet.postleitzahlen` steht im Admin „Ohne Postleitzahlen keine Zuordnung: Der Umkreis wird noch nicht ausgewertet. Bitte Postleitzahlen eintragen.“; als Pflichtpunkt im Stand für Teil B.
7. [gelb] Zwei Namen für den Sammelwert: behoben. Eine Konstante `AUFTRAGSART_SAMMELWERT_NAME` = „Autoschlüssel allgemein“ für Auswahl und `auftragsartName`; Test „hat für den Sammelwert einen Namen in Auswahl und PDF“.
8. [gelb] `werkstatt.mobil: false` aus dem Admin-Formular: behoben. `bewerbungEinsetzen` überschreibt false, solange am gespeicherten Betrieb nicht ausdrücklich true steht. Tests: `leistungen.test.ts` und `partnerbetriebe.db.test.ts` (Anlegen mit `werkstatt: { mobil: false, vorhanden: null, anschrift: '' }` ergibt `mobil: true`).
9. [gelb] Provisionen mit früheren Werten neu setzbar: behoben. Der beforeChange-Hook des Partnerbetriebs prüft neue Provisionszeilen mit `provisionenPruefen` gegen `originalDoc.provisionen` (Sammelwert erlaubt); Satz in WAS UND WARUM Nr. 2 berichtigt. Test: `partnerbetriebe.db.test.ts` („lässt frühere Auftragsarten an den Provisionen nicht neu setzen“). Der Bestandstest „zeigt Provisionen nur dem Inhaber“ legte eine Provision auf `montage-zylinder` an; er nutzt jetzt `funk` und prüft weiter das Leserecht.
10. [gelb] Provisionen der neun greifen nicht: behoben mit Nr. 2; die Grenze (gezielte Provision je Leistung erst nach Zuordnung der Auftragsleistung) steht im Stand für Teil B. Dass jede einzelne Leistung den Sammelwert abdeckt, bleibt OFFENE FRAGE.
11. [gelb] Gerätefelder ohne Nummer: behoben. Labels „Gerät N: Hersteller“ und „Gerät N: Typ“ wie bei der Art.

Prüfung nach der Nachbesserung (alle über die Datenweiche):
- `sicher.sh --json -- npx vitest run`: 238 Dateien, 3723 Tests, alle grün
- `sicher.sh --json -- npm run typecheck`: ohne Fehler
- `sicher.sh --json -- npm run lint`: ohne Befund
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 26 Dateien, 157 Tests, alle grün
- `sicher.sh --json -- npm run build`: erfolgreich

Weitere geänderte Dateien der Nachbesserung: `src/payload/hooks/vermittlung.ts`, `src/payload/hooks/vermittlung.test.ts`, `src/lib/partner/gewinnung.test.ts`, `src/lib/partner/vermittlung.ts` (nur Kommentar).

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-PLATTFORM-01`, beide Pakete gemeinsam im Arbeitsbaum, nach allen Eingriffen): Typprüfung grün, Lint grün, Unit 3723 von 3723, Datenbanktests 157 von 157 (die neue Migration läuft dabei auf einer frischen Datenbank), Build 180 von 180 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 136 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Migration `20261116_072304_partner_qualitaet`: `up` gelesen, nur additiv (zwei neue Wertelisten, neun neue Werte in drei bestehenden Wertelisten, eine neue Tabelle für Geräte, sieben neue Spalten am Partnerbetrieb). Nichts wird gelöscht, umbenannt oder umgeschrieben (G6).

Erledigt außerhalb der Schreibrechte des Pakets:
- „Mit wenigen Angaben“ stimmt bei sieben Schritten nicht mehr. Neu: „Bewerben Sie sich online als Partner.“ (Beschreibung in `partner-werden/page.tsx`, `content/seo.json`, `defaults/content.ts`), „Sie bewerben sich online mit Angaben zu Betrieb, Leistungen und Ausstattung; …“ (Einleitung) und derselbe Gedanke in `src/lib/partner/gewinnung.ts`.
- „Service vor Ort“ (Tür, Schloss, Zylinder) versprach an fünf Stellen „die Werkstatt oder ein Partner“. Das Partnernetz gilt nach Abschnitt 7 der Arbeitsanweisung nur für Autoschlüssel und Fahrzeugschlüssel, und seit diesem Paket lässt sich ein solcher Auftrag auch nicht mehr neu an einen Partner vermitteln. Neu: „Wir klären, ob die Werkstatt zu Ihnen kommen kann.“ (`service-und-termin/vor-ort/page.tsx`, `einsatz-formular.tsx` zweimal) und in der Rubrik `schluesseldienst-vor-ort` (Erklärung und Ablaufschritt, `content/rubriken.json` und `defaults/rubriken.ts` wortgleich). Entscheidung A-064.

Browserprobe des Partnerformulars (Attrappen, nichts abgesendet, G5; Prüfserver mit dem Build der Abnahme), 390 und 1280 px:
- Fortschritt „Schritt 1 von 7“ bis „7 von 7“; jeder Pflichtschritt sperrt „Weiter“, bis die Angaben da sind (Betrieb, Region mit Radius, mindestens eine Leistung, Werkstatt mit Anschrift, Jahre).
- Radius 500 km wird nicht angenommen (Obergrenze 300 km).
- Schritt Leistungen: genau neun Auswahlfelder im Wortlaut des Inhabers, darunter „Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln“; der Satz, dass das Netz nur Autoschlüssel und Fahrzeugschlüssel betrifft und Türöffnungen nicht dazugehören, steht darüber.
- Zusammenfassung zeigt Region, Radius, Leistungen, Werkstatt und Erfahrung; „Zurück“ ohne Datenverlust; kein waagerechtes Rollen; keine Konsole-Fehler.
- Hinweis zur Probe: Beim Laden der Seite geht eine Anfrage an den Server (Formularschutz, Bestand). Eine Bewerbung wurde nicht abgesendet.

Nicht im Browser geprüft: der Admin (Partnerbetrieb mit den neuen Feldern, Sperre früherer Auftragsarten, Übernahme der Bewerbung). Das decken die Datenbanktests; eine Probe im Admin gehört zu FA-QA-01 mit lokaler Datenbank.

Beobachtungen ohne Änderung:
- Die Zusammenfassung des Formulars zeigt für leere Felder einen Strich als Platzhalter (Bestand, acht Stellen schon vorher). Für die Schlussredaktion vorgemerkt.
- Die neunte Leistung trägt im Formular den Satz „Sofern der Partner dies anbietet.“ (Wortlaut des Inhabers, im Formular an den Bewerber selbst gerichtet). Bleibt bis zur Schlussredaktion (MA-41).
- Die Partnerseite beschreibt weiter Abrechnungsmodell A (der Betrieb rechnet mit dem Kunden ab). Modell B liegt hinter dem Schalter und wartet auf MA-36.

=== ENDE FA-PLATTFORM-01 (Teil A) · BEREIT ZUR RÜCKGABE ===
