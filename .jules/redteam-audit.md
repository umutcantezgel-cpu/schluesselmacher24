# RED-TEAM AUDIT BEFUNDE

## 1. SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Viele Cards auf der Startseite nutzen lediglich `Link`-Tags ohne taktiles Feedback.
- Preis-Anzeigen bei Autoschlüsseln (z.B. in `components/autoschluessel/preis-anzeige.tsx`) haben keine animierten Count-ups, was das Value-Statement mindert.
- Accordions im Sicherheitsbereich öffnen sich abrupt, ohne physikalisch korrekte Federdämpfung.

## 2. HYDRATION MISMATCHES & SSR-KONFLIKTE
- Bisher keine massiven Hydration-Fehler gefunden, aber einige Client-Komponenten rendern Layouts verzögert.
- Bilder laden teilweise ohne explizite Höhe (z.B. in `components/ui/image-placeholder.tsx`), was Cumulative Layout Shifts verursachen kann.

## 3. CORE WEB VITALS SÜNDEN
- Die Startseite und Service-Seiten haben ausbaufähige Wortzahlen für eine tiefere semantische Autorität (aktuell teils unter 500 Wörter).
- Karten-Layouts nutzen noch kein durchgängiges CSS Subgrid, was zu ungleichen Höhen auf Desktop-Ansichten führen kann, wenn Texte unterschiedlich lang sind.

## 4. SCHWEIZER LIGHT MODE AESTHETICS (MARKEN-DNA)
- Kinetische Disziplin: Aktuell fehlt es an der "einen" dominanten Signature-Interaktion pro Route. Elemente wirken teilweise zu statisch.
- Chromatische Reinheit: OKLCH ist gut implementiert, jedoch fehlen die feinen Haarlinien-Kanten (1px) an vielen Container-Elementen.
