# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- In `src/lib/client-state.ts` haben wir ein `return () => {};` entdeckt, welches als Fallback dient. Dies ist eine potentielle Interaktions-Falle, wenn Lifecycle-Methoden nicht richtig bereinigt werden.
- In diversen Formularen (z.B. `src/app/kasse/kasse-formular.tsx`, `src/app/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`) finden sich fehlende oder spärlich behandelte Ladezustände bei komplexen asynchronen Interaktionen, die als "stumm" wahrgenommen werden könnten.
- Bestimmte Buttons (z.B. in `src/app/admin/vorgaenge/[id]/vorgangs-aktionen.tsx`) nutzen `onClick={() => window.print()}`, was ohne visuelles Feedback (z.B. Loading-State) den User hängen lassen kann.

## 2. Hydration Mismatches & SSR-Konflikte
- Mehrere direkte Aufrufe von `window` und `window.localStorage` (z.B. `cookie-einstellungen.tsx`, `zutritt-konfigurator.tsx`, `vorgangs-aktionen.tsx`) außerhalb von sauberen `useEffect` Hooks oder ohne `typeof window !== 'undefined'` Checks. Dies provoziert unvermeidbare React 19 Hydration Mismatches beim serverseitigen Rendering (SSR).
- Die Client-Status-Verwaltung greift synchron auf `window.localStorage.getItem` zu. Das verursacht Unterschiede zwischen dem vom Server gesendeten HTML und der Client-Version.

## 3. TypeScript-Schwächen
- Auch wenn explizite `as any` oder `as unknown` Casts fehlen, wird TypeScript oftmals durch implizite `any` Typen untergraben.
- Schema.org Graphen in `json-ld.tsx` scheinen mit `satisfies Graph` gesichert zu sein, aber oft sind die übergebenen Datenstrukturen nicht hundertprozentig präzise nach Typ-Vorgabe aufgebaut, wodurch Maskierungen auftreten.

## 4. Core Web Vitals Sünden
- Einige Bilder und Ladeanimationen weisen keine expliziten Dimensionen oder saubere Aspect-Ratios auf, was Cumulative Layout Shift (CLS) erhöht.
- Fehlen von `use cache` bei rechenintensiven Datenbank-Abfragen.

## Fazit
Die Schweizer Design-Doktrin wird strukturell respektiert, aber in den Bereichen interaktive Robustheit, Server/Client-Trennung (Hydration) und Performance-Optimierung existieren kritische Schwachstellen, die wir im 100-Ideen Matrix-Prozess gezielt angreifen werden.
