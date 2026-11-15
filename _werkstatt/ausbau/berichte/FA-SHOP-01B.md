# FA-SHOP-01B · Shop-Grundlage, Teil 2 (Seiten und Import) · Bericht

Stand 15.11.2026. Rolle Baumeister. Kein git außer einem Versehen (siehe OFFENE FRAGEN 1), kein Server, keine Migration.

## GEÄNDERTE DATEIEN

Neu:
- `src/app/(site)/shop/page.tsx`: Übersicht `/shop` (Shop-Einstieg nach Kategorien)
- `src/app/(site)/shop/kategorie-weg.ts` mit `kategorie-weg.test.ts`: Weg je Kategorie, Titel und Beschreibung der Übersicht
- `src/app/(site)/schluessel-nach-code/linien-zeile.tsx`: gemeinsame Zeile der Codelisten (Bild oder Fach-Icon, Codebereich, Lieferzeit, Verfügbarkeit)
- `src/app/(site)/schluessel-nach-code/hersteller-marke.tsx`: Logo nur mit Freigabe, sonst Name
- `src/app/(site)/schluessel-nach-code/shop-seiten.test.tsx`
- `scripts/sortiment-import.mjs` mit `scripts/sortiment-import.test.ts`
- `_werkstatt/ausbau/erhebung/boegen/SORTIMENT-vorlage.csv`

Geändert:
- `src/lib/codelinie.ts`: `nachHerstellerUndSystem`, `herstellerDerLinie`, `herstellerMitSeite`, `codeKategorien`, `codeKategorieAufloesen`, `bestellWeg`; `codeFamilien` und `codeHersteller` (Schlagwort-Familien, Freitext-Hersteller) entfernt
- `src/lib/codelinie-texte.ts`: Texte je Verfügbarkeit, verwandte Linien nach Hersteller und System, System im Herstellertext, Preisspanne nur lieferbarer Linien, Gedankenstriche aus Kundentexten
- `src/lib/artikel.ts`: `artikelAnfragePfad`, `LEISTUNGS_ANFRAGE_PFAD`, `ARTIKEL_ANFRAGE_LAENGE`
- `src/components/seo/json-ld.tsx`: `codelinieSchema` (ein Graph) statt `productSchema`
- `src/app/sitemap.ts`
- `src/app/(site)/schluessel-nach-code/page.tsx`, `shop-daten.ts`, `shop-liste.tsx`, `linien-liste.tsx`, `[slug]/page.tsx`, `hersteller/[hersteller]/page.tsx`
- `src/app/(site)/schluessel-nach-code/kategorie/[kategorie]/page.tsx` (Ordner umbenannt von `[familie]`)
- `src/app/(site)/artikel/page.tsx`, `artikel/artikel-liste.tsx`, `artikel/[slug]/page.tsx`
- `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`, `src/app/(site)/kasse/kasse-formular.tsx` (nur Punkt 5)
- `src/app/(site)/service-und-termin/anfrage/page.tsx` (nur Vorbelegung `artikel`)
- `src/payload/collections/Kategorien.ts`, `Hersteller.ts` (nur Hilfetexte)
- `docs/betrieb/shop-pflegen.md`
- `src/payload/hooks/seiten-adresse-pruefung.ts`: eine Zeile `'shop'` in `VORHANDENE_ROUTEN` (außerhalb der genannten Schreibrechte, siehe OFFENE FRAGEN 2)
- Tests: `src/lib/codelinie.test.ts`, `src/lib/codelinie-texte.test.ts`, `src/lib/data/seo-laengen.test.ts`, `src/lib/data/beispiele-oeffentlich.test.ts`, `src/app/sitemap.test.ts`, `src/components/seo/json-ld.test.ts`

## WAS UND WARUM

1. **Shop-Einstieg nach Kategorien.** Heute endeten die Wege einzeln (`/schluessel-nach-code`, `/artikel`, Konfigurator, Anfragen); eine Stelle mit allen Kategorien und ihrem ehrlichen Zustand gab es nicht. `/shop` hat diesen eigenen Nutzen: die sichtbaren Hauptkategorien aus `getShopKategorien()` in der Reihenfolge des Inhabers, je mit Beschreibung, Zahl der Produkte, Hinweis ohne Produkte und dem passenden Weg (`kategorieWeg`). Verborgene Kategorien (Weitere Sicherheitstechnik) fehlen. Unten der Satz, dass der Termin für Autoschlüssel ein eigener Weg bleibt (Vorgabe Abschnitt 10). Jede Kategorie hat einen Anker mit ihrer Adresse (`/shop#…`).
2. **Liste nach Hersteller und System.** `nachHerstellerUndSystem` gruppiert nach Hersteller (Stammliste vor Freitext, Reihenfolge der Stammliste, dann Namen, Linien ohne Hersteller zuletzt), darunter nach System. Unter einem Hersteller nur seine Linien (Kennung aus der Stammliste, Freitext nur bei genau gleichem Namen, wie `produkteDesHerstellers`). Die Shop-Liste hat Sprungleiste und Überschriften je Hersteller, Unterüberschrift je System, neue Filter „System“; Felder erscheinen nur mit gepflegten Werten. Jede Zeile zeigt Produktbild oder Fach-Icon (kein Platzhalterbild), Codeformat, Codebereich, Preis und Lieferzeit, bei „auf Anfrage“ und „nicht lieferbar“ die Verfügbarkeit statt des Preises.
3. **Hersteller- und Kategorieseiten aus den Daten.** Herstellerseiten nur für Hersteller mit mindestens einer Linie (`herstellerMitSeite`), nach System gegliedert, mit Einsatztext der Stammliste. Kategorieseiten sind die sichtbaren Unterkategorien von „Schlüssel nach Code“ (`codeKategorien`), mit den Linien auch tieferer Ebenen; frühere Adressen leiten dauerhaft weiter (`codeKategorieAufloesen`, `permanentRedirect`). Ohne Produkte zeigt die Kategorieseite den Hinweis und „Code anfragen“ und steht auf noindex. Die Schlagwort-Familien der Musterdaten haben keine eigenen Seiten mehr; sie bleiben als Angabe „Anwendungsfamilie“ und als Filter.
4. **Produktseite.** System, Codebereich und Lieferzeit (nur lieferbar) unter den Angaben; Produktbild im Kopf, wenn ein Foto hinterlegt ist, sonst wie bisher die Zeichnung zum Beispielcode; „Code anfragen“ unter dem Bestellformular und in den Verweisen. Brotkrumen: Schlüssel nach Code › Hersteller (oder Kategorie) › Produkt.
5. **Strukturdaten (4, 4a).** Die Codelinien-Seite trägt einen Graphen statt drei Skripten: Webseite, Brotkrumen, Fragen und nur bei Lieferbarkeit und echtem Preis Produkt mit Angebot (InStock, Verkäufer per Kennung). Bei „auf Anfrage“, „nicht lieferbar“, Beispielen oder Preis 0 kein Produkt, kein Angebot (R8). Hersteller- und Kategorieseiten nutzen `pageGraphSchema` mit Brotkrumen.
6. **Texte je Verfügbarkeit** (`codelinienTexte`): Meta-Beschreibung, Einleitung, Beschreibung, Codeformat-Frage und Preis-Frage je Fassung; „auf Anfrage“ ohne Preis, Stückzahl und Bestellformular, „nicht lieferbar“ ohne Preis-Frage. Längen geprüft für alle 52 Musterlinien in beiden Fassungen.
7. **„Artikel anfragen“ und Kategorien ohne Produkte.** `artikelAnfragePfad` hängt den Namen als `artikel=` an; die Anfrage bereinigt ihn mit `vorbelegungAusAdresse` und belegt damit das Feld „Um welches Objekt oder Fahrzeug geht es?“ vor, der Kopf nennt ihn. Autoschlüssel als Produkte und Customizing führen in die Anfrage mit Thema Autoschlüssel und Anliegen Frage, Gehäuseumbau in die Gehäuse-Anfrage.
8. **Warenkorb und Kasse.** Positionen auf „auf Anfrage“ oder „nicht lieferbar“ tragen im Warenkorb eine ruhige Zeile mit Verfügbarkeit (bei „auf Anfrage“ mit „Code anfragen“ oder „Artikel anfragen“); „Zur Kasse“ ist dann gesperrt wie bei anderen nicht bestellbaren Positionen. Die Unterzeilen der Zylinder in der Kasse beginnen ohne „— “.
9. **Import.** `scripts/sortiment-import.mjs` liest die Tabelle (Semikolon oder Komma), prüft Pflichtfelder, Preisformat, Staffel, Höchstmenge, Prüfmuster mit denselben Regeln wie das Backend, Beispielcode gegen Prüfmuster, Hersteller gegen die Stammliste (sonst Vorschlag für einen neuen Stammeintrag), Kategorie unter „Schlüssel nach Code“ und doppelte Kennungen. Bei einem Fehler bricht es mit Liste ab und schreibt nichts. Sonst schreibt es `content/code-lines.json` ohne `example`; vorhandene Einträge bleiben, gleiche Kennung wird ersetzt, ein Beispiel nie überschrieben. Den Weg in die Datenbank geht der vorhandene Seed (Local API, legt fehlende echte Linien an). Der Aufbau des Codes für Kunden wird nur aus einfachen Prüfmustern gebildet, sonst „Aufbau wie im Beispiel …“.
10. **Sitemap.** `/shop`, Kategorieseiten nur mit mindestens einer indexierbaren Linie und ohne eigenes noindex, Herstellerseiten nur mit indexierbaren Linien. Ohne echte Linien (heute) keine Kategorie- und Herstellerseiten.
11. **Pflege.** Hilfetexte in Kategorien und Hersteller sagen jetzt, was auf der Seite geschieht. Anleitung: neuer Abschnitt 8 „Angebote aus einer Tabelle übernehmen“, die Hinweise auf den „nächsten Ausbau“ ersetzt.

## GEMEINSAME DATEIEN (gewünschte Einträge, nicht umgesetzt)

Navigation (`src/lib/navigation.ts`, Kopf und Fuß):
- Hauptnavigation, neuer Eintrag: Label „Shop“, href `/shop`.
- Darunter (Menü „Shop“) die acht sichtbaren Hauptkategorien aus `getShopKategorien()` in deren Reihenfolge, Label = `name`, href = `kategorieWeg(kategorie, anzahl).href` aus `src/app/(site)/shop/kategorie-weg.ts`: Schlüssel nach Code, Schlüssel nach Vorlage, Autoschlüssel als Produkte, Autoschlüsselgehäuse, Gehäuseumbau und Reparaturservice, Customizing und Modifikation, Gleichschließende Zylinder und Sperrschließungen, Schließtechnik und Zubehör.
- Fuß, Spalte Shop: „Alle Shop-Kategorien“ → `/shop`.

Startseite (`src/app/(site)/page.tsx`), Abschnitt „Bestellen ohne Termin“:
- Kacheln aus `getShopKategorien()` (Hauptkategorien) statt fester Liste; je Kachel `name`, `beschreibung`, bei fehlenden Produkten `kategorieWeg(...).hinweis`, Ziel `kategorieWeg(...).href`.
- Verweis unter den Kacheln: „Alle Kategorien im Shop“ → `/shop`.

Weitere Dateien außerhalb meiner Rechte:
- `src/payload/collections/Produkte.ts`: Hilfetexte bei System, Codebereich und Lieferzeit sagen noch „Erscheint mit dem nächsten Ausbau der Shopseiten“; neu: „Erscheint in der Liste und auf der Seite des Produkts.“
- `src/payload-types.ts`: nach den Hilfetexten `payload generate:types` (nur Kommentare).

## PRÜFUNG UND ERGEBNIS

Alle Befehle über die Datenweiche, nach der letzten Änderung:
- `sicher.sh --json -- npx vitest run`: 217 Dateien, 3420 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 22 Dateien, 128 Tests, alle grün.
- `sicher.sh --json -- npm run build`: grün, 178 statische Seiten (vorher 177; neu `/shop`).

Zwischendurch fielen Build und Lint einmal an fremden Dateien im gemeinsamen Arbeitsbaum (`src/components/flow/flow-shell.tsx`, eine Datei mit `<a href="/service-und-termin/anfrage/">`); beim nächsten Lauf waren sie grün. Nicht von diesem Paket.

## BELEGE

- Liste gruppiert nach Hersteller und System: `src/lib/codelinie.test.ts` › „Liste nach Hersteller und System“ (Reihenfolge, Systeme, nur eigene Produkte); `shop-seiten.test.tsx` › „Shop-Liste nach Hersteller und System“ (gerendert, Reihenfolge der Stammliste, Codebereich, Lieferzeit).
- Hersteller ohne Produkte hat keine Seite: `codelinie.test.ts` › „ein Hersteller ohne Produkte hat keine Seite“; `sitemap.test.ts` › „… ohne leere Seiten“ (Hersteller, dessen einzige Linie ein Beispiel ist, und leere Kategorie fehlen).
- „Nicht lieferbar“ ohne Warenkorb: `codelinie.test.ts` › „Bestellweg nach Verfügbarkeit“; `shop-seiten.test.tsx` › „Bestellknöpfe der Codesuche“ (ein „Nach Code bestellen“, ein „Code anfragen“, keiner für nicht lieferbar) und „zeigt … die Verfügbarkeit statt eines Preises“.
- Kein Offer ohne Preis: `json-ld.test.ts` › „Codelinie: kein Offer ohne echten Preis und kein Angebot bei „auf Anfrage“ …“; ein Graph ohne doppelte Kennung: „Codelinie: Produkt, Brotkrumen und Fragen in einem Graphen …“.
- Import lehnt ab und schreibt nichts: `scripts/sortiment-import.test.ts` › „ohne Pflichtfeld“, „falsches Preisformat“, „Prüfmuster … nicht zum Beispielcode“, „schreibt bei einer fehlerhaften Zeile nichts in die Zieldatei“ (Lauf über eine Kopie).
- Logo nur mit Freigabe: `shop-seiten.test.tsx` › „Herstellerlogo nur mit Freigabe (R12)“ (über `herstellerZuSeite` bis zur Anzeige).
- Weiterleitung früherer Kategorieadressen: `codelinie.test.ts` › „leitet eine frühere Adresse weiter …“.
- Texte je Verfügbarkeit: `codelinie-texte.test.ts` › „codelinienTexte nach Verfügbarkeit“; Längen: `seo-laengen.test.ts` (Varianten aller 52 Linien), `/shop` in `kategorie-weg.test.ts`.
- Kategorien in Reihenfolge, Wege und Vorbelegung: `kategorie-weg.test.ts`.

## OFFENE FRAGEN

1. **Versehen mit git:** Beim Umbenennen des Ordners `kategorie/[familie]` in `kategorie/[kategorie]` habe ich `git mv` benutzt. Damit ist diese Umbenennung im Index vorgemerkt; sonst habe ich nichts mit git getan. Der Orchestrator nimmt sie beim Commit mit oder setzt den Index zurück.
2. `/shop` verlangt den Eintrag `'shop'` in `VORHANDENE_ROUTEN` (`src/payload/hooks/seiten-adresse-pruefung.ts`), sonst schlägt `seiten-adresse.test.ts` fehl. Die Datei stand nicht in den Schreibrechten; ich habe nur diese Zeile ergänzt. Bitte bestätigen.
3. **Galerie auf der Codeseite** (Punkt 2 des Auftrags) fehlt: `CodeLine` hat kein Feld für weitere Bilder, und `codeLineZuSeite` übernimmt `weitereBilder` nicht. Dafür braucht es `gallery?: MediaImage[]` in `src/lib/types.ts` und eine Zeile im Mapping, beides außerhalb meiner Rechte. Die Seite zeigt das Produktbild im Kopf; die Galerie lässt sich danach wie bei Standardartikeln einsetzen.
4. Ohne Produktfoto zeigt der Kopf der Codeseite weiter die Zeichnung zum Beispielcode statt eines Fach-Icons. Die Zeichnung ist kein Platzhalterbild und Bestand; in der Liste steht das Fach-Icon. Richtig so?
5. „Customizing und Modifikation“ führt in die Anfrage mit Thema Autoschlüssel (Vorgabe im Paket). Das ist im Code an der Kennung festgemacht, weil das gepflegte Ziel die Anfrage ohne Thema ist. Besser wäre, das Ziel in `content/kategorien.json` und im Seed auf `/service-und-termin/anfrage?thema=autoschluessel&anliegen=frage` zu setzen (nicht meine Dateien).
6. Import: Spalte `codeformat` ist das Prüfmuster (etwa `^[0-9]{3,4}$`); der Text für Kunden wird nur aus einfachen Mustern gebildet. Soll die Tabelle eine eigene Spalte für den Kundentext bekommen? Schlüsseltyp und Beschreibung bleiben leer (die Seite bildet Texte aus Hersteller, System und Codeformat), Foto „freiwillig“ und Lieferumfang „1 Schlüssel je Stück“ wie im Bestand. Die Quelle je Zeile ist Pflicht, wird aber nicht gespeichert.
7. Import: Die Stammliste wird aus `content/hersteller.json` gelesen. Im Betrieb mit Datenbank muss ein dort neu angelegter Hersteller auch in dieser Datei stehen, oder das Skript bekommt einen Lesezugriff über die Local API.
8. Import: Die 52 Musterlinien bleiben in `content/code-lines.json` neben den echten (unsichtbar, A-046). Sollen sie beim ersten echten Import entfernt werden?
9. Hersteller mit Haken „angeboten“ aus, aber mit veröffentlichten Linien bekommen trotzdem eine Seite (die Linien entscheiden). Passt das?

## FÜR MENSCHEN

- Inhaber: die echten Angebote (etwa 50 bis 52) in die Vorlage `SORTIMENT-vorlage.csv` eintragen, je Zeile mit Quelle; nur eigene Fotos (MA-34).
- Inhaber: Hersteller-Stammliste vervollständigen und Einsatztexte belegen (MA-47); Logos nur mit schriftlicher Freigabe.
- Inhaber: Ziel von „Customizing und Modifikation“ bestätigen (Offene Frage 5) und ob die Musterlinien beim Import entfallen (Offene Frage 8).
- Team: nach dem Import `npm run seed`, dann jedes neue Produkt im Backend prüfen, Foto hochladen, veröffentlichen (Anleitung Abschnitt 8).
- Orchestrator: Einträge in Navigation und Startseite (Liste oben), Hilfetexte in `Produkte.ts`, Galerie-Feld (Offene Frage 3).

## Nachbesserung (Gegenprüfung, 15.11.2026)

Je Befund am Code geprüft. Kein git, kein Server.

1. **[rot] Import mit `active: true`:** behoben. `scripts/sortiment-import.mjs` schreibt jede Linie mit `active: false`. Ohne Datenbank bleibt sie unsichtbar, der Seed legt sie als Entwurf an (`_status: 'draft'`). Test „übernimmt Linien nur als Entwurf“ prüft `active: false` und `codeLineZuPayload(...)._status === 'draft'`. Kopfkommentar und Anleitung Abschnitt 8 (Schritte 4 bis 6) sagen jetzt: unsichtbar, Entwurf, erst nach Prüfung im Backend veröffentlichen.
2. **[rot] Hilfetexte in `Produkte.ts` und `payload-types.ts`:** trifft zu, nicht behoben. Die Sammlungen liegen außerhalb der Schreibrechte; der Befund weist die Änderung selbst dem Orchestrator zu. Neuer Text: „Erscheint in der Liste und auf der Seite des Produkts.“ (System, Codebereich, Lieferzeit), danach `payload generate:types`.
3. **[gelb] Galerie auf der Codeseite:** trifft zu, nicht behoben. Braucht `gallery?: MediaImage[]` in `src/lib/types.ts` und eine Zeile in `codeLineZuSeite`, beides außerhalb der Schreibrechte. Als Nachpaket vormerken (siehe Offene Frage 3).
4. **[gelb] Hilfetext Kategorien „sobald ein Artikel zugeordnet ist“:** behoben. `Kategorien.ts` und `docs/betrieb/shop-pflegen.md` sagen jetzt: Jede sichtbare Unterkategorie hat eine eigene Seite; ohne Artikel Hinweis, „Code anfragen“, nicht in Suchmaschinen.
5. **[gelb] Automatik-Texte importierter Linien:** behoben. Der Import setzt `tags: []`. Neu in `src/lib/codelinie.ts`: `codelinienKennung` nimmt ohne Serie „Hersteller System“ statt des großgeschriebenen Slugs; `eigeneFamilie` und `eigeneAnwendung` lassen Familie und Anwendung weg, wenn sie nur System oder „Hersteller System“ wiederholen. `codelinienTexte` lässt den Familiensatz dann weg, ebenso den Satz „Die Codelinie X ist für X vorgesehen“. Die Angabenliste der Detailseite zeigt Anwendung und Anwendungsfamilie nur noch mit eigenem Inhalt. Musterlinien bleiben unverändert (Platzhalter beim Hersteller). Test in `codelinie-texte.test.ts`.
6. **[gelb] Autoschlüsselgehäuse „Ansehen“ mit Anfrage-Hinweis:** behoben. `kategorieWeg` beschriftet den Knopf mit gesetztem Hinweis „Anfragen“ (Test). Die Anleitung sagt jetzt, dass nur die Anfrage zu einer Leistung und die Artikel-Anfrage den Namen übernehmen.
7. **[gelb] Kopfzeile „Direktkauf“ auf Hersteller- und Kategorieseite:** behoben. Beide zeigen „Direktkauf“ nur mit mindestens einer lieferbaren Linie (`gruppeLieferbar`), sonst „Auf Anfrage“.
8. **[gelb] Doppelter Satz im Warenkorb:** behoben. „Derzeit nicht lieferbar. Bitte entfernen Sie die Position.“
9. **[gelb] Verfügbarkeit auf der Detailseite:** behoben. Die Angabenliste hat die Zeile „Verfügbarkeit“ (`VERFUEGBARKEIT_LABEL`), direkt danach die Lieferzeit, wenn sie gepflegt ist.
10. **[gelb] Zahl je Kategorie in `/shop`:** behoben. Siehe 18.
11. **[gelb] `/shop` ohne Verweis:** teilweise behoben. `/schluessel-nach-code` verweist schon auf `/shop`; `/artikel` hat jetzt den Verweis „Alle Shop-Kategorien“. Der Navigationseintrag „Shop“ → `/shop` bleibt beim Orchestrator (gemeinsame Datei, Liste oben).
12. **[gelb] M-37 verweist auf `codeHersteller`:** trifft zu, nicht behoben. `docs/gestaltung/MENSCHEN.md` liegt außerhalb der Schreibrechte. Vorschlag für den Orchestrator: in der Spalte „Wo“ `codeHersteller` durch `herstellerMitSeite`, `herstellerDerLinie` ersetzen und im Text sagen, dass der Hersteller aus der Stammliste (Shop › Hersteller) gewählt wird.
13. **[gelb] Gedankenstrich im Widerrufshinweis des Bestellformulars:** trifft zu, nicht geändert. Der Befund knüpft die Änderung an eine Rücksprache wegen der Rechtsnähe (G9); vorgeschlagen ist nur die Teilung „… eingeschränkt sein. Einzelheiten stehen unter …“ ohne Änderung des Wortlauts. Entscheidung beim Orchestrator oder Inhaber.
14. **[rot] Beispielcode nicht wie im Backend geprüft:** behoben. `codePasst` im Import prüft genau wie `src/lib/code-pattern.ts` (`new RegExp(muster).test(code.trim())`, ohne Großschreibungs-Ausweich). Test auf `A123` umgestellt, Ablehnungsfall `a123` mit `^[A-Z][0-9]{3}$` ergänzt, Gegenprobe mit `^[A-Za-z][0-9]{3}$`.
15. **[rot] Import umgeht die Prüfung durch Menschen:** behoben wie 1 (gleicher Befund).
16. **[gelb] Hilfetext Kategorien:** behoben wie 4 (gleicher Befund).
17. **[gelb] Gruppentexte beschreiben immer den Direktkauf:** behoben. `herstellerTexte` und `kategorieTexte` haben ohne lieferbare Linie eine Anfrage-Fassung (Titel ohne „bestellen“, kein „Preis je Stück“, kein „wir fertigen danach“). Längentest und Inhaltstest für diese Fassung in `seo-laengen.test.ts`; Kopfzeilen wie 7.
18. **[gelb] `anzahl` zählt alle Produkte der Art:** behoben. `anzahlJeKategorie` in `shop/kategorie-weg.ts` zählt je Hauptkategorie ihre Produkte samt Unterkategorien; Produkte ohne Kategorie zählen zur ersten Hauptkategorie ihrer Art. Test mit zwei Artikel-Kategorien, leere zweite führt zu „Artikel anfragen“.
19. **[gelb] Kategorie-Überschriften `h2` unter `h2`:** behoben, jetzt `h3` mit gleichen Klassen.
20. **[gelb] Gruppe trägt je nach Reihenfolge den Freitext-Namen:** behoben. Bei gleicher Adresse übernimmt die Gruppe immer Stamm und Namen des Stammeintrags. Getrennte Schlüssel hätten zwei Gruppen mit derselben Herstellerseite ergeben. Kommentar angepasst, Test in beiden Reihenfolgen.
21. **[gelb] `'shop'` in `seiten-adresse-pruefung.ts`:** trifft zu, keine Änderung. Bestätigung durch den Orchestrator nötig (Offene Frage 2).
22. **[gelb] 404-Fall `moebel-und-bueroschloesser` belegt nichts:** behoben durch Benennung. Der Fall ist jetzt ausdrücklich als Prüfung einer unbekannten früheren Adresse kommentiert. Dass Beispiellinien auf keiner Kategorieseite erscheinen, belegen `getCodeLines` (leer, auch inaktive) und der Sitemap-Fall in derselben Datei. Eine Unterkategorie mit Beispiellinien lässt sich im Dateimodus nicht anlegen, ohne `content/` zu ändern.

Geändert in der Nachbesserung: `scripts/sortiment-import.mjs`, `scripts/sortiment-import.test.ts`, `src/lib/codelinie.ts`, `src/lib/codelinie.test.ts`, `src/lib/codelinie-texte.ts`, `src/lib/codelinie-texte.test.ts`, `src/lib/data/seo-laengen.test.ts`, `src/lib/data/beispiele-oeffentlich.test.ts`, `src/app/(site)/shop/page.tsx`, `src/app/(site)/shop/kategorie-weg.ts`, `src/app/(site)/shop/kategorie-weg.test.ts`, `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`, `src/app/(site)/schluessel-nach-code/hersteller/[hersteller]/page.tsx`, `src/app/(site)/schluessel-nach-code/kategorie/[kategorie]/page.tsx`, `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`, `src/app/(site)/artikel/page.tsx`, `src/payload/collections/Kategorien.ts` (nur Hilfetext), `docs/betrieb/shop-pflegen.md`.

Prüfung nach der Nachbesserung, alles über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 217 Dateien, 3440 Tests, alle grün.
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler und Warnungen.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 22 Dateien, 128 Tests, alle grün.
- `sicher.sh --json -- npm run build`: grün, 178 statische Seiten.

=== ENDE FA-SHOP-01B · BEREIT ZUR RÜCKGABE ===

## ABNAHME (Orchestrator, 16.11.2026)

- **Prüfkette grün** (`werkzeuge/abnahme.sh FA-SHOP-01B`, Build mit `SM24_INDEXIERUNG=an`): Typprüfung, Lint, Unit 3.441 Tests in 217 Dateien, Datenbanktests 128 in 22 Dateien, Build ohne Datenbank 178 von 178 Seiten (neu: `/shop`). Der Lauf gilt zugleich als volle Prüfung für FA-INHALT-02 und FA-QA-02, die bis dahin nur mit Unit, Typprüfung und Lint geprüft waren.
- **Onpage-Messung** (`werkzeuge/onpage.mjs`, 00:21): 135 Seiten, Median 100,0, keine Seite unter 95, kein roter und kein gelber Befund.
- **Vom Orchestrator nachgezogen** (Punkte aus dem Bericht, außerhalb der Schreibrechte des Pakets):
  - Hilfetexte zu System, Codebereich und Lieferzeit in `Produkte.ts`: „Erscheint in der Liste und auf der Seite des Produkts.“; Typen neu erzeugt.
  - Weitere Fotos eines Codeprodukts: `gallery` an `CodeLine`, Abbildung aus `weitereBilder` (Feld bestand), kleine Reihe unter dem Bild im Kopf der Produktseite; Test in `payload-mapping.test.ts`.
  - Verweise auf `/shop`: unter „Mehr“ an erster Stelle, in der Gruppe „Nach Code“ („Alle Shop-Kategorien“), im Fuß, auf der Startseite neben „Ohne Termin bestellen oder anfragen“ („Alle Kategorien im Shop“). Keine sechste Gruppe in der Hauptleiste, die zwei Zeichnungskarten der Startseite bleiben (A-057).
  - `docs/gestaltung/MENSCHEN.md` M-37: Hersteller aus der Stammliste, neue Funktionsnamen.
  - `'shop'` in `VORHANDENE_ROUTEN` bestätigt.
- **Sichtprobe** (Build der Abnahme, Konsole ohne Fehler): `/shop` bei 390 und 1280 px (acht Kategorien in der Reihenfolge des Inhabers, ehrlicher Hinweis ohne Produkte, „Zum Konfigurator“ als einziger betonter Knopf, Satz zum getrennten Autoschlüssel-Termin), `/schluessel-nach-code`, `/artikel`, Startseite: Abschnitt „Ohne Termin“ mit dem neuen Verweis bei 390 und 1280 px, Herstellerbereich (BKS, ABUS, BURG-WÄCHTER als Schriftzug). Im Herstellerbereich stand unter dem letzten Einsatz jeder Karte eine überzählige Trennlinie: entfernt.
- **Entschieden zu den offenen Fragen:** Ohne Produktfoto bleibt im Kopf der Produktseite die Zeichnung zum Beispielcode (sie erklärt mehr als ein Fach-Icon). Ein Hersteller mit veröffentlichten Linien bekommt seine Seite auch ohne Haken „angeboten“ (die Linien sind sichtbar, die Seite wäre sonst eine Lücke). Die Stammliste liest der Import aus `content/hersteller.json`; das steht in der Anleitung. Die Quelle je Zeile bleibt Pflicht in der Tabelle und wird nicht gespeichert (G13: die ausgefüllte Tabelle gehört nach `_werkstatt/ausbau/daten`, nicht ins Repository).
- **Nicht geändert (G9):** Gedankenstrich im Widerrufshinweis des Bestellformulars; Vorschlag steht in MA-40.
- **Für Menschen:** MA-34 und MA-47 (echte Angebote in die Vorlage; Musterlinien beim Import; Spalte für den Kundentext zum Codeaufbau; „Shop“ als eigener Punkt der Hauptleiste; Ziel von „Customizing und Modifikation“).

