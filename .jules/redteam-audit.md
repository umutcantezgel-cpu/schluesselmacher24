# RED-TEAM AUDIT (JC-PHILOSOPHER-REDTEAM-v1)

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- **Warenkorb & Kasse**: Fehlende visuelle Ladezustände beim Submit; Formular ist zu starr, "Silent Death" bei Netzwerkproblemen.
- **Konfiguratoren (Schließanlagen)**: Bei fehlender Auswahl blockieren die Schritte, aber es gibt keine präzise Fehlermeldung am Button, weshalb Nutzer frustriert abbrechen könnten.
- **Buttons (Global)**: Einige `<button>` Elemente nutzen unzureichende `aria-busy` oder `disabled` Zustände, die nicht visuell per Spinner gestützt werden.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- **Datum/Zeit**: Datumsformatierungen bei Terminanfragen könnten zu SSR-Mismatches führen, wenn sie nicht lokalisiert per Hydration-Guard gerendert werden.
- **Zufallszahlen/IDs**: Einige Flow-Schritte nutzen generierte IDs, die ohne explizite Server/Client Sync zu Fehlern in React 19 führen können.

## 3. TYPESCRIPT-SCHWÄCHEN
- **Schema.org**: Typisierung für JSON-LD Metadaten ist teilweise lose (z.B. `any` oder nicht validiert gegen `schema-dts`).
- **Interfaces**: Diverse Datenstrukturen in `src/lib/data` könnten noch strikter typisiert werden (Vermeidung von `as unknown`).

## 4. CORE WEB VITALS SÜNDEN
- **Bilder (Hero/Showcase)**: Hero-Bilder haben keine strikten Aspect-Ratios (reservierter Platz), was in leichten Layout Shifts beim Laden resultieren kann.
- **CSS LCP**: Kritische Pfade für Schriften und CSS könnten weiter harmonisiert werden für einen sauberen First Paint.

## DESIGN-KRITIK (SCHWEIZER AESTHETIK-STANDARDS)
- **Farben/Chromatische Reinheit**: Harte Hex-Werte und intransparente Grautöne stören die Schweizer Light Mode Marken-DNA. Wir müssen konsequent OKLCH nutzen.
- **Kinetische Disziplin**: Es gibt teilweise unkoordinierte Hover-Animationen. Fokus auf *eine* dominante Signature-Interaktion pro Route.
