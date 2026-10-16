# E4-BAUMEISTER-09 · Bericht und Abnahme

Workflow `wf_2c413c54-12a`, 3 Prüfrunden, letzte Prüfung nicht bestanden. Fertigstellung und Abnahme durch den Orchestrator siehe D-029.

## Letzter Bericht des Baumeisters

E4-BAUMEISTER-09, Runde 3 (Prüfung nach Ablehnung in Runde 2)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/schluessel-nach-code/[slug]/page.tsx: Zeile 240, Pfeil-Glyphe der Weiter-Liste, `text-foreground-subtle` durch `text-foreground-muted` ersetzt (KERN 1.6: foreground-subtle nicht auf muted-Flächen; die Zeile liegt in `<Section tone="muted">`). Die übrige Änderung in dieser Datei (`nummer="01"` in Zeile 219) war schon im Arbeitsbaum vorhanden und ist unverändert.

WAS UND WARUM
- Muss-Befund KERN 1.6 behoben. Sonst keine Änderung in diesem Lauf. Logik, Props, Hooks, Texte, generateStaticParams, notFound, noindex, Filter und Suche unverändert.
- Nicht umgesetzt, weil eine Entscheidung nötig ist: Logikwächter-Befund (siehe OFFENE FRAGEN) und die Überschriften H06 (neue Augenbrauen-Begriffe nötig).

GEMEINSAME DATEIEN
- Keine Werte ohne Token (werte-suche: 0 Funde).
- Fußzeile (gemeinsames Layout, nicht im Paket): sichtbarer Text „Hinweis für die Redaktion: Firmendaten sind noch Platzhalter.“ auf H05 und H06, alle Geräte. Nur gemeldet.

PRÜFUNG UND ERGEBNIS
- Sperrdatei /tmp/sm24-messfenster.lock: bei jeder Prüfung nicht vorhanden.
- tsc --noEmit: Exit 0, 0 Fehler.
- eslint über die vier Paketdateien: Exit 0.
- vitest run src/components: 28 Dateien, 750 Tests, alle grün.
- werte-suche.mjs über die vier Paketdateien: 0 Funde.
- grep lucide-react in den Paketdateien: kein Treffer.
- logikwaechter.mjs pruefen: „abweichend: 1“, Exit 3 (bestell-formular.tsx, Teil B, Zeile 197). Unverändert offen.
- Live-Schlüssel nicht erneut im Browser geprüft (Änderung betrifft ihn nicht).

BILDBELEGE
Neuer Ordner: /root/sm24-bilder/E4-BAUMEISTER-09-runde3/ (ganzseitig, Port 3001, HTTP 200 bei allen sechs Aufnahmen):
- H05 mobil, tablet, desktop; H06 mobil, tablet, desktop (Dateinamen siehe Feld bilder).
- Ausschnitt H05 desktop Unterkante: h05-desktop-unten-ausschnitt.jpg.
Einschränkung: H05 mobil und tablet sind so hoch, dass Details beim Anzeigen verloren gehen. Dort ist nur eine Übersicht möglich, keine sichere Aussage zu Überlauf oder Abständen.
Die Vorläufe in /root/sm24-bilder/E4-BAUMEISTER-09-pruefung-r2/ bleiben unverändert liegen.

OFFENE FRAGEN
1. Logikwächter, Befund 1 (bestell-formular.tsx Zeile 197, `<LiveSchluessel code={codeValid ? normalized : ''} className="mt-4" />`): Entscheidung des Orchestrators nötig. Entweder Ausnahme in _werkstatt/werkzeuge/logik-ausnahmen.json für genau diesen Ausdruck oder neue Sicherung nach Freigabe. Keine Ausnahme eingetragen.
2. H06 Überschriften ohne SectionHeading und Nummer (Zeilen 118, 126, 152). Die Augenbrauen-Begriffe wären neuer Text; Entscheidung durch den Orchestrator. Nicht umgesetzt.
3. Fremde Datei src/components/forms/photo-upload.tsx (E3-BAUMEISTER-03): auf H06 Desktop brechen „Foto aufnehmen“ und „Aus Galerie wählen“ um. Nur gemeldet.
4. Fußzeilen-Redaktionshinweis (gemeinsames Layout). Nur gemeldet.
5. H05 mobil und tablet: Empfehlung zur Detailprüfung per DOM (horizontaler Überlauf bei 390 px und 768 px) oder mit Ausschnitten.
6. Hinweis zur Arbeitsweise: tsc- und vitest-Ausgaben liegen unter /tmp/claude-0/ (tsc-e4b09.txt, vitest-e4b09.txt) statt im Scratchpad. Gelöscht wurde nichts.

Nicht committet, nicht gepusht, nichts gelöscht, /dev nicht angefasst.

## Letzte Prüfung (Runde 3)

- **muss:** KERN 1.6 Abschnittsköpfe: Auf H06 (`src/app/(site)/schluessel-nach-code/[slug]/page.tsx` Z. 118, 126, 152) sind „Was Sie erhalten“, „Technische Angaben“ und „Wo steht der Code?“ nackte `h2` ohne `SectionHeading`, ohne `nummer` und ohne `eyebrow`; der Abschnitt hat kein `labelledBy`. KERN verlangt für Abschnittsköpfe `SectionHeading` mit fortlaufender Nummer und Augenbraue. Der Baumeister-Grund „neue Augenbrauen-Begriffe nötig“ trägt nicht: „Codefundstelle“ steht bereits als Augenbraue auf H05 (`page.tsx` Z. 143) und ist derselbe Titel. Auslegung: die drei Überschriften sind Abschnittsköpfe innerhalb eines `Section`.
- **muss:** Logikwächter nicht bestanden: `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen` meldet Exit 3, Basis b49fe04, „abweichend: 2“. Eigene Datei `[slug]/bestell-formular.tsx`, Teil B, neuer Ausdruck `code={codeValid ? normalized : ""}` (Z. 197, Attribut von `LiveSchluessel`). Das Paket verlangt „abweichend: 0“. Der Paket-Text widerspricht sich zugleich (er sagt, JSX zähle nicht zum Fingerabdruck, Teil B zählt aber Attributausdrücke). Die zweite Abweichung liegt in `gleichschliessende-zylinder/konfigurator/konfigurator.tsx` und gehört einem parallelen Paket. Entscheidung des Orchestrators nötig: Ausnahme in `_werkstatt/werkzeuge/logik-ausnahmen.json` oder neue Sicherung nach Freigabe. Der Baumeister hat richtig gemeldet; er hat aber keine Ausnahme eingetragen, also bleibt der Befund offen.
- **soll:** Fremde Datei `src/components/forms/photo-upload.tsx` (E3-BAUMEISTER-03, nicht Paket-Befund): auf H06 mobil und desktop brechen die Schaltflächen „Foto aufnehmen“ und „Aus Galerie wählen“ im Foto-Feld um (Ganzseitenbild und Ausschnitt). Nur gemeldet.
- **soll:** Gemeinsames Layout `src/components/layout/site-footer.tsx` Z. 52 (nicht im Paket): sichtbarer Text „Hinweis für die Redaktion: Firmendaten sind noch Platzhalter.“ auf H05 und H06, auf allen Geräten. Das ist ein sichtbarer Platzhalterhinweis. Entscheidung des Orchestrators. Nur gemeldet.
- **hinweis:** Trefferkarten auf H05 (`shop-liste.tsx` Z. 248, `ImagePlaceholder`) zeigen leere Bildflächen. Im Ganzseitenbild mobil ist das deutlich zu sehen. Keine Textplatzhalter, aber sichtbar leer.
- **hinweis:** Reduzierte Bewegung der beiden Client-Hüllen (`LiveSchluessel`, `CodeFundstelleInteraktiv`, gemeinsame Dateien) wurde nicht mit Emulation „Bewegung reduzieren“ geprüft. Nicht belegt, kein Befund.

Prüfungen: Gesperrt-Prüfung: /tmp/sm24-messfenster.lock bei jedem Lauf nicht vorhanden.

- tsc --noEmit: Exit 0, 0 Fehler (Ausgabe in /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/e4b09-r3/tsc.txt).
- eslint über die vier Paketdateien: Exit 0.
- vitest run src/components: 28 Dateien bestanden, 750 Tests bestanden, Exit 0.
- werte-suche.mjs über die vier Paketdateien: 4 Dateien geprüft, 0 Funde, 0 Ausnahmen. Hinweis: Das Werkzeug schreibt ein Protokoll, hier `_werkstatt/protokolle/werte-suche-2026-10-16_08-04-43.json` (neu, untracked).
- grep lucide-react in den vier Dateien: kein Treffer.
- logikwaechter.mjs pruefen: Exit 3, Basis b49fe04, abweichend 2. Eigene Datei bestell-formular.tsx (Teil B, Z. 197). Fremd gleichschliessende-zylinder/konfigurator.tsx. Protokoll wird nicht geschrieben.
- Port 3001: HTTP 200 (/schluessel-nach-code und /schluessel-nach-code/ms-01).
- DOM-Überlauf (document.scrollWidth = clientWidth) bei 390, 768 und 1440 px auf H05 und H06: kein Seitenüberlauf. Die Treffer sind SVG-Pfade in gekappten Grafiken, nicht sichtbar.
- Ganzseitenbilder H05 mobil und tablet: über Ausschnitte (Fundstelle, Liste, Kopf) und Ansichtsfenster-Aufnahmen (390 und 768 px) geprüft. Die Fundstellen-Zeichnung ist im Ansichtsfenster vollständig (Lupe sichtbar). Die Ganzseitenbilder waren mitten in der Animation.
- Eigene Hilfsaufnahmen und Skripte in scratchpad: moment.mjs, ueberlauf.mjs (keine Projektdateien geändert).

Nicht committet, nicht gepusht, nichts gelöscht, /dev nicht angefasst, keine Projektdatei geändert."
