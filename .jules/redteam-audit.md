# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Einige `onClick` Handler in internen Navigationselementen sind leer oder verwenden `console.log` anstelle robuster Error-Boundaries.
- **Befund 2:** Bestimmte Kontaktformulare zeigen keinen Ladezustand (`pending`) an, wenn sie über Server Actions submitted werden, was zu mehrfachen Submissions führt.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Direkte Zugriffe auf `window` in einigen Client-Komponenten erfolgen teilweise direkt im Render-Pfad anstatt im `useEffect`.
- **Befund 2:** Datumsanzeigen formatieren teilweise mit lokaler Browser-Timezone ohne Hydration-Guards, was Mismatches verursacht.

## 3. TypeScript-Schwächen
- **Befund 1:** Verwendung von `as unknown as Type` an Stellen, wo Zod-Schemas zur Laufzeitvalidierung sinnvoller wären.
- **Befund 2:** Schema.org Typisierungen nutzen teilweise `any` statt `satisfies Graph` mit `schema-dts`.

## 4. Core Web Vitals Sünden
- **Befund 1:** LCP-Bilder in einigen Hero-Sektionen haben keine festen Dimensionen (width/height), was Layout Shifts (CLS) verursacht.
- **Befund 2:** Externe Tracking-Skripte werden blockierend geladen, was TBT verschlechtert.

## 5. Swiss Light Design Doctrine
- **Befund 1:** Einige Schatten haben noch alte `rgba` Werte statt sanften OKLCH-Gradients.
- **Befund 2:** Typografische Hierarchien in mobilen Viewports ignorieren teilweise das negative Tracking für große Headlines.
