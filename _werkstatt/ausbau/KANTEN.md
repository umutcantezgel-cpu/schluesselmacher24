# KANTEN · Hebel für Suche und KI-Antworten (Stand 2026-11-03, E1-OPUS-01)

Bewertet jeden Hebel aus Auftrag 13 mit Status und Beleg. Quellen: Prüfung des Lagebilds in erhebung/E1-lagebild-suche.md (E1-RECHERCHEUR-04, offizielle Seiten von Google, Bing, IndexNow, OpenAI, Anthropic, Perplexity, Stand 2026-11-03), Vorher-Stand in LAGEBILD.md und der Bestand im Code. Status:

- **Bestand**: erfüllt, Beleg im Code; das genannte Paket prüft nur nach.
- **teilweise**: Ansatz im Bestand, Lücke benannt.
- **offen**: fehlt; das genannte Paket baut es.
- **Inhaber**: braucht eine Entscheidung oder ein Konto des Inhabers (MENSCHEN.md); gebaut wird, was ohne ihn geht.
- **Kür**: Labor oder Vorrat, nur nach der Pflicht (Auftrag L2).
- **zurückgestellt**: mit Grund; kein Paket in diesem Lauf.

Der Status in dieser Datei wird bei jeder Prüfstufe der Etappe E8 nachgeführt (E8-PRUEFER-02); Z-16 verlangt für jeden Hebel einen Status.

## Zugang

| Hebel | Status | Beleg | Paket |
|---|---|---|---|
| KT1 Such- und KI-Bots frei | Bestand | `src/app/robots.ts`: alle Nutzeragenten frei außer `/admin`, `/api/`, `/kasse`, `/warenkorb`, `/bestellung`; Vorschau und lokal gesperrt; Test `robots.test.ts`. Ein gesperrter OAI-SearchBot hielte die Seite aus ChatGPT-Suchantworten (E1-lagebild-suche N10). Trainings-Bots (GPTBot, ClaudeBot, Google-Extended) sind Inhabersache (MA-19). | E8-OPUS-01 prüft nach |
| KT2 alles im ersten HTML | teilweise | Seiten sind statisch oder serverseitig gerendert (Next App Router). Viele KI-Crawler führen kein JavaScript aus (Messung Vercel, Stand Dezember 2024, Stufe A; neuere Messung fehlt). Zu prüfen: Inhalte, die erst im Browser entstehen (Konfiguratoren, Finder-Ergebnisse, Karte). Regel: Erklärungen, Preise und Ablauf stehen im HTML, Werkzeuge ergänzen. | E4 bis E7 je Seite; Prüfung ohne JavaScript in E8-PRUEFER-02 |
| KT3 Snippet-Freiheit | offen | Meta-Robots ohne `max-snippet:-1` und `max-image-preview:large` (LAGEBILD Befund 9). `max-snippet` und `nosnippet` begrenzen auch die Nutzung in KI-Übersichten und KI-Modus (N6). Auftrag 13 legt `max-snippet:-1` fest. | E8-OPUS-01 |
| KT4 ein Host | Inhaber | Kanonische Adressen kommen aus `getSiteUrl()` (Bestand). Host-Weiterleitung (www oder ohne, http zu https) in einem Sprung ist Einstellung bei Domain und Hosting; G3 verbietet Änderungen dort. | E9-OPUS-03 (Punkt der Livegang-Prüfung) |
| KT5 Bing und IndexNow vorbereitet | offen | IndexNow meldet neue, geänderte und gelöschte Adressen an Bing, Yandex, Seznam, Naver, Yep, Internet Archive und Amazonbot, nicht an Google (N12, indexnow.org). Bing Webmaster Tools zeigt KI-Zitate als Vorschau seit 10.02.2026 (Nr. 11). Gebaut wird Schlüsseldatei und Meldefunktion, ausgeschaltet: G3 verbietet Meldungen an Suchmaschinen in diesem Lauf. Konto bei Bing Webmaster Tools: Inhaber. | E8-OPUS-01; Konto in AUSSEN.md (E8-DOKUMENTAR-01) |
| KT6 Sitemaps mit echtem lastmod, Bild- und Video-Sitemap | teilweise | `src/app/sitemap.ts` setzt `lastModified` nur aus echten Änderungsdaten (Funktion `geaendert`), Test `sitemap.test.ts`. Bild- und Video-Einträge fehlen; Videos erst mit E8-OPUS-03. | E8-OPUS-01 |
| KT7 Seitenname und Favicon | teilweise | WebSite-Knoten mit Namen im JSON-LD (`src/components/seo/json-ld.tsx`); WebSite-Markup auf der Startseite ist das bevorzugte Signal für den Seitennamen (N5). Favicon: `favicon.ico` mit 16, 32 und 48 px, `apple-icon` 180 px, `icon.svg`; Google nennt SVG nicht in der Formatliste und empfiehlt mehr als 48 × 48 px (N4, Stand 28.08.2026). | E8-OPUS-01 (Name wortgleich), E8-OPUS-05 (Favicon aus dem Logo, erst nach LOGO) |
| KT8 Tempo-Reserve | offen | Vorher-Stand: Lighthouse mobil Leistung unter 90 in 11 Ansichten (Start 83), LCP mobil 2,86 bis 4,41 s (ABNAHME Z-15). Schwellen: LCP 2,5 s, INP 200 ms, CLS 0,1 am 75. Perzentil (Nr. 13, web.dev). Ziel des Auftrags: mobil mindestens 90, Ziel 95. | jede Etappe über die Budgets; E4-PRUEFER-01 und folgende; E10-KUER-07 darüber hinaus |
| KT9 Sicherheitsheader und saubere Statuscodes | Bestand | `next.config.ts`: Content-Security-Policy, Strict-Transport-Security mit preload, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, `frame-ancestors 'self'`; Unbekanntes liefert 404 (`[...unbekannt]`). Für Video braucht die CSP gezielt `frame-src https://www.youtube-nocookie.com` (erhebung/E1-karte-video.md 4.3). | E8-OPUS-03 (frame-src), E9-OPUS-03 (Statuscodes) |

## Inhalt

| Hebel | Status | Beleg | Paket |
|---|---|---|---|
| KA1 offene Preise und Rechenbeispiele | teilweise | Bestand: Preise je Codelinie, Zylinder und Autoschlüssel-Leistung. Keiner der vier Wettbewerber zeigt nach der Konfiguration einen Preisrahmen mit Abschluss (WETTBEWERB.md, Lücke 1). Werte nur vom Inhaber (G9); bis dahin „Angebot“ statt eines erfundenen Preises (A-019). | E5-OPUS-01, E5-OPUS-02; Rechenbeispiele E10-KUER-05 |
| KA2 Kurzantworten | offen | Höchstens drei Sätze unter der H1, Teilfragen als Überschriften mit Antwortsatz (Auftrag 13); Teilfragen je Familie in KARTE.md. | E8-OPUS-02 |
| KA3 Informationsgewinn durch Finder, Schließplan, Messhilfe und Rechner | teilweise | Fahrzeugkatalog mit 624 Reihen und Suche (E3-OPUS-06, E3-DATENPFLEGER-01); Konfigurator-Kern mit Schließplan und Maßprüfung (A-019). Oberflächen fehlen. | E4-OPUS-05 (Finder im Autoschlüssel-Weg), E5-OPUS-01 bis -03, E5-GRAFIKER-01, E10-KUER-05 |
| KA4 Erfahrung der Werkstatt sichtbar | Inhaber | Ablauf, Maschinen, typische Fehler der Kunden und Fotos kommen aus dem Inhaber-Interview (erhebung/E1-interview.md, MENSCHEN.md); keine erfundenen Erfahrungswerte (R4). | E8-AUTOR-02 (Über uns aus Belegen), Rubrik „So läuft Ihr Auftrag ab“ (E4-OPUS-04) |
| KA5 sachliche Vergleiche wie Sperrschließung oder Schließanlage | teilweise | Laienbeispiel und Entscheidungsregel nach Berechtigungen in FACHWISSEN.md Abschnitt 1 (G-09, G-30). | E5-AUTOR-01; E10-KUER-05 |
| KA6 echte Kundenfragen | Inhaber | Belegte Formulierungen aus der Suche je Familie (KARTE.md, Stufe B); echte Fragen aus Anfragen und Gesprächen liefert der Inhaber (Interview). | E8-OPUS-02 |
| KA7 Frische nur mit Substanz | Bestand | `lastModified` nur aus echten Änderungsdaten (Sitemap). Regel für neue Seiten: Datum ändert sich nur mit inhaltlicher Änderung; keine Datumsspiele. | E8-OPUS-01 prüft nach |
| KA8 Belege mit Primärquellen | teilweise | FACHWISSEN.md und QUELLEN.md mit Faktenampel und Quelle je Aussage; Herstellerdaten von ABUS und BKS sind nur teilweise prüfbar (FACHWISSEN 10). Seit 01.10.2026 nennt Google die menschliche Prüfung KI-erzeugter Inhalte vor der Veröffentlichung entscheidend, Titel, Beschreibungen, Strukturdaten und Alt-Texte eingeschlossen (Nr. 8). Folge: REDAKTION.md bündelt alles zur Freigabe durch den Inhaber. | E8-FAKTENPRUEFER-01, REDAKTION.md |
| KA9 Medien mit Text | offen | Video hinter Datenschutz-Fassade mit Schrittanleitung und Transkript als Text (G-44); VideoObject nur auf Seiten, auf denen das Video abspielbar ist (N3). Zwei-Klick-Lösung und Hinweistext zur Prüfung in erhebung/E1-karte-video.md 4.3. | E8-OPUS-03 |

## Klick

| Hebel | Status | Beleg | Paket |
|---|---|---|---|
| KK1 Titel nach Absicht | offen | 31 von 52 Codelinien-Titeln über 60 Zeichen (LAGEBILD Befund 9). Regel: Leitanfrage möglichst in den ersten 40 Zeichen, höchstens 580 Pixel in Arial 20 px, gemessen. | E8-OPUS-02, E8-TEXTER-01 |
| KK2 Beschreibung als kleine Anzeige | offen | 120 bis 160 Zeichen mit zwei bis drei belegten Gründen und passender Handlung (Auftrag 13). | E8-OPUS-02 |
| KK3 Sprungmarken | offen | Inhaltsverzeichnis mit Ankern ab mehr als vier Abschnitten (Auftrag 13). | E8-OPUS-02 |
| KK4 gültige Rich Results | teilweise | FAQPage-Markup auf 109 Seiten, obwohl Google FAQ-Ergebnisse seit 07.05.2026 nicht mehr zeigt (Nr. 9, LAGEBILD Befund 9); doppelte WebPage-@id. Product nur mit Offer und echtem Preis, Merchant Listings nur für Kaufseiten (N2); keine Bewertungsauszeichnung für das eigene Unternehmen (N1, Auftrag 13). | E8-OPUS-01 |
| KK5 großes Bild | teilweise | Ein Standard-Teilen-Bild (`src/app/(site)/opengraph-image.tsx`) für alle Seiten; `max-image-preview:large` fehlt (KT3). Eigene Teilen-Bilder je Rubrik sind Kür. | E8-OPUS-01 (Meta-Robots), E10-KUER-04 |

## Entität und Außen

| Hebel | Status | Beleg | Paket |
|---|---|---|---|
| KE1 Entitätsgraph | teilweise | JSON-LD mit Organization, Locksmith (zulässiger Untertyp von LocalBusiness, Pflicht name und address, N1), WebSite, WebPage, BreadcrumbList, Product, Offer und einem Service. Fehlend: feste @id über alle Seiten, Service je Rubrik, Markendefinition wortgleich. | E8-OPUS-01, E8-AUTOR-02 |
| KE2 fehlende Profile | Inhaber | Google-Unternehmensprofil, Bing Places, Apple Business Connect, Verzeichnisse; sameAs nur auf echte Profile. Der Bericht zu generativer KI in der Search Console zeigt seit 03.06.2026 Impressionen für KI-Übersichten und KI-Modus (N13). | E8-DOKUMENTAR-01 (AUSSEN.md) |
| KE3 Bewertungen mit Inhalt | Inhaber | Bitte um Bewertungen ohne Anreiz und Antwortvorlagen (R5); Google hat am 24.07.2026 eine Richtlinie zu gefälschten und nicht offengelegten Anreizbewertungen ergänzt (N14, Wortlaut nicht geprüft). Keine Bewertungsauszeichnung für das eigene Unternehmen. | E8-DOKUMENTAR-01 |
| KE4 Erwähnungen über Hersteller, Innung und Presse | Inhaber | Fachhändler-Verzeichnisse von ABUS und BKS, Innung, Handwerkskammer; keine Linkspiele (R6). | E8-DOKUMENTAR-01 |
| KE5 verlinkbare Werkzeuge | teilweise | Zwischenstand des Konfigurators als Link ohne Kontaktdaten (A-019); Finder und Konfiguratoren bekommen feste, teilbare Adressen. | E5-OPUS-01, E5-OPUS-02, E4-OPUS-05 |
| KE6 agententaugliche Formulare | teilweise | Formulare mit echten Beschriftungen, Autovervollständigung und Fehlertext; Prüfung über axe und Tastatur (Z-14). | E6-OPUS-01 (Wege-Baukasten), E6-PRUEFER-01 |
| KE7 Händler-Feed und Produktdaten für Schlüssel nach Code | Kür | Product mit Offer nur bei echtem Preis; Merchant Listings verlangen Preis über null und Kaufmöglichkeit (N2). Codelinien führen noch „[Hersteller eintragen]“ (Bogen SORTIMENT). | E10-KUER-06 |

## Labor (nur Kür)

| Hebel | Status | Beleg | Paket |
|---|---|---|---|
| KL1 llms.txt aus denselben Daten | Bestand | `/llms.txt` entsteht aus Navigation und Firmendaten (`src/app/llms.txt/route.ts`), also aus denselben Daten wie die Seite (R1). Google Search ignoriert llms.txt (N8, Hinweis vom 15.06.2026); für Bing gibt es keine offizielle Aussage. | E10-KUER-06 (Gleichstand mit den neuen Rubriken) |
| KL2 WebMCP nur lesend und nur mit Token des Ursprungstests | zurückgestellt | Ohne Token eines Ursprungstests nicht baubar; das Token wäre ein Konto des Inhabers. | keins |
| KL3 Protokolle für KI-Einkauf nach aktueller Spezifikation | zurückgestellt | Die Spezifikationen wurden in E1 nicht geprüft; ein Einkaufsweg berührt Zahl- und Kontoverhalten (G9). | keins; Vorrat für einen späteren Lauf |
| KL4 Titeltests in Kohorten nach dem Livegang | zurückgestellt | Setzt den Livegang voraus (G3). Konzept mit Kohorten und Messfenster im Messplan. | MESSPLAN.md |
