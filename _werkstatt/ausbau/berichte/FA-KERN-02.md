# Bericht FA-KERN-02 · Pflichtuploads in allen Fahrzeugschlüssel-Wegen, serverseitig (Teil 1)

Stand: 15.11.2026. Grundlage: Paketdatei FA-KERN-02, Entscheidung A-048, Befunde FA-ABGLEICH Blöcke 01, 02 und 06. Kein git ausgeführt; der Orchestrator hat während des Laufs Zwischenstände committet (e410516 und davor).

## GEÄNDERTE DATEIEN

Neu:
- src/lib/fahrzeuge/anfrage-klassen.ts (Klassen, Ersatznachweise, Quelle der gemeinsamen Anfrage; reine Daten und Typen)
- src/components/autoschluessel/schluessel-fotos.tsx (die drei Schlüsselfotos als Steckplätze, Baustein für Motorrad und Gehäuse)
- src/migrations/20261115_165108_steckplaetze.ts und .json (über `sicher.sh --pg -- npx payload migrate:create steckplaetze`), src/migrations/index.ts

Geändert (Regel, Server, Datenmodell):
- src/lib/server/unterlagen-pflicht.ts (eine Pflichtregel, Weg-Zuordnung, Meldung, Backend-Hinweis; alte Funktionen unverändert)
- src/lib/actions/records.ts (Steckplätze aus der Ablage bestätigen, Pflichtregel je Weg, Tastenzahl, Stückzahl)
- src/lib/wege/nachweis.ts (UPLOAD_STECKPLAETZE, STECKPLATZ_LABEL, STECKPLATZ_KATEGORIEN, steckplatzPasst, dateiBezeichnung, FOTO_ANFRAGE_QUELLE)
- src/lib/server/record-schema.ts (Upload-Schema: Feld steckplatz, muss zur Kategorie passen)
- src/lib/server/kundendateien.ts (Steckplatz speichern, Frist je Steckplatz, kundendateienPruefen)
- src/app/(site)/api/kunden-upload/route.ts (Feld steckplatz prüfen und speichern)
- src/payload/collections/Kundendateien.ts (Feld steckplatz, nur lesend, Listenspalte)
- src/payload/collections/Vorgaenge.ts (nur Anzeige: virtuelles Feld „Unterlagen nach Steckplatz“ mit Hinweis)
- src/payload-types.ts (generate:types; enthält auch die zur selben Zeit committeten Admin-Hinweise aus FA-SEO-01A)
- src/lib/types.ts (neuer Typ UploadSteckplatz, optionales Feld UploadRef.steckplatz)
- src/lib/server/create-record.ts (eine Zeile: Steckplatz in die Upload-Angaben des Vorgangs übernehmen; siehe OFFENE FRAGEN)
- src/lib/pdf/vorgangsblatt.ts, src/lib/druckansichten.ts, src/lib/mail/vorlagen/betrieb-neuer-vorgang.ts (nur Beschriftung der Steckplätze; druckansichten.ts ist das HTML-Vorgangsblatt, siehe OFFENE FRAGEN)

Geändert (Formulare):
- src/components/forms/photo-upload.tsx (Prop steckplatz, alsUpload mit Steckplatz)
- src/components/autoschluessel/optionen.ts (Steckplatz je Bildplatz, Wortlaut „Spitze beziehungsweise Profil von vorne“)
- src/app/(site)/autoschluessel/anfrage/assistent.tsx, unterlagen-pruefung.ts, page.tsx (Erreichbarkeit an den Assistenten)
- src/app/(site)/motorradschluessel/anfrage/anfrage-formular.tsx, kern.ts
- src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx, kern.ts
- src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx

Tests: src/lib/server/unterlagen-pflicht.test.ts, src/lib/actions/security.test.ts, src/app/(site)/api/kunden-upload/route.test.ts, src/lib/wege/nachweis.test.ts, src/payload/collections/vorgaenge-felder.test.ts, src/lib/mail/vorlagen.test.ts, src/lib/pdf/vorgangsblatt.test.ts, src/app/(site)/autoschluessel/anfrage/unterlagen-pruefung.test.ts, motorradschluessel/anfrage/kern.test.ts, gehaeuse/anfrage/kern.test.ts, src/lib/server/kundendateien.db.test.ts, src/lib/data/vorgaenge.db.test.ts.

Nicht angefasst: content/rubriken.json, defaults/rubriken.ts, navigation.ts, Startseite, sitemap, vehicles.json, seo.json, defaults/content.ts, Preise, Rechtstexte (auch verarbeitungen.ts nicht, siehe unten), keine neuen Seiten.

## WAS UND WARUM

1. Steckplätze (A-048 Punkt 1). Jede Datei trägt neben der Kategorie einen Steckplatz: fahrzeugschein, schluessel-vorderseite, schluessel-rueckseite, schluessel-spitze, ersatznachweis, typenschild, sicherungskarte, sonstiges. Die Upload-Route nimmt ihn nur an, wenn er zur Kategorie passt (STECKPLATZ_KATEGORIEN: der Fahrzeugschein-Steckplatz nur mit Kategorie Fahrzeugschein, Ersatznachweis und Typenschild nur als Dokument, Schlüsselfotos nur als Schlüsselfoto, Sonstiges zu allem), und speichert ihn an der Kundendatei. Beim Absenden liest der Server bei eingerichteter Ablage jede Datei mit Kennung und Einmal-Schlüssel nach (`kundendateienPruefen`, nur lesend, Schlüssel zeitkonstant geprüft, nur noch nicht zugeordnete Dateien). Weicht die Angabe des Browsers vom gespeicherten Steckplatz oder von der Kategorie ab oder nennt er dieselbe Datei zweimal, wird abgelehnt; eine Datei, die sich nicht bestätigen lässt, zählt nicht als hochgeladen. Ohne Ablage prüft das Upload-Schema nur Steckplatz gegen Kategorie. Migration rein additiv: neuer Enum-Typ und eine freiwillige Spalte ohne Standardwert; alte Dateien bleiben gültig. JSON-Fallback: Vorgänge speichern die Upload-Angaben als JSON, der Steckplatz geht dort ohne Schemaänderung mit.
2. Eine Pflichtregel, eine Stelle (Punkt 2). `fehlendeFahrzeugUnterlagen` in unterlagen-pflicht.ts: Klassen mit Zulassung verlangen den Steckplatz fahrzeugschein; Kleinstfahrzeuge ohne Zulassungsbescheinigung einen ersatznachweis der anerkannten Art, dazu Typenschild-Foto, FIN oder die Bestätigung „kein Typenschild“, beim Fahrrad Hersteller und Schlüsselnummer des Schlosses; der Ersatzweg ist für Auto, Motorrad und „Fahrzeug nicht gefunden“ nie offen. Schlüssel vorhanden (auch defekt): alle drei Schlüsselfotos; nur `keinSchluesselMehr === true` lässt sie entfallen. Beschreibung Pflicht mit der Bestandsgrenze 20 Zeichen (Feld Beschreibung der allgemeinen Anfrage), höchstens 2000. `unterlagenMeldung` nennt alles, was fehlt, in einem Satz und endet ruhig mit „Die Unterlagen schützen Sie vor Missbrauch: Wir fertigen Schlüssel nur für Berechtigte.“ `submitRecord` lehnt sonst ab.
3. Termin-Assistent (Punkt 3). Server prüft Fahrzeugschein, die drei Fotos und die Beschreibung (Feld note) nach derselben Regel. Totalverlust nur bei 0 funktionierenden Schlüsseln und angehakter Karte „Ich habe keinen Schlüssel mehr“ (Server: keinSchluesselMehr nur zusammen mit workingKeys 0). Die Schaltfläche „Anfrage ohne Fotos senden“ ist entfernt; an ihrer Stelle steht „Sie kommen hier nicht weiter?“ mit Telefonnummer aus den Firmendaten und Erreichbarkeit aus den Einstellungen, „Später weitermachen“ (Angaben bleiben auf dem Gerät, Fotos neu wählen) und „Rückruf erbitten“ als Link auf die bestehende Rückrufbitte /beratung#rueckruf (reine Kontaktbitte, kein Auftrag). Feld „Ihre Nachricht (freiwillig)“ ist jetzt „Kurze Beschreibung Ihres Anliegens“, Pflicht.
4. Klassen (Punkt 4). anfrage-klassen.ts mit genau auto, motorrad, roller, e-scooter, seniorenmobil, fahrrad, nicht-gefunden; je Klasse Bezeichnung, Nachweis (zulassung, ersatz, wahl), anerkannte Ersatznachweise, Typenschild, Schloss. Roller: Wahl zugelassen oder Versicherungskennzeichen; ohne Wahl gilt zugelassen (strenger). nicht-gefunden wie Auto. Die Regel ist für jede Klasse getestet; der Server prüft die Quelle `fahrzeug-anfrage` schon jetzt, sodass FA-KERN-02B nur noch den Weg baut.
5. Motorrad (Punkt 5). Drei Fotos über die Steckplätze statt eines Feldes, Fahrzeugschein mit Steckplatz, Karte „Ich habe keinen Schlüssel mehr“, Beschreibung im Schritt Kontakt. Formular nicht umgebaut. Die Rubrikprüfung (pflegbare Pflicht-Uploads) läuft weiter; bei bestätigtem Totalverlust entfällt dort nur das Schlüsselfoto, der Nachweis bleibt.
6. Gehäuse (Punkt 6). Drei Fotos über dieselben Steckplätze, Tastenzahl auf dem Server geprüft (1-2, 3-4, unklar; sonst „Bitte geben Sie an, wie viele Tasten der Schlüssel hat.“) und im Vorgang gespeichert, Beschreibung Pflicht. Kein Totalverlust (ohne Schlüssel kein Gehäusetausch).
7. Schlüssel nach Vorlage (Punkt 7). Eigene Quelle `foto-anfrage` (ältere Vorgänge ohne Quelle zählen dazu). Drei Fotos über die Steckplätze auf dem Server Pflicht, Stückzahl 1 bis 20 auf dem Server (ganze Zahl), Beschreibung Pflicht (Feld „Anmerkung (freiwillig)“ ist jetzt „Kurze Beschreibung Ihres Anliegens“). Absenden-Knopf im letzten Schritt nur aktiv, wenn alle drei Steckplätze belegt sind (vorher Rückfall „1“, daher nach Neuladen aktiv). Die Einsendung behält ihren eigenen Weg.
8. Wortlaut (Punkt 8). Überall „Vorderseite · Rückseite · Spitze beziehungsweise Profil von vorne“ und „Beschriftungen und Prägungen müssen lesbar sein“. Die gezeichneten Beispielbilder bleiben (MA-05).
9. Admin (Punkt 9). Kundendateien zeigen den Steckplatz (Feld und Spalte). Im Vorgang steht im Reiter mit den Dateien „Unterlagen nach Steckplatz“ (virtuell, keine Spalte): je Datei Steckplatz und Name, nicht gespeicherte Dateien gekennzeichnet, dazu „Hinweis: Pflicht-Steckplatz fehlt: …“ bei älteren oder unvollständigen Vorgängen (Schlüsselfotos ohne Steckplatz werden als „vor den Steckplätzen“ benannt). Vorgangsblatt (PDF und HTML) beschriften jede Datei mit Steckplatz; die Mail an das Team hat eine Zeile „Unterlagen“ nur mit Steckplatznamen und Anzahl, ohne Dateinamen.
10. Aufbewahrung (Punkt 10). Ersatznachweis und Typenschild bekommen die Frist „Fahrzeugschein und Nachweise“ (vehicleRegistration) über FRIST_JE_STECKPLATZ in kundendateien.ts, obwohl sie als Dokument kommen; alle anderen Steckplätze folgen ihrer Kategorie (Schlüsselfotos keyPhotos). aufbewahrung-bereinigen.ts braucht keine Änderung: Es löscht nach dem beim Hochladen gesetzten Datum. verarbeitungen.ts enthält nur Text der Datenschutzerklärung, dort gibt es keine Zuordnung im Code; nicht geändert (G9), Entwurf unten.

## FÜR FA-KERN-02B

- Regel: `fehlendePflichtunterlagen`, `fehlendeFahrzeugUnterlagen`, `fahrzeugUnterlagenPruefen`, `unterlagenMeldung`, `FEHLT_TEXT`, `FEHLT_KURZ`, `steckplatzBelegt`, `fehlendeSchluesselfotos`, `unterlagenWeg`, `anfrageQuelleUnbekannt`, `ANFRAGE_QUELLEN`, Typ `FahrzeugFall` (src/lib/server/unterlagen-pflicht.ts). Formulare im Browser laden `beschreibungGueltig`, `BESCHREIBUNG_MIN`, `BESCHREIBUNG_MAX` aus src/lib/wege/nachweis.ts, nicht aus lib/server (Nachbesserung, Befund 11). Eine neue Quelle der gemeinsamen Anfrage muss in `ANFRAGE_QUELLEN` stehen, sonst lehnt der Server ab.
- Server: Quelle `FAHRZEUG_ANFRAGE_QUELLE = 'fahrzeug-anfrage'` (src/lib/fahrzeuge/anfrage-klassen.ts). `submitRecord` prüft bei kind „anfrage“ mit dieser Quelle schon jetzt: payload.klasse (Pflicht, sonst abgelehnt), roller, keinSchluesselMehr (nur `true`), beschreibung, ersatznachweis, fin, keinTypenschild, schlossHersteller, schluesselnummer. Der Bereich (area) wird dafür nicht geprüft; 02B sollte „autoschluessel“ senden (eine Bereichskennung für Fahrrad gibt es nicht).
- Daten: `ANFRAGE_KLASSEN`, `ANFRAGE_KLASSEN_DATEN`, `ERSATZNACHWEIS_ARTEN`, `ERSATZNACHWEISE` (Titel, Satz), `verlangtZulassung`, `istAnfrageKlasse`, Typen `AnfrageKlasse`, `RollerNachweis`, `ErsatznachweisArt` (anfrage-klassen.ts).
- Steckplätze: `UPLOAD_STECKPLAETZE`, `SCHLUESSEL_STECKPLAETZE`, `STECKPLATZ_LABEL`, `steckplatzPasst`, `dateiBezeichnung` (src/lib/wege/nachweis.ts); Ersatznachweis und Typenschild mit Kategorie „dokument“ hochladen.
- Bausteine: `SchluesselFotoFelder`, `LEERE_SCHLUESSELFOTOS`, `schluesselfotosVollstaendig`, `schluesselfotosAlsUploads`, `FOTO_TIPPS` (src/components/autoschluessel/schluessel-fotos.tsx); `PhotoUpload` mit `steckplatz`, `alsUpload(datei, kategorie, steckplatz)` (photo-upload.tsx). Die Hilfe-Box `HilfeBeiUnterlagen` steht noch lokal im Assistenten (assistent.tsx) und kann für den Fallback herausgelöst werden.

## PRÜFUNG UND ERGEBNIS

- `sicher.sh --json -- npx vitest run`: 188 Dateien, 2662 Tests bestanden (vorher 2620, davon 18 durch die geänderte Regel rot und begründet angepasst).
- `sicher.sh --json -- npm run typecheck`: ohne Fehler.
- `sicher.sh --json -- npm run lint`: ohne Fehler.
- `sicher.sh --pg -- npx vitest run -c vitest.db.config.ts`: 16 Dateien, 101 Tests bestanden (mit neuer Migration).
- `sicher.sh --json -- npm run build`: erfolgreich.
- Verlangte Serverfälle (security.test.ts, describe „Pflichtunterlagen je Weg“ und „Terminvergabe“):
  - ohne Fahrzeugschein abgelehnt: Termin, Motorrad, Gehäuse, Fahrzeug-Anfrage auto, motorrad, zugelassener Roller, nicht-gefunden. Vorlage hat keinen Fahrzeugschein.
  - zwei statt drei Schlüsselfotos abgelehnt: Termin (auch mit Nahaufnahme unter Sonstiges), Motorrad, Gehäuse, Vorlage, Fahrzeug-Anfrage auto und e-scooter.
  - Totalverlust bestätigt, ohne Fotos angenommen: Termin (0 Schlüssel plus Bestätigung), Motorrad, Fahrzeug-Anfrage auto und seniorenmobil. Gehäuse und Vorlage nehmen die Bestätigung bewusst nicht an (ohne Schlüssel kein Gehäuse und keine Kopie); Termin ohne Bestätigung oder mit funktionierendem Schlüssel abgelehnt.
  - Kleinstfahrzeug mit Ersatznachweis angenommen: e-scooter (FIN), seniorenmobil (Typenschild), roller mit Versicherungskennzeichen, fahrrad (Codekarte mit Schlossangaben).
  - Auto mit Ersatznachweis statt Fahrzeugschein abgelehnt: Termin, Gehäuse, Motorrad-Weg, Fahrzeug-Anfrage auto, motorrad, nicht-gefunden, Roller ohne Wahl.
  - Steckplatz vom Browser gefälscht, abgelehnt: ohne Ablage (Steckplatz passt nicht zur Kategorie) in Termin, Motorrad, Gehäuse, Vorlage, Fahrzeug-Anfrage; mit Ablage (anderer gespeicherter Steckplatz, doppelte Datei, unbekannte Kennung) in Termin und Vorlage; Upload-Route lehnt unpassende Steckplätze mit 400 ab.
- Datenbank: Steckplatz an der Kundendatei gespeichert, `kundendateienPruefen` bestätigt nur mit passendem Schlüssel und vor der Zuordnung; Terminbuchung mit echten Kundendateien trägt die vier Steckplätze im Vorgang.

## BELEGE

- Regel: src/lib/server/unterlagen-pflicht.ts, Abschnitt „Eine Pflichtregel für jeden Weg …“ und `unterlagenWeg`, `fahrzeugFall`.
- Server: src/lib/actions/records.ts, `unterlagenAusAblage`, `pflichtMeldung`, Aufrufe im Termin-Zweig und vor der Rubrikprüfung.
- Migration: src/migrations/20261115_165108_steckplaetze.ts (CREATE TYPE enum_kundendateien_steckplatz, ADD COLUMN steckplatz, keine Löschung).
- Meldung im Wortlaut (Test „nennt in der Meldung alles, was fehlt, und warum“): „Bitte ergänzen Sie noch den Fahrzeugschein (Zulassungsbescheinigung Teil I), das Foto der Vorderseite Ihres Schlüssels, das Foto der Rückseite Ihres Schlüssels, das Foto der Spitze beziehungsweise des Profils von vorne und eine kurze Beschreibung Ihres Anliegens (mindestens 20 Zeichen). Die Unterlagen schützen Sie vor Missbrauch: Wir fertigen Schlüssel nur für Berechtigte.“
- G12: Next-Schnittstellen wurden nicht verändert (nur Inhalt eines bestehenden Route Handlers und Client-Komponenten); kein Server gestartet.

- Offene Stelle (Nachbesserung, Befund 3): Das Ziel „Fahrzeug nicht gefunden“ der Fahrzeugsuche (`anfrageHref` in src/components/autoschluessel/fahrzeug-ziel.ts) und `ANFRAGE_OHNE_MARKE` im Assistenten (src/app/(site)/autoschluessel/anfrage/assistent.tsx) führen noch auf die allgemeine Anfrage (src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx). Dort steht noch „Für die Anfrage freiwillig … dazu ein Foto Ihres Schlüssels von beiden Seiten“, und der Server prüft dort keine Pflichtregel. 02B soll beide auf die gemeinsame Anfrage zeigen lassen (Quelle 'fahrzeug-anfrage', Klasse 'nicht-gefunden') und den Text „freiwillig … von beiden Seiten“ durch den Wortlaut des Inhabers ersetzen (Fahrzeugschein grundsätzlich, drei Fotos: Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne).
- Folgeaufgabe Einstiegsseiten (Nachbesserung, Befund 7): src/app/(site)/motorradschluessel/page.tsx (Meta-Beschreibung und Lead) und src/app/(site)/autoschluessel/gehaeuse/page.tsx (Meta-Beschreibung und Lead) sagen noch „Fahrzeugschein und Foto Ihres Schlüssels“. Ändern in „Fahrzeugschein und drei Fotos Ihres Schlüssels“ (02B oder ein Inhaltspaket; außerhalb der Schreibrechte dieses Pakets).

## OFFENE FRAGEN

- create-record.ts und druckansichten.ts stehen nicht ausdrücklich in den Schreibrechten. Ohne die eine Zeile in create-record.ts käme der Steckplatz nicht in den Vorgang (Admin, Vorgangsblatt, Mail hätten nichts zu beschriften); druckansichten.ts ist das HTML-Vorgangsblatt neben dem PDF. Beide Änderungen betreffen nur die Übernahme beziehungsweise Beschriftung des Steckplatzes.
- Die allgemeine Anfrage (service-und-termin/anfrage) mit Thema „Schlüssel nach Vorlage“ legt der Server seit der Nachbesserung im Bereich „Service und Termin“ ab (das Thema bleibt im Vorgang): keine Foto-Anfrage, also keine Freigabe mit Zahlung ohne die drei Fotos. Die Bestätigungsseite im Browser zeigt dafür noch die nächsten Schritte des Themas (naechsteSchritte im Formular, außerhalb der Schreibrechte). Mit Thema „Autoschlüssel“ bleibt sie eine reine Anfrage ohne Pflichtregel; ein Weg zu Freigabe oder Zahlung führt von dort nicht weg, das Team legt einen Auftrag von Hand an. 02B soll beide Themen auf die gemeinsame Anfrage umleiten.
- Unbekannte Quellen (Nachbesserung, Befunde 2 und 8): Bis zur Nachbesserung ging jede Anfrage nach Vorlage oder für Autoschlüssel mit erfundener Quelle (etwa 'x') oder mit Feld `thema` an der Pflichtregel vorbei; der frühere Test schrieb das Durchlassen fest. Jetzt lehnt der Server unbekannte Quellen in beiden Bereichen ab, und jede Anfrage nach Vorlage außer der Einsendung gilt als Foto-Anfrage mit Pflichtregel. Bestand ohne Quelle mit `thema` im Bereich „autoschluessel“ bleibt erlaubt (allgemeine Anfrage), siehe oben.
- create-record.ts und druckansichten.ts: Bitte durch den Orchestrator nachträglich freigeben (Befund 9); inhaltlich betreffen beide nur den Steckplatz.
- Typenschild „wo es eines gibt“: Gebaut als Typenschild-Foto oder FIN oder ausdrückliche Bestätigung „kein Typenschild“. Reicht dem Inhaber die Bestätigung, oder soll eines davon zwingend sein? Die FIN gilt seit der Nachbesserung nur noch im Format nach ISO 3779 (17 Zeichen ohne I, O und Q); kürzere Rahmennummern älterer Mofas zählen nicht als Angabe, dann bleibt das Foto des Typenschilds (siehe FÜR MENSCHEN).
- Roller ohne Wahl gilt als zugelassen (Fahrzeugschein verlangt). Ist das so gewollt?
- Termin-Assistent: Die Beschreibung ist jetzt auch im Termin Pflicht, obwohl Leistung und Fahrzeug schon gewählt sind (Vorgabe: „in jedem dieser Wege“). Bitte bestätigen.
- Ohne eingerichtete Ablage (Notbetrieb) zählt weiter nur die Angabe des Browsers; die Upload-Route lehnt dann ab und das Formular sendet die Dateien nur als Absicht. Beim Livegang muss die Ablage eingerichtet sein (Befund Block 01).

## FÜR MENSCHEN

- Inhaber: Liste der anerkannten Ersatznachweise bestätigen oder ändern (eine Stelle: ERSATZNACHWEISE und ersatznachweise je Klasse in src/lib/fahrzeuge/anfrage-klassen.ts). Vorschlag: Roller mit Versicherungskennzeichen, E-Scooter, Seniorenmobil: Betriebserlaubnis oder Datenbestätigung, Versicherungsbescheinigung, Kaufbeleg; Fahrrad: Kaufbeleg oder Codekarte des Schlosses, dazu Hersteller und Schlüsselnummer.
- Inhaber: Bei Kleinstfahrzeugen ersetzt heute die bloße Bestätigung „kein Typenschild“ das Foto des Typenschilds oder die FIN. Reicht das, oder soll ein Beleg zwingend sein? Und genügt als FIN nur die 17-stellige Nummer nach ISO 3779, oder sollen kürzere Rahmennummern älterer Mofas und Roller auch zählen?
- Orchestrator: Änderungen an src/lib/server/create-record.ts (Steckplatz übernehmen) und src/lib/druckansichten.ts (Beschriftung im HTML-Vorgangsblatt) nachträglich freigeben.
- Inhaber: Wortlaut der Hilfe-Box im Assistenten und der Karte „Ich habe keinen Schlüssel mehr“ freigeben.
- Anwalt (R10, nur Entwurf, nichts eingebaut): In der Datenschutzerklärung, Abschnitt „Hochgeladene Fotos und Unterlagen“, ergänzen: bei „Daten“ „Ersatznachweise für Fahrzeuge ohne Zulassungsbescheinigung (Betriebserlaubnis oder Datenbestätigung, Versicherungsbescheinigung, Kaufbeleg, Codekarte eines Schlosses) und Fotos des Typenschilds“; beim Zweck „beim Fahrzeugschein, bei Ersatznachweisen und bei Sicherungskarten der Nachweis, dass Sie berechtigt sind“; bei der Speicherdauer „Fahrzeugschein und Nachweise {vehicleRegistration} Tage“ statt „Fahrzeugschein …“.
- Echte Beispielfotos für die drei Ansichten (MA-05); bis dahin bleiben die gezeichneten Beispiele.
- Migration auf der echten Datenbank läuft erst beim Livegang (G3).

## Nachbesserung

Nach zwei Gegenprüfungen, 15.11.2026. Prüfungen danach über die Datenweiche: vitest 188 Dateien, 2664 Tests grün · typecheck ohne Fehler · lint ohne Befund · vitest.db (--pg) 16 Dateien, 101 Tests grün · build erfolgreich (168 Seiten).

1. [rot] Termin mit anderem Bereich: behoben. `unterlagenWeg` liefert bei kind „termin“ immer den Weg „termin“; `submitRecord` lehnt jeden Termin mit einem Bereich außer „autoschluessel“ als INVALID_INPUT ab, bevor Unterlagen oder Preis geprüft werden (src/lib/actions/records.ts). Servertest in src/lib/actions/security.test.ts: Termin mit area „service-und-termin“ ohne Unterlagen und auch mit allen Unterlagen abgelehnt; Regeltest in unterlagen-pflicht.test.ts.
2. [rot] Vorlage mit fremder Quelle oder `thema`: behoben. Jede Anfrage im Bereich „schluessel-nach-vorlage“ außer der Einsendung gilt als Weg „vorlage“ (drei Steckplätze, Stückzahl 1 bis 20, Beschreibung auf dem Server). Dazu je Bereich die bekannten Quellen (`ANFRAGE_QUELLEN`, `anfrageQuelleUnbekannt` in src/lib/server/unterlagen-pflicht.ts); unbekannte lehnt `submitRecord` ab. Die allgemeine Anfrage mit Thema „Schlüssel nach Vorlage“ (keine Quelle, aber `thema`, erkannt mit `allgemeineVorlageAnfrage`) legt der Server unter „service-und-termin“ ab, damit `istFotoanfrage` sie nie als Foto-Anfrage mit Freigabe und Zahlung führt; so bleibt das allgemeine Formular ohne Sackgasse. Servertests: Quelle „x“ ohne und mit Fotos abgelehnt, Foto-Anfrage mit `thema` ohne Fotos abgelehnt, ohne Quelle und ohne Thema ohne Fotos abgelehnt, allgemeine Anfrage im Bereich „service-und-termin“ gespeichert.
3. [gelb] „Fahrzeug nicht gefunden“ und `ANFRAGE_OHNE_MARKE` auf der allgemeinen Anfrage: zutreffend, außerhalb der Schreibrechte; als ausdrücklich offene Stelle unter FÜR FA-KERN-02B eingetragen (Ziel: gemeinsame Anfrage, Quelle 'fahrzeug-anfrage', Klasse 'nicht-gefunden'; Text „freiwillig … von beiden Seiten“ ersetzen).
4. [gelb] Hinweis ohne Schlüssel: behoben. Der Hinweis „Ist keiner mehr da, bestätigen Sie das unten.“ hängt jetzt an `data.workingKeys === 0`; nach der Bestätigung steht „Sie haben bestätigt, dass kein Schlüssel mehr da ist. Die Fotos sind dann freiwillig.“ (src/app/(site)/autoschluessel/anfrage/assistent.tsx).
5. [gelb] Erreichbarkeit mit doppeltem Punkt: behoben. Die Hilfe-Box nutzt `erreichbarkeitSatz` aus src/lib/erreichbarkeit.ts (Satzzeichen-Schutz).
6. [gelb] Beispielbild der Spitze: behoben. Der Steckplatz „Spitze beziehungsweise Profil von vorne“ zeigt dieselbe Zeichnung wie die Vorlage-Anfrage (`profilschnitt`, ohne Beschriftung) statt der Seitenansicht des Barts (src/components/autoschluessel/optionen.ts). Echte Fotos bleiben MA-05.
7. [gelb] Einstiegsseiten Motorrad und Gehäuse: zutreffend, außerhalb der Schreibrechte; als Folgeaufgabe unter FÜR FA-KERN-02B eingetragen.
8. [rot] Pflichtregel hängt an der Quelle des Browsers: behoben wie Befund 2, auch für „autoschluessel“ (bekannt: motorrad, gehaeuse, fahrzeug-anfrage, ohne Quelle die allgemeine Anfrage). Der frühere Test, der das Durchlassen festschrieb, ist ersetzt; die Lücke und die verbleibende allgemeine Autoschlüssel-Anfrage stehen unter OFFENE FRAGEN.
9. [gelb] create-record.ts und druckansichten.ts außerhalb der Schreibrechte: zutreffend, inhaltlich unverändert gelassen; Freigabe durch den Orchestrator unter FÜR MENSCHEN erbeten.
10. [gelb] FIN-Muster zu weit: behoben. `FIN_MUSTER` verlangt jetzt 17 Zeichen ohne I, O und Q (ISO 3779); „ABCDE“, „ABC12345“, 16 und 18 Zeichen sowie ein „O“ werden im Regeltest abgelehnt. Die Frage zur Bestätigung „kein Typenschild“ und zu kürzeren Rahmennummern steht unter FÜR MENSCHEN.
11. [gelb] Formulare laden lib/server: behoben. `BESCHREIBUNG_MIN`, `BESCHREIBUNG_MAX` und `beschreibungGueltig` liegen jetzt in src/lib/wege/nachweis.ts (Grund im Kommentar), unterlagen-pflicht.ts reicht sie weiter. Motorrad (kern.ts), Gehäuse (kern.ts), Vorlage (anfrage-formular.tsx) und Termin-Assistent (assistent.tsx) importieren von dort; kein Formular lädt mehr ein Modul unter lib/server.

Geänderte Dateien der Nachbesserung: src/lib/server/unterlagen-pflicht.ts, src/lib/server/unterlagen-pflicht.test.ts, src/lib/actions/records.ts, src/lib/actions/security.test.ts, src/lib/wege/nachweis.ts, src/app/(site)/autoschluessel/anfrage/assistent.tsx, src/app/(site)/motorradschluessel/anfrage/kern.ts, src/app/(site)/autoschluessel/gehaeuse/anfrage/kern.ts, src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx, src/components/autoschluessel/optionen.ts, dieser Bericht.

## ABNAHME (Orchestrator, 15.11.2026)

- **Prüfkette grün** (`werkzeuge/abnahme.sh FA-KERN-02`): Typprüfung, Lint, Unit 2.664 Tests in 188 Dateien, Datenbanktests 101 in 16 Dateien (mit der Migration `20261115_165108_steckplaetze`), Build ohne Datenbank 168 von 168 Seiten.
- **Sichtprobe im Browser** bei 390 × 844 (Attrappen, keine Uploads, kein Absenden): Motorradanfrage bis Schritt 3 „Fotos von Schlüssel und Fahrzeugschein“: Karte „Ich habe keinen Schlüssel mehr“, drei Steckplätze mit Beispielbild und Satz, Fahrzeugschein; „Weiter“ bleibt gesperrt und die Leiste sagt, was fehlt. Gehäuse-Anfrage bis Schritt 3: dieselben Steckplätze, keine Totalverlust-Karte. Vorlage-Anfrage: Steckplatz Vorderseite im ersten Schritt, „Weiter“ gesperrt ohne Foto. Keine Fehler in der Konsole.
- **Freigegeben:** die zwei Änderungen außerhalb der Schreibrechte (`src/lib/server/create-record.ts`: Steckplatz in den Vorgang übernehmen; `src/lib/druckansichten.ts`: Beschriftung im Vorgangsblatt). Beide sind nötig, damit Admin, Blatt und Mail den Steckplatz zeigen.
- **Nachgezogen:** Die Einstiegsseiten `/autoschluessel/gehaeuse` und `/motorradschluessel` nennen jetzt „drei Fotos Ihres Schlüssels“ wie die Formulare.
- **An FA-KERN-02B übergeben** (steht in der Paketdatei): Ziel „Fahrzeug nicht gefunden“ und `ANFRAGE_OHNE_MARKE` führen noch in die allgemeine Anfrage; die allgemeine Anfrage nimmt Schlüsselanfragen zu Autoschlüssel und Vorlage noch ohne Unterlagen an und soll in die geführten Wege verweisen.
- **Fragen an den Inhaber** (MA-38): Bestätigung „kein Typenschild“, kürzere Rahmennummern, Mindestlänge der Beschreibung, Roller ohne Angabe.
- **Onpage-Messung nach diesem Build** (für FA-SEO-01A nachgeholt): 130 Seiten, Median 98,2, keine Seite unter 95, kein roter Befund; gelb bleiben Titel auf 74 und Beschreibungen auf 24 Seiten, alle außerhalb der Quellen von Teil A (61 Marken- und Modellseiten, 8 Ratgeber, je ein bis zwei bei Motorrad, Gehäuse, Standorte, Kontakt, Vor Ort, Anfrage, Beratung, Partnerseiten, Versand und Zahlung).
