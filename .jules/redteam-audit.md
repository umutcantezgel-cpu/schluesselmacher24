# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** In `src/components/autoschluessel/termin-auswahl.tsx` fehlen persistente Loading-States, wenn Netzwerkfehler beim Abrufen der Zeitslots auftreten. Dies führt zu "Silent Logic Death", bei dem der Benutzer ohne Feedback blockiert ist.
- **Befund 2:** Das Formular in `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx` enthält bedingte Renderings für Fehler-Arrays. Ist das Array leer, entstehen Layout-Löcher, die das Swiss Light Mode Bento-Grid aufbrechen.
- **Befund 3:** In `src/components/forms/photo-upload.tsx` existiert ein leerer `onError`-Handler, der Upload-Fehlschläge schluckt und den Benutzer in der Schwebe lässt.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Die `src/components/layout/mobile-action-bar.tsx` greift potenziell auf `window.innerWidth` zu, bevor die Komponente gemountet ist (fehlender `useEffect`-Guard).
- **Befund 2:** Datumsformatierungen in `src/components/autoschluessel/termin-auswahl.tsx` riskieren Zeitzonen-Konflikte zwischen Node-Server und Client-Browser, was zu Hydration-Fehlern in React 19 führen kann.

## 3. TypeScript-Schwächen
- **Befund 1:** Die JSON-LD Implementierung in `src/components/seo/json-ld.tsx` nutzt keine strikte `satisfies Graph`-Zusicherung gegen `schema-dts`, was zu unbemerkten Typ-Brüchen in der SEO-Metadaten-Generierung führen kann.
- **Befund 2:** In `src/components/visual/interaktiv/fraesbahn-bewegung.tsx` werden Action-Payloads mit teilweise losen Typen statt strikten Zod-Schema-Validierungen verarbeitet.

## 4. Core Web Vitals Sünden
- **Befund 1:** Einige SVG-Generatoren (z.B. in `src/components/visual/generators/schluessel.tsx`) haben keine fixen Aspect-Ratios über `viewBox` in Kombination mit CSS, was zu leichten Layout Shifts (CLS) während der Initialisierung führt.
- **Befund 2:** In der Kasse (`src/app/(site)/kasse/page.tsx`) fehlen Prefetches für nachgelagerte Scripts, was den LCP (Largest Contentful Paint) verzögert.

## 5. Swiss Light Mode Doktrin Verstöße
- **Befund 1:** Harte Hex-Werte (`#ffffff`, `#000000`) haben sich teilweise in Inline-Styles (z.B. in SVG-Fills) eingeschlichen. Diese müssen zwingend durch OKLCH-Farb-Tokens (z.B. `oklch(0.988 0.002 260)`) ersetzt werden.
- **Befund 2:** Kinetische Unruhe in `src/components/visual/motion/seitenwechsel.tsx`: Mehrere Hover-Animationen überlagern sich ohne die strikte Federdämpfung (`cubic-bezier(0.16, 1, 0.3, 1)`), wodurch die kinetische Signatur verwischt wird.
