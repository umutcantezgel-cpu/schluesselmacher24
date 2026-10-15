# E0-Kundschafter: Stack, Struktur, Skripte, Konventionen, Auslieferung

Stand: HEAD `71dbadd`. Nur gelesen. Kein Build und kein `npm install`, `node_modules` fehlt im Repo. Alles Unverifizierte ist als Upstream-Wissen oder OFFENE FRAGE markiert.

## 1. Stack mit Versionen

- Next 16.3.5 (`package.json` `^16.3.5`; `package-lock.json:10122`)
- React und react-dom 19.2.4, exakt gepinnt (`package-lock.json:11274`)
- TypeScript 5.9.3, `strict` aktiv (`tsconfig.json`; lock:13457)
- Tailwind CSS 3.4.19 (lock:12497), PostCSS 8.5.23, autoprefixer ^10.5.0 (`postcss.config.mjs`)
- Payload 3.90.2: `payload`, `@payloadcms/next`, `db-postgres`, `richtext-lexical`, `ui`, `translations` (lock:10609); sharp 0.35.4
- `pg` 8.20.0 nur transitiv über `@payloadcms/db-postgres` (lock:3304, :10698); `scripts/db.mjs` nutzt es per `require('pg')`
- embedded-postgres 17.10.0-beta.17, devDependency (lock:6745)
- Vitest 2.1.9 mit `@vitest/coverage-v8` 2.1.9 (lock:13835)
- ESLint 9.39.5 (lock:7067), eslint-config-next 16.2.7 (lock:7128), also abweichend von next 16.3.5
- Weitere Laufzeitpakete: zod 4.4.3, zustand 5.0.14, stripe 22.6.2, framer-motion 12.40.0, lucide-react ^1.17.0; devDependencies: tailwind-merge 3.6.0, clsx 2.1.1
- Lockfile: `lockfileVersion` 3
- Node: kein `engines`-Feld, keine `.nvmrc` oder `.node-version`. Untergrenze aus dem Lock: next `>=20.9.0` (lock:10137), @payloadcms/next `^18.20.2 || >=20.9.0` (lock:3373)
- Bundler: Skripte setzen kein Flag. Turbopack ist Next-16-Standard (Upstream-Wissen, nicht verifiziert). `next.config.ts:49` setzt `turbopack.root`. Der webpack-Hook (`next.config.ts:53`) gilt laut Kommentar nur für `next build --webpack`.
- Deklariert, aber ohne Import in `src/` (0 Treffer): react-hook-form, @hookform/resolvers, @fontsource/ibm-plex-sans, graphql, framer-motion (nur in `src/components/visual/README.md` erwähnt). `stripe` hat keinen `from 'stripe'`-Import. `README.md` nennt react-hook-form als Formular-Stack.
- `schema-dts` steht doppelt in `dependencies` (`package.json:44`) und `devDependencies` (`package.json:61`).

## 2. Verzeichnisstruktur src/

Dateizahlen: app 88, components 117, lib 69, payload 25, migrations 8, scripts 3, test 2.

- `src/app/`: App Router. `(site)/` öffentliche Seiten und Route-Handler (u. a. `api/kunden-upload/route.ts`). `(payload)/` Admin-UI und REST (`admin/[[...segments]]`, `api/[...slug]`). Außerdem `robots.ts`, `sitemap.ts`, `llms.txt/route.ts`.
- `src/components/`: `visual/` (83 Dateien: icons, generators, motion, registry, bereich-icon), `autoschluessel/` (7), `calculator/` (4), `flow/` (1), `forms/` (4), `layout/` (7, Header, Footer, MobileActionBar), `schliessanlagen/` (1), `seo/` (1, json-ld), `ui/` (7), `vertrauen/` (2).
- `src/lib/`: `data/` (Fassade `index.ts`, `json-adapter.ts`, `payload-adapter.ts`, `payload-mapping.ts`, `defaults/`), `server/` (rate-limit, kundendateien, datei-pruefung, access-token, create-record), `actions/` (Server Actions: orders, booking, records), `integrations/` (Status Zahlung, Mail, Dateiablage), `richtwerte/` (Rechner), `flow/`, `store/` (cart.ts, zustand), `visual/` (area-theme). Einzeldateien: cn.ts, navigation.ts, site-url.ts, types.ts, reference.ts, pricing.ts, staffel.ts, scheduling.ts, artikel.ts, format.ts.
- `src/payload/`: `collections/` (16), `globals/` (3: Einstellungen, Richtwerte, Zylinderkatalog), `access/rollen.ts`, `hooks/` (loeschsperre.ts, revalidate.ts), `fields/gemeinsam.ts`, `components/Marke.tsx`, `seed.ts`.
- `src/payload.config.ts`: Datenbank `:90`, `push: false` `:92`, `migrationDir` `:93`.
- `src/payload-types.ts`: generiert.
- `src/migrations/`: 4 Migrationen (.ts und .json) plus `index.ts`.
- `src/scripts/`: seed.ts, admin-anlegen.ts, aufbewahrung-bereinigen.ts.
- `src/test/`: db-global-setup.ts, server-only-stub.ts.
- `content/` (außerhalb `src`): JSON-Inhalte und Fallback-Datenquelle.

Pfadaliase: `tsconfig.json` `paths` setzt `@/*` auf `./src/*` und `@payload-config` auf `./src/payload.config.ts`. `vitest.config.ts` ergänzt `@`, `@payload-config` und `server-only` (auf den Stub in `src/test/`).

Barrel-Dateien `index.ts`: `src/lib/data/index.ts`, `src/lib/data/defaults/index.ts`, `src/lib/integrations/index.ts`, `src/migrations/index.ts` (Pflicht für Payload). Die Regel „keine Sammeldateien“ steht nur in `src/components/visual/README.md`.

## 3. npm-Skripte

- `dev` (`package.json:7`): `node scripts/db.mjs ensure && next dev`. Startet lokales Postgres auf 127.0.0.1:5433 (`scripts/db.mjs:23`, Daten in `.data/postgres`, `:21`). Fehlen die Binärdateien in `node_modules/@embedded-postgres`, bricht `ensure` ab und `next dev` startet nicht. Ohne `DATABASE_URL` liest die Seite JSON (`src/lib/data/index.ts:22`), das Postgres läuft dann ungenutzt. Kein migrate, kein seed.
- `build` (`:8`): Bedingte Kette. Nur wenn `DATABASE_URL` gesetzt ist oder `VERCEL` fehlt, läuft `db.mjs ensure && payload migrate && payload run src/scripts/seed.ts`. Sonst gibt es eine Meldung „Build ohne Datenbank“. Danach `next build`.
  - Auf Vercel ohne `DATABASE_URL`: baubar. Die Seite liest `content/*.json` (`json-adapter.ts`, Fallback `defaults/` bei fehlender Datei).
  - Mit `DATABASE_URL`: migrate und seed laufen bei jedem Build. Der seed ist idempotent über den Vermerk `sm24:seed:<name>` (`src/payload/seed.ts`, Kopfkommentar).
  - Lokal ohne `DATABASE_URL`: Die erste Bedingung greift, weil `VERCEL` fehlt. `db.mjs` startet Postgres, setzt aber `DATABASE_URL` nicht. `payload migrate` bekommt dann keine URL (`payload.config.ts:90` ergibt `undefined`). Vermutlich Fehler, nicht ausgeführt, siehe OFFENE FRAGE 1.
  - `db.mjs ensure` ist auf Vercel ein No-op und startet bei externer `DATABASE_URL` nichts (`scripts/db.mjs:103-123`).
- `start`: `next start`.
- `lint`: `eslint .` (`eslint.config.mjs`).
- `typecheck`: `tsc --noEmit`.
- `test` (`:13`): `vitest run && vitest run -c vitest.db.config.ts`.
  - Unit (`vitest.config.ts:11`): schließt `src/**/*.db.test.ts` und `.claude/**` aus.
  - DB (`vitest.db.config.ts:11-13`): `include` nur `src/**/*.db.test.ts`, `fileParallelism: false`, `globalSetup` = `src/test/db-global-setup.ts`.
  - Das globalSetup startet eine eigene Instanz auf Port 5434 (`src/test/db-global-setup.ts:12`, überschreibbar mit `SM24_TEST_PG_PORT`). Datenverzeichnis liegt in `os.tmpdir()`, Datenbank `sm24_test`. Es führt `db.mjs start`, `payload migrate` und den seed aus und stoppt danach. Es braucht keine laufende DB, aber die Binärdateien und `initdb`.
- `test:unit`, `test:db`: Einzelteile von `test`.
- `db:start`, `db:stop`, `db:status`, `db:reset` (`:15` ff.): `scripts/db.mjs`. `reset` löscht das Datenverzeichnis.
- `db:migrate`: `payload migrate` (braucht `DATABASE_URL`).
- `seed` und `db:seed`: `payload run src/scripts/seed.ts`.
- `generate:types`: schreibt `src/payload-types.ts`. `generate:importmap`: schreibt `src/app/(payload)/admin/importMap.js`.
- `admin:anlegen`: `admin-anlegen.ts`, liest `SEED_ADMIN_EMAIL` und `SEED_ADMIN_PASSWORD` (mind. 12 Zeichen).
- `aufbewahrung:bereinigen`: `aufbewahrung-bereinigen.ts`, löscht abgelaufene Kundendateien. Mit `-- --probe` nur Anzeige.
- `payload`: Payload-CLI.

## 4. Konventionen

- Dateinamen: kebab-case (107 Dateien in `src/` mit Bindestrich). PascalCase nur bei Payload-Definitionen (`src/payload/collections/*.ts`, `globals/*.ts`, `components/Marke.tsx`). Migrationen mit Zeitstempel. Pfade ohne Umlaute (`schliessanlagen`).
- Exporte: Komponenten nutzen named exports (101 Dateien, 0 default). Default-Exporte nur dort, wo Next es verlangt (page, layout, route, robots, sitemap).
- Server und Client: 34 Dateien in `src/` mit `'use client'`, davon 16 der 114 `.tsx` in `components/`. Standard ist die Server-Komponente. Generatoren sind laut `components/visual/README.md` Server-Komponenten.
- `import 'server-only'` in 8 Dateien, z. B. `src/lib/data/index.ts:1`, `src/lib/data/payload-adapter.ts:1`.
- Server Actions mit `'use server'`: `src/lib/actions/orders.ts`, `booking.ts`, `records.ts`.
- Klassen: `cn()` in `src/lib/cn.ts:4` als `twMerge(clsx(inputs))`, in 28 Dateien importiert. clsx und tailwind-merge sind dafür als devDependencies deklariert.
- ESLint: nur `eslint-config-next` (core-web-vitals und typescript, `eslint.config.mjs:1-4`), keine eigenen Regeln. Ein Disable in `src/` (`components/forms/photo-upload.tsx:220`). Ignoriert: `src/migrations/**`, `src/payload-types.ts`, `importMap.js`, `.claude/**` (`eslint.config.mjs:9-18`).
- Prettier: nicht vorhanden. Keine `.prettierrc` und keine `.editorconfig`, Prettier nur transitiv im Lock (`package-lock.json:9026`). Der Stil ist uneinheitlich: Der Anwendungscode nutzt einfache Anführungszeichen mit Semikolons, die Payload-Dateien sind ohne Semikolons generiert.
- Sprache: Kommentare, JSDoc, UI-Texte und Fachbegriffe deutsch. Technische Bezeichner teils englisch (`read`, `write`, `adapter`).
- Tests: `*.test.ts(x)` neben den Quellen. DB-Tests als `*.db.test.ts` (`src/lib/data/`, `src/lib/server/`). Ein Test im App-Ordner: `src/app/(site)/api/kunden-upload/route.test.ts`.
- Commits (letzte 50): 30 feat, 7 merge, 4 docs, 2 test, 2 chore, 2 build, 1 refactor, 1 fix, 1 `test/docs`. Format `typ(scope): Beschreibung` auf Deutsch, z. B. `939b48d feat(auftraege): ...` und `71dbadd build: auf Vercel nie ein lokales Postgres starten`.
- CI: kein `.github/`, kein Dockerfile. Im Repo gibt es keine automatischen Prüfungen.

## 5. Auslieferung

- Ziel: vermutlich Vercel, nicht im Repo konfiguriert (kein `vercel.json`). Belege: `package.json:8` prüft `$VERCEL`, `scripts/db.mjs` hat einen VERCEL-Zweig, `json-adapter.ts:40` setzt `writable = !VERCEL`, `integrations/index.ts:143`, `.gitignore` enthält `.vercel`, Commit `71dbadd`.
- `next.config.ts`:
  - `poweredByHeader: false` (`:45`).
  - `outputFileTracingIncludes` für `/*` mit `./content/**/*` (`:46`).
  - `turbopack.root` (`:49`).
  - `headers()` (`:61`) setzt für alle Pfade: CSP (`csp()` `:18`), X-Frame-Options SAMEORIGIN, nosniff, Referrer-Policy, Permissions-Policy (Kamera, Mikrofon, Geo aus), HSTS (`:33`).
  - CSP: `script-src 'unsafe-inline'` (`unsafe-eval` nur in dev), `img-src 'self' data: blob: https:`, `connect-src 'self'`, `form-action` für Stripe-Checkout.
  - Payload-Header-Regel auf `/admin` begrenzt (`:71` ff.).
  - Kein `images`-, `redirects`-, `rewrites`- oder `experimental`-Block.
- `src/app/robots.ts`: `allow /`, `disallow /admin, /kasse, /warenkorb, /bestellung`, Sitemap `${siteUrl}/sitemap.xml`.
- `src/app/sitemap.ts`: feste Routen in `STATIC_ROUTES` (`:17`, Kommentar „Neue Routen hier ergänzen“). Dynamisch aus Marken, Modellen, Codelinien (ohne `example` und `noindex`), Standardartikeln (`istIndexierbar`), Leistungsseiten, Ratgebern und Städten (`:57`).
- `src/app/llms.txt/route.ts:4`: `dynamic = 'force-static'`, aus `NAV_AREAS`.
- Middleware oder Proxy: keine Datei vorhanden, weder `middleware.ts` noch `proxy.ts`, auch nicht unter `src/`. Schutz liegt pro Route und Handler, z. B. `src/lib/server/rate-limit.ts`.
- Basis-URL: `getSiteUrl()` in `src/lib/site-url.ts` liest `NEXT_PUBLIC_SITE_URL` und fällt auf `VERCEL_URL` zurück. Payload nutzt `NEXT_PUBLIC_SERVER_URL` (`payload.config.ts`), Default `http://localhost:3000`.
- Payload-REST unter `src/app/(payload)/api/[...slug]/route.ts`. GraphQL ist aus (`payload.config.ts:97`).
- `.gitignore` schließt `.data/`, `media/`, `private-uploads/` und `content/records.json` aus. `content/records.json` fehlt im Checkout, es greift der Fallback `defaults/`.

## 6. Next-16-Besonderheiten

- Keine `middleware.ts` und keine `proxy.ts`. Keine `experimental`-Flags. Kein `cacheComponents`, kein `'use cache'` (0 Treffer in `src/` und `next.config.ts`). Caching ist implizit.
- `params` und `searchParams` sind Promises, z. B. `src/app/(site)/standorte/[city]/page.tsx:22,35` und die generierte Admin-Seite. Sie müssen `await`ed werden.
- `connection()` in `src/app/(site)/bestellung/[id]/page.tsx:153` erzwingt dynamisches Rendern.
- `generateStaticParams` in 8 Routen: `tuer-und-schliesstechnik/[slug]`, `standorte/[city]`, `ratgeber/[slug]`, `sicherheitstechnik/[slug]`, `artikel/[slug]`, `schluessel-nach-code/[slug]`, `autoschluessel/marken/[make]` und `[model]`. Der Build liest dafür Daten aus JSON oder DB.
- `revalidatePath('/', 'layout')` in `src/payload/hooks/revalidate.ts:19-20`, per dynamischem Import.
- `next/font/google` in `src/app/(site)/layout.tsx` lädt Schriften beim Build aus dem Netz (Upstream-Wissen).
- Generierte Dateien mit „DO NOT MODIFY“: `(payload)/admin/[[...segments]]/page.tsx`, `(payload)/layout.tsx`, `(payload)/api/[...slug]/route.ts`, `importMap.js`.
- `AGENTS.md` verlangt das Lesen von `node_modules/next/dist/docs`. `node_modules` fehlt, das ist hier nicht prüfbar.

## 7. Arbeitsordner `_werkstatt`

- Der Ordner `_werkstatt` existiert nicht. Namens- und Volltextsuche im Repo ergeben 0 Treffer. Die einzige Fundstelle ist `src/components/visual/icons/werkstatt.tsx` (Icon „Werkstatt“, kein Ordner).
- Falls der Ordner angelegt wird, würde er erfasst von:
  - ESLint: keine Ignorierung in `eslint.config.mjs`, also wird er gelintet.
  - tsc: `tsconfig.json:34` `include` mit `**/*.ts(x)`. Ausgeschlossen sind nur `node_modules` und `.claude` (`:42`).
  - Tailwind: `tailwind.config.ts:17` `./src/**/*.{ts,tsx}`. Außerhalb von `src/` erzeugt er keine Klassen.
  - Vitest unit: kein `include`, Default `**/*.test.*`. Ausgeschlossen sind nur `.claude/**` und `src/**/*.db.test.ts`.
  - Git: `.gitignore` kennt nur `/.claude/worktrees/`, der Ordner würde committet.
  - Auslieferung: kein Pfad in `outputFileTracingIncludes`. Das Bundle ist nur betroffen, wenn etwas importiert wird.
- Ausschluss müsste ergänzt werden in `eslint.config.mjs` (`globalIgnores`), `tsconfig.json` (`exclude`) und `vitest.config.ts` (`exclude`). Vorbild ist `.claude/`.

## 8. OFFENE FRAGEN

1. Lokaler `npm run build` ohne `DATABASE_URL` und ohne `VERCEL`: Die Skriptlogik deutet auf einen Fehler bei `payload migrate`, weil `db.mjs` keine URL setzt. Nicht ausgeführt. Ist das gewollt?
2. `npm run dev` ohne `DATABASE_URL` startet trotzdem Postgres und bricht ohne Binärdateien ab. Ist das gewollt?
3. Ist Vercel das Zielsystem? Build-Command, Umgebungsvariablen, Node-Version und ein Cron für `aufbewahrung:bereinigen` liegen außerhalb des Repos.
4. Node-Version: nur Untergrenze aus dem Lock (>=20.9). Keine Pin-Datei, kein `engines`-Feld.
5. Braucht der Build Netz für `next/font/google`? Offline- oder CI-Builds sind ungeklärt.
6. Ungenutzte Abhängigkeiten: react-hook-form, @hookform/resolvers, @fontsource/ibm-plex-sans, graphql, framer-motion, und stripe ohne Import. Entfernen oder geplant?
7. `schema-dts` ist doppelt deklariert (`package.json:44` und `:61`).
8. `pg` ist nur transitiv installiert, `scripts/db.mjs` nutzt es direkt. Das hängt am Hoisting.
9. `.env.example` fehlen `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `SM24_DATA` und `SEED_ADMIN_*`. Die Variablen `STORAGE_PROVIDER` und `STORAGE_BUCKET` werden im Code nicht gelesen.
10. `PAYMENT_PROVIDER` und `MAIL_PROVIDER` ergeben laut Status „konfiguriert“, der Code meldet aber „noch nicht implementiert“ (`src/lib/integrations/index.ts:80`, `:126`). Ist das beabsichtigt?
11. `initdb` verweigert in der Regel die Ausführung als root (Upstream-Wissen). Die Repo-Dateien gehören root. Laufen dev und DB-Tests in einer Root-Umgebung?
12. Tailwind scannt nur `src/**/*.{ts,tsx}`. Klassen in `content/*.json` oder in Payload-Richtext erzeugen kein CSS. Beabsichtigt?
13. Der Build-Befehl führt kein eslint und keine Tests aus, und es gibt keine CI-Konfiguration im Repo.
14. `_werkstatt`: Meint der Auftrag einen neuen Ordner oder die Datei `src/components/visual/icons/werkstatt.tsx`?

=== ENDE E0-KUNDSCHAFTER-stack · BEREIT ZUR RÜCKGABE ===