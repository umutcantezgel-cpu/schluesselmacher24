# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/flow/flow-shell.tsx`: Leere onClick Handler bei Abbruchbedingungen identifiziert, die Nutzer im Flow blockieren könnten.
- `src/components/vertrauen/nachweise-liste.tsx`: Fehlerhafte Loading-States bei verzögertem Rendering der Nachweise. Kein sichtbarer Indikator bei Netzwerkverzögerungen.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/visual/einsatzradius.tsx`: Zugriff auf `window.innerWidth` ohne Mounting-Guard gefunden, was zu Hydration Mismatches führt.
- `src/components/schliessanlagen/system-erklaerung.tsx`: Zufällige Seed-Generierung im Render-Pfad für Key-IDs, muss in `useEffect` verlagert werden.

## 3. TypeScript-Schwächen
- `src/app/(site)/sicherheitstechnik/page.tsx`: Verwendung von `as unknown as Type` beim Parsen von URL-Parametern maskiert echte Fehler.
- `src/components/seo/json-ld.tsx`: Schema.org-Graph wird nicht strikt mit `satisfies Graph` gegen `schema-dts` validiert, was zu stillen Schema-Fehlern führen kann.

## 4. Core Web Vitals Sünden
- `src/components/visual/glyphen/gebaeude.tsx`: Fehlende explizite viewBox oder Dimensionsangaben, was zu leichten Layout-Shifts beim initialen Render führt.
- `src/app/(site)/page.tsx`: Suboptimale Lade-Reihenfolge von schweren Client-Komponenten, die zu lange den Main-Thread blockieren.

## Fazit
Die Schweizer Light Mode Marken-DNA ist im Kern vorhanden, aber subtile technische Schulden in der Interaktionslogik und SSR-Hydration mindern die Awwwards-Qualität. Strenge OKLCH-Kontrollen und 1px-Kanten müssen konsequenter durchgesetzt werden.
