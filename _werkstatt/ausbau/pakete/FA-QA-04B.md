# FA-QA-04B · Bedienbarkeit, Teil 2B: Formularschritte in der Browser-Historie

Kopf: Etappe FA Priorität 7 · Rolle Baumeister · Modell Opus · Stufe 3 (gemeinsamer Ablauf aller mehrstufigen Formulare, auch der Schlüsselwege mit Nachweis) · Kostenklasse M · ohne Datenschema · Anforderung FA-26-04 · Befunde: `berichte/FA-BESTAND.md` (Zeile FA-26-04), `berichte/FA-QA-02.md` (Punkt 4, offene Fragen, Zeile zum Muster-Formular Fahrzeugschlüssel).

## Aufgabe in einem Satz
Die Zurück-Taste des Browsers und von Android führt in jedem mehrstufigen Formular einen Schritt zurück statt aus dem Formular hinaus, und gewählte Dateien bleiben erhalten.

## Vorgabe des Inhabers (wörtlich, Abschnitt 26)
„Mehrstufige Formulare mit Fortschrittsanzeige. · Zurückfunktion ohne Datenverlust. · Mobile Bedienung besonders intensiv testen.“

## So bauen
1. Lies zuerst `src/lib/flow/use-flow.ts`, `src/lib/flow/verlassen-warnung.ts` mit Test, `src/components/flow/flow-shell.tsx` und `berichte/FA-QA-02.md`. Heute geht der eigene Zurück-Knopf ohne Verlust; die Schritte stehen aber nicht in der Historie, und die Rückfrage vor dem Verlassen legt einen eigenen Wacheintrag an (`pushState`). Beide Mechanismen dürfen sich nicht stören.
2. Jeder Schrittwechsel nach vorn legt einen Eintrag in der Historie an (Zustand mit Kennung des Formulars und Schritt; die Adresse bleibt gleich, kein Suchparameter, damit `canonical` und Messung unberührt bleiben). `popstate` führt auf den Schritt des Eintrags. Zurück im ersten Schritt verlässt das Formular wie bisher; dann greift die vorhandene Rückfrage, wenn Dateien gewählt oder Angaben ungespeichert sind. Vorwärts im Browser führt wieder auf den späteren Schritt, aber nie an einem gesperrten Schritt vorbei (`canContinue` gilt).
3. Der eigene Zurück-Knopf und die Schrittlinks nutzen dieselbe Historie (kein doppelter Eintrag, kein Sprung um zwei Schritte). Beim Neuladen setzt das Formular am gespeicherten Schritt fort wie bisher.
4. Gewählte Dateien bleiben im Speicher des Formulars, solange die Seite offen ist: Zurück und Vorwärts verlieren sie nicht. Das Muster-Formular Fahrzeugschlüssel bekommt die Rückfrage vor dem Verlassen wie die anderen (`ungesichert`, `mitDateien`).
5. Tests: reine Zustandslogik als Unit-Tests (vor, zurück, vorwärts, gesperrter Schritt, erster Schritt, Wacheintrag der Rückfrage), dazu der Sammeltest `formulare-bedienbarkeit.test.ts` für jedes Formular. Ohne Fenster (Vorabrendern) darf nichts brechen.

## Schreibrechte
`src/lib/flow/**`, `src/components/flow/**` (ohne die Schrittliste; dort arbeitet FA-QA-04A), das Muster-Formular Fahrzeugschlüssel unter `src/components/fahrzeug-anfrage/**` (nur die Rückfrage), zugehörige Tests, `_werkstatt/ausbau/berichte/FA-QA-04B.md`. Einzelne Formulare nur, wenn sie den gemeinsamen Ablauf umgehen; jede solche Stelle im Bericht nennen.
Nicht anfassen: Serveraktionen, Pflichtregeln für Unterlagen (R13), Texte, Gestaltungssystem, Navigation.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Kein Server, kein git, keine Formularsendung (G5). Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs`.

## Grenzen
G5, G8, R13 (kein Schritt mit Nachweis wird überspringbar). Die Browserprobe mit Android- und iPhone-Profil macht der Orchestrator; nenne im Bericht, was er prüfen soll.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-04B · BEREIT ZUR RÜCKGABE ===
