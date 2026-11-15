# FA-INHALT-03F · Texte menschlicher: Startseite unter dem Hub, Autoschlüssel-Übersicht, Marken- und Modellseiten

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-03 (Sprache der Startseite), FA-05 (Autoschlüssel verständlich), FA-06 (Fahrzeugdatenbank sichtbar erklärt), FA-01 (für ältere Kunden bedienbar).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte.

## Seitengruppe
- Startseite `src/app/(site)/page.tsx`: alles unter dem Hub (Abschnitte Ablauf, „Direkt kaufen“, Projekte, Partner-Sektion nur soweit Text in der Seite steht, Ratgeber). Der Hub selbst, die Frage und der Satz darunter bleiben unverändert (der Satz ist vom Inhaber bestätigt).
- Autoschlüssel-Übersicht `src/app/(site)/autoschluessel/page.tsx`.
- Markenübersicht `src/app/(site)/autoschluessel/marken/page.tsx`, Markenseite `marken/[make]/page.tsx`, Modellseite `marken/[make]/[model]/page.tsx` und die Texte, die sie erzeugen (`src/lib/fahrzeug-texte.ts`).
Dazu die sichtbaren Kopftexte dieser Routen (Felder `headline`, `subline`, `intro`, `faq`, nicht `seo.title` und nicht `seo.description`) in `content/seo.json` und gleichlautend im Rückfall `src/lib/data/defaults/content.ts`.

## Besonderheiten dieser Gruppe
- Startseite: Abschnitt „Direkt kaufen“ darf nichts als bestellbar darstellen, was es nicht gibt. Schlüssel nach Code hat zurzeit keine veröffentlichten Produkte (A-046): Der Verweis führt in „Code anfragen“ und sagt das. Gleichschließende Zylinder sind bestellbar (Konfigurator). Keine Zahlen, Zeiten oder Zusagen, die der Bestand nicht trägt. Die Erreichbarkeit steht nur über den Baustein (`erreichbarkeit(settings)`).
- Autoschlüssel-Übersicht: Der Ablauf heißt heute: Fahrzeug wählen, Unterlagen hochladen (Fahrzeugschein und drei Fotos des Schlüssels, außer bei bestätigtem Verlust aller Schlüssel), Preis oder Prüfung sehen, Anzahlung, Termin. Die Anzahlung nennst du nur so, wie die Seite sie aus den Einstellungen zeigt; keine eigenen Beträge im Text. Der Partnerweg ist für Kunden nicht eingeschaltet: nichts dazu schreiben. „Fahrzeug nicht gefunden?“ und die neuen Fahrzeugklassen (Motorrad, Roller, E-Scooter, Seniorenmobil, Fahrrad) dürfen als Verweise erscheinen, wenn die Seite sie schon trägt oder ein Verweis fehlt; die Blöcke selbst (Bausteine aus `src/components/fahrzeug-anfrage`) änderst du nicht.
- Marken- und Modellseiten: Die Texte entstehen aus Daten (`content/vehicles.json`, Preisgruppen). Schreibe die Vorlagen so, dass sie für jede Marke und jedes Modell stimmen: keine Aussage über ein Modell, die nicht in dessen Daten steht (R3, R4); kein Fülltext, der auf jeder Seite gleich klingt und nichts sagt. Der Quellenvermerk zum Kraftfahrt-Bundesamt bleibt wörtlich. Marken ohne eigene Preisseite führen in die Anfrage: Der Satz dazu ist kurz und ehrlich.
- Berechtigungsnachweis (R13): Wo Fahrzeugschein, Ausweis oder Vollmacht genannt sind, bleiben sie genannt, im Wortlaut der überarbeiteten Leistungsseiten (FA-INHALT-03A).
- Gleichzeitig arbeiten zwei andere Pakete: FA-SEO-01B ändert in denselben Seiten nur Titel und Beschreibung (`metadata`, `generateMetadata`, `seo.title`, `seo.description`) und in `content.ts` den Rückfall der Ratgeber; FA-KERN-05 ändert Admin, Mails und die Seiten der Fahrzeugklassen. Fasse diese Stellen nicht an. Ändere geteilte Dateien (`content/seo.json`, `content.ts`, die Seiten) nur mit dem Bearbeitungswerkzeug an einzelnen Stellen, nie die ganze Datei neu schreiben und kein Skript, das eine Datei liest und zurückschreibt. Ein roter Test in fremden Dateien ist nicht dein Fehler; wiederhole den Lauf und nenne es im Bericht.

## Schreibrechte
Die oben genannten Dateien, jeweils nur sichtbare Texte; `content/seo.json` und `src/lib/data/defaults/content.ts` nur für `headline`, `subline`, `intro`, `faq` der Routen `autoschluessel` und `autoschluessel/marken` (die Startseite nur `intro` und `faq`, nicht `subline`); Tests dieser Dateien; `_werkstatt/ausbau/berichte/FA-INHALT-03F.md`.
Nicht anfassen: Hub (`src/components/hub`), Navigation, Rubrikdaten, `content/vehicles.json`, `content/fahrzeugkatalog.json`, Preise, Rechtstexte, SEO-Titel und -Beschreibungen, Strukturdaten, Formulare, Termin-Assistent, `src/components/fahrzeug-anfrage`, `src/components/autoschluessel/fahrzeug-suche.tsx`.

=== ENDE FA-INHALT-03F · BEREIT ZUR RÜCKGABE ===
