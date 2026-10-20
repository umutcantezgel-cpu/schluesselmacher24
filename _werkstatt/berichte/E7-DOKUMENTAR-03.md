# E7-DOKUMENTAR-03 · Bericht (vom Orchestrator aus der Rückgabe übernommen)

Der Dokumentar durfte selbst keine Berichtsdatei schreiben; der Text unten ist seine Rückgabe, unverändert. Die A/B-Zuordnung steht nur im Schlüssel außerhalb des Repositorys.

E7-DOKUMENTAR-03 · Bericht (Abschlussversuch 2, Prüfstufe C)

GEÄNDERTE DATEIEN
- _werkstatt/bilder/abschluss/: 324 Dateien (oberste Ebene 224 jpg; einzelbilder/ 40 in 8 Ordnern; gefuellt/ 27; uebrige/ 33 = nur __00 je Ansicht und Gerät)
- _werkstatt/bilder/blind/: 12 Ordner V01 bis V12 mit 140 Bildern (V01 bis V09 und V12 je 12, V10 und V11 je 10) plus LIESMICH.md (1 Datei)
- _werkstatt/bilder/galerie.html: 1 Datei, 136356 Byte
- Schlüsselordner (außerhalb des Repositorys): SCHLUESSEL.md (12 Zeilen) und pruefe_galerie.py (Prüfskript)
- Nicht geschrieben: _werkstatt/berichte/E7-DOKUMENTAR-03.md. Die Systemregel verbietet Berichtsdateien in .md; dieser Text ist die Rückgabe.

WAS UND WARUM
1. Vorbedingung 0: abschluss/, blind/ und galerie.html bestanden vorher nicht; Abbruch nicht nötig.
2. Bildsatz: cp (nichts verschoben, nichts überschrieben, cp -n). Zählung Quelle gegen Ziel: 224/224, 40/40 (8 Ordner à 5), 27/27, 33/33 (Quelle: __00-Dateien). Gleiche Namen, cmp-Stichprobe identisch. Quelle und Ziel sind in Git als gleich erkannt (siehe Auffälliges).
3. Blindvergleich: je Ansicht ein Zufallsentscheid per secrets.choice, nicht im Bericht. Paare nur, wenn die Nummer auf beiden Seiten existiert (Desktop 00 bis 02, Mobil 00 bis 02). Dateinamen A-desktop-1 bis 3 und A-mobil-1 bis 3 (B ebenso), Nummer = Bildschirmhöhe plus 1. Ordner ohne Metadaten-Hinweise. Vorher- und Nachher-Bilder haben in allen Paaren gleiche Pixelmaße (Desktop 1440x900, Mobil 390x844), keine EXIF-, XMP- oder COM-Segmente. Der Schlüssel liegt nur im Schlüsselordner.
4. Galerie: eigenständige HTML-Seite, lang de, Viewport-Meta, Titel "Vorher und nachher · SCHLÜSSELMACHER24", ohne Skript, ohne externe Ressourcen, Systemschrift, relative Pfade (e0/, abschluss/), loading="lazy", width/height aus den Dateien. Je Hauptansicht Desktop 00 und Mobil 00 nebeneinander (ab 900 px), darunter details mit allen weiteren Bildern beider Stände (inkl. Tablet). Abschnitte Große Momente, Gefüllter Warenkorb und Kasse und Weitere Ansichten (Stichprobe). Stand 18.10.2026, Zweig claude/projekt-gestaltung-entwicklung-tofodh. Kein Link auf den Blindvergleich.
5. Keine Commits, keine Pushes, keine Löschungen, keine Dateien außerhalb der Schreibrechte. Die Dateien unter /dev und Port 3001 nicht benutzt.

BELEGE
- Vorbedingung: ls-Test, drei Pfade absent.
- Zählung Ziel = Quelle: abschluss oberste Ebene 224 = 224; einzelbilder 40 = 40 (8 Ordner); gefuellt 27 = 27; uebrige 33 = 33; diff der Namenslisten 0.
- Verhältnis e0 zu abschluss: e0 251 Dateien, abschluss 224 Dateien. Gepaarte Dateien 216, nur e0 35, nur abschluss 8.
- Blindordner: 12 Ordner; A/B je Ordner gleich (V01 bis V09, V12: 6/6; V10, V11: 5/5). Namensprüfung auf e0, abschluss, vorher, nachher, alt, neu: 0 Treffer.
- Textdateien in blind ohne JPG (grep -rniE "e0|abschluss|vorher|nachher"): 0 Treffer.
- Binär-Treffer: grep über die JPG-Dateien trifft zufällige Byte-Folgen (z. B. E0, ROOT), 6 Stellen in strings -n6, nur Bildcode, kein Text. Befund gemeldet, nichts gelöscht.
- Schlüssel: SCHLUESSEL.md 12 Zeilen; Name des Schlüsselordners kommt in _werkstatt/bilder/ 0-mal vor (grep -rn). In _werkstatt/berichte/ gibt es keine Datei dieses Laufs.
- Galerie (pruefe_galerie.py): 575 img-Elemente; fehlende src 0; absolute oder externe src 0; ohne alt 0; ohne lazy 0; ohne width/height 0; externe Ressourcen 0; script 0; Verweis auf blind 0; Schlüsselordner-Name 0; lang, title, viewport vorhanden.
- Zählung Galerie: Ansichten 475 (Ist) gleich 251 e0 plus 224 abschluss (Soll); Vorher-Etiketten 251; Nachher-Etiketten 324 (= 224 + 40 + 27 + 33); Große Momente 40 = Soll 40; Warenkorb und Kasse 27 = 27; Stichprobe 33 = 33. Ansichten je H-Nummer stimmen mit Soll überein (H01 44, H02 54, H03 39, H04 24, H05 73, H06 34, H07 29, H08 67, H09 58, H10 15, H11 15, H12 23).
- Zeile am Ende: === ENDE E7-DOKUMENTAR-03 · BEREIT ZUR RÜCKGABE ===

OFFENE FRAGEN
- Zu den Hinweisen im Blindvergleich: V10 und V11 haben je 5 Bilder pro Seite statt 6, weil für H10 und H11 die Desktop-Nummer 02 auf beiden Seiten fehlt. Der Ordnerinhalt verrät damit die Ansicht; die Regel "fehlt auf einer Seite, dann auf keiner" lässt keine andere Lösung zu.
- Die Blindordner-Reihenfolge V01 bis V12 folgt H01 bis H12 wie im Auftrag. Das ist eine Ordnung, die aus dem Namen folgt; der Prüfer sieht die Ansicht am Inhalt.
- Die Stand-Angabe 18.10.2026 folgt dem Auftrag; heute ist 20.10.2026.
- Gesamtrepo-Suche nach dem Schlüsselordnernamen wurde wegen Laufzeit abgebrochen. Geprüft sind _werkstatt/bilder/ und die neu geschriebenen Dateien (kein Treffer). Die Suche im übrigen Repository wurde nicht abgeschlossen.

## Auffälligkeiten
- Blindvergleich: V10 und V11 haben je 5 Bilder pro Seite, alle anderen 6. Grund: H10 und H11 haben auf beiden Seiten keine Desktop-Nummer 02. Der Ordnerinhalt verrät so zwei Ansichten; nicht entfernbar, ohne die Regel zu verletzen.
- Blindvergleich: Die Ordnerreihenfolge V01 bis V12 folgt H01 bis H12 wie im Auftrag. Die Ansicht ist am Inhalt erkennbar; das ist erlaubt.
- Ungepaarte Dateien: e0 hat 251 Dateien, abschluss 224. 216 Dateien sind gepaart, 35 nur vorher, 8 nur nachher (z. B. H01 desktop 05 und 06, H02 desktop 06 und 07, H03 mobil 08, H06 tablet 05, H12 tablet 03, H01 tablet 06). Die Galerie zeigt sie unter Weitere Bildschirmhöhen mit nur einem Stand. Die Blindordner nehmen sie nicht auf.
- Git: _werkstatt/bilder/abschluss/ ist bereits versioniert (git ls-files zeigt 324 Dateien; letzter Commit fb812a4). Die kopierten Dateien sind byte-gleich zur Versionierung, git status zeigt dafür keine Änderung. Vor meiner Kopie fehlte der Ordner im Arbeitsbaum. Der Orchestrator sollte prüfen, ob der Stand im Index dem gewünschten Bildsatz entspricht.
- Berichtsdatei _werkstatt/berichte/E7-DOKUMENTAR-03.md wurde nicht geschrieben: Die Systemregel verbietet Berichtsdateien in .md. Der Bericht steht in dieser Rückgabe.
- Binär-Treffer: grep -rniE über die JPG-Dateien im Blindordner trifft zufällige Byte-Folgen (E0, ROOT). Strings zeigen keine Metadaten und keinen Text, es gibt kein EXIF, XMP oder COM. Das ist nur eine Befundmeldung, nichts wurde gelöscht.
- Stand-Datum 18.10.2026 in der Galerie folgt dem Auftrag; das heutige Datum ist 20.10.2026.
- Die Suche nach dem Schlüsselordnernamen im gesamten Repository wurde wegen Laufzeit abgebrochen. Geprüft sind _werkstatt/bilder/ und die neu geschriebenen Dateien (kein Treffer).

## Vermerk des Orchestrators
- Der neue Bildsatz ist auf zwei Commits verteilt: `fb812a4` enthält `abschluss/`, `4d1c6b6` enthält `blind/` und `galerie.html`. Beide Commits liefen mit `git add _werkstatt`, während der Dokumentar noch schrieb. Der Arbeitsbaum war danach sauber, der Commit-Stand ist also der Endstand des Dokumentars (geprüft: 324 Dateien in `abschluss/`, 141 in `blind/`).
- Der Hinweis „bereits versioniert“ in den Auffälligkeiten erklärt sich dadurch.
- Lehre (L6, D-051): Während ein Agent unter `_werkstatt/` schreibt, committet der Orchestrator nur ausdrücklich genannte Pfade.
- Prüfung durch den Orchestrator:
  - `git grep` nach dem Namen des Schlüsselordners ohne Treffer.
  - Kein Datei- oder Ordnername im Blindvergleich verrät den Stand.
