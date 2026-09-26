# Red-Team Audit Report

## 1. Silent Logic Death & Interaction Traps
- `schluessel-nach-vorlage/anfrage/anfrage-formular.tsx` uses raw `window.scrollTo` that might trap users.
- Button components have loading states but forms sometimes miss error fallback boundaries.
- Empty states or error handling needs refinement across forms to avoid silent failures.

## 2. Hydration Mismatches & SSR Conflicts
- Forms using `window` for `scrollTo` or `localStorage` during render paths present potential hydration issues.
- Need to strictly isolate side-effects within `useEffect` hooks.

## 3. TypeScript Weaknesses
- Found several uses of `as unknown as Type`, suggesting potentially unsafe data modeling, specifically in data mappers and database layer.
- `Schema.org` types need tighter integration with `schema-dts`.

## 4. Core Web Vitals
- Heavy client-side reliance for simple forms could be optimized using server actions.
- Check static image dimensions across all `ImagePlaceholder` usages.

## Visual & Kinetic (Swiss Light Mode)
- Strict adherence to `oklch` base values. Some elements could use tighter kinetic behavior (avoiding multiple simultaneous animations).

*Detailed matrix will follow.*
