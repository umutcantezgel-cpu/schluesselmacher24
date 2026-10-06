# RED-TEAM AUDIT
## SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefundene onSubmit-Handler, die unvollständig verdrahtet sind in schluessel-nach-vorlage/anfrage.
- Fehlende Ladezustände in der service-und-termin/anfrage.
- Ungesicherte Hydration-Renderings bei Datumsanzeigen im Warenkorb.

## HYDRATION MISMATCHES & SSR-KONFLIKTE
- localStorage-Zugriffe im Konfigurator ohne useEffect-Mount-Guard.

## TYPESCRIPT-SCHWÄCHEN
- Inkomplette Interfaces für Fahrzeugmarken in autoschluessel/marken/[make]/[model].
- Maskierte Typfehler `as any` im kasse-Prozess.

## CORE WEB VITALS SÜNDEN
- CLS-Risiken durch fehlende Aspect-Ratios bei Hero-Images in tuer-und-schliesstechnik.
- Schwere Client-Side-Renderings in den Suchseiten.

## SCHWEIZER LIGHT MODE AESTHETIK-AUDIT
- Teilweise harte Hex-Werte gefunden (#333, #000). Muss zu oklch(0.988 0.002 260) refaktoriert werden.
- Kinetische Unruhe in den Konfigurator-Transitions.
