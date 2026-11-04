# E6-BAUMEISTER-04 · Beratung: Rubrikseite und Rückruf-Anfrage

Paket der Etappe E6, Welle 4 (Haiku, Klasse M), Anforderungen G-33, G-34 (Beratung per Anfrage), L-380, L-431, Kriterium Z-05. Gebaut von einem Haiku-Baumeister nach dem Muster des Kontaktformulars; Bericht nach seiner Rückmeldung. Commits 863d1d7 (Ablauftext ohne Uhrzeit), 7b4d36f (eingebettete Formulare) und cac398f (Weg und Rubrik live).

## GEÄNDERTE DATEIEN
Neu unter `src/app/(site)/beratung/`: layout.tsx, page.tsx, kern.ts, kern.test.ts, beratung-formular.tsx. Durch den Orchestrator: Rubrik „beratung“ live, Ablaufschritt „Rückruf“ ohne Zusage einer Uhrzeit, Sitemap, FlowShell `eingebettet` und globals.css.

## WAS UND WARUM
Rubrikseite mit Ablauf, Wegweiser zu den Themen mit eigenem Weg (Elektronik, Türen und Schließtechnik, Sicherheitstechnik mit Schlüsselaufbewahrung, Schließanlage) und Rückruf-Anfrage in drei Schritten (Thema, Beschreibung, Fotos frei; Telefon, E-Mail, Zeitraum als Wunsch; Absenden) mit gemeinsamer Bestätigung. Keine Uhrzeit, kein Preis, keine Produktnamen.

## BEFUND DER ABNAHME
Jede Seite mit einer FlowShell blendete die globale Aktionsleiste mit „Anrufen“ aus, und die Weiter-Leiste stand am Smartphone von Anfang an fest am Rand. Auf Kontakt und Beratung, wo das Formular ein Abschnitt ist, fehlte so „Anrufen“ für die ganze Seite (K-014). Behoben in 7b4d36f: FlowShell `eingebettet` mit Leiste am Ende des Schritts, Ausblendregel nur für nicht eingebettete Abläufe; gemessen bei 390 px.

## PRÜFUNG UND ERGEBNIS
Tests des Pakets 18 von 18, gesamt 2145 von 2145; Typprüfung und Lint ohne Befund; Build ohne Datenbank grün; Funktionsliste F-11 bestanden. Hub mit zwölf Kacheln: 390 × 844 alle, 360 × 780 neun, ab 768 px alle.

## OFFENE FRAGEN
Keine.
