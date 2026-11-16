# Bericht FA-INHALT-03I · Shopseiten: Befunde der drei Leser behoben

Stand 16.11.2026. Kein git, kein Server, kein Build, kein `--pg`. Prüfungen über die Datenweiche (unten unter PRÜFUNG UND ERGEBNIS). Grundlage: `berichte/FA-INHALT-03H-leser.md` (L-01 bis L-35), Entscheidungen 1 bis 18 aus `pakete/FA-INHALT-03I.md`.

## GEÄNDERTE DATEIEN
- `src/lib/codelinie-texte.ts`: neue Hilfen `gruppenZustand`, `gruppenKopfzeile`, Konstanten `GRUPPE_AUF_ANFRAGE`, `GRUPPE_NICHT_LIEFERBAR`, `ANFRAGE_WEG`, `ANFRAGE_KASTEN`; `gruppeLieferbar` stützt sich auf `gruppenZustand`. Neue interne Bausteine `schlossSaetze`, `ohneFormatRest`, `preisSatz` (ersetzt `preisSpanne`). `aufzaehlung` setzt „sowie“ vor den letzten Wert, wenn ein Wert selbst „und“ enthält. Neues Feld `codeHinweis` in `CodelinienTexte`. Einleitung, Beschreibung, Fragen und Antworten der Produktseite je Verfügbarkeit; Einleitung, Absätze und Suchbeschreibung der Kategorie- und Herstellerseite je Zustand.
- `src/lib/codelinie-texte.test.ts`: drei Erwartungen an neuen Wortlaut angepasst (siehe unten), zwei neue Testgruppen (Produktseite je Verfügbarkeit; Gruppen mit drei Zuständen samt gemischten Gruppen, Kopfzeile, Aufzählung).
- `src/app/(site)/schluessel-nach-code/page.tsx`: Kopf nach `gruppeLieferbar(lines)`; Leerzustand ohne „noch nicht“, „bis dahin“, „sobald“; „Produkt/Produkte“ statt „Linie/Linien“; Lead der Herstellerliste ohne „und Preisen“.
- `src/app/(site)/schluessel-nach-code/page.test.tsx` (neu): Übersicht lieferbar, gemischt ohne lieferbares Produkt, nur nicht lieferbar, ohne Produkte.
- `src/app/(site)/schluessel-nach-code/shop-liste.tsx`: Plakette „Code hat die richtige Form“, Satz zur Codesuche, Suchhilfe, Bildschirmleser-Zähler, Filter „Einsatzbereich“ mit neuer Erklärung.
- `src/app/(site)/schluessel-nach-code/linien-zeile.tsx`: Staffelhinweis aus `staffelStufen(line)[0]`.
- `src/app/(site)/schluessel-nach-code/verfuegbarkeit-hinweis.tsx`: Kastentext je Verfügbarkeit (neue reine Funktion `verfuegbarkeitSatz`), bei Schlüsseln „nicht lieferbar“ zusätzlich der Link „Code anfragen“ unter dem Knopf zur Übersicht.
- `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`: Zeilen „Einsatzbereich“ und „Aufbau des Codes“, Plakette „Aufbau des Codes: …“, Augenbraue „Gleicher Einsatzbereich“, Hinweis zur Fundstelle aus `texte.codeHinweis`.
- `src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx` (nur Wortlaut): Feldhinweis „So sieht der Code aus: …, zum Beispiel …“ statt „Erwartetes Format: … Beispiel: …“; Rückmeldung „Der Code hat die richtige Form.“ statt „Der Code passt zum erwarteten Format.“ (gleiche Gefahr wie L-02).
- `src/app/(site)/schluessel-nach-code/hersteller/[hersteller]/page.tsx`, `kategorie/[kategorie]/page.tsx`: Kopfzeile über `gruppenKopfzeile`; Kategorieseite Lead der Liste ohne „Codeformat“.
- `src/app/(site)/schluessel-nach-code/shop-seiten.test.tsx`: Plakette und Satz der Codesuche, Kasten in drei Fällen, Staffelhinweis in der Liste (gültig, über Höchstmenge, nicht günstiger, ab 1 Stück).
- `src/app/(site)/artikel/page.tsx`: Direktkauf nur mit `articles.some(istBestellbar)`; sonst Kopf „Auf Anfrage“, `LEAD_OHNE_ARTIKEL`, Abschnitt ohne Stückzahl. `page.subline` und `page.intro` gelten nur im Direktkauf.
- `src/app/(site)/artikel/page.test.tsx` (neu): bestellbar, nur Beispiele, nur Anfrage/nicht lieferbar, Beispiel lieferbar plus Anfrage, keine Artikel.
- `src/app/(site)/warenkorb/warenkorb-ansicht.tsx` (nur Wortlaut): Warnhinweis.
- `content/kategorien.json` und wortgleich `src/lib/data/defaults/kategorien.ts` (nur `beschreibung`): Autoschlüssel als Produkte, Autoschlüsselgehäuse, Weitere Sicherheitstechnik.
- `src/app/(site)/shop/kategorie-weg.test.ts`: neuer Test, dass Beschreibungen nicht nur den Namen wiederholen und kein „Sie bestellen“ enthalten.
- `_werkstatt/ausbau/protokolle/roh/texte-auszug.txt`: neu erzeugt.
- Nicht geändert: `src/lib/codelinie.ts` (keine Lesefunktion nötig, `verfuegbarkeitVon` und `VERFUEGBARKEIT_LABEL` reichen), `linien-liste.tsx`, `artikel-liste.tsx`, `shop/page.tsx`, `kategorie-weg.ts`, `seo-laengen.test.ts`. Keine Preise, Staffelwerte, Versandarten, Steuer-, Widerrufs- oder Rechtshinweise, keine Knopftexte „Code anfragen“, „Artikel anfragen“, „Termin anfragen“, kein Suchtitel. Bestellprüfung, Warenkorb- und Kassenlogik unberührt.

## WAS UND WARUM
- **Drei Zustände an einer Stelle (Entscheidung 1).** `gruppenZustand(lines)` in `codelinie-texte.ts`: „lieferbar“ (mindestens ein Produkt lieferbar), „auf-anfrage“ (keins lieferbar, mindestens eins auf Anfrage), „nicht-lieferbar“ (alle nicht lieferbar). Eine leere Gruppe gilt als „auf-anfrage“, weil die Seite ohne Produkte in die Code-Anfrage führt (sonst hätte die leere Kategorieseite plötzlich „Derzeit nicht lieferbar“ gezeigt). `gruppenKopfzeile` liefert „Kategorie · Direkt kaufen“ / „… · Auf Anfrage“ / „… · Derzeit nicht lieferbar“ (Wörter aus `PROCESS_LABELS` und `VERFUEGBARKEIT_LABEL`). Kategorie- und Herstellerseite nehmen denselben Satz: Anfrage „Bestellen können Sie hier zurzeit nicht. Fragen Sie uns mit Ihrem Code an. Wir prüfen ihn und melden uns.“, nicht lieferbar „Diese Schlüssel können Sie zurzeit nicht bestellen.“ Die Suchbeschreibung sagt dasselbe; ohne Direktkauf steht der Zustandssatz in der Suchbeschreibung vor den übrigen Angaben, damit er in die 160 Zeichen passt. Lieferbare Suchbeschreibungen sind unverändert.
- **Übersicht (2, 3, 15).** Kopf Direktkauf nur mit lieferbarem Produkt, sonst „Auf Anfrage“, `GRUPPE_AUF_ANFRAGE`, Knopf „Schlüssel finden“ (Sprung zur Liste). Leerzustand sagt nur, was heute gilt.
- **Artikelübersicht (4).** Bedingung „mindestens ein Artikel bestellbar“ = `istBestellbar` (kein Beispiel, lieferbar), dieselbe Funktion, die Warenkorb und Server nutzen. `LEAD_OHNE_ARTIKEL` gilt jetzt für alle Fälle ohne bestellbaren Artikel, auch ohne Artikel.
- **Produktseite (6, 7, 8, 9, 11, 12).**
  - „auf Anfrage“: Kasten „Diesen Schlüssel können Sie nicht in den Warenkorb legen. Über „Code anfragen“ prüfen wir Ihren Code und melden uns mit einem Angebot.“ Die Einleitung trägt den zweiten Satz wortgleich (Konstante `ANFRAGE_WEG`), die Beschreibung nicht mehr.
  - „nicht lieferbar“: Einleitung „Diesen Möbelschlüssel für Büroschrank und Rollcontainer können Sie zurzeit nicht bestellen.“, Beschreibung ohne Fertigung und ohne den Satz, Kasten „Diesen Schlüssel können Sie zurzeit nicht bestellen. Vielleicht passt ein anderer Schlüssel aus der Übersicht. Oder Sie fragen Ihren Code bei uns an.“ mit Knopf zur Übersicht und Link „Code anfragen“. Die Seite bietet „Code anfragen“ in diesem Zustand schon unten in „Weitere passende Seiten“ an; der Kasten nennt es darum und verlinkt es direkt. Suchbeschreibung: „…, derzeit nicht lieferbar. Fragen Sie Ihren Code bei uns an.“ (ohne Original-Zusage).
  - Original höchstens zweimal: Plakette und ein Satz (lieferbar in der Einleitung, auf Anfrage in der Beschreibung, nicht lieferbar nur die Plakette).
  - „Anwendungsfamilie“ und „Familie“ sind aus dem sichtbaren Text verschwunden: Satz „Er gehört zur Anwendungsfamilie …“ entfällt, Zeile „Einsatzbereich“, Augenbraue „Gleicher Einsatzbereich“, Filter „Einsatzbereich“ mit dem vorgegebenen Erklärtext. Der erste Satz bleibt „Der Schlüssel MS-01 ist für … gedacht.“: Die Daten nennen die Anwendung im Nominativ („Büroschrank und Rollcontainer“), „passt zu Schlössern an …“ bräuchte den Dativ Plural („Büroschränken und Rollcontainern“), den die Daten nicht hergeben.
  - Angaben zum Schloss als Sätze, beim ersten Vorkommen (Beschreibung) erklärt: „Er gehört zu Schlössern von Musterwerk im System M 100 (so nennt der Hersteller sein Schließsystem). Der Codebereich ist 1 bis 999, in diesem Bereich liegt Ihr Code.“ In der Antwort „Für welche Schlösser …“ ohne Erklärung, mit „Vergleichen Sie das mit dem, was auf Ihrem Schloss oder Schlüssel steht.“
  - „Codeformat“ im Fließtext: „So sieht der Code aus: 3 bis 4 Ziffern, zum Beispiel 0812.“; als Bezeichnung (Plakette, Tabelle) „Aufbau des Codes“. Das Muster „Der Code … hat 3 bis 4 Ziffern“ aus Entscheidung 11 habe ich nicht genommen, weil viele Formate mit „1 Buchstabe, …“ beginnen („hat 1 Buchstabe“ ist falsch); „sieht so aus:“ passt auf alle 27 Formate der Daten.
  - Fundstelle: Der Hinweis der Linie ist bei allen Musterlinien der Startwert des Generators („Der Code steht meist direkt auf dem Schloss … Erwartetes Format: …“). Er erscheint jetzt nur, wenn der Ratgeber keinen Satz liefert, und ohne den Satzrest; ein im Backend gepflegter Hinweis erscheint immer (`codeHinweis`). Seite und Antwort lesen aus derselben Quelle.
- **Codesuche (10).** Plakette „Code hat die richtige Form“; Satz „Ihr Code 0812 hat die richtige Form für 3 Produkte. Das heißt noch nicht, dass der Schlüssel zu Ihrem Schloss passt. Vergleichen Sie Hersteller und System mit den Angaben auf Ihrem Schloss. Im Zweifel hilft Code anfragen.“ („Code anfragen“ ist der Link).
- **Warenkorb (5).** „Bitte entfernen Sie die betroffene Position. Brauchen Sie das Produkt trotzdem, schreiben Sie uns über das Kontaktformular.“ „Position“ bleibt, weil der Knopf „Position entfernen“ heißt.
- **Aufzählungen (13).** Kategorie-Einleitung reiht die Anwendungen nicht mehr. `aufzaehlung` nutzt „sowie“, wenn ein Wert selbst „und“ enthält (betrifft noch die Suchbeschreibung „Für …“ der Kategorieseite ohne Direktkauf und die Herstellerseite ohne System mit mehreren Einsatzbereichen). Andere `aufzaehlung`-Funktionen (`fahrzeug-texte.ts`, `auswahl.ts`, `preisbestaetigung.ts`) gehören nicht zu diesem Paket.
- **Liste (14).** Staffelhinweis wie auf der Produktseite. `linien-zeile.tsx` läuft auch im Browser; `codelinie-texte.ts` hat keine Server-Abhängigkeiten.
- **Herstellerseite (16).** Systeme nur in der Einleitung, „Es gibt Möbelschlüssel und Spindschlüssel.“, „Der Preis je Stück beträgt 8,00 €.“ bzw. „Die Preise je Stück liegen zwischen … und ….“ Gleiches auf der Kategorieseite, dazu „Es gibt …“ und „Die Schlösser sind von …“ statt Stichwortreihen. Beträge unverändert.
- **Kategorien auf `/shop` (17).** Siehe Tabelle L-34. Der Satz zum Werkstatttermin steht weiter in der Beschreibung „Autoschlüssel als Produkte“ und unten auf `/shop`.
- **Angepasste Testerwartungen (G8, keine gelockert):** `codelinie-texte.test.ts` „zeigt Hersteller …“ erwartet den neuen Satz statt „Hersteller ABUS, Profil …“; „auf Anfrage“ erwartet `ANFRAGE_WEG` statt „fragen Sie bei uns an“; „lieferbar“ erwartet die genaue neue Antwort statt „Bestellformular“ (strenger). `shop-seiten.test.tsx` erwartet „Code hat die richtige Form“ statt „passt zum Codeformat“ und zusätzlich den neuen Satz.

## TABELLE L-01 BIS L-35
| Befund | Ergebnis | Neuer Wortlaut oder Grund |
|---|---|---|
| L-01 | behoben | Einleitung „Diesen Möbelschlüssel für … können Sie zurzeit nicht bestellen.“; Beschreibung ohne „Wir fertigen“ und ohne den Satz; Kasten „Diesen Schlüssel können Sie zurzeit nicht bestellen. Vielleicht passt ein anderer Schlüssel aus der Übersicht. Oder Sie fragen Ihren Code bei uns an.“ plus Link „Code anfragen“; Suchbeschreibung „Fragen Sie Ihren Code bei uns an.“ |
| L-02 | behoben | Plakette „Code hat die richtige Form“; Satz siehe oben, mit „Code anfragen“ als Weg im Zweifel. Dazu im Bestellformular „Der Code hat die richtige Form.“ |
| L-03 | behoben | Satz entfällt; Tabelle „Einsatzbereich“; Augenbraue „Gleicher Einsatzbereich“; Verweis „Alle Produkte der Kategorie …“ bleibt „Kategorie“. |
| L-04 | behoben | „Er gehört zu Schlössern von Musterwerk im System M 100 (so nennt der Hersteller sein Schließsystem). Der Codebereich ist 1 bis 999, in diesem Bereich liegt Ihr Code.“ |
| L-05 | behoben | Kasten „Diesen Schlüssel können Sie nicht in den Warenkorb legen. Über „Code anfragen“ prüfen wir Ihren Code und melden uns mit einem Angebot.“; Einleitung trägt den zweiten Satz wortgleich, Beschreibung nicht. Den Preis nennt die Antwort „Was kostet …“ („Den Preis nennen wir Ihnen mit unserem Angebot …“). |
| L-06 | behoben | `GRUPPE_AUF_ANFRAGE` auf Kategorie- und Herstellerseite; „nicht lieferbar“ eigene Fassung (Entscheidung 1). Ohne den Original-Satz des Vorschlags (Entscheidung nennt ihn nicht, L-10). |
| L-07 | behoben | Produktseite „So sieht der Code aus: …“; Kategorieseite „Die Codes sehen je nach Produkt verschieden aus, etwa … oder …. Bei jedem Produkt steht, wie sein Code aussieht, mit einem Beispiel.“ bzw. „Bei allen Produkten sieht der Code so aus: ….“ Ohne Anführungszeichen. In Suchbeschreibungen steht „Codeformat:“ noch (kein Befund dort, Suchtexte nur wo verlangt). |
| L-08 | behoben | „Der Code für MS-01 sieht so aus: 3 bis 4 Ziffern, zum Beispiel 0812. Sieht Ihr Code anders aus, fragen Sie ihn bei uns an.“ |
| L-09 | anders gelöst | Kein doppelter Satz mehr in der Antwort, kein „Erwartetes Format“ (Startwert des Hinweises entfällt, wenn der Ratgeber einen Satz hat). Der Ratgebersatz selbst („Stirnseite“, „Schließzylinder“) kommt aus `content/guides.json`, außerhalb der Schreibrechte (OFFENE FRAGE 2). Abschnitt und Antwort lesen weiter dieselbe Quelle; die Antwort bleibt für die Strukturdaten vollständig. |
| L-10 | behoben | Plakette und ein Satz je Verfügbarkeit (lieferbar: Einleitung; auf Anfrage: Beschreibung; nicht lieferbar: nur Plakette). Test zählt. |
| L-11 | behoben | „6 Produkte für Möbel- und Büroschlösser. Bei jedem Produkt steht, wofür es gedacht ist.“ |
| L-12 | anders gelöst | Warnhinweis ohne den fehlenden Link (L-18). „Position“ bleibt in Zeile und Warnhinweis, weil der Knopf „Position entfernen“ heißt (Entscheidung 5). |
| L-13 | behoben | Kopfzeile „Kategorie · Derzeit nicht lieferbar“ / „Hersteller · Derzeit nicht lieferbar“, Einleitung `GRUPPE_NICHT_LIEFERBAR`, keine Prüfung versprochen. |
| L-14 | behoben | Kopf „Auf Anfrage“, `GRUPPE_AUF_ANFRAGE`, Knopf „Schlüssel finden“, wenn Produkte da sind, aber keins lieferbar ist. |
| L-15 | behoben | „Heute beginnt alles mit Ihrer Anfrage. Wir prüfen Ihren Code und melden uns mit einem Angebot oder einer Rückfrage.“ |
| L-16 | behoben | „Direkt bestellen können Sie hier derzeit nicht.“ / „Wir prüfen Ihren Code auf Anfrage. Nennen Sie uns …“ |
| L-17 | behoben | Kopf „Auf Anfrage“, `LEAD_OHNE_ARTIKEL`, Abschnitt „Öffnen Sie einen Artikel. Dort finden Sie Eigenschaften und Lieferumfang.“, wenn kein Artikel bestellbar ist. |
| L-18 | behoben | „Bitte entfernen Sie die betroffene Position. Brauchen Sie das Produkt trotzdem, schreiben Sie uns über das Kontaktformular.“ (Link) |
| L-19 | behoben | „Wir fertigen …“ nur bei lieferbar und auf Anfrage. |
| L-20 | behoben | `staffelStufen(line)[0]`, Test mit vier Fällen. |
| L-21 | behoben | „Für jeden Hersteller gibt es eine eigene Seite mit seinen Systemen und Codes.“ |
| L-22 | behoben | „Produkt/Produkte“. |
| L-23 | behoben | Einleitung ohne Reihe; `aufzaehlung` mit „sowie“. |
| L-24 | behoben | wie L-13, Suchbeschreibung „… Diese Schlüssel können Sie zurzeit nicht bestellen.“ |
| L-25 | behoben | wie L-11. |
| L-26 | anders gelöst | Satz mit „Anwendungsfamilie“ entfällt. „passt zu Schlössern an Büroschränken …“ geben die Daten grammatisch nicht her (Nominativ); es bleibt „ist für … gedacht“ (Entscheidung 8). |
| L-27 | behoben | Filter „Einsatzbereich“, Erklärung „Hier wählen Sie, wofür das Schloss ist, zum Beispiel Briefkasten oder Technikschrank. Das hilft, wenn Sie den Schlüsseltyp nicht kennen.“; Tabelle „Einsatzbereich“. Auswahl heißt weiter „Alle Anwendungen“. |
| L-28 | behoben | wie L-09: ein Satz, kein Satzrest. |
| L-29 | behoben | „MS-01 gehört zu Schlössern von Musterwerk im System M 100. Ihr Code liegt im Codebereich 1 bis 999. Vergleichen Sie das mit dem, was auf Ihrem Schloss oder Schlüssel steht.“ |
| L-30 | behoben | wie L-08; keine Antwort nennt ein Formular. |
| L-31 | behoben | Absatz „Es gibt Möbelschlüssel und Spindschlüssel. Der Preis je Stück beträgt 8,00 €.“, Systeme nur in der Einleitung. |
| L-32 | behoben | wie L-22. |
| L-33 | behoben | wie L-21. |
| L-34 | behoben | „Autoschlüssel als Produkte: Hier geht es um den Autoschlüssel selbst, ohne Termin in der Werkstatt. Einen Termin in der Werkstatt fragen Sie getrennt an.“; „Autoschlüsselgehäuse: Ein neues Gehäuse für Ihren Funkschlüssel. Die Elektronik bleibt.“ (belegt durch die Beschreibung von `/autoschluessel/gehaeuse`); „Weitere Sicherheitstechnik: Technik für Einbruchschutz, Überwachung und Alarmierung.“ (belegt durch die Unterzeile von `/sicherheitstechnik`). JSON und Rückfall wortgleich (Test `shop.test.ts`). |
| L-35 | behoben | wie L-01; Kernaussage steht zuerst, mit Verb. |

Gegengelesen im neuen Auszug in allen drei Verfügbarkeiten: kein „Anwendungsfamilie“, „Familie“, „Bestellformular“, „Prägung“, „Angaben zum Schloss:“, „Erwartetes Format“ im Text; „Codeformat“ nur noch in Suchbeschreibungen lieferbar/auf Anfrage. Kein Satz über 25 Wörter in den neuen Sätzen.

## PRÜFUNG UND ERGEBNIS
Alles über `_werkstatt/ausbau/werkzeuge/sicher.sh --json`, nach der letzten Änderung:
- `npx vitest run`: 225 Testdateien, 3528 Tests bestanden. Ein früherer Lauf hatte 5 rote Tests in fremden Dateien (`versand.test.ts`, `security.test.ts` Einsendung, `formulare-bedienbarkeit.test.ts`), dazu Typfehler in `versand.test.ts`; das waren gleichzeitige Arbeiten eines anderen Pakets. Im Wiederholungslauf grün.
- `npm run typecheck`: ohne Fehler.
- `npm run lint`: ohne Fehler.
- Auszug neu erzeugt: `npx vitest run --dir _werkstatt/ausbau/protokolle/roh texte-auszug` (1 Test bestanden), `protokolle/roh/texte-auszug.txt`.

## OFFENE FRAGEN
1. **Rechtshinweis „Anfertigung nach Ihrer Codeangabe“ bei „nicht lieferbar“.** Der Kasten auf der Produktseite sagt in jeder Verfügbarkeit „Dieser Schlüssel wird eigens für Sie nach dem Code gefertigt …“ und nennt den Ausschluss des Widerrufs. Das widerspricht Entscheidung 6 (keine Fertigungssätze bei „nicht lieferbar“), ist aber ein Widerrufshinweis (G9, R10). Soll der Kasten bei „nicht lieferbar“ (und „auf Anfrage“) entfallen oder umformuliert werden? Entscheidung des Inhabers.
2. **Ratgebersatz zur Fundstelle** (`content/guides.json`, Ratgeber „schluesselcode-finden“): „Stirnseite“ und „Schließzylinder“ ohne Erklärung, und „häufig“. Außerhalb der Schreibrechte. Vorschlag: „… steht der Code häufig auf der Stirnseite des Schlosses (der Vorderseite) oder auf dem Schließzylinder.“
3. **Browserprüfung `werkzeuge/funktionsliste.mjs` Z. 1083–1084** sucht noch die Plakette „passt zum Codeformat“. Neu heißt sie „Code hat die richtige Form“. Außerhalb meiner Schreibrechte; der Orchestrator sollte die Zeile anpassen, sonst meldet die Funktionsliste einen falschen Fehler.
4. **Übersicht ohne lieferbares Produkt, aber mit Produkten:** Suchbeschreibung (`page.seo.description` bzw. Rückfall „Code eingeben, Stückzahl wählen, bestellen …“) und der Ablauf aus den Rubrikdaten („Vom Code zum fertigen Schlüssel“) beschreiben weiter den Direktkauf. Kein Befund verlangte die Suchbeschreibung; Rubrikdaten gehören nicht zu diesem Paket.
5. **Einleitung „nicht lieferbar“** lautet „Diesen Möbelschlüssel für … können Sie zurzeit nicht bestellen.“, nicht wortgleich „Diesen Schlüssel …“, weil sie sonst ohne Bezug auf das Produkt stünde. Der Kasten sagt wortgleich „Diesen Schlüssel können Sie zurzeit nicht bestellen.“ Bitte bestätigen.
6. **Artikel „auf Anfrage“:** Der Kasten ist für Schlüssel und Artikel gemeinsam. Für Artikel lautet er jetzt „Diesen Artikel können Sie nicht in den Warenkorb legen. Bitte fragen Sie ihn bei uns an. Wir prüfen Ihre Angaben und melden uns.“ (vorher „bestellen Sie nicht direkt“, gleiche Mehrdeutigkeit wie L-05). Ein „Angebot“ verspreche ich bei Artikeln nicht, weil es nicht belegt ist.
7. **Datenbank:** Kategorien, die schon in einer Datenbank stehen, behalten die alten Beschreibungen, bis jemand sie im Backend ändert oder der Seed sie überschreibt (wie 03H, OFFENE FRAGE 6).

## FÜR MENSCHEN
- Inhaber: Entscheidung zu OFFENE FRAGE 1 (Widerrufskasten bei nicht bestellbaren Schlüsseln).
- Schlussredaktion (Mensch mit Fachwissen): die erklärenden Halbsätze „(so nennt der Hersteller sein Schließsystem)“ und „Der Codebereich ist …, in diesem Bereich liegt Ihr Code.“; die Kategorienbeschreibungen „Hier geht es um den Autoschlüssel selbst, ohne Termin in der Werkstatt.“ und „Ein neues Gehäuse für Ihren Funkschlüssel. Die Elektronik bleibt.“; die Plakette „Code hat die richtige Form“ im Shop und im Bestellformular.
- Orchestrator: `werkzeuge/funktionsliste.mjs` an die neue Plakette anpassen (OFFENE FRAGE 3); Ratgebersatz (OFFENE FRAGE 2) in ein Paket mit Schreibrecht auf `content/guides.json`.

## Nachbesserung (Gegenprüfung, 13 Befunde)
Geänderte Dateien zusätzlich: `src/app/(site)/schluessel-nach-code/page.tsx`, `page.test.tsx`, neu `[slug]/page.test.tsx`, `[slug]/bestell-formular.tsx` (nur Wortlaut), `src/app/(site)/artikel/page.tsx`, `artikel/page.test.tsx`, `src/lib/codelinie-texte.ts`, `content/kategorien.json`, `src/lib/data/defaults/kategorien.ts`.

| Nr. | Ergebnis | Begründung und neuer Wortlaut |
|---|---|---|
| 1 | behoben | Ablauf, Unterzeile und Aktion hängen an `direktkauf`, nicht an `ohneProdukte`. Ohne lieferbares Produkt (leer oder Mischzustand) zeigt der Abschnitt „Vom Code zur Anfrage“ mit der Unterzeile aus Entscheidung 3, Knopf „Code anfragen“ und eigenen Schritten: „Code finden“ (aus den Rubrikdaten), „Code anfragen: Sie nennen uns Hersteller oder Schloss, den Code und die Stückzahl. Sie bestätigen, dass Sie den Schlüssel nachmachen lassen dürfen.“ (R13, wie der Leerzustand), „Angebot oder Rückfrage: Wir prüfen Ihren Code. Mit unserem Angebot entscheiden Sie, ob Sie bestellen.“ Die Kaufschritte aus `content/rubriken.json` erscheinen nur beim Direktkauf. Tests: kein „Stückzahl wählen, bezahlen“ in drei Zuständen ohne Direktkauf; Kaufablauf mit lieferbarem Produkt. |
| 2 | behoben | Formularkopf nur noch „Wir fertigen nur nach dem Code, den Sie hier eintragen.“ Neuer Test `[slug]/page.test.tsx` rendert die ganze Produktseite samt Formular in allen drei Verfügbarkeiten und zählt „Originalschlüssel“ im sichtbaren Text (≤ 2); mit dem alten Satz schlägt er fehl (gegengeprüft). |
| 3 | nicht behoben (außerhalb der Schreibrechte) | Trifft zu. `werkzeuge/funktionsliste.mjs` liegt nicht in den Schreibrechten; der Orchestrator ändert Z. 1083 auf `hasText: 'Code hat die richtige Form'` und den Prüftext in Z. 1084, im selben Commit wie die Plakette. |
| 4 | behoben | Ohne bestellbaren Artikel steht unter der Abschnittsunterzeile der Knopf „Artikel anfragen“ auf `artikelAnfragePfad('Schließtechnik und Zubehör')`. Test: bei nur Beispielen, nur „auf Anfrage“/„nicht lieferbar“ und gemischt ist der Link da; mit bestellbarem Artikel nicht. |
| 5 | behoben (Freigabe Orchestrator) | `generateMetadata` und Strukturdaten nehmen `OHNE_PRODUKTE_SEO` (Titel „Schlüssel nach Code anfragen“, Beschreibung 156 Zeichen) immer, wenn kein Produkt lieferbar ist, auch im Mischzustand. Achtung: Damit ändert sich im Mischzustand auch der Suchtitel; das Paket sagt „Suchtitel bleiben“. Bitte bestätigen oder auf „nur Beschreibung“ zurückstellen (OFFENE FRAGE 8). Test prüft Titel, Inhalt und Länge 120 bis 160. |
| 6 | behoben | Ohne bestellbaren Artikel: „Artikel rund um Schlüssel, Schloss und Tür. Zurzeit fragen Sie Artikel bei uns an. Wir beraten Sie und sagen Ihnen, was zu Ihrem Schloss passt.“ (143 Zeichen) in Metadaten und Strukturdaten; eine gepflegte Beschreibung gilt nur beim Direktkauf. Test mit Länge. |
| 7 | behoben | „Dieser Code hat nicht die richtige Form. So sieht der Code aus: … (zum Beispiel …). Bitte prüfen Sie Ihre Eingabe. …“ Keine Testerwartung band den alten Satz. |
| 8 | behoben | Autoschlüsselgehäuse: „Nur das Gehäuse für Ihren Funkschlüssel, ohne Elektronik. Den Preis nennen wir Ihnen nach Ihrer Anfrage.“ (belegt durch die Rubrik-Erklärung). Gehäuseumbau: „Die Arbeit übernehmen wir: Wir setzen die Elektronik Ihres Autoschlüssels in ein neues Gehäuse oder reparieren den Schlüssel.“ JSON und Rückfall wortgleich (Test `shop.test.ts` grün). |
| 9 | behoben | Suchbeschreibungen der Produktseite in allen drei Verfügbarkeiten „Aufbau des Codes: …, z. B. ….“; `seo-laengen.test.ts` grün (505 Tests), im Auszug kein „Codeformat“ mehr. |
| 10 | nicht behoben (außerhalb der Schreibrechte) | Gleicher Befund wie 3; Anpassung durch den Orchestrator. |
| 11 | nicht behoben (offene Stelle) | Trifft zu: Das Info-Feld zeigt `line.codeHint` mit „Erwartetes Format: …“. Den bereinigten Hinweis als Prop zu übergeben ist Logik in `bestell-formular.tsx` und `page.tsx`; dieses Paket darf im Formular nur sichtbaren Wortlaut ändern. Gehört in ein Paket mit Logikrecht (`codeHinweis` aus `codelinienTexte` als Prop). |
| 12 | behoben | Gleicher Befund wie 5, dort umgesetzt. |
| 13 | behoben | `faq: { question: string; answer: string }[];` |

Prüfung nach der Nachbesserung, alles über `sicher.sh --json`: `npx vitest run` 226 Testdateien, 3541 Tests bestanden; `npm run typecheck` ohne Fehler; `npm run lint` ohne Fehler; Auszug neu erzeugt (1 Test bestanden). Keine Prüfung gelockert.

OFFENE FRAGE 8 (neu): Suchtitel der Übersicht im Mischzustand „Schlüssel nach Code anfragen“ statt des gepflegten Titels (Befund 5/12). Freigabe oder Rückstellung durch den Orchestrator.
OFFENE FRAGE 3 und 4 sind mit der Nachbesserung erledigt bzw. an den Orchestrator übergeben (3: funktionsliste.mjs; 4: Suchbeschreibung und Ablauf umgesetzt).

=== ENDE FA-INHALT-03I · BEREIT ZUR RÜCKGABE ===
