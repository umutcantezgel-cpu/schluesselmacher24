# E5-OPUS-05 · Referenz-Feinschliff nach E4-JURY-02 (letzte Runde je Ansicht und Kategorie)

Paket der Etappe E5, Welle 2 (Opus, Klasse M), gebaut vom Orchestrator in neun Teilen. Anforderungen G-02, G-04, G-05, G-16; Kriterien Z-04, Z-11. Grundlage: die fünf Verbesserungen aus berichte/E4-JURY-02.md (Zeilen 43 bis 47).

## Ergebnis
- Assistent (Jury 1 und 2): ein Zähler im Band („Schritt n von 5 · Etappe“, 9d63e58), „Vorhandene Schlüssel“ ausgeschrieben, „Schlüsselbart oder Spitze“; Kopf mobil einzeilig mit „Autoschlüssel anfragen“ (e5bb352, bei 360 px gemessen: eine Zeile; der Seitentitel für Suchmaschinen bleibt); Fotoschritt ruhiger: Ablage nur so hoch wie ihre Knöpfe, Fototipps zu Untergrund und Blitz nur einmal (a74ded5); Beschreibung ohne „13 Schritte“ (13e17a1). Die Zeichnungen je Ansicht kamen schon mit E5-GRAFIKER-02.
- Startseite, Kacheln (Jury 3, A-030, 6346f38): ab 768 px keine Trennung mehr, zwei Spalten mit der Bühne erst ab 1280 px, die Frage darüber über die ganze Breite, Kacheln auf acht von zwölf Spalten. Mobil bleiben drei Spalten nach G-02 mit Trennung an der Wortfuge.
- Startseite, Bühne (Jury 4, ecb6b57 und 97b4d7d): hochkant, oben der Funkschlüssel groß mit Taste, Transponder und Bart, beschriftet, in Tür 01, darunter der Plan mit den Türen 02 bis 04; die Spalte der Bühne nimmt die Höhe des Rasters an.
- Vorlagengerüst (Jury 5): keine Abschnittsnummern auf Startseite, /autoschluessel und im Assistenten (6a14a2b), „–“ statt „—“ in diesen Texten; „Warum wir“ als Zusagen ohne Nummern im Autoschlüssel-Abschnitt neben den fünf Schritten (ee93e85); ein Name je Leistung und ein Knopftext je Ziel, soweit G-03, G-08 und die Zeilenregel aus E4 es zulassen (A-031, 97b4d7d).

## Prüfung
- Prüfstufe A: Typprüfung und Lint sauber, Unit 2042 von 2042, Build ohne Datenbank 226 Seiten, Funktionsliste 19 von 19 (protokolle/funktionsliste-2026-11-03_23-35-17.md).
- Messungen im Browser (360, 390, 768, 1024, 1280, 1440, 1920 px): Kacheltitel ohne Trennung ab 768 px und im Innenraum der Kachel (1920 px: 1 px im Rand), alle Kacheln im ersten Bildschirm bei 1024 × 768, 1280 × 800 und 1440 × 900, neun über der Aktionsleiste bei 360 × 780. Bilder der Bühne (Endbild), des Autoschlüssel-Abschnitts (1440 und 390 px) und des Assistenten (360 px) geprüft.
- Eine Gegenprüfung durch Jury oder Bildsatz folgt in der Prüfstufe B der Etappe (E5-PRUEFER-01).

## Offen
- Assistent mobil: Die Markenkarten stehen bei 360 px noch unter der Leiste; der Kopf ist kürzer, der Rest gehört zur Leistung (E5-OPUS-04) oder zu E6.
- Unterseiten der Modelle (/autoschluessel/marken/…) tragen noch Abschnittsnummern; src/lib/navigation.ts nennt „Gleichschließende Zylinder (Sperrschließung)“ (an E8-TEXTER-03).
