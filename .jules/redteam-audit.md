# RED-TEAM AUDIT & SYNTHESE
## STATUS-QUO & BEFUNDE (NEXT.JS 16+, REACT 19.2+, TAILWIND V4)

1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN:
   - Die Formulare für "Schlüssel nach Code" und "Terminanfrage" nutzen Basis-React-Hook-Form-Zustände, schöpfen aber die React 19 `useActionState` und `useOptimistic` Patterns nicht vollständig für instantanes Feedback (Zero-Latency Illusion) aus.
   - Es fehlen an einigen Stellen dedizierte leere State-Ansichten, z.B. wenn Konfiguratoren (Schließanlagen, Elektronik) in ungültige Zustände geraten.

2. HYDRATION MISMATCHES & SSR-KONFLIKTE:
   - Lokale Speicherzugriffe für Warenkorb oder Konfigurator-Sessions scheinen teilweise nicht optimal isoliert zu sein, was beim initialen SSR-Render auf Vercel zu Millisekunden-Flickern führen kann, wenn Client-Zustand überschreibt.

3. TYPESCRIPT-SCHWÄCHEN & DESIGN-SYSTEM:
   - In einigen Layout-Dateien werden asynchrone Parameter (`params`) in Next.js 16+ destrukturiert, ohne konsequent TypeScript-Generics für die Route-Parameter (z.B. `Promise<{slug: string}>`) auf den exakten App Router Standard hochzuziehen.
   - Das Designsystem nutzt viele HSL-Fallback-Werte für Schatten und Sub-Text-Farben, statt vollständig und kompromisslos auf die reine `OKLCH 0.988` (Schweizer Light Mode) Basis umgestellt zu sein. Haarlinien-Kanten (1px) fehlen bei Sub-Modulen (wie Accordions).

4. KINETISCHE & CORE WEB VITALS SÜNDEN:
   - Kinetische Disziplin: Zu viele verschiedene Transition-Kurven anstatt eines einzigen globalen `cubic-bezier(0.16, 1, 0.3, 1)` Easing-Standards.
   - "Spatial Bento Grids" (Subgrid CSS) sind noch nicht flächendeckend implementiert, was zu asymmetrischen Spalten in den Feature-Grids führt, insbesondere auf der Startseite (`app/page.tsx`).
