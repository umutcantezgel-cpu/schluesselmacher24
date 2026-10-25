# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/calculator/service-einsatz-rechner.tsx`: Fehlende persistente Fehlerbehandlung bei Ladezeiten.
- `src/components/ui/button.tsx`: Einige Button-Zustände fangen keine `onClick`-Abbrüche sauber ab.

## 2. Hydration Mismatches & SSR-Konflikte
- Potenzielle Hydration-Fallen in Datumsanzeigen, die nicht konsequent an die Server-Zeitzone gebunden sind.

## 3. Typescript-Schwächen
- Einige `as any` oder `as unknown as Type` in älteren Komponenten, die strikteres Typing erfordern.

## 4. Core Web Vitals Sünden
- Einige Bilder haben keine expliziten Dimensionen, was CLS verursachen kann.

## 5. Swiss Light Design Doctrine
- Strikte Einhaltung von OKLCH Farbwerten in neuen Modulen gefordert.
