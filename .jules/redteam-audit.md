# Red-Team Audit Report
## Silent Logic Death
- `src/app/(site)/autoschluessel/page.tsx`: Die onClick Handler für die Marken-Filterung sind teilweise leere Funktionen oder loggen nur in die Konsole.
- `src/app/(site)/kasse/page.tsx`: Ein Formular zeigt keinen Ladezustand an und bleibt bei Netzwerkfehlern stumm.
- `src/app/(site)/sicherheitstechnik/page.tsx`: Bedingte Renderings für Sicherheitskarten hinterlassen Layout-Löcher bei leeren Arrays.

## Hydration Mismatches & SSR Konflikte
- `src/app/(site)/schluessel-nach-code/page.tsx`: Direkter Zugriff auf `window.localStorage` ohne Mounting-Guards führt zu Hydration-Fehlern.
- `src/app/(site)/ratgeber/page.tsx`: Datumsformatierungen rendern auf dem Server (UTC) und Client (Lokal) unterschiedlich.

## TypeScript Schwächen
- `src/app/(site)/schliessanlagen/page.tsx`: Maskierte Typfehler durch `as unknown as Type` bei Konfigurator-Daten.
- `src/app/(site)/page.tsx`: Schema.org Graphen sind nicht strikt mit `satisfies Graph` gegen `schema-dts` abgesichert.

## Core Web Vitals Sünden
- `src/app/(site)/standorte/page.tsx`: Bilder von Filialen haben keine expliziten Dimensionen, was zu Layout-Shifts führt.
- `src/app/(site)/layout.tsx`: Schwere Drittanbieter-Bibliotheken werden unbedacht in Client-Komponenten geladen.

## Design-Kritik (Swiss Aesthetics)
- Chromatische Reinheit: Einige Bereiche verwenden harte Hex-Werte statt reiner OKLCH-Tokens.
- Typografische Rhythmik: Headline-Umbruche auf der Startseite sind unausgewogen (Widows/Orphans).
- Kinetische Disziplin: Zu viele Hover-Animationen kämpfen auf der Services-Seite um Aufmerksamkeit.
