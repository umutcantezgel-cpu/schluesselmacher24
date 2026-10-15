# ABNAHME · Definition of Done · Gestaltungslauf SCHLÜSSELMACHER24

Kriterium · Methode · Schwelle · Beleg · Ausgangswert (E0) · Stand. Erledigt ist nur, was geprüft ist; Kriterien sinken nie still.
Ausgangswerte: `_werkstatt/protokolle/E0-PRUEFER-01-ergebnis.md`, `_werkstatt/protokolle/E0-PRUEFER-05-ausgangswerte.md`, Bildsatz `_werkstatt/bilder/e0/`, Funktionsliste `_werkstatt/protokolle/funktionsliste-*` (E0-PRUEFER-04).

| Nr. | Kriterium | Methode | Schwelle | Beleg | Ausgangswert E0 | Stand |
|---|---|---|---|---|---|---|
| Z-01 | Plan | Abgleich mit PLAN.md | 100 % der Pflichtpakete erledigt und abgenommen; Kür bis leer | PLAN.md mit Commit-Kennungen | 0 von 70 | offen |
| Z-02 | Bestand | Prüfstufe C | Build, Typprüfung, Linter und Tests mindestens so grün wie E0; Funktionsliste vollständig; keine Funktion schlechter; 0 neue Konsolenfehler | Prüfprotokoll Prüfstufe C, Logikwächter, Textabzug | Build 198/198 Seiten (JSON-Modus), Typprüfung 0, Linter 0/0, Unit 680/680, DB 52/52 (über `ubuntu`), Konsolenfehler 0, Funktionsliste siehe E0-PRUEFER-04 | offen |
| Z-03 | Designsystem | `werte-suche.mjs` über alle geänderten Dateien + Stichprobe | 0 Werte außerhalb des Systems in geänderten Dateien (ausgenommen UNANTASTBAR und Bildinhalte); jede neue Komponente nutzt das System | Prüfliste | 707 freie Werte in 196 Dateien | offen |
| Z-04 | Gestaltung | Endprüfung durch frischen Opus-Unteragenten, Blindvergleich | jede Hauptansicht Ansichtswert ≥ 8, keine Kategorie < 7; neuer Stand auf jeder Hauptansicht vorgezogen | Bildsätze und Bewertung | Bildsatz E0 (251 Bilder) | offen |
| Z-05 | Bewegung | Register K-007 und Prüfstufe C | jede Animation im Register; bei reduzierter Bewegung keine Lage- oder Größenänderung und alle Inhalte sichtbar; große Momente mobil bei 4-facher Drosselung ≤ 5 % verworfene Bilder | Messprotokoll `bewegung.mjs` | reduziert: 0 Befunde; keine großen Momente vorhanden | offen |
| Z-06 | Grafik | Prüfstufe C, SVG-Prüfung | eine Icon-Familie im Formsystem (lucide entfernt), alle SVG-Dateien optimiert und zugänglich, keine doppelten Kennungen je Ansicht | Prüfliste | 2 Icon-Familien möglich (lucide in 62 Dateien, Fach-Icons ungenutzt) | offen |
| Z-07 | Zugänglichkeit | `a11y.mjs` (WCAG 2.2 AA), Tastaturdurchlauf der Hauptaufgaben | 0 ernste oder kritische Befunde auf den Hauptansichten; Hauptaufgaben nur mit Tastatur lösbar bei sichtbarem Fokus; Kontraste nach K-005 | Bericht | 26 ernst + 4 kritisch (target-size 24, button-name 2, label 2, scrollable-region-focusable 1, color-contrast 1) | offen |
| Z-08 | Leistung | `messung.mjs`, Median aus 3 Läufen je Profil | Budgets auf allen Hauptansichten (LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms); keine Ansicht schlechter als E0 um mehr als die E0-Spanne | Messprotokoll | 10 von 12 im Budget; H10 mobil LCP 2508 ms und CLS 0,117, H11 mobil CLS 0,104 | offen |
| Z-09 | Darstellung | Bildsatz in 3 Größen, Stichprobe | kein Überlauf, kein abgeschnittener oder überlappender Text; ein Thema, eine Sprache | Bildsatz | kein Seitenüberlauf; einzelne Elemente über den Rand: H08 mobil 27, H09 mobil 1 und Tablet 1 | offen |
| Z-10 | Übergabe | Endprüfung | BERICHT.md, KERN.md, MENSCHEN.md, Anleitung zum Zusammenführen und Zurückrollen vollständig; README auf Ist-Stand | Dateien | – | offen |

## Umgebungsausnahmen (Ersatzprüfung, in MENSCHEN.md eingetragen)
| Nr. | Was die Cloud nicht kann | Ersatzprüfung |
|---|---|---|
| U-1 | Echte Zielgeräte (iPhone, Android) und deren Bildrate mit Grafikkarte | Chromium headless, mobil 390 × 844, Prozessor 4-fach gedrosselt (`bewegung.mjs bildrate`), Netz „langsames 4G“ (`messung.mjs`) |
| U-2 | Safari und Firefox | Nur Chromium; Merkmale mit schrittweiser Verbesserung (Scroll-Timeline, ViewTransition) haben einen Endzustand ohne Unterstützung |
| U-3 | Screenreader (VoiceOver, NVDA) | axe-Prüfung, Rollen und Namen im Quelltext, Tastaturdurchlauf |
| U-4 | `npm run build` als root (initdb verweigert root) | Build-Gate `SM24_DATA=json npx next build` (D-001); DB-Tests über Nutzer `ubuntu` |

## Ausnahmen (höchstens zwei, nie für Z-02)
(keine)
