# FA-SHOP-03B · Versand eingesendeter Schlüssel, Teil B: Sendungsnummer durch den Kunden, vorbereiteter Label-Anschluss, Status der Einsendung

Kopf: Etappe FA Priorität 3 · Rolle Baumeister · Modell Opus · Stufe 3 (Versand-Adapter) · Kostenklasse M · ändert das Datenschema und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-13-07 bis FA-13-10, FA-22-25, FA-22-26 · Befunde: `berichte/FA-ABGLEICH.md` Block 06, `berichte/FA-BLINDPRUEFUNG-06.md` · Recherche: `erhebung/FA-RECHERCHE-03.md`, `erhebung/E1-versand.md` · Entscheidung A-050 · Voraussetzung: FA-SHOP-03 (Teil A) ist abgenommen; lies zuerst `berichte/FA-SHOP-03.md`, Abschnitt „Stand für Teil B“, und die Paketdatei `pakete/FA-SHOP-03.md` (Vorgabe des Inhabers, Lage, Punkte 6 bis 8).

## Aufgabe in einem Satz
Der Kunde trägt seine Sendungsnummer selbst nach, sie steht überall am Auftrag, der Stand der Einsendung ist für ihn lesbar, und der Anschluss für das DHL-Paket-Label ist vorbereitet und abgeschaltet.

## Vorgabe des Inhabers (wörtlich, Abschnitt 13)
„Wenn ein Geschäftskundenkonto vorhanden ist, Versandmarken beziehungsweise Retourenlabels möglichst automatisch erzeugen. […] Sendungsnummer im Kundenauftrag und Adminbereich speichern.“

## So bauen
1. Sendungsnummer (Punkt 6 der Paketdatei FA-SHOP-03): Der Kunde kann seine Einlieferungs- oder Sendungsnummer auf der Vorgangsseite nachtragen (signierter Zugang wie im Bestand, Eingabe geprüft und bereinigt, Begrenzung der Versuche wie bei den übrigen Kundenaktionen). Sie steht im Kundenauftrag, im Admin, im Vorgangsblatt und in der Statusmail. Getrennt geführt: Sendung zur Werkstatt und Rücksendung an den Kunden (das Feld für die Rücksendung gibt es schon). Im Admin lässt sich zusätzlich eine Labeldatei am Vorgang ablegen.
2. Label über Schnittstelle, vorbereitet und abgeschaltet (Punkt 7): Die Versandschnittstelle (`src/lib/versand`) bekommt neben der DHL-Retoure einen zweiten, abgeschalteten Anschluss für das DHL-Paket-Label für Geschäftskunden nach der Recherche (nur Aufbau, Sandbox-Adresse, Attrappe in Tests; kein echter Aufruf, G3 und G5). Im Admin steht, welcher Weg aktiv ist und was dafür fehlt. Die Schritte für den Vertrag stehen im Bericht unter FÜR MENSCHEN.
3. Status der Einsendung für den Kunden (Punkt 8): angemeldet · unterwegs zu uns (wenn eine Sendungsnummer vorliegt) · eingegangen · geprüft, Angebot · in Fertigung · Rückversand mit Sendungsnummer. Nutze die vorhandenen Stände; ergänze nur, was fehlt.
4. Betreiberanleitung: ein kurzer Abschnitt in `docs/betrieb/` (neue Datei `einsendung-pflegen.md` oder Ergänzung einer vorhandenen Anleitung zur Einsendung), was das Team bei einer Einsendung einträgt und wo die Sendungsnummern stehen.

## Stand nach Teil A (vom Orchestrator, 16.11.2026)
- Teil A ist abgenommen. Lies `berichte/FA-SHOP-03.md`, Abschnitte „Stand für Teil B“, „Nachbesserung“ und „Abnahme“. Die Varianten sind Daten (`EinsendeEinstellungen.varianten`, `src/lib/versand/varianten.ts`), das Angebot baut `einsendeAngebot` (`src/lib/versand/angebot.ts`), die Wahl für den Begleitschein `versandWahl` (`src/lib/einsenden/schein.ts`).
- Serverprüfung der Einsendung steht in `src/lib/actions/records.ts` (Einsendezweig): Varianten aus den Einstellungen, Nachweise (Fahrzeugschein, Sicherungskarte) werden mit Dateiablage gegen die gespeicherte Datei bestätigt (`unterlagenAusAblage`). Diese Prüfungen bleiben; die Sendungsnummer des Kunden bekommt eine eigene, ebenso geprüfte Aktion mit signiertem Zugang.
- Pflichtpunkt aus der Gegenprüfung von Teil A: Im Label-Betrieb nennt die Seite Porto und Aufpreis als Betrag, der „mit dem Auftrag berechnet“ wird. Der Satz, dass der Betrieb das Porto übernimmt, erscheint nur, wenn der Inhaber das ausdrücklich freigibt (MA-50, Frage 5); baue dafür keinen Schalter, der standardmäßig an ist.
- `einsendeAngebotFuerWeg` ruft das Angebot heute fest mit `labelEingerichtet = false` auf (A-035). Du schaltest das erst um, wenn Vertrag und Zugang wirklich eingerichtet sind (Umgebungsvariablen), und nie in Tests mit echtem Aufruf (G5).
- Wortwahl: „Sendung“ statt „Umschlag“ (Begleitschein „Anschrift für die Sendung“, Formular „Schlüssel in der Sendung“); die Haftung steht überall als Zahl aus den Einstellungen.

## Schreibrechte
src/lib/versand/**, src/lib/einsenden/**, src/app/(site)/bestellung/[id]/** (Einsendeteil, Sendungsnummer), src/app/(site)/schluessel-einschicken/** (nur Stand und Sendungsnummer), src/lib/mail/vorlagen (Statusmail der Einsendung), src/lib/pdf (Vorgangsblatt, nur die Sendungsnummern), src/payload/collections/Vorgaenge.ts (nur Versand- und Einsendefelder), src/payload/globals/Einstellungen.ts (nur „Schlüssel einschicken“, Anzeige des aktiven Wegs), neue Migration (`sicher.sh --pg -- npx payload migrate:create einsende_sendung`), src/migrations/index.ts, src/payload-types.ts, Mapping und Typen nur für diese Felder, zugehörige Tests, docs/betrieb (wie oben), _werkstatt/ausbau/berichte/FA-SHOP-03B.md.
Nicht anfassen: die Varianten und ihre Werte aus Teil A, Versandarten für Bestellungen aus dem Shop in ihren Preisen (G9), Rechtstexte, Navigation, Startseite.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`
- Tests, die nicht fehlen dürfen: Sendungsnummer erscheint in Kundenansicht und Admin; fremder oder abgelaufener Zugang kann keine Nummer setzen; ohne Vertrag kein Label-Aufruf; der Stand „unterwegs zu uns“ erscheint nur mit Sendungsnummer.
- Lies vor Änderungen an Next-Schnittstellen die Anleitungen in `node_modules/next/dist/docs` (G12). Kein Server, kein git.

## Grenzen
G3, G5 (keine echten Versandmarken), G4, G6, G8, G9, R4, R9, R10, R13. Texte kurz, verständlich, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen) · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SHOP-03B · BEREIT ZUR RÜCKGABE ===
