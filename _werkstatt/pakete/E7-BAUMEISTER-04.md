E7-BAUMEISTER-04 · Rolle Baumeister · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.16 · Schreibrechte (exakt): `src/components/visual/generators/ablauf.tsx`, `src/components/visual/generators/ablauf.test.tsx` · Umfang: Ablaufzeichnung: tiefe Führungslinien kreuzen keine Beschriftung der ersten Reihe (Kriterium Z-09)

## Rollenbriefing
Du bist Baumeister. Du änderst nur die Dateien deiner Schreibrechte, genau wie beschrieben, und belegst jede Änderung mit einer Prüfung. Häufige Fehler: Testerwartungen lockern statt den Code richtig zu machen (verboten; Teständerungen nur mit Alt-Neu-Liste, die Zahl der Assertions sinkt nie), fremde Dateien anfassen, Texte umformulieren, Werte außerhalb des Designsystems einführen (freie Pixelwerte, Hex-Farben), Bewegung verlängern statt verkürzen.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, Zutrittslösungen und Sicherheitstechnik. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Die Leitidee (KERN K-001): saubere Werkstattzeichnung – helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift; Bewegung erklärt Mechanik (Register K-007 in `_werkstatt/KERN.md`). Etappe E7 „Absichern“ macht die Seite auf schwachen Telefonen flüssiger und schneller, ohne das Bild zu ändern: Messungen zeigten ruckelnde Zeichnungen (Bildrate über 5 % bei vierfach gedrosseltem Prozessor) und Vorladen im Ladefenster. Logik, Daten, Texte und Rechtstexte bleiben unverändert; geändert wird nur Darstellung und Ladeverhalten.

## Vorladen nach D-044 (gilt für alle Links in diesem Paket)
`next/link` lädt das Ziel vor, sobald der Link sichtbar ist. Im Ladefenster kostet das auf gedrosselten Telefonen Bilder des großen Moments. Muster (wie im Kopf und den Brotkrumen): Link bzw. `ButtonLink` mit `prefetch={false}`, und das Ziel über `<SpaetVorladen ziele={['/ziel']} />` aus `@/lib/spaet-vorladen` erst nach 2,5 s im Leerlauf vorladen (die Komponente rendert nichts und darf in Serverseiten stehen, eine je Seite genügt, mit allen Zielen). `ButtonLink` hat die Prop `prefetch` (`src/components/ui/button.tsx`). Für lange Listen gibt es `useAbsichtVorladen()` aus `@/lib/absicht-vorladen` (Client): liefert `vorladen(href)`, aufzurufen in `onPointerEnter`, `onFocus` und `onTouchStart` des Links.

## Aufgabe in einem Satz
In der Ablaufzeichnung mit versetzter Beschriftung laufen die gestrichelten Führungslinien zur zweiten Beschriftungsreihe durch die Beschriftungen der ersten Reihe (sichtbar auf `/service-und-termin` am Desktop: Linie bei „Bedarfsanalyse“ und „Dokumentation“). Die Linie soll dort, wo eine Nachbarbeschriftung liegt, unterbrochen werden.

## Umsetzen
1. **Führungslinie unterbrechen** (`ablauf.tsx`, Block `xs.map(...)` etwa Zeile 179–197, Pfad `d={`M${x} ${LY + 4}V${LY + 39}`}` für `tief`): Berechne für jede tiefe Station, ob die Beschriftungen ihrer Nachbarn (Stationen i − 1 und i + 1, erste Reihe, Grundlinie `LY + 28`) ihre x-Position erreichen: halbe geschätzte Breite der Nachbarbeschriftung + 2 > Abstand der Stationen. Für die geschätzte Breite nutze die Schätzung, die der Generator schon verwendet (Suche im Code nach der Breitenschätzung der Beschriftung, etwa 0,6 em je Zeichen bei Mono, oder `textBreite`/`breiteSchaetzen`; gibt es keine, lege eine reine Funktion `beschriftungsBreite(text, schrift)` mit 0,6 × Schriftgröße je Zeichen an und teste sie). Erreicht eine Nachbarbeschriftung die Linie, zeichne die tiefe Führungslinie als zwei Stücke: von `LY + 4` bis oberhalb der Beschriftungszeile der ersten Reihe (Oberkante = Grundlinie − Schriftgröße − 2) und von unterhalb (Grundlinie + 4) bis `LY + 39`. Sonst bleibt sie eine Linie. Klasse, Strichart, Strichstärke und Bewegung (`sm24-fade`, gleiche `motionStyle`) bleiben gleich; beide Stücke bekommen dieselbe Bewegung. Kein Halo (die Fläche dahinter ist getönt).
2. **Test** (+1, besser +2): Für die Parameter der Seite `/service-und-termin` (fünf Schritte, versetzte Beschriftung – die Schritte stehen in `src/app/(site)/service-und-termin/page.tsx` als `PHASEN_SCHRITTE`; nimm im Test dieselben Texte) schneidet kein Linienstück den geschätzten Kasten einer Beschriftung der ersten Reihe; und eine Ablaufzeichnung mit kurzen Beschriftungen behält eine durchgehende Linie. Vorhandene Assertions bleiben.

## Ansichten für die Bilder
`/service-und-termin`, `/ratgeber/autoschluessel-verloren-was-tun`, `/schluessel-nach-vorlage`

## Grenzen
- Nur die Dateien deiner Schreibrechte. Gemeinsame Dateien (globals.css, tailwind.config.ts, registry, image-placeholder, page-header, section, site-header) nicht ändern; braucht es dort etwas, schreibe es unter OFFENE FRAGEN.
- Keine Texte, Daten oder Logik ändern. Keine neuen Abhängigkeiten. Nie Dateien löschen; Hilfsdateien und Bilder nur unter `/root/sm24-bilder/E7-BAUMEISTER-04/`. Dateien unter /dev nie anfassen.
- Du committest und pushst nie.

## Schnellprüfung
- `npx tsc --noEmit` (0 Fehler; Fehler in fremden Dateien getrennt melden), `npx eslint <deine Dateien>` (0), `npx vitest run <deine Testdateien>` (grün, Alt-Neu-Liste im Bericht mit Zahl der Assertions vorher und nachher).
- `node _werkstatt/werkzeuge/logikwaechter.mjs pruefen` → 0 abweichend; `node _werkstatt/werkzeuge/werte-suche.mjs --json /root/sm24-bilder/E7-BAUMEISTER-04/werte.json` → keine neuen Funde in deinen Dateien.
- Bilder der betroffenen Ansichten über den Entwicklungsserver: `SM24_BASIS_URL=http://localhost:3001 node _werkstatt/werkzeuge/bild.mjs <pfad> --geraet mobil --ziel /root/sm24-bilder/E7-BAUMEISTER-04` und dasselbe mit `--geraet desktop` (erster Aufruf einer Seite dauert 10–60 s). Sieh jedes Bild an: Das Bild der Seite ist unverändert bis auf die beschriebenen Punkte, nichts abgeschnitten, keine Überlappung.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM (je Punkt unter „Umsetzen“: erledigt mit Datei:Zeile oder begründet nicht) · ALT-NEU-LISTE DER TESTS · PRÜFUNG UND ERGEBNIS (Befehl und Zahl) · BILDER (Pfade) · OFFENE FRAGEN

Letzte Zeile: === ENDE E7-BAUMEISTER-04 · BEREIT ZUR RÜCKGABE ===
