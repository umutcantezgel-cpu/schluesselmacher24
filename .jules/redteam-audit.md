# Red-Team Audit Report

## Befunde:

1. **Silent Logic Death & Interaktions-Fallen**:
   - Vereinzelte Button-Komponenten weisen leere onClick-Handler `() => {}` auf, was zu einer toten Benutzererfahrung führt.
   - Formulare ohne angemessene visuelle Ladezustände (`isSubmitting`) während Server Actions.

2. **Hydration Mismatches & SSR-Konflikte**:
   - Direkte Zugriffe auf `window` in einigen Client-Komponenten, die nicht korrekt durch `useEffect` abgesichert sind, bergen das Risiko von Hydration-Fehlern.

3. **TypeScript-Schwächen**:
   - Nutzung von `as any` oder unzureichenden Interfaces in tief verschachtelten Typen, wodurch die Typsicherheit untergraben wird.

4. **Core Web Vitals Sünden**:
   - Nicht optimierte Bilder im Hero-Bereich (fehlende `priority`-Flags oder unpassende Formate), die das LCP negativ beeinflussen.

## Design-Kritik (Schweizer Ästhetik):
- Kleinere Inkonsistenzen bei Schatten und Rändern, die nicht der strengen OKLCH-Doktrin entsprechen. Visuelle Harmonisierung durch Subgrids und fluide Animationen wird dringend empfohlen.
