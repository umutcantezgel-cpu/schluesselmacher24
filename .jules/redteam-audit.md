# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/forms/controls.tsx`: Fehlt Loading-Status auf Absenden-Button.
- `src/components/autoschluessel/termin-auswahl.tsx`: Eventuelle onClick handler leer oder mit reinem console.log.
- `src/components/calculator/service-einsatz-rechner.tsx`: Keine Fehlerbehandlung für ungültige Eingaben sichtbar im ersten Review.

## 2. Hydration Mismatches & SSR-Konflikte
- Keine direkten SSR Konflikte auf den ersten Blick, aber fehlende explizite "use client" Direktiven in stark interaktiven Formularen wie `photo-upload.tsx`.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Schema-Definitionen könnten strenger gegen `schema-dts` typisiert sein anstatt nur mit generischen Objekten.
- Enums könnten potenziell in TSX Dateien verwendet werden (wir müssen auf `as const` Maps wechseln falls gefunden).

## 4. Core Web Vitals Sünden
- `src/components/ui/image-placeholder.tsx`: Bilder in Komponenten könnten fehlende Aspekt-Ratios haben (Layout Shift Risiko).
