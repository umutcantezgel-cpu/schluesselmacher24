# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/forms/controls.tsx`: Manche Callbacks fangen den Fehlerfall nicht visuell ab, es fehlt ein globaler Error Boundary Wrapper.
- `src/components/calculator/tuer-absicherung-rechner.tsx`: Fehlender Ladezustand bei der Preisberechnung. Bei schnellem Klicken flackern die Zwischenergebnisse, ohne dass ein Spinner oder Skeleton angezeigt wird.
- `src/components/ui/button.tsx`: Fehlende disabled-Zustände bei asynchronen `onClick` Handlern, was Mehrfach-Submissions begünstigt.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/layout/site-header.tsx`: Potenzielles Hydration Mismatch beim Rendern von zustandsabhängigen Warenkorb-Icons, wenn der Client State vom Server State abweicht.
- Fehlende Guard-Checks für `window` in bestimmten clientseitigen Berechnungen (z.B. Animations-Hooks), was in Edge Runtimes zu Fehlern führen könnte.

## 3. TypeScript-Schwächen
- Unvollständige Typisierung bei einigen `json-ld.tsx` Schema-Injects, die auf strenges `satisfies Graph` von `schema-dts` umgestellt werden sollten.
- Im Bereich `autoschluessel/optionen.ts` existieren implizite Typen, die als unzureichend abgesichert gelten.

## 4. Core Web Vitals Sünden
- Bilder in den Feature-Grids (`src/components/visual/*`) nutzen nicht immer strikte Aspect Ratios, was kleine Layout-Shifts beim Laden verursacht.
- Globaler CSS-Transition-Gebrauch ohne Rücksicht auf `prefers-reduced-motion` in einigen interaktiven Bereichen.
