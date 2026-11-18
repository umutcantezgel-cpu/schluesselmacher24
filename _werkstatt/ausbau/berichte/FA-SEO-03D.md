# Bericht FA-SEO-03D · Mobile Leistung, Teil D: weniger Skript auf Formularseiten

Stand 18.11.2026. Baumeister und Prüfer in einem Lauf. Alle drei Kandidaten sind übernommen. Jeder senkt für sich die Menge, die der Browser bis Netzruhe plus 5 s insgesamt lädt, und alle drei zusammen tun es auch. Die 40 Bilder (20 Upload-Schritte auf 15 Seiten, jeweils 412 und 1280 px) sind in jedem Einzelstand und im Endstand pixelgleich, der Text ist gleich. Preis-Ergebnisse sind unverändert: 5.490 Fälle mit 0 Abweichungen. Es gibt kein `import()`, kein `next/dynamic` und kein Vorladen.

## GEÄNDERTE DATEIEN

Neu:
- `src/components/forms/upload-beispiel.tsx`: Beispielfläche am Upload-Feld mit fünf Generatoren statt des Registers
- `src/components/forms/photo-upload-voll.tsx`: `PhotoUploadAlleZeichnungen` mit `ImagePlaceholder`, für Beispiele aus gepflegten Inhalten
- `src/components/forms/upload-beispiel.test.tsx` (7 Tests)
- `src/lib/wege/naechste-schritte-listen.ts`: die Listen `SCHRITTE_*` und der Typ `NaechsterSchritt`, Wort für Wort verschoben
- `src/lib/fahrzeug-vor-ort.ts`: `LEISTUNGEN_MIT_ANLERNEN` und `fahrzeugVorOrtNoetig`, Wort für Wort aus `pricing.ts` verschoben
- `src/lib/fahrzeug-vor-ort.test.ts` (3 Tests)

Geändert:
- `src/components/forms/photo-upload.tsx`: Import Zeile 15. Neue optionale Eigenschaft `beispielFlaeche` in den Zeilen 229–233, Standard `UploadBeispiel` in Zeile 293. Zeichnen in Zeile 437 mit `<Beispiel slot={beispiel} />` statt `<ImagePlaceholder slot={beispiel} />`.
- `src/lib/wege/naechste-schritte.ts`: Die Listen sind entfernt. Die Datei importiert sie aus `./naechste-schritte-listen` und gibt sie weiter (Zeilen 12–35). `naechsteSchritte()` bleibt unverändert.
- `src/lib/pricing.ts`: Import von `fahrzeug-vor-ort` in Zeile 18, Weitergabe `export { LEISTUNGEN_MIT_ANLERNEN, fahrzeugVorOrtNoetig }` in Zeile 27. Der Block ist entfernt (vorher Zeilen 25–48).
- `src/components/autoschluessel/optionen.ts`, Zeile 1: Import aus `@/lib/fahrzeug-vor-ort` statt `@/lib/pricing`
- Nur die Importzeile geändert:
  - `schluessel-nach-code/[slug]/bestell-formular.tsx` (Zeilen 18–19, `PhotoUploadAlleZeichnungen as PhotoUpload`)
  - auf `naechste-schritte-listen` umgestellt: `kontakt-formular.tsx`, `einsatz-formular.tsx`, `beratung-formular.tsx`, `partner-formular.tsx`, `sicherheitscheck.tsx`, `einsende-formular.tsx`, `projekt-konfigurator.tsx`, `schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`, `zutritt-konfigurator.tsx` und `components/konfigurator/schliessplan-planer.tsx`
- `src/lib/wege/naechste-schritte.test.ts`: Die Prüfung der Wege lässt `naechste-schritte` oder `naechste-schritte-listen` zu. Neuer Block „Listen und Logik getrennt“ mit 3 Tests.
- Protokolle unter `_werkstatt/ausbau/protokolle/FA-SEO-03D/`. Die Lighthouse-Rohdaten liegen in `protokolle/roh/FA-SEO-03D/` (gitignoriert). Das Werkzeug schreibt sie nach `roh/FA-SEO-03`; sie wurden dorthin verschoben.

Unberührt: `image-placeholder.tsx`, `visual/registry.tsx`, `visual/generators/**`, `flow/**`, Texte, Preise, CSS. Alle anderen Nutzer von `ImagePlaceholder` und vom Register laufen deshalb über unveränderten Code.

## WAS UND WARUM

Messverfahren (alter und neuer Stand gleich behandelt):
- Stand vorher: Messstand 3200, frisch gestartet.
- Einzelstände k1, k2, k3: Versuchsordner `/home/user/sm24-versuch` mit dem Quelltext des Messstands und nur den Dateien des jeweiligen Kandidaten, je frisch gebaut und frisch gestartet auf 3300.
- Endstand: Arbeitsbaum, gebaut und frisch gestartet auf 3000.
- Je Stand:
  - `gewicht.mjs` als erste Anfragen
  - `experimente/netz.mjs`: sechs Seiten, 412 px mobil, Netzruhe plus 5 s, Bytes aus dem Protokoll von Chromium
  - `experimente/upload-bilder.mjs`: Bildvergleich, jedes Pixel exakt, ohne Schwelle
- `netz.mjs` ist deterministisch: Eine Wiederholung am Messstand ergab Byte für Byte dieselben Werte (`netz-vorher-2.json`).

### Kandidat 1 · Beispielzeichnungen am Upload-Feld: übernommen

Was geändert wurde:
- `photo-upload.tsx` zeichnet das Beispiel mit `UploadBeispiel`. Die Datei importiert nur die Generatoren, die an Upload-Feldern vorkommen: `code-fundstelle`, `foto-beispiel`, `profilschnitt`, `schluessel`, `tuer-schutz`.
- Ermittelt aus allen Beispielen der 14 Formulare mit festen Beispielen und aus allen Steckplätzen (`visualFuerSteckplatz`).
- `UploadBeispiel` folgt derselben Rangfolge und denselben Klassen wie `ImagePlaceholder` mit Standardwerten: Foto, dann Zeichnung, dann Fach-Icon.
- Keiner der fünf Generatoren hat eine schmale Fassung.

Ein Formular setzt sein Motiv aus gepflegten Inhalten zusammen: die Codelinie, `Beispielfoto: ${line.keyType} …`.
- Je nach Schlüsseltyp wählt `visualFuerMotiv` dort jeden Generator, etwa „Zylinderschlüssel“ → `zylinder-mass`.
- Dieses Formular nutzt deshalb `PhotoUploadAlleZeichnungen` mit `ImagePlaceholder`. Das ist eine Änderung nur an der Importzeile, das Verhalten ist wie vorher.
- Der Weg „Beispiel auf dem Server zeichnen“ wurde nicht gewählt. Er hätte 16 Formulare und ihre Seiten über die Importzeilen hinaus geändert.

Belege (`upload-beispiel.test.tsx`):
- (a) Jedes `example=` jedes Aufrufers wird aus dem Quelltext gelesen: Objektliteral, lokale Konstante, `KEY_PHOTO_SLOTS`, `REGISTRATION_EXAMPLE`, `BEISPIEL_*`. Jedes braucht nur Generatoren der Auswahl. Ein Motiv als Vorlage mit Platzhalter lässt den Test scheitern; solche Formulare müssen `photo-upload-voll` nehmen.
- (b) Das Markup von `UploadBeispiel` und `ImagePlaceholder` ist zeichengleich, für jedes Beispiel × 4 Seitenverhältnisse × 9 Steckplatz-Fälle, dazu Foto und Fach-Icon: mehr als 500 Vergleiche.
- (c) Die fünf Komponenten sind dieselben Objekte wie im Register (`getVisual`).
- (d) `PhotoUploadAlleZeichnungen` ergibt dasselbe Feld wie `PhotoUpload` und zeichnet auch Generatoren außerhalb der Auswahl.
- (e) `photo-upload.tsx` und `upload-beispiel.tsx` importieren zur Laufzeit weder `image-placeholder` noch `registry`.

Bytes, k1 gegen vorher:

| | vorher | k1 |
|---|---|---|
| HTML-Skripte Assistent | 18, 277,6 KB | 17, 266,3 KB (−11,3) |
| HTML-Skripte Kontakt | 19, 267,6 KB | 18, 256,5 KB (−11,1) |
| Browser gesamt Kontakt | 25 Dateien, 296,6 KB übertragen, 873,0 roh | 24, 292,6 (−4,0), 866,8 roh (−6,2) |
| Browser gesamt Assistent | 26, 317,8 / 945,5 | 25, 313,7 (−4,1) / 939,3 (−6,2) |
| Vorlage, Beratung, Sicherheitscheck | | je −3,9 bis −4,0 KB übertragen, −6,2 bis −6,3 KB roh, eine Datei weniger |

Warum im Browser weniger als im HTML: Der Seitenkopf verlinkt auf jeder Seite `/warenkorb`. Dessen Vorabruf lädt einen Block mit den Generatoren (`warenkorb-ansicht.tsx` und `artikel-liste.tsx` nutzen `ImagePlaceholder`). Diese Zeichnungen kommen also weiter, nur nicht mehr doppelt. Siehe OFFENE FRAGE 1.

Bildvergleich k1: 40 von 40 pixelgleich (`bilder/bildvergleich-k1.json`).

Entscheidung: **übernommen.** Der Eingriff senkt die Gesamtmenge auf allen fünf Formularseiten. Aussehen und Bedienung sind gleich.

### Kandidat 2 · Listen und Logik von `naechste-schritte.ts` trennen: übernommen

Was geändert wurde:
- Die sieben Listen und `NaechsterSchritt` liegen Wort für Wort in `naechste-schritte-listen.ts`, ohne Laufzeit-Importe. Ein Textvergleich mit dem alten Block ist gleich, bis auf eine Leerzeile am Ende.
- `naechste-schritte.ts` behält `naechsteSchritte()` und gibt dieselben Objekte weiter.
- Die zehn Aufrufer, die nur Listen lesen, importieren nun aus der Listen-Datei.
- `fahrzeug-anfrage/formular.tsx`, `service-und-termin/anfrage`, `gehaeuse` und `bestellung/[id]` brauchen `naechsteSchritte()` und bleiben, wie sie sind.

Belege (neuer Block in `naechste-schritte.test.ts`):
- Die Listen-Datei hat keine Laufzeit-Importe.
- Weitergabe mit `toBe`: dieselben Objekte, genau die sieben Namen.
- Die zehn Formulare lesen aus der Listen-Datei und nicht aus der Logik.
- Die bisherigen Tests der Auswahl laufen unverändert grün.

Bytes, k2 gegen vorher:
- Kontakt im HTML: 19 → 18 Skripte, 267,6 → 264,5 KB (−3,1).
- Im Browser:
  - Kontakt 296,6 → 292,5 KB übertragen (−4,1), roh −6,5; Vorlage −3,9 / −5,7; Beratung −4,0 / −6,5; Sicherheitscheck −4,1 / −6,5; je eine Datei weniger
  - Assistent −0,2 übertragen, roh gleich. Er nutzt die Listen nicht.
  - Konfigurator gleich

Bildvergleich k2: 40 von 40 pixelgleich.

Entscheidung: **übernommen.** Der Eingriff senkt die Gesamtmenge auf allen Formularen, die nur Listen zeigen. Der Text auf den Seiten ist unverändert.

### Kandidat 3 · `fahrzeugVorOrtNoetig` aus `pricing.ts` lösen: übernommen

Was geändert wurde:
- `LEISTUNGEN_MIT_ANLERNEN` und `fahrzeugVorOrtNoetig` stehen Wort für Wort in `src/lib/fahrzeug-vor-ort.ts`, ohne Laufzeit-Importe.
- `pricing.ts` importiert sie für `quoteCarKeyService` und gibt beide Namen weiter.
- `optionen.ts` liest aus der neuen Datei.
- Keine Regel, kein Betrag und kein Text wurde geändert (G9).

Belege:
- `fahrzeug-vor-ort.test.ts`: dieselben Objekte über `pricing.ts`, keine Laufzeit-Importe, `optionen.ts` ohne `pricing` und `cylinder-rules`.
- Die Preis-Tests in `pricing.test.ts` (darin `fahrzeugVorOrtNoetig`) laufen unverändert grün.
- Vergleich vorher/nachher mit `experimente/preisvergleich.ts`:
  - `quoteCarKeyService` alt (b0aa692) gegen neu
  - alle 12 Hersteller × Modelle (und ohne Modell) × 6 Leistungen × 5 Schlüsselarten × 0/1/2 Schlüssel
  - 5.490 Fälle, **0 Abweichungen** im ganzen Ergebnis-JSON und in `fahrzeugVorOrtNoetig` (`preisvergleich.json`)

Bytes, k3 gegen vorher:
- Assistent im HTML: 277,6 → 275,6 KB (−2,0), weiter 18 Skripte.
- Assistent im Browser: 26 → 25 Dateien, 317,8 → 314,0 KB übertragen (−3,8), roh −5,6.
- Auf den anderen fünf Seiten sind die Bytes roh gleich. Sie laden aber eine Datei weniger und dadurch 1,8 KB weniger übertragen. Das liegt an der anderen Aufteilung der Blöcke, nicht an weniger Code.

Bildvergleich k3: 40 von 40 pixelgleich.

Entscheidung: **übernommen.** Der Eingriff senkt die Gesamtmenge im Assistenten, und die Preis-Ergebnisse sind nachweislich gleich.

### Kandidat 4 · Sonstiges aus der Bündelanalyse: nichts übernommen, eine Stelle als OFFENE FRAGE

Der größte verbleibende Posten liegt nicht auf den Formularseiten, sondern im Vorabruf von `/warenkorb`. Er ist von jeder Seite aus verlinkt, über den Kopf (`site-header.tsx:170`).
- Der Warenkorb (`warenkorb-ansicht.tsx:241`, `:391`, `:660`) zeichnet nur `schluessel` und Kompaktbilder.
- `artikel-liste.tsx:219` zeichnet nur ein Kompaktbild.
- Beide ziehen über `ImagePlaceholder` das ganze Register. Im Endstand lädt Kontakt davon den Block `2-r6jqyd3r1e6.js` (38,6 KB roh, 12,5 KB übertragen), in dem unter anderem `schliessplan` und `zylinder-mass` stehen.
- Die Dateien liegen außerhalb der Schreibrechte. Deshalb ist nichts geändert und nichts gemessen. Der Konfigurator zeigt, wie es ginge: Er nutzt dafür schon `KompaktBild`.

## Tabelle der neun Ansichten (Skripte im HTML, frisch gestartete Server, KB gzip 9)

| Ansicht | vorher | k1 | k2 | k3 | nachher (alle drei) |
|---|---|---|---|---|---|
| start | 14, 218,2 | 14, 218,2 | 14, 218,2 | 14, 218,2 | 14, 218,2 |
| autoschluessel | 15, 220,7 | 15, 220,7 | 15, 220,7 | 15, 220,7 | 15, 220,7 |
| assistent | 18, 277,6 | 17, 266,3 | 18, 277,4 | 18, 275,6 | **17, 264,3 (−13,3)** |
| code | 16, 233,0 | 16, 233,0 | 16, 233,0 | 16, 233,0 | 16, 233,0 |
| konfigurator | 17, 253,3 | 17, 253,3 | 17, 253,3 | 17, 253,3 | 17, 253,3 |
| shop | 15, 220,7 | 15, 220,7 | 15, 220,7 | 15, 220,7 | 15, 220,7 |
| ort | 14, 211,3 | 14, 211,3 | 14, 211,3 | 14, 211,3 | 14, 211,3 |
| ratgeber | 14, 216,5 | 14, 216,5 | 14, 216,5 | 14, 216,5 | 14, 216,5 |
| kontakt | 19, 267,6 | 18, 256,5 | 18, 264,5 | 19, 267,6 | **17, 253,5 (−14,1)** |

Was der Browser bis Netzruhe plus 5 s lädt (Dateien, KB übertragen, KB roh):

| Seite | vorher | k1 | k2 | k3 | nachher |
|---|---|---|---|---|---|
| Assistent `/autoschluessel/anfrage` | 26, 317,8, 945,5 | 25, 313,7, 939,3 | 26, 317,6, 945,5 | 25, 314,0, 939,9 | **25, 312,0, 933,7 (−5,8 / −11,8)** |
| Kontakt | 25, 296,6, 873,0 | 24, 292,6, 866,8 | 24, 292,5, 866,5 | 24, 294,8, 873,0 | **23, 288,9, 860,4 (−7,7 / −12,6)** |
| Zylinder-Konfigurator | 25, 301,5, 894,4 | 24, 299,3, 894,5 | 25, 301,5, 894,4 | 24, 299,7, 894,5 | 24, 299,6, 894,6 (−1,9 / +0,2) |
| Schlüssel nach Vorlage | 26, 308,3, 904,5 | 25, 304,4, 898,3 | 25, 304,4, 898,8 | 25, 306,5, 904,5 | **24, 300,8, 892,6 (−7,5 / −11,9)** |
| Beratung | 25, 296,5, 872,3 | 24, 292,5, 866,1 | 24, 292,5, 865,8 | 24, 294,7, 872,3 | **23, 288,9, 859,7 (−7,6 / −12,6)** |
| Sicherheitscheck | 26, 308,4, 906,4 | 25, 304,5, 900,1 | 25, 304,3, 899,9 | 25, 306,6, 906,4 | **24, 300,7, 893,7 (−7,7 / −12,7)** |

Der Konfigurator hat kein Upload-Feld und keine Liste. Dort sinkt nur die Zahl der Dateien, roh bleiben die Bytes gleich (+0,2 KB durch die andere Aufteilung).

Bildvergleich Endstand: 40 von 40 pixelgleich, Text und Zahl der Elemente gleich (`bilder/bildvergleich-nachher.json`).
- Seiten: Kontakt (ganz), Beratung, Vor Ort, Allgemeine Anfrage (Unterlagen), Partner (Nachweise), Sicherheitscheck (Unterlagen), Einschicken (Nachweis mit Fahrzeugschein und mit Sicherungskarte), Schließanlagen-Projekt (Dokumente), Schlüssel nach Vorlage (Vorderseite, Rückseite, Spitze, Nummern), Zutritt (Unterlagen), Assistent (Schlüsselfotos, Fahrzeugschein), Gehäuse, Motorrad, E-Scooter, Fahrzeug nicht gefunden (Unterlagen).
- Alle Seiten bei 412 und 1280 px, ganze Seite.
- Den Schritt setzt ein erfundener Zwischenstand. Nichts wurde abgesendet; Attrappen nach G5.
- Die Codelinien-Seite (`bestell-formular`) gibt im JSON-Modus 404, weil Musterdaten nur in Tests sichtbar sind. Sie ist durch den Markup-Test belegt (d).

Lighthouse, nur als Hinweis (je 5 Läufe, Median, Spanne in Klammern; Messstand gegen Endstand, nacheinander auf derselben Maschine):

| Seite | Leistung vorher | Leistung nachher | TBT vorher | TBT nachher | CLS |
|---|---|---|---|---|---|
| Assistent | 84 (83–91) | 91 (82–91) | 196 (161–340) | 155 (116–249) | 0 / 0 |
| Kontakt | 89 (86–94) | 91 (88–95) | 98 (60–210) | 152 (55–198) | 0 / 0 |
| Konfigurator | 93 (90–95) | 92 (90–94) | 65 (54–76) | 55 (52–134) | 0 / 0 |

Die Spannen überlappen. Daraus folgt keine Aussage über den Leistungswert; maßgeblich sind die Bytes oben.

## GEMEINSAME DATEIEN

- `src/components/forms/photo-upload.tsx` ist der gemeinsame Baustein von 16 Formularen.
  - Die Schnittstelle ist gleich geblieben, dazu kommt nur die optionale Eigenschaft `beispielFlaeche`.
  - Die Pflichtregel (R13), `alsUpload`, Fehlermeldungen, Fokus und Bedienung sind unberührt. Nur die Zeile, die das Beispiel zeichnet, ist geändert.
  - Die 22 Tests in `photo-upload.test.tsx` sind unverändert grün.
- Neuen Upload-Beispielen außerhalb der fünf Generatoren würde `UploadBeispiel` das Fach-Icon zeigen. Außerhalb der Produktion meldet es das mit `console.warn`. Die Lösung ist `photo-upload-voll` oder ein Eintrag in `UPLOAD_ZEICHNUNGEN`.
  - Der Test (a) schlägt an, wenn das Beispiel als Objektliteral, als Konstante derselben Datei oder als eine der Konstanten in `GELIEFERT` übergeben wird, und zwar in jeder Datei, die `PhotoUpload` über den Alias oder relativ importiert.
  - Eine Weitergabe `example={example}` ist nur in den Dateien aus `WEITERGABE` erlaubt (heute nur die Hülle `FotoSchritt` in `schluessel-nach-vorlage/anfrage/anfrage-formular.tsx`). Jede andere Weitergabe lässt den Test scheitern.
  - Andere Formen (etwa ein Beispiel aus einer berechneten Variable oder über `{...props}`) erkennt der Test nicht vollständig. Was er nicht lesen kann, meldet er als Fehler, soweit es über `example=` läuft.
- `src/lib/wege/naechste-schritte.ts` und `src/lib/pricing.ts` geben alle bisherigen Namen weiter (Tests mit `toBe`).

## PRÜFUNG UND ERGEBNIS

Im Arbeitsbaum über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: **277 Testdateien, 4.334 Tests, alle grün.** Vorher 275 und 4.307; neu sind 2 Dateien mit 10 Tests, dazu 3 Tests in `naechste-schritte.test.ts`. Nach der Nachbesserung 4.335 Tests (siehe unten).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler
- `sicher.sh --json -- npm run lint`: ohne Befund
- `SM24_INDEXIERUNG=an sicher.sh --json -- npm run build`: Exit 0, „Compiled successfully in 47s“, 190 von 190 Seiten
- Einzelstände k1, k2, k3 im Versuchsordner: je Exit 0, 190 von 190 Seiten

Server:
- 3000 und 3300 sind beendet.
- Der Messstand 3200 läuft weiter. Er wurde für dieses Paket frisch gestartet, seine Dateien sind unverändert.

## BELEGE

Alles unter `_werkstatt/ausbau/protokolle/FA-SEO-03D/`:
- `gewicht-{vorher,k1,k2,k3,nachher}.json`
- `netz-{vorher,vorher-2,k1,k2,k3,nachher}.json` mit jeder Datei und ihrer Größe
- `preisvergleich.json`
- `bilder/schritte.json` (gefundene Upload-Schritte) und `bilder/bildvergleich-{k1,k2,k3,nachher}.json`. Die PNGs liegen lokal und sind gitignoriert.
- `leistung/` (Lighthouse-Zusammenfassungen)
- Skripte in `experimente/`: `upload-bilder.mjs`, `netz.mjs`, `tabelle.mjs`, `preisvergleich.ts`, `variante.sh` (Einzelstand bauen), `messen.sh` (frisch starten, Gewicht, Netz, Bilder)

```
experimente/messen.sh <name> <wurzel> <port>
B=<name> node experimente/upload-bilder.mjs vergleichen protokolle/FA-SEO-03D/bilder
node experimente/tabelle.mjs protokolle/FA-SEO-03D vorher k1 k2 k3 nachher
npx tsx --tsconfig tsconfig.json experimente/preisvergleich.ts   # pricing-alt.ts = b0aa692:src/lib/pricing.ts daneben
```

Hinweis zum Vorgehen:
- Ich habe einmal `git add -N` für die neuen Dateien ausgeführt, um Unterschiede zu sammeln. Das habe ich sofort mit `git reset -- <dieselben Dateien>` zurückgenommen; der Index steht wie vor dem Paket.
- Außerdem habe ich mit `git checkout` eine eigene, versehentliche Änderung an `src/components/weg/bestaetigung.tsx` verworfen. Das war nur ein Typ-Import, die Datei steht wie vorher.
- Sonst habe ich git nur lesend benutzt.

## OFFENE FRAGEN

1. **OFFENE FRAGE (Technik, Schreibrechte): Vorabruf des Warenkorbs zieht das Register auf jede Seite.**
   - `site-header.tsx` verlinkt `/warenkorb` auf jeder Seite.
   - `warenkorb-ansicht.tsx` (Zeilen 241, 391, 660) und `artikel-liste.tsx` (Zeile 219) zeichnen nur `schluessel` und Kompaktbilder, binden aber über `ImagePlaceholder` alle Generatoren ein.
   - Auf der Kontaktseite lädt der Browser deshalb weiter `2-r6jqyd3r1e6.js` (38,6 KB roh, 12,5 KB übertragen) mit Zeichnungen, die die Seite nie zeigt.
   - Möglicher Weg: wie im Konfigurator `KompaktBild` und den Generator `schluessel` direkt einbinden. Nicht gemessen, weil außerhalb der Schreibrechte.
   - Das wäre wahrscheinlich der größte verbleibende Hebel dieser Art auf allen Seiten.
2. **OFFENE FRAGE (Inhalte):** Das Beispiel an der Codelinie entsteht aus dem gepflegten Schlüsseltyp.
   - Ein Schlüsseltyp wie „Zylinderschlüssel“ ergäbe die Zeichnung `zylinder-mass` (Messen eines Zylinders), „Vorhängeschlossschlüssel“ heute schon `tuer-schutz`.
   - Das ist im Bestand so und durch `photo-upload-voll` unverändert erhalten. Ob dort immer die Schlüsselzeichnung stehen soll, ist eine Frage an die Gestaltung, nicht an dieses Paket.

## FÜR MENSCHEN

- Nichts. Es wurden keine Preise, Texte, Rechtstexte, Fristen und keine Farben geändert. Der Kunde sieht dieselben Seiten; er lädt auf den Formularseiten 6 bis 8 KB weniger und ein bis zwei Dateien weniger.
- Die offenen Fragen 1 und 2 sind technische und gestalterische Entscheidungen für den Orchestrator.

## Nachbesserung

Zwei Gegenprüfer haben drei gelbe Befunde gemeldet. Alle drei treffen zu und sind behoben. Geändert sind nur `src/components/forms/upload-beispiel.test.tsx`, `src/components/forms/upload-beispiel.tsx` und dieser Bericht.

1. **Behoben: Test (a) übersprang `example={example}` ohne Prüfung, `aufrufer()` fand nur Alias-Importe.**
   - Der Befund stimmt: Eine Hülle in einer anderen Datei oder ein relativer Import wäre nicht geprüft worden.
   - `aufrufer()` zählt jetzt jede Datei, die `PhotoUpload` aus dem Upload-Feld importiert, über `@/components/forms/photo-upload` oder relativ (der Pfad wird aufgelöst, `istUploadFeld`). Ausgenommen sind Tests und `photo-upload-voll.tsx`, deren Beispiele `ImagePlaceholder` zeichnet. Die Zahl der Formulare bleibt 15.
   - `beispieleVon` lässt `example={example}` nur in den Dateien der Liste `WEITERGABE` zu. Sonst bricht der Test mit einem Hinweis auf `photo-upload-voll` ab.
   - Der Satz unter GEMEINSAME DATEIEN ist auf diese Reichweite eingegrenzt.
2. **Behoben: Eine Hülle, die `example` weiterreicht, war nur zufällig abgedeckt.**
   - Der Befund stimmt und deckt sich mit Befund 1.
   - Für die erlaubte Datei prüft `pruefeWeitergabe`:
     - die Hülle (`FotoSchritt`) ist mit `example: ImageSlot` definiert und nicht exportiert;
     - sie wird mindestens einmal aufgerufen, jeder Aufruf mit eigenem `example=` und ohne Weitergabe oder `{...}`;
     - keine andere Quelldatei außer Tests nennt sie.
   - Die Werte der drei Aufrufe prüft `beispieleVon` wie bisher.
   - Ein neuer Test hält fest: Eine Hülle in einer fremden Datei scheitert. In der erlaubten Datei scheitern eine exportierte Hülle und ein Aufruf ohne eigenes Beispiel. Relative Pfade werden richtig aufgelöst.
3. **Behoben: Die Abweichung bei einem Generator außerhalb der Auswahl war zur Laufzeit stumm.**
   - Der Befund stimmt: Für `zylinder-mass` zeichnet `ImagePlaceholder`, `UploadBeispiel` zeigt das Fach-Icon.
   - `UploadBeispiel` warnt jetzt außerhalb der Produktion mit `console.warn`, wenn ein Generator ermittelt wurde, der nicht in `UPLOAD_ZEICHNUNGEN` steht. Die Warnung nennt Generator und Motiv. In der Produktion entfällt sie, weil `process.env.NODE_ENV` beim Bauen ersetzt wird; das Markup ist unverändert.
   - Der Test heißt jetzt „Generator außerhalb der Auswahl: Fach-Icon (Abweichung von ImagePlaceholder, nur über photo-upload-voll zulässig)“. Er prüft die eine Warnung und dass ein Beispiel ganz ohne Generator still bleibt.

Prüfung nach der Nachbesserung, im Arbeitsbaum über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 277 Testdateien, 4.335 Tests, alle grün (+1 Test in `upload-beispiel.test.tsx`)
- `sicher.sh --json -- npm run typecheck`: ohne Fehler
- `sicher.sh --json -- npm run lint`: ohne Befund
- `SM24_INDEXIERUNG=an sicher.sh --json -- npm run build`: Exit 0, 190 von 190 Seiten
- Messwerte und Bildvergleich sind nicht neu erhoben. Das gezeichnete Markup ist unverändert; der Markup-Vergleich mit `ImagePlaceholder` (über 500 Fälle) ist grün.

## Abnahme durch den Orchestrator (18.11.2026)

**Ergebnis: abgenommen.** Alle drei Kandidaten senken die Menge, die der Browser insgesamt lädt; keine Seite lädt mehr, keine sieht anders aus.

Eigene Nachmessung (frisch gestartete Server; alt ist der Live-Stand b0aa692 auf Port 3200, neu der Build des Arbeitsbaums auf Port 3000):
| Seite | Skripte im HTML alt → neu | Vom Browser geladen bis Netzruhe plus 5 s, alt → neu |
|---|---|---|
| Autoschlüssel-Assistent | 18, 277,6 KB → 17, 264,3 KB | 26 Dateien, 317,8 KB → 25, 312,0 KB (−5,8 KB) |
| Kontakt | 19, 267,6 KB → 17, 253,5 KB | 25, 296,6 KB → 23, 288,9 KB (−7,6 KB) |
| Zylinder-Konfigurator | 17, 253,3 KB → 17, 253,3 KB | 25, 301,5 KB → 24, 299,6 KB (−1,8 KB) |
| Schlüssel nach Vorlage, Anfrage | nicht gemessen | 26, 308,3 KB → 24, 300,8 KB (−7,4 KB) |
| Beratung | nicht gemessen | 25, 296,5 KB → 23, 288,9 KB (−7,6 KB) |
| Partner werden | nicht gemessen | 26, 301,6 KB → 24, 294,2 KB (−7,4 KB) |
| Startseite | 14, 218,2 KB → gleich | 22, 265,3 KB → 21, 263,5 KB (−1,8 KB) |
| Shop | 15, 220,7 KB → gleich | 22, 265,3 KB → 21, 263,5 KB (−1,8 KB) |
Die übrigen Ansichten aus `gewicht.mjs` (Autoschlüssel, Schlüssel nach Code, Ortsseite, Ratgeber) sind im HTML unverändert.

Weiter geprüft:
- Kette `abnahme.sh FA-SEO-03D`: Typprüfung, Lint, Unit-Tests 4335, Datenbanktests 190, Build 190/190 grün.
- Bildvergleich mit dem Live-Stand (ganze Seite, 412 und 1280 px): 16 Seiten, 32 Bilder, alle bytegleich (zwölf Formulare, Warenkorb, Schlüssel nach Code, Autoschlüssel, Shop). Der Baumeister hat zusätzlich 40 Bilder der Upload-Schritte verglichen (alle gleich).
- Alle Formulare laden und wechseln den Schritt ohne Konsolenfehler (12 Abläufe und das Kontaktformular).
- `src/lib/pricing.ts`: nur die Regel „Fahrzeug vor Ort“ und ihre Liste sind in `fahrzeug-vor-ort.ts` gezogen und werden unter denselben Namen weitergegeben; kein Betrag und keine Preisregel ist berührt (G9). Der Vergleich des Baumeisters über 5.490 Fälle ergab keine Abweichung.

Vorgemerkt (FA-SEO-03E): Der Vorabruf des Warenkorbs aus der Kopfzeile lädt das Register aller Zeichnungen auf jede Seite (12,5 KB übertragen), weil `warenkorb-ansicht.tsx` und `artikel-liste.tsx` `ImagePlaceholder` nutzen, obwohl sie nur eine Zeichnung und Kompaktbilder zeigen. Das ist der größte verbleibende Hebel dieser Art.

Noch nicht auf main: Der Stand geht erst auf Anweisung des Nutzers live.

