# E6-PRUEFER-C · Teil 5 · Register-Nachtrag (Nachprüfung)

Lauf: 2026-10-17 · Server http://localhost:3000 (Build 2cdcbab laut Auftrag) · Repo-Stand: HEAD 99adb3d, `src/` und `_werkstatt/werkzeuge/` unverändert gegenüber 2cdcbab (`git diff --stat 2cdcbab HEAD -- src _werkstatt/werkzeuge _werkstatt/KERN.md` leer) · Sperre nicht gesetzt.

Bezugsdokumente: `_werkstatt/protokolle/E6-PRUEFER-C-register.md` (§3, Befunde 1 bis 13, Stand addae34) · `_werkstatt/KERN.md` Version 1.16, K-007, Einträge B-01 bis B-29 (Zeilen 189 bis 217), Änderungsliste Zeile 328 · Commit `2cdcbab` (`git show 2cdcbab -- src`).

Legende: **gedeckt** = Eintrag beschreibt die Stelle und passt zum Code · **behoben** = Code geändert · **offen** = weiter ohne Deckung oder Abweichung.

## 1 · Die 13 Registerbefunde (§3)

| Nr. | Befund | Stand jetzt | Beleg |
|---|---|---|---|
| 1 | `zutritt-signal` ohne Eintrag (reveal, dash, pop, draw) | **gedeckt durch B-27** (Eintrag nennt u. a. `zutritt-signal`). Dauer-Abweichung: B-27 sagt „je Zeichnung ≤ 1,6 s“; Code: Funk-Bögen `motionStyle(0, 1.6 + i * 0.2)` (1,6 / 1,8 / 2,0 s, `zutritt-signal.tsx:299`), Signalstrich `motionStyle(0, 2)` (`:306`), Gruppe mit `motionStyle(0.45)` (`:294`); Child-Verzögerung erbt `--sm24-delay` 0,45 s, Ende bis ca. 2,45 s. **offen (Dauer)** | KERN.md:215; `src/components/visual/generators/zutritt-signal.tsx:294,299,306` |
| 2 | `zylinder-mass` ohne Eintrag | **gedeckt durch B-27** (nennt `zylinder-mass` ausdrücklich); Maßänderung B-17 | KERN.md:205, :215; `generators/zylinder-mass.tsx:177,252,266` |
| 3 | `schliessplan` Einstieg (draw, pop, fade 737), nur B-14 für den Wechsel | **gedeckt durch B-27** (nennt `schliessplan`, Beschriftungen `sm24-fade`) und **B-14** (Wechsel, Dauer `base`) | KERN.md:202, :215; `generators/schliessplan.tsx:446,452,464,466` |
| 4 | `profilschnitt` `sm24-aufdecken` (H06, Schlüsselbart) ohne Eintrag | **gedeckt durch B-27** (gefräste Flächen `sm24-aufdecken`, Generator `profilschnitt` genannt); B-01 bleibt Startseite | KERN.md:215; `generators/profilschnitt.tsx:147` |
| 5 | `tuer-schutz` `sm24-draw` der Türlinien, B-18 nur Marken | **gedeckt durch B-27** (Linien und Kanten `sm24-draw`, `tuer-schutz` genannt); Marken B-18 | KERN.md:206, :215; `generators/tuer-schutz.tsx:291` |
| 6 | `schluessel` `sm24-dash` Funk-Bögen, B-21 ohne Signalstrich | **gedeckt durch B-21** (Ergänzung „Funk-Bögen der Funkschlüssel als sm24-dash“). Dauer-Abweichung: B-21 nennt „1,6 s“; Code `motionStyle(0.3, 1 + i * 0.1)` (1,0 / 1,1 / 1,2 s, `schluessel.tsx:167`, Bögen `funkboegen` Zeile 158). **Abweichung Text gegen Code** | KERN.md:209; `generators/schluessel.tsx:158,167` |
| 7 | WAAPI-Radrotation Fräser, B-01 ohne Rad | **gedeckt durch B-01** (Ergänzung „sein Rad dreht dabei linear (`rotate`, WAAPI)“). Code: `rad.animate([rotate(0deg), rotate(-540deg)], {...optionen, easing: 'linear'})`, `[data-fraesrad] > path` | KERN.md:189; `src/components/visual/interaktiv/fraesbahn-bewegung.tsx:136–141` |
| 8 | Keyframe `sm24-scrub-x` ungenutzt | **behoben**: Keyframe und Klassenregel aus `globals.css` entfernt (Commit 2cdcbab). Prüfung: `grep -rn "scrub-x" src _werkstatt/werkzeuge` ohne Treffer; `animationen.mjs` führt ihn nicht mehr in „bekannte Keyframes“ (22 Namen, Lauf-Protokolle) | `src/app/(site)/globals.css` (Diff 2cdcbab, 2 Stellen entfernt) |
| 9 | Übergänge ohne Eintrag oder teilweise | **gedeckt**: `site-header.tsx:171` (Bemaßungsstrich) durch **B-28**; `mobile-action-bar.tsx:66` (Markierung) durch **B-28**; `termin-auswahl` 140, 175 durch **B-29** (Datei liegt unter `src/components/autoschluessel/termin-auswahl.tsx`); `site-header.tsx:163` (Megamenü-Pfeil `rotate-180`, `duration-base`) durch **B-08** (Winkel 180° `base`). Teilweise, Befund (gering): `mobile-action-bar.tsx:58` Farbwechsel der Beschriftung `duration-quick` (B-28 nennt nur die Markierung). Neu: `flow-shell.tsx:90` ohne Dauer-Token, siehe Abschnitt 3 | KERN.md:196, :216, :217; `site-header.tsx:163,171`; `mobile-action-bar.tsx:58,66` |
| 10a | B-05 nennt `instant`, `button.tsx:18` `duration-quick` | **gedeckt**: B-05 jetzt `quick` (KERN.md:193); Code `button.tsx:18` `duration-quick` (unverändert). Text an Code angepasst | KERN.md:193; `src/components/ui/button.tsx:18` |
| 10b | B-16 nennt `base`, Code `animate-schleier-ein` (quick) | **gedeckt**: B-16 jetzt `animate-schleier-ein (quick)` (KERN.md:204). Code `code-fundstelle-interaktiv.tsx:91` `animate-schleier-ein`; Tailwind `schleier-ein` = `var(--dauer-quick)` (`tailwind.config.ts:211`) | KERN.md:204; `src/components/visual/interaktiv/code-fundstelle-interaktiv.tsx:91` |
| 10c | Warenkorb-Zähler ohne Dauer | **behoben im Code**: `sm24-pop [--sm24-duration:var(--dauer-quick)]`. Die CSS-Regel nutzt `var(--sm24-duration, var(--dauer-enter))` (`globals.css` ~Zeile 463), also greift der Override. B-20 nennt `quick` (KERN.md:208). Trefferzähler `artikel-liste.tsx:156` ebenfalls `[--sm24-duration:var(--dauer-quick)]` | `src/components/layout/site-header.tsx:193`; `src/app/(site)/artikel/artikel-liste.tsx:156` |
| 10d | Schließplan ohne Dauer-Klasse (Tailwind 150 ms) | **behoben im Code**: `transition-colors duration-base ease-standard` (446, 452), `transition-opacity duration-base ease-standard` (464, 466). B-14 nennt `base` `standard` (KERN.md:202) | `src/components/visual/generators/schliessplan.tsx:446,452,464,466` |
| 11 | `schleier-ein` beim Laden ohne Eintrag-Auslöser | **gedeckt**: B-17 nennt jetzt „erstes Anzeigen“ (KERN.md:205), B-20 „beim ersten Anzeigen“ für Summen (Artikelkauf, Kasse, Band der `FlowShell`) (KERN.md:208). Code: `zylinder-mass-live.tsx:39` ohne Bedingung, `artikel-kauf.tsx:209`, `flow-shell.tsx:125,213` | KERN.md:205, :208; die vier Stellen wie angegeben |
| 12 | Nicht erfasst im Lauf (menue-ein, schublade-ein, Schritt-Keyframes, Hover/Fokus, B-13) | **offen (Messlücke, kein Registerfehler)**: Einträge B-07, B-08, B-11, B-13, B-06 sind vorhanden. Der Lauf von heute erfasst weiterhin keine Übergänge (`transitionstart` 0 in allen Ansichten, weil nur geladen und gescrollt wird). Keine Änderung durch 2cdcbab | `_werkstatt/protokolle/E6-PRUEFER-C-animationen-nachtrag.log` (Spalte „Übergänge“ durchgehend „keine“) |
| 13 | `schluessel-nach-vorlage` Staffel 0,12 s ohne Eintrag | **gedeckt durch B-04**: Ergänzung „Fotostellen der Vorlage ≤ 120 ms je Stelle“ (KERN.md:192). Code `motionStyle(index * 0.12)` (`schluessel-nach-vorlage/page.tsx:353`) | KERN.md:192; `src/app/(site)/schluessel-nach-vorlage/page.tsx:353` |

Zusammenfassung (13 Befunde, Teilpunkte 10a bis 10d): behoben 3 (Befund 8, 10c, 10d) · gedeckt durch Eintrag 12 (Befunde 1 bis 7, 9, 10a, 10b, 11, 13) · offen 1 (Befund 12, Messlücke). Bei den gedeckten Befunden 1 und 6 bleibt eine Dauer-Abweichung zwischen Text und Code (siehe Abschnitt 4, N-1 und N-2); Befund 9 hat einen teilweisen Rest (N-5).

## 2 · Animationen nach Registereintrag (Schritt 2)

Protokolle: `_werkstatt/protokolle/E6-PRUEFER-C-animationen-nachtrag.log` (EXIT1, EXIT2, EXIT3 jeweils 0) · JSON `/root/sm24-bilder/e6-c/animationen-nachtrag-desktop.json`, `…-mobil.json`, `…-uebrige.json`.

Unbekannte Keyframes: **0** in allen drei Läufen (Desktop H01 bis H12, Mobil H01 bis H12, Desktop ALLE_U). Bekannte Keyframes: 22 (Lauf-Kopf). `sm24-scrub-x` taucht nicht mehr auf.

| Keyframe / WAAPI | Gesehen in (Lauf) | Zuordnung |
|---|---|---|
| sm24-draw | H01 bis H09, H12, ALLE_U | B-02, B-12, B-22, B-23, B-26, B-27 |
| sm24-pop | H01 bis H03, H05, H06, H08, H09, H12, ALLE_U | B-18, B-20, B-22, B-23, B-26, B-27 |
| sm24-reveal | H01 bis H03, H06, H08, ALLE_U | B-04, B-21, B-27 |
| sm24-fade | H01, H02, H06, H08, H09, H12, ALLE_U (`/service-und-termin` 18) | B-23 (Beschriftung), B-26, B-27 |
| sm24-aufdecken | H01, H06, `/autoschluessel/schluesselbart-fraesen` | B-01, B-27 |
| sm24-dash | H01, H02, H03, `/elektronische-zutrittsloesungen` | B-21, B-27 |
| sm24-scrub-y | H01, H02, H12 | B-03, B-24 (Leiste H12) |
| sm24-scrub-marke | H01, H02 | B-03 |
| sm24-lesen-aktiv | H12 | B-24 |
| schleier-ein | H07 (3), `/artikel/beispiel-schluesselkasten` (1) | B-16, B-17, B-20 |
| spin | H10 | B-19 |
| sm24-schluessel-ein, sm24-feder-heben, sm24-stift-heben, sm24-erscheinen | `/gleichschliessende-zylinder` | B-25 |
| WAAPI `g.sm24-fade` (Fräser), `path.stroke-foreground` (Rad), `g` (Abheben) | H01 Desktop und Mobil | B-01 |

Nicht beobachtet, aber in der Liste der bekannten Keyframes: menue-ein, schublade-ein, sm24-schritt-vor, sm24-schritt-zurueck (B-08, B-07, B-11), Befund 12.

Ergebnis Schritt 2: **keine Keyframe- oder WAAPI-Name ohne Eintrag.** Die Zuordnungen sind funktional (Fachgrafik-Einstieg über B-27), nicht über Klassennamen.

## 3 · Stichprobe Übergänge (Schritt 3)

Grundlage: `grep -rn "transition" src --include=*.tsx | grep -v test` = 150 Zeilen (Kopie `/root/sm24-bilder/e6-c/transitions-nachtrag.txt`). Auswahl 15 Stellen aus 15 verschiedenen Ordnern, Stand Code jetzt:

| # | Stelle | Übergang (Code) | Zuordnung | Ergebnis |
|---|---|---|---|---|
| 1 | `src/components/ui/button.tsx:18` | `duration-quick`, `active:scale-druck` (0,98) | B-05 (quick) | passt |
| 2 | `src/components/layout/mobile-action-bar.tsx:58` | Beschriftung Farbe `duration-quick` bei aktiv | B-28 nennt nur die Markierung (66) | **teilweise (Befund)** |
| 3 | `src/app/(site)/service-und-termin/page.tsx:330` | `<summary>` Hover-Farbe `duration-quick` | B-06 | passt |
| 4 | `src/app/(site)/tuer-und-schliesstechnik/page.tsx:288` | Zeilen-Hover Farbe `duration-quick` | B-06 | passt |
| 5 | `src/app/(site)/standorte/page.tsx:69` | Zeilenpfeil `translate-x-1`, `duration-quick` | B-06 | passt |
| 6 | `src/components/flow/flow-shell.tsx:90` | `transition-colors` ohne Dauer-Token (Tailwind 150 ms) | kein Eintrag eindeutig (B-10 nur Balken) | **Befund** |
| 7 | `src/components/visual/generators/schliessplan.tsx:452` | `transition-colors duration-base ease-standard` | B-14 | passt (nach 2cdcbab) |
| 8 | `src/components/forms/option-card.tsx:67` | Optionskarte `duration-quick` | B-29 | passt |
| 9 | `src/components/forms/controls.tsx:93` | Mengenknopf Hover-Farbe `duration-quick` | B-06 (Hover) | passt, Zuordnung eng |
| 10 | `src/app/(site)/kasse/page.tsx:43` | Link-Zeile Hover `duration-quick` | B-06 | passt |
| 11 | `src/app/(site)/schluessel-nach-code/shop-liste.tsx:330` | Familien-Anker Hover `duration-quick` | B-06 | passt |
| 12 | `src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:703` | „Entfernen“ Hover `duration-quick` | B-06 | passt |
| 13 | `src/app/(site)/artikel/[slug]/page.tsx:302` | Link-Zeile `duration-quick` | B-06 | passt |
| 14 | `src/components/autoschluessel/termin-auswahl.tsx:140` | Termin-Auswahl Farbe `duration-quick` | B-29 | passt |
| 15 | `src/app/(site)/sicherheitstechnik/page.tsx:385` | Pfeil `translate` `duration-quick` | B-06 | passt |

Stichprobe: 12 passen, 1 teilweise (Nr. 2), 1 Befund ohne Eintrag und ohne Dauer-Token (Nr. 6), 1 eng (Nr. 9, passt als Hover).

## 4 · Neue Befunde aus dieser Nachprüfung (nicht in den 13)

| Nr. | Befund | Beleg |
|---|---|---|
| N-1 | B-27 „je Zeichnung ≤ 1,6 s“ wird in `zutritt-signal` überschritten: Funk-Bögen 1,6 / 1,8 / 2,0 s, Signalstrich 2 s, Gruppenverzögerung 0,45 s, Ende ca. 2,45 s. | `src/components/visual/generators/zutritt-signal.tsx:294,299,306` |
| N-2 | B-21 nennt Funk-Bögen „1,6 s“, Code `schluessel.tsx:167` setzt 1,0 / 1,1 / 1,2 s (Text gegen Code). | `src/components/visual/generators/schluessel.tsx:167` |
| N-3 | B-08 nennt als Auslöser „Klick, Tastatur“, der Code öffnet das Megamenü zusätzlich beim Überfahren (`onMouseEnter`). | `src/components/layout/site-header.tsx:149` |
| N-4 | `flow-shell.tsx:90`: Schrittknöpfe `transition-colors` ohne Dauer-Token (150 ms Tailwind-Standard), kein eindeutiger Eintrag. | `src/components/flow/flow-shell.tsx:90` |
| N-5 | `mobile-action-bar.tsx:58`: Farbwechsel der Beschriftung bei aktiv (`duration-quick`) nicht im Text von B-28. | `src/components/layout/mobile-action-bar.tsx:58` |

## 5 · Offen

- Befund 12 (Messlücke Hover, Fokus, Megamenü, Drawer, Schritt-Wechsel, B-13): der Lauf erfasst Übergänge nicht; Prüfung statisch nur über die Stichprobe.
- N-1 bis N-5: Abweichungen zwischen Registertext und Code, Entscheidung beim Orchestrator (Text oder Code).
- Nicht geprüft in diesem Nachtrag: Build-Protokoll 2cdcbab (`E6-PRUEFER-C-build-nachtrag.log`), Werkzeug `funktionsliste.mjs` (Tastatur-Eingeben) und Teile 1 bis 4.

Keine Projektdatei geändert, nichts committet, keine Sperrdatei gesetzt, nichts gelöscht.
