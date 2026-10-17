# E6-L-34 · Sichtabnahme · Gruppe erzaehl-1 (H01 Start, H02 Autoschlüssel, H03 Modell Golf, H12 Ratgeber)

Rolle: unabhängiger Gestaltungsprüfer, frischer Unteragent. Grundlage: `_werkstatt/KERN.md` 1.15 (K-001, K-003, K-005, K-006, K-007, K-008, K-009), Rubrik und Generisch-Katalog aus dem Paket. Ich habe nur Bilder angesehen und nichts ausgeführt außer `ls` und Read. Den Code habe ich nicht beurteilt. Den Bericht E5-L-29 habe ich erst nach dem Urteil gelesen (Abschnitt am Ende).

## Angesehene Bilder

- **H01 Start:** `H01-start__desktop__00` bis `__06` (7), `H01-start__mobil__00` bis `__08` (9), `H01-start__tablet__00` (Umbruchprüfung des Kopfs), Einzelbilder `einzelbilder/H01/start__desktop__main-section-first-of-type-role-img__0` bis `__4` (B-01).
- **H02 Autoschlüssel:** `H02-autoschluessel__desktop__00` bis `__07` (8), `H02-autoschluessel__mobil__00` bis `__11` (12; `__10` und `__11` zeigen nur den Fuß und gehen nicht ins Urteil ein, damit gelten höchstens 10), `H02-autoschluessel__tablet__00` (Verdacht beim Schriftfeld), Einzelbilder `einzelbilder/H02/autoschluessel__desktop__main-header-role-img__0` bis `__4` (B-21).
- **H03 Modell Golf:** `H03-modell-golf__desktop__00` bis `__04` (5), `H03-modell-golf__mobil__00` bis `__08` (9), `H03-modell-golf__tablet__00` (Umbruchprüfung des Schriftfelds).
- **H12 Ratgeber:** `H12-ratgeber__desktop__00` bis `__02` (3), `H12-ratgeber__mobil__00` bis `__04` (5), `H12-ratgeber__tablet__00` und `__01` (Verdacht bei der Kopfzeichnung).
- **Einzelbilder H12:** Der Ordner `einzelbilder/H12/` war bei jeder Prüfung leer. Die Bewegung von H12 beurteile ich deshalb nach Register und Standbild. Für H03 gibt es keinen Einzelbild-Ordner.

---

## H01 Start

| Kategorie | Wert | Begründung (mit Bildbezug) |
|---|---|---|
| Typografie | 8 | Die Display-h1 steht in drei Zeilen, die Augenbrauen tragen Bemaßungsmarke und laufende Nummer, Schriftfeld und Öffnungszeiten stehen in Plex Mono, und die Stufen Display → Headline → Title sind klar (desktop 00–05). |
| Komposition | 8 | Der Kopf steht 7/5, die Zeichnung ragt über die Shell hinaus, und die Abschnitte wechseln Liste (01), Zeitleiste (02), gespiegelte Teilung mit 2×2-Punkten (03), zwei Bildkarten (04), Zeichnung mit Liste (05) und Dreispalter (06). Mobil gilt eine eigene Reihenfolge (h1 → Zeichnung → Aktion → Vorspann, mobil 00) mit Leisten (mobil 01, 04). |
| Farbe und Bild | 8 | Stahlblau steht auf Papier, die Flächen stufen sich ab (desktop 01–02). Bereichsfarben erscheinen nur in Fach-Icons und Bereichsgrafiken (Code violett, Zylinder orange, Anlage magenta; desktop 01, 03, 04). Primärblau bleibt den Aktionen vorbehalten. |
| Bewegung | 9 | Die Einzelbilder zeigen B-01 einwandfrei: Rohling (0), der Fräser setzt an der Schulter an (¼), Profil und gefräste Fläche folgen dem Fräser (½, ¾), der Fräser hebt frei ab (1). Die Bewegung erklärt das Fräsen, Bemaßung und Legende bleiben die ganze Zeit sichtbar. |
| Grafik | 8 | Der Profilschnitt hat nummerierte Einschnitte, Halm-Bemaßung, Legende und Fräser (desktop 00). Dazu kommen der Zylinder mit Maß A/B und „Mitte Stulpschraube“ (desktop 03) und der Schließplan GHS → ES (desktop 04) mit eigenem schmalem Format mobil (mobil 05). |
| Details | 7 | Haarlinien, kleine Radien und Zeilenpfeile sitzen. Drei Stellen fallen ab: ein Wortwert in Mono im Schriftfeld, Kantenreste im mobilen Ausschnitt und eine gerahmte Schließplan-Zeichnung. |

**Ansichtswert: 8,0**

**Generisch-Katalog**
- Hart: keine.
- Weich:
  - „Wobei können wir helfen?“ (desktop 01, mobil 01) ist eine Floskel. Die Leitidee trägt sie nicht. Das ist eine Textfrage für den Menschen, kein Gestaltungsbefund.
  - Zwei gleich gebaute Bildkarten in „Bestellen ohne Termin“ (desktop 03) sind kein vorherrschendes Muster und tragen bemaßte Zeichnungen. Die Leitidee trägt sie.
  - Verläufe, Glas, Leuchtkugeln und hochzählende Zahlen: keine.

**Befunde**
1. **Details · desktop 00 und tablet 00, Schriftfeld, Feld „VERSAND“ (x≈530, y≈680)**
   - Was stört: „bundesweit“ steht als Wortwert in Plex Mono neben „69,90 €“ und „ca. 7 Tage“. Die Kleinregel aus K-006 verlangt für Wortwerte Inter, und H02 setzt „Termin mit Anzahlung“ bereits richtig. Die Seiten widersprechen sich.
   - Änderung: den Wert auf `font-sans text-title-sm font-semibold` umstellen. Mono bleibt für Betrag und Frist.
2. **Details · mobil 00, linker Rand der Kopfzeichnung (x≈20–30, y≈345–410)**
   - Was stört: Der Ausschnitt schneidet genau durch die Schulter. Links bleiben zwei kurze waagrechte Kantenreste ohne Zusammenhang stehen, das liest sich wie ein Darstellungsfehler.
   - Änderung: das Ausschnittfenster so weit nach rechts schieben, dass es im Halm hinter der Schulter beginnt (Schulter ganz außerhalb). Alternativ die Schnittkante wie in einer Werkstattzeichnung als Bruchkante zeigen (Strich `HILFSLINIE`, gestrichelt).
3. **Details · desktop 04, Schließplan-Zeichnung (x≈133–805, y≈228–665)**
   - Was stört: Die Zeichnung steht als einzige große Fachgrafik der Seite in einer Karte mit Rahmen und `rounded-lg`, ist aber kein Link. Kopf- und Zylinderzeichnung stehen frei.
   - Änderung: Rahmen und Radius entfernen und die Zeichnung auf Papier oder auf `bg-area-soft/40` stellen (Muster „Kopf mit Blickfang“). Das Raster läuft dann bis an die Spaltenkante.

**Das Stärkste**
- Die Fräsbahn B-01 im Kopf ist die Leitidee in Reinform: Man sieht Genauigkeit, bevor man sie liest.
- Zylinder mit Maß A/B und Schließplan sind echte Fachzeichnungen, der Schließplan hat mobil ein eigenes schmales Format (HS → 4 ES).

---

## H02 Autoschlüssel

| Kategorie | Wert | Begründung (mit Bildbezug) |
|---|---|---|
| Typografie | 8 | Die kurze Display-h1 „Autoschlüssel“ steht unter Augenbraue und Profillinie. Die Begriffszeilen haben eine klare Stufe Titel/Erklärung (desktop 02–03), Beträge im Hinweis stehen in Mono („69,90 €“, desktop 04). |
| Komposition | 7 | Der Kopf (7/5 mit Schlüsselarten-Raster und Schriftfeld) trägt. Danach folgen fünf Abschnitte ohne Bild (desktop 02–06). Abschnitt 01 wiederholt die vier Kopfzeichnungen, die Fragen lassen 4 Spalten leer, und mobil ziehen sich 12 Begriffszeilen über gut zwei Bildschirmhöhen (mobil 03–05). |
| Farbe und Bild | 8 | Bereichsblau steht in Augenbraue, Icons und Zeichnungen, die Flächenstufen (Papier → muted → sunken) trennen die Abschnitte. Primärblau erscheint nur auf Knöpfen und dem aktiven Menüpunkt. |
| Bewegung | 8 | Die Einzelbilder zeigen B-21 wie im Register: leere Zelle (0), Körper und Bart grau (¼), das Profil zeichnet sich blau (½–¾), Endstand (1). Die Mechanik hat Sinn, wirkt in den rund 190 px breiten Zeichnungen aber klein. B-03 steht im Endzustand stimmig (desktop 03–04). |
| Grafik | 7 | Die vier Schlüsselarten sind sauber gezeichnet, aber klein und ohne Bemaßung (desktop 00). Sie werden als Vorschaubilder wiederholt, und Keyless hat keine Zeichnung (desktop 01). Unterhalb von Abschnitt 01 folgt keine Grafik mehr. |
| Details | 7 | Im Schriftfeld sind die Werte verrutscht, die Markenkachel „Mercedes-Benz“ ist gedrängt, und in der mobilen Markenliste steht „Renault“ allein. |

**Ansichtswert: 7,5**

**Generisch-Katalog**
- Hart: keine.
- Weich:
  - Neun gleiche Markenkacheln (desktop 04, mobil 07) sind Auswahl, kein Schmuck. Die Leitidee trägt sie.
  - Nach dem Kopf überwiegen Text-Listen mit Haarlinien (02 Begriffe, 05 Fragen, 06 Weiterlesen). Ablauf und Marken unterbrechen sie, die Leitidee trägt sie nur teilweise. Dazu gehören die Befunde zur Komposition.
  - Die Überschrift „Worum es in diesem Bereich geht“ (desktop 00/01, mobil 01) klingt nach Platzhalter. Die Leitidee trägt sie nicht. Das ist eine Textfrage für den Menschen.

**Befunde**
1. **Komposition · desktop 01 und mobil 02, Abschnitt 01 „Schlüsselarten“**
   - Was stört: Die vier Kopfzeichnungen (desktop 00) erscheinen eine Bildschirmhöhe später noch einmal als Vorschaubilder von etwa 160 px. Das schwächt den Kopf, und die Zeile „Keyless“ hat als einzige keine Zeichnung (leeres Feld links, desktop 01 y≈870).
   - Änderung: die Vorschaubilder streichen und die Zeilen als Begriffsliste setzen (Titel 4 Spalten, Erklärung 8 Spalten, Haarlinien).
2. **Komposition · desktop 05, Abschnitt 05 „Häufige Fragen“**
   - Was stört: Das Akkordeon steht in 8 Spalten unter der Überschrift, die rechten 4 Spalten bleiben über die ganze Bildschirmhöhe leer. Davor (02) und danach (06) stehen ebenfalls Listen.
   - Änderung: eine 5/7-Teilung wie in Abschnitt 02. Augenbraue und Überschrift stehen links (`lg:col-span-5`, klebend), das Akkordeon rechts (`lg:col-span-7`).
3. **Komposition · mobil 03–05, Abschnitt 02 „Leistungen“**
   - Was stört: 12 Begriffszeilen mit zwei- bis dreizeiliger Erklärung füllen rund zweieinhalb Bildschirmhöhen ohne Handlung.
   - Änderung: unter 640 px je Gruppe ein Akkordeon („Schlüssel anfertigen“, „Elektronik und Programmierung“, „Reparatur und Sonderfälle“, die erste Gruppe offen). Ab 640 px bleibt die Liste.
4. **Grafik · desktop 00, Kopf rechts (x≈837–1308, y≈190–640)**
   - Was stört: Die vier Zeichnungen sind je etwa 190 px breit in Zellen von 235 px und haben viel leeres Raster darüber und darunter. Neben der 60-px-h1 wirkt der große Moment kleinteilig, und das Zeichnen des Profils (B-21) ist kaum zu sehen.
   - Änderung: die Zeichnungen auf volle Zellbreite skalieren (Innenrand des Rasters etwa 8 px) und die Zellhöhe am Inhalt ausrichten.
5. **Grafik · desktop 02–03, linke Gruppenspalte der Begriffsliste (leer von y≈540 bis 870)**
   - Was stört: Unterhalb von Abschnitt 01 hat keine Bildschirmhöhe einen Blickfang.
   - Änderung: die in Abschnitt 01 frei werdenden Zeichnungen hierher setzen, je Gruppe eine und klebend, ohne Rahmen: Mechanischer Schlüssel bei „Schlüssel anfertigen“, Funkschlüssel bei „Elektronik und Programmierung“, Klappschlüssel bei „Reparatur und Sonderfälle“.
6. **Details · desktop 00, Schriftfeld (y≈530–610)**
   - Was stört: „Termin mit Anzahlung“ bricht zweizeilig. Die Werte „69,90 €“, „ca. 7 Tage“ und „49“ rutschen dadurch etwa 25 px unter ihr Etikett, das Feld wirkt verrutscht.
   - Änderung: die Werte oben ausrichten (`items-start`, gleicher Abstand Etikett–Wert in allen Feldern). Nach K-006 bekommt das Wortfeld ABLAUF eine eigene Zeile über den drei Zahlenfeldern.
7. **Details · desktop 04, Markenkachel „Mercedes-Benz“ (x≈1157–1308, y≈680–720)**
   - Was stört: Der Name läuft bis an den Pfeil, der Pfeil steht etwa 6 px vom Rand. Die übrigen Kacheln haben etwa 20 px Luft.
   - Änderung: Pfeil mit `shrink-0` und `gap-2` zum Namen, Innenabstand `px-3`. Alternativ ab `lg` eine Teilung 6/6, damit das Markenraster breiter wird.
8. **Details · mobil 07, Markenkacheln**
   - Was stört: Neun Kacheln stehen in zwei Spalten, „Renault“ allein in der letzten Reihe.
   - Änderung: mobil eine einspaltige Zeilenliste mit Haarlinien (wie „Weiterlesen“, mobil 09) oder eine Leiste mit Anschnitt.

**Das Stärkste**
- Der Kopf mit der Reihe der vier Schlüsselarten, mobil als Leiste mit Anschnitt und Nummern (mobil 00). B-21 zeichnet erst den Körper, dann das Profil.
- Die Begriffsliste in drei Gruppen mit Fach-Icon, ganzer Zeile als Link und InfoTips ist sachlich und klar, ohne Kartenwüste (desktop 02–03).

---

## H03 Modell Golf

| Kategorie | Wert | Begründung (mit Bildbezug) |
|---|---|---|
| Typografie | 8 | Die Display-h1 steht zweizeilig. Das Schriftfeld folgt der Regel („vor Ort“ in Inter, „ab 2003“ in Mono, desktop 00), der Datensatz ist eine Tabelle mit Mono-Werten (desktop 01), die Einordnung hat eine klare Stufe Titel/Text (desktop 02). |
| Komposition | 7 | Desktop wechselt sauber: 7/5, Tabelle 5/7, Viererreihe, Liste 5/7, Warnung, Termin und Weiterlesen nebeneinander. Abschnitt 04 ist aber nur Überschrift und Warnkasten mit leerem rechtem Drittel (desktop 03), und mobil stehen die Schlüsselarten als Stapel über anderthalb Bildschirmhöhen (mobil 02–03). |
| Farbe und Bild | 7 | Stahlblau, Flächenstufen und Warnleiste stimmen. Die nicht klickbaren Nummern 01–04 der Einordnung stehen aber in Primärblau (desktop 02, mobil 04), gegen die Kleinregel und anders als auf H01. |
| Bewegung | 8 | Für H03 gibt es keine Einzelbilder. Nach Register zeichnet B-21 im Kopf und in der Reihe der Bauformen erst die Körper, dann die gestaffelten Kopien (80 ms), dann die Profile. Die Endzustände sind vollständig, die Mechanik hat Sinn, und nichts bewegt sich dauernd. |
| Grafik | 7 | Die Kopfzeichnung mit gestaffelten Kopien erzählt „nachmachen“ gut (desktop 00, tablet 00). Die Reihe der Bauformen bricht bei Keyless ab, dort steht nur Text (desktop 01). |
| Details | 7 | Die Etiketten im Schriftfeld brechen um, für dieselben Schlüsselarten stehen zwei Namensformen, und eine Überschrift bricht mobil gestaucht um. |

**Ansichtswert: 7,3**

**Generisch-Katalog**
- Hart: keine.
- Weich:
  - Die Viererreihe der Bauformen hat gleich gebaute Spalten. Sie dient dem Vergleich und ist der Ort von B-21, die Leitidee trägt sie.
  - Floskeln: keine. „Was darin nicht steht, erfinden wir nicht“ ist „Bemaßt statt behauptet“ im Wortlaut.

**Befunde**
1. **Komposition · mobil 02–03, Abschnitt 02 „Schlüsselarten“**
   - Was stört: Drei Zeichnungen in voller Breite (je ≈300 px) und Keyless stehen untereinander, der Abschnitt braucht anderthalb Bildschirmhöhen. Das Kernmuster „Leiste statt Stapel“ gilt ab vier gleichartigen Einträgen.
   - Änderung: mobil eine Leiste mit Anschnitt (`-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 … scroll-px-5`, Karte `shrink-0 basis-3/4 snap-start`), wie die Kopf-Leiste auf H02 mobil 00.
2. **Komposition · desktop 03, Abschnitt 04 „Was wir ohne Ihre Unterlagen nicht sagen können“**
   - Was stört: Ein ganzer Abschnitt auf `surface-sunken` besteht nur aus Überschrift und Warnkasten in 8 Spalten, rechts bleiben etwa 400 px leer.
   - Änderung: eine 5/7-Teilung wie in Abschnitt 03 (Überschrift links, Warnkasten rechts in 7 Spalten). Alternativ den Warnkasten als Abschluss unter Punkt 04 in die rechte Spalte von Abschnitt 03 ziehen.
3. **Farbe · desktop 02 (x≈635; y≈215, 360, 503, 668) und mobil 04, Nummern 01–04 der „Einordnung“**
   - Was stört: Die Nummern stehen in Primärblau, obwohl sie nicht klickbar sind. Die Kleinregel K-006 sagt „Primärblau nur für Aktionen und Links“, und H01 „Warum wir“ setzt dieselbe Form richtig.
   - Änderung: `text-foreground`, Mono und `tabular-nums` bleiben.
4. **Grafik · desktop 01, vierte Spalte „Keyless“ (x≈1032–1308, y≈577–750)**
   - Was stört: Statt einer Zeichnung stehen dort nur Info-Glyphe und Text. Die Reihe der Bauformen (B-21) bricht ab, die Spalte wirkt unfertig.
   - Änderung: die vorhandene Smart-Key-Zeichnung (H02 desktop 00, Zelle 04: Gehäuse ohne Bart, Funkbögen) für Keyless verwenden, mit gleicher Rasterfläche und Höhe wie die drei übrigen. Die Info-Glyphe wandert neben den Titel.
5. **Details · desktop 00, Schriftfeld „SCHLÜSSELARTEN“ (x≈132–468, y≈600–655) und desktop 01, Datensatz**
   - Was stört: Die vier Etiketten brechen um, „Keyless“ steht allein in Zeile 2. Das Feld wird höher als „BAUJAHRE“ und „ANLERNEN“, deren untere Hälfte leer bleibt (auf dem Tablet passt alles in eine Zeile, tablet 00). Außerdem heißen die Arten im Schriftfeld „Mechanisch/Funk“, eine Bildschirmhöhe tiefer „Mechanischer Schlüssel/Funkschlüssel“.
   - Änderung: SCHLÜSSELARTEN bekommt als wichtigstes Feld eine eigene volle Zeile über BAUJAHRE und ANLERNEN (K-006). Die Etiketten tragen dort dieselben Namen wie Datensatz und Abschnitt 02.
6. **Details · mobil 05, Überschrift „Was wir ohne Ihre / Unterlagen nicht / sagen können“**
   - Was stört: Die Überschrift läuft über drei Zeilen und lässt rechts etwa 120 px frei. Sie wirkt gestaucht neben den übrigen zweizeiligen h2.
   - Änderung: den Umbruch ohne `text-balance` setzen (bzw. mit `text-pretty`), damit zwei volle Zeilen entstehen.

**Das Stärkste**
- Der Kopf mit dem Schlüssel und seinen gestaffelten Kopien und ein Schriftfeld mit Wort- und Zahlwerten nach Regel.
- Der Datensatz als Mono-Tabelle mit dem Satz „Was darin nicht steht, erfinden wir nicht“ ist das Prinzip „Bemaßt statt behauptet“ als Seitenteil.

---

## H12 Ratgeber („Autoschlüssel verloren — was jetzt zu tun ist“)

| Kategorie | Wert | Begründung (mit Bildbezug) |
|---|---|---|
| Typografie | 8 | Die Display-h1 mit Gedankenstrich bricht sauber um (desktop 00, mobil 00). Der Artikel steht in Messbreite mit Mono-Nummern über den Überschriften, auch das Verzeichnis hat Mono-Nummern (desktop 00–01). |
| Komposition | 8 | Der Kopf steht 7/5 mit Ablaufzeichnung, der Artikel in 8 Spalten neben einem klebenden Verzeichnis mit „Weiterlesen“ (desktop 01). Mobil folgen Verzeichnis, Artikel, Handlung und Weiterlesen (mobil 01–02), kurz und ruhig. |
| Farbe und Bild | 7 | Die Farbe folgt den Regeln (Primärblau nur für aktive Nummer, Fortschrittsleiste und Knopf). Außer dem Kopf trägt die Seite aber kein Bild: vier Abschnitte reiner Text mit blauen Trennern (desktop 01, tablet 01). |
| Bewegung | 8 | Einzelbilder gab es nicht (Ordner leer). Im Standbild ist B-24 sichtbar: Leiste am Verzeichnis und Nummer 04 an der Leselinie in Primärfarbe, gleich im Verzeichnis (desktop 01). B-23 ist laut Register eine Staffel der Stationen. Die Bewegung dient der Orientierung. |
| Grafik | 7 | Die Ablaufzeichnung hat Kreisstationen, Bemaßungspfeile und mobil ein eigenes senkrechtes Format (mobil 00). Für den einzigen Blickfang ist sie dünn, auf dem Tablet wirkt sie aufgeblasen (tablet 00), und die Profillinien zwischen den Abschnitten sind alle gleich. |
| Details | 8 | Verzeichnis und Pfeilzeilen sitzen präzise, „IHR NÄCHSTER SCHRITT“ steht als Augenbraue vor dem Knopf, und der Knopf ist mobil einzeilig (mobil 02). |

**Ansichtswert: 7,7**

**Generisch-Katalog**
- Hart: keine.
- Weich: Vier gleich gebaute Abschnitte folgen aufeinander (Nummer, Titel, Absatz, Profillinie; desktop 00–01). Es ist ein nummerierter Ablauf, die Leitidee trägt das. Die viermal gleiche Profillinie trägt sie nicht (Befund Grafik).

**Befunde**
1. **Farbe und Bild · desktop 01 und tablet 01, Artikelkörper**
   - Was stört: Vier Abschnitte haben kein Bild. Der Kopf verspricht einen Ablauf, der Text löst ihn nicht bildlich ein.
   - Änderung: in Abschnitt 02 „Prüfen: Ist noch ein Schlüssel vorhanden?“ die vorhandene Schlüsselzeichnung (Generator `schluessel`, Funkschlüssel wie auf H02) klein in die Messspalte setzen (`max-w-sm`, ohne Rahmen, auf Papier). Neben den Titel von Abschnitt 04 „Was wir von Ihnen brauchen“ kommt das Fach-Icon `foto-hochladen`.
2. **Grafik · desktop 00–01, mobil 01–02 und tablet 01, Trenner zwischen den Abschnitten**
   - Was stört: Alle vier Profillinien und die unter der Augenbraue zeigen denselben Zahnschnitt. Das einzige Ornament wird zur Kopie, und die Idee „Profil aus echten Einschnitt-Regeln“ geht verloren.
   - Änderung: die Profillinie je Abschnitt aus dem Abschnittstitel erzeugen (der Baustein ist deterministisch aus einem Text), damit jeder Trenner sein eigenes Profil hat.
3. **Grafik · tablet 00, Kopfzeichnung (y≈430–835)**
   - Was stört: Die Zeichnung wird auf 720 px Breite skaliert, Ziffern und Beschriftungen erreichen ≈24 px und sind größer als der Vorspann. Der Artikel beginnt erst unter der ersten Bildschirmhöhe.
   - Änderung: zwischen 640 und 1023 px auf `max-w-md` begrenzen oder die 7/5-Teilung schon ab `md` nutzen.
4. **Grafik · desktop 00, Kopfzeichnung (x≈837–1308, y≈190–455)**
   - Was stört: Drei Kreise und eine Pfeillinie stehen auf einem Raster von 470 × 265 px. Die Zeichnung hat weniger Gewicht als die h1 daneben.
   - Änderung: Stationen und Mono-Ziffern um ≈25 % vergrößern, den Abstand der Beschriftung zur Pfeillinie halbieren und das Raster auf die Höhe des Inhalts kürzen.

**Inhaltlicher Hinweis (ohne Wertung, für den Menschen):** Der Kopf nennt drei Stationen „sichern · prüfen · bestellen“. Der Artikel hat vier Abschnitte in anderer Reihenfolge (Prüfen in 02 vor der Sicherheitsfrage in 03). Wer Zeichnung und Text nebeneinander liest, kann sie nicht zuordnen.

**Das Stärkste**
- Der Lesefortschritt B-24 mit klebendem Verzeichnis und aktiver Nummer an der Leselinie. Die Bewegung erklärt, wo man im Text steht.
- Die Ablaufzeichnung hat mobil ein eigenes senkrechtes Format statt eines verkleinerten Querformats (mobil 00).

---

## Gruppe erzaehl-1 · Ergebnis

| Ansicht | Typo | Komp. | Farbe/Bild | Bewegung | Grafik | Details | Ansichtswert |
|---|---|---|---|---|---|---|---|
| H01 Start | 8 | 8 | 8 | 9 | 8 | 7 | 8,0 |
| H02 Autoschlüssel | 8 | 7 | 8 | 8 | 7 | 7 | 7,5 |
| H03 Modell Golf | 8 | 7 | 7 | 8 | 7 | 7 | 7,3 |
| H12 Ratgeber | 8 | 8 | 7 | 8 | 7 | 8 | 7,7 |

**Mittel der Ansichtswerte: 7,6** (30,5 / 4 = 7,625)

**Die drei wirksamsten Änderungen über die Gruppe**
1. **Die Reihe der Schlüsselarten vervollständigen und nicht wiederholen.**
   - H03 bekommt für Keyless die vorhandene Smart-Key-Zeichnung (desktop 01) und mobil eine Leiste statt eines Stapels (mobil 02–03).
   - H02 streicht die Vorschaubilder in Abschnitt 01 und setzt die Zeichnungen als klebende Gruppenbilder in die leere linke Spalte der Begriffsliste.
   - Das schließt die Keyless-Lücke auf beiden Seiten und gibt H02 unterhalb des Kopfs einen Blickfang.
2. **Die untere Hälfte von H02 gliedern.**
   - Fragen in 5/7-Teilung (desktop 05).
   - Mobil je Begriffsgruppe ein Akkordeon (mobil 03–05).
   - Zeichnungen im Kopf auf volle Zellbreite (desktop 00).
   - Damit ist H02 nicht mehr die listenlastigste Seite der Gruppe.
3. **Die Kleinregeln für Schriftfeld und Nummern einheitlich anwenden.**
   - H01 setzt „bundesweit“ in Inter.
   - H02 richtet die Werte oben aus und gibt dem Wortfeld eine eigene Zeile.
   - H03 gibt SCHLÜSSELARTEN eine eigene Zeile mit einheitlichen Namen und setzt die Einordnungsnummern in Textfarbe.
   - Das sind kleine Eingriffe mit Wirkung auf drei erste Bildschirmhöhen.

---

## Abgleich mit E5-L-29

Diesen Abschnitt habe ich erst nach dem Urteil oben gelesen und geschrieben. Das Urteil bleibt unverändert.

Werte E5 → E6:

| Ansicht | E5 | E6 |
|---|---|---|
| H01 | 7,7 | 8,0 |
| H02 | 6,7 | 7,5 |
| H03 | 6,0 | 7,3 |
| H12 | 7,0 | 7,7 |
| Gruppe | 6,8 | 7,6 |

### H01 Start
- **Behoben:**
  - **E5-2 „Warum wir“ mobil in 150-px-Spalten:** jetzt einspaltig mit Mono-Nummer links und Titel und Text rechts (mobil 03).
  - **E5-3 drei Gleichteilungen in Folge:** „Warum wir“ ist jetzt eine gespiegelte Teilung, 2×2-Punkte links und Überschrift rechts (desktop 02–03). Die Folge wechselt.
  - **E5-4 Zahl und Einheit getrennt:** „7 Tagen“ und „69,90 €“ bleiben zusammen (mobil 02).
  - **E5-5 Linkwörter in „Bestellen ohne Termin“:** Die Karte ist der Link, am Titel steht nur der Pfeil (desktop 03, mobil 04).
  - **E5-6 Schnelleinstieg mobil ohne Nummer und Mono-Zeile:** Nummer „01“ und „TERMIN MIT ANZAHLUNG“ stehen jetzt in der Karte (mobil 01).
- **Teilweise:**
  - **E5-1 mobiler Kopf-Ausschnitt:**
    - Behoben: Bemaßung „Halm · 6 Einschnitte“ und Legende sind jetzt im Fenster (mobil 00).
    - Bleibt: Die Reide ist weiter nicht zu sehen. Statt des Streifens bleiben jetzt Kantenreste an der Schulter stehen (mein Befund H01 Details 2).
  - **E5-6, Raum unter der Leiste:** Unter der Schnelleinstieg-Leiste bleiben weiter etwa 55 px frei (mobil 01). Das nehme ich als Abschnittsabstand hin.
- **Bleibt:** die Floskel „Wobei können wir helfen?“. Das ist eine Textfrage, kein Gestaltungsbefund.

### H02 Autoschlüssel
- **Behoben:**
  - **E5-1 Abschnitte 01/02:** 01 ist eine Grafikliste mit Zeichnung je Zeile, 02 ein 4/8 mit Gruppentitel links (desktop 01–03).
    - Neu sehe ich das kritisch: Die Zeichnungen in 01 wiederholen den Kopf, und Keyless bleibt ohne Bild (mein Befund Komposition 1).
    - Ich schlage vor, sie in die leere Gruppenspalte von 02 zu verlegen (Befund Grafik 2).
  - **E5-3 Hinweis im Ablauf:** steht jetzt als Glyph-Zeile ohne Kasten links unter den Knöpfen, mobil nach den Schritten (desktop 04, mobil 06).
  - **E5-4 FAQ-Antwort zu breit:** Das Akkordeon steht in 8 Spalten, die Antwort im Maß (desktop 05). Daraus folgt mein neuer Befund: Die rechten 4 Spalten bleiben leer, ich empfehle 5/7.
  - **E5-6 fettes Mono im Satz:** „69,90 €“ und „7“ stehen jetzt in normalem Mono (desktop 04).
  - **E5-7 blasse Kopfzeichnungen auf Tönung:** Die Zeichnungen stehen auf Papier mit dunkler Kontur (desktop 00).
  - **E5-8 Kennungen blenden mit ein, Phasen unklar:** „01“ steht ab Bild 0. Körper (¼) und Profil (½–¾) sind getrennt erkennbar (Einzelbilder 0–4).
  - **E5-9 unbeschriftete Bemaßungsticks:** entfallen (desktop 00).
  - **E5-10 Keyless in falscher Spalte:** Der Titel steht jetzt in der Namensspalte (desktop 01). Die Bildspalte bleibt dort aber leer.
  - **E5-11 Zeilenpfeile in drei Farben:** Auf H01, H02, H03 und H12 sehe ich jetzt einheitlich gedämpfte Pfeile (H02 desktop 02, 06; H01 desktop 05; H03 desktop 03; H12 desktop 01).
  - **E5-12 „01 · ANSICHT“:** jetzt nur „01“ bis „04“.
- **Teilweise:**
  - **E5-2 Kopfraster:**
    - Behoben: Die Tönung ist weg, das Raster hat Haarlinien.
    - Bleibt: Die Zeichnungen füllen die Zellen weiter nicht (etwa 190 von 235 px, mein Befund Grafik 1).
  - **E5-5 Schriftfeld:**
    - Behoben: „Termin mit Anzahlung“ steht in Inter, „ERFASSTE MODELLE“ einzeilig.
    - Bleibt: Weil der Wortwert zweizeilig bleibt, rutschen die Zahlenwerte unter ihr Etikett. Die vorgeschlagene Ausrichtung an der Grundlinie löst es nicht, deshalb empfehle ich die andere Variante aus E5: eine eigene Zeile für das Wortfeld (mein Befund Details 6).
- **Nicht geprüft:** die E4-Reste „Klappbart dreht aus“ und „Notschlüssel gestrichelt“. Dafür fehlen Einzelbilder der Zellen 03/04.

### H03 Modell Golf
- **Behoben:**
  - **E5-1 Schlüsselarten in voller Breite (schwerster E5-Befund):** jetzt eine Viererreihe mit Zeichnungen von etwa 270 px auf Papier mit Haarlinie oben (desktop 01).
  - **E5-2 Datensatz mit leerer Spalte:** jetzt 5/7 mit Überschrift links (desktop 00–01).
  - **E5-3 Kopf im getönten Kasten:** Die Zeichnung steht frei auf dem Raster und ragt über die Spalte (desktop 00).
  - **E5-4 flatternde Mono-Werte:** jetzt je Art eine Zeile, rechtsbündig (desktop 01).
  - **E5-5 Kopfzeile ohne Ordnung:** jetzt ein Schriftfeld mit Schlüsselarten, Baujahre und Anlernen (desktop 00). Neu: Die Etiketten brechen um (mein Befund Details 5).
  - **E5-6 Badge in Primärblau:** entfallen, jetzt Feld „ANLERNEN · vor Ort“.
  - **E5-7 drei bildschirmfüllende Auftritte:** durch die Reihe erledigt (nach Register).
  - **E5-8 Strichstärke bei Überskalierung:** Die Linien sind fein (desktop 01).
  - **E5-9 Bemaßungsticks:** entfallen.
  - **E5-10 Kopien kaum sichtbar:** Die Kopien haben jetzt Kontur und eigene Fläche und lesen sich als Kopien (desktop 00, tablet 00).
  - **E5-11 Keyless unter der Bildunterschrift:** jetzt vierte Zelle mit Info-Glyphe, die Bildunterschrift steht unter der Reihe (desktop 01). Ich gehe einen Schritt weiter und fordere eine Zeichnung (mein Befund Grafik 4).
  - **E5-12 freie Info-Glyphe hinter dem Chip:** Die Glyphen stehen jetzt an den Feldetiketten (desktop 00).
  - **E5-13 „etwa 7 / Tage“:** jetzt ungetrennt (mobil 04).
- **Neu gegenüber E5:**
  - Die Einordnungsnummern in Primärblau widersprechen der seit Kern 1.14 geltenden Kleinregel. E5 hatte sie noch als sauber bewertet.
  - Die mobile Stapelung der Bauformen hatte E5 bei drei Karten zugelassen. Mit Keyless als vierter Zelle greift jetzt „Leiste statt Stapel“.

### H12 Ratgeber
- **Behoben:**
  - **E5-1 Kopfgrafik hängt oben:** Der Inhalt steht jetzt mittig im Raster (desktop 00). Für den einzigen Blickfang finde ich die Zeichnung trotzdem dünn (mein Befund Grafik 4).
  - **E5-2 Kasten „Ihr nächster Schritt“:** Der Kasten ist entfallen. Profillinie, Augenbraue und Knopf stehen auf Papier (desktop 01, mobil 02).
  - **E5-3 schmale Kopfzeichnung linksbündig:** Sie steht jetzt annähernd mittig (mobil 00).
  - **E5-4 Primärblau auf Nicht-Aktionen:** Die Abschnittsnummern ruhen in gedämpfter Farbe. Die Stationskreise lese ich jetzt in Bereichsblau, heller als der Knopf (desktop 00–01).
  - **E5-5 B-24 unsichtbar:** Nur die Nummer an der Leselinie steht jetzt in Primärblau (04 im Artikel und im Verzeichnis, desktop 01).
  - **E5-7 „bestellen“ am Rasterrand:** Rechts ist jetzt etwa ein Rasterfeld Polster (desktop 00).
  - **E5-8 Knopf mobil zweizeilig:** jetzt einzeilig über die volle Breite (mobil 02).
  - **E5-9 Verzeichnisnummer 03 mittig:** steht jetzt an der ersten Zeile (desktop 01).
- **Bleibt:**
  - **E5-6 austauschbares Dreischrittschema:** Die Stationen tragen weiter nur Nummern statt Glyphen, die Pfeilspitzen sind weiter gefüllte Dreiecke mitten auf der Linie (desktop 00).
  - Mein Befund Grafik 4 setzt hier an, aber ohne neue Zeichen.
- **Neu gegenüber E5:** E5 lobte die Profillinien-Trenner. Ich sehe, dass alle denselben Zahnschnitt haben, und empfehle je Abschnitt ein eigenes Profil aus dem Titel (Befund Grafik 2).

=== ENDE E6-L-34 · BEREIT ZUR RÜCKGABE ===
