# E5-BAUMEISTER-28 · Bericht und Abnahme (Standorte und Bestellseite)

1 Prüfrunde, Prüfurteil: nicht bestanden (1 Muss). Die Reparaturrunden scheiterten am Sitzungslimit; Nacharbeit und Abnahme durch den Orchestrator:

- **Muss Kartenimport:** benannte Ausnahme im Logikwächter (der neue Stand wird vor dem Fingerabdruck um den alten Import ergänzt, die Basis bleibt unberührt); Logikwächter 0 abweichend.
- **Soll Ordnung der Bestellseite:** Abschnittsnummern über einen CSS-Zähler (`.sm24-zaehlung`, `.sm24-nummer` in `globals.css`), der nur gerenderte Abschnitte zählt – ohne neue Ausdrücke in JSX. Neue Augenbrauen (Mikrotexte, Alt-Neu): „01“ → „Bestätigung“ mit Zähler, „02“ → „Übersicht“ mit Zähler, neu „Positionen“ (Bestellte Artikel) und „Abrechnung“ (Zahlung). Am statischen Prüfbild gezählt 01–03.
- **Soll „40 km“ bricht:** Zahl und Einheit ohne Umbruch (`whitespace-nowrap`), Bild mobil.
- **Soll Bestellseite ohne Bild:** bestätigt als Lücke der Prüfmittel – es gibt keinen Vorgang (`content/records.json` fehlt, G5); F-03 bestanden (404 ohne gültigen Schlüssel).
- **Bilder:** `/standorte` und `/standorte/berlin` mobil (`/root/sm24-bilder/L-B28-29/bilder/`).

## Prüfurteil (Runde 1)

- **muss:** Bestellseite Teil A: Der Import `Card, CardBody, CardHeader` aus `@/components/ui/card` ist entfernt. Das verletzt die Grenze „Importe nur aus @/components/visual/“ und weicht im Logikwächter (Teil A) ab; `pruefen` meldet ABWEICHEND, `logik-ausnahmen.json` hat für die Datei noch keinen Eintrag. Entscheidung des Orchestrators nötig: benannte Ausnahme oder anderer Weg.
- **soll:** Bestellseite nicht bildlich geprüft: `content/records.json` fehlt, es gibt keinen Vorgang. Die Darstellung der Bestellseite ist nur am Code (Diff) und über den HTML-/Protokollstand belegt, nicht über Bilder.
- **soll:** Bestellseite Ordnung uneinheitlich: `01` (Vorgangsnummer) und `02` (Ihre Angaben) sind nummeriert, „Bestellte Artikel“, „Zahlung“, „Wie es weitergeht“ und „Fragen zur Bestellung?“ nicht. Muster „Ordnung durchziehen“ verlangt Nummern auch für die Abschnitte. Die statischen Abschnitte (Wie es weitergeht, Fragen) bräuchten dafür keine Logikwächter-Ausnahme.
- **soll:** /standorte mobil, Zeilen Köln und Stuttgart: der Mono-Wert „40 km“ bricht über zwei Zeilen („etwa 40“ / „km“). Zahl und Einheit sollten zusammenbleiben (`whitespace-nowrap` am Wert-Span, Datei standorte/page.tsx Z. 64).
- **hinweis:** Stadtseite Angaben (standorte/[city]/page.tsx Z. 102): `sm:border-l` für Index > 0 würde bei drei oder mehr Angaben eine falsche Linie in der zweiten Reihe zeigen. Heute gibt es nur zwei Angaben, daher kein sichtbarer Fehler.
- **hinweis:** Stadtseite: der Block „Weiterlesen“ (interne Links) hat keinen Abschnittskopf mit Augenbraue und Nummer; das Muster „Ordnung durchziehen“ nennt „Weiterlesen“ ausdrücklich.
- **hinweis:** Paket nennt KERN 1.11; maßgeblich ist laut Auftrag und `_werkstatt/KERN.md` Version 1.13. Die Punkte 1.12 und 1.13 (u. a. SummaryList im Schriftfeld) sind in den Dateien eingehalten, Alert-Änderungen gibt es dort keine.
- **hinweis:** Hilfsdatei `/tmp/x.html` (156901 Byte, 15:06) liegt noch da. Der Bericht meldet sie selbst; ich habe sie nicht angelegt und nicht gelöscht (Löschverbot). Die Vorgabe „Hilfsdateien nie unter /tmp“ ist verletzt.

## Bericht des Baumeisters

E5-BAUMEISTER-28 · Bericht

GEÄNDERTE DATEIEN
- src/app/(site)/standorte/page.tsx
- src/app/(site)/standorte/[city]/page.tsx
- src/app/(site)/bestellung/[id]/page.tsx (nur Darstellung; Logikwächter-Teil B gleich, Teil A nur durch den Card-Import, siehe unten)

WAS UND WARUM
/standorte: Kartenraster ersetzt durch Stückliste mit Haarlinien (ganze Zeile ist der Link, GlyphOrt, Stadtname text-title-sm, Bundesland und Einsatzradius mit Zahl in Mono, Pfeil GlyphPfeilRechts mit Hover-Verschiebung), mobil eine Spalte, ab 768 px zwei. Kopf mit Fachgrafik über PageHeader visual (K-006, Blickfang je Bildschirmhöhe; Generator schluessel typ zylinder — der erste Entwurf mit Generator ablauf war im Desktop-Format leer und wurde ersetzt). Abschnittsköpfe mit Nummer 01. Alert mit mt-10.
/standorte/[city]: Platzhalter nicht mehr als Fakt: localIntro entfällt (alle sechs beginnen mit „[Platzhalter —“), Angaben werden über alsFakt() (istPlatzhalter + enthaeltPlatzhalter aus @/lib/platzhalter) gefiltert; übrig bleiben Bundesland und Einsatzradius (Daten unverändert). Kopf mit Fachgrafik (Generator schluessel typ funk) über PageHeader visual, Button mit Prop pfeil statt manuellem Pfeil. Angaben als Schriftfeld (Haarlinien, Werte in Mono wo Zahlen). Bereiche als Haarlinienraster mit BereichIcon 40 px ohne Kasten, AreaScope je Zeile, ganze Zeile ist der Link (kein Linkwort „Zum Bereich“). Interne Links als Stückliste. Kein Card mehr, kein lucide.
/bestellung/[id]: Nur JSX im return und in BestelltePositionen sowie Importe geändert. Karten durch Abschnitte mit border-t pt-8, Vorgangsnummer in font-mono text-headline tabular-nums, Positionen und Summen in Mono, Gesamtbetrag rechts in Mono, Ihre Angaben als SummaryList variante schriftfeld hervorheben Gesamtbetrag, Seitenleiste lg:top-28, Glyphen statt lucide, Links als Stückliste mit min-h-touch. PageHeader art arbeit. Zugangsprüfung, Hinweis- und Positionslogik, Konstanten, Zeichenketten außerhalb von JSX, Metadaten unverändert.

Alt-Neu-Liste (Mikrotexte, sichtbar):
- Standorte-Kopf: unverändert. Abschnittstitel „Regionen“ unverändert, neue Eyebrow „Vor-Ort-Gebiete“.
- Standorte-Zeile: „Einsatzradius etwa 40 km“ bleibt; „Details ansehen“ entfällt (ganze Zeile ist Link).
- Stadtseite: „Was wir in {Stadt} anbieten“ → „{Stadt} und Umgebung“ (Eyebrow „Einsatzgebiet“), weil der Einleitungstext fehlt und nur Angaben stehen.
- Stadtseite: „Zum Bereich“ entfällt (Linkwort, B-06).
- Bestellung: „Bestellte Artikel“, „Zahlung“, „Ihre Angaben“, „Wie es weitergeht“, „Fragen zur Bestellung?“ unverändert. Keine Textänderung an Zusagen.

GEMEINSAME DATEIEN
- Ausnahme Logikwächter (Teil A, Import): Der Import `import { Card, CardBody, CardHeader } from '@/components/ui/card';` entfällt. Vorschlag für _werkstatt/werkzeuge/logik-ausnahmen.json unter dem Schlüssel "src/app/(site)/bestellung/[id]/page.tsx": suchen `import \\{ Card, CardBody, CardHeader \\} from '@/components/ui/card';\\n`, ersetzen `` (Grund: Karten entfallen, nur Darstellung; wie bei kasse-formular.tsx). Ohne sie meldet pruefen genau diesen Importunterschied in Teil A.
- Keine Ausdrücke in JSX neu; keine weiteren Ausnahmen.
- Kein Wunsch an gemeinsame Dateien.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: 0 Fehler.
- eslint (drei Dateien): 0 Befund.
- vitest run src/components src/lib: 64 Dateien, 1136/1136 grün.
- werte-suche (--json): 0 Funde, 0 Ausnahmen.
- grep lucide-react in den drei Dateien: kein Treffer.
- Logikwächter pruefen gegen HEAD: abweichend nur durch den Card-Import (Teil A); Teil B gleich.
- HTML Port 3001 (SM24_BASIS_URL=http://localhost:3001): /standorte und alle sechs Stadtseiten HTTP 200, 0 Treffer für „[Platzhalter“, „[PLZ]“, „[Ort]“.
- Funktionsliste F-03: BESTANDEN (HTTP 404 bei ungültigem Schlüssel). Protokoll: _werkstatt/protokolle/funktionsliste-2026-10-16_17-06-17.md und .json.

BILDBELEGE (alle in /root/sm24-bilder/E5-BAUMEISTER-28/)
- standorte__mobil__ganz.jpg (390): Liste als Haarlinien (vor dem Wechsel der Kopfgrafik).
- standorte-berlin__mobil__ganz.jpg (390): Kopf, Schriftfeld, Bereiche mit Fach-Icons, nichts abgeschnitten.
- standorte__desktop__ganz.jpg (1440): Kopf mit Schlüsselzeichnung nach dem Wechsel, zweispaltige Stückliste.
- standorte-berlin__desktop__ganz.jpg (1440): Stadtseite, Bereiche zweispaltig, Stückliste der Links.
- standorte-berlin__tablet__ganz.jpg (768): Kopf, Schriftfeld, Bereiche einspaltig.
- Nicht fotografiert: Bestellseite (kein Testvorgang), Stadtseiten Hamburg/München/Köln/Frankfurt/Stuttgart (gleiche Vorlage, per HTML geprüft).
- Werkzeug-Protokolle: /root/sm24-bilder/E5-BAUMEISTER-28/bild-standorte-*.json, bild-standorte-berlin-*.json.

OFFENE FRAGEN
- Bestellseite bildlich nicht abgenommen: kein Vorgang in content/records.json. Orchestrator bitte Testvorgang anlegen oder nach dem Kassenlauf fotografieren.
- Ziffern auf der Bestellseite: Bestellte Artikel und Zahlung sind bedingt und tragen keine Ziffer; Vorgangsnummer 01, Ihre Angaben 02. Dynamische Ziffern bräuchten eine weitere Logikwächter-Ausnahme.
- Zusagen auf der Bestellseite („Wir prüfen Code, Maße ...“, „Sie werden über jeden Schritt informiert“, „Wir melden uns mit den Zahlungsinformationen“) sind ohne Beleg im Repo; unverändert übernommen.
- Druckansicht (Kür K-05), Fokusstil der Links und Sticky-Abstand gegenüber Startseite nicht geprüft beziehungsweise nicht umgesetzt (lg:top-28 gesetzt).
- Hilfsdatei /tmp/x.html wurde beim HTML-Abruf angelegt (gegen die Vorgabe), nicht gelöscht (Löschverbot). Bitte entfernen oder ignorieren.

=== ENDE E5-BAUMEISTER-28 · BEREIT ZUR RÜCKGABE ===
