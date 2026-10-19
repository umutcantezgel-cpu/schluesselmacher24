# RED-TEAM AUDIT: SCHONUNGSLOSE SYSTEMANALYSE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **`src/components/forms/photo-upload.tsx`**: Der `onChange`-Handler des File-Inputs verschluckt in bestimmten Edge-Cases Fehler, wenn die Datei zu groß ist, ohne visuelles Feedback an den User. Ein stummes `console.error` ist vorhanden.
- **`src/components/calculator/service-einsatz-rechner.tsx`**: Das Formular zeigt keinen klaren Ladezustand an, wenn die Preisberechnung leicht verzögert wird. Das führt zu Mehrfachklicks (Interaktions-Falle).
- **`src/components/autoschluessel/termin-auswahl.tsx`**: Bedingtes Rendering bei leeren Termin-Arrays hinterlässt ein Layout-Loch, anstatt einen eleganten "Keine Termine verfügbar"-Zustand anzuzeigen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **`src/components/layout/site-header.tsx`**: Direkter Zugriff auf `window.innerWidth` für mobile Menü-Logik ohne sauberen Mounting-Guard (useEffect) führt zu Hydration Mismatches beim ersten Render-Pass.
- **`src/components/autoschluessel/vehicle-facts.tsx`**: Lokalisierte Datumsformatierungen werden teilweise serverseitig mit anderen Locales als clientseitig ausgeführt, was zu Warnungen in der Konsole führt.

## 3. TYPESCRIPT-SCHWÄCHEN
- **`src/components/seo/json-ld.tsx`**: Schema.org-Graph wird teilweise ohne strenges `satisfies Graph` gegen `schema-dts` abgesichert. Maskierte Typfehler bei Custom-Properties.
- **`src/components/vertrauen/nachweise-liste.tsx`**: Verwendung von `as unknown as NachweisType` in einer Mapping-Funktion verschleiert mögliche Laufzeitfehler bei unvollständigen Backend-Daten.

## 4. CORE WEB VITALS SÜNDEN & VISUELLE BRÜCHE
- **`src/components/ui/image-placeholder.tsx`**: Fehlende explizite Dimensionen oder reservierte Aspect-Ratios führen zu Cumulative Layout Shift (CLS) beim Laden der Platzhalter.
- **`src/app/(site)/page.tsx`**: Mehrere gleichzeitige Scroll-Animationen in der Hero-Section kämpfen um die Aufmerksamkeit des Nutzers (Kinetische Disziplin verletzt).
- **Globale Typografie**: Unausgewogene Zeilenumbrüche (Widows/Orphans) in Headlines auf mobilen Viewports.
- **Farbraum**: Die Verwendung von harten Hex-Werten in veralteten CSS-Modulen bricht mit der OKLCH-Doktrin der Schweizer Light Mode Marken-DNA.
