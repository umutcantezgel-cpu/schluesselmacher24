# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Befund:** Auf diversen Anfrage-Seiten (`autoschluessel/anfrage`, `schluessel-nach-vorlage/anfrage`) fehlen Loading-States auf den Formularen während des API-Calls oder sie rufen leere Callbacks auf.
- **Befund:** Konfigurator-Layouts zeigen vereinzelt "Löcher" bei fehlenden Props oder leerem State.

## 2. Hydration Mismatches & SSR-Konflikte
- **Befund:** Direkte Zugriffe auf den `window` oder `localStorage` bei den Konfiguratoren (`gleichschliessende-zylinder/konfigurator`, `elektronische-zutrittsloesungen/konfigurator`) ohne korrekte Mounting-Guards, was zu kurzen Flackereffekten nach Hydration führt.

## 3. TypeScript-Schwächen
- **Befund:** Vereinzelte `as unknown as Type` Castings bei komplexen Formulardaten oder CMS-Rückgaben, was die Typsicherheit schwächt.
- **Befund:** Unvollständige Schema.org Typisierungen für lokale Standorte.

## 4. Core Web Vitals Sünden
- **Befund:** Fehlende explizite Dimensionen oder Aspect Ratios bei Bild-Platzhaltern in Artikeln (`artikel/[slug]`) und Ratgebern.

## 5. Design-Kritik (Schweizer Ästhetik)
- **Befund:** Inkonsistente Verwendung der `oklch` Farbpalette in einigen Bereichen. Es finden sich vereinzelt noch hartcodierte Hex-Werte.
- **Befund:** Kinetische Überladung auf der Startseite (`page.tsx`) durch zu viele gleichzeitige Transitionen, anstatt einer starken Signature-Animation.
