# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- `src/app/(site)/page.tsx`: Einige Call-to-Action-Buttons rufen leere () => {} Handler auf oder loggen nur ins Console, statt eine echte Interaktion auszulösen.
- `src/components/forms/order-form.tsx`: Formulare fehlen Ladezustände bei React Server Actions und geben bei Netzwerkfehlern keine visuellen Feedbacks.
- `src/app/(site)/autoschluessel/page.tsx`: Bedingtes Rendering von Arrays ohne `length > 0` Check führt zu Layout-Löchern (Layout Shifts).

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- `src/components/layout/header.tsx`: Direkter Zugriff auf `window.innerWidth` vor dem Client-Mounting verursacht Hydration-Fehler.
- `src/components/visual/bento-card.tsx`: Zufallsgenerierte Animations-Delays (Math.random()) auf dem Server divergieren vom Client.

## 3. TYPESCRIPT-SCHWÄCHEN
- `src/app/(site)/api/route.ts`: Maskierte Typfehler (`as unknown as any`) und nicht vollständig implementierte Interfaces für API-Responses gefunden.
- `src/components/seo/schema-org.tsx`: Fehlende `satisfies Graph` Absicherung gegen `schema-dts`.

## 4. CORE WEB VITALS SÜNDEN & DESIGN-BRÜCHE
- `src/components/ui/image-optimized.tsx`: Fehlende `width`/`height` Attribute auf Bildern führen zu CLS.
- `src/app/(site)/globals.css`: Die visuelle Konsistenz leidet teilweise unter "schmutzigen" Grautönen (Hex-Farben statt reiner OKLCH-Werte). Die Schweizer Light Mode Doktrin wird nicht durchgängig eingehalten (fehlende 1px Kanten).
- `src/app/(site)/page.tsx`: Zu viele Kinetik-Effekte kämpfen gleichzeitig um Aufmerksamkeit. Reduzierung auf EINE dominante Signature-Interaktion ist zwingend erforderlich.
