# FA-QA-03A · Prüfwerkzeug „nichts Falsches bleibt übrig“: Demo-Daten, Platzhalter, alte oder fremde Kontaktdaten im ausgelieferten Stand finden

Kopf: Etappe FA Priorität 7 · Rolle Prüfer und Werkzeugbauer · Modell Haiku (Werkzeug nach Muster), Gegenprüfung Opus · Stufe 2 · Kostenklasse M · kein Quelltext des Produkts, kein Datenschema, kein Server, kein `--pg` · Anforderungen FA-27-15 bis FA-27-17, FA-24 (Kontaktdaten), FA-23 (Erreichbarkeit), FA-10 („Demo Produkte und künstliche Beispiele dürfen nicht live bleiben“) · Vorläufer: Punkt 5 aus `pakete/FA-QA-01.md` · Muster: `_werkstatt/ausbau/werkzeuge/onpage.mjs` mit `onpage.test.mjs`, `logikwaechter.mjs` mit `logik-ausnahmen.json`, `LIESMICH.md`.

## Aufgabe in einem Satz
Baue das Werkzeug `werkzeuge/reste.mjs`, das den gebauten Stand und die Inhalte nach Dingen durchsucht, die laut Inhaber nicht übrig bleiben dürfen, und lass es einmal laufen.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 27)
„Jeder Prozess muss vollständig getestet werden. […] Keine Demo Daten, Platzhalter oder falsche Kontaktdaten dürfen übrig bleiben.“ Abschnitt 10: „Demo Produkte und künstliche Beispiele dürfen nicht live bleiben.“

## So bauen
1. `reste.mjs` (Node, ohne neue Abhängigkeit, ohne Browser) liest drei Quellen und sagt bei jedem Fund, aus welcher er stammt:
   - **Ausgeliefert:** die fertig gebauten Seiten unter `.next/server/app/**/*.html` (nur sichtbarer Text und Attribute `alt`, `title`, `aria-label`, `content` von Meta-Angaben; Skripte und Stile zählen nicht, eingebettete Strukturdaten `application/ld+json` zählen). Fehlt der Build oder ist er unvollständig (keine `BUILD_ID`), meldet das Werkzeug das als Bedienfehler und prüft nur die beiden anderen Quellen.
   - **Inhalte:** `content/**/*.json` ohne `content/startwerte/**` (dort liegen bewusst alte Stände).
   - **Texte im Code, die Kunden erreichen:** `src/lib/data/defaults/**`, `src/lib/mail/vorlagen/**`, `src/lib/pdf/**` (nur Zeichenketten; Testdateien `*.test.*` und Kommentare zählen nicht).
2. Prüfungen, jede mit eigener Kennung und abschaltbar über `--nur <kennung,…>`:
   - `demo`: Beispiel- und Demo-Daten, die sichtbar würden. Lies aus `content/code-lines.json` und den Artikeln die Einträge mit `example: true` und prüfe, dass ihre Namen und Kennungen in keiner ausgelieferten Seite stehen; dazu die Wörter „Demo“, „Testwerk“, „Musterwerk“, „Musterbau“, „Testbau“, „Testhersteller“ im ausgelieferten Stand.
   - `platzhalter`: Text in eckigen Klammern wie „[Ort]“ oder „[Platzhalter]“, „TODO“, „XXX“, „Lorem ipsum“, „Max Mustermann“, „Erika Mustermann“, „Musterstraße“, „Musterweg“, „example.org“, „example.com“, „Platzhalter“ als sichtbares Wort; außerdem Seiten, deren sichtbarer Text den Hinweis für die Redaktion trägt („Firmendaten sind noch Platzhalter“).
   - `alt`: frühere Angaben, die der Inhaber ersetzt hat: „Gloelstraße“, „Langgasse 70“, „09:00 bis 13:00“, „14:00 bis 17:00“ und andere Schreibweisen derselben Zeiten (mit „Uhr“, mit Bindestrich oder Halbgeviertstrich), das Wort „Öffnungszeiten“ als Überschrift oder Beschriftung, „nach Foto“ als Name einer Leistung („Schlüssel nach Foto“).
   - `kontakt`: Mailadressen, die nicht auf `schluesselmacher24.de` enden; Telefonnummern, die nicht die Nummern aus `content/settings.json` sind (lies sie dort, vergleiche nur die Ziffern); Anschriften mit Postleitzahl, die nicht die Anschrift oder der Werkstattstandort aus den Einstellungen sind (nur melden, wenn die Zeile wie eine Anschrift aussieht: Straße mit Hausnummer und fünfstellige Postleitzahl).
   - `erreichbarkeit`: Aussagen, die der Erreichbarkeit im Wortlaut des Inhabers widersprechen (R9): „24 Stunden geöffnet“, „rund um die Uhr geöffnet“, „durchgehend geöffnet“, „24h geöffnet“. Die Sätze des Inhabers selbst („24 Stunden erreichbar“, „Notdienst rund um die Uhr“, „Werkstatt und persönliche Beratung nach Terminvereinbarung“) sind kein Fund.
3. Ausnahmen nur einzeln und mit Grund: `reste-ausnahmen.json` (Prüfung, Quelle oder Pfad, genaues Fundstück, Grund, Datum). Keine Ausnahme nach Muster oder für ganze Ordner außer den oben genannten Ausschlüssen. Eine Ausnahme, die nichts mehr trifft, meldet das Werkzeug als veraltet.
4. Ausgabe wie die übrigen Werkzeuge: Markdown-Tabelle auf stdout (Prüfung, Quelle, Datei oder Seite, Fundstück mit 60 Zeichen Umgebung) und JSON-Protokoll (`protokolle/reste-<zeitstempel>.json`, mit `--json <datei>` anders), dazu `--md <datei>` für einen Bericht. Rückgabewert: 0 ohne Fund, 1 bei Funden, 2 bei Bedienfehlern.
5. Selbsttest `reste.test.mjs` mit `node:test` ohne Server und ohne den echten Build: je Prüfung mindestens ein Fund und ein Nicht-Fund an kleinen erfundenen Seiten und Dateien in einem vorübergehenden Ordner (auch: Skriptinhalt zählt nicht, Strukturdaten zählen, die Sätze des Inhabers zur Erreichbarkeit sind kein Fund, eine veraltete Ausnahme wird gemeldet).
6. Ein Lauf gegen den heutigen Stand (`_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/reste.mjs --md _werkstatt/ausbau/berichte/FA-QA-03A-lauf.md`). Im selben Arbeitsbaum baut gerade ein anderes Paket (FA-SHOP-03B): Ist der Build unvollständig, wiederhole den Lauf später einmal; bleibt er unvollständig, prüfe die beiden anderen Quellen und sage das im Bericht. Jeder Fund ist ein Befund am Produkt: Du änderst nichts unter `src`, `content` oder `scripts`, sondern listest die Funde mit Fundstelle und einem Vorschlag. Trage keine Ausnahme ein, nur um den Lauf grün zu bekommen (G8); schlage Ausnahmen mit Grund im Bericht vor, der Orchestrator entscheidet.
7. Eine Zeile in der Tabelle der `LIESMICH.md` der Werkzeuge.

## Schreibrechte
Nur `_werkstatt/ausbau/werkzeuge/reste.mjs`, `reste.test.mjs`, `reste-ausnahmen.json` (leer anlegen), `LIESMICH.md` (eine Tabellenzeile), `_werkstatt/ausbau/protokolle/reste-*.json`, `_werkstatt/ausbau/berichte/FA-QA-03A.md` und `FA-QA-03A-lauf.md`. Keine Datei unter `src`, `content`, `scripts`, `docs`. `lib.mjs` nicht ändern.

## Prüfen
`node --test _werkstatt/ausbau/werkzeuge/reste.test.mjs` (über `_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- …`), der Lauf aus Punkt 6, und `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx eslint _werkstatt/ausbau/werkzeuge/reste.mjs _werkstatt/ausbau/werkzeuge/reste.test.mjs`, falls die Lint-Regeln den Ordner erfassen (sonst weglassen und sagen). Kein Build, kein Server, kein git.

## Grenzen
G1 (kein Netz), G4, G8 (keine Prüfung lockern, keine Ausnahme ohne Entscheidung), G13 (keine Kundendaten in Protokolle; Fundstücke aus dem öffentlichen Stand sind in Ordnung). Texte in Bericht und Ausgabe kurz, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahl der Tests, Zahl der Funde je Prüfung und Quelle) · BEFUNDE AM PRODUKT (je Fund: Prüfung, Fundstelle, Fundstück, Vorschlag) · VORGESCHLAGENE AUSNAHMEN (mit Grund) · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-03A · BEREIT ZUR RÜCKGABE ===
