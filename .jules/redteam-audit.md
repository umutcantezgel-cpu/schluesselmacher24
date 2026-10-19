# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/forms/photo-upload.tsx`: Missing visual feedback and loading states during file processing. Empty error handler found.
- `src/components/calculator/service-einsatz-rechner.tsx`: Conditional rendering on calculated results causes layout shift when arrays or values are empty.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/visual/motion/reveal.tsx`: Usage of `window.innerHeight` outside of `useEffect` leading to potential hydration mismatch on first render.
- `src/app/(site)/service-und-termin/page.tsx`: Date generation logic lacks client-side guarding, causing mismatch between server timestamp and client evaluation.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Incomplete interface definition for schema generation; missing `satisfies Graph` to guarantee compliance with schema-dts.
- `src/components/calculator/tuer-absicherung-rechner.tsx`: Use of `as any` (or `as unknown as Type`) effectively masking calculation state errors.

## 4. Core Web Vitals Sünden
- `src/components/autoschluessel/key-kinds.tsx`: Images lack explicit dimensions causing Cumulative Layout Shift (CLS).
- `src/components/layout/site-header.tsx`: Heavy client-side state initialization delays Time to Interactive (TTI).
