# Visuelles System — Icons, Grafik-Generatoren, Bewegung

Alle Grafiken der Seite sind **Vektorgrafiken aus Code und Daten**. Keine Stockfotos, keine erzeugten Fotos, die eine echte Werkstatt vortäuschen.
Echte Fotos kommen nur aus der Medienbibliothek (`ImageSlot.bild`).

## Ordner

| Ordner | Inhalt |
|---|---|
| `icons/` | Fach-Icons, je Datei eine Komponente (`icons/schluessel-nach-code.tsx` → `IconSchluesselNachCode`) |
| `icons/icon-base.tsx` | gemeinsamer SVG-Rahmen aller Fach-Icons und Glyphen |
| `glyphen/` | UI-Glyphen, je Datei ein Glyph (`glyphen/haken.tsx` → `GlyphHaken`) |
| `generators/` | Grafik-Generatoren, je Datei einer (`generators/schluessel.tsx` → `SchluesselGrafik`) |
| `generators/grafik-basis.tsx` | gemeinsame Helfer der Generatoren (Parameterleser, Strichskala, Raster, Rahmen); kein Generator |
| `interaktiv/` | Client-Hüllen um Generatoren, dazu reine Helfer (`auswahl.ts`) |
| `motion/` | Bewegungsbausteine (`InView`, `Reveal`, `DrawOn`, `CheckDraw`, `motionStyle`) |
| `registry.tsx` | Liste der Generatoren, die Inhalte über `ImageSlot.visual` ansprechen dürfen |
| `profillinie.tsx` | `Profillinie` — gestufte Leitlinie nach dem Vorbild eines Schlüsselbarts |
| `bereich-icon.tsx` | `BereichIcon` — Fach-Icon je Leistungsbereich |
| `area-scope.tsx` | setzt `data-area` → Akzentfarbe des Bereichs |

Keine Sammeldateien (`index.ts`). Importe immer direkt aus der Datei.

## Farben

Nur Tokens, nie feste Farbwerte (`#…`, `rgb()`, `oklch()`):

- Bereichsakzent: `fill-area`, `stroke-area`, `text-area-strong`, `fill-area-strong`, `stroke-area-strong`,
  `fill-area-soft`, `fill-area-muted`, `stroke-area-muted` — wechselt automatisch mit `[data-area]`
  (Werte in `src/lib/visual/area-theme.ts`).
- Neutral: `stroke-foreground`, `stroke-foreground-muted`, `fill-surface`, `fill-surface-muted`,
  `stroke-border-strong`, `fill-foreground-muted` (Beschriftungen).
- Zustand (nur Schließtechnik): `stroke-success` (passt), `stroke-danger`, `fill-danger-soft` (passt nicht).
- Farbe per Tailwind-Klasse setzen, nicht per `fill="var(--…)"` (Safari). Deckkraft über Tailwind (`fill-area/20`); gedämpfte Bauteile über `opacity-30` auf einer äußeren Gruppe.

## Fach-Icons

```tsx
import { IconBase, type IconProps } from './icon-base';

export function IconFahrzeugschluessel(props: IconProps) {
  return (
    <IconBase {...props}>
      <path className="fill-area-muted" stroke="none" d="…" />   {/* Zweitonfläche */}
      <path d="…" />                                               {/* Kontur: currentColor */}
    </IconBase>
  );
}
```

- `viewBox="0 0 48 48"`, Kontur `stroke="currentColor"`, runde Enden/Ecken (setzt `IconBase`).
  `strokeWidth={2}` ist nur die Vorgabe am Bild; am Bildschirm gilt `--icon-strich` (1,75 px) über
  `[data-sm24-icon]` in `globals.css`, für jede Form im Icon (`vector-effect: non-scaling-stroke`).
- Zweitonflächen mit `className="fill-area-muted" stroke="none"`.
- Keine `id`s, keine Verläufe, keine Masken, keine Texte. Mindestabstand 3 Einheiten zum Rand.
- Standardgröße 48 px; lesbar ab 24 px (derzeit 54 Dateien in `icons/`). Ohne `title` dekorativ (`aria-hidden`), mit `title` → `role="img"`.

## UI-Glyphen

- Gleiche Familie wie die Fach-Icons (`IconBase`, `data-sm24-icon`, `--icon-strich`), aber einfarbig:
  Kontur in `currentColor`, keine Zweitonfläche. Für Text, Knöpfe, Status und Steuerung von 14 bis 24 px;
  Standardgröße `size` = 20.
- Neue Glyphen: Datei in `glyphen/` mit genau einem Export `Glyph<Dateiname in PascalCase>`
  (`glyphen/pfeil-links.tsx` → `GlyphPfeilLinks`). Der Vertrag `glyphen/glyphen.test.tsx` findet die Datei
  selbst; eine Liste zu pflegen entfällt.
- Vertrag: Server-Komponente, importiert `IconBase` aus `../icons/icon-base`, kein Zufall, Striche nur
  `currentColor`, kein `<text>`, `id`, Verlauf, Maske, Filter, Muster, `url()`, keine Hex-, `rgb()`- oder
  `hsl()`-Werte. Pfadbefehle nur `M L H V A Z`; Punkte und Kreise liegen im Bereich 3–45.

Alle 39 Glyphen-Dateien (Stand Quelltext):

| Datei | Komponente | Datei | Komponente | Datei | Komponente |
|---|---|---|---|---|---|
| `bild-fehlt` | `GlyphBildFehlt` | `lineal` | `GlyphLineal` | `rechner` | `GlyphRechner` |
| `bild-hochladen` | `GlyphBildHochladen` | `mail` | `GlyphMail` | `schluessel` | `GlyphSchluessel` |
| `dokument` | `GlyphDokument` | `menue` | `GlyphMenue` | `speichern` | `GlyphSpeichern` |
| `filter` | `GlyphFilter` | `minus` | `GlyphMinus` | `suche` | `GlyphSuche` |
| `gebaeude` | `GlyphGebaeude` | `nachricht` | `GlyphNachricht` | `telefon` | `GlyphTelefon` |
| `haken-kreis` | `GlyphHakenKreis` | `ort` | `GlyphOrt` | `uhr` | `GlyphUhr` |
| `haken` | `GlyphHaken` | `papierkorb` | `GlyphPapierkorb` | `verbot` | `GlyphVerbot` |
| `hilfe` | `GlyphHilfe` | `personen` | `GlyphPersonen` | `waage` | `GlyphWaage` |
| `info` | `GlyphInfo` | `pfeil-links` | `GlyphPfeilLinks` | `warenkorb` | `GlyphWarenkorb` |
| `kalender` | `GlyphKalender` | `pfeil-rechts` | `GlyphPfeilRechts` | `warnung` | `GlyphWarnung` |
| `kamera` | `GlyphKamera` | `plus` | `GlyphPlus` | `winkel-rechts` | `GlyphWinkelRechts` |
| `kreuz` | `GlyphKreuz` | `pruefsiegel` | `GlyphPruefsiegel` | `winkel-unten` | `GlyphWinkelUnten` |
| `laden` | `GlyphLaden` | `raute` | `GlyphRaute` | `zuruecksetzen` | `GlyphZuruecksetzen` |

## Grafik-Generatoren

```tsx
import type { VisualProps } from '../registry';

export function SchluesselGrafik({ params, title, className }: VisualProps) { … }
```

- Reines SVG, **Server-Komponente** (kein `'use client'`), deterministisch (kein `Math.random`,
  kein `Date`) — gleiche Werte ergeben dieselbe Grafik. Zustand gibt es nur in Client-Hüllen
  (`interaktiv/`); Generatoren bleiben reine Funktionen von `params`.
- Eingaben selbst prüfen: unbekannte Werte → Standardwerte, Zahlen begrenzen; ein Generator darf nie werfen.
- `role="img"`, `<title>{title}</title>` als erstes Kind (`GrafikRahmen`), `preserveAspectRatio="xMidYMid meet"`,
  `viewBox` fest: `0 0 480 270` (16:9), `0 0 480 300` (Schließplan, Tür), `0 0 480 360` (Profilschnitt, **Ausnahme zu K-008**, siehe `profilschnitt`).
- Keine `id`s (mehrfach auf einer Seite), Pfeilspitzen als eigene Pfade statt `<marker>` (`pfeilspitze`).
- Beschriftungen als `<text>` mit `className="fill-foreground-muted font-mono"` und fester `fontSize`
  in viewBox-Einheiten (`SCHRIFT` 13, `SCHRIFT_KLEIN` 12); nur sachliche Angaben aus `params`.
- Einstiegsbewegung optional über die CSS-Klassen unten; die Grafik muss auch ohne Bewegung vollständig sein.
- Jeder Generator hat einen Test (`*.test.tsx`, `renderToStaticMarkup`): Standardwerte, Unsinnswerte werfen
  nicht, `<title>` vorhanden, gleiche Eingabe → gleiche Ausgabe.
- Aufnahme in `registry.tsx` erfolgt zentral (Name = Dateiname ohne Endung); `registry.test.tsx` prüft,
  dass jede Datei in `generators/` eingetragen ist.

## Strichskala der Generatoren

Generatoren zeichnen mit der Skala aus `grafik-basis.tsx`. In `strokeWidth={…}` stehen nur diese Namen,
außer bei den Ausnahmen unten.

| Name | Wert | Einsatz (Beispiele) |
|---|---|---|
| `DETAIL` | 0,75 | feine Details; derzeit in keinem Generator verwendet |
| `HILFSLINIE` | 1 | Raster, Hilfs- und Bemaßungslinien, Bohrungsränder |
| `LINIE` | 1,5 | Maßlinien, Verbindungen, Federn, Stifte, Führungslinien |
| `LINIE_STARK` | 2 | kräftigere Kanten (Schließplan, Schlüsselknoten, Fräser) |
| `KONTUR` | 2,25 | Körper, Schlüssel, Türen, Zarge, Gehäuse |
| `AKZENT` | 3 | hervorgehobene Linien (Fräsprofil, Legendenlinie), Platzhalterstriche (`code-fundstelle`) |
| `MARKE` | 4 | sehr kräftige Linien, sparsam (Platzhalterzeilen `code-fundstelle`) |

Für Strichmuster gilt `MITTELLINIE` (`'10 3 2 3'`, Strich-Punkt) und `DRAW_DASHARRAY` (`'1 2'`, siehe Bewegung).

Ausnahmen nach D-010 (`docs/gestaltung/ENTSCHEIDUNGEN.md`): elf Zahlen bleiben im Quelltext stehen, weil sie
Flächen aus breiten Strichen sind oder die Geometrie steuern.

- Doppelstrich-Halos (gezeichnete Flächen): `code-fundstelle` Griff 13 + 8, Lupe 9 + 4,5;
  `zutritt-signal` Drücker 11 + 6.
- Spurband im Schlüssel: `schluessel` 10.
- Platzhalter-Striche `striche()`, deren Dicke zugleich die Geometrie steuert: `code-fundstelle` 6, 3,5, 5, 5.

Ausnahmen nach D-010 stehen als Zahl mit Kommentar im Quelltext (K-008); neue Zahlen statt eines Namens brauchen Kommentar und Begründung nach D-010. Stand: nur `zutritt-signal` ist kommentiert; an neun der elf Zahlen fehlt der Kommentar (offen, Code außerhalb dieses Pakets).

### `schluessel` — Schlüssel in Seitenansicht (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `typ` | `zylinder` · `buntbart` · `klapp` · `funk` · `smart-key` · `transponder` | `zylinder` |
| `einschnitte` | 4–8 Ziffern 0–9, als Liste oder Text (`'35274'`); werden unter dem Bart beschriftet, Vorrang vor `code` | ruhiges Profil ohne Beschriftung |
| `code` | Text (es zählen die ersten 40 Zeichen) → daraus abgeleitetes Profil, bewusst ohne Ziffern | – |
| `anzahl` | 1–3 (ganzzahlig); weitere Schlüssel versetzt dahinter, etwa für „Kopie“ | `1` |
| `rohling` | `true` – nur `zylinder`: gerader Halm, Einschnittzone gestrichelt (vor der Code-Eingabe) | – |

Beim `smart-key` gibt es keinen Bart; `funk` und `smart-key` zeigen Funkbögen.

### `zylinder-mass` — Maßzeichnung eines Schließzylinders (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `bauform` | `profil-doppel` · `profil-halb` · `knauf` | `profil-doppel` |
| `aussen` | Maß A in mm, 25–100 | `30` |
| `innen` | Maß B (innen) in mm, 25–100 (bei `profil-halb` ohne Wirkung) | `30` |
| `knaufseite` | `innen` · `aussen` (nur bei `knauf`) | `innen` |
| `format` | `breit` (480 × 270) · `schmal` (300 × 220, Schrift 16/15 für Telefone) | `breit` |

Gemessen wird von der Mitte der Stulpschraube bis zum Zylinderende, maßstäblich. `ablauf`, `zylinder-mass` und `schliessplan` stehen in `SCHMALES_FORMAT` der Registry (die schmale Fassung hat in `ImagePlaceholder` Vorrang vor einem `ausschnitt`); `schmaleFassung(ref)` liefert den Verweis mit `format: 'schmal'`.

### `schliessplan` — Hierarchie einer Schließanlage (`viewBox 0 0 480 300`; schmal `0 0 360 h`, Höhe nach Ebenen)

| Parameter | Werte | Standard |
|---|---|---|
| `system` | `gleichschliessung` · `zentral` · `haupt` · `generalhaupt` | `haupt` |
| `gruppen` | 1–4 Hauptgruppen (nur bei `generalhaupt`) | `2` |
| `tueren` | 2–8 Türen (bei `zentral`: Wohnungstüren) | `4` |
| `markiert` | Kennung eines Schlüssels: `wurzel` · `g1`…`g4` (HGS) · `g1.1`… (GS) · `e1`…`e8` (ES); Groß-/Kleinschreibung egal | ohne Markierung |
| `tuer` | Kennung einer Tür: `t1`…`t8`, Zentraltüren `z1` · `z2` | ohne Markierung |
| `reserve` | 0–2 freie Plätze (gestrichelter ES mit Tür, Beschriftung „frei“; nur `haupt` und `generalhaupt`, an der letzten Gruppe); nicht wählbar | `0` |
| `format` | `breit` · `schmal` (360 Einheiten breit, Schrift 12, Kürzel ohne Symbol; nie verkleinert) | `breit` |
| `nummern` | `true` · `false` (auch `'true'`, `'ja'`): Türnummer 1–8 in Mono unter jeder Tür, nicht an Zentral- und Reservetüren | `false` |

- `markiert` hat Vorrang vor `tuer`. Unbekannte Kennungen bleiben ohne Wirkung. `nummern` steht hier für Türnummern; bei `tuer-schutz` bedeutet derselbe Name Marken und Legende.
- Markierter Schlüssel: dieser Schlüssel, die Türen, die er schließt, und die Kanten seines Weges
  sind hervorgehoben, alles andere ist gedämpft. Markierte Tür: diese Tür, alle Schlüssel, die sie öffnen,
  und die Kanten dazwischen.
- Ohne `title` nennt der Titel die Markierung („… – markiert: HGS 1“). `schliessplanSchluessel(params)` liefert dieselben Schlüssel als Liste `{ kennung, kuerzel, tueren }`
  (oben nach unten, links nach rechts). Sie speist die Auswahl in `SchliessplanInteraktiv`.

### `code-fundstelle` — wo die Schlüsselnummer steht (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `ort` | `schluesselkopf` · `sicherungskarte` · `zylinderstirn` | `schluesselkopf` |

Die Nummer erscheint nur als Platzhalter-Striche, nie als Ziffern.

### `zutritt-signal` — elektronische Zutrittslösung (`viewBox 0 0 480 270`)

| Parameter | Werte | Standard |
|---|---|---|
| `medium` | `transponder` · `karte` · `smartphone` | `transponder` |

Medium → Funkbögen (`sm24-dash`) → Leser im Türbeschlag → Freigabe-Haken
(`sm24-pop`, Haken `sm24-draw`). Ohne Aufdruck, Marke oder App-Oberfläche.

### `profilschnitt` — Schlüsselrohling wird gefräst (`viewBox 0 0 480 360`)

Großer Moment der Startseite (B-01, K-007): Ein Rohling wird gefräst; das Profil zeichnet sich, und der
Fräser fährt die Bahn ab. Die Grafik ist ohne Bewegung vollständig.

| Parameter | Werte | Standard |
|---|---|---|
| `einschnitte` | 4–8 Ziffern 0–9 (Liste oder Text); mehr als acht zählen die ersten acht | – |
| `code` | Text (erste 40 Zeichen) → 6 Einschnitte, abgeleitet; nur wirksam ohne gültige `einschnitte` | – |
| `beschriftung` | `true` · `false` (auch `'nein'`, `'0'`); ohne Nummern, Bemaßung und Legende | `true` |

Ohne gültige Angabe: Standardprofil `[2, 6, 3, 7, 1, 5]`.

- **Ausnahme zu K-008:** K-008 nennt für Generatoren 480 × 270 bzw. 480 × 300; die Höhe 360 ist dort nicht benannt. Offen: KERN-Änderung mit Versionsnummer oder Angleichung des Generators (Entscheidung Orchestrator).
- Bewegung: das gefräste Profil (`sm24-draw`) ab 0,3 s über 1,1 s (`FRAESBAHN`); das Material blendet
  (`sm24-fade`) danach ein. Der Fräser blendet ein und wird von der Client-Hülle `FraesbahnBewegung` entlang
  der Bahn geführt, im Takt der Zeichnung. Ohne Hülle steht er gehoben am Bahnende (`FRAESER_ABHEBEN`).
- Exporte: `PROFILSCHNITT_GROESSE`, `PROFILSCHNITT_AUSSCHNITT` (x 140, y 98, 320 × 140), `FRAESBAHN`, `FRAESER_ABHEBEN`. Im schmalen Ausschnitt ist die Bemaßung ausgeblendet.
- Zugänglichkeit: `role="img"`, Standardtitel „Schlüsselprofil mit N Einschnitten wird gefräst“.

### `tuer-schutz` — Schutzpunkte einer Tür, Innenansicht (`viewBox 0 0 480 300`)

Tür von innen mit fünf nummerierten Schutzpunkten, von oben nach unten: 1 Zusatzschloss,
2 Schutzbeschlag, 3 Schließzylinder, 4 Schließblech, 5 Bandseite.

| Parameter | Werte | Standard |
|---|---|---|
| `fokus` | `alle` · `zylinder` · `beschlag` · `schliessblech` · `zusatzschloss` · `bandseite` — hebt ein Bauteil hervor, die übrigen werden gedämpft | `alle` |
| `nummern` | `true` · `false` (auch `'ja'`, `'nein'`, `'1'`, `'0'`, `'an'`, `'aus'`); ohne Marken und Legende | `true` |

- Bewegung: Führungslinien (`sm24-draw`) und Marken (`sm24-pop`) erscheinen gestaffelt ab 0,3 s,
  je Bauteil 0,12 s später.
- Zugänglichkeit: Standardtitel „Schutzpunkte einer Tür“, bei `fokus` mit dem Namen des Bauteils.

### `stiftzuhaltung` — Schnitt durch einen Schließzylinder (viewBox 0 0 480 270)

Schnitt durch einen Schließzylinder mit fünf Stiftpaaren und eingestecktem Schlüssel. Einsatz nach D-012:
Seiten 404 und Fehler sowie die Kür-Szene auf `/gleichschliessende-zylinder` (Abschnitt 01, mit `szene: 'scroll'`).

| Parameter | Werte | Standard |
|---|---|---|
| `zustand` | `passt` · `passt-nicht` · `abgebrochen` | `passt` |
| `einschnitte` | 5 Ziffern 0–9 als Liste oder Text (`'37264'`); die Stifte sind auf diese Tiefen ausgelegt; ohne gültige Angabe | `[3, 6, 2, 7, 4]` |
| `code` | bis 4 Ziffern (Text oder Zahl), erscheinen auf der Reide; sonst entfällt die Angabe | – |
| `szene` | `scroll`: nur bei `passt` – Schlüssel fährt beim Scrollen ein, die Stifte richten sich aus (B-25, Klassen `sm24-szene` und `sm24-scrub-*`, Variablen als reine Zahlen); ohne Unterstützung oder bei reduzierter Bewegung die Endlage. Ein Rahmen mit `overflow: hidden` darum schneidet in unterstützenden Browsern mit `clip` (sonst hielte er die Zeitleiste an). | – |

- Bei `passt` liegen alle Fugen auf der Trennlinie.
- Bei `passt-nicht` trägt der Schlüssel andere Tiefen; die falschen Fugen werden mit Pfeil und roter Linie
  markiert. Bohrung 4 bleibt immer passend, weil ihr Versatz 0 ist.
- Bei `abgebrochen` trägt der Halm nur bis zur zweiten Bohrung. Die Bohrungen 3–5 haben keinen Halm,
  ihre Stifte fallen nach unten und ihre Fugen sind falsch. Die Reide ist nach links abgesetzt.
- Bewegung: Die Trennlinie aus 15 Strichen zeichnet sich nacheinander (`sm24-draw`, je 0,04 s versetzt);
  die Fugenmarken erscheinen gestaffelt (`sm24-pop`, ab 0,3 s, je 0,12 s).
- Zugänglichkeit: Titel je Zustand — „Stiftzuhaltung: Der Schlüssel passt“, „… passt nicht“,
  „Abgebrochener Schlüssel im Zylinder“.

### `ablauf` — Reihenfolge als bemaßte Stationen (`viewBox 0 0 480 270`; schmal `0 0 300 h`, Höhe nach Anzahl)

Zwei bis fünf nummerierte Stationen auf einer Bemaßungslinie (Kettenmaß von der ersten zur letzten
Station mit Anfangsstrich), Pfeilspitzen an den Enden, Spitze an der Hilfslinie der Folgestation,
kurze Mono-Beschriftung. Einsatz: Kopf des Ratgebers, wenn
der vorhandene Text eine Reihenfolge nennt (`ablaufAusText` in `src/lib/visual/motiv.ts`).

| Parameter | Werte | Standard |
|---|---|---|
| `schritte` | Text, durch `\|` getrennt; 2–5 Einträge, je höchstens 14 Zeichen; leere Einträge entfallen; sonst gilt der Standard | drei Stationen nur mit Nummern |
| `aktiv` | 0 (keine) oder 1–5: diese Station hinterlegt (`fill-area-soft`, `stroke-area-strong`) | `0` |
| `format` | `breit` (Schrift 16) · `schmal` (300 breit, senkrecht, Schrift 12) | `breit` |

- Stationen in der Bereichsfarbe (`stroke-area`), im breiten Format Kreis 30 mit Nummer 18, im schmalen
  Kreis 22. Bemaßungslinie und Pfeile `foreground-muted`.
- Breit: Polster ein Rasterfeld (30) neben Kreis und Beschriftung. Passen lange Beschriftungen nicht
  nebeneinander, stehen die geraden Stationen eine Zeile tiefer.
- Schmal: Der Inhalt steht waagerecht mittig in der Breite.
- Bewegung (B-23): die Linie zeichnet (0,6 s), dann die Stationen nacheinander (`sm24-pop`, Staffel
  0,12 s), Beschriftung und Pfeil mit ihrer Station; gesamt 1,36 s bei vier Stationen, 1,48 s bei fünf.

## BereichIcon

```tsx
import { BereichIcon } from '@/components/visual/bereich-icon';

<BereichIcon area="schliessanlagen" size={32} className="text-area-strong" />
<BereichIcon area={area} title="Schließanlagen" />   {/* als Bild angesagt */}
```

- Ordnet jedem der neun Bereiche (`AreaKey`) das gleichnamige Fach-Icon zu
  (`autoschluessel` → `icons/autoschluessel.tsx` … `service-und-termin`).
- Nimmt alle `IconProps` (`size`, Standard 48; `title`; `className` …). Ohne `title`
  dekorativ, mit `title` → `role="img"`. Unbekannter Bereich (etwa aus fehlerhaften Inhalten) → `null`.
- Die Zuordnung liegt als `BEREICH_ICONS` vor; ein neuer Bereich ohne Icon kompiliert nicht.

## Registry — Namen und Parameter

Inhalte verweisen mit `ImageSlot.visual = { generator, params }` auf eine Grafik;
`ImagePlaceholder` zeichnet sie über `renderVisual(ref, title, className)`.
Unbekannte Namen oder unvollständige Verweise ergeben `null` (dann greift der
Fach-Icon-Ersatz). `visualNames()` liefert die Namen sortiert.

Die Registry umfasst neun Generatoren: `ablauf`, `code-fundstelle`, `profilschnitt`, `schliessplan`,
`schluessel`, `stiftzuhaltung`, `tuer-schutz`, `zutritt-signal`, `zylinder-mass`.

```ts
{ generator: 'zylinder-mass', params: { bauform: 'knauf', aussen: 30, innen: 45 } }
```

Für alle Generatoren gilt: Auswahltexte ohne Rücksicht auf Groß-/Kleinschreibung und
Leerzeichen am Rand, Zahlen auch als Text mit Dezimalkomma (`'32,5'`), Werte außerhalb des
Bereichs werden begrenzt, alles Unbekannte fällt auf den Standard zurück. Ein leerer
`title` wird durch einen sachlichen Ersatztitel ersetzt.

## Profillinie

`profillinie.tsx` — gestufte Linie nach dem Vorbild eines Schlüsselbarts (Rücken, Einschnitte, Spitze).
Leitelement der Erzählansichten (K-008, B-02). Kein Generator und nicht in der Registry.

| Prop | Werte | Standard |
|---|---|---|
| `text` | Quelle des Profils; gleicher Text ergibt dieselbe Linie (ohne Rücksicht auf Groß-/Kleinschreibung und Randleerzeichen) | – |
| `einschnitte` | 3–8 | `5` |
| `groesse` | `klein` (10 px hoch, Abstand 14) · `gross` (16 px hoch, Abstand 20) | `klein` |
| `voll` | Haarlinie bis zum Rand des Elternelements | `false` |
| `delay`, `ruhig` | Verzögerung in Sekunden; `ruhig` ohne Einstiegsbewegung | `0`, `false` |

- Farbe über `currentColor` (z. B. `text-area`), Strich 1,5 px (`--strich` in `globals.css`), dekorativ (`aria-hidden`).
- **Ausnahme zu K-008** (Höhe 12–24 px): `klein` ist 10 px hoch. Offen: KERN-Änderung oder Angleichung des Generators (Entscheidung Orchestrator).
- Die Linie zeichnet sich einmal (`sm24-draw`, 0,6 s); die Haarlinie folgt 0,45 s später. Ohne JavaScript läuft diese Zeichnung ab; bei „Bewegung reduzieren“ steht sie sofort vollständig da. Mit `ruhig` entfällt die Zeichnung.
- `profillinienPunkte(text, einschnitte, groesse)` liefert Punkte und Maße (für Tests).

## Client-Hüllen (`interaktiv/`)

Hüllen sind Client-Komponenten (`'use client'`) und importieren Generatoren; Generatoren selbst tragen nie
`'use client'`. Regel: **Generatoren bleiben reine Funktionen; Zustand nur in der Hülle.**

| Datei | Export | Steuert | Generator |
|---|---|---|---|
| `code-fundstelle-interaktiv.tsx` | `CodeFundstelleInteraktiv` | drei Registerkarten (Pfeiltasten, Pos1, Ende), Überblendung, Hinweistexte je Ort | `code-fundstelle` |
| `live-schluessel.tsx` | `LiveSchluessel` | Profil folgt dem eingegebenen Code nach `verzoegerung` (Standard 250 ms) | `schluessel` (`typ: 'zylinder'`) |
| `schliessplan-interaktiv.tsx` | `SchliessplanInteraktiv` | Systemwahl (`systeme`, `anfang`, `tueren`, `gruppen`); Auswahl eines Schlüssels oder einer Tür setzt `markiert` bzw. `tuer`; Ergebnis als Text in einer Live-Region | `schliessplan` |
| `fraesbahn-bewegung.tsx` | `FraesbahnBewegung` | fährt den Fräser der Grafik `profilschnitt` im Takt der Zeichnung ab; startet, wenn die Hälfte sichtbar ist; bei „Bewegung reduzieren“ kein Lauf | `profilschnitt` (als Kind) |

- `auswahl.ts` enthält reine Helfer (Texte für Screenreader, Tastaturwechsel) ohne React.
- `code-fundstelle-interaktiv` trägt nach dem ersten Wechsel, `live-schluessel` sobald sich das Profil ändert,
  `sm24-ruhig`: die Einstiegsbewegungen spielen nicht erneut. `schliessplan-interaktiv` und `fraesbahn-bewegung` tragen es nicht.
- `motion/in-view.tsx` (`InView`) ist ebenfalls eine Client-Hülle; sie steuert nur `data-motion`.

## Bildstellen (`ImagePlaceholder`)

`components/ui/image-placeholder.tsx` zeichnet jede Bildstelle nach fester Rangfolge (K-008):

1. **Foto** aus der Medienbibliothek (`slot.bild.url`), Alternativtext aus `slot.bild.alt`.
2. **Fachgrafik** aus Daten: `slot.visual`, sonst `visualFuerMotiv(slot.motif)` (Motivtext → Generator
   mit sachlichen Parametern). Entfällt bei `compact`.
3. **Fach-Icon** passend zum Motiv (`fachIconFuerMotiv`): 32 px bei `compact`, sonst 72 px; dekorativ.

`visualFuerMotiv` ordnet nach Stichwörtern zu: Fräsen, Werkstatt → `profilschnitt`; Schließanlage,
Hauptschlüssel, Zentralschloss → `schliessplan`; Sicherungskarte, Zylinderstirn, Schlüsselnummer →
`code-fundstelle`; Zutritt, Leser, Karte → `zutritt-signal`; Zylinder, Messen → `zylinder-mass`;
Tür, Beschlag, Schloss → `tuer-schutz` (`nummern: false`); Schlüsselbegriffe → `schluessel`.

- Nie Platzhaltertext, nie „Bild folgt“, nie erzeugte Fotos. `ausschnitt` (unter 640 px nur ein Teil der Zeichnung; Legenden mit `data-legende` werden darin größer) gilt für Fachgrafiken; `frei` lässt Fläche und Rahmen weg.
- Generatoren mit schmalem Format (`SCHMALES_FORMAT`) zeigt die Fläche unter 640 px in dieser Fassung, sofern kein `ausschnitt` gesetzt ist. Beschriftungen sollen auf Telefonen mindestens etwa 11,5 px groß sein (KERN K-008).

## Bewegung

CSS zuerst, kein SMIL, keine Dauerbewegung ohne Grund. Klassen aus `globals.css`:

| Klasse | Wirkung | Hinweis |
|---|---|---|
| `sm24-draw` | Linie zeichnet sich | Element braucht `pathLength={1}` |
| `sm24-reveal` | blendet von unten ein | |
| `sm24-fade` | blendet ein, ohne sich zu bewegen | z. B. Material und Fräser im `profilschnitt` |
| `sm24-pop` | wächst aus der Mitte | Punkte, Haken, Marker |
| `sm24-dash` | laufende Strichlinie | Funk, Signal, Datenfluss; höchstens 3 Durchgänge |
| `sm24-schritt-vor` · `-zurueck` | Schrittwechsel im Ablauf (B-11) | `flow-shell` |
| `sm24-scrub-y` · `-x` · `-marke` | an das Scrollen gebunden (B-03) | nur mit `view()`-Timeline; Startseite |
| `sm24-ruhig` | Einstiegsbewegungen aus | `code-fundstelle-interaktiv`, `live-schluessel` nach dem ersten Wechsel |

Verzögerung/Dauer typsicher mit `motionStyle(delay, duration?, style?)` aus
`motion/motion-style.ts` (Sekunden; ungültige Werte entfallen):

```tsx
<path className="sm24-draw stroke-area" pathLength={1} style={motionStyle(0.2, 0.8)} d="…" />
```

Einstiegsbewegungen starten erst im sichtbaren Bereich, wenn ein Vorfahr `InView`
(`motion/in-view.tsx`) ist. Ohne JavaScript spielen sie sofort ab, bei „Bewegung
reduzieren“ sind alle Grafiken sofort vollständig.

Runde Linienenden zeigen bei `sm24-draw` im Wartezustand einen Punkt am Pfadende
(besonders sichtbar bei Kreisen). Dagegen hilft das Strichmuster
`DRAW_DASHARRAY` (`'1 2'`) als Inline-Stil:
`style={motionStyle(0.2, 0.8, { strokeDasharray: DRAW_DASHARRAY })}` —
`DrawOn` und `CheckDraw` setzen es selbst.

### Bewegungsbausteine

Alle außer `InView` sind Server-Komponenten ohne JavaScript im Browser.

| Baustein | Datei | Zweck |
|---|---|---|
| `InView` | `motion/in-view.tsx` | Client-Hülle: hält `sm24-draw`/`-reveal`/`-fade`/`-pop`/`-dash` darunter an, bis der Bereich sichtbar ist (`threshold`, Standard 0,25; `as`, Standard `div`) |
| `Reveal` | `motion/reveal.tsx` | Hülle mit `sm24-reveal`; `delay`, `duration` (Sekunden), `as` (Standard `div`, in SVG `g`), `className`, `style` |
| `DrawOn` | `motion/draw-on.tsx` | SVG-`<g>`, dessen Kinder nacheinander erscheinen; `delay` (erstes Kind), `stagger` (Abstand, Standard 0,12 s), `duration`, dazu alle Attribute eines `<g>` |
| `CheckDraw` | `motion/check-draw.tsx` | Bestätigungshaken im Kreis: Fläche, dann Kreis, dann Haken; `title` (Standard „Bestätigt“), `size` (Standard 48), `delay`, `className` |

```tsx
<InView>
  <Reveal delay={0.1}>…Text…</Reveal>
  <svg viewBox="0 0 200 80" fill="none" strokeLinecap="round">
    <DrawOn delay={0.2} stagger={0.15} className="stroke-area" strokeWidth={2}>
      <path d="…" />      {/* zeichnet sich, pathLength 1 wird gesetzt */}
      <circle … />         {/* zeichnet sich danach */}
      <text …>…</text>     {/* blendet als Drittes ein */}
    </DrawOn>
  </svg>
  <CheckDraw title="Anfrage gesendet" size={64} delay={0.3} />
</InView>
```

- `DrawOn`: Linienformen (`path`, `line`, `polyline`, `polygon`, `circle`, `ellipse`,
  `rect`) bekommen `sm24-draw` und `pathLength={1}`; alles andere (`g`, `text`,
  Komponenten) `sm24-reveal`. Fragmente werden aufgelöst, loser Text entfällt,
  `className` und `style` der Kinder bleiben erhalten. Für Linien am besten `<path>`.
- `CheckDraw` nutzt die Bereichsfarben (`fill-area-soft`, `stroke-area`,
  `stroke-area-strong`) und ist immer ein Bild mit `<title>` — neben einem Text, der
  dasselbe sagt, einen knappen Titel wählen.

`framer-motion` nur, wenn CSS nicht reicht — dann in `<MotionConfig reducedMotion="user">`.
