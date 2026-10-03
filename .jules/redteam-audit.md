# RED-TEAM AUDIT
## Befunde nach Schweizer Light Mode Marken-DNA
1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
   - Identifizierte leere Event-Handler in Alt-Formularen.
   - Fehlendes Feedback bei Button-Interaktionen (Ladezustände).
2. HYDRATION MISMATCHES & SSR-KONFLIKTE
   - Direkter Zugriff auf `window` in ungeschützten Render-Pfaden ohne `useEffect` Guards.
3. TYPESCRIPT-SCHWÄCHEN
   - Verwendung von `any` und `as unknown` bei einigen Schema-Graphen.
4. CORE WEB VITALS SÜNDEN
   - Hero-Images ohne Layout-Shift-Reservierungen und asynchron geladene Drittanbieter-Scripte im Main Thread.
