# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- `app/(site)/autoschluessel/page.tsx`: Die onClick Handler im Accordion und in der KeyKinds-Komponente (`components/autoschluessel/key-kinds.tsx`) haben teilweise keine echten Ladezustände oder Feedback-Indikatoren.
- `components/ui/accordion.tsx`: Fehlendes aria-expanded Toggling in Edge-Cases, wenn die Komponente ohne Javascript hydriert.

## 2. Hydration Mismatches & SSR-Konflikte
- `app/page.tsx`: Die ImagePlaceholder-Komponente greift potenziell auf unzureichende Mounting-Guards zurück, wenn clientseitige Berechnungen wie window.innerWidth verwendet werden.
- `components/layout/mobile-action-bar.tsx`: Scroll-Listener könnten ohne strikte useEffect Guards zu Mismatches führen.

## 3. TypeScript-Schwächen
- `lib/data.ts`: Typisierungen beim Abrufen von getPageContent verwenden möglicherweise unvollständige Interfaces für SEO-Metadaten.
- `components/seo/json-ld.tsx`: Die Schema.org-Graphen sind nicht immer vollständig mit `satisfies Graph` gegen schema-dts abgesichert.

## 4. Core Web Vitals Sünden
- `components/ui/image-placeholder.tsx`: Fehlende explizite Dimensionen (width/height) bei Fallback-Bildern.
- `app/layout.tsx`: Laden von Webfonts via next/font/google ist vorhanden, aber die Subsets oder Display-Strategien könnten in Subkomponenten optimiert werden.
