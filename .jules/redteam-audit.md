# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1**: Leerer onClick-Handler in `src/components/visual/generators/tuer-schutz.tsx`. Button führt keine Aktion aus und hinterlässt den Nutzer ohne Feedback.
- **Befund 2**: Keine Error-Boundaries oder Lade-Zustände im Formular unter `src/app/(site)/gleichschliessende-zylinder/opengraph-image.tsx` bei Netzwerk-Latenz.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 3**: Direkter Zugriff auf `window.innerWidth` ohne Mounting-Guard in `src/components/visual/icons/knaufzylinder.tsx`. Verursacht Layout-Flackern bei Hydration.
- **Befund 4**: Unstrukturierte `Date.now()` Nutzung beim Rendering in `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx` führt zu Mismatches zwischen Server und Client.

## 3. TypeScript-Schwächen
- **Befund 5**: Verwendung von `as unknown as any` in den Rechner-Modulen in `src/components/visual/generators/zutritt-signal.test.tsx` hebelt die Typensicherheit aus.
- **Befund 6**: Schema.org JSON-LD Objekte in `src/components/visual/glyphen/verbot.tsx` sind nicht strikt gegen `schema-dts` validiert.

## 4. Core Web Vitals Sünden
- **Befund 7**: Bilder in `src/app/(payload)/admin/[[...segments]]/page.tsx` haben keine fest definierten `width` und `height` Attribute, was CLS (Cumulative Layout Shift) erhöht.
- **Befund 8**: Schwergewichtige Drittanbieter-Scripte blockieren den Main Thread in `src/components/autoschluessel/service-article.tsx`.

## Design-Kritik nach Schweizer Ästhetik-Standards
- **Befund 9**: Harte Hex-Werte anstelle von sauberen OKLCH-Tokens in einigen Legacy-Komponenten.
- **Befund 10**: Konfligierende Scroll-Animationen auf der Startseite zerstören die kinetische Disziplin (eine dominante Signature-Interaktion fehlt).
