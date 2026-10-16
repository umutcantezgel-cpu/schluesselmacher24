# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/calculator/service-einsatz-rechner.tsx`: Die onChange Handler bei der Türenauswahl (QuantityInput) verschlucken gelegentlich Events bei schnellem Klicken ohne sichtbare Fehlermeldung.
- `src/app/(site)/autoschluessel/page.tsx`: Die onClick Handler im Autoschlüssel-Konfigurator-Flow enthalten teilweise unverdrahtete Stubs, die bei Klick ins Leere laufen (`() => {}`).
- `src/components/forms/photo-upload.tsx`: Fehlender Ladezustand beim Upload von Schlüsselfotos; Netzwerkverzögerungen führen zu "Silent Death" ohne Benutzer-Feedback.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/layout/site-header.tsx`: Zugriff auf `useCartStore` vor Hydration provoziert minimale Layout-Shifts, da der Warenkorb-Count erst im Browser gerendert wird.
- `src/app/(site)/service-und-termin/page.tsx`: Zeitstempel und Termin-Slots werden clientseitig formatiert, was zu potenziellen Hydration-Fehlern führt, wenn Server- und Client-Zeitzonen abweichen.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Der Schema.org Graph ist nicht vollständig mit `satisfies Graph` gegen `schema-dts` typsicher gemacht, wodurch unvollständige SEO-Daten maskiert werden.
- `src/lib/data.ts`: Teile der Content-Typisierung nutzen Type-Casting (`as unknown as Type`), anstatt auf saubere Zod-Validierung beim Fetching zu setzen.

## 4. Core Web Vitals Sünden
- `src/app/(site)/page.tsx`: Hero-Bilder haben in manchen Viewports keine exakt reservierten Aspect-Ratios, was beim initialen Laden CLS (Cumulative Layout Shift) erzeugt.
- `src/components/visual/motion/reveal.tsx`: Ineffiziente Observer-Pattern führen zu unnötigen Reflows, wenn schwere Animationen unbedacht in der Viewport-Berechnung getriggert werden.
