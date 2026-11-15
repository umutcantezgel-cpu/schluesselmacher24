# FA-KUNDSCHAFTER-11 · Abgleich SEO-Architektur, Bedienbarkeit, Qualitätskontrolle

Stand der Prüfung: 2026-11-15 (Lesestand Repository, Arbeitsbranch der Sitzung).
Quelle: _werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt, Abschnitte 25, 26, 27, Anhang B Punkt 4 (Seobility). Abschnitte 01 und 29 nur als Maßstab gelesen.
Methode: Nur Lesen und Suchen im Quelltext, in content/*.json, Payload-Sammlungen, Tests und Werkzeugen. Keine Projektbefehle, kein Build, keine Tests, keine Netzabrufe, keine .env-Dateien. Messwerte stammen aus LAGEBILD.md (Stand 2026-11-02) und sind als solche gekennzeichnet, nicht nachgemessen.

Urteile: erfuellt (vollständig, mit Fundstelle) · teilweise · fehlt · widerspricht. Aufwand: S bis zwei Stunden, M bis ein Tag, L mehr, "-" wenn nichts zu tun ist.

## 1. Tabelle aller Anforderungen

| ID | Anforderung (kurz) | Urteil | Aufwand | Lücke in einem Satz | Nur ein Mensch liefert |
|---|---|---|---|---|---|
| FA-25-01 | Saubere URLs | teilweise | S | Pfade sind lesbar, Anfragewege hängen aber an ?thema= | Entscheidung, ob Anfragen eigene Pfade erhalten |
| FA-25-02 | Seitentitel | teilweise | S | Startseitentitel 77 Zeichen, Codelinien-Titel laut Lagebild zu lang | Freigabe der Titel |
| FA-25-03 | Meta-Beschreibungen | teilweise | S | 6 von 26 Einträgen in content/seo.json außerhalb 120 bis 160 Zeichen | Freigabe der Texte |
| FA-25-04 | Überschriftenstruktur | teilweise | S | Mechanismus (eine h1) vorhanden, Ergebnis über alle Seiten nicht belegt | Keine |
| FA-25-05 | Canonicals | erfuellt | - | Jede indexierbare Seite setzt eine canonical, per Test gesichert | Keine |
| FA-25-06 | XML-Sitemap | erfuellt | - | Sitemap aus Routen und Daten, noindex ausgeschlossen, per Test gesichert | Einreichung in der Search Console nach Livegang |
| FA-25-07 | robots.txt | erfuellt | - | Sperrt Admin, API, Kasse, Warenkorb, Bestellung; Trainings-Bots nicht geregelt | Entscheidung zu Trainings-Bots (MA-19) |
| FA-25-08 | Strukturdaten Betrieb | teilweise | S | Locksmith-Daten nur auf der Startseite | Firmendaten, Öffnungszeiten, USt-IdNr. |
| FA-25-09 | Strukturdaten Produkte | teilweise | S | Product nur für Codelinien, Hersteller vielfach Platzhalter | Echte Hersteller- und Produktdaten |
| FA-25-10 | Strukturdaten Leistungen | teilweise | S | Service-Typ nur auf Ortsseiten, Leistungsseiten nur WebPage | Freigabe der Leistungstexte |
| FA-25-11 | Strukturdaten Breadcrumbs | teilweise | S | Vorhanden, Abdeckung je Seite nicht vollständig geprüft | Keine |
| FA-25-12 | Strukturdaten passende Inhalte | teilweise | S | Article, Product, FAQPage vorhanden, FAQPage entgegen Lagebild-Plan noch aktiv | Keine |
| FA-25-13 | Mobile Performance | teilweise | M | Lighthouse-Messung unter Ziel, eigene Messung widerspricht | Entscheidung über Messmaßstab |
| FA-25-14 | Optimierte Bilder | teilweise | M | Keine belegte Bildoptimierung, Bildstand mit Platzhaltern | Echte Fotos, Komprimierung |
| FA-25-15 | Kurze Ladezeiten | teilweise | M | Widersprüchliche Messwerte, Ursache laut Lagebild offen | Keine |
| FA-25-16 | Interne Verlinkung Marke, Modell | teilweise | S | Verweise vorhanden, Marke zu Modell nicht vollständig nachgewiesen | Keine |
| FA-25-17 | Interne Verlinkung Leistung, Stadt | teilweise | S | Stadtseiten nur bei Platzhalterfreiheit, Verknüpfung Leistung zu Stadt nicht belegt | Freigabe echter Einsatzgebiete |
| FA-25-18 | Interne Verlinkung Partner | teilweise | M | Partner nur von Vor-Ort und Partner-werden aus verlinkt | Partnerdaten und Freigabe |
| FA-25-19 | Interne Verlinkung Shop, Ratgeber | erfuellt | - | Navigation und Rubrikdaten verlinken Code-Shop und Ratgeber | Keine |
| FA-25-20 | Staging nicht indexieren | teilweise | S | Vercel-Vorschau und Schaufenster gesperrt, ein Produktionsstart außerhalb Vercel nicht | Festlegung des Standardwerts |
| FA-25-21 | Seobility nutzen | fehlt | S | Kein Bezug im Repository, kein Konto nachweisbar | Konto anlegen, Crawl auswerten |
| FA-25-22 | Zielwert 95 bis 98 Prozent | fehlt | M | Kein Seobility-Wert, Lighthouse-SEO 92 auf der Startseite 100 laut Lagebild | Seobility-Messung nach Livegang |
| FA-26-01 | Große Buttons, gut lesbare Schrift | teilweise | S | Button-Größe vorhanden, Kleinschrift nicht vollständig geprüft, Lagebild-Wert widerspricht | Sichtprüfung mit älteren Testpersonen |
| FA-26-02 | Keine überladene Navigation | teilweise | M | Navigation mit vielen Unterpunkten, Hub mit acht statt zwölf Kacheln laut Lagebild | Bewertung durch Probenutzer |
| FA-26-03 | Mehrstufige Formulare mit Fortschrittsanzeige | erfuellt | - | Gemeinsame Ablaufhülle mit "Schritt n von m" und Fortschrittsbalken | Keine |
| FA-26-04 | Zurück ohne Datenverlust | erfuellt | - | Zurück im Ablauf, Zwischenstand im Browser gespeichert | Sichtprüfung mit Fotoupload |
| FA-26-05 | Verständliche Fehlermeldungen | teilweise | S | Fehlermeldungen mit role alert, Wortlaut nicht durchgängig geprüft | Probenutzer-Urteil |
| FA-26-06 | Foto-Upload mit konkreten Beispielen | teilweise | S | Ein Beispielbild am Upload, Fotoanleitung mit drei Beispielen fehlt laut Lagebild | Echte Beispielfotos vom Inhaber |
| FA-26-07 | Telefon und Hilfe an kritischen Stellen | teilweise | S | "Anrufen" überall, Hilfetexte in Motorrad und Gehäuse nur als Telefonfeld | Freigabe der Hilfetexte und Rufnummer |
| FA-26-08 | Keine Sackgassen (nicht gefunden, unsicher, individuelle Anfrage) | teilweise | M | Ausweg-Texte in Fahrzeug, Marke, Region, Zylinder; in Motorrad, Gehäuse, Einsenden, Partner nicht gefunden | Freigabe der Formulierungen |
| FA-26-09 | Mobile Bedienung intensiv testen | teilweise | M | Werkzeuge und Messungen vorhanden, kein automatischer Mobil-Test im Repository | Testgeräte iPhone und Android |
| FA-27-01 | Jeder Prozess vollständig getestet | fehlt | L | Keine End-to-End-Tests im Repository, Werkzeuge nur manuell | Freigabe der Testdaten |
| FA-27-02 | Pflichttest Fahrzeuganfrage | teilweise | M | Unit- und Datenbanktests, kein Durchlauf von Anfrage bis Admin | Testbestellung und Testanfrage |
| FA-27-03 | Pflichttest Motorrad und Kleinstfahrzeuge | teilweise | M | Kernlogik getestet, Formular und Admin nicht | Testanfrage |
| FA-27-04 | Pflichttest Schlüssel nach Code | teilweise | M | Übernahme und Zahlung getestet, Warenkorb bis Bestätigung nicht | Testbestellung |
| FA-27-05 | Pflichttest Schlüssel nach Vorlage | teilweise | M | Beispiele und Upload getestet, Preisprozess und Mail nicht durchgängig | Testanfrage |
| FA-27-06 | Pflichttest Einsendeservice | teilweise | M | Einsenden und Versand als Logik getestet, Etikett, Tracking, Rückversand nicht | Versandkonto, Testsendung |
| FA-27-07 | Pflichttest Gehäuse und Customizing | teilweise | M | Kernlogik getestet, Ablauf bis Status nicht | Testbestellung |
| FA-27-08 | Pflichttest Sperrschließungen | teilweise | M | Konfigurator-Kern und Zylinderregeln getestet, Preis bis Kasse nicht | Testbestellung |
| FA-27-09 | Pflichttest Schließanlagen | teilweise | M | Konfigurator-Logik und Schließplan-Editor getestet, Schließplan-PDF und Adminbericht nicht | Testanfrage |
| FA-27-10 | Pflichttest Elektronischer Zutritt | fehlt | M | Nur Grafik-Generator getestet, kein Konfigurator- oder Anfrageprozess | Testanfrage |
| FA-27-11 | Pflichttest Sicherheitstechnik | fehlt | M | Kein Test für Sicherheitscheck oder Kontaktweg | Testanfrage |
| FA-27-12 | Pflichttest Partner | teilweise | M | Partnerlogik, Vertrags-PDF und Datenbanktest, Freischaltung und Leadzuordnung nicht durchgängig | Testpartner, Testvertrag |
| FA-27-13 | Pflichttest Admin | teilweise | M | Sammlungs- und Hook-Tests, kein Admin-Durchlauf je Bereich | Admin-Durchlauf am Bildschirm |
| FA-27-14 | Pflichttest Geräte | teilweise | M | Chromium mit Geräte-Größen, kein Safari, keine echten iPhone- und iPad-Geräte | Testgeräte |
| FA-27-15 | Abnahmeprinzip, echte Testbestellung und Testanfrage | teilweise | M | Platzhalter-Gate nur für Firmendaten und Rechtsseiten, Testläufe fehlen | Testbestellung, Testanfrage, Protokolle |
| FA-AB-04 | Seobility als technische Kontrolle, Ziel 95 bis 98 | fehlt | S | Siehe FA-25-21 und FA-25-22 | Seobility-Konto und Auswertung |

Summe: 47 Anforderungen. erfuellt 6 (FA-25-05, 25-06, 25-07, 25-19, 26-03, 26-04). teilweise 35. fehlt 6 (FA-25-21, 25-22, 27-01, 27-10, 27-11, AB-04). widerspricht 0.

Hinweis zur Zählung: FA-AB-04 wiederholt FA-25-21 und FA-25-22 und ist nur dort verlinkt.

## 2. Pflichttest-Zeilen aus Abschnitt 27 (Abdeckung)

Keine der dreizehn Zeilen ist vollständig durch einen automatischen End-to-End-Test abgedeckt. Elf Zeilen sind teilweise durch Unit- oder Datenbanktests abgedeckt, zwei Zeilen gar nicht (Elektronischer Zutritt, Sicherheitstechnik). Prüfwerkzeuge in _werkstatt/ausbau/werkzeuge (funktionsliste.mjs, bildsatz.mjs, konsole.mjs, a11y.mjs, lighthouse.mjs) laufen nur manuell und decken keine Prozesse bis zur Bestätigung ab.

| Zeile | Abdeckung | Vorhandene Tests (Dateien) | Nicht abgedeckt |
|---|---|---|---|
| Fahrzeuganfrage | teilweise | src/app/(site)/autoschluessel/anfrage/unterlagen-pruefung.test.ts, src/components/autoschluessel/termin-auswahl.test.tsx, src/components/autoschluessel/bestaetigung.test.tsx, src/lib/zahlung/*.test.ts, src/payload/hooks/termin-aktionen.test.ts, src/lib/mail/termin-mails.test.ts | Durchlauf im Browser bis Admin, echte Fotos |
| Motorrad und Kleinstfahrzeuge | teilweise | src/app/(site)/motorradschluessel/anfrage/kern.test.ts | Formular, Zahlung, Admin |
| Schlüssel nach Code | teilweise | src/app/(site)/schluessel-nach-code/[slug]/code-uebernahme.test.ts, src/lib/zahlung/*.test.ts | Warenkorb bis Bestätigung, Adminstatus |
| Schlüssel nach Vorlage | teilweise | src/app/(site)/schluessel-nach-vorlage/anfrage/beispiele.test.ts, src/components/forms/photo-upload.test.tsx | Preisprozess, Versandoption, Mail |
| Einsendeservice | teilweise | src/lib/einsenden/einsenden.test.ts, src/lib/versand/versand.test.ts | Etikett, Tracking, Rückversand |
| Gehäuse und Customizing | teilweise | src/app/(site)/autoschluessel/gehaeuse/anfrage/kern.test.ts | Ablauf bis Status, Zahlung |
| Sperrschließungen | teilweise | src/app/(site)/gleichschliessende-zylinder/konfigurator/kern.test.ts, src/lib/cylinder-rules.test.ts, src/lib/cylinder-summary.test.ts, src/lib/konfigurator/konfigurator.test.ts | Warenkorb und Kasse |
| Schließanlagen | teilweise | src/lib/konfigurator/konfigurator.test.ts, src/lib/konfigurator/vorgang.test.ts, src/components/konfigurator/schliessplan-editor.test.tsx | Schließplan-PDF, Adminbericht |
| Elektronischer Zutritt | fehlt | nur src/components/visual/generators/zutritt-signal.test.tsx (Grafik) | Konfigurator, Projektanfrage, Uploads |
| Sicherheitstechnik | fehlt | kein Test für sicherheitscheck.tsx oder den Sicherheitsweg | alles |
| Partner | teilweise | src/lib/partner/partner.test.ts, src/lib/partner/partnerbetriebe.db.test.ts, src/lib/pdf/partnervertrag.test.ts, src/payload/hooks/partnervertrag-pdf.test.ts | Freischaltung, Regionen, Leadzuordnung im Ablauf |
| Admin | teilweise | src/payload/collections/vorgaenge-felder.test.ts, src/payload/globals/Einstellungen.test.ts, src/payload/hooks/termin-aktionen.test.ts, src/payload/leitfaden.db.test.ts, src/payload/seed.db.test.ts | Produkte, Kategorien, Storno, Kunde, Inhalte als Durchlauf |
| Geräte | teilweise | Viewports 360x780, 390x844, 768x1024, 1440x900, 1920x1080 in _werkstatt/ausbau/werkzeuge/lib.mjs | Safari (WebKit), echte iPhone, iPad und Android |

## 3. Einzelheiten mit Fundstellen

### Abschnitt 25 · SEO-Architektur

FA-25-01 (teilweise). Pfade sind lesbar, etwa /autoschluessel/marken/[make]/[model] und /schluessel-nach-code/[slug]. Die Statikliste der Sitemap steht in src/app/sitemap.ts:33 bis 72. Anfragewege hängen an einem Abfrageparameter: src/app/(site)/tuer-und-schliesstechnik/page.tsx:177 und src/app/(site)/service-und-termin/page.tsx:384 verlinken auf /service-und-termin/anfrage?thema=... Das Lagebild nennt den Weg ebenfalls (_werkstatt/ausbau/LAGEBILD.md:23). Bauen: entscheiden, ob Anfragen eigene Pfade erhalten; dann Routen und Links in src/lib/navigation.ts und src/components/autoschluessel/fahrzeug-ziel.ts:65 anpassen. Mensch: Entscheidung über die Pfadstruktur.

FA-25-02 (teilweise). Die Standardtitel stehen in src/app/(site)/layout.tsx:32 bis 35 (Vorlage "%s | SCHLÜSSELMACHER24"). In content/seo.json hat die Startseite (route "") einen 77 Zeichen langen Titel: "Autoschlüssel, Schließ- und Sicherheitstechnik in Wetzlar | SCHLÜSSELMACHER24". Von 26 Einträgen überschreiten 1 die 60 Zeichen. Laut Lagebild (Abschnitt 4 und 5) sind 28 von 181 Titeln bis 580 Pixel, 31 von 52 Codelinien-Titel liegen über 60 Zeichen (_werkstatt/ausbau/LAGEBILD.md:44 ff., Schwäche 9 in Zeile 64). Dies ist nicht nachgemessen. Bauen: Titel in content/seo.json kürzen, Codelinien-Titel über src/lib/codelinie-texte.ts begrenzen. Aufwand S. Mensch: Freigabe der Titel (Leitfaden verlangt menschliche Prüfung, Lagebild Abschnitt 8).

FA-25-03 (teilweise). content/seo.json enthält 26 Einträge mit Beschreibungen. Außerhalb von 120 bis 160 Zeichen liegen: autoschluessel/fahrzeugoeffnung (110), schluessel-einschicken (165), schluessel-nach-code (119), schluessel-nach-vorlage/anfrage (109), service-und-termin (99), partner-werden (166). Codelinien-Beschreibungen kommen aus texte.metaBeschreibung (src/app/(site)/schluessel-nach-code/[slug]/page.tsx). Bauen: sechs Texte in content/seo.json anpassen, Codelinien-Regel in src/lib/codelinie-texte.ts prüfen. Aufwand S. Mensch: Freigabe.

FA-25-04 (teilweise). Eine h1 je Seite wird über src/components/layout/page-header.tsx:92 erzeugt, die Startseite über src/components/hub/intent-hub.tsx:49. Das Werkzeug inventar.mjs prüft die Anzahl (_werkstatt/ausbau/werkzeuge/inventar.mjs:139). Ein Ergebnis über alle Seiten liegt im Repository nicht vor. Bauen: nichts im Code. Aufwand S: Inventarlauf auf dem Produktionsserver und Auswertung. Mensch: keine.

FA-25-05 (erfuellt). Die Routen setzen alternates.canonical, etwa src/app/(site)/page.tsx:35, src/app/(site)/autoschluessel/page.tsx:38, src/app/(site)/schluessel-nach-code/[slug]/page.tsx:98, src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:135. Das Root-Layout setzt keine Vorgabe (src/app/(site)/layout.tsx:41 bis 44). Der Test src/app/(site)/canonical.test.ts:19 bis 32 verlangt eine canonical auf jeder indexierbaren Seite. Der Test prüft das Vorhandensein, nicht die Korrektheit jeder Adresse.

FA-25-06 (erfuellt). src/app/sitemap.ts liefert Statikseiten (Z. 33 bis 72), Marken und Modelle nur ohne noindex (ab Z. 107), Codelinien, Kategorien, Hersteller, Artikel, Leistungsseiten, Ratgeber und Standorte nur ohne Platzhalter. Test: src/app/sitemap.test.ts:43 bis 120. Aufwand "-". Mensch: Einreichung in der Search Console nach dem Livegang.

FA-25-07 (erfuellt). src/app/robots.ts:10 sperrt außerhalb der Produktion alles; in der Produktion erlaubt es alles, sperrt /admin, /api/, /kasse, /warenkorb, /bestellung (Z. 19) und nennt die Sitemap (Z. 22). Test: src/app/robots.test.ts:14 bis 42. Offen: Trainings-Bots sind nicht geregelt. Das Lagebild nennt die Entscheidung als Inhaberentscheidung MA-19 (_werkstatt/ausbau/LAGEBILD.md:81). Aufwand "-". Mensch: Entscheidung zu Trainings-Bots.

FA-25-08 (teilweise). localBusinessSchema (src/components/seo/json-ld.tsx:56) liefert Organisation und Locksmith (Z. 124). Eingebunden nur auf der Startseite (src/app/(site)/page.tsx:123). Firmendaten erscheinen nur ohne Platzhalter (src/lib/rechtliches/firma.ts:21 firmaVeroeffentlichbar). Auf Kontakt-, Ortsseiten und Leistungsseiten fehlt der Betrieb als Entität mit Adresse. Bauen: Betriebs-Referenz auf Ortsseiten und Kontakt einbinden. Aufwand S. Mensch: Firmendaten, Öffnungszeiten, USt-IdNr. liefern (G9: nicht von uns setzen).

FA-25-09 (teilweise). productSchema (src/components/seo/json-ld.tsx:144) liefert Product mit Offer, Preis aus line.priceCents (Z. 179), Verfügbarkeit nach active. Hersteller nur ohne Platzhalter (Z. 173 bis 175). Eingebunden auf schluessel-nach-code/[slug]/page.tsx:172. Lagebild: Hersteller überall Platzhalter (_werkstatt/ausbau/LAGEBILD.md:12, Zeile zu Schlüssel nach Code). Andere Angebote (Gehäuse, Sperrschließung, Konfiguratoren) haben kein Product. Aufwand S. Mensch: echte Hersteller und Preise.

FA-25-10 (teilweise). Service steht nur in serviceAreaSchema (src/components/seo/json-ld.tsx:262, Typ Service in Z. 285), also nur auf Ortsseiten. pageGraphSchema (Z. 342) setzt WebPage und optional FAQPage und BreadcrumbList, aber keinen Service. Leistungsseiten wie autoschluessel/page.tsx:306 nutzen pageGraphSchema. Bauen: pageGraphSchema um optionalen Service mit Leistungsname und Anbieter erweitern. Aufwand S. Mensch: Leistungstexte freigeben.

FA-25-11 (teilweise). breadcrumbSchema (json-ld.tsx:301) und BreadcrumbList in pageGraphSchema (Z. 386 bis 398) sind vorhanden. Sichtbare Brotkrumen kommen aus src/components/layout/page-header.tsx:115, 52 Aufrufe mit crumbs= in src/app. Ob jede Seite beides gleichzeitig hat, ist nicht geprüft. Aufwand S. Mensch: keine.

FA-25-12 (teilweise). Ratgeber: articleSchema (json-ld.tsx:191), eingebunden in ratgeber/[slug]/page.tsx:120. Codelinien: productSchema plus faqSchema (schluessel-nach-code/[slug]/page.tsx:174). FAQPage bleibt aktiv, obwohl das Lagebild seine Entfernung in E8-OPUS-01 vorsieht und FAQ-Ergebnisse seit Juni 2026 nicht mehr sichtbar sind (_werkstatt/ausbau/LAGEBILD.md:64 und 76). Die Anforderung verlangt FAQPage nicht ausdrücklich, daher kein Widerspruch zum Text, aber zur Lagebild-Planung. Aufwand S. Mensch: keine.

FA-25-13 (teilweise). Lagebild Abschnitt 4 (_werkstatt/ausbau/LAGEBILD.md:44): Lighthouse mobil LCP 2,86 bis 4,41 s, Leistung unter 90 in 11 Ansichten, Startseite 83. Eigene Messung mit Drosselung: LCP mobil 484 bis 652 ms (selbe Zeile). Die Widersprüche sind laut Lagebild noch nicht aufgeklärt. Werkzeuge: _werkstatt/ausbau/werkzeuge/lighthouse.mjs, messung.mjs. Aufwand M. Mensch: Entscheidung über den Messmaßstab.

FA-25-14 (teilweise). next/image wird in 2 Dateien genutzt, <img> in einer Datei. Bildplatzhalter erscheinen in src/components/ui/image-placeholder.tsx. Das Lagebild zählt 51 Platzhalter auf 182 Seiten (_werkstatt/ausbau/LAGEBILD.md:46). Eine Optimierungsstrategie für Fotos ist im Code nicht belegt. Aufwand M. Mensch: echte Fotos liefern, Format und Größe vorgeben.

FA-25-15 (teilweise). Siehe FA-25-13. Die Ladezeit ist laut Lagebild die Stelle mit dem größten Abstand zwischen Messmethoden. Aufwand M. Mensch: keine.

FA-25-16 (teilweise). Verweise auf /autoschluessel/marken finden sich in 11 Dateien, Modellseiten existieren unter src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx. Modellseiten sind nur bei eigener Substanz indexierbar (src/lib/fahrzeug-texte.ts:300 modellIndexierbar). Ob die Marke jeweils zu ihren Modellen verlinkt, ist im Code nicht vollständig geprüft. Aufwand S. Mensch: keine.

FA-25-17 (teilweise). /standorte wird aus 5 Dateien verlinkt. Stadtseiten sind nur bei fehlender Platzhalter indexierbar (src/lib/rechtliches/indexierung.ts:18 bis 20). Leistung zu Stadt wird nicht belegt. Aufwand S. Mensch: Einsatzgebiete mit echten Angaben.

FA-25-18 (teilweise). /partner-werden wird aus 3 Dateien verlinkt. Das Lagebild nennt die Partnerzuordnung im Ablauf vor Ort als Lücke (_werkstatt/ausbau/LAGEBILD.md:24). Ein sichtbares Partnerverzeichnis aus Kundensicht ist nicht gefunden worden. Aufwand M. Mensch: Partnerdaten und Freigabe.

FA-25-19 (erfuellt). Die Navigation verlinkt den Code-Shop (/schluessel-nach-code, src/lib/navigation.ts:100 bis 116) und den Ratgeber (/ratgeber/schluesselcode-finden, Z. 93 und 115). Die Verlinkung ist in Rubrikdaten angelegt, die Seiten verlinken darüber hinaus (21 Dateien für /schluessel-nach-code, 12 für /ratgeber). Aufwand "-".

FA-25-20 (teilweise). src/lib/umgebung.ts:93 bis 95: indexierungErlaubt = istProduktion() && !istSchaufenster(). istProduktion() prüft auf Vercel VERCEL_ENV, sonst NODE_ENV (src/lib/umgebung.ts:51 bis 55). Vorschau auf Vercel, Schaufenster und lokale Läufe sind geschützt (robots.ts:11, layout.tsx:53). Lücke: Ein Produktionsbetrieb mit NODE_ENV=production außerhalb von Vercel (etwa der Produktionsserver auf Port 3000 der Prüfwerkzeuge) wäre indexierbar, sofern er öffentlich erreichbar ist. Bauen: eigenen Schalter mit Standardwert "nicht indexieren" einführen, nur ausdrücklich freigeschaltet indexieren. Aufwand S. Mensch: Standardwert festlegen und im Hosting setzen. Hinweis: scripts/schaufenster.json hat "aktiv": true, die Seite ist daher bis zum Livegang bewusst gesperrt.

FA-25-21 (fehlt). Im Repository gibt es keinen Bezug zu Seobility außer in der Arbeitsanweisung selbst (Suche über das gesamte Repository ohne node_modules). Aufwand S. Mensch: Konto anlegen, Projekt einrichten, Crawl nach Livegang auswerten.

FA-25-22 (fehlt). Ein Seobility-Wert existiert nicht. Lighthouse SEO liegt laut Lagebild bei 92 (Startseite 100, Kasse 54 wegen noindex, _werkstatt/ausbau/LAGEBILD.md:44). Aufwand M. Mensch: Messung mit Seobility nach Livegang, Priorisierung zusammen mit dem Inhaber.

### Abschnitt 26 · Bedienbarkeit

FA-26-01 (teilweise). Der Button hat eine Größe "lg" (src/components/flow/flow-shell.tsx:358 für Zurück, ähnlich für Weiter). Die Fließtextgröße ist in src/app/(site)/globals.css:163 mit 1,0625 bis 1,125 rem (17 bis 18 Pixel) angegeben. Das Lagebild nennt dagegen Fließtext mobil 15 Pixel (_werkstatt/ausbau/LAGEBILD.md:62). Die beiden Angaben widersprechen sich, die Kleinschrift in Hilfetexten ist nicht geprüft. Offene Frage: Wert auf dem Gerät messen. Aufwand S. Mensch: Sichtprüfung mit älteren Testpersonen.

FA-26-02 (teilweise). Die Navigation ist in src/lib/navigation.ts aufgebaut, etwa Autoschlüssel mit zwei Gruppen und sieben Unterpunkten (Z. 38 bis 70). Das Lagebild nennt den Hub mit acht statt zwölf Kacheln (_werkstatt/ausbau/LAGEBILD.md:56). Ob die Navigation als überladen empfunden wird, ist eine Einschätzung, die nur Probenutzer geben. Aufwand M.

FA-26-03 (erfuellt). Die gemeinsame Ablaufhülle src/components/flow/flow-shell.tsx nutzen 14 weitere Formulare und Konfiguratoren, darunter Motorrad, Gehäuse, Einsenden, Partner und der Autoschlüssel-Assistent. Fundstellen: flow-shell.tsx:241 "Schritt n von m", :261 bis 262 role="progressbar" mit aria-valuenow.

FA-26-04 (erfuellt). Zurück: src/components/flow/flow-shell.tsx:116 (zurueck), :358 (Knopf). Die Eingaben bleiben im Ablauf erhalten, der Zwischenstand wird je Ablauf im Browser gespeichert (src/lib/flow/use-flow.ts:72 Präfix "sm24:flow:", :164 writeStoredValue). Ein Hinweis auf geladenen Stand erscheint (flow-shell.tsx:284). Einschränkung: Der Stand liegt nur auf dem Gerät. Aufwand "-". Mensch: Sichtprüfung mit einem Foto-Upload, der beim Zurückgehen erhalten bleibt.

FA-26-05 (teilweise). Fehlermeldungen mit role="alert" (src/components/forms/field.tsx:51), aria-invalid in src/components/forms/controls.tsx:27, :46, :64. Beispiel eines konkreten Wortlauts: src/app/(site)/motorradschluessel/anfrage/anfrage-formular.tsx:150. Eine Prüfung aller Meldungen auf Verständlichkeit liegt nicht vor. Aufwand S. Mensch: Probenutzer prüfen.

FA-26-06 (teilweise). Beispielbild am Uploadfeld (src/components/forms/photo-upload.tsx:203, :373 bis 384). Die Fotoanleitung mit drei Beispielen und dem Hinweis "nicht jedes Foto ist ablesbar" fehlt laut Lagebild (_werkstatt/ausbau/LAGEBILD.md:17). Aufwand S. Mensch: echte Beispielfotos liefern, Bilder nie aus fremden Quellen (R11).

FA-26-07 (teilweise). "Anrufen" steht in der Aktionsleiste auf allen Seiten (src/components/layout/mobile-action-bar.tsx:27 und :91, eingebunden in src/app/(site)/layout.tsx). Telefon als Pflichtfeld: motorradschluessel/anfrage/anfrage-formular.tsx:304 und gehaeuse/anfrage/anfrage-formular.tsx:304. Das ist ein Kontaktfeld, keine Hilfe. Hilfe mit Telefon an kritischen Schritten (Fahrzeugschein, Code, Maße) ist nur in den größeren Formularen belegt (Trefferzahlen per Suche auf Telefon, Anruf, Hilfe: assistent.tsx 18, zutritt-konfigurator.tsx 10, einsende-formular.tsx 7, service-und-termin/anfrage 9, partner-formular 9). Aufwand S je Formular. Mensch: Rufnummer und Hilfetexte freigeben.

FA-26-08 (teilweise). Ausweg-Texte gefunden:
- "Mein Fahrzeug ist nicht dabei" (src/app/(site)/autoschluessel/anfrage/assistent.tsx:1027)
- "Marke nicht dabei?" (src/app/(site)/autoschluessel/marken/page.tsx:158), "Modell nicht dabei?" (marken/[make]/page.tsx:337)
- "Ihre Region ist nicht dabei?" (src/app/(site)/standorte/page.tsx:115)
- "Unsicher? Wir beraten Sie" (src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx:574)
- "Weiß ich nicht" als Option (src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:1453), "weiß nicht" im Motorradtext (src/app/(site)/motorradschluessel/page.tsx:77)
- Individuelle Prüfung (src/app/(site)/service-und-termin/vor-ort/page.tsx:31)
In Motorrad-Anfrage, Gehäuse-Anfrage, Einsende-Formular und Partner-Formular fehlt ein Ausweg dieser Art (Suche nach "nicht dabei", "nicht gefunden", "individuell", "unsicher" in src/app und src/components ohne Treffer dort). Der Hub-Eintrag "Allgemeine Anfrage für Sonderfälle" aus Abschnitt 03 ist im Hub-Code und in content/rubriken.json nicht gefunden worden (offen, siehe Abschnitt 4). Aufwand M. Mensch: Formulierungen freigeben.

FA-26-09 (teilweise). Mobile Geräteprofile in _werkstatt/ausbau/werkzeuge/lib.mjs (360 x 780, 390 x 844, 768 x 1024). Die Werkzeuge laufen manuell; es gibt keine End-to-End-Spezifikation im Repository (git ls-files ohne playwright- oder spec-Dateien). Lagebild: Bildsatz 70 von 70 Läufe ohne Seitenüberlauf (_werkstatt/ausbau/LAGEBILD.md:43). Aufwand M. Mensch: echte Telefone testen.

### Abschnitt 27 · Qualitätskontrolle

FA-27-01 (fehlt). Keine End-to-End-Tests im Repository (keine Dateien mit playwright, cypress oder .spec). Vorhanden sind 189 Testdateien insgesamt, davon 15 Datenbanktests laut Lagebild (Abschnitt 4). Die Werkzeuge funktionsliste.mjs, konsole.mjs und a11y.mjs laufen von Hand. Aufwand L: E2E-Suite für die dreizehn Prozesse aufbauen (Playwright ist in _werkstatt/ausbau/werkzeuge bereits vorhanden, keine neue Laufzeitbibliothek). Mensch: Testdaten und Testzugänge.

FA-27-02 bis FA-27-14: siehe Abschnitt 2 dieses Berichts (Abdeckung, Dateien, Lücken). Bauen je Zeile: eine Browser-Spezifikation je Prozess, die den Weg bis zur Bestätigung oder zum Admin-Status durchläuft und nur Attrappen für Mail, Zahlung und Versand nutzt (G5). Aufwand M je Zeile, L bei Elektronik und Sicherheitstechnik (FA-27-10, FA-27-11). Mensch: echte Testbestellung und Testanfrage nach Abschnitt 27, weil die Anforderung ausdrücklich echte Vorgänge verlangt.

FA-27-15 (teilweise). Der Livegang-Check prüft nur Firmendaten und den Quelltext der Rechtsseiten (src/lib/livegang-pruefung.ts:61 platzhalterImText, :84 rechtsseitenFunde; Ausführung in scripts/build.mjs:18 und Zeile 218). Platzhalter in Inhalten und Seiten werden nicht geprüft; das Lagebild zählt 51 Platzhalter auf 182 Seiten (_werkstatt/ausbau/LAGEBILD.md:46). Protokolle für echte Testvorgänge liegen nicht vor. Bauen: den Platzhalter-Check auf content/*.json und die Seitenquellen ausweiten, ohne bestehende Prüfungen zu lockern (G8). Aufwand M. Mensch: Testbestellung und Testanfrage mit Screenshots oder Protokoll.

### Anhang B Punkt 4 · Seobility

FA-AB-04 (fehlt). Die Arbeitsanweisung nennt Seobility als Maßstab für technische und Onpage-Kontrolle, Score 80 Prozent als starke Basis, intern 95 bis 98 Prozent (_werkstatt/ausbau/daten/arbeitsanweisung-2026-11-11.txt:815 bis 817). Im Repository gibt es dazu keinen Bezug (siehe FA-25-21 und FA-25-22). Aufwand S. Mensch: Seobility-Konto und Auswertung.

## 4. Offene Fragen

1. Schriftgröße: Lagebild nennt 15 Pixel mobil, globals.css:163 setzt 17 bis 18 Pixel. Welcher Wert gilt auf dem Gerät? Gemessen wurde das nicht.
2. Ladezeit: Lighthouse (LCP 2,86 bis 4,41 s) und eigene Messung (484 bis 652 ms) widersprechen sich. Laut Lagebild sollte E4 das an der Startseite klären; der Status ist im Repository nicht belegt.
3. Überschriftenstruktur: Das Ergebnis des Inventarlaufs liegt nicht vor.
4. Trainings-Bots: Die Entscheidung des Inhabers (MA-19) ist offen; robots.ts regelt dazu nichts.
5. Ausweg "Allgemeine Anfrage für Sonderfälle": im Hub-Code und in content/rubriken.json nicht gefunden. Gehört zum Bereich Abschnitt 03; hier nur als Lücke für Abschnitt 26 vermerkt.
6. Zwischenstand im Browser: Wird ein hochgeladenes Foto beim Zurückgehen wiederhergestellt? Im Code ist es nicht belegt, nur im Test.
7. Staging: Standardwert des Indexschalters festlegen (FA-25-20).
8. FAQPage: Der Lagebild-Plan (E8-OPUS-01) sieht die Entfernung vor, im Code ist sie noch aktiv (schluessel-nach-code/[slug]/page.tsx:174). Entscheidung, ob der Plan gilt.

## 5. Selbstprüfung

- Jeder Aufzählungspunkt, jede Tabellenzeile und der Kasten aus Abschnitt 25, 26, 27 und Anhang B Punkt 4 ist in Abschnitt 1 aufgeführt: Abschnitt 25 mit 22 Anforderungen (7 Aufzählungspunkte, 5 Strukturdaten, 3 Performance, 4 Verlinkung, Staging, Seobility, Kasten), Abschnitt 26 mit 9 Punkten, Abschnitt 27 mit 13 Tabellenzeilen, dem Abnahmeprinzip und dem Grundsatz, Anhang B mit einer Zeile.
- Jedes erfuellt-Urteil hat eine gelesene Fundstelle (FA-25-05, 25-06, 25-07, 25-19, 26-03, 26-04).
- Nichts ist geraten: Messwerte aus dem Lagebild sind als solche gekennzeichnet; nicht nachgemessen ist alles, was als offen steht.
- Keine Änderung außer dieser Berichtsdatei, keine Projektbefehle, kein git, keine .env-Dateien gelesen.
