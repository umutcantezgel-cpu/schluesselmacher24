# FA-INHALT-05 · Schließanlagen, elektronischer Zutritt, Sicherheitstechnik: kleine Lücken der Arbeitsanweisung schließen

Kopf: Etappe FA Priorität 5 · Rolle Baumeister und Texter · Modell Opus · Stufe 2 bis 3 (rechtlich heikle Formulierung) · Kostenklasse M · Anforderungen FA-16-06, FA-16-09, FA-17-18, FA-18-09, FA-18-13, FA-18-14 · Befunde: `berichte/FA-ABGLEICH.md` Block 08, `berichte/FA-KUNDSCHAFTER-08.md`, `berichte/FA-BLINDPRUEFUNG-08.md`.

## Aufgabe in einem Satz
Schließe die sechs kleinen Lücken aus den Abschnitten 16 bis 18 der Arbeitsanweisung, ohne am übrigen Bestand etwas zu ändern (46 von 62 Anforderungen dieses Blocks sind erfüllt).

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026)
- Abschnitt 16: „Konfigurator für Privat, Gewerbe, Hausverwaltung, öffentliche Einrichtung und mehrere Liegenschaften.“
- Abschnitt 17: „Projektanfrage mit Objektart, Türen, Nutzerzahl, gewünschter Bedienform, Zeitsteuerung und Erweiterbarkeit.“
- Abschnitt 18, Leistungen unter anderem: „Smart Home Sicherheitsfunktionen“. Kasten „Rechtlich sauber bleiben“: „Verdeckte Audioüberwachung oder heimliche Aufzeichnung nicht als normales Standardprodukt bewerben. Bei Audiofunktionen und Aufzeichnung müssen Datenschutz und Strafrecht beachtet werden. Fokus auf rechtmäßig einsetzbare Sicherheits und Alarmtechnik.“

## So bauen
1. FA-16-06: Im Schließanlagen-Konfigurator heißt die Zielgruppe „Gewerbe“ (heute „Unternehmen“); gespeicherte Werte und Auswertung bleiben gültig (nur die Beschriftung, wenn der Wert in Vorgängen gespeichert wird).
2. FA-16-09: „Mehrere Liegenschaften“ wird eine eigene, wählbare Zielgruppe mit den dazugehörigen Fragen (Anzahl Liegenschaften, übergreifende Schlüssel), statt nur ein Zählfeld. Die Zusammenfassung für Kunde und Admin nennt sie.
3. FA-17-18: Der Zutritts-Konfigurator fragt die Erweiterbarkeit ab (sollen später Türen oder Nutzer hinzukommen, ungefähr wie viele), und die Zusammenfassung sowie das Vorgangsblatt führen die Antwort. Serverseitige Prüfung der Nutzlast mitziehen, falls es eine gibt.
4. FA-18-09: Die Leistung „Smarte Funktionen“ heißt sichtbar „Smart-Home-Sicherheitsfunktionen“ (Adresse der Seite bleibt, damit keine Verweise brechen).
5. FA-18-13 und FA-18-14: Auf den Seiten zu Videoüberwachung und Kameras steht ein klarer, sachlicher Hinweis: keine verdeckte Tonaufnahme und keine heimliche Aufzeichnung; bei Ton und Aufzeichnung gelten Datenschutz und Strafrecht; wir planen nur rechtmäßig einsetzbare Technik. Formuliere ohne Paragrafenangaben und ohne Rechtsberatung, kurz und ruhig. Der Text ist ein Entwurf zur Prüfung: Schreibe ihn zusätzlich wörtlich in deinen Bericht unter „Entwurf zur anwaltlichen Prüfung“. Prüfe, dass nirgends im Bereich Sicherheitstechnik verdeckte Überwachung, Abhören oder versteckte Kameras als Leistung beworben werden.
6. Inhalte stehen teils in `content/service-pages.json` und gleichlautend in `src/lib/data/defaults/service-pages.ts`: Beide tragen denselben Stand. Der Seed gleicht Startwerte ab; prüfe, welche Felder er abgleicht, und halte die Regel ein.

## Schreibrechte
- src/app/(site)/schliessanlagen/konfigurator/**, src/components/schliessanlagen/** (nur Zielgruppen)
- src/app/(site)/elektronische-zutrittsloesungen/konfigurator/**
- content/service-pages.json und src/lib/data/defaults/service-pages.ts (nur Einträge der Sicherheitstechnik), src/app/(site)/sicherheitstechnik/** (nur Hinweis und Bezeichnung)
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-INHALT-05.md
Nicht anfassen: src/lib/navigation.ts, content/rubriken.json, src/app/(site)/page.tsx, Payload-Sammlungen (keine Migration).

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`. Kein Build, kein Server, keine Befehle mit `--pg`, kein git. Schlagen Tests in fremden Dateien fehl (gleichzeitig laufende Pakete), melde es und behebe es nicht.

## Grenzen
G8, G9 (Preise, Rechtstexte in ihrem Inhalt und Fristen bleiben), R4, R10 (rechtliche Aussagen nur als vorsichtiger Entwurf), R12 (keine Herstellerlogos). Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS · ENTWURF ZUR ANWALTLICHEN PRÜFUNG (wörtlich) · OFFENE FRAGEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-INHALT-05 · BEREIT ZUR RÜCKGABE ===
