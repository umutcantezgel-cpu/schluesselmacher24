# RED-TEAM AUDIT REPORT

## 1. Silent Logic Death & Interaktions-Fallen
Es wurden mehrere leere onClick-Handler und unfertige Interaktionen in UI-Komponenten entdeckt:
- `src/components/ui/accordion.tsx`: Mögliche Probleme mit unzureichenden Tastatur-Events, obwohl `onClick` verhanden ist, fehlen oft native `<summary>` Vorteile.
- `src/components/forms/controls.tsx` und `src/components/forms/photo-upload.tsx`: Teilweise stummes Scheitern ohne echtes Fehler-Reporting bei ungültigen Inputs.
- `src/components/layout/site-header.tsx`: Potentielle Silent Logic bei komplexem Fokus-Management im Drawer-Menü (Focus Traps die leere Hooks auslösen).

## 2. Hydration Mismatches & SSR-Konflikte
- `src/lib/client-state.ts` und `src/lib/flow/use-flow.ts`: localStorage-Zugriffe die potenziell Mismatches zwischen Server-Rendered HTML und Client-State verursachen, wenn Mount-Guards (`useHydrated`) nicht strikt überall genutzt werden.
- Datumsformatierungen und UUID-Generierungen in den Forms (z.B. in `anfrage-formular.tsx`) riskieren Server/Client-Divergenz.

## 3. TypeScript-Schwächen
- Typ-Schwächen und potenziell maskierte Errors in den Payload-Mappings (`src/lib/data/payload-mapping.ts`), wo mit `as any` oder unvollständigen Typ-Casts gearbeitet wird.
- Rate-Limiting Logik (`src/lib/server/rate-limit.ts`) verlässt sich auf implizite Typen.

## 4. Visuelle & Kinetische Sünden (Swiss Light Mode Verletzungen)
- Keine strikte Durchsetzung von `oklch` in einigen Legacy-Komponenten.
- Unruhige Hover-States ohne saubere Federdämpfung (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Subgrid-Potential wird nicht genutzt, was zu unsauberen Ausrichtungen bei variierenden Textlängen in Grids führt.

Dieser Audit bestätigt den Handlungsbedarf für das ZERO-NEW-ROUTES Refactoring.
