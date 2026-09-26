# RED-TEAM AUDIT BEFUNDE (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- Diverse Forms und Buttons in bestehenden Routen (z.B. Service & Termin, Sicherheitstechnik) lassen Feedback vermissen. Es gibt leere onClick Handler oder fehlende Ladezustände bei Submit.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Client-Komponenten rufen direkt `window` ab oder verwenden unkontrollierte Zufallszahlen in Renderpfaden, was zu Warnungen führt.

## 3. TypeScript-Schwächen
- Unzureichendes Typisieren von Schema.org Daten ohne sauberes `satisfies Graph` bei diversen Metadaten-Generierungen.
- Promises bei Parametern und SearchParams (Next.js 16/React 19) in `page.tsx` Komponenten werden nicht durchgehend mit `await` aufgelöst.

## 4. Core Web Vitals Sünden
- Einige Bilder laden ohne explizite Dimensionen, was den Cumulative Layout Shift (CLS) beeinträchtigt.
- Fehlende "use cache" Memoisierungen für rechenintensive Berechnungen oder Abfragen in Server Components.

## 5. Design & Ästhetik (Swiss Light Mode)
- In einigen Unterseiten (z.B. Ratgeber, Autoschlüssel) gibt es keine ausreichende chromatische Reinheit. OKLCH Variablen werden nicht konsistent verwendet.
- Kinetische Disziplin: Zu viele ungerichtete Hover-Effekte anstatt der Awwwards-Jury-gefälligen, einen dominanten Signature-Interaktion pro Route.
