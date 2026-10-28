# SCHLÜSSELMACHER24

Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Abläufe und Konfiguratoren.

Domain: `schluesselmacher24.de` (hinterlegt in `src/lib/site-url.ts`).

## Entwicklung

```bash
npm install
npm run dev          # Entwicklungsserver, http://localhost:3000
npm run build        # Produktionsbuild (Hinweise unten)
npm run start        # startet den gebauten Stand
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Unit-Tests, danach DB-Tests
```

Weitere Skripte aus `package.json`:

| Befehl | Zweck |
|---|---|
| `npm run test:unit` | Unit-Tests (`vitest run`) |
| `npm run test:db` | DB-Tests gegen eine eigene Postgres-Instanz |
| `npm run seed` | übernimmt die Inhalte aus `content/*.json` in die Datenbank |
| `npm run admin:anlegen` | legt den ersten Backend-Zugang an |
| `npm run db:start` · `db:stop` · `db:status` · `db:reset` | lokale Entwicklungsdatenbank (`scripts/db.mjs`) |
| `npm run db:migrate` · `generate:types` · `generate:importmap` | Payload: Migrationen, Typen, Importmap |
| `npm run aufbewahrung:bereinigen` | löscht Kundendateien mit abgelaufener Frist und Uploads, die nie einem Vorgang zugeordnet wurden und älter als 24 Stunden sind. Nur anzeigen: `npm run aufbewahrung:bereinigen -- -- --probe` – das erste `--` nimmt npm, das zweite `payload run`; mit nur einem `--` verschluckt `payload run` das Flag, und das Skript löscht (`src/scripts/aufbewahrung-bereinigen.ts`, `node_modules/payload/dist/bin/index.js`) |

Die Vorlage `.env.example` nach `.env.local` kopieren und ausfüllen. Sie enthält keine Zugangsdaten und erklärt jede Variable; gelesen werden sie an einer Stelle (`src/lib/umgebung.ts`, Build: `scripts/build.mjs`). Für den Livegang: `docs/LIVEGANG.md`.

**Ohne Datenbank.** Die Seite liest aus Payload, sobald `DATABASE_URL` gesetzt ist. Sonst liest sie die Dateien unter `content/` (`src/lib/data/index.ts`). Dasselbe erzwingt `SM24_DATA=json`:

```bash
SM24_DATA=json npm run dev
SM24_DATA=json npx next build
```

`npm run dev` ruft vorher `scripts/db.mjs ensure` auf. Ohne externe `DATABASE_URL` startet das ein lokales Postgres aus dem Paket `embedded-postgres` (Port 5433, nur localhost, Daten unter `.data/postgres`). Das Skript setzt `DATABASE_URL` nicht; die Seite nutzt die Datenbank erst, wenn die Variable gesetzt ist.

**Build.** `npm run build` ruft `scripts/build.mjs` auf:
- In Produktion (`VERCEL_ENV=production`) bricht er ab, wenn Datenbank, `PAYLOAD_SECRET` oder `NEXT_PUBLIC_SITE_URL` fehlen.
- Mit Datenbank laufen Migrationen (über die direkte Verbindung `DATABASE_URL_UNPOOLED`), Seed, Anlage des ersten Inhaber-Zugangs aus `SEED_ADMIN_*` und die Livegang-Prüfung (`npm run pruefen:livegang`; in Produktion ein Abbruch bei Platzhaltern in Firmendaten oder Rechtsseiten), danach `next build`.
- Vorschau-Deployments überspringen Migration und Seed (`SM24_PREVIEW_MIGRATE=1` schaltet sie ein).
- Lokal ohne externe `DATABASE_URL` startet `scripts/db.mjs` das eingebettete Postgres; als root scheitert dort `initdb`. Ohne Datenbank baut `SM24_DATA=json npx next build`.

## Technischer Aufbau

- **Next.js 16** (App Router, `^16.3.5`), **React 19** (`19.2.4`), **TypeScript** (`^5.9.3`, `strict` in `tsconfig.json`).
- **Tailwind CSS 3** (`^3.4.19`). Werte liegen als Tokens in `src/app/(site)/globals.css` (nicht in `src/app/globals.css`) und in `tailwind.config.ts`.
- **Payload 3** (`^3.90.2`) mit Postgres-Adapter (`src/payload.config.ts`). Sammlungen unter `src/payload/collections/`, Globals unter `src/payload/globals/`.
- **Datenschicht** (`src/lib/data/index.ts`): Payload-Adapter oder JSON-Adapter (`json-adapter.ts`) auf `content/`. Fehlt eine Datei, greifen die Standardwerte aus `src/lib/data/defaults/`.
- **Formulare:** zod (`^4.4.3`) wird in drei Quelldateien importiert. `react-hook-form` steht in `package.json`, wird aber nicht importiert.
- **Schriften:** IBM Plex Sans, Inter und IBM Plex Mono über `next/font/google` (`src/app/(site)/layout.tsx`, Variablen `--font-display`, `--font-body`, `--font-mono`).
  - Während die Schriften laden, stehen maßgleiche lokale Ersatzschriften dahinter (`SM24 Ersatz …` in `src/app/(site)/globals.css`, Stapel in `tailwind.config.ts`); so verrutscht beim Schrifttausch nichts.
- **CSS im Dokument:** `experimental.inlineCss` in `next.config.ts` schreibt das CSS als `<style>` in jede Seite und spart auf langsamen Leitungen eine Anfrage vor dem ersten Zeichnen. Die Option ist noch experimentell: bei jedem Next-Update prüfen, ob sie bleiben soll; abschalten durch Entfernen der Zeile.
- **Zwischenstände** der Abläufe liegen im Browser (`src/lib/flow/use-flow.ts`, `src/lib/client-state.ts`). Der Warenkorb ist ein Zustand-Store (`src/lib/store/cart.ts`).
- **Verzeichnisse:** `src/app/(site)/` (Website), `src/app/(payload)/` (Backend), `src/components/<bereich>/`, `src/components/visual/` (Formsystem), `src/lib/` (`pricing.ts`, `scheduling.ts`, `actions/`, `integrations/`).

## Gestaltung

- **Leitidee** (K-001 in `docs/gestaltung/KERN.md`): „SCHLÜSSELMACHER24 sieht aus wie eine saubere Werkstattzeichnung: helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift – und an den entscheidenden Stellen fräst eine Linie sichtbar das Profil, damit man Genauigkeit sieht, bevor man sie liest.“
- **Regeln:** Prinzipien in K-003 und Typografie in K-006 (`docs/gestaltung/KERN.md`). Das Designsystem beschreibt `src/components/visual/README.md`.
- **Tokens** (`src/app/(site)/globals.css`, `tailwind.config.ts`):
  - Schrift: `--text-caption` bis `--text-display`, fließend zwischen 390 und 1440 px.
  - Abstände: `--space-section`, `--space-gutter`.
  - Dauern: `--dauer-instant` (120 ms) bis `--dauer-scene` (900 ms). Kurven: `--kurve-standard`, `--kurve-enter`, `--kurve-exit`, `--kurve-draw`.
  - Schatten: `shadow-raised`, `shadow-overlay`.
  - Farben: semantische Tokens wie `surface`, `primary` oder `foreground-muted`. Der Bereichsakzent wird über `data-area` gesetzt (Werte in `src/lib/visual/area-theme.ts`).
- **Icons** (`src/components/visual/`): 54 Fach-Icons in `icons/` auf einem gemeinsamen Rahmen (`icon-base.tsx`), 39 einfarbige UI-Glyphen in `glyphen/`. Eine Icon-Familie: `lucide-react` ist entfernt, die Seite nutzt nur Fach-Icons und Glyphen (`grep -rl lucide-react src` ohne Treffer).
- **Grafik-Generatoren:** 9 Generatoren in `generators/` (`ablauf`, `code-fundstelle`, `profilschnitt`, `schliessplan`, `schluessel`, `stiftzuhaltung`, `tuer-schutz`, `zutritt-signal`, `zylinder-mass`), eingetragen in `registry.tsx`. Sie erzeugen reines, deterministisches SVG; jeder hat einen Test. Gemeinsame Strichskala und Raster stehen in `grafik-basis.tsx`.
- **Bewegung** (K-007): CSS-Klassen `sm24-*` in `globals.css`, Bausteine in `motion/` (`InView`, `Reveal`, `DrawOn`, `CheckDraw`). Animiert werden laut Regel nur `transform` und `opacity` sowie Strich- und Maskenbewegungen.
- **Reduzierte Bewegung:** `@media (prefers-reduced-motion: reduce)` in `globals.css` verkürzt Animationen und Übergänge. JavaScript-Scrollen nutzt `scrollVerhalten()` aus `src/lib/bewegung.ts`.

## Tests

- **Unit-Tests:** `npm run test:unit` (Vitest 2, Umgebung `node`, ohne DOM; `vitest.config.ts`). 113 Unit-Testdateien mit 1531 Tests (`find src -name '*.test.ts*' ! -name '*.db.test.ts' | wc -l`).
- **DB-Tests:** `npm run test:db` (`vitest.db.config.ts`), 11 Dateien `*.db.test.ts` mit 77 Tests. Die Datei `src/test/db-global-setup.ts` startet eine eigene Postgres-Instanz (Port 5434, änderbar mit `SM24_TEST_PG_PORT`) und spielt Migrationen und Seed ein.
- Als root sind die DB-Tests nicht lauffähig (`initdb` lehnt root ab); im Gestaltungslauf liefen sie über einen Nutzer ohne root-Rechte.
- **Prüfungen:** `npm run typecheck` und `npm run lint`. Die CI (`.github/workflows/ci.yml`) führt alles samt DB-Tests und Build ohne Datenbank für jeden PR auf `main` aus.

## Inhaltspflege

Mit laufender Datenbank sind die Inhalte in Payload gepflegt. Die Dateien unter `content/` sind der Ausgangsbestand.

- **Backend unter `/admin`:** Anmeldung mit einem Konto der Sammlung `benutzer`. Zugelassen sind die Rollen Inhaber und Mitarbeiter (`src/payload/access/rollen.ts`). Den ersten Zugang legt `npm run admin:anlegen` an; die Zugangsdaten kommen aus `SEED_ADMIN_EMAIL` und `SEED_ADMIN_PASSWORD` (mindestens 12 Zeichen für das Passwort).
- **Sammlungen:** Vorgänge, Kundendateien, Produkte, Fahrzeugmarken, Autoschlüssel-Leistungen, Preisregeln, Preisgruppen, Sperrtage, Seiten, Leistungsseiten, Ratgeber, Einsatzgebiete, Nachweise, Medien, Benutzer und Webhook-Ereignisse. Globals: Einstellungen, Richtwerte, Zylinderkatalog (`src/payload.config.ts`). Die Adresse einer Sammlung ist `/admin/collections/<slug>`.
- **Übernahme:** `npm run seed` überträgt `content/*.json` in die Datenbank — je Eintrag: Neues wird angelegt, Gelöschtes nicht wiederbelebt, Texte nur dort aktualisiert, wo noch ein früherer Startwert steht (`src/payload/seed.ts`, Schnappschüsse unter `content/startwerte/`).

| Datei | Inhalt |
|---|---|
| `content/settings.json` | Firmendaten (Platzhalter, Feld `isPlaceholder`), Öffnungszeiten, Buchung, Versand, Aufbewahrungsfristen |
| `content/service-pricing.json` | Preise und Terminlängen je Leistung, Fahrzeuggruppe und Schlüsselart (24 Einträge) |
| `content/pricing-groups.json` | Preisgruppen (4 Einträge) |
| `content/car-key-services.json` | Autoschlüssel-Leistungen mit Schlüsselarten und Pflicht zur Vor-Ort-Leistung (6) |
| `content/vehicles.json` | 12 Fahrzeugmarken mit 49 Modellen |
| `content/code-lines.json` | 52 Codelinien für den Shop |
| `content/cylinder-catalog.json` | Zylinderformen, Funktionen, Zusätze, Schlüsselpreis, Messfigur |
| `content/blocked-days.json` | Sperrtage mit Grund (5) |
| `content/seo.json` | Titel, Beschreibungen und Texte je Seite (24) |
| `content/service-pages.json` | Leistungsseiten für Tür- und Sicherheitstechnik (17) |
| `content/guides.json` | Ratgeberbeiträge (8) |
| `content/cities.json` | Einsatzgebiete mit Umkreis in km und Ortstexten (6) |

`content/records.json` (Vorgänge und Kundendaten) steht nicht im Repository (`.gitignore`). Im JSON-Modus liest und schreibt der Adapter diese Datei; schreiben ist nicht möglich auf Vercel oder mit `SM24_READONLY_CONTENT=1`.

## Anbindungen und Livegang

Alle Anbindungen sind fertig programmiert und schalten sich ein, sobald ihre Variablen gesetzt sind (`src/lib/umgebung.ts`). Den Stand zeigt das Backend unter Verwaltung → Einstellungen → Anbindungen, dort auch eine Testmail. Schritt-für-Schritt-Anleitung für Konten, DNS und ersten Deploy: **`docs/LIVEGANG.md`**.

| Anbindung | Code | Variablen | Ohne Anbindung |
|---|---|---|---|
| Online-Zahlung (Stripe Checkout) | `src/lib/integrations/stripe.ts`, `src/lib/zahlung/*`, Webhook `api/zahlung/stripe`, Rückkehr `api/zahlung/rueckkehr` | `PAYMENT_PROVIDER`, `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET`, `PAYMENT_METHODS`, `PAYMENT_INVOICES` | Vorgang mit Zahlung „offen“, Verbuchung von Hand |
| E-Mail (Resend) | `src/lib/mail/*`, `src/lib/server/benachrichtigungen.ts`, Payload-Adapter `@payloadcms/email-resend` | `MAIL_PROVIDER`, `MAIL_API_KEY`, `MAIL_FROM_ADDRESS`, `MAIL_TEAM_ADDRESS`, `MAIL_REPLY_TO` | keine Mails, Vorgänge werden trotzdem gespeichert |
| Datenbank (Supabase Postgres) | `src/payload.config.ts`, `src/payload/betrieb.ts` | `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `DATABASE_CA_CERT` | Seite liest `content/*.json`, keine Vorgänge (in Produktion verboten) |
| Dateiablage (Supabase Storage, privater Bucket) | `@payloadcms/storage-s3` für Medien, Kundendateien, interne Dateien | `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` | auf Vercel keine Uploads |
| Crons (Vercel) | `api/cron/taeglich` (Löschfristen), `api/cron/zahlungen` (Abgleich), `vercel.json` | `CRON_SECRET` | Crons werden abgewiesen |

Mailvorlagen: Eingangsbestätigung je Ablauf, Vertragsbestätigung mit Widerrufsbelehrung, Betriebsmail, Zahlung, Status (inkl. Sendungsnummer), Widerruf. Alle Mails stehen im Mail-Protokoll am Vorgang.

Backend-Aktionen am Vorgang: Bestätigung erneut senden, Termin verschieben, Telefontermin eintragen, CSV-Export für die Buchhaltung.

Rechtsseiten (`src/app/(site)/rechtliches/*`, Texte in `src/lib/rechtliches/*`) sind vollständige Entwürfe aus den Firmendaten. Die juristische Freigabe steht aus (`docs/gestaltung/MENSCHEN.md`, M-05). Eigene Texte ersetzen den Entwurf über Einstellungen → Rechtstexte.

Alle offenen Punkte für Menschen: `docs/gestaltung/MENSCHEN.md`.

## Gestaltungslauf

Die Unterlagen des Gestaltungslaufs liegen in `docs/gestaltung/`: der Kern des Designsystems (`KERN.md`), die Entscheidungen (`ENTSCHEIDUNGEN.md`), offene Punkte für Menschen (`MENSCHEN.md`), Textvorschläge (`TEXTVORSCHLAEGE.md`) und das Berichtsbuch mit Abnahme und Anleitung zum Zurückrollen (`BERICHT.md`). Der vollständige Arbeitsordner mit Auftrag, Plan, Prüfprotokollen, Bildsätzen, Vorher-Nachher-Galerie und Prüfwerkzeugen bleibt in der Git-Geschichte erhalten (Zweig `claude/projekt-gestaltung-entwicklung-tofodh`, Commit `b8e7ea7`, Ordner `_werkstatt/`).


## Architecture Audit

The codebase has been audited by JC-AUDITOR-ARCHITECT-v1. 54 routes were identified and added to the transformation blueprint in `.jules/revolution-plan.json`.
