# RED-TEAM AUDIT BEFUNDE (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- `src/components/forms/photo-upload.tsx`: Fehlerhafter Ladezustand bei langsamer Netzwerkverbindung. Kein Fallback, wenn das Bild über 5 MB groß ist, nur silent fail.
- `src/components/ui/button.tsx`: onClick-Handler in bestimmten Konfigurationen (z. B. als disabled state) fangen Klicks nicht sauber ab, was event bubbling verursacht.
- `src/app/autoschluessel/page.tsx`: Bedingtes Rendering der Termin-Auswahl weist Layout-Löcher bei leeren Arrays auf, was zu einem unruhigen "Sprung" in der UI führt.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- `src/components/calculator/service-budget-calculator.tsx`: Zugriff auf `localStorage` zur Wiederherstellung von Kalkulator-Zuständen ohne sauberen `useEffect` Guard, was Hydration-Fehler bei Erstaufruf erzeugt.
- `src/lib/format.ts`: Datumsformatierungen verlassen sich teilweise auf System-Locales, was auf Server und Client zu unterschiedlichen Outputs führt.

## 3. TYPESCRIPT-SCHWÄCHEN
- `src/components/seo/json-ld.tsx`: Maskierte Typen. Schema.org-Graphen sind nicht durchgängig mit `satisfies Graph` gegen `schema-dts` abgesichert.
- `src/components/autoschluessel/vehicle-facts.tsx`: Prop-Typing nutzt in einigen Objekten ungenaue Strukturen statt strenger Literal Types.

## 4. CORE WEB VITALS SÜNDEN & SCHWEIZER AESTHETIK-BRÜCHE
- `src/components/ui/image-placeholder.tsx`: Keine festen Aspect-Ratios oder Dimensionen hinterlegt, was CLS (Cumulative Layout Shift) verschlechtert.
- Chromatische Reinheit: Einige Rand-Border in `src/components/ui/card.tsx` fallen auf harte HEX-Werte zurück anstatt konsequent OKLCH-Tokens (`oklch(0.89 0.008 260)`) zu verwenden.
- Kinetische Disziplin: Zuviele parallele Hover-Effekte in der Navigation. Fordere den Rückbau auf EINE dominante Signature-Interaktion pro Route.
