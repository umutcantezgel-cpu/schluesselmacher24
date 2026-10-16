# E4-L-23 · Sichtabnahme · Gruppe „arbeit“

Prüfer: frischer, unabhängiger Gestaltungsprüfer · Grundlage: `_werkstatt/KERN.md` (K-001, K-003, K-006 bis K-009), Paket E4-L-23 · Ansichten: H04-assistent, H07-zylinder-konfigurator, H10-warenkorb, H11-kasse (alle Arbeitsansichten nach K-009, Maßstab daher Ruhe, Dichte und Tempo).

## Angesehene Bilder

- **H04:** `H04-assistent__desktop__00` bis `__03`, `H04-assistent__mobil__00` bis `__04`, `H04-assistent__tablet__00` (Umbruchprüfung), `schritte/01-…` bis `schritte/13-termin-auswählen` (13 ganze Seiten, mobil)
- **H07:** `H07-zylinder-konfigurator__desktop__00` bis `__04`, `__mobil__00` bis `__06`, `schritte/15-gemeinsame-schlüssel`, `schritte/16-schutz-und-optionen`, `schritte/18-prüfen-und-in-den-warenkorb-legen`
- **H10:** `H10-warenkorb__desktop__00` und `__01`, `__mobil__00` bis `__02`, `gefuellt/warenkorb-gefuellt__desktop__00` bis `__02`, `__mobil__00` bis `__04`, `__tablet__00` (Umbruchprüfung)
- **H11:** `H11-kasse__desktop__00` und `__01`, `__mobil__00` bis `__02`, `gefuellt/kasse-gefuellt__desktop__00` bis `__03`, `__mobil__00` bis `__06`
- Ergänzend gelesen: `_werkstatt/protokolle/E4-PRUEFER-B-a11y.log`, um den Befund zum Zurück-Knopf zuzuordnen.
- Nicht angesehen: Die E0-Bilder habe ich bewusst ausgelassen; sie dienen nur zur Einordnung und sind kein Maßstab. Für diese Gruppe gibt es keine Einzelbilder. Bewegung bewerte ich deshalb am Register (B-09, B-10, B-11, B-12, B-17, B-19, B-20) und an den sichtbaren Zustandsträgern.

Hinweis zu den Ganzseitenbildern unter `schritte/`: Kopf und Aktionsleiste stehen dort mitten im Bild. Das kommt von der Aufnahme und ist kein Befund. Die Testeingaben (Erika Mustermann, Verlaufs-Testbild, Upload-Fehler ohne Upload-Ziel) stammen vom Prüflauf und sind ebenfalls kein Inhaltsbefund.

---

## H04 · Autoschlüssel-Assistent

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Die Augenbraue in Mono, die nummerierte Schrittliste und „Schritt 1 von 13“ wirken bemaßt (desktop__00). Mobil brechen Ablauftitel und Schrittzähler zweizeilig (mobil__00), und die h2 „Passende Seiten…“ ist so groß wie die h1 (desktop__01). |
| Komposition | 6 | Die Einspaltigkeit ist ruhig. Die Terminwahl ist aber eine Liste über 14 292 px (schritte/13), die angeheftete Ablaufleiste belegt rund 125 px (desktop__01), und mobil stapeln sich zwölf Markenkarten (mobil__01). |
| Farbe und Bild | 6 | Stahlblau ist sauber gesetzt. Der gesperrte „Weiter“-Knopf wirkt in blassem Blau wie defekt (mobil__00), und in Schritt 11 stehen vier verschieden getönte Kästen ohne Bedeutungsunterschied untereinander (schritte/11). |
| Bewegung | 7 | Laut Register sind der Fortschritt (B-10) und der Schrittwechsel (B-11) richtig ruhig angelegt. Mobil fehlt dem Balken aber der Schrittname, sodass die Bewegung nicht erklärt, wohin man gewechselt hat (mobil__00). |
| Grafik | 5 | In 13 Schritten steht keine einzige Fachgrafik. Die Schlüsselarten werden nur als Text gewählt (schritte/05), obwohl die Formensprache (B-21) dafür existiert. |
| Details | 6 | Mobil ist der Zurück-Knopf nur ein Pfeil (mobil__00, axe button-name critical). Der Hinweis zum Zwischenstand bleibt in jedem Schritt stehen (schritte/02 bis 13). |

**Ansichtswert: 6,2**

**Harter Katalog:** keine. Der gesperrte „Weiter“-Knopf hat zwar wenig Kontrast, als deaktiviertes Element fällt er aber nicht unter AA. Er steht trotzdem als Befund unter Farbe.
**Weicher Katalog:** Gleichförmige Karten (zwölf gleiche Markenkarten, mobil__01). In einer Auswahl trägt die Leitidee das grundsätzlich (dicht und ruhig), mobil ist der Stapel aber zu lang (K-003 Punkt 6). Floskeln: keine.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | schritte/13-termin-auswählen, ganze Seite (390 × 14 292 px) | Alle Tage und Uhrzeiten über rund zwei Monate stehen in einer senkrechten Liste. Bis zum Abschluss sind es etwa 35 Bildschirmhöhen. | Tage als horizontale Leiste `snap-x scroll-px-5 sm:scroll-px-6` mit Tageskarten (Wochentag und Datum in Mono). Darunter nur die Zeiten des gewählten Tags als Raster `grid-cols-3 gap-2` (mobil) bzw. `lg:grid-cols-6`. Der erste freie Tag ist vorgewählt. |
| Komposition | desktop__01, angeheftete Ablaufleiste y 82–205 | Die Schrittliste bricht auf 1440 px in zwei Zeilen. Angeheftet belegt die Leiste rund 125 px und deckt die Markenkarten halb ab. | Angeheftet nur eine Zeile mit Titel, Balken und „Schritt 1 von 13 · Marke“ (rund 56 px). Die volle Schrittliste erscheint nur im nicht angehefteten Zustand, erledigte Schritte werden zu ✓ verdichtet. |
| Komposition | mobil__01, Markenliste | Zwölf gleich hohe Karten (je rund 84 px) ergeben rund 1000 px Scrollweg für eine einzige Wahl. | Marken mobil als `grid-cols-2 gap-2` setzen und „n Modelle hinterlegt“ als `text-caption` in `foreground-muted`. Das halbiert die Höhe. |
| Typografie | mobil__00, Ablaufkopf y 380–415 | „AUTOSCHLÜSSEL: ANFRAGE / MIT TERMIN“ und „Schritt 1 / von 13“ brechen beide zweizeilig. | Den Ablauftitel mobil ausblenden (er steht schon in der h1). „Schritt 1 von 13 · Marke“ einzeilig, `text-caption` Mono, `whitespace-nowrap`. |
| Typografie | desktop__01 y 580–620 | Die h2 „Passende Seiten zu diesem Ablauf“ hat die Größe der h1 (`text-headline`) und konkurriert mit dem Formular. | Auf `text-title` setzen, wie den gleichen Block in H07. Die Augenbraue bleibt. |
| Farbe und Bild | mobil__00 und desktop__01, Knopf „Weiter“ deaktiviert | Weiße Schrift auf blassem Primärblau liest sich wie ein defekter Hauptknopf. | Deaktiviert `bg-surface-muted text-foreground-muted border-border`. Der Hinweis „Bitte wählen Sie zuerst eine Marke aus.“ bleibt darüber. |
| Farbe und Bild | schritte/11, unter dem Preis | Vier getönte Kästen (Hinweis, Terminlänge, Fahrzeug, Prüfung) wechseln die Fläche ohne Bedeutungsunterschied. | Terminlänge und „Fahrzeug beim Termin“ als Zeilen eines Schriftfelds (`SummaryList`, Haarlinien, Mono-Werte) direkt unter dem Preis. Nur „Hinweis für Ihren Fall“ bleibt ein Alert. |
| Bewegung | mobil__00, Fortschrittsbalken | Mobil gibt es nur den Balken (B-10). Der Wechsel erklärt nicht, in welchem Schritt man ist. | Den Schrittnamen neben „Schritt n von 13“ zeigen und ihn mit B-11 wechseln (Überblendung plus 8 px, `base`). |
| Grafik | schritte/05, Optionen der Schlüsselart | Mechanisch, Funk, Klapp und Keyless stehen nur als Text, obwohl gerade hier Form unterscheidet. | In jeder Option links die Schlüsselart-Zeichnung aus dem vorhandenen Generator (B-21-Formen), 48 px, `text-area`. Gewählt erscheint die Profillinie in `stroke-primary`. |
| Grafik | schritte/11, Preisblock | „ab 249,00 €“ und die Anzahlung 69,90 € stehen unverbunden als Text. | Eine Bemaßungslinie aus `grafik-basis` als proportionaler Balken: „Anzahlung 69,90 €“ und „ab 249,00 €“ in Mono. Sie zeigt ohne neue Zahlen, dass die Anzahlung angerechnet wird. |
| Grafik | desktop__00, Kopf | Unter der Augenbraue „TERMIN MIT ANZAHLUNG“ fehlt das einzige Leitornament. | Die Profillinie klein (10 px, `stroke-area`) unter die Augenbraue setzen. Sie zeichnet sich einmal (B-02). |
| Details | mobil__00, Aktionsleiste links | Der Zurück-Knopf ist nur „←“ ohne Namen (axe critical) und hat auf Schritt 1 keine Funktion. | Sichtbar „Zurück“ in `text-small` neben den Pfeil setzen, mindestens `aria-label`. Auf Schritt 1 ausblenden und „Weiter“ volle Breite. |
| Details | schritte/02 bis 13, Kasten unter dem Fortschritt | „Ihr Zwischenstand von zuletzt wurde geladen. Weitermachen / Neu beginnen“ steht auch nach dem Weitergehen in jedem Schritt. | Nach dem ersten Schrittwechsel ausblenden. „Neu beginnen“ als Textknopf in die Ablaufleiste. |

**Das Stärkste**
- Die bemaßte Ablaufleiste in Mono mit nummerierten Schritten und „Schritt 1 von 13“ (desktop__00).
- Der Preisschritt mit „ab 249,00 €“ und „Anzahlung jetzt 69,90 €“ in Mono, ohne Floskeln (schritte/11).

---

## H07 · Zylinder-Konfigurator

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Die Kennzahlen-Leiste und die „ab“-Preise sind sauber in Mono gesetzt (desktop__00, desktop__01). Die Zusammenfassung fällt in Inter zurück (schritte/18), und die Bildunterschrift endet mit einem einzelnen „MASSE“ in der letzten Zeile (desktop__01). |
| Komposition | 7 | Die Leiste „Zylinder · Schlüssel · Optionen · Laufende Summe“ ist ein echter Blickfang (desktop__00). Im Maßfeld bleiben aber rund 200 px leer (desktop__01), und zwei fast gleiche Zeichnungen folgen aufeinander (desktop__00 und __01). |
| Farbe und Bild | 7 | Der Bereichsakzent Orange steht korrekt nur in Augenbraue und Grafik (desktop__01). Im Abschlussschritt liegen drei Flächentöne (Amber, Blau, Grau) in einem Bildschirm (schritte/18). |
| Bewegung | 7 | Das Register sieht B-17 (Maß live) als `quick`-Überblendung vor, das passt zur Arbeitsansicht. Die laufende Summe ändert sich dagegen ohne Rückmeldung (desktop__00). |
| Grafik | 7 | Die Live-Zeichnung mit A/I-Bemaßung auf Zeichenpapier ist die Leitidee wörtlich (desktop__01). Mobil sind die Beschriftungen nur rund 7 px hoch (mobil__01, mobil__02), und die Musterzeichnung zeigt 30/30, während 35/35 gewählt ist. |
| Details | 6 | Text scheint durch die angeheftete Leiste (desktop__01, mobil__03), mobil ist Zurück nur ein Pfeil (axe critical), und der weiterführende Block ist anders gebaut als in H04. |

**Ansichtswert: 6,8**

**Harter Katalog:** keine.
**Weicher Katalog:** Verdacht auf Glas. Die angeheftete Ablaufleiste wirkt halbtransparent, Textreste scheinen durch (desktop__01 rechts oben x ≈ 1000–1120, y ≈ 90; mobil__03 y ≈ 80). Die Leitidee trägt das nicht, K-003 Punkt 2 sagt ausdrücklich „Lassen: Glas“. Gleichförmige Karten: Die drei Bauform-Karten (desktop__01) sind eine echte Auswahl und vertretbar.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Typografie | schritte/18, Tabellen der Zusammenfassung | Die Werte „1 × 39,00 € = 39,00 €“, „3 Stück“, „0,00 €“ und „39,00 €“ stehen in Inter, Kennzahlen-Leiste und Zwischensumme dagegen in Mono. | Wertspalte `font-mono tabular-nums text-right`. |
| Typografie | desktop__01, Bildunterschrift der Zeichnung | „SCHEMATISCH – MASSGEBLICH SIND DIE GEWÄHLTEN / MASSE“ lässt das letzte Wort allein in der Zeile. | `text-balance` für die Unterschrift, oder die Zeichnung breiter setzen (siehe Komposition). |
| Komposition | desktop__01, Feld „Maße dieser Tür“ | Zwei Auswahlfelder nebeneinander, darunter rund 200 px Leere neben der Zeichnung. Die Erläuterung läuft quer über die volle Breite. | Zwölfer-Raster 5/7: Maß A, Maß B und Erläuterung untereinander in `lg:col-span-5`, die Zeichnung in `lg:col-span-7`, beide gleich hoch. |
| Komposition | desktop__00 und __01, mobil__01 und __02 | Zwei fast gleiche Zylinderzeichnungen stehen hintereinander, „So messen Sie richtig“ und die Live-Zeichnung. | Den „So messen“-Kasten als Akkordeon (B-09) geschlossen anbieten oder seine Zeichnung streichen. Der Text wandert neben die Live-Zeichnung: eine Zeichnung, eine Wahrheit. |
| Farbe und Bild | schritte/18, unterer Bildschirm | Amber-Warnkasten, graue Tabellenköpfe und blauer Hauptknopf auf einer Höhe, drei Flächen ohne Rangordnung. | Die Warnung „Anfertigung nach Ihren Maßen“ als Haarlinienzeile mit `GlyphWarnung` in `text-warning` direkt über dem Knopf, ohne Fläche. |
| Bewegung | desktop__00, Kennzahl „LAUFENDE SUMME 39,00 €“ | Die Summe ändert sich bei jeder Anpassung, im Blickfeld ohne Rückmeldung. | B-20 (`sm24-pop`, `quick`) auch auf die laufende Summe anwenden. Die Erweiterung des Registereintrags beschließt der Orchestrator. |
| Grafik | mobil__01 und __02, Zylinderzeichnungen | „außen“, „innen“, „Mitte Stulpschraube“ und „A 30/I 30“ sind bei 390 px rund 7 px hoch, unter der K-008-Grenze von 11,5 px. | Für den Zylindermaß-Generator `ImagePlaceholder ausschnitt` oder `format: 'schmal'` verwenden. Der Ausschnitt zeigt Kern und Bemaßung, die Legenden tragen `data-legende`. |
| Grafik | desktop__00 gegen desktop__01 | Die Musterzeichnung zeigt A 30/I 30, gewählt sind 35/35. Zwei Maße für dieselbe Tür verwirren. | Die Musterzeichnung an die gewählten Maße koppeln oder entfernen (siehe Komposition). |
| Grafik | schritte/18, Position „Doppelzylinder 35/35 mm“ | „Bitte prüfen Sie vor allem die Maße“, aber im Prüfschritt fehlt die Zeichnung. | Je Position die Live-Zeichnung klein (rund 240 px breit) neben die Zeile setzen, Bemaßung in `area`. |
| Details | desktop__01 rechts oben (x ≈ 1000–1120, y ≈ 90) und mobil__03 (y ≈ 80) | Inhalt scheint durch die angeheftete Ablaufleiste. | `bg-surface` deckend, Unterkante `border-b border-border`, kein Weichzeichner. |
| Details | mobil__00, Aktionsleiste links | Zurück ist nur ein Pfeil (axe critical) und auf Schritt 1 ohne Funktion. | Wie bei H04: sichtbar „Zurück“ bzw. `aria-label`, auf Schritt 1 ausblenden. |
| Details | desktop__02 unten gegen H04 desktop__01 | Der weiterführende Block heißt hier „Wenn Sie vorher etwas nachlesen möchten“ (klein, ohne Augenbraue), in H04 „Passende Seiten…“ (Augenbraue, h2, Beschreibungen). | Eine Form für alle Abläufe festlegen: Haarlinien-Liste mit `text-title`, Augenbraue optional. |

**Das Stärkste**
- Die Live-Zylinderzeichnung mit A/I-Bemaßung, Kernmarke und Stulpschraube auf Zeichenpapier (desktop__01). Hier sieht man Genauigkeit, bevor man sie liest.
- Die Kennzahlen-Leiste „ZYLINDER 1 · SCHLÜSSEL 3 · OPTIONEN 0 · LAUFENDE SUMME 39,00 €“ (desktop__00, mobil__00 als 2 × 2).

---

## H10 · Warenkorb

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Der Summenblock ist rechtsbündig in Mono, die Gesamtsumme 20,95 € gut gestuft (gefüllt desktop__01). „Weiter einkaufen“ bricht mit rund 44 px Lücke (desktop__01), und mobil hängt der Betrag lose unter dem Stepper (mobil__00). |
| Komposition | 5 | Links bleiben rund 650 px leer, rechts stapelt alles, und „Zur Kasse“ liegt unter der Falz (gefüllt desktop__00, __01). Mobil kommt der Knopf erst nach 1,5 Bildschirmhöhen, während die Leiste unten die globale Navigation zeigt (gefüllt mobil__00, __01). |
| Farbe und Bild | 6 | Das Positionsbild ist ein kleines Glyph auf grauer Fläche und wirkt wie ein Platzhalter (gefüllt desktop__00). Der blaue Hinweiskasten ist so groß wie die Summe (desktop__01). |
| Bewegung | 7 | Der Zähler-Pop (B-20) am Kopf passt. Ein Wechsel der Versandart ändert die Gesamtsumme aber ohne sichtbare Rückmeldung (gefüllt desktop__00/01). |
| Grafik | 5 | Der Code 0812 ist bekannt, trotzdem zeigt die Position kein Schlüsselprofil, obwohl der Live-Schlüssel-Generator existiert (gefüllt desktop__00). |
| Details | 6 | Die Einleitung „Prüfen Sie Ihre Positionen…“ steht auch im leeren Korb (desktop__00), im Leerzustand ein Einkaufswagen, im Kopf eine Tasche, und mobil steht „Position entfernen“ vor der Stückzahl. |

**Ansichtswert: 6,0**

**Harter Katalog:** keine. Das Glyph auf grauer Fläche ist eine Fachform und kein „Bild folgt“, es grenzt aber an einen Platzhalter (siehe Befund Grafik).
**Weicher Katalog:** keine. Der Leerzustand mit zwei Knöpfen ist linksbündig und hat keinen abstrakten Hintergrund, also kein Treffer.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Komposition | gefuellt/warenkorb-gefuellt__desktop__00 und __01 | Unter der einzigen Position bleiben links rund 650 px leer. Rechts stapeln Versandart, Summe, Knopf und Hinweis, „Zur Kasse“ liegt bei 1440 × 900 unter der Falz. | Versandart in die linke Spalte unter die Positionen (`lg:col-span-8`). Rechts `lg:col-span-4` nur Summe, „Zur Kasse“ und Hinweis, `sticky top-24`. |
| Komposition | gefuellt/warenkorb-gefuellt__mobil__00 und __01 | „Zur Kasse“ erscheint erst nach 1,5 Bildschirmhöhen, die Aktionsleiste zeigt Autoschlüssel/Nach Code/Termin/Service. | Im gefüllten Warenkorb mobil die Aktionsleiste ersetzen durch „Gesamtsumme 20,95 € · Zur Kasse“ (`min-h-touch-lg`, Betrag Mono), wie die Weiter-Leiste der Abläufe. |
| Komposition | H10-warenkorb__desktop__00, Leerzustand | Die Leerkarte läuft über die volle Breite mit Inhalt im linken Drittel. Darunter wiederholt „Passend dazu“ dieselben zwei Ziele. | Leerkarte `lg:col-span-8`, „Passend dazu“ als Haarlinienliste rechts in `lg:col-span-4` statt als eigener Abschnitt. |
| Typografie | gefuellt/warenkorb-gefuellt__desktop__01 y 625–670 | „Weiter einkaufen: Schlüssel nach Code oder / Zylinder-Konfigurator.“ bricht mit rund 44 px Zeilenabstand. | Links `inline`, Touch-Höhe nur über vertikales Padding am Link. Oder zwei Haarlinienzeilen mit Pfeil (B-06). |
| Typografie | gefuellt/warenkorb-gefuellt__mobil__00 y 740–775 | „8,00 € je Stück“ und „16,00 €“ stehen linksbündig unter dem Stepper, losgelöst von der Menge. | Eine Zeile: Stepper links, Betrag `text-right` Mono rechts, der Einzelpreis `text-caption` darunter. |
| Farbe und Bild | gefuellt/warenkorb-gefuellt__desktop__01 y 395–565 | Der blaue Hinweiskasten „Hinweis zur Preisberechnung“ ist fast so groß wie der Summenblock und zieht den Blick vom Knopf. | Als `text-small text-foreground-muted` Zeile mit `GlyphInfo` unter den Knopf, ohne Fläche. |
| Bewegung | gefuellt/warenkorb-gefuellt__desktop__00/01, Gesamtsumme | Ein Wechsel der Versandart ändert „Versand“ und „Gesamtsumme“ ohne Rückmeldung. | B-20 (`sm24-pop`, `quick`) auf die Gesamtsumme anwenden. Die Registererweiterung beschließt der Orchestrator. |
| Grafik | gefuellt/warenkorb-gefuellt__desktop__00, Positionsbild (x 132–248, y 467–581) | Ein kleines Glyph auf grauer Fläche wirkt wie ein Platzhalter, obwohl der Code bekannt ist. | Das Schlüsselprofil deterministisch aus dem Live-Schlüssel-Generator mit Code 0812 auf `surface-sunken` mit Raster 30. Mobil das gleiche Bild 64 px links vom Titel. |
| Details | H10-warenkorb__desktop__00, mobil__00 | Die Einleitung „Prüfen Sie Ihre Positionen, wählen Sie die Versandart…“ steht auch über dem leeren Korb. | Die Einleitung im Leerzustand ausblenden, der Leertext steht ohnehin in der Karte. |
| Details | H10-warenkorb__desktop__00, Leer-Icon gegen Kopf-Icon | Der Leerzustand zeigt einen Einkaufswagen, der Kopf eine Tasche: zwei Bilder für denselben Korb. | Fach-Icon `warenkorb` und `GlyphWarenkorb` auf dieselbe Form bringen (Tasche). |
| Details | gefuellt/warenkorb-gefuellt__mobil__00 y 590–615 | „Position entfernen“ steht vor der Stückzahl, die seltene, zerstörende Handlung also vor der häufigen. | Ans Ende der Position, `text-small text-foreground-muted`, mit `GlyphPapierkorb`. |

**Das Stärkste**
- Der Summenblock: Zwischensumme, Versand und Gesamtsumme rechtsbündig in Mono mit USt-Zeile (gefüllt desktop__01).
- Die Versandarten als ruhige Optionskarten mit Mono-Preisen (gefüllt desktop__00).

---

## H11 · Kasse

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Die Abschnittsnummern 01/02/03 in Mono sind gut (gefüllt desktop__01). In der Übersicht mischen sich Inter und Mono in einem Wert, „MS-01“ bricht am Bindestrich, und die Werte stehen linksbündig (gefüllt desktop__00). |
| Komposition | 7 | Zweispaltig mit angehefteter Bestellübersicht ist richtig (gefüllt desktop__01). Mobil erscheint der Gesamtbetrag erst nach dem ganzen Formular (gefüllt mobil__03), und die zweite Bestätigungskarte ist schmaler (desktop__02). |
| Farbe und Bild | 7 | Ruhig, der Amber-Warnkasten ist semantisch korrekt (gefüllt desktop__00). Die Gesamtsumme ist hier schwarz, im Konfigurator primärblau: uneinheitliche Betonung. |
| Bewegung | 7 | Die Arbeitsansicht ist zu Recht ruhig. Der Ladezustand des Absendeknopfs (B-19) und der Zähler (B-20) sind laut Register vorgesehen, im Standbild aber nicht belegbar. |
| Grafik | 6 | Außer der Fuß-Profillinie gibt es keinen Bezug zur Werkstattzeichnung. Die Abschnittsnummern stehen ohne Bemaßungsmarke (gefüllt desktop__00). |
| Details | 6 | Sechsmal „Noch nicht ausgefüllt“ in voller Textfarbe (gefüllt desktop__01), der Leerzustand hat kein Icon und eine unpassende Einleitung (H11 desktop__00), und das Info-Symbol sitzt außerhalb der Karte (desktop__02). |

**Ansichtswert: 6,5**

**Harter Katalog:** keine.
**Weicher Katalog:** keine.

**Befunde**

| Kategorie | Bild und Stelle | Was stört | Konkrete Änderung |
|---|---|---|---|
| Typografie | gefuellt/kasse-gefuellt__desktop__00 und __01, Bestellübersicht | Werte mischen Inter und Mono in einer Zeile („Code 0812 · 2 Stück · 16,00 €“, „3,34 € (19 %)“) und stehen linksbündig. Der Warenkorb setzt Beträge rechtsbündig. | Wertspalte `text-right font-mono tabular-nums`. Textanteile (Versandart, Code) als eigene Zeile `text-small` über dem Betrag. |
| Typografie | gefuellt/kasse-gefuellt__desktop__00, Artikelzeile | „Büroschrank und Rollcontainer — Serie MS- / 01“ bricht in der Kennung. | Kennungen `font-mono whitespace-nowrap`, Beschriftungsspalte auf rund 45 % verbreitern. |
| Komposition | gefuellt/kasse-gefuellt__mobil__00 bis __04 | Der Gesamtbetrag erscheint mobil erst nach dem Formular (mobil__03). Man füllt fünf Bildschirmhöhen aus, ohne den Betrag zu sehen. | Oben unter dem Warnkasten eine einklappbare Zeile „Bestellübersicht · 20,95 €“ (Akkordeon B-09). Die volle Übersicht bleibt vor dem Knopf. |
| Komposition | gefuellt/kasse-gefuellt__desktop__02 (x ≈ 773 gegen 805), mobil__02 | Die zweite Bestätigungskarte ist schmaler, weil der InfoTip außerhalb steht. Die Kante springt. | Den InfoTip in die Karte rechts oben setzen, wie bei den Optionskarten in H07. Beide Karten gleich breit. |
| Farbe und Bild | gefuellt/kasse-gefuellt__desktop__00 „Gesamtbetrag 20,95 €“ gegen H07 desktop__00 „LAUFENDE SUMME 39,00 €“ | Die Endsumme ist in der Kasse `foreground`, im Konfigurator `primary`. Dieselbe Rolle hat zwei Farben. | Die Endsumme in Warenkorb, Kasse und Konfigurator einheitlich `text-foreground`. Primärblau bleibt der Aktion vorbehalten (K-003 Punkt 3). |
| Grafik | gefuellt/kasse-gefuellt__desktop__00, „01 Kontaktdaten“ | Die Nummern 01/02/03 stehen als nackte Mono-Ziffern ohne Bemaßungsmarke, das Leitsystem bricht hier ab. | Die Nummern als `.eyebrow` mit Bemaßungsmarke und laufender Nummer (K-006), die Abschnittstitel bleiben `text-title`. |
| Details | gefuellt/kasse-gefuellt__desktop__01, Übersicht „Kontakt und Lieferanschrift“ | Sechsmal „Noch nicht ausgefüllt“ in voller Textfarbe übertönt die echten Werte. | Leere Werte in `text-small text-foreground-muted`, ausgefüllte in `text-foreground`. |
| Details | H11-kasse__desktop__00, mobil__00 | Der Leerzustand hat kein Icon (anders als der Warenkorb), und die Einleitung „Bitte geben Sie Ihre Kontakt- und Lieferdaten an“ steht über dem leeren Korb. | Denselben Leerbaustein wie H10 verwenden, die Einleitung im Leerzustand ausblenden. |
| Details | gefuellt/kasse-gefuellt__mobil__04, Knopf „Zahlungspflichtig bestellen“ | Mobil steht der Knopf ohne den Betrag im Blick, die Gesamtsumme liegt eine Bildschirmhöhe darüber. | Die vorhandene Zeile „Gesamtbetrag 20,95 €“ (Mono, `text-title-sm`) direkt über den Knopf wiederholen. |

**Das Stärkste**
- Die zweispaltige Kasse mit angehefteter Bestellübersicht, die Eingaben live spiegelt (gefüllt desktop__01).
- Die nummerierten Formularabschnitte mit Haarlinien und knappen Hilfstexten (gefüllt desktop__00/01).

---

## Gesamt

| Ansicht | Ansichtswert |
|---|---|
| H04-assistent | 6,2 |
| H07-zylinder-konfigurator | 6,8 |
| H10-warenkorb | 6,0 |
| H11-kasse | 6,5 |
| **Mittel** | **6,4** |

**Die drei wirksamsten Änderungen über alle vier Ansichten**
1. **Terminwahl im Assistenten umbauen (H04, schritte/13).** Die 14 292 px lange Tagesliste wird zur horizontalen Tagesleiste (`snap-x`, Mono-Datum) mit dem Zeitraster nur für den gewählten Tag. Das ist der größte Einzelgewinn an Tempo in der wichtigsten Hauptaufgabe (Termin mit Anzahlung).
2. **Summe und Hauptaktion in Warenkorb und Kasse in den Blick (H10, H11).** Desktop: Versandart links, rechts nur Summe und „Zur Kasse“, angeheftet. Mobil: Im Warenkorb ersetzt eine Leiste „Gesamtsumme · Zur Kasse“ die globale Aktionsleiste, in der Kasse steht oben eine einklappbare Zeile „Bestellübersicht · Betrag“. Dazu kommen rechtsbündige Mono-Werte und dieselbe Summenfarbe auf allen drei Ansichten.
3. **Die Werkstattzeichnung in die Arbeitsschritte holen (H04, H07, H10).** Den Zylindermaß-Generator mobil als Ausschnitt mit Beschriftungen ab 12 px setzen und die widersprüchliche Musterzeichnung (30/30) streichen. Die Live-Zeichnung kommt in die Zusammenfassung, die Schlüsselarten bekommen ihre Profile in Schritt 5, und die Warenkorbposition zeigt das Profil aus dem Code statt eines Glyphs auf grauer Fläche.

=== ENDE E4-L-23 · BEREIT ZUR RÜCKGABE ===
