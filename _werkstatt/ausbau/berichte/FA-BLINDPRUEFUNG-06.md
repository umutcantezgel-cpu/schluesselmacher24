# FA-BLINDPRUEFUNG-06 · Blindprüfung Kundschafter 06 (Abschnitte 12, 13, Anhang B Punkte 1–3)

Quelle: _werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt, Zeilen 302–351 und 807–814.
Zählung: Abschnitt 12 hat 5 Punkte plus Absatz „Originalschlüssel einsenden“ (Kundschafter: 7 Urteile, Absatz geteilt). Abschnitt 13 hat Einleitung, 3 Tabellenzeilen und 5 Punkte (9 Urteile). Anhang B hat 3 Punkte (3 Urteile). Zusammen 19 Urteile, alle am Code nachgeprüft.

## Korrekturen (2)

- **FA-12-06 erfuellt → teilweise.** Der direkte Einsendeweg mit Begleitschein ist da. Aber:
  (a) `schluessel-nach-vorlage/page.tsx:399-420` überschreibt den Abschnitt mit „Nur auf Aufforderung … Vorher nicht“ und „Senden Sie … nichts unaufgefordert ein“. Das widerspricht dem direkt buchbaren Weg (`schluessel-einschicken/page.tsx:58-63`) und dem Wort „einfach“ der Anweisung.
  (b) Der zweite Weg (Foto-Anfrage → Freigabe „Originalschlüssel einsenden“, `Vorgaenge.ts:343-349`) hat keine Versandwahl. `schein.ts:55` setzt fest „versichert“. Die Freigabe-Mail (`mail/vorlagen/freigabe.ts:45-68`) sagt nur „versicherten oder mindestens nachverfolgbaren Versand“, ohne Kosten und ohne Verpackungshinweis.
- **FA-12-07 widerspricht → teilweise.** „Je nach Fall“ ist über die Foto-Anfrage abgedeckt: Die Vorlage-Seite bietet mechanische Autoschlüssel an (`page.tsx:350-378`), und das Team kann bei der Freigabe die Einsendung anfordern (Häkchen `einsendenNoetig`, Begleitschein über `bestellung/[id]/begleitschein/route.ts`). Die FAQ-Aussagen (`autoschluessel/page.tsx:201-207`, `kopieren/page.tsx:193-197`) passen dazu. Was fehlt: Im direkten Einsendeformular sind Autoschlüssel gesperrt, ohne Ausnahme für reine Bärte (`einsende-formular.tsx:304`). Außerdem ist nirgends erklärt, wann ein Autoschlüssel eingeschickt werden darf. Das ist eine Lücke, kein Widerspruch.

## Bestätigt (17)

FA-12-01, 12-02, 12-03, 12-04, 12-05, 13-01, 13-02, 13-03, 13-04, 13-05, 13-06, 13-07, 13-08, 13-09, AB-01, AB-02, AB-03.

Ergänzungen zu den bestätigten Urteilen:
- **12-01:** Alle Fotos gehen mit derselben Kategorie `schluesselfoto` an den Server (`anfrage-formular.tsx:389-391`). Der Server kann Vorderseite, Rückseite und Spitze also nicht einmal unterscheiden. `handleSubmit` sperrt das Absenden nicht, wenn Fotos fehlen; es erscheint nur ein Hinweis (`:845`).
- **12-04:** Die Beispielbilder sind fest im Code hinterlegt (`page.tsx:42-79`). Der Betreiber kann sie ohne Entwickler nicht pflegen. Ein Video gibt es nirgends in `src` oder `content`.
- **13-02, 13-04, AB-02:** Gezielt gesucht nach „DHL Paket“, „Wert“, „Wertbrief“, „Filiale“ und „500“. Nur ein Treffer, in `pricing.test.ts:782` (Kasse). Die Urteile „fehlt“ stehen. Der DHL-Retouren-Adapter würde ein DHL-Paketlabel erzeugen, ist aber toter Code (`schein.ts:70-72`, `einsendeAngebotFuerWeg` immer ohne Label) und unterscheidet nicht nach versichert und unversichert.
- **13-03 und AB-01:** Der Widerspruch steckt vor allem in der Benennung. Die Option heißt „Versichert“, die Seitenüberschrift lautet „Versichert oder unversichert“ (`schluessel-einschicken/page.tsx:187`), und auf dem Begleitschein-PDF steht im Kopf fett „Versand: versichert“ (`versand/begleitschein.ts:28`). Der Bestand schreibt „Einschreiben“ ohne Zusatz „Einwurf“. 25 € könnten zum Übergabe-Einschreiben passen. Deshalb muss die Produktwahl ohnehin geklärt werden (offene Frage).
- **Zeilenverschiebung:** Die Fundstellen in `Einstellungen.ts` stimmen nicht mehr. haftungVersichert steht jetzt in Zeile 376, labelAktiv in 368.

## Übersehen (1)

- **FA-13-10:** Die Einsendung nach einer Foto-Freigabe muss dieselbe Versandwahl, Kostenanzeige und Verpackungsanweisung bekommen wie der direkte Weg. Heute ist sie fest auf „versichert“ gestellt (`schein.ts:55`). Die Mail (`freigabe.ts:45-68`) nennt keine Varianten, keine Kosten und keinen Hinweis zum Papierumschlag. Aufwand M.

## Risiken

- **G9:** Haftungsbeträge, Porto, Aufpreise und Versandoptionen betreffen Preise und Versandverhalten. Der Inhaber muss die Werte freigeben, also 20 € für Einwurf, 500 € für DHL Paket, die aktuellen Portopreise sowie die Frage, ob Einschreiben Wert noch angeboten wird.
- **G6 und Daten:** `VersandArt` (`'versichert' | 'unversichert'`) steckt im Payload bestehender Vorgänge, in `einsenden/vorgang.ts` und in `schein.ts:55`. Neue Arten müssen additiv dazukommen, und alte Werte müssen lesbar bleiben.
- **G8, Tests:** Diese Tests brechen bei einer Umbenennung und dürfen nur bewusst angepasst werden: `versand.test.ts:35`, `:50`, `:129` und `einsenden.test.ts:119-130`. Letzterer fixiert, dass im Einsendeweg nie ein echtes Label entsteht.
- **Datenschutz:** Ein echtes DHL-Label überträgt die Kundenanschrift an DHL. Dafür ist ein Hinweis in der Datenschutzerklärung nötig (Rechtstext, G9 und R10), dazu die Sandbox-Prüfung. Die Sendungsnummer aus `dhl-retoure.ts:77` muss gespeichert werden; sonst entsteht bei jedem Abruf ein neues, kostenpflichtiges Label (`schein.ts:7-9`).
- **R9 und R12:** „Versichert“ darf nicht stehen bleiben, wo nur die Haftung des Beförderers gilt. DHL und Deutsche Post nur sachlich nennen, ohne Logos.
- **R4:** `page.tsx:170` enthält einen ausgeblendeten Platzhalter zur Bearbeitungsdauer. Der Kundschafter hat ihn schon gemeldet.

## Offene Fragen

- OFFENE FRAGE: Welches Post-Produkt ist gemeint, Einschreiben Einwurf (20 €) oder Übergabe-Einschreiben (25 €)? Stimmen 4,45 € als Porto für 2026?
- OFFENE FRAGE: Gibt es Einschreiben Wert beziehungsweise den Wertbrief national noch, und mit welcher Höchsthaftung?
- OFFENE FRAGE: Soll die Vorlage-Seite weiter „nur auf Aufforderung“ sagen, oder gilt die direkte Einsendung als gleichwertiger Weg?
