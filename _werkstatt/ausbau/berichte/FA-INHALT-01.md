# FA-INHALT-01 · Bericht · Tutorials, Teil A (Sammlung, Startbestand, Seiten)

Anforderungen FA-21-01 bis FA-21-14, FA-22-32, FA-12-04, FA-26-06 (Teil A) · Stand 16.11.2026

## GEÄNDERTE DATEIEN

Neu:
- `src/payload/collections/Tutorials.ts` (Sammlung „Tutorials“, Gruppe Inhalte)
- `src/migrations/20261116_174304_tutorials.ts` und `.json` (über `sicher.sh --pg -- npx payload migrate:create tutorials`, `down` von Hand nach der Regel umgestellt)
- `content/tutorials.json`, `src/lib/data/defaults/tutorials.ts` (Startbestand, wortgleich)
- `src/lib/tutorials/youtube.ts` (Kennung aus Link oder Kennung, Dauer), `src/lib/tutorials/orte.ts` (Orte „erscheint auf“), `src/lib/tutorials/tutorials.ts` (Auswahl und Regeln)
- `src/components/tutorial/tutorial-inhalt.tsx`, `src/components/tutorial/video-hinweis.tsx`
- `src/app/(site)/tutorials/page.tsx`, `src/app/(site)/tutorials/[slug]/page.tsx`
- Tests: `src/lib/tutorials/youtube.test.ts`, `src/lib/tutorials/tutorials.test.ts`, `src/components/tutorial/tutorial-inhalt.test.tsx`, `src/payload/collections/tutorials-felder.test.ts`, `src/app/(site)/tutorials/tutorials-seiten.test.ts`, `src/payload/tutorials.db.test.ts`

Geändert:
- `src/payload.config.ts` (Import und Eintrag `Tutorials` nach `Ratgeber`)
- `src/migrations/index.ts` (neue Migration; der vorige Eintrag bekam dabei vom Generator ein Komma)
- `src/payload-types.ts` (neu erzeugt mit `sicher.sh --pg -- npx payload generate:types`; Schnittstelle `Tutorials` über `typescript.interface`)
- `src/payload/seed.ts` (Startwert-Datei `tutorials`, Plan `tutorials` nach den Ratgebern)
- `src/lib/types.ts` (`Tutorial`, `TutorialSchritt`, `TutorialVideo`, `TutorialOrt`)
- `src/lib/data/adapter.ts`, `json-adapter.ts`, `payload-adapter.ts`, `payload-mapping.ts`, `index.ts`, `defaults/index.ts` (Sammlung `tutorials` der Datenschicht, `getTutorials`, `getTutorial`, `getTutorialsFuer`)
- `src/app/sitemap.ts` (Übersicht und indexierbare Tutorials)
- `src/payload/hooks/seiten-adresse-pruefung.ts` (nur die Zeile `'tutorials'` in `VORHANDENE_ROUTEN`)
- Tests ergänzt: `src/lib/data/payload-mapping.test.ts`, `src/lib/data/seo-laengen.test.ts`, `src/components/seo/waisen.test.ts`, `src/app/sitemap.test.ts` (Attrappe um `getTutorials` ergänzt, neuer Fall)

Nicht angefasst: `src/app/(payload)/admin/importMap.js` (keine neuen Admin-Bausteine), Navigation, Startseite, `content/rubriken.json`, Rechtstexte, Einwilligung, Content-Security-Policy, `src/lib/rechtliches/verarbeitungen.ts`, Medienablage, alle Leistungsseiten und Formulare (Teil B).

## WAS UND WARUM

1. **Sammlung `tutorials`** (FA-21-01, FA-21-14, FA-22-32). Felder: Titel als Frage, Kurzantwort (Pflicht, zwei bis drei Sätze), Thema (Bereiche wie beim Ratgeber, für die Gruppierung), Schritte (Überschrift, Text, freiwillig Bild aus der Medienablage über das vorhandene `bildFeld`), Gruppe „YouTube-Video (optional)“ mit Link oder Kennung, Titel, Dauer, Datum, eigenem Vorschaubild aus der Medienablage und Transkript, „Erscheint auf“ (Mehrfachauswahl der elf Orte aus `src/lib/tutorials/orte.ts`), „Ausführlich im Ratgeber“ (Verweis auf einen Ratgeber), Reihenfolge, SEO-Felder, Adresse, feste Kennung. Entwürfe (veröffentlicht oder nicht), Papierkorb, Erneuerungs-Hooks (`erneuernHooks`, Test in `tutorials-felder.test.ts`). Hilfetexte in Alltagssprache, etwa „YouTube-Link einfügen, speichern, fertig. Zum Austauschen einfach einen anderen Link einfügen.“
2. **YouTube-Kennung auf dem Server** (`src/lib/tutorials/youtube.ts`). Der Feld-Hook zieht vor der Prüfung und vor dem Speichern die elfstellige Kennung aus `youtube.com/watch?v=…`, `m.youtube.com`, `youtu.be/…`, `/embed/`, `/shorts/`, `/live/`, `/v/` und `youtube-nocookie.com/embed/…`, mit oder ohne `https://` und `www.`, mit Zusätzen wie `&t=` oder `?si=`. Gespeichert wird nur die Kennung, nie eine Adresse. Andere Hosts (auch `youtube.com.example.org`, Unterseiten anderer Anbieter, Zugangsdaten oder Port im Link, `javascript:`) lehnt die Prüfung mit einer Meldung in Alltagssprache ab. Die Lesesicht gibt ein Video nur mit gültiger Kennung heraus. Die Dauer wird als „4:32“ oder „1:02:15“ geprüft.
3. **Vorschaubild schon jetzt im Datenmodell.** Steht nicht in der Feldliste von Teil A, gehört aber zur Einbettung (Punkt 4 und 7 aus Teil B). So braucht Teil B keine zweite Migration. Die Lesesicht übernimmt es nur aus der eigenen Medienablage (`/api/medien/file/…`), ein fremdes Bild fällt weg (Test).
4. **Startbestand der zehn Themen** (FA-21-03 bis FA-21-12, FA-12-04). Titel im Wortlaut des Inhabers. Jeder Satz stammt aus dem Bestand:
   - Schlüssel fotografieren: Fotoanleitung der Vorlage-Seite (drei Aufnahmen, Beschriftungen), Fototipps der Formulare, Sicherungskarte aus dem Ablauf der Rubrik, Satz des Inhabers zu Fotos (FA-03).
   - Autoschlüssel fotografieren: `KEY_PHOTO_SLOTS`, Fototipps des Assistenten, „Keinen Schlüssel mehr“ und Fahrzeugschein-Pflicht aus dem Assistenten.
   - Schlüssel nach Code: Ablauf der Rubrik, Ratgeber „Wo finde ich den Schlüsselcode?“, Nachweis-Satz der Vorlage-Seite (R13).
   - Schlüssel einschicken: Ablauf der Rubrik, Beilage-Liste, Verpackungshinweis im Wortlaut des Inhabers, Versandhinweis, Rücksendung. Keine Portokosten (MA-18 offen).
   - Profilzylinder messen: Messhilfe des Zylinder-Konfigurators, Rundung aus dem Ratgeber.
   - Not- und Gefahrenfunktion: Zylinderkatalog (Standardfunktion und Not- und Gefahrenfunktion), Tür- und Schließtechnik (Antrieb), Lead der Zylinderseite.
   - Gleichschließend: Grundprinzip und Fragen der Zylinderseite.
   - HS und GHS: Ratgeber „Welche Schließanlage passt“.
   - Fahrzeugschein und Gehäuseumbau: als **Entwurf** angelegt (nicht veröffentlicht). Belegt sind nur Feld E (Fahrgestellnummer) und die Hochladeregeln, beim Gehäuse nur die vier Schritte der Rubrik. Siehe FÜR MENSCHEN.
   Kein Video, kein Link auf ein Video, keine Preise, keine Zeiten (R4).
5. **Verweisen statt verdoppeln** (R3). „Profilzylinder messen“ und „HS und GHS“ tragen den Verweis „Ausführlich im Ratgeber“. Solange kein Video eigenen Wert dazubringt, stehen sie mit `noindex, follow` und fehlen in der Sitemap. Mit Video werden sie eigene Seiten. Regel `tutorialIndexierbar`: veröffentlicht, kein `seo.noindex`, mindestens zwei belegte Schritte, kein Ratgeber-Doppel ohne Video. Dieselbe Regel steuert noindex und Sitemap. Ein Verweis auf einen Ratgeber, den es öffentlich nicht gibt, entfällt in `getTutorials`.
6. **Seiten** (FA-21-01). `/tutorials`: Übersicht nach Themen (Reihenfolge der Bereiche wie im Ratgeber), jede Zeile ein Link, Kurzantwort darunter. Ohne veröffentlichtes Tutorial: Hinweis mit Link auf den Ratgeber und noindex. `/tutorials/[slug]`: Kopf mit Frage und Kurzantwort, Brotkrumen „Tutorials › Frage“, Strukturdaten nur Webseite und Brotkrumen über `SeitenDaten` (kein `HowTo`, kein `VideoObject`, R8), oben der Videohinweis, darunter die nummerierten Schritte mit Bild (Foto, sonst die Zeichnung zum Motiv), Seitenleiste mit Ratgeber und gepflegten Links. Nur veröffentlichte Tutorials erzeugen eine Seite (`generateStaticParams`, `getTutorial`, sonst 404).
7. **Videohinweis in Teil A** (`VideoHinweis`). Nur mit hinterlegtem Video, sonst nichts: „Zu diesem Thema gibt es ein Video. Es erscheint hier, sobald die Einbettung freigeschaltet ist.“ Kein Rahmen, kein Skript, kein Bild, keine Kennung, keine Adresse von YouTube oder Google im HTML (Test über den ganzen Startbestand).
8. **Datenschicht und Rückfall** (G6). Ohne Datenbank aus `content/tutorials.json`, fehlt die Datei, aus den Defaults. Mit leerer Datenbank (nie ein Tutorial angelegt) aus den Defaults, sonst nur veröffentlichte aus der Datenbank. Entwürfe und Gelöschtes kommen nicht über den Rückfall zurück.
9. **Seed wiederholbar.** Plan `tutorials` nach den Ratgebern (Verweis über deren Kennung), Schlüssel = Kennung, Entwürfe als Entwurf, Gelöschtes kommt nicht wieder, Startwert-Abgleich für Titel, Kurzantwort, Schritte (Überschrift, Text) und SEO.
10. **Migration rein additiv.** `up`: zehn neue Typen, acht neue Tabellen, eine neue Spalte `tutorials_id` in `payload_locked_documents_rels` mit Fremdschlüssel und Index. `down`: zuerst Fremdschlüssel, Index und Spalte (`IF EXISTS`), dann Tabellen, dann Typen (`IF EXISTS`). Der Datenbanktest spielt `down` (zweimal) und `up` zurück und vor.
11. **Sitemap, Längen, Waisen.** Sitemap: `/tutorials`, sobald eines veröffentlicht ist, und jede indexierbare Seite. Titel und Beschreibungen aller zehn Einträge in den Grenzen (Titel samt Marke höchstens 60 Zeichen und 580 px, Beschreibung 120 bis 160, ohne Gedankenstrich, ohne Zusagen) und ohne Doppel über alle Seiten; die Übersicht steht unter den festen Metadaten. Waisen: Die Übersicht hat ihren eingehenden Verweis über die Brotkrume der Einzelseiten, jede Einzelseite über die Übersicht; unveröffentlichte Einträge in `tutorials.json` zählen nicht als Verweisquelle.
12. **Feste Adresse.** `tutorials` steht in `VORHANDENE_ROUTEN`; eine eigene Seite aus dem Admin kann `/tutorials` nicht überdecken.

Laufzeitbibliothek: keine neue (G7). Skript-Gewicht: Die neuen Seiten nutzen nur Serverbausteine und `next/link`; kein neuer Client-Baustein, keine Änderung an Bausteinen anderer Seiten (A-071).

## GEMEINSAME DATEIEN (gewünschte Einträge)

- **Navigation** (`src/lib/navigation.ts`, Orchestrator): Eintrag „Tutorials“ → `/tutorials` im Menü „Mehr“ und im Fuß unter „Service“. Bis dahin erreicht man `/tutorials` nur über die Einzelseiten (Brotkrume); der Waisen-Test ist grün, für Menschen ist die Rubrik aber noch eine Insel.
- `src/payload.config.ts`, `src/payload/seed.ts`, `src/lib/data/*`: je ein Eintrag für `tutorials` (im Schreibrecht).
- Optional für später: Tutorials als Verweisquelle in `src/components/seo/verweise.ts` (Gegenrichtung in „Passt dazu“). Nicht gemacht, weil es „Passt dazu“ auf fremden Seiten verändert.

## PRÜFUNG UND ERGEBNIS

Alle Befehle über die Datenweiche, nach dem letzten Stand (mit Vorschaubild-Feld und neu erzeugter Migration):
- `sicher.sh --json -- npx vitest run`: 272 Dateien, 4257 Tests, alle grün (neu: 6 Dateien, dazu Fälle in `payload-mapping.test.ts`, `seo-laengen.test.ts`, `waisen.test.ts`, `sitemap.test.ts`).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 31 Dateien, 190 Tests, alle grün (neu: `tutorials.db.test.ts` mit 7 Tests: Seed mit zwei Entwürfen, Ratgeber-Verweis, Wiederholbarkeit, Link wird Kennung, fremde Adresse und kaputte Dauer abgelehnt, Entwurf unsichtbar, Migration down/up).
- `sicher.sh --json -- npm run build`: grün, 190 statische Seiten, darunter `/tutorials` und acht Tutorial-Seiten.
- Zusatz: `reste.mjs` über alle Quellen: kein Fund in den neuen Dateien (die Funde liegen in `src/lib/pdf/partnervertrag.ts`, nicht aus diesem Paket). Das Protokoll des Laufs habe ich wieder entfernt.
- Im gebauten HTML von `/tutorials/*`: keine Zeichenkette „youtu…“ oder „google…“.

Verlangte Tests:
- Kennung aus allen üblichen Linkformen, fremde Adressen abgelehnt: `youtube.test.ts` (22 Formen, 27 Ablehnungen), `tutorials-felder.test.ts`, `tutorials.db.test.ts`.
- Vor der Zustimmung keine Adresse von YouTube oder Google im HTML: `tutorial-inhalt.test.tsx` (Teil A lädt gar nichts).
- Nach der Zustimmung nur `youtube-nocookie.com`: Teil B (keine Einbettung in Teil A).
- Nicht veröffentlichte Tutorials erzeugen keine Seite und keinen Hinweis: `tutorials.test.ts`, `tutorials-seiten.test.ts` (`generateStaticParams`, `getTutorial`, `getTutorialsFuer`, Sitemap), `sitemap.test.ts`, `tutorials.db.test.ts`.
- Richtlinie erlaubt nur den einen Rahmen: Teil B.

Hinweis: Während meiner Läufe lagen im Arbeitsbaum fremde, nicht von mir stammende Änderungen (`src/app/(site)/autoschluessel/anfrage/assistent.tsx`, `src/components/forms/photo-upload.tsx`, `src/components/forms/upload-zustand.ts`, `_werkstatt/ausbau/protokolle/FA-SEO-03C/`). Die Zahlen oben gelten mit diesen Änderungen.

## ENTWURF ZUR ANWALTLICHEN PRÜFUNG

Gehört zu Teil B (Punkt 8, `pakete/FA-INHALT-01B.md`). In Teil A wird nichts von YouTube geladen und nichts an YouTube übertragen; der Wortlaut der Datenschutzerklärung bleibt unverändert.

## OFFENE FRAGEN

1. Profilzylinder messen und HS und GHS: Ohne Video verweisen sie auf den Ratgeber und stehen mit noindex (kein Doppel, R3). Soll das so bleiben, oder sollen die Ratgeber selbst später auf die Tutorials verweisen?
2. Das Feld „Eigenes Vorschaubild“ habe ich schon in Teil A angelegt, damit Teil B ohne zweite Migration auskommt. Recht so?
3. Hilfetext im Admin: „Von YouTube wird auf der Seite erst etwas geladen, wenn der Kunde zustimmt.“ Heute stimmt das, weil gar nichts geladen wird; nach Teil B durch die Einwilligung. Teil B muss das halten.
4. Navigation: Bis der Orchestrator „Tutorials“ in Menü und Fuß einträgt, ist die Rubrik für Besucher nicht erreichbar.
5. Thema der Übersicht: „Schlüssel einschicken“ steht unter „Schlüssel nach Vorlage“ (wie die Brotkrume der Einsende-Seite). Passt die Zuordnung?

## FÜR MENSCHEN (welche Videos und Inhalte fehlen)

- Videos zu allen zehn Themen (FA-21-13). Im Admin: Tutorials › Eintrag › YouTube-Link einfügen, speichern.
- „Wo finde ich die benötigten Angaben im Fahrzeugschein?“ (Entwurf): Welche Felder außer Feld E (Fahrgestellnummer) wir brauchen, etwa Herstellerschlüssel und Typschlüssel (2.1 und 2.2), fachlich bestätigt. Ein Beispielbild nur als nachgestelltes Dokument ohne echte Daten.
- „Wie funktioniert ein Gehäuseumbau?“ (Entwurf): Ablauf im Einzelnen von der Werkstatt (was übernommen wird, was geprüft wird, was nicht geht), dazu Vorher-Nachher-Fotos (Umbau-Beispiele).
- Echte Schrittfotos für „Schlüssel richtig fotografieren“ und „Autoschlüssel richtig fotografieren“ (bis dahin erscheinen die Zeichnungen der Upload-Beispiele).
- Fachliche Prüfung aller Schritttexte und der Kurzantworten; Freigabe zum Veröffentlichen der beiden Entwürfe.
- YouTube-Kanal des Betriebs, Titel, Dauer und Datum je Video, Transkript oder Zusammenfassung, eigenes Vorschaubild.

## Stand für Teil B

- **Daten:** `Tutorial.video` (`TutorialVideo` in `src/lib/types.ts`): `youtubeId` (geprüft, elfstellig), `title`, `duration` („m:ss“), `date` (ISO-Tag), `transcript`, `thumbnail` (eigenes Bild aus der Medienablage, nur `/api/medien/file/…`). Für `VideoObject`: `dauerSekunden()` in `src/lib/tutorials/youtube.ts` rechnet die Dauer in Sekunden (ISO 8601 daraus bilden); `dauerZumVorlesen()` für Screenreader.
- **Einbettung:** `VideoHinweis` (`src/components/tutorial/video-hinweis.tsx`) ist die Stelle, an der `VideoEinbettung` einzusetzen ist; `TutorialInhalt` rendert sie oben über den Schritten. Der Test `tutorial-inhalt.test.tsx` prüft heute, dass im HTML keine Adresse von YouTube oder Google steht; Teil B ergänzt den Fall „nach Zustimmung nur youtube-nocookie.com“ und passt den Satz `VIDEO_HINWEIS_TEXT` an.
- **Hinweis-Baustein:** `getTutorialsFuer(ort)` in `src/lib/data/index.ts` liefert nur veröffentlichte, zugeordnete Tutorials (leer, wenn keins). Orte in `TUTORIAL_ORTE` (`src/lib/tutorials/orte.ts`): `schluessel-nach-vorlage`, `schluessel-nach-vorlage-fotos`, `autoschluessel-fotos`, `autoschluessel-fahrzeugschein`, `schluessel-nach-code`, `schluessel-einschicken`, `gleichschliessende-zylinder`, `gleichschliessende-zylinder-messen`, `gleichschliessende-zylinder-funktion`, `schliessanlagen`, `autoschluessel-gehaeuse`. Adresse einer Seite: `tutorialPfad()`. Achtung A-071: `getTutorialsFuer` liegt in der Datenschicht (Server); Client-Formulare bekommen die Tutorials als Eigenschaft vom Serverbaustein der Seite.
- **Indexierung:** `tutorialIndexierbar()` wertet ein Video schon als eigenen Inhalt (Ratgeber-Doppel mit Video wird indexierbar). Ob das so bleiben soll, wenn das Video erst nach Zustimmung erscheint, entscheidet Teil B mit (Transkript sichtbar machen hilft).
- **Strukturdaten:** Die Einzelseite nutzt `SeitenDaten` (Webseite und Brotkrumen). `VideoObject` dort ergänzen, nur mit Video, Titel, Beschreibung, Datum und eigenem Vorschaubild.
- **Nicht angefasst:** CSP, Einwilligungsverwaltung, `verarbeitungen.ts`, Datenschutzerklärung, Leistungsseiten und Formulare.

## Nachbesserung (17.11.2026, nach zwei Gegenprüfungen)

Je Befund am Code geprüft. Alle sieben treffen zu und sind behoben.

1. **[rot] Video zählt als eigener Inhalt, obwohl es nicht erscheint** (`src/lib/tutorials/tutorials.ts`): behoben. Neuer Schalter `VIDEO_EINBETTUNG_FREI = false`; ein Ratgeber-Doppel ist nur indexierbar, wenn die Einbettung freigeschaltet ist und eine Kennung vorliegt (`tutorialIndexierbarBei(tutorial, einbettungFrei)`, `tutorialIndexierbar` nutzt den Schalter). Teil B legt den Schalter mit `VideoEinbettung` um. Tests: `tutorials.test.ts` (Doppel mit Video und Transkript bleibt in Teil A draußen, mit Schalter drin, leere Kennung nie), `sitemap.test.ts` (Messen und HS/GHS mit Video ohne Einbettung: kein Sitemap-Eintrag). Ein Transkript zählt bewusst nicht als Mehrwert, weil die Redaktion dort auch einen einzelnen Satz eintragen kann (R3).
2. **[rot] Rubrik ist eine Insel, der Waisen-Test verdeckt das** (`src/components/seo/waisen.test.ts`): behoben, soweit im Schreibrecht. Neu `src/lib/tutorials/erreichbar.ts` mit `tutorialsVerlinkt()`: wahr erst, wenn `MEHR_LINKS` oder `FOOTER_CONTENT` in `src/lib/navigation.ts` auf `/tutorials` zeigen. `src/app/sitemap.ts` nimmt Übersicht und Einzelseiten nur dann auf; heute stehen sie nicht in der Sitemap. Der Waisen-Test ist geschärft: Für Übersichten in `NUR_VON_AUSSEN` (heute `/tutorials`) zählen Verweise aus dem eigenen Seitenordner und aus Einträgen unterhalb der Übersicht nicht. Selbsttest „eine Rubrik, die nur von ihren eigenen Einzelseiten verlinkt wird, ist eine Insel“, dazu der Abgleich `echteLage()('/tutorials') === tutorialsVerlinkt()`. Die strenge Regel gilt nicht für alle Übersichten: allgemein angewandt meldete sie `/autoschluessel/gehaeuse`, das Besucher über die Rubrikdaten (`ziel` in `content/rubriken.json`) erreichen, die der Test nicht liest. Den Navigationseintrag selbst setzt weiterhin der Orchestrator (Navigation ist für dieses Paket gesperrt): „Tutorials“ → `/tutorials` in `MEHR_LINKS` und in `FOOTER_CONTENT`. Sobald er steht, öffnet sich die Sitemap von selbst; Tests in `tutorials-seiten.test.ts` und `sitemap.test.ts` prüfen beide Lagen.
3. **[gelb] Kurzantwort „Schlüssel nach Code“ widerspricht Schritt 2**: behoben, in `content/tutorials.json` und `src/lib/data/defaults/tutorials.ts` wortgleich: „Bei einem geschützten Profil brauchen wir als Nachweis ein Foto Ihrer Sicherungskarte.“ (belegt durch `codeVerlangtKarte` in `src/lib/wege/nachweis.ts`). Hinweis: Der alte Satz steht im Bestand auch auf `src/app/(site)/schluessel-nach-vorlage/page.tsx:86` (außerhalb des Schreibrechts, nicht angefasst; OFFENE FRAGE an den Orchestrator, ob er dort ebenso angepasst werden soll).
4. **[gelb] Admin-Hilfe verspricht Anzeige, die Teil A nicht hat** (`src/payload/collections/Tutorials.ts`): behoben. „Erscheint auf“: „Hier wählen Sie, wo das Tutorial später als Hilfe erscheint. Auf den Seiten und Schritten ist das noch nicht eingeschaltet.“ Video: ergänzt um „Das Video erscheint auf der Seite, sobald die Einbettung freigeschaltet ist; bis dahin steht dort nur ein kurzer Hinweis.“ Teil B stellt beide Texte zurück. `src/payload-types.ts` neu erzeugt (nur die drei Kommentare geändert).
5. **[gelb] Transkript wird nirgends ausgegeben**: behoben. `VideoHinweis` zeigt ein gepflegtes Transkript unter dem Hinweis zum Aufklappen (`<details>`, Überschrift „Was im Video gezeigt wird“, `TRANSKRIPT_TITEL`, Text mindestens `text-small`, bricht um). Ohne Transkript erscheint nichts davon. Hilfetext im Admin entsprechend: „Erscheint auf der Seite unter dem Video zum Aufklappen …“. Test in `tutorial-inhalt.test.tsx`, auch ohne fremde Adresse.
6. **[gelb] wie 1**: mit 1 behoben (Variante Schalter statt Transkript-Bedingung, Begründung dort); `sitemap.test.ts` und `tutorials-seiten.test.ts` angepasst.
7. **[gelb] Zeitgrenze im kalten Import**: behoben. Die drei Fälle in `src/app/(site)/tutorials/tutorials-seiten.test.ts`, die nach `vi.resetModules` Seite oder Sitemap kalt laden, tragen `30_000` mit Kommentar wie in `rubrik.test.ts`; ebenso der neue Insel-Fall in `waisen.test.ts`. Keine Prüfung gelockert.

Geänderte Dateien der Nachbesserung: `src/lib/tutorials/tutorials.ts`, `src/lib/tutorials/tutorials.test.ts`, neu `src/lib/tutorials/erreichbar.ts` und `erreichbar.test.ts`, `src/app/sitemap.ts`, `src/app/sitemap.test.ts`, `src/app/(site)/tutorials/tutorials-seiten.test.ts`, `src/components/seo/waisen.test.ts`, `src/components/tutorial/video-hinweis.tsx`, `src/components/tutorial/tutorial-inhalt.test.tsx`, `src/payload/collections/Tutorials.ts`, `src/payload-types.ts` (erzeugt), `content/tutorials.json`, `src/lib/data/defaults/tutorials.ts`.

Prüfung der Nachbesserung (alles über `sicher.sh`):
- `--json -- npx vitest run`: 273 Dateien, 4262 Tests grün.
- `--json -- npm run typecheck`: grün. `--json -- npm run lint`: grün.
- `--pg -- npx vitest run -c vitest.db.config.ts`: 31 Dateien, 190 Tests grün.
- `--json -- npm run build`: grün. Der erste Lauf brach nach dem Erzeugen aller Seiten mit `SecurityFatalError` ab (Meldung von Next.js: die eingesetzte Fassung habe eine bekannte Sicherheitslücke, Empfehlung zum Update); der zweite, gleiche Lauf lief durch. OFFENE FRAGE an den Orchestrator: Sicherheitsupdate von `next` (G7 erlaubt Sicherheitsupdates) prüfen; nicht Teil dieses Pakets.

Stand für Teil B (Ergänzung): Mit der Einbettung `VIDEO_EINBETTUNG_FREI` in `src/lib/tutorials/tutorials.ts` auf `true` setzen und den Test in `tutorials.test.ts` umstellen; die Hilfetexte zu „Erscheint auf“ und zum Video zurückstellen. Der Punkt „Indexierung“ oben ist damit entschieden.

## Abnahme durch den Orchestrator (17.11.2026)

**Ergebnis: abgenommen.** Die Rubrik Tutorials (Teil A) ist vollständig ohne Video nutzbar, im Admin pflegbar und von jeder Seite erreichbar.

Vom Orchestrator bei der Abnahme ergänzt oder geändert (Entscheidung A-073):
- **Erreichbarkeit:** Eintrag „Tutorials“ im Fuß unter „Service“ (`src/lib/navigation.ts`) und ein Absatz mit Verweis auf der Ratgeber-Übersicht, der nur mit veröffentlichten Tutorials erscheint. **Abweichung vom Paket:** kein eigener Eintrag im Menü „Mehr“. Die Spalte „Außerdem“ hat vier Verweise, mehr erlaubt die Menügrenze aus FA-QA-04A nicht; „Ratgeber und Anleitungen“ führt auf die Ratgeber-Übersicht und von dort zu den Tutorials. Der Satz oben unter „GEMEINSAME DATEIEN“ („Insel“) ist damit überholt.
- **Bild eines Schritts unter dem Text statt daneben** (`tutorial-inhalt.tsx`, neu `schritt-bild.ts`): In der Spalte neben dem Text war die Bildfläche 231 bis 302 px breit; die Browsermessung fand in den Zeichnungen Schrift von 10,35 bis 13,53 px (Fensterbreiten 640 bis 1536 px) und am Telefon 13,31 px im Schließplan der Generalhauptschlüsselanlage (Kasten 3/2 zu flach). Regel A-068 verlangt mindestens 14 px bei jeder Fensterbreite. Jetzt: unter 640 px volle Inhaltsbreite, ab 640 px höchstens 384 px, bündig unter dem Text; die zwei Schließpläne im Tutorial „HS und GHS“ im Kasten 4/3 (`content/tutorials.json` und Startbestand im Code gleich). Neuer Test `schritt-bild.test.tsx` rechnet die Schrift für jede Zeichnung beider Quellen am Telefon und ab 640 px nach und findet den alten Befund (13,31 und 10,95 px) rechnerisch wieder.
- Der Satz zum Nachweis auf `/schluessel-nach-vorlage` bleibt, wie er war (allgemein: der Nachweis wird gebraucht); das Tutorial nennt den besonderen Fall der Sicherungskarte. Die Frage aus der Nachbesserung ist damit beantwortet.

Geprüft:
- Kette `abnahme.sh FA-INHALT-01`: Typprüfung, Lint, Unit-Tests, Datenbanktests und Build grün (Zahlen in STATUS.md).
- Migration an einer Wegwerf-Datenbank (eigene Datenbank `sm24_down`, nur localhost): alle 31 Migrationen eingespielt, `tutorials` auf eine eigene Charge gesetzt, `payload migrate:down`: 8 Tabellen, 10 Typen und die Spalte `tutorials_id` entfernt (151 auf 143 Tabellen), sonst nichts; `payload migrate` stellt alles wieder her. Datenbank danach gelöscht.
- Browser am Produktions-Build (Port 3000): `tutorials.cjs` 10 von 10 (Übersicht, 8 Einzelseiten mit 200, Sitemap 7 Einträge, noindex genau auf den zwei Seiten, die ein Ratgeber vollständig trägt, keine Adresse von YouTube oder Google, 360 und 1280 px ohne waagerechtes Rollen, ohne Textschrift unter 14 px, ohne Konsolenfehler, Fuß und Ratgeber verlinken). Menüprobe 19 von 19.
- Schrift der Zeichnungen: alle 9 Tutorial-Seiten bei 360, 390, 640, 768, 1024, 1280 und 1536 px: kleinste Schrift 14,13 px (Schließpläne am Telefon), sonst 15,47 bis 19,10 px; kein Text abgeschnitten, keine Überlappung.
- Überlauf: 144 Seiten bei 360, 768 und 1280 px: nur die drei bekannten Funde des Bestands (verstecktes Feld gegen Automaten; „Volkswagen“ 4 px im Assistenten bei 360 px; „Autoschlüsselgehäuse“ 3 px im Fuß bei 360 px, schon im Stand ca1a4d5), nichts Neues.
- Bildvergleich mit dem Messstand (ohne Fuß, weil er einen Verweis mehr trägt): 13 Seiten bei 360 und 1280 px bytegleich; anders nur die Ratgeber-Übersicht (neuer Absatz). Die Startseite bei 360 px weicht auch zwischen zwei Aufnahmen desselben Stands ab (Zeitpunkt der Aufnahme), kein Unterschied im Stand.
- Onpage: 144 Seiten, Median 100, kein Befund. `reste.mjs`: nur die zehn bekannten Stellen im Partnervertrag.
- Gewicht der Skripte (`gewicht.mjs`, neun Ansichten): gegenüber dem Messstand unverändert, Byte für Byte in der Summe. Auffällig, aber nicht aus diesem Paket: Der Assistent lädt in allen drei Builds mit Next.js 16.4.6 (Messstand, dieser Stand, Kopie des Livegangs) 20 Skripte und 287,4 KB; am 16.11. waren es mit 16.4.4 im selben Build 18 und 277,2 KB. Partnerlogik ist nicht im Bündel (Textsuche in allen 20 Dateien). Eine der zusätzlichen Dateien ist die Fehlerseite der Anwendung (`global-error`). Ursache gehört in FA-SEO-03C (dort vermerkt).
- Zwei Gegenprüfer (Opus) haben die Änderungen der Abnahme gelesen: kein roter Befund. Gelbe Hinweise eingearbeitet: Ratgeber-Absatz nur mit Tutorials und allgemeiner gefasst; Nachweis-Satz zurück auf den Bestand; Tests geschärft (kein Spaltenraster in der Schrittliste unter irgendeinem Namen, Klasse und Breite gekoppelt, keine verkleinerte Zeichnung, Fußeintrag in der echten Navigation).

Offen für Menschen: MA-60 (Videos, zwei Entwürfe, eigener Menüpunkt, Datenschutz für Teil B).

