# FA-KERN-06 · Mail: alle Formulare und Systemmails über die Domainadresse, geprüft; Anleitung für Zoho, SPF, DKIM, DMARC

Kopf: Etappe FA Priorität 2 · Rolle Prüfer und Baumeister · Modell Haiku · Stufe 1 bis 2 · Kostenklasse M · kein Datenschema · Anforderungen FA-24-01 bis FA-24-06, FA-27-17 · Befunde: `berichte/FA-ABGLEICH.md` (Suche nach FA-24), Entscheidung A-045, MENSCHEN MA-32.

## Rollenbriefing
Prüfer: prüft nach Liste, schreibt Tests für neue Logik, berichtet knapp mit Belegpfaden. Fehler, die du vermeidest: deuten statt berichten; Stellen außerhalb der Navigation übersehen (Mails, PDF, Seeds, Tests, Skripte, Umgebungsbeispiele).

## Aufgabe in einem Satz
Belege und sichere, dass jede Mail der Seite (Kontaktformulare, Shopmails, Bestellbestätigungen, Systemmails) die Domainadresse `info@schluesselmacher24.de` aus den Einstellungen nutzt, dass keine alte oder fremde Adresse übrig ist, und schreibe die Anleitung für die Einrichtung des Postfachs.

## Vorgabe des Inhabers (wörtlich, Abschnitt 24)
„Verbindliche E Mail: info@schluesselmacher24.de. Keine alte Schlüsseldienst Wetzlar Adresse und keine Gmail Adresse für Kundenanfragen. Zoho Mail für die Domain einrichten. SPF, DKIM und DMARC soweit technisch möglich sauber konfigurieren. Alle Kontaktformulare, Shopmails, Bestellbestätigungen und Systemmails auf die neue Domainadresse ausrichten. Alte Adressen und Mailadressen auch aus Quellcode, strukturierten Daten, Templates und Rechtstexten entfernen.“

## So bauen
1. Inventar: Liste jede Stelle, an der eine Absender-, Antwort- oder Empfängeradresse entsteht oder steht (`src/lib/mail/**`, `src/lib/integrations/**`, `src/lib/umgebung.ts`, `src/payload/**`, `scripts/**`, `docs/**`, `content/**`, `.env.example` oder vergleichbare Beispieldateien, aber keine echten `.env`-Dateien lesen). Je Stelle: Datei und Zeile, Quelle der Adresse (Einstellungen, Umgebungsvariable, fester Text), Wert oder Variablenname. Im Bestand tauchen neben `info@` auch `team@schluesselmacher24.de`, `inhaber@…`, `mina@…`, `test@…` und Vorgangsadressen `sm24-t-…@schluesselmacher24.de` auf: kläre für jede, ob sie Testdatum, Kennung (keine Mailadresse im Versand) oder echter Empfänger ist.
2. Regel: Kundenkontakt läuft über die Adresse aus den Einstellungen (Firma → E-Mail). Absender und Antwortadresse der Systemmails folgen daraus oder aus genau einer Umgebungsvariable, die in `docs/LIVEGANG.md` beschrieben ist. Wo ein fester Text mit einer anderen Adresse steht, ersetze ihn durch die Einstellung. Interne Empfänger (Team) bleiben einstellbar, dürfen aber im Auslieferungszustand nicht auf eine fremde Domain zeigen.
3. Prüfung, die bleibt: ein Test, der Quelltext und Inhalte (ohne Tests und Testdaten) nach Mailadressen durchsucht und nur die erlaubten zulässt (Domain `schluesselmacher24.de`, `example.*`-Adressen in Tests), und eine Zeile in der Livegang-Prüfung (`src/lib/livegang-pruefung.ts`), die meldet, wenn die Firmen-Mail nicht auf der eigenen Domain liegt oder ein Platzhalter ist.
4. Anleitung `docs/betrieb/mail-einrichten.md` in Alltagssprache: Postfach bei Zoho Mail anlegen; welche DNS-Einträge gebraucht werden (MX, SPF als ein einziger TXT-Eintrag, der Zoho und den Versanddienst der Seite zusammen nennt, DKIM je Dienst, DMARC zuerst beobachtend mit Berichtsadresse, später strenger); wie man prüft, ob es wirkt (Testmail, Kopfzeilen); wo in der Seite Absender und Empfänger stehen. Keine erfundenen Werte: Wo ein Wert vom Konto abhängt, steht „den Wert zeigt Zoho beziehungsweise der Versanddienst an“. Lies dafür, welchen Versanddienst der Bestand nutzt (`src/lib/integrations`).

## Schreibrechte
src/lib/mail/** und src/lib/integrations/** (nur Adressquellen), src/lib/livegang-pruefung.ts mit Test, neuer Test für die Adressprüfung, docs/betrieb/mail-einrichten.md, docs/LIVEGANG.md (nur der Abschnitt Mail), _werkstatt/ausbau/berichte/FA-KERN-06.md.
Nicht anfassen: content/settings.json (die Adresse stimmt schon), Rechtstexte, .env-Dateien.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`. Kein Build, kein Server, keine Befehle mit `--pg`, kein git, keine Netzabrufe.

## Ausgabeformular
GEÄNDERTE DATEIEN · INVENTAR (Tabelle) · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-KERN-06 · BEREIT ZUR RÜCKGABE ===
