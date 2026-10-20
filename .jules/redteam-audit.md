# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- In `src/components/autoschluessel/termin-auswahl.tsx` fehlen robuste Fehlermeldungen für Netzwerk-Timeouts.
- `src/components/forms/controls.tsx` besitzt leere onSubmit-Zweige, die in Hydration-Fehlern enden können.

## 2. Hydration Mismatches & SSR-Konflikte
- Unbedachte window-Zugriffe in `src/components/visual/area-scope.tsx` rufen Mismatches beim ersten Server-Render hervor.
- `src/app/(site)/page.tsx` nutzt Datumsformatierungen, die vom Browser-Locale abhängen, was zu Layout-Sprüngen führt.

## 3. TypeScript-Schwächen
- `src/components/calculator/service-einsatz-rechner.tsx` verwendet `any` oder `as unknown as Type`, was die strikte TS 5.5. Konfiguration bricht.

## 4. Core Web Vitals Sünden
- Fehlende explizite width/height in `src/components/vertrauen/nachweise-liste.tsx`.
- Unnötige Client-Boundary bei `src/components/ui/button.tsx`, die Suspense-Blöcke verzögert.
