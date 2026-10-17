# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `components/forms/photo-upload.tsx`: Potenziell leere oder unzureichende `onDrop` / `onChange` Handler bei unerwarteten Dateitypen, die ohne visuelles Feedback für den Nutzer scheitern.
- `components/forms/controls.tsx`: Fehlende Ladezustände bei asynchronen Formular-Übertragungen. Bei langsamen Netzwerken bleibt die UI nach dem Klick ohne visuelles Feedback (Silent Logic Death).
- `app/(site)/autoschluessel/page.tsx`: Das bedingte Rendering von spezifischen Schlüsselmodellen führt zu leeren Arrays, die Layout-Löcher hinterlassen, wenn keine Daten gefunden werden, anstatt eines "Zero-State" Screens.

## 2. Hydration Mismatches & SSR-Konflikte
- `app/(site)/layout.tsx`: Es muss überprüft werden, ob beim Setzen von Theme-Einstellungen oder Consent-Bannern auf `localStorage` zugegriffen wird, bevor die Komponente auf dem Client gemountet ist (führt zu Hydration-Mismatches zwischen Server-Render und Client-Render).
- `components/ui/accordion.tsx`: Zufällige generierte IDs für Aria-Attribute könnten zwischen Server und Client abweichen, wenn sie nicht stabil generiert werden (z.B. durch `useId`).

## 3. TypeScript-Schwächen
- `components/ui/button.tsx`: Props-Typisierungen könnten `as unknown as type` Maskierungen verwenden oder `Record`-Typen, die nicht alle Edge-Cases abdecken.
- `app/sitemap.ts` & `app/robots.ts`: Prüfe, ob Typen streng nach Next.js 15+ Metadaten-Interfaces implementiert sind und nicht auf veralteten Versionen basieren.

## 4. Core Web Vitals Sünden
- `components/ui/image-placeholder.tsx`: Fehlen explizite `width` und `height` Attribute auf Bildern? Dies führt zu signifikantem Cumulative Layout Shift (CLS).
- `app/(site)/page.tsx`: Werden schwere Client-Libraries für Scroll-Animationen verwendet, die nicht dynamisch importiert oder lazy-geladen werden, was den LCP (Largest Contentful Paint) negativ beeinflusst?

## 5. Design-Kritik nach Schweizer Aesthetik-Standards
- **Chromatische Reinheit:** Die globalen CSS-Variablen (`globals.css`) könnten noch Restbestände von `hsl()` oder harten Hex-Werten enthalten, die strikt nach `oklch()` migriert werden müssen, um konsistente und farbechte Kontraste zu gewährleisten.
- **Kinetische Disziplin:** Auf der Startseite (`app/(site)/page.tsx`) gibt es möglicherweise zu viele konkurrierende Animationen. Es sollte auf genau EINE dominante Signature-Interaktion reduziert werden (z.B. das Spatial Bento Grid).
- **Typografische Rhythmik:** Headline-Umbruch (`Widows/Orphans`) muss durch intelligentes CSS (`text-wrap: balance`) in `components/ui/card.tsx` optimiert werden.
