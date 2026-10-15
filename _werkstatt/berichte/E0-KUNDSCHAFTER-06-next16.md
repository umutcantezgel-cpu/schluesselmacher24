# E0-Kundschafter-06: Next 16.3, React 19.2, tailwind-merge 3.6 für sechs geplante Techniken

Stand: HEAD `b49fe04`. Nur gelesen. Kein Build, kein Test, kein Install. Quellen nur aus `node_modules` sowie zur Gegenprüfung `postcss.config.mjs`, `package.json`, `tsconfig.json`, `next-env.d.ts`. Abkürzungen: `DOC` = `node_modules/next/dist/docs/`, `NJ` = `node_modules/next/dist/`, `TM` = `node_modules/tailwind-merge/`. Die Probe in Abschnitt 8 lief als `node -e` gegen das installierte Paket; es wurde keine Datei geschrieben.

Versionen: next 16.3.5 (`node_modules/next/package.json`), react 19.2.4 (`node_modules/react/package.json:7`), @types/react 19.2.16, tailwind-merge 3.6.0, tailwindcss 3.4.19, autoprefixer 10.5.0, postcss 8.5.28.

## 1. Verzeichnis `node_modules/next/dist/docs/` (456 Dateien)

- `01-app/` (283): `01-getting-started`, `02-guides` (u. a. `view-transitions.md`, `upgrading/version-16.md`), `03-api-reference` (`01-directives`, `02-components`, `03-file-conventions`, `04-functions`, `05-config`, `06-cli`, `07-adapters`), `04-glossary.md`
- `02-pages/` (164): `01-getting-started`, `02-guides`, `03-building-your-application`, `04-api-reference`
- `03-architecture/` (5): accessibility, fast-refresh, nextjs-compiler, supported-browsers
- `04-community/` (3): contribution-guide, rspack
- `index.md` (Wurzel)

## 2. View Transitions

- Kein Flag: `experimental.viewTransition` kommt in den Docs und in `NJ/` nicht vor (Config-Liste `DOC/01-app/03-api-reference/05-config/01-next-config-js/`). Die Doku sagt: „View transitions work in the App Router with no configuration“ (`DOC/01-app/02-guides/view-transitions.md:50`).
- Import: `import { ViewTransition } from 'react'` (`view-transitions.md:55-59`), ohne `unstable_`-Präfix.
- React-Kanal: Der App Router aliasiert `react` auf `next/dist/compiled/react` (`NJ/build/create-compiler-aliases.js:284-288`, `NJ/build/webpack-config.js:673`). Dieses Bundle ist `19.3.0-canary-cbb046ab-20260731` (`NJ/compiled/react/cjs/react.development.js:1325`) und exportiert `ViewTransition` (`:878`) und `addTransitionType` (`:993`). Der `-experimental`-Kanal greift nur bei `blockingSSR`, `taint`, `transitionIndicator` oder `gestureTransition` (`NJ/esm/lib/needs-experimental-react.js:2-5`).
- Projekt-`react` 19.2.4 exportiert `ViewTransition` und `addTransitionType` nicht (kein Treffer in `react/cjs/react.development.js` und `react.production.js`). Die Auflösung im Build läuft über den Alias.
- Typen: `ViewTransition` steht nur in `node_modules/@types/react/canary.d.ts:109` (Props `:49-108`), nicht in `index.d.ts`. Geladen wird es über `/// <reference types="react/canary" />` oder `import {} from 'react/canary'` (`canary.d.ts:15-21`). Das Projekt setzt kein `types`-Array (`tsconfig.json`), und `next-env.d.ts` referenziert nur `next` und `next/image-types/global`. Folgerung, nicht per tsc geprüft: Der Import braucht eine Typ-Referenz auf `react/canary`. OFFENE FRAGE 1.
- Auslöser: `<ViewTransition>` läuft bei Transitions, `<Suspense>` und `useDeferredValue`; reines `setState` nicht. `<Link>`-Navigation ist eine Transition (`view-transitions.md:61`).
- Gemeinsame Elemente: gleiches `name` auf altem und neuem Element genügt (`view-transitions.md:69-89`, `:108`). Fällt die Zielseite in einen Suspense-Fallback, entsteht kein Paar (`:112`).
- Morph anpassen: `share="morph"` zusammen mit `default="none"`. Ohne `share` stoppt das Paar stillschweigend (`:116-124`). Props: `canary.d.ts:49-108`.
- Richtung: `<Link transitionTypes={['nav-forward']}>` (`view-transitions.md:226-232`; `DOC/01-app/03-api-reference/02-components/link.md:505-520`, seit v16.2.0 `:1374`). Der Typ wird per `React.addTransitionType` gesetzt (`link.md:509-510`). `router.push`/`replace` nehmen `transitionTypes` ebenfalls an (`DOC/01-app/03-api-reference/04-functions/use-router.md:44-45`). Browser-Zurück trägt keinen Typ (`view-transitions.md:358`).
- `prefers-reduced-motion`: Keine automatische Reaktion belegt. Die Doku empfiehlt CSS, das `animation-duration: 0s !important` auf `::view-transition-*` setzt (`view-transitions.md:378-389`).
- Browser: Chromium 125+ (`view-transitions.md:53`). Ohne Unterstützung animiert nichts, die App funktioniert normal.
- Beispiele: Morph `view-transitions.md:63-106`, Suspense `:152-172`, Richtung `:248-264`, Header `:335-352`, Klicks `:365-368`.

## 3. Schriften `next/font/google`

- Defaults: `display` = `'swap'` (`DOC/01-app/03-api-reference/02-components/font.md:172-182`; Code `NJ/compiled/@next/font/dist/google/validate-google-font-function-call.js:12`). `preload` = `true` (`font.md:184-194`). `fallback` hat keinen Default (`font.md:196-206`). `adjustFontFallback` = `true` für Google (`font.md:208-220`).
- Ersatzmetriken: Mit `adjustFontFallback` nutzt der Loader vorberechnete Werte (`NJ/compiled/@next/font/dist/google/loader.js:66`, `get-fallback-font-override-metrics.js:48-56`). Berechnung in `NJ/server/font-utils.js:21-41` aus `NJ/server/capsize-font-metrics.json`. Ersatzschrift: `Times New Roman` nur für Kategorie `serif`, sonst `Arial` (`NJ/shared/lib/constants.js:402-411`, `font-utils.js:26`). Also fällt IBM Plex Mono (Kategorie monospace) auf `Arial`.
- Metrik-Schlüssel vorhanden: `inter`, `iBMPlexSans`, `iBMPlexMono` (`NJ/server/capsize-font-metrics.json`).
- Widerspruch: Die Doku nennt bei `preload` ohne `subsets` eine Warnung (`font.md:438`). Der Code ruft `nextFontError` auf (`validate-google-font-function-call.js:27-29`), und diese Funktion wirft (`NJ/compiled/@next/font/dist/next-font-error.js:10`). Maßgeblich ist der Code: Build bricht ab.
- Änderungen gegenüber 14/15: Die Docs nennen nur die Umbenennung `@next/font` zu `next/font` (`DOC/01-app/02-guides/upgrading/version-15.md:545-554`). Die Versionstabelle (`font.md:1063-1067`) hat nur v13-Einträge, der v16-Guide kennt keinen Font-Abschnitt. Ein Vergleich mit 14 ist nicht belegbar. OFFENE FRAGE 2.

## 4. Fehlerseiten

- `error.tsx`: Muss `'use client'` haben (`DOC/01-app/03-api-reference/03-file-conventions/error.md:21`, `:54`). Props: `error: Error & { digest?: string }`, `retry: () => void` (`error.md:25-31`). `reset` bleibt verfügbar, die Doku rät aber zu `retry` (`error.md:155-157`).
- Versionen: `unstable_retry` kam in v16.2.0, `retry` ist seit v16.3.0 stabil (`error.md:331-332`). Die Laufzeit reicht `error`, `reset` und `retry` durch (`NJ/client/components/error-boundary.js:110-115`). `unstable_retry` taucht in `NJ/` nicht auf.
- `global-error.tsx`: `'use client'` (`error.md:167`), Props `{ error, retry }`, muss `<html>` und `<body>` selbst rendern (`error.md:169-190`). Kein `metadata`-Export (`:167`). Ein App-Theme per `data-theme` erreicht sie nicht (`:165`).
- `not-found.tsx`: Keine Props (`DOC/01-app/03-api-reference/03-file-conventions/not-found.md:131`). Rendert zwischen `loading` und `page` (`:43`). Standard-404 folgt `prefers-color-scheme`, nicht `data-theme` (`:45`).
- `global-not-found.tsx` ist experimentell: `experimental.globalNotFound: true` (`not-found.md:47-71`, seit v15.4.0).

## 5. Metadata und OG-Bild

- `opengraph-image.tsx` nutzt `ImageResponse` aus `next/og` (`DOC/01-app/03-api-reference/04-functions/image-response.md:15`). Exporte `alt`, `size`, `contentType` (`DOC/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md:257-262`). Default 1200×630 (`image-response.md:20-21`).
- Next 16: `params` und `id` in der Bildfunktion sind Promises. `generateImageMetadata` bleibt synchron (`DOC/01-app/02-guides/upgrading/version-16.md:317-349`).
- Laufzeit: Default `nodejs` (`DOC/01-app/03-api-reference/02-route-segment-config/runtime.md:18`). `edge` ist veraltet (`:19`, `:23`).
- Grenzen: Bundle max. 500 KB inkl. Fonts (`image-response.md:51`). Fonts nur `ttf`, `otf`, `woff` (`:52`). OG-Datei max. 8 MB, sonst Build-Abbruch (`opengraph-image.md:30`).
- Lokale Schrift: `readFile(join(process.cwd(), 'assets/Inter-SemiBold.ttf'))` auf Modulebene, dann `fonts: [{ name, data, weight, style }]` (`image-response.md:159-200`). Lokale Assets relativ zum Projektroot (`opengraph-image.md:417`).
- Statisch vorgerendert, sofern keine Request-APIs (`opengraph-image.md:91`).
- Satori-Grenze: nur Flexbox und eine CSS-Untermenge, kein `display: grid` (`image-response.md:50`).

## 6. Link und Navigation

- Prefetch-Default `"auto"`/`null`: statisch volle Route, dynamisch bis zum nächsten `loading.js` (`DOC/01-app/03-api-reference/02-components/link.md:302`). `true` = volle Route, `false` = nie (`:304`). Nur in Production (`:297`).
- `partialPrefetching: true` ändert den Default auf App Shell (`link.md:306`, `DOC/01-app/03-api-reference/05-config/01-next-config-js/partialPrefetching.md`). Das Projekt setzt das Flag nicht.
- Next 16: Layout-Deduplizierung und inkrementelles Prefetching ohne Codeänderung (`version-16.md:571-578`).
- Scroll: Default `scroll` = `true`, Position bleibt, solange die Seite sichtbar ist (`link.md:232`; Code `NJ/client/app-dir/link.js:142`). `scroll={false}` (`link.md:230-234`). Sticky-Header: `scroll-padding-top` (`link.md:922-972`).
- `onNavigate` (seit v15.3.0, `link.md:453-503`). `preventDefault` ist im Code belegt (`NJ/client/app-dir/link.js:71-80`). Nicht bei Strg-Klick, externen URLs oder `download` (`link.md:499-503`).
- `useLinkStatus` liefert `{ pending }`, nur in einer Kindkomponente von `<Link>`, übersprungen bei Prefetch, nur App Router (`DOC/01-app/03-api-reference/04-functions/use-link-status.md:12`, `:69-73`, `:99`, seit v15.3.0 `:242`). Export: `NJ/client/link.d.ts:117`.
- Undokumentiert: `unstable_dynamicOnHover` (`NJ/client/app-dir/link.d.ts:125`, `link.js:100`).

## 7. CSS: `animation-timeline`, `view-timeline`, `@supports`, `@property`

- Projekt: `postcss.config.mjs:2-5` führt nur `tailwindcss` und `autoprefixer` aus. Kein `postcss-preset-env`, kein `lightningcss`.
- Bundler: Das `build`-Skript ruft `next build` ohne `--webpack` auf (`package.json`). Standard ist Turbopack (`DOC/01-app/03-api-reference/08-turbopack.md:39`). Turbopack nutzt immer Lightning CSS (`DOC/01-app/03-api-reference/05-config/01-next-config-js/useLightningcss.md:11`) und führt PostCSS-Configs aus (`08-turbopack.md:99`).
- Webpack-Pfad (nur `--webpack`): PostCSS mit `postcss-preset-env` (`useLightningcss.md:9`, `NJ/build/webpack/config/blocks/css/plugins.js:73`).
- Lightning CSS im SWC-Binär (`node_modules/@next/swc-linux-x64-gnu/next-swc.linux-x64-gnu.node`): Pfadstrings nennen `lightningcss-1.0.0-alpha.70`. Der Binär enthält u. a. `animation-timeline`, `animation-range-start/end`, `timeline-range-percentage`, `@property`, `@supports`, `@view-transition`. Der Eigenschaftsstring `view-timeline` fehlt. Befund aus Binärstrings, keine Verhaltensprüfung.
- Tailwind 3.4.19 verarbeitet nur `@tailwind`, `@import`, `@apply`, `@layer`, `@responsive`, `@variants`, `@screen` (`node_modules/tailwindcss/lib/lib/normalizeTailwindDirectives.js:22-78`). `@property` und `@supports` haben dort keinen Zweig und bleiben unverändert. `animation-timeline` steht in `tailwindcss/lib/util/dataTypes.js:98` nur für die Typinferenz.
- Autoprefixer 10.5.0 verarbeitet `@supports` (`autoprefixer/lib/processor.js:62-73`). In `node_modules/autoprefixer/` gibt es keinen Eintrag zu `timeline` (0 Treffer). Es entstehen keine Präfixe.
- Browserlisten: Kein `browserslist`-Feld in `package.json`, keine `.browserslistrc`. Die Zielbrowser für Lightning CSS sind damit nicht festgelegt. OFFENE FRAGE 3: Ob `@supports (animation-timeline: view())` unverändert ausgegeben wird, belegt nur ein Build.

## 8. tailwind-merge 3.6.0

- Abhängigkeiten: keine (`TM/package.json:63` `"dependencies": {}`), keine `peerDependencies`. Tailwind-Konfiguration liest das Paket nicht.
- Versionsfrage: `TM/README.md:21` sagt „Supports Tailwind v4.0 up to v4.3 (if you use Tailwind v3, use tailwind-merge v2.6.0)“. Das Projekt nutzt Tailwind 3.4.19. OFFENE FRAGE 4: Auswirkungen von 3.6.0 auf Tailwind-3-Klassen sind nicht geprüft.
- API: `extendTailwindMerge(configExtension, ...createConfig)` (`TM/dist/types.d.ts:2782`, Quelle `TM/src/lib/extend-tailwind-merge.ts:8-27`). `ConfigExtension` (`types.d.ts:151-154`) hat `extend` und `override`, jeweils mit `theme`, `classGroups` und Weiterem. `extend` hängt Arrays an, `override` ersetzt sie (`TM/src/lib/merge-configs.ts:14-45`, `:52-80`). Also `extend` nutzen, sonst gehen `text-xs` usw. verloren.
- Schema für die Projekt-Tokens:
  ```ts
  extendTailwindMerge({
    extend: {
      theme: {
        text: ['caption','small','body','lead','title-sm','title','headline','display','input'],
        shadow: ['raised','overlay'],
        ease: ['snappy'],            // falls ease-* gebraucht wird
      },
      classGroups: {
        z: [{ z: ['base','header','overlay'] }],
        'min-h': [{ 'min-h': ['touch'] }],
        duration: [{ duration: ['fast','base','slow'] }],
      },
    },
  })
  ```
  Zuordnung: `text-*` über `theme.text` (Gruppe `font-size`, `TM/dist/bundle-mjs.mjs:1485-1487`). `shadow-*` über `theme.shadow` (`:2176-2186`). `z-*`, `min-h-*`, `duration-*` haben keinen Theme-Schlüssel und laufen über `classGroups` (`:980-981`, `:1468-1469`, `:2708-2709`). Gruppen-IDs: `TM/dist/types.d.ts:193` (Theme), `:197` (Klassen).
- Unbekannte `text-<wort>`: Ohne Registrierung wird `text-<wort>` als Textfarbe behandelt. Grund: `color: [isAny]` (`bundle-mjs.mjs:705`) und `text-color` = `scaleColor()` (`:673`, `:1618-1620`).
- Probe ohne Erweiterung: `text-caption text-body` ergibt `text-body`. `text-caption text-white` ergibt `text-white`. `text-xs text-caption` und `text-caption text-sm` bleiben beide erhalten, weil die Größe nicht überschrieben wird. `shadow-raised shadow-overlay` ergibt `shadow-overlay`. `z-40 z-overlay`, `min-h-touch min-h-12`, `duration-fast duration-300`, `ease-snappy ease-in` bleiben jeweils beide erhalten.
- Probe mit der Erweiterung oben: `text-title-sm text-title` ergibt `text-title`, und `text-title text-title-sm` ergibt `text-title-sm`. `text-caption text-white` bleibt beides, und `text-caption text-sm` ergibt `text-sm`. `shadow-sm shadow-raised` ergibt `shadow-raised`. `z-overlay z-header` ergibt `z-header`. `min-h-touch min-h-12` ergibt `min-h-12`. `duration-fast duration-300` ergibt `duration-300`. `ease-snappy ease-in` ergibt `ease-in`.
- Klassen ohne Gruppe bleiben unverändert erhalten (`TM/src/lib/merge-classlist.ts:66-69`).

## 9. React 19.2

- `useEffectEvent`: stabil. `node_modules/react/cjs/react.development.js:1227`, `react.production.js:498`. Typ ohne Canary-Präfix: `node_modules/@types/react/index.d.ts:1791`.
- `<Activity>`: stabil. `react.development.js:795`, `react.production.js:345`. Typ: `index.d.ts:2006`.
- Die Doku nennt beide unter „React 19.2“ (`version-16.md:389-391`).
- `ViewTransition` und `addTransitionType` fehlen im Projekt-`react` 19.2.4 und kommen nur über das Next-Bundle bzw. über `canary.d.ts`.

## Offene Fragen

1. Scheitert `import { ViewTransition } from 'react'` in `tsc` ohne `react/canary`-Referenz? Nicht geprüft.
2. Font-Verhalten 14 gegen 16: nicht aus den Docs belegbar.
3. Lightning CSS: Zielbrowser ohne `browserslist` und das Ausgabeverhalten für `@supports (animation-timeline)` sind nur per Build klärbar.
4. tailwind-merge 3.6.0 gegen Tailwind 3.4.19, obwohl das README v2.6.0 für Tailwind 3 nennt.
5. Die Doku kennt `unstable_retry` nur als Versionshistorie. Die Laufzeit kennt nur `retry`.
6. `unstable_dynamicOnHover` ist im Code vorhanden, aber nicht dokumentiert.
