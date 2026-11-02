# E1-FACHKUNDLER-02 · Bericht Schließtechnik

## GEÄNDERTE DATEIEN
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/erhebung/E1-schliesstechnik-normen.md (Ergebnis, 1.770 Wörter, Abschnitte 1 bis 8)
- Neu: /home/user/schluesselmacher24/_werkstatt/ausbau/berichte/E1-FACHKUNDLER-02.md (dieser Bericht)
Keine Projektdatei geändert, nichts committet, nichts gepusht.

## WAS UND WARUM
Das Paket verlangt sechs Teilfragen mit Quelle, Abrufdatum und Belegstufe. Ergebnis: 39 Faktenzeilen mit Quelle, 37 eindeutige Quellenadressen, keine Stufe A (kein Anbietertest ausgewertet). Kernergebnisse:
- Normen: DIN 18252:2018-05 gilt. DIN EN 1303:2015-08 ist zurückgezogen. Der Nachfolger 2026-08 ist laut DIN-Seite AKTUELL, andere DIN-Seiten widersprechen. DIN EN 15684:2021-05 und VdS 2156-1:2023-10 gelten. Das Herstellerverzeichnis der Kommission Polizeiliche Kriminalprävention (KPK, Stand Januar 2025) nennt die Angriffswiderstandsklassen je Hersteller, für ABUS Pfaffenhain nur Klasse B.
- Schutz: Bohrschutz ist laut KPK Mindestanforderung. Aufsperrschutz und Schlagschutz haben keine belegte Definition.
- Not- und Gefahrenfunktion (N+G) und Freilauf (FZG) sind verschiedene Funktionen. Das Paket führte sie zusammen.
- Messen: Bezug ist die Mitte der Stulpschraube, Teilmaße folgen 5-mm-Stufen. Belegt sind 30/30 (Doppel, Steinbach) und 28 mm (Halbzylinder, Suchauszug). 27/27 und 120/120 je Seite sind nicht belegt.
- Plausibilität: Türstärke je Seite 30 bis 60 mm (Steinbach). Der Überstand von 3 mm nach DIN 18257 ist laut Fachportal ein Soll-Wert, Produktwerte liegen teils höher. Eine Regel zum Knauf auf nur einer Seite ist nicht belegt.

## GEMEINSAME DATEIEN
Keine Änderung gewünscht. Empfehlung an den Orchestrator, nicht umgesetzt: Das Mindestmaß im Konfigurator aus den Systemdaten übernehmen, nicht aus diesem Paket. N+G und Freilauf als getrennte Fragen führen.

## PRÜFUNG UND ERGEBNIS
- Robots.txt vor jedem Abruf geprüft: dinmedia.de, baunetzwissen.de, dach.assaabloy.com, docs.kentix.com und www.stuv.de erlauben die genutzten Pfade. lka.polizei-nds.de liefert 404 (keine Sperre). abus.com liefert 403, dort wurde nichts abgerufen. ABUS-Angaben stammen nur aus Suchauszügen und sind so gekennzeichnet.
- Abrufe: 14 Seiten, 8 robots.txt-Abrufe, 22 Websuchen. Alles nacheinander, höchstens ein Abruf je Sekunde. Nicht verwertbar waren eine ASSA-Seite (nur Ladeanzeige) und eine Kentix-Seite (ohne Messvorgaben).
- Das Abrufwerkzeug hat zwei PDF-Kopien lokal abgelegt: /root/.claude/projects/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/tool-results/webfetch-1793658761974-5m3cwv.pdf (KPK-Verzeichnis) und /root/.claude/projects/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/tool-results/webfetch-1793661431885-kn7rck.pdf (Steinbach-Datenblatt). Ich habe sie nur mit dem Lesewerkzeug angesehen und nichts weiter heruntergeladen. Ob sie bleiben, entscheidet der Orchestrator.
- Eine eingebettete Formatanweisung auf der DIN-Media-Seite zu VdS 2156-1 wurde nicht befolgt (Ergebnis, offene Frage 13).
- Märkte: DE oder DACH, Ausnahmen CH (ABUS) und AT (Händler). Kein US-Ergebnis verwendet.

## BELEGE
- DIN 18252:2018-05: https://www.dinmedia.de/de/norm/din-18252/286575374
- DIN EN 1303:2026-08: https://www.dinmedia.de/de/norm/din-en-1303/401073981
- DIN EN 1303:2015-08 (zurückgezogen): https://www.dinmedia.de/de/norm/din-en-1303/225357321
- DIN EN 15684:2021-05: https://www.dinmedia.de/de/norm/din-en-15684/325987131
- VdS 2156-1:2023-10: https://www.dinmedia.de/de/technische-regel/vds-2156-1/374614093
- KPK-Herstellerverzeichnis, Stand Januar 2025: https://www.lka.polizei-nds.de/download/74074/Profilzylinder.pdf
- Freilauf-Richtlinie (Fachportal): https://www.baunetzwissen.de/beschlaege/fachwissen/regeln-richtlinien/pruefrichtlinie-fuer-profilzylinder-mit-freilauffunktion-fuer-getriebeschloesser-in-fluchttuerverschluessen-7663206
- DIN 18257:2022-02 (Fachportal): https://www.baunetzwissen.de/beschlaege/fachwissen/normen-im-detail/din-18257-schutzbeschlaege-und-schutzrosetten-2396261
- Steinbach-Datenblatt PL61XX: https://stuv.de/api/de-DE/datasheet/PL61XX

## OFFENE FRAGEN
1. Status DIN EN 1303:2026-08 bestätigen, die DIN-Seiten widersprechen sich.
2. ABUS-Katalog Bravus 2000 beschaffen (abus.com liefert 403): Längen, Schutzfunktionen, N+G-Typen.
3. Aufsperrschutz und Schlagschutz: keine belegte Definition, Picking in EN 1303 ungeklärt.
4. Vorhangschloss, Möbel-, Außenzylinder und Schließeinsatz: nicht definiert.
5. Freilauf und N+G getrennt führen: Entscheidung des Projekts.
6. Überstand 3 mm: Normtext DIN 18257 nötig. Knauf-Regel belegen.
7. Händlerklassen „Kl. P 2“ und „Klasse 4“ klären. VdS-Klassen der Vollfassung 2156-1 prüfen.
Vollständige Liste mit 13 Punkten: Abschnitt 7 der Ergebnisdatei.
