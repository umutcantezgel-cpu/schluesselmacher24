
# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- **Cookie Settings (cookie-einstellungen.tsx)**: `window.localStorage` wird direkt in einer Funktion aufgerufen ohne saubere Hydration-Behandlung. Wenn clearAll() gecallt wird, ist es kein Problem, aber es sollte konsistent sein.
- **Sicherheitscheck (sicherheitscheck.tsx)**: Nutzt `window.scrollTo` in den Formularschritten direkt.
- Es gibt `onChange={(value) => flow.set('windows', value)}` - hier könnte es Probleme mit unkontrollierten Komponenten geben, wenn `value` nicht exakt validiert wird.

## 2. Hydration Mismatches & SSR-Konflikte
- `window.localStorage` wird in diversen Client-State Hooks (client-state.ts) ohne `useEffect` Mount-Guards direkt beim Render-Start abgefragt (obwohl `useStoredValue` das anscheinend intern via `useSyncExternalStore` regelt, ist der Fallback fehleranfällig).
- `sicherheitscheck.tsx` hat `window.scrollTo` Aufrufe.
- Formular-Kasse hat `window.location.assign`.

## 3. Typensicherheit
- `rate-limit.ts` hat potenziell Typfehler, falls die Limits nicht strict eingehalten werden.
- `window` Typen sind meist sicher, aber die `windows` Properties (Datumsfenster) kollidieren im Naming mit dem globalen `window` Objekt, was Verwirrung stiftet.

## 4. Core Web Vitals Sünden
- Einige Bilder nutzen den ImagePlaceholder ohne exakte reservierte Höhen/Breiten, was zu Layout Shifts (CLS) führen kann.
- Schwergewichtige Animationen in den Flow-Formularen könnten TBT (Total Blocking Time) erhöhen.
