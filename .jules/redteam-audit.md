# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- In `src/components/calculator/tuer-absicherung-rechner.tsx` und `src/components/calculator/service-einsatz-rechner.tsx` fehlen serverseitige Fallbacks für die Formulareinreichung; sie nutzen `useState` und sind als reine Client-Komponenten implementiert, was bei deaktiviertem JavaScript zu einem echten Silent Logic Death führt.
- Die Formulare für Anfrage und Kasse besitzen möglicherweise keine ausreichenden Ladezustände (`useFormStatus` / `useTransition`), was zu mangelndem kinetischem Feedback bei langsamen Netzwerken führen kann.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Komponenten rendern potenziell dynamische Inhalte (z. B. Zufalls-IDs in Formularen via `useId()`, was zwar React 18+ sicher ist, aber in Kombination mit Drittanbieter-Scripts problematisch sein kann).
- Die LocalStorage-Nutzung (falls vorhanden, z.B. für Warenkorb-State) muss strikt hinter `useEffect` Guards verborgen werden.

## 3. TypeScript-Schwächen
- Potenzielle `as unknown as X` Castings in dynamischen Routen (`[slug]`), wenn Parameter nicht korrekt durch `Promise<{ slug: string }>` aufgelöst werden.
- Fehlende Typsicherheit in den JSON-LD Schema.org Graphen.

## 4. Core Web Vitals Sünden
- Fehlende oder unzureichende Dimensionsangaben bei Bild-Platzhaltern (`ImagePlaceholder`), was zu Cumulative Layout Shifts (CLS) führen kann.

## Design-Kritik (Schweizer Aesthetic)
- Die Komponenten benötigen striktere OKLCH-Farbtreue und ein konsequentes 1px-Haarlinien-Raster für die "Bento"-Grids.
