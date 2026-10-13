# JC-PHILOSOPHER-REDTEAM-v1 - Red-Team Audit

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** In `src/components/calculator/service-einsatz-rechner.tsx` fehlen robuste Fehlerrückmeldungen bei asynchronen Berechnungen.
- **Befund 2:** Das Kassenformular in `src/app/(kauf)/kasse/kasse-formular.tsx` zeigt keinen globalen Ladezustand über den gesamten Viewport an.
- **Befund 3:** Mobile-Action-Bars (`src/components/layout/mobile-action-bar.tsx`) nutzen `console.log` oder leere Fallback-Handler für noch nicht verknüpfte Share-Intents.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 4:** In `src/components/layout/breadcrumbs.tsx` besteht das Risiko eines Hydration Mismatches, wenn dynamische Pfadsegmente ohne Mount-Guard clientseitig manipuliert werden.
- **Befund 5:** Datumsangaben in Bestellbestätigungen verlassen sich potenziell auf die lokale Zeitzone des Servers, was clientseitig zu Layout-Shifts führt.

## 3. TypeScript-Schwächen
- **Befund 6:** In `src/app/(tools)/zutritt-konfigurator/page.tsx` werden einige Parameter implizit als `any` oder durch unsichere Type-Casts weitergegeben.
- **Befund 7:** Die JSON-LD Einbettung in `src/components/seo/json-ld.tsx` validiert den Graphen nicht strikt genug gegen das `schema-dts` Modell.

## 4. Core Web Vitals Sünden
- **Befund 8:** Hero-Sektionen auf `src/app/page.tsx` laden schwere interaktive Komponenten (Bento-Grid) synchron. Dies blockiert den LCP.
- **Befund 9:** Bilder in `src/components/ui/image-placeholder.tsx` verzichten teilweise auf strikte aspect-ratio Definitionen, was CLS provoziert.

## 5. Swiss Light Mode Design Doktrin Kritik
- **Kritik 1:** Einige Schatten in `src/components/ui/card.tsx` verwenden direkte Hex/RGBA Werte anstelle der geforderten OKLCH 0.988 Basis.
- **Kritik 2:** Die Typografie auf Inhaltsseiten weist teils unsaubere Zeilenumbrüche auf (Widows/Orphans).
- **Kritik 3:** Zu viele Mikrokinektik-Animationen auf der Startseite streiten um Aufmerksamkeit. Eine Reduzierung auf eine dominante Signature-Interaktion ist zwingend erforderlich.
