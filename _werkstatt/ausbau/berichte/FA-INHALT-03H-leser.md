# FA-INHALT-03H · Gegenlesen der neuen Shopseiten durch drei unabhängige Leser (16.11.2026)

Die drei Leser haben nur gelesen: den Auszug der erzeugten Texte in den Verfügbarkeiten lieferbar, auf Anfrage und nicht lieferbar (`protokolle/roh/texte-auszug.txt`, erzeugt aus den Musterdaten mit erfundenen Herstellern) und den sichtbaren Wortlaut der Seiten. Was daraus wird, steht in `pakete/FA-INHALT-03I.md` und `berichte/FA-INHALT-03I.md`.

## None

Als 72-jährige Kundin verstehe ich die Fassung „lieferbar“ im Großen und Ganzen. Ich stocke aber an den Wörtern „Anwendungsfamilie“, „System“, „Codebereich“ und „Codeformat“. Keines davon wird mir in einem Halbsatz erklärt, obwohl FA-INHALT-03 Regel 2 das verlangt. Bei „auf Anfrage“ verstehe ich, dass ich anfragen soll. Derselbe Satz steht aber dreimal, und „nicht direkt“ lässt offen, ob ich nicht doch irgendwie bestellen kann. Bei „nicht lieferbar“ verstehe ich zwar, dass ich nicht bestellen kann, aber nicht, was ich stattdessen tun soll. Der Kasten bietet nur die Übersicht an. Gleichzeitig sagt die Beschreibung „Wir fertigen den Möbelschlüssel nur nach Ihrem Code“ und die Einleitung „gefertigt nach dem Code Ihres Schlosses“. Beides passt nicht zu einem Schlüssel, den es zurzeit nicht gibt. Gefährlich finde ich die Plakette „passt zum Codeformat“ in der Codesuche. Ich würde sie als „passt“ lesen und vielleicht einen Schlüssel bestellen, der nicht zu meinem Schloss passt und nicht widerrufbar ist. Dazu kommen Wiederholungen: dass das Original bei mir bleibt, steht dreimal, die Fundstelle des Codes zweimal. Die Kategorie-Einleitung reiht so viele „und“ aneinander, dass ich sie nicht mehr lesen kann. Preise, Rechtshinweise, Knopftexte und Testwerte habe ich nicht beanstandet.

### L-01 · rot · src/lib/codelinie-texte.ts Z. 301-302, 320, 326 und schluessel-nach-code/verfuegbarkeit-hinweis.tsx Z. 34 (Auszug: nicht-lieferbar, PRODUKTSEITE ms-01, Einleitung, beschreibung und Kasten)

- Zitat: Möbelschlüssel für Büroschrank und Rollcontainer, gefertigt nach dem Code Ihres Schlosses (3 bis 4 Ziffern). Diesen Schlüssel können Sie zurzeit nicht bestellen. / Wir fertigen den Möbelschlüssel nur nach Ihrem Code. Ihren Originalschlüssel müssen Sie nicht einschicken. / Diesen Schlüssel können Sie zurzeit nicht bestellen.
- Warum: „gefertigt“ und „Wir fertigen“ versprechen eine Anfertigung, die es zurzeit nicht gibt. Der Satz „Diesen Schlüssel können Sie zurzeit nicht bestellen.“ steht dreimal: in der Einleitung, in der Beschreibung und im Kasten. Nirgends steht, was ich jetzt tun soll. Der Kasten zeigt nur den Knopf zur Übersicht. Die Suchbeschreibung derselben Fassung lädt dagegen ausdrücklich ein: „Fragen Sie gern nach einem anderen Schlüssel.“
- Vorschlag: Einleitung: „Möbelschlüssel für Büroschrank und Rollcontainer, nach dem Code Ihres Schlosses (3 bis 4 Ziffern). Diesen Schlüssel können Sie zurzeit nicht bestellen.“ Beschreibung: den Satz „Wir fertigen den Möbelschlüssel nur nach Ihrem Code.“ in dieser Fassung weglassen und am Ende statt des wiederholten Satzes schreiben: „Fragen Sie uns gern nach einem anderen Schlüssel für Ihr Schloss.“ Kasten: „Diesen Schlüssel können Sie zurzeit nicht bestellen. Vielleicht passt ein anderer Schlüssel nach Code zu Ihrem Schloss. Die Übersicht zeigt alle.“

### L-02 · rot · src/app/(site)/schluessel-nach-code/shop-liste.tsx Z. 313-315 und Z. 425 (Codesuche in der Liste)

- Zitat: Ihr Code 0812 passt zum Codeformat von 3 Produkten. Welches davon zu Ihrem Schloss gehört, erkennen Sie an Hersteller und System. / passt zum Codeformat
- Warum: Die grüne Plakette „passt zum Codeformat“ lese ich als „passt“. Ich bestelle dann womöglich einen Schlüssel, der nur die richtige Ziffernzahl hat, aber nicht zu meinem Schloss gehört. Er wird nach meinem Code gefertigt und ist vom Widerruf ausgeschlossen. „System“ kenne ich nicht, darum hilft mir der zweite Satz nicht weiter.
- Vorschlag: Plakette: „Code hat die richtige Form“. Satz: „Ihr Code 0812 hat die richtige Form für 3 Produkte. Das heißt noch nicht, dass der Schlüssel zu Ihrem Schloss passt. Vergleichen Sie den Hersteller und den Namen des Schließsystems mit den Angaben auf Ihrem Schloss. Passt keines sicher, fragen Sie den Code an.“

### L-03 · rot · src/lib/codelinie-texte.ts Z. 315 und schluessel-nach-code/[slug]/page.tsx Z. 141 und Z. 404 (alle drei Fassungen, beschreibung)

- Zitat: Er gehört zur Anwendungsfamilie „Möbel- und Büroschlösser“.
- Warum: „Anwendungsfamilie“ kenne ich nicht, und es wird nirgends auf der Produktseite erklärt. Dasselbe Wort steht noch einmal als Zeile in den technischen Angaben, dazu als Augenbraue „Gleiche Familie“. Auf der Seite heißt dieselbe Gruppe außerdem „Kategorie“ (Verweis „Alle Produkte der Kategorie …“). Für mich sind das drei Wörter für eine Sache.
- Vorschlag: „Sie finden ihn in der Kategorie „Möbel- und Büroschlösser“.“ In den technischen Angaben die Zeile „Kategorie“ statt „Anwendungsfamilie“, als Augenbraue „Gleiche Kategorie“ statt „Gleiche Familie“.

### L-04 · gelb · src/lib/codelinie-texte.ts Z. 319 und Z. 379 (alle drei Fassungen, beschreibung und Frage „Für welche Schlösser ist MS-01 gedacht?“)

- Zitat: Angaben zum Schloss: Hersteller Musterwerk, System M 100, Codebereich 1 bis 999. Im Zweifel vergleichen Sie diese mit der Prägung an Schloss oder Schlüssel.
- Warum: „System“ und „Codebereich“ werden nicht erklärt. Ich weiß nicht, ob „Codebereich 1 bis 999“ heißt, dass mein Code in diesem Bereich liegen muss. „diese“ bezieht sich auf eine Aufzählung im Satz davor, und „Prägung“ ist für mich ein ungewohntes Wort.
- Vorschlag: „Zu diesem Schlüssel gehören diese Angaben: Hersteller Musterwerk, Schließsystem M 100. Ihr Code liegt zwischen 1 und 999. Vergleichen Sie diese Angaben mit dem, was auf Ihrem Schloss oder Schlüssel eingeprägt ist.“

### L-05 · gelb · schluessel-nach-code/verfuegbarkeit-hinweis.tsx Z. 33 und src/lib/codelinie-texte.ts Z. 299-300, 325 (Auszug: auf-anfrage, Einleitung, beschreibung und Kasten)

- Zitat: Diesen Schlüssel bestellen Sie nicht direkt. Bitte fragen Sie bei uns an. Wir prüfen Ihre Angaben und melden uns.
- Warum: Bei „nicht direkt“ frage ich mich, ob ich doch irgendwie bestellen kann, etwa über den Warenkorb. Dieselbe Aussage steht dreimal, in Einleitung, Beschreibung und Kasten, jedes Mal etwas anders („Ihren Code“, „den Code“, „Ihre Angaben“). Der Kasten nennt den Knopf nicht, auf den ich drücken soll, und nicht, dass ich erst mit dem Angebot den Preis erfahre.
- Vorschlag: Kasten: „Diesen Schlüssel können Sie nicht in den Warenkorb legen. Klicken Sie auf „Code anfragen“. Wir prüfen Ihren Code und melden uns mit einem Angebot und dem Preis.“ In der Beschreibung dann nur noch: „Diesen Schlüssel fragen Sie bei uns an.“

### L-06 · gelb · src/lib/codelinie-texte.ts Z. 476-480 und Z. 537-539 (Auszug: Kategorie- und Herstellerseite, auf-anfrage und nicht-lieferbar, einleitung)

- Zitat: Sie nennen den Code in einer Anfrage, wir prüfen ihn und melden uns. / Sie nennen den Code in einer Anfrage. Ihren Originalschlüssel behalten Sie.
- Warum: „Sie nennen den Code in einer Anfrage“ klingt nach Amt. Es sagt mir nicht klar, dass ich hier nicht bestellen kann. Auf der Herstellerseite fehlt außerdem, was danach passiert. Dieselbe Einleitung steht auch dann, wenn alle Produkte „nicht lieferbar“ sind. Die Produktseite bietet dann aber keine Anfrage an, und die Augenbraue „Auf Anfrage“ widerspricht dem „Derzeit nicht lieferbar“ der Produkte.
- Vorschlag: „Bestellen können Sie hier zurzeit nicht. Fragen Sie uns mit Ihrem Code an. Wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.“ Dieser Wortlaut gilt für Kategorie- und Herstellerseite gleich.

### L-07 · gelb · src/lib/codelinie-texte.ts Z. 321 und Z. 488 (Produktseite alle Fassungen, Kategorieseite absaetze)

- Zitat: Das Codeformat lautet „3 bis 4 Ziffern“, zum Beispiel 0812. / Die Codeformate sind verschieden, etwa „3 bis 4 Ziffern“ oder „2 Buchstaben, dann 3 Ziffern“. Bei jedem Produkt steht sein Format mit einem Beispiel.
- Warum: „Codeformat“ ist ein Fachwort ohne Erklärung. Gemeint ist schlicht, wie mein Code aussieht. Durch die Anführungszeichen wirkt die Angabe wie ein Zitat, nicht wie ein Teil des Satzes.
- Vorschlag: Produktseite: „Ihr Code sieht so aus: 3 bis 4 Ziffern, zum Beispiel 0812.“ Kategorieseite: „Die Codes sehen je nach Schloss verschieden aus, etwa 3 bis 4 Ziffern oder 2 Buchstaben, dann 3 Ziffern. Bei jedem Produkt steht, wie sein Code aussieht, mit einem Beispiel.“

### L-08 · gelb · src/lib/codelinie-texte.ts Z. 337-338 (Auszug: lieferbar, Frage „Wie sieht ein gültiger Code für MS-01 aus?“)

- Zitat: Für MS-01 erwartet das Bestellformular: 3 bis 4 Ziffern, zum Beispiel 0812. Eine Eingabe in einem anderen Format nimmt es nicht an.
- Warum: Hier spricht das Formular und nicht der Mensch. „Erwartet“, „Eingabe“ und „nimmt es nicht an“ klingen nach Computer. Ich will wissen, wie mein Code aussieht, und was passiert, wenn meiner anders aussieht.
- Vorschlag: „Der Code für MS-01 hat 3 bis 4 Ziffern, zum Beispiel 0812. Sieht Ihr Code anders aus, können Sie ihn hier nicht eingeben. Fragen Sie den Code dann bei uns an.“

### L-09 · gelb · src/lib/codelinie-texte.ts Z. 343-345 und [slug]/page.tsx Z. 309-310 (alle Fassungen, Abschnitt „Wo steht der Code?“ und Frage „Wo steht der Code bei Büroschrank und Rollcontainer?“)

- Zitat: Bei Möbel-, Spind- und Briefkastenschlössern steht der Code häufig auf der Stirnseite des Schlosses oder auf dem Schließzylinder. Der Code steht meist direkt auf dem Schloss oder auf dem Schlüsselkopf. Erwartetes Format: 3 bis 4 Ziffern.
- Warum: Dieselben Sätze stehen zweimal auf der Seite: oben unter „Wo steht der Code?“ und unten in den Fragen. Innerhalb der Antwort steht zweimal fast dasselbe („häufig auf … dem Schloss“, „meist direkt auf dem Schloss“). „Stirnseite“ und „Schließzylinder“ kenne ich nicht, und „Erwartetes Format“ ist ein Satzfetzen.
- Vorschlag: In der Frage nur noch: „Schauen Sie vorn auf das Schloss, rund um das Schlüsselloch, oder auf den Kopf Ihres Schlüssels. Der Code hat 3 bis 4 Ziffern.“ Oben unter „Wo steht der Code?“ bleibt der Satz einmal stehen, mit „Stirnseite (die Vorderseite des Schlosses)“.

### L-10 · gelb · [slug]/page.tsx Z. 263 und src/lib/codelinie-texte.ts Z. 297, 300, 320 (Auszug: lieferbar und auf-anfrage, Einleitung und beschreibung)

- Zitat: Ohne Einsendung des Originalschlüssels / Ihr Originalschlüssel bleibt bei Ihnen. / Ihren Originalschlüssel müssen Sie nicht einschicken.
- Warum: Dass ich mein Original behalte, lese ich auf einer Seite dreimal hintereinander: als Plakette, in der Einleitung und in der Beschreibung. Beim dritten Mal frage ich mich, ob ich etwas übersehen habe.
- Vorschlag: In der Beschreibung nur noch: „Wir fertigen den Möbelschlüssel nur nach Ihrem Code.“ Plakette und Einleitung bleiben.

### L-11 · gelb · src/lib/codelinie-texte.ts Z. 477 (Auszug: KATEGORIESEITE „Möbel- und Büroschlösser“, einleitung, alle Fassungen)

- Zitat: 6 Produkte für Büroschrank und Rollcontainer, Schreibtisch und Sideboard, Aktenschrank und Registratur, Vitrine und Glasschrank, Küchenmöbel und Einbauschrank und Werkstattschrank und Werkbank.
- Warum: Am Ende stehen drei „und“ hintereinander. Ich kann nicht mehr erkennen, welche Möbel zusammengehören, und muss den Satz zweimal lesen.
- Vorschlag: „6 Produkte für diese Möbel: Büroschrank und Rollcontainer, Schreibtisch und Sideboard, Aktenschrank und Registratur, Vitrine und Glasschrank, Küchenmöbel und Einbauschrank sowie Werkstattschrank und Werkbank.“

### L-12 · gelb · src/app/(site)/warenkorb/warenkorb-ansicht.tsx Z. 91 und Z. 221-222 (Warenkorb, nicht lieferbar)

- Zitat: Derzeit nicht lieferbar. Bitte entfernen Sie die Position. / Bitte entfernen Sie die betroffene Position. Brauchen Sie das Produkt trotzdem, fragen Sie es bei uns an. Nutzen Sie dazu den Link an der Position oder unser Kontaktformular.
- Warum: „Position“ ist ein Wort aus der Buchhaltung. Ich weiß nicht sofort, dass mein Schlüssel gemeint ist und wie ich ihn entferne. Bei „nicht lieferbar“ steht an der Position kein Link, also sucht man den genannten Link vergeblich.
- Vorschlag: An der Zeile: „Derzeit nicht lieferbar. Bitte nehmen Sie ihn mit „Position entfernen“ aus dem Warenkorb.“ Warnhinweis: „Bitte nehmen Sie diese Position aus dem Warenkorb. Brauchen Sie sie trotzdem, fragen Sie uns. Bei „Auf Anfrage“ steht der Link direkt darunter, sonst nutzen Sie unser Kontaktformular.“

## None

Ich habe 11 Befunde gefunden, 6 davon rot. Die Texte der einzelnen Produktseite passen in allen drei Verfügbarkeiten. In den Fassungen „auf Anfrage“ und „nicht lieferbar“ nennt kein Satz einen Preis, eine Staffel oder eine Lieferzeit. Auch das Bestellformular wird dort nicht erwähnt. Fragen und Antworten passen ebenfalls.

Die Fehler liegen vor allem in den Bedingungen der Sammelseiten. Kategorie- und Herstellerseite unterscheiden nur „lieferbar“ und „nicht lieferbar“. Ist alles nicht lieferbar, zeigen sie die Anfrage-Fassung und die Augenbraue „Auf Anfrage“. Die Übersicht „Schlüssel nach Code“ und die Artikelübersicht fragen nur, ob es überhaupt Produkte gibt. Sie zeigen deshalb Direktkauf, auch wenn nichts bestellbar ist.

Im heutigen Zustand ohne Produkte kündigt „Schlüssel nach Code“ mit „noch nicht“, „bis dahin“ und „sobald“ einen künftigen Direktkauf an. Im Warenkorb verweist der Warnhinweis auf einen Link an der Position, den es bei nicht lieferbaren Positionen nicht gibt. Dazu kommen kleinere Punkte: ein Staffelhinweis in der Liste ohne die Prüfung der Produktseite, das Wort „Linien“ und eine Aufzählung mit drei „und“ hintereinander.

Die Herstellerseite „Musterwerk“ im Auszug nennt die Systeme „M 100 und T 7“. T 7 gehört zu Testbau. Das ist kein Fehler der Seite: Das Skript, das den Auszug erzeugt, übergibt beide Musterprodukte unter Musterwerk (texte-auszug.test.ts:48).

### L-13 · rot · src/lib/codelinie-texte.ts:476-480 und 532-539 (Einleitung), kategorie/[kategorie]/page.tsx:94 und hersteller/[hersteller]/page.tsx:76 (Augenbraue); Auszug Zeile 480 und 491

- Zitat: Sie nennen den Code in einer Anfrage, wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.
- Warum: Die Bedingung kennt nur lieferbar oder nicht (gruppeLieferbar). Sind alle Produkte der Kategorie oder des Herstellers „nicht lieferbar“, zeigt die Seite trotzdem die Anfrage-Fassung und die Augenbraue „Kategorie · Auf Anfrage“ bzw. „Hersteller · Auf Anfrage“. Jedes Produkt darunter sagt aber „Derzeit nicht lieferbar“ und „Diesen Schlüssel können Sie zurzeit nicht bestellen“. Die Seite widerspricht sich und verspricht eine Anfrage mit Angebot, die es für diese Produkte nicht gibt.
- Vorschlag: Wenn kein Produkt lieferbar und keines auf Anfrage ist: Augenbraue „Kategorie · Derzeit nicht lieferbar“ (bzw. „Hersteller · Derzeit nicht lieferbar“). Einleitung: „6 Produkte für Büroschrank, Schreibtisch und weitere Möbel. Diese Schlüssel können Sie zurzeit nicht bestellen. Ihr Originalschlüssel bleibt bei Ihnen.“

### L-14 · rot · src/app/(site)/schluessel-nach-code/page.tsx:140, 145, 156 (Bedingung ohneProdukte = lines.length === 0, Zeile 122)

- Zitat: Code eingeben, Stückzahl wählen, bestellen.
- Warum: Die Übersicht prüft nur, ob es überhaupt Produkte gibt, nicht ob eines lieferbar ist. Sind alle Produkte „auf Anfrage“ oder „nicht lieferbar“, zeigt der Kopf die Augenbraue Direktkauf, diesen Satz und den Knopf „Nach Code bestellen“. Ein Direktkauf ist dann nicht möglich; die Zeilen darunter zeigen keinen Preis.
- Vorschlag: Wenn kein Produkt lieferbar ist: Augenbraue „Auf Anfrage“, Unterzeile „Sie nennen uns den Code Ihres Schlosses, wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen.“, Knopf „Schlüssel finden“.

### L-15 · rot · src/app/(site)/schluessel-nach-code/page.tsx:325 (Leerzustand ohne Produkte)

- Zitat: So läuft es, sobald Sie hier direkt nach Code bestellen können. Bis dahin beginnt alles mit Ihrer Anfrage.
- Warum: „sobald“ und „bis dahin“ versprechen, dass der Direktkauf kommt. Das ist dieselbe Zusage, die der Autor beim Hinweis „bald“ zu Recht gestrichen hat (R4). Heute gibt es keine Produkte.
- Vorschlag: Heute beginnt alles mit Ihrer Anfrage. Wir prüfen Ihren Code und melden uns mit einem Angebot oder einer Rückfrage.

### L-16 · gelb · src/app/(site)/schluessel-nach-code/page.tsx:210-212 (Leerzustand ohne Produkte)

- Zitat: Direkt bestellen können Sie hier noch nicht. Bis dahin prüfen wir Ihren Code auf Anfrage.
- Warum: „noch nicht“ und „Bis dahin“ kündigen einen künftigen Direktkauf an. Der gleiche Hinweis heißt sonst überall „derzeit nicht“ (HINWEIS_PRODUKTE_FOLGEN). Die Seite soll nur sagen, was heute gilt.
- Vorschlag: Direkt bestellen können Sie hier derzeit nicht. Wir prüfen Ihren Code auf Anfrage.

### L-17 · rot · src/app/(site)/artikel/page.tsx:25, 146-148, 164-165 gegen 124-128

- Zitat: Artikel rund um Schlüssel, Schloss und Tür zum direkten Bestellen.
- Warum: Die Bedingung ist nur articles.length > 0. Gibt es nur Beispielartikel oder nur Artikel „auf Anfrage“ bzw. „nicht lieferbar“, sagen Augenbraue (Direktkauf), Unterzeile und Abschnitt („… und wählen die Stückzahl“) Direktkauf. Auf derselben Seite steht dann „Derzeit nur Beispielartikel … Diese Artikel können Sie nicht bestellen.“
- Vorschlag: Wenn kein Artikel bestellbar ist: Augenbraue „Auf Anfrage“, Unterzeile „Artikel rund um Schlüssel, Schloss und Tür. Zurzeit fragen Sie Artikel bei uns an.“, Abschnitt „Öffnen Sie einen Artikel. Dort finden Sie Eigenschaften und Lieferumfang.“

### L-18 · rot · src/app/(site)/warenkorb/warenkorb-ansicht.tsx:221-222 gegen 90-91, 298-301, 309-312, 687

- Zitat: Brauchen Sie das Produkt trotzdem, fragen Sie es bei uns an. Nutzen Sie dazu den Link an der Position oder unser Kontaktformular.
- Warum: Einen Link an der Position gibt es nur bei „auf Anfrage“. Bei „nicht lieferbar“, bei einem abgeschalteten oder entfernten Schlüssel und bei Beispielartikeln steht an der Position nur „Bitte entfernen Sie die Position.“ ohne Link. Der Satz verweist dann auf etwas, das fehlt.
- Vorschlag: Bitte entfernen Sie die betroffene Position. Brauchen Sie das Produkt trotzdem, schreiben Sie uns über das Kontaktformular.

### L-19 · gelb · src/lib/codelinie-texte.ts:320 und 326 (Beschreibung, Fassung nicht lieferbar); Auszug Zeile 346 und 413

- Zitat: Wir fertigen den Möbelschlüssel nur nach Ihrem Code. Ihren Originalschlüssel müssen Sie nicht einschicken. Das Codeformat lautet „3 bis 4 Ziffern“, zum Beispiel 0812. Diesen Schlüssel können Sie zurzeit nicht bestellen.
- Warum: Der Satz „Wir fertigen …“ steht ohne Bedingung in allen drei Fassungen. Bei „nicht lieferbar“ sagt er im Präsens, dass gefertigt wird, und zwei Sätze später, dass man nicht bestellen kann. Ein älterer Leser liest beides als Widerspruch.
- Vorschlag: Bei „nicht lieferbar“: „Diesen Schlüssel können Sie zurzeit nicht bestellen. Das Codeformat lautet „3 bis 4 Ziffern“, zum Beispiel 0812.“ Den Satz „Wir fertigen … nur nach Ihrem Code.“ nur bei „lieferbar“ und „auf Anfrage“ zeigen.

### L-20 · gelb · src/app/(site)/schluessel-nach-code/linien-zeile.tsx:34 und 61-65

- Zitat: Staffelpreis ab {staffel.minQty} Stück
- Warum: Die Zeile nimmt ungeprüft line.bulkPrices[0]. Die Produktseite und die Texte nennen eine Staffel nur über staffelStufen (codelinie-texte.ts:103-109): Stufe über 1 Stück, höchstens die Höchstmenge, wirklich günstiger, sortiert. Liegt die erste Stufe über der Höchstmenge, ist sie nicht günstiger oder unsortiert, verspricht die Liste eine Staffel, die die Produktseite nicht nennt.
- Vorschlag: Die Zeile nennt die Staffel aus staffelStufen(line)[0]; gibt es keine, entfällt der Satz. Wortlaut bleibt: „Staffelpreis ab 3 Stück“.

### L-21 · gelb · src/app/(site)/schluessel-nach-code/page.tsx:259

- Zitat: Für jeden Hersteller gibt es eine eigene Seite mit seinen Systemen, Codeformaten und Preisen.
- Warum: Preise zeigt eine Herstellerseite nur, wenn mindestens ein Produkt lieferbar ist (preisSpanne, codelinie-texte.ts:412-419). Bei Herstellern mit nur Anfrage- oder nicht lieferbaren Produkten stimmt „und Preisen“ nicht.
- Vorschlag: Für jeden Hersteller gibt es eine eigene Seite mit seinen Systemen und Codeformaten.

### L-22 · gelb · src/app/(site)/schluessel-nach-code/page.tsx:274

- Zitat: {formatNumber(eintrag.lines.length)} {eintrag.lines.length === 1 ? 'Linie' : 'Linien'}
- Warum: Überall sonst heißt es „Produkt/Produkte“ (Shop, Liste, Hersteller- und Kategorieseite). „Linie“ ist ein Wort aus der Pflege; ein älterer Kunde versteht unter „3 Linien“ nichts. Die Vorgabe der Gruppe verbietet „Codelinie“ im sichtbaren Text.
- Vorschlag: {formatNumber(eintrag.lines.length)} {eintrag.lines.length === 1 ? 'Produkt' : 'Produkte'}

### L-23 · gelb · src/lib/codelinie-texte.ts:476-477 mit aufzaehlung (403-406); Auszug Zeile 158

- Zitat: 6 Produkte für Büroschrank und Rollcontainer, Schreibtisch und Sideboard, Aktenschrank und Registratur, Vitrine und Glasschrank, Küchenmöbel und Einbauschrank und Werkstattschrank und Werkbank.
- Warum: Die Anwendungen enthalten selbst „und“. Die Aufzählung hängt ein weiteres „und“ an, sodass am Ende drei „und“ hintereinander stehen. Ein älterer Leser kann nicht erkennen, was zusammengehört.
- Vorschlag: 6 Produkte für Möbel und Büroschränke. Dazu gehören Büroschrank, Schreibtisch, Aktenschrank, Vitrine, Küchenmöbel und Werkbank.

## None

Die Texte sind meist kurz, ohne Gedankenstriche und ohne Floskeln. Ein Fall ist sachlich falsch: Sind alle Produkte einer Kategorie oder eines Herstellers „nicht lieferbar“, sprechen Kopfzeile und Einleitung trotzdem von „Auf Anfrage“ und von einer Prüfung. Die Produktseite sagt dagegen nur „können Sie zurzeit nicht bestellen“. Dazu kommen mehrere Stellen, die nach zusammengesetzten Bausteinen klingen: die „und … und“-Kette in der Kategorie-Einleitung, die doppelte Fundstellen-Antwort, „ist für … gedacht“ und Antworten, die mit „Angaben zum Schloss:“ beginnen. Das interne Wort „Anwendungsfamilie“ steht noch sichtbar in Beschreibung, Filter und Tabelle. In der Herstellerliste steht noch „Linie/Linien“. Mit den unten genannten Sätzen ist die Gruppe redaktionell fertig.

### L-24 · rot · Auszug, Verfügbarkeit nicht-lieferbar, KATEGORIESEITE und HERSTELLERSEITE „Musterwerk“ (einleitung); erzeugt in src/lib/codelinie-texte.ts Z. 476-480 und 532-539; Kopfzeile in kategorie/[kategorie]/page.tsx Z. 94 und hersteller/[hersteller]/page.tsx Z. 76

- Zitat: 6 Produkte für Büroschrank und Rollcontainer, ... Sie nennen den Code in einer Anfrage, wir prüfen ihn und melden uns. Ihr Originalschlüssel bleibt bei Ihnen. (Kopfzeile: „Kategorie · Auf Anfrage“)
- Warum: Sind alle Produkte nicht lieferbar, sagt die Produktseite nur „Diesen Schlüssel können Sie zurzeit nicht bestellen.“ Sie bietet auch keine Anfrage an. Kategorie- und Herstellerseite versprechen dagegen eine Prüfung und nennen den Zustand „Auf Anfrage“. Beide Seiten widersprechen sich, und das Versprechen gilt nicht (R4).
- Vorschlag: Für die Fassung ohne lieferbare und ohne anfragbare Produkte: „6 Produkte für Möbel- und Büroschlösser. Diese Schlüssel können Sie zurzeit nicht bestellen.“ Kopfzeile: „Kategorie · Derzeit nicht lieferbar“.

### L-25 · gelb · Auszug, alle drei Verfügbarkeiten, KATEGORIESEITE (einleitung); codelinie-texte.ts Z. 477

- Zitat: 6 Produkte für Büroschrank und Rollcontainer, Schreibtisch und Sideboard, Aktenschrank und Registratur, Vitrine und Glasschrank, Küchenmöbel und Einbauschrank und Werkstattschrank und Werkbank.
- Warum: Der Satz hat über 25 Wörter und ist aus Bausteinen gereiht. Durch „und … und … und“ am Ende ist nicht mehr zu erkennen, was zusammengehört. Ein älterer Leser verliert hier den Faden.
- Vorschlag: 6 Produkte für Möbel- und Büroschlösser. Bei jedem Produkt steht, für welche Möbel es gedacht ist.

### L-26 · gelb · Auszug, Produktseite ms-01 und sp-02, alle Verfügbarkeiten (beschreibung); codelinie-texte.ts Z. 315

- Zitat: Der Schlüssel MS-01 ist für Büroschrank und Rollcontainer gedacht. Er gehört zur Anwendungsfamilie „Möbel- und Büroschlösser“.
- Warum: „Anwendungsfamilie“ ist ein internes Pflegewort. „Für X und Y gedacht“ ist eine Automatik-Wendung. Der zweite Satz wiederholt nur den Kategorienamen und bringt dem Kunden nichts.
- Vorschlag: Der Schlüssel MS-01 passt zu Schlössern an Büroschränken und Rollcontainern.

### L-27 · gelb · src/app/(site)/schluessel-nach-code/shop-liste.tsx Z. 287-293; [slug]/page.tsx Z. 141 (Tabelle „Technische Angaben“)

- Zitat: Die Anwendungsfamilie fasst Schlösser für denselben Zweck zusammen, zum Beispiel Briefkastenanlagen oder Technikschränke. Damit finden Sie am schnellsten zum Ziel, wenn Sie den Schlüsseltyp nicht kennen.
- Warum: Das interne Wort steht als Feldname im Filter und in der Tabelle. Darum muss es erst erklärt werden. Die Auswahl selbst heißt schon „Alle Anwendungen“, die Wörter sind also uneinheitlich. „Am schnellsten zum Ziel“ ist eine Floskel.
- Vorschlag: Feldname „Wofür?“ (Tabelle: „Einsatz“). Erklärung: „Hier wählen Sie, wofür das Schloss ist, zum Beispiel Briefkasten oder Technikschrank. Das hilft, wenn Sie den Schlüsseltyp nicht kennen.“

### L-28 · gelb · Auszug, alle Produktseiten, FAQ „Wo steht der Code bei …?“; codelinie-texte.ts Z. 343

- Zitat: Bei Möbel-, Spind- und Briefkastenschlössern steht der Code häufig auf der Stirnseite des Schlosses oder auf dem Schließzylinder. Der Code steht meist direkt auf dem Schloss oder auf dem Schlüsselkopf. Erwartetes Format: 3 bis 4 Ziffern.
- Warum: Zwei Bausteine sagen fast dasselbe zweimal, einmal mit „häufig“, einmal mit „meist“. Danach folgt ein Stichwortrest ohne Verb. Das liest sich nicht wie von einem Menschen geschrieben.
- Vorschlag: Der Code steht meist auf der Stirnseite des Schlosses, auf dem Schließzylinder oder auf dem Schlüsselkopf. Er hat 3 bis 4 Ziffern.

### L-29 · gelb · Auszug, alle Produktseiten, FAQ „Für welche Schlösser ist MS-01 gedacht?“; codelinie-texte.ts Z. 379

- Zitat: Angaben zum Schloss: Hersteller Musterwerk, System M 100, Codebereich 1 bis 999. Im Zweifel vergleichen Sie diese mit der Prägung an Schloss oder Schlüssel.
- Warum: Die Antwort beginnt mit einer Stichwortliste statt mit einer Antwort. „diese“ hat keinen klaren Bezug. Der gleiche Baustein steht auch schon in der Beschreibung.
- Vorschlag: MS-01 ist für Schlösser von Musterwerk im System M 100 mit Codes von 1 bis 999. Vergleichen Sie diese Angaben mit der Prägung an Schloss oder Schlüssel.

### L-30 · gelb · Auszug, lieferbar, FAQ „Wie sieht ein gültiger Code für MS-01 aus?“; codelinie-texte.ts Z. 337-338

- Zitat: Für MS-01 erwartet das Bestellformular: 3 bis 4 Ziffern, zum Beispiel 0812. Eine Eingabe in einem anderen Format nimmt es nicht an.
- Warum: Das Formular ist hier der Handelnde, und der Doppelpunkt dient nur dem Effekt. Für den Kunden ist das umständlich. Er will wissen, wie sein Code aussieht.
- Vorschlag: Der Code für MS-01 hat 3 bis 4 Ziffern, zum Beispiel 0812. Andere Codes nimmt das Bestellformular nicht an.

### L-31 · gelb · Auszug, HERSTELLERSEITE „Musterwerk“ (einleitung und absaetze); codelinie-texte.ts Z. 532-547

- Zitat: Systeme: M 100 und T 7. Schlüsseltyp: Möbelschlüssel und Spindschlüssel. Preise je Stück: 8,00 €.
- Warum: Die Systeme stehen schon in der Einleitung direkt darüber, die Angabe ist doppelt. „Preise“ steht im Plural, obwohl es nur einen Betrag gibt. Der Absatz ist nur eine Stichwortreihe.
- Vorschlag: Es gibt Möbelschlüssel und Spindschlüssel. Jeder Schlüssel kostet 8,00 €.

### L-32 · gelb · src/app/(site)/schluessel-nach-code/page.tsx Z. 274 (Herstellerliste)

- Zitat: {formatNumber(eintrag.lines.length)} {eintrag.lines.length === 1 ? 'Linie' : 'Linien'}
- Warum: „Linie/Linien“ ist der interne Begriff (Codelinie). Überall sonst zählt die Seite „Produkt/Produkte“. Hier sind die Wörter für dieselbe Sache also uneinheitlich.
- Vorschlag: 2 Produkte · 2 Systeme · ab 8,00 € (also 'Produkt' : 'Produkte')

### L-33 · gelb · src/app/(site)/schluessel-nach-code/page.tsx Z. 259

- Zitat: Für jeden Hersteller gibt es eine eigene Seite mit seinen Systemen, Codeformaten und Preisen.
- Warum: Bei Herstellern mit Produkten auf Anfrage zeigt die Herstellerseite keinen Preis. Der Satz verspricht also etwas, das nicht immer gilt.
- Vorschlag: Für jeden Hersteller gibt es eine eigene Seite mit seinen Systemen und Codeformaten.

### L-34 · gelb · Auszug, KATEGORIEN AUF /shop (content/kategorien.json, beschreibung)

- Zitat: Weitere Sicherheitstechnik: Weitere geeignete Produkte der Sicherheitstechnik.
- Warum: Die Beschreibung wiederholt nur den Namen. „Geeignet“ ohne Bezug sagt nichts. Ebenso doppelt: „Autoschlüssel als Produkte: Autoschlüssel als Produkt, ohne Termin in der Werkstatt.“
- Vorschlag: Weitere Sicherheitstechnik: Sicherheitstechnik, die nicht zu Schlüsseln oder Zylindern gehört. / Autoschlüssel als Produkte: Sie bestellen den Autoschlüssel ohne Termin in der Werkstatt.

### L-35 · gelb · Auszug, Produktseite, Verfügbarkeit nicht-lieferbar (Einleitung und beschreibung); codelinie-texte.ts Z. 301-302 und 320

- Zitat: Möbelschlüssel für Büroschrank und Rollcontainer, gefertigt nach dem Code Ihres Schlosses (3 bis 4 Ziffern). Diesen Schlüssel können Sie zurzeit nicht bestellen.
- Warum: Der erste Satz hat kein Verb und reiht nur Bausteine. „Gefertigt“ und in der Beschreibung „Wir fertigen den Möbelschlüssel nur nach Ihrem Code“ beschreiben eine Fertigung, die gerade nicht stattfindet. Die Kernaussage steht erst danach.
- Vorschlag: Diesen Möbelschlüssel können Sie zurzeit nicht bestellen. Er wird nach dem Code des Schlosses gefertigt, der Code hat 3 bis 4 Ziffern.
