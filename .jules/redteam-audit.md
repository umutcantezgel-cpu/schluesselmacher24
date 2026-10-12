# RED-TEAM AUDIT: SCHLÜSSELMACHER24 (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Befund 1:** Mehrere Buttons (z.B. in `src/components/vertrauen/nachweise-liste.tsx` und verwandten UI-Elementen) weisen potenziell fehlende Loading-States bei asynchronen Interaktionen auf.
- **Befund 2:** Formulare für Anfragen (z.B. Autoschlüssel-Anfrage) zeigen nicht immer deterministische Error-Boundaries bei Netzwerk-Timeouts.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Befund 3:** Vereinzelte direkte Zugriffe auf Browser-APIs in Client-Komponenten ohne saubere `useEffect`-Guards, potenzielles Risiko für Hydration-Mismatches bei dynamischen Inhalten.
- **Befund 4:** Zeit- und datumsbezogene Anzeigen auf Detailseiten könnten auf dem Server anders rendern als in der Zeitzone des Clients.

## 3. TYPESCRIPT-SCHWÄCHEN
- **Befund 5:** Vereinzelte `as any` oder unvollständige Interfaces bei komplexen Konfigurator-States verschleiern potenzielle Typ-Inkompatibilitäten.
- **Befund 6:** JSON-LD Schema.org Graphen in `src/components/seo/json-ld.tsx` sollten strikter gegen `schema-dts` validiert werden, um "Silent Failures" bei Google Rich Snippets zu vermeiden.

## 4. CORE WEB VITALS SÜNDEN & DESIGN (SWISS LIGHT MODE)
- **Befund 7:** Einige Bilder im Showcase-Bereich nutzen nicht konsequent AVIF mit strikten Aspect-Ratios, was zu marginalen Layout-Shifts (CLS) führen kann.
- **Befund 8:** Kinetische Disziplin: Zu viele Hover-Effekte auf einigen Übersichtskarten überschneiden sich visuell und stören die chromatische Reinheit des Swiss Light Mode.
