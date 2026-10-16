# E4-BAUMEISTER-10 · Bericht und Abnahme

Workflow `wf_2c413c54-12a`, 3 Prüfrunden, letzte Prüfung nicht bestanden. Fertigstellung und Abnahme durch den Orchestrator siehe D-029.

## Letzter Bericht des Baumeisters

GEÄNDERTE DATEIEN
Keine. In diesem Lauf wurde keine Paketdatei geändert, nichts committet und nichts gelöscht. Die beiden Paketdateien stehen im Zwischenstand-Commit b19d2ac des Workflows; der Arbeitsbaum ist für sie sauber.

WAS UND WARUM
- Muss 1 (Abschnitt #systeme, data-motion="wait"): nicht behoben. Die Ursache liegt in in-view.tsx und section.tsx (außerhalb meiner Rechte) oder erfordert das Entfernen des Reveal (Registeränderung B-04). Die Entscheidung liegt beim Orchestrator. Gemessen auf Port 3001 bestätigt sich der Befund: Desktop 3902 px Sektionshöhe, Hülle wait, Karten opacity 0 und paused; mobil 6512 px, dasselbe. Zusätzlich ist die Einstiegsbewegung des interaktiven Schließplans pausiert (17 animierte Elemente paused, 5 auf Deckkraft 0). Das bloße Entfernen des Reveal würde den großen Moment nicht sichtbar machen.
- Soll 2 (Kürzel in den Zeichnungen mobil): nicht behoben. Gemessen 8,56 px gerenderte Schriftgröße bei 390 px (35 Kürzel). Die Ursache liegt im Generator (SCHRIFT 13 in 480er-Viewbox), außerhalb meiner Rechte. Ein kleinerer Innenabstand im Kartenkopf brächte nur rund 1 px und ist keine Lösung.
- Soll 3 (Schritt 7, Tastaturprobe): belegt. Tab erreicht die Registerleiste nach 16 Tabs; Pfeil rechts wechselt auf „Generalhauptschlüsselanlage“; Tab führt auf den Chip „GHS“; Leertaste setzt aria-pressed auf true, die Live-Ansage lautet „GHS schließt 4 Türen: Tür 1, Tür 2, Tür 3 und Tür 4.“. Das Bild zeigt die Figur im pausierten Einstieg.

GEMEINSAME DATEIEN
- src/components/visual/motion/in-view.tsx (Schwelle 0,25)
- src/components/layout/section.tsx (InView-Hülle je Abschnitt)
- src/components/visual/generators/schliessplan.tsx und grafik-basis.tsx (SCHRIFT 13)
- _werkstatt/KERN.md, Registeränderung B-04
- max-w-2xl in src/app/(site)/schliessanlagen/page.tsx Z. 318: aus dem Vorzustand übernommen, nicht in K-005a, unverändert

PRÜFUNG UND ERGEBNIS
Vorab: Meine ersten Browserläufe liefen gegen localhost:3000 (Standardwert von lib.mjs), nicht gegen den Entwicklungsserver 3001. Deren Ausgaben in /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3/ sind ungültig und bleiben liegen. Alle Werte stammen aus Läufen mit SM24_BASIS_URL=http://localhost:3001. Vor jedem Test und Bildlauf habe ich /tmp/sm24-messfenster.lock geprüft; die Sperre bestand nie.
1. git status: für beide Dateien keine Änderung. Fremd geändert: src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx.
2. tsc --noEmit: Exit 0, 0 Fehler im Projekt (/tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/e4b10-r3/tsc.txt).
3. eslint auf beiden Dateien: Exit 0, ohne Befund.
4. vitest run src/components: 28 Dateien, 750 Tests bestanden, Exit 0.
5. werte-suche auf beiden Dateien: 0 Funde, 0 Ausnahmen.
6. grep lucide-react: kein Treffer.
7. Logikwächter: nicht ausgeführt (Dateien nicht geschützt).
8. Tastaturprobe Port 3001: siehe WAS UND WARUM, Soll 3.
9. Sichtbarkeit #systeme Port 3001: Desktop 3902 px, mobil 6512 px, jeweils Hülle wait; reduzierte Bewegung zeigt die Karten (opacity 1). Keine seitliche Überlappung (scrollWidth gleich clientWidth).
10. Kürzel mobil: 8,56 px gerendert (35 Kürzel), normal und reduziert identisch.
11. JS-Budget: nicht per Build gemessen, nicht geändert.
Schritte 2 bis 6 wie vom Prüfer beschrieben; Schritt 4 verletzt wegen Muss 1; Schritt 7 belegt. Das Paket ist nicht rückgabereif, bis Muss 1 und Soll 2 entschieden sind.

BILDBELEGE
- /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3b/tastatur-schliessplan-desktop.jpg
- /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3b/mobil-normal-karten-viewport.jpg (Kartenfläche leer)
- /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3b/tastatur-und-kuerzel-probe.json
- /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3b/tastatur-probe.mjs
- /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3b/werte-suche.json
- Ungültig, liegen gelassen: /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3/

OFFENE FRAGEN
1. Muss 1, Entscheidung beim Orchestrator. Option A: in-view.tsx oder section.tsx ändern und die Auslöseschwelle für hohe Abschnitte senken; der Callback prüft ohnehin nur isIntersecting. Das wirkt global, behebt aber auch den Schließplan. Option B: Reveal von den Karten entfernen (Registeränderung B-04). Das liegt in meinem Schreibrecht, sobald freigegeben, behebt aber nur die Karten. Empfehlung des Baumeisters: Option A, weil nur sie die Sichtbarkeit des großen Moments löst.
2. Soll 2, Entscheidung: Generator-Variante für schmale Breiten durch einen Berechtigten, oder eine Kürzelliste als Text unter der Zeichnung (neuer Inhalt, Freigabe nötig).
3. Das Probe-Skript sollte laut Paket in /root/sm24-bilder/E4-BAUMEISTER-10/ liegen. Ich habe es neben die Ergebnisse in E4-BAUMEISTER-10-pruefung-r3b gelegt, weil der Ordner aus Runde 1 belegt ist.

=== ENDE E4-BAUMEISTER-10 · RÜCKGABE MIT OFFENEN FRAGEN ===

## Letzte Prüfung (Runde 3)

- **muss:** Abschnitt #systeme bleibt unsichtbar (Muss 1 des Baumeisters bestätigt). Die Hülle der Section (src/components/layout/section.tsx Z. 41, InView-Standardschwelle 0,25 in src/components/visual/motion/in-view.tsx Z. 24) meldet nie 'play', weil der Abschnitt 3902 px (Desktop) bzw. 6512 px (mobil) hoch ist und höchstens 900/844 px im Ansichtsfenster stehen. Gemessen auf Port 3001 nach Scrollen zum Plan und zu den Karten: data-motion=wait, 130 von 130 sm24-Elementen pausiert, Karten opacity 0 (Desktop und mobil). Bei reduzierter Bewegung stehen die Karten auf opacity 1. Sichtfotos im Ansichtsfenster zeigen einen leeren Schließplan (nur Raster) und leere Kartenflächen. Die Ursache liegt außerhalb der Schreibrechte (section.tsx, in-view.tsx); der Befund betrifft aber den großen Moment des Pakets. Der Entfernen-des-Reveal-Weg behebt die Einstiegsbewegung des Plans nicht. Entscheidung beim Orchestrator.
- **muss:** Kürzel in den Zeichnungen sind mobil nicht lesbar: gemessen 8,56 px gerenderte Schriftgröße bei 390 px Breite für alle 40 Kürzel in #systeme (Desktop mindestens 14,25 px). Das liegt unter der kleinsten KERN-Textstufe (text-caption, 10–12 px), das Prüfkriterium 'Beschriftungen mobil lesbar' ist verletzt. Ursache im Generator (SCHRIFT 13 in der 480er-Viewbox, src/components/visual/generators/schliessplan.tsx und grafik-basis.tsx), außerhalb der Schreibrechte. Entscheidung beim Orchestrator: Generator-Variante für schmale Breiten oder Kürzelliste als Text.
- **soll:** Die Legenden 'Schlüssel wählen' und 'Tür wählen' in src/components/visual/interaktiv/schliessplan-interaktiv.tsx (Z. 116 und 135) nutzen text-foreground-subtle auf der Sektionsfläche bone-sunken. KERN 1.6 verbietet foreground-subtle auf surface-sunken. Datei ist nur lesbar, Befund gehört dem Orchestrator bzw. dem zuständigen Paket.
- **soll:** JS-Budget des Pakets (Client-Hülle unter 5 KB komprimiert, kein neues Client-JS) ist nicht belegt. Es gab keinen Build und keine Messung. Schließplan-Generator (554 Zeilen) wird vom Client-Bauteil SchliessplanInteraktiv importiert und landet damit wahrscheinlich im Client-Bundle. Ohne Messung nicht bestätigt.
- **hinweis:** Globale Fußzeile zeigt 'Hinweis für die Redaktion: Firmendaten sind noch Platzhalter.' auf jeder Seite (Layout, nicht Paketdatei). Der Text ist für den Prüfpunkt 'keine sichtbaren Platzhalter' relevant, gehört aber nicht zu E4-BAUMEISTER-10.
- **hinweis:** Die Tabulatorzahl bis zur Registerleiste hängt vom Startpunkt ab. Von Seitenanfang sind es 66 Tabs (inkl. Kopfnavigation), nicht 16 wie im Bericht. Der Pfad selbst funktioniert: Pfeil rechts wechselt auf GHS-Register, Chip GHS ist fokussierbar mit sichtbarem Fokusring, Leertaste setzt aria-pressed auf true, Live-Ansage lautet 'GHS schließt 4 Türen: Tür 1, Tür 2, Tür 3 und Tür 4.'
- **hinweis:** Das Probe-Skript soll laut Paket in /root/sm24-bilder/E4-BAUMEISTER-10/ liegen. Es liegt im Ordner E4-BAUMEISTER-10-pruefung-r3b des Baumeisters. Mein eigenes Probe-Skript liegt im Scratchpad (probe.mjs).

Prüfungen: Git: git status zeigt für die beiden Paketdateien keine Änderung gegenüber HEAD 2ed7d8a. Fremd geändert: src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx. Die Paketänderungen liegen in den Commits b19d2ac, 4208fa8, 59e6789 (Basis eeea2f9). tsc --noEmit: Exit 0, 0 Fehler. eslint auf beiden Paketdateien: Exit 0, ohne Befund. vitest run src/components: 28 Dateien, 750 Tests bestanden, Exit 0. werte-suche auf beiden Dateien: 0 Funde, 0 Ausnahmen. grep lucide-react: kein Treffer (Exit 1). Logikwächter: nicht erforderlich. Lock /tmp/sm24-messfenster.lock: vor jedem Lauf nicht vorhanden. Entwicklungsserver Port 3001: HTTP 200.\n\nMessung Port 3001 (Probe-Skript): Desktop 1440x900, Sektion #systeme 3902 px, data-motion wait nach Scrollen zum Plan und zu den Karten, 130 von 130 sm24-Elemente pausiert, 67 mit opacity 0. Mobil 390x844, Sektion 6512 px, dasselbe Ergebnis. reduziert Desktop: data-motion wait, 0 pausiert, Karten opacity 1. Kürzel-Schrift mobil 8,56 px (40 von 40), Desktop 14,25 px min. Überlauf Desktop und mobil: scrollWidth gleich clientWidth. Tastaturprobe Desktop: 66 Tabs bis Registerleiste von Seitenanfang, ArrowRight wechselt auf Generalhauptschlüsselanlage, Tab auf Chip GHS, Leertaste aria-pressed true, Live-Ansage 'GHS schließt 4 Türen: Tür 1, Tür 2, Tür 3 und Tür 4.'.\n\nBilder (neu, Ordner /root/sm24-bilder/E4-BAUMEISTER-10-pruefung-r3-pruefer, weil r3 die ungültigen Läufe des Baumeisters enthält): Ganzseitenbilder mobil, tablet, desktop (--ganz) mit JSON-Protokollen; Ansichtsfenster: grosser-moment und karten für mobil und desktop; Tastatur vor und nach Leertaste. Alle Bilder angesehen: kein Überlauf, keine Abschneidungen, keine Platzhalter im Paketinhalt, Systemvergleich mobil als gestapelte Liste lesbar, FAQ und Passend dazu mobil korrekt. Leere Kartenflächen und leerer Plan sind kein Animationszeitpunkt-Artefakt, sondern bleiben nach Scrollen bestehen (siehe Muss 1). Auf den Ganzseitenbildern des Desktop und Tablet ist der Systeme-Abschnitt ebenso leer.\n\nNicht ausgeführt: next build (würde den Entwicklungsserver stören), daher keine JS-Budget-Messung."
