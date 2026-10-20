# RED-TEAM AUDIT (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Es wurden Formulare ohne explizite React 19 Server Actions und `useOptimistic` Ladezustände identifiziert.
- Fehlende visuelle Indikatoren (Skeleton-Loader oder Spinner) bei asynchronen Daten-Fetches.
- Einige Buttons verwenden nicht die empfohlene `useFormStatus` Hook für Disabled-States während Submission.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Potenzielle Zugriffe auf `window` in Client-Komponenten, die nicht strikt durch `useEffect` abgesichert sind, was zu Layout-Shifts beim Hydrieren führen kann.
- Zufällig generierte IDs für Barrierefreiheit sind nicht stabil über Server und Client hinweg, was Hydration-Fehler riskiert (`useId` wird noch nicht konsequent eingesetzt).

## 3. TYPESCRIPT-SCHWÄCHEN
- Vereinzelte `as unknown as any` Casts, die TypeScript 5.5+ Strictly-Checks untergraben.
- Fehlende Exhaustiveness-Checks (z. B. `switch` auf Union-Typen ohne `default: assertNever()`), was die Wartbarkeit senkt.

## 4. CORE WEB VITALS SÜNDEN
- Bilder laden teilweise ohne LCP-Priorisierung oder feste Aspect-Ratios (`width` und `height`), was Cumulative Layout Shift (CLS) provoziert.
- Fehlendes CSS View Transitions API für sanfte Navigation.

## 5. SCHWEIZER LIGHT MODE AESTHETIK (VISUELLE DEFIZITE)
- Harte Hex-Werte statt einheitlicher `oklch`-Farbräume an einzelnen Randstellen.
- Fehlende 1px-Haarlinien und Schatten-Dämpfung bei einigen Card-Komponenten, was die chromatische Reinheit stört.
