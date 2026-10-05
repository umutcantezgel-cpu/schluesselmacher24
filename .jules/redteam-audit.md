# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Warenkorb & Kasse**: Fehlende Optimistic-Updates in `src/app/(site)/warenkorb/page.tsx`. Das Entfernen von Artikeln führt potenziell zu UI-Freezes oder ungeschützten Zustandslücken, bevor Server-Aktionen greifen.
- **Formulare**: `src/app/(site)/service-und-termin/page.tsx` verlässt sich auf veraltete `onSubmit`-Muster ohne durchgängiges, haptisches Lade-Feedback (`useActionState` & `useFormStatus` fehlen in der Tiefe).

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Datum & Zufallszahlen**: In einigen Komponenten (z.B. Bestellübersichten) wird die Zeit potenziell clientseitig ohne korrekte `useEffect`-Guards gerendert, was auf dem Server (Next.js 16 SSR) zu Hydration-Fehlern führt.
- **Theme/Media-Queries**: Fehlende Striktheit bei der Auswertung von User-Präferenzen (z.B. fehlende Fallbacks für `prefers-reduced-motion` in dynamischen Kinetik-Komponenten).

## 3. TYPESCRIPT-SCHWÄCHEN & CORE WEB VITALS SÜNDEN
- **Schema.org**: Strukturierte Daten in `src/components/seo/json-ld.tsx` sind möglicherweise nicht lückenlos mit `satisfies Graph` gegen `schema-dts` typisiert, wodurch ungültige Google-Rich-Snippets entstehen könnten.
- **Bilder & LCP**: Hero-Images auf der Startseite (`src/app/(site)/page.tsx`) und Bereichsseiten weisen teilweise keine extrem strikten Aspect-Ratios oder AVIF-Vorzüge auf, was zu minimalem CLS (Cumulative Layout Shift) führt.

## 4. SCHWEIZER AESTHETIK-STANDARDS
- **Chromatische Reinheit**: Bestimmte Schatten werfen harte Hex-Werte statt sanfter OKLCH-Verläufe.
- **Kinetische Disziplin**: Zu viele ungeführte Mikro-Animationen ohne klare Hierarchie ("Signature Interaction").
