# Red-Team Audit: JC-PHILOSOPHER-REDTEAM-v1

## 1. Silent Logic Death & Interaktions-Fallen
- `app/(site)/service-und-termin/anfrage/page.tsx`: Potentiell fehlende Ladezustände bei asynchronen Formularen.
- `app/(site)/schliessanlagen/konfigurator/page.tsx`: Bei leeren Konfigurationen fehlen oft dedizierte Empty-States, die den User anleiten, stattdessen entsteht ein "Layout-Loch".

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Client-Komponenten im Konfigurator-Umfeld (z.B. für elektronische Zutrittslösungen) greifen möglicherweise zu früh auf `window` zu, was Hydration Mismatches verursachen kann.

## 3. TypeScript-Schwächen
- Komplexe Typen bei den Payload CMS Responses werden oft unzureichend verifiziert. Maskierte Typfehler bei den asynchronen Params auf den Detailseiten (z.B. `app/(site)/autoschluessel/marken/[make]/[model]/page.tsx`).

## 4. Core Web Vitals Sünden
- `app/(site)/page.tsx`: Hero-Bilder haben oft keine strikt reservierten Aspect-Ratios, was zu Layout Shifts (CLS) beim Laden führt.
- Fehlende strikte `use cache` Memoisierungen bei statischen Abfragen.
