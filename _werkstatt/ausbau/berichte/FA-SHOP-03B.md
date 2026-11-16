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

=== ENDE FA-SHOP-03B · BEREIT ZUR RÜCKGABE ===
