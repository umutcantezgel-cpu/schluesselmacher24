# E3-DATENPFLEGER-02 · Kartendaten Hessen

Anforderung G-42, Kriterium Z-10 · Stand 2026-11-03

## GEÄNDERTE DATEIEN
- `scripts/karte-aufbereiten.mjs` (neu)
- `content/karte/hessen-kreise.json` (neu, 71.410 Byte), `content/karte/hessen-gemeinden.json` (neu, 435.318 Byte), `content/karte/LIZENZ.md` (neu)
- `_werkstatt/ausbau/daten/geo/vg250/entpackt/` (Rohdaten, durch `/daten/` ignoriert)
- `_werkstatt/ausbau/protokolle/datenweiche.log` (automatisch durch die Datenweiche)
- dieser Bericht

## WAS UND WARUM
Das Skript liest `vg250_krs` und `vg250_gem` (Landesschlüssel 06), rechnet UTM 32 linear in 1000 Bildeinheiten um (viewBox `0 0 1000 1444.2`, eine Einheit rund 174 m) und rundet auf 0,1 Einheiten. Douglas-Peucker mit Toleranz 1,0 bei Kreisen und 0,6 bei Gemeinden. Gemeinsame Grenzen werden je Bogen einmal vereinfacht, sodass zwischen Nachbarn keine Lücke entsteht. `mitte` ist der Schwerpunkt, liegt er außerhalb, die breiteste innere Strecke.

Zehn Ringe entfallen, weil die vereinfachte Form unter 2 Einheiten Fläche hat: Kreise Bergstraße und Werra-Meißner (Binnenloch), Gemeinden Heppenheim, Bad Soden-Salmünster, Gutsbezirk Spessart, Münchhausen, Wetter (Hessen), Gutsbezirk Kaufunger Wald, Steinau an der Straße und Großalmerode. Die Schwelle auf die Quellfläche zu beziehen, ließ die Außenlinie an einer Stelle offen.

## GEMEINSAME DATEIEN
Keine Änderung nötig.

## PRÜFUNG UND ERGEBNIS
- Quelle: Prüfsumme und Größe stimmen. 27 Kreise, 425 Gemeindeflächen (421 plus 4 gemeindefrei), Lahn-Dill-Kreis 23 Kommunen, Wetzlar 06532023. Das Skript bricht bei Abweichung vor dem Schreiben ab.
- Selbsttest: 1.821 Prüfungen bestanden.
- Größen: Kreise 71.410 Byte (Grenze 120.000), Gemeinden 435.318 Byte (Grenze 450.000).
- Punkte: 26.261 zu 4.974 (Kreise), 84.325 zu 28.404 (Gemeinden). Bögen: 91 (63 gemeinsam), 1.332 (1.181 gemeinsam).
- Namen: alle 452 Einträge gegen die Quelle, 0 Abweichungen.
- Fläche: Verhältnis 1,0000 (Kreise), 0,9999 (Gemeinden), Einzelwerte 0,983 bis 1,014.
- Lücken topologisch: keine Kante gehört zu mehr als zwei Ringen, Außenlinien geschlossen.
- Lücken bei 200 Prozent (80 × 80 Einheiten, nur Pixel innerhalb Hessens): Wetzlar 0. Hanau 0, die schwarze Fläche liegt in Bayern (Kahl am Main). Kassel: 118 Pixel ohne Gemeindefläche in der Quelle (rund 0,5 Einheiten², 1,6 ha), nicht ergänzt (R4). Am Landesrand 177 Pixel durch unterschiedliche Toleranzen.
- Chromium lief über die Datenweiche mit `--als-root`, weil das Scratchpad nur für root beschreibbar ist.

## BELEGE
- Vorschau: `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3-karte/hessen-vorschau.png`
- Ausschnitte: `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/e3-karte/grenze-1-wetzlar.png`, `grenze-2-hanau.png`, `grenze-3-kassel.png` (gleicher Ordner)
- Quelle: `_werkstatt/ausbau/daten/geo/vg250/entpackt/dokumentation/` (Quellenvermerk, Nutzungsbedingungen, Stand 01.01.2026)

## OFFENE FRAGEN
1. Veränderungshinweis: Der Wortlaut steht nur auf der BKG-Seite. Nicht abgerufen, weil keine Downloads erlaubt sind. Vorläufig gilt der Paketwortlaut. Vor Livegang prüfen (R10).
2. Die Zeile „Statistische Schlüssel“ (Destatis) stammt aus der Datenurheber-Aufstellung der Lieferung und stand nicht im Paket. Bitte bestätigen.
3. Der Maßstab verlangt den Rohdatenpfad im Skript, der Selbsttest verlangt keinen außer in LIZENZ.md. Entscheidung nötig.
4. Quellenlücke Kassel-Nordost an die Erhebung melden.
5. Insel-Loch-Paare: Bei Bad Soden-Salmünster/Spessart und Münchhausen/Wetter entfallen Insel und Loch, die Fläche gehört dann dem Umland. Bei Witzenhausen bleibt die Insel, das Loch Kaufunger Wald entfällt. Regel festlegen.
6. Kreis- und Gemeindegrenzen sind getrennt vereinfacht und liegen am Landesrand bis 1,6 Einheiten (0,28 km) auseinander. Die Komponente muss das berücksichtigen.
7. Pfade mit fill-rule evenodd zeichnen. Die Gemeinden-Datei liegt bei 97 Prozent der Größengrenze.
