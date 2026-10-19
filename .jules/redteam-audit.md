# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Leere onClick Handler in `src/components/ui/button.tsx` entdeckt, die ohne Feedback bleiben.
- **Befund 2:** Formularkomponente in `src/components/forms/photo-upload.tsx` zeigt beim Upload-Vorgang keinen Ladeindikator.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 3:** Direkter Zugriff auf `window` in `src/components/layout/site-header.tsx` ohne Mount-Guard, was zu Hydration-Fehlern führt.
- **Befund 4:** Inkonsistente Datumsformatierung zwischen Server und Client in `src/components/autoschluessel/bestaetigung.tsx`.

## 3. TypeScript-Schwächen
- **Befund 5:** Verwendung von `as any` statt `unknown` in diversen Event-Handlern in `src/components/visual/bereich-icon.tsx`.
- **Befund 6:** Fehlendes `satisfies Graph` für Schema.org-Ausgabe in `src/components/seo/json-ld.tsx`.

## 4. Core Web Vitals Sünden
- **Befund 7:** Fehlende explizite width/height Attribute bei Bildern in `src/app/(site)/page.tsx`.
- **Befund 8:** Unoptimierte Ladezyklen in `src/components/calculator/service-einsatz-rechner.tsx`.

## Visuelle Konsistenz (Swiss Light Mode Doctrine)
- **Chromatische Reinheit:** Einige Hex-Codes statt OKLCH in Legacy-CSS-Dateien gefunden.
- **Kinetische Disziplin:** Zu viele überlappende Animationen in `src/components/visual/motion/reveal.tsx`.
