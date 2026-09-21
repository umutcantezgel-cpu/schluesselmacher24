# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund:** Mehrere interaktive Elemente in den UI-Komponenten rufen potenziell leere Funktionen auf oder lassen Nutzer bei Formularen ohne Feedback im Unklaren.
- **Speziell:** `src/components/forms/photo-upload.tsx` und andere Formulare zeigen bei Netzwerkfehlern oder langsamen Verbindungen oft keine adäquaten Ladezustände an.
- **Empfehlung:** Integration von React 19 `useActionState` und `useOptimistic` in allen interaktiven Modulen zur Garantie von robusten Lade- und Fehlerzuständen.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund:** Es besteht die Gefahr, dass Datumsformatierungen oder dynamische Berechnungen (z.B. in Kalkulatoren wie `src/components/calculator/service-budget-calculator.tsx`) auf Server und Client unterschiedlich rendern.
- **Speziell:** Fehlen von strengen Mounting-Guards bei Zugriff auf client-spezifische APIs.
- **Empfehlung:** Striktes Isolieren interaktiver Logik in dedizierte Client-Komponenten und Sicherstellung asynchroner Zugriffe auf `params`, `searchParams` etc. (Next.js 16+ Standard).

## 3. TypeScript-Schwächen
- **Befund:** Gefahr von maskierten Typfehlern oder unvollständigen Interfaces in der Datenstruktur.
- **Speziell:** Die Schema.org Graphen in `src/components/seo/json-ld.tsx` müssen strenger typisiert werden.
- **Empfehlung:** Eliminierung aller verbleibenden `any`-Typen und Ersatz durch präzise Typen oder `satisfies`-Deklarationen. Keine Verwendung von Enums (nur `as const` Maps).

## 4. Core Web Vitals Sünden
- **Befund:** Optimierungspotenzial bei der Ladezeit und visuellen Stabilität.
- **Speziell:** Bilder ohne explizite Dimensionen oder unoptimierte Assets.
- **Empfehlung:** Durchgehende Nutzung von Next.js Image mit definierten Aspect Ratios. Einführung von `use cache` Memoisierung für rechenintensive oder datenlastige Routen.

## 5. Design-Kritik (Schweizer Ästhetik-Standards)
- **Befund:** Inkonsistenzen in der visuellen Hierarchie und Rhythmik.
- **Speziell:** Einige Komponenten nutzen eventuell noch nicht die reinen OKLCH-Tokens der "Swiss Light Mode" Doktrin (z.B. `Canvas oklch(0.988 0.002 260)`).
- **Empfehlung:** Rigorose Harmonisierung durch CSS Subgrid, 1px Kanten und Vermeidung von "Frankenstein-UI"-Elementen. Konzentration auf exakt eine dominante Signature-Interaktion pro Route.
