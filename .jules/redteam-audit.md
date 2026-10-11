# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- Mehrere leere Event-Handler in Formularkomponenten entdeckt (z.B. in `app/warenkorb/page.tsx`).
- Fehlende Ladeindikatoren in `app/service-und-termin/page.tsx` bei der Terminbuchung, was zu Konfusionsmomenten führt.
- Bedingte Renderings mit leeren Arrays verursachen vereinzelt feine Layout-Löcher.

## 2. Hydration Mismatches & SSR-Konflikte
- Einige Client-seitige Datumsformatierungen verursachen SSR-Diskrepanzen.
- Unsauberer Zugriff auf `window` ohne Guard in einigen älteren Komponenten gefunden.

## 3. TypeScript-Schwächen
- Unsichere Type-Casts (`as unknown as Type`) in den GraphQL/API-Handlern entdeckt, was Schema-Sicherheit untergräbt.
- Schema.org JSON-LD Objekte sind nicht immer mit `satisfies Graph` gegen `schema-dts` abgesichert.

## 4. Core Web Vitals Sünden
- Fehlende explizite Dimensionen auf diversen Artikel-Bildern in `app/autoschluessel/page.tsx`.
- Drittanbieter-Scripte (wie Map-Libraries) teilweise nicht optimal verzögert geladen.

## Design-Kritik (Schweizer Aesthetik-Standards)
- **Chromatische Reinheit**: Einige Grautöne sind hartcodierte Hex-Werte statt reiner OKLCH-Tokens.
- **Typografische Rhythmik**: Vereinzelt Widows in den FAQ-Sektionen.
- **Kinetische Disziplin**: Zu viele unkoordinierte Fade-Ins; Fokus muss auf EINE dominante Signature-Interaktion pro Route gesetzt werden.
