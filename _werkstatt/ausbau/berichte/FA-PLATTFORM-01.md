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
2. Alte Werte bleiben lesbar (G6): Die Migration ergänzt die Postgres-Enums nur (`ADD VALUE … BEFORE`), nichts wird gelöscht. In der Auswahl tragen Schlüsseldienst vor Ort, Montage Zylinder, Montage Schließanlage, Beratung vor Ort und Einbau Elektronik den Zusatz „früher:“. Am Partnerbetrieb lässt der Hook sie nicht neu setzen (`auftragsartenPruefen`); was ein Betrieb schon hat, bleibt speicherbar und lässt sich entfernen.
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
- Datenschutz: Die Bewerbung erhebt jetzt mehr Angaben (Werkstattanschrift, Geräte, Erfahrung). Ob `src/lib/rechtliches/verarbeitungen.ts` und die Datenschutzhinweise das abdecken, prüft der Anwalt (R10).
- Weitere Stellen außerhalb meiner Schreibrechte, die nicht zu den neun passen: Rubrik „Schlüsseldienst vor Ort“ mit Verweis auf Partner (`content/rubriken.json`, siehe FA-ABGLEICH Block 03), Partner-Gewinnungsseiten nennen Leistungen nur über `PARTNER_LEISTUNGEN` (passt). Der Partnervertrag (MA-29) bleibt Entwurf.
- Öffentliche Partnerprofile (Punkt 8, nicht gebaut): nötig wären schriftliche Zustimmung jedes Partners zur Veröffentlichung von Name, Ort und Leistungen, eigene Felder für freigegebene Profiltexte und Logo, ein Schalter „Profil öffentlich“ am Partnerbetrieb, Ergänzung der Datenschutzhinweise und Transparenz, wer ausführt (R4, R5, R8).

## Stand für Teil B
Nutzbar:
- `src/lib/partner/leistungen.ts`: `PartnerLeistung` (Typ), `PARTNER_LEISTUNGEN_LISTE`, `AUFTRAGSART_OPTIONEN`, `AUFTRAGSART_SAMMELWERT`, `FRUEHERE_AUFTRAGSARTEN`, `istPartnerLeistung`, `auftragsartName`, `nichtMehrWaehlbar`, `decktAuftragsart(partnerArten, auftragsart)`.
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
- Zuordnung Leistung des Auftrags zu einer der neun (siehe Offene Fragen, Sammelwert).
- Eine neue Migration in Teil B braucht einen eigenen Namen; diese hier heißt `partner_qualitaet`.

Hinweis: Während dieses Pakets lagen im Arbeitsbaum fremde, nicht von mir stammende Änderungen (Gehäuse und Customizing, Bericht FA-SHOP-02C). Ich habe sie nicht angefasst; `payload-types.ts` und die Migration enthalten nur Partneränderungen.

=== ENDE FA-PLATTFORM-01 (Teil A) · BEREIT ZUR RÜCKGABE ===
