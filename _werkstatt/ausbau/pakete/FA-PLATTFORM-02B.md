# FA-PLATTFORM-02B · Partnergewinnung: die vier Unterseiten im Admin pflegbar

Kopf: Etappe FA Priorität 4 · Rolle Baumeister · Modell Opus · Stufe 2 · Kostenklasse S · ohne neues Datenschema (die Sammlung Seiten gibt es; braucht ein Punkt doch ein Feld: nicht bauen, als OFFENE FRAGE melden) · Anforderung FA-22-36 · Befunde: `berichte/FA-BESTAND.md` (Zeile FA-22-36), `berichte/FA-PLATTFORM-02.md`.

## Aufgabe in einem Satz
Die vier Unterseiten der Partnergewinnung lesen Überschrift, Kurztext, Einleitung und Suchtexte aus der Sammlung Seiten, wie `/partner-werden` es schon tut; der Text im Code bleibt der Rückfall.

## Vorgabe des Inhabers (wörtlich, Abschnitt 22)
Im Adminbereich pflegbar: „Partner und Partnerseiten“.

## So bauen
1. Lies `src/app/(site)/partner-werden/page.tsx` (liest über `getPageContent` aus der Sammlung Seiten) und die vier Unterseiten `kfz-betriebe`, `auftraege-erhalten`, `kooperation`, `netzwerk-deutschland`, die Titel, Beschreibung und Inhalt fest aus `src/lib/partner/gewinnung.ts` nehmen.
2. Stelle die vier Seiten auf dasselbe Muster um: Titel und Beschreibung für Suchmaschinen, Überschrift, Kurztext und Einleitung aus `getPageContent(<Route>)`, sonst der Text aus `gewinnung.ts`. Lege die vier Einträge mit dem heutigen Wortlaut in `content/seo.json` und wortgleich in `src/lib/data/defaults/content.ts` an (der Seed gleicht ab), damit sie im Admin erscheinen. Die gegliederten Inhalte (Listen, Abläufe, der Satz „nur Autoschlüssel und Fahrzeugschlüssel“, die neun Leistungen aus `src/lib/partner/leistungen.ts`) bleiben im Code: Sie hängen an der Partnerlogik und dürfen im Admin nicht auseinanderlaufen. Sag in der Betreiberanleitung klar, was pflegbar ist und was nicht.
3. Titel und Beschreibungen in `src/lib/data/seo-laengen.test.ts`; Test, dass ein gepflegter Wert den Rückfall ersetzt und ein leerer Wert ihn nicht löscht; Betreiberanleitung `docs/betrieb/` (Abschnitt Partnerseiten).
4. Öffentliche Partnerprofile baust du nicht (Zustimmung der Partner fehlt, MA-54).

## Schreibrechte
`src/app/(site)/partner-werden/**` (nur die vier Unterseiten), `src/lib/partner/gewinnung.ts` (nur, um den Rückfall bereitzustellen), `content/seo.json` und `src/lib/data/defaults/content.ts` (nur die vier neuen Einträge), `src/lib/data/seo-laengen.test.ts`, `docs/betrieb/**` (ein Abschnitt), zugehörige Tests, `_werkstatt/ausbau/berichte/FA-PLATTFORM-02B.md`.
Nicht anfassen: das Partnerformular, Partnerlogik (`src/payload/**`, `src/lib/partner/leistungen.ts`, Vermittlung), Datenschema, Navigation.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, `… --json -- npm run build`. Kein Server, kein git, keine Formularsendung (G5). Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs`.

## Grenzen
G6 (JSON-Fallback und Rückfall wortgleich), G8, G9, R1, R4, R10 (keine Zusagen zu Vertrag und Provision über den Bestand hinaus).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-PLATTFORM-02B · BEREIT ZUR RÜCKGABE ===
