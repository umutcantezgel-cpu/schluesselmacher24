# E3-GRAFIKER-07 · Berichte aus Workflow wf_a39c6e70-8a1

## Bau E3-GRAFIKER-07
GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/components/visual/README.md (neu geschrieben, 399 Zeilen; vorher 219 Zeilen). Vorher-Stand gesichert unter /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/README-vorher.md

WAS UND WARUM
- Ordner-Tabelle um glyphen/, interaktiv/ und profillinie.tsx ergänzt.
- Farben: Zustandsfarben stroke-success, stroke-danger, fill-danger-soft (von stiftzuhaltung genutzt) sowie stroke-area-strong und fill-area-strong ergänzt.
- Fach-Icons: strokeWidth 2 ist nur die Vorgabe am Bild; am Bildschirm gilt --icon-strich (1,75 px) über data-sm24-icon. 54 Dateien in icons/.
- Neuer Abschnitt UI-Glyphen: gleiche Familie, einfarbig, Standardgröße 20, Vertrag aus glyphen.test.tsx, neue Glyphen per Datei ohne Liste. Alle 39 Glyphen als Tabelle (Dateiname → Komponente).
- Neuer Abschnitt Strichskala: die sieben Namen mit Verwendung. DETAIL ist derzeit ungenutzt. Ausnahmen nach D-010 mit elf Zahlen: code-fundstelle Griff 13 und 8, Lupe 9 und 4,5, Platzhalter-Striche striche() mit Dicken 6, 3,5, 5, 5; zutritt-signal Drücker 11 und 6; schluessel Spurband 10.
- schliessplan: Parameter markiert (Schlüssel-Kennung) und tuer (Tür-Kennung) mit Vorrang, Dämpfung, Titel-Zusatz; Export schliessplanSchluessel() mit Rückgabeform.
- Neue Generatorabschnitte:
  - profilschnitt (viewBox 480 × 360): einschnitte 4–8, code liefert immer 6 Einschnitte, beschriftung, Standardprofil [2, 6, 3, 7, 1, 5], Bewegung über FraesbahnBewegung, Exporte.
  - tuer-schutz (viewBox 480 × 300): fokus mit fünf Bauteilen, nummern, Bauteil-Nummern 1–5.
  - stiftzuhaltung (Text des Grafikers übernommen und am Quelltext geprüft): zustand, einschnitte (5 Ziffern, Standard [3, 6, 2, 7, 4]), code (bis 4 Ziffern), die drei Sätze, 15 Trennlinien-Striche, Titel je Zustand. Zusatz: Bohrung 4 bleibt bei passt-nicht passend (siehe offene Fragen).
- Profillinie-Abschnitt: Props, Maße klein 10 px / Abstand 14 und groß 16 px / Abstand 20, Strich 1,5 px (= --strich), einmaliges Zeichnen.
- Client-Hüllen-Abschnitt: CodeFundstelleInteraktiv, LiveSchluessel, SchliessplanInteraktiv, FraesbahnBewegung, dazu auswahl.ts (reine Helfer) und InView. Regel: Generatoren bleiben reine Funktionen, Zustand nur in der Hülle. Geprüft: keine Generator-Datei hat 'use client' oder useState/useEffect.
- Bildstellen-Abschnitt: Rangfolge aus image-placeholder.tsx (Foto, dann Grafik, dann Fach-Icon; Grafik entfällt bei compact; Icon 32 px bei compact, sonst 72 px), Stichwörter von visualFuerMotiv, Props ausschnitt und frei. Kein Platzhaltertext.
- Bewegung: sm24-fade, sm24-schritt-vor/-zurueck, sm24-scrub-y/-x/-marke und sm24-ruhig ergänzt (belegt in globals.css, profilschnitt.tsx, accordion.tsx, flow-shell.tsx, page.tsx). InView-Zeile um fade und dash ergänzt.
- Registry: die acht Generatoren namentlich aufgeführt.

STREICHUNGEN (Liste nach Auftrag)
- Zeile sm24-float (ruhiges Schweben) gestrichen: keine Regel in globals.css, keine Verwendung im Code.
- „dann greift der neutrale Platzhalter“ ersetzt durch „dann greift der Fach-Icon-Ersatz“. ImagePlaceholder zeigt kein neutrales Feld mehr, sondern ein Fach-Icon.
- Keine Streichung bei Strichwerten oder „Bild folgt“: beides stand in der alten README nicht.

GEMEINSAME DATEIEN
- Nur gelesen, nicht geändert: generators/*.tsx, registry.tsx, generators/grafik-basis.tsx, profillinie.tsx, glyphen/*, icons/icon-base.tsx, interaktiv/*.tsx, motion/*, components/ui/image-placeholder.tsx, lib/visual/motiv.ts, src/app/(site)/globals.css, _werkstatt/KERN.md, _werkstatt/ENTSCHEIDUNGEN.md.
- Im Arbeitsbaum gerade in Änderung durch andere Arbeit (git status): generators/profilschnitt.tsx, generators/profilschnitt.test.tsx, interaktiv/fraesbahn-bewegung.tsx, interaktiv/fraesbahn-bewegung.test.tsx. Die README-Angaben entsprechen dem Stand beim Lesen.

PRÜFUNG UND ERGEBNIS
- Schnellprüfung A bestanden: alle 8 Registry-Generatoren haben einen Abschnitt; jeder Parameter am Quelltext belegt.
- Pfade per ls: alle in der README genannten Dateien existieren (icons/icon-base.tsx, icons/autoschluessel.tsx, glyphen/glyphen.test.tsx, generators/grafik-basis.tsx, generators/profilschnitt.tsx, generators/tuer-schutz.tsx, generators/stiftzuhaltung.tsx, generators/schliessplan.tsx, motion/motion-style.ts, motion/in-view.tsx, motion/reveal.tsx, motion/draw-on.tsx, motion/check-draw.tsx, interaktiv/auswahl.ts, interaktiv/fraesbahn-bewegung.tsx, interaktiv/live-schluessel.tsx, interaktiv/schliessplan-interaktiv.tsx, interaktiv/code-fundstelle-interaktiv.tsx, profillinie.tsx, bereich-icon.tsx, area-scope.tsx, registry.tsx, components/ui/image-placeholder.tsx, lib/visual/motiv.ts, lib/visual/area-theme.ts, src/app/(site)/globals.css, tailwind.config.ts, _werkstatt/KERN.md, _werkstatt/ENTSCHEIDUNGEN.md).
- Glyphen-Tabelle: 39 Einträge, per diff gegen glyphen/*.tsx deckungsgleich.
- Länge: 399 Zeilen (Grenze 400).
- Keine Code-Änderung, keine Löschung, kein Commit, kein Push. Keine Tests ausgeführt, da nur Dokumentation geändert wurde.
- Nebenbei: Ein falsch geschriebener Pfad in einem Shell-Befehl (cp/rm auf /home/tmp/x) hatte keine Wirkung; /home/tmp existiert nicht, es wurde nichts gelöscht. Eine Prüfhilfe liegt unter /tmp/claude-0/readme_glyphs.txt.

BILDBELEGE
- Keine. Reine Dokumentation; keine Grafik gerendert.

OFFENE FRAGEN
1. stiftzuhaltung: Bei zustand passt-nicht bleibt Bohrung 4 immer passend, weil ihr Versatz in VERSATZ_STUFEN 0 ist. Das README nennt es als Tatsache. Ob das gewollt ist, entscheidet Grafiker bzw. Orchestrator.
2. grafik-basis.tsx: DETAIL (0,75) ist definiert, wird aber von keinem Generator verwendet. Ob die Stufe bleibt, ist offen.
3. Ob jede der elf Zahlen-Ausnahmen nach D-010 einen Kommentar im Quelltext trägt, habe ich nicht vollständig geprüft. Das README verlangt den Kommentar.
4. profilschnitt.tsx und fraesbahn-bewegung.tsx sind im Arbeitsbaum in Änderung. Nach deren Abschluss sollten die Abschnitte Profilschnitt und Client-Hüllen gegengeprüft werden.

=== ENDE E3-GRAFIKER-07 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-GRAFIKER-07 R1
**Urteil:** nicht bestanden
- muss: Abweichung von KERN K-008 in der README als feste Regel: profilschnitt mit viewBox 480 × 360 (README Zeile 102 als 'viewBox fest', Abschnitt Zeile 195; Quelltext profilschnitt.tsx:25-26). KERN.md Zeile 189 nennt für Generatoren '480 × 270 (16:9) bzw. 480 × 300'. Die Abweichung ist nicht benannt. Entscheidung des Orchestrators nötig: KERN-Änderung mit Versionsnummer und Grund, oder Angleichung des Generators (außerhalb dieses Pakets). Bis dahin muss die README die Abweichung ausdrücklich als Ausnahme kennzeichnen.
- muss: Abweichung von KERN K-008 in der README als Props-Angabe: Profillinie groesse 'klein' mit 10 px Höhe (README Zeile 292; Quelltext profillinie.tsx:36-38, MASSE.klein.hoehe 10). KERN.md Zeile 240 verlangt 'Höhe 12–24 px'. Die Abweichung ist nicht benannt. Gleiche Entscheidung wie oben: KERN-Änderung oder Angleichung, bis dahin Ausnahme ausweisen.
- soll: README Zeile 314-315: 'Nach dem ersten Wechsel einer interaktiven Grafik trägt die Hülle sm24-ruhig'. Gilt nicht für schliessplan-interaktiv.tsx (dort kein sm24-ruhig). Vorhanden nur in code-fundstelle-interaktiv.tsx:79 und live-schluessel.tsx:35. Doku angleichen oder Hülle ergänzen.
- soll: README Zeile 297-298 (Profillinie): 'Ohne JavaScript oder bei Bewegung reduzieren steht sie sofort vollständig da.' Falsch für den Fall ohne JavaScript: profillinie.tsx:98 setzt sm24-draw ohne Pause, und die Pause in globals.css:422-423 greift nur bei aktiviertem Scripting. Ohne JS läuft die Zeichnung ab. Die README widerspricht sich damit selbst (Zeile 357-358: 'Ohne JavaScript spielen sie sofort ab'). KERN.md Zeile 159 erlaubt 'spielen sofort ab oder entfallen'. Satz korrigieren.
- soll: Ausnahmen nach D-010 ohne Kommentar im Quelltext, und die README-Regel ist enger als KERN. KERN.md Zeile 189 verlangt: Ausnahmen 'stehen als Zahl mit Kommentar'. README Zeile 137 verlangt Kommentar nur für neue Zahlen. Im Quelltext fehlt der Kommentar an 9 von 11 Stellen: code-fundstelle.tsx:103, 148, 165, 238 (striche()-Dicken 6, 3,5, 5, 5), code-fundstelle.tsx:315-320 (Griff 13/8, Lupe 9/4,5), schluessel.tsx:293 (Spur 10). Kommentar nur bei zutritt-signal.tsx:276 (Drücker 11/6). Offene Frage 3 des Baumeisters damit beantwortet. README-Regel an KERN-Wortlaut anpassen.
- soll: Ordnerregel widerspricht der Paketvorgabe. README Zeile 15 führt generators/grafik-basis.tsx als Helferdatei im Generatorordner. Die Vorgabe im Paket (Zeile 16 des Kern-Auszugs) lautet 'Hilfsdateien liegen nie in generators/'. Der Ist-Stand stützt die README: registry.test.tsx:34 schließt grafik-basis.tsx aus. KERN.md enthält die Regel nicht. Entscheidung: Paketregel korrigieren oder Ort der Helferdatei ändern.
- hinweis: README Zeile 322 nennt den Alternativtext der Foto-Stelle nur als slot.bild.alt. Der Code nutzt alt={slot.bild.alt || slot.motif} (image-placeholder.tsx, Foto-Zweig). Fallback ergänzen.
- hinweis: README Zeile 329: Stichwort 'Karte' für zutritt-signal. lib/visual/motiv.ts:31 erkennt nur zutritt, transponderleser, leser, zugangskarte, chipkarte. 'Karte' allein führt nicht zu zutritt-signal. Stichwortliste angleichen.
- hinweis: README Zeile 346: sm24-scrub-y, -x, -marke mit 'Startseite'. sm24-scrub-x ist in keinem Quelltext verwendet (nur globals.css). Die Startseite nutzt -y und -marke (page.tsx). Klasse als ungenutzt kennzeichnen.
- hinweis: Git-Zustand: Der Stand der README ist seit Commit 1b4447c in HEAD ('ZWISCHENSTAND'). Der Commit bündelt Dateien der Pakete E3-BAUMEISTER-01, -02, -03. Der Arbeitsbaum ist bis auf eine fremde untracked Datei sauber. Die Prüfung gilt daher für HEAD. Die untracked Datei _werkstatt/protokolle/werte-suche-2026-10-16_05-29-05.json entstand vor meiner Prüfung und ist nicht Teil dieses Pakets.
- hinweis: Die vier werte-suche-Funde in der README (Zeilen 27, 68, 69) sind dokumentierte Verbote (Text 'rgb(', 'oklch(', 'hsl('), keine Farbwerte. Falsch positiv.
- hinweis: Offene Fragen des Grafikers, nicht Prüfbefund: (a) stiftzuhaltung: Bohrung 4 bleibt bei passt-nicht immer passend (VERSATZ_STUFEN[3] = 0, stiftzuhaltung.tsx:69). Die README nennt das als Tatsache; ob gewollt, entscheidet der Orchestrator. (b) grafik-basis.tsx:20 DETAIL ist definiert und ungenutzt. Ob die Stufe bleibt, ist offen.
- hinweis: Eigene Scratch-Dateien außerhalb von Scratchpad und Projekt: /root/glyph_actual_pairs.txt, /root/readme_tab_pairs.txt, /root/x_glyph_expected.txt, /root/readme_paths.txt. Bei der Prüfung angelegt, nicht gelöscht, nicht im Projekt. Die Prüfprotokolle liegen unter /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/pruefung-r1/.

**Schritte:** Prüfung E3-GRAFIKER-07 (Prüfstufe A, Runde 1) gegen /home/user/schluesselmacher24/src/components/visual/README.md (399 Zeilen).

1 Schreibrechte und Arbeitsbaum: git status zeigt nur die fremde untracked Datei _werkstatt/protokolle/werte-suche-2026-10-16_05-29-05.json. Keine Projektdatei dieses Pakets ist geändert. Die README ist seit 1b4447c in HEAD (zusammen mit Dateien anderer Pakete). Erfüllt im Arbeitsbaum; Commit-Zuschnitt ist Orchestrator-Sache.

2 Props-Verträge: Dieses Paket ändert keinen Code. Die Visual-Quelltexte sind in HEAD unverändert gegenüber dem Stand, auf den sich die README bezieht. Erfüllt (nicht zutreffend für Code). Stichproben der Importe per Grep: Generator-Dateien ohne use client, useState, useEffect. Nur interaktiv/*.tsx und motion/in-view.tsx tragen use client.

3 Einzelschritte des Pakets:
3.1 Familie und Strich (Fach-Icons, Glyphen, data-sm24-icon, --icon-strich, Glyphenliste, Regel 'neue Glyphen per Datei'): erfüllt. README 37-87; icons/icon-base.tsx:20-35 (strokeWidth 2, data-sm24-icon); globals.css:76, 260-264; glyphen/glyphen.test.tsx (Vertrag und Dateisuche). Glyphen-Tabelle README 73-88 gegen glyphen/*.tsx: 39 Einträge, deckungsgleich. Icons: 54 Dateien (57 Einträge minus icon-base.tsx, icon-base.test.tsx, icons.test.tsx).
3.2 Strichskala mit Tabelle und Ausnahmen: erfüllt in Werten und Verwendung. README 112-137; generators/grafik-basis.tsx:14-31; DETAIL ungenutzt. Die elf Ausnahmezahlen bestätigt: code-fundstelle.tsx:103, 148, 165, 238 (striche-Dicken 6, 3,5, 5, 5), 315-320 (13, 8, 9, 4,5); zutritt-signal.tsx:277-278 (11, 6); schluessel.tsx:293 (10). Kommentarregel: siehe Befund soll 5.
3.3 Abschnitt profilschnitt: Parameter und Export erfüllt, viewBox abweichend (Befund muss 1). README 195-212; profilschnitt.tsx:25-26 (480 × 360), 47 (Standard 2,6,3,7,1,5), 52-62 (FRAESBAHN, FRAESER_ABHEBEN, PROFILSCHNITT_GROESSE, PROFILSCHNITT_AUSSCHNITT 140/98/320/140), 108-110 (einschnitte 4-8, code 40 Zeichen, beschriftung), 174 (Fräsbahn 0,3 s + 1,1 s). Ausschnitt-Bemaßung: globals.css:503 blendet [data-bemassung] unter 1024 px aus.
3.4 Abschnitt tuer-schutz: erfüllt. README 214-226; tuer-schutz.tsx:25-43 (fünf Bauteile, Nummern 1-5 je Index, Zeile 262), 35-43 (fokus-Werte), 77-85 (schalter: true/false/ja/nein/1/0/an/aus), 246 (Stagger 0,3 + i × 0,12). Standardtitel tuer-schutz.tsx:88-91.
3.5 Abschnitt stiftzuhaltung (Text des Grafikers): erfüllt. README 228-247 gegen Vorlage Paket Zeile 19 übernommen; stiftzuhaltung.tsx:14-22 (viewBox 480 × 270, drei Titel), 26-47 (TRENNLINIE 136-444, Strich 14, Lücke 7 → 15 Striche), 69 (VERSATZ_STUFEN [3,7,4,0,5]), 70-71 (Standard [3,6,2,7,4]), 80-84 (code bis 4 Ziffern), 150-175 (passt-nicht, abgebrochen mit zwei tragenden Bohrungen, Reide nach links abgesetzt). Titel: stiftzuhaltung.tsx:17-21 entspricht README 246-247. Bohrung 4 bleibt bei passt-nicht passend: offene Frage (hinweis).
3.6 schliessplan um markiert, tuer und schliessplanSchluessel(): erfüllt. README 161-176; schliessplan.tsx:235-237 (system, gruppen 1-4, tueren 2-8), 257-259 (Kennungen lowercase), 306-336 (markieren: markiert hat Vorrang, tuer), 489 (Titel mit Markierung), 542-552 (Export {kennung, kuerzel, tueren}).
3.7 Profillinie (Zweck, Props, deterministisch, zeichnet sich einmal): erfüllt in Props und Verhalten. README 283-299; profillinie.tsx:34 (STRICH 1,5), 36-38 (klein 10/14, gross 16/20), Props, Zeile 98 (sm24-draw 0,6 s), Haarlinie +0,45 s. Befunde muss 2 (Höhe) und soll 4 (ohne JS).
3.8 Client-Hüllen (welche, Steuerung, Regel): teilweise erfüllt. README 301-316. Hüllen und Steuerung stimmen: code-fundstelle-interaktiv (drei Registerkarten, naechsterIndex mit Pfeilen, Home und End), live-schluessel (verzoegerung 250), schliessplan-interaktiv (systeme, anfang, tueren, gruppen; aria-live), fraesbahn-bewegung (threshold 0,5, bewegungReduziert aus lib/bewegung.ts). auswahl.ts ohne React-Import. Regel 'Generatoren sind reine Funktionen' gilt. Lücke: sm24-ruhig (Befund soll 3).
3.9 Bildstellen (Rangfolge, nie 'Bild folgt'): erfüllt. README 318-332; components/ui/image-placeholder.tsx (Foto, dann Grafik entfällt bei compact, dann Fach-Icon 32 px compact / 72 px sonst, aria-hidden). Stichwörter visualFuerMotiv: lib/visual/motiv.ts:21-61. Abweichungen: Befunde hinweis 7 und 8.
3.10 Bewegung (Klassen aus globals.css, Baumeister-Zusatz): erfüllt. sm24-fade (accordion.tsx, profilschnitt.tsx), sm24-schritt-vor/-zurueck (flow-shell.tsx), sm24-scrub-y/-marke (page.tsx), sm24-ruhig (code-fundstelle-interaktiv.tsx:79, live-schluessel.tsx:35), sm24-dash (schluessel.tsx, zutritt-signal.tsx). sm24-scrub-x ungenutzt (hinweis 9). sm24-float: keine Regel, keine Verwendung (gestrichen, im Bericht genannt).
3.11 Registry mit acht Generatoren namentlich: erfüllt. README 271-272; registry.tsx:24-33 (REGISTRY mit acht Einträgen); registry.test.tsx:34 (Filter grafik-basis).
3.12 Streichungen (nach Auftrag, im Bericht genannt): erfüllt. Vergleich mit HEAD~1 (219 Zeilen): entfallen sind sm24-float und der neutrale Platzhalter (ersetzt durch Fach-Icon-Ersatz). Keine weitere Regel ohne Nennung entfernt.
3.13 Schnellprüfung: alle 8 Registry-Generatoren haben einen Abschnitt (README 139-247). Jeder Parameter am Quelltext belegt (3.3-3.6, Stichproben). Alle Dateipfade der README existieren (Existenzprüfung; Nicht-Pfade wie Glob, Relativimport, Klasse fill-area/20 und Route ausgenommen). Länge 399 Zeilen (Grenze 400). Erfüllt.
3.14 Keine Code-Änderung, keine Löschung, kein Commit, kein Push durch dieses Paket: erfüllt (Stand des Arbeitsbaums und HEAD).

Ergebnis: zwei muss-Befunde zur KERN-Abweichung (Profilschnitt-viewBox, Profillinie-Höhe). Diese brauchen eine Orchestrator-Entscheidung. Alle anderen Anforderungen sind belegt.

**Prüfungen:** Schnellprüfung und Zusatzläufe (Protokolle unter /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/pruefung-r1/):

- tsc --noEmit: exit 0, 0 Fehler.
- eslint src/components/visual: exit 0, keine Meldungen.
- vitest run src/components/visual: 20 Testdateien, 712 Tests bestanden, exit 0. Enthält auch profilschnitt- und fraesbahn-bewegung-Tests, die im Baumeister-Bericht als in Änderung galten; sie sind inzwischen committet und grün.
- Werte-Suche README (werkzeuge/werte-suche.mjs): 4 Treffer in Zeilen 27, 68, 69 (rgb(, oklch(, hsl(). Das sind dokumentierte Verbote, keine Werte (falsch positiv). Werte-Suche auf den visual-Quelltexten ohne Tests: 0 Treffer.
- grep lucide-react in src/components/visual: 0 Treffer.
- Glyphen-Tabelle README Zeilen 73-88 gegen glyphen/*.tsx: 39 Einträge, diff ohne Unterschied.
- Icons: 54 Icon-Dateien in icons/ (57 Einträge minus icon-base.tsx, icon-base.test.tsx, icons.test.tsx).
- Generatoren: 8 Dateien mit Test (*.test.tsx), 8 Registry-Einträge, alle mit Abschnitt im README.
- Dateipfade der README per Existenzprüfung: alle vorhandenen Pfade gefunden.
- README-Länge: 399 Zeilen (Grenze 400).
- Logikwächter (photo-upload): nicht zutreffend für dieses Paket.
- Bildläufe bild.mjs: nicht durchgeführt. Das Paket nennt keine Ansichten, es ist reine Dokumentation.
- Stand git: HEAD 1b4447c, Arbeitsbaum sauber bis auf die fremde untracked Datei _werkstatt/protokolle/werte-suche-2026-10-16_05-29-05.json (vor meiner Prüfung entstanden).
- Es wurden keine Projektdateien geändert, nichts gelöscht, nichts committet oder gepusht.

## Reparatur E3-GRAFIKER-07 R1
GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/components/visual/README.md (399 Zeilen, Grenze 400)

WAS UND WARUM
Runde-1-Befunde in der README bearbeitet. Quelltext ist nicht verändert, weil die Schreibrechte nur die README umfassen.
1. Muss: K-008-Abweichungen als Ausnahme gekennzeichnet.
   - profilschnitt: Raster 480 × 360 (Quelltext profilschnitt.tsx:25-26) weicht von KERN (480 × 270 bzw. 480 × 300) ab. Ausnahme in Zeile 101 und im Abschnitt profilschnitt (Zeile 207).
   - profillinie: groesse klein 10 px (profillinie.tsx:36-38) weicht von KERN (Höhe 12–24 px) ab. Ausnahme im Props-Abschnitt (Zeile 297).
   - Die Entscheidung KERN-Änderung mit Versionsnummer oder Angleichung des Generators liegt beim Orchestrator.
2. Soll: sm24-ruhig (Hüllen-Abschnitt Zeile 313-314, Klassentabelle Zeile 347). Die Angabe nennt jetzt code-fundstelle-interaktiv und live-schluessel. schliessplan-interaktiv und fraesbahn-bewegung tragen die Klasse nicht.
3. Soll: Profillinie ohne JavaScript (Zeile 298). Die Zeichnung läuft ohne JS ab, weil profillinie.tsx:95-98 sm24-draw ohne Gating setzt und die Pause in globals.css nur bei aktiviertem Scripting greift. Bei „Bewegung reduzieren“ steht sie sofort vollständig da, mit ruhig entfällt die Zeichnung.
4. Soll: Ausnahmen-Regel (Zeile 136) an KERN-Wortlaut angeglichen (Ausnahme nach D-010 als Zahl mit Kommentar). Der Ist-Stand wird ausgewiesen: nur zutritt-signal.tsx:276 ist kommentiert, an neun der elf Zahlen fehlt der Kommentar.
5. Nicht geändert: Ordnerregel (Zeile 15, grafik-basis.tsx im generators-Ordner). Die Paketregel „Hilfsdateien nie in generators/“ steht nicht in KERN.md, nur im Paket. Entscheidung offen.
6. Einleitungsabsatz auf 399 Zeilen gekürzt, Inhalt unverändert.

GEMEINSAME DATEIEN
- src/components/visual/README.md: im Arbeitsbaum geändert, in HEAD seit 1b4447c zusammen mit Dateien anderer Pakete. Commit-Zuschnitt beim Orchestrator. Kein Commit, kein Push, keine Löschung durch dieses Paket.

PRÜFUNG UND ERGEBNIS (Schnellprüfung, Runde 2)
- Arbeitsbaum: git status zeigt nur die README als geändert, die fremden untracked Protokolle sind unberührt. Diff: 10 Zeilen ersetzt, 10 eingefügt. Eine eigene temporäre Hilfsliste im Repo-Wurzelverzeichnis wurde nach Gebrauch selbst entfernt.
- Länge: 399 Zeilen (höchstens 400). Erfüllt.
- Pfade: Alle Dateipfade aus Backticks per Existenzprüfung gefunden. Keine Nicht-Pfade im Sinne von Dateien (`*.test.tsx`, `<title>`, `fill-area/20`, `index.ts` als Negation). components/ui/image-placeholder.tsx liegt unter src/components/ui/. Erfüllt.
- Registry: Die acht Generatoren haben je einen Abschnitt (139–247). In dieser Runde nicht neu gezählt, Abschnitte unverändert.
- Quelltext-Belege erneut bestätigt: profilschnitt.tsx:25-26, profillinie.tsx:36-38 und 95-98, globals.css:418-424 (Pause nur bei scripting enabled), sm24-ruhig nur in code-fundstelle-interaktiv.tsx:79 und live-schluessel.tsx:35, Ausnahmekommentar nur zutritt-signal.tsx:276.
- KERN.md 159, 189, 240 bestätigt; Regel „Hilfsdateien nie in generators/“ nicht in KERN.md.
- Gesamt: Befunde in der README bearbeitet. Die beiden Muss-Befunde (K-008-Abweichungen) sind als Ausnahme ausgewiesen, die Entscheidung ist offen. Schnellprüfung bestanden.

BILDBELEGE
- Keine. Das Paket liefert Text, keine Bilder.

OFFENE FRAGEN
1. MUSS, Orchestrator-Entscheidung: profilschnitt-Raster 480 × 360 gegen KERN K-008 (480 × 270 bzw. 480 × 300). KERN-Änderung mit Version und Grund, oder Angleichung des Generators (außerhalb dieses Pakets). Bis dahin als Ausnahme in der README.
2. MUSS, Orchestrator-Entscheidung: Profillinie klein 10 px gegen KERN K-008 (12–24 px). Gleiche Entscheidung wie Punkt 1.
3. SOLL, offen: Ordnerregel. Paketregel korrigieren oder grafik-basis.tsx an einen anderen Ort verlegen (Code außerhalb dieses Pakets).
4. SOLL, offen: Kommentare an den Ausnahmezahlen im Quelltext fehlen an neun der elf Stellen: code-fundstelle.tsx:103, 148, 165, 238; code-fundstelle.tsx:315-320; schluessel.tsx:293. Nachtrag durch einen Baumeister, nicht durch dieses Paket.

=== ENDE E3-GRAFIKER-07 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-GRAFIKER-07 R2
**Urteil:** bestanden
- soll: K-008-Abweichung profilschnitt: Raster 480 × 360 (/home/user/schluesselmacher24/src/components/visual/generators/profilschnitt.tsx:25-26) liegt außerhalb der K-008-Vorgabe 480 × 270 bzw. 480 × 300 (_werkstatt/KERN.md:189). Die README dokumentiert die Abweichung korrekt als Ausnahme (README Zeile 101 und 207). Der Fehler liegt im Quelltext, nicht im Paket. Entscheidung offen: KERN-Änderung mit Version oder Angleichung des Generators. Der Orchestrator muss sie vor Abnahme der Welle treffen. Lehnt er die Abweichung ab, ist die Korrektur im Quelltext fällig, nicht in der README.
- soll: K-008-Abweichung profillinie: groesse klein 10 px (/home/user/schluesselmacher24/src/components/visual/profillinie.tsx:39) liegt außerhalb der Vorgabe Höhe 12–24 px (_werkstatt/KERN.md:240, K-008a). Die README dokumentiert die Ausnahme korrekt (README Zeile 297). Gleiche offene Entscheidung wie beim Profilschnitt, beim Orchestrator.
- soll: Ordnerregel nicht belegt: README Zeile 14 nennt generators/grafik-basis.tsx als Ort der gemeinsamen Helfer, und das Paketdokument führt die Regel „Hilfsdateien liegen nie in generators/“ als Kern-Auszug. Diese Regel steht weder in _werkstatt/KERN.md noch in _werkstatt/ENTSCHEIDUNGEN.md (grep ohne Treffer). Der Paketauszug zitiert also etwas, das im KERN nicht steht. Offen: Regel korrigieren oder die Datei an anderen Ort verlegen (Code außerhalb dieses Pakets).
- soll: Kommentare an den Ausnahmezahlen fehlen an 9 von 11 Stellen (README Zeile 136 weist das korrekt aus): code-fundstelle.tsx:103 (6), 148 (3,5), 165 (5), 238 (5), 315 (13), 316 (8), 319 (9), 320 (4,5); schluessel.tsx:293 (10). Kommentiert ist nur zutritt-signal.tsx:276 für 11 und 6. K-008 (_werkstatt/KERN.md:193) verlangt den Kommentar. Code außerhalb dieses Pakets.
- hinweis: Der Bericht nennt den Einleitungsabsatz „gekürzt“. Tatsächlich ist nur umgebrochen worden. Die README hatte in HEAD ebenfalls 399 Zeilen, und der Wortlaut ist identisch. Es gab also keine inhaltliche Streichung, und das Wort „gekürzt“ sollte im Bericht korrigiert werden.
- hinweis: Die Strichskala-Tabelle nennt bei MARKE nur code-fundstelle (README Zeile 124). MARKE wird auch in zutritt-signal.tsx:138 und :177 verwendet.
- hinweis: Die Liste der Bildstellen-Stichwörter (README Zeile 329) nennt „Karte“ als Schlüsselwort für zutritt-signal. In src/lib/visual/motiv.ts:31 gibt es dieses Wort nicht allein, sondern nur zugangskarte und chipkarte. Riegel und band (motiv.ts:39) fehlen in der Liste für tuer-schutz.
- hinweis: Die Werte-Suche meldet 4 Treffer in der README (Zeile 26 rgb( und oklch(, Zeile 67 rgb(, Zeile 68 hsl(). Es sind Regeltext-Beispiele für verbotene Farbfunktionen und keine Farbwerte. Das ist eine Falschmeldung des Werkzeugs für Dokumente, kein Paketfehler.
- hinweis: Der Arbeitsbaum enthält Änderungen außerhalb der Schreibrechte dieses Pakets: _werkstatt/werkzeuge/LIESMICH.md und _werkstatt/werkzeuge/bewegung.mjs (M) sowie untracked Protokolle in _werkstatt/protokolle/. Dieses Paket hat sie nicht angelegt, soweit die Prüfung zeigt. Zuordnung beim Orchestrator. Außerdem importieren 50 Dateien in src (außerhalb von src/components/visual) lucide-react, in src/components/visual sind es 0. Das ist Restbestand außerhalb dieses Pakets.

**Schritte:** Prüfung E3-GRAFIKER-07, Runde 2, gegen /home/user/schluesselmacher24/src/components/visual/README.md (399 Zeilen). Keine Projektdatei geändert, nichts committet.

Schreibrechte: git status zeigt im Paketbereich nur src/components/visual/README.md als geändert. Quelltext unverändert, daher keine Props-Verträge verändert. Aufrufer (registry.tsx, interaktiv/, ImagePlaceholder) unberührt, Stichprobe per Import-Grep.

Schritt 1 (Paket und Quellen lesen): erfüllt. Stichproben am Quelltext: grafik-basis.tsx:13-27 (Strichskala), profilschnitt.tsx:25-26 und :101-110, profillinie.tsx:17-41 und :78-100, registry.tsx:34-43, stiftzuhaltung.tsx:24-70 und :134-138, tuer-schutz.tsx:17-18, :25-40, :77-90, schliessplan.tsx:235-237, :306-338, :542-557, schluessel.tsx:29 und :410-416, zylinder-mass.tsx:24-69, code-fundstelle.tsx:25 und :264-266, zutritt-signal.tsx:25 und :212-214, motion/motion-style.ts, src/app/(site)/globals.css:76, :260-264, :418-424, :468-475, :493-503, components/ui/image-placeholder.tsx, lib/visual/motiv.ts:10-50.

Schritt 2a (Familie und Strich, Glyphenliste, Regel für neue Glyphen): erfüllt. README Zeilen 36-86. Die 39 Glyphen-Dateien stimmen mit den 39 Tabelleneinträgen überein (Namen per Diff geprüft). data-sm24-icon in icons/icon-base.tsx:30, --icon-strich 1,75 px in globals.css:76. Regel Zeilen 63-65, glyphen.test.tsx liest den Ordner selbst. 54 Fach-Icons (ohne icon-base und Tests), Angabe Zeile 56 stimmt.

Schritt 2b (Strichskala mit Ausnahmen): erfüllt. README Zeilen 111-136. Werte DETAIL 0,75 bis MARKE 4 stimmen mit grafik-basis.tsx:13-27 überein. Die elf Ausnahmezahlen sind gezählt (Zeilen 131-134). DETAIL wird in keinem Generator verwendet (Grep ohne Treffer). Einsatz von MARKE unvollständig, siehe Befund.

Schritt 2c (Abschnitt profilschnitt): erfüllt. README Zeilen 194-212. Alle Parameter belegt: einschnitte 4-8 (ziffern 4,8), code 40 Zeichen, beschriftung mit false/nein/0, Standardprofil [2,6,3,7,1,5] (Zeile 47). Exporte PROFILSCHNITT_GROESSE, PROFILSCHNITT_AUSSCHNITT (140, 98, 320 x 140), FRAESBAHN (0,3 / 1,1), FRAESER_ABHEBEN in Zeilen 52-62. Titel Zeile 131. Ausnahme dokumentiert (Zeilen 101 und 207).

Schritt 2d (Abschnitt tuer-schutz): erfüllt. README Zeilen 214-226. Bauteile 1 bis 5 in der Reihenfolge von oben nach unten (Zeilen 25-32). Fokus-Werte und nummern-Werte (ja/nein/1/0/an/aus) in Zeilen 35-40 und 77-85. Bewegung 0,3 s plus 0,12 s je Bauteil (Zeilen 246 und 279). Titel Zeilen 88-90. 480 x 300 in Zeile 17-18.

Schritt 2e (Abschnitt stiftzuhaltung, Text des Grafikers übernommen): erfüllt. README Zeilen 228-247. Zustände, Standard passt, einschnitte (5 Ziffern, Standard [3,6,2,7,4]), code (bis 4 Ziffern, sonst entfällt) und der Satz zu passt, passt-nicht und abgebrochen stimmen mit stiftzuhaltung.tsx:24-70, :134-138 und :152 überein. Bohrung 4 hat Versatz 0 (VERSATZ_STUFEN Zeile 69). Trennlinie aus 15 Strichen (Zeile 38 und :166-167). Bewegung k * 0,04 s und Fugen ab 0,3 s je 0,12 s (:297, :335). Einsatz nach D-012 bestätigt (ENTSCHEIDUNGEN.md:84-88).

Schritt 2f (schliessplan um markiert und tuer, schliessplanSchluessel): erfüllt. README Zeilen 160-175. markieren() in schliessplan.tsx:306-338 (Vorrang schluessel vor tuer, unbekannte Kennungen ohne Wirkung, Titel-Text kuerzel). schliessplanSchluessel in :542-557 liefert {kennung, kuerzel, tueren}, sortiert. Verwendung in interaktiv/schliessplan-interaktiv.tsx:5.

Schritt 2g (Profillinie): erfüllt. README Zeilen 283-299. Props, Standardwerte und Maße (klein 10/14, gross 16/20) in profillinie.tsx:17-41. Zeichnung einmal mit delay + 0,45 s für die Haarlinie (:98, :117). ruhig entfernt die Zeichnung (:80, :95-98). Ohne JavaScript läuft sie ab, weil die Pause in globals.css:422 nur bei scripting enabled greift. Das stimmt.

Schritt 2h (Client-Hüllen): erfüllt. README Zeilen 301-316. Hüllen und auswahl.ts vorhanden (interaktiv/, motion/in-view.tsx). sm24-ruhig nur in code-fundstelle-interaktiv.tsx:79 und live-schluessel.tsx:35 (grep). Regel globals.css:418-420. Schliessplan und fraesbahn tragen es nicht (grep).

Schritt 2i (Bildstellen): erfüllt. README Zeilen 318-332. Rangfolge Foto, dann Fachgrafik (visual oder visualFuerMotiv), dann Fach-Icon (72 px, 32 px bei compact) in image-placeholder.tsx. ausschnitt und frei stimmen. Bild folgt nur als Verbot (Zeile 332). Kleine Abweichung bei den Stichwörtern, siehe Befund.

Schritt 3 (jeder Parameter am Quelltext): erfüllt für alle Tabellen (schluessel, zylinder-mass, schliessplan, code-fundstelle, zutritt-signal, tuer-schutz, stiftzuhaltung, profilschnitt, profillinie). Zwei Aussagen nur stichprobenartig geprüft: Messregel bei zylinder-mass (Zeile 158) und Tastatur bei code-fundstelle (Zeile 26 in der Quelle).

Schritt 4 (Pfade per ls): erfüllt. Alle Backtick-Pfade existieren: src/components/ui/image-placeholder.tsx, src/lib/visual/area-theme.ts, src/lib/visual/motiv.ts, _werkstatt/ENTSCHEIDUNGEN.md, src/app/(site)/globals.css, icons/autoschluessel.tsx, icons/schluessel-nach-code.tsx, icons/icon-base.tsx, glyphen/haken.tsx, glyphen/pfeil-links.tsx, glyphen/glyphen.test.tsx, generators/grafik-basis.tsx, generators/schluessel.tsx, interaktiv/auswahl.ts, interaktiv/code-fundstelle-interaktiv.tsx, interaktiv/live-schluessel.tsx, interaktiv/schliessplan-interaktiv.tsx, interaktiv/fraesbahn-bewegung.tsx, motion/in-view.tsx, motion/reveal.tsx, motion/draw-on.tsx, motion/check-draw.tsx, motion/motion-style.ts, profillinie.tsx, bereich-icon.tsx, area-scope.tsx, registry.tsx, registry.test.tsx. Kein index.ts im Ordner visual (nur als Verbot genannt).

Schritt 5 (Länge und Grenzen): erfüllt. 399 Zeilen (Grenze 400). Keine Code-Änderung. Streichungen: keine inhaltlichen, siehe Befund zum Wort gekürzt.

Bilder: Das Paket nennt keine Ansichten. Ein bild.mjs-Lauf war nicht vorgesehen und wurde nicht ausgeführt.

Hilfsdateien: Mein eigener Test legte kurzzeitig zwei Hilfsdateien im Home-Verzeichnis an und entfernte sie wieder. Die Protokolle liegen im Scratchpad.

**Prüfungen:** Schnellprüfung (Runde 2), Zahlen:

- tsc --noEmit (gesamtes Projekt): Exit 0, 0 Fehler, 0 in src/components/visual. Protokoll: /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/r2/tsc.log
- eslint src/components/visual: Exit 0, 0 Meldungen. Protokoll im selben Ordner: eslint-visual.log
- vitest run src/components/visual: 20 Dateien bestanden, 712 Tests bestanden, 0 fehlgeschlagen. Protokoll: vitest-visual.log
- werte-suche (README): 4 Treffer, alle im Regeltext (Zeilen 26 zweimal, 67, 68), 0 Ausnahmen. Die Treffer sind Falschmeldungen des Werkzeugs für Dokumente. JSON: /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/r2/werte-suche.json
- grep lucide-react: in src/components/visual 0 Treffer. In src insgesamt 50 Dateien (außerhalb des Pakets, Restbestand nach K-008a). Die Zahl gilt für die Projektdateien, nicht für dieses Paket.
- Glyphen: 39 Dateien, 39 Tabelleneinträge, Namen identisch.
- Fach-Icons: 54 Dateien (Zeile 56 stimmt).
- Bereichs-Icons: BEREICH_ICONS mit 9 Schlüsseln, AreaKey hat 9 Bereiche (bereich-icon.tsx:20-30).
- Registry: 8 Generatoren, jeder mit Abschnitt (README Zeilen 138-247).
- Ausnahmen-Zählung: 11 Zahlen im Quelltext (7 Doppelstrich/Spur plus 4 Platzhalter-Striche), 2 davon kommentiert (zutritt-signal).

Gesamturteil: bestanden. Kein muss-Befund. Die zwei K-008-Abweichungen (profilschnitt 360 px, profillinie klein 10 px) sind korrekt als Ausnahme dokumentiert. Sie sind eine Entscheidung des Orchestrators über den Quelltext und nicht ein Fehler dieses Pakets. Erklärt der Orchestrator die Abweichung für unzulässig, liegt die Korrektur im Quelltext, nicht in der README. In diesem Fall wäre das Urteil neu zu fassen. Die übrigen Befunde sind soll oder hinweis.

Keine Abweichung im Paketumfang: Die README wurde nur in den Zeilen geändert, die der Baumeister angibt. Die Änderungen sind in git diff nachvollziehbar (10 Zeilen ersetzt, 10 eingefügt, Zeilenzahl 399 vorher und nachher).
