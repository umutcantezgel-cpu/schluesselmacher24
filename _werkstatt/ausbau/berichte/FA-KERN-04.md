# FA-KERN-04 · Vermittlung und Partnerauszahlung im Admin · Bericht

Stand 15.11.2026 · Rolle Baumeister · Entscheidung A-049 · kein git durch den Agenten.

## GEÄNDERTE DATEIEN

Neu
- `src/payload/hooks/vermittlung.ts`: Hook vor und nach dem Speichern. Er prüft Vermittlung, Beträge, Auszahlung und Erstattung und schickt die Bitte um Bestätigung.
- `src/lib/zahlung/auszahlung.ts`: Schnittstelle „Partnerbetrag auszahlen“ mit `manuell` (aktiv) und `stripe-connect` (vorbereitet, aus).
- `src/lib/partner/kundenbestaetigung.ts`: Einmal-Link, Lage, Anwenden, Texte.
- `src/lib/actions/kundenbestaetigung.ts`: Server-Aktion `ausfuehrungBestaetigen`.
- `src/app/(site)/auftrag-bestaetigen/[id]/page.tsx` und `bestaetigen-knopf.tsx`: Seite der Kundenbestätigung.
- `src/lib/mail/vorlagen/ausfuehrung.ts`: Mail „Auftrag wurde ausgeführt: bitte bestätigen“.
- `src/migrations/20261115_200046_vermittlung_auszahlung.ts` und `.json`: erzeugt mit `sicher.sh --pg -- npx payload migrate:create vermittlung_auszahlung`.
- `docs/betrieb/partnerauftrag-abrechnen.md`: Betreiberanleitung.
- Tests: `src/lib/partner/vermittlung.test.ts`, `src/lib/partner/kundenbestaetigung.test.ts`, `src/lib/zahlung/auszahlung.test.ts`, `src/payload/hooks/vermittlung.test.ts`, `src/lib/mail/partnerweg-texte.test.ts`, `src/lib/partner/vermittlung.db.test.ts`.

Geändert (im Schreibrecht)
- Datenmodell: `src/payload/collections/Vorgaenge.ts`, `src/payload/collections/Partnerbetriebe.ts`, `src/migrations/index.ts`, `src/payload-types.ts` (generiert), `src/lib/types.ts`, `src/lib/data/payload-mapping.ts`.
- Logik: `src/lib/partner/vermittlung.ts`, `src/lib/partner/sichtbarkeit.ts`, `src/lib/zahlung/uebergaenge.ts`, `src/lib/zahlung/ansicht.ts`, `src/lib/umgebung.ts`, `src/lib/kundenstatus.ts`, `src/payload/hooks/vorgang-benachrichtigen.ts`, `src/payload/components/VorgaengeWerkzeuge.tsx`.
- Texte aus FA-KERN-03: `src/lib/mail/vorlagen/vertragsbestaetigung.ts`, `src/lib/mail/vertrag.ts`, `src/lib/mail/vorlagen/zahlung.ts`, `src/lib/mail/vorlagen/team-hinweis.ts`, `src/lib/mail/vorlagen/gemeinsam.ts` (nur Bezeichnung des neuen Zahlungsstands), `src/lib/integrations/stripe.ts` (nur die Beschriftung).
- `src/lib/server/create-record.ts` (nur Punkt 3), `src/lib/pdf/vorgangsblatt.ts` und `src/lib/druckansichten.ts` (neue Zeilen), `src/app/(site)/bestellung/[id]/page.tsx` (Anzeige der Erstattung), `.env.example` (Schalter `PARTNER_AUSZAHLUNG=`, leer).
- Tests angepasst: `src/lib/zahlung/uebergaenge.test.ts`, `src/lib/integrations/stripe.test.ts`, `src/lib/server/freigabe.db.test.ts`. Die Begründung steht unter OFFENE FRAGEN 1.

Geändert außerhalb des ausdrücklichen Schreibrechts. Das war nötig, weil der neue Zahlungsstand sonst Lücken öffnet oder der Code nicht übersetzt. Es ist je eine Bedingung oder ein Eintrag:
- `src/lib/actions/zahlung.ts`: „teilweise erstattet“ gilt als schon bezahlt. Ohne das könnte ein teilweise erstatteter Vorgang über „Jetzt bezahlen“ ein zweites Mal bezahlt werden.
- `src/lib/kennzahlen.ts`: „teilweise erstattet“ zählt im Umsatz wie bisher „bezahlt“ minus Erstattung.
- `src/lib/termin-erinnerung.ts`: Die Terminerinnerung geht auch bei „teilweise erstattet“.
- `src/lib/auftragsweg.ts`: `restbetragCents` zählt „teilweise erstattet“ wie „bezahlt“. Der Kommentar dort hatte das FA-KERN-04 zugewiesen.
- `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx`: nur die Bezeichnung des neuen Stands. Ohne sie scheitert die Typprüfung.
- `src/lib/actions/records.ts`: `submitRecord` übergibt Auftragsweg und Rest jetzt an `createRecord`. Der nachträgliche Schreibvorgang entfällt. Das ist der zweite Teil von Punkt 3.

Nicht angefasst: Preise und Preisregeln, Rechtstexte (AGB-Wortlaut, Widerruf), Auftragsweg und Zahlungsumfang aus FA-KERN-03, Termin-Assistent, Navigation, Startseite und `src/lib/data/index.ts`.

## WAS UND WARUM

1. **Stände (A-049 Nr. 1).** Die Reihenfolge des Inhabers ist: `geprueft` → `partner-angefragt` („an Partner vermittelt“) → `angenommen` → `termin-bestaetigt` → `erledigt` („ausgeführt“) → `kunde-bestaetigt` → `auszahlung-freigegeben` → `ausgezahlt`. `provision-abgerechnet` bleibt für Modell A. Die Übergänge stehen in `VERMITTLUNG_UEBERGAENGE`. Den Wortlaut im Admin liefert `VERMITTLUNG_LABEL`. Jeder Wechsel durch das Team läuft durch `vermittlungsWechselPruefen` im Hook. Fehler werden mit 400 und Meldung abgelehnt.
   - „an Partner vermittelt“ geht nur, wenn der Zahlungsstand „bezahlt“ ist und der Umfang „gesamt“. Das gilt, sobald die Zahlung zentral läuft: im Partnerweg, bei Modell B oder bei einer Zahlung des Gesamtbetrags. Außerdem muss der Partnerbetrieb nach `darfVermitteln` freigeschaltet sein und die Auftragsart übernehmen. Der Partnerbetrieb wird dafür frisch aus der Datenbank gelesen. Pausieren wirkt also sofort, auch bei „angenommen“ und „Termin bestätigt“.
   - „Kunde bestätigt“ setzt nur der Kunde über seinen Link.
   - „zur Auszahlung freigegeben“ geht nach „Kunde bestätigt“. Direkt nach „ausgeführt“ geht es nur mit einem Grund im Feld „Bestätigung durch das Team“. Der Grund kommt in die Notizen.
   - „ausgezahlt“ geht nur nach der Freigabe.
   - Eine erfasste Erstattung sperrt Freigabe und Auszahlung.
   - Eine laufende Vermittlung lässt sich nicht leeren.
   - Eine neue Vermittlung beginnt wie im Bestand mit „neu“.
2. **Beträge (Nr. 2).** Die Gruppe Vermittlung hat neu Auftragsart, Gesamtbetrag, Plattformanteil, Partnerbetrag (berechnet) und einen Hinweis zum Anteil.
   - Der Gesamtbetrag wird aus „Gesamtpreis und Rest“ oder aus der Zahlung des Gesamtbetrags vorgeschlagen.
   - Den Plattformanteil schlägt `plattformanteilVorschlag` vor. Das ist `abrechnen()` mit der Provision des Partnerbetriebs aus der Datenbank (G13). Ohne Provision gibt es keinen Betrag, sondern den Hinweis „Für diese Auftragsart ist keine Provision hinterlegt. Bitte den Plattformanteil von Hand eintragen.“
   - Der Plattformanteil bleibt von Hand änderbar. Mit „ausgeführt“ wird er festgeschrieben (`festgeschriebenAm`). Danach wird jede Änderung an Gesamtbetrag oder Anteil abgelehnt.
3. **Auszahlung (Nr. 3).** Neue Gruppe `auszahlung` mit Stand, freigegeben am, freigegeben von, ausgezahlt am, Weg (Überweisung oder Zahlungsdienst), Beleg oder Referenz und Notiz. Ein virtuelles Feld „Weg der Auszahlung“ zeigt den aktiven Weg.
   - Den Stand (offen, freigegeben, ausgezahlt, gesperrt) leitet der Hook bei jedem Speichern ab, auch bei Änderungen des Servers, etwa einer Erstattung per Webhook.
   - Bei Überweisung ist der Beleg Pflicht.
   - Jeder Wechsel, die Freigabe, die Auszahlung und jede Änderung an Weg, Beleg, Datum oder Notiz stehen mit Zeit und Bearbeiter in den Notizen. Was den Kunden betrifft, steht auch in seinem Verlauf: vermittelt, ausgeführt, bestätigt, Erstattung.
4. **Kundenbestätigung (Nr. 4).** Mit „ausgeführt“ (bei zentraler Zahlung) schickt der Hook nach dem Speichern die Mail mit dem persönlichen Link `/auftrag-bestaetigen/<id>?k=…`.
   - Gespeichert wird nur der SHA-256-Hash des Schlüssels, und nur wenn die Mail hinausging. Das ist dasselbe Muster wie der Link-Schlüssel der Vorgangsseite (`access-token.ts`).
   - Das Öffnen ändert nichts, weil Mailprogramme Links zur Vorschau abrufen. Erst der Knopf „Auftrag wurde ausgeführt: bestätigen“ ruft die Server-Aktion auf. Sie prüft den Schlüssel unter der Sperre des Vorgangs (`vorgangAendern`), setzt „Kunde bestätigt“ mit Zeitstempel und löscht den Hash.
   - Ein gefälschter oder benutzter Link wird mit „Dieser Link ist ungültig oder wurde schon benutzt.“ abgelehnt. Er verrät nicht, ob der Vorgang existiert.
   - Die Seite sagt in einem Satz, was die Bestätigung bedeutet, und nennt das Telefon aus den Firmendaten.
   - Ratenbegrenzung über `LIMITS.status`.
5. **Zahlungsdienst (Nr. 5).** `src/lib/zahlung/auszahlung.ts` bietet `manuelleAuszahlung` (bewegt kein Geld) und `stripeConnectAuszahlung(ueberweisen)` nach dem Muster „separate charges and transfers“ mit Gruppe und Idempotenz-Schlüssel je Vorgangsnummer.
   - Aktiv ist der Zahlungsdienst nur, wenn `PARTNER_AUSZAHLUNG=stripe-connect` gesetzt ist, Stripe vollständig angebunden ist (`auszahlungsWeg()` in `umgebung.ts`) und am Partnerbetrieb eine Konto-Kennung `acct_…` steht.
   - Ohne Schalter lehnt „ausgezahlt“ mit Weg „Zahlungsdienst“ ab. Dabei wird Stripe nicht einmal geladen; der Test belegt das.
   - In Tests wird nur gegen eine Attrappe gearbeitet.
6. **Storno und Rückzahlung (Nr. 6).** Neue Gruppe `erstattung` mit Art (ganz, teilweise), Betrag (Summe aller Erstattungen), Datum und Grund.
   - Der Hook prüft: Die Zahlung muss eingegangen sein, der Grund ist Pflicht, bei „ganz“ ist der Betrag die ganze Zahlung, bei „teilweise“ ist er kleiner, und er darf nie kleiner werden als bisher.
   - Dann setzt der Hook den Zahlungsstand auf „erstattet“ oder „teilweise erstattet“ (additiver Enum-Wert) und schreibt `erstattetCent`.
   - Bei Partneraufträgen kommt der Vermerk „Auszahlung an den Partner gesperrt“. Ist schon ausgezahlt, kommt der Hinweis auf die Rückforderung.
   - Der Code bewegt kein Geld.
   - Eine Teilerstattung über den Stripe-Webhook setzt jetzt ebenfalls „teilweise erstattet“. Bisher blieb dort „bezahlt“ stehen.
   - Der Kunde sieht auf `/bestellung/[id]` einen ruhigen Satz (`kundenErstattung`), etwa „Wir haben Ihnen 50,00 € erstattet. Je nach Zahlart dauert es einige Tage, bis der Betrag auf Ihrem Konto ist.“
7. **Admin-Übersicht (Nr. 7).**
   - In der Liste gibt es die Spalte „Auszahlungsstand“ zusätzlich zu „Stand der Vermittlung“.
   - Über der Liste gibt es fertige Filter: an Partner vermittelt, ausgeführt mit offener Bestätigung, Kunde bestätigt, Auszahlung freigegeben, gesperrt, ausgezahlt.
   - Am Partnerbetrieb gibt es die Konto-Kennung (freiwillig, geprüft auf `acct_…`) und das Join-Feld „Vorgänge mit offener Auszahlung“ (offen, freigegeben, gesperrt).
   - Die Auswahl des Partnerbetriebs am Vorgang lässt jetzt auch pausierte und beendete Betriebe zu. Sonst ließe sich ein laufender Auftrag nach dem Pausieren nicht mehr speichern oder auszahlen. Vermitteln geht trotzdem nur an freigeschaltete, das erzwingt der Hook.
   - Vorgangsblatt und Druckansicht haben den Abschnitt „Vermittlung und Auszahlung“.
8. **Betreiberanleitung (Nr. 8)** in `docs/betrieb/partnerauftrag-abrechnen.md`.
9. **Aus FA-KERN-03:**
   - Vertragsbestätigung bei Gesamtzahlung im Partnerweg (Termin und bezahlte Anfrage, `partnerGesamtbetrag`): Statt Anzahlung und Rest stehen dort „Termin: Bei einem Partnerbetrieb in Ihrer Region, vermittelt durch Schlüsselmacher24; den genauen Termin stimmt der Partnerbetrieb mit Ihnen ab“ und „Gesamtpreis: … mit Ihrer Zahlung vollständig beglichen“. Dazu kommen ein eigener Einleitungssatz und eine eigene Kurzfassung (Entwurf, siehe unten).
   - `vertragsbestaetigungOffen` gilt jetzt auch für die bezahlte Partner-Anfrage.
   - Kundenmails „Zahlung nicht abgeschlossen“ und „Zahlung erhalten“ sowie Teammails „Rückruf empfohlen“ und „Anzahlung offen“ sprechen bei Umfang `gesamt` vom Gesamtbetrag. Sie nennen weder Anzahlung noch Zeitfenster.
   - Die Stripe-Position heißt bei Termin mit Umfang `gesamt` „Autoschlüssel-Auftrag, Gesamtbetrag“, auch in der Beschreibung für den Kontoauszug.
   - `TrustedRecordInput` kennt `auftragsweg` und `remainder`, `createRecord` speichert beide gleich beim Anlegen.

## PRÜFUNG UND ERGEBNIS

Alle Läufe über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 201 Dateien, 2867 Tests bestanden, 0 Fehler (vorher 196 und 2830).
- `sicher.sh --json -- npm run typecheck`: 0 Fehler.
- `sicher.sh --json -- npm run lint`: 0 Fehler, 0 Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 20 Dateien, 113 Tests bestanden, mit der Migration `20261115_200046_vermittlung_auszahlung` (vorher 19 und 110).
- `sicher.sh --json -- npm run build`: Exit 0, 177 von 177 Seiten, neue dynamische Route `/auftrag-bestaetigen/[id]`.

Verlangte Tests und wo sie stehen:
- „an Partner vermittelt“ ohne Zahlung des Gesamtbetrags wird abgelehnt: `vermittlung.test.ts` und `hooks/vermittlung.test.ts` („lehnt … ohne Zahlung des Gesamtbetrags ab“, auch bei bezahlter Anzahlung).
- An einen pausierten oder gesperrten Partner wird abgelehnt: `hooks/vermittlung.test.ts` (pausiert, beendet, nicht auffindbar) und `vermittlung.db.test.ts` (nach der Auswahl pausiert, in der Datenbank).
- Auszahlung vor der Kundenbestätigung wird abgelehnt: `vermittlung.test.ts` und `hooks/vermittlung.test.ts` („ausgezahlt“ direkt nach „ausgeführt“, „Kunde bestätigt“ durch das Team).
- Freigabe durch das Team nur mit Grund: dieselben Dateien, mit leerem Grund und mit Leerzeichen.
- Kundenbestätigung mit gefälschtem oder schon benutztem Link wird abgelehnt: `kundenbestaetigung.test.ts` und `vermittlung.db.test.ts` (zweiter Klick).
- Rückzahlung sperrt die Auszahlung: `hooks/vermittlung.test.ts` („Teilerstattung … sperrt“, auch per Webhook ohne Benutzer) und `vermittlung.db.test.ts`.
- Plattformanteil wird mit „ausgeführt“ festgeschrieben: `hooks/vermittlung.test.ts` und `vermittlung.db.test.ts`.
- Ohne Schalter ruft nichts den Zahlungsdienst auf: `auszahlung.test.ts` und `hooks/vermittlung.test.ts`. Weder `fetch` noch das Laden von Stripe werden aufgerufen.
- Jeder Wechsel steht im Verlauf: `hooks/vermittlung.test.ts` und `vermittlung.db.test.ts`. Der ganze Weg bis „ausgezahlt“ gibt neun Einträge „Vermittlung von … auf …“, dazu ein Eintrag bei Änderungen der Auszahlung.
- Texte bei Gesamtzahlung im Partnerweg: `partnerweg-texte.test.ts`. Stripe-Beschriftung: `stripe.test.ts`.

## BELEGE

- Vorgabe: Arbeitsanweisung vom 11.11.2026, Abschnitt 05 und 22 (Zitate in der Paketdatei), Entscheidung A-049, Recherche `erhebung/FA-RECHERCHE-04.md` (Abschnitt 2 und 6: „separate charges and transfers“).
- Die Migration ist rein additiv. Sie legt vier neue Enum-Typen an und ergänzt vier bestehende Enum-Typen um Werte (`ADD VALUE`): Mailart `ausfuehrung`, vier Stände der Vermittlung, Zahlungsstand `teilweise-erstattet`. Dazu kommen 21 neue Spalten an `vorgaenge`, eine an `partnerbetriebe` (`konto_kennung`) und ein Index (`auszahlung_stand`). Nichts wird gelöscht oder umbenannt, bestehende Werte bleiben gültig. Das Join-Feld braucht keine Spalte.
- Keine Provisionssätze im Repository. Tests arbeiten mit erfundenen 10 %.
- Keine echten Zahlungen, Überweisungen oder Mails. Stripe und Resend laufen in Tests nur als Attrappe.
- Der Schalter `PARTNER_AUSZAHLUNG` ist in `.env.example` leer. `PARTNERMODELL_B` ist unverändert.
- Next 16: Seite mit `params`/`searchParams` als Promise und `connection()` wie `bestellung/[id]`. Server-Aktion nach `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`; die Aktion prüft die Berechtigung selbst (Hinweis dort).

## OFFENE FRAGEN

1. **Geänderte bestehende Tests (bitte bei der Abnahme ansehen, G8).** Gelockert wurde keiner.
   - `uebergaenge.test.ts`: Eine Teilerstattung per Webhook erwartet jetzt „teilweise erstattet“ statt „bezahlt“. Das ist die verlangte eindeutige Darstellung. Es kamen zwei Erwartungen dazu.
   - `freigabe.db.test.ts`: Der Test setzte „an Partner vermittelt“ direkt aus dem leeren Stand, ohne Zahlung und ohne Partnerbetrieb. Genau das verbietet der Inhaber jetzt. Der Test prüft weiter den Verweis auf die Bewerbung, mit dem erlaubten Anfangsstand „neu“. Der verbotene Weg ist in `vermittlung.db.test.ts` als Ablehnung belegt.
2. **Begrenzung offener Termine je E-Mail beim Partnertermin (Punkt 3, zweiter Teil): nicht erledigt.** Die Zählung steht in `src/lib/data/index.ts` (`vorgangAnlegen`, SQL mit `termin_datum >= abDatum`). Sie läuft nur mit einem Zeitfenster. Die Datei liegt außerhalb meiner Schreibrechte. Vorschlag: `VorgangsAnlage` bekommt `kunde` auch ohne `termin`. Gezählt werden Termine mit offener oder fehlgeschlagener Zahlung und entweder `termin_datum >= abDatum` oder `termin_datum IS NULL AND created_at > jetzt − 1 Tag`. `createRecord` übergibt das für `kind termin` mit `payment` und ohne `appointment`. **Das sperrt weiter den Schalter `PARTNERMODELL_B`.**
3. **AGB-Wortlaut § 8 (Anzahlung)** steht unverändert in der Vertragsbestätigung des Partnerwegs (Rechtstext, R10). Kurzfassung und Vertragsinhalt sind angepasst, der Wortlaut für den Anwalt steht unten.
4. **Plattformanteil für das Team sichtbar.** Die Provisionssätze sieht nur der Inhaber. Aus dem vorgeschlagenen Betrag lässt sich der Satz aber zurückrechnen. Die Arbeitsanweisung verlangt, dass Plattformanteil und Partnerbetrag im Admin zu sehen sind. Bitte bestätigen, dass das für die Rolle „Team“ gewollt ist.
5. **Teilerstattung und Sperre.** Jede erfasste Erstattung, auch eine kleine Kulanz, sperrt die Auszahlung dauerhaft. Eine Aufhebung mit Grund ist nicht gebaut, und der Partnerbetrag passt sich nicht an. Wie soll eine Teilerstattung den Partnerbetrag mindern (Inhaber, Steuerberatung)?
6. **Auszahlung über den Zahlungsdienst.** Die Überweisung läuft vor dem Speichern. Scheitert danach das Speichern, ist das Geld unterwegs, aber nicht vermerkt. Der Idempotenz-Schlüssel verhindert eine zweite Überweisung beim erneuten Versuch. Vor dem Einschalten ist mit einem Testkonto zu prüfen, ob das genügt.
7. **Kein Mailversand ohne Mailanbindung.** Ohne `MAIL_*` geht die Bitte um Bestätigung nicht hinaus. Es bleibt die Freigabe durch das Team mit Grund. Der Link hat kein Ablaufdatum; er gilt einmal und endet mit der Freigabe. Soll er zusätzlich ablaufen (etwa nach 30 Tagen)?
8. **Partner informieren.** Die Seite schickt dem Partner keine Mail, wenn ihm vermittelt wird. Das Team informiert ihn wie bisher selbst. Ein eigenes Paket?

## FÜR MENSCHEN

Fragen an den Inhaber
- Darf eine kleine Teilerstattung (Kulanz) die Partnerauszahlung sperren, oder soll das Team die Sperre mit Grund aufheben und den Partnerbetrag mindern können (Offene Frage 5)?
- Soll das Team den Plattformanteil sehen (Offene Frage 4)?
- Soll die Seite dem Partner bei „an Partner vermittelt“ selbst eine Mail schicken (Offene Frage 8)?
- Provisionssätze je Auftragsart am Partnerbetrieb pflegen (nur der Inhaber). Ohne sie gibt es nur einen Hinweis statt eines Vorschlags.

Fragen an Anwalt und Steuerberatung (R10, MA-36; Recherche 04, Abschnitt 3 und 5)
- Erlaubnispflicht nach ZAG für die zentrale Vereinnahmung und Weitergabe an Partner. Handelsvertreterausnahme (§ 2 Abs. 1 Nr. 2 ZAG) oder zugelassener Dienstleister (Stripe Connect).
- Wer ist Vertragspartner des Kunden im Partnerweg? Die Vertragsbestätigung nennt weiter „Ihr Vertragspartner ist Schlüsselmacher24“.
- Rechnung an den Kunden, Abrechnung des Plattformanteils (Provision oder Leistungskommission, § 3 Abs. 11 UStG), Gutschrift oder Rechnung des Partners, Korrektur bei Storno und Teilerstattung.
- Entwurf zur Prüfung, Kurzfassung der AGB im Partnerweg: „Den Gesamtpreis haben Sie vorab bezahlt; einen Restbetrag gibt es nicht.“ und „Wir arbeiten nur für Berechtigte. Bitte halten Sie die Zulassungsbescheinigung Teil I bereit.“
- Entwurf zur Prüfung, Einleitung der Vertragsbestätigung: „vielen Dank für Ihren Auftrag. Mit Ihrer Zahlung ist er verbindlich; hiermit bestätigen wir Ihnen den Vertrag.“
- Entwurf für den AGB-Wortlaut: § 8 regelt nur die Anzahlung. Für den Partnerweg fehlt ein Absatz etwa so: „Bei Aufträgen, die wir an einen Partnerbetrieb in Ihrer Region vermitteln, zahlen Sie den Gesamtpreis vorab an uns. Der Auftrag wird mit Ihrer Zahlung verbindlich. Ein Restbetrag fällt nicht an.“
- Kundentexte als Entwurf: Satz der Bestätigungsseite „Mit Ihrer Bestätigung sagen Sie uns, dass der Partnerbetrieb Ihren Auftrag ausgeführt hat; danach bezahlen wir den Partnerbetrieb.“ Verlauf: „Wir haben Ihren Auftrag an einen Partnerbetrieb in Ihrer Region weitergegeben. Er stimmt den Termin mit Ihnen ab.“ Hat die Bestätigung des Kunden eine rechtliche Wirkung (Abnahme), oder ist sie nur eine Rückmeldung?

Schritte für das Konto beim Zahlungsdienst (erst nach der Klärung, nur Menschen, G3 und G4)
1. Stripe Connect für das Plattformkonto beantragen (Inhaber). Kontotyp und Prüfpflichten (KYC) mit Stripe klären.
2. Partner als verbundene Konten anlegen lassen und die Kennung `acct_…` am Partnerbetrieb eintragen.
3. Im Testmodus von Stripe mit einem Testpartner eine Überweisung durchspielen (keine echten Zahlungen).
4. Erst danach `PARTNER_AUSZAHLUNG=stripe-connect` in der Umgebung setzen. Bis dahin bleibt der Weg „Überweisung von Hand“.
5. `PARTNERMODELL_B=aktiv` erst nach Offener Frage 2 (Begrenzung je E-Mail) und der rechtlichen Klärung oben. Bedingung zusätzlich: Der Anwalt hat die Kurzfassung der AGB im Partnerweg (`vertragsbestaetigung.ts`, im Code als ENTWURF markiert) und die Stelle zur Anzahlung in § 8 der AGB für den Partnerweg freigegeben.

## Nachbesserung

Nach zwei Gegenprüfungen (17 Befunde). Jeder Befund am Code geprüft. Alle trafen zu und sind behoben.

1. **[rot] Partnerwechsel bei gleichem Stand (vermittlung.ts:223): behoben.** Der Hook erkennt jetzt bei jedem Speichern einen Wechsel von `vermittlung.partnerbetrieb` (Kennung alt gegen neu) und der Auftragsart. Ab „an Partner vermittelt“ geht er nur zusammen mit dem Schritt zurück auf „geprüft“ (`MELDUNG_PARTNER_WECHSEL`), seit „ausgeführt“ gar nicht (`MELDUNG_PARTNER_FEST`, gilt auch für Freigabe und „ausgezahlt“). Der neue Betrieb wird beim nächsten „an Partner vermittelt“ mit `darfVermitteln` geprüft. Jeder Wechsel steht als Notiz „Partnerbetrieb von „…“ auf „…“ gewechselt“ in den Notizen. Tests: Wechsel auf einen pausierten Betrieb bei gleichem Stand abgelehnt (drei Stände), Wechsel seit „ausgeführt“ abgelehnt (vier Stände), Wechsel über „geprüft“ vermerkt, danach Vermitteln an den pausierten abgelehnt.
2. **[rot] Sperre durch Zurücksetzen des Zahlungsstands umgehbar (vermittlung.ts:176): behoben.** Ein Wechsel von „erstattet“ oder „teilweise erstattet“ (oder mit erfasstem Erstattungsbetrag) zurück auf „bezahlt“, „offen“ oder „fehlgeschlagen“ wird mit 409 abgelehnt (`ERSTATTUNG_MELDUNG.zurueck`). Die Stände „erstattet“ und „teilweise erstattet“ setzt das Team nur über die Gruppe Erstattung (sonst 400 mit Verweis auf die Gruppe). Zusätzlich hängt die Sperre jetzt auch am erstatteten Betrag (`auszahlungGesperrt(stand, erstattetCents)`, Wert aus `zahlung.erstattetCent` oder `erstattung.betragCent`). Da der Hook im selben Speichern wirft, plant `vorgangVorAenderung` keine Zahlungsmail, die hinausginge. Tests: Erstattung erfassen, dann „bezahlt“ setzen (auch mit gleichzeitiger Freigabe) wird abgelehnt; Freigabe bei Stand „bezahlt“ mit erstattetem Betrag gesperrt; „erstattet“ von Hand ohne Gruppe abgelehnt.
3. **[rot] Produktionsliste fragte nur „bezahlt“ ab (druckansichten.ts:117): behoben.** Die Abfrage nimmt jetzt `in: ['bezahlt', 'teilweise-erstattet']`, passend zu `inProduktion()`. Tests: erwartete Abfrage angepasst; `inProduktion` nimmt eine teilweise erstattete Bestellung auf und eine ganz erstattete nicht.
4. **[rot] Verlauf behauptete die Mail vor dem Versand (vermittlung.ts:254): behoben.** Vor dem Speichern steht nur „Ihr Auftrag wurde ausgeführt.“ im Verlauf. Den Satz „Wir haben Sie per E-Mail gebeten, das kurz zu bestätigen.“ hängt `vermittlungNachAenderung` erst an, wenn die Mail zugestellt ist (über `vorgangVermerken`). Tests: ohne Mailanbindung steht der Satz nicht im Verlauf und es wird nichts nachgetragen; mit Attrappe steht er nach dem Versand drin.
5. **[gelb] Anleitung „nur freigeschaltete wählbar“: behoben.** Wortlaut wie vorgeschlagen ersetzt. Die Anleitung nennt außerdem die neuen Regeln (Partnerwechsel nur über „geprüft“, „Termin bestätigt“ vor „ausgeführt“, Erstattungsstände nur über die Gruppe).
6. **[gelb] Reihenfolge „Termin bestätigt“ vor „ausgeführt“ nicht erzwungen: behoben (zusammen mit 16).** Bei zentraler Zahlung lehnt `vermittlungsWechselPruefen` den Sprung „angenommen“ auf „ausgeführt“ ab (`MELDUNG.ohneTermin`). Ohne zentrale Zahlung (Modell A, Bestand) bleibt der Sprung erlaubt; der Kommentar sagt das jetzt. Test in `vermittlung.test.ts`.
7. **[gelb] Mail behauptete eine Meldung des Partners: behoben.** Neu: „nach unseren Unterlagen hat der Partnerbetrieb Ihren Auftrag ausgeführt.“
8. **[gelb] „bestätigen Sie bitte nicht“ auch ohne offene Bestätigung: behoben.** Der Satz erscheint nur bei offener Bestätigung. Sonst steht `fragenSatz`: „Fragen? Rufen Sie uns an: …“ (ohne Telefon: Antwort auf unsere E-Mail).
9. **[gelb] Notiz „Auszahlung gesperrt“ auch ohne Partnerauszahlung: behoben.** Die Notiz steht nur bei zentraler Zahlung und einem Stand von „an Partner vermittelt“ bis „zur Auszahlung freigegeben“; der Hinweis zur Rückforderung nur bei „ausgezahlt“. Test: Erstattung bei „geprüft“ schreibt keine Sperrnotiz.
10. **[gelb] „teilweise erstattet“ fehlte bei Storno, Absage und Vertragsbestätigung: behoben.** `status.ts` (Storno), `freigabe.ts` (Absage) und `vertrag.ts` (`vertragsbestaetigungOffen`, beide Stellen) nutzen `zahlungEingegangen()`.
11. **[gelb] AGB-Kurzfassung im Partnerweg als feste Ausgabe: behoben.** Im Code als ENTWURF markiert mit der Bedingung, dass der Anwalt den Text und § 8 vor dem Einschalten von `PARTNERMODELL_B` freigibt; dieselbe Bedingung steht unter FÜR MENSCHEN, Schritt 5. Der Text selbst bleibt unverändert (R10).
12. **[gelb] Gedankenstrich im Betreff: behoben.** Neu: „Auftrag wurde ausgeführt: bitte bestätigen (SM24-…)“.
13. **[rot] Partner und Auftragsart nur bei Standwechsel geprüft: behoben (siehe 1).** Auch ein Wechsel der Auftragsart bei laufender Vermittlung wird abgelehnt (Test).
14. **[rot] Sperre nur am Zahlungsstand: behoben (siehe 2).** Die Aussagen in WAS UND WARUM („Eine erfasste Erstattung sperrt Freigabe und Auszahlung“) und Offene Frage 5 („dauerhaft“) stimmen damit jetzt.
15. **[rot] Auszahlungsstand per REST setzbar: behoben.** Der abgeleitete Auszahlungsstand wird bei jedem Speichern mit Vermittlung gesetzt, ohne Vergleich mit dem alten Wert. Test: ein vom Team gesendeter Stand „ausgezahlt“ wird zu „offen“.
16. **[gelb] Kommentar „im Partnerweg erst Termin bestätigt“: behoben (siehe 6).**
17. **[gelb] Ableitung ohne Abrechnungsmodell: behoben.** `teamAenderung` gibt `zentral` (mit dem Modell des Partners) zurück, die Ableitung nutzt denselben Wert. Bei Änderungen des Servers lädt die Ableitung den Partner, wenn Weg und Umfang allein nicht zentral ergeben.

Prüfung nach der Nachbesserung (Datenweiche):
- `sicher.sh --json -- npx vitest run`: 201 Dateien, 2875 Tests bestanden, 0 Fehler.
- `sicher.sh --json -- npm run typecheck`: 0 Fehler.
- `sicher.sh --json -- npm run lint`: 0 Fehler, 0 Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 20 Dateien, 113 Tests bestanden.
- `sicher.sh --json -- npm run build`: erfolgreich.

Geänderter bestehender Test (G8, nichts gelockert): `hooks/druckansichten.test.ts` erwartet die erweiterte Abfrage; `hooks/vermittlung.test.ts` erwartet den neuen Betreff.

## ABNAHME (Orchestrator, 15.11.2026)

- **Prüfkette grün** (`werkzeuge/abnahme.sh FA-KERN-04`): Typprüfung, Lint, Unit 2.875 Tests in 201 Dateien, Datenbanktests 113 in 20 Dateien (mit der Migration `20261115_200046_vermittlung_auszahlung`, rein additiv), Build ohne Datenbank 177 von 177 Seiten mit der neuen Route `/auftrag-bestaetigen/[id]`.
- **Sichtprobe:** `/auftrag-bestaetigen/…` mit ungültigem Schlüssel zeigt bei 390 × 844 ruhig „Keine Bestätigung möglich. Dieser Link ist ungültig oder wurde schon benutzt.“ und das Telefon; keine Fehler in der Konsole. Die Stände im Admin sind durch die Tests der Hooks und die Datenbanktests belegt, nicht durch eine Sichtprobe im Backend.
- **Freigegeben:** die sechs Änderungen außerhalb der Schreibrechte (je eine Bedingung für den neuen Zahlungsstand oder die Übergabe von Auftragsweg und Rest) und die angepassten Tests; keiner davon lockert eine Prüfung, die geänderte Erwartung folgt jeweils der Regel des Inhabers (Vermitteln nur nach Zahlung an einen freigeschalteten Partner; Teilerstattung als eigener Stand).
- **Schalter bleiben aus:** `PARTNERMODELL_B` (Partnerweg für Kunden) und `PARTNER_AUSZAHLUNG` (Zahlungsdienst) sind nirgends gesetzt. Vor dem Einschalten von `PARTNERMODELL_B` fehlen noch: die Begrenzung offener, unbezahlter Partnertermine je E-Mail (Auftrag in FA-KERN-05) und die Freigabe der AGB-Kurzfassung für den Partnerweg durch den Anwalt (MA-36).
- **Fragen an den Inhaber** (MA-36): Sperrt schon eine kleine Teilerstattung die Partnerauszahlung auf Dauer? Darf das Team den Plattformanteil sehen? Soll der Partner bei der Vermittlung automatisch eine Mail bekommen?
