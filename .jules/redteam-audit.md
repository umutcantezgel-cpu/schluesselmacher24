# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Fehlende Fallback-States für Formulare in `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx`. Es gibt keine sichtbaren Lade-Indikatoren bei asynchronen Netzwerkaufrufen, was zu "Ghost Interactions" führt.
- **Befund 2:** In `src/components/calculator/service-einsatz-rechner.tsx` werden leere State-Updates bei Klick-Events teilweise nicht abgefangen, was "Silent Failures" beim Rechnen verursachen kann.
- **Befund 3:** `src/app/(site)/warenkorb/warenkorb-ansicht.tsx` weist bedingtes Rendering auf, bei dem leere Warenkörbe potenziell unerwartete Layout-Löcher ("Layout-Jumps") erzeugen, da kein definierter Empty-State die volle Höhe einnimmt.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Mögliche Datums-Formatierungs-Diskrepanzen in `src/components/autoschluessel/termin-auswahl.tsx`. Lokale Zeititzonen-Berechnungen können auf dem Server und Client unterschiedlich rendern, wenn nicht streng in einen `useEffect` verpackt.
- **Befund 2:** Direkter Zugriff auf Window-Objekte bei bestimmten Animations-Triggern (wie `src/components/visual/motion/in-view.tsx`), was Hydration-Fehler verursachen kann, wenn SSR-Guards fehlen.

## 3. TypeScript-Schwächen
- **Befund 1:** Die Verwendung von `as unknown as` in `src/lib/data/payload-mapping.ts`, `src/lib/server/kundendateien.ts`, `src/lib/server/rate-limit.ts` und Testdateien verdeckt echte Typfehler und umgeht die strengen TypeScript-Checks.
- **Befund 2:** Unzureichende Schema.org Validierung. Es fehlt die explizite Absicherung der Graph-Struktur gegen `schema-dts` mit `satisfies Graph`.

## 4. Core Web Vitals Sünden
- **Befund 1:** Massiver Verstoß gegen Cumulative Layout Shift (CLS) in zahlreichen Routen (z.B. `src/app/(site)/artikel/[slug]/page.tsx`, `src/app/(site)/autoschluessel/page.tsx`, `src/app/(site)/page.tsx`). Die `<Image>`-Komponenten weisen keine expliziten Breiten-/Höhen-Attribute auf und nutzen kein `fill`, was beim Laden Layout-Verschiebungen provoziert.
- **Befund 2:** Fehlende Container Queries in den Bento-Grids, was zu Performance-Einbußen durch teure JavaScript-Resize-Listener führen könnte.

## 5. Design-Kritik nach Schweizer Aesthetik-Standards
- **Befund 1:** Chromatische Reinheit: Hardcodierte Hex-Werte und HSL-Farben in `tailwind.config.ts` und diversen CSS-Dateien verstoßen gegen die strikte OKLCH-Vorgabe (z.B. Canvas `oklch(0.988 0.002 260)`).
- **Befund 2:** Kinetische Disziplin: Zu viele unkoordinierte Scroll-Animationen überlagern sich, anstatt einer singulären, dominierenden Signature-Interaktion pro Route.
