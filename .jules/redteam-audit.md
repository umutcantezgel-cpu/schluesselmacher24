# RED-TEAM AUDIT BEFUND (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
* Befund: Mehrere Buttons weisen in den Checkout- und Service-Komponenten leere Handler oder nicht reagierende Status-Indikatoren auf.
* Kritik: Dies führt zu einem "Silent Logic Death", bei dem der Benutzer interagiert, aber kein Feedback vom System erhält. Es muss zwingend ein Ladezustand (Optimistic UI) oder eine Fehlerbehandlung implementiert werden.
* Betroffen: `src/app/kasse/page.tsx`, `src/app/service-und-termin/page.tsx`

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
* Befund: Risiko von Hydration-Mismatches bei Formularen und interaktiven Rechnern, wenn diese Daten aus LocalStorage abrufen oder window.innerWidth zur Darstellung nutzen, ohne auf das Mounting zu warten.
* Kritik: In SSR-Umgebungen wie Next.js führen diese Zugriffe zu Hydration-Fehlern, da der Server-Render-Pfad kein `window`-Objekt besitzt.
* Betroffen: `src/components/calculator/*`, diverse Helfer für dynamisches Layout.

## 3. TYPESCRIPT-SCHWÄCHEN
* Befund: Maskierte Typen und unvollständige Interfaces bei asynchronen Server-Actions.
* Kritik: Zerstört die Typensicherheit und verhindert frühzeitige Fehlererkennung beim Build. Das Schema.org-Graph-Setup in `src/components/seo` ist nicht rigoros typisiert und verlässt sich auf "any".
* Betroffen: `src/app/admin/page.tsx`, `src/components/seo/json-ld.tsx`

## 4. CORE WEB VITALS SÜNDEN
* Befund: Layout-Shifts durch nicht festgelegte Aspect-Ratios bei Hero-Images und Drittanbieter-Scripts, die synchron im Head laden.
* Kritik: Führt zu schlechtem CLS (Cumulative Layout Shift) und beeinträchtigt den LCP (Largest Contentful Paint).
* Betroffen: `src/app/page.tsx` (Hero-Sektion, Bento-Grids)

## 5. SCHWEIZER LIGHT MODE DOKTRIN KONSISTENZ
* Befund: Unsaubere Schatten, weiche Kontraste und Abweichungen vom OKLCH-Standard in einigen Komponenten.
* Kritik: Die "Awwwards-Jury-Kriterien" erfordern absolute chromatische Reinheit (OKLCH 0.988 Base) und präzise 1px-Borders ohne verschwommene Box-Shadows.
* Betroffen: Globale CSS-Tokens und Utility-Klassen in diversen UI-Komponenten.
