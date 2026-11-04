# E5-PROBENUTZER-01 · Probelauf Schließplan-Planer und Sperrschließungs-Konfigurator

## GEÄNDERTE DATEIEN
Keine Projektdateien. Geschrieben nur in `_werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/` (Skripte, Logs, Textauszüge, PDF-Probe) und `_werkstatt/ausbau/protokolle/E5-PROBENUTZER-01/bilder/` (Screenshots).

## WAS UND WARUM
Vier Playwright-Läufe mit festen Skripten, nur über sichtbare Knöpfe, Testdaten, keine Anfrage gesendet, nicht zur Kasse. Alle Fremdanfragen blockiert (0 Stück).

Methode: Skripte statt Menschen. Zögern über 5 s ist nicht gemessen, Laufzeiten sind Skriptzeiten, die gedachten Personas sind Analyse der Bildschirmtexte.

## PRÜFUNG UND ERGEBNIS

| Persona · Gerät | Ziel erreicht | Auffälligkeiten | Abbruch |
|---|---|---|---|
| Hausverwaltung · Desktop 1440 | ja: 20 Türen, 17 Schlüssel, 340 Matrixfelder, Link und PDF | Schritt 4 ohne Häkchen: Weiter bleibt ohne Hinweis stehen | nein |
| Hausverwaltung · Mobil 390 | nein: Schritt 5 ausgefüllt, Link und PDF nicht erreichbar | Matrix als Liste, Link und PDF unsichtbar | ja, vor Link und PDF |
| Rentnerin · Desktop 1440 | ja: Sperrschließung im Warenkorb, 4 Schlüssel, 129,85 € inkl. Versand | Halbzylinder: nur Maß A, Wert springt auf 45 mm, Weiter in Schritt 4 deaktiviert ohne Hinweis | nein |
| Rentnerin · Mobil 390 | ja, wie Desktop | Weg über "Menü öffnen", sonst wie Desktop | nein |

Skriptzeiten: Hausverwaltung 23 bis 24 s, Rentnerin 5 s. Validierungsfehler: keine.

Stolpersteine nach Wirkung:
1. Mobil, Schritt 5 (/schliessanlagen/konfigurator/schliessplan): "Plan als Link speichern" und "Schließplan als PDF" stehen in einer Seitenleiste mit der Klasse `hidden lg:block`. Unter 1024 px werden sie nicht gerendert. Die Hausverwaltung findet auf dem Handy keinen Weg zum Link und zum PDF. Erwartbarer Gedanke: "Wo ist der Plan? Ich sehe nur Zurück und Angebot anfragen." Bild: `bilder/hv-mobil-07-abschluss-ausgefuellt.png`. Auf dem Desktop funktionieren beide: Link zeigt "Kopieren Sie diesen Link. Er enthält Türen, Schlüssel und Bezeichnungen, keine Kontaktdaten." PDF `Schliessplan.pdf`, 14,8 KB, geladen.
2. Mobil, Schritt 3: Die Schließmatrix ist als Tabelle ausgeblendet. Je Schlüssel gibt es eine Liste, Verwaltung mit "alle Türen". Die Haken sind 20 px groß, 361 Ziele liegen unter 24 px. Erwartbarer Gedanke: "Ich sehe nicht mehr, wer welche Tür öffnet." Bild: `bilder/hv-mobil-04-schluessel-matrix.png`.
3. Desktop und Mobil, Schritt 4: "Weiter" ohne Häkchen bei "Maße geprüft" bleibt stehen, ohne Fehlertext. Belege: `hv-desktop-log.txt`, `hv-mobil-log.txt`. Bild der Seite: `bilder/hv-desktop-05-pruefen.png`.
4. Desktop, Schritt 1 Sperrschließung: Bei Halbzylinder entfällt Maß B, das Feld heißt "Maß A (Schlüsselseite)". Der Wert springt von 35 auf 45 mm, Bereich 27 bis 60 mm. Erwartbarer Gedanke: "Fehlt das zweite Maß, habe ich etwas falsch gemacht?" Bild: `bilder/rent-desktop-04-zylinder-ausgefuellt.png`.
5. Desktop, Schritt 4 Erweiterung: "Weiter" ist deaktiviert, bis eine Option gewählt ist. Es gibt keinen sichtbaren Hinweis, warum. Bild: `bilder/rent-desktop-08-schritt4-weiter-aus.png`.

Weiter: Die Vorlage "Mehrfamilienhaus mit vier Wohnungen" liefert 6 Türen, für 16 Wohnungen waren 14 Türen und 12 Schlüssel zusätzlich nötig.

## BELEGE
- Logs: `protokolle/E5-PROBENUTZER-01/hv-desktop-log.txt`, `hv-mobil-log.txt`, `rent-desktop-log.txt`, `rent-mobil-log.txt`
- Texte: `hv-*-schritt5-text.txt`, `rent-*-warenkorb-text.txt`, `rent-*-schritt5-knoepfe.txt`
- Netzwerk: je Hausverwaltungslauf genau eine Nicht-GET-Anfrage, eine Next.js-Serveraktion auf der Planer-Seite beim Wählen der Vorlage. Rentnerinnenläufe: keine. Kein Aufruf von "Angebot anfragen", keine Kasse.
- Schlüssel: 17 Schlüssel, Matrix 340 Felder gesetzt, 0 fehlend.
- Bilder: `protokolle/E5-PROBENUTZER-01/bilder/`, Präfixe `hv-`, `rent-`, `probe-`.

## GEMEINSAME DATEIEN
Keine gewünschten Änderungen aus diesem Lauf. Vorschläge zur Prüfung durch den Orchestrator und das Entwicklungspaket:
- Schritt 5 Planer: Link- und PDF-Knopf auch unter lg zeigen (Befund 1).
- Mobile Matrix: Haken auf mindestens 24 px, Tabelle und Liste nach gleicher Logik.
- Hinweistexte zu deaktiviertem "Weiter" in Schritt 4 Erweiterung und zu "Maße geprüft".

## OFFENE FRAGEN
1. Ist die Serveraktion beim Wählen der Vorlage (POST auf den Planer) eine Formularsendung? Nach Befund keine Anfrage an einen Dienst, nur Zustand auf localhost. Bitte bestätigen.
2. Auf Schritt 5 gibt es keinen sichtbaren Hinweis auf einen Berechtigungsnachweis (Regel R13). Weder im Planer noch im Warenkorb wurde "Berechtigung" gefunden. Bitte prüfen.
3. Die Gedanken der Personas sind Analyse, keine Messung. Für Zögern über 5 s braucht es Probanden mit echten Pausen.

=== ENDE E5-PROBENUTZER-01 · BEREIT ZUR RÜCKGABE ===
