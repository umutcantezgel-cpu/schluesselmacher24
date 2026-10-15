# Red-Team Audit Report

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- `app/(site)/autoschluessel/anfrage/assistent.tsx`: Die onClick Handler für Buttons weisen potenziell fehlendes Error-Handling auf.
- `app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx`: Formular-Submissions könnten bei Netzwerk-Timeouts ohne Ladeindikator hängen bleiben.
- `app/(site)/warenkorb/warenkorb-ansicht.tsx`: Leere Zustände (Warenkorb leer) könnten bei bedingtem Rendering minimale Layout-Shifts erzeugen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- `components/ui/accordion`: Potenzielles Risiko bei der Initialisierung von `window`-abhängigen Dimensionen vor dem Mount.
- `lib/format.ts`: Datums-Formatierungen ohne strikte Zeitzonen-Fixierung (z.B. UTC) riskieren SSR-Client Mismatches.

## 3. TYPESCRIPT-SCHWÄCHEN
- `lib/types.ts`: Generische Typisierungen nutzen teilweise implizites Any bei komplexen Payload CMS Responses.
- `app/(site)/layout.tsx`: Schema.org JSON-LD Objekte sind nicht immer mit `satisfies Graph` gegen `schema-dts` hart geprüft.

## 4. CORE WEB VITALS SÜNDEN
- `app/(site)/page.tsx`: Hero-Images könnten LCP-Verzögerungen erleiden, wenn `fetchPriority="high"` fehlt.
- `app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx`: Externe Skripte könnten den Main-Thread blockieren.

## 5. SCHWEIZER LIGHT MODE AESTHETIK BRÜCHE
- `app/(site)/globals.css`: Einzelne Schatten oder Tailwind-Klassen nutzen evtl. harte RGBA-Werte anstatt der geforderten OKLCH-Tokens (`oklch(var(--border) / 0.55)`).
- `app/(site)/autoschluessel/page.tsx`: Typografischer Rhythmus bei Headlines auf Mobilgeräten benötigt feineres negatives Tracking.