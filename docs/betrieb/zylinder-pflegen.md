# Zylinder pflegen: Hersteller, Bauformen, Maße, Preise und Optionen

Diese Anleitung ist für das Team im Adminbereich unter `/admin`. Sie betrifft die Sperrschließungen (gleichschließende Zylinder) auf `/gleichschliessende-zylinder` und den Konfigurator. Alles hier geht ohne Entwickler.

Zwei Stellen in der Gruppe **Shop**:

- **Hersteller**: die Liste aller Hersteller, mit den Bereichen, in denen sie auf der Seite erscheinen.
- **Zylinderkatalog**: Grundwerte, Bauformen, Funktionen, Extras und die Hersteller für den Konfigurator.

Den Zylinderkatalog speichern darf nur der Inhaber. Preise ändert nur der Inhaber oder wer von ihm einen bestätigten Preis bekommen hat.

Weitere Anleitungen: [Shop pflegen](shop-pflegen.md), [Admin im Alltag](admin-alltag.md).

## 1. Hersteller und ihre Bereiche

Ein Hersteller steht nur einmal in **Shop › Hersteller**, in seiner eigenen Schreibweise (etwa „BKS“, „ABUS“).

1. Hersteller öffnen oder über **Neu erstellen** anlegen.
2. **Wir bieten Produkte dieses Herstellers an**: Mit diesem Haken erscheint er sofort auf der Startseite im Bereich „Systeme, mit denen wir arbeiten“.
3. **Bereiche**: Für jeden Bereich, in dem der Hersteller auf der Seite erscheinen soll, eine Zeile anlegen:
   - **Bereich**: „Sperrschließungen“ (Seite `/gleichschliessende-zylinder`) oder „Elektronischer Zutritt“ (Seite `/elektronische-zutrittsloesungen`).
   - **Wofür die Systeme in diesem Bereich eingesetzt werden**: ein sachlicher Satz, höchstens 300 Zeichen. Nur, was Sie belegen können. Keine Preise und keine Produktreihen, die wir nicht verbauen.
   - Jeden Bereich nur einmal. Doppelte lehnt das Speichern ab.
4. Ohne Bereich erscheint der Hersteller nur auf der Startseite, dann mit dem Text aus **Wofür die Systeme eingesetzt werden**.
5. **Logo** nur mit Datei und dem Haken **Freigabe liegt vor**. Ohne Freigabe zeigt die Seite den Namen als Schrift.

Die Texte für BKS, ABUS und BURG-WÄCHTER sind Startwerte aus Herstellerquellen. Vor dem Livegang gibt der Inhaber sie frei. Ändern Sie einen Text im Admin, bleibt Ihre Fassung; ein späteres Update überschreibt sie nicht. Leeren Sie die Bereiche bewusst, bleiben sie leer.

## 2. Hersteller im Zylinderkatalog

Reiter **Hersteller** im **Zylinderkatalog**:

1. **Hersteller hinzufügen**.
2. **Hersteller aus der Liste**: den Hersteller aus **Shop › Hersteller** wählen. Name und Kennung übernimmt der Eintrag beim Speichern von dort. Fehlt der Hersteller, zuerst Abschnitt 1.
3. **Angeboten**: Erst mit diesem Haken fragt der Konfigurator nach dem Hersteller. Solange kein Eintrag angeboten wird, gibt es diesen Schritt nicht.
4. **Aufpreis je Zylinder**, **Für Bauformen** (leer heißt alle) und **Zusatzkomponenten** mit Preis je Stück: nur mit bestätigten Preisen.

Ältere Einträge ohne Auswahl aus der Liste zeigen noch die Felder **Name (älterer Eintrag)** und **Kennung (älterer Eintrag)**. Sie bleiben gültig. Wählen Sie bei Gelegenheit oben den Hersteller aus der Liste; die beiden Felder verschwinden dann.

Hinweis: Der Konfigurator zeigt die Herstellerwahl, sobald ein Eintrag angeboten wird. Ohne hinterlegte Herstellerpreise rechnet er mit Aufpreis 0. Ob Sie das so wollen, entscheidet der Inhaber, bevor Sie den Haken **Angeboten** setzen.

## 3. Bauformen

Reiter **Bauformen**. Angeboten werden heute Doppelzylinder, Knaufzylinder und Halbzylinder. Eine weitere Bauform braucht eine Erweiterung durch den Entwickler.

- **Bezeichnung** und **Beschreibung**: wie der Kunde sie liest.
- **Angeboten**: ohne Haken verschwindet die Bauform aus dem Konfigurator.
- **Abgefragte Maße**: „Außen und innen“ (Maß A und Maß B) oder „Nur eines“ (Halbzylinder).

## 4. Maße

Je Bauform:

- **Kleinstes Maß** und **Größtes Maß** in Millimetern: der wählbare Bereich je Seite.
- **Schritt**: meist 5 mm. Wählbar sind das kleinste Maß und dann jedes Vielfache des Schritts.
- **Grundlänge**: bis zu dieser Gesamtlänge (A plus B) gilt der Grundpreis.

Maßbereiche ändern Sie nur nach Rücksprache mit der Werkstatt. Bestellungen im Warenkorb mit einem Maß, das es danach nicht mehr gibt, lehnt die Kasse mit einer Meldung ab.

## 5. Preise

Alle Beträge in Euro inklusive Umsatzsteuer, höchstens zwei Nachkommastellen.

- **Grundwerte**: **Preis je weiterem Schlüssel**, **Schlüssel inklusive**, **Höchstens Schlüssel**, **Höchstens Zylinder**.
- **Bauformen**: **Grundpreis** und **Aufpreis je angefangene 5 mm** über der Grundlänge.
- **Funktionen**: **Aufpreis** je Zylinder.
- **Extras**: **Preis**, einmal je Bestellung oder je Zylinder.
- **Hersteller**: **Aufpreis je Zylinder** und Preise der **Zusatzkomponenten**.

Der Konfigurator und die Kasse rechnen nur mit diesen Werten. Die Kasse rechnet jede Bestellung neu.

### Preis nicht bestätigt

Jede Bauform, jede Funktion, jedes Extra, jeder Hersteller und der Schlüsselpreis haben den Haken **Preis nicht bestätigt**. Er ist im Bestand nicht gesetzt.

Setzen Sie ihn, solange ein Preis nicht geprüft ist. Dann:

- lässt sich keine Zusammenstellung mit diesem Eintrag bestellen, auch nicht aus einem älteren Warenkorb; die Kasse nennt dann den Weg über den Konfigurator in die Anfrage;
- zeigt die Seite `/gleichschliessende-zylinder` bei diesem Eintrag „Preis auf Anfrage“ statt eines Betrags;
- zeigt der Konfigurator beim Eintrag „Preis auf Anfrage“ und in Summen „auf Anfrage“. Er führt mit dem Link **Zusammenstellung als Anfrage schicken** in den Schließplan-Planer. Dort schickt der Kunde seine Zylinder als Anfrage und bekommt von uns ein Angebot. Ist die Zusammenstellung zu groß für einen Link, führt er in die allgemeine Anfrage, und der Kunde nennt seine Angaben dort selbst;
- bleibt der eingetragene Preis unverändert stehen.

Beim Schlüsselpreis greift der Haken nur, wenn der Kunde mehr Schlüssel wählt, als inklusive sind. Sobald der Preis bestätigt ist, Haken entfernen und speichern; danach ist alles wieder bestellbar.

## 6. Funktionen und Optionen

- **Funktionen** (etwa Not- und Gefahrenfunktion): **Für Bauformen** legt fest, wo sie wählbar sind. Die Standardfunktion ohne Aufpreis bleibt bitte immer angeboten.
- **Extras**: Zusatzoptionen wie Sicherungskarte, Aufbohr- und Ziehschutz, Erweiterbar reservieren und Schlüsselanhänger. Die Kennungen `gleichschliessung-erweiterbar` und `ziehschutz` sind mit Fragen im Konfigurator verbunden; bitte nicht ändern.
- **Produktsicherheit**: Angaben, die für alle Zylinder des Katalogs gelten.

## 7. Prüfen nach dem Speichern

1. `/gleichschliessende-zylinder` öffnen: Stimmen die Hersteller im Bereich „Systeme, mit denen wir arbeiten“?
2. Den Konfigurator durchgehen, mindestens zwei Positionen mit verschiedenen Maßen, und die Summe mit Ihrer Preisliste vergleichen.
3. Bei gesetztem Haken **Preis nicht bestätigt**: Die Zusammenfassung zeigt „auf Anfrage“ und den Link **Zusammenstellung als Anfrage schicken**; „In den Warenkorb“ ist gesperrt.
