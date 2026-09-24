# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- `src/app/autoschluessel/anfrage/assistent.tsx`: Enthält Potenziale für Formular-Hänger, wenn der Netzwerk-Request fehlschlägt und kein expliziter Ladezustand vorhanden ist.
- `src/components/calculator/service-budget-calculator.tsx`: Die Berechnung wird teilweise verzögert dargestellt, was ohne Loading-States verwirrend wirkt.
- `src/app/schluessel-nach-code/[slug]/bestell-formular.tsx`: Eventuell onSubmit-Handler ohne vollständige Fehlerbehandlung.

## 2. Hydration Mismatches & SSR-Konflikte
- Generell müssen `localStorage`-Aufrufe in Client-Komponenten wie dem Warenkorb-State (z.B. in `src/lib/store/cart.ts`) strengstens durch `useEffect` abgesichert sein.
- Datumsformatierungen in Buchungsformularen (z.B. `src/app/service-und-termin/anfrage/anfrage-formular.tsx`) müssen server/client konsistent sein.

## 3. TypeScript-Schwächen
- Prüfung von Schema.org in `src/components/seo/json-ld.tsx` ob `satisfies Graph` konsequent angewendet wird.
- Oftmals fehlende Typisierungen bei Event-Targets in Formularen.

## 4. Core Web Vitals Sünden
- LCP (Largest Contentful Paint) auf `src/app/page.tsx` leidet, wenn Hero-Bilder nicht explizit dimensioniert sind oder nicht per `priority` geladen werden.

## Visuelle Konsistenz (Swiss Light Mode)
- Es existieren teilweise inkonsistente Schattenwürfe in Cards (`src/components/ui/card.tsx`), die nicht der `oklch(0.988)` Basis entsprechen.
