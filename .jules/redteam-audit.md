# RED-TEAM AUDIT REPORT
## 1. SILENT LOGIC DEATH & INTERACTION TRAPS
- Found several empty onClick handlers in `src/components/calculator/service-einsatz-rechner.tsx` which silently swallow user events.
- Found no loading states in `src/app/(site)/autoschluessel/anfrage/assistent.tsx` upon form submission.
- Missing conditional rendering guards leading to empty layout slots in `src/components/layout/summary-list.tsx` when data arrays are empty.

## 2. HYDRATION MISMATCHES & SSR CONFLICTS
- `src/components/visual/motion/in-view.tsx` accesses `window.innerHeight` directly in the render cycle without `useEffect`, causing hydration warnings on SSR.

## 3. TYPESCRIPT WEAKNESSES
- Encountered `as unknown as Type` masking true shape mismatches in `src/components/forms/field.tsx`.
- `src/components/seo/json-ld.tsx` does not fully validate `schema` shape using `satisfies Graph` against `schema-dts`.

## 4. CORE WEB VITALS SINS
- Hero images in `src/app/(site)/page.tsx` lack explicit `width` and `height` dimensions or reserved aspect ratios.
- Heavy reliance on framer-motion in client components without proper code splitting.

## SWISS LIGHT DESIGN DOCTRINE AUDIT
- Found non-OKLCH hex codes in inline styles inside `src/components/visual/bereich-icon.tsx`.
- Typography in `src/components/layout/page-header.tsx` has unadjusted line-heights and widows.
- Kinetic over-animation detected in `src/components/visual/motion/reveal.tsx` with simultaneous overlapping transitions.
