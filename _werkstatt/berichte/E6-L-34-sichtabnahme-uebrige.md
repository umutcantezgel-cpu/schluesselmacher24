# E6-L-34 · Sichtabnahme · Gruppe „uebrige“

Prüfer: unabhängiger Gestaltungsprüfer (frischer Unteragent) · Kern 1.15 · Grundlage: KERN K-001, K-003, K-006, K-007 (B-01 bis B-26), K-008, K-009 · Bildsatz `/root/sm24-bilder/e6-c/uebrige/`, Einzelbilder `/root/sm24-bilder/e6-c/einzelbilder/U-STANDORTE/`, Ablaufschritte `/root/sm24-bilder/e6-c/schritte/` (Sicherheitscheck)

**Ansichten der Gruppe:** `/gleichschliessende-zylinder`, `/service-und-termin`, `/artikel`, `/standorte/berlin`, `/sicherheitstechnik/sicherheitscheck`, `/rechtliches/agb`. Bei der AGB ist nur die Darstellung bewertet, der Wortlaut ist unantastbar.

**Zur Bewegung:**
- Einzelbilder gibt es nur für den Standortkopf (B-26, fünf Bilder).
- Der Ordner `einzelbilder/U-SERVICE/` ist leer. B-23 im Kopf von Service und Termin ist deshalb nur nach dem Register und dem Endzustand bewertet.
- B-25 (Stiftzuhaltung) ist nach den Zwischenständen in desktop 01, mobil 02 und tablet 02 bewertet.
- Arbeitsansichten (Sicherheitscheck, AGB) sind danach bewertet, ob die Bewegung Zustände erklärt.

**Angesehene Bilder (68):**
- gleichschliessende-zylinder: desktop 00, 01, 02, 03, 04, 05 · mobil 00, 01, 02, 03, 04, 05 · tablet 02 (Verdacht bei Szene und Bauform-Zeilen)
- service-und-termin: desktop 00, 01, 02, 03, 04, 05 · mobil 00, 01, 02, 03, 04, 05 · tablet 00 (Verdacht bei den Beschriftungen der Ablaufzeichnung)
- artikel: desktop 00, 01, 02, 03 · mobil 00, 01, 02, 03, 04
- standorte-berlin: desktop 00, 01, 02 · mobil 00, 01, 02, 03 · Einzelbilder U-STANDORTE `main-header-svg-role-img` 0, 1, 2, 3, 4
- sicherheitstechnik-sicherheitscheck: desktop 00, 01, 02 · mobil 00, 01, 02, 03, 04 · schritte 39 (Zugänge), 42 (Schwerpunkte), 47 (Zusammenfassung)
- rechtliches-agb: desktop 00, 01, 02, 03 · mobil 00, 01, 02, 03, 04, 05

---

## 1 · /gleichschliessende-zylinder (Erzählansicht, Bereichsseite, Kür B-25)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Display-h1, Augenbraue mit Profillinie und das Mono-Schriftfeld sitzen (desktop 00). Im Grundpreis-Hinweis bricht jedoch „5 / mm“ (desktop 02), und die Messhilfe-Einleitung läuft mobil sieben Zeilen in Lead-Größe (mobil 05). |
| Komposition | 7 | Die Folge Text ↔ Grafik ↔ Vergleichsliste ↔ Tabelle wechselt Struktur und Dichte (desktop 00–05). In der Messhilfe endet die Zeichnung aber bei y ≈ 105, während links Schritte, Warnung und Hinweis bis y ≈ 840 laufen (desktop 04). |
| Farbe und Bild | 8 | Das Zylinder-Orange bleibt bei Augenbraue, Fach-Icons und Zeichnungen, die Aktionen bleiben Primärblau, die Flächenstufen wechseln je Abschnitt (desktop 00, 02, 05). |
| Bewegung | 7 | B-25 erklärt Mechanik. In desktop 01 steht die Szene aber ganz im Bild (y 355–740), und noch kein Stift ist an der Trennlinie; in tablet 02 sind es erst drei von fünf. Die Unterschrift „hebt jeden Stift bis an die Trennlinie“ eilt dem Bild voraus. |
| Grafik | 7 | Maßzeichnung und Stiftzuhaltungsschnitt sind unverwechselbar (desktop 00, 01). Die Türschema-Tafel ist dagegen eine überwiegend leere, gerahmte Rasterfläche, und mobil klebt „Trennlinie“ am Bildschirmrand (mobil 02). |
| Details | 7 | Warnung mit Leiste links, InfoTips, Bauform-Chips und Mono-Tabelle sind sauber (desktop 03–05). Die nicht klickbaren Schrittnummern 01–04 stehen aber in Bereichsorange (desktop 04), und der Link „Ausführliche Anleitung …“ trägt ein Stift-Glyph. |

**Ansichtswert: 7,2**

**Generisch-Katalog:**
- **Hart:** keine.
- **Weich:** Drei gleich gebaute Bauform-Zeilen folgen aufeinander (desktop 02). Sie sind eine Vergleichsliste mit Maßen und Preisen und werden von „Bemaßt statt behauptet“ getragen. Das Papierraster ist Leitidee, kein Effekt.

**Befunde:**
- Bewegung:
  1. **desktop 01, tablet 02, Szene B-25:** Die Szene steht ganz im Bild, die Stifte sind aber noch unterwegs. Wer hier anhält, sieht einen gesperrten Zylinder unter einer Unterschrift, die das Gegenteil sagt. → Die Zeitleiste der Szene so legen, dass die Endlage erreicht ist, sobald die Szene vollständig sichtbar ist (Ende von `animation-range` bei etwa `contain 40 %`). Die Staffel über `--stift-nr` dafür verdichten.
- Grafik:
  1. **desktop 01 oben, mobil 02, Türschema „ein Schlüssel – drei Türen“:** Schlüssel und Türen belegen etwa ein Drittel einer gerahmten Tafel (mobil y 230–462). Der Stiftzuhaltungsschnitt direkt darunter steht ohne Rahmen. → Den Kartenrahmen entfernen (Zeichnung auf Papier wie Kopf und Szene) und die Tafel auf die Zeichnungshöhe plus ein Rasterfeld kürzen.
  2. **mobil 02, Szene im Ausschnitt:** „Trennlinie“ beginnt bei x ≈ 2, der Schlüsselkopf liegt außerhalb des Fensters. → Den Ausschnitt so verschieben, dass das Etikett mindestens den `shell`-Rand von 20 px hat, oder das Etikett rechts über die Trennlinie in den Zylinderkörper setzen.
- Typografie:
  1. **desktop 02, Grundpreis-Hinweis unter jeder Bauform:** „Darüber kommen 3,50 € je angefangene 5 / mm hinzu“ bricht zwischen Zahl und Einheit; „3,50 €“ steht in Inter. → ` ` zwischen „5“ und „mm“ (ebenso „70 mm“, „45 mm“, „3,50 €“), Betrag in `font-mono tabular-nums`.
  2. **mobil 03, Knaufzylinder „Abgefragte Maße“:** Der Wert läuft rechtsbündig in drei Zeilen, „Knaufseite)“ steht allein. → Unter 640 px Etikett und Wert stapeln, Wert linksbündig auf voller Breite.
  3. **mobil 05, Messhilfe-Einleitung:** sieben Zeilen in `text-lead`. → Nur den ersten Satz als Lead setzen, den Rest als `text-body max-w-measure` darunter (Wortlaut unverändert).
- Komposition:
  1. **desktop 04, rechte Spalte der Messhilfe:** Ab y ≈ 105 sind sieben Spalten leer, links stehen vier Schritte, Warnung und Hinweis. → Die Zeichnungsspalte `lg:self-start lg:sticky lg:top-24` setzen, sodass die Zeichnung neben den Schritten stehen bleibt.
- Details:
  1. **desktop 04, mobil 05, Schrittnummern 01–04 der Messhilfe:** Die Nummern sind nicht klickbar, stehen aber in Bereichsorange (gegen K-006 1.14 „Primärblau/Bereichsfarbe nur für Aktionen, Augenbraue, Marke, Grafik“). → `text-foreground`.
  2. **desktop 04, Link „Ausführliche Anleitung zum Ausmessen“:** Das Stift-Glyph liest sich als „bearbeiten“. → Als ganze Linkzeile mit `GlyphPfeilRechts` rechts (B-06) oder mit `GlyphLineal` links.

**Das Stärkste:**
- Der Stiftzuhaltungsschnitt am Scrollen mit Mono-Unterschrift: Man sieht die Mechanik, bevor man sie liest.
- Der Kopf mit bemaßter Zylinderzeichnung (A 30 / B 40, „Mitte Stulpschraube“) über dem Mono-Schriftfeld (desktop 00, mobil 00).

---

## 2 · /service-und-termin (Erzählansicht, Bereich Service, mit Rechner)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Kopf und Augenbrauen sind sauber (desktop 00). Abschnitt 03 bleibt aber eine Textwand mit geraden Anführungszeichen ("Out-of-the-box", desktop 02) und „z.B.“ (desktop 03); mobil bricht „DIN / 18252“ (mobil 05), und die 12-px-Schrittnummern hängen unter der Titelzeile (desktop 03). |
| Komposition | 6 | Der Kopf mit Ablaufzeichnung im 7/5-Raster und die Anliegen-Liste tragen (desktop 00, 01). Der Rechner belegt dagegen 8 Spalten neben 4 leeren (desktop 04, 05), und mobil steht das geöffnete Akkordeon 03.1 mit rund drei Bildschirmhöhen Text vor jeder Handlung (mobil 03–05). |
| Farbe und Bild | 7 | Magenta erscheint als Bereich (Augenbraue, Fach-Icons, getönte Ablauftafel, desktop 00, 01). Der Hinweis „Wählen Sie mindestens eine Leistung.“ ist dagegen ein getönter Kasten ohne Anlass (desktop 05). |
| Bewegung | 7 | B-23 ist für den Kopf eingetragen und dient der Reihenfolge, lässt sich aber ohne Einzelbilder nicht am Bild prüfen. Akkordeon-Winkel (B-09) und Zeilenpfeile (B-06) stehen in Ruhe richtig (desktop 01, 04). |
| Grafik | 7 | Der senkrechte Ablauf mobil ist vorbildlich (mobil 00). Am Desktop drängen sich die fünf Stationen dagegen in die Mitte der Tafel, und die zweizeilig versetzten Beschriftungen stoßen an die Fallinien (desktop 00, tablet 00). |
| Details | 6 | Optionen stehen als gerahmte Karten in der weißen Rechnerkarte (desktop 04). Das FAQ-Akkordeon ist gerahmt, die Akkordeons 03.1–03.4 sind es nicht (desktop 04, 05). „1. Welche Leistungen …“ und „2. Anzahl Türen“ haben verschiedene Größen. |

**Ansichtswert: 6,5**

**Generisch-Katalog:**
- **Hart:** keine.
- **Weich:**
  - **Floskeln, nicht getragen (K-003 „Bemaßt statt behauptet“):** „Präzision in jedem Schritt: Unsere Service-Architektur“, „integrierte architektonische Lösungen, die höchste Ansprüche …“, „Vier Abläufe, ein Erlebnis“, „mit höchster handwerklicher Präzision“, „auf ein absolutes Minimum“, „lückenlose Nachvollziehbarkeit … garantieren“ (desktop 01–03).
  - **Vier gleich gebaute Spalten „Wege zu uns“** (desktop 01, 02): Sie sind eine Zuordnung Ablauf → Bereich und als Matrix teilweise getragen. Mobil ist es richtig eine Leiste (mobil 02).
  - **Getönte Ablauftafel** (`area-soft`, desktop 00): Das Kopfmuster nach K-006 trägt sie.

**Befunde:**
- Komposition:
  1. **mobil 03–05, Abschnitt 03 „Vorgehen“:** Lead, Absatz und geöffnetes Akkordeon 03.1 füllen rund drei Bildschirmhöhen, bevor Rechner oder Anfrage erreichbar sind. → 03.1 geschlossen starten und den Abschnitt „04 Orientierung“ (Rechner) mobil vor „03 Vorgehen“ stellen (K-006 „Handlung vor Erklärung“).
  2. **desktop 04/05, Rechner „Orientierung für Ihren Serviceeinsatz“:** Die Karte belegt 8 Spalten, rechts bleiben 4 leer, Ergebnis und Knopf stehen unten in der Karte. → Auswahl links in `lg:col-span-8`, Ergebnisfeld und „Anfrage stellen“ rechts in `lg:col-span-4 lg:sticky lg:top-24`.
- Typografie:
  1. **desktop 02/03, mobil 03/05, Fließtext Abschnitt 03:** gerade Anführungszeichen "Out-of-the-box" und „z.B.“ ohne Leerraum. → Als Vorschlag in `TEXTVORSCHLAEGE.md`: „Out-of-the-box“ und „z. B.“ mit schmalem geschütztem Leerzeichen, dazu die Floskeln kürzen.
  2. **mobil 05, „(z.B. DIN / 18252 …, DIN EN 1303)“:** Die Normkennung bricht um. → ` ` zwischen „DIN“, „EN“ und der Nummer.
  3. **desktop 03, Schrittköpfe „02 Projektierung …“ bis „05 Dokumentation …“:** Die 12-px-Mono-Nummer sitzt tiefer als die 18-px-Titelzeile und wirkt verloren. → Nummer und Titel auf eine Grundlinie (`items-baseline`), Nummer `font-mono text-small text-foreground` in einer hängenden Spalte `w-8`.
- Farbe und Bild:
  1. **desktop 05, „Wählen Sie mindestens eine Leistung.“:** getönter Kasten (`surface-muted` mit Rahmen) für einen Hinweis ohne eigenen Anlass. → Zeile mit `GlyphInfo` in `text-foreground-muted` ohne Fläche (K-006 „Flächen sparsam“). Sobald eine Spanne steht, darf sie als Schriftfeld erscheinen.
- Bewegung: kein umsetzbarer Befund am Bild. Der Ordner `einzelbilder/U-SERVICE/` ist leer, B-23 ist nur nach dem Register bewertet.
- Grafik:
  1. **desktop 00, tablet 00, Ablaufzeichnung:** Die Stationen stehen im Abstand von ≈ 63 px in der Mitte der Tafel. „Bedarfsanalyse“ endet ≈ 8 px vor der Fallinie von 02, „Dokumentation“ beginnt ≈ 13 px hinter der Fallinie von 04. → Die Stationen über die volle Tafelbreite verteilen (Abstand ≈ 90 px). Die Beschriftung mittig unter jede Station setzen, ungerade unter der Achse, gerade über den Kreisen, sodass keine Fallinie Text berührt.
  2. **desktop 00, Tafel:** Die Zeichnung belegt die obere Hälfte, darunter liegen ≈ 60 px leeres Raster. → Die Zeichnung in der Tafel senkrecht mittig setzen oder die Tafel auf die Zeichnungshöhe kürzen.
- Details:
  1. **desktop 04/05, Leistungsauswahl im Rechner:** gerahmte Optionskarten in der weißen Karte, also Rahmen im Rahmen (K-006 1.14). → `Auswahlgruppe liste` mit `OptionCard zeile` und Haarlinien; „je Tür“ und „pauschal“ als `metaSpalte` rechts.
  2. **desktop 05, FAQ:** Das Akkordeon steht in einer gerahmten Karte (8 Spalten), die Akkordeons 03.1–03.4 derselben Seite sind Haarlinien ohne Rahmen (desktop 02, 04). → FAQ als Haarlinien-Akkordeon ohne Rahmen in der Breite von 03.x.
  3. **desktop 04/05, Fragen im Rechner:** „1. Welche Leistungen brauchen Sie?“ steht in `text-title-sm`, „2. Anzahl Türen“ als kleines fettes Etikett. → Beide Fragen gleich als `text-title-sm`.

**Das Stärkste:**
- Der mobile senkrechte Ablauf 01–05 mit Mono-Beschriftung (mobil 00) ist eine eigene Telefonkomposition und kein verkleinerter Desktop.
- Die Anliegen-Liste mit magentafarbenen Fach-Icons, ganzer Zeile als Link und ruhendem Pfeil (desktop 01, mobil 01).

---

## 3 · /artikel (Shop-Liste; Erzählkopf, Liste mit der Ruhe einer Arbeitsansicht bewertet)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Mono-Preise rechtsbündig mit „je Stück“ und der Zähler „8 Artikel von 8“ sind präzise (desktop 01). Der Kopf-Lead läuft aber mit ≈ 85 Zeichen je Zeile über die Messbreite (desktop 00), und mobil enden Kürzungen auf „Haken.…“ (mobil 01). |
| Komposition | 6 | Die einspaltige Liste mit Haarlinien ist richtig (desktop 01, mobil 01). Der Kopf hat aber keinen Blickfang, die rechte Hälfte ist leer, und der erste Artikel steht am Desktop erst in der zweiten Bildschirmhöhe (desktop 00, 01). |
| Farbe und Bild | 7 | Ruhig in Primärblau und Grau, Fach-Icons zweitonig ohne Kachel (desktop 01, 02). Eine Bildstelle hat die Seite nicht. |
| Bewegung | 7 | Ruhe passt zur Liste. Trefferzähler (B-20) und Zeilenpfeil (B-06) lassen sich am Standbild nicht prüfen, einen Moment gibt es nicht. |
| Grafik | 6 | Viermal steht dasselbe Icon (Schlüsselkasten, Schlüsselsafe, Schlüsselkappen, Schlüsselanhänger), und Pflegespray und Fenstergriff teilen das Kasten-Icon (desktop 01, 02). Die Icons unterscheiden die Artikel nicht. |
| Details | 7 | Zeilenpfeile, Badge „Beispiel“ und die nummerierte Weiterlesen-Liste sind sauber (desktop 02). Unter dem Kopf stehen aber zwei Trennungen übereinander: Abschnittskante y 449 und Haarlinie y 511 (desktop 00, mobil 00). |

**Ansichtswert: 6,7**

**Generisch-Katalog:**
- **Hart:** **Platzhalter** – acht Beispielartikel mit Beispielpreisen (desktop 01, 02, mobil 01, 02). Sie sind offen gekennzeichnet (Hinweis „Derzeit nur Beispielartikel“, Badge „Beispiel“) und nicht bestellbar. Die Gestaltung kann das nicht lösen; echte Artikel liefert der Mensch.
- **Weich:** keine.

**Befunde:**
- Komposition:
  1. **desktop 00/01, Kopf und Abschnitt 01:** Die rechten 5 Spalten des Kopfes sind leer, Suche und Liste beginnen erst darunter, der erste Artikel steht bei y ≈ 300 der zweiten Bildschirmhöhe. → Suche und Schlagworte in die rechten 5 Spalten des Kopfes (7/5) und die Liste direkt darunter, damit die ersten Artikel in der ersten Bildschirmhöhe stehen; das Suchfeld ist dann höchstens 5 Spalten breit statt 1 176 px.
- Typografie:
  1. **mobil 01/02, Beschreibungen:** „Wandkasten aus Stahlblech mit nummerierten Haken.…“ hängt die Ellipse an den Satzpunkt, die Reste wirken abgerissen („Bitte…“, „Mit zwei…“). → Unter 640 px die Beschreibung weglassen (Titel, Badge und Preis genügen, die Detailseite trägt den Text) oder `line-clamp-1` mit Kürzung vor dem Satzpunkt.
  2. **desktop 00, Lead im Kopf:** Die Zeile ist ≈ 805 px lang (≈ 85 Zeichen), „den / Warenkorb legen.“ bricht ab. → `max-w-measure` am Lead (`PageHeader leadClassName`).
- Grafik:
  1. **desktop 01/02, Zeilen-Icons:** vier gleiche Schlüssel-Icons, zweimal das Kasten-Icon. → Je Artikel das nächstliegende vorhandene Fach-Icon aus K-008a, z. B. Schlüsselsafe `tuerzusatzschloss`, Pflegespray `werkstatt`, Fenstergriff `mehrfachverriegelung`, Kappen und Anhänger `schluessel-kopieren`. Höchstens zwei Zeilen mit demselben Icon.
- Details:
  1. **desktop 00 (y 449 und 511), mobil 00 (y 384 und 425):** Abschnittskante und eine zweite Haarlinie 40–60 px darunter. → Die obere Haarlinie in Abschnitt 01 entfernen.
  2. **desktop 01, Zähler und Hinweis:** „8 Artikel von 8“ steht allein über dem Hinweis „Derzeit nur Beispielartikel“, die Liste folgt erst danach. → Den Hinweis über die Filter setzen und den Zähler direkt über die erste Zeile, damit Zähler und Liste zusammenstehen.

**Das Stärkste:**
- Die Preisspalte in Mono, rechtsbündig mit „je Stück“ und Pfeil, macht die Liste schnell vergleichbar (desktop 01, mobil 01).
- Die Weiterlesen-Zeilen mit Mono-Nummern, Fach-Icons und ganzer Zeile als Link (desktop 02, mobil 03).

---

## 4 · /standorte/berlin (Erzählansicht, Standort)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | Die zweizeilige Display-h1 steht mobil sauber dreizeilig (mobil 00). „40 km“ im Schriftfeld und „r 40 km“ in der Zeichnung sind Mono. |
| Komposition | 6 | Der 7/5-Kopf trägt (desktop 00). Danach folgt nur ein Abschnitt, unter dessen Überschrift die linke Spalte ≈ 450 px leer bleibt (desktop 01), und das Schriftfeld hat ein einziges Feld über 7 Spalten (desktop 00). |
| Farbe und Bild | 7 | Bereichsfarben erscheinen nur an den Bereichs-Icons der Liste (desktop 01, mobil 01). Die Kopfzeichnung ist blaue Linie auf blauem Raster; die Reichweite liest sich nicht als Fläche. |
| Bewegung | 8 | B-26 baut lesbar auf: Achse, dann Bogen und Ort, dann voller Kreis, zuletzt Radius mit „r 40 km“ (Einzelbilder 0–4). Die Bewegung ist kurz, hat einen Zweck und hält keinen Text zurück. |
| Grafik | 7 | Die Einsatzzeichnung ist bemaßt und präzise (desktop 00), aber abstrakt. Mobil sind „Berlin“ und „r 40 km“ nur ≈ 11 px groß (mobil 00). |
| Details | 7 | Zeilenpfeile sind einheitlich, die Augenbraue trägt eine Nummer (desktop 01). Das Etikett „WEITERLESEN“ steht aber ohne Bemaßungsmarke und Nummer als Unterliste (desktop 01). |

**Ansichtswert: 7,2**

**Generisch-Katalog:**
- **Hart:** keine.
- **Weich:** keine. Das Zeichenpapier-Raster ist Leitidee.

**Befunde:**
- Komposition:
  1. **desktop 01, linke Spalte unter „Bereiche in dieser Region“ (y ≈ 230–680):** leer, rechts stehen Bereiche und Weiterlesen untereinander. → Die beiden Weiterlesen-Zeilen („Alle Einsatzgebiete“, „Autoschlüssel-Termin“) links unter die Überschrift setzen, rechts nur die Bereichsliste.
  2. **desktop 00, Schriftfeld:** Ein Feld „Einsatzradius 40 km“ steht auf 7 Spalten, dieselbe Zahl steht schon im Lead und in der Zeichnung. → Ein zweites Feld aus dem vorhandenen Lead: „Versand · deutschlandweit“; die beiden Felder teilen die Zeile.
- Farbe und Bild:
  1. **desktop 00, mobil 00, Einsatzkreis:** Nur der Umriss ist blau, die Innenfläche bleibt Papier. → Die Kreisfläche in `fill-area-soft` (etwa 40 % Deckkraft) tönen, ohne neue Bewegung (erscheint mit dem Kreis). So liest sich der Radius als Gebiet.
- Grafik:
  1. **mobil 00, Beschriftungen der Zeichnung:** „Berlin“ und „r 40 km“ sind ≈ 11 px groß, unter der Mindestgröße von K-008. → Ausschnitt (`ausschnitt`, `sm24-ausschnitt-bemasst`, das Fenster fasst Kreis und Bemaßung) oder schmales Format, sodass die Beschriftungen mindestens 12 px groß sind.
- Details:
  1. **desktop 01, mobil 02, „WEITERLESEN“:** Das Etikett hat weder Bemaßungsmarke noch Nummer, anders als jede andere Augenbraue (K-006 „Ordnung durchziehen“). → `SectionHeading nummer` „02 Weiterlesen“ oder dieselbe `.eyebrow` mit Marke.

**Das Stärkste:**
- B-26: Kreis, Ort und Radius bauen sich in rund einer Sekunde auf und erklären die Reichweite, bevor man den Lead liest (Einzelbilder 0–4).
- Die Bereichsliste mit Fach-Icons in den Bereichsfarben zeigt Farbe nur dort, wo sie Bedeutung trägt (desktop 01, mobil 01).

---

## 5 · /sicherheitstechnik/sicherheitscheck (Arbeitsansicht, geführter Ablauf, 10 Schritte)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | h1 in `text-headline`, Band „Schritt 1 von 10 · Objekt“ in Mono, klare Ordnung von Frage, Etikett und Hilfstext (desktop 00, schritte 39). |
| Komposition | 6 | Ein zehnschrittiger Ablauf läuft über die volle Shell: Textfeld 1 176 px (desktop 01), Mengenfelder in 1 000-px-Kästen (schritte 39), Etikett und Wert der Zusammenfassung ≈ 1 000 px auseinander (schritte 47). Mobil steht die erste Frage erst bei y ≈ 645 (mobil 00). |
| Farbe und Bild | 8 | Bereichsrot nur an Augenbraue und Ablauf-Icon, Fortschritt und aktive Aktionen in Primärblau, gesperrtes „Weiter“ als ruhige Fläche (desktop 01, schritte 39). |
| Bewegung | 8 | Das Band füllt sich von 10 über 50 auf 100 %, erledigte Schritte bekommen Haken (desktop 00, schritte 42, 47). Bewegung erklärt Zustände, sonst ist Ruhe. |
| Grafik | 6 | Außer dem Ablauf-Icon und Glyphen gibt es keine Zeichnung. Die Schritte zu Zugängen und Schwerpunkten nutzen die vorhandene Tür-Schutz-Zeichnung nicht (schritte 39, 42). |
| Details | 7 | Das gesperrte „Weiter“ mit Begründung und die Haken der Schrittliste sind sauber. Die Band-Haarlinie läuft aber 32 px über die Inhaltskante (desktop 00, y ≈ 615, x 100–1 340), und die Mengenfelder sitzen links in vollbreiten Kästen (schritte 39). |

**Ansichtswert: 7,2**

**Generisch-Katalog:**
- **Hart:** keine. Die Prüfeingaben in schritte 47 („Erika Mustermann“, „Prüfeingabe für den Funktionstest“) stammen aus dem Bildlauf, nicht aus der Seite.
- **Weich:** keine.

**Befunde:**
- Komposition:
  1. **desktop 00/01, schritte 39, 42, 47:** Alle zehn Schritte laufen über 12 Spalten. → Ab 1 024 px `FlowShell raster="seite"` nach K-006 1.14 für lange Abläufe: Schritt in 8 Spalten, klebende senkrechte Schrittliste in 4 Spalten. Textfeld, Optionen und Zusammenfassung stehen dann in Messbreite.
  2. **mobil 00, Ablaufkasten „Geführte Anfrage“ (y ≈ 305–495):** Er schiebt die erste Frage auf y ≈ 645, Optionen gibt es erst auf der zweiten Bildschirmhöhe. → Unter 640 px auf eine Zeile mit Glyphe kürzen oder ans Ende des Schritts setzen; die erste Option soll in der ersten Bildschirmhöhe stehen.
- Grafik:
  1. **schritte 39 (Zugänge), schritte 42 (Schwerpunkte):** Der Check fragt Türen, Fenster und Schutzschwerpunkte ab, ohne etwas zu zeigen. → In der Seitenspalte von `raster="seite"` den vorhandenen Generator `tuer-schutz` klein und statisch in den Schritten 2 und 5 zeigen; keine neuen Inhalte.
- Details:
  1. **desktop 00, Band unter der Schrittliste:** Die Haarlinie reicht von x ≈ 100 bis 1 340, Fortschrittsbalken und Inhalt stehen bei 132–1 308. → Die Linie auf die Inhaltsbreite der Shell begrenzen (oder randlos 0–1 440), nicht 32 px darüber hinaus.
  2. **schritte 39, Mengenfelder „Zugänge von außen“ und „Leicht erreichbare Fenster“:** „− 1 +“ sitzt links in einem Kasten über die volle Breite, der Rest bleibt leer. → Feld auf Inhaltsbreite (`w-auto`, höchstens `max-w-xs`), Hilfetext darunter.

**Das Stärkste:**
- Das Band mit Mono-Zähler, Fortschritt und abgehakter Schrittliste gibt in jedem Schritt sofort Orientierung (desktop 00, schritte 42, 47).
- Die mobile Fassung mit eigener Weiter-Leiste in der Daumenzone und großen Optionsflächen (mobil 01).

---

## 6 · /rechtliches/agb (Arbeitsansicht, Rechtstext; nur Darstellung bewertet)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Gute Messbreite (≈ 685 px) und ruhiger Durchschuss (desktop 01). Die Ziffern „1.“ bis „15.“ stehen aber in Proportionalschrift und verschieben die Titelkanten (desktop 02, „9.“ gegen „10.“), und die h1 hat keine Augenbraue (desktop 00). |
| Komposition | 7 | Klebende Seitennavigation links und mobil eine Chipleiste mit Anschnitt passen (desktop 01, mobil 00). Der Hinweiskasten steht aber vor der h1, und mobil liegt der Chip „AGB“ außerhalb des Bildes (mobil 00). |
| Farbe und Bild | 7 | Neutral und ruhig, wie es sich gehört. Der Hinweis auf den ungeprüften Text ist eine Warnung, trägt aber Rundumrahmen und graue Leiste (desktop 00). |
| Bewegung | 8 | Keine Bewegung, und das ist hier richtig (K-003 Nr. 4). |
| Grafik | 7 | Der Waage-Glyph gehört zur Familie (desktop 00). Über der h1 fehlt aber das Leitelement Profillinie, als einzige Ansicht der Gruppe. |
| Details | 6 | Die Seitennavigation markiert die aktuelle Seite nicht, „AGB“ ist so grau wie die übrigen Links (desktop 00–03). Mobil ist der aktive Chip weder sichtbar noch markiert (mobil 00). |

**Ansichtswert: 7,0**

**Generisch-Katalog:**
- **Hart:** **Platzhalter** – „[Platzhalter: …]“ steht in allen 15 Abschnitten (desktop 00–03, mobil 00–04). Die Seite kündigt das selbst an, der Wortlaut ist unantastbar. Lösen kann das nur die juristische Fassung durch den Menschen vor dem Livegang.
- **Weich:** keine.

**Befunde:**
- Details:
  1. **desktop 00–03, Seitennavigation:** „AGB“ unterscheidet sich nicht von den übrigen Links. → `aria-current="page"` mit `text-foreground font-medium` und 2-px-Leiste links in `primary`.
  2. **mobil 00, Chipleiste „Impressum · Datenschutz · Widerruf …“:** Der aktive Chip „AGB“ liegt rechts außerhalb und ist nicht markiert. → Die Leiste beim Laden ohne Animation auf den aktiven Chip ausrichten (`scrollVerhalten()`), Chip mit `bg-primary-soft` und Rahmen `primary`.
- Typografie:
  1. **desktop 01–02, Zwischenüberschriften „1.“ bis „15.“:** Ziffern verschiedener Breite verschieben die Titelanfänge. → Ziffern als hängende Spalte `font-mono tabular-nums text-foreground-muted` (`w-10`), Titel bündig, Wortlaut unverändert.
  2. **desktop 00, mobil 00, h1:** Augenbraue fehlt. → `.eyebrow` „Rechtliches“ (vorhandenes Etikett) mit Bemaßungsmarke über der h1.
- Komposition:
  1. **desktop 00, mobil 00:** Der Hinweiskasten steht vor h1 und Einleitung. → Reihenfolge h1 → Einleitung → Hinweis, Hinweis höchstens 8 Spalten.
- Farbe und Bild:
  1. **desktop 00, mobil 00, „Hinweis zum Stand dieser Seite“:** inhaltlich eine Warnung, gestaltet mit Rundumrahmen und neutraler linker Kante. → Nach K-006: `surface` mit 2-px-Leiste links in `warning`, ohne Rundumrahmen; `GlyphWaage` bleibt.
- Grafik:
  1. **desktop 00, mobil 00, Kopf:** keine Profillinie. → Profillinie klein (10 px, `stroke-primary`, B-02) unter die neue Augenbraue, sonst keine Grafik.

**Das Stärkste:**
- Lesbarkeit: Messbreite, Durchschuss und keine Inszenierung (desktop 01–02, mobil 01–03).
- Die klebende Seitennavigation am Desktop und die Chipleiste mit Anschnitt mobil statt eines Linkstapels.

---

## Ergebnis der Gruppe

| Ansicht | Typo | Komp. | Farbe/Bild | Bewegung | Grafik | Details | Wert |
|---|---|---|---|---|---|---|---|
| /gleichschliessende-zylinder | 7 | 7 | 8 | 7 | 7 | 7 | 7,2 |
| /service-und-termin | 6 | 6 | 7 | 7 | 7 | 6 | 6,5 |
| /artikel | 7 | 6 | 7 | 7 | 6 | 7 | 6,7 |
| /standorte/berlin | 8 | 6 | 7 | 8 | 7 | 7 | 7,2 |
| /sicherheitstechnik/sicherheitscheck | 8 | 6 | 8 | 8 | 6 | 7 | 7,2 |
| /rechtliches/agb | 7 | 7 | 7 | 8 | 7 | 6 | 7,0 |

**Mittel der Gruppe: 6,9** (aus den ungerundeten Ansichtswerten 250/36)

**Harte Treffer gesamt: 2.** Beide sind inhaltlich und gehen an den Menschen: die Beispielartikel auf `/artikel` und das Rechtstext-Gerüst mit „[Platzhalter: …]“ auf `/rechtliches/agb`.

**Die drei wirksamsten Änderungen über die Gruppe:**
1. **Sicherheitscheck auf `FlowShell raster="seite"` (8/4) mit klebender Schrittliste.** Das wirkt auf alle zehn Schritte: Textfeld, Mengenfelder und Zusammenfassung stehen in Messbreite, und die Seitenspalte bietet Platz für eine kleine `tuer-schutz`-Zeichnung. Mobil kommt dazu der Ablaufkasten auf eine Zeile.
2. **Service und Termin: Handlung vor Erklärung.** Mobil den Rechner vor „Vorgehen“ setzen und 03.1 geschlossen starten. Am Desktop Ergebnis und „Anfrage stellen“ in die freie rechte Spalte, Optionen als Liste statt Karten in der Karte. Die Floskeln gehen als Kürzungsvorschlag in `TEXTVORSCHLAEGE.md`.
3. **B-25 so takten, dass Bild und Unterschrift übereinstimmen.** Die Endlage „alle Stifte an der Trennlinie“ ist erreicht, sobald die Szene ganz im Bild steht. Dazu die Szene mobil so ausschneiden, dass Etikett und Schlüsselkopf im Fenster liegen. Es ist der einzige große Moment der Gruppe; wenn er im entscheidenden Augenblick stimmt, wirkt er.

---

## Abgleich mit E5-L-29

Grundlage: `_werkstatt/berichte/E5-L-29-sichtabnahme-uebrige.md`, gelesen nach dem Urteil oben. Das Urteil bleibt unverändert.

### /gleichschliessende-zylinder (E5: 7,5 → jetzt 7,2)
- **Behoben:** keiner der früheren Befunde ist am Bild als behoben erkennbar.
- **Geblieben:**
  - T1: „5 / mm“ bricht weiter (desktop 02), „3,50 €“ steht weiter in Inter.
  - T2: Der Knaufzylinder-Wert steht mobil weiter rechtsbündig mehrzeilig (mobil 03).
  - T3: Das Schriftfeld steht weiter ganz in Mono („3 zur Auswahl“, „3 Schlüssel“, desktop 00); das widerspricht inzwischen auch K-006 1.14.
  - K1: Kopf und Messhilfe zeigen weiter dieselbe Maßzeichnung (desktop 00, 03).
  - K2: Die rechte Spalte der Messhilfe ist weiter leer (desktop 04).
  - K3: Mobil steht weiter über eine Bildschirmhöhe Text vor dem ersten Bild (mobil 01).
  - D1: „Trennlinie“ steht mobil weiter am Bildschirmrand (mobil 02).
  - D2: Das Stift-Glyph am Anleitungslink ist geblieben (desktop 04).
- **Abweichung in der Wertung:** E5 sah in tablet 02 die Endlage von B-25. Im jetzigen Bildsatz stehen in tablet 02 erst drei von fünf Stiften an der Trennlinie, in desktop 01 keiner. Deshalb bewerte ich Bewegung 7 statt 8. Grafik bewerte ich 7 statt 8 wegen der leeren Türschema-Tafel und des Anschnitts mobil.

### /service-und-termin (E5: 5,3 → jetzt 6,5)
- **Behoben:**
  - K1/G1/F1/B1: Der Kopf hat jetzt den Generator `ablauf` auf getönter Bereichsfläche, das Icon steht klein an der Augenbraue (desktop 00, mobil 00). B-23 ist eingetragen, aber mangels Einzelbildern nicht am Bild geprüft. Gezeigt werden die fünf Phasen statt der vorgeschlagenen vier Wege.
  - T1: Die Phasen sind jetzt eine Liste mit Titel und Text (desktop 03).
  - T2: Mobil ist die Einrückung weg (mobil 04).
  - K2: Abschnitt 03 hat jetzt Akkordeons 03.1–03.4 (desktop 02, 04).
  - K3 mobil: Abschnitt 02 ist eine Leiste mit Anschnitt (mobil 02).
  - F2: Das Rechner-Glyph steht in Magenta (desktop 04).
  - D1: Die Unterlinks tragen Pfeile, die Selbstverlinkung ist entfallen (desktop 02).
  - D2: Die Unternummern lauten „03.1–03.4“.
- **Geblieben:**
  - T3: gerade Anführungszeichen und „z.B.“ (desktop 02, 03).
  - K2 teilweise: 03.1 ist geöffnet, mobil bleibt die Textwand (mobil 03–05).
  - K3 Desktop: weiter vier gleiche Spalten statt Tabelle (desktop 01, 02).
  - G2: Die zweite Ablaufzeichnung neben Abschnitt 03 ist entfallen, weil die Phasen jetzt im Kopf stehen. Damit ist der Befund anders gelöst.
  - D3: Die „4“ in „WEGE“ wirkt weiter nicht als Mono (desktop 00, tablet 00).
  - Die Floskeln im weichen Katalog sind geblieben.

### /artikel (E5: 5,8 → jetzt 6,7)
- **Behoben:**
  - T1/K2: Die Liste ist jetzt einspaltig mit Haarlinien, die Titel sind nicht mehr gequetscht (desktop 01).
  - T3: Die Augenbraue lautet „01 AUSWAHL“ (desktop 00).
  - K1: Der Hinweis ist eine Zeile mit Glyphe (desktop 01).
  - K3: Die Suche steht mobil in der ersten Bildschirmhöhe (mobil 00).
  - F1: Die Icons stehen ohne Kachel.
  - G2: „Zahlung und Versand“ hat ein eigenes Icon (desktop 02).
  - D1: Statt „Beispielpreis je Stück“ steht „je Stück“.
  - D2: „Filter zurücksetzen“ ist ohne aktiven Filter nicht zu sehen.
- **Geblieben:**
  - T2 mobil: „Haken.…“ (mobil 01).
  - G1 teilweise: Vier Artikel teilen weiter ein Icon, zwei ein weiteres (desktop 01, 02).
  - B1: B-20 für den Trefferzähler ist eingetragen, aber am Standbild nicht prüfbar.
  - Harter Treffer: Beispielartikel.

### /standorte/berlin (E5: 6,0 → jetzt 7,2)
- **Behoben:**
  - T1/K1: „BUNDESLAND“ ist entfallen, „Einsatzradius 40 km“ steht im Kopf (desktop 00).
  - K2: Die Bereichsliste ist einspaltig ohne leere Zelle (desktop 01).
  - B1: B-26 baut sich in Stufen auf (Einzelbilder 0–4).
  - G1/G2: Statt des fremden Autoschlüssels steht eine bemaßte Einsatzzeichnung ohne Kartenrahmen (desktop 00, mobil 00).
  - D1: Die Pfeile sind einheitlich (desktop 01, mobil 02).
- **Geblieben:** keiner der früheren Befunde. Neu sind die leere linke Spalte, das Einzelfeld im Schriftfeld, die Größe der Beschriftung mobil und das Etikett „Weiterlesen“ (siehe oben).

### /sicherheitstechnik/sicherheitscheck (E5: 7,0 → jetzt 7,2)
- **Behoben:**
  - D1: Erledigte Schritte tragen Haken, der aktuelle Schritt steht in Primärblau (schritte 39, 42, 47).
  - K2 teilweise: „Weiter“ ist am Desktop jetzt ein rechtsbündiger Knopf statt einer vollbreiten Platte (desktop 01, schritte 39).
- **Geblieben:**
  - K1: Der Ablaufkasten schiebt mobil die erste Frage auf y ≈ 645 (mobil 00).
  - K2: Die Formularfläche läuft über 12 Spalten, ohne Seitenspalte (desktop 01, schritte 39, 47).
  - K3: Die feste Weiter-Leiste steht mobil weiter über „Passende Seiten“ und dem Fuß (mobil 02–04). Das Paket nennt die feste Leiste als bekannt, daher habe ich hier keinen eigenen Befund.
  - G1: Der Fortschritt ist weiter ein schlichter Balken (desktop 00).
  - D2: „Bitte füllen Sie die Pflichtangaben …“ steht weiter vor der ersten Eingabe (desktop 01, mobil 00).

### /rechtliches/agb (E5: 6,7 → jetzt 7,0)
- **Behoben:** keiner der früheren Befunde ist am Bild als behoben erkennbar.
- **Geblieben:**
  - T1: Die Ziffern stehen weiter in Proportionalschrift.
  - T2: Mobil brechen „3. Preise, Preisrahmen / und Prüfvorbehalt“ und „7. Nachweis / der Verfügungsberechtigung“ weiter so um (mobil 01, 02).
  - K1: Der Hinweis steht weiter vor der h1.
  - K2: Brotkrumen fehlen weiter (desktop 00, mobil 00).
  - F1: Die Warnung hat weiter eine neutrale Leiste mit Rundumrahmen.
  - B1: Es gibt weiter keinen Lesefortschritt für 15 Abschnitte.
  - G1: Augenbraue und Profillinie fehlen weiter.
  - D1/D2: Die aktive Seite ist in Navigation und Chipleiste weiter nicht markiert.
  - Harter Treffer: „[Platzhalter: …]“.
- **Abweichung in der Wertung:** Den höheren Wert gegenüber E5 begründet nur meine Bewertung der Ruhe als richtig (Bewegung 8 statt 7) und der Grafik (7 statt 6). An der Seite hat sich sichtbar nichts geändert.

**Gruppe:** E5-L-29 6,4 → E6-L-34 6,9. Die Hebung kommt aus Service und Termin, Artikel und Standorte. Gleichschließende Zylinder und AGB sind unverändert; der Sicherheitscheck ist nur in der Schrittliste und beim Weiter-Knopf verbessert.

=== ENDE E6-L-34 · BEREIT ZUR RÜCKGABE ===
