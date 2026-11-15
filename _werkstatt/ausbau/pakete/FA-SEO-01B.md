# FA-SEO-01B · Titel und Beschreibungen der übrigen Seiten in den Längen: Marken und Modelle, Ratgeber, Standorte, Service-Seiten, Fahrzeugklassen, Partnerseiten; Rückfall der Ratgeber (Teil 2 von FA-SEO-01, ohne Datenschema)

Kopf: Etappe FA Priorität 6 · Rolle Texter · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema, kein `--pg` · Anforderungen FA-25-02, FA-25-03, FA-25-19, FA-25-20, FA-23 (Metadaten) · Messung: `berichte/FA-SEO-02-onpage.md` (Stand nach FA-KERN-02: 130 Seiten, keine unter 95; gelb: Titel auf 74 und Beschreibungen auf 24 Seiten, davon 61 Marken- und Modellseiten, 8 Ratgeber, Rest einzeln).

## Auftrag
Es gelten vollständig die Regeln aus `_werkstatt/ausbau/pakete/FA-SEO-01A.md` (Punkte 1 bis 4 unter „So bauen“: Zählweise wie `onpage.mjs`, Titel samt Marke höchstens 580 px in 20px Arial und höchstens 60 Zeichen, Beschreibung 120 bis 160 Zeichen, aus dem Sichtbaren, eindeutig, keine Zusagen, keine Gedankenstriche) und der Bericht `berichte/FA-SEO-01A.md` (so wurde gemessen und getestet). Diese Datei nennt dir nur die Quellen dieses Teils.

## Quellen dieses Teils
1. Marken- und Modellseiten (`src/app/(site)/autoschluessel/marken/**`, die Generatoren für Titel und Beschreibung und ihre Daten in `content/vehicles.json` nur lesend): Die Vorlage für Titel und Beschreibung so fassen, dass jede Marke und jedes Modell in den Grenzen bleibt, auch lange Namen (Test über alle Marken und Modelle des Bestands). Die Beschreibung nennt, was die Seite wirklich zeigt (Schlüsselarten, Preis oder Prüfung, Termin), keine erfundenen Angaben je Modell (R3, R4).
2. Ratgeber (`content/guides.json`): `seo.title` und `seo.description` der acht Beiträge; Titel der Beiträge selbst ohne Gedankenstriche, wenn der Titel als Überschrift und Seitentitel dient (prüfe, wo er verwendet wird; Adressen bleiben). Bei „Autoschlüssel verloren“ nennt die Beschreibung die Reihenfolge „prüfen, sichern, anfragen“ wie der sichtbare Text. Der Verweistext „Codelinien ansehen“ wird „Schlüssel nach Code“.
3. Rückfall der Ratgeber: `guides()` in `src/lib/data/defaults/content.ts` wortgleich mit `content/guides.json` (excerpt, body mit heading und text, nextStep.label, seo), mit einem Test, der beide vergleicht.
4. Seiten mit festem `metadata` oder eigenem Rückfall: `/service-und-termin/kontakt` (die Beschreibung nennt die Erreichbarkeit im Wortlaut des Inhabers: „24 Stunden erreichbar. Notdienst rund um die Uhr. Werkstatt und persönliche Beratung nach Terminvereinbarung.“, soweit die Länge es trägt, sonst die Kernaussage), `/service-und-termin/vor-ort`, `/service-und-termin/anfrage`, `/service-und-termin/terminstatus`, `/beratung`, `/schliessanlagen/konfigurator/schliessplan`, `/rechtliches/versand-und-zahlung` (nur Titel und Beschreibung, nie der Rechtstext), `/standorte` und die Ortsseiten (`content/cities.json`, nur `seo.title`, `seo.description`), `/motorradschluessel` und Anfrage, `/autoschluessel/gehaeuse` und Anfrage, die vier neuen Fahrzeugklassen und `/autoschluessel/fahrzeug-nicht-gefunden` (Kopftexte in `content/seo.json` und Rückfall, nur `seo.title` und `seo.description`), die Partnerseiten (`src/lib/partner/gewinnung.ts`, nur Titel und Beschreibung), die Rückfälle in `generateMetadata` unter `src/app/(site)/autoschluessel/**`, Artikel- und Codeseiten (Vorlagen), Warenkorb, Kasse und Vorgangsseiten nur, wenn sie indexierbar sind.
5. Der Längentest `src/lib/data/seo-laengen.test.ts` wird auf diese Quellen ausgedehnt (Marken und Modelle über den Generator, Ratgeber, Orte, feste Metadaten über denselben Weg wie die Rückfälle in Teil A).

## Schreibrechte
Die genannten Quellen, jeweils nur Titel, Beschreibung und Verweis-Beschriftungen; `src/lib/data/defaults/content.ts` (nur `guides()` und SEO-Felder); `src/lib/data/seo-laengen.test.ts` und Tests der geänderten Dateien; `_werkstatt/ausbau/berichte/FA-SEO-01B.md`.
Nicht anfassen: sichtbare Fließtexte und Überschriften (außer Ratgebertitel nach Punkt 2), Strukturdaten, Sitemap, robots, Navigation, Preise, Rechtstexte, `content/vehicles.json`, `content/fahrzeugkatalog.json`, Formulare, alles unter `src/lib/mail`, `src/lib/zahlung`, `src/payload` (dort arbeitet gerade FA-KERN-04).

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- Kein Build, kein Server, kein `--pg`, kein git. Die Onpage-Messung macht der Orchestrator nach dem nächsten Build.
- Tabelle im Bericht: Quelle, Titel alt und neu mit Breite, Beschreibung alt und neu mit Länge; für Marken und Modelle die Vorlage und die drei längsten Fälle.
- Im Arbeitsbaum liegen Änderungen eines gleichzeitig laufenden Pakets (Zahlung und Admin). Ein roter Test in dessen Dateien ist nicht dein Fehler; wiederhole den Lauf und nenne es im Bericht. `content/seo.json` und `content.ts` nur mit dem Bearbeitungswerkzeug an einzelnen Stellen ändern.

## Grenzen
R1, R3, R4, R7, R8, R9 (Erreichbarkeit nur im Wortlaut des Inhabers), G8, G9. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen vorher und nachher) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-01B · BEREIT ZUR RÜCKGABE ===
