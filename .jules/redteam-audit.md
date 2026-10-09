# RED-TEAM AUDIT BEFUNDE

## 1. Silent Logic Death & Interaktions-Fallen
- `components/ui/button.tsx`: Bestimmte Button-Varianten zeigen bei `isLoading` keinen Spinner, sondern frieren stumm ein.
- `app/service-und-termin/page.tsx`: Das Kontaktformular blockiert nach einem Submit-Fehler ohne visuelles Feedback.

## 2. Hydration Mismatches & SSR-Konflikte
- `components/vertrauen/nachweise-liste.tsx`: Rendert Initial-Zustände, die client-seitig durch `window.innerWidth` überlagert werden, was zu Layout-Sprüngen führt.

## 3. TypeScript-Schwächen
- `components/visual/area-scope.tsx`: Verwendet `as any` bei der Übergabe komplexer SVG-Props.
- Schema.org JSON-LD in `app/page.tsx` ist nicht strikt gegen `schema-dts` validiert.

## 4. Core Web Vitals Sünden
- `components/ui/image-placeholder.tsx`: Fehlende explizite `width` und `height` Attribute verursachen CLS während des Ladevorgangs.
- `app/autoschluessel/page.tsx`: Das Hero-Bild lädt nicht mit `fetchPriority="high"`, was den LCP verzögert.
