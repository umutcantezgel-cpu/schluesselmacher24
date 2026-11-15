# FA-BLINDPRUEFUNG-10 · Abschnitt 22 Adminbereich · Blindprüfung

Stufe 3, nur lesen. Grundlage: arbeitsanweisung-2026-11-11.txt Zeilen 493–523, Bericht FA-KUNDSCHAFTER-10.

## Vollständigkeit
Abschnitt 22 hat einen Zielsatz, 12 + 6 Aufzählungspunkte und den Grundsatz. Der Kundschafter hat jedes Verb bzw. jedes Objekt als eigene Anforderung gelistet (FA-22-00 bis FA-22-46). Nichts übersehen.
Hinweis zum Grundsatz: Im Original steht „dass **Umut** für jede Kleinigkeit kontaktiert werden muss“. Gemeint ist der Entwickler, nicht der Inhaber. Das Urteil ändert sich dadurch nicht.
Die offene Frage zu FA-22-19 beantwortet die Anweisung selbst (Z. 134–142). Hauptzentrale bzw. regionaler Eigenbereich heißt Direkttermin mit 69,90 € Anzahlung. Partnernetzwerk heißt Termin außerhalb des Eigenbereichs, vermittelt über einen Partner. Das muss auch der Kunde vor der Zahlung sehen.

## Am Code geprüft: 38 Urteile, 30 bestätigt, 8 geändert

| ID | alt | neu | Grund (Fundstelle) |
|---|---|---|---|
| FA-22-16 | erfuellt | teilweise | Das Mailprotokoll speichert nur Art, Empfänger, Zeit und Ergebnis (Vorgaenge.ts:589-621). Der frei geschriebene Text „Nachricht an den Kunden“ wird nach dem Versand geleert und nirgends gespeichert (vorgang-benachrichtigen.ts:188-190, 227-229). Antworten des Kunden fehlen ganz. |
| FA-22-17 | erfuellt | teilweise | Zu sehen sind nur Umfang und Betrag der einen Zahlung (Vorgaenge.ts:536-545). Bei einer Anzahlung lässt sich nirgends festhalten, ob der Rest bezahlt wurde. „Vollzahlung“ ist also nicht erkennbar. |
| FA-22-18 | fehlt | teilweise | Den geplanten Rest zeigt das Vorgangsblatt im Backend (Knopf in der Seitenleiste, vorgangsblatt.ts:76 „Rest nach Anzahlung“). Bei Autoschlüssel-Terminen steht er auch in „Angaben des Kunden“ (assistent.tsx:760-762 → zusammenfassung). Es gibt kein Feld und keine Spalte, die offenen oder bezahlten Rest zeigt. |
| FA-22-20 | teilweise | fehlt | provisionCent ist der Anteil der Plattform, nicht der Betrag des Partners. abrechnen() wird außerhalb der Tests nirgends aufgerufen (grep: kein Import). Im Admin gibt es keinen Partnerbetrag. |
| FA-22-27 | erfuellt | teilweise | Stripe-Erstattungen sind gut belegt (uebergaenge.ts:326-340). Eine Erstattung außerhalb von Stripe (bar, Überweisung) lässt sich nur als Zahlungsstand ohne Betrag erfassen, denn erstattetCent ist ein Systemfeld (Vorgaenge.ts:577). Es gibt kein Grundfeld für Storno oder Erstattung, und eine Teilerstattung bleibt „bezahlt“. |
| FA-22-30 | fehlt | teilweise | Die Leistung „gehaeuse-reparatur“ (Gehäuse, Tasten, Batterie) ist im Backend samt Preisregeln pflegbar (content/car-key-services.json:60, service-pricing.json, AutoschluesselLeistungen.ts). Dazu kommt das Attribut Gehäuse je Fahrzeugreihe (Fahrzeugreihen.ts:79). Es fehlen Gehäuse als bestellbare Artikel und die Seite /autoschluessel-gehaeuse. |
| FA-22-36 | fehlt | teilweise | Die Partnerseite /partner-werden zieht Texte und SEO aus „Seiten“ und ist pflegbar (partner-werden/page.tsx:24-28). Öffentliche Partnerprofile oder Netzwerkseiten fehlen. |
| FA-22-45 | erfuellt | teilweise | Der Schalter „Nicht in Suchmaschinen aufnehmen“ wirkt bei Artikeln, Codelinien, Städten, Leistungsseiten, Modellen und /artikel. Bei Ratgebern wirkt er nicht: Die Metadaten setzen kein robots (ratgeber/[slug]/page.tsx:27-31), und die Sitemap nimmt alle Ratgeber auf (sitemap.ts ~178). Bei „Seitentexten“ wirkt er auch nicht: Startseite (page.tsx:29-36), service-und-termin, partner-werden, sicherheitstechnik usw. |

Bestätigt, mit Anmerkungen:
- FA-22-02 bleibt teilweise, ist aber wahrscheinlich ein echter Fehler. Payload ruft beim Duplizieren `create` mit `duplicateFromID` auf und gibt das Original als originalDoc an die beforeChange-Feldhooks (node_modules/payload/dist/collections/operations/create.js:105-234). kennungFeld übernimmt dann `originalDoc.kennung` (gemeinsam.ts:84), und die Kopie verletzt den Unique-Index. Der slug wird per Standard zu „x - Copy“ (setDefaultBeforeDuplicate.js), was die slug-Prüfung verletzt. Als Entwurf wird diese Prüfung übersprungen. OFFENE FRAGE, bis ein DB-Test es zeigt. Dasselbe gilt für alle Sammlungen mit kennungFeld (Ratgeber, Einsatzgebiete, Partnerbetriebe, Fahrzeugreihen, Rubriken).
- FA-22-04: Die Konvention „letztes Schlagwort = Kategorie“ (codelinie.ts:27-33) steht nirgends im Admin. Die Feldbeschreibung lautet nur „Schlagworte für Filter und Suche“. Ein Betreiber kann das nicht wissen. Das Urteil bleibt teilweise.
- FA-22-07 ist bestätigt: productImage wird außerhalb des Mappings nirgends gelesen.
- FA-22-39 und FA-22-41 sind bestätigt: darfVermitteln wird nirgends aufgerufen. vermittlung.partner zeigt auf `vorgaenge` und nicht auf `partnerbetriebe` (Vorgaenge.ts:386-391). Pausieren und Region wirken deshalb technisch gar nicht.
- FA-22-19 bleibt fehlt. Nur „Partnernetzwerk“ lässt sich aus einem von Hand gesetzten Vermittlungsstand erahnen. Hauptzentrale und Eigenbereich lassen sich nicht unterscheiden.
- FA-22-44 (Canonical) und FA-22-32 (Videos) bleiben fehlt: In src/payload gibt es kein Feld dafür, und Medien nimmt nur Bilder an (Medien.ts:31).

Nicht am Code nachgeprüft (nur plausibel): 09, 12, 13, 25, 29, 40, 00, 46.

## Risiken für den Bau
1. Partnerauszahlung (FA-22-22/23, auch Z. 152-158). Nimmt die Plattform Kundengeld an und zahlt Partner aus, kann das ein Zahlungsdienst nach ZAG sein. Nötig wären dann eine BaFin-Erlaubnis oder ein Weg wie Stripe Connect. Der Bestand sperrt Modell B bewusst (Partnerbetriebe.ts:44-46, MA-09). Das ist Zahlverhalten nach G9 und braucht Inhaber, Anwalt und Steuerberatung. Zu klären sind auch Umsatzsteuer und Rechnungsstellung (Vermittlung oder Eigenleistung).
2. Duplizieren: Ein beforeDuplicate-Hook in kennungFeld und slugFeld betrifft alle Sammlungen. Ein DB-Test ist Pflicht, weil die Kennung in Bestellungen fest bleiben muss (loeschsperre.ts).
3. Storno mit automatischer Stripe-Erstattung: Das ändert Zahlverhalten (G9). Teilerstattungen brauchen einen Stand „teilerstattet“ im Auswahlfeld, also eine additive Migration (G6).
4. Positionen nachträglich bearbeiten (FA-22-12): Festgeschriebene Positionen schützen den Beleg (GoBD, Preisangaben). vorgaenge-felder.test.ts und vorgang-aendern.db.test.ts setzen das wahrscheinlich voraus. Besser wäre ein Korrekturbeleg statt einer Änderung.
5. provisionCent im Vorgang ist ohne Feldzugriff für alle Mitarbeiter lesbar. Das widerspricht dem Kommentar „Provisionen sieht nur der Inhaber“ (Partnerbetriebe.ts:21, G13). Der Wert ist nicht im Repo, aber Mitarbeiter sehen ihn im Admin.
6. Videos: Mehr MIME-Typen bedeuten mehr Speicher und Kosten (S3). Eingebettete Fremdvideos (YouTube) brauchen eine Einwilligung (TTDSG §25, DSGVO).
7. Bearbeitbare Canonicals: Falsche Werte können Seiten aus dem Index nehmen (R2). src/app/(site)/canonical.test.ts prüft feste Canonicals und muss erweitert werden, darf aber nicht gelockert werden (G8).
8. Öffentliche Partnerprofile: Datenschutz der Partnerdaten, R4/R5 (keine erfundenen Partner oder Bewertungen) und Wettbewerbsrecht (Wer führt den Auftrag aus? Transparenz nach Z. 142).
9. Eigene Kategorien und Unterkategorien als Sammlung: Die Schlagwort-Konvention muss migriert werden. Kategorie-URLs unter /schluessel-nach-code/kategorie/* müssen stabil bleiben (Weiterleitungen). JSON-Fallback ist Pflicht (G6).
10. Lagerbestand bzw. Verfügbarkeit: Ein echter Bestand braucht eine Prüfung in der Kasse (Wettlauf zwischen Bestellungen). Ein einfacher Schalter ist risikoärmer.
11. noindex für Ratgeber und Seiten nachrüsten: Die Sitemap muss mitziehen, sonst widersprechen sich die Signale.
