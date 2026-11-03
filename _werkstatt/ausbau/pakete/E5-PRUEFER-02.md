# E5-PRUEFER-02 · Leistungsdiagnose mobil

## 1. Kopfzeile
Kennung E5-PRUEFER-02 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kostenklasse M · Anforderung EL-33 · Kriterien Z-15, Z-16 · Schreibrechte: _werkstatt/ausbau/werkzeuge/leistung-diagnose.mjs (neu), _werkstatt/ausbau/protokolle/E5-PRUEFER-02/ (Zusammenfassungen), _werkstatt/ausbau/protokolle/roh/E5-PRUEFER-02/ (volle Lighthouse-Berichte, nie committet), _werkstatt/ausbau/berichte/E5-PRUEFER-02.md · Umfang: 14 Hauptansichten aus werkzeuge/lib.mjs (HAUPTANSICHTEN), Profil mobil

## 2. Rollenbriefing
Prüfer: misst, belegt und benennt Ursachen, ändert aber nichts am Produkt. Fehler: Vermutungen als Befund ausgeben; einen Einzellauf statt des Medians werten; Vorschläge ohne Messgrundlage; Prüfungen lockern, um Zahlen zu verbessern.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Finde für jede Hauptansicht heraus, warum das Budget (Leistung mobil mindestens 90, LCP höchstens 2.500 ms, SEO 100) verfehlt wird, und schlage Änderungen vor, geordnet nach erwarteter Wirkung in Millisekunden.

## 4. Hintergrund
E4-PRUEFER-01 (berichte/E4-PRUEFER-01.md, protokolle/E4-PRUEFER-01/lighthouse-mobil.json) hat an fünf Routen gemessen: LCP-Median 2.548 bis 3.829 ms, Leistung 85 bis 92, SEO 92 auf allen Unterseiten (Startseite 100). Ab Seitenbeginn verwirft der Hauptthread mobil 30 bis 43 % der Bilder; die Verluste entstehen beim Seitenaufbau, nicht durch die Inszenierung B-31. Das Paket E5-OPUS-04 setzt deine Vorschläge um und misst mit deinem Werkzeug nach.

## 5. Regeln (unveränderlich)
- Gemessen wird nur am laufenden Produktions-Build unter http://localhost:3000 (`_werkstatt/ausbau/werkzeuge/server.sh status`; läuft er nicht, nur `server.sh start`, kein Build). Kein Projektbefehl außer über die Datenweiche.
- Gleiche Messvorschrift wie werkzeuge/lighthouse.mjs: frischer Chrome je Lauf, Attrappen über `attrappenSetzen()` aus lib.mjs (G5), Profil mobil, drei Läufe je Ansicht, gewertet wird der Medianlauf. Das neue Werkzeug importiert lib.mjs und ändert lighthouse.mjs nicht.
- Je Ansicht aus dem Medianlauf: LCP-Element (Selektor, Art Text, Bild oder SVG), LCP-Phasen (Serverantwort, Ladeverzögerung, Ladedauer, Darstellungsverzögerung), blockierende Ressourcen mit Größe, JavaScript je Skript (Übertragung, Ausführungszeit, ungenutzter Anteil), Hauptthread nach Kategorien, lange Aufgaben bis zum LCP, Schriften mit Größe, TBT und CLS mit Verursachern. SEO: jedes nicht bestandene Audit mit Kennung und betroffenen Elementen.
- Vorschläge nur mit Messgrundlage, je Vorschlag: Ursache, erwartete Wirkung in ms, betroffene Dateien, Risiko für Bestand, Bewegung (B-31, B-32, B-35) und Zugänglichkeit. Preise, Rechtstexte, Zahl- und Einwilligungsabläufe bleiben unberührt (G9).

## 6. Maßstab
Jede Budgetverfehlung hat eine belegte Ursache mit Audit-Kennung und Zahl; das Werkzeug läuft erneut mit einem Befehl; die Vorschläge decken zusammen die Lücke zum Budget je Ansicht oder sagen, warum nicht.

## 7. Grenzen
G1, G3 bis G5, G8, G13. Keine Datei unter src/, content/ oder im Projektstamm ändern, kein Build, kein Commit.

## 8. Schritte
1. Bericht und Lighthouse-Protokoll von E4-PRUEFER-01 lesen, lighthouse.mjs und lib.mjs lesen.
2. leistung-diagnose.mjs schreiben (Aufruf `node leistung-diagnose.mjs [--routen a,b] [--laeufe 3]`, Ausgabe Markdown und JSON nach protokolle/E5-PRUEFER-02/, volle Berichte nach protokolle/roh/E5-PRUEFER-02/), an einer Ansicht erproben.
3. Alle 14 Hauptansichten messen.
4. Ursachen über alle Ansichten bündeln (Gemeinsames zuerst: Kopf, Schriften, Layout-Skripte), Vorschläge ordnen.

## 9. Selbstprüfung
Medianwerte stimmen mit der Zusammenfassung überein; je Ansicht steht das LCP-Element; jede SEO-Abweichung ist benannt; keine Projektdatei geändert (`git status` im Bericht).

## 10. Ausgabe
Werkzeug, Protokolle wie oben, Bericht nach _werkstatt/ausbau/berichte/E5-PRUEFER-02.md (höchstens 700 Wörter, Tabelle je Ansicht, Vorschlagsliste).

## 11. Letzte Zeile
=== ENDE E5-PRUEFER-02 · BEREIT ZUR RÜCKGABE ===
