# RED-TEAM AUDIT BEFUND

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **`src/components/forms/controls.tsx`**: Gefundenes `onClick={() => {}}` bei Buttons ohne Formular-Kontext. Dies führt zu Klicks ohne Feedback.
- **`src/app/(site)/autoschluessel/anfrage/page.tsx`**: Ladezustände im Anfrage-Formular werden nicht kommuniziert, wenn Netzwerk-Latenz auftritt.
- **`src/components/forms/field.tsx`**: Fehlende visuelle Indikation (kein Cursor-Wechsel, kein Feedback) bei deaktivierten Buttons.
- **`src/app/(site)/schliessanlagen/konfigurator/page.tsx`**: Ein bedingtes Rendering führt bei unvollständigen Eingaben zu unerwarteten Layout-Sprüngen (Layout-Löcher).

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **`src/components/autoschluessel/termin-auswahl.tsx`**: Direkter Zugriff auf Browser-APIs vor dem ersten Client-Render, was zu Hydration-Fehlern führen kann.
- **`src/components/calculator/service-einsatz-rechner.tsx`**: Die initiale Berechnung verwendet fensterspezifische Variablen ohne Guard, was einen Mismatch zwischen Server- und Client-Render erzeugt.

## 3. TYPESCRIPT-SCHWÄCHEN
- **`src/components/autoschluessel/optionen.ts`**: Verwendung von schwachen Typen bei der Definition komplexer Schlüsseltypen.
- **`src/app/(site)/layout.tsx`**: Schema.org JSON-LD Objekte werden ohne `satisfies Graph` implementiert, was zu Typunsicherheiten bei zukünftigen Änderungen führt.

## 4. CORE WEB VITALS SÜNDEN
- **`src/components/autoschluessel/service-article.tsx`**: Bilder im LCP-Bereich ohne `priority` oder explizite Dimensionen (Breite/Höhe), was Layout Shifts verursacht.
- **`src/components/autoschluessel/vehicle-facts.tsx`**: Potenzielle Render-Blockierung durch client-seitige Skript-Abhängigkeiten.

## 5. DESIGN-KRITIK (SCHWEIZER LIGHT MODE)
- **Chromatische Reinheit**: Einige Ränder verwenden harte Hex-Werte statt der definierten OKLCH-Tokens.
- **Typografische Rhythmik**: Mangelnde Kontrolle über Zeilenumbrüche in H1-Headlines (Orphans auf Mobile).
- **Kinetische Disziplin**: Zu viele verschiedene Hover-Animationen (Skalierung + Farbübergang + Schatten) auf den gleichen Elementen.
