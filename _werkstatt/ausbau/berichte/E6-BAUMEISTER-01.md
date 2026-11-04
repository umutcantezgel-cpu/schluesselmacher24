# E6-BAUMEISTER-01 · Motorradschlüssel: Rubrikseite und Anfrage

Paket der Etappe E6, Welle 3 (Haiku, Klasse M), Anforderung G-19, Kriterium Z-05. Gebaut von einem Haiku-Baumeister; der Bericht steht hier nach seiner Rückmeldung, weil der Baumeister keine Berichtsdatei schreiben durfte. Commits 9a1603f (Weg und Rubrik live) und dc0893b (Hub-Kacheln, K-013 2.6); gemeinsame Serverprüfung vorab in d46d5fc.

## GEÄNDERTE DATEIEN
Neu unter `src/app/(site)/motorradschluessel/`: layout.tsx, page.tsx, anfrage/page.tsx, anfrage/anfrage-formular.tsx, anfrage/kern.ts, anfrage/kern.test.ts. Durch den Orchestrator: `content/rubriken.json` und Startinhalt (Status live), `src/app/sitemap.ts`, `src/components/hub/hub-kachel.tsx`, `getRubrik('motorradschluessel')` wörtlich auf der Seite (Abdeckungstest).

## WAS UND WARUM
- Rubrikseite mit Ablauf aus den Rubrikdaten und dem Abschnitt „Chip im Schlüssel“ (Wegfahrsperre, G-19).
- Anfrage in fünf Schritten: Hersteller, Modell oder Typ und Baujahr frei (keine Fahrzeugdatenbank), Chip ja, nein oder weiß nicht, Fotos von Schlüssel und Fahrzeugschein als Pflicht (R13), Kontakt, Absenden; danach die gemeinsame Bestätigung. Payload mit Quelle „motorrad“; der Server verlangt die Unterlagen der Rubrik.
- Mit der zehnten Hub-Kachel passte die vierte Reihe bei 390 × 844 nicht mehr in den ersten Bildschirm; die Kachel ist mobil kompakter (KERN K-013 2.6).

## PRÜFUNG UND ERGEBNIS
Tests des Pakets 8 von 8, gesamt 2118 von 2118; Typprüfung und Lint ohne Befund; Build ohne Datenbank grün (229 Seiten); Funktionsliste F-11 bestanden. Sichtprüfung bei 390 px: kein Überlauf, keine Konsolenfehler. Hub gemessen: 390 × 844 zehn von zehn Kacheln ohne Scrollen, 360 × 780 neun, ab 768 px alle.

## OFFENE FRAGEN
- `payload.anmerkung` hat kein Feld und geht als null mit; ein Feld „Anmerkung“ wäre Kür.
- Anrede ist Freitext statt Auswahl wie im Muster; vereinheitlichen mit E8.
