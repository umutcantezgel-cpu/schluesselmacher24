# FA-PLATTFORM-01 · Partnernetz nur für Autoschlüssel: Leistungen, Qualitätskontrolle mit Besuch vor Ort, Pausieren und Sperren, Region, Lead-Verlauf

Kopf: Etappe FA Priorität 4 · Rolle Baumeister · Modell Opus · Stufe 3 (Datenmodell, Partnerlogik) · Kostenklasse L · ändert das Datenschema und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-07-02 bis FA-07-20, FA-08-09 bis FA-08-15, FA-22-36 bis FA-22-41 · Befunde: `berichte/FA-ABGLEICH.md` Blöcke 03 und 10, `berichte/FA-KUNDSCHAFTER-03.md`, `berichte/FA-BLINDPRUEFUNG-03.md` · Voraussetzung: FA-KERN-03 ist abgenommen (Auftragsweg, Verweis Vorgang zu Partnerbetrieb, Stände).

## Aufgabe in einem Satz
Richte Bewerbung, Prüfung und Verwaltung der Partner auf das aus, was der Inhaber will: ein Netz ausschließlich für Autoschlüssel und Fahrzeugschlüssel, mit dokumentierter Qualitätskontrolle vor der Freischaltung, wirksamem Pausieren und Sperren, Zuordnung zu Regionen und nachvollziehbarer Lead-Vergabe.

## Zuschnitt (vom Orchestrator, 16.11.2026)
Das Paket ist geteilt. Du baust Teil A (dieser Auftrag): die Punkte 1 und 2 unter „So bauen“ (die neun Leistungen als eine Liste, alte Werte lesbar; das Partnerformular mit Region, Leistungen, Geräten, Werkstatt, Radius, Erfahrung, Kontaktdaten und Serverprüfung) samt den Feldern am Partnerbetrieb, die das Formular füllt, und der Punkt 7 (keine Anmeldung, Mails nur als Vorlagen). Die Punkte 3 bis 6 (Prüfliste der Qualitätskontrolle, Pausieren und Sperren, Region zuordnen mit Abdeckungsfunktion, Lead-Verlauf) gehören zu Teil B (`pakete/FA-PLATTFORM-01B.md`) und bleiben unberührt. Von den Pflichttests gehört „Bewerbung mit Türöffnung als Leistung abgelehnt“ zu Teil A, die übrigen zu Teil B. Schreibe am Ende des Berichts einen Abschnitt „Stand für Teil B“: Felder, Typen und Funktionen, die Teil B benutzen kann (Namen, Dateien), und was dort noch fehlt.

Stand des Bestands seit dem Brief: Der Auftragsweg steht (FA-KERN-03: `src/lib/auftragsweg.ts`, `src/payload/hooks/auftragsweg.ts`; wer einen Auftrag bekommen darf, entscheidet dort eine Funktion), die Vermittlung bis zur Auszahlung ebenfalls (FA-KERN-04: `src/payload/hooks/vermittlung.ts`, `docs/betrieb/partnerauftrag-abrechnen.md`); der Partnerweg ist für Kunden aus (`PARTNERMODELL_B`). Das Partnerformular ist in FA-QA-02 auf Bedienbarkeit geprüft (Hilfeblock, Fehlermeldung beim Absenden, Rückfrage vor dem Verlassen mit gewählten Dateien; lies `berichte/FA-QA-02.md`): Diese Bausteine bleiben. Die Texte der Partnerseiten stammen aus FA-PLATTFORM-02 und FA-INHALT-03; du änderst dort nur, was die neun Leistungen verlangen, und nennst weitere Stellen im Bericht.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitte 07 und 08)
- „Das Netzwerk ist nicht für normale Schlüsseldienst Türöffnungen gedacht. Es geht ausschließlich um Autoschlüssel und Fahrzeugschlüssel.“
- Partnerleistungen: Autoschlüssel nachmachen · Programmierung und Anlernen · Schlüsselverlust · Keyless und Smart Key · Transponder · Funk · Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln · Reparaturen und Gehäuse · Motorrad und weitere Fahrzeugschlüssel, sofern Partner dies anbietet.
- Qualitätskontrolle vor Freischaltung: Betrieb und Identität prüfen · Leistungsumfang und Fahrzeugabdeckung dokumentieren · Vorhandene Maschinen, Programmiergeräte und Werkstattausstattung erfassen · Region und mobilen Einsatzradius erfassen · Vor endgültiger Freischaltung wird der Betrieb nach Möglichkeit persönlich besucht und vor Ort angesehen · Qualitätsstandard schriftlich festhalten. Nur geeignete Betriebe werden als aktive Partner geführt · Bei Qualitätsproblemen muss ein Partner im Adminbereich pausiert oder gesperrt werden können.
- Abschnitt 08: „Partnerformular mit Region, Leistungen, Geräten, Werkstatt, mobilem Radius, Erfahrung und Kontaktdaten. Nach Prüfung und Vor Ort Qualitätskontrolle kann der Partner einer Region zugeordnet werden. Im Adminbereich muss nachvollziehbar sein, welcher Lead welchem Partner angeboten oder zugeteilt wurde.“
- Abschnitt 22: Partner anlegen, prüfen, pausieren, Region zuordnen und Leads zuweisen.

## So bauen
1. Leistungen und Auftragsarten des Netzes sind genau die neun des Inhabers (als eine Liste in `src/lib/partner`, genutzt von Formular, Sammlung, Zuordnung und Seiten). Die heutigen Einträge zu Schließtechnik, Türöffnung an Wohnung und Haus, Zutritt und Sicherheitstechnik verschwinden aus Formular und Auswahl; in der Datenbank bleiben alte Werte lesbar (additiv, als „früher“ gekennzeichnet), neue Bewerbungen können sie nicht mehr wählen. Auf jeder Partnerseite und im Formular steht der Satz, dass es nur um Autoschlüssel und Fahrzeugschlüssel geht.
2. Partnerformular: Felder Region (Postleitzahl und Ort des Betriebs, Einsatzgebiet als Postleitzahlen oder Umkreis), Leistungen (die neun), Geräte (Schlüsselfräsmaschinen, Programmiergeräte, Diagnose; je mit Hersteller und Typ als freie Angabe), Werkstatt (feste Werkstatt ja oder nein, Anschrift, mobiler Einsatz), mobiler Radius in Kilometern, Erfahrung (Jahre, Schwerpunkte, Fahrzeugabdeckung), Kontaktdaten, Nachweise wie im Bestand. Schritte mit Fortschrittsanzeige, Zurück ohne Datenverlust, klare Fehlermeldungen, Serverprüfung aller Pflichtfelder.
3. Qualitätskontrolle am Partnerbetrieb als Prüfliste mit Datum, Prüfer und Notiz je Punkt: Identität und Betrieb · Leistungsumfang und Fahrzeugabdeckung · Maschinen, Programmiergeräte, Werkstatt · Region und Radius · Besuch vor Ort (Datum, wer, Ergebnis, Fotos als interne Dateien) · Qualitätsstandard schriftlich (Datei oder Vertragsverweis). Der Stand „freigeschaltet“ lässt sich nur setzen, wenn die Pflichtpunkte erledigt sind; der Besuch vor Ort ist Pflicht, außer das Team vermerkt ausdrücklich „Besuch nicht möglich“ mit Grund (der Inhaber schreibt „nach Möglichkeit“).
4. Pausieren und Sperren wirken: `pausiert` und neu `gesperrt` (mit Grund und Datum) schließen den Partner von jeder neuen Zuordnung aus (Regel aus FA-KERN-03, hier im Admin sichtbar gemacht: Warnung am Vorgang, kein Vorschlag in der Auswahl). Laufende Aufträge bleiben sichtbar und werden zur Klärung markiert.
5. Region zuordnen: Am Partnerbetrieb Einsatzgebiet als Postleitzahlen-Muster und Umkreis (Bestand) plus Zuordnung zu Orten und Landkreisen, sobald die Ortsdatenbasis steht (FA-PLATTFORM-03); baue die Relation so, dass sie leer sein darf. Eine Funktion mit Tests beantwortet: Welche freigeschalteten Partner decken diese Postleitzahl für diese Leistung ab?
6. Lead-Verlauf: Am Vorgang eine Liste „angeboten an“ mit Partner, Zeitpunkt, wer, Ergebnis (angeboten, angenommen, abgelehnt, zurückgezogen, zugeteilt) und Notiz; jede Änderung der Zuordnung schreibt einen Eintrag. Am Partnerbetrieb die Gegenansicht: alle Leads dieses Partners mit Stand. In der Liste der Vorgänge ein Filter „wartet auf Zuordnung“.
7. Kein Partnerzugang in diesem Paket (Partner melden sich nicht an); Mails an Partner nur als vorbereitete Vorlagen, Versand über Attrappen in Tests (G5).
8. Öffentliche Partnerprofile: nicht in diesem Paket; nenne im Bericht, was dafür nötig wäre (Zustimmung der Partner).

## Schreibrechte
- src/payload/collections/Partnerbetriebe.ts, Vorgaenge.ts (nur Lead-Verlauf), src/payload/hooks/** und components/** (Partner), neue Migration (`sicher.sh --pg -- npx payload migrate:create partner_qualitaet`), src/migrations/index.ts, src/payload-types.ts, src/lib/partner/**, src/lib/data/payload-mapping.ts (nur Partner), src/lib/types.ts (nur Partner-Typen), src/app/(site)/partner-werden/partner-formular.tsx und zugehörige Aktion, src/lib/mail/vorlagen (nur Partner), src/lib/pdf (nur Partnervertrag-Verweise)
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-PLATTFORM-01.md
Nicht anfassen: die Seiten unter src/app/(site)/partner-werden außer dem Formular (FA-PLATTFORM-02), Zahlungslogik (FA-KERN-03), Navigation, Startseite, Vertragstext (MA-29).

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`
- Tests, die nicht fehlen dürfen: Bewerbung mit Türöffnung als Leistung abgelehnt; Freischaltung ohne Prüfliste abgelehnt; pausierter und gesperrter Partner nicht zuordenbar; Abdeckung nach Postleitzahl und Leistung; Lead-Verlauf schreibt je Wechsel einen Eintrag.
- Kein Server, kein git.

## Grenzen
G4, G5, G6, G8, G9, G13 (keine Provisionen, Vertragsinhalte oder Partnerdaten im Repository; Tests mit erfundenen Betrieben), R4, R10, R13. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-PLATTFORM-01 · BEREIT ZUR RÜCKGABE ===
