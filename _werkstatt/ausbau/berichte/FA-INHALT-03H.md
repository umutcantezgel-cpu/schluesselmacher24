# Bericht FA-INHALT-03H · Texte menschlicher: neue Shopseiten

Stand 15.11.2026. Kein git, kein Server, kein Build. Prüfungen über die Datenweiche (unten unter PRÜFUNG).

## GEÄNDERTE DATEIEN
Nur sichtbarer Wortlaut. Keine Bedingung, kein Feldname, keine Reihenfolge, kein Ziel, kein Preis, kein SEO-Feld, keine Strukturdaten geändert.
- `content/kategorien.json` und wortgleich `src/lib/data/defaults/kategorien.ts`: nur `beschreibung` (Code, Vorlage, Autoschlüssel als Produkte, Customizing, Gleichschließende Zylinder) und `hinweis` (Konstante `HINWEIS_PRODUKTE_FOLGEN` und alle fünf Einträge in den Daten).
- `src/app/(site)/shop/page.tsx`: Lead, Zähler („Produkt/Produkte“ statt „Codelinie/Codelinien“), Satz zum Werkstatttermin ohne Effekt-Doppelpunkt. Titel, `SHOP_SEO`, `SeitenDaten` unverändert.
- `src/app/(site)/shop/kategorie-weg.ts`: Knopftext „Zu den Produkten“ statt „Zu den Codeprodukten“, ein Kommentar. „Code anfragen“, „Artikel anfragen“, „Anfragen“, „Ansehen“, „Zum Konfigurator“, „Zu den Artikeln“ unverändert.
- `src/app/(site)/schluessel-nach-code/shop-liste.tsx`: Suchhilfe, Zähler, Satz zur Codesuche, Gruppenkopf, `aria-label` der Suche und der Liste, Leertext. Alles ohne „Codelinie“.
- `src/app/(site)/schluessel-nach-code/verfuegbarkeit-hinweis.tsx`: Satz bei „auf Anfrage“.
- `src/app/(site)/schluessel-nach-code/hersteller/[hersteller]/page.tsx`: Abschnittstitel und Augenbraue, `aria-label`, Satz vor „Code anfragen“, Verweis auf die Übersicht.
- `src/app/(site)/schluessel-nach-code/kategorie/[kategorie]/page.tsx`: Abschnittstitel, Augenbraue und Lead der Liste, Satz vor „Code anfragen“, Satz ohne Produkte (Rückfall), Überschrift „Angaben zu dieser Kategorie“, Verweis auf die Übersicht.
- `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`: Satz neben dem Bestellformular, Verweise unter „Weiter im Bereich“, Titel der verwandten Produkte und der Verweisliste, Knopf zur Übersicht bei „nicht lieferbar“. `generateMetadata` unverändert.
- `src/lib/codelinie-texte.ts`: in `codelinienTexte` Einleitung „auf Anfrage“, Beschreibung (alle drei Fassungen), Fotosatz, Fragen und Antworten; in `kategorieTexte` und `herstellerTexte` Einleitung und Absätze. `metaTitel`, `metaBeschreibung` und Titelvorschläge unverändert.
- `src/app/(site)/artikel/[slug]/page.tsx`: die zwei neuen Sätze im Abschnitt Versand („auf Anfrage“, „nicht lieferbar“).
- `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`: Zeile bei „auf Anfrage“, Satz im Warnhinweis zu nicht bestellbaren Positionen.
- Tests, weil sich der Wortlaut änderte (keine Prüfung gelockert):
  - `src/app/(site)/shop/kategorie-weg.test.ts`: Erwartung „Zu den Produkten“.
  - `src/lib/codelinie-texte.test.ts`: „6 Produkte“ statt „6 Codelinien“; die Prüfung, dass die Linie nicht „ist für sich selbst“ heißt, auf den neuen Satzanfang gezogen (`/Testwerk TX 100 ist für Testwerk TX 100/` statt `/Die Codelinie Testwerk TX 100 ist für …/`). Sie greift damit wieder, statt ins Leere zu laufen.
- Ohne Änderung: `linien-liste.tsx` (kein Text), `linien-zeile.tsx` („Codebereich“, „Staffelpreis ab … Stück“, „Lieferzeit“ sind klar), `hersteller-marke.tsx`, `artikel/page.tsx`, `artikel/artikel-liste.tsx` (die neuen Teile sind schon kurz und richtig, siehe OFFENE FRAGEN 4).

## WAS UND WARUM
- **Hinweis ohne Produkte.** „Hier gibt es bald Produkte. Bis dahin fragen Sie bitte bei uns an.“ versprach mit „bald“ und „bis dahin“ etwas, das niemand halten muss (R4). Neu überall gleich: „Direkt bestellen können Sie hier derzeit nicht. Bitte fragen Sie bei uns an.“ Der Satz stimmt bei jeder Kategorie, die ihn zeigt: Codeprodukte (Knopf „Code anfragen“), Artikel („Artikel anfragen“) und Anfrage-Kategorien („Anfragen“). Er steht in der Konstante und in allen fünf Daten-Einträgen. Die Tests binden ihn über die Konstante.
- **„Codelinie“ aus dem sichtbaren Text.** Gezählt und Liste heißen jetzt „Produkt/Produkte“, Verweise „Alle Schlüssel nach Code“. In den Seitentexten heißt die Linie „der Schlüssel MS-01“. Ich habe nicht „Angebot“ gewählt, weil „Angebot“ bei „auf Anfrage“ schon das Preisangebot meint. Im Code und in den Suchtexten bleibt „Codelinie“ (SEO-Felder gesperrt).
- **Kategorien.** Sätze ohne Fragmente („Ohne Einsendung des Originals.“, „Im Konfigurator zusammenstellen.“). „Bis es so weit ist“ bei Autoschlüssel als Produkte fiel weg (R4). Der Satz zum getrennten Werkstatttermin bleibt dort und unten auf `/shop` (Vorgabe Abschnitt 10). „Customizing und Modifikation“ sagt jetzt, was es ist, mit der Grenze aus der Vorgabe des Inhabers (Abschnitt 14: „nur dort, wo Elektronik, Transponder, Tasten und Bart technisch passend übernommen werden können“).
- **Produktseite je Verfügbarkeit.** Semikolons in zwei Sätze geteilt. „Hinterlegt sind:“ (Wort aus der Pflege) wurde „Angaben zum Schloss:“. „Allein nach Ihrer Codeangabe“ wurde „nur nach Ihrem Code“. Die Einleitung bei „auf Anfrage“ sagt „Bitte fragen Sie bei uns an, wir prüfen Ihren Code.“ und wiederholt nicht den Satz „bestellen Sie nicht direkt“, der schon in der Beschreibung und im Kasten daneben steht. „Nicht lieferbar“ beschreibt weiter keinen Kauf und keine Anfrage, weil die Seite dort nur die Übersicht anbietet. Preise, Staffeln, Umsatzsteuer- und Versandangaben stehen im selben Wortlaut, nur der Satz danach ist eigenständig.
- **Gruppen.** „Bestellt wird“ und „Angefragt wird“ (Passiv) wurden „Sie bestellen nach dem Code“ und „Sie nennen den Code in einer Anfrage“. „Die Codeformate reichen von A bis B“ ergab bei Formaten keinen Sinn, jetzt „sind verschieden, etwa A oder B“.
- **Fragesätze als Einleitung** („Ihr Code passt zu keiner Linie?“) wurden Aussagen mit nächstem Schritt („Passt Ihr Code zu keinem Produkt, prüfen wir ihn gern. Code anfragen“).
- **Warenkorb.** Bei „auf Anfrage“ steht jetzt, warum die Position weg muss („Über den Warenkorb geht das nicht.“) und dann der Anfrage-Link. Im Warnhinweis „das Produkt“ statt „den Artikel“, weil es auch ein Schlüssel nach Code sein kann.
- **Artikel.** „…fragen ihn an“ als Nebensatz wurde zwei klare Sätze. Bei „nicht lieferbar“ fiel „Ist der Artikel wieder lieferbar …“ weg, weil das eine Rückkehr verspricht (R4).
- **Gegenlesen.** Dieses Paket hatte kein Werkzeug für Unteragenten. Ich habe zwei Lesungen nacheinander selbst gemacht.
  - (1) Als älterer Kunde ohne Fachwissen. Ergebnis: „Codeprodukte“ und „Codelinie“ raus. Die Beschreibung importierter Linien begann mit „Dazu gehören …“ ohne Bezug, jetzt „Angaben zum Schloss: …“. Bei Kategorienamen im Plural las sich „Alle Produkte in Möbel- und Büroschlösser“ falsch, jetzt „Alle Produkte der Kategorie …“.
  - (2) Als Tatsachenprüfer gegen die Kopie der alten Fassung (Scratchpad `03h/vorher`) und die erzeugten Texte aller drei Verfügbarkeiten (Skript `03h/texte.ts`, Ausgabe `texte-vorher.txt`, `texte-nachher.txt`). Ergebnis: Jede behaltene Tatsache ist gleich geblieben. „Wir prüfen den Code“ bei „auf Anfrage“ ist durch die bestehende Antwort „nachdem wir Ihren Code geprüft haben“ belegt. Zwei Wahrheitsfehler liegen in Bedingungen, die ich nicht ändern darf (OFFENE FRAGEN 1 und 2).
  - Eine unabhängige Gegenlesung durch zwei andere Leser fehlt (OFFENE FRAGEN 7).

## ZAHLEN VORHER UND NACHHER
Messung: `stil.mjs` braucht einen laufenden Server, der hier nicht erlaubt ist. Gemessen habe ich wie 03D und 03G mit `tsxZeilen` und `pruefeZeile` aus stil.mjs über die Quelldateien (Skript `scratchpad/03h/mess.mjs`). Diese Heuristik zählt Sätze mit `${…}` nicht. Darum habe ich die Texte aus `codelinie-texte.ts` zusätzlich wirklich erzeugt: drei Linien (MS-01, ZY-02, eine importierte Linie) je drei Verfügbarkeiten, dazu Kategorie- und Herstellertexte lieferbar und auf Anfrage.

| Gruppe | Wörter vorher → nachher | Mittel | längster Satz | Gedankenstriche | „Codelinie“ sichtbar | übrige Befunde |
|---|---|---|---|---|---|---|
| Shop-Übersicht (Seite, Weg, Kategorien) | 177 → 197 | 5,4 → 5,8 | 23 → 23 (gesperrte `SHOP_SEO.description`) | 0 → 0 | 1 Zähler → 0 | Frage 1 → 1 (Seitentitel, siehe SCHLUSSREDAKTION) |
| Liste und Gruppen | 200 → 202 | 4,9 → 4,9 | 14 → 14 | 0 → 0 (1 im Kommentar entfernt) | 2 → 0 Zeilen (Heuristik; mit Ausdrücken in `{…}` 6 → 0) | Frage 3 → 3 (Infotitel „Was ist …?“ und „Unsicher, wo der Code steht?“, Bestand 03D) |
| Hersteller- und Kategorieseiten | 86 → 92 | 3,7 → 3,8 | 11 → 10 | 0 → 0 | 3 → 0 Zeilen | Frage 0 → 0 (Heuristik; die zwei Fragesätze vor „Code anfragen“ sind jetzt Aussagen) |
| Produktseite (Seite und Texte, Quelltext) | 338 → 350 | 5,6 → 5,7 | 14 → 14 | 0 → 0 | 5 → 2 Zeilen (beide gesperrt: Titel „Codelinie nicht gefunden“, Suchtext) | Frage 4 → 2 („Sie finden den Code nicht?“ von 03D, Ratgebertitel) |
| Produkt-, Kategorie- und Herstellertexte, erzeugt (15 Fassungen) | 1600 → 1621 | 9,4 → 8,2 | 21 → 21 (Aufzählung der Anwendungen in der Kategorie-Einleitung, Musterdaten) | 0 → 0 | 16 → 0 | Semikolons 15 → 0 |
| Artikel (nur neue Sätze) | 316 → 314 | 5,3 → 5,1 | 16 → 16 (gesperrte Rückfall-Beschreibung) | 0 → 0 | 0 → 0 | Bindestrich 1 → 1 (Bestand) |
| Warenkorb (nur Verfügbarkeitszeilen) | 279 → 279 (Heuristik zählt die Zeilen in `{…}` nicht) | 4,0 → 4,0 | 14 → 14 | 0 → 0 | 0 → 0 | Bindestrich 1 → 1 (Bestand) |

Kein Satz über 25 Wörter, vorher wie nachher. Wörter kamen dazu, wo Fragmente ganze Sätze wurden und Semikolons zu zwei Sätzen.

Offene Stellen je Seite: siehe OFFENE FRAGEN 1 bis 5.

## SCHLUSSREDAKTION (Liste für den Menschen)
Shop-Übersicht `/shop`
1. Hinweis ohne Produkte: „Direkt bestellen können Sie hier derzeit nicht. Bitte fragen Sie bei uns an.“ Passt er für alle Kategorien, auch für Autoschlüsselgehäuse? Dort führt „Anfragen“ auf die Seite `/autoschluessel/gehaeuse`, nicht direkt ins Formular.
2. Beschreibung „Customizing und Modifikation“: „Ihr Autoschlüssel in neuer Optik, etwa in einem moderneren Gehäuse. Das geht nur, wenn die Technik hineinpasst.“ Ist Customizing nur für Autoschlüssel gedacht?
3. Seitentitel „Was möchten Sie bestellen?“ ist eine Frage als Überschrift. Ich habe sie stehen lassen, weil sie die echte Kundenfrage ist, wie die Hub-Frage. Soll sie bleiben?

Liste „Schlüssel nach Code“ (erst mit Produkten sichtbar)
1. Das Wort „Produkt“ für eine Codelinie, etwa „3 von 52 Produkten“ und „Zu Ihrer Auswahl passt kein Produkt.“ Verständlich, oder lieber „Schlüssel“?
2. Satz zur Codesuche: „Ihr Code … passt zum Codeformat von 3 Produkten. Welches davon zu Ihrem Schloss gehört, erkennen Sie an Hersteller und System.“
3. Kopf je Hersteller „… Produkte · Preis je Stück“, auch wenn kein Preis gezeigt wird (OFFENE FRAGEN 2).

Hersteller- und Kategorieseiten
1. Titel „Schlüssel für Schlösser von BKS“ (Beispiel). Sachlich genug nach R12?
2. „Die Codeformate sind verschieden, etwa „3 bis 4 Ziffern“ oder „2 Buchstaben, dann 3 Ziffern“.“
3. „Passt Ihr Code zu keinem Produkt, prüfen wir ihn gern.“ Der Satz ohne Produkte ist jetzt derselbe Hinweis wie überall (Nachbesserung 7).

Produktseite
1. „Der Schlüssel MS-01 ist für Büroschrank und Rollcontainer gedacht. Er gehört zur Anwendungsfamilie …“ Das Wort „Anwendungsfamilie“ steht auch als Angabe in der Liste; einfacher wäre „Gruppe“.
2. „Angaben zum Schloss: Hersteller …, System …, Codebereich …“ in Beschreibung und Antwort.
3. Einleitung lieferbar endet weiter mit „8,00 € je Stück.“ als Satzfetzen. Das ist eine Preisangabe, ich habe sie nicht umgeformt (G9). Darf daraus „Ein Schlüssel kostet 8,00 €.“ werden?

Artikel und Warenkorb
1. Artikel „auf Anfrage“: „Diesen Artikel legen Sie nicht in den Warenkorb. Sie fragen ihn bei uns an.“
2. Warenkorb „auf Anfrage“: „Auf Anfrage. Diese Position können Sie nicht über den Warenkorb bestellen. Bitte entfernen Sie sie. Code anfragen“
3. Warnhinweis: „Bitte entfernen Sie die betroffene Position. Brauchen Sie das Produkt trotzdem, fragen Sie es bei uns an. Nutzen Sie dazu den Link an der Position oder unser Kontaktformular.“ (Kontaktformular jetzt verlinkt)
4. Artikel „nicht lieferbar“: „Diesen Artikel können Sie zurzeit nicht bestellen. Ist er lieferbar, wählen Sie die Versandart im Warenkorb.“

## OFFENE FRAGEN
1. **Staffelpreis ohne Preis (R9).** `kategorieTexte` nennt „Staffelpreise gelten ab 3 Stück.“ auch in der Anfrage-Fassung, wenn keine Linie lieferbar ist und kein Preis auf der Seite steht. Die Bedingung (`staffelAb.length === 1`) fragt die Verfügbarkeit nicht ab. Vorschlag für ein Paket mit Logikrecht: `lieferbar && staffelAb.length === 1`.
2. **„Preis je Stück“ ohne Preis.** Der Gruppenkopf in `shop-liste.tsx` zeigt „· Preis je Stück“ immer, auch wenn alle Produkte der Gruppe „auf Anfrage“ oder „nicht lieferbar“ sind. Vorschlag: nur mit `gruppeLieferbar(gruppe.lines)`.
3. **„Codelinie“ bleibt an Stellen außerhalb meiner Rechte sichtbar:** `schluessel-nach-code/page.tsx` (Augenbraue „Codelinien“, Titel „Passende Codelinie finden“, „Codelinien nach Hersteller“, Knopf „Codelinie finden“; erst mit Produkten sichtbar), die Suchtexte (`metaBeschreibung` „Codelinie MS-01“, „Fragen Sie gern nach einer anderen Codelinie.“, `kategorieTexte`/`herstellerTexte` „6 Codelinien“) der Titel „Codelinie nicht gefunden“ und im Bestellformular `schluessel-nach-code/[slug]/bestell-formular.tsx` (Zeile 325, mitten im Berechtigungsnachweis nach R13) der Satz „Für diese Codelinie brauchen wir ein Foto Ihrer Sicherungskarte.“ Vorschlag für ein Paket mit Schreibrecht dort: „Für diesen Schlüssel brauchen wir ein Foto Ihrer Sicherungskarte.“ (nachgetragen in der Nachbesserung). Suchtexte nur nach FA-SEO-01, Längen in `seo-laengen.test.ts`.
4. **Texte, die nicht in beiden Lagen stimmen, aber nicht zu den neuen Teilen gehören:** Lead der Artikelübersicht „Artikel rund um Schlüssel, Schloss und Tür zum direkten Bestellen.“ (heute ohne Artikel) und der leere Warenkorb „Einen Schlüssel nach Code fragen Sie bei uns an.“ (falsch, sobald es lieferbare Codeprodukte gibt). Vorschläge: „Artikel rund um Schlüssel, Schloss und Tür. Was lieferbar ist, bestellen Sie hier direkt.“ und „Einen Schlüssel nach Code bestellen Sie direkt oder fragen ihn bei uns an.“
5. **Beispieltext im Backend und in der Anleitung.** `src/payload/collections/Kategorien.ts` (Hilfetext), `src/payload-types.ts`, `src/lib/types.ts` (Kommentar) und `docs/betrieb/shop-pflegen.md` nennen als Beispiel noch „Hier gibt es bald Produkte. Bis dahin fragen Sie bitte bei uns an.“ Außerhalb meiner Rechte. Neuer Wortlaut: „Direkt bestellen können Sie hier derzeit nicht. Bitte fragen Sie bei uns an.“
6. **Datenbank.** Kategorien, die schon in einer Datenbank stehen, behalten Beschreibung und Hinweis in alter Fassung, bis jemand sie im Backend ändert oder der Seed sie überschreibt. Ob der Seed vorhandene Kategorien aktualisiert, habe ich nicht geprüft (kein `--pg`).
7. **Unabhängige Gegenlesung** durch zwei andere Leser (älterer Kunde, Tatsachen) bitte durch den Orchestrator nachholen.
8. Gleichzeitig geändert, nicht von mir: `konfigurator.tsx`, `cylinder-rules.ts`, `konfigurator/index.ts`, `payload-mapping*.ts`, `security.test.ts` und neue Dateien zur Preisbestätigung (FA-SHOP-04). Ein roter Test trat dabei nicht auf.

## NACHBESSERUNG
Nach zwei Gegenprüfungen, 15.11.2026. Nur sichtbarer Wortlaut, keine Bedingung geändert.
1. **Backend-Hilfetext mit „bald“** (`Kategorien.ts`, `payload-types.ts`, `types.ts`, `docs/betrieb/shop-pflegen.md`): zutreffend, aber nicht behoben. Alle vier Stellen liegen außerhalb meiner Schreibrechte (`src/payload/**`, `docs/**`; FA-SHOP-04 arbeitet dort). Steht schon in OFFENE FRAGEN 5 mit dem neuen Wortlaut; ein Folgepaket nach FA-SHOP-04 muss danach `payload-types` neu erzeugen.
2. **„Codelinie“ im Bestellformular** (`bestell-formular.tsx:325`): zutreffend, nicht behoben, weil die Datei nicht zu meinen Schreibrechten gehört. In OFFENE FRAGEN 3 nachgetragen, mit dem Vorschlag „Für diesen Schlüssel brauchen wir ein Foto Ihrer Sicherungskarte.“
3. **Warnhinweis Warenkorb ohne Link**: behoben. Neu: „Bitte entfernen Sie die betroffene Position. Brauchen Sie das Produkt trotzdem, fragen Sie es bei uns an. Nutzen Sie dazu den Link an der Position oder unser Kontaktformular.“ „Kontaktformular“ ist jetzt ein Link auf `/service-und-termin/kontakt` (dieselbe Adresse wie in `fahrzeug-anfrage/seiten.tsx`). Der reine Vorschlag „Den Link finden Sie an der Position“ hätte bei „nicht lieferbar“ nicht gestimmt, denn dort steht an der Position kein Link; darum beide Wege.
4. **„Über den Warenkorb geht das nicht.“**: behoben. Neu: „Auf Anfrage. Diese Position können Sie nicht über den Warenkorb bestellen. Bitte entfernen Sie sie.“ danach unverändert der Anfrage-Link.
5. **Artikel „nicht lieferbar“ vor der Versandliste**: behoben. Neu: „Diesen Artikel können Sie zurzeit nicht bestellen. Ist er lieferbar, wählen Sie die Versandart im Warenkorb.“ Der Satz stellt den Bezug zur Versandliste her, ohne eine Rückkehr zu versprechen. Die Bedingung für die Liste bleibt.
6. **Beschreibung „Gleichschließende Zylinder und Sperrschließungen“**: nicht zutreffend. Die Website selbst erklärt Sperrschließung als „ein Schlüssel für alle Türen“ (`gleichschliessende-zylinder/konfigurator/konfigurator.tsx`) und „Alle Schlüssel schließen alle Türen. Man nennt das eine Sperrschließung.“ (`components/konfigurator/schliessplan-editor.tsx`); die vorgeschlagene Fassung (jede Tür mit eigenem Schlüssel und ein gemeinsamer) beschreibt eine Hauptschlüsselanlage und widerspräche der Seite (R4). Die Beschreibung bleibt an beiden Stellen wortgleich. Ob die Kategorie den Begriff so meinen soll, entscheidet der Inhaber mit FA-SHOP-04.
7. **Rückfallsatz ohne Produkte auf der Kategorieseite**: behoben. Die Seite zeigt jetzt `kategorie.hinweis || HINWEIS_PRODUKTE_FOLGEN` (Import aus `@/lib/data/defaults/kategorien`), Bedingung unverändert. Der Satz passt dort, weil direkt danach der Knopf „Code anfragen“ steht.

Geändert in der Nachbesserung: `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`, `src/app/(site)/artikel/[slug]/page.tsx`, `src/app/(site)/schluessel-nach-code/kategorie/[kategorie]/page.tsx`, dieser Bericht. Kein Test band die geänderten Sätze.

Prüfung nach der Nachbesserung über `sicher.sh --json`: `npx vitest run` 218 Testdateien, 3458 Tests bestanden; `npm run typecheck` Exit 0; `npm run lint` Exit 0.

## PRÜFUNG
Nach der letzten Änderung, alles über `_werkstatt/ausbau/werkzeuge/sicher.sh --json`:
- `npx vitest run`: 218 Testdateien, 3458 Tests bestanden.
- `npm run typecheck`: ohne Fehler (Exit 0).
- `npm run lint`: ohne Fehler (Exit 0).
- Zusätzlich `npx tsx` über ein Messskript in einem vorübergehenden Ordner `.tmp-03h` im Repository, danach gelöscht.

=== ENDE FA-INHALT-03H · BEREIT ZUR RÜCKGABE ===
