# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/flow/flow-shell.tsx`: Enthält diverse `onClick`-Handler, bei denen nicht klar ist, ob Fehler oder Netzwerkausfälle robust abgefangen werden (z. B. `flow.next`, `onSubmit`).
- Formulare (wie in `src/components/forms/photo-upload.tsx`) weisen `onClick`-Uploads auf; Ladezustände oder Fehlermeldungen bei fehlgeschlagenem Upload müssen validiert werden.
- Fehlende bedingte Rendering-Guards in UI-Komponenten (`src/components/ui/accordion.tsx`) können Layout-Löcher hinterlassen.

## 2. Hydration Mismatches & SSR-Konflikte
- Client-seitige Fallbacks (`localStorage` in Flow-Wiederherstellung) werden im Render-Pfad oder in Client-Komponenten verwendet, was ohne sauberes `useEffect`-Mounting zu Hydrationsfehlern führt.
- `src/components/layout/site-header.tsx` verwendet lokales State (`useState` für `openArea`, `drawerOpen`), was potenziell im Konflikt mit serverseitig generiertem Markup steht, falls es bedingte Styles ohne Hydration-Guards auslöst.

## 3. TypeScript-Schwächen
- Unvollständige Typisierung bei Event-Handlern und Flow-Zuständen (`flow.dismissRestored`, `flow.goTo`). Maskierte Typfehler (wie `any` oder `unknown` Fallbacks) sind wahrscheinlich in den Zustandsmanagern (`Zustand` oder Hooks).
- Schema.org JSON-LD Objekte (in `src/components/seo/json-ld.tsx`) müssen streng gegen `schema-dts` mit `satisfies Graph` geprüft werden; oft fehlen hier strikte Typisierungen für optionale Felder.

## 4. Core Web Vitals Sünden
- Fehlende explizite Dimensionen oder Aspekt-Ratios für Bilder, die Layout-Shifts (CLS) auslösen könnten.
- Schwergewichtige Animationen oder Drittanbieter-Hooks in Client-Komponenten, die die Time-to-Interactive (TTI) verzögern.

## 5. Design-Kritik (Schweizer Aesthetic)
- Chromatische Reinheit: Hex-Codes oder inkonsistente Schatten-Werte (`sm`, `md`) anstelle von sauberen OKLCH-Tokens und `box-shadow` CSS-Variablen.
- Typografische Rhythmik: `clamp()`-Werte für Headlines fehlen oder brechen bei bestimmten Viewports hart um. Negative Tracking-Werte für große Headlines sind unzureichend justiert.
- Kinetische Disziplin: Zu viele Hover-Effekte auf einmal, fehlende physikalische Federdämpfung für interaktive Elemente.
