# FA-INHALT-03B · Texte menschlicher: die Leistungsseiten der Sicherheitstechnik und der Tür- und Schließtechnik

Kopf: Etappe FA Priorität 5 · Rolle Autor · Modell Opus · Stufe 3 · Kostenklasse L · kein Datenschema · Anforderungen FA-02-01 bis FA-02-06, FA-18 (Sicherheitstechnik als eigener großer Bereich mit echtem Anfrageprozess).

## Auftrag
Es gelten vollständig die Regeln, der Ablauf, die Prüfungen und das Ausgabeformular aus `_werkstatt/ausbau/pakete/FA-INHALT-03.md` (lies die Datei zuerst ganz; sie enthält die Vorgabe des Inhabers im Wortlaut). Diese Datei nennt dir nur die Seitengruppe und die Schreibrechte.

## Seitengruppe
Alle Leistungsseiten aus `content/service-pages.json` (Bereiche Sicherheitstechnik und Tür- und Schließtechnik) mit ihren sichtbaren Texten: Titel, Kurztext, Einleitung, Abschnitte, Listen, FAQ. Gleichlautend der Rückfall `src/lib/data/defaults/service-pages.ts`: Beide Dateien tragen am Ende denselben Stand (ein vorhandener Test vergleicht sie; prüfe das).

## Besonderheiten dieser Gruppe
- Je Seite oben in ein bis zwei Sätzen: was wir tun und für wen. Danach höchstens vier kurze Abschnitte. Ein eindeutiger nächster Schritt (Anfrage oder Sicherheitscheck, wie die Seite ihn heute hat).
- Der Hinweis zu Ton und Aufzeichnung (`src/app/(site)/sicherheitstechnik/rechtshinweis-ton.ts`) und der bestehende Satz zur verdeckten Audioüberwachung bleiben wörtlich unverändert (Entwurf in anwaltlicher Prüfung, MA-40).
- Keine Angstmache und keine Einbruchszahlen ohne Quelle (R9). Keine Normen, Widerstandsklassen oder Zertifikate behaupten, die der Bestand nicht belegt; wo die alte Fassung eine Norm nennt, bleibt sie nur, wenn sie in `_werkstatt/ausbau/FACHWISSEN.md` oder den Daten belegt ist, sonst kommt sie in die Liste OFFENE FRAGEN.
- Herstellernamen nur, wo sie schon stehen (R12).
- SEO-Felder (`seo.title`, `seo.description`) fasst du nicht an. Der Seed gleicht bestimmte Felder ab (Startwert-Abgleich): Titel einer Leistung änderst du nicht, außer er enthält einen Gedankenstrich; dann nur den Strich ersetzen.
- Die Seitenvorlagen `src/app/(site)/sicherheitstechnik/[slug]/page.tsx` und `src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx` sowie die Bereichsseiten: nur feste Fließtexte, Zwischenüberschriften und Knopftexte anfassen, keine Logik.

## Schreibrechte
content/service-pages.json, src/lib/data/defaults/service-pages.ts, src/app/(site)/sicherheitstechnik/page.tsx und [slug]/page.tsx, src/app/(site)/tuer-und-schliesstechnik/page.tsx und [slug]/page.tsx (nur Texte), Tests dieser Dateien, _werkstatt/ausbau/berichte/FA-INHALT-03B.md.
Nicht anfassen: content/seo.json, src/lib/data/defaults/content.ts, Sicherheitscheck-Konfigurator, Navigation, Preise, Rechtstexte, `rechtshinweis-ton.ts`.

=== ENDE FA-INHALT-03B · BEREIT ZUR RÜCKGABE ===
