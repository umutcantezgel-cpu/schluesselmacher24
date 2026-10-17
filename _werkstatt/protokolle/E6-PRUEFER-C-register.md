# E6-PRUEFER-C · Teil 5 · Register und SVG

Lauf: 2026-10-17 · Server http://localhost:3000 (`next start`, Build addae34) · Sperre nicht gesetzt (Teil 5 verlangt keine).

Protokolle: `_werkstatt/protokolle/E6-PRUEFER-C-animationen.log`, `_werkstatt/protokolle/E6-PRUEFER-C-svg.log`.
JSON: `/root/sm24-bilder/e6-c/animationen-desktop.json`, `/root/sm24-bilder/e6-c/animationen-mobil.json`, `/root/sm24-bilder/e6-c/animationen-uebrige.json`, `/root/sm24-bilder/e6-c/svg-haupt.json`, `/root/sm24-bilder/e6-c/svg-uebrige.json`.
Register: `_werkstatt/KERN.md`, K-007, B-01 bis B-26.

Hinweis zum Umfang: Die Animationen für `--routen <ALLE_U>` liefen nur am Gerät Desktop (so wie der Teil es nennt, ohne Gerätezusatz). Mobil wurde nur für H01 bis H12 erfasst.

Beobachtet im Lauf: 15 Keyframe-Namen und 3 WAAPI-Einträge. Unbekannte Keyframes: 0. Übergänge (`transitionstart`): 0 in allen Ansichten, weil der Lauf nur lädt und scrollt.

## 1 · Keyframe- und WAAPI-Register

Zahlen je Ansicht: Desktop, bei Abweichung Mobil in Klammern. Fundstellen sind Dateien unter `src/` (Zeilen wo genannt).

| Keyframe oder WAAPI | Ansichten (Anzahl) | Fundstellen im Code | Registereintrag |
|---|---|---|---|
| sm24-fade | H01 1 · H02 1 · H06 1 · H08 5 · H09 1 · H12 8 · /service-und-termin 18 · /standorte/berlin 1 · /gleichschliessende-zylinder 1 · /autoschluessel/schluesselbart-fraesen 2 · /elektronische-zutrittsloesungen 1 | `components/ui/accordion.tsx:49`; `app/(site)/service-und-termin/page.tsx:291,318,337,356`; `app/(site)/kasse/kasse-formular.tsx:387`; `app/(site)/schluessel-nach-code/shop-liste.tsx:378`; `components/visual/generators/ablauf.tsx:173–285`; `components/visual/einsatzradius.tsx:89`; `components/visual/generators/profilschnitt.tsx:195`; `components/visual/generators/schliessplan.tsx:737` | B-09 (Akkordeon-Inhalt), B-23 (Beschriftung Ablauf), B-26 (Ort), B-01 (Fräser). Schliessplan 737: nur teilweise, siehe Befund 3 |
| sm24-draw | H01 27 (mobil 15) · H02 7 · H03 9 · H05 8 · H06 10 · H08 32 · H09 6 · H12 6 · /gleichschliessende-zylinder 27 · /service-und-termin 2 · /artikel 1 · /standorte/berlin 3 · /artikel/beispiel-schluesselkasten 2 · /autoschluessel/schluesselbart-fraesen 2 · /elektronische-zutrittsloesungen 4 · /service-und-termin/vor-ort 6 | `motion/draw-on.tsx:73`; `visual/profillinie.tsx:95,113`; `motion/check-draw.tsx:61,68`; `generators/code-fundstelle.tsx:84,336`; `generators/ablauf.tsx:163,248`; `einsatzradius.tsx:63,73`; `generators/schluessel.tsx:343,518,539`; `generators/profilschnitt.tsx:177`; `generators/stiftzuhaltung.tsx:376`; `generators/tuer-schutz.tsx:291`; `generators/zylinder-mass.tsx:252,259`; `generators/schliessplan.tsx:446,452,456`; `generators/zutritt-signal.tsx:335` | B-02 (Profillinie), B-12 (Haken), B-22 (Code-Fundstelle), B-23 (Ablauf), B-26 (Einsatzradius), B-21 (Schlüssel), B-25 (Stifte), B-01 (Profil Startseite). Teilweise oder ohne Eintrag: tuer-schutz 291 (Befund 5), schliessplan (Befund 3), zylinder-mass (Befund 2), zutritt-signal (Befund 1) |
| sm24-reveal | H01 7 (mobil 6) · H02 8 · H03 10 · H06 2 · H08 4 · /gleichschliessende-zylinder 10 · /artikel/beispiel-schluesselkasten 1 · /elektronische-zutrittsloesungen 10 | `motion/reveal.tsx:34`; `motion/draw-on.tsx:67`; `generators/schluessel.tsx:499,505,552`; `autoschluessel/schluesselarten-reihe.tsx:70`; `app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:360`; `app/(site)/schluessel-nach-vorlage/page.tsx:353`; `app/(site)/elektronische-zutrittsloesungen/page.tsx:475`; `generators/zylinder-mass.tsx:177,223,276,291`; `generators/zutritt-signal.tsx:234,289,294` | B-04 (Abschnitt), B-21 (Schlüsselarten, Modellseite). zylinder-mass und zutritt-signal ohne Eintrag (Befunde 1 und 2). Vorlage-Staffel: Befund 13 |
| sm24-pop | H01 41 (mobil 19) · H02 30 · H03 42 · H05 2 · H06 8 · H08 43 · H09 5 · H12 3 · /gleichschliessende-zylinder 17 · /service-und-termin 5 · /service-und-termin/vor-ort 5 · /artikel 1 · /standorte/berlin 3 · /artikel/beispiel-schluesselkasten 6 · /elektronische-zutrittsloesungen 6 | `generators/ablauf.tsx:106`; `generators/tuer-schutz.tsx:336`; `generators/code-fundstelle.tsx:350,376`; `generators/schluessel.tsx:529`; `generators/zylinder-mass.tsx:266,271`; `motion/check-draw.tsx:59`; `einsatzradius.tsx:78,82,102`; `generators/zutritt-signal.tsx:314,327`; `generators/schliessplan.tsx:464,466,468`; `generators/stiftzuhaltung.tsx:271`; `components/layout/site-header.tsx:193`; `app/(site)/artikel/artikel-liste.tsx:156` | B-23, B-18, B-22, B-21, B-12, B-26, B-25 (Prüfmarken), B-20 (artikel-liste; site-header 193 mit Dauerabweichung, Befund 10c). zylinder-mass, zutritt-signal, schliessplan: Befunde 1 bis 3 |
| sm24-aufdecken | H01 1 · H06 1 · /autoschluessel/schluesselbart-fraesen 1 | `generators/profilschnitt.tsx:147` (über Startseite, `app/(site)/schluessel-nach-code/[slug]/page.tsx`, `visual/registry.tsx`) | B-01 (nur Startseite genannt). H06 und Schlüsselbart-Seite ohne Eintrag: Befund 4 |
| sm24-dash | H01 3 (nur Desktop) · H02 6 · H03 3 · /elektronische-zutrittsloesungen 12 | `generators/schluessel.tsx:166`; `generators/zutritt-signal.tsx:298,305` | Schlüssel: B-21 teilweise (Signalbögen nicht genannt, Befund 6). Zutritt-Signal: ohne Eintrag (Befund 1) |
| sm24-scrub-y | H01 2 · H02 2 · H12 2 (nur Desktop) | `app/(site)/page.tsx:307`; `app/(site)/autoschluessel/page.tsx:491`; `globals.css:614` (Leiste) | B-03 (Startseite, Autoschlüssel-Ablauf); H12 Leiste: B-24 |
| sm24-scrub-marke | H01 10 · H02 10 | `app/(site)/page.tsx:310`; `app/(site)/autoschluessel/page.tsx:496` | B-03 |
| sm24-lesen-aktiv | H12 16 | `app/(site)/ratgeber/[slug]/page.tsx:99,159`; `globals.css:630–644` | B-24 |
| schleier-ein | H07 3 · /artikel/beispiel-schluesselkasten 1 | `components/layout/site-header.tsx:330` (Drawer-Überlagerung); `visual/interaktiv/zylinder-mass-live.tsx:39`; `visual/interaktiv/live-schluessel.tsx:47`; `visual/interaktiv/code-fundstelle-interaktiv.tsx:91`; `app/(site)/warenkorb/warenkorb-ansicht.tsx:296,497,511,564,649`; `app/(site)/artikel/[slug]/artikel-kauf.tsx:209`; `components/flow/flow-shell.tsx:125,213` | B-07 (Drawer), B-15, B-17, B-20. B-16 mit Dauerabweichung (Befund 10b). Auslöser beim Laden: Befund 11 |
| spin | H10 1 | `app/(site)/warenkorb/warenkorb-ansicht.tsx:135`; `components/ui/button.tsx:86`; `autoschluessel/termin-auswahl.tsx:103`; `components/forms/photo-upload.tsx:405` | B-19 (Ladeanzeige) |
| sm24-schluessel-ein | /gleichschliessende-zylinder 2 | `generators/stiftzuhaltung.tsx:342`; `globals.css:578` | B-25 |
| sm24-stift-heben | /gleichschliessende-zylinder 10 | `generators/stiftzuhaltung.tsx:354`; `globals.css:588` | B-25 |
| sm24-feder-heben | /gleichschliessende-zylinder 10 | `generators/stiftzuhaltung.tsx:330`; `globals.css:594` | B-25 |
| sm24-erscheinen | /gleichschliessende-zylinder 2 | `generators/stiftzuhaltung.tsx:413`; `globals.css:598` | B-25 (Prüfmarken) |
| WAAPI g.sm24-fade (Fräser, `[data-fraesbahn]`) | H01 (Desktop und Mobil) | `visual/interaktiv/fraesbahn-bewegung.tsx:133`; `generators/profilschnitt.tsx:195–196` | B-01 (Fräser folgt per transform) |
| WAAPI path.stroke-foreground (Fräserrad) | H01 (Desktop und Mobil) | `fraesbahn-bewegung.tsx:139` | B-01, nur teilweise (Radrotation nicht genannt, Befund 7) |
| WAAPI g (Abheben, `[data-fraesabheben]`) | H01 (Desktop und Mobil) | `fraesbahn-bewegung.tsx:148` | B-01 (hebt danach ab) |
| menue-ein | nicht beobachtet (Megamenü nur nach Klick) | `components/layout/site-header.tsx:230,387`; `tailwind.config.ts` | B-08 (Megamenü). Zeile 387 im Drawer: B-08-Muster, nicht eigens genannt |
| schublade-ein | nicht beobachtet (Drawer nur mobil nach Klick) | `components/layout/site-header.tsx:341` | B-07 |
| sm24-schritt-vor / -zurueck | nicht beobachtet (Schrittwechsel nicht im Lauf) | `components/flow/flow-shell.tsx:181–182`; `globals.css:395–400, 481–486` | B-11 |
| sm24-scrub-x | nicht beobachtet; keine Verwendung im Code (`.sm24-scrub-x` nirgends gesetzt) | `globals.css:410, 521–537` | kein Eintrag, Befund 8 |
| bounce, ping, pulse | nicht beobachtet; keine Verwendung im Code (grep ohne Treffer) | Tailwind-Standardwerte | kein Eintrag nötig |

## 2 · Übergänge (Stichprobe, statisch im Code)

Der Lauf löst keine Hover-, Fokus- oder Klickzustände aus. Deshalb ist die Prüfung hier statisch: 14 Zeilen-Stellen aus den 53 Dateien mit `transition` (Auswahl, nicht vollständig).

| Stelle | Übergang | Registereintrag | Ergebnis |
|---|---|---|---|
| `components/ui/button.tsx:18` | `transition duration-quick … active:scale-druck` | B-05 | Dauer abweichend, Befund 10a |
| `components/ui/button.tsx:52` | `zeiger:group-hover:translate-x-1`, `duration-quick` | B-06 | zugeordnet |
| `components/ui/accordion.tsx:31` | `hover:bg…`, `transition-colors duration-quick` | B-06 | zugeordnet |
| `components/ui/accordion.tsx:37` | Pfeil `transition-transform duration-base` | B-09 | zugeordnet |
| `components/layout/site-header.tsx:163` | Pfeil Megamenü `rotate-180`, `duration-base` | B-08 | teilweise, Befund 9 |
| `components/layout/site-header.tsx:171` | Bemaßungsstrich `scale-x`, `duration-base` | keiner | ohne Eintrag, Befund 9 |
| `components/layout/site-header.tsx:307` | `zeiger:group-hover:translate-x-1`, `duration-quick` | B-06 | zugeordnet |
| `components/ui/card.tsx:30` | `zeiger:hover:border…`, `zeiger:hover:shadow-raised`, `duration-quick` | B-06 | zugeordnet |
| `components/flow/flow-shell.tsx:142` | `scaleX`, `duration-slow ease-standard` | B-10 | zugeordnet |
| `components/layout/mobile-action-bar.tsx:66` | Markierung `scale-x`, `duration-base` | keiner | ohne Eintrag, Befund 9 |
| `generators/schliessplan.tsx:446,452,464,466` | `transition-colors` / `transition-opacity` ohne Dauerklasse | B-14 (base) | Dauer abweichend, Befund 10d |
| `autoschluessel/termin-auswahl.tsx:140,175` | `transition-colors duration-quick` (Auswahlknöpfe) | keiner | ohne Eintrag, Befund 9 |
| `app/(site)/service-und-termin/page.tsx` (Summary) | `transition-colors duration-quick hover:text-primary` | B-06 | zugeordnet |
| `components/layout/breadcrumbs.tsx:10` · `site-footer.tsx:16` | Link-Hover `hover:text-primary` | B-06 | zugeordnet |

## 3 · Befunde (Register)

Befunde sind Stellen, die keinem Eintrag zugeordnet werden können oder deren Dauer vom Eintrag abweicht. Das Urteil fällt der Endprüfer.

1. Ohne Eintrag: `visual/generators/zutritt-signal.tsx` (Einstieg und Funk-Bögen: reveal 234, 289, 294; dash 298, 305; pop 314, 327; draw 335) auf /elektronische-zutrittsloesungen (dash 12, reveal 10, pop 6, draw 4). Kein Eintrag beschreibt die Zutritt-Zeichnung oder den Funk-Signalstrich.
2. Ohne Eintrag: `visual/generators/zylinder-mass.tsx` (Einstieg: reveal 177, 223, 276, 291; draw 252, 259; pop 266, 271) auf / (H01) und /gleichschliessende-zylinder (draw 27, pop 17, reveal 10). B-17 beschreibt nur die Überblendung bei Maßänderung im Konfigurator.
3. Teilweise: `visual/generators/schliessplan.tsx` (Einstieg: draw 446, 452, 456; pop 464, 466, 468; fade 737) auf H01, H08 (draw 32, pop 43, fade 5) und /gleichschliessende-zylinder. B-14 beschreibt nur den Wechsel (Deckkraft und Farbe base), nicht den Einstieg mit Staffel.
4. Teilweise: `profilschnitt.tsx:147` (sm24-aufdecken) auf H06 und /autoschluessel/schluesselbart-fraesen (über `visual/registry.tsx`). B-01 nennt die Aufdeckung nur im Startseiten-Hero.
5. Teilweise: `generators/tuer-schutz.tsx:291` (sm24-draw der Türlinien) auf H09 und /service-und-termin/vor-ort. B-18 nennt nur die Marken (sm24-pop).
6. Teilweise: `generators/schluessel.tsx:166` (sm24-dash, Funk-Bögen) auf H02 (6) und H03 (3). B-21 nennt keinen Signalstrich.
7. Teilweise: `fraesbahn-bewegung.tsx:139` (WAAPI-Radrotation) auf H01. B-01 nennt Fräser und Abheben, nicht das Rad.
8. Ohne Eintrag und ohne Verwendung: Keyframe `sm24-scrub-x` (`globals.css:410`) ist definiert, aber im Code nirgends als Klasse gesetzt.
9. Übergänge ohne Eintrag oder teilweise: `site-header.tsx:171`, `mobile-action-bar.tsx:66`, `termin-auswahl.tsx:140,175`. Teilweise: `site-header.tsx:163` (Pfeil dreht; B-08 nennt nur Deckkraft und translateY).
10. Registerabweichungen (Dauer, Eintrag gegen Code):
    a. B-05 nennt für den Knopfdruck `instant` (120 ms). `button.tsx:18` setzt `duration-quick` (180 ms) für die Skalierung.
    b. B-16 nennt für Code-Fundstelle umschalten `base` (280 ms). `code-fundstelle-interaktiv.tsx:91` nutzt `animate-schleier-ein` (quick, 180 ms).
    c. B-20 nennt für den Warenkorb-Zähler `sm24-pop quick`. `site-header.tsx:193` setzt keine Dauer, also gilt `--dauer-enter` (600 ms).
    d. B-14 nennt Deckkraft und Farbe `base`. `schliessplan.tsx:446, 452` (transition-colors) und `464, 466` (transition-opacity) haben keine Dauerklasse, also Tailwind-Standard 150 ms.
11. Auslöser beim Laden: `schleier-ein` läuft ohne Wechsel auf H07 (3-mal) und auf /artikel/beispiel-schluesselkasten (`artikel-kauf.tsx:209`, 1-mal). B-17 und B-20 nennen als Auslöser nur die Änderung.
12. Nicht erfasst im Lauf: menue-ein, schublade-ein, sm24-schritt-vor und -zurueck, Hover- und Fokus-Übergänge, B-13 (ViewTransition in `visual/motion/seitenwechsel.tsx`, kein Seitenwechsel im Lauf).
13. Staffel ohne Eintrag (gering): `app/(site)/schluessel-nach-vorlage/page.tsx:353` setzt `sm24-reveal` mit Staffel 0,12 s je Foto-Karte. B-04 nennt keine Staffel.

## 4 · SVG-Prüfung

Dateien (alle `*.svg` unter `src/` und `public/`): 1 Datei mit Befund.
- `src/app/(site)/icon.svg`: Befund „Kommentar“ (Zeilen `<!-- Schlüsselkopf -->` und `<!-- Schlüsselschaft & Bärte -->`). Ohne Tool-Befund, aber als Hinweis: enthält feste Hex-Farben (`#0f172a`, `#1e293b`, `#60a5fa`, `#2563eb`, `#38bdf8`, `#334155`) und die ids `sm24-grad`, `sm24-key`.

Ansichten Desktop (Hauptansichten H01 bis H12, `svg-haupt.json`):

| Ansicht | SVG | Icons (data-sm24-icon) | Grafiken (role=img) | andere | benannt | unbenannt sichtbar | doppelte id | lucide |
|---|---|---|---|---|---|---|---|---|
| H01-start | 54 | 44 | 7 | 3 | 7 | 0 | 0 | 0 |
| H02-autoschluessel | 70 | 59 | 8 | 3 | 4 | 0 | 0 | 0 |
| H03-modell-golf | 36 | 29 | 4 | 3 | 4 | 0 | 0 | 0 |
| H04-assistent | 18 | 16 | 0 | 2 | 0 | 0 | 0 | 0 |
| H05-code-shop | 92 | 88 | 1 | 3 | 1 | 0 | 0 | 0 |
| H06-code-produkt | 34 | 27 | 4 | 3 | 4 | 0 | 0 | 0 |
| H07-zylinder-konfigurator | 33 | 29 | 2 | 2 | 2 | 0 | 0 | 0 |
| H08-schliessanlagen | 63 | 53 | 7 | 3 | 7 | 0 | 0 | 0 |
| H09-tuertechnik | 60 | 56 | 1 | 3 | 1 | 0 | 0 | 0 |
| H10-warenkorb | 21 | 18 | 1 | 2 | 0 | 0 | 0 | 0 |
| H11-kasse | 21 | 18 | 1 | 2 | 0 | 0 | 0 | 0 |
| H12-ratgeber | 26 | 17 | 2 | 7 | 2 | 0 | 0 | 0 |

Ansichten Desktop (ALLE_U, `svg-uebrige.json`):

| Ansicht | SVG | Icons | Grafiken | andere | benannt | unbenannt sichtbar | doppelte id | lucide |
|---|---|---|---|---|---|---|---|---|
| /gleichschliessende-zylinder | 58 | 48 | 7 | 3 | 7 | 0 | 0 | 0 |
| /service-und-termin | 50 | 45 | 2 | 3 | 2 | 0 | 0 | 0 |
| /artikel | 40 | 37 | 0 | 3 | 0 | 0 | 0 | 0 |
| /standorte/berlin | 31 | 27 | 1 | 3 | 1 | 0 | 0 | 0 |
| /sicherheitstechnik/sicherheitscheck | 18 | 16 | 0 | 2 | 0 | 0 | 0 | 0 |
| /rechtliches/agb | 15 | 13 | 0 | 2 | 0 | 0 | 0 | 0 |
| /artikel/beispiel-schluesselkasten | 33 | 29 | 1 | 3 | 1 | 0 | 0 | 0 |
| /autoschluessel/schluesselbart-fraesen | 41 | 37 | 1 | 3 | 1 | 0 | 0 | 0 |
| /elektronische-zutrittsloesungen | 83 | 77 | 3 | 3 | 3 | 0 | 0 | 0 |
| /rechtliches/impressum | 15 | 13 | 0 | 2 | 0 | 0 | 0 | 0 |
| /service-und-termin/vor-ort | 26 | 22 | 1 | 3 | 1 | 0 | 0 | 0 |

Die Spalte „andere“ (je Ansicht 2 bis 7) sind Profillinien: viewBox `0 0 87,2 10`, `0 0 125,6 16` und `0 0 100 16` mit `overflow-visible`. Das entspricht dem viewBox-Muster in `components/visual/profillinie.tsx` (Zeilen 85 und 104). Sie sind dekorativ (`aria-hidden`) und kein Befund.

Unbenannte sichtbare SVG: 0 in allen 23 Ansichten. Doppelte id: 0. lucide-Reste: 0.

## 5 · lucide

`grep -rln "lucide-react" src package.json`: kein Treffer (Erwartung erfüllt).

=== ENDE E6-PRUEFER-C-register ===
