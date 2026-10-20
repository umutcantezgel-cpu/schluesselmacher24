# Red-Team Audit Report

## 1. Silent Logic Death & Interaction Traps
- **`components/autoschluessel/termin-auswahl.tsx`**: Found `onClick` handlers that lack explicit loading states during network transitions, creating interaction traps on slow networks.
- **`components/calculator/service-einsatz-rechner.tsx`**: The form currently lacks visual feedback (spinners/disabled states) during `onSubmit`, leaving users uncertain if the calculation was triggered.
- **`app/(site)/autoschluessel/anfrage/page.tsx`**: Identified conditional rendering segments that can leave layout gaps when nested component arrays are empty.

## 2. Hydration Mismatches & SSR Conflicts
- **`components/layout/mobile-action-bar.tsx`**: Identified potential hydration mismatch risks due to unsafe `window` accesses outside of `useEffect` or unmounted state guards.

## 3. TypeScript Weaknesses
- **`components/flow/flow-shell.tsx`**: Detected overly permissive type assertions (`as unknown as any`) that bypass strict type safety checks, risking runtime errors.

## 4. Core Web Vitals Sins
- **`app/(site)/page.tsx`**: Found several images missing explicit dimensions or aspect ratios, leading to potential Cumulative Layout Shift (CLS) penalties during load.

## 5. Visual Inconsistencies (Swiss Light Mode)
- **Global Typography**: Instances found where headlines are missing the required negative tracking, disrupting the intended typographic rhythm.
- **Color Tokens**: Several components still use hardcoded hex values or non-OKLCH variables, violating the chromatic purity constraints.
