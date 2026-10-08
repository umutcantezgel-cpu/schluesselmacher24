# Red-Team Audit Report
## Silent Logic Death & Interaktions-Fallen
- `src/components/forms/photo-upload.tsx`: Vermutlich fehlende Fallbacks für kaputte Datei-Uploads (Silent Logic Death bei Netzwerkabbruch).
- `src/components/ui/accordion.tsx`: Layout-Löcher beim schnellen Auf/Zuklappen ohne ResizeObserver.
- `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx`: Kein expliziter Ladezustand bei Bild-Verarbeitung.

## Hydration Mismatches
- `src/components/layout/site-header.tsx`: Potenzielles Mismatch, wenn Media-Queries im Client initialisiert werden.
- Datumsformate in `src/app/(site)/artikel/[slug]/page.tsx` könnten Zeitzonen-Probleme verursachen.

## TypeScript-Schwächen
- `src/components/visual/area-scope.tsx`: Eventuell unvollständiges Interface für dynamische CSS Properties.
- `src/components/seo/json-ld.tsx`: Prüfen, ob `satisfies Graph` streng durchgesetzt wird.

## Core Web Vitals
- LCP in `src/app/(site)/page.tsx` könnte durch blockierendes SVG-Rendering verzögert werden.
- CLS bei asynchron ladenden Rechnern (z.B. `src/components/calculator/tuer-absicherung-rechner.tsx`).

## Swiss Light Mode Kritik
- Schatten in `src/components/ui/card.tsx` könnten zu hart sein (Hex statt OKLCH-Transparenz).
- Zu viel Bewegung bei Scrollen in `src/components/visual/motion/check-draw.tsx`.
