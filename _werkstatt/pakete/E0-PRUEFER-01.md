E0-PRUEFER-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 1 · Kern-Version 0 (vor KERN) · Schreibrechte: nur `_werkstatt/protokolle/E0-PRUEFER-01-*.log` und `_werkstatt/protokolle/E0-PRUEFER-01-ergebnis.md` · Umfang: Abhängigkeiten installieren, drei Build-Wege, Typprüfung, Linter, Tests, Probestart

## Rollenbriefing
Du bist Prüfer. Du richtest den Prüfstand ein, führst Prüfungen aus und berichtest knapp mit Belegpfaden. Häufige Fehler: Einzelmessung statt Median; deuten statt berichten; über die Stufe hinaus prüfen. Du committest und pushst nie, änderst keine Projektdatei und meldest Fehler in fremden Dateien, statt sie zu beheben.

## Aufgabe in einem Satz
Stelle fest, auf welchen Wegen sich SCHLÜSSELMACHER24 in dieser Cloud-Umgebung bauen, prüfen und starten lässt, und halte den Ausgangsstand von Build, Typprüfung, Linter und Tests exakt fest.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Kern-Auszug
- Repository: `/home/user/schluesselmacher24`, Branch `claude/projekt-gestaltung-entwicklung-tofodh`. Die Umgebung läuft als **root**; `initdb` (embedded-postgres, `scripts/db.mjs`) verweigert root. Ein Nicht-root-Nutzer `ubuntu` existiert (`runuser -u ubuntu -- …`).
- `npm run build` startet ohne `DATABASE_URL` und ohne `VERCEL` zuerst `node scripts/db.mjs ensure && payload migrate && payload run src/scripts/seed.ts` (siehe `package.json`).
- Datenquelle: `SM24_DATA=json` oder fehlende `DATABASE_URL` → JSON-Adapter auf `content/` (`src/lib/data/index.ts:18-23`).

## Maßstab
Keine Referenzansicht nötig. Muster für Protokolle: eine Datei je Befehl in `_werkstatt/protokolle/`, Ergebnis kompakt in `E0-PRUEFER-01-ergebnis.md`.

## Grenzen
- Keine Änderung an Projektdateien, `package.json`, Lockfile, Konfigurationen, Tests oder `.env*`. Keine `.env`-Datei anlegen. Keine Zugangsdaten in Protokolle schreiben.
- Rechenintensive Befehle nacheinander, nie gleichzeitig. Lange Befehle mit Ausgabe in eine Protokolldatei (`> datei.log 2>&1`), Hintergrundprozesse mit `nohup … &` und PID-Datei unter `/tmp`.
- Kein Deploy, kein Push, kein Commit, kein Netzwerkdienst außer npm-Registry und Google Fonts (Build).
- Daten der Testdatenbank nur unter `/home/ubuntu/sm24-pg/` bzw. `/tmp`, nie im Repository.

## Schritte
1. `cd /home/user/schluesselmacher24 && npm ci > _werkstatt/protokolle/E0-PRUEFER-01-npm-ci.log 2>&1`; notiere Dauer und Exit-Code.
2. **Weg 1 (vorhandenes Skript):** `npm run build > _werkstatt/protokolle/E0-PRUEFER-01-build-weg1.log 2>&1`. Erwartung: Abbruch bei `initdb` als root. Notiere Exit-Code und die erste Fehlerzeile.
3. **Weg 2 (Datenbank als Nicht-root):**
   a. `mkdir -p /home/ubuntu/sm24-pg && chown -R ubuntu /home/ubuntu/sm24-pg`.
   b. `runuser -u ubuntu -- env SM24_PG_DIR=/home/ubuntu/sm24-pg/postgres node scripts/db.mjs start > _werkstatt/protokolle/E0-PRUEFER-01-db-start.log 2>&1` (Arbeitsverzeichnis bleibt das Repository). Prüfe, ob `node_modules/@embedded-postgres/linux-x64/native/bin` für `ubuntu` lesbar und ausführbar ist; falls nicht, OFFENE FRAGE statt Rechte zu ändern.
   c. Falls die Datenbank läuft: `DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5433/schluesselmacher24` setzen und `npx payload migrate` sowie `npx payload run src/scripts/seed.ts` ausführen (Protokolle `…-db-migrate.log`, `…-db-seed.log`). Fehlt `PAYLOAD_SECRET`, notiere das und setze für diesen Prüflauf nur in der Befehlszeile `PAYLOAD_SECRET=pruefstand-nur-lokal` (nie in eine Datei).
   d. Datenbank danach stoppen: `runuser -u ubuntu -- env SM24_PG_DIR=/home/ubuntu/sm24-pg/postgres node scripts/db.mjs stop`.
4. **Weg 3 (ohne Datenbank, Build-Gate):** `SM24_DATA=json npx next build > _werkstatt/protokolle/E0-PRUEFER-01-build-weg3.log 2>&1`. Notiere Exit-Code, Dauer, Zahl der erzeugten Seiten (Zeile „Generating static pages (x/y)“) und alle Warnungen.
5. `npx tsc --noEmit > …-typecheck.log 2>&1` → Zahl der Fehler.
6. `npx eslint . > …-lint.log 2>&1` → Zahl der Fehler und Warnungen.
7. `npx vitest run > …-test-unit.log 2>&1` → Testdateien und Tests: bestanden/fehlgeschlagen/übersprungen (aus der Zusammenfassung).
8. DB-Tests: zuerst `npx vitest run -c vitest.db.config.ts > …-test-db-root.log 2>&1` (erwartet rot wegen `initdb`). Danach höchstens zwei weitere Wege, z. B. `runuser -u ubuntu -- env HOME=/home/ubuntu SM24_TEST_PG_PORT=5434 npx vitest run -c vitest.db.config.ts > …-test-db-ubuntu.log 2>&1`. Kein Weg darf Konfigurationen oder Tests ändern. Notiere je Weg Ergebnis und Ursache.
9. Probestart: `SM24_DATA=json nohup npx next start -p 3000 > /tmp/sm24-next.log 2>&1 & echo $! > /tmp/sm24-next.pid`; warte bis `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` 200 liefert (höchstens 60 s). Prüfe mit `curl` den HTTP-Status dieser 15 Adressen und notiere ihn: `/`, `/autoschluessel`, `/autoschluessel/marken/volkswagen/golf`, `/autoschluessel/anfrage`, `/schluessel-nach-code`, `/schluessel-nach-code/ms-01`, `/gleichschliessende-zylinder/konfigurator`, `/schliessanlagen`, `/tuer-und-schliesstechnik`, `/warenkorb`, `/kasse`, `/ratgeber/autoschluessel-verloren-was-tun`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`. Server danach **laufen lassen** und die PID in `/tmp/sm24-next.pid` belassen.
10. Schreibe `_werkstatt/protokolle/E0-PRUEFER-01-ergebnis.md` mit einer Tabelle „Weg · Befehl · Ergebnis · Dauer · Protokoll“ und einer Tabelle „Prüfung · Ergebnis in Zahlen · Protokoll“. Halte ausdrücklich fest, welcher Weg als Build-Gate taugt und welche Tests den Ausgangsstand bilden.

## Schnellprüfung und Selbstprüfung
- 15 HTTP-Status gezählt; jede Zahl im Ergebnis hat ein Protokoll als Beleg.
- `git status --short` zeigt nur neue Dateien in `_werkstatt/protokolle/` (gib die Ausgabe im Bericht an).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN (gewünschte Änderungen als exakte Liste) · PRÜFUNG UND ERGEBNIS · BILDBELEGE (keine) · OFFENE FRAGEN

Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.

Letzte Zeile: === ENDE E0-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
