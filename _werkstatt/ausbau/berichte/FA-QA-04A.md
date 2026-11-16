# FA-QA-04A · Bericht: Menü kürzen, Beschriftungen lesbar, Schrittlinks groß genug

Anforderungen FA-26-01, FA-26-02. Rolle Baumeister. Kein git, kein Server, keine Formularsendung.

## GEÄNDERTE DATEIEN

- `src/app/(site)/globals.css`: nur `--text-caption` 0.75rem → 0.875rem (12 → 14 px), Kommentar mit Verweis auf den Test.
- `src/components/flow/flow-shell.tsx`: nur die Schrittliste. Drei Knopfklassen `min-h-8` bzw. `md:min-h-8` → `min-h-touch` (44 px auf allen Breiten): Etappenknöpfe, Teilschritte der aktuellen Etappe (`schrittknopf`), einfache Schrittliste.
- `src/lib/navigation.ts`: Spalten der Gruppe Autoschlüssel gekürzt, Doppel in „Nach Code“ gestrichen, `MEHR_LINKS` auf vier, neue Konstante `MENUE_GRENZE`, neues Feld `NavGruppe.bereichHref`, `gruppeAktiv` aus dem Kopf hierher verlegt (reine Funktion, jetzt testbar).
- `src/components/layout/site-header.tsx`: `gruppeAktiv` aus `navigation.ts` importiert (prüft zusätzlich `bereichHref`); im Desktop-Menü stehen die Spalten neben den Rubriken untereinander in einer Zelle.
- `src/components/layout/mobile-action-bar.tsx`: nur der Kommentar über der Leiste (Umbruch von „Termin anfragen“ bei 14 px erlaubt).
- Neu: `src/app/(site)/schriftstufen.test.ts` (Untergrenze 14 px).
- Neu: `src/components/flow/flow-shell-tippflaeche.test.tsx` (Schrittlinks 44 px). Eigene Datei, damit `flow-shell.test.tsx` für FA-QA-04B frei bleibt.
- `src/lib/navigation.test.ts`: neuer Block „Menü ohne Überladung“ (6 Tests, mit Nachbesserung 8).
- Nachbesserung: `src/app/(site)/tuer-und-schliesstechnik/page.tsx` (nur das Linkziel der Leistungsliste als ausgeschriebener Pfad), `src/components/layout/site-footer.test.tsx` (ein Test), dazu `navigation.ts`, `navigation.test.ts`, `schriftstufen.test.ts`.
- `_werkstatt/ausbau/berichte/FA-QA-04A.md` (dieser Bericht).

Nicht geändert: Rubrikdaten, Hub, `content/seo.json`, `src/lib/data/defaults/content.ts`, `tailwind.config.ts`, `src/lib/flow/**`, Texte der Seiten. Es fehlte kein Verweis auf einer Rubrikseite, deshalb war dort nichts zu ergänzen.

## WAS UND WARUM

1. Schrift (FA-26-01). `--text-caption` ist die einzige Schriftstufe des Gestaltungssystems unter 14 px gewesen. Nicht erfasst war damit die Beschriftung der SVG-Grafiken (viewBox-Einheiten, 12 und 13); siehe Nachbesserung und OFFENE FRAGEN. Ich habe sie im Gestaltungssystem an einer Stelle auf 0.875rem gehoben. Davon betroffen sind rund 240 Verwendungen auf allen Seiten: Feldbeschriftungen in Mono und Großbuchstaben, Augenbrauen, Tabellenköpfe, Fuß, Nummern in Ablauflisten und die Beschriftung der Aktionsleiste. Zeilenhöhe (1.4 = 19,6 px) und Laufweite (`tracking-label` 0.12em, schmal 0.06em) stehen in `tailwind.config.ts`; die Datei ist nicht in meinen Schreibrechten und musste auch nicht geändert werden. 19,6 px Zeilenhöhe passt in die engsten Behälter: Warenkorb-Zähler `h-5` (20 px), Schrittnummer `size-6` (24 px), Nummernspalten `w-6` mit zwei Ziffern in Mono (etwa 17 px).
   Wo es eng werden kann, habe ich die Stellen gelesen und nachgerechnet:
   - Augenbrauen (bis 25 Zeichen) bleiben bei 360 px einzeilig (etwa 265 von 328 px).
   - Eckdaten auf `/autoschluessel` (`xl:whitespace-nowrap`) passen in etwa 175 px je Feld.
   - Tabellenköpfe dürfen ohnehin umbrechen.
   - Aktionsleiste unten: Bei 14 px reicht die Breite unter etwa 370 px nicht mehr für alle vier Beschriftungen in einer Zeile. „Termin anfragen“ bricht dann um. Das ist erlaubt (sonst müsste der Knopftext gekürzt werden, und „Ein Knopftext je Ziel“ gilt). Die Leiste wird dabei rund 75 px hoch; der Abstand `pb-safe-nav` (80 px) reicht. Kommentar angepasst.
   - `linien-zeile.tsx` „Staffelpreis ab N Stück“ (`whitespace-nowrap`) braucht jetzt rund 155 statt 135 px. Den Rest erledigt die linke Spalte mit Umbruch. Sichtprobe nötig, siehe unten.
   Der Test liest alle `--text-*`-Stufen aus `globals.css` (bei `clamp` den unteren Wert), prüft, dass `text-caption` und `text-small` in `tailwind.config.ts` auf diese Stufen zeigen, und sucht in `src/app/(site)` und `src/components` nach `text-xs`, `text-[…]`, `font-size` und `fontSize:` unter 14 px. Dort hat er nichts gefunden. Die JSX-Attribute `fontSize={…}` der Grafiken sah diese erste Fassung nicht; das prüft seit der Nachbesserung ein eigener Block (siehe unten).
2. Schrittlinks (FA-26-01). Alle Knöpfe der Schrittliste haben jetzt auf allen Breiten `min-h-touch` (44 px). Das gilt auch für die Teilschritte in der klebenden Seitenspalte (`raster="seite"`), die vorher ebenfalls nur 32 px hatten. `cn.ts` kennt `min-h-touch` bereits. Getestet sind einfache Liste, Etappen und Etappen mit Teilschritten; kein Knopf hat `min-h-8`, `md:min-h-8` oder ähnlich.
3. Menü (FA-26-02). Gerendert werden im Kopf nur die Spalten der vier Bereiche Autoschlüssel, Code, Zylinder und Schließanlagen, dazu unter „Mehr“ die Spalte „Außerdem“ (`MEHR_LINKS`). Die übrigen fünf Bereiche (Vorlage, Zutritt, Tür, Sicherheit, Service) haben Spalten in `NAV_AREAS`, die nirgends angezeigt werden (siehe OFFENE FRAGEN). Über der Grenze lagen nur Autoschlüssel (drei Spalten, zehn Verweise) und „Außerdem“ (fünf Verweise).
   - Autoschlüssel: zwei Spalten mit je vier Verweisen. „Leistungen“: Nachmachen, Programmieren, Kopieren, Fahrzeugöffnung. „Schlüsselarten und Hilfe“ (in der ersten Fassung „Häufige Fälle“, siehe Nachbesserung): Funkschlüssel, Smart Key und Keyless, Schlüssel verloren?, Fahrzeug nicht gefunden?. Ausgewählt nach den Wegen in Termin und Anfrage: Nachmachen und Programmieren führen in die Terminanfrage, „Fahrzeug nicht gefunden?“ in die Anfrage mit Fotos, Verlust und Öffnung sind die eiligen Fälle. Nächster Schritt „Termin anfragen“ und die neun Rubriken aus den Daten bleiben unverändert.
   - Nach Code: der Spaltenverweis „Schlüssel nach Code“ fällt weg. Er stand mit gleichem Namen und gleichem Ziel schon als Rubrik darüber.
   - Mehr, „Außerdem“: „Service und Termin“ fällt weg. Shop (A-057: „unter Mehr an erster Stelle“), Partner werden, Ratgeber und Kontakt (G-08) bleiben. Damit „Mehr“ auf `/service-und-termin`, `/terminstatus` und `/anfrage` weiter markiert ist, trägt jede Gruppe `bereichHref` (Seite ihres Bereichs), und `gruppeAktiv` prüft auch diesen Wert.
   - Layout: Im Desktop-Menü stehen die höchstens zwei Spalten neben den Rubriken untereinander. Ohne diese Änderung wäre die zweite Spalte bei Autoschlüssel unter die lange Rubrikliste gerutscht. Telefonnavigation (Schublade) und Fuß nutzen dieselben Daten. Die Schublade zeigt jetzt die acht statt zehn Verweise. Der Fuß liest aus `NAV_AREAS` nur `href` und `label` der Bereiche und ist unverändert; `/service-und-termin` steht dort weiter.
   - Die fünf Gruppen der Kopfzeile bleiben (A-057, A-065); der Test prüft das.
   Gezählt ohne Rubriken und nächsten Schritt: vorher 27 Verweise in den Spalten und unter „Außerdem“ (10, 4, 4, 4, 5), jetzt 23 (8, 3, 4, 4, 4).

### Liste der gestrichenen Menüverweise und wo sie jetzt erreichbar sind

| Verweis | vorher im Menü | jetzt erreichbar |
|---|---|---|
| Schlüsselbart fräsen `/autoschluessel/schluesselbart-fraesen` | Autoschlüssel, Spalte „Leistungen“ | Bereichsseite `/autoschluessel` (Leistungsliste „Schlüsselbart fräsen“) und Verweisliste auf `/autoschluessel/funkschluessel` |
| Marken und Modelle `/autoschluessel/marken` | Autoschlüssel, Spalte „Fahrzeuge“ | weiter im selben Menü als Rubrik „Autoschlüssel-Finder“ (gleiches Ziel); auf `/autoschluessel` verlinkt |
| Türzusatzschlösser `/tuer-und-schliesstechnik/tuerzusatzschloesser` und Montage und Anpassung `/tuer-und-schliesstechnik/montage-und-anpassung` (Nachbesserung) | `NAV_AREAS` Tür und Schließtechnik, Spalten nicht gerendert | Leistungsliste der Bereichsseite `/tuer-und-schliesstechnik` (alle aktiven Leistungen) |
| Schlüssel nach Code `/schluessel-nach-code` | Nach Code, Spalte „Shop“ | weiter im selben Menü als gleichnamige Rubrik; Leiste „Nach Code“ und Aktionsleiste |
| Service und Termin `/service-und-termin` | Mehr, „Außerdem“ | tragend: Fuß (Leistungen aus den Bereichen, Test am gerenderten Fuß) und Brotkrumen aller Service-Seiten; dazu Verweis auf `/beratung`, Terminstatus im Fuß; „Mehr“ bleibt dort markiert. Die Aktionsleiste zeigt „Service“ nur ohne wählbare Telefonnummer; da `content/settings.json` eine Nummer führt, steht dort „Anrufen“, dieser Weg entfällt also im Regelbetrieb |

Umgestellt, nicht gestrichen: Fahrzeugöffnung („Schlüsselarten“ → „Leistungen“), Funkschlüssel und Smart Key („Schlüsselarten“ → „Schlüsselarten und Hilfe“), Fahrzeug nicht gefunden? und Schlüssel verloren? („Fahrzeuge“ → „Schlüsselarten und Hilfe“). Der Spaltentitel „Fahrzeuge“ entfällt. `waisen.test.ts` ist nach der Kürzung grün; die Erreichbarkeit hält zusätzlich ein eigener Test in `navigation.test.ts` fest.

## GEMEINSAME DATEIEN

- `src/components/flow/flow-shell.tsx`: FA-QA-04B arbeitet in `src/lib/flow/**` und hat Tests in `flow-shell.test.tsx`. Ich habe nur drei Klassenzeichenketten der Schrittliste geändert und eine eigene Testdatei angelegt.
- `src/lib/navigation.ts`, `src/components/layout/site-header.tsx`, `src/app/(site)/globals.css`: Sie wirken auf jede Seite.

## PRÜFUNG UND ERGEBNIS

Alles über `_werkstatt/ausbau/werkzeuge/sicher.sh`:
- `--json -- npx vitest run`: 255 Dateien, 3994 Tests bestanden, 0 rot (nach der Nachbesserung 4006, siehe unten).
- `-- npm run typecheck` (`tsc --noEmit`): ohne Fehler.
- `-- npm run lint` (`eslint .`): ohne Befund.
- `--json -- npm run build`: Exit 0, alle Routen gebaut.

## BELEGE

- `src/app/(site)/globals.css:161`: `--text-caption: 0.875rem;`
- `src/components/flow/flow-shell.tsx`: kein `min-h-8` mehr (`grep min-h-8` ohne Treffer).
- `src/lib/navigation.ts`: `MENUE_GRENZE = { spalten: 2, verweiseJeSpalte: 4 }`; Test „keine Gruppe der Kopfzeile hat mehr als zwei Spalten mit je vier Verweisen“ (zählt „Außerdem“ als Spalte).
- Tests: `src/app/(site)/schriftstufen.test.ts` (4), `src/components/flow/flow-shell-tippflaeche.test.tsx` (4), `src/lib/navigation.test.ts` Block „Menü ohne Überladung“ (6).

Seiten mit den meisten Änderungen (für die Sichtprobe bei 360, 390, 768 und 1280 px):
1. Kopfmenü „Autoschlüssel“ bei 1280 px (Spalten untereinander neben den Rubriken) und die Schublade „Autoschlüssel“ und „Mehr“ bei 360 und 768 px.
2. Formulare mit Schrittliste ab 768 px: `/autoschluessel/anfrage`, `/schluessel-nach-vorlage/anfrage`, `/schliessanlagen/konfigurator`, `/gleichschliessende-zylinder/konfigurator`, `/sicherheitstechnik/sicherheitscheck`, besonders die Seitenspalte mit Teilschritten (`raster="seite"`) bei 1280 px.
3. Aktionsleiste unten bei 360 px (Umbruch „Termin anfragen“) und Fuß.
4. Tabellen und Beschriftungen: `/gleichschliessende-zylinder`, `/autoschluessel/marken/<marke>`, `/autoschluessel/marken/<marke>/<modell>` (Datenfelder), `/elektronische-zutrittsloesungen`, `/autoschluessel` (Eckdaten im Kopf), `/schluessel-nach-code` (Codelinien mit Staffelpreis), `/warenkorb` und die Zusammenfassungen (`summary-list`).

## OFFENE FRAGEN

- Nicht gerenderte Menüspalten: `NAV_AREAS` führt Spalten für Vorlage, Zutritt, Tür und Schließtechnik (seit der Nachbesserung zwei Spalten mit je vier Verweisen; ein Test hält die Grenze für alle Bereiche fest), Sicherheitstechnik und Service. Keine Gruppe der Kopfzeile zeigt sie. `waisen.test.ts` liest aber `src/lib/navigation.ts` als Quelltext und zählt diese Pfade als eingehende Verweise. Eine Unterseite, die nur dort steht, gälte damit als verlinkt, obwohl kein Besucher den Verweis sieht. Sollen diese Spalten in einem eigenen Paket entfernt oder aus der Zählung des Waisen-Melders genommen werden (mit Prüfung, ob dann Waisen auftauchen)? Ich habe das nicht angefasst, weil es nicht zur Kopfzeile gehört.
- `src/app/global-error.tsx` (außerhalb von `(site)`, Fehlerseite bei Totalausfall) zeigt die Fehlerkennung mit `fontSize: '0.8125rem'` (13 px). Sie liegt nicht in meinen Schreibrechten und wird vom Test nicht erfasst. Soll sie auf 14 px?
- Mails (`src/lib/mail/html.ts`) nutzen 12 px für Beschriftungen und den Fuß. Sie gehören nicht zur Website und nicht zum Auftrag.
- Laufweite `tracking-label` (0.12em) steht in `tailwind.config.ts`, nicht in `globals.css`. Falls die Sichtprobe zu breite Großbuchstaben-Zeilen zeigt, wäre dort nachzustellen (nicht in meinen Schreibrechten).
- Aktionsleiste unter etwa 370 px: Umbruch von „Termin anfragen“ ist erlaubt und hat Platz. Falls der Orchestrator eine einzeilige Leiste will, wäre „Termin“ als kürzere Beschriftung nötig. Das widerspräche „Ein Knopftext je Ziel“ (E4-JURY-02) und braucht eine Entscheidung.
- Die Spaltentitel „Leistungen“ und „Schlüsselarten und Hilfe“ im Menü „Autoschlüssel“ habe ich gewählt; „Schlüsselarten und Hilfe“ ist neu (Nachbesserung, ersetzt „Häufige Fälle“).
- Schrift der SVG-Grafiken (Nachfolgepaket nötig): Die Grafiken beschriften in viewBox-Einheiten mit `SCHRIFT = 13` und `SCHRIFT_KLEIN = 12` (`src/components/visual/generators/grafik-basis.tsx:28-29`), dazu eigene Flächen mit 12 (schmaler Schließplan `schliessplan.tsx:62`, schmaler Ablauf `ablauf.tsx:59`). Dargestellt wird Wert × Darstellungsbreite / viewBox-Breite: der schmale Schließplan (Startseite auf dem Telefon, `src/app/(site)/page.tsx:389`, und Projektkonfigurator) erscheint bei 358 px mit rund 11,9 px, der schmale Ablauf (300 Einheiten) mit rund 14,3 px, breite Grafiken (480 Einheiten) je nach Spaltenbreite auch deutlich unter 13 px. Das verletzt „Keine Stelle bleibt unter 14 px“. Die Grafiken liegen nicht in den Schreibrechten dieses Pakets, und eine größere Schrift verschiebt Beschriftungen, Abstände und Flächenhöhen (Sichtprobe nötig). Vorschlag für ein Nachfolgepaket: schmale Flächen auf mindestens 14 Einheiten bei Darstellung 1:1, `SCHRIFT`/`SCHRIFT_KLEIN` und die Darstellungsbreiten der breiten Grafiken prüfen. Der Test `schriftstufen.test.ts` führt die 14 Stellen als bekannte, offene Liste (`BEKANNTE_GRAFIKSCHRIFT`) und wird bei jeder neuen oder behobenen Stelle rot.

## FÜR MENSCHEN

- Probenutzer-Durchgang mit älteren Testpersonen (FA-BESTAND: „Sichtprüfung mit älteren Testpersonen“, „Bewertung durch Probenutzer“) für Schriftgröße und gekürztes Menü.
- Inhaber: Bestätigen, dass im Menü „Autoschlüssel“ „Schlüsselbart fräsen“ fehlen darf (es bleibt auf der Bereichsseite) und dass „Service und Termin“ unter „Mehr“ fehlen darf (Fuß, Brotkrumen, Kontakt und „Service vor Ort nach Termin“ bleiben; die Aktionsleiste zeigt „Service“ nur ohne Telefonnummer).

## Nachbesserung (Gegenprüfung, 16.11.2026)

1. [rot] Grafikschrift unter 14 px (`grafik-basis.tsx:28`, `schliessplan.tsx:62`): zutreffend, behoben im Bericht und im Test, nicht in den Grafiken. Die Beschriftung der SVG-Grafiken liegt bei 12 und 13 viewBox-Einheiten, der schmale Schließplan erscheint bei 358 px mit rund 11,9 px; der Bericht hatte `text-caption` fälschlich als einzige Stelle unter 14 px genannt. Richtiggestellt in WAS UND WARUM und als OFFENE FRAGE mit Vorschlag für ein Nachfolgepaket aufgenommen. Die Grafiken selbst habe ich nicht geändert: Sie stehen nicht in den Schreibrechten, und größere Schrift verschiebt Anordnung und Flächenhöhen, was eine Sichtprobe braucht.
2. [rot] Test sieht `fontSize={…}` nicht (`schriftstufen.test.ts:73`): zutreffend, behoben. Neuer Block „Schrift der SVG-Grafiken“: liest jedes JSX-Attribut `fontSize={…}` bzw. `fontSize="…"` in `src/app/(site)` und `src/components`, löst Zahlen, Konstanten (`SCHRIFT`, `SCHRIFT_KLEIN` aus `grafik-basis.tsx`, eigene Konstanten der Datei) und Felder der Flächen (`f.schrift`, `f.klein`, abgeleitete `schrift = r(SCHRIFT_KLEIN / skala)`) auf; ein nicht lesbarer Ausdruck macht ihn rot. Die 14 Stellen unter 14 Einheiten stehen genau als `BEKANNTE_GRAFIKSCHRIFT`; jede neue und jede behobene Stelle macht den Test rot. Die Darstellungsgröße in px hängt von der Breite ab und steht deshalb im Kommentar und in den OFFENEN FRAGEN, nicht im Test. Keine Prüfung wurde gelockert: die bisherigen vier Tests bleiben unverändert.
3. [gelb] `NAV_AREAS` Tür und Schließtechnik mit 2 × 5 (`navigation.ts:200`): zutreffend, behoben. Je Spalte fällt der fünfte Verweis weg (Türzusatzschlösser, Montage und Anpassung); beide stehen in der Leistungsliste der Bereichsseite. Der Waisen-Melder fand sie danach zunächst als Waisen, weil er die Vorlage `/${ROUTE}/${service.slug}` nicht als Pfad erkennt; die Bereichsseite schreibt das Linkziel jetzt aus (`/tuer-und-schliesstechnik/${service.slug}`, gleiches Ziel, gleiche Darstellung), danach ist `waisen.test.ts` grün. Neuer Test: die Grenze gilt für alle `NAV_AREAS.columns`; dazu prüft der Erreichbarkeitstest die zwei Verweise auf der Bereichsseite und in `content/service-pages.json`.
4. [gelb] Spaltentitel „Häufige Fälle“ (`navigation.ts:59`): zutreffend, behoben. Der Titel heißt jetzt „Schlüsselarten und Hilfe“ und trägt beide Arten: zuerst Funkschlüssel und Smart Key und Keyless, dann die Fragen „Schlüssel verloren?“ und „Fahrzeug nicht gefunden?“. „Schlüsselarten“ war schon der Spaltentitel des Bestands. Den Vorschlag „Schlüssel und Notfälle“ habe ich nicht übernommen, weil „Fahrzeug nicht gefunden?“ kein Notfall ist. Test hält die Titel fest.
5. [gelb] Aktionsleiste als Ersatzweg für „Service und Termin“: zutreffend, behoben. `mobile-action-bar.tsx` zeigt „Service“ nur ohne wählbare Nummer, `content/settings.json` führt eine. Tabelle und FÜR MENSCHEN nennen jetzt Fuß und Brotkrumen als tragende Wege und den Wegfall des Aktionsleisten-Wegs bei hinterlegter Nummer.
6. [gelb] Test prüft den gerenderten Fuß nicht (`navigation.test.ts:203`): zum Teil zutreffend, ergänzt. `site-footer.test.tsx` prüfte schon vorher am gerenderten Fuß `href` jeder Bereichsseite aus `NAV_AREAS` (also auch `/service-und-termin`); fiele die Bereichsschleife weg, wäre dieser Test rot geworden. Ausdrücklich ergänzt: ein Test in `site-footer.test.tsx` prüft mit `renderToStaticMarkup` `href="/service-und-termin"` und `href="/service-und-termin/terminstatus"`, und `navigation.test.ts` liest die Bereichsschleife im Quelltext des Fußes.

Geänderte Dateien der Nachbesserung: `src/lib/navigation.ts`, `src/lib/navigation.test.ts`, `src/app/(site)/schriftstufen.test.ts`, `src/components/layout/site-footer.test.tsx`, `src/app/(site)/tuer-und-schliesstechnik/page.tsx` (nur das Linkziel), dieser Bericht.

Prüfung nach der Nachbesserung (alles über `sicher.sh`): `--json -- npx vitest run` 255 Dateien, 4006 Tests bestanden, 0 rot · `-- npm run typecheck` ohne Fehler · `-- npm run lint` ohne Befund · `--json -- npm run build` Exit 0.

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh`, alle vier Pakete der Welle gemeinsam im Arbeitsbaum, nach allen Eingriffen des Orchestrators): Typprüfung grün, Lint grün, Unit 4047 von 4047, Datenbanktests 171 von 171, Build 181 von 181 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 137 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Sichtprobe am Prüfserver (`menue.cjs`, Produktions-Build, 360, 390, 768 und 1280 px): 19 von 19. Geprüft sind: keine Textschrift unter 14 px auf der Startseite; kein waagerechtes Rollen auf der Startseite und auf „Schlüssel nach Code“; in der Schublade des Telefonmenüs ist „Schlüssel verloren?“ unter Autoschlüssel erreichbar; Menü Autoschlüssel mit den Spalten „Leistungen“ und „Schlüsselarten und Hilfe“ und höchstens zwei Spalten mit je vier Verweisen neben den Rubriken; Schrittknöpfe der Formulare 44 px hoch bei 768 und 1280 px.

Zu den offenen Fragen:
- Schrift der Zeichnungen: erledigt mit FA-QA-04D (siehe dort; Liste `BEKANNTE_GRAFIKSCHRIFT` ist leer).
- `src/app/global-error.tsx`: Fehlerkennung jetzt 14 statt 13 px (Orchestrator).
- Mails mit 12 px: nicht Teil der Website, vorgemerkt für die Schlussprüfung (FA-QA-01).
- Nicht gerenderte Menüspalten in `NAV_AREAS`, die der Waisen-Melder mitzählt: nicht gebaut, vorgemerkt (A-068).
- Aktionsleiste unter 370 px: Der Umbruch von „Termin anfragen“ bleibt („Ein Knopftext je Ziel“).

Für Menschen (MA-57): gekürztes Menü und neuer Spaltentitel bestätigen; Probe mit älteren Testpersonen.

=== ENDE FA-QA-04A · BEREIT ZUR RÜCKGABE ===
