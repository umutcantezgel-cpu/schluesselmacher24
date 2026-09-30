# Red-Team Audit Report

## Befunde (Phase 0)

1. **Silent Logic Death & Interaktions-Fallen**:
   - Die Anwendung scheint einige Komponenten (z. B. in `src/components/forms/`) zu haben, die potenziell auf clientseitigen State angewiesen sind, aber die Next.js App Router Paradigmen (Server Actions) noch nicht überall konsequent nutzen.
   - Event-Handler für Formulardaten (Kasse, Bestellung) bedürfen einer strengen Prüfung auf `onSubmit`-Leichen, die nur `console.log` oder leere Fallbacks enthalten.

2. **Hydration Mismatches & SSR-Konflikte**:
   - Keine gravierenden Fehler sofort sichtbar, aber die Verwendung von `window` in bestimmten Rechner- oder Visualisierungskomponenten (wie `calculator`) könnte Hydrationsprobleme verursachen, wenn sie nicht mit `useEffect` geschützt sind.

3. **Core Web Vitals & TypeScript-Schwächen**:
   - Es muss sichergestellt werden, dass große Bilder (z.B. in `src/components/ui/`) explizite Dimensionen haben.
   - Typisierung in Formularen und API-Routen könnte noch stricte `satisfies`-Checks für Schema.org oder Datenbankmodelle vertragen.

## Fazit
Die bestehende Struktur ist solide, aber es gibt erhebliches Potenzial, die Interaktivität (Kinetik) und die semantische Tiefe der Seiten (Content Maximierung) zu verbessern, ohne neue Routen zu erfinden.
