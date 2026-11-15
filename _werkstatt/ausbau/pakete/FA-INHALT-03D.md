# FA-INHALT-03D · Texte menschlicher: Schlüssel nach Code, Schlüssel nach Vorlage, Schlüssel einschicken

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-08 (Schlüssel nach Vorlage statt „nach Foto“), FA-11 (Schlüssel nach Code verständlich, Anfrage wenn der Code nicht eindeutig passt), FA-14 (Einsendung verständlich), FA-01 (für ältere Kunden bedienbar).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte.

## Seitengruppe
- src/app/(site)/schluessel-nach-code/page.tsx, shop-liste.tsx, linien-liste.tsx, [slug]/page.tsx, hersteller/[hersteller]/page.tsx, kategorie/[familie]/page.tsx; in [slug]/bestell-formular.tsx nur sichtbare Beschriftungen, Hilfetexte und Fehlermeldungen
- src/app/(site)/schluessel-nach-vorlage/page.tsx, anfrage/page.tsx; in anfrage/anfrage-formular.tsx nur sichtbare Beschriftungen, Hilfetexte und Fehlermeldungen
- src/app/(site)/schluessel-einschicken/page.tsx, anmelden/page.tsx; in anmelden/einsende-formular.tsx nur sichtbare Beschriftungen, Hilfetexte und Fehlermeldungen
Dazu die sichtbaren Kopftexte dieser Routen (Felder `headline`, `subline`, `intro`, `faq`, nicht `seo.title` und nicht `seo.description`) in `content/seo.json` und gleichlautend im Rückfall `src/lib/data/defaults/content.ts`.

## Besonderheiten dieser Gruppe
- Schlüssel nach Code: Es gibt zurzeit keine veröffentlichten Codeprodukte (A-046: die 52 Linien im Bestand sind Beispiele und unsichtbar). Die Seite erklärt die Leistung und führt in „Code anfragen“ (`src/lib/wege/code-anfrage.ts`). Schreibe nichts, was ein Sortiment, Hersteller, Stückzahlen oder Lieferzeiten behauptet, die es nicht gibt (R4). Texte, die erst mit Produkten sichtbar werden (Liste, Detailseite, Bestellformular), müssen ohne erfundene Angaben stimmen. Preise und Staffeln nicht anfassen.
- Schlüssel nach Vorlage: Der Begriff heißt überall „Schlüssel nach Vorlage“, nie „Schlüssel nach Foto“ (Vorgabe des Inhabers, Abschnitt 8). Ein Foto ist nur ein Hilfsmittel der Anfrage. Die Machbarkeit prüft der Betrieb; keine Zusage, dass jeder Schlüssel gefertigt werden kann.
- Schlüssel einschicken: Die Seite steht nicht mehr im Hub, bleibt aber erreichbar. Keine neuen Aussagen zu Versandarten, Kosten oder Haftung; das regelt später ein eigenes Paket (FA-SHOP-03, A-050). Bestehende Aussagen dazu bleiben im Sinn unverändert.
- Berechtigungsnachweis (R13): Wo ein Nachweis verlangt wird, bleibt er verlangt und wird in einem kurzen Satz begründet. Kein Text darf den Eindruck erwecken, es gehe auch ohne.
- Formulare: Du änderst keine Logik, keine Feldnamen, keine Prüfregeln und keine Reihenfolge. Nur Wortlaut von Beschriftungen, Hilfen, Knopftexten und Fehlermeldungen. Fehlermeldungen sagen, was fehlt und wie es weitergeht.
- Einwilligungen, Widerrufs- und Rechtshinweise in Formularen bleiben wörtlich (G9).
- `content/seo.json` und `src/lib/data/defaults/content.ts` bearbeitet gleichzeitig ein anderes Paket an anderen Routen. Ändere dort nur einzelne Stellen mit dem Bearbeitungswerkzeug (nie die ganze Datei neu schreiben, kein Skript, das die Datei liest und zurückschreibt). Ein kurz roter Gleichstands-Test, der eine fremde Route betrifft, ist nicht dein Fehler; nenne ihn im Bericht.

## Schreibrechte
Die oben genannten Dateien; `content/seo.json` und `src/lib/data/defaults/content.ts` nur für `headline`, `subline`, `intro`, `faq` der Routen `schluessel-nach-code`, `schluessel-nach-vorlage`, `schluessel-nach-vorlage/anfrage`, `schluessel-einschicken`, `schluessel-einschicken/anmelden` (soweit vorhanden); Tests dieser Dateien; `_werkstatt/ausbau/berichte/FA-INHALT-03D.md`.
Nicht anfassen: `content/code-lines.json`, `src/lib/wege/**`, `src/lib/actions/**`, `src/lib/codelinie.ts`, Preise, Navigation, Rubrikdaten, Rechtstexte, SEO-Titel und -Beschreibungen, Upload-Bausteine (`src/components/upload`, `src/components/formular`).

=== ENDE FA-INHALT-03D · BEREIT ZUR RÜCKGABE ===
