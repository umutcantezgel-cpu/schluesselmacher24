# RED-TEAM AUDIT (JC-PHILOSOPHER-REDTEAM-v1)

## PHASE 0: GNADENLOSER RED-TEAM AUDIT DES IST-ZUSTANDS

### 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Befund 1:** `src/app/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx` enthält leere `onSubmit` Handler in Edge-Cases, die keine UI-Fehlermeldung auslösen.
- **Befund 2:** `src/components/ui/button.tsx` hat teilweise fehlende `:focus-visible` Rings in Kombination mit bestimmten Varianten, was die Accessibility bricht.
- **Befund 3:** Layout-Shift bei `src/app/warenkorb/warenkorb-ansicht.tsx` durch bedingtes Rendering leerer Arrays.

### 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Befund 1:** Zufällige ID-Generierung in Client-Komponenten (`src/components/ui/accordion.tsx`) ohne `useId`, was zu Hydration-Fehlern führt.
- **Befund 2:** Direkter Zugriff auf `window.localStorage` in `src/app/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx` vor dem Mounting.

### 3. TYPESCRIPT-SCHWÄCHEN
- **Befund 1:** Suboptimale Typisierung in `src/app/admin/fahrzeugdaten/fahrzeug-verwaltung.tsx`, die `as any` Casts provoziert.

### 4. CORE WEB VITALS SÜNDEN
- **Befund 1:** `src/components/ui/image-placeholder.tsx` fehlen teilweise hartcodierte Aspect-Ratios, was CLS (Cumulative Layout Shift) erhöht.
- **Befund 2:** Unnötige Ladezeiten durch fehlendes Preloading kritischer Webfonts.

### 5. DESIGN-KRITIK (SCHWEIZER AESTHETIK-STANDARDS)
- **Chromatische Reinheit:** Suboptimale Schatten in `src/components/ui/card.tsx` die nicht exakt der `oklch`-Doktrin folgen.
- **Typografische Rhythmik:** Mangelhafter Kontrast bei sekundären Labels in `src/components/forms/field.tsx`.
- **Kinetische Disziplin:** Übermäßige Animationen in `src/app/page.tsx`, die durch eine singuläre, elegante View-Transition ersetzt werden sollten.