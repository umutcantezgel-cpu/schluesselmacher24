# E5-OPUS-02 · Sperrschließung auf demselben Kern

Paket der Etappe E5, Welle 2 (Opus, Klasse L). Anforderungen G-28, G-09, L-127, L-130, L-134, EL-12, KA1, KE5; Kriterium Z-06. Commits 0063fbc (Bau) und a9c4a3e (Nachbesserung aus der Gegenprüfung).

## Ergebnis
- Ansatz (G9): Der bestehende Konfigurator für gleichschließende Zylinder teilt mit dem Kern schon Preis (priceCylinderOrder), Prüfung (validateCylinderDraft) und Katalog. Er bleibt deshalb für Preis, Entwurf und Warenkorb unverändert und bekommt den Kern dort, wo der Bestand nichts hatte. Bestellbar bleibt alles bis zur Höchstzahl des Katalogs (30 Zylinder, 50 Schlüssel) wie bisher.
- Link (KE5): „Zusammenstellung als Link speichern“ in derselben Form wie der Schließplan-Planer (kern.ts). Positionen werden Türen eines Plans, in dem jeder Schlüssel jede Tür schließt; Ziehschutz an allen Türen und die Antwort „später erweiterbar“ reisen mit (wie planZuEntwurf im Kern). Links aus dem Planer mit einer Gleichschließung öffnen hier, sofern der Bestand sie so bestellen kann (aktive Bauform, wählbare Maße, Funktion zur Bauform, Höchstzahlen, mindestens ein Schlüssel); ein unveränderter Start wird sofort ersetzt, sonst entscheidet der Nutzer; Ziehschutz an nur einigen Türen wird gemeldet.
- Sets (G-28): ab elf Zylindern ein Hinweis mit dem Weg zur Frage; übliche Sets zwei bis zehn Zylinder nach dem Gespräch mit dem Inhaber.
- Maßrückfragen des Kerns (sehr ungleiche Maße A und B) im Zylinderschritt, ohne etwas aufzuhalten.
- Laienerklärung mit Beispiel neben dem Ablauf (G-09) und der Weg in den Schließplan-Planer; Abschnitt „Weiterführend“ ohne Nummer.
- Unverändert bleiben Herstellerwahl und Komponenten (L-127, L-134) aus dem Bestand; sie wirken, sobald Systemdaten gepflegt sind (MA-22, EL-12).

## Prüfung
- Prüfstufe A: Typprüfung und Lint sauber, Unit 2050 von 2050 (kern.test.ts mit acht Fällen, darunter derselbe Preis über Kern und Bestand und derselbe Preis eines Planer-Plans mit Ziehschutz und Vormerkung nach der Übernahme), Funktionsliste F-05 und F-06 bestanden, Build 226 Seiten.
- Beleg im Browser: Link mit zwölf Zylindern, Ziehschutz und Vormerkung übernommen (12 Zylinder, 6 Schlüssel), Adresse bereinigt, Hinweis ab elf Zylindern sichtbar, Seitenleiste mit Laienerklärung.
- Gegenprüfung durch einen Haiku-Skeptiker, sieben Befunde; behoben in a9c4a3e: Optionen und Vormerkung aus dem Planer fielen weg (mittel), Übernahme und Startzustand berücksichtigten nur Positionen und Schlüssel (mittel), Links mit inaktiver Bauform oder unzulässigen Werten erzeugten eine unsichtbare Position (mittel), fehlende Prüfung der Höchstzahlen (niedrig), Rundreise-Test ohne Funktion (niedrig), Preistest nur gegen einen handgebauten Entwurf (niedrig, ergänzt um den Planer-Fall), Link-Fehler ohne Verweis (niedrig).

## Offen
- „Gleichschließende Zylinder“ heißt der Bereich in Brotkrumen, Seitentitel und src/lib/navigation.ts weiter so; der Name je Leistung für den ganzen Bereich geht an E8-TEXTER-03 (A-031).
- Systemdaten von ABUS und BKS (MA-22) fehlen; ohne sie bleibt die Herstellerwahl ausgeblendet.
