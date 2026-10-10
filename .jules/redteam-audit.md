# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- In `ServiceEinsatzRechner` gibt es zwar `onClick` und state-Updates, aber keine sichtbare Fehlerbehandlung falls die Netzwerkanfrage fehlschlägt.
- `MobileActionBar` hat vermutlich leere oder oberflächliche Handler.
- Formulare fehlen teilweise die Ladezustände während der Action.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Animationen (z.B. in `CheckDraw`) könnten potenziell zu Mismatches führen, wenn sie initial ohne korrekte Guards rendern.
- Das dynamische Laden von SVGs könnte im Client anders berechnet werden als im Server.

## 3. TypeScript-Schwächen
- Mögliche unvollständige Interfaces in `RechnerBausteine` bei der Parameterübergabe.
- Eventuelle `as any` Casts in komplexen Map-Funktionen innerhalb der `flow` Komponenten.

## 4. Core Web Vitals Sünden
- Fehlen von `width` und `height` auf einigen `ImagePlaceholder` Komponenten, was zu CLS (Cumulative Layout Shift) führen kann.
- Schwergewichtige Animationen ohne `useMemo` in Listen-Renderings.

## Visuelle Konsistenz & Schweizer Aesthetik (OKLCH)
- Harte Farbcodes in SVG-Pfaden anstatt von CSS-Variablen.
- Mangelnde Rhythmik bei den Margins (zu viel "Frankenstein-UI" in tief verschachtelten Layouts).
