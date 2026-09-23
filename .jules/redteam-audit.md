# Red-Team Audit Report
## Architektur und Design Audit Findings

### 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Mehrere Formulare (z.B. in `src/app/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`) verbergen teilweise noch rudimentäre oder fehlende Ladezustände bei langsamen Verbindungen (Silent Loading Death). Die Nutzung von modernem React 19 `useActionState` und `useOptimistic` ist noch nicht flächendeckend.
- **Befund 2:** Bedingte Renderings für leere Arrays, besonders in dynamischen Listen (z.B. Standortauswahl), verursachen potentielle Layout-Shifts (Layout-Löcher), wenn keine Fallback-UI eingebaut ist.
- **Befund 3:** Vereinzelte `onClick`-Handler in UI-Komponenten rufen noch unvollständige Funktionen auf, anstatt die volle Tiefe einer interaktiven Benutzerführung abzubilden.

### 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Einige Datumsangaben oder dynamische Berechnungen könnten auf Server und Client unterschiedlich bewertet werden, falls nicht konsequent auf Server Components oder strikte Hydration-Guards zurückgegriffen wird.
- **Befund 2:** Potenzielle Zugriffe auf `window` bei frühen Resize-Abfragen in Layout-Shells (z.B. Flow-Shell), falls die Execution nicht in einem `useEffect` gekapselt ist.

### 3. TypeScript Schwächen
- **Befund 1:** Es besteht die Gefahr maskierter Typfehler durch fehlende Generics, insbesondere wenn Formulardaten in Server Actions nicht vollständig via Zod getypt sind.
- **Befund 2:** Schema.org JSON-LD Objekte (z.B. `src/components/seo/json-ld.tsx`) müssen strenger validiert werden. Das Casting via `as any` oder implizite `any`s darf nicht geduldet werden; stattdessen ist `satisfies Graph` gegen `schema-dts` verpflichtend, um strukturelle Integrität zu gewährleisten.

### 4. Core Web Vitals Sünden
- **Befund 1:** Fehlende strikte Dimensionierung (`width` und `height` auf `next/image` in Hero-Sections) oder fehlendes Preloading kritischer AVIF-Bilder könnte zu LCP-Degradierung führen.
- **Befund 2:** Das Fehlen konsequenter `contain`-Eigenschaften und CSS-Subgrids bei komplexen Bento-Layouts provoziert unnötige Reflows während der Ladephase.

### 5. Schweizer Light Mode Doktrin Verstöße
- **Chromatische Reinheit:** Keine Verstöße entdeckt; das System hält sich vorbildlich an die OKLCH-Basis. Dennoch müssen Schatten noch seidenweicher über CSS-Variablen reguliert werden.
- **Typografische Rhythmik:** Teilweise fehlen negative Tracking-Werte bei den Haupt-Headlines (H1/H2) für einen maximal kompakten Schweizer Look. Zeilenumbruch-Balancing (`text-wrap: balance`) ist noch nicht überall aktiv.
- **Kinetische Disziplin:** Die Animationen sind teilweise noch nicht auf eine dominante Signature-Interaktion pro Route reduziert.
