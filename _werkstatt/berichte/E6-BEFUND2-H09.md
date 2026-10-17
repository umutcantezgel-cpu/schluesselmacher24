# E6-BEFUND2-H09 · Bericht des Baumeisters und Urteil der Prüfstufe A

- Runden: 3 · Urteil letzte Runde: nicht bestanden
- Hinweis: Der Entwicklungsserver (Port 3001) war während des Baus abgestürzt (Turbopack-Panik); Bildbelege fehlten deshalb. Bildprüfung und Abnahme: `_werkstatt/berichte/E6-BEFUND2-welle2-abnahme.md` (D-048).

## Befunde der letzten Prüfrunde
- **muss:** Pflichtbelege fehlen, Anforderung unbelegt: Port 3001 läuft nicht (curl HTTP 000, dreimal geprüft, Lock-Datei fehlt). Nur ein älterer next-start auf Port 3000 läuft; er wurde nicht genutzt, der Server nicht gestartet. Ohne Bilder sind die Punkte 1, 2, 4, 5, 6, 7 und 8 am Bild nicht belegt; ebenso Titelüberlauf der Bereichsliste bei 1024 px, Kontrast der Bereichsicons, Zeichnungen mobil (11,5 px) und die Ansichten aus dem Paketkatalog. Kein Verstoß des Baumeisters nachgewiesen, die Abnahme ist aber nicht möglich. Wiederholung, sobald 3001 läuft.
- **soll:** Messregel Punkt 2 unbelegt: messung-A.json und messung-B.json fehlen. Variante A (page.tsx Z. 231–262) ist ohne Leerflächen-Messung bei 1440x900 und 1024x768 gewählt. Der Grund (Server aus) ist gültig, daher kein muss; die Wahl bleibt ungeprüft.
- **soll:** Bandseiten-Führung schneidet den Bolzen: BOLZEN x 40 bis 70, y 204 bis 216 (tuer-schutz.tsx Z. 53). Die Führung M46 210H34V288 (Z. 109) läuft bei y 210 von x 46 bis 40 durch den Bolzen. Das folgt dem Paketwortlaut, bleibt aber eine sichtbare Schwäche; Bildwirkung ungeprüft. Entscheidung des Orchestrators nötig (Alternative aus OFFENE FRAGEN 2).
- **hinweis:** Logikwächter nicht anwendbar: keine der sechs Dateien steht in GESCHUETZTE; pruefen meldet KEIN EINTRAG. Manueller Diff gegen d4a1d47: nur Darstellung, die reinen Funktionen Marke (page.tsx Z. 91) und legende(), Konstanten, der optionale Prop liste (rechner-bausteine.tsx Z. 46). Keine Hooks, Handler, Props-Brüche.
- **hinweis:** Kommentar an der Rechner-Hülle (page.tsx Z. 192) wurde erweitert, obwohl das Paket 'Der Kommentar Z. 204 bleibt' vorgibt. Nur Kommentartext, ohne Befund am Code.
- **hinweis:** Commit 6e4981c (Autor Claude, Meldung 'wip(gestaltung)') enthält die H09-Dateien zusammen mit Dateien anderer Pakete (u. a. warenkorb-ansicht.tsx, konfigurator, autoschluessel). Der Prüfer hat nichts committet. Zuordnung durch den Orchestrator.
- **hinweis:** Fremde Änderung im Arbeitsbaum: src/app/(site)/warenkorb/warenkorb-ansicht.tsx ist gegenüber HEAD geändert. Sie ist geschützt durch den Logikwächter, gehört nicht zu H09 und wurde nicht geprüft.

## Bericht des Baumeisters (letzte Fassung)

E6-BEFUND2-H09 · Baumeister · Nachbesserung nach Ablehnung Runde 2

VORAB
In diesem Lauf habe ich keine Datei geändert. Die Umsetzung der Punkte 1 bis 8 steht bereits im Arbeitsbaum (page.tsx, nicht gestaged) und in HEAD 6e4981c (die übrigen fünf Dateien). Ich habe den Stand gegen den Code geprüft.

Die drei Muss-Punkte sind nicht erfüllt, weil der Entwicklungsserver auf Port 3001 nicht läuft (curl HTTP 000). Das Paket verbietet, ihn selbst zu starten. Deshalb ist keiner der Punkte 1, 2, 4, 5, 6, 7 als 'Befund sichtbar behoben' belegt. Die Rückgabe ist nicht abnahmefähig.

GEÄNDERTE DATEIEN
In diesem Lauf keine. Stand der sechs Dateien: siehe Feld geaenderte_dateien.

WAS UND WARUM (je Punkt aus 'Umsetzen')
1. Komposition: erledigt im Code. page.tsx Z. 179–264. Grid Z. 182 mit lg:grid-rows-kopf (definiert als min-content 1fr). Mobile DOM-Reihenfolge: 01 (Z. 183–189), Rechner mit id orientierung (Z. 192–197), Text (Z. 199–210), Liste (Z. 213–227), Schriftfeld (Z. 231–262). Kein order-*, kein sticky. Bildwirkung nicht belegt.
2. Typografie: Variante A gebaut (page.tsx Z. 231–262: Hülle lg:col-span-12 lg:row-start-3, Textblock lg:col-span-7, dl lg:col-span-5 mit lg:border-l, dd-Link mit Zeilenpfeil Z. 246–257, Hinweis-dd Z. 258–260). Variante B nicht gebaut. Messregel NICHT erfüllt: messung-A.json und messung-B.json fehlen, die vier Messwerte bei 1440x900 und 1024x768 fehlen, die Wahl ist ungeprüft.
3. Marken: erledigt. Marke Z. 91–100 (lokale Komponente, Plakette bg-area-strong, rounded-full, aria-hidden). Einsatz Z. 207: Profilzylinder 3, Schutzbeschlag 2, Schließblech 4. Einsteckschloss und 'Ganzheitliche Tür- und Schließtechnik' ohne Marke. Die Nummern stimmen mit BAUTEILE in tuer-schutz.tsx Z. 26–32 überein (1 Zusatzschloss, 2 Schutzbeschlag, 3 Schließzylinder, 4 Schließblech, 5 Bandseite).
4. Regulatorik: erledigt. Section tone='sunken' tight (Z. 317), Warnblock Z. 319 mit border-l-2 border-l-warning, bg-surface, lg:col-span-8. Kopf Z. 320–326 (IconPanikFluchttuer 40, eyebrow 03), h2 Z. 327, prose-sm24 mt-6 Z. 328–335, Link Z. 336–342. Entfallen: dunkle Fläche, 96-px-Icon, text-inverse-Klassen. Wortlaut unverändert. Bildwirkung nicht belegt.
5. Systemerweiterungen: erledigt. RELATED_AREAS Z. 63–88 mit area: AreaKey (Import Z. 10). Abschnitt Z. 364–411: grid lg:grid-cols-12, SectionHeading lg:col-span-5, ol lg:col-span-7. Mobil Leiste mit Anschnitt, ab md Liste mit Haarlinien, Zeile Nummer · Icon · Pfeil, Titel, Satz. Nicht geprüft: Titelüberlauf bei 1024 px.
6. Bandseite (Schaubild): Code erledigt, Bildwirkung offen. tuer-schutz.tsx: Konstanten Z. 95–100, Führung Z. 107–112 (Bandseite M46 210H34V288), legende() Z. 115–118, Boden Z. 171 (±8), Ausschnitt hoehe 280 (Z. 85), Legende Z. 311–324. Tests ergänzt in tuer-schutz.test.tsx Z. 178–204; bestehende Prüfungen unverändert. Offen: Die Führung schneidet den Bolzen (siehe OFFENE FRAGEN 2).
7. Optionskarten: erledigt. rechner-bausteine.tsx Auswahlgruppe Z. 34–64 mit optionalem Prop liste (Standard false; ohne liste bleibt die Ausgabe gleich). tuer-absicherung-rechner.tsx: beide Auswahlgruppen mit liste (Z. 46, 61), alle OptionCard mit zeile (Z. 50, 65), Fokusrahmen entfernt (Import Z. 8), key auf OptionCard (Z. 49, 64). Den Fokus zeigt OptionCard zeile über fokus-innen:ring-inset (option-card.tsx Z. 63, nicht geändert). Test ergänzt in rechner.test.tsx ab Z. 112; die Zählungen 4 Radio und 5 Checkbox bleiben.
8. Glyphe: erledigt. rechner-bausteine.tsx Z. 23 text-area-strong statt text-primary. Bewusste Abweichung laut Paket; wirkt auch auf /service-und-termin.

NICHT UMGESETZT (mit Grund)
- Bandseiten-Alternative auf y 222: nicht übernommen, siehe OFFENE FRAGEN 2.
- Schriftfeld Variante B: nicht gebaut, weil die Messung nicht möglich ist.
- Keine Texte geändert, daher keine Alt-Neu-Liste.

GEMEINSAME DATEIEN
- Keine gemeinsame Datei in diesem Lauf geändert.
- Werte ohne Token, im Code belassen: Marke h-5 w-5 (20 px), border-l-2 (Muster Alert).
- Logikwächter-Ausdrücke, einzeln nachgemeldet (keine Hooks, Handler oder Geschäftslogik betroffen):
  page.tsx: Z. 91–100 Marke, Prop nummer, {nummer} Z. 97; Z. 207 nummer={3}, nummer={2}, nummer={4}. Z. 63–88 RELATED_AREAS mit Datenfeld area. Z. 376–378 map((item, index)) mit key={item.href}. Z. 381 AreaScope area={item.area}. Z. 390 {String(index + 1).padStart(2, '0')}. Z. 392 BereichIcon area={item.area}. Z. 251 {process.label} und Z. 259 {process.hint} verschoben.
  tuer-schutz.tsx: Z. 109 Führungspfad Bandseite. Z. 95–100 Konstanten. Z. 115–118 legende(b) mit zahl, name, y. Z. 311–312 und 323–324 x/y aus legende(b). Z. 171 Boden ±8 (vorher ±18). Z. 85 Ausschnitt-Höhe 264 zu 280.
  tuer-absicherung-rechner.tsx: Z. 46, 61 Prop liste. Z. 50, 65 Prop zeile. Z. 49, 64 key von der Hülle auf OptionCard verschoben, Wert gleich.
  rechner-bausteine.tsx: Z. 23 GlyphRechner-Klasse text-area-strong. Z. 41 Prop liste = false, Z. 46 Typ liste?: boolean. Z. 53–59 className={liste ? … : …}.
  Teil A außerhalb JSX: neue reine Darstellungsfunktionen (Marke, legende, Bandseiten-Zweig in fuehrung) und Konstanten. Keine Hooks, Handler oder Zustände.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0, keine Fehler (/root/sm24-bilder/E6-BEFUND2-H09/tsc.txt).
- ESLint auf die sechs Dateien: Exit 0, keine Befunde (eslint.txt).
- vitest run src/components src/lib: 67 Dateien, 1163 Tests grün (vitest.txt).
- vitest run 'src/app/(site)/seitenstruktur.test.ts': 2 Tests grün (vitest-app.txt).
- werte-suche (JSON /root/sm24-bilder/E6-BEFUND2-H09/werte.json): keine Funde. Zwei Ausnahmen in tuer-schutz.test.tsx Z. 23–24 (bestehende Prüfungen auf Fehlen von rgb( und oklch(), Bildinhalt-Ausnahme).
- Test-Ergänzungen: nur ergänzt. git numstat gegen d4a1d47: rechner.test.tsx +19 / -0, tuer-schutz.test.tsx +28 / -0.
- Platzhalter-Abruf: NICHT ausgeführt (Port 3001 aus). Statisch nur als Hinweis: die Quellen der Seite (content/seo.json, content/service-pages.json, Richtwertstruktur, Nachweise) enthalten keinen '['-Platzhalter. content/settings.json enthält Firmendaten-Platzhalter; site-footer.tsx Z. 49 blendet die Anschrift dann aus. Das ersetzt den Abruf nicht. Die Platzhalter-Standardtexte in src/lib/data/defaults/content.ts (Z. 721–729) gehören zu den Standortseiten. Die Angabe '0 sichtbare Platzhalter' ist damit NICHT belegt.
- Logikwächter: NICHT ausgeführt (Basis d4a1d47 nicht im Protokoll; sichern würde eine Datei außerhalb meiner Rechte ändern). Ausdrücke oben manuell aus dem Diff gegen d4a1d47.
- Messfenster: /tmp/sm24-messfenster.lock nicht vorhanden. Port 3000 (älterer Build) nicht verwendet, Port 3001 nicht gestartet.

BILDBELEGE
Keine. Es fehlen alle Bilder des Pakets (siehe OFFENE FRAGEN 1). Dadurch sind die Punkte 1, 2, 4, 5, 6, 7 ungeprüft. Punkt 3 und 8 sind im Code nachgewiesen, aber ohne Bild ebenfalls nicht als sichtbar belegt.

OFFENE FRAGEN
1. Port 3001 durch den Orchestrator starten. Danach Bildsatz, Messung A/B (1440x900, 1024x768) und Platzhalter-Abruf ausführen. Ich kann dann weitermachen.
2. Bandseite (tuer-schutz.tsx Z. 109): Die Führung M46 210H34V288 schneidet den Bolzen (x 40–46 bei y 210). Die Alternative M55 219V222H34V288 meidet Bolzen (y 204–216) und unteres Band (x 52–66, y 235–257) und quert den Boden nicht. Sie kreuzt aber die Zargenkante bei x 48, weil jede Führung von der Marke nach links diese Kante queren muss. Die Übernahme ändert die bestehende Prüfung tuer-schutz.test.tsx Z. 180, die Datei ist nur zum Ergänzen freigegeben. Nicht übernommen. Entscheidung und Bild nötig.
3. Schriftfeld: Variante A oder B. Erst nach Messung.
4. Logikwächter: Basis d4a1d47 muss ins Protokoll (Orchestrator). Danach pruefen --basis d4a1d47 gegen die Liste oben.
5. Commit: page.tsx hat ungestagte Änderungen gegen HEAD 6e4981c. Nicht committet, nicht gepusht.
6. Fremde Änderung: src/app/(site)/warenkorb/warenkorb-ansicht.tsx ist im Arbeitsbaum geändert. Nicht meins, nicht angefasst.

=== ENDE E6-BEFUND2-H09 · BEREIT ZUR RÜCKGABE ===
(Die Zeile steht im Paketformat. Abnahmefähig ist der Lauf erst mit Bildbelegen, Messung und Platzhalter-Abruf.)
