# Red-Team Audit Report
## SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Die `onClick` und `onSubmit` Handler in Formularen wie z.B. in `src/components/forms/photo-upload.tsx` und `src/components/forms/controls.tsx` scheinen teilweise nur Konsolen-Logs oder leere Callbacks zu verwenden, anstelle von echten React 19 `useActionState` und serverseitigen Aktionen. Dies blockiert den echten State-Flow.
- Einige interaktive Buttons und Karten (z.B. `src/components/forms/option-card.tsx`) zeigen zwar Interaktivität, aber keine robuste serverseitige Logik für Ladezustände (`useFormStatus` / `useTransition`), wodurch bei langsamen Netzwerken ein 'Silent Death' des UI droht.
- Bestimmte Bereiche in der Navigation und bei Auswahlen zeigen fehlende Fallbacks auf.

## HYDRATION MISMATCHES & SSR-KONFLIKTE
- Datumsformate und zufällig generierte IDs für Inputs und ARIA-Attribute in den Komponenten (wie Accordions oder Forms) ohne `useId` können zu Hydration-Mismatch zwischen Client und Server führen.
- Fenster- und Dokument-Zugriffe (`window.innerWidth`, `localStorage`) müssen durch `useEffect` oder Komponenten mit `useMounted` State-Guards isoliert werden, um SSR-Abstürze zu verhindern.

## TYPESCRIPT-SCHWÄCHEN
- Oftmals werden `any` oder `unknown` anstatt streng typisierter Zod-Schemata oder `satisfies` bei den komplexen Formular-Zuständen und Props benutzt, was die Typ-Sicherheit untergräbt.
- Schema.org JSON-LD-Generatoren in `src/components/seo/json-ld.tsx` sind zwar vorhanden, aber teilweise fehlen strenge Checks gegen `schema-dts`.

## CORE WEB VITALS SÜNDEN & VISUELLE KONSISTENZ (SCHWEIZER AESTHETIK)
- Fehlende explizite `width` und `height` bei diversen Bildelementen und Platzhaltern führen zu Cumulative Layout Shift (CLS).
- Das Design-System weicht teils von den reinen OKLCH-Werten (Schweizer High-End Light Mode) ab; Grautöne sind nicht immer sauber kalibriert, was zu chromatischen Dissonanzen führt. Schatten und Kanten (`1px`) könnten raffinierter nachgezogen werden.

**FAZIT:** Das Fundament ist solide, benötigt aber dringend eine Überarbeitung mit Fokus auf echte React 19 State-Management (Server Actions, `useActionState`), radikale Typensicherheit und eine schärfere Einhaltung der OKLCH basierten Schweizer Light Mode Ästhetik.
