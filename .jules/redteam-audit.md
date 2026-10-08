# Red-Team Audit Report
## Befunde (Phase 0)
1. **Silent Logic Death & Interaktions-Fallen:**
   - In einigen Formularen (z.B. Service-Anfragen) fehlt der explizite Ladezustand für langsame Verbindungen.
   - Es wurden vereinzelt onClick-Handler in tiefen UI-Komponenten entdeckt, die leere Funktionen übergeben.
   - Bedingtes Rendering von leeren Arrays hinterlässt Layout-Löcher auf den Konfigurator-Seiten.

2. **Hydration Mismatches & SSR-Konflikte:**
   - Date-Formatierungen auf der Client-Seite weichen ab, da Zeitzonen im SSR nicht explizit auf Europe/Berlin gepinnt sind.
   - Zugriffe auf localStorage ohne Mounting-Guards im Render-Pfad der Rechner-Bausteine.

3. **TypeScript-Schwächen:**
   - Fehlende Interfaces bei einigen Formular-Komponenten (maskierte Typfehler durch `any`).
   - Schema.org-Graphen sind nicht durchgehend mit `satisfies Graph` gegen `schema-dts` abgesichert.

4. **Core Web Vitals Sünden:**
   - Bilder in der Schließanlagen-Sektion haben teilweise keine expliziten Dimensionen.
   - Layout-Shifts durch fehlende Aspect-Ratios (aspect-[x/y]) bei Placeholder-Images.

## Visuelle Konsistenz nach Schweizer Aesthetik-Standards
1. **Chromatische Reinheit:**
   - Einige Grautöne sind nicht vollständig auf OKLCH umgestellt und weisen Verunreinigungen auf.
   - Der Basis-Canvas muss strikt auf oklch(0.988 0.002 260) verbleiben.
2. **Typografische Rhythmik:**
   - Unausgewogene Zeilenumbrüche (Widows/Orphans) in den langen Fließtexten auf der Ratgeber-Seite.
3. **Kinetische Disziplin:**
   - Mehrere Animationen auf der Startseite laufen gleichzeitig. Forderung: Rückbau auf exakt EINE dominante Signature-Interaktion pro Route.
