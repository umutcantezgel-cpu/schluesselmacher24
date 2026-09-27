# Philosophischer Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** In `src/components/visual/generators/schliessplan.tsx` wurden Button-Elemente identifiziert, deren `onClick` Handler nicht vollständig verdrahtet sind oder bei Fehlern nur stumm `console.warn` ausgeben.
- **Befund 2:** Das Kontaktformular in `src/app/(site)/service-und-termin/anfrage/page.tsx` nutzt React 19 Features, aber zeigt bei Netzwerkverzögerungen keinen adäquaten pending-State in den Submit-Buttons an.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Die Komponente `src/components/visual/registry.tsx` berechnet dynamische Styles basierend auf Breakpoints, die ohne strikte Hydration-Guards (z.B. useEffect) im Initial-Render aufgerufen werden könnten, was zu FOUC (Flash of Unstyled Content) führt.
- **Befund 2:** Datumsformate in `src/components/vertrauen/nachweise-liste.tsx` sind anfällig für Server-Client Zeitzonen-Mismatches.

## 3. TypeScript-Schwächen
- **Befund 1:** In der Payload-CMS Konfiguration (`src/lib/data/payload.ts`) werden teilweise schwache Typisierungen verwendet, die durch `as unknown as Type` maskiert sind, was das Vertrauen in die End-to-End Type-Safety mindert.
- **Befund 2:** Schema.org JSON-LD Objekte in `src/components/seo/json-ld.tsx` validieren zwar grundlegend, verzichten aber auf strikte `satisfies Graph` Checks gegen `schema-dts`.

## 4. Core Web Vitals Sünden
- **Befund 1:** Mehrere Hero-Icons (z.B. in `src/components/visual/icons/`) besitzen keine fixen `width`/`height` Attribute, was das Risiko für Layout Shifts (CLS) bei langsamerem CSS-Parsing erhöht.
- **Befund 2:** Die Verwendung von Framer-Motion in `src/components/visual/motion/` ist stellenweise zu aggressiv in Initial-Bundles geladen, was die Total Blocking Time (TBT) auf mobilen Geräten beeinträchtigen kann.
