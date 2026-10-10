# Red-Team Audit & Inspection
## 1. Silent Logic Death & Interaktions-Fallen
- `components/flow/flow-shell.tsx`: Found unhandled error states on submission.
- `app/schliessanlagen/page.tsx`: Buttons without clear loading indicators.

## 2. Hydration Mismatches & SSR-Konflikte
- Mismatched initial states detected in `components/vertrauen/nachweise-liste.tsx`.
- Window-based checks lacking useEffect in `components/visual/registry.tsx`.

## 3. Core Web Vitals
- Missing dimension constraints on generic image placeholders.
- Redundant re-renders during state updates in flow navigation.

## 4. Swiss Light Design Doctrine
- Evaluated kinetic discipline: Multiple animations compete for attention in the index route.
- Needs strict OKLCH refinement (0.988 0.002 260) for surface backgrounds.
