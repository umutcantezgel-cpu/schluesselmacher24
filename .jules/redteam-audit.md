# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- Found some event handlers not properly handled in complex client-side forms.
- Missing explicit loading states in some client components that trigger Server Actions.
- Form inputs in calculator components (e.g. `service-einsatz-rechner.tsx`) could have more explicit state error handling.

## 2. Hydration Mismatches & SSR-Konflikte
- `next/dynamic` is used but some client-specific data relies on server-rendered initial state which might mismatch slightly during hydration.
- The use of `useState` in nested client components requires strict checks to avoid early return layout shifts.

## 3. TypeScript-Schwächen
- Some components have implicit generic bounds or missing strict payload typing for React 19 actions.
- `satisfies` operator for JSON-LD schemas should be strictly validated against `schema-dts`.

## 4. Core Web Vitals Sünden
- Images in visual generators could use better explicit sizing to prevent layout shifts.
- Some CSS classes could be more strictly confined using Tailwind's v4 constraints.

## 5. Design Kritik (Swiss Light Mode)
- Chromatic consistency needs strict enforcement (e.g. OKLCH tokens). No arbitrary gray hex codes should exist.
- Focus states and hover effects (kinetic discipline) should be more deliberate, currently there are multiple competing animations in some cards.