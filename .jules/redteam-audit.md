# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **src/components/forms/controls.tsx**: Potenziell leere Handler oder vergessene console.logs entdeckt. Kritisch für Interaktions-Zuverlässigkeit.
- **src/app/autoschluessel/anfrage/assistent.tsx**: Formular zeigt keinen klaren Ladezustand an, wenn Netzwerk-Latenz auftritt.
- **src/app/kasse/kasse-formular.tsx**: Bedingte Renderings für Zahlungsoptionen könnten bei leeren State-Arrays Layout-Löcher hinterlassen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **src/app/page.tsx**: Zugriff auf `window.innerWidth` ohne Mounting-Guard im Render-Pfad entdeckt.
- **src/components/layout/site-header.tsx**: Datums- oder zeitspezifische Rendervorgänge weichen zwischen Server und Client ab.

## 3. TYPESCRIPT-SCHWÄCHEN
- **src/lib/data/adapter.ts**: Verwendung von `as unknown as Type` maskiert tieferliegende Typinkonsistenzen.
- **src/components/seo/json-ld.tsx**: Schema.org Graphen sind nicht ausreichend mit `satisfies Graph` gegen `schema-dts` abgesichert.

## 4. CORE WEB VITALS SÜNDEN
- **src/components/ui/image-placeholder.tsx**: Bilder laden ohne explizite Dimensionen oder reservierte Aspect-Ratios, was Layout-Shifts verursacht.
- **src/app/layout.tsx**: Schwere Drittanbieter-Bibliotheken werden blockierend im kritischen Rendering-Pfad importiert.
