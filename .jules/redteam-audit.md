# Red-Team Audit Report

## 1. Silent Logic Death & Interaktions-Fallen
- `src/components/forms/photo-upload.tsx`: Gefundene onClick-Handler, die keine Fehlerbehandlung bei Upload-Fehlern haben.
- `src/app/(site)/autoschluessel/page.tsx`: Layout-Löcher bei leerem State für Fahrzeugmarken.

## 2. Hydration Mismatches & SSR-Konflikte
- `src/components/autoschluessel/preis-anzeige.tsx`: Zugriff auf `window.innerWidth` ohne Mounting-Guard gefunden.

## 3. TypeScript-Schwächen
- `src/components/seo/json-ld.tsx`: Maskierte Typfehler bei den Props.

## 4. Core Web Vitals Sünden
- `src/app/(site)/page.tsx`: Bilder ohne explizite Dimensionen gefunden.
- Keine Ladezustände bei komplexen Rechnern.
