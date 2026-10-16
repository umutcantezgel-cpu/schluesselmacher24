# E5-BAUMEISTER-21 · Bericht und Abnahme

1 Prüfrunde, Prüfurteil: bestanden. Abnahme durch den Orchestrator:

- **Bilder (eigene, Port 3001):** Kopf mit Maßzeichnung und Schriftfeld, Grundprinzip als Schließplan (zeichnet sich nach dem Einscrollen vollständig; die leere Fläche der Ganzseitenaufnahme ist die angehaltene Einstiegsbewegung), Bauformen als Stückliste mit Fach-Icons, Bestellbeispiel als Tabelle ab `md`, Optionen mit Preisen in Mono.
- **Nacharbeit:** Listen in „Abgrenzung“ ohne `prose-sm24` an der Liste selbst (Aufzählungszeichen in Bereichsfarbe, Textgröße wie der Absatz); Messschritte mit Mono-Nummer „01“… auf der Grundlinie des Titels.
- **Entschieden:** Die Produktzeichnungen der Bauformen (`form.figure`) entfallen zugunsten der Fach-Icons (ruhige Stückliste; die Maßzeichnung steht im Kopf und in der Messhilfe). Augenbraue „Funktion“ als Mikrotext bestätigt. Kein `ausschnitt` am Schließplan (das schmale Format greift). Die Kür-Szene K-01 kommt mit E6-GRAFIKER-11.

## Prüfurteil

- **soll:** Mobil erster Bildschirm: Die fixe Aktionsleiste (Autoschlüssel, Nach Code, Termin, Service) verdeckt die zweite Zeile des Schriftfelds im Kopf (GEMEINSAME SCHLÜSSEL, IM GRUNDPREIS). Erst nach Scrollen vollständig lesbar. Kein Aufnahmeartefakt, im Sichtfenster geprüft (mobil-kopf-sichtfenster.png). Betroffen: page.tsx Z. 165–184.
- **soll:** Bauform-Produktzeichnungen (form.figure) entfallen ersatzlos (bd18826 Z. 186–190). Das Paket verlangt Stückliste mit Fach-Icons und nennt die Zeichnungen nicht ausdrücklich zum Streichen. Offene Frage 1 des Baumeisters: Entscheidung durch den Orchestrator nötig.
- **soll:** Abschnitt 07: Die Listen (prose-sm24, page.tsx Z. 582–586 und 605–609) stehen größer als der Fließtext darüber und ohne Aufzählungszeichen. Sichtbar auf Desktop, Tablet und Mobil (d_05, t_05). Wunsch K-006 ist als Bestand gemeldet.
- **hinweis:** Die neue Augenbraue „Funktion“ (Z. 321) ist neuer Mikrotext; K-010 verlangt keine neuen Inhalte. Bitte bestätigen (offene Frage 3).
- **hinweis:** Messhilfe: Die Nummern 1–4 (Z. 396–401) stehen über der Titelzeile statt auf ihrer Linie (t_03, d_03).
- **hinweis:** Maße und Beträge im Fließtext stehen nicht in font-mono: Z. 305–308 („Der Grundpreis gilt bis 70 mm … 3,50 €“), Z. 512–517 („14,90 €“, „50“, „30“). KERN 1.10 nennt Zahlen, Maße und Zähler in Mono. Als Auslegung markiert.
- **hinweis:** Mobil im Schriftfeld brechen die Labels „Zylinder je Bestellung“ und „Gemeinsame Schlüssel“ auf zwei Zeilen; die Werte stehen dadurch nicht auf einer Linie (m_00).
- **hinweis:** Der Vitest-Lauf meldet 1103 Tests, der Bericht nennt 1100. Vermutlich Zugänge aus fremden Dateien, ohne Auswirkung auf das Paket.

## Bericht des Baumeisters

GEÄNDERTE DATEIEN
- src/app/(site)/gleichschliessende-zylinder/page.tsx (nur diese Datei, Schreibrecht des Pakets)
- Vorher-Stand gesichert unter /root/sm24-bilder/E5-BAUMEISTER-21/page-vorher.tsx (Hilfsdatei, nicht im Repository).

WAS UND WARUM
- Kopf: PageHeader mit bereich="gleichschliessende-zylinder" (Fach-Icon neben der Augenbraue), Fachgrafik über visual (zylinder-mass, profil-doppel, 30/40 mm), Schriftfeld nach dem Muster der Startseite (dl mit Haarlinien, dt Mono-Caption, dd font-mono text-title-sm, mobil zweispaltig). Titel, Lead und CTA-Wortlaut unverändert; CTA mit Prop pfeil.
- 01 Grundprinzip (tight): Text 5 Spalten, Schließplan 7 Spalten. Bildstelle nun visual schliessplan, system gleichschliessung, tueren 3, Format 3/2. Die Liste der Anwendungsfälle ist eine Haarlinienliste mit GlyphSchluessel statt bordered Kästchen.
- 02 Bauformen (muted): Stückliste mit Fach-Icons 40 px (doppelzylinder → IconProfilzylinder, knaufzylinder → IconKnaufzylinder, halbzylinder → IconHalbzylinder; unbekannte IDs → BereichIcon). Maße, Bereich und Grundpreis in Mono. Die Karten und die Produktzeichnungen aus form.figure entfallen (siehe offene Fragen).
- 03 Funktion (default): Haarlinienraster, zwei Spalten ab md. Der h3-Titel ist jetzt die Abschnittsüberschrift (h2) mit neuer Augenbraue „Funktion“.
- 04 Messhilfe (muted): nummerierte Schritte als Haarlinienliste mit Mono-Ziffern (die absolute Position -left-[38px] entfällt). Hinweis mit GlyphInfo als Zeile, Layers entfällt. Textlink mit GlyphLineal, min-h-touch.
- 05 Bestellbeispiel (default): Tabelle erst ab md (ohne min-w), darunter dieselben Daten als gestapelte dl-Zeilen. Maße nun „30 / 35 mm“ (K-010). CTA mit Prop pfeil, mobil w-full.
- 06 Schutz und Optionen (muted): Stückliste statt Kartenraster, Preise in Mono.
- 07 Abgrenzung (default): zwei Spalten durch Haarlinie statt zweier Karten. Textlinks min-h-touch mit GlyphPfeilRechts (zeiger:group-hover:translate-x-1, duration-quick).
- 08 Fragen (muted): Akkordeon unverändert, mit Nummer.
- 09 Weiterlesen (default): Stückliste, die ganze Zeile ist der Link, Pfeil mit B-06.
- Freie Werte ersetzt (K-005a): text-[11–17px], text-lg/xl, font-display, tracking-wider, lg:grid-cols-[…] (Zwölfer-Raster), -left-[38px], min-w-[34rem], max-w-2xl, transition ohne Dauer, group-hover-Verschiebung 2 px. Die Zeilenhöhe steckt in den Tokens.
- lucide entfernt (ArrowRight, KeyRound, Layers, Ruler); Ersatz GlyphPfeilRechts, GlyphSchluessel, GlyphLineal, GlyphInfo bzw. Prop pfeil.
- Unverändert: Datenabrufe, Filter, Dedupe der Links, FALLBACK_FAQ, ORDER_EXAMPLE (nur Schreibweise der Maße), Metadaten, JSON-LD, alle Texte mit Inhalt, Props-Verträge (keine Komponente geändert), keine Bewegung außer den bestehenden Einstiegsanimationen der Generatoren, kein neues Client-JavaScript (InfoTip bleibt wie zuvor).
- Abweichung zum Paketwortlaut: ausschnitt wurde nicht gesetzt, siehe offene Fragen.
- Kern-Version: Das Paket nennt 1.10, gelesen habe ich 1.12 (wie in der Aufgabe angegeben). Für diese Seite ergeben sich aus 1.11 und 1.12 keine zusätzlichen Pflichten.

GEMEINSAME DATEIEN
- Keine geändert.
- Wunsch K-005 (zur Entscheidung): h3-Größe uneinheitlich (K-005 text-title, K-005a text-title-sm). Verwendet: text-title-sm.
- Wunsch K-006 (zur Entscheidung): prose-sm24-Listen zeigen keine Aufzählungszeichen und wirken größer als der Fließtext. Bestand, nicht geändert.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: fehlerfrei (Exit 0, gesamtes Projekt).
- eslint auf die Seite: ohne Befund.
- vitest run src/components src/lib: 60 Dateien, 1100 Tests, alle grün.
- werte-suche.mjs: 0 Funde, 0 Ausnahmen (Protokoll unter _werkstatt/protokolle/werte-suche-2026-10-16_11-32-46.json).
- grep lucide-react auf die Seite: kein Treffer.
- Platzhalter im gerenderten HTML (localhost:3001, /gleichschliessende-zylinder): 0 Treffer für [Platzhalter, [PLZ], [Ort]. Genau ein h1.
- Keine Fehler in fremden Dateien gefunden, die mir im Lauf aufgefallen wären.
- Ergebnis: bestanden mit den unten genannten Hinweisen.

BILDBELEGE (Ordner /root/sm24-bilder/E5-BAUMEISTER-21/)
- gleichschliessende-zylinder__mobil__ganz.jpg (390 px), gleichschliessende-zylinder__tablet__ganz.jpg (768 px), gleichschliessende-zylinder__desktop__ganz.jpg (1440 px), Protokolle bild-mobil.json, bild-tablet.json, bild-desktop.json.
- warte-3500/gleichschliessende-zylinder__desktop__ganz.jpg (mit längerer Wartezeit, gleicher Befund).
- pruefskript/plan-desktop-sichtbar.png: Schließplan nach Scroll am Desktop, korrekt sichtbar.
- Ausschnitte zur Lesbarkeit: sicht-mobil-1 bis -7.png, sicht-desktop-1 bis -5.png, sicht-tablet-1 bis -4.png.
- Befund aus den Bildern: nichts abgeschnitten, kein horizontaler Überlauf, Abstände gleichmäßig, benachbarte Abschnitte wechseln Ton und Struktur (Bild ↔ Stückliste ↔ Haarlinienraster ↔ Tabelle), Beschriftungen in den Zeichnungen mobil lesbar. Zwei Befunde sind Aufnahmeartefakte (siehe unten).

OFFENE FRAGEN
1. Bauform-Produktzeichnungen (form.figure) erscheinen nicht mehr; die Bauformen zeigen Fach-Icons (Vorgabe des Pakets). Die Daten bleiben im Katalog unverändert. Bitte bestätigen.
2. ausschnitt wurde nicht gesetzt. Das Paket nennt es, die Aufgabe nennt das schmale Format als Ersatz. Mobil zeigt der schmale Plan korrekt.
3. Neue Augenbraue „Funktion“ für Abschnitt 03. Bitte prüfen, ob der Mikrotext bleibt.
4. Hinweis zur Messhilfe ist als Zeile mit GlyphInfo statt als Box gesetzt; der Text ist wortgleich.
5. ORDER_EXAMPLE und FALLBACK_FAQ stehen weiterhin im Code (offene Herkunftsfrage aus E5-KUNDSCHAFT).
6. Stiftzuhaltungs-Szene (Kür K-01) nicht eingebunden, nichts reserviert.
7. Artefakt, kein Befund: Auf Desktop und Tablet ist der Schließplan im Grundprinzip auf der Vollbild-Aufnahme leer, weil die Einstiegsanimation nicht ausgelöst wird. Per Scroll-Prüfung am Desktop ist der Plan sichtbar. Das Tablet habe ich nicht separat per Scroll geprüft.
8. Artefakt, kein Befund: In der mobilen Vollbild-Aufnahme liegt die fixierte Aktionsleiste über dem Schriftfeld des Kopfes. Im echten Scrollen nicht geprüft.

=== ENDE E5-BAUMEISTER-21 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen

- Bauform-Produktzeichnungen (form.figure aus cylinder-catalog.json) erscheinen nicht mehr auf der Seite; die Bauformen zeigen jetzt Fach-Icons (Vorgabe des Pakets). Die Daten bleiben unverändert im Katalog, werden hier aber nicht mehr ausgespielt. Bitte bestätigen.
- Das Paket nennt für den Schließplan mobil ein ausschnitt (schliessplanAusschnitt). Die Aufgabe nennt dagegen seit E4-GRAFIKER-09 das schmale Format, das ImagePlaceholder unter 640 px selbst wählt. Ich habe kein ausschnitt gesetzt; mobil erscheint der schmale Plan korrekt.
- Neue Augenbrauen-Bezeichnung „Funktion“ für den Abschnitt 03 (vorher nur Überschrift in h3). Bitte prüfen, ob der Mikrotext bleibt.
- Der Hinweis „Im Konfigurator wählen Sie Maß A und Maß B …“ steht jetzt als Zeile mit GlyphInfo statt in einer getönten Box. Das Icon Layers entfällt wie vorgesehen; der Text bleibt wortgleich.
- ORDER_EXAMPLE (Beispiel aus der Beratungspraxis) und FALLBACK_FAQ stehen weiterhin fest im Code. Die Maßangaben im Beispiel sind nur von Leerzeichen um den Schrägstrich betroffen („30 / 35“ statt „30/35“).
- Die Stiftzuhaltungs-Szene (Kür K-01) ist nicht eingebunden; wie vorgesehen habe ich nichts dafür reserviert.
- Vollbild-Aufnahmen zeigen den Schließplan im Grundprinzip auf Desktop und Tablet leer, obwohl das Markup vorhanden ist. Ursache ist, dass die Einstiegsanimation (sm24-draw/sm24-pop, data-motion=wait) bei der Vollbild-Aufnahme nicht ausgelöst wird. Per Scroll-Prüfung am Desktop (1440 px) ist der Plan korrekt zu sehen. Auf dem Tablet habe ich das nicht separat geprüft.
- Die mobile Vollbild-Aufnahme zeigt die fixierte Aktionsleiste unten über dem Schriftfeld des Kopfes. Das ist ein Artefakt der Vollbild-Aufnahme, kein Layoutfehler der Seite; ich habe es nicht im echten Scrollen geprüft.
