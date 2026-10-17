# Red-Team Audit

## 1. Silent Logic Death & Interaktions-Fallen
- `src/app/(site)/autoschluessel/page.tsx`: Die onClick Handler der interaktiven Schlüssel-Module geben teilweise nur `console.log` aus und führen ins Nichts.
- `src/components/calculator/rechner-bausteine.tsx`: Formulare zeigen bei Netzwerk- oder Server-Verzögerungen keinen korrekten Ladezustand an, was zu Frustration führt.
- `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`: Leere Arrays im State hinterlassen sichtbare Layout-Löcher anstatt ordentlicher Fallback-Grids.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/vertrauen/nachweise-liste.tsx`: Zugriff auf `window` Eigenschaften ohne Mounting-Guards führt zu Hydratisierungs-Fehlern in der Next.js App.
- `src/components/schliessanlagen/system-erklaerung.tsx`: Zufallsgenerierte IDs auf dem Server unterscheiden sich vom Client-Rendering.

## 3. TypeScript-Schwächen
- `src/components/visual/registry.test.tsx`: Maskierte Typfehler durch `as unknown as VisualRef` umgehen die Typsicherheit.
- `src/app/(site)/layout.tsx`: Schema.org Graphen sind nicht mit `satisfies Graph` gegen `schema-dts` abgesichert.

## 4. Core Web Vitals Sünden
- `src/app/(site)/page.tsx`: Mehrere Bilder laden ohne explizite Dimensionen oder reservierte Aspect-Ratios, was CLS verursacht.
- `src/components/visual/icons/fahrzeugoeffnung.tsx`: Schwere SVGs könnten optimiert oder durch CSS-Lösungen ersetzt werden.

## Design-Kritik (Swiss Aesthetics)
- Chromatische Reinheit: Einige Bereiche verwenden noch harte Hex-Werte statt reiner OKLCH-Tokens (`oklch(0.988 0.002 260)`).
- Typografische Rhythmik: Unausgewogene Zeilenumbrüche (Widows/Orphans) in den Fließtexten.
- Kinetische Disziplin: Zu viele verschiedene Animationstypen konkurrieren um Aufmerksamkeit. Es braucht eine Rückbesinnung auf eine dominante Signature-Interaktion pro Route.
