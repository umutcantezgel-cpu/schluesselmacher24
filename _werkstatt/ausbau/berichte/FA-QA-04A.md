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
- `src/lib/navigation.test.ts`: neuer Block „Menü ohne Überladung“ (6 Tests).
- `_werkstatt/ausbau/berichte/FA-QA-04A.md` (dieser Bericht).

Nicht geändert: Rubrikdaten, Hub, `content/seo.json`, `src/lib/data/defaults/content.ts`, `tailwind.config.ts`, `src/lib/flow/**`, Texte der Seiten. Es fehlte kein Verweis auf einer Rubrikseite, deshalb war dort nichts zu ergänzen.

## WAS UND WARUM

1. Schrift (FA-26-01). `--text-caption` ist die einzige Schriftstufe unter 14 px gewesen. Ich habe sie im Gestaltungssystem an einer Stelle auf 0.875rem gehoben. Davon betroffen sind rund 240 Verwendungen auf allen Seiten: Feldbeschriftungen in Mono und Großbuchstaben, Augenbrauen, Tabellenköpfe, Fuß, Nummern in Ablauflisten und die Beschriftung der Aktionsleiste. Zeilenhöhe (1.4 = 19,6 px) und Laufweite (`tracking-label` 0.12em, schmal 0.06em) stehen in `tailwind.config.ts`; die Datei ist nicht in meinen Schreibrechten und musste auch nicht geändert werden. 19,6 px Zeilenhöhe passt in die engsten Behälter: Warenkorb-Zähler `h-5` (20 px), Schrittnummer `size-6` (24 px), Nummernspalten `w-6` mit zwei Ziffern in Mono (etwa 17 px).
   Wo es eng werden kann, habe ich die Stellen gelesen und nachgerechnet:
   - Augenbrauen (bis 25 Zeichen) bleiben bei 360 px einzeilig (etwa 265 von 328 px).
   - Eckdaten auf `/autoschluessel` (`xl:whitespace-nowrap`) passen in etwa 175 px je Feld.
   - Tabellenköpfe dürfen ohnehin umbrechen.
   - Aktionsleiste unten: Bei 14 px reicht die Breite unter etwa 370 px nicht mehr für alle vier Beschriftungen in einer Zeile. „Termin anfragen“ bricht dann um. Das ist erlaubt (sonst müsste der Knopftext gekürzt werden, und „Ein Knopftext je Ziel“ gilt). Die Leiste wird dabei rund 75 px hoch; der Abstand `pb-safe-nav` (80 px) reicht. Kommentar angepasst.
   - `linien-zeile.tsx` „Staffelpreis ab N Stück“ (`whitespace-nowrap`) braucht jetzt rund 155 statt 135 px. Den Rest erledigt die linke Spalte mit Umbruch. Sichtprobe nötig, siehe unten.
   Der Test liest alle `--text-*`-Stufen aus `globals.css` (bei `clamp` den unteren Wert), prüft, dass `text-caption` und `text-small` in `tailwind.config.ts` auf diese Stufen zeigen, und sucht in `src/app/(site)` und `src/components` nach `text-xs`, `text-[…]`, `font-size` und `fontSize` unter 14 px. Gefunden hat er nichts.
2. Schrittlinks (FA-26-01). Alle Knöpfe der Schrittliste haben jetzt auf allen Breiten `min-h-touch` (44 px). Das gilt auch für die Teilschritte in der klebenden Seitenspalte (`raster="seite"`), die vorher ebenfalls nur 32 px hatten. `cn.ts` kennt `min-h-touch` bereits. Getestet sind einfache Liste, Etappen und Etappen mit Teilschritten; kein Knopf hat `min-h-8`, `md:min-h-8` oder ähnlich.
3. Menü (FA-26-02). Gerendert werden im Kopf nur die Spalten der vier Bereiche Autoschlüssel, Code, Zylinder und Schließanlagen, dazu unter „Mehr“ die Spalte „Außerdem“ (`MEHR_LINKS`). Die übrigen fünf Bereiche (Vorlage, Zutritt, Tür, Sicherheit, Service) haben Spalten in `NAV_AREAS`, die nirgends angezeigt werden (siehe OFFENE FRAGEN). Über der Grenze lagen nur Autoschlüssel (drei Spalten, zehn Verweise) und „Außerdem“ (fünf Verweise).
   - Autoschlüssel: zwei Spalten mit je vier Verweisen. „Leistungen“: Nachmachen, Programmieren, Kopieren, Fahrzeugöffnung. „Häufige Fälle“: Fahrzeug nicht gefunden?, Schlüssel verloren?, Funkschlüssel, Smart Key und Keyless. Ausgewählt nach den Wegen in Termin und Anfrage: Nachmachen und Programmieren führen in die Terminanfrage, „Fahrzeug nicht gefunden?“ in die Anfrage mit Fotos, Verlust und Öffnung sind die eiligen Fälle. Nächster Schritt „Termin anfragen“ und die neun Rubriken aus den Daten bleiben unverändert.
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
| Schlüssel nach Code `/schluessel-nach-code` | Nach Code, Spalte „Shop“ | weiter im selben Menü als gleichnamige Rubrik; Leiste „Nach Code“ und Aktionsleiste |
| Service und Termin `/service-und-termin` | Mehr, „Außerdem“ | Fuß (Leistungen aus den Bereichen), Aktionsleiste „Service“ (ohne Telefonnummer), Brotkrumen aller Service-Seiten, Verweis auf `/beratung`; Terminstatus im Fuß; „Mehr“ bleibt dort markiert |

Umgestellt, nicht gestrichen: Fahrzeugöffnung („Schlüsselarten“ → „Leistungen“), Funkschlüssel und Smart Key („Schlüsselarten“ → „Häufige Fälle“), Fahrzeug nicht gefunden? und Schlüssel verloren? („Fahrzeuge“ → „Häufige Fälle“). Die Spaltentitel „Schlüsselarten“ und „Fahrzeuge“ entfallen. `waisen.test.ts` ist nach der Kürzung grün; die Erreichbarkeit hält zusätzlich ein eigener Test in `navigation.test.ts` fest.

## GEMEINSAME DATEIEN

- `src/components/flow/flow-shell.tsx`: FA-QA-04B arbeitet in `src/lib/flow/**` und hat Tests in `flow-shell.test.tsx`. Ich habe nur drei Klassenzeichenketten der Schrittliste geändert und eine eigene Testdatei angelegt.
- `src/lib/navigation.ts`, `src/components/layout/site-header.tsx`, `src/app/(site)/globals.css`: Sie wirken auf jede Seite.

## PRÜFUNG UND ERGEBNIS

Alles über `_werkstatt/ausbau/werkzeuge/sicher.sh`:
- `--json -- npx vitest run`: 255 Dateien, 3994 Tests bestanden, 0 rot.
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

- Nicht gerenderte Menüspalten: `NAV_AREAS` führt Spalten für Vorlage, Zutritt, Tür und Schließtechnik (zwei Spalten mit je fünf Verweisen), Sicherheitstechnik und Service. Keine Gruppe der Kopfzeile zeigt sie. `waisen.test.ts` liest aber `src/lib/navigation.ts` als Quelltext und zählt diese Pfade als eingehende Verweise. Eine Unterseite, die nur dort steht, gälte damit als verlinkt, obwohl kein Besucher den Verweis sieht. Sollen diese Spalten in einem eigenen Paket entfernt oder aus der Zählung des Waisen-Melders genommen werden (mit Prüfung, ob dann Waisen auftauchen)? Ich habe das nicht angefasst, weil es nicht zur Kopfzeile gehört.
- `src/app/global-error.tsx` (außerhalb von `(site)`, Fehlerseite bei Totalausfall) zeigt die Fehlerkennung mit `fontSize: '0.8125rem'` (13 px). Sie liegt nicht in meinen Schreibrechten und wird vom Test nicht erfasst. Soll sie auf 14 px?
- Mails (`src/lib/mail/html.ts`) nutzen 12 px für Beschriftungen und den Fuß. Sie gehören nicht zur Website und nicht zum Auftrag.
- Laufweite `tracking-label` (0.12em) steht in `tailwind.config.ts`, nicht in `globals.css`. Falls die Sichtprobe zu breite Großbuchstaben-Zeilen zeigt, wäre dort nachzustellen (nicht in meinen Schreibrechten).
- Aktionsleiste unter etwa 370 px: Umbruch von „Termin anfragen“ ist erlaubt und hat Platz. Falls der Orchestrator eine einzeilige Leiste will, wäre „Termin“ als kürzere Beschriftung nötig. Das widerspräche „Ein Knopftext je Ziel“ (E4-JURY-02) und braucht eine Entscheidung.
- Die Spaltentitel „Leistungen“ und „Häufige Fälle“ im Menü „Autoschlüssel“ habe ich gewählt; „Häufige Fälle“ ist neu.

## FÜR MENSCHEN

- Probenutzer-Durchgang mit älteren Testpersonen (FA-BESTAND: „Sichtprüfung mit älteren Testpersonen“, „Bewertung durch Probenutzer“) für Schriftgröße und gekürztes Menü.
- Inhaber: Bestätigen, dass im Menü „Autoschlüssel“ „Schlüsselbart fräsen“ fehlen darf (es bleibt auf der Bereichsseite) und dass „Service und Termin“ unter „Mehr“ fehlen darf (Fuß, Aktionsleiste, Kontakt und „Service vor Ort nach Termin“ bleiben).

=== ENDE FA-QA-04A · BEREIT ZUR RÜCKGABE ===
