# RED-TEAM AUDIT REPORT

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefunden: Mehrere `onClick`-Handler in den Konfigurator-Routen (`src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`), die State-Mutations nicht per Transitions abschließen.
- Gefunden: Unverdrahtete Ladezustände in der Kontakt- und Anfrage-Route (`src/app/(site)/service-und-termin/anfrage/page.tsx`).

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Gefunden: Mögliche Probleme mit lokalen Timestamps und `window`-Abfragen in den Standorte-Detailseiten, die zu Hydration-Mismatches führen könnten.
- Fehlende Mounting-Guards bei lokalen Speichersystemen für den Warenkorb (`src/app/(site)/warenkorb/page.tsx`).

## 3. TYPESCRIPT-SCHWÄCHEN
- Gefunden: Fehlende asynchrone Auflösung der `searchParams` und `params` in Next.js 15+ Routen wie `src/app/(site)/sicherheitstechnik/[slug]/page.tsx`.
- Schema.org JSON-LD Objekte sind teilweise nicht strikt gegen `schema-dts` mit `satisfies` validiert.

## 4. CORE WEB VITALS SÜNDEN
- Gefunden: Einzelne Bild-Assets in den Artikel-Routen (`src/app/(site)/artikel/[slug]/page.tsx`) weisen keine präzisen `width` und `height` auf, was zu Layout-Shifts führt.
- Externe Skripte im Footer oder in Client-Komponenten, die den TTI (Time to Interactive) künstlich verlängern.

**Fazit:** Der Ist-Zustand benötigt signifikantes Polish, kinetische Harmonisierung (ausschließlich in der Swiss Light Mode Marken-DNA) und radikale Content-Erweiterung auf > 800 Wörter pro Route, um echte Semantische Autorität zu erreichen.
