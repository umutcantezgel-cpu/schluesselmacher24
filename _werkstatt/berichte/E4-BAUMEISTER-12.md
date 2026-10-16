# E4-BAUMEISTER-12 · Bericht und Abnahme

Workflow `wf_1f9e8729-882`. Bau, Prüfung Runde 1 (abgelehnt), Reparatur, Prüfung Runde 2 (bestanden). Abnahme und Nacharbeit durch den Orchestrator siehe D-027.

## Letzter Bericht des Baumeisters

E4-BAUMEISTER-12, Runde 2. Ratgeber-Übersicht und Artikelseite H12 sind überarbeitet. Beide Muss-Befunde sind behoben. Die Soll-Befunde sind bis auf eine bewusste Entscheidung umgesetzt.

GEÄNDERTE DATEIEN
- src/app/(site)/ratgeber/page.tsx
- src/app/(site)/ratgeber/[slug]/page.tsx

WAS UND WARUM
Muss (Befund 1, sichtbares Etikett "Inhalt"): Das sichtbare Etikett über dem Inhaltsverzeichnis ist gestrichen. Alt: `<p>Inhalt</p>` über der Liste. Neu: keins. Der nav bleibt mit aria-label="Inhalt". Die Liste hat den überflüssigen Abstand mt-3 verloren.

Soll (Befund 3, Desktop-Lücke in der Übersicht): Das Raster richtet sich nach der Anzahl der Beiträge je Bereich. Ein Beitrag steht über die volle Breite. Zwei Beiträge stehen in zwei Spalten (md:grid-cols-2). Drei oder mehr bleiben bei md:grid-cols-2 lg:grid-cols-3. Im Bestand hat nur der Bereich Autoschlüssel zwei Beiträge, die übrigen Bereiche je einen. Bildbeleg: ratgeber__desktop__desktop__ganz.jpg. Zwei Spalten und volle Breite sind gefüllt, keine leere Fläche mehr.

Soll (Anker-Abstand, Paket Schritt 5): Die Zwischenüberschriften (h2) im Artikel bekommen scroll-mt-28. So liegt die Zielüberschrift nach einem Klick auf das Inhaltsverzeichnis unter dem festen Kopf. Die Prüfung ist bestanden (siehe PRÜFUNG).

Nicht geändert, bewusst (Soll, Befund 2, Redundanz): Der Bereichsname steht je Abschnitt dreimal. Eyebrow und title sind laut Paket vorgeschrieben. Das Zellen-Etikett "Nummer und Thema" kommt aus dem Kern-Auszug. Die Entscheidung liegt beim Orchestrator (siehe OFFENE FRAGEN).

Weiterhin unverändert gegenüber Runde 1 und Paket: Kasten "Ihr nächster Schritt", Haarlinienlisten für "Passend dazu" und "Weiterlesen", Seitenraster lg:grid-cols-12, Messbreite über prose-sm24, Anker-Funktion ankerKennung, Stücklisten und Fachicons. Keine Logik, keine Inhalte und keine Props-Verträge verändert.

GEMEINSAME DATEIEN
Keine gemeinsamen Dateien geändert. Keine freien Werte gefunden (werte-suche: 0). Neu verwendet: scroll-mt-28 aus der Standard-Abstandsskala.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: exit 0, keine Fehler, auch nicht in fremden Dateien.
- npx eslint (beide Dateien): exit 0, kein Befund.
- npx vitest run src/components: 28 Dateien, 750 Tests, alle grün. Zahl unverändert.
- werte-suche.mjs (beide Dateien): 0 Funde, 0 Ausnahmen.
- grep lucide-react: kein Treffer.
- Lock /tmp/sm24-messfenster.lock: nicht vorhanden während aller Läufe.
- Anker-Prüfung (eigenes Skript, Port 3001): Klick auf den zweiten Inhaltsverzeichnis-Eintrag. Kopf-Unterkante und Überschriftoberkante: mobil 65 und 192 px, tablet 81 und 208 px, desktop 81 und 208 px. Die Überschrift liegt in allen drei Geräten frei unter dem Kopf. Protokoll: /root/sm24-bilder/E4-BAUMEISTER-12/sprung-ergebnis.json.
- Git-Diff: nur die zwei Dateien. Keine Änderung an getGuides, getGuide, Gruppierung, Filter, notFound, generateMetadata, generateStaticParams, JSON-LD, related-Logik oder nextStep.href. Keine neuen Client-Module.
- Keine Dateien gelöscht. Nichts committet oder gepusht.

BILDBELEGE (alle im Ordner /root/sm24-bilder/E4-BAUMEISTER-12/, Stand nach den Änderungen)
- Übersicht: ratgeber__mobil__mobil__ganz.jpg, ratgeber__tablet2__tablet__ganz.jpg, ratgeber__desktop__desktop__ganz.jpg
- Artikel: artikel__mobil__mobil__ganz.jpg, artikel__tablet2__tablet__ganz.jpg, artikel__desktop__desktop__ganz.jpg
- Auf allen geprüften Bildern nichts abgeschnitten, kein horizontaler Überlauf, Haarlinien gleichmäßig, Fokus nicht geprüft (kein Tastaturlauf in dieser Runde).

OFFENE FRAGEN
1. Entscheidung Orchestrator: Das Zellen-Etikett "Nummer und Thema" trägt den Bereichsnamen, und eyebrow und title tragen ihn ebenfalls. Vorschlag: nur Nummer im Zellen-Etikett. Abweichung vom Kern-Auszug, daher nicht eigenmächtig geändert.
2. Stray-Datei: /root/sm24-bilder/E4-BAUMEISTER-12-tsc.txt liegt außerhalb des Paketordners (leer, mein Fehler). Ich darf sie nicht löschen. Bitte entfernen.
3. Veraltete Bilder aus der Vorrunde (Stand 05:46) liegen noch im Ordner, u.a. ratgeber__ganz.jpg, ratgeber__tablet__ganz.jpg. Gültig sind die oben genannten. Nicht gelöscht.
4. werte-suche.mjs hat sein Protokoll unter _werkstatt/protokolle/ abgelegt (Werkzeugverhalten).

=== ENDE E4-BAUMEISTER-12 · BEREIT ZUR RÜCKGABE ===

## Prüfung Runde 1 · abgelehnt

- **muss:** Das sichtbare Etikett "Inhalt" über dem Inhaltsverzeichnis ist neuer Text (src/app/(site)/ratgeber/[slug]/page.tsx Z.77). KERN K-010 verbietet neue Inhalte; das Paket verlangt nur nav aria-label="Inhalt". Entweder das Etikett streichen (aria-label bleibt) oder die Freigabe des Orchestrators einholen.
- **soll:** Übersicht: Der Bereichsname steht je Abschnitt dreimal (eyebrow, title und das Etikett jeder Zelle, src/app/(site)/ratgeber/page.tsx Z.47 bis 50 und das Zellen-Etikett). Das Paket schreibt eyebrow und title vor, die sichtbare Redundanz bleibt aber eine Schwäche. Entscheidung beim Orchestrator.
- **soll:** Übersicht Desktop: Gruppen mit nur einem Beitrag belegen wegen lg:grid-cols-3 (ratgeber/page.tsx Z.57) nur ein Drittel der Breite, rechts bleibt eine leere Fläche (Bild ratgeber__desktop__ganz.jpg). Mobil unauffällig.
- **hinweis:** Pfeil in der Übersicht hat Größe 18 (Z.73, wie Startseite), in den Artikel-Haarlinienlisten 16. Das Paket nennt für die Übersicht keine Größe. Bitte bestätigen.
- **hinweis:** Die Sticky-Seitenleiste (Artikel, Desktop 1440 px) steht bis zum Ende der Rasterzeile fest (top 112 px bei Scroll 1200) und wandert am Seitenende nach oben aus dem Bild (asideTop -77). Layoutbedingt, kein Fehler gegen das Paket.
- **hinweis:** Ablage: Das tsc-Protokoll des Baumeisters liegt außerhalb des Paketordners (/root/sm24-bilder/tsc-E4-12.txt). Die werte-suche-Protokolle (untracked unter _werkstatt/protokolle/) entstehen durch das Werkzeug im Repo. Nichts gelöscht.
- **hinweis:** Fremde Änderungen im Arbeitsbaum (src/app/(site)/tuer-und-schliesstechnik/page.tsx und [slug]/page.tsx) nicht berührt. tsc und Tests zeigen dadurch keine Fehler.

Prüfungen: tsc --noEmit: 0 Fehler (Protokoll leer, /root/sm24-bilder/E4-BAUMEISTER-12-pruefung-r1/tsc-r1.txt). eslint beider Dateien: keine Ausgabe, Exit 0. vitest run src/components: 28 Dateien, 750 Tests, alle bestanden (vitest-r1.txt). werte-suche: 2 Dateien, 0 Funde, 0 Ausnahmen (werte-suche-r1.json). grep lucide-react: kein Treffer. Sprungprüfung (eigenes Skript sticky-pruefung.mjs, Port 3001, Desktop 1440): Ziel #pruefen-ist-noch-ein-schluessel-vorhanden bei Y 96, Kopf-Unterkante 81: frei. Mobil und Tablet hat der Baumeister gemessen, ich habe sie nicht nachgemessen. Bilder: je drei Ganzseiten für /ratgeber und /ratgeber/autoschluessel-verloren-was-tun, alle sechs angesehen: kein horizontaler Überlauf erkennbar, nichts abgeschnitten, mobile Beschriftungen lesbar, Inhaltsverzeichnis mobil vor dem Artikel, desktop rechts oben, benachbarte Übersichtsabschnitte wechseln Ton. Die mobile Ganzseite zeigte die Schlüsselzeichnung scheinbar teilweise verdeckt; im Ansichtsfenster 390x844 geprüft: vollständig, verdeckt war nur die feste Fußleiste der Entwicklungsumgebung. scrollWidth 390 gleich Fensterbreite. Nicht geprüft: Fokus-Sichtbarkeit im Bild.

## Prüfung Runde 2 · bestanden

- **soll:** Artikel, Desktop 1440 px: Zwischen dem Inhaltsverzeichnis (oben rechts) und „Passend dazu“ klafft eine Lücke von rund 400 px. Ursache: Die nav (src/app/(site)/ratgeber/[slug]/page.tsx Z. 76) steht außerhalb der aside (Z. 118). Beide Zeilen teilen sich die Höhe des zweizeiligen Artikels. Das Paket sieht das Inhaltsverzeichnis oben in der Seitenleiste vor. Abhilfe: nav in die aside verschieben. Bild: r2-ratgeber-autoschluessel-verloren-was-tun__desktop__ganz.jpg
- **soll:** Übersicht: Der Bereichsname steht je Abschnitt dreimal (eyebrow Z. 51, title Z. 52, Zellen-Etikett um Z. 73). Die Beitragsnummer 01 erscheint zusätzlich zur Abschnittsnummer 01 erneut. Der Kern schreibt „Nummer und Thema“ vor; der Baumeister hat die Entscheidung dem Orchestrator übergeben. Kein Kern-Verstoß, aber sichtbare Redundanz.
- **soll:** Übersicht: Alle Abschnitte haben denselben Aufbau (Kopf, Icon, Haarlinienliste). Nur der Ton wechselt (Z. 44). Das Prüfkriterium „benachbarte Abschnitte mit verschiedener Struktur“ ist damit nicht erfüllt. Bild: r2-ratgeber__desktop__ganz.jpg
- **hinweis:** Fokus-Sichtbarkeit ist nicht belegt. Die Paket-Bildprüfung nennt „Fokus sichtbar“; es gab weder einen Tastaturlauf noch eine Fokus-Aufnahme. Der Baumeister hat das ebenfalls nicht geprüft.
- **hinweis:** Werkzeug-Falle: lib.mjs fällt ohne SM24_BASIS_URL auf Port 3000 zurück. Dort liefert die Seite einen älteren Stand ohne Anker-IDs. Gültige Ergebnisse nur mit SM24_BASIS_URL=http://localhost:3001. Meine Anker-Prüfung lief mit 3001.
- **hinweis:** Bilder enthalten das Next.js-Dev-Overlay („N“-Badge) und auf Mobil die fixierte Tableiste mitten in der Ganzseite. Beides sind Erfassungsartefakte, keine Paketfehler.
- **hinweis:** Außerhalb des Pakets: _werkstatt/protokolle enthält unversionierte Protokolle des Baumeisters (werte-suche-*.json, bewegung-einzelbilder-*.json). Die Datei /root/sm24-bilder/E4-BAUMEISTER-12-tsc.txt, die der Baumeister als Stray meldet, habe ich nicht geprüft.

Prüfungen: tsc --noEmit: Exit 0, keine Ausgabe, also keine Fehler in eigenen oder fremden Dateien. eslint (beide Dateien): Exit 0, kein Befund. vitest run src/components: 28 Dateien, 750 Tests, alle grün, Zahl unverändert. werte-suche (beide Dateien): 0 Funde, 0 Ausnahmen. grep lucide-react: kein Treffer. Zusätzlich grep auf text-xs/sm/base/lg/xl, tracking-wider, leading-relaxed, foreground-subtle, max-w-none und Arbitrary-Werte: kein Treffer. Lock /tmp/sm24-messfenster.lock: nicht vorhanden bei allen Läufen. Logikwächter: nicht anwendbar. Anker-Prüfung (Port 3001, Klick auf Eintrag 2 im Autoschlüssel-Artikel): Kopf-Unterkante und Überschrift-Oberkante mobil 65/192 px, tablet 81/208 px, desktop 81/208 px. Überschrift verdeckt: nein auf allen drei Geräten. Protokoll: /root/sm24-bilder/E4-BAUMEISTER-12-pruefung-r2/anker-pruefung-r2.json. Bilder: 6 Ganzseiten (Übersicht und Artikel, je mobil, tablet, desktop). Alle gesichtet: kein Überlauf, nichts abgeschnitten, Beschriftungen mobil lesbar, keine sichtbaren Platzhalter, Abschnitte mit Tonwechsel. Fokus nicht geprüft. Keine muss-Befunde.
