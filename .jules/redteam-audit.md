# RED-TEAM AUDIT BEFUNDE (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefundene onSubmit Handler, die lediglich ein console.log ausgeben.
- Formulare (z.B. Photo-Upload) ohne eindeutige Ladezustands-Rückmeldung oder unklarem Fehlerhandling.
- Komponenten mit bedingtem Rendering bei leeren Arrays (z.B. in der Termin-Auswahl), was zu unsauberen Layout-Löchern führt.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Direkte Zugriffe auf window.localStorage in bestimmten Calculator-Komponenten, die nicht korrekt in useEffect gehüllt sind.
- Datumsanzeigen in der Service-Übersicht, die je nach Server/Client-Lokalität inkonsistent rendern.

## 3. TYPESCRIPT-SCHWÄCHEN
- Vereinzelte 'as any' oder 'as unknown' Casts, die das strenge Typing in Formularen unterlaufen.
- Unvollständig getypte Server Action Payloads in den Formularen (z.B. Anfrageformulare).
- Schema.org Graphen in `json-ld.tsx` sind teilweise ohne `satisfies Graph` Absicherung.

## 4. CORE WEB VITALS SÜNDEN
- Einige Placeholder-Images oder Image-Tags in Content-Seiten besitzen keine expliziten Dimensionen.
- Die Lade-Pipeline von Bildern kann weiter durch konsequentes AVIF und strukturierte Lazy-Loading-Strategien gestrafft werden.

## 5. SCHWEIZER LIGHT MODE AESTHETIK-BRÜCHE
- Subtile Farbabweichungen von der OKLCH-Doktrin in vereinzelten Border-Shadows (z.B. 'schmutzigere' Box-Shadows).
- Inkonsistente Typografie-Rhythmik (Widows/Orphans) in längeren Ratgeber-Texten.
- Fehlende Kinetische Disziplin: Mehrere Micro-Animationen kämpfen in Bento-Grids um Aufmerksamkeit.
