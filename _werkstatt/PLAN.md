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
| E0-P-02 | Werkzeuge Bild, Bildsatz, Messung, a11y, Konsole, Bewegung, Wertesuche | P/Haiku | `_werkstatt/werkzeuge/*` (7 Skripte) | E0-P-01 | Z-02, Z-04 bis Z-09 | |
| E0-P-03 | Logikwächter, Textabzug, Warenkorb-Test | P/Haiku | `_werkstatt/werkzeuge/*` (3), `src/lib/store/cart.test.ts` | E0-P-01 | Z-02 | |
| E0-K-06 | Next-16-Doku (ViewTransition, Fehlerseiten, Schriften, tailwind-merge) | K/Haiku | Bericht | E0-P-01 | Z-05, Z-03 | |
| E0-K-07 | lucide-Inventar mit Größe und Zusammenhang | K/Haiku | Bericht | – | Z-06 | |
| E0-P-04 | Funktionsliste als Skript und Durchlauf (Ausgangswert) | P/Haiku | `_werkstatt/werkzeuge/funktionsliste.mjs` | E0-P-02 | Z-02 | |
| E0-P-05 | Ausgangswerte Prüfstufe B, Bildsatz E0 ins Repo, DB-Tests über `ubuntu` | P/Haiku | `_werkstatt/protokolle`, `_werkstatt/bilder/e0/` | E0-P-02, E0-P-03 | Z-02, Z-04, Z-07, Z-08, Z-09 | |
| E1-L-01 | KERN, PLAN, ABNAHME | L/Opus | `_werkstatt/*.md` | E0 | Z-01, Z-10 | |
| E1-P-01 | Planprüfung L0 (Checkliste) | P/Haiku | Bericht | E1-L-01 | Z-01 | |
| E2-L-01 | Designsystem-Erweiterung, `cn` mit Test | L/Opus | `globals.css`, `tailwind.config.ts`, `src/lib/cn.ts`, `src/lib/cn.test.ts` | E0-K-06 | Z-03 | |
| E2-L-02 | Formsystem: IconBase-Strich, Glyphen-Vertrag, 12 Muster-Glyphen, K-008a | L/Opus | `icons/icon-base.tsx`, `visual/glyphen/*` (12 + Test) | E0-K-07 | Z-06 | |
| E2-G-01 | Glyphen Teil 1 (etwa 12) | G/Haiku | neue Dateien in `visual/glyphen/` (Liste im Paket) | E2-L-02 | Z-06 | |
| E2-G-02 | Glyphen Teil 2 (etwa 12) | G/Haiku | neue Dateien in `visual/glyphen/` | E2-L-02 | Z-06 | |
| E2-G-03 | Generator `tuer-schutz` | G/Haiku | `generators/tuer-schutz.tsx` + Test | – | Z-04, Z-06 | |
| E2-G-04 | `schliessplan` mit `markiert`/`tuer`, `schliessplanSchluessel()` | G/Haiku | `generators/schliessplan.tsx` + Test | – | Z-04 | |
| E2-L-03 | Bewegungssystem: Tokens, Primitive, `scrollVerhalten` mit Test, Scroll-Timeline, ViewTransition-Grundlage | L/Opus | `globals.css`, `visual/motion/*`, `src/lib/bewegung.ts` + Test, `src/lib/flow/use-flow.ts`, `next.config.ts` | E2-L-01, E0-K-06 | Z-05 | |
| E2-G-05 | Strichskala in `grafik-basis` und allen Generatoren (Exporte bleiben) | G/Haiku | `generators/*.tsx` außer neuen | E2-G-04 | Z-06 | |
| E2-G-06 | Generator `fehlschluessel` (404/500) | G/Haiku | `generators/fehlschluessel.tsx` + Test | E2-L-02 | Z-04 | |
| E2-L-04 | Profillinie und Generator `profilschnitt` | L/Opus | `visual/profillinie.tsx` + Test, `generators/profilschnitt.tsx` + Test, Registry | E2-L-03 | Z-04, Z-05 | |
| E2-L-05 | Hülle: Layout, Kopf, Fuß, Aktionsleiste (`istAktiv` mit Test), Button, Card, Section | L/Opus | `(site)/layout.tsx`, `layout/site-header.tsx`, `site-footer.tsx`, `mobile-action-bar.tsx`, `ui/button.tsx`, `ui/card.tsx`, `layout/section.tsx`, `src/lib/navigation.ts` + Test | E2-L-01 bis E2-L-03 | Z-03, Z-04, Z-07 | |
| E2-L-06 | Referenz Startseite (B-01, B-02, B-03) | L/Opus | `(site)/page.tsx` | E2-L-04, E2-L-05 | Z-04, Z-05 | |
| E2-P-01 | Prüfstufe A je L-Paket; Prüfstufe B Referenz | P/Haiku | Protokolle | je L | Z-02 | |
| E2-L-07 | Etappentor: Sichtabnahme durch frischen Opus-Unteragenten (≥ 8) | L/Opus | Bericht | E2-P-01 | Z-04 | |
| E3-B-01 | Formular-Bausteine (`controls`, `field`, `option-card`, `alert`, `badge`, `info-tip`, `accordion`) | B/Haiku | 7 Dateien | E2 | Z-03, Z-07 | |
| E3-B-02 | Ablauf-Hülle (`flow-shell`, `summary-list`, `breadcrumbs`) | B/Haiku | 3 Dateien | E2 | Z-03, Z-05 | |
| E3-B-03 | `photo-upload` | B/Haiku | 1 Datei (Logikwächter) | E2 | Z-03, Z-06 | |
| E3-G-07 | `visual/README.md` an Formsystem, Glyphen, neue Generatoren | G/Haiku | README | E2 | Z-10 | |
| E3-L-08 | `PageHeader` (erweitert, 35 Nutzerseiten), `ImagePlaceholder` (Ersatzgrafik, Test) | L/Opus | `layout/page-header.tsx`, `ui/image-placeholder.tsx` + Test | E2 | Z-04, Z-06 | |
| E3-L-09 | `.prose-sm24`, `not-found.tsx`, `error.tsx` | L/Opus | `globals.css`, `(site)/not-found.tsx`, `(site)/error.tsx` | E2-G-06 | Z-04 | |
| E3-L-10 | Client-Hüllen: Schließplan, Live-Schlüssel, Code-Fundstelle | L/Opus | `visual/interaktiv/*` (3 neu) | E2-G-04 | Z-04, Z-05 | |
| E3-B-04 | Autoschlüssel-Vorlage (`service-article`, `key-kinds`, `vehicle-facts`) | B/Haiku | 3 Dateien | E3-B-01 | Z-03, Z-04 | |
| E3-B-05 | `preis-anzeige`, `termin-auswahl`, `bestaetigung` | B/Haiku | 3 Dateien | E3-B-01 | Z-03, Z-05 | |
| E3-B-06 | Rechner und Nachweise (+ Tests Alt-Neu) | B/Haiku | 5 Dateien | E3-B-01 | Z-03 | |
| E3-B-07 | H02 `/autoschluessel` (B-21) | B/Haiku | `autoschluessel/page.tsx` | E3-L-08 | Z-04 | |
| E4-B-08 | H03 Marken und Modelle (3 Seiten) | B/Haiku | 3 Dateien | E3-L-08 | Z-04 | |
| E4-B-09 | H05/H06 Code-Shop und Produkt | B/Haiku | 4 Dateien (`bestell-formular` mit Logikwächter) | E3-L-10 | Z-04 | |
| E4-B-10 | H08 Schließanlagen und `system-erklaerung` | B/Haiku | 2 Dateien | E3-L-10 | Z-04 | |
| E4-B-11 | H09 Türtechnik und `[slug]` | B/Haiku | 2 Dateien | E2-G-03, E3-B-06 | Z-04 | |
| E4-B-12 | H12 Ratgeber und Liste | B/Haiku | 2 Dateien | E3-L-09 | Z-04 | |
| E4-B-13 | H07 Zylinder-Konfigurator (Logikwächter) | B/Haiku | 2 Dateien | E3-B-02 | Z-04 | |
| E4-B-14 | H10 Warenkorb (Logikwächter) | B/Haiku | 2 Dateien | E3-B-01 | Z-04 | |
| E4-B-15 | H11 Kasse (Logikwächter) | B/Haiku | 2 Dateien | E3-B-01 | Z-04 | |
| E4-B-16 | H04 Assistent (Logikwächter) | B/Haiku | 2 Dateien | E3-B-02, E3-B-05 | Z-04 | |
| E4-B-17 | `/schluessel-nach-vorlage` | B/Haiku | 1 Datei | E3-L-08 | Z-06 | |
| E4-B-18 | `/elektronische-zutrittsloesungen` | B/Haiku | 1 Datei | E3-L-08 | Z-06 | |
| E4-B-19 | `/sicherheitstechnik` und `[slug]` | B/Haiku | 2 Dateien | E3-L-08 | Z-06 | |
| E4-L-11 | Seitenwechsel mit gemeinsamem Element (B-13) | L/Opus | `page-header`, Startseite, `next.config.ts` | E3-L-08 | Z-05 | |
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
(keine)
