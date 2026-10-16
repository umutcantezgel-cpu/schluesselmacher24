# PLAN · Gestaltungslauf SCHLÜSSELMACHER24 · Version 1.0 (Kern 1.0)

Grundlage: KERN.md, LAGEBILD.md, Planentwurf aus dem Planmodus (`PLAN-ENTWURF.md`, inklusive der L0-Befunde). Commit-Kennungen werden in der Spalte „Commit“ nachgetragen.

## Mengengerüst
| Gegenstand | Menge |
|---|---|
| Ansichten (page.tsx) | 48, davon 12 Hauptansichten (5 Arbeit, 7 Erzähl); 7 Autoschlüssel-Leistungsseiten über eine Vorlage |
| Komponenten | 34 in `src/components/*` (ohne visual), 3 neue Client-Hüllen (interaktiv), 1 neue Fehlerseite (`error.tsx`) |
| Grafik | 54 Fach-Icons (Bestand), etwa 36 neue UI-Glyphen, 5 Generatoren (Bestand, einer erweitert) plus 3 neue (`profilschnitt`, `tuer-schutz`, `fehlschluessel`), 1 Leitelement (Profillinie), 37 Bildstellen |
| Bewegung | 22 Registereinträge (B-01 bis B-22) |
| Sprachen | 1 (Deutsch) |
| Neue Logik mit Test | `cn`-Erweiterung, `istAktiv`, `scrollVerhalten`, Profillinie, 3 Generatoren und 1 Generator-Erweiterung, Glyphen-Vertrag, `ImagePlaceholder`-Rangfolge, Charakterisierungstest Warenkorb |
| Freie Werte zu ersetzen | etwa 690 in 70 Dateien |
| lucide-Verwendungen zu ersetzen | 167 Importe in 62 Dateien |

## Regeln für alle Pakete
- Bauplan nach Abschnitt 5 des Auftrags. Jedes Haiku-Paket bekommt:
  - eine exakte Dateiliste
  - die Lucide→SM24-Tabelle aus KERN K-008a
  - die Umrechnungstabelle für freie Werte aus KERN K-005a
  - Referenzpfade und ein JS-Budget
- Für die 15 Dateien des Logikwächters gilt „nur Darstellung“; der Logikwächter muss gleich melden.
- Gemeinsame Dateien schreibt nur der Orchestrator:
  - `globals.css`, `tailwind.config.ts`, `src/lib/cn.ts`, `src/lib/navigation.ts`, `src/lib/bewegung.ts`
  - `visual/registry.tsx`, `registry.test.tsx` (`NAMEN`)
  - `next.config.ts`, `package.json` samt Lock, `src/app/(site)/layout.tsx`, alle Konfigurationen
  - CLAUDE.md, KERN.md
- Die Props-Verträge gemeinsamer Bausteine bleiben in einer Welle eingefroren.

## Pakete
Rolle: L = Leitung (Opus, Stufe 3), K = Kundschafter, P = Prüfer, B = Baumeister, G = Grafiker, D = Dokumentar. Haiku-Pakete sind Stufe 1 (K, P, D) oder Stufe 2 (B, G).

### Pflicht
| Kennung | Ziel | Rolle/Modell | Schreibrechte | Abh. | Kriterium | Commit |
|---|---|---|---|---|---|---|
| E0-L-01 | Werkstatt, Auftrag, CLAUDE.md-Block, Ausschlüsse | L/Opus | `_werkstatt/`, CLAUDE.md, Konfigurationen | – | Z-10 | fcbcfb2 |
| E0-P-01 | Prüfstand: drei Build-Wege, Ausgangsstand | P/Haiku | `_werkstatt/protokolle` | E0-L-01 | Z-02 | b49fe04 |
| E0-P-02 | Werkzeuge Bild, Bildsatz, Messung, a11y, Konsole, Bewegung, Wertesuche | P/Haiku | `_werkstatt/werkzeuge/*` (7 Skripte) | E0-P-01 | Z-02, Z-04 bis Z-09 | 30bf6a3 |
| E0-P-03 | Logikwächter, Textabzug, Warenkorb-Test | P/Haiku | `_werkstatt/werkzeuge/*` (3), `src/lib/store/cart.test.ts` | E0-P-01 | Z-02 | 876ca19 |
| E0-K-06 | Next-16-Doku (ViewTransition, Fehlerseiten, Schriften, tailwind-merge) | K/Haiku | Bericht | E0-P-01 | Z-05, Z-03 | 30bf6a3 |
| E0-K-07 | lucide-Inventar mit Größe und Zusammenhang | K/Haiku | Bericht | – | Z-06 | 30bf6a3 |
| E0-P-04 | Funktionsliste als Skript und Durchlauf (Ausgangswert) | P/Haiku | `_werkstatt/werkzeuge/funktionsliste.mjs` | E0-P-02 | Z-02 | 2831f3d, 4e9c17b |
| E0-P-05 | Ausgangswerte Prüfstufe B, Bildsatz E0 ins Repo, DB-Tests über `ubuntu` | P/Haiku | `_werkstatt/protokolle`, `_werkstatt/bilder/e0/` | E0-P-02, E0-P-03 | Z-02, Z-04, Z-07, Z-08, Z-09 | 82a9341 |
| E1-L-01 | KERN, PLAN, ABNAHME | L/Opus | `_werkstatt/*.md` | E0 | Z-01, Z-10 | 876ca19, 30bf6a3, 82a9341 |
| E1-P-01 | Planprüfung L0 (Checkliste) | P/Haiku | Bericht | E1-L-01 | Z-01 | fcbcfb2 (Planphase) |
| E2-L-01 | Designsystem-Erweiterung, `cn` mit Test | L/Opus | `globals.css`, `tailwind.config.ts`, `src/lib/cn.ts`, `src/lib/cn.test.ts` | E0-K-06 | Z-03 | def0f94 |
| E2-L-02 | Formsystem: IconBase-Strich, Glyphen-Vertrag, 12 Muster-Glyphen, K-008a | L/Opus | `icons/icon-base.tsx`, `visual/glyphen/*` (12 + Test) | E0-K-07 | Z-06 | f8dde75 |
| E2-G-01 | Glyphen Teil 1 (etwa 12) | G/Haiku | neue Dateien in `visual/glyphen/` (Liste im Paket) | E2-L-02 | Z-06 | f8dde75 |
| E2-G-02 | Glyphen Teil 2 (etwa 12) | G/Haiku | neue Dateien in `visual/glyphen/` | E2-L-02 | Z-06 | f8dde75 |
| E2-G-03 | Generator `tuer-schutz` | G/Haiku | `generators/tuer-schutz.tsx` + Test | – | Z-04, Z-06 | f8dde75 |
| E2-G-04 | `schliessplan` mit `markiert`/`tuer`, `schliessplanSchluessel()` | G/Haiku | `generators/schliessplan.tsx` + Test | – | Z-04 | 65aa9ce |
| E2-L-03 | Bewegungssystem: Tokens, Primitive, `scrollVerhalten` mit Test, Scroll-Timeline, ViewTransition-Grundlage | L/Opus | `globals.css`, `visual/motion/*`, `src/lib/bewegung.ts` + Test, `src/lib/flow/use-flow.ts`, `next.config.ts` | E2-L-01, E0-K-06 | Z-05 | def0f94 |
| E2-G-05 | Strichskala in `grafik-basis` und allen Generatoren (Exporte bleiben) | G/Haiku | `generators/*.tsx` außer neuen | E2-G-04 | Z-06 | 929de35 |
| E2-G-06 | Generator `stiftzuhaltung` (404/500, später Kür K-01) | G/Haiku | `generators/stiftzuhaltung.tsx` + Test | E2-L-02 | Z-04 | 2cd41f0 (als `stiftzuhaltung`, D-012) |
| E2-L-04 | Profillinie und Generator `profilschnitt` | L/Opus | `visual/profillinie.tsx` + Test, `generators/profilschnitt.tsx` + Test, Registry | E2-L-03 | Z-04, Z-05 | f8dde75 |
| E2-L-05 | Hülle: Layout, Kopf, Fuß, Aktionsleiste (`istAktiv` mit Test), Button, Card, Section | L/Opus | `(site)/layout.tsx`, `layout/site-header.tsx`, `site-footer.tsx`, `mobile-action-bar.tsx`, `ui/button.tsx`, `ui/card.tsx`, `layout/section.tsx`, `src/lib/navigation.ts` + Test | E2-L-01 bis E2-L-03 | Z-03, Z-04, Z-07 | 9e51eff |
| E2-L-06 | Referenz Startseite (B-01, B-02, B-03) | L/Opus | `(site)/page.tsx` | E2-L-04, E2-L-05 | Z-04, Z-05 | 9e51eff |
| E2-P-01 | Prüfstufe A je L-Paket; Prüfstufe B Referenz | P/Haiku | Protokolle | je L | Z-02 | |
| E2-L-07 | Etappentor: Sichtabnahme durch frischen Opus-Unteragenten (≥ 8) | L/Opus | Bericht | E2-P-01 | Z-04 | |
| E3-B-01 | Formular-Bausteine (`controls`, `field`, `option-card`, `alert`, `badge`, `info-tip`, `accordion`) | B/Haiku | 7 Dateien | E2 | Z-03, Z-07 | |
| E3-B-02 | Ablauf-Hülle (`flow-shell`, `summary-list`, `breadcrumbs`) | B/Haiku | 3 Dateien | E2 | Z-03, Z-05 | |
| E3-B-03 | `photo-upload` | B/Haiku | 1 Datei (Logikwächter) | E2 | Z-03, Z-06 | |
| E3-G-07 | `visual/README.md` an Formsystem, Glyphen, neue Generatoren | G/Haiku | README | E2 | Z-10 | |
| E3-L-08 | `PageHeader` (erweitert, 35 Nutzerseiten), `ImagePlaceholder` (Ersatzgrafik, Test) | L/Opus | `layout/page-header.tsx`, `ui/image-placeholder.tsx` + Test | E2 | Z-04, Z-06 | b56bcfb (ZWISCHENSTAND) |
| E3-L-09 | `.prose-sm24`, `not-found.tsx`, `error.tsx` | L/Opus | `globals.css`, `(site)/not-found.tsx`, `(site)/error.tsx`, `layout/fehler-ansicht.tsx` | E2-G-06 | Z-04 | |
| E3-L-10 | Client-Hüllen: Schließplan, Live-Schlüssel, Code-Fundstelle | L/Opus | `visual/interaktiv/*` (3 neu) | E2-G-04 | Z-04, Z-05 | 4a985f3 |
| E3-L-14 | Großer Moment B-21: Zeichnungsblatt der Schlüsselarten (für E3-B-07) | L/Opus | `autoschluessel/schluesselarten-reihe.tsx` + Test | E2 | Z-04, Z-05 | 4abf697 (ZWISCHENSTAND) |
| E3-B-04 | Autoschlüssel-Vorlage (`service-article`, `key-kinds`, `vehicle-facts`) | B/Haiku | 3 Dateien | E3-B-01 | Z-03, Z-04 | |
| E3-B-05 | `preis-anzeige`, `termin-auswahl`, `bestaetigung` | B/Haiku | 3 Dateien | E3-B-01 | Z-03, Z-05 | |
| E3-B-06 | Rechner und Nachweise (+ Tests Alt-Neu) | B/Haiku | 5 Dateien | E3-B-01 | Z-03 | |
| E3-B-07 | H02 `/autoschluessel` (B-21) | B/Haiku | `autoschluessel/page.tsx` | E3-L-08 | Z-04 || d5059fb |
| E4-B-08 | H03 Marken und Modelle (3 Seiten) | B/Haiku | 3 Dateien | E3-L-08 | Z-04 || 7f5653c |
| E4-B-09 | H05/H06 Code-Shop und Produkt | B/Haiku | 4 Dateien (`bestell-formular` mit Logikwächter) | E3-L-10 | Z-04 || 853bc9a |
| E4-B-10 | H08 Schließanlagen und `system-erklaerung` | B/Haiku | 2 Dateien | E3-L-10 | Z-04 || a32cc87 |
| E4-B-11 | H09 Türtechnik und `[slug]` | B/Haiku | 2 Dateien | E2-G-03, E3-B-06 | Z-04 || a12177f |
| E4-L-16 | H01 Befunde der Sichtabnahme, Anlauf 2 (letztes Paket je Kategorie) | L/Opus | `(site)/page.tsx`, `globals.css`, Fuß, Layout, Generatoren `profilschnitt`/`schliessplan`, `area-theme.ts`, `image-placeholder.tsx` | E2 | Z-04 | 8dc1538 |
| E4-B-12 | H12 Ratgeber und Liste | B/Haiku | 2 Dateien | E3-L-09 | Z-04 || a22965a |
| E4-B-13 | H07 Zylinder-Konfigurator (Logikwächter) | B/Haiku | 2 Dateien | E3-B-02 | Z-04 || 46bd429 |
| E4-B-14 | H10 Warenkorb (Logikwächter) | B/Haiku | 2 Dateien | E3-B-01 | Z-04 || ee71d8c |
| E4-B-15 | H11 Kasse (Logikwächter) | B/Haiku | 2 Dateien | E3-B-01 | Z-04 || e807b4a |
| E4-B-16 | H04 Assistent (Logikwächter) | B/Haiku | 2 Dateien | E3-B-02, E3-B-05 | Z-04 | e37ace1 |
| E4-B-17 | `/schluessel-nach-vorlage` | B/Haiku | 1 Datei | E3-L-08 | Z-06 | d7a0541 |
| E4-B-18 | `/elektronische-zutrittsloesungen` | B/Haiku | 1 Datei | E3-L-08 | Z-06 | fe069ba |
| E4-B-19 | `/sicherheitstechnik` und `[slug]` | B/Haiku | 2 Dateien | E3-L-08 | Z-06 | b6ec4a4 |
| E4-L-11 | Seitenwechsel mit gemeinsamem Element (B-13) | L/Opus | `page-header`, Startseite, `seitenwechsel.tsx` (kein `next.config.ts` nötig) | E3-L-08 | Z-05 | 99d2ba9, e523e49 |
| E4-L-17 | Bestandsfehler: Eingabeschrift mit Rahmenfarbe, InView bei hohen Abschnitten (D-028) | L/Opus | `tailwind.config.ts`, `cn.ts`, `controls.tsx`, `in-view.tsx` + Tests | – | Z-02, Z-07 | 9bcf603 |
| E4-L-18 | Gemeinsame Bausteine nach Welle C (D-029) | L/Opus | Raster-Token, `option-card`, `photo-upload`, `rechner-bausteine`, Schließplan-Ausschnitt, `tuer-schutz`, Ausnahmen Logikwächter | – | Z-04, Z-07 | 098c3cb |
| E4-L-19 | Seitenwechsel springt nach oben (D-030) | L/Opus | 3 Seiten, `seitenstruktur.test.ts` | – | Z-02 | e523e49 |
| E4-L-20 | SummaryList als Schriftfeld, gemeinsame Platzhalter-Prüfung (D-031) | L/Opus | `summary-list`, `platzhalter.ts`, Ausnahmen | – | Z-04 | 3f05396 |
| E4-L-21 | Motiv-Zuordnung nach der Sache, fünf Fach-Icons Sicherheitstechnik (D-032) | L/Opus | `motiv.ts`, `image-placeholder`, Icons + Tests | – | Z-06 | 4189b5d |
| E4-L-22 | Wertesuche ohne offene Funde: `w-tipp`, `.sm24-auswahl`, `.sm24-ablauf-leiste`, Einzelausnahmen (D-034) | L/Opus | `tailwind.config.ts`, `cn.ts`, `globals.css`, `info-tip`, `controls`, `flow-shell`, `werte-suche.mjs` | – | Z-03 | 63eac59 |
| E4-L-24 | Hinweis „Zwischenstand geladen“ nur für geladene Stände (D-035) | L/Opus | `use-flow.ts` + Test | – | Z-02, Z-07 | 5d97117 |
| E4-L-25 | Maßzeichnung im schmalen Format für Telefone (D-036) | L/Opus | `zylinder-mass`, Registry, `image-placeholder`, `zylinder-mass-live`, Konfigurator (`className`), Startseite + Tests | – | Z-04, Z-06 | 5632498 |
| E4-L-07 | Leistung absichern (nach der ersten Etappenmessung) | L/Opus | je Befund | E3-P-B | Z-08 | |
| E5-B-20 | Service, Kontakt, Vor Ort | B/Haiku | 3 Dateien | E3 | Z-06 | |
| E5-B-21 | `/gleichschliessende-zylinder` | B/Haiku | 1 Datei | E3 | Z-06 | |
| E5-B-22 | Vorlage-Anfrage (Logikwächter, Scroll-Ausnahme) | B/Haiku | 2 Dateien | E3-B-02 | Z-06, Z-05 | |
| E5-B-23 | Sicherheitscheck (Logikwächter) | B/Haiku | 2 Dateien | E3-B-02 | Z-06 | |
| E5-B-24 | Zutritts-Konfigurator (Logikwächter, Scroll-Ausnahme) | B/Haiku | 2 Dateien | E3-B-02 | Z-06, Z-05 | |
| E5-B-25 | Projekt-Konfigurator (Logikwächter) | B/Haiku | 2 Dateien | E3-B-02 | Z-06 | |
| E5-B-26 | Service-Anfrage und Terminstatus (Logikwächter) | B/Haiku | 4 Dateien | E3-B-02 | Z-06 | |
| E5-B-27 | Artikel (Logikwächter für `artikel-kauf`) | B/Haiku | 4 Dateien | E3 | Z-06 | |
| E5-B-28 | Standorte, Bestellung (Logikwächter) | B/Haiku | 3 Dateien | E3 | Z-06 | |
| E5-B-29 | Rechtliches (Logikwächter, Textabzug) | B/Haiku | 8 Dateien | E3 | Z-06 | |
| E5-D-01 | README auf Ist-Stand, UMSETZUNG.md als historisch kennzeichnen | D/Haiku | `README.md`, `UMSETZUNG.md` (Kopfhinweis) | E5 | Z-10 | |
| E5-L-12 | `lucide-react` entfernen | L/Opus | `package.json`, Lock | E5-B-* | Z-06 | |
| E6-P-C | Prüfstufe C | P/Haiku | Protokolle | Pflicht | Z-02 bis Z-09 | |
| E6-D-02 | Blindvergleich vorbereiten, Galerie, Bericht | D/Haiku | `_werkstatt/bilder/`, BERICHT | E6-P-C | Z-04, Z-10 | |
| E6-L-13 | Endprüfung durch frischen Opus-Unteragenten, Abschluss | L/Opus | ABNAHME, BERICHT | E6-D-02 | alle | |

Je Etappe kommt eine Prüfstufe B (E2-P-B, E3-P-B, E4-P-B, E5-P-B) mit Sichtabnahme hinzu. Befunde werden zu Paketen der nächsten Etappe, höchstens 2 je Hauptansicht und Kategorie.

### Kür (nach Wirkung)
| Kennung | Ziel | Rolle/Modell | Schreibrechte | Kriterium |
|---|---|---|---|---|
| K-01 | Stiftzuhaltungs-Szene (neuer Generator, Stifte richten sich beim Scrollen aus) auf `/gleichschliessende-zylinder` | G/Haiku + L | `generators/stiftzuhaltung.tsx` + Test, Seite | Nordstern |
| K-02 | `zutritt-signal` im Kopf von `/elektronische-zutrittsloesungen` | B/Haiku | Seite | Nordstern |
| K-03 | Restliche Bildstellen mit Fachgrafik | B/Haiku | betroffene Seiten | Nordstern |
| K-04 | Ratgeber-Lesefortschritt (nur CSS, Scroll-Timeline) | B/Haiku | Ratgeber-Seite | Nordstern |
| K-05 | Druckansicht Bestell- und Vorgangsbestätigung | B/Haiku | `globals.css` (über Orchestrator), Seiten | Nordstern |
| K-06 | OG-Bilder je Bereich über `next/og` mit lokaler Schrift | L/Opus | `opengraph-image.tsx` je Bereich | Nordstern |

## Etappen, Wellen, kritischer Pfad
| Etappe | Inhalt | Wellen (je höchstens 4 Haiku-Plätze) |
|---|---|---|
| E0 | Start, Prüfstand, Erkundung | E0-a: P-01 · E0-b: P-02, P-03, K-06, K-07 · E0-c: P-04, P-05, G-03, G-04 |
| E1 | Plan | P-01 (L0) |
| E2 | Referenz | E2-a: G-01, G-02 (nach L-02), G-05 (nach G-04) · E2-b: G-06, Prüfer · Tor |
| E3 | Vorlagen und Bausteine | A: B-01, B-02, B-03, G-07 · B: B-04, B-05, B-06, B-07 |
| E4 | Hauptansichten | C: B-08 bis B-11 · D: B-12 bis B-15 · E: B-16 bis B-19 |
| E5 | Übrige Ansichten | F: B-20 bis B-23 · G: B-24 bis B-27 · H: B-28, B-29, D-01 · L-12 |
| E6 | Abschluss und Kür | Prüfstufe C, Kür K-01 bis K-06, Endprüfung |

**Kritischer Pfad:** E0-K-06 → E2-L-01 → E2-L-03 → E2-L-04 → E2-L-05 → E2-L-06 → Etappentor → E3-L-08 → E4-Wellen → E5-L-12 → Prüfstufe C → Endprüfung. Die Opus-Pakete E2 bis E3 sind der Engpass. Die Haiku-Plätze arbeiten parallel an Generatoren, Glyphen und Werkzeugen.

## Modellanteil und Kapazität
- **Modellanteil:** 70 Pakete. 55 laufen auf Haiku (K, P, B, G, D), 15 auf Opus (L). Dazu kommen zwei Prüfungen durch frische Opus-Unteragenten (Etappentor, Endprüfung).
- **Kapazität:** 55 Haiku-Pakete ÷ (4 Plätze × 8 Wellen am Tag) × 1,2 ≈ 2,1 Tage reine Haiku-Arbeit. Mit Opus-Engpass, Prüfstufen und Sichtabnahmen ergeben sich etwa 4 Tage.

## Offene Punkte
- **Etappentor E2 nicht bestanden** (D-022): Ansichtswert 7,0 nach zwei Anläufen. Die Befunde aus Anlauf 2 sind mit E4-L-16 umgesetzt (8dc1538, D-024). Das Kriterium Z-04 prüft die Endprüfung erneut.
- **Sichtbarer Platzhalter für Baujahre:** `formatModelYears` in `src/components/autoschluessel/vehicle-facts.tsx` liefert „[Platzhalter: Baujahre noch nicht erfasst]“. Der Text erscheint in Tabellen und im Seitentitel der Marken- und Modellseiten. Das Paket E4-B-08 zeigt Baujahre nur, wenn sie erfasst sind, ohne Platzhalter im Titel (harter Katalog).
- **Paniktechnik-Kasten auf `/tuer-und-schliesstechnik`:** dunkle Überschrift auf dunklem Grund (Befund E3-B-06; Kontrastbefund H09 schon in E0). Gehört zum Paket E4-B-11.
- ~~**Zeitfenster im Terminschritt:**~~ erledigt mit E4-B-16 (e37ace1): Uhrzeit und Dauer in Mono.
- **Bestätigung des Autoschlüssel-Ablaufs:** nur per Rendertest belegt, nicht im Bild (ohne echte Sendung nicht erreichbar).
- ~~**Wiederherstellungs-Hinweis in Abläufen (Bestand):**~~ erledigt mit E4-L-24 (5d97117, D-035).
- **JS-Menge mobil (E2-PRUEFER-01-ergebnis):** über E0 in allen 12 Ansichten, zum Beispiel H01 293 statt 246 KB. Die Budgets LCP, CLS und INP sind eingehalten. Ursachen sind zu prüfen (Glyphen, `tailwind-merge`-Erweiterung, Client-Hüllen); gehört zu Paket E4-L-07 (Leistung absichern).
  - **Analyse 16.10. (H01, mobil, Port 3000 gegen 3100):**
    - Eigenes Seiten-JS (Skripte im HTML): 204 statt 195 KB komprimiert (+9 KB). Die Framework-Teile sind gleich.
    - Der Rest der Differenz entsteht nach dem Laden: `<Link>`-Prefetch der sichtbaren Ziele lädt deren Chunks. Weil die Startseite mehr sichtbare Links hat (Schnelleinstieg, Ratgeber-Zellen), wächst die gemessene Menge.
    - Ein gemeinsamer Chunk (etwa 14 KB komprimiert) enthält alle Generatoren der Registry. Er kommt über Client-Komponenten, die `ImagePlaceholder` importieren (`info-tip`, `photo-upload`, `shop-liste`, `warenkorb-ansicht`, `artikel-liste`, `konfigurator`) und damit `visualFuerMotiv` und die ganze Registry in den Client ziehen.
  - **Maßnahmen für L-07 (nach Welle E, wenn die Seiten stehen):**
    1. Ein `ImagePlaceholder` für Client-Komponenten ohne Registry: Generator nur über `slot.visual` mit dynamischem Import, oder Grafik als Server-Kind hereinreichen.
    2. `prefetch` nur für die Hauptwege; Linklisten in Ratgeber und Fuß bekommen `prefetch={false}`. Wirkung im Bild und in der Messung prüfen.
    3. Danach neu messen (Median aus 3, mobil, 4-fach gedrosselt).
- **Überlauf-Befunde im Bildsatz** (67 statt 29 in E0): zum Teil gewollte Anschnitte im Hero und in den Projekten. Im Etappentor, Anlauf 2, je Ansicht prüfen.
- **Kleine Beschriftungen in den Karten „Direkt kaufen“** mobil (D-018): Kür-Kandidat, falls die Sichtabnahme es verlangt.
- **E5-B-23 Sicherheitscheck:** Im Schritt „Bestand“ landete ein Zeigerklick auf eine Auswahlkarte auf „/“ (E0-PRUEFER-04). Vermutete Ursache: Der feste Kopf deckt die Karte nach dem Scrollen ab, und der Klick trifft das Logo. Gegenmaßnahme seit E2: `scroll-padding-top` in `globals.css`. B-23 prüft den Fall mit echtem Zeigerklick erneut.
- **Funktionsliste:** Die Erkennung der Schritte in F-04 und F-07 (Überschrift, Weiter-Knopf) ist empfindlich. Nach B-16 (Assistent) und B-22 (Vorlage-Anfrage) läuft sie erneut. Stand 16.10.: F-04 läuft nach B-16 durch alle 13 Schritte, auf Port 3000 und 3001 (Lese-Actions jetzt auch aus `.next/dev`). Mit `SM24_SCHRITTBILDER=<Ordner>` entsteht ein Bild je Schritt.
- **Code-Shop, Bestellformular (Bestand, Logikwächter):** `handleAdd` wartet auf `uploadsAbwarten()` ohne Sperrzustand; zwei schnelle Klicks könnten zwei Warenkorbeinträge erzeugen. Bei ungültigem `codePattern` ist jede Eingabe gültig (bewusst, Kommentar Z. 44; Daten durch `code-pattern.test.ts` abgesichert). Beides ist Logik und bleibt im Lauf unverändert; Vorschlag für ein eigenes Paket mit Test nach dem Lauf.
- **Leistungsseiten Türtechnik (Bestand):** `PROCESS_LABELS[page.process]` ohne Null-Prüfung in `tuer-und-schliesstechnik/[slug]/page.tsx` Z. 48. Alle Daten haben heute einen gültigen Wert; Absturzrisiko nur bei neuen CMS-Werten. Logik, daher nur Vermerk.
- **Modellseite:** zwei Links auf dieselbe Markenseite („Andere …-Modelle“, „Alle …-Modelle“). Inhalt, daher Vorschlag in TEXTVORSCHLAEGE.md.
- ~~**Maßzeichnung schmal (E4-B-13, D-029):**~~ erledigt mit E4-L-25 (5632498, D-036): mobil 13,2 px statt 6,7 px.
- **Warenkorb und Kasse (Bestand, Logik, D-031):** automatische Wahl der ersten Versandart beim Laden (der Hinweis „Bitte wählen Sie zuerst eine Versandart“ erscheint dadurch fast nie), Mengenklemmung nur in der Anzeige (der Store kennt keine Obergrenze), `QuantityInput` setzt ein leeres Feld sofort auf das Minimum (Tippen einer neuen Zahl wird schwer), Formularfehler der Kasse über `Alert` mit `role="note"` statt einer Ansage. Vorschlag: eigenes Paket mit Tests nach dem Lauf.

