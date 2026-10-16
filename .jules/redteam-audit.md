# Red-Team Audit Report
## Silent Logic Death & Interaktions-Fallen
- `src/app/(site)/autoschluessel/page.tsx`: Die onClick Handler für die Marken-Auswahlkarten haben leere Arrow-Functions `() => {}` anstelle der korrekten Router-Navigation.
- `src/components/forms/photo-upload.tsx`: Fehlender Ladezustand bei Bild-Uploads; bei langsamen Verbindungen bleibt das UI stumm und friert scheinbar ein.
- `src/app/(site)/service-und-termin/anfrage/page.tsx`: Das Kontaktformular fängt Netzwerkfehler nicht ab, was in "Silent Logic Death" resultiert, wenn die API 500 wirft.

## Hydration Mismatches & SSR-Konflikte
- `src/components/layout/mobile-action-bar.tsx`: Direkter Zugriff auf `window.innerWidth` während des initialen Renders ohne `useEffect`, was Hydration-Mismatches zwischen Server und Client erzeugt.
- `src/components/layout/site-header.tsx`: Nutzung von `localStorage.getItem('theme')` im Haupt-Renderpfad, was serverseitiges Rendering unmöglich macht.

## TypeScript-Schwächen
- `src/components/calculator/service-einsatz-rechner.tsx`: Maskierte Typfehler durch `as unknown as SelectedOptions`, was Type-Safety umgeht.
- `src/components/seo/json-ld.tsx`: Schema.org-Graphen werden nicht hart gegen `schema-dts` mit `satisfies Graph` validiert, sondern als loses Record deklariert.

## Core Web Vitals Sünden
- `src/components/autoschluessel/key-kinds.tsx`: Hero-Bilder haben keine expliziten Dimensionen (`width` / `height`), was Cumulative Layout Shift (CLS) provoziert.
- `src/components/visual/motion/check-draw.tsx`: Schwere Lottie/Framer Motion-Importe in Client-Komponenten ohne dynamische `next/dynamic` Lazy-Loading-Boundary.

## Swiss Light Design Doctrine
- Chromatische Reinheit: Harte Hex-Werte (`#ffffff`) anstatt sauberer OKLCH-Tokens (`oklch(0.988 0.002 260)`) in `src/components/ui/card.tsx` gefunden.
- Typografische Rhythmik: Headlines in `src/app/(site)/sicherheitstechnik/page.tsx` haben kein negatives Tracking, was bei großen Font-Weights unelegant wirkt.
- Kinetische Disziplin: Zu viele Hover-Effekte gleichzeitig in `src/components/flow/flow-shell.tsx`. Reduktion auf EINE Signature-Interaktion gefordert.
