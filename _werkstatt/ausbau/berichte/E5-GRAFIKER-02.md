# E5-GRAFIKER-02 · Beispielzeichnung je Fotoansicht (Bericht, aus der Rückgabe übernommen)

Der Grafiker legt nach seinen Agentenvorgaben keine Berichtsdateien an; den Text hat der Orchestrator aus der Rückgabe übernommen und gekürzt.

## GEÄNDERTE DATEIEN
- src/components/visual/generators/schluessel.tsx, src/components/visual/generators/schluessel.test.tsx
- src/components/autoschluessel/optionen.ts: nur `example.visual` in den vier Feldern von KEY_PHOTO_SLOTS
- Bilder (nicht versioniert): _werkstatt/ausbau/protokolle/E5-GRAFIKER-02/ (vorn, hinten, bart, detail je mobil und Desktop, dazu fotoplaetze-mobil.png und fotoplaetze-desktop.png)

## WAS UND WARUM
Der Generator `schluessel` hat den Parameter `ansicht`: `vorn` (Tastenseite mit einer Taste zum Schließen und einer zum Öffnen, Leuchte und Öse), `hinten` (Rückseite mit Kennzeichnungsfeld aus Linien ohne Text, zwei Schrauben), `bart` (Bart von der Seite mit Halsstück und Fräsprofil; Lineal nur bei angegebenen Einschnitten), `detail` (Prägung als Punktraster unter einer Lupe, bewusst ohne erfundene Nummer, R4). Ansichten gelten für `typ: 'funk'`; andere Typen und unbekannte Werte zeigen die bisherige Seitenansicht. Anlass: E4-JURY-02, Befund 1 (viermal derselbe Baustein im Fotoschritt).

## PRÜFUNG UND ERGEBNIS
- Standardbild: 394 Fälle vor und nach der Änderung zeichengenau gleich.
- vitest src/components/visual, src/components/autoschluessel, src/components/forms: 40 Dateien, 974 Tests grün; schluessel.test.tsx 27 Tests (unter anderem: vier Ansichten verschieden, die beiden Tastensymbole unterscheiden sich bei gleicher Strichstärke).
- eslint der drei Dateien ohne Befund, `tsc --noEmit -p .` Exit 0.
- Bewegungsende je Ansicht 0,40 bis 1,35 s (Grenze 1,6 s), nur bestehende Klassen; reduzierte Bewegung wie bei den übrigen Grafiken.
- Abnahme durch den Orchestrator am Bild fotoplaetze-desktop.png und vorn-desktop.png (Nachbesserung: geöffnetes Schloss auf der zweiten Taste).

## OFFENE FRAGEN
1. Ansichten für Klapp- und Buntbartschlüssel (bisher nur Funkschlüssel).
2. Dunkelfassung ungeprüft (Prüfstufe B).
3. Das geöffnete Schloss ist bei 360 px klein; größer würde beide Tastensymbole ändern.

=== ENDE E5-GRAFIKER-02 · BEREIT ZUR RÜCKGABE ===
