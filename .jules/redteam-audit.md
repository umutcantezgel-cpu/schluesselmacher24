# RED-TEAM AUDIT & SILENT LOGIC DEATH PROTOKOLL (PHASE 0)

## 1. Silent Logic Death & Interaktions-Fallen
- In verschiedenen Komponenten (wie `autoschluessel/anfrage/assistent.tsx` oder `kasse/kasse-formular.tsx`) fehlen detaillierte Ladezustände oder Error-Boundaries bei Netzwerk-Requests.
- `onClick` oder Formular-Handler nutzen teilweise Dummy-Callbacks, die nicht auf fehlschlagende Mutations-Status von Server Actions reagieren.
- Fehlende Empty-States bei Warenkörben oder dynamischen Listen (z.B. Suchergebnisse).

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Komponenten greifen ungeschützt auf `window` oder `localStorage` zu, ohne dies sauber mit `useEffect` zu kapseln oder in reinen Client-Components auszuführen.
- Dynamisch gerenderte Daten wie Zufalls-Testimonials oder Timestamps produzieren auf Server und Client abweichendes Markup, was zu Hydration-Fehlern führt.

## 3. Core Web Vitals & Performance-Lecks
- LCP (Largest Contentful Paint) wird durch unzureichend optimierte Hero-Images oder fehlende Priority-Flags in `next/image` verzögert.
- CLS (Cumulative Layout Shift) tritt auf, wenn asynchrone Daten (z.B. aus Suspense-Boundaries) geladen werden, ohne dass Fallbacks (Skeletons) die korrekten Dimensionen vorab reservieren.

## 4. Visuelle Konsistenz (Swiss Light Mode Doctrine)
- Die OKLCH-Farbräume werden nicht konsequent angewandt; vereinzelte Hex-Werte oder unsaubere Grautöne brechen das AAA-Kontrast-Versprechen.
- Die Typografie (Widows/Orphans) und Abstände (Spacings in Grids) sind teils inkonsistent.
- Hover-Effekte auf Cards und Buttons sind nicht einheitlich durch Kinetik-Dämpfung (Feder-Animationen) abgerundet.
