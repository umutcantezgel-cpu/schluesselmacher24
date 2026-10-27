# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Potenzielle unverdrahtete Buttons in Formularen entdeckt (z.B. in `kasse-formular.tsx` und `anfrage-formular.tsx`). Es bedarf robusterer Ladezustände (`useFormStatus`).
- Leere Submit-Handler oder fehlendes Error-Handling bei Netzwerkfehlern in Formularen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Gefahren bei Client-seitigem Datum-Rendering in `bestellung/[id]/page.tsx` oder `cookie-einstellungen.tsx`.
- Mögliche Layout-Shifts durch verspätet geladene Client-Komponenten (Konfiguratoren).

## 3. TYPESCRIPT-SCHWÄCHEN
- Maskierte Typfehler bei den Payload CMS Typen oder bei `searchParams` Resolving in Next.js 16.
- `schema-dts` Absicherung fehlt teilweise für strukturierte SEO-Daten.

## 4. CORE WEB VITALS SÜNDEN & SCHWEIZER LIGHT MODE ABWEICHUNGEN
- Layout-Verschiebungen bei unzureichend dimensionierten Bildern.
- Bedarf an strikterer Einhaltung der OKLCH-Farbpalette, insbesondere `oklch(0.988 0.002 260)` als Base-Canvas.
