# FA-SHOP-03 · Teil A · Einsende-Varianten mit Kosten und ehrlicher Haftung

Rolle Baumeister · Stand 16.11.2026 · Anforderungen FA-13-02, -03, -04, -06, -07, -08, -10, FA-AB-01, FA-AB-02, FA-12-06, FA-12-07 (Teil A); FA-13-01, -05, -09, FA-AB-03, FA-22-25, FA-22-26 bleiben für Teil B.

## GEÄNDERTE DATEIEN

Neu:
- `src/lib/versand/varianten.ts` (Varianten als Daten, Startwerte, Empfehlung, Haftungssätze, Verpackungshinweis)
- `src/app/(site)/schluessel-einschicken/versand-variante.tsx` (eine Darstellung je Variante für Formular, Seite und Vorgangsseite)
- `src/migrations/20261116_023442_einsende_varianten.ts` und `.json` (nur additiv: drei neue Tabellen, eine neue Spalte)
- `src/payload/einsende-varianten.db.test.ts`

Geändert:
- `src/lib/types.ts` (nur Einsende-Typen: `EinsendeVariante`, `EinsendeVarianteKennung`, `Einlieferung`, `EinsendeEmpfehlung`, `EinsendeEinstellungen.varianten`, `ApprovalInfo.sendInSpecialAllowed`)
- `src/lib/versand/typen.ts`, `angebot.ts`, `begleitschein.ts`, `index.ts`, `versand.test.ts`
- `src/lib/einsenden/vorgang.ts`, `schein.ts`, `einsenden.test.ts`
- `src/lib/data/defaults/settings.ts`, `src/lib/data/payload-mapping.ts` (nur Einsenden und Freigabe-Feld)
- `content/settings.json` (nur `sendIn.varianten`)
- `src/payload/globals/Einstellungen.ts` (nur „Schlüssel einschicken“), `src/payload/collections/Vorgaenge.ts` (nur `freigabe.sonderfallVersand`), `src/payload-types.ts`, `src/payload/seed.ts`, `src/migrations/index.ts`
- `src/app/(site)/schluessel-einschicken/page.tsx`, `anmelden/page.tsx`, `anmelden/einsende-formular.tsx`
- `src/app/(site)/bestellung/[id]/page.tsx`, `foto-ergebnis.tsx`, `begleitschein/route.ts`
- `src/lib/mail/vorlagen/freigabe.ts` (Freigabe mit Einsendung), `kunde-eingang.ts` (nur Einsendung)
- `src/lib/actions/security.test.ts` (zugehöriger Test, bewusst angepasst, siehe unten)

## WAS UND WARUM

1. Varianten als Daten (A-050 Punkt 1). Im Global „Einstellungen“ → Versand → „Schlüssel einschicken“ gibt es die Liste „Versandvarianten für die Einsendung“ mit Kennung (fest: dhl-paket, einschreiben-einwurf, einschreiben-wert), Bezeichnung, Einsatz in einem Satz, Haftung in Euro (leer = nicht belegt), Sendungsverfolgung, Einlieferung (Briefkasten, Filiale, Paketshop), Porto mit Stand und Quelle (leer = nicht belegt), Aufpreis des Betriebs, „empfohlen für“ (Originalschlüssel, Autoschlüssel), „nur Sonderfall“ und aktiv. Die alten Felder (versichert, unversichert, Haftung 25 €, Porto 4,45 € und 1,80 €) bleiben unverändert lesbar und gelten nur noch für ältere Vorgänge (Begleitschein alter Vorgänge unverändert). Startwerte stehen in `STANDARD_VARIANTEN`, in `content/settings.json` und in den Defaults; leere Liste im Global ergibt die Startwerte (Datenabbildung) und wird vom Seed einmal gefüllt. Der Großbrief „unversichert“ ist als Kundenwahl entfallen; der Server nimmt „versichert“ und „unversichert“ bei neuen Einsendungen nicht mehr an.
2. Wahrheit vor Werbung (Punkt 2). Keine Variante heißt „versichert“, das Wort steht in keinem Variantentext. Jede Variante zeigt „Haftung bis N € je Sendung“; Varianten unter 100 € Haftung (Einwurf) tragen „Ein Schaden über 20 € ist nicht gedeckt. Der Wert eines Autoschlüssels liegt meist darüber.“ Dazu ein allgemeiner Satz: „Die Haftung gilt je Sendung nach den Bedingungen des Versanddienstes. Im Schadensfall ist der Wert nachzuweisen.“ „kostenlos“ steht nirgends, solange der Kunde zahlt.
3. Empfehlung (Punkt 3). Das Einsendeformular fragt im ersten Schritt die Schlüsselart (Haus-, Wohnungs- oder Briefkastenschlüssel; mechanischer Autoschlüssel oder reiner Schlüsselbart; Schlüssel mit Elektronik, nicht für Fahrzeuge) und „wertvoll oder schwer zu ersetzen“. Bei Autoschlüssel, Elektronik oder „wertvoll“ ist DHL Paket als „Empfehlung“ markiert und vorausgewählt; der Einwurf bleibt wählbar mit Warnung. Ohne Empfehlung keine Vorauswahl. Der Ausschluss mechanischer Autoschlüssel und reiner Bärte ist aufgehoben; für sie verlangt der Schritt „Nachweis“ das Foto des Fahrzeugscheins (R13) statt der Sicherungskarten-Frage. Autoschlüssel mit Transponder oder Funk verweist das Formular weiter auf den Bereich Autoschlüssel (dort gelten die Fahrzeug-Pflichtunterlagen).
4. Kosten vor Abschluss (Punkt 4). Je Variante: Porto laut Post, Aufpreis des Betriebs (oder „kein Aufpreis“) und „zusammen“ als Summe; im Versandschritt zusätzlich ein Kostenkasten für die gewählte Variante mit Stand. Ohne belegtes Porto: „Porto laut Post, bitte dort prüfen“ und keine Summe. Mit aktivem und eingerichtetem Label (heute nie, A-035): nur DHL Paket bekommt „Versandlabel von uns“, ein Aufpreis „wird mit dem Auftrag berechnet“, Briefe frankiert der Kunde selbst. Die Einsendung nach einer Freigabe ist nicht mehr fest „versichert“: Die Vorgangsseite zeigt die Varianten mit Kosten (DHL Paket als Empfehlung, Einschreiben Wert nur mit Freigabe des Teams) und je Variante einen Begleitschein-Link (`?v=`); die Route prüft die Wahl gegen das Angebot des Vorgangs, sonst gilt DHL Paket.
5. Sonderfall. Einschreiben Wert erscheint im Formular nur aufklappbar unter „Sonderfall: höhere Absicherung“ und ist nur mit bestätigtem Hinweis wählbar (Filiale, Einlieferungsbeleg, Wertgegenstand mit der Post klären); der Server prüft die Bestätigung und speichert `sonderfallBestaetigt`. Am Vorgang kann das Team den Sonderfall freigeben (neues Häkchen `freigabe.sonderfallVersand`, im Code `approval.sendInSpecialAllowed`); dann steht er auf der Vorgangsseite als normale Wahl.
6. Verpackungshinweis (Punkt 5) im Wortlaut des Inhabers („Schlüssel nicht lose in einen einfachen Papierumschlag legen, sondern gepolstert beziehungsweise stabil verpacken.“): im Versandschritt des Formulars, auf der Bestätigung im Formular, auf dem Begleitschein (Schritt 1), in der Eingangsmail der Einsendung, in der Freigabe-Mail mit Einsendung, auf der Landingpage (Beilage-Liste und Rücksendung) und auf der Vorgangsseite.
7. Texte nur dort geändert, wo die Varianten es verlangen: Abschnitt 02 der Landingpage („So schicken Sie den Schlüssel“, drei Karten), FAQ „Was kostet das Einschicken?“, Hinweis „Versand mit Sendungsverfolgung“, Begleitschein-Abschnitt der Vorgangsseite, Einsendeblock im Foto-Ergebnis und in der Freigabe-Mail.

Bewusst angepasste Tests (G8, keine Prüfung gelockert):
- `versand.test.ts`: die Erwartung „Versichert, Einschreiben 4,45 €, Haftung 25 €“ als Kundenwahl ist durch die Varianten ersetzt; die alten Felder werden weiter auf 445, 180 und 25 geprüft, der Begleitschein alter Vorgänge weiter auf „als Einschreiben (4,45 €)“.
- `einsenden.test.ts`: Testdaten von „unversichert“ auf „einschreiben-einwurf“; neu geprüft wird, dass „versichert“ und „unversichert“ abgelehnt werden. Der Test „nie ein echtes Label im Einsendeweg“ ist unverändert.
- `security.test.ts`: gültige Einsendung jetzt mit Variante und Schlüsselart; vier weitere Ablehnungsfälle (Altwerte, Sonderfall ohne Bestätigung, unbekannte Schlüsselart). Weil damit das Anfragelimit des Tests erreicht wird, setzt der Test den Zähler danach zurück, wie an fünf anderen Stellen derselben Datei.
- `formulare-bedienbarkeit.test.ts` bleibt unverändert; das Formular hält die dort geprüfte Sperre wörtlich ein und ergänzt eine zweite für den Fahrzeugschein.

Pflichttests aus dem Paket (Teil A): keine Variante heißt „versichert“ (`versand.test.ts`, „nennt keine Variante …“ und Begleitschein); Einwurf zeigt 20 € (`versand.test.ts`); Autoschlüssel wählt DHL Paket vor (`versand.test.ts`); Summe stimmt (Porto 7,69 € + Aufpreis 1,50 € = 9,19 €); Sonderfall nur mit Freigabe oder Bestätigung (`versand.test.ts`, `einsenden.test.ts`, `security.test.ts`). „Sendungsnummer in Kundenansicht und Admin“ und „ohne Vertrag kein Label-Aufruf“ gehören zu Teil B.

## PRÜFUNG UND ERGEBNIS

Alle über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 225 Dateien, 3528 Tests bestanden, 0 Fehler.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 24 Dateien, 138 Tests bestanden (darunter die neue Datei mit 3 Tests: Seed legt Varianten an, Änderung im Admin wirkt, leere Liste wird einmal gefüllt).
- `sicher.sh --json -- npm run build`: erfolgreich (Exit 0).
- Migration mit `sicher.sh --pg -- npx payload migrate:create einsende_varianten` erzeugt; nur CREATE TYPE, CREATE TABLE, ADD COLUMN, Index und Fremdschlüssel (G6).

Hinweis: Während des Laufs hat ein anderes Paket (FA-SHOP-04B, Konfigurator und `CylinderOrderDraft.herstellerAngabe` in `src/lib/types.ts`) im selben Arbeitsbaum geändert. Die Prüfungen liefen über beide Änderungen; die Migration enthält nur Felder dieses Pakets.

## BELEGE (Quelle und Stand jedes Tarifs)

Alle aus `erhebung/FA-RECHERCHE-03.md` (abgerufen 15.11.2026) und `erhebung/E1-versand.md` (abgerufen 02.11.2026). Haftungswerte 500 € und 20 € zugleich aus der Tabelle des Inhabers (FA Anhang B).
- DHL Paket bis 5 kg, Filiale oder Paketshop: 7,69 €, Haftung bis 500 €, Sendungsverfolgung inklusive. Quelle: deutschepost.de, „Leistungen und Preise“ (dp-leistungen-und-preise-sw-092026.pdf, S. 90, Metadaten „Stand 01.01.2026“) und dhl.de Preisseite national; Stufe B.
- Einschreiben Einwurf: 4,15 € = Großbrief 1,80 € (dp-preisblatt-012026.pdf, Stufe B) + Zuschlag Einwurf 2,35 € (Leistungen und Preise S. 37, Stufe B); Haftung 20 € (S. 37). Summe als Rechnung (Stufe C).
- Einschreiben Wert: 6,25 € = Großbrief 1,80 € + Zuschlag Einschreiben 2,65 € (S. 38) + Zusatzentgelt Wert 1,80 € (S. 40, Fußnote 33); Haftung bis 500 € für den nachgewiesenen Wert (S. 40); nur Filiale mit Einlieferungsbeleg. Summe als Rechnung (Stufe C).
- Im Feld „Stand“ jeder Variante steht: Bestandteile, „Deutsche Post, Leistungen und Preise (Stand 1.1.2026), geprüft am 15.11.2026“.
- Nicht übernommen: Briefkasten als Einlieferung für den Einwurf (nicht belegt, E1 „Abgabeort offen“), DHL Paket 2 kg online 6,19 € (nur einfach belegt), Transportversicherung, Päckchen.

## OFFENE FRAGEN

1. OFFENE FRAGE (R13, vor dem Commit klären): Der Server prüft den Fahrzeugschein einer Einsendung mit mechanischem Autoschlüssel noch nicht. Die Prüfung ist als reine Funktion gebaut und getestet (`einsendeNachweisPruefen` in `src/lib/einsenden/vorgang.ts`), aber `src/lib/actions/records.ts` liegt außerhalb der Schreibrechte. Nötig ist dort, direkt nach `einsendeVorgang(...)` im Einsendezweig, sinngemäß: `const fehlt = einsendeNachweisPruefen(payload, uploads, storageStatus().configured); if (fehlt) return { ok: false, notices: [], error: fehlt };` plus ein Fall in `security.test.ts`. Bis dahin erzwingt nur das Formular das Foto, und die Zusammenfassung zeigt dem Team „Nachweis: Fahrzeugschein (Pflicht)“. Alternative, falls der Orchestrator das nicht sofort freigibt: Option „mechanischer Autoschlüssel“ bis dahin aus `SCHLUESSELARTEN` nehmen.
2. OFFENE FRAGE: Einlieferung des Einschreibens Einwurf im Briefkasten (mit Internetmarke) ist nicht belegt; eingetragen ist nur „Filiale“. Der Inhaber kann „Briefkasten“ im Admin ergänzen, wenn belegt.
3. OFFENE FRAGE: Ob ein Schlüssel als Wertgegenstand für Einschreiben Wert gilt, ist nicht belegt (Recherche 03, Frage 4). Die Variante ist deshalb Sonderfall mit Hinweis „mit der Post klären“.
4. OFFENE FRAGE: Umsatzsteuer DHL Paket (Fußnoten 9 und 12 widersprechen sich) und die Formatgrenzen Großbrief für Einschreiben (Recherche 03, Fragen 2 und 5).
5. OFFENE FRAGE: Die Freigabe-Mail nennt die Haftungsbeträge 500 € und 20 € als festen Text (Vorlage ohne Einstellungen). Ändert der Inhaber die Haftung im Admin, muss der Satz mitgezogen werden.
6. OFFENE FRAGE: Der allgemeine Haftungssatz („gilt je Sendung …, Wert nachzuweisen“) ist eine sachliche Zusammenfassung der Recherche; Recherche 03 empfiehlt die rechtliche Prüfung des Haftungsversprechens (R10).

## FÜR MENSCHEN

- Inhaber: Startwerte freigeben oder im Admin ändern (Einstellungen → Versand → Schlüssel einschicken → Versandvarianten): Porto 7,69 €, 4,15 €, 6,25 €, Haftung 500 €, 20 €, 500 €, Aufpreise je Variante (Start: der bisher gepflegte Aufpreis, siehe Nachbesserung Befund 3). Eigene Preise wurden nicht geändert (G9).
- Inhaber: Entscheidung, ob Einschreiben Wert überhaupt angeboten wird; sonst Variante auf „aktiv“ aus. Auf dem Server wirkt das erst mit dem Eingriff in `records.ts` (Nachbesserung, Befunde 2 und 10).
- Inhaber oder Anwalt: Haftungssatz und Warnhinweis prüfen (R10); Hinweis in der Datenschutzerklärung erst mit echtem Label (Teil B).
- Orchestrator: Offene Frage 1 (Serverprüfung Fahrzeugschein in `records.ts`) vor dem Commit entscheiden.
- Vertragsschritte für das Label (DHL Geschäftskundenvertrag, EKP, Abrechnungsnummer, Sandbox, Produktionsfreigabe) gehören in den Bericht von Teil B.

## Stand für Teil B

Nutzbar (Namen und Dateien):
- Typen in `src/lib/types.ts`: `EinsendeVariante`, `EinsendeVarianteKennung` ('dhl-paket' | 'einschreiben-einwurf' | 'einschreiben-wert'), `EinsendeEinstellungen.varianten`, `ApprovalInfo.sendInSpecialAllowed`. `VersandArt` in `src/lib/versand/typen.ts` umfasst die Kennungen plus die Altwerte 'versichert' und 'unversichert'.
- `src/lib/versand/varianten.ts`: `STANDARD_VARIANTEN`, `variantenAus`, `varianteZu`, `istVariantenKennung`, `versandBezeichnung` (auch für Altwerte, für Admin, Vorgangsblatt und Statusmail), `haftungSatz`, `haftungWarnung`, `einlieferungSatz`, `empfehlungFuer`, `VERPACKUNG_HINWEIS`, `PORTO_UNBELEGT`, `HAFTUNG_HINWEIS`, `SONDERFALL_HINWEIS`, `SCHLUESSELARTEN`, `brauchtFahrzeugschein`.
- `src/lib/versand/angebot.ts`: `einsendeAngebot(e, labelEingerichtet, { empfehlung, sonderfallFrei })` liefert je Option `label: true` nur für 'dhl-paket' bei aktivem und eingerichtetem Label (Konstante `LABEL_VARIANTE`), `varianteWaehlbar`.
- `src/lib/einsenden/schein.ts`: `versandDesVorgangs(vorgang, gewaehlt?)`, `einsendeAngebotFuerWeg(e, fall)`, `einsendeAngebotFuerVorgang(vorgang, e)`, `begleitscheinZumVorgang(vorgang, { …, versand })`. `einsendeAngebotFuerWeg` ruft das Angebot weiter mit `labelEingerichtet = false` auf (A-035); Teil B schaltet hier um, sobald das Label gespeichert wird.
- `src/lib/einsenden/vorgang.ts`: `EinsendePayload.versand`, `.schluesselart`, `.wertvoll`, `.sonderfallBestaetigt`; `einsendeVorgang(roh, contact, varianten?)`; `einsendeNachweisPruefen`.
- Datenbank: `einstellungen_einsenden_varianten` (mit Untertabellen für Einlieferung und Empfehlung), `vorgaenge.freigabe_sonderfall_versand`.
- Vorgangsseite: Begleitschein-Abschnitt in `src/app/(site)/bestellung/[id]/page.tsx` mit `versandAngebot` und `gewaehlteVariante`; Route `begleitschein/route.ts` nimmt `?v=`.

Fehlt noch (Teil B):
- Die gewählte Variante der Freigabe-Einsendung wird nicht am Vorgang gespeichert (nur im Begleitschein-PDF). Speichern zusammen mit der Sendungsnummer über den signierten Zugang.
- Feld und Formular für die Sendungsnummer des Kunden (Sendung zur Werkstatt), Anzeige in Kundenauftrag, Admin, Vorgangsblatt und Statusmail; Ablage einer Labeldatei im Admin.
- Zweiter, abgeschalteter Anschluss DHL-Paket-Label für Geschäftskunden in `src/lib/versand` mit Sandbox-Adresse und Attrappe; Anzeige im Admin, welcher Weg aktiv ist und was fehlt; Test „ohne Vertrag kein Label-Aufruf“.
- Status der Einsendung „unterwegs zu uns“ (mit Sendungsnummer) in `EINSENDE_STATUS` und Kundenstatus.
- Serverprüfung Fahrzeugschein in `records.ts` (offene Frage 1), falls nicht vorher erledigt.

## Nachbesserung (16.11.2026, nach zwei Gegenprüfungen)

Alle 14 Befunde am Code geprüft; alle treffen zu. Behoben im Rahmen der Schreibrechte, was dort geht; der Rest steht unten als fertiger Eingriff für den Orchestrator (`src/lib/actions/records.ts`, `src/lib/mail/versand.ts`, `src/lib/wege/naechste-schritte.ts`, `src/app/(site)/schluessel-nach-vorlage/page.tsx`, `content/rubriken.json`, `src/lib/data/defaults/rubriken.ts` liegen außerhalb).

Je Befund:
1. [rot] Fahrzeugschein ohne Serverprüfung: **behoben (sicher voreingestellt), Aufruf in `records.ts` offen.** `einsendeVorgang` hat einen vierten Parameter `nachweis` (`EinsendeNachweis`: Uploads, Ablage-Stand) und ruft `einsendeNachweisPruefen` selbst auf; ohne Nachweis lehnt sie einen mechanischen Autoschlüssel immer ab (`{ ok: false, fehler }`). Damit nimmt der Server heute keinen Autoschlüssel ohne Fahrzeugschein an, auch nicht bei direktem Aufruf (neuer Fall in `security.test.ts` über `submitRecord`). Damit das Formular keine Wahl anbietet, die der Server ablehnt, zeigt es bis zum Eingriff nur `SCHLUESSELARTEN_IM_FORMULAR` (ohne „mechanischer Autoschlüssel“; Schrittprüfung ebenso). Zum Einschalten: Eingriff A unten.
2. [gelb] Varianten der Einstellungen nicht auf dem Server: **trifft zu, Eingriff A** (nur in `records.ts` möglich, weil die Einstellungen dort asynchron geladen werden; `einsendeVorgang` bleibt rein). Der Standardwert bleibt, damit `records.ts` bis dahin übersetzt; der Kommentar nennt ihn nur noch Vorgabe für Tests und ältere Aufrufer.
3. [gelb] Aufpreis startet still bei 0 €: **behoben.** `variantenAus` übernimmt ohne gepflegte Liste den bisherigen Aufpreis (`altAufpreis`: DHL Paket und Einschreiben Wert aus „versichert“, Einwurf aus „unversichert“); ebenso die Datenabbildung (`variantenZuSeite`) und der Seed beim ersten Füllen (`mitAltAufpreis` in `seed.ts`). Tests in `versand.test.ts` und `einsende-varianten.db.test.ts` (Aufpreis 2 € und 1 € werden 200, 100, 200 Cent).
4. [gelb] Haftungsbeträge als fester Text: **behoben in Formular, FAQ und Freigabe-Mail.** Formular: Empfehlung bei „wertvoll“ aus dem Angebot der Einstellungen (Name und Haftungssatz). FAQ: Haftung des Einwurfs aus den Varianten. Freigabe-Mail: neue Funktion `versandZeile`; Beträge nur, wenn der Kontext die Einstellungen trägt (`VorlagenKontext.sendIn`, additiv), sonst ohne Betrag mit Verweis auf die Vorgangsseite. Test in `src/lib/mail/freigabe.test.ts`. Damit die Mail Beträge nennt, Eingriff B.
5. [gelb] „gepolsterter Umschlag … bei der Post“: **Status behoben, Schritte über den Orchestrator.** `EINSENDE_STATUS.neu`: „Bitte legen Sie den Begleitschein Ihrer Sendung bei.“ `SCHRITTE_EINSENDUNG` liegt außerhalb: Eingriff C.
6. [gelb] „versicherten … Versand“ auf „Schlüssel nach Vorlage“: **trifft zu, außerhalb der Schreibrechte**, Eingriff D.
7. [gelb] Hub-Ablauf „in einen Umschlag“: **trifft zu, außerhalb der Schreibrechte**, Eingriff E.
8. [gelb] Mit Label „das Porto zahlt SCHLÜSSELMACHER24“: **behoben.** Mit Label nennt die Seite Porto plus Aufpreis als Betrag, der „mit dem Auftrag berechnet“ wird (`summeCents = portoCents + aufpreisCents`); ohne belegtes Porto „die Versandkosten werden mit dem Auftrag berechnet“. Der Satz zur Kostenübernahme ist entfernt; die Seite sagt „die Versandkosten werden mit dem Auftrag berechnet“. Test in `versand.test.ts`. Pflichtpunkt für Teil B: Eine Übernahme des Portos nur mit ausdrücklicher Freigabe des Inhabers.
9. [rot] R13 auf dem Server, falscher Kommentar: **behoben wie 1.** Kommentar an `einsendeNachweisPruefen` berichtigt; der eigene Test, der `ok: true` ohne Upload bestätigte, prüft jetzt das Gegenteil.
10. [rot] Varianten nur gegen Startwerte: **trifft zu, Eingriff A** (wie 2). Die Anleitung unter FÜR MENSCHEN ist ergänzt: „aktiv aus“ wirkt auf dem Server erst nach Eingriff A.
11. [gelb] Testtitel verspricht zu viel: **behoben.** Titel „einsendeNachweisPruefen verlangt …“; eigener Test für `einsendeVorgang` mit und ohne Nachweis; der Absendeweg ist in `security.test.ts` geprüft.
12. [gelb] `sonderfallBestaetigt` ohne Häkchen: **behoben.** `payloadAus` setzt die Bestätigung nur mit `sonderfall && d.sonderfallBestaetigt`.
13. [gelb] Eingangsmail mit Standardnamen: **behoben, wirksam mit Eingriff B.** `kundeEingang` ruft `versandBezeichnung(…, kontext.sendIn)`; die vom Server gebaute Zusammenfassung nennt den Namen aus den übergebenen Varianten (`einsendeZusammenfassung(…, varianten)`), die Vorschau im Formular ebenso. Test in `einsenden.test.ts`.
14. [gelb] Haftungsbeträge in Mail und FAQ: **behoben wie 4.**

Zusätzlich geändert: `src/lib/mail/vorlagen/gemeinsam.ts` (nur das optionale Feld `sendIn` im Kontext), `src/lib/mail/freigabe.test.ts` (zugehöriger Test).

### Eingriffe für den Orchestrator (außerhalb der Schreibrechte)

A (rot, vor dem Commit; Befunde 1, 2, 9, 10) · `src/lib/actions/records.ts`, Einsendezweig:
```ts
import { variantenAus } from '@/lib/versand/varianten';
// …
  if (einsendung) {
    const varianten = variantenAus((await getSettings()).sendIn);
    const vorgang = data.area === 'schluessel-nach-vorlage'
      ? einsendeVorgang(payload, data.contact, varianten, { uploads, ablageEingerichtet: storageStatus().configured })
      : null;
    if (!vorgang?.ok) {
      return { ok: false, notices: [], error: (vorgang && !vorgang.ok && vorgang.fehler) || INVALID_INPUT };
    }
```
Danach in `src/lib/versand/varianten.ts` den Filter von `SCHLUESSELARTEN_IM_FORMULAR` aufheben (`= SCHLUESSELARTEN`), damit der Kunde mechanische Autoschlüssel wieder wählen kann (A-050 Punkt 3). Tests in `security.test.ts` ergänzen: auto-mechanisch mit Upload `fahrzeugschein` ergibt `ok: true`; eine in den Einstellungen deaktivierte Variante (`aktiv: false`) und eine zum Sonderfall erklärte Variante ohne Bestätigung ergeben `ok: false`.

B (gelb; Befunde 4, 13, 14) · `src/lib/mail/versand.ts`:
```ts
export function vorlagenKontext(settings?: Pick<Settings, 'company' | 'sendIn'>): VorlagenKontext {
  return { site: ohneSchraegstrich(getSiteUrl()), firma: settings?.company, sendIn: settings?.sendIn };
}
```

C (gelb; Befund 5) · `src/lib/wege/naechste-schritte.ts`, `SCHRITTE_EINSENDUNG[0].text`: „Drucken Sie den Begleitschein aus und legen Sie ihn dem Schlüssel bei. Verpacken Sie alles gepolstert und stabil und geben Sie es wie gewählt bei der Post oder DHL ab.“

D (gelb; Befund 6) · `src/app/(site)/schluessel-nach-vorlage/page.tsx` (Alert „Versandweg“): „Wählen Sie einen Versand mit Sendungsverfolgung und einer Haftung, die zum Wert Ihres Schlüssels passt. Die Varianten mit Haftung und Kosten finden Sie unter Schlüssel einschicken.“ mit Link auf `/schluessel-einschicken`.

E (gelb; Befund 7) · `content/rubriken.json` und `src/lib/data/defaults/rubriken.ts`, Ablauf „Einschicken“, gleichlautend: „Schlüssel gepolstert und stabil verpacken, Begleitschein beilegen, abschicken.“

### Prüfung nach der Nachbesserung (über die Datenweiche)
- `sicher.sh --json -- npx vitest run`: 226 Dateien, 3546 Tests bestanden, 0 Fehler.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 24 Dateien, 139 Tests bestanden (neu: Seed übernimmt den bisherigen Aufpreis).
- `sicher.sh --json -- npm run build`: erfolgreich (Exit 0).

## ABNAHME (Orchestrator, 16.11.2026)

- **Prüfkette grün** (`werkzeuge/abnahme.sh FA-SHOP-03`, zweiter Lauf nach den Eingriffen, Build mit `SM24_INDEXIERUNG=an`): Typprüfung, Lint, Unit 3.552 Tests in 227 Dateien, Datenbanktests 139 in 24 Dateien (mit der Migration `20261116_023442_einsende_varianten`, rein additiv), Build ohne Datenbank 178 von 178 Seiten. Der Lauf deckt auch FA-SHOP-04B und FA-INHALT-03I ab. Onpage-Messung: 135 Seiten, Median 100,0, kein Befund.
- **Eingriffe A bis E eingebaut** (lagen außerhalb der Schreibrechte des Pakets): Der Einsendezweig in `src/lib/actions/records.ts` übergibt die Varianten aus den Einstellungen und den Nachweis; alle Schlüsselarten stehen wieder im Formular; `vorlagenKontext` reicht `sendIn` an die Mails; Wortlaut in `naechste-schritte.ts`, auf „Schlüssel nach Vorlage“ (Alert „Versandweg“ ohne „versichert“, mit Verweis auf die Varianten) und im Ablauf der Rubrik.
- **Gegenprüfung der Eingriffe durch zwei unabhängige Prüfer** (einer mit dem Auftrag, die Serverprüfung zu umgehen): Beide fanden dieselbe echte Lücke. Bei eingerichteter Dateiablage bestätigte der Server die Uploads einer Einsendung nicht gegen die gespeicherten Dateien, weil die Einsendung keinen Unterlagen-Weg hat. Ein erfundener Verweis mit der Kategorie „fahrzeugschein“ genügte; dieselbe Schwäche bestand schon vorher bei der Sicherungskarte der Einsendung. **Geschlossen:** Der Server bestätigt jetzt auch bei der Einsendung jede Datei über `unterlagenAusAblage`; das Fahrzeugschein-Feld des Formulars lädt mit dem Steckplatz hoch, den der Vorgang nennt. Der neue Test „glaubt bei eingerichteter Dateiablage keinem erfundenen Nachweis einer Einsendung“ schlägt ohne die Korrektur fehl und besteht mit ihr (erfundene Kennung, Angabe ohne Datei, Datei falscher Art, echte Datei; ebenso für die Sicherungskarte).
- **Weitere Befunde der Gegenprüfung behoben:** Der Begleitschein einer Freigabe nimmt ohne gültige Wahl die Empfehlung des Angebots und nie eine abgeschaltete Variante (`versandWahl`, Test); bietet der Betrieb keine an, entsteht keiner. Die Antwort „Was kostet das Einschicken?“ entsteht aus den Varianten der Einstellungen mit Name, Porto, Aufpreis, Summe und Haftung (`kostenAntwort`, Test); der Sonderfall-Hinweis nennt keinen festen Namen mehr. „Umschlag“ heißt auf Begleitschein, Seite und Formular „Sendung“. Ein Ablehnungsfall im Server-Test lief am Anfragelimit statt an der Prüfung; der Zähler wird jetzt je Fall zurückgesetzt, und der Test prüft, dass nicht das Limit ablehnt.
- **Browserprobe** (Chromium 390 × 844, Uploads abgefangen, nichts abgesendet): 15 von 15. „Mechanischer Autoschlüssel oder reiner Schlüsselbart“ wird angeboten und nennt den Fahrzeugschein schon bei der Auswahl; ohne Foto ist „Weiter“ gesperrt; die Varianten zeigen Haftung als Zahl, Porto, Aufpreis und Summe; DHL Paket ist vorausgewählt und als Empfehlung gekennzeichnet; der Einwurf zeigt die Warnung; der Verpackungshinweis steht da; kein „versichert“ allein, kein „kostenlos“; keine Fehler in der Konsole.
- **Offen und bewusst so:** kein Label (kein Vertrag, MA-08), Sendungsnummer des Kunden und Status „unterwegs“ folgen in Teil B. Die Freigabe-Mail nennt Haftungsbeträge jetzt aus den Einstellungen.
- **Für Menschen:** MA-50 (Startwerte bestätigen, Einschreiben Wert anbieten oder nicht, Haftungssatz anwaltlich prüfen, offene Punkte der Recherche, Portoübernahme im Label-Betrieb).
