# RED-TEAM AUDIT BEFUNDE

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/ui/button.tsx`: Prüfen auf onClick-Handler die lediglich ein console.log aufrufen.
- `src/app/autoschluessel/anfrage/assistent.tsx`: Ladezustände bei Formular-Submits fehlen, was bei Netzwerklatenzen zu Interaktions-Fallen führt.
- `src/app/kasse/kasse-formular.tsx`: Unverdrahtete Submit-Buttons ohne Error-Boundary.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/app/autoschluessel/bestaetigung.tsx`: Dynamische Datumsformatierungen verursachen Hydration-Mismatch-Fehler.
- `src/components/calculator/service-budget-calculator.tsx`: Lokale Speicherzugriffe (`localStorage`) erfolgen außerhalb von `useEffect`.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Maskierte Typfehler bei Schema.org Graphen. Fehlende `satisfies Graph` Verifizierungen.
- `src/components/forms/photo-upload.tsx`: `as unknown as Type` Casting bei File-Event-Handlern verbirgt strukturelle Schwächen.

## 4. Core Web Vitals Sünden
- `src/app/page.tsx`: Fehlende Aspect-Ratios bei Hero-Bildern führen zu Cumulative Layout Shifts (CLS).
- `src/app/autoschluessel/page.tsx`: Importe schwerer Drittanbieter-Bibliotheken in Client-Komponenten reduzieren die Time to Interactive (TTI).
