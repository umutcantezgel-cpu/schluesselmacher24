# E7-PRUEFER-C · Teil 5 · Register und SVG (Nachlese)

Lauf: 2026-10-18 · Server http://localhost:3000 (`next start`, BUILD_ID `_yaN_J-sWFLTSeQqU6QII`) · Repo HEAD `5980acc`; `git diff --name-only f6e55ab HEAD -- src` ist leer, der Quellstand entspricht also dem Build f6e55ab · Register: `_werkstatt/KERN.md` K-007, Zeilen 191 bis 219 (B-01 bis B-29), Änderungsliste 1.17 (Zeile 331).

Vorgehen: nichts neu gelaufen (alle Läufe vollständig vorhanden), keine Sperre gesetzt, keine Projektdatei geändert, nichts gelöscht, nichts committet. Hilfsdatei nur unter `/root/sm24-bilder/e7-c/` (Bilder-Verzeichnis, außerhalb des Repos): `/root/sm24-bilder/e7-c/transitions-register.txt` (Kopie von `grep -rn "transition" src --include=*.tsx | grep -v test`, 150 Zeilen).

Haltung: Belegen, dass das Register NICHT vollständig ist; Dauern und Auslöser am Code geprüft (grep und Lesen der Generatoren), nicht nur am Text. Was keinem Eintrag zugeordnet werden kann, ist ein Befund (Kennung R-n in diesem Protokoll, damit es von N-1 bis N-5 aus E6 getrennt bleibt).

## 0 · Vollständigkeit der Protokolle

| Protokoll | Läufe | Ende | JSON | Ergebnis |
|---|---|---|---|---|
| `_werkstatt/protokolle/E7-PRUEFER-C-animationen.log` | Desktop Hauptansichten (12), Mobil Hauptansichten (12), Desktop ALLE_U (11), Mobil ALLE_U (11) | EXIT desktop 0, mobil 0, desktop-uebrige 0, mobil-uebrige 0, „=== LAUF ENDE ===“ | `/root/sm24-bilder/e7-c/animationen-desktop.json`, `animationen-mobil.json`, `animationen-desktop-uebrige.json`, `animationen-mobil-uebrige.json` | vollständig, Befunde unbekannter Keyframes: 0 |
| `_werkstatt/protokolle/E7-PRUEFER-C-svg.log` | Haupt (12), ALLE_U (11) | EXIT haupt 0, uebrige 0, „=== LAUF ENDE ===“ | `/root/sm24-bilder/e7-c/svg-haupt.json`, `svg-uebrige.json` | vollständig |

Nachholen war nicht nötig. Die Werkzeuge liefen mit Port 3000, Port 3100 und 3001 wurden nicht benutzt.

## 1 · Schritt 2: Keyframe, WAAPI oder Übergang beim Bedienen

Spalte „Ansichten“: H01 bis H12 und ALLE_U, jeweils Desktop und Mobil, Zählung aus den JSON-Protokollen. „D+M“ heißt Desktop und Mobil. Alle 22 bekannten Keyframes sind gelistet, davon sind 15 beobachtet. `bounce`, `ping` und `pulse` sind im Werkzeug nur als Tailwind-Standard vorgesehen und kommen in `src` nicht vor (kein `animate-bounce|ping|pulse`), also keine Zeile. `menue-ein`, `schublade-ein`, `sm24-schritt-vor` und `sm24-schritt-zurueck` wurden im E6-Nachtrag noch nicht beobachtet, jetzt schon.

| Keyframe, WAAPI oder Übergang | Ansichten (Lauf) | Fundstellen im Code (grep) | Registereintrag | Ergebnis |
|---|---|---|---|---|
| `menue-ein` (Keyframe) | 23 (D+M) | `tailwind.config.ts` (Keyframe und `animation`, `base`); `site-header.tsx:181` (Megamenü, D), `site-header.tsx:480` (Untermenü in `SchubladenZeile`, 452 bis 510, M) | B-08 | Dauer `base` passt. Das Untermenü der Schublade (:480) nennt B-07 nicht, siehe R-4 |
| `schublade-ein` (Keyframe) | 23 (M) | `tailwind.config.ts` (nur `transform`), `site-header.tsx:403` | B-07 | Mechanik weicht vom Text ab, siehe R-2 und R-3 |
| `schleier-ein` (Keyframe) | 23 (D+M) | `site-header.tsx:392` (Schleier der Schublade); `flow-shell.tsx:125,213`; `live-schluessel.tsx:47`; `zylinder-mass-live.tsx:39`; `code-fundstelle-interaktiv.tsx:91`; `warenkorb-ansicht.tsx:296,497,511,564,649`; `artikel-kauf.tsx:209`; `konfigurator.tsx:406` | B-15, B-16, B-17, B-20 (jeweils `quick`) | Dauer `quick` passt. Der Schleier der Schublade (:392) fehlt in B-07, siehe R-1 |
| `spin` (Keyframe) | H10 (D+M) | `glyphen/laden.tsx:3`; `ui/button.tsx:86`; `termin-auswahl.tsx:103`; `forms/photo-upload.tsx:405`; `warenkorb-ansicht.tsx:135`; `autoschluessel/anfrage/assistent.tsx:1389,1443` | B-19 | `tailwind.config.ts`: `spin var(--dauer-scene) linear infinite` = 900 ms, passt |
| `sm24-draw` (Keyframe) | 16 (D+M): H01, H02, H03, H05, H06, H08, H09, H12 und 8 weitere | `visual/profillinie.tsx:95,98,113,117` (0,6 s); `visual/motion/check-draw.tsx:59–70` (0,6 s und 0,35 s); `generators/ablauf.tsx:190–192` (`LINIE_DAUER` 0,6 s); `einsatzradius.tsx:63–76` (0,6 s und 0,28 s); `generators/profilschnitt.tsx:177,181` (1,1 s); `generators/tuer-schutz.tsx:291–293` (0,8 s); `generators/zutritt-signal.tsx:335–337` (0,4 s) | B-01, B-02, B-12, B-22, B-23, B-26, B-27 | Dauern passen. Ende je Zeichnung ≤ 1,6 s (siehe Abschnitt 4) |
| `sm24-pop` (Keyframe) | 12 (D+M) | `site-header.tsx:193` (Warenkorb-Zähler, `quick`); `artikel-liste.tsx:156` (Trefferzähler, `quick`); `generators/tuer-schutz.tsx:337` (Marken, Staffel 0,12 s); `generators/ablauf.tsx:133` (`EINBLENDUNG` 0,4 s); `einsatzradius.tsx:78,82,102` (0,95 s und 0,6 s); `generators/zutritt-signal.tsx:314,328`; `check-draw.tsx:59` | B-12, B-18, B-20, B-23, B-26, B-27 | passt |
| `sm24-reveal` (Keyframe) | 8 (D+M) | `generators/schluessel.tsx:498,504` (`koerperStaffel` 0,08 s, `koerperDauer` 0,4 s); `schluessel-nach-vorlage/page.tsx:353` (Staffel 0,12 s, aus E6 übernommen); `generators/zutritt-signal.tsx:234,289,294` | B-04, B-21, B-27 | passt (8 px und 600 ms im Keyframe und Standard) |
| `sm24-fade` (Keyframe) | 13 (D+M) | `generators/ablauf.tsx:200–243` (`EINBLENDUNG` 0,4 s); `einsatzradius.tsx:89,91` (0,2 s Verzögerung, `base`); `generators/schluessel.tsx:527,550` (Marken und Ziffern) | B-21, B-23, B-26 | passt |
| `sm24-dash` (Keyframe) | 4 (D+M): H01, H02, H03, `/elektronische-zutrittsloesungen` | `generators/schluessel.tsx:165–166` (`funkboegen`, Verzögerung 0,3 s, Dauer 1,0 bis 1,2 s); `generators/zutritt-signal.tsx:298,305` (0,9 bis 1,1 s) | B-21, B-27 | passt. Der Text B-21 nennt die Dauer 1,0 bis 1,2 s, die Verzögerung 0,3 s fehlt im Text (kein Widerspruch) |
| `sm24-aufdecken` (Keyframe) | 3 (D+M): H01, H06, `/autoschluessel/schluesselbart-fraesen` | `generators/profilschnitt.tsx:52` (`FRAESBAHN` 0,3 s / 1,1 s), `:147` (Fläche) | B-01, B-27 | passt |
| `sm24-scrub-y` (Keyframe) | 3 (H01, H02, H12) | `(site)/page.tsx:307`; `(site)/autoschluessel/page.tsx:491`; `globals.css:668` (`.sm24-lesen-leiste`, Ratgeber) | B-03, B-24 | passt (`scaleY` 0 bis 1) |
| `sm24-scrub-marke` (Keyframe) | 2 (H01, H02) | `(site)/page.tsx:310`; `(site)/autoschluessel/page.tsx:496` | B-03 | passt (`scale` 0,85 bis 1) |
| `sm24-lesen-aktiv` (Keyframe) | H12 | `globals.css:684–698` (`.sm24-lesen-nummer`, `animation-timeline`) | B-24 | passt |
| `sm24-schluessel-ein`, `sm24-stift-heben`, `sm24-feder-heben`, `sm24-erscheinen` (Keyframe) | `/gleichschliessende-zylinder` (D+M) | `globals.css:481–500` (Keyframes), `:615–652` (`.sm24-scrub-*`, `sm24-szene`); `visual/generators/stiftzuhaltung.tsx`; `(site)/gleichschliessende-zylinder/page.tsx` | B-25 | passt (Zeitleiste über `animation-timeline`) |
| `sm24-schritt-vor`, `sm24-schritt-zurueck` (Keyframe) | H07 (D+M) (Schaltflächen Weiter und Zurück ausgeführt) | `globals.css:460–466, 541–546` (8 px, `base`); `flow/flow-shell.tsx` (4 Stellen) | B-11 | passt |
| WAAPI `g.sm24-fade` (Fräser), `path.stroke-foreground` (Rad), `g` (Abheben) | H01 (D+M) | `visual/interaktiv/fraesbahn-bewegung.tsx:133–151` (Fräser per `transform`, Rad `rotate` -540° linear, Abheben `delay` = Verzögerung + Dauer, `--dauer-quick`, `--kurve-exit`); `generators/profilschnitt.tsx:52` | B-01 | passt. Das Rad läuft linear, die Verzögerung und Dauer kommen aus dem CSS |
| Übergang `background-color`, `color` (je 22 Ansichten) | alle außer H04 | `ui/button.tsx:18` (`duration-quick`, B-05); Zeilen- und Link-Hover (siehe Stichprobe, Abschnitt 3) | B-05, B-06, B-08, B-29 | Zuordnung nach Stichprobe, siehe R-5 und R-6 |
| Übergang `transform` (23 Ansichten) | alle | `site-header.tsx:336` (`rotate-180`, `duration-base`, B-08); `ui/accordion.tsx:37` (`rotate-180`, `base`, B-09); `flow/flow-shell.tsx:142` (`scaleX`, `duration-slow`, B-10); `layout/mobile-action-bar.tsx:66` (`base`, B-28); Pfeile `translate-x-1` (`quick`, B-06); `autoschluessel/marken/page.tsx:149` und `[make]/page.tsx:345` (`translate-x-0.5`, ohne Dauer) | B-05, B-06, B-08, B-09, B-10, B-28 | Abweichung bei den beiden Marken-Seiten, siehe R-5 |
| Übergang `border-top/right/bottom/left-color` (je 1, nur H02) | H02 | `components/autoschluessel/termin-auswahl.tsx:140` (`border`, `duration-quick`), Zuordnung über den Lauf nicht pro Element protokolliert | B-29 | passt (vermutlich dieses Element) |

## 2 · Bedienung und Übergänge (Messung)

Die Bedienungen wurden in allen vier Läufen ausgeführt. Desktop: Megamenü überfahren und Megamenü klicken je 23 mal ja. Mobil: Schublade und Untermenü je 23 mal ja. Escape 46 mal ja (beide Geräte). Akkordeon öffnen und schließen: je 23 mal ja und 23 mal „nicht gefunden“ von 46 Durchläufen; in 12 Ansichten gibt es kein Akkordeon (`/artikel`, `/artikel/beispiel-schluesselkasten`, `/rechtliches/agb`, `/rechtliches/impressum`, `/service-und-termin/vor-ort`, `/sicherheitstechnik/sicherheitscheck`, `/standorte/berlin`, H01, H04, H10, H11, H12). Weiter und Zurück: nur H07 (ja, ja). Fehler: 0.

Übergänge beim Bedienen werden erfasst: `animationen.mjs` Zeile 43 zählt `transitionstart` über die ganze Laufzeit, Zeile 16 sagt „die Zählung umfasst sie“ (Bedienung). Die Zähler je Ansicht stehen in den JSON-Feldern `uebergang`. Der E6-Nachtrag hatte noch 0 Übergänge in allen Ansichten; jetzt sind es 22 bis 23 Ansichten mit Zählern.

## 3 · Stichprobe Übergänge (15 Stellen aus 15 Ordnern)

Grundlage: `grep -rn "transition" src --include=*.tsx | grep -v test` (150 Zeilen, Kopie unter `/root/sm24-bilder/e7-c/transitions-register.txt`). Ausgewählt: je eine Zeile aus 15 verschiedenen Ordnern.

| # | Stelle | Übergang (Code) | Eintrag | Ergebnis |
|---|---|---|---|---|
| 1 | `src/components/flow/flow-shell.tsx:90` | `transition-colors duration-quick ease-standard` | B-10 | passt (N-4 behoben) |
| 2 | `src/components/ui/button.tsx:18` | `transition duration-quick ease-standard active:scale-druck` | B-05 | passt |
| 3 | `src/components/visual/generators/schliessplan.tsx:446` | `transition-colors duration-base ease-standard` | B-14 | passt |
| 4 | `src/components/visual/interaktiv/code-fundstelle-interaktiv.tsx:73` | `transition-colors duration-quick ease-standard` (Ortswahl) | B-29 | passt (Auswahlzustand) |
| 5 | `src/components/layout/site-footer.tsx:16` | `transition-colors duration-quick hover:text-primary` | B-06 | passt |
| 6 | `src/components/autoschluessel/termin-auswahl.tsx:140` | `transition-colors duration-quick` (Rahmen, Fläche) | B-29 | passt |
| 7 | `src/components/forms/controls.tsx:10` | `transition-colors duration-quick` (Eingabefelder) | kein Eintrag | Befund R-7 |
| 8 | `src/app/(site)/service-und-termin/page.tsx:194` | `transition-colors duration-quick group-hover:text-area-strong` | B-06 | passt |
| 9 | `src/app/(site)/standorte/page.tsx:55` | `transition-colors duration-quick` (Zeile) | B-06 | passt |
| 10 | `src/app/(site)/ratgeber/page.tsx:71` | `transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1` | B-06 | passt |
| 11 | `src/app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx:127` | `transition-colors duration-quick ease-standard` (Schalter) | B-29 | passt |
| 12 | `src/app/(site)/autoschluessel/marken/page.tsx:149` | `transition-transform group-hover:translate-x-0.5` (ohne Dauer) | B-06 | Befund R-5 |
| 13 | `src/app/(site)/artikel/artikel-liste.tsx:135` | `transition-colors` (Filter-Schalter, ohne Dauer) | B-29 | Befund R-6 |
| 14 | `src/app/(site)/kasse/page.tsx:43` | `transition-colors duration-quick hover:text-primary` | B-06 | passt |
| 15 | `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx:95` | `transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1` | B-06 | passt |

Ergebnis Stichprobe: 12 passen, 3 Befunde (7, 12, 13).

## 4 · Dauern und Auslöser am Code (Stichprobe der Einträge)

| Eintrag | Geprüft am Code | Ergebnis |
|---|---|---|
| B-01 | `profilschnitt.tsx:52` (0,3 s, 1,1 s), `fraesbahn-bewegung.tsx:133–151` | passt. Ende 1,4 s |
| B-02 | `profillinie.tsx:98,117` (0,6 s) | passt |
| B-03 | Keyframes `scaleY` und `scale` in `globals.css` | passt |
| B-04 | Keyframe 8 px, `schluessel-nach-vorlage/page.tsx:353` (aus E6) | passt |
| B-05 | `button.tsx:18` `duration-quick`, `tailwind.config.ts` `druck: 0.98` | passt |
| B-06 | Pfeile `translate-x-1` `quick`, Ausnahme Marken-Seiten | Befund R-5 |
| B-07 | `site-header.tsx:165, 355–403` | Befund R-1 bis R-3 |
| B-08 | `site-header.tsx:321` `onMouseEnter` (Überfahren), `:336` `rotate-180` `duration-base`, `tailwind menue-ein` `base` | passt (N-3 gedeckt, Text 1.17) |
| B-09 | `accordion.tsx:37` `duration-base`, `:49` `sm24-fade` `[--sm24-duration:var(--dauer-quick)]` | passt |
| B-10 | `flow-shell.tsx:142` `duration-slow`, `:90` `duration-quick` | passt |
| B-11 | Keyframe `sm24-schritt-vor` 8 px, `base` | passt |
| B-12 | `check-draw.tsx:24–26` (Kreis 0,05 + 0,6 s, Haken 0,55 + 0,35 s) | passt, Ende 0,9 s bei Start 0 |
| B-13 | `globals.css:706–712` (`animation-duration: var(--dauer-slow)`), `seitenwechsel.tsx` | Dauer passt, Messung offen (R-8) |
| B-14 | `schliessplan.tsx:446,452` `base` `standard` | passt |
| B-15 | `live-schluessel.tsx:47` `schleier-ein` (`quick`), `.sm24-nur-zeichnen` | passt |
| B-16 | `code-fundstelle-interaktiv.tsx:91` `schleier-ein` (`quick`), `.sm24-ruhig` | passt |
| B-17 | `zylinder-mass-live.tsx:39` `schleier-ein` (`quick`) | passt |
| B-18 | `tuer-schutz.tsx:291–293, 337` (Staffel 0,12 s, 5 Bauteile, Ende 1,58 s) | passt |
| B-19 | `tailwind.config.ts` `spin var(--dauer-scene)` (900 ms) | passt |
| B-20 | `site-header.tsx:193` (`quick`), `artikel-liste.tsx:156` (`quick`), `warenkorb-ansicht.tsx` (`schleier-ein`) | passt |
| B-21 | `schluessel.tsx:137–150` (`koerperStaffel` 0,08 s, `koerperDauer` 0,4 s), `:165–166` (Funk 1,0 bis 1,2 s, Verzögerung 0,3 s) | passt, Ende höchstens 1,5 s |
| B-22 | `generators/code-fundstelle.tsx` (Fundstelle vorhanden, Dauer nicht gesondert geprüft) | offen (nur Fundstelle belegt) |
| B-23 | `ablauf.tsx:63–67` (`LINIE_DAUER` 0,6 s, `STAFFEL` 0,12 s, `EINBLENDUNG` 0,4 s), Ende höchstens 1,48 s bei 5 Stationen | passt (< 1,6 s) |
| B-24 | `globals.css:668, 684–698` (Keyframes scaleY und `sm24-lesen-aktiv`) | passt (Stichprobe) |
| B-25 | `globals.css:481–500, 615–652` | passt |
| B-26 | `einsatzradius.tsx:36–37, 66–102` (Kreis 0,1 s + 0,6 s; Maßlinie 0,7 s + 0,28 s; Pfeil 0,95 s + 0,6 s = 1,55 s) | passt (≤ 1,6 s) |
| B-27 | `zutritt-signal.tsx` (Ende 1,60 s, siehe N-1), `tuer-schutz.tsx` (1,58 s), `profilschnitt.tsx` (1,4 s) | passt, Grenze 1,6 s erreicht bei zutritt-signal |
| B-28 | `mobile-action-bar.tsx:58` `duration-quick` (Beschriftung), `:66` `duration-base ease-standard` (Markierung) | passt (N-5 gedeckt) |
| B-29 | `termin-auswahl.tsx:140`, `cookie-einstellungen.tsx:127`, `code-fundstelle-interaktiv.tsx:73` | passt, Ausnahme R-6 (Filter-Schalter ohne Dauer) |

## 5 · Vergleich mit E6-PRUEFER-C-register-nachtrag.md (N-1 bis N-5, Befund 12)

Legende: jetzt gedeckt durch B-xx · behoben in Datei:Zeile · offen.

| Nr. | Stand E6 | Stand jetzt | Beleg |
|---|---|---|---|
| N-1 | `zutritt-signal` Ende ca. 2,45 s (Funk-Bögen 1,6 bis 2,0 s, Gruppenverzögerung 0,45 s geerbt) | **behoben in Datei:Zeile**. Funk-Bögen 0,9 bis 1,1 s (`zutritt-signal.tsx:299`, `:306`), jeweils `motionStyle(0, …)`. Diese setzen `--sm24-delay: 0s` explizit (`sekunden(0)` liefert „0s“, truthy), daher erben sie die Gruppenverzögerung 0,45 s nicht. Gesamtende: Leser 0,75 + 0,6 = 1,35 s (`:314`); Status 1,0 + 0,6 = 1,60 s (`:328`); Haken 1,2 + 0,4 = 1,60 s (`:337`). Grenze 1,6 s wird genau erreicht, nicht überschritten. **offen (Text)**: KERN 1.17 nennt „zutritt-signal endet ≤ 1,55 s“, der Code endet bei 1,60 s. Sinnvoll wäre „≤ 1,6 s“ im Text. | `src/components/visual/generators/zutritt-signal.tsx:294–337`; `_werkstatt/KERN.md:216,217` (B-26/B-27 Text) und `:331` (1.17) |
| N-2 | B-21 nennt Funk-Bögen 1,6 s, Code 1,0 bis 1,2 s | **gedeckt durch B-21** (KERN.md:211 „1,0–1,2 s“). Code `schluessel.tsx:166` `motionStyle(0.3, 1 + i * 0.1)` passt, Ende 1,3 bis 1,5 s | `_werkstatt/KERN.md:211`; `src/components/visual/generators/schluessel.tsx:166` |
| N-3 | B-08 nennt Klick und Tastatur, Code öffnet auch beim Überfahren | **gedeckt durch B-08** (KERN.md:198 „Überfahren (feiner Zeiger)“). Code `site-header.tsx:321` `onMouseEnter` | `_werkstatt/KERN.md:198`; `src/components/layout/site-header.tsx:321` |
| N-4 | `flow-shell.tsx:90` `transition-colors` ohne Dauer-Token | **behoben in Datei:Zeile**. Jetzt `duration-quick ease-standard` | `src/components/flow/flow-shell.tsx:90` |
| N-5 | `mobile-action-bar.tsx:58` Farbwechsel `quick` nicht im Text | **gedeckt durch B-28** (KERN.md:218 „Beschriftung der Aktionsleiste wechselt die Farbe quick“) | `_werkstatt/KERN.md:218`; `src/components/layout/mobile-action-bar.tsx:58` |
| Befund 12 | Übergänge beim Bedienen nicht erfasst (Messlücke) | **teilweise gedeckt**. Messung jetzt mit Übergängen je Ansicht (Zähler inkl. Bedienung, `animationen.mjs:43`). Gemessen und gedeckt: Megamenü (B-08, `menue-ein`), Schublade (B-07, `schublade-ein`), Schrittwechsel (B-11, `sm24-schritt-vor`/`-zurueck`), Ladeanzeige (B-19). **offen**: Hover und Fokus einzelner Karten und Links werden nicht bedient (nur Megamenü überfahren), B-13 (ViewTransition, siehe R-8), B-07 Ausgang (R-3) | `_werkstatt/protokolle/E7-PRUEFER-C-animationen.log`, JSON `uebergang` und `bedienung` |

## 6 · Neue Befunde (R-n) aus dieser Nachlese

| Nr. | Befund | Beleg |
|---|---|---|
| R-1 | Der Schleier hinter der Schublade (`animate-schleier-ein`, `quick`) ist im Register nicht beschrieben. B-07 nennt nur „Deckkraft base/enter“ für die Schublade. Die Deckkraft kommt tatsächlich aus diesem Schleier. Zuordnung: nur über den Keyframe-Namen (B-16, B-17, B-20 passen nicht). | `src/components/layout/site-header.tsx:392`; `_werkstatt/KERN.md:197` |
| R-2 | B-07 „Öffnen als Transition“: Die Schublade öffnet sich über die Keyframe-Animation `animate-schublade-ein` (nur `transform`, `base`), nicht über eine CSS-Transition. Kommentar im Code sagt ebenfalls „als Transition“. Begriff im Register an den Code angleichen. | `src/components/layout/site-header.tsx:165,403`; `tailwind.config.ts` (Keyframe `schublade-ein`); `_werkstatt/KERN.md:197` |
| R-3 | B-07 „raus quick/exit“: Im Code gibt es keinen Ausgangs-Übergang. Die Schublade wird beim Schließen ausgehängt („Wird beim Öffnen eingehängt“). **offen**: Entweder Text streichen oder Ausgang im Code bauen. | `src/components/layout/site-header.tsx:363` (MobilSchublade), `_werkstatt/KERN.md:197` |
| R-4 | `menue-ein` im Untermenü der Schublade (mobil, alle Ansichten ×1) ist im Text von B-07 nicht genannt; B-08 nennt nur das Megamenü. Zuordnung offen. | `src/components/layout/site-header.tsx:480` |
| R-5 | Pfeile auf den Marken-Seiten: `transition-transform group-hover:translate-x-0.5` ohne Dauer-Token. Das ergibt 2 px und 150 ms (Tailwind-Standard). B-06 verlangt `translateX(4px)` und `quick` (180 ms). Abweichung zwischen Text und Code. | `src/app/(site)/autoschluessel/marken/page.tsx:149`; `src/app/(site)/autoschluessel/marken/[make]/page.tsx:345`; `_werkstatt/KERN.md:196` |
| R-6 | Filter-Schalter Artikel-Liste: `transition-colors` ohne Dauer-Token (150 ms statt `quick`). Eintrag B-29 nennt `quick`. | `src/app/(site)/artikel/artikel-liste.tsx:135`; `_werkstatt/KERN.md:219` |
| R-7 | Eingabefelder: `transition-colors duration-quick` in `controls.tsx:10`. Kein Eintrag deckt Eingabefelder (B-06 nennt Karten und Links, B-29 Optionen und Schalter). | `src/components/forms/controls.tsx:10`; `_werkstatt/KERN.md:196,219` |
| R-8 | B-13 (ViewTransition): Die Dauer stimmt (`globals.css:707` `--dauer-slow`). Eine Messung fehlt: `transitionstart` erfasst die ViewTransition nicht, und die Bedienung im Lauf löst keinen Seitenwechsel aus. **offen (Messlücke)**. | `src/app/(site)/globals.css:706–712`; `src/components/visual/motion/seitenwechsel.tsx:26` |

## 7 · Schritt 3: SVG

Protokolle: `_werkstatt/protokolle/E7-PRUEFER-C-svg.log` (haupt, uebrige; EXIT 0 beide). JSON `/root/sm24-bilder/e7-c/svg-haupt.json`, `svg-uebrige.json`.

| Prüfung | Haupt (12 Ansichten) | Übrige (11 Ansichten) | Ergebnis |
|---|---|---|---|
| Dateien mit Befund | 1: `src/app/(site)/icon.svg` (Kommentar, 2 XML-Kommentare, 1171 Bytes) | dieselbe Datei | Befund (nicht sichtbar, aber im Protokoll) |
| unbenannte sichtbare SVG | 0 je Ansicht | 0 je Ansicht | keine |
| doppelte `id` | 0 je Ansicht | 0 je Ansicht | keine |
| lucide-Reste | 0 je Ansicht | 0 je Ansicht | keine |
| Familie „Icons (eine Familie)“ | Summe 454 (von 528 SVG) | Summe 364 (von 410 SVG) | Werkzeugkategorie, siehe unten |
| Familie „Grafiken“ (role=img) | Summe 38 | Summe 16 | Werkzeugkategorie |
| Familie „andere“ | Summe 36 | Summe 30 | Profillinien (`src/components/visual/profillinie.tsx`, `shrink-0 overflow-visible`, dekorativ, aria-hidden) |

Grep `grep -rln "lucide-react" src package.json`: kein Treffer (Ergebnis: leer, Erwartung erfüllt).

Die Familie „Icons (eine Familie)“ ist die Kategorie des Werkzeugs `svg-pruefung.mjs`. Ich habe sie nicht gegen die Attribute nachgezählt (`data-sm24-icon` taucht in 5 Dateien auf).

## 8 · Offene Punkte

- R-1 bis R-8 (Abschnitt 6), N-1 Text-Teil (KERN 1.17 „≤ 1,55 s“ gegen Code 1,60 s), Befund 12 Teil Hover und Fokus.
- Bedienung Akkordeon in 12 von 23 Ansichten nicht gefunden (`nein`), dort ist B-09 nicht gemessen. Schritt-Bedienung Weiter und Zurück nur an H07 (ja).
- Die Protokollwerkzeuge zählen Übergänge je Eigenschaft, nicht je Element. Die Zuordnung der Zeilen in Abschnitt 1 ist deshalb eine Ableitung aus Code und Stichprobe, keine Element-Messung.
- B-22, B-24 und B-28 nur stichprobenartig am Code geprüft.

Keine Projektdatei geändert, nichts committet, keine Sperrdatei gesetzt, nichts gelöscht.
