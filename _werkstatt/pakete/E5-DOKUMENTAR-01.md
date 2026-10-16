E5-DOKUMENTAR-01 · Rolle Dokumentar · Modell Haiku 5.5 · Stufe 1 · Kern-Version 1.12 · Schreibrechte (exakt): `README.md`, `UMSETZUNG.md` (nur ein Hinweisblock ganz oben) · Umfang: README auf den Ist-Stand, UMSETZUNG.md als historisch kennzeichnen (Abnahmekriterium Z-10, MENSCHEN M-13)

## Rollenbriefing
Du bist Dokumentar. Du beschreibst, was im Repository wirklich steht – jede Aussage hat einen Beleg (Datei, Skript, Konfiguration), den du gelesen hast. Häufige Fehler: Aussagen aus Erinnerung oder aus veralteten Dokumenten übernehmen, Befehle nennen, die es nicht gibt, Werbesprache. Du committest und pushst nie und änderst keine anderen Dateien.

## Aufgabe in einem Satz
Bringe `README.md` auf den Ist-Stand des Projekts (Stack, Befehle, Datenschicht, Designsystem, Grafik- und Bewegungssystem, Tests, Inhaltspflege, offene Anbindungen) und setze über `UMSETZUNG.md` einen kurzen Hinweis, dass das Dokument einen älteren Stand beschreibt.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Quellen (lesen, bevor du schreibst)
- `package.json` (Skripte, Abhängigkeiten), `next.config.ts`, `tailwind.config.ts`, `vitest.config.ts`, `src/payload.config.ts` (oder der Pfad, den `package.json`/`next.config.ts` nennt), `.env.example` falls vorhanden (nur Namen der Variablen nennen, nie Werte), `src/lib/data/` (Adapter, Umschalten über `DATABASE_URL`/`SM24_DATA`), `src/app/(site)/globals.css` (Tokens), `src/components/visual/README.md` (Formsystem, Generatoren, Bewegung), `_werkstatt/KERN.md` (Leitidee K-001, Prinzipien K-003, Bewegungsregister K-007), `_werkstatt/STATUS.md` Abschnitt „Einrichtung“ (Build als root, DB-Tests), `UMSETZUNG.md` (was davon noch stimmt, was nicht), `_werkstatt/MENSCHEN.md` (offene Punkte für Menschen).
- Prüfe jede Pfadangabe mit `ls`, jedes Skript in `package.json`.

## Auftrag
1. **`README.md`** (deutsch, sachlich, höchstens etwa 150 Zeilen), Abschnitte:
   - Kurzbeschreibung (zwei Sätze).
   - **Entwicklung:** Befehle aus `package.json` (nur vorhandene Skripte), Hinweis auf den JSON-Modus ohne Datenbank (`SM24_DATA=json`), Build-Hinweis aus STATUS („`npm run build` startet lokal eine Datenbank; als root scheitert `initdb`; ohne Datenbank: `SM24_DATA=json npx next build`“ – nur wenn die Belege das tragen).
   - **Technischer Aufbau:** Stack mit Versionen aus `package.json`; Datenschicht (Payload auf Postgres, JSON-Adapter auf `content/`); Ablage der Tokens (`src/app/(site)/globals.css`, nicht `src/app/globals.css`).
   - **Gestaltung:** Leitidee in einem Satz (K-001), Verweis auf `_werkstatt/KERN.md` und `src/components/visual/README.md`; Tokens (Schrift-, Dauer-, Kurven-, Schatten-Skala), eine Icon-Familie (Fach-Icons und Glyphen), Grafikgeneratoren mit Registry, Bewegungsregister mit reduzierter Bewegung.
   - **Tests:** Unit-Tests (`vitest`), DB-Tests (wie in STATUS beschrieben), Zahl der Testdateien nur, wenn du sie gezählt hast (`find src -name '*.test.ts*' | wc -l`).
   - **Inhaltspflege:** die vorhandene Tabelle prüfen und auf den Ist-Stand bringen (Backend unter `/admin` mit Anmeldung, falls belegt; Dateien in `content/` mit ihrem Inhalt).
   - **Offene Punkte:** Zahlung, Mailversand, Datei-Ablage (Beleg: `src/lib/integrations/`), Verweis auf `_werkstatt/MENSCHEN.md`.
   - **Gestaltungslauf:** ein Absatz zu `_werkstatt/` (Auftrag, Kern, Plan, Berichte, Werkzeuge mit eigener Paketdatei; nicht Teil der Website).
2. **`UMSETZUNG.md`:** ganz oben, vor der ersten Überschrift, ein Hinweis als Zitat: „Historisch: Dieses Dokument beschreibt den Stand vom 15.09.2026 (JSON-Backend ohne Anmeldung). Den aktuellen Stand beschreiben `README.md`, `_werkstatt/KERN.md` und `src/components/visual/README.md`.“ (Datum und Beschreibung aus der Datei selbst und aus M-13 prüfen). Sonst nichts an der Datei ändern.

## Grenzen
- Nur die zwei Dateien. Keine Zugangsdaten, Schlüssel oder Werte aus Umgebungsdateien; Variablennamen nur, wenn sie in `.env.example` oder im Code stehen.
- Keine erfundenen Zahlen, keine Werbesprache, keine Aussagen über Leistung oder Sicherheit ohne Beleg.
- Nie Dateien löschen.

## Prüfung
- Jeder Pfad in der README existiert (`ls`), jedes genannte Skript steht in `package.json`.
- `npx markdownlint` gibt es nicht im Projekt; prüfe stattdessen von Hand: Überschriften-Hierarchie, Codeblöcke mit Sprache, Tabellen vollständig.
- Liste im Bericht jede Aussage der README mit ihrem Beleg (Datei:Zeile).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · BELEGE · OFFENE FRAGEN

Letzte Zeile: === ENDE E5-DOKUMENTAR-01 · BEREIT ZUR RÜCKGABE ===
