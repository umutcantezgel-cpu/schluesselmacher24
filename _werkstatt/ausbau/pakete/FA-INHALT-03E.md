# FA-INHALT-03E · Texte menschlicher: Ratgeber, Artikel, Warenkorb

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-01 (für ältere Kunden bedienbar), FA-10 (Shop verständlich).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte.

## Seitengruppe
- Ratgeber: die acht Beiträge in `content/guides.json` und gleichlautend im Rückfall unter `src/lib/data/defaults` (suche die Datei mit den Ratgeber-Startwerten), dazu src/app/(site)/ratgeber/page.tsx und src/app/(site)/ratgeber/[slug]/page.tsx
- Artikel: src/app/(site)/artikel/page.tsx, artikel-liste.tsx, [slug]/page.tsx; in [slug]/artikel-kauf.tsx nur sichtbare Beschriftungen, Hilfetexte und Fehlermeldungen
- Warenkorb: src/app/(site)/warenkorb/page.tsx; in warenkorb-ansicht.tsx nur sichtbare Beschriftungen, Hilfetexte und Fehlermeldungen

## Besonderheiten dieser Gruppe
- Ratgeber: Jeder Beitrag beantwortet eine Frage eines Kunden. Der erste Absatz gibt die Antwort in zwei bis drei kurzen Sätzen, danach folgen die Schritte. Tatsachen bleiben, wie der Bestand sie belegt (`_werkstatt/ausbau/FACHWISSEN.md`, falls vorhanden, und die Daten); Normen, Zahlen und Fristen nur, wenn sie dort belegt sind, sonst streichen und unter OFFENE FRAGEN nennen (R4). Titel, Adressen (`slug`), Datum, Autor und SEO-Felder der Beiträge bleiben unverändert. Wenn ein Beitrag auf „Schlüssel nach Foto“ verweist, heißt es „Schlüssel nach Vorlage“. Zur Erreichbarkeit keine eigenen Sätze; wenn nötig, verweise auf die Kontaktseite.
- Die Beiträge sind zugleich Quelle der Strukturdaten (Article, FAQ): Sichtbares und Auszeichnung bleiben gleich (R8). Ändere keine Feldnamen und keine Struktur der Daten.
- Artikel und Warenkorb: keine Preise, Versandkosten, Lieferzeiten, Mengenregeln oder Steuerhinweise ändern (G9). Nur Wortlaut. Leere Zustände sagen, was der Kunde als Nächstes tun kann.
- Kasse und Bestellseite gehören nicht zu dieser Gruppe.
- Rechtliche Hinweise (Widerruf, Preisangaben „inkl. MwSt.“, Versandhinweise) bleiben wörtlich.

## Schreibrechte
Die oben genannten Dateien; Tests dieser Dateien; `_werkstatt/ausbau/berichte/FA-INHALT-03E.md`.
Nicht anfassen: `content/seo.json`, `src/lib/data/defaults/content.ts`, `src/lib/warenkorb*`, `src/lib/actions/**`, `src/lib/artikel.ts`, Preise, Navigation, Rechtstexte, Kasse, Bestellung, SEO-Felder.

=== ENDE FA-INHALT-03E · BEREIT ZUR RÜCKGABE ===
