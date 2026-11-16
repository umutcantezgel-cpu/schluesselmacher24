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

## Stand nach Teil A und Zusätze aus der Bestandsaufnahme (vom Orchestrator, 16.11.2026)
- Teil A ist abgenommen (Commit „DATEN [FA-PLATTFORM-01] [FA-SHOP-02C] …“). Lies `berichte/FA-PLATTFORM-01.md`, Abschnitte „Stand für Teil B“, „Nachbesserung“ und „Abnahme“, und ENTSCHEIDUNGEN A-064. Nutzbar sind unter anderem `src/lib/partner/leistungen.ts` (neun Leistungen, Sammelwert, `decktAuftragsart`, `provisionsEintragWaehlen`), `src/payload/hooks/partner-bewerbung.ts`, `darfVermitteln` in `src/lib/partner/vermittlung.ts` und die neuen Felder am Partnerbetrieb (Postleitzahl, Werkstatt, Geräte, Erfahrung).
- Die Migration von Teil A heißt `partner_qualitaet`. Deine Migration heißt `partner_pruefung` (`sicher.sh --pg -- npx payload migrate:create partner_pruefung`). Nur additiv (G6); lies das erzeugte `up` und nimm heraus, was nicht zu diesem Paket gehört.
- Zusatz 7 (Sammelwert auflösen, offene Frage aus Teil A): Der Server setzt an jedem Autoschlüssel-Auftrag den Sammelwert „Autoschlüssel allgemein“. Ordne die gebuchte Leistung des Auftrags (Leistungen des Assistenten, `content/car-key-services.json`) einer der neun Leistungen zu, an einer Stelle mit Test (`src/lib/partner/leistungen.ts`; in `src/lib/auftragsweg.ts` und `src/payload/hooks/vermittlung.ts` nur die Stelle, die die Auftragsart setzt). Lässt sich eine Leistung nicht eindeutig zuordnen, bleibt der Sammelwert. Bestehende Vorgänge werden nicht umgeschrieben. Danach deckt ein Partner einen Auftrag nur noch ab, wenn er diese Leistung führt; für Vorgänge mit Sammelwert gilt die Regel aus Teil A weiter. Die Regel für den Provisionsvorschlag (A-064) bleibt.
- Zusatz 8 (FA-07-03): Die Partnerseiten sagen zu, dass der Kunde vor dem Einsatz erfährt, welcher Betrieb ausführt und sein Vertragspartner ist (`src/lib/partner/gewinnung.ts`). Dafür fehlt die Mitteilung. Baue eine Nachrichtenvorlage „Ihr ausführender Betrieb“ mit Firma und Ort des Partnerbetriebs in `src/lib/mail/nachricht-vorlagen.ts` (Schreibrecht nur für diese Vorlage) und einen Hinweis am Vorgang, solange sie beim Stand „angenommen“ noch nicht versandt ist. Kein automatischer Versand, keine echte Mail (G5); der Text nennt keine Zusagen zu Preis oder Frist. Test dazu.
- Zusatz 9 (FA-07-01): Am Vorgang steht neben dem Verweis auf den Partnerbetrieb weiter das Altfeld `vermittlung.partner` mit dem Etikett „Partnerbetrieb“, das auf den Bewerbungs-Vorgang zeigt. Benenne es im Admin „Bewerbung (alt)“, nur lesbar, und blende es aus, wenn ein Partnerbetrieb gesetzt ist. Additiv, ohne Datenverlust.
- Umkreis: Es gibt keine Geodaten zur Postleitzahl; die Abdeckungsfunktion wertet Postleitzahlen-Muster aus. Den Umkreis wertest du nicht aus (das kann erst die Ortsdatenbasis aus FA-PLATTFORM-03); der Hinweis „Ohne Postleitzahlen keine Zuordnung“ bleibt.
- „Service vor Ort“ für Tür, Schloss und Zylinder nennt seit der Abnahme von Teil A keinen Partner mehr. Nichts daran ändern.

## Schreibrechte
- src/payload/collections/Partnerbetriebe.ts, Vorgaenge.ts (nur Lead-Verlauf, Filter, der Hinweis aus Zusatz 8 und das Altfeld aus Zusatz 9), src/payload/hooks/** und components/** (Partner), neue Migration (`sicher.sh --pg -- npx payload migrate:create partner_pruefung`), src/migrations/index.ts, src/payload-types.ts, src/lib/partner/**, src/lib/auftragsweg.ts (nur der Stand `gesperrt` in der bestehenden Regel und die Stelle aus Zusatz 7), src/lib/mail/nachricht-vorlagen.ts (nur die Vorlage aus Zusatz 8), src/lib/data/payload-mapping.ts (nur Partner), src/lib/types.ts (nur Partner-Typen), docs/betrieb/partner-pruefen.md
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
