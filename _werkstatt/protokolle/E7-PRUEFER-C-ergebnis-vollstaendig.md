# E7-PRUEFER-C · Ergebnis Abschlussversuch 2 · vollständige Fassung (Teil 6, nach Teil 5 und Nachtrag)

Ersetzt nicht `E7-PRUEFER-C-ergebnis.md` (Stand 12:50 UTC, vor Abschluss von Teil 5). Diese Fassung wurde aus den Protokollen neu zusammengestellt. Jede Zahl ist am Protokoll nachgeprüft, außer wo „aus E6“ oder „aus E7-PRUEFER-02-ergebnis.md“ steht (dort jeweils mit Protokoll nachgerechnet oder gegengeprüft). Fehlt ein Wert, steht „fehlt“ mit Grund.

## Kopf

- **Prüfzeitpunkt**: 2026-10-20, ca. 13:00 UTC. Protokolle E7-PRUEFER-C und E7-PRUEFER-02 stammen von 2026-10-18, 11:58 bis 12:50 UTC (Teil 1 bis 5). E7-L-44 stammt von 2026-10-20, 12:57 bis 12:58 UTC.
- **Build der Messungen**: `.next/BUILD_ID` = `_yaN_J-sWFLTSeQqU6QII` (`E7-PRUEFER-C-build.log`, `E7-PRUEFER-02-ergebnis.md`, Kopf). Alle Läufe der Teile 1 bis 5 und Teil 4 (Leistung, Bildrate, Ladeweg) beziehen sich auf diesen Build.
- **Port 3000 jetzt**: Die Startseite liefert die BUILD_ID `iKl_M5gLZWsTLj9wvJVXf` (HTML-Probe durch Teil 6, 13:0x UTC; `.next/BUILD_ID` seit 12:57:07 UTC). Port 3100 liefert `m-Nz5gJdEPI0m_fmJdMHt` (E0). Der Build iKl ist der Stand nach E7-L-44 (`E7-L-44-build.log`, Build 208/208, EXIT 0 in Zeile 2170). Die ersten beiden Versuche brachen mit EXIT 1 ab (Zeilen 1019 und 2039); erst nach dem Verschieben des Turbopack-Zwischenspeichers `.next/cache` nach `/root/sm24-cache-sicherung` (Zeile 2040, „Wiederholung 2“) gelang der Build.
- **Was zwischen beiden Builds geändert wurde**: `git diff --stat f6e55ab HEAD -- src public content next.config.ts package.json` ergibt fünf Dateien mit sechs geänderten Zeilen (Commit 3315165): Klasse `duration-quick ease-standard` an sechs Übergängen (Markenpfeile `marken/page.tsx` und `marken/[make]/page.tsx`, `artikel/artikel-liste.tsx`, Detailseiten `sicherheitstechnik/[slug]/page.tsx` und `tuer-und-schliesstechnik/[slug]/page.tsx`). Nur diese Änderung betrifft die Messungen; Hover-Übergänge sind darunter, der Filter-Schalter nicht nur Hover. Die Messungen Leistung, Bildrate, Bildsatz, Funktionsliste, Tastatur, Konsole, axe, Bewegung und SVG beziehen sich auf `_yaN_J`. Nur die fünf Nachprüfungsseiten in E7-L-44 (Konsole, Animationen, axe) laufen auf `iKl`.
- **Repo**: HEAD jetzt `fb812a4`; bei den Läufen `5980acc`. `f6e55ab` (Auftrag) ist Vorfahr. Keine Projektdatei durch Teil 6 geändert.
- **Sperre** `/tmp/sm24-messfenster.lock`: zur Prüfung nicht vorhanden. Teil 6 hat keine Sperre gesetzt.
- **Vergleichsbasen**:
  - **E0** = `E0-PRUEFER-05-ausgangswerte.md` (Tabellen A und B), `E0-PRUEFER-05-messung.log` (Build 198/198, Messung 15.10.).
  - **E0 heute** = Vergleichslauf auf Port 3100 in `E7-PRUEFER-02-messung-mobil.log` (5 Läufe) und `…-desktop.log` (3 Läufe); Spanne = max − min der E0-Läufe.
  - **AV1** = Abschlussversuch 1, `E6-PRUEFER-C-ergebnis.md` (Teil 6 und Teil 2 bis 4 darin), Messung 17.10. (`messung-2026-10-17_16-46-12.json`, Port-3000-Build laut E6 nicht eindeutig, siehe Abweichungen).
- **Eigene Zählungen aus den Bildsatz-Protokollen**: Die Spalte „Elemente über den rechten Rand“ wurde aus den Befundspalten der Bildsatz-Protokolle je Ansicht und Gerät gezählt (E0 `E0-PRUEFER-05-bildsatz.log`, AV1 `E6-PRUEFER-C-bildsatz.log`, jetzt `E7-PRUEFER-C-bildsatz.log`). Die abgebrochenen Anfragen stehen in den Konsolen-Protokollen (E0 `E0-PRUEFER-05-ausgangswerte.md`, Tabelle B; AV1 `E6-PRUEFER-C-konsole.log`; jetzt `E7-PRUEFER-C-konsole.log`).

---

## Tabelle 1 · Bestand, Build, Funktionsliste, Tastatur, Wertesuche, Logik, Textabzug

| Prüfung | E0 | AV1 | jetzt | Beleg (jetzt) |
|---|---|---|---|---|
| Typprüfung `tsc --noEmit` | 0 Fehler (`E0-PRUEFER-05-ausgangswerte.md`) | 0 (E6 T1) | EXIT 0, keine Fehlerzeilen | `E7-PRUEFER-C-typecheck.log` |
| Linter `eslint .` | 0/0 (E0-PRUEFER-01) | 0/0 (E6 T1) | EXIT 0, keine Befunde | `E7-PRUEFER-C-lint.log` |
| Unit `vitest run` | 31/31 Dateien, 680/680 Tests | 71/71, 1204/1204 | **73/73 Dateien, 1217/1217 Tests**, „Test Files 73 passed“ | `E7-PRUEFER-C-test-unit.log` Zeilen 125 und 126, EXIT 0 |
| DB-Tests (Nutzer ubuntu laut Vorgabe) | 7/7, 52/52 | 7/7, 52/52 | **7/7, 52/52**, EXIT 0. Der Nutzer ist im Protokoll nicht vermerkt (nur Kopf „RUN“). | `E7-PRUEFER-C-test-db.log` Zeilen 77 bis 82 |
| Build | 198/198 Seiten | 208/208 | **208/208**, „Compiled successfully in 57s“, Seitenzeile „208/208“. **Keine EXIT-Zeile** im Protokoll. | `E7-PRUEFER-C-build.log`; Build iKl (E7-L-44): EXIT 0, 208/208, `E7-L-44-build.log` Zeile 2170 |
| curl Port 3000 | fehlt (kein curl-Protokoll im E0-Lauf) | `/` 200, `/gibt-es-nicht-pruefung` 404 (E6 T2 Schritt 2) | `/` HTTP 200, 420 993 Byte; `/gibt-es-nicht-pruefung` 404; „Hinweis für die Redaktion“ im HTML von `/`: 0 Treffer | `E7-PRUEFER-C-curl.log` (Lauf 12:01 UTC, vor Build iKl) |
| Funktionsliste F-01 bis F-14 | 14/14 laut E6 T1 (E0-Protokoll im Ordner fehlt) | 14/14 (Erstlauf 14:09 UTC und Nachlauf) | **14/14 bestanden** | `E7-PRUEFER-C-funktionsliste.log`, Zeile 59 („Bestanden 14 von 14“) |
| Tastatur mobil (F-01, F-02, F-04 bis F-08) | nicht gemessen | Erstlauf 6/7 (F-01 nicht bestanden, Wiederholung 0/1); Nachlauf 7/7 | **7/7**, ohne sichtbaren Fokus: keine | `E7-PRUEFER-C-tastatur-mobil.log`, Zeile 57 |
| Tastatur Desktop (gleiche Funktionen) | nicht gemessen | Erstlauf 6/7 (F-01 nicht bestanden); Nachlauf 7/7 | **7/7**, ohne sichtbaren Fokus: keine | `E7-PRUEFER-C-tastatur-desktop.log`, Zeile 57 |
| Wertesuche, Summe ohne Ausnahmen | 707, 10 Ausnahmen (Basis b49fe04, 196 Dateien; nicht vergleichbar) | 0, 20 Ausnahmen (E6 T1) | **0**, 22 Ausnahmen in 13 Dateien (Basis fcbcfb2, 232 Dateien) | `E7-PRUEFER-C-werte.log` Zeile 52, `E7-PRUEFER-C-werte.json` |
| Logikwächter `pruefen` | fehlt (kein E0-Protokoll; E6 nennt nur „Logik 0 abw.“ ohne Spalte) | 15 Dateien, 0 abweichend (`E6-PRUEFER-C-logik.log`) | **15 Dateien, 0 abweichend** (Basis b49fe04) | `E7-PRUEFER-C-logik.log` |
| Textabzug `vergleichen` | fehlt (kein E0-Protokoll) | 6 von 6 gleich | **6 von 6 gleich** (agb, widerruf, impressum, datenschutz, versand-und-zahlung, cookie-einstellungen) | `E7-PRUEFER-C-textabzug.log` |

---

## Tabelle 2 · Hauptansichten H01 bis H12 (E0 · AV1 · jetzt)

### 2a · Konsole, Überlauf, Elemente über den rechten Rand, Zugänglichkeit, Bewegung

Konsole: Fehler/Warnungen/Seitenfehler sind in allen 12 Ansichten **0/0/0** (E0, AV1 und jetzt; `E7-PRUEFER-C-konsole.log`, `E6-PRUEFER-C-konsole.log`, E0 Tabelle B). „abgebrochene Anfragen“ sind `net::ERR_ABORTED` auf RSC-Vorabrufe (`/autoschluessel/anfrage?_rsc=…`, `/service-und-termin/anfrage?_rsc=…`); das Werkzeug zählt sie als Netzbefund, nicht als Konsolenfehler, Attrappen-Abbrüche 0 in allen Läufen.

Überlauf des Dokuments (Seitenbreite) ist in allen Geräten „nein“ (E0 Tabelle B, AV1 `E6-PRUEFER-C-bildsatz.log`, jetzt `E7-PRUEFER-C-bildsatz.log`: 0 „ja“ in 69 von 69 Läufen).

Elemente über den rechten Rand (Werkzeugzählung, Befundspalte, Mobil/Tablet/Desktop): E0 nur für die gezeigten Ausschnitte. Bei E0 waren H05 mobil (15 von 41), H05 tablet (15 von 18), H08 mobil (15 von 16) und H09 mobil (15 von 16) gekappt.

| Ansicht | Konsole Fehler/Warn./Seitenf. (jetzt) | abgebrochene Anfragen E0 · AV1 · jetzt | Elemente über den rechten Rand m/t/d E0 · AV1 · jetzt | axe ernst/kritisch mobil · Desktop E0 · AV1 · jetzt | Bewegung reduziert jetzt (Befunde / laufende Animationen) |
|---|---|---|---|---|---|
| H01 Start | 0/0/0 | 0 · 1 · 1 | – · 73/3/2 · 73/3/2 | m 1/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H02 Autoschlüssel | 0/0/0 | 0 · 0 · 1 | – · 82/2/0 · **84/2/0** | m 1/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H03 Modell Golf | 0/0/0 | 2 · 1 · 2 | – · 4/2/1 · 4/2/1 | m 1/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H04 Assistent | 0/0/0 | 1 · 0 · 0 | – · 0/0/0 · 0/0/0 | m 1/1 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H05 Code-Shop | 0/0/0 | 2 · 0 · 0 | – · 7/1/1 · 7/1/1 | m 1/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H06 Code-Produkt | 0/0/0 | 2 · 0 · 0 | – · 6/3/1 · 6/3/1 | m 1/1 · 0/0 · 0/0; d 1/1 · 0/0 · 0/0 | 0 / 0 |
| H07 Zylinder-Konfigurator | 0/0/0 | 0 · 0 · 0 | – · 1/1/1 · 1/1/1 | m 1/1 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H08 Schließanlagen | 0/0/0 | 1 · 1 · 0 | 27 (m) · 60/4/3 · 60/4/3 | m 2/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H09 Tür- und Schließtechnik | 0/0/0 | 3 · 2 · 1 | 1/1/– · 16/1/1 · 16/1/1 | m 1/0 · 0/0 · 0/0; d 2/0 · 0/0 · 0/0 | 0 / 0 |
| H10 Warenkorb | 0/0/0 | 2 · 0 · 0 | – · 0/0/0 · 0/0/0 | m 1/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H11 Kasse | 0/0/0 | 1 · 0 · 0 | – · 0/0/0 · 0/0/0 | m 1/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H12 Ratgeber | 0/0/0 | 0 · 2 · 2 | – · 1/1/1 · 1/1/1 | m 1/0 · 0/0 · 0/0; d 1/0 · 0/0 · 0/0 | 0 / 0 |

Summen: abgebrochene Anfragen Hauptansichten E0 14 (Desktop, `E0-PRUEFER-05-ausgangswerte.md` Tabelle B), AV1 7, jetzt 7. Die E0-Werte gelten für Desktop; mobil ist im E0-Protokoll nicht getrennt.

Elemente über den rechten Rand in den Ansichten, in denen E0 nicht gekappt war, also „–“ = 0 Befunde. E0 zeigte mobil H08 27 und H09 1, tablet H09 1 (`E0-PRUEFER-05-bildsatz.log`). Die Zahl H02 mobil ist in AV1 82 und jetzt 84 (E6 und E7 unterscheiden sich nur hier, `diff` der beiden Bildsatz-Protokolle).

axe ernst/kritisch: E0 `E0-PRUEFER-05-ausgangswerte.md` Tabelle B; AV1 `E6-PRUEFER-C-a11y.log` (alle 0/0); jetzt `E7-PRUEFER-C-a11y.log` (alle 0/0, zwei Läufe mobil und Desktop; moderate und minor 0).

Bewegung reduziert: E0 0 Befunde/0 Animationen (`E0-PRUEFER-05-bewegung.log`); AV1 0/0 (`E6-PRUEFER-C-bewegung-reduziert.log`); jetzt 0/0 (`E7-PRUEFER-C-bewegung-reduziert.log`, Zeile 1 bis 16, Haupt).

### 2b · Leistung mobil (Median aus 5 Läufen jetzt; E0 aus 3 Läufen; „E0 heute“ mit Spanne)

Quellen: E0 `E0-PRUEFER-05-ausgangswerte.md` Tabelle A; AV1 `E6-PRUEFER-C-ergebnis.md` T2; jetzt und E0 heute `E7-PRUEFER-02-messung-mobil.log` (Zeilen 3 bis 14 und 22 bis 70; Spanne und Differenz werden dort angegeben). Erfüllt = Differenz ≤ E0-Spanne oder ≤ 0.

| Ansicht | LCP ms E0 · AV1 · jetzt | LCP E0 heute (Spanne; Δ jetzt−E0h; erfüllt) | INP ms E0 · AV1 · jetzt | INP E0 heute (Spanne; Δ; erfüllt) | CLS E0 · AV1 · jetzt |
|---|---|---|---|---|---|
| H01 Start | 996 · 1112 · 656 | 960 (48; −304; ja) | 56 · 160 · 40 | 56 (24; −16; ja) | 0,000 · 0,000 · 0,000 |
| H02 Autoschlüssel | 960 · 1104 · 656 | 984 (64; −328; ja) | 56 · 168 · 24 | 64 (24; −40; ja) | 0,000 · 0,000 · 0,000 |
| H03 Modell Golf | 976 · 1080 · 588 | 964 (56; −376; ja) | 48 · 160 · 24 | 64 (16; −40; ja) | 0,000 · 0,000 · 0,000 |
| H04 Assistent | 904 · 968 · 540 | 892 (48; −352; ja) | 56 · 96 · 24 | 56 (16; −32; ja) | 0,000 · 0,000 · 0,000 |
| H05 Code-Shop | 1084 · 1056 · 628 | 1060 (64; −432; ja) | 56 · 128 · 16 | 64 (32; −48; ja) | 0,000 · 0,000 · 0,000 |
| H06 Code-Produkt | 964 · 1080 · 632 | 992 (72; −360; ja) | 64 · 160 · 24 | 64 (32; −40; ja) | 0,000 · 0,000 · 0,000 |
| H07 Zylinder-Konfigurator | 1012 · 1028 · 580 | 1000 (68; −420; ja) | 72 · 88 · 24 | 56 (16; −32; ja) | 0,000 · 0,000 · 0,000 |
| H08 Schließanlagen | 976 · 1168 · 688 | 988 (132; −300; ja) | 64 · 168 · 32 | 64 (16; −32; ja) | 0,000 · 0,000 · 0,000 |
| H09 Tür-/Schließtechnik | 1020 · 1108 · 632 | 1024 (52; −392; ja) | 48 · 144 · 24 | 64 (32; −40; ja) | 0,000 · 0,000 · 0,000 |
| H10 Warenkorb | **2508** · 984 · 500 | 2584 (116; −2084; ja) | 56 · 104 · 24 | 64 (0; −40; ja) | **0,117** · 0,007 · 0,007278 |
| H11 Kasse | 920 · 984 · 484 | 888 (40; −404; ja) | 64 · 112 · 16 | 64 (24; −48; ja) | **0,104** · 0,010 · 0,009766 |
| H12 Ratgeber | 936 · 1004 · 564 | 932 (116; −368; ja) | 56 · 128 · 32 | 72 (64; −40; ja) | 0,000 · 0,000 · 0,000 |

Budgets (am Median; LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms): jetzt keine Verstöße. E0: fett = Überschreitung (H10 LCP und CLS, H11 CLS). Z-08 mobil: 36 von 36 Werten erfüllt (`E7-PRUEFER-02-ergebnis.md`, Tabelle „Z-08 mobil“, nachgerechnet mit `E7-PRUEFER-02-messung-mobil.log`).

### 2c · Leistung Desktop (Median aus 3 Läufen)

Quellen: E0 `E0-PRUEFER-05-ausgangswerte.md` Tabelle A (LCP, CLS) und `E0-PRUEFER-05-messung.log` (INP Desktop); AV1 `E6-PRUEFER-C-ergebnis.md` T2 („Desktop“); jetzt und E0 heute `E7-PRUEFER-02-messung-desktop.log` (Zeilen 3 bis 14 und 34 bis 70).

| Ansicht | LCP ms E0 · AV1 · jetzt | LCP E0 heute (Spanne; Δ; erfüllt) | INP ms E0 · AV1 · jetzt | INP E0 heute (Spanne; Δ; erfüllt) | CLS E0 · AV1 · jetzt |
|---|---|---|---|---|---|
| H01 Start | 164 · 172 · 208 | 160 (80; +48; ja) | 40 · 48 · 32 | 40 (16; −8; ja) | 0,000 · 0,000 · 0,000 |
| H02 Autoschlüssel | 172 · 172 · 160 | 160 (64; 0; ja) | 40 · 32 · 24 | 40 (8; −16; ja) | 0,000 · 0,000 · 0,000 |
| H03 Modell Golf | 188 · 180 · 176 | 140 (44; +36; ja) | 48 · 56 · 40 | 48 (8; −8; ja) | 0,000 · 0,000 · 0,000 |
| H04 Assistent | 144 · 128 · 172 | 152 (32; +20; ja) | 48 · 40 · 48 | 48 (8; 0; ja) | 0,000 · 0,000 · 0,000 |
| H05 Code-Shop | 144 · 148 · 180 | 152 (24; **+28; nein**) | 40 · 32 · 24 | 40 (8; −16; ja) | 0,000 · 0,000 · 0,000 |
| H06 Code-Produkt | 136 · 132 · 168 | 168 (52; 0; ja) | 40 · 48 · 32 | 40 (8; −8; ja) | 0,000 · 0,000 · 0,000 |
| H07 Zylinder-Konfigurator | 160 · 144 · 136 | 180 (72; −44; ja) | 56 · 48 · 48 | 56 (16; −8; ja) | 0,000 · 0,000 · 0,000 |
| H08 Schließanlagen | 140 · 164 · 156 | 172 (68; −16; ja) | 48 · 40 · 32 | 40 (8; −8; ja) | 0,000 · 0,000 · 0,000 |
| H09 Tür-/Schließtechnik | 156 · 164 · 152 | 144 (52; +8; ja) | 40 · 32 · 24 | 40 (0; −16; ja) | 0,000 · 0,000 · 0,000 |
| H10 Warenkorb | 116 · 120 · 120 | 120 (32; 0; ja) | 40 · 48 · 48 | 40 (8; +8; ja) | 0,038 · 0,003 · 0,003243 |
| H11 Kasse | 116 · 124 · 108 | 104 (32; +4; ja) | 40 · 40 · 40 | 48 (8; −8; ja) | 0,031 · 0,004 · 0,003982 |
| H12 Ratgeber | 116 · 144 · 116 | 128 (28; −12; ja) | 48 · 40 · 24 | 48 (8; −24; ja) | 0,000 · 0,000 · 0,000 |

Budgets Desktop am Median: keine Verstöße. Z-08 Desktop: 35 von 36 Werten erfüllt; Nicht erfüllt H05 Code-Shop LCP (Median 180 ms, Spanne E0 24 ms, Δ +28 ms). Handrechnung im Protokoll bestätigt: Einzelwerte jetzt 176, 232, 180 ms; E0 heute 152, 176, 152 ms (`E7-PRUEFER-02-messung-desktop.log`, Zeile 34 und `E7-PRUEFER-02-ergebnis.md`).

---

## Tabelle 3 · Übrige Ansichten (ALLE_U, 11 Ansichten; E0 ohne Lauf)

E0 hat keinen Lauf für ALLE_U („fehlt“). AV1 aus `E6-PRUEFER-C-ergebnis.md` T3. Jetzt aus `E7-PRUEFER-C-konsole.log` (zweite Tabelle), `E7-PRUEFER-C-bildsatz.log`, `E7-PRUEFER-C-a11y.log`, `E7-PRUEFER-C-bewegung-reduziert.log` (zweite Tabelle).

| Ansicht | Konsole Fehler/Warn./Seitenf. (jetzt) | abgebrochene Anfragen AV1 · jetzt | Überlauf (jetzt, m/t/d) | Elemente über den rechten Rand m/t/d AV1 · jetzt | axe ernst/kritisch mobil · Desktop (jetzt) | Bewegung reduziert (jetzt) |
|---|---|---|---|---|---|---|
| gleichschliessende-zylinder | 0/0/0 | 1 · 0 | nein/nein/nein | 8/4/4 · 8/4/4 | 0/0 · 0/0 | 0 Befunde, 0 laufende |
| service-und-termin | 0/0/0 | 3 · 2 | nein/nein/nein | 33/1/0 · 33/1/0 | 0/0 · 0/0 | 0 / 0 |
| artikel | 0/0/0 | 0 · 0 | nein/nein/nein | 0/0/0 · 0/0/0 | 0/0 · 0/0 | 0 / 0 |
| standorte-berlin | 0/0/0 | 2 · 2 | nein/nein/nein | 1/0/1 · 1/0/1 | 0/0 · 0/0 | 0 / 0 |
| sicherheitstechnik-sicherheitscheck | 0/0/0 | 0 · 0 | nein/nein/nein | 0/0/0 · 0/0/0 | 0/0 · 0/0 | 0 / 0 |
| rechtliches-agb | 0/0/0 | 0 · 0 | nein/nein/nein | 8/2/0 · 8/2/0 | 0/0 · 0/0 | 0 / 0 |
| artikel-beispiel-schluesselkasten | 0/0/0 | 0 · 0 | nein/nein/nein | 1/1/0 · 1/1/0 | 0/0 · 0/0 | 0 / 0 |
| autoschluessel-schluesselbart-fraesen | 0/0/0 | 0 · 1 | nein/nein/nein | 1/1/1 · 1/1/1 | 0/0 · 0/0 | 0 / 0 |
| elektronische-zutrittsloesungen | 0/0/0 | 2 · 2 | nein/nein/nein | 3/3/2 · 3/3/2 | 0/0 · 0/0 | 0 / 0 |
| rechtliches-impressum | 0/0/0 | 0 · 0 | nein/nein/nein | 8/2/0 · 8/2/0 | 0/0 · 0/0 | 0 / 0 |
| service-und-termin-vor-ort | 0/0/0 | 1 · 1 | nein/nein/nein | 1/1/1 · 1/1/1 | 0/0 · 0/0 | 0 / 0 |

Summe abgebrochene Anfragen ALLE_U: AV1 9, jetzt 8. Bildsatz gekappt (`--max 6`, nicht nachgeholt, siehe Abweichungen): gleichschliessende-zylinder (m 6 von 14, t 6 von 10, d 6 von 10), service-und-termin (m 6 von 12, t 6 von 8, d 6 von 9), autoschluessel-schluesselbart-fraesen (m 6 von 8), elektronische-zutrittsloesungen (m 6 von 14, t 6 von 9, d 6 von 8). Bei gekappten Ansichten ist die Elementzahl eine Untergrenze.

Bewegung reduziert ALLE_U: 0 Befunde, 0 laufende Animationen, 0 verborgene Inhalte in 11 von 11 Ansichten (`E7-PRUEFER-C-bewegung-reduziert.log`, zweite Tabelle, JSON `bewegung-reduziert-2026-10-18_14-39-20.json`).

---

## Tabelle 4 · Bildrate der großen Momente (mobil; Median aus 5 Läufen; Schwelle 5 % verworfen am Median)

Jetzt: `E7-PRUEFER-02-bildrate.log` (Build `_yaN_J`, Dauer 1800 ms für H01, sonst 1600 ms; Prozessor 4-fach gedrosselt). Die Option `--geraet` wird von `bewegung.mjs bildrate` nicht ausgewertet (Lauf mobil). AV1: `E6-PRUEFER-C-ergebnis.md` T4. Kein E0-Wert (E0 ohne Bildrate).

| Moment | Seite | gemessenes Element (Größe; Treffer) | jetzt: Lauf 1 bis 5 (Anteil verworfen) | jetzt Median | AV1 Median (Einzelwerte) |
|---|---|---|---|---|---|
| Start (H01) | `/` | svg.block 480 × 360 (1 von 1) | 1,6 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %** innerhalb | 0,8 % (0,00 · 0,00 · 2,48 · 6,61 · 0,83; 1800 ms), innerhalb |
| Autoschlüssel (H02) | `/autoschluessel` | svg.block 246 × 138 (1 von 4) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %** innerhalb | 8,0 % (6,36 · 17,12 · 8,04 · 4,50 · 14,55), **über 5 %** |
| Schlüssel nach Code (H05) | `/schluessel-nach-code` | svg.block 382 × 215 (1 von 1) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %** innerhalb | 6,19 % (7,27 · 4,46 · 14,41 · 3,57 · 6,19), **über 5 %** |
| Schließanlagen (H08) | `/schliessanlagen` | svg.block 350 × 197 (1 von 2, 1 versteckt) | 0,0 · 0,0 · 1,8 · 0,0 · 2,8 | **0,0 %** innerhalb | 9,91 % (9,91 · 8,04 · 19,09 · 8,11 · 22,73), **über 5 %** |
| Tür- und Schließtechnik (H09) | `/tuer-und-schliesstechnik` | svg.block 378 × 236 (1 von 1) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %** innerhalb | 5,31 % (3,64 · 4,55 · 5,31 · 5,45 · 5,41), **über 5 %** (knapp) |
| Ratgeber verloren (H12) | `/ratgeber/autoschluessel-verloren-was-tun` | svg.block 350 × 263 (1 von 2, 1 versteckt) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %** innerhalb | 0,00 % (2,68 · 0,00 · 4,46 · 0,00 · 0,00); AV1-Selektor 0 × 0 px, nur eingeschränkt aussagekräftig |
| Standort Berlin (U-STANDORTE) | `/standorte/berlin` | svg.block 350 × 263 (1 von 1) | 0,0 · 2,7 · 0,0 · 0,0 · 3,7 | **0,0 %** innerhalb | 1,82 % (4,55 · 4,50 · 1,82 · 1,83 · 1,82), innerhalb |
| Service und Termin (U-SERVICE) | `/service-und-termin` | svg.block 318 × 382 (1 von 2, 1 versteckt) | 0,0 · 0,0 · 0,0 · 2,8 · 0,0 | **0,0 %** innerhalb | fehlt (im AV1-Bildratenlauf nicht gemessen) |

Ergebnis jetzt: 8 von 8 Momenten Median 0,0 %, alle innerhalb 5 %. Höchster Einzelwert 3,7 % (U-STANDORTE, Lauf 5). AV1: 4 von 7 Momenten am Median über 5 %. Die Änderung ist im Protokoll nicht erklärt; Build, Element und Dauer unterscheiden sich zwischen AV1 und jetzt (AV1 H12 mit 0 × 0 px Selektor). Die Einzelbilder (`E7-PRUEFER-C-einzelbilder.log`, 8 Momente, je EXIT 0) zeigen für H12 und U-SERVICE jetzt Elemente mit Größe (H12 471 × 265 px; U-SERVICE 423 × 238 px), im Gegensatz zu AV1 (0 × 0 px, `E6-PRUEFER-C-ergebnis.md` T2 Schritt 2).

---

## Tabelle 5 · Kriterien aus `_werkstatt/ABNAHME.md` (nur Messergebnisse; das Urteil fällt der Endprüfer)

| Kriterium | Prüfung | Ergebnis | Beleg |
|---|---|---|---|
| **Z-02** Bestand | Build, Typ, Lint, Tests mindestens so grün wie E0; Funktionsliste vollständig; 0 neue Konsolenfehler | Build 208/208 (E0 198/198). Typ EXIT 0. Lint EXIT 0. Unit 73/73 Dateien, 1217/1217 Tests (E0 31/31, 680/680). DB 7/7, 52/52. Funktionsliste 14/14. Konsole: 0 Fehler, 0 Warnungen, 0 Seitenfehler in 23 Ansichten. Abgebrochene Anfragen (`ERR_ABORTED`, RSC-Vorabruf) 15 jetzt (Haupt 7, ALLE_U 8), AV1 16, E0 14 (nur Haupt). Logik 15 Dateien, 0 abweichend. Textabzug 6 von 6 gleich. Vorbehalt: der Build-Log der Messungen ohne EXIT-Zeile; „nicht schlechter als E0“ je Funktion nicht bewertbar (kein E0-Funktionsprotokoll). | `E7-PRUEFER-C-build.log`, `-typecheck.log`, `-lint.log`, `-test-unit.log`, `-test-db.log`, `-funktionsliste.log`, `-konsole.log`, `-logik.log`, `-textabzug.log`; Build iKl `E7-L-44-build.log` (EXIT 0) |
| **Z-05** Bewegung | Register K-007 und Prüfstufe C; reduziert ohne Lage- oder Größenänderung; große Momente mobil ≤ 5 % verworfen | Bildrate 8 von 8 Momenten Median 0,0 %, alle innerhalb 5 %. Bewegung reduziert: 0 Befunde, 0 laufende Animationen, 0 verborgene Inhalte in 23 Ansichten. Animationen: 4 vollständige Läufe, 0 unbekannte Keyframes. Register: `E7-PRUEFER-C-register.md` (Teil 5, Stand vor KERN 1.19) und KERN 1.19 mit Angleichung: R-1 bis R-7 und N-1 bis N-5 behoben oder gedeckt; offen R-8 (B-13, nicht messbar) und Befund 12 Teil (Hover und Fokus einzelner Karten und Links nicht bedient). Abweichung: Keyframes beobachtet 19 von 22 (nicht 15 wie im Teil-5-Bericht). | `E7-PRUEFER-02-bildrate.log`, `E7-PRUEFER-C-bewegung-reduziert.log`, `E7-PRUEFER-C-animationen.log`, `E7-PRUEFER-C-register.md`, `_werkstatt/KERN.md` (B-06 bis B-29, Version 1.19) |
| **Z-06** Grafik | Eine Icon-Familie (lucide entfernt); alle SVG optimiert und zugänglich; keine doppelten Kennungen je Ansicht | SVG-Prüfung 23 Ansichten, 938 SVG (528 Haupt, 410 übrige). Dateien mit Befund: 1 (`src/app/(site)/icon.svg`, 2 XML-Kommentare, 1171 Byte). Unbenannte sichtbare SVG: 0 je Ansicht. Doppelte id: 0 je Ansicht. lucide-Reste: 0 je Ansicht; `grep -rln "lucide-react" src package.json` ohne Treffer. Familie Haupt: Icons 454, Grafiken (role=img) 38, andere 36. Übrige: Icons 364, Grafiken 16, andere 30. „Andere“ sind die dekorativen Profillinien (`visual/profillinie.tsx`). | `E7-PRUEFER-C-svg.log` (Haupt EXIT 0, übrige EXIT 0), `/root/sm24-bilder/e7-c/svg-haupt.json`, `svg-uebrige.json` |
| **Z-07** Zugänglichkeit | 0 ernste oder kritische Befunde auf Hauptansichten; Hauptaufgaben nur mit Tastatur bei sichtbarem Fokus | axe ernst 0, kritisch 0 in allen 12 Hauptansichten (mobil und Desktop); ebenso in den 11 übrigen Ansichten (moderate und minor 0). E7-L-44 (5 Seiten auf `iKl`) ebenfalls 0/0. Tastatur mobil 7/7, Tastatur Desktop 7/7; ohne sichtbaren Fokus: keine. E0 hatte 26 ernst und 4 kritisch (30 Verstöße in 24 Auswertungen). | `E7-PRUEFER-C-a11y.log`, `E7-L-44-a11y.log`, `E7-PRUEFER-C-tastatur-mobil.log`, `E7-PRUEFER-C-tastatur-desktop.log`, E0 `E0-PRUEFER-05-ausgangswerte.md` Tabelle B |
| **Z-08** Leistung | Budgets auf allen Hauptansichten; keine Ansicht schlechter als E0 um mehr als die E0-Spanne | Budgets am Median: keine Verstöße (24 Serien). Vergleich E0 heute: mobil **36 von 36** erfüllt (LCP 12/12, CLS 12/12, INP 12/12). Desktop **35 von 36** erfüllt; Überschreitung H05 Code-Shop LCP (+28 ms gegen E0-Spanne 24 ms). Zum Vergleich AV1 (andere Messung, gegen E0 heute von E6): mobil LCP 10 von 12, INP 11 von 12 über der Spanne. Abweichung von ABNAHME: 3 Läufe je Profil verlangt; gemessen mobil 5, Desktop 3 (nach Paket). | `E7-PRUEFER-02-messung-mobil.log`, `E7-PRUEFER-02-messung-desktop.log`, `E7-PRUEFER-02-ergebnis.md`, `E6-PRUEFER-C-ergebnis.md` T6 |
| **Z-09** Darstellung | Bildsatz: kein Überlauf, kein abgeschnittener oder überlappender Text | Dokumentüberlauf: nein in 69 von 69 Läufen. Elemente über den rechten Rand (Werkzeug, jetzt): mobil H01 73, H02 84, H08 60, H09 16, H05 7, H06 6, H03 4, H07 1, H12 1; ALLE_U service-und-termin 33, gleichschliessende-zylinder 8, rechtliches-agb 8, rechtliches-impressum 8. Urteil über Abgeschnittenes und Überdeckung: Endprüfer. Protokollseitig (Werkzeug): gekappte Bildsätze siehe Tabelle 3. | `E7-PRUEFER-C-bildsatz.log`, `E6-PRUEFER-C-bildsatz.log` (AV1), `E0-PRUEFER-05-bildsatz.log` (E0) |

---

## Registerbefunde R-1 bis R-8, N-1 und Befund 12 (Stand KERN 1.19)

Quelle des Standes: `_werkstatt/KERN.md`, Version 1.19 (Zeile 1 und Änderungsliste Zeile 335), Register K-007 (B-01 bis B-29, Zeilen 191 bis 219), Code (siehe Spalte Beleg), Nachprüfung E7-L-44 (`E7-L-44-animationen.log`, `E7-L-44-a11y.log`, `E7-L-44-konsole.log`, `E7-L-44-build.log`).

| Nr. | Befund (Teil 5) | Stand jetzt | Beleg | Status |
|---|---|---|---|---|
| R-1 | Schleier hinter der Schublade (`animate-schleier-ein`, quick) fehlt in B-07 | B-07 nennt „Schleier blendet ein (`animate-schleier-ein`, `quick`)“ (KERN.md Zeile 197). Code `site-header.tsx:392` unverändert. | KERN.md:197; `site-header.tsx:392` | **behoben** (gedeckt) |
| R-2 | B-07 „Öffnen als Transition“ entspricht nicht dem Code (Keyframe `animate-schublade-ein`) | B-07 nennt jetzt „Schublade fährt ein (`animate-schublade-ein`, `translateX(100%)` → 0, `base` `enter`)“ (KERN.md:197). Im Code steht `site-header.tsx:165` noch der Kommentar „Öffnen als Transition“. | KERN.md:197; `site-header.tsx:403` (Keyframe), `:165` (Kommentar) | **Register behoben**; Kommentar im Code offen (kosmetisch) |
| R-3 | B-07 „raus quick/exit“, im Code kein Ausgangs-Übergang | B-07 nennt „Schließen ohne Ausgang (die Schublade wird ausgehängt)“ (KERN.md:197). Code unverändert ohne Ausgang. | KERN.md:197; `site-header.tsx:363` | **behoben** (Text an den Code angeglichen) |
| R-4 | `menue-ein` im Untermenü der Schublade fehlt in B-07 | B-07 nennt „Untermenü eines Bereichs `animate-menue-ein` (`base`)“ (KERN.md:197). Code `site-header.tsx:480`. | KERN.md:197; `site-header.tsx:480` | **behoben** (gedeckt) |
| R-5 | Markenpfeile ohne Dauer-Token (2 px, 150 ms statt 4 px, `quick`) | Code jetzt `duration-quick ease-standard` an `autoschluessel/marken/page.tsx:149` und `:199` sowie `[make]/page.tsx:345` (Commit 3315165). `grep translate-x-0.5` in diesen Dateien: kein Treffer. Regel „kein Übergang ohne Dauer-Token“ in KERN 1.19. | `marken/page.tsx:149,199`; `marken/[make]/page.tsx:345`; KERN.md:196 (B-06) | **behoben** (Code) |
| R-6 | Filter-Schalter Artikelliste ohne Dauer (150 ms statt `quick`) | Code `artikel/artikel-liste.tsx:135` jetzt `duration-quick ease-standard` (Commit 3315165). B-29 nennt „Filter der Artikelliste“ (KERN.md:219). | `artikel-liste.tsx:135`; KERN.md:219 | **behoben** |
| R-7 | Eingabefelder (`forms/controls.tsx:10`) ohne Eintrag | B-29 nennt „Eingabe- und Auswahlfelder in `forms/controls.tsx`“ (KERN.md:219). Code `controls.tsx:10` mit `duration-quick`. | KERN.md:219; `controls.tsx:10` | **behoben** (gedeckt) |
| R-8 | B-13 (ViewTransition) nicht gemessen | Text: B-13 „das Prüfwerkzeug erfasst sie nicht, belegt ist sie am Code“ (KERN.md:203). Dauer am Code `--dauer-slow` (`globals.css:706–712`). Messung weiterhin nicht möglich: `transitionstart` erfasst die ViewTransition nicht; die Bedienung löst keinen Seitenwechsel aus. | KERN.md:203; `globals.css:706–712`; `seitenwechsel.tsx:26` | **offen** (Messlücke, im Register als nur am Code belegt gekennzeichnet) |
| N-1 | zutritt-signal endet nach E6 bei ca. 2,45 s; Text sagt ≤ 1,55 s | Code: Funk-Bögen `motionStyle(0, 0.9 + i·0.1)` und `motionStyle(0, 1.1)` (`zutritt-signal.tsx:299, :306`), Marke `sm24-pop` mit `motionStyle(0.75)` (`:314`, Dauer `--dauer-enter` 600 ms, Ende 1,35 s), Status `motionStyle(1)` mit Standarddauer `--dauer-enter` 600 ms (`:328`, Ende 1,60 s), Haken `motionStyle(1.2, 0.4)` (`:337`, Ende 1,60 s; `globals.css` Zeile 166 für `--dauer-enter`). Text KERN 1.19: „endet bei 1,60 s (≤ 1,6 s)“, Korrektur zu 1.17. Die Code-Änderung der Bögen liegt vor f6e55ab (nicht Teil von 3315165). | `zutritt-signal.tsx:299,306,314,328,337`; KERN.md Zeile 335; `motion-style.ts:33` | **behoben** (Code und Text); Grenze 1,6 s wird genau erreicht |
| Befund 12 (E6) | Übergänge beim Bedienen nicht erfasst | Messung erfasst jetzt Übergänge je Ansicht (Zählung inkl. Bedienung, `animationen.mjs` Zeile 43; Felder „uebergang“ in JSON). Gemessen: Megamenü (B-08), Schublade (B-07), Schrittwechsel (B-11, nur H07), Ladeanzeige (B-19). Nicht bedient: Hover und Fokus einzelner Karten und Links (nur Megamenü überfahren), B-13. | `E7-PRUEFER-C-animationen.log`; `E7-PRUEFER-C-register.md` Abschnitt 2 | **teilweise offen** (Hover und Fokus einzelner Karten und Links; B-13) |

Zusätzlich aus Teil 5 (Register-Protokoll, keine R-Nummer): B-22, B-24 und B-28 nur stichprobenartig am Code geprüft. Die Übergangszähler zählen je Eigenschaft, nicht je Element; die Zuordnung der Übergänge zu B-Einträgen ist eine Ableitung aus Code und Stichprobe. Die Akkordeon-Bedienung war in 12 Ansichten nicht auffindbar (siehe Auffällig).

Nachtrag Teil 6 zur Zählung der Keyframes: Von 22 bekannten Keyframes wurden 19 beobachtet (`menue-ein`, `schleier-ein`, `schublade-ein`, `sm24-aufdecken`, `sm24-dash`, `sm24-draw`, `sm24-erscheinen`, `sm24-fade`, `sm24-feder-heben`, `sm24-lesen-aktiv`, `sm24-pop`, `sm24-reveal`, `sm24-schluessel-ein`, `sm24-schritt-vor`, `sm24-schritt-zurueck`, `sm24-scrub-marke`, `sm24-scrub-y`, `sm24-stift-heben`, `spin`). Nicht beobachtet: `bounce`, `ping`, `pulse` (in `src` nicht verwendet). Quelle: die vier Tabellen in `E7-PRUEFER-C-animationen.log`. Der Teil-5-Bericht nennt 15.

Bedienung in den vier Läufen (zusammengezählt aus `E7-PRUEFER-C-animationen.log`, 46 Ansichts-Zeilen): Megamenü überfahren ja 23; Megamenü klicken ja 23; Schublade ja 23; Untermenü ja 23; Escape ja 46; Akkordeon öffnen ja 23 / nein 23; Akkordeon schließen ja 23 / nein 23; Weiter ja 2 / nein 44 (ja nur H07, Desktop und Mobil; Zeilen ohne Schaltfläche tragen „nein/nein“); Zurück ja 2 (nur H07; in den übrigen Zeilen nicht aufgeführt); Fehler 0.

---

## Budget-Verstöße

- Jetzt: **keine** am Median (mobil 12 Ansichten, Desktop 12 Ansichten; LCP, CLS, INP) und kein Einzelwert über Budget. Größter Einzellauf: LCP 784 ms (H06 mobil), INP 176 ms (H02 mobil) (`E7-PRUEFER-02-messung-mobil.log`, Spanne).
- E0 (Vergleich, `E0-PRUEFER-05-ausgangswerte.md` Tabelle A): H10 mobil LCP 2508 ms (Budget 2500) und CLS 0,117; H11 mobil CLS 0,104.
- AV1 (`E6-PRUEFER-C-ergebnis.md` T2, T4): keine am Median; Einzellauf INP 200 ms H08 mobil (Lauf 2, Grenzfall).
- Bildrate (K-011): jetzt keine Verstöße (8 von 8 innerhalb 5 %). AV1: H02, H05, H08 über 5 %, H09 knapp (5,31 %).

## axe serious oder critical

- Jetzt: **keine**. Alle 23 Ansichten, mobil und Desktop: 0 kritisch, 0 ernst, 0 moderate, 0 gering (`E7-PRUEFER-C-a11y.log`, JSON `a11y-2026-10-18_14-37-23.json` und `a11y-2026-10-18_14-38-27.json`, je 24 Zeilen mit `zaehl` 0). E7-L-44: 5 Seiten × 2 Geräte, 0/0 (`E7-L-44-a11y.log`).
- Zum Vergleich E0: `target-size` (ernst, 24 Auswertungen), `button-name` (kritisch) H04 mobil und H07 mobil, `label` (kritisch) H06 mobil und Desktop (`#foto-ms-01-camera`, `#foto-ms-01-gallery`), `scrollable-region-focusable` (ernst) H08 mobil (`.table-scroll`), `color-contrast` (ernst) H09 Desktop (`.text-3xl`).

## Nicht bestandene Funktionen (auch Tastatur)

- **Keine.** Funktionsliste 14 von 14 (`E7-PRUEFER-C-funktionsliste.log`, Zeile 59). Tastatur mobil 7 von 7 (`E7-PRUEFER-C-tastatur-mobil.log`, Zeile 57). Tastatur Desktop 7 von 7 (`E7-PRUEFER-C-tastatur-desktop.log`, Zeile 57). Ohne sichtbaren Fokus: keine. Eine Wiederholung mit `--nur` war nicht nötig.
- Zum Vergleich AV1: Erstlauf Tastatur F-01 mobil und Desktop nicht bestanden (Menge 2 zeigte 12, Summe 78,72 €), Wiederholung ebenfalls nicht bestanden, Nachlauf bestanden (Menge 2 = 2, Summe 20,95 €; `E6-PRUEFER-C-tastatur-mobil-nachtrag.log`).

## Offene Registerbefunde

Siehe Tabelle „Registerbefunde“. Offen: R-8 (B-13, Messlücke), Befund 12 Teil (Hover und Fokus einzelner Karten und Links), Code-Kommentar `site-header.tsx:165` („Öffnen als Transition“, R-2). Keine weiteren offenen R-Befunde nach KERN 1.19.

## SVG-Befunde

- `src/app/(site)/icon.svg`: 2 XML-Kommentare (`<!-- Schlüsselkopf -->`, `<!-- Schlüsselschaft & Bärte -->`), 1171 Byte (`E7-PRUEFER-C-svg.log`, Abschnitt „Dateien“). Das ist der einzige Werkzeugbefund.
- Hinweis ohne Werkzeugbefund: Die Datei nutzt feste Farbwerte (`#0f172a`, `#1e293b`, `#60a5fa`, `#2563eb`, `#38bdf8`, `#334155`) und zwei Kennungen (`sm24-grad`, `sm24-key`, je einmal). Die Kennungen sind innerhalb der Datei eindeutig; doppelte id in den Ansichten 0. Die Farbwerte sind keine Protokollbefunde.
- Die Familien-Zählung „Icons (eine Familie)“ ist die Kategorie des Werkzeugs; die Attribute wurden nicht gegen `data-sm24-icon` nachgezählt.

## Z-08-Überschreitungen

- **Mobil: keine** (36 von 36 erfüllt; `E7-PRUEFER-02-ergebnis.md`).
- **Desktop: eine.** H05 Code-Shop LCP: Median 180 ms, E0 heute 152 ms, Δ +28 ms, E0-Spanne 24 ms (`E7-PRUEFER-02-messung-desktop.log`, Zeile 34; Handrechnung bestätigt).
- Zum Vergleich AV1 (`E6-PRUEFER-C-ergebnis.md` T6, andere Messung): mobil LCP 10 von 12 über Spanne, INP 11 von 12.

## Abweichungen im Bestand

1. Build-Log der Messungen (`E7-PRUEFER-C-build.log`, Build `_yaN_J`) ohne EXIT-Zeile; „Compiled successfully“ und 208/208 sind vorhanden.
2. Port 3000 läuft seit 12:57 UTC mit Build `iKl_M5gLZWsTLj9wvJVXf` (nach E7-L-44), nicht mit `_yaN_J`, auf dem die Messungen laufen. Die Änderung ist ein Klassen-Zusatz an sechs Übergängen (5 Dateien, 6 Zeilen, `git diff f6e55ab HEAD -- src`).
3. Zwei Fehlversuche beim Build iKl (EXIT 1, Zeilen 1019 und 2039). Der Turbopack-Zwischenspeicher `.next/cache` wurde vor dem Erfolgslauf nach `/root/sm24-cache-sicherung` verschoben, nicht gelöscht; Erfolg EXIT 0 in Zeile 2170 (`E7-L-44-build.log`).
4. Wertesuche: 22 Ausnahmen in 13 Dateien (AV1 20; E0 10; nicht vergleichbar, weil anderer Basisstand).
5. Bildsätze gekappt (`--max 6`) bei gleichschliessende-zylinder, service-und-termin, autoschluessel-schluesselbart-fraesen, elektronische-zutrittsloesungen (Tabelle 3); nicht nachgeholt.
6. E0-Protokolle für Funktionsliste, Logikwächter und Textabzug fehlen im Ordner; die E0-Zahl 14/14 stammt aus `E6-PRUEFER-C-ergebnis.md` T1.
7. Die Messungen von AV1 (Leistung, Bildrate) stammen vom Messstand 17.10. vor dem Build 2cdcbab (`E6-PRUEFER-C-ergebnis.md` T2, T4, T6). Die Build-Kennung der AV1-Messung ist dort nicht eindeutig angegeben (E6 T6 nennt für Port 3000 `mJcKPvGMRy5iL1fttdhAu`, gebaut 22:25 UTC am 17.10.). Vergleiche mit AV1 sind mit diesem Vorbehalt zu lesen.
8. Ladeweg-Werkzeug ohne `--json` hat zwei JSON-Dateien ohne Präfix in den Protokollordner gelegt: `ladeweg-2026-10-18_14-24-35.json` und `ladeweg-2026-10-18_14-25-15.json` (Ortszeit). Außerdem liegen dort zwei frühere `ladeweg-2026-10-18_12-13-*.json` (10:13 UTC). Nicht verschoben.
9. Datei außerhalb der Schreibrechte: `/tmp/sm24-e7c-root.html` (420 993 Byte, 12:01 UTC, Ausgabe der curl-Probe von Teil 1). Nicht gelöscht.
10. Der Teil-5-Bericht nennt 15 beobachtete Keyframes; das Protokoll ergibt 19 (siehe oben).
11. Teil 6 hat selbst im Lauf zwei Hilfsdateien angelegt: `/root/sm24-bilder/parse_bildsatz.py` und `/root/sm24-bilder/parse_anim.py` (Zählhilfen, außerhalb `…/e7-c/`). Außerdem wurde `/tmp/x.html` durch eine curl-Probe beschrieben. Nichts gelöscht; die Dateien stehen hier zur Entscheidung.
12. `E7-PRUEFER-C-ergebnis.md` (Stand 12:50 UTC) nennt Teil 5 als offen und ist damit überholt. Sie wurde nicht überschrieben (Auftrag); diese Fassung ersetzt sie inhaltlich.
13. Akkordeon-Bedienung: „nicht gefunden“ in 12 Ansichten (H01, H04, H10, H11, H12, /artikel, /artikel/beispiel-schluesselkasten, /rechtliches/agb, /rechtliches/impressum, /service-und-termin/vor-ort, /sicherheitstechnik/sicherheitscheck, /standorte/berlin). B-09 dort nicht gemessen.
14. Weiter und Zurück nur auf H07 gemessen (Schrittwechsel B-11). B-10 nur indirekt.
15. `bewegung.mjs bildrate` wertet `--geraet` nicht aus.
16. Die Übergangszähler zählen je Eigenschaft, nicht je Element.

## Auffällig (eigener Eintrag je Befund)

1. Z-08 Desktop, H05 Code-Shop LCP nicht erfüllt: Median 180 ms, E0 heute 152 ms, +28 ms gegen E0-Spanne 24 ms (`E7-PRUEFER-02-messung-desktop.log`).
2. Build-Protokoll `E7-PRUEFER-C-build.log` ohne EXIT-Zeile (Exit-Code nicht belegt).
3. Port 3000 mit Build `iKl` seit 12:57 UTC (nicht `_yaN_J`).
4. Konsole, abgebrochene Anfragen (`net::ERR_ABORTED`, RSC-Vorabruf): H01 1, H02 1, H03 2, H09 1, H12 2; ALLE_U service-und-termin 2, standorte-berlin 2, autoschluessel-schluesselbart-fraesen 1, elektronische-zutrittsloesungen 2, service-und-termin-vor-ort 1. Ursache nicht untersucht.
5. Elemente über den rechten Rand (Werkzeug, mobil): H02 84, H01 73, H08 60, H09 16, H05 7, H06 6, H03 4; ALLE_U service-und-termin 33. Dokumentüberlauf nein. Urteil über Abgeschnittenes: Endprüfer.
6. Sichtung Teil 2 (Erstbilder): fixierte untere Leisten überdecken Inhalt in H04, H07 und sicherheitstechnik-sicherheitscheck (mobil), Kacheln und Chips am rechten Rand abgeschnitten in H02 und rechtliches-agb/-impressum (mobil), Zeitleisten-Hilfslinien in service-und-termin (Desktop). Diese Sichtung ist nicht am Protokoll geprüft (kein Protokoll im Ordner, nur Bildsätze unter `/root/sm24-bilder/e7-c/`).
7. Inhalt rechtliches-agb und rechtliches-impressum: Platzhalter `[Platzhalter: …]` und der Hinweis „vor dem Livegang juristisch geprüft“ (Sichtung Teil 2; kein Technikbefund, nicht gewertet).
8. Akkordeon: „nicht gefunden“ in 12 Ansichten; B-09 dort nicht gemessen (`E7-PRUEFER-C-animationen.log`).
9. Weiter/Zurück: nur H07 gemessen; sonst „nein“ (Bedienung nicht auffindbar, keine Fehler).
10. Bildrate: AV1 4 von 7 Momenten über 5 %; jetzt 0 von 8. Ursache der Änderung nicht im Protokoll erklärt (`E7-PRUEFER-02-bildrate.log`).
11. Z-08 mobil: bei AV1 wurden LCP und INP in 10 bzw. 11 Ansichten über der E0-Spanne gemessen; jetzt 0 Verstöße. Vergleich mit Vorbehalt (Messstand, siehe Abweichung 7).
12. Z-08: ABNAHME nennt 3 Läufe je Profil; gemessen mobil 5, Desktop 3 (nach Paket).
13. Ladeweg: Bytes vor FCP 0,0 KB in allen drei Routen; mit E0 (59,9 / 72,5 / 58,7 KB) nicht vergleichbar (`E7-PRUEFER-02-ergebnis.md`, Ladeweg).
14. Z-06: SVG-Befund `icon.svg` (2 Kommentare). Feste Farbwerte in derselben Datei (Hinweis, kein Werkzeugbefund).
15. Registerbefund R-8 (B-13 ViewTransition) nicht messbar; Text ehrlich, offen.
16. Befund 12 teilweise offen: Hover und Fokus einzelner Karten und Links nicht bedient.
17. R-2: Code-Kommentar `site-header.tsx:165` nennt das Öffnen der Schublade „als Transition“; Register bereinigt, Kommentar nicht.
18. Teil-5-Bericht: 15 beobachtete Keyframes; Protokoll: 19.
19. Wertesuche 22 Ausnahmen (AV1 20), neue Datei `code-fundstelle.test.tsx` seit AV1 (Befund unverändert, Ausnahmen bei Farbfunktionen in Tests und Generatoren).
20. Gefüllt (Warenkorb/Kasse): mobil 5/7, tablet 3/5, desktop 3/4; Einheit im Protokoll nicht ausgewiesen (`E7-PRUEFER-C-gefuellt.log`).
21. Test-DB: Nutzer `ubuntu` im Protokoll nicht vermerkt; Ergebnis 7/7, 52/52.
22. Keine Abweichung in Logik (15/0), Textabzug (6/6), Konsole (0/0/0), axe (0/0), Bewegung reduziert (0), SVG (unbenannt 0, doppelte id 0, lucide 0), Funktionsliste (14/14), Tastatur (7/7 je Gerät).

## Bildbelege

- Hauptansichten: `/root/sm24-bilder/e7-c/<Ansicht>__desktop__00.jpg` bis `__05.jpg` und `__mobil__…jpg` (Bildsatz `E7-PRUEFER-C-bildsatz.log`: 224 Bilder unter `/root/sm24-bilder/e7-c`).
- Übrige: `/root/sm24-bilder/e7-c/uebrige/` (164 Bilder).
- Einzelbilder: `/root/sm24-bilder/e7-c/einzelbilder/<H01|H02|H05|H08|H09|H12|U-STANDORTE|U-SERVICE>/`.
- Gefüllt: `/root/sm24-bilder/e7-c/gefuellt/`; Schritte Funktionsliste: `/root/sm24-bilder/e7-c/schritte/`.
- Messung und Bildrate (JSON): `/root/sm24-bilder/e7-p2/`.
- Animationen (JSON): `/root/sm24-bilder/e7-c/animationen-desktop.json`, `animationen-mobil.json`, `animationen-desktop-uebrige.json`, `animationen-mobil-uebrige.json`; E7-L-44: `/root/sm24-bilder/e7-c/animationen-e7l44-desktop.json`.
- SVG (JSON): `/root/sm24-bilder/e7-c/svg-haupt.json`, `svg-uebrige.json`.

Nicht geprüft in Teil 6: Bilder selbst (keine Sichtung), Gestaltung (kein Urteil), Commits und Arbeitsbaum außerhalb der Protokolle.

=== ENDE E7-PRUEFER-C · TEIL 6 · VOLLSTÄNDIG · BEREIT ZUR RÜCKGABE ===
