# E5-GRAFIKER-01 · Messhilfe Maß A und B mit Beschlag und Überstand

## GEÄNDERTE DATEIEN
- `src/components/visual/generators/zylinder-mass.tsx`
- `src/components/visual/generators/zylinder-mass.test.tsx` (acht neue Tests, dazu ein Import und eine Hilfsfunktion)
- `_werkstatt/ausbau/protokolle/E5-GRAFIKER-01/zylinder-mass-schutzbeschlag-breit.png` (480 × 270 Einheiten, doppelte Auflösung)
- `_werkstatt/ausbau/protokolle/E5-GRAFIKER-01/zylinder-mass-schutzbeschlag-schmal.png` (250 px breit)
- `_werkstatt/ausbau/berichte/E5-GRAFIKER-01.md`

## WAS UND WARUM
- `beschlag: 'an'` zeichnet das Türblatt hinter dem Zylinder und die Platte des Schutzbeschlags außen davor. Standard `aus`.
- `ueberstand` (Standard `an`, nur mit Beschlag) zeichnet die bemaßte Strecke vom Zylinderende bis zur Platte, beschriftet „Überstand“, ohne Zahl. Platte, Tür und Strecke sind schematisch, weil das Fachwissen keinen zulässigen Überstand nennt.
- Maß A und B bleiben unverändert, von der Mitte der Stulpschraube bis zum Zylinderende. Ein Test prüft die Endpunkte.
- Mit Außenknauf entfällt der Beschlag, weil der Knauf außen liegt. Mit Strecke verschiebt sich das Profil leicht, damit Platz für die Beschriftungen bleibt.
- Farben über Tokenklassen. Suche nach `#`, `rgb(` und `oklch(` im Generator: 0 Treffer. Bewegung nur über `sm24-reveal`, ohne neue Keyframes.

## GEMEINSAME DATEIEN (gewünscht, nicht geschrieben)
1. `src/components/visual/README.md`, Tabelle `zylinder-mass`, zwei Zeilen nach `format`:
   `beschlag` · `aus` (Standard) · `an` · Schutzbeschlag außen mit Türblatt, schematisch; bei `knaufseite: 'aussen'` ohne Wirkung
   `ueberstand` · `an` (Standard) · `aus` · Strecke „Überstand“ ohne Zahl; nur mit `beschlag: 'an'`
2. `src/components/visual/interaktiv/zylinder-mass-live.tsx`: Die Bildunterschrift enthält einen Gedankenstrich. Durch einen Punkt ersetzen.
3. Die README nennt neun Generatoren, `registry.tsx` führt zehn.

## PRÜFUNG UND ERGEBNIS
- Standardbild: 23 Parameterfälle, darunter Unsinnswerte, zeichengleich zur Vorlage. Länge 3979, FNV-1a 707467243 als Test festgehalten.
- Visual-Suite: 32 Dateien, 920 Tests grün. Zylinder-Test 19 statt 11. Der Rest der Differenz zu 904 stammt aus `schluessel.test.tsx` (18 auf 26), also aus paralleler Arbeit.
- ESLint für beide Dateien ohne Befund. `tsc --noEmit -p .` ohne Fehler.
- Schmal bei 250 px: kleinste Beschriftung 15 Einheiten, also 12,5 px.

## BELEGE
- Vergleich, Logs und Skripte: `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e5-grafiker-01/`
- Bilder: Chrome über Playwright, Tokenwerte aus `src/app/(site)/globals.css`.
- Die Bilder sind per `_werkstatt/ausbau/.gitignore` (`/protokolle/**/*.png`) nicht versioniert.

## OFFENE FRAGEN
1. Gibt es eine Fachquelle für einen zulässigen Überstand? Bis dahin zeigt die Zeichnung keine Zahl.
2. Kommt Außenknauf mit Schutzbeschlag vor? Dann braucht die Kombination eine eigene Darstellung.
3. Sollen Türblatt und Platte beschriftet werden („Tür“, „Schutzbeschlag“)? Im Schmalformat ist der Platz knapp.
