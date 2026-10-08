# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- In `src/app/(site)/page.tsx` und diversen `src/components/` wurden interaktive Elemente ohne Ladezustände oder Error-Boundaries identifiziert.
- `onClick` und `onSubmit` Handler in einigen generischen Button-Komponenten sind potentiell nicht robust gegen Netzwerk-Timeouts.
- Fehlende visuelle Indikatoren (Skeleton-Screens) bei asynchronen Daten-Fetches verursachen potentielle Layout-Shifts, falls Daten verzögert eintreffen.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Zeit- und Datumsformatierungen in Footer- oder Blog/Artikel-Komponenten verlassen sich möglicherweise auf die lokale Systemzeit ohne strikte UTC-Synchronisation, was Warnungen beim Hydrieren auslösen kann.
- Zufällige Sortierungen in verwandten Produkten oder Artikeln erfordern striktere Hydration-Guards.

## 3. TypeScript-Schwächen
- Komplexe React 19 Action-State Typisierungen (`useActionState`) weisen teils ungenaue Rückgabetypen auf (z.B. Verwendung von `any` statt `unknown` oder dedizierten Interfaces in Error-Pfaden).
- Schema.org JSON-LD Objekte (`src/components/seo/json-ld.tsx`) sind nicht überall mit `satisfies Graph` gegen `schema-dts` typsicher abgeglichen.

## 4. Core Web Vitals Sünden
- Hintergrundbilder und komplexe SVGs in den Feature-Grids verzichten teilweise auf explizite `width`/`height` Attribute, was LCP und CLS Risiken birgt.
- Subgrid-Styling in den Bento-Layouts fehlt, was bei inhomogenen Textlängen zu Layout-Brüchen führt.

## Visuelle Konsistenz (Schweizer Light Mode)
- Obwohl OKLCH-Farbwerte verwendet werden, gibt es noch Inkonsistenzen bei 1px-Kanten (Borders) und Schatten-Kinetik, wo vereinzelt Reste von nicht-oklch Variablen in Dritt-Komponenten aufschlagen könnten.
- Kinetische Disziplin: Einige Animationen sind nicht an `prefers-reduced-motion` gebunden.
