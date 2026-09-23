# RED-TEAM AUDIT BEFUNDE

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** In den Cookie-Einstellungen (cookie-einstellungen.tsx) wird direkt auf `window.localStorage` zugegriffen, was bei unzureichenden SSR-Guards zu Hydration-Problemen führt.
- **Befund 2:** Potenzielle Formulare (z.B. anfrage-formular.tsx) nutzen teilweise veraltete Loading-States statt React 19 `useActionState` und `useFormStatus`, was zu "stummen" Momenten bei Latenzen führt.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** `src/lib/client-state.ts` kapselt `window.localStorage` Zugriffe. Bei synchronen Aufrufen während des Initialrenders im Client kommt es zu Mismatches mit dem SSR-Ergebnis. Ein `useEffect` Guard oder Next.js 15 `next/dynamic` mit `ssr: false` ist hier nötig, falls direkt in der UI konsumiert.
- **Befund 2:** Die Formatierung von Preisdaten in Client Components ohne garantierte Locale kann zu Abweichungen führen.

## 3. TypeScript-Schwächen
- **Befund 1:** `satisfies Graph` wird korrekt im `json-ld.tsx` angewandt, jedoch fehlen in einigen Interfaces noch strikte Typen, sodass implizit `any` für dynamische Felder genutzt werden könnte.
- **Befund 2:** Formular-Events werden vereinzelt nicht typ-sicher auf Form-Elemente gecastet, z.B. `(e.target.form?.elements.namedItem('...'))`.

## 4. Core Web Vitals Sünden
- **Befund 1:** Bilder und `ImagePlaceholder` benötigen konsistente `width` und `height` Attribute, da sonst CLS (Cumulative Layout Shift) droht.
- **Befund 2:** Große interaktive Module sollten lazy geladen werden (Next.js `next/dynamic`), um die Time to Interactive (TTI) zu optimieren.

## 5. Design-Kritik nach Schweizer Aesthetik-Standards
- **Befund 1:** Kinetische Disziplin prüfen. Nicht jede Card darf hover-Schatten erhalten, wenn dies den reduzierten Light Mode OKLCH-Look stört.
- **Befund 2:** Typografische Rhythmik: Headline-Tracking sollte für große Header leicht negativ sein, um Eleganz auszustrahlen.
