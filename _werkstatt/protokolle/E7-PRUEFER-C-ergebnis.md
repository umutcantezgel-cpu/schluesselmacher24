# E7-PRUEFER-C · Ergebnis Abschlussversuch 2 (Teil 6)

Erstellt aus den Protokollen im Ordner `/home/user/schluesselmacher24/_werkstatt/protokolle/` (Kurzname = Datei in diesem Ordner). Protokollstand: 2026-10-18, 12:50 UTC.

## Kopf

- **Server Port 3000** (Endstand): `.next/BUILD_ID` = `_yaN_J-sWFLTSeQqU6QII`, Build 208/208 (`E7-PRUEFER-C-build.log`).
- **Commit**: HEAD `0692db6`. Der Auftrag nennt `f6e55ab`, das ist Vorfahr von HEAD. Zwischen beiden keine Änderung an `src`, `public`, `content`, `next.config.ts`, `package.json` (`E7-PRUEFER-02-ergebnis.md`, Kopf).
- **Port 3100** = E0-Ausgangsstand, nur für den Vergleichslauf in Teil 4 (`E7-PRUEFER-02-messung-*.log`, `E7-PRUEFER-02-ladeweg.log`).
- **Vergleichsbasen**:
  - **E0** = `E0-PRUEFER-05-ausgangswerte.md` und `E0-PRUEFER-05-messung.log` (Messung 15.10., 3 Läufe je Profil, Build 198/198).
  - **AV1** = Abschlussversuch 1, `E6-PRUEFER-C-ergebnis.md`, Teil 6 Spalte „jetzt“ (Messung `messung-2026-10-17_16-46-12.json`, 3 Läufe je Profil, Stand vor 2cdcbab laut E6-Nachlese).
  - **„E0 heute“** = Vergleichslauf auf Port 3100 in `E7-PRUEFER-02-ergebnis.md` (mobil 5 Läufe, Desktop 3 Läufe).
  - **„jetzt“** = dieser Lauf (E7, Teil 2 bis 4).
- **Status Teil 5 (Register und SVG): NICHT abgeschlossen.** Stand 12:50 UTC:
  - Animationen: `desktop`, `mobil`, `desktop-uebrige` mit EXIT 0. `mobil-uebrige` lief noch.
  - SVG-Prüfung: nicht gelaufen, `E7-PRUEFER-C-svg.log` fehlt.
  - Registerdatei `E7-PRUEFER-C-register.md`: nicht geschrieben.
  - Sperre `/tmp/sm24-messfenster.lock`: nicht vorhanden (geprüft 12:47 UTC).
- Felder mit „fehlt“ stehen für: Wert liegt im Protokoll nicht vor (Grund steht jeweils dabei). Es wurde nichts geschätzt.

---

## Tabelle 1 · Bestand, Build, Funktionsliste, Tastatur, Wertesuche, Logik, Textabzug

| Prüfung | E0 | AV1 | jetzt | Beleg (jetzt) |
|---|---|---|---|---|
| Typprüfung `tsc --noEmit` | 0 Fehler (`E0-PRUEFER-05-ausgangswerte.md`) | 0 | EXIT 0, keine Fehlerzeilen | `E7-PRUEFER-C-typecheck.log` |
| Linter `eslint .` | 0/0 | 0/0 | EXIT 0, keine Befunde | `E7-PRUEFER-C-lint.log` |
| Unit `vitest run` | 31/31 Dateien, 680/680 Tests | 71/71, 1204 | **73/73 Dateien, 1217/1217 Tests**, EXIT 0 | `E7-PRUEFER-C-test-unit.log` |
| DB-Tests als ubuntu | 7/7, 52/52 | 7/7, 52/52 | **7/7, 52/52**, EXIT 0 | `E7-PRUEFER-C-test-db.log` |
| Build | 198/198 Seiten | 208/208 | **„Compiled successfully in 57s“, 208/208**. Keine EXIT-Zeile im Protokoll (Abweichung, siehe Auffällig). | `E7-PRUEFER-C-build.log` |
| curl Port 3000 | fehlt (nicht im E0-Protokoll) | fehlt | `/` HTTP 200, 420 993 Byte; `/gibt-es-nicht-pruefung` HTTP 404; „Hinweis für die Redaktion“ im HTML von `/`: 0 Treffer | `E7-PRUEFER-C-curl.log` |
| Funktionsliste F-01 bis F-14 | fehlt (kein E0-Protokoll gefunden; E6-Bericht nennt 14/14) | 14/14 (Nachlauf) | **14/14 bestanden** | `E7-PRUEFER-C-funktionsliste.log` |
| Tastatur mobil (F-01, F-02, F-04 bis F-08) | nicht gemessen | 7/7 (Nachlauf; Erstlauf 6/7, F-01 nicht bestanden) | **7/7**, ohne sichtbaren Fokus: keine | `E7-PRUEFER-C-tastatur-mobil.log` |
| Tastatur Desktop (gleiche Funktionen) | nicht gemessen | 7/7 (Nachlauf; Erstlauf 6/7) | **7/7**, ohne sichtbaren Fokus: keine | `E7-PRUEFER-C-tastatur-desktop.log` |
| Wertesuche, Summe ohne Ausnahmen | 707 (196 Dateien, Basis b49fe04, 10 Ausnahmen) | 0 (20 Ausnahmen) | **0** (232 Dateien, Basis fcbcfb2, **22 Ausnahmen in 13 Dateien**) | `E7-PRUEFER-C-werte.log`, `E7-PRUEFER-C-werte.json` |
| Logikwächter `pruefen` | fehlt (kein E0-Protokoll gefunden) | 15 Dateien, 0 abweichend | **15 Dateien, 0 abweichend** | `E7-PRUEFER-C-logik.log` |
| Textabzug `vergleichen` | fehlt (kein E0-Protokoll gefunden) | 6 von 6 gleich | **6 von 6 gleich** (agb, widerruf, impressum, datenschutz, versand-und-zahlung, cookie-einstellungen) | `E7-PRUEFER-C-textabzug.log` |

Hinweis zur Wertesuche: Die E0-Zahl 707 hat eine andere Basis und einen anderen Umfang. Sie ist nicht direkt vergleichbar.

---

## Tabelle 2 · Hauptansichten H01 bis H12

### 2a · Konsole, Überlauf, Zugänglichkeit, Bewegung

Konsole: Im Protokoll `E7-PRUEFER-C-konsole.log` gibt es keine Geräteangabe. Die Zählung „Fehler/Warnungen/Seitenfehler“ war jetzt bei allen 12 Ansichten 0/0/0. Angegeben sind die abgebrochenen Anfragen (`net::ERR_ABORTED`, RSC-Vorabruf). Das Werkzeug zählt sie als Befund. Die Anzahl für E0 stammt aus der Desktop-Spalte von `E0-PRUEFER-05-ausgangswerte.md`.

Elemente über den rechten Rand (Z-09, Werkzeugzählung) stehen in `E7-PRUEFER-C-bildsatz.log`. Der Dokumentüberlauf war in allen Geräten „nein“. E0 weist nur H08 mobil (27) und H09 mobil/Tablet (1 und 1) aus. Alle übrigen E0-Felder sind im E0-Bericht mit „–“ belegt.

| Ansicht | Konsole Fehler/Warn./Seitenf. (jetzt) | abgebrochene Anfragen E0 · AV1 · jetzt | Dokument-Überlauf m/t/d (jetzt) | Elemente über rechten Rand m/t/d E0 · AV1 · jetzt | axe ernst/kritisch mobil · Desktop E0 · AV1 · jetzt | Bewegung reduziert jetzt (Befunde / laufende Animationen) |
|---|---|---|---|---|---|---|
| H01 Start | 0/0/0 | 0 · 1 · 1 | nein/nein/nein | – · 73/3/2 · 73/3/2 | m 1/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H02 Autoschlüssel | 0/0/0 | 0 · 0 · 1 | nein/nein/nein | – · 82/2/0 · 84/2/0 | m 1/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H03 Modell Golf | 0/0/0 | 2 · 1 · 2 | nein/nein/nein | – · 4/2/1 · 4/2/1 | m 1/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H04 Assistent | 0/0/0 | 1 · 0 · 0 | nein/nein/nein | – · 0/0/0 · 0/0/0 | m 1/1 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H05 Code-Shop | 0/0/0 | 2 · 0 · 0 | nein/nein/nein | – · 7/1/1 · 7/1/1 | m 1/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H06 Code-Produkt | 0/0/0 | 2 · 0 · 0 | nein/nein/nein | – · 6/3/1 · 6/3/1 | m 1/1 · 0/0 · 0/0 ; d 1/1 · 0/0 · 0/0 | 0 / 0 |
| H07 Zylinder-Konfigurator | 0/0/0 | 0 · 0 · 0 | nein/nein/nein | – · 1/1/1 · 1/1/1 | m 1/1 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H08 Schließanlagen | 0/0/0 | 1 · 1 · 0 | nein/nein/nein | 27 m · 60/4/3 · 60/4/3 | m 2/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H09 Tür- und Schließtechnik | 0/0/0 | 3 · 2 · 1 | nein/nein/nein | 1 m, 1 t · 16/1/1 · 16/1/1 | m 1/0 · 0/0 · 0/0 ; d 2/0 · 0/0 · 0/0 | 0 / 0 |
| H10 Warenkorb | 0/0/0 | 2 · 0 · 0 | nein/nein/nein | – · 0/0/0 · 0/0/0 | m 1/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H11 Kasse | 0/0/0 | 1 · 0 · 0 | nein/nein/nein | – · 0/0/0 · 0/0/0 | m 1/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |
| H12 Ratgeber | 0/0/0 | 0 · 2 · 2 | nein/nein/nein | – · 1/1/1 · 1/1/1 | m 1/0 · 0/0 · 0/0 ; d 1/0 · 0/0 · 0/0 | 0 / 0 |

Die axe-Spalte gibt „ernst/kritisch“ an, Reihenfolge E0 · AV1 · jetzt. „m“ ist mobil, „d“ ist Desktop. AV1 hat keine ernsten oder kritischen Befunde (`E6-PRUEFER-C-ergebnis.md`, Teil 6). Jetzt: 0/0 in allen Ansichten und beiden Geräten (`E7-PRUEFER-C-a11y.log`). Bewegung reduziert: E0 0, AV1 0, jetzt 0 Befunde und 0 laufende Animationen in allen 12 Ansichten (`E7-PRUEFER-C-bewegung-reduziert.log`).

### 2b · Leistung mobil (Median; Spanne in Klammern beim Vergleich)

Jetzt: `E7-PRUEFER-02-messung-mobil.log` (5 Läufe je Ansicht). Vergleich E0 heute: Spanne, Differenz und Erfüllt-Angabe aus demselben Protokoll (Zeilen „Vergleich gegen http://localhost:3100“). Erfüllt, wenn Differenz ≤ E0-Spanne oder ≤ 0.

| Ansicht | LCP ms E0 · AV1 · jetzt | LCP E0 heute (Spanne; Differenz; erfüllt) | INP ms E0 · AV1 · jetzt | INP E0 heute (Spanne; Differenz; erfüllt) | CLS E0 · AV1 · jetzt |
|---|---|---|---|---|---|
| H01 Start | 996 · 1112 · 656 | 960 (48; −304; ja) | 56 · 160 · 40 | 56 (24; −16; ja) | 0 · 0 · 0 |
| H02 Autoschlüssel | 960 · 1104 · 656 | 984 (64; −328; ja) | 56 · 168 · 24 | 64 (24; −40; ja) | 0 · 0 · 0 |
| H03 Modell Golf | 976 · 1080 · 588 | 964 (56; −376; ja) | 48 · 160 · 24 | 64 (16; −40; ja) | 0 · 0 · 0 |
| H04 Assistent | 904 · 968 · 540 | 892 (48; −352; ja) | 56 · 96 · 24 | 56 (16; −32; ja) | 0 · 0 · 0 |
| H05 Code-Shop | 1084 · 1056 · 628 | 1060 (64; −432; ja) | 56 · 128 · 16 | 64 (32; −48; ja) | 0 · 0 · 0 |
| H06 Code-Produkt | 964 · 1080 · 632 | 992 (72; −360; ja) | 64 · 160 · 24 | 64 (32; −40; ja) | 0 · 0 · 0 |
| H07 Zylinder-Konf. | 1012 · 1028 · 580 | 1000 (68; −420; ja) | 72 · 88 · 24 | 56 (16; −32; ja) | 0 · 0 · 0 |
| H08 Schließanlagen | 976 · 1168 · 688 | 988 (132; −300; ja) | 64 · 168 · 32 | 64 (16; −32; ja) | 0 · 0 · 0 |
| H09 Tür-/Schließtechnik | 1020 · 1108 · 632 | 1024 (52; −392; ja) | 48 · 144 · 24 | 64 (32; −40; ja) | 0 · 0 · 0 |
| H10 Warenkorb | **2508** · 984 · 500 | 2584 (116; −2084; ja) | 56 · 104 · 24 | 64 (0; −40; ja) | **0,117** · 0,007 · 0,007278 |
| H11 Kasse | 920 · 984 · 484 | 888 (40; −404; ja) | 64 · 112 · 16 | 64 (24; −48; ja) | **0,104** · 0,010 · 0,009766 |
| H12 Ratgeber | 936 · 1004 · 564 | 932 (116; −368; ja) | 56 · 128 · 32 | 72 (64; −40; ja) | 0 · 0 · 0 |

Budgets (am Median, LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms): jetzt keine Verstöße. Höchster Median LCP 688 ms (H08), CLS 0,009766 (H11), INP 40 ms (H01). Größter Einzelwert aus den Spannen: LCP 784 ms (H06, Lauf), INP 176 ms (H02, Lauf). Fett: Überschreitungen E0, Quelle `E0-PRUEFER-05-ausgangswerte.md` (Tabelle A). AV1-Werte aus `E6-PRUEFER-C-ergebnis.md`, Teil 4.

Erfüllt Z-08 mobil: 36 von 36 Werten (LCP 12/12, CLS 12/12, INP 12/12).

### 2c · Leistung Desktop (Median, 3 Läufe)

Jetzt: `E7-PRUEFER-02-messung-desktop.log`. E0 Desktop-INP und E0 Desktop-CLS stehen im E0-Messprotokoll (`E0-PRUEFER-05-messung.log`).

| Ansicht | LCP ms E0 · AV1 · jetzt | LCP E0 heute (Spanne; Differenz; erfüllt) | INP ms E0 · AV1 · jetzt | INP E0 heute (Spanne; Differenz; erfüllt) | CLS E0 · AV1 · jetzt |
|---|---|---|---|---|---|
| H01 Start | 164 · 172 · 208 | 160 (80; +48; ja) | 40 · 48 · 32 | 40 (16; −8; ja) | 0 · 0 · 0 |
| H02 Autoschlüssel | 172 · 172 · 160 | 160 (64; 0; ja) | 40 · 32 · 24 | 40 (8; −16; ja) | 0 · 0 · 0 |
| H03 Modell Golf | 188 · 180 · 176 | 140 (44; +36; ja) | 48 · 56 · 40 | 48 (8; −8; ja) | 0 · 0 · 0 |
| H04 Assistent | 144 · 128 · 172 | 152 (32; +20; ja) | 48 · 40 · 48 | 48 (8; 0; ja) | 0 · 0 · 0 |
| H05 Code-Shop | 144 · 148 · 180 | 152 (24; **+28; NEIN**) | 40 · 32 · 24 | 40 (8; −16; ja) | 0 · 0 · 0 |
| H06 Code-Produkt | 136 · 132 · 168 | 168 (52; 0; ja) | 40 · 48 · 32 | 40 (8; −8; ja) | 0 · 0 · 0 |
| H07 Zylinder-Konf. | 160 · 144 · 136 | 180 (72; −44; ja) | 56 · 48 · 48 | 56 (16; −8; ja) | 0 · 0 · 0 |
| H08 Schließanlagen | 140 · 164 · 156 | 172 (68; −16; ja) | 48 · 40 · 32 | 40 (8; −8; ja) | 0 · 0 · 0 |
| H09 Tür-/Schließtechnik | 156 · 164 · 152 | 144 (52; +8; ja) | 40 · 32 · 24 | 40 (0; −16; ja) | 0 · 0 · 0 |
| H10 Warenkorb | 116 · 120 · 120 | 120 (32; 0; ja) | 40 · 48 · 48 | 40 (8; +8; ja) | 0,038 · 0,003 · 0,003243 |
| H11 Kasse | 116 · 124 · 108 | 104 (32; +4; ja) | 40 · 40 · 40 | 48 (8; −8; ja) | 0,031 · 0,004 · 0,003982 |
| H12 Ratgeber | 116 · 144 · 116 | 128 (28; −12; ja) | 48 · 40 · 24 | 48 (8; −24; ja) | 0 · 0 · 0 |

Budgets Desktop: keine Verstöße am Median. Höchster Median LCP 208 ms (H01), CLS 0,003982 (H11), INP 48 ms (H04). Erfüllt Z-08 Desktop: 35 von 36 Werten (LCP 11/12, CLS 12/12, INP 12/12). Nicht erfüllt: **H05 Code-Shop LCP** (Median 180 ms, E0 heute 152 ms, Differenz +28 ms, E0-Spanne 24 ms). Handrechnung im Protokoll bestätigt (Einzelwerte jetzt 176, 232, 180 ms; E0 heute 152, 176, 152 ms).

---

## Tabelle 3 · Übrige Ansichten (ALLE_U, 11 Ansichten)

E0: keine Werte, weil der E0-Vergleich nur die 12 Hauptansichten umfasste (fehlt). AV1 aus `E6-PRUEFER-C-ergebnis.md`, Teil 2 Schritt 5 und Teil 3. Jetzt aus `E7-PRUEFER-C-konsole.log` (Einzelmeldungen zeigen nur die ersten 10 je Art), `E7-PRUEFER-C-bildsatz.log`, `E7-PRUEFER-C-a11y.log`, `E7-PRUEFER-C-bewegung-reduziert.log`.

| Ansicht | abgebrochene Anfragen AV1 · jetzt | Dokument-Überlauf (jetzt) | Elemente über rechten Rand m/t/d AV1 · jetzt | axe ernst/kritisch mobil · Desktop (jetzt) | Bewegung reduziert (jetzt) |
|---|---|---|---|---|---|
| gleichschliessende-zylinder | 1 · 0 | nein (alle 3) | 8/4/4 · 8/4/4 | 0/0 · 0/0 | 0 Befunde |
| service-und-termin | 3 · 2 | nein (alle 3) | 33/1/0 · 33/1/0 | 0/0 · 0/0 | 0 Befunde |
| artikel | 0 · 0 | nein (alle 3) | 0/0/0 · 0/0/0 | 0/0 · 0/0 | 0 Befunde |
| standorte-berlin | 2 · 2 | nein (alle 3) | 1/0/1 · 1/0/1 | 0/0 · 0/0 | 0 Befunde |
| sicherheitstechnik-sicherheitscheck | 0 · 0 | nein (alle 3) | 0/0/0 · 0/0/0 | 0/0 · 0/0 | 0 Befunde |
| rechtliches-agb | 0 · 0 | nein (alle 3) | 8/2/0 · 8/2/0 | 0/0 · 0/0 | 0 Befunde |
| artikel-beispiel-schluesselkasten | 0 · 0 | nein (alle 3) | 1/1/0 · 1/1/0 | 0/0 · 0/0 | 0 Befunde |
| autoschluessel-schluesselbart-fraesen | 0 · 1 | nein (alle 3) | 1/1/1 · 1/1/1 | 0/0 · 0/0 | 0 Befunde |
| elektronische-zutrittsloesungen | 2 · 2 | nein (alle 3) | 3/3/2 · 3/3/2 | 0/0 · 0/0 | 0 Befunde |
| rechtliches-impressum | 0 · 0 | nein (alle 3) | 8/2/0 · 8/2/0 | 0/0 · 0/0 | 0 Befunde |
| service-und-termin-vor-ort | 1 · 1 | nein (alle 3) | 1/1/1 · 1/1/1 | 0/0 · 0/0 | 0 Befunde |

Gekappt (Bildsatz `--max 6`, siehe Auffällig): gleichschliessende-zylinder (mobil 6 von 14, Tablet 6 von 10, Desktop 6 von 10), service-und-termin (6 von 12, 6 von 8, 6 von 9), autoschluessel-schluesselbart-fraesen (mobil 6 von 8), elektronische-zutrittsloesungen (6 von 14, 6 von 9, 6 von 8).

AV1-Zahlen der abgebrochenen Anfragen stehen in `E6-PRUEFER-C-ergebnis.md`, Teil 2 Schritt 5.

---

## Tabelle 4 · Bildrate mobil (große Momente, Schwelle 5 % verworfen am Median)

Jetzt: `E7-PRUEFER-02-bildrate.log` und `bildrate-*.json` (5 Läufe je Moment, 1800 ms bei Start, sonst 1600 ms, CPU 4-fach gedrosselt). AV1: `E6-PRUEFER-C-ergebnis.md`, Teil 4 (7 Momente; U-SERVICE war nicht gemessen).

| Moment | Seite | gemessenes Element (Größe; Treffer) | jetzt: Lauf 1 bis 5, verworfen % | jetzt Median | AV1 Median (Einzelwerte) |
|---|---|---|---|---|---|
| Start (H01) | `/` | svg.block 480 × 360 (1 von 1) | 1,6 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %, innerhalb** | 0,8 % (0,0 · 0,0 · 2,5 · 6,6 · 0,8; 1800 ms), innerhalb |
| Autoschlüssel (H02) | `/autoschluessel` | svg.block 246 × 138 (1 von 4) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %, innerhalb** | 8,0 % (6,4 · 17,1 · 8,0 · 4,5 · 14,5), **über 5 %** |
| Schlüssel nach Code (H05) | `/schluessel-nach-code` | svg.block 382 × 215 (1 von 1) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %, innerhalb** | 6,2 % (7,3 · 4,5 · 14,4 · 3,6 · 6,2), **über 5 %** |
| Schließanlagen (H08) | `/schliessanlagen` | svg.block 350 × 197 (1 von 2, 1 versteckt) | 0,0 · 0,0 · 1,8 · 0,0 · 2,8 | **0,0 %, innerhalb** | 9,9 % (9,9 · 8,0 · 19,1 · 8,1 · 22,7), **über 5 %** |
| Tür- und Schließtechnik (H09) | `/tuer-und-schliesstechnik` | svg.block 378 × 236 (1 von 1) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %, innerhalb** | 5,3 % (3,6 · 4,5 · 5,3 · 5,5 · 5,4), **über 5 %** (knapp) |
| Ratgeber verloren (H12) | `/ratgeber/autoschluessel-verloren-was-tun` | svg.block 350 × 263 (1 von 2, 1 versteckt) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 | **0,0 %, innerhalb** | 0,0 %; AV1-Selektor war 0 × 0 px, nur eingeschränkt aussagekräftig |
| Standort Berlin (U-STANDORTE) | `/standorte/berlin` | svg.block 350 × 263 (1 von 1) | 0,0 · 2,7 · 0,0 · 0,0 · 3,7 | **0,0 %, innerhalb** | 1,8 % (4,5 · 4,5 · 1,8 · 1,8 · 1,8), innerhalb |
| Service und Termin (U-SERVICE) | `/service-und-termin` | svg.block 318 × 382 (1 von 2, 1 versteckt) | 0,0 · 0,0 · 0,0 · 2,8 · 0,0 | **0,0 %, innerhalb** | fehlt (im AV1-Bildratenlauf nicht gemessen) |

Ergebnis jetzt: 8 von 8 Momenten mit Median 0,0 %, alle innerhalb 5 %. Höchster Einzelwert 3,7 % (U-STANDORTE, Lauf 5). AV1: 4 von 7 Momenten über 5 % am Median. Die Änderung gegenüber AV1 ist im Protokoll nicht erklärt (Build und Element sind verschieden). Das Werkzeug `bewegung.mjs bildrate` wertet `--geraet` nicht aus, der Lauf ist mobil.

---

## Tabelle 5 · Kriterien aus `_werkstatt/ABNAHME.md` (nur Messergebnisse, das Urteil fällt der Endprüfer)

| Kriterium | Prüfung | Ergebnis | Beleg |
|---|---|---|---|
| **Z-02** Bestand | Build, Typ, Lint, Tests mindestens so grün wie E0; Funktionsliste vollständig; 0 neue Konsolenfehler | Build 208/208 (E0 198/198); Typ 0; Lint 0/0; Unit 73/73 Dateien, 1217/1217 Tests (E0 680/680); DB 52/52; Funktionsliste 14/14; Konsolenfehler 0, Warnungen 0, Seitenfehler 0. Vorbehalt: Build-EXIT-Zeile fehlt. „Keine Funktion schlechter als E0“ nicht bewertbar (E0-Funktionsliste fehlt). | `E7-PRUEFER-C-build.log`, `-typecheck.log`, `-lint.log`, `-test-unit.log`, `-test-db.log`, `-funktionsliste.log`, `-konsole.log` |
| **Z-05** Bewegung | Register K-007 und Prüfstufe C; reduziert ohne Lage- oder Größenänderung; große Momente mobil ≤ 5 % verworfen | Bildrate: 8 von 8 Momenten Median 0,0 %. Bewegung reduziert: 0 Befunde, 0 laufende Animationen, 0 verborgene Inhalte in 23 Ansichten. Animationen: 0 unbekannte Keyframes in 3 fertigen Läufen. **Register: fehlt** (E7-PRUEFER-C-register.md nicht geschrieben). | `E7-PRUEFER-02-bildrate.log`, `E7-PRUEFER-C-bewegung-reduziert.log`, `E7-PRUEFER-C-animationen.log` |
| **Z-06** Grafik | eine Icon-Familie (lucide entfernt); alle SVG optimiert und zugänglich; keine doppelten Kennungen je Ansicht | **fehlt**: SVG-Prüfung nicht gelaufen (`E7-PRUEFER-C-svg.log` fehlt). Der lucide-Grep ist in keinem E7-Protokoll belegt. | – |
| **Z-07** Zugänglichkeit | 0 ernste oder kritische Befunde auf Hauptansichten; Hauptaufgaben nur mit Tastatur bei sichtbarem Fokus | axe ernst 0, kritisch 0 in allen 12 Hauptansichten, mobil und Desktop; ebenso in den 11 übrigen Ansichten (moderate und minor 0). Tastatur 7/7 je Gerät, ohne sichtbaren Fokus: keine. E0 hatte 26 ernst und 4 kritisch. | `E7-PRUEFER-C-a11y.log`, `-tastatur-mobil.log`, `-tastatur-desktop.log` |
| **Z-08** Leistung | Budgets auf allen Hauptansichten; keine Ansicht schlechter als E0 um mehr als die E0-Spanne | Budgets am Median: keine Verstöße (mobil und Desktop). Vergleich E0 heute: mobil **36/36 erfüllt**; Desktop **35/36**, Überschreitung H05 Code-Shop LCP (+28 ms, E0-Spanne 24 ms). Abweichung: ABNAHME nennt 3 Läufe je Profil, gemessen mobil 5 Läufe, Desktop 3. | `E7-PRUEFER-02-messung-mobil.log`, `E7-PRUEFER-02-messung-desktop.log`, `E7-PRUEFER-02-ergebnis.md` |
| **Z-09** Darstellung | Bildsatz: kein Überlauf, kein abgeschnittener oder überlappender Text | Dokumentüberlauf: nein in 69 von 69 Läufen (23 Ansichten × 3 Geräte). Elemente über den rechten Rand (Werkzeug): mobil H01 73, H02 84, H08 60, H09 16, H05 7, H06 6, H03 4, H07 1, H12 1; ALLE_U u. a. service-und-termin 33, rechtliches-agb 8, rechtliches-impressum 8, gleichschliessende-zylinder 8. Sichtung (Teil 2) nennt abgeschnittene Kacheln/Chips und Überdeckungen durch fixierte Leisten. Urteil: Endprüfer. Teilweise gekappte Bildsätze (siehe Tabelle 3). | `E7-PRUEFER-C-bildsatz.log` |

---

## Budget-Verstöße

- Jetzt: **keine** am Median (mobil 12 Ansichten, Desktop 12 Ansichten, LCP/CLS/INP). Auch kein Einzelwert über Budget (größter LCP 784 ms, größter INP 176 ms, aus den Spannen in `E7-PRUEFER-02-messung-mobil.log`).
- E0 (Ausgangswerte, Vergleich): H10 mobil LCP 2508 ms (Budget 2500) und CLS 0,117; H11 mobil CLS 0,104. Beide jetzt eingehalten.
- AV1: keine am Median. Grenzfall INP 200 ms H08 mobil (Lauf 2).

## axe serious oder critical

- Jetzt: **keine**. Alle 23 Ansichten, mobil und Desktop, 0 ernst, 0 kritisch, 0 moderate, 0 minor (`E7-PRUEFER-C-a11y.log`, zwei Läufe).
- Zum Vergleich E0: target-size (ernst, 24 Auswertungen); button-name (kritisch) H04 mobil und H07 mobil; label (kritisch) H06 mobil und Desktop; scrollable-region-focusable (ernst) H08 mobil; color-contrast (ernst) H09 Desktop.

## Nicht bestandene Funktionen (auch Tastatur)

- **Keine.** Funktionsliste 14/14, Tastatur mobil 7/7, Tastatur Desktop 7/7 (`E7-PRUEFER-C-funktionsliste.log`, `-tastatur-mobil.log`, `-tastatur-desktop.log`). Eine Wiederholung mit `--nur` war nicht nötig.
- Zum Vergleich AV1: Erstlauf Tastatur F-01 mobil und Desktop nicht bestanden (Menge 2 zeigte 12, Summe 78,72 €), Nachlauf bestanden. Jetzt bestanden (Menge 2, Zwischensumme 16,00 €, Summe 20,95 €).

## Registerbefunde

- **E7: nicht bewertbar.** `E7-PRUEFER-C-register.md` fehlt. Die Animationsprotokolle nennen 0 unbekannte Keyframes in 3 fertigen Läufen (`E7-PRUEFER-C-animationen.log`, Befunde „0“). Der Lauf `mobil-uebrige` war bei Protokollschluss noch nicht fertig.
- **Aus E6 offen übernommen** (`E6-PRUEFER-C-register-nachtrag.md`, nicht durch E7-Protokolle belegt):
  - Befund 12: Übergänge nicht erfasst (menue-ein, schublade-ein, sm24-schritt-*, Hover und Fokus, B-13).
  - N-1: zutritt-signal Dauer bis ca. 2,45 s (B-27 nennt 1,6 s).
  - N-2: schluessel Funk-Bögen 1,0 bis 1,2 s (B-21 nennt 1,6 s).
  - N-3: site-header Megamenü per onMouseEnter, B-08 nennt nur Klick und Tastatur.
  - N-4: flow-shell.tsx:90 ohne Dauer-Token.
  - N-5: mobile-action-bar.tsx:58 nicht in B-28.
- Stichprobe Bedienung (`E7-PRUEFER-C-animationen.log`): Bedienschritte „Akkordeon öffnen/schließen“ und „Weiter“ stehen in mehreren Ansichten auf nein/nein (z. B. H04, H10, H11, rechtliches-impressum, service-und-termin-vor-ort). Das Werkzeug meldet sie so; die Ursache ist nicht geprüft.

## SVG-Befunde

- **fehlt.** Die SVG-Prüfung (`svg-pruefung.mjs`) ist nicht gelaufen. Die Wartekette `lauf-svg.sh` wartet auf den Animationslauf. `E7-PRUEFER-C-svg.log` existiert nicht.

## Z-08-Überschreitungen

- **Mobil: keine** (36/36 erfüllt).
- **Desktop: eine**, H05 Code-Shop LCP: Median 180 ms, E0 heute 152 ms, Differenz +28 ms, E0-Spanne 24 ms (`E7-PRUEFER-02-messung-desktop.log`; Handrechnung bestätigt in `E7-PRUEFER-02-ergebnis.md`).

## Abweichungen im Bestand

- Build-Protokoll ohne EXIT-Zeile (Erfolgsmerkmale vorhanden).
- Wertesuche: 22 Ausnahmen (AV1 20). Summe ohne Ausnahmen 0.
- Commit im Auftrag f6e55ab, Repo HEAD 0692db6 (Vorfahr, kein Code-Unterschied).
- E0-Protokolle für Funktionsliste, Logikwächter und Textabzug nicht gefunden (fehlt).

---

## Auffällig (eigener Eintrag je Befund)

1. Z-08 Desktop, H05 Code-Shop LCP nicht erfüllt: Median 180 ms, E0 heute 152 ms, +28 ms gegen E0-Spanne 24 ms. Beleg `E7-PRUEFER-02-messung-desktop.log`.
2. Build-Protokoll `E7-PRUEFER-C-build.log` ohne EXIT-Zeile. Exit-Code nicht belegt; „Compiled successfully in 57s“ und 208/208 sind vorhanden.
3. curl-Probe 1 hat ihr HTML nach `/tmp/sm24-e7c-root.html` geschrieben, außerhalb der Schreibrechte. Datei nicht gelöscht.
4. Ladeweg-Werkzeug ohne `--json` hat zwei JSON-Dateien ohne Präfix in den Protokollordner gelegt: `ladeweg-2026-10-18_14-24-35.json` und `ladeweg-2026-10-18_14-25-15.json` (Ortszeit). Nicht verschoben.
5. Sperrzeiten der Teile 2 und 3 widersprechen sich. Teil 2 meldet, die Sperre sei nach Schritt 8 entfernt worden (Ende 12:39:20 UTC). Teil 3 meldet, sie sei bis etwa 12:42 UTC vorhanden gewesen. Funktionsliste wartete auf die Sperre (`E7-PRUEFER-C-funktionsliste.log`). Die Sperrdatei existiert jetzt nicht mehr.
6. Parallelität: Animationslauf Teil 5 startete 12:41 UTC. Tastatur-Läufe (Teil 3) liefen 12:42 bis 12:44 UTC. Laut Teil-5-Bericht lief zusätzlich funktionsliste.mjs (PID 4783) parallel, was die Animationsmessung stören kann.
7. Teil 5 unvollständig: SVG-Protokoll fehlt, Registerdatei nicht geschrieben, `mobil-uebrige` lief bei Protokollschluss.
8. Animationen, Bedienung: „Akkordeon öffnen/schließen“ und „Weiter“ mit nein/nein in mehreren Ansichten (siehe Registerbefunde).
9. Konsole, abgebrochene Anfragen (`net::ERR_ABORTED`, RSC-Vorabruf), Hauptansichten: H01 1, H02 1, H03 2, H09 1, H12 2. Ursache nicht untersucht.
10. Konsole, abgebrochene Anfragen, ALLE_U: service-und-termin 2, standorte-berlin 2, autoschluessel-schluesselbart-fraesen 1, elektronische-zutrittsloesungen 2, service-und-termin-vor-ort 1.
11. Elemente über den rechten Rand (Z-09), mobil: H01 73, H02 84, H08 60, H09 16, H05 7, H06 6, H03 4, H07 1, H12 1; ALLE_U service-und-termin 33, rechtliches-agb 8, rechtliches-impressum 8, gleichschliessende-zylinder 8. Dokumentüberlauf nein. Beleg `E7-PRUEFER-C-bildsatz.log`.
12. Sichtung Teil 2 (nicht von mir angesehen): H02 mobil, Kartenreihe 01/02 am rechten Rand angeschnitten.
13. Sichtung Teil 2: rechtliches-agb und rechtliches-impressum mobil, Chipreihe am rechten Rand angeschnitten.
14. Sichtung Teil 2: H04 mobil und sicherheitstechnik-sicherheitscheck mobil, fixierte Fußleiste überdeckt die untere Kartenreihe bzw. den Inhalt.
15. Sichtung Teil 2: fixierte untere Navigation überdeckt den unteren Bildrand in H01, H05, H07 und artikel-beispiel-schluesselkasten (mobil).
16. Bildsatz gekappt (`--max 6`) in gleichschliessende-zylinder, service-und-termin, autoschluessel-schluesselbart-fraesen, elektronische-zutrittsloesungen. Nicht nachgeholt.
17. Wertesuche: 22 Ausnahmen in 13 Dateien (AV1 20). Summe ohne Ausnahmen 0.
18. Bildrate mobil: AV1 4 von 7 Momenten über 5 % am Median; jetzt 0 von 8. Ursache der Änderung im Protokoll nicht erklärt. Beleg `E7-PRUEFER-02-bildrate.log`.
19. Z-08 mobil: E0-Ausgangswert H01 LCP 996 ms, E0 heute 960 ms, Anlauf 1 992 ms. Die E0-Spanne gilt je Lauf.
20. ABNAHME Z-08 nennt 3 Läufe je Profil. Gemessen: mobil 5 Läufe, Desktop 3 Läufe (Paket).
21. Ladeweg: Bytes vor FCP 0,0 KB in allen drei Routen; mit E0 (59,9 / 72,5 / 58,7 KB) nicht vergleichbar.
22. `bewegung.mjs bildrate` wertet `--geraet` nicht aus.
23. Z-06: SVG-Prüfung und lucide-Grep ohne Protokoll. Kriterium nicht bewertbar.
24. Befund 12 aus E6 (Übergänge nicht erfasst) und N-1 bis N-5 aus E6 weiterhin offen (Register nicht in E7 belegt).
25. Gefüllt (Warenkorb/Kasse): mobil 5/7, Tablet 3/5, Desktop 3/4. Einheit im Protokoll nicht ausgewiesen (`E7-PRUEFER-C-gefuellt.log`).

---

## Bildbelege

- Hauptansichten: `/root/sm24-bilder/e7-c/<Ansicht>__desktop__00.jpg` und `__mobil__00.jpg`; übrige in `/root/sm24-bilder/e7-c/uebrige/`.
- Einzelbilder: `/root/sm24-bilder/e7-c/einzelbilder/<H01|H02|H05|H08|H09|H12|U-STANDORTE|U-SERVICE>/`.
- Gefüllt: `/root/sm24-bilder/e7-c/gefuellt/`.
- Schritte Funktionsliste: `/root/sm24-bilder/e7-c/schritte/`.
- Messung und Bildrate (JSON): `/root/sm24-bilder/e7-p2/`.
- Animationen (JSON): `/root/sm24-bilder/e7-c/animationen-desktop.json`, `-desktop-uebrige.json`, `-mobil.json`.

=== ENDE E7-PRUEFER-C · TEIL 6 · TEIL 5 OFFEN ===
