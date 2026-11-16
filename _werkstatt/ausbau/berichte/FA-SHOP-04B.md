# FA-SHOP-04B · Sperrschließungen, Teil B: Konfigurator gegen Abschnitt 15

Stand 16.11.2026. Kein git, kein Server. Alle Prüfungen über die Datenweiche.

## GEÄNDERTE DATEIEN

Neu:
- `src/lib/konfigurator/hersteller-angabe.ts` (Systeme aus dem Stamm, Modus der Herstellerwahl, Prüfung der Kasse)
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/teile.tsx` (Herstellerwahl ohne Herstellerpreise, Weg in die Anfrage)
- Tests: `src/lib/konfigurator/hersteller-angabe.test.ts` (11), `src/app/(site)/gleichschliessende-zylinder/konfigurator/teile.test.tsx` (4)

Geändert (eigene Schreibrechte):
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/kern.ts`, `kern.test.ts` (+4 Tests)
- `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx` (lädt die Stammliste)
- `src/components/konfigurator/schliessplan-planer.tsx`
- `src/lib/konfigurator/preis.ts`, `vorgang.ts`, `index.ts`
- `docs/betrieb/zylinder-pflegen.md`

Gemeinsame Dateien, nur einzelne Stellen mit dem Edit-Werkzeug, damit die Herstellerwahl mitgeht:
- `src/lib/types.ts`: ein optionales Feld `herstellerAngabe?: string` an `CylinderOrderDraft` (Zeile 722). Nur TypeScript, kein Payload-Feld, keine Migration; der Entwurf liegt im JSON-`payload` des Vorgangs.
- `src/lib/actions/orders.ts`: Import (Zeile 12), Feld im zod-Schema der Kasse (Zeile 106), Prüfung gegen die Stammliste nach `validateCylinderDraft` (Zeilen 280 bis 284; lädt `hersteller` nur, wenn eine Angabe kommt).
- `src/lib/cylinder-summary.ts`: eine Zeile „Hersteller (Ihre Wahl)“ in `zylinderZeilen` (Zeile 26). Damit steht die Wahl in Warenkorb, Kasse, Bestellposition (`details`) und im Vorgangsblatt, das der Mail an den Betrieb anhängt.
- `src/lib/actions/security.test.ts`: ein neuer Test (Zeile 1485).

Nicht angefasst: Preise und Maßbereiche in `content/` und Rückfällen, `src/lib/pricing.ts`, `src/lib/cylinder-rules.ts`, Payload-Schema und Migrationen, Navigation, Startseite, Rubrikseite `gleichschliessende-zylinder/page.tsx`, Herstellerbereich, Hilfeblock, „Maß unbekannt“, Fortschritt, Mailvorlagen.

## WAS UND WARUM

1. **Hersteller sichtbar und wählbar (FA-15-01, FA-15-02, FA-19-02).** Der Herstellerschritt kennt jetzt drei Fälle (`herstellerModus`):
   - `katalog`: Der Zylinderkatalog bietet Hersteller an. Unverändert wie im Bestand, mit Aufpreis und Zusatzkomponenten über `manufacturerId`.
   - `angabe`: Kein Katalog-Hersteller, aber Hersteller im Stamm mit Haken „angeboten“ und Bereich „Sperrschließungen“ (heute BKS und ABUS; BURG-WÄCHTER hat nur „Zutritt“ und erscheint nicht). Wählbar sind diese Systeme und „Keine Vorgabe“. Der Text sagt: „Ihre Wahl geben wir an die Werkstatt weiter. Sie ändert die Summe nicht.“ Den Satz „Der Preis gilt für beide Systeme“ gibt es nicht, weil die Daten ihn nicht hergeben.
   - `keine`: weder noch, kein Schritt (wie bisher).
   Logos nur, wenn der Stamm sie herausgibt (Freigabe und Datei, `freigegebenesLogo`, R12), sonst der Name als Schrift im Titel der Karte. Die Wahl geht als `herstellerAngabe` (Name) in den Entwurf, in die Zusammenfassung („Hersteller“, „Ihre Wahl geben wir an die Werkstatt weiter“), in den Warenkorb und die Kasse (`zylinderZeilen`), in die Bestellposition und damit ins Vorgangsblatt der Betriebsmail. Die Kundenmail nennt wie im Bestand nur Positionen ohne Details.
   **Verhältnis zu `src/lib/konfigurator/preis.ts` und zum Preis:** Kein zweiter Preispfad. `priceCylinderOrder` liest `herstellerAngabe` nicht (Test: Preis mit und ohne Angabe gleich). Der feste Preis bleibt fest und wird durch die Wahl nicht zum Angebot. Im Schließplan-Planer steht der Hersteller als `plan.system`; `planZuEntwurf` gibt ihn als `herstellerAngabe` weiter, `preisFuerPlan` rechnet wie bisher. Bietet der Katalog Hersteller an, bleibt der Planer beim Angebot, nennt jetzt aber den gewählten Hersteller („Ihren Hersteller … nehmen wir ins Angebot auf.“). Die Kasse prüft die Angabe gegen die Stammliste (`herstellerAngabeProblem`): nur ein System für Sperrschließungen und nur, solange der Katalog keinen Hersteller anbietet; sonst Meldung mit Ausweg (seit der Nachbesserung: „Bitte entfernen Sie die Position und stellen Sie die Zylinder im Konfigurator neu zusammen, oder schicken Sie uns eine Anfrage.“)
   Gedankenstrich im Satz „Weitere Hersteller oder Sonderlösungen auf Anfrage“ behoben.
2. **Schlüsselanzahl, Sicherungskarte, Erweiterbarkeit (FA-15-07 bis FA-15-09).** Bestand geprüft, nichts umgestellt: Alle drei werden abgefragt (Schritte „Schlüssel“, „Optionen“, „Erweiterung“), stehen in der Zusammenfassung und gehen über `zylinderZeilen` in die Bestellposition („Gemeinsame Schlüssel“, „Zusatzoptionen“, „Spätere Erweiterung“). Belegt im Kettentest. Die Sicherungskarte bleibt Option wie im Bestand (R13); Pflicht oder Option entscheidet der Inhaber (FÜR MENSCHEN).
3. **Weitere Bauformen (FA-15-03).** Es erscheinen nur die Bauformen des Katalogs. Unter den Türen steht neu „Ihre Bauform ist nicht dabei? Andere Bauform anfragen“ in die Anfrage mit Thema „Gleichschließende Zylinder“ und Vorbelegung „Andere Zylinder-Bauform“ (`ANDERE_BAUFORM_ANFRAGE`). Keine neue Bauform, keine Migration.
4. **Mehrere Maße (FA-15-10).** Kettentest in `security.test.ts`: Zustand des Konfigurators mit drei Maßen (30/35, 40/45, Halbzylinder 40) über `zuEntwurf`, den echten Warenkorb (`useCartStore.addCylinderOrder`) und `submitOrder`. Die Kasse rechnet denselben Preis, die Bestellposition nennt alle drei Maße, Schlüsselzahl, Sicherungskarte, Erweiterung und „Hersteller (Ihre Wahl): BKS“; ein fremder Hersteller wird abgelehnt.
5. **Unbestätigte Preise (aus Teil A).** Bei gesperrtem Eintrag gibt es am Ende keinen Knopf „In den Warenkorb“ mehr, sondern den Knopf „Zusammenstellung als Anfrage schicken“ (`abschlussKnopf`), der in denselben Weg führt wie der Link. Der Hinweis ist ruhig (`tone="info"`, Titel „Diese Zusammenstellung bekommen Sie als Angebot“), ohne Betrag. Die Schrittprüfung der Zusammenfassung prüft nur noch die Angaben; `handleSubmit` legt bei offenem Preis nie in den Warenkorb. Die Kasse sperrt unverändert über `validateCylinderDraft`.
6. **Punkt 9: Planer übernimmt alles.** `anfrageZiel` baut den Link mit Plan (Zylinder, Maße, Schlüssel, Ziehschutz an allen Türen, Erweiterung als Vormerkung), Hersteller als `system` und den übrigen Optionen als `&wuensche=` (etwa Sicherungskarte). Der Planer liest `wuensche` mit `wuenscheAusLink` (nur angebotene Optionen, ohne Schutz und Vormerkung) und setzt sie beim Laden des Links; den Hersteller zeigt er in den Schritten „Prüfen“ und „Abschluss“. Schnappschuss, PDF („System“) und Zusammenfassung des Vorgangs (neuer Abschnitt „Hersteller“) tragen ihn. Damit stimmt der Satz im Konfigurator ohne Einschränkung: „Zylinder, Maße, Schlüssel, Optionen und Hersteller gehen mit.“ Einzige Ausnahme, offen benannt: Zusatzkomponenten eines Katalog-Herstellers trägt der Plan nicht („Zusatzkomponenten nennen Sie uns dort bitte bei den Hinweisen.“). Eine unbestätigte Option aus dem Link macht im Planer ein Angebot (Test), keinen Preis ohne sie.
   Nebenbei im Planer: Eine Option mit Haken „Preis nicht bestätigt“ zeigt bei den Wünschen „Preis auf Anfrage“ statt ihres Betrags.
7. **Bedienbarkeit.** Hilfeblock, „Maß unbekannt“, Fortschritt und die Hinweise je Schritt aus FA-QA-02 unverändert (Sammeltest `formulare-bedienbarkeit.test.ts` für den Zylinder grün). Neuer Hinweis im Herstellerschritt bei Modus `angabe`: „Bitte wählen Sie einen Hersteller oder „Keine Vorgabe“.“
8. **Betreiberanleitung** `docs/betrieb/zylinder-pflegen.md`: Herstellerwahl ohne Katalogeintrag (Abschnitt 2), Ausweg „Andere Bauform anfragen“ (Abschnitt 3), Knopf bei Preissperre und Übernahme in den Planer (Abschnitte 5 und 7), neuer Abschnitt 8 „So bedient der Kunde den Konfigurator“ (Hersteller anbieten, Bauform, Maße, Optionen, Preis sperren).

Laufzeitbibliothek: keine neue (G7). Keine Preise, keine Katalogeinträge angelegt (G9).

## TABELLE DER ANFORDERUNGEN

Pfade relativ zum Repository; `konfigurator.tsx`, `kern.ts`, `teile.tsx` unter `src/app/(site)/gleichschliessende-zylinder/konfigurator/`.

| Anforderung | Stand | Beleg (Datei und Zeile) | Test |
|---|---|---|---|
| FA-15-00 echter Konfigurator und Shop | erfüllt, soweit der Code reicht; Preisfreigabe offen (G9) | Schritte `konfigurator.tsx:58-99`, Warenkorb `:478-493`, Kasse rechnet neu `src/lib/actions/orders.ts:276-299`; Planer-Lücke Hersteller geschlossen `src/lib/konfigurator/preis.ts:35-54`, `:89-97` | `security.test.ts:1485`, `hersteller-angabe.test.ts` |
| FA-15-01 BKS und ABUS sichtbar | erfüllt (Angabe ohne Preiswirkung; mit Katalogeintrag Preisregel des Bestands) | `hersteller-angabe.ts:34-49`, `page.tsx:48`, `konfigurator.tsx:757-759`, `teile.tsx:38-75` | `hersteller-angabe.test.ts` „zeigt BKS und ABUS“, `teile.test.tsx` |
| FA-15-02 Logos nach Markenvorgaben | erfüllt im Code (nur mit Freigabe im Stamm, sonst Schriftzug); Dateien und Freigabe fehlen (Mensch) | `hersteller-angabe.ts:35-40`, `teile.tsx:15-26` | `hersteller-angabe.test.ts` „Logo nur mit Freigabe“, `teile.test.tsx` „zeigt ein Logo nur …“ |
| FA-15-03 weitere Bauformen | teilweise: drei Bauformen aus dem Katalog, Ausweg in die Anfrage | `konfigurator.tsx:837-843`, `kern.ts:219` | `kern.test.ts` „eine fehlende Bauform …“ |
| FA-15-04 Maß A und B | erfüllt (Bestand) | `konfigurator.tsx:1262-1320` | `security.test.ts:1485` |
| FA-15-05 Anzahl | erfüllt (Bestand) | `konfigurator.tsx:1390-1408` | `security.test.ts:1485` |
| FA-15-06 Not- und Gefahrenfunktion | erfüllt (Bestand) | `konfigurator.tsx:1354-1386` | `cylinder-rules.test.ts` (Bestand) |
| FA-15-07 Schlüsselanzahl | erfüllt, bis in die Bestellung | `konfigurator.tsx:899-913`, `src/lib/cylinder-summary.ts:43` | `security.test.ts:1485` („Gemeinsame Schlüssel: 5 Stück“) |
| FA-15-08 Sicherungskarte | erfüllt als Option bis in Bestellung und Planer; Pflicht oder Option offen (Inhaber) | Optionen `konfigurator.tsx:959-985`, Planer-Wünsche `src/lib/konfigurator/preis.ts:61-67`, `schliessplan-planer.tsx:183` | `security.test.ts:1485`, `hersteller-angabe.test.ts` „liest nur angebotene Wünsche“ |
| FA-15-09 Erweiterbarkeit | erfüllt, bis in Bestellung und Planer | `konfigurator.tsx:1042-1077`, `cylinder-summary.ts:60-63`, Vormerkung im Plan `kern.ts:77` | `security.test.ts:1485`, `kern.test.ts` „der Weg in die Anfrage trägt …“ |
| FA-15-10 mehrere Maße | erfüllt, Kette belegt | `kern.ts:174-196`, `src/lib/store/cart.ts:79-84`, `orders.ts:276-299` | `security.test.ts:1485` (drei Maße) |
| FA-15-11 Preis aus hinterlegten Daten | erfüllt im Code (nur Katalog, Sperre mit Weg in die Anfrage, kein Preis aus der Herstellerwahl); Preisbestätigung offen (G9) | `kern.ts:225-227`, `konfigurator.tsx:481-484`, `:1108-1116` | `kern.test.ts` „kein Bestellknopf“, `teile.test.tsx`, `hersteller-angabe.test.ts` „ändert den Preis nicht“ |
| FA-15-12 | nicht vorhanden: Abschnitt 15 hat in Kundschafter, Blindprüfung und Abgleich 12 IDs (FA-15-00 bis FA-15-11) | `berichte/FA-ABGLEICH.md:354-365` | OFFENE FRAGE 1 |
| FA-10-09 Hauptkategorie Sperrschließungen | erfüllt im Code; Katalogfreigabe offen | wie FA-15-00 | wie FA-15-00 |
| FA-19-02 BKS und ABUS bei Sperrschließungen | erfüllt: Rubrikseite (Bestand, FA-INHALT-02) und Konfigurator (neu) | `src/app/(site)/gleichschliessende-zylinder/page.tsx:300`, `konfigurator.tsx:757-759` | `hersteller-bereich.test.tsx` (Bestand), `teile.test.tsx` |

## PRÜFUNG UND ERGEBNIS

Alle Befehle über `_werkstatt/ausbau/werkzeuge/sicher.sh`, auf dem gemeinsamen Arbeitsbaum. Im Baum arbeitet gleichzeitig ein anderes Paket an Einsendung und Versand (`src/lib/versand/**`, `src/lib/einsenden/**`, `src/payload/globals/Einstellungen.ts`, nicht von mir geändert).

- Stand 16.11.2026 nach der Nachbesserung: 225 von 225 Dateien und 3532 von 3532 Tests grün, typecheck und lint ohne Fehler, build grün (siehe „Nachbesserung“). Die folgenden Zahlen sind der erste Lauf; die roten Tests und die zwei Typfehler gehörten zum parallelen Versand-Paket und sind dort inzwischen behoben.
- Erster Lauf: `--json -- npx vitest run`: 223 Dateien, 3503 Tests; 3488 grün, 15 rot. Alle 15 roten liegen in Einsendung und Versand (`src/lib/versand/versand.test.ts`, `src/lib/einsenden/einsenden.test.ts`, in `security.test.ts` der Test „legt eine Einsendung nur mit geprüften Angaben an …“, in `formulare-bedienbarkeit.test.ts` „Gehäuse, Vorlage und Einsendung führen nach einem Neuladen …“). Keiner berührt Dateien dieses Pakets. Alle Tests dieses Pakets und der berührten Bereiche grün (`src/lib/konfigurator`, `gleichschliessende-zylinder`, `src/components/konfigurator`, `cylinder-summary`, der neue Kettentest in `security.test.ts`, der Zylinder-Teil von `formulare-bedienbarkeit.test.ts`).
- `--json -- npm run typecheck`: 2 Fehler, beide in `src/lib/versand/versand.test.ts` (Eigenschaft `stand` an `EinsendeAngebot`, fremde Baustelle). In den Dateien dieses Pakets keiner.
- `--json -- npm run lint`: ohne Fehler.
- `--json -- npm run build`: grün.

Kein Server, kein Browser. Die Oberfläche ist über die herausgelösten Bausteine (`teile.tsx`) und reine Funktionen (`kern.ts`) geprüft, nicht im laufenden Konfigurator.

## OFFENE FRAGEN

1. FA-15-12 gibt es in keinem Bericht. Das Paket nennt „FA-15-00 bis FA-15-12“; Abschnitt 15 ist in 12 IDs (00 bis 11) geteilt. Ist ein Tippfehler gemeint oder fehlt eine ID?
2. Darf ein Kunde zum festen Preis „BKS“ oder „ABUS“ als Angabe wählen, obwohl die Preise je Hersteller fehlen (MA-49)? Umgesetzt wie im Paket verlangt (Angabe ohne Preiswirkung, ehrlicher Satz). Kann die Werkstatt einen Hersteller zum Katalogpreis nicht liefern, wäre der Katalog-Hersteller mit Haken „Preis nicht bestätigt“ der saubere Weg.
3. `herstellerAngabe` ist ein neues optionales Feld am TypeScript-Typ des Bestellentwurfs, kein Datenbankfeld (der Entwurf liegt im JSON-`payload`). Gilt das als „ohne neues Datenschema“? Falls nicht: Das Feld lässt sich ersatzlos zurücknehmen; dann geht die Wahl nur noch über den Planer (`plan.system`) mit.
4. Der Schließplan-PDF beschriftet den Hersteller mit „System“ (`src/lib/pdf/schliessplan.ts:80`, außerhalb der Schreibrechte). Soll dort „Hersteller“ stehen?

## FÜR MENSCHEN

- Inhaber: Sicherungskarte Pflicht oder Option (FA-15-08). Heute Option, nichts umgestellt (R13).
- Inhaber: Preise je Hersteller (Aufpreis, Zusatzkomponenten), wenn die Wahl von BKS oder ABUS Preiswirkung haben soll; bis dahin Angabe ohne Preiswirkung.
- Inhaber: Logodateien von BKS und ABUS mit Nutzungsrechten und Markenvorgaben; danach im Stamm hochladen und „Freigabe liegt vor“ setzen (R12).
- Inhaber: Liste weiterer Bauformen mit Maßen und Preisen (FA-15-03); jede neue Bauform braucht danach eine Erweiterung mit additiver Migration.
- Inhaber: Preisliste aus FA-SHOP-04 bestätigen (G9).
- Probe mit erfundenen Testdaten im Browser: Konfigurator mit BKS, drei Maßen und Sicherungskarte bis in den Warenkorb; dann Haken „Preis nicht bestätigt“ an der Sicherungskarte und prüfen, dass Knopf und Link in den Planer führen und dort Sicherungskarte und Hersteller stehen.

## Nachbesserung (16.11.2026, nach zwei Gegenprüfungen)

1. [gelb] Zusammenfassung im Modus `angabe`, Zeile „Preis“ ohne Preisaussage: **behoben.** Beschriftung jetzt „Hinweis“, Wert `HERSTELLER_ANGABE_SATZ` („Ihre Wahl geben wir an die Werkstatt weiter. Sie ändert die Summe nicht.“), `konfigurator.tsx` im `summary`-Block.
2. [gelb] `plan.system` war als Systemdaten-Kennung beschrieben: **behoben.** Kommentar an `Schliessplan.system` (`src/lib/konfigurator/schliessplan.ts`) nennt jetzt den Herstellernamen aus dem Konfigurator und die Prüfung der Kasse. Die Meldung in `herstellerAngabeProblem` passt für beide Wege: „Bitte entfernen Sie die Position und stellen Sie die Zylinder im Konfigurator neu zusammen, oder schicken Sie uns eine Anfrage.“
3. [gelb] `ALLGEMEINE_ANFRAGE` führte nach `thema=tuer-und-schliesstechnik`: **behoben.** Jetzt `/service-und-termin/anfrage?thema=gleichschliessende-zylinder` (`kern.ts`), wie Herstellerschritt und „Andere Bauform anfragen“. Test in `kern.test.ts` und `teile.test.tsx`.
4. [gelb] Zweig in `handleSubmit` und Schrittprüfung der Zusammenfassung ohne Test: **behoben, mit Einschränkung.** Beide Entscheidungen sind als reine Funktionen in `kern.ts` herausgelöst (`abschlussAktion`, `zusammenfassungBereit`) und werden im Konfigurator benutzt. Tests in `kern.test.ts`: Katalog mit Haken „Preis nicht bestätigt“ an der Sicherungskarte ergibt `{ art: 'anfrage', href: <Planer-Link> }`, ohne Haken `warenkorb`; die Zusammenfassung ist bei vollständigen Angaben trotz offenem Preis frei. Ein echter Klicktest am `Konfigurator` braucht eine DOM-Testumgebung (jsdom, Testing Library), die das Projekt nicht hat; eine neue Bibliothek wäre nur per Denkprotokoll zulässig (G7). Ersatzweise prüft ein Quelltexttest, dass `handleSubmit` über `abschlussAktion` verzweigt, bevor `addCylinderOrder` aufgerufen wird, und dass die Zusammenfassung `zusammenfassungBereit` nutzt. OFFENE FRAGE: DOM-Testumgebung für Komponententests zulassen?
5. [gelb] Nicht mehr angebotener Hersteller aus einem gespeicherten Planer-Link: **behoben über die Meldung.** Eine Prüfung schon im Planer bräuchte die Stammliste auf der Planer-Seite (`src/app/(site)/schliessanlagen/konfigurator/schliessplan/page.tsx`, außerhalb der Schreibrechte). Darum nennt die Meldung der Kasse jetzt einen Ausweg, der ohne Planer geht (Position entfernen, im Konfigurator neu zusammenstellen oder Anfrage). Test „ein nicht mehr angebotener Hersteller aus einem alten Planer-Link …“ in `hersteller-angabe.test.ts`. Für Menschen: Soll die Planer-Seite die Systeme laden, damit der Planer den Hersteller vorher prüft und sonst in die Anfrage führt?
6. [gelb] Herstellername doppelt vorgelesen: **behoben.** Das Logo neben dem Titel hat `alt=""` (`teile.tsx`); der Name steht als Titel. `teile.test.tsx` prüft, dass „BKS“ genau einmal im Markup steht.
7. [gelb] Veraltete Prüfzahlen: **behoben.** Abschnitt „PRÜFUNG UND ERGEBNIS“ trägt den neuen Stand mit Datum; der erste Lauf bleibt als solcher gekennzeichnet.

Geänderte Dateien der Nachbesserung: `src/app/(site)/gleichschliessende-zylinder/konfigurator/{konfigurator.tsx,kern.ts,kern.test.ts,teile.tsx,teile.test.tsx}`, `src/lib/konfigurator/{hersteller-angabe.ts,hersteller-angabe.test.ts,schliessplan.ts}`, dieser Bericht. Keine gemeinsame Datei berührt; `security.test.ts` prüft weiter auf „im Konfigurator neu“ und bleibt grün.

Prüfung über die Datenweiche, 16.11.2026: `--json -- npx vitest run` 225 von 225 Dateien, 3532 von 3532 Tests grün · `npm run typecheck` ohne Fehler · `npm run lint` ohne Fehler · `--json -- npm run build` grün.
