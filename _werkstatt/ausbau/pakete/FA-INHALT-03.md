# FA-INHALT-03 · Texte deutlich menschlicher: kurze, klare Sätze auf allen Kundenseiten, von zwei unabhängigen Lesern gegengeprüft, mit Liste für die Schlussredaktion des Menschen

Kopf: Etappe FA Priorität 5 · Rolle Autor (Opus) mit Gegenlesern (Haiku und Opus) · Stufe 3 (Inhalte der Schlüsselseiten) · Kostenklasse L je Seitengruppe · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-03 (Sprache der Startseite), FA-01 (für ältere Kunden bedienbar) · alte Pakete E8-TEXTER-01 bis -05 gehen hierin auf · Befunde: `_werkstatt/ausbau/SLOP-AUDIT.md`, Werkzeug `werkzeuge/stil.mjs` (Gedankenstriche, Bindestrich-Kandidaten, Floskeln, Platzhalter).

## Aufgabe in einem Satz
Überarbeite die sichtbaren Texte einer Seitengruppe so, dass ein Kunde sofort versteht, was angeboten wird und was er als Nächstes tun muss: kurz, klar, natürlich, ohne erfundene Aussagen.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 02)
„Die Texte sind an mehreren Stellen zu lang, zu künstlich und zu aufgeblasen. Dieser Stil darf nicht in die finale Version übernommen werden. Kurze, klare und natürliche Sätze. Der Kunde soll sofort verstehen, was angeboten wird und was er als Nächstes tun muss. Keine langen KI Blöcke, keine unnötige Fachsprache und keine künstlichen Formulierungen. Texte können mit zwei oder drei unterschiedlichen KI Systemen gegengeprüft werden. Danach ist eine manuelle redaktionelle Überarbeitung Pflicht. Jede Leistungsseite braucht eine klare Aussage, wenige verständliche Erklärungen, Vertrauen und einen eindeutigen nächsten Schritt. Keine erfundenen Aussagen zu Öffnungszeiten, Arbeitsweise, Preisen oder Verfügbarkeit.“ Abschnitt 03: „Kurze Aussagen ja, aber sprachlich sauber und menschlich.“

## Regeln für jede Seite
1. Eine klare Aussage oben (was wir hier für Sie tun), höchstens zwei Sätze. Danach wenige Erklärungen, je Abschnitt höchstens drei bis vier Sätze, Listen statt Schachtelsätzen. Ein eindeutiger nächster Schritt (ein Hauptknopf je Abschnitt, Knopftext nach A-031 einheitlich je Ziel).
2. Sätze im Mittel unter 15 Wörtern, keiner über 25. Keine Gedankenstriche, keine Doppelpunkte als Effekt, keine abgehackten Ein-Wort-Sätze, keine Floskeln („maßgeschneidert“, „aus einer Hand“, „Ihr zuverlässiger Partner“, „schnell und unkompliziert“), keine Dreierketten aus Gewohnheit, keine rhetorischen Fragen als Überschrift außer echten Kundenfragen in der FAQ. Fachwörter nur mit Erklärung in einem Halbsatz.
3. Inhalt bleibt wahr: Jede Tatsache der alten Fassung, die du behältst, muss im Code, in den Daten oder in `_werkstatt/ausbau/FACHWISSEN.md` belegt sein. Was nicht belegt ist, fällt weg oder kommt in die Liste OFFENE FRAGEN. Keine neuen Tatsachen, Zeiten, Preise, Zusagen (R4). Erreichbarkeit nur im Wortlaut der Einstellungen. Preise, Rechtstexte, Pflichtangaben und Einwilligungstexte bleiben unberührt (G9).
4. Nichts geht verloren: Nachweise und Sicherheitshinweise (R13), Preisangaben, Hinweise zum Widerruf und zur Prüfung bleiben inhaltlich erhalten, werden nur verständlicher.
5. Titel und Beschreibungen (SEO-Felder) fasst dieses Paket nur an, wenn FA-SEO-01 schon abgenommen ist; sonst bleiben sie.

## Ablauf je Seitengruppe (der Orchestrator nennt dir die Gruppe und die exakte Dateiliste im Auftrag)
1. Miss vorher mit `node _werkstatt/ausbau/werkzeuge/stil.mjs` (lies die Hilfe des Werkzeugs) die Seiten deiner Gruppe und halte die Zahlen fest.
2. Überarbeite die Texte in den Daten (`content/*.json` und gleichlautend im Rückfall unter `src/lib/data/defaults`) und in den Seitenkomponenten deiner Liste.
3. Zwei Gegenleser prüfen danach unabhängig: einer liest als älterer Kunde ohne Fachwissen (versteht er in zehn Sekunden, was die Seite anbietet und was er tun soll; wo stockt er), einer prüft Tatsachen und Vollständigkeit gegen die alte Fassung (git diff) und die Belege. Ihre Befunde arbeitest du ein.
4. Miss nachher erneut. Schreibe in den Bericht je Seite: Wörter vorher und nachher, längster Satz, Gedankenstriche, offene Stellen. Lege für den Menschen die Liste „Schlussredaktion“ an: je Seite die drei Stellen, die ein Mensch mit Fachwissen prüfen sollte (der Inhaber verlangt die manuelle Redaktion ausdrücklich).

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`. Tests, die Wortlaute erwarten, änderst du nur, wenn der Wortlaut selbst geändert wurde. Kein Build, kein Server, keine Befehle mit `--pg`, kein git.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · ZAHLEN VORHER UND NACHHER · SCHLUSSREDAKTION (Liste für den Menschen) · OFFENE FRAGEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-03 · BEREIT ZUR RÜCKGABE ===
