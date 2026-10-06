# Red-Team Audit Report
## Phase 0: Ist-Zustand

### 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Zahlreiche `onClick` Handler in diversen Cards weisen fehlende oder lückenhafte Error-Boundaries auf, was bei Hydration-Verlust zu "toten" Klicks führt.
- **Befund 2:** Bestimmte Formularkomponenten in `schluessel-nach-vorlage/anfrage` haben keinen persistenten Loading-State für langsame Netzwerkverbindungen.

### 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Einzelne Layout-Shift-Artefakte beim initialen Laden der Breakpoints auf mobilen Geräten durch asynchrone Initialisierung lokaler Variablen.
- **Befund 2:** Dynamische Datumsanzeigen in den Ratgeber-Artikeln verursachen gelegentlich Hydration-Warnungen, da der Server eine andere Zeitzone als der Client verwendet.

### 3. TypeScript-Schwächen
- **Befund 1:** Einige Interfaces in den Calculators (wie `service-einsatz-rechner.tsx`) weisen lose Typisierungen bei komplexen Zuständen auf.
- **Befund 2:** Explizite Rückgabetypen von Asynchronous Request APIs in Next.js 16+ `page.tsx` (params, searchParams) sind teilweise nicht korrekt als `Promise` deklariert.

### 4. Core Web Vitals & Visual Design
- **Befund 1:** Die `Swiss Light Mode` Design-Vorgabe (OKLCH, 1px Kanten, AAA-Kontraste) ist noch nicht in 100% aller Komponenten durchgesetzt. Einzelne Legacy-Shadows existieren noch.
- **Befund 2:** Kinetische Disziplin: Einige Animationen sind nicht an `prefers-reduced-motion` gekoppelt und verursachen Layout-Rauschen.

**Fazit:** Der Zustand ist solide, bietet aber massive Hebel zur extremen UX-Maximierung in Phase 1.
