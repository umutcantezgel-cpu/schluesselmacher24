# RED-TEAM AUDIT (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/layout/mobile-action-bar.tsx`: Potentielle tote Klick-Ziele ohne Keyboard-Fokus (fehlende `onKeyDown` Handler bei Custom-Icons).
- `src/components/forms/photo-upload.tsx`: Schwache Fehlerbehandlung, wenn das Dateiformat nicht unterstützt wird.
- `src/app/(site)/autoschluessel/page.tsx`: Fehlender strukturierter Loading-State, falls Client-Side Hydration verzögert ist.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/visual/motion/reveal.tsx`: Vermutete Layout-Shifts durch fehlende serverseitige Initial-Stile bei Animationen.
- `src/components/autoschluessel/termin-auswahl.tsx`: Datum/Zeit-Renderings können serverseitig von der Client-Zeitzone abweichen.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Ungenügende Typisierung für schema-dts. Graph-Erstellung verlässt sich auf loose Typen.
- `src/components/forms/controls.tsx`: Fehlende Exhaustiveness-Checks (z.B. in Switch-Statements für Input-Types).

## 4. Core Web Vitals Sünden
- `src/components/ui/image-placeholder.tsx`: Platzhalter könnten CLS (Cumulative Layout Shift) verursachen, wenn die Aspect-Ratio nicht hart als CSS-Property (z.B. `@supports`) definiert ist.
- `src/components/autoschluessel/key-kinds.tsx`: Große Client-seitige JS-Payload, die möglicherweise nicht ideal in Server/Client-Components gesplittet ist.

## Fazit & Schweizer Light Mode Doktrin
Die Anwendung weist eine solide Basis auf, leidet aber stellenweise an "Silent Logic Death" bei Randbedingungen. Die visuelle Sprache muss strenger auf OKLCH-Werte ohne schmutzige Hex-Fallbacks beschränkt werden. Die kinetische Disziplin erfordert Reduzierung auf Signature-Interaktionen statt ubiquitärer Mikrobewegungen.
