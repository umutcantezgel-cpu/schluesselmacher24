# E5-BEFUND-H12 · Bericht und Abnahme

Workflow `wf_915efddc-a38`, 1 Prüfrunde, bestanden. Abnahme durch den Orchestrator:

- **Eigene Bilder** (Port 3001, 1440 × 900 und 390 × 844, nach 2,5 s): Kopf 7/5 mit Ablaufzeichnung „01 sichern · 02 prüfen · 03 bestellen“, mobil die schmale Fassung (Schrift etwa 14 px); Abschnittsnummern und Profillinien-Trenner; Seitenleiste mit Verzeichnis und „Weiterlesen“.
- **Lesefortschritt belegt (offene Frage 1):** Nach Scrollen in Abschnitt 03 ist genau die Nummer 03 primärfarben (`rgb(20, 91, 184)`), die übrigen `rgb(79, 90, 109)`; die Leiste ist sichtbar und wächst mit dem Artikel (oben 0).
- **Nacharbeit:** geschütztes Leerzeichen als lesbares `\u00a0` statt unsichtbarem Zeichen; statt `-mt-12` eine allgemeine Regel in `globals.css` (erste Überschrift einer Lesespalte oben bündig); `text-balance` an der h1 von `PageHeader` (Wunsch des Baumeisters).
- **Entschieden:** Abschnittsnummern `text-small` (Entscheidung gilt); „Weiterlesen“ in der Seitenleiste ohne Nummer (Seitenleiste, kein Abschnitt); Profillinien zeichnen beim Laden (kein neues Client-JavaScript); Knopftext „Anfrage für Ersatzschlüssel starten“ ist Inhalt (`content/guides.json`) → TEXTVORSCHLAEGE.
- **Prüferbefund „Abschnitte strukturgleich“:** bewusst – ein Artikel ist eine Lesespalte; Ordnung über Nummern und Trenner, nicht über wechselnde Bauformen (K-009, Ratgeber „bewusst ruhig“).

## Prüfurteil

- **soll:** Mobil bleibt der Knopf „Ihr nächster Schritt“ zweizeilig. Der Pfeil sitzt über justify-between am rechten Rand des vollen Knopfes und nicht am Text. Befund M02 (Pfeil an das letzte Wort binden) ist nur teilweise erfüllt; der kürzere Wortlaut ist als Wunsch offen. Stelle: src/app/(site)/ratgeber/[slug]/page.tsx Zeilen 167–173.
- **soll:** Die Abschnitte sind strukturgleich (Zwischenüberschrift mit Nummer, Absatz). Nur die Profillinie trennt sie. Der Befund verlangt benachbarte Abschnitte mit verschiedener Struktur; die Entscheidung des Orchestrators sieht nur diesen Trenner vor. Sichtbar auf allen drei Artikeln.
- **hinweis:** Der Block Weiterlesen verschwindet vollständig, wenn keine Einträge bleiben (Zeile 183, weiterlesen.length > 0). Vorher stand die Überschrift immer. Nicht im Paket genannt, für die drei Artikel unauffällig.
- **hinweis:** Die Profillinien-Trenner zeichnen sich beim Laden, nicht beim Sichtbarwerden (Zeilen 148–149). Das ist der im Baumeister-Bericht genannte Wunsch; kein Verstoß gegen das Paket.
- **hinweis:** Versionsangabe: Der Auftrag nennt KERN 1.8, Paket und Bericht nennen 1.11. In _werkstatt/KERN.md endet die Änderungsliste mit 1.12 (Commit ca07be7). Gearbeitet wurde nach 1.11; 1.12 betrifft diese Datei nicht. Der Orchestrator sollte die Versionsangabe klären.
- **hinweis:** /tmp/h12-check.html (09:19) ist eine Hilfsdatei außerhalb des erlaubten Ordners /root/sm24-bilder/<Paket>/. Sie liegt nicht im Repository. Der Baumeister hat sie gemeldet; ich habe sie nicht angefasst.
- **hinweis:** _werkstatt/berichte/E5-KUNDSCHAFT.md enthält keinen Abschnitt zu src/app/(site)/ratgeber/[slug]/page.tsx. Die Bestandsaufnahme, auf die das Paket verweist, fehlt für diese Datei.
- **hinweis:** Die Ganzseitenbilder mit 2,5 s Wartezeit zeigen den Desktop-Kopf nur als Raster. Im Ansichtsfenster ist die Ablaufzeichnung nach 2,5 s vollständig (vp-kopf-desktop-2500ms.jpg). Das ist ein Momentbild der Animation, kein Fehler der Seite.
- **hinweis:** Die mobilen Ganzseitenbilder zeigen fixierte Elemente (untere Leiste, Schaltfläche N) über dem Inhalt. Das entsteht durch die Aufnahme, nicht durch die Seite.

## Bericht des Baumeisters

E5-BEFUND-H12 · Rolle Baumeister · Modell Haiku 5.5 · Kern-Version 1.11 · Befundpaket 1 von höchstens 2 (Ratgeber-Artikel)

GEÄNDERTE DATEIEN
- src/app/(site)/ratgeber/[slug]/page.tsx (einzige Datei; kein Commit, kein Push, nichts gelöscht)

WAS UND WARUM
1. Kopf mit Blickfang (Grafik 1, Komposition 1 und 3, Farbe, Bewegung 2): Die Fachgrafik steht in PageHeader visual (7/5) als ImagePlaceholder frei mit slot = { ...guide.image, visual: ablaufAusText(guide.excerpt) ?? guide.image.visual }. Die Ablaufzeichnung kommt aus der Unterzeile „erst sichern, dann prüfen, dann bestellen“ (B-23). Die Bildfläche oben im Artikel entfällt. Mit sizes „(min-width: 1024px) 40vw, 100vw“.
2. Überschrift (Typografie 1): Anzeigetitel guide.title.replace(' — ', ' — '); Metadaten und JSON-LD behalten den Originaltitel, Brotkrume ebenfalls.
3. Nummern vor den Zwischenüberschriften (Typografie 2): je h2 eine Zeile „01“… in font-mono tabular-nums text-primary, text-small font-semibold, aria-hidden, innerhalb der h2 als Block-Zeile über dem Titel. id und Text der h2 bleiben gleich. Der erste Abschnitt hat keinen Oberabstand mehr (-mt-12 auf dem Textblock hebt den mt-12 der ersten h2 auf).
4. Trenner (Komposition 2): zwischen zwei Abschnitten die Profillinie (klein, text-primary, my-12, Text = Überschrift des folgenden Abschnitts). Keine Client-Komponente.
5. Lesefortschritt (Bewegung 1, B-24): sm24-lesen auf dem gemeinsamen Vorfahren (Raster-Div), sm24-lesen-artikel auf article, data-abschnitt 1–6 auf den Abschnitten, sm24-lesen-nummer mit data-zu in den Verzeichnissen. Leiste (sm24-lesen-leiste, bg-primary, w-0.5) mit Haarlinie (w-px bg-border) nur im Seitenleisten-Verzeichnis (ab lg). Mobil steht das Verzeichnis vor dem Text und hat keine Leiste.
6. Weiterlesen (Details 1 und 3): Liste aus verwandten Beiträgen zuerst, dann internen Links; ohne href von nextStep, ohne doppelte href; Zeile = Link mit GlyphPfeilRechts (B-06), Titel text-small font-semibold. Eingabe-Markup bleibt Mono-Augenbraue „Weiterlesen“.
7. Knopf „Ihr nächster Schritt“ (Details 2): Box p-4 sm:p-6; Knopf mit w-full justify-between text-left sm:w-auto, Pfeil über ButtonLink pfeil.
Unverändert: generateStaticParams, generateMetadata, ankerKennung, Datenabruf, Schriftfeld-Logik, JSON-LD, alle Texte mit Inhalt, Props aller Bausteine.
Mikrotext-Änderungen: keine Wortlaut-Änderung. Alt-Neu-Liste: leer (nur Typografie des Titels: Gedankenstrich mit geschütztem Leerzeichen).

GEMEINSAME DATEIEN (nicht geändert, Wünsche)
- Knopftext „Anfrage für Ersatzschlüssel starten“ (Inhaltsdaten) bricht mobil zweizeilig. Wunsch: kürzerer Wortlaut im Datensatz.
- PageHeader h1 ohne text-balance (Befund wollte text-wrap: balance). Wunsch: text-balance an der h1 von PageHeader für Erzählansichten.
- Profillinie-Trenner zeichnen sich beim Laden, nicht beim Sichtbarwerden (InView wäre Client-JS).

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: fehlerfrei (Exit 0).
- npx eslint für die Datei: ohne Befund.
- npx vitest run src/components src/lib: 60 Dateien, 1100 Tests, grün.
- werte-suche.mjs: keine Funde.
- grep lucide-react: kein Treffer.
- Gerenderte Seite (localhost:3001): keine sichtbaren Platzhalter im Inhalt. Fundstelle im Fuß („Firmendaten sind noch Platzhalter“) ist der Entwicklungs-Redaktionshinweis aus dem Fuß (D-016) und nicht Teil dieses Pakets.
- Verzeichnis und Anker geprüft: Anker unverändert, Weiterlesen ohne Schritt-Knopf-href und ohne Doppelungen (Beispiel: Artikel autoschluessel-verloren-was-tun zeigt nur „Kopie oder Programmierung“ und „Alle Ratgeber“).
- Ablaufzeichnung: mobil und desktop vollständig; der erste Desktop-Lauf (ohne Wartezeit) zeigte nur das Raster, nach 2,5 s Wartezeit steht die Zeichnung.
- Nicht geprüft: Lesefortschritt im Scroll-Zustand (siehe offene Fragen).

BILDBELEGE
Ordner: /root/sm24-bilder/E5-BEFUND-H12/
- ratgeber-autoschluessel-verloren-was-tun__desktop__ganz.jpg (Kopf 7/5 mit Ablaufzeichnung nach kurzer Wartezeit ist unvollständig, siehe kopf-warte)
- kopf-warte__desktop.jpg (Kopf nach 2,5 s: Ablaufzeichnung 01 sichern, 02 prüfen, 03 bestellen vollständig)
- ratgeber-autoschluessel-verloren-was-tun__mobil__ganz.jpg (Kopf mobil mit Zeichnung; Verzeichnis vor Text; Knopf zweizeilig)
- ratgeber-autoschluessel-verloren-was-tun__tablet__ganz.jpg
- ratgeber-zylinder-richtig-ausmessen__mobil__ganz.jpg / __desktop__ganz.jpg (Zeichnung als Fach-Fachgrafik zu zylinder, Nummern und Trenner)
- ratgeber-welche-schliessanlage-passt__mobil__ganz.jpg / __desktop__ganz.jpg (fünf Abschnitte, Verzeichnis mit Nummern 01–05, Weiterlesen)
Protokolle: bild-<artikel>-<gerät>.json im selben Ordner.

OFFENE FRAGEN
1. Lesefortschritt (B-24) ist nicht per Scroll-Bild belegt. Bild bei Scroll bis Abschnitt 03 (Desktop) fehlt noch.
2. Größe der Abschnittsnummern: Befund „text-title-sm“, Entscheidung „text-small“. Umgesetzt: text-small. Bitte bestätigen.
3. K-006 verlangt laufende Nummern auch bei „Weiterlesen“; die Entscheidung verlangt die Mono-Augenbraue ohne Nummer. Umgesetzt: ohne Nummer.
4. Der Bericht E5-KUNDSCHAFT.md enthält keinen Abschnitt für diesen Artikel.
5. Hilfsdatei /tmp/h12-check.html liegt außerhalb des erlaubten Ordners. Nicht gelöscht (Löschen untersagt). Bitte entfernen lassen oder im Protokoll vermerken.
6. Kern-Version: Auftrag nennt 1.8, Paket und KERN.md führen 1.11. Gearbeitet nach 1.11.

=== ENDE E5-BEFUND-H12 · BEREIT ZUR RÜCKGABE ===
