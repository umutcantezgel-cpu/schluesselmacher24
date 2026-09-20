# RED-TEAM AUDIT REPORT
## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefunden: onClick-Handler in `src/components/ui/button.tsx`, die bei fehlenden Props ins Leere laufen.
- Gefunden: Formulare in `src/app/service-und-termin/page.tsx`, die bei Netzwerkfehlern keinen sauberen Error-State zeigen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Gefunden: `window.innerWidth` Zugriffe in `src/components/layout/mobile-action-bar.tsx` ohne sauberen useEffect-Guard.

## 3. TYPESCRIPT-SCHWÄCHEN
- Gefunden: Maskierte Typen und fehlende Schema.org Absicherung auf der `src/app/page.tsx`.

## 4. CORE WEB VITALS SÜNDEN & AESTHETIK-BRÜCHE
- Gefunden: Bilder in `src/components/ui/image-placeholder.tsx` fehlen teilweise explizite Dimensionen.
- Gefunden: Nicht alle Schatten entsprechen der OKLCH-Vorgabe, vereinzelt zu harte Hex-Werte.
