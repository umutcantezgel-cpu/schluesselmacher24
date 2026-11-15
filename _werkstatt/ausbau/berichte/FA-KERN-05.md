# FA-KERN-05 · Admin im Alltag · Bericht

Stand 15.11.2026 · Rolle Baumeister · Stufe 3 · kein git durch den Agenten. Fortsetzung eines unterbrochenen Laufs: Der Zwischenstand aus den Commits 7e9a1b0 und eff25d2 wurde gegen die Paketdatei geprüft, berichtigt und ergänzt.

## GEÄNDERTE DATEIEN

Neu (aus dem Zwischenstand übernommen und geprüft)
- `src/lib/zahlung/erstattung.ts`: Wege der Erstattung, Belegpflicht, Zahlungsstand in einem Satz, Storno-Entscheidung, vorbereitete und abgeschaltete Funktion „Erstattung beim Zahlungsdienst auslösen“.
- `src/lib/mail/nachricht-vorlagen.ts`, `src/lib/mail/vorlagen/nachricht.ts`: vier Vorlagen als Daten, Prüfung von Betreff und Text, Mailgerüst der freien Nachricht.
- `src/payload/hooks/kunden-nachricht.ts`: Endpunkt `POST /api/vorgaenge/:id/nachricht` mit Rechteprüfung.
- `src/payload/hooks/storno-korrektur.ts`: Storno mit Entscheidung zur Erstattung, Korrekturpositionen.
- `src/payload/hooks/seiten-adresse.ts`, `src/payload/hooks/seiten-adresse-pruefung.ts`: Prüfung freier Adressen, noindex beim Anlegen.
- `src/payload/components/KundenNachricht.tsx`, `KontaktVerweise.tsx`, `ErstattungZahlungsdienst.tsx`.

Neu in diesem Lauf
- `src/migrations/20261115_210337_admin_alltag.ts` und `.json`: erzeugt mit `sicher.sh --pg -- npx payload migrate:create admin_alltag`. Nur additiv: zwei neue Enums, ein Wert `nachricht` im Enum der Mailarten, Tabelle `vorgaenge_korrekturen`, Spalten `vorgaenge_mails.betreff`/`text`, `vorgaenge.storno_*`, `vorgaenge.erstattung_weg`/`_beleg`/`_berichtigung_grund`.
- `docs/betrieb/admin-alltag.md`: Betreiberanleitung, zwölf Abschnitte, mit Namen der Knöpfe.
- Tests: `src/payload/hooks/storno-korrektur.test.ts` (13), `src/payload/hooks/kunden-nachricht.test.ts` (8), `src/payload/hooks/seiten-adresse.test.ts` (8), `src/lib/zahlung/erstattung.test.ts` (9), `src/lib/data/admin-alltag.db.test.ts` (5, Datenbank).

Geändert (im Schreibrecht)
- `src/payload/collections/Vorgaenge.ts`: Mailverlauf mit Betreff und Text, Gruppe „Storno: Erstattung“, Korrekturpositionen mit „Summe nach Korrektur“ (virtuell), „Stand der Zahlung“ (virtuell), Weg, Beleg und „Berichtigung: Grund“ in der Gruppe Erstattung, Knöpfe. In diesem Lauf: Das bisherige Textfeld „Nachricht an den Kunden“ heißt jetzt „Zusatz zur Statusmail“, damit es nicht mit dem neuen Knopf gleichen Namens verwechselt wird (nur die Beschriftung, kein Schema).
- `src/payload/collections/Seiten.ts`: Adresse beim Anlegen wählbar, danach fest (`access.update: false`), Hook für neue Seiten.
- `src/payload/collections/Produkte.ts`: Duplizier-Haken. In diesem Lauf berichtigt (siehe WAS UND WARUM 4).
- `src/payload/hooks/vermittlung.ts`: Weg und Beleg Pflicht, Berichtigung eines Irrtums; in diesem Lauf die Meldung „Zahlungsstand lässt sich nicht zurücksetzen“ um den dokumentierten Weg ergänzt.
- `src/lib/mail/versand.ts`: jede Mail speichert Betreff und Text im Protokoll (`mailVerlaufText`).
- `src/lib/types.ts` (Mailart `nachricht`, `subject`, `body`, `method`, `receipt`), `src/lib/data/payload-mapping.ts` (nur die neuen Felder), `src/payload-types.ts` (generiert), `src/migrations/index.ts`.
- `src/lib/server/create-record.ts`, `src/lib/data/index.ts`: Begrenzung offener Termine je E-Mail auch für den Partnertermin ohne Zeitfenster.
- `src/components/fahrzeug-anfrage/seiten.tsx`, `src/app/(site)/motorradschluessel/page.tsx`, `.../anfrage/page.tsx`, `src/app/sitemap.ts`: Zustand „Rubrik nicht live“. In diesem Lauf: Hinweis synchron darstellbar gemacht und `<a>` durch `Link` ersetzt (Lint).
- `src/app/(site)/[...unbekannt]/page.tsx`: Auffangroute zeigt eigene Inhaltsseiten.
- Tests angepasst: `src/app/sitemap.test.ts` und `src/components/fahrzeug-anfrage/seiten.test.tsx` (Attrappe für Rubriken, neue Fälle „Rubrik nicht live“), `src/payload/hooks/vermittlung.test.ts` und `src/lib/partner/vermittlung.db.test.ts` (Erstattungen tragen jetzt einen Weg).

Geändert außerhalb des ausdrücklichen Schreibrechts
- `src/app/(payload)/admin/importMap.js`: neu erzeugt mit `payload generate:importmap`. Ohne diese Einträge zeigt das Backend die drei neuen Knöpfe nicht an. Nur drei Zeilen Import und drei Zeilen Zuordnung kamen dazu.

## WAS UND WARUM

1. Kundenkontakt mit Verlauf. Knopf „Nachricht an den Kunden“ in der Seitenleiste: Vorlage (Rückfrage, Unterlagen fehlen, Termin verschieben, Abholung bereit) oder frei, Betreff und Text, Bestätigung, Versand über `sendeVorlage` (Resend wie im Bestand). Jede Mail, automatisch oder von Hand, steht jetzt mit Zeit, Art, Empfänger, Betreff, vollständigem Text und Ergebnis im Reiter „E-Mails“, auch wenn der Versand scheitert. Damit ist auch der Zusatz zur Statusmail, der nach dem Versand aus dem Feld geleert wird, im Verlauf lesbar. Sehr lange Texte (Vertragsbestätigung mit Rechtstexten) werden ab 60 000 Zeichen sichtbar gekürzt. Im Reiter „Kontakt“ stehen `mailto:` und `tel:`.
2. Korrekturposition. Positionen und Summen bleiben fest. Neue Einträge mit Betrag (plus oder minus, nicht 0), Grund, Datum und Bearbeiter (Datum und Bearbeiter setzt der Server), nur bei Bestellungen, nicht änderbar und nicht löschbar, Summe nach Korrektur nie unter 0. Die Anzeige nennt ursprüngliche Summe, Korrekturen und Summe nach Korrektur.
3. Storno und Erstattung. Baut auf FA-KERN-04 auf. Storno einer bezahlten oder teilweise erstatteten Zahlung nur mit Entscheidung „ganz“, „teilweise“ oder „keine“ (mit Grund); bei „ganz“ oder „teilweise“ muss die Erstattung im selben Speichern stehen. Jede neue Erstattung braucht einen Weg; außerhalb des Zahlungsdienstes zusätzlich einen Beleg. „Stand der Zahlung“ sagt in einem Satz: bezahlt, teilweise erstattet mit Betrag und Rest, erstattet. Der Knopf „Erstattung beim Zahlungsdienst auslösen“ ist sichtbar und abgeschaltet, mit Link ins Stripe-Dashboard; die Funktion dahinter ist ohne Schalter `ZAHLUNG_ERSTATTUNG=stripe` aus, an keinen Endpunkt gebunden und nur mit Attrappe getestet (G5).
4. Duplizieren. Befund im Zwischenstand: Der Haken der Kennung gab `undefined` zurück. Payload behält dann den Wert des Originals, und beim Anlegen reicht Payload das Original zudem als `originalDoc` an die Feld-Hooks; `kennungFeld` hielt so die Kennung des Originals fest. Folge: Das Duplizieren scheiterte an der Eindeutigkeit der Kennung (im Datenbanktest nachgestellt). Berichtigt in `Produkte.ts`: Der Haken liefert `null`, und beim Anlegen sieht der Kennungs-Hook das Original nicht. Ergebnis: neue Adresse `<original>-kopie-<kürzel>`, Kennung gleich der neuen Adresse, Entwurf, gleiche Bilder ohne neue Dateien, Original unverändert.
5. Neue Seiten. In „Seitentexte“ legt der Betreiber eine Seite mit eigener Adresse an: ein Abschnitt, Kleinbuchstaben, Ziffern, einzelne Bindestriche, 3 bis 60 Zeichen, keine vorhandene Route (Liste, die ein Test mit den Ordnern unter `src/app` abgleicht), keine reservierten Namen. Neu angelegt immer `noindex`. Die Auffangroute `[...unbekannt]` zeigt veröffentlichte Seiten mit Überschrift, Einleitung, Abschnitten und Fragen; alles andere bleibt 404. Keine neue Bibliothek.
6. Betreiberanleitung `docs/betrieb/admin-alltag.md`.
7. Offene Punkte aus früheren Paketen:
   - Begrenzung offener, unbezahlter Termine je E-Mail gilt jetzt auch für den Partnertermin ohne Zeitfenster (mit Zahlung). Termine ohne Zeitfenster zählen 24 Stunden lang als offen (`OHNE_ZEITFENSTER_STUNDEN`), danach verfallen sie wie vergangene Termine. Die Sperre liegt für beide Arten auf derselben Kundensperre (Reihenfolge Kunde, dann Tag). Bedingung für `PARTNERMODELL_B` damit erfüllt.
   - Rubrik nicht live: Einstiegs- und Anfrageseiten aller Fahrzeugklassen zeigen einen ruhigen Hinweis mit Telefon (ohne gepflegtes Telefon den Weg zum Kontaktformular) statt Formular und Knopf, stehen auf `noindex` und fehlen in der Sitemap. Zuordnung Klasse zu Rubrik gleich der in `src/lib/actions/records.ts`.
   - Bestellungen und die Regeln aus FA-KERN-04: Status, Notizen, Versand und Zahlung bleiben wie im Bestand bedienbar. Einziger Engpass war der nicht zurücksetzbare Zahlungsstand nach einer Erstattung. Dafür gibt es jetzt „Berichtigung: Grund“: nur mit Grund, nur kleiner, nur außerhalb des Zahlungsdienstes und nicht bei vermittelten Aufträgen; der Vorgang steht in den Notizen und im Kundenverlauf. Die Fehlermeldung verweist auf diesen Weg.

## PRÜFUNG UND ERGEBNIS

Alle über die Datenweiche, am Ende dieses Laufs:
- `sicher.sh --json -- npx vitest run`: 205 Dateien, 3091 Tests bestanden.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 21 Dateien, 118 Tests bestanden.
- `sicher.sh --json -- npm run build`: erfolgreich.

Hinweis: Während des Laufs arbeitete FA-SEO-01B im selben Baum. Zwischendurch scheiterten deshalb ein Titeltest und `seo-laengen.test.ts` an dessen halbfertigem Stand; im Endlauf waren beide grün.

## BELEGE

Die verlangten Tests:
- Mailtext bleibt im Verlauf lesbar: `kunden-nachricht.test.ts` („sendet über den Mailweg und hält Betreff und vollständigen Text im Verlauf lesbar“, auch nach Lesen und Zurückschreiben über das Mapping; „hält auch eine gescheiterte Nachricht mit Text fest“; „speichert bei jeder Vorlage Betreff und Text“), Datenbank: `admin-alltag.db.test.ts` „speichert Betreff und vollständigen Text jeder Mail im Verlauf“.
- Storno ohne Entscheidung zur Erstattung nicht möglich: `storno-korrektur.test.ts` und Datenbank `admin-alltag.db.test.ts` (mit Benutzer, `overrideAccess: false`).
- Teilerstattung zeigt Betrag und Stand: `storno-korrektur.test.ts` „Teilerstattung zeigt Betrag und Stand“ („Teilweise erstattet: 15,00 € von 40,00 €. Es bleiben 25,00 €.“), `erstattung.test.ts`.
- Duplikat hat neue Kennung: `admin-alltag.db.test.ts` „Produkt duplizieren“ über `payload.duplicate`.
- Neue Seite unter reservierter Adresse abgelehnt: `seiten-adresse.test.ts` und Datenbank `admin-alltag.db.test.ts` (`impressum` reserviert, `kasse` vergeben, Adresse nach dem Anlegen fest, noindex).
- Weitere: Rubrik nicht live (`seiten.test.tsx`, `sitemap.test.ts`), Partnertermin ohne Zeitfenster (`admin-alltag.db.test.ts`), abgeschalteter Knopf ruft den Zahlungsdienst nie auf (`erstattung.test.ts`).

## OFFENE FRAGEN

1. Aufbewahrung der Mailtexte (R10): Die Texte liegen am Vorgang und folgen bis zur Entscheidung dessen Frist; eine eigene Löschung gibt es nicht. Frage an den Inhaber: Sollen sie wie Handelsbriefe sechs Jahre bleiben (§ 257 HGB), oder kürzer, etwa nur Betreff und Ergebnis nach Ablauf einer kürzeren Frist? Bitte mit der Datenschutzerklärung abstimmen; sie nennt den Mailverlauf am Vorgang bisher nicht.
2. Rückkanal für Antworten: Antworten des Kunden landen im Postfach (Antwortadresse aus den Einstellungen). Für einen Rückkanal in den Vorgang bräuchte es eingehende Mails bei Resend (Inbound-Webhook auf eine eigene Subdomain mit MX-Eintrag), einen signaturgeprüften Endpunkt, Zuordnung über die Vorgangsnummer im Betreff oder eine Antwortadresse je Vorgang, Spam- und Anhangsprüfung und eine Frist. Das berührt Domain, DNS und Resend (G3) und braucht den Inhaber.
3. Sitemap für eigene Seiten: Neue Inhaltsseiten stehen zunächst auf noindex. Nimmt der Betreiber den Haken heraus, erscheint die Seite noch nicht in der Sitemap (Schreibrecht an `sitemap.ts` nur für die Rubrik). Soll das ein späteres Paket ergänzen?
4. Mailverlauf alter Vorgänge: Mails vor diesem Stand haben keinen Text; der lässt sich nicht nachträglich herstellen.
5. Schalter `ZAHLUNG_ERSTATTUNG`: nur vorbereitet, nirgends gesetzt und in `.env.example` nicht eingetragen (kein Schreibrecht). Einschalten erst nach Freigabe durch den Inhaber und mit einem eigenen, geprüften Endpunkt.

## FÜR MENSCHEN

- Inhaber: Frist für die Mailtexte am Vorgang festlegen (Frage 1) und die Datenschutzerklärung prüfen lassen.
- Inhaber: Entscheiden, ob Antworten der Kunden später in den Vorgang laufen sollen (Frage 2; braucht DNS und Resend).
- Team: Anleitung `docs/betrieb/admin-alltag.md` einmal im Backend nachklicken und unklare Stellen melden.
- Vor dem Livegang: Migration `20261115_210337_admin_alltag` mit `payload migrate` einspielen (nur additiv).
