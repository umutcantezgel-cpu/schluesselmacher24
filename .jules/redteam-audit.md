# RED-TEAM AUDIT: SCHLÜSSELMACHER24
**Date:** 2024-10-07
**Agent:** JC-PHILOSOPHER-REDTEAM-v1

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Autoschlüssel-Anfrage (`src/app/(site)/autoschluessel/anfrage/page.tsx`)**: Die Formularübergänge könnten bei Netzwerk-Latenzen "stumm" bleiben, ohne optimistische UI-Updates für den Ladezustand zu bieten.
- **Konfiguratoren (`src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`, etc.)**: Fehlen von Micro-Interactions bei der Auswahl von Zylinder-Spezifikationen. Auswahl fühlt sich "tot" an.
- **Warenkorb (`src/app/(site)/warenkorb/page.tsx`)**: Fehlende Leerraum-Auffüllung (Empty State) bei leerem Array kann Layout-Löcher hinterlassen.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Terminstatus (`src/app/(site)/service-und-termin/terminstatus/page.tsx`)**: Client-seitiges Datums-Rendering (Lead-Days / Deposit) kann potenziell Mismatches verursachen, wenn Zeitzonen oder locales nicht streng vom Server vorgegeben sind.
- **Generische `window` Checks**: Gefahr von Hydration-Mismatches bei responsiven Breakpoint-Checks im React-Tree anstelle von reinem CSS (z.B. bei Mobile-Menu Toggles).

## 3. TYPESCRIPT-SCHWÄCHEN & SCHEMA-DTS
- **LocalBusiness Schema (`src/components/seo/json-ld.tsx`)**: Potenziell unvollständige Typisierung, falls `localBusinessSchema` nicht strikt mit `satisfies Graph` gegen `schema-dts` abgesichert ist.
- **Next.js 16+ Promise Params**: In dynamischen Routen (wie `[slug]/page.tsx` oder `[make]/[model]/page.tsx`) müssen `params` und `searchParams` zwingend als Promises getypt und `await`ed werden.

## 4. CORE WEB VITALS SÜNDEN & VISUELLE KONSISTENZ
- **Image Dimensionen**: Die `ImagePlaceholder` Komponente muss sicherstellen, dass Platzhalter immer genaue Aspect-Ratios (z.B. `aspect-video`) setzen, um CLS zu vermeiden.
- **Schweizer Light Mode (OKLCH)**: Prüfung auf versehentliche Hex-Werte. Es muss sichergestellt sein, dass ausschließlich `oklch(0.988 0.002 260)` für Flächen und korrekte AAA-Kontraste verwendet werden. Keine Dark-Mode `dark:` Klassen!
- **Kinetische Disziplin**: Es existieren teilweise hover-Effekte (z.B. `hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]`), die eventuell zu stark oder nicht performant genug sind, falls sie Layout-Reflows triggern.
