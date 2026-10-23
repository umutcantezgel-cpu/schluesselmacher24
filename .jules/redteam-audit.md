# Red-Team Audit - Sentinel Run

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/autoschluessel/termin-auswahl.tsx`: Formular-Buttons ohne Loading-State und Fehler-Handling bei Netzwerk-Timeouts.
- `src/components/calculator/service-einsatz-rechner.tsx`: Button "Berechnen" hat leere `onClick`-Handler bei ungültigen Eingaben.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/layout/site-header.tsx`: Ungeschützte Zugriffe auf `window.innerWidth` während des initialen Renders.
- `src/components/layout/mobile-action-bar.tsx`: Nutzung von `localStorage` ohne Client-Mount-Check.

## 3. TypeScript-Schwächen
- `src/components/autoschluessel/vehicle-facts.tsx`: Maskierte Typen mit `as unknown as Record<string, any>`.
- `src/components/seo/json-ld.tsx`: Fehlendes striktes `satisfies Graph` für Schema.org Objekte.

## 4. Core Web Vitals Sünden
- `src/components/ui/bild-flaeche.tsx`: LCP-Verzögerung durch fehlende explizite Breite und Höhe.
- `src/app/(site)/autoschluessel/page.tsx`: Blockierendes Laden großer CSS-Pakete im Above-the-Fold Bereich.
