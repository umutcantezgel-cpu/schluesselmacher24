# RED-TEAM AUDIT REPORT

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Viele Buttons (`src/components/ui/button.tsx`) haben unklare oder leere Handler in Fallbacks.
- Kontaktformulare haben verbesserungswürdige Ladezustände, wodurch der Nutzer nicht immer klares Feedback bekommt.
- Bedingte Renderings in Listen (wie bei `src/components/vertrauen/nachweise-liste.tsx`) könnten Layout-Löcher hinterlassen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Datumsformatierungen in `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx` könnten zu Hydration-Mismatches führen.
- Warenkorb und LocalStorage Zugriffe sollten robuster mit Hydration Guards (`useEffect`) versehen werden.

## 3. TYPESCRIPT-SCHWÄCHEN
- Kasse Formulare (`src/app/(site)/kasse/kasse-formular.tsx`) können striktere Typisierung gebrauchen, indem `any` durch `unknown` mit Zod-Validierung ersetzt wird.
- Schema.org Graphen in `src/components/seo/json-ld.tsx` sollten mit `satisfies Graph` gegen `schema-dts` abgesichert werden.

## 4. CORE WEB VITALS SÜNDEN & AESTHETIK-STANDARDS
- Bild-Platzhalter (`src/components/ui/image-placeholder.tsx`) sollten explizite Dimensionen und AVIF bevorzugen, um Layout Shifts zu vermeiden.
- Kinetische Disziplin: Aktuelle Karten (`src/components/ui/card.tsx`) könnten zu asymmetrischen Bento-Grids mit Haarlinien-Lichtreflexen (oklch 0.89 0.008 260 / 0.55) aufgewertet werden.
- Fehlende "use cache" Memoisierung für Next.js 16 in Artikel-Routen.
