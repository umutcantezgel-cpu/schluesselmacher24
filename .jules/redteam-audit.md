# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/forms/photo-upload.tsx`: Fehlt Ladezustand beim Upload, onSubmit könnte ins Leere laufen bei Netzwerkausfall.
- `src/components/autoschluessel/termin-auswahl.tsx`: onClick-Handler ohne ausreichende Fehlerbehandlung bei API-Timeout.

## 2. Hydration Mismatches & SSR-Konflikte
- Potenzielle localStorage Zugriffe ohne useEffect in `src/components/calculator/service-einsatz-rechner.tsx` könnten Hydration-Mismatches auslösen.

## 3. TypeScript-Schwächen
- Unvollständige Interfaces bei Schema.org-Graphen in `src/components/seo/json-ld.tsx` - fehlende `satisfies Graph` Prüfung.

## 4. Core Web Vitals Sünden
- `src/components/ui/image-placeholder.tsx`: Bilder teilweise ohne explizite Dimensionen oder Aspect-Ratio-Reservierungen.

## 5. Design-Kritik (Swiss Light Mode)
- Chromatische Reinheit: Einige Schatten könnten saubere OKLCH-Tokens anstelle von rgba-Werten vertragen.
- Kinetische Disziplin: Mehrere Animationen in `src/components/visual/motion/` könnten zu einer dominanteren Signature-Interaktion reduziert werden.
