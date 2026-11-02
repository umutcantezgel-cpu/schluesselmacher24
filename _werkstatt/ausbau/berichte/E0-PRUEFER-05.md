# E0-PRUEFER-05 · Planwerkzeug plan.mjs und anforderungen.mjs

## GEÄNDERTE DATEIEN
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/plan.mjs (Befehle pruefen, naechste, setze, stand, zeichne, abschluss)
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/anforderungen.mjs (Befehle pruefen, zeichne, zusammenfuehren)
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/plan.pruef.mjs (Selbsttest, 58 Tests)
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/testdaten/ (67 erfundene Dateien, Ausgaben im Unterordner ausgabe/)
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/berichte/E0-PRUEFER-05.md (dieser Bericht)

Keine Projektdatei und keine fremde Datei geändert. Nicht geschrieben: PLAN.json, PLAN.md, ABNAHME.md, ANFORDERUNGEN.md und die echte ANFORDERUNGEN.json.

## WAS UND WARUM
- Beide Werkzeuge sind reines Node-ESM ohne Abhängigkeiten. Sie importieren nichts aus lib.mjs, die Funktion argumente() ist kopiert.
- Schreiben erfolgt atomar (temporäre Datei, dann rename) mit JSON.stringify(x, null, 1).
- Alle Regeln aus Schritt 1 und 2 sind umgesetzt.
- Über das Paket hinaus geprüft: Etappe eines Pakets gibt es, genannte Anforderung gibt es in ANFORDERUNGEN.json, committet braucht commit, blockiert und zurückgestellt brauchen grund, fehlende ANFORDERUNGEN.json ist ein Befund.
- naechste nimmt keine Pakete mit gemeinsamen Schreibrechten auf und bricht bei einem ungültigen Plan ab.
- zusammenfuehren schreibt nur, wenn alle Teile gültig sind (alles oder nichts). Fehlt ANFORDERUNGEN.json, startet die Datei leer.
- Bei jedem Fehler wird nichts geschrieben. Das ist getestet.

## GEMEINSAME DATEIEN
Keine Änderung gewünscht.

## PRÜFUNG UND ERGEBNIS
Aufruf: node --test _werkstatt/ausbau/werkzeuge/plan.pruef.mjs

```
# tests 58
# suites 0
# pass 58
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 4016.011335
```

- Regeln mit Kennung: 55 (plan pruefen 15, naechste 11, setze 6, stand 3, zeichne 3, abschluss 6; anforderungen pruefen 7, zeichne 2, zusammenfuehren 2). Jede hat mindestens einen Test, und jeder Befehl hat Positiv- und Negativfälle.
- Eine Testprüfung wurde korrigiert (Spaltenabstand der Tabellenüberschrift). Danach war alles grün.
- Echtdaten, nur lesend: `anforderungen.mjs pruefen` meldet OK, belegt 0/622 (G 0/51, L 0/284, EL 0/79, M 0/36, E 0/138, K 0/34). `plan.mjs pruefen` meldet, dass PLAN.json noch fehlt.
- Echtdaten, Ausgabe nur in testdaten/ausgabe/: 622 Einträge gerendert, längste Inhaltszelle 120 Zeichen.
- Zwei Zwischenausgaben lagen kurz unter /tmp und sind entfernt.

## BELEGE
- Testdaten: testdaten/plan.json (korrigiert), plan-fehler.json (Dateiüberschneidung in Welle 2 und Haiku ohne muster), anf.json (5 Einträge), abnahme.md (22 Zeilen).
- Echtlauf: /home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/testdaten/ausgabe/echt-ANFORDERUNGEN.md
- Der Selbsttest lief direkt mit node und nicht über sicher.sh. Die Werkzeuge sind reines Node ohne Projektcode, ohne Datenbank und ohne Netz.

## OFFENE FRAGEN
1. Abschnitt 7 sagt, anforderungen.mjs schreibt ANFORDERUNGEN.json nie. Schritt 2 verlangt, dass zusammenfuehren sie schreibt. Umgesetzt nach Schritt 2, nur in diesem Befehl. Bitte bestätigen.
2. Die Regel „keine AUSNAHME für Z-02, Z-03, Z-14, Z-20“ betrifft nur den Status AUSNAHME. UMGEBUNGSAUSNAHME bleibt dort zulässig und hat keine Obergrenze. Bitte bestätigen.
3. naechste bietet Kür auch aus früheren Etappen an, wenn die aktuelle Etappe nichts bereit hat. Schritt 1 nennt nur spätere Etappen. Bitte bestätigen.
4. stand zählt Etappen ab 1. Ohne offenes Pflichtpaket steht dort m/m und Welle 0. Bitte bestätigen.
5. Die zusätzlichen Prüfungen unter WAS UND WARUM sind nicht im Paket genannt. Bitte bestätigen oder streichen.
