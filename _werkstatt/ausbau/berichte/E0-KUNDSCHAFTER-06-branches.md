# E0-KUNDSCHAFTER-06 · Fremde Branches

Stand: lokaler main 063b75214 (2026-10-25). Lauf-Branch claude/affectionate-knuth-n7mjur auf f43efa2, 4 Commits vor main, 76 geänderte Dateien. Es wurde kein fetch ausgeführt, die Aussagen gelten für die lokal bekannten Remote-Refs.

## GEÄNDERTE DATEIEN

Keine Projektdatei. Geschrieben wurde nur diese Berichtsdatei. Eine Hilfsdatei im Home-Verzeichnis entstand kurz bei der Prüfung und ist wieder gelöscht.

## WAS UND WARUM

`git branch -r` liefert 15 Refs. Ausgenommen sind origin/main und origin/claude/affectionate-knuth-n7mjur, bewertet werden 13. Drei Branches sind in main enthalten, zehn tragen zusammen 12 Commits, die nicht in main stehen. Der Präfix origin/ ist in der Tabelle weggelassen.

| Nr. | Branch | Voraus / hinter main | Letzter Commit | Bewertung |
|---|---|---|---|---|
| 1 | claude/projekt-gestaltung-entwicklung-tofodh | 0 / 229 | 2026-10-20 | in main enthalten |
| 2 | claude/superbase-complete-config-ek55c6 | 3 / 0 | 2026-10-30 | riskant, nicht für diesen Lauf |
| 3 | claude/website-technical-integrations-jvkhdc | 0 / 0 | 2026-10-25 | in main enthalten (identisch) |
| 4 | dependabot/github_actions/actions/checkout-7 | 1 / 34 | 2026-10-25 | nicht für diesen Lauf |
| 5 | dependabot/github_actions/actions/setup-node-7 | 1 / 34 | 2026-10-25 | nicht für diesen Lauf |
| 6 | dependabot/npm_and_yarn/entwicklung-51a7c9f2bd | 1 / 0 | 2026-10-26 | riskant, nicht für diesen Lauf |
| 7 | dependabot/npm_and_yarn/framer-motion-14.6.0 | 1 / 34 | 2026-10-25 | nicht für diesen Lauf |
| 8 | dependabot/npm_and_yarn/next-react-dd77d9fea2 | 1 / 0 | 2026-10-26 | brauchbar mit Vorbehalt |
| 9 | dependabot/npm_and_yarn/payload-7883783f27 | 1 / 0 | 2026-10-26 | riskant, nicht für diesen Lauf |
| 10 | dependabot/npm_and_yarn/stripe-23.0.0 | 1 / 34 | 2026-10-25 | riskant, nicht für diesen Lauf |
| 11 | fix/stripe-api-version | 1 / 0 | 2026-10-30 | brauchbar, Übernahme empfohlen |
| 12 | nacht/shop-und-design | 0 / 134 | 2026-09-25 | in main enthalten |
| 13 | seo/json-ld-detailseiten | 1 / 0 | 2026-10-29 | brauchbar mit Vorbehalt |

**Nr. 1 projekt-gestaltung-entwicklung-tofodh.** Vorfahr von origin/main (Tip 504e905, `merge-base --is-ancestor` bestätigt). Inhalt bereits in main.

**Nr. 2 superbase-complete-config-ek55c6.** Commits 09e2877, 2f182f8, 137cc98. 53 Dateien, 3285 Zeilen neu, 108 entfernt. Inhalt: Supabase-Härtung als SQL (supabase/sql/0001 bis 0005, Rollen, RLS), nächtliche Sicherung nach R2 (.github/workflows/sicherung.yml, scripts/sicherung), neue Route api/gesundheit, Änderungen an api/cron/taeglich, src/payload.config.ts, src/lib/rechtliches/verarbeitungen.ts, ci.yml und package.json (pg, @aws-sdk/client-s3). Ordner: Doku und Konfiguration 9, scripts 19, supabase 9, api-Routen 4, src/lib und src/test 11, src/payload.config.ts 1. **Bewertung: riskant, nicht für diesen Lauf.** Eigener Betriebsschritt mit Zahlweg- und Rechtstextbezug. Die Wortsuche nach „Berechtigung“ findet im Patch nichts.

**Nr. 3 website-technical-integrations-jvkhdc.** Spitze gleich origin/main (063b75214). In main enthalten.

**Nr. 4 checkout-7** (Commit 11f4948). actions/checkout von 4 auf 7, Major, eine Zeile in .github/workflows/ci.yml. **Bewertung: nicht für diesen Lauf**, nur über einen CI-Lauf prüfbar. Konflikt nicht zu erwarten, ci.yml auf main seit der Basis 285a6cff8 unverändert.

**Nr. 5 setup-node-7** (Commit 81b0f7e). actions/setup-node von 4 auf 7, Major, eine Zeile in ci.yml. Bewertung und Konfliktlage wie Nr. 4.

**Nr. 6 entwicklung-51a7c9f2bd** (Commit 85a7210). Gruppe mit 10 Entwicklungspaketen, 7 davon Major: @types/node ^20 auf ^26, vitest ^2.1.8 auf ^5.0.5, @vitest/coverage-v8 ^2.1.0 auf ^5.0.5, eslint ^9.39.5 auf ^10.13.0, tailwindcss ^3.4.19 auf ^4.3.3, typescript ^5.9.3 auf ^7.0.2, embedded-postgres ^17.10.0-beta.17 auf ^18.0.0-beta.15. Minor: tailwind-merge, autoprefixer. Patch: postcss. **Bewertung: riskant, nicht für diesen Lauf.** main hat noch tailwind.config.ts und postcss.config.mjs, ein Sprung auf Tailwind 4 wäre ein Umbau der Styles und der Build-Konfiguration.

**Nr. 7 framer-motion-14.6.0** (Commit a7cb207). framer-motion ^12.40.0 auf ^14.6.0, Major. `git grep` findet im Quellcode von main keinen Import, nur eine Erwähnung in src/components/visual/README.md. **Bewertung: nicht für diesen Lauf**, Major ohne Bedarf. Konflikt nicht zu erwarten.

**Nr. 8 next-react-dd77d9fea2** (Commit fee7aff). react und react-dom von 19.2.4 auf 19.3.1, eslint-config-next von 16.2.7 auf 16.4.2, alles Minor. Die Gruppe meldet 5 Updates, package.json ändert 3 Einträge. **Bewertung: brauchbar mit Vorbehalt.** eslint-config-next läge dann auf der Linie des main-Eintrags next ^16.4.3. Übernahme nur mit Build und Lint durch den Orchestrator, von mir nicht geprüft. Konflikt zum Lauf-Stand: keiner.

**Nr. 9 payload-7883783f27** (Commit 00b1c30). Acht Payload-Pakete von 3.90.2 auf 3.92.0, Minor, gemeinsam nach Gruppenregel. **Bewertung: riskant, nicht für diesen Lauf.** Der CMS-Kern mit Datenbankadapter und Migrationen sollte nicht mitten im Ausbau wechseln.

**Nr. 10 stripe-23.0.0** (Commit 5d2e000). stripe ^22.6.2 auf ^23.0.0, Major, im Zahlweg. **Bewertung: riskant, nicht für diesen Lauf.** Nach dem Kommentar in Nr. 11 darf Stripe erst nach Umstellung der Zahlarten angehoben werden. Reihenfolge also erst Nr. 11, dann Nr. 10. Textkonflikt nicht zu erwarten.

**Nr. 11 fix/stripe-api-version** (Commit 09e1d57). Ein Commit auf der main-Spitze, 4 Dateien, 23 Zeilen neu, 3 entfernt: feste Stripe-API-Version als Konstante STRIPE_API_VERSION in src/lib/integrations/stripe.ts, Testanpassung, Webhook-Version in docs/LIVEGANG.md, Stripe-Major-Sperre in .github/dependabot.yml. **Bewertung: brauchbar, Übernahme empfohlen.** Klein und isoliert auf dem Zahlweg für Bestellungen und Anzahlungen, ohne Überschneidung mit dem Lauf-Stand. Die Versionsdaten im Kommentar sind extern nicht geprüft.

**Nr. 12 nacht/shop-und-design.** Vorfahr von origin/main, 134 Commits hinter main, letzter Commit 2026-09-25. In main enthalten.

**Nr. 13 seo/json-ld-detailseiten** (Commit abc1908). WebPage- und BreadcrumbList-JSON-LD auf den Detailseiten src/app/(site)/sicherheitstechnik/[slug]/page.tsx und src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx. Sie nutzen die vorhandenen JsonLd und pageGraphSchema (main: src/components/seo/json-ld.tsx, Zeile 332, Aufruf passt zur Signatur). **Vorbehalt:** package.json und package-lock.json entfernen schema-dts aus den dependencies, der devDependencies-Eintrag (package.json Zeile 65) bleibt. main importiert das Paket nur als Typ (json-ld.tsx Zeile 6, artikel.ts Zeile 1), also ohne Laufzeitwirkung, der Commit begründet die Entfernung aber nicht. **Bewertung: brauchbar mit Vorbehalt.** Die Seitendateien lassen sich ohne die Paketzeilen übernehmen. Konflikt zum Lauf-Stand: keiner. Nicht gebaut.

## GEMEINSAME DATEIEN

Keine Änderung durch diesen Lauf. Bei einer späteren Übernahme durch den Orchestrator wären betroffen:
- Nr. 11: src/lib/integrations/stripe.ts, src/lib/integrations/stripe.test.ts, .github/dependabot.yml, docs/LIVEGANG.md
- Nr. 13: src/app/(site)/sicherheitstechnik/[slug]/page.tsx, src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx, und nur bei bewusster Entscheidung package.json und package-lock.json
- Nr. 8: package.json, package-lock.json

## PRÜFUNG UND ERGEBNIS

- Abschnitte: 13 von 13 vorhanden. In main enthalten: 3 (Nr. 1, 3, 12). Brauchbar: 1 (Nr. 11). Brauchbar mit Vorbehalt: 2 (Nr. 8, 13). Riskant oder nicht für diesen Lauf: 7 (Nr. 2, 4, 5, 6, 7, 9, 10).
- Konflikte gegen origin/main: keine zu erwarten. Sechs Branches (Nr. 2, 6, 8, 9, 11, 13) haben die main-Spitze als Basis. Vier (Nr. 4, 5, 7, 10) haben die Basis 285a6cff8, auf der package.json, package-lock.json und ci.yml auf main unverändert sind.
- Konflikte gegen den Lauf-Stand f43efa2: Die Dateien der zehn Branches mit Commits überschneiden sich nicht mit den 76 Lauf-Dateien.
- Methode: nur lesende Befehle (git log, cherry, merge-base, diff, show, ls-tree, grep, cat-file, rev-list). `git merge-tree --write-tree` nicht verwendet, da es Objekte schreibt. Die Dateiprüfung lief über `git diff`.
- Grenzen: kein fetch, die Refs können hinter dem Remote liegen. Historie flach (3 Grenzen in .git/shallow), keine Merge-Basis liegt auf einer Grenze. Arbeitsbaum nicht geprüft, da git status nicht zur Liste erlaubter Befehle gehört. Keine Builds, keine Tests.

## BELEGE

- `git branch -r`: 15 Refs, Commit-Kennungen in Tabelle und Abschnitten.
- Ancestor-Prüfung: Nr. 1 und Nr. 12 sind Vorfahren von origin/main, Nr. 3 ist identisch mit origin/main.
- docs/nacht/bot-branches.txt: 110 Einträge (106 sentinel/, 2 jules-, 1 chore/, 1 chore-docs-Eintrag). Keiner ist lokal vorhanden (`git cat-file -e`, 0 von 110).
- docs/LIVEGANG.md auf main nennt Supabase als Datenbank und Dateiablage (Zeilen 3, 12, 17, 25) und den täglichen Zahlungsabgleich per Cron (Zeile 3).
- .git/shallow: 3 Grenzen.

## OFFENE FRAGEN

1. Die 110 Einträge aus docs/nacht/bot-branches.txt sind unbewertet. Eine Prüfung braucht einen Fetch, den dieses Paket nicht erlaubt.
2. Soll die Stripe-Major-Sperre aus Nr. 11 übernommen werden? Das ist eine Richtungsentscheidung.
3. Die Versionsangaben in Nr. 11 (2026-08-26.dahlia, Ablauf ab 2026-09-30.endive) und die Stripe-SDK-Version sind nicht extern geprüft.
4. Nr. 2 ist eine Betriebsentscheidung. Vorab sind die Rechtstexte in src/lib/rechtliches/verarbeitungen.ts und die Route api/gesundheit gesondert zu prüfen.
5. Soll schema-dts in Nr. 13 aus den dependencies verschwinden? Der Commit nennt keinen Grund.
6. Soll Nr. 6 nach dem Lauf als eigener Schritt geprüft werden?
