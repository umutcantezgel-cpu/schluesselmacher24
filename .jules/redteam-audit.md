# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- Formular-Submission auf der Kontaktseite hat keinen sichtbaren Ladezustand.
- Unnötige leere onClick-Handler in veralteten Button-Komponenten gefunden.

## 2. Hydration Mismatches & SSR-Konflikte
- Potenzielle `window`-Zugriffe in Legacy-Komponenten, die Hydration-Warnings auslösen könnten.

## 3. TypeScript-Schwächen
- Einige Typen sind implizit `any` oder nutzen lockere `unknown`-Castings.
- Schema.org JSON-LD Objekte sind teilweise nicht streng gegen `schema-dts` typisiert.

## 4. Core Web Vitals Sünden
- Bilder in Content-Blöcken fehlen teilweise explizite `width` und `height` Attribute, was zu Layout Shifts (CLS) führt.
- Einige Schriftarten verursachen FOIT (Flash of Invisible Text) vor dem Laden.

## Design-Kritik (Swiss Light Mode Doctrine)
- Inkonsistente Verwendung von Hex-Farben anstelle der sauberen OKLCH-Tokens für den Canvas-Hintergrund.
- Leichte Abweichungen bei den 1px Kanten und Schatten-Definitionen.
- Fehlende Kinetische Disziplin: Einige Seiten haben zu viele unkoordinierte Animationen.
