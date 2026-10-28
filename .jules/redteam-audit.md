# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/calculator/enterprise-roi-calculator.tsx`: Formular-Zustände könnten bei leeren Eingaben lautlos scheitern.
- Leere Handler (`() => {}`) in älteren Formularkomponenten gefunden.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Client-Komponenten rufen potenziell `window` ohne Guard auf.
- Zufallszahlen in UI-Karten verursachen Hydration Mismatches.

## 3. TypeScript-Schwächen
- Graphen in Schema.org nicht vollständig mit `satisfies Graph` gegen `schema-dts` abgesichert.
- `as unknown as Type` Maskierungen in Datenlayern.

## 4. Core Web Vitals Sünden
- Bilder in Hero-Sektionen fehlen reservierte Aspect-Ratios (Layout Shifts).
- Unbedachte Drittanbieter-Importe in einigen Client-Komponenten.

## 5. Design-Kritik (Schweizer Light Mode Doktrin)
- Chromatische Reinheit: Einige harte Grautöne anstelle von reinen OKLCH-Tokens (`oklch(0.988 0.002 260)`).
- Kinetische Disziplin: Zu viele ungerichtete Animationen anstelle EINER dominanten Signature-Interaktion pro Route.
