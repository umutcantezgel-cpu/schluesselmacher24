# E6-BAUMEISTER-02 · Autoschlüssel-Gehäuse: Rubrikseite und Anfrage

Paket der Etappe E6, Welle 3 (Haiku, Klasse M), Anforderung G-20 (Teil Anfrage nach A-036), Kriterium Z-05. Gebaut von einem Haiku-Baumeister nach dem Muster des Motorrad-Wegs; Bericht nach seiner Rückmeldung. Commits 504caf5 (Rubrikdaten und Paketdatei) und 9bfec4c (Weg und Rubrik live).

## GEÄNDERTE DATEIEN
Neu unter `src/app/(site)/autoschluessel/gehaeuse/`: page.tsx, anfrage/page.tsx, anfrage/anfrage-formular.tsx, anfrage/kern.ts, anfrage/kern.test.ts. Durch den Orchestrator: Rubrik „autoschluessel-gehaeuse“ (Ziel `/autoschluessel/gehaeuse`, Ablaufschritte 2 und 3 und Erklärung ohne Zahlungslink, Status live; Icons unverändert nach A-034), Sitemap.

## WAS UND WARUM
Anfrage in fünf Schritten: Marke, Modell und Baujahr frei (1990 bis Jahr plus 1, damit mindestens 1998 bis 2022 abgedeckt sind), Tastenzahl, Fotos von Schlüssel und Fahrzeugschein als Pflicht, Kontakt, Absenden mit Quelle „gehaeuse“; der Server verlangt Fahrzeugschein und Schlüsselfoto aus den Rubrikdaten. Preis mit Zahlungslink folgt erst nach der rechtlichen Einordnung (MA-27); bis dahin sagt keine Seite ihn zu.

## PRÜFUNG UND ERGEBNIS
Tests des Pakets 8 von 8, gesamt 2127 von 2127; Typprüfung und Lint ohne Befund; Build ohne Datenbank grün (231 Seiten). Sichtprüfung bei 390 px: kein Überlauf, keine Konsolenfehler. Hub mit elf Kacheln: 390 × 844 alle, 360 × 780 neun, ab 768 px alle.

## OFFENE FRAGEN
- Nach MA-27: Freigabe mit Zahlungslink und Begleitschein für das Gehäuse (Leistung „gehaeuse“ neben Vorlage und Einsendung, A-036).
