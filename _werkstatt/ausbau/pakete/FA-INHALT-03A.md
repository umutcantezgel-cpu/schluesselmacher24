# FA-INHALT-03A · Texte menschlicher: die sieben Leistungsseiten im Bereich Autoschlüssel

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-05-01 (Autoschlüssel als wichtigster Bereich: klar und professionell).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte.

## Seitengruppe
Die sieben Leistungsseiten des Bereichs Autoschlüssel:
- src/app/(site)/autoschluessel/nachmachen/page.tsx
- src/app/(site)/autoschluessel/programmieren/page.tsx
- src/app/(site)/autoschluessel/kopieren/page.tsx
- src/app/(site)/autoschluessel/funkschluessel/page.tsx
- src/app/(site)/autoschluessel/smart-key/page.tsx
- src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx
- src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx
Dazu die sichtbaren Kopftexte dieser sieben Routen (Felder `headline`, `subline`, `intro` und `faq`, nicht `seo.title` und nicht `seo.description`) in `content/seo.json` und gleichlautend im Rückfall `src/lib/data/defaults/content.ts`, sowie die Kurztexte derselben Leistungen in `content/car-key-services.json` und im zugehörigen Rückfall (nur Texte, keine Preise, keine Kennungen).

## Besonderheiten dieser Gruppe
- Jede Seite: oben in ein bis zwei Sätzen, was wir tun und für wen; dann höchstens vier kurze Abschnitte (Wann brauche ich das · So läuft es ab · Was wir von Ihnen brauchen · Was es kostet oder wie der Preis entsteht, nur mit den Angaben, die die Seite heute aus den Daten zeigt); ein Hauptknopf „Termin anfragen“ beziehungsweise der Knopftext, den die Seite heute für dieses Ziel nutzt (A-031).
- Berechtigungsnachweis (Fahrzeugschein auf den Besteller oder Vollmacht, Ausweis beim Termin) bleibt auf jeder Seite stehen und wird verständlicher, nicht kürzer als nötig (R13).
- Anzahlung und Vorlauf nur über die vorhandenen Platzhalter und Werte aus den Einstellungen (keine festen Zahlen in den Text schreiben).
- Erreichbarkeit: keine Aussagen zu Zeiten; wo ein Hinweis auf Erreichbarkeit sinnvoll ist, nutzt die Seite die Einstellungen (`erreichbarkeit(settings)` aus `src/lib/erreichbarkeit.ts`), nicht eigenen Text.
- Fachbegriffe, die bleiben müssen (Transponder, Wegfahrsperre, Keyless, Smart Key), bekommen beim ersten Auftreten einen Halbsatz Erklärung.
- Bildstellen (`ImageSlot` mit `motif`) und Grafiken bleiben, wie sie sind.
- Die Fahrzeugöffnung: keine Aussage zu Notdienst, Anfahrtszeit oder Einsatzgebiet, die der Bestand nicht trägt; der Weg dorthin bleibt, wie die Seite ihn heute anbietet.

## Schreibrechte
Die sieben Seiten oben; `content/seo.json` und `src/lib/data/defaults/content.ts` nur für die Felder `headline`, `subline`, `intro`, `faq` der Routen `autoschluessel/nachmachen`, `autoschluessel/programmieren`, `autoschluessel/kopieren`, `autoschluessel/funkschluessel`, `autoschluessel/smart-key`, `autoschluessel/schluesselbart-fraesen`, `autoschluessel/fahrzeugoeffnung`; `content/car-key-services.json` und sein Rückfall nur für Beschreibungstexte; Tests dieser Dateien; `_werkstatt/ausbau/berichte/FA-INHALT-03A.md`.
Nicht anfassen: `src/app/(site)/autoschluessel/page.tsx`, `anfrage/**`, `marken/**`, `gehaeuse/**`, Komponenten unter `src/components`, Preise, Rechtstexte, Navigation.

=== ENDE FA-INHALT-03A · BEREIT ZUR RÜCKGABE ===
