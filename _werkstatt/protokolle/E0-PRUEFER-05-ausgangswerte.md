# E0-PRUEFER-05 · Ausgangswerte nach Prüfstufe B

Basis: E0-Build aus E0-PRUEFER-01 (`.next/BUILD_ID` = `m-Nz5gJdEPI0m_fmJdMHt`, Änderungsdatum 2026-10-15 21:13:19 UTC, am Ende unverändert). Kein neuer Build, keine Typprüfung, kein Linter und kein Unit-Lauf über das Projekt. Typprüfung, Linter und Unit-Tests stammen aus E0-PRUEFER-01. Messungen laufen gegen den Server auf Port 3000 mit diesem Build. Die Zählung der freien Werte läuft gegen den E0-Quellstand (Commit `b49fe04`, siehe unten).

## Prüfungen

| Prüfung | Ergebnis | Beleg |
|---|---|---|
| Server-Stand | Läuft auf Port 3000 (`server.sh status`); Build-Kennung vor und nach allen Läufen gleich | `.next/BUILD_ID` |
| Typprüfung, Linter, Build, Unit (aus E0-01, nicht neu) | Typprüfung 0 Fehler; Linter 0/0; Build 198/198 Seiten; Unit 31/31 Dateien, 680/680 Tests | `_werkstatt/protokolle/E0-PRUEFER-01-ergebnis.md` |
| DB-Tests als `ubuntu` (Wrapper, `cacheDir` gesetzt) | 7/7 Dateien, 52/52 Tests bestanden (E0-01: 39/52, Ursache EACCES bei `private-uploads/`) | `_werkstatt/protokolle/E0-PRUEFER-05-test-db.log` |
| Konsole (Desktop, 12 Ansichten) | 0 Konsolenfehler, 0 Warnungen, 0 Seitenfehler; 14 fehlgeschlagene Anfragen in 8 Ansichten (siehe Tabelle B) | `_werkstatt/protokolle/konsole-2026-10-15_23-28-37.json` (Tabelle nur auf stdout ausgegeben) |
| Bildsatz E0 | 251 JPEG in `_werkstatt/bilder/e0/`, 12 MB (unter 25 MB, kein Lauf mit `--max 10`), größte Breite 1.440 px; kein Seitenüberlauf in 36 Ansichten-Geräten | `_werkstatt/protokolle/E0-PRUEFER-05-bildsatz.log`, `bildsatz-2026-10-15_23-31-46.json` |
| Zugänglichkeit (axe, WCAG 2.2 AA, mobil und Desktop) | 30 Verstöße in 24 Auswertungen: 26 ernst, 4 kritisch; mittel und gering 0 | `_werkstatt/protokolle/E0-PRUEFER-05-a11y.log`, `a11y-2026-10-15_23-33-13.json` |
| Leistung, 3 Läufe je Profil, Median | Zwei Ansichten über Budget am Median: H10 mobil (LCP 2508 ms, CLS 0,117), H11 mobil (CLS 0,104) | `_werkstatt/protokolle/E0-PRUEFER-05-messung.log`, `messung-2026-10-15_23-40-40.json` |
| Bewegung reduziert (12 Ansichten) | 0 laufende Animationen, 0 Befunde, 0 verborgene Inhalte; 2.058 Textelemente geprüft | `_werkstatt/protokolle/E0-PRUEFER-05-bewegung.log`, `bewegung-reduziert-2026-10-15_23-41-24.json` |
| Freie Werte, E0-Quellstand (196 Dateien) | 707 ohne Ausnahmen, 10 Ausnahmen (Bildinhalte) | `_werkstatt/protokolle/E0-PRUEFER-05-werte.log`, `…/scratchpad/werte-basis.json` |
| Freie Werte, Arbeitsstand 21:41 (244 Dateien, zum Vergleich) | 653 ohne Ausnahmen, 14 Ausnahmen | `_werkstatt/protokolle/E0-PRUEFER-05-werte-arbeitsstand.log` |

## Tabelle A · Leistung (Median; Spanne in Klammern; 3 Läufe je Profil)

| Ansicht | LCP mobil ms | CLS mobil | INP mobil ms | JS-KB mobil | LCP Desktop ms | CLS Desktop | Budget am Median |
|---|---|---|---|---|---|---|---|
| H01-start | 996 (996–1028) | 0,000 | 56 (56–88) | 246,3 (246,3–246,3) | 164 (124–168) | 0,000 | eingehalten |
| H02-autoschluessel | 960 (956–992) | 0,000 | 56 (48–56) | 219,1 (219,1–219,1) | 172 (156–192) | 0,000 | eingehalten |
| H03-modell-golf | 976 (956–1040) | 0,000 | 48 (40–56) | 219,1 (219,1–219,1) | 188 (152–208) | 0,000 | eingehalten |
| H04-assistent | 904 (888–1012) | 0,000 | 56 (48–64) | 227,0 (227,0–227,0) | 144 (136–168) | 0,000 | eingehalten |
| H05-code-shop | 1084 (1080–1112) | 0,000 | 56 (56–64) | 234,9 (234,9–234,9) | 144 (140–176) | 0,000 | eingehalten |
| H06-code-produkt | 964 (956–976) | 0,000 | 64 (56–80) | 234,9 (234,9–234,9) | 136 (124–160) | 0,000 | eingehalten |
| H07-zylinder-konfigurator | 1012 (972–1028) | 0,000 | 72 (64–72) | 210,0 (210,0–210,0) | 160 (152–192) | 0,000 | eingehalten |
| H08-schliessanlagen | 976 (940–984) | 0,000 | 64 (64–72) | 248,5 (248,5–248,5) | 140 (140–144) | 0,000 | eingehalten |
| H09-tuertechnik | 1020 (996–1024) | 0,000 | 48 (40–64) | 222,2 (222,2–222,2) | 156 (152–172) | 0,000 | eingehalten |
| H10-warenkorb | **2508 (2480–2596)** | **0,117** | 56 (56–56) | 231,0 (231,0–231,0) | 116 (108–120) | 0,038 | **ÜBER: LCP, CLS (mobil)** |
| H11-kasse | 920 (916–924) | **0,104** | 64 (56–72) | 217,0 (217,0–217,0) | 116 (112–120) | 0,031 | **ÜBER: CLS (mobil)** |
| H12-ratgeber | 936 (916–944) | 0,000 | 56 (56–64) | 212,6 (212,6–212,6) | 116 (108–128) | 0,000 | eingehalten |

Budgets: LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms (am Median). JS-KB ist die Gesamtmenge aller Skript-Ressourcen in KB. INP ist die Näherung des Werkzeugs (0 bedeutet kein Ereignis über 16 ms).

## Tabelle B · Zugänglichkeit, Konsole, Überlauf, reduzierte Bewegung

Axe-Angaben sind „ernst / kritisch“ je Gerät. Konsole, Netzfehler und reduzierte Bewegung stammen aus dem Desktop-Lauf bzw. dem Lauf mit reduzierter Bewegung.

| Ansicht | axe mobil | axe Desktop | Konsolenfehler | Netzfehler (Desktop) | Seitenüberlauf (mobil / Tablet / Desktop) | Elemente über den rechten Rand | Reduzierte Bewegung: Befunde |
|---|---|---|---|---|---|---|---|
| H01-start | 1 / 0 | 1 / 0 | 0 | 0 | nein / nein / nein | – | 0 |
| H02-autoschluessel | 1 / 0 | 1 / 0 | 0 | 0 | nein / nein / nein | – | 0 |
| H03-modell-golf | 1 / 0 | 1 / 0 | 0 | 2 | nein / nein / nein | – | 0 |
| H04-assistent | 1 / 1 | 1 / 0 | 0 | 1 | nein / nein / nein | – | 0 |
| H05-code-shop | 1 / 0 | 1 / 0 | 0 | 2 | nein / nein / nein | – | 0 |
| H06-code-produkt | 1 / 1 | 1 / 1 | 0 | 2 | nein / nein / nein | – | 0 |
| H07-zylinder-konfigurator | 1 / 1 | 1 / 0 | 0 | 0 | nein / nein / nein | – | 0 |
| H08-schliessanlagen | 2 / 0 | 1 / 0 | 0 | 1 | nein / nein / nein | mobil: 27 | 0 |
| H09-tuertechnik | 1 / 0 | 2 / 0 | 0 | 3 | nein / nein / nein | mobil: 1, Tablet: 1 | 0 |
| H10-warenkorb | 1 / 0 | 1 / 0 | 0 | 2 | nein / nein / nein | – | 0 |
| H11-kasse | 1 / 0 | 1 / 0 | 0 | 1 | nein / nein / nein | – | 0 |
| H12-ratgeber | 1 / 0 | 1 / 0 | 0 | 0 | nein / nein / nein | – | 0 |

Summe: axe 26 ernst und 4 kritisch (30 Verstöße). Netzfehler 14 (alle Typ `net::ERR_ABORTED`, siehe OFFENE FRAGEN).

Bildsatz: Die Ausschnitte sind je Ansicht bei 15 gekappt, wenn die Seite länger ist: H05 mobil 15 von 41, H05 Tablet 15 von 18, H08 mobil 15 von 16, H09 mobil 15 von 16. Alle anderen Ansichten sind vollständig.

## Liste der axe-Regeln

Es traten nur 5 verschiedene Regeln auf (weniger als 10):

1. `target-size` (ernst), 24 Auswertungen (alle 12 Ansichten, mobil und Desktop), 48 Stellen. Fast alle Stellen sind Kopf- und Fußzeilen-Links, z. B. `tel:[Platzhalter: Telefonnummer]` und `mailto:[Platzhalter: E-Mail-Adresse]` (H01).
2. `button-name` (kritisch), 2: H04 mobil, H07 mobil (deaktivierte Schaltflächen ohne erkennbaren Text).
3. `label` (kritisch), 2: H06 mobil und Desktop, Felder `#foto-ms-01-camera`, `#foto-ms-01-gallery`.
4. `scrollable-region-focusable` (ernst), 1: H08 mobil, `.table-scroll`.
5. `color-contrast` (ernst), 1: H09 Desktop, `.text-3xl`.

## Summe der freien Werte

- E0-Quellstand (Commit `b49fe04`, 196 Dateien unter `src/app/(site)` und `src/components`): **707 ohne Ausnahmen**, 10 Ausnahmen (Bildinhalte in `visual/generators` und `visual/icons`).
- Arbeitsstand 21:41 (244 Dateien): 653 ohne Ausnahmen, 14 Ausnahmen (zum Vergleich, nicht die Ausgangszählung).

Je Datei: Tabelle „Summe je Datei“ in den beiden Protokollen.

## Hinweise zum Verfahren

- Schritt 9 war mit dem Arbeitsstand angesetzt. Der Arbeitsstand ist seit dem E0-Build geändert (siehe unten). Deshalb ist die Ausgangszählung auf den E0-Quellstand `b49fe04` gerechnet. Dafür lief eine Kopie des Werkzeugs mit dem Wurzelpfad auf einen Export dieses Commits (Kopie und Export im Scratchpad, nicht im Repo). Die Bezeichnung „Ausnahme“ ist dabei an den relativen Pfad gebunden, deshalb der Export mit gleicher Ordnerstruktur.
- Der DB-Wrapper `/home/ubuntu/sm24-pg/vitest-wrapper/vitest.db.wrapper.mjs` erhielt eine Zeile `cacheDir` (außerhalb des Repos, siehe Schritt 3).
- Messung, Bildsatz, Konsole, axe und Bewegung liefen alle gegen den E0-Build.

## Gemeinsame Stände im Repo (nicht von diesem Prüfer)

- Vor dem Lauf: Commit `b49fe04` (E0-PRUEFER-01, Ausgangsstand).
- Nach dem Lauf: Commits `876ca19`, `30bf6a3` (Werkstatt und Tests) und `65aa9ce` (E2-GRAFIKER-04, `schliessplan.tsx`, `schliessplan.test.tsx`).
- Arbeitsbaum: 18 geänderte Dateien unter `src/` und mehrere neue Dateien (z. B. `src/lib/bewegung.ts`, `src/components/visual/profillinie.tsx`); `tailwind.config.ts` wurde während des Laufs geändert (21:41:29). Nichts davon wurde angefasst.
