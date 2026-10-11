# Gnadenloser Red-Team Audit des Ist-Zustands

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Die `Button` und `ButtonLink` Komponenten in `src/components/ui/button.tsx` nutzen zwar `loading` states, aber einige Formulare in den Anfrage-Routen (`app/(site)/autoschluessel/anfrage/page.tsx`) zeigen keine Fehler-Zustände bei fehlschlagenden Netzwerkanfragen. Es fehlt oft eine globale Error-Boundary für die Server Actions.
- **Befund 2:** Im Site-Header (`src/components/layout/site-header.tsx`) führt das mobile Menü potenziell zu Layout-Shifts, wenn der State `drawerOpen` toggelt und der Body-Scroll nicht gesperrt ist.
- **Befund 3:** Leere Zustände (Empty States) für dynamische Listen (wie Warenkorb oder Konfigurator) sind unzureichend animiert oder fallen auf leere weiße Blöcke zurück.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Eventuelle Zeitstempel in Artikeln oder Bestelldaten können bei Hydration zu Konflikten führen, wenn keine UTC/Local-Abstraktion (z.B. `suppressHydrationWarning` oder useEffect-Guards) genutzt wird.
- **Befund 2:** Die `motion-style.ts` oder In-View-Animationen neigen dazu, vor dem vollständigen Hydrieren Flackern (FOUC - Flash of Unstyled Content) zu verursachen, wenn Initialzustände im Server-Render nicht perfekt mit dem ersten Client-Render übereinstimmen.

## 3. TypeScript-Schwächen
- **Befund 1:** Es gibt vereinzelt explizite casts oder komplexe `any`/`unknown` Typisierungen bei den Formular-Handlern.
- **Befund 2:** Schema.org JSON-LD Objekte (in `src/components/seo/json-ld.tsx`) müssen strenger gegen `schema-dts` typisiert werden, um Silent Failures in der Google Search Console zu vermeiden.

## 4. Core Web Vitals Sünden
- **Befund 1:** LCP (Largest Contentful Paint) auf der Startseite kann durch große Hero-Bilder ohne explizite `priority` oder fehlerhaftem `sizes` Attribut leiden.
- **Befund 2:** Zuviele DOM-Knoten im Desktop-Dropdown-Menü, die direkt initial gerendert werden, anstatt sie on-demand oder gestreamt zu laden.

## 5. Design-Kritik nach Schweizer Aesthetik-Standards
- **Chromatische Reinheit:** Vereinzelt unsaubere Grautöne anstelle von konsequenten OKLCH-Tokens.
- **Typografische Rhythmik:** Mangelnde Kontrolle über Orphans/Widows in längeren Fließtexten (z.B. Ratgeber).
- **Kinetische Disziplin:** Einige Hover-Effekte an Buttons kollidieren visuell mit den In-View Animations der umgebenden Container.
