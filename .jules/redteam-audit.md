# Red-Team Audit Report: SCHLÜSSELMACHER24

## 1. Silent Logic Death & Interaktions-Fallen
- **Bestaetigung / Forms:** Es existieren leere oder nicht ausreichend mit Lade-Status versehene Submit-Handler in bestimmten Client-Komponenten, die bei langsamen Netzwerken zum "Silent Logic Death" führen können (z.B. in `src/components/forms/photo-upload.tsx`).
- **Layout Shifts:** Bedingtes Rendering in Listen (z.B. in `src/components/layout/summary-list.tsx` oder Warenkorb) hinterlässt bei leeren Arrays teilweise Layout-Löcher.

## 2. Hydration Mismatches & SSR-Konflikte
- Es gibt potenzielle Hydration-Konflikte bei Datumsanzeigen in den Termin-Auswahl-Komponenten (`src/components/autoschluessel/termin-auswahl.tsx`), falls diese nicht ordentlich im Mount-Status gekapselt sind.
- Direkte Client-Abhängigkeiten in einigen Rechnern (`src/components/calculator/*`) könnten bei striktem SSR zu Warnings führen.

## 3. TypeScript-Schwächen
- Eventuell fehlende oder unvollständige Interfaces in `src/components/ui/button.tsx` und `src/components/ui/card.tsx`, insbesondere wenn `as unknown as` verwendet wird.
- Schema.org JSON-LD Objekte (`src/components/seo/json-ld.tsx`) sollten strikter gegen `schema-dts` validiert werden, um "maskierte" Typfehler zu vermeiden.

## 4. Core Web Vitals Sünden
- Einige Bilder nutzen `ImagePlaceholder` ohne strikte Dimensionen oder Aspect-Ratios, was CLS (Cumulative Layout Shift) verursachen kann (z.B. in `src/app/(site)/page.tsx`).
- Drittanbieter-Icons (Lucide) werden oft direkt in Client-Komponenten geladen, was das initial JS-Bundle potenziell unnötig aufbläht.

## 5. Design-Kritik (Schweizer Aesthetic Standards)
- **Chromatische Reinheit:** Das Tailwind-Config verwendet teilweise noch harte Farbwerte oder generische Grautöne, die nicht konsequent auf OKLCH-Basis aufgebaut sind.
- **Typografische Rhythmik:** Headlines haben oft kein angepasstes Tracking. Es fehlen explizite Zeilenumbruch-Optimierungen (Widows/Orphans Vermeidung).
- **Kinetische Disziplin:** Zu viele Micro-Interaktionen auf manchen Seiten, die von der "einen dominanten Signature-Interaktion" ablenken. Subgrid wird in den Feature-Karten noch nicht durchgehend für perfekte Ausrichtung verwendet.
