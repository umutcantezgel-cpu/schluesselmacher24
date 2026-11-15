# FA-SEO-02 · Bericht

Stand: 2026-11-15 · Rolle Prüfer · Modell Haiku · Sitzung 013c22e5 · kein git

## GEÄNDERTE DATEIEN

- `_werkstatt/ausbau/werkzeuge/onpage.mjs` (neu, nachgebessert)
- `_werkstatt/ausbau/werkzeuge/onpage.test.mjs` (neu, nachgebessert)
- `_werkstatt/ausbau/protokolle/onpage.json` (neu, letzter Vollauf, siehe unten)
- `_werkstatt/ausbau/berichte/FA-SEO-02-onpage.md` (neu, letzter Vollauf)
- `_werkstatt/ausbau/berichte/FA-SEO-02.md` (dieser Bericht, mit Abschnitt NACHBESSERUNG)
- Außerhalb der Schreibrechte, nach Einrichtung Abschnitt 11 (Lauf-Schritt des Pakets, schon im ersten Lauf): `/root/sm24-werkzeuge` mit `node_modules` und die Verknüpfung `_werkstatt/ausbau/werkzeuge/node_modules`. Die Werkzeuge brauchen davon nichts.
- `_werkstatt/ausbau/protokolle/datenweiche.log` wird durch `sicher.sh` bei jedem Lauf fortgeschrieben.

Nicht geändert: `src`, `content`, `scripts`, Server, Build, Quelltext. Der Server auf Port 3000 lief durchgehend; es wurde nicht neu gestartet und nicht gebaut.

## WAS UND WARUM

`onpage.mjs` ist das Werkzeug aus dem Paketauftrag. Es liest `/sitemap.xml` des laufenden Servers (und verschachtelte Sitemaps), ergänzt die Startseite und prüft jede Adresse:

- Abrufe nur an localhost (G1). Der HTML-Text wird in einem Chromium ohne JavaScript ausgewertet; jede andere Adresse wird im Browser abgefangen. Keine Änderung an Daten, keine Formulare, keine Mails (G5).
- 21 Einzelprüfungen, jede mit Gewicht, Quelle und Schalter (`--aus id,id`). Die Quelle steht im Code je Prüfung.
- Titel: Die Breite wird wie in `snippet.mjs` gemessen (20px Arial, canvas.measureText im vorhandenen Chromium, höchstens 580 px). Das ist die Schwelle des Projekts (LAGEBILD Abschnitt 4). Die 60 Zeichen gelten nur als Rückfall, wenn keine Messung möglich ist. Im Schriftcheck liefert `fc-match Arial` Liberation Sans, metrisch gleich (Protokoll des Snippet-Laufs). Die Beschreibung bleibt bei 120 bis 160 Zeichen (Schwelle des Projekts).
- Seitenübergreifend: doppelte Titel und Beschreibungen, Seiten ohne eingehenden internen Verweis, `robots.txt` erreichbar und mit Sitemap-Zeile, Sitemap erreichbar, keine fremden Adressen, keine Fehleradressen in der Sitemap.
- Interne Verweise: alle eindeutigen internen Ziele je Seite. Ziele aus der Sitemap gelten ohne Abruf; ihr Status wird auf ihrer eigenen Seite geprüft. Alle anderen Ziele werden per HEAD abgerufen; nur bei 405 folgt ein GET. Status 4xx oder Fehler ist rot, 3xx ist gelb.
- noindex gilt nur für Adressen, die in der Sitemap stehen. Außerhalb der Sitemap ist die Prüfung nicht zutreffend.
- Ankertext: zugänglicher Name in der Reihenfolge aria-label, Text, title, Bild-alt. Bilder hinter einem aria-hidden-Element zählen nicht.
- Wert je Seite: Summe Gewicht mal Anteil (ok 1, gelb 0,5, rot 0) geteilt durch das Gewicht der bewerteten Prüfungen. Das ist eine eigene Ableitung, kein Seobility-Score. Der Wert wird ungerundet mit der Grenze verglichen; die Anzeige rundet mit einer Nachkommastelle ab.
- Rückgabewerte: 0 alle Seiten auf oder über der Grenze und kein roter seitenübergreifender Befund; 1 mindestens eine Seite darunter oder ein roter seitenübergreifender Befund; 2 Bedienfehler; 3 technischer Fehler. Die Regel steht im Kopfkommentar und im Protokoll.
- Ausgabe: `protokolle/onpage.json` (alle Werte) und `berichte/FA-SEO-02-onpage.md` (Zusammenfassung, Tabelle je Seite, seitenübergreifende Befunde).

`onpage.test.mjs` enthält 60 Fälle (vorher 49): kleine HTML-Beispiele für jede Prüfung, dazu Bewertung, Rundung, Rückgabewert, Abschalten, 404 und ein lokaler HTTP-Server für die HEAD-Prüfung. Ausführung mit `node --test`, ohne Server für die HTML-Fälle.

## PRÜFUNG UND ERGEBNIS

Alle Prüfungen über die Datenweiche (`sicher.sh --json --als-root --`):

1. Selbsttest: `node --test onpage.test.mjs`: 60 von 60 bestanden, 0 fehlgeschlagen.
2. Vollauf über alle Seiten (letzter Lauf, Protokoll und Bericht stammen davon): Exit 1. 130 Seiten, Median 98,2. Seiten unter 95: 4, alle vier mit HTTP 404 (siehe unten). Die übrigen 126 Seiten liegen auf oder über 95. Rote Befunde 4, gelbe Befunde 143. Seitenübergreifend: 1 roter Befund (Sitemap enthält 4 Fehleradressen).
3. Häufigste Befunde im letzten Lauf: Titel über 580 px (gelb) auf 96 Seiten; Beschreibung außerhalb 120 bis 160 Zeichen (gelb) auf 47 Seiten; Statuscode 404 (rot) auf 4 Seiten.
4. Rückgabewert: `--nur /kasse` ergibt Exit 1 wegen des Werts 93,5; `--nur /kasse` meldet noindex als „nicht zutreffend, nicht in der Sitemap“ (vorher falsch rot). `--grenze 200` ergibt Exit 2 (Bedienfehler). Danach wurde der Vollauf erneut ausgeführt; die Protokolle stammen von diesem Vollauf.
5. Alt-Prüfung: auf keiner Seite ein img-Element (Protokoll: 188 von 188 nicht zutreffend im ersten Lauf, 130 von 130 im letzten; Probe mit curl auf / und /autoschluessel: 0 img). Die Prüfung blieb daher leer und wurde nicht bewertet. Bilder in CSS oder SVG prüft sie nicht.

Zum Ziel „über 95, möglichst 98“: Die offenen Snippet-Befunde kommen zuerst. 96 von 130 Seiten haben einen Titel über 580 px, und 47 Seiten haben eine Beschreibung außerhalb 120 bis 160 Zeichen. Der eigene Wert zeigt nicht, ob das Seobility-Ziel erreicht ist. Er ist eine eigene Ableitung, mit Gelb als halbem Abzug und ohne bekannte Seobility-Gewichtung (OFFENE FRAGE 1). Die Seiten über 95 sind kein Beleg für das Ziel.

Zwischenstand und Veränderung am Server: Der frühere Bericht nannte 188 Seiten ohne rote Befunde. Der erste Lauf der Nachbesserung (188 Seiten) hatte dagegen 52 Seiten mit HTTP 500 unter `/schluessel-nach-code/ms-*`, 10 noindex-Seiten in der Sitemap und einen Linkfehler auf `/partner-werden`. Im letzten Lauf stehen die `ms-*`-Adressen nicht mehr in der Sitemap (sie liefern weiterhin 500), und die Sitemap enthält vier 404-Adressen unter `/partner-werden/…`. Der Serverzustand hat sich also zwischen den Läufen geändert, ohne dass ich ihn neu gestartet habe. Die Ursache ist nicht sicher geklärt: In `src/app/sitemap.ts` ist unkommittiert `GEWINNUNG_SEITEN` (Partnergewinnung) ergänzt, was die 404 erklären kann. Der Befund am Server bleibt rot, bis ein Mensch ihn klärt.

## NACHBESSERUNG

Gegenprüfung der acht Befunde am Code. Alle acht trafen zu und sind behoben. Keiner war unzutreffend.

1. Titelbreite (gelb): BEHOBEN. Das Snippet-Protokoll bestätigt die Zahl: vier Titel mit 581,7 bis 636,7 px und 55 bis 60 Zeichen. `titel_laenge` misst jetzt die Breite (20px Arial, höchstens 580 px) wie `snippet.mjs`. Die 60 Zeichen gelten nur ohne Messung. Die Berichtssätze zur fehlenden Pixelmessung sind berichtigt. Der Test „Titel mit höchstens 60 Zeichen, aber über 580 px ist gelb“ und sein Gegenstück „schmal, über 60 Zeichen, unter 580 px ist ok“ sind ergänzt.
2. Rundung (gelb): BEHOBEN. `bewerte()` rundet nicht mehr; die Grenze wird ungerundet geprüft. Die Anzeige rundet ab. Test: drei gelbe Befunde mit Gewicht 1 ergeben 94,83 und liegen unter 95 (Anzeige 94,8).
3. Berichtssatz zu 95 und 98 (gelb): BEHOBEN. Die offenen Snippet-Befunde stehen zuerst, und der Bericht sagt ausdrücklich, dass der eigene Wert nicht zeigt, ob das Seobility-Ziel erreicht ist. Die Zahlen sind auf den letzten Lauf umgestellt.
4. Alt-Text-Prüfung (gelb): BEHOBEN im Bericht. Der Satz „auf keiner Seite ein img-Element, daher nicht bewertet“ steht unter PRÜFUNG UND ERGEBNIS. Die Frage zu SVG-Grafiken mit role="img" ist als OFFENE FRAGE 9 festgehalten. Im Quelltext setzt `grafik-basis.tsx` role="img" mit einem title-Element; ob jede Grafik einen nicht leeren Titel hat, prüft das Werkzeug nicht.
5. noindex außerhalb der Sitemap (gelb): BEHOBEN. `inSitemap` kommt in den Kontext; Seiten außerhalb der Sitemap sind „nicht zutreffend“. Test: noindex-Seite außerhalb der Sitemap ergibt nicht zutreffend. Probe `--nur /kasse`: noindex nicht zutreffend, Grund „nicht in der Sitemap“.
6. HEAD statt GET (gelb): BEHOBEN. `zielPruefen` ruft per HEAD ab und fällt nur bei 405 auf GET zurück. Quellentext und Kommentar stimmen mit dem Code überein. Test mit lokalem HTTP-Server: Aufrufreihenfolge HEAD, GET nach 405, dann HEAD bei 404. OFFENE FRAGE 10 benennt den Rest: Ob der Server bei HEAD eine GET-Routine ausführt, ist nicht geprüft.
7. Rückgabewert bei seitenübergreifenden roten Befunden (gelb): BEHOBEN. Exit 1 bei einem roten seitenübergreifenden Befund, nachgewiesen durch `exitCode()`-Test und den Vollauf (sitemap_fehleradressen rot, Exit 1). Die Regel steht im Kopfkommentar, im Protokoll-Markdown und in diesem Bericht.
8. Ankertext und aria-hidden (gelb): BEHOBEN. Der zugängliche Name nimmt aria-label vor dem Text. Die Bildprüfung erkennt aria-hidden auch an umgebenden Elementen (`closest`). Tests: „mehr“ mit sprechendem aria-label ist ok; ein Verweis, dessen einziges Bild versteckt ist, ist gelb; ein Bild hinter aria-hidden ohne alt ist nicht fehlend.

Prüfungen der Paketdatei über die Datenweiche: `node --test onpage.test.mjs` 60 von 60; Vollauf mit Exit 1 (Befund 7 und 4 Seiten mit 404); `--grenze 200` Exit 2; `--nur /kasse` wie oben.

## BELEGE

- Werkzeug: `_werkstatt/ausbau/werkzeuge/onpage.mjs`, Selbsttest `_werkstatt/ausbau/werkzeuge/onpage.test.mjs`
- Protokoll: `_werkstatt/ausbau/protokolle/onpage.json` (letzter Vollauf)
- Bericht je Seite: `_werkstatt/ausbau/berichte/FA-SEO-02-onpage.md` (letzter Vollauf)
- Snippet-Protokoll mit den vier Titeln über 580 px: `_werkstatt/ausbau/protokolle/snippet-2026-11-02_23-23-34.json`
- Datenweiche: `_werkstatt/ausbau/protokolle/datenweiche.log`
- Recherche: `_werkstatt/ausbau/erhebung/FA-RECHERCHE-05.md` (Abschnitte 1 bis 3, OFFENE FRAGEN 1 bis 8)
- Schwellen des Projekts: `_werkstatt/ausbau/LAGEBILD.md` Abschnitt 4
- Einrichtung: `_werkstatt/ausbau/protokolle/einrichtung.md` Abschnitt 11
- Unkommittierte Änderung der Sitemap: `src/app/sitemap.ts` (nur gelesen)

## OFFENE FRAGEN

1. Gewichtung und Teilwertung von Seobility sind nicht bekannt (FA-RECHERCHE-05, OFFENE FRAGE 1). Das Ziel „über 95 Prozent“ lässt sich damit nicht gegen Seobility prüfen. Der hier gemessene Wert ist eine eigene Festlegung, mit Gelb als halbem Abzug. Der Inhaber muss entscheiden, ob dieser Wert als Qualitätsindikator reicht.
2. Titelschwelle: Die Prüfung misst jetzt die Breite (580 px) und nimmt die 60 Zeichen nur als Rückfall. Das LAGEBILD nennt beides mit „beziehungsweise“. Ob 580 px allein gilt oder zusätzlich die Zeichenzahl, ist eine inhaltliche Entscheidung des Inhabers. 96 Seiten liegen über 580 px. Texte und Titel sind nicht Teil dieses Pakets.
3. Beschreibungslänge: Die Recherche widerspricht sich (Wiki 160 Zeichen, Blog 1850 Pixel, entsprechend 320 Zeichen). Hier gilt die Projektschwelle 120 bis 160 Zeichen. 47 Seiten liegen außerhalb. Welche Fassung Seobility aktuell nutzt, ist nicht belegt.
4. Textmenge und Größe des HTML-Dokuments haben keine belegte Schwelle. Sie werden nur angezeigt; die Seite mit den wenigsten Wörtern hat 39 Wörter im Hauptinhalt. Eine Schwelle ist eine Entscheidung, nicht ein Werkzeugwert.
5. Strukturierte Daten, Favicon, Sprache und Viewport sind als Festlegung (Stufe C) geprüft, nicht als belegte Seobility-Prüfung. Die Recherche nennt sie nicht (OFFENE FRAGE 4).
6. Anzahl der Seiten: Die Sitemap hatte beim ersten Lauf 188 Adressen, beim letzten 130. LAGEBILD Abschnitt 4 nennt 181 indexierbare Adressen aus einem früheren Stand. Welche Sitemap der Stand ist, prüft ein Mensch oder ein späterer Lauf.
7. Das Hilfe-Center von Seobility (help.seobility.net, OFFENE FRAGE 5 der Recherche) wurde nicht gelesen. Ein Abruf dort würde die Schwellen klären, liegt aber außerhalb von G1.
8. Der Server auf Port 3000 zeigt nicht gesichert den aktuellen Quelltext. Zwischen den Läufen haben sich Sitemap und Antworten geändert (52 Seiten mit 500 verschwunden aus der Sitemap, 4 Partnerseiten mit 404 hinzugekommen). Das passt zur unkommittierten Änderung in `src/app/sitemap.ts`, ist aber nicht belegt. Das Paket verbietet Neustart und Build; die Zahlen gelten für den Stand, den der Server gerade ausliefert.
9. SVG-Grafiken mit role="img": Ob jede inhaltliche Grafik einen nicht leeren `<title>` hat, prüft das Werkzeug nicht. Die Alt-Prüfung zählt nur img-Elemente.
10. HEAD-Abrufe: Ob der Server bei HEAD auf unbekannten internen Routen eine GET-Routine ausführt, ist nicht geprüft. Das HEAD-Verfahren verringert den Umfang, schließt ihn aber nicht aus.
11. Die 52 Seiten unter `/schluessel-nach-code/ms-*` liefern HTTP 500 (Fehlerseite des Next-Servers). Die Ursache liegt außerhalb dieses Pakets; ein Mensch muss sie klären, bevor die Adressen wieder in die Sitemap kommen.
