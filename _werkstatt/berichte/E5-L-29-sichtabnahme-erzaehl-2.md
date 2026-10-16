# E5-L-29 · Sichtabnahme · Gruppe erzaehl-2

Rolle: unabhängiger Gestaltungsprüfer · Kern-Version 1.13 · Grundlage: KERN K-001, K-003, K-005, K-006, K-007 (B-01 bis B-25), K-008, K-009 · Urteil nur aus Bildern und Register.

Ansichten: H05 Code-Shop, H06 Codelinie MS-01, H08 Schließanlagen, H09 Türtechnik. Alle vier sind Erzählansichten (K-009); H06 trägt zusätzlich eine Bestellkarte als Arbeitsbereich.

## Angesehene Bilder

Bildsatz `/root/sm24-bilder/e5-b/`:

- **H05:** `H05-code-shop__desktop__00` bis `__09` (10) · `H05-code-shop__mobil__00`, `__01`, `__02`, `__03`, `__04`, `__05`, `__06`, `__07`, `__09`, `__10` (10) · `H05-code-shop__tablet__01` (Verdacht Spaltenumbruch der Liste) · Einzelbilder `einzelbilder/H05/schluessel-nach-code__desktop__main-svg-role-img__0` bis `__4`.
- **H06:** `H06-code-produkt__desktop__00` bis `__03` (4) · `H06-code-produkt__mobil__00` bis `__07` (8).
- **H08:** `H08-schliessanlagen__desktop__00` bis `__07` (8) · `H08-schliessanlagen__mobil__00` bis `__09` (10) · `H08-schliessanlagen__tablet__02` (Verdacht Ausrichtung der Türknöpfe) · Einzelbilder `einzelbilder/H08/schliessanlagen__desktop__main-svg-viewbox-0-0-480-300__0` bis `__4`.
- **H09:** `H09-tuertechnik__desktop__00` bis `__06` (7) · `H09-tuertechnik__mobil__00` bis `__09` (10) · Einzelbilder `einzelbilder/H09/tuer-und-schliesstechnik__desktop__main-svg-viewbox-0-0-480-300__0` bis `__4`.

Hinweis zum Bildsatz: Zwischen zwei Bildschirmhöhen verdeckt der feste Kopf jeweils etwa 80 px (z. B. das Suchfeld auf H05 Desktop, die Augenbraue „03“ auf H08 Desktop). Diese Stellen sind nicht bewertet.

---

## H05 · Code-Shop (`/schluessel-nach-code`)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Kennungen, Formate und Preise stehen in Mono, h1 und Augenbrauen sind sauber (desktop__00, __01). Der dreizeilige Preisblock mit „je Stück“ und „Staffelpreis ab 3 Stück“ wiederholt sich aber 52-mal und macht die Liste unruhig (desktop__01 bis __07). |
| Komposition | 6 | Der Kopf in 7/5 mit Grafik trägt (desktop__00). Danach läuft eine ungekürzte Liste über sechs Bildschirmhöhen ohne Blickfang und ohne Sprungmarke (desktop__01 bis __07); die Code-Spalte ist 200 px breit für fünf Zeichen. |
| Farbe und Bild | 7 | Violett bleibt bei Augenbraue, Gruppenköpfen, Fach-Icons und Grafik, Aktionen sind `primary`, und die Flächen stufen sich sauber bis zum Fuß (desktop__00, __07, __08). Kopf und Lupe sind aber vollflächig `area-muted` gefüllt und wirken wie ein vergrößertes Icon. |
| Bewegung | 7 | B-22 zeigt die Mechanik „wo steht der Code“: Fundkreis, dann Lupe, dann Code (Einzelbilder __1 bis __4). Die Verbindungslinien erscheinen aber auf einen Schlag, statt die Blickrichtung zu zeichnen (__2). |
| Grafik | 6 | Die Fundstellen-Grafik im Kopf hat weder Bemaßung noch Mono-Beschriftung, der Bart ist ein generisches Zickzack (desktop__00). Dieselbe Grafik steht noch einmal auf H06 (H06 desktop__01). |
| Details | 7 | Haarlinien, Gruppenetiketten rechts und Pfeile sind stimmig. Mobil bricht „Staffelpreis ab 3 Stück“ bei fünfstelligen Preisen um, bei vierstelligen nicht (mobil__04, __05, __07), und „Alle 6 anzeigen“ ist ein nackter Textlink (mobil__02, __03). |

**Ansichtswert: 6,7**

**Generisch-Katalog**
- Hart: keine.
- Weich: lange, gleichförmige Zeilenliste (52 Zeilen). Als Shop-Katalog ist sie von der Aufgabe getragen; in dieser Länge und ohne Gliederungshilfe trägt die Leitidee sie nicht (siehe Komposition). Keine Verläufe, kein Glas, keine Floskeln.

**Befunde**
1. Typografie · desktop__01 bis __07, Preisspalte jeder Zeile (mobil__01 bis __07 ebenso) · Der Preis steht dreizeilig, „je Stück“ und „Staffelpreis ab 3 Stück“ erscheinen 52-mal. · Den Hinweis einmal je Gruppe setzen, rechts im Gruppenkopf neben dem Etikett (z. B. „Möbelschlüssel · je Stück · Staffel ab 3“) in `text-caption` Mono `foreground-muted`. In der Zeile bleibt nur `8,00 €` (`font-mono tabular-nums`, rechtsbündig). Die Zeilenhöhe sinkt so von etwa 92 auf 56 px.
2. Typografie · desktop__00 und mobil__00, Kasten „Ihr Originalschlüssel bleibt bei Ihnen“ · Der umrahmte Kasten mit Fettung wiederholt den Lead („Ohne Einsendung des Originals“) und ist nach der h1 die zweitstärkste Fläche im Kopf. · Nach K-006 („Flächen sparsam“) eine Zeile mit `GlyphInfo` ohne Rahmen und ohne Fettung daraus machen. Nur der Satz „Kein Code vorhanden? … Vorlage weiter.“ bleibt, als Link im Satz.
3. Typografie · desktop__01 und mobil__01, Zähler „52 Codelinien von 52“ · Die Wortstellung liest sich verdreht. · „52 von 52 Codelinien“ schreiben (Mikrotext), die erste Zahl fett, beide Zahlen `tabular-nums`.
4. Komposition · desktop__01 bis __07 · Sechs Bildschirmhöhen Liste ohne Orientierung; „Weiterlesen“ kommt erst in desktop__07. · Unter den Filtern eine Sprungleiste der zehn vorhandenen Gruppenkürzel (MS · SP · BK · ZY · VH · TS · FE · FA · MA · GO) in Mono setzen, `sticky` unter dem Kopf (`z-sticky`). Mobil wird daraus eine horizontale Leiste mit Anschnitt (`snap-x scroll-px-5`).
5. Komposition · desktop__01 bis __07 im Vergleich zu mobil__02 · Mobil zeigt je Gruppe vier Zeilen plus „Alle n anzeigen“, Desktop zeigt alle Zeilen. · Die Kürzung auf vier Zeilen ab `md` übernehmen. Die Liste schrumpft so von etwa sechs auf drei Bildschirmhöhen; mit Befund 1 wird sie noch kürzer.
6. Komposition · desktop__01, Spaltenaufbau der Zeile · Die Code-Spalte (132 bis 332 px) ist leer, zwischen Format und Preis liegen etwa 300 px Luft. · Im Zwölferraster setzen: Code `col-span-1`, Name `col-span-5`, Format `col-span-4`, Preis `col-span-2` mit Pfeil. Der Blicksprung von Code zu Preis wird kürzer.
7. Farbe und Bild · desktop__00, Kopfgrafik · Schlüsselkopf und Lupenglas sind vollflächig violett gefüllt und lesen sich als Icon, nicht als Zeichnung. · Den Kopf `fill-surface` mit `stroke-area` zeichnen. Die Fläche `area-soft` bekommen nur der Fundkreis (gestrichelt) und das Lupenglas.
8. Bewegung · Einzelbilder H05 __2 und __3 · Die beiden Verbindungslinien vom Fundkreis zur Lupe stehen bei ½ fertig da, das Glas ist leer. · Die Linien mit `sm24-draw` (`base`, `draw`) vom Fundkreis zur Lupe ziehen, danach die Lupe `sm24-pop`, zuletzt die Codestriche. Die Reihenfolge Kopf → Blick → Vergrößerung wird so lesbar, gesamt unter 1,6 s.
9. Grafik · desktop__00, Kopfgrafik · Die Grafik hat keine Bemaßung und keine Mono-Beschriftung, und der Bart ist ein Zickzack ohne Bezug zu echten Einschnitten. · An den Fundkreis eine Hinweislinie mit der Beschriftung „Am Schlüsselkopf“ setzen (vorhandener Wortlaut der H06-Umschalter, `text-caption` Mono). Den Bart aus den Einschnitt-Regeln des Profil-Generators nehmen.
10. Grafik · desktop__00 im Vergleich zu H06 desktop__01 · H05 zeigt im Kopf dieselbe Lupen-Grafik wie H06 in Abschnitt 02. · Im H05-Kopf die drei vorhandenen Fundstellen-Zustände (Schlüsselkopf · Sicherungskarte · Zylinderstirn) klein nebeneinander als Dreierreihe zeigen. Der Kopf erzählt dann, wo man suchen kann; die Einzelansicht mit Lupe bleibt H06.
11. Details · mobil__04, __05, __07, Preiszeile · Bei „10,00 €“ und „12,00 €“ fällt „Staffelpreis ab 3 Stück“ in eine zweite Zeile, bei „8,00 €“ nicht. · Mit Befund 1 entfällt der Hinweis in der Zeile. Bis dahin den Staffelhinweis immer in eine eigene Zeile setzen.
12. Details · mobil__02, __03, „Alle 6 anzeigen“ / „Alle 5 anzeigen“ · Der Textlink ohne Glyphe ist als Aufklapp-Steuerung schwer zu erkennen. · `GlyphWinkelUnten` rechts ergänzen, die Zahl in Mono setzen, `min-h-touch`, oben eine Haarlinie wie bei den Listenzeilen und den Pfeil mit B-09 drehen.
13. Details · desktop__00, rechte Kopfspalte · Die Augenbraue „CODEFUNDSTELLE“ und der Titel „Wo steht der Code?“ machen eine zweite Kopfzeile neben „DIREKT KAUFEN“. · Augenbraue und Titel über der Grafik streichen und den Wortlaut als `<title>` der Grafik führen. Die Grafik steht dann ohne Überschrift auf Papier (Muster „Kopf mit Blickfang“).

**Das Stärkste**
- Der Katalog liest sich wie eine Werkstattliste: Kennung, Anwendung, Codeformat und Preis stehen in einer festen Mono-Ordnung, die Gruppenköpfe tragen Kürzel und Etikett (desktop__03, __04).
- Mobil ist eine eigene Komposition: Suche zuerst, „Filter anzeigen“ als Knopf, vier Zeilen je Gruppe mit Aufklappen (mobil__01, __02).

---

## H06 · Codelinie MS-01 (`/schluessel-nach-code/…ms-01`)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Technische Angaben, Staffeltabelle und Summen stehen konsequent in Mono, die Etiketten in Mono-Großbuchstaben (desktop__02, mobil__04). Die h1 bricht aber auf drei Zeilen mit „— Serie MS-01“ am Zeilenanfang und setzt die Kennung in Sans (desktop__00, mobil__00). |
| Komposition | 7 | 7/5 mit Bestellkarte rechts; mobil steht die Bestellung vor der Erklärung (mobil__01, __03). In desktop__01 konkurrieren zwei Schlüsselzeichnungen in derselben Höhe, und Abschnitt 01 ist nur ein Absatz. |
| Farbe und Bild | 7 | Violett bleibt bei Grafik und gewähltem Umschalter, die Summenfläche ist ruhig (desktop__02). Das gefüllte Primärblau trägt aber die freiwillige Handlung „Foto aufnehmen“, während „In den Warenkorb“ grau ist (desktop__02, mobil__02). |
| Bewegung | 8 | Nach Register zeichnet B-15 die Einschnitte aus dem Code in den Rohling, und dessen Ruhezustand ist sichtbar und erklärt („Profil erscheint nach Eingabe des Codes“, desktop__01). B-16 überblendet die Fundstellen. Beides ist Mechanik, keine Dekoration. Einzelbilder gibt es nicht. |
| Grafik | 8 | Der Profilschnitt im Kopf hat nummerierte Einschnittpositionen 1 bis 6, Fräser, Bemaßung „Halm · 6 Einschnitte“, Legende und die ehrliche Unterschrift „Darstellung zum Beispielcode 0812“; das ist die Leitidee wörtlich (desktop__00). |
| Details | 7 | Die Staffelstufe ist markiert, und der deaktivierte Knopf nennt seinen Grund (desktop__01, __02). Der Widerrufshinweis steht zweimal in einer Bildschirmhöhe, die Umschalter sind `rounded-full`-Pillen, und die Bildunterschrift bricht mit einem einzelnen Wort um. |

**Ansichtswert: 7,3**

**Generisch-Katalog**
- Hart: keine. „0812“ ist als Beispiel gekennzeichnet („keine echte Schließung“) und kein Platzhalter als Fakt.
- Weich: keine Treffer.

**Befunde**
1. Typografie · desktop__00 und mobil__00, h1 · Die dritte Zeile beginnt mit einem Gedankenstrich, und die Kennung „MS-01“ steht in Plex Sans statt in Mono (K-003). · Die h1 auf „Büroschrank und Rollcontainer“ kürzen (zwei Zeilen). Die Kennung als Mono-Zeile über die h1 setzen, entweder in der Augenbraue („MS-01 · DIREKT KAUFEN“) oder als `text-title-sm font-mono`. Der Seitentitel kann dabei bleiben.
2. Typografie · desktop__00, Lead · „Möbel- und Büroschloss: Büroschrank und Rollcontainer“ wiederholt die h1. · Den Lead streichen. Die Plaketten rücken direkt unter die h1, der Abstand bleibt mindestens Faktor 2,2.
3. Typografie · desktop__00 und mobil__00, Plakette „Codeformat: 3 bis 4 Ziffern“ · Der Wert steht in Sans. · „3 bis 4 Ziffern“ in `font-mono tabular-nums` setzen, das Etikett „Codeformat“ bleibt in Sans `foreground-muted`.
4. Komposition · desktop__01 · Die Fundstellen-Grafik (im Kartenrahmen, rund 670 px breit) und der Live-Schlüssel in der Bestellkarte stehen in derselben Bildschirmhöhe, zwei Schlüssel ringen um den Blick. · Die Fundstellen-Grafik auf etwa 5 der 7 linken Spalten verkleinern und ohne Kartenrahmen auf `bg-area-soft/40` stellen. Blickfang dieser Höhe bleibt der Live-Schlüssel.
5. Komposition · desktop__00 und mobil__03, Abschnitt 01 „Was Sie erhalten“ · Der Abschnitt besteht aus einem einzigen Absatz, dessen Kern in „03 Technische Angaben → Lieferumfang“ wiederkehrt. · Abschnitt 01 mit 03 zusammenlegen: den Absatz über die Tabelle setzen und neu nummerieren (01 Codefundstelle, 02 Angaben, 03 Weiter im Bereich).
6. Komposition · mobil__00, Ausschnitt des Profilschnitts · Der Ausschnitt lässt vom Schlüsselkopf nur einen etwa 10 px breiten violetten Streifen am linken Rand stehen. Das wirkt wie ein Fehler. · Den Ausschnitt an der Schulter beginnen lassen (Kopf ganz außerhalb) oder den Kopf ganz zeigen. Die Bemaßung „Halm · 6 Einschnitte“ gehört mit in den Ausschnitt.
7. Farbe und Bild · desktop__02 und mobil__02, Bestellkarte · „Foto aufnehmen“ (freiwillig) ist die einzige gefüllte Primärfläche, solange „In den Warenkorb“ deaktiviert ist. · „Foto aufnehmen“ als Rahmenknopf wie „Aus Galerie wählen“ setzen (`secondary`/Umriss). Gefülltes `primary` gehört nur der Kaufhandlung.
8. Farbe und Bild · desktop__00 und mobil__00, Plakette „Ohne Einsendung des Originalschlüssels“ · Fläche und Text sind Primärblau, das Aktionen vorbehalten ist (K-003). · Neutral setzen (`surface`, `border`, Text `foreground-muted`) wie die beiden Nachbarplaketten, oder als Zeile mit `GlyphHaken`.
9. Details · desktop__02, Kasten „Anfertigung nach Ihrer Codeangabe“ und Fußtext der Bestellkarte · Der Hinweis auf das eingeschränkte Widerrufsrecht steht in derselben Bildschirmhöhe zweimal. · Den Wortlaut unverändert lassen, ihn aber nur einmal an der Kaufhandlung zeigen (Fußtext der Karte). Links bleibt der erste Absatz als Zeile mit `GlyphWaage`. Weil es um einen Rechtshinweis geht, vorher mit dem Menschen abstimmen.
10. Details · desktop__01 und mobil__03, Umschalter „Am Schlüsselkopf · Auf der Sicherungskarte · Auf der Zylinderstirn“ · `rounded-full`-Pillen (K-005: Punkte und Plaketten) brechen mobil in zwei Zeilen um. · Eine Segmentleiste mit `rounded-md` und Haarlinien daraus machen; mobil eine horizontale Leiste mit Anschnitt (`snap-x scroll-px-5`).
11. Details · desktop__00, Bildunterschrift · „DARSTELLUNG ZUM BEISPIELCODE 0812 – KEINE ECHTE SCHLIESSUNG“ lässt „SCHLIESSUNG“ allein in Zeile 2. · `text-balance` setzen oder nach dem Gedankenstrich umbrechen (mobil__00 macht es bereits so).

**Das Stärkste**
- Der Profilschnitt im Kopf: Einschnittpositionen, Fräser, Halm-Bemaßung, Legende Rohling/gefrästes Profil und eine ehrliche Unterschrift (desktop__00). Diese Zeichnung erklärt, was gekauft wird.
- Die Bestellkarte erklärt jeden Zustand: Rohling vor der Eingabe, markierte Staffelstufe, Summe in Mono, deaktivierter Knopf mit Grund (desktop__01, __02).

---

## H08 · Schließanlagen (`/schliessanlagen`)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 7 | Die Abschnitte sind 01 bis 05 nummeriert, HS und ES stehen als Mono-Marken, die Vergleichstabelle ist klar (desktop__01, __03). Die Augenbraue wiederholt aber die h1 wortgleich, und die Antworten im Fragenteil laufen über die volle Breite (desktop__00, __05). |
| Komposition | 7 | Die mitlaufende Abschnittsüberschrift 5/7 und der Seitenwechsel bei „Erweiterbare Anlage“ sind bewusste Brüche (desktop__01, __02). Der stärkste Moment, der Schließplan, liegt aber erst in Abschnitt 01, und mobil stapelt sich der Vergleich über etwa 2,5 Bildschirmhöhen (mobil__04 bis __06). |
| Farbe und Bild | 7 | Magenta bleibt bei Augenbrauen, Plan, Häkchen und Fach-Icons, Aktionen sind `primary`. Abschnitt 01 steht aber auf demselben Ton wie der Fuß, die Seitenmitte liest sich als Ende (desktop__01 bis __03, __07). |
| Bewegung | 8 | Der Plan baut sich in der Rangfolge auf: erst HS und ES, dann die Linien, dann die Türen (Einzelbilder __1 bis __4). Das ist Hierarchie als Bewegung, und B-14 erklärt die Auswahl. |
| Grafik | 7 | Schließplan und GHS-Baum mit gestrichelten „frei“-Reserven sind unverwechselbar (desktop__01, __02). Der Fächer aus drei Schlüsseln im Kopf ist dagegen allgemein, und mobil liegen die Planbeschriftungen bei etwa 9 bis 10 px (mobil__02, __03). |
| Details | 7 | Der Auswahlhinweis mit Magenta-Leiste und die Fragen sind sauber. Die Knöpfe „HS · ES 1 …“ und „Tür 1 …“ sind breite Pillen mit linksbündiger Schrift, und die Türreihe ist ohne Bezug zur Zeichnung eingerückt (desktop__01, tablet__02, mobil__02). |

**Ansichtswert: 7,2**

**Generisch-Katalog**
- Hart: keine. Die leere Rasterfläche im ersten Einzelbild (__0) ist der Beginn eines InView-Auftritts unter 1,6 s und kein Vorlader.
- Weich: Zwei Knöpfe stehen im Kopf („Projekt erfassen“, „Zu den Systemen“), aber linksbündig neben einer Fachgrafik, nicht vor abstraktem Hintergrund; die Leitidee trägt das. Die Abschnitte 02 „Für wen“ und 05 „Weiterlesen“ sind gleich gebaute nummerierte Listen; dazwischen stehen 03 und 04, es ist also keine Dreierfolge.

**Befunde**
1. Typografie · desktop__00 und mobil__00, Augenbraue · „MECHANISCHE SCHLIESSANLAGEN“ steht wortgleich über der h1 „Mechanische Schließanlagen“. · Die Augenbraue „LEISTUNGSBEREICH“ verwenden (vorhandener Wortlaut wie auf H09) und das kleine `BereichIcon schliessanlagen` davor setzen (B-13), so wie es H05 und H09 schon tun.
2. Typografie · desktop__05 und mobil__09, geöffnete Antwort im Fragenteil · Die Antwortzeile läuft über rund 1.120 px (etwa 140 Zeichen). · Den Antworttext auf `max-w-measure` begrenzen und `hyphens: auto` setzen.
3. Typografie · desktop__03, Vergleichstabelle · Die Kürzel (Z), (HS), (GHS) stehen in Sans, und in der Spalte „Erweiterbar“ liegt das Urteil „Ja“ oder „Begrenzt“ im Fließtext versteckt. · Die Kürzel in `font-mono` setzen. „Ja“ oder „Begrenzt“ als erstes Wort in `foreground` und `font-medium`, den Rest in `foreground-muted`.
4. Komposition · desktop__00 und desktop__01 · Der große Moment der Seite, der Schließplan mit Aufbau HS → ES → Türen, kommt erst in der zweiten Bildschirmhöhe; der Kopf zeigt einen allgemeinen Schlüsselfächer. · Den Schließplan-Generator (Stufe HS, ohne Auswahlknöpfe) über `PageHeader visual` in den Kopf setzen. Den Schlüsselfächer nach Abschnitt 03 „Wenige Türen, ein Schlüssel für alles?“ verschieben, wo er die Gleichschließung zeigt.
5. Komposition · mobil__04 bis __06, Vergleich · Fünf Systeme mal drei Felder stapeln sich über etwa 2,5 Bildschirmhöhen grauen Text. · Nach dem Muster „Leiste statt Stapel“ umbauen: je System eine Karte `shrink-0 basis-3/4 snap-start`, `-mx-5 px-5 scroll-px-5`, ab `md` wieder als Tabelle.
6. Komposition · mobil__02 und desktop__01, Systemumschalter · Die vier Umschalter brechen mobil in drei, am Desktop in zwei Zeilen um. · Mobil eine horizontale Leiste mit Anschnitt (`snap-x scroll-px-5`) daraus machen; am Desktop eine einzeilige Segmentleiste über `col-span-7` in `text-small`.
7. Farbe und Bild · desktop__01 bis __03 im Vergleich zu desktop__07 · Abschnitt 01 steht auf `surface-sunken`, dem Ton des Fußes. · Abschnitt 01 auf `surface-muted` setzen; `surface-sunken` bleibt dem Fuß vorbehalten (K-006 „Fuß“).
8. Farbe und Bild · desktop__01, __02 · Plan und GHS-Baum stehen in weißen Kartenrahmen (`border`, `rounded-lg`) auf der dunklen Fläche, der Rahmen trennt die Zeichnung vom Papier. · Den Rahmen streichen und die Zeichnung direkt auf `bg-area-soft/40` stellen, mit Raster wie im Kopf.
9. Grafik · mobil__02, __03, Beschriftungen im Plan und im GHS-Baum · „HS“, „ES“, „GHS“, „HGS“, „GS“ und „frei“ liegen bei etwa 9 bis 10 px, unter dem Ziel von 11,5 px (K-008). · Für den Plan das schmale Format (`format: 'schmal'`, `SCHMALES_FORMAT`) mit zwei ES je Reihe nehmen. Für den GHS-Baum einen Ausschnitt (`.sm24-ausschnitt`) mit einer HGS-Hälfte samt „frei“-Reserve.
10. Grafik · desktop__01 und tablet__02, Türsymbole im Plan · Die Türen sind unbeschriftet; ihre Namen „Tür 1“ bis „Tür 4“ stehen nur auf den Knöpfen darunter. · Unter jede Tür die Nummer in `text-caption` Mono setzen, damit Plan und Knopfleiste zusammenfinden.
11. Details · desktop__01, tablet__02, mobil__02, Knöpfe „HS · ES 1 … ES 4“ und „Tür 1 … Tür 4“ · Die breiten Pillen mit linksbündiger Beschriftung sehen wie leere Eingabefelder aus. Die Türreihe ist um eine Spalte eingerückt, steht aber nicht unter den ES-Knoten der Zeichnung (ES 1 bei etwa 238 px, Knoten bei 207 px auf tablet__02). · Die Knöpfe inhaltsbreit setzen, die Schrift zentrieren, `rounded-md` und `min-h-touch`. Die Türreihe linksbündig ausrichten oder jeden Knopf genau unter seinen Knoten setzen.
12. Details · desktop__04 und mobil__07, „Für wen“ · Die Linkwörter wechseln von Zeile zu Zeile („Projekt erfassen“, „Objekt erfassen“, „Bedarf erfassen“, „Liegenschaft erfassen“), obwohl das Ziel dasselbe zu sein scheint. · Bei gleichem Ziel einheitlich „Projekt erfassen“ schreiben (K-010), oder die ganze Zeile zum Link machen und rechts `GlyphPfeilRechts` mit B-06 setzen (K-006 „Keine Linkwörter“).
13. Details · desktop__00 und mobil__01, Zeile „PROJEKTKONFIGURATOR / Sie erfassen Ihr Projekt …“ · Zwischen zwei Haarlinien wirkt die Zeile wie eine Linkzeile, sie hat aber keinen Pfeil. · Entweder die ganze Zeile als Link zum Konfigurator mit Pfeil (B-06), oder die Haarlinien streichen und sie als Etikett stehen lassen.

**Das Stärkste**
- Der Schließplan: Er baut sich in Rangfolge auf, ist per Schlüssel und Tür auswählbar und hat einen GHS-Baum mit gestrichelten „frei“-Reserven, der Erweiterbarkeit als Zeichnung erklärt (desktop__01, __02, Einzelbilder).
- Die Ordnung ist sauber durchgezogen: Augenbrauen 01 bis 05, mitlaufende Überschrift links, Seitenwechsel bei der erweiterbaren Anlage, Leiste „Gleichschließung“ als Ausweg mit Hinweis (desktop__01, __02, __05).

---

## H09 · Türtechnik (`/tuer-und-schliesstechnik`)

| Kategorie | Wert | Begründung |
|---|---|---|
| Typografie | 6 | h1 und die Mono-Beschriftungen in der Kopfgrafik sind präzise (desktop__00). Darunter folgen lange Prosa, Floskel-Leads und Antworten über die volle Breite; zwei 290 px schmale Textspalten flattern stark (desktop__02, __04, __05). |
| Komposition | 6 | Der Kopf in 7/5 trägt. Mobil liegen aber etwa 2,5 Bildschirmhöhen Fließtext vor der Orientierungshilfe (mobil__01 bis __03). Abschnitt 05 besteht aus vier gleichförmigen Karten mit leerem Fuß (desktop__05, __06). |
| Farbe und Bild | 7 | Das Grün bleibt bei Augenbrauen, Fach-Icons und Kopfgrafik. Die dunkle `surface-ink`-Fläche ist der einzige dunkle Block der Gruppe, und das hellgrüne Icon darin wirkt aufgeklebt (desktop__03, mobil__07). |
| Bewegung | 8 | B-18 gestaffelt: Die Marken 1 bis 5 erscheinen nacheinander, die Hinweislinien ziehen zu den schon sichtbaren Beschriftungen (Einzelbilder __1 bis __4). Die Bewegung erklärt die Schutzpunkte, und kein Inhalt wird zurückgehalten. |
| Grafik | 7 | Die Tür-Schutz-Zeichnung mit nummerierten Marken und Mono-Legende ist stark (desktop__00). Die Hinweislinie 5 macht aber einen langen Umweg unter der Bodenlinie, und unterhalb des Kopfes hat die Seite keine Fachgrafik mehr. |
| Details | 7 | Häkchen-Glyphen, Fach-Icons und die Fragen sind stimmig. Die Auswahl besteht aus neun einzeln gerahmten Optionskarten (mobil__03), und die Karten in Abschnitt 05 haben den Pfeil allein unter Leerraum (desktop__05). |

**Ansichtswert: 6,8**

**Generisch-Katalog**
- Hart: keine festgestellt. Zu prüfen: „Wir sind zertifiziert für die Bearbeitung und Instandhaltung von Flucht- und Rettungswegtechnik nach DIN EN 179 und DIN EN 1125“ (mobil__06) ist eine Behauptung ohne sichtbaren Beleg. Ob sie im Bestand belegt ist, kann ich am Bild nicht erkennen; beim Menschen klären, sonst ist es ein harter Treffer „erfundene Inhalte“.
- Weich:
  - Floskeln: „Präzise Handwerkskunst trifft auf modernste Sicherheitstechnik“ (desktop__02), „Wir legen Wert auf transparente Aufklärung … die komplexesten Fragen“ (desktop__04), „höchste fachliche Expertise“ (desktop__03), „Die flexible Alternative zur klassischen Mechanik“ (desktop__05). Die Leitidee trägt sie nicht (K-003 „Lassen“).
  - Gleichförmige Karten in Abschnitt 05: nicht getragen.
  - Dunkle Fläche: als bewusster Bruch vertretbar, in dieser Ausführung aber nicht aus der Leitidee abgeleitet.

**Befunde**
1. Typografie · desktop__04 und mobil__08, geöffnete Antwort · Die Antwortzeile läuft über rund 1.120 px (etwa 150 Zeichen). · Den Antworttext auf `max-w-measure` begrenzen und `hyphens: auto` setzen.
2. Typografie · desktop__02, __04, __03 und mobil__05, __07, Leads · Die Leads enden auf Floskeln (siehe Katalog). · Jeweils den Floskel-Satz streichen, so dass jeder Lead einen Satz hat; als Vorschlag in `TEXTVORSCHLAEGE.md` eintragen.
3. Typografie · desktop__02 und mobil__04, Doppelspalte „Elektronik trifft Mechanik | Ablauf in diesem Bereich“ · Zwei Spalten von 290 px mit Fließtext in `text-body` ergeben etwa 30 Zeichen je Zeile und einen starken Flatterrand. · Die beiden Blöcke untereinander in einer Spalte bis `max-w-measure` setzen. „Geführte Anfrage“ wird eine Zeile mit `GlyphPfeilRechts`, die auf die Formularkarte verweist.
4. Komposition · mobil__01 bis __03 · Vor der Orientierungshilfe, der Handlung, liegen etwa 2,5 Bildschirmhöhen Prosa. · Mobil die Reihenfolge Kopf → Formularkarte → Text setzen (K-006 „Handlung vor Erklärung“). Den Fließtext auf den Lead und die drei Häkchen-Punkte kürzen; den Rest in ein Akkordeon „Mechanische Kernkomponenten im Verbund“ (B-09) legen, das eine vorhandene Zwischenüberschrift ist.
5. Komposition · desktop__05, __06, Abschnitt 05 „Gewerkeübergreifende Lösungen“ · Vier gleich gebaute weiße Karten haben rund 60 px Leerraum über dem Pfeil und sind der einzige Kartenblock der Gruppe. · Am Desktop wie H08 05 als nummerierte Zeilenliste mit `BereichIcon` je Bereich und dem Pfeil rechts auf Titelhöhe setzen; mobil bleibt die Leiste mit Anschnitt (mobil__09).
6. Komposition · desktop__03, __04 und mobil__06, __07, dunkle Fläche „Regulatorik“ · Rund 900 px Fließtext ohne Blickfang; das Fluchttür-Icon steht allein in der rechten unteren Ecke beziehungsweise am Ende. · Das Icon in Augenbrauen-Größe neben „03 NORMEN UND BRANDSCHUTZ“ setzen (wie B-13 im Kopf) und den Text auf `max-w-measure` begrenzen. Alternativ eine 8/4-Teilung mit dem `tuer-schutz`-Generator rechts.
7. Farbe und Bild · desktop__03, __04 · Die `surface-ink`-Fläche bricht als einzige dunkle Großfläche aus „hellem Papier“ aus, das hellgrüne Flächen-Icon darauf wirkt fremd. · Den Inhalt als Warnung nach K-006 setzen: Fläche `surface`, 2-px-Leiste links in `warning`, höchstens 8 Spalten. Will man die dunkle Fläche behalten, das Icon nur als Linie in `stroke-foreground-inverse` zeichnen, ohne Füllung.
8. Farbe und Bild · desktop__00 und mobil__02, Titel der Formularkarte · Die Dokument-Glyphe steht in Primärblau, ohne eine Aktion zu sein. · Die Glyphe in `foreground-muted` setzen, oder das Fach-Icon `sicherheitscheck` in `area` verwenden.
9. Grafik · Einzelbild H09 __4 und desktop__00, Hinweislinie 5 „Bandseite“ · Die Linie läuft vom linken Band unter der Bodenlinie quer durch die ganze Zeichnung zur Legende, rund 250 px Umweg mit zwei Knicken. · Die Beschriftung „5 Bandseite“ links neben die Tür setzen (Legende für die Bandseite links) oder die Marke ans obere Band verlegen. Die Hinweislinie hat dann höchstens einen Knick und kreuzt den Boden nicht.
10. Grafik · desktop__01, Absatz „Mechanische Kernkomponenten im Verbund“ · Die fett gesetzten Bauteile Profilzylinder, Schutzbeschlag und Schließblech haben keinen Bezug zur Kopfzeichnung, die dieselben Teile nummeriert. · Hinter jedes fett gesetzte Bauteil die Markennummer aus dem Kopf als kleine Mono-Marke im Kreis in `area` setzen (3, 2, 4). Das Einsteckschloss bleibt ohne Marke. So verbindet sich der Text mit der Zeichnung, ohne neuen Inhalt.
11. Details · mobil__03 und desktop__01, Optionen der Orientierungshilfe · Neun einzeln gerahmte Optionskarten mit 16 px Abstand ergeben einen langen Kartenstapel. · Die Optionen je Frage in einer gemeinsamen Hülle mit `divide-y` und Haarlinien setzen, Auswahlzustand über die Rahmenfarbe der Zeile und `focus-within`. Das spart etwa 40 % Höhe.
12. Details · desktop__05, Karten in Abschnitt 05 · Der Pfeil steht allein in der rechten unteren Ecke unter Leerraum. · Mit Befund 5 den Pfeil auf Titelhöhe rechts setzen; die Karte oder Zeile endet nach dem Text.

**Das Stärkste**
- Die Tür-Schutz-Zeichnung im Kopf: fünf nummerierte Schutzpunkte, Mono-Legende, gestaffelter Auftritt nach B-18. Sie erklärt die Tür als System, bevor man liest (desktop__00, Einzelbilder).
- Mobil ist die Leistungsliste auf Icon, Titel und Pfeil verdichtet, und die Systemerweiterungen sind eine Leiste mit Anschnitt (mobil__05, __09).

---

## Gruppe erzaehl-2 · Zusammenfassung

| Ansicht | Typo | Komp. | Farbe/Bild | Bewegung | Grafik | Details | Ansichtswert |
|---|---|---|---|---|---|---|---|
| H05 Code-Shop | 7 | 6 | 7 | 7 | 6 | 7 | 6,7 |
| H06 Codelinie MS-01 | 7 | 7 | 7 | 8 | 8 | 7 | 7,3 |
| H08 Schließanlagen | 7 | 7 | 7 | 8 | 7 | 7 | 7,2 |
| H09 Türtechnik | 6 | 6 | 7 | 8 | 7 | 7 | 6,8 |

**Mittel der Ansichtswerte: 7,0**

**Die drei wirksamsten Änderungen über die Gruppe**
1. **H05: Liste verdichten und gliedern.** Den Preis einzeilig setzen und den Staffelhinweis einmal je Gruppe, die Kürzung auf vier Zeilen auch am Desktop übernehmen, dazu eine Sprungleiste der Gruppenkürzel. Die Liste schrumpft so von sechs auf unter drei Bildschirmhöhen und bekommt eine Werkstatt-Ordnung statt einer Endlosliste.
2. **H08: den großen Moment in den Kopf holen.** Den Schließplan-Generator in `PageHeader visual` setzen und den Schlüsselfächer nach 03 verschieben. Mobil den Vergleich als Leiste mit Anschnitt und die Planbeschriftungen ab 11,5 px.
3. **H09: Handlung vor Erklärung und Ruhe im Text.** Mobil die Formularkarte vor die Prosa setzen, die Floskel-Sätze streichen, Antworten und Doppelspalte auf `max-w-measure` begrenzen und Abschnitt 05 als nummerierte Bereichsliste mit `BereichIcon` setzen.

---

## Abgleich mit E4-L-23

Den Bericht `_werkstatt/berichte/E4-L-23-sichtabnahme-erzaehl-2.md` habe ich erst gelesen, nachdem das Urteil oben feststand. Das Urteil bleibt unverändert. Mittel damals 5,9, heute 7,0.

### H05 · damals 5,2 · heute 6,7
- **Behoben:**
  - Harter Treffer „Platzhalter“: Die 52 leeren Kartenbildflächen sind weg, die Liste hat keine Bildflächen mehr.
  - Kachelwüste: Die Codelinien sind nach Familien gruppiert, mit Mono-Augenbraue je Gruppe und dichten Zeilen; mobil vier Zeilen plus „Alle n anzeigen“.
  - Kopf 7/5 mit Fundstellen-Grafik: B-22 läuft in der ersten Bildschirmhöhe.
  - Mobil: Zähler und „Filter anzeigen“ stehen in einer Zeile, der deaktivierte Rücksetzer ist verschwunden.
  - Der Schlüsselumriss steht ab dem ersten Einzelbild, die untere Verbindungslinie kreuzt den Halm nicht mehr.
  - „01 52 CODELINIEN“ heißt jetzt „01 CODELINIEN“. Die Befunde zu Kartentiteln, Untertiteln und springenden Trennlinien sind mit dem Listenaufbau gegenstandslos.
- **Bleibt oder teilweise:**
  - Die Verbindungslinien zeichnen sich noch nicht (`draw`), sie erscheinen fertig (heute Befund 8).
  - Statt Produktgrafik je Karte wurde die Variante „Bildfläche entfernen“ gewählt. Das ist zulässig, die Liste hat jetzt aber gar kein Bild mehr; die Länge der Liste ist heute der Hauptbefund (Befunde 4 bis 6).

### H06 · damals 5,8 · heute 7,3
- **Behoben:**
  - Harter Treffer „Platzhalter“: „So sollte das Foto aussehen“ zeigt jetzt eine Schlüsselzeichnung mit Maßstab.
  - Mobil steht die Bestellung vor der Erklärung.
  - Der leere Produktkasten ist weg; der Kopf trägt den Profilschnitt in 7/5.
  - Die doppelte Preiszeile unter „Passende Seiten“ ist weg.
  - Der Live-Schlüssel zeigt vor der Eingabe den Rohling, und B-15 zeichnet laut Register beim ersten Code die Einschnitte.
  - Die Fundstellen-Leitlinie kreuzt den Halm nicht mehr.
  - Links im Satz reißen keine Zeilen mehr auf.
  - Die Kategorie ist korrekt geschrieben („… für die Codelinie MS-01“), „Max. 12 MB je Datei“ hat keinen englischen Dezimalpunkt mehr.
  - Der deaktivierte Warenkorbknopf ist grau, mit Grund und `GlyphInfo` darüber.
- **Bleibt oder teilweise:**
  - Doppelte Schlüssel: Der Produktkasten ist zwar weg, aber in desktop__01 konkurrieren jetzt Fundstellen-Grafik und Live-Schlüssel (heute Befund 4).
  - Die fehlenden Labels der Datei-Eingaben aus dem a11y-Protokoll kann ich am Bild nicht prüfen.

### H08 · damals 6,8 · heute 7,2
- **Behoben:**
  - Die dreifache Erzählung der Systeme ist aufgelöst: Reiterinhalt unter dem interaktiven Plan, die Tabelle bleibt.
  - Der Kopf hat in 7/5 eine Grafik (Schlüsselfächer).
  - Die Augenbrauen sind 01 bis 05 durchnummeriert, „Passend dazu“ steht in `text-headline`.
  - Die Wählknöpfe sind einheitlich in Mono, mit Etiketten „SCHLÜSSEL WÄHLEN“ und „TÜR WÄHLEN“.
  - Der Bereichston ist deutlich nach Magenta gerückt und von Code-Violett unterscheidbar.
  - „Erweiterbare Anlage“ zeichnet gestrichelte „frei“-Reserven.
  - „Für wen“ hat eigene Icons je Zeile.
  - „Passend dazu“ ist eine nummerierte Linkliste ohne „Ansehen“.
- **Bleibt oder teilweise:**
  - Die mobilen Planbeschriftungen liegen weiter unter 11,5 px (heute Befund 9).
  - Die Knopfreihen brechen nicht mehr um, die Türreihe steht aber noch nicht unter ihren Knoten, und die Pillen wirken wie Eingabefelder (heute Befund 11).
  - Neu sichtbar: Der Kopf hat jetzt eine Grafik, aber den schwächeren Moment; der Plan gehört in den Kopf (heute Befund 4).
  - Der mobile Vergleich stapelt sich (heute Befund 5). Er ersetzt den früheren Stapel der Systemkarten.

### H09 · damals 5,8 · heute 6,8
- **Behoben:**
  - Kopf 7/5 mit `tuer-schutz`; das lose Tür-Icon ist weg, und B-18 läuft mobil in der ersten Bildschirmhöhe.
  - Das Formular und die linke Spalte enden ohne große Leerfläche.
  - Das Leistungsraster ist eine zweispaltige Haarlinienliste ohne Waise; mobil kompakt mit Icon, Titel und Pfeil.
  - Die Augenbrauen sind 01 bis 05 durchnummeriert, auch die im dunklen Feld.
  - Das dunkle Feld hat einen kleinen Radius.
  - Die Haken-Glyphen stehen im Bereichsgrün.
  - Die Marken 3 und 4 überdecken sich nicht mehr.
  - „LEISTUNGSDETAILS“ und „… erkunden“ sind weg, „Verwandte Fachthemen“ ist gestrichen.
  - Die Fragenliste hat volle `shell`-Breite, und „z. B.“ ist korrekt gesetzt.
- **Bleibt oder teilweise:**
  - Floskeln: Alle drei damals genannten Sätze stehen weiter im Bild (heute Befund 2).
  - Der Zertifizierungsverdacht (DIN EN 179/1125) ist weiter beim Menschen zu klären.
  - Das Panik-Icon im dunklen Feld ist umgesetzt, wirkt aber aufgeklebt (heute Befunde 6 und 7).
  - Leitlinie 5 führt jetzt wie vorgeschlagen außen um die Tür; das erzeugt einen langen Umweg (heute Befund 9).
  - Die volle Breite der Fragenliste lässt die Antworttexte über das Zeilenmaß laufen (heute Befund 1: Hülle breit, Text `max-w-measure`).

=== ENDE E5-L-29 · BEREIT ZUR RÜCKGABE ===
