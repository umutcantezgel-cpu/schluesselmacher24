# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/schliessanlagen/system-erklaerung.tsx`: Missing hover state handlers for key elements, potential empty array mappings if data fails to fetch.
- `src/components/recht/anfrage-hinweis.tsx`: Potential for silent failure if tracking logic fails without user feedback.

## 2. Hydration Mismatches & SSR-Konflikte
- No immediate `window` or `document` usage found in Server Components without proper Client Component isolation, but `src/components/statistik/google-analytics.tsx` requires careful `use client` boundaries.
- Need to ensure `src/components/vertrauen/werkstatt-zeile.tsx` handles date/time safely if dynamic relative times are added.

## 3. TypeScript-Schwächen
- High risk of `any` or `unknown` casts in third-party API integration points. Strict verification needed in generic data tables.
- `src/components/seo/json-ld.tsx`: Ensure it strictly uses `satisfies Graph` against `schema-dts`.

## 4. Core Web Vitals Sünden
- Ensure all images in `/autoschluessel` routes have explicit `width` and `height` properties.
- Avoid heavy third-party libraries in critical path for `app/(site)/page.tsx`.

## 5. Design-Kritik nach Schweizer Aesthetik-Standards
- **Chromatische Reinheit:** Need to enforce `oklch(0.988 0.002 260)` across all background canvas elements.
- **Typografische Rhythmik:** Check header negative tracking implementation in `src/app/(site)/page.tsx`.
- **Kinetische Disziplin:** Ensure only one dominant interaction exists per route.
