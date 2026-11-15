# FA-SEO-01C · Strukturdaten, Überschriften, Indexierbarkeit je Umgebung, interne Verweise

Rolle Baumeister · Stand 2026-11-15 · ohne Datenschema, ohne `--pg`, ohne git · Anforderungen FA-25-00, FA-25-04 bis FA-25-18, FA-25-20, FA-23 (Strukturdaten), FA-27-17

## GEÄNDERTE DATEIEN

Indexierbarkeit
- `src/lib/umgebung.ts` (nur Abschnitt „Suchmaschinen“): `indexierungErlaubt()` mit Schalter `SM24_INDEXIERUNG`, neu `PRODUKTIONSDOMAIN`, `PRODUKTIONS_HOST_MUSTER`, `suchmaschinenKopfzeilen()`
- `src/lib/umgebung.test.ts`: 16 Umgebungs-Kombinationen, Host-Muster
- `src/app/robots.ts`, `src/app/robots.test.ts`: keine Komplettsperre mehr, Sitemap-Zeile nur bei erlaubter Indexierung

Strukturdaten
- `src/components/seo/json-ld.tsx`: feste Kennungen `KENNUNG` (Organisation, Website, Betrieb), Betriebs-Graph ohne Startseiten-Webseite, `Service` in `pageGraphSchema`, Seiten-Graphen ohne erneute Definition von Organisation/Website, Anbieter und Herausgeber nur per `@id`, Brotkrumen ohne doppelte Startseite. `productSchema` (Product/Offer) unverändert.
- `src/components/seo/json-ld.test.ts`: 7 neue Tests
- `src/components/seo/seiten-daten.tsx` (neu): `SeitenDaten`, `LeistungsArtikel`, `KlassenSeitenDaten`
- `src/app/(site)/layout.tsx`: Betriebs-Graph einmal je Seite (nur Strukturdaten)
- `src/app/(site)/page.tsx`: Startseite nur noch Webseite, Betrieb kommt aus dem Layout
- Brotkrumen als BreadcrumbList, wo sichtbare Brotkrumen ohne Strukturdaten standen (Krumen in eine Konstante gezogen, Text unverändert): `autoschluessel/anfrage`, `autoschluessel/gehaeuse/anfrage`, `autoschluessel/marken`, `beratung`, `elektronische-zutrittsloesungen/konfigurator`, `gleichschliessende-zylinder/konfigurator`, `motorradschluessel/anfrage`, `ratgeber`, `schliessanlagen/konfigurator`, `schliessanlagen/konfigurator/schliessplan`, `schluessel-einschicken/anmelden`, `schluessel-nach-vorlage/anfrage`, `service-und-termin/{anfrage,kontakt,terminstatus,vor-ort}`, `sicherheitstechnik/sicherheitscheck`, `standorte` (je `page.tsx` unter `src/app/(site)`)
- Leistungsseiten mit `Service` (Bezeichnung = Überschrift, Beschreibung = sichtbarer Kurztext im Kopf; wo der Kurztext ein mehrzeiliger Ausdruck war, steht er jetzt in der Konstante `kurztext`, Wortlaut unverändert): `autoschluessel`, `autoschluessel/gehaeuse`, `motorradschluessel`, `gleichschliessende-zylinder`, `schliessanlagen`, `elektronische-zutrittsloesungen`, `tuer-und-schliesstechnik`, `tuer-und-schliesstechnik/[slug]`, `sicherheitstechnik`, `sicherheitstechnik/[slug]`, `schluessel-nach-vorlage`, `schluessel-einschicken`
- Autoschlüssel-Leistungen über `LeistungsArtikel` (Service, Brotkrumen, sichtbare FAQ; vorher gar keine Strukturdaten): `autoschluessel/{nachmachen,programmieren,kopieren,funkschluessel,smart-key,schluesselbart-fraesen,fahrzeugoeffnung}`
- Fahrzeugklassen über `KlassenSeitenDaten`: `e-scooter`, `fahrradschluessel`, `seniorenmobile`, `roller-und-kleinstfahrzeuge` (je Einstieg und `anfrage`), `autoschluessel/fahrzeug-nicht-gefunden`

Interne Verweise
- `src/components/seo/verweise.ts` (neu): Verweisliste aus `seo.internalLinks` samt Gegenrichtung
- `src/components/seo/passt-dazu.tsx` (neu): Block „Passt dazu“ (h2)
- `src/components/seo/verweise.test.ts` (neu, 4 Tests), `src/components/seo/waisen.test.ts` (neu, 2 Tests: Waisen-Melder und Selbsttest)
- „Passt dazu“ eingesetzt auf Seiten ohne Linkblock: `autoschluessel` (ohne die Ziele, die die Seite schon zeigt), `autoschluessel/gehaeuse`, `motorradschluessel`, `tuer-und-schliesstechnik`, `schluessel-einschicken`, die vier Einstiegsseiten der Fahrzeugklassen
- Inhalte (`content/*.json`) nicht geändert: die vorhandenen `seo.internalLinks` reichen, die Gegenrichtung entsteht im Code.

Bericht: `_werkstatt/ausbau/berichte/FA-SEO-01C.md`

## WAS UND WARUM

1. Indexierbarkeit je Umgebung (FA-25-20). Es gibt eine Stelle, die entscheidet: `indexierungErlaubt()` in `src/lib/umgebung.ts`. Root-Layout (Meta `robots`), robots.txt (Sitemap-Zeile) und `suchmaschinenKopfzeilen()` (Kopfzeile) fragen nur dort.
   - Die Lücke „Produktionsbetrieb außerhalb von Vercel“ ist zu: Ein Produktionsbuild auf einem eigenen Server (`NODE_ENV=production` ohne `VERCEL`) steht jetzt auf noindex, bis `SM24_INDEXIERUNG=an` ausdrücklich gesetzt ist.
   - `SM24_INDEXIERUNG=aus` sperrt überall, auch auf Vercel (Notbremse).
   - Vorschau, Vercel-Entwicklung und Schaufenster bleiben auf noindex, auch mit `SM24_INDEXIERUNG=an`. Der heutige Zustand der Produktion (Schaufenster, A-042) ändert sich dadurch nicht.
   - robots.txt sperrt in keiner Umgebung mehr alles. Laut Google sieht eine Suchmaschine das noindex nur, wenn sie die Seite abrufen darf (FA-RECHERCHE-05, Abschnitt 4). Gesperrt bleiben überall `/admin`, `/api/`, `/kasse`, `/warenkorb` und `/bestellung`. Die Sitemap-Zeile steht nur dort, wo indexiert werden darf.
   - `suchmaschinenKopfzeilen()` liefert die Regel für `X-Robots-Tag: noindex, nofollow`. Ist die Indexierung nicht erlaubt, gilt sie für jede Adresse. Ist sie erlaubt, gilt sie für jede Adresse außer `schluesselmacher24.de` und `www.schluesselmacher24.de`, also auch für die `*.vercel.app`-Adressen desselben Builds.
   - Einbinden kann ich die Regel nicht: `next.config.ts` liegt außerhalb meiner Schreibrechte (siehe FÜR MENSCHEN). Bis dahin wirkt die Meta-Angabe aus dem Layout.
2. Strukturdaten (FA-25-08 bis FA-25-12, FA-23, R8).
   - Betrieb: Organisation, Website und Locksmith (Anschrift, Telefon, Kontaktpunkt rund um die Uhr aus `erreichbarkeit(settings)`, keine Öffnungszeiten) stehen einmal je Seite im Root-Layout, unter festen Kennungen. Gedeckt sind sie durch den Fuß, der auf jeder Seite Anschrift, Telefon und Erreichbarkeit zeigt.
   - Alle Seiten-Graphen verweisen nur per `@id` darauf. Organisation und Website werden nicht mehr je Seite neu definiert, und Anbieter, Herausgeber und Verkäufer (Ort, Ratgeber) nennen keinen fest eingetragenen Firmennamen mehr. Tests prüfen für Inhaltsseiten (`pageGraphSchema`), Ratgeber, Ortsseiten und Codelinien (jeweils mit dem Layout), dass keine Kennung doppelt definiert ist (Nachbesserung, Befunde 3 und 10).
   - Leistungsseiten tragen `Service` mit Anbieter = Betrieb, Bezeichnung = Überschrift und Beschreibung = sichtbarer Kurztext. Ein Gebiet (`areaServed: Deutschland`) trägt nach der Nachbesserung nur die Einsendung, deren Seite es sichtbar nennt. Die sieben Autoschlüssel-Leistungsseiten, die bisher gar keine Strukturdaten hatten, haben jetzt Service, Brotkrumen und die sichtbaren Fragen.
   - Brotkrumen: Jede Seite unter der Startseite, die sichtbare Brotkrumen zeigt, trägt jetzt auch eine BreadcrumbList. Das sind 18 Seiten mehr, dazu die Fahrzeugklassen und die Autoschlüssel-Leistungen.
   - Ratgeber bleiben `Article`.
   - FAQPage: Alle Stellen habe ich gegen R8 geprüft, elf Seitenvorlagen und die sieben Autoschlüssel-Leistungen über `LeistungsArtikel`. Jede gibt dieselbe Liste aus, die die Seite im Akkordeon `Accordion` zeigt; die Antworten stehen im Dokument, nur zugeklappt. Keine Stelle ist ungedeckt, deshalb habe ich keine entfernt.
   - `Product` und `Offer` sind unberührt (FA-SHOP-01B).
3. Überschriften (FA-25-04). Der Bericht `FA-SEO-02-onpage.md` meldet keine Befunde zu Überschriften (130 Seiten, nur Titel- und Beschreibungslängen). Die neuen Seiten habe ich am Code geprüft:
   - Fahrzeugklassen: h1 im Seitenkopf, h2 je Abschnitt, h3 nur darunter.
   - „Fahrzeug nicht gefunden“: h1, die Formularschritte als h2 (`FlowShell`), Fragen als `legend`.
   - `/auftrag-bestaetigen/[id]`: nur eine h1, der Hinweis ist ein Absatz.
   - Neu von mir: „Passt dazu“ als h2.
   Keine übersprungene Ebene, nichts zu beheben.
4. Interne Verweise (FA-25-16 bis FA-25-18). Es gibt kein zweites System: `seo.internalLinks` bleibt die gepflegte Quelle, im Admin wie in den Rückfällen. `verweise.ts` bildet daraus die Gegenrichtung:
   - Ratgeber → Leistung ergibt Leistung → Ratgeber.
   - Veröffentlichte Ortsseiten → angebotene Bereiche (`servicesOffered`) ergibt Leistung → Ort, nur ohne Platzhalter und ohne noindex.
   - Partner werden → Autoschlüssel ergibt Autoschlüssel → Partner werden.
   - Fahrzeugklasse → Autoschlüssel wird jetzt sichtbar: Die Einstiegsseiten zeigten ihre gepflegten Links bisher nicht.
   Zur Auswahl:
   - Anker sind die sichtbaren Überschriften der Quellseiten, keine Suchbegriffe (R6). Am Fuß ist nichts geändert.
   - Formularschritte und eigene Unterseiten zählen nicht als Gegenrichtung; die Bereichsseite listet sie ohnehin.
   - Höchstens sechs Einträge. Seiten mit handgesetztem Linkblock behalten ihn; die Autoschlüssel-Leistungen bekommen die Gegenrichtung in ihren vorhandenen Block „Passend dazu“, höchstens drei Einträge.
   - Marke ↔ Modell und Modell → Leistung waren schon da (Markenseite listet Modelle, Modellseite verlinkt Marke, Geschwister und Leistungen).
   Der Waisen-Melder (`waisen.test.ts`) prüft jede Adresse der Sitemap: Mindestens ein Verweis muss von einer anderen Seite kommen, eigene Brotkrume und canonical zählen nicht. Ergebnis: keine Waisen.
5. Leistung der Seite: Ich habe nichts gemessen (kein Server). Am Code ist bereits umgesetzt: CSS im Kopf (`inlineCss`), nur Plex Sans vorgeladen, Mono und Erweiterungen nicht, Bilder mit `sizes`, Zeichnungen starten erst nach dem Hydrieren. Eindeutig behebbar ohne Umbau war nichts. Mein eigener Beitrag zum ersten Laden:
   - etwa 1 bis 1,5 KB JSON-LD je Seite für den Betrieb;
   - „Passt dazu“ ohne Client-Code;
   - die vier Sammlungen für die Verweisliste werden je Anfrage einmal gelesen (`cache`).
   Vorschläge im Abschnitt OFFENE FRAGEN.

## PRÜFUNG UND ERGEBNIS

Alle drei Prüfungen liefen über die Datenweiche `_werkstatt/ausbau/werkzeuge/sicher.sh`:
- `--json -- npx vitest run`: 207 Testdateien, 3131 Tests, alle grün (37 s).
- `-- npm run typecheck` (`tsc --noEmit`): ohne Fehler.
- `-- npm run lint` (`eslint .`): ohne Befund.

Kein Build, kein Server, kein `--pg`, kein git.

Im Arbeitsbaum ändern gleichzeitig andere Pakete `src/app/sitemap.ts`, `sitemap.test.ts` und `fahrzeug-anfrage/seiten.test.tsx`. Der Lauf schloss sie ein und war grün.

## BELEGE

- Schalter: `src/lib/umgebung.ts`, `indexierungErlaubt()` und `suchmaschinenKopfzeilen()`; Tests `src/lib/umgebung.test.ts`, Block „Suchmaschinen“: 16 Kombinationen aus Ort × Umgebung × Datenbank × Schalter.
- robots.txt ohne Komplettsperre: `src/app/robots.test.ts`, Test „sperrt in keiner Umgebung die ganze Seite“.
- Eine Kennung je Seite: `json-ld.test.ts`, Test „auf einer Seite kommt jede Kennung nur einmal als Definition vor“.
- Einbindung im Layout statt auf der Startseite: `json-ld.test.ts`, Block „Einbindung“.
- FAQ gedeckt: `faq:` und `<Accordion items=…>` lesen in jeder Datei dieselbe Liste, zum Beispiel `schliessanlagen/page.tsx` (`faq`), `tuer-und-schliesstechnik/page.tsx` (`EXPERT_FAQ`) und `service-article.tsx` (`faqItems`, in `LeistungsArtikel` nachgebildet).
- Keine Waisen: `src/components/seo/waisen.test.ts`. Der Selbsttest meldet eine nur von sich selbst verlinkte Adresse als Waise.

## OFFENE FRAGEN

1. OFFENE FRAGE: Der Kopfzeilen-Schalter wirkt erst nach einer Zeile in `next.config.ts`, die außerhalb meiner Schreibrechte liegt. Bitte durch den Orchestrator oder ein Paket mit Schreibrecht einbauen:
   ```ts
   import { suchmaschinenKopfzeilen } from './src/lib/umgebung';
   // in headers():
   return [{ source: '/(.*)', headers: securityHeaders }, ...suchmaschinenKopfzeilen()];
   ```
   `umgebung.ts` hat bewusst keine Importe und wird schon von der Payload-Konfiguration geladen.
2. OFFENE FRAGE: Gebiet der Leistungen. Gesetzt ist überall „Deutschland“, wie am Kontaktpunkt. Werkstattleistungen (Autoschlüssel) setzen einen Termin in Wetzlar voraus; Kundinnen und Kunden aus ganz Deutschland können kommen, das sagt die Seite auch („auch wenn Sie von weiter her anreisen“). Soll das Gebiet je Leistung enger gefasst werden, gehört das in den Inhaber-Wortlaut.
3. OFFENE FRAGE: Die Rechtsseiten zeigen keine sichtbaren Brotkrumen, deshalb tragen sie auch keine BreadcrumbList. Sie stehen bis auf `/rechtliches/versand-und-zahlung` auf noindex. Ob dort Brotkrumen erscheinen sollen, ist eine Gestaltungsfrage; G9 lässt den Rechtstext unberührt. Ebenso ohne Brotkrumen: Kasse, Warenkorb, Bestellung, Auftrag bestätigen (alle noindex).
4. Wunsch an FA-KERN-05 (`src/app/sitemap.ts`, nicht von mir geändert): Die Sitemap könnte außerhalb erlaubter Indexierung leer bleiben (`indexierungErlaubt()`); robots.txt nennt sie dort ohnehin nicht mehr. Nötig ist das nicht, nur sauberer.
5. Vorschläge zur Leistung, ungemessen:
   - Den Betriebs-Graphen im Layout auf die Knoten beschränken, die eine Seite braucht, falls die HTML-Größe bei Seobility auffällt.
   - Auf der Startseite prüfen, ob `Eingangsinszenierung` und `FraesbahnBewegung` im ersten Bündel nötig sind, gemessen am Produktionsserver (FA-25-13/15).

## FÜR MENSCHEN

- Welcher Schalter die Produktion indexierbar macht:
  - Auf Vercel endet das Schaufenster, sobald `DATABASE_URL` oder `POSTGRES_URL` in der Produktionsumgebung gesetzt ist und `SM24_DATA` nicht `json` ist. Danach in `scripts/schaufenster.json` `"aktiv": false` eintragen (docs/LIVEGANG.md, Abschnitte 2 und 5). Dann ist die Seite unter `schluesselmacher24.de` indexierbar, ohne weiteren Schalter.
  - `SM24_INDEXIERUNG` darf dort nicht `aus` sein.
  - Auf einem eigenen Server außerhalb von Vercel zusätzlich `SM24_INDEXIERUNG=an`.
  - Mein Code hebt den heutigen noindex-Zustand (A-042) nicht auf.
- Prüfwerkzeuge: Der lokale Produktionsserver (`werkzeuge/server.sh`) läuft außerhalb von Vercel und steht jetzt auf noindex. `onpage.mjs` würde deshalb auf jeder Seite der Sitemap „noindex“ rot melden.
  - Für Messläufe den Server mit `SM24_INDEXIERUNG=an` starten (Änderung an `server.sh`, nicht meine Schreibrechte).
  - Sobald die Kopfzeile aus Frage 1 eingebaut ist, trägt `localhost` zusätzlich `X-Robots-Tag: noindex`, weil es nicht die Produktionsdomain ist. Die Werkzeuge müssen diese Kopfzeile dann für `localhost` übergehen oder mit dem Host der Produktion anfragen.
- docs/LIVEGANG.md um den Schalter `SM24_INDEXIERUNG` ergänzen (Notbremse `aus`, eigener Server `an`). Das Dokument liegt außerhalb meiner Schreibrechte.
- Passwort- oder IP-Schutz für Vorschauen (FA-RECHERCHE-05, „Braucht Mensch“) bleibt Menschensache (G3).
- Nach dem Livegang: Rich-Results-Test und Search Console für Locksmith, Service, BreadcrumbList, Article und FAQPage.

## NACHBESSERUNG (Gegenprüfung, 14 Befunde)

Stand nach der Nachbesserung: FA-25-20 (Staging nicht indexieren) ist **teilweise** erfüllt. Die Meta-Angabe und robots.txt wirken. Die Kopfzeile `X-Robots-Tag` wirkt erst, wenn `next.config.ts` sie einbindet; das liegt außerhalb meiner Schreibrechte. Alles andere ist behoben.

1. [rot] Kopfzeile nicht eingebunden (`umgebung.ts:132`). **Trifft zu, in meinen Schreibrechten nicht behebbar.** `next.config.ts` gehört nicht zu den Schreibrechten der Paketdatei. Übergabe an den Orchestrator, fertig zum Einbauen:
   ```ts
   // next.config.ts
   import { suchmaschinenKopfzeilen } from './src/lib/umgebung';
   // in headers():
   return [{ source: '/(.*)', headers: securityHeaders }, ...suchmaschinenKopfzeilen()];
   ```
   Dazu der Test (zum Beispiel `src/app/kopfzeilen.test.ts`). Er ist hier nicht angelegt, weil er ohne die Zeile rot wäre:
   ```ts
   vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('VERCEL', '1'); vi.stubEnv('VERCEL_ENV', 'preview');
   const { default: config } = await import('../../next.config');
   const regeln = await config.headers!();
   expect(regeln.some((r) => r.headers.some((h) => h.key === 'X-Robots-Tag' && /noindex/.test(h.value)))).toBe(true);
   ```
   Bis dahin gilt FA-25-20 als teilweise erfüllt. Die Meta-Angabe sperrt Vorschau, Schaufenster und eigene Server ohne Schalter. Die `*.vercel.app`-Adressen der späteren Produktion schützt erst die Kopfzeile.
2. [rot] `areaServed: Deutschland` an jeder Leistung. **Behoben.** `LeistungsAngabe` hat jetzt ein Feld `bundesweit`, und nur damit entsteht ein Gebiet. Gesetzt ist es allein auf `/schluessel-einschicken`, wo es sichtbar steht („Sie schicken aus ganz Deutschland“). Werkstatt- und Vor-Ort-Leistungen tragen kein Gebiet, auch Fahrzeugöffnung, Fahrzeugklassen und `LeistungsArtikel`. Die Ortsseite behält ihr Gebiet „City“, das sichtbar ist. Tests in `json-ld.test.ts`: „ein Leistungsgebiet steht nur, wo die Seite es sichtbar nennt“ und „Fahrzeugöffnung … tragen kein Gebiet Deutschland; nur die Einsendung“. Der zweite durchsucht alle Seitenvorlagen nach `bundesweit: true`.
3. [rot] Doppelte Kennungen in `productSchema` und auf Ratgeber, Ort und Codelinie. **Behoben.**
   - Aus `productSchema` sind die Stummel für Organisation und Website entfernt; die Webseite verweist per `KENNUNG`. Product und Offer sind unverändert.
   - `breadcrumbSchema` und `faqSchema` definieren keine Webseite mehr, sondern nur ihre Liste beziehungsweise FAQPage mit Verweis auf `…/#webpage`.
   - `articleSchema(guide, crumbs)` und `serviceAreaSchema(city, crumbs)` bauen je einen Graphen mit einer Webseite samt `breadcrumb` und BreadcrumbList. `ratgeber/[slug]` und `standorte/[city]` rufen nur noch diese Funktionen auf.
   - Auf der Codelinie bleiben drei Skripte. Die Webseite steht nur einmal darin (aus `productSchema`), und die Seitendatei bleibt unverändert (FA-SHOP-01B).
   - Neue Tests: Ratgeber, Ortsseite und Codelinie, jeweils mit dem Layout-Graphen, haben jede Kennung nur einmal und genau eine WebPage. Ein Quelltext-Test sichert, dass Ratgeber und Ortsseite kein `breadcrumbSchema` mehr nutzen.
4. [rot] Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik verweisen nicht auf Wetzlar. **Behoben.**
   - Neu ist `gegenrichtung(pfad, { ausser, max })` in `verweise.ts`.
   - Die drei Seiten hängen die Gegenrichtung an ihren vorhandenen Linkblock an, ohne die Ziele, die der Block schon zeigt: „Passend dazu“, „Passende Bereiche“ und die Redaktionsliste unter „Passende Seiten“. Einträge ohne Begleittext zeigen keinen erfundenen Text.
   - `verweisQuellen()` stellt veröffentlichte Ortsseiten jetzt vor die Ratgeber. Sonst könnte die Höchstzahl die Ortsseite verdrängen.
   - Neuer Test in `verweise.test.ts` mit den echten Inhalten: Jede Leistung aus `servicesOffered` jeder veröffentlichten Ortsseite zeigt einen Link auf diese Ortsseite. Gerechnet wird vorsichtig, ohne `ausser`.
5. [rot] Lokaler Prüfserver auf noindex, `onpage.mjs` unbrauchbar. **Trifft zu. Im Code behoben, soweit meine Rechte reichen; der Rest geht als Übergabe an den Orchestrator.** `server.sh` und `onpage.mjs` gehören nicht zu meinen Schreibrechten. Die Prüfung habe ich nicht gelockert (G8).
   - Im Code: Ist die Indexierung erlaubt, nimmt die Kopfzeilen-Regel neben der Produktionsdomain auch `localhost` und `127.0.0.1` aus (`OHNE_NOINDEX_HOST_MUSTER`). Keine Suchmaschine erreicht diese Adressen. So sieht ein lokal mit dem Schalter gebauter Server aus wie die Produktion, auch nachdem Befund 1 eingebaut ist. Tests in `umgebung.test.ts`: `127.0.0.10`, `localhost.example.com` und `*.vercel.app` bleiben gesperrt.
   - Übergabe: Für Messläufe `SM24_INDEXIERUNG=an sicher.sh --json -- npm run build` bauen. In `server.sh` beim Start `SM24_INDEXIERUNG=an` vor den `sicher.sh`-Aufruf setzen. Die Datenweiche reicht die Variable durch, sie steht nicht in `LEEREN`.
6. [gelb] Schalter wirkt beim Build. **Behoben (Doku).** Hinweise stehen in `indexierungErlaubt()`, `suchmaschinenKopfzeilen()` und `robots.ts`: robots.txt, die Meta-Angabe statischer Seiten und die Kopfzeilen-Regel entstehen beim Build. Korrektur zu FÜR MENSCHEN oben: `SM24_INDEXIERUNG` muss beim **Build** gesetzt sein, und jede Änderung, auch die Notbremse `aus`, braucht einen neuen Build oder ein neues Deployment. So gehört es auch in `docs/LIVEGANG.md`.
7. [gelb] Kopfkommentar des Waisen-Melders falsch, Inhalte zu großzügig gezählt. **Behoben.** Der Kommentar sagt jetzt, was gezählt wird. Die Gegenrichtung prüft `verweise.test.ts`. Hrefs aus `content/*.json` zählen nur aus Einträgen, die eine indexierbare Seite sind (nicht `active: false`, nicht `seo.noindex`, Ortsseiten nur veröffentlicht) und nicht auf sich selbst.
8. [gelb] Fahrzeugklassen bei pausierter Rubrik. **Behoben.** `KlassenSeitenDaten` fragt `rubrikLive(klasse)` ab. Ist die Rubrik pausiert, hat die Einstiegsseite keinen `Service`, und die Anfrageseite beschreibt sich mit `RUBRIK_PAUSIERT_LEAD`, wie ihr Kopf.
9. [rot] Wie Befund 1 (gleicher Sachverhalt). **Trifft zu, Übergabe wie dort.** Im Plan ist FA-25-20 bis zum Einbau als teilweise erfüllt zu führen.
10. [gelb] `breadcrumbSchema` definiert eine zweite Webseite. **Behoben mit Befund 3**, samt Tests für Artikel plus Brotkrumen und Ort plus Brotkrumen. Die Aussage im Bericht oben ist auf die geprüften Vorlagen eingeschränkt.
11. [gelb] Wie Befund 8. **Behoben**, siehe dort.
12. [gelb] Waisen-Melder zählt jede Pfad-Zeichenkette. **Behoben.**
   - Gezählt wird nur noch im Link-Zusammenhang: `href=`/`href:`/`…Href:`, eine Konstante `const X = '/…'`, die dieselbe Datei als `href` nutzt, und die als Link gerenderten Datenfelder in `anfrage-klassen.ts` (`einstieg`, `anfrage`) und `partner/gewinnung.ts` (`pfad`). Listen wie `AUF_DER_SEITE` zählen nicht mehr.
   - Neuer Negativtest mit erfundenen Quelltexten und Inhalten: Ein Pfad nur in einer Ausschlussliste, nur als Objektfeld, nur als ungenutzte Konstante, nur aus einem abgeschalteten, einem noindex- oder dem eigenen Eintrag gilt als Waise.
   - Die echte Sitemap hat weiter keine Waisen.
13. [gelb] `vi.unstubAllEnvs()` am Testende. **Behoben** mit `afterEach(() => vi.unstubAllEnvs())` in `waisen.test.ts` und im neuen Block von `verweise.test.ts`.
14. [gelb] `/llms.txt` und `/sitemap.xml` ohne noindex in Vorschauen. **Trifft zu; die Lösung ist Befund 1.** Die Kopfzeilen-Regel gilt für `/:path*`, also auch für Nicht-HTML-Ausgaben. Wunsch an das Paket, dem `src/app/llms.txt/route.ts` gehört, falls die Zeile in `next.config.ts` länger ausbleibt: bei `!indexierungErlaubt()` `X-Robots-Tag: noindex` setzen.

Geänderte Dateien der Nachbesserung:
- `src/components/seo/json-ld.tsx`
- `src/components/seo/json-ld.test.ts`
- `src/components/seo/seiten-daten.tsx`
- `src/components/seo/verweise.ts`
- `src/components/seo/verweise.test.ts`
- `src/components/seo/waisen.test.ts`
- `src/lib/umgebung.ts` (nur Suchmaschinen)
- `src/lib/umgebung.test.ts`
- `src/app/robots.ts` (Kommentar)
- `src/app/(site)/ratgeber/[slug]/page.tsx`, `src/app/(site)/standorte/[city]/page.tsx` (ein Graph statt zwei)
- `src/app/(site)/schluessel-einschicken/page.tsx` (`bundesweit`)
- `src/app/(site)/schliessanlagen/page.tsx`, `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`, `src/app/(site)/sicherheitstechnik/page.tsx` (Gegenrichtung im vorhandenen Linkblock)

Prüfung nach der Nachbesserung, über die Datenweiche:
- `--json -- npx vitest run`: 209 Testdateien, 3169 Tests, alle grün.
- `-- npm run lint`: ohne Befund.
- `-- npm run typecheck`: drei Fehler, alle in `src/payload/shop-grundlage.db.test.ts`. Die Datei ist neu, ungetrackt und gehört dem gleichzeitig laufenden Shop-Paket, nicht diesem. In meinen Dateien gibt es keinen Typfehler.

=== ENDE FA-SEO-01C · BEREIT ZUR RÜCKGABE ===

## ABNAHME (Orchestrator, 15.11.2026)

- **Kopfzeile eingebunden** (Befunde 1, 9, 14): `next.config.ts` hängt `suchmaschinenKopfzeilen()` an `headers()`. Mit dem Lader von Next geprüft (ohne Build): Ohne Schalter gilt `X-Robots-Tag: noindex, nofollow` für jede Adresse; im Produktionsmodus mit erlaubter Indexierung sind nur `schluesselmacher24.de`, `www.schluesselmacher24.de` und die eigene Maschine ausgenommen. Neuer Test `src/app/kopfzeilen.test.ts` (4 Fälle: Vorschau, eigener Server ohne Schalter, erlaubte Indexierung mit Gegenproben für ähnliche Hosts, Sicherheitskopfzeilen bleiben). FA-25-20 ist damit erfüllt.
- **Messung bildet die Produktion ab** (Befund 5): Der Prüfbuild in `werkzeuge/abnahme.sh` und der Prüfserver in `werkzeuge/server.sh` setzen `SM24_INDEXIERUNG=an`. Das Werkzeug `onpage.mjs` bleibt unverändert (G8). Die Ausnahme für `localhost` und `127.0.0.1` bleibt: Diese Adressen erreicht keine Suchmaschine.
- **Dokumentiert:** `docs/LIVEGANG.md` (wann die Seite in Suchmaschinen erscheinen darf, Schalter, Wirkung beim Build) und `.env.example` (`SM24_INDEXIERUNG`, leer).
- **Typfehler im Schlusslauf:** drei Fehler in `src/payload/shop-grundlage.db.test.ts` gehören zum gleichzeitig laufenden FA-SHOP-01, nicht zu diesem Paket.
- Build, Onpage-Messung und Sichtprobe folgen mit der Abnahme von FA-SHOP-01, weil ein Build während dessen Umbau scheitern kann.
- **Offen:** Die Codelinien-Seite trägt weiter drei Skripte für Strukturdaten (Auftrag an FA-SHOP-01B). Rechtsseiten, Kasse, Warenkorb und Vorgangsseite haben keine sichtbaren Brotkrumen und deshalb keine `BreadcrumbList`; das bleibt so (R8).
- **Nachtrag 15.11.2026 23:24:** Volle Prüfkette über den gemeinsamen Stand grün (Unit 3.175, DB 128, Build 177/177), Onpage-Messung 134 Seiten ohne Befund; Einzelheiten in `berichte/FA-SHOP-01.md`, Abschnitt ABNAHME.
