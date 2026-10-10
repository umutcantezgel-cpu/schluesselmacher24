# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- `src/components/forms/photo-upload.tsx`: Fehlender Upload-Status bei langsamen Verbindungen; form controls ohne Loading-Indikator, was zu "Silent Logic Death" führt.
- `src/components/calculator/service-einsatz-rechner.tsx`: onClick-Handler in OptionCards, die keine spürbare Fehlerbehandlung bei fehlenden Eingaben haben.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- `src/components/layout/mobile-action-bar.tsx`: Eventuelle Hydration-Konflikte bei der Anzeige des Warenkorb-Counters oder Client-seitigen Zuständen ohne SSR-Bypass.
- Zufallsgeneratoren oder datumsbasierte Anzeigen in bestimmten Layout-Komponenten könnten zu leichten Hydration Mismatches führen.

## 3. TYPESCRIPT-SCHWÄCHEN
- `src/components/seo/json-ld.tsx`: Potenzielle Lücken bei der Validierung dynamischer Schema-Graphen.
- Fehlende oder unzureichende Interfaces in älteren Visual-Komponenten.

## 4. CORE WEB VITALS SÜNDEN
- `src/components/ui/image-placeholder.tsx`: Teilweise fehlende explizite Dimensionen oder aspect-ratio Angaben, was zu CLS (Cumulative Layout Shift) führen kann.
- Schwergewichtige Animationen ohne Lade-Optimierung.

## DESIGN-KRITIK NACH SCHWEIZER AESTHETIK-STANDARDS
- Kinetische Disziplin: Zu viele Hover-Effekte auf einmal in bestimmten Grids.
- Chromatische Reinheit: Einige Rand-Töne weichen leicht vom reinen OKLCH 0.988 Basis-Canvas ab.
- Typografische Rhythmik: Teilweise unbalancierte Zeilenumbrüche in Card-Headern.
