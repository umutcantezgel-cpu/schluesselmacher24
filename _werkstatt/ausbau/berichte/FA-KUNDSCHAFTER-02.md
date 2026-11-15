# FA-KUNDSCHAFTER-02 · Abgleich Abschnitt 06 der Finalen Arbeitsanweisung mit dem Bestand

Stand der Prüfung: 2026-11-15. Rolle: Kundschafter, Stufe 1, nur lesen.
Quelle: `_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt`, Abschnitt 06 vollständig (Zeilen 164 bis 191). Maßstab: Abschnitt 01 (Zeilen 38 bis 56) und Abschnitt 29 (Zeilen 681 bis 700), dazu Abschnitt 28 zur Einordnung der Priorität „Kern“.

Methode: Jede Anforderung aus Abschnitt 06 wurde in eine prüfbare Zeile zerlegt. Der Bestand wurde in Quelltext, Datenbestand (`content/*.json`), Payload-Sammlungen, Server-Aktionen, Tests und Hinweisen der Steuerdateien gesucht. Es wurden keine Projektbefehle ausgeführt (kein Build, keine Tests, kein Server), keine Netzabrufe und keine `.env`-Dateien gelesen. Zählwerte stammen aus einer lesenden JSON-Auswertung der Dateien.

## 1. Zählwerte zur Fahrzeugdatenbank (Bestand, Stand heute)

| Merkmal | Wert | Fundstelle |
|---|---|---|
| Katalogzeilen (Modellreihen) | 624 | `content/fahrzeugkatalog.json` |
| Marken im Katalog | 63 | `content/fahrzeugkatalog.json` (Feld `marke`) |
| Marken mit gepflegtem Modell (Preise, Schlüsselarten) | 12 Marken, 49 Modelle | `content/vehicles.json` |
| Modellgenerationen | 0 (kein Feld vorhanden) | `content/fahrzeugkatalog.json`, `content/vehicles.json`, `src/payload/collections/Fahrzeugreihen.ts` |
| Baujahr von | 49 Zeilen, Spanne 1994 bis 2017 | `content/fahrzeugkatalog.json` (nur Zeilen mit `bestandsModell`), `content/vehicles.json` |
| Baujahr bis | 0 Zeilen gefüllt | beide Dateien |
| Fahrzeugklasse Auto (Pkw-Segmente der KBA) | 624 | alle Zeilen, Feld `segment` |
| Fahrzeugklasse Motorrad, Roller, Moped, E-Scooter, Seniorenmobil | 0 | keine Treffer im Bestand |
| Quelle der Katalogzeilen | KBA FZ 12, Stand 1.1.2026, Datenlizenz Deutschland, Namensnennung 2.0 | jede Zeile in `content/fahrzeugkatalog.json` (Feld `quelle`) |
| Quelle der 12 Marken und 49 Modelle | keine Angabe, Herkunft unbekannt | `content/vehicles.json` (kein Quellenfeld) |
| Klonbarkeit bestätigt | 0 von 624 | Feld `klonbar` |

Importweg: `scripts/fahrzeuge-import.mjs` liest die abgeleitete Tabelle `_werkstatt/ausbau/daten/kba/fz12_2026_modellreihen_abgeleitet.csv` und schreibt `content/fahrzeugkatalog.json` (Fundstellen: `scripts/fahrzeuge-import.mjs:3-7`, `:20-22`). Das Verzeichnis `_werkstatt/ausbau/daten/kba/` ist im Arbeitsbaum nicht vorhanden, der Import ist hier nicht nachvollziehbar. Die Rohdatei ist laut `_werkstatt/ausbau/QUELLEN.md` nicht committet.

Pflichtuploads im Autoschlüssel-Termin (Weg `termin`): Der Browser prüft Fahrzeugschein, Bestätigung der Berechtigung und die Pflichtfotos. Der Server prüft nur den Fahrzeugschein. Die Schlüsselfotos sind serverseitig ausdrücklich nicht geprüft (`src/lib/server/unterlagen-pflicht.ts:5-9`).

## 2. Tabelle aller Anforderungen aus Abschnitt 06

Legende Urteil: erfuellt, teilweise, fehlt, widerspricht. Aufwand: S bis zwei Stunden, M bis ein Tag, L mehr, „-“ wenn nichts zu tun ist.

| ID | Anforderung (Kurzfassung) | Bestand | Urteil | Aufwand | Mensch |
|---|---|---|---|---|---|
| FA-06-01 | Fahrzeugdatenbank nicht nur für Autos, sondern auch Motorräder, Roller, Kleinstfahrzeuge und weitere relevante Klassen | Nur Pkw im Katalog, Motorrad nur als Freitext | teilweise | L | Produktentscheidung über Klassen und Datenquelle |
| FA-06-02 | Automarken von A bis Z, einschließlich seltener Marken | 63 Marken im Katalog, 12 Marken bookbar, einige Marken fehlen (Rolls-Royce, Abarth, Alpina) | teilweise | M | Freigabe der Markenliste, Prüfung seltener Marken |
| FA-06-03 | Modelle ungefähr ab 1995 beziehungsweise 1998 bis zum aktuellen Modelljahr | 624 Reihen, Baujahr nur bei 49 Zeilen, kein Baujahr bis | teilweise | M | Baujahresbereiche je Reihe aus freigegebener Quelle |
| FA-06-04 | Generationen ungefähr ab 1995 beziehungsweise 1998 bis zum aktuellen Modelljahr | Kein Generationsfeld, keine Generationsdaten | fehlt | L | Generationsdaten und Kuratierung |
| FA-06-05 | Motorradhersteller und Modelle | Keine Motorraddaten, Freitext im Motorradweg | fehlt | L | Datenquelle und Freigabe |
| FA-06-06 | Roller, Mopeds, E-Scooter, Seniorenmobile, weitere Kleinstfahrzeuge, soweit sinnvoll | Keine Treffer im Bestand | fehlt | L | Auswahl der Klassen für Schlüsselarbeiten |
| FA-06-07 | Daten nicht aus dem Kopf, legitime Quelle beschaffen und technisch bewerten | KBA-Import vorhanden, Lizenz laut Erhebung nicht bestätigt, Rohdatei nicht im Arbeitsbaum, Herkunft der 49 Modelle ungeklärt | teilweise | M | Lizenzbestätigung, Ablage der Rohdatei, Herkunft der Bestandsmodelle |
| FA-06-08 | Auch nicht direkt angebotene Fahrzeuge auffindbar, danach Prüfung oder individuelle Anfrage | Suche über 624 Reihen, Anfrage bei Null-Treffern, unbenannte und seltene Reihen fehlen | teilweise | S | Ablauf der Prüfung nach der Anfrage festlegen |
| FA-06-09 | Fahrzeugschein beziehungsweise Zulassungsbescheinigung Teil I grundsätzlich hochladen | Pflicht im Termin-Weg mit Serverprüfung; im Anfrage-Weg (Fallback) freiwillig | teilweise | S | Entscheidung, ob der Schein auch im Anfrage-Weg Pflicht ist |
| FA-06-10 | Drei Fotos des Schlüssels: Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne | Drei Pflichtslots im Browser, Bart-Foto laut Text „von der Seite“, Serverprüfung fehlt | teilweise | S | Wortlaut und Beispielfoto für das Profilfoto |
| FA-06-11 | Die drei Schlüsselfotos sind Pflicht (Ableitung aus „Pflichtuploads“) | Bei Totalverlust (0 funktionierende Schlüssel) freiwillig | widerspricht | S | Entscheidung des Inhabers zur Totalverlust-Ausnahme |
| FA-06-12 | Die drei Schlüsselfotos werden serverseitig geprüft (Ableitung aus „Pflichtuploads“) | Nur Fahrzeugschein serverseitig geprüft | fehlt | M | Entscheidung, Serverpflicht und Dateiablage im Betrieb |
| FA-06-13 | Kurze Beschreibung des Anliegens als Pflichtupload | Im Termin-Weg freiwillig, im Anfrage-Weg Pflicht ab 20 Zeichen | teilweise | S | Entscheidung über Pflicht im Termin-Weg |
| FA-06-14 | Wenn kein normaler Fahrzeugschein vorhanden ist, bei Kleinstfahrzeugen alternative Dokument- oder Datenabfrage anbieten | Keine Alternative, Schein ist ohne Ausweichweg Pflicht | fehlt | M | Festlegung der Ersatzunterlagen (rechtlich und fachlich) |
| FA-06-15 | „Fahrzeug nicht gefunden?“ muss immer vorhanden sein | Kein Wortlaut „Fahrzeug nicht gefunden?“, nur situative Hinweise | teilweise | S | Freigabe der Formulierung, Platzierung |
| FA-06-16 | Kunde kann trotzdem Fahrzeugdaten, Dokument, drei Schlüsselfotos und Beschreibung senden | Freitextfeld für Fahrzeug, ein Upload-Feld mit bis zu fünf Dateien, keine Fotoslots | teilweise | M | Pflichtfelder des Fallback-Formulars |
| FA-06-17 | Zusätzlich Telefonnummer und direkte Hilfe anbieten | Telefonfeld Pflicht, Betriebstelefon sitewide, direkte Hilfe nur im Assistenten | teilweise | S | Rufzeiten und Ansprechpartner für Rückrufe |

## 3. Einzelheiten mit Fundstellen

### FA-06-01 · Fahrzeugdatenbank für alle Fahrzeugarten (teilweise)
- Der Katalog enthält ausschließlich Pkw-Segmente der KBA FZ 12 (`content/fahrzeugkatalog.json`, Feld `segment`: KLEINWAGEN, SUVs, GELÄNDEWAGEN, UTILITIES und weitere, alle Pkw). Die Herkunftsbeschreibung in `scripts/fahrzeuge-import.mjs:3-7` nennt nur Modellreihen des Pkw-Bestands.
- Motorrad ist nur als Freitext erfasst: `src/app/(site)/motorradschluessel/anfrage/kern.ts:3-4` („Es gibt keine Fahrzeugdatenbank und keine Modellliste“), `src/app/(site)/motorradschluessel/anfrage/anfrage-formular.tsx:36` (Hersteller und Typ frei eintragen).
- Zu bauen: Datenmodell um Fahrzeugklasse erweitern (`src/payload/collections/Fahrzeugreihen.ts`, neues Feld `klasse` mit Migration nach G6, nur additiv), Importweg für Motorrad und Kleinstfahrzeuge, Suche mit Klassenfilter (`src/lib/fahrzeuge/suche.ts`, `src/components/autoschluessel/fahrzeug-suche.tsx`).

### FA-06-02 · Automarken A bis Z (teilweise)
- Katalog: 63 Marken (Zählung oben). Das Feld `marke` enthält unter anderem Alfa Romeo, Lotus, Morgan, Lancia, Maserati, Tesla, Lynk & Co, KGM.
- Nicht enthalten: Rolls-Royce, Abarth, Alpina. Die Ursache liegt laut `scripts/fahrzeuge-import.mjs:6-7` darin, dass nur benannte Reihen (ab 1.000 Fahrzeugen laut `_werkstatt/ausbau/QUELLEN.md:9`) aufgenommen werden. Ob das für die genannten Marken zutrifft, ist ungeprüft (OFFENE FRAGE 4).
- Bookbar sind nur 12 Marken (`content/vehicles.json`, Payload-Sammlung `src/payload/collections/Fahrzeugmarken.ts:9`). Die Markenseite nennt das selbst: `src/app/(site)/autoschluessel/marken/page.tsx:158-159` („Die Liste wächst laufend“).
- Zu bauen: Markenliste gegen KBA FZ 17 (laut `_werkstatt/ausbau/erhebung/E1-fahrzeugquellen.md:59` als Kontrolle vorgesehen) abgleichen, fehlende Marken als Katalogzeilen ergänzen, Aufwand M.

### FA-06-03 · Modelle ab 1995 bzw. 1998 bis aktuelles Modelljahr (teilweise)
- Baujahr von: 49 Zeilen des Katalogs haben `baujahrVon` (Spanne 1994 bis 2017), alle 49 kommen aus `content/vehicles.json`, Feld `yearFrom`, ohne Quellenangabe. Die übrigen 575 Zeilen haben keinen Bauzeitraum.
- Baujahr bis: Kein Eintrag in beiden Dateien. Der Assistent setzt das Ende auf das laufende Jahr, sofern kein `yearTo` vorliegt: `src/app/(site)/autoschluessel/anfrage/assistent.tsx:437-445`. Für die 575 Reihen ohne Baujahr greift das nicht, weil die Auswahl dort nicht erscheint.
- Die Auswahl der Jahre im Assistenten ist für die 49 gepflegten Modelle umgesetzt (`assistent.tsx:437-445`), die Katalogsuche selbst kennt kein Baujahr.
- Zu bauen: Bauzeiträume aus einer freigegebenen Quelle (E1 nennt Wikidata-Eigenschaften P571, P580, P2669, P582, `_werkstatt/ausbau/erhebung/E1-fahrzeugquellen.md:90`, nicht eingespielt), Felder `baujahrBis` nutzen (`src/lib/data/payload-mapping.ts:481` und `:565` kennen das Feld bereits), Aufwand M.

### FA-06-04 · Generationen (fehlt)
- Kein Generationsfeld: `src/payload/collections/Fahrzeugreihen.ts:27-88` (Felder marke, reihe, kbaName, bestand, rang, segment, sichtbar, quelle, bestandsModell, baujahr, transponder, klonbar, gehaeuse, leistungen, alias). Im Katalog und in `content/vehicles.json` gibt es ebenfalls keine Generationen.
- Die Suche akzeptiert Generationsangaben nur als Eingabe-Toleranz (`src/lib/fahrzeuge/suche.ts:79`, Regel `GENERATION`), sie werden nicht gespeichert.
- Zu bauen: Eigene Kollektion oder Unterfeld „Generation“ mit Bauzeitraum und Quelle, Aufwand L.

### FA-06-05 · Motorradhersteller und Modelle (fehlt)
- Keine Motorraddaten im Bestand (Suche nach Motorrad-Modellen liefert keine Treffer im Katalog). Der Motorradweg verlangt Hersteller und Typ frei (`src/app/(site)/motorradschluessel/anfrage/anfrage-formular.tsx:36`) und prüft Eingaben nur auf Länge und Vierstelligkeit des Baujahrs (`anfrage-formular.tsx:147`).
- Zu bauen: Datenquelle für Motorradhersteller und Modelle beschaffen und technisch bewerten (G7, Lizenzprüfung), Katalogerweiterung um Klasse Motorrad, Such- und Auswahlschritt im Motorradweg. Aufwand L.

### FA-06-06 · Roller, Mopeds, E-Scooter, Seniorenmobile, Kleinstfahrzeuge (fehlt)
- Suche in `src/` und `content/` nach Roller, Moped, E-Scooter, Seniormobil und Kleinstfahrzeug: keine Treffer.
- Zu bauen: wie FA-06-05, zusätzlich Festlegung, welche Klassen für Schlüsselarbeiten sinnvoll sind. Aufwand L.

### FA-06-07 · Datenquelle beschaffen und bewerten (teilweise)
- Vorhanden: Importskript `scripts/fahrzeuge-import.mjs` (Prüfung der Spalten und Summen ab Zeile 244 und 429 bis 443), Quellenvermerk je Zeile in `content/fahrzeugkatalog.json`, Anzeige des Quellenvermerks in `src/components/autoschluessel/fahrzeug-ziel.ts:12-13` und `src/components/autoschluessel/fahrzeug-suche.tsx` (Parameter `mitQuelle`).
- Lizenz: Die Erhebung bewertet die Lizenz als nicht bestätigt. `_werkstatt/ausbau/erhebung/E1-fahrzeugquellen.md:104` („Bestätigung durch das KBA oder Rechtsprüfung nötig“), `E1-fahrzeugquellen.md:110` (Wortlaut ungeprüft). `_werkstatt/ausbau/QUELLEN.md:10` stützt die Nutzung auf die AGB des KBA, § 1 Abs. 3.
- Lücke bei Umfang: Die Zielzahl laut `_werkstatt/ausbau/QUELLEN.md:13` lautet 649 benannte Reihen, der Katalog hat 624 Zeilen. Die Zusammenführung gleicher Reihen (`scripts/fahrzeuge-import.mjs:305-330`) kann die Differenz erklären; ohne die abgeleitete CSV ist das nicht prüfbar (OFFENE FRAGE 3).
- Herkunft der 49 Bestandsmodelle und ihrer Schlüsselarten (`content/vehicles.json`): keine Quelle vermerkt. Ob sie aus einer Erhebung stammen oder von Hand zusammengestellt wurden, ist aus dem Bestand nicht ersichtlich (OFFENE FRAGE 2).
- Zu bauen: Quellenfeld für `content/vehicles.json` ergänzen, Lizenzbestätigung abwarten, Rohdatei in `daten/` ablegen (nicht committen, G13), Aufwand M.

### FA-06-08 · Auffindbarkeit nicht angebotener Fahrzeuge (teilweise)
- Suche über alle sichtbaren Katalogzeilen: `src/lib/fahrzeuge/suche.ts:82-107` (Funktion `sucheFahrzeuge`, Filter `sichtbar`, Gewichtung nach Bestand), Einbindung nur im Assistenten `src/app/(site)/autoschluessel/anfrage/assistent.tsx` (Import der Suche, Schritt Marke).
- Trefferführung: `src/components/autoschluessel/fahrzeug-ziel.ts:53-61` unterscheidet gepflegtes Modell, gepflegte Marke und Anfrage. Bei Null-Treffern führt `src/components/autoschluessel/fahrzeug-suche.tsx:122-129` in die Anfrage.
- Lücke: Nicht benannte Reihen (SONSTIGE) und Reihen unter der Schwelle fehlen komplett (`scripts/fahrzeuge-import.mjs:6-7`). Die Suche findet also nicht jedes Fahrzeug.
- Zu bauen: Fallback-Wege nach FA-06-15 bis FA-06-17. Ablauf nach der Anfrage (Prüfung, individuelle Antwort) ist im Bestand nicht beschrieben. Aufwand S, Text-Ablauf durch den Inhaber.

### FA-06-09 · Fahrzeugschein grundsätzlich hochladen (teilweise)
- Termin-Weg erfuellt: Pflichtschritt mit `required` und `allowDocuments`, Bestätigung der Berechtigung als Voraussetzung: `src/app/(site)/autoschluessel/anfrage/assistent.tsx:1346-1377`, Prüfung im Browser `src/app/(site)/autoschluessel/anfrage/unterlagen-pruefung.ts:31-33`. Serverseitig: `src/lib/actions/records.ts:184-187` ruft `fahrzeugscheinPruefen` auf, `src/lib/server/unterlagen-pflicht.ts:25-31` verlangt einen Upload der Kategorie Fahrzeugschein und bei eingerichteter Ablage die Kennung. Tests: `src/lib/server/unterlagen-pflicht.test.ts` (Fall „lehnt ohne Fahrzeugschein ab“).
- Anfrage-Weg (Fallback im allgemeinen Formular) nicht erfuellt: `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx:284-291`, Text „Für die Anfrage freiwillig“. Serverseitig wird für diesen Weg nichts verlangt (`records.ts:236-242` greift nur für `motorrad` und `gehaeuse`, `src/lib/wege/nachweis.ts:68-71`).
- Zu bauen: Fallback-Formular um Kategorie Fahrzeugschein mit Pflicht ergänzen, sofern der Inhaber das so will (OFFENE FRAGE 6). Aufwand S.

### FA-06-10 · Drei Schlüsselfotos: Vorderseite, Rückseite, Spitze beziehungsweise Profil von vorne (teilweise)
- Pflichtslots: `src/components/autoschluessel/optionen.ts:151-207`. Vorderseite (`required: true`, Zeile 164), Rückseite (`required: true`, Zeile 178), Bart beziehungsweise Spitze (`id: 'bart'`, Zeile 181, `required: true`, Zeile 192). Der Slot „detail“ (Zeile 195) ist freiwillig.
- Abweichung im Wortlaut: `optionen.ts:184-185` verlangt „Bart von der Seite aufnehmen, sodass das Profil und die Fräsungen erkennbar sind“. Die Anweisung verlangt „Spitze beziehungsweise Profil von vorne“.
- Browser-Prüfung: `src/app/(site)/autoschluessel/anfrage/unterlagen-pruefung.ts:36` (alle Pflichtslots gefüllt). Uploads werden als Kategorie `schluesselfoto` gesendet: `assistent.tsx:` Funktion `buildUploads` (Schleife über `KEY_PHOTO_SLOTS`).
- Serverseitig nicht geprüft: `src/lib/server/unterlagen-pflicht.ts:5-9` („Schlüsselfotos: hier nicht geprüft“).
- Zu bauen: Wortlaut und Beispielbild des Bartfotos an die Anweisung anpassen (`optionen.ts:184-185`, Beispiel `:187-191`), Serverprüfung nach FA-06-12. Aufwand S.

### FA-06-11 · Schlüsselfotos sind Pflicht (widerspricht)
- Ausnahme bei Totalverlust: `src/app/(site)/autoschluessel/anfrage/unterlagen-pruefung.ts:18-19` (`schluesselfotosFreiwillig` gibt bei `workingKeys === 0` wahr zurück), Anwendung in `unterlagen-pruefung.ts:27-36`. Der Test `unterlagen-pruefung.test.ts` (Fall „lässt den Fotoschritt bei Totalverlust auch ohne Fotos zu“) bestätigt das Verhalten.
- Die Anweisung kennt diese Ausnahme nicht. Der Bestand macht die drei Fotos bei Totalverlust freiwillig, obwohl die Anweisung sie als Pflichtupload nennt (`_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt`, Zeile 179).
- Ob die Ausnahme fachlich richtig ist (kein Schlüssel vorhanden, nichts zu fotografieren), entscheidet der Inhaber. Die Ausnahme ist im Projekt ausdrücklich begründet (`unterlagen-pflicht.ts:6-8`), steht aber im Widerspruch zum Wortlaut.
- Zu bauen, falls die Anweisung gilt: `unterlagen-pruefung.ts:18-19` und `:36` auf Pflicht ohne Ausnahme umstellen, Tests anpassen. Aufwand S. Mensch: Entscheidung.

### FA-06-12 · Serverseitige Prüfung der drei Fotos (fehlt)
- Serverseitig geprüft wird nur der Fahrzeugschein (`src/lib/actions/records.ts:184`, `src/lib/server/unterlagen-pflicht.ts:25-31`). Der Kommentar in `unterlagen-pflicht.ts:5-9` hält die Schlüsselfotos ausdrücklich außen vor.
- Die Rubrikdaten (`content/rubriken.json`, Rubrik `autoschluessel`, Zeile 37 bis 40, `pflichtUploads: ['fahrzeugschein', 'schluesselfoto']`) werden für den Autoschlüssel-Weg nicht ausgewertet, weil `QUELLE_RUBRIK` nur `motorrad` und `gehaeuse` kennt (`src/lib/wege/nachweis.ts:68-71`, `src/lib/actions/records.ts:236-242`). Die Kategorie `schluesselfoto` ist zudem nur eine Kategorie und zählt nicht nach Position (Vorderseite, Rückseite, Bart).
- Zu bauen: Serverprüfung der drei Slots (Kategorie plus Position als Feld am Upload, da `UploadRef` bisher keine Position führt), Erweiterung von `src/lib/server/unterlagen-pflicht.ts`, Anpassung von `records.ts` um den Termin-Weg, Tests (`unterlagen-pflicht.test.ts`). Aufwand M. Mensch: Entscheidung, ob ohne Dateiablage (Notbetrieb) geprüft wird.

### FA-06-13 · Kurze Beschreibung als Pflichtupload (teilweise)
- Termin-Weg: Die Beschreibung ist Feld `note` im Schritt Kontakt, Label „Ihre Nachricht an uns (freiwillig)“: `src/app/(site)/autoschluessel/anfrage/assistent.tsx:1582` (Schritt beginnt bei `:1401`). Die Prüfung `assistent.tsx` Schritt `kontakt` verlangt sie nicht.
- Anfrage-Weg: `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx:93` verlangt mindestens 20 Zeichen, Feld in Zeile 234 bis 242.
- Zu bauen: Feld im Termin-Weg auf Pflicht umstellen, falls gewollt (Schritt `kontakt`, Prüfung in `assistent.tsx`). Aufwand S. Mensch: Entscheidung.

### FA-06-14 · Alternative Dokumente oder Datenabfrage bei Kleinstfahrzeugen (fehlt)
- Keine Alternative im Bestand. Der Termin-Weg verlangt den Schein ohne Ausweichweg (`assistent.tsx:1346-1377`, `unterlagen-pruefung.ts:32-33`), die Serverprüfung ebenfalls (`unterlagen-pflicht.ts:25-31`). Der Motorradweg nennt nur PDF als Ersatz für das Foto (`motorradschluessel/anfrage/anfrage-formular.tsx:38`).
- Die Anfrage-Formulierung „Fertigen können wir den Schlüssel nur mit Fahrzeugschein“ (`anfrage-formular.tsx:290`) schließt eine Alternative aktuell aus.
- Zu bauen: Festlegung der Ersatzunterlagen (zum Beispiel Halterangabe, FIN, Typschild oder Foto der Plakette), Kategorie und Pflichtlogik in `unterlagen-pflicht.ts`, Text im Assistenten. Aufwand M. Mensch: fachliche und rechtliche Festlegung (R10).

### FA-06-15 · „Fahrzeug nicht gefunden?“ immer vorhanden (teilweise)
- Den Wortlaut „Fahrzeug nicht gefunden?“ gibt es im Bestand nicht.
- Vorhanden, aber situativ: Bei Null-Treffern ab zwei Zeichen „Kein Treffer für … Fahrzeug trotzdem anfragen“ (`src/components/autoschluessel/fahrzeug-suche.tsx:122-129`). Das Suchfeld gibt es nur im Assistenten (`assistent.tsx`, Schritt Marke).
- Im Schritt Marke: „Mein Fahrzeug ist nicht dabei: Anfrage mit Fahrzeugschein und Schlüsselfoto“ (`assistent.tsx:1026-1031`).
- Auf den Markenseiten: „Marke nicht dabei?“ (`src/app/(site)/autoschluessel/marken/page.tsx:158-159`), „Modell nicht dabei?“ ohne Anfrage-Link (`src/app/(site)/autoschluessel/marken/[make]/page.tsx:337-341`).
- Zu bauen: Festen Block „Fahrzeug nicht gefunden?“ mit Anfrage-Link und Telefonnummer unter dem Suchfeld und auf den Markenseiten. Aufwand S.

### FA-06-16 · Fallback-Inhalt: Fahrzeugdaten, Dokument, drei Schlüsselfotos, Beschreibung (teilweise)
- Fahrzeugdaten: nur ein Freitextfeld „Um welches Objekt oder Fahrzeug geht es?“ (`src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx:249`). Der Parameter `fahrzeug` aus der Suche landet dort als Text (`src/app/(site)/service-und-termin/anfrage/page.tsx:23-30`, `anfrage-formular.tsx:89`). Strukturierte Felder für Marke, Modell, Baujahr, Fahrgestellnummer fehlen.
- Dokument: ein Upload-Feld, Kategorie `dokument`, bis zu fünf Dateien (`anfrage-formular.tsx:284-301`, `:163`). Kategorien werden serverseitig geprüft (`src/lib/server/datei-pruefung.ts:14-22`), die Zuordnung zu Fahrzeugschein fehlt.
- Drei Schlüsselfotos: keine Slots, alle Dateien gleich getaggt.
- Beschreibung: Pflicht ab 20 Zeichen (`anfrage-formular.tsx:93`). Erfuellt.
- Zu bauen: Eigenen Fallback-Schritt mit Fahrzeugfeldern, drei Fotoslots (wiederverwendbar aus `optionen.ts` KEY_PHOTO_SLOTS) und Fahrzeugschein-Slot, Aufwand M.

### FA-06-17 · Telefonnummer und direkte Hilfe (teilweise)
- Telefon Pflicht im Kontakt-Schritt des allgemeinen Formulars: `anfrage-formular.tsx:99` und `:366-376`.
- Betriebstelefon sitewide: `src/app/(site)/layout.tsx:80-81` (Übergabe an Kopf), `src/components/layout/site-header.tsx:78` (Prop `telefon`), `src/components/layout/site-footer.tsx:57` (Link).
- Direkte Hilfe im Assistenten: „Hilfe bei den Fotos? Rufen Sie uns an“ (`assistent.tsx:1296-1306`), „Fragen zum Fahrzeugschein? Rufen Sie uns an“ (`assistent.tsx:1347-1357`), Telefon Pflicht im Termin-Weg (`assistent.tsx:1481`).
- Lücke: Im Fallback-Formular gibt es keine Hilfe-Zeile mit Telefonnummer neben dem Formular, nur das Pflichtfeld. Ein Rückruf- oder Hilfeangebot fehlt.
- Zu bauen: Telefonzeile und Rückrufhinweis im Fallback-Schritt, Aufwand S. Mensch: Rufzeiten, Ansprechpartner.

## 4. Maßstab Abschnitt 01 und Abschnitt 29

- Abschnitt 01 verlangt echte End-to-End-Funktion und Pflege ohne Entwickler. Bestand: Marken und Reihen sind im Payload-Admin pflegbar (`src/payload/collections/Fahrzeugmarken.ts:9`, `src/payload/collections/Fahrzeugreihen.ts:14`). Der KBA-Import läuft aber nur über das Skript `scripts/fahrzeuge-import.mjs`, das ein Entwickler startet. Der Betreiber kann den Katalog also nicht selbst neu einspielen.
- Die Tests `src/lib/fahrzeuge/fahrzeuge.test.ts` und `src/app/(site)/autoschluessel/anfrage/unterlagen-pruefung.test.ts` sind Modul-Tests. Einen End-to-End-Nachweis für den Fallback gibt es im Bestand nicht. Tests wurden für diesen Bericht nicht ausgeführt.
- Abschnitt 29 fordert keine Platzhalter. Die Motorrad- und Fallback-Wege nutzen Freitext statt Datenbank, das ist im Bestand bewusst beschrieben (`kern.ts:3-4`). Gegen die Anweisung ist das ein Platzhalter für Abschnitt 06.

## 5. Offene Fragen

1. Gilt die Ausnahme „Totalverlust, keine Schlüsselfotos nötig“ (FA-06-11)? Die Anweisung kennt sie nicht.
2. Woher stammen die 49 gepflegten Modelle und ihre Schlüsselarten in `content/vehicles.json` (keine Quelle vermerkt)? Die Anweisung verbietet manuelle Zusammenstellung aus dem Kopf (FA-06-07).
3. Erklärt die Zusammenführung gleicher Reihen die Differenz zwischen 624 Katalogzeilen und 649 benannten Reihen laut `_werkstatt/ausbau/QUELLEN.md:13`? Die abgeleitete CSV liegt nicht im Arbeitsbaum.
4. Fehlen Rolls-Royce, Abarth und Alpina, weil sie unter der Schwelle oder in SONSTIGE liegen? Das ist aus dem Bestand nicht entscheidbar (FA-06-02).
5. Ist die Lizenz des KBA-Datensatzes bestätigt? Laut `_werkstatt/ausbau/erhebung/E1-fahrzeugquellen.md:104` ist das offen (FA-06-07).
6. Muss der Fahrzeugschein auch im Anfrage-Weg (Fallback) Pflicht sein (FA-06-09)?
7. Soll die Serverprüfung der drei Schlüsselfotos auch ohne Dateiablage greifen (FA-06-12)?
8. Welche Ersatzunterlagen gelten für Kleinstfahrzeuge ohne Zulassungsbescheinigung (FA-06-14)? Das ist eine fachliche und rechtliche Festlegung.
9. Wie lautet der Ablauf nach einer Anfrage zu einem nicht gefundenen Fahrzeug (FA-06-08)?
10. Ist der Wortlaut „Spitze beziehungsweise Profil von vorne“ (Anweisung) oder „von der Seite“ (Bestand, `optionen.ts:184-185`) gewollt (FA-06-10)?

## 6. Grenzen dieser Prüfung

- Nicht ausgeführt: Tests, Build, Browser, Serverstart. Urteile beruhen auf dem Lesen des Quelltextes.
- Nicht geprüft: Inhalt der Payload-Datenbank im Betrieb (es wurde nur der Seed-Stand aus den Dateien betrachtet), Mails und das PDF-Vorgangsblatt für die Fallback-Anfrage (nur `src/lib/pdf/vorgangsblatt.ts:21-22` als Vorschau-Regel gelesen).
- Die Rohdatei und die abgeleitete CSV des KBA liegen nicht im Arbeitsbaum; Aussagen zum Importumfang stützen sich auf den Katalog selbst.
