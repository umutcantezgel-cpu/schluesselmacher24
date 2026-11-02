# WACHHUND · Anweisung für die geplante Aufgabe „SM24 Wachhund“

Du bist eine frische Sitzung (Opus 5.5), gestartet von der geplanten Aufgabe „SM24 Wachhund“ im Repository umutcantezgel-cpu/schluesselmacher24. Arbeite in diesem Repository. Rückfragen gibt es nicht.

1. Branch finden (Auftrag 8.2): `git fetch origin`. Unter allen Remote-Branches, die `_werkstatt/ausbau/HERZSCHLAG.md` tragen, nimm den mit dem jüngsten Commit. Gibt es keinen: Antworte mit einer Zeile „WACHHUND · kein Branch mit Herzschlag · beendet“ und beende dich.
2. Lies `_werkstatt/ausbau/HERZSCHLAG.md` auf diesem Branch (`git show origin/<branch>:_werkstatt/ausbau/HERZSCHLAG.md`).
   - Zustand ABSCHLUSS, HALT oder WARTET AUF FREIGABE: eine Zeile „WACHHUND · <Zustand> · beendet“, Ende.
   - Zeit jünger als 150 Minuten (HERZSCHLAG-FRIST): eine Zeile „WACHHUND · Herzschlag frisch (<Zeit>) · beendet“, Ende.
   - Zustand „WARTET BIS <Uhrzeit>“ mit einer Zeit in der Zukunft: eine Zeile „WACHHUND · wartet bis <Uhrzeit> · beendet“, Ende.
3. Sonst übernimmst du:
   a. Branch auschecken (`git checkout -B <branch> origin/<branch>`), neue Sitzungskennung aus acht Zeichen erzeugen und in `.git/sm24-sitzung` ablegen.
   b. HERZSCHLAG.md mit deiner Sitzungskennung, Zeit (Europe/Berlin) und Zustand AKTIV schreiben, nur diese Datei committen (Nachricht `HERZSCHLAG`) und `git push -u origin <branch>`. Lehnt der Remote ab, hat eine andere Sitzung übernommen: eine Zeile „WACHHUND · andere Sitzung aktiv · beendet“, Ende. Nie erzwingen.
   c. Lies `_werkstatt/ausbau/AUFTRAG.md` (der vollständige Auftrag) und `_werkstatt/ausbau/LEITSTAND.md`. Führe das Startritual aus Abschnitt 8.6 aus, einschließlich der Einrichtung nach `_werkstatt/ausbau/protokolle/einrichtung.md` in deiner neuen Umgebung.
   d. Arbeite wie die Hauptsitzung nach dem Auftrag weiter, ab `_werkstatt/ausbau/PRUEFPUNKT.md` und `node _werkstatt/ausbau/werkzeuge/plan.mjs naechste`. Trage in STATUS.md ein, dass du übernommen hast, und die Ursache der Herzschlag-Lücke, soweit erkennbar (L8).
   e. Vor dem Ende deines Zuges: PRUEFPUNKT.md aktualisieren, Herzschlag schreiben, committen, pushen. Jede Antwort endet mit der Statuszeile aus Abschnitt 22.
4. Grenzen und rote Linien aus Abschnitt 6 gelten unverändert. Insbesondere: kein Push auf main, kein erzwungener Push, keine Deploys, keine echten Mails, Zahlungen oder Versandmarken, jeder Projektbefehl nur über `_werkstatt/ausbau/werkzeuge/sicher.sh`.
