# FA-PLATTFORM-01C · Partnernetz, Teil C: Umkreis und Regionen eines Partners auswerten

Stand 16.11.2026. Rolle Baumeister, Stufe 3. Kein Datenschema, keine Migration, kein git.

## GEÄNDERTE DATEIEN

- `src/lib/partner/region.ts`: die eine Definition der Abdeckung (`abdeckungsGruende`), dazu `deckendePartnerMitGrund`, `deckendePartner` (erweitert, Signatur abwärtskompatibel), `abdeckungsGrundText`, `brauchtOrtsstamm` und die Typen `AbdeckungsAuskunft`, `AbdeckungsGrund`, `RegionEintrag`, `PostleitzahlGebiet`
- `src/lib/partner/region.test.ts`: zehn neue Tests (je Grund Treffer und Nichttreffer, Status, unbekannte Postleitzahl, ohne Auskunft)
- `src/lib/auftragsweg.ts`: `passendePartner` rechnet über `abdeckungsGruende` (neuer optionaler 4. Parameter `auskunft`); `PartnerFuerWeg` hat optional `plz`, `radiusKm`, `regionen`; `StandortEingabe.abdeckung` (optional) wird an `passendePartner` durchgereicht; neu `partnerFuerWegAusBetrieb` (gespeicherter Betrieb → `PartnerFuerWeg`, eine Abbildung für Hook und Stamm). `darfVermitteln` wird hier nicht mehr importiert.
- `src/lib/orte/abdeckung.ts` (neu, rein): `abdeckungsAuskunft(stamm)` liefert Entfernung und Gemeinden und Kreise einer Postleitzahl
- `src/lib/orte/abdeckung.test.ts` (neu): sieben Tests am echten Stamm, Stichprobe Lahn-Dill-Kreis
- `src/lib/orte/dateien.ts` (ergänzt): `ortsstammIndexLesen()` mit Zwischenspeicher je Prozess
- `src/lib/orte/stamm.ts`: `ortsstamm()` nutzt `ortsstammIndexLesen()` (ein Index je Prozess statt zwei); `partnerFuerAbdeckung` liest zusätzlich `plz` und nutzt `partnerFuerWegAusBetrieb` (Umkreis und Regionen kommen mit); `gemeindenMitPartnerAbfragen` gibt die Auskunft mit
- `src/lib/orte/abfrage.ts`: `postleitzahlAuskunft` gibt die Auskunft aus dem übergebenen Stamm mit
- `src/lib/orte/ortsseiten.ts`: „Partner deckt ab“ (`lageOhneGruende`) mit Auskunft aus dem Stamm; `gemeindenMitPartner` mit optionalem 4. Parameter `auskunft`
- `src/lib/orte/grenze.test.ts`: `abdeckung.ts` in die Liste der reinen Module
- `src/payload/hooks/auftragsweg.ts` (nur Vorschlagsliste): `partnerFuerWeg` nutzt `partnerFuerWegAusBetrieb`; Auskunft aus `ortsstammIndexLesen()` nur, wenn ein Betrieb Umkreis oder Region mit Schlüssel hat; jede Zeile nennt den Grund
- `src/payload/hooks/auftragsweg.test.ts`: zwei erwartete Zeilen um den Grund ergänzt, ein neuer Test (Umkreis, Landkreis, unbekannte Postleitzahl, Partnerweg)
- `src/payload/collections/Partnerbetriebe.ts` (nur Hinweistexte und ein Kommentar): Postleitzahlen, Umkreis (neue Beschreibung), Orte und Landkreise, Amtlicher Schlüssel
- `src/lib/partner/abdeckung.db.test.ts` (neu): Datenbanktest der Vorschlagsliste mit einem Betrieb, der nur einen Umkreis hat
- `src/payload-types.ts`: nur erzeugte Beschreibungen aus Partnerbetriebe.ts (`payload generate:types`), kein Schema. Liegt nicht in den Schreibrechten; der Orchestrator checkt die Datei bewusst mit diesem Paket ein.
- `docs/betrieb/partner-pruefen.md`: Abschnitt 6 „Region zuordnen“ neu gefasst, Abschnitt 7 Punkt 1 nennt die Gründe
- `_werkstatt/ausbau/berichte/FA-PLATTFORM-01C.md` (dieser Bericht)

## WAS UND WARUM

1. Eine Definition (`src/lib/partner/region.ts`, `abdeckungsGruende`). Ein Betrieb deckt eine Postleitzahl für eine Auftragsart ab, wenn er freigeschaltet ist und die Leistung führt (`darfVermitteln`, also `decktAuftragsart`) und mindestens eines gilt:
   - (a) Postleitzahl: ein Muster passt (Bestand, `plzPasst`).
   - (b) Umkreis: `radiusKm > 0`, die Postleitzahl des Betriebs (`plz`, fünf Ziffern) ist gesetzt, und `auskunft.entfernungKm(sitz, plz) <= radiusKm`. Die Entfernung ist die Luftlinie zwischen den Mittelpunkten der Postleitzahlen (`entfernungZwischenPostleitzahlen`, 0,1 km genau). Fehlt eine der beiden im Stamm, ist sie null, und es gibt keinen Treffer.
   - (c) Region: Ort nur mit Gemeindeschlüssel (8 Ziffern) gegen die Gemeinden der Postleitzahl, Landkreis nur mit Kreisschlüssel (5 Ziffern) gegen ihre Kreise. Ohne Schlüssel oder mit einem Schlüssel der anderen Länge kein Treffer. Namen werden nicht verglichen (R4).
   Ohne Auskunft zählt nur (a), also wie vor diesem Paket. Die Funktion liefert alle zutreffenden Gründe, leer heißt: deckt nicht ab.
2. Auskunft (`src/lib/orte/abdeckung.ts`): `entfernungKm` über `entfernungZwischenPostleitzahlen`, `gebiet(plz)` liefert die Gemeinden der Postleitzahl und als Kreise die aus `postleitzahlen.json` plus die Kreise ihrer Gemeinden (wie die Werkstatt-Lage in `ortsseiten.ts`). Eine unbekannte Postleitzahl liefert null.
3. Alle Aufrufer:
   - Postleitzahl-Abfrage: `postleitzahlAuskunft` (`abfrage.ts`) baut die Auskunft aus dem übergebenen Stamm; `postleitzahlAbfragen` (`stamm.ts`) liefert dafür Partner mit Umkreis und Regionen.
   - Ortsseiten (FA-PLATTFORM-03B): `lageOhneGruende` und `gemeindenMitPartner` in `ortsseiten.ts`, aufgerufen über `ortsseitenAnreichern` und `gemeindenMitPartnerAbfragen` in `stamm.ts`. Beide liegen in `src/lib/orte/**` und sind umgestellt (siehe BELEGE). Teil B bestimmt „Partner deckt den Ort ab“ weiter über alle Postleitzahlen der Gemeinde; jetzt zählen dabei auch Umkreis und Region.
   - Vorschlagsliste am Vorgang (`partnerVorschlaege`): lädt den Stamm über `ortsstammIndexLesen()` (dateien.ts, läuft auch unter `payload run`, wie `prioritaetLesen` im Hook der Einsatzgebiete), aber nur, wenn ein Betrieb Umkreis mit Postleitzahl oder eine Region mit Schlüssel hat. Ist der Stamm nicht lesbar, gilt nur das Muster, und das Log meldet „Ortsstamm für die Partnervorschläge nicht lesbar“.
   - Partnerweg: `passendePartner` = Modell B und `abdeckungsGruende(...).length > 0`. Am Zahlweg ändert sich nichts (`zahlungsPlan`, `faelligZeilen` unberührt, G9). Den Server-Aufrufer siehe OFFENE FRAGE 1.
4. Gründe: `abdeckungsGrundText` macht daraus „Postleitzahl 355*“, „Umkreis: 10,8 km von 35576 (bis 20 km)“ oder „Landkreis Lahn-Dill-Kreis (06532)“ bzw. „Ort Dillenburg (06532006)“. Die Vorschlagsliste schreibt „Firma (Ort): Grund; Grund“.
5. Admin: Die Hinweise an Postleitzahlen, Umkreis, Orte und Landkreise und am Schlüssel sagen, was jetzt gilt, auch dass der Umkreis ohne Postleitzahl des Betriebs oder mit einer im Stamm unbekannten nicht wirkt. Der Hinweis ist ein fester Text an den Feldern. Einen Hinweis am einzelnen Datensatz („Ihre Postleitzahl steht nicht im Stamm“) gibt es nicht, weil dafür eine Admin-Komponente nötig wäre. Erlaubt waren mir nur Hinweistexte (OFFENE FRAGE 3).
6. Ein Index je Prozess: `ortsstamm()` in `stamm.ts` nutzt jetzt denselben Zwischenspeicher wie der Hook (`ortsstammIndexLesen`). So liegt der Stamm nicht doppelt im Speicher. Der Rückgabewert und das erneute Lesen nach einem Fehler bleiben gleich.
7. Leistungsbedarf: Die Auskunft ist synchron über den schon geladenen Index. Pro Postleitzahl und Betrieb kommt höchstens eine Entfernungsrechnung und ein Nachschlagen dazu.

Bewusste Festlegungen (nicht geraten, aber zur Kenntnis):
- Ein Umkreis von 0 km gilt als „kein Umkreis“. Sonst würde 0 km genau die eigene Postleitzahl abdecken.
- Eine Region zählt nur, wenn Art und Schlüssellänge zusammenpassen. So weitet ein Kreisschlüssel, den jemand versehentlich als „Ort“ einträgt, die Abdeckung nicht auf den ganzen Kreis aus. Eine kreisfreie Stadt als Ort braucht den achtstelligen Gemeindeschlüssel (etwa 06411000), als Landkreis den fünfstelligen.

## GEMEINSAME DATEIEN

- `src/lib/auftragsweg.ts` (Kern des Auftragswegs): geändert sind nur `PartnerFuerWeg` (drei optionale Felder), das neue `PartnerbetriebFuerWeg` mit `partnerFuerWegAusBetrieb`, `passendePartner`, `StandortEingabe.abdeckung` und die eine Zeile in `terminstandorte`, die `passendePartner` aufruft. Zahlung, Restbetrag und Texte sind unverändert.
- Gegenseitiger Import: `auftragsweg.ts` importiert jetzt `abdeckungsGruende` aus `partner/region.ts`, und `region.ts` importiert wie bisher `plzMusterAusText` und `plzPasst` aus `auftragsweg.ts`. Beim Laden benutzt keine der beiden Dateien die andere, nur beim Aufruf. Unit-Tests, Typprüfung und Build laufen. Ein Kommentar in beiden Dateien nennt das. Die saubere Lösung wäre, `plzMusterAusText` und `plzPasst` in ein eigenes Modul zu legen. Dafür reichten meine Schreibrechte nicht (OFFENE FRAGE 4).
- `src/lib/orte/stamm.ts`, `ortsseiten.ts`, `abfrage.ts`, `dateien.ts`: nur ergänzt bzw. um die Auskunft erweitert. Die Ortsseiten-Logik von Teil B ist sonst unverändert.

## PRÜFUNG UND ERGEBNIS

Alle Prüfungen liefen über die Datenweiche:
- `sicher.sh --json -- npx vitest run`: 261 Testdateien, 4102 von 4102 grün
- `sicher.sh --json -- npm run typecheck`: grün, keine Fehler
- `sicher.sh --json -- npm run lint`: grün, keine Befunde
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 30 Testdateien, 179 von 179 grün, darunter neu `src/lib/partner/abdeckung.db.test.ts` mit 3 Tests. Die Warnung „Seiten konnten nicht erneuert werden“ (revalidatePath außerhalb von Next) kommt aus dem Bestand und erscheint in jedem Datenbanktest, der Partnerbetriebe anlegt.
- `sicher.sh --json -- npm run build`: grün, 181 von 181 Seiten

Abstände im Stamm, mit denen die Tests rechnen. Gemessen per Probe, die Probedatei ist danach entfernt:
- von 35576 Wetzlar nach 35606 Solms 9 km
- nach 35390 Gießen 10,8 km (Landkreis Gießen 06531)
- nach 35683 Dillenburg 25,3 km (Lahn-Dill-Kreis 06532, Gemeinde 06532006)

45117 und 01053 stehen nicht im Stamm (Großempfänger, A-068).

## BELEGE

Es gibt nur eine Definition. Alle Prüfungen auf Abdeckung laufen über `abdeckungsGruende`:
- `src/lib/partner/region.ts:103` `abdeckungsGruende` (Definition). Status und Leistung prüft Zeile 109, das Muster Zeile 115, den Umkreis die Zeilen 119–126, die Region die Zeilen 129–143.
- `src/lib/partner/region.ts:158–167` `deckendePartnerMitGrund` und `:171–177` `deckendePartner` rufen `abdeckungsGruende` auf.
- `src/lib/auftragsweg.ts:145` `passendePartner` ruft `abdeckungsGruende` auf und filtert zusätzlich nur Modell B. `:210` `terminstandorte` reicht `eingabe.abdeckung` weiter.
- `src/lib/orte/abfrage.ts:67` Postleitzahl-Abfrage: `deckendePartner(..., abdeckungsAuskunft(stamm))`.
- `src/lib/orte/ortsseiten.ts:64–66` Lage der Ortsseite. `:304` `gemeindenMitPartner` gibt `auskunft` mit. `src/lib/orte/stamm.ts:95` liefert die Auskunft für die Prioritätsorte.
- `src/payload/hooks/auftragsweg.ts:112` lädt die Auskunft. `:155–156` nutzt `passendePartner` und `abdeckungsGruende` im Partnerweg, sonst `deckendePartnerMitGrund`.
- Suche nach `plzPasst(`: übrig sind nur `auftragsweg.ts:76` (Eigenbereich), `terminort.ts:114` (Eigenbereich) und `region.ts:115`. `darfVermitteln(` steht außerhalb von `region.ts` nur noch in `vermittlung.ts:138/144`. Dort prüft es die Zuweisung an einen gewählten Betrieb, nicht die Abdeckung. In `auftragsweg.ts` gibt es kein `darfVermitteln` mehr.

Tests je Anforderung des Pakets:
- Je Grund ein Treffer und ein Nichttreffer:
  - `region.test.ts`: Umkreis, Region Ort, Region Landkreis und Postleitzahl, mit erfundener Auskunft
  - `abdeckung.test.ts`: Gießen im Umkreis, Dillenburg nicht; Dillenburg über Landkreis und Ort, Gießen nicht; am echten Stamm
- Pausierte und gesperrte Betriebe nie: `region.test.ts` (pausiert, gesperrt, in Prüfung, beendet; mit Umkreis und Region), `abdeckung.test.ts` (Abfrage, Ortsseite, Partnerweg), `abdeckung.db.test.ts` (pausiert)
- Unbekannte Postleitzahl bricht nicht: `region.test.ts` und `abdeckung.test.ts` mit 45117. Umkreis und Region treffen nicht, ein Muster trifft weiter. Ist die Postleitzahl des Betriebs unbekannt, wirkt der Umkreis nicht.
- Ohne Auskunft wie bisher: `region.test.ts` („ohne Auskunft wie bisher …“), `abdeckung.test.ts` (`gemeindenMitPartner` ohne Auskunft, `passendePartner` und `terminstandorte` ohne Auskunft), dazu die unveränderten Bestandstests in `auftragsweg.test.ts` und `ortsseiten.test.ts`
- Datenbanktest der Vorschlagsliste: `src/lib/partner/abdeckung.db.test.ts`. Ein Betrieb mit Sitz 35576 und 20 km Umkreis, ohne Postleitzahlen, erscheint am Vorgang mit 35390 als „Testbetrieb nur Umkreis (Wetzlar): Umkreis: 10,8 km von 35576 (bis 20 km)“. Bei 35683 erscheint er nicht, ebenso wenig, wenn er pausiert ist.

## OFFENE FRAGEN

1. Server-Aufrufer des Partnerwegs liegt außerhalb meiner Schreibrechte. `src/lib/partner/partnerweg-daten.ts` (`partnerFuerAuftragsweg`, `standorteErmitteln`) liest weder `plz` noch Umkreis oder Regionen und gibt keine Auskunft mit. Deshalb rechnet der Partnerweg für Kunden (hinter `PARTNERMODELL_B`) heute weiter nur mit den Postleitzahlen. `passendePartner` und `terminstandorte` sind vorbereitet. Fertiger Vorschlag:
   - in `select` `plz: true` ergänzen
   - die Abbildung durch `gefunden.docs.map(partnerFuerWegAusBetrieb)` ersetzen (Import aus `@/lib/auftragsweg`)
   - in `standorteErmitteln` `abdeckung: abdeckungsAuskunft(await ortsstamm())` mitgeben (Importe `@/lib/orte/abdeckung` und `@/lib/orte/stamm`, beide auf dem Server zulässig), am besten in `try`, damit ein nicht lesbarer Stamm nur den Umkreis abschaltet
   Weil das den Zahlweg berührt (Partnerweg heißt Gesamtzahlung), soll das der Orchestrator bewusst einschalten.
2. `docs/betrieb/orte-pflegen.md` Zeile 40 sagt noch „Nur diese zählen für ‚Partner deckt ab‘. Der Umkreis in Kilometern wird noch nicht ausgewertet.“ Die Datei liegt nicht in meinen Schreibrechten. Vorschlag: „… die Postleitzahlen des Einsatzgebiets, den Umkreis (mit Postleitzahl des Betriebs) oder Orte und Landkreise mit amtlichem Schlüssel pflegen. Es reicht, wenn eines passt; die Regel steht in `docs/betrieb/partner-pruefen.md`, Abschnitt 6.“
3. Hinweis am einzelnen Partnerbetrieb: Wäre ein Hinweis gewünscht, der direkt am Datensatz sagt, dass die eingetragene Postleitzahl des Betriebs nicht im Stamm steht und der Umkreis deshalb nicht wirkt? Das bräuchte eine kleine Admin-Komponente oder ein virtuelles Feld. Beides geht über Hinweistexte hinaus, ein Schema bräuchte es nicht.
4. Gegenseitiger Import `auftragsweg.ts` ↔ `partner/region.ts` (siehe GEMEINSAME DATEIEN): Sollen `plzMusterAusText` und `plzPasst` in ein eigenes Modul, etwa `src/lib/postleitzahl.ts`, wandern? Ein späteres Paket mit Schreibrecht dafür könnte das tun. Heute funktioniert es, ist aber zerbrechlich, falls jemand beim Laden einer der beiden Dateien die andere benutzt.
5. Ortsseiten von Gemeinden ohne Postleitzahl (Wesertal, Oberzent): Teil B rechnet „Partner deckt ab“ über die Postleitzahlen der Gemeinde. Ein Partner mit genau dieser Gemeinde oder ihrem Landkreis als Region deckt sie deshalb nicht ab. Ich habe das nicht geändert, weil das Paket die Abdeckung je Postleitzahl festlegt. Soll eine Region auch ohne Postleitzahl für die Ortsseite zählen?
6. Aus Teil B (MA-58, weiter offen): Zählt ein Partner mit Abrechnungsmodell A als Leistungsweg einer Ortsseite? An der Abdeckung habe ich dafür nichts geändert.
7. Vertragsentwurf (`src/lib/pdf/partnervertrag.ts`, `einsatzgebietText`, Platzhalter „Postleitzahlen und Umkreis“): Er nennt nur Postleitzahlen und „Umkreis N km“. Eingetragene Orte und Landkreise fehlen, obwohl sie jetzt zur Zuordnung führen; der Mittelpunkt (Postleitzahl des Betriebs, Luftlinie) fehlt; bei 0 steht „Umkreis 0 km“, obwohl 0 „kein Umkreis“ heißt. Vorschlag: Regionen ergänzen („Landkreis Lahn-Dill-Kreis“), den Umkreis als „Umkreis 20 km um 35576“ ausgeben und bei 0 weglassen. Rechtsentwurf (G9, R10): nur über ein Paket mit Freigabe des Inhabers bzw. Anwalts.
8. Umkreis aus der Bewerbung: Der Einsatzradius der Bewerbung (Selbstangabe bis 300 km) wird über `partnerbetriebAusBewerbung` und `bewerbungEinsetzen` in `einsatzgebiet.radiusKm` übernommen und wirkt seit diesem Paket mit dem Freischalten. Soll er weiter vorbelegt werden, oder soll das Team den Umkreis selbst eintragen? (Änderung am Bewerbungsweg liegt außerhalb dieses Pakets.)

## FÜR MENSCHEN

- Inhaber: Mit Umkreis und Landkreis kann ein Betrieb jetzt viel mehr Orte abdecken als mit wenigen Postleitzahlen. Ein Betrieb mit „Lahn-Dill-Kreis“ deckt jede Postleitzahl des Kreises ab, ein Umkreis von 100 km einen großen Teil Hessens. Das wirkt auf die Vorschlagsliste, auf „Partner deckt ab“ an Ortsseiten und damit auf deren Indexierbarkeit und den Satz „In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner.“. Bitte bestätigen, dass Umkreis und Landkreis so weit gelten sollen. Der Umkreis ist Luftlinie, keine Fahrstrecke.
- Orchestrator: OFFENE FRAGE 1 (Partnerweg-Daten, mit fertigem Vorschlag), 2 (`orte-pflegen.md`) und 4 (Modul für Postleitzahlen) einem Paket zuweisen.
- Inhaber: Soll der Einsatzradius aus der Bewerbung weiter als Umkreis vorbelegt werden (OFFENE FRAGE 8)?
- Team/Inhaber vor dem Einspielen: Die Umkreise der schon freigeschalteten Betriebe prüfen. Sie stammen meist aus der Bewerbung (Selbstangabe bis 300 km) und gelten nach diesem Paket sofort für Vorschlagsliste, Postleitzahl-Abfrage und Ortsseiten.
- Orchestrator: MA-54 anpassen. Punkt (4) „Postleitzahlen, Umkreis oder Orte/Landkreise mit Schlüssel pflegen“; Folgensatz „Ohne Postleitzahl, Umkreis oder Region bekommt ein Partner keine Anfragen vorgeschlagen.“; neuer Punkt: Reichweite von Umkreis und Landkreis bestätigen (Luftlinie, keine Fahrstrecke), Umkreis aus der Bewerbung weiter vorbelegen?
- Orchestrator: `docs/betrieb/orte-pflegen.md` Abschnitt 3 Punkt 1 vor dem Abschluss mit dem Vorschlag aus OFFENE FRAGE 2 ersetzen.
- Team: Am Partnerbetrieb die Postleitzahl des Betriebs pflegen, wenn ein Umkreis gelten soll. Bei Orten und Landkreisen den amtlichen Schlüssel eintragen; ein Name allein wirkt nicht.

## Nachbesserung

Stand 16.11.2026, nach zwei Gegenprüfungen. Jeder Befund am Code geprüft.

1. [rot] partner-pruefen.md:73, Partnerweg in „dieselbe Regel“: **behoben.** Zutreffend: `partnerweg-daten.ts:26–34` liest kein `plz`, bildet nur Muster ab, `standorteErmitteln` gibt keine `abdeckung` mit. Der Satz nennt jetzt nur Vorschlagsliste, Postleitzahl-Abfrage und Ortsseiten und sagt, dass der Partnerweg für Kunden bis auf Weiteres nur mit den eingetragenen Postleitzahlen rechnet und die Vorschlagsliste im Partnerweg deshalb mehr Betriebe zeigen kann. Umstellung von `partnerweg-daten.ts` bleibt OFFENE FRAGE 1 (eigenes Paket).
2. [rot] Umkreis aus der Bewerbung: **behoben, soweit in den Schreibrechten.** Zutreffend (`bewerbungsformular.ts:301–302`, `partner-bewerbung.ts` übernimmt in leere Felder). partner-pruefen.md Abschnitt 6 und der Hinweis an `radiusKm` (Partnerbetriebe.ts) sagen jetzt: „Der Umkreis kommt aus der Bewerbung. Prüfen Sie ihn vor dem Freischalten; er gilt ab dann.“, die Anleitung zusätzlich, dass das für schon freigeschaltete Betriebe gilt. Neu: OFFENE FRAGE 8 und zwei Punkte unter FÜR MENSCHEN (Bestandsumkreise vor dem Einspielen prüfen; Inhaber: weiter vorbelegen?). `src/payload-types.ts` neu erzeugt.
3. [rot] orte-pflegen.md:40 veraltet: **zutreffend, in diesem Paket nicht behebbar.** Die Datei liegt außerhalb der Schreibrechte (die Nachbesserung hat dieselben). Der fertige Wortlaut steht in OFFENE FRAGE 2; unter FÜR MENSCHEN ist der Orchestrator gebeten, ihn vor dem Abschluss einzusetzen.
4. [rot] MENSCHEN.md MA-54: **zutreffend, Sache des Orchestrators.** Steuerdatei außerhalb der Schreibrechte; der Wortlaut für Punkt (4), den Folgensatz und den neuen Punkt steht unter FÜR MENSCHEN.
5. [gelb] partnervertrag.ts, Einsatzgebiet im Vertragsentwurf: **zutreffend, als OFFENE FRAGE 7 aufgenommen** (Rechtsentwurf, G9/R10, außerhalb der Schreibrechte; `einsatzgebietText` Zeile 123 gibt bei 0 „Umkreis 0 km“ aus).
6. [gelb] Beispiel 12,4 km erfunden: **behoben.** Jetzt das gemessene „Umkreis: 10,8 km von 35576 (bis 20 km)“ (35576 nach 35390, wie im Datenbanktest).
7. [gelb] „Es reicht, wenn eines davon passt“ mehrdeutig: **behoben.** Jetzt: „Für die Postleitzahl reicht eines: eine seiner Postleitzahlen, sein Umkreis oder ein eingetragener Ort oder Landkreis, zu dem sie gehört.“ Leistung und Freischaltung bleiben Pflicht.
8. [gelb] payload-types.ts fehlt im Bericht: **behoben.** Unter GEÄNDERTE DATEIEN mit Vermerk „nur erzeugte Beschreibungen, kein Schema“; Hinweis an den Orchestrator für den Commit.
9. [rot] wie Befund 1 (zweiter Prüfer): **behoben** mit derselben Änderung.
10. [gelb] wie Befund 8 (zweiter Prüfer): **behoben** mit derselben Änderung.

Geändert in der Nachbesserung: `docs/betrieb/partner-pruefen.md`, `src/payload/collections/Partnerbetriebe.ts` (Hinweis an `radiusKm`), `src/payload-types.ts` (neu erzeugt mit `payload generate:types` über die Datenweiche, nur Kommentar), dieser Bericht.

Prüfungen danach, alle über die Datenweiche: vitest 261 Dateien, 4102 von 4102 grün · typecheck grün · lint grün · Datenbanktests (`--pg`) 30 Dateien, 179 von 179 grün · build grün, 181 von 181 Seiten.

## Nachbesserung 2

Stand 16.11.2026, auf Anweisung des Orchestrators (A-070). Kurzprüfung der ersten Nachbesserung: Die zehn Befunde sind im Arbeitsbaum bearbeitet wie oben beschrieben (partner-pruefen.md mit 10,8 km und der eindeutigen „reicht eines“-Formulierung, Hinweis an `radiusKm`, `src/payload-types.ts` im Bericht, OFFENE FRAGEN 7 und 8). Dort ist nichts erneut geändert. Durch Nachbesserung 2 sind die Befunde 1/9 (Partnerweg), 2 (Bewerbungsradius) und 3 (orte-pflegen.md) jetzt auch im Code bzw. in der Anleitung erledigt, siehe unten.

1. **Regel „Region geprüft“ (löst den roten Befund 2 zum Bewerbungsradius).** Umkreis und eingetragene Orte oder Landkreise zählen nur, wenn am Betrieb der Punkt „Region und Radius“ der Prüfliste erledigt ist (`punktErledigt`: Haken, Datum, Prüfer). Postleitzahlen-Muster zählen immer.
   - `src/lib/partner/region.ts`: neues Feld `regionGeprueft` an `PartnerFuerRegion` (Zeile 64), neue Funktion `regionGeprueftAus(pruefliste)` (Zeile 68, ruft `punktErledigt` aus `pruefliste.ts`), in `abdeckungsGruende` zählen (b) und (c) nur bei `regionGeprueft === true` (Zeile 133). `brauchtOrtsstamm` lädt den Stamm nur noch für geprüfte Betriebe (Zeile 200).
   - `src/lib/auftragsweg.ts`: `PartnerFuerWeg.regionGeprueft`, `PartnerbetriebFuerWeg.pruefliste`; `partnerFuerWegAusBetrieb` setzt `regionGeprueft: regionGeprueftAus(doc.pruefliste)` (Zeile 122).
   - Alle Leser aus der Datenbank lesen den Punkt mit: Hook der Vorschlagsliste (liest den ganzen Betrieb, Typ um `pruefliste` ergänzt), `partnerFuerAbdeckung` in `src/lib/orte/stamm.ts` (`select … pruefliste: { region: true }`, Zeile 48, und `regionGeprueft` in der Abbildung), `partnerweg-daten.ts` (Zeile 33).
   - Wirkung: Für neue Betriebe ändert sich nichts (Freischalten verlangt die ganze Prüfliste). Betriebe mit dem Vermerk „vor Einführung der Prüfliste freigeschaltet“ decken nur über ihre Postleitzahlen ab, bis das Team den Punkt abhakt. Der vorbelegte Bewerbungsradius wirkt damit nie ohne Bestätigung des Teams.
   - Hinweistexte in `Partnerbetriebe.ts` an Postleitzahlen, `radiusKm` und „Orte und Landkreise“: „wirkt erst, wenn in der Prüfliste ‚Region und Radius‘ abgehakt ist (mit Datum und Prüfer)“. `docs/betrieb/partner-pruefen.md` Abschnitt 6: eigener fetter Absatz dazu, der Satz „gilt ab dann … auch für schon freigeschaltete Betriebe“ ist ersetzt, weil er nach der Regel nicht mehr stimmt.
   - Tests (`region.test.ts`, neuer Block „Regel Region geprüft“): Punkt erledigt nur mit Haken, Datum und Prüfer; Umkreis, Ort und Landkreis treffen je nur mit erledigtem Punkt, ohne Punkt, mit Haken ohne Datum oder ohne Prüfer nicht; ohne Punkt zählt nur das Muster; Betrieb „vor Einführung“ mit Umkreis deckt nur über sein Muster ab. Vorhandene Tests mit Umkreis oder Region haben `regionGeprueft: true` bekommen (sie prüfen weiter dasselbe); `abdeckung.test.ts` und der Hook-Test zusätzlich je ein Gegenfall ohne Punkt. Keine Prüfung gelockert.
   - Datenbanktest `abdeckung.db.test.ts`: Der Umkreisbetrieb hat den Punkt erledigt; ein zweiter Betrieb mit gleichem Umkreis und Vermerk „vor Einführung“ erscheint nicht; fehlt beim ersten der Prüfer, erscheint auch er nicht. Neu: `partnerFuerAuftragsweg` liest Postleitzahl, Umkreis und den Punkt aus der echten Datenbank (belegt, dass `select: { pruefliste: { region: true } }` greift).

2. **Partnerweg für Kunden mit derselben Definition (OFFENE FRAGE 1, freigegeben).** `src/lib/partner/partnerweg-daten.ts` liest `plz` und `pruefliste.region` mit, bildet über `partnerFuerWegAusBetrieb` ab (Zeile 35) und gibt die Auskunft aus dem Ortsstamm an `terminstandorte` weiter (Zeile 65; nur wenn ein Betrieb einen geprüften Umkreis oder eine geprüfte Region hat; ist der Stamm nicht lesbar, gelten nur die Postleitzahlen und das Log meldet es). `zahlungsPlan`, Beträge und der Schalter `PARTNERMODELL_B` sind unverändert; ohne Schalter gibt `partnerFuerAuftragsweg` wie bisher keine Partner zurück. Neuer Test `src/lib/partner/partnerweg-daten.test.ts` (6 Tests): Für nur Muster, nur Umkreis, nur Region, Punkt nicht erledigt, „vor Einführung“, pausiert, Modell A und eine unbekannte Postleitzahl (45117) liefern `standorteErmitteln` und die Vorschlagsliste im Partnerweg dieselben Betriebe; die Vorschlagsliste bei einer Vermittlung dieselben plus Modell A. Dazu: Punkt nachträglich abgehakt wirkt in beiden; ohne Schalter nur die Werkstatt. `partner-pruefen.md` Abschnitt 6 sagt jetzt wieder, dass dieselbe Regel auch im Partnerweg gilt (dort zusätzlich nur Abrechnung B). OFFENE FRAGE 1 ist damit erledigt.

3. **`docs/betrieb/orte-pflegen.md`, nur Abschnitt 3 Punkt 1:** Der veraltete Satz ist ersetzt durch Postleitzahlen, Umkreis (mit Postleitzahl des Betriebs) oder Orte und Landkreise mit amtlichem Schlüssel; Umkreis und Region wirken erst mit abgehaktem Punkt „Region und Radius“; Verweis auf `partner-pruefen.md` Abschnitt 6. OFFENE FRAGE 2 ist erledigt.

4. **Gegenseitiger Import aufgelöst (OFFENE FRAGE 4).** Neues reines Modul `src/lib/partner/postleitzahl-muster.ts` (ohne Importe) mit `plzMusterAusText` und `plzPasst`, Code unverändert übernommen. `src/lib/auftragsweg.ts` importiert und exportiert beide weiter (`export { plzMusterAusText, plzPasst }`), so bleiben `payload-mapping.ts`, `terminort.ts` und alle Tests unverändert. `region.ts` importiert nur noch das neue Modul (Zeile 31); `grep` findet in `src/lib/partner/*.ts` keinen Import von `auftragsweg` außer in `partnerweg-daten.ts` (Server, `@/lib/auftragsweg`, kein Kreis). Die Bestandstests zu beiden Funktionen laufen unverändert grün. OFFENE FRAGE 4 ist erledigt.

5. **Nicht angefasst:** `src/lib/pdf/partnervertrag.ts` (bleibt OFFENE FRAGE 7), Datenschema und Migrationen (kein neues Datenbankfeld; `regionGeprueft` ist nur ein berechneter Wert im Speicher), `MENSCHEN.md`, `next.config.ts`, `package.json`, Schriften, `src/lib/spaet-vorladen.ts`, die Bausteine der Formulare.

Geändert in Nachbesserung 2: `src/lib/partner/region.ts`, `src/lib/partner/region.test.ts`, `src/lib/partner/postleitzahl-muster.ts` (neu), `src/lib/auftragsweg.ts`, `src/lib/partner/partnerweg-daten.ts`, `src/lib/partner/partnerweg-daten.test.ts` (neu), `src/lib/partner/abdeckung.db.test.ts`, `src/lib/orte/stamm.ts`, `src/lib/orte/abdeckung.test.ts`, `src/payload/hooks/auftragsweg.ts` (Typ und Kommentare), `src/payload/hooks/auftragsweg.test.ts`, `src/payload/collections/Partnerbetriebe.ts` (nur Hinweistexte und ein Kommentar), `src/payload-types.ts` (neu erzeugt mit `payload generate:types` über die Datenweiche, nur JSDoc-Kommentare, kein Schema), `docs/betrieb/partner-pruefen.md`, `docs/betrieb/orte-pflegen.md` (nur Abschnitt 3 Punkt 1), dieser Bericht.

Hinweis: Die Zeilenangaben unter BELEGE beziehen sich auf den Stand vor Nachbesserung 2; in `region.ts` sind sie um gut zehn Zeilen verschoben (Definition `abdeckungsGruende` jetzt ab Zeile 118). Es gibt weiter nur eine Definition.

Offen bleiben aus der Liste oben: 3 (Hinweis am einzelnen Datensatz), 5 (Gemeinden ohne Postleitzahl), 6 (Modell A und Ortsseiten, MA-58), 7 (Vertragsentwurf), 8 (Bewerbungsradius weiter vorbelegen? Durch die Regel „Region geprüft“ nicht mehr dringlich, die Frage an den Inhaber bleibt). Unter FÜR MENSCHEN entfällt „Umkreise der schon freigeschalteten Betriebe vor dem Einspielen prüfen“ als Voraussetzung: Sie wirken erst nach dem Abhaken. Neu für das Team: Bei Betrieben mit dem Vermerk „vor Einführung der Prüfliste“ den Punkt „Region und Radius“ prüfen und abhaken, wenn Umkreis oder Region gelten sollen.

Prüfungen danach, alle über die Datenweiche: vitest 264 Dateien, 4122 von 4122 grün (die Zahl der Dateien enthält auch eine neue Testdatei des parallelen Pakets FA-SEO-03B) · typecheck grün, 0 Fehler · lint grün, keine Befunde · Datenbanktests (`--pg`) 30 Dateien, 182 von 182 grün · build grün, 181 von 181 Seiten.

## Nachbesserung 3

Stand 16.11.2026, auf Anweisung des Orchestrators: nur Tests gehärtet, kein neues Verhalten. Nachbesserung 1 und 2 sind unverändert. Kein Test hat einen Fehler im Produktcode gezeigt, also gibt es **keinen Fund** und keine Änderung am Produktcode.

1. **Postleitzahl-Abfrage gegen die Testdatenbank** (`src/lib/partner/abdeckung.db.test.ts`, neuer Block). Zwei Betriebe haben nur einen Umkreis (20 km um 35576). Der eine hat die Leistung `motorrad-weitere` und den erledigten Punkt „Region und Radius“, der andere `reparatur-gehaeuse` und den Vermerk „vor Einführung“. Kein anderer Datenbanktest vergibt diese Leistungen. Ergebnis von `postleitzahlAbfragen('35390', …)`: Der geprüfte Betrieb zählt (`partnerVorhanden: true`), der ungeprüfte nicht. Für 35683 (25,3 km) zählt auch der geprüfte nicht. Gegenprobe: Ich habe in `partnerFuerAbdeckung` (stamm.ts, Zeile 48) einmal `plz` und einmal `pruefliste: { region: true }` aus dem `select` gestrichen. Beide Male wurde der Test rot. Danach habe ich die Datei aus einer Sicherung zurückgelegt; `cmp` bestätigt, dass sie gleich ist.
2. **Mock beachtet `select`** (`partnerweg-daten.test.ts`). Das Mock von `payloadInstanz().find` liefert nur die ausgewählten Felder und immer `id`, wie Payload. Das gilt auch geschachtelt (`zuschneiden`, z. B. `pruefliste: { region: true }`). Gegenprobe wie oben in `partnerweg-daten.ts`: Ohne `plz` werden 4 Tests rot, ohne `pruefliste.region` 6 Tests. Danach ist die Datei zurückgelegt; laut `git status` ist sie unverändert. Ein neuer Test prüft außerdem das `select` selbst. Es muss `plz`, `einsatzgebiet` und `pruefliste.region` enthalten und darf `firma`, `ansprechpartner`, `email` und `telefon` nicht enthalten.
3. **Ortsstamm nicht lesbar**:
   - `partnerweg-daten.test.ts`: `ortsstamm` wirft (Mock um den echten Stamm). Für 35390 bleibt nur Betrieb 1 (Muster). Betrieb 2 mit geprüftem Umkreis fällt weg. `standorteErmitteln` wirft nicht, und `console.error` wird mit „[auftragsweg] Ortsstamm für den Partnerweg nicht lesbar“ aufgerufen.
   - `src/payload/hooks/auftragsweg.test.ts`: `ortsstammIndexLesen` wirft (Mock um `../../lib/orte/dateien`; alle anderen Tests der Datei lesen weiter den echten Stamm). Bei einer Vermittlung und im Partnerweg nennt die Vorschlagsliste nur den Betrieb mit Muster. Sie gibt einen Text zurück, nicht `null`, und es kommt kein „Partnervorschläge nicht geladen“. `logger.warn` meldet „Ortsstamm für die Partnervorschläge nicht lesbar“. Gegenprobe mit lesbarem Stamm: Alle drei Betriebe erscheinen mit ihrem Grund.
4. **Grenzprüfung** (neu: `src/lib/partner/grenze.test.ts`). Stand am Code: Nur `partnerweg-daten.ts` hat `server-only`, Importe mit `@/` und einen Import von `orte/stamm`. Alle anderen Dateien unter `src/lib/partner` importieren nur relativ (`../types`, `../format`, `./…`). Daraus folgt die Regel: Keine Datei unter `src/lib/partner` außer Tests und `partnerweg-daten.ts` enthält `server-only`, einen Import mit `@/` oder einen Import von `orte/stamm` bzw. `orte/dateien`. Geprüft werden statische Importe, `export … from`, dynamisches `import()` und `require()`.
   - Die Ausnahme ist im Test begründet: Sie ist der Server-Aufrufer des Partnerwegs und wird nur von `src/lib/actions` geladen. Ein Test prüft auch, dass die Ausnahme selbst mit `import 'server-only'` beginnt.
   - Zweite Regel: Keine Datei unter `src/payload/collections` und `src/payload/hooks` importiert `partnerweg-daten`.
   - `src/payload/components` ist ausdrücklich ausgenommen (`Ortsseiten.tsx` nutzt `stamm.ts` als Serverbaustein).
   - Eine Gegenprobe zeigt, dass die Regel alle vier Arten von Verstößen erkennt.
5. **Drei Grenzfälle im Gleichstandstest**, alle mit erledigtem Punkt „Region und Radius“:
   - Betrieb 8: Landkreis mit achtstelligem Schlüssel `06532006`.
   - Betrieb 9: `radiusKm: 0` mit Sitz 35576.
   - Betrieb 10: `radiusKm: 300` ohne Postleitzahl des Betriebs.
   Keiner von ihnen erscheint im Partnerweg oder in der Vorschlagsliste (35390, 35683, 45117, 01067). Neu ist der Fall 35576 Wetzlar, der Sitz selbst. Dort erscheinen die Betriebe 2 (Umkreis) und 3 (Landkreis), in der Vermittlung dazu 7 (Modell A). Betrieb 9 erscheint nicht, damit ist belegt, dass 0 km „kein Umkreis“ heißt.
6. **Ohne Schalter `PARTNERMODELL_B`**: Spione auf `payloadInstanz().find` und `ortsstamm` belegen, dass keiner von beiden aufgerufen wird. Für Kunden bleibt nur die Werkstatt.
7. **Ortsstamm wird auch bei frühem Ende geladen (vermerkt, keine Codeänderung).** Mit Schalter lädt `standorteErmitteln` den Ortsstamm, sobald ein Betrieb einen geprüften Umkreis oder eine geprüfte Region hat. Das passiert auch dann, wenn `terminstandorte` danach früh endet: im Eigenbereich, im Ausland oder bei einer ungültigen Postleitzahl. Das ist bewusst hingenommen, weil der Stamm je Prozess nur einmal gelesen wird (`ortsstammIndexLesen`, Zwischenspeicher). Messung über die Datenweiche, je ein neuer Prozess (`npx tsx`, `ortsstammIndexLesen()` zweimal), 4 Kerne, `content/orte` 3,7 MB:
   - erstes Lesen mit Index: 70, 72 und 71 ms in drei Läufen
   - zweiter Aufruf: unter 0,01 ms
   Die Kosten fallen also einmal je Prozess an, mit etwa 70 ms.

Geändert in Nachbesserung 3:
- `src/lib/partner/abdeckung.db.test.ts`: `umkreisBetrieb` mit optionalen Auftragsarten, neuer Block
- `src/lib/partner/partnerweg-daten.test.ts`: `select`-treues Mock, Spione, Stamm-Fehlerfall, Betriebe 8 bis 10, Fall 35576, Test des `select`
- `src/payload/hooks/auftragsweg.test.ts`: Mock um `orte/dateien`, ein neuer Test
- `src/lib/partner/grenze.test.ts` (neu)
- dieser Bericht

Prüfungen danach, alle über die Datenweiche:
- vitest: 265 Dateien, 4131 von 4131 grün
- typecheck: grün
- lint: grün, keine Befunde
- Datenbanktests (`--pg`): 30 Dateien, 183 von 183 grün
- Kein Build (baut der Orchestrator bei der Abnahme).

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-PLATTFORM-01C`, beide Pakete der Welle gemeinsam im Arbeitsbaum, nach allen Eingriffen des Orchestrators): Typprüfung grün, Lint grün, Unit 4145 von 4145, Datenbanktests 183 von 183, Build 181 von 181 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 137 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29). Sichtproben: Ortsseiten 24 von 24, Menü und Schrift 19 von 19; Schrift der Zeichnungen und Suchlauf nach überlaufendem Text über alle Seiten bei vier Breiten ohne neuen Fund.

Verlauf: Umsetzung, zwei Gegenprüfer, erste Nachbesserung. Die Gegenprüfung fand rot, dass der selbst angegebene Umkreis aus der Bewerbung (bis 300 km) ohne Bestätigung des Teams als Abdeckung gegolten hätte, auch für Ortsseiten und den öffentlichen Partnersatz. Entscheidung A-070, zweite Nachbesserung: Umkreis und Region zählen erst mit erledigtem Punkt „Region und Radius“ der Prüfliste; der Partnerweg für Kunden rechnet mit derselben Definition. Eine eigene Gegenprüfung der zweiten Nachbesserung mit zwei Prüfern (Workflow `fa-nachpruefung`) fand keinen roten und sieben gelbe Befunde (Lücken in Tests); die dritte Nachbesserung hat sie geschlossen, mit Gegenproben (ohne `plz` oder `pruefliste.region` im `select` werden die Tests rot).

Vom Orchestrator in der Abnahme gefunden und behoben:
- Die Nachmessung des Skript-Gewichts (für FA-SEO-03B) zeigte, dass dieses Paket rund 20 KB Partnerlogik in das Skript-Bündel des Assistenten gezogen hatte: `src/lib/auftragsweg.ts` laden auch Bausteine im Browser (Assistent, Preisanzeige, Bestätigung), und seit diesem Paket importierte die Datei die Abdeckungsregel samt Vermittlung. Die Partnerlogik liegt jetzt in `src/lib/auftragsweg-partner.ts` (`PartnerFuerWeg`, `PartnerbetriebFuerWeg`, `partnerFuerWegAusBetrieb`, `passendePartner`, `StandortEingabe`, `terminstandorte`, Wort für Wort verschoben), das nur der Server lädt; `auftragsweg.ts` importiert weder dieses Modul noch `partner/region`, `partner/vermittlung` oder `partner/leistungen`. Alle Aufrufer sind umgestellt (`partnerweg-daten.ts`, Hook der Vorschlagsliste, `orte/stamm.ts`, Tests). Neuer Test `src/lib/auftragsweg-grenze.test.ts` (4 Tests): keine verbotenen Importe, die verschobenen Namen werden nicht weitergegeben, kein Baustein mit „use client“ importiert das Server-Modul. Nachgemessen am Build: Im Bündel des Assistenten steht keine Partnerlogik mehr (auch die Namen der neun Partnerleistungen nicht, die dort schon vor diesem Paket lagen); der Assistent lädt 18 statt 21 Skripte.
- MA-54 an die neue Regel angepasst (Punkt 12).

Nicht im Browser gesehen: die Vorschlagsliste am Vorgang mit Gründen und die Hinweistexte am Partnerbetrieb (ohne Datenbank kein Admin am Prüfserver; belegt über Unit- und Datenbanktests mit erfundenen Betrieben), der Partnerweg für Kunden (Schalter aus). Die Formulare der Kundenwege laden und wechseln den Schritt ohne Konsolenfehler (Probe mit 14 Fällen, siehe FA-SEO-03B).

Offen bleibt: Vertragsentwurf nennt das Einsatzgebiet nur mit Postleitzahlen und Umkreis (wartet auf den Anwalt, MA-29); Hinweis am einzelnen Betrieb, wenn seine Postleitzahl nicht im Stamm steht; Region für Gemeinden ohne Postleitzahl (Wesertal, Oberzent); Vorbelegung des Umkreises aus der Bewerbung (MA-54 Punkt 12); Partner mit Modell A als Leistungsweg (MA-58).

=== ENDE FA-PLATTFORM-01C · BEREIT ZUR RÜCKGABE ===
