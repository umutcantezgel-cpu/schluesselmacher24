# Red-Team Audit Report
## Phase 0: System Analysis & Critique

### 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Mehrere Buttons in der Button-Komponente weisen potenziell leere onClick-Handler in edge cases auf.
- **Befund 2:** Formularkomponenten in `/service-und-termin/anfrage` haben unzureichendes Error-Handling bei fehlender Netzwerkverbindung.

### 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Verwendung von `window.innerWidth` in einigen Client-Komponenten ohne korrekte `useEffect` Guards, was zu Hydration Mismatches führt.
- **Befund 2:** Datums-Formatierungen auf der Client-Seite verwenden teilweise lokale Zeitzonen anstatt der Server-Zeitzone.

### 3. TypeScript-Schwächen
- **Befund 1:** Einige Props-Interfaces in `components/ui` nutzen `any` oder unvollständige Typisierungen für Event-Handler.
- **Befund 2:** Schema.org JSON-LD Objekte sind nicht überall strikt mit `satisfies Graph` gegen `schema-dts` typisiert.

### 4. Core Web Vitals Sünden
- **Befund 1:** Einige Hero-Images weisen keine expliziten Dimensionen oder `priority` Props auf.
- **Befund 2:** Teilweise Ladezeiten-Einbußen durch nicht-optimierte Drittanbieter-Scripte im Footer.

### 5. Schweizer Light Design Doctrine (Visuelle Analyse)
- **Chromatische Reinheit:** Wenige harte Hex-Werte gefunden. Müssen konsequent in OKLCH überführt werden.
- **Typografische Rhythmik:** Teilweise Zeilenumbrüche ohne Orphan-Control bei längeren Headlines.
- **Kinetische Disziplin:** Zu viele überlappende Hover-Animationen auf der Startseite. Fokus auf EINE dominante Signature-Interaktion nötig.
