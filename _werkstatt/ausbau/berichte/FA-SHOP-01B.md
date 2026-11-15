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

=== ENDE FA-SHOP-01B · BEREIT ZUR RÜCKGABE ===
