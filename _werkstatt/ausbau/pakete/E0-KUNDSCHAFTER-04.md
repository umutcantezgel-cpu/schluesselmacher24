# E0-KUNDSCHAFTER-04 · Inhalte, Seiten, Metadaten und Index-Steuerung

## 1. Kopfzeile
Kennung E0-KUNDSCHAFTER-04 · Rolle Kundschafter · Modell Haiku 5.5 · Stufe 1 · Kern 2.0-Entwurf · Kostenklasse M · Anforderungen: Auftrag 13, 14, Z-16, R1 bis R3, R8 · Schreibrechte: _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-04-inhalte.md, _werkstatt/ausbau/erhebung/E0-routen.tsv · Umfang: siehe Schritte

## 2. Rollenbriefing
Kundschafter: erfasst einen Bereich vollständig mit Datei- und Zeilenangaben. Fehler, die du vermeidest: zusammenfassen statt auflisten; Vermutung als Befund; Teile außerhalb der Navigation übersehen.
Lies zuerst _werkstatt/ausbau/pakete/_GEMEINSAM.md und halte dich daran. Du änderst KEINE Projektdatei; du liest nur und schreibst ausschließlich die Dateien deiner Schreibrechte.

## 4. Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist der Online-Auftritt einer echten Schlüsselwerkstatt in Wetzlar mit Fertigung, Beratung und Außendienst, mit Schwerpunkt Wetzlar und Hessen und bestellbar in ganz Deutschland. Kundinnen und Kunden bestellen Autoschlüssel mit Anzahlung, Schlüssel nach Code, nach Foto oder per Einsendung, gleichschließende Zylinder und Schließanlagen über Konfiguratoren, oder sie schicken eine vollständige Anfrage. Technisch ist es Next.js 16 mit React 19, TypeScript strikt, Tailwind 3.4 und Payload 3.90 auf Postgres mit Stripe, Resend und S3-Ablage; ohne Datenbank liest die Seite content/*.json. Dieser Lauf baut den Bestand aus: ein Hub „Wobei können wir Ihnen helfen?“ im ersten Bildschirm, Rubriken aus Daten, ein Abschluss für alle Wege und neue Wege für Fahrzeuge, Einsenden, Konfiguratoren, Partner und Karte. Maßstab sind Laien ohne Geduld, offene Preise, Ehrlichkeit über Prüfungen, Berechtigungsnachweise, die nie geschwächt werden, und ein Bestand, von dem nichts verloren geht.

## 3. Aufgabe in einem Satz
Erfasse alle Seitentypen, Routen, Metadaten-Muster, Strukturdaten, Sitemap, robots und die Index-Steuerung des Bestands vollständig mit Datei- und Zeilenangaben.

## 5. Kern-Auszug (unveränderlich)
Rote Linien R1 bis R3 und R8 (AUFTRAG.md Abschnitt 6): eine Fassung für Menschen und Bots, keine Brückenseiten, keine Massenware, Strukturdaten nur für Sichtbares. Die vorhandene Index-Steuerung entscheidet heute, welche Vorlagenseiten indexiert werden.

## 6. Maßstab
/home/user/schluesselmacher24/src/app/** (page.tsx, layout.tsx, sitemap.ts, robots.ts, opengraph-image, generateMetadata, generateStaticParams), src/lib/** (seo, metadata, json-ld, index), content/*.json, scripts/textgleichheit.mjs.

## 7. Grenzen
Nur lesen.

## 8. Schritte
1. Routen: Schreibe nach _werkstatt/ausbau/erhebung/E0-routen.tsv je page.tsx eine Zeile mit den Spalten: Pfadmuster · Datei · statisch oder dynamisch · Quelle der Parameter (generateStaticParams aus welcher Datei/Daten, mit Zahl der Einträge, die du aus content/*.json zählst) · Titel-Muster (aus generateMetadata oder metadata, wörtlich) · Beschreibung-Muster · robots/noindex-Regel · JSON-LD-Typen. Kopfzeile mit Spaltennamen.
2. Index-Steuerung: Wo wird entschieden, ob eine Seite indexiert wird (Datei:Zeile, Funktion, Regel)? Welche Seitentypen sind heute noindex, welche indexierbar, nach welcher Regel (z. B. eigene Substanz)?
3. Sitemap und robots: Dateien, Regeln, welche Seiten in der Sitemap stehen, lastmod-Quelle, Bild- oder Video-Sitemap ja/nein.
4. Strukturdaten: Liste jedes JSON-LD-Typs (WebSite, Organization, LocalBusiness/Locksmith, Service, Product, Offer, BreadcrumbList, FAQPage, Article, VideoObject) mit erzeugender Datei:Zeile und den Seiten, auf denen er erscheint; gibt es feste @id? Gibt es Bewertungsauszeichnung (AggregateRating, Review)?
5. Metadaten-Muster: Titelvorlage (template), Markenzusatz, og- und twitter-Angaben, Teilen-Bilder (opengraph-image), canonical-Regel, Meta-Robots (max-image-preview, max-snippet).
6. Inhalte: Liste jede Datei in content/ mit Zahl der Einträge und Zweck; Ratgeber-Artikel (Zahl, Titel), Einsatzgebiete und Städte (Zahl, Namen, ob indexiert), Hersteller- und Modellseiten (Zahl, ob indexiert).
7. Textgleichheit: Was prüft scripts/textgleichheit.mjs, wie wird es aufgerufen, welche Schwelle?
8. Markendefinition: Gibt es einen Satz, der das Unternehmen definiert und wiederkehrt (Start, Über uns, Fuß, Strukturdaten)? Zitiere ihn mit Fundstellen.
9. Agenturnennung: Gibt es im Fußbereich schon eine Nennung einer Agentur oder einen creator im WebSite-Knoten?
10. Zähle die Seiten, die heute indexierbar wären, und die noindex-Seiten (aus deinen Zeilen in E0-routen.tsv), getrennt nach Seitentyp.

## 9. Selbstprüfung
Zahl der page.tsx gleich Zahl der Zeilen in E0-routen.tsv (ohne Kopf); jede Angabe mit Datei:Zeile.

## 10. Ausgabe
Bericht nach _werkstatt/ausbau/berichte/E0-KUNDSCHAFTER-04-inhalte.md (höchstens 1.500 Wörter), Routen nach _werkstatt/ausbau/erhebung/E0-routen.tsv.

## 11. Letzte Zeile
=== ENDE E0-KUNDSCHAFTER-04 · BEREIT ZUR RÜCKGABE ===
