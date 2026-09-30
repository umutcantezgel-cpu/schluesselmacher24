# Red-Team Audit Report
## 1. Silent Logic Death & Interaction Traps
- Analyzed existing components in src/app/(site)/ for empty onClick handlers. Form interactions must be robust. Found some components missing explicit loading states.
- Checked `components/ui/button.tsx` and `components/calculator/service-einsatz-rechner.tsx` for hydration traps.

## 2. Hydration Mismatches & SSR Conflicts
- Reviewed global window usages. Needs strict useEffect boundaries.
- Identified non-deterministic rendering patterns in `components/autoschluessel/termin-auswahl.tsx`.

## 3. TypeScript Weaknesses
- Checked for potential `any` or unverified types in schemas.
- `satisfies Graph` checks against `schema-dts` require stricter bounds.

## 4. Core Web Vitals Sins
- Images in `components/ui/image-placeholder.tsx` must have strict dimensions and reserved aspect ratios.
- Noted heavy third-party libs imported directly into client components.
