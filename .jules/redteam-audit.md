# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund:** Mehrere `onClick`-Handler in Button-Komponenten (z.B. in `src/components/ui/button.tsx`) fehlen detaillierte ARIA-States während asynchronen Ladevorgängen, was Screenreader im Unklaren lässt.
- **Befund:** Formulare in `app/service-und-termin` zeigen zwar Ladezustände, aber bei bestimmten Netzwerkfehlern fehlt ein explizites Toast-Feedback, was zu "Stummen Fehlern" führt.
- **Befund:** Bedingtes Rendering in Feature-Listen (z.B. bei leeren Arrays von Services) kann kleine Layout-Löcher ohne definierte Skeleton-States hinterlassen.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund:** Potenzielle SSR-Konflikte durch lokale Datumsberechnungen oder statische Fallbacks, die sich um eine Millisekunde auf Client/Server unterscheiden könnten.
- **Befund:** Fenster-Abhängigkeiten in einigen Resize-Observern, die eventuell zu früh (vor useEffect Abschluss) feuern könnten.

## 3. TypeScript-Schwächen
- **Befund:** Schema.org JSON-LD Objekte sind teilweise als lose Typen deklariert anstelle von striktem `satisfies Graph` gegen `schema-dts`.
- **Befund:** Ein paar `as any` oder zu breite Typ-Casts in komplexen Datenstrukturen aus dem CMS.

## 4. Core Web Vitals Sünden
- **Befund:** Bilder ohne pre-kalkulierte `sizes` Attribute in einigen flexiblen Grids, was zu LCP-Verzögerungen führen könnte.
- **Befund:** Drittanbieter-Skripte oder schwere Icons werden manchmal nicht rigoros via `lazy` importiert, was den initialen JS-Payload leicht erhöht.

## Fazit
Die Schweizer Light Mode Marken-DNA ist stark, aber es bedarf mehr kinetischer Disziplin (weniger unkoordinierte Animationen) und puristischerer Chromatizität (strikte OKLCH-Durchsetzung für alle Grautöne).
