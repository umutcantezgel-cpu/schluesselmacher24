# E6-PRUEFER-C · Ergebnis Abschlussversuch 1 (Teil 6)

Wörtlich aus dem Journal des Workflows `wf_2708b732-5cf` übernommen: Rückgabe des Prüfers von Teil 6, der die Datei selbst nicht geschrieben hat. Dazu die Rückgaben der Nachlese-Teile 2, 3b, 4 und 5b. Die Berichte der Teile 1, 3 und 5 (erster Lauf) stehen in `E6-PRUEFER-C-teilberichte-1-3-5.md`.

## Teil 2 · Nachlese

GEÄNDERTE DATEIEN
- Angehängt: /home/user/schluesselmacher24/_werkstatt/protokolle/E6-PRUEFER-C-einzelbilder.log (H12 und U-SERVICE, je Paketselektor und zusätzlich "main header [role=img]", --dauer 1600).
- Neu (Protokoll-JSON): /home/user/schluesselmacher24/_werkstatt/protokolle/bewegung-einzelbilder-2026-10-18_00-28-19.json, ...-21.json, ...-34.json, ...-36.json
- Neu (Bilder): /root/sm24-bilder/e6-c/einzelbilder/H12/ und /root/sm24-bilder/e6-c/einzelbilder/U-SERVICE/ (je 5 Bilder pro Selektor).
- Keine Projektdatei geändert, keine Sperre gesetzt, nichts gelöscht, nichts committet.

WAS UND WARUM
Nachlese ohne Neumessung. Einzige Nachholung: Schritt 2. Schritt 3: keine Ansicht und kein Gerät fehlte. Die Teil-2-Protokolle stammen vom ersten Messstand (Dateizeiten 13:56 bis 14:11). Port 3000 antwortet mit 200 für / und 404 für /gibt-es-nicht-pruefung.

GEMEINSAME DATEIEN
Keine. Port 3001 und 3100 nicht benutzt.

PRÜFUNG UND ERGEBNIS
Schritt 1 (Vollständigkeit): vollständig. Konsole: 12 Hauptansichten und 11 ALLE_U. Bildsatz: H01 bis H12 und ALLE_U je mobil, tablet, desktop. Gefüllt: Warenkorb und Kasse je 3 Geräte. Einzelbilder: 8 Ansichten. A11y: 12 und 11, je 2 Geräte. Bewegung reduziert: 12 und 11. Bildrate: 7 große Momente, alle mobil.
Schritt 2 (H12, U-SERVICE): nicht bestanden. Mit --dauer 1600 kein Bedienfehler mehr, aber 0 endliche Animationen, Element 0 x 0 px, Ausschnitt 24 x 24 px. Die je 5 Bilder sind byte-gleich (md5 ff359001615bf221ea655515c82550b1, 763 Byte, leer). Kein Fortschritt sichtbar. Alternativselektor "main header [role=img]" ergibt dieselben Bilder. Zum Vergleich H01: Bild 0 Rohling, Bild 4 gefrästes Profil.
Schritt 3: nichts nachgeholt.
Schritt 4 (Erstbilder): technische Auffälligkeiten siehe AUFFAELLIG.
Schritt 5 (Zusammenfassung):
Ansicht | abgebrochene Anfragen | Rand-Elemente m/t/d
H01 Start 1 73/3/2 | H02 Autoschluessel 0 82/2/0 | H03 Modell Golf 1 4/2/1 | H04 Assistent 0 0/0/0 | H05 Code-Shop 0 7/1/1 | H06 Code-Produkt 0 6/3/1 | H07 Zylinder-Konfigurator 0 1/1/1 | H08 Schliessanlagen 1 60/4/3 | H09 Tuer 2 16/1/1 | H10 Warenkorb 0 0/0/0 | H11 Kasse 0 0/0/0 | H12 Ratgeber 2 1/1/1
gleichschliessende-zylinder 1 8/4/4 (gekappt) | service-und-termin 3 33/1/0 (gekappt) | artikel 0 0/0/0 | standorte-berlin 2 1/0/1 | sicherheitstechnik 0 0/0/0 | rechtliches-agb 0 8/2/0 | artikel-beispiel 0 1/1/0 | schluesselbart-fraesen 0 1/1/1 | elektronische-zutrittsloesungen 2 3/3/2 (gekappt) | rechtliches-impressum 0 8/2/0 | service-und-termin-vor-ort 1 1/1/1
Alle 23 Ansichten: Konsole 0 Fehler, 0 Warnungen, 0 Seitenfehler. Dokument-Überlauf "nein" in allen 69 Läufen (bildsatz.log). Axe serious und critical je Gerät 0, in allen 46 Läufen auch moderate und minor 0 (a11y.log). Bewegung reduziert: 0 laufende Animationen, 0 Befunde, 0 verborgene Inhalte in allen 23 Ansichten (bewegung-reduziert.log).
Bildrate mobil, Median aus 5 Läufen, Einzelwerte in Prozent (bildrate.log, bildrate-*.json):
- H01 Start, 1800 ms: 0,83 | 0,00 / 0,00 / 2,48 / 6,61 / 0,83 | innerhalb 5 %
- H02 Autoschluessel, 1600 ms: 8,04 | 6,36 / 17,12 / 8,04 / 4,50 / 14,55 | ueber 5 %
- H05 Code-Shop, 1600 ms: 6,19 | 7,27 / 4,46 / 14,41 / 3,57 / 6,19 | ueber 5 %
- H08 Schliessanlagen, 1600 ms: 9,91 | 9,91 / 8,04 / 19,09 / 8,11 / 22,73 | ueber 5 %
- H09 Tuer, 1600 ms: 5,31 | 3,64 / 4,55 / 5,31 / 5,45 / 5,41 | ueber 5 % (knapp)
- H12 Ratgeber, 1600 ms: 0,00 | 2,68 / 0,00 / 4,46 / 0,00 / 0,00 | innerhalb, nur eingeschraenkt aussagekraeftig (Selektor 0 x 0 px)
- U-STANDORTE, 1600 ms: 1,82 | 4,55 / 4,50 / 1,82 / 1,83 / 1,82 | innerhalb 5 %

=== ENDE E6-PRUEFER-C · BEREIT ZUR RÜCKGABE ===

**Auffällig:**

- Einzelbilder H12 (/ratgeber/autoschluessel-verloren-was-tun): 0 endliche Animationen, Element 0 x 0 px, 5 byte-gleiche leere Bilder. Selektor laut Paket und Alternativselektor ergeben dasselbe. Kein Fortschritt sichtbar. Beleg: E6-PRUEFER-C-einzelbilder.log (Anhang), /root/sm24-bilder/e6-c/einzelbilder/H12/.
- Einzelbilder U-SERVICE (/service-und-termin): gleicher Befund wie H12, 0 Animationen, 0 x 0 px, 10 identische leere Bilder (beide Selektoren). Beleg: /root/sm24-bilder/e6-c/einzelbilder/U-SERVICE/.
- Bildrate H12: Median 0,00 % beruht auf demselben 0 x 0 px-Selektor, daher nur eingeschraenkt aussagekraeftig. Beleg: bildrate-H12.json.
- Bildrate ueber 5 % (K-011): H02 8,04 %, H05 6,19 %, H08 9,91 %, H09 5,31 % (knapp). Messung am ersten Messstand, nicht am Build 2cdcbab. Beleg: E6-PRUEFER-C-bildrate.log.
- Konsole, abgebrochene Anfragen (net::ERR_ABORTED, /autoschluessel/anfrage bzw. /service-und-termin/anfrage mit ?_rsc=): H01 1, H03 1, H08 1, H09 2, H12 2; gleichschliessende-zylinder 1, service-und-termin 3, standorte-berlin 2, elektronische-zutrittsloesungen 2, service-und-termin-vor-ort 1. Keine Konsolenfehler, Warnungen oder Seitenfehler. Beleg: E6-PRUEFER-C-konsole.log.
- Bildsatz, Rand-Elemente ueber den rechten Rand (Elementebene, Dokument-Überlauf nein): mobil H01 73, H02 82, H08 60, H09 16, H06 6, service-und-termin 33 (gekappt). Haeufigste Treffer: dekorative SVG-Pfade (path.stroke-area-muted40) und -mx-5-Listen. Beleg: E6-PRUEFER-C-bildsatz.log.
- Bildsatz gekappt (--max 6 laut Paket): gleichschliessende-zylinder (m 6 von 14, t 6 von 10, d 6 von 10), service-und-termin (m 6 von 12, t 6 von 8, d 6 von 9), autoschluessel-schluesselbart-fraesen (m 6 von 8), elektronische-zutrittsloesungen (m 6 von 14, t 6 von 9, d 6 von 8). Nicht nachgeholt, weil keine Ansicht und kein Gerät fehlt.
- Erstbild mobil, Überdeckung: fixe Boden-Leiste (Tab-Leiste oder Aktions-/Summenleiste) überdeckt den unteren Rand in fast allen mobilen Erstbildern. Beispiele: H07 Summenleiste über Text 'Die Versandart ...', H04 Aktionsleiste, sicherheitstechnik-sicherheitscheck Aktionsleiste über Hinweistext.
- Erstbild mobil, Abgeschnittenes: horizontale Leisten am rechten Rand. H02 Kachel '02 Funkschluessel'; rechtliches-agb und rechtliches-impressum Chip 'Widerruf und Rueckgabe'.
- Erstbild Desktop, leere Fläche: gleichschliessende-zylinder, rechte Grafikfläche neben '01 Einfach erklärt' im Ausschnitt nur Raster.
- Erstbild Desktop, Überdeckung: service-und-termin, gestrichelte Hilfslinien der Zeitleiste kreuzen die Beschriftungen 'Bedarfsanalyse/Projektierung' und 'Fertigung/Montage'.
- Erstbild Desktop: service-und-termin-vor-ort, Beschriftungen 1, 2 und 4 im Diagramm blass gegenüber 3 (Einblendung zum Aufnahmezeitpunkt oder Kontrast, nicht entschieden).
- Inhalt, kein Technikbefund: rechtliches-agb und rechtliches-impressum zeigen sichtbar '[Platzhalter: ...]'-Markierungen und den Hinweis 'vor dem Livegang juristisch geprüft'.
- Schritt 2 nicht bestanden: H12 und U-SERVICE liefern ohne Animation keine auswertbaren Bilder, Fortschritt nicht prüfbar.

## Teil 3b · Nachlauf Funktionsliste und Tastatur

GEÄNDERTE DATEIEN
Keine Projektdatei geändert, nichts committet, keine Sperrdatei gesetzt, nichts gelöscht. Neu angelegte Protokolle: _werkstatt/protokolle/E6-PRUEFER-C-funktionsliste-nachtrag.log, E6-PRUEFER-C-tastatur-mobil-nachtrag.log, E6-PRUEFER-C-tastatur-desktop-nachtrag.log, dazu funktionsliste-2026-10-18_00-29-01.md/.json, funktionsliste-2026-10-18_00-29-50.md/.json, funktionsliste-2026-10-18_00-30-41.md/.json.

WAS UND WARUM
Werkzeug funktionsliste.mjs ohne SM24_BASIS_URL, also Port 3000 (Build 2cdcbab). Port 3001 und 3100 nicht benutzt. Wiederholungen nicht nötig, da kein Punkt NICHT BESTANDEN war.

PRÜFUNG UND ERGEBNIS
1. Funktionsliste, alle 14 Punkte: 14 von 14 BESTANDEN. Protokoll: _werkstatt/protokolle/E6-PRUEFER-C-funktionsliste-nachtrag.log (Markdown funktionsliste-2026-10-18_00-29-01.md).
2. Tastatur mobil (F-01, F-02, F-04, F-05, F-06, F-07, F-08): 7 von 7 BESTANDEN. Protokoll: E6-PRUEFER-C-tastatur-mobil-nachtrag.log (Markdown funktionsliste-2026-10-18_00-29-50.md).
3. Tastatur Desktop (gleiche sieben): 7 von 7 BESTANDEN. Protokoll: E6-PRUEFER-C-tastatur-desktop-nachtrag.log (Markdown funktionsliste-2026-10-18_00-30-41.md).

Abschnitt „Tastatur“ je Gerät (Bedienungen / Tab-Schritte / ohne sichtbaren Fokus):
- mobil: F-01 5/25/keine; F-02 13/40/keine; F-04 33/457/keine; F-05 6/60/keine; F-06 42/474/keine; F-07 98/1028/keine; F-08 3/9/keine.
- desktop: F-01 5/35/keine; F-02 13/49/keine; F-04 33/591/keine; F-05 6/73/keine; F-06 42/591/keine; F-07 98/1281/keine; F-08 3/14/keine.

Vergleich mit dem ersten Lauf (E6-PRUEFER-C-funktionsliste.log, -tastatur-mobil.log, -tastatur-desktop.log):
- F-01 per Tastatur besteht jetzt auf beiden Geräten: Menge 2 ja (2), Zwischensumme 16,00 €, Summe 20,95 €. Im ersten Lauf war es NICHT BESTANDEN mit Menge 12 und 78,72 €. Die Wiederholungen dort (funktionsliste-2026-10-17_16-20-55.md und _16-21-10.md) scheiterten ebenfalls.
- Sonst keine Änderung: Ergebnis- und Begründungstexte aller Punkte sind identisch (Vergleich ohne Dauer und Zeitstempel), Tab-Schritte und Bedienungen je Punkt und Gerät sind identisch, „ohne sichtbaren Fokus“ ist überall keine. Die Dauern weichen leicht ab, das ist nicht gewertet.

BILDBELEGE
62 Schrittbilder unter /root/sm24-bilder/e6-c/schritte-nachtrag/ (erster Lauf: /root/sm24-bilder/e6-c/schritte/, ebenfalls 62).

GEMEINSAME DATEIEN
Keine.

OFFENE FRAGEN
Keine aus meinem Teil. Im Arbeitsbaum liegen Änderungen, die nicht aus meinem Lauf stammen (siehe Auffälliges).

=== ENDE E6-PRUEFER-C · BEREIT ZUR RÜCKGABE ===

**Auffällig:**

- F-01 per Tastatur, mobil und Desktop: jetzt BESTANDEN (Menge 2 ja (2), Summe 20,95 €). Im ersten Lauf NICHT BESTANDEN (Menge 12, 78,72 €), auch bei den Wiederholungen. Belege: _werkstatt/protokolle/E6-PRUEFER-C-tastatur-mobil-nachtrag.log, E6-PRUEFER-C-tastatur-desktop-nachtrag.log, funktionsliste-2026-10-18_00-29-50.md, funktionsliste-2026-10-18_00-30-41.md.
- Im Nachlauf kein Punkt NICHT BESTANDEN: Funktionsliste 14 von 14, Tastatur mobil 7 von 7, Tastatur Desktop 7 von 7. Wiederholungen nicht nötig.
- Sonst keine Abweichung zum ersten Lauf: Texte, Tab-Schritte und Bedienungen identisch, Fokus überall vorhanden.
- E6-PRUEFER-C-funktionsliste-nachtrag.log war vor meinem Lauf 0 Byte (Zeitstempel 22:27, vermutlich Abbruch eines früheren Versuchs) und wurde von mir überschrieben.
- Arbeitsbaum enthält Änderungen, die nicht aus meinem Lauf stammen und unberührt blieben: _werkstatt/protokolle/E6-PRUEFER-C-einzelbilder.log (geändert), untracked _werkstatt/bilder/abschluss/ und _werkstatt/protokolle/bewegung-einzelbilder-2026-10-18_00-28-19.json, -00-28-21.json, -00-28-34.json, -00-28-36.json.

## Teil 4 · Nachlese Messung

GEÄNDERTE DATEIEN
- Neu: /home/user/schluesselmacher24/_werkstatt/protokolle/E6-PRUEFER-C-messung-auswertung.md (Tabellen 1 bis 3, Methode, Zeitbezug, Budgets, Offenes). Keine Messung gestartet, keine Sperre gesetzt, keine Projektdatei geändert, nichts committet.

WAS UND WARUM
Nachlese der beiden Läufe. Quellen: jetzt = _werkstatt/protokolle/messung-2026-10-17_16-46-12.json (E6-PRUEFER-C-messung.log, 3 Läufe je Ansicht und Profil); E0 heute mobil = _werkstatt/protokolle/messung-2026-10-17_16-50-26.json (E6-PRUEFER-C-messung-e0.log). Alle Mediane habe ich aus den Einzelläufen nachgerechnet; sie stimmen mit den Protokollzeilen überein.

1. Jetzt, Median LCP ms / CLS / INP ms / JS-KB
Mobil: H01 1112/0,000/160/231,1 · H02 1104/0,000/168/217,5 · H03 1080/0,000/160/228,4 · H04 968/0,000/96/226,0 · H05 1056/0,000/128/236,0 · H06 1080/0,000/160/235,7 · H07 1028/0,000/88/219,1 · H08 1168/0,000/168/268,5 · H09 1108/0,000/144/226,3 · H10 984/0,007/104/243,4 · H11 984/0,010/112/234,1 · H12 1004/0,000/128/177,9
Desktop: H01 172/0,000/48/346,9 · H02 172/0,000/32/278,3 · H03 180/0,000/56/278,3 · H04 128/0,000/40/305,2 · H05 148/0,000/32/289,8 · H06 132/0,000/48/289,8 · H07 144/0,000/48/293,2 · H08 164/0,000/40/301,2 · H09 164/0,000/32/278,3 · H10 120/0,003/48/293,2 · H11 124/0,004/40/289,0 · H12 144/0,000/40/278,3

2. Budgets jetzt (K-011, am Median): alle 24 Serien eingehalten, 0 Verstöße. Höchster Einzellauf: LCP 1172 ms (H08 mobil), INP 200 ms (H08 mobil, Lauf 2, genau am Budget).

3. E0 heute, mobil, Median (min bis max): LCP H01 980 (960–1032), H02 984 (976–1012), H03 944 (932–944), H04 924 (916–928), H05 1064 (1036–1104), H06 1032 (1020–1032), H07 976 (956–984), H08 988 (976–996), H09 1036 (1032–1072), H10 2668 (2660–2740), H11 908 (904–920), H12 924 (920–932). INP H01 72 (64–72), H02 56 (48–56), H03 64 (56–72), H04 64 (64–64), H05 64 (56–72), H06 64 (56–72), H07 64 (48–64), H08 56 (56–72), H09 64 (56–72), H10 72 (56–88), H11 56 (56–56), H12 72 (48–72). CLS 0,000 außer H10 0,117 und H11 0,104 (je alle drei Läufe).

4. Z-08 mobil (Verschlechterung = Median jetzt minus Median E0; erfüllt wenn höchstens die E0-Spanne max minus min):
LCP: H01 +132 (Spanne 72) nein · H02 +120 (36) nein · H03 +136 (12) nein · H04 +44 (12) nein · H05 −8 (68) ja · H06 +48 (12) nein · H07 +52 (28) nein · H08 +180 (20) nein · H09 +72 (40) nein · H10 −1684 (80) ja · H11 +76 (16) nein · H12 +80 (12) nein.
INP: H01 +88 (8) nein · H02 +112 (8) nein · H03 +96 (16) nein · H04 +32 (0) nein · H05 +64 (16) nein · H06 +96 (16) nein · H07 +24 (16) nein · H08 +112 (16) nein · H09 +80 (16) nein · H10 +32 (32) ja, Grenzfall · H11 +56 (0) nein · H12 +56 (24) nein.
CLS: in allen 12 Ansichten erfüllt.
Ergebnis: LCP erfüllt 2 von 12, INP erfüllt 1 von 12, CLS erfüllt 12 von 12. Nur H10 erfüllt alle drei Werte. Desktop ist nicht bewertbar, weil es heute keinen E0-Desktoplauf gibt.

Hinweis Messwerte: INP-Werte liegen alle auf 8-ms-Stufen, daher sind die E0-Spannen bei INP klein (0 bis 32 ms).

AUFFAELLIG: siehe Feld auffaellig.

PRÜFUNG UND ERGEBNIS
Keine Messung wiederholt. Mediane, Spannen und Z-08-Werte aus den JSON-Feldern serien[].laeufe[] berechnet, Skript nur lesend. Budgetwerte und Z-08-Regel gemäß K-011 und ABNAHME.md Z-08.

BILDBELEGE
Keine. Ich habe keine Bilder erzeugt.

OFFENE FRAGEN
- Soll die Messung „jetzt“ auf dem Build von 2cdcbab wiederholt werden? Die Entscheidung liegt beim Endprüfer.
- Z-08 für Desktop braucht einen E0-Lauf heute, der fehlt.

=== ENDE E6-PRUEFER-C · BEREIT ZUR RÜCKGABE ===

**Auffällig:**

- ZEITBEZUG: Die Messung 'jetzt' ist vor dem heutigen Build gelaufen. Zeitstempel messung-2026-10-17_16-46-12.json 14:46:12Z und messung-2026-10-17_16-50-26.json 14:50:26Z. Der Build auf Port 3000 (.next/BUILD_ID mJcKPvGMRy5iL1fttdhAu) ist vom 2026-10-17 22:25:20 UTC und damit jünger. Die Zahlen gelten also für den Stand vor 2cdcbab, nicht für 2cdcbab. Das Messprotokoll nennt keinen Build-Stand. Nach Aktenlage war es der Build aus E6-PRUEFER-C-build.log (13:54 UTC), das ist eine Ableitung aus den Zeitstempeln.
- Z-08 NICHT ERFÜLLT mobil bei LCP: 10 von 12 Ansichten schlechter als E0 heute um mehr als die E0-Spanne (H01 +132 gegen Spanne 72; H02 +120 gegen 36; H03 +136 gegen 12; H04 +44 gegen 12; H06 +48 gegen 12; H07 +52 gegen 28; H08 +180 gegen 20; H09 +72 gegen 40; H11 +76 gegen 16; H12 +80 gegen 12). Quelle: messung-2026-10-17_16-46-12.json und messung-2026-10-17_16-50-26.json, Tabelle 3 in E6-PRUEFER-C-messung-auswertung.md.
- Z-08 NICHT ERFÜLLT mobil bei INP: 11 von 12 Ansichten (alle außer H10). Größte Verschlechterung H02 +112 ms gegen E0-Spanne 8 ms. Die E0-Spannen bei INP sind klein, weil die Werte auf 8-ms-Stufen liegen.
- Z-08 Grenzfall: H10 mobil INP +32 ms bei E0-Spanne 32 ms, als erfüllt gewertet (Gleichheit).
- Z-08 Desktop nicht bewertbar: kein E0-Lauf heute für Desktop vorhanden.
- Budgets jetzt: keine Verstöße am Median in 24 Serien. Einzellauf-Grenzfall: INP 200 ms bei H08 mobil (Lauf 2), genau am Budget.
- Budgetverstöße im E0-Lauf heute (mobil): H10 LCP 2668 ms (Budget 2500) und CLS 0,117; H11 CLS 0,104. Das entspricht dem E0-Ausgangsstand.
- Vergleichswert E5 mobil (E5-PRUEFER-B-messung.log): LCP-Mediane 956 bis 1152 ms, INP 80 bis 168 ms, keine Budgetverstöße. Nur zur Einordnung, nicht gerechnet.
- Build-Protokoll: für den heutigen Build auf Port 3000 liegt E6-PRUEFER-C-build-nachtrag.log (22:25 UTC) vor. Das Paket nennt E6-PRUEFER-C-build.log als Build-Protokoll für Port 3000. Dieses gehört zum früheren Stand.
- git status zeigt eine nicht von mir angelegte, unversionierte Datei: _werkstatt/protokolle/E6-PRUEFER-C-animationen-nachtrag.log. Ich habe sie nicht angefasst.

## Teil 5b · Register-Nachprüfung

Protokoll: _werkstatt/protokolle/E6-PRUEFER-C-register-nachtrag.md. Repo-Stand: src/ und Werkzeuge seit 2cdcbab unverändert (git diff leer). Port 3000 geprüft, Port 3100 nicht benutzt.

1. Die 13 Registerbefunde (§3 von E6-PRUEFER-C-register.md), Stand jetzt:
- Behoben im Code (3): Befund 8 sm24-scrub-x aus globals.css entfernt (grep ohne Treffer). Befund 10c site-header.tsx:193 jetzt quick, Trefferzähler artikel-liste.tsx:156 quick. Befund 10d schliessplan.tsx:446,452,464,466 jetzt duration-base ease-standard.
- Gedeckt durch Eintrag (12): Befund 1 zutritt-signal durch B-27; 2 zylinder-mass durch B-27 (namentlich); 3 schliessplan durch B-27 und B-14; 4 profilschnitt aufdecken durch B-27; 5 tuer-schutz durch B-27; 6 Funk-Bögen durch B-21; 7 Fräserrad durch B-01 (WAAPI rotate linear, fraesbahn-bewegung.tsx:136-141); 9 durch B-28 (site-header 171, mobile-action-bar 66), B-29 (termin-auswahl 140,175), B-08 (Megamenü-Pfeil 163); 10a B-05 quick = button.tsx:18; 10b B-16 animate-schleier-ein = Code; 11 durch B-17 und B-20 (erstes Anzeigen); 13 durch B-04 (120 ms je Stelle, schluessel-nach-vorlage/page.tsx:353).
- Offen (1): Befund 12 ist eine Messlücke (menue-ein, schublade-ein, Schritt-Keyframes, Hover/Fokus, B-13 im Lauf nicht erfasst; transitionstart 0 in allen Ansichten). Einträge sind vorhanden.

2. Animationen (EXIT1, EXIT2, EXIT3 je 0): Desktop H01-H12, Mobil H01-H12, Desktop ALLE_U. Unbekannte Keyframes: 0 in allen drei Läufen. Jeder beobachtete Keyframe und die 3 WAAPI-Einträge (g.sm24-fade, path.stroke-foreground, g am Fräser) sind einem Eintrag B-01 bis B-29 zugeordnet. Keiner ohne Eintrag. Protokoll: _werkstatt/protokolle/E6-PRUEFER-C-animationen-nachtrag.log; JSON unter /root/sm24-bilder/e6-c/animationen-nachtrag-*.json.

3. Stichprobe Übergänge (15 Stellen aus 150 Zeilen grep, 15 Ordner): 12 passen, 1 teilweise (mobile-action-bar.tsx:58 Farbwechsel quick nicht in B-28), 1 Befund (flow-shell.tsx:90 transition-colors ohne Dauer-Token, kein eindeutiger Eintrag), 1 eng zugeordnet (controls.tsx:93 als B-06). Liste im Protokoll Abschnitt 3.

Neue Abweichungen Text gegen Code (nicht in den 13):
- N-1: zutritt-signal.tsx:299,306 sm24-dash bis 2,0 s, Gruppe mit 0,45 s Verzögerung, Ende ca. 2,45 s. B-27 sagt je Zeichnung höchstens 1,6 s.
- N-2: schluessel.tsx:167 Funk-Bögen 1,0 bis 1,2 s, B-21 nennt 1,6 s.
- N-3: site-header.tsx:149 öffnet Megamenü per onMouseEnter, B-08 nennt nur Klick und Tastatur.
- N-4: flow-shell.tsx:90 ohne Dauer-Token (Tailwind-Standard 150 ms).
- N-5: mobile-action-bar.tsx:58 Farbwechsel nicht in B-28.

Nicht geprüft in diesem Nachtrag: Build-Protokoll 2cdcbab, funktionsliste.mjs Tastatur-Eingeben, Teile 1 bis 4. Keine Projektdatei geändert, nichts committet, keine Sperrdatei, nichts gelöscht.

**Auffällig:**

- Befund 12 offen: Übergänge (menue-ein, schublade-ein, Schritt-Keyframes, Hover/Fokus, B-13) werden im Lauf nicht erfasst; transitionstart 0 in allen Ansichten (E6-PRUEFER-C-animationen-nachtrag.log)
- Befund 1 (zutritt-signal): gedeckt durch B-27, aber Dauer überschritten. Funk-Bögen 1,6/1,8/2,0 s (zutritt-signal.tsx:299), Signalstrich 2 s (:306), Gruppenverzögerung 0,45 s, Ende ca. 2,45 s; B-27 nennt je Zeichnung höchstens 1,6 s
- Befund 6 (schluessel): gedeckt durch B-21, aber Text gegen Code. B-21 nennt 1,6 s, Code schluessel.tsx:167 setzt 1,0/1,1/1,2 s
- Befund 9 teilweise: mobile-action-bar.tsx:58 Farbwechsel der Beschriftung duration-quick nicht im Text von B-28 (Markierung ist gedeckt)
- Stichprobe Übergänge: flow-shell.tsx:90 transition-colors ohne Dauer-Token (Tailwind 150 ms), kein eindeutiger Registereintrag (Befund)
- N-3: site-header.tsx:149 öffnet das Megamenü per onMouseEnter, B-08 nennt als Auslöser nur Klick und Tastatur
- Behoben und verifiziert: Befund 8 (sm24-scrub-x entfernt, grep leer), 10c (site-header.tsx:193 quick), 10d (schliessplan.tsx 446/452/464/466 duration-base)
- Build-Protokoll 2cdcbab, funktionsliste.mjs Tastatur-Eingeben und Teile 1 bis 4 nicht geprüft (außerhalb von Teil 5)

## Teil 6 · Ergebnis

Ergebnisdatei nicht geschrieben (Systemregel).

KOPF: Port 3000 = 2cdcbab (22:25 UTC). Teile 1, 2, 4 liefen gegen addae34 (13:54/13:58 UTC); Messung "jetzt" gilt dafuer. Nachtrag 2cdcbab: Klassen, Registertexte, funktionsliste.mjs; Nachlauf aktuell. Arbeitsbaum: ungemessene Aenderungen in src/components/layout (heute 08:42 UTC).

T1 (E0 | E5 | jetzt): Typ 0 | 0 | 0. Lint 0/0 | 1 Fehler, eb5cda6 behoben | 0/0. Unit 31/31, 680 | 66/66, 1150 | 71/71, 1204. DB 7/7, 52 (alle drei). Build 198 | 208 | 208 (addae34, 2cdcbab). Funktionsliste 14/14 (alle drei). Tastatur: kein Vergleich | kein Vergleich | 7/7 je Geraet (Erstlauf 6/7). Wertesuche 707/10 (Basis b49fe04, nicht vergleichbar) | 0/18 | 0/20. Logik 0 abw., Textabzug 6 gleich.

T2 (mobil, Median; E0h>E5>jetzt): LCP ms: H01 980>1072>1112, H02 984>1152>1104, H03 944>1052>1080, H04 924>996>968, H05 1064>1100>1056, H06 1032>1060>1080, H07 976>1020>1028, H08 988>1052>1168, H09 1036>1020>1108, H10 2668>968>984, H11 908>956>984, H12 924>976>1004. INP ms: H01 72>168>160, H02 56>160>168, H03 64>136>160, H04 64>96>96, H05 64>144>128, H06 64>128>160, H07 64>88>88, H08 56>136>168, H09 64>128>144, H10 72>96>104, H11 56>80>112, H12 72>88>128. JS-KB: H01 246,3>300,0>231,1, H02 219,1>237,1>217,5, H03 219,1>240,9>228,4, H04 227,0>242,5>226,0, H05 234,9>252,3>236,0, H06 234,9>255,8>235,7, H07 210,0>230,5>219,1, H08 248,5>262,8>268,5, H09 222,2>247,9>226,3, H10 231,0>262,0>243,4, H11 217,0>239,9>234,1, H12 212,6>244,9>177,9. CLS: H10 0,117>0,000>0,007, H11 0,104>0,007>0,010, sonst 0. Konsole, Ueberlauf, Bewegung: 0/nein in allen; axe jetzt 0/0. Fehlgeschl. Anfragen Desktop: E0 14, E5 16, jetzt 7.

T3 (ALLE_U): Konsole 0. Fehlgeschl. Anfragen: gleichschliessende 1, service-und-termin 3, standorte-berlin 2, elektronische 2, vor-ort 1. Ueberlauf nein, axe 0/0, Bewegung 0.

T4 (Bildrate mobil, Median aus 5, %): H01 (1800 ms) 0,0|0,0|2,5|6,6|0,8, Median 0,8. H02 6,4|17,1|8,0|4,5|14,5, Median 8,0 UEBER. H05 7,3|4,5|14,4|3,6|6,2, Median 6,2 UEBER. H08 9,9|8,0|19,1|8,1|22,7, Median 9,9 UEBER. H09 3,6|4,5|5,3|5,5|5,4, Median 5,3 UEBER (knapp). H12 2,7|0,0|4,5|0,0|0,0, Median 0,0, Selektor 0x0 px. U-STANDORTE 4,5|4,5|1,8|1,8|1,8, Median 1,8. E5 H01 26,6 % (1600 ms); E0 ohne Bildrate.

KRITERIEN (nur Messergebnis):
Z-02: Schwellen eingehalten; Vorbehalt F-01 Erstlauf. Belege: build-nachtrag, test-unit, test-db, funktionsliste-nachtrag (.log).
Z-05: Schwelle verfehlt, grosse Momente mobil 4 von 7 ueber 5 %. Reduziert 0 Befunde. Register offen. Belege: bildrate, bewegung-reduziert, register-nachtrag.
Z-06: 1 Datei mit Befund (icon.svg); lucide 0; doppelte id 0. Beleg: svg.log.
Z-07: axe ernst/kritisch 0 auf allen Hauptansichten (E0 26/4); Tastatur 7/7 je Geraet; Vorbehalt F-01. Belege: a11y, tastatur-*-nachtrag.
Z-08: Median-Budgets eingehalten; mobil Verschlechterung ueber E0-Spanne bei LCP 10 von 12, INP 11 von 12. Belege: messung-2026-10-17_16-46-12.json, _16-50-26.json.
Z-09: Ueberlauf nein (69 Laeufe); Rand-Elemente und Ueberdeckungen vorhanden. Beleg: bildsatz.log.

BUDGET-VERSTOESSE: keine am Median (24 Serien), kein Einzellauf ueber Budget; Grenzfall INP 200 ms H08 mobil (Lauf 2). E0 heute: H10 mobil LCP 2668, CLS 0,117; H11 mobil CLS 0,104. E5: keine.

AXE SERIOUS/CRITICAL: jetzt keine. E0: target-size (ernst, 24 Auswertungen); button-name (kritisch) H04, H07 mobil; label (kritisch) H06 mobil und Desktop, #foto-ms-01-camera, #foto-ms-01-gallery; scrollable-region-focusable (ernst) H08 mobil, .table-scroll; color-contrast (ernst) H09 Desktop, .text-3xl. E5: keine.

NICHT BESTANDEN: Nachlauf keine (14/14, Tastatur 7/7). Erstlauf Tastatur F-01 mobil und Desktop, inkl. Wiederholung (4 von 4): Menge 2 zeigt 12, Zwischensumme 78,72 statt 16,00 EUR. Nachlauf BESTANDEN. Ursache ungeklaert (funktionsliste.mjs in 2cdcbab geaendert).

REGISTER OFFEN: Befund 12 Messluecke (menue-ein, schublade-ein, sm24-schritt, Hover/Fokus, B-13). N-1 zutritt-signal.tsx:294-306: bis 2,0 s, Ende ca. 2,45 s, B-27 nennt 1,6 s. N-2 schluessel.tsx:167: 1,0 bis 1,2 s, B-21 nennt 1,6 s. N-3 site-header.tsx:149 onMouseEnter, B-08 nennt nur Klick. N-4 flow-shell.tsx:90 ohne Dauer-Token. N-5 mobile-action-bar.tsx:58 nicht in B-28. Behoben: 8, 10c, 10d. Unbekannte Keyframes 0.

SVG: 1 Datei mit Befund (icon.svg, Kommentar). Unbenannt 0, doppelte id 0, lucide 0. Familien: Icons 16 bis 88, Grafiken 0 bis 8.

Z-08 UEBERSCHREITUNGEN (mobil, jetzt minus E0 heute; Spanne in Klammern): LCP 10 von 12: H01 +132 (72), H02 +120 (36), H03 +136 (12), H04 +44 (12), H06 +48 (12), H07 +52 (28), H08 +180 (20), H09 +72 (40), H11 +76 (16), H12 +80 (12). INP 11 von 12: H01 +88 (8), H02 +112 (8), H03 +96 (16), H04 +32 (0), H05 +64 (16), H06 +96 (16), H07 +24 (16), H08 +112 (16), H09 +80 (16), H11 +56 (0), H12 +56 (24). H10 INP +32 (Spanne 32): erfuellt. CLS keine. Desktop n. b.

ABWEICHUNGEN: Wertesuche 20 (E5 18), neu code-fundstelle.test.tsx. Bildrate H01 bei 1800 ms (E5 1600). Rand-Elemente Haupt 279 (E5 201).

**Auffällig:**

- Tastatur F-01 Erstlauf mobil und Desktop NICHT BESTANDEN (4 von 4, Menge 2 zeigt 12). Nachlauf BESTANDEN. Ursache offen; funktionsliste.mjs in 2cdcbab geaendert, nicht geprueft. Belege: E6-PRUEFER-C-tastatur-mobil.log, -tastatur-desktop.log, -tastatur-mobil-nachtrag.log, -tastatur-desktop-nachtrag.log.
- Bildrate mobil ueber 5 %: H02 8,0; H05 6,2; H08 9,9; H09 5,3 (knapp). Gemessen am Stand addae34 mit 1600 ms. H01 mit 1800 ms (E5 1600 ms, 26,6 %). Beleg: E6-PRUEFER-C-bildrate.log, bildrate-*.json.
- Z-08 mobil: LCP 10 von 12 und INP 11 von 12 ueber E0-Spanne. Messung gegen addae34, nicht 2cdcbab; nicht wiederholt (Entscheidung Endpruefer). Desktop nicht bewertbar, kein E0-Desktoplauf heute. Beleg: E6-PRUEFER-C-messung-auswertung.md.
- Einzelbilder H12 (/ratgeber/autoschluessel-verloren-was-tun) und U-SERVICE (/service-und-termin): 0 Animationen, Element 0 x 0 px, je 10 byte-gleiche leere Bilder (763 Byte). Schritt 2 nicht bestanden; Bildrate H12 nur eingeschraenkt aussagekraeftig. Belege: E6-PRUEFER-C-einzelbilder.log, /root/sm24-bilder/e6-c/einzelbilder/H12/, /root/sm24-bilder/e6-c/einzelbilder/U-SERVICE/.
- Register offen: Befund 12 (Uebergaenge menue-ein, schublade-ein, sm24-schritt-*, Hover/Fokus, B-13 vom Lauf nicht erfasst). N-1 bis N-5 (Dauer- und Textabweichungen). Beleg: E6-PRUEFER-C-register-nachtrag.md.
- src/app/(site)/icon.svg mit Kommentar; laut Protokoll auch feste Hex-Farben und ids sm24-grad, sm24-key (Hinweis, kein Tool-Befund). Z-06 damit nicht vollstaendig. Beleg: E6-PRUEFER-C-svg.log.
- Befund 10c: site-header.tsx:193 quick ist in 2cdcbab gesetzt; artikel-liste.tsx:156 war bereits in addae34 quick. Im Arbeitsbaum liegt site-header.tsx inzwischen anders (siehe naechster Punkt); Nachtrag bezieht sich auf 2cdcbab.
- Arbeitsbaum: unversionierte Aenderungen in src/components/layout/site-header.tsx (416 Zeilen), layout.tsx, page-header.tsx, page-header.test.tsx seit 08:42 UTC heute; AGENTS.md (M); E7-WERKZEUG-01.md untracked. Nicht von mir, nicht gemessen, nicht geprueft.
- Konsole: fehlgeschlagene Anfragen (net::ERR_ABORTED, RSC-Vorabrufe /autoschluessel/anfrage?_rsc und /service-und-termin/anfrage?_rsc): Hauptansichten Desktop 7, ALLE_U 9. Ursache nicht untersucht. Beleg: E6-PRUEFER-C-konsole.log.
- Sichtung Teil 2 (Bilder von mir nicht erneut angesehen): Bodenleisten ueberdecken unteren Erstbildinhalt (H07 Summenleiste ueber Versandtext; H04 und sicherheitstechnik-sicherheitscheck Aktionsleiste); H02-Kachel '02 Funkschluessel' und Chip 'Widerruf und Rueckgabe' (rechtliches-agb, -impressum) am rechten Rand abgeschnitten; service-und-termin Zeitleisten-Hilfslinien kreuzen Beschriftungen.
- Inhalt: rechtliches-agb und rechtliches-impressum zeigen [Platzhalter: ...]-Markierungen und den Hinweis 'vor dem Livegang juristisch geprueft'.
- Bildsatz gekappt (--max 6): gleichschliessende-zylinder (m 6/14, t 6/10, d 6/10), service-und-termin (m 6/12, t 6/8, d 6/9), autoschluessel-schluesselbart-fraesen (m 6/8), elektronische-zutrittsloesungen (m 6/14, t 6/9, d 6/8). Nicht nachgeholt.
- Rand-Elemente mobil: H01 73, H02 82, H08 60 (E5 3), H05 7 (E5 1); ALLE_U service-und-termin 33 (gekappt). Technischer Befund, nicht gewertet. Beleg: E6-PRUEFER-C-bildsatz.log.
- Wertesuche: 20 Ausnahmen (E5 18), neu code-fundstelle.test.tsx (rgb(, oklch(). E0-Zahl 707 nicht vergleichbar (anderer Basisstand).
- Z-08 Desktop: E0-Desktoplauf heute fehlt; Ausgangswert 15.10. liefert nur LCP und CLS, ohne INP Desktop.
- Teil 1 Erstlauf fiel in ein fremdes Messfenster (13:56 UTC); Bestandsprotokolle nicht wiederholt.
