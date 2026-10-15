# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/ui/button.tsx`: Potentielle onClick handler traps (fehlende error boundaries).
- `src/app/(site)/autoschluessel/anfrage/page.tsx`: Keine skeleton states während des Ladens.
- Leere Handler bei Formular-Abbruch gefunden, die in einen Silent Logic Death münden.

## 2. Hydration Mismatches & SSR-Konflikte
- Direkte `window` Aufrufe in einigen Legacy-Formularen könnten beim SSR crashen.
- Fehlende Suspense-Boundaries um dynamische Preis-Komponenten.

## 3. TypeScript-Schwächen
- `as any` oder `as unknown` in den Daten-Adaptern maskieren Typfehler.
- Schema.org Graphen sind nicht immer strikt mit `satisfies Graph` validiert.

## 4. Core Web Vitals Sünden
- Keine expliziten Aspekt-Ratios auf LCP-Bildern.
- Drittanbieter-Scripte im Render-Pfad blockieren den Main-Thread.

## 5. Swiss Light Mode Aesthetic
- Diverse Subpixel-Layout-Shifts in den Bento-Grids auf der Startseite.
- Chromatische Unreinheiten: einige Hex-Werte statt reiner OKLCH-Tokens.
