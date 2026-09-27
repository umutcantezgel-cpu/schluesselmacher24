# RED-TEAM AUDIT BEFUNDE (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefundene leere Funktionen in UI Komponenten wie Buttons ohne explizites Event-Handling.
- Formulare (z.B. in `kasse/page.tsx` oder `bestellung/page.tsx`) zeigen Verbesserungspotenzial bei Ladezuständen oder Fehlermeldungen (Silent Catching).

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Potenzieller Konflikt bei dynamischen Layouts ohne `useEffect` (insbesondere bei Zeitformatierungen).
- Layout-Shifts während der Hydration in dynamischen Komponenten (z.B. Accordion, Info-Tip).

## 3. TYPESCRIPT-SCHWÄCHEN
- Einige Typ-Definitionen in den Komponenten scheinen implizit auf `any` oder zu weiten Typescript-Interfaces (z.B. `Record<string, unknown>`) zu basieren, was maskierte Fehler ermöglicht.

## 4. CORE WEB VITALS SÜNDEN
- LCP und CLS Risiken durch nicht vordefinierte Aspect-Ratios in Image-Placeholders.
- Teilweise fehlende `oklch` Integration, stattdessen harte Werte in UI Komponenten die die Schweizer Light Mode Doktrin verletzen.
