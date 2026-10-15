# RED-TEAM AUDIT
## Phase 0: Ist-Zustand Analyse

### 1. Silent Logic Death
- Subtile Hydration-Konflikte in den Formularen unter `/service-und-termin`.
- Fehlende Ladezustände in der Kasse (`/kasse`), `onSubmit` ohne Error-Boundary.
- Event-Handler in einigen Button-Komponenten leiten ins Leere (keine Fehlerbehandlung).

### 2. Hydration Mismatches & SSR-Konflikte
- Direkter Zugriff auf `window.localStorage` im Warenkorb (`/warenkorb`) ohne Mount-Guard.
- Layout-Shift durch asynchron geladene Drittanbieter-Schriften.

### 3. TypeScript-Schwächen
- Unvollständige Interfaces in `schema-dts` Einbindungen auf Ratgeber-Seiten.
- `as unknown as Type` Maskierungen in dynamischen Routen.

### 4. Core Web Vitals Sünden
- Unoptimierte Bilder im Autoschlüssel-Bereich (fehlende `width`/`height` Attribute).
- Schwere Komponenten, die das LCP (Largest Contentful Paint) auf der Startseite verzögern.

### 5. Schweizer Light Mode Marken-DNA
- Einige Grautöne verfehlen die reine OKLCH 0.988 Basis.
- Kinetische Unruhe auf der Startseite: Mehrere Animationen überlagern sich unharmonisch.
