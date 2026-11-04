# E6-OPUS-04-T2 · Vorgangsblatt: Preis, Bestätigungen, Lieferung und Versand, ehrliche Fotovorschau, Anhang in der Betriebsmail

## 1. Kopfzeile
Kennung E6-OPUS-04-T2 (Teil 2 von E6-OPUS-04, an Haiku vergeben) · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Anforderung G-37 · Schreibrechte: `src/lib/pdf/vorgangsblatt.ts`, `src/lib/pdf/vorgangsblatt.test.ts`, `src/lib/mail/vorlagen/betrieb-neuer-vorgang.ts`, `src/lib/mail/vorlagen.test.ts`, `src/lib/server/benachrichtigungen.ts` (nur die Stelle, an der die Eingangsmail an das Team gebaut wird), `src/lib/server/benachrichtigungen.test.ts`

## 2. Rollenbriefing
Baumeister: ergänzt nach vorhandenem Muster, erfindet nichts dazu. Fehler: Preise, Beträge, Rechtstexte oder Zahlungslogik verändern (G9), Datensparsamkeit aus A-015 aufweichen (welche Fotos als Bild erscheinen, wie viele), neue Formulierungen für Zustimmungen erfinden statt die Bezeichnungen aus dem Backend zu übernehmen, Texte mit Gedankenstrichen, Logik ohne Test.
Lies zuerst `_werkstatt/ausbau/pakete/_GEMEINSAM.md` und halte dich daran.

## 3. Aufgabe in einem Satz
Ergänze das Vorgangsblatt (`vorgangsblattInhalt`) um die Abschnitte „Preis (vom Server ermittelt)“, „Bestätigungen des Kunden“ und „Lieferung und Versand“, mache die Angabe zur Fotovorschau ehrlich und lass die Eingangsmail an das Team sagen, ob das Blatt anhängt.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer Schlüsselwerkstatt in Wetzlar. Jeder neue Vorgang erzeugt für das Team ein PDF, das Vorgangsblatt (`src/lib/pdf/vorgangsblatt.ts`, Datenmodell `src/lib/pdf/blatt.ts`, Zeichnen `src/lib/pdf/erzeuge-pdf.ts`); es hängt an der Mail „eingang-team“ (`src/lib/server/benachrichtigungen.ts`, Funktion `vorgangsblattAnhang` und ihr Aufruf) und ist im Backend abrufbar. Heute fehlen im Blatt der vom Server ermittelte Preis (`vorgang.quote`, Typ `PriceQuote` in `src/lib/types.ts`), die Zustimmungen (`vorgang.consents`, Typ `RecordConsents`), einzelne Bestätigungen aus dem `payload` und Lieferhinweis und Sendung. A-015 legt fest: Vorschaubilder nur für Schlüsselfoto, Objektfoto und Grundriss, höchstens sechs (`VORSCHAU_ARTEN`, `VORSCHAU_HOECHSTENS`); das bleibt so. Die Mail an das Team nennt den Anhang bisher nicht.

## 5. Kern-Auszug (unveränderlich)
- G-37: „Jede Anfrage erzeugt für den Inhaber ein strukturiertes PDF mit allen Angaben und Fotos, angehängt an die Benachrichtigung und im Admin abrufbar, damit keine Rückfragen nötig sind.“
- A-015: Dokumente und Fahrzeugscheine nie als Bild; Vorschau höchstens sechs Bilder. `VORSCHAU_ARTEN` und `VORSCHAU_HOECHSTENS` bleiben unverändert.
- G9: Preise, Beträge, Rechtstexte und Zahlungsabläufe bleiben unverändert; das Blatt zeigt nur an, was gespeichert ist.
- Ton (K-010): keine Gedankenstriche (– und —), keine Ausrufezeichen.

## 6. Maßstab
In `vorgangsblattInhalt`, jeweils nur, wenn es etwas zu zeigen gibt (sonst kein Abschnitt):
1. **„Preis (vom Server ermittelt)“** direkt vor dem Abschnitt „Zahlung“, aus `vorgang.quote`. Zeilen: „Preisart“ mit `fest` → „Festpreis“, `rahmen` → „Preisrahmen“, `pruefung` → „Preis nach Prüfung“; „Preis“ bei `fest` `formatCents(priceCents)`, bei `rahmen` „<von> bis <bis>“ mit `formatCents`, sonst leer; „Anzahlung“ `formatCents(depositCents)`; „Rest nach Anzahlung“ aus `remainderCents`, wenn gesetzt; „Dauer“ mit der vorhandenen `formatDuration(slotMinutes)`; „Vorlauf“ „<n> Tage“ (bei 1 „1 Tag“); „Fahrzeug vor Ort nötig“ „ja“ oder „nein“; „Hinweis“ aus `note`. Leere Werte wie in den vorhandenen Abschnitten (prüfe in `erzeuge-pdf.ts`, wie leere Werte gezeichnet werden, und folge dem Muster des Abschnitts „Zahlung“).
2. **„Bestätigungen des Kunden“** nach „Freigabe“ und vor „Unterlagen“. Aus `vorgang.consents` je gesetztem `true` eine Zeile mit dem Wert „ja“; die Namen übernimmst du wörtlich aus den Bezeichnungen der Gruppe `zustimmungen` in `src/payload/collections/Vorgaenge.ts` (terms → „AGB“, withdrawalNotice → „Widerrufsbelehrung“, earlyStart → „Beginn vor Ende der Widerrufsfrist“, customMade → „Sonderanfertigung (kein Widerruf)“, deposit → „Anzahlung“, authorization → „Berechtigung“; prüfe die Zuordnung der Felder in `src/lib/data/payload-mapping.ts`), dazu „Zeitpunkt“ aus `at` (Format wie `uhr(...)`) und „Fassung der Rechtstexte“ aus `version`. Dazu aus `vorgang.payload`, nur bei Wert `true`: `berechtigt` → „Berechtigung (vor Ort nachzuweisen)“, `datenschutz` → „Datenschutzhinweis bestätigt“, `consent` → „Einwilligung erteilt“, `legalNoticeShown` → „Rechtlicher Hinweis angezeigt“.
3. **„Lieferung und Versand“** nach „Bestätigungen des Kunden“: „Lieferhinweis“ aus `payload.deliveryNote` (nur nicht leere Zeichenkette), „Versanddienst“ aus `vorgang.shipment.carrier` über `DIENSTLEISTER` aus `src/lib/mail/vorlagen/status.ts` (dort bereits exportiert), „Sendungsnummer“ aus `vorgang.shipment.trackingNumber` (Zeile mit `mono: true`).
4. **Fotovorschau ehrlich**: In der Tabelle „Unterlagen“ steht „im Backend, Vorschau unten“ nur, wenn zu dieser Datei wirklich ein Bild in `bilder` gezeichnet wird (Zuordnung über den Dateinamen `BlattBild.name`; prüfe in `src/lib/pdf/vorschaubilder.ts`, welchen Namen die Bilder tragen); sonst „im Backend“. Gibt es mehr vorschaufähige Fotos (Kategorie in `VORSCHAU_ARTEN`, mit `storageKey`) als Bilder, bekommt der Abschnitt den Text „Vorschau der ersten <n> von <m> Fotos. Alle Fotos stehen im Backend.“ (Feld `text` des Abschnitts; prüfe in `erzeuge-pdf.ts`, dass Tabelle, Text und Bilder zusammen gezeichnet werden, sonst setze den Text in einen eigenen Abschnitt „Hinweis zur Vorschau“ direkt danach).
5. **Mail „eingang-team“** (`betrieb-neuer-vorgang.ts`): neuer, freiwilliger Parameter `anhang?: 'angehaengt' | 'fehlgeschlagen'`. Der letzte Absatz lautet bei `angehaengt`: „Das Vorgangsblatt mit allen Angaben hängt als PDF an. Kontaktdaten, Angaben und Unterlagen stehen auch im Backend.“, bei `fehlgeschlagen`: „Das Vorgangsblatt konnte nicht als PDF erzeugt werden. Im Backend können Sie es abrufen. Kontaktdaten, Angaben und Unterlagen stehen dort.“, sonst unverändert. In `benachrichtigungen.ts` beim Bau dieser Mail: `anhang: anhaenge ? 'angehaengt' : 'fehlgeschlagen'`. Sonst nichts an der Datei ändern.
6. **Tests** (nur erfundene Testdaten, G4): in `vorgangsblatt.test.ts` je ein Fall für Termin mit `quote` (fest und rahmen), Bestellung mit `consents` (terms, withdrawalNotice, customMade, at, version), `payload.deliveryNote` und `shipment`, Partner mit `payload.datenschutz`, Foto-Anfrage mit acht Schlüsselfotos und sechs `bilder` (Text „Vorschau der ersten 6 von 8 Fotos …“), Unterlagen ohne `bilder` (kein „Vorschau unten“), Vorgang ohne all das (keiner der neuen Abschnitte). In `vorlagen.test.ts` die beiden Fassungen des letzten Absatzes. In `benachrichtigungen.test.ts` prüfen, dass die Eingangsmail den Anhang-Satz trägt, wenn das PDF erzeugt wurde.

## 7. Grenzen
G4, G5, G8, G9, A-015. Nur die Schreibrechte aus Abschnitt 1. Kein Build, kein Commit.

## 8. Schritte
1. Lies `vorgangsblatt.ts`, `blatt.ts`, `erzeuge-pdf.ts` (wie Zeilen, leere Werte, Text und Bilder gezeichnet werden), `vorschaubilder.ts`, die Gruppe `zustimmungen` in `Vorgaenge.ts`, die Abbildung der Zustimmungen in `payload-mapping.ts`, `betrieb-neuer-vorgang.ts` und die Stelle in `benachrichtigungen.ts`.
2. Ändere nach Abschnitt 6.
3. Prüfe: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run src/lib/pdf src/lib/mail src/lib/server`, `… sicher.sh --json -- npx tsc --noEmit -p .`, `… sicher.sh --json -- npx eslint src/lib/pdf src/lib/mail src/lib/server`.

## 9. Selbstprüfung
`VORSCHAU_ARTEN` und `VORSCHAU_HOECHSTENS` unverändert; keine Änderung an Preisen, Beträgen oder Zahlungslogik; Bezeichnungen der Zustimmungen wörtlich aus dem Backend; neue Abschnitte nur mit Inhalt; kein `—`, kein `–`, kein Ausrufezeichen; Tests, Typprüfung und Lint grün.

## 10. Ausgabe
Geänderte Dateien und das Ergebnis über das Ausgabeschema.
