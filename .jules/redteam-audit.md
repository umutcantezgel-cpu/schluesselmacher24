# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- Found unused handlers in `src/components/ui/button.tsx` resulting in empty callbacks (() => {}).
- Form loading states missing in `src/app/(site)/kasse/kasse-formular.tsx`, leading to silent logic death.
- Conditional rendering leaves layout holes on empty arrays in `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`.

## 2. Hydration Mismatches & SSR-Konflikte
- Potential window access without useEffect in `src/components/layout/site-header.tsx`.
- Date formatting mismatches on server/client in `src/app/(site)/service-und-termin/page.tsx`.
- LocalStorage access blocking initial render in `src/components/forms/photo-upload.tsx`.

## 3. TypeScript-Schwächen
- Masked types with `as unknown as Type` in `src/components/vertrauen/nachweise-liste.tsx`.
- Schema.org graphs not fully verified with satisfies Graph against schema-dts in `src/components/seo/json-ld.tsx`.
- Incomplete interface definitions in `src/components/visual/registry.tsx`.

## 4. Core Web Vitals Sünden
- Missing explicit image dimensions in `src/components/ui/bild-flaeche.tsx`.
- Heavy third-party libraries indiscriminately imported in client components in `src/app/(site)/page.tsx`.
- Unreserved aspect-ratios causing CLS in `src/components/visual/motion/check-draw.tsx`.
