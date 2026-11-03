# E5-OPUS-01 · Schließplan-Planer auf dem Konfigurator-Kern (Bericht des Orchestrators)

Stand 2026-11-03 18:51. Bau durch den Orchestrator; Verstehen und Prüfen als Workflows mit Haiku (Ultracode).

## Ergebnis
- Neue Seite /schliessanlagen/konfigurator/schliessplan (statisch): Start mit Vorlage oder leerem Plan, Türen (Bezeichnung, Bauform, Maße A und B aus dem Katalog, Funktion, Aufbohr- und Ziehschutz), Schlüssel (Anzahl, für später vormerken, Ebene in Laiensprache), Matrix (mobil je Schlüssel als Liste, ab 768 px als Tabelle mit Beschriftung je Feld), Prüfen (Befunde, Messhilfe mit Schutzbeschlag, Pflichtbestätigung „Maße geprüft“ für Bestellungen), Abschluss: Sperrschließung mit dem Preis des Bestands in den Warenkorb (Kasse prüft und rechnet neu, G9), Schließanlage mit Ebenen als Anfrage mit vollständiger Matrix (submitRecord wie der Projekt-Konfigurator, mit Einwilligung, R9). Laufende Summe im Ablaufrahmen; Zwischenstand im Browser und als Link (KE5).
- Kern gehärtet: Preis nur für einen fehlerfreien Plan („offen“ sonst), Schutz an allen Türen als Option je Zylinder, an einzelnen Türen ein Angebot, Höchstwerte der Kasse, aktive Hersteller und nicht angebotene Vormerkung als Angebot; Link ohne „Maße geprüft“, ohne fremde Verweise, ohne doppelte Kennungen, mit Längenprüfung vor dem Erzeugen.
- Bestand: Projekt-Konfigurator unverändert (Projektanfrage, G-35), verlinkt in beide Richtungen; Schließanlagen-Seite mit Knopf „Schließplan selbst anlegen“.

## Prüfung
- Verstehen: Workflow mit fünf Haiku-Lesern und einem Kritiker (Bestand, Kern, Preise und Kasse, Anforderungen, Prüfwege).
- Gegenprüfen: Workflow mit vier Haiku-Prüfern (Logik, Preise und Kasse, Zugänglichkeit, Bestand und Tests) und je Befund zwei Skeptikern; 16 bestätigt, alle behoben (Link-Länge, Überschreiben durch Link und Vorlage mit Rückfrage, doppelte Kennungen, Einwilligung im Vorgang, Zusatzwünsche sichtbar, Einheit der Zusatzpreise, Hersteller, Vormerkung, Link-Ersatzanzeige, Fehler angesagt, Fokus nach Absenden und Entfernen, Gruppe der Vorlagen, eindeutige Knopfnamen); 2 verworfen.
- Prüfstufe A: Typprüfung und Lint 0; Unit 2028 von 2028 (Kern 22 Tests, Planer-Bausteine 6); Build JSON 225 von 225; Funktionsliste 19 von 19 (F-06 Projekt-Konfigurator bestanden); Browserlauf mobil und Desktop ohne Konsolenfehler (Mehrfamilienhaus bis vor das Absenden, Sperrschließung 117,00 € bis in den Warenkorb, Link in frischem Browser übernommen, im vorhandenen Browser mit Rückfrage, kaputter Link mit Hinweis).

## Offen
- Oberflächen und weitere Bauformen je System (ABUS, BKS) fehlen in den Katalogdaten; Maße bis 120/120 nur, wenn der Katalog sie führt (MA-22).
- Schließplan als PDF und Vorgang mit Schnappschuss: E5-OPUS-03. Sperrschließung auf demselben Kern mit Herstellerwahl: E5-OPUS-02.
