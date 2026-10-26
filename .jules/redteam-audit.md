# Red-Team Audit & Status Quo
Datum: 2026-10-26T12:00:00Z
Agent: JC-PHILOSOPHER-REDTEAM-v1

## 1. Silent Logic Death & Interaktions-Fallen
- `window.scrollTo` Aufrufe direkt in `onClick` (z.B. in `elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`), was zu Hydration-Mismatches und unschönen Layout-Shifts führt.
- `window.print()` direkt in Button `onClick` ohne saubere Client-Side Guards (`rechtliches/widerruf/erklaeren/widerruf-formular.tsx`).
- Leere Handler und fehlende Loading-Indikatoren in verschiedenen Formular-Komponenten.

## 2. Hydration Mismatches & SSR-Konflikte
- Ungeguardete Zugriffe auf `window.localStorage` in `lib/client-state.ts` und `einwilligung.ts`.
- Verwendung von `window.matchMedia` ohne Mount-Check, was beim SSR serverseitig knallt oder Mismatches provoziert.

## 3. TypeScript-Schwächen
- Gefährlicher und flächendeckender Einsatz von `as unknown as Type`, der die Typisierung von API-Antworten und Komponenten aushebelt (z.B. in `google-analytics.tsx` und `payload-mapping.ts`). Dies maskiert tieferliegende Architekturfehler.
- Teilweise unvollständige Interfaces für Schema.org Objekte.

## 4. Core Web Vitals & Swiss Light Mode (Design-Kritik)
- Layout-Verschiebungen (CLS) durch nicht vordefinierte Bilddimensionen.
- Nicht-konsequente Nutzung von OKLCH-Farbtokens; es tauchen an einigen Stellen feste Farbwerte auf.
- Kinetische Disziplin fehlt an mehreren Stellen: Mehrere Hover- und Lade-Animationen konkurrieren um Aufmerksamkeit.
