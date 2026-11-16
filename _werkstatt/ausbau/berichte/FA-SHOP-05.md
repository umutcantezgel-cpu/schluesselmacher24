# FA-SHOP-05 · Bericht

Shop: Artikelliste je Kategorie, Pflichtangaben bei Codeprodukten, Importspalten Schlüsseltyp und Einsatzbereich.
Anforderungen FA-10-01, FA-10-10, FA-10-11, FA-11-07, FA-11-09, FA-11-18. Ohne neues Datenschema, ohne Migration.

## GEÄNDERTE DATEIEN

Neu:
- `src/app/(site)/artikel/kategorie/[slug]/page.tsx`: Artikelliste je Kategorie
- `src/app/(site)/artikel/kategorie/[slug]/page.test.tsx`
- `src/app/(site)/artikel/artikel-ansicht.tsx`: gemeinsame Teile beider Listen (Karten-Daten, Beispielhinweis, Unterkategorien)

Geändert:
- `src/lib/data/shop.ts`: Hilfen `ARTIKEL_PFAD`, `ARTIKEL_KATEGORIE_PFAD`, `ersteArtikelKategorie`, `artikelDerKategorie`, `artikelListenKategorien`, `artikelListePfad`, `artikelUnterkategorien`, `artikelKategorieKette`
- `src/lib/artikel.ts`: `artikelKategorieTitel`, `artikelKategorieBeschreibung` (Suchtexte der neuen Route)
- `src/app/(site)/artikel/page.tsx`: gefilterte Liste, Unterkategorien, Brotkrumen über den Shop
- `src/app/(site)/artikel/page.test.tsx`
- `src/app/(site)/artikel/[slug]/page.tsx`: Brotkrumen mit der Kategorie des Artikels
- `src/app/(site)/shop/kategorie-weg.ts`: `kategorieWeg` mit drittem Parameter `ersteArtikel`, Zählung ohne Fahrzeugteile über `artikelDerKategorie`
- `src/app/(site)/shop/kategorie-weg.test.ts`
- `src/app/(site)/shop/page.tsx`: übergibt, ob die Kategorie die erste Artikel-Kategorie ist
- `src/app/sitemap.ts`: `/artikel` nach derselben Regel wie die Seite, neue Listen nur mit indexierbarem Artikel
- `src/payload/collections/Produkte.ts`: `herstellerPruefen`, `codebereichPruefen` und die Prüfung am Feld Hersteller (Auswahl); Feldbeschreibungen nennen die Pflicht
- `src/payload/collections/shop-sammlungen.test.ts`: Unit-Test der Prüffunktionen
- `src/payload/shop-grundlage.db.test.ts`: zwei neue Datenbanktests, ein Testfall um die Pflichtangaben ergänzt
- `scripts/sortiment-import.mjs`: freiwillige Spalten `schluesseltyp` und `einsatz`
- `scripts/sortiment-import.test.ts`
- `_werkstatt/ausbau/erhebung/boegen/SORTIMENT-vorlage.csv`: zwei Spalten mehr
- `src/lib/data/seo-laengen.test.ts`: Suchtexte der neuen Route
- `docs/betrieb/shop-pflegen.md`: Abschnitte 1, 2 und 8 ergänzt

## WAS UND WARUM

1. **Artikelliste je Kategorie (FA-10-10, FA-10-11, FA-10-01).**
   - Eine Regel für Liste und Zahl: `artikelDerKategorie(kategorien, artikel, id, ohneKategorie)`. Sie nimmt die Artikel der Kategorie und aller Unterkategorien, Artikel ohne Kategorie nur für die erste Artikel-Kategorie und nie Fahrzeugteile. `anzahlJeKategorie` zählt jetzt über genau diese Funktion. Damit stimmen die Zahl im Shop und die Liste überein. Tests in `kategorie-weg.test.ts` halten das mit Testdaten und mit dem Startbestand fest.
   - `/artikel` zeigt die erste sichtbare Hauptkategorie mit der Art „artikel“ samt Unterkategorien und die Artikel ohne Kategorie. Gehäuseteile erscheinen dort nicht mehr. Metadaten (noindex) und Sitemap folgen derselben Auswahl. Die Liste verlinkt Unterkategorien mit Artikeln. Die Brotkrumen gehen jetzt über `/shop`.
   - Neue Route `/artikel/kategorie/[slug]`: für jede weitere sichtbare Artikel-Hauptkategorie und jede Unterkategorie einer Artikel-Hauptkategorie. Name und Beschreibung kommen aus den Daten, die Karten sind dieselben (`ArtikelListe`), die Brotkrumen gehen über `/shop`. Ohne indexierbaren Artikel ist die Seite noindex und steht nicht in der Sitemap. Ohne Artikel zeigt sie den Hinweis der Kategorie (sonst `HINWEIS_PRODUKTE_FOLGEN`) und „Artikel anfragen“ mit dem Namen, wie der Kategorie-Weg. Eine frühere Adresse leitet dauerhaft weiter. Die Adresse der ersten Artikel-Kategorie leitet auf `/artikel` (keine zweite Adresse für dieselbe Liste, R2). Vorab gebaut werden nur Kategorien mit Artikeln, `dynamicParams = true` (vorher gelesen: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`).
   - `kategorieWeg`: Eine Artikel-Kategorie, die nicht die erste ist und deren Ziel leer ist oder auf `/artikel` zeigt, führt auf ihre eigene Liste. Ein anderes gepflegtes Ziel bleibt.
   - Seite eines Artikels: Die Brotkrumen zeigen „Shop › Hauptkategorie › (Unterkategorie) › Artikel“, wenn der Artikel in einer sichtbaren Artikel-Kategorie steht. Ohne Kategorie bleibt es bei „Artikel“. Fahrzeugteile bleiben unverändert.
   - Suchtexte der neuen Route: Titel ist der Name der Kategorie, gekürzt an Wortgrenzen, falls er mit Markenzusatz nicht passt. Die Beschreibung kommt aus der Kategorie (`seo`) oder aus `artikelKategorieBeschreibung` (Direktkauf nur mit bestellbarem Artikel, sonst Anfrage). Die Längen sind in `seo-laengen.test.ts` geprüft.
2. **Pflichtangaben beim Veröffentlichen (FA-11-07, FA-11-09).** `herstellerPruefen` und `codebereichPruefen` folgen dem Muster von `systemPruefen`. Sie gelten nur für Codeprodukte, die kein Beispiel sind, und greifen nur beim Veröffentlichen, weil Payload Entwürfe ohne Prüfung speichert. Als Hersteller zählt die Auswahl aus dem Stamm oder der ältere Freitext. Platzhalter in eckigen Klammern zählen nicht (R4). Die Meldung steht am Feld. Am Feld Hersteller läuft danach weiter die übliche Prüfung des Verweises (`validations.relationship`). Tests: Unit-Test der reinen Funktionen sowie Datenbanktests für Veröffentlichen, Entwurf, alten Freitext und Bestand (siehe unten).
3. **Importspalten (FA-11-18).** `FREIWILLIGE_SPALTEN = ['schluesseltyp', 'einsatz']`. Die Spalten dürfen in der Tabelle fehlen, `SPALTEN` und die Kopfprüfung bleiben unverändert. `schluesseltyp` wird zu `keyType` (Backend „Schlüsseltyp“). `einsatz` wird zu `application` (Backend „Einsatzbereich“). Ist `einsatz` leer, bleibt es wie bisher bei „Hersteller System“. Der Import legt weiter nur Entwürfe an (`active: false`, im Test über `codeLineZuPayload(...)._status === 'draft'` belegt). Die Vorlage hat zwei Spalten mehr, mit Werten nur in der Beispielzeile.
4. **Betreiberanleitung** `docs/betrieb/shop-pflegen.md`: Pflichtangaben beim Veröffentlichen und das Verhalten älterer veröffentlichter Produkte (Abschnitt 1), Artikellisten je Kategorie (Abschnitt 2), freiwillige Spalten (Abschnitt 8).

## GEMEINSAME DATEIEN

Die neue Pflicht beim Veröffentlichen ließ Datenbanktests anderer Pakete scheitern. Sie legen veröffentlichte Codeprodukte ohne Hersteller und Codebereich an. Ich habe dort nur die Testdaten um `hersteller: 'Testhersteller'` und `codebereich: '0001 bis 9999'` ergänzt. Das ist dasselbe Muster wie bei der Systempflicht aus FA-SHOP-01, an keiner Prüfung wurde etwas gelockert (G8):
- `src/lib/data/payload.db.test.ts` (Konstante `basis`)
- `src/lib/data/vorgaenge.db.test.ts` (Konstante `artikel` in „Bestellungen“)
- `src/lib/data/admin-alltag.db.test.ts` („Produkt duplizieren“)
- `src/payload/seed.db.test.ts` (echte Testlinie mit Hersteller und Codebereich; sonst überspringt der Seed sie zu Recht)

Weitere gemeinsam genutzte Stellen: `src/lib/data/shop.ts` (neue Hilfen, nichts Bestehendes geändert) und `kategorieWeg` (neuer dritter Parameter mit Vorgabe `true`, alte Aufrufe verhalten sich gleich).

## PRÜFUNG UND ERGEBNIS

Alle über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 249 Dateien, **3902 Tests bestanden**, 0 Fehler
- `sicher.sh --json -- npm run typecheck`: **0 Fehler**
- `sicher.sh --json -- npm run lint`: **0 Fehler**
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 27 Dateien, **167 Tests bestanden** (Grundlinie vor dem Paket: 165, dazu 2 neue)
- `sicher.sh --json -- npm run build`: **erfolgreich**. Die Route `● /artikel/kategorie/[slug]` ist gebaut; im Startbestand ohne vorab erzeugte Pfade, weil es keine Artikel gibt.

Kein Server gestartet, kein git.

## BELEGE

- Zahl gleich Liste: `kategorie-weg.test.ts` › „Artikel je Kategorie“ (`anzahlJeKategorie(...).get(id) === artikelDerKategorie(...).length`, auch mit dem Startbestand)
- Keine Gehäuseteile in `/artikel`: `artikel/page.test.tsx` › „zeigt nur Artikel ihrer Kategorie …“ und „nur Gehäuseteile: Leerzustand …, keine Suchmaschinen“
- Neue Route: `artikel/kategorie/[slug]/page.test.tsx` (Filter, Brotkrumen über `/shop`, Unterkategorie verlinkt, noindex ohne Artikel und mit nur Beispielen, Anfrage mit Namen, Weiterleitungen, 404 bei fremder Art)
- Weg einer weiteren Kategorie: `kategorie-weg.test.ts` › „der Weg einer weiteren Artikel-Kategorie …“
- Pflichtangaben: `shop-sammlungen.test.ts` › „verlangt Hersteller und Codebereich …“; `shop-grundlage.db.test.ts` › „verlangt Hersteller und Codebereich beim Veröffentlichen …“ und „ein schon veröffentlichtes Produkt ohne Codebereich bleibt lesbar, speichern geht erst mit der Angabe“
- Import: `sortiment-import.test.ts` › „übernimmt die freiwilligen Spalten …“, „kommt ohne die freiwilligen Spalten aus“, „die Vorlage nennt die freiwilligen Spalten“

## OFFENE FRAGEN

- OFFENE FRAGE (Seed-Abgleich): Ein schon veröffentlichtes echtes Codeprodukt ohne Hersteller oder Codebereich lässt sich nicht mehr speichern. Das gilt auch für den Abgleich im Seed (`npm run seed`), der Texte unveränderter Felder nachzieht. Der Seed meldet so einen Eintrag als übersprungen. Heute gibt es keine solchen Einträge: Alle Musterlinien sind Beispiele, und der Import legt nur Entwürfe an. Soll der Abgleich solche Einträge ausdrücklich melden, oder reicht die Meldung des Seeds?
- OFFENE FRAGE (Artikel in fremder Kategorie): Ein Standardartikel ohne Fahrzeugangaben, dessen Kategorie keine Artikel-Kategorie ist (etwa „Autoschlüsselgehäuse“), erscheint in keiner Artikelliste mehr. Vorher stand er unter `/artikel`. Das folgt der Vorgabe „nur, was in ihre Kategorie gehört“ und steht in der Anleitung. Soll das Backend solche Zuordnungen beim Speichern ablehnen? Das wäre eine Prüfung außerhalb dieses Pakets.
- OFFENE FRAGE (keine sichtbare Artikel-Kategorie): Blendet der Betreiber „Schließtechnik und Zubehör“ aus, zeigt `/artikel` nur noch Artikel ohne Kategorie. Ist das so gewollt?
- Gewünschter Dateneintrag (nicht umgesetzt, `content/kategorien.json` nur gelesen): keiner nötig. Eine spätere Kategorie „Weitere Sicherheitstechnik“ mit Artikeln braucht die Art „artikel“ und als Ziel leer oder `/artikel`. Heute hat sie die Art „anfrage“ und das Ziel `/sicherheitstechnik`.

## FÜR MENSCHEN

- Inhaber oder Team: ältere veröffentlichte Codeprodukte ohne Hersteller oder Codebereich vor der nächsten Änderung ergänzen (heute gibt es keine; Anleitung Abschnitt 1).
- Inhaber: Bei Bedarf Schlüsseltyp und Einsatzbereich in der Sortimentstabelle angeben. Die Spalten sind freiwillig.
- Inhaber: Entscheidung zu den offenen Fragen oben (Kategorie für Standardartikel, Verhalten ohne sichtbare Artikel-Kategorie).

## NACHBESSERUNG

Neun Befunde zweier Gegenprüfer, jeder am Code geprüft. Alle treffen zu.

1. **[rot] „Alle Artikel“ auf der Seite eines Artikels: behoben.** Neue Hilfe `artikelUebersicht(kategorien, artikel, teilePfad)` in `src/lib/data/shop.ts` bestimmt die Liste, in der der Artikel steht: Fahrzeugteil → `TEILE_PFAD` „Alle Gehäuse und Ersatzteile“ (kein zweiter Link auf `/artikel` mehr); Artikel in einer Artikel-Kategorie → Liste der Kategorie des Artikels, „Mehr aus <Name>“; ohne Kategorie → `/artikel` „Zur Artikelliste“; in keiner Artikelliste (fremde Kategorie) → `/shop` „Alle Shop-Kategorien“, damit kein Fehlweg bleibt. Die Brotkrumen ohne Kategorie-Kette gehen jetzt ebenfalls über den Shop und heißen wie `/artikel` selbst (Befund 4); ein Artikel in fremder Kategorie bekommt keine Brotkrume `/artikel` mehr.
2. **[rot] Übersicht im Hinweis ohne Kauf: behoben.** `VerfuegbarkeitHinweis` bekommt dieselbe `uebersicht` wie Befund 1.
3. **[gelb] Knopf „Weitere Artikel“: behoben.** `ArtikelKauf` hat die Prop `weiterePfad` (Vorgabe `/artikel`); `page.tsx` übergibt `uebersicht.href`.
4. **[gelb] Name von `/artikel`: behoben.** Brotkrume, BreadcrumbList und Standardüberschrift nehmen `erste?.name`, `TITEL` nur als Rückfall; eine gepflegte `headline` bleibt vorrangig. Der Seitentitel (`seo.title || TITEL`) bleibt unverändert, weil der Befund ihn nicht nennt und die Suchtextlängen geprüft sind. Test in `artikel/page.test.tsx`.
5. **[gelb] Platzhalter beim System: behoben in der Anleitung.** `systemPruefen` nimmt „[System]“ tatsächlich an. Die Anleitung sagt jetzt, dass Platzhalter nur bei Hersteller und Codebereich nicht zählen und der Betreiber einen Platzhalter beim System selbst ersetzt. `systemPruefen` umzustellen liegt außerhalb der Schreibrechte (Produkte.ts nur Prüfung aus Punkt 2); siehe OFFENE FRAGE unten.
6. **[gelb] Sitemap-Tests: behoben.** Neuer Fall in `src/app/sitemap.test.ts`: (a) nur echtes Fahrzeugteil → kein `/artikel`; (b) echter Artikel in einer Unterkategorie von „Schließtechnik und Zubehör“ → `/artikel/kategorie/test-beschlaege` und `/artikel`; (c) nur Beispiel oder `seo.noindex` der Kategorie → nicht in der Sitemap.
7. **[gelb] Datenbanktest „nicht beim Beispiel“: behoben.** `shop-grundlage.db.test.ts` legt jetzt ein veröffentlichtes Codeprodukt mit `beispiel: true` ohne `herstellerAuswahl`, `hersteller` und `codebereich` an und erwartet `_status: 'published'`.
8. **[gelb] Verweis auf gelöschte Kategorie: behoben.** `artikelDerKategorie` behandelt eine leere Kette wie keine Kategorie; der Artikel steht wieder unter `/artikel` und zählt dort im Shop. Test in `kategorie-weg.test.ts` (Liste und Zahl gleich), dazu Tests für `artikelUebersicht`. Anleitung Abschnitt 2 nennt das.
9. **[gelb] `src/payload-types.ts`: zutreffend, im Bericht nachgetragen.** Erzeugt aus den neuen Feldbeschreibungen in `Produkte.ts`, nur zwei Beschreibungen, kein Schema. Die Datei liegt inzwischen im Zwischenstand-Commit 52e07c4 mit der Kennung FA-SHOP-05 und ist im Arbeitsbaum unverändert.

Geändert in der Nachbesserung: `src/lib/data/shop.ts`, `src/app/(site)/artikel/[slug]/page.tsx`, `src/app/(site)/artikel/[slug]/artikel-kauf.tsx`, `src/app/(site)/artikel/page.tsx`, `src/app/(site)/artikel/page.test.tsx`, `src/app/(site)/shop/kategorie-weg.test.ts`, `src/app/sitemap.test.ts`, `src/payload/shop-grundlage.db.test.ts`, `docs/betrieb/shop-pflegen.md`, dieser Bericht.

Gemeinsame Datei (Nachtrag): `src/payload-types.ts`, erzeugt, nur Beschreibungen, kein Schema.

Prüfung nach der Nachbesserung, alle über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 249 Dateien, **3909 Tests bestanden** (vorher 3902, dazu 7 neue), 0 Fehler
- `sicher.sh --json -- npm run typecheck`: **0 Fehler**
- `sicher.sh --json -- npm run lint`: **0 Fehler**
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 27 Dateien, **167 Tests bestanden** (Beispielfall im bestehenden Test ergänzt)
- `sicher.sh --json -- npm run build`: **erfolgreich**, Routen `/artikel`, `/artikel/[slug]`, `/artikel/kategorie/[slug]` gebaut

Neue OFFENE FRAGE: Soll `systemPruefen` wie Hersteller und Codebereich Platzhalter in eckigen Klammern ablehnen (Freigabe außerhalb dieses Pakets)?


## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-SHOP-05`, beide Pakete der Welle gemeinsam im Arbeitsbaum, nach allen Eingriffen): Typprüfung grün, Lint grün, Unit 3909 von 3909, Datenbanktests 167 von 167, Build 181 von 181 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 137 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Sichtprobe mit drei erfundenen Testartikeln (G4; nur lokal in einer Entwicklungsinstanz auf eigenem Port, Datei danach gelöscht, nichts davon im Repo): 11 von 11.
- `/artikel` zeigt den Artikel der Kategorie „Schließtechnik und Zubehör“ und den Artikel ohne Kategorie, das Fahrzeugteil nicht mehr; Überschrift und Brotkrume nennen die Kategorie.
- `/shop`: „Schließtechnik und Zubehör“ zählt zwei Artikel und führt zur Liste; „Autoschlüsselgehäuse“ zählt das eine Teil. Zahl und Liste stimmen überein.
- Artikelseite: Brotkrume mit Kategorie, Verweis „Mehr aus Schließtechnik und Zubehör“, kein „Alle Artikel“ mehr. Fahrzeugteil: nur der Verweis auf die Liste der Gehäuse. Artikel ohne Kategorie: „Zur Artikelliste“.
- Die Adresse der ersten Kategorie leitet auf `/artikel`; eine unbekannte Kategorie gibt 404.
- Nicht im Browser geprüft: die Liste einer weiteren Artikel-Kategorie oder Unterkategorie (es gibt in den Daten keine); das deckt `artikel/kategorie/[slug]/page.test.tsx`. Die Pflichtangaben im Admin decken die Datenbanktests.

Entschieden bei der Abnahme:
- Gehäuse und Ersatzteile stehen nicht mehr in der allgemeinen Artikelliste, sondern nur in ihrer eigenen Liste. Die Arbeitsanweisung führt „Autoschlüsselgehäuse“ und „Schließtechnik und Zubehör“ als getrennte Hauptkategorien; die Frage 10 in MA-53 ist damit beantwortet (A-067).
- Platzhalter in eckigen Klammern beim Feld System bleiben, wie sie sind (offene Frage des Pakets); die Pflicht für System stammt aus FA-SHOP-01.
- Der Seitentitel von `/artikel` bleibt, bis die Schlussredaktion die Titel bestätigt (MA-44).

=== ENDE FA-SHOP-05 · BEREIT ZUR RÜCKGABE ===
