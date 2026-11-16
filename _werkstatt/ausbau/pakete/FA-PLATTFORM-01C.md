# FA-PLATTFORM-01C · Partnernetz, Teil C: Umkreis und Regionen eines Partners auswerten

Kopf: Etappe FA Priorität 4 · Rolle Baumeister · Modell Opus · Stufe 3 (Partnerzuordnung, wirkt hinter dem Schalter auch auf den Zahlweg) · Kostenklasse M · ohne neues Datenschema (braucht ein Punkt doch ein Feld: nicht bauen, als OFFENE FRAGE melden); die Datenbanktests laufen mit `sicher.sh --pg` · Anforderungen FA-07-16, FA-08-13, FA-22-40 · Befunde: `berichte/FA-PLATTFORM-01B.md` („offen: Umkreis auswerten“), `berichte/FA-PLATTFORM-03.md` (Abschnitt „Stand für Teil B“: Entfernung zwischen Postleitzahlen), ENTSCHEIDUNGEN A-064 und A-066.

## Aufgabe in einem Satz
Ein freigeschalteter Partner deckt eine Postleitzahl nicht nur über seine eingetragenen Postleitzahlen ab, sondern auch über seinen Umkreis und über eingetragene Orte und Landkreise, an einer Stelle definiert und überall gleich benutzt.

## Vorgabe des Inhabers (wörtlich, Abschnitte 07 und 08)
„Region und mobilen Einsatzradius erfassen.“ · „Nach Prüfung und Vor Ort Qualitätskontrolle kann der Partner einer Region zugeordnet werden.“

## Lage
- `deckendePartner(plz, auftragsart, betriebe)` in `src/lib/partner/region.ts` wertet nur Postleitzahlen-Muster aus (`einsatzgebiet.postleitzahlen`). `einsatzgebiet.radiusKm`, die Postleitzahl des Betriebs (`plz`) und `einsatzgebiet.regionen` (Ort oder Landkreis mit Name und, wenn bekannt, amtlichem Schlüssel) werden gespeichert, aber nicht ausgewertet. Im Admin steht deshalb der Hinweis „Ohne Postleitzahlen keine Zuordnung“.
- Seit FA-PLATTFORM-03 gibt es den Ortsstamm: `entfernungZwischenPostleitzahlen` (rein, `src/lib/orte/entfernung.ts`), `entfernungKm` und `ortsstamm()` (nur Server, `src/lib/orte/stamm.ts`) mit Postleitzahl zu Gemeinde und Kreis.
- `src/lib/partner/**` wird von den Sammlungen und Hooks geladen und darf keine Serverdaten importieren (nur relative Importe, kein `server-only`).

## So bauen
1. Eine Definition der Abdeckung in `region.ts`, rein und testbar: Ein Betrieb deckt eine Postleitzahl für eine Leistung ab, wenn er freigeschaltet ist, die Leistung führt (`decktAuftragsart`) und mindestens eines gilt: (a) ein Postleitzahlen-Muster passt (Bestand); (b) ein Umkreis ist eingetragen, die Postleitzahl des Betriebs ist bekannt, und die Entfernung zur gesuchten Postleitzahl ist höchstens der Umkreis; (c) eine eingetragene Region passt: Ort oder Landkreis der gesuchten Postleitzahl stimmt über den amtlichen Schlüssel überein (ohne Schlüssel kein Treffer; Namen werden nicht geraten). Die Auskünfte, die Daten brauchen (Entfernung, Gemeinde und Kreis einer Postleitzahl), kommen als Funktionen in einem Parameter herein; ohne sie verhält sich die Funktion wie bisher.
2. Alle Aufrufer nutzen dieselbe Definition und geben die Auskünfte mit, wo sie auf dem Server laufen: die Postleitzahl-Abfrage (`src/lib/orte/abfrage.ts` und `stamm.ts`), die Vorschlagsliste am Vorgang (`src/payload/hooks/auftragsweg.ts`) und `passendePartner` in `src/lib/auftragsweg.ts` (Partnerweg hinter dem Schalter `PARTNERMODELL_B`; dort nur die Abdeckung, kein Zahlverhalten ändern). Belege im Bericht mit Datei und Zeile, dass es keine zweite Definition mehr gibt.
3. Jeder Treffer nennt seinen Grund (Postleitzahl, Umkreis mit Kilometern, Region), damit das Team in der Vorschlagsliste sieht, warum ein Betrieb erscheint.
4. Admin: Der Hinweis am Feld der Postleitzahlen und der Satz in `docs/betrieb/partner-pruefen.md` sagen, was jetzt gilt. Fehlt die Postleitzahl des Betriebs oder ist sie im Stamm unbekannt, sagt der Hinweis, dass der Umkreis dann nicht wirkt.
5. Tests: je Grund ein Treffer und ein Nichttreffer; pausierte und gesperrte Betriebe nie; unbekannte Postleitzahl bricht nicht; ohne Auskünfte wie bisher; Datenbanktest der Vorschlagsliste mit einem Betrieb, der nur einen Umkreis hat (Stichprobe des Stamms: Lahn-Dill-Kreis).

## Schreibrechte
`src/lib/partner/region.ts` mit Test, `src/lib/orte/**` (nur ergänzen), `src/payload/hooks/auftragsweg.ts` (nur die Vorschlagsliste), `src/lib/auftragsweg.ts` (nur `passendePartner` und was die Abdeckung dort braucht), `src/payload/collections/Partnerbetriebe.ts` (nur Hinweistexte), `docs/betrieb/partner-pruefen.md`, zugehörige Tests, `_werkstatt/ausbau/berichte/FA-PLATTFORM-01C.md`.
Nicht anfassen: Datenschema und Migrationen, Zahl- und Auszahlungslogik, der Import des Ortsstamms, das Partnerformular.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`, `… --json -- npm run build`. Kein Server, kein git.

## Grenzen
G4, G6, G8, G9 (kein Zahlverhalten), G13 (erfundene Betriebe in Tests), R4.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-PLATTFORM-01C · BEREIT ZUR RÜCKGABE ===
