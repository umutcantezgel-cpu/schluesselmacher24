# E4-GRAFIKER-10 · Bericht und Abnahme

Workflow `wf_5555f066-5e0`, 1 Prüfrunde, bestanden. Abnahme durch den Orchestrator mit Nacharbeit:

- **Farbe:** Die Stationen standen grau auf grau und trugen als Blickfang im Seitenkopf nicht. Neu: Kreise `stroke-area` (Bereichsfarbe), die aktive Station `fill-area-soft stroke-area-strong`; Pfeilspitzen `fill-area`, 12 × 9 statt 9 × 7 (auf Telefonen gut 8 px).
- **Zeichnen:** Die `sm24-draw`-Linie bekommt `DRAW_DASHARRAY` wie die übrigen Generatoren (Prüferhinweis).
- **Tests (Alt → Neu, Zahl gleich):** „drei Stationen ohne Parameter“: `fill-surface stroke-border-strong` ×3 → `fill-surface stroke-area` ×3; „genau eine Station aktiv“: `fill-surface stroke-area-strong` ×1 / `fill-surface stroke-border-strong` ×2 → `fill-area-soft stroke-area-strong` ×1 / `fill-surface stroke-area` ×2. 19/19 grün.
- **Gemeinsame Dateien:** Registry (`ablauf`, `SCHMALES_FORMAT`), Registry-Test (Name, Komponente, schmale Fassung), README-Abschnitt, KERN 1.11 B-23.
- **Offene Fragen, entschieden:** zweireihige Beschriftung bei vier langen Einträgen gilt; Endstriche statt Pfeilspitzen an den Bemaßungsenden gelten (Kettenmaß); eine ungültige Liste fällt ganz auf den Standard zurück (die Zeichnung zeigt nie eine halbe Aussage); `aktiv` über der Anzahl hebt nichts hervor.
- **Bilder:** neu gerendert mit dem vollständigen Tailwind-CSS des Projekts (breit 480, schmal 358, aktiv 2) und angesehen.

## Prüfurteil

- **soll:** Bemaßungsenden als Striche statt Pfeilspitzen (ablauf.tsx Z. 157 und 239). Der Auftrag verweist für die Enden auf zylinder-mass.tsx, dort sind es Pfeilspitzen (Z. 268 und 273). Abweichung vom Muster, vom Baumeister zur Bestätigung gemeldet.
- **hinweis:** Vier Stationen mit je 14 Zeichen stehen zweireihig (ablauf.tsx Z. 170-171, 181-189). Der Auftrag verbietet das nicht, nur Überlappung. Bild 04 ist sauber. Entscheidung zur Bestätigung durch den Orchestrator.
- **hinweis:** Eine zu lange Beschriftung verwirft die ganze Liste auf den Standard (ablauf.tsx Z. 66-67). Der Auftrag „verworfen → Standard“ ist mehrdeutig. Umsetzung ist vertretbar, Klärung nötig.
- **hinweis:** aktiv wird auf 0 bis 4 begrenzt (ablauf.tsx Z. 297), also liefert aktiv 5 Station 4 statt des Standards 0. Der Auftrag nennt dafür keine Regel.
- **hinweis:** Die sm24-draw-Pfade setzen kein strokeDasharray={DRAW_DASHARRAY} (ablauf.tsx Z. 152-158 und 234-240). Andere Generatoren tun das (tuer-schutz.tsx:276, profillinie.tsx:98). Mit dem Standardmuster kann am Pfadende ein Punkt sichtbar sein. Im Endzustand ist er nicht sichtbar, die Anfangsphase ist nicht geprüft.
- **hinweis:** registry.test.tsx:83 ist rot, weil der Registry-Eintrag fehlt. Das ist vorgesehen und Sache des Orchestrators, kein Befund dieses Pakets.
- **hinweis:** Die Ratgeber-Ansicht ist nicht prüfbar, weil die Grafik dort noch nicht eingebunden ist (Registry und Motiv beim Orchestrator). Die Bilder entstanden als eigenständige Seiten mit einer lokalen Kopie des Live-CSS von Port 3001.
- **hinweis:** Pfeilspitzen 9 x 7 bei 358 px sind etwa 6 px groß. In den Bildern zart, aber erkennbar. Der Baumeister hat die Größe als offene Frage gemeldet.
- **hinweis:** Verfahrensfehler des Prüfers: Der werte-suche-Lauf hat ein Protokoll im Repository angelegt, _werkstatt/protokolle/werte-suche-2026-10-16_11-08-54.json (untracked). Ich habe es nicht gelöscht, da Löschen verboten ist. Der Orchestrator sollte es entfernen.

## Bericht des Grafikers

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/components/visual/generators/ablauf.tsx (neu)
- /home/user/schluesselmacher24/src/components/visual/generators/ablauf.test.tsx (neu)

WAS UND WARUM
- Exportiert: AblaufGrafik(props: VisualProps), ablaufSchritte(params) (bereinigte Liste, leer = Standard), ablaufHoehe(anzahl) und ABLAUF_FLAECHE (Maße beider Formate).
- Parameter: schritte (Text, durch | getrennt, 2 bis 4 Einträge, je höchstens 14 Zeichen, leere Einträge entfallen), aktiv (0 oder 1 bis 4, Akzent auf Kreis und Nummer), format (breit oder schmal). Ohne gültige schritte: drei Stationen nur mit Nummern 01 bis 03.
- Format breit, 480 x 270, Schrift 16: waagerechte Bemaßungslinie (LINIE, stroke-border-strong) mit Anfangs- und Endstrich über die Breite 20 bis 460; je Station gestrichelte Hilfslinie (HILFSLINIE) von der Linie nach oben zum Kreis (Radius 22, KONTUR, fill-surface), Nummer in Mono, Beschriftung in Mono darunter; Pfeilspitzen zwischen den Stationen über pfeilspitze(), Hilfsraster über Raster. Stationen gleichmäßig verteilt, Ränder gleich, vertikal mittig.
- Format schmal, Breite 300, Höhe 88 + (Anzahl - 1) x 68 (drei Stationen: 224; vier: 292): dieselben Elemente senkrecht, Bemaßungslinie links, Beschriftung rechts neben dem Kreis, Pfeilspitzen nach unten. Schrift 12: 12 x 358 / 300 ergibt rund 14,3 px Darstellung.
- Bewegung nach B-23 mit motionStyle(): Bemaßungslinie sm24-draw 0,6 s; Stationen sm24-pop mit Staffel 0,12 s, Dauer 0,4 s; Beschriftungen, Hilfslinien und Pfeile sm24-fade mit ihrer Station (Pfeile mit der Station, auf die sie zeigen). Gesamtdauer 1,36 s. Keine weiteren Animationen. Reduzierte Bewegung regelt globals.css; die Endlage ist ohne Animation voll sichtbar.
- Vertrag eingehalten: keine id, kein marker, keine Hex- oder rgb-Werte, Farben nur über Klassen, role="img" mit title über GrafikRahmen, deterministisch.

Abweichungen vom Auftrag (begründet, zur Bestätigung)
1. Vier Stationen mit je 14 Zeichen passen nicht in eine Reihe: 4 x 134 Einheiten bei Schrift 16 überschreiten 480 deutlich. Umgesetzt: Ab dem ersten Konflikt stehen die Stationen 2 und 4 in einer zweiten Reihe 24 Einheiten tiefer, mit gestrichelter Verlängerung von der Linie. Keine Beschriftungen überlappen; der Test prüft das je Reihe.
2. Bemaßungsenden als kurze Endstriche statt Pfeilspitzen, weil der Auftrag "Anfangs- und Endstrich" nennt.
3. Liegt ein Eintrag über 14 Zeichen oder die Anzahl außerhalb 2 bis 4, fällt die ganze Liste auf den Standard zurück (nicht nur der einzelne Eintrag).
4. aktiv wird auf 0 bis 4 begrenzt; liegt es über der Anzahl der Stationen, ist keine Station hervorgehoben.

GEMEINSAME DATEIEN
- src/components/visual/registry.tsx: Import AblaufGrafik aus './generators/ablauf' und Eintrag ablauf: AblaufGrafik in REGISTRY. Ohne ihn schlägt src/components/visual/registry.test.tsx:83 fehl (erwartet 'ablauf' in visualNames()). Die Datei ändere ich nicht.
- src/components/visual/registry.tsx: 'ablauf' in SCHMALES_FORMAT, damit schmaleFassung() unter 640 px die schmale Fassung setzt (wie schliessplan und zylinder-mass).
- src/components/visual/README.md: Abschnitt zum Generator ablauf (Parameter, Formate 480 x 270 und 300 breit, Bewegung B-23).
- Registereintrag B-23 für den Generator, falls die Bewegungsliste beim Orchestrator liegt.
- Hilfsdateien liegen unter /root/sm24-bilder/E4-GRAFIKER-10/ (render.mts, shot.mjs, tw.config.ts, tw.css, html/, svg/, png/, werte-suche.json). Ausnahme: /root/sm24-bilder/tsc-E4-GRAFIKER-10.txt liegt außerhalb des Paketordners; die Datei ist leer, und ich habe sie wegen des Löschverbots nicht entfernt.

PRÜFUNG UND ERGEBNIS
- Lock-Datei /tmp/sm24-messfenster.lock bestand zu keinem Zeitpunkt.
- vitest src/components/visual/generators/ablauf.test.tsx: 19 von 19 grün.
- vitest src/components/visual: 25 Dateien, 761 Tests, 760 grün, 1 rot: registry.test.tsx:83 (fehlender Registry-Eintrag, siehe GEMEINSAME DATEIEN). Nicht behoben, da fremde Datei.
- npx tsc --noEmit (ganzes Projekt): Exit 0, keine Ausgabe.
- npx eslint der zwei Dateien: Exit 0, keine Meldung.
- node _werkstatt/werkzeuge/werte-suche.mjs der zwei Dateien: 0 Funde; 2 Ausnahmen (rgb( und oklch( in den Negativtests der Testdatei). Protokoll: /root/sm24-bilder/E4-GRAFIKER-10/werte-suche.json.
- Testabdeckung: Rendern ohne Parameter; Reihenfolge der Beschriftungen; zwei und vier Schritte; Rückfall auf den Standard bei zu langen oder zu vielen Einträgen; aktiv (genau eine Station); beide Formate mit eigener viewBox und Mindestschrift (Rechnung 358 / Breite, mindestens 11,5); alle Elemente innerhalb der Fläche; keine Überlappung bei vier Stationen mit 14 Zeichen; Determinismus; Vertrag (keine id, kein marker, keine Farben); Bewegungsklassen, Gesamtdauer unter 1,6 s, Staffel höchstens 4 x 0,12 s.
- Bildprüfung: Die Vorschau nutzt die Tokens aus globals.css und die Tailwind-Konfiguration des Projekts, mit reduzierter Bewegung (Endzustand). Die Schrift ist die Systemschrift für Mono, da IBM Plex Mono in der Werkzeugumgebung fehlt.
- Git: nur die zwei neuen Dateien im Repository. Kein Commit, kein Push, keine Löschung.

BILDBELEGE
Alle 14 PNG-Dateien unter /root/sm24-bilder/E4-GRAFIKER-10/png/, je 358 px und 480 px: 01-standard-breit, 02-sichern-breit, 03-sichern-schmal, 04-vier-14-breit, 05-vier-14-schmal, 06-aktiv2-breit, 07-aktiv2-schmal. Gesichtet: 02 (drei Stationen breit) sauber; 04 (vier Stationen, 14 Zeichen) zweireihig ohne Überlappung; 05 (schmal, vier Stationen) klar lesbar; 06 (aktiv 2) mit Akzentfarbe. Die Pfeilspitzen wirken bei 358 px zart.

OFFENE FRAGEN
- Registry-Eintrag und SCHMALES_FORMAT (siehe GEMEINSAME DATEIEN): Orchestrator.
- Vier Stationen mit je 14 Zeichen: Ist die zweireihige Lösung gewollt, oder soll der Umbruch anders aussehen?
- Bemaßungsenden als Striche statt Pfeilspitzen: bestätigen.
- Ungültige Liste: ganzer Rückfall auf den Standard (umgesetzt) oder Verwerfen nur des zu langen Eintrags?
- Pfeilspitzen bei 358 px etwa 6 px: Größe anheben?
- Schrift am Gerät prüfen (IBM Plex Mono in der Vorschau nicht verfügbar).

=== ENDE E4-GRAFIKER-10 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen des Grafikers

- Vier Stationen mit je 14 Zeichen passen in der Breite 480 nicht in eine Reihe (4 x 134 Einheiten bei Schrift 16 sind mehr als 480). Umgesetzt: Ab dem ersten Konflikt stehen die Stationen 2 und 4 in einer zweiten Reihe 24 Einheiten tiefer, mit gestrichelter Verlängerung. Der Test prüft die Überlappung je Reihe. Bitte bestätigen, ob die zweireihige Lösung gilt.
- Bemaßungsenden: Der Auftrag nennt 'Anfangs- und Endstrich' und verweist zugleich auf zylinder-mass. Umgesetzt sind kurze Endstriche statt Pfeilspitzen, weil der Wortlaut eindeutig ist. Bitte bestätigen.
- Ungültige Liste: Ist ein Eintrag länger als 14 Zeichen oder die Anzahl außerhalb von 2 bis 4, fällt die ganze Liste auf den Standard (drei Stationen ohne Beschriftung) zurück. Der Auftrag lässt offen, ob nur der zu lange Eintrag verworfen wird. Umgesetzt ist der Gesamtrückfall.
- Pfeilspitzen auf der Bemaßungslinie sind bei 358 px nur etwa 6 px groß und wirken zart. Ob die Größe (Länge 9, Breite 7 Einheiten) angehoben werden soll, entscheidet der Grafiker oder der Orchestrator.
- Schriftprüfung: Die Vorschau in Chromium nutzt die Systemschrift für Mono (IBM Plex Mono ist in der Werkzeugumgebung nicht installiert). Die Maße stimmen auf 0,6 em; die Optik der echten Schrift ist am Gerät zu prüfen.
