# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/autoschluessel/termin-auswahl.tsx`: Leere onClick-Handler ohne Fehlerbehandlung gefunden.
- Keine angemessene Lade-Zustände bei Form-Submits in der Termin-Auswahl.
- Bedingte Renderings mit leeren Arrays gefunden, die Layout-Löcher erzeugen.

## 2. Hydration Mismatches & SSR-Konflikte
- Potenzielle Zugriffe auf `window` ohne Mounting-Guard in älteren Layout-Komponenten (bspw. `src/components/layout/mobile-action-bar.tsx`).
- Datumsformatierungen auf Client-Seite weichen von Server-Werten ab.

## 3. TypeScript-Schwächen
- Unvollständige Interfaces bei Schema.org JSON-LD-Generierung in `src/components/seo/json-ld.tsx`.
- Maskierte Typfehler durch as unknown as Type.

## 4. Core Web Vitals Sünden
- Fehlende explizite Dimensionen bei bestimmten Bildern, was zu potenziellen Layout Shifts führt.
- Schwere Drittanbieter-Bibliotheken unbedacht in Client-Komponenten importiert.

## 5. Swiss Light Design Doctrine
- Größtenteils intakt, aber vereinzelte unsaubere Grautöne anstelle der OKLCH-Basis in älteren SCSS-Relikten gefunden.
- Unausgewogene Zeilenumbrüche (Widows/Orphans) in Fließtexten.
- Zu viele konkurrierende Animationen auf der Startseite, die zu visueller Unruhe führen. Die kinetische Disziplin muss verbessert werden (Rückbau auf exakt eine dominante Signature-Interaktion pro Route).
