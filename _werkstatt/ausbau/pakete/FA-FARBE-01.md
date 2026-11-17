# FA-FARBE-01 · Dunkelblau statt Orange: Markenfarbe und dunkle Bühne

Kopf: Auftrag des Nutzers vom 17.11.2026 abends (Entscheidung A-074, ersetzt FA-04 in der Akzentfarbe) · Rolle Baumeister und Prüfer · Modell Opus · Stufe 3 (Farbsystem aller Seiten, Kopfzeile, Seitenkopf) · Kostenklasse L · ohne Datenschema · Befunde und Landkarte: Commit 65a74e9 (damals Blau zu Orange, 13 Dateien), `src/lib/visual/area-theme.ts`, `src/app/(site)/globals.css` (Kopfkommentar und `:root`), `docs/gestaltung/KERN.md`.

## Aufgabe in einem Satz
Ersetze das Markenorange auf der ganzen Seite durch ein tiefes Dunkelblau und gib der Seite eine dunkelblaue „Bühne“ (Kopfzeile, erster Bildschirm, Seitenkopf, Fuß, dunkle Bänder) mit hellblauen Lichtern, sodass sie auffällt und filmisch wirkt, ohne dass Inhalt, Aufbau, Bedienung, Lesbarkeit oder Ladezeit leiden.

## Vorgabe des Nutzers (wörtlich)
„Statt Orange wollen wir jetzt dieses Dunkelblau. Einfach visuell auffallen, cinematografisch. Als Farben und so.“
Ein Farbwert kam nicht mit. Maßgeblich ist das Dunkelblau, das die Seite schon trägt (Tinte der Überschriften, `--foreground` und `--surface-ink`, Farbton um 264 Grad), kräftiger gemacht. Alle Werte stehen deshalb an einer Stelle und lassen sich später mit einem Handgriff verschieben.

## Die Farbwelt (vom Orchestrator festgelegt, mit den Funktionen aus `area-theme.ts` nachgerechnet)
Alle Werte als OKLCH-Tripel „L C H“. Nenne sie im Code „Markenblau“ und „Bühne“.

**Auf hellen Flächen (ersetzt das Orange eins zu eins):**
| Rolle | Wert | Hex | gemessen |
|---|---|---|---|
| Text und Aktion (`strong`, `--primary`) | `0.36 0.13 262` | #123780 | 11,1:1 auf Weiß, 9,3:1 auf `surface-sunken`; Weiß darauf 11,1:1 |
| Aktion bei Hover (`--primary-hover`) | `0.29 0.11 262` | #092661 | Weiß darauf 14,4:1 |
| Grafik und Linien (`accent`, `--area`) | `0.52 0.17 262` | #2e62c9 | 5,7:1 auf Weiß, 4,7:1 auf `surface-sunken` |
| Fokusring (`--ring`) | `0.58 0.19 262` | #3672e9 | 4,4:1 auf Weiß, 3,7:1 auf `surface-sunken` |
| helle Fläche (`soft`) | `0.96 0.018 262` | #ebf2fe | `strong` darauf 9,9:1 |
| zarte Füllung (`muted`) | `0.9 0.047 262` | #cddffe | dekorativ |

Achtung Wortmarke: Die „24“ in `strong` unterscheidet sich von der Tinte der Wortmarke kaum (1,4:1). Auf hellem Grund trägt die „24“ deshalb die Grafikfarbe (`0.52 0.17 262`, 2,8:1 gegen die Tinte, 5,7:1 auf Weiß); auf der Bühne die helle Aktionsfarbe der Bühne.

**Bühne (dunkel): derselbe Satz Tokens, in einem Geltungsbereich neu belegt.** Richtwerte; bleib im sRGB-Farbraum (drei Werte unten liegen knapp außerhalb, nimm die Buntheit so weit zurück, bis `imSrgb` wahr ist) und halte die Kontraste:
| Token | Richtwert | Zweck |
|---|---|---|
| `--background` | `0.2 0.055 264` (#09142f) | Grund der Bühne |
| `--surface`, `--card` | `0.255 0.065 264` | Kacheln und Karten auf der Bühne |
| `--surface-muted` | `0.28 0.07 264` | gedeckte Fläche |
| `--surface-sunken` | `0.15 0.04 264` | tiefste Stufe, Rand des Lichts |
| `--foreground` | `0.985 0.004 255` | Text (17,4:1 auf dem Grund, 14,1:1 auf der gedeckten Fläche) |
| `--foreground-muted` | `0.86 0.03 255` | 11,9:1 auf dem Grund |
| `--foreground-subtle` | `0.76 0.04 255` | 8,5:1 auf dem Grund |
| `--border`, `--border-strong`, `--input` | `0.36 0.07 264`, `0.46 0.09 264` | Linien; Ränder von Bedienelementen brauchen mindestens 3:1 gegen ihre Umgebung, dafür eine hellere Stufe wählen |
| `--primary` | `0.84 0.09 235` (#8fd5fd) | helle Aktion: Schaltfläche mit dunkler Schrift (`--primary-foreground` = Grund der Bühne, 11,3:1), Links, die „24“ |
| `--primary-hover` | etwa `0.9 0.06 235` | heller |
| `--area`, `--area-strong`, `--ring` | etwa `0.78 0.12 235`, `0.86 0.08 235`, `0.8 0.11 235` | Grafik, Kennzeichnung, Fokusring (alle über 7:1 auf dem Grund) |
| `--area-soft`, `--primary-soft`, `--area-muted` | `0.3 0.08 264`, `0.36 0.09 264` | Füllungen in Grafiken |
Dazu das Licht: ein ruhiger Verlauf nur aus CSS (zum Beispiel `radial-gradient` von `oklch(0.36 0.13 262)` oben rechts über den Grund bis `0.15 0.04 264`), keine Bilddatei, keine Animation, kein Filter über Text. Text auf der hellsten Stelle des Lichts muss die Kontraste halten (Text 10,7:1, gedeckter Text 7,3:1 auf `0.36 0.13 262`).

Statusfarben (Erfolg, Warnung, Fehler) und der Akzent „Technisch-Teal“ bleiben auf hellem Grund, wie sie sind. Stehen sie auf der Bühne, brauchen sie dort eine helle Stufe mit mindestens 4,5:1; prüfe, ob das vorkommt.

## Wo die Bühne steht
1. **Kopfzeile** auf allen Seiten (die Leiste). Aufgeklappte Menüs und die Schublade am Telefon dürfen helle Flächen bleiben, wenn Übergang, Kontrast und Fokus stimmen; entscheide nach dem ruhigeren Bild und begründe im Bericht.
2. **Erster Bildschirm der Startseite** (der Hub „Wobei können wir Ihnen helfen?“ mit Kacheln, Zeichnung und Telefonzeile), mit Licht.
3. **Seitenkopf** (`page-header.tsx`) auf allen Seiten, mit Licht. Brotkrumen, Kennzeile, Titel, Einleitung, Schaltflächen, Kennzahlen und Zeichnungen im Kopf folgen den Tokens.
4. **Fuß** und die **Aktionsleiste am Telefon** (`mobile-action-bar.tsx`).
5. **Dunkle Bänder im Bestand**: `Section tone="ink"`, die dunkle Kartenvariante und was sonst `bg-surface-ink` nutzt, tragen dieselben Bühnen-Tokens (heute stünde dort dunkelblaue Aktion auf dunklem Grund).
Nicht auf der Bühne: Formulare, Kasse, Warenkorb, lange Lesetexte, Tabellen, Rechtstexte, das Backend, PDF und E-Mails. Sie bleiben hell und bekommen nur das Markenblau.

## Umsetzung, in dieser Reihenfolge
1. **Lies zuerst** `git show 65a74e9` (die Stellen, an denen die Farbe hängt), `src/lib/visual/area-theme.ts` mit Test, den Kopf von `globals.css`, `tailwind.config.ts` (wie `--area*` entsteht), die Bausteine unter `src/components/layout/`, den Hub der Startseite und `docs/gestaltung/KERN.md`. Vor Änderungen an Next-Dateien (`layout.tsx`, `icon.svg`, `global-error.tsx`) die passende Anleitung unter `node_modules/next/dist/docs/` (G12).
2. **Markenblau:** `area-theme.ts` (eine Quelle: Farbton, Abstufungsregel mit den neuen Helligkeiten, vier Stufen), `globals.css` (`--primary*`, `--ring`, Kopfkommentar), alles, was daraus abgeleitet wird.
3. **Bühne als ein Baustein:** ein Geltungsbereich in `globals.css` (Klasse oder Datenattribut, ein Name, zum Beispiel `.buehne` und `.buehne-licht`), der die Tokens neu belegt, auch `--area*` (die kommen sonst aus `[data-area]`: Die Bühne muss gewinnen, gleich ob sie innen oder außen von `[data-area]` steht; belege das mit einem Test am erzeugten CSS oder im Browser). Kein zweites Farbsystem, keine festen Farbwerte in Bausteinen.
4. **Anwenden** an den fünf Stellen oben. Suche danach alle festen hellen oder dunklen Klassen in diesen Bausteinen und ihren Kindern (`bg-white`, `text-white`, `bg-surface-ink`, `text-foreground-inverse`, feste `oklch(…)`), die auf der Bühne falsch stehen, und stelle sie auf Tokens um.
5. **Kopien der Farbe außerhalb der Tokens:** `src/app/(payload)/custom.css`, `src/payload/components/Marke.tsx`, `src/app/global-error.tsx`, `src/app/icon.svg`, `src/lib/druckansichten.ts`, `src/lib/mail/html.ts`, `src/lib/pdf/erzeuge-pdf.ts`, die Bereichsbilder unter `src/lib/og/`, `themeColor` in `src/app/(site)/layout.tsx` (Farbe der Kopfzeile). Suche selbst nach weiteren (`grep` nach den alten Werten `0.555 0.168 41`, `0.62 0.185 41`, `0.495 0.15 41`, `#c04606`, `#dd530f`, `#fdeee9`, `#fbd4c7` und nach „orange“).
6. **Sichtbare Texte, die die Farbe nennen** (Suche nach „orange“ in `src`): an die neue Farbe anpassen oder farbneutral fassen; nenne jede Stelle im Bericht. Rechtstexte, Preise und Firmendaten fasst du nicht an (G9); steht dort eine Farbe, melde sie.
7. **Tests** (G8: nichts abschalten, nichts lockern; die Regel wechselt, die Strenge bleibt):
   - `area-theme.test.ts`: Die Marke ist ein Dunkelblau (Farbton, Helligkeit, Buntheit in Grenzen), alle Bereiche tragen es; „kein Orange mehr“ für Aktions- und Hinweisfarben (die Statusfarbe Warnung bleibt); Kontraste auf hellen Flächen wie bisher, dazu `strong` und Grafikfarbe auf `surface-muted` und `surface-sunken`; kein Lila, kein Indigo, alles im sRGB-Farbraum.
   - Neu für die Bühne: jedes Token der Bühne ist belegt (kein Token des hellen Satzes scheint durch, das Farbe trägt); Text, gedeckter und leiser Text je mindestens 4,5:1 auf Grund, Karte, gedeckter Fläche und der hellsten Stelle des Lichts; Aktion, Grafik und Fokusring mindestens 3:1 auf denselben Flächen; Schrift auf der hellen Schaltfläche mindestens 4,5:1; die Statusfarben, falls sie auf der Bühne vorkommen.
   - Die „24“: hebt sich auf hellem Grund von der Tinte ab (mindestens 2,5:1) und ist dort lesbar (mindestens 4,5:1 auf Weiß).
   - Vorhandene Tests, die feste Farbwerte erwarten (`layout.test.ts`, `bereichsbild.test.ts`, `vorgangsblatt.test.ts`, Mail), auf die neuen Werte, je mit Kontrastprüfung, wo es eine gab.
8. **Doku:** `docs/gestaltung/KERN.md` und `_werkstatt/ausbau/KERN.md` (Farbabschnitt, Bühne als Baustein mit Regeln: wo ja, wo nein), Kopfkommentare in `globals.css` und `area-theme.ts`, `src/components/visual/README.md`, falls es die Farbe nennt.

## Grenzen
- Nichts an Inhalt, Aufbau, Reihenfolge, Texten (außer Farbnamen), Preisen, Rechtstexten, Formularverhalten (G9). Die Eingangsinszenierung und der Hub behalten Aufbau und Bewegung (A-052, A-069); es ändert sich nur die Farbe.
- Zeichnungen: `src/components/visual/generators/**` fasst du nicht an. Sie nutzen Token-Klassen und folgen der Bühne von selbst; findest du dort einen festen Farbwert, melde ihn als OFFENE FRAGE.
- Keine neue Abhängigkeit, keine Bilddatei, keine Schriftdatei, keine neue Bewegung (G7); nur CSS. `prefers-reduced-motion` und der Schalter „Bewegung: ruhig“ arbeiten wie vorher. Kein Springen des Layouts (CLS bleibt 0), kein Verlauf, der Text unlesbar macht.
- Kein Lila, kein Indigo, keine Notdienst-Optik, kein Neon. Die hellen Lichter sind ein ruhiges Eisblau, sparsam.
- Fokus: Der Fokusring ist auf heller Fläche und auf der Bühne überall sichtbar (mindestens 3:1 gegen die Fläche, auf der er liegt).
- Druck: Druckansichten und PDF bleiben hell mit dunkler Schrift; die Bühne druckt nicht als dunkle Fläche (`@media print`).

## Stand der Regeln (vom Orchestrator, A-068 bis A-073)
- Schrift: kleinste Textstufe 14 px, auch in Zeichnungen (`schriftstufen.test.ts`).
- Überlauf: Freier Text in schmalen Zellen muss umbrechen können.
- Was im Browser landet (A-071): keine Serverlogik in Dateien, die Client-Bausteine importieren; das Skript-Gewicht der Seiten darf nicht steigen (dieses Paket ändert nur CSS und Klassen).
- Tutorials (A-073): Bild eines Schritts unter dem Text; nicht anfassen.

## Arbeitsweise
Du arbeitest im Arbeitsbaum; kein anderes Paket läuft. Du darfst bauen (`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npm run build`, vorher `SM24_INDEXIERUNG=an` setzen wie in `werkzeuge/abnahme.sh`) und den Prüfserver über `bash _werkstatt/ausbau/werkzeuge/server.sh stop|start` auf Port 3000 starten. Den Messstand auf Port 3200 (Stand vor diesem Paket, orange) fasst du nicht an; er ist dein Vergleich. Im Browser (Playwright ist installiert, Skripte unter `_werkstatt/ausbau/protokolle/FA-FARBE-01/`, schreiben über `sicher.sh --json --als-root`) prüfst du mindestens bei 390 und 1280 px: Startseite, eine Bereichsseite (`/autoschluessel`), eine Leistungsseite, `/schluessel-nach-code`, `/shop`, einen Konfigurator, ein Formular (`/autoschluessel/anfrage`, nichts absenden, G5), `/ratgeber`, ein Tutorial, `/rechtliches/impressum`, eine Ortsseite, die 404-Seite: je ein Bild des ersten Bildschirms und der ganzen Seite, Menü aufgeklappt, Schublade am Telefon offen, Fokus per Tastatur auf Kopfzeile, Kachel und Schaltfläche (Ring sichtbar). Sieh dir die Bilder an, bevor du fertig meldest, und nenne im Bericht, was du gesehen hast. Miss den Kontrast im Browser dort, wo Text auf dem Licht steht (berechnete Farben).
Kein git, keine Formularsendung, keine fremden Seiten.

## Schreibrechte
`src/app/(site)/globals.css`, `tailwind.config.ts` (nur falls für die Bühne nötig), `src/lib/visual/area-theme.ts` und Test, `src/components/layout/**`, `src/components/ui/card.tsx` und weitere Bausteine unter `src/components/ui/**`, soweit sie feste helle oder dunkle Klassen tragen, der Hub der Startseite und seine Bausteine (nur Klassen), `src/app/(site)/layout.tsx` und `layout.test.ts`, `src/app/global-error.tsx`, `src/app/icon.svg`, `src/app/(payload)/custom.css`, `src/payload/components/Marke.tsx`, `src/lib/druckansichten.ts`, `src/lib/mail/html.ts`, `src/lib/pdf/erzeuge-pdf.ts`, `src/lib/og/**`, die zugehörigen Tests, Seiten unter `src/app/(site)/**` nur für Klassen der Bühne und für Farbnamen im Text, `docs/gestaltung/KERN.md`, `_werkstatt/ausbau/KERN.md`, `src/components/visual/README.md`, `_werkstatt/ausbau/berichte/FA-FARBE-01.md`, `_werkstatt/ausbau/protokolle/FA-FARBE-01/**`.
Nicht anfassen: `src/components/visual/generators/**`, `src/payload/collections/**`, `src/migrations/**`, `content/**`, `src/lib/data/**`, `package.json`, `next.config.ts`, Rechtstexte, Preise.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`, Build wie oben. Alles grün, bevor du zurückgibst; nenne Zahlen.

## Bericht (`_werkstatt/ausbau/berichte/FA-FARBE-01.md`)
Tabelle der Tokens (hell und Bühne) mit Hex und gemessenen Kontrasten; Liste der Stellen, an denen die Bühne steht, mit Baustein; Liste der festen Farbwerte, die du gefunden und umgestellt hast; Texte mit Farbnamen; was du im Browser gesehen hast (je Seite ein Satz, Pfade der Bilder); offene Punkte (zum Beispiel Stellen, an denen ein Foto oder das alte Logo mit der neuen Farbe nicht zusammengeht).

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · GEMEINSAME DATEIEN · PRÜFUNG UND ERGEBNIS · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-FARBE-01 · BEREIT ZUR RÜCKGABE ===
