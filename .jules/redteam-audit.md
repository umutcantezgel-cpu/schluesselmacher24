# RED-TEAM AUDIT BEFUNDE

## 1. Silent Logic Death & Interaktions-Fallen
- Keine expliziten leeren Handler gefunden, aber generelle Interaktions-Latenz auf Routen-Ebene beobachtet.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/app/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`: Unsafe 'window' access outside useEffect.
- `src/app/kasse/kasse-formular.tsx`: Unsafe 'window' access outside useEffect.
- `src/app/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`: Unsafe 'window' access outside useEffect.
- `src/app/admin/vorgaenge/[id]/vorgangs-aktionen.tsx`: Unsafe 'window' access outside useEffect.
- `src/app/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx`: Unsafe 'window' access outside useEffect.
- `src/lib/scheduling.ts`: Unsafe 'window' access outside useEffect.
- `src/lib/client-state.ts`: Unsafe 'window' access outside useEffect.
- `src/lib/flow/use-flow.ts`: Unsafe 'window' access outside useEffect.

## 3. TypeScript-Schwächen
- Typisierungen teilweise zu permissiv; fehlende exhaustive Checks bei as const Maps.

## 4. Core Web Vitals Sünden
- Bild-Optimierung akzeptabel, jedoch fehlendes Preloading für LCP-Hero-Elemente in Layouts.
