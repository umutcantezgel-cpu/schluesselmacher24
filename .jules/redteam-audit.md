# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Zahlreiche leere onClick-Handler und fehlende Ladezustände in den Service-Formularen.
- **Befund 2:** Bestimmte `page.tsx` bedingte Renderings führen zu Layout-Löchern bei leeren Arrays.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Direkte Zugriffe auf `window` und `localStorage` in Client-Komponenten ohne Mounting-Guards entdeckt.
- **Befund 2:** Inkonsistente Datumsformatierung auf Server und Client führt zu Rehydration-Warnungen.

## 3. TypeScript-Schwächen
- **Befund 1:** Mehrfache Nutzung von `as unknown as Type` maskiert unvollständige Interfaces, insbesondere im Artikel-Bereich.
- **Befund 2:** Schema.org Graphen sind nicht durchgehend gegen `schema-dts` typisiert.

## 4. Core Web Vitals Sünden
- **Befund 1:** Bilder im Showcase ohne explizite Dimensionen gefunden.
- **Befund 2:** Schwere Drittanbieter-Bibliotheken werden unbedacht in Client-Komponenten geladen, was die TTI negativ beeinflusst.

## 5. Schweizer Light Mode Aesthetic Verstöße
- **Befund 1:** Harte Hex-Werte und verwaschene Grautöne statt reiner OKLCH-Tokens an verschiedenen Stellen.
- **Befund 2:** Kinetische Disziplin fehlt, überlappende Animationen anstatt einer dominanten Signature-Interaktion pro Route.
