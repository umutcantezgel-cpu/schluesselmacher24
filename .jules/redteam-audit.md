# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- Formular-Fehlerbehandlung: In diversen Kontakt- und Anfrageformularen fehlen umfassende Loading-States oder Error-Boundaries bei Netzwerk-Timeouts. Dies führt zu "Silent Logic Death", wenn User nach dem Submit kein Feedback erhalten.
- Tote Handlers: Einige Button-Wrapper (z.B. in `src/components/ui/button.tsx` oder `src/components/warenkorb/warenkorb-zusammenfassung.tsx`) weisen `onClick`-Callbacks auf, die bei fehlender Prop ein no-op ausführen.

## 2. Hydration Mismatches & SSR-Konflikte
- Datum und Zeit: In den Terminbuchungs-Komponenten (`src/app/(site)/service-und-termin/anfrage/page.tsx`) können unbedachte `new Date()`-Aufrufe ohne Hydration-Guards zu Mismatches führen.
- Zustandsspeicherung: Der Warenkorb und Konfigurator greifen teils auf `localStorage` zu, was bei fehlendem `useEffect`-Mount-Check Server/Client HTML-Differenzen erzeugt.

## 3. TypeScript-Schwächen
- Unvollständige Interfaces: Bei den `SearchParam`-Interfaces in Next.js Server Components gibt es Potenzial für genauere Typisierung (`Promise<{ [key: string]: string | string[] | undefined }>`).
- Schema.org Validierung: Das JSON-LD Schema (z.B. in `src/app/(site)/layout.tsx`) sollte strikt mit `satisfies Graph` gegen `schema-dts` abgesichert sein.

## 4. Core Web Vitals Sünden
- LCP (Largest Contentful Paint): Auf der Startseite (`src/app/(site)/page.tsx`) fehlen teilweise explizite Priority-Hints für Above-the-Fold Bilder oder AVIF-Optimierung.
- Layout-Shifts: In den Bento-Grids (z.B. `src/components/visual/bento-grid.tsx`) fehlen in Ladezuständen explizite min-heights.

## Design-Kritik (Schweizer Aesthetik)
- Chromatische Reinheit: Einige Schatten oder Hover-States nutzen rgba(0,0,0) statt sauberen OKLCH-Tokens.
- Kinetische Disziplin: Einige Animationen sind nicht an `prefers-reduced-motion` gekoppelt und nutzen lineare Easing-Kurven statt `cubic-bezier(0.16, 1, 0.3, 1)`.
