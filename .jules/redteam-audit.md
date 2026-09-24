# RED-TEAM ARCHITECTURAL AUDIT & VULNERABILITY REPORT
## STATUS: GNADENLOS | DATE: 2024-10-27

### 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Befund:** In diversen Formularen (z.B. in `src/app/autoschluessel/anfrage/assistent.tsx`) gibt es Fallbacks, die onClick-Handler mit leeren Funktionen `() => {}` oder nicht-reaktiven States aufrufen, wodurch das System auf Benutzereingaben scheinbar "tot" reagiert. Buttons ohne echtes Event-Handling fangen Klicks ab und lassen den Nutzer im Ungewissen.
- **Befund:** Fehlende Ladezustände (`useFormStatus` / `useTransition`) bei Next.js Server Actions führen dazu, dass Nutzer bei langsamen Netzwerkverbindungen ungeduldig mehrfach klicken.

### 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Befund:** Direkte Zugriffe auf das `window`-Objekt und `localStorage` in einigen Legacy-Komponenten (versteckt in tiefen Component-Trees) ohne adäquate `useEffect`-Guards, die zu Hydration Errors führen.
- **Befund:** Inkonsistente Datumsformatierungen, die serverseitig in UTC und clientseitig lokal formatiert werden, provozieren React Hydration Errors im Produktionsmodus.

### 3. TYPESCRIPT-SCHWÄCHEN & TYP-MASKEN
- **Befund:** Exzessive Nutzung von `as unknown as Type`, um TypeScript-Fehler zum Schweigen zu bringen, anstatt saubere Interfaces oder Type Guards zu schreiben.
- **Befund:** Schema.org JSON-LD Objekte sind teilweise als `any` typisiert (z.B. in SEO-Komponenten), anstatt rigoros gegen `schema-dts` mit `satisfies Graph` abgesichert zu sein.
- **Befund:** Promise-Auflösungen in Next.js 15+ App Router für `params` und `searchParams` sind teilweise inkonsistent implementiert und führen zu versteckten Runtime-Gefahren.

### 4. CORE WEB VITALS SÜNDEN & PERFORMANCE
- **Befund:** Hero-Images und Produktbilder ohne explizite Dimensionen (width/height) oder festgelegte Aspect Ratios führen zu drastischen Cumulative Layout Shifts (CLS) beim Laden der Seite.
- **Befund:** Überflüssige Drittanbieter-Scripte blockieren den Main Thread auf kritischen Conversion-Seiten und verschlechtern die Time-to-Interactive (TTI) maßgeblich.

## KONSENSUS & SCHWEIZER LIGHT MODE ABGLEICH
Die auditierte Applikation weist strukturelle Defizite auf, die der Schweizer Light Mode Doktrin widersprechen. Die kinetische Disziplin ist ausbaufähig, und semantische Tiefe fehlt auf vielen Seiten. Kontraste und Schatten müssen weiter nachgeschärft werden (OKLCH).
