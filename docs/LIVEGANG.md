# Livegang SCHLÜSSELMACHER24

Der Code ist fertig: Zahlung (Stripe), E-Mails (Resend), Datenbank und Dateiablage (Supabase), Hosting (Vercel), Rechtsseiten, Widerrufsbutton, Löschfristen und täglicher Zahlungsabgleich per Cron. Was bleibt, sind Konten anlegen, Werte eintragen und einmal durchklicken. Diese Anleitung führt in der richtigen Reihenfolge durch.

Alle Variablen mit Erklärung stehen in `.env.example`. Auf Vercel gehören sie **nur in den Scope „Production“**. Vorschau-Deployments bauen ohne Datenbank, Zahlung und Mails und können so nichts kaputt machen.

## Überblick

| Dienst | Wofür | Tarif |
|---|---|---|
| Domain-/Mailhoster | Domain `schluesselmacher24.de`, Postfach `info@schluesselmacher24.de` | vorhanden bzw. beim Hoster |
| Supabase (Region Frankfurt) | Postgres-Datenbank und privater Speicher für Fotos und Unterlagen | **Pro** (Free pausiert nach Inaktivität und hat keine Backups) |
| Vercel | Hosting, Region Frankfurt (`vercel.json`), tägliche Crons | **Pro** (laut Vercel-Bedingungen für gewerbliche Seiten vorgeschrieben) |
| Stripe | Online-Zahlung (Anzahlung Termin, Shop) | Gebühren je Zahlung |
| Resend | Versand der E-Mails | Free genügt für den Start (100 Mails/Tag), sonst Pro |

Reihenfolge: **1 Postfach → 2 Supabase → 3 Resend → 4 Stripe (Testmodus) → 5 Vercel → 6 Erster Deploy und Abnahme → 7 Stripe live**.

---

## 1. Postfach

`info@schluesselmacher24.de` als echtes Postfach einrichten (beim Domain- oder Mailhoster). Hier landen Antworten der Kunden und die Betriebsmails: neuer Vorgang, Zahlung eingegangen, Widerruf eingegangen.

## 2. Supabase: Datenbank und Dateiablage

1. Neues Projekt anlegen: Region **Frankfurt (eu-central-1)**, sicheres Datenbank-Passwort notieren. Tarif Pro.
2. **Connect** öffnen und die Verbindungen kopieren (Passwort einsetzen):
   - **Transaction pooler** (Port **6543**) → `DATABASE_URL`
   - **Session pooler** (Port **5432**, Host `…pooler.supabase.com`) → `DATABASE_URL_UNPOOLED`

   Nicht die „Direct connection“ (`db.<ref>.supabase.co`) nehmen, sie ist nur per IPv6 erreichbar und funktioniert aus Vercel nicht.
3. **Database → Settings → SSL Configuration → Download certificate**: Den Inhalt der Datei nach `DATABASE_CA_CERT` kopieren. Ohne Zertifikat scheitert die Verbindung.
4. **Storage → New bucket**: Name `sm24-dateien`, **Public aus**. Dort liegen Fahrzeugscheine, Schlüsselfotos und Grundrisse, sie dürfen nie öffentlich sein.
5. **Storage → S3 Connection**:
   - Endpoint → `STORAGE_ENDPOINT` (`https://<ref>.storage.supabase.co/storage/v1/s3`)
   - Region → `STORAGE_REGION` (`eu-central-1`)
   - **New access key** → `STORAGE_ACCESS_KEY` und `STORAGE_SECRET_KEY`
   - `STORAGE_BUCKET=sm24-dateien`
6. Tabellen müssen nicht von Hand angelegt werden, das erledigt der erste Produktions-Build über die Migrationen.

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
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `DATABASE_CA_CERT` | aus Schritt 2 |
| `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` | aus Schritt 2 |
| `MAIL_*` | aus Schritt 3 |
| `PAYMENT_*` | aus Schritt 4 |

3. **Settings → Domains**: `schluesselmacher24.de` hinzufügen, `www.schluesselmacher24.de` auf die Hauptdomain umleiten, die angezeigten DNS-Einträge beim Hoster setzen.
4. Die Region (Frankfurt, `fra1`) und die beiden täglichen Crons (Löschfristen, Zahlungsabgleich) kommen aus `vercel.json`. Dafür ist nichts zu tun.

## 6. Erster Deploy und Abnahme

1. **Deployments → Redeploy** auf `main`, ohne Build-Cache. Im Build-Log läuft:
   - Prüfung der Pflichtvariablen (bricht mit klarer Meldung ab, wenn etwas fehlt)
   - Migrationen, Seed (Firmendaten, Preise, Inhalte)
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
- **Stadtseiten** (`/standorte/*`) bleiben auf noindex, bis örtliche Texte gepflegt sind.
- **Barrierefreiheit (BFSG)**: Gilt die Ausnahme für Kleinstunternehmen (unter 10 Beschäftigte, höchstens 2 Mio. € Umsatz)? Bitte festhalten.
- **Google Search Console** per DNS verifizieren und `https://schluesselmacher24.de/sitemap.xml` einreichen.

## Betrieb

- **Backups**: Supabase Pro sichert täglich. Vor größeren Updates zusätzlich einen manuellen Backup anlegen.
- **Updates**: Dependabot schlägt Paket-Updates vor, die CI prüft jeden PR. Migrationen nur additiv; ein Rollback auf Vercel stellt den Code zurück, nicht die Datenbank.
- **Fehler finden**: Vercel → Logs (Funktionen, Crons). Scheitert ein Mailversand, steht das im Mail-Protokoll am Vorgang.
- **Löschfristen** laufen automatisch (täglicher Cron). Die Fristen stehen unter Einstellungen → Aufbewahrung.
- **Erstattungen** im Stripe-Dashboard; **Statusmails** gehen beim Statuswechsel im Backend automatisch raus (Häkchen „Kunden informieren“).
