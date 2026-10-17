# E6-PRUEFER-C · Berichte der Teile 1, 3 und 5 (erster Lauf)

Wörtlich aus dem Journal des Workflows `wf_b30ac901-56c` übernommen (Rückgabe der Prüfer). Teil 2, 4 und 6 dieses Laufs lieferten keinen Bericht.

## Teil 1 · Bestand (Lauf gegen addae34)

GEÄNDERTE DATEIEN
Keine Projektdatei geändert, nichts committet. Geschrieben nur Protokolle E6-PRUEFER-C-* unter /home/user/schluesselmacher24/_werkstatt/protokolle/: typecheck.log, lint.log, test-unit.log (überschrieben, siehe GEMEINSAME DATEIEN), test-db.log, logik.log, textabzug.log, werte.log, werte.json, build-pruefung.log, agents-status.log. Sperre /tmp/sm24-messfenster.lock weder gesetzt noch gelöscht (Teil 1 sieht sie nicht vor).

WAS UND WARUM
Teil 1, Schritte 1 bis 9 nacheinander, mit den Befehlen aus dem Paket. Keine Deutung.

PRÜFUNG UND ERGEBNIS
| Prüfung | jetzt | E5 | E0 | Beleg |
|---|---|---|---|---|
| 1 Typprüfung (tsc --noEmit) | EXIT 0, 0 Fehler | 0 Fehler, EXIT 0 | 0 Fehler | /home/user/schluesselmacher24/_werkstatt/protokolle/E6-PRUEFER-C-typecheck.log |
| 2 Lint (eslint .) | EXIT 0, 0 Fehler, 0 Warnungen | 0/0 | 0/0 | …/E6-PRUEFER-C-lint.log |
| 3 Unit (vitest run) | 71/71 Dateien, 1204/1204 Tests, EXIT 0 | 66/66, 1150/1150 | 31/31, 680/680 | …/E6-PRUEFER-C-test-unit.log |
| 4 DB-Tests als ubuntu (runuser, Wrapper /home/ubuntu/sm24-pg/vitest-wrapper/vitest.db.wrapper.mjs) | 7/7 Dateien, 52/52 Tests, EXIT 0 | 7/7, 52/52 | 7/7, 52/52 | …/E6-PRUEFER-C-test-db.log |
| 5 Logikwächter | 15 Dateien, 0 abweichend, EXIT 0 | 15 Dateien, 0 abweichend | kein Wert | …/E6-PRUEFER-C-logik.log |
| 6 Textabzug | 6 Seiten (agb, widerruf, impressum, datenschutz, versand-und-zahlung, cookie-einstellungen), alle gleich, EXIT 0 | – | – | …/E6-PRUEFER-C-textabzug.log |
| 7 Wertesuche (Standard, seit fcbcfb2) | Summe ohne Ausnahmen 0, mit Ausnahmen 20, 227 Dateien | 0 / 18, 217 Dateien | 707 / 10, 196 Dateien seit b49fe04 (andere Basis) | …/E6-PRUEFER-C-werte.log, …/E6-PRUEFER-C-werte.json |
| 8a Build-Protokoll | Compiled successfully 29,7 s, Generating static pages 208/208, EXIT 0 (Zeile 129) | – | 198/198 | …/E6-PRUEFER-C-build.log |
| 8b Port 3000 (kein SM24_BASIS_URL), BUILD_ID ioEc-kqx02foJIJl-5kn3 | / HTTP 200; /gibt-es-nicht-pruefung HTTP 404; „Hinweis für die Redaktion“ im HTML von /: 0 Treffer | – | – | …/E6-PRUEFER-C-build-pruefung.log |
| 9 git status --short AGENTS.md | leer, keine Änderung; letzter Commit für AGENTS.md da56209 | – | – | …/E6-PRUEFER-C-agents-status.log |

GEMEINSAME DATEIEN
- /tmp/sm24-messfenster.lock existiert (Inhalt „E6-PRUEFER-C“, Zeit 13:56). Gehört einem parallelen Lauf derselben Stufe, dessen bildsatz.mjs gerade läuft. Nicht angefasst.
- E6-PRUEFER-C-konsole.log und konsole-2026-10-17_15-56-50.json, konsole-2026-10-17_15-57-17.json stammen vom parallelen Lauf, nicht von mir.
- Ich habe E6-PRUEFER-C-test-unit.log überschrieben. Die Datei war im Repo versioniert (letzter Stand Commit 28f700c, WIP „ZWISCHENSTAND Prüfstufe C“). Der Vorstand ist per git show 28f700c:_werkstatt/protokolle/E6-PRUEFER-C-test-unit.log abrufbar.
- Die Läufe 1 bis 4 (Typcheck, Lint, Unit, DB) endeten 13:56:05 bis 13:57:31. Die Sperre bestand ab 13:56. Ich habe vor diesen schweren Läufen nicht geprüft, ob ein Messfenster offen ist. Die Messwerte des parallelen Laufs (vor allem Bildrate, Teil 2) könnten dadurch gestört sein. Ab jetzt führe ich keine schweren Läufe mehr aus.
- Port 3001 (next dev, seit ca. 47 min) läuft; von mir nicht benutzt.

BILDBELEGE
Keine. Teil 1 erzeugt keine Bilder, unter /root/sm24-bilder/e6-c/ wurde nichts geschrieben.

OFFENE FRAGEN
1. Wertesuche: Das Standardwerkzeug zählt nur Dateien seit fcbcfb2 (227 Dateien). Die E0-Zahl 707 bezieht sich auf b49fe04 mit 196 Dateien und ist damit nicht direkt vergleichbar. Ein Lauf mit --seit b49fe04 wurde nicht ausgeführt, da Teil 1 nur den Standardbefehl vorsieht.
2. Gegenüber E5 kommen 2 Ausnahmen hinzu (18 auf 20): code-fundstelle.test.tsx mit rgb( und oklch(. Beide liegen unter src/components/visual/generators/ und sind damit Ausnahmen nach Regel.
3. Die Konsolen- und Bildsatzprotokolle des parallelen Laufs sind noch nicht vollständig, Teil 2 ist nicht Teil meines Auftrags.

=== ENDE E6-PRUEFER-C · BEREIT ZUR RÜCKGABE ===

**Auffällig:**

- Messfenster-Konflikt: /tmp/sm24-messfenster.lock (Zeit 13:56) gehört einem parallelen Lauf; meine schweren Läufe (Typcheck, Lint, Unit, DB) endeten 13:56:05 bis 13:57:31 und überschnitten sich damit möglicherweise mit dessen Messung. Die Sperre habe ich vorher nicht geprüft.
- Versionierte Logdatei überschrieben: E6-PRUEFER-C-test-unit.log war im Repo (Commit 28f700c, WIP Prüfstufe C) und ist durch meinen Lauf geändert (git status M).
- Wertesuche ohne Ausnahmen 0 gegen E0 707 nicht vergleichbar: Standardbasis fcbcfb2 mit 227 Dateien; E0 war b49fe04 mit 196 Dateien.
- Wertesuche Ausnahmen 20 gegenüber E5 18: zusätzlich code-fundstelle.test.tsx (rgb(, oklch().
- Build-Protokoll: einzige Zeile mit ⨯ ist „turbopackServerFastRefresh“ unter „Experiments“, kein Fehler; Build EXIT 0, 208/208.
- Unit-Tests 71 Dateien / 1204 Tests (E5 66/1150, E0 31/680); DB-Tests 7/7 und 52/52 wie E0 und E5.
- Port 3001 (next dev) läuft seit ca. 47 min; von mir nicht benutzt.

## Teil 3 · Funktionsliste und Tastatur, erster Lauf

GEÄNDERTE DATEIEN
Keine Projektdatei geändert. Geschrieben nur Protokolle in /home/user/schluesselmacher24/_werkstatt/protokolle/: E6-PRUEFER-C-funktionsliste.log, E6-PRUEFER-C-tastatur-mobil.log, E6-PRUEFER-C-tastatur-desktop.log, dazu die Werkzeugprotokolle funktionsliste-2026-10-17_16-11-11.md/.json (Vollauf), funktionsliste-2026-10-17_16-19-27.md/.json (Tastatur mobil), funktionsliste-2026-10-17_16-20-39.md/.json (Tastatur desktop), funktionsliste-2026-10-17_16-20-55.md/.json (Wiederholung F-01 mobil), funktionsliste-2026-10-17_16-21-10.md/.json (Wiederholung F-01 desktop). Bilder unter /root/sm24-bilder/e6-c/schritte. Nichts committet, nichts gelöscht, Sperre nicht gesetzt.

WAS UND WARUM
Teil 3 ausgeführt: Vollauf F-01 bis F-14 gegen Port 3000, Tastaturläufe mobil und desktop für F-01, F-02, F-04, F-05, F-06, F-07, F-08, je NICHT BESTANDEN einmal wiederholt. Der Vollauf wartete auf die Messfenster-Sperre (von Teil 2 gehalten), lief ab 14:09:52 UTC. Zwei von mir gestartete Warte-Hintergrundprozesse wieder gestoppt.

PRÜFUNG UND ERGEBNIS
Vollauf: 14 von 14 BESTANDEN. Protokoll: /home/user/schluesselmacher24/_werkstatt/protokolle/funktionsliste-2026-10-17_16-11-11.md, Log E6-PRUEFER-C-funktionsliste.log.
Ergebnis je Funktion:
- F-01 BESTANDEN (Menge 2 = 2; Zwischensumme 16,00 €; Summe 20,95 €; Staffel 3 × 7,20 € = 21,60 €)
- F-02 BESTANDEN (Absenden als Attrappe)
- F-03 BESTANDEN (HTTP 404 ohne Zugangsschlüssel)
- F-04 BESTANDEN (13 Schritte, Absenden als Attrappe)
- F-05 BESTANDEN (5 Schritte bis Warenkorb)
- F-06 BESTANDEN (11 Schritte, Attrappe)
- F-07 BESTANDEN (vorlage 8, Sicherheitscheck 10, Zutritt 9, Service-Anfrage 5 Schritte)
- F-08 BESTANDEN (Rückmeldung „nichts gefunden“)
- F-09 BESTANDEN (Werkzeug: Speichern ja, Löschen ja; „aktiver Schalter umgelegt: nein (Komfort und Statistik deaktiviert)“)
- F-10 BESTANDEN (Weitermachen nach Neuladen ja)
- F-11 BESTANDEN (Sprunglink, Drawer, Aktionsleiste, Megamenü)
- F-12 BESTANDEN (sitemap 200, 181 loc; robots 200; llms 200; JSON-LD)
- F-13 BESTANDEN (beide Rechner, Ergebnis ändert sich)
- F-14 BESTANDEN (Filter 52 → 5)
Vorher/Nachher: content/records.json vorher und nachher nicht vorhanden; Serverlog neu 0 Zeichen, Treffer 0.

Wiederholungen: Keine NICHT BESTANDEN im Vollauf, daher keine Wiederholung mit --nur.

Abschnitt „Tastatur“ (Quellen: funktionsliste-2026-10-17_16-19-27.md mobil, funktionsliste-2026-10-17_16-20-39.md desktop)
Mobil 6 von 7, desktop 6 von 7 BESTANDEN.
- F-01 NICHT BESTANDEN auf beiden Geräten, Erstlauf und Wiederholung (4 von 4 Läufen): Menge 2 zeigt 12 (soll 2), Zwischensumme 78,72 € (soll 16,00 €), Summe 83,67 €, Menge 3 zeigt 85,28 € (soll 21,60 €). Eintrag erscheint ja, Entfernen zeigt „leer“ ja.
- F-02, F-04, F-05, F-06, F-07, F-08 BESTANDEN auf beiden Geräten.

Tabelle (Bedienungen / Tab-Schritte / ohne sichtbaren Fokus):
| F-Nr | mobil | desktop |
| F-01 | 5 / 25 / keine | 5 / 35 / keine |
| F-02 | 13 / 40 / keine | 13 / 49 / keine |
| F-04 | 33 / 457 / keine | 33 / 591 / keine |
| F-05 | 6 / 60 / keine | 6 / 73 / keine |
| F-06 | 42 / 474 / keine | 42 / 591 / keine |
| F-07 | 98 / 1028 / keine | 98 / 1281 / keine |
| F-08 | 3 / 9 / keine | 3 / 14 / keine |
Ohne sichtbaren Fokus: keine in allen 14 Zeilen.
Wiederholungen F-01: funktionsliste-2026-10-17_16-20-55.md (mobil) und funktionsliste-2026-10-17_16-21-10.md (desktop), beide NICHT BESTANDEN.

BILDBELEGE
/root/sm24-bilder/e6-c/schritte: 62 Schrittbilder aus den Läufen.

GEMEINSAME DATEIEN
- /tmp/sm24-messfenster.lock: nicht von mir gesetzt oder gelöscht. War um 13:59 UTC vorhanden (Teil 2), um 14:09 UTC nicht mehr.
- git status zeigt Änderungen aus anderen Teilen (tracked: E6-PRUEFER-C-konsole.log, E6-PRUEFER-C-test-unit.log; untracked: E6-L-34-Berichte und weitere E6-PRUEFER-C-Protokolle). Nicht von mir.

OFFENE FRAGEN
Keine aus Teil 3. Die F-01-Tastaturbefunde sind nur berichtet, nicht gedeutet.

=== ENDE E6-PRUEFER-C · BEREIT ZUR RÜCKGABE ===

**Auffällig:**

- Tastatur F-01 NICHT BESTANDEN auf mobil und desktop, Erstlauf und Wiederholung (4 von 4 Läufen): Menge 2 zeigt 12 statt 2, Zwischensumme 78,72 € statt 16,00 €, Menge 3 zeigt 85,28 € statt 21,60 €. Mausbedienung im Vollauf BESTANDEN. Belege: /home/user/schluesselmacher24/_werkstatt/protokolle/funktionsliste-2026-10-17_16-19-27.md, funktionsliste-2026-10-17_16-20-39.md, funktionsliste-2026-10-17_16-20-55.md, funktionsliste-2026-10-17_16-21-10.md.
- F-09 im Vollauf BESTANDEN, die Begründung im Werkzeug nennt „aktiver Schalter umgelegt: nein (Komfort und Statistik deaktiviert)“. Beleg: /home/user/schluesselmacher24/_werkstatt/protokolle/funktionsliste-2026-10-17_16-11-11.md.

## Teil 5 · Register und SVG, erster Lauf

GEÄNDERTE DATEIEN: keine Projektdatei. Geschrieben nur: _werkstatt/protokolle/E6-PRUEFER-C-animationen.log, _werkstatt/protokolle/E6-PRUEFER-C-svg.log, _werkstatt/protokolle/E6-PRUEFER-C-register.md. JSON unter /root/sm24-bilder/e6-c/: animationen-desktop.json, animationen-mobil.json, animationen-uebrige.json, svg-haupt.json, svg-uebrige.json. Keine Sperre gesetzt (Teil 5 verlangt keine), nichts gelöscht, nichts committet.

WAS UND WARUM: Teil 5 vollständig ausgeführt. Animationen Desktop H01 bis H12, Mobil H01 bis H12, ALLE_U nur Desktop (der Teil nennt kein Gerät für ALLE_U). SVG H01 bis H12 und ALLE_U. Abgleich mit K-007 (B-01 bis B-26), lucide-grep.

PRÜFUNG UND ERGEBNIS:
- Animationen: 15 Keyframe-Namen und 3 WAAPI-Einträge beobachtet, unbekannte Keyframes 0 (E6-PRUEFER-C-animationen.log). Übergänge zur Laufzeit: 0, weil der Lauf nicht interagiert.
- Registertabelle (Vollfassung E6-PRUEFER-C-register.md, §1):
  - sm24-fade: B-09 (Akkordeon), B-23 (Ablauf), B-26 (Ort), B-01 (Fräser). Schliessplan teilweise B-14.
  - sm24-draw: B-02, B-12, B-21, B-22, B-23, B-25, B-26, B-01. Ohne oder teilweise: zutritt-signal, zylinder-mass, schliessplan, tuer-schutz.
  - sm24-reveal: B-04, B-21. Ohne: zylinder-mass, zutritt-signal.
  - sm24-pop: B-12, B-18, B-20, B-21, B-22, B-23, B-25, B-26. Ohne oder teilweise: zylinder-mass, zutritt-signal, schliessplan.
  - sm24-aufdecken: B-01 (nur Startseite genannt).
  - sm24-dash: B-21 teilweise (Funk-Bögen); zutritt-signal ohne Eintrag.
  - sm24-scrub-y und sm24-scrub-marke: B-03 (H01, H02). sm24-scrub-y auf H12: B-24.
  - sm24-lesen-aktiv: B-24. spin: B-19. schleier-ein: B-07, B-15, B-17, B-20; B-16 mit Dauerabweichung.
  - sm24-schluessel-ein, sm24-stift-heben, sm24-feder-heben, sm24-erscheinen: B-25 (/gleichschliessende-zylinder).
  - WAAPI auf H01: Fräser (g.sm24-fade) und Abheben (g) über B-01. Fräserrad (path.stroke-foreground) nur teilweise B-01.
  - Nicht beobachtet: menue-ein (B-08), schublade-ein (B-07), sm24-schritt-vor und -zurueck (B-11). sm24-scrub-x ohne Eintrag und ohne Verwendung. bounce, ping, pulse ohne Verwendung im Code.
- Übergänge (statische Stichprobe, 14 Zeilen-Stellen): überwiegend B-05, B-06, B-09, B-10 zugeordnet. Lücken und Abweichungen siehe Befunde unten.
- SVG (E6-PRUEFER-C-svg.log, svg-haupt.json, svg-uebrige.json): Dateien mit Befund: 1 (src/app/(site)/icon.svg, Kommentar). Unbenannte sichtbare SVG: 0 in allen 23 Ansichten. Doppelte id: 0. lucide-Reste: 0. Familie je Hauptansicht: Icons (data-sm24-icon) 16 bis 88, Grafiken (role=img) 0 bis 8, andere 2 bis 7 (Profillinien-viewBox, dekorativ).
- lucide: grep -rln "lucide-react" src package.json ergibt keinen Treffer (Erwartung erfüllt).

BEFUNDE (Register, Vollfassung §3 im Register-Protokoll):
1. zutritt-signal.tsx (Einstieg und Funk-Bögen, /elektronische-zutrittsloesungen): ohne Registereintrag.
2. zylinder-mass.tsx (Einstieg, H01 und /gleichschliessende-zylinder): ohne Eintrag. B-17 beschreibt nur die Live-Überblendung.
3. schliessplan.tsx (Einstieg, H01, H08, /gleichschliessende-zylinder): nur teilweise. B-14 beschreibt nur den Wechsel.
4. profilschnitt.tsx sm24-aufdecken auf H06 und /autoschluessel/schluesselbart-fraesen: B-01 nennt nur den Startseiten-Hero.
5. tuer-schutz.tsx sm24-draw der Türlinien (H09, /service-und-termin/vor-ort): B-18 nennt nur die Marken.
6. schluessel.tsx sm24-dash (Funk-Bögen, H02, H03): B-21 nennt keinen Signalstrich.
7. fraesbahn-bewegung.tsx WAAPI-Radrotation (H01): B-01 nennt das Rad nicht.
8. globals.css sm24-scrub-x: definiert, nirgends verwendet, kein Eintrag.
9. Übergänge ohne Eintrag: site-header.tsx:171, mobile-action-bar.tsx:66, termin-auswahl.tsx:140 und 175. Teilweise: site-header.tsx:163 (B-08 nennt keinen Pfeil).
10. Dauerabweichungen Eintrag gegen Code: (a) B-05 instant gegen button.tsx:18 quick. (b) B-16 base gegen code-fundstelle-interaktiv.tsx:91 quick. (c) B-20 quick gegen site-header.tsx:193 enter 600 ms. (d) B-14 base gegen schliessplan.tsx:446, 452, 464, 466 ohne Dauerklasse (150 ms).
11. schleier-ein läuft beim Laden ohne Änderung (H07 3-mal, /artikel/beispiel-schluesselkasten 1-mal). B-17 und B-20 nennen nur die Änderung.
12. Nicht erfasst im Lauf: menue-ein, schublade-ein, sm24-schritt-*, Hover- und Fokus-Übergänge, B-13 (ViewTransition in seitenwechsel.tsx).
13. Staffel 0,12 s in schluessel-nach-vorlage/page.tsx:353 ohne Eintrag (gering).

BILDBELEGE: keine Bilder in Teil 5. Belege sind die JSON-Dateien unter /root/sm24-bilder/e6-c/ und die Protokolle oben.

OFFENE FRAGEN:
- ALLE_U wurde nur am Desktop gefahren, weil der Teil kein Gerät nennt. Eine Mobil-Gegenprobe für ALLE_U fehlt.
- Befunde 1 bis 3 sind Zuordnungsfragen. Das Urteil fällt der Endprüfer. Kein Urteil über Gestaltung.

=== ENDE E6-PRUEFER-C · BEREIT ZUR RÜCKGABE ===

**Auffällig:**

- zutritt-signal.tsx (Einstieg und Funk-Bögen, /elektronische-zutrittsloesungen): sm24-reveal, sm24-dash, sm24-pop, sm24-draw ohne Eintrag in K-007 B-01 bis B-26
- zylinder-mass.tsx (Einstieg, H01 und /gleichschliessende-zylinder): sm24-reveal, sm24-draw, sm24-pop ohne Eintrag; B-17 beschreibt nur die Live-Überblendung
- schliessplan.tsx (Einstieg, H01, H08, /gleichschliessende-zylinder): sm24-draw, sm24-pop, sm24-fade nur teilweise durch B-14 gedeckt
- profilschnitt.tsx sm24-aufdecken auf H06 und /autoschluessel/schluesselbart-fraesen: B-01 nennt nur den Startseiten-Hero
- tuer-schutz.tsx sm24-draw der Türlinien (H09, /service-und-termin/vor-ort): B-18 nennt nur die Marken
- schluessel.tsx sm24-dash (Funk-Bögen, H02, H03): in B-21 nicht genannt
- fraesbahn-bewegung.tsx WAAPI-Radrotation (path.stroke-foreground, H01): in B-01 nicht genannt
- globals.css Keyframe sm24-scrub-x: definiert, im Code nicht verwendet, kein Registereintrag
- Übergänge ohne Eintrag: site-header.tsx:171 (scale-x, duration-base), mobile-action-bar.tsx:66 (scale-x, duration-base), termin-auswahl.tsx:140 und 175 (transition-colors duration-quick)
- Teilweise: site-header.tsx:163 Pfeil Megamenü rotate-180 duration-base, B-08 nennt nur Deckkraft und translateY
- Dauerabweichung B-05: instant (120 ms) im Register, button.tsx:18 nutzt duration-quick (180 ms)
- Dauerabweichung B-16: base (280 ms) im Register, code-fundstelle-interaktiv.tsx:91 nutzt animate-schleier-ein (quick)
- Dauerabweichung B-20: sm24-pop quick im Register, site-header.tsx:193 ohne Dauerangabe (enter, 600 ms)
- Dauerabweichung B-14: base im Register, schliessplan.tsx:446, 452, 464, 466 ohne Dauerklasse (Tailwind-Standard 150 ms)
- schleier-ein läuft beim Laden ohne Änderung: H07 (3-mal), /artikel/beispiel-schluesselkasten (1-mal, artikel-kauf.tsx:209); B-17 und B-20 nennen nur die Änderung
- Nicht erfasst im Lauf: menue-ein (B-08), schublade-ein (B-07), sm24-schritt-vor und -zurueck (B-11), Hover- und Fokus-Übergänge, B-13 ViewTransition (seitenwechsel.tsx)
- schluessel-nach-vorlage/page.tsx:353 sm24-reveal mit Staffel 0,12 s ohne Eintrag (gering)
- SVG-Datei mit Befund: src/app/(site)/icon.svg (Kommentar im SVG); enthält außerdem feste Hex-Farben und ids sm24-grad, sm24-key (Hinweis, kein Tool-Befund)
- Unbenannte sichtbare SVG: 0; doppelte id: 0; lucide-Reste: 0 (grep ohne Treffer)
