# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- Tote Event-Handler in Navigation und Formularen.
- Fehlende Ladezustände bei diversen Anfrage-Formularen.

## 2. Hydration Mismatches & SSR-Konflikte
- Ungeprüfte Zugriffe auf `window` in Client-Komponenten.
- Inkonsistente Datumsformatierung zwischen Server und Client.

## 3. TypeScript-Schwächen
- Maskierte Typfehler bei Drittanbieter-Integrationen.
- Ungenügende Typisierung der Schema.org-Graphen.

## 4. Core Web Vitals Sünden
- Bilder in Hero-Sections fehlen teilweise strikte Dimensionen.
- Zu großes Layout-Shift Risiko bei dynamischen Listen.

## 5. Swiss Light Mode Aesthetic
- Leichte Abweichungen von der OKLCH 0.988 Basis.
- Kinetische Dissonanz bei Hover-Effekten (müssen auf eine dominante Interaktion reduziert werden).
