# Red-Team Audit Befunde
## Silent Logic Death
- Einzelne onClick Handler sind nicht optimal verdrahtet.
- Ladezustände bei diversen Formularen fehlen, was Nutzer im Unklaren lässt.
- Einige bedingte Renderings von Arrays verursachen leichte Layout-Shifts.

## Hydration Mismatches & SSR-Konflikte
- Einige Komponenten nutzen clientseitige APIs ohne ausreichende Mounting-Guards, was zu React-Hydration-Fehlern führen kann.
- Datumsformate werden in Einzelfällen server- und clientseitig inkonsistent verarbeitet.

## TypeScript-Schwächen
- Typ-Maskierungen (`as any` / `as unknown`) schwächen die strikte Typsicherheit.
- Schema.org Graphen nutzen nicht durchgehend `satisfies Graph` für volle schema-dts Verifikation.

## Core Web Vitals
- Bilder ohne explizite Dimensionen oder Aspekt-Ratios verursachen CLS.
- Drittanbieter-Skripte beeinflussen die TTI negativ.

## Visuelle Hebel (Schweizer Light Mode)
- OKLCH Tokens werden teilweise durch alte Hex-Werte verwässert.
- Typografische Rhythmik erfordert Feinschliff bzgl. Widows/Orphans.
- Mehrere Animationen kämpfen teils um Aufmerksamkeit, statt eine dominante Kinetik-Fokussierung zu erzielen.
