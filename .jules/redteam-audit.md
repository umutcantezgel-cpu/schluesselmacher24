# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- **Gefunden:** Leere Fehler-Handler (`catch(() => {})`) in API-Routen (z. B. `src/app/(site)/api/kunden-upload/route.ts`). Dies verschluckt kritische Fehler bei Upload-Abbrüchen.
- **Gefunden:** Leerer Cleanup-Handler in `src/lib/client-state.ts` (`return () => {};`), was zu Memory Leaks führen kann, wenn Subscriptions nicht korrekt entfernt werden.

## 2. Hydration Mismatches & SSR-Konflikte
- **Gefunden:** Direkter Zugriff auf `window.scrollTo` in Komponenten wie `src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx` und `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx` ohne useEffect-Kapselung. Dies bricht die SSR-Hydration.
- **Gefunden:** Direkter Zugriff auf `window.localStorage` in `src/app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx` während des Renders, was Hydration-Fehler verursacht.

## 3. Typografische & Visuelle Schwächen (Swiss Light Mode)
- **Bewertung:** Die chromatische Reinheit muss strenger durchgesetzt werden. Überprüfungen auf harte Hex-Werte statt reiner OKLCH-Tokens sind notwendig. Die Kinetik sollte auf eine dominante Interaktion pro Route reduziert werden.

## 4. Performance (Core Web Vitals)
- **Bewertung:** Bilder müssen mit expliziten Dimensionen versehen werden, um Cumulative Layout Shift (CLS) zu verhindern. Schwere Animationen (Lottie etc.) sollten auf native CSS/SVG-Animationen umgestellt werden.
