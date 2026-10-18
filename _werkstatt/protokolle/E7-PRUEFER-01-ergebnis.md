# E7-PRUEFER-01 · Ergebnis Messung Anlauf 1 (Z-08 mobil gegen E0, Z-05 Bildrate)

## Kopf
- Build-ID Port 3000: `mO87Jg1jNnqeWLZgBYSbk` (aus `/home/user/schluesselmacher24/.next/BUILD_ID`, gelesen 09:49:59 UTC).
- Commit: `git log --oneline -1` ergab `b160c32 docs(werkstatt): Commitkennungen Welle 1 E7 im Plan [E7-B]`. Das Paket nennt e4d7336. e4d7336 ist Vorfahre von HEAD, und zwischen beiden liegt nur `_werkstatt/PLAN.md` (4 Zeilen geändert). Der gemessene Code entspricht damit e4d7336 (Befund: `git diff --stat e4d7336 HEAD`).
- Port 3000 und Port 3100 antworteten bei der Prüfung mit HTTP 200 (09:49:59 UTC).
- Zeitpunkte (UTC): Mobil-Messung 09:50:12 bis 10:03:04 (JSON-Zeit 10:03:03,770); Desktop 10:03:24 bis 10:09:45; Bildrate 10:10:05 bis 10:12:31; Ladeweg Läufe ab 10:13:17 (Port 3000) und 10:13:58 (Port 3100); Sperre gelöscht vor Funktionsliste (Funktionsliste ab 10:14:08); Tastatur mobil 10:15:00; Tastatur desktop 10:15:57; Konsole Ende 10:17:34.
- Sperrdatei `/tmp/sm24-messfenster.lock` gesetzt um 09:50:12 und gelöscht vor der Funktionsliste. Kein Lauf wurde wiederholt, kein Lauf abgebrochen, kein Serverneustart.
- Alle Messungen mit Lauf-Zahl wie im Paket: Mobil 5 Läufe × 12 Ansichten gegen E0, Desktop 3 Läufe × 12 Ansichten gegen E0. Die Lauf-Zahl ist je Serie in den JSON-Dateien (`serien[].laeufe`) festgehalten, alle Läufe gelungen (keine Fehler, `fehler: []`).

## Z-08 mobil: Tabelle je Hauptansicht und Wert
Quelle: `/root/sm24-bilder/e7-p1/messung-mobil.json` (Protokoll `_werkstatt/protokolle/E7-PRUEFER-01-messung-mobil.log`). Medianwerte, Spanne (max − min der E0-Läufe) und Differenz wurden aus den Einzelläufen der JSON-Datei nachgerechnet; alle 36 Zeilen stimmen mit der Summenzeile des Werkzeugs überein. CLS mit sechs Nachkommastellen, damit keine Rundung Werte verbirgt.
Erfüllt-Regel (wie im Werkzeug und wie ABNAHME Z-08: „nicht schlechter als E0 um mehr als die E0-Spanne“): ja, wenn Differenz ≤ Spanne oder Differenz ≤ 0.

| Ansicht | Wert | Median jetzt | Median E0 | Spanne E0 | Differenz (jetzt − E0) | erfüllt |
|---|---|---|---|---|---|---|
| H01-start | LCP | 1168 | 992 | 64 | +176 | nein |
| H01-start | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H01-start | INP | 48 | 72 | 24 | −24 | ja |
| H02-autoschluessel | LCP | 1136 | 988 | 120 | +148 | nein |
| H02-autoschluessel | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H02-autoschluessel | INP | 24 | 72 | 32 | −48 | ja |
| H03-modell-golf | LCP | 1056 | 980 | 28 | +76 | nein |
| H03-modell-golf | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H03-modell-golf | INP | 24 | 64 | 32 | −40 | ja |
| H04-assistent | LCP | 996 | 920 | 32 | +76 | nein |
| H04-assistent | CLS | 0,000124 | 0,000000 | 0,000000 | +0,000124 | nein |
| H04-assistent | INP | 16 | 64 | 40 | −48 | ja |
| H05-code-shop | LCP | 1124 | 1116 | 152 | +8 | ja |
| H05-code-shop | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H05-code-shop | INP | 24 | 72 | 24 | −48 | ja |
| H06-code-produkt | LCP | 1128 | 1016 | 136 | +112 | ja |
| H06-code-produkt | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H06-code-produkt | INP | 32 | 72 | 24 | −40 | ja |
| H07-zylinder-konfigurator | LCP | 1104 | 1016 | 68 | +88 | nein |
| H07-zylinder-konfigurator | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H07-zylinder-konfigurator | INP | 24 | 64 | 16 | −40 | ja |
| H08-schliessanlagen | LCP | 1180 | 1024 | 64 | +156 | nein |
| H08-schliessanlagen | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H08-schliessanlagen | INP | 32 | 64 | 16 | −32 | ja |
| H09-tuertechnik | LCP | 1120 | 1044 | 48 | +76 | nein |
| H09-tuertechnik | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H09-tuertechnik | INP | 24 | 64 | 32 | −40 | ja |
| H10-warenkorb | LCP | 1004 | 2560 | 176 | −1556 | ja |
| H10-warenkorb | CLS | 0,007278 | 0,117386 | 0,000000 | −0,110108 | ja |
| H10-warenkorb | INP | 32 | 56 | 16 | −24 | ja |
| H11-kasse | LCP | 992 | 916 | 32 | +76 | nein |
| H11-kasse | CLS | 0,009766 | 0,103801 | 0,000000 | −0,094035 | ja |
| H11-kasse | INP | 24 | 72 | 40 | −48 | ja |
| H12-ratgeber | LCP | 1024 | 960 | 24 | +64 | nein |
| H12-ratgeber | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H12-ratgeber | INP | 24 | 72 | 32 | −48 | ja |

**Summenzeile mobil:** 26 von 36 Werten erfüllt (LCP 3 von 12, CLS 11 von 12, INP 12 von 12). Ansichten, in denen alle drei Werte erfüllt sind: 3 von 12 (H05 Code-Shop, H06 Code-Produkt, H10 Warenkorb).

**Handrechnung zwei Werte aus den Einzelläufen (JSON):**
- H01-start LCP: jetzt (1164, 1168, 1160, 1168, 1172) → Median 1168. E0 (936, 1000, 992, 984, 996) → Median 992. Spanne E0 = 1000 − 936 = 64. Differenz = 1168 − 992 = +176. 176 > 64, also **nein**. Werkzeug: 1168 / 992 / 64 / +176 / nein. Übereinstimmung.
- H10-warenkorb LCP: jetzt (976, 1012, 1004, 984, 1016) → Median 1004. E0 (2556, 2560, 2500, 2652, 2676) → Median 2560. Spanne E0 = 2676 − 2500 = 176. Differenz = 1004 − 2560 = −1556. −1556 ≤ 0, also **ja**. Werkzeug: 1004 / 2560 / 176 / −1556 / ja. Übereinstimmung.

**Budgets mobil (Median je Ansicht, je Wert):** LCP ≤ 2500 ms: keine Verstöße (höchster Median 1180 ms, H08). CLS ≤ 0,1: keine Verstöße (höchster Median 0,009766, H11). INP ≤ 200 ms: keine Verstöße (höchster Median 48 ms). Ergebnis: **keine**.

## Desktop zur Einordnung (3 Läufe je Serie, gegen E0)
Quelle: `/root/sm24-bilder/e7-p1/messung-desktop.json`, Protokoll `_werkstatt/protokolle/E7-PRUEFER-01-messung-desktop.log`. Gleiche Rechnung und Erfüllt-Regel wie oben; alle 36 Zeilen stimmen mit dem Werkzeug überein.

| Ansicht | Wert | Median jetzt | Median E0 | Spanne E0 | Differenz (jetzt − E0) | erfüllt |
|---|---|---|---|---|---|---|
| H01-start | LCP | 176 | 144 | 68 | +32 | ja |
| H01-start | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H01-start | INP | 32 | 40 | 16 | −8 | ja |
| H02-autoschluessel | LCP | 172 | 144 | 24 | +28 | nein |
| H02-autoschluessel | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H02-autoschluessel | INP | 24 | 40 | 24 | −16 | ja |
| H03-modell-golf | LCP | 148 | 132 | 32 | +16 | ja |
| H03-modell-golf | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H03-modell-golf | INP | 40 | 48 | 0 | −8 | ja |
| H04-assistent | LCP | 160 | 172 | 32 | −12 | ja |
| H04-assistent | CLS | 0,001493 | 0,000000 | 0,000000 | +0,001493 | nein |
| H04-assistent | INP | 48 | 48 | 8 | 0 | ja |
| H05-code-shop | LCP | 212 | 160 | 20 | +52 | nein |
| H05-code-shop | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H05-code-shop | INP | 24 | 48 | 8 | −24 | ja |
| H06-code-produkt | LCP | 168 | 168 | 28 | 0 | ja |
| H06-code-produkt | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H06-code-produkt | INP | 48 | 48 | 0 | 0 | ja |
| H07-zylinder-konfigurator | LCP | 176 | 156 | 8 | +20 | nein |
| H07-zylinder-konfigurator | CLS | 0,000033 | 0,000000 | 0,000000 | +0,000033 | nein |
| H07-zylinder-konfigurator | INP | 48 | 56 | 8 | −8 | ja |
| H08-schliessanlagen | LCP | 152 | 168 | 24 | −16 | ja |
| H08-schliessanlagen | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H08-schliessanlagen | INP | 32 | 40 | 16 | −8 | ja |
| H09-tuertechnik | LCP | 176 | 192 | 44 | −16 | ja |
| H09-tuertechnik | CLS | 0,000000 | 0,000000 | 0,000000 | 0,000000 | ja |
| H09-tuertechnik | INP | 24 | 40 | 8 | −16 | ja |
| H10-warenkorb | LCP | 144 | 116 | 4 | +28 | nein |
| H10-warenkorb | CLS | 0,003243 | 0,037889 | 0,000000 | −0,034646 | ja |
| H10-warenkorb | INP | 24 | 48 | 16 | −24 | ja |
| H11-kasse | LCP | 116 | 124 | 16 | −8 | ja |
| H11-kasse | CLS | 0,003982 | 0,030799 | 0,000000 | −0,026816 | ja |
| H11-kasse | INP | 40 | 40 | 8 | 0 | ja |
| H12-ratgeber | LCP | 128 | 128 | 84 | 0 | ja |
| H12-ratgeber | CLS | 0,000014 | 0,000000 | 0,000000 | +0,000014 | nein |
| H12-ratgeber | INP | 40 | 48 | 24 | −8 | ja |

**Summenzeile desktop:** 29 von 36 Werten erfüllt (LCP 8 von 12, CLS 9 von 12, INP 12 von 12). Ansichten mit allen drei Werten erfüllt: 6 von 12 (H01, H03, H06, H08, H09, H11).

**Budgets desktop (Median):** LCP höchster Median 212 ms (H05), CLS höchster Median 0,003982 (H11), INP höchster Median 48 ms. Ergebnis: **keine**.

## Bildrate mobil (Z-05): je Moment 5 Läufe am gerenderten Element
Werkzeug `_werkstatt/werkzeuge/bewegung.mjs bildrate` (mobil 390 × 844, CPU 4-fach gedrosselt, Schwelle 5 %). Protokoll `_werkstatt/protokolle/E7-PRUEFER-01-bildrate.log`, JSON je Moment unter `/root/sm24-bilder/e7-p1/bildrate-<kürzel>.json`. Der erste gerenderte Treffer wurde gemessen; die Größe ist die des gemessenen Elements.

| Moment | Seite | Gemessenes Element (Größe) | Treffer (gerendert) | Anteil verworfen, Läufe 1–5 | Median | ≤ 5 % |
|---|---|---|---|---|---|---|
| Start | `/` | svg, 480 × 360 px | 1 | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 % | 0,0 % | ja |
| Autoschlüssel | `/autoschluessel` | svg, 246 × 138 px | 4 (Index 0, 0 versteckt) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 % | 0,0 % | ja |
| Schlüssel nach Code | `/schluessel-nach-code` | svg, 382 × 215 px | 1 | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 % | 0,0 % | ja |
| Schließanlagen | `/schliessanlagen` | svg, 350 × 197 px | 2 (Index 0, 1 versteckt) | 2,8 · 0,0 · 0,0 · 0,0 · 0,0 % | 0,0 % | ja |
| Tür und Schließtechnik | `/tuer-und-schliesstechnik` | svg, 378 × 236 px | 1 | 0,0 · 0,0 · 0,0 · 0,9 · 0,0 % | 0,0 % | ja |
| Ratgeber verloren | `/ratgeber/autoschluessel-verloren-was-tun` | svg, 350 × 263 px | 2 (Index 0, 1 versteckt) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 % | 0,0 % | ja |
| Standort Berlin | `/standorte/berlin` | svg, 350 × 263 px | 1 | 0,0 · 0,0 · 0,9 · 0,0 · 0,0 % | 0,0 % | ja |
| Service und Termin | `/service-und-termin` | svg, 318 × 382 px | 2 (Index 0, 1 versteckt) | 0,0 · 0,0 · 0,0 · 0,0 · 0,0 % | 0,0 % | ja |

Alle acht Momente liegen unter 5 % (Median 0,0 %). Höchster Einzelwert: 2,8 % (Schließanlagen, Lauf 1).

## Ladeweg (Ursachenbeleg): jetzt gegen E0
Werkzeug `_werkstatt/werkzeuge/ladeweg.mjs`, 3 Läufe je Route, mobil mit Netz „langsames 4G“. Protokoll `_werkstatt/protokolle/E7-PRUEFER-01-ladeweg.log` (erst Port 3000, dann `--basis http://localhost:3100`). Route `/autoschluessel/marken/volkswagen/golf` ist im Werkzeug H03-modell-golf.

| Route | FCP jetzt | FCP E0 | LCP jetzt | LCP E0 | LCP-Element jetzt (mittlerer Lauf) | LCP-Element E0 (mittlerer Lauf) | Bytes vor FCP jetzt | Bytes vor FCP E0 | Long Tasks vor FCP jetzt | Long Tasks vor FCP E0 |
|---|---|---|---|---|---|---|---|---|---|---|
| H01-start `/` | 1172 | 1000 | 1172 | 1000 | h1 „Autoschlüssel nachmachen und programmieren“ | h1, gleicher Text | 72,5 KB | 59,9 KB | 2 · 332 ms | 2 · 173 ms |
| H08-schliessanlagen | 1196 | 1032 | 1196 | 1032 | h1 „Mechanische Schließanlagen“ | p „Der Weg dorthin ist immer derselbe …“ | 77,8 KB | 72,5 KB | 2 · 350 ms | 2 · 239 ms |
| H03-modell-golf | 1092 | 960 | 1092 | 960 | h1 „Autoschlüssel für Volkswagen Golf“ | p „Diese Angaben stammen aus unserem Fahrzeugdatensat …“ | 56,6 KB | 58,7 KB | 2 · 257 ms | 2 · 183 ms |

Schriften bei FCP: auf beiden Servern mindestens eine Schrift nicht geladen (IBM Plex Sans und Inter jeweils „nein“). Bytes vor FCP je Typ (Median) jetzt: H01 Dokument 33,4 KB, Script 23,3 KB, Stylesheet 15,9 KB; E0: Dokument 16,9 KB, Font 32,1 KB, Stylesheet 11,0 KB (vollständige Aufteilung im Protokoll).

## Funktionsliste, Tastatur, Konsole
- **Funktionsliste** (Port 3000, `_werkstatt/protokolle/E7-PRUEFER-01-funktionsliste.log`): Bestanden 14 von 14 (F-01 bis F-14, alle BESTANDEN). Die Werkzeugausgabe trägt in der Kopfzeile die Bezeichnung „E0-PRUEFER-04“ (siehe Auffälligkeiten).
- **Tastatur mobil** (`_werkstatt/protokolle/E7-PRUEFER-01-tastatur-mobil.log`, F-01, F-02, F-04 bis F-08): Bestanden 7 von 7. Keine Bedienung ohne sichtbaren Fokus. Eine Wiederholung mit `--nur` war nicht nötig.
- **Tastatur desktop** (`_werkstatt/protokolle/E7-PRUEFER-01-tastatur-desktop.log`, gleiche Funktionen): Bestanden 7 von 7. Keine Bedienung ohne sichtbaren Fokus. Keine Wiederholung nötig.
- **Konsole** der 12 Hauptansichten (`_werkstatt/protokolle/E7-PRUEFER-01-konsole.log`): Konsolenfehler 0, Warnungen 0, Seitenfehler 0 in allen Ansichten. Fehlgeschlagene Anfragen: H01 1, H02 2, H03 1, H12 2 (zusammen 6). Alle 6 sind `net::ERR_ABORTED` auf `/autoschluessel/anfrage?_rsc=…`. Attrappen-Abbrüche 0.

## Auffälligkeiten
1. **Z-08 mobil nicht erfüllt, 10 von 36 Werten:** LCP in 9 Ansichten (H01, H02, H03, H04, H07, H08, H09, H11, H12) mit Differenz +64 bis +176 ms gegen E0-Spanne 24 bis 120 ms (Zahlen in der Tabelle oben). CLS in H04 (siehe 2). INP in keiner Ansicht.
2. **H04 mobil CLS „nein“ bei angezeigt 0,000:** Median jetzt 0,000124 (alle fünf Läufe 0,000124), E0 0, Spanne 0. Die Differenz ist also nicht Null, auch wenn sie gerundet 0,000 zeigt. Der Wert liegt weit unter dem Budget 0,1. Rein rechnerisch unterschreitet er die Regel „Spanne 0“.
3. **Desktop, 7 Werte „nein“** (nur zur Einordnung): H02 LCP (+28 ms, Spanne 24), H04 CLS (+0,001493, Spanne 0), H05 LCP (+52 ms, Spanne 20), H07 LCP (+20 ms, Spanne 8), H07 CLS (+0,000033, Spanne 0), H10 LCP (+28 ms, Spanne 4), H12 CLS (+0,0000139, Spanne 0). Die CLS-Fälle liegen im Rauschbereich (unter 0,002).
4. **Ladeweg: FCP und LCP auf allen drei Routen höher als E0** (H01 +172 ms, H08 +164 ms, H03 +132 ms). Bytes vor FCP: H01 +12,6 KB, H08 +5,3 KB, H03 −2,1 KB. Long Tasks vor FCP steigen auf allen drei Routen (+159, +111, +74 ms). Die Messung beschreibt nur die Ursache, sie ist keine Bewertung.
5. **Bildrate: keine Überschreitung**, aber Einzelwerte über 0: 2,8 % (Schließanlagen Lauf 1), 0,9 % (Tür Lauf 4, Berlin Lauf 3). Alle Mediane 0,0 %.
6. **Dauer der Mobil-Messung:** 13 Minuten (09:50 bis 10:03 UTC), nicht die im Paket genannten 30 bis 40 Minuten. Es gab keinen Abbruch und keine Wiederholung.
7. **Abweichung vom Paket bei der Bildrate:** `bewegung.mjs bildrate` kennt kein `--geraet`. Die Läufe sind mobil by design (390 × 844, CPU 4-fach). Für „/“ habe ich `--laeufe 5` und den Kürzel „start“ gesetzt, weil das Paket im Schritt „je 5 Läufe“ genannt wird und keinen Kürzel angibt. Die Kürzel stehen in den Dateinamen unter `/root/sm24-bilder/e7-p1/`.
8. **Gegen die Schreibrechte: Dateien vom Werkzeug ohne Umleitung erzeugt** (Standardausgabe der Werkzeuge, nicht von mir umgeleitet). Diese liegen in `_werkstatt/protokolle/`, nicht unter dem Präfix E7-PRUEFER-01-: `funktionsliste-2026-10-18_12-14-59.md/.json`, `funktionsliste-2026-10-18_12-15-56.md/.json`, `funktionsliste-2026-10-18_12-16-59.md/.json`, `konsole-2026-10-18_12-17-34.json`, `ladeweg-2026-10-18_12-13-17.json`, `ladeweg-2026-10-18_12-13-58.json`. Nicht gelöscht, da das Paket nur die Sperrdatei zum Löschen freigibt.
9. **Überschriebene versionierte Datei:** `_werkstatt/protokolle/E7-PRUEFER-01-messung-mobil.log` war in Git als 0 Byte leere Datei (Commit 4928fa1, „ZWISCHENSTAND Messung Anlauf 1 (laufend)“). Mein Lauf hat sie mit dem Protokoll gefüllt. Ich habe nichts committet. `git status` zeigt sie als geändert.
10. **Konsole: 6 abgebrochene Anfragen** (ERR_ABORTED auf `/autoschluessel/anfrage?_rsc=…`). Die Ursache habe ich nicht geprüft. Das Werkzeug zählt sie als fehlgeschlagen, nicht als Attrappen-Abbruch.
11. **Funktionsliste-Kopf nennt „E0-PRUEFER-04“**, obwohl die Läufe gegen Port 3000 gingen. Das ist die Bezeichnung im Werkzeug, nicht meine Angabe.
12. **Dokumentation Z-08 (ABNAHME.md):** dort steht „Median aus 3 Läufen“ und als Istwert „10 von 12 im Budget; H10 mobil LCP 2508 ms und CLS 0,117“. Dieser Lauf hat 5 Läufe gemacht (Paket). Der Istwert H10 mobil ist LCP 1004 ms und CLS 0,007. Ich habe ABNAHME.md nicht geändert.

## Offene Fragen
- Gilt für CLS-Werte unter 0,0002 mit Spanne 0 die Erfüllt-Regel als „nein“ (Werkzeug-Regel) oder als „rauschbedingt ja“? Der Befund ändert die Summenzeile mobil um 1 (H04 CLS).
- Soll ABNAHME Z-08 auf 5 Läufe umgestellt werden, und soll der Istwert ersetzt werden?
- Sollen die sechs vom Werkzeug erzeugten Dateien (Punkt 8) verschoben oder entfernt werden? Das entscheidet der Orchestrator, ich habe nichts gelöscht.
- Ist die Gleichsetzung Build-ID mO87Jg1jNnqeWLZgBYSbk ↔ Commit e4d7336 durch das Build-Protokoll `_werkstatt/protokolle/E7-build-anlauf1.log` belegt? Ich habe nur die Git-Ahnenbeziehung geprüft.

=== ENDE E7-PRUEFER-01 · BEREIT ZUR RÜCKGABE ===
