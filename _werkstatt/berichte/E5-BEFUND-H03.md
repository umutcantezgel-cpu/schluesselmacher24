# E5-BEFUND-H03 · Bericht und Abnahme (Modellseite VW Golf)

3 Prüfrunden; letztes Prüfurteil: nicht bestanden (2 Muss). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Muss Leiste:** behoben – die Leiste gilt erst für mehr als drei Zeichnungen (`gezeichnet.length > 3`), wie KERN K-006 „Mehr als drei gleichartige Karten“.
- **Muss Reihenfolge der Kopfgrafik:** behoben im gemeinsamen Generator (E5-L-28): Die Profile beginnen, wenn der letzte Körper ganz steht (bei drei Schlüsseln nach 0,56 s), Ende spätestens 1,6 s; neuer Test für 1, 2 und 3 Schlüssel.
- **Soll Abschnittsabstände:** bestätigt – Abschnitt 01 schließt eng an den Kopf an (die Zeichnungsreihe gehört zum Kopf), 04 ist ein kurzer Hinweisabschnitt; die Sichtabnahme der Prüfstufe B beurteilt den Takt.
- **Soll zwei Info-Zeichen in der Chipzeile:** bestätigt – zwei verschiedene Hinweise an zwei Chips (Schlüsselarten, Fahrzeug vor Ort), keine Wiederholung.

## Prüfurteil (letzte Runde)

- **muss:** Leiste ab drei Zeichnungen (page.tsx Z. 139 `leiste = gezeichnet.length >= 3`, Z. 57-65 LEISTE). KERN 1.12, K-006 (_werkstatt/KERN.md Z. 150): "Mehr als drei gleichartige Karten". Golf hat drei Zeichnungen und bekommt die Leiste, KERN verlangt sie erst ab vier. Paket und Bericht verlangen die Leiste ab drei; der Widerspruch ist nicht entschieden. Entscheidung des Orchestrators noetig: Schwelle bestaetigen oder KERN aendern.
- **muss:** Bewegung Kopfgrafik: Die Profile starten bei 300 ms und 400 ms, die Ebenen laufen bis 800 ms (src/components/visual/generators/schluessel.tsx Z. 473, 479, 492, fremde Datei ausserhalb der Schreibrechte). Das Paket verlangt, dass das Profil danach zeichnet (draw, hoechstens 1,1 s). Die Entscheidung des Orchestrators deckt nur die Ebenen-Staffel, nicht die Reihenfolge. Die Reihenfolge ist verletzt und mit den Schreibrechten nicht behebbar.
- **soll:** Abstaende zwischen den Abschnitten sind ungleich (Bericht, gemessen; am Golf-Bild bestaetigt): Desktop 01 zu 02 156 px, 02 zu 03 190 px, 03 zu 04 157 px, 04 zu 05 123 px; mobil 96/112/97/81 px. Paket und Entscheidung fordern gleichmaessigen Takt (page.tsx Z. 264 pb-section-tight nur fuer Abschnitt 01, Z. 392 tight fuer Abschnitt 04).
- **soll:** Doppelter Info-Zeichen in der Chipzeile: KEY_KIND_HINT am letzten Schluesselart-Chip (page.tsx Z. 251) und ON_SITE_HINT im Chip "Fahrzeug vor Ort noetig" (vehicle-facts.tsx Z. 28). Das Paket verlangt ein Zeichen im Chip. Die Erklaerung im Chip wechselt von KEY_KIND_HINT zu ON_SITE_HINT, eine inhaltliche Umbelegung. Auf dem Golf-Bild (mobil und desktop) stehen beide nebeneinander.
- **hinweis:** Keyless steht als Haarlinienzeile mit GlyphInfo unter den Zeichnungen (page.tsx Z. 134-137, 348-360) statt als vierte Karte. Das deckt die Entscheidung des Orchestrators; die Sichtabnahme hatte eine vierte Karte verlangt. Kein Muss.
- **hinweis:** Reduzierte Bewegung und die Zahnmarken (sm24-pop, 0,7 s bis 1,85 s) habe ich nicht selbst gemessen. Der Bericht meldet 0 laufende Animationen bei reduzierter Bewegung. Die Zahnmarken sind im Paket nicht genannt und bleiben offen.
- **hinweis:** Die BMW-Adresse aus dem Paket (/autoschluessel/marken/bmw) ist die Marken-Seite, nicht die geaenderte Modellseite. Zusaetzlich habe ich die Modellseite /autoschluessel/marken/bmw/3er in drei Breiten geprueft: zwei Karten ohne Leiste, Keyless-Zeile, Warnkasten und Chipzeile sauber, keine Abschneidung.
- **hinweis:** Vitest: 62 Dateien, 1114 Tests gruen. Der Bericht nennt 61 Dateien und 1111 Tests; die Differenz kommt von der fremden, neuen Testdatei src/components/visual/schluesselart-zeichnung.test.tsx. Die Tests des Pakets sind nicht geschwaecht.
- **hinweis:** Hilfsdatei ausserhalb des Paketordners: /root/sm24-bilder/E5-BEFUND-H03-nachpruefung-r1-diff.txt ist eine Kopie des Diffs, von mir in der ersten Befehlszeile unter /root/sm24-bilder/ angelegt. Nicht geloescht, weil Loeschen verboten ist. Die massgebliche Datei ist /root/sm24-bilder/E5-BEFUND-H03-nachpruefung-r1/diff.txt.

## Bericht des Baumeisters (letzte Runde)

E5-BEFUND-H03 · Baumeister · Runde 3 (Nachbesserung nach Prüfung Runde 2)

GEÄNDERTE DATEIEN
- src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx (in dieser Runde geändert).
- src/components/autoschluessel/vehicle-facts.tsx: in dieser Runde unverändert, Stand aus Runde 2 ist Grundlage.
- Keine Dateien gelöscht, nichts committet, nicht gepusht. Hilfsdateien nur unter /root/sm24-bilder/E5-BEFUND-H03-runde3/. Das gemeinsame Logikprotokoll und die Werte-Protokolle im Repository nicht verändert.

WAS UND WARUM (Runde 3)
1. Chip-Zeile mobil (Befund KeyKind-ⓘ): Die Schlüsselart-Chips baut die Seite jetzt als Liste; der ⓘ ist dem letzten Chip zugeordnet und bricht mit ihm gemeinsam um. Gemessen bei 390 px: „Keyless“ und ⓘ in Zeile 2 zusammen, kein ⓘ mehr allein. KeyKindBadges wird auf dieser Seite nicht mehr genutzt (key-kinds.tsx unverändert).
2. „Passend dazu“ (Befund Ordnung): Abschnittskopf mit Nummer 06 und Augenbraue „Weiterlesen“, Überschrift in Text-Titel-Größe. Auf dieser Seite gibt es keinen Abschnitt „Fragen“.
3. Desktop-Abstand (Befund D01): Abschnitt 01 hat `pb-section-tight` (Token spacing.section-tight). Gemessen bei 1440 px: Tabellenende bis „02“ von 190 auf 156 px, dem Wert Kopf bis „01“ (157 px). Bei 390 px von 112 auf 96 px.
4. Logikwächter (Muss 1): pruefen wurde nicht ausgeführt, weil es das Protokoll nicht kennt und sichern das gemeinsame Protokoll überschreiben würde. Manueller Vergleich über die exportierten Funktionen zerlegen und fingerabdruck (Skript /root/sm24-bilder/E5-BEFUND-H03-runde3/logik-vergleich.mjs, Ausgabe logik/vergleich.md):
   - page.tsx, 9e592a6 84393608af27, Arbeitsstand b4dad4fdfa85.
   - vehicle-facts.tsx, 9e592a6 bf6124e4692a, Arbeitsstand 27e007bf646a.
   - Gleich: Datenabfragen (getVehicleModel, getSettings), generateMetadata, notFound, Angabenwerte (Marke, Modell, Baujahre, Schlüsselarten, Anlernen, Hinweis), Linkziel assistantHref.
   - Abweichend, nur Darstellung: siehe Alt-Neu-Liste unten.
5. Bewegung H03 (Muss 2): nachgemessen mit Einzelbildern (bewegung.mjs einzelbilder, Selektor .bg-area-soft/40 svg[role=img], Desktop und Mobil) und mit der Web-Animations-API (Verzögerung und Dauer je Animation, Datei bewegung-zeiten.json):
   - Ebenen (sm24-reveal): Verzögerung 0 / 100 / 200 ms, Dauer je 600 ms. Vorgabe war 3 x 120 ms: Abweichung, offene Frage.
   - Profil (sm24-draw): Verzögerung 300 ms und 400 ms, Dauer je 1000 ms. Die Zeichnungsdauer liegt unter 1,1 s, das Ende bei 1,4 s. Offene Frage zur Auslegung.
   - Zahnmarken (sm24-pop): 700 bis 1250 ms Start, je 600 ms, Ende 1,85 s. Im Paket nicht genannt, offen.
   - Reduzierte Bewegung: 0 laufende Animationen, bewegung.mjs reduziert 0 Befunde bei 133 Textelementen. Sofortige Darstellung ist erfüllt.

ALT-NEU-LISTE (Darstellung, gegenüber 9e592a6)
- Kopf, Lead: „… bedeutet. Baujahre: ab 2003.“ wird zu „… bedeutet.“ Das Baujahr steht jetzt im Mono-Feld „Baujahre · ab 2003“ in der Chip-Zeile.
- Kopf, Chip-Zeile: Reihenfolge jetzt Schlüsselarten-Chips mit ⓘ am letzten Chip, dann Baujahr-Feld, dann „Fahrzeug vor Ort nötig“ mit ⓘ im Chip. Vorher: Badges, „Fahrzeug vor Ort nötig“, dann ⓘ allein.
- Kopf, Fachgrafik: neu als PageHeader-Grafik (7/5) in bg-area-soft/40 statt Bild im Abschnitt 01.
- Abschnitt 01: Augenbraue neu „01 Datensatz“. Tabelle SummaryList wird zu dl, Werte in Mono, Labels in Inter, Hinweis als Prosa.
- Abschnitt 02: Augenbraue neu „02 Schlüsselarten“. Zeichnungen als Karten mit Rahmen statt Rasterraster mit gap-px. Ab drei Zeichnungen mobil eine Leiste mit Anschnitt, Raster ab md. Keyless steht als Hinweiszeile mit GlyphInfo unter den Zeichnungen statt als Zusatz in der Smart-Key-Karte. Nicht gezeichnete Arten als Liste mit GlyphInfo statt dl.
- Abschnitt 03: Augenbraue „03 Einordnung“ unverändert, Nummer 03 neu. Der InfoTip „Fahrzeug vor Ort“ aus Punkt 1 ist entfallen, er steht jetzt im Chip. Die Zeile punkt.hinweis entfällt.
- Abschnitt 04: Augenbraue neu „04 Vorbehalt“. Ton von muted auf sunken geändert. Warnkasten von Alert auf eigenen Block mit role=note, surface, 2-px-Leiste bg-warning, GlyphWarnung, 8 Spalten. Titel und Text unverändert.
- Abschnitt 05: Augenbraue neu „05 Termin“. Knopf „{Marke} {Modell} auswählen“ wird zu „Mit diesem Fahrzeug starten“ (Mikrotext).
- „Passend dazu“: Mono-Überschrift wird zu Augenbraue „06 Weiterlesen“ und Überschrift text-title-sm.
- Abstand: Abschnitt 01 mit pb-section-tight (siehe oben).
- Vorlagen-Tests: keine Testdatei geändert.

GEMEINSAME DATEIEN
- Leiste ab drei Zeichnungen gegen KERN 1.10 („mehr als drei“). Entscheidung nötig.
- Ebenen-Staffel des Generators 100 ms gegen Paketvorgabe 120 ms; Zahnmarken bis 1,85 s. Fremde Datei, nicht geändert.
- KeyKindBadges (key-kinds.tsx) nicht mehr auf der Modellseite; Entscheidung, ob es einen InfoTip-Platz bekommt.
- Werte ohne Token in meinen Dateien: keine (werte-suche 0 Funde).

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: exit 0, 0 Fehler im Gesamtprojekt.
- eslint (beide Dateien): 0 Befund.
- vitest run src/components src/lib: 61 Dateien, 1111 Tests grün (Runde 2: 1111). src/app/(site)/seitenstruktur.test.ts: 2 von 2 grün.
- werte-suche: 2 Dateien, 0 Funde.
- lucide-react: kein Treffer in beiden Dateien.
- Platzhalter-Prüfung im gerenderten HTML (Golf, BMW): kein Treffer.
- Logikwächter: manueller Vergleich wie oben, keine Abweichung in Logik oder Daten, nur Darstellung.
- Bewegung: nachgemessen, siehe Punkt 5. Vorgaben 3 x 120 ms und 1,1 s teils nicht erfüllt, siehe offene Fragen.
- Abstände (1440 / 390 px): Kopf bis 01 157 / 97 px; 01 bis 02 156 / 96 px; 02 bis 03 190 / 112 px; 03 bis 04 157 / 97 px; 04 bis 05 123 / 81 px.
- Fremde Fehler: keine. Die fremden Änderungen in src/app/(site)/autoschluessel/page.tsx und schluesselarten-reihe.tsx wurden nicht berührt.

BILDBELEGE (/root/sm24-bilder/E5-BEFUND-H03-runde3/)
- Vollbilder Golf: autoschluessel-marken-volkswagen-golf__mobil__ganz.jpg, __tablet__ganz.jpg, __desktop__ganz.jpg (Mobil und Desktop gesichtet).
- Vollbilder BMW: autoschluessel-marken-bmw__mobil__ganz.jpg, __tablet__ganz.jpg, __desktop__ganz.jpg (noch nicht gesichtet).
- Einzelbilder Kopfgrafik: bewegung/…golf__desktop__bg-area-soft-40-svg-role-img__0 bis __4.jpg und …__mobil__…__0 bis __4.jpg.
- Messdaten: bewegung-zeiten.json, abstaende-nachher.json, logik/vergleich.md.

OFFENE FRAGEN
1. Leiste ab drei Zeichnungen (Code >= 3) gegen KERN 1.10 („mehr als drei“). Schwelle bestätigen oder KERN-Text anpassen.
2. Ebenen-Staffel: Paket 3 x 120 ms, Generator 0/100/200 ms. Vorgabe korrigieren oder den Generator anpassen lassen.
3. Profil: Dauer 1,0 s erfüllt die 1,1-s-Grenze, das Ende bei 1,4 s nicht. Welche Grenze gilt?
4. Zahnmarken laufen bis 1,85 s. Belassen oder kürzen?
5. Kein Abschnitt „Fragen“ auf der Seite. Gewünscht?
6. Abstand 02 bis 03 bleibt bei 190 px. Auch auf Takt 156 px?
7. Sichtprüfung Tablet und BMW steht noch aus.
8. KeyKindBadges auf der Modellseite nicht mehr genutzt. Soll es einen InfoTip-Platz bekommen, damit die Chip-Zeile nicht dupliziert wird?

=== ENDE E5-BEFUND-H03 · BEREIT ZUR RÜCKGABE ===

OFFENE FRAGEN
- Leiste ab drei Zeichnungen (Code: >= 3) gegen KERN 1.10 „mehr als drei“: Schwelle bestätigen oder KERN-Text anpassen.
- Generator-Staffel: Das Paket nennt 3 x 120 ms, der vorhandene Generator spielt 0/100/200 ms ab (Dauer je 600 ms). Entweder Vorgabe auf 100 ms korrigieren oder den fremden Generator anpassen lassen.
- Profil: Zeichnungsdauer 1,0 s (Vorgabe höchstens 1,1 s, erfüllt), Start 0,3 s und 0,4 s, also Ende 1,4 s. Gilt die Grenze für die Dauer oder für das Ende?
- Zahnmarken (sm24-pop) laufen von 0,7 s bis 1,85 s; das Paket nennt sie nicht. Im Generator belassen oder kürzen?
- Auf dieser Seite gibt es keinen Abschnitt „Fragen“; die Nummerierung 06 gilt nur für „Weiterlesen“ (Passend dazu). Ist ein Abschnitt „Fragen“ gewünscht?
- Abstand zwischen Abschnitt 02 und 03 bleibt bei 190 px (Standard-Abschnitt auf Standard-Abschnitt). Das Paket nennt nur die Lücke vor 02. Auf Takt 156 px bringen?
- Die Bildbelege für Tablet und die BMW-Seite sind erstellt, aber noch nicht gesichtet (nur Golf mobil und Golf Desktop geprüft). Sichtprüfung offen.
- Die Konstruktion der Chip-Liste dupliziert die Darstellung von KeyKindBadges (Entscheidung wie oben).

GEMEINSAME DATEIEN
- Keine Werte ohne Token in meinen Dateien: werte-suche meldet 0 Funde (2 Dateien, Protokoll im Arbeitsordner).
- Generator src/components/visual/generators/schluessel.tsx (fremd, nicht geändert): Ebenen-Staffel 0/100/200 ms statt der im Paket genannten 3 x 120 ms; Zahnmarken laufen bis 1,85 s. Entscheidung nötig, siehe offene Fragen.
- KERN 1.10 nennt die Leiste ab „mehr als drei“ Karten; das Paket und der Code verlangen sie ab drei. Entscheidung des Orchestrators nötig, KERN nicht geändert.
- src/components/autoschluessel/key-kinds.tsx (fremd, nicht geändert): KeyKindBadges wird auf der Modellseite nicht mehr verwendet; die Chip-Liste mit ⓘ baut die Seite selbst. Entscheidung, ob KeyKindBadges einen InfoTip-Platz bekommt.
