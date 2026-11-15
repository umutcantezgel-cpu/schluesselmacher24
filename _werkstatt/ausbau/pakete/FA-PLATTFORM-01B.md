# FA-PLATTFORM-01B · Partnernetz, Teil B: Qualitätskontrolle mit Besuch vor Ort, Pausieren und Sperren, Region zuordnen, Lead-Verlauf

Kopf: Etappe FA Priorität 4 · Rolle Baumeister · Modell Opus · Stufe 3 (Datenmodell, Partnerlogik) · Kostenklasse L · ändert das Datenschema und nutzt `sicher.sh --pg` (in dieser Zeit kein anderes Paket) · Anforderungen FA-07-10 bis FA-07-20, FA-08-12 bis FA-08-15, FA-22-36 bis FA-22-41 · Befunde: `berichte/FA-ABGLEICH.md` Blöcke 03 und 10, `berichte/FA-KUNDSCHAFTER-03.md`, `berichte/FA-BLINDPRUEFUNG-03.md` · Voraussetzung: FA-PLATTFORM-01 (Teil A) ist abgenommen; lies zuerst `berichte/FA-PLATTFORM-01.md`, Abschnitt „Stand für Teil B“, und die Paketdatei `pakete/FA-PLATTFORM-01.md` (Vorgabe des Inhabers im Wortlaut, Punkte 3 bis 6).

## Aufgabe in einem Satz
Mache die Verwaltung der Partner im Admin so, wie der Inhaber sie will: dokumentierte Qualitätskontrolle vor der Freischaltung, wirksames Pausieren und Sperren, Zuordnung zu Regionen und ein nachvollziehbarer Verlauf, welcher Lead welchem Partner angeboten oder zugeteilt wurde.

## Vorgabe des Inhabers (wörtlich, Abschnitte 07, 08 und 22)
- Qualitätskontrolle vor Freischaltung: Betrieb und Identität prüfen · Leistungsumfang und Fahrzeugabdeckung dokumentieren · Vorhandene Maschinen, Programmiergeräte und Werkstattausstattung erfassen · Region und mobilen Einsatzradius erfassen · Vor endgültiger Freischaltung wird der Betrieb nach Möglichkeit persönlich besucht und vor Ort angesehen · Qualitätsstandard schriftlich festhalten. Nur geeignete Betriebe werden als aktive Partner geführt · Bei Qualitätsproblemen muss ein Partner im Adminbereich pausiert oder gesperrt werden können.
- „Nach Prüfung und Vor Ort Qualitätskontrolle kann der Partner einer Region zugeordnet werden. Im Adminbereich muss nachvollziehbar sein, welcher Lead welchem Partner angeboten oder zugeteilt wurde.“
- Abschnitt 22: Partner anlegen, prüfen, pausieren, Region zuordnen und Leads zuweisen.

## So bauen
1. Qualitätskontrolle am Partnerbetrieb als Prüfliste mit Datum, Prüfer und Notiz je Punkt: Identität und Betrieb · Leistungsumfang und Fahrzeugabdeckung · Maschinen, Programmiergeräte, Werkstatt · Region und Radius · Besuch vor Ort (Datum, wer, Ergebnis, Fotos als interne Dateien über die vorhandene Upload-Strecke) · Qualitätsstandard schriftlich (Datei oder Vertragsverweis). Der Stand „freigeschaltet“ lässt sich nur setzen, wenn die Pflichtpunkte erledigt sind; der Besuch vor Ort ist Pflicht, außer das Team vermerkt ausdrücklich „Besuch nicht möglich“ mit Grund (der Inhaber schreibt „nach Möglichkeit“). Bereits freigeschaltete Betriebe im Bestand bleiben freigeschaltet (additiv, G6); die Prüfliste zeigt bei ihnen „vor Einführung der Prüfliste freigeschaltet“.
2. Pausieren und Sperren wirken: `pausiert` und neu `gesperrt` (mit Grund und Datum) schließen den Partner von jeder neuen Zuordnung aus. Die Regel sitzt an der einen Stelle aus FA-KERN-03 (`src/lib/auftragsweg.ts`); hier wird sie im Admin sichtbar: Warnung am Vorgang, kein Vorschlag in der Auswahl. Laufende Aufträge bleiben sichtbar und werden zur Klärung markiert. Die Auszahlungsregeln aus FA-KERN-04 änderst du nicht; prüfe mit einem Test, dass ein gesperrter Partner keine neue Freigabe einer Auszahlung auslöst, und melde eine Lücke als OFFENE FRAGE.
3. Region zuordnen: am Partnerbetrieb das Einsatzgebiet als Postleitzahlen-Muster und Umkreis (Bestand und Teil A) plus eine Zuordnung zu Orten und Landkreisen, die leer sein darf, bis die Ortsdatenbasis steht (FA-PLATTFORM-03). Eine reine Funktion mit Tests beantwortet: Welche freigeschalteten Partner decken diese Postleitzahl für diese Leistung ab?
4. Lead-Verlauf: am Vorgang eine Liste „angeboten an“ mit Partner, Zeitpunkt, wer, Ergebnis (angeboten, angenommen, abgelehnt, zurückgezogen, zugeteilt) und Notiz; jede Änderung der Zuordnung schreibt einen Eintrag (Hook, nicht von Hand). Am Partnerbetrieb die Gegenansicht: alle Leads dieses Partners mit Stand. In der Liste der Vorgänge ein Filter „wartet auf Zuordnung“.
5. Betreiberanleitung `docs/betrieb/partner-pruefen.md`: Bewerbung prüfen, Prüfliste, Besuch, freischalten, pausieren, sperren, Region, Lead anbieten und zuteilen.
6. Öffentliche Partnerprofile: nicht in diesem Paket; nenne im Bericht, was dafür nötig wäre (Zustimmung der Partner).

## Schreibrechte
- src/payload/collections/Partnerbetriebe.ts, Vorgaenge.ts (nur Lead-Verlauf und Filter), src/payload/hooks/** und components/** (Partner), neue Migration (`sicher.sh --pg -- npx payload migrate:create partner_qualitaet`), src/migrations/index.ts, src/payload-types.ts, src/lib/partner/**, src/lib/auftragsweg.ts (nur der Stand `gesperrt` in der bestehenden Regel), src/lib/data/payload-mapping.ts (nur Partner), src/lib/types.ts (nur Partner-Typen), docs/betrieb/partner-pruefen.md
- zugehörige Tests; _werkstatt/ausbau/berichte/FA-PLATTFORM-01B.md
Nicht anfassen: das Partnerformular und die Seiten unter src/app/(site)/partner-werden, Zahlungs- und Auszahlungslogik (FA-KERN-03, -04) außer der genannten Zeile, Navigation, Startseite, Vertragstext (MA-29).

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`
- Tests, die nicht fehlen dürfen: Freischaltung ohne Prüfliste abgelehnt; „Besuch nicht möglich“ nur mit Grund; pausierter und gesperrter Partner nicht zuordenbar; Abdeckung nach Postleitzahl und Leistung; Lead-Verlauf schreibt je Wechsel einen Eintrag; Zugriffsrechte der neuen Felder (nur Team).
- Kein Server, kein git.

## Grenzen
G4, G5, G6, G8, G9, G13 (keine Provisionen, Vertragsinhalte oder Partnerdaten im Repository; Tests mit erfundenen Betrieben), R4, R10, R13. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-PLATTFORM-01B · BEREIT ZUR RÜCKGABE ===
