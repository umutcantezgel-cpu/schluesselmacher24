# Red-Team Audit Report
## Silent Logic Death & Interaktions-Fallen
- **app/(site)/autoschluessel/page.tsx**: Die onClick Handler auf den CTA-Buttons führen teilweise zu leeren `() => {}` Funktionen.
- **components/autoschluessel/termin-auswahl.tsx**: Das Formular gibt kein Lade-Feedback (Spinner) während der API-Anfrage.
- **components/layout/mobile-action-bar.tsx**: Bedingte Renderings für den Warenkorb-Badge lassen Layout-Löcher, wenn der Wert null ist.

## Hydration Mismatches & SSR-Konflikte
- **components/visual/motion/in-view.tsx**: Der direkte Zugriff auf das `window` Objekt verursacht Hydration Mismatches ohne `useEffect`.
- **app/(site)/page.tsx**: Die Datumsanzeige für die geschätzte Lieferzeit divergiert zwischen Server und Client durch mangelnde Zeitzonen-Synchronisation.

## TypeScript-Schwächen
- **components/seo/json-ld.tsx**: Die Schema.org Graphen werden als `any` gecastet anstatt strikt gegen `schema-dts` geprüft zu werden.
- **src/lib/data/adapter.ts**: Einige Promises schlucken Fehler leise mit `as unknown as Type`.

## Core Web Vitals Sünden
- **components/autoschluessel/key-kinds.tsx**: Zahlreiche Bilder werden ohne explizite `width` und `height` oder `aspect-ratio` geladen, was zu Cumulative Layout Shifts (CLS) führt.
- **components/ui/image-placeholder.tsx**: Schwere Drittanbieter-Icons werden unnötig im Client-Bundle mitgeschleift statt sie serverseitig zu rendern.

## Schweizer Ästhetik-Standards
- **Chromatische Reinheit**: Hardcodierte Hex-Werte (z.B. `#333333`) anstatt strikt OKLCH-Variablen wie `oklch(var(--area-strong))` zu nutzen.
- **Typografische Rhythmik**: Unbalancierte Zeilenumbrüche (Orphans) bei langen H1-Headlines in `app/(site)/sicherheitstechnik/page.tsx`.
- **Kinetische Disziplin**: Zu viele gleichzeitige Animationen beim Initial-Load auf der Startseite (`app/(site)/page.tsx`), die um Aufmerksamkeit kämpfen.
