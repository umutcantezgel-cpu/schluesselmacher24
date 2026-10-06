# RED-TEAM AUDIT BEFUND (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Warenkorb & Kasse:** Fehlendes Loading-State Feedback bei Checkout-Aktionen. Hydration Mismatches durch ungeprüfte Browser-State Zugriffe in Client-Komponenten vor Hydration-Abschluss.
- **Formulare:** onClick/onSubmit Handler im Kontaktbereich (z.B. Service-Einsatz) enden in unzureichend verarbeiteten States ohne visuelles Fallback bei Netzwerkfehlern.
- **Bedingtes Rendering:** Fehlende Fallbacks für leere Zustände (z.B. leere Warenkörbe), was Layout-Löcher hinterlässt.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Warenkorb Hydration:** Der Header greift auf den lokalen Warenkorb-State zu. Obwohl ein `mounted` Check existiert, führt die harte Trennung oft zu Content-Jumps auf langsamen Verbindungen.
- **Client-Side Rendering Hooks:** Einige Komponenten referenzieren Fensterdimensionen (z.B. für mobile Navigation) ohne adäquate SSR-Dummies, was Layout-Shifts beim First-Paint verursacht.

## 3. TYPESCRIPT-SCHWÄCHEN & ARCHITEKTUR
- **Unvollständige Schema.org Graphen:** JSON-LD Implementierungen nutzen oft generische Typen, ohne streng gegen `schema-dts` mit `satisfies` abgesichert zu sein.
- **Zustandsverwaltung:** Fehlende strikte Typisierung bei asynchronen Payload-States in React 19 Server Actions, wodurch maskierte Typfehler in Formularrückgaben auftreten.

## 4. CORE WEB VITALS & SCHWEIZER DESIGN DOKTRIN
- **Layout Shifts:** Bilder in ImagePlaceholdern fehlen manchmal strikte Aspect-Ratios, was beim Laden zu LCP-Einbußen führt.
- **Design-Konsistenz:** Einige Komponenten könnten von strengeren OKLCH-Farbräumen (0.988 0.002 260 Basis) und 1px harten Kanten (Swiss Light Mode) profitieren. Visuelles Rauschen durch inkonsistente Schatten und Rundungen.
