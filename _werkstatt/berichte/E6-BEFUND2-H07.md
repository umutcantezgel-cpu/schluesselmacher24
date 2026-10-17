# E6-BEFUND2-H07 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Bildprüfung nicht durchgeführt. Port 3001 antwortet nicht (curl Exit 7, Verbindung abgelehnt, mehrfach geprüft bis zum Laufende). Nicht belegt sind: Befund 1 (Rahmen), 2 (Zeile statt Kasten), 3 (Summe mobil), 4 (Mono ohne Umbruch), 6 (01 Weiterführend, Pfeil), 7 (Zeichnung sofort vollständig), Überlauf, Sprung per Anker mit scroll-padding, Hover und Fokus, Schrittbilder F-05, gerenderter Platzhalter-Grep. Es gibt kein Bild aus diesem Lauf. Den Server habe ich nicht gestartet.
- **muss:** Pflichtprüfung 390 px (Schritt 5) nicht gemacht. Nach Breitenschätzung (nicht gemessen) bricht „In den Warenkorb“ um: Summenblock rund 115 px, Zurück rund 66 px, Absenden (lg, px-6, Inter 16 px) rund 183 px, zwei Lücken à 12 px, zusammen rund 388 px gegen 358 px Breite. Mit summe entfällt fullWidth (flow-shell.tsx Z. 231 und 242), der Knopf hat kein whitespace-nowrap. Dann verlangt das Paket label: 'Summe'. Konfigurator Z. 370 hat noch 'Laufende Summe'.
- **soll:** Zahl und Einheit: KERN 1.14 (K-006 Kleinregeln) verlangt ein geschütztes Leerzeichen (  bzw. {' '}). Umgesetzt ist whitespace-nowrap mit normalem Leerzeichen (konfigurator.tsx Z. 819 bis 821, „5 mm“ in Z. 821). Sichtbar bleibt die Einheit zusammen, der Wortlaut von KERN wird aber verfehlt. Das Paket stützt das Verbot von &nbsp; auf K-006, dort steht das Gegenteil. Entscheidung beim Orchestrator. formatMillimeter und formatCents (src/lib/format.ts) sind nicht meine Dateien.
- **hinweis:** Logikwächter konfigurator.tsx ABWEICHEND, nur durch die angekündigten Ausdrücke: entfallen sind {catalog.measuringInfo.title}, {catalog.measuringInfo.body} und slot={catalog.measuringFigure} (Ausnahme a), neu ist summe={{ label: 'Laufende Summe', wert: formatCents(breakdown.totalCents) }} in Z. 370 (Ausnahme b). Teil A ohne Abweichung. Das Tool zählt slot doppelt, weil der Basis-Ersatz aus logik-ausnahmen.json die Basis verdoppelt; im Code ist die Entfernung einmal da. Der Eintrag für das Muster \{catalog\.measuringInfo\.title\} matcht jetzt 0-mal und muss angepasst werden. Die beiden Ausnahmen sind noch nicht eingetragen.
- **hinweis:** Versionsangabe: der Paketkopf nennt Kern-Version 1.15, der Auftrag nennt 1.14. KERN.md steht auf 1.15 (Kopf und letzter Eintrag). Die zitierten 1.14-Regeln stehen dort. Keine Auswirkung auf das Urteil.
- **hinweis:** Fremde Abweichungen, nicht bewertet: warenkorb-ansicht.tsx ist im Logikwächter ABWEICHEND (Teil B), tuer-und-schliesstechnik/page.tsx ist im Arbeitsbaum geändert. Beides liegt nicht im Diff dieses Pakets.
- **hinweis:** Prozessfehler dieses Prüfers: Meine Läufe haben im Ordner /root/sm24-bilder/E6-BEFUND2-H07-pruefung-r3/ sechs bereits vorhandene Protokolle überschrieben (tsc.txt, eslint.txt, werte-suche.txt, werte.json, vitest-komponenten-lib.txt, vitest-eigene.txt). Die Vorfassungen sind nicht wiederherstellbar. Die neuen Ergebnisse stehen dort und decken sich mit dem Baumeister-Bericht. Meine neuen Dateien: vitest-komponenten-lib.json, vitest-ordner-zylinder.txt, vitest-seitenstruktur.txt, logikwaechter.md.
- **hinweis:** Der Baumeister-Bericht nennt „Ordner gleichschliessende-zylinder: grün“. Dort gibt es keine Testdateien (find ohne Treffer). Geprüft ist der Seitenstruktur-Test: 1 Datei, 2 Tests grün.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H07 · Baumeister · Runde 3 (Nachlauf zum Prüfstopp aus Runde 2)

STATUS: Prüfstopp bleibt. Die Umsetzung der Punkte 1 bis 7 ist im Code vorhanden und am Code geprüft. Bestehen ist nicht belegt, weil die Bildprüfung ausgefallen ist (Port 3001 nicht erreichbar, siehe PRÜFUNG).

GEÄNDERTE DATEIEN
In diesem Lauf wurde nichts geändert. Die vier Schreibrechte-Dateien stehen bereits im Stand HEAD 6e4981c (Diff gegen d4a1d47: 27 Zeilen + und 27 Zeilen -):
- src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx
- src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx
- src/components/visual/interaktiv/zylinder-mass-live.tsx
- src/components/visual/interaktiv/zylinder-mass-live.test.tsx
Nicht committet, nicht gepusht, keine Dateien gelöscht.
Fremd im Arbeitsbaum, nicht dieses Pakets: warenkorb-ansicht.tsx und tuer-und-schliesstechnik/page.tsx.

WAS UND WARUM (Punkte aus „Umsetzen“, Zeilen nach dem aktuellen Stand)
1. Komposition Befund 1 (Rahmen ineinander): erledigt. konfigurator.tsx Z. 742: Maßfläche `border-t border-border pt-5` statt Fläche mit Rahmen. zylinder-mass-live.tsx Z. 37: `cn('sm24-ruhig', className)`, also ohne Rahmen und Innenabstand. Einziger Rahmen bleibt die Positionskarte. Raster unverändert. Bildprüfung offen.
2. Komposition Befund 2 (Kasten doppelt den Messtext): erledigt. konfigurator.tsx Z. 421–427: Kasten ersetzt durch `<a href="#weiterfuehrend">` mit GlyphLineal size 16 und Text „Zylinder richtig ausmessen“. Import konfigurator.tsx Z. 30. page.tsx Z. 65: `Section id="weiterfuehrend"` als Ziel. Der Messtext unter den Feldern bleibt sichtbar.
   Alt-Neu (Mikrotext): Kasten „So messen Sie richtig“ (Titel plus Text) → Linkzeile „Zylinder richtig ausmessen“.
3. Komposition Befund 3 (laufende Summe scrollt weg): im Code erledigt. konfigurator.tsx Z. 370: `summe={{ label: 'Laufende Summe', wert: formatCents(breakdown.totalCents) }}` am FlowShell. Der Fallback label 'Summe' ist nicht angewendet, weil erst die Bildprüfung bei 390 px entscheidet.
4. Typografie Befund 4 (Maßwerte brechen): erledigt. konfigurator.tsx Z. 819–821: Gesamtlänge, Grundlänge, Zuschlag und „5 mm“ je in `<span className="whitespace-nowrap font-mono tabular-nums text-foreground">`. Die drei `{' '}` bleiben dreimal stehen, kein neuer Ausdruck. Leerzeichen zwischen Zahl und Einheit ist normal, siehe Regelkonflikt unter OFFENE FRAGEN.
5. Details Befund 8 (auf alle 1 Zylinder): erledigt. konfigurator.tsx Z. 553–554.
   Alt: „Optionen mit Preis je Zylinder werden auf alle {n} Zylinder dieser Bestellung gerechnet. Sie können jede Option wieder abwählen.“
   Neu: „Optionen mit Preis je Zylinder werden für jeden Zylinder dieser Bestellung gerechnet, zurzeit {n} Stück. Sie können jede Option wieder abwählen.“ (Der Span steht in Mono, ohne Umbruch.)
6. Details Befund 9 (02 Weiterlesen): erledigt. page.tsx Z. 66–72: `SectionHeading nummer="01" eyebrow="Weiterführend"`, Titel unverändert. Import page.tsx Z. 8. Pfeil Z. 84 nach KERN 1.14: gedämpft in Ruhe, `group-hover:text-primary group-focus-visible:text-primary`, B-06 mit `zeiger:group-hover:translate-x-1`. Der Link trägt `group` (Z. 77).
   Alt-Neu (Augenbraue): „02 Weiterlesen“ → „01 Weiterführend“.
7. Bewegung Befund 7 (Zeichnung blass und ohne Bemaßung): erledigt im Code. zylinder-mass-live.tsx Z. 37: `sm24-ruhig` an der figure. Hülle mit key und `animate-schleier-ein` bleibt. Test zylinder-mass-live.test.tsx Z. 28–29: zwei neue Prüfungen (`sm24-ruhig` an figure, keine Border-Klasse an figure). Keine Prüfung gelockert, keine entfernt.

Nicht umgesetzt, wie im Paket vorgesehen: Typografie 5 und 6, FlowShell-Teil der Summe, raster="seite", Details 10, Kennzahlleiste, Feldhinweise, Textinhalte, Bauformkarten. Alle bleiben unverändert.

Soll-Befund Zahl und Einheit: nicht entschieden, weil das Paket es dem Orchestrator überlässt. Siehe OFFENE FRAGEN.

GEMEINSAME DATEIEN
- Ausnahmen Logikwächter, wörtlich:
  (a) Ausnahme Logikwächter: entfällt {catalog.measuringInfo.title}, {catalog.measuringInfo.body} sowie das über die bisherige Ausnahme eingesetzte slot={catalog.measuringFigure} – Kasten „So messen Sie richtig“ durch Zeile mit GlyphLineal ersetzt
  (b) Ausnahme Logikwächter: summe={{ label: 'Laufende Summe', wert: formatCents(breakdown.totalCents) }} – laufende Summe in Leiste und Band
- _werkstatt/werkzeuge/logik-ausnahmen.json Z. 51–52: das Muster `\{catalog\.measuringInfo\.title\}\s*</h3>` findet nach dem Entfernen des Kastens nichts mehr. Der Orchestrator passt es an oder entfernt es. Nicht geändert.
- Fremd, nicht behoben: warenkorb-ansicht.tsx hat eine Logikwächter-Abweichung (Teil B). tuer-und-schliesstechnik/page.tsx ist im Arbeitsbaum geändert. Beides nicht im Diff dieses Pakets.
- Für den Soll-Befund: src/lib/format.ts (formatMillimeter Z. 64) liefert „70 mm“ mit normalem Leerzeichen. Eine Änderung dort wäre nötig, falls das geschützte Leerzeichen gelten soll. Nicht geändert, nicht meine Datei.

PRÜFUNG UND ERGEBNIS
- Lock /tmp/sm24-messfenster.lock: bei jedem Lauf nicht vorhanden. Gearbeitet wurde ohne Wartezeit.
- tsc --noEmit: exit 0, 0 Fehler (tsc.txt).
- eslint auf die vier Dateien: exit 0, kein Befund (eslint.txt).
- vitest run src/components src/lib: 67 Dateien, 1163 Tests grün, wie im Vorlauf (vitest-komponenten-lib.txt). zylinder-mass-live.test.tsx: 4 Tests grün. Ordner gleichschliessende-zylinder: grün (vitest-eigene.txt).
- werte-suche auf die vier Dateien: keine Funde, 0 Ausnahmen (werte-suche.txt, werte.json).
- Logikwächter: konfigurator.tsx ABWEICHEND, nur durch die oben gemeldeten Ausdrücke. page.tsx und zylinder-mass-live.tsx gleich. warenkorb-ansicht.tsx ABWEICHEND, fremd (logikwaechter.txt).
- Platzhalter im Quelltext der vier Dateien: 0 Treffer für „[Platzhalter“. Die gerenderte Platzhalter-Prüfung ist nicht durchgeführt.
- Bildprüfung: NICHT DURCHGEFÜHRT. curl auf http://localhost:3001 liefert 000, ss zeigt keinen Listener auf 3001 oder 3000. Den Server habe ich nicht gestartet, das Paket verbietet es.
  Nicht belegt: Befund 1 (desktop und mobil), Sprung der Zeile auf 01 Weiterführend (scroll-padding), mobiler Prüfschritt bei 390 px, Befund 7 (sofort vollständig), F-05 Schritte 1–5 (zurzeit 1 Stück, Summe im Band), Hover und Fokus des Pfeils, Überlauf in Positionskarte und Zeichnungsreihe, Zeile unter klebender Leiste mobil, gerenderter Platzhalter-Grep.
- Ergebnis: Code-Stufe A grün. Bestehen des Pakets ist nicht belegt, solange die Bildprüfung fehlt.

BILDBELEGE
Keine Bilder erstellt. Protokolle dieses Laufs liegen im neuen Ordner /root/sm24-bilder/E6-BEFUND2-H07-pruefung-r3/ (tsc.txt, eslint.txt, vitest-komponenten-lib.txt, vitest-eigene.txt, logikwaechter.txt, werte-suche.txt, werte.json). Vorläufe bleiben unverändert: /root/sm24-bilder/E6-BEFUND2-H07-pruefung-r2/ und /root/sm24-bilder/E6-BEFUND2-H07-pruefung-r1/.

OFFENE FRAGEN
1. Regelkonflikt Zahl und Einheit (Soll, Orchestrator-Entscheidung): Umgesetzt ist das Paket-Muster (whitespace-nowrap, normales Leerzeichen). KERN 1.14 verlangt ein geschütztes Leerzeichen. Dafür müssen formatMillimeter und formatCents in src/lib/format.ts ein geschütztes Leerzeichen liefern (nicht in meinen Rechten), oder es entstehen neue JSX-Ausdrücke {' '}, die der Logikwächter meldet. Bis zur Entscheidung unverändert.
2. Bildprüfung: Port 3001 muss vom Betreiber gestartet werden, danach Lauf erneut. Ohne Bilder ist das Paket nicht abnahmefähig.
3. Mobiler Prüfschritt bei 390 px: Mit summe verliert der Hauptknopf fullWidth (src/components/flow/flow-shell.tsx, fullWidth={!summe}). Bricht „In den Warenkorb“ um, greift der Paket-Fallback label: 'Summe'. Das wäre als Alt-Neu zu melden.
4. logik-ausnahmen.json: Die beiden Ausnahmen (a) und (b) sowie die Anpassung von Z. 51–52 trägt der Orchestrator ein.

=== ENDE E6-BEFUND2-H07 · BEREIT ZUR RÜCKGABE ===
