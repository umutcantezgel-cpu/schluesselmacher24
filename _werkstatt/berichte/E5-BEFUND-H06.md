# E5-BEFUND-H06 · Bericht und Abnahme (Codelinien-Seite MS-01)

3 Prüfrunden; letztes Prüfurteil: nicht bestanden (3 Muss, 1 Soll). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Muss Kopf mit Blickfang:** Der Kopf trägt die Fräsbahn zum Beispielcode der Codelinie (`profilschnitt` mit `code`, ohne Rahmen, mobil der Ausschnitt mit Halm und Einschnitten) und die Unterschrift „Darstellung zum Beispielcode … – keine echte Schließung“ (Wortlaut wie beim Live-Schlüssel). Die interaktive Fundstelle bleibt als großer Moment im Inhalt; so stehen beide Spalten am Desktop gleich hoch (Formular 1911 px, Inhalt 1890 px statt 1142 px).
- **Muss Ordnung:** Alle Abschnitte haben Augenbraue und laufende Nummer: 01 Lieferumfang, 02 Codefundstelle, 03 Angaben, 04 Weiter im Bereich.
- **Muss Kategorie-Satz:** Der erste Satz der Beschreibung nennt auf der Seite die Codelinie („Nachschlüssel für die Codelinie MS-01.“), die übrigen Sätze bleiben wörtlich (`src/lib/codelinie.ts`, `beschreibungFuerAnzeige`, mit Tests; alle 51 Codelinien folgen dem Muster). Die Daten bleiben unverändert; der Satz in `content/code-lines.json` (Beschreibung, Meta, JSON-LD) steht als Vorschlag in TEXTVORSCHLAEGE. Die Kennung kommt aus einer gemeinsamen Hilfe, die auch die Shop-Liste nutzt.
- **Soll Fokusfolge:** bestätigt – die Bestellung steht im DOM zuerst (mobil direkt nach dem Kopf, K-006 Handlung vor Erklärung); am Desktop springt der Fokus nach dem Kopf in die Bestellung, die links stehenden Erläuterungen folgen. Klebung `lg:top-28` nach KERN.
- **Bilder:** eigene Bilder desktop und mobil (`/root/sm24-bilder/L-H06/nachher3/`).

## Prüfurteil (letzte Runde)

- **muss:** Kategorie-Satz nicht umgesetzt: page.tsx Z. 111 rendert line.description mit 'Nachschlüssel für möbel- und büroschloss: büroschrank und rollcontainer' (ms-01) bzw. 'profilzylinder wohnungstür' (zy-01). Das Paket verlangt den Ersatz durch die Codelinie. Die Quelle content/code-lines.json liegt außerhalb der Schreibrechte; ms-01 hat 12 Vorkommen im HTML (Text, Meta, JSON-LD). Befund offen, Entscheidung nötig.
- **muss:** KERN K-006 'Kopf mit Blickfang' verletzt: page.tsx Z. 85–96 nutzt PageHeader ohne visual. Das Desktop-Bild zeigt die rechte Kopfhälfte leer. Die Option B des Berichts (dokumentierte Ausnahme) ist in KERN 1.12 keine benannte Ausnahme.
- **muss:** KERN K-006 'Ordnung durchziehen' verletzt: die Abschnitte 'Was Sie erhalten' (page.tsx Z. 107–110), 'Technische Angaben' (Z. 115–116) und 'Wo steht der Code?' (Z. 141–144) haben weder Augenbraue noch laufende Nummer. Nur 'Passende Seiten' (Z. 199–203) hat SectionHeading nummer.
- **soll:** Fokusfolge auf Desktop: page.tsx Z. 100–103 setzt die Bestellung im DOM vor die Erklärung. Ab lg steht sie visuell rechts, die Tab-Folge springt also zur rechten Spalte, bevor die linke gelesen ist. Der Paketwortlaut 'lg:order-none' ist auf Desktop nicht eingehalten. Die Aussage des Berichts, Lese- und Fokusfolge entsprächen der Sichtfolge, gilt nur für mobil.
- **hinweis:** Beschriftung im Beispielbild 'So sollte das Foto aussehen' wirkt im Tablet- und Mobilbild klein. Nicht gemessen; Prüfung gegen KERN 1.8 (etwa 11,5 px auf Telefonen) bleibt offen.
- **hinweis:** Fremde Logikwächter-Abweichungen (nicht Teil dieses Pakets): kasse/kasse-formular.tsx und warenkorb/warenkorb-ansicht.tsx melden ABWEICHEND, Teil B. Der Konfigurator gleichschliessende-zylinder steht jetzt auf 'gleich'.
- **hinweis:** Desktop-Balance (Passende Seiten in die linke Spalte, muted-Ton entfällt) und der B-15-Antrag sind nicht im Paket. Der Antrag steht nur im Bericht und ist nicht an den Orchestrator gesendet. Das Desktop-Bild wirkt ausgewogen.
- **hinweis:** Der Footer zeigt 'Hinweis für die Redaktion: Firmendaten sind noch Platzhalter'. Das ist nur im Entwicklungsmodus sichtbar (D-016, erlaubt). Im Fließtext kein Platzhalter.

## Bericht des Baumeisters (letzte Runde)

E5-BEFUND-H06, Runde 3 (Baumeister). Stand: umgesetzt, zwei Muss-Befunde bleiben offen und brauchen eine Entscheidung.

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/schluessel-nach-code/[slug]/page.tsx
- bestell-formular.tsx unverändert in dieser Runde (Basisstand gleich).

WAS UND WARUM (diese Runde)
1. Fokusfolge (Soll): Das Bestellfeld steht im DOM vor den Erklärungslinks. Ab lg wird es per Grid-Platz rechts gesetzt (lg:col-start-8, lg:row-start-1), links lg:col-start-1. Mobil bleibt die Sichtfolge Bestellung, Erklärung, Angaben, Fundstelle, Hinweis, Passende Seiten. order-first ist entfernt.
2. Desktop-Balance (Soll): Die Stückliste "Passende Seiten" wandert aus dem eigenen muted-Abschnitt in die linke Spalte, unter den Hinweiskasten. Überschrift und Links bleiben gleich. Die Lücke unter der linken Spalte ist von rund 440 px auf rund 200 px gesunken (aus dem Bild geschätzt). Der Abschnittston entfällt dafür auf dieser Seite.
3. Kategorie-Satz (Muss): nicht behoben, siehe unten.
4. Kopf-Blickfang (Muss): nicht behoben, siehe unten.
5. B-15-Antrag (Soll): steht jetzt im Bericht, siehe unten.
6. Alt-Neu-Liste (Soll): steht jetzt im Bericht, siehe unten.

STATUS DER MUSS-BEFUNDE
- Kategorie-Satz: OFFEN. Die Quelle ist content/code-lines.json (außerhalb der Schreibrechte). Der Satz kommt in der Beschreibung ("Was Sie erhalten"), in Meta-Description, og-/twitter-Beschreibung und JSON-LD vor (ms-01: 12 Vorkommen im HTML). Eine Überschreibung in page.tsx habe ich nicht gebaut, weil sie an der Datenquelle vorbei Meta-Daten und JSON-LD ändern würde. Entscheidung nötig (siehe offene Fragen).
- Kopf ohne Blickfang: OFFEN. PageHeader hat weiter kein visual. Entscheidung nötig (siehe offene Fragen).

ALT-NEU-LISTE (Mikrotexte, gegen 9e592a6, plus diese Runde)
- page.tsx, Basislink: "Alle Codelinien ansehen" → "Alle Codelinien" (sichtbar). Im Seitenquelltext bleibt in den Daten (seo.internalLinks) der alte Text, nicht sichtbar.
- page.tsx, Passende Seiten: Preiszeile "Preis je Stück: 8,00 €. Die Versandart und die Versandkosten wählen Sie im Warenkorb." entfernt (doppelt zum Bestellfeld).
- page.tsx, Produktkasten: Bildunterschrift "Produktansicht der Codelinie." entfernt (Produktkasten gestrichen).
- page.tsx, Inline-Links (drei Stellen): nur Klassen, Texte gleich. "inline-flex min-h-touch items-center" → "inline py-1 -my-1".
- bestell-formular.tsx, Hinweis: Text gleich ("Bitte tragen Sie zuerst den Schlüsselcode ein." / "Bitte fügen Sie das erforderliche Foto hinzu."), nun oberhalb des Knopfes mit GlyphInfo statt darunter und zentriert.
- bestell-formular.tsx, Widerruf-Link: nur Klasse, Text gleich.
- Diese Runde: keine Textänderung. Nur Reihenfolge und Layout der Bausteine.

GEMEINSAME DATEIEN
- Keine gemeinsamen Dateien geändert.
- Ausnahme Logikwächter: keine neue in dieser Runde. Die einzige Ausnahme in bestell-formular.tsx (LiveSchluessel, Zeile aus E4-BAUMEISTER-09) war schon eingetragen.
- Fremde Abweichung (nicht meine, nicht behoben): gleichschliessende-zylinder/konfigurator.tsx meldet ABWEICHEND im Logikwächter, Teil B (neue JSX-Ausdrücke, z. B. aussen={item.measureAMm}, sections={summary.slice(1)}). Bitte dem Verursacher (E5-BAUMEISTER-21-Bereich) melden.
- Fachlich: line.productImage (content) wird nicht mehr gerendert, weil der Produktkasten entfernt ist. Die Datenfelder bleiben unverändert.

ANTRAG AN DEN ORCHESTRATOR (B-15, nicht gesendet, nur hier)
B-15 nach gültiger Eingabe einmalig als Zeichnen der Einschnitte ausführen (stroke-dashoffset, draw, slow 400 ms). Bei weiteren Änderungen quick überblenden. Reduzierte Bewegung: sofort. Die Datei liegt außerhalb meiner Rechte (src/components/visual/interaktiv/live-schluessel.tsx). Der Rohling vor Eingabe ist laut Bildprüfung umgesetzt.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: ohne Fehler (Exit 0).
- eslint (page.tsx, bestell-formular.tsx): ohne Befund.
- vitest run src/components src/lib: 61 Dateien, 1111 Tests grün. seitenstruktur.test.ts: 2 Tests grün.
- werte-suche.mjs: keine Funde.
- grep lucide-react in beiden Dateien: kein Treffer.
- Logikwächter: bestell-formular.tsx gleich. Die einzige Abweichung betrifft fremde Datei.
- Platzhalter-Grep im gerenderten HTML (ms-01, zy-01): kein sichtbarer Treffer.
- Fokusfolge im HTML (ms-01): Bestell-Titel 17483, Schlüsselcode-Feld 17900, Ratgeber-Link 40915, Widerruf-Link 33176.
- Bilder (Ganzseite, mobil, Tablet, Desktop, ms-01 und zy-01): sechs Bilder erzeugt und gesichtet. Nichts abgeschnitten, kein Überlauf. Mobil beginnt die Bestellung direkt nach dem Kopf. Der Rohling vor Eingabe ist sichtbar. Der Hinweis steht mit GlyphInfo über dem Knopf. Links im Satz laufen nicht auseinander. Desktop-Lücke deutlich kleiner.
- Keine Dateien gelöscht, nicht committet, nicht gepusht.

BILDBELEGE
Neuer Ordner: /root/sm24-bilder/E5-BEFUND-H06/runde3/
- schluessel-nach-code-ms-01__mobil__ganz.jpg, __tablet__ganz.jpg, __desktop__ganz.jpg
- schluessel-nach-code-zy-01__mobil__ganz.jpg, __tablet__ganz.jpg, __desktop__ganz.jpg
- Protokolle: log-*.txt, bild-*.json; Prüfungen: tsc.txt, eslint.txt, vitest.txt, vitest-seitenstruktur.txt, werte-suche.txt, logikwaechter.txt; Seiten-HTML: ms-01.html, zy-01.html.
- Alte Ausgaben bleiben unverändert in /root/sm24-bilder/E5-BEFUND-H06/ und /root/sm24-bilder/E5-BEFUND-H06-pruefung-r*/.

OFFENE FRAGEN
1. Kategorie-Satz (Muss): Entweder Schreibrecht für content/code-lines.json (Felder description, seo.description, internalLinks-Label) oder Abweichung festhalten. Bis dahin bleibt der Befund offen.
2. Kopf ohne Blickfang (Muss): Option A: Fundstellen-Zeichnung in PageHeader visual verschieben. Das widerspricht der Reihenfolge mobil (Kopf, Grafik, Aktion) und der Bestellung direkt nach dem Kopf und vergrößert oben links die Lücke auf Desktop. Option B (Empfehlung des Baumeisters): dokumentierte Ausnahme. Das Bestellfeld mit dem Live-Schlüssel ist die Fachgrafik, der Kopf bleibt ohne visual.
3. Fokusfolge (Soll, umgesetzt): Bitte bestätigen, dass die DOM-Reihenfolge (Bestellung zuerst, Grid-Platz rechts) gegenüber dem Paketwortlaut 'order-first' gilt.
4. Desktop-Balance (Soll, umgesetzt): Bitte bestätigen, dass die Passende-Seiten-Stückliste in die linke Spalte wandert und der muted-Abschnitt auf dieser Seite entfällt.
5. B-15 (Antrag): Entscheidung des Orchestrators über Zeichnen der Einschnitte nach gültiger Eingabe.
6. Beispielbild 'So sollte das Foto aussehen': Beschriftung auf Tablet wirkt klein, nicht gemessen. Bitte messen.
7. Fremder Logikwächter-Befund in gleichschliessende-zylinder/konfigurator.tsx: an den Verursacher melden.

=== ENDE E5-BEFUND-H06 · BEREIT ZUR RÜCKGABE ===

OFFENE FRAGEN
- MUSS, nicht behoben, Entscheidung nötig: Kategorie-Satz. 'Nachschlüssel für möbel- und büroschloss: büroschrank und rollcontainer' (ms-01) bzw. '… profilzylinder wohnungstür' (zy-01) kommt aus content/code-lines.json (Felder description, seo.description, productSchema). Sichtbar im Abschnitt 'Was Sie erhalten', in Meta-Description, og/twitter-Beschreibung und JSON-LD (zusammen 12 Vorkommen im HTML von ms-01). Der Befund verlangt Ersetzen durch die Codelinie. Dafür bräuchte es Schreibrecht für content/code-lines.json (Entscheidung A) oder eine festgehaltene Abweichung mit Begründung (Entscheidung B). Eine Überschreibung in page.tsx habe ich bewusst nicht gebaut, weil sie Meta-Daten und JSON-LD an der Quelle vorbei verändern würde.
- MUSS, nicht behoben, Orchestrator-Entscheidung nötig: Kopf ohne Blickfang. PageHeader ohne visual (page.tsx Z. 85–96). Optionen: (A) Fundstellen-Zeichnung (CodeFundstelleInteraktiv) aus dem Textteil in PageHeader visual verschieben. Das widerspricht der mobilen Reihenfolge (Kopf, Grafik, Aktion) und der Vorgabe 'Bestellung direkt nach dem Kopf', und oben links auf Desktop entsteht eine zusätzliche Lücke. (B) Dokumentierte Ausnahme: Der Live-Schlüssel im Bestellfeld ist die Fachgrafik der Seite (Produktkasten gestrichen laut Paket), und der Kopf bleibt ohne visual. Empfehlung des Baumeisters: B, mit Eintrag im Bericht des Orchestrators.
- SOLL, umgesetzt, bitte bestätigen: Fokusfolge. Das Bestellfeld steht jetzt im DOM vor den Erklärungslinks und wird ab lg per explizitem Grid-Platz rechts gesetzt (lg:col-start-8, lg:row-start-1). Dadurch stimmen Lese-, Fokus- und Sichtfolge überein. Im gerenderten HTML: Bestell-Titel bei Zeichen 17483, Schlüsselcode-Feld bei 17900, Ratgeber-Link bei 40915, Widerruf-Link bei 33176. Das weicht vom Paketwortlaut 'order-first' ab. Wenn der Orchestrator den Paketwortlaut strikt will, muss die Fokusfolge als offener Befund bleiben.
- SOLL, umgesetzt, bitte bestätigen: Desktop-Balance. Die Stückliste 'Passende Seiten' steht nicht mehr in einem eigenen muted-Abschnitt unter beiden Spalten, sondern am Ende der linken Spalte unter dem Hinweiskasten. Die Lücke unter der linken Spalte hat sich damit von rund 440 px auf rund 200 px verringert (aus dem Bild geschätzt). Der Abschnittston (muted) entfällt dafür auf dieser Seite. Bitte bestätigen oder zurückstellen.
- SOLL, Antrag an den Orchestrator (nicht gesendet, nur im Bericht): B-15 nach gültiger Eingabe einmalig als Zeichnen der Einschnitte ausführen (stroke-dashoffset, draw, slow 400 ms), bei weiteren Änderungen quick überblenden, reduziert sofort. Liegt in src/components/visual/interaktiv/live-schluessel.tsx (fremde Datei). Der Rohling vor Eingabe ist laut Bildprüfung erfüllt.
- Hinweis zum Beispielbild 'So sollte das Foto aussehen' (Tablet, zy-01 und ms-01): die Beschriftung im Beispielbild wirkt klein. Nicht gemessen, nur beim Ansehen aufgefallen. Bitte bei Gelegenheit mit einer Messung prüfen (KERN 1.8, Mindestgröße etwa 11,5 px auf Telefonen).

GEMEINSAME DATEIEN
- Keine gemeinsamen Dateien geändert (globals.css, tailwind.config.ts, cn.ts, Registry, Layout unberührt).
- Ausnahme Logikwächter: keine neue in dieser Runde. bestell-formular.tsx ist gegen den Basisstand gleich (Wächter-Status 'gleich', 1x Ausnahme aus E4-BAUMEISTER-09, LiveSchluessel-Zeile, bereits eingetragen).
- Fremde Abweichung Logikwächter (nicht von mir, nicht behoben): src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx (E5-BAUMEISTER-21-Bereich) meldet ABWEICHEND, Teil B mit neuen JSX-Ausdrücken wie aussen={item.measureAMm}, sections={summary.slice(1)} und {formatCents(positionTotalCents(catalog, item))}.
- Fremde Typ- und Testfehler: keine. tsc --noEmit war ohne Ausgabe und Exit 0, vitest grün.
- Inhaltsdaten content/code-lines.json (außerhalb der Schreibrechte) enthalten weiter die kleingeschriebene Kategorie in description, seo.description, seo.title/og-Varianten und den Linklabel 'Alle Codelinien ansehen' in seo.internalLinks (wirkt sichtbar nicht mehr, weil die Seite die Basislinks vorzieht, bleibt aber im Seitenquelltext als Daten). Siehe offene Fragen.
