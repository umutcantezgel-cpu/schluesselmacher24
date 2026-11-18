# Bericht FA-FARBE-01 · Dunkelblau statt Orange, dunkle Bühne

Auftrag vom 17.11.2026 (A-074): „Statt Orange wollen wir jetzt dieses Dunkelblau. Einfach visuell auffallen, cinematografisch.“
Umgesetzt mit den Werten aus der Paketdatei, nachgerechnet mit `area-theme.ts`. Kein git.

## GEÄNDERTE DATEIEN
- `src/lib/visual/area-theme.ts`: `MARKENBLAU` (exportiert) statt `MARKENORANGE`, `MARKEN_FARBTON` 262, `ABSTUFUNG` accent L 0,52 / C ≤ 0,17, strong L 0,36 / C ≤ 0,13, Kopfkommentar
- `src/lib/visual/area-theme.test.ts`: Regeln für Dunkelblau, „kein Orange“, „24“, Flächen `surface-muted`/`surface-sunken`, neuer Block „Bühne“
- `src/app/(site)/globals.css`: Kopfkommentar, `--primary*`, `--ring`, neuer Baustein `.buehne` / `.buehne-licht` (in `@layer base`, `@media screen`)
- `src/components/layout/site-header.tsx` (Leiste in `div.buehne`), `page-header.tsx`, `site-footer.tsx`, `mobile-action-bar.tsx`, `section.tsx` (`tone="ink"` → Bühne, `inverse` ohne Wirkung, als veraltet markiert)
- `src/components/ui/card.tsx` (`variant="ink"` → Bühne)
- `src/components/hub/intent-hub.tsx` (nur Klassen)
- `src/app/(site)/layout.tsx` (`themeColor` `#09142f`) und `layout.test.ts`
- `src/app/global-error.tsx` und `global-error.test.ts`, `src/app/icon.svg`, `src/app/(payload)/custom.css`, `src/payload/components/Marke.tsx`
- `src/lib/druckansichten.ts`, `src/lib/mail/html.ts`, `src/lib/pdf/erzeuge-pdf.ts`, `src/lib/pdf/vorgangsblatt.test.ts`, `src/lib/og/bereichsbild.test.ts`
- `docs/gestaltung/KERN.md`, `_werkstatt/ausbau/KERN.md`, `src/components/visual/README.md`
- `_werkstatt/ausbau/protokolle/FA-FARBE-01/` (sichtpruefung.mjs, fokus-probe.mjs, messung.json, build.log, bilder/)

## WAS UND WARUM

### Tokens auf hellem Grund (ersetzen das Orange eins zu eins)
| Rolle | Token | OKLCH | Hex | gemessen |
|---|---|---|---|---|
| Text und Aktion | `--primary`, `strong` | 0.36 0.13 262 | #123780 | 11,12:1 auf Weiß, 10,23 auf surface-muted, 9,26 auf surface-sunken, 9,90 auf soft; Weiß darauf 11,12:1 |
| Hover | `--primary-hover` | 0.29 0.11 262 | #092661 | Weiß darauf 14,36:1 |
| Grafik, „24“ | `accent`, `--area` | 0.52 0.17 262 | #2e62c9 | 5,67 auf Weiß, 5,21 auf surface-muted, 4,72 auf surface-sunken; 2,83 gegen die Tinte |
| Fokusring | `--ring` | 0.58 0.19 262 | #3672e9 | 4,42 auf Weiß, 4,06 auf surface-muted, 3,68 auf surface-sunken |
| helle Fläche | `soft`, `--primary-soft` | 0.96 0.018 262 | #ebf2fe | strong darauf 9,90 |
| zarte Füllung | `muted` | 0.9 0.047 262 | #cddffe | dekorativ |
Alle im sRGB-Farbraum, HSL-Ton etwa 220°, also kein Indigo nach A-005.

### Bühne (`.buehne`, neu belegt)
| Token | OKLCH | Hex | gemessen (Grund / Karte / gedeckt / hellste Stelle des Lichts) |
|---|---|---|---|
| `--background` | 0.2 0.055 264 | #09142f | – |
| `--surface`, `--card`, `--popover` | 0.255 0.065 264 | #122142 | – |
| `--surface-muted`, `--muted` | 0.28 0.07 264 | #17274b | – |
| `--surface-sunken`, `--surface-ink` | 0.15 0.04 264 | #040a1c | – |
| `--licht` (hellste Stelle) | 0.36 0.13 262 | #123780 | – |
| `--foreground` | 0.985 0.004 255 | #f8fafd | 17,41 / 15,20 / 14,08 / 10,65 |
| `--foreground-muted` | 0.86 0.03 255 | #c4d2e5 | 11,90 / 10,38 / 9,62 / 7,27 |
| `--foreground-subtle` | 0.76 0.04 255 | #a0b3cb | 8,48 / 7,41 / 6,86 / 5,19 |
| `--border` | 0.36 0.07 264 | #2a3c62 | Trennlinie, dekorativ |
| `--border-strong`, `--input` | 0.64 0.07 258 | #728eb7 | 5,40 / 4,72 / 4,37 / 3,31 |
| `--primary` | 0.84 0.09 235 | #8fd5fd | 11,30 / 9,87 / 9,14 / 6,91; Schrift `--primary-foreground` (= Grund) darauf 11,30 |
| `--primary-hover` | 0.9 0.055 235 | #bce5fe | 13,62 / 11,89 / 11,01 / 8,33 (Richtwert 0.9 0.06 lag außerhalb sRGB) |
| `--area` | 0.78 0.12 235 | #61c3f9 | 9,27 / 8,09 / 7,49 / 5,67 |
| `--area-strong` | 0.86 0.08 235 | #9ddafe | 12,04 / 10,51 / 9,74 / 7,37 |
| `--ring` | 0.8 0.11 235 | #71c9fa | 9,91 / 8,66 / 8,02 / 6,06 |
| `--area-soft`, `--primary-soft` | 0.3 0.08 264 / 0.3 0.08 264 | #192b55 | Füllung |
| `--area-muted` | 0.36 0.09 264 | #243b6c | Füllung |
| `--secondary` / `-foreground` | 0.3 0.07 264 / 0.985 0.004 255 | | ≥ 4,5 |
| Status hell: success 0.82 0.12 159.8, warning 0.84 0.1 62.2, danger/destructive 0.78 0.12 25.4, Teal accent 0.82 0.08 209.4, info 0.86 0.03 255; je `-soft` L 0,28–0,3 | | | alle ≥ 4,5 auf ihrer `-soft`-Fläche, Grund, Karte, gedeckter Fläche und Licht (Test) |
| `--shadow-color` | 0.1 0.03 264 | | – |
Licht: `radial-gradient(ellipse 85% 130% at 100% 0%, oklch(var(--licht)) 0%, oklch(var(--background)) 60%, oklch(var(--surface-sunken)) 100%)` – nur Tokens, kein Bild, keine Bewegung, kein Filter.
Gegen `[data-area]`: `.buehne, .buehne[data-area], .buehne [data-area]` belegen `--area*`, `--leuchten`, `--leuchten-druck` neu (Spezifität 0,2,0 gegen 0,1,0). Im Browser belegt: auf allen 24 Ansichten trägt jedes `[data-area]` in einer Bühne dieselben `--area`-Werte wie die Bühne (`messung.json`, Feld `fehlt` überall leer). Im gebauten CSS steht `.buehne` in der Basisschicht vor den Hilfsklassen (Position 9400 gegen `.bg-surface` 34595), Hilfsklassen wie `bg-surface` gewinnen also wie gewünscht.
Druck: Der Block steht in `@media screen`; mit `emulateMedia print` ist jede Bühne durchsichtig mit Tinte `0.2497 0.0366 266` (gemessen).

### Wo die Bühne steht
| Stelle | Baustein | Licht |
|---|---|---|
| Kopfzeile (die Leiste) | `site-header.tsx`, `div.buehne` um `shell-wide` | nein |
| Erster Bildschirm Startseite | `hub/intent-hub.tsx`, `section.buehne.buehne-licht` | ja |
| Seitenkopf | `layout/page-header.tsx` | ja bei `art="erzaehl"`, ruhig ohne Licht bei `art="arbeit"` |
| Fuß | `layout/site-footer.tsx` (vorher `bg-surface-sunken`) | nein |
| Aktionsleiste Telefon | `layout/mobile-action-bar.tsx` | nein |
| dunkle Bänder | `Section tone="ink"`, `Card variant="ink"` (beide im Bestand derzeit ohne Nutzer) | nein |
Entscheidung Menüs: Megamenü und Schublade bleiben helle Flächen (Inhalt außerhalb des `div.buehne`). Begründung: lange Listen mit Laienerklärungen lesen sich hell ruhiger, Übergang ist klar (Rand und `shadow-overlay`), Kontrast und Fokus des hellen Satzes gelten unverändert. Seitenkopf in Abläufen, Warenkorb, Kasse ist auf der Bühne (Paket: „auf allen Seiten“); der Formular-/Kasseninhalt darunter bleibt hell.

### Feste Farbwerte gefunden und umgestellt
- `globals.css` `--primary` 0.555 0.168 41 → 0.36 0.13 262, `--primary-hover` 0.495 0.15 41 → 0.29 0.11 262, `--primary-soft` 0.96 0.018 41 → 0.96 0.018 262, `--ring` 0.62 0.185 41 → 0.58 0.19 262
- Klassen auf der Bühne: `bg-surface` in Kopf, Hub, Seitenkopf, Aktionsleiste → `buehne`; `bg-surface-sunken` im Fuß → `buehne`; `bg-surface-ink text-foreground-inverse` (Section ink), `bg-surface-ink border-surface-ink text-foreground-inverse` (Card ink), `text-primary-soft` / `text-foreground-inverse` / `text-foreground-inverse/70` (SectionHeading `inverse`) → Bühnen-Tokens. Weitere feste Klassen (`bg-white`, `text-white`, feste `oklch(…)`, Hex) gibt es in Layout, UI, Hub, Inszenierung, Vertrauen, Rubrik keine. `bg-surface-ink/40` (Schleier der Schublade) bleibt, liegt nicht auf der Bühne.
- `global-error.tsx`: `primaer` → `oklch(0.36 0.13 262)`, neu `marke` `oklch(0.52 0.17 262)` für die „24“
- `icon.svg`: Grund #0f172a/#1e293b → #09142f/#122142, Rand #334155 → #2a3c62, Schlüssel #fb8559/#dd530f → #b8e5ff/#61c3f9, Kern #fbd4c7 → #8fd5fd
- `(payload)/custom.css`: #c04606/#a43b04/#fdeee9/#fbd4c7 → #123780/#092661/#ebf2fe/#cddffe
- `payload/components/Marke.tsx`: Fläche #c04606 → #123780, Kern #fbd4c7 → #8fd5fd, „24“ #c04606 → #2e62c9
- `druckansichten.ts`: Linie und Druckknopf #c04606 → #123780, „24“ → #2e62c9
- `mail/html.ts`: `linie` → #123780, `hinweis` #FDEEE9 → #EBF2FE, neu `marke` #2e62c9 für die „24“
- `pdf/erzeuge-pdf.ts`: `primaer` → #123780, neu `marke` #2e62c9 für die „24“
- `layout.tsx` `themeColor` #fafbfd → #09142f (Farbe der Kopfzeile)
- `src/lib/og/**`: keine festen Werte; liest Tokens, folgt von selbst (Bild bleibt hell).
- Generatoren (`src/components/visual/generators/**`): Suche nach Hex und `oklch(` außerhalb der Tests ohne Fund.

### Texte mit Farbnamen
Suche nach „orange“ in `src`: kein sichtbarer Text nennt die Farbe (nur „vorangehen“, „vorangestellt“ als Wortbestandteil). Nur Kommentare und Testnamen, angepasst. In Rechtstexten, Preisen, Firmendaten keine Farbe gefunden.

## GEMEINSAME DATEIEN
`globals.css`, `site-header.tsx`, `page-header.tsx`, `site-footer.tsx`, `layout.tsx`, `area-theme.ts`, `KERN.md` (beide). In `_werkstatt/ausbau/KERN.md` steht der Änderungseintrag als „(2.7, Vorschlag; Nummer setzt der Orchestrator)“ am Ende.

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run`: 274 Dateien, 4296 Tests, alle grün (area-theme.test.ts allein 90).
- `npm run typecheck`: ohne Fehler. `npm run lint`: ohne Befund.
- Build (`SM24_INDEXIERUNG=an`): erfolgreich, 190/190 statische Seiten (`protokolle/FA-FARBE-01/build.log`).
- Browser (Prüfserver Port 3000, Attrappen, „ruhig“): 12 Ansichten × 390 und 1280 px. Kleinster gemessener Textkontrast auf einer Bühnenfläche 8,48:1, auf der hellsten Stelle des Lichts 5,19:1 (`foreground-subtle`, Brotkrumen), kein Text unter 4,5:1; `[data-area]` überall mit Bühnenwerten; CLS 0 auf allen Seiten außer 404 (0,017 bei 390, 0,011 bei 1280, siehe offene Fragen). Fokus: Kopfzeilen-Links und -Knöpfe, „Termin anfragen“, Hub-Kacheln zeigen Ring `oklch(0.8 0.11 235)` mit Versatz im Grund (`fokus-probe.mjs`).

## BELEGE (gesehen)
Bilder unter `_werkstatt/ausbau/protokolle/FA-FARBE-01/bilder/` (`<seite>-<breite>-erster|ganz|fokus.png`, `menue-1280.png`, `schublade-390.png`, `kachel-fokus-tab-1280.png`).
- Startseite: Kopf und Hub dunkelblau, Licht oben rechts, Kacheln als etwas hellere Karten mit eisblauen Icons, Zeichnung der Inszenierung eisblau auf der Bühnenkarte, Telefonnummer eisblau; ab „Autoschlüssel nachmachen“ hell mit dunkelblauen Knöpfen; Fuß dunkel.
- `/autoschluessel`: Seitenkopf auf der Bühne mit Licht, Schlüsselarten-Zeichnungen eisblau, Kennzahlen-Schriftfeld mit dunklen Linien lesbar; Ablauf darunter hell.
- Leistungsseite, `/schluessel-nach-code`, `/shop`, `/ratgeber`, Tutorial, Ortsseite: gleiches Muster, Kopf dunkel mit Licht, Inhalt hell, Links und Knöpfe im Markenblau.
- Konfigurator und `/autoschluessel/anfrage`: kompakter dunkler Kopf ohne Licht, Ablauf, Fortschritt und Felder hell; nichts abgesendet.
- `/rechtliches/impressum` und 404: eigene Köpfe (kein `PageHeader`), bleiben hell; Kopfzeile und Fuß dunkel.
- Menü (1280): helles Megamenü unter der dunklen Leiste, aktiver Eintrag eisblau mit Strich. Schublade (390): hell, Hauptknopf dunkelblau mit weißer Schrift.
- Fokus: eisblauer Ring mit dunklem Abstand auf Kachel und Kopfzeile deutlich sichtbar.

## OFFENE FRAGEN
- 404 meldet CLS 0,017 (390) bzw. 0,011 (1280). Diese Ansicht trägt keine Bühne außer Kopf und Fuß, die Höhen haben sich nicht geändert; der Vergleich mit dem Messstand auf Port 3200 war nicht möglich (`net::ERR_FAILED`, Messstand lief nicht oder ist für die Attrappen gesperrt). Bitte gegen 3200 nachmessen.
- `src/app/manifest.ts` (`theme_color`/`background_color` = helles `--background`) und `src/app/apple-icon.tsx` (Grund #0f172a, ohne Markenfarbe) liegen außerhalb der Schreibrechte; `favicon.ico` ist eine Binärdatei (keine Bilddatei erlaubt) und zeigt vermutlich noch die alte Farbe. Soll der Orchestrator sie nachziehen?
- `--warning` der Bühne liegt bei 0.84 0.1 62.2 (#fabc86, ein heller Pfirsichton). Warnungen kommen auf der Bühne nur im Redaktionshinweis des Fußes vor (nur außerhalb der Produktion).
- `SectionHeading` behält die Prop `inverse` ohne Wirkung (veraltet); entfernen, sobald gewünscht.
- Das alte Logo (G9) wurde nicht berührt; die Wortmarke ist Text und trägt die „24“ jetzt eisblau auf der Bühne.

## FÜR MENSCHEN
- Abnahme des Bilds durch den Inhaber: Dunkelblau als Markenfarbe, dunkler Kopf, Hub und Fuß (Bilder im Ordner oben). Den Farbton verschiebt man an einer Stelle (`MARKENBLAU` in `area-theme.ts`, `--primary*`/`--ring` und `.buehne` in `globals.css`).
- Favicon (`favicon.ico`) und Apple-Icon in der neuen Farbe brauchen eine Bilddatei bzw. eine Freigabe.

## Nachbesserung (Gegenprüfung, 17.11.2026)
| # | Befund | Ergebnis | Begründung und Änderung |
|---|---|---|---|
| 1 | Herstellerlogo auf der dunklen Bühne (`hersteller-marke.tsx`) | behoben | Trifft zu: `HerstellerMarke` steht im `PageHeader` der Herstellerseite, ein dunkles oder durchsichtiges Logo verschwände auf `0.2 0.055 264`. Neues Token `--plakette` (`1 0 0`) in `:root` und bewusst gleich in `.buehne`, Tailwind-Farbe `plakette` (`tailwind.config.ts`); das Logo liegt jetzt auf `rounded-md bg-plakette p-1.5`, das Außenmaß `h-12 w-24` bleibt (kein Springen, auch nicht in der hellen Liste auf `/schluessel-nach-code`). Test in `area-theme.test.ts` („Plakette … bleibt auf der Bühne hell“): Weiß in beiden Sätzen, Tinte darauf ≥ 4,5:1, Plakette gegen Grund, Karte, gedeckte Fläche und Licht ≥ 3:1. Im gebauten CSS belegt (`.bg-plakette`, `--plakette` in `.buehne`). Doku in `docs/gestaltung/KERN.md`. |
| 2 | `manifest.ts` `theme_color` hell, `viewport.themeColor` dunkel | nicht behoben, offen | Trifft zu, aber `src/app/manifest.ts` und `manifest.test.ts` liegen außerhalb der Schreibrechte dieses Pakets, und eine Freigabe liegt nicht vor. Vorschlag für den Orchestrator unverändert: `theme_color` aus dem `.buehne`-Block lesen (wie `layout.test.ts`), `background_color` hell lassen, Test `theme_color === viewport.themeColor` in `manifest.test.ts`. |
| 3 | KERN.md: Bühnen-Abschnitt zwischen den Unterpunkten von „Farben (Bestand)“ | behoben | Trifft zu. Die Regeln „`foreground-subtle` nie auf `surface-sunken`“ (ergänzt um „heller Satz“) und „Etiketten in `foreground-muted`“ stehen wieder unter „Farben (Bestand, bleiben)“, der Abschnitt „Markenblau und Bühne“ folgt danach. |
| 4 | Kommentar in `page-header.tsx` nennt Rechtstexte | behoben | Trifft zu: `rechtliches/*` nutzt keinen `PageHeader` (Suche ohne Fund). Kommentar lautet jetzt „(Abläufe, Warenkorb, Kasse) … Rechtstexte haben eigene helle Köpfe (kein PageHeader)“. |
| 5 | wie 3 (Zeilen 80–87) | behoben | Derselbe Befund wie 3, mit derselben Änderung erledigt. |
| 6 | Ring und Hover nur über Farbton geprüft | behoben | Trifft zu. `MARKEN_HOVER = '0.29 0.11 262'` und `MARKEN_RING = '0.58 0.19 262'` in `area-theme.ts` exportiert; der Test prüft `token('primary-hover')` und `token('ring')` wieder exakt (dazu Hex #092661 und #3672e9), die Farbton- und Kontrastprüfungen bleiben. |

Geänderte Dateien der Nachbesserung: `src/lib/visual/area-theme.ts`, `src/lib/visual/area-theme.test.ts`, `src/app/(site)/globals.css`, `tailwind.config.ts`, `src/app/(site)/schluessel-nach-code/hersteller-marke.tsx`, `src/components/layout/page-header.tsx`, `docs/gestaltung/KERN.md`, dieser Bericht, `protokolle/FA-FARBE-01/build-nachbesserung.log`.

Prüfung nach der Nachbesserung (über `sicher.sh --json`): vitest 274 Dateien, 4297 Tests grün (+1 Plakette); `npm run typecheck` ohne Fehler; `npm run lint` ohne Befund; Build mit `SM24_INDEXIERUNG=an` erfolgreich, 190/190 statische Seiten. Kein Browserlauf für die Plakette: Logos kommen nur aus dem Backend mit Haken „Freigabe liegt vor“, der JSON-Bestand (`defaults/hersteller.ts`) trägt keine; ohne Logo zeigt die Stelle den Namen als Text.

## Abnahme durch den Orchestrator (17.11.2026)

**Ergebnis: abgenommen.** Die Seite trägt Dunkelblau statt Orange und die dunkle Bühne an den festgelegten Stellen; nichts ist verrutscht, nichts ist unlesbar. Auf main geht der Stand erst auf Anweisung des Nutzers.

Vom Orchestrator bei der Abnahme ergänzt:
- **Browserleiste und iOS-Symbol:** `theme_color` im Manifest ist jetzt die Farbe der Kopfzeile (#09142f, wie `viewport.themeColor`), `background_color` bleibt hell; Test vergleicht beide Stellen. Der Grund des Apple-Symbols ist #09142f. `favicon.ico` zeigt schon seit dem Bestand einen blauen Schlüssel auf dunklem Grund und bleibt.
- **Kopf der Fehleransicht (404, Fehlergrenze) auf der Bühne**, mit Licht; die Liste der Bereiche darunter bleibt hell. Die Seite ist dadurch 17 px (Telefon) und 52 px (Desktop) höher.
- **Feste Formularleiste am Telefon auf der Bühne** (`max-md:buehne`), wie die Aktionsleiste der Seite; ab Tablet steht sie unverändert hell im Formular. Dafür steht der Baustein `.buehne` jetzt in der Schicht „components“ (Tailwind erzeugt nur so die Variante); Reihenfolge und Wirkung sonst gleich.
- **Hover der hellen Schaltfläche auf der Bühne** deutlicher (`--primary-hover` 0.93 0.035 235 statt 0.9 0.055 235; Schrift darauf 14,9:1).
- Vier neue Tests in `area-theme.test.ts` halten Schicht, Formularleiste, Fehleransicht und Hover fest. `_werkstatt/ausbau/KERN.md` ist Version 2.7.
- Die 77 Bilder des Baumeisters (23 MB) liegen nicht im Repository; die Skripte und `messung.json` bleiben unter `protokolle/FA-FARBE-01/`.

Geprüft:
- Kette `abnahme.sh FA-FARBE-01`: Typprüfung, Lint, Unit-Tests, Datenbanktests, Build grün (Zahlen in STATUS.md).
- **Sichtprüfung:** 227 Bilder (32 Seitentypen bei 1280 und 390 px, je erster Bildschirm und Seitenende, sieben Seiten ganz; alle fünf Menüs offen, Schublade, 18 Fokusbilder, Hover, Druck, Start mit Bewegung) von zwölf unabhängigen Prüfern (Opus) angesehen, jeder Befund von einem zweiten am Bild gegengeprüft: 39 gemeldet, 30 bestätigt, 9 widerlegt, **kein roter**. Kein Rest von Orange, Fokusring überall sichtbar, Druck hell.
- **Kontrast (Lighthouse, Kategorie Zugänglichkeit, mobil und Desktop):** 17 Seiten je 100 Punkte, keine durchgefallene Prüfung. Die 404-Seite lässt sich so nicht prüfen (Antwort 404); sie ist in der Sichtprüfung enthalten.
- **Lagevergleich mit dem Stand davor** (Messstand, 33 Seiten bei 390 und 1280 px, Lage und Größe jedes Elements): auf 64 von 66 Ansichten ist der einzige Unterschied ein zusätzliches Element in der Kopfzeile (Hülle der Bühne, gleiche Maße); nichts ist verschoben. Die zwei übrigen sind die Fehlerseite (gewollt, siehe oben).
- Funktionsproben am neuen Build: Menü 19 von 19, Tutorials 10 von 10, Ortsseite 24 von 24. Überlauf (144 Seiten, drei Breiten): nur die drei bekannten Funde des Bestands. Schrift der Zeichnungen: keine unter 14 px. Onpage: 144 Seiten, Median 100, kein Befund. `reste.mjs`: nur die zehn bekannten Stellen im Partnervertrag.
- **Gewicht** (am frisch gestarteten Server, gleiche Reihenfolge): Skripte der neun Ansichten wie vorher (Assistent 18 Skripte und 277,2 KB; Ort und Kontakt je 0,1 KB mehr); HTML je Seite 2,6 KB mehr (0,7 KB komprimiert), davon 1,3 KB für die Bühne im eingebetteten CSS.
- **Layoutsprung auf der 404-Seite** (offene Frage des Baumeisters): 0,0166 bei 390 px und 0,0109 bei 1280 px, im Stand davor genau gleich. Nicht aus diesem Paket; vorgemerkt.

Entschieden zu den gelben Hinweisen der Sichtprüfung:
- Seitenköpfe der Arbeitsansichten (Assistent, Konfiguratoren, Warenkorb, Kasse, Terminstatus) stehen flach ohne Licht: gewollt. Diese Köpfe waren schon vorher niedriger und ohne Profillinie; die Bühne bleibt dort ruhig, das Licht gehört den erzählenden Seiten.
- Heller Kopf der 404-Seite und helle Formularleiste über dunkler Fläche: behoben (oben).
- Hover der hellen Schaltfläche kaum sichtbar: behoben (oben).
- Zeichnung im leeren Warenkorb mit dunkler Kontur und zarter blauer Linie: Stil der Zeichnungen im Bestand (Kontur in Tinte, Akzent als Detail), unverändert.

Beobachtungen am Bestand aus der Sichtprüfung (alle schon vor diesem Paket so, der Lagevergleich belegt es; für einen späteren Feinschliff):
1. Bereichsseite Autoschlüssel, Markenkacheln: bei „Mercedes-Benz“ sitzt der Pfeil 8 px vor dem Rand (sonst 22 px).
2. Menü „Sperrschließungen“, Kasten „Nächster Schritt“: Der Pfeil bricht allein in eine eigene Zeile.
3. Brotkrumen: Der Fokusring liegt eckig und ohne Abstand am Text (sichtbar, aber anders als an Menü und Kacheln).
4. Seitenköpfe „Schlüsselverlust“, „Motorrad“, „Sicherheitstechnik“: nur ein kleines Icon rechts, die rechte Hälfte wirkt leer; andere Köpfe tragen eine Zeichnung.
5. Türzeichnung im Kopf von „Tür- und Schließtechnik“: Die Nummernkreise 1, 3 und 4 liegen auf den Linien.
6. Service und Termin: In der Ablaufzeichnung stehen fünf Beschriftungen auf drei Zeilen gestaffelt; in der Kennzeile steht ein Icon vor dem Maßzeichen, die Profillinie beginnt unter dem Icon.
7. Gleichschließende Zylinder, Abschnitt „Messhilfe“ (Desktop): Neben den Schritten 02 bis 04 bleibt die rechte Spalte leer, die Zeichnung rollt weg. Am Telefon umbrechen die „Abgefragten Maße“ je Bauform verschieden.
8. Assistent am Telefon: große leere Fläche zwischen Formularende und „Passende Seiten“.
9. Fuß am Telefon: Mehrzeilige Einträge der zweispaltigen Linkliste stehen dicht, die Nachbarspalte wirkt versetzt.
10. Ratgeber „Zylinder richtig ausmessen“ am Telefon: Die Maßbeschriftung „A 30 B 30“ steht eng an der Mittellinie.
11. Zeichnungen in Seitenköpfen stehen teils im gerahmten Kasten (Standorte), teils frei (Ortsseite, Ratgeber).
12. Rechtliches: In der Leiste der Rechtsseiten ist die aktuelle Seite nicht hervorgehoben.
13. 404-Seite: Layoutsprung 0,011 bis 0,017 beim Laden.

## Nachtrag 18.11.2026: heller Hintergrund (A-078)

Der Nutzer hat die dunklen Flächen abgelehnt („Ich möchte einen hellen Hintergrund. Das sieht sehr unprofessionell aus, wenn alles so dunkel ist.“). Geändert durch den Orchestrator:
- Kopfzeile, Seitenkopf, Fehleransicht und Manifest stehen wieder in der Fassung vor diesem Paket (hell); Fuß (`bg-surface-sunken`), Aktionsleiste am Telefon, erster Bildschirm der Startseite und feste Formularleiste (`bg-surface`) tragen wieder ihre hellen Flächen. `themeColor` und `theme_color` sind wieder der helle Seitenhintergrund (#fafbfd).
- Die „24“ der Wortmarke trägt in der Kopfzeile die Grafikfarbe (`text-area`, #2e62c9; 5,7:1 auf Weiß, 2,8:1 gegen die Tinte).
- Das Markenblau und alle umgestellten Farbkopien bleiben. Die Bühne bleibt als Baustein für dunkle Bänder im Quelltext; keine Seite nutzt sie.
- Tests: sieben Bausteine stehen nachweislich nicht auf der Bühne und tragen helle Flächen; Browserleiste gleich Seitenhintergrund; die „24“ hebt sich ab.
Die Abschnitte oben zu den Stellen der Bühne und zur Sichtprüfung der dunklen Flächen beschreiben den Stand vom 17.11. und gelten für die Seite nicht mehr. Prüfung des hellen Stands: in STATUS.md und ENTSCHEIDUNGEN A-078.

