# Red-Team Audit - Systemanalyse & Design-Kritik (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/app/(site)/autoschluessel/page.tsx`: Die onClick Handler in den Akkordeons für Schlüsselarten haben keine ausreichende Federdämpfung und wirken starr.
- `src/components/ui/button.tsx`: Die Disabled-Zustände der sekundären Buttons kommunizieren keinen klaren Grund für die Inaktivität (Silent Logic Death).
- `src/app/(site)/schliessanlagen/page.tsx`: Das Kontaktformular für Anlagenplanung gibt bei Netzwerkfehlern stumm auf; es fehlt ein sichtbarer Fehler- und Ladezustand.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/ui/accordion.tsx`: Das anfängliche Aufklappen berechnet Höhenwerte auf dem Client, was zu leichten Layout Shifts und Hydration Mismatches beim ersten Rendern führen kann.
- `src/app/(site)/kasse/page.tsx`: Zugriffe auf localStorage für zwischengespeicherte Adressen erfolgen vor der Hydration, ohne `useEffect` Guard.

## 3. Core Web Vitals Sünden
- `src/components/ui/image-placeholder.tsx`: Bilder laden teilweise ohne explizite Aspect-Ratio Deklaration, was CLS (Cumulative Layout Shift) beim Scrollen verursacht.
- `src/app/(site)/page.tsx`: Die Hero-Sektion lädt Schriften synchron und blockiert das Rendering (Zero-Shift Webfont-Optimierung fehlt).

## 4. Visuelle Konsistenz (Swiss Light Mode Aesthetic)
- `src/app/(site)/globals.css`: Es gibt noch vereinzelt HSL/Hex-Artefakte in Schatten- und Border-Definitionen, die nicht auf den reinen OKLCH-Standard (z.B. `oklch(0.988 0.002 260)`) migriert wurden.
- `src/components/ui/card.tsx`: Typografische Hierarchie und Kantenradien von 1px für das Schweizer Design-Paradigma sind inkonsistent umgesetzt.
