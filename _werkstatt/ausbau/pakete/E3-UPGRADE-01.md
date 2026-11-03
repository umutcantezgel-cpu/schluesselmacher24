# E3-UPGRADE-01 · Sicherheits- und Minor-Updates

## 1. Kopfzeile
Kennung E3-UPGRADE-01 · Rolle Prüfer · Modell Haiku 5.5 · Stufe 2 · Kern 2.1 · Kostenklasse M · Kriterium Z-02 · Schreibrechte: package.json, package-lock.json, _werkstatt/ausbau/protokolle/E3-UPGRADE-01-*.log, _werkstatt/ausbau/berichte/E3-UPGRADE-01.md

## 2. Rollenbriefing
Prüfer: richtet Werkzeuge ein, prüft nach seiner Stufe und berichtet knapp mit Belegpfaden. Fehler: Entwicklungsserver statt Produktions-Build; deuten statt berichten; Hauptversionen anheben.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran.

## 3. Aufgabe in einem Satz
Hebe nur Sicherheits-, Patch- und Minor-Versionen an (etwa React 19.3.1, eslint-config-next 16.4.2, Next 16.4 neuester Patch), ohne eine Hauptversion und ohne `npm audit fix --force`, und belege, dass Build, Typprüfung, Lint und Tests danach nicht schlechter sind.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar. Technisch Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Alle Projektbefehle laufen über die Datenweiche, nie gegen Produktionsdaten. Der Bestand ist grün (Unit 1936, DB 97, Build JSON). Hauptversionen und neue Laufzeitbibliotheken sind ausgeschlossen (G7).

## 5. Kern-Auszug (unveränderlich)
- G7: nur Sicherheit und Minor. Stripe bleibt auf der Hauptversion 22 (Dependabot-Sperre, feste API-Version). Payload bleibt auf 3.x, Next auf 16.x, React auf 19.x, Tailwind auf 3.x, Vitest auf 2.x, Zod auf 4.x.
- G8: keine Prüfung abschalten oder lockern; scheitert ein Update, nimmst du es zurück und berichtest.
- Datenweiche: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/sicher.sh --json -- <befehl>`, für Datenbanktests `sicher.sh --pg -- npm run test:db`. Den laufenden Prüfserver stoppst du vor dem Build mit `_werkstatt/ausbau/werkzeuge/server.sh stop` und startest ihn danach mit `server.sh start`.

## 6. Maßstab
- Vorher und nachher: `npm audit --omit=dev --json` (Zahlen je Stufe), `npm outdated --json` (Auszug), Typprüfung, Lint, `npm run test:unit`, `npm run test:db`, `npm run build` (JSON), jeweils mit Ergebnis im Protokoll.
- Grün heißt: Build und Typprüfung erfolgreich, Lint ohne neue Warnung, Unit und DB mindestens so viele bestandene Tests wie vorher und keiner rot.
- Jede angehobene Paketzeile mit alter und neuer Version im Bericht.

## 7. Grenzen
G3 (keine Deploys), G4, G5, G7, G8, G10. Keine Änderung an Quelltext; braucht ein Minor-Update eine Codeänderung, nimmst du es zurück und nennst es im Bericht.

## 8. Schritte
1. Vorher-Messung (Abschnitt 6) mit Protokollen `_werkstatt/ausbau/protokolle/E3-UPGRADE-01-vorher.log`.
2. Updates einzeln oder in kleinen Gruppen mit `npm install <paket>@<version> --save-exact` beziehungsweise passendem Bereich wie im heutigen package.json; danach `npm audit fix` ohne `--force`.
3. Nachher-Messung, Protokoll `E3-UPGRADE-01-nachher.log`.
4. Bericht.

## 9. Selbstprüfung
Keine Hauptversion geändert (Liste); Zahlen vorher und nachher; alle Prüfungen grün; package.json und Lockfile passen zusammen (`npm ci --dry-run` oder `npm ls` ohne Fehler).

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E3-UPGRADE-01.md (höchstens 450 Wörter: angehobene Pakete mit Versionen, Audit vorher und nachher, Prüfergebnisse, zurückgenommene Updates mit Grund).

## 11. Letzte Zeile
=== ENDE E3-UPGRADE-01 · BEREIT ZUR RÜCKGABE ===
