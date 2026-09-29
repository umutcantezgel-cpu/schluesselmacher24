# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **app/(site)/autoschluessel/anfrage/page.tsx**: Formular hat keine robusten Ladezustände bei Submit, möglicherweise "Silent Logic Death" bei Netzwerk-Latenz.
- **app/(site)/schluessel-nach-vorlage/anfrage/page.tsx**: Ähnliches Problem, fehlende Fehler-Behandlung bei Upload-Fehlschlägen oder langsamen Verbindungen.
- **components/autoschluessel/termin-auswahl.tsx**: Interaktions-Fallen bei der Termin-Auswahl; fehlende Optimistic Updates für schnelle UX.

## 2. Hydration Mismatches & SSR-Konflikte
- Generell: Fehlende Memoisierung von Client-Zuständen, die beim Server-Side-Rendering zu Mismatches führen können (z. B. lokalisierte Datumsformate in Termin-Komponenten).

## 3. TypeScript-Schwächen
- **components/seo/json-ld.tsx**: Überprüfen, ob Schema.org Objekte konsequent mit `satisfies Graph` gegen `schema-dts` abgesichert sind.
- Fehlende strikte Typisierung bei dynamischen Routen-Parametern, insbesondere `params` und `searchParams`, die in Next.js 15+ Promises sind.

## 4. Core Web Vitals Sünden
- **app/(site)/page.tsx**: Überprüfen, ob Bilder im Bento-Grid konsistente `width` und `height` Attribute haben, um Layout-Shifts (CLS) zu vermeiden.
- CSS Subgrid fehlt in Karten-Layouts, was zu ungleicher Ausrichtung bei variierendem Content führt.

## 5. Design-Kritik (Swiss Light Mode Aesthetic)
- **Chromatische Reinheit**: Hartcodierte Hex-Werte oder unsaubere Grautöne anstelle von OKLCH-Tokens.
- **Kinetische Disziplin**: Zu viele oder unkoordinierte Animationen; Fokus auf EINE dominante, physikalisch basierte Interaktion pro Seite fehlt.
