# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- In `src/components/ui/button.tsx` wurden Event-Handler ohne `useTransition` gefunden.
- Formulare in `src/app/(site)/autoschluessel/anfrage/page.tsx` zeigen ungenügende Ladezustände an.
- Leere Callbacks `() => {}` in `src/components/layout/mobile-action-bar.tsx`.

## 2. Hydration Mismatches & SSR-Konflikte
- Unzureichende Guards für `window`-Zugriffe in `src/components/calculator/service-einsatz-rechner.tsx`.
- Datumsformatierungen weisen Inkonsistenzen zwischen Server und Client auf.

## 3. TypeScript-Schwächen
- Casting mittels `as unknown as Type` wurde in `src/components/autoschluessel/optionen.ts` festgestellt.
- Schema.org JSON-LD Objekte sind nicht restriktiv genug typisiert.

## 4. Core Web Vitals Sünden
- Fehlende Aspect-Ratios für Bilder in `src/components/ui/bild-flaeche.tsx`.
- Suboptimale Memoisierung in komplexen Layouts.

## 5. Swiss Light Design Doctrine
- Vereinzelt harte Hex-Farben gefunden, die gegen die OKLCH 0.988 Basis-Regel verstoßen.
- Einige Schatten sind zu hart und entsprechen nicht der geforderten seidenweichen Schweizer Ästhetik.
