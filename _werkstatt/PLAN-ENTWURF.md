# MASTER-AUFTRAG · SCHLÜSSELMACHER24 · Ausführungsplan

## Kontext
Der Mensch hat den MASTER-AUFTRAG erteilt. Ziel: die Website und den Shop SCHLÜSSELMACHER24 in Gestaltung, Bewegung, SVG-Grafik, Bedienung und Technik sichtbar auf Spitzenniveau heben. Dabei bleibt das eigene System die Grundlage: Next 16, React 19, Tailwind 3 mit HSL-Tokens und Payload 3. Der Bestand muss grün bleiben, und es gibt keine Rückfragen.

Der Planmodus vertritt hier die FREIGABE. Nach der Bestätigung läuft der Auftrag autonom von E0 bis zum ABSCHLUSS. Die E0-Erkundung ist bereits erledigt, mit fünf Haiku-Kundschaftern und einer Lückenprüfung (Workflow wf_d446b599-810). Die Berichte liegen im Scratchpad unter `e0/*.md` und kommen in E0 nach `_werkstatt/berichte/`.

## Einstellungen (Standardwerte, als Annahmen in STATUS.md)
- VORHABEN, geschärft:
  1. Das vorhandene, aber ungenutzte Grafik- und Bewegungssystem kommt auf jede Seite: Fach-Icons, Generatoren, Bewegungsbausteine.
  2. Eine echte Typo-, Bewegungs- und Formskala ersetzt rund 690 freie Werte. Lucide verschwindet als zweite Icon-Familie.
  3. Die Erzählansichten bekommen je einen großen Moment mit Bedeutung. Die Arbeitsansichten werden ruhiger, zugänglicher und schneller.
- SCHWERPUNKT: alles · BEREICH: ganzes Projekt (Website-Teil; das Payload-Admin ist ausgenommen) · AUSBAU: maximal
- UNANTASTBAR: Logo und Favicon (`icon.svg`, `payload/components/Marke.tsx`), Inhalte der Rechtstexte, Logik in `src/lib/actions/*`, `src/lib/server/*`, `pricing.ts`, `scheduling.ts`, `integrations/`, Payload-Collections, Access und Migrationen. Dazu kommen alle Dateien unter dem Logikwächter (siehe Schutzregeln), unter anderem Kasse, Warenkorb, Bestellung, Assistent und Konfiguratoren. Dort wird nur die Darstellung geändert.
- TEXTE: Mikrotexte direkt ändern, alles andere als Vorschlag in TEXTVORSCHLAEGE.md · FREIGABE: mit der Planbestätigung erteilt · LAUFZEIT: bis Pflicht und Kür erfüllt sind
- ARBEITSBRANCH: `claude/projekt-gestaltung-entwicklung-tofodh` (aktueller Branch, sauber). Push nur dorthin, mit `git push -u origin claude/projekt-gestaltung-entwicklung-tofodh`.
- Modelle:
  - Haiku-Agenten über `Agent`/`Workflow` mit `model: 'haiku'`. Aufwand `high`, bei reiner Fleißarbeit `low`.
  - Opus-Unteragenten mit `model: 'opus'` nur für das Etappentor der Referenz und die Endprüfung.
  - 4 Haiku-Plätze je Welle. Jede Welle läuft als Workflow mit höchstens 4 Baumeistern und deren Schnellprüfung.
- Umgebung: 4 Kerne, 15 GB RAM, Node 22. Chromium liegt unter `/opt/pw-browsers/chromium-1194`. Google Fonts und npm sind erreichbar. Der Lauf ist **root**; `initdb` von embedded-postgres lehnt root ab, was den DB-Build und die DB-Tests betrifft.

## Lagebild (Kurzfassung der Erkundung)
- **Stack**:
  - Next 16.3.5 (Turbopack, keine `proxy.ts`, keine experimental-Flags), React 19.2.4, TypeScript strict, Tailwind 3.4.
  - Payload 3.90 auf Postgres. Ohne `DATABASE_URL` oder mit `SM24_DATA=json` greift der JSON-Adapter auf `content/`.
  - Vitest: statisch etwa 304 Unit-`it()` plus 52 DB-Tests. Die 680 Unit-Tests aus FORTSCHRITT.md ergeben sich erst mit `.each` und sind noch nicht durch einen Lauf belegt; E0 misst die echte Zahl. ESLint ist vorhanden, Prettier, CI und Playwright fehlen.
  - Commits im Stil `typ(scope): deutsch`.
- **Routen**: 48 `page.tsx`, nur Deutsch, ohne i18n-System. Die Mikrotexte stehen verstreut, zentral nur in `src/lib/navigation.ts` und `flow-shell.tsx`.
- **Designsystem**:
  - Vorhanden sind gute HSL-Tokens und 9 Bereichsfarben (`area-theme.ts` mit Kontrasttest).
  - Es fehlen Skalen für Schrift, Dauer, Kurve, Schatten, z-index und Touch-Ziele.
  - Freie Werte: `text-[11/13/14/15px]` 539-mal, insgesamt etwa 690 freie Klassen; Mindesthöhen 40 bis 56 px uneinheitlich.
  - Es gibt keinen Dunkelmodus, nur eine wirkungslose `darkMode`-Einstellung.
- **Grafik**: 54 Fach-Icons, 5 Generatoren und die Bausteine InView, Reveal, DrawOn und CheckDraw sind **auf keiner Seite genutzt**. lucide-react steckt in 62 Dateien mit 60 Glyphen. 37 `ImagePlaceholder` zeigen „Bild folgt“. Es gibt keinen großen Moment und keine View Transitions.
- **Befunde mit Wirkung**:
  - Bei OptionCard ist der Fokus unsichtbar (`option-card.tsx:57`).
  - Der iOS-Zoomschutz wirkt nicht, weil `text-[15px]` die 16-px-Regel überschreibt.
  - Der Hover-Schatten ist kaputt (`page.tsx:301`, `rgba(var(--primary))` auf ein HSL-Tripel).
  - Der Fortschritt animiert `width` (`flow-shell.tsx:60`).
  - JS-Smooth-Scroll ignoriert reduzierte Bewegung (`use-flow.ts:153`, `anfrage-formular.tsx:373` der Vorlage-Anfrage, `zutritt-konfigurator.tsx:675`).
  - 68 Texte sind kleiner als 12 px.
  - `[Hersteller eintragen]` erscheint als Fakt: `schluessel-nach-code/[slug]/page.tsx:54` zeigt `line.manufacturer`, der Wert kommt aus `content/code-lines.json`.
  - Die mobile Aktionsleiste markiert nur exakte Pfade.
  - tailwind-merge v3 mit Tailwind 3 behandelt eigene `text-*`-Größen vermutlich als Farbe und verwirft sie. Das wird in E0 geprüft; `cn.ts` wird in jedem Fall mit `extendTailwindMerge` erweitert.
- **Tests, die Markup prüfen** (bei Umbau gezielt anpassen, nie lockern): `rechner.test.tsx:43,76`, `bereich-icon.test.tsx:43`, `reveal/draw-on/check-draw.test.tsx`, `icons.test.tsx`, die Generator-Verträge und `area-theme.test.ts`.

## Hauptansichten (E0 festgelegt, danach unveränderlich, 12)
E = Erzählansicht, A = Arbeitsansicht.

| # | Route | Art |
|---|---|---|
| 1 | `/` | E · Referenz |
| 2 | `/autoschluessel` | E |
| 3 | `/autoschluessel/marken/volkswagen/golf` | E |
| 4 | `/autoschluessel/anfrage` | A |
| 5 | `/schluessel-nach-code` | E |
| 6 | `/schluessel-nach-code/ms-01` | E |
| 7 | `/gleichschliessende-zylinder/konfigurator` | A |
| 8 | `/schliessanlagen` | E |
| 9 | `/tuer-und-schliesstechnik` | E |
| 10 | `/warenkorb` | A |
| 11 | `/kasse` | A |
| 12 | `/ratgeber/autoschluessel-verloren-was-tun` | E |

**Hauptaufgaben (K-002)**:
1. Autoschlüssel-Termin mit Anzahlung buchen.
2. Schlüssel nach Code bestellen und über die Kasse abschließen.
3. Zylinder konfigurieren und in den Warenkorb legen.
4. Schlüssel nach Vorlage anfragen.
5. Schließanlagen-Projekt erfassen.
6. Terminstatus prüfen.

## Gestaltungskern (Entwurf für KERN.md · in E1 per Denkprotokoll festschreiben)
- **K-001 Leitidee**: „SCHLÜSSELMACHER24 sieht aus wie eine saubere Werkstattzeichnung: helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift – und an den entscheidenden Stellen fräst eine Linie sichtbar das Profil, damit man Genauigkeit sieht, bevor man sie liest.“
- **K-003 Prinzipien**:
  1. Bemaßt statt behauptet: Zahlen, Maße und Schritte zeigen, keine Floskeln.
  2. Eine Linie, die schneidet: Die Profillinie ist das einzige wiederkehrende Ornament, ohne Verläufe, Glas oder Leuchtkugeln.
  3. Der Bereich zeigt Farbe, die Marke bleibt Stahlblau: Die Akzentfarbe gilt nur im Bereichskontext, Aktionen bleiben primär.
  4. Erzählen, wo man wählt, und ruhig, wo man arbeitet.
  5. Werkstückkanten: 1-px-Haarlinien, kleine Radien, Tiefe durch Flächenstufen statt weicher Riesenschatten.
  6. Mobil ist eine eigene Komposition: Daumenzone, Aktionsleiste, 44-px-Ziele.
  7. Bewegung erklärt Mechanik (Fräsen, Schließen, Signal), höchstens ein gewichtiger Auftritt je Bildschirmhöhe.
- **K-005 Designsystem-Erweiterung** (in `globals.css` und `tailwind.config.ts`):
  - Fließende Typoskala als `fontSize`-Tokens mit `clamp()`: `caption` (mindestens 12 px), `small`, `body`, `lead`, `title-sm`, `title`, `headline`, `display`, `input` (mobil 16 px).
  - Dauern: `instant` 120, `quick` 180, `base` 280, `slow` 400, `enter` 600, `scene` 900 ms.
  - Kurven: `standard`, `enter`, `exit`, `draw`.
  - Schatten: `raised`, `overlay`; z-index: `header`, `drawer`, `overlay`, `skip`.
  - Touch-Ziele `min-h-touch` (44) und `min-h-touch-lg` (52), Messbreite `max-w-measure` (68ch).
  - `hyphens: auto` für Fließtext; `--header-height` wird endlich genutzt.
  - `src/lib/cn.ts` bekommt `extendTailwindMerge` für die neuen Größen, mit neuem Test.
  - Kein Dunkelmodus, weil das Projekt keinen hat. Die Entscheidung kommt in ENTSCHEIDUNGEN.md.
- **K-007 Bewegung**: CSS zuerst über die vorhandenen `sm24-*`-Klassen und Token-Dauern, framer-motion bleibt ungenutzt.
  - Animiert werden nur transform und opacity. Dazu kommen `stroke-dashoffset` und Masken für Linien, die sich zeichnen; beides verändert das Layout nicht.
  - Das Register startet mit etwa 20 Einträgen (B-01 bis B-20), darunter:
    - Fräsbahn im Hero
    - Profillinie
    - Ablauf am Scrollen
    - Reveal
    - Knopfdruck
    - Karten-Hover nur bei feinem Zeiger
    - Drawer
    - Megamenü
    - Akkordeon
    - Flow-Fortschritt per `scaleX` statt `width`
    - Schrittwechsel
    - CheckDraw
    - Seitenwechsel
    - Schließplan
    - Live-Schlüssel
    - Code-Fundstelle
    - Zylinder live
    - Tür-Schutzpunkte
    - Spinner
    - Warenkorb-Zähler
  - `sm24-dash` wird auf unter 5 s begrenzt, sonst wäre ein Pause-Knopf Pflicht. `sm24-float` und `fade-in` sind ungenutzt und entfallen nach der Nutzungssuche.
- **K-008 Formsystem**: Es gibt **eine Familie über die gemeinsame `IconBase`**: Raster 48, runde Enden und Ecken. Die Bildschirmstrichstärke ist einheitlich; die CSS-Regel `.sm24-icon :is(path,circle,rect,line,polyline,ellipse){vector-effect:non-scaling-stroke}` setzt sie für jedes Kindelement. Der Zielwert von 1,75 bis 2 px wird in L-02 am Bild entschieden.
  - Die Fach-Icons bleiben in `visual/icons/` mit Zweiton, ihr Vertrag in `icons.test.tsx` bleibt unverändert.
  - Etwa 35 neue einfarbige UI-Glyphen kommen in `visual/glyphen/`. Sie haben einen eigenen Vertrag in `glyphen.test.tsx`, der die Dateien **selbst findet**. So entsteht keine gemeinsame Liste, und gleichzeitige Grafiker-Pakete kollidieren nicht.
  - Die Zuordnung der 60 lucide-Namen zu SM24-Glyphen oder Fach-Icons steht in K-008.
  - Masken sind nur in Generatoren erlaubt.
  - Generatoren:
    - Sie bekommen eine Strichskala; die Literale in `grafik-basis.tsx` werden auf KONTUR, LINIE und HILFSLINIE zurückgeführt.
    - Neue Generatoren tragen sich in `registry.tsx` und in `registry.test.tsx` (`NAMEN`) ein. Das erledigt Opus am Wellenende über das Feld GEMEINSAME DATEIEN.
    - Helferdateien liegen nie in `generators/`.
    - Generatoren dürfen in Client-Hüllen importiert werden; `visual/README.md` wird dazu angepasst.
  - Leitelement „Profillinie“ (`visual/profillinie.tsx`): eine gestufte Schlüsselbart-Linie, deterministisch aus einem Text erzeugt. Sie dient als Trenner, unterstreicht die Augenbrauen-Zeilen und erscheint im Hero.
- **AUSBAU maximal, Entscheidungen**:
  - Je Erzählansicht ein großer Moment:
    - Start: Fräsbahn plus Ablauf am Scrollen
    - Autoschlüssel: Reihe der Schlüsselarten
    - Code-Shop: Code-Fundstelle interaktiv
    - Produkt: Live-Schlüssel aus dem Code
    - Schließanlagen: interaktiver Schließplan
    - Türtechnik: Tür-Schutzpunkte
    - Ratgeber: bewusst ruhig
  - Seitenwechsel mit gemeinsamen Elementen (Bereichskarte → Bereichskopf) über React `<ViewTransition>`, sofern die Next-16-Doku das bestätigt, als schrittweise Verbesserung.
  - **Kein WebGL oder 3D**: three.js würde das 60-KB-Budget sprengen. Die Stiftzuhaltungs-Szene in SVG zeigt die Marke besser. Das kommt per Denkprotokoll in ENTSCHEIDUNGEN.md.
- **Bildstellen**: Fehlt ein Foto, zeigt `ImagePlaceholder` eine passende Fachgrafik statt des gestrichelten „Bild folgt“. `bild` hat weiter Vorrang. Die fehlenden Fotos stehen in MENSCHEN.md. Es werden keine Fotos erzeugt.

## Schutzregeln für den Bestand (aus L0)
- **Logikwächter** (`_werkstatt/werkzeuge/logikwaechter.mjs`, gebaut mit der TypeScript-Compiler-API des Projekts):
  - Er bildet je Datei einen Fingerabdruck des Nicht-JSX-Codes. Ausgeklammert sind JSX-Ausdrücke im `return`, `className`-Werte, JSX-Textknoten und Icon-Importe.
  - Er gilt für alle Dateien mit Logik, die ein Paket „nur Darstellung“ ändert:
    - `kasse-formular`, `warenkorb-ansicht`, `bestellung/[id]`
    - `assistent`, `projekt-konfigurator`, `zutritt-konfigurator`, `sicherheitscheck`, `konfigurator` (Zylinder)
    - beide `anfrage-formular`, `status-formular`, `bestell-formular`, `artikel-kauf`
    - `cookie-einstellungen`, `photo-upload`
  - Ein abweichender Fingerabdruck führt zur Ablehnung des Pakets.
  - Einzige zugelassene Logikänderung: `behavior: 'smooth'` wird durch `scrollVerhalten()` ersetzt, in `anfrage-formular.tsx:373` (Vorlage) und `zutritt-konfigurator.tsx:675`. Der Logikwächter führt das als benannte Ausnahme, abgedeckt durch den Test in `bewegung.test.ts`.
  - Ausdrücklich unverändert bleiben:
    - alle Hooks
    - die Handler `pruefen`, `absenden` und `handleSubmit`
    - `submit*`/`fetch*`, `verifyAccessToken`, `notFound()` und `connection()`
    - die Speicherschlüssel `sm24-warenkorb`, `sm24:flow:*` und `sm24-cookie-einwilligung`
- **Rechtstexte**:
  - E0 erstellt einen Textabzug aller Seiten unter `rechtliches/*` im gerenderten Zustand, mit Werten aus den Einstellungen.
  - Prüfstufe C vergleicht ihn wortgleich. Mikrotexte bleiben dort tabu.
- **Teständerungen**:
  - Nur mit einer Alt-Neu-Liste im Paketbericht.
  - Die Zahl der Assertions sinkt nie.
  - Reveal und DrawOn bekommen keine neuen Attribute.
  - Zählungen in `schliessplan.test.tsx` bleiben; `markiert` bekommt eigene Fälle.
- **Neue Tests nur für neue Logik**:
  - `cn`-Zusammenführung aller neuen Tokengruppen
  - `istAktiv(pathname, href)` in `src/lib/navigation.ts`
  - `scrollVerhalten(reduziert)` in `src/lib/bewegung.ts`
  - Profillinie und neue Generatoren
  - Glyphen-Vertrag
  - `ImagePlaceholder` mit Rangfolge Bild > Grafik > Ersatzgrafik
  - Charakterisierungstest für den Warenkorb-Store `src/lib/store/cart.ts`, weil sein Ausfall teuer wäre
- **Namen bleiben**: `shell`, `section`, `eyebrow`, `prose-sm24`, `data-area`, `data-motion` und `sm24-*`. Entfällt ein Name, geschieht das nur nach einer Nutzungssuche; Funde behalten einen Alias.

## Abnahmeliste (ABNAHME.md · Kriterium → Pakete)
- **Z-01** Plan → alle Pakete, PLAN.md mit Commit-Kennungen.
- **Z-02** Bestand:
  - Gates je Welle. Build-Gate ist `SM24_DATA=json npx next build`, weil `npm run build` als root an `initdb` scheitert; das ist dokumentiert.
  - DB-Tests über einen Nicht-root-Weg, sofern E0 einen findet; sonst gilt der E0-Stand.
  - Logikwächter, Funktionsliste per Skript, Textabzug.
- **Z-03** Designsystem → L-01 plus die Token-Umstellung in jedem Paket, `werte-suche`.
- **Z-04** Gestaltung → E2 bis E5 plus Sichtabnahmen.
- **Z-05** Bewegung → L-03, Register und Prüfstufe C mit Bildrate bei 4-facher Drosselung.
- **Z-06** Grafik → L-02, Glyphen-Pakete, Generatoren, lucide-Abbau, SVG-Prüfung.
- **Z-07** Zugänglichkeit → B-01 (Fokus der OptionCard), L-05, Tastaturdurchlauf der Hauptaufgaben, axe.
- **Z-08** Leistung:
  - Budget je Paket: neues Client-JavaScript wird im Paket genannt; ein großer Moment braucht kein JavaScript außer einer InView- oder Client-Hülle.
  - Prüfstufe B je Etappe.
  - Das reservierte Paket **L-07 Leistung absichern** beseitigt Rückschritte aus der ersten Etappenmessung, etwa Schrift-Fallback-Metriken oder Bildgrößen.
- **Z-09** Darstellung → Bildsatz in 3 Größen; es gibt nur ein Thema und nur Deutsch.
- **Z-10** Übergabe → BERICHT, KERN, MENSCHEN und Anleitung. Als Pflicht kommt hinzu: README und `visual/README.md` auf den Ist-Stand bringen und UMSETZUNG.md als historisch kennzeichnen.

## Ablauf, Etappen und Pakete
- Kennung `[Etappe]-[ROLLE]-[Nr]`; eigene Pakete heißen `L-xx` (LEITUNG).
- Jedes Haiku-Paket folgt dem Bauplan aus Abschnitt 5. Es enthält eine exakte Dateiliste und eine Lucide→SM24-Tabelle, die nur bei lucide-Verwendung nötig ist. Dazu kommen eine Umrechnungstabelle von freien Werten zu Tokens, die Referenzpfade und ein JS-Budget.
- Die Props-Verträge gemeinsamer Bausteine bleiben in jeder Welle eingefroren.
- **Nur Opus schreibt gemeinsame Dateien**:
  - `globals.css`, `tailwind.config.ts`, `src/lib/cn.ts`, `src/lib/navigation.ts`, `src/lib/bewegung.ts`
  - `visual/registry.tsx`, `registry.test.tsx` (`NAMEN`)
  - `next.config.ts`, `package.json` samt Lock, `src/app/(site)/layout.tsx`
  - `eslint.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`
  - CLAUDE.md und KERN.md

**E0 · Start (≈0,3 Tage)**
- **E0-L-01**:
  - `_werkstatt/` mit allen Dateien aus Abschnitt 7, AUFTRAG.md wortgleich, CLAUDE.md-Block, `_werkstatt/**` in den Ausschlüssen von eslint, tsconfig und vitest.
  - Die Kundschafterberichte aus der Planphase kommen nach `_werkstatt/berichte/E0-KUNDSCHAFTER-01…05.md` und `E1-PRUEFER-L0-*.md`.
  - Commit und Push.
- **E0-PRUEFER-01** (Einrichtung):
  - `npm ci`, dann Build auf drei Wegen:
    1. `npm run build` – als root erwartungsgemäß rot
    2. DB-Weg mit `initdb` über einen Nicht-root-Nutzer
    3. `SM24_DATA=json npx next build` – das Gate
  - Danach `next start`, Typprüfung, Linter und Tests (unit und db).
  - Werkzeuge liegen in `_werkstatt/werkzeuge` mit eigener `package.json`. Die Abhängigkeiten liegen außerhalb des Repos und sind verlinkt: playwright-core passend zu `/opt/pw-browsers/chromium-1194` und @axe-core/playwright.
  - Skripte:
    - `bild`, `bildsatz` (3 Größen, je Bildschirmhöhe, Überlaufprüfung, JPEG ≤1440 px)
    - `messung` (LCP, CLS, INP-Näherung und JS-Menge; Median aus 3; mobil mit 4-facher Drosselung)
    - `a11y` (WCAG 2.2 AA), `bewegung` (reduziert, 5 Einzelbilder, Bildverlust bei 4-facher Drosselung)
    - `konsole`, `werte-suche`, `logikwaechter`, `textabzug` (rechtliches)
    - `funktionsliste` (Playwright-Durchlauf der Hauptaufgaben mit Attrappen für alle POST-Anfragen, Server Actions und `/api/kunden-upload`)
  - Ergebnis und Einrichtungsschritte in STATUS.md.
- **E0-KUNDSCHAFTER-06**:
  - Er liest die Next-16-Doku in `node_modules/next/dist/docs`: ViewTransition und `experimental.viewTransition`, next/font samt Fallback-Metriken, error.tsx, Metadata/OG, Link.
  - Er klärt, wie sich tailwind-merge 3.6 mit Tailwind 3 verhält.
  - Bericht für K-004. Das verlangt AGENTS.md.
- **E0-PRUEFER-02**: Ausgangswerte nach Prüfstufe B; Bildsatz E0, Textabzug und Logik-Fingerabdrücke werden im Repo gesichert.
- **E0-PRUEFER-03**: Durchlauf der Funktionsliste als Ausgangswert. Dazu kommt der Charakterisierungstest des Warenkorb-Stores, `src/lib/store/cart.test.ts` (neu).
- **E0-L-02**: LAGEBILD.md mit der Funktionsliste aus dem L0-Bericht Bestand.

**E1 · Plan**
- KERN.md (K-001 bis K-012, mit Denkprotokollen): Leitidee, Formsystem, Bewegungssystem, kein 3D, kein Dunkelmodus, Glyphen-Ordner.
- PLAN.md mit dem Schnitt unten als exakte Dateilisten und ABNAHME.md mit den Ausgangswerten.
- UMGEBUNGSAUSNAHMEN, jeweils mit Ersatzprüfung:
  - echte Geräte
  - Safari und Firefox
  - Bildrate mit Grafikkarte (Ersatz: Chromium headless mit 4-facher Drosselung)
  - Screenreader
- E1-PRUEFER-01 prüft den Plan (L0, höchstens 2 Runden). Danach Commit und Push.

**E2 · Referenz `/`** (Opus baut der Reihe nach, ≈1 Tag; je Paket Prüfstufe A durch einen Haiku-Prüfer)
- **L-01** Designsystem-Erweiterung: Tokens, `cn.ts` mit `extendTailwindMerge` für alle neuen Gruppen und `cn.test.ts`, iOS-16-px-Token.
- **L-02** Formsystem:
  - non-scaling-stroke in IconBase oder CSS.
  - `visual/glyphen/` mit `glyphen.test.tsx`, das die Dateien selbst findet.
  - Die ersten 12 Glyphen dienen als Muster; dazu die Zuordnungstabelle in K-008.
- **L-03** Bewegungssystem:
  - Tokens, `sm24-*` mit Tokens, `sm24-dash` unter 5 s
  - `src/lib/bewegung.ts` (`scrollVerhalten`) mit Test, eingesetzt in `use-flow.ts`
  - Grundlage für die Scroll-Timeline und je nach Doku `experimental.viewTransition`
- **L-04** Profillinie (`visual/profillinie.tsx` mit Test) und Generator `profilschnitt` (mit Test und Registry-Eintrag).
- **L-05** Hülle:
  - `(site)/layout.tsx`, `site-header` (Drawer, Megamenü), `site-footer`
  - `mobile-action-bar` mit `istAktiv` aus `navigation.ts` samt Test
  - `ui/button` (active- und loading-Zustand), `ui/card`, `layout/section`
- **L-06** Startseite `(site)/page.tsx`:
  - Fräsbahn-Hero (B-01), die Inhalte stehen sofort
  - Schnelleinstieg mit BereichIcon und AreaScope je Karte
  - Ablauf am Scrollen mit der Profillinie (B-03)
  - Vertrauen als asymmetrische Werkstattkomposition mit dem Foto-Platz
  - Teaser mit Minigeneratoren, Ratgeber redaktionell
  - Null freie Werte; „entdecken“ wird durch eine genaue Aktion ersetzt
- **Haiku-Plätze parallel** (Muster sind die vorhandenen Generatoren und die Glyphen aus L-02):
  - Welle E2-a: GRAFIKER-01 und -02 (je 12 Glyphen, nur neue Dateien in `glyphen/`), GRAFIKER-03 (neuer Generator `tuer-schutz`), GRAFIKER-04 (`schliessplan` mit Parameter `markiert` und eigenen Testfällen)
  - Welle E2-b: GRAFIKER-05 (Strichskala in `grafik-basis` und allen Generatoren; vorhandene Exporte bleiben), GRAFIKER-06 (Generator `fehlschluessel` für 404 und error), GRAFIKER-07 (Rest-Glyphen), PRUEFER (Prüfstufe A für die Opus-Pakete)
- **Etappentor**: Prüfstufe B für `/`, dann Sichtabnahme durch einen frischen Opus-Unteragenten. Ziel ist ein Ansichtswert von mindestens 8.

**E3 · Vorlagen und Bausteine**
- **Welle A**:
  - B-01 Formular-Bausteine: `forms/controls`, `forms/field`, `forms/option-card` (focus-within), `ui/alert` (danger), `ui/badge`, `ui/info-tip`, `ui/accordion`
  - B-02 Ablauf-Hülle: `flow/flow-shell` (`scaleX`, Schrittwechsel), `layout/summary-list`, `layout/breadcrumbs`
  - B-03 `forms/photo-upload` (Logikwächter)
  - GRAFIKER-08: `visual/README.md` an Formsystem und Glyphen anpassen
- **Opus parallel zu Welle A**:
  - **L-08** `layout/page-header` als Bereichskopf, erweitert und nicht neu, mit Bildprüfung von 35 Nutzerseiten; dazu `ui/image-placeholder` (Ersatzgrafik statt „Bild folgt“, ohne lucide, mit neuem Test).
  - **L-09** `.prose-sm24` sowie `not-found.tsx` und ein neues `error.tsx` mit `fehlschluessel`.
  - **L-10** Client-Hüllen der großen Momente: `visual/interaktiv/schliessplan-interaktiv.tsx`, `live-schluessel.tsx` und `code-fundstelle-interaktiv.tsx`.
- **Welle B**:
  - B-04 Autoschlüssel-Vorlage: `autoschluessel/service-article`, `key-kinds`, `vehicle-facts` (prägt die 7 Leistungsseiten; Bildprüfung von 2)
  - B-05 `autoschluessel/preis-anzeige`, `termin-auswahl`, `bestaetigung` (CheckDraw)
  - B-06 `calculator/rechner-bausteine`, `service-einsatz-rechner`, `tuer-absicherung-rechner`, `rechner.test.tsx` (Alt-Neu), `vertrauen/nachweise-liste` mit Test (Alt-Neu)
  - B-07 Hauptansicht `/autoschluessel` (`autoschluessel/page.tsx`); großer Moment ist die Reihe der Schlüsselarten aus dem `schluessel`-Generator

**E4 · Hauptansichten** (Muster ist die Referenz)
- **Welle C**:
  - B-08 Marken: `marken/page`, `marken/[make]/page`, `marken/[make]/[model]/page`
  - B-09 Code-Shop: `schluessel-nach-code/page`, `shop-liste`, `[slug]/page`, `[slug]/bestell-formular` (Logikwächter; Live-Schlüssel und Code-Fundstelle aus L-10; Hersteller-Platzhalter nicht als Fakt zeigen)
  - B-10 Schließanlagen: `schliessanlagen/page`, `components/schliessanlagen/system-erklaerung` (10 Schemata bekommen `schliessplan`, interaktiv aus L-10)
  - B-11 Türtechnik: `tuer-und-schliesstechnik/page`, `[slug]/page` (`tuer-schutz`, B-06)
- **Welle D**:
  - B-12 Ratgeber: `ratgeber/page`, `ratgeber/[slug]/page`
  - B-13 Zylinder-Konfigurator: `konfigurator/page`, `konfigurator.tsx` (Logikwächter; `zylinder-mass` live)
  - B-14 Warenkorb: `warenkorb/page`, `warenkorb-ansicht` (Logikwächter)
  - B-15 Kasse: `kasse/page`, `kasse-formular` (Logikwächter)
- **Welle E**:
  - B-16 Assistent: `autoschluessel/anfrage/page`, `assistent.tsx` (Logikwächter)
  - B-17 `schluessel-nach-vorlage/page`
  - B-18 `elektronische-zutrittsloesungen/page`
  - B-19 `sicherheitstechnik/page`, `sicherheitstechnik/[slug]/page`
- **Opus parallel**:
  - **L-11** Seitenwechsel mit gemeinsamen Elementen, falls die Doku es trägt; sonst Denkprotokoll und Streichung.
  - **L-07** Leistung absichern, nach der ersten Etappenmessung.

**E5 · Übrige Ansichten** (Pflicht für Z-06 „eine Icon-Familie“ und Z-03/Z-09 in der Stichprobe)
- **Welle F**:
  - B-20 `service-und-termin/page`, `kontakt/page`, `vor-ort/page`
  - B-21 `gleichschliessende-zylinder/page`
  - B-22 `schluessel-nach-vorlage/anfrage/page`, `anfrage-formular` (Logikwächter)
  - B-23 `sicherheitscheck/page`, `sicherheitscheck.tsx` (Logikwächter)
- **Welle G**:
  - B-24 `elektronische-zutrittsloesungen/konfigurator/page`, `zutritt-konfigurator` (Logikwächter)
  - B-25 `schliessanlagen/konfigurator/page`, `projekt-konfigurator` (Logikwächter, 2027 Zeilen)
  - B-26 `service-und-termin/anfrage/page`, `anfrage-formular`, `terminstatus/page`, `status-formular` (Logikwächter)
  - B-27 `artikel/page`, `artikel-liste`, `artikel/[slug]/page`, `artikel-kauf` (Logikwächter)
- **Welle H**:
  - B-28 `standorte/page`, `standorte/[city]/page`, `bestellung/[id]/page` (Logikwächter)
  - B-29 `rechtliches/layout` und 6 Seiten samt `cookie-einstellungen.tsx` (Logikwächter, Textabzug wortgleich)
  - DOKUMENTAR-01: README auf den Ist-Stand, UMSETZUNG.md als historisch kennzeichnen
- **L-12** `lucide-react` entfernen per Denkprotokoll (`npm uninstall`, null Importe). Damit ist eine einzige Icon-Familie bewiesen.
- Jedes B-Paket erledigt drei Dinge:
  - lucide durch SM24-Glyphen ersetzen
  - freie Werte durch Tokens ersetzen
  - Bildstellen der Seite mit passendem Generator belegen
- Die 7 Autoschlüssel-Leistungsseiten (`nachmachen`, `programmieren`, `kopieren`, `funkschluessel`, `smart-key`, `schluesselbart-fraesen`, `fahrzeugoeffnung`) haben weder lucide noch freie Werte. Sie ändern sich über die Vorlage B-04 und werden per Bild geprüft.

**E6 · Kür (nach Wirkung)**
1. Stiftzuhaltungs-Szene: neuer Generator, die Stifte richten sich beim Scrollen aus, auf `/gleichschliessende-zylinder`.
2. `zutritt-signal` im Zutritt-Hero.
3. Restliche Bildstellen mit Fachgrafik.
4. Ratgeber-Lesefortschritt, nur CSS.
5. Druckansicht für Bestell- und Vorgangsbestätigung.
6. OG-Bilder je Bereich über `next/og` mit lokaler Schrift.

Neue Kür-Pakete entstehen nur aus Lücken der Abnahme oder aus der Sichtabnahme.

**Kapazität**: 29 B-Pakete, 8 Grafiker, 1 Dokumentar, etwa 15 Prüfer und Kundschafter, 12 L-Pakete und 6 Kür, zusammen etwa 71. Gut 80 % davon laufen auf Haiku. Bei etwa 8 Wellen am Tag und 4 Plätzen: 59 ÷ 32 × 1,2 ≈ 2,2 Tage für die Haiku-Arbeit. Mit E0 bis E2 und den Prüfstufen ergibt das etwa 3,5 bis 4 Tage.

## Takt, Gedächtnis, Berichte
- Commit je Paket im Stil `feat(gestaltung): … [E4-BAUMEISTER-03]` mit den vorgegebenen Attributionszeilen. Keine Modellnamen in Artefakten.
- Push nach jeder grünen Welle und mindestens stündlich; Zwischenstände tragen den Vermerk ZWISCHENSTAND.
- STATUS.md und PRUEFPUNKT.md werden nach jeder Welle aktualisiert.
- Morgenbericht um 07:00 Uhr deutscher Zeit in BERICHT.md, per `send_later`-Erinnerung.
- Bilder: Ins Repo kommen nur die Bildsätze aus E0, aus der Referenz und vom Abschluss sowie täglich höchstens 6. Alle anderen Bilder liegen außerhalb des Repos.
- Nach einem Abbruch geht es nach L5 weiter: Branch, PRUEFPUNKT.md und STATUS.md.

## Prüfung und Abnahme
- Die Prüfstufen A, B und C laufen genau wie im Auftrag, immer mit Haiku-Prüfern und den Werkzeugen aus `_werkstatt/werkzeuge`. Gemessen wird gegen `next start` im JSON-Modus, damit alles mit E0 vergleichbar bleibt.
- Z-04: Ein Haiku-Dokumentar bereitet blinde Vorher-Nachher-Paare vor, der Schlüssel liegt getrennt. Das Urteil fällt ein frischer Opus-Endprüfer.
- ABSCHLUSS erst, wenn der Opus-Endprüfer jedes Kriterium gegen seinen Beleg bestätigt hat. Sein Urteil wird wörtlich wiedergegeben. Dann wird der CLAUDE.md-Block entfernt, committet und gepusht.
- Galerie unter `_werkstatt/bilder/galerie.html`. BERICHT.md enthält die Anleitung zum Zusammenführen und Zurückrollen.

## Verifikation (Ende zu Ende)
- **Je Paket (Stufe A)**:
  - `npx tsc --noEmit`, `npx eslint <Dateien>`, `npx vitest run <betroffene Tests>`.
  - `logikwaechter` für die betroffenen Dateien.
  - `bild` der Ansicht bei 390 px und 1440 px.
- **Je Welle**: `SM24_DATA=json npx next build`. Der Push erfolgt nur, wenn Build, Typprüfung und Tests nicht schlechter sind als in E0.
- **Je Etappe (Stufe B)**:
  - Build, Typprüfung, Linter, `npm run test:unit` und die DB-Tests auf dem E0-Weg.
  - `konsole`, `bildsatz` mit Überlaufprüfung, `a11y`, `messung` (Median aus 3), `bewegung`, `werte-suche`.
  - Danach die Sichtabnahme durch Opus anhand der Bilder.
- **Abschluss (Stufe C)**:
  - Stufe B plus eine Stichprobe von mindestens 5 übrigen Ansichten.
  - Skript `funktionsliste`, Tastaturdurchlauf der 6 Hauptaufgaben, `textabzug` wortgleich.
  - Abgleich aller Animationen mit dem Register, SVG-Prüfung (eine Familie, keine doppelten IDs, optimiert).
  - Blindvergleich und Endurteil durch einen frischen Opus-Unteragenten.

## Absehbare MENSCHEN.md-Einträge
- Echte Fotos für 37 Bildstellen
- Firmendaten, Hersteller der Codelinien, Texte der Stadtseiten
- Rechtliche Prüfung, falls die Darstellung von Rechtstexten berührt wird
- Stripe ist nicht implementiert und außerhalb des Auftrags
- Tests auf echten Geräten und Browsern, mit Screenreader
- `initdb` als root
- Ungenutzte Abhängigkeiten (framer-motion, react-hook-form, graphql, @fontsource)
- Slugs `koda` und `m-gane`
- Zusammenführen und Veröffentlichen
