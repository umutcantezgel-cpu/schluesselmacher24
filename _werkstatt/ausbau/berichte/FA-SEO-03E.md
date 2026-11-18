# Bericht FA-SEO-03E · Mobile Leistung, Teil E: Warenkorb und Artikelliste ohne das Register aller Zeichnungen

Stand 18.11.2026. Baumeister und Prüfer in einem Lauf.

Kurz: Warenkorb und Artikelliste binden `ImagePlaceholder` und damit das Register aller Generatoren nicht mehr ein. Der Block mit den Zeichnungen (`3m6nmb1r3299f.js`, 44,6 KB roh, 14,8 KB übertragen) fällt dadurch aus dem späten Vorabruf des Warenkorbs weg. Gemessen ist das auf allen sieben Ansichten der Tabelle; für die übrigen Seiten mit demselben Kopf ist es erwartet, nicht gemessen.
- Startseite und Shop laden bis Netzruhe plus 5 s 17,0 KB weniger übertragen und 57,2 KB weniger roh, dazu eine Datei weniger.
- Alle 18 Bilder (9 Ansichten × 412 und 1280 px) sind pixelgleich, ebenso Text, SVG-Zahl und Elementzahl.
- Es gibt kein `import()`, kein `next/dynamic` und kein Vorladen. Der Vorabruf im Kopf (`KOPF_ZIELE`) bleibt unverändert.

## GEÄNDERTE DATEIEN

Neu:
- `src/app/(site)/warenkorb/code-profil-bild.tsx`: `CodeProfilBild({ code })`, das Schlüsselprofil einer Code-Position. Der Baustein bindet nur `SchluesselGrafik` ein, mit demselben Markup und denselben Klassen wie bisher `ImagePlaceholder … frei`.
- `src/app/(site)/warenkorb/code-profil-bild.test.tsx` (6 Tests)

Geändert:
- `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`
  - Zeile 28: Import `KompaktBild` aus `@/components/ui/bild-flaeche` statt `ImagePlaceholder`. Zeile 38: Import `CodeProfilBild`.
  - Zeile 243 (vorher 241–248): `<CodeProfilBild code={position.item.code} />`
  - Zeilen 386–390 (vorher 391–397): Zylindersatz `<KompaktBild slot={…} />` statt `<ImagePlaceholder slot={…} compact />`. Das Motiv ist unverändert.
  - Zeile 654 (vorher 660): `<KompaktBild slot={article.image} />` statt `<ImagePlaceholder slot={article.image} compact />`
- `src/app/(site)/artikel/artikel-liste.tsx`
  - Zeile 14: Import `KompaktBild`
  - Zeile 219: `<KompaktBild slot={article.image} frei className="w-10 shrink-0" sizes="40px" />` statt `ImagePlaceholder … compact frei …`
- Protokolle unter `_werkstatt/ausbau/protokolle/FA-SEO-03E/`

Unberührt: `image-placeholder.tsx`, `bild-flaeche.tsx`, `visual/registry.tsx`, `visual/generators/**`, `layout/**`, `forms/**`, CSS, Texte, Preise.

## WAS UND WARUM

### Was der Vorabruf heute lädt und warum

- `site-header.tsx` lädt `KOPF_ZIELE = ['/', '/warenkorb', '/autoschluessel/anfrage']` nach dem großen Moment vor (`useSpaetVorladen`). Der sichtbare Warenkorb-Link selbst steht auf `prefetch={false}`.
- Laut `page_client-reference-manifest.js` des Messstands gehört `3m6nmb1r3299f.js` nur zu `/warenkorb` und zu `/schluessel-nach-code/[slug]`. Er enthält alle Generatoren außer `schluessel`, darunter `zylinder-mass`, `schliessplan` und `stiftzuhaltung`.
- Er kam über `ImagePlaceholder` → `registry.tsx` in den Warenkorb. Der Import-Graph (Werkzeug im Notizordner, nachgeprüft) zeigt `ImagePlaceholder` als einzigen Weg aus `warenkorb-ansicht.tsx` und `artikel-liste.tsx` zum Register.
- Messung vorher: Jede gemessene Seite lädt `3m6nmb1r3299f.js` und `25dee87xdmrqo.js` (`schluessel`, 36,2 KB roh). `/artikel` lädt zusätzlich `1newh81cop30d.js` (44,4 KB roh, 14,7 KB übertragen, das Register über die Artikelliste).

### Welche Bilder die beiden Bausteine zeichnen können

| Stelle | Bild | kann eine Zeichnung brauchen? | neu |
|---|---|---|---|
| `warenkorb-ansicht.tsx:241` Code-Position | fester Generator `schluessel` im Code (`typ: 'zylinder'`, Code des Kunden), kein Foto, keine schmale Fassung | nur `schluessel` | `CodeProfilBild` |
| `warenkorb-ansicht.tsx:391` Zylindersatz | festes Motiv, `compact` | nie (compact zeichnet keine Zeichnung) | `KompaktBild` |
| `warenkorb-ansicht.tsx:660` Standardartikel | `article.image` aus gepflegten Inhalten, `compact` | nie: `ImagePlaceholder compact` setzt `ref = null`, also nur Foto oder Fach-Icon, auch wenn das Bild ein `visual` trägt | `KompaktBild` |
| `artikel-liste.tsx:219` Artikelzeile | `article.image`, `compact frei` | nie, wie oben | `KompaktBild` |
| Leerzustand (`warenkorb-ansicht.tsx:191`) | `SchluesselGrafik` war schon direkt eingebunden | nur `schluessel` | unverändert |

Für keine Stelle bleibt `ImagePlaceholder` nötig. `KompaktBild` ist der vorhandene Baustein aus `bild-flaeche.tsx`, den auch der Konfigurator nutzt. Seine Logik ist Zeile für Zeile die Kompaktfassung von `ImagePlaceholder`: ein Foto mit `className` und `sizes`, sonst `FachIconFlaeche compact frei`.

### Belege (`code-profil-bild.test.tsx`)

1. **Markup `CodeProfilBild`:** Das Markup ist zeichengleich mit `ImagePlaceholder slot={{ motif: 'Schlüsselprofil zum Code', ratio: '1/1', visual: { generator: 'schluessel', … } }} frei`. Geprüft sind 8 Codes, darunter leer, sehr lang, Umlaute und HTML-Zeichen.
2. **Markup `KompaktBild`:** Das Markup ist zeichengleich mit `ImagePlaceholder compact`, in beiden Aufrufformen: Warenkorb ohne Zusätze und Artikelliste mit `frei`, `className` und `sizes`.
   - Geprüft für alle Beispielartikel aus `standardArticles()` sowie Motive mit passender Zeichnung (Zylinder messen, Schließplan), ein Bild mit ausdrücklichem `visual: schliessplan`, Fotos mit und ohne Alternativtext und das Motiv des Zylindersatzes.
3. Die kompakte Fläche zeichnet nie eine Zeichnung (kein `<svg role="img"`).
4. `SchluesselGrafik` ist dasselbe Objekt wie `getVisual('schluessel')`. Es gibt keine schmale Fassung.
5. Die drei Dateien importieren zur Laufzeit weder `image-placeholder` noch das Register. Sie enthalten außerhalb von Kommentaren weder `ImagePlaceholder` noch `renderVisual`.
6. **Auswahl der Zeichnungen:** Jeder Generator-Import und jedes `generator: '…'` in den drei Dateien muss in der Auswahl `{ schluessel }` liegen, und kein `visual:` darf vorkommen. Braucht eine Stelle eine andere Zeichnung oder eine aus Inhalten, scheitert der Test mit einem Hinweis auf `ImagePlaceholder`, statt still ein Icon zu zeigen.
   - Gegenprobe: Ich habe in `artikel-liste.tsx` vorübergehend die Importe `zylinder-mass` und `image-placeholder` eingefügt. Die Tests 5 und 6 schlugen an. Danach habe ich die Datei aus der Sicherung zurückgespielt.

### Bytes je Stelle

Die drei Stellen im Warenkorb lassen sich nicht einzeln messen. Das Register fällt erst weg, wenn keine von ihnen mehr `ImagePlaceholder` importiert. Sie sind deshalb eine Einheit.
- **Warenkorb (Zeilen 241, 391, 660):** `3m6nmb1r3299f.js` (44,6 KB roh, 14,8 KB übertragen) entfällt auf allen sieben gemessenen Ansichten; auf den übrigen Seiten ist das erwartet, nicht gemessen.
  - Im Browser gesamt auf Start, Shop und Warenkorb: −17,0 KB übertragen, −57,2 KB roh.
  - Der Rest der Differenz zu 44,6 KB roh kommt daher, dass `schluessel` nun in einem kleineren eigenen Block liegt: `319lz1uogmj62.js` mit 28,0 KB statt `25dee87xdmrqo.js` mit 36,2 KB.
- **Artikelliste (Zeile 219):** Auf `/artikel` entfällt zusätzlich `1newh81cop30d.js` (44,4 KB roh, 14,7 KB übertragen). Dafür lädt `/artikel` nachher zwei `schluessel`-Blöcke: `319lz1uogmj62.js` (Warenkorb) und neu `23v-9dj-h1q6m.js` (26,5 KB roh, 9,8 KB übertragen), vorher nur `25dee87xdmrqo.js`. Das ist dieselbe Verdopplung wie auf Kontakt und Assistent (OFFENE FRAGE 1). Im Browser gesamt auf `/artikel` netto: −17,2 KB übertragen, −62,0 KB roh.
- **Im HTML** der neun Ansichten (Skripte der Seite selbst, ohne Vorabruf):
  - Unverändert: start, autoschluessel, code, konfigurator, shop, ort, ratgeber.
  - Assistent: +0,9 KB gz. Kontakt: +1,4 KB gz und ein Skript mehr (17 → 18).
  - Grund: Vorher teilten sich Upload-Feld und Warenkorb einen Block mit `schluessel`. Jetzt baut der Bundler für die Seite einen eigenen Block mit `schluessel` (`23v-9dj-h1q6m.js` und `26ss49o33nn5j.js`). Im Browser insgesamt sinkt die Menge trotzdem: Kontakt −3,7 KB übertragen und −21,8 KB roh, Assistent −5,2 und −21,8. Siehe OFFENE FRAGE 1.

### Tabelle der gemessenen Seiten (Browser bis Netzruhe plus 5 s, 412 px mobil, Bytes aus dem Protokoll von Chromium)

| Seite | vorher (Dateien, KB übertragen, KB roh) | nachher | Differenz übertragen / roh |
|---|---|---|---|
| Startseite `/` | 21, 263,5, 788,2 | 20, 246,5, 731,0 | **−17,0 / −57,2** |
| Shop `/shop` | 21, 263,5, 788,2 | 20, 246,5, 731,0 | **−17,0 / −57,2** |
| Kontakt | 23, 288,9, 860,4 | 24, 285,2, 838,6 | **−3,7 / −21,8** |
| Assistent `/autoschluessel/anfrage` | 25, 312,0, 933,7 | 25, 306,8, 911,9 | **−5,2 / −21,8** |
| Warenkorb leer | 24, 299,6, 894,6 | 23, 282,6, 837,5 | **−17,0 / −57,1** |
| Warenkorb mit einer Position (Zylindersatz) | 26, 321,5, 956,0 | 25, 304,5, 898,8 | **−17,0 / −57,2** |
| Artikelliste `/artikel` | 25, 310,3, 921,0 | 25, 293,1, 859,0 | **−17,2 / −62,0** |

Die Startwerte stimmen mit der Messung des Orchestrators vom 18.11. überein: Startseite 21 und 263,5, Kontakt 23 und 288,9, Assistent 25 und 312,0.

Skripte im HTML der neun Ansichten (`gewicht.mjs`, KB gz):

| Ansicht | vorher | nachher |
|---|---|---|
| start | 14, 218,2 | 14, 218,2 |
| autoschluessel | 15, 220,7 | 15, 220,7 |
| assistent | 17, 264,3 | 17, 265,2 (+0,9) |
| code | 16, 233,0 | 16, 233,0 |
| konfigurator | 17, 253,3 | 17, 253,3 |
| shop | 15, 220,7 | 15, 220,7 |
| ort | 14, 211,3 | 14, 211,3 |
| ratgeber | 14, 216,5 | 14, 216,5 |
| kontakt | 17, 253,5 | 18, 254,9 (+1,4) |

### Bildvergleich

**18 von 18 pixelgleich**, jedes Pixel exakt, ohne Schwelle (`bilder/bildvergleich-nachher.json`). Auch Textlänge, Zahl der SVG und Zahl der Elemente in `main` sind gleich.

Seiten, je bei 412 und 1280 px als ganze Seite:
- Warenkorb leer
- Warenkorb mit Code-Position
- Warenkorb mit Standardartikel
- Warenkorb mit Zylindersatz (das Fach-Icon ist bei 1280 px sichtbar)
- `/artikel`, Shop, Startseite, Kontakt, `/schluessel-nach-code`

Was die Proben nicht zeigen konnten:
- Im JSON-Modus sind Codelinien und Artikel nur Beispiele und nicht bestellbar. Die Code- und Artikelposition zeigen deshalb „nicht mehr im Angebot“, ohne Profilbild und Artikelbild. Die Artikelliste zeigt keine Artikelzeilen.
- Eine Artikelkategorie-Seite gibt es im JSON-Modus nicht: Die einzige Kategorie mit der Art „artikel“ ist `/artikel` selbst, `/artikel/kategorie/*` antwortet mit 404.
- Diese Bilder sind deshalb durch die Markup-Tests 1 und 2 belegt, nicht durch Bildschirmfotos.

Die Positionen lagen nur als erfundener Inhalt in `localStorage` (G5). Nichts wurde bestellt.

### Entscheidung je Stelle

| Stelle | Entscheidung | Grund |
|---|---|---|
| `warenkorb-ansicht.tsx:241`, `:391`, `:660` | **übernommen** | Senkt die Gesamtmenge auf Startseite, Shop und Warenkorb um 17,0 KB übertragen, auf Kontakt und Assistent um 3,7 bis 5,2 KB (gemessen); für die übrigen Seiten erwartet, nicht gemessen. Markup gleich, Bilder pixelgleich. |
| `artikel-liste.tsx:219` | **übernommen** | `/artikel` lädt zusätzlich einen Registerblock weniger: −17,2 KB übertragen, −62,0 roh. Markup gleich. |
| Schritt 4: weitere Stellen auf jeder Seite | **nichts weiter geändert** | Nach dem Eingriff lädt keine gemessene Seite mehr einen Block mit `zylinder-mass` oder `schliessplan`, außer `/warenkorb` selbst (`2qflrushwuwrz.js`, Preis- und Zylinderregeln des Warenkorbs, gebraucht). Der verbleibende Block `319lz1uogmj62.js` (`schluessel`, 28,0 KB roh, 10,2 KB übertragen) wird im Warenkorb gebraucht: Leerzustand und Code-Position. Er ließe sich nur durch Nachladen von der Startseite fernhalten, und das ist nach A-076 verboten. Kopf und Fuß binden kein `ImagePlaceholder` ein (Import-Graph). |
| Doppelter `schluessel`-Block auf Kontakt, Assistent und `/artikel` | **OFFENE FRAGE 1** | außerhalb der Schreibrechte (`forms/**`) |

## GEMEINSAME DATEIEN

- `src/components/ui/bild-flaeche.tsx` (`KompaktBild`) wird nur genutzt, nicht geändert.
- `image-placeholder.tsx` und `registry.tsx` sind unverändert. Alle anderen Nutzer laufen deshalb über denselben Code wie vorher.
- `warenkorb-ansicht.tsx` und `artikel-liste.tsx` haben nur Bild-Aufrufe und Importe geändert. Preise, Mengen, Summen, Versand, Texte, Bestellweg, Fokus und Bedienung sind unberührt (G9, A-077).

## PRÜFUNG UND ERGEBNIS

Im Arbeitsbaum über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: **278 Testdateien, 4.341 Tests, alle grün.** Vorher 277 Dateien und 4.335 Tests, neu ist 1 Datei mit 6 Tests.
- `sicher.sh --json -- npm run typecheck`: Exit 0, ohne Fehler
- `sicher.sh --json -- npm run lint`: Exit 0, ohne Befund
- `SM24_INDEXIERUNG=an sicher.sh --json -- npm run build`: Exit 0, „Compiled successfully in 30.9s“, 190 von 190 Seiten

Server:
- Der Prüfserver 3000 ist beendet.
- Der Messstand 3200 läuft frisch gestartet; seine Dateien sind unverändert.

## BELEGE

Alles unter `_werkstatt/ausbau/protokolle/FA-SEO-03E/`:
- `gewicht-{vorher,nachher}.json`
- `netz-{vorher,nachher}.json`: jede Datei mit Größe, dazu `mitZeichnung` (Dateien mit Texten aus `zylinder-mass`, `schliessplan` oder `schluessel`)
- `bilder/bildvergleich-nachher.json` (PNGs nur unter `/tmp/sm24-proben/FA-SEO-03E/`)
- `tabelle.md`
- `experimente/`: `messen.sh` (frisch starten, Gewicht, Netz, Bilder), `netz.mjs`, `bilder.mjs`, `tabelle.mjs`

Vorher: Messstand 3200, frisch gestartet, Quelltext gleich dem Arbeitsbaum vor dem Paket (`diff -rq src` leer). Nachher: Arbeitsbaum, frisch gebaut und frisch gestartet auf 3000. Beide Stände liefen mit demselben Skript.

```
experimente/messen.sh vorher /home/user/sm24-messstand 3200
experimente/messen.sh nachher /home/user/schluesselmacher24 3000
node experimente/bilder.mjs vergleichen /tmp/sm24-proben/FA-SEO-03E/vorher /tmp/sm24-proben/FA-SEO-03E/nachher bilder/bildvergleich-nachher.json
node experimente/tabelle.mjs protokolle/FA-SEO-03E
```

git habe ich nur lesend benutzt (`status`, `diff`, `log`).

## OFFENE FRAGEN

1. **OFFENE FRAGE (Technik, Schreibrechte): `schluessel` steht auf Kontakt, im Assistenten und auf `/artikel` in zwei Blöcken.**
   - Vorher teilten sich Upload-Feld und Warenkorb einen Block mit `SchluesselGrafik` (`25dee87xdmrqo.js`).
   - Nachher hat der Warenkorb `319lz1uogmj62.js`, und das Upload-Feld hat seinen Teil in `23v-9dj-h1q6m.js` (Kontakt) bzw. `26ss49o33nn5j.js` (Assistent), jeweils mit dem Generator.
   - `/artikel` lädt denselben Block `23v-9dj-h1q6m.js` (26,5 KB roh, 9,8 KB übertragen). Vermutlich kommt er über die Formular-Bausteine aus `forms/**`, die `artikel-liste.tsx` einbindet (`Field`, `TextInput`); das ist nicht einzeln belegt. Laut Build steckt derselbe Block auch in `/service-und-termin/vor-ort` (nicht gemessen).
   - Netto sinkt die Menge trotzdem (Kontakt −3,7, Assistent −5,2, `/artikel` −17,2 KB übertragen). Ohne die Verdopplung wären es geschätzt bis zu etwa 10 KB mehr Ersparnis; das ist nicht gemessen.
   - Ein Eingriff läge in `forms/**` oder in der Blockbildung (`next.config.ts`), also außerhalb dieses Pakets.
2. **OFFENE FRAGE (Prüfbarkeit):** Im JSON-Modus gibt es keine bestellbare Codelinie und keinen bestellbaren Artikel. Das Profilbild der Code-Position und die Artikelbilder sind deshalb nur über Markup-Tests belegt, nicht durch Bildschirmfotos. Mit gepflegten Testdaten im Payload-Modus ließe sich das nachholen.
3. **Hinweis:** `3n-9wq23i8brw.js` (31,7 KB roh, mit `schluessel`) lädt nur der gefüllte Warenkorb, vorher wie nachher, vermutlich über den Vorabruf eines Ziels mit Bestellformular. Das ist nicht untersucht, weil es keine Seite außerhalb des Warenkorbs betrifft.

## FÜR MENSCHEN

- Nichts zu entscheiden. Preise, Texte, Rechtstexte, Farben und Bestellweg sind unverändert.
- Für Kunden ändert sich nur, dass Seiten im Hintergrund weniger laden. Gemessen: Startseite, Shop und Warenkorb etwa 17 KB weniger, `/artikel` 17,2 KB, Kontakt und Assistent 4 bis 5 KB. Für alle übrigen Seiten ist eine ähnliche Ersparnis erwartet, aber nicht gemessen.

## Nachbesserung

Nach zwei Gegenprüfungen am 18.11.2026:

1. **[gelb] Pauschale Ersparnis „jede Seite etwa 17 KB“ — behoben.** Gemessen sind nur sieben Ansichten. Kopf (Zeile 5), Bytes je Stelle, Entscheidungstabelle und FÜR MENSCHEN nennen jetzt die gemessenen Seiten mit ihren Zahlen: Startseite, Shop und Warenkorb −17,0 KB, `/artikel` −17,2 KB, Kontakt −3,7 KB und Assistent −5,2 KB übertragen. Für alle übrigen Seiten steht dort „erwartet, nicht gemessen“.
2. **[gelb] Überflüssiges `cn(...)` in `code-profil-bild.tsx:17` — behoben.** Dort steht jetzt `className="absolute inset-0 h-full w-full"`, und der Import von `cn` bleibt, weil Zeile 16 ihn mit zwei Argumenten braucht. Der Markup-Vergleich in `code-profil-bild.test.tsx` ist erneut grün (6 von 6), das Markup ist also zeichengleich.
3. **[gelb] Doppelter `schluessel`-Block auf `/artikel` verschwiegen — behoben.** Laut `netz-nachher.json` lädt `/artikel` nachher `319lz1uogmj62.js` und neu `23v-9dj-h1q6m.js` (26,5 KB roh, 9,8 KB übertragen), vorher nur `25dee87xdmrqo.js`. Das steht jetzt unter Bytes je Stelle, in der Entscheidungstabelle und in OFFENE FRAGE 1. Vermutete Herkunft: `Field` und `TextInput` aus `forms/**`, die `artikel-liste.tsx` einbindet; das ist nicht einzeln belegt. Laut Build steckt derselbe Block auch in `/service-und-termin/vor-ort`, das ist nicht gemessen. Die Nettozahl −17,2 / −62,0 KB bleibt richtig.

Prüfungen nach der Nachbesserung über die Datenweiche:
- vitest: 278 Testdateien, 4.341 Tests, alle grün
- typecheck: Exit 0
- lint: Exit 0, ohne Befund
- Build mit `SM24_INDEXIERUNG=an`: Exit 0, 190 von 190 Seiten

Die Netzmessung wurde nicht wiederholt, weil sich das Markup nicht geändert hat.

## Abnahme durch den Orchestrator (18.11.2026)

**Ergebnis: abgenommen.** Warenkorb und Artikelliste binden das Register aller Zeichnungen nicht mehr ein; der Vorabruf des Warenkorbs lädt dadurch auf jeder gemessenen Seite weniger, und keine Seite sieht anders aus.

Eigene Nachmessung (frisch gestartete Server; alt ist der Stand dfbb941 auf Port 3200, neu der Build des Arbeitsbaums auf Port 3000; vom Browser geladen bis Netzruhe plus 5 Sekunden, 412 px):
| Seite | alt | neu | Unterschied |
|---|---|---|---|
| Startseite | 21 Dateien, 263,5 KB | 20, 246,5 KB | −17,0 KB |
| Shop | 21, 263,5 KB | 20, 246,5 KB | −17,0 KB |
| Warenkorb (leer) | 24, 299,6 KB | 23, 282,6 KB | −17,0 KB |
| Artikelliste | 25, 310,3 KB | 25, 293,1 KB | −17,2 KB |
| Autoschlüssel | 21, 263,5 KB | 20, 246,5 KB | −17,0 KB |
| Schlüssel nach Code | 22, 271,1 KB | 21, 254,1 KB | −17,0 KB |
| Zylinder-Konfigurator | 24, 299,6 KB | 23, 282,6 KB | −17,0 KB |
| Ratgeber | 22, 270,6 KB | 21, 253,6 KB | −17,0 KB |
| Ortsseite Wetzlar | 22, 265,4 KB | 21, 248,3 KB | −17,0 KB |
| Kontakt | 23, 288,9 KB | 24, 285,2 KB | −3,7 KB |
| Autoschlüssel-Assistent | 25, 312,0 KB | 25, 306,8 KB | −5,2 KB |
Skripte im HTML am frisch gestarteten Server: sieben Ansichten gleich; Kontakt 17 und 253,5 KB auf 18 und 254,9 KB, Assistent 264,3 auf 265,2 KB (die Zeichnung des Schlüssels steht dort jetzt in einem eigenen Block; insgesamt lädt der Browser trotzdem weniger, siehe Tabelle).

Weiter geprüft:
- Kette `abnahme.sh FA-SEO-03E`: Typprüfung, Lint, Unit-Tests 4341, Datenbanktests 190, Build 190/190 grün.
- Bildvergleich mit dem Stand davor (ganze Seite, 412 und 1280 px): 14 Seiten, 28 Bilder, alle bytegleich (Warenkorb, Artikelliste, Shop, Kasse, Schlüssel nach Code, Kontakt, Assistent, Vorlage-Anfrage, Konfigurator, Autoschlüssel, Ratgeber, Ortsseite, Tutorials, Partner).
- Menüprobe 19 von 19; Formulare laden und wechseln den Schritt wie zuvor.
- Grenze der Prüfung (wie im Bericht): Ohne Datenbank gibt es keine bestellbare Codelinie und keinen Artikel; das Profilbild einer Position und die Artikelbilder sind durch den Markup-Vergleich mit `ImagePlaceholder` belegt (sechs Tests), nicht durch Bilder. Beim ersten echten Produkt mit ansehen.

Offen (vorgemerkt, nicht dringend): Die Zeichnung des Schlüssels steht auf Kontakt, Assistent und Artikelliste jetzt in zwei Blöcken (Warenkorb und Upload); eine Bereinigung könnte bis etwa 10 KB bringen, ist aber nicht gemessen.

Noch nicht auf main: Der Stand geht erst auf Anweisung des Nutzers live.

