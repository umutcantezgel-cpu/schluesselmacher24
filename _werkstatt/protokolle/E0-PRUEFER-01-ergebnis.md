# E0-PRUEFER-01 · Ergebnis Prüfstand (Ausgangsstand)

## Wege und Befehle

| Weg | Befehl | Ergebnis | Dauer | Protokoll |
|---|---|---|---|---|
| Installation | `npm ci` | Exit 0, 779 Pakete | 43 s | `_werkstatt/protokolle/E0-PRUEFER-01-npm-ci.log` |
| 1 (vorhandenes Skript) | `npm run build` | Exit 1, Abbruch bei `initdb` als root: „initdb: error: cannot be run as root“ | 0 s | `…-build-weg1.log` |
| 2a (DB als `ubuntu`) | `runuser -u ubuntu -- env SM24_PG_DIR=… node scripts/db.mjs start` | Exit 0, Postgres 17.10 auf 127.0.0.1:5433; Binärdateien für `ubuntu` lesbar und ausführbar, keine Rechteänderung nötig | < 2 s | `…-db-start.log` |
| 2b (Migration) | `npx payload migrate` (mit `DATABASE_URL`, `PAYLOAD_SECRET` nur in der Befehlszeile) | Exit 0, 4 Migrationen angewendet | 3 s | `…-db-migrate.log` |
| 2c (Seed) | `npx payload run src/scripts/seed.ts` | Exit 0, „Fertig.“ | 7 s | `…-db-seed.log` |
| 2d | `node scripts/db.mjs stop` (als `ubuntu`) | Exit 0, „Postgres gestoppt.“ | < 1 s | — |
| 3 (Build-Gate ohne DB) | `SM24_DATA=json npx next build` | Exit 0, „Compiled successfully“, 198/198 Seiten, 0 Warnungen | 48 s | `…-build-weg3.log` |
| 8a (DB-Tests als root) | `npx vitest run -c vitest.db.config.ts` | Exit 1, 0 Tests, Startfehler `initdb` als root | 1 s | `…-test-db-root.log` |
| 8b (DB-Tests als `ubuntu`, Port 5434) | `runuser -u ubuntu -- … npx vitest run -c vitest.db.config.ts` | Exit 1: Vitest legt eine Temp-Config im root-eigenen Repo ab (EACCES) | < 1 s | `…-test-db-ubuntu.log` (Abbruch) |
| 8c (zweiter Weg `ubuntu`) | wie 8b, aber Config über externen Wrapper `/home/ubuntu/sm24-pg/vitest-wrapper/vitest.db.wrapper.mjs` (importiert die unveränderte Repo-Config) | Exit 1: 39 bestanden, 13 fehlgeschlagen (EACCES bei `mkdir …/private-uploads`) | 30 s | `…-test-db-ubuntu.log` |

## Prüfungen

| Prüfung | Ergebnis in Zahlen | Protokoll |
|---|---|---|
| Build-Gate (Weg 3) | Exit 0; 198 von 198 Seiten; 0 Warnungen | `…-build-weg3.log` |
| TypeScript (`tsc --noEmit`) | Exit 0; 0 Fehler (13 s) | `…-typecheck.log` |
| ESLint (`eslint .`) | Exit 0; 0 Fehler, 0 Warnungen (15 s) | `…-lint.log` |
| Unit-Tests (`vitest run`), Lauf 1 | 31/31 Dateien, 680/680 Tests bestanden, Exit 0 | `…-test-unit.log` |
| Unit-Tests, Lauf 2 und 3 | 31/31 Dateien, 680/680 Tests bestanden, Exit 0; Wandzeit 6,56 s und 6,76 s | `…-test-unit-lauf2.log`, `…-test-unit-lauf3.log` |
| Unit-Tests Median Wandzeit | ca. 6,6 s (Läufe 6, 6,56, 6,76 s) | — |
| DB-Tests als root | 0 Tests (Startfehler) | `…-test-db-root.log` |
| DB-Tests als `ubuntu` (Wrapper) | 7 Dateien: 5 bestanden, 2 fehlgeschlagen; 52 Tests: 39 bestanden, 13 fehlgeschlagen | `…-test-db-ubuntu.log` |
| Probestart `next start -p 3000` (JSON-Modus) | Server bereit nach 2 s; Warnung im Log: „PAYLOAD_SECRET fehlt — Backend deaktiviert“ | `…-probestart.log`, `/tmp/sm24-next.log` |
| HTTP-Status der 15 Adressen | 15 von 15 mit 200 | `…-probestart.log` |

## Hinweise

- Build-Gate: Weg 3 (`SM24_DATA=json npx next build`) ist der Build, der ohne Datenbank und ohne root-Probleme läuft. Weg 1 scheitert als root an `initdb`.
- Ausgangsstand Tests: Unit-Tests (31 Dateien, 680 Tests) sind grün und bilden die Basis. Die DB-Tests sind unter `ubuntu` nur teilweise lauffähig; die 13 Fehler sind Schreibrechte-Probleme im root-eigenen Repo (`private-uploads/`, Vitest-Cache), kein Code-Befund.
- Der Server läuft (PID 3972 in `/tmp/sm24-next.pid`) und bleibt laufend.
- Zusatzdatei außerhalb des Repos: `/home/ubuntu/sm24-pg/vitest-wrapper/vitest.db.wrapper.mjs` (nur für Weg 8c).
