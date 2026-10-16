# E5-BEFUND-H07 · Bericht und Abnahme (Zylinder-Konfigurator)

Nachprüfung: bestanden (nur Soll und Hinweise). Abnahme durch den Orchestrator:

- **Entschieden:** Warnung „Anfertigung nach Ihren Maßen.“ bleibt über den Zusatzknöpfen; der Hauptknopf sitzt in der Leiste der FlowShell. Die Maßzeichnungen stehen als Reihe über dem Schriftfeld (Zuordnung der Zeilen wäre bei übersprungenen Positionen ohne Form unsicher). „keine“ bleibt in Inter (Text, kein Wert). Legenden mobil gemessen in E4-L-25 (13,2 und 12,4 px).
- **Logikwächter:** drei benannte Anzeige-Ausnahmen in `logik-ausnahmen.json` (Zeichnungsreihe, Schriftfeld); Prüfung „gleich“.

## Prüfurteil (letzte Runde)

- **soll:** Warnung „Anfertigung nach Ihren Maßen.“ steht über den Zusatzknöpfen „Maße noch einmal prüfen“ und „Zusammenstellung verwerfen“ (konfigurator.tsx Z. 632–640), nicht direkt über „In den Warenkorb“. Der Hauptknopf sitzt in der FlowShell-Leiste außerhalb der Datei (Bild schritte/05). Das Paket setzt den Knopf in der Datei voraus; Wunsch an die FlowShell, Entscheidung des Orchestrators offen.
- **soll:** Prüfschritt Grafik 3: Die Maßzeichnungen stehen als Reihe über dem Schriftfeld (konfigurator.tsx Z. 608–628, Nacharbeit des Orchestrators), nicht neben der Zeile wie im Paket. Die Breite „rund 240 px“ (sm:w-60) ist entfallen; die Zeichnung füllt die Rasterzelle. Die Bemaßungsfarbe „area“ liegt in der fremden Datei zylinder-mass-live.tsx und ist nicht belegt.
- **soll:** Typografie 1: Die Wertspalte im Schriftfeld ist nur bei Beträgen, Stückzahlen und Kennungen in Mono. „keine“ im Bild schritte/05 (Gemeinsame Schlüssel, Schutz und Optionen) bleibt in Inter. Das Paket verlangt „font-mono tabular-nums text-right“ für die Wertspalte; die Option mono für die ganze Spalte liegt in der gemeinsamen Datei summary-list.tsx und ist als Wunsch gemeldet.
- **soll:** Grafik 1 (KERN 1.8, Beschriftung auf Telefonen mindestens etwa 11,5 px): Die schmale Fassung ist umgesetzt (sm:hidden in zylinder-mass-live.tsx). Die Schriftgröße im 390-px-Bild (mobil) ist nicht gemessen. Die Legenden „außen“, „innen“ und „Mitte Stulpschraube“ wirken klein. Offene Prüfung, kein belegter Verstoß.
- **hinweis:** Bericht und Code weichen ab: Der Bericht nennt die Etikett „Zylinder“ und sm:w-60, der Code hat „Ihre Zylinder“ (konfigurator.tsx Z. 611) und keine Breitenangabe. Die Ausnahmeliste enthält den entfallenen Ausdruck sections={summary.slice(1)} nicht mehr. Der Bericht ist für diesen Stand nicht maßgeblich.
- **hinweis:** Logikwächter: 0 abweichend (15 Dateien). Die Ausnahme für den Prüfschritt (logik-ausnahmen.json, Regex bis zum ersten </ul></div>) nimmt den ganzen neuen Block aus dem Vergleich. Ich habe den Block gelesen: nur data.items, key, Index+1, Katalogname und ZylinderMassLive, keine Handler oder Bedingungen. Die elf Einzelausnahmen des Berichts sind zu drei Einträgen zusammengefasst. page.tsx ist im Protokoll nicht enthalten; das Sichern übernimmt der Orchestrator.
- **hinweis:** Weiterlesen (page.tsx Z. 66–70): Augenbraue als rohe Klasse „eyebrow“ statt SectionHeading mit nummer/eyebrow (KERN 1.6). Ob die Form genau dem Assistenten entspricht, ist nicht im Detail abgeglichen.
- **hinweis:** Sichtprüfung Maßfeld (desktop, tablet): Felder 5 Spalten links, Zeichnung 7 Spalten rechts über zwei Zeilen, Erläuterung unter den Feldern. Eine Zeichnung im Kasten „So messen Sie richtig“. Summe „39,00 €“ in Mono, Warnung als Haarlinie mit Glyphe, ohne Fläche.
- **hinweis:** Die laufende Summe nutzt key={breakdown.totalCents} mit animate-schleier-ein (konfigurator.tsx Z. ca. 402–406). Das folgt der Paket-Entscheidung und KERN 1.12 (B-20). Die Befundtabelle nennt dagegen sm24-pop; das ist überholt.
- **hinweis:** Nebenwirkung der Prüfung: funktionsliste.mjs --nur F-05 hat ein Protokoll unter _werkstatt/protokolle/ geschrieben (funktionsliste-2026-10-16_16-02-38.md/.json). Das Werkzeug legt es selbst ab; nichts in der Projektdatei geändert.

## Bericht des Baumeisters (letzte Runde)

E5-BEFUND-H07 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Befundpaket 1 von höchstens 2 für H07 Zylinder-Konfigurator

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx (nur JSX, className, Importe aus @/components/visual/)
- /home/user/schluesselmacher24/src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx (nur JSX und className)

WAS UND WARUM
1. Eine Zeichnung statt zwei: Die Musterzeichnung im Kasten „So messen Sie richtig“ entfällt (ImagePlaceholder slot={catalog.measuringFigure}); der Text bleibt. Grund: Befund Komposition 2 und Grafik 2, Entscheidung des Orchestrators.
2. Maßfeld: Maß A, Maß B und Erläuterung in lg:col-span-5 (lg:grid-cols-1), die Live-Zeichnung in lg:col-span-7 mit lg:row-span-2, beide gleich hoch; unter lg wie bisher untereinander. Grund: Befund Komposition 1.
3. Zusammenfassung: Zylinder-Positionen mit Live-Zeichnung (ZylinderMassLive, sm:w-60, sm:col-span-5) neben der Zeile; Zeile mit Beschriftung „Position N“, Bezeichnung aus der Preisaufstellung, Stückzahl und Betrag in font-mono. Die übrigen Abschnitte über SummaryList variante="schriftfeld" hervorheben="Gesamt"; Werte in Mono, Beträge rechtsbündig. Grund: Befund Typografie 1 und Grafik 3.
4. Warnung „Anfertigung nach Ihren Maßen“: Haarlinienzeile mit GlyphWarnung in text-warning, ohne Fläche, über den Zusatzknöpfen. Alt-Neu: Titel „Anfertigung nach Ihren Maßen“ → „Anfertigung nach Ihren Maßen.“ (Punkt ergänzt, sonst Wortlaut gleich). Grund: Befund Farbe und Bild.
5. Laufende Summe: dd mit key={breakdown.totalCents} und animate-schleier-ein (B-20). Grund: Befund Bewegung; der Befund nennt sm24-pop, KERN 1.12 nennt animate-schleier-ein; umgesetzt nach KERN.
6. Weiterführender Block in page.tsx: Augenbraue „02 Weiterlesen“ (eyebrow, Nummer tabular), Überschrift text-title font-bold (vorher text-title-sm), Liste mt-8, Zeilen min-h-touch-lg, Labels text-title-sm, Pfeil 18 px mit zeiger:group-hover:translate-x-1. Alt-Neu für Mikrotexte: Augenbraue „Weiterlesen“ und Nummer „02“ neu. Grund: Befund Details 3.

WORTLAUT: Keine Texte mit Inhalt geändert. Neu als Etiketten: „Zylinder“ (Abschnittslabel im Prüfschritt), „Position N“, „Stück“.

GEMEINSAME DATEIEN
Siehe Feld gemeinsame_dateien: Logikwächter-Ausnahmen (11 Einträge, einzeln benannt), Wunsch an summary-list.tsx, Dev-Hinweis im Fuß (fremd).

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0, keine Fehler.
- eslint (beide Dateien): Exit 0, kein Befund.
- vitest run src/components src/lib: 61 Dateien, 1111 Tests grün.
- werte-suche: keine Funde.
- lucide-react: kein Treffer in beiden Dateien.
- Platzhalter im gerenderten HTML: 0 Treffer.
- Logikwächter: Teil A gleich; Teil B abweichend (siehe Ausnahmen); page.tsx ohne Protokolleintrag (Orchestrator: sichern).
- funktionsliste F-05: BESTANDEN 1 von 1.
- Bilder Einstieg: desktop, tablet, mobil (--ganz). Desktop und mobil gesichtet: Maßfeld 5/7 mit Zeichnung daneben, eine Zeichnung im „So messen“-Kasten, Augenbraue „02 Weiterlesen“. Schritt 05 gesichtet: Prüfschritt mit Zeichnungen, Mono-Werten und Haarlinien-Warnung. Tablet nicht gesichtet.
- Keine Sperre aktiv. Keine Dateien gelöscht. Hilfsdateien nur unter /root/sm24-bilder/E5-BEFUND-H07/. Protokolle von werte-suche und funktionsliste in _werkstatt/protokolle/ (Werkzeugausgabe).

BILDBELEGE
- /root/sm24-bilder/E5-BEFUND-H07/gleichschliessende-zylinder-konfigurator__desktop__ganz.jpg
- /root/sm24-bilder/E5-BEFUND-H07/gleichschliessende-zylinder-konfigurator__tablet__ganz.jpg
- /root/sm24-bilder/E5-BEFUND-H07/gleichschliessende-zylinder-konfigurator__mobil__ganz.jpg
- /root/sm24-bilder/E5-BEFUND-H07/schritte/01-zylinder-zusammenstellen.jpg bis 05-prüfen-und-in-den-warenkorb-legen.jpg (nur 05 gesichtet)

OFFENE FRAGEN
- B-20: animate-schleier-ein (KERN) statt sm24-pop (Befund). Bitte bestätigen.
- KERN-Version: 1.10 (Paket) gegen 1.12 (Datei) gegen 1.8 (Aufgabe). Gearbeitet nach 1.12.
- Warnung „direkt über dem Knopf“: steht über den Zusatzknöpfen, nicht unmittelbar über „In den Warenkorb“. Bitte bestätigen.
- Prüfschritt: Zylinder-Zeilen selbst gerendert, die SummaryList-Spalte Zylinder entfällt. Bitte bestätigen.
- Mobil: Legenden der Zylinderzeichnung wirken klein (ZylinderMassLive, fremde Datei). Mindestgröße 11,5 px gegenprüfen.
- Nicht gesichtet: Tablet-Aufnahme und Schritte 01 bis 04.
- Logikwächter: page.tsx braucht sichern durch den Orchestrator. Nicht von mir ausgeführt, da es das gemeinsame Protokoll überschreibt.

=== ENDE E5-BEFUND-H07 · BEREIT ZUR RÜCKGABE ===

OFFENE FRAGEN
- Widerspruch im Befund: Die Tabelle nennt B-20 als sm24-pop und quick. KERN 1.12 (B-20) und die Entscheidung des Orchestrators verlangen wechselnden key mit animate-schleier-ein. Umgesetzt: animate-schleier-ein. Bitte bestaetigen.
- Versionsangabe: Das Paket nennt KERN 1.10, die Datei _werkstatt/KERN.md traegt 1.12, die Aufgabenbeschreibung nennt 1.8. Gearbeitet nach KERN.md 1.12.
- Warnung im Pruefschritt: Die Haarlinienzeile steht direkt ueber den Zusatzknoepfen (Masse noch einmal pruefen, Zusammenstellung verwerfen), nicht unmittelbar ueber In den Warenkorb (FlowShell). Der Befund verlangt direkt ueber dem Knopf. Bitte bestaetigen.
- Summenzeile Zylinder im Pruefschritt: Die Zylinder-Zeilen rendere ich selbst, damit die Zeichnung neben der Zeile steht. Die SummaryList-Spalte Zylinder entfaellt dadurch; die Betraege stehen in der Zeile je Position, die Gesamtsumme in der Preisaufstellung. Bitte bestaetigen.
- Mobile Beschriftungen der Zylinderzeichnung (Legenden aussen, innen, Mitte Stulpschraube) wirken in der 390-px-Aufnahme klein. Die Zeichnung kommt aus ZylinderMassLive, nicht aus dieser Datei. Mindestgroesse 11,5 px nicht gemessen; bitte gegenpruefen.
- Nicht gesichtet: Tablet-Aufnahme und Schrittbilder 01 bis 04. Pruefung offen, bitte nachholen.
- Der Logikwaechter meldet page.tsx als nicht im Protokoll. Das ist der Orchestrator-Schritt sichern fuer diese Datei, nicht meine Abweichung.

GEMEINSAME DATEIEN
- Logikwaechter Teil A der konfigurator.tsx ist gleich; nur Teil B weicht ab. Ausnahmen Logikwaechter (reine Anzeige-Ausdruecke, je einzeln; Orchestrator traegt sie in logik-ausnahmen.json ein): (1) Ausnahme Logikwaechter: sections={summary.slice(1)} - Zusammenfassung ohne Zylinder-Abschnitt, weil die Zylinder-Zeilen mit Zeichnung eigens gerendert werden (ersetzt sections={summary}). (2) Ausnahme Logikwaechter: entfernt slot={catalog.measuringFigure} - Musterzeichnung im Kasten So messen Sie richtig entfaellt (Entscheidung Orchestrator; Text bleibt). (3) Ausnahme Logikwaechter: {data.items.map((item, index) => ...)} - Liste der Positionen im Pruefschritt, nur Lesen. (4) Ausnahme Logikwaechter: key={item.uid} - Schluessel der Liste. (5) Ausnahme Logikwaechter: {index + 1} - Positionsnummer. (6) Ausnahme Logikwaechter: {breakdown.lines[index]?.label} - Beschriftung der Position aus der vorhandenen Preisaufstellung. (7) Ausnahme Logikwaechter: {item.qty} - Stueckzahl der Position. (8) Ausnahme Logikwaechter: {formatCents(positionTotalCents(catalog, item))} - Betrag der Position, dieselbe Rechnung wie die Zwischensumme. (9) Ausnahme Logikwaechter: form={item.form} aussen={item.measureAMm} innen={item.measureBMm} name={catalog.forms.find((f) => f.id === item.form)?.label ?? ''} - ZylinderMassLive im Pruefschritt, liest nur item und Katalogname. (10) Ausnahme Logikwaechter: {' '} - Leerzeichen zwischen Warnungstitel und Warnungstext. (11) Ausnahme Logikwaechter: key={breakdown.totalCents} am dd der laufenden Summe - wechselnder key fuer animate-schleier-ein (B-20). Der Waechter zeigt key-Attribute im Diff nicht; sie werden vorsorglich genannt. Die bestehende Ausnahme des Zylindermass-Ternaers (B-17) ist unveraendert und zaehlt weiter 1x. page.tsx hat keinen Eintrag im Logikwaechter-Protokoll; sichern habe ich bewusst nicht ausgefuehrt, weil es das gemeinsame Protokoll ueberschreibt. Werte ohne Token: sm:w-60 (15 rem = 240 px, Tailwind-Standardabstand) fuer die Pruefschritt-Zeichnung; kein eigenes Token vorhanden. Gemeinsame Datei mit Wunsch: summary-list.tsx, Variante schriftfeld setzt nur Betraege, Stueckzahlen und Kennungen in Mono; Werte wie keine, ja, nein bleiben in Inter. Wunsch: Option mono fuer die ganze Wertspalte. Dev-Hinweis im Fuss (Hinweis fuer die Redaktion: Firmendaten sind nach Platzhalter) ist fremd, nur im Entwicklungsmodus sichtbar, nicht behoben.
NACHARBEIT DES ORCHESTRATORS (nach dem Bau, vor dieser Prüfung)
- Die Positionszeilen im Prüfschritt holten ihre Beschriftung über `breakdown.lines[index]`; die Preisberechnung überspringt Positionen ohne Bauform im Katalog, die Zuordnung über den Index kann dann verrutschen. Neu: Das Schriftfeld zeigt wieder die vollständige Zusammenfassung (`sections={summary}`, mit Zylinder-Abschnitt und Preisrechnung), darüber steht je Position nur die Maßzeichnung mit „Position n“ (Raster ab sm zwei, ab lg drei Spalten).
- Benannte Ausnahmen im Logikwächter (`_werkstatt/werkzeuge/logik-ausnahmen.json`, D-042): Zeichnungsreihe, Leerzeichen der Warnzeile, entfallene Musterzeichnung. `logikwaechter.mjs pruefen`: 0 abweichend.
