# Gnadenloser Red-Team Audit des Ist-Zustands

## 1. Silent Logic Death & Interaktions-Fallen
- In verschiedenen `onClick` Handlern wurden unvollständige State-Übergänge gefunden, die potenziell ins Leere laufen (`() => {}`).
- Formulare (wie in `components/forms/`) weisen teilweise keine expliziten Loading-States für langsame Netzwerke auf, was Nutzer frustrieren könnte.
- Fehlende Fallbacks für leere Arrays bei dynamischen Listen (z.B. Zylinder-Katalog) hinterlassen im Extremfall visuelle Lücken im Layout.

## 2. Hydration Mismatches & SSR-Konflikte
- Potenzielle Zugriffe auf `window` in Drittanbieter-Komponenten ohne saubere `useEffect` Lifecycle-Guards identifiziert, was zu Hydration Mismatches führen kann.
- Zeitformatierungen ohne festes Locale könnten bei abweichenden Servereinstellungen zu SSR-Konflikten führen.

## 3. TypeScript-Schwächen
- Einige Typen in den Content-Layern könnten robuster gegen Schema-Änderungen abgesichert werden (`satisfies` anstelle von reinen Type-Casts).
- Die JSON-LD Schema.org Graphen (`components/seo/json-ld.tsx`) sollten noch strenger gegen `schema-dts` typisiert werden.

## 4. Core Web Vitals Sünden
- Einige Produktbilder weisen keine festen `width`/`height` Attribute auf, was zu minimalem Cumulative Layout Shift (CLS) führen kann.
- Es gibt Optimierungspotenzial beim bedingten Laden (Lazy Loading) von interaktiven Modulen, die nicht initial im Viewport sichtbar sind.

## 5. Design-Kritik (Schweizer Ästhetik-Standards)
- **Chromatische Reinheit:** Die strikte OKLCH-Disziplin (Basis `oklch(0.988 0.002 260)`) ist noch nicht bei 100% aller Border- und Shadow-Tokens absolut exakt eingehalten.
- **Typografische Rhythmik:** Subtile Widows (einzelne Wörter auf neuer Zeile) in Fließtexten bei schmalen Viewports identifiziert.
- **Kinetische Disziplin:** Auf bestimmten Seiten kämpfen mehrere Hover-Effekte um Aufmerksamkeit; ein Fokus auf eine singuläre "Signature-Interaktion" ist erforderlich.
