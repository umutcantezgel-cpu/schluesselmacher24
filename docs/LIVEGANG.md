# Livegang SCHLÜSSELMACHER24

Der Code ist fertig: Zahlung (Stripe), E-Mails (Resend), Datenbank und Dateiablage (Supabase), Hosting (Vercel), Rechtsseiten, Widerrufsbutton, Löschfristen und täglicher Zahlungsabgleich per Cron. Was bleibt, sind Konten anlegen, Werte eintragen und einmal durchklicken. Diese Anleitung führt in der richtigen Reihenfolge durch.

Alle Variablen mit Erklärung stehen in `.env.example`. Auf Vercel gehören sie **nur in den Scope „Production“**. Vorschau-Deployments bauen ohne Datenbank, Zahlung und Mails und können so nichts kaputt machen.

## Überblick

| Dienst | Wofür | Tarif |
|---|---|---|
| Domain-/Mailhoster | Domain `schluesselmacher24.de`, Postfach `info@schluesselmacher24.de` | vorhanden bzw. beim Hoster |
| Supabase (Region Frankfurt) | Postgres-Datenbank und privater Speicher für Fotos und Unterlagen | Start im **Free**-Plan: Wachhalten, eigene Sicherung und Überwachung sind eingerichtet ([SUPABASE.md](SUPABASE.md)). **Pro** zum echten Livegang empfohlen (keine Pausen, tägliche Backups) – Ablauf in SUPABASE.md, Abschnitt Pro-Wechsel |
| Vercel | Hosting, Region Frankfurt (`vercel.json`), tägliche Crons | **Pro** (laut Vercel-Bedingungen für gewerbliche Seiten vorgeschrieben) |
| Stripe | Online-Zahlung (Anzahlung Termin, Shop) | Gebühren je Zahlung |
| Resend | Versand der E-Mails | Free genügt für den Start (100 Mails/Tag), sonst Pro |

Reihenfolge: **1 Postfach → 2 Supabase → 3 Resend → 4 Stripe (Testmodus) → 5 Vercel → 6 Erster Deploy und Abnahme → 7 Stripe live**.

---

## 1. Postfach

`info@schluesselmacher24.de` als echtes Postfach einrichten (beim Domain- oder Mailhoster). Hier landen Antworten der Kunden und die Betriebsmails: neuer Vorgang, Zahlung eingegangen, Widerruf eingegangen.

## 2. Supabase: Datenbank und Dateiablage

Das Projekt `schluesselmacher24` (Region Frankfurt) ist angelegt und gehärtet. Alle Einzelheiten, Direktlinks und der Stand stehen in [SUPABASE.md](SUPABASE.md); hier nur die Reihenfolge.

1. **Härtung**: Die SQL-Dateien `supabase/sql/0001–0005` spielt Claude über das Supabase-MCP ein (Rechte, Rollen, RLS-Automatik, Lebenszeichen, privater Bucket `sm24-dateien`). Tabellen nie von Hand anlegen – das erledigen die Migrationen im ersten Produktions-Build.
2. **Dashboard-Einstellungen** nach der Klickliste in SUPABASE.md: Data API aus, SSL erzwingen, Registrierung aus, Realtime nur privat, alte API-Schlüssel aus, Upload-Grenze, S3-Schlüssel.
3. **Rollenpasswörter**: Für `sm24_migration`, `sm24_app` und `sm24_sicherung` je ein Zufallspasswort erzeugen und als SCRAM-Verifier setzen (`node scripts/scram-verifier.mjs <rolle>`, Ausgabe im SQL-Editor ausführen). Das `postgres`-Passwort zurücksetzen und nur im Passwortmanager aufbewahren – es gehört in keine Umgebungsvariable.
4. **Verbindungen** (Host aus **Connect**, Passwort der jeweiligen Rolle einsetzen):
   - `DATABASE_URL` = **Transaction pooler**, Port **6543**, Benutzer `sm24_app.<ref>` (Laufzeit, nur Datenrechte)
   - `DATABASE_URL_UNPOOLED` = **Session pooler**, Port **5432**, Benutzer `sm24_migration.<ref>` (nur Migrationen im Build)

   Nicht die „Direct connection“ (`db.<ref>.supabase.co`) nehmen, sie ist nur per IPv6 erreichbar und funktioniert aus Vercel nicht. Der Produktions-Build bricht ab, wenn die Laufzeit als `postgres` oder mit derselben Rolle wie die Migrationen läuft.
5. **Database → Settings → SSL Configuration → Download certificate**: Den Inhalt der Datei nach `DATABASE_CA_CERT` kopieren. Ohne Zertifikat bricht der Produktions-Build ab (sonst liefe die Verbindung unverschlüsselt).
6. **Storage → S3**: Endpoint `https://<ref>.storage.supabase.co/storage/v1/s3` → `STORAGE_ENDPOINT`, `STORAGE_REGION=eu-central-1`, `STORAGE_BUCKET=sm24-dateien`; Zugangsschlüssel „vercel-laufzeit“ → `STORAGE_ACCESS_KEY` und `STORAGE_SECRET_KEY`. Einen zweiten Schlüssel „sicherung“ für die nächtliche Sicherung anlegen (getrennt widerrufbar).
7. Nach dem ersten Build prüft `npm run pruefen:supabase` (oder der Build selbst) die Rechte: RLS auf allen Tabellen, keine Rechte für die API-Rollen, Eigentümer `sm24_migration`.

## 3. Resend: E-Mail-Versand

1. Konto anlegen, **Domains → Add domain** `schluesselmacher24.de`, Region **EU (Frankfurt)**, falls angeboten.
2. Die angezeigten DNS-Einträge beim Domainhoster setzen:
   - DKIM (TXT)
   - SPF (MX + TXT auf der Unterdomain `send`)
   - zusätzlich DMARC: TXT auf `_dmarc` mit `v=DMARC1; p=none; rua=mailto:info@schluesselmacher24.de`
3. Warten, bis die Domain „Verified“ zeigt.
4. **API Keys → Create** (Berechtigung „Sending access“, nur diese Domain) → `MAIL_API_KEY`.
5. Weitere Werte:
   - `MAIL_PROVIDER=resend`
   - `MAIL_FROM_ADDRESS=info@schluesselmacher24.de`
   - `MAIL_REPLY_TO=info@schluesselmacher24.de`
   - `MAIL_TEAM_ADDRESS=info@schluesselmacher24.de` (mehrere Empfänger kommagetrennt)

## 4. Stripe: Online-Zahlung (zuerst im Testmodus)

1. Konto anlegen und aktivieren:
   - Einzelunternehmen, Inhaber Mina Saad, Gloelstraße 11, 35576 Wetzlar
   - USt-IdNr. DE 282140471, Bankkonto für Auszahlungen
2. **Settings → Business → Public details**:
   - Öffentlicher Name `SCHLÜSSELMACHER24`
   - Kontoauszugstext `SCHLUESSELMACHER24`
   - Support-Telefon und -Mail wie im Impressum
   - Links zu AGB (`/rechtliches/agb`), Widerruf und Datenschutz
3. **Settings → Branding**: Logo und Farben, damit die Bezahlseite nach SCHLÜSSELMACHER24 aussieht.
4. **Settings → Payment methods**: Karte (inkl. Apple Pay und Google Pay) aktivieren; optional PayPal. Was aktiv ist, muss in `PAYMENT_METHODS` stehen, z. B. `card` oder `card,paypal`. Die Liste gilt für **alle** Zahlungen, also für Bestellungen und für Anzahlungen auf Termine. Deshalb **keine verzögerten Zahlarten wie SEPA-Lastschrift** eintragen: Die Bestätigung kommt erst nach Tagen, ein Termin bleibt aber nur 30 Minuten reserviert.
5. **Settings → Customer emails → „Successful payments“ aus**: Die Website schickt selbst eine Zahlungsbestätigung, sonst kommt sie doppelt.
6. **Developers → Webhooks → Add endpoint**: URL `https://schluesselmacher24.de/api/zahlung/stripe`, genau diese 6 Ereignisse:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.refunded`
   - `charge.dispute.created`

   Signing secret → `PAYMENT_WEBHOOK_SECRET`.
7. **Developers → API keys**: Secret key → `PAYMENT_API_KEY` (im Testmodus `sk_test_…`). Dazu `PAYMENT_PROVIDER=stripe`.
8. Optional: `PAYMENT_INVOICES=1`, wenn Stripe zu jeder Zahlung eine Rechnung erzeugen soll (kostenpflichtige Stripe-Funktion). Sonst kommen Rechnungen wie gewohnt aus der Buchhaltungssoftware, mit dem CSV-Export im Backend als Grundlage.

Erstattungen löst ihr im Stripe-Dashboard aus. Der Stand am Vorgang folgt automatisch.

## 5. Vercel: Hosting

Das Projekt `schluesselmacher24` ist bereits mit dem GitHub-Repo verbunden (Team `team-1d0c`) und baut Vorschauen.

1. Tarif **Pro** (laut Vercel-Bedingungen für gewerbliche Seiten vorgeschrieben; das Team ist derzeit auf Hobby). Mit Pro kann der Zahlungsabgleich in `vercel.json` stündlich laufen (`"schedule": "7 * * * *"`); täglich genügt aber, weil Stripe abgebrochene Zahlungen sofort meldet.
2. **Settings → Environment Variables**, Scope **nur Production**:

| Variable | Wert |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://schluesselmacher24.de` |
| `NEXT_PUBLIC_SERVER_URL` | `https://schluesselmacher24.de` |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` (oder 64 zufällige Zeichen) |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `SEED_ADMIN_EMAIL` | E-Mail für den ersten Backend-Zugang |
| `SEED_ADMIN_PASSWORD` | mindestens 12 Zeichen, nach der ersten Anmeldung ändern |
| `DATABASE_URL` (`sm24_app`), `DATABASE_URL_UNPOOLED` (`sm24_migration`), `DATABASE_CA_CERT` | aus Schritt 2 |
| `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` | aus Schritt 2 |
| `MAIL_*` | aus Schritt 3 |
| `PAYMENT_*` | aus Schritt 4 |

3. **Settings → Domains**: `schluesselmacher24.de` hinzufügen, `www.schluesselmacher24.de` auf die Hauptdomain umleiten, die angezeigten DNS-Einträge beim Hoster setzen.
4. Die Region (Frankfurt, `fra1`) und die beiden täglichen Crons (Löschfristen, Zahlungsabgleich) kommen aus `vercel.json`. Dafür ist nichts zu tun.

## 6. Erster Deploy und Abnahme

1. **Deployments → Redeploy** auf `main`, ohne Build-Cache. Im Build-Log läuft:
   - Prüfung der Pflichtvariablen (bricht mit klarer Meldung ab, wenn etwas fehlt)
   - Migrationen (als `sm24_migration`), danach die Datenbankrechte-Prüfung, dann der Seed (Firmendaten, Preise, Inhalte)
   - Anlage des ersten Backend-Zugangs
   - Livegang-Prüfung (bricht ab, wenn Firmendaten oder Rechtsseiten noch Platzhalter enthalten)
   - `next build`
2. `https://schluesselmacher24.de/admin` mit `SEED_ADMIN_EMAIL` und `SEED_ADMIN_PASSWORD` anmelden und **sofort das Passwort ändern**.
3. **Verwaltung → Einstellungen**:
   - **Firma**: Daten prüfen (Inhaber, Anschrift Gloelstraße 11, Werkstatt Langgasse 70, Telefon, E-Mail, Kammer).
   - **Öffnungszeiten** und **Termine**: echte Zeiten eintragen; unter Termine das Bundesland für die gesetzlichen Feiertage (Standard Hessen).
   - **Versand**: Lieferzeiten je Versandart eintragen.
   - **Anbindungen**: Zahlung, E-Mail und Dateiablage müssen „eingerichtet“ zeigen. **Testmail an mich** senden.

   Wichtig: Änderungen an `content/settings.json` wirken nach dem ersten Build nicht mehr, ab dann nur noch im Backend pflegen.
4. Durchklicken mit der Stripe-Testkarte `4242 4242 4242 4242` (beliebiges Datum in der Zukunft, beliebige Prüfziffer):
   - **Autoschlüssel-Termin buchen**: Weiterleitung zu Stripe → Zahlung → zurück auf die Bestellseite mit „bezahlt“. Kunde und Betrieb bekommen Mails, der Vorgang zeigt im Backend Zahlung und Mail-Protokoll.
   - **Termin abbrechen**: Auf der Stripe-Seite zurück. Die Bestellseite zeigt „abgebrochen“ mit „Erneut bezahlen“. Nach 30 Minuten ist der Termin wieder frei.
   - **Schlüssel nach Code bestellen**: Warenkorb → Kasse → Stripe → bezahlt.
   - **Foto hochladen** (Schlüssel nach Vorlage): Die Datei liegt danach in Supabase unter `sm24-dateien/kundendateien/`.
   - **Widerrufsformular** (Fußzeile „Vertrag widerrufen“): Eingangsbestätigung per Mail, Eintrag unter Aufträge → Widerrufe.
   - **Vercel → Settings → Cron Jobs**: beide Crons einmal per „Run“ auslösen, im Log steht eine Antwort mit Zählern.
5. Testvorgänge im Backend stornieren. Die Vorgangsnummern sind fortlaufend; wenn möglich vorher in einer Vorschau-Umgebung mit eigener Datenbank testen (`SM24_PREVIEW_MIGRATE=1`, Scope Preview).

## 7. Stripe live schalten

1. In Stripe auf **Live** wechseln, den Webhook-Endpunkt dort erneut anlegen (gleiche URL, gleiche 6 Ereignisse).
2. In Vercel `PAYMENT_API_KEY` (`sk_live_…`) und `PAYMENT_WEBHOOK_SECRET` (Live-Endpunkt) ersetzen und **neu deployen**.
3. Eine echte Zahlung mit kleinem Betrag machen und in Stripe erstatten. Der Vorgang zeigt danach „erstattet“.

---

## Was nicht technisch ist (vor dem Livegang)

- **Rechtstexte prüfen lassen.** AGB, Widerrufsbelehrung, Datenschutz und Impressum sind vollständige Entwürfe auf Basis eurer Daten, aber keine Rechtsberatung. Ein Anwalt oder ein Rechtstexte-Dienst muss sie freigeben. Eigene Texte lassen sich unter Einstellungen → Rechtstexte einfügen und ersetzen dann den Entwurf. Zu bestätigen sind u. a.:
  - Rücksendekosten
  - Gerichtsstand Wetzlar für Kaufleute
  - Regeln zur Anzahlung bei Absage
  - Kammerangabe im Impressum
- **Auftragsverarbeitungsverträge** mit Vercel, Supabase, Stripe und Resend abschließen (jeweils im Dashboard bzw. in deren DPA).
- **Verpackungsgesetz**: vor dem ersten Versand Registrierung im Register LUCID und Systembeteiligung für Versandverpackungen.
- **Freigeben bzw. pflegen**:
  - Preise, Terminlängen, Anzahlung und Fahrzeug-Preisgruppen
  - Öffnungszeiten
  - Hersteller der 52 Codelinien inkl. GPSR-Herstellerangaben (Produkte → GPSR)
  - Lieferzeiten
- **Standortseiten** (`/standorte/*`): Wetzlar ist mit belegten Angaben online. Weitere Orte nur mit echten örtlichen Texten; Seiten mit Platzhaltern bleiben automatisch auf noindex (Erg. Leitfaden §5).
- **Barrierefreiheit (BFSG)**: Gilt die Ausnahme für Kleinstunternehmen (unter 10 Beschäftigte, höchstens 2 Mio. € Umsatz)? Bitte festhalten.
- **Google Search Console** per DNS verifizieren oder den Code aus der Search Console als `GOOGLE_SITE_VERIFICATION` in Vercel eintragen und neu deployen. Danach `https://schluesselmacher24.de/sitemap.xml` einreichen.
- **Google Analytics 4 (optional, nur nach Einwilligung):**
  1. Mess-ID (`G-…`) als `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel eintragen und neu deployen. Ohne ID lädt nichts von Google, und es erscheint kein Einwilligungshinweis.
  2. In GA4 die Aufbewahrungsdauer festlegen, Google-Signale und Werbefunktionen aus lassen und die Auftragsverarbeitungsbedingungen akzeptieren. Unter „Optimierte Analysen“ die Option „Seitenänderungen basierend auf Browserverlaufsereignissen“ ausschalten: Die Seite meldet Seitenaufrufe selbst, immer ohne Adressparameter, und auf Vorgangsseiten (`/bestellung/…`) gar nicht.
  3. Die Ereignisse `bestellung`, `fotoanfrage`, `terminanfrage`, `partneranmeldung` und `projektanfrage` als Schlüsselereignisse markieren.
  4. Datenschutzerklärung und Cookie-Seite schalten den GA4-Abschnitt automatisch ein. Beides vor dem Einschalten juristisch prüfen lassen.

## Betrieb

- **Backups**: Supabase Pro sichert die Datenbank täglich, die Dateien sichert wöchentlich `scripts/sicherung.mjs` (siehe [Sicherung und Wiederherstellung](#sicherung-und-wiederherstellung)). Vor größeren Updates zusätzlich einen manuellen Backup anlegen.
- **Termin-Erinnerungen** verschickt der tägliche Cron an Termine in „Tage vorher“ Tagen (Einstellungen → Buchung, 0 = aus), mit Kalendereintrag. Die Zähler stehen in der Antwort des Crons (Vercel → Logs).
- **Updates**: Dependabot schlägt Paket-Updates vor, die CI prüft jeden PR. Migrationen nur additiv; ein Rollback auf Vercel stellt den Code zurück, nicht die Datenbank.
- **Fehler finden**: Vercel → Logs (Funktionen, Crons). Scheitert ein Mailversand, steht das im Mail-Protokoll am Vorgang.
- **Löschfristen** laufen automatisch (täglicher Cron). Die Fristen stehen unter Einstellungen → Aufbewahrung.
- **Erstattungen** im Stripe-Dashboard; **Statusmails** gehen beim Statuswechsel im Backend automatisch raus (Häkchen „Kunden informieren“).

## Sicherung und Wiederherstellung

Leitfaden Kap. 18 verlangt ein Backup- und Wiederherstellungskonzept. Es besteht aus zwei Teilen, ohne zusätzliche Dienste:

| Was | Wie | Wie oft |
|---|---|---|
| Datenbank (Vorgänge, Einstellungen, Inhalte, Benutzer) | Supabase Pro: automatische Backups (**Database → Backups**), zusätzlich ein Abzug mit `pg_dump` durch das Skript | täglich automatisch, wöchentlich Skript |
| Dateiablage (Fahrzeugscheine, Schlüsselfotos, Grundrisse, Medien) | `scripts/sicherung.mjs` lädt alle Objekte des Buckets herunter | wöchentlich |

Die Datenbank-Backups von Supabase enthalten **nicht** die Dateien im Storage — deshalb das Skript.

### Wöchentlich: Sicherung ausführen

1. Einmalig auf dem Rechner, der sichert, im Projektordner die Datei `.env.sicherung` anlegen (wird wie alle `.env*` nicht eingecheckt):
   - `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_BUCKET` wie in Vercel
   - `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`: am besten einen **eigenen Zugangsschlüssel** für die Sicherung anlegen (Supabase → Storage → S3 Connection → New access key), damit er sich getrennt widerrufen lässt
   - `DATABASE_URL_UNPOOLED` (Session-Pooler, Port 5432) und `DATABASE_CA_CERT` wie in Vercel
2. `npm install` (einmalig; das S3-Paket kommt mit der Dateiablage-Anbindung von Payload mit).
3. Sicherung starten:
   ```bash
   node --env-file=.env.sicherung scripts/sicherung.mjs
   ```
   Ergebnis im Ordner `sicherung/<Datum>/` (anderer Ort: `SICHERUNG_ZIEL=/pfad/zum/ziel`):
   - `dateien/` — alle Objekte mit ihren Pfaden im Bucket (z. B. `kundendateien/…`, `medien/…`)
   - `dateien.json` — Verzeichnis mit Größe, Änderungsdatum und ETag je Objekt
   - `datenbank.dump` — nur, wenn `pg_dump` installiert ist (PostgreSQL-Clientprogramme, Version 17 oder neuer; `pg_dump --version`). Fehlt es, überspringt das Skript die Datenbank — die täglichen Supabase-Backups bleiben.
   Ein abgebrochener Lauf in denselben Ordner lädt nur fehlende Dateien nach. Bei Fehlern endet das Skript mit Code 1.
4. Den Ordner auf ein **verschlüsseltes** Laufwerk verschieben — er enthält Fahrzeugscheine und Kundendaten. Ältere Sicherungen nicht unbegrenzt aufheben: Was nach den Löschfristen (Einstellungen → Aufbewahrung) gelöscht wurde, soll auch in Sicherungen nicht dauerhaft liegen bleiben. Wie viele Stände aufbewahrt werden, legt der Inhaber fest.

### Wiederherstellung

Erst die Datenbank, dann die Dateien — die Einträge der Sammlungen „Kundendateien“, „Interne Dateien“ und „Medien“ verweisen auf die Objekte im Bucket.

1. **Datenbank**
   - Bevorzugt: Supabase → **Database → Backups** → gewünschten Stand wiederherstellen. Die Seite ist währenddessen nicht erreichbar.
   - Aus dem Abzug des Skripts (z. B. wenn der Supabase-Stand zu alt ist):
     ```bash
     pg_restore --clean --if-exists --no-owner --no-privileges --dbname "$DATABASE_URL_UNPOOLED" sicherung/<Datum>/datenbank.dump
     ```
     Der Abzug enthält auch die Tabelle der Migrationen; danach auf Vercel neu deployen, damit spätere Migrationen laufen.
2. **Dateiablage**: Den Inhalt von `sicherung/<Datum>/dateien/` mit unveränderten Pfaden in den Bucket zurückspielen, z. B. mit der kostenlosen AWS-CLI und dem Zugangsschlüssel aus `.env.sicherung`:
   ```bash
   aws s3 sync sicherung/<Datum>/dateien "s3://$STORAGE_BUCKET" --endpoint-url "$STORAGE_ENDPOINT" --region "$STORAGE_REGION"
   ```
   Einzelne Dateien lassen sich auch im Supabase-Dashboard (Storage) in den passenden Ordner hochladen.
3. Im Backend einen Vorgang mit Upload öffnen und eine Datei aufrufen — erscheint sie, passt die Zuordnung.

**Probe**: Einmal nach dem Livegang den Abzug in die lokale Entwicklungsdatenbank einspielen (`npm run db:start`, dann `pg_restore … --dbname postgres://postgres:postgres@127.0.0.1:5433/schluesselmacher24`), um zu sehen, dass die Sicherung vollständig ist.
