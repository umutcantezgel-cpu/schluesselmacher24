# E3-BAUMEISTER-05 · Berichte aus Workflow wf_9e03120d-1e3

## Bau E3-BAUMEISTER-05
GEÄNDERTE DATEIEN
- src/components/autoschluessel/preis-anzeige.tsx
- src/components/autoschluessel/termin-auswahl.tsx
- src/components/autoschluessel/bestaetigung.tsx
- src/components/autoschluessel/bestaetigung.test.tsx (neu)

WAS UND WARUM
- preis-anzeige.tsx: lucide durch Glyphen ersetzt (Car → IconFahrzeugmarke 24 text-area-strong; Clock → GlyphUhr 18; Info → GlyphInfo 16). Freie Werte nach K-005a ersetzt: Kartenbezeichnungen als font-mono text-caption uppercase tracking-label, Beschreibungstexte text-small, Zeilenbezeichnung strong text-body bold, Zeilenwerte mit Ziffern font-mono text-headline (Hauptwert) bzw. font-mono text-title-sm (Nebenwerte) tabular-nums. Die Karten Festpreis, Rahmen und Prüfung sind ruhige Flächen (rounded-lg border border-border bg-surface, Abstände wie CardBody). Die Prüfung ist keine Alert-Warnung mehr (siehe offene Fragen). Zeile() bekommt eine reine Darstellungsverzweigung: Werte ohne Ziffern (Platzhalter 'wird nach Prüfung genannt') bleiben in der Fließtext-Schrift. Unverändert: Props, Verzweigungen (mode, priceCents, remainderCents-Fallback, priceFromCents/priceToCents, note, requiresVehicleOnSite), alle Texte, InfoTip-Inhalt.
- termin-auswahl.tsx: Loader2 → GlyphLaden (animate-spin, Größe 17 wie zuvor). Ladezeile text-body. Tagesüberschrift text-title-sm font-semibold mit GlyphKalender 18; das Datum steht als span font-mono tabular-nums (Textinhalt unverändert). Alerts, OptionCards und Props unverändert.
- bestaetigung.tsx: lucide entfernt. Kopf mit CheckDraw (size 56, title 'Vorgang angelegt'), Statuszeile font-mono text-caption uppercase tracking-label text-success mit unverändertem Text, Überschrift text-headline. Vorgangsnummer als bemaßtes Feld: Bezeichnung als Caption, Nummer font-mono text-headline tabular-nums mit break-words. Karten Termin (GlyphKalender 18) und Anzahlung (IconZahlung 24 text-area-strong); Kartenbezeichnungen als Caption, Werte in font-mono text-title-sm. Abschnittsüberschrift h3 text-title-sm font-semibold. Hinweise text-small. Link: rounded-sm, hover:underline, Fokus über den globalen Ring. Props, Verzweigungen (mode 'pruefung', location, redirectUrl, notices), Callbacks und Keys unverändert.
- bestaetigung.test.tsx (neu, 6 Tests): rendert ohne Fehler; Vorgangsnummer in mono; CheckDraw mit Titel und 56 px; Termin- und Anzahlungswerte; Verbindlichkeitshinweis nur bei Prüfung; Hinweise und Kontaktlink; kein lucide (Quelltext und HTML geprüft).

Alt-Neu-Liste Tests: keine bestehenden Tests geändert.
Alt-Neu-Liste Texte: keine Texte geändert.

GEMEINSAME DATEIEN
Keine gemeinsamen Dateien geändert. Kein Wert ohne Token offen. Verwendete Werte, die keine Tokens sind: Abstände px-5 py-4 md:px-6 md:py-5 (wie CardBody), leading-relaxed (Tailwind-Standard), animate-spin (bestehender Token --dauer-scene; die Dauer ist nicht gemessen, K-007 nennt 900 ms).
KERN-Version: Das Paket nennt Kern 1.3, der Auftrag nennt 1.5. Die Änderungen in 1.5 betreffen K-008 (Raster und Profillinie), nicht die Regeln dieser Dateien. Angewendet wurden K-005a, K-007, K-008a, K-010.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: ohne Befund.
- npx eslint (vier Dateien): ohne Befund.
- npx vitest run src/components: 25 Dateien, 740 Tests grün, davon 6 neu.
- werte-suche.mjs auf die vier Dateien: 0 Funde. Protokoll: /root/sm24-bilder/E3-BAUMEISTER-05/werte-suche.json
- grep lucide-react in den Dateien: kein Treffer.
- Entwicklungsserver Port 3001: läuft (HTTP 200). Sperrdatei /tmp/sm24-messfenster.lock: nicht vorhanden.
- Teilweise nicht erreicht: Bildbelege Preis und Termin (siehe OFFENE FRAGEN).
- Keine Dateien gelöscht, nichts committet oder gepusht. Fehler in fremden Dateien: keine gefunden.

BILDBELEGE
- Eigene Ausgabeordner (neu): /root/sm24-bilder/E3-BAUMEISTER-05/
- Startseite Assistent: autoschluessel-anfrage__mobil.jpg und autoschluessel-anfrage__desktop.jpg (bild.mjs, Protokolle bild-mobil.json und bild-desktop.json)
- Schritt 'Preis für Ihren Fall': schritt-preis__mobil.jpg und schritt-preis__desktop.jpg. Beide zeigen den Fehlerzustand 'Preis konnte nicht ermittelt werden'; PreisAnzeige ist nicht sichtbar. Der Bildbefund zur Gestaltung der Preisansicht ist deshalb nicht gegeben.
- Schritt 'Termin auswählen': keine Bilder (nicht erreicht).
- Skript: /root/sm24-bilder/E3-BAUMEISTER-05/assistent.mjs; Protokoll: /root/sm24-bilder/E3-BAUMEISTER-05/assistent.json
- Das Skript folgt dem Weg aus funktionsliste.mjs (f04) mit eigenen Kopien der Hilfsfunktionen; die Quelldatei ist unverändert. Es klickt nie den Absende-Knopf.
- Nicht im Bild geprüft: Bestätigung (nur per Rendertest, da der Absendeweg nicht erreichbar ist).

OFFENE FRAGEN
1. Prüfungsmodus: Die Alert-Warnung ist laut Paket durch eine ruhige Fläche ersetzt, ohne Warnton und ohne Icon. Soll der Warnton bleiben?
2. Bestätigung, Text 'Eingeplant sind 1 Std..': doppelter Punkt, schon im Bestand. Korrektur braucht bedingte Textlogik; keine Änderung vorgenommen.
3. Client-Bundle: Bestätigung importiert CheckDraw (ohne 'use client') in eine Client-Komponente. Die Vorgabe 'kein neues Client-JavaScript' ist nicht gemessen.
4. Preisschritt im Prüflauf: Angaben (Modell 'Golf', Baujahr 2015, Prüfeingabe) ergeben keinen Preis. Die passenden Eingaben bitte vorgeben, dann lassen sich Preis- und Terminbilder nachholen.
5. Zeilenwerte ohne Ziffern stehen bewusst nicht in Mono (Abweichung von 'Werte Mono' bei Platzhaltertexten).

=== ENDE E3-BAUMEISTER-05 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-BAUMEISTER-05 R1
**Urteil:** nicht bestanden
- muss: Bildbelege Preis und Termin fehlen im Baumeister-Bericht. Dort zeigt nur der Preisschritt den Fehlerzustand 'Preis konnte nicht ermittelt werden', und der Termin-Schritt ist nicht fotografiert. Die Ursache liegt im Messwerkzeug, nicht im Produkt: lib.mjs leseActions() liest nur .next/server/server-reference-manifest.json, dort steht fetchQuote als 40af7b508309. Der Dev-Build legt fetchQuote unter .next/dev/server/server-reference-manifest.json als 4013a9f12e4c ab. Die Attrappen-Schicht beantwortet die Preisabfrage deshalb als 'action-unbekannt' (POST /autoschluessel/anfrage, Länge 115). Behebung ohne Dateiänderung: Umgebungsvariable SM24_NEXT_DIR=/home/user/schluesselmacher24/.next/dev setzen. Damit laufen fetchQuote und fetchSlots echt; Preis, Anzahlung und Termin sind erreichbar. Der Prüfer hat die Aufnahmen nachgeholt (siehe BILDBELEGE). Paket Schritt 6 ist damit nach Neuaufnahme erfüllbar.
- soll: OFFENE FRAGE 4 des Berichts ist falsch. Golf mit VW (Gruppe B) und Leistung zweitschluessel ergibt laut content/service-pricing.json einen Preis (fest 249,00 EUR, bei 0 funktionierenden Schlüsseln als Rahmen). Der Fehler lag im Harness (Befund 1).
- soll: Festpreis-Karte (mode 'fest', Hauptwert font-mono text-headline) ist nicht im Bild belegt. Aufgenommen wurde nur die Preisrahmen-Ansicht (mode 'rahmen', 'ab 249,00 EUR' und 'Anzahlung jetzt 69,90 EUR' in Mono). Gesamtpreis-Zeile der Festpreis-Karte bleibt unbelegt.
- soll: Dauer steht im Fließtext nicht in Mono, obwohl K-010 Dauer ausdrücklich unter den Zahlen nennt: preis-anzeige.tsx Zeile 127 ('{formatDuration} — so viel Zeit reservieren wir …') und bestaetigung.tsx Zeile 68 ('Eingeplant sind {formatDuration}.'). Eine Mono-Auszeichnung des Dauerwertes wäre die Umsetzung der Regel.
- soll: Das JS-Budget 'kein neues Client-JavaScript' ist nicht gemessen. bestaetigung.tsx (Client-Komponente) importiert jetzt CheckDraw, GlyphKalender und IconZahlung. CheckDraw wird in der Codebasis nur hier verwendet (check-draw.tsx hat kein eigenes 'use client'). Die lucide-Imports entfallen dafür. Die Netto-Wirkung ist offen und braucht einen Build-Vergleich.
- soll: Die Bestätigung ist nur per Rendertest belegt (6 Tests grün), nicht im Bild. Das ist laut Paket zulässig, weil Absenden nicht ausgelöst werden darf. Die Sichtprüfung der Bestätigung bleibt offen.
- hinweis: termin-auswahl.tsx Zeile 85: GlyphLaden mit 'animate-spin' ohne 'motion-reduce:animate-none'. Die Muster button.tsx Zeile 69 und photo-upload.tsx Zeile 394 setzen den Zusatz. Die globale Regel in src/app/(site)/globals.css Zeile 468 (prefers-reduced-motion: reduce, Dauer 0.01 ms) fängt die Bewegung ab, daher nur eine Abweichung vom Muster.
- hinweis: bestaetigung.tsx Zeile 36 und 38: Der CheckDraw-Titel und die Statuszeile sagen beide 'Vorgang angelegt'. Der Bildschirmleser liest es zweimal vor.
- hinweis: preis-anzeige.tsx Zeile 97 und 113 bis 118 (Zeile()): Platzhalter 'wird nach Prüfung genannt' steht in text-title-sm font-semibold. Das Paket verlangt Fließtext-Schrift; der Wert ist aber nicht mono und folgt damit der Vorgabe. Mikro-Abweichung in der Größe.
- hinweis: Fullpage-Aufnahmen zeigen fixierte Kopf- und Fußleisten über Inhalt (desktop-Preis: Preis-Überschrift und Anzahlungszeile teilweise verdeckt; mobil-Termin: Fußleiste mit 'Zahlungspflichtig buchen' überdeckt Karten). Das ist Bildtechnik, kein Befund an den drei Dateien.
- hinweis: Im Arbeitsbaum ist zusätzlich src/components/autoschluessel/vehicle-facts.tsx geändert. Diese Datei gehört zu E3-BAUMEISTER-04 und liegt außerhalb der Schreibrechte dieses Pakets. Im Diff von E3-BAUMEISTER-05 nicht enthalten, von der Prüfung nicht bewertet.
- hinweis: Alle vier Dateien sind im Umfang und Schreibrecht. Keine gemeinsamen Dateien berührt. Props, Verzweigungen, Callbacks und Keys sind im Diff unverändert. Die Aufrufer in assistent.tsx (Zeilen 817, 1402, 1500) sind durch tsc ohne Fehler abgedeckt.

**Schritte:** PRÜFUNG E3-BAUMEISTER-05, Prüfstufe A, Runde 1. Gesamtergebnis: NICHT bestanden (ein muss-Befund: Bildbelege Preis und Termin). Die Änderungen selbst sind inhaltlich sauber.

Schritt 1 (Lesen, Grundlage): Die Git-Änderungen beschränken sich auf die vier Dateien aus den Schreibrechten (preis-anzeige.tsx, termin-auswahl.tsx, bestaetigung.tsx geändert; bestaetigung.test.tsx neu). assistent.tsx ist nicht geändert. Dass der Kundschaftsbericht E3-B-05 gelesen wurde, ist nicht belegt (hinweis).

Schritt 2 (preis-anzeige.tsx): erfüllt.
- Zeile() Zeilen 17 bis 36: Bezeichnung dt Zeile 30 (text-body font-bold bzw. text-small); Wert dd Zeile 33 mit font-mono text-headline (Hauptwert) bzw. font-mono text-title-sm (Nebenwert), Ziffernverzweigung Zeilen 19 bis 26.
- Ruhige Flächen rounded-lg border border-border bg-surface: Festpreis Zeile 48, Rahmen Zeile 69, Prüfung Zeile 96 (keine Alert-Warnung mehr).
- Kartenbezeichnungen font-mono text-caption uppercase tracking-label: Zeilen 49, 70, 123, 137.
- Icons: IconFahrzeugmarke size 24 text-area-strong Zeile 135; GlyphUhr 18 Zeile 121; GlyphInfo 16 Zeile 160; Fußnote text-small Zeile 159.
- Props (Zeile 12 bis 14), Verzweigungen (mode, priceCents, remainderCents-Fallback, priceFromCents/priceToCents, note, requiresVehicleOnSite), Texte und InfoTip-Inhalt im Diff unverändert.
- Offen: Festpreis-Ansicht nicht im Bild (Befund soll).

Schritt 3 (termin-auswahl.tsx): erfüllt.
- Ladezeile Zeile 84 text-body; GlyphLaden size 17 animate-spin Zeile 85 (Befund hinweis zum Zusatz motion-reduce).
- Tagesüberschrift Zeilen 113 bis 115: text-title-sm font-semibold, GlyphKalender 18, Datum als span font-mono tabular-nums; Textinhalt unverändert.
- Alerts, OptionCard, Props unverändert.

Schritt 4 (bestaetigung.tsx): erfüllt.
- CheckDraw title 'Vorgang angelegt', size 56, Zeile 36.
- Statuszeile font-mono text-caption uppercase tracking-label text-success Zeile 37, Text unverändert.
- Überschrift text-headline Zeile 40.
- Vorgangsnummer bemaßt: Bezeichnung Caption Zeile 45; Nummer font-mono text-headline tabular-nums break-words Zeile 48.
- Karte Termin mit GlyphKalender 18 Zeile 61, Wert font-mono text-title-sm Zeile 64; Karte Anzahlung mit IconZahlung 24 text-area-strong Zeile 79, Wert Zeile 82.
- Hinweise text-small Zeilen 51, 67, 85, 126.
- Link Zeilen 128 bis 131: rounded-sm font-semibold text-primary hover:underline (globaler Fokusring).
- h3 text-title-sm font-semibold Zeile 113.
- Verzweigungen (mode, redirectUrl, notices), Callbacks und Keys unverändert.
- Offen: Sichtprüfung im Bild nicht möglich (Befund soll).

Schritt 5 (freie Werte nach K-005a): überwiegend erfüllt. werte-suche meldet 0 Funde. lucide-Importe sind weg. Abweichungen: Dauer nicht mono (soll), Platzhalter in title-sm (hinweis). leading-relaxed und Abstände (px-5 py-4 md:px-6 md:py-5) sind Tailwind-Standardwerte bzw. wie CardBody, keine Tokenverletzung.

Schritt 6 (Schnellprüfung und Bilder): tsc, eslint, vitest, werte-suche, grep erfüllt. Bildbelege Preis und Termin vom Baumeister nur als Fehlerzustand, nicht belegt (muss). Prüfer hat die Bilder nachgeholt (Befund muss, Behebung über SM24_NEXT_DIR).

Schritt 7 (Rendertest bestaetigung.test.tsx): erfüllt. 6 Tests, Zeilen 27 bis 67, Rendern, Vorgangsnummer in Mono (Regex Zeile 29), CheckDraw mit Titel und 56 px (Zeilen 33 bis 39), Termin- und Anzahlungswerte (41 bis 47), Verbindlichkeitshinweis nur bei Prüfung (49 bis 55), Hinweise und Kontaktlink (57 bis 61), kein lucide (63 bis 67). Keine bestehenden Tests geändert (git status).

Grenzen:
- Keine Dateien außerhalb der Schreibrechte geändert (durch Prüfer bestätigt; vehicle-facts.tsx gehört zu E3-04).
- Keine Löschung, kein Commit, kein Push durch den Baumeister; Prüfer hat keine Projektdatei geändert, keine Datei gelöscht.
- Props-Verträge unverändert. Logik unverändert.
- Bewegung hat reduzierte Variante: CheckDraw über sm24-draw in globals.css unter prefers-reduced-motion no-preference (Zeile 376 ff.), Spinner über globale Regel (Zeile 468).
- Lock-Datei /tmp/sm24-messfenster.lock nicht vorhanden; Messung war frei.

=== ENDE PRÜFUNG E3-BAUMEISTER-05 r1 ===

**Prüfungen:** SCHNELLPRÜFUNG (Prüfer, Runde 1):
1. npx tsc --noEmit: Exit 0, keine Ausgabe (Log: /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/tsc.log, 0 Zeilen).
2. npx eslint (vier Dateien): Exit 0, keine Befunde.
3. npx vitest run src/components: 25 Dateien bestanden, 740 Tests bestanden, davon bestaetigung.test.tsx 6 Tests. Fehler: 0.
4. werte-suche.mjs (vier Dateien, --json in eigenen Ordner): 0 Funde, Summe 0. Protokoll: /root/sm24-bilder/E3-BAUMEISTER-05-pruefung-r1/werte-suche.json.
5. grep lucide-react (vier Dateien): kein Treffer (Exit 1).
6. Entwicklungsserver Port 3001: HTTP 200 in 0.17 s. Lock-Datei /tmp/sm24-messfenster.lock nicht vorhanden.
7. Git-Status nach den Läufen: geändert sind die vier Dateien aus den Schreibrechten (plus vehicle-facts.tsx von E3-04, calculator/*, vertrauen/* von fremden Paketen). Neue Untracked-Datei: bestaetigung.test.tsx. Keine Löschung, kein Commit.

BILDDIAGNOSE (Ursache der fehlenden Preis- und Terminbilder):
- lib.mjs leseActions() liest .next/server/server-reference-manifest.json (fetchQuote = 40af7b508309).
- Der Dev-Build legt sein Manifest unter .next/dev/server/server-reference-manifest.json ab (fetchQuote = 4013a9f12e4c, fetchSlots = 7021fafc692f).
- Ohne Korrektur: POST /autoschluessel/anfrage (Länge 115) wird als 'action-unbekannt' beantwortet, daher Fehler 'Preis konnte nicht ermittelt werden' und 'Weiter gesperrt'.
- Mit SM24_NEXT_DIR=/home/user/schluesselmacher24/.next/dev (vorgesehene Umgebungsvariable von lib.mjs, keine Dateiänderung): Preis, Anzahlung und Termin erreichbar; Lauf endet am Termin-Schritt (kein 'Weiter' vorhanden). Absende-Knopf nie geklickt.
- Skript des Prüfers (Kopie des Baumeister-Skripts, nur Zielordner und Protokollpfad geändert, Netzwerk-Logging ergänzt): /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/pruef-assistent.mjs

Der Baumeister-Bericht gibt den Preisfehler (OFFENE FRAGE 4) zu Unrecht als Eingabe-Problem an.

## Reparatur E3-BAUMEISTER-05 R1
E3-BAUMEISTER-05, Runde 2 (Antwort auf Prüfung Runde 1)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/components/autoschluessel/preis-anzeige.tsx
- /home/user/schluesselmacher24/src/components/autoschluessel/termin-auswahl.tsx
- /home/user/schluesselmacher24/src/components/autoschluessel/bestaetigung.tsx
- /home/user/schluesselmacher24/src/components/autoschluessel/bestaetigung.test.tsx (neu in Runde 1, in Runde 2 eine Assertion angepasst)

WAS UND WARUM
1. Muss, Bildbelege Preis und Termin: Behoben ohne Dateiänderung im Harness. Lauf mit SM24_NEXT_DIR=/home/user/schluesselmacher24/.next/dev. fetchQuote (4013a9f12e4c...) und fetchSlots (7021fafc692f...) laufen echt, die Attrappe beantwortet sie nicht mehr als action-unbekannt. Neues Skript: /root/sm24-bilder/E3-BAUMEISTER-05-runde2/assistent.mjs. Der alte Ordner /root/sm24-bilder/E3-BAUMEISTER-05 bleibt unverändert liegen (Fehlerzustand aus Runde 1).
2. Soll, Frage 4: Golf (VW, Gruppe B) mit Zweitschlüssel ergibt im Lauf Festpreis 249,00 € (Anzahlung 69,90 €, Restbetrag 179,10 €). Die Angabe 'Fehler im Harness' ist bestätigt; der Produktcode war richtig.
3. Soll, Festpreis-Karte: Im Bild belegt (Schritt 'Preis für Ihren Fall' mit 1 funktionierendem Schlüssel), mobil und desktop. Gesamtpreis in Mono 'text-headline' (26 px mobil, 35,92 px desktop). Rahmenansicht (0 Schlüssel) ebenfalls belegt.
4. Soll, Dauer in Mono: umgesetzt in preis-anzeige.tsx (Terminlänge-Karte), bestaetigung.tsx (Termin-Karte, 'Eingeplant sind <span>…</span>') und termin-auswahl.tsx (Hinweis-Alert 'Jeder Termin ist mit …'). Die Mono-Auszeichnung ist im Protokoll per computed style belegt. Logik, Props, Texte unverändert.
5. Soll, JS-Budget: Netto-Messung auf Komponentenebene mit esbuild (minifiziert, React und next/link extern) alt (HEAD) zu neu: bestaetigung.tsx 43944 zu 41009 B (gzip 13496 zu 12920); preis-anzeige.tsx 97576 zu 93803 B (gzip 30624 zu 29674); termin-auswahl.tsx 96849 zu 92686 B (gzip 30687 zu 29598). Der Wegfall der lucide-Icons (rund 7,3 KB für die acht Icons) überwiegt den Zuwachs der neuen Glyphen. Eine Seitenmessung mit next build habe ich nicht gemacht, weil next build .next überschreibt, das der Entwicklungsserver nutzt.
6. Soll, Bestätigung visuell: nicht möglich ohne Absenden (Paket verbietet das). Belegt bleibt der Rendertest (6 Tests grün).
7. Test-Anpassung (Alt-Neu): bestaetigung.test.tsx Zeile 46. Alt: expect(html).toContain('Eingeplant sind 1 Std.'). Neu: toMatch auf 'Eingeplant sind <span class="font-mono tabular-nums text-foreground">1 Std.</span>.' Anzahl der Prüfungen unverändert (6).

GEMEINSAME DATEIEN
- Keine geändert.
- Offen, außerhalb meiner Rechte: Die Auswahlkarte OptionCard zeigt im Termin-Schritt 'Dauer 1 Std.' ohne Mono (Prop description). Dafür wäre eine Änderung an src/components/forms/option-card.tsx nötig.

PRÜFUNG UND ERGEBNIS
- Sperrdatei /tmp/sm24-messfenster.lock: nicht vorhanden.
- tsc --noEmit: exit 0.
- eslint (die vier Dateien): exit 0.
- vitest run src/components: 25 Dateien, 740 Tests grün.
- werte-suche: 0 Funde.
- grep lucide-react in den vier Dateien: kein Treffer.
- Keine Löschung, kein Commit, kein Push. Keine Projektdatei außerhalb der Schreibrechte geändert.
- Ergebnis Schnellprüfung: bestanden.

BILDBELEGE (Ordner /root/sm24-bilder/E3-BAUMEISTER-05-runde2/, Protokoll assistent.json)
- schritt-preis-fest__mobil.jpg und schritt-preis-fest__desktop.jpg (Festpreis 249,00 €, Anzahlung, Restbetrag, Dauer in Mono)
- schritt-preis-rahmen__mobil.jpg und schritt-preis-rahmen__desktop.jpg (Rahmen 'ab 249,00 €', Anzahlung 69,90 €)
- schritt-termin__mobil.jpg und schritt-termin__desktop.jpg (Tagesüberschriften in Mono, Zeitfenster-Karten mit Dauer)
- Sichtung: keine Überläufe, keine abgeschnittenen Karten. In den vollseitigen Mobilaufnahmen überdecken Kopfleiste und untere Aktionsleiste einen Teil des Inhalts oben. Das ist ein Effekt der Vollbildaufnahme, kein Layoutfehler.
- Messhinweis: Die Textprüfung 'Fester Preis für Ihre Angaben' meldet im Protokoll false, weil CSS die Überschrift in Großbuchstaben setzt und innerText das umsetzt. Die Werte belegen den Modus eindeutig.
- Weitere Dateien: werte-suche.json und tsc-Protokoll /root/sm24-bilder/E3-BAUMEISTER-05-runde2-tsc.log. Das Bündel für den JS-Vergleich liegt im Scratchpad unter /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/budget.

OFFENE FRAGEN
1. Sichtprüfung der Bestätigung im Bild (nur nach Absenden erreichbar; Absenden ist verboten).
2. Seitenweite JS-Messung mit next build (würde .next überschreiben, das der Entwicklungsserver nutzt). Für die Entscheidung steht der Komponentenwert oben.
3. OptionCard 'Dauer' in Mono: braucht eine Änderung an option-card.tsx, außerhalb meiner Rechte.
4. Der Mobil-Wert der Festpreis-Karte im Vollbild wird teils von der Kopfleiste überdeckt; für eine saubere Abnahme wäre ein Ausschnitt ohne Fixierung nötig (Prüferentscheidung).

=== ENDE E3-BAUMEISTER-05 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-BAUMEISTER-05 R2
**Urteil:** bestanden
- soll: Zeitfenster-Karten im Termin-Schritt (OptionCard, Uhrzeit und 'Dauer 1 Std.') stehen nicht in Mono, obwohl Dauer in den drei Dateien des Pakets in Mono steht. Auf demselben Bildschirm entsteht dadurch ein sichtbarer Bruch (Bilder termin__desktop.jpg, termin__mobil.jpg). Die Ursache liegt in src/components/forms/option-card.tsx, außerhalb der Schreibrechte; an das Paket der OptionCard weiterzugeben, nicht diesem Paket anzulasten.
- soll: Die Bestätigungsansicht ist nicht mit Bild belegt. Sie ist ohne Absenden nicht erreichbar. Belegt ist nur der Rendertest (bestaetigung.test.tsx, 6 Prüfungen grün). Eine visuelle Abnahme der Kopfzeile mit CheckDraw bleibt offen.
- hinweis: termin-auswahl.tsx Zeile 86: GlyphLaden hat animate-spin ohne motion-reduce:animate-none. Das Muster in button.tsx:69 und photo-upload.tsx:394 nutzt diesen Zusatz. Die Wirkung bei reduzierter Bewegung ist durch die globale Regel in globals.css (prefers-reduced-motion: reduce, Dauer 0.01 ms) abgedeckt, daher kein muss.
- hinweis: preis-anzeige.tsx, Helfer Zeile (ca. Zeilen 20-35): Mono gilt nur für Werte mit Ziffern. Der Platzhalter 'wird nach Prüfung genannt' bleibt in Fließtext. Das Paket fordert 'Werte Mono'. Die Abweichung ist vertretbar und im Code begründet, wird aber nicht im Bericht genannt.
- hinweis: preis-anzeige.tsx Modus 'pruefung': Der Alert mit tone=warning ist durch eine ruhige Fläche ersetzt. Das folgt Schritt 2 des Pakets, verliert aber die Warnstufe. Bitte im Bericht als bewusste Entscheidung ausweisen.
- hinweis: JS-Budget: Die Bestandsaufnahme nennt Komponentenmessungen mit esbuild (alt zu neu). Ich habe sie nicht nachgemessen. Geprüft habe ich nur die Imports: lucide-react fehlt in allen vier Dateien, neue Imports sind Glyphen, Fach-Icons und CheckDraw ohne neue Abhängigkeiten. Die Aussage 'kein neues Client-JavaScript' ist plausibel, aber nicht belegt.
- hinweis: Die Arbeitsverzeichnis-Liste zeigt weitere geänderte Dateien (vehicle-facts.tsx, rechner-bausteine.tsx, rechner.test.tsx, nachweise-liste.tsx). Sie gehören zu den Paketen 04 und 06 und sind von mir nicht bewertet. Außerdem hat werte-suche eine neue Protokolldatei unter _werkstatt/protokolle/ angelegt (Werkzeugverhalten, untracked).

**Schritte:** Schritt 1 erfüllt: git status zeigt für die Schreibrechte bestaetigung.tsx, preis-anzeige.tsx, termin-auswahl.tsx geändert und bestaetigung.test.tsx neu (untracked). Andere geänderte Dateien gehören zu anderen Paketen. Schritt 2 erfüllt: Props-Interfaces (PreisAnzeigeProps, TerminAuswahlProps, BestaetigungProps) unverändert im Diff, Handler, Verzweigungen (mode, priceCents, loading, staleSelection) und Restbetrag-Berechnung unverändert, nur Markup und Klassen geändert. Stichprobe Aufrufer ist nicht nötig, weil keine Props-Änderung vorliegt. Schritt 3, Einzelprüfung: (a) Preis, Helfer Zeile und Festpreis, Rahmen, Prüfung als ruhige Flächen mit rounded-lg border border-border bg-surface, Hauptwert font-mono text-headline tabular-nums: erfüllt, preis-anzeige.tsx Zeilen ca. 20-35 und 45-110, Bilder bestätigt. (b) Icons Car zu IconFahrzeugmarke 24, Clock zu GlyphUhr 18, Info zu GlyphInfo 16: erfüllt. (c) Fußnote text-small mit GlyphInfo: erfüllt. (d) termin-auswahl: Ladezeile text-body mit GlyphLaden: erfüllt, Zeile 86 ohne motion-reduce (hinweis). Tagesüberschrift text-title-sm font-semibold mit GlyphKalender und Datum Mono: erfüllt, Zeile ca. 111-115. Zeitfenster bleiben OptionCard: erfüllt, Dauer dort nicht Mono (soll). (e) bestaetigung: CheckDraw title Vorgang angelegt size 56 oberhalb der Statuszeile: erfüllt, Zeile 36. Statuszeile font-mono text-caption uppercase tracking-label text-success: erfüllt. h2 text-headline: erfüllt. Vorgangsnummer font-mono text-headline tabular-nums mit Caption: erfüllt. Karten Termin mit GlyphKalender und Anzahlung mit IconZahlung 24: erfüllt. Hinweise text-small: erfüllt. Link mit hover:underline und globalem Fokusring aus globals.css :focus-visible: erfüllt. (f) Dauer in Mono in den drei Dateien: erfüllt, Zeilen in preis-anzeige, bestaetigung und termin-auswahl. (g) Kein lucide-react, keine Arbitrary-Werte (text-[, shadow-[, min-h-[, z-N, duration-N) in den vier Dateien: erfüllt. Schritt 4 Testanpassung: Alt-Neu im Bericht nachvollziehbar, Anzahl der Prüfungen 6, Zeile 46 mit span-Markup: erfüllt. Schritt 5 Bilder: erfüllt, siehe Pruefung.bilder. Die Festpreis- und Rahmenansicht sowie beide Terminansichten liegen mobil und desktop vor. Zusätzlich: Props-Verträge und Logik unverändert, keine Löschung, kein Commit. Grenze 'Nie Dateien löschen' eingehalten: ich habe nichts gelöscht. Zuordnung zu den Werten im Bericht des Baumeisters (Festpreis 249,00 €, Anzahlung 69,90 €, Restbetrag 179,10 €) bestätigt."},{"schwere":"hinweis","text":"Schnellprüfung eigene Läufe: tsc --noEmit exit 0; eslint auf den vier Dateien exit 0; vitest run src/components: 25 Dateien, 740 Tests grün (bestaetigung.test.tsx 6 Tests); werte-suche auf den vier Dateien: 0 Funde; grep lucide-react in den vier Dateien: kein Treffer (grep-Exit 1). Sperrdatei /tmp/sm24-messfenster.lock nicht vorhanden. Entwicklungsserver auf Port 3001 antwortet mit HTTP 200."}]

**Prüfungen:** tsc --noEmit: exit 0 (Log: /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/r2/tsc.log). eslint vier Dateien: exit 0 (eslint.log). vitest run src/components: Test Files 25 passed (25), Tests 740 passed (740) (vitest.log). werte-suche: 0 Funde, Protokoll unter _werkstatt/protokolle/werte-suche-2026-10-16_06-46-57.json. grep lucide-react: kein Treffer. Bilder: Preis- und Terminschritt mobil und desktop über Port 3001 mit SM24_NEXT_DIR=/home/user/schluesselmacher24/.next/dev, Prüfer-Skript in scratchpad/r2/assistent-r2.mjs und assistent-fest.mjs. Action-Attrappen: nur 'upload' abgefangen, keine action-unbekannt, daher fetchQuote und fetchSlots echt beantwortet. Seitenüberlauf 0 px in allen Aufnahmen. Keine Projektdatei geändert, keine Löschung, kein Commit.
