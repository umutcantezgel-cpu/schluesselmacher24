# Red-Team Audit - Schluesselmacher24

## 1. Silent Logic Death & Interaktions-Fallen
- `src/app/(site)/autoschluessel/anfrage/assistent.tsx`: Enthält Formular-Schritte, aber potenzielle leere Handler oder nicht sauber kommunizierte Ladezustände bei den finalen Aktionen (z.B. Dateiupload).
- `src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx`: Überprüfen auf korrekte Fehlerbehandlung bei Netzwerkausfällen während des Checkouts.
- `src/components/forms/photo-upload.tsx`: Fehlende oder inkonsistente Rückmeldung, wenn ein nicht unterstütztes Dateiformat hochgeladen wird (stummes Versagen).

## 2. Hydration Mismatches & SSR-Konflikte
- Datum und Zeitanzeigen in `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx` könnten durch Zeitzonenunterschiede zwischen Server und Client zu Hydration Mismatches führen.
- Generierung von zufälligen IDs oder Keys (z.B. in `src/components/calculator/rechner-bausteine.tsx`) ohne Nutzung von `useId()`, was zu Hydration-Fehlern führen kann.

## 3. TypeScript-Schwächen
- Typ-Casting (`as unknown as Type`) in den verschiedenen `page.tsx` Dateien beim Zugriff auf Suchparameter oder Parameter, die eigentlich als Promise typisiert sein sollten (Next.js 16+ App Router Änderungen).
- Überprüfen der `Schema.org` Graphen in `src/components/seo/json-ld.tsx`, ob sie wirklich robust mit `satisfies` und `schema-dts` validiert werden, um Laufzeitfehler zu vermeiden.

## 4. Core Web Vitals Sünden
- Fehlende explizite Breiten und Höhen bei den SVG-Icons in `src/components/visual/icons/`, was zu Cumulative Layout Shift (CLS) führen kann, besonders wenn sie verzögert laden.
- `src/components/ui/image-placeholder.tsx` muss sicherstellen, dass die Dimensionen exakt denen des finalen Bildes entsprechen.

## 5. Visuelle Brüche (Swiss Light Mode Doktrin)
- Harte Hex-Werte statt reiner OKLCH-Tokens in einigen Legacy-Komponenten.
- Unruhige Animationen (mehr als eine dominante Interaktion pro Route) in den Slidern oder Carousels.
- Fehlendes CSS Subgrid in komplexen Bento-Layouts, was zu inkonsistenten Höhen und Abständen führt (z.B. `src/components/showcase/spatial-bento-grid.tsx` - falls vorhanden, oder in den Karten von `src/app/(site)/page.tsx`).