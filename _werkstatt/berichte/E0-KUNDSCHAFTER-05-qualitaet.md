## 1. Tests

- **Anzahl:** 38 Testdateien, davon 31 Unit und 7 DB (`*.db.test.ts`).
- **Unit (31), nach Ordner:**
  - `src/lib` (15): `actions/security`, `artikel`, `code-pattern`, `cylinder-summary`, `data/payload-mapping`, `format`, `pricing`, `reference`, `reference-sequence`, `richtwerte/rechnen`, `richtwerte/uebersetzung`, `scheduling`, `server/datei-pruefung`, `staffel`, `visual/area-theme`
  - `src/components` (14): `calculator/rechner`, `vertrauen/nachweise-liste`, `visual/` mit 13 (`bereich-icon`, `generators/` x6, `icons/` x2, `motion/` x3, `registry`)
  - `src/app` (1): `(site)/api/kunden-upload/route.test.ts`
- **DB (7):** `src/lib/data/` (`nachweise`, `payload`, `richtwerte`, `vorgaenge`), `src/lib/server/` (`create-record`, `kundendateien`, `rate-limit`)
- **`vitest.config.ts`:** `environment: 'node'`, `globals: true`. Excludes sind `configDefaults`, `.claude/**` und `src/**/*.db.test.ts`. Aliase: `@payload-config`, `server-only` (→ `src/test/server-only-stub.ts`), `@` (→ `src`). Keine `setupFiles`, kein jsdom oder happy-dom.
- **`vitest.db.config.ts`:** `include: src/**/*.db.test.ts`, `globalSetup: src/test/db-global-setup.ts`, `testTimeout` 30 s, `hookTimeout` 120 s, `fileParallelism: false`, `pool: forks`. Das Setup startet eine eigene embedded Postgres über `scripts/db.mjs` (Port `SM24_TEST_PG_PORT`, Standard 5434), führt Migration und Seed aus.
- **`npm test`** = `vitest run && vitest run -c vitest.db.config.ts`.
- **`src/test/`:** nur `db-global-setup.ts` und `server-only-stub.ts`. Keine Fixtures, keine Snapshots.
- **Zählung:** Statisch zählen die Dateien 304 Unit-`it()`-Blöcke und 52 DB-`it()`-Blöcke. Die DB-Zahl stimmt mit FORTSCHRITT.md überein.
- **Unit-Zahl 680:** Nicht durch einen Lauf belegt. Plausibel nur durch Parametrisierung: `describe.each` über die Icons (`icons/icons.test.tsx:192`), `describe.each(NAMEN)` (`registry.test.tsx:98`), `it.each` (`bereich-icon.test.tsx:20`, `area-theme.test.ts:41`, `code-pattern.test.ts:14`). OFFENE FRAGE, siehe 8.
- **Komponenten-Tests:** `renderToStaticMarkup` in der Node-Umgebung, keine DOM-Interaktion. Kein Test für `use-flow`, den Warenkorb-Store, Kasse, Konfiguratoren oder Assistenten.

## 2. Prüfwerkzeuge

- **Playwright:** Nicht in `package.json`, nicht im Lockfile, keine Konfiguration. Nur `.gitignore` nennt `/test-results/` und `/playwright-report/`. FORTSCHRITT.md plant E2E für Paket 5 → fehlt.
- **axe:** Nur `node_modules/axe-core` im Lockfile (Zeile 5305), keine direkte Abhängigkeit. Herkunft (transitiv) nicht geprüft.
- **happy-dom:** Nur im Lockfile (Zeile 8070), nicht in `package.json`.
- **Lighthouse, @next/bundle-analyzer, Storybook** (kein `.storybook`, keine `*.stories.*`): fehlen.
- **Vorhanden:** ESLint (`eslint.config.mjs`, next core-web-vitals und ts), `tsc --noEmit`, Vitest mit `@vitest/coverage-v8` (kein Script dafür), `next build`.
- **Fehlt:** E2E, Barrierefreiheitsprüfung, Bundle-Analyse, DOM-Tests, `data-testid` (0 Treffer in `src`).

## 3. Dokumentation

- **`README.md`** (Entwicklung, Aufbau): Teilweise veraltet.
  - „Standard ist der JSON-Adapter“ widerspricht `src/lib/data/index.ts:15-23`. Dort ist der Payload-Adapter aktiv, sobald `DATABASE_URL` gesetzt ist.
  - „Formulare: react-hook-form + zod“: `react-hook-form` wird in `src` nicht importiert.
  - „`src/app/globals.css`“ ist falsch, Datei liegt unter `src/app/(site)/globals.css`.
  - „Backend unter `/admin`“ stimmt (Payload unter `src/app/(payload)/admin`).
- **`UMSETZUNG.md`** (Stand 15.09.2026): In großen Teilen überholt.
  - §1: JSON als Standard-Datenhaltung ist überholt (`index.ts:23`).
  - §1: `scripts/seed-content.mjs` existiert nicht; in `scripts/` liegt nur `db.mjs`.
  - §3: Backend-Pfade `/admin/preise`, `/admin/termine`, `/admin/produkte`, `/admin/fahrzeugdaten`, `/admin/inhalte`, `/admin/einstellungen` gibt es nicht. Unter `(payload)` liegt nur die Payload-Catch-All-Route.
  - §5: Die Variablen `STORAGE_*` werden im Code nicht gelesen. `storageStatus()` (`src/lib/integrations/index.ts:142-155`) prüft `DATABASE_URL`, `VERCEL` und `SM24_READONLY_CONTENT`.
  - §5: „Status unter `/admin/einstellungen`“ ist nicht belegt. `integrationStatuses` wird nur in `rechtliches/versand-und-zahlung/page.tsx` und in `integrations/index.ts` verwendet, nicht im Global `Einstellungen.ts`.
  - §8: Zahlen widersprechen sich: Routen 55 (UMSETZUNG), 47 Hauptrouten, 49 `page.tsx` heute; Build 194 (UMSETZUNG) gegen 198 (FORTSCHRITT); Quelldateien 139 gegen heute 262 ts/tsx ohne Tests.
  - §9.1 und §10.9: „/admin ohne Anmeldung“ ist überholt. `Benutzer.ts:17` hat `auth` mit Sperre nach 5 Versuchen; Zugriff über `src/payload/access/rollen.ts`.
  - §11: `npm run seed -- --force` existiert nicht (`src/scripts/seed.ts`, 20 Zeilen, kein `force`).
  - §4: Es gibt nur `src/app/(site)/icon.svg` als Bilddatei. Die Aussage „keine einzige Bilddatei“ ist im Wesentlichen richtig.
- **`docs/nacht/FORTSCHRITT.md`:** Aktuell zum Stand Paket 4 (CP3). Die Aussagen zu Pfad A, Payload-Admin mit 403 ohne Anmeldung und entferntem altem `/admin` stimmen mit dem Code überein. Paket 5 und 6 sind offen. Die Pfade `/Users/umurey/...` sind lokal.
- **`src/components/visual/README.md`:** Aktuell. Die Registry-Namen stimmen mit `registry.test.tsx:17` überein (5 Generatoren). `motion/motion-style.ts` und `area-scope.tsx` nicht geprüft.
- **`AGENTS.md`:** Next.js-16-Hinweis. **`CLAUDE.md`:** nur `@AGENTS.md`.
- **Weitere Dateien:** `.claude/launch.json` (Dev-Start, Port 3000), `.env.example` (STORAGE-Variablen ohne Wirkung, siehe oben).

## 4. Offene Aufgaben im Code

- **TODO, FIXME, XXX, HACK:** 0 Treffer in `src`, `scripts`, `content` und Konfigurationsdateien.
- **Anbindung „hier ergänzen“:** `src/lib/integrations/index.ts:78` (Zahlung) und `:124` (Mail). Bei gesetzter Anbieter-Variable wirft `createPayment` bzw. `sendMail` (`:80`, `:126`, „noch nicht implementiert“).
- **Firmendaten-Platzhalter:** `content/settings.json:3-14` (8 Treffer), `src/lib/data/defaults/settings.ts:13-24`.
- **Stadtseiten:** `content/cities.json` (18 Treffer, sechs Städte), `src/lib/data/defaults/content.ts:721, 728, 729`.
- **Codelinien:** `content/code-lines.json` (52 Treffer `[Hersteller eintragen]`), `src/lib/data/defaults/code-lines.ts:179`.
- **Rechtstexte:** `src/app/(site)/rechtliches/agb/page.tsx` (ab :22), `widerruf/page.tsx` (ab :20), `versand-und-zahlung/page.tsx` (:59-103), `datenschutz/page.tsx` (:37-166), `impressum/page.tsx` (:51-82), `cookie-einstellungen/page.tsx:44`, `rechtliches/layout.tsx:32`.
- **Weitere Platzhalter:** `service-und-termin/kontakt/page.tsx:146`, `schluessel-nach-vorlage/page.tsx:143`, `gleichschliessende-zylinder/konfigurator/konfigurator.tsx:352`, `autoschluessel/marken/[make]/[model]/page.tsx:91, 247`, `src/components/autoschluessel/vehicle-facts.tsx:12`, `key-kinds.tsx:89`.
- **Bildstellen:** 37 `<ImagePlaceholder>`, keiner mit `visual=`-Prop.

## 5. Historie

- **Commits:** 148 (`git log --oneline | wc -l`).
- **Letzte 40, gruppiert:**
  - Paket 4 CP3 (Vorgänge atomar, Uploads, Ratenbegrenzung): 939b48d, 04b10f0, 2a50613, 76d90de, 1b685f3
  - Build, Deploy, Tests: 71dbadd, 7ce0324, 822a0d9
  - Richtwerte-Rechner (ersetzt Bot-Rechner): 1961af2, 0442714, 35980ce, b3a5ab0, 1ddc6d6
  - Shop, Artikel, SEO: 087ae02, 2f548cc, 9dc6b8b, b37e4f5, a684d15
  - Vertrauen: 69c1c1e
  - Visual-System: 513f910, e651479, 822b676, 79d5427, 1c87515, dd2ad09, dc7612f, 4c0316b, b5630e0, 2ca6d40, c8682d8, 2de2c56, 7dc259d, 51b5556, 4e02a99
  - CMS, Paket 3: 83e64f4, cbfc478, 8855b80, ecf2e84
  - Doku nacht: 4902bd3, ff39e7f
- **Geplantes Paket 5 (FORTSCHRITT.md, „Nächster Schritt“):** Prüf-Workflow `paket4-pruefung` auswerten. Danach Stripe (Checkout, Webhook, Erstattung), Grafiken auf die Seiten, Playwright-E2E. Gate: typecheck, lint, test, build. Paket 6 („Puffer und Abschluss“) ohne Details.
- **Ist-Stand Paket 5:**
  - Stripe: nicht implementiert. Keine Imports von `stripe`, obwohl `stripe ^22.6.2` in `package.json` steht. Vorbereitet sind die CSP `form-action` für checkout.stripe.com (`next.config.ts`), die Felder `anbieterRef` und `checkoutSitzung` (`Vorgaenge.ts:300-301`), die Sammlung `WebhookEreignisse`. Es gibt keine Webhook-Route.
  - Erstattung: nur Status `erstattet` und das Feld `erstattetCent` (`Vorgaenge.ts:293, 302`).
  - Grafiken: 0 Aufrufe mit `visual=`, keine `generator`-Verweise in `content/` oder `src/lib/data/defaults`.
  - E2E: nicht begonnen.

## 6. Unantastbar (Zahlung, Konten, Rechtliches)

- **Kasse, Warenkorb, Bestellung:** `src/app/(site)/kasse/page.tsx`, `kasse-formular.tsx`, `warenkorb/page.tsx`, `warenkorb-ansicht.tsx`, `bestellung/[id]/page.tsx`, `api/kunden-upload/route.ts` samt Test.
- **Server Actions:** `src/lib/actions/orders.ts` (`submitOrder`), `records.ts` (`submitRecord`), `booking.ts` (`fetchQuote`, `fetchSlots`, `fetchRecordStatus`).
- **Vorgangslogik:** `src/lib/server/create-record.ts`, `record-schema.ts`, `access-token.ts`, `rate-limit.ts`, `kundendateien.ts`, `datei-pruefung.ts`.
- **Integrationen:** `src/lib/integrations/index.ts`.
- **Preise und Termine:** `src/lib/pricing.ts`, `src/lib/scheduling.ts`, `src/lib/data/defaults/pricing.ts`, `schedule.ts`, `src/lib/types.ts`.
- **Datenschicht:** `src/lib/data/index.ts`, `payload-adapter.ts`, `payload-mapping.ts`.
- **Payload:** `src/payload.config.ts`, `src/payload/access/rollen.ts`, `src/payload/collections/Vorgaenge.ts`, `Kundendateien.ts`, `WebhookEreignisse.ts`, `Benutzer.ts`, `Preisregeln.ts`, `Preisgruppen.ts`, `src/payload/hooks/loeschsperre.ts`, `revalidate.ts`, `src/payload/globals/Einstellungen.ts`, `Richtwerte.ts`, `src/app/(payload)/layout.tsx` (`'use server'`).
- **Generiert, nicht von Hand:** `src/migrations/*`, `src/payload-types.ts`.
- **Rechtstexte:** `src/app/(site)/rechtliches/` mit `layout.tsx`, `agb/`, `widerruf/`, `versand-und-zahlung/`, `datenschutz/`, `impressum/`, `cookie-einstellungen/` (`page.tsx` und `cookie-einstellungen.tsx`).
- **Konfiguration:** `next.config.ts` (CSP, Header), `src/app/robots.ts`, `.gitignore` (`/content/records.json`), `.env.example`.
- **Tests dazu:** `src/lib/actions/security.test.ts` (401 Zeilen), `src/lib/server/create-record.db.test.ts`, `vorgaenge.db.test.ts`.

## 7. Risiken für einen Gestaltungsumbau

- **Exakte Markup-Strings** in Tests:
  - `src/components/calculator/rechner.test.tsx:43` (`<dd class="text-[14px] text-foreground">`), `:76` (`<legend class="text-sm font-semibold text-foreground">`), `:63` und `:107` (Abwesenheit von `<dl`, `<fieldset`)
  - `src/components/vertrauen/nachweise-liste.test.tsx:30` (`<time dateTime=…>`), `:26`, `:44`
  - `src/components/visual/bereich-icon.test.tsx:43` (`class="shrink-0 text-area-strong"`)
  - `src/components/visual/motion/reveal.test.tsx:9, 19, 45` (`class="sm24-reveal mt-4"`, Gleichheit `toBe('<div class="sm24-reveal">x</div>')`)
  - `src/components/visual/motion/draw-on.test.tsx:29, 51, 90-91`
  - `src/components/visual/motion/check-draw.test.tsx:41, 43, 60`
  - `src/components/visual/icons/icons.test.tsx:224` (Regex auf `class="fill-area…"`), `:198, 201`
  - `src/components/visual/generators/code-fundstelle.test.tsx:44, 54`
- **Generator-Verträge** in allen sechs Generator-Tests: `viewBox="0 0 480 270"` bzw. `480 300`, `preserveAspectRatio`, `role="img"`, keine `id=`, keine `#hex`, `rgb(`, `oklch(` oder `<marker` (Beispiel `code-fundstelle.test.tsx:17-26`, `schliessplan.test.tsx:17-26`).
- **Textverträge:** `check-draw.test.tsx:23` (`<title>Bestätigt</title>`), `bereich-icon.test.tsx:34` (`<title>Schließanlagen</title>`), `code-fundstelle.test.tsx:35`, `schliessplan.test.tsx:57, 77` (`GS`, `HS`).
- **Farbvertrag:** `src/lib/visual/area-theme.test.ts` (Kontrasttest über `area-theme.ts`). Farbänderungen am Token-Satz brechen ihn gegebenenfalls.
- **Klassen als Vertrag:** `sm24-*` aus `globals.css`, `fill-area*`, `stroke-area*`, `text-area-strong`. Umbenennung bricht Tests und `src/components/visual/README.md`.
- **Keine Snapshots, kein `data-testid`.** Das ist günstig: Umbauten am Markup brechen nur die oben genannten Strings.

## 8. OFFENE FRAGEN

- Ist die Unit-Zahl 680 durch einen Lauf von `npx vitest run` bestätigt? Statisch sind es 304 `it()`-Blöcke; die Differenz ist nur über `.each` erklärbar.
- Soll `stripe ^22.6.2` für Paket 5 bleiben? Ungenutzt sind auch `framer-motion`, `graphql`, `@hookform/resolvers`, `react-hook-form`, `@fontsource/ibm-plex-sans` (0 Importe in `src`). Die Schriften kommen über `next/font/google` (`src/app/(site)/layout.tsx:2`).
- Soll `UMSETZUNG.md` aktualisiert oder als historisch markiert werden? Die Widersprüche in Abschnitt 3 betreffen Datenhaltung, Backend-Pfade, Zugangsschutz und `seed --force`.
- Ist „Build ohne Netz“ ein Thema? `next/font/google` lädt Schriften beim Build.
- Ist es gewollt, dass `createPayment` und `sendMail` werfen, sobald die Anbieter-Variable gesetzt ist, die Anbindung aber noch fehlt (`integrations/index.ts:80, 126`)?
- Welche Build-Seitenzahl gilt: 187, 194 oder 198?
- Sollen die Stadtseiten ohne echte Texte live gehen? UMSETZUNG 9.4 rät davon ab.
- Ist der Gestaltungsumbau vor oder nach Paket 5 geplant? Die Markup-Tests in Abschnitt 7 bestimmen den Aufwand.

=== ENDE E0-KUNDSCHAFTER-qualitaet · BEREIT ZUR RÜCKGABE ===