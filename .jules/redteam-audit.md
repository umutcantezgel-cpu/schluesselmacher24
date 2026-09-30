# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- Mehrere Formulare (z.B. in `kasse-formular.tsx` und `anfrage-formular.tsx`) nutzen rudimentäre Ladezustände ohne ordentliches `useActionState` oder `useOptimistic`.
- `onClick` Handler in einigen UI-Buttons geben nur oberflächliche Logs oder unvollständige Transitionen zurück.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Animationen in `components/visual/motion` rufen möglicherweise Window-Objekte zu früh auf, was zu SSR-Konflikten führt.
- Fehlende Aspect-Ratios bei einigen Placeholder-Bildern verursachen Layout-Shifts während der Hydration.

## 3. TypeScript-Schwächen
- Komplexe Formulare (z.B. Zylinder-Konfigurator) könnten tiefere Typensicherheiten in den Server Actions vertragen. Es gibt vereinzelt `as unknown` Casts.
- Schema.org Graphen in `json-ld.tsx` könnten noch strikter typisiert sein.

## 4. Core Web Vitals Sünden
- Fehlende `use cache` Direktiven für statische Content-Blöcke verschlechtern die TTFB (Time to First Byte).
- CSS Subgrid wird nicht konsequent in den Feature-Karten verwendet, was bei unterschiedlichen Textlängen zu unsauberen Rows und potenziellen CLS-Problemen führt.
- Drittanbieter-Scripte blockieren teilweise den Main-Thread.
