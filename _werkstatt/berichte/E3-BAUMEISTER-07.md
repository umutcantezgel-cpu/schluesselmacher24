# E3-BAUMEISTER-07 · Bericht und Abnahme

Workflow `wf_f448236a-3de`. Bau, Prüfung Runde 1 (abgelehnt), Reparatur, Prüfung Runde 2 (bestanden). Abnahme und Nacharbeit durch den Orchestrator siehe D-025.

## Letzter Bericht des Baumeisters

E3-BAUMEISTER-07 · Runde 2 (nach Prüferbefund aus Runde 1)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/autoschluessel/page.tsx. In dieser Runde nur eine Zeile geändert: die dd-Klasse der Kennzahlen (Zeile 308).
- Die Paketdatei _werkstatt/pakete/E3-BAUMEISTER-07.md wurde nicht geändert. Nichts committet, nichts gepusht, nichts gelöscht.

WAS UND WARUM
- Muss, Kennzahlen (dd): Zeile 308 steht jetzt auf dem Paketwortlaut `mt-1 font-mono text-title-sm font-semibold tabular-nums text-foreground`. Vorher war `text-small sm:text-title-sm` verwendet. Die Startseite nutzt ebenfalls text-title-sm. Gemessen bei 390/768/1440 px: Schriftgrößen 16/16,7/18 px. „Termin mit Anzahlung“ bricht auf dem Telefon über zwei Zeilen und bleibt in der Zelle. Kein Überlauf (scrollWidth = clientWidth).
- Muss, Tablet-Bildbeleg: eigene Aufnahme mit --ganz nachgewiesen, angesehen. Vollständig, kein Überlauf, nichts abgeschnitten.
- Soll, Tastaturfokus: Tab-Lauf auf Desktop und Mobil. Alle 12 Begriffslinks (#leistungen) und alle 9 Markenlinks erhalten :focus-visible mit sichtbarem Ring (2 px Versatz, 2 px Ring). Protokoll tastatur-protokoll.json, Fokusbilder fokus-*.png.
- Soll, Ablauf im Scrollverlauf: Desktop, Scrollstellen 0/20/40/60/80/100 % des Abschnitts. Füllung (sm24-scrub-y) scaleY 0,68, dann 0,92, dann 1,00 ab 40 %. Marken (sm24-scrub-marke) skalieren gestaffelt von 0,87 bis 1,00. Ein Ausreißer ist nicht aufgetreten.
- Soll, reduzierte Bewegung: Ablauf mit reduced-motion hat 0 laufende Animationen. Füllung und Marken stehen im Endzustand. B-21 mit reduced-motion: 0 Animationen, alle vier Ansichten opacity 1.
- Soll, Staffel B-21: Einzelbilder bei 0/225/450/675/900 ms. Gemessen: 53 Animationen (wie im Prüferprotokoll), Ansicht-Verzögerungen 0/120/240/360 ms, je 600 ms Dauer, keine unendlichen. Bei 225 ms sind zwei Ansichten sichtbar (01 und 02), 03 startet bei 240 ms. Das korrigiert den Prüferbefund „drei Ansichten bei 225 ms“.
- Soll, Car zu IconFahrzeugmarke: nicht umgesetzt, siehe offene Frage 1.
- Nicht geändert: generateMetadata, Props, Datenzugriffe, TOPIC_GROUPS-Inhalte, Links, Hinweise, FAQ, steps, Alert-Text, Leads, Tests.

GEMEINSAME DATEIEN
- Keine Änderung. Freie Werte in der Datei: werte-suche 0 Funde. Keine neuen Tokens gefordert.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0 ohne Ausgabe.
- eslint auf die Datei: Exit 0.
- vitest run src/components: 25 Dateien, 740 Tests bestanden.
- werte-suche: 0 Funde, 0 Ausnahmen.
- grep lucide-react: kein Treffer.
- Muss-Befunde 2 von 2 erledigt. Soll-Befunde 4 von 4 belegt, bis auf die Car-Zuordnung, die als offene Frage bestätigt wird.

BILDBELEGE (neuer Ordner, Vorgängerordner unangetastet)
- /root/sm24-bilder/E3-BAUMEISTER-07-runde2/autoschluessel__{mobil,tablet,desktop}__ganz.jpg
- Fokus: fokus-desktop-begriff.png, fokus-desktop-marke.png, fokus-mobil-begriff.png, fokus-mobil-marke.png
- Ablauf: ablauf-bewegung-{0,20,40,60,80,100}.png und ablauf-reduziert-{0,20,40,60,80,100}.png
- B-21: b21/autoschluessel__desktop__schluesselarten-figure__{0..4}.jpg, b21-ende.png, b21-reduziert.png
- Protokolle: bild-*.json, werte-suche.json, tastatur-protokoll.json, bewegung-runde2.json, bewegung-b21.json
- Prüferbild (Vergleich): /root/sm24-bilder/E3-BAUMEISTER-07-pruefung-r1/autoschluessel__tablet__ganz.jpg

OFFENE FRAGEN
1. Car zu IconFahrzeugmarke: Bitte bestätigen. Umgesetzt bleibt IconReparaturAustausch für „Reparatur und Sonderfälle“. Das Paket nennt diese Zuordnung für die dritte Gruppe ausdrücklich, und das einzige Car der Altdatei stand dort. IconFahrzeugmarke wird nicht verwendet, weil keine der drei Gruppen eine Fahrzeugmarke beschreibt. Eine Verwendung im Abschnitt „Fahrzeuge“ wäre eine neue Gestaltungsentscheidung.
2. Die Browser-Auskunft zur Taktfunktion der Ansichten lautet „linear“, obwohl globals.css --kurve-enter vorsieht. Ungeklärt, außerhalb meiner Datei.
3. Fremd, Fuß: Die Messung meldet bei den Öffnungszeiten-Feldern im Fuß eine minimale Überschreitung der rechten Kante. Nicht bearbeitet. Bitte prüfen lassen.
4. Bildplatzhalter „Eigene Werkstattaufnahme“ und „Eigene Aufnahme aus dem Betrieb“ behaupten vorhandene Fotos, im Code liegt nur das Motiv. Texte unverändert, Sache des Orchestrators.

=== ENDE E3-BAUMEISTER-07 · BEREIT ZUR RÜCKGABE ===

## Prüfung Runde 1 · abgelehnt

- **muss:** Kennzahlen (dd) weichen vom Paketwortlaut ab: src/app/(site)/autoschluessel/page.tsx Zeile 308 nutzt `text-small sm:text-title-sm`, das Paket verlangt `text-title-sm font-semibold tabular-nums`. Die Abweichung ist im Bericht als offene Frage 3 gemeldet, aber nicht freigegeben. Entweder Freigabe durch den Orchestrator oder Angleich an den Paketwortlaut.
- **muss:** Bildbeleg Tablet fehlt im Baumeister-Bericht. Schritt 10 verlangt Bilder mobil, tablet und desktop mit --ganz. Der Bericht belegt nur mobil und desktop. Der Prüfer hat die Tablet-Aufnahme nachgeholt: /root/sm24-bilder/E3-BAUMEISTER-07-pruefung-r1/autoschluessel__tablet__ganz.jpg. Sie zeigt keinen Überlauf und nichts Abgeschnittenes.
- **soll:** Tastaturfokus ist nicht geprüft (Baumeister-Bericht und Prüfer). Die Bildprüfung verlangt `Fokus sichtbar`. Die Begriffslinks (Zeile 395-402) und Markenlinks (Zeile 482-488) brauchen einen Tastaturlauf.
- **soll:** Bewegung nur als Ruhebild belegt: Der Ablauf (Zeile 442-443, sm24-scrub-y/marke) wurde nicht im Scrollverlauf geprüft. Die reduzierte Variante (prefers-reduced-motion) ist für Ablauf und B-21 nicht belegt. Die Staffel des großen Moments ist aus den Einzelbildern grob belegt (Bild 0 leer, 225 ms drei Ansichten, 450 ms vierte ausblendend, 675 ms und 900 ms vollständig). Die exakten Zeiten wurden nicht gegen bewegung-b21.json gegengeprüft.
- **soll:** Zuordnung Car → IconFahrzeugmarke des Pakets ist nicht umgesetzt. Die Datei nutzt Car nur in der Gruppe Reparatur (Zeile 156), dort IconReparaturAustausch. Das Paket widerspricht sich selbst; die Wahl ist im Bericht als offene Frage 1 markiert und begründet. Bitte bestätigen.
- **hinweis:** Tonwechsel des Ablaufs auf sunken (Zeile 414) ist nicht im Paket vorgegeben. Die Tonfolge ist abwechslungsreich, die Wahl ist im Bericht als offene Frage 4 gemeldet.
- **hinweis:** AreaScope um die ganze Seite (Zeile 266 und 537) ist eine Ergänzung ohne Paketvorgabe. Sie ist für text-area-strong und bg-area nötig, display: contents ändert das Layout nicht. Als Ergänzung gemeldet (offene Frage 5).
- **hinweis:** Wert ohne Token: `leading-relaxed` in der Weiterführend-Liste (Zeile 529). Der Wert steht nicht im K-005a-Auszug. Das Ergebnis der werte-suche ist 0 Funde, die Gegenprobe per grep findet ihn. Der Bericht meldet ihn unter GEMEINSAME DATEIEN.
- **hinweis:** Zusätzlicher Hover-Effekt `hover:underline` am Link Zur Seite (Zeile 397), im Paket nicht genannt. Nur Farbe und Pfeilverschiebung sind vorgesehen.
- **hinweis:** Ausrichtung auf dem Desktop: Der Link Zur Seite steht etwas tiefer als der Begriff (Desktop-Ausschnitt desktop-teil-02.jpg). Der Markenname Mercedes-Benz umbricht im Desktop-Raster zweizeilig (desktop-teil-05.jpg). Beides ist ein Feinschliff.
- **hinweis:** Kern-Version: Das Paket nennt KERN 1.3. Die Datei _werkstatt/KERN.md steht auf 1.5, das Paket-Kopf sollte angeglichen werden. Der Baumeister hat 1.5 angewendet. Ohne Auswirkung auf die Seite.
- **hinweis:** Einordnung zeigt im ImagePlaceholder ohne Foto eine unbeschriftete Schlüsselzeichnung (Zeile 352-360). Das Paket verlangt ImagePlaceholder an dieser Stelle; fehlendes Werkstattfoto ist Inhaltsfrage.
- **hinweis:** Fremd (nicht dem Paket zuzuordnen): Im Fuß sichtbar der Platzhalter „Hinweis für die Redaktion: Firmendaten sind noch Platzhalter.“ (site-footer, Orchestrator). Er verstößt gegen das Kriterium `keine sichtbaren Platzhalter` der Bildprüfung und sollte vor der Abnahme entfernt werden.
- **hinweis:** Fremd: Im Arbeitsbaum sind neben der Paketdatei weitere Dateien geändert (globals.css, layout.tsx, (site)/page.tsx, site-footer.tsx, profilschnitt.tsx und .test.tsx, schliessplan.tsx, area-theme.ts). Die Zuordnung zum Orchestrator ist nicht überprüfbar. Dateien außerhalb der Paket-Schreibrechte sind nicht Gegenstand dieses Pakets.
- **hinweis:** Prüfer-Eigenbeleg: Vor dem Lauf habe ich eine Hilfsdatei _werkstatt/tmp-x im Repo angelegt und mit rm -f wieder gelöscht. Sie war vorher nicht im Git-Status, es ging also keine fremde Datei verloren. Das verstößt gegen die Regel „nie löschen“ nur formal, ist aber zu melden.
- **hinweis:** Bildartefakte: Das Next-Dev-Badge „N“ (unten links) und die feste Aktionsleiste unten überlagern die Vollseitenaufnahmen. Das ist ein Werkzeugeffekt, kein Befund der Seite.

Prüfungen: Schnellprüfung mit Zahlen:
- npx tsc --noEmit: Exit 0, keine Ausgabe, 0 Fehler (Protokoll /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/tsc-r1.txt).
- npx eslint "src/app/(site)/autoschluessel/page.tsx": Exit 0, 0 Befunde.
- npx vitest run src/components: 25 Dateien bestanden, 740 Tests bestanden, 0 fehlgeschlagen (Protokoll im scratchpad vitest-r1.txt).
- werte-suche.mjs auf die Datei: 0 Funde, 0 Ausnahmen (JSON: _werkstatt/protokolle/werte-suche-2026-10-16_07-11-35.json).
- grep -n "lucide-react": kein Treffer (Exit 1).
- Eigene Gegenprobe freie Werte: nur duration-quick-Treffer sowie leading-relaxed (Zeile 529, Tailwind-Standard, kein Token).
- Tokens belegt: text-caption = 0.75rem (12 px, erfüllt ≥ 12 px), text-small mindestens 13 px, Klasse tracking-label-eng in tailwind.config.ts vorhanden.
- Git: Paketdatei geändert (+127/-102). Weitere Dateien im Arbeitsbaum nicht Teil dieses Pakets.
- Entwicklungsserver Port 3001: HTTP 200. Messfenster-Sperre /tmp/sm24-messfenster.lock: nicht vorhanden, vor jedem Lauf geprüft.
- Bildprüfung: mobil (390 px) in 10 Abschnitten, tablet (768 px) in 8 Abschnitten, desktop (1440 px) in 7 Abschnitten gesichtet. Kein horizontaler Überlauf, nichts abgeschnitten, Begriffe und Beschriftungen lesbar. Die fünf B-21-Einzelbilder gesichtet: Bild 0 (0 ms) ohne Ansicht, Bild 1 (225 ms) drei von vier, Bild 2 (450 ms) vierte Ansicht ausblendend, Bild 3 und 4 (675 und 900 ms) alle vier sichtbar.
- Nicht geprüft: Tastaturfokus, reduzierte Bewegung, Scroll-Verlauf des Ablaufs (nur Ruhebilder), exakte Staffelzeiten gegen Protokoll.
- Prüfer-Dateien angelegt: Ordner /root/sm24-bilder/E3-BAUMEISTER-07-pruefung-r1 mit den Gesamtbildern, b21-Einzelbildern, Ausschnitten und Protokollen. Keine Projektdatei geändert, keine Datei unter /dev angefasst, nichts committet. Hilfsdatei _werkstatt/tmp-x im Repo angelegt und wieder entfernt (siehe Befund).

## Prüfung Runde 2 · bestanden

- **soll:** Zuordnung Car zu IconFahrzeugmarke (Paket, Abschnitt Zuordnung in dieser Datei) ist nicht umgesetzt. In src/app/(site)/autoschluessel/page.tsx Zeile 156 steht IconReparaturAustausch für „Reparatur und Sonderfälle“, wie das Paket für diese Gruppe verlangt. IconFahrzeugmarke (src/components/visual/icons/fahrzeugmarke.tsx) wird nirgends verwendet. Das Paket widerspricht sich hier: Das einzige Car der Altdatei stand in genau dieser Gruppe. Die Entscheidung des Baumeisters ist nachvollziehbar und als offene Frage markiert. Der Orchestrator entscheidet. Sieht er Car zu IconFahrzeugmarke als bindend an, wird der Befund zum muss.
- **soll:** Einordnung, Bildfläche (Zeilen 352 bis 359): Der ImagePlaceholder zeigt kein Werkstattfoto, sondern eine generierte Rasterzeichnung mit Schlüssel. Auf Mobil, Tablet und Desktop wirkt die Fläche als Platzhalter. Die Texte „Eigene Aufnahme aus dem Betrieb“ und das Motiv stehen im Code (Zeilen 355 bis 357), sind im Bild aber nicht sichtbar. Offene Frage 4 des Baumeisters ist damit bestätigt. Entscheidung beim Orchestrator.
- **soll:** Fremd, nicht im Schreibrecht und nicht Teil dieses Pakets: Der gemeinsame Fuß zeigt auf jeder Breite den sichtbaren Hinweis „Hinweis für die Redaktion: Firmendaten sind noch Platzhalter.“. Die Seite enthält damit einen sichtbaren Platzhalter.
- **hinweis:** Offene Frage 3 des Baumeisters (Öffnungszeiten im Fuß über die rechte Kante) ist nicht reproduziert. Bei 390, 768 und 1440 px gilt scrollWidth gleich clientWidth. Außer dem Sprunglink und geclippten SVG-Pfaden in Bereichen mit overflow hidden ragt kein Element über den Viewport.
- **hinweis:** Mobil bricht die Hauptschaltfläche „Fahrzeug auswählen und Termin starten“ (Zeilen 285 bis 287) mit dem Einzelwort „starten“ um. Akzeptabel, kein Verstoß gegen das Paket.
- **hinweis:** Zeile 529 enthält `leading-relaxed` im Abschnitt Weiterführende Seiten. Das ist kein KERN-Token, und text-small trägt die Zeilenhöhe bereits selbst. werte-suche erfasst die Klasse nicht, weil sie nur [..]-Werte prüft. Empfehlung: Klasse entfernen.
- **hinweis:** Kennzahlen mobil (Zeile 308): „Termin mit Anzahlung“ ist zweizeilig (dd 43 px hoch), die Nachbarzellen sind einzeilig, die erste Reihe ist nicht bündig. Der Paketwortlaut der dd-Klasse ist erfüllt, kein Kernproblem.
- **hinweis:** Abschnitte Schlüsselarten (Zeile 317) und Einordnung (Zeile 329) haben denselben Standardhintergrund. Die Struktur wechselt (Kartenreihe gegen Text und Bild), daher ist die Anforderung erfüllt. Eine Tonstufe würde die Grenze klarer machen.
- **hinweis:** Kleinkram: Auf dem Desktop bricht „Mercedes-Benz“ in der Markenliste um. Der Link „Zur Seite“ im Begriffsliste-Raster sitzt optisch etwas tiefer als die Textzeile des Begriffs (min-h-touch, Zeile 397).
- **hinweis:** Die Ganzseitenbilder zeigen Entwicklungsartefakte: den Next-Indikator (N-Knopf) links unten und auf Mobil die fixierte Tableiste mitten im Bild. Das sind keine Seitenfehler, bei der Bildabnahme aber zu beachten.
- **hinweis:** Worktree-Stand: Bei Prüfbeginn war nur die Paketdatei geändert. tsc, eslint und vitest liefen etwa 05:17 bis 05:19 Uhr. Danach zeigten sich geänderte fremde Dateien in src/ (marken/, schluessel-nach-code/, src/components/autoschluessel/vehicle-facts.tsx und die neue vehicle-facts.test.ts). Sie gehören nicht zu E3-BAUMEISTER-07 und sind nicht geprüft. Die Zahlen von tsc und vitest beziehen sich auf den früheren Stand.
- **hinweis:** Prüfung hat neue Dateien angelegt, nichts überschrieben und nichts gelöscht: _werkstatt/protokolle/werte-suche-2026-10-16_07-18-57.json (Standardprotokoll des Werkzeugs) sowie der neue Prüfordner /root/sm24-bilder/E3-BAUMEISTER-07-pruefung-r2. Keine Projektdatei geändert, nichts committet, nicht gepusht.

Prüfungen: Schnellprüfung (Zahlen):
- git status --short: geändert war zu Beginn nur src/app/(site)/autoschluessel/page.tsx. Untracked: fremde _werkstatt-Dateien. Später zeigten sich fremde Änderungen in src/ (siehe Befund 11).
- npx tsc --noEmit: Exit 0, keine Ausgabe.
- npx eslint auf die Datei: Exit 0, keine Befunde.
- npx vitest run src/components: 25 Dateien, 740 Tests bestanden, 0 fehlgeschlagen.
- werte-suche.mjs auf die Datei: 0 Funde, 0 Ausnahmen.
- grep lucide-react: kein Treffer (Exit 1).
- Textvergleich HEAD gegen Datei: keine geänderten Texte mit Inhalt.

Messung über Port 3001 (eigenes Playwright-Skript, Rohwerte unter /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/pruefung-r2-messung.json):
- Überlauf: scrollWidth gleich clientWidth bei 390, 768 und 1440 px (390/390, 768/768, 1440/1440). Keine horizontale Scrollleiste.
- Schrift: kleinste sichtbare Schrift 12 px, HTML und SVG, auf allen drei Breiten. Kennzahl dd: 16 px (390), 16,74 px (768), 18 px (1440), IBM Plex Mono.
- Begriffslinks: 12 Stück, Höhe 44 px. Markenlinks: 9 Stück, 44 px, bei einem Desktop-Umbruch 64 px.
- Tastaturfokus (Tab-Lauf, je Gerät): alle 12 Begriffslinks und alle 9 Markenlinks erhalten :focus-visible mit Ring (box-shadow 2 px Versatz, 2 px Ring, rgb(18,113,237)). Fokusbilder geprüft: Ring sichtbar.
- Ablauf am Scrollen (Desktop 1440, 11 Stellen): Füllung scaleY 0 zu 0,03, 0,27, 0,50, 0,74, 0,97, 1,00, monoton. Marken gestaffelt von 0,85 auf 1,00. Tablet und Mobil ebenso monoton, ohne Sprung.
- Reduzierte Bewegung (Desktop, reduce): 0 laufende Animationen, Füllung und Marken ohne Transform, Figuren Deckkraft 1. Werkzeug bewegung.mjs reduziert: 0 laufende Animationen, 0 Befunde, 195 Textelemente geprüft.
- B-21 (bewegung.mjs einzelbilder, Desktop, Dauer 900 ms): 53 Animationen, Fenster 0 bis 900 ms, 0 unendliche. Bilder bei 0, 225, 450, 675, 900 ms: bei 0 ms keine Ansichtszeichnung sichtbar; bei 225 ms Ansichten 01 und 02; bei 450 ms alle vier; 675 und 900 ms stabil. Die Aussage des Baumeisters zur Staffel stimmt.

Bildbelege: Ganzseitenaufnahmen Mobil 390 x 10389 px (acht Ausschnitte angesehen), Tablet 768 x 8158 px (sechs Ausschnitte), Desktop 1440 x 6748 px (vier Ausschnitte). Gesehen: kein abgeschnittener Inhalt, keine Überlappung, Beschriftungen lesbar. Bildartefakte siehe Befund 10.

Ergebnis: bestanden, weil kein muss-Befund vorliegt. Die Befunde 1 bis 3 sind soll und werden vom Orchestrator entschieden. Der Befund 1 wird zum muss, wenn Car zu IconFahrzeugmarke als bindend gilt.
