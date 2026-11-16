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
4. Ohne Bereich erscheint der Hersteller auf keiner der beiden Seiten. Die Startseite zeigt dann den Text aus **Wofür die Systeme eingesetzt werden**. Auf seiner Herstellerseite bei Schlüssel nach Code steht dieser Text immer, mit oder ohne Bereich.
5. **Logo** nur mit Datei und dem Haken **Freigabe liegt vor**. Ohne Freigabe zeigt die Seite den Namen als Schrift.

Die Texte für BKS, ABUS und BURG-WÄCHTER sind Startwerte aus Herstellerquellen. Vor dem Livegang gibt der Inhaber sie frei. Ändern Sie einen Text im Admin, bleibt Ihre Fassung; ein späteres Update überschreibt sie nicht. Leeren Sie die Bereiche bewusst, bleiben sie leer.

## 2. Hersteller im Zylinderkatalog

Reiter **Hersteller** im **Zylinderkatalog**:

1. **Hersteller hinzufügen**.
2. **Hersteller aus der Liste**: den Hersteller aus **Shop › Hersteller** wählen. Name und Kennung übernimmt der Eintrag beim Speichern von dort. Fehlt der Hersteller, zuerst Abschnitt 1.
3. **Angeboten**: Erst mit diesem Haken fragt der Konfigurator nach dem Hersteller. Solange kein Eintrag angeboten wird, gibt es diesen Schritt nicht.
4. **Aufpreis je Zylinder**, **Für Bauformen** (leer heißt alle) und **Zusatzkomponenten** mit Preis je Stück: nur mit bestätigten Preisen.

Die Felder **Name** und **Kennung** sind nur lesbar. Sie kommen beim Speichern aus dem gewählten Hersteller. Ältere Einträge ohne Auswahl aus der Liste behalten dort ihre bisherigen Werte und bleiben gültig. Wählen Sie bei Gelegenheit oben den Hersteller aus der Liste; beim Speichern übernimmt der Eintrag dann Name und Kennung von dort.

Hinweis: Der Konfigurator zeigt die Herstellerwahl mit Preisregel, sobald ein Eintrag angeboten wird. Ohne hinterlegte Herstellerpreise rechnet er mit Aufpreis 0. Ob Sie das so wollen, entscheidet der Inhaber, bevor Sie den Haken **Angeboten** setzen.

Ohne angebotenen Eintrag im Zylinderkatalog fragt der Konfigurator trotzdem nach dem Hersteller: Er zeigt alle Hersteller aus **Shop › Hersteller**, die angeboten sind und den Bereich „Sperrschließungen“ tragen (heute BKS und ABUS), dazu „Keine Vorgabe“. Diese Wahl ist eine Angabe für die Werkstatt ohne Preiswirkung; der Kunde liest „Ihre Wahl geben wir an die Werkstatt weiter. Sie ändert die Summe nicht.“ Sie steht in Zusammenfassung, Warenkorb, Kasse und in der Bestellposition („Hersteller (Ihre Wahl)“), damit auch im Vorgangsblatt der Mail an den Betrieb. Siehe Abschnitt 8.

## 3. Bauformen

Reiter **Bauformen**. Angeboten werden heute Doppelzylinder, Knaufzylinder und Halbzylinder. Eine weitere Bauform braucht eine Erweiterung durch den Entwickler. Bis dahin steht im Konfigurator unter den Türen der Link **Andere Bauform anfragen**; er öffnet die Anfrage mit dem Thema „Gleichschließende Zylinder“ und der Vorbelegung „Andere Zylinder-Bauform“.

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
- zeigt der Konfigurator beim Eintrag „Preis auf Anfrage“ und in Summen „auf Anfrage“. Am Ende gibt es keinen Knopf „In den Warenkorb“, sondern den Knopf und den Link **Zusammenstellung als Anfrage schicken**. Beide führen in den Schließplan-Planer, mit Zylindern, Maßen, Schlüsseln, Ziehschutz, Erweiterung, den übrigen Optionen (etwa Sicherungskarte) und dem gewählten Hersteller. Dort schickt der Kunde seine Zylinder als Anfrage und bekommt von uns ein Angebot. Ist die Zusammenstellung zu groß für einen Link, führt er in die allgemeine Anfrage, und der Kunde nennt seine Angaben dort selbst;
- bleibt der eingetragene Preis unverändert stehen.

Beim Schlüsselpreis greift der Haken nur, wenn der Kunde mehr Schlüssel wählt, als inklusive sind. Sobald der Preis bestätigt ist, Haken entfernen und speichern; danach ist alles wieder bestellbar.

## 6. Funktionen und Optionen

- **Funktionen** (etwa Not- und Gefahrenfunktion): **Für Bauformen** legt fest, wo sie wählbar sind. Die Standardfunktion ohne Aufpreis bleibt bitte immer angeboten.
- **Extras**: Zusatzoptionen wie Sicherungskarte, Aufbohr- und Ziehschutz, Erweiterbar reservieren und Schlüsselanhänger. Die Kennungen `gleichschliessung-erweiterbar` und `ziehschutz` sind mit Fragen im Konfigurator verbunden; bitte nicht ändern.
- **Produktsicherheit**: Angaben, die für alle Zylinder des Katalogs gelten.

## 7. Prüfen nach dem Speichern

1. `/gleichschliessende-zylinder` öffnen: Stimmen die Hersteller im Bereich „Systeme, mit denen wir arbeiten“?
2. Den Konfigurator durchgehen, mindestens zwei Positionen mit verschiedenen Maßen, und die Summe mit Ihrer Preisliste vergleichen.
3. Bei gesetztem Haken **Preis nicht bestätigt**: Die Zusammenfassung zeigt „auf Anfrage“ und den Link **Zusammenstellung als Anfrage schicken**; statt „In den Warenkorb“ steht unten der Knopf **Zusammenstellung als Anfrage schicken**. Im Schließplan-Planer stehen danach dieselben Türen, Optionen und der Hersteller.

## 8. So bedient der Kunde den Konfigurator

Der Konfigurator `/gleichschliessende-zylinder/konfigurator` fragt in dieser Reihenfolge. Was der Kunde wählt, steht in der Zusammenfassung, im Warenkorb, in der Kasse und in der Bestellposition.

1. **Hersteller**: mit angebotenem Eintrag im Zylinderkatalog die Einträge dort mit ihrem Aufpreis (Abschnitt 2). Sonst die Hersteller aus **Shop › Hersteller** mit Bereich „Sperrschließungen“ und „Keine Vorgabe“, ohne Preiswirkung. Einen Hersteller bieten Sie an, indem Sie ihm in **Shop › Hersteller** den Bereich „Sperrschließungen“ geben und **Wir bieten Produkte dieses Herstellers an** setzen. Ein Logo erscheint nur mit Datei und **Freigabe liegt vor**, sonst der Name. Gibt es weder Katalogeintrag noch Hersteller mit diesem Bereich, entfällt der Schritt.
2. **Zylinder**: je Tür eine Position mit Bauform, Maß A und Maß B (beim Halbzylinder nur Maß A), Funktion (etwa Not- und Gefahrenfunktion) und Stückzahl. Positionen mit verschiedenen Maßen und Bauformen gehören zu derselben Schließung. Bauformen und Maße kommen aus den Abschnitten 3 und 4. Fehlt eine Bauform: **Andere Bauform anfragen**.
3. **Schlüssel**: Zahl der gemeinsamen Schlüssel, zwischen 1 und **Höchstens Schlüssel**.
4. **Optionen**: die angebotenen Extras, etwa **Sicherungskarte und geschütztes System** und **Aufbohr- und Ziehschutz**, dazu die Zusatzkomponenten des gewählten Katalog-Herstellers.
5. **Erweiterung**: Ja oder Nein. „Ja“ wählt die Option **Erweiterbar reservieren** mit.
6. **Zusammenfassung**: alle Angaben, der Preis aus dem Katalog und der Knopf **In den Warenkorb**. Ist ein genutzter Preis nicht bestätigt (Abschnitt 5), kein Betrag und kein Warenkorb, sondern **Zusammenstellung als Anfrage schicken**.

Preis sperren: Haken **Preis nicht bestätigt** am Eintrag setzen (Abschnitt 5). Der eingetragene Betrag bleibt stehen, verkauft wird er erst nach dem Entfernen des Hakens.

Die Herstellerwahl aus dem Stamm ändert den Preis nicht. Soll ein Hersteller einen Aufpreis haben, legen Sie ihn im Zylinderkatalog an (Abschnitt 2); dann gilt dort dessen Preisregel, und die Wahl aus dem Stamm entfällt.
