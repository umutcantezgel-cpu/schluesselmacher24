# Erhebungsbögen: Anleitung für den Inhaber

Die fünf Bögen klären, welche Preise, Fahrzeuge, Codelinien, Produkte und Partner die Seite zeigen darf. Jeder Bogen liegt als Druckseite (HTML) und als Tabelle (CSV) vor: PREISE, KLONBAR, SORTIMENT, PRODUKTE und PARTNER.

**So bekommen Sie die Bögen:** Öffnen Sie die HTML-Datei im Browser und drucken Sie sie auf A4 hoch aus. Oder öffnen Sie die CSV-Datei in einem Tabellenprogramm. Die CSV-Dateien sind UTF-8 mit Semikolon als Trennzeichen.

**So geben Sie die Bögen zurück:** Laden Sie den ausgefüllten Bogen ohne interne Werte in den Ordner `_werkstatt/ausbau/eingang` hoch. Preise und Provisionen schreiben Sie nicht in den Upload. Nennen Sie sie nur als Nachricht, die mit `PREISE` beginnt. Antworten schicken Sie als Nachricht, die mit `ANTWORTEN` beginnt.

**Was ohne Antwort gilt:**

- PREISE: Neue Positionen zeigen keinen Preis. Die Werte aus dem Bestand bleiben.
- KLONBAR: Kein Fahrzeug gilt als klonbar.
- SORTIMENT: Jede Codelinie bleibt wie im Bestand.
- PRODUKTE: Die Seite zeigt nur Hersteller und Technik, keine Produktnamen.
- PARTNER: Keine Auftragsart wird über Partner vermittelt.

**So lesen Sie einen Eintrag:** Jede Zeile hat eine feste Kennung wie P-001. Bitte ändern Sie die Kennungen nicht. „Bestand“ ist der Wert, der heute auf der Seite steht. „Vorschlag, bitte prüfen“ heißt: Die Recherche schlägt einen Wert vor. Er gilt erst, wenn Sie ihn bestätigen. Jeder Vorschlag nennt seine Quelle.
