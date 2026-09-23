# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Viele Formular-Komponenten (z.B. in `src/components/forms/photo-upload.tsx`) verlassen sich noch auf veraltete `onSubmit` Patterns mit manuellen Ladezuständen anstatt auf React 19 Server Actions (`useActionState`, `useFormStatus`).
- Es existieren eventuell onClick-Handler ohne Fehlerbehandlung bei asynchronen Netzwerk-Aufrufen.
- Fehlende visuelle Lade-Indikatoren bei einigen Client-seitigen Zustandstransitionen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Datumsformate und window-Referenzen in einigen Client-Komponenten bergen das Risiko von Hydration-Mismatches auf der Serverseite, insbesondere in komplexen Konfiguratoren (`src/app/gleichschliessende-zylinder/konfigurator/page.tsx`).

## 3. TYPESCRIPT-SCHWÄCHEN
- Potenzielle `@typescript-eslint/no-explicit-any` oder `as unknown as Type` Casts, insbesondere in älteren SEO/Json-LD Modulen (`src/components/seo/json-ld.tsx`). Schema.org Graphen müssen zwingend mit `satisfies Graph` gegen `schema-dts` abgesichert werden.
- React 19 / Next.js 16 Paradigmen wie Promise-basierte `params` in Page-Komponenten werden teilweise noch nicht konsistent angewandt.

## 4. CORE WEB VITALS SÜNDEN
- Einige Images in Layout- oder Content-Komponenten definieren möglicherweise keine festen Dimensionen (width/height) oder aspect-ratios, was zu Layout Shifts (CLS) führen kann.
- Potenzielle Optimierungsmöglichkeiten durch konsequenten Einsatz von CSS View Transitions und Container Queries zur Reduktion von Ladezeiten und Layout-Berechnungen.

## 5. SCHWEIZER LIGHT MODE AESTHETIK
- Schatten und Border-Farben nutzen teilweise keine strikten OKLCH-Werte (z.B. `oklch(0.988 0.002 260)` für Canvas).
- Kinetische Disziplin: Vereinzelt überschneiden sich CSS Transitions ohne Fallback für `motion-reduce`.
