# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/app/(site)/page.tsx`: Quick Entry Links und Area Cards navigieren statisch, aber es fehlt oft an kinetischem Feedback beim Hover, das über eine einfache Farbänderung hinausgeht. Potenziell fehlende Interaktivität bei der Feature-Übersicht.
- `src/components/forms/`: Die Formularfelder (z. B. `photo-upload.tsx`) benötigen strengere visuelle Indikatoren für Drag-and-Drop-Zustände (Silent Logic bei falschen Dateitypen?).
- `src/app/(site)/service-und-termin/page.tsx`: Terminbuchungs-Flow könnte mehr asynchrones Feedback (Ladezustände) direkt im Grid gebrauchen, statt nur beim Absenden des gesamten Formulars.

## 2. Hydration Mismatches & SSR-Konflikte
- Generative Grafiken in `src/components/visual/generators/` (z. B. `zutritt-signal.tsx`, `schluessel.tsx`): Es muss sichergestellt sein, dass SVG-Pfade und Animationen (falls zufallsbasiert) deterministisch auf Server und Client rendern. Aktuell scheinen sie deterministisch zu sein, aber die Animations-Trigger könnten verbessert werden.
- Zeitstempel oder zufällige Reviews in den Trust-Komponenten (falls vorhanden) müssen serverseitig generiert und als Prop übergeben werden.

## 3. TypeScript-Schwächen
- Einige `any` oder ungenaue Typisierungen könnten in älteren Formularkomponenten oder beim Parsing von URL-Parametern existieren.
- Schema.org JSON-LD in `src/components/seo/json-ld.tsx` sollte idealerweise mit `schema-dts` typisiert sein, um Strukturfehler zur Compilezeit abzufangen.

## 4. Core Web Vitals Sünden
- LCP auf der Startseite: Die Hero-Sektion muss sofort (ohne Hydration-Verzögerung) sichtbar sein. Die Bild-Platzhalter (`ImagePlaceholder`) sollten durch priorisierte, lazy-geladene Bilder mit exakten Aspect-Ratios ersetzt werden (Next.js `next/image` mit `priority`).
- CSS-Subgrid Harmonisierung fehlt in vielen Grids (z. B. in den Bento-Layouts), was zu ungleichmäßigen Kartenhöhen führen kann.

## Design-Kritik nach Schweizer Ästhetik-Standards
1. **Chromatische Reinheit:** Die globale Verwendung von HSL/Hex muss zugunsten von strengen OKLCH-Werten (0.988 für Backgrounds, 1px subtile Borders) überarbeitet werden. Aktuell gibt es wahrscheinlich noch Altlasten in Tailwind-Klassen (z. B. `bg-gray-100`).
2. **Typografische Rhythmik:** In den Fließtexten (z. B. `src/app/(site)/ratgeber/page.tsx`) fehlt es teilweise an negativem Tracking bei Headings (`tracking-tight`) und sauberem Zeilenumbruch.
3. **Kinetische Disziplin:** Zu viele Standard-Transitions (`transition-all duration-300`). Wir benötigen eine singuläre, physikalisch basierte Animations-Signatur (Federphysik, `cubic-bezier(0.16, 1, 0.3, 1)`).
