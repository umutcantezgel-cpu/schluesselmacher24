# RED-TEAM AUDIT
## Phase 0: Systematischer Befund

### Silent Logic Death & Interaktions-Fallen
- In `src/app/kasse/kasse-formular.tsx` und anderen Formularen fehlt teilweise ein explizites Feedback für Server Actions, wenn diese Netzwerkfehler werfen. Dies führt zu einer "stillen" Oberfläche ohne Ladeindikator.
- Leere Arrays triggern in `src/app/admin/fahrzeugdaten/fahrzeug-verwaltung.tsx` leere Tabellen ohne Fallback-State, was das Layout zerreißt.

### Hydration Mismatches & SSR-Konflikte
- Einige formatierte Daten oder Preise in Client-Komponenten (z.B. in `src/components/calculator/service-budget-calculator.tsx`) riskieren Hydration Mismatches, falls sie vom Server-Locale abweichen.
- Unsynchronisierte Zeitstempel beim Prerendering von dynamischen Datumsangaben (z.B. in Terminauswahl).

### TypeScript-Schwächen
- Unpräzise Interfaces in Domänenmodellen, z.B. in `src/lib/types.ts` gibt es noch Ausbaufähigkeit bei union types.
- Vage `schema-dts` Definitionen in `src/components/seo/json-ld.tsx`, wo `@graph` Arrays strenger mit `satisfies Graph` gegen `schema-dts` abgesichert sein sollten.

### Core Web Vitals Sünden
- `src/components/ui/image-placeholder.tsx` weist nicht konsequent eine explizite `aspect-ratio` auf kleinen Viewports auf, was Layout Shifts (CLS) verursacht.
- Asynchron geladene Drittanbieter-Skripte verzögern potenziell den LCP der Startseite (`src/app/page.tsx`).

### Visuelle Inkonsistenz (Schweizer Light Mode Doktrin)
- Mangelhafte Abstimmung der Typografie-Hierarchien auf kleinen Viewports in `src/app/globals.css` (fehlendes CSS Clamp für perfekte Rhythmik).
- Die Kinetik (Animationen) in `src/components/ui/accordion.tsx` ist teilweise ruckelig und weicht von den strengen `cubic-bezier(0.16, 1, 0.3, 1)` Interpolationen ab.
- Farb-Tokens weichen ab: harte Grautöne statt sauberer OKLCH-Tokens (`oklch(0.988 0.002 260)`), z.B. in manchen Border-Colors.
