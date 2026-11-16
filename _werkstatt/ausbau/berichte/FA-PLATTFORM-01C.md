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

## FÜR MENSCHEN

- Inhaber: Mit Umkreis und Landkreis kann ein Betrieb jetzt viel mehr Orte abdecken als mit wenigen Postleitzahlen. Ein Betrieb mit „Lahn-Dill-Kreis“ deckt jede Postleitzahl des Kreises ab, ein Umkreis von 100 km einen großen Teil Hessens. Das wirkt auf die Vorschlagsliste, auf „Partner deckt ab“ an Ortsseiten und damit auf deren Indexierbarkeit und den Satz „In Ihrer Region arbeitet ein geprüfter Autoschlüssel-Partner.“. Bitte bestätigen, dass Umkreis und Landkreis so weit gelten sollen. Der Umkreis ist Luftlinie, keine Fahrstrecke.
- Orchestrator: OFFENE FRAGE 1 (Partnerweg-Daten, mit fertigem Vorschlag), 2 (`orte-pflegen.md`) und 4 (Modul für Postleitzahlen) einem Paket zuweisen.
- Team: Am Partnerbetrieb die Postleitzahl des Betriebs pflegen, wenn ein Umkreis gelten soll. Bei Orten und Landkreisen den amtlichen Schlüssel eintragen; ein Name allein wirkt nicht.

=== ENDE FA-PLATTFORM-01C · BEREIT ZUR RÜCKGABE ===
