# FA-KUNDSCHAFTER-07: Gehäuse, Reparatur, Customizing und Sperrschließungen

Stand: 15.11.2026. Lesender Abgleich, keine Änderung am Bestand, keine Projektbefehle, keine Tests, kein Build.

Quelle: `/home/user/schluesselmacher24/_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt`, Abschnitte 14 und 15 wörtlich. Maßstab nach Auftrag: Abschnitte 01 und 29.

## Maßstab aus 01 und 29

- 01: Jede Funktion wird vor Livegang real durchgespielt, End to End. Der Betreiber muss ohne Entwickler pflegen können. Platzhalter, Demo-Daten und halbfertige Funktionen dürfen Anforderungen nicht stillschweigend ersetzen.
- 29: Kein ungeprüftes KI-Ergebnis live stellen. Die Abnahme prüft, ob Punkte nur oberflächlich übernommen wurden.
- Gegen diesen Maßstab fällt auf: Der Bereich Gehäuse ist eine Anfrage mit Fotos, kein Shop. Customizing fehlt vollständig. Die Sperrschließung ist als Konfigurator real und rechnet aus dem Katalog, hat aber noch keine Hersteller, keine Logos und zwei unmarkierte Preisdatensätze, deren Herkunft nicht belegt ist.

## Übersicht

24 Anforderungen (Abschnitt 14: 12, Abschnitt 15: 12, jeweils inklusive Bereichsziel).

| Urteil | Anzahl | IDs |
|---|---|---|
| erfuellt | 6 | FA-15-04, FA-15-05, FA-15-06, FA-15-07, FA-15-09, FA-15-10 |
| teilweise | 9 | FA-14-00, FA-14-01, FA-14-03, FA-14-04, FA-14-11, FA-15-00, FA-15-03, FA-15-08, FA-15-11 |
| fehlt | 9 | FA-14-02, FA-14-05, FA-14-06, FA-14-07, FA-14-08, FA-14-09, FA-14-10, FA-15-01, FA-15-02 |
| widerspricht | 0 | keine |

## Tabelle aller Anforderungen

| ID | Anforderung (Kurzfassung) | Urteil | Aufwand | Was nur ein Mensch liefern kann |
|---|---|---|---|---|
| FA-14-00 | Bereich deutlich größer, Shopprodukte und Dienstleistungen | teilweise | L | Produktdaten, Preise, Fotos für Gehäuse-Artikel |
| FA-14-01 | Ersatzgehäuse nach Hersteller, Modell, Tastenanzahl, Schlüsseltyp | teilweise | M | Fahrzeugdaten je Modell (Tastenzahl, Schlüsseltyp, Gehäusestand) |
| FA-14-02 | Klappschlüssel-, Smart-Key-, Karten-Gehäuse und weitere Bauformen | fehlt | M | Bauformenliste mit Gehäusebestand, Produktfotos |
| FA-14-03 | Tasten, Gummimatten, Batterie, Klappmechanismus, Bart, Ersatzteile | teilweise | M | Teilebezug, Verfügbarkeit, Preise |
| FA-14-04 | Einsendeservice mit Übernahme von Elektronik und Transponder | teilweise | M | Werkstattentscheidung, was technisch übernommen werden kann; Versandhinweis |
| FA-14-05 | Eigene Rubrik Customizing, Modifikation, optische Erneuerung | fehlt | M | Konzept und Texte der Rubrik (Prüfung durch Inhaber, R10) |
| FA-14-06 | Ältere Schlüssel in modernere Gehäuseoptik umbauen, wenn kompatibel | fehlt | L | Technische Prüfung je Schlüsseltyp |
| FA-14-07 | Beispielidee: alter Fahrzeugschlüssel mit neuer Gehäuseform | fehlt | S | Beispielfall mit echtem Schlüssel und Fotos |
| FA-14-08 | Vorher-Nachher-Bilder | fehlt | M | Vorher-Nachher-Fotos echter Umbauten |
| FA-14-09 | Klare Kompatibilitätshinweise | fehlt | M | Kompatibilitätsdaten je Schlüsseltyp |
| FA-14-10 | Auswahl nach Fahrzeug beziehungsweise Schlüsseltyp | fehlt | M | Fahrzeugliste mit Gehäusestand |
| FA-14-11 | Keine falschen Versprechen, Umbau nur bei technischer Passung | teilweise | S | Freigabe der Formulierungen durch den Inhaber |
| FA-15-00 | Sperrschließung als echter Konfigurator und Shop | teilweise | M | Freigabe des Ablaufs im Live-Test mit echten Daten |
| FA-15-01 | BKS und ABUS sichtbar | fehlt | S | Hersteller-Einträge, Markenfreigabe, Komponenten und Preise je Hersteller |
| FA-15-02 | Herstellerlogos nach Markenvorgaben | fehlt | S | Logodateien, Markenvorgaben, Nutzungsrechte (R12) |
| FA-15-03 | Doppel-, Knauf-, Halbzylinder und weitere passende Varianten | teilweise | M | Liste weiterer Bauformen mit Maßen und Preisen |
| FA-15-04 | Maß A und Maß B abfragen | erfuellt | - | - |
| FA-15-05 | Anzahl je Position abfragen | erfuellt | - | - |
| FA-15-06 | Not- und Gefahrenfunktion abfragen | erfuellt | - | - |
| FA-15-07 | Schlüsselanzahl abfragen | erfuellt | - | - |
| FA-15-08 | Sicherungskarte abfragen | teilweise | S | Produktentscheidung, ob die Karte Pflicht oder Option ist |
| FA-15-09 | Erweiterbarkeit abfragen | erfuellt | - | - |
| FA-15-10 | Mehrere unterschiedliche Maße in einer Bestellung | erfuellt | - | - |
| FA-15-11 | Preis aus hinterlegten Produkten und Optionen, keine Demo-Preise | teilweise | S | Bestätigung der Katalogpreise durch den Inhaber (G9); Entfernen der Beispielartikel |

## Einzelheiten

Die Fundstellen sind pfad:zeile, relativ zu `/home/user/schluesselmacher24`.

### Gehäuse (Abschnitt 14)

**FA-14-00, Bereich groß, Shop und Dienstleistung: teilweise.**
- Dienstleistung vorhanden: Der Service `gehaeuse-reparatur` „Gehäuse, Tasten und Batterie“ mit den Schlüsselarten Funk, Klappschlüssel und Smart Key, buchbar ohne Fahrzeug vor Ort: `content/car-key-services.json:60-70`, Preisgruppen `content/service-pricing.json:39-45`, `:95-101`, `:154-161`, `:213-218`.
- Ein Gehäuse als Shopprodukt existiert nicht. Der Artikel-Typ kennt nur `code_key` und `standard`: `src/payload/collections/Produkte.ts` (Feld `typ`, Optionen). Die Standardartikel haben kein Gehäuse: `src/lib/data/defaults/standard-articles.ts:26-124`.
- Der Bereich ist die Anfrageseite `src/app/(site)/autoschluessel/gehaeuse/page.tsx` mit Formular `src/app/(site)/autoschluessel/gehaeuse/anfrage/anfrage-formular.tsx`.
- Lücke: Gehäuse als Artikel (neuer Typ oder eigene Sammlung, additive Migration nach G6), Bereich mit Shopkatalog und Dienstleistung getrennt führen.

**FA-14-01, Ersatzgehäuse nach Hersteller, Modell, Tastenanzahl, Schlüsseltyp: teilweise.**
- Vorhanden: Marke und Modell als Freitext, Baujahr, Tastenzahl in drei Stufen (`1-2`, `3-4`, `unklar`): `src/app/(site)/autoschluessel/gehaeuse/anfrage/kern.ts:13-25` (Datenform), `:46-50` (Antwortoptionen), `:70-88` (Prüfung je Schritt); Formular `anfrage-formular.tsx:35-41` (Schritte) und `:221` (Tastenfrage).
- Fehlt: Schlüsseltyp (Klappschlüssel, Smart Key, Karte) ist nirgends abgefragt. Eine Auswahl aus Fahrzeugkatalog oder Marken fehlt. Der Fahrzeugkatalog kennt das Feld `gehaeuse` (`src/payload/collections/Fahrzeugreihen.ts:79`), wird aber im öffentlichen Bereich nicht gelesen. Alle 624 Zeilen in `content/fahrzeugkatalog.json` stehen auf `unbekannt`, keine auf `verfuegbar`.
- Lücke: Schlüsseltyp-Auswahl im Formular (`kern.ts` und `anfrage-formular.tsx`), Gehäusestand je Reihe pflegen und im Formular als Hinweis nutzen.

**FA-14-02, Klappschlüssel-, Smart-Key-, Karten-Gehäuse und weitere Bauformen: fehlt.**
- Die Bauformen tauchen nur als Erklärung auf: `src/components/autoschluessel/key-kinds.tsx:31-35`. Eine Karten-Bauform gibt es nicht. Der Gehäuse-Service deckt Klappschlüssel und Smart Key in der Buchung ab, die Anfrage nicht.
- Lücke: Bauformen als Kategorien mit Bildern und Kompatibilität, Erweiterung von `RUBRIK_ICONS` nicht nötig.

**FA-14-03, Tasten, Gummimatten, Batterie, Klappmechanismus, Bart, weitere Ersatzteile: teilweise.**
- Vorhanden: „Gehäuse, Tasten und Batterie“ als Dienstleistung (siehe FA-14-00), Bart fräsen als Seite `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx`.
- Fehlt: Gummimatten und Klappmechanismus, kein Ersatzteil als Artikel. Die Ersatzteil-Stichworte im Bestand betreffen Briefkasten- und Möbelschlösser: `src/lib/data/defaults/standard-articles.ts:100`, `:126`.
- Lücke: Ersatzteile als Artikel mit Lieferumfang und Kompatibilitätsfeld, Dienstleistung getrennt vom Teil.

**FA-14-04, Einsendeservice mit Elektronik und Transponder: teilweise.**
- Vorhanden: Die Gehäuse-Rubrik beschreibt den Ablauf „Schlüssel einschicken“ und „Rückversand“: `src/lib/data/defaults/rubriken.ts:111-123`, `content/rubriken.json` (Rubrik `autoschluessel-gehaeuse`). Der Hinweis „Elektronik bleibt erhalten“ steht in der Rubrik und auf der Funkschlüssel-Seite `src/app/(site)/autoschluessel/funkschluessel/page.tsx:152-154`.
- Fehlt: Der Einsende-Weg schließt Autoschlüssel und Transponder ausdrücklich aus: `src/app/(site)/schluessel-einschicken/anmelden/einsende-formular.tsx:304`. Die Einsendelogik ist für „Schlüssel nach Vorlage“ gebaut (`src/lib/einsenden/vorgang.ts`) und enthält keine Elektronik- oder Transponderfrage (per Suche geprüft, keine Treffer). Das Gehäuse-Formular fragt nicht, ob Elektronik oder Transponder übernommen werden sollen.
- Lücke: Gehäuse-spezifischer Einsendeweg mit Fragen zu Elektronik und Transponder, Begleitschein und Vorgangsnummer nach Freigabe. Versandhinweis nach Anhang B (Einschreiben nicht voll versichert, DHL bis 500 Euro) prüfen.

**FA-14-05, eigene Rubrik Customizing, Modifikation, optische Erneuerung: fehlt.**
- Keine Rubrik und keine Seite. Die Icon-Liste der Rubriken `src/lib/rubriken.ts:21-24` enthält keinen Eintrag für Customizing. Suche nach „customi“, „modifik“, „umbau“, „optische“ in `src/` und `content/` ohne Treffer, außer Allgemeintexte (`src/app/(site)/schliessanlagen/...:1350`, `autoschluessel/marken/[make]/[model]/page.tsx:598`).
- Lücke: Rubrik in `content/rubriken.json` und `src/lib/data/defaults/rubriken.ts` mit Ablauf, Seite unter `src/app/(site)/autoschluessel/customizing/`, Navigation und Sitemap (`src/app/sitemap.ts`).

**FA-14-06, ältere Schlüssel in modernere Optik umbauen, wenn kompatibel: fehlt.**
- Kein Datenmodell für Umbaukombinationen, kein Hinweis auf Umbaubarkeit. Die Funkschlüssel-Seite sagt nur allgemein, dass die Platine übernommen wird (`funkschluessel/page.tsx:86-89`).
- Lücke: Kompatibilitätsmatrix als Payload-Sammlung mit Pflichtfeldern Elektronik, Transponder, Tasten, Bart (additiv, G6), Anzeige nur für freigegebene Kombinationen.

**FA-14-07, Beispielidee alter Fahrzeugschlüssel mit neuer Gehäuseform: fehlt.**
- Nicht vorhanden. Es gibt keine Beispielseite oder Beispielkarte.
- Lücke: Beispielkarte in der Customizing-Rubrik, nur mit echtem Fall (R4: nichts erfinden).

**FA-14-08, Vorher-Nachher-Bilder: fehlt.**
- Keine Vorher-Nachher-Komponente. Suche nach „Vorher“ in Komponenten und Seiten findet nur Flow-Logik (`src/components/flow/flow-shell.tsx:103-108`) und Tests (`src/components/layout/summary-list.test.tsx:92`). Die Bildinfrastruktur (`ImageSlot`, `ImagePlaceholder`) existiert, aber ohne Paar-Darstellung.
- Lücke: Komponente für Bildpaare auf Basis der Bildslots, Fotoquelle als Medien-Sammlung.

**FA-14-09, klare Kompatibilitätshinweise: fehlt.**
- Der Gehäuse-Text sagt nur „Ob das bei Ihrem Schlüssel geht, sehen wir an Ihren Fotos“ (`src/app/(site)/autoschluessel/gehaeuse/page.tsx:77-78`). Eine Hinweisbox je Umbau fehlt.
- Lücke: Kompatibilitätsbox mit Feldern aus FA-14-06, sichtbar auf der Customizing-Seite und in der Anfrage.

**FA-14-10, Auswahl nach Fahrzeug beziehungsweise Schlüsseltyp: fehlt.**
- Die Gehäuse-Anfrage ist eine freie Eingabe (`kern.ts:41-42`, `MAX_MARKE`, `MAX_MODELL`). Keine Auswahl im Umbau-Kontext. Die Marken- und Modellseiten (`src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx`) verlinken kein Gehäuse (per Suche ohne Treffer).
- Lücke: Auswahl aus Fahrzeugreihen mit Schlüsseltyp, Filter nach Kompatibilität, Verlinkung von Modellseiten.

**FA-14-11, keine falschen Versprechen: teilweise.**
- Teilweise korrekt: `src/app/(site)/autoschluessel/funkschluessel/page.tsx:182-189` („In vielen Fällen ja“, „Muss der …“) und `gehaeuse/page.tsx:77-78` („Ob das bei Ihrem Schlüssel geht …“).
- Unbedingt formuliert: Rubrik-Erklärung „Ihre Elektronik bleibt“ (`src/lib/data/defaults/rubriken.ts:99`, `content/rubriken.json:93`), Dienstleistungstext (`content/car-key-services.json:63`, `src/lib/data/defaults/pricing.ts:84`), Ablaufschritt „Ihr Schlüssel kommt im neuen Gehäuse zurück“ (`rubriken.ts:118-120`).
- Lücke: Formulierungen auf Bedingung umstellen (technische Passung je Schlüssel) und Vorab-Prüfung in der Anfrage zeigen.

**Befund zur Anfragelogik Gehäuse (ohne eigene Anforderung, aber relevant für den Ablauf):**
- Die Rubrik nennt als Abschluss „Angebot mit Zahlungslink“ (`content/rubriken.json:118`, `src/lib/data/defaults/rubriken.ts:124`). Das Formular endet als Anfrage ohne Zahlungslink und mit dem Satz „Noch kein Vertrag“ (`anfrage-formular.tsx`, Schritt `absenden`).
- Serverseitig prüft `src/lib/actions/records.ts:236-241` nur Pflicht-Uploads (Fahrzeugschein, Schlüsselfoto) über `rubrikUnterlagenPruefen`. Marke, Modell, Baujahr und Tastenzahl werden serverseitig nicht geprüft; die Prüfung liegt in `kern.ts:70-87` (Browser). Das ist für R13 ausreichend, für Daten nicht.
- Die Team-Benachrichtigung liest das Baujahr aus dem Label „Baujahr / Erstzulassung“ oder aus `payload.year` (`src/lib/mail/vorlagen/team-hinweis.ts:35`). Die Gehäuse-Anfrage liefert das Label „Baujahr“ (`kern.ts:104`) und `payload.baujahr` (`kern.ts:139-148`). Ergebnis nach Quelltext: Das Baujahr fehlt in der Team-Mail. Nicht ausgeführt, aus dem Quelltext abgeleitet.

### Sperrschließung (Abschnitt 15)

**FA-15-00, echter Konfigurator und Shop: teilweise.**
- Vorhanden: Konfigurator in fünf bis sechs Schritten (`src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx:51-90`), Übergabe in den Warenkorb (`konfigurator.tsx:266`, `:450`), serverseitige Neuberechnung des Preises (`src/lib/actions/orders.ts:259`).
- Lücke: Hersteller fehlt im Konfigurator (siehe FA-15-01). Zwei Preispfade: `konfigurator.tsx:352` rechnet direkt über `priceCylinderOrder`. `src/lib/konfigurator/preis.ts:73-74` liefert für Schließpläne mit aktiven Herstellern „Angebot“. Sobald Hersteller gepflegt sind, rechnen beide Pfade unterschiedlich (Befund, siehe unten).
- Ende-zu-Ende nicht geprüft (Vorgabe: keine Tests, kein Build).

**FA-15-01, BKS und ABUS sichtbar: fehlt.**
- Im Sperr-Konfigurator und auf der Sperrseite keine Nennung von BKS oder ABUS. Treffer nur im Schließanlagen-Konfigurator (`src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:307-308`, `:782`), in Tests und in Typen (`src/lib/types.ts:497-498`).
- Hersteller-Liste ist leer: `content/cylinder-catalog.json:19` (`"manufacturers": []`), `src/lib/data/defaults/cylinders.ts:30-31` mit Kommentar „ohne erfundene Preise“, Startwert-Snapshot identisch bis auf dieses Feld.
- Die Datenstruktur ist vorhanden: Hersteller-Tab in `src/payload/globals/Zylinderkatalog.ts:127-183` (Name, Kennung, Angeboten-Schalter, Aufpreis, Bauformen, Zusatzkomponenten). Der Konfigurator zeigt den Herstellerschritt erst, wenn ein Hersteller angeboten wird (`konfigurator.tsx:291`, `:700`).
- Lücke: Keine Codeänderung nötig, sofern Betreiber Einträge anlegt. Für die Abnahme den Herstellerschritt im Live-Test prüfen, bevor Preise entstehen.

**FA-15-02, Herstellerlogos nach Markenvorgaben: fehlt.**
- Kein Logofeld im Hersteller-Schema (`src/payload/globals/Zylinderkatalog.ts:127-183`, `src/lib/types.ts:497-520`). Kein `public/`-Verzeichnis im Repository, keine Logodatei gefunden. Das Projekt-Logo ist laut `_werkstatt/ausbau/ANFORDERUNGEN.md:31` (G-12) noch offen.
- Lücke: Bildfeld am Hersteller, Anzeige im Herstellerschritt, Einhaltung der Markenvorgaben (R12, Herstellermarken nur sachlich).

**FA-15-03, Doppel-, Knauf-, Halbzylinder und weitere Varianten: teilweise.**
- Vorhanden: `content/cylinder-catalog.json:21-105` mit Doppel-, Knauf- und Halbzylinder (Maße, Grundpreis, Längenaufschlag, Beschreibungen). Landing-Seite `src/app/(site)/gleichschliessende-zylinder/page.tsx:286-352` zeigt sie.
- Fehlt: Die Bauformen sind in der Datenbank fest als Auswahl hinterlegt: `src/payload/globals/Zylinderkatalog.ts:7-11` (`BAUFORMEN`, drei Werte). Weitere Bauformen brauchen eine Codeänderung und Migration (G6), nicht nur Pflege im Backend.
- Lücke: Die feste Auswahl `BAUFORMEN` um neue Werte erweitern (Migration nach G6), danach Pflege im Backend.

**FA-15-04, Maß A und Maß B abfragen: erfuellt.**
- Maße je Position, Mindestmaß 27 mm, Fünf-Millimeter-Schritte aus dem Katalog: `konfigurator.tsx:1141` (Abschnitt „Maße dieser Tür“), Gesamtlänge und Aufpreis in `src/lib/pricing.ts:196-198`. Halbzylinder fragt nur Maß A (`content/cylinder-catalog.json:83`).

**FA-15-05, Anzahl abfragen: erfuellt.**
- Stückzahl je Position mit Obergrenze: `konfigurator.tsx:1260` („Stückzahl dieser Position“), Gesamtzahl über `maxZylinder` (`content/cylinder-catalog.json:5`).

**FA-15-06, Not- und Gefahrenfunktion abfragen: erfuellt.**
- Funktionsauswahl je Position: `konfigurator.tsx:1226-1240`. Die Funktion „Not- und Gefahrenfunktion“ mit Aufpreis 12,00 Euro ist nur für Doppelzylinder freigegeben: `content/cylinder-catalog.json:126-130`, Hinweis „nicht für …“ im Formular.

**FA-15-07, Schlüsselanzahl abfragen: erfuellt.**
- Schritt „Gemeinsame Schlüssel“ mit Eingabe und Obergrenze 50: `konfigurator.tsx:804-852`, Katalog `content/cylinder-catalog.json:2-5` (inklusive 3, Höchstwert 50, Schlüsselpreis 14,90 Euro).

**FA-15-08, Sicherungskarte abfragen: teilweise.**
- Vorhanden als Option „Sicherungskarte und geschütztes System“, 29,00 Euro einmalig: `content/cylinder-catalog.json:146-150`, wählbar im Schritt „Schutz und Optionen“ (`konfigurator.tsx:861-893`). Nachbestell-Abschnitt auf der Landing-Seite: `src/app/(site)/gleichschliessende-zylinder/page.tsx:664-665`, `src/components/schliessung/nachbestellen.tsx`.
- Fehlt: keine eigene Abfrage, ob bereits eine Sicherungskarte vorhanden ist, und keine Erklärung, dass ohne Karte später keine Nachbestellung möglich ist (der Text steht nur in der Optionsbeschreibung).

**FA-15-09, Erweiterbarkeit abfragen: erfuellt.**
- Schritt „Spätere Erweiterung“ mit Ja oder Nein: `konfigurator.tsx:944-990`, Schalter `expandable` `:432-434`, Option „Erweiterbar reservieren“ 15,00 Euro einmalig (`content/cylinder-catalog.json:170-175`). Ohne aktive Option liefert `preis.ts:79` „Angebot“ (Befund unten).

**FA-15-10, mehrere unterschiedliche Maße in einer Bestellung: erfuellt.**
- Liste aus Positionen, jede mit Bauform, Maßen, Funktion und Stückzahl: `konfigurator.tsx:735-800`; Entwurf fasst gleiche Türen zusammen, unterschiedliche Maße bleiben getrennt: `src/lib/konfigurator/preis.ts:34-45` (`planZuEntwurf`). Tests: `src/lib/konfigurator/konfigurator.test.ts`.

**FA-15-11, Preis aus hinterlegten Produkten und Optionen, keine Demo-Preise: teilweise.**
- Berechnung aus dem Katalog: `src/lib/pricing.ts:181-232`, Preisfunktion `src/lib/konfigurator/preis.ts:60-84`. Keine Preise im Code fest eingetragen.
- Preisdatensätze ohne Kennzeichnung als Platzhalter, Herkunft nicht belegt (siehe Preisliste unten).
- Befund: `preis.ts:73` gibt für aktive Hersteller ein Angebot aus, `konfigurator.tsx:352` rechnet trotzdem. Entscheidung nötig.

## Preisliste: Demo-, Platzhalter- und ungeklärte Preise

Die Liste nennt die gefundenen Stellen mit Preisen in Sperrschließung, Gehäuse-Dienstleistung und Shop-Beispielen. Kennzeichnung im Quelltext wird angegeben.

**A. Ausdrücklich als Platzhalter oder Beispiel gekennzeichnet**

| Artikel | Preis | Fundstelle | Kennzeichnung |
|---|---|---|---|
| Schlüsselkasten für 20 Schlüssel | 40,00 Euro | `src/lib/data/defaults/standard-articles.ts:26-32` | Kommentar Zeile 6 „runde Platzhalterpreise“, Titel mit „(Beispiel)“ in `content/startwerte/2026-10-25/standard-articles.json:38` |
| Schlüsselsafe mit Zahlencode | 30,00 Euro | `standard-articles.ts:39-45` | wie oben, `standard-articles.json:85` |
| Schlüsselkappen (10 Stück) | 5,00 Euro | `standard-articles.ts:52-58` | wie oben, `standard-articles.json:98` |
| Schlüsselanhänger (5 Stück) | 5,00 Euro | `standard-articles.ts:65-71` | wie oben |
| Pflegespray für Schließzylinder | 10,00 Euro | `standard-articles.ts:78-84` | wie oben |
| Briefkastenschloss mit Nocke | 15,00 Euro | `standard-articles.ts:91-97` | wie oben |
| Fenstergriff, abschließbar | 25,00 Euro | `standard-articles.ts:104-110` | wie oben |
| Möbelschloss für Schubladen und Türen | 15,00 Euro | `standard-articles.ts:117-123` | wie oben |

Die Artikel sind laut Feldbeschreibung (`src/payload/collections/Produkte.ts`, Feld `beispiel`) sichtbar, aber nicht bestellbar. Die Beispielflagge muss im Backend gesetzt sein. Ob sie live gesetzt ist, ist nicht prüfbar (Datenbank nicht gelesen).

**B. Gleichschließende Zylinder: unmarkierte Preise, Herkunft nicht belegt**

| Position | Preis | Fundstelle |
|---|---|---|
| Grundpreis Doppelzylinder | 39,00 Euro | `content/cylinder-catalog.json:45`, `src/lib/data/defaults/cylinders.ts:58` |
| Grundpreis Knaufzylinder | 49,00 Euro | `content/cylinder-catalog.json:74`, `cylinders.ts:88` |
| Grundpreis Halbzylinder | 29,00 Euro | `content/cylinder-catalog.json:102`, `cylinders.ts:118` |
| Längenaufschlag je 5 mm über Basismaß (je Bauform) | 3,50 Euro | `content/cylinder-catalog.json:46`, `:75`, `:103` |
| Not- und Gefahrenfunktion | 12,00 Euro | `content/cylinder-catalog.json:129` |
| Sicherungskarte und geschütztes System | 29,00 Euro | `content/cylinder-catalog.json:149` |
| Aufbohr- und Ziehschutz je Zylinder | 19,00 Euro | `content/cylinder-catalog.json:161` |
| Erweiterbar reservieren | 15,00 Euro | `content/cylinder-catalog.json:173` |
| Beschriftete Schlüsselanhänger je Stück | 1,90 Euro | `content/cylinder-catalog.json:185` |
| Zusätzlicher Schlüssel | 14,90 Euro | `content/cylinder-catalog.json:3` |

Die Datei `src/lib/data/defaults/cylinders.ts` enthält dieselben Werte, mit dem Hinweis „Alle Preise und Optionen sind im Backend pflegbar“ (Zeile 4). Ein Platzhalterhinweis fehlt. Nach Auftrag G9 darf der Bestand Preise nicht ohne Inhaber ändern. Ob diese Werte vom Inhaber stammen, ist nicht belegt. OFFENE FRAGE.

**C. Dienstleistung Gehäuse, Tasten und Batterie: unmarkierte Preise, Herkunft nicht belegt**

| Preisgruppe | Preis | Fundstelle |
|---|---|---|
| Gruppe A, fest | 59,00 Euro | `content/service-pricing.json:44`, `src/lib/data/defaults/pricing.ts:129` |
| Gruppe B, fest | 79,00 Euro | `content/service-pricing.json:100`, `pricing.ts:136` |
| Gruppe C, Rahmen | 99,00 bis 169,00 Euro | `content/service-pricing.json:159-160`, `pricing.ts:143` |
| Gruppe D | Prüfung, kein Preis | `content/service-pricing.json:213-217`, `pricing.ts:158` |

Nicht geprüft: die Preisgruppen-Datei `content/pricing-groups.json` und der Startwert-Snapshot dieser Werte. OFFENE FRAGE zur Herkunft der Preise.

**D. Gefunden, nicht Preis, aber Platzhalter**

- Firmenangaben in `src/lib/data/defaults/settings.ts:17-33` als `[Platzhalter: ...]`, mit `isPlaceholder: true`. Betrifft Impressum und Fußzeile, nicht die Preise. Nur der Vollständigkeit halber genannt.

## Offene Fragen

1. Gehäuse-Shop: Soll der Bereich Gehäuse als Artikel im Shop (Produkte) oder als Angebot mit Zahlungslink geführt werden? Der Rubrik-Abschluss sagt Angebot, das Formular endet als Anfrage. Entscheidung durch den Inhaber nötig.
2. Herstellerpreise: Soll das Angebot bei aktiven Herstellern (`preis.ts:73`) oder die direkte Berechnung (`konfigurator.tsx:352`) gelten? Die beiden Pfade widersprechen sich, sobald BKS oder ABUS angelegt sind.
3. Herkunft der Zylinder- und Gehäusepreise (Abschnitt B und C oben): Stammen sie vom Inhaber? Sind sie zu kennzeichnen oder zu prüfen (G9)?
4. Sind die Beispielartikel (Abschnitt A) in der Datenbank als Beispiel gesetzt und nicht bestellbar? Nicht prüfbar ohne Datenbankzugriff.
5. Welche weiteren Bauformen sind gewünscht (FA-15-03)? Sie erfordern eine Codeänderung an der Auswahl.
6. Soll die Sicherungskarte Pflicht oder Option sein (FA-15-08)?
7. Gehäusestand je Fahrzeugreihe: Wer pflegt die 624 Zeilen auf `verfuegbar` oder `nicht-verfuegbar`?
8. Logos und Markenvorgaben von BKS und ABUS (FA-15-02): Liegen sie vor? Welche Nutzungsrechte gelten?

## Beobachtungen außerhalb der Anforderungen

- Die Team-Benachrichtigung verliert das Baujahr der Gehäuse-Anfrage (siehe Abschnitt Gehäuse, Befund). Aus dem Quelltext abgeleitet.
- `src/lib/data/defaults/rubriken.ts` und `content/rubriken.json` enthalten dieselben Texte für das Gehäuse. Änderungen müssen an beiden Stellen erfolgen, sonst weichen Lesefallback und Seed auseinander.
- Das Gehäuse-Formular validiert nur im Browser. Marke, Modell, Baujahr und Tasten sind serverseitig ungeprüft (`records.ts`), nur Uploads werden geprüft.
- Der Konfigurator aus `gleichschliessende-zylinder` und der Schließplan-Planer haben zwei getrennte Preislogiken (siehe FA-15-00 und FA-15-11).

## Nicht geprüft

- Keine Datenbank, keine Laufzeit, keine Tests und keine Ausführung der Seiten (Auftrag: keine Projektbefehle).
- Die Preisdatensätze im Backend (Payload) können vom Repository abweichen. Bewertet wurden die Quelldateien und Defaults.
- Schlüsselkarten-Bauform und Tasten-Varianten sind nur am Quelltext bewertet, nicht am Live-Formular.
