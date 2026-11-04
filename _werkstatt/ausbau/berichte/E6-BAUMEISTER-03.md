# E6-BAUMEISTER-03 · Kontaktseite: Nachricht mit Fotos

Paket der Etappe E6, Welle 3 (Haiku, Klasse M), Anforderung G-36, Kriterium Z-05. Gebaut von einem Haiku-Baumeister; der Bericht steht hier nach seiner Rückmeldung. Commits dad07d3 und 667efab (Befund der Abnahme).

## GEÄNDERTE DATEIEN
Neu unter `src/app/(site)/service-und-termin/kontakt/`: kern.ts, kern.test.ts, kontakt-formular.tsx; page.tsx nur ergänzt (Abschnitt 02 „Nachricht schreiben“). Durch den Orchestrator: Gedankenstrich im bestehenden Vorspann ersetzt, doppelter Hinweis auf die ausführliche Anfrage gekürzt.

## WAS UND WARUM
Drei Schritte nach dem Muster des Einsende-Formulars: Anliegen, Nachricht (10 bis 2000 Zeichen), Vorgangsnummer frei, bis zu drei Fotos; Kontakt mit Antwortweg E-Mail oder Telefon, beim Telefon Nummer und Zeitfenster als Wunsch, ohne Vorauswahl; Absenden mit Quelle „kontakt“ und gemeinsamer Bestätigung. Keine Zusage zu Antwort- oder Rückrufzeiten (R4, R9).

## PRÜFUNG UND ERGEBNIS
Tests des Pakets 22 von 22; Typprüfung und Lint ohne Befund; Funktionsliste F-19 bestanden; Sichtprüfung bei 390 px ohne Überlauf und Konsolenfehler.

## BEFUND DER ABNAHME
Beim Antwortweg E-Mail ging das Telefon leer mit. Im Backend ist das Telefon eines Vorgangs Pflicht; mit Datenbank wäre jede solche Nachricht beim Speichern gescheitert, ohne Datenbank fiel es nicht auf. Behoben in 667efab: Telefon im Formular immer Pflicht, und der Server verlangt es jetzt für jeden Vorgang (contactSchema), damit Testbetrieb und Betrieb gleich prüfen; Test dazu, Unit 2119, DB 97.

## OFFENE FRAGEN
Keine.
