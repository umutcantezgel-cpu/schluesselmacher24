
# RED-TEAM AUDIT

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefunden: Einige Formular-Elemente haben keine Fehler-States definiert.
- Leere Callbacks in einigen interaktiven Elementen.
- Fehlende Lade-Indikatoren in Flow-Komponenten bei Übergängen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Gefunden: Zeitstempel-Generierung im Client ohne useEffect.
- Einige Komponenten rendern initial unterschiedlich basierend auf localStorage.

## 3. TYPESCRIPT-SCHWÄCHEN
- Gefunden: Verwendung von `any` oder unvollständigen Typen in einigen Generatoren.
- Schema.org JSON-LD Komponenten sind nicht vollständig gegen `schema-dts` abgesichert.

## 4. CORE WEB VITALS SÜNDEN
- Gefunden: ImagePlaceholder hat manchmal keine festen Dimensionen.
- LCP auf der Startseite kann durch Priorisierung des Hero-Bereichs verbessert werden.

## SCHWEIZER LIGHT MODE AESTHETIK-CHECK
- Visuelle Konsistenz ist weitgehend gegeben, aber einige Animationen sind nicht optimal gedämpft (fehlende kubische Bezier-Kurven für Feder-Physik).
- Subgrid-Ausrichtung in Bento-Grids (Feature-Karten) fehlt teilweise.
