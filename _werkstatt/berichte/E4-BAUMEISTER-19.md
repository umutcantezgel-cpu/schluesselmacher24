# E4-BAUMEISTER-19 · Bericht und Abnahme

Workflow `wf_8c908891-137` (Welle E), 2 Prüfrunde(n), letzte Prüfung bestanden. Abnahme und Nacharbeit durch den Orchestrator (D-033), Commit siehe PLAN.

## Abnahme durch den Orchestrator

- Ganzer Unterschied gegen `fab24ac` gelesen. Alle Texte sind erhalten. Der Satz „Verantwortlich für die Nutzung ist die Betreiberin oder der Betreiber der Anlage“ steht jetzt als Text statt als Alert-Titel, die Karten-Etiketten als Konstante `WEITER`.
- Soll-Befund „eigene Icon-Tabelle“: `SERVICE_ICONS` und die eigene Fläche entfallen. Die Leistungsseite nutzt wieder `ImagePlaceholder` mit seiner Rangfolge. `fachIconFuerMotiv` liefert für alle sieben Motive dasselbe Fach-Icon (geprüft); „Smarte Funktionen“ ist seit D-032 (`hatFunk`) kein Funkschlüssel mehr.
- Soll-Befund „leere Fläche auf dem Tablet“: Das Fach-Icon in `ImagePlaceholder` wächst mit der Fläche (¼ der Breite, 64–160 px, mit Test). Die Leistungsseite nutzt ihr Zwölferraster schon ab `md`. Auf 768 px stehen Text und Bild nebeneinander (Bild angesehen).
- Soll-Befund „Hauseingang mobil nicht lesbar“: `tuer-schutz` exportiert `TUER_SCHUTZ_AUSSCHNITT`, und die Legenden tragen `data-legende`. Unter 640 px setzt globals.css die Legende auf 16 Einheiten, und die Fläche zeigt nur den Ausschnitt. Gemessen sind 12,5 px statt 9,4 px, nichts ragt über den Rand. Das gilt auch für die Türtechnik-Seite (dieselbe Zeichnung, gleicher Mangel).
- Soll-Befund „Abschnittsnummern“: Die beiden Schlussabschnitte sind zu „04 · Weiterlesen / Passende Seiten“ zusammengeführt, als Stückliste mit zwei Einträgen. Darunter folgen die Redaktionsverweise ohne doppelte Ziele (beide zeigen heute auf dieselben Seiten und entfallen dadurch).
- Logik-Gate: Die Sicherheitstechnik-Seiten stehen nicht unter dem Logikwächter; `pruefen` meldet 0 abweichend.

## Prüfurteil (letzte Runde)

- **soll:** Bildstelle der Leistungsseiten umgeht die Bildrangfolge aus ImagePlaceholder: eigene Tabelle SERVICE_ICONS (src/app/(site)/sicherheitstechnik/[slug]/page.tsx Z. 27-36) und eigene Fläche bg-area-soft/40 mit Icon 144 px (Z. 152-158). Das Paket verlangt Bildstellen aus den Daten; die Muster-Leistungsseite Türtechnik nutzt ImagePlaceholder unverändert. visualFuerMotiv liefert für alle sieben Motive null, fachIconFuerMotiv liefert dieselben Icons. Die Abweichung ist also nur Größe und Fläche, zusätzlich eine zweite Pflegestelle der Icon-Zuordnung.
- **soll:** Tablet (768 px): Die Fachfläche der Leistungsseiten füllt die volle Breite (etwa 744 x 558 px) mit einem 144-px-Icon, die Fläche wirkt leer. Beleg: sicherheitstechnik_videoueberwachung__tablet__teil-01 und -02. Vorschlag: auf dem Tablet Breite begrenzen oder das Verhältnis im Datenbestand kürzen; die offene Frage des Baumeisters bleibt offen.
- **soll:** Hauseingang der Bereichsseite (page.tsx Z. 156-168, visual tuer-schutz) ohne Ausschnitt: mobil sind die Beschriftungen optisch etwa 9-10 px groß, der Fließtext 15 px. Die Startseite setzt für mobile Zeichnungen den ausschnitt-Prop. Beleg: sicherheitstechnik__mobil__teil-02.jpg und zoom-bereich-mobil-hauseingang.jpg. Die Vorgabe Beschriftungen mobil lesbar ist damit nicht erfüllt.
- **soll:** Abschnittsnummern unvollständig: Der SectionHeading „Weiterlesen“ (page.tsx Z. 364-365) hat keine nummer, und der Abschnitt „Verbindung zur Mechanik“ (Z. 321-322) hat keinen Abschnittskopf. Schritt 2 des Pakets verlangt Abschnitte mit Nummern; die Startseite nummeriert jeden SectionHeading fortlaufend.
- **hinweis:** Logik-Gate ist kein Muss: Die zwei Dateien stehen nicht in GESCHUETZTE (_werkstatt/werkzeuge/logikwaechter.mjs), die Vorgabe abweichend 0 gilt nur für geschützte Dateien. Die Logik ist per Textvergleich und Diff belegt. Ob der Orchestrator sie in den Wächter aufnimmt und sichert, ist seine Entscheidung.
- **hinweis:** Berichtsbehauptung nicht belegt: Smarte Funktionen zeigte vor dem Paket keine Funkschlüssel-Zeichnung. motiv.ts ist gegen fab24ac unverändert (0 Diffzeilen); visualFuerMotiv liefert für „Anwendungsfoto: Smarte Funktionen“ null, weil hatFunk „funktion“ ausschließt. Vor dem Paket stand dort das Fach-Icon smarte-funktionen. Die Kundschaft-Angabe (motiv.ts:43) stammt von vor Welle E; die offene Frage ist gegenstandslos.
- **hinweis:** leading-relaxed steht siebenmal (page.tsx Z. 281, 328, 346; [slug]/page.tsx Z. 128, 139, 176, 221). D-025 (_werkstatt/ENTSCHEIDUNGEN.md Z. 254) streicht es, weil es kein Token ist. Die Startseite nutzt es nicht, das Türtechnik-Muster schon.
- **hinweis:** Hover-Verschiebung B-06 (Pfeil group-hover:translate-x-1, page.tsx Z. 146 und 253, [slug]/page.tsx Z. 229) hat keine motion-reduce-Variante. Die Startseite hat dieselbe Form; das Register B-06 nennt bei reduzierter Bewegung nur Farbe. Gemeinsames Muster, kein Fehler allein dieser Dateien.
- **hinweis:** Der Rechtskasten der Bereichsseite ist auf max-w-3xl begrenzt (page.tsx Z. 274); auf dem Desktop bleibt die rechte Hälfte leer. Geschmacksfrage, kein Fehler.
- **hinweis:** Fremder Befund: Der gemeinsame Footer zeigt auf allen drei geprüften Seiten den Redaktionshinweis „Firmendaten sind noch Platzhalter“ (Belege: sicherheitstechnik__desktop__teil-06, sicherheitstechnik__mobil__teil-07). Liegt nicht in den Schreibrechten, daher nur gemeldet.
- **hinweis:** werte-suche hat sein JSON-Protokoll im Repo abgelegt: _werkstatt/protokolle/werte-suche-2026-10-16_09-23-23.json (Werkzeugstandard). Nicht gelöscht und nicht committet.

## Letzter Bericht des Baumeisters

E4-BAUMEISTER-19, Runde 2 (Bereich und Leistungen Sicherheitstechnik)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/sicherheitstechnik/page.tsx
- /home/user/schluesselmacher24/src/app/(site)/sicherheitstechnik/[slug]/page.tsx

WAS UND WARUM (Befunde der Runde 1)
- Muss, Logikwächter: 'pruefen' zeigt abweichend 0 bei 15 Dateien. Die zwei Sicherheitstechnik-Dateien stehen nicht im Protokoll (nicht geschützt laut Kundschaft E4-B-19). 'sichern' nicht ausgeführt, weil es ein Protokoll schreibt. Das Gate bleibt offen, bis der Orchestrator sichert oder das Protokoll prüft.
- Soll, Leistungsseiten Bildstelle: Ohne Foto zeigt die Seite jetzt ein großes Fach-Icon (144 px) auf einer Fachfläche im Verhältnis 4/3 (bg-area-soft/40, border-border). Vorher war es ein 72-px-Icon in einem leeren Bildfeld. Ein Foto aus der Medienbibliothek wird weiterhin mit ImagePlaceholder gezeigt, ebenso Leistungen ohne Fach-Icon.
- Soll, Bereichsseite Abschnitt 01: Die ganze Zeile bleibt Link, aber der Name für Screenreader ist nur das Linkziel. Ein absolut gelegter Link deckt die Zeile ab (sr-only-Name). Der sichtbare Text ist ein span mit Pfeil; die Hover-Verschiebung B-06 bleibt. Offene Frage 4 bleibt offen.
- Soll, Bereichsseite Abschnitt 02: Bei 7 Leistungen füllt die letzte Zelle die Restzeile (sm:col-span-2, lg:col-span-3). Sie wird liegend gezeigt (Icon, Text, Pfeil nebeneinander). Die Logik ist allgemein über die Anzahl. Haarlinien, Icon 40 und Ton muted unverändert.
- Werte-Suche: Ein Fund (after:content-['']) entstand durch den Pseudo-Link und ist durch den absolut gelegten Link ersetzt. Jetzt keine Funde.

GEMEINSAME DATEIEN
- Keine. Keine gemeinsame Datei berührt.

PRÜFUNG UND ERGEBNIS
- Logikwächter pruefen: abweichend 0 (15 Dateien), die zwei Dateien nicht im Protokoll; sichern nicht ausgeführt.
- tsc --noEmit: exit 0, keine Fehler.
- eslint auf beide Dateien: ohne Befund.
- vitest run src/components: 30 Dateien, 758 Tests grün.
- werte-suche auf beide Dateien: keine Funde.
- grep lucide-react auf beide Dateien: kein Treffer.
- Lock /tmp/sm24-messfenster.lock war während aller Läufe nicht vorhanden. Entwicklungsserver Port 3001: 200.
- Bilder: Vollseiten (--ganz) von /sicherheitstechnik, Videoüberwachung und Smarte Funktionen in Tablet und Desktop gesichtet. Abschnitt 02 hat in Desktop und Tablet keine allein stehende Zelle mehr. Kein Abschneiden, kein horizontaler Überlauf.
- Schritt 1 (git diff fab24ac): nur die zwei Dateien verändert.
- Schritt 2 (Logik): Imports bis auf die neuen Fach-Icons, generateMetadata, generateStaticParams, notFound, noindex, LEGAL_RELEVANT, PROCESS_LABELS, Services-Abfrage, Links-Logik und Props-Verträge unverändert. Rechtstexte wortgleich.
- Schritt 3 (Kern-Auszug): erfüllt. Bewegung nur B-06, B-13, B-18.
- Schritt 4 (Grenzen): keine neue Bewegung, keine neuen Abhängigkeiten. Nicht gecommittet, nicht gepusht, nichts gelöscht.
- Ablage: Alle neuen Bilder und Protokolle liegen in /root/sm24-bilder/E4-BAUMEISTER-19-runde2/. Runde-1-Dateien unter /root/sm24-bilder/E4-BAUMEISTER-19/ bleiben liegen.

OFFENE FRAGEN
- Logik-Gate: Die zwei Dateien sind nicht im Logikwächter-Protokoll. Der Orchestrator entscheidet über das Sichern.
- Offene Frage 4 aus dem Kundschaftsbericht bleibt offen.
- Auf dem Tablet bleibt die Fachfläche durch das 4/3-Verhältnis aus den Daten recht groß. Soll das Verhältnis im Datenbestand gekürzt werden?
- Smarte Funktionen zeigt nicht mehr die Funkschlüssel-Zeichnung, sondern das Fach-Icon. Die Zuordnung in src/lib/visual/motiv.ts ('funk' trifft 'Funktionen') bleibt unverändert.

=== ENDE E4-BAUMEISTER-19 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen des Baumeisters

- Logik-Gate (Muss-Befund): 'logikwaechter.mjs pruefen' meldet jetzt 'abweichend: 0' bei 15 Dateien. Die beiden Sicherheitstechnik-Dateien stehen nicht im Protokoll; sie sind laut Kundschaft E4-B-19 nicht geschützt. 'sichern' wurde nicht ausgeführt. Das Gate bleibt offen, bis der Orchestrator entscheidet.
- Offene Frage 4 aus dem Kundschaftsbericht bleibt unverändert offen.
- Auf dem Tablet bleibt die Fachfläche der Leistungsseiten durch das 4/3-Verhältnis aus den Daten recht groß. Soll das Verhältnis im Datenbestand gekürzt werden? Das liegt nicht in meinen Schreibrechten.
- Smarte Funktionen zeigt nicht mehr die Funkschlüssel-Zeichnung, sondern das Fach-Icon. Die Zuordnung in src/lib/visual/motiv.ts ('funk' trifft 'Funktionen') bleibt unverändert.
