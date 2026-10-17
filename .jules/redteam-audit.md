# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **`app/(site)/autoschluessel/page.tsx`**: Die onClick Handler auf den Wrench/Car Icons sind teilweise unverdrahtet oder nutzen leere Pfeilfunktionen. Es fehlt die saubere Fehlerbehandlung.
- **`app/(site)/kasse/page.tsx`**: Bei der Bestellübersicht fehlt eine native Ladezustands-Anzeige (`useFormStatus`), was zu Silent Hydration Issues führt, wenn das Netzwerk langsam ist.
- **`app/(site)/warenkorb/page.tsx`**: Bedingtes Rendering bei leerem Warenkorb führt zu einem abrupten Layout-Loch, da kein weicher `view-transition-name` definiert ist.

## 2. Hydration Mismatches & SSR-Konflikte
- **`components/ui/accordion.tsx`**: Mögliche Hydration Mismatches durch nicht-deterministisches Generieren von IDs auf Server- und Client-Seite.
- **`app/(site)/standorte/page.tsx`**: Der Zugriff auf `window.navigator` für die Standortbestimmung ist nicht mit einem `useEffect` Mounting-Guard abgesichert.

## 3. TypeScript-Schwächen
- **`lib/data.ts`**: Maskierte Typfehler bei der Verarbeitung von API-Responses (`as unknown as Type`).
- **`components/seo/json-ld.tsx`**: Das Schema.org Graph Objekt ist nicht strikt mit `satisfies Graph` gegen `schema-dts` typisiert, was zu stillen SEO-Fehlern führen kann.

## 4. Core Web Vitals Sünden
- **`components/ui/image-placeholder.tsx`**: Es fehlen explizite Aspect-Ratios (`aspect-video`, etc.), was zu Cumulative Layout Shifts (CLS) beim Laden der Platzhalter führt.
- **`app/(site)/page.tsx`**: Schwere Drittanbieter-Bibliotheken (falls vorhanden) blockieren das Rendering, da sie nicht mit `next/dynamic` geladen werden.

## 5. Swiss Light Mode Verstöße
- **`app/(site)/globals.css`**: Einige Grautöne sind nicht sauber auf OKLCH-Basis definiert (`oklch(0.988 0.002 260)`), was die chromatische Reinheit verletzt.
- **Typografische Rhythmik**: Unausgewogene Zeilenumbrüche in Headlines auf der Startseite. Fehlendes negatives Tracking für große Typografie.
