# E5-L-29 · Sichtabnahme · Gruppe „uebrige“

Prüfer: unabhängiger Gestaltungsprüfer (frischer Unteragent) · Kern 1.13 · Grundlage: KERN K-001, K-003, K-006, K-007 (B-01 bis B-25), K-008, K-009 · Bildsatz `/root/sm24-bilder/e5-b/uebrige/`

**Ansichten der Gruppe:** `/gleichschliessende-zylinder`, `/service-und-termin`, `/artikel`, `/standorte/berlin`, `/sicherheitstechnik/sicherheitscheck`, `/rechtliches/agb` (bei der AGB nur die Darstellung bewertet, der Wortlaut ist unantastbar).

**Zur Bewegung:** Für diese Gruppe gibt es keine Einzelbilder. Die Bewegung habe ich nach dem Register (K-007) und nach den Zwischenständen bewertet, die in den Bildern zu sehen sind, etwa B-25 halb gelaufen in `gleichschliessende-zylinder__desktop__01`. Arbeitsansichten (Sicherheitscheck, AGB) habe ich danach bewertet, ob die Bewegung Zustände erklärt.

**Angesehene Bilder (63):**
- gleichschliessende-zylinder: desktop 00, 01, 02, 03, 04, 05 · mobil 00, 01, 02, 03, 04, 05 · tablet 01, 02 (Verdacht auf Umbruch bei der Szene B-25; Umbruch in Ordnung)
- service-und-termin: desktop 00, 01, 02, 03, 04, 05 · mobil 00, 01, 02, 03, 04, 05 · tablet 02 (Verdacht bei der Textwand und den vier Spalten; Umbruch in Ordnung)
- artikel: desktop 00, 01, 02, 03 · mobil 00, 01, 02, 03, 04, 05
- standorte-berlin: desktop 00, 01, 02 · mobil 00, 01, 02, 03, 04
- sicherheitstechnik-sicherheitscheck: desktop 00, 01, 02 · mobil 00, 01, 02, 03, 04
- rechtliches-agb: desktop 00, 01, 02, 03 · mobil 00, 01, 02, 03, 04, 05

---

## 1 · /gleichschliessende-zylinder (Erzählansicht, Bereichsseite, Kür B-25)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Die Display-h1, die Mono-Kennzahlen im Kopf (desktop 00) und die Bemaßungswerte „27 mm bis 80 mm“ (desktop 02) sitzen sauber. In den Preisnotizen bricht „5 / mm“ jedoch um (desktop 02, mobil 03/04), und mobil fällt der Wert „Maß A (außen, Schlüsselseite) …“ zweizeilig rechtsbündig unter sein Etikett (mobil 03). |
| Komposition | 7 | Der 7/5-Kopf mit Maßzeichnung und die Folge Text ↔ Grafik ↔ Liste ↔ Tabelle wechseln gut. Der Kopf zeigt aber dieselbe A/I-Zeichnung wie die Messhilfe (desktop 00 und 03), neben den Messschritten bleiben rund 800 px rechts leer (desktop 04), und mobil steht über eine Bildschirmhöhe Text vor der ersten Grafik (mobil 01). |
| Farbe und Bild | 8 | Das Bereichsorange liegt nur auf Augenbraue, Fach-Icons, Nummern und Zeichnungen, die Aktionen bleiben Primärblau. Die Flächenstufen wechseln je Abschnitt (desktop 00–05). |
| Bewegung | 8 | B-25 erklärt Mechanik: In desktop 01 heben sich die Stifte noch (Stift 1–2 über, 3–5 an der Trennlinie), in tablet 02 ist der Endzustand bündig. Das ist Bewegung mit Sinn, kein Dekor. |
| Grafik | 8 | Der Stiftzuhaltungsschnitt mit Federn, Trennlinie und Schlüsselprofil (desktop 01, tablet 02) ist unverwechselbar und fachlich. Die Maßzeichnung mit A/I und „Mitte Stulpschraube“ ist präzise. |
| Details | 7 | Gut gemacht sind die InfoTips, die Bauform-Chips und die Warnung mit Leiste links (desktop 03/04). Das Etikett „Trennlinie“ klebt jedoch mobil am Bildschirmrand (mobil 02), und der Link „Ausführliche Anleitung zum Ausmessen“ trägt ein Stift-Glyph (desktop 04). |

**Ansichtswert: 7,5**

**Generisch-Katalog:**
- **Hart:** keine.
- **Weich:**
  - Das Papierraster läuft im Kopf weich aus (Maske als Verlauf, desktop 00). Die Leitidee „Zeichenpapier“ trägt das.
  - Drei gleich gebaute Bauform-Zeilen folgen aufeinander (desktop 02). Sie sind als Vergleichsliste mit Werten gebaut, also inhaltlich begründet und getragen.

**Befunde:**
- Typografie:
  1. **desktop 02, mobil 03/04, Preisnotiz unter jeder Bauform:** „5“ und „mm“ stehen auf zwei Zeilen; „3,50 €“ steht in Inter, obwohl Beträge darüber Mono sind. → Zahl und Einheit mit geschütztem Leerzeichen koppeln, Beträge der Notiz in `font-mono tabular-nums`.
  2. **mobil 03, Knaufzylinder „Abgefragte Maße“:** Der lange Wert läuft rechtsbündig zweizeilig unter das Etikett. → Unter 640 px Etikett und Wert stapeln (`grid-cols-1`, Wert `text-left`). Rechtsbündige Mono-Werte nur für die kurzen Zeilen „Möglicher Bereich“ und „Grundpreis“.
  3. **desktop 00, mobil 00, Kennzahlenleiste im Kopf:** „3 zur Auswahl“ und „3 Schlüssel“ stehen ganz in Mono. → Nur die Zahl in `font-mono text-title-sm`, das Wort in Inter `text-small text-foreground-muted`, damit „bemaßt“ auf den Werten liegt.
- Komposition:
  1. **desktop 00 gegen desktop 03:** Kopf und Abschnitt 04 zeigen dieselbe A/I-Maßzeichnung. → In den Kopf (`PageHeader visual`, 7/5, ohne Kartenrahmen) das Schema „ein Schlüssel – drei Türen“ aus Abschnitt 01 setzen (desktop 01 oben, mobil 02); es löst die Unterzeile „Mehrere Türen, ein Schlüssel“ wörtlich ein. Die Maßzeichnung bleibt nur in der Messhilfe.
  2. **desktop 04, Messhilfe:** Die Zeichnung endet bei y ≈ 107, daneben stehen Schritte 01–04, Warnung und Hinweis vor leeren 5 Spalten. → Die Zeichnungsspalte `lg:self-start lg:sticky lg:top-24` setzen, damit sie neben den Schritten stehen bleibt.
  3. **mobil 01–02:** Einleitung und drei Absätze (≈ 1,3 Bildschirmhöhen) stehen vor dem ersten Bild. → Mobile Reihenfolge: Einleitung → Türschema → Stiftzuhaltung → Absätze → Liste (K-006 „Handlung vor Erklärung“).
- Details:
  1. **mobil 02, Szene B-25 im Ausschnitt:** „Trennlinie“ beginnt bei x = 0 am Bildschirmrand, der Schlüsselkopf ist abgeschnitten. → Den Ausschnitt so verschieben, dass das Etikett mindestens 20 px Rand hat (Rand der `shell`), oder das Etikett rechts über die Trennlinie im Zylinderkörper setzen.
  2. **desktop 04, Link „Ausführliche Anleitung zum Ausmessen“:** Das Stift-Glyph (Bearbeiten) passt nicht zu einem Weiterlesen-Link. → Als Linkzeile wie „Weiterlesen“ setzen: ganze Zeile verlinkt, rechts `GlyphPfeilRechts` mit B-06; alternativ `GlyphLineal` links.

**Das Stärkste:**
- Die Stiftzuhaltung am Scrollen (B-25) macht Mechanik sichtbar: Man sieht die Genauigkeit, bevor man sie liest.
- Die Bauform-Liste mit Mono-Bemaßung und die Beispieltabelle (desktop 02, 05) sind dicht, sachlich und vollständig bemaßt.

---

## 2 · /service-und-termin (Erzählansicht, Bereichsseite)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Die h1 und die Augenbrauen sind sauber (desktop 00). Abschnitt 03 ist dagegen eine Textwand über rund drei Bildschirmhöhen mit Fettdruck-Einläufen, geraden Anführungszeichen ("Out-of-the-box") und „z.B.“ (desktop 02–04). Mobil sind die nummerierten Punkte um ≈ 60 px eingerückt und laufen dadurch schmal (mobil 04/05). |
| Komposition | 5 | Der Kopf hat keinen Blickfang, nur ein großes Kalender-Icon und die schwache Kennzahl „WEGE 4“ (desktop 00). Es folgen vier gleiche Spalten (desktop 01/02), eine Textwand in 8 Spalten mit leerem Rand rechts (desktop 02–04) und ein Rechner in 8 Spalten (desktop 05). Mobil stehen vier gestapelte Blöcke (mobil 02). |
| Farbe und Bild | 6 | Das Bereichsmagenta erscheint nur als Strich (Augenbraue, Icons, Nummern, Aufzählungspunkte). Es gibt keine Bereichsfläche und kein Bild. Im Rechner steht als einziges ein blaues, gefüllt wirkendes Glyph (desktop 05). |
| Bewegung | 5 | Die Erzählansicht hat keinen großen Moment. Laut Register bleiben nur Profillinie (B-02), Auftritt (B-04) und Hover (B-06). |
| Grafik | 4 | Es gibt keine Fachgrafik. Das einzige Bild ist ein ≈ 80 px großes Deko-Icon im Kopf (desktop 00), auf Telefonen fehlt es ganz (mobil 00). |
| Details | 6 | Die Linkzeilen in Abschnitt 01 sind sauber. Die Unterlinks in Abschnitt 02 haben keinen Pfeil, und „Service und Termin“ verlinkt auf sich selbst (desktop 02, mobil 02). Abschnitt „03“ enthält „01–04“ in größerer Nummer (desktop 03/04), und „4“ steht in der Kennzahl nicht in Mono (desktop 00). |

**Ansichtswert: 5,3**

**Generisch-Katalog:**
- **Hart:** keine. Hinweis: Die Fachangaben in Abschnitt 03 (MIFARE DESFire EV2/EV3, AES-128, DIN 18252, DIN EN 1303) kann ich nicht prüfen. Sie gehören zur menschlichen Prüfung in `TEXTVORSCHLAEGE.md`.
- **Weich:**
  - **Floskeln, nicht getragen (K-003 nennt „nahtlos“ ausdrücklich):** „Vier Abläufe, ein Erlebnis“, „Präzision in jedem Schritt: Unsere Service-Architektur“, „Architektonische Methodik“, „integrierte architektonische Lösungen“, „höchster handwerklicher Präzision“, „auf ein absolutes Minimum“, „Die nahtlose Verzahnung“, „fortschrittlichsten Lösungen“ (desktop 01–04).
  - **Gleichförmige Spalten:** vier gleich gebaute Spalten „Direkt kaufen / Geführte Anfrage / Projektkonfigurator / Termin mit Anzahlung“ (desktop 01/02). Das ist nur teilweise getragen, weil der Inhalt eine Zuordnung ist und eher eine Tabelle wäre.

**Befunde:**
- Typografie:
  1. **desktop 03, mobil 04/05, Abschnitt 03 „01 Die Phasen …“:** Fette Einläufe und Fließtext laufen in gleicher Größe als lange Aufzählung. → Die fünf Phasen als Definitionsliste setzen: Phasenname `text-title-sm` auf eigener Zeile, Text `text-body max-w-measure`, Phasennummer in `font-mono text-caption`.
  2. **mobil 04/05, nummerierte Unterabschnitte:** Die Nummernspalte (x 20–60) rückt den Text auf x = 80 ein, die Zeilen haben 25–30 Zeichen. → Unter 640 px die Nummer über die Zwischenüberschrift setzen, Text auf volle Breite.
  3. **desktop 02, mobil 03, Fließtext:** "Out-of-the-box" steht in geraden Anführungszeichen, „z.B.“ ohne Leerraum (desktop 03/04). → Als Vorschlag in `TEXTVORSCHLAEGE.md`: „…“ und „z. B.“ mit schmalem geschütztem Leerzeichen.
- Komposition:
  1. **desktop 00, mobil 00, Kopf:** Kein Blickfang, nur das Deko-Icon rechts und die Kennzahl „WEGE 4“. → K-006 „Kopf mit Blickfang“: `PageHeader visual` 7/5 mit Generator `ablauf` (vier Stationen aus Abschnitt 02: Direkt kaufen · Geführte Anfrage · Projektkonfigurator · Termin mit Anzahlung) auf `bg-area-soft/40`. Das Icon wandert klein neben die Augenbraue.
  2. **desktop 02–04, mobil 03–05, Abschnitt 03:** Rund drei Bildschirmhöhen Text (mobil mehr als vier), die rechten 4 Spalten bleiben leer. → Die vier Unterabschnitte 01–04 als `Accordion` (B-09) mit sichtbaren Titeln; geöffnet ist nur 01. Der Wortlaut bleibt, die Kürzung geht als Vorschlag in `TEXTVORSCHLAEGE.md`.
  3. **mobil 02, Abschnitt 02:** Vier gestapelte Blöcke mit Linklisten (≈ 1,5 Bildschirmhöhen). → K-006 „Leiste statt Stapel“: `-mx-5 flex snap-x … scroll-px-5`, Karte `basis-3/4 snap-start`. Am Desktop als Tabelle „Ablauf × Bereich“ mit Haarlinien statt vier gleicher Spalten.
- Farbe und Bild:
  1. **desktop 00:** Die Bereichsfarbe ist nirgends Fläche, die Seite liest sich grau mit magentafarbenen Punkten. → Die Kopfgrafik (Komposition 1) auf `bg-area-soft/40` setzen; weitere Flächen braucht es nicht.
  2. **desktop 05, Kopf der Karte „Orientierung für Ihren Serviceeinsatz“:** Das Glyph ist Primärblau und wirkt gefüllt, als einziges zwischen magentafarbenen Strich-Icons. → `GlyphRechner` als Strich-Glyph in `text-area`; Primärblau bleibt den Aktionen.
- Bewegung:
  1. **desktop 00:** Kein großer Moment. → Mit der Kopfgrafik `ablauf` läuft B-23: Bemaßungslinie `sm24-draw` ≈ 0,6 s, vier Stationen `sm24-pop` mit 120 ms Abstand, gesamt unter 1,6 s. Mehr Bewegung braucht die Seite nicht.
- Grafik:
  1. **desktop 00:** Das große Kalender-Icon ist das einzige Bild der Seite. → Generator `ablauf` mit den vier Wegen (siehe Komposition 1), das Deko-Icon entfällt.
  2. **desktop 02–04, rechte 4 Spalten neben Abschnitt 03:** → Eine zweite `ablauf`-Zeichnung mit den fünf vorhandenen Phasen (Bedarfsanalyse → Projektierung → Fertigung → Montage → Dokumentation), `lg:sticky`, mobil über dem Accordion als Ausschnitt.
- Details:
  1. **desktop 02, mobil 02, Linkzeilen unter den vier Abläufen:** Die Zeilen tragen keinen Pfeil, und der Link auf „Service und Termin“ führt auf diese Seite selbst. → `GlyphPfeilRechts` mit B-06 wie in Abschnitt 01; die Selbstverlinkung als `aria-current="page"` ohne Link in `text-foreground-muted`.
  2. **desktop 03/04, Unternummern:** Die Nummern „01–04“ sind größer und farbiger als die Abschnittsnummer „03“ und konkurrieren mit der Gliederung. → Unternummern `font-mono text-caption text-foreground-muted` oder „03.1–03.4“.
  3. **desktop 00, mobil 00, Kennzahl „WEGE 4“:** Die „4“ steht in Inter, auf den anderen Seiten sind Kennzahlen Mono (zum Beispiel „40 km“ in Berlin). → `font-mono tabular-nums`.

**Das Stärkste:**
- Die Anliegen-Liste in Abschnitt 01 mit Fach-Icons, ganzer Zeile als Link und Pfeil (desktop 00/01, mobil 01) ist klar und schnell.
- Der Rechner „Orientierung für Ihren Serviceeinsatz“ ist bemaßt: Einheiten wie „je Tür“ und „pauschal“ stehen in Mono am Titel (desktop 05).

---

## 3 · /artikel (Shop-Liste; Auswahlansicht mit Erzählkopf, bewertet mit der Ruhe einer Arbeitsansicht)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | Die Preise stehen in Mono, rechtsbündig und gut lesbar (desktop 01). Die Titel brechen in der nur ≈ 200 px breiten Titelspalte zweizeilig um, Kürzungen enden auf „Haken....“, „Einlegeschild....“ oder mitten im Wort („Erschwe...“, desktop 01, mobil 01/02). Die Augenbraue „01 8 ARTIKEL“ liest sich als „018“ (desktop 00). |
| Komposition | 6 | Mobil ist es gut gelöst: Schlagworte eingeklappt, Liste mit Haarlinien (mobil 01/02). Am Desktop stehen drei gleiche Spalten mit leerem neuntem Platz und gequetschten Titeln (desktop 01), und der Hinweiskasten läuft über alle 12 Spalten (desktop 00). |
| Farbe und Bild | 6 | Die Farben sind ruhig. Alle acht Artikel tragen aber dieselbe hellblaue Kachel mit Rahmen, die Liste wirkt dadurch einförmig (desktop 01, mobil 01/02). |
| Bewegung | 6 | Ruhe ist hier richtig. Ob der Filterwechsel eine Rückmeldung gibt, ist im Bild nicht zu erkennen; der Zähler „8 Artikel von 8“ bleibt statisch. |
| Grafik | 5 | Sechs von acht Artikeln zeigen dasselbe Kasten-Icon (Schlüsselkasten, Safe, Kappen, Anhänger, Pflegespray, Fenstergriff), auch „Zahlung und Versand“ trägt es (desktop 01/02). |
| Details | 6 | Die Kennzeichnung „Beispiel“ steht dreifach: Chip, Fußzeile „Beispielpreis je Stück“ und globaler Hinweis. „Filter zurücksetzen“ zeigt sich als großer, gesperrt wirkender Knopf, obwohl kein Filter aktiv ist (desktop 01, mobil 01). |

**Ansichtswert: 5,8**

**Generisch-Katalog:**
- **Hart:**
  - **Platzhalter:** acht Beispielartikel mit Beispielpreisen (desktop 01, mobil 01/02). Sie sind offen gekennzeichnet und nicht bestellbar, bleiben aber Platzhalter auf einer öffentlichen Seite. Die Gestaltung kann das nicht lösen: Echte Artikel liefert der Mensch, oder die Liste wird bis dahin ausgeblendet. Entscheidung für `MENSCHEN.md`.
- **Weich:**
  - **Gleichförmige Karten als vorherrschendes Muster** (desktop 01). Für eine Shop-Liste ist das Muster teilweise getragen. Erst durch das gleiche Icon in jeder Karte wird es generisch.

**Befunde:**
- Typografie:
  1. **desktop 01, Artikelkarte:** Der Titel bricht in einer ≈ 200 px breiten Spalte um („Schlüsselkasten / für 20 Schlüssel“), obwohl die Karte ≈ 370 px breit ist. → Preis unter die Beschreibung setzen (`font-mono text-title-sm`, Pfeil rechts daneben), damit der Titel die ganze Breite nutzt; `text-balance` an Kartentiteln entfernen.
  2. **desktop 01, mobil 01/02, Beschreibung:** Die Textkürzung erzeugt „Haken....“ (Punkt plus drei Punkte) und schneidet Wörter („Erschwe...“). → Kürzung per CSS `line-clamp-2` statt per Zeichenkette; dann gibt es ein echtes „…“ ohne zerschnittene Wörter.
  3. **desktop 00, mobil 00, Augenbraue „01 8 ARTIKEL“:** Die Laufnummer und die Anzahl verschmelzen zu „018“. → Augenbraue „01 AUSWAHL“ (Mikrotext); die Anzahl steht ohnehin in „8 Artikel von 8“.
- Komposition:
  1. **desktop 00, Hinweis „Derzeit nur Beispielartikel“:** Der Kasten läuft über 12 Spalten, die Zeile ist ≈ 1 060 px lang (über `max-w-measure`). → Nach K-006 „Flächen sparsam“ eine Zeile mit `GlyphInfo`, höchstens 8 Spalten, direkt über dem Zähler der Liste statt im Kopf.
  2. **desktop 01, Liste:** Drei Spalten mit gequetschten Titeln und leerem neuntem Platz. → Ab `lg` zwei Spalten oder eine einspaltige Liste mit Haarlinien (Icon · Titel + Beschreibung · Preis · Pfeil) wie die Linkzeilen in Abschnitt 02.
  3. **mobil 00:** Kopf und Hinweiskasten füllen die erste Bildschirmhöhe, Suche und Liste beginnen erst auf der zweiten. → Unter 640 px den Hinweis auf eine Zeile mit Glyph kürzen und die Suche direkt unter die Einleitung setzen.
- Farbe und Bild:
  1. **desktop 01, mobil 01/02, Icon-Kacheln:** Jedes Icon sitzt in einer hellblauen Kachel mit Rahmen. → Nach K-008a Fach-Icon in Kachelgröße ohne Kasten: 40 px, `text-area` mit `fill-area-muted`, keine Kachel.
- Bewegung:
  1. **desktop 01, mobil 01, Zähler „8 Artikel von 8“ beim Filterwechsel:** Im Bild ist keine Zustandsrückmeldung zu sehen. → Der Zähler pulst bei Änderung mit `sm24-pop` `quick` (wie B-20; der Registereintrag kommt vom Orchestrator), sonst nichts.
- Grafik:
  1. **desktop 01:** Sechs Artikel tragen dasselbe Kasten-Icon. → Je Artikel das nächstliegende vorhandene Fach-Icon (K-008 „Grafiken statt Platzhalter“): Kappen und Anhänger `schluessel-kopieren`, Pflegespray `profilzylinder`, Fenstergriff `mehrfachverriegelung`, Safe `tuerzusatzschloss`. Nur vorhandene Icons, keine neuen Inhalte.
  2. **desktop 02, mobil 03, Linkzeile „Zahlung und Versand“:** Die Zeile trägt dasselbe Kasten-Icon wie die Artikel. → `versand-paket` oder `zahlung`.
- Details:
  1. **desktop 01, mobil 01/02:** „Beispiel“-Chip und „Beispielpreis je Stück“ wiederholen in jeder Karte, was der Hinweis schon sagt. → Den Chip behalten, die Fußzeile auf „je Stück“ kürzen (Mikrotext).
  2. **desktop 01, mobil 01, „Filter zurücksetzen“:** Ohne aktiven Filter steht ein großer grauer Knopf neben dem Zähler. → Erst einblenden, wenn ein Filter aktiv ist, sonst den Platz für den Zähler lassen.

**Das Stärkste:**
- Die mobile Liste mit eingeklappten Schlagworten, Mono-Preisen und ganzer Zeile als Link (mobil 01/02) ist ruhig und schnell.
- Die Weiterlesen-Zeilen mit Mono-Nummern und Fach-Icons (desktop 02, mobil 03) zeigen Ordnung.

---

## 4 · /standorte/berlin (Erzählansicht, Standort)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Die Display-h1 ist auf zwei Zeilen gut gesetzt, die Augenbraue und „40 km“ stehen in Mono (desktop 00/01). Das Feld „BUNDESLAND Berlin“ wiederholt nur h1 und Augenbraue. |
| Komposition | 6 | Der 7/5-Kopf steht. Danach braucht ein ganzer Abschnitt ≈ 280 px für zwei Angaben (desktop 00 unten, mobil 01), und die Fünferliste lässt eine leere Zelle (desktop 01). Die Seite wirkt dünn und austauschbar. |
| Farbe und Bild | 7 | Bereichsfarben erscheinen nur im Bereichskontext (Icons der Leistungsliste, desktop 01), und die Kopfgrafik ist hellblau gefüllt. |
| Bewegung | 5 | Die Erzählansicht hat keinen erkennbaren Moment, und die Kopfgrafik ist statisch. |
| Grafik | 5 | Die Kopfgrafik ist ein Autoschlüssel mit Funkwellen. Er hat keinen Bezug zu Berlin oder zum Einsatzradius und steht im Kartenrahmen, gegen das Kopfmuster (desktop 00, mobil 00). |
| Details | 6 | Die Pfeile sind uneinheitlich: in der Bereichsliste dunkel, in „Alle Einsatzgebiete“ und „Autoschlüssel-Termin“ Primärblau (desktop 01, mobil 02). |

**Ansichtswert: 6,0**

**Generisch-Katalog:**
- **Hart:** keine.
- **Weich:** keine Treffer im Katalog. Die Seite ist sauber, aber vorhersehbar (Anker 5–6), weil sie keinen eigenen Blickfang hat.

**Befunde:**
- Typografie:
  1. **desktop 00/01, mobil 01, „BUNDESLAND Berlin“:** Das Feld wiederholt h1 und Augenbraue. → Feld entfernen. „EINSATZRADIUS 40 km“ als Kennzahl (`font-mono text-title-sm`) in den Kopf unter die Einleitung, wie die Kennzahlenleiste der Bereichsseiten.
- Komposition:
  1. **desktop 00 unten, mobil 01, Abschnitt 01 „Berlin und Umgebung“:** Ein ganzer Abschnitt mit `py-section` trägt zwei Angaben. → In den Kopf zusammenziehen (siehe Typografie 1); die Seite geht vom Kopf direkt zu „Bereiche in dieser Region“, die Nummerierung rückt nach.
  2. **desktop 01, Bereichsliste:** Fünf Einträge in zwei Spalten lassen rechts unten eine leere Zelle. → Eine Spalte mit Haarlinien wie die Anliegen-Liste von Service und Termin, oder die beiden Linkzeilen „Alle Einsatzgebiete“ und „Autoschlüssel-Termin“ in die freie Zelle.
- Bewegung:
  1. **desktop 00, Kopf:** Kein Moment. → Mit der Radiuszeichnung (Grafik 1) zeichnet sich der Kreis einmal (`sm24-draw`, `enter`), die Bemaßung „r 40 km“ erscheint danach (`sm24-pop`). Das folgt den Stufen von B-23; einen Registereintrag für Standorte trägt der Orchestrator nach.
- Grafik:
  1. **desktop 00, mobil 00, Kopfgrafik:** Der Autoschlüssel ist die Zeichnung eines anderen Bereichs und sagt nichts über den Standort. → Bemaßte Einsatzzeichnung aus der Grundgeometrie (K-008): Kreis auf Zeichenpapier, Mittelpunktmarke, Bemaßungslinie „r 40 km“ in Mono. Nur vorhandene Angaben.
  2. **desktop 00:** Die Grafik steht in einer Karte mit Rahmen und Radius. → Nach K-006 „Kopf mit Blickfang“ ohne Kartenrahmen auf Papier oder `bg-area-soft/40`.
- Details:
  1. **desktop 01, mobil 02, Pfeile:** In der Bereichsliste sind die Pfeile `foreground`, in den Linkzeilen darunter `primary`. → Ein Ton für alle `GlyphPfeilRechts` (`text-foreground-muted`, Primärfarbe nur bei Hover und Fokus über B-06).

**Das Stärkste:**
- Die Leistungsliste mit den Fach-Icons der Bereiche in ihren Akzentfarben zeigt Farbe genau dort, wo sie Bedeutung hat (desktop 01).
- Kopf, Einleitung mit Radius und ein klarer Termin-Knopf, mobil in der Folge Kopf → Grafik → Aktion (mobil 00).

---

## 5 · /sicherheitstechnik/sicherheitscheck (Arbeitsansicht, geführter Ablauf)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 8 | Die h1 steht richtig in `text-headline`. „Schritt 1 von 10“ und die Schrittnummern sind in Mono, Frage, Etikett „(Pflichtangabe)“ und Hilfstext ordnen sich klar (desktop 00/01). |
| Komposition | 6 | Am Desktop läuft das Formular über 12 Spalten: Textfeld ≈ 1 176 px, „Weiter“ als vollbreite Platte (desktop 01). Mobil schiebt der Ablaufkasten die erste Frage auf y ≈ 650 (mobil 00), und die feste Weiter-Leiste bleibt über „Passende Seiten“ und dem Fuß stehen (mobil 02–04). |
| Farbe und Bild | 8 | Bereichsrot liegt nur auf Augenbraue und Fach-Icon, Fortschritt und Aktionen sind Primärblau, gesperrt wirkt als ruhige Fläche. Das ist korrekt nach K-003. |
| Bewegung | 8 | Für den Ablauf sind B-10 (Fortschritt `scaleX`), B-11 (Schrittwechsel) und B-12 vorgesehen. Bewegung erklärt hier Zustände; im Standbild ist kein Fehler zu sehen. |
| Grafik | 6 | Außer dem Fach-Icon gibt es nichts Zeichnerisches. Der Fortschritt ist ein schlichter 4-px-Balken ohne Bemaßungscharakter (desktop 00, mobil 00). |
| Details | 6 | Die Schrittliste unterscheidet erledigt, aktuell und offen nur über die Farbe des aktuellen Schritts (desktop 00). „Bitte füllen Sie die Pflichtangaben …“ steht schon vor der ersten Eingabe da (desktop 01, mobil 00). |

**Ansichtswert: 7,0**

**Generisch-Katalog:**
- **Hart:** keine. Die feste Leiste verdeckt den Fuß nur beim Scrollen (mobil 03, Zeile „AGB“), am Seitenende ist alles erreichbar (mobil 04). Siehe Komposition 3.
- **Weich:** keine.

**Befunde:**
- Komposition:
  1. **mobil 00, Ablaufkasten „Geführte Anfrage“:** Icon und vier Zeilen schieben die erste Frage auf y ≈ 650, die Optionen beginnen erst auf der zweiten Bildschirmhöhe. → Unter 640 px zu einer Zeile mit Glyph unter der Einleitung kürzen oder unter den Ablauf setzen, damit die erste Option in der ersten Bildschirmhöhe steht.
  2. **desktop 00/01:** Das Formular läuft über 12 Spalten (Textfeld ≈ 1 176 px, „Weiter“ vollbreit). → Ablauf in `lg:col-span-8`. Rechts 4 Spalten mit der Schrittliste senkrecht (Mono-Nummern, `lg:sticky`). „Weiter“ rechtsbündig in Knopfgröße `md`.
  3. **mobil 02–04, feste Leiste „Weiter“:** Sie bleibt mit „Bitte füllen Sie …“ über „Passende Seiten“ und dem Fuß stehen und verdeckt in mobil 03 den Link „AGB“. → Die Leiste an den Ablauf binden (`sticky bottom-0` innerhalb von `FlowShell`), sodass sie mit dem Ablauf endet und danach die normale `MobileActionBar` zurückkehrt.
- Grafik:
  1. **desktop 00, mobil 00, Fortschritt:** Der schlichte Balken widerspricht „bemaßt statt behauptet“. → Fortschritt als Bemaßungslinie mit zehn Teilstrichen und Mono-Ziffern an den Marken, gelaufener Abschnitt `primary`. B-10 (`scaleX`) bleibt.
- Details:
  1. **desktop 00, Schrittliste „1. Objekt … 10. Übersicht“:** Offene und erledigte Schritte sehen gleich aus. → Erledigt mit `GlyphHaken`, aktuell `text-primary` mit 2-px-Unterstrich, offen `text-foreground-muted` ohne Zeiger.
  2. **desktop 01, mobil 00, Hinweis über „Weiter“:** „Bitte füllen Sie die Pflichtangaben dieses Schrittes aus.“ steht vor jeder Eingabe und liest sich wie ein Fehler. → Als `aria-describedby` des gesperrten Knopfs behalten, sichtbar erst nach dem ersten Weiter-Versuch oder klein neben dem Knopf statt darüber.

**Das Stärkste:**
- Der Ablaufkopf mit Mono-Zähler „Schritt 1 von 10“ und Schrittnamen gibt sofort Orientierung (desktop 00).
- Die Mobilfassung mit eigener Weiter-Leiste in der Daumenzone und großen Optionsflächen (mobil 01) ist eine eigene Komposition, kein verkleinerter Desktop.

---

## 6 · /rechtliches/agb (Arbeitsansicht, Rechtstext; nur Darstellung bewertet)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | `text-headline` für die h1, klare Zwischenüberschriften und ruhiger Durchschuss (desktop 00–02). Die Ziffern „1.“ bis „15.“ stehen aber in Inter im Titel, und mobil hinterlassen ausgeglichene Umbrüche Reststücke wie „7. Nachweis / der Verfügungsberechtigung“ (mobil 02). |
| Komposition | 7 | Die feste Seitennavigation links und die Chipleiste mit Anschnitt mobil sind richtig (desktop 01, mobil 00). Der Hinweiskasten steht aber vor der h1, und Brotkrumen fehlen, anders als auf allen anderen Ansichten (desktop 00). |
| Farbe und Bild | 7 | Die Seite ist ruhig und neutral, wie es sich gehört. Der Hinweis auf die fehlende juristische Prüfung ist eine Warnung, trägt aber eine neutrale Leiste und einen vollen Rahmen (desktop 00, mobil 00). |
| Bewegung | 7 | Ruhe ist richtig. Bei 15 Abschnitten fehlt jedoch die Orientierung, welcher Abschnitt gerade gelesen wird. |
| Grafik | 6 | Das Leitelement fehlt: Über der h1 stehen keine Augenbraue mit Bemaßungsmarke und keine Profillinie, die jede andere Ansicht hat (desktop 00). |
| Details | 6 | Die Seitennavigation markiert die aktuelle Seite nicht, „AGB“ ist so grau wie alle anderen (desktop 00–02). Mobil liegt der aktuelle Chip außerhalb des Bildes (mobil 00). |

**Ansichtswert: 6,7**

**Generisch-Katalog:**
- **Hart:**
  - **Platzhalter:** Alle 15 Abschnitte bestehen aus „[Platzhalter: …]“ (desktop 00–03, mobil 00–04). Die Seite kennzeichnet das selbst, und der Wortlaut ist unantastbar. Lösen kann das nur der Mensch durch die juristische Fassung vor dem Livegang; die Gestaltung kann es nicht. Pflichtpunkt in `MENSCHEN.md`.
- **Weich:** keine.

**Befunde:**
- Typografie:
  1. **desktop 00–02, Zwischenüberschriften „1.“ bis „15.“:** Die Ziffern in Inter verschieben die Titelanfänge. → Ziffern in eine hängende Spalte setzen (`font-mono tabular-nums text-foreground-muted`, `w-10`, links außerhalb der Textkante). Der Wortlaut bleibt unverändert.
  2. **mobil 01/02, Umbrüche:** „3. Preise, Preisrahmen / und Prüfvorbehalt“ und „7. Nachweis / der Verfügungsberechtigung“ brechen ungünstig. → `text-wrap: pretty` statt `balance` für h2 in Rechtstexten.
- Komposition:
  1. **desktop 00, mobil 00:** Die Seite beginnt mit dem Hinweiskasten, die h1 folgt erst darunter. → Reihenfolge h1 → Einleitung → Hinweis (höchstens 8 Spalten).
  2. **desktop 00, mobil 00:** Brotkrumen fehlen. → `Breadcrumbs` „Start › AGB“ wie auf allen anderen Ansichten, an derselben Stelle über der Augenbraue.
- Farbe und Bild:
  1. **desktop 00, mobil 00, „Hinweis zum Stand dieser Seite“:** Inhaltlich eine Warnung, gestaltet mit neutraler Leiste und vollem Rahmen. → Nach K-006: `surface` mit 2-px-Leiste links in `warning`, ohne Vollrahmen, höchstens 8 Spalten; `GlyphWaage` bleibt.
- Bewegung:
  1. **desktop 01/02, feste Spalte links:** Bei 15 Abschnitten gibt es keine Orientierung innerhalb der AGB. → Unter den sechs Rechtsseiten die Abschnitte 1–15 als zweite Liste mit dem Mechanismus von B-24 (Leiste `scaleY`, Nummer an der Leselinie in Primärfarbe, nur mit `animation-timeline`). Der Registereintrag für Rechtstexte kommt vom Orchestrator.
- Grafik:
  1. **desktop 00, mobil 00, über der h1:** Augenbraue und Profillinie fehlen. → Augenbraue „RECHTLICHES“ (vorhandenes Etikett) mit Bemaßungsmarke und Profillinie klein (10 px, B-02), sonst keine Grafik.
- Details:
  1. **desktop 00–02, Seitennavigation:** Die aktuelle Seite ist nicht markiert. → `aria-current="page"` mit `text-foreground font-medium` und 2-px-Leiste links in `primary`.
  2. **mobil 00, Chipleiste:** „AGB“ liegt rechts außerhalb des Bildes und ist nicht markiert. → Aktiven Chip beim Laden in die Mitte holen (über `scrollVerhalten()`) und als aktiv kennzeichnen (`bg-primary-soft`, Rahmen `primary`).

**Das Stärkste:**
- Lesbarkeit: Messbreite, ruhiger Durchschuss und keine Inszenierung (desktop 00–02).
- Die mobile Chipleiste mit Anschnitt statt eines langen Linkstapels (mobil 00).

---

## Ergebnis der Gruppe

| Ansicht | Typo | Komp. | Farbe/Bild | Bewegung | Grafik | Details | Wert |
|---|---|---|---|---|---|---|---|
| /gleichschliessende-zylinder | 7 | 7 | 8 | 8 | 8 | 7 | 7,5 |
| /service-und-termin | 6 | 5 | 6 | 5 | 4 | 6 | 5,3 |
| /artikel | 6 | 6 | 6 | 6 | 5 | 6 | 5,8 |
| /standorte/berlin | 7 | 6 | 7 | 5 | 5 | 6 | 6,0 |
| /sicherheitstechnik/sicherheitscheck | 8 | 6 | 8 | 8 | 6 | 6 | 7,0 |
| /rechtliches/agb | 7 | 7 | 7 | 7 | 6 | 6 | 6,7 |

**Mittel der Gruppe: 6,4**

**Harte Treffer gesamt: 2.** Beide lassen sich nicht durch Gestaltung lösen und gehen an den Menschen:
- `/artikel`: Beispielartikel als Platzhalter.
- `/rechtliches/agb`: Rechtstext-Gerüst mit „[Platzhalter: …]“.

**Die drei wirksamsten Änderungen über die Gruppe:**
1. **Köpfe mit Blickfang, wo er fehlt:**
   - Service und Termin bekommt den Generator `ablauf` mit den vier vorhandenen Wegen auf `bg-area-soft/40` mit B-23 und ersetzt so das Deko-Icon.
   - Berlin bekommt eine bemaßte Einsatzzeichnung (Kreis, „r 40 km“) statt des fremden Autoschlüssels, ohne Kartenrahmen.
   - Die Gleichschließungsseite setzt das Schema „ein Schlüssel – drei Türen“ in den Kopf statt der doppelten Maßzeichnung.

   Das hebt die beiden schwächsten Erzählansichten am stärksten.
2. **Abschnitt 03 von Service und Termin entschärfen:** Die Floskel-Textwand über rund drei Bildschirmhöhen wird ein Accordion (B-09) mit sichtbaren Titeln. Daneben steht eine feste `ablauf`-Zeichnung der fünf Phasen. Floskeln und Typografie („…“, „z. B.“) gehen als Vorschlag in `TEXTVORSCHLAEGE.md`.
3. **Arbeitsansichten mobil und am Desktop ordnen:**
   - Im Sicherheitscheck die Weiter-Leiste an den Ablauf binden, den Ablaufkasten mobil auf eine Zeile kürzen und am Desktop 8/4 mit fester Schrittliste setzen.
   - In der AGB die aktuelle Seite in Navigation und Chipleiste markieren und die h1 vor den Hinweis stellen.

---

## Abgleich mit E4-L-23

Für die Gruppe „uebrige“ gibt es keinen früheren Bericht. Mit `ls _werkstatt/berichte/` geprüft: vorhanden sind nur `E4-L-23-sichtabnahme-arbeit.md`, `-erzaehl-1.md` und `-erzaehl-2.md`. Für keine der sechs Ansichten gibt es frühere Befunde; es ist nichts behoben und nichts geblieben. Dieser Bericht ist die erste Sichtabnahme der Gruppe und gilt als Ausgangsstand.

=== ENDE E5-L-29 · BEREIT ZUR RÜCKGABE ===
