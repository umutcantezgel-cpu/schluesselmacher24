# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- In mehreren Kontaktformularen (z.B. in `service-und-termin/anfrage/page.tsx` und `autoschluessel/anfrage/page.tsx`) fehlen detaillierte Ladezustände bei der Submit-Aktion (potentieller "Silent Logic Death", wenn das Backend verzögert).
- Fehlende visuelle Indikatoren (z.B. Spinner in Submit-Buttons) lassen Nutzer im Unklaren über den asynchronen Fortschritt.
- Manche leeren Zustände (z.B. im Warenkorb `warenkorb/page.tsx`) führen zu abrupten Layout-Einbrüchen anstatt elegante Empty States mit Skeleton-Loadern oder sanften Platzhaltern anzuzeigen.

## 2. Hydration Mismatches & SSR-Konflikte
- Potenzielle Mismatches bei der Formatierung von Daten oder Währungen in Client-Komponenten, die ohne strikte Hydration-Guards oder Next.js 16 Server-First-Methoden implementiert sind.
- Direkte Zugriffe auf lokale Speichermechanismen (wie den Warenkorb-State in localStorage) müssen sorgfältig in `useEffect` gekapselt sein, um Layout-Shifts während der Hydrierung zu vermeiden.

## 3. TypeScript-Schwächen
- Überprüfen der Payload-CMS Datenabfragen: oft wird `as unknown as Type` anstatt strenger Typen oder Type-Guards für dynamisch generierte CMS-Inhalte verwendet. Dies birgt das Risiko maskierter Fehler zur Laufzeit.
- Schema.org-Graphen für SEO (in Layouts) sollten mit `satisfies Graph` streng gegen `schema-dts` validiert werden, was teilweise fehlt.

## 4. Core Web Vitals Sünden
- Fehlende oder ungenaue `sizes`-Attribute in dynamischen `next/image`-Komponenten, was den LCP (Largest Contentful Paint) beeinträchtigt, besonders bei den Hero-Bildern (z.B. in `app/(site)/page.tsx`).
- Schwere Drittanbieter-Bibliotheken oder komplexe Interaktionen in Client-Komponenten blockieren unter Umständen den Main Thread (TBT).

## Design-Kritik (Schweizer Aesthetic)
- **Chromatische Reinheit**: Einige Grautöne in den UI-Komponenten sind nicht konsequent als OKLCH-Tokens definiert, was die makellose "Swiss Light Mode Marken-DNA" aufweicht. Alle Farben müssen strikt auf dem Basiswert `oklch(0.988 0.002 260)` aufbauen.
- **Typografische Rhythmik**: Auf längeren Textseiten (`ratgeber`, `sicherheitstechnik`) fehlen teilweise optimierte Text-Umbruch-Strategien, um "Widows" und "Orphans" bei blockbasiertem Content zu verhindern.
- **Kinetische Disziplin**: Es existieren teilweise zu viele unkoordinierte Fade-Ins, die gleichzeitig um Aufmerksamkeit kämpfen. Die Vorgabe lautet: Eine dominante Signature-Interaktion pro Route mit eleganter, gedämpfter Federphysik (AWWWARDS KINETIK).
