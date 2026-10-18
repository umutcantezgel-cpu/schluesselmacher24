# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Befund 1:** Mehrere leere `onClick`-Handler in Button-Komponenten (z.B. in `src/components/schliessanlagen/system-erklaerung.tsx`), die lediglich als Platzhalter dienen und keine echte Funktion auslösen.
- **Befund 2:** Formularkomponenten in `src/app/(site)/service-und-termin/anfrage/page.tsx` zeigen bei langsamen Netzwerkverbindungen keinen Loading-State (fehlendes `useFormStatus` / `useActionState`), was zu "Silent Logic Death" führt.
- **Befund 3:** Bei leeren Warenkörben (`src/app/(site)/warenkorb/page.tsx`) entstehen Layout-Löcher statt eines sauberen Empty-States.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Befund 1:** Unkontrollierter Zugriff auf `localStorage` in `src/components/layout/header.tsx` ohne useEffect-Mounting-Guard, was im App Router zu Hydration Mismatches führt.
- **Befund 2:** Datumsformatierungen auf Client- und Serverseite in den Artikel-Detailseiten (`src/app/(site)/artikel/[slug]/page.tsx`) differieren je nach lokaler Zeitzone.

## 3. TYPESCRIPT-SCHWÄCHEN
- **Befund 1:** Maskierte Typfehler in diversen UI-Komponenten, bei denen APIs mit `as unknown as ComponentType` umgangen werden, anstatt saubere Interfaces zu definieren.
- **Befund 2:** Schema.org JSON-LD Einbindungen in `src/components/seo/json-ld.tsx` sind nicht konsistent mit `satisfies Graph` gegen `schema-dts` abgesichert.

## 4. CORE WEB VITALS SÜNDEN
- **Befund 1:** Fehlende explizite Breiten/Höhen-Angaben bei Hero-Bildern auf der Startseite (`src/app/(site)/page.tsx`), was zu messbaren Cumulative Layout Shifts (CLS) führt.
- **Befund 2:** Schwere Drittanbieter-Bibliotheken werden unbedacht in Client-Komponenten importiert, anstatt dynamisch via `next/dynamic` geladen zu werden.

## 5. DESIGN-KRITIK (SCHWEIZER AESTHETIK-STANDARDS)
- **Chromatische Reinheit:** Veraltete HEX/HSL-Werte statt einheitlicher OKLCH-Tokens (oklch(0.988 0.002 260) als Base).
- **Typografische Rhythmik:** Unausgewogene Zeilenumbrüche (Widows/Orphans) in den Fließtexten der Ratgeber-Artikel (`src/app/(site)/ratgeber/page.tsx`).
- **Kinetische Disziplin:** Zu viele unkoordinierte CSS-Transitions, die um Aufmerksamkeit kämpfen; Notwendigkeit eines Rückbaus auf eine dominante Signature-Interaktion pro Route.
