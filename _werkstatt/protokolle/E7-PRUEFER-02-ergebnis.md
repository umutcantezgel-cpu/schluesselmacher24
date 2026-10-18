# E7-PRUEFER-02 · Ergebnis Messung Anlauf 2 (Z-08 mobil und Desktop gegen E0, Z-05 Bildrate, Ladeweg)

## Kopf
- Build-ID Port 3000: `_yaN_J-sWFLTSeQqU6QII` (`.next/BUILD_ID`, gelesen 12:02:07 UTC). Port 3000 und Port 3100 antworteten vor dem Lauf mit HTTP 200.
- Commit: `git log --oneline -1` ergab `0692db6 wip(werkstatt): ZWISCHENSTAND Protokolle Prüfstufe C Abschlussversuch 2 (laufend) [E7-P-C]`. Das Paket nennt f6e55ab. f6e55ab ist Vorfahr von HEAD. Zwischen beiden liegen nur e6deed5, 9fd0a68 und 0692db6 (Werkstatt- und Dokumentationscommits). `git diff --stat f6e55ab HEAD -- src public content next.config.ts package.json` ist leer, der gemessene Code entspricht damit f6e55ab.
- Zeitpunkte (UTC): Sperre gesetzt 12:02:30 (`/tmp/sm24-messfenster.lock` mit Inhalt `E7-PRUEFER-02`). Mobil-Messung 12:02:30 bis 12:15:19 (JSON-Zeit 12:15:19,273). Desktop 12:15:19 bis 12:21:42 (JSON-Zeit 12:21:42,199). Bildrate 12:21:42 bis 12:24:02. Ladeweg Port 3000 ab 12:24:35, Port 3100 ab 12:25:15 (Kopfzeilen der Protokolle).
- Sperre gelöscht am Ende des Laufskripts um 12:25:15 (Schlussbefehl und Abfangen bei Beendigung). Danach geprüft: `/tmp/sm24-messfenster.lock` existiert nicht.
- Läufe: Mobil 5 Läufe je Serie (12 Ansichten × 2 Server), Desktop 3 Läufe je Serie. Alle Serien mit Lauf-Zahl vollständig, `fehler` leer in allen Serien beider Server (JSON). Keine Wiederholung, kein Abbruch, kein Serverneustart, kein Build.
- Skript des Laufs (nur Ablauf der Schritte 1 bis 5): `/tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/teil4-lauf.sh`. Ausgabe des Laufskripts mit EXIT-Zeilen: scratchpad/teil4-lauf.out (messung-mobil 0, messung-desktop 0, bildrate alle 8 mit 0, ladeweg 0 und 0).

## Z-08 · Kriterium und Erfüllt-Regel
- Kriterium (`_werkstatt/ABNAHME.md`, Z-08): Budgets je Hauptansicht (LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms) und keine Ansicht schlechter als E0 um mehr als die E0-Spanne.
- Erfüllt-Regel (wie im Werkzeug): ja, wenn Differenz (Median jetzt − Median E0) ≤ E0-Spanne oder ≤ 0. E0-Spanne = max − min der fünf (mobil) bzw. drei (Desktop) E0-Läufe.
- Hinweis: ABNAHME.md nennt „Median aus 3 Läufen je Profil“. Das Paket verlangt für mobil 5 Läufe; gemessen wurde nach Paket (mobil 5, Desktop 3).

## Z-08 mobil: Tabelle je Ansicht und Wert
Quelle: `/root/sm24-bilder/e7-p2/messung-mobil.json`, Protokoll `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-02-messung-mobil.log`. Medianwerte, Spanne, Differenz und Erfüllt-Spalte aus den Einzelläufen des JSON nachgerechnet (Skript); alle 36 Zeilen je Profil stimmen mit der Werkzeugtabelle überein. CLS mit sechs Nachkommastellen. Spalte „Median Anlauf 1“ nur aus `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-01-ergebnis.md` übernommen.

| Ansicht | Wert | Median jetzt | Median E0 | E0-Spanne (max − min) | Differenz (jetzt − E0) | erfüllt | Median Anlauf 1 (aus E7-PRUEFER-01) |
|---|---|---|---|---|---|---|---|
| H01-start | LCP | 656 ms | 960 ms | 48 ms | −304 ms | ja | 1168 ms |
| H01-start | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H01-start | INP | 40 ms | 56 ms | 24 ms | −16 ms | ja | 48 ms |
| H02-autoschluessel | LCP | 656 ms | 984 ms | 64 ms | −328 ms | ja | 1136 ms |
| H02-autoschluessel | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H02-autoschluessel | INP | 24 ms | 64 ms | 24 ms | −40 ms | ja | 24 ms |
| H03-modell-golf | LCP | 588 ms | 964 ms | 56 ms | −376 ms | ja | 1056 ms |
| H03-modell-golf | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H03-modell-golf | INP | 24 ms | 64 ms | 16 ms | −40 ms | ja | 24 ms |
| H04-assistent | LCP | 540 ms | 892 ms | 48 ms | −352 ms | ja | 996 ms |
| H04-assistent | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000124 |
| H04-assistent | INP | 24 ms | 56 ms | 16 ms | −32 ms | ja | 16 ms |
| H05-code-shop | LCP | 628 ms | 1060 ms | 64 ms | −432 ms | ja | 1124 ms |
| H05-code-shop | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H05-code-shop | INP | 16 ms | 64 ms | 32 ms | −48 ms | ja | 24 ms |
| H06-code-produkt | LCP | 632 ms | 992 ms | 72 ms | −360 ms | ja | 1128 ms |
| H06-code-produkt | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H06-code-produkt | INP | 24 ms | 64 ms | 32 ms | −40 ms | ja | 32 ms |
| H07-zylinder-konfigurator | LCP | 580 ms | 1000 ms | 68 ms | −420 ms | ja | 1104 ms |
| H07-zylinder-konfigurator | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H07-zylinder-konfigurator | INP | 24 ms | 56 ms | 16 ms | −32 ms | ja | 24 ms |
| H08-schliessanlagen | LCP | 688 ms | 988 ms | 132 ms | −300 ms | ja | 1180 ms |
| H08-schliessanlagen | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H08-schliessanlagen | INP | 32 ms | 64 ms | 16 ms | −32 ms | ja | 32 ms |
| H09-tuertechnik | LCP | 632 ms | 1024 ms | 52 ms | −392 ms | ja | 1120 ms |
| H09-tuertechnik | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H09-tuertechnik | INP | 24 ms | 64 ms | 32 ms | −40 ms | ja | 24 ms |
| H10-warenkorb | LCP | 500 ms | 2584 ms | 116 ms | −2084 ms | ja | 1004 ms |
| H10-warenkorb | CLS | 0,007278 | 0,117386 | 0,000000 | −0,110108 | ja | 0,007278 |
| H10-warenkorb | INP | 24 ms | 64 ms | 0 ms | −40 ms | ja | 32 ms |
| H11-kasse | LCP | 484 ms | 888 ms | 40 ms | −404 ms | ja | 992 ms |
| H11-kasse | CLS | 0,009766 | 0,103801 | 0,000000 | −0,094035 | ja | 0,009766 |
| H11-kasse | INP | 16 ms | 64 ms | 24 ms | −48 ms | ja | 24 ms |
| H12-ratgeber | LCP | 564 ms | 932 ms | 116 ms | −368 ms | ja | 1024 ms |
| H12-ratgeber | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H12-ratgeber | INP | 32 ms | 72 ms | 64 ms | −40 ms | ja | 24 ms |
| **Summe** | LCP 12 von 12 · CLS 12 von 12 · INP 12 von 12 | | | | | **36 von 36** erfüllt | Ansichten mit allen drei Werten erfüllt: 12 von 12 |

**Budgets mobil (Median je Ansicht und Wert, LCP ≤ 2500 ms, CLS ≤ 0,1, INP ≤ 200 ms):** Höchster Median: LCP 688 ms (H08-schliessanlagen), CLS 0,009766 (H11-kasse), INP 40 ms (H01-start). Budgetverstöße: keine.

## Z-08 desktop: Tabelle je Ansicht und Wert (zur Einordnung, gleiche Regel)
Quelle: `/root/sm24-bilder/e7-p2/messung-desktop.json`, Protokoll `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-02-messung-desktop.log`.

| Ansicht | Wert | Median jetzt | Median E0 | E0-Spanne (max − min) | Differenz (jetzt − E0) | erfüllt | Median Anlauf 1 (aus E7-PRUEFER-01) |
|---|---|---|---|---|---|---|---|
| H01-start | LCP | 208 ms | 160 ms | 80 ms | +48 ms | ja | 176 ms |
| H01-start | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H01-start | INP | 32 ms | 40 ms | 16 ms | −8 ms | ja | 32 ms |
| H02-autoschluessel | LCP | 160 ms | 160 ms | 64 ms | 0 ms | ja | 172 ms |
| H02-autoschluessel | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H02-autoschluessel | INP | 24 ms | 40 ms | 8 ms | −16 ms | ja | 24 ms |
| H03-modell-golf | LCP | 176 ms | 140 ms | 44 ms | +36 ms | ja | 148 ms |
| H03-modell-golf | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H03-modell-golf | INP | 40 ms | 48 ms | 8 ms | −8 ms | ja | 40 ms |
| H04-assistent | LCP | 172 ms | 152 ms | 32 ms | +20 ms | ja | 160 ms |
| H04-assistent | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,001493 |
| H04-assistent | INP | 48 ms | 48 ms | 8 ms | 0 ms | ja | 48 ms |
| H05-code-shop | LCP | 180 ms | 152 ms | 24 ms | +28 ms | **nein** | 212 ms |
| H05-code-shop | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H05-code-shop | INP | 24 ms | 40 ms | 8 ms | −16 ms | ja | 24 ms |
| H06-code-produkt | LCP | 168 ms | 168 ms | 52 ms | 0 ms | ja | 168 ms |
| H06-code-produkt | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H06-code-produkt | INP | 32 ms | 40 ms | 8 ms | −8 ms | ja | 48 ms |
| H07-zylinder-konfigurator | LCP | 136 ms | 180 ms | 72 ms | −44 ms | ja | 176 ms |
| H07-zylinder-konfigurator | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000033 |
| H07-zylinder-konfigurator | INP | 48 ms | 56 ms | 16 ms | −8 ms | ja | 48 ms |
| H08-schliessanlagen | LCP | 156 ms | 172 ms | 68 ms | −16 ms | ja | 152 ms |
| H08-schliessanlagen | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H08-schliessanlagen | INP | 32 ms | 40 ms | 8 ms | −8 ms | ja | 32 ms |
| H09-tuertechnik | LCP | 152 ms | 144 ms | 52 ms | +8 ms | ja | 176 ms |
| H09-tuertechnik | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000000 |
| H09-tuertechnik | INP | 24 ms | 40 ms | 0 ms | −16 ms | ja | 24 ms |
| H10-warenkorb | LCP | 120 ms | 120 ms | 32 ms | 0 ms | ja | 144 ms |
| H10-warenkorb | CLS | 0,003243 | 0,037889 | 0,000000 | −0,034646 | ja | 0,003243 |
| H10-warenkorb | INP | 48 ms | 40 ms | 8 ms | +8 ms | ja | 24 ms |
| H11-kasse | LCP | 108 ms | 104 ms | 32 ms | +4 ms | ja | 116 ms |
| H11-kasse | CLS | 0,003982 | 0,030799 | 0,000000 | −0,026816 | ja | 0,003982 |
| H11-kasse | INP | 40 ms | 48 ms | 8 ms | −8 ms | ja | 40 ms |
| H12-ratgeber | LCP | 116 ms | 128 ms | 28 ms | −12 ms | ja | 128 ms |
| H12-ratgeber | CLS | 0,000000 | 0,000000 | 0,000000 | 0 | ja | 0,000014 |
| H12-ratgeber | INP | 24 ms | 48 ms | 8 ms | −24 ms | ja | 40 ms |
| **Summe** | LCP 11 von 12 · CLS 12 von 12 · INP 12 von 12 | | | | | **35 von 36** erfüllt | Ansichten mit allen drei Werten erfüllt: 11 von 12 |

**Budgets desktop:** Höchster Median: LCP 208 ms (H01-start), CLS 0,003982 (H11-kasse), INP 48 ms (H04-assistent). Budgetverstöße: keine.

## Handrechnung (zwei Werte aus den Einzelläufen im JSON)
1. **H01-start mobil, LCP.** Jetzt: 656, 728, 632, 636, 680 ms. Sortiert 632, 636, 656, 680, 728; Median = 656 ms (dritter Wert). E0: 968, 940, 988, 960, 952 ms. Sortiert 940, 952, 960, 968, 988; Median = 960 ms. E0-Spanne = 988 − 940 = 48 ms. Differenz = 656 − 960 = −304 ms. Differenz ≤ 0, also erfüllt: ja. Werkzeug: 656 / 960 / 48 / −304 / ja. Übereinstimmung.
2. **H05-code-shop desktop, LCP (einzige Nicht-Erfüllung Desktop).** Jetzt: 176, 232, 180 ms. Median = 180 ms. E0: 152, 176, 152 ms. Median = 152 ms. E0-Spanne = 176 − 152 = 24 ms. Differenz = 180 − 152 = +28 ms. 28 > 24, also erfüllt: **nein**. Werkzeug: 180 / 152 / 24 / +28 / nein. Übereinstimmung.

## Z-08 · Summen und Zählung
- Mobil: 36 von 36 Werten erfüllt (LCP 12 von 12, CLS 12 von 12, INP 12 von 12). Alle drei Werte in allen 12 Ansichten erfüllt.
- Desktop: 35 von 36 Werten erfüllt (LCP 11 von 12, CLS 12 von 12, INP 12 von 12). Nicht erfüllt: H05-code-shop LCP (Differenz +28 ms, E0-Spanne 24 ms).
- Ergebnis Z-08 nach Kriterium: mobil erfüllt (alle Budgets und alle Vergleiche). Desktop eine Ausnahme (H05 LCP). Die Bewertung zu Z-08 als Ganzes fällt der Endprüfer.

## Budgets (Zusammenfassung)
- Mobil: keine Verstöße (LCP, CLS, INP am Median in allen 12 Ansichten).
- Desktop: keine Verstöße am Median.

## Bildrate mobil (Z-05): je Moment 5 Läufe am gerenderten Element
Werkzeug `bewegung.mjs bildrate` (mobil 390 × 844, Prozessor 4-fach gedrosselt, Schwelle 5 %). Dauer je Lauf: 1800 ms für Start, sonst 1600 ms. Protokoll `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-02-bildrate.log`, JSON je Moment unter `/root/sm24-bilder/e7-p2/`. Verworfen-Anteil je Lauf, Median aus 5 Läufen.

| Moment | Seite | Gemessenes Element (Größe) | Einzelwerte Lauf 1 bis 5 (verworfen von gezeichnet + verworfen) | Median | ≤ 5 % | Beleg |
|---|---|---|---|---|---|---|
| Start | `/` | svg.block 480 × 360 px (Treffer 1 von 1, versteckt 0) | 1,6 % (2 von 122) · 0,0 % (0 von 121) · 0,0 % (0 von 121) · 0,0 % (0 von 121) · 0,0 % (0 von 122) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-H01.json` |
| Autoschlüssel | `/autoschluessel` | svg.block 246 × 138 px (Treffer 1 von 4, versteckt 0) | 0,0 % (0 von 109) · 0,0 % (0 von 110) · 0,0 % (0 von 110) · 0,0 % (0 von 109) · 0,0 % (0 von 109) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-H02.json` |
| Schlüssel nach Code | `/schluessel-nach-code` | svg.block 382 × 215 px (Treffer 1 von 1, versteckt 0) | 0,0 % (0 von 109) · 0,0 % (0 von 109) · 0,0 % (0 von 109) · 0,0 % (0 von 109) · 0,0 % (0 von 109) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-H05.json` |
| Schließanlagen | `/schliessanlagen` | svg.block 350 × 197 px (Treffer 1 von 2, versteckt 1) | 0,0 % (0 von 109) · 0,0 % (0 von 110) · 1,8 % (2 von 110) · 0,0 % (0 von 109) · 2,8 % (3 von 109) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-H08.json` |
| Tür und Schließtechnik | `/tuer-und-schliesstechnik` | svg.block 378 × 236 px (Treffer 1 von 1, versteckt 0) | 0,0 % (0 von 109) · 0,0 % (0 von 109) · 0,0 % (0 von 109) · 0,0 % (0 von 109) · 0,0 % (0 von 109) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-H09.json` |
| Ratgeber verloren | `/ratgeber/autoschluessel-verloren-was-tun` | svg.block 350 × 263 px (Treffer 1 von 2, versteckt 1) | 0,0 % (0 von 110) · 0,0 % (0 von 109) · 0,0 % (0 von 109) · 0,0 % (0 von 110) · 0,0 % (0 von 110) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-H12.json` |
| Standort Berlin | `/standorte/berlin` | svg.block 350 × 263 px (Treffer 1 von 1, versteckt 0) | 0,0 % (0 von 109) · 2,7 % (3 von 110) · 0,0 % (0 von 109) · 0,0 % (0 von 109) · 3,7 % (4 von 109) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-U-STANDORTE.json` |
| Service und Termin | `/service-und-termin` | svg.block 318 × 382 px (Treffer 1 von 2, versteckt 1) | 0,0 % (0 von 109) · 0,0 % (0 von 110) · 0,0 % (0 von 109) · 2,8 % (3 von 109) · 0,0 % (0 von 109) | 0,0 % | ja | `E7-PRUEFER-02-bildrate.log`, `/root/sm24-bilder/e7-p2/bildrate-U-SERVICE.json` |

Ergebnis: Alle 8 Momente haben Median 0,0 % und liegen unter 5 %. Höchster Einzelwert: 3,7 % (U-STANDORTE, Lauf 5; alle Einzelwerte in der Tabelle). Der Einzelwert ist nur zur Kenntnis aufgeführt, Schwelle gilt am Median.

Hinweis: Das Werkzeug `bildrate` wertet `--geraet` nicht aus (der Lauf ist mobil by design); die Option wurde wie im Paket angegeben übergeben.

## Ladeweg: jetzt gegen E0 (mobil, Netz langsames 4G, 3 Läufe je Route)
Protokolle: `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-02-ladeweg.log` (Port 3000, dann Port 3100). Werte je Route: Median der Läufe, FCP = LCP-Zeit (in beiden Servern gleich, wie im Protokoll).

| Route | FCP jetzt (ms) | FCP E0 (ms) | LCP jetzt (ms) | LCP E0 (ms) | LCP-Element jetzt (mittlerer Lauf) | LCP-Element E0 (mittlerer Lauf) | Bytes vor FCP jetzt (KB) | Bytes vor FCP E0 (KB) | Long Tasks vor FCP jetzt | Long Tasks vor FCP E0 |
|---|---|---|---|---|---|---|---|---|---|---|
| H01-start `/` | 656 | 944 | 656 | 944 | h1 „Autoschlüssel nachmachen und programmieren“ | h1, gleicher Text | 0,0 | 59,9 | 1 · 273 ms | 2 · 178 ms |
| H08-schliessanlagen `/schliessanlagen` | 676 | 1008 | 676 | 1008 | h1 „Mechanische Schließanlagen“ | p „Der Weg dorthin ist immer derselbe …“ | 0,0 | 72,5 | 1 · 300 ms | 2 · 225 ms |
| H03-modell-golf `/autoschluessel/marken/volkswagen/golf` | 612 | 932 | 612 | 932 | h1 „Autoschlüssel für Volkswagen Golf“ | p „Diese Angaben stammen aus unserem Fahrzeugdatensat …“ | 0,0 | 58,7 | 1 · 216 ms | 1 · 120 ms |

Hinweise zum Ladeweg:
- Bytes vor FCP jetzt 0,0 KB: keine Anfrage war vor FCP abgeschlossen. Die Tabelle „Bytes vor FCP je Typ“ im Protokoll ist für den Lauf jetzt leer. Im Wasserfall des mittleren Laufs endet das Dokument H01 bei 898 ms, FCP liegt bei 656 ms (Protokoll Port 3000).
- Schriften bei FCP (jetzt, mittlerer Lauf): IBM Plex Sans, Inter und IBM Plex Mono je „nein“ (nicht alle Schnitte geladen); SM24-Ersatzschriften „ja“. E0: IBM Plex Sans und Inter „nein“, IBM Plex Mono „ungenutzt“.
- Long Tasks vor FCP: Summe in ms, Anzahl gemäß Protokoll.
- Die Messung beschreibt nur Zeiten und Mengen, eine Bewertung erfolgt nicht.

## Funktionsliste, Tastatur, Konsole
Nicht in Teil 4 gelaufen (Paket: „nicht selbst laufen lassen“). Die Ergebnisse stehen in Teil 2 und 3 von E7-PRUEFER-C:
- Funktionsliste und Tastatur: Teil 3 von E7-PRUEFER-C (Protokolle `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-C-funktionsliste.log`, `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-C-tastatur-mobil.log`, `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-C-tastatur-desktop.log`).
- Konsole: Teil 2 von E7-PRUEFER-C (`/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-C-konsole.log`).

## Auffälligkeiten
1. **Desktop H05-code-shop LCP nicht erfüllt**: Differenz +28 ms, E0-Spanne 24 ms (Median jetzt 180 ms, E0 152 ms). Einzelwerte jetzt 176, 232, 180 ms; E0 152, 176, 152 ms. Protokoll: `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-02-messung-desktop.log`.
2. **Ladeweg-Protokolle außerhalb der Schreibrechte**: Die Werkzeuge haben ohne `--json` ihre JSON-Datei unter `/home/user/schluesselmacher24/_werkstatt/protokolle/` mit Zeitstempel ohne Präfix geschrieben: `ladeweg-2026-10-18_14-24-35.json` (Port 3000) und `ladeweg-2026-10-18_14-25-15.json` (Port 3100). Die Zeitstempel im Dateinamen sind Ortszeit (14:xx), nicht UTC. Nicht gelöscht und nicht verschoben, da das Paket nur die Sperrdatei zum Löschen freigibt.
3. **E0 weicht von Anlauf 1 ab**: Der E0-Median für H01 mobil LCP ist jetzt 960 ms (Anlauf 1: 992 ms). Der E0-Wert schwankt zwischen den Läufen; deshalb gilt je Lauf die E0-Spanne dieses Laufs.
4. **Anlauf 1 zum Vergleich**: Die Spalte „Median Anlauf 1“ stammt aus `/home/user/schluesselmacher24/_werkstatt/protokolle/E7-PRUEFER-01-ergebnis.md` und ist nicht neu gerechnet. Die Anlauf-1-Spalte nutzt dort 5 Läufe mobil und 3 Läufe Desktop wie hier.
5. **Mobil-Messung Dauer**: 13 Minuten (12:02:30 bis 12:15:19) statt der im Paket genannten 30 bis 40 Minuten. Kein Abbruch.
6. **Bildrate**: `--geraet` wird von `bewegung.mjs bildrate` nicht ausgewertet (mobil by design). Die Einzelwerte über 0 sind in der Tabelle aufgeführt, Median überall 0,0 %.
7. **Ladeweg Bytes vor FCP** im Lauf jetzt: 0,0 KB ohne abgeschlossene Anfrage vor FCP (siehe Hinweise oben). Der Wert ist mit E0 (59,9 KB, 72,5 KB, 58,7 KB) nicht direkt vergleichbar, weil das Dokument im Lauf jetzt nach FCP endet.

=== ENDE E7-PRUEFER-02 Auswertung ===
