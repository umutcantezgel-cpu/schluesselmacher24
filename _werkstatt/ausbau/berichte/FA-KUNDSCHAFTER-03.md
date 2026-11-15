# FA-KUNDSCHAFTER-03 · Partnernetzwerk, Partnergewinnung, Partnerseiten

Stand der Prüfung: 15.11.2026, Repository /home/user/schluesselmacher24.
Quelle: _werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt, Abschnitte 07 und 08 (vollständig gelesen). Maßstab: Abschnitt 01 (echte End-to-End-Funktion, Qualitätsanspruch, Pflege ohne Entwickler) und Abschnitt 29 (Erwartung an die finale Version).
Vorgehen: nur Lesen (Glob, Grep, Read). Keine Projektbefehle, kein git, keine .env-Dateien, keine Netzabrufe.

## Ergebnis in Zahlen

Anforderungen: 36 (Abschnitt 07: 19, Abschnitt 08: 17).
Urteile: erfuellt 4 (07-13, 08-09, 08-13, 08-15) · teilweise 16 · fehlt 15 · widerspricht 1 (07-02). Summe 36.

Kernbefund: Das Partnernetzwerk ist technisch vorhanden (Bewerbung, Prüfstatus, Vermittlungsstand, Auftragsarten, Vertragsentwurf). Die Bestandsaufnahme zeigt drei harte Lücken: (1) das Netzwerk ist nicht auf Autoschlüssel begrenzt, (2) die Vermittlung prüft weder Freischaltung noch Region oder Pausierung, (3) die Partnergewinnung hat keine Startseiten-Sektion und keine der fünf Landingpages.

## Tabelle

| ID | Anforderung (kurz) | Urteil | Aufwand | Mensch |
|---|---|---|---|---|
| FA-07-01 | Netzwerk nicht neu erfinden, sichtbarer, professioneller, technisch besser verbunden | teilweise | M | Freigabe der Produktentscheidung |
| FA-07-02 | Netzwerk nur Autoschlüssel und Fahrzeugschlüssel, keine Schlüsseldienst-Türöffnungen | widerspricht | S | Entscheidung des Inhabers zum Partnerkreis |
| FA-07-03 | Plattformmodell: Kunde über S24, Anfrage qualifizieren, an Partner weitergeben, Zuordnung und Qualitätsstandard | teilweise | M | Abläufe und Kundenhinweise freigeben |
| FA-07-04 | Partnerleistung Autoschlüssel nachmachen | teilweise | S | keiner |
| FA-07-05 | Partnerleistung Programmierung und Anlernen | teilweise | S | keiner |
| FA-07-06 | Partnerleistung Schlüsselverlust | fehlt | S | keiner |
| FA-07-07 | Partnerleistung Keyless und Smart Key | fehlt | S | keiner |
| FA-07-08 | Partnerleistung Transponder | fehlt | S | keiner |
| FA-07-09 | Partnerleistung Funk | fehlt | S | keiner |
| FA-07-10 | Partnerleistung Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln | teilweise | S | keiner |
| FA-07-11 | Partnerleistung Reparaturen und Gehäuse | fehlt | S | keiner |
| FA-07-12 | Partnerleistung Motorrad und weitere Fahrzeugschlüssel, sofern angeboten | fehlt | S | Partner bestätigt Angebot |
| FA-07-13 | Qualität: Betrieb und Identität prüfen | erfuellt | - | laufende Prüfung durch das Team |
| FA-07-14 | Qualität: Leistungsumfang und Fahrzeugabdeckung dokumentieren | teilweise | M | Fahrzeugdaten je Partner pflegen |
| FA-07-15 | Qualität: Maschinen, Programmiergeräte, Werkstattausstattung erfassen | teilweise | S | Angaben der Betriebe |
| FA-07-16 | Qualität: Region und mobilen Einsatzradius erfassen | teilweise | S | keiner |
| FA-07-17 | Qualität: Betrieb nach Möglichkeit persönlich besucht und vor Ort angesehen | fehlt | S | Besuch durchführen |
| FA-07-18 | Qualität: Qualitätsstandard schriftlich, nur geeignete Betriebe als aktive Partner | teilweise | M | Anwalt liefert Vertragstext und Partner-AGB |
| FA-07-19 | Qualität: bei Problemen pausieren oder sperren | teilweise | S | keiner |
| FA-08-01 | Partner finden S24 über Google, Partnerbereich deutlich sichtbarer | teilweise | M | Suchbegriffe und Texte freigeben |
| FA-08-02 | Startseiten-Sektion „Autoschlüssel Profi? Partner werden“ | fehlt | S | Texte freigeben |
| FA-08-03 | Eigene Landingpages für Partnergewinnung (allgemein) | fehlt | M | Texte, Bilder |
| FA-08-04 | Landingpage „Autoschlüssel Partner werden“ | fehlt | S | Text freigeben |
| FA-08-05 | Landingpage „Autoschlüssel Aufträge erhalten“ | fehlt | S | Text freigeben |
| FA-08-06 | Landingpage „Fahrzeugschlüssel Netzwerk Deutschland“ | fehlt | S | Text freigeben |
| FA-08-07 | Landingpage „KFZ Schlüssel Partner werden“ | fehlt | S | Text freigeben |
| FA-08-08 | Landingpage „Autoschlüssel Kooperation“ | fehlt | S | Text freigeben |
| FA-08-09 | Partnerformular: Region | erfuellt | - | keiner |
| FA-08-10 | Partnerformular: Leistungen | teilweise | S | Leistungsliste bestätigen |
| FA-08-11 | Partnerformular: Geräte | teilweise | S | keiner |
| FA-08-12 | Partnerformular: Werkstatt | fehlt | S | keiner |
| FA-08-13 | Partnerformular: mobiler Radius | erfuellt | - | keiner (Grenzwert siehe FA-07-16) |
| FA-08-14 | Partnerformular: Erfahrung | teilweise | S | keiner |
| FA-08-15 | Partnerformular: Kontaktdaten | erfuellt | - | keiner |
| FA-08-16 | Zuordnung zu einer Region nach Prüfung und Vor-Ort-Qualitätskontrolle | teilweise | M | Vor-Ort-Besuch und Freigabe |
| FA-08-17 | Admin: nachvollziehbar, welcher Lead welchem Partner angeboten oder zugeteilt wurde | teilweise | M | keiner |

## Einzelheiten Abschnitt 07

### FA-07-01 · Netzwerk vorhanden, sichtbarer und technisch verbunden · teilweise
Fundstellen: src/payload/collections/Partnerbetriebe.ts:23-33, 140 (Relation bewerbung auf Vorgang); src/payload/collections/Vorgaenge.ts:386-392 (Feld vermittlung.partner zeigt auf Vorgaenge mit art partner); src/lib/navigation.ts:311-317 (Partner nur unter Mehr); src/components/layout/site-footer.tsx:19.
Lücke: Der Partnerbereich ist nur über das Menü „Mehr“ und den Footer erreichbar. Die Verbindung zwischen Auftrag und Partnerbetrieb läuft über zwei Umwege: Der Auftrag verweist auf den Bewerbungsvorgang, der Partnerbetrieb verweist ebenfalls auf den Bewerbungsvorgang. Eine automatische Übernahme der Bewerbung in den Partnerdatensatz gibt es nicht; im Code existiert kein Anlegen eines Partnerbetriebs aus einem Vorgang.
Bauen: Startseiten-Sektion (siehe FA-08-02), direkte Verknüpfung Partnerbetrieb zu Bewerbung oder Partnerbetrieb als eigene Relation im Vorgang, Übernahme-Aktion im Admin.
Aufwand: M.

### FA-07-02 · Nur Autoschlüssel, keine Schlüsseldienst-Türöffnungen · widerspricht
Fundstellen:
- src/app/(site)/partner-werden/partner-formular.tsx:33-39 (LEISTUNGEN mit Schließtechnik, Türöffnung „Öffnung von Wohnungs-, Haus- und Fahrzeugtüren“, Zutritt, Sicherheitstechnik)
- src/payload/collections/Partnerbetriebe.ts:9-16 (AUFTRAGSARTEN mit schluesseldienst-vor-ort, montage-zylinder, montage-schliessanlage, beratung-vor-ort, einbau-elektronik)
- src/lib/pdf/partnervertrag.ts:79-86 (Auftragsarten-Namen im Vertrag)
- content/rubriken.json:391-395 (Rubrik „Schlüsseldienst vor Ort“: „anderswo über Partner“)
- src/app/(site)/service-und-termin/vor-ort/einsatz-formular.tsx:127 und :361 (Text: „Ob die Werkstatt oder ein Partner kommen kann“)
- src/app/(site)/partner-werden/page.tsx:96 (Lead: „Wir vermitteln Kundenanfragen aus ganz Deutschland“ ohne Begrenzung auf Autoschlüssel)
- _werkstatt/ausbau/KARTE.md, Zeile zu F20 („Schlüsseldienst Partner werden“)
Lücke: Der Bestand macht das Netzwerk ausdrücklich zu einem allgemeinen Schlüsseldienst-Netzwerk. Die Netzwerkbegriffe Schlüsseldienst, Tür, Montage, Beratung und Elektronik widersprechen dem Grundsatz, dass das Netzwerk nicht für Türöffnungen gedacht ist. Nur der Punkt „Autoschlüssel vor Ort“ liegt im Rahmen.
Bauen: Leistungsliste und Auftragsarten auf Autoschlüssel und Fahrzeugschlüssel begrenzen; Rubrik Schlüsseldienst vor Ort und Einsatzformular-Text von Partnern bereinigen; Partnervertrag-Auftragsarten anpassen; Lead-Text auf der Partnerseite präzisieren. Die Auftragsarten sind als Code-Konstante hinterlegt, daher ist die Änderung für den Betreiber ohne Entwickler nicht pflegbar (siehe Maßstab unten).
Aufwand: S. Die fachliche Entscheidung, ob andere Partnerkreise gewünscht sind, liegt beim Inhaber.

### FA-07-03 · Plattformmodell (Qualifizieren, weitergeben, zuordnen) · teilweise
Fundstellen: src/lib/partner/vermittlung.ts:11-18 (Vermittlungsübergänge neu, geprueft, partner-angefragt, angenommen, erledigt, provision-abgerechnet); src/payload/collections/Vorgaenge.ts:52-59 und 364-400 (Stand der Vermittlung und Partnerverweis); src/app/(site)/partner-werden/page.tsx:36-64 (Ablauf der Vermittlung); src/lib/terminort.ts:109-111 (Hinweis für Anfragen außerhalb der Region: „Termine finden in unserer Werkstatt statt“).
Lücke: Die Zustandsfolge ist vorhanden, aber nur als Handarbeit. Eine Qualifizierung nach festen Kriterien fehlt. Im Autoschlüssel-Termin gibt es keinen Weg zu einem Partner: Außerhalb der Region wird auf die Werkstatt verwiesen. Die Seite Partner werden verspricht (src/app/(site)/partner-werden/page.tsx:54-56), dass der Kunde vorher erfährt, welcher Betrieb ausführt und Vertragspartner ist. Im Bestand gibt es keine Stelle, die das dem Kunden mitteilt; die Bestätigungsmail nennt nur das Unternehmen des Betreibers (src/lib/mail/vorlagen/vertragsbestaetigung.ts:163, :218). Dies ist eine Zusage ohne Umsetzung (Regel R4 und R9).
Bauen: Qualifizierungsfelder am Vorgang, Weg vom Autoschlüssel-Termin zur Partnerübergabe (mit 05 abstimmen), Kundenmitteilung über den ausführenden Betrieb, Vertragspartner-Angabe in der Bestätigung. Die Ablaufseite nur nach Umsetzung so lassen.
Aufwand: M. Offene Frage, siehe unten.

### FA-07-04 bis FA-07-09 · Einzelne Partnerleistungen
- FA-07-04 Autoschlüssel nachmachen, teilweise. Fundstellen: src/app/(site)/partner-werden/partner-formular.tsx:34 (Leistung „Autoschlüssel“ mit Hinweis „Nachmachen, programmieren, anlernen“); src/payload/collections/Partnerbetriebe.ts:10 (Auftragsart „Autoschlüssel vor Ort“). Lücke: Ein einziger Sammelpunkt, kein Auftragsart für das Nachmachen ohne Vor-Ort-Bezug. Die Auftragsart verlangt „vor Ort“, obwohl das Programmieren laut src/app/(site)/service-und-termin/vor-ort/page.tsx:27-31 in der Werkstatt stattfindet. Bauen: Auftragsarten aus den Partnerleistungen der Anforderung 07 ableiten. S.
- FA-07-05 Programmierung und Anlernen, teilweise. Gleicher Befund: nur als Beschreibungstext, keine eigene Auftragsart. S.
- FA-07-06 Schlüsselverlust, fehlt. Fundstellen: keine Auftragsart und kein Leistungsfeld in partner-formular.tsx:33-39 und Partnerbetriebe.ts:9-16. S.
- FA-07-07 Keyless und Smart Key, fehlt. Fundstellen wie oben. S.
- FA-07-08 Transponder, fehlt. Fundstellen wie oben. S.
- FA-07-09 Funk, fehlt. Fundstellen wie oben. S.

### FA-07-10 · Fahrzeugöffnung im Zusammenhang mit Autoschlüsseln · teilweise
Fundstellen: src/app/(site)/partner-werden/partner-formular.tsx:36 (Leistung „Türöffnung“, Beschreibung „Öffnung von Wohnungs-, Haus- und Fahrzeugtüren“).
Lücke: Die Fahrzeugöffnung gibt es nur als allgemeine Türöffnung, die auch Wohnungs- und Haustüren umfasst. Dies widerspricht FA-07-02. Eine Auftragsart Fahrzeugöffnung im Autoschlüssel-Zusammenhang fehlt.
Bauen: Leistung auf Fahrzeugöffnung im Autoschlüssel-Zusammenhang umstellen, Türöffnung streichen. S.

### FA-07-11 · Reparaturen und Gehäuse · fehlt
Fundstellen: keine Leistung und keine Auftragsart in partner-formular.tsx:33-39 und Partnerbetriebe.ts:9-16.
Bauen: Auftragsart Reparatur und Gehäuse anlegen und im Formular aufnehmen. S.

### FA-07-12 · Motorrad und weitere Fahrzeugschlüssel · fehlt
Fundstellen: keine Auftragsart und keine Leistung für Motorrad in partner-formular.tsx:33-39 und Partnerbetriebe.ts:9-16. Die Kundenseite Motorrad existiert (src/app/(site)/motorradschluessel/page.tsx), für Partner jedoch nicht.
Bauen: optionale Auftragsart Motorrad und weitere Fahrzeugschlüssel, nur wenn der Betrieb es anbietet. S. Mensch: Partner bestätigt das Angebot.

### FA-07-13 · Betrieb und Identität prüfen · erfuellt
Fundstellen: src/payload/collections/Partnerbetriebe.ts:95-107 (Gruppe pruefung mit Häkchen Gewerbe geprüft, Identität geprüft, Fachliche Eignung geprüft); src/lib/partner/bewerbung.ts:55-62 (fehltFuerFreischaltung); src/lib/partner/bewerbung.ts:65-72 (Sperre beim Wechsel auf freigeschaltet); src/lib/partner/partnerbetriebe.db.test.ts:28-45 (Test der Freischaltung nach Prüfung).
Urteil: Die Prüfschritte sind als Pflicht vor der Freischaltung umgesetzt und werden auf Datenbankebene getestet. Die Prüfung selbst bleibt eine Entscheidung des Teams, die das Häkchen dokumentiert. Ein Nachweisbezug zum Häkchen fehlt; das ist keine Anforderung des Abschnitts.

### FA-07-14 · Leistungsumfang und Fahrzeugabdeckung dokumentieren · teilweise
Fundstellen: src/payload/collections/Partnerbetriebe.ts:94 (Feld auftragsarten, nur sechs Auftragsarten); src/app/(site)/partner-werden/partner-formular.tsx:394-401 (Freitext Autohersteller und Systeme, nur in der Bewerbung); src/payload/collections/Partnerbetriebe.ts (kein Feld für Marken oder Modelle).
Lücke: Der Partnerdatensatz kennt keine Fahrzeugabdeckung. Die Marken aus dem Freitext der Bewerbung werden nicht übernommen. Eine Verknüpfung mit der Fahrzeugdatenbank (Abschnitt 06, nicht Teil dieses Auftrags) fehlt.
Bauen: Mehrfachauswahl Marken und Modelle aus der Fahrzeugdatenbank am Partnerbetrieb, Leistungsumfang aus den Partnerleistungen der Anforderung 07. M, abhängig von Abschnitt 06.

### FA-07-15 · Maschinen, Programmiergeräte, Werkstattausstattung erfassen · teilweise
Fundstellen: src/app/(site)/partner-werden/partner-formular.tsx:394-401 (Freitext Autohersteller und Systeme, Hinweis nennt Geräte); src/payload/collections/Partnerbetriebe.ts (kein Feld für Geräte).
Lücke: Die Geräte stehen nur als Freitext in der Bewerbung. Im Partnerdatensatz fehlt jedes Feld, daher geht die Angabe bei der Übernahme verloren.
Bauen: strukturierte Liste Geräte und Ausstattung (Programmiergeräte, Fräse, Schneidemaschine) am Partnerbetrieb. S.

### FA-07-16 · Region und mobiler Einsatzradius erfassen · teilweise
Fundstellen: src/payload/collections/Partnerbetriebe.ts:85-93 (Gruppe einsatzgebiet mit Postleitzahlen als Freitext und radiusKm mit max 300, Zeile 91); src/app/(site)/partner-werden/partner-formular.tsx:74 (MAX_RADIUS_KM = 1000), :323-340 (Einsatzradius), :343-363 (mobil ja oder nein).
Lücke: Die Bewerbung erlaubt bis 1000 km, der Partnerdatensatz bis 300 km. Der Schalter mobile Einsätze wird im Partnerdatensatz nicht gespeichert. Die Postleitzahlen sind ein freies Textfeld ohne Prüfung. Die Region ist nicht mit den Ortsseiten (Einsatzgebiete, src/payload/collections/Einsatzgebiete.ts:8-46) verknüpft.
Bauen: Grenzwert vereinheitlichen, Schalter mobil übernehmen, PLZ-Format prüfen. S.

### FA-07-17 · Persönlicher Besuch vor der Freischaltung · fehlt
Fundstellen: src/payload/collections/Partnerbetriebe.ts:95-107 (Prüfgruppe ohne Besuchsfeld); src/lib/partner/bewerbung.ts:47-62 (Prüfung ohne Besuch); Suche nach „besuch“ in src/payload und src/lib/partner ohne Treffer.
Lücke: Der Besuch vor Ort ist nirgends erfasst. Die Anforderung verlangt „nach Möglichkeit“, dokumentiert werden sollte er trotzdem.
Bauen: Felder Besuch am, Besuch durch, Notiz zum Besuch in der Prüfgruppe; optional als Bedingung für den Wechsel auf freigeschaltet. S.
Mensch: Der Besuch selbst.

### FA-07-18 · Qualitätsstandard schriftlich, nur geeignete Betriebe aktiv · teilweise
Fundstellen: src/lib/partner/bewerbung.ts:55-62 (Eignung als Gate); src/lib/pdf/partnervertrag.ts:44 (geprueft: false), :68 (Platzhalter Laufzeit), :72 (Partner-AGB Platzhalter), :77 (Entwurfshinweis); src/payload/hooks/partnervertrag-pdf.ts:25-62 (Endpunkt nur für Team).
Lücke: Die Eignung wird als Gate geprüft. Der schriftliche Qualitätsstandard fehlt: Die Vertragsvorlage ist ein Entwurf mit Platzhaltern, die Partner-AGB fehlen, und Pflichten und Haftung sind nicht ausformuliert.
Bauen: Abschnitt Qualitätsstandard in die Vorlage aufnehmen, Partner-AGB einbinden. M.
Mensch: Anwalt liefert Vertragstext, Partner-AGB und Qualitätsstandard. Nach Regel R10 nur als Entwurf zur Prüfung.

### FA-07-19 · Pausieren oder Sperren bei Qualitätsproblemen · teilweise
Fundstellen: src/lib/partner/bewerbung.ts:14, :25, :37-38 (Status pausiert, Übergänge freigeschaltet und pausiert in beide Richtungen, beendet als Endzustand); src/payload/collections/Partnerbetriebe.ts:70 (Feld Stand); src/lib/partner/vermittlung.ts:31-33 (darfVermitteln prüft Status freigeschaltet, wird im Produktivcode nicht aufgerufen; nur src/lib/partner/partner.test.ts:46-48); src/payload/collections/Vorgaenge.ts:386-392 (Partnerauswahl ohne Statusfilter); src/lib/server/freigabe.db.test.ts:110-148 (Test: ein Partnerbewerbung mit Status neu wird einem Auftrag zugeordnet).
Lücke: Pausieren und Beenden sind möglich. Die Sperre wirkt jedoch nicht: Ein pausierter oder abgelehnter Betrieb bleibt für Vermittlungen wählbar, weil die Partnerauswahl im Vorgang keinen Status prüft. Der Test in freigabe.db.test.ts belegt die Zuordnung eines unfreigegebenen Partners. Es gibt keinen Pflichtgrund für die Pausierung.
Bauen: darfVermitteln in den Speicherweg der Vorgänge hängen (Hook in src/payload/collections/Vorgaenge.ts), Filter auf die Partnerauswahl nach Status, Pflichtnotiz bei Pausierung. S.

## Einzelheiten Abschnitt 08

### FA-08-01 · Partner finden S24 über Google, Partnerbereich sichtbarer · teilweise
Fundstellen: src/app/sitemap.ts:69 (Priorität 0.4); content/seo.json:690-710 (Titel, Beschreibung, Bild für Partner werden); src/app/(site)/partner-werden/page.tsx:21-33 (Metadaten); src/lib/navigation.ts:313 (Menü Mehr); src/components/layout/site-footer.tsx:19 (Footer).
Lücke: Die Seite ist indexierbar und hat Metadaten. Sichtbarkeit fehlt: keine Verlinkung von der Startseite, keine Landingpages mit Partner-Suchbegriffen, Priorität 0.4 in der Sitemap.
Bauen: Startseiten-Sektion (FA-08-02), Landingpages (FA-08-03 bis FA-08-08), Sitemap-Priorität anheben. M.

### FA-08-02 · Startseiten-Sektion „Autoschlüssel Profi? Partner werden“ · fehlt
Fundstellen: src/app/(site)/page.tsx (keine Partnersektion; Suche nach partner und Profi ohne Treffer); Suche im gesamten Repository nach „Profi?“ ohne Treffer.
Lücke: Die Sektion fehlt vollständig.
Bauen: Komponente für Startseiten-Sektion mit Überschrift und Weg zur Landingpage, Inhalt aus content/*.json, damit der Betreiber den Text pflegen kann. S.
Mensch: Freigabe des Textes und Bilder.

### FA-08-03 · Eigene Landingpages für Partnergewinnung (allgemein) · fehlt
Fundstellen: Routenliste aus src/app/**/page.tsx: nur /partner-werden (src/app/(site)/partner-werden/page.tsx). Keine dynamische Partnerroute; das Fangnetz src/app/(site)/[...unbekannt]/page.tsx würde unbekannte Pfade abfangen.
Lücke: Keine eigenen Seiten zur Partnergewinnung.
Bauen: Dynamische Route für Partnerseiten mit Daten aus einer Payload-Sammlung (Titel, Text, Suchbegriff, Canonical, Indexstatus), damit der Betreiber Seiten ohne Entwickler anlegt. Sitemap und Metadaten einbinden. M.
Mensch: Texte, Freigabe.

### FA-08-04 bis FA-08-08 · Fünf Landingpages
Jede Seite fehlt: keine Route und kein Inhalt für „Autoschlüssel Partner werden“, „Autoschlüssel Aufträge erhalten“, „Fahrzeugschlüssel Netzwerk Deutschland“, „KFZ Schlüssel Partner werden“, „Autoschlüssel Kooperation“. Fundstelle: wie FA-08-03 (Routenliste) und Suche nach den Titeln ohne Treffer.
Bauen: je Seite eine Dateneintragung auf Basis der Vorlage aus FA-08-03, jeweils S. Sinnvoll ist nur mit echtem Inhalt (Regel R3, Informationsgewinn).
Mensch: Texte und Freigabe je Seite.

### FA-08-09 · Partnerformular: Region · erfuellt
Fundstellen: src/app/(site)/partner-werden/partner-formular.tsx:313-322 (PLZ und Ort), :106 (Prüfung PLZ mindestens 4 Zeichen, Ort mindestens 2 Zeichen), :139 (Anzeige in der Zusammenfassung), :175-176 (Übergabe in den Vorgang).
Urteil: PLZ und Ort sind Pflichtfelder und werden übergeben. Die Region im Partnerdatensatz ist die Verbindung nach FA-07-16.

### FA-08-10 · Partnerformular: Leistungen · teilweise
Fundstellen: src/app/(site)/partner-werden/partner-formular.tsx:33-39 (fest im Code), :367-391 (Auswahl), :123 (Namen).
Lücke: Die Leistungsliste ist fest im Code, nicht im Betreiber-Backend pflegbar, und enthält Nicht-Autoschlüssel-Leistungen (FA-07-02).
Bauen: Leistungsliste aus einer Payload-Sammlung, nur Partnerleistungen aus FA-07-04 bis FA-07-12. S.

### FA-08-11 · Partnerformular: Geräte · teilweise
Fundstellen: src/app/(site)/partner-werden/partner-formular.tsx:394-401 (Freitext Autohersteller und Systeme, Hinweis: „eingesetzte Geräte oder Schließsysteme“).
Lücke: Kein eigenes Feld für Geräte, nur ein Freitextfeld mit gemischtem Inhalt.
Bauen: Feld Geräte mit Auswahl aus einer Liste, Freitext als Ergänzung. S.

### FA-08-12 · Partnerformular: Werkstatt · fehlt
Fundstellen: partner-formular.tsx:33-39 und 343-363 (Werkstatt wird nur als Hinweis bei der Auswahl Mobile Einsätze erwähnt: „Aufträge nur in unserer Werkstatt oder unserem Geschäft“, das ist die Werkstatt des Betreibers, nicht die des Partners).
Lücke: Keine Angaben zur Werkstatt des Partners (Standort, Ausstattung, Platz, Öffnung).
Bauen: Feld Werkstatt vorhanden ja oder nein, Anschrift der Werkstatt, Ausstattung (verknüpft mit FA-07-15). S.

### FA-08-13 · Partnerformular: mobiler Radius · erfuellt
Fundstellen: partner-formular.tsx:323-340 (Einsatzradius 1 bis 1000 km), :343-363 (mobile Einsätze ja oder nein), :74 (Grenze 1000).
Urteil: Die Anforderung ist im Formular erfüllt. Die Abweichung zur Grenze 300 im Partnerdatensatz steht bei FA-07-16.

### FA-08-14 · Partnerformular: Erfahrung · teilweise
Fundstellen: partner-formular.tsx:403-416 (Freitextfeld Qualifikationen, Hinweis „Jahre im Betrieb“).
Lücke: Die Erfahrung ist nur ein Hinweis im Freitext, kein Feld.
Bauen: Feld Jahre im Betrieb (Zahl) und Feld Ausbildung oder Meisterbrief (Auswahl). S.

### FA-08-15 · Partnerformular: Kontaktdaten · erfuellt
Fundstellen: partner-formular.tsx:251-306 (Firma, Anrede, Vor- und Nachname, E-Mail, Telefon), :163-178 (Kontakt im Vorgang), src/lib/mail/vorlagen/kunde-eingang.ts:40, :54-56 (Eingangsbestätigung an den Bewerber), src/lib/mail/vorlagen/betrieb-neuer-vorgang.ts:57-82 (Mail an das Team).
Urteil: Vollständig vorhanden, Mails laufen.

### FA-08-16 · Zuordnung zu einer Region nach Prüfung und Vor-Ort-Kontrolle · teilweise
Fundstellen: src/payload/collections/Partnerbetriebe.ts:85-93 (Einsatzgebiet); src/lib/partner/bewerbung.ts:65-72 (Gate nur für Freischaltung, nicht für Zuordnung); src/payload/collections/Partnerbetriebe.ts:23-50 (Hook prüft Status); src/payload/collections/Einsatzgebiete.ts:8-46 (Städteseiten ohne Partnerbezug).
Lücke: Die Region wird am Partnerdatensatz gespeichert, aber nicht zu den Ortsseiten verknüpft. Die Zuordnung zu einer Region setzt keine Vor-Ort-Kontrolle voraus (FA-07-17 fehlt). Der Admin kann einen Auftrag einem Partner zuordnen, dessen Region nicht passt; es gibt keine Prüfung der PLZ.
Bauen: Relation Partnerbetrieb zu Einsatzgebiet, PLZ-Prüfung bei der Zuordnung, Gate Vor-Ort-Kontrolle. M.

### FA-08-17 · Nachvollziehbarkeit Lead zu Partner · teilweise
Fundstellen: src/payload/collections/Vorgaenge.ts:364-400 (Tab Vermittlung mit Stand, Partner, Provision, Notiz); src/payload/hooks/vorgang-benachrichtigen.ts:113-114 und 163-174 (nur Statuswechsel werden im Verlauf festgehalten, Vermittlung nicht); src/lib/data/payload-mapping.ts:1229-1252 (Vermittlung als eine Gruppe, beim Speichern überschrieben); Suche nach „vermittlung“ in src/payload/hooks ohne Treffer.
Lücke: Der aktuelle Stand ist sichtbar, die Historie nicht. Ein Lead kann nur einem Partner gleichzeitig zugeordnet sein; ein früheres Angebot an einen anderen Betrieb geht beim Überschreiben verloren. Die Auswahl zeigt die Nummer des Bewerbungsvorgangs statt des Firmennamens. Auf dem Partnerdatensatz gibt es keine Liste der zugeordneten Leads.
Bauen: Verlauf für Vermittlungsänderungen (Zeit, Bearbeiter, alter und neuer Partner), Anzeige Firma in der Auswahl, Rückverweis am Partnerdatensatz. M.

## Querbefunde

1. Teile des Bestands, die nur in Tests vorkommen: src/lib/partner/vermittlung.ts (darfVermitteln, vermittlungWechselErlaubt) und src/lib/partner/sichtbarkeit.ts (partnerSiehtVorgang, partnerAuszug) werden im Produktivcode nicht aufgerufen. Die Regeln bestehen nur als reine Funktionen und sind nicht wirksam.
2. Die Partnerliste (AUFTRAGSARTEN, LEISTUNGEN, PRUEFUNG auf der Seite, ABLAUF) ist fest im Code. Abschnitt 01 und 29 verlangen, dass der Betreiber Produkte, Kategorien, Inhalte und Partner ohne Entwickler pflegt. Betroffen sind src/payload/collections/Partnerbetriebe.ts:9-16, src/app/(site)/partner-werden/partner-formular.tsx:33-39, src/app/(site)/partner-werden/page.tsx:36-74.
3. Die Serverseite prüft bei einer Partnerbewerbung nur Bereich und Datenschutz (src/lib/actions/records.ts:150-153). Die Felder im Feld payload sind eine freie Struktur (src/lib/server/record-schema.ts:62-64), also werden PLZ, Radius und Leistungen serverseitig nicht geprüft.
4. Platzhalter und Entwürfe: Der Vertrag ist ein Entwurf (src/lib/pdf/partnervertrag.ts:44, :68, :72), Entwurfshinweis in src/lib/pdf/partnervertrag.ts:77. Das ist nach R10 richtig und für den Livegang durch den Anwalt zu ersetzen.
5. Sechs Auftragsarten in Partnerbetriebe.ts entsprechen nicht den Partnerleistungen der Anforderung 07. Die Begriffe passen nicht zusammen.

## Maßstab (Abschnitte 01 und 29)

- Echte End-to-End-Funktion: Bewerbung, Mail und Bewerbungsvorgang funktionieren (src/lib/server/freigabe.db.test.ts:110-148). Vermittlung, Pausieren und Zuordnung sind dagegen nicht durchgängig wirksam (FA-07-19, FA-08-16).
- Keine Platzhalter: Vertrag und Partner-AGB sind Platzhalter (FA-07-18), Landingpages fehlen (FA-08-03 bis FA-08-08).
- Pflege ohne Entwickler: Leistungen, Auftragsarten und Seitentexte sind im Code (Querbefund 2).

## Offene Fragen

1. Soll das Netzwerk tatsächlich nur Autoschlüssel und Fahrzeugschlüssel umfassen? Dann müssten die Schlüsseldienst-Auftragsarten, die Rubrik Schlüsseldienst vor Ort und die Partnerverweise gestrichen werden. Die KARTE nennt den Titel „Schlüsseldienst Partner werden“, daher unklar.
2. Soll der Weg vom Autoschlüssel-Termin außerhalb der Region zu einem Partner im Terminfluss vorgesehen sein (Abschnitt 05)? Heute verweist die Seite nur auf die Werkstatt (src/lib/terminort.ts:109-111).
3. Die Partnerseite verspricht, dass der Kunde den ausführenden Betrieb vorher erfährt. Wie soll das umgesetzt werden, und wann gilt der Betrieb als Vertragspartner?
4. Ist der Besuch vor Ort Pflicht vor der Freischaltung oder nur dokumentierbar?
5. Darf der Admin einen pausierten oder beendeten Betrieb weiter zuordnen? Die Regel nach Abschnitt 07 sagt nein; soll das hart erzwungen werden?
6. Die Bewerbung wird heute von Hand in den Partnerdatensatz übertragen. Soll die Übernahme automatisiert werden?
7. Soll der Qualitätsstandard eine eigene Vertragsklausel oder ein Anhang sein? Die Entscheidung liegt beim Anwalt.
