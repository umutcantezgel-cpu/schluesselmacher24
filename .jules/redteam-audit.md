# Red-Team Audit Report
## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefundene leere Event-Handler in `src/components/flow/flow-shell.tsx`.
- Keine dedizierten Loading-States bei diversen Buttons.
- Fehlende Error-Boundaries bei leeren Arrays in `src/components/layout/summary-list.tsx`.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Datumsanzeigen in Admin-Ansichten können Hydration Mismatches erzeugen.
- Potenzieller `window` Zugriff im Calculator ohne Mount-Guard.

## 3. TYPESCRIPT-SCHWÄCHEN
- Schema.org Graphen in `src/components/seo/json-ld.tsx` nicht immer mit `satisfies Graph` abgedeckt.
- Fehlende `Promise`-Typisierung für `params` in Next.js 16.

## 4. CORE WEB VITALS SÜNDEN
- LCP Optimierungen bei Hero-Bildern fehlen (`loading="eager"` und `fetchPriority="high"`).
- CSS Subgrid Harmonisierung könnte Layout-Shifts vermeiden.

## DESIGN-KRITIK (SCHWEIZER AESTHETIK)
- Chromatische Reinheit muss durch striktes `oklch()` sichergestellt werden.
- Kinetische Disziplin: Zu viele Animationen konkurrieren.
