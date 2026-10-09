# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/calculator/service-einsatz-rechner.tsx`: Fehlendes Lade-Feedback bei komplexen Kalkulationen; Buttons wirken "tot" während der Verarbeitung.
- `src/components/autoschluessel/termin-auswahl.tsx`: onClick-Handler ohne visuelles Feedback; Hydration-Probleme bei schnellen Klicks.

## 2. Hydration Mismatches & SSR-Konflikte
- Datumsberechnungen in `termin-auswahl.tsx` nutzen `new Date()` ohne Guard, was zu Hydration Mismatches führt.
- `localStorage`-Zugriffe für den Warenkorb blockieren den Render-Pfad, wenn sie nicht im `useEffect` gekapselt sind.

## 3. TypeScript-Schwächen
- Unsichere Typ-Casts in `route.ts` bei der Verarbeitung von Kunden-Uploads (`as unknown as ...`).
- Fehlende `schema-dts` Validierung für JSON-LD in `json-ld.tsx`.

## 4. Core Web Vitals Sünden
- LCP-Verzögerung auf der Startseite (`app/page.tsx`) durch nicht optimal geladene Hero-Bilder ohne strikte Aspect-Ratios.
- Potenzielle Layout-Shifts durch fehlende `width`/`height` Attribute auf dynamisch geladenen Icons.
