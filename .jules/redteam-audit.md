# RED-TEAM AUDIT REPORT (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund 1:** Auf der Startseite (`src/app/(site)/page.tsx`) fehlen explizite "Loading"-Zustände bei den schnellen Einstiegen und Card-Links. Das führt bei Next.js App Router Navigation zu einem "Silent Loading" (kein visuelles Feedback bis der Server antwortet).
- **Befund 2:** Formulare unter `schluessel-nach-vorlage/anfrage/anfrage-formular.tsx` haben oft rudimentäres Error-Handling. Wenn die Verbindung abbricht, erhält der Nutzer ungenügendes visuelles Feedback.
- **Befund 3:** `gleichschliessende-zylinder/konfigurator/konfigurator.tsx` könnte an komplexen Stellen ohne ordentliches `useTransition` UI-Freezes verursachen.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund 1:** Zeitformate und lokale Währungsformate in `formatCents` könnten potenziell in Randfällen zu Hydration-Mismatches führen, wenn Locale-Abhängigkeiten auf dem Server (Vercel Node) und Client (Browser) abweichen.
- **Befund 2:** Potenzielle Nutzung von `window` in Animationen ohne `useEffect`-Guards in tieferliegenden Komponenten (z.B. bei komplexeren UI-Komponenten).

## 3. TypeScript-Schwächen
- **Befund 1:** Die `localBusinessSchema` in `JsonLd` sollte idealerweise explizit gegen Typen aus `schema-dts` verifiziert werden (`satisfies WithContext<LocalBusiness>`), anstatt nur generische Typen zu nutzen.
- **Befund 2:** Teilweise unvollständige Payload CMS Typen in Formularen, die asynchrone Mutations maskieren könnten.

## 4. Core Web Vitals Sünden
- **Befund 1:** `ImagePlaceholder` auf der Startseite ist gut gemeint, aber echte LCP-Bilder müssen rigoros mit `priority` und exakten Dimensionen geladen werden, um CLS zu vermeiden.
- **Befund 2:** Sub-optimale Font-Loading Strategien könnten zu kurzen FOUT (Flash of Unstyled Text) führen, was den "Swiss Light Mode" stört.

## 5. Design-Kritik nach Schweizer Ästhetik-Standards
- **Chromatische Reinheit:** Die Anwendung nutzt bereits viele gute Ansätze in `globals.css`, aber tiefere Sub-Grids und Karten brauchen eine noch reinere OKLCH-Basis.
- **Typografische Rhythmik:** Längere Fließtexte, besonders auf Serviceseiten und Artikeln, benötigen strengere `text-wrap: balance` oder `pretty` Regeln, um Orphans zu vermeiden.
- **Kinetische Disziplin:** Auf der Startseite kämpfen teils zu viele gleichförmige Kacheln. Eine dominante, physikalisch korrekte Kinetik fehlt noch.
