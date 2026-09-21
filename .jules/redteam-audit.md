# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Es wurden auf diversen Seiten Buttons und Interaktionselemente gefunden, die nur Platzhalter-Funktionen aufrufen.
- Formulare (wie in der Service-Seite) haben unzureichendes Error-Handling.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Datumsformate werden in Client-Komponenten direkt gerendert, was zu Hydration-Mismatch mit dem SSR-Ergebnis führt.
- Fehlende `useEffect` Guards beim Zugriff auf `window`.

## 3. TYPESCRIPT-SCHWÄCHEN
- `as any` wird vereinzelt verwendet.
- Schema.org Graphen sind nicht mit `satisfies Graph` typisiert.

## 4. CORE WEB VITALS SÜNDEN
- Bilder laden in einigen Layout-Bereichen ohne explizite Größenangaben.
- Layout-Shifts durch nicht-harmonisierte CSS-Grids.

## DESIGN-KRITIK (SCHWEIZER AESTHETIK)
- Inkonsistente Schattierungen, die nicht der seidenweichen OKLCH-Spezifikation entsprechen.
- Typografischer Rhythmus in den Überschriften kann durch verbessertes Tracking und Line-Height weiter geschärft werden.
