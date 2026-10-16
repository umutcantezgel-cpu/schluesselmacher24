# E5-L-29 · Sichtabnahme · Gruppe „arbeit“ (H04, H07, H10, H11)

Rolle: unabhängiger Gestaltungsprüfer, Urteil nur aus Bildern, Bewegungsregister (K-007) und KERN 1.13. Alle vier Ansichten sind Arbeitsansichten (K-009): Ruhe ist richtig, und bewertet wird, ob Dichte, Ordnung und Rückmeldung stimmen.

## Angesehene Bilder
- **H04 Assistent:** `H04-assistent__desktop__00–03`, `__mobil__00–04`, `__tablet__00` (Verdacht auf Umbruch der Schrittleiste); `schritte/01` bis `schritte/13` (ganze Seiten, mobil).
- **H07 Zylinder-Konfigurator:** `H07-zylinder-konfigurator__desktop__00–03`, `__mobil__00–06`; `schritte/14` bis `schritte/18` (ganze Seiten, Desktop).
- **H10 Warenkorb:** `H10-warenkorb__desktop__00–01`, `__mobil__00–02` (leer); `gefuellt/warenkorb-gefuellt__desktop__00–02`, `__mobil__00–04`, `__tablet__00`.
- **H11 Kasse:** `H11-kasse__desktop__00–01`, `__mobil__00–02` (leer); `gefuellt/kasse-gefuellt__desktop__00–03`, `__mobil__00–06`, `__tablet__00`, `__tablet__03`.
- **Zur Einordnung (kein Maßstab):** `_werkstatt/bilder/e0/H07-zylinder-konfigurator__desktop__00.jpg`, `_werkstatt/bilder/e0/H04-assistent__mobil__00.jpg`.
- Keine Einzelbilder für diese Gruppe vorhanden. Bewegung ist daher nach Register und nach den sichtbaren Zuständen (Fortschritt, gesperrt, Fehler, Zwischenzustände in Ganzseitenbildern) bewertet.
- Testdaten in den Schrittbildern (Mustermann, `pruefung@example.invalid`, bunte Testbilder mit „Die Datei konnte nicht hochgeladen werden.“ in `schritte/08` und `/09`) stammen aus der Aufnahme und nicht aus der Seite. Sie sind kein Befund.

---

## H04 · Assistent (Autoschlüssel-Anfrage mit Termin)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Saubere Skala (h1 `text-headline`, Schrittleiste und Beträge in Mono, „69,90 €“ in `schritte/12`), aber der Titel steht dreimal da: Augenbraue, h1 und Kastentitel „AUTOSCHLÜSSEL: ANFRAGE MIT TERMIN“ (`desktop__00`). In `schritte/03` doppeln sich außerdem h2 und Feldlabel. |
| Komposition | 6 | Mobil ist es stark (Schrittband oben, Leiste ← / Weiter unten, `mobil__00/01`). Am Desktop läuft alles über 12 Spalten: Markenkarten 580 px breit, „Weiter“ als 1176-px-Balken unter dem Falz, die 13 Schrittnamen brechen zweizeilig um (`desktop__00`, `tablet__00`). |
| Farbe und Bild | 7 | Ruhig und korrekt (Primär nur für Aktion und Auswahl, gesperrt als ruhige Fläche), aber in `schritte/11–13` stapeln sich getönte und farbig geleistete Hinweiskästen (Info blau, Warnung orange), die Farbe als Fläche ohne eigenen Anlass einsetzen. |
| Bewegung | 8 | Register passt zur Arbeitsansicht: B-10 Fortschritt `scaleX`, B-11 Schrittwechsel, B-19 Laden, B-05 Druck. Die Bilder zeigen keine Inszenierung, nur Zustände (Fortschrittsbalken, gesperrter Knopf mit Hinweis, Fehlerzustand beim Hochladen in `schritte/08`). |
| Grafik | 7 | Die Schlüsselarten als Zeichnung (`schritte/05`) und die Fotovorlagen „So sollte das Foto aussehen“ (`schritte/08/09`) sind echte Fachgrafik. Sie sind aber klein in die Karte gequetscht (Keyless-Titel dreizeilig) oder so hoch, dass Schritt 8 auf fast 7000 px wächst. |
| Details | 6 | Seite in `schritte/13` 392 px breit bei 390 px Ansicht (seitliches Scrollen), Kopfknopf „Termin starten“ mitten im laufenden Terminablauf (`desktop__00`), das klebende Schrittband sitzt am Desktop ohne Grundfläche direkt auf den Karten (`desktop__01`), PLZ und Ort mobil je volle Breite (`schritte/10`). |

**Ansichtswert: 6,8**

**Generisch-Katalog**
- Hart: keine. Fokus und Kontrast lassen sich am Bild nicht messen, und sichtbar unter AA ist nichts.
- Weich: gleichförmige Karten (10 Markenkarten in `desktop__00`). Das ist teilweise getragen: Auswahlkarten sind Funktion. Am Desktop beherrschen sie in 2 × 5 Reihen aber die erste Bildschirmhöhe, und das ist nicht dicht und schnell im Sinn von K-003/4 (siehe Komposition 1).

**Befunde**
1. Komposition · `desktop__00/01`, `tablet__00` · Das Formular läuft über 12 Spalten. Die Schrittleiste bricht nach „11. Preis“ um, und der Weiter-Balken liegt unter dem Falz. · Formularspalte `lg:col-span-8`, die 13 Schritte als senkrechte Liste in `lg:col-span-4` klebend rechts (behebt den Umbruch), Markenraster `lg:grid-cols-3`. Weiter als Knopf `lg` rechtsbündig, Zurück links in derselben Zeile (`flex justify-between`) statt Vollbreitenbalken.
2. Komposition · `schritte/11`, `/12`, `/13` · Vier bis fünf gerahmte Kästen folgen aufeinander (Grundlage, Preisrahmen, Hinweis zu Ihrem Fall, Prüfung vor der Ausführung; Termin: langer Kasten „Frühester Termin …“ vor der Datumsleiste). · Grundlage als `SummaryList`-Zeilen ohne Rahmen, nur Preisrahmen und Warnung behalten einen Rahmen. In Schritt 13 steht die Datumsleiste direkt unter der h2, der Hinweis folgt als Zeile mit `GlyphInfo` darunter. So liegen die Zeitfenster in der ersten Bildschirmhöhe.
3. Komposition · `desktop__01` · Das klebende Schrittband liegt ohne Grundfläche auf den Karten, und deren Kanten ragen am Band heraus. · Klebendes Band über die volle Breite auf `bg-background` mit Haarlinie unten, wie mobil (`mobil__01`), dazu `scroll-mt` für die Schritt-h2.
4. Typografie · `desktop__00`, `tablet__00` · Der Kastentitel „AUTOSCHLÜSSEL: ANFRAGE MIT TERMIN“ wiederholt Augenbraue und h1. · Titelzeile streichen und links „Schritt 1 von 13 · Marke“ setzen, wie mobil (`mobil__00`). Rechts entfällt die Doppelung.
5. Typografie · `schritte/03` · Die h2 „Baujahr beziehungsweise Erstzulassung“ und das Label „Baujahr beziehungsweise Jahr der Erstzulassung *“ sagen dasselbe zweimal. · Label kürzen auf „Jahr *“ (Mikrotext), die h2 trägt das Thema.
6. Typografie · `mobil__00/01` · In jeder Markenkarte bricht „5 Modelle / hinterlegt“ um, „Mercedes-/Benz“ ebenso, und die Karten werden 104 px hoch. · Anzahl als `font-mono tabular-nums text-small` „5 Modelle“ einzeilig, ohne „hinterlegt“ (Mikrotext). Die Karten sinken auf 72 px.
7. Farbe und Bild · `schritte/11`, `/12` · „Hinweis zu Ihrem Fall“ und „Wofür die Anzahlung steht“ tragen eine blaue Leiste und einen Rahmen wie Warnungen und konkurrieren mit dem Primärknopf. · Beide als Zeile mit `GlyphInfo` in `foreground-muted` ohne Rahmen. Die 2-px-Leiste bleibt allein der Warnung „Online-Zahlung ist noch nicht eingerichtet“ (K-006, Flächen sparsam).
8. Grafik · `schritte/05` · Die Schlüsselzeichnung (rund 60 px) steht rechts im Kartentext, und „Keyless (schlüsselloser Zugang)“ bricht mobil dreizeilig. · Zeichnung als Band über die Kartenbreite oben in der Karte (Höhe 48–56 px, 16:9-Ausschnitt), Text darunter in voller Breite. Am Desktop dürfen die Karten dafür `grid-cols-2` bleiben.
9. Grafik · `schritte/08` · Vier Fotovorlagen in voller Breite und hoch, die Seite wird fast 7000 px lang. · Ab `sm` die Vorlage auf 5 Spalten neben den beiden Knöpfen (7 Spalten), mobil als Ausschnitt mit fester Höhe (`max-h-40`, `.sm24-ausschnitt`).
10. Details · `schritte/13` · Die Seite ist 392 px breit bei 390 px Ansicht und scrollt seitlich um 2 px (vermutlich die Datums- oder Zeitleiste). · Die Leiste mit `-mx-5 px-5` in eine Hülle mit `overflow-x-auto` setzen, kein Kind mit `w-full` plus Rand. Prüfen, dass `scrollWidth` gleich der Ansichtsbreite ist.
11. Details · `desktop__00`, `tablet__00` · Der Kopfknopf „Termin starten“ steht leuchtend neben dem laufenden Terminablauf. · Auf Ablaufseiten den Kopfknopf ausblenden oder als `secondary` zurücknehmen, damit nur „Weiter“ primär ist.
12. Details · `schritte/10` · PLZ (5 Ziffern) und Ort stehen mobil je in voller Breite. · `grid-cols-3`: PLZ eine Spalte, Ort zwei Spalten (wie Kasse Desktop `kasse-gefuellt__desktop__01`).

**Das Stärkste**
- Die mobile Ablaufführung: klebendes Band „Schritt 1 von 13 · Marke“ mit Fortschritt oben, Leiste ← / Weiter unten, gesperrter Zustand als ruhige Fläche mit Grund („Bitte wählen Sie zuerst eine Marke aus.“) – `mobil__00/01`.
- Fachgrafik genau dort, wo sie Arbeit abnimmt: Schlüsselarten und Fotovorlagen als Zeichnung (`schritte/05`, `/08`) und die Datumsleiste mit Anschnitt und Mono-Zeitfenstern (`schritte/13`).

---

## H07 · Zylinder-Konfigurator

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Werte konsequent in Mono („ab 39,00 €“, „35 mm“, Kennzahlleiste, „1 × 39,00 € = 39,00 €“ in `schritte/18`). Dagegen stehen Zahlen im Fließtext in Inter und brechen von der Einheit weg („Bis 70 / mm“, `desktop__01`), die Zeichnung schreibt „I 35“, die Felder „Maß B“. |
| Komposition | 6 | Drei Rahmen ineinander (Positionskarte → Maßfläche → Zeichnungskarte, `desktop__01`), dazu der Kasten „So messen Sie richtig“, der den Text unter den Feldern doppelt, und eine laufende Summe, die mobil wegscrollt, während die Leiste unten nur „Weiter“ zeigt. |
| Farbe und Bild | 8 | K-003/3 präzise umgesetzt: Bereichsorange nur in Augenbraue und Zeichnung (Bart, Maßpfeile, Körperfläche), Aktionen bleiben Primärblau, Auswahl in `primary-soft`. |
| Bewegung | 7 | Register passt (B-17 Maß live, B-20 laufende Summe, B-10/B-11). In den Ganzseitenbildern `schritte/14` und `/18` steht die Maßzeichnung aber blass und ohne Bemaßung, was auf einen Einstiegsauftritt beim Sichtbarwerden hindeutet, den eine Arbeitsansicht nicht haben soll (K-007). |
| Grafik | 8 | Die Maßzeichnung mit live gesetzten Maßen A/I, Stulpschraube, Achsenlinie und Hinweis „SCHEMATISCH – MASSGEBLICH SIND DIE GEWÄHLTEN MASSE“ ist Werkstattzeichnung im Sinn der Leitidee und kehrt in der Zusammenfassung wieder. |
| Details | 6 | „auf alle 1 Zylinder“ (`schritte/16`), „02 WEITERLESEN“ ohne sichtbare 01 (`desktop__02`), Weiter in `schritte/17` als halbtransparentes Blau statt der ruhigen Sperrfläche aus H04. |

**Ansichtswert: 7,0**

**Generisch-Katalog**
- Hart: keine.
- Weich: drei gleich gebaute Bauformkarten nebeneinander (`desktop__01`). Getragen, denn das ist die Auswahl selbst, mit Preis in Mono und Unterschied im Text.

**Befunde**
1. Komposition · `desktop__01`, `mobil__02` · Die Zeichnung steckt in einer Karte, in einer getönten Fläche, in der Positionskarte. · Zeichnung ohne Kartenrahmen direkt auf Papier (K-006, Kopf mit Blickfang: „ohne Kartenrahmen“). Die Maßfläche wird ein Abschnitt der Positionskarte mit Haarlinie oben statt `surface-muted`-Kasten. Teilung 7/5 bleibt.
2. Komposition · `desktop__00`, `mobil__01` · Der Kasten „So messen Sie richtig“ wiederholt den Text unter den Maßfeldern und schiebt Position 1 aus der ersten Bildschirmhöhe. · Kasten entfernen und durch eine Zeile mit `GlyphLineal` ersetzen, die auf die vorhandene Reihe „Zylinder richtig ausmessen“ verweist. Der Messtext unter den Feldern bleibt die einzige Stelle.
3. Komposition · `mobil__00–03` · Die laufende Summe „39,00 €“ scrollt weg, die Leiste unten zeigt nur „Weiter“. · Leiste wie im Warenkorb (`warenkorb-gefuellt__mobil__00`): links „Summe 39,00 €“ in Mono, rechts Weiter. Am Desktop wird die Kennzahlleiste Teil des klebenden Schrittbands.
4. Typografie · `desktop__01`, `mobil__02` (Text unter den Maßfeldern) · „Bis 70 / mm“ und „je angefangene 5 / mm“ brechen zwischen Zahl und Einheit, die Zahlen stehen in Inter. · `70 mm`, `3,50 €`, `5 mm` als `font-mono tabular-nums` mit geschütztem Leerzeichen.
5. Typografie · `desktop__01` · Die Zeichnung beschriftet „A 35 | I 35“, die Felder und „So messen“ nennen „Maß A / Maß B“. · Eine Bezeichnung überall: Zeichnung „B 35“ oder Felder „Maß I (innen)“.
6. Typografie · `desktop__00` · Der Kastentitel „GLEICHSCHLIESSENDE ZYLINDER“ wiederholt die h1. · Titel streichen, links „Schritt 1 von 5 · Zylinder“ wie mobil.
7. Bewegung · `schritte/14`, `schritte/18` · Die Maßzeichnung erscheint blass, ohne Maßpfeile und Beschriftung, solange sie nicht im Blick war (in `desktop__01` vollständig). · Im Konfigurator keinen Einstiegsauftritt: Die Zeichnung steht sofort vollständig, Bewegung nur als B-17 (Überblendung `quick`) bei Maßänderung.
8. Details · `schritte/16` · „Optionen mit Preis je Zylinder werden auf alle 1 Zylinder dieser Bestellung gerechnet.“ · Mikrotext mit Zahlwechsel: bei 1 „auf den Zylinder dieser Bestellung“, ab 2 „auf alle 3 Zylinder“.
9. Details · `desktop__02`, `mobil__03` · Die Augenbraue „02 WEITERLESEN“ steht ohne sichtbare 01. · Laufende Nummer bei 01 beginnen oder dem Konfigurator selbst „01“ geben, so wie H04 „01 WEITERFÜHREND“ führt.
10. Details · `schritte/17` · Weiter wirkt halbtransparent blau. Gesperrt sieht damit anders aus als in H04 (`mobil__00`: ruhige Fläche mit Grund darüber). · Eine Sperrform für alle Abläufe: `bg-surface-muted text-foreground-muted`, Grund als Zeile darüber.

**Das Stärkste**
- Die Maßzeichnung (`desktop__01`): Bereichsorange, Bemaßung in Mono, live aus den Feldern – man sieht die Genauigkeit, bevor man sie liest.
- Die Kennzahlleiste ZYLINDER · SCHLÜSSEL · OPTIONEN · LAUFENDE SUMME mit Haarlinien und Mono (`desktop__00`, mobil 2 × 2 in `mobil__00`) und die Zusammenfassung als Rechnung „1 × 39,00 € = 39,00 €“ (`schritte/18`).

---

## H10 · Warenkorb

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | Präzise: Beträge in Mono rechtsbündig, „Gesamtsumme 20,95 €“ groß in Textfarbe, „8,00 € je Stück“ als kleine Mono-Zeile, „Positionen (1)“ mit Mono-Zähler (`warenkorb-gefuellt__desktop__00`). |
| Komposition | 7 | Die 8/4-Teilung mit Summenspalte und die mobile Summenleiste tragen. Versandart steht aber als Karte mit Karten darin, „Passend dazu“ läuft als 3-Spalten-Raster mit Lücke (3 + 2), und im leeren Zustand bleibt die Einleitung „Prüfen Sie Ihre Positionen …“ stehen. |
| Farbe und Bild | 7 | Grundsätzlich ruhig, aber die Linkreihen „Passend dazu“ stehen ganz in `text-primary` (`desktop__01`, `mobil__02`). Fünf blaue Zeilen konkurrieren mit „Zur Kasse“, und andere Ansichten setzen solche Reihen in Textfarbe mit blauem Pfeil. |
| Bewegung | 8 | B-20 deckt genau die Zustandswechsel dieser Ansicht ab (Zähler `sm24-pop`, Summen mit Schleier), dazu B-05/B-06. Es gibt keine Inszenierung. |
| Grafik | 7 | Die Schlüsselzeichnung als Positionsbild (`warenkorb-gefuellt__desktop__00`) ist eigen. Der leere Zustand zeigt nur ein 36-px-Taschen-Icon und hat keinen Charakter (K-009). |
| Details | 7 | Preis „0,00 €“ bei Abholung bricht mobil in eine eigene Zeile (`mobil__01`), „Versand (Versand verfolgbar)“ doppelt, die Metazeile wiederholt den Titel. |

**Ansichtswert: 7,3**

**Generisch-Katalog**
- Hart: keine.
- Weich: keine Treffer. Der leere Zustand ist nah an „Icon + Satz + zwei Knöpfe“, aber eine Arbeitsansicht und kein abstrakter Hintergrund.

**Befunde**
1. Komposition · `warenkorb-gefuellt__desktop__00/01`, `__tablet__00` · Versandart ist eine Karte mit drei Karten darin. · Versandart als Abschnitt mit Haarlinie oben wie „Positionen“, Überschrift `text-title-sm`, die Radiokarten direkt auf dem Grund.
2. Komposition · `H10-warenkorb__desktop__00`, `__mobil__00` · Im leeren Zustand fordert die Einleitung „Prüfen Sie Ihre Positionen, wählen Sie die Versandart …“ zu etwas auf, das es nicht gibt. Die leere Karte hat rechts die halbe Breite Luft. · Einleitung im leeren Zustand ausblenden (Variante `korb-leer:` auf den Kopf ausdehnen). Die Karte wird einzeilig: Zeichnung links (3 Spalten), Satz und Knöpfe rechts.
3. Komposition · `warenkorb-gefuellt__desktop__01/02` · „Passend dazu“ hat weder Augenbraue noch Nummer und steht als 3-Spalten-Raster mit Loch. · `SectionHeading nummer` („01 Weiterlesen“ wie H07) mit einspaltigen Reihen, oder wie im leeren Zustand als 4-Spalten-Liste unter der Summenspalte. Leer und gefüllt sollen gleich gebaut sein.
4. Farbe und Bild · `warenkorb-gefuellt__desktop__01/02`, `__mobil__02`, `H10-warenkorb__desktop__00` · Die Titel der Linkreihen stehen in `text-primary`. · Titel `text-foreground`, nur `GlyphPfeilRechts` in Primär (Muster H04 `desktop__01`). Blau bleibt für „Zur Kasse“.
5. Grafik · `H10-warenkorb__desktop__00`, `__mobil__00` · Der leere Zustand zeigt nur das Taschen-Icon in 36 px. · Die vorhandene Schlüsselzeichnung als Rohling (gestrichelte Einschnittzone wie vor der Code-Eingabe bei B-15), etwa 160 px breit, ohne Rahmen, links vom Satz. Das Taschen-Icon bleibt dem Kopf vorbehalten.
6. Details · `warenkorb-gefuellt__mobil__01` · Bei „Abholung im Fachbetrieb“ rutscht „0,00 €“ in eine eigene Zeile, bei „Paket versichert“ steht der Preis in derselben Zeile. · Preis `whitespace-nowrap` und mobil für alle Optionen in eine eigene rechte Spalte (`flex justify-between` in der Titelzeile).
7. Details · `warenkorb-gefuellt__desktop__00` (Summenspalte) · Die Zeile lautet „Versand (Versand verfolgbar)“. · Mikrotext „Versand · verfolgbar“ oder zweizeilig wie in der Kasse (Angabe klein, Betrag Mono).
8. Details · `warenkorb-gefuellt__desktop__00`, `__mobil__00` · Die Metazeile „Möbel- und Büroschloss: Büroschrank und Rollcontainer · Möbelschlüssel“ wiederholt den Titel über drei Zeilen. · Nur „Möbelschlüssel“ neben der Plakette „Schlüssel nach Code“, das spart zwei Zeilen je Position.

**Das Stärkste**
- Die mobile Summenleiste „Gesamtsumme 20,95 € · Zur Kasse →“ (`warenkorb-gefuellt__mobil__00–04`): Handlung und Betrag in der Daumenzone.
- Die Summenspalte (`warenkorb-gefuellt__desktop__00`): Haarlinien, Mono rechtsbündig, Endsumme in Textfarbe und Umsatzsteuer klein darunter – bemaßt statt behauptet.

---

## H11 · Kasse

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Mono-Beträge und nummerierte Formularabschnitte (01–03) sind sauber. Die Summe heißt hier „Gesamtbetrag“ und im Warenkorb „Gesamtsumme“, „3,34 € (19 %)“ mischt Mono und Inter, in der Kontaktliste steht „Deutschland“ größer und dunkler als die übrigen Werte (`kasse-gefuellt__desktop__01`). |
| Komposition | 7 | Die 8/4-Teilung mit klebender Bestellübersicht trägt, und die Warnung steht im Muster (2-px-Leiste, 8 Spalten). Mobil wiederholt die Übersicht am Ende aber jede Zeile zweizeilig und linksbündig über fast zwei Bildschirmhöhen (`mobil__03/04`), und die leere Kasse spannt eine Karte über 12 Spalten mit Inhalt nur links. |
| Farbe und Bild | 8 | Diszipliniert: Warnfarbe nur als Leiste und Glyphe, Blau nur für Aktion und Links im Satz, „Rechtliche Hinweise“ in Textfarbe mit blauem Pfeil. |
| Bewegung | 8 | B-20 (Summen) und B-19 (Laden beim Absenden) passen. Es gibt keine Inszenierung, wie es die Kasse verlangt. |
| Grafik | 6 | Kein Teil des Formsystems sichtbar: Der Artikel in der Bestellübersicht hat kein Positionsbild, obwohl der Warenkorb eines hat, und die leere Kasse zeigt das allgemeine Taschen-Icon. |
| Details | 7 | „Rechtliche Hinweise“ ohne Nummer nach 01–03, die Einleitung sitzt unter dem Kopf statt darin (anders als H10), und der Artikeltitel bricht im 4-Spalten-Rand dreizeilig. |

**Ansichtswert: 7,2**

**Generisch-Katalog**
- Hart: keine.
- Weich: keine Treffer.

**Befunde**
1. Komposition · `kasse-gefuellt__mobil__03/04` · Die Übersicht am Ende setzt jede Zeile zweizeilig (Angabe über Betrag), Beträge linksbündig. Fünfmal steht „Noch nicht ausgefüllt“, und der Block wird rund 1300 px hoch. · Zeilen einzeilig `flex justify-between`, Beträge rechtsbündig in Mono (K-006 Werte), zweizeilig nur „Versand“. Den Kontaktblock mobil auf eine Zeile verdichten oder weglassen, denn das Akkordeon „Bestellübersicht · 20,95 €“ oben (`mobil__00`) deckt ihn ab.
2. Komposition · `H11-kasse__desktop__00` · Die leere Karte läuft über 12 Spalten, Inhalt nur auf den linken 470 px. · Gleicher Bau wie der leere Warenkorb (`H10-warenkorb__desktop__00`): Karte 8 Spalten, „Rechtliche Hinweise“ als 4-Spalten-Liste daneben.
3. Komposition · `kasse-gefuellt__desktop__00`, `__tablet__00` · Die Einleitung „Bitte geben Sie Ihre Kontakt- und Lieferdaten an …“ steht unter dem Kopfband im Inhalt, im Warenkorb dagegen im Kopf. · Einleitung in den `PageHeader` wie in H10. Die Warnung rückt damit an den Anfang des Inhalts.
4. Typografie · `kasse-gefuellt__desktop__00` · „Gesamtbetrag“ steht gegen „Gesamtsumme“ (Warenkorb), „darin enthaltene Umsatzsteuer“ bricht zweizeilig, und „(19 %)“ steht in Inter neben Mono. · Einheitlich „Gesamtsumme“, USt-Zeile `text-small` einzeilig, Prozentangabe in Mono.
5. Typografie · `kasse-gefuellt__desktop__01`, `__mobil__04` · In „Kontakt und Lieferanschrift“ steht „Deutschland“ in `text-body`/Textfarbe, „Noch nicht ausgefüllt“ in `text-small`/gedämpft. · Alle Werte `text-small`. Gefüllt in `foreground`, offen in `foreground-muted`, dieselbe Größe.
6. Grafik · `kasse-gefuellt__desktop__00`, `__mobil__03` · Der Artikel in der Bestellübersicht hat kein Bild, der Warenkorb zeigt die Schlüsselzeichnung. · Dasselbe Positionsbild in 48 px links neben dem Titel, damit der Gegenstand bis zur Bestellung sichtbar bleibt.
7. Grafik · `H11-kasse__desktop__00`, `__mobil__00` · Im leeren Zustand steht nur das Taschen-Icon. · Dieselbe Rohling-Zeichnung wie für den leeren Warenkorb vorgeschlagen.
8. Details · `kasse-gefuellt__desktop__02/03`, `__mobil__04` · „Rechtliche Hinweise“ folgt ohne Augenbraue und Nummer auf 01–03. · `SectionHeading nummer` „04“, damit die Ordnung durchläuft (K-006).
9. Details · `kasse-gefuellt__desktop__00` · Der Artikeltitel „Büroschrank und Rollcontainer — Serie MS-01“ bricht im Rand dreizeilig, „MS-01“ beginnt eine eigene Zeile. · Titel `text-small font-medium`, Kennung `whitespace-nowrap` am Zeilenende, „Code 0812 · 2 Stück“ vollständig in Mono.

**Das Stärkste**
- Die Bestellübersicht als bemaßte Liste (`kasse-gefuellt__desktop__00/01`): Haarlinien, Beträge zweizeilig in Mono, Endsumme groß in Textfarbe, klebend neben dem Formular.
- Die Warnung „Zahlung derzeit nicht online möglich“ als Fläche mit 2-px-Warnleiste in 8 Spalten und das mobile Akkordeon „Bestellübersicht · 20,95 €“ (`mobil__00`).

---

## Gruppe „arbeit“ · Mittel und wirksamste Änderungen

| Ansicht | Typo | Komp. | Farbe | Bewegung | Grafik | Details | Wert |
|---|---|---|---|---|---|---|---|
| H04 Assistent | 7 | 6 | 7 | 8 | 7 | 6 | 6,8 |
| H07 Zylinder-Konfigurator | 7 | 6 | 8 | 7 | 8 | 6 | 7,0 |
| H10 Warenkorb | 8 | 7 | 7 | 8 | 7 | 7 | 7,3 |
| H11 Kasse | 7 | 7 | 8 | 8 | 6 | 7 | 7,2 |

**Mittel der Gruppe: 7,1**

**Die drei wirksamsten Änderungen**
1. **Desktop-Raster der Abläufe (H04, H07):** Formular in 8 Spalten, Schrittliste als senkrechte Liste und laufende Summe in einer klebenden 4-Spalten-Seite, Weiter als rechtsbündiger Knopf mit Zurück in derselben Zeile statt 1176-px-Balken. Den Kastentitel streichen, das Band zeigt „Schritt n von m · Name“ wie mobil. Mobil bekommt der Konfigurator die Summenleiste des Warenkorbs.
2. **Flächen entschachteln (H04, H07, H10, H11):** Kein Rahmen im Rahmen (Maßfläche → Zeichnungskarte, Versandart → Radiokarten). Hinweise ohne Anlass als Zeile mit Glyphe statt blau geleistetem Kasten (H04 Schritte 11–13, H07 „So messen“). Zeichnungen stehen ohne Kartenrahmen auf Papier.
3. **Ein Satz Kleinteile für alle Arbeitsansichten:** Linkreihen in Textfarbe mit blauem Pfeil, eine Sperrform für Weiter, ein Summenbegriff („Gesamtsumme“), laufende Abschnittsnummern ab 01 bis zu den Rechtlichen Hinweisen, Zahl und Einheit untrennbar in Mono. Den leeren Zuständen von Warenkorb und Kasse den Schlüssel-Rohling als Zeichnung geben.

---

## Abgleich mit E4-L-23

Diesen Bericht habe ich erst nach meinem Urteil gelesen. Werte und Befunde oben bleiben unverändert. Die Werte steigen von 6,2 / 6,8 / 6,0 / 6,5 (Mittel 6,4) auf 6,8 / 7,0 / 7,3 / 7,2 (Mittel 7,1).

**H04 Assistent (6,2 → 6,8)**
- Behoben:
  - Terminwahl als 14 292-px-Liste. Jetzt Tagesleiste mit Anschnitt und Zeitfenster des gewählten Tags, Seite rund 3560 px (`schritte/13`).
  - Mobile Markenkarten als Stapel. Jetzt `grid-cols-2` (`mobil__00/01`).
  - Ablauftitel und Schrittzähler mobil zweizeilig. Jetzt einzeilig „Schritt 1 von 13 · Marke“.
  - h2 „Passende Seiten …“ in h1-Größe. Jetzt kleiner (`desktop__01`).
  - Gesperrter Weiter in blassem Blau. Jetzt ruhige Fläche mit Grund (`mobil__00`).
  - Schrittname fehlte mobil (Bewegung).
  - Schlüsselarten nur als Text. Jetzt mit Zeichnung (`schritte/05`).
  - Zurück auf Schritt 1. Ausgeblendet, Weiter in voller Breite.
  - Zwischenstand-Kasten in jedem Schritt. Nicht mehr sichtbar.
- Teilweise:
  - Angeheftete Ablaufleiste. Angeheftet nur noch einzeilig mit Balken, rund 56 px (`desktop__01`). Im Ruhezustand bricht die Schrittliste aber weiter zweizeilig, und das Band liegt ohne Grundfläche auf den Karten (meine Befunde Komposition 1 und 3).
  - Getönte Kästen in Schritt 11. Terminlänge und Fahrzeug sind jetzt Zeilen mit Glyphe, Grundlage, Hinweis und Prüfung bleiben gerahmt, und Schritt 12 und 13 zeigen dasselbe Muster (meine Befunde Komposition 2, Farbe 7).
  - Zurück mobil ab Schritt 2. Weiter nur „←“ ohne sichtbaren Text (`schritte/02` ff.). Den Namen kann ich am Bild nicht prüfen.
- Bleibt: Profillinie unter der Augenbraue im Kopf fehlt (`desktop__00`). In meinem Urteil ist das kein eigener Befund, weil Arbeitsansichten ruhig bleiben sollen.
- Nicht beurteilbar: Bemaßungslinie Anzahlung ↔ Preisrahmen in Schritt 11. Im Ganzseitenbild verdeckt der mitgerissene Kopf die Stelle.

**H07 Zylinder-Konfigurator (6,8 → 7,0)**
- Behoben:
  - Werte der Zusammenfassung in Inter. Jetzt Mono (`schritte/18`).
  - Witwe „MASSE“. Jetzt einzeilig am Desktop, ausgeglichen mobil.
  - Leere im Maßfeld. Jetzt Teilung Felder/Zeichnung (`desktop__01`).
  - Musterzeichnung 30/30. Entfallen.
  - Beschriftungen mobil 7 px. Jetzt rund 12 px (`mobil__02`).
  - Live-Zeichnung in der Zusammenfassung. Vorhanden (`schritte/18`).
  - Warnung im Abschlussschritt als Fläche. Jetzt Zeile mit Glyphe.
  - Laufende Summe ohne Rückmeldung. B-20 schließt sie laut Register 1.13 ein.
  - Durchscheinende Leiste. Jetzt deckend.
  - Endsumme in Primärblau. Jetzt Textfarbe.
- Teilweise:
  - Doppelte Zeichnung. Die zweite Zeichnung ist weg, der Messtext im Kasten „So messen Sie richtig“ doppelt aber weiter den Text unter den Feldern (mein Befund Komposition 2).
  - Weiterführender Block. Er hat jetzt Augenbraue, Nummer und Haarlinien wie H04. Wortlaut, Pfeilfarbe und Nummer (02 ohne 01) weichen aber ab (mein Befund Details 9).
- Nicht belegt: Zurück mobil ab Schritt 2. Die mobilen Schrittbilder fehlen für H07, am Desktop steht „← Zurück“ mit Text.
- Neu in meinem Urteil: Einstiegszustand der Zeichnung, gestapelte Rahmen, Summe nicht in der mobilen Leiste, A/I gegen A/B, „alle 1 Zylinder“.

**H10 Warenkorb (6,0 → 7,3)**
- Behoben:
  - 8/4-Teilung. Versandart links, Summe und „Zur Kasse“ rechts (`warenkorb-gefuellt__desktop__00`).
  - Mobile Summenleiste. „Gesamtsumme 20,95 € · Zur Kasse“.
  - Leerkarte. Jetzt 8 Spalten mit „Passend dazu“ rechts.
  - „Weiter einkaufen“. Jetzt einzeilig.
  - Betrag mobil. Steht rechts neben dem Stepper.
  - Preisberechnungshinweis. Jetzt Zeile mit Glyphe statt Kasten.
  - B-20 auf Summen. Laut Register.
  - Positionsbild. Jetzt Schlüsselzeichnung auf Raster. Ob es aus dem Code 0812 abgeleitet ist, kann ich am Bild nicht prüfen.
  - Leer-Icon und Kopf-Icon. Jetzt beide die Tasche.
  - „Position entfernen“. Steht jetzt am Ende der Position.
- Bleibt: Die Einleitung „Prüfen Sie Ihre Positionen …“ über dem leeren Korb (mein Befund Komposition 2).

**H11 Kasse (6,5 → 7,2)**
- Behoben:
  - Mobiles Akkordeon „Bestellübersicht · 20,95 €“ (`kasse-gefuellt__mobil__00`).
  - Bestätigungskarten gleich breit, InfoTip in der Karte.
  - Endsumme in Textfarbe auf allen drei Ansichten.
  - Abschnittsnummern mit Bemaßungsmarke.
  - „Noch nicht ausgefüllt“ jetzt gedämpft.
  - Leerzustand mit Icon und ohne unpassende Einleitung (`H11-kasse__desktop__00`).
  - „Gesamtbetrag 20,95 €“ mobil direkt über dem Knopf (`mobil__04`).
- Teilweise:
  - Mono/Inter und Ausrichtung. Am Desktop jetzt Beträge zweizeilig rechtsbündig in Mono. „3,34 € (19 %)“ mischt weiter, und mobil steht die Übersicht am Ende linksbündig und zweizeilig (meine Befunde Typografie 4, Komposition 1).
  - Bruch „MS- / 01“. Die Kennung bricht nicht mehr, der Titel läuft aber dreizeilig (mein Befund Details 9).
- Neu in meinem Urteil: Leerkarte über 12 Spalten, Einleitung außerhalb des Kopfs, „Deutschland“ in anderer Größe, fehlendes Positionsbild, „Rechtliche Hinweise“ ohne Nummer.

=== ENDE E5-L-29 · BEREIT ZUR RÜCKGABE ===
