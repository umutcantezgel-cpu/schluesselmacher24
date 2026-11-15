# Bericht FA-INHALT-03E · Texte menschlicher: Ratgeber, Artikel, Warenkorb

Stand 15.11.2026. Kein git, kein Server, kein Build. Prüfungen über die Datenweiche: vitest 187 Dateien / 2427 Tests grün, typecheck grün, lint grün.

## GEÄNDERTE DATEIEN
- content/guides.json (nur `excerpt` und die Texte in `body[].heading` / `body[].text` der acht Beiträge; Anzahl und Reihenfolge der Abschnitte, Feldnamen, `title`, `slug`, `updatedAt`, `image`, `nextStep`, `seo.*` unverändert)
- src/app/(site)/artikel/page.tsx (Rückfall-Lead, Lead „Artikel auswählen“, Beispielhinweis, Leerzustand, Weiterlesen-Lead und -Beschreibungen; `BESCHREIBUNG` für Suchmaschinen unverändert)
- src/app/(site)/artikel/artikel-liste.tsx (Hilfetext Schlagworte, Leertext)
- src/app/(site)/artikel/[slug]/page.tsx (Beispielhinweis)
- src/app/(site)/artikel/[slug]/artikel-kauf.tsx (nur Überschrift „Beispielartikel, nicht bestellbar“ und Vorlesetext der Staffeltabelle)
- src/app/(site)/warenkorb/warenkorb-ansicht.tsx (nur Leerzustand, zwei Fehlermeldungen zu Codepositionen, Hinweis Stückzahl der Zylinder-Zusammenstellung, Meldung „Keine passende Versandart“)
- Unverändert: src/app/(site)/ratgeber/page.tsx und [slug]/page.tsx (sichtbarer Text schon kurz; der einzige Gedankenstrich steht in der `description` für Suchmaschinen), src/app/(site)/warenkorb/page.tsx (Lead klar; `metadata` gehört zu SEO).
- NICHT geändert: `src/lib/data/defaults/content.ts`. Die Ratgeber-Startwerte (`guides()`) liegen genau in dieser Datei, und das Paket verbietet sie ausdrücklich („Nicht anfassen“). Der Rückfall trägt daher noch den alten Wortlaut. Siehe OFFENE FRAGEN 1.

## WAS UND WARUM
Ratgeber (alle acht Beiträge)
- Der erste sichtbare Absatz ist die Unterzeile (`excerpt`, Lead im Kopf und Text in der Übersicht). Sie beantwortet jetzt die Frage des Titels in zwei bis drei kurzen Sätzen. `articleSchema` nimmt `description` aus demselben Feld, Sichtbares und Auszeichnung bleiben gleich (R8). `seo.description` bleibt wie es war.
- Effekt-Doppelpunkte in Überschriften entfernt („Zuerst: Ruhe bewahren …“ wurde „Zuerst gründlich suchen“, „Prüfen: Ist noch …“ wurde „Prüfen, ob noch ein Schlüssel da ist“, „Sicherheitsfrage: …“ wurde „Klären, ob etwas gesperrt werden sollte“), rhetorische Überschrift „Und die Erweiterbarkeit?“ wurde „An später denken“, Gedankenstrich in „Kamera zuletzt — und rechtlich sauber“ entfernt. Die Anker der Zwischenüberschriften ändern sich dadurch; im Repo verlinkt niemand auf diese Anker.
- Fragen im Fließtext aufgelöst, Gedankenstriche im Text alle entfernt (nur die Titel tragen noch welche, Titel sind gesperrt).
- Fachwörter mit Halbsatz erklärt: Transponder (kleiner Chip), Stulpschraube (Schraube in der schmalen Stirnseite), Schutzbeschlag (verstärkter Beschlag außen an der Tür), Zylinder (Teil des Schlosses, in den der Schlüssel kommt), gleichschließend (ein Schlüssel öffnet alle diese Türen). „Liegenschaften“ wurde „Grundstücke“, „Medium“ wurde „elektronischer Schlüssel oder Karte“, „wo Ruhe herrscht“ wurde „wo sich wenig ändert“.
- Berechtigungsnachweis (R13) in den Schlüsselwegen sichtbar gemacht: Autoschlüssel nennt den Fahrzeugschein als Nachweis (FACHWISSEN 8, Zulassungsbescheinigung Teil I), Schlüsselcode nennt die Sicherungskarte als Nachweis (FACHWISSEN 1, Zeile Sicherungskarte und Kopierschutz).
- Autoschlüssel verloren: Die Unterzeile nennt die Schritte in der Reihenfolge der Abschnitte („Erst prüfen, dann sichern, dann anfragen.“). Die Ablaufzeichnung im Kopf (ablaufAusText) bleibt erhalten, zeigt jetzt aber prüfen, sichern, anfragen statt sichern, prüfen, bestellen. „anfragen“ passt zum nächsten Schritt „Anfrage für Ersatzschlüssel starten“; „bestellen“ war für diesen Weg nicht richtig.
- Schlüsselcode finden: Der Satz „Bei Möbel-, Spind- und Briefkastenschlössern …“ beginnt weiter so, und der Satz mit „Sicherungskarte“ bleibt; beide speisen die Fundstelle auf den Codelinien-Seiten (`fundstelleAusRatgeber`, Test codelinie-texte grün). Der Halbsatz „sichtbar, sobald die Tür offen ist“ steht jetzt als eigener Satz.
- Einbruchschutz: Die Unterzeile nennt bewusst keine „erst …, dann …“-Folge, damit sich der Kopf nicht unbeabsichtigt in eine Ablaufzeichnung verwandelt.
- Keine neuen Zahlen, Normen oder Fristen. Belassen wie im Bestand: „volle 5 Millimeter“, „etwa 3 Millimeter“, Kamera-Satz zu öffentlichen Flächen (rechtlicher Hinweis, wörtlich).

Artikel
- Lead ohne Gedankenstrich und ohne das Fachwort „Standardartikel“: „Artikel rund um Schlüssel, Schloss und Tür zum direkten Bestellen. Wählen Sie die Stückzahl und legen Sie den Artikel in den Warenkorb.“
- Beispielhinweise (Liste und Detail): Semikolon geteilt, Gedankenstrich im Titel durch Komma ersetzt. Aussage unverändert: Beispielwerte, nicht bestellbar.
- Leerzustand: „Hier gibt es gerade keine Artikel.“ und ein klarer nächster Schritt (fragen Sie uns), Knöpfe „Zur Beratung“ und „Anfrage stellen“ unverändert (A-031).
- Weiterlesen: Lead als ganzer Satz, Beschreibungen kürzer und ohne Behördensprache.
- Schlagwortfilter: „Jedes weitere Schlagwort zeigt zusätzliche Artikel.“ entspricht der Logik (`filterArtikel` verknüpft Schlagworte mit oder).
- Versandabschnitt der Detailseite, Hinweis „Höchstens … Stück je Bestellung“, Staffeltexte, Preise, PreisHinweis, GPSR-Angaben unverändert (G9, Versand- und Preishinweise wörtlich).

Warenkorb
- Leerzustand: Überschrift „Ihr Warenkorb ist leer“ bleibt (Werkzeug funktionsliste.mjs prüft sie). Text sagt jetzt, was der Kunde tun kann, ohne zu behaupten, dass Schlüssel nach Code schon direkt bestellbar ist (heute 0 aktive Codelinien, R4): „Hier sammeln Sie, was Sie direkt bestellen möchten. Beginnen Sie mit Schlüssel nach Code oder mit gleichschließenden Zylindern.“
- Fehlermeldungen ohne „Codelinie“: „Dieser Schlüssel ist derzeit nicht bestellbar. Bitte entfernen Sie die Position.“ und „Diesen Schlüssel gibt es nicht mehr im Angebot. …“
- „Stückzahl 1 — eine Zusammenstellung.“ wurde „Stückzahl 1 für die ganze Zusammenstellung. Zylinder ändern oder ergänzen Sie im Konfigurator.“ Mengenregel unverändert.
- „Keine passende Versandart“ kürzer, Aussage gleich.
- Unverändert: Hinweis zur Preisberechnung, Umsatzsteuerzeile, PreisHinweis, Versand-Infotipp, Knöpfe „Zur Kasse“.

Gegenlesen: Dieses Paket hatte kein Werkzeug, um Unteragenten zu starten. Ich habe deshalb zwei Lesungen nacheinander selbst gemacht. (1) Als älterer Kunde ohne Fachwissen: Ergebnis waren die Erklärungen zu Schutzbeschlag, Zylinder, gleichschließend und Transponder sowie der Verzicht auf „Standardartikel“ und „Codelinie“. (2) Tatsachenprüfung gegen die Kopie der alten Fassung (Scratchpad, kein git) und FACHWISSEN.md: Ergebnis war der neutrale Leerzustand im Warenkorb (keine aktiven Codelinien), „anfragen“ statt „bestellen“ im Autoschlüssel-Ablauf, „aus denen sich Ihre Adresse ergibt“ wieder wörtlich und der unveränderte Kamera-Satz. Eine unabhängige Gegenlesung durch zwei andere Leser steht noch aus (OFFENE FRAGEN 2).

## ZAHLEN VORHER UND NACHHER
Messung: stil.mjs braucht einen laufenden Server, der hier nicht erlaubt ist. Gemessen wurde mit `pruefeZeile` und `tsxZeilen` aus stil.mjs. Für die Ratgeber zählen Titel, Unterzeile, Überschriften, Texte und Knopftext aus guides.json, für die anderen Seiten die Zeichenketten der Seitendateien. Das ist eine Heuristik. Bei Artikel und Warenkorb steigen die Wörter auch deshalb, weil das Werkzeug JSX-Text mit Semikolon überspringt und die Semikolons jetzt weg sind.

| Seite | Wörter vorher → nachher | längster Satz vorher → nachher | Mittel | Gedankenstriche vorher → nachher |
|---|---|---|---|---|
| /ratgeber/autoschluessel-verloren-was-tun | 158 → 180 | 22 → 14 | 8,3 → 8,2 | 2 → 1 (Titel) |
| /ratgeber/unterschied-kopie-und-programmierung | 111 → 120 | 15 → 14 | 7,4 → 8,0 | 1 → 1 (Titel) |
| /ratgeber/zylinder-richtig-ausmessen | 113 → 139 | 21 → 19 | 8,7 → 8,2 | 2 → 0 |
| /ratgeber/welche-schliessanlage-passt | 128 → 160 | 16 → 12 | 6,1 → 6,4 | 1 → 0 |
| /ratgeber/schluesselcode-finden | 120 → 145 | 24 → 18 | 8,6 → 8,5 | 1 → 0 |
| /ratgeber/einbruchschutz-wo-anfangen | 107 → 130 | 17 → 12 | 6,7 → 6,8 | 3 → 1 (Titel) |
| /ratgeber/schluessel-verloren-wohnung | 93 → 135 | 14 → 13 | 7,8 → 8,4 | 1 → 1 (Titel) |
| /ratgeber/mechanisch-oder-elektronisch | 93 → 120 | 18 → 15 | 7,8 → 8,0 | 3 → 1 (Titel) |
| /ratgeber (Übersicht) | 40 → 40 | 14 → 14 | 8,0 → 8,0 | 1 → 1 (SEO-Beschreibung) |
| /artikel (mit Liste) | 182 → 222 | 13 → 16 | 5,1 → 5,3 | 1 → 0 |
| /artikel/[slug] (mit Kaufbereich) | 88 → 109 | 8 → 10 | 3,3 → 3,6 | 3 → 0 |
| /warenkorb (mit Ansicht) | 305 → 319 | 14 → 14 | 3,9 → 4,0 | 1 → 0 |

Kein Satz über 25 Wörter, vorher wie nachher. Die Wörter der Ratgeber steigen, weil die Unterzeile jetzt die Antwort gibt und Fachwörter erklärt werden. Fragen im Fließtext: in den Beiträgen 0 (die gezählte Frage ist jeweils der Titel), auf /artikel 1 → 0. Bindestrich-Kandidat im Warenkorb („Zylinder-Konfigurator“ im Satz „Weiter einkaufen“) bleibt, siehe OFFENE FRAGEN 5.

Offene Stellen je Seite: Titel mit Gedankenstrich (fünf Beiträge) sind nach Paket gesperrt. Ratgeber-Übersicht: Gedankenstrich nur in der Beschreibung für Suchmaschinen (gesperrt).

## SCHLUSSREDAKTION (Liste für den Menschen)
Autoschlüssel verloren
1. Reihenfolge in der Unterzeile „Erst prüfen, dann sichern, dann anfragen.“ (auch Kopfgrafik). Stimmt das so mit Ihrer Praxis?
2. „den verlorenen Schlüssel aus dem Fahrzeug zu entfernen“ blieb wörtlich. Für Laien besser „im Fahrzeug löschen lassen, damit er das Auto nicht mehr startet“? Nur, wenn das fachlich stimmt.
3. „Der Fahrzeugschein ist auch Ihr Nachweis, dass Sie den Schlüssel bekommen dürfen.“ Reicht der Fahrzeugschein, oder verlangen Sie zusätzlich den Ausweis (FACHWISSEN nennt beides)?

Kopie oder Programmierung
1. Unterzeile „Eine reine Kopie öffnet Türen und Klappen.“ Gilt das auch für das Lenkradschloss, wie im Abschnitt 1?
2. „Transponder, also ein kleiner Chip“ fachlich genau genug?
3. „Diesen Teil fertigen wir nach Vorlage oder nach geeigneten Fahrzeugdaten.“ stimmt das Angebot?

Zylinder richtig ausmessen
1. „Runden Sie auf volle 5 Millimeter.“ FACHWISSEN 7 sagt: Zwischenwerte zur nächsthöheren Stufe. Soll es „Runden Sie auf die nächsten vollen 5 Millimeter auf“ heißen?
2. Überstand: Bestand sagt „mehr als etwa 3 Millimeter … Schutzbeschlag“, FACHWISSEN 7 sagt „höchstens 3 mm über den Außenbeschlag“. Welche Aussage soll stehen?
3. Erklärung „Schutzbeschlag, ein verstärkter Beschlag außen an der Tür“.

Welche Schließanlage passt
1. Unterzeile: „Brauchen Personen unterschiedliche Rechte, passt eine Schließanlage.“ (FACHWISSEN 1, G-30).
2. Bestand schreibt „Zentralschlossanlage“, die Quellen „Zentralschließanlage“ (FACHWISSEN 1). Überschrift unverändert gelassen; bitte entscheiden.
3. „größere Grundstücke mit mehreren Gebäuden“ statt „Liegenschaften“ passend?

Wo finde ich den Schlüsselcode
1. „Die Sicherungskarte ist zugleich Ihr Nachweis, dass Sie Nachschlüssel bestellen dürfen.“
2. „Sie schicken uns drei Fotos“: gilt die Zahl drei weiter für Schlüssel nach Vorlage?
3. Erste Sätze dieses Beitrags erscheinen auch auf den Codelinien-Seiten als Fundstelle. Passen sie dort?

Einbruchschutz
1. Kamera-Satz (öffentliche Flächen, Nachbargrundstücke) blieb wörtlich; rechtlich prüfen lassen (R10).
2. „Alarm- und Meldetechnik erkennt einen Einbruch und gibt Bescheid.“
3. „Sie brauchen dafür keinen Strom.“ (Mechanik) einfach genug und richtig?

Wohnungsschlüssel verloren
1. Unterzeile „Oft genügt dann ein neuer Zylinder an der betroffenen Tür.“
2. „Sagen Sie dann Ihrem Vermieter oder der Hausverwaltung Bescheid.“ (Bestand: „Informieren Sie …“).
3. „gleichschließende Zylinder häufig günstiger als einzelne“ blieb; Preisaussage bitte bestätigen.

Mechanisch oder elektronisch
1. „Geht ein elektronischer Schlüssel oder eine Karte verloren, lässt er sich sperren.“
2. Liste „Personal, Reinigung, Handwerker oder Mieter“.
3. „Elektronik kommt an die Türen mit wechselnden Nutzern“.

Artikel
1. Lead „Artikel rund um Schlüssel, Schloss und Tür zum direkten Bestellen.“ passend zum künftigen Sortiment?
2. Leerzustand „Hier gibt es gerade keine Artikel.“ mit Beratung als nächstem Schritt.
3. Beispielhinweis „zeigen nur, wie Artikel hier dargestellt werden“.

Warenkorb
1. Leerzustand ohne Zusage, dass Schlüssel nach Code schon bestellbar ist. Wenn Codelinien freigeschaltet sind, darf es wieder „bestellen“ heißen.
2. „Diesen Schlüssel gibt es nicht mehr im Angebot.“
3. „Stückzahl 1 für die ganze Zusammenstellung.“

## OFFENE FRAGEN
1. Widerspruch im Paket: Die Seitengruppe verlangt die Ratgeber „gleichlautend im Rückfall unter src/lib/data/defaults“. Diese Startwerte stehen in `src/lib/data/defaults/content.ts` (`guides()`), und genau diese Datei steht unter „Nicht anfassen“. Ich habe sie nicht geändert. Der Rückfall (nur ohne content/guides.json aktiv) zeigt deshalb noch den alten Wortlaut. Ein Folgeschritt mit Schreibrecht auf `guides()` in content.ts sollte excerpt, heading und text aus content/guides.json übernehmen.
2. Unabhängige Gegenlesung durch zwei andere Leser (Haiku als älterer Kunde, Opus als Tatsachenprüfer) fehlt; hier nur selbst in zwei Durchgängen gelesen.
3. Rundung auf 5 mm und Überstand 3 mm: Bestand und FACHWISSEN 7 weichen leicht ab (siehe Schlussredaktion Zylinder 1 und 2). Nichts Neues eingefügt.
4. „Zentralschlossanlage“ oder „Zentralschließanlage“ (FACHWISSEN 1).
5. Bindestrich-Kandidat „Zylinder-Konfigurator“ im Warenkorb („Weiter einkaufen“): gleiche Bezeichnung wie anderswo im Shop? Nicht geändert, um Linktexte einheitlich zu lassen.
6. Titel der Beiträge tragen Gedankenstriche, sind aber nach Paket gesperrt (Titel und SEO). Entscheidung nach FA-SEO-01.

## Nachbesserung
Stand 15.11.2026, nach zwei Gegenprüfungen. Prüfungen über die Datenweiche: vitest 187 Dateien / 2439 Tests grün, typecheck grün, lint grün. Kein git.

1. [rot] guides.json:23, Nachweis Autoschlüssel: behoben. Der Satz lautet jetzt wie auf den Autoschlüssel-Seiten (programmieren/page.tsx:133): „Als Nachweis, dass Sie den Schlüssel bekommen dürfen, zeigen Sie uns Ihren Ausweis und den Fahrzeugschein. Steht das Fahrzeug nicht auf Ihren Namen, brauchen wir zusätzlich eine Vollmacht des Halters.“ Der doppelte „Fahrzeugschein“ im ersten Satz ist entfallen. Schlussredaktion Autoschlüssel 3 ist damit erledigt.
2. [rot] guides.json:107, Rundung: behoben. Jetzt steht „Runden Sie auf die nächsten vollen 5 Millimeter auf.“ (FACHWISSEN 7, Konfigurator „je angefangene 5 mm“). Offen bleibt für den Inhaber der Zusatz „wenn der Beschlag es erlaubt“ (FACHWISSEN 7). Er wurde nicht eingefügt.
3. [rot] warenkorb-ansicht.tsx:160, Leertext: behoben. Neuer Text: „Hier sammeln Sie, was Sie direkt bestellen möchten. Gleichschließende Zylinder stellen Sie selbst zusammen. Einen Schlüssel nach Code fragen Sie bei uns an.“ Der Knopf heißt weiter „Schlüssel nach Code“. Das ist der Name der Leistung und das Etikett, mit dem Artikel- und Ratgeberseiten auf dieses Ziel verweisen. Es ist keine Kaufzusage. Die Startseite schreibt „Schlüssel nach Code anfragen“, solange keine Codeprodukte da sind. Ob ein Knopftext je Ziel (A-031) hier „Schlüssel nach Code anfragen“ heißen soll, ist eine OFFENE FRAGE (siehe 6).
4. [gelb] content.ts:484, Rückfall guides(): nicht behoben, weil die Datei für dieses Paket gesperrt ist. Der Befund stimmt (siehe OFFENE FRAGEN 1). Benötigt wird ein Folgepaket mit Schreibrecht auf `guides()` in src/lib/data/defaults/content.ts. Es übernimmt excerpt, heading, text und nextStep.label aus content/guides.json, einschließlich der Korrekturen dieser Nachbesserung. Dazu gehört ein Gleichlauf-Test für JSON und Rückfall.
5. [gelb] guides.json:36, seo.description gegenläufig: als OFFENE FRAGE für FA-SEO-01 aufgenommen. Das Feld ist gesperrt. Die Seite sagt „Erst prüfen, dann sichern, dann anfragen“, seo.description sagt „erst sichern, dann prüfen, dann bestellen“. Das widerspricht R1, deshalb sollte die Beschreibung angeglichen werden.
6. [gelb] guides.json:220, nextStep „Codelinien ansehen“: behoben. Das Label heißt jetzt „Schlüssel nach Code“, wie die anderen Verweise auf /schluessel-nach-code. nextStep ist laut Paket nicht gesperrt. Das gleichlautende Etikett unter seo.internalLinks (Zeile 232) ist gesperrt und für FA-SEO-01 vorgemerkt. Ebenfalls vorgemerkt ist die Frage, ob alle Knöpfe zu /schluessel-nach-code einheitlich „Schlüssel nach Code anfragen“ heißen sollen, solange es keine aktiven Codelinien gibt (A-031).
7. [gelb] guides.json:54, Unterzeile Kopie: behoben. Neu: „Eine reine Kopie kann Türen und Klappen öffnen.“ Der zweite Satz bleibt. Damit entspricht die Unterzeile Abschnitt 3 („kann … reichen“). Schlussredaktion Kopie 1 ist erledigt.
8. [gelb] guides.json:111, Überstand: behoben. Der Text folgt jetzt der Messhilfe und FACHWISSEN 7 (Stufe B): „Der Zylinder sollte höchstens 3 Millimeter über den Beschlag außen vorstehen. Sonst braucht es einen Schutzbeschlag.“ Eine neue Zahl gibt es nicht. Die belegte Aussage ersetzt die ungenauere „mehr als etwa 3 Millimeter“. Ob der Inhaber eine engere Zahl will (ein Baumarkt nennt 1 bis 2 mm), bleibt eine OFFENE FRAGE.
9. [gelb] guides.json:343, Bezug „er“: behoben. Neu: „Geht ein elektronischer Schlüssel oder eine Karte verloren, lässt sich beides sperren.“
10. [gelb] artikel/page.tsx:26, Lead mit Handlungsanweisung: behoben. Der Lead ist jetzt nur „Artikel rund um Schlüssel, Schloss und Tür zum direkten Bestellen.“ Die Anweisung zur Stückzahl steht schon im Abschnitt „Artikel auswählen“. Dieser Abschnitt erscheint nur bei articles.length > 0.
11. [rot] guides.json:23, gleicher Befund wie 1: behoben (siehe 1). Gewählt wurde der Wortlaut der Autoschlüssel-Seiten („nicht auf Ihren Namen“). Er deckt auch Firmenfahrzeuge ab.
12. [gelb] content.ts:469, Rückfall: gleicher Befund wie 4. Nicht behoben, weil die Datei gesperrt ist. Folgepaket wie unter 4.
13. [gelb] artikel/page.tsx:42, „alle Türen“: behoben. Neu: „Gleichschließende Zylinder selbst zusammenstellen. Ein Schlüssel öffnet alle diese Türen.“

Zusätzliche OFFENE FRAGEN aus der Nachbesserung
7. FA-SEO-01: seo.description „Autoschlüssel verloren“ an die Reihenfolge „prüfen, sichern, anfragen“ angleichen. Außerdem das Etikett „Codelinien ansehen“ unter seo.internalLinks in „Schlüssel nach Code“ ändern.
8. Folgepaket Rückfall: `guides()` in content.ts mit guides.json in Gleichlauf bringen und einen Test dafür anlegen (Befunde 4 und 12).
9. Inhaber: Zylinderlänge „wenn der Beschlag es erlaubt“ ergänzen? Und Überstand „höchstens 3 mm“ oder eine engere Zahl?
10. A-031: Ein Knopftext für /schluessel-nach-code festlegen („Schlüssel nach Code“ oder „Schlüssel nach Code anfragen“), solange keine Codelinie aktiv ist.

## ABNAHME (Orchestrator, 15.11.2026)

- **Ratgeber „Welche Schließanlage passt“** an die neue Systemerklärung aus FA-INHALT-03C angeglichen: Bei der Hauptschlüsselanlage steht jetzt „Ein Hauptschlüssel öffnet alle ihm zugeordneten Türen, meist alle Türen der Anlage“ (Tabelle des Inhabers, Abschnitt 16); bei der Zentralschlossanlage „die gemeinsamen Türen“.
- **Rückfall `guides()` in `content.ts`**: bleibt bis FA-SEO-01 Teil B auf dem alten Wortlaut, weil FA-SEO-01A die Datei gerade bearbeitet. Der Rückfall greift nur, wenn `content/guides.json` fehlt; Seite und Seed lesen die JSON-Datei. Der Gleichlauf mit Test steht als Pflichtpunkt in `pakete/FA-SEO-01.md`.
- **SEO-Felder der Ratgeber** (Reihenfolge „prüfen, sichern, anfragen“, Verweistext „Codelinien ansehen“, Gedankenstriche in fünf Titeln): Pflichtpunkte für FA-SEO-01 Teil B.
- **Knopftext für `/schluessel-nach-code`** (A-031): Solange keine Codelinie aktiv ist, heißt der Verweis „Schlüssel nach Code“; der Knopf auf der Seite selbst „Code anfragen“.
- Fragen an den Inhaber (Zusatz „wenn der Beschlag es erlaubt“, Überstand höchstens 3 Millimeter, Nachweis Ausweis, Fahrzeugschein, Vollmacht) gehen in MA-41.
