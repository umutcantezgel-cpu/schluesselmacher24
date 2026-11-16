# FA-QA-04A · Bedienbarkeit, Teil 2A: Menü kürzen, Beschriftungen lesbar, Schrittlinks groß genug

Kopf: Etappe FA Priorität 7 · Rolle Baumeister · Modell Opus · Stufe 3 (greift in Gestaltungssystem und Hauptnavigation ein, wirkt auf jede Seite) · Kostenklasse M · ohne Datenschema · Anforderungen FA-26-01, FA-26-02 · Befunde: `berichte/FA-BESTAND.md` (Zeilen FA-26-01, FA-26-02), `berichte/FA-QA-02.md` (Punkt 8 und offene Fragen), `berichte/FA-SOFORT-05.md`.

## Aufgabe in einem Satz
Mache die kleinste Schrift der Seite gut lesbar, die Schrittlinks der Formulare auch ab Tablet groß genug und das Menü kürzer, ohne dass eine Seite unerreichbar wird.

## Vorgabe des Inhabers (wörtlich, Abschnitt 26)
„Bedienbarkeit: auch für ältere Kunden · Große klare Buttons und gut lesbare Schrift. · Keine überladene Navigation.“

## So bauen
1. Schrift (FA-26-01): `--text-caption` steht in `src/app/(site)/globals.css` auf 0.75rem (12 px) und wird als Feldbeschriftung in Großbuchstaben an rund 230 Stellen benutzt. Hebe die Stufe im Gestaltungssystem auf mindestens 0.875rem (14 px) an, an der einen Stelle, und prüfe die Folgen: Zeilenhöhe, Laufweite der Großbuchstaben, Umbrüche in Karten, Tabellenköpfen, Fortschrittsanzeige und Fuß. Wo eine Beschriftung dadurch umbricht oder überläuft, löse es an der Stelle (kürzerer Text nur, wenn der Sinn bleibt; sonst Umbruch erlauben). Keine Stelle bleibt unter 14 px; ein Test liest die Gestaltungswerte und hält die Untergrenze fest. Der Admin ist nicht gemeint.
2. Schrittlinks (FA-26-01): Die Schrittliste in `src/components/flow/flow-shell.tsx` ist ab Tablet nur 32 px hoch (`min-h-8`). Stelle sie auf die Tippfläche des Systems um (`min-h-touch`, 44 px); `src/lib/cn.ts` kennt die Klasse. Test dazu.
3. Menü (FA-26-02): `NAV_AREAS` in `src/lib/navigation.ts` führt rund 90 Verweise in Spalten je Rubrik; es gibt keine Obergrenze. Kürze je Gruppe der Kopfzeile auf höchstens zwei Spalten mit je höchstens vier Verweisen (dazu der hervorgehobene nächste Schritt und die Rubriken aus den Daten). Was aus dem Menü fällt, muss auf der Rubrikseite oder in der Verweisliste der Seite stehen: Prüfe das für jeden gestrichenen Verweis mit `src/components/seo/waisen.test.ts` und ergänze fehlende Verweise auf der Rubrikseite (`PasstDazu` oder die vorhandene Verweisliste), nicht im Menü. Wähle die Verweise, die bleiben, nach dem Hub des Inhabers (14 Hauptzugänge, A-052) und nach den Wegen, die in eine Bestellung oder Anfrage führen. Ein Test hält die Obergrenze je Gruppe fest. Die fünf Gruppen der Kopfzeile bleiben (A-057, A-065). Telefonnavigation und Fuß nutzen dieselben Daten: beide prüfen.
4. Liste im Bericht: jeder gestrichene Menüverweis mit dem Ort, an dem er jetzt erreichbar ist.

## Schreibrechte
`src/app/(site)/globals.css` (nur die Schriftstufe und, falls nötig, Zeilenhöhe und Laufweite der Beschriftung), `src/components/flow/flow-shell.tsx` (nur die Schrittliste), `src/lib/navigation.ts` mit Test, `src/components/layout/**` (nur wo das gekürzte Menü es verlangt), Rubrikseiten und Seitendaten nur für fehlende Verweise (`content/seo.json` und `src/lib/data/defaults/content.ts` wortgleich, Feld der internen Verweise), einzelne Stellen mit überlaufender Beschriftung, zugehörige Tests, `_werkstatt/ausbau/berichte/FA-QA-04A.md`.
Nicht anfassen: Texte der Seiten außer überlaufenden Beschriftungen, Hub, Rubrikdaten, Datenschema, Kasse, Formularlogik (`src/lib/flow/**`; dort arbeitet FA-QA-04B).

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Kein Server, kein git, keine Formularsendung (G5). Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs`.

## Grenzen
G8, G9, R1, R4. Die Sichtprobe bei 360, 390, 768 und 1280 px macht der Orchestrator; nenne im Bericht die Seiten, auf denen sich am meisten ändert.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-04A · BEREIT ZUR RÜCKGABE ===
