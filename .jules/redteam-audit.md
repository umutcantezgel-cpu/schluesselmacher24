# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/forms/controls.tsx`: onClick-Handler enthalten teilweise leere Funktionen oder unvollständige Callback-Ketten.
- `src/components/autoschluessel/termin-auswahl.tsx`: Formulare zeigen bei langsamen Netzwerkverbindungen keinen Loading-State an, Nutzer bleiben im Unklaren.
- `src/components/autoschluessel/key-kinds.tsx`: Bedingtes Rendering bei leeren Schlüsselart-Arrays führt zu unerwarteten Layout-Löchern.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/visual/interaktiv/live-schluessel.tsx`: Direkter Zugriff auf `window.innerWidth` ohne Mounting-Guard (`useEffect`) führt zu Hydration-Fehlern.
- `src/components/autoschluessel/preis-anzeige.tsx`: Zufallszahlen oder lokal generierte Timestamps weichen zwischen Server und Client ab.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Maskierte Typfehler durch exzessive Nutzung von `as unknown as Type`.
- `src/components/calculator/service-einsatz-rechner.tsx`: Unvollständige Interfaces bei komplexen Kalkulator-State-Objekten.

## 4. Core Web Vitals Sünden
- `src/components/ui/bild-flaeche.tsx`: LCP-Bilder werden ohne explizite Dimensionen oder reservierte Aspect-Ratios geladen.
- `src/components/visual/schluesselart-zeichnung.tsx`: Schwere SVG-Manipulationen werden unbedacht in Client-Komponenten geparst.

## 5. Swiss Light Mode Doktrin Verstöße
- `src/components/ui/card.tsx`: Verwendung von schmutzigen Grautönen anstelle von sauberen OKLCH-Tokens (z.B. fehlendes `oklch(0.988 0.002 260)` für Canvas).
- `src/app/page.tsx`: Zu viele um Aufmerksamkeit kämpfende Animationen. Fordere den Rückbau auf exakt EINE dominante Signature-Interaktion pro Route.
