# E5-BEFUND-H08 · Bericht und Abnahme

1 Prüfrunde, Prüfurteil: bestanden. Abnahme durch den Orchestrator:

- **Bilder (eigene, nach Einscrollen mit Wartezeit):** Kopf 7/5 mit dem Schlüsselstapel; interaktiver Plan mit Wählchips in Mono (Türen unter ihrem ES), Systemtext als Reiterinhalt; „Erweiterbare Anlage“ mit zwei gestrichelten Reserveplätzen „frei“; mobil die schmale Fassung, Kürzel gut lesbar.
- **Nacharbeit:** Abschnittsnummern in Lesefolge (03 Gleichschließung, 04 Fragen, 05 Weiterlesen); Augenbraue „Weiterlesen“ statt Wiederholung des Titels „Passend dazu“.
- **Entschieden:** „Erweiterbare Anlage“ als eigenes Blatt unter dem Plan (kein fünfter Reiter: Reserve ist eine Planungsentscheidung, kein System); Info-Symbole im Reiterkopf bestätigt; Glossar 5 Spalten neben der Einleitung bestätigt; Inline-`gridTemplateColumns` der Chips (Spaltenzahl aus der Anlage, ohne Längenwert) zulässig; der Ausschnitt entfällt zugunsten der schmalen Fassung.

## Prüfurteil

- **soll:** Passend dazu: Augenbraue „05 Passend dazu“ und Titel „Passend dazu“ wiederholen dasselbe Wort direkt untereinander (page.tsx Z. 457; Desktop d_5400, mobil m_8100). Augenbraue oder Titel mit anderem Wort versehen.
- **soll:** Nummern nicht in Lesefolge: „04 Gleichschließung“ (page.tsx Z. 421) steht vor „03 Fragen“ (Z. 448). Auf Desktop und Mobil sichtbar. Reihenfolge der Abschnitte oder Nummern angleichen.
- **hinweis:** Chip-Raster per Inline-Stil gridTemplateColumns (schliessplan-interaktiv.tsx Z. 156). Der Baumeister hat es als Wunsch an KERN gemeldet; kein Tokenwert existiert, daher kein Verstoß.
- **hinweis:** Zeichen „Öffentliche Einrichtung“ (IconPruefung, page.tsx Z. 124) wirkt im Bild wie Zahnrad mit Sprechblase und sagt wenig über die Zielgruppe. Paketvorgabe ist erfüllt.
- **hinweis:** Bei elf Schlüsseln (GHS, Tab Generalhauptschlüsselanlage) stehen die Türen als freier Umbruch unter der Schlüsselreihe, ohne Zuordnung. Das Paket verlangt Ausrichtung nur für fünf Schlüssel; kein Befund, aber eine Schwäche des Musters.
- **hinweis:** Ganzseitenaufnahmen (bild.mjs --ganz) zeigen die Pläne leer, weil die Animation erst im Ansichtsfenster startet. Im Ansichtsfenster zeichnen sich Desktop-Haupt, Desktop-GHS und Tablet-Haupt vollständig; das ist kein Seitenfehler. Offene Frage 3 des Baumeisters ist damit beantwortet.
- **hinweis:** Eigene Protokolle: werte-suche hat _werkstatt/protokolle/werte-suche-2026-10-16_11-51-15.json (neu, untracked) im Repository angelegt. Mein tsc-Protokoll liegt unter /root/sm24-bilder/.tsc-h08.txt statt im Paketordner. Gelöscht habe ich nichts; Entscheidung beim Orchestrator.
- **hinweis:** Der neue Test schliessplan-interaktiv.test.tsx liegt außerhalb der exakten Schreibrechte; Schritt 3 erlaubt ihn ausdrücklich. Offene Fragen des Baumeisters: Nr. 1 (Erweiterbar als Blatt) deckt Aufgabenpunkt 2; Nr. 7 (Tür 1 in Mono) ist vom Paket gedeckt; Nr. 9 (/tmp/none.html) liegt außerhalb des Paketordners; Nr. 10 (KERN 1.8 gegen 1.11) bleibt beim Orchestrator.

## Bericht des Baumeisters

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/schliessanlagen/page.tsx
- /home/user/schluesselmacher24/src/components/schliessanlagen/system-erklaerung.tsx
- /home/user/schluesselmacher24/src/components/visual/interaktiv/schliessplan-interaktiv.tsx
- /home/user/schluesselmacher24/src/components/visual/interaktiv/schliessplan-interaktiv.test.tsx (neu, 7 Tests)
Keine Datei gelöscht, nichts committet oder gepusht. Generator, auswahl.ts, Registry und globale Dateien unverändert.

WAS UND WARUM
1. Plan mit Reiterinhalt (Befund Komposition 1). SchliessplanInteraktiv bekommt die optionale Prop details (Partial<Record<SchliessSystem, SchliessDetail>>). Die Prop ist rein additiv, Aufrufer ohne sie funktionieren wie vorher. Unter dem Plan erscheinen Name, Beschreibung, Haken und „Geeignet für“ des gewählten Systems, im tabpanel. system-erklaerung.tsx liefert systemReiter() aus den Systemeinträgen (gleichschliessung, z, hs, ghs). Die fünf Systemkarten entfallen. Die Vergleichstabelle bleibt.
2. Erweiterbare Anlage als eigenes Blatt unter dem Plan (ErweiterbareAnlage), mit Reserve-Zeichnung (reserve 2). Die Reserve steht im Generator schon bereit.
3. Schmale Fassung im Plan (Befund Grafik 2). Client-Hülle: unter 640 px die schmale Fassung (format schmal, sm:hidden), darüber die breite (hidden sm:block), gleicher key. Ausschnitt entfällt.
4. Wählchips (Befund Typografie 2, Details 1). Schlüsselreihe und Türreihe stehen übereinander, Gruppenetiketten sichtbar. Schlüsselreihe mit bis zu fünf Spalten (bei elf Schlüsseln drei Reihen zu vier), Türen unter ihrem Schlüssel (ES 1 bis 4), leere Zelle unter HS, Zentraltüren in einer Reihe darunter. Kein Umbruch der ES-4-Chips mehr.
5. Kopf (Befund Komposition 2). PageHeader mit visual (Schlüsselstapel, ohne Rahmen, 7/5). Mobil Kopf → Grafik → Knöpfe. Knopf „Systeme ansehen“ wird „Zu den Systemen“.
6. Ordnung (Befund Typografie 1). SectionHeading „04 Gleichschließung“ und „05 Passend dazu“. „Passend dazu“ als text-headline.
7. Passend dazu (Befund Details 3). Nummerierte Stückliste mit Haarlinien, Mono-Nummer, Titel, Beschreibung und Pfeil. Ganze Zeile ist der Link. „Ansehen“ entfällt.
8. Zielgruppen-Zeichen (Befund Details 2). 01 IconEinsteckschloss, 02 GlyphGebaeude, 03 GlyphPersonen, 04 IconPruefung, 05 BereichIcon area=schliessanlagen.
9. Einstieg. Das Bild wandert in den Kopf. Einleitung und Verfahrenshinweis stehen links (7), das Glossar rechts (5).
10. Mikrotexte, Alt-Neu: „Systeme ansehen“ zu „Zu den Systemen“. „Ansehen“ (6×) entfällt.
Inhalte, Datenabfragen, Metadaten, JSON-LD, FAQ-Daten, Linkziele und Fließtexte sind unverändert. Die Vergleichsdaten sind inhaltlich gleich.
Befund Grafik 2 (M05/M06 mobile Kürzel) ist durch bestehenden Code erfüllt: „schliessplan“ steht schon in SCHMALES_FORMAT, die Registry liefert die schmale Fassung.

GEMEINSAME DATEIEN
Keine gemeinsamen Dateien geändert.
Keine neuen Werte ohne Token eingeführt. Das Chip-Raster nutzt einen Inline-Stil gridTemplateColumns mit der Spaltenzahl, weil diese je System schwankt. Für KERN wäre ein Token oder eine Hilfsklasse für Wählchip-Raster sinnvoll.
Wunsch an den Orchestrator: Ein gemeinsamer Baustein für die Stückliste mit Haarlinien und Mono-Nummer. Das Muster steht hier, in Schließplan-Seite, Codeprodukt und Passende Seiten.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: Exit 0, keine Fehler.
- npx eslint auf die drei Dateien und den neuen Test: Exit 0.
- npx vitest run src/components src/lib: 61 Dateien, 1110 Tests, alle grün (darin 7 neue). Keine bestehende Prüfung gelockert oder entfernt.
- werte-suche.mjs auf die drei Dateien: null Funde.
- grep lucide-react in den drei Dateien: kein Treffer.
- HTML von http://localhost:3001/schliessanlagen: keine Platzhalter (Muster [Platzhalter, [PLZ], [Ort]). Keine Linkwörter „Ansehen“ oder „Zur Seite“.
- Bilder mobil und desktop mit --reduziert angesehen. Mobil: Kopf korrekt, Chip-Reihen passen ohne Umbruch, Tür-Reihe unter ES 1 bis 4, schmale Pläne mit Schrift etwa 11,7 px (Ziel 11,5 px). Desktop: Chip-Reihen bündig, Plan mit Reserve sichtbar, Erweiterbar-Blatt korrekt.
- Tablet-Bild nicht einzeln geprüft (siehe Offene Fragen).
- Die Lock-Datei /tmp/sm24-messfenster.lock hat nie bestanden.
- Keine Fehler in fremden Dateien festgestellt.

BILDBELEGE (alle unter /root/sm24-bilder/E5-BEFUND-H08/)
- schliessanlagen__mobil__ganz.jpg, schliessanlagen__tablet__ganz.jpg, schliessanlagen__desktop__ganz.jpg: erste Aufnahmen mit normaler Bewegung. Die Pläne sind leer, weil die sm24-draw-Animation nicht ausgelöst wurde (siehe Offene Fragen).
- warte4s__desktop__ganz.jpg: gleicher Befund nach 4 s Wartezeit.
- reduziert__desktop__ganz.jpg, reduziert__mobil__ganz.jpg: Aufnahmen mit --reduziert, zeigen den Endzustand.
- ausschnitt-desktop-plan-reduziert.png, ausschnitt-desktop-erweiterbar.png, ausschnitt-mobil-plan.png, ausschnitt-mobil-kopf.png: Zuschnitte.
- seite.html (SSR-HTML), bild-*.json (Protokolle der Aufnahmen).
- Nicht Teil des Pakets: Hilfsdatei /tmp/none.html (von mir per curl -o angelegt, Statusprüfung).

OFFENE FRAGEN
1. Erweiterbare Anlage hat keinen Reiter. Umsetzung als Blatt unter dem Plan. Bitte bestätigen oder als fünften Reiter gestalten.
2. InfoTip-Erklärungen der Systemkarten: Sie erscheinen als Symbol im Reiterkopf, Erweiterbar behält es im eigenen Blatt. Bitte bestätigen.
3. Desktop-Vollbild mit normaler Bewegung zeigt den Plan leer, obwohl das HTML die Linien enthält. Mit --reduziert ist er vollständig. Eine echte Bildschirmaufnahme mit Scrollen wäre der sichere Nachweis.
4. Tablet-Bild nicht einzeln geprüft. Bitte Aufnahme mit --reduziert gesondert ansehen.
5. Kopf-Interpretation: Glossar rechts neben Einleitung (7/5), nicht unter dem Kopf. Bitte prüfen, ob das der Absicht entspricht.
6. Mikrotexte Alt-Neu: „Systeme ansehen“ zu „Zu den Systemen“, „Ansehen“ entfällt, neue Augenbrauen „04 Gleichschließung“ und „05 Passend dazu“. Beschreibungszeilen der Weiterführend-Links bleiben erhalten (Befund nannte Nummer, Titel, Pfeil). Bitte bestätigen.
7. Türchips in Mono, Schreibweise „Tür 1“ statt „TÜR 1“. Bitte bestätigen oder umstellen.
8. Das Werkzeug werte-suche.mjs hat die Protokolldatei /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_11-43-33.json im Repository angelegt. Bitte entscheiden, ob sie bleibt.
9. Hilfsdatei /tmp/none.html von mir angelegt (nicht gelöscht, weil Löschen nicht erlaubt ist).
10. KERN-Version widersprüchlich: Paket nennt 1.11 und 1.12, der Auftrag nennt 1.8 für Änderungen am Ende von KERN.md. Gearbeitet nach den Tokens und Mustern des Kern-Auszugs im Paket.

=== ENDE E5-BEFUND-H08 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen

- Erweiterbare Anlage hat keinen Reiter (nur vier Schließsysteme im Plan). Umsetzung: eigenes Blatt unter dem Plan mit Reserve-Zeichnung (reserve 2). Bitte bestätigen oder als fünften Reiter gestalten.
- Die InfoTip-Erklärungen der vier Systemkarten (info) erscheinen jetzt als Symbol im Reiterkopf; Erweiterbar behält das Symbol im eigenen Blatt. Bitte bestätigen.
- Ausgangsbefund zum Mobilbild der Pläne (M05, M06, Kürzel 8 bis 9 px): SCHMALES_FORMAT enthält „schliessplan“ bereits und die Registry liefert die schmale Fassung. Im Ergebnis zeigt das Mobilbild Schrift etwa 11,7 px. Der Befund ist damit durch bestehenden Code erfüllt, keine Generator-Änderung nötig.
- Desktop-Vollbild mit normaler Bewegung (bild.mjs, auch --warte 4000) zeigt den Plan leer, obwohl das HTML die Linien mit sm24-draw enthält. Mit --reduziert erscheint der Plan vollständig. Vermutlich eine Eigenheit der Aufnahme, nicht des Codes; eine echte Bildschirmaufnahme mit Scrollen wäre der sichere Nachweis.
- Tablet-Bild wurde nicht einzeln angesehen (nur die Aufnahme mit normaler Bewegung existiert, dort ist der Plan leer wie im Desktop-Bild). Bitte Tablet-Aufnahme mit --reduziert gesondert prüfen.
- Interpretation Kopf: PageHeader visual mit dem Schlüsselstapel (7/5, Blickfang). Das Glossar steht rechts (5 Spalten) neben Einleitung und Verfahrenshinweis (7 Spalten), nicht unter dem Kopf. Bitte prüfen, ob das der Absicht von „Glossar rückt in 7/5 darunter“ entspricht.
- Mikrotexte Alt-Neu: Knopf „Systeme ansehen“ wird „Zu den Systemen“ (Kopf). In „Passend dazu“ entfällt „Ansehen“ (6 Mal), die ganze Zeile ist der Link. Neue Augenbrauen: „04 Gleichschließung“ und „05 Passend dazu“. Die Beschreibungszeilen der Weiterführend-Links bleiben als Text unter dem Titel erhalten (Befund nannte nur Nummer, Titel, Pfeil). Bitte bestätigen.
- Wählchips: Türen in Mono wie die Schlüssel (Schreibweise „Tür 1“ statt „TÜR 1“). Gruppen stehen übereinander (Schlüssel oben, Tür unten), Gruppenetiketten sichtbar. Türen unter ihrem ES-Chip (ES 1 bis 4), ohne Umbruch.
- Ein unerwarteter Nebeneffekt: Das Werte-Such-Werkzeug hat die Protokolldatei /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_11-43-33.json im Repository angelegt. Sie ist nicht von Hand angelegt, bitte mit dem Orchestrator abstimmen, ob sie bleibt oder nicht committet wird.
- Ich habe eine Hilfsdatei /tmp/none.html über curl -o angelegt (Inhalt nur eine Statusprüfung). Nicht gelöscht, weil Löschen nicht erlaubt ist. Bitte als Abfall im Blick behalten.
- KERN-Version widersprüchlich: Paket nennt Kern-Version 1.11 und KERN 1.12 im Kontext, der Auftrag nennt KERN 1.8 für Änderungen am Ende von _werkstatt/KERN.md. Ich habe nach den Paketregeln gearbeitet (Tokens und Muster aus dem Kern-Auszug).
- Schmale Fassung und Ausschnitt: Der bisherige Ausschnitt (schliessplanAusschnitt) entfällt in system-erklaerung.tsx und der Client-Hülle, da die schmale Fassung unter 640 px Vorrang hat. Die Funktion bleibt in der Generator-Datei erhalten.
