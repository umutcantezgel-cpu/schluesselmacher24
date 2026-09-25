# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/ui/button.tsx`: Potentielle Button-Hydration-Fallen, falls Server/Client-Renderings abweichen (fehlende disabled-State-Sichtbarkeit bei Ladeprozessen).
- `src/app/autoschluessel/page.tsx`: Fehlende Error-Boundaries bei fehlgeschlagenen Formular-Submits, leere Handler in Unterkomponenten möglich.

## 2. Hydration Mismatches & SSR-Konflikte
- Datumswerte in Service-Komponenten könnten zu Mismatches führen, falls Zeitzonen nicht via Server vorgerendert werden.
- Randomisierte IDs in Custom-Komponenten ohne React `useId` verursachen Hydration-Warnungen in Next.js 16.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Props für WebSiteLeaf könnten inkompatibel sein, falls `logo` übergeben wird (schema-dts Limitation).
- Server Action Payloads in Formularen sind teilweise nicht vollständig typisiert, wodurch Client/Server-Kontrakte brechen können.

## 4. Core Web Vitals Sünden
- Einige Hero-Bilder in `src/app/page.tsx` nutzen keine expliziten Dimensionen oder priority-Tags, was zu LCP-Verzögerungen führt.
- CSS Subgrids (`grid-rows-[subgrid]`) teilweise an Containern ohne `display: grid` verwendet, was Layout-Shifts und Rendering-Ineffizienzen provoziert.

## 5. Design-Kritik (Schweizer Aesthetik)
- Chromatische Reinheit: Einige border-Farben weichen minimal vom OKLCH-Standard ab.
- Typografische Rhythmik: Zeilenlängen überschreiten teils das 75-Zeichen-Limit auf Desktop.
- Kinetische Disziplin: Zu viele Hover-States kämpfen um die visuelle Hierarchie.
