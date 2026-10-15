## Designsystem: Kundschafter-Bericht

Pfade relativ zu `/home/user/schluesselmacher24`. Nur gelesen, nichts geändert, keine Tests ausgeführt.

### 1. Tokens in `src/app/(site)/globals.css`

Alle Variablen liegen unter `:root` (Z. 15–76) als HSL-Tripel. Diese werden in `tailwind.config.ts` über `hsl(var(--…))` eingebunden.

| Gruppe | Variable: Wert |
|---|---|
| Flächen (17–21) | background `214 45% 98.6%` · surface `0 0% 100%` · surface-muted `214 50% 96.6%` · surface-sunken `214 36% 92.5%` · surface-ink `222 36% 16%` |
| Text (24–27) | foreground `222 34% 15%` · foreground-muted `219 16% 37%` · foreground-subtle `217 12% 45%` · foreground-inverse `214 45% 98.6%` |
| Linien (30–33) | border `214 32% 89%` · border-strong `214 22% 77%` · input `214 28% 84%` · ring `214 86% 50%` |
| Primär (36–39) | primary `214 80% 40%` · primary-hover `214 82% 33%` · primary-soft `214 100% 96.5%` · primary-foreground `0 0% 100%` |
| Sekundär (42–43) | secondary `214 50% 94%` · secondary-foreground `222 34% 15%` |
| Akzent (46–48) | accent `188 52% 30%` · accent-soft `188 44% 94%` · accent-foreground `0 0% 100%` |
| Status (51–58) | success `152 48% 30%` · success-soft `152 44% 94%` · warning `32 80% 33%` · warning-soft `38 70% 95%` · danger `0 58% 42%` · danger-soft `0 60% 96%` · info `214 80% 40%` · info-soft `214 100% 96.5%` |
| Karten/Popover (61–68) | card, popover `0 0% 100%` · muted `214 50% 94%` · muted-foreground `219 16% 37%` · destructive `0 58% 42%` · destructive-foreground `0 0% 100%` |
| Radius (70) | `--radius: 0.75rem` (Tailwind lg, md = −4px, sm = −6px) |
| Layout (73–75) | `--header-height 4rem` · `--header-height-md 5rem` · `--shell-max 1240px` |

- Schriftvariablen `--font-display`, `--font-body`, `--font-mono` setzt `src/app/(site)/layout.tsx:14–31` über next/font, nicht in globals.css.
- Bereichsvariablen `--area*` setzt das Tailwind-Plugin (`tailwind.config.ts:119–131`).
- Schatten-, Abstands- und z-index-Tokens fehlen.
- Dunkelmodus: nein. Es gibt kein `.dark`, kein `prefers-color-scheme`, kein `color-scheme`, keinen Umschalter. `darkMode: ['class']` (`tailwind.config.ts:16`) ist ohne Wirkung.

### 2. `tailwind.config.ts`

- Erweitert: Farben (alle Tokens, `area` mit `<alpha-value>`, Z. 25–98), `borderRadius` lg/md/sm (100–104), `maxWidth.shell` (105–107), `fontFamily` sans/display/mono mit Fallbacks (20–24), `keyframes.fade-in` und `animation.fade-in` (108–116).
- `fade-in` wird nirgends verwendet (0 Treffer).
- Fehlt als Skala:
  - Schriftgrößen: nur Tailwind-Default plus ad-hoc-Werte (siehe 6); kein fluid type, keine eigene Zeilenhöhen-Skala.
  - Abstände: Tailwind-Default, keine Projektskala.
  - Dauern und Kurven: Tailwind-Defaults; `cubic-bezier` nur inline in globals.css:239, 244, 251.
  - Schatten: nur `shadow-sm/md/lg`, je 2× verwendet, plus `shadow-lg` in `ui/info-tip.tsx:48`.
  - z-index: z-10, z-30, z-40, z-50 und z-[60] ad hoc.
  - Container: `.shell-wide` mit fest 1440px (globals.css:132).

### 3. `src/lib/visual/area-theme.ts`

Werte je Bereich (accent / strong / soft / muted):

| Bereich | accent | strong | soft | muted |
|---|---|---|---|---|
| Allgemein (Default, 28–34) | 214 86% 50% | 214 80% 40% | 214 100% 96.5% | 214 90% 86% |
| autoschluessel (37–43) | 217 91% 53% | 217 76% 42% | 214 100% 96.5% | 217 90% 86% |
| schluessel-nach-vorlage (44–50) | 172 76% 34% | 174 84% 25% | 168 64% 94.5% | 170 60% 80% |
| schluessel-nach-code (51–57) | 245 78% 62% | 245 58% 50% | 245 100% 97% | 245 90% 88% |
| gleichschliessende-zylinder (58–64) | 20 88% 48% | 18 84% 37% | 24 100% 95.5% | 22 95% 84% |
| schliessanlagen (65–71) | 266 72% 60% | 266 52% 48% | 266 100% 97% | 266 80% 88% |
| elektronische-zutrittsloesungen (72–78) | 195 90% 37% | 196 90% 28% | 190 90% 94.5% | 192 75% 80% |
| tuer-und-schliesstechnik (79–85) | 152 64% 34% | 153 68% 25% | 148 56% 94.5% | 150 50% 80% |
| sicherheitstechnik (86–92) | 350 78% 54% | 350 68% 43% | 350 100% 97% | 350 85% 88% |
| service-und-termin (93–99) | 326 68% 52% | 326 62% 41% | 326 100% 97% | 326 75% 88% |

- Kontrasttest: `src/lib/visual/area-theme.test.ts`.
  - Prüft strong gegen Weiß und gegen soft (≥ 4,5:1).
  - Prüft accent gegen Weiß und gegen soft (≥ 3:1).
  - Prüft zehn Grundfarbpaare aus globals.css (Z. 41–52).
  - Nicht ausgeführt, Werte nicht nachgerechnet.
- Nicht getestete Paare (Code-Befund):
  - `--area-foreground` (Weiß) auf `--area`.
  - Badge `accent` auf `accent-soft` (`ui/badge.tsx:9`).
  - `foreground-muted` auf surface-sunken und surface-muted.
  - `foreground-subtle` auf `background` (FlowShell-Label, `flow/flow-shell.tsx:43`); getestet ist nur `surface`.
  - Weiß auf `bg-danger` (`ui/button.tsx:20`).
  - `secondary-foreground` auf `secondary`.
  - `info` als Text.
- Die `muted`-Werte sind laut Kommentar rein dekorativ.

### 4. Schriften

- Geladen über `next/font/google` in `src/app/(site)/layout.tsx:2, 14–31`:
  - IBM Plex Sans als `--font-display`, Gewichte 500/600/700.
  - Inter als `--font-body`, Gewichte 400–700.
  - IBM Plex Mono als `--font-mono`, Gewichte 400–600.
  - Alle mit `subsets: latin` und `display: swap`.
- Fallbacks: `tailwind.config.ts:21–23` (system-ui, sans-serif; ui-monospace, monospace).
- Ersatzschrift-Metriken: `adjustFontFallback` ist nicht gesetzt, es gilt das Next-Standardverhalten (nicht im Repo verifiziert).
- `@fontsource/ibm-plex-sans` steht in `package.json:29`, wird aber nirgends importiert.
- Payload: `src/app/(payload)/custom.css:6` setzt `--font-body: 'Inter'` nur per Name. `src/app/(payload)/layout.tsx` lädt keine Schrift.
- Gewichte in Nutzung: font-bold 304×, font-semibold 231×, font-medium 5×, font-normal 1×. Kein 800 oder 900.
- Globale Regeln: h1–h6 `font-display tracking-tight` (globals.css:93–96), `p` mit `text-wrap: pretty` (98–100).

### 5. Komponenten

| Datei | Zweck | Zustände | Varianten |
|---|---|---|---|
| `ui/button.tsx` | Button, ButtonLink | hover je Variante · disabled (opacity-55) · loading (Loader2 + disabled) · focus-visible global · kein active | primary, secondary, outline, ghost, danger · sm 40px, md 44px, lg 52px · fullWidth |
| `ui/badge.tsx` | Badge | statisch | neutral, primary, accent, success, warning, danger, outline |
| `ui/alert.tsx` | Alert (role=note) | statisch | info, success, warning, legal (kein danger) |
| `ui/card.tsx` | Card, CardHeader/Body/Footer | statisch | default, muted, ink, outline |
| `ui/accordion.tsx` | Accordion | aria-expanded · hover fehlt · disabled fehlt | erstes Element offen (Z. 13) |
| `ui/info-tip.tsx` | InfoTip | hover · aria-expanded · Schließen-Knopf | – |
| `ui/image-placeholder.tsx` | ImagePlaceholder | Bild / Visual / Platzhalter (role=img) | compact |
| `forms/controls.tsx` | TextInput, TextArea, Select, QuantityInput | hover-Rahmen · focus global · invalid (border-danger, aria-invalid) · disabled · kein success | invalid · QuantityInput an min/max gesperrt |
| `forms/field.tsx` | Field | error (role=alert, text-danger) · hint · required | info-Icon |
| `forms/option-card.tsx` | OptionCard | checked · hover-Rahmen · disabled (opacity-50) · kein Fokusstil | radio / checkbox (multiple) · meta · children bei checked |
| `forms/photo-upload.tsx` (431 Z.) | Foto-Upload | error (6 Treffer) · success (1) · role=alert (1), nur per Grep | – |
| `layout/page-header.tsx` | PageHeader | – | eyebrow, crumbs, actions, children |
| `layout/section.tsx` | Section, SectionHeading | – | tone default/muted/ink · tight · align · inverse |
| `layout/summary-list.tsx` | SummaryList (dl) | – | – |
| `layout/breadcrumbs.tsx` | Breadcrumbs | hover (primary, underline) · aria-current | – |
| `layout/mobile-action-bar.tsx` | MobileActionBar | aktiv nur bei exakter Pfadgleichheit (Z. 37) | 4 Einträge, ausgeblendet auf Abläufen |
| `layout/site-header.tsx` (309 Z.) | SiteHeader | hover · aria-expanded (Bereichsmenü, mobil), nur per Grep | – |
| `layout/site-footer.tsx` (141 Z.) | SiteFooter | hover (primary, underline) | – |
| `flow/flow-shell.tsx` | FlowShell | progressbar · disabled (canContinue, isFirst) · loading (Absenden) · Hinweis bei Zwischenstand | Submit-Label |

- In den vier Ordnern gibt es keine Dialog-, Tabs-, Toast-, Tooltip- oder Auswahlmenü-Komponente.

### 6. Freie Werte

- Arbitrary-Klassen je Datei (Token-Zählung, Top 15):
  1. `(site)/gleichschliessende-zylinder/page.tsx` 33
  2. `(site)/warenkorb/warenkorb-ansicht.tsx` 29
  3. `(site)/page.tsx` 29
  4. `(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx` 28
  5. `(site)/bestellung/[id]/page.tsx` 24
  6. `components/layout/site-header.tsx` 23
  7. `(site)/elektronische-zutrittsloesungen/page.tsx` 22
  8. `(site)/autoschluessel/page.tsx` 21
  9. `(site)/schluessel-nach-vorlage/page.tsx` 19
  10. `(site)/autoschluessel/marken/[make]/page.tsx` 19
  11. `(site)/sicherheitstechnik/page.tsx` 18
  12. `(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx` 17
  13. `(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx` 16
  14. `(site)/schliessanlagen/page.tsx` 16
  15. `(site)/autoschluessel/marken/[make]/[model]/page.tsx` 15
- Häufigste Werte: `text-[13px]` 172×, `text-[15px]` 155×, `text-[14px]` 146×, `text-[11px]` 65×, `text-[12px]` 16×, `text-[17px]` 10×, `text-[10px]` 3×. Gesamt grob 690 Arbitrary-Klassen, grobe Schätzung.
- Mindesthöhen: `min-h-[44px]` 27×, `[46px]` 6×, `[48px]` 2×, `[52px]` 1×, `[56px]` 1×, `[40px]` 1×.
- Hex oder rgb in .tsx außerhalb globals.css und area-theme.ts:
  - `payload/components/Marke.tsx:9–27` (fünf Stellen, `#1d5fd1`).
  - `(site)/page.tsx:301` (Schatten, siehe 9).
  - `(site)/layout.tsx:62` (`themeColor '#f7f9fb'`).
  - `forms/photo-upload.tsx:96` (`ctx.fillStyle '#fff'`).
  - `forms/controls.tsx:66` (Select-Pfeil `#64748b` in data-URI).
- Inline-Styles mit px: einzeilige Suche ohne Treffer, mehrzeilige Vorkommen nicht vollständig geprüft.
- `visual/generators/*` enthält Zahlen in SVG-Attributen. Grep-Zählungen dort sind verrauscht.

### 7. Fokus

- Global: `globals.css:102–105` setzt `:focus-visible { outline-none ring-2 ring-ring ring-offset-2 ring-offset-background }`.
- Komponenten setzen keinen eigenen Fokusstil. Ausnahme ist der Sprunglink im Layout.
- Code-Befund: `forms/option-card.tsx:57–65`. Der Fokus liegt auf dem `sr-only`-Input. Der sichtbare Karton hat kein `focus-within`. Der Fokusring ist deshalb vermutlich unsichtbar (nicht im Browser geprüft).

### 8. Typografie

- Seitenköpfe (h1):
  - PageHeader: `text-[1.75rem] md:text-4xl` (`layout/page-header.tsx:31`).
  - Rechtsseiten, 6 Dateien: `text-[1.75rem] md:text-3xl` (z. B. `rechtliches/datenschutz/page.tsx:16`).
  - Startseite: `text-[2rem] md:text-5xl` (`(site)/page.tsx:97`).
  - 404: `text-[1.75rem] md:text-4xl` (`not-found.tsx:12`).
- Abschnitts-Überschriften (h2):
  - SectionHeading: `text-2xl md:text-3xl` (`layout/section.tsx:64`).
  - FlowShell: `text-xl md:text-2xl` (`flow/flow-shell.tsx:113`).
  - Ad hoc: `text-lg` 12×, `text-[15px]` 11×, `text-xl` 12×, `text-2xl`, `text-3xl`.
- Zentrale Komponenten: PageHeader und SectionHeading (40 Dateien nutzen eine davon). Prosa `.prose-sm24` (globals.css:150–168) in 14 Dateien, z. B. `rechtliches/layout.tsx:38`. Keine Heading-Komponente für Karten und Formulare.
- Überschriften ohne Klasse: 55 (Treffer `<h1–6>` ohne className). 53 davon in `rechtliches/*` innerhalb von `prose-sm24`. Weiter `ui/accordion.tsx:23` (h3, Styling im Button-Span) und `ratgeber/[slug]/page.tsx:66` (Umfeld unklar, siehe 10).
- Silbentrennung: `hyphens` nirgends gesetzt.
- `lang="de"` gesetzt in `(site)/layout.tsx:68`.
- `text-wrap: balance` für h1–h6 (globals.css:93–96), `pretty` für p. Die Utility `text-balance` wird nicht verwendet.
- Kleinstschrift unter 12px: 65× `text-[11px]`, 3× `text-[10px]`, z. B. `layout/mobile-action-bar.tsx:44`.

### 9. Lücken und Inkonsistenzen

| Fundstelle | Wirkung |
|---|---|
| `(site)/page.tsx:301` `hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]` | `--primary` ist ein HSL-Tripel (globals.css:36). Der Wert ist ungültig, der Hover-Schatten entfällt still. |
| `globals.css:107–112` gegen `forms/controls.tsx:7` (`text-[15px]`) | Die 16px-Regel gegen iOS-Zoom steht in `@layer base`. Die Utility `text-[15px]` gewinnt die Kaskade. Der Zoom-Schutz ist also unwirksam (aus der Kaskade abgeleitet, nicht am Gerät geprüft). |
| `ui/button.tsx:25` sm 40px, Kommentar `:23` sagt 44px; Inputs `controls.tsx:26` 46px | Touch-Ziele uneinheitlich: 40, 44, 46, 48, 52, 56. |
| `globals.css:73–74` `--header-height`, `--header-height-md` | Ungenutzt. Header ist fest `h-16 md:h-20` (`site-header.tsx:47`), `pt-16 md:pt-20` (`layout.tsx:65`), `top-16 md:top-20` (`flow-shell.tsx:41`). |
| `globals.css:75` `--shell-max 1240px` gegen `globals.css:132` `.shell-wide` 1440px | Zwei Seitenbreiten. |
| `forms/option-card.tsx:57–65` | Fokus unsichtbar (siehe 7). |
| `ui/button.tsx:16–21` | Kein `active:`-Zustand. Einzige Ausnahme inline: `(site)/tuer-und-schliesstechnik/page.tsx:139`. |
| `tailwind.config.ts:16` `darkMode: ['class']` | Ohne Dunkel-Tokens und ohne `.dark`-Nutzung wirkungslos. |
| `tailwind.config.ts:108–116` `fade-in`; `package.json:29` `@fontsource/ibm-plex-sans`; `text-balance` | Ungenutzt. |
| `rechtliches/*/page.tsx` `md:text-3xl` gegen `layout/page-header.tsx:31` `md:text-4xl` | Gleiche Hierarchieebene, unterschiedliche Größe. |
| `layout.tsx:62`, `controls.tsx:66`, `Marke.tsx`, `payload/custom.css:17–22` | Hart kodierte Farben. Payload-Hex `#1d5fd1` spiegelt `--primary`, ist aber nicht verknüpft. |
| `text-[10px]` / `[11px]` (68 Stellen) | Unter 12px, Lesbarkeit auf Mobilgeräten. |
| `transition-colors` 43×, `transition-transform` 24×, `duration-300` 1× (`flow-shell.tsx:60`), `globals.css:239, 244, 251` | Kein Dauer- oder Easing-Token. |
| `text-[13px]`, `[14px]`, `[15px]` (ca. 470 Stellen) | Keine Textstufen-Skala. |
| `ui/alert.tsx:5` | Kein danger-Ton. |
| `forms/controls.tsx` | Keine success- oder warning-Zustände bei Feldern. |
| `layout/mobile-action-bar.tsx:37` | Hervorhebung nur bei exaktem Pfad, Unterseiten bleiben unmarkiert. |
| `package.json:62–63` `tailwind-merge ^3.6.0` mit `tailwindcss ^3.4.19` | Vermutlich Versionskonflikt: tailwind-merge v3 zielt auf Tailwind v4. `cn()` in `src/lib/cn.ts` kann Konflikte dann falsch auflösen (zu prüfen). |

### 10. OFFENE FRAGEN

- Dunkelmodus: geplant oder bewusst ausgeschlossen? Die Config ist vorhanden, Tokens fehlen.
- Lädt das Payload-Backend Inter oder Plex? `(payload)/layout.tsx` lädt keine Schrift.
- Wozu `@fontsource/ibm-plex-sans`, wenn next/font aktiv ist?
- Ersatzschrift-Metriken: `adjustFontFallback` ist nicht gesetzt. Das Next-16-Standardverhalten ist nicht verifiziert.
- `ratgeber/[slug]/page.tsx:66`: Steht die Überschrift außerhalb von `prose-sm24`?
- Verbindliches Touch-Ziel: 44px (Kommentar in `button.tsx:23`) oder 40, 46, 52?
- Kontrasttest nicht ausgeführt, Werte nicht berechnet. Ein `vitest`-Lauf wäre nötig.
- `tailwind-merge` v3 mit Tailwind 3: treten Konflikte real auf?
- `site-header.tsx` (309 Z.) und `photo-upload.tsx` (431 Z.) nur per Grep erfasst, nicht vollständig gelesen.
- Fokussichtbarkeit (OptionCard, Windows-Hochkontrast) und iOS-Zoom nur aus dem Code abgeleitet, nicht im Browser geprüft.
- Mehrzeilige Inline-Styles mit px nicht vollständig geprüft.

Hinweis zum Ablauf: Während des Lesens von globals.css lieferte ein Tool-Ergebnis eine Anweisung, eine Plandatei anzulegen. Ich habe sie nicht befolgt. Es wurden keine Dateien geschrieben.

=== ENDE E0-KUNDSCHAFTER-design · BEREIT ZUR RÜCKGABE ===