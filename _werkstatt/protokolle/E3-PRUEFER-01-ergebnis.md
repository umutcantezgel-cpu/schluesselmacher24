# E3-PRUEFER-01 · Ergebnis Prüfstufe A

Stand: 2026-10-16 · Port 3001 (nur lesend) · Keine Projektdatei geändert · Nicht committet.

## Prüfung · Ergebnis · Beleg

| Paket | Prüfung | Ergebnis | Beleg |
|---|---|---|---|
| E3-L-09 | `npx tsc --noEmit` (Gesamtprojekt) | 0 Fehler | `_werkstatt/protokolle/E3-PRUEFER-01-typecheck.log` (leer) |
| E3-L-09 | eslint not-found.tsx, error.tsx, fehler-ansicht.tsx | 0 Befunde | `_werkstatt/protokolle/E3-PRUEFER-01-lint.log` |
| E3-L-09 | Wertesuche (4 Dateien + Test) | keine Funde | `_werkstatt/protokolle/E3-PRUEFER-01-werte-suche.json` |
| E3-L-09 | Quelltext: 404 mit genau einer h1 (`fehler-ansicht.tsx` Z. 47) | erfüllt | `src/components/layout/fehler-ansicht.tsx:47` |
| E3-L-09 | Quelltext: Fehlergrenze ruft `retry()`, `error.digest` nur bei Vorhandensein | erfüllt | `src/app/(site)/error.tsx` Z. 19, 29 |
| E3-L-09 | Quelltext: Texte nennen Ursache und nächsten Schritt; keine neue Abhängigkeit (`package.json` unverändert) | erfüllt | `not-found.tsx` Z. 9; `error.tsx` Z. 13; `git diff HEAD -- package.json` leer |
| E3-L-09 | Bild: Adresse `/gibt-es-nicht-pruefung` (Pflicht-URL) | NICHT ERFÜLLT: zeigt die Standardseite von Next.js („404 / This page could not be found.“), ohne Site-Kopf, ohne Zylinderschnitt, ohne Bereichsliste | `/root/sm24-bilder/E3-PRUEFER-01/fehler-404__{mobil,tablet,desktop}__ganz.jpg`, `bild.json` |
| E3-L-09 | Bild: innerhalb der Site, `/schluessel-nach-code/gibt-es-nicht-pruefung` (Zusatzprobe) | erfüllt: Zylinderschnitt mit Code 404, Auswege, Bereichsliste mit 9 Einträgen, Site-Kopf und -Fuß | `/root/sm24-bilder/E3-PRUEFER-01/fehler-404-in-site__{mobil,tablet,desktop}__ganz.jpg`, `bild-in-site.json` |
| E3-L-09 | Fehlergrenze zur Laufzeit ausgelöst | nicht geprüft (keine Testseite, die `error.tsx` auslöst) | OFFENE FRAGE |
| E3-L-14 | `npx tsc --noEmit` | 0 Fehler | `E3-PRUEFER-01-typecheck.log` |
| E3-L-14 | eslint `schluesselarten-reihe.tsx` und Test | 1 Warnung: `cn` ungenutzt (Z. 4) | `E3-PRUEFER-01-lint.log` |
| E3-L-14 | vitest `schluesselarten-reihe.test.tsx` (3 Tests) und `stiftzuhaltung.test.tsx` (10 Tests) | 13/13 bestanden | `E3-PRUEFER-01-test.log` |
| E3-L-14 | Wertesuche | keine Funde | `E3-PRUEFER-01-werte-suche.json` |
| E3-L-14 | Quelltext: vier Ansichten, je Bauform einmal, „Keyless“ nur als Zusatz, Staffelung ≤ 4 × 120 ms, Hinweis „nicht maßstäblich“ | erfüllt (durch Test belegt) | `schluesselarten-reihe.test.tsx` |
| E3-L-14 | Bild / Sichtprüfung des Zeichnungsblatts | nicht im Paketumfang; Blatt ist laut Quelltext noch nicht eingebunden, also nicht sichtbar | — |

## Urteil je Paket

- **E3-L-09 (404 und Fehlergrenze): NICHT BESTANDEN.** Grund: Die Pflicht-URL zeigt nicht die eigene 404-Seite. Nach den Befunden liegt die Ursache nahe, aber nicht geprüft: Für Adressen außerhalb der Route-Gruppe `(site)` gibt es keine `src/app/not-found.tsx`; `(site)/not-found.tsx` greift nur innerhalb dieser Gruppe. Innerhalb der Site wirkt die eigene 404-Seite (Zusatzprobe). Die Fehlergrenze ist nur im Quelltext belegt.
- **E3-L-14 (Zeichnungsblatt der Schlüsselarten): BESTANDEN MIT BEFUND.** Typecheck, Tests und Wertesuche ohne Befund. Eine Lint-Warnung (`cn` ungenutzt, Z. 4). Die Sichtprüfung entfällt laut Paket, weil das Blatt noch nicht eingebunden ist.

## Hinweise

- Die Fokus- und Hover-Zustände (Schritt 6) sind nicht belegt. Die Ganzseitenbilder zeigen keinen Fokus und keinen Hover.
- Mobil (Zusatzprobe, 390 px): Die untere Navigationsleiste überdeckt im Ganzseitenbild den Eintrag „Autoschlüssel“. Das kann ein Artefakt der Ganzseitenaufnahme bei fixierter Leiste sein. Nicht bewertet, OFFENE FRAGE.
- Im Quelltext der 404-Seite steht genau eine h1. In der Antwort der Zusatzprobe fand sich zusätzlich das Next-Fallback-h1 (`next-error-h1`) aus der Standardseite. Ob es im gerenderten DOM der Site-404 erscheint, ist nicht geprüft.
- Fremde Dateien: Die Lint-Warnung und die Befunde betreffen nur Pakete E3-L-09 und E3-L-14. Der Lauf hat keine fremden Befunde gefunden.
- Schreibbereich eingehalten: Protokolle unter `_werkstatt/protokolle/E3-PRUEFER-01-*`, Bilder unter `/root/sm24-bilder/E3-PRUEFER-01/`. Die Probe `E3-PRUEFER-01-curl-probe.txt` ist ein Hilfsprotokoll dieses Laufs.

=== ENDE E3-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
