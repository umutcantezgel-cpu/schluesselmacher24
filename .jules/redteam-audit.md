# RED-TEAM AUDIT

## Befunde

1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN:
   - Mehrere onClick-Handler in `src/components/autoschluessel/service-article.tsx` geben nur `console.log` aus.
   - Formulare in `src/app/(site)/service-und-termin/anfrage/page.tsx` zeigen teilweise unzureichende Ladezustände bei langsamen Verbindungen.

2. HYDRATION MISMATCHES & SSR-KONFLIKTE:
   - Zufallsbasierte IDs in Key-Kind Komponenten ohne initiale Client-Side Mount-Guards.

3. TYPESCRIPT-SCHWÄCHEN:
   - Vereinzelte Nutzung von `as any` in der Schema-Generierung.

4. CORE WEB VITALS SÜNDEN:
   - Bestimmte Hero-Bilder haben keine expliziten Aspect-Ratios, was zu kleinen Layout Shifts führt.
