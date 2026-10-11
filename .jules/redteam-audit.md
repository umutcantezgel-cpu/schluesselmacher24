# Red-Team Audit Report
**Agent:** JC-PHILOSOPHER-REDTEAM-v1
**Date:** 2026-10-11

## Executive Summary
Gnadenloser Red-Team Audit des Ist-Zustands. Die Architektur folgt grundsätzlich der Swiss Light Mode Doktrin, aber es gibt signifikante Schwachstellen im Bereich Interaktionstiefe und kinetischer Finesse.

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Die `ButtonLink` und `Button` Komponenten nutzen oft nur visuelle Hover-Zustände ohne taktiles Feedback (fehlendes scale-down auf `:active` oder fehlende haptische Federphysik).
- **Befund 2:** Formulare (z.B. in `autoschluessel/anfrage`) weisen teils ungenügende Ladezustände oder fehlende Skeleton-Loader während Netzwerk-Transitions auf.
- **Befund 3:** Mehrere UI-Elemente haben leere `onClick`-Stubs oder ungenutzte Props, die zu "Silent Logic Death" führen, wenn Benutzer interagieren und nichts passiert.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Potenzielle Mismatches bei der Datumsanzeige, falls Client und Server unterschiedliche Zeitzonen verwenden.
- **Befund 2:** Das Responsive-Layout verlässt sich teilweise auf Window-Sizes statt konsequent auf CSS Media Queries oder Container Queries (@container) zu setzen, was zu Layout Shifts nach Hydration führen kann.

## 3. TypeScript-Schwächen
- **Befund 1:** Einige `as any` oder `as unknown` Casts in komplexen Formular-Zuständen maskieren echte Typisierungsfehler.
- **Befund 2:** Schema.org Typisierungen sind oft nur lose Objekte und nicht strikt gegen `schema-dts` mit `satisfies` abgesichert, was zu unsichtbaren SEO-Fehlern führen kann.

## 4. Core Web Vitals Sünden
- **Befund 1:** Bilder verwenden zwar `ImagePlaceholder`, aber nicht immer strikte Aspect-Ratio-Reservierungen, was Cumulative Layout Shift (CLS) begünstigt.
- **Befund 2:** Die Initial-Load-Performance kann durch aggressiveres Caching via Next.js 16+ `use cache` und tiefere Memoisierung weiter verbessert werden.

## Design-Kritik (Swiss Light Mode Doktrin)
- **Chromatische Reinheit:** Die OKLCH-Tokens sind grundsätzlich gut integriert, aber es fehlt oft der allerletzte Glanz (z.B. subtile 1px-Borders mit `oklch(0.89 0.008 260 / 0.55)`).
- **Typografische Rhythmik:** Negative Tracking bei großen Headlines fehlt teilweise, was die Schweizer Strenge aufweicht.
- **Kinetische Disziplin:** Die Seite wirkt statisch. Es fehlt an physikbasierter Federdämpfung für Kern-Interaktionen.
