# Bericht FA-KERN-07 · Autoschlüssel: Lücken aus der Bestandsaufnahme

## GEÄNDERTE DATEIEN
- `src/app/(site)/autoschluessel/schluesselverlust/page.tsx` (neu)
- `src/app/(site)/autoschluessel/anfrage/leistung-vorwahl.ts` (neu), `leistung-vorwahl.test.ts` (neu)
- `src/app/(site)/autoschluessel/anfrage/page.tsx` (liest `?leistung=`)
- `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (Vorwahl der Leistung)
- `src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx` (Hauptknopf und Text darüber)
- `src/app/(site)/autoschluessel/page.tsx` (Glossar-Verweis „Schlüsselverlust“, Satz zur Elektronik)
- `src/app/(site)/autoschluessel/nachmachen/page.tsx` (ein Verweis auf die neue Seite, zusätzlich)
- `src/lib/navigation.ts` (der eine Eintrag „Schlüssel verloren?“)
- `src/app/sitemap.ts` (neue Adresse)
- `content/seo.json`, `src/lib/data/defaults/content.ts` (nur der Verweis der Fahrzeugöffnung)
- `content/car-key-services.json`, `src/lib/data/defaults/pricing.ts` (nur der Beschreibungssatz, keine Zahl)
- `content/rubriken.json`, `src/lib/data/defaults/rubriken.ts` (nur der Schritt „Rückversand“)
- `src/lib/actions/records.ts` (Serverregel FA-06-U2)
- `src/lib/terminort.ts` (nur der Kommentar)
- Tests: `src/lib/actions/security.test.ts`, `src/lib/actions/auftragsweg.test.ts` (Testdaten angepasst, siehe unten), `src/lib/rubriken.test.ts`, `src/lib/data/seo-laengen.test.ts`, `src/lib/data/zusagen-bedingung.test.ts` (neu)
- dieser Bericht

## WAS UND WARUM
1. **Schlüsselverlust (FA-05-07).** Neue Leistungsseite `/autoschluessel/schluesselverlust` mit `LeistungsArtikel` (Seitenkopf, Abschnitte, Strukturdaten mit Leistung, Brotkrumen und FAQ, „Passt dazu“) wie die Nachbarseiten. Inhalt nur aus dem Bestand: Abschnitte „Ein Schlüssel ist verloren gegangen“ und „Es ist kein Schlüssel mehr da“ aus „Nachmachen“ (samt Hinweis `ON_SITE_HINT`), Ratgeber „Autoschlüssel verloren“ (suchen, prüfen was da ist, Unterlagen mit Adresse, verlorenen Schlüssel aus dem Fahrzeug entfernen), Nachweis wortgleich mit „Nachmachen“ (R13), Aufbewahrung über die Einstellungen, „Sind alle Schlüssel verloren, entfallen die Fotos“ aus der Übersicht, Abgrenzung zur Fahrzeugöffnung. Versicherung nur als Verweis auf den eigenen Vertrag (Abgrenzung und eine FAQ). Kein Preis, keine Frist, keine Erreichbarkeit. Hauptknopf „Termin anfragen“ auf `/autoschluessel/anfrage?leistung=ersatz-bei-verlust`; der Text darüber sagt, dass bei noch funktionierendem Schlüssel „Zweitschlüssel anfertigen“ passt (Wortlaut der Leistungsnamen aus den Daten). Ohne Eintrag in `content/seo.json` (kein neuer Datensatz im Seed); Titel und Beschreibung stehen als Rückfall in `generateMetadata` und werden über `SEITEN_MIT_RUECKFALL` in `seo-laengen.test.ts` auf Länge, Gedankenstrich und Zusagen geprüft (Titel 59 Zeichen samt Marke, Beschreibung 143). Glossar „Schlüsselverlust“ auf der Übersicht zeigt auf die neue Seite, der Navigationseintrag „Schlüssel verloren?“ unter „Fahrzeuge“ ebenso (Spalte nicht länger), Sitemap ergänzt. „Nachmachen“ verweist zusätzlich auf die neue Seite; der Ratgeber-Verweis dort bleibt. Eingehende Verweise: Navigation, Übersicht, Nachmachen (waisen.test.ts grün).
2. **Fahrzeugöffnung (FA-05-09).** Der Assistent übernahm bisher keine Leistung aus der Adresse. Neu: `anfrage/page.tsx` liest `?leistung=` und lässt nur eine aktive gepflegte Leistung durch (`leistungAusAdresse`); der Assistent setzt sie als Startwert und wählt sie bei der Wahl der Schlüsselart erneut, wenn sie zur Art passt (`vorgewaehlteLeistung`), weil Marke, Modell und Art die Leistung bisher zurücksetzen. Die Auswahlregel des Schritts „Leistung“ steht jetzt einmal in `leistungPasst` (unverändert: aktiv, passende Art, kein Zweitschlüssel bei null funktionierenden Schlüsseln); ändert der Kunde danach die Zahl der Schlüssel, entfällt eine Leistung, die nicht mehr passt. Hauptknopf der Seite und der Verweis in `seo.json`/`content.ts` führen auf `/autoschluessel/anfrage?leistung=fahrzeugoeffnung`, Knopftext „Termin anfragen“ nach A-031 (jeder Knopf zu `/autoschluessel/anfrage`). Der Text über dem Knopf beschreibt jetzt den Weg im Assistenten. Hinweiskasten „Ohne Nachweis keine Öffnung“ unverändert. Kommentar in `terminort.ts` an `buchungsOrt` angeglichen (die Buchung setzt `vor-ort` für Leistungen beim Fahrzeug).
3. **Serverregel (FA-06-U2).** In `submitRecord` (records.ts), direkt nach der Prüfung der Quellen: Eine Anfrage im Bereich `autoschluessel` ohne `quelle` ist nur mit `anliegenArt: 'frage'` zulässig, genau wie das Formular sie im Browser sendet; alles andere lehnt der Server mit der üblichen Meldung ab. Die Regel sitzt in records.ts und nicht in `unterlagen-pflicht.ts`, weil sie keine Unterlage verlangt, sondern den unbekannten Weg schließt (dort gilt `undefined` weiter als allgemeine Anfrage). Die geführten Wege mit Quelle behalten ihre Pflichtregel (Fahrzeugschein, R13).
4. **Rubrik-Ziele (FA-05-04).** Test in `rubriken.test.ts`: jede Rubrik mit Status „live“ (Rückfall und `content/rubriken.json`) führt auf eine vorhandene Seite; „Transponder-Kopie“ bleibt „später“ und ohne Seite (ebenfalls festgehalten).
5. **Zusagen mit Bedingung (FA-14-11).** „Die Elektronik bleibt erhalten.“ heißt jetzt „Die Elektronik bleibt, wenn sie in das neue Gehäuse passt.“ (car-key-services.json und pricing.ts wortgleich, keine Zahl berührt), auf der Übersicht „Die vorhandene Elektronik bleibt, wenn sie in das neue Gehäuse passt.“; der Schritt „Rückversand“ heißt „Passt alles, kommt Ihr Schlüssel im neuen Gehäuse zurück.“ (rubriken.json und rubriken.ts wortgleich, Icon und Reihenfolge unverändert nach A-034). Test `zusagen-bedingung.test.ts` hält die Stellen und die Gleichheit von Daten und Rückfall fest und findet die unbedingte Form in keiner Leistung und keinem Ablaufschritt.

## GEMEINSAME DATEIEN
- `src/lib/actions/auftragsweg.test.ts`: Der Test „übernimmt keinen Auftragsweg aus den Daten des Browsers“ schickte eine Anfrage im Bereich Autoschlüssel ohne Quelle und ohne Anliegen, also genau den Fall, den die neue Regel ablehnt. Die Testdaten tragen jetzt `anliegenArt: 'frage'` (die ehrliche Frage); Zweck und Erwartungen des Tests sind unverändert, nichts gelockert. Die Datei gehört nicht zur Partnerlogik selbst, liegt aber im Umfeld von FA-PLATTFORM-01B.
- Partnerdateien nicht angefasst. Im Arbeitsbaum liegt eine Änderung an `src/lib/partner/bewerbung.ts` (anderes Paket).

## PRÜFUNG UND ERGEBNIS
- `sicher.sh --json -- npx vitest run`: 240 Dateien, 3736 Tests, davon 3734 grün, 2 rot, beide in `src/lib/partner/partner.test.ts` („Bewerbung (G-39, MA-16)“). Ursache ist die gleichzeitige, nicht von diesem Paket stammende Änderung an `src/lib/partner/bewerbung.ts` (FA-PLATTFORM-01B). Alle Tests dieses Pakets grün (security 108, rubriken 19, zusagen-bedingung 4, leistung-vorwahl, seo-laengen, waisen, sitemap). Vor der Partneränderung lief die Suite bis auf einen Test grün, den dieses Paket danach angepasst hat (siehe GEMEINSAME DATEIEN).
- `npm run typecheck`: ohne Fehler.
- `npm run lint`: ohne Fehler.
- `npm run build`: erfolgreich, `/autoschluessel/schluesselverlust` statisch vorgerendert.

## BELEGE
- Serverregel: `src/lib/actions/records.ts` nach `anfrageQuelleUnbekannt`; Test „nimmt eine allgemeine Anfrage im Bereich Autoschlüssel nur als Frage an (FA-06-U2, R13)“ in `security.test.ts` (Frage geht durch, Schlüsselwunsch, fehlende Angabe, fehlendes Thema und erfundene Schreibweise abgelehnt, auch mit allen Unterlagen; Fahrzeug-Anfrage ohne Fahrzeugschein weiter abgelehnt).
- Vorwahl: `leistung-vorwahl.test.ts` liest den Hauptknopf beider Seiten aus dem Quelltext und prüft, dass seine Leistung im Assistenten für jede Schlüsselart gewählt wird; erfundene und abgeschaltete Leistungen fallen weg.
- Browserregel als Vorbild: `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx` (Schritt „Thema“ verlangt `anliegenArt === 'frage'`, Absenden schickt `anliegenArt: 'frage'`).

## OFFENE FRAGEN
1. Fahrzeugöffnung im Assistenten: Der Assistent verlangt drei Schlüsselfotos, solange nicht „kein Schlüssel mehr“ bestätigt ist (Regel in `unterlagen-pflicht.ts`, für dieses Paket gesperrt). Wer ausgesperrt ist und den Schlüssel im Fahrzeug hat, kann ihn nicht fotografieren und hat oft auch den Fahrzeugschein im Fahrzeug. Braucht die Leistung `fahrzeugoeffnung` eine eigene Unterlagenregel (etwa Nachweis nur vor Ort, wie die Seite es beschreibt)? Das ist eine Änderung an `unterlagen-pflicht.ts` und am Zahlverhalten (G9), also Inhaber und eigenes Paket.
2. FA-06-U2, Ablage: Die Bestandsaufnahme schlägt zusätzlich vor, die zulässige Frage wie bei „Schlüssel nach Vorlage“ unter „Service und Termin“ abzulegen. Nicht umgesetzt: Das Formular zeigt nach dem Absenden die Schritte für den Bereich Autoschlüssel (`anfrage-formular.tsx`, nicht in den Schreibrechten), Server und Bestätigung würden sonst auseinanderlaufen. Ob eine Erstanfrage ohne Unterlagen überhaupt erlaubt bleibt, entscheidet der Inhaber (MA-20).
3. Knopftext Fahrzeugöffnung: nach A-031 jetzt „Termin anfragen“ statt „Fahrzeugöffnung anfragen“. Die FAQ „Wie erreiche ich Sie für eine Öffnung?“ nennt weiter „die Anfrage zur Fahrzeugöffnung“; das passt sinngemäß, kann bei der Schlussredaktion (MA-41) angeglichen werden.
4. `src/app/(site)/autoschluessel/funkschluessel/page.tsx:69` sagt „Die Elektronik bleibt dann erhalten.“ (Batterie- und Tastenwechsel, „dann“ als Bedingung). Nicht in den Schreibrechten und nicht in der Liste der Bestandsaufnahme; bitte bei der Freigabe der Formulierungen mit ansehen.
5. Auf der Übersicht `/autoschluessel` steht die neue Seite nicht in `AUF_DER_SEITE` (nur Glossar-Verweis und Satz waren erlaubt). „Passt dazu“ kann sie dort deshalb ein zweites Mal zeigen.
6. Ein gespeicherter Stand des Assistenten auf demselben Gerät geht vor der Vorbelegung (wie bisher bei Marke und Modell). Ist die Schlüsselart dort schon gewählt, greift die Vorwahl erst, wenn der Kunde die Art neu wählt.

## FÜR MENSCHEN
- Inhaber: Freigabe der Formulierungen „Die Elektronik bleibt, wenn sie in das neue Gehäuse passt.“ und „Passt alles, kommt Ihr Schlüssel im neuen Gehäuse zurück.“ (FA-14-11).
- Inhaber: Freigabe der Texte der Seite Schlüsselverlust, besonders des Hinweises zur Versicherung (nur Verweis auf den eigenen Vertrag); der Satz „Ihr vorhandener Schlüssel dient uns als Vorlage.“ ist in der Nachbesserung durch den Ratgeberwortlaut ersetzt.
- Inhaber: Unterlagen bei der Fahrzeugöffnung im Assistenten (OFFENE FRAGE 1) und MA-20 (Erstanfrage ohne Unterlagen).
- Rechtliche Prüfung des Nachweistextes der Fahrzeugöffnung bleibt offen (R10, unverändert).
- Foto für die Seite Schlüsselverlust (Bildvermerk gesetzt, MA-05).

## Nachbesserung (Gegenprüfung, 16.11.2026)

1. [rot] Fahrzeugöffnung, Text über dem Hauptknopf: **behoben.** Der Text nennt jetzt, was der Assistent verlangt (Foto des Fahrzeugscheins, Schlüsselfotos, wenn noch einer da ist), sagt „Den Nachweis prüfen wir zusätzlich vor Ort“ und schickt akut Ausgesperrte ohne Fahrzeugschein oder Schlüssel ausdrücklich über den Kontakt; der Zweitknopf heißt „Ausgesperrt? Kontakt und Erreichbarkeit“. Eigene Unterlagenregel und eigener Vorlauf für die Öffnung bleiben OFFENE FRAGE 1 (Inhaber; `unterlagen-pflicht.ts` und Preisdaten liegen außerhalb der Schreibrechte, G9).
2. [gelb] FAQ „Wie erreiche ich Sie für eine Öffnung?“: **behoben.** Antwort nennt jetzt den Knopf „Termin anfragen“ und die Kontaktseite.
3. [gelb] Vorwahl „Ersatzschlüssel bei Verlust“ trotz funktionierendem Schlüssel: **behoben.** `vorgewaehlteLeistung` (anfrage/leistung-vorwahl.ts) wählt `ersatz-bei-verlust` nicht vor, wenn 1 oder mehr Schlüssel funktionieren; bei 0 oder noch unbekannter Zahl bleibt die Vorwahl. Selbst wählen bleibt möglich (`leistungPasst` unverändert). Gilt beim Wählen der Schlüsselart und beim Ändern der Schlüsselzahl (assistent.tsx, nur Kommentar angepasst). Test in leistung-vorwahl.test.ts. Der Hinweis „Funktioniert noch ein Schlüssel, wählen Sie Zweitschlüssel anfertigen“ steht schon auf der Seite; ein zusätzlicher Hinweis im Schritt „Leistung“ wurde nicht gebaut.
4. [gelb] „Ihr vorhandener Schlüssel dient uns als Vorlage.“: **behoben.** Ersetzt durch den Ratgeberwortlaut „Schicken Sie uns Fotos davon. Damit können wir Machbarkeit und Preis einordnen.“
5. [gelb] funkschluessel/page.tsx:69 ohne Bedingung: **zutreffend, nicht behoben.** Die Datei liegt nicht in den Schreibrechten dieses Pakets; bleibt OFFENE FRAGE 4 für ein Folgepaket (Satz angleichen und in zusagen-bedingung.test.ts aufnehmen).
6. [gelb] AUF_DER_SEITE in autoschluessel/page.tsx: **zutreffend, nicht behoben.** Schreibrecht auf die Übersicht gilt nur für Glossar-Verweis und Satz aus Punkt 5; bleibt OFFENE FRAGE 5 für ein Folgepaket.
7. [gelb] „Dabei klären wir mit Ihnen, ob der verlorene Schlüssel … entfernt werden soll.“: **behoben.** Satz gestrichen; der Sachverhalt steht wortgetreu nach dem Ratgeber im Abschnitt „Was noch da ist“.
8. [gelb] Pflicht im Text über dem Knopf verschwiegen: **behoben** zusammen mit Befund 1 (Halbsatz zum Foto des Fahrzeugscheins, Nachweis „zusätzlich vor Ort“).

Geänderte Dateien der Nachbesserung: `src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx`, `src/app/(site)/autoschluessel/schluesselverlust/page.tsx`, `src/app/(site)/autoschluessel/anfrage/leistung-vorwahl.ts`, `src/app/(site)/autoschluessel/anfrage/leistung-vorwahl.test.ts`, `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (nur Kommentar), dieser Bericht.

Prüfung über die Datenweiche:
- `vitest run`: 3792 bestanden, 4 rot, alle in `src/components/fahrzeug-anfrage/zustand.test.ts` („No useRef export on the react mock“, ausgelöst durch die gleichzeitig geänderte `src/lib/flow/use-flow.ts` eines anderen Pakets). Gezielt `src/app/(site)/autoschluessel` u. a.: 8 Dateien, 85 Tests grün.
- `typecheck`: 2 Fehler, nur in `src/lib/flow/schritt-historie.test.ts` (fremdes, ungetracktes Paket).
- `lint`: 0 Fehler, 1 Warnung in `src/lib/flow/schritt-historie.test.ts` (fremd).
- `build`: kompiliert, scheitert an der Typprüfung in `src/lib/flow/use-flow.test.ts` (fremd, `FlowShell` verlangt `children`). Nach Abschluss des Flow-Pakets wiederholen.

## Abnahme durch den Orchestrator (16.11.2026)

Prüfkette (`bash _werkstatt/ausbau/werkzeuge/abnahme.sh FA-PLATTFORM-01B`, alle drei Pakete der Welle gemeinsam im Arbeitsbaum, nach allen Eingriffen): Typprüfung grün, Lint grün, Unit 3834 von 3834, Datenbanktests 165 von 165 (beide Partner-Migrationen laufen auf einer frischen Datenbank), Build 181 von 181 Seiten. Onpage-Messung am neu gestarteten Prüfserver: 137 Seiten, Median 100, kein roter und kein gelber Befund. `reste.mjs` über alle vier Quellen: nur die zehn bekannten Platzhalter in `src/lib/pdf/partnervertrag.ts` (MA-29).

Erledigt außerhalb der Schreibrechte des Pakets:
- `autoschluessel/funkschluessel/page.tsx`: „Die Elektronik bleibt dann erhalten.“ trägt jetzt die Bedingung („Die vorhandene Elektronik verwenden wir weiter, wenn sie in das neue Gehäuse passt.“). `zusagen-bedingung.test.ts` prüft zusätzlich alle Seiten unter `autoschluessel` auf die unbedingte Zusage.
- `autoschluessel/page.tsx`: Die neue Seite steht in `AUF_DER_SEITE`, damit „Passt dazu“ sie nicht doppelt zeigt.
- Titel der neuen Seite: „Autoschlüssel verloren: Ersatz“ statt „… Ersatzschlüssel“. Die Onpage-Messung meldete den Titel mit Markenzusatz als zu breit (595 px, Schwelle 580 px).

Browserprobe am Prüfserver (Produktions-Build, Attrappen, nichts abgesendet): 10 von 10.
- Seite Schlüsselverlust bei 390 und 1280 px: Überschrift, Unterlagen, Hinweis zur Versicherung nur als Verweis auf den eigenen Vertrag; kein Preis, keine Frist, kein „sofort“; Hauptknopf in den Assistenten mit `?leistung=ersatz-bei-verlust`; kein waagerechtes Rollen.
- Fahrzeugöffnung: Knopf „Termin anfragen“ führt in den Assistenten mit `?leistung=fahrzeugoeffnung`; der Text nennt das Foto des Fahrzeugscheins und den Weg für Ausgesperrte; kein Verweis mehr auf `thema=fahrzeugoeffnung`. Der Assistent lädt mit der Vorwahl ohne Fehler, `canonical` ohne Parameter.
- Nicht im Browser durchgespielt: die Vorwahl im Schritt „Leistung“ nach der Wahl der Schlüsselart (13 Schritte mit Fahrzeugsuche); das decken die Tests in `leistung-vorwahl.test.ts`.

Für den Inhaber (MA-56): Die Fahrzeugöffnung läuft im Assistenten mit dem Standardvorlauf und verlangt Fotos von Fahrzeugschein und Schlüssel. Wer ausgesperrt ist, hat beides oft im Fahrzeug. Die Seite sagt das jetzt und schickt Ausgesperrte zum Kontakt; eine eigene Regel für Unterlagen und Vorlauf entscheidet der Inhaber (G9).

