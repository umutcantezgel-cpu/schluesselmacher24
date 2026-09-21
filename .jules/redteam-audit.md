# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaction Traps
- **Empty Handlers:** Found potential dead ends in `src/components/forms/controls.tsx` wo dummy-Funktionen ohne visuelle Hinweise genutzt werden.
- **Form State Mismatches:** Submit-Buttons im Anfrageflow (`src/app/autoschluessel/anfrage/page.tsx`) verlassen sich rein auf Client-seitiges JS, anstatt Server Actions mit progressive enhancement zu nutzen.
- **Missing Loading States:** Bestimmte Nested Client Components nutzen React 19 `useActionState` nicht, was zu UI-Freezes während Netzwerkanfragen führt.

## 2. Hydration Mismatches & SSR Conflicts
- **Date/Time Rendering:** Potentieller Hydration-Mismatch in `src/app/service-und-termin/page.tsx`, da dort lokale Zeit verarbeitet wird, ohne stricte Client-Boundary.
- **Third-Party Injections:** DOM-Zugriffe in Helfer-Funktionen, die nicht sauber hinter `useEffect` Guards isoliert sind.

## 3. TypeScript Weaknesses
- **Generic Catch-Alls:** Diverse Input-Payloads haben keine strikte Zod-Inferenz und fallen auf laxere Typsignaturen zurück.
- **Schema.org Graphs:** Der JSON-LD Provider (`src/components/seo/json-ld.tsx`) benötigt striktes Typing mit `satisfies Graph` via schema-dts.

## 4. Core Web Vitals Sins
- **LCP Delays:** Die Hauptbilder in `src/app/page.tsx` sind nicht präzise dimensioniert und triggern leichte Layout-Shifts.
- **Subgrid Misalignment:** Das Bento-Grid nutzt kein `grid-rows-subgrid`, was zu asymmetrischen Button-Höhen in der Service-Übersicht führt.
- **Client Bundle Bloat:** Unnötiger Client-State in Komponenten, die statisch als Server-Components via `use cache` memoisiert werden könnten.
