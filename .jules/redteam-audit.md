# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **`src/app/(site)/autoschluessel/page.tsx`**: Die `onClick` Handler für die Schlüssel-Auswahlkomponenten sind leer (`onClick={() => {}}`) und zeigen keinen Feedback-Zustand.
- **`src/app/(site)/schliessanlagen/konfigurator/page.tsx`**: Das Konfigurator-Formular fängt Netzwerkfehler beim Submit nicht ab und bleibt bei Fehlern stumm (kein Error-Boundary).
- **`src/app/(site)/warenkorb/page.tsx`**: Bedingtes Rendering des leeren Warenkorbs hinterlässt ein Layout-Loch (0px Höhe), was den Footer unschön nach oben rutschen lässt.

## 2. Hydration Mismatches & SSR-Konflikte
- **`src/app/(site)/page.tsx`**: Zugriff auf `window.innerWidth` für die Hero-Slider-Berechnung erfolgt direkt im Render-Pfad ohne `useEffect` Guard, was zu Hydration Mismatches führt.
- **`src/app/(site)/service-und-termin/page.tsx`**: Die Datumsanzeige nutzt `new Date().toLocaleDateString()` ohne feste Timezone, was auf dem Server und Client unterschiedlich rendert.

## 3. TypeScript-Schwächen
- **`src/app/(site)/autoschluessel/marken/[make]/page.tsx`**: Die Marken-Daten werden mit `as unknown as CarMake` hart gecastet, was Laufzeitfehler maskiert.
- **`src/app/(site)/ratgeber/page.tsx`**: Das Schema.org JSON-LD Skript wird manuell als String generiert anstatt mit `satisfies Graph` gegen `schema-dts` abgesichert zu werden.

## 4. Core Web Vitals Sünden
- **`src/app/(site)/autoschluessel/programmieren/page.tsx`**: Die Erklärungs-Bilder haben keine expliziten `width` und `height` Attribute, was zu massiven CLS führt.
- **`src/app/(site)/elektronische-zutrittsloesungen/page.tsx`**: Ein schweres interaktives Element wird direkt importiert statt `next/dynamic` zu nutzen, was die TBT ruiniert.
