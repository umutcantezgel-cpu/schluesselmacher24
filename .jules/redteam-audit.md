# RED-TEAM AUDIT REPORT

## 1. Silent Logic Death & Interaktions-Fallen
- Mehrere `onClick`-Handler in bestehenden Formularen führen ins Leere oder protokollieren nur über `console.log`.
- Fehlende Ladezustände bei Netzwerk-Anfragen verursachen Ghost-Klicks und Frustration.
- Bedingte Renderings hinterlassen Layout-Sprünge (Layout-Löcher), wenn Arrays leer sind.

## 2. Hydration Mismatches & SSR-Konflikte
- Unsaubere Zugriffe auf `window` und `localStorage` verursachen React-Hydration-Fehler.
- Datumsformatierungen differieren zwischen Server und Client.

## 3. TypeScript-Schwächen
- Typ-Casting per `as unknown as Type` maskiert tieferliegende Schema-Diskrepanzen.
- Fehlende `satisfies Graph`-Absicherungen in Schema.org-Integrationen gefährden die strukturierte Datenqualität.

## 4. Core Web Vitals Sünden
- Nicht alle Bilder verfügen über explizite Dimensionen oder Aspect-Ratios, was LCP und CLS verschlechtert.
- Heavy Third-Party-Libs werden unnötigerweise im Client-Bundle geladen, statt via RSC isoliert zu bleiben.

## Visuelle Kritik (Schweizer Aesthetik)
- Chromatische Unreinheiten: Einzelne Hex-Werte stören die durchgehende OKLCH-Disziplin.
- Typografische Dissonanzen: Zu viele Widows und fehlendes negatives Tracking bei Headlines.
- Kinetische Disziplin: Zu viele Animationen konkurrieren. Reduktion auf *eine* Signature-Interaktion pro Route ist zwingend erforderlich.
