# Supabase – Einrichtung, Betrieb und Notfälle

Diese Seite ist das Handbuch für die Datenbank und die Dateiablage von SCHLÜSSELMACHER24. Sie beschreibt, was eingerichtet ist, was der Inhaber im Dashboard selbst einstellen muss, wie das Projekt wach bleibt, wie gesichert und wiederhergestellt wird und wie der Wechsel auf Pro abläuft. Die Reihenfolge des Livegangs steht in [LIVEGANG.md](LIVEGANG.md).

## Überblick

| | Projekt A `schluesselmacher24` | Projekt B `schluesseldienst` |
|---|---|---|
| Ref | `csheqgiqnxwbfbfrlmly` | `yethvdkerjsrpyjadvrl` |
| Zweck | Produktions-Datenbank und privater Datei-Bucket für Payload | Betriebswerte-Zentrale der Seite schluesseldienst (eigenes Repo, siehe dort `docs/BETRIEB.md`) |
| Region, Version | Frankfurt (`eu-central-1`), Postgres 17 | ebenso |
| Organisation | `Schluesselmacher24` (`cizefcjhvmoyuodkacci`), Free-Plan | ebenso (vor einem Pro-Wechsel in eine eigene Free-Organisation, siehe unten) |

Grundsätze:

- **Keine öffentliche Supabase-Schnittstelle.** Die Data API (REST/GraphQL) ist aus; Payload spricht die Datenbank nur über den Pooler an, Dateien nur über die S3-Schnittstelle des Servers. Auth und Realtime werden nicht genutzt.
- **Drei Rollen statt `postgres`.** Migrationen laufen als Eigentümer `sm24_migration`, die Website als `sm24_app` (nur Daten lesen und schreiben), die Sicherung als `sm24_sicherung` (nur lesen). Das `postgres`-Passwort liegt nur im Passwortmanager.
- **RLS als Stolperdraht.** Jede Tabelle hat Row Level Security ohne Policies; damit sehen die API-Rollen nichts, auch wenn die Data API versehentlich wieder eingeschaltet würde. `sm24_app` und `sm24_sicherung` haben dafür das Attribut BYPASSRLS.
- **Free-Plan bewusst ausgereizt**: Wachhalten in mehreren Ebenen, eigene verschlüsselte Sicherung außerhalb von Supabase, Kontingent-Wächter. Free hat **keine** Backups – die nächtliche Sicherung ist deshalb Pflicht.

## SQL-Dateien

Die Datenbank-Einstellungen sind versioniert in `supabase/sql/` und werden von Claude über das Supabase-MCP mit `apply_migration` eingespielt (Name `sm24_<datei>`; `list_migrations` zeigt, was angewendet ist). Jede Datei ist idempotent und enthält keine Passwörter. Eine angewendete Datei wird nicht mehr geändert – Änderungen kommen als neue Datei mit der nächsten Nummer. `supabase/migrations/` wird bewusst nicht verwendet, damit keine CLI- oder GitHub-Integration selbstständig migriert.

| Datei | Inhalt | Stand Projekt A |
|---|---|---|
| `0001_grundschutz.sql` | `anon`, `authenticated`, `service_role` bekommen in `public` nichts, auch nicht für künftige Objekte | angewendet |
| `0002_rollen.sql` | Rollen `sm24_migration`, `sm24_app`, `sm24_sicherung` mit Zeitgrenzen, Verbindungslimits und Rechten | angewendet |
| `0003_rls_automatik.sql` | Event-Trigger `sm24_rls_automatik`: jede neue Tabelle in `public` und `intern` bekommt RLS; bricht eher ab, als eine Tabelle ohne RLS zuzulassen | offen |
| `0004_lebenszeichen.sql` | `intern.lebenszeichen` und `intern.lebenszeichen_setzen()` für Wachhalten und Überwachung | offen |
| `0005_ablage.sql` | privater Bucket `sm24-dateien`, 5 MB, nur die Dateitypen der Upload-Sammlungen | offen |

Lokal und in CI spielt `node scripts/supabase-rechte.mjs anwenden --nachbildung` dieselben Dateien ein; `supabase/nachbildung.sql` bildet dafür die Supabase-Rollen nach. Die DB-Tests laufen so wie die Produktion: Migrationen als `sm24_migration`, alle Tests als `sm24_app` (`src/test/db-global-setup.ts`, `src/test/rollen.db.test.ts`).

**Rechte-Prüfung**: `supabase/pruefungen/rechte.sql` listet jede Abweichung als Befund (RLS aus, Rechte für API-Rollen, falscher Eigentümer, fehlender Event-Trigger, Laufzeitrolle mit DDL-Rechten …). Sie läuft im Produktions-Build direkt nach den Migrationen als `sm24_app` und bricht den Build bei Befunden ab (Notausgang `SM24_RECHTE_PRUEFUNG=warnung`); von Hand mit `npm run pruefen:supabase`.

Erwartete Hinweise der Supabase-Advisors: „RLS enabled, no policy“ (Stufe INFO) für alle Tabellen – gewollt, das ist die Sperre für die API-Rollen.

## Dashboard-Klickliste (Inhaber)

Diese Einstellungen kann Claude nicht über das MCP setzen. Für Projekt A (`csheqgiqnxwbfbfrlmly`) und Projekt B (`yethvdkerjsrpyjadvrl`) jeweils:

| # | Wo | Was |
|---|---|---|
| 1 | [Account → Security](https://supabase.com/dashboard/account/security) | MFA für das Supabase-Konto einschalten (beim GitHub-Login: GitHub-2FA) |
| 2 | Organisation → Legal Documents | Auftragsverarbeitungsvertrag (DPA) abschließen |
| 3 | [Organisation → Billing](https://supabase.com/dashboard/org/cizefcjhvmoyuodkacci/billing) | Rechnungs-E-Mail auf ein gelesenes Postfach setzen – dorthin gehen die Warnungen vor dem Pausieren |
| 4 | `https://supabase.com/dashboard/project/<ref>/database/settings` | **Reset database password** für `postgres`: neues Passwort nur in den Passwortmanager. **Enforce SSL on incoming connections** einschalten (kurzer Neustart). **Download certificate** → Inhalt nach `DATABASE_CA_CERT` |
| 5 | `https://supabase.com/dashboard/project/<ref>/integrations/data_api/overview` | **Enable Data API** ausschalten |
| 6 | `https://supabase.com/dashboard/project/<ref>/auth/providers` | **Allow new users to sign up** aus; E-Mail-, Telefon- und anonyme Anmeldung aus; keine Redirect-URLs |
| 7 | `https://supabase.com/dashboard/project/<ref>/realtime/settings` | öffentlichen Zugriff aus (nur private Kanäle) |
| 8 | `https://supabase.com/dashboard/project/<ref>/settings/api-keys` | Legacy-Schlüssel (`anon`, `service_role`) deaktivieren – nichts verwendet sie |
| 9 | `https://supabase.com/dashboard/project/<ref>/storage/settings` (nur A) | globale Upload-Grenze **10 MB**; S3-Protokoll an; zwei S3-Zugangsschlüssel: „vercel-laufzeit“ (→ Vercel) und „sicherung“ (→ GitHub-Environment `sicherung`). Beide haben volle Rechte auf alle Buckets; getrennt sind sie, damit jeder einzeln widerrufen werden kann |
| 10 | `https://supabase.com/dashboard/project/<ref>/sql/new` | Rollenpasswörter als Verifier setzen (nächster Abschnitt) |

Bewusst **nicht** eingeschaltet: Network Restrictions (Vercel und GitHub haben wechselnde Adressen; Ersatz sind SSL-Pflicht, Zertifikatsprüfung und die getrennten Rollen) und die Vercel-Supabase-Integration (sie schriebe `postgres`-Zugangsdaten auch in Vorschau-Deployments).

## Rollenpasswörter

Postgres speichert Passwörter ohnehin nur als SCRAM-Verifier. Wer den Verifier statt des Klartexts setzt, hinterlässt das Passwort weder in der Historie des SQL-Editors noch in Protokollen.

1. Im Passwortmanager je Rolle ein Zufallspasswort erzeugen (mindestens 24 Zeichen, nur druckbare ASCII-Zeichen).
2. `node scripts/scram-verifier.mjs sm24_app` aufrufen und das Passwort eingeben (wird nicht angezeigt). Ausgabe: `alter role sm24_app password 'SCRAM-SHA-256$4096:…';`
3. Diese Zeile im SQL-Editor des Projekts ausführen.
4. Die Zeile zusätzlich im Passwortmanager ablegen: Nach einer Wiederherstellung, einem Upgrade und eventuell nach einer Pause fehlen die Passwörter eigener Rollen und werden damit neu gesetzt.

Rollen: `sm24_migration`, `sm24_app`, `sm24_sicherung` (A) und `sd_export` (B, Werkzeug im Repo schluesseldienst). Ohne Node geht es mit `\password <rolle>` in `psql`.

## Verbindungen und Vercel

Nur im Scope **Production**, als „Sensitive“ markiert. Den Pooler-Host zeigt **Connect** (Form `aws-…-eu-central-1.pooler.supabase.com`).

| Variable | Wert |
|---|---|
| `DATABASE_URL` | `postgresql://sm24_app.csheqgiqnxwbfbfrlmly:<passwort>@<pooler-host>:6543/postgres` |
| `DATABASE_URL_UNPOOLED` | `postgresql://sm24_migration.csheqgiqnxwbfbfrlmly:<passwort>@<pooler-host>:5432/postgres` |
| `DATABASE_CA_CERT` | Inhalt des heruntergeladenen Zertifikats |
| `STORAGE_ENDPOINT` | `https://csheqgiqnxwbfbfrlmly.storage.supabase.co/storage/v1/s3` |
| `STORAGE_REGION` | `eu-central-1` |
| `STORAGE_BUCKET` | `sm24-dateien` |
| `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` | S3-Schlüssel „vercel-laufzeit“ |

Sonderzeichen im Passwort in der Adresse prozentkodieren. Der Produktions-Build prüft die Rollentrennung (`scripts/build.mjs`): Laufzeit als `postgres` oder dieselbe Rolle für Laufzeit und Migrationen bricht ab (Notausgang `SM24_ROLLENTRENNUNG=aus`).

## Wachhalten

Free-Projekte pausieren nach etwa sieben Tagen mit zu wenig Datenbank-Aktivität. Gegenmittel in Ebenen:

| Ebene | Projekt A | Projekt B |
|---|---|---|
| Arbeitslast | Vercel-Crons `taeglich` (02:17 UTC) und `zahlungen` (03:47 UTC); `taeglich` setzt das Lebenszeichen `cron-taeglich` | – |
| Workflows über den Pooler | `sicherung.yml` um 00:41 und 12:41 UTC | `betriebswerte.yml` um 03:23 und 15:23 UTC |
| Uptime-Monitor | `/api/gesundheit?schluessel=…` alle 3–5 Minuten (kostenloser Dienst, z. B. Better Stack oder UptimeRobot; Nutzungsbedingungen für gewerbliche Seiten prüfen) | – |
| Aufsicht | wöchentliche Claude-Aufgabe: Status, Lebenszeichen, Größe, Advisors; ein pausiertes Projekt wird wiederhergestellt und gemeldet | ebenso |
| Netz | Supabase-Warnmail etwa sieben Tage vor einer Pause; Workflows halten sich über die GitHub-API aktiv (GitHub schaltet Zeitpläne öffentlicher Repos sonst nach 60 Tagen ohne Aktivität ab) | ebenso |

Workflows mit Zeitplan laufen nur aus `main`. GitHub schickt Fehlermails eines Zeitplans an die Person, die die `cron`-Zeile zuletzt geändert hat – deshalb führt der Inhaber solche Änderungen per Squash-Merge zusammen.

Ist ein Projekt doch pausiert: Dashboard → Projekt → **Resume project** (bis 90 Tage nach der Pause). Danach die Rollen-Logins prüfen und bei Bedarf die Verifier neu setzen.

## Sicherung und Wiederherstellung

Free hat keine Backups, Pro-Backups sind nicht herunterladbar und enthalten keine Dateien. Deshalb sichert `.github/workflows/sicherung.yml` nachts selbst – außerhalb der Supabase-Organisation, weil Kontingente und Sperren dort für alle Projekte gemeinsam gelten.

- **Ziel**: Cloudflare R2 (Free-Kontingent 10 GB, EU-Jurisdiktion). Bucket `sm24-sicherung-db` (Lifecycle: `taeglich/` 15 Tage, `woechentlich/` 57 Tage, `monatlich/` 186 Tage, `fehler/` 30 Tage; Bucket-Lock) und `sm24-sicherung-dateien` (Lifecycle `geloescht/` 31 Tage).
- **Datenbank**: `pg_dump` als `sm24_sicherung` (nur `public`, ohne die Daten der Ratenbegrenzung), danach **Probe-Wiederherstellung** in einen frischen Postgres-17-Container als `sm24_migration` mit Vergleich des Fingerabdrucks (`supabase/sicherung/fingerabdruck.sql`). Erst dann wird mit `age` an die öffentlichen Schlüssel in `supabase/sicherung/empfaenger.txt` verschlüsselt und hochgeladen. CI kann nur verschlüsseln, nie entschlüsseln.
- **Dateien**: `rclone sync` in einen verschlüsselten Remote; gelöschte Dateien wandern nach `geloescht/<datum>/` und verschwinden nach 31 Tagen – so gelten die Löschfristen auch für die Sicherung. `--max-delete 50` stoppt eine Massenlöschung.
- **Logs**: öffentlich lesbar, deshalb nur feste Texte. Fehlerprotokolle werden verschlüsselt nach `fehler/` gelegt.
- **Lebenszeichen**: `sicherung-db` und `sicherung-dateien`; der Workflow schlägt fehl, wenn `cron-taeglich` älter als 36 Stunden ist, und der tägliche Cron meldet eine veraltete Sicherung.
- **Aktivieren**: Repository-Variable `SICHERUNG_AKTIV=true`, Environment `sicherung` (nur `main`) mit den Werten aus der Tabelle unten, `empfaenger.txt` mit den öffentlichen `age1…`-Schlüsseln (Inhaber und Notfall).

| Environment `sicherung` | Art | Inhalt |
|---|---|---|
| `SICHERUNG_DB_PASSWORT` | Secret | Passwort von `sm24_sicherung` |
| `QUELLE_S3_ZUGANG`, `QUELLE_S3_GEHEIMNIS` | Secret | Supabase-S3-Schlüssel „sicherung“ |
| `ZIEL_S3_ZUGANG`, `ZIEL_S3_GEHEIMNIS` | Secret | R2-Token (Lesen und Schreiben, nur die beiden Buckets) |
| `ZIEL_CRYPT_PASSWORT`, `ZIEL_CRYPT_SALZ` | Secret | rclone-crypt-Schlüssel der Dateisicherung (auch im Passwortmanager!) |
| `SB_POOLER_HOST`, `SB_PROJEKT_REF`, `SB_CA_CERT` | Variable | Pooler-Host, `csheqgiqnxwbfbfrlmly`, CA-Zertifikat |
| `QUELLE_S3_ENDPOINT`, `QUELLE_S3_REGION` | Variable | `https://csheqgiqnxwbfbfrlmly.storage.supabase.co/storage/v1/s3`, `eu-central-1` |
| `ZIEL_S3_ENDPOINT` | Variable | R2-Endpunkt (EU) |

**Wiederherstellung** (Datenbank zuerst, dann Dateien):

1. Bei Bedarf neues Projekt in Frankfurt, dann `supabase/sql/0001–0005` per MCP einspielen und die Verifier der Rollen setzen.
2. Neueste Sicherung aus R2 laden und lokal mit dem privaten age-Schlüssel entschlüsseln: `age -d -i schluessel.txt datenbank.dump.age > datenbank.dump`.
3. Als `sm24_migration` über den Session-Pooler einspielen: `pg_restore --no-owner --no-privileges --single-transaction --exit-on-error --dbname "<sm24_migration-Adresse>?sslmode=verify-full&sslrootcert=ca.crt" datenbank.dump`. Nie `REASSIGN OWNED BY postgres`.
4. `npm run pruefen:supabase` – keine Befunde erwartet; danach auf Vercel neu deployen.
5. Dateien mit `rclone copy` aus dem verschlüsselten Remote zurück in `sm24-dateien`. Nach einer Wiederherstellung auf einen älteren Stand löscht der tägliche Cron abgelaufene Dateien von selbst wieder.

**Probe**: Die nächtliche Probe-Wiederherstellung prüft jede Sicherung. Zusätzlich vierteljährlich von Hand: neueste Sicherung lokal entschlüsseln und in die lokale Datenbank einspielen (`npm run db:start`, dann `pg_restore`). Der private Schlüssel liegt dabei nie in CI.

Das Werkzeug für eine Sicherung auf einem Bürorechner bleibt `scripts/sicherung.mjs` (siehe [LIVEGANG.md](LIVEGANG.md#sicherung-und-wiederherstellung)).

## Überwachung

Der tägliche Cron `/api/cron/taeglich` prüft zusätzlich den Zustand von Supabase und meldet Abweichungen per Betriebsmail (höchstens einmal am Tag): Datenbankgröße gegen die 500 MB des Free-Plans, belegter Speicher (aus den Dateigrößen der Sammlungen), Alter der Lebenszeichen der Sicherung, hochgerechneter Egress der Sicherung. Die Antwort des Crons enthält einen Block `betrieb` mit Befunden und Kennzahlen (Vercel → Logs). Die Schwellen lassen sich per Umgebungsvariable anpassen – nach einem Pro-Wechsel anheben.

## Kontingente (Free, organisationsweit)

| Posten | Grenze | Hinweis |
|---|---|---|
| Datenbankgröße | 500 MB je Projekt | darüber nur noch Lesen |
| Speicher | 1 GB für die ganze Organisation | Dateien von A; Sicherungen liegen bewusst nicht bei Supabase |
| Egress | 5 GB ungecacht + 5 GB gecacht je Monat, ganze Organisation | die Sicherung liest etwa 30 × die Tabellengröße im Monat |
| Verbindungen | 60 Datenbank, 200 Pooler-Clients | Payload öffnet höchstens 5 je Instanz |
| Upload | 50 MB | eingestellt: global 10 MB, Bucket 5 MB |

Werden Kontingente überschritten, schränkt Supabase **alle** Projekte der Organisation ein.

## Rotation

| Was | Wie |
|---|---|
| Rollenpasswort | neues Passwort, Verifier setzen, danach die Variable (Vercel bzw. GitHub) ändern und neu deployen |
| S3-Schlüssel | neuen Schlüssel anlegen, eintragen, alten löschen |
| R2-Token | neuen Token anlegen, im Environment `sicherung` tauschen, alten widerrufen |
| age-Schlüssel | neues Paar erzeugen, öffentlichen Schlüssel in `empfaenger.txt` ergänzen; alte Sicherungen bleiben mit dem alten Schlüssel lesbar, also den alten privaten Schlüssel aufbewahren, bis sie abgelaufen sind |
| CA-Zertifikat | bei Wechsel durch Supabase neu herunterladen und in Vercel und GitHub tauschen |

## Notfälle

- **Projekt pausiert**: Resume project, danach `npm run pruefen:supabase` und einen Login je Rolle testen; fehlen Passwörter, Verifier neu setzen.
- **Build bricht bei der Rechte-Prüfung ab**: Befunde lesen (Build-Log). Typisch: eine Migration lief als falsche Rolle (Eigentümer), jemand hat Rechte an `anon` vergeben, oder der Event-Trigger fehlt (`0003` erneut anwenden).
- **Rollenpasswort verloren**: neues Passwort und Verifier setzen, Variable tauschen.
- **Speicher oder Datenbank fast voll**: Löschfristen prüfen (Einstellungen → Aufbewahrung), große Medien verkleinern, sonst Pro.

## Wechsel auf Pro

Zum echten Livegang empfohlen (keine Pausen, tägliche Backups, 8 GB Datenbank, 100 GB Speicher). Kosten sparen:

1. Neue **Free-Organisation** anlegen und **Projekt B dorthin übertragen** (Projekt → Settings → General → Transfer project; Voraussetzung: keine GitHub-Integration, keine Log-Drains). Den Supabase-Zugang für Claude für die neue Organisation freigeben.
2. Nur die Organisation `Schluesselmacher24` auf **Pro** stellen und **Spend Cap an** lassen: 25 $ im Monat, das enthaltene Compute-Guthaben deckt eine Micro-Instanz. Bliebe B in derselben Organisation, kämen 10 $ dazu.
3. Projekt A nachts von **Nano auf Micro** stellen (bei Pro gleich teuer, doppelter Arbeitsspeicher, etwa 2 Minuten Ausfall), danach die Rollen-Logins prüfen.
4. Organisationsweite MFA-Pflicht einschalten, Schwellen der Überwachung anheben. Die eigene Sicherung bleibt.
5. Der frei gewordene Free-Platz wird `sm24-vorschau` für Vorschau-Deployments mit eigener Datenbank (`SM24_PREVIEW_MIGRATE=1`, Variablen nur im Scope Preview).

Nicht buchen: Point-in-Time-Recovery (etwa 100 $), IPv4 (4 $), eigene Domain (10 $), Log-Drains, Branching, größere Compute-Stufen ohne Messwerte.

## Bewusst nicht genutzt

| Funktion | Grund |
|---|---|
| Data API, GraphQL, supabase-js | keine App braucht sie; ohne sie gibt es keine REST-Angriffsfläche |
| Supabase Auth | Payload hat eine eigene Anmeldung |
| Realtime, Edge Functions, Queues, pg_net, Vault, pg_cron | kein Anwendungsfall; Zeitsteuerung läuft außerhalb der Datenbank |
| Supabase Storage als Sicherungsziel | gemeinsame Kontingente der Organisation, kein Lifecycle, keine Löschsperre |
| Network Restrictions | wechselnde Adressen bei Vercel und GitHub |
