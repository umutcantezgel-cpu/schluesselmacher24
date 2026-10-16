E3-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.3 · Schreibrechte (exakt): `_werkstatt/protokolle/E3-PRUEFER-01-*`, `/root/sm24-bilder/E3-PRUEFER-01/**` · Umfang: Prüfstufe A der Opus-Pakete E3-L-09 (404 und Fehlerseite) und E3-L-14 (Zeichnungsblatt der Schlüsselarten)

## Rollenbriefing
Du bist Prüfer. Du führst die Prüfungen deiner Stufe aus, deutest nicht und berichtest knapp mit Belegpfaden. Du versuchst, die Pakete abzulehnen; bestanden ist nur, was belegt ist. Du committest und pushst nie und änderst keine Projektdatei.

## Aufgabe in einem Satz
Prüfe die neue 404-Seite, die neue Fehlergrenze und das Zeichnungsblatt der Schlüsselarten nach Prüfstufe A.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- E3-L-09: `src/app/(site)/not-found.tsx`, `src/app/(site)/error.tsx` (Client, Props `error` und `retry` nach Next 16), `src/components/layout/fehler-ansicht.tsx` (gemeinsame Ansicht mit Generator `stiftzuhaltung`). KERN K-009 verlangt Fehlerseiten mit Charakter: Ursache, nächster Schritt, Auswege.
- E3-L-14: `src/components/autoschluessel/schluesselarten-reihe.tsx` und Test (großer Moment B-21, noch nicht eingebunden).
- Gleichzeitig arbeitet der Orchestrator an der Startseite und an gemeinsamen Bausteinen (`page.tsx`, `globals.css`, `image-placeholder`, Generator `profilschnitt`, Hülle `fraesbahn-bewegung`, `section`, `area-theme`), und Welle E3-A an Formular-Bausteinen. Fehler in diesen fremden Dateien meldest du getrennt; sie zählen nicht gegen deine Pakete.

## Maßstab
Prüfstufe A wie in `_werkstatt/pakete/E2-PRUEFER-01.md` (Schritte 1–3), beschränkt auf diese Dateien.

## Grenzen
Nichts ändern, nichts löschen, nicht committen. Kein Build. Entwicklungsserver auf Port 3001 nur lesen.

## Schritte
1. `npx tsc --noEmit` → Fehler nur in den genannten Dateien zählen (andere getrennt nennen). Protokoll `E3-PRUEFER-01-typecheck.log`.
2. `npx eslint` über die vier Dateien und den Test → Befunde.
3. `npx vitest run src/components/autoschluessel src/components/visual/generators/stiftzuhaltung.test.tsx` → Ergebnis.
4. `node _werkstatt/werkzeuge/werte-suche.mjs` mit den vier Dateien → Funde.
5. Sachprüfung am Quelltext: Die 404-Seite hat genau eine h1; die Fehlergrenze ruft `retry()` und zeigt `error.digest` nur, wenn vorhanden; keine Geschäftslogik, keine neuen Abhängigkeiten; Texte nennen Ursache und nächsten Schritt.
6. Bilder über Port 3001 (bei erstem Aufruf bis 60 s Kompilieren): `cd _werkstatt/werkzeuge && SM24_BASIS_URL=http://localhost:3001 node bild.mjs /gibt-es-nicht-pruefung --geraet alle --ganz --ziel /root/sm24-bilder/E3-PRUEFER-01 --name fehler-404 --json /root/sm24-bilder/E3-PRUEFER-01/bild.json`. Sieh jedes Bild an: Grafik sichtbar und lesbar, kein Überlauf, Bereichsliste vollständig, Fokus- und Hover-Zustände plausibel.
7. Schreibe `_werkstatt/protokolle/E3-PRUEFER-01-ergebnis.md` mit einer Tabelle „Prüfung · Ergebnis · Beleg“ je Paket und dem Urteil bestanden/nicht bestanden je Paket.

## Schnellprüfung und Selbstprüfung
Jede Zahl hat ein Protokoll; jedes Urteil hat einen Beleg.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE · OFFENE FRAGEN

Letzte Zeile: === ENDE E3-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
