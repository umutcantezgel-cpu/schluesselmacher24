E2-GRAFIKER-05 · Rolle Grafiker · Modell Haiku 5.5 · Stufe 2 · Kern-Version 1.1 · Schreibrechte (exakt): `src/components/visual/generators/grafik-basis.tsx`, `schluessel.tsx`, `zylinder-mass.tsx`, `schliessplan.tsx`, `code-fundstelle.tsx`, `zutritt-signal.tsx`, `tuer-schutz.tsx` (alle in `src/components/visual/generators/`); dazu deren Testdateien nur, falls ein Test eine Strichstärke wörtlich prüft · Umfang: Strichskala der Generatoren vereinheitlichen

## Rollenbriefing
Du bist Grafiker. Du setzt SVG-Arbeiten nach Formsystem und Register um. Häufige Fehler: mehr animieren als vorgesehen; reduzierte Bewegung vergessen; uneinheitliche Strichstärken. Du committest und pushst nie und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Führe alle Strichstärken-Literale in den sieben Generatoren auf eine benannte Strichskala in `grafik-basis.tsx` zurück, ohne das Aussehen spürbar zu verändern.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug (KERN.md 1.1, unveränderlich)
- K-008: Generatoren nutzen eine Strichskala: `KONTUR` 2,25 · `LINIE` 1,5 · `HILFSLINIE` 1. Die vorhandenen Exporte von `grafik-basis.tsx` bleiben unverändert und mit gleichen Werten erhalten. Andere Generatoren und Komponenten importieren sie.
- Erweitere die Skala um genau diese benannten Zwischenstufen, als `export const` mit kurzem Kommentar:
  - `DETAIL` = 0,75 (feine Details wie Kerben im Raster)
  - `LINIE_STARK` = 2 (für bisher `LINIE + 0.5` und `2`)
  - `AKZENT` = 3 (für bisher `KONTUR + 0.75` und `3`)
  - `MARKE` = 4 (für sehr kräftige Marken)
- Jedes andere Literal rundest du auf die nächstgelegene Stufe.

## Maßstab
Muster: `generators/profilschnitt.tsx` (nutzt bereits Namen wie `KONTUR + 0.75`; bitte NICHT ändern, gehört dem Orchestrator) und die Kommentare in `grafik-basis.tsx`.

## Grenzen
- Nur die Dateien aus den Schreibrechten. Nicht ändern: `profilschnitt.tsx`, `stiftzuhaltung.tsx` (entsteht gerade in einem anderen Paket), `registry*`, README.
- **Ausgabe bleibt sinngleich:** Nur `stroke-width`-Werte dürfen sich ändern, und nur auf die nächste Skalenstufe. Geometrie, Klassen, Texte und Animationen bleiben gleich.
- Bestehende Tests nicht lockern. Prüft ein Test eine Strichstärke wörtlich (z. B. `stroke-width="2"`), ändere ihn nur, wenn sich der Wert durch die Rundung ändert, und gib im Bericht eine Alt-Neu-Liste an.

## Schritte
1. Lies alle sieben Dateien und `grafik-basis.tsx`. Liste jedes `strokeWidth`-Literal (Zahl oder Ausdruck wie `LINIE + 0.25`) mit Fundstelle.
2. Ergänze die vier Skalenstufen in `grafik-basis.tsx`.
3. Ersetze in jeder Datei jedes Literal durch die nächstgelegene benannte Stufe, so dass am Ende keine Zahl und kein Ausdruck mit `+` mehr in `strokeWidth={…}` steht.
   - `LINIE + 0.25` (1,75) → `LINIE_STARK`
   - `LINIE + 0.5` (2) → `LINIE_STARK`
   - `2` → `LINIE_STARK`
   - `2.5` → `KONTUR`
   - `4` → `MARKE`
   - übrige Werte nach dem gleichen Prinzip der nächsten Stufe
4. Prüfe mit `grep -n "strokeWidth={[0-9]" src/components/visual/generators/*.tsx` und `grep -n "strokeWidth={[A-Z_]* +" …`, dass außer `profilschnitt.tsx` und `stiftzuhaltung.tsx` nichts mehr übrig ist.

## Schnellprüfung (Prüfstufe A) und Selbstprüfung
- `npx vitest run src/components/visual` grün (Zahl nennen; ein erwarteter Rotfall in `registry.test.tsx` wegen `stiftzuhaltung` aus einem anderen Paket zählt nicht).
- `npx eslint src/components/visual/generators` und `npx tsc --noEmit` ohne Fehler.
- Liste im Bericht: je Datei Zahl der ersetzten Literale und die Alt-Neu-Werte (z. B. `2 → LINIE_STARK (2)`, `2.5 → KONTUR (2,25)`).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BILDBELEGE (keine nötig) · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E2-GRAFIKER-05 · BEREIT ZUR RÜCKGABE ===
