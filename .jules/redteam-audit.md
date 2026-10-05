# Red-Team Audit Report
## 1. Silent Logic Death & Interaktions-Fallen
- In `src/app/(site)/kasse/page.tsx` fehlt bei einigen Formularen der korrekte Ladezustand über `useFormStatus` oder `useActionState`.
- `onClick` Handler in `src/components/ui/button.tsx` haben teilweise keine saubere Fehlerbehandlung.

## 2. Hydration Mismatches & SSR-Konflikte
- Potenzielle Hydration-Konflikte bei der Datumsanzeige in `src/app/(site)/artikel/[slug]/page.tsx` aufgrund inkonsistenter Zeitzonen auf dem Server vs. Client.

## 3. TypeScript-Schwächen
- Einige Schema.org JSON-LD Objekte sind nicht strikt mit `schema-dts` typisiert, was zu stillen SEO-Fehlern führen kann.

## 4. Core Web Vitals Sünden
- LCP in `src/app/(site)/page.tsx` wird durch nicht optimierte Hero-Bilder blockiert. Es fehlen `priority` Tags und `sizes` Angaben.

## 5. Visuelle Brüche (Swiss Light Design Doctrine)
- Teilweise werden `hex` Farben statt der strikten `oklch` Tokens aus dem Design-System verwendet.
- Kinetische Disziplin: Zu viele Hover-Effekte gleichzeitig in den Navigationen stören die Fokussierung.
