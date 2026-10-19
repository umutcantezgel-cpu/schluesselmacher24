# RED-TEAM AUDIT

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefunden in `app/(site)/schluessel-nach-code/page.tsx`: Leerer onSubmit-Handler in einem Kontaktformular-Draft.
- `app/(site)/autoschluessel/page.tsx` enthält leere `<button onClick={() => {}}>` Elemente für geplante Features.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- In `components/layout/header.tsx` wird `window.innerWidth` ohne Mounting-Guard im Render-Pfad verwendet.
- `app/(site)/page.tsx` nutzt unsichere Zufallszahlen-Generierung auf Client-Seite für Animationen.

## 3. TYPESCRIPT-SCHWÄCHEN
- `app/(site)/tuer-und-schliesstechnik/page.tsx`: Verwendung von `as unknown as any` statt sauberen Typen.
- `components/seo/json-ld.tsx` nutzt kein `satisfies Graph` für strukturierte Daten.

## 4. CORE WEB VITALS SÜNDEN
- `app/(site)/page.tsx`: Hero-Bild hat keine expliziten Dimensionen.
- `app/(site)/sicherheitstechnik/page.tsx`: Lädt schwere Framer-Motion Bibliothek unnötig im Init-Load.

## DESIGN-KRITIK NACH SCHWEIZER AESTHETIK-STANDARDS
- Verschiedene `oklch` Werte sind inkonsistent mit der Basis `oklch(0.988 0.002 260)`.
- Typografie-Rhythmik: Überschriften in `app/(site)/ratgeber/page.tsx` haben Widows bei mobilen Auflösungen.
