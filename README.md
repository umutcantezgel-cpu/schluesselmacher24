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
| `npm run aufbewahrung:bereinigen` | löscht Kundendateien mit abgelaufener Frist. Nur anzeigen: `npm run aufbewahrung:bereinigen -- --probe` (`--probe` steht hinter `--`, damit npm es an das Skript weitergibt; Beleg `src/scripts/aufbewahrung-bereinigen.ts:6`) |

Die Vorlage `.env.example` nach `.env.local` kopieren und ausfüllen. Sie enthält keine Zugangsdaten; vorbelegt ist nur `NEXT_PUBLIC_SITE_URL`. Im Code gelesen werden unter anderem `DATABASE_URL`, `PAYLOAD_SECRET`, `SM24_DATA`, `SM24_READONLY_CONTENT`, `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_SITE_URL`, `SEED_ADMIN_EMAIL` und `SEED_ADMIN_PASSWORD`.

**Ohne Datenbank.** Die Seite liest aus Payload, sobald `DATABASE_URL` gesetzt ist. Sonst liest sie die Dateien unter `content/` (`src/lib/data/index.ts`). Dasselbe erzwingt `SM24_DATA=json`:

```bash
SM24_DATA=json npm run dev
SM24_DATA=json npx next build
```

`npm run dev` ruft vorher `scripts/db.mjs ensure` auf. Ohne externe `DATABASE_URL` startet das ein lokales Postgres aus dem Paket `embedded-postgres` (Port 5433, nur localhost, Daten unter `.data/postgres`). Das Skript setzt `DATABASE_URL` nicht; die Seite nutzt die Datenbank erst, wenn die Variable gesetzt ist.

**Build.** Auf Vercel ohne `DATABASE_URL` läuft `npm run build` ohne Datenbank. Sonst führt der Build `scripts/db.mjs ensure`, `payload migrate` und den Seed aus und ruft danach `next build` auf (`package.json`, Skript `build`). Ohne `DATABASE_URL` startet `scripts/db.mjs` dabei das lokale Postgres; zeigt `DATABASE_URL` auf eine externe Datenbank, startet es keines (`scripts/db.mjs`, Zeilen 104–114 und 119–123), und Migrationen und Seed laufen gegen diese Datenbank. Als root scheitert `initdb` am lokalen Postgres. Ohne Datenbank baut `SM24_DATA=json npx next build` (`_werkstatt/STATUS.md`, Abschnitt Einrichtung).

## Technischer Aufbau

- **Next.js 16** (App Router, `^16.3.5`), **React 19** (`19.2.4`), **TypeScript** (`^5.9.3`, `strict` in `tsconfig.json`).
- **Tailwind CSS 3** (`^3.4.19`). Werte liegen als Tokens in `src/app/(site)/globals.css` (nicht in `src/app/globals.css`) und in `tailwind.config.ts`.
- **Payload 3** (`^3.90.2`) mit Postgres-Adapter (`src/payload.config.ts`). Sammlungen unter `src/payload/collections/`, Globals unter `src/payload/globals/`.
- **Datenschicht** (`src/lib/data/index.ts`): Payload-Adapter oder JSON-Adapter (`json-adapter.ts`) auf `content/`. Fehlt eine Datei, greifen die Standardwerte aus `src/lib/data/defaults/`.
- **Formulare:** zod (`^4.4.3`) wird in drei Quelldateien importiert. `react-hook-form` steht in `package.json`, wird aber nicht importiert.
- **Schriften:** IBM Plex Sans, Inter und IBM Plex Mono über `next/font/google` (`src/app/(site)/layout.tsx`, Variablen `--font-display`, `--font-body`, `--font-mono`).
- **Zwischenstände** der Abläufe liegen im Browser (`src/lib/flow/use-flow.ts`, `src/lib/client-state.ts`). Der Warenkorb ist ein Zustand-Store (`src/lib/store/cart.ts`).
- **Verzeichnisse:** `src/app/(site)/` (Website), `src/app/(payload)/` (Backend), `src/components/<bereich>/`, `src/components/visual/` (Formsystem), `src/lib/` (`pricing.ts`, `scheduling.ts`, `actions/`, `integrations/`).

## Gestaltung

- **Leitidee** (K-001 in `_werkstatt/KERN.md`): „SCHLÜSSELMACHER24 sieht aus wie eine saubere Werkstattzeichnung: helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift – und an den entscheidenden Stellen fräst eine Linie sichtbar das Profil, damit man Genauigkeit sieht, bevor man sie liest.“
- **Regeln:** Prinzipien in K-003 und Typografie in K-006 (`_werkstatt/KERN.md`). Das Designsystem beschreibt `src/components/visual/README.md`.
- **Tokens** (`src/app/(site)/globals.css`, `tailwind.config.ts`):
  - Schrift: `--text-caption` bis `--text-display`, fließend zwischen 390 und 1440 px.
  - Abstände: `--space-section`, `--space-gutter`.
  - Dauern: `--dauer-instant` (120 ms) bis `--dauer-scene` (900 ms). Kurven: `--kurve-standard`, `--kurve-enter`, `--kurve-exit`, `--kurve-draw`.
  - Schatten: `shadow-raised`, `shadow-overlay`.
  - Farben: semantische Tokens wie `surface`, `primary` oder `foreground-muted`. Der Bereichsakzent wird über `data-area` gesetzt (Werte in `src/lib/visual/area-theme.ts`).
- **Icons** (`src/components/visual/`): 54 Fach-Icons in `icons/` auf einem gemeinsamen Rahmen (`icon-base.tsx`), 39 einfarbige UI-Glyphen in `glyphen/`. Offen: `lucide-react` (`^1.17.0`) wird noch in 4 Dateien importiert (Zählung im Arbeitsbaum mit `grep -rl lucide-react src`: `bestellung/[id]/page.tsx`, `rechtliches/cookie-einstellungen/cookie-einstellungen.tsx`, `standorte/[city]/page.tsx`, `standorte/page.tsx`; am Basisstand f0e1382 waren es 14).
- **Grafik-Generatoren:** 9 Generatoren in `generators/` (`ablauf`, `code-fundstelle`, `profilschnitt`, `schliessplan`, `schluessel`, `stiftzuhaltung`, `tuer-schutz`, `zutritt-signal`, `zylinder-mass`), eingetragen in `registry.tsx`. Sie erzeugen reines, deterministisches SVG; jeder hat einen Test. Gemeinsame Strichskala und Raster stehen in `grafik-basis.tsx`.
- **Bewegung** (K-007): CSS-Klassen `sm24-*` in `globals.css`, Bausteine in `motion/` (`InView`, `Reveal`, `DrawOn`, `CheckDraw`). Animiert werden laut Regel nur `transform` und `opacity` sowie Strich- und Maskenbewegungen.
- **Reduzierte Bewegung:** `@media (prefers-reduced-motion: reduce)` in `globals.css` verkürzt Animationen und Übergänge. JavaScript-Scrollen nutzt `scrollVerhalten()` aus `src/lib/bewegung.ts`.

## Tests

- **Unit-Tests:** `npm run test:unit` (Vitest 2, Umgebung `node`, ohne DOM; `vitest.config.ts`). 66 Unit-Testdateien im Arbeitsbaum dieser Fassung (`find src -name '*.test.ts*' ! -name '*.db.test.ts' | wc -l`). Am Basisstand f0e1382 sind es 64. Die Differenz sind zwei Dateien, die nach f0e1382 hinzugekommen sind und im Verlauf von HEAD liegen (Commit 0fca06c): `src/lib/codelinie.test.ts` und `src/components/visual/interaktiv/code-fundstelle-interaktiv.test.tsx`.
- **DB-Tests:** `npm run test:db` (`vitest.db.config.ts`), 7 Dateien `*.db.test.ts`. Die Datei `src/test/db-global-setup.ts` startet eine eigene Postgres-Instanz (Port 5434, änderbar mit `SM24_TEST_PG_PORT`) und spielt Migrationen und Seed ein.
- Laut `_werkstatt/STATUS.md` (Abschnitt Einrichtung) sind die DB-Tests als root nicht lauffähig.
- **Prüfungen:** `npm run typecheck` und `npm run lint`.

## Inhaltspflege

Mit laufender Datenbank sind die Inhalte in Payload gepflegt. Die Dateien unter `content/` sind der Ausgangsbestand.

- **Backend unter `/admin`:** Anmeldung mit einem Konto der Sammlung `benutzer`. Zugelassen sind die Rollen Inhaber und Mitarbeiter (`src/payload/access/rollen.ts`). Den ersten Zugang legt `npm run admin:anlegen` an; die Zugangsdaten kommen aus `SEED_ADMIN_EMAIL` und `SEED_ADMIN_PASSWORD` (mindestens 12 Zeichen für das Passwort).
- **Sammlungen:** Vorgänge, Kundendateien, Produkte, Fahrzeugmarken, Autoschlüssel-Leistungen, Preisregeln, Preisgruppen, Sperrtage, Seiten, Leistungsseiten, Ratgeber, Einsatzgebiete, Nachweise, Medien, Benutzer und Webhook-Ereignisse. Globals: Einstellungen, Richtwerte, Zylinderkatalog (`src/payload.config.ts`). Die Adresse einer Sammlung ist `/admin/collections/<slug>`.
- **Übernahme:** `npm run seed` überträgt `content/*.json` in die Datenbank. Jede Sammlung wird nur einmal übernommen (`src/payload/seed.ts`).

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

## Offene Anbindungen

Der Status der Anbindungen steht in `src/lib/integrations/index.ts`. Im Backend (`src/payload/`, `src/app/(payload)/`) gibt es keinen Bezug zu den Anbindungen. Gelesen wird er auf den öffentlichen Seiten: `integrationStatuses()` auf `rechtliches/versand-und-zahlung/page.tsx`, `paymentStatus()` auf `kasse/page.tsx` und `autoschluessel/anfrage/page.tsx`, `mailStatus()` und `storageStatus()` auf `bestellung/[id]/page.tsx`. Der Vorgang beim Absenden nutzt `createPayment`, `sendMail` und `storageStatus` (`src/lib/server/create-record.ts`).

- **Online-Zahlung:** nicht angebunden. Ohne `PAYMENT_PROVIDER` und `PAYMENT_API_KEY` legt `createPayment` den Vorgang mit Zahlungsstatus „offen“ an (`src/lib/integrations/index.ts`, Zeilen 68–76). Sind beide gesetzt, wirft `createPayment`, weil die Anbindung des Anbieters im Code fehlt (Zeilen 78–82), nicht weil ein Wert fehlt. `PAYMENT_WEBHOOK_SECRET` steht in der Liste der benötigten Variablen, geht aber nicht in `configured` ein.
- **E-Mail-Versand:** nicht angebunden. Ohne `MAIL_PROVIDER` und `MAIL_API_KEY` versendet `sendMail` nichts.
- **Dateiablage:** Kundendateien liegen in der Sammlung `kundendateien` (`src/payload/collections/Kundendateien.ts`) und im Ordner `private-uploads/` (nicht im Repository, `.gitignore`). Die Ablage ist nur verfügbar, wenn `DATABASE_URL` gesetzt ist, `SM24_DATA` nicht `json` ist und die Umgebung auf die Festplatte schreiben darf. Nicht verfügbar ist sie daher ohne `DATABASE_URL`, im JSON-Modus (`SM24_DATA=json`), auf Vercel (`VERCEL` gesetzt) und mit `SM24_READONLY_CONTENT=1` (`src/lib/integrations/index.ts`, Zeilen 142–148). Die Variablen `STORAGE_*` aus `.env.example` liest der Code nicht.
- **Stripe:** `stripe` steht in `package.json`, wird aber nicht importiert.
- **Rechtstexte und Firmendaten:** juristische Prüfung und Angaben stehen aus (`_werkstatt/MENSCHEN.md`, M-02 und M-05).

Alle offenen Punkte für Menschen: `_werkstatt/MENSCHEN.md`.

## Gestaltungslauf

Der Ordner `_werkstatt/` gehört zum Gestaltungslauf. Er liegt außerhalb von `src/` und ist nicht Teil der Website. Er enthält den Auftrag (`AUFTRAG.md`), den Kern (`KERN.md`), den Plan (`PLAN.md`), Status und Prüfpunkt (`STATUS.md`, `PRUEFPUNKT.md`), das Berichtsbuch (`BERICHT.md`), die Berichte (`berichte/`), die Arbeitspakete (`pakete/`), Protokolle (`protokolle/`) und die Prüfwerkzeuge (`werkzeuge/`, mit eigener `package.json`).
