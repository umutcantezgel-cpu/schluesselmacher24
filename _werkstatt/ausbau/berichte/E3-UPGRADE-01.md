# E3-UPGRADE-01 · Sicherheits- und Minor-Updates

## GEÄNDERTE DATEIEN
- `/home/user/schluesselmacher24/package.json`, `/home/user/schluesselmacher24/package-lock.json`
- Protokolle `/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/E3-UPGRADE-01-*.log`
- `protokolle/datenweiche.log` (automatisch angehängt)
- Dateirechte der Manifeste vorübergehend 666, danach 644. Kein Quelltext, keine Git-Änderung.

## WAS UND WARUM
Angehoben (alt → neu):
- Laufzeit: react und react-dom 19.2.4 → 19.3.1 (exakt); next ^16.4.3 → ^16.4.4; payload ^3.90.2 → ^3.92.1 sowie @payloadcms/db-postgres, next, richtext-lexical, translations und ui je ^3.90.2 → ^3.92.1; @payloadcms/email-resend und storage-s3 3.90.2 → 3.92.1 (exakt); framer-motion ^12.40.0 → ^12.43.0; react-hook-form ^7.77.0 → ^7.91.0; zustand ^5.0.14 → ^5.0.16; schema-dts ^2.0.0 → ^2.1.0.
- Entwicklung: eslint-config-next 16.2.7 → 16.4.4 (exakt, statt 16.4.2, passend zu next 16.4.4); @types/react 19.2.16 → 19.3.0; @types/react-dom 19.2.3 → 19.3.0; @types/node 20.19.41 → 20.19.43; autoprefixer 10.5.0 → 10.6.2; postcss 8.5.28 → 8.5.32; tailwind-merge 3.6.0 → 3.7.0.
- `npm audit fix` ohne Force: 14 Entwicklungspakete (@typescript-eslint/* und typescript-eslint 8.60.1 → 8.72.1; verschachtelt minimatch 10.2.5 → 10.2.6, semver 7.8.2 → 7.8.6).
- Zurückgenommen: @hookform/resolvers 5.9.2, Verbleib bei 5.4.0. Grund: kein Sicherheitsbezug; 5.9.2 zieht optionale Peer-Abhängigkeiten nach (u. a. ajv ^8.12, im Wurzelpfad 8.20.0).
- Hauptversionen: keine direkte Abhängigkeit geändert. Transitiv verschoben: json-schema-traverse 1.0.0 liegt nun im Wurzelpfad, ajv 6.15.0 nur noch unter eslint. Neu, nur Entwicklung: yaml 2.9.1. Keine neue Laufzeitbibliothek.
- Die Sammelinstallation von Payload scheiterte mit ERESOLVE. Gelöst in zwei Schritten: Auflösung mit `--legacy-peer-deps`, danach strikte Installation (Exit 0).

## PRÜFUNG UND ERGEBNIS
Vorher → nachher:
- Typprüfung: 0 Fehler → 0 Fehler
- Lint: 0 Probleme → 0 Probleme
- Unit: 1936 Tests grün (144 Dateien) → 1936 grün
- Datenbank: 97 Tests grün (16 Dateien) → 97 grün
- Build (JSON): Exit 0, 224 Seiten → Exit 0, 224 Seiten
- `npm ls`: Exit 0 → Exit 0
- Audit Produktion: 17 (niedrig 9, mittel 5, hoch 3, kritisch 0) → 17, unverändert
- `npm outdated`, direkt: 31 → 11

Vollaudit inkl. Entwicklung nach audit fix: 41 (kritisch 3, hoch 4, mittel 25, niedrig 9), vorher nicht gemessen. Der Prüfserver wurde vor jedem Build gestoppt und danach gestartet.

## BELEGE
Protokolle `E3-UPGRADE-01-vorher*`, `-nachher*`, `-gruppe-*` (mit den ERESOLVE-Versuchen).

## OFFENE FRAGEN
1. Die 17 Produktionsbefunde sind ohne Hauptversion oder Override nicht schließbar:
   - happy-dom 20.14.6 (hoch) über @lexical/headless 0.50.0, das @payloadcms/richtext-lexical 3.92.1 exakt festlegt. Fix nur mit happy-dom 21 oder neuerem Payload. Laufzeitpfad ungeprüft.
   - esbuild 0.18.20 und 0.21.5 (mittel) über drizzle-kit 0.31.7, exakt gepinnt durch @payloadcms/db-postgres 3.92.1.
   - deepmerge 4.3.1 (niedrig) über payload. Kein Fix in der 4er-Linie.
   - npm nennt @payloadcms/richtext-lexical@0.1.9 und @payloadcms/db-postgres@0.1.9 als Abhilfe. Davon und von `npm audit fix --force` ist abzusehen.
2. Entwicklungsbaum: kritisch und hoch durch vitest 2.1.9 (vitest, @vitest/coverage-v8, tinypool, vite). Fix nur über Hauptversionen von Vitest (npm nennt 5.1.0). G7 verbietet das. Entscheidung offen.
3. Nicht angehoben, da Hauptversionen (alle elf veralteten Direktpakete): stripe 23, tailwindcss 4, vitest 5, @vitest/coverage-v8 5, eslint 10, typescript 7, graphql 17, framer-motion 14, @types/node 26, @hookform/resolvers 7, embedded-postgres 18 (Beta).
4. next 16.4.4 und eslint-config-next 16.4.4 erschienen am 2026-11-02.
5. Nicht geprüft: Admin-Oberfläche im Browser und `generate:importmap`.
6. Abweichung eslint-config-next 16.4.4 statt 16.4.2 bestätigen.
