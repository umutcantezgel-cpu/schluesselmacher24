# Red-Team Audit Report

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- `src/components/ui/button.tsx`: Buttons ohne expliziten Ladezustand kommunizieren asynchrone Netzwerkprozesse ungenügend.
- `src/components/layout/site-header.tsx`: Mobile Drawer nutzt keine View-Transitions, was zu abrupten Sprüngen führt. Fehlende Error-Boundaries bei Dropdowns.
- `src/app/kasse/kasse-formular.tsx`: onSubmit-Handler fangen potenzielle Netzwerkfehler nicht mit einer robusten Error Boundary oder Toast ab.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- `src/components/layout/site-footer.tsx`: Potenzielle Hydration-Gefahren durch unsichere Zeitstempel/Datumsanzeigen in Footer-Komponenten.
- Direkte Zugriffe auf `window` in Resize-Handlern ohne Mount-Guards in der Navigation entdeckt.

## 3. TYPESCRIPT-SCHWÄCHEN
- `src/components/seo/json-ld.tsx`: Keine strikte Überprüfung mit `satisfies Graph` gegen `schema-dts`.
- `src/app/autoschluessel/optionen.ts`: Enums anstatt `as const` Maps; Teilweise Typisierung ohne enge Literals.

## 4. CORE WEB VITALS SÜNDEN
- `src/app/page.tsx`: Hero-Images nutzen kein `fetchPriority="high"`, was den LCP verzögert.
- `src/components/layout/site-header.tsx`: Tiefe DOM-Strukturen und fehlendes CSS `subgrid` führen zu unnötigen Layout-Shifts.
