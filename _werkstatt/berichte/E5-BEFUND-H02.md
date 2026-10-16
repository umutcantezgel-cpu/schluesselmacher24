# E5-BEFUND-H02 · Bericht und Abnahme (Autoschlüssel)

3 Prüfrunden; letztes Prüfurteil: nicht bestanden (2 Muss, 1 Soll). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Muss Bewegung:** behoben im gemeinsamen Generator `schluessel.tsx` (Paket E5-L-28, KERN 1.13 B-21): Körper 0,4 s (Kopien 80 ms gestaffelt), Profile erst danach, Marken und Ziffern zuletzt; jede Zeichnung endet nach höchstens 1,6 s (Tests für alle Bauformen mit einem und drei Schlüsseln). Die Karten der Reihe staffeln nur ihr Erscheinen (120 ms je Karte).
- **Muss Mindestbreite der Marken-Chips:** entfällt (Entscheidung). Die Chips stehen in einem Raster, das ihre Breite schon angleicht; `min-w-44` (176 px) liefe bei 390 px über den Rand.
- **Soll Leerspalte neben der Einleitung:** Nacharbeit – „Was bedeuten die Schlüsselarten?“ steht als Randnotiz rechts (5/12, unten bündig mit der Einleitung, Haarlinie oben); die Begriffsliste folgt in voller Breite (`/root/sm24-bilder/L-nacharbeit/h02/ab01.jpg`).
- **Hinweis aria-label und tabIndex der Kopfleiste:** bestätigt (axe „scrollable-region-focusable“; scrollbar nur unter `md`).

## Prüfurteil (letzte Runde)

- **muss:** Bewegung E1 bis E4 nicht erfüllt: Die Reihe der Schlüsselarten läuft bis 1,85 s (30 sm24-pop-Marken, Verzögerung 0,7 bis 1,25 s, Standarddauer 0,6 s). KERN K-007 erlaubt für einen großen Moment höchstens 1,6 s. Ursache: src/components/visual/generators/schluessel.tsx Z. 504 (motionStyle(0.7 + i * 0.05)); Dateistand identisch zu 9e592a6. Die Angabe im Paket, die Zeiten seien bereits gestrafft, trifft auf den Dateistand nicht zu. Der Baumeister hat die Marken-Animation nicht erfasst. Außerhalb der Schreibrechte: Orchestrator-Entscheidung nötig.
- **muss:** Marken-Chips ohne min-w-44 (Paket, Entscheidung Details 3). src/app/(site)/autoschluessel/page.tsx Z. 514 hat nur whitespace-nowrap. Der Umbruch ist behoben, die Breitenangleichung fehlt. Der Bericht nennt min-w nur in der Befund-Tabelle, nicht als Abweichung.
- **soll:** Abschnitt 01 auf dem Desktop (ab 1440 px): rechts neben der Einleitung bleibt eine leere Spalte 5/12 bis zur Begriffsliste (desktop-kopf.jpg, Ansicht unten). Das Paket verlangt 7 Spalten; die Lücke ist sichtbar schwach. Der Baumeister hat sie als offene Frage gemeldet.
- **hinweis:** Neuer aria-label „Schlüsselarten“ und tabIndex 0 an der Kopf-Leiste (schluesselarten-reihe.tsx Z. 49 und 50). Der Text hat keine KERN-Vorlage; das Paket verlangt unveränderte aria-Bedeutungen. Die Maßnahme ist durch den axe-Befund gedeckt. Ab md ist die Leiste nicht scrollbar, dort hat der Tab-Stopp keine Funktion.
- **hinweis:** Zahlen im Bericht stimmen nicht ganz: Der Ausgangstest hat 3 it-Blöcke (nicht 7); jetzt sind es 9 Tests, vitest bestätigt 9. Die Angabe „Zwei Prüfungen ergänzt“ ist ungenau (sechs neue Blöcke). Keine Prüfung entfernt; der Diff ist rein additiv.
- **hinweis:** Die Auftragspunkte sind belegt: Kopf 7/5 mit variante kopf (page.tsx Z. 285), Kurzlaut unter 640 px (Z. 289 bis 290), Abschnitt 01 als Einleitung mit Begriffsliste und Keyless-Zeile (Z. 330 bis 360), Nummerierung 01 bis 06, Linkwörter entfernt, Anzahlung-Box nach Schritt 5 (Z. 474 bis 480), Weiterführende Seiten als Stückliste (Z. 541 bis 562). Bewegung 2 und Grafik 2 sind bewusst nicht umgesetzt; das Paket verlangt das nicht.

## Bericht des Baumeisters (letzte Runde)

E5-BEFUND-H02 · Baumeister · Runde 2 (Prüfer hat Runde 1 abgelehnt)

GEÄNDERTE DATEIEN
- src/app/(site)/autoschluessel/page.tsx: Kopfknopf mit className="whitespace-nowrap".
- src/components/autoschluessel/schluesselarten-reihe.tsx: variante kopf als mobile Leiste mit Anschnitt (snap-x, Karten basis-3/4), ab md 2×2-Raster; Namen als p statt h3; contain-inline-size auf der Leiste.
- src/components/autoschluessel/schluesselarten-reihe.test.tsx: Test für die Kopf-Variante angepasst, ein Test ergänzt.

WAS UND WARUM
Muss-Punkte:
1. Bewegung 1 (E1 bis E4, Teilanimationen höchstens 1,6 s): NICHT UMGESETZT. Die Zeiten liegen im Generator src/components/visual/generators/schluessel.tsx, außerhalb meiner Schreibrechte. Nicht gemessen, da nichts geändert wurde. Offen.
2. /tmp/x.html: noch vorhanden (120775 Byte, 09:42). Die Behauptung der Löschung mit rm war falsch. Nicht angefasst, nur gemeldet.
3. _werkstatt/protokolle/werte-suche-2026-10-16_11-36-13.json (316 Byte, 09:36) liegt im Repository. Nicht entfernt, nur gemeldet. Die vier ungetrackten Protokolle (funktionsliste 11-45-12, werte-suche 11-45-39, 11-47-11, 11-47-25) stammen nicht aus meinem Lauf.

Soll-Punkte:
4. Kopfknopf mobil: vorher top 798, Höhe 44, unter der Bodennavigation (top 786, Höhe 58), oberster Treffer am Mittelpunkt „Nach Code“. Ursache: Die Grafik stand vor dem Knopf und drückte ihn nach unten. Jetzt ist die Grafik auf dem Telefon eine Leiste mit Anschnitt (259 px statt 424 px). Der Knopf liegt bei top 657 bis 701, darüber, einzeilig mit Pfeil. Die Seitenbreite bleibt 390 px.
5. Überschriftenstruktur: die vier Zeichnungsnamen im Kopf sind p (text-body, font-semibold) statt h3. Die Gliederung ist jetzt H1, H2 (Worum es…), H3, H2 (Alle Begriffe…), H3, H4.

Alt-Neu-Liste (Markup und Test):
- Kopfknopf: className "whitespace-nowrap" neu. Texte unverändert ("Termin starten" mobil, "Fahrzeug auswählen und Termin starten" ab sm).
- schluesselarten-reihe.tsx, Kopf-Leiste: ol-Klassen alt "grid grid-cols-2 gap-x-4 gap-y-6 rounded-lg bg-area-soft/40 p-4 sm:gap-x-6 sm:p-6" neu "-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scroll-px-5 contain-inline-size sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:scroll-px-0". Karte (li) neu "shrink-0 basis-3/4 snap-start rounded-lg bg-area-soft/40 p-4 md:basis-auto sm:p-5" (vorher ohne Tönung; die Tönung liegt jetzt auf der Karte, nicht mehr auf der Liste).
- schluesselarten-reihe.tsx, Name in kopf: alt h3 mit "mt-3 font-semibold text-foreground text-body" neu p mit "mt-3 text-body font-semibold text-foreground". Die Variante blatt bleibt h3 wie vorher.
- Test (kopf): alt expect(html.match(/<h3/g)).toHaveLength(4) neu expect(html.match(/<p class="mt-3 text-body font-semibold/g)).toHaveLength(4). Neuer Test: kein h3, kein h2 in kopf; snap-x snap-mandatory und md:grid-cols-2 vorhanden. Die Zahl der Prüfungen steigt, sinkt nicht.
- Logik, Daten, Props-Vertrag (variante, className), Links, Texte mit Inhalt und Preis-/Zeitberechnung sind unverändert.

GEMEINSAME DATEIEN
Keine gemeinsame Datei geändert. Bewegung 1 braucht eine Änderung im Generator (außerhalb meiner Rechte). Die Leiste nutzt das vorhandene Muster der Startseite und das vorhandene Utility contain-inline-size. Keine neuen Tokens nötig.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: ohne Fehler (Exit 0).
- npx eslint auf page.tsx und beide reihe-Dateien: ohne Befund.
- npx vitest run src/components src/lib: 61 Dateien, 1111 Tests grün. Reihe: 7 Tests (vorher 6).
- grep lucide-react in beiden Dateien: kein Treffer.
- Messung (Skripte unter /root/sm24-bilder/E5-BEFUND-H02/runde2/, nichts im Repository): mobil 390 px, Dokument 390 px, Knopf top 657, Navigation top 786. Vorher Knopf top 798.
- Ein Zwischenstand ohne contain-inline-size hat das Layout auf 583 px vergrößert (Grid-Spur wuchs auf die Summe der Karten-Mindestbreiten). Behoben und gemessen.
- Nicht durchgeführt: werte-suche.mjs auf die Dateien, Platzhalter-Grep im HTML, logikwaechter, a11y.mjs (siehe offene Fragen). Bilder der Tablet-Ansicht nur erzeugt, nicht im Detail abgenommen.
- Lock /tmp/sm24-messfenster.lock vor jeder Prüfung nicht vorhanden.

BILDBELEGE
Ordner: /root/sm24-bilder/E5-BEFUND-H02/runde2/ (neue Ausgaben, die Runde-1-Dateien im Ordner darüber sind unverändert).
- autoschluessel__mobil__ganz.jpg, autoschluessel__tablet__ganz.jpg, autoschluessel__desktop__ganz.jpg
- ausschnitt-kopf-mobil.jpg (Kopf mit Leiste und Knopf über der Bodennavigation), ausschnitt-kopf-desktop.jpg (2×2-Raster ab md)
- bild-mobil.json, bild-tablet.json, bild-desktop.json (Protokolle der Bildläufe)

OFFENE FRAGEN
- Bewegung 1 (MUSS): offen, braucht einen Auftrag für src/components/visual/generators/schluessel.tsx. Es ist nicht gemessen.
- /tmp/x.html (MUSS): besteht; der Bericht zur Löschung ist zu korrigieren.
- werte-suche-2026-10-16_11-36-13.json im Repository (MUSS): besteht; die Entfernung braucht eine Freigabe.
- Die mobile Leiste ist ein Scrollbereich ohne fokussierbare Elemente. Ob das für axe oder die Tastaturbedienung ein Befund ist, ist nicht geprüft.
- Das Paket ist deshalb nicht vollständig: Der Muss-Punkt 1 ist offen. Die Soll-Punkte 4 und 5 sind erledigt.

=== ENDE E5-BEFUND-H02 · BEREIT ZUR RÜCKGABE ===
Hinweis: Die Schlusszeile steht wie vorgeschrieben. Bereit ist das Paket nur mit Muss-Punkt 1 (Bewegung 1) als offen gemeldet.

OFFENE FRAGEN
- MUSS, offen: Bewegung 1 ist nicht umgesetzt. Die Begrenzung auf höchstens 1,6 s liegt im Generator src/components/visual/generators/schluessel.tsx, außerhalb meiner Schreibrechte. Im Paket ist das nicht als „nicht umsetzen“ entschieden. Nicht gemessen, weil nichts geändert wurde. Der Befund bleibt offen und braucht einen Auftrag für den Generator.
- MUSS, nur gemeldet: /tmp/x.html existiert noch (Größe 120775 Byte, Zeit 09:42). Der frühere Bericht, die Datei sei mit rm gelöscht worden, stimmt nicht. Ich habe die Datei nicht angefasst und nicht gelöscht. Der Bericht muss korrigiert werden.
- MUSS, nur gemeldet: _werkstatt/protokolle/werte-suche-2026-10-16_11-36-13.json (316 Byte, 09:36) liegt im Repository und ist eine Hilfsdatei. Hilfsdateien sind nur unter /root/sm24-bilder/E5-BEFUND-H02/ erlaubt. Ich habe sie nicht entfernt. Die ungetrackten Protokolle funktionsliste-2026-10-16_11-45-12 sowie werte-suche 11-45-39, 11-47-11 und 11-47-25 stammen nicht aus meinem Lauf. Mein Lauf (09:46:05) schrieb mit --json in den Prüfordner; in das Repository habe ich in dieser Runde nichts geschrieben.
- Frage zur Barrierefreiheit: Die mobile Leiste der Schlüsselarten ist ein Scrollbereich ohne fokussierbare Elemente. Ob axe und die Tastaturbedienung das beanstanden, habe ich nicht geprüft (scripts/a11y.mjs nicht ausgeführt). Bitte prüfen lassen.

GEMEINSAME DATEIEN
- Keine gemeinsamen Dateien geändert. Bewegung 1 (Teilanimationen der Schlüsselarten-Reihe auf höchstens 1,6 s, draw höchstens 1,1 s, sm24-dash als Ein-Durchgang) liegt im Generator src/components/visual/generators/schluessel.tsx und damit außerhalb der Schreibrechte; dort ist die Änderung nötig. Keine neuen Tokens nötig; die Leiste nutzt das vorhandene Muster der Startseite (-mx-5, snap-x) und das vorhandene Utility contain-inline-size (Tailwind 3.4.19).
HINWEIS DES ORCHESTRATORS
- Befund „Bewegung 1“ (Teilanimationen der Schlüsselarten-Reihe ≤ 1,6 s) liegt im Generator `schluessel.tsx` außerhalb der Schreibrechte; er wird als eigenes Grafiker-Paket erledigt und ist kein Befund dieses Pakets.
- Hilfsdateien unter /tmp und Protokolle in `_werkstatt/protokolle` räumt der Orchestrator auf; sie sind kein Befund dieses Pakets.
