# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- Mehrere onClick Handler in Legacy-Komponenten geben nur leere console.logs aus.
- Formulare haben inkonsistente Loading States.

## 2. Hydration Mismatches & SSR-Konflikte
- window/localStorage Zugriffe ohne useEffect in bestimmten Client-Komponenten gefunden.
- Inkonsistente Datumsformatierungen zwischen Server/Client auf Detailseiten.

## 3. TypeScript-Schwächen
- Maskierte Typfehler mit 'as unknown as Type' in einigen API-Routen.
- Schema.org Objekte teilweise ohne strikte Überprüfung.

## 4. Core Web Vitals Sünden
- Fehlende explizite width/height in Legacy Image-Komponenten.
- Einige schwere Third-Party Libraries werden direkt in Client-Komponenten geladen.