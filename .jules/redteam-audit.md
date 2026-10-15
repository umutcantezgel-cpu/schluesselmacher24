# RED TEAM AUDIT

## SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- `app/(site)/autoschluessel/page.tsx`: Die `onClick` Handler für die Schlüssel-Konfiguration rufen teilweise leere Funktionen auf (`() => {}`), was zu Silent Logic Death führt.
- `app/(site)/schliessanlagen/konfigurator/page.tsx`: Fehlende Ladezustände beim Absenden des Konfigurators. Bei Netzwerkfehlern bleibt das UI stumm und friert ein.
- `components/ui/accordion.tsx`: Bei leeren Inhalts-Arrays im Accordion entstehen Layout-Löcher anstatt sinnvoller Fallbacks.

## HYDRATION MISMATCHES & SSR-KONFLIKTE
- `components/autoschluessel/termin-auswahl.tsx`: Datumsobjekte werden serverseitig in der falschen Zeitzone generiert und weichen beim Client-Mounting ab, was zu Hydration Mismatches führt.
- `app/(site)/layout.tsx`: Unzureichende Guards für `localStorage` Zugriffe im Header führen zu potentiellen SSR Konflikten.

## TYPESCRIPT-SCHWÄCHEN
- `components/seo/json-ld.tsx`: Der Schema.org Graph nutzt `as unknown as any` statt explizit gegen `schema-dts` mit dem `satisfies` Operator validiert zu werden.
- `components/forms/field.tsx`: Maskierte Typfehler bei den Event Handlern durch unvollständige Interfaces, was Runtime-Errors provoziert.

## CORE WEB VITALS SÜNDEN
- `components/autoschluessel/hero.tsx`: Helden-Bilder haben keine expliziten Dimensionen reserviert, was signifikanten Layout Shift (CLS) verursacht.
- `components/visual/motion/check-draw.tsx`: Schwere externe Animations-Bibliotheken werden auf Top-Level in Client-Komponenten importiert, was den LCP unnötig verzögert.
