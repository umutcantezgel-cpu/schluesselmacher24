# FA-BLINDPRUEFUNG-02 · Gegenprüfung FA-KUNDSCHAFTER-02 (Abschnitt 06)

Stand 2026-11-15 · Rolle Blindprüfer · Stufe 3 · nur gelesen, keine Projektbefehle, kein git.
Quelle: `_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt` Z. 164-191.

## Zählung Abschnitt 06
Einleitung (1 Satz Pflicht: Klassen), Mindestumfang 6 Punkte (Punkt 2 vom Kundschafter in Modelle und Generationen geteilt), Pflichtuploads 4 Punkte, Kasten Fallback 3 Sätze. Summe 14 Anforderungen; Kundschafter: 15 plus 2 Ableitungen = 17. Alle Wortlaut-Anforderungen sind abgedeckt. Übersehen ist der Geltungsbereich „bei Autoschlüssel Anfragen“: Er umfasst auch die Wege Gehäuse und Motorrad (beide `area: 'autoschluessel'`) und den Ausstieg „Anfrage ohne Fotos senden“ im Termin-Weg.

## Nachgeprüft am Code: 17 · bestätigt 15 · geändert 2

### Korrekturen
- **FA-06-11 widerspricht → teilweise.** Die Anweisung verlangt „drei Fotos des *vorhandenen* Schlüssels“ (Z. 183). Bei Totalverlust gibt es keinen vorhandenen Schlüssel, die Ausnahme folgt also aus dem Wortlaut. Die echte Lücke ist schmaler: `schluesselfotosFreiwillig` (`unterlagen-pruefung.ts:18-19`) prüft nur `workingKeys === 0`. Ein noch vorhandener *defekter* Schlüssel muss dann nicht fotografiert werden; das steht nur als Bitte in `assistent.tsx:197-199` (HINWEIS_OHNE_SCHLUESSEL). Bau: Frage „Ist noch ein Schlüssel da, auch defekt?“ und Pflicht nur dann aufheben, wenn keiner da ist. Offene Frage 1 des Kundschafters ist damit weitgehend beantwortet.
- **FA-06-12 fehlt → teilweise.** Eine serverseitige Prüfung der Kategorie `schluesselfoto` gibt es bereits für zwei Autoschlüssel-Anfragewege: `records.ts:235-246` mit `QUELLE_RUBRIK` (`nachweis.ts:68-71`) für Motorrad und Gehäuse, Regeln aus den Rubrikdaten (`content/rubriken.json`, `pflichtUploads: ['fahrzeugschein','schluesselfoto']`, im Admin über die Sammlung Rubriken pflegbar), Funktion `pflichtUploadsPruefen` (`unterlagen-pflicht.ts:71-74`). Es fehlen: Termin-Weg, allgemeiner Fallback, Zählung und Position (drei Ansichten). Der Bau ist eine Erweiterung, kein Neubau.

### Bestätigt mit Ergänzungen (Urteil bleibt)
- FA-06-01/05/06: Katalog nur Pkw (Segmente inkl. WOHNMOBILE, `fahrzeugkatalog.json`), keine Krafträder, keine Kleinstfahrzeuge in `src`, `content`, `scripts`. Motorrad nur Freitext (`motorradschluessel/anfrage/kern.ts:2-4`).
- FA-06-02: 63 Marken bestätigt. Zusätzlich: **Cupra fehlt als Marke**; KBA führt Cupra-Modelle unter SEAT (`seat-born`, `seat-formentor`). `MARKEN_ALIAS` (`src/lib/fahrzeuge/suche.ts:21-31`) kennt „cupra“ nicht; die Suche „Cupra Born“ verwirft jede Reihe, weil ein Wort nicht passt (`suche.ts:93-99`). Gleiches Muster vermutlich bei Abarth (unter Fiat). Lücke ist also auch die Zuordnung von Untermarken, nicht nur die Schwelle.
- FA-06-03/04: 49 Zeilen mit Baujahr, 0 mit Baujahr bis, kein Generationsfeld bestätigt. QUELLEN.md nennt selbst „kein Baujahr, keine Generation“ als Lücke der KBA-Quelle.
- FA-06-07: Lizenz laut E1 ungeprüft, Rohdatei außerhalb des Arbeitsbaums (G13 gewollt). `BESTAND_QUELLE = 'Bestand: content/vehicles.json'` (`scripts/fahrzeuge-import.mjs`) ist kein Quellenvermerk im Sinne der Anweisung.
- FA-06-08/15/16: Der Kundschafter übersieht den zweiten Fallback im Termin-Weg: `fahrzeugZiel` (`fahrzeug-ziel.ts:53-61`) führt Treffer einer der 12 buchbaren Marken mit `modelOther` in den vollen Assistenten, ebenso die Karte „Mein Modell ist nicht aufgeführt“ (`assistent.tsx:1051-1058`). Dort gibt es drei Fotoslots, Fahrzeugschein und Serverprüfung. Das betrifft 288 von 624 Katalogzeilen (rund 80 % des Bestands). Nur die 51 übrigen Marken landen in der allgemeinen Anfrage. Außerdem ist der Hinweis „Mein Fahrzeug ist nicht dabei“ im Schritt Marke dauerhaft sichtbar (`assistent.tsx:1026-1031`), nicht nur bei null Treffern. Die Urteile bleiben „teilweise“: Der Wortlaut „Fahrzeug nicht gefunden?“ fehlt, auf den Markenseiten gibt es keinen festen Block, und der Fallback für fremde Marken hat keine Fotoslots.
- FA-06-09: bestätigt. Verschärfend: `OhneFotos` (`assistent.tsx:182-195`) bietet im Schritt Fotos *und* im Schritt Fahrzeugschein „Anfrage ohne Fotos senden“ an und führt in den Weg ohne Pflicht.
- FA-06-10, 13, 14, 17: bestätigt (`optionen.ts:184-185` „von der Seite“; Notiz im Termin-Weg freiwillig, `assistent.tsx:1582`; keine Ersatzunterlage, keine Treffer für Typschild, Betriebserlaubnis, Versicherungskennzeichen; Fallback-Seite ohne Hilfe-Zeile, `service-und-termin/anfrage/page.tsx`).

## Übersehen
- **FA-06-U1 Pflichtuploads in den Wegen Gehäuse und Motorrad** · teilweise · M. Gehäuse: ein Feld `schluesselfoto` mit bis zu drei Dateien, ohne Positionen, keine Beschreibung (`autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx:242-253`, `kern.ts:146` `anmerkung: null`). Motorrad: ein Schlüsselfoto, keine Beschreibung (`motorradschluessel/anfrage/anfrage-formular.tsx:86-87`, `kern.ts:146`). Fahrzeugschein ist in beiden Pflicht und serverseitig geprüft.
- **FA-06-U2 Ausstieg „Anfrage ohne Fotos senden“ hebt die Pflicht auf** · widerspricht · S. `assistent.tsx:182-195`, verwendet in Schritt 8 und 9. Die Anweisung nennt Schein, drei Fotos und Beschreibung „Pflichtuploads bei Autoschlüssel Anfragen“; der Ausstieg führt in ein Formular, das alles freiwillig macht (`service-und-termin/anfrage/anfrage-formular.tsx:289-290`). Mensch: entscheiden, ob „ohne Fotos“ als Erstkontakt erlaubt bleibt und wo die Pflicht dann greift (vor Fertigung, vor Angebot).
- **FA-06-U3 Untermarken und Markenaliase (Cupra, Abarth u. a.)** · teilweise · S. Siehe FA-06-02. Bau: Aliasliste pflegbar (heute Code-Konstante `MARKEN_ALIAS`), Untermarke als eigene Marke im Katalog.

## Risiken
- Konflikt mit Bestandsanforderung **G-19** („Motorradschlüssel nur als Anfrage … keine Fahrzeugdatenbank“, AUFTRAG.md:75; im Code `kern.ts:2-4`). Abschnitt 06 verlangt eine Motorraddatenbank. Der Inhaber muss die neuere Anweisung ausdrücklich über G-19 stellen.
- **Datenschutz, bestehender Mangel:** Der Fallback bittet um den Fahrzeugschein („legen Sie ihn gern schon hier bei“, `anfrage-formular.tsx:290`), lädt ihn aber als `dokument` hoch (`:163`). Für `dokument` gilt `projectDocuments` = 365 Tage (`kundendateien.ts:35-45`, `defaults/settings.ts:97-100`) statt 90 Tage für den Fahrzeugschein, die die Datenschutzangaben zusagen. Beim Bau des Fallbacks unbedingt Kategorie `fahrzeugschein` verwenden (G9: Fristen nicht ändern, nur richtig zuordnen).
- Tests, die brechen: `unterlagen-pruefung.test.ts` (Totalverlust ohne Fotos), `unterlagen-pflicht.test.ts`, `motorradschluessel/anfrage/kern.test.ts`, `autoschluessel/gehaeuse/anfrage/kern.test.ts`, `scripts/fahrzeuge-import.test.ts`, `src/lib/fahrzeuge/fahrzeuge.test.ts`. Anpassen nur mit Begründung, nie lockern (G8).
- Positionen der Fotos brauchen ein neues Feld an `UploadRef` und an der Vorgangs-Sammlung: nur additive Migration plus JSON-Fallback (G6).
- Datenlizenzen: KBA DL-DE BY 2.0 ungeprüft; Wikidata-SPARQL per robots.txt gesperrt; Motorrad-, Roller- und Kleinstfahrzeugdaten brauchen eine neue Quelle (KBA-Kraftradstatistik oder lizenzierte Datenbank, z. B. kostenpflichtig) und ggf. neue Bibliothek (G7, Denkprotokoll). Keine Daten aus dem Kopf (R4).
- Markenrecht: Herstellernamen nur sachlich, keine Logos (R12); bei Untermarken keine Verwechslung nahelegen.
- Ersatzunterlagen für Kleinstfahrzeuge berühren R13 (Berechtigungsnachweis): Ohne Zulassungsbescheinigung muss ein anderer Nachweis greifen; rechtliche Festlegung durch den Inhaber (R10).
- Pflicht für den Fahrzeugschein im Fallback verhindert Anfragen ohne Unterlagen; R9/UX: ältere Kunden brauchen den Telefonweg als gleichwertige Alternative.

## Offene Fragen
1. Gilt G-19 („keine Fahrzeugdatenbank“ für Motorrad) nach der Anweisung vom 2026-11-11 noch?
2. Bleibt „Anfrage ohne Fotos senden“ als Ausstieg erlaubt (FA-06-U2)?
3. Soll Cupra (und Abarth) als eigene Marke erscheinen, obwohl das KBA sie unter SEAT (Fiat) führt?
