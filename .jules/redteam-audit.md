# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Es gibt onClick Handler in `components/ui/button.tsx` die nicht durchgehend Loading-States abbilden können.
- Einige Formulare in `app/(site)/autoschluessel/anfrage/assistent.tsx` zeigen nach Submit-Fehlern keine klaren Retry-Möglichkeiten, sondern bleiben stumm.
- Bei leerer Artikelliste in `app/(site)/artikel/artikel-liste.tsx` gibt es ein Layout-Loch statt eines ansprechenden Empty-States.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Direkte Zugriffe auf Fenstergröße ohne Hydration-Guards in Layout-Berechnungen in `components/layout/mobile-action-bar.tsx`.

## 3. TYPESCRIPT-SCHWÄCHEN
- Maskierte Typen in Formulardaten-Parsen, teilweise `as any` oder unvollständige Validation in `app/(site)/api/kunden-upload/route.ts`.

## 4. CORE WEB VITALS SÜNDEN
- Bilder in `components/ui/image-placeholder.tsx` oder generischen Komponenten oft ohne hartes `width`/`height` oder `aspect-ratio` was CLS (Cumulative Layout Shift) verursacht.
