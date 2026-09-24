# Red-Team Audit & Architectural Findings

## 1. Silent Logic Death & Interaktions-Fallen
- **kasse-formular.tsx**: Keine visuelle Rückmeldung während der asynchronen Zahlungsabwicklung. Führt zu potentiellen Mehrfach-Klicks und abgebrochenen Sitzungen.
- **zutritt-konfigurator.tsx**: Der onClick-Handler für die "Zurücksetzen"-Funktion ruft `() => window.scrollTo(...)` auf, löscht aber nicht den lokalen State des Konfigurators.

## 2. Hydration Mismatches & SSR-Konflikte
- **cookie-einstellungen.tsx**: Direkter Zugriff auf `window.localStorage.length` im Render-Pfad, ohne `useEffect` oder Mounting-Guards. Dies provoziert Hydration-Fehler bei SSR.
- **client-state.ts**: Synchroner Lesezugriff auf localStorage außerhalb eines React-Lifecycles, was zu Server-Client-Diskrepanzen führt.

## 3. TypeScript-Schwächen
- **json-ld.tsx**: Fehlende `satisfies Graph` Absicherung, was zu stillen Schema-Typfehlern führen kann, die erst von Google abgemahnt werden.
- **scheduling.ts**: Mögliche Any-Typisierungen bei der Verarbeitung verschachtelter Zeitfenster-Objekte.

## 4. Core Web Vitals Sünden
- **image-placeholder.tsx**: Bilder werden ohne harte Breite/Höhe-Attribute (bzw. Aspect-Ratio) geladen, was zu Cumulative Layout Shifts (CLS) führt.
- Generell: Verzögerter LCP durch fehlendes Preloading von kritischen SVG-Assets und Webfonts in den Head-Metadaten.
