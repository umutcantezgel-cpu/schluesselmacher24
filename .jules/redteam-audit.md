# RED-TEAM AUDIT
## SILENT LOGIC DEATH & INTERAKTIONS-FALLEN
- Gefundene Aufrufe von window.scrollTo ohne Prüfung der Client-Seite in Flow.
- Formulare (wie in kasse-formular) leiten ungeschützt weiter (window.location.assign) ohne ausreichende Loading-States.

## HYDRATION MISMATCHES & SSR-KONFLIKTE
- localStorage-Zugriffe (lib/client-state.ts) könnten Hydration-Probleme bereiten, wenn sie nicht über useEffect gewrappt sind.
- useFlow scrollt ungesichert auf window, was bei SSR knallt, falls nicht abgesichert.

## TYPESCRIPT-SCHWÄCHEN
- Potenzielle Ungenauigkeiten bei Forms, Type-Casting bei third-party event-handlers.

## CORE WEB VITALS SÜNDEN
- Einige Images haben möglicherweise keine fixen Dimensions (Auszubauen).
