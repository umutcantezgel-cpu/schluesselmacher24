# RED-TEAM AUDIT (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Service- und Termin-Rechner:** Es besteht Optimierungspotenzial beim `ServiceEinsatzRechner`. Dieser könnte durch `useOptimistic` und Server Actions robuster und responsiver gestaltet werden, anstatt sich auf rein clientseitige State-Updates zu verlassen, die potenziell asynchron hängenbleiben könnten.
- **Formulare allgemein:** Einige Formulare könnten von expliziten Loading-States mittels `useFormStatus` profitieren, um Silent Logic Death während der Netzwerk-Übertragung zu verhindern.

## 2. Hydration Mismatches & SSR-Konflikte
- **Datums- und Zeitformatierungen:** Bei der Formatierung von Öffnungszeiten und dynamischen Datumsangaben muss darauf geachtet werden, dass die Locale-Informationen auf Server und Client strikt identisch sind. Ein Blick in `formatWeekday` deutet auf eine saubere Implementierung hin, bedarf aber kontinuierlicher Überwachung.
- **Zufalls- und Initialzustände:** Der Einsatz von Fallbacks bei Ladezuständen sollte strikt hydrierungs-sicher sein (z.B. mittels statischer Skelette statt leerer DOM-Knoten).

## 3. TypeScript-Schwächen
- **Strict Mode und anys:** Das Projekt hat eine gute Basis, jedoch müssen wir sicherstellen, dass bei Formularen und Server Actions keine `any` Typen eingeschleust werden (Stichwort: `FormData` Parsing).
- **Schema.org:** Die JSON-LD Implementierungen in `seo/json-ld.tsx` sollten strikt gegen `schema-dts` typisiert sein, was im Projekt größtenteils befolgt wird.

## 4. Core Web Vitals Sünden
- **Bilder und Layout-Shifts:** Die Verwendung von `ImagePlaceholder` und nativen `next/image` Komponenten ist vorbildlich. Dennoch müssen wir bei interaktiven Elementen (wie dem Rechner) auf Layout-Shifts achten, wenn Ergebnisse dynamisch eingeblendet werden. Subgrid und Container Queries bieten hier die Lösung.
- **Client-Bundle-Size:** Der konsequente Einsatz von Server Components muss beibehalten werden, um das JavaScript-Bundle schlank zu halten.

## 5. Design-Kritik (Schweizer Aesthetic Standards)
- **Chromatische Reinheit:** Das Farbschema basiert vorbildlich auf OKLCH-Werten.
- **Kinetische Disziplin:** Die Karten (`Card`-Komponente) könnten durch ein Bento-Grid mit Haarlinien-Lichtreflexen (Cursor-Tracking) auf Awwwards-Niveau gehoben werden, ohne die "Swiss Light Mode"-DNA zu verletzen.
- **Typografische Rhythmik:** Der Fließtext auf der Service-Seite benötigt mehr Volumen (>800 Wörter) und eine strukturiertere Hierarchie, um als semantische Autorität zu wirken.
