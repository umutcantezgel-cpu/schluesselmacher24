# FA-QA-01 · Pflichttests je Hauptprozess als Browserläufe bis in den Admin, auf Telefon, Tablet und Desktop

Kopf: Etappe FA Priorität 7 · Rolle Prüfer · Modell Haiku (Läufe nach Muster) mit Opus-Abnahme · Stufe 1 bis 2 · Kostenklasse L · kein Quelltext des Produkts · Anforderungen FA-27-01 bis FA-27-17, FA-26-09 · Muster: `_werkstatt/ausbau/werkzeuge/funktionsliste.mjs` (F-01 bis F-19, Playwright mit Attrappen), `werkzeuge/bildsatz.mjs`, `protokolle/einrichtung.md`.

## Aufgabe in einem Satz
Erweitere die Funktionsliste um die dreizehn Pflichttests des Inhabers, jeder als vollständiger Durchlauf im Browser gegen den Produktions-Build mit lokaler Datenbank, vom ersten Klick des Kunden bis zum Vorgang im Admin, mit Bild und Protokoll als Abnahmenachweis.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 27)
„Jeder Prozess muss vollständig getestet werden. Es reicht nicht, dass eine Seite optisch funktioniert.“ Pflichttests: Fahrzeuganfrage (Marke, Modell, Baujahr, Fahrzeugschein, drei Fotos, Text, Anzahlung, Termin, Bestätigung, Admin) · Motorrad und Kleinstfahrzeuge (Datenbank, alternative Dokumente, Fotos, Anfrage, Admin) · Schlüssel nach Code (Hersteller, Produkt, Code, Warenkorb, Zahlung, Bestätigung, Adminstatus) · Schlüssel nach Vorlage (drei Fotos, Anfrage, Preisprozess, Versandoption, E Mail) · Einsendeservice (Label, Kosten, Tracking, Admin, Rückversand) · Gehäuse und Customizing (Produkt, Kompatibilität, Einsendung, Zahlung, Status) · Sperrschließungen (Hersteller, Zylindertyp, Maße, Optionen, mehrere Positionen, Preis) · Schließanlagen (alle Fragepfade, Uploads, Zusammenfassung, Adminbericht) · Elektronischer Zutritt (Projektanfrage, Systemauswahl, Uploads, Rückmeldung) · Sicherheitstechnik (Bedarf, Uploads, Zusammenfassung, Kontakt) · Partner (Bewerbung, Prüfung, Freischaltung, Region, Leadzuordnung) · Admin (Produkte, Kategorien, Bestellung, Storno, Kunde, Partner, Inhalte) · Geräte (iPhone, iPad, Android, Desktop, Safari, Chrome). Abnahmeprinzip: „Vor Livegang bitte eine echte Testbestellung und eine echte Testanfrage für jeden Hauptprozess durchführen. Screenshots oder kurze Testprotokolle reichen als Nachweis. Keine Demo Daten, Platzhalter oder falsche Kontaktdaten dürfen übrig bleiben.“

## So bauen
1. Umgebung: Produktions-Build mit lokaler Datenbank über die Datenweiche (`sicher.sh --pg`), Seed, ein Admin-Zugang nur für Tests (erfundene Zugangsdaten aus Umgebungsvariablen der Datenweiche, nie echte). Zahlungs-, Mail-, Versand- und Analysedienste sind Attrappen (G5): Der Zahlungsschritt wird über die vorhandene Attrappe oder den Testweg des Bestands abgeschlossen; lies, wie F-01 bis F-19 das lösen. Erkennbar erfundene Testdaten (Erika Mustermann, example.org), Testdateien aus `_werkstatt/ausbau/testdaten`.
2. Je Pflichttest ein Lauf P-01 bis P-13 in `werkzeuge/pflichttests.mjs` (oder als Erweiterung der Funktionsliste, wenn das Muster es trägt): jeder Schritt der Zeile des Inhabers ist ein geprüfter Schritt mit Erwartung; am Ende wird im Admin (Browser, angemeldet) geprüft, dass der Vorgang mit Status, Unterlagen und Beträgen da ist. Fehlerfälle je Lauf mindestens zwei (Pflichtangabe fehlt, falsche Datei), und „Zurück“ ohne Datenverlust einmal je mehrstufigem Formular.
3. Geräte: jeder Lauf auf Chromium Desktop (1440 × 900); die Kundenstrecken zusätzlich mit den Geräteprofilen iPhone, iPad und einem Android-Telefon aus Playwright und einmal mit WebKit (als Näherung für Safari; echte Geräte bleiben Sache des Menschen und stehen so im Protokoll). Ist WebKit in der Umgebung nicht installiert, vermerke das und installiere nichts neu.
4. Nachweis: je Lauf ein Protokoll (`protokolle/pflichttests/P-xx.json`: Schritte, Dauer, Ergebnis) und zwei bis vier Bilder der entscheidenden Zustände (`bilder/arbeit/…`, nicht committet) sowie ein Kontaktbogen je Lauf (committet, höchstens 1.440 Pixel breit). Dazu der Abnahmebogen `berichte/FA-QA-01-abnahme.md`: Tabelle der dreizehn Zeilen mit Stand (bestanden, teilweise, nicht möglich mit Grund), Datum, Gerät, Verweis auf Protokoll und Bild; darunter die Liste dessen, was nur ein Mensch mit echten Konten prüfen kann (echte Zahlung, echte Mail, echtes Label, echte Geräte).
5. Prüfung „nichts Falsches bleibt übrig“ (`werkzeuge/reste.mjs`): durchsucht den Build und die Inhalte nach Demo-Daten (Beispiel-Einträge), Platzhaltern in eckigen Klammern, alten Adressen und Zeiten (Gloelstraße, Langgasse 70, 09:00 bis 13:00, 14:00 bis 17:00 als Öffnungszeit), fremden Mailadressen, „nach Foto“ als Leistung, Lorem ipsum; Ergebnis als Liste mit Fundstelle. Rückgabewert 1 bei Funden.
6. Ein Lauf, der am Produkt scheitert, ist ein Befund, kein Grund, den Test zu lockern (G8): Beschreibe den Fehler mit Schritt, Erwartung, Ergebnis, Bild.

## Schreibrechte
Nur unter _werkstatt/ausbau/werkzeuge (neue Dateien und die Funktionsliste), _werkstatt/ausbau/protokolle, _werkstatt/ausbau/bilder, _werkstatt/ausbau/testdaten, _werkstatt/ausbau/berichte/FA-QA-01*.md. Keine Datei unter src, content oder scripts.

## Grenzen
G1 (nur localhost), G4, G5, G8. Rechenintensives nacheinander: Build, Server und Läufe nicht parallel zu anderen Paketen mit `--pg` (der Orchestrator startet dieses Paket allein). Kein git.

## Ausgabeformular
GEÄNDERTE DATEIEN · PRÜFUNG UND ERGEBNIS (Tabelle der dreizehn Läufe) · BEFUNDE AM PRODUKT (mit Schritt, Erwartung, Ergebnis, Bild) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-01 · BEREIT ZUR RÜCKGABE ===
