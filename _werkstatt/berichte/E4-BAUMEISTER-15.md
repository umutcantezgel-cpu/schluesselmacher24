# E4-BAUMEISTER-15 · Bericht und Abnahme

Workflow `wf_e1d06205-b24`, 3 Prüfrunden, letzte Prüfung nicht bestanden. Abnahme und Nacharbeit durch den Orchestrator siehe D-031.

## Letzter Bericht des Baumeisters

E4-BAUMEISTER-15 · Runde 3 · Paket Kasse (H11 /kasse)

GEÄNDERTE DATEIEN
- src/app/(site)/kasse/kasse-formular.tsx (nur JSX im return, className-Werte und Anzeige-Ausdrücke der Bestellübersicht)
- src/app/(site)/kasse/page.tsx: in dieser Runde unverändert (siehe Befund 2).

WAS UND WARUM (Runde 3)
- Mono-Auszeichnung an der Wertart statt an der Abschnittsposition: index < 2 ist entfernt. Die Beträge, Stückzahlen und Maße in den Zeilen der Übersicht werden über einen Anzeige-Ausdruck in Mono-Spans gesetzt. Die Versandzeile zeigt jetzt 'Versand verfolgbar' im Fließtext und '4,95 €' in Mono. Die Gesamtsumme bleibt groß und Mono, ihre Auszeichnung hängt weiterhin am Label (siehe offene Frage 2).
- Die Parameter index (Abschnitt) sind entfallen, weil sie nicht mehr gebraucht werden.
- Zuvor in Runde 2 bereits umgesetzt und unverändert: Rasterung lg:grid-cols-12 mit 7/5, Abschnitte 01 bis 03 mit Haarlinie, Pflichthinweis, Schriftfeld Bestellübersicht, size-5 bei den Kontrollkästchen, lg:top-28.
- Logik unverändert: pruefen, absenden, submitOrder, expectedTotalCents, Weiterleitung, Fehlertexte, Zahlungslogik.

GEMEINSAME DATEIEN
- Ausnahmen Logikwächter, Anzeige-Ausdrücke (wörtlich wie vom Wächter ausgegeben, für logik-ausnahmen.json durch den Orchestrator zu prüfen; ich habe die Datei nicht geändert):
  1. {abschnitt.rows.map((zeile, zeilenIndex) => (__JSX__))} – Schleife über die vorhandenen Zeilen der Übersicht, nur Lesen.
  2. {abschnitt.title} – Überschrift des Abschnitts, nur Lesen.
  3. {uebersicht.map((abschnitt) => (__JSX__))} – Schleife über die vorhandene Übersicht, nur Lesen.
  4. {zeile.label} – Beschriftung der Zeile, nur Lesen.
  5. {zeile.value .split(/(\d+(?:,\d+)?\s(?:mm|Stück)|\d{1,3}(?:\.\d{3})*,\d{2}\s€)/) .map((teil, teilIndex) => teilIndex % 2 === 1 ? (__JSX__) : (teil))} – zerlegt den vorhandenen Anzeigetext, damit nur Beträge, Stückzahlen und Maße in Mono stehen; keine Wirkung, keine Logikänderung.
  6. {teil} – Textstück im Mono-Span, nur Lesen.
- Nicht als Ausnahme beantragt (Entscheidung Orchestrator): Teil A, Import SummaryList entfernt; Teil B, sections={uebersicht} entfallen. Beides folgt aus dem Schriftfeld, das die Übersicht ersetzt.
- Section-Komponente: src/components/layout/section.tsx importiert InView (Client-Komponente). Das kollidiert mit dem JS-Budget (siehe offene Frage 3).
- Fremde Änderungen im Arbeitsbaum (nicht von mir): globals.css, (site)/page.tsx, page-header.tsx, warenkorb/*, staged Löschungen seitenwechsel.tsx, seitenwechsel.test.tsx, react-canary.d.ts.

PRÜFUNG UND ERGEBNIS
- Logikwächter: Exit 3, ABWEICHEND (Teil A Import und entfallener Ausdruck offen; Teil B sechs benannte Anzeige-Ausdrücke, die ich beantragt habe).
- tsc --noEmit: Exit 0.
- eslint (kasse-formular.tsx, page.tsx): 0 Fehler, 1 Warnung, CardHeader ungenutzt. Behebung nur über Teil A (Frage 1).
- vitest run src/components: 28 Dateien, 753 Tests grün. Die Differenz zu Runde 2 (755) stammt von der fremden Löschung des Tests seitenwechsel.test.tsx.
- werte-suche: 0 Funde. lucide-react: kein Treffer.
- Browser-Prüfung (Desktop): Beträge und Stückzahlen im Mono-Span, Text daneben nicht; keine Seitenfehler. Die Gesamtsumme bleibt groß und Mono.
- Dev-Server: Nach meiner Änderung zeigte der Browser zunächst eine veraltete Fassung. Ich habe die Datei nur mit touch angestoßen (nur Zeitstempel). Die Bildserie in runde-3/ (ohne Unterordner) stammt von dieser veralteten Fassung und ist nicht aussagekräftig; sie bleibt liegen.
- Zahlungsablauf: Es wurde nie abgesendet. Im Fehlerlauf waren die Pflichtfeld-Meldungen aus pruefen zu sehen; abgefangene Anfragen: keine.
- Keine Löschungen, kein Commit, kein Push.

BILDBELEGE (Ordner /root/sm24-bilder/E4-BAUMEISTER-15/runde-3/nachlauf/, aktuelle Fassung)
- kasse-gefuellt-mobil.jpg: angesehen. Kein Überlauf, Bestellübersicht untereinander, Beträge in Mono, Gesamtsumme groß.
- kasse-gefuellt-tablet.jpg, kasse-gefuellt-desktop.jpg, kasse-fehler-mobil/-tablet/-desktop.jpg: erzeugt, in dieser Runde nicht erneut angesehen (der Desktop-Vergleich stützt sich auf die DOM-Prüfung). Bitte beim Prüfer sichten.
- kasse-lauf.json: Fehlerlauf, je Gerät acht Pflichtfeld-Meldungen, Bestätigung fehlt, keine Anfragen.

OFFENE FRAGEN
1. Teil A und eslint (Befund 1 und 3): Die Importe sind nur über Teil A behebbar. Vorschlag: Orchestrator erlaubt die Importänderung (SummaryList entfällt bereits, CardHeader aus dem Import entfernen) oder trägt sie als Ausnahme ein. CardHeader ist für die Abschnittsköpfe ungeeignet.
2. Gesamtbetrag über das Label (Soll-Befund): nicht behoben. Robust geht es nur über ein Kennzeichen in der Übersicht (Teil A / Datenvertrag).
3. Rechtliche Hinweise als Section (Befund 2): Anforderung und JS-Budget widersprechen sich. Entscheidung: Paket anpassen oder Ausnahme. page.tsx in dieser Runde nicht geändert.
4. Ausnahme-Einträge für die sechs Anzeige-Ausdrücke in logik-ausnahmen.json (Entscheidung, ob der Versand-Split als reine Anzeige gilt).
5. Testzahl: Löschung des Tests seitenwechsel durch andere Arbeit senkt die Zahl von 755 auf 753. Bitte beim Orchestrator prüfen.

=== ENDE E4-BAUMEISTER-15 · BEREIT ZUR RÜCKGABE ===

## Letzte Prüfung (Runde 3)

- **muss:** kasse-formular.tsx: Teil A des Logikwächters verletzt. Der Import von SummaryList ist entfernt (alter Stand Zeile 29). Das Paket erlaubt Teil A nicht; eine Ausnahme ist nicht erteilt. Logikwächter meldet abweichend.
- **muss:** kasse-formular.tsx: Teil B des Logikwächters verletzt durch den entfallenen Ausdruck sections={uebersicht} am SummaryList-Aufruf. Er ist im Bericht nicht als Ausnahme aufgeführt; die Entfernung folgt aus Befund 1.
- **muss:** Eslint-Warnung in kasse-formular.tsx:25: CardHeader ist importiert und ungenutzt. Die Schnellprüfung verlangt ohne Befund. Behebbar nur über die Importänderung aus Befund 1 (Entscheidung Orchestrator).
- **muss:** page.tsx (ab Zeile 60): Die Rechtlichen Hinweise sind nicht als Section umgesetzt (Schritt 2 und Kern). Der Baumeister meldet einen Konflikt mit dem JS-Budget, weil section.tsx die Client-Komponente InView importiert. Die Anforderung ist unerfüllt; die Entscheidung liegt beim Orchestrator (Paket anpassen oder Ausnahme).
- **soll:** kasse-formular.tsx:649: Die Gesamtsumme wird über den Labeltext 'Gesamtbetrag' ausgezeichnet. Das ist fragil, weil eine Textänderung die Mono-Auszeichnung löst. Der Bericht nennt das selbst als offene Frage.
- **soll:** Mono-Abdeckung lückenhaft: '3 Zylinder' (Menge) und '(19 %)' stehen nicht in Mono. Im Bild wirkt die Zeile 'Code 1234 · 2 Stück · 16,00 €' gemischt, weil 'Code 1234 ·' im Fließtext steht (DOM geprüft). Zylindermaße in mm sind im Prüf-Warenkorb nicht enthalten und daher nicht belegt.
- **hinweis:** Testzahl im Bericht (28 Dateien, 753 Tests) weicht vom aktuellen Lauf ab: vitest run src/components zeigt 29 Dateien und 755 Tests, alle grün.
- **hinweis:** Fremde Datei warenkorb-ansicht.tsx ist im Logikwächter abweichend (zwei Ausdrücke: article?.name ?? item.label und position.line?.name ?? ...). Nicht Paket E4-BAUMEISTER-15; separat an den Orchestrator melden.
- **hinweis:** Ganzseitenaufnahmen Fehlerzustand desktop und tablet zeigen eine fixierte Kopfleiste mitten im Bild, vermutlich ein Aufnahme-Artefakt. Im Ansichtsfenster nicht nachgeprüft; daher kein Befund.
- **hinweis:** Im mobilen Bild überlagert der Next-Entwicklungsindikator (Kreis 'N') Links im Bereich Rechtliche Hinweise. Entwicklungsoverlay, nicht Teil des Pakets.

Prüfungen: tsc --noEmit: Exit 0. eslint (beide Dateien): 0 Fehler, 1 Warnung (CardHeader, kasse-formular.tsx:25). vitest run src/components: 29 Dateien, 755 Tests grün. werte-suche (Protokoll im Prüfordner): 0 Funde, Summe 0. grep lucide-react: kein Treffer. Logikwächter pruefen: Exit 3, abweichend 2 (kasse-formular.tsx, warenkorb-ansicht.tsx fremd). Port 3001 erreichbar (HTTP 200); kein Messfenster-Lock. Bilder: bild.mjs /kasse --ganz für mobil, tablet, desktop (Warenkorb leer); eigenes Skript pruef-r3.mjs mit gefülltem Warenkorb (localStorage sm24-warenkorb): kasse-gefuellt-r3 und kasse-fehler-r3 je Gerät; Lauf in pruef-r3-lauf.json. Messung: Breite gleich scrollBreite (390, 768, 1440), kein Überlauf. Mono-Spans je Gerät in 6 Zeilen. Fehlerlauf: je Gerät 9 role=alert (8 Pflichtfeld, 1 Bestätigung, 1 leer), keine abgefangenen Anfragen, nichts abgesendet. Alle 9 Bilder angesehen; mobile Übersicht in Originalgröße ausgeschnitten und geprüft (lesbar, nichts abgeschnitten).
