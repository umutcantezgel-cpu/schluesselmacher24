# Red-Team Audit Report
## Phase 0: Red-Team Audit des Ist-Zustands

### 1. Silent Logic Death & Interaktions-Fallen
- **Formulare ohne Ladezustand:** Mehrere Formulare (z.B. in `service-und-termin` und `termin-auswahl.tsx`) zeigen während der Einreichung keine visuellen Ladeindikatoren, was zu Verwirrung und Mehrfach-Klicks führt.
- **Tote Handler:** In einigen UI-Komponenten (z.B. `button.tsx`, `info-tip.tsx`) wurden unverdrahtete `onClick`-Handler oder leere `() => {}` Funktionen identifiziert, die auf eine unvollständige Implementierung hinweisen.
- **Leere Zustände:** Bedingtes Rendering bei leeren Arrays in Komponenten wie `preis-anzeige.tsx` oder `schluesselarten-reihe.tsx` führt zu unerwarteten Layout-Sprüngen und visuellen Löchern.

### 2. Hydration Mismatches & SSR-Konflikte
- **Client-Side-Only APIs:** Zugriffe auf `window` und `localStorage` in bestimmten Interaktionsmodulen (z.B. `rechner-bausteine.tsx`) sind nicht korrekt mit Mounting-Guards abgesichert, was zu Hydration-Mismatches führt.
- **Dynamische Daten:** Datumsformatierungen und Zufallszahlen (z.B. in Testimonials oder terminbezogenen Anzeigen) weisen auf dem Server und Client unterschiedliche Werte auf.

### 3. TypeScript-Schwächen
- **Type Masking:** Gelegentliche Verwendung von `as any` oder `as unknown as Type` in Daten-Transformations-Schichten maskiert zugrunde liegende Typisierungsprobleme.
- **Schema.org Validierung:** JSON-LD Strukturen (z.B. für Artikel oder FAQs) sind nicht strikt genug gegen `schema-dts` abgesichert.

### 4. Core Web Vitals & Performance
- **Bild-Dimensionen:** Einige Bilder in `bild-flaeche.tsx` oder Hero-Sections weisen keine expliziten `width` und `height` Attribute auf, was Cumulative Layout Shift (CLS) begünstigt.
- **Drittanbieter-Scripte:** Unbedachter Import schwerer Bibliotheken in Client-Komponenten, die eigentlich in Server-Komponenten oder asynchron geladen werden könnten.

### 5. Visuelle Konsistenz (Schweizer Light Mode)
- **OKLCH Abweichungen:** Vereinzelt finden sich harte Hex-Werte oder unsaubere Grautöne anstelle der definierten OKLCH-Tokens.
- **Kinetische Disziplin:** Auf bestimmten Seiten kämpfen mehrere Hover- oder Scroll-Animationen gleichzeitig um Aufmerksamkeit. Eine Reduktion auf EINE dominante Signature-Interaktion pro Route ist erforderlich.

**Fazit:** Der Audit deckt signifikantes Optimierungspotenzial in den Bereichen Performance, Hydration-Sicherheit und visueller Konsistenz auf. Die folgenden 100 Ideen zielen darauf ab, diese Defizite systematisch zu beheben und die User Experience zu revolutionieren.
