# RED-TEAM AUDIT BEFUND

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Befund:** In der Komponente `src/components/flow/flow-shell.tsx` gibt es unverdrahtete Buttons und `onClick`-Handler, die ins Leere laufen.
- **Befund:** Formulare in `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx` zeigen bei langsamen Netzwerkverbindungen keinen adäquaten Ladezustand an (Silent Fail).

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Befund:** Ungeschützte Zugriffe auf `window` in `src/components/visual/motion/in-view.tsx` verursachen potenziell Layout-Shifts beim initialen Client-Mount (Hydration-Falle).
- **Befund:** Datumsformatierungen in `src/app/(site)/artikel/[slug]/artikel-kauf.tsx` sind nicht sauber gegen Server-Locale-Diskrepanzen abgesichert.

## 3. TYPESCRIPT-SCHWÄCHEN
- **Befund:** Maskierte Typfehler durch `as unknown as Type` bei den Props in diversen visuellen Generatoren (z.B. `src/components/visual/generators/schliessplan.tsx`).
- **Befund:** Das `Schema.org`-Graph-Interface in `src/components/seo/json-ld.tsx` verifiziert die Tiefe nicht strikt genug.

## 4. DESIGN & SWISS LIGHT MODE MARKEN-DNA
- **Befund:** Inkonsequente chromatische Reinheit: Harte Hex-Werte (z.B. `#000000`, `#ffffff`) anstelle der geforderten OKLCH-Tokens (z.B. `oklch(0.988 0.002 260)`).
- **Befund:** Unausgewogene typografische Rhythmik in `src/app/(site)/ratgeber/page.tsx` führt zu Witwen und Waisen bei bestimmten Breakpoints.
- **Befund:** Kinetische Überladung: Mehrere Animationen in `src/app/(site)/page.tsx` streiten um visuelle Aufmerksamkeit. Reduktion auf EINE dominante Signature-Interaktion erforderlich.
