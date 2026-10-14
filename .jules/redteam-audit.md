# Red-Team Audit Report
## Date: {now_iso}

### 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefunden: Leere onClick-Handler in `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx` beim Absenden des Kontaktformulars, die ohne Ladezustände verbleiben.
- Gefunden: Fehlende Fehlerzustände bei Netzwerkabbrüchen im Warenkorb (`src/app/(site)/warenkorb/page.tsx`).
- Gefunden: Bedingtes Rendering für leere Artikel-Listen in `src/app/(site)/artikel/page.tsx`, was zu Layout-Löchern (Whitespace) führt.

### 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Gefunden: Direkter Zugriff auf `window.innerWidth` in Header-Komponenten ohne `useEffect` führt zu Hydration Warnings in Next.js.
- Gefunden: Datumsformatierungen in Blog-Artikeln (`src/app/(site)/artikel/[slug]/page.tsx`), die ohne fixe Locale/Zeitzone zu Mismatches zwischen Server (UTC) und Client führen.

### 3. TYPESCRIPT-SCHWÄCHEN
- Gefunden: Mehrfache Nutzung von `as unknown as Type` in Payload-CMS API Responsen (`src/app/(payload)/admin/[[...segments]]/page.tsx`).
- Gefunden: Schema.org Graphen in `layout.tsx` sind nicht strikt mit `satisfies Graph` gegen `schema-dts` typisiert.

### 4. CORE WEB VITALS SÜNDEN
- Gefunden: Heldengrafiken auf der Startseite (`src/app/(site)/page.tsx`) fehlen teilweise explizite `width` und `height` Attribute, was CLS (Cumulative Layout Shift) provoziert.
- Gefunden: Unnötiges Client-Side-Rendering von schwergewichtigen Markdown-Parsern statt Server-Side-Rendern.

## Visuelle Konsistenz (Schweizer Aesthetik)
- Chromatische Reinheit: Einige hartcodierte Hex-Werte (`#333333`) statt OKLCH-Tokens gefunden.
- Kinetische Disziplin: Zu viele Hover-Effekte auf der Startseite überlagern sich und stören den minimalistischen Fokus.
