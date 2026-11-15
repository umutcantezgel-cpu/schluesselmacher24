# FA-INHALT-03H · Texte menschlicher: neue Shopseiten (Übersicht, Liste nach Hersteller und System, Hersteller- und Kategorieseiten, Produktseite je Verfügbarkeit, Warenkorb)

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse M · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-10 (Shop verständlich, Termin getrennt), FA-11 (Schlüssel nach Code verständlich, Anfrage wenn der Code nicht eindeutig passt), FA-01 (für ältere Kunden bedienbar).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte. Die Gruppe D (`berichte/FA-INHALT-03D.md`) hat die Seiten „Schlüssel nach Code“ schon einmal überarbeitet; seither sind in FA-SHOP-01 und FA-SHOP-01B neue Seiten und neue Fassungen entstanden (`berichte/FA-SHOP-01B.md`). Du liest nur, was seither neu oder geändert ist, und lässt Sätze der Gruppe D stehen, wenn sie gut sind.

## Seitengruppe
- Übersicht: src/app/(site)/shop/page.tsx und die Sätze in src/app/(site)/shop/kategorie-weg.ts (Beschriftungen der Knöpfe, Hinweis ohne Produkte); Kurzbeschreibungen und Hinweise der Kategorien in `content/kategorien.json` und wortgleich im Rückfall `src/lib/data/defaults/kategorien.ts` (nur `beschreibung` und `hinweis`, nicht Namen, Ziele, Reihenfolge)
- Liste und Gruppen: src/app/(site)/schluessel-nach-code/shop-liste.tsx, linien-liste.tsx, linien-zeile.tsx, hersteller-marke.tsx, verfuegbarkeit-hinweis.tsx (nur sichtbarer Wortlaut)
- Hersteller- und Kategorieseiten: hersteller/[hersteller]/page.tsx, kategorie/[kategorie]/page.tsx und die Sätze, die sie erzeugen (`herstellerTexte`, `kategorieTexte` in src/lib/codelinie-texte.ts: nur Fließtext und Überschriften im Seitenkörper)
- Produktseite: [slug]/page.tsx (neue Zeilen: System, Codebereich, Lieferzeit, Verfügbarkeit, „Code anfragen“) und die Fassungen je Verfügbarkeit in `codelinienTexte` (src/lib/codelinie-texte.ts: Einleitung, Abschnitte, Fragen und Antworten; „auf Anfrage“ und „nicht lieferbar“ beschreiben keinen Direktkauf)
- Artikel: src/app/(site)/artikel/page.tsx, artikel-liste.tsx, [slug]/page.tsx (nur was seit FA-SHOP-01 neu ist: Verfügbarkeit, „Artikel anfragen“, Verweis „Alle Shop-Kategorien“)
- Warenkorb: src/app/(site)/warenkorb/warenkorb-ansicht.tsx (nur die Zeilen zur Verfügbarkeit und zu nicht bestellbaren Positionen)

## Besonderheiten dieser Gruppe
- Wahrheit zuerst (R4, R9): Heute gibt es keine veröffentlichten Codeprodukte und keine echten Artikel; die Seiten zeigen den ehrlichen Zustand ohne Produkte. Jeder Satz muss in beiden Lagen stimmen (mit und ohne Produkte, lieferbar, auf Anfrage, nicht lieferbar). Lies die Bedingungen im Code und ändere nur den Wortlaut zwischen ihnen, nie die Bedingung.
- Der Hinweis ohne Produkte lautet heute „Hier gibt es bald Produkte. Bis dahin fragen Sie bitte bei uns an.“ Prüfe, ob „bald“ ein Versprechen ist, das niemand halten muss; besser ist ein Satz, der nur sagt, was heute gilt und was der Kunde tun kann. Derselbe Satz steht an mehreren Stellen (Konstante `HINWEIS_PRODUKTE_FOLGEN` und Daten): überall gleich halten.
- Wörter: „Schlüssel nach Code“, nie „Codelinie“ im sichtbaren Text (im Code darf der Name bleiben); „Hersteller“ und „System“ so, wie die Daten sie liefern; „Code anfragen“ und „Artikel anfragen“ bleiben als Knopftexte (Tests und andere Seiten verweisen darauf); „Termin anfragen“ nur für den Autoschlüssel-Termin. Der Satz, dass der Termin für Autoschlüssel ein eigener Weg bleibt, muss auf `/shop` stehen bleiben (Vorgabe des Inhabers, Abschnitt 10).
- Herstellernamen nur sachlich (R12); keine Aussage über einen Hersteller, die nicht aus den Daten kommt.
- Titel und Beschreibungen für Suchmaschinen (`title`, `description`, `SHOP_SEO`) änderst du nicht; ihre Längen sind geprüft (`src/lib/data/seo-laengen.test.ts`). Strukturdaten (`src/components/seo`) fasst du nicht an. Steht ein sichtbarer Satz auch in den Strukturdaten (Fragen und Antworten), bleibt er eine Quelle: Du änderst ihn an der einen Stelle, aus der beide lesen.
- Unantastbar (G9, R10): Preise, Staffeln, Versandangaben, Widerrufs- und Rechtshinweise, Pflichtangaben zur Produktsicherheit.
- Tests binden manche Sätze wörtlich (`shop-seiten.test.tsx`, `kategorie-weg.test.ts`, `codelinie-texte.test.ts`, `seo-laengen.test.ts`). Ändert sich ein Satz, passt du die Erwartung an und sagst es im Bericht; du lockerst keine Prüfung (G8).
- Gleichzeitig arbeitet ein anderes Paket: FA-SHOP-04 (Sperrschließungen: `src/app/(site)/gleichschliessende-zylinder/**`, `src/components/hersteller/**`, `src/payload/**`, `content/hersteller.json`, Zylinderkatalog). Fasse dessen Stellen nicht an und ändere geteilte Dateien nur mit dem Bearbeitungswerkzeug an einzelnen Stellen. Ein roter Test in fremden Dateien ist nicht dein Fehler; wiederhole den Lauf und nenne es im Bericht.

## Schreibrechte
Die oben genannten Dateien, jeweils nur sichtbarer Wortlaut; `content/kategorien.json` und `src/lib/data/defaults/kategorien.ts` nur für `beschreibung` und `hinweis`; Tests dieser Dateien; `_werkstatt/ausbau/berichte/FA-INHALT-03H.md`.
Nicht anfassen: `content/code-lines.json`, `content/hersteller.json`, `src/lib/codelinie.ts`, `src/lib/wege/**`, `src/lib/actions/**`, `src/payload/**`, `src/components/hersteller/**`, `src/components/seo/**`, Preise, Navigation, Startseite, Rubrikdaten, Rechtstexte, SEO-Titel und -Beschreibungen, `docs/**`.

=== ENDE FA-INHALT-03H · BEREIT ZUR RÜCKGABE ===
