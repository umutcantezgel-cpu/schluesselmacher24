# Red-Team Audit

## 1. Silent Logic Death & Interaktions-Fallen
Wir haben den Code nach inaktiven oder scheinaktiven UI-Elementen gescannt.
- **Befund 1:** In `src/components/ui/button.tsx` fehlt teilweise ein nativer Ladezustand, der asynchrone Server-Actions robust abfängt, was zu 'Silent Deaths' bei langsamen Netzwerken führen könnte.
- **Befund 2:** Bestimmte dynamische Formulare im Bereich 'Schlüssel nach Code' weisen potenzielle Layout-Löcher auf, wenn bedingte Renderings bei leeren Arrays keinen Fallback-Inhalt anzeigen.

## 2. Hydration Mismatches & SSR-Konflikte
Die Trennung von Server- und Client-Rendering wurde streng geprüft.
- **Befund 1:** Einige Datums- oder Währungsformatierungen (z.B. in der Preis-Anzeige bei Autoschlüsseln) könnten auf dem Server leicht anders gerendert werden als auf dem Client, was Hydration-Warnungen triggern kann.
- **Befund 2:** Potenzielle Zugriffe auf `window.innerWidth` für responsive Layout-Anpassungen außerhalb von Mount-Guards (`useEffect`) stellen ein Risiko für Mismatches dar.

## 3. Typescript-Schwächen
Das Typsystem wurde auf Lücken und maskierte Fehler analysiert.
- **Befund 1:** Einige Tuples und verschachtelte Props nutzen noch unvollständige Interfaces, was an Randfällen zu unsicheren Typ-Bedingungen führt.
- **Befund 2:** Im Bereich der JSON-LD-Generierung fehlt teilweise die strenge Absicherung gegen `schema-dts`, um eine vollständige Schema.org-Validierung zur Compile-Zeit zu garantieren.

## 4. Core Web Vitals Sünden
Performance und Ladeverhalten standen im Fokus.
- **Befund 1:** Einige Platzhalter-Bilder und Icons weisen keine explizit reservierten Aspect-Ratios auf, was kumulative Layout-Verschiebungen (CLS) verursachen könnte.
- **Befund 2:** Einzelne Client-Komponenten ziehen potenziell zu große Abhängigkeiten in den Client-Bundle, die eigentlich auf dem Server verbleiben sollten (z.B. komplexe Rechner-Logik).
