# Red-Team Audit Report
**Agent:** JC-PHILOSOPHER-REDTEAM-v1
**Date:** 2026-10-21T17:02:12.500667+00:00

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** In `src/app/(site)/autoschluessel/anfrage/assistent.tsx` existieren `onClick`-Handler, die bei fehlenden Auswahlen ohne visuelles Feedback abbrechen (Silent Logic Death).
- **Befund 2:** Das Formular `src/app/(site)/kasse/kasse-formular.tsx` nutzt teilweise keine `useActionState` für Fehlerbehandlung, was bei Netzwerkfehlern zu einem stummen Einfrieren führt.
- **Befund 3:** In `src/components/ui/accordion.tsx` fehlen in bestimmten Randfällen fließende Höhenübergänge bei leeren Inhalts-Arrays.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 4:** In `src/components/visual/interaktiv/zylinder-mass-live.tsx` wird teilweise initial auf `window.innerWidth` zugegriffen, was zu potenziellen Hydration-Warnungen beim SSR führt.
- **Befund 5:** Zufällige Initialwerte bei den Animationen in `src/components/visual/profillinie.tsx` verursachen sporadische SSR-Abweichungen.

## 3. TypeScript-Schwächen
- **Befund 6:** In einigen Legacy-Komponenten wird `@typescript-eslint/no-explicit-any` implizit geduldet oder Typen werden mit `as unknown as ComponentType` erzwungen, was die strikte Typensicherheit von TypeScript 5.5 aufweicht.
- **Befund 7:** Schema.org JSON-LD-Generatoren weisen teilweise Lücken bei der Validierung durch `satisfies Graph` auf, was zu fehlerhaften strukturierten Daten führen könnte.

## 4. Core Web Vitals Sünden
- **Befund 8:** In `src/components/forms/photo-upload.tsx` fehlen explizite `width` und `height` Attribute für die Vorschau-Bilder, was beim Laden zu minimalem Cumulative Layout Shift (CLS) führt.
- **Befund 9:** Die Komponente `src/components/autoschluessel/preis-anzeige.tsx` könnte durch verzögertes Laden von Preisdetails in Client-Komponenten den LCP leicht negativ beeinflussen.

## 5. Design-Kritik nach Schweizer Aesthetik-Standards
- **Chromatische Reinheit:** Vereinzelt finden sich harte `#000000` oder `rgba` Werte in alten CSS-Klassen statt konsequent OKLCH-Tokens (`oklch(0.988 0.002 260)`) zu verwenden.
- **Typografische Rhythmik:** `h2` und `h3` Überschriften auf der Route `src/app/(site)/schliessanlagen/page.tsx` nutzen kein negatives Tracking (`tracking-tighter`), was die Kompaktheit stört.
- **Kinetische Disziplin:** Auf der Startseite (`src/app/page.tsx`) kämpfen zeitweise Hover-Animationen der Cards mit globalen Scroll-Reveal-Effekten um die Aufmerksamkeit – eine Reduktion auf EINE Signature-Interaktion ist geboten.
