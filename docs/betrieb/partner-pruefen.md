# Partnerbetrieb prüfen, freischalten, pausieren und sperren

Diese Anleitung ist für das Team im Adminbereich. Sie zeigt, wie aus einer Bewerbung ein aktiver Partnerbetrieb wird, wie Sie ihn bei Problemen pausieren oder sperren, wie Sie ihm eine Region zuordnen und wie Sie ihm einen Lead anbieten oder zuteilen.

Das Partnernetz betrifft nur Autoschlüssel und Fahrzeugschlüssel. Alle Angaben zu Betrieben, Besuchen und Verträgen stehen nur in der Datenbank, nie in Dateien des Projekts.

## 1. Bewerbung prüfen

Bewerbungen kommen als Vorgang der Art „Partner-Bewerbung“ an (Nummer mit „N“, etwa SM24-N-2026-0001).

1. Unter **Aufträge > Partnerbetriebe** einen neuen Partnerbetrieb anlegen: Firma und Ort genügen.
2. Im Feld **Bewerbung (Vorgang)** die Bewerbung wählen und speichern. Die Seite übernimmt Kontakt, Region, Leistungen, Geräte, Werkstatt und Erfahrung aus dem Formular, soweit die Felder noch leer sind.
3. **Stand** auf „In Prüfung“ setzen.

## 2. Prüfliste abarbeiten

Am Partnerbetrieb, Gruppe **Prüfliste vor der Freischaltung**. Oben steht, was noch offen ist.

| Punkt | Was Sie prüfen |
|---|---|
| Identität und Betrieb | Ausweis der Ansprechperson, Gewerbe, Anschrift |
| Leistungsumfang und Fahrzeugabdeckung | Welche der neun Leistungen, welche Marken und Baujahre |
| Maschinen, Programmiergeräte, Werkstatt | Geräte und Ausstattung, feste Werkstatt oder nur mobil |
| Region und Radius | Postleitzahlen des Einsatzgebiets und Umkreis |
| Besuch vor Ort | Siehe Abschnitt 3 |
| Qualitätsstandard schriftlich | Datei oder Verweis auf den Vertrag, etwa „Partnervertrag, Anlage Qualität“ |

Je Punkt **Erledigt** anhaken und eine Notiz schreiben. Datum und Prüfer setzt die Seite beim Abhaken selbst, wenn Sie sie leer lassen. Sie können beides auch selbst eintragen.

Die bisherigen Häkchen unter **Prüfung vor der Freischaltung** (Gewerbe, Identität, fachliche Eignung) bleiben zusätzlich Pflicht.

## 3. Besuch vor Ort

Vor der endgültigen Freischaltung besuchen Sie den Betrieb nach Möglichkeit persönlich.

- **Besucht am**, **Besucht von** und **Ergebnis** eintragen. Freischalten geht nur mit „geeignet“ oder „geeignet mit Auflagen“.
- Fotos vom Besuch unter **Fotos vom Besuch** hochladen. Sie landen als interne Dateien und sind nur für das Team sichtbar.
- Geht ein Besuch nicht, **Besuch nicht möglich** anhaken und den **Grund** eintragen. Ohne Grund speichert die Seite nicht, und auch nicht, wenn schon ein Ergebnis des Besuchs eingetragen ist. Ein Besuch mit Ergebnis „nicht geeignet“ sperrt die Freischaltung immer.

## 4. Freischalten

1. Vertrag versenden: Stand „Vertrag versendet“, Datum unter **Vertrag**.
2. Unterschriebenen Vertrag als Datei hinterlegen, **Unterschrieben am** eintragen, Stand „Vertrag unterschrieben“.
3. Stand **Freigeschaltet** setzen. Fehlt noch etwas, nennt die Seite beim Speichern jeden offenen Punkt.

Betriebe, die schon vor der Prüfliste freigeschaltet waren, tragen den Vermerk „Vor Einführung der Prüfliste freigeschaltet“. Sie bleiben freigeschaltet. Holen Sie die Prüfliste bei Gelegenheit nach; oben steht, was offen ist.

## 5. Pausieren und sperren

Bei Qualitätsproblemen:

- **Pausiert**: vorübergehend, etwa Urlaub, Krankheit oder eine offene Klärung.
- **Gesperrt**: ernstes Qualitätsproblem.

So geht es: In der Gruppe **Pausieren oder sperren** den **Grund** eintragen und im selben Schritt den Stand auf „Pausiert“ oder „Gesperrt“ setzen. Ohne Grund speichert die Seite nicht; solange der Betrieb pausiert oder gesperrt ist, lässt sich der Grund ändern, aber nicht leeren. Datum und Ihren Namen setzt die Seite.

Was dann passiert:

- Der Betrieb bekommt keine neue Zuordnung. Er erscheint nicht mehr in der Auswahl am Vorgang und nicht in den Vorschlägen. „An Partner vermittelt“ und „vom Partner angenommen“ lehnt die Seite ab.
- Laufende Leads dieses Betriebs bleiben sichtbar. Sie bekommen im Lead-Verlauf den Eintrag „zur Klärung“ und eine Notiz. Am Vorgang steht oben eine Warnung. Klären Sie jeden dieser Vorgänge und ordnen Sie ihn bei Bedarf über „geprüft“ einem anderen Betrieb zu.
- An Auszahlungen ändert die Sperre nichts von selbst. Ob ein gesperrter Betrieb für schon ausgeführte Aufträge ausgezahlt wird, entscheidet der Inhaber.

Aufheben: Stand zurück auf „Freigeschaltet“. Der Eintrag zur Pause oder Sperre wandert in die interne Notiz. Nach einer **Sperre** gilt dabei immer die volle Prüfliste, auch für Betriebe aus der Zeit vor der Prüfliste.

## 6. Region zuordnen

Gruppe **Einsatzgebiet**:

- **Postleitzahlen**: kommagetrennt, auch Bereiche wie `355*`.
- **Umkreis (km)**: Luftlinie um die **Postleitzahl des Betriebs** (Feld oben neben dem Ort), gemessen zwischen den Mittelpunkten der Postleitzahlen im Ortsstamm. Fehlt die Postleitzahl des Betriebs oder steht sie nicht im Ortsstamm (Postleitzahlen von Großempfängern und Postfächern fehlen dort bewusst), wirkt der Umkreis nicht. 0 oder leer heißt: kein Umkreis. Der Umkreis kommt aus der Bewerbung (Einsatzradius, bis 300 km). Prüfen Sie ihn vor dem Freischalten; er gilt ab dann. Das gilt auch für Betriebe, die schon freigeschaltet sind: Ihr Umkreis aus der Bewerbung zählt jetzt mit.
- **Orte und Landkreise**: freiwillig. Ausgewertet wird nur der amtliche Schlüssel: ein **Ort** mit Gemeindeschlüssel (8 Ziffern, etwa `06532023` für Wetzlar), ein **Landkreis** mit Kreisschlüssel (5 Ziffern, etwa `06532` für den Lahn-Dill-Kreis). Ohne Schlüssel oder mit einem Schlüssel der anderen Länge bleibt der Eintrag Dokumentation; der Name wird nicht verglichen. Die Schlüssel stehen im Ortsstamm (siehe `docs/betrieb/orte-pflegen.md`).

Zugeordnet wird nur ein freigeschalteter Betrieb, der die Leistung des Auftrags führt und die Postleitzahl des Kunden abdeckt. Für die Postleitzahl reicht eines: eine seiner Postleitzahlen, sein Umkreis oder ein eingetragener Ort oder Landkreis, zu dem sie gehört. Eine Postleitzahl, die der Ortsstamm nicht kennt, trifft nur über die eingetragenen Postleitzahlen. Dieselbe Regel gilt für die Vorschlagsliste am Vorgang, die Postleitzahl-Abfrage und die Ortsseiten („Partner deckt ab“). Der Partnerweg für Kunden (Schalter PARTNERMODELL_B) rechnet bis auf Weiteres nur mit den eingetragenen Postleitzahlen; die Vorschlagsliste kann bei einem Vorgang im Partnerweg deshalb auch Betriebe zeigen, die nur über Umkreis oder Region abdecken. Die Leistung kommt aus der Buchung: Zweitschlüssel gehört zu „Autoschlüssel nachmachen“, Ersatz bei Verlust zu „Schlüsselverlust“, Programmieren zu „Programmierung und Anlernen“, Gehäuse und Tasten zu „Reparaturen und Gehäuse“, Fahrzeugöffnung zu „Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln“. Alles andere läuft als „Autoschlüssel allgemein“; das deckt jeder Betrieb mit einer der neun Leistungen ab.

## 7. Lead anbieten und zuteilen

Im Vorgang, Reiter **Vermittlung**:

1. **Partnerbetrieb** wählen. Die Liste **Passende Partnerbetriebe (Vorschlag)** zeigt, welche freigeschalteten Betriebe Postleitzahl und Leistung abdecken, und hinter jedem Betrieb den Grund: „Postleitzahl 355*“, „Umkreis: 10,8 km von 35576 (bis 20 km)“ oder „Landkreis Lahn-Dill-Kreis (06532)“. Sie erscheint, sobald der Vorgang einen Stand der Vermittlung hat (etwa „neu“). Im Partnerweg mit Zahlung an uns zählen nur Betriebe mit Abrechnung B. Bei mehreren entscheiden Sie.
2. Stand **an Partner vermittelt** setzen: Der Lead ist dem Betrieb angeboten.
3. Sagt der Betrieb zu: **vom Partner angenommen**.
4. Danach dem Kunden den Betrieb nennen: Seitenleiste, **Nachricht an den Kunden**, Vorlage **Ihr ausführender Betrieb**. Firma und Ort setzt die Seite beim Senden ein. Bis die Nachricht gesendet ist, steht am Vorgang ein Hinweis. Die Seite sendet sie nie von selbst. Die Vorlage geht nur hinaus, wenn der Betrieb freigeschaltet ist, der Stand „vom Partner angenommen“ oder „Termin bestätigt“ ist und der Betrieb mit Abrechnung A arbeitet. Bei Abrechnung B oder im Partnerweg lehnt die Seite sie ab, bis der Anwalt den Text geprüft hat.
5. Sagt der Betrieb ab: Stand zurück auf **geprüft**, unter **Angaben zum Wechsel der Zuordnung** „Partner hat abgelehnt“ wählen und bei Bedarf eine Notiz. Dann einen anderen Betrieb wählen.

Jeder Wechsel steht im **Lead-Verlauf (angeboten an)** mit Betrieb, Zeitpunkt, wer, Ergebnis und Notiz: zugeteilt, angeboten, angenommen, abgelehnt, zurückgezogen, zur Klärung. Den Verlauf schreibt die Seite; von Hand lässt er sich nicht ändern.

Am Partnerbetrieb sehen Sie die Gegenansicht: **Leads dieses Betriebs (Verlauf)** mit Stand und letztem Eintrag, darunter **Aktuell zugeordnete Leads** als Tabelle.

In der Liste der Vorgänge zeigt der Knopf **Wartet auf Zuordnung** alle Leads, die noch keinem Betrieb angeboten sind oder nach einer Absage neu zugeordnet werden müssen.

## Was nicht in dieser Anleitung steht

Abrechnung und Auszahlung: `docs/betrieb/partnerauftrag-abrechnen.md`.
