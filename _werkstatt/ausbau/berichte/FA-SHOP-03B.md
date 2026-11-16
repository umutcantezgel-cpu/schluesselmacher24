# FA-SHOP-03B · Bericht: Sendungsnummer durch den Kunden, vorbereiteter Label-Anschluss, Status der Einsendung

Stand 16.11.2026 · Rolle Baumeister · Anforderungen FA-13-07 bis FA-13-10, FA-22-25, FA-22-26 · Entscheidung A-050 (Punkte 6 bis 8)

## GEÄNDERTE DATEIEN

Neu:
- `src/lib/einsenden/sendung.ts`: Sendungsnummer prüfen und bereinigen, eintragen (`sendungsnummerAnwenden`), Kundenansicht (`kundenEinsendeSendung`), Stand der Einsendung (`einsendeStand`, `einsendeKundenStatus`, `EINSENDE_UNTERWEGS`), Regel `sendungErwartet`.
- `src/lib/einsenden/aktion.ts`: Server-Aktion `sendungsnummerEintragen` (signierter Zugang, Begrenzung der Versuche).
- `src/app/(site)/bestellung/[id]/sendungsnummer-formular.tsx`: Formular auf der Vorgangsseite.
- `src/lib/versand/dhl-paket.ts`: zweiter, abgeschalteter Anschluss DHL Paket für Geschäftskunden (Versenden-API v2, Sandbox-Adresse).
- `src/lib/versand/label-weg.ts`: `labelWegStand` (welcher Weg aktiv ist, was fehlt).
- `src/migrations/20261116_033126_einsende_sendung.ts` und `.json` (über `sicher.sh --pg -- npx payload migrate:create einsende_sendung`, rein additiv).
- `docs/betrieb/einsendung-pflegen.md`.
- Tests: `src/lib/einsenden/sendung.test.ts`, `src/lib/einsenden/aktion.test.ts`, `src/lib/versand/dhl-paket.test.ts`, `src/payload/einsende-sendung.db.test.ts`.

Geändert:
- `src/lib/types.ts`: Typ `EinsendeSendung`, Feld `BusinessRecord.einsendeSendung` (nur diese).
- `src/lib/data/payload-mapping.ts`: `einsendeSendung` in `VorgangsAenderung`, Abbildung hin und zurück, Teiländerung (nur diese Gruppe).
- `src/payload/collections/Vorgaenge.ts`: Reiter „Versand“, neue Gruppe „Sendung des Kunden zur Werkstatt“ (`einsendeSendung`: Sendungsnummer mit Prüfung und Bereinigung, Dienstleister, Variante, eingetragen am, eingetragen von, Labeldatei als Verweis auf `interne-dateien`), nur bei „Schlüssel nach Vorlage“.
- `src/payload/globals/Einstellungen.ts` (nur „Schlüssel einschicken“): Anzeige „Aktiver Versandweg“ (virtuell, ohne Spalte); Beschriftung des Schalters von „Retourenlabel aktiv (Kosten trägt der Betrieb)“ zu „Versandlabel aktiv (nur mit Vertrag und Zugang)“ mit Hinweis „Die Kosten für das Label werden mit dem Auftrag berechnet“.
- `src/payload-types.ts` (über `payload generate:types`, nur die neuen Felder), `src/migrations/index.ts`.
- `src/lib/versand/index.ts`, `src/lib/versand/typen.ts`: Anbieter `dhl-paket`, Auswahl, `labelEingerichtet`, Ausgabe von `labelWegStand`.
- `src/lib/einsenden/schein.ts`: `begleitscheinAnzeigen` nutzt `sendungErwartet`; der Begleitschein der Freigabe nimmt ohne `?v=` die mit der Nummer gespeicherte Variante.
- `src/app/(site)/bestellung/[id]/page.tsx`: Abschnitte „Ihre Sendung an uns“ (Nummer, Dienstleister, Variante, Verfolgungslink, Formular) und „Stand Ihrer Einsendung“; Kopfstatus über `einsendeKundenStatus`.
- `src/lib/mail/vorlagen/status.ts`: Statusmail nennt „Ihre Sendung an uns“ neben der Rücksendung.
- `src/lib/pdf/vorgangsblatt.ts`: „Sendung zur Werkstatt (Dienstleister)“ und „Sendungsnummer Rücksendung“ getrennt.
- `_werkstatt/ausbau/berichte/FA-SHOP-03B.md` (dieser Bericht).

## WAS UND WARUM

1. **Sendungsnummer (Punkt 6).** Neue Gruppe `einsendeSendung` am Vorgang, getrennt von der Rücksendung (`versand`). Der Kunde trägt die Nummer auf der Vorgangsseite ein. Zugang wie „Jetzt bezahlen“: Link-Schlüssel des Vorgangs, unter der Sperre des Vorgangs erneut geprüft (`vorgangAendern`); unbekannter Vorgang und falscher Schlüssel geben dieselbe Meldung. Begrenzung über `LIMITS.status` (dieselbe Regel wie Statusabruf und Kundenbestätigung; eine eigene Regel läge in `rate-limit.ts`, außerhalb der Schreibrechte). Eintragen geht nur, solange wir die Sendung erwarten (Einsendung im Status „neu“, Freigabe mit Einsendung in „freigegeben“ oder „in Fertigung“, dieselbe Regel wie der Begleitschein); danach ist der Zugang für diese Aktion abgelaufen. Eingabe: Leerzeichen, Bindestriche, Punkte, Schrägstriche fallen weg, Großbuchstaben, nur A bis Z und 0 bis 9, 8 bis 40 Zeichen. Dienstleister folgt der Variante (DHL Paket: DHL, Einschreiben: Deutsche Post). Bei der Freigabe mit Einsendung wird die gewählte Variante mitgespeichert (Stand Teil A, „Fehlt noch“, erster Punkt); sie muss eine sein, die die Seite anbietet (Sonderfall nur mit Freigabe des Teams). Der Kundenverlauf vermerkt Eintrag und Änderung. Im Admin kann das Team die Nummer nachtragen (gleiche Prüfung, beim Speichern bereinigt) und eine Labeldatei als interne Datei ablegen. Die Nummer steht auf der Vorgangsseite, im Admin, im Vorgangsblatt und in der Statusmail. Teiländerungen schreiben die Labeldatei nicht mit; der Datenbanktest zeigt, dass sie dabei erhalten bleibt.
2. **Label-Anschluss (Punkt 7).** `src/lib/versand/dhl-paket.ts` baut den Auftrag für die Versenden-API (Absender Kunde, Empfänger Werkstatt, Abrechnungsnummer, Vorgangsnummer als Referenz, nur national) gegen die Sandbox-Adresse aus der Recherche. Anbieter nur mit `VERSAND_PROVIDER=dhl-paket`, Schalter und vollständigem Zugang (`DHL_API_KEY`, `DHL_USER`, `DHL_PASSWORD`, `DHL_PAKET_ABRECHNUNGSNUMMER` mit 14 Ziffern; optional `DHL_PAKET_API_BASIS`, `DHL_PAKET_PRODUKT`). Das Label ist nie „kostenlos“ (Kosten mit dem Auftrag, R9). Die Seiten zum Einschicken erzeugen weiter nur den Begleitschein (`ohneLabel` in `schein.ts`), und `einsendeAngebotFuerWeg` bleibt bei `labelEingerichtet = false`: Jeder Abruf schüfe sonst ein neues Label, und das Speichern des Labels am Vorgang setzt Vertrag und Sandbox-Prüfung voraus. Im Admin steht unter Einstellungen › Versand › Schlüssel einschicken das Feld „Aktiver Versandweg“: aktiver Weg, was für das DHL-Paket-Label fehlt (nur Namen von Variablen), der Hinweis, dass die Seiten bis zur Ablage des Labels beim Begleitschein bleiben, und dass eine Portoübernahme nur mit Freigabe des Inhabers kommt.
3. **Pflichtpunkt aus Teil A.** Kein Schalter für eine Portoübernahme. Die alte Beschriftung „Kosten trägt der Betrieb“ am Schalter widersprach dem; sie ist ersetzt (nur Beschriftung, Verhalten unverändert).
4. **Status der Einsendung (Punkt 8).** Vorhandene Stände genutzt, nur „unterwegs zu uns“ ergänzt: Einsendung in „neu“ mit Sendungsnummer. Die Vorgangsseite zeigt die Schritte Angemeldet · Unterwegs zu uns (nur mit Nummer) · Eingegangen · Geprüft, Angebot · In Fertigung · Rückversand (mit Sendungsnummer der Rücksendung). Storniert und nicht möglich zeigen keine Schritte; dort spricht der Statustext.
5. **Betreiberanleitung** `docs/betrieb/einsendung-pflegen.md`: wo die Nummern stehen, was das Team je Schritt einträgt, Labeldatei, aktiver Versandweg.

### Eingriff für den Orchestrator (außerhalb der Schreibrechte)

F (gelb) · `src/lib/actions/booking.ts`, Statusabruf (Terminstatus): Damit dort derselbe Stand „Unterwegs zu uns“ erscheint wie auf der Vorgangsseite:
```ts
import { einsendeKundenStatus } from '@/lib/einsenden/sendung';
// …
  const anzeige = einsendeKundenStatus(record);
```
Ohne den Eingriff zeigt der Statusabruf weiter „Angemeldet“, bis der Schlüssel eingeht. Nichts ist falsch, nur weniger genau.

## PRÜFUNG UND ERGEBNIS

Alle Läufe über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 230 Dateien, 3584 Tests bestanden, 0 Fehler (neu: 32 Tests in 3 Dateien).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 25 Dateien, 141 Tests bestanden (neu: `einsende-sendung.db.test.ts`, 2 Tests, mit der Migration `20261116_033126_einsende_sendung`).
- `sicher.sh --json -- npm run build`: erfolgreich (Exit 0).

Pflichttests:
- Sendungsnummer erscheint in Kundenansicht und Admin: `sendung.test.ts` („erscheint in der Kundenansicht …“, „steht im Admin als eigene Gruppe …“, „kommt im Admin an und zurück …“), dazu Vorgangsblatt und Statusmail; Datenbank: `einsende-sendung.db.test.ts`.
- Fremder oder abgelaufener Zugang kann keine Nummer setzen: `aktion.test.ts` (Schlüssel eines anderen Vorgangs, unbekannter Vorgang, falscher Schlüssel, Status „in Prüfung“ und „storniert“) und `sendung.test.ts`.
- Ohne Vertrag kein Label-Aufruf: `dhl-paket.test.ts` (sieben Fälle ohne Zugang, Schalter oder Anbieterwahl: `fetch` nie aufgerufen; die Seiten rufen auch mit vollständigem Zugang kein Label ab).
- „Unterwegs zu uns“ nur mit Sendungsnummer: `sendung.test.ts`.

## OFFENE FRAGEN

1. Produktcode `V01PAK`, Gewicht 500 g, Profil `STANDARD_GRUPPENPROFIL`, Abfrageparameter und Antwortfelder der Versenden-API stammen aus der öffentlichen Beschreibung; der Volltext war in der Recherche gesperrt (FA-RECHERCHE-03, Stufe C). Vor dem Livegang in der Sandbox prüfen; der Produktcode ist über `DHL_PAKET_PRODUKT` einstellbar.
2. Anmeldung: Der Anschluss nutzt wie die Retoure Basic Auth mit `dhl-api-key`. Laut Suchtreffer empfiehlt DHL künftig OAuth2 (FA-RECHERCHE-03). Mit dem Entwicklerportal abgleichen.
3. „Abgelaufener Zugang“: Der Link-Schlüssel des Vorgangs hat im Bestand kein Ablaufdatum. Ich habe „abgelaufen“ als „Sendung wird nicht mehr erwartet“ umgesetzt (nach Eingang, Storno, ohne Einsendung). Soll der Schlüssel selbst ablaufen, ist das eine Änderung an `access-token.ts` für alle Kundenaktionen.
4. Eigene Ratenregel für die Sendungsnummer? Heute `LIMITS.status` (20 in 10 Minuten).
5. Label wirklich erzeugen und am Vorgang ablegen (einmal je Vorgang, Datei in `interne-dateien`, Nummer automatisch eintragen) ist bewusst nicht gebaut; erst mit Vertrag und Sandbox-Prüfung. Danach erst `einsendeAngebotFuerWeg` auf `labelEingerichtet(...)` umstellen.

## FÜR MENSCHEN

Schritte zum DHL-Paket-Label (Inhaber, MA-08):
1. Geschäftskundenvertrag mit DHL für DHL Paket abschließen; EKP und die 14-stellige Abrechnungsnummer erhalten (Voraussetzung laut DHL in der Regel ab etwa 200 Sendungen im Jahr, E1-versand Abschnitt 5).
2. Im DHL-Entwicklerportal eine App anlegen und den API-Schlüssel holen; im Geschäftskundenportal einen Benutzer für die Schnittstelle anlegen.
3. Zuerst Sandbox: Variablen in Vercel nur für eine Vorschau setzen (`VERSAND_PROVIDER=dhl-paket`, `DHL_API_KEY`, `DHL_USER`, `DHL_PASSWORD`, `DHL_PAKET_ABRECHNUNGSNUMMER`), Testlabel erzeugen und Produktcode, Gewicht und Antwort prüfen (Offene Fragen 1 und 2).
4. Danach den Ausbau „Label einmal erzeugen und am Vorgang speichern“ beauftragen (Offene Frage 5); erst dann den Schalter „Versandlabel aktiv“ setzen und `DHL_PAKET_API_BASIS` auf die Produktionsadresse stellen.
5. Entscheiden, ob der Betrieb das Porto im Label-Betrieb übernimmt (MA-50, Frage 5). Bis dahin werden die Kosten mit dem Auftrag berechnet.

Weiter:
- Eingriff F (Statusabruf) einbauen oder bewusst lassen.
- Die neue Anleitung `docs/betrieb/einsendung-pflegen.md` dem Team geben.

## Nachbesserung

Stand 16.11.2026, nach zwei Gegenprüfungen (7 Befunde, 1 und 6 sowie 3 und 7 betreffen dieselbe Sache).

1. **[rot] Eingetragen am/von bei Eintrag durch das Team: behoben.** Die Gruppe `einsendeSendung` in `Vorgaenge.ts` hat einen `beforeChange`-Hook. Ändert ein Benutzer im Admin (`req.user`, nicht `sm24System`) die Nummer, setzt er `eingetragenAm` auf jetzt und `eingetragenVon` auf „team“, füllt einen leeren Dienstleister aus der Variante (bei der Einsendung aus der Wahl im Formular) und schreibt einen Eintrag in den Verlauf („Sendungsnummer Ihrer Sendung an uns eingetragen/geändert: …“). Gelöschte Nummer leert Zeitpunkt und Herkunft. Speichern ohne Änderung der Nummer lässt beides stehen. Die Logik liegt als reine Funktion `teamSendungAenderung` in `src/lib/einsenden/sendung.ts`. Tests: drei Fälle in `sendung.test.ts`, dazu in `einsende-sendung.db.test.ts` „berichtigt das Team die Nummer des Kunden …“ (Team, neuer Zeitpunkt, Dienstleister aus der Variante, Verlaufseintrag; Speichern ohne Änderung behält die Angaben). Die Anleitung `docs/betrieb/einsendung-pflegen.md` nennt das jetzt.
2. **[gelb] Statusabruf zeigt „Angemeldet“ statt „Unterwegs zu uns“: behoben (Eingriff F übernommen).** `src/lib/actions/booking.ts` nutzt `einsendeKundenStatus` und gibt `sendungZuUns` (aus `kundenEinsendeSendung`, mit Variante aus den Einstellungen) zurück; `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx` zeigt die Zeile „Ihre Sendung an uns“ mit Nummer und Verfolgungslink. Beide Dateien liegen außerhalb der ursprünglichen Schreibrechte; der Eingriff war im Bericht vorgeschlagen und ist im Nachbesserungsauftrag verlangt. Test: `statusabruf.test.ts` („nennt mit Sendungsnummer zur Werkstatt „Unterwegs zu uns“ …“; ohne Nummer kein `sendungZuUns`).
3. **[gelb] Leeres Variantenangebot sperrt das Formular: behoben** (zusammen mit 7). Neue Regel `nummerEintragWeg` in `sendung.ts`: bei der Freigabe mit Einsendung ohne angebotene Variante zeigt die Vorgangsseite kein Formular, sondern den Satz mit Link zur Kontaktseite. Die Serverprüfung bleibt unverändert streng.
4. **[gelb] Vorauswahl der Variante unabhängig vom Begleitschein: behoben.** Ohne gespeicherte Wahl gibt es keine Vorauswahl mehr; die Auswahl beginnt mit „Bitte wählen“, der Knopf bleibt bis zur Wahl gesperrt, und der Hinweis lautet „Wählen Sie dieselbe Art wie auf Ihrem Begleitschein.“ Eine schon gespeicherte Wahl bleibt vorausgewählt.
5. **[gelb] „Retourenlabel“ neben „Versandlabel aktiv“: behoben.** Gruppenbeschreibung in `Einstellungen.ts` (und der erzeugte Kommentar in `payload-types.ts`) sagt „Versandlabel“; der Kommentar in `schein.ts` nennt den Schalter „Versandlabel aktiv“ und dass das Label erst nach Vertrag und Sandbox-Prüfung folgt. Stellen, die ausdrücklich die DHL-Retoure meinen (`versand/index.ts`, `typen.ts`, `types.ts`), bleiben.
6. **[gelb] wie 1: behoben** (derselbe Hook; der Wert „team“ im Typ wird jetzt gesetzt).
7. **[gelb] wie 3: behoben;** Test in `sendung.test.ts` („Freigabe mit Einsendung ohne angebotene Variante: kein Formular, sondern der Weg zur Kontaktseite“).

Geänderte Dateien der Nachbesserung: `src/lib/einsenden/sendung.ts`, `src/lib/einsenden/sendung.test.ts`, `src/lib/einsenden/schein.ts`, `src/payload/collections/Vorgaenge.ts`, `src/payload/einsende-sendung.db.test.ts`, `src/payload/globals/Einstellungen.ts`, `src/payload-types.ts` (nur Beschreibungstext), `src/app/(site)/bestellung/[id]/page.tsx`, `src/app/(site)/bestellung/[id]/sendungsnummer-formular.tsx`, `src/lib/actions/booking.ts`, `src/lib/actions/statusabruf.test.ts`, `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx`, `docs/betrieb/einsendung-pflegen.md`. Keine neue Migration (nur Hook und Texte, kein Schemawechsel).

Prüfung nach der Nachbesserung (alle über die Datenweiche):
- `sicher.sh --json -- npx vitest run`: 230 Dateien, 3589 Tests bestanden (vorher 3584; neu 5).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 25 Dateien, 142 Tests bestanden (neu 1).
- `sicher.sh --json -- npm run build`: erfolgreich (Exit 0).

=== ENDE FA-SHOP-03B · BEREIT ZUR RÜCKGABE ===

## ABNAHME (Orchestrator, 16.11.2026)

- **Prüfkette grün** (`werkzeuge/abnahme.sh FA-SHOP-03B`, zweiter Lauf nach den Korrekturen, Build mit `SM24_INDEXIERUNG=an`): Typprüfung, Lint, Unit 3.592 Tests in 230 Dateien, Datenbanktests 145 in 25 Dateien (mit der Migration `20261116_033126_einsende_sendung`), Build ohne Datenbank 178 von 178 Seiten. Onpage-Messung: 135 Seiten, Median 100,0, kein Befund. Prüfung „nichts Falsches bleibt übrig“ (`reste.mjs`): im ausgelieferten Stand kein Fund; offen bleibt nur der Vertragstext des Anwalts (MA-29).
- **Migration geprüft:** `up` enthält nur CREATE TYPE, ADD COLUMN, einen Fremdschlüssel und einen Index.
- **Gegenprüfung durch zwei unabhängige Prüfer** (einer als Angreifer): kein Weg für Fremde. Der Zugangsschlüssel wird vor allem anderen und unter der Sperre des Vorgangs noch einmal geprüft; unbekannter Vorgang und falscher Schlüssel ergeben dieselbe Meldung; die Nummer wird nur als Buchstaben und Ziffern gespeichert; der Verfolgungslink hat feste Ziele; der Statusabruf gibt nichts heraus, was der Berechtigte nicht kennt; ein echter Aufruf der DHL-Schnittstelle lässt sich nicht auslösen. Vier Schwächen im Zusammenspiel von Kunde und Team habe ich behoben (A-061):
  1. Berichtigt der Kunde nur seine Nummer, bleibt ein Dienstleister stehen, den das Team gesetzt hat (vorher wurde er aus der Variante überschrieben, der Verfolgungslink zeigte dann zum falschen Dienst).
  2. Ein Admin-Formular, das vor dem Eintrag des Kunden offen war, löscht seine Nummer beim Speichern nicht (Datenbanktest: Formular laden, Kunde trägt ein, altes Formular speichern, Nummer bleibt).
  3. Löscht das Team die Nummer bewusst, steht „Sendungsnummer Ihrer Sendung an uns entfernt.“ im Verlauf.
  4. An Vorgängen ohne Einsendung speichert auch ein Aufruf mit Team-Rechten keine Sendungsnummer (Datenbanktest). Ein ungültiger Wert wird im Admin weiter mit Meldung abgelehnt.
  Dazu der Wortlaut: Admin-Beschreibung und Anleitung sagen jetzt, in welchen Statusmails die Nummer steht (Termin, Versand, Storno; nicht in der Mail mit dem Angebot).
- **Freigegeben:** die Änderungen in `src/lib/actions/booking.ts` und im Statusformular (Eingriff F, außerhalb der Schreibrechte des Pakets): Statusabruf und Vorgangsseite zeigen denselben Stand.
- **Browserprobe:** Einsendeformular erneut 15 von 15; Statusabruf lädt ohne Fehler. Die Vorgangsseite mit Sendungsnummer ist im Browser nicht geprüft, weil dafür ein Vorgang angelegt werden müsste; sie ist durch die Unit- und Datenbanktests belegt und gehört zu den Browserläufen mit lokaler Datenbank (FA-QA-01).
- **Entschieden zu den offenen Fragen:** keine eigene Ratenregel für die Sendungsnummer (20 Versuche in 10 Minuten genügen); der Zugangsschlüssel bekommt kein Ablaufdatum (beträfe alle Kundenaktionen); das Label wird erst nach Vertrag und Prüfung in der Testumgebung gebaut.
- **Für Menschen:** MA-50 (Vertrag mit DHL, Zugang zur Schnittstelle, Portoübernahme).

