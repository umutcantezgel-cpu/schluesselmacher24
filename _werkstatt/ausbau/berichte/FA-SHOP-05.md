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

=== ENDE FA-SHOP-05 · BEREIT ZUR RÜCKGABE ===
