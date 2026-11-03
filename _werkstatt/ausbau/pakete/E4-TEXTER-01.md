# E4-TEXTER-01 · Texte Hub, Kacheln, Autoschlüssel-Rubrik

## 1. Kopfzeile
Kennung E4-TEXTER-01 · Rolle Texter · Modell Haiku 5.5 · Stufe 2 · Kern 2.5 · Kostenklasse M · Anforderungen G-48, G-03, L-009 · Kriterium Z-13 · Schreibrechte: content/rubriken.json, content/seo.json, _werkstatt/ausbau/berichte/E4-TEXTER-01.md, _werkstatt/ausbau/protokolle/E4-TEXTER-01-*.log · Umfang: Texte der Rubriken (Hub, Navigation, Rubrikköpfe) und der Startseite sowie der Autoschlüssel-Seiten in den zwei Dateien, Längen gemessen

## 2. Rollenbriefing
Texter: schreibt Seitentexte ohne KI-Spuren nach KERN K-010 und Auftrag 14 und misst jede Länge, statt zu schätzen. Fehler: Floskeln, Gedankenstriche, Dreierreihen von Adjektiven, rhetorische Fragen (außer der Hub-Frage), erfundene Fakten, Text länger als die Regel erlaubt, geänderte Rechts- oder Firmentexte.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und _werkstatt/ausbau/pakete/_MUSTER-REFERENZ.md und halte dich daran.

## 3. Aufgabe in einem Satz
Überarbeite in content/rubriken.json die Felder `laienname`, `zusatz`, `erklaerung` und die Texte von `ablauf` sowie in content/seo.json die Startseite (`route` "") und die Autoschlüssel-Seiten so, dass sie ohne KI-Spuren, in Laiensprache und innerhalb der gemessenen Längen stehen.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar. Die Startseite zeigt die Frage „Wobei können wir Ihnen helfen?“, einen Satz und Kacheln aus den Rubriken (content/rubriken.json); Navigation und Rubrikköpfe lesen dieselben Daten. Der Satz unter der Frage ist `subline` der Startseite in content/seo.json. Der Autoschlüssel-Weg zeigt „So läuft Ihr Auftrag ab“ aus `ablauf` der Rubrik `autoschluessel`; Platzhalter `{anzahlung}` und `{vorlauf}` füllt die Seite aus den Einstellungen. Rubriken mit Status „spaeter“ sind noch nicht sichtbar, ihre Texte gehören trotzdem dazu.

## 5. Kern-Auszug (unveränderlich)
- Ton (K-010): Sie-Anrede, kurze klare Sätze, Hauptwörter und Verben, konkret mit Orten, Zahlen und Abläufen. Keine Gedankenstriche (weder lang noch halblang), Bindestriche nur, wo die Rechtschreibung sie verlangt, keine Ausrufezeichen, keine Emojis, keine Floskeln der Liste in Auftrag 14 (_werkstatt/ausbau/AUFTRAG.md Abschnitt 14), Austauschprobe: Passt ein Satz zu jedem Schlüsseldienst, neu schreiben.
- Längen (K-013): `laienname` höchstens zwei Zeilen in einer Kachel von 101 px Innenbreite bei 360 px Fenster (Plex Sans halbfett 15 px, Trennung erlaubt nur mit mindestens 4 Zeichen vor und 5 nach der Trennstelle); `zusatz` höchstens zwei Zeilen bei 12 px; `subline` der Startseite höchstens zwei Zeilen bei 390 px (Schrift 18 px, Breite 350 px). Messen mit Playwright (Chromium) an einem Testelement mit genau diesen Maßen, nicht schätzen.
- `erklaerung` je Rubrik: ein Satz, was dort passiert und was es kostet, nur mit Belegen aus dem Bestand (keine neuen Preise, Fristen oder Versprechen; R4, R9, G9). „24“ verspricht keinen Notdienst. Sperrschließung trägt immer die Laienerklärung „ein Schlüssel für alle Türen“ (G-09).
- Nicht ändern: `id`, `name`, `ziel`, `icon`, `status`, `reihenfolge`, `navigation`, `imHub`, `bereich`, `abschluss`, `nachweis`, `pflichtUploads`, die Platzhalter `{anzahlung}` und `{vorlauf}`, Preise, Firmendaten, Rechtstexte, `seo.title` und `seo.description` (die folgen in E8).
- Marke (G-43): „Schlüsselmacher“ darf natürlich vorkommen, nie gezwungen.

## 6. Maßstab
Bericht mit Tabelle: Feld · vorher · nachher · gemessene Zeilen (360 px bzw. 390 px) · Grund. Jede Änderung einzeln; nichts geändert ist ein gültiges Ergebnis, wenn der Text schon passt (dann mit Messwert).

## 7. Grenzen
G4, G8, G9, R4, R9, R10. Nur die Schreibrechte aus Abschnitt 1. Kein Build, kein Commit.

## 8. Schritte
1. Lies content/rubriken.json und content/seo.json (Startseite, `autoschluessel`, `autoschluessel/anfrage`).
2. Prüfe jeden Text gegen Abschnitt 5; miss die Längen mit einem kleinen Playwright-Skript (Testseite mit `data:`-URL, Schrift „IBM Plex Sans“ aus src/fonts/ per `@font-face` mit `file://`-Pfad, `hyphens: auto`, `hyphenate-limit-chars: auto 4 5`, `lang="de"`).
3. Ändere nur, was eine Regel verletzt oder klar besser lesbar wird; JSON gültig halten (`node -e "JSON.parse(require('fs').readFileSync('content/rubriken.json','utf8'))"`).
4. Prüfe mit `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run src/components/hub src/components/rubrik src/lib/navigation.test.ts src/components/layout` (alle grün).
5. Bericht.

## 9. Selbstprüfung
Kein Gedankenstrich (`–`, `—`) und kein Ausrufezeichen in den geänderten Texten; jede Länge gemessen; keine verbotene Feldänderung (`git diff` nur in den erlaubten Feldern); Tests grün.

## 10. Ausgabe
Geänderte content/rubriken.json und content/seo.json, Messprotokoll nach _werkstatt/ausbau/protokolle/E4-TEXTER-01-laengen.log, Bericht nach _werkstatt/ausbau/berichte/E4-TEXTER-01.md (höchstens 700 Wörter).

## 11. Letzte Zeile
=== ENDE E4-TEXTER-01 · BEREIT ZUR RÜCKGABE ===
