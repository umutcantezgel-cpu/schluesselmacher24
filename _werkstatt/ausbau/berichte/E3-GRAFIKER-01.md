# E3-GRAFIKER-01 · Bericht

Paket: Neue Fach-Icons und Glyphen der eigenen Familie · Stufe 2 · Modell Haiku 5.5

## GEÄNDERTE DATEIEN
Neu, je genau ein Export (9):
- src/components/visual/icons/motorradschluessel.tsx (Runde 2)
- src/components/visual/icons/schluesselgehaeuse.tsx (Runde 2)
- src/components/visual/icons/schluesselfinder.tsx (Runde 2)
- src/components/visual/icons/transponder-kopie.tsx
- src/components/visual/icons/vor-ort.tsx
- src/components/visual/icons/karte.tsx
- src/components/visual/icons/video.tsx
- src/components/visual/glyphen/pause.tsx
- src/components/visual/glyphen/bewegung.tsx

Geändert (1): src/components/visual/icons/icons.test.tsx, 14 Zeilen: sieben Importe und sieben Einträge in `ICONS`.

## WAS UND WARUM
- Fach-Icons: Zweitonfläche zuerst (`fill-area-muted`, `stroke="none"`), danach die Kontur. Koordinaten ganz oder halbe Schritte, Rand mindestens 4 Einheiten, nur `IconBase`, Klassen und `currentColor`.
- Glyphen: einfarbig, Standardgröße 20, nur die Befehle M, L, H, V, keine Animation.
- `glyphen.test.tsx` blieb unverändert, weil Glyphen über den Ordner gefunden werden. `icons.test.tsx` verlangt jede Datei in `ICONS`.
- Nicht angefasst: `globals.css`, `tailwind.config.ts`, `area-theme.ts` und die abgenommenen Motive.

## RUNDE 2
- Motorradschlüssel: Kopf als Rad (Radkreis r 9 mit Zweiton, Nabe r 2), drei Speichen mit 119 bis 121 Grad Abstand. Rechts der Bart mit zwei Einschnitten an der Unterkante und abgeschrägter Spitze.
- Funkschlüsselgehäuse: Explosionsansicht, zwei Schalen 26 × 9 mit Radius 4 und 5 Einheiten Abstand. Unterschale mit Zweiton, Oberschale mit zwei Tasten (r 1,5) versetzt im linken Teil. Zwei Führungslinien mit `stroke-dasharray="2 2"`, Klappbart 10 lang mit einem Einschnitt.
- Schlüsselfinder: Pkw in Seitenansicht als ein Pfad, Fenster als Zweiton, zwei Räder (r 4) auf gemeinsamer Grundlinie. Lupe (r 5 mit Griff) mit Schlüsselkopf (r 1,5) und kurzem Bart.

## GEMEINSAME DATEIEN (nicht von mir geändert)
1. Bildablage: Schritt 11 nennt `_werkstatt/ausbau/bilder/arbeit/E3-GRAFIKER-01.png`. Das liegt außerhalb meiner Schreibrechte, das Bild liegt im Scratchpad. Bitte übernehmen oder das Recht ergänzen.
2. Kachel-Zuordnung (G-03): Die sieben Schlüssel stehen in `src/payload-types.ts`, aber keine Tabelle ordnet sie Komponenten zu. Vorschlag für `FACH_ICONS` in `src/components/ui/bild-flaeche.tsx`, nur bei erweitertem `FachIconName`: `motorradschluessel: IconMotorradschluessel`, `schluesselgehaeuse: IconSchluesselgehaeuse`, `'transponder-kopie': IconTransponderKopie`, `schluesselfinder: IconSchluesselfinder`, `'vor-ort': IconVorOrt`, `karte: IconKarte`, `video: IconVideo`. `BEREICH_ICONS` (`src/components/visual/bereich-icon.tsx`) ist `Record<AreaKey>` und braucht zuerst eine Entscheidung zu `AreaKey`.

## PRÜFUNG UND ERGEBNIS
- Runde 2: Vitest `src/components/visual/icons`: 2 Dateien, 371 Tests, grün. Gesamtlauf `src/components/visual`: 30 Dateien, 887 Tests, grün. Gegenüber Runde 1 (29 und 878) kamen Dateien außerhalb dieses Auftrags hinzu, etwa das untracked `motion/dauerschleife.test.tsx`.
- ESLint auf die drei Dateien: keine Befunde. `tsc --noEmit`: 0 Fehler.
- Markup: Randabstand Motorradschlüssel 5, Funkschlüsselgehäuse 6, Schlüsselfinder 5. Halbe Schritte, keine verbotenen Muster, je ein Export, Zweiton jeweils zuerst.
- Runde 1: Randabstand der übrigen Motive 5 bis 12.

## BELEGE
- Vorschau Runde 2, 48 und 24 px: /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3/E3-GRAFIKER-01-runde2.png
- 24 px pixelgenau: /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3/zoom2/zoom24-runde2.png
- 48 px pixelgenau: /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3/zoom48/zoom48-runde2.png
- Strichelungstest bei 48 px: /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3/dash/dash-zoom.png
- Markup und Logs: /tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3/svg-ausgabe-runde2.txt sowie die Dateien vitest-runde2-icons.txt, eslint-runde2.txt und tsc-runde2.txt im selben Ordner

## ERKENNBARKEIT BEI 24 PX (Sichtprüfung, kein Test)
Runde 2:
- Motorradschlüssel: Rad mit Bart erkennbar. Die Speichen sind nur angedeutet, die Einschnitte gehen verloren. Lesart als Lenkrad ist möglich.
- Funkschlüsselgehäuse: Zwei Schalen mit Klinge erkennbar. Tasten und Führungslinien sind nur Flecken. Eher als kleines Gerät denn als Schlüssel lesbar.
- Schlüsselfinder: eindeutig als Auto mit Lupe. Der Schlüssel in der Lupe bleibt ein Punkt.

Runde 1, unverändert: Transponder kopieren, Karte, Video, Pause und Bewegung erkennbar, Vor Ort knapp.

## OFFENE FRAGEN
1. Strichelung: Mit `"2 2"` und runden Enden (K-008) wirken die Führungslinien bei 48 px durchgezogen (Strichelungstest). Mit `"1 3"` oder `"2 4"` sind Lücken angedeutet, aber knapp. Umgesetzt wie beauftragt: `"2 2"`. Soll ich wechseln?
2. Lenkrad-Lesart: Drei Speichen sind beauftragt. Bei häufiger Lesart als Lenkrad wäre die Nabe zu prüfen. Nicht geändert.
3. Bildablage und Kachel-Zuordnung: siehe GEMEINSAME DATEIEN 1 und 2.
4. `_werkstatt/ausbau/protokolle/datenweiche.log` steht als geändert im Arbeitsbaum, weil `sicher.sh` dort protokolliert. Nicht von mir bearbeitet.
