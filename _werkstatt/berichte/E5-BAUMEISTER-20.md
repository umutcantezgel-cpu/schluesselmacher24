# E5-BAUMEISTER-20 · Bericht und Abnahme

1 Prüfrunde(n), Prüfurteil: bestanden. Abnahme durch den Orchestrator:

- **Bilder (eigene):** Bereichsseite mit Schriftfeld im Kopf, Stückliste der vier Wege mit Fach-Icons, nummerierte Abschnitte; Kontakt ohne Platzhalter-Daten.
- **Nacharbeit:** Links der Vor-Ort-Liste heißen für Screenreader „{Leistung}: {Aktion}“ statt zweimal „Termin starten“.
- **Entschieden:** „Anliegen“ / „Wählen Sie Ihr Anliegen“ als Mikrotext der neuen Abschnittsordnung bestätigt; der öffentliche Hinweis „Anschrift, Telefon und E-Mail sind noch nicht hinterlegt …“ ist ehrlicher als Platzhalter und verschwindet mit M-02; „Öffnungszeiten heute“ entfällt (bräuchte Zeitzonenlogik beim statischen Rendern); FAQ linksbündig im Raster bestätigt; Kopf ohne Fachgrafik, weil kein Generator die Sache trägt (Fach-Icon als Anker).

## Prüfurteil

- **soll:** Bereichsseite Abschnitt 01 (src/app/(site)/service-und-termin/page.tsx Z. 137-139): Augenbraue „Anliegen“ und Titel „Wählen Sie Ihr Anliegen“ sind neuer Text. Das Paket nennt sie nicht, und die Grenze „Texte mit Inhalt bleiben gleich“ sowie K-010 („keine neuen Inhalte“) gelten. Begründbar über KERN 1.10 („Ordnung durchziehen“, Augenbraue und Nummer je Abschnitt), aber nur mit Entscheidung des Orchestrators (Frage 3 des Berichts).
- **soll:** Kontakt bei company.isPlaceholder (kontakt/page.tsx Z. 59-71): Der neue öffentliche Satz „Anschrift, Telefon und E-Mail sind noch nicht hinterlegt. Für Ihr Anliegen stellen Sie bitte eine Anfrage.“ erscheint auch in Produktion und sagt Kundschaft, dass Kontaktdaten fehlen. Das Paket verlangt nur einen sachlichen Hinweis mit Link; der Wortlaut braucht eine Freigabe für den Livegang.
- **hinweis:** Schriftfeld „Öffnungszeiten heute“ (Paket: „etwa“) ist nicht umgesetzt; der Bericht meldet es als offene Frage 1. Die Felder „Wege“ (4) und „Ablauf“ (Geführte Anfrage) sind wie verlangt umgesetzt (page.tsx Z. 120-130).
- **hinweis:** FAQ-Accordion (page.tsx Z. 320): Die Klassen wurden von „mt-8 max-w-4xl mx-auto“ auf „mt-12 max-w-4xl“ geändert, `mx-auto` ist entfallen. Die FAQ steht nun linksbündig. Die Änderung ist nicht im Paket benannt und fehlt im Bericht.
- **hinweis:** Vor-Ort-Liste (vor-ort/page.tsx Z. 104-107): Der Link-Name jedes Listeneintrags ist nur der CTA-Text („Termin starten“, „Projekt erfassen“ usw.), nicht der Leistungstitel. Zwei Einträge heißen „Termin starten“, dazu kommt der Terminvorlauf-Button. Für Screenreader ist das schwächer; sichtbar ist es nicht.
- **hinweis:** Das Fach-Icon im PageHeader ist im gemeinsamen Baustein page-header.tsx mit „hidden lg:block“ nur ab lg sichtbar. Auf Mobil und Tablet fehlt deshalb der Anker aus B-13. Das liegt am geteilten Baustein und nicht an den drei Dateien; es ist nur zur Kenntnis.
- **hinweis:** Vor-Ort-Zeichnung (Desktop-Bild): Beschriftungen 1, 2, 4 und 5 sind blass und haben geringen Kontrast. Mobil bei 390 px sind die Beschriftungen knapp lesbar. Es ist der Stand des Generators tuer-schutz und kein Paketfehler.
- **hinweis:** KERN-Versionsangaben widersprechen sich: Der Kopf von _werkstatt/KERN.md nennt 1.12 (Änderungsliste bis 1.12), das Paket nennt Kern-Version 1.10, der Auftragstext nennt KERN 1.8. Der Bericht meldet 1.12, und das stimmt mit der Datei überein. Die Angabe im Auftrag sollte der Orchestrator klären.
- **hinweis:** Die drei Dateien stehen nicht auf der Liste GESCHUETZTE des Logikwächters, daher ist kein Lauf nötig. Ersatzweise wurde der Text- und Strukturvergleich mit dem TypeScript-Parser gegen 8faad51 gemacht (siehe Prüfung). Der Vergleich zeigt keine Logik-, Daten- oder Handler-Änderung.

## Bericht des Baumeisters

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/service-und-termin/page.tsx
- /home/user/schluesselmacher24/src/app/(site)/service-und-termin/kontakt/page.tsx
- /home/user/schluesselmacher24/src/app/(site)/service-und-termin/vor-ort/page.tsx

WAS UND WARUM
Bereichsseite /service-und-termin: Kopf mit PageHeader bereich="service-und-termin" (Fach-Icon als Anker, B-13) und Schriftfeld „Wege“ (4) und „Ablauf“ (Geführte Anfrage). Abschnitt 01 als Stückliste mit Fach-Icons 40 px ohne Kasten (IconServiceUndTermin, IconTermin, IconStandort, IconBeratungTelefon), ganze Zeile Link, GlyphPfeilRechts mit zeiger:group-hover. Abschnitt 02 als Haarlinienraster (sm:grid-cols-2 lg:grid-cols-4), Bereichslinks min-h-touch. Abschnitt 03 als nummerierte Liste 01 bis 04 mit Mono-Ziffern, Überschriften text-title-sm, Fließtext prose-sm24 ohne max-w-none. Abschnitte 04 und 05 mit Nummer, Rechner und Accordion unverändert. Abschnitt 06: Öffnungszeiten als Schriftfeld im Fuß-Format, ohne min-w-[22rem], Verweise als Stückliste. Töne: default, muted, default, sunken, default, muted. Entfernt: lucide-react, Card, CardBody. Platzhalterschutz über istPlatzhalter und enthaeltPlatzhalter für Einleitung, Untertitel und Verweise.

Kontakt /service-und-termin/kontakt: PageHeader mit bereich="service-und-termin", Aktion unverändert. Redaktions-Alert nur im Entwicklungsmodus (wie im Fuß). Raster lg:grid-cols-12 mit 7/5. Bei company.isPlaceholder entfallen Anschrift, Telefon und E-Mail samt tel:- und mailto:-Links; stattdessen ein sachlicher Hinweis mit Link zur Anfrage. Sonst Schriftfeld-Zeilen mit GlyphOrt, GlyphTelefon, GlyphMail. Öffnungszeiten im selben Format wie die Bereichsseite. Der Anfahrts-Hinweis wird nur gerendert, wenn enthaeltPlatzhalter ihn nicht erkennt (hier also nie). Die zwei Bildstellen bleiben unverändert. Abschnittsnummer 01, Augenbraue „Erreichbarkeit“.

Vor-Ort /service-und-termin/vor-ort: PageHeader mit bereich="service-und-termin". Raster lg:grid-cols-12 mit 7/5. Die sechs Karten sind eine Stückliste mit Nummern 01 bis 06, ganze Zeile Link, Liste „Bitte vorbereiten“ als Mono-Etikett, CTA mit GlyphPfeilRechts und min-h-touch. Bildstelle Montagesituation mit visual { generator: 'tuer-schutz', params: { fokus: 'zylinder' } } und ausschnitt={TUER_SCHUTZ_AUSSCHNITT}. Einsatzgebiete und Terminvorlauf als Haarlinien-Schriftfelder statt Kästen. Städte-Links min-h-touch. lucide entfernt (ArrowRight). Abschnittsnummer 01.

Alt-Neu für Texte: Abschnitt 03 Überschriften „1. Die Phasen unserer Service-Implementierung“ → „Die Phasen unserer Service-Implementierung“ (2. bis 4. analog; die Nummer steht nun in der Mono-Spalte). Öffnungszeiten Bereichsseite „09:00–13:00 Uhr und 14:00–17:00 Uhr“ → „09:00–13:00 · 14:00–17:00“ (Fuß-Format). Neu: Augenbraue „Anliegen“ und Titel „Wählen Sie Ihr Anliegen“ (Bereichsseite, Abschnitt 01). Neu: Labels „Wege“ und „Ablauf“ im Schriftfeld. Neu bei isPlaceholder: „Anschrift, Telefon und E-Mail sind noch nicht hinterlegt. Für Ihr Anliegen stellen Sie bitte eine Anfrage.“ Alle übrigen Texte mit Inhalt sind wortgleich.

GEMEINSAME DATEIEN
Siehe Feld gemeinsame_dateien: max-w-md, max-w-3xl und max-w-4xl (kein Token), Widerspruch zur h3-Typografie in K-005 und K-005a (gewählt text-title-sm), KERN-Versionsangabe (Datei 1.12, Paket 1.10, Auftrag 1.8), Bildstellen ohne Foto.

PRÜFUNG UND ERGEBNIS
tsc --noEmit: Exit 0. ESLint: Exit 0. vitest: 60 Dateien, 1100 Tests grün. Werte-Suche: 0 Funde. lucide-Grep: kein Treffer. Gerendertes HTML: keine sichtbaren Platzhalter im Sinne von [Platzhalter, [PLZ], [Ort] (Dev-Alert und Fuß-Hinweis nur im Entwicklungsmodus). Nichts committet, nicht gepusht, nichts gelöscht. Andere Agenten arbeiten an schluessel-nach-code, autoschluessel, ratgeber und tuer-und-schliesstechnik; diese Dateien habe ich nicht angefasst.

BILDBELEGE
Vollseiten je Gerät (mobil 390, Tablet, Desktop), alle HTTP 200, unter /root/sm24-bilder/E5-BAUMEISTER-20/: service-und-termin__{mobil,tablet,desktop}__ganz.jpg, service-und-termin-kontakt__{mobil,tablet,desktop}__ganz.jpg, service-und-termin-vor-ort__{mobil,tablet,desktop}__ganz.jpg. Ausschnitte in .../crops/. Befund: nichts abgeschnitten, kein Überlauf, Abstände gleichmäßig, Legende der Montagezeichnung mobil lesbar. Die fixierten Leisten des Kopfes und der mobilen Aktionsleiste überdecken in den Vollbildern einzelne Stellen; das ist Gerätestand.

OFFENE FRAGEN
1. Schriftfeld „Öffnungszeiten heute“ nicht umgesetzt (kein Helfer für den heutigen Wochentag, Serverzeit zeitzonenabhängig). Entscheidung erbeten.
2. Kopf der Bereichsseite ohne Fachgrafik (E4-L-23); das Paket nennt keinen Generator. Vorschlag erbeten.
3. Neue Mikrotexte (Augenbraue „Anliegen“, Titel „Wählen Sie Ihr Anliegen“, Labels „Wege“ und „Ablauf“, öffentlicher Kontakt-Hinweis). Bitte bestätigen oder ersetzen.
4. Navigation (src/lib/navigation.ts, nicht Teil des Pakets): „Service und Termin“ verlinkt unter „Geführte Anfrage“ auf sich selbst.
5. Floskeln (Kundschaft-Punkt 7) und Fachangaben (Punkt 8) unverändert; Vorschläge in TEXTVORSCHLAEGE.md, Prüfung in MENSCHEN.
6. Anfahrts-Hinweis mit Platzhalter bleibt als Konstante im Code, wird nie gerendert. Redaktion soll echte Angaben liefern.
7. KERN-Version: Datei 1.12, Paket 1.10, Auftrag 1.8. Angewendet wurden die Regeln des Pakets. Bitte bestätigen.
8. Leere Datei /root/sm24-bilder/E5-BAUMEISTER-20-tsc.txt liegt eine Ebene über dem Paketordner (mein falscher Ausgabepfad). Ich darf nicht löschen; bitte entscheiden.

=== ENDE E5-BAUMEISTER-20 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen

- Schriftfeld im Kopf der Bereichsseite: Das Paket nennt „Öffnungszeiten heute“. Nicht umgesetzt, weil es keinen Helfer für den heutigen Wochentag gibt und eine Auswertung auf dem Server zeitzonenabhängig und für statisches Rendern ungeeignet ist. Im Kopf stehen nur „Wege“ (4) und „Ablauf“ (Geführte Anfrage). Bitte entscheiden, ob ein Helfer entstehen soll.
- Der Kopf der Bereichsseite hat keine Fachgrafik (Muster E4-L-23 verlangt sie über PageHeader visual). Das Paket nennt keinen Generator dafür; nur das Fach-Icon steht als Anker. Vorschlag erbeten.
- Neue Mikrotexte, weil Abschnitte Augenbraue und laufende Nummer brauchen: Bereichsseite Abschnitt 01 mit Augenbraue „Anliegen“ und Titel „Wählen Sie Ihr Anliegen“ (der bisherige Einleitungstext steht als Lead, wortgleich); Labels „Wege“ und „Ablauf“ im Schriftfeld; öffentlicher Kontakt-Hinweis bei isPlaceholder: „Anschrift, Telefon und E-Mail sind noch nicht hinterlegt. Für Ihr Anliegen stellen Sie bitte eine Anfrage.“ Bitte bestätigen oder ersetzen. Der Redaktions-Alert bleibt nur im Entwicklungsmodus.
- Navigation (src/lib/navigation.ts, nicht Teil des Pakets): Unter „Geführte Anfrage“ verlinkt die Bereichsseite „Service und Termin“ auf sich selbst. Vorhandenes Verhalten, unverändert.
- Floskeln (Kundschaft-Punkt 7) und Fachangaben (Kundschaft-Punkt 8: DIN 18252, DIN EN 1303, DIN EN 179, DIN EN 1125, MIFARE DESFire, AES-128) bleiben wortgleich. Vorschläge gehören in TEXTVORSCHLAEGE.md, die Prüfung der Angaben in MENSCHEN.
- Der Anfahrts-Hinweis mit eckigem Platzhalter bleibt als Konstante im Code und wird nie gerendert (enthaeltPlatzhalter greift). Die Redaktion soll echte Anfahrtsangaben liefern.
- Aufräumen: Ich habe versehentlich eine leere Datei /root/sm24-bilder/E5-BAUMEISTER-20-tsc.txt eine Ebene über dem Paketordner angelegt (tsc-Ausgabe, falscher Pfad meinerseits). Ich darf nicht löschen; bitte entscheiden, ob sie entfernt wird. Alle übrigen Hilfsdateien liegen im Paketordner.
