# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/ui/button.tsx`: Potenzielles Fehlen von Ladezuständen in asynchronen onClick-Handlern ohne explizites try/catch und UI-Feedback.
- `src/app/(site)/autoschluessel/anfrage/page.tsx`: Formulare haben oftmals rudimentäre `onSubmit`-Handler, die bei Netzwerkfehlern keine Retry-Option oder visuelles Feedback anbieten.
- `src/components/layout/header.tsx`: Mobile Navigation Toggles sind oft nur mit einfachem Zustand (open/close) ohne transition events ausgestattet, was zu abrupten Sprüngen führt.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Client-Komponenten im Bereich `autoschluessel` greifen verfrüht auf `window.innerWidth` zu, bevor `useEffect` gefeuert hat, was zu potenziellen Hydration Mismatches führt.
- `src/components/calculator/` (falls existent) oder Preisanzeigen nutzen potenziell `Math.random()` oder clientseitige Datumsformatierungen, die vom Server-Render abweichen.

## 3. TypeScript-Schwächen
- In diversen Page-Komponenten werden URL SearchParams nicht strikt typisiert, was zu `as unknown as string` Casts führt.
- Schema.org JSON-LD Objekte sind oft nur lose als `any` oder unvollständiges Interface deklariert, statt streng gegen `schema-dts` validiert zu sein.

## 4. Core Web Vitals Sünden
- Hero-Images in `src/app/(site)/page.tsx` und Fach-Seiten fehlen teilweise strikte `sizes` oder Priority-Hints (`fetchPriority="high"`).
- Fehlende Container Queries in komplexen Bento-Layouts führen zu Layout-Shifts während des Ladevorgangs.

## 5. Design-Kritik (Schweizer Ästhetik)
- **Chromatische Reinheit:** Einige Border-Colors verwenden noch harte Hex-Werte statt OKLCH-Tokens (`oklch(0.988 0.002 260)`).
- **Typografische Rhythmik:** Headlines haben oft keine `text-wrap: balance` Eigenschaften, was auf Desktop zu unschönen Umbrüchen (Widows) führt.
- **Kinetische Disziplin:** Zu viele Hover-Effekte gleichzeitig; Fokus sollte auf einer dominanten Signature-Interaktion pro Route liegen.
