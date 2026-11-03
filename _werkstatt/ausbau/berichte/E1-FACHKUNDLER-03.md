# E1-FACHKUNDLER-03 · Bericht

Stand 2026-11-02 · Rolle Fachkundler · Modell Haiku 5.5 · Auftrag E1 Transponder und Klonbarkeit

## GEÄNDERTE DATEIEN

- /home/user/schluesselmacher24/_werkstatt/ausbau/erhebung/E1-transponder.md (neu, Ergebnis, rund 1.700 Wörter)
- /home/user/schluesselmacher24/_werkstatt/ausbau/berichte/E1-FACHKUNDLER-03.md (neu, dieser Bericht)

Keine Projektdatei geändert, nichts committet.

## WAS UND WARUM

Erhebung der verbreiteten Transpondertypen und ihrer Klonbarkeit mit Quelle, Abrufdatum und Stufe, als Kandidatenliste für den Bogen KLONBAR. Jede Zeile ist ein Vorschlag. Nichts ist bestätigt.

Gelesen wurden 14 Quellen: 7 Herstellerseiten (Texas Instruments, Abrites, Keyline, Silca dreimal, Autel), 3 Fachbetriebsbeiträge (Kfz-Dietrich), 1 Anbieter (LSC, Australien), 1 Fachpresse-Beitrag (JMA, Stand 2010), 1 Enzyklopädie und 1 Automobilclub (ADAC). Die Suche war US-lastig. Der Markt jeder Quelle steht in Abschnitt 7 der Ergebnisdatei.

## GEMEINSAME DATEIEN

Keine gewünschte Änderung.

## PRÜFUNG UND ERGEBNIS

- Ergebnis in Zahlen: 15 Typen oder Gruppen in der Tabelle (Abschnitt 6), 22 Fahrzeugzeilen (Abschnitt 5, Obergrenze 40), 52 Quellenklammern, 12 offene Fragen.
- Stufe A: keine Zeile, weil keine Messung eines Anbieters gefunden wurde. Stufe B: alle belegten Fakten. Stufe C: 3 Zeilen als eigene Einordnung markiert.
- Klonbarkeit laut Quellen: ja durch Hersteller bei ID4C, ID11, ID12, ID33, ID13, ID46, ID48, DST AES. Nur Autel-Liste bei ID5C, ID8A, ID8C, ID64. Widersprüchlich bei ID4D, ID4A, ID49. Offen bei ID88, ID47, DST80 (mit Vorbehalt). Keine Angabe bei DST40 und Hitag Pro. ID44 nur über den Chip PCF7935 als Festcode.
- Selbstprüfung: Jede Faktenzeile hat Quelle, Abrufdatum und Stufe. Die Abrufe erfolgten einzeln. Die robots.txt jeder Domain wurde vorher geprüft (ti.com mit Crawl-delay 1 Sekunde). Keine Formulare, keine Downloads.
- Nicht erreicht: xhorse.com (robots.txt zweimal HTTP 503, keine Seite gelesen), Silca RW4 Plus (Extranet ohne Inhalt, DE und IT 404), Silca-ID49-Seiten (404), NXP-Produktseiten für Hitag Pro, Hitag 3 und Hitag AES (nicht gefunden).
- Keine Anleitung zum Umgehen enthalten. Verfahren stehen nur als Begriffe und Werkzeugnamen laut Quelle.
- Werbeaussagen sind nicht als Fakt übernommen: Silca "rund 99 %", Keyline "ideal cloning process".

## BELEGE

- https://abrites.com/taxons/protag (EU, Hersteller, ohne Datum)
- https://autel.us/product/maxiim-at100/ (US, Hersteller, ohne Datum)
- https://www.silca.biz/de/global/produkte/rw5 und .../t49c (DE-Seiten, Hersteller)
- https://www.silca.biz/en/global/events-and-news/news-about-us/2023-gti-ultra (Stand 2023-07-28)
- https://www.ti.com/product/TMS37145 (international, Stand 2020-01-29)
- https://keyline.it/en/news/keyline-glass-chips-and-electronic-heads-for-transponder-key-cloning_en_324 (IT, Hersteller)
- https://kfz-dietrich.com/blog/wegfahrsperre-transponder-typen-erklaert/ und .../wegfahrsperre-transponder-generationen-erklaert/ (DE, Stand 2026-10-30)
- https://kfz-dietrich.com/blog/schluesselservice-zweitschluessel-anlernen-lassen/ (DE, Stand 2026-10-29)
- https://www.adac.de/rund-ums-fahrzeug/ausstattung-technik-zubehoer/zubehoer/autoschluessel-nachmachen/ (DE, Datum 2026-04-13)
- https://lsc.com.au/transponder-generation (AU, Anbieter, ohne Datum)
- https://www.locksmithledger.com/home/article/10222379/jma-automotive-key-blank-numbering-system (US, Stand 2010-12-03)
- https://en.wikipedia.org/wiki/Digital_signature_transponder (Stand 2026-09-20)

## OFFENE FRAGEN

1. ID88 (Megamos AES): Kein Hersteller nennt Klonen. Die Silca-RW4-Plus-Seite war nicht abrufbar.
2. ID49: Hitag 3 (Honda, laut Silca) oder Hitag Pro (laut Paket)? Dietrich ordnet ID49 der dritten Generation zu.
3. ID4A und Hitag AES: Abrites nennt Klonen für Toyota H Schlüssel, Dietrich verneint klassisches Kopieren der AES-Generation.
4. ID47: Hitag 3 laut Paket, klonbar laut Autel. Keine Herstellerquelle für die Zuordnung.
5. 4D: TI-DST laut Dietrich oder Tiris 4D/4E laut Abrites.
6. DST80: Keine Hersteller-Klonangabe. Abrites nennt Tiris DST+, die Gleichsetzung mit DST80 ist nicht belegt.
7. ID44 gleich PCF7935: nur Händlerangaben aus Suchausschnitten.
8. Aktuelle Herstellerquellen fehlen für Xhorse (robots.txt 503) und JMA (nur Stand 2010).
9. Rechtslage zu Besitz, Einsatz der Geräte und gesetzlichen Nachweispflichten ist nicht erhoben.
10. Herstellerseiten ohne Datum (Silca, Abrites, Keyline, Autel, LSC): Aktualität unbekannt.

Empfehlung für die Entscheidung des Orchestrators: ID88, ID47, ID49, ID4A und DST80 im Bogen KLONBAR nur als "Vorschlag, bitte prüfen" führen, und die Rechtsfrage vor dem Livegang klären.
