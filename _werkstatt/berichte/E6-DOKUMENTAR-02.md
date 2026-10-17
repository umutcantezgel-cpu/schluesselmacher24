# E6-DOKUMENTAR-02 · Bericht

Plankennung E6-D-02 · Stand 17.10.2026 · Zweig `claude/projekt-gestaltung-entwicklung-tofodh` · nicht committet

## GEÄNDERTE DATEIEN

Alle Pfade neu angelegt. Keine bestehende Datei geändert, gelöscht oder überschrieben.

- `_werkstatt/bilder/abschluss/` · 224 JPG (oberste Ebene der Quelle)
- `_werkstatt/bilder/abschluss/einzelbilder/` · 50 JPG in 8 Unterordnern
- `_werkstatt/bilder/abschluss/gefuellt/` · 27 JPG
- `_werkstatt/bilder/abschluss/uebrige/` · 33 JPG (je Ansicht und Gerät Bildschirmhöhe 00)
- `_werkstatt/bilder/blind/` · 12 Unterordner V01 bis V12 mit 140 JPG
- `_werkstatt/bilder/blind/LIESMICH.md` · 1 Datei
- `_werkstatt/bilder/galerie.html` · 1 Datei (160 820 Byte)
- `_werkstatt/berichte/E6-DOKUMENTAR-02.md` · 1 Datei (dieser Bericht)

Außerhalb des Repositorys (Schlüsselablage): Schlüsseltabelle und sechs Hilfsskripte.

Nicht berührt: `_werkstatt/protokolle/` und alle übrigen Dateien des Repositorys.

## WAS UND WARUM

1. Abschluss-Bildsatz: Kopie (`cp -n`, nichts verschoben) der Quelle für oberste Ebene, `einzelbilder/` und `gefuellt/`. Aus `uebrige/` nur die Bilder mit Bildschirmhöhe 00. Nicht übernommen, weil im Paket nicht genannt: 17 Nicht-JPG auf oberster Ebene (JSON), die Unterordner `schritte/` und `schritte-nachtrag/` sowie 131 weitere Bilder aus `uebrige/`.
2. Blindvergleich: 12 Ordner V01 bis V12 mit je zwei Seiten A und B. Jede Seite besteht aus Desktop- und Mobilbildern mit den Nummern 1 bis 3 (Bildschirmhöhe 00 bis 02). Die Seitenzuordnung je Ansicht ergab der Zufall über `secrets.choice`, einmal je Ansicht; die gezogene Seite erhält den Nachher-Stand. Die Zuordnung steht nur im Schlüssel außerhalb des Repositorys. Eine Nummer, die auf beiden Seiten fehlt, wird auf keiner Seite genommen; einseitige Lücken gab es nicht. Die Bilder sind unverändert kopiert, die Namen sind neutral. LIESMICH fragt je Ansicht nach der bevorzugten Seite und dem Grund in einem Satz.
3. Galerie: eigenständige Seite ohne externe Ressourcen, mit Systemschrift und ohne JavaScript. Je Hauptansicht stehen Desktop und Mobil Bildschirmhöhe 00 als Vorher-Nachher-Paar nebeneinander (ab 900 px). Darunter aufklappbar alle weiteren Bildschirmhöhen beider Stände, einschließlich Tablet. Dazu die Abschnitte „Große Momente“, „Gefüllter Warenkorb und Kasse“ (nur nachher) und „Weitere Ansichten (Stichprobe)“ (nur nachher). Der Blindvergleich ist nicht verlinkt.
4. Die Namen der zwölf Hauptansichten sind aus Routen und Zweck in `_werkstatt/LAGEBILD.md` abgeleitet. Große Momente zeigen die Momentkennung aus dem Dateinamen als Unterschrift.

## BELEGE

Zählung Quelle gegen Ziel:
- oberste Ebene: 224 / 224
- einzelbilder: 50 / 50 (H01, H02, H05, H08, H09 und U-STANDORTE je 5; H12 und U-SERVICE je 10)
- gefuellt: 27 / 27
- uebrige (Nummer 00): 33 / 33
- Inhalt: sha256 aller 334 Kopien gegen die Quelle: 334 gleich, 0 verschieden, 0 fehlend.
- Quelle Vorher (`_werkstatt/bilder/e0/`): 251 Dateien, alle nach dem Muster `Hxx-name__gerät__nn.jpg`.

Blindvergleich:
- Ordner: 12. Je Ordner gleich viele A- und B-Bilder: 10 Ordner mit je 12 Dateien, 2 Ordner mit je 10 Dateien. Summe 140.
- Bildmaße: Desktop 68 Dateien mit 1440×900, Mobil 72 Dateien mit 390×844, einheitlich.
- Schlüssel: 12 Tabellenzeilen. Dateizuordnung: 140 von 140 Dateien byteidentisch mit der angegebenen Quelle (sha256).
- `grep -rniE "e0|abschluss|vorher|nachher" _werkstatt/bilder/blind`: Treffer in 69 Dateien. Alle 69 sind Binärtreffer der Zeichenfolge „e0“ im JPEG-Datenstrom. `grep -rlaiE "abschluss|vorher|nachher"` ergibt 0. Textdateien (`grep -rIliE`): 0 Treffer. Dateinamen und Ordner (`find _werkstatt/bilder/blind | grep -iE …`): 0 Treffer.
- `strings <datei> | grep -iE "e0|abschluss|e6-c"` über alle 140 Dateien: 0 Wort- oder Pfadtreffer (abschluss, e6-c, vorher, nachher). Die Zeichenfolge „e0“ steckt als Teil zufälliger Byte-Ketten in 27 Dateien.
- EXIF: in keiner Blind-Datei und in keiner Quelldatei vorhanden (alle JFIF). Nichts zu entfernen.
- LIESMICH: 0 Treffer für e0, abschluss, vorher, nachher, Schlüssel, Quelle, Reihenfolge, Zufall.
- Schlüsselverweis: `grep -rn` über alle `*.md` und `*.html` des Repositorys auf den Namen des Schlüsselordners: 5 Treffer, alle außerhalb meiner Dateien (siehe OFFENE FRAGEN 1). In meinen Dateien: 0 Treffer.

Galerie (Prüfung mit Skript außerhalb des Repositorys):
- `<html lang="de">`, Viewport-Meta und Titel „Vorher und nachher · SCHLÜSSELMACHER24“ vorhanden.
- 585 Bilder. Alle `src` existieren relativ zu `_werkstatt/bilder/`. Breite und Höhe entsprechen den Dateimaßen (0 Abweichungen). Alle Bilder haben `loading="lazy"` und ein `alt`.
- 0 externe Ressourcen, 0 `<script>`, 0 absolute Pfade, 0 Erwähnungen des Blindvergleichs.
- Zahl Galerie · Zahl Ordner je Abschnitt (je Ansicht: e0 plus oberste Ebene von abschluss):
  - H01 44 · 44; H02 54 · 54; H03 39 · 39; H04 24 · 24; H05 73 · 73; H06 34 · 34; H07 29 · 29; H08 67 · 67; H09 58 · 58; H10 15 · 15; H11 15 · 15; H12 23 · 23
  - Große Momente 50 · 50; Gefüllter Warenkorb und Kasse 27 · 27; Weitere Ansichten (Stichprobe) 33 · 33
  - Summe 585 = 251 + 224 + 50 + 27 + 33

## OFFENE FRAGEN

1. Schlüsselort im Repository: `_werkstatt/pakete/E6-DOKUMENTAR-02.md` (Zeilen 1, 25, 34, 44) und `_werkstatt/PRUEFPUNKT.md` (Zeile 6) nennen den Schlüsselordner. Das widerspricht der Vorgabe, dass keine Repository-Datei auf den Schlüssel verweist, und lässt den Prüfbefehl scheitern. Beide Dateien habe ich nicht geändert, sie liegen außerhalb meines Schreibrechts. Bitte den Orchestrator bereinigen lassen.
2. Commit `99adb3d` („wip(werkstatt): ZWISCHENSTAND Prüfstufe C Nachlauf und Abschluss-Bildsatz (laufend) [E6-P-C]“, 17.10.2026 22:31:20 UTC) enthält bereits alle 334 Dateien von `_werkstatt/bilder/abschluss/`. Die Inhalte sind identisch mit der Quelle. Den Commit habe ich nicht angelegt. Blind-Ordner, LIESMICH und `galerie.html` sind nicht versioniert und nicht in diesem Commit. Vor dem nächsten Commit nur gewollte Pfade stagen.
3. Hinweise im Blindvergleich, die ich nicht entfernen konnte:
   - Die Zeichenfolge „e0“ als zufällige Bytefolge im JPEG-Datenstrom (siehe Belege). Sie ist nicht sichtbar. Entfernen hieße, die Bilder neu zu kodieren.
   - Dateigrößen unterscheiden sich von Datei zu Datei. Mittelwerte je Gerät: Desktop 67,3 KB (Vorher) und 66,4 KB (Nachher), Mobil 27,1 KB und 28,6 KB, Tablet 49,3 KB und 49,6 KB.
   - Zwei Ordner haben je 10 statt 12 Dateien, weil zwei Desktop-Nummern (02) auf beiden Seiten fehlen.
   - Keine Höhenunterschiede (Maße gleich), keine EXIF-Daten.
4. Abweichungen vom Paket:
   - Einzelbilder H12 und U-SERVICE haben je 10 Bilder: zwei Momente zu je 5 (`main-header-role-img` und `main-header-svg-role-img`). Das Paket verlangt 5 je Kürzel. Umgesetzt als zwei Reihen zu je 5; die Galerie zählt 10 wie der Ordner. Bitte entscheiden, ob nur ein Moment gewünscht ist.
   - Die Quelle enthält weitere Ordner und Dateien (`schritte/`, `schritte-nachtrag/`, 17 JSON), die im Paket nicht genannt sind. Sie sind nicht übernommen. `schritte-nachtrag/` hat den jüngsten Zeitstempel (22:28). Falls dort noch geschrieben wird, ist die Übernahme nicht mehr aktuell.
5. Der Prüfbefehl für den Blindordner ist wörtlich ausgeführt. Sein Ergebnis (Binärtreffer, siehe Belege) ist gemeldet und nicht umgedeutet.

=== ENDE E6-DOKUMENTAR-02 · BEREIT ZUR RÜCKGABE ===
