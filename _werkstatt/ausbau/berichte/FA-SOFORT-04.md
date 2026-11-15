# FA-SOFORT-04 · Bericht · Demo-Daten raus aus dem Live-Auftritt

Entscheidung A-046 · Anforderungen FA-10-02, FA-11-02, FA-11-17, FA-28 „Sofort“ · Stand 15.11.2026

## GEÄNDERTE DATEIEN

Neu:
- `src/lib/beispiele.ts` mit `beispieleSichtbar()`, `istBeispiel()`, `ohneBeispiele()`, `oeffentlicheEintraege()`; Test `src/lib/beispiele.test.ts`
- `src/lib/wege/code-anfrage.ts` (Pfad, Vorbelegung, Serverprüfung der Code-Anfrage); Test `src/lib/wege/code-anfrage.test.ts`
- `src/lib/data/beispiele-oeffentlich.test.ts` (echte Datenschicht im Dateimodus, ohne die Variable)

Geändert:
- `content/code-lines.json` (nur `"example": true` bei allen 52 Linien, nach `"active"`)
- `src/lib/data/defaults/code-lines.ts` (Generator setzt `example: true`, Kopfkommentar)
- `src/lib/data/index.ts` (`getCollection` filtert Codelinien und Standardartikel)
- `src/lib/actions/records.ts` (Serverprüfung der Code-Anfrage, 9 Zeilen)
- `src/lib/livegang-pruefung.ts` (`beispielFunde`, `musterKennungen`), `src/scripts/livegang-pruefen.ts`
- `src/app/(site)/schluessel-nach-code/page.tsx` (Leerzustand, Code anfragen), `src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx` (Weg in die Anfrage bei unpassendem Code)
- `src/app/(site)/service-und-termin/anfrage/page.tsx` und `anfrage-formular.tsx` (nur Thema Code)
- `src/app/(site)/artikel/page.tsx` (Leerzustand mit Verweis auf Beratung)
- `src/app/(site)/page.tsx` (nur Abschnitt „Bestellen ohne Termin“ und der dafür nötige Datenabruf)
- `src/app/llms.txt/route.ts`
- `src/payload/seed.ts` (Kopfkommentar, zwei `inhalt`-Zeilen), `src/payload/collections/Produkte.ts` (nur Beschreibung von `beispiel`), `src/payload-types.ts` (dieselbe Beschreibung im erzeugten Kommentar, damit die Typen zur Sammlung passen)
- `vitest.config.ts`, `vitest.db.config.ts` (`env: { SM24_BEISPIELE: '1' }`)
- Tests: `src/app/sitemap.test.ts`, `src/lib/codelinie.test.ts`, `src/lib/actions/security.test.ts`, `src/lib/livegang-pruefung.test.ts`, `src/lib/data/payload.db.test.ts`, `src/payload/seed.db.test.ts`, `src/payload/leitfaden.db.test.ts`

Nicht angefasst: `content/rubriken.json`, `content/seo.json`, `src/lib/navigation.ts`, `src/app/sitemap.ts` (dessen Änderung im Arbeitsbaum stammt aus einem anderen Paket), alles unter `schluessel-nach-vorlage` und `schluessel-einschicken`, `src/components/**` (Kopf, Fuß, Nachbestellen).

Hinweis für den Commit: `src/payload/seed.ts` enthielt schon zwei Zeilen von FA-SOFORT-03 (`umbenannt` bei den Rubriken). Meine Änderungen liegen an anderen Stellen derselben Datei.

## WAS UND WARUM

1. Kennzeichnen statt löschen. Alle 52 Codelinien in `content/code-lines.json` und im Generator tragen `example: true`. Die Musterdaten bleiben für Tests und lokale Entwicklung im Repository.
2. Eine Regel an einer Stelle. `getCollection` in `src/lib/data/index.ts` gibt `codeLines` und `standardArticles` nur ohne Beispiele heraus, außer `SM24_BEISPIELE` ist genau `1`. Alle Lesestellen gehen darüber: `getCodeLines`, `getCodeLine`, `shopDaten`, Produkt-, Kategorie- und Herstellerseiten samt `generateStaticParams`, `/artikel` und `/artikel/[slug]`, Sitemap, Warenkorb, Kasse, `submitOrder`, Nachbestellen-Abschnitt auf Schließanlagen und Zylindern, Startseite, llms.txt. Detailseiten von Beispielen finden nichts und rufen `notFound()` (404). Strukturdaten entstehen nur auf Detailseiten, also nie für Beispiele (R8). Ein alter Warenkorb mit Beispiel-Linie meldet „nicht mehr verfügbar“. Die Regel wird bei jedem Aufruf ausgewertet, nicht beim Laden des Moduls.
3. Tests. Beide Vitest-Konfigurationen setzen `SM24_BEISPIELE=1`. Datenweiche und Build setzen die Variable nicht. Neue Tests ohne Variable belegen: keine Beispiel-Linie in Listen (auch inaktive), keine Standardartikel, 404 auf Produkt-, Kategorie- und Artikel-Detailseite, leere `generateStaticParams`, nichts unter `/schluessel-nach-code/…` und `/artikel` in der Sitemap, nicht bestellbar über `submitOrder`. Dazu: nicht im Seed (DB-Test).
4. Seed. `inhalteUebernehmen` reicht Codelinien und Standardartikel durch `ohneBeispiele`, unabhängig von der Variable. Vorhandene Einträge einer Datenbank bleiben unberührt: kein Löschen, und weil sie nicht mehr im Inhalt stehen, auch kein Startwert-Abgleich. Die DB-Tests, die bisher auf geseedete Musterdaten bauten, legen ihre Daten jetzt selbst an (ZY-02 in `leitfaden.db.test.ts`) oder prüfen das Gegenteil (`payload.db.test.ts`: keine Beispiele in der Datenbank). Keine Prüfung wurde gelockert: Die alte Prüfung „52 Linien, erste ist ms-01“ wird zur Prüfung „keine Beispiel-Linie, kein ms-01“, die Prüfung „8 Beispielartikel“ zu „kein Produkt mit Haken Beispiel, auch nicht im Papierkorb“. Neu in `seed.db.test.ts`: Beispiel-Linie und Beispielartikel werden trotz `SM24_BEISPIELE=1` nicht angelegt, echte schon; keine Kennung der Musterdaten in der Datenbank; ein vorhandener Beispiel-Eintrag behält Namen und Haken und bleibt außerhalb des Papierkorbs.
5. Leerer Zustand `/schluessel-nach-code`. Ohne echte Produkte: Kopf mit „Code anfragen“ statt „Nach Code bestellen“, Lead ohne Bestellversprechen. Abschnitt 01 sagt: „Die Codeprodukte werden gerade eingepflegt. Bis dahin prüfen wir Ihren Code auf Anfrage.“ Dazu, was wir brauchen, und der Knopf „Code anfragen“. Kein Datum, keine Zusage. Die Fundstelle des Codes (Kopfgrafik, Ratgeber-Link) und der Ablauf aus den Rubrikdaten bleiben. Der Anker `#codelinien` bleibt, damit Navigation und Nachbestellen-Knopf nicht ins Leere führen. Die Kategorien-Liste entfällt ohne Linien; die Nummern rücken nach (01, 02, 03).
6. Code anfragen (FA-11-17), dauerhaft. Weg über die vorhandene allgemeine Anfrage mit `?thema=schluessel-nach-code`. Für dieses Thema fragt Schritt 2 nach Hersteller oder Schloss, Code wie aufgedruckt, Stückzahl (1 bis 99), freiwilliger Ergänzung und der Berechtigung (R13, Wortlaut nach dem Muster des Autoschlüssel-Assistenten). Schritt 3 nimmt freiwillig ein Foto von Schlüssel oder Schloss (Kategorie `schluesselfoto`). Seitentitel „Code anfragen“. `?code=` und `?schloss=` belegen nur vor, gefiltert und gekürzt. Der Server (`records.ts`) nimmt eine Anfrage im Bereich `schluessel-nach-code` nur mit allen Pflichtangaben und `berechtigt: true` an und schreibt die geprüften Werte samt `quelle: 'code-anfrage'` in den Vorgang. Mit echten Produkten steht unter der Produktliste „Ihr Code passt zu keiner Linie? Code anfragen“. Auf der Produktseite nennt die Fehlermeldung bei unpassendem Code die Anfrage, darunter steht der Link „Code anfragen“, vorbelegt mit Code und Linie.
7. `/artikel`. Der Leerzustand verweist nicht mehr auf „Schlüssel nach Code bestellen“, sondern auf Beratung (`/beratung`) und Anfrage. Kopf, Fuß, Startseite und Navigation hatten schon keinen Verweis auf `/artikel` (geprüft); die Sitemap führt `/artikel` nur mit echten Artikeln, die Seite ist dann `noindex`. Startseite „Bestellen ohne Termin“: Die Karte „Schlüssel nach Code“ heißt ohne Produkte „Auf Anfrage“ statt „Direkt kaufen“ und verspricht keine Bestellung.
8. Admin. Beschreibung des Feldes `beispiel`: „Beispiel: erscheint nicht auf der Seite. Nicht in Listen, Suche und Sitemap, nicht bestellbar. Für echte Artikel den Haken entfernen.“ Kein neues Feld, keine Migration.
9. Livegang-Prüfung. Sie erwartet weder Seitenzahlen noch Codelinien (geprüft in `src/scripts/livegang-pruefen.ts`, `src/lib/livegang-pruefung.ts`, `scripts/build.mjs`). Neu: `beispielFunde` meldet `SM24_BEISPIELE=1` und jedes veröffentlichte Produkt, dessen Kennung zu den Musterdaten gehört, aber keinen Beispiel-Haken trägt (etwa aus einer Datenbank aus der Zeit vor A-046). Mit Datenbank liest sie veröffentlichte Produkte, ohne Datenbank `content/code-lines.json` und die Standardartikel.
10. llms.txt. Ohne echte Codeprodukte lautet die Zeile zu „Schlüssel nach Code“: „Code nennen, wir prüfen ihn auf Anfrage. Ohne Einsendung des Originals.“

## PRÜFUNG UND ERGEBNIS

Alle Befehle über die Datenweiche.
- `sicher.sh --json -- npx vitest run`: 182 Dateien, 2326 Tests, alle grün (vorher im selben Arbeitsbaum 174 Dateien und 2271 Tests; die übrigen neuen Dateien stammen aus parallelen Paketen).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts` im Arbeitsbaum: bricht im globalen Setup ab, bevor ein Test läuft. Ursache ist die fremde Migration `src/migrations/20261115_120000_rubrik_nach_vorlage.ts` (FA-SOFORT-03): `UPDATE "_rubriken_v" … AND "latest" = true` scheitert mit `column "latest" does not exist`. Nicht behoben, weil es nicht meine Datei ist.
- Deshalb DB-Tests zusätzlich in einer Kopie des Arbeitsbaums (meine Änderungen, ohne diese eine Migration und ohne ihren Eintrag in `src/migrations/index.ts`), dort über `sicher.sh --pg`: 16 Dateien, 99 Tests, alle grün, darunter die neuen und angepassten Seed-Tests. Die Kopie ist wieder gelöscht.
- `sicher.sh --json -- npm run build`: grün, 166 statische Seiten (vorher 232).
- `npm run pruefen:livegang` (Datenweiche, JSON): „keine Platzhalter und keine veröffentlichten Beispiele gefunden“. Mit `SM24_BEISPIELE=1` meldet sie einen Fund `Umgebung › SM24_BEISPIELE`.

Seitenzahl, Differenz erklärt: Derselbe Arbeitsbaum, einmal mit `SM24_BEISPIELE=1` gebaut, ergibt 236 Seiten, ohne die Variable 166. Die Differenz von 70 sind genau die Beispiel-Seiten: 52 Codelinien, 10 Kategorien und 8 Beispielartikel. Von 232 auf 236 kamen 4 Seiten aus einem parallelen Paket dazu: die neuen Seiten unter `src/app/(site)/partner-werden/` (`auftraege-erhalten`, `kfz-betriebe`, `kooperation`, `netzwerk-deutschland`). Danach habe ich ohne Variable neu gebaut, damit `.next` keine Beispiele enthält.

Zahlen: Unit 2326 grün · DB 99 grün in der Kopie, im Arbeitsbaum durch die fremde Migration blockiert · Build 166 Seiten.

## BELEGE

- Regel: `src/lib/beispiele.ts`; Filter: `getCollection` in `src/lib/data/index.ts`
- Ohne Variable, über die echte Datenschicht: `src/lib/data/beispiele-oeffentlich.test.ts` (Listen leer, Sitemap ohne Produkt-, Kategorie- und Artikelseiten, `submitOrder` lehnt ab, 404 und leere `generateStaticParams` für `/schluessel-nach-code/[slug]`, `/kategorie/[familie]` und `/artikel/[slug]`)
- Seed: `src/payload/seed.ts` (`ohneBeispiele` bei `codelinien` und `beispielartikel`), Test `src/payload/seed.db.test.ts` › „Beispiel-Einträge (A-046)“
- Kasse: `src/lib/actions/security.test.ts` › „lehnt Beispiel-Codelinien ab …“; Code-Anfrage auf dem Server: › „submitRecord: Code anfragen“
- Livegang: `src/lib/livegang-pruefung.test.ts` › „beispielFunde (A-046)“
- Musterdaten vollständig markiert: 52 von 52 in `content/code-lines.json` (Test in `beispiele-oeffentlich.test.ts`)

## OFFENE FRAGEN

1. Fremde Migration blockiert die DB-Tests: `20261115_120000_rubrik_nach_vorlage.ts` (FA-SOFORT-03) fragt `"latest"` in `_rubriken_v` ab, die Spalte gibt es nicht. Bis zur Behebung läuft keine DB-Testsuite und kein Build mit Datenbank.
2. Bestehende Datenbank: Hat eine produktive oder Vorschau-Datenbank die 52 Linien oder die Beispielartikel aus der Zeit vor A-046 ohne Haken „Beispiel“, erscheinen sie dort weiter als echte Produkte. Der Seed fasst sie bewusst nicht an. Die Livegang-Prüfung meldet sie jetzt (`Produkte › <kennung>`). Soll der Haken per Datenmigration gesetzt werden? Das wäre eine Datenänderung und braucht eine Entscheidung.
3. Texte außerhalb meiner Schreibrechte, die ohne Produkte noch eine Bestellung versprechen:
   - `src/lib/navigation.ts`, Bereich „Nach Code“: „Nach Code bestellen“, „Codelinie suchen, Code eingeben, bestellen“, „Codelinien durchsuchen“ und die Zusammenfassung „Code eingeben und direkt bestellen“ (erscheint auch in der Themenwahl der Anfrage). Die Ziele sind erreichbar, nur der Wortlaut passt nicht.
   - Startseite, Kopfbereich: Link „Schlüssel nach Code bestellen“ (außerhalb des Abschnitts „Bestellen ohne Termin“).
   - `content/seo.json`: Startseite „… liefern Schlüssel nach Code in ganz Deutschland“ und Beschreibung „Code-Schlüssel bundesweit per Versand“; `/schluessel-nach-code` Subline „Code eingeben, bestellen, fertig.“ (im Leerzustand im Code überschrieben) und Meta-Beschreibung „… nach Code für Möbel, Briefkasten, Spind, Technikschrank …“.
   - `src/components/schliessung/nachbestellen.tsx`: „bestellen Sie weitere Schlüssel direkt nach Code“. Ohne Linie führt der Knopf auf den Leerzustand, dort weiter zu „Code anfragen“.
   - `/artikel`, Weiterlesen-Liste: „Schlüssel nach Code bestellen“ (die Seite ist ohne Artikel nicht verlinkt und `noindex`).
4. Rubrikdaten „schluessel-nach-code“ (`content/rubriken.json`, nicht meine Datei): Der Ablauf beschreibt die Direktbestellung mit Warenkorb. Er bleibt als Erklärung der Leistung stehen. Soll er ohne Produkte einen Anfrageschritt zeigen?
5. Wortlaut der Berechtigung in der Code-Anfrage: „Ich bin berechtigt, für dieses Schloss Schlüssel anfertigen zu lassen.“ mit dem Zusatz „Bei geschützten Profilen fragen wir nach einem Nachweis, etwa der Sicherungskarte.“ Er folgt dem Muster des Autoschlüssel-Assistenten. Rechtliche Prüfung (R10) steht aus.
6. Höchste Stückzahl je Code-Anfrage ist 99, als Eingabegrenze wie beim Stückzahlfeld. Eine fachliche Grenze hat der Inhaber nicht genannt.

## NACHBESSERUNG (Gegenprüfung, 15 Befunde)

Geändert in der Nachbesserung: `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx`, `src/app/(site)/service-und-termin/anfrage/page.tsx`, `src/app/(site)/schluessel-nach-code/page.tsx`, `src/app/(site)/page.tsx` (nur Karte im Abschnitt „Bestellen ohne Termin“), `src/app/(site)/artikel/page.tsx`, `src/lib/wege/code-anfrage.ts`, `src/lib/actions/records.ts`; Tests `src/lib/wege/code-anfrage.test.ts`, `src/lib/actions/security.test.ts`, `src/lib/data/beispiele-oeffentlich.test.ts`.

1. [rot] Upload-Kategorie der Code-Anfrage: behoben. Neue Funktion `codeAnfrageUploadKategorie(thema)` in `code-anfrage.ts` liefert für das Thema Code `schluesselfoto`, sonst `dokument`. Das Upload-Feld (`category`) und `alsUpload` nutzen denselben Wert, die gespeicherte Datei bekommt also schon beim Hochladen die Frist `keyPhotos`. Test in `code-anfrage.test.ts` („lädt Fotos der Code-Anfrage als Schlüsselfoto hoch …“). Einen Render-Test des ganzen Formulars gibt es nicht; das Feld liest die Kategorie aus dieser einen Funktion.
2. [rot] Titel, Beschreibung und JSON-LD von `/schluessel-nach-code` im Leerzustand: behoben. `generateMetadata` liest `getCodeLines()`. Ohne Produkte lauten Titel „Schlüssel nach Code anfragen“ und Beschreibung „Nennen Sie uns Ihren Schlüsselcode. Wir prüfen ihn und melden uns. Ohne Einsendung des Originals.“. Dieselbe Beschreibung geht an `pageGraphSchema`. `content/seo.json` unberührt. Test in `beispiele-oeffentlich.test.ts`; im Build geprüft: `<title>`, `meta description` und JSON-LD der Seite tragen den neuen Text, „Möbel, Briefkasten“ kommt nicht mehr vor.
3. [rot] Startseite, Kopfbereich „Schlüssel nach Code bestellen“: zutreffend, NICHT behoben. Die Stelle liegt außerhalb des Abschnitts „Bestellen ohne Termin“ und damit außerhalb meiner Schreibrechte. Braucht Freigabe oder Folgepaket. Vorschlag bleibt: Linktext an `codeProdukte` binden (ohne Produkte „Schlüssel nach Code anfragen“), eine Zeile in `src/app/(site)/page.tsx` um Zeile 195.
4. [rot] Navigation „Nach Code“: zum Teil behoben. In der Themenwahl der Anfrage steht für „Schlüssel nach Code“ jetzt ein eigener Text, der mit und ohne Produkte stimmt: „Code nennen, wir prüfen ihn und melden uns. Ohne Einsendung des Originals.“ (`CODE_ANFRAGE_THEMENTEXT`, gesetzt in `anfrage/page.tsx`). Der Wortlaut in `src/lib/navigation.ts` (summary, highlight, Spalte) ist zutreffend bemängelt, liegt aber außerhalb meiner Schreibrechte und wird gerade von einem anderen Paket bearbeitet. Braucht Freigabe oder Folgepaket.
5. [rot] Nachbestellen mit Sicherungskarte: zum Teil behoben. Die Code-Anfrage bietet in Schritt 3 jetzt freiwillig ein eigenes Feld „Foto Ihrer Sicherungskarte“ mit der Kategorie `sicherungskarte` (bis 2 Dateien; Hinweis: Schlüssel mit geschütztem Profil fertigen wir nur gegen die Karte). Damit gibt es im Ersatzweg den Nachweis, den die Rubrik verlangt. Nicht behoben: Text und Ziel in `src/components/schliessung/nachbestellen.tsx` („direkt nach Code“, Knopf auf den Leerzustand). Die Komponente liegt außerhalb meiner Schreibrechte; Vorschlag des Prüfers bleibt (ohne `linie` direkt auf `codeAnfragePfad({ schloss: 'Schließanlage mit Sicherungskarte' })`, Lead ehrlich fassen). Braucht Freigabe.
6. [gelb] Ablauf im Leerzustand: behoben. Über dem Ablauf steht ohne Produkte: „Sobald die Codeprodukte eingepflegt sind, läuft die Bestellung so. Bis dahin beginnt alles mit Ihrer Anfrage.“ (`lead` von `RubrikAblaufAbschnitt`). Offene Frage 4 (Rubrikdaten) bleibt für den Inhaber.
7. [gelb] Karte der Startseite: behoben. Text ohne Produkte jetzt „Code nennen, wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.“
8. [gelb] Seitenkopf und Formular der Anfrage: behoben, zusammen mit 13. Wird die Seite mit `?thema=schluessel-nach-code` geöffnet, steht das Thema fest (`themaFest`): Schritt 1 zeigt nur „Schlüssel nach Code“ und den Link „Zur allgemeinen Anfrage“; ein gespeicherter Stand aus der allgemeinen Anfrage wird auf das Code-Thema gesetzt. Kopf und Formular heißen dann beide „Code anfragen“. Ohne den Parameter heißen Kopf und Formular beide „Allgemeine Anfrage“, auch wenn in Schritt 1 das Thema Code gewählt wird; die Code-Felder erscheinen trotzdem. Den Kopf der allgemeinen Anfrage habe ich nicht neutral umbenannt, weil mein Schreibrecht dort nur das Thema Code deckt.
9. [gelb] `content/seo.json`, Subline der Startseite: zutreffend, NICHT behoben. Datei ausdrücklich außerhalb der Schreibrechte. Braucht Folgepaket mit Freigabe.
10. [gelb] `/artikel`, Weiterlesen-Liste: behoben. Linktext jetzt „Schlüssel nach Code“.
11. [gelb] Zusammenfassung der Code-Anfrage vom Browser: behoben. `records.ts` baut nach `codeAnfragePruefen` den Abschnitt „Code“ aus den geprüften Angaben neu (`mitGeprueftemCode`: Schloss, Code, Stückzahl, „Berechtigung bestätigt“) und verwirft einen gleichnamigen Abschnitt aus dem Browser; die übrigen Abschnitte bleiben. Browser und Server nutzen dieselbe Funktion `codeAnfrageAbschnitt`. Tests: `security.test.ts` („baut den Abschnitt „Code“ der Zusammenfassung aus den geprüften Angaben“) und `code-anfrage.test.ts`.
12. [gelb] Code-Felder im payload anderer Themen: behoben. Für alle anderen Themen sendet das Formular `ohneCodeFelder(data)`, also ohne `schloss`, `code`, `stueckzahl`, `berechtigt`. Test in `code-anfrage.test.ts`.
13. [gelb] Wie 8: behoben (Thema fest bei `?thema=schluessel-nach-code`, Formulartitel folgt der Adresse wie der Kopf).
14. [gelb] `src/payload-types.ts` von Hand geändert: zutreffend als Abweichung von den Schreibrechten, inhaltlich bestätigt. `npm run generate:types` über die Datenweiche erzeugt eine Datei, die mit dem Stand im Arbeitsbaum Zeichen für Zeichen übereinstimmt. Die Änderung ist also genau die Folge von `Produkte.ts`. Hinweis an den Orchestrator: im Commit als erzeugte Folge von `Produkte.ts` vermerken.
15. [gelb] `src/app/sitemap.test.ts`: zutreffend, kein Code zu ändern. Der Test „meldet die Hauptseite und die vier Seiten zur Partnergewinnung“ (ab Zeile 125) stammt aus dem Partner-Paket. Zu FA-SOFORT-04 gehören nur die Änderungen im Test „meldet Codelinien, Kategorien und Hersteller“ (Zeilen 76 bis 97: Musterdaten mit `example`, ms-03 als Beispiel, Artikel-Prüfung). Hinweis an den Orchestrator: beim Commit nur diese Hunks aufnehmen.

Prüfung nach der Nachbesserung (alles über die Datenweiche):
- `sicher.sh --json -- npx vitest run`: 182 Dateien, 2341 Tests, alle grün (vorher 2326; 6 neue Tests aus der Nachbesserung, die übrigen aus parallelen Paketen).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler. `… -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts` im Arbeitsbaum: weiter blockiert durch die fremde Migration `20261115_120000_rubrik_nach_vorlage.ts` (`column "latest" does not exist`). In einer Kopie ohne diese Migration (unter /home/ubuntu, danach gelöscht): 16 Dateien, 99 Tests, alle grün. Ein Test-Postgres, das der blockierte Lauf auf Port 5434 hinterlassen hatte, ist gestoppt und gelöscht.
- `sicher.sh --json -- npm run build`: grün, 166 statische Seiten (unverändert gegenüber dem Bericht oben).

Offen für Menschen oder den Orchestrator: Befund 3 (Kopf der Startseite), 4 (Wortlaut in `navigation.ts`), 5 (`nachbestellen.tsx`) und 9 (`seo.json`) brauchen Freigabe oder ein Folgepaket. Wortlaut des neuen Hinweises zur Sicherungskarte in der Code-Anfrage gehört zur rechtlichen Prüfung aus offener Frage 5.

=== ENDE FA-SOFORT-04 · BEREIT ZUR RÜCKGABE ===
