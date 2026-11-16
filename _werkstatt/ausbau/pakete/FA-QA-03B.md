# FA-QA-03B · Prüfwerkzeug `reste.mjs` erweitern: Texte, die erst im Browser entstehen (Quelltext der Seiten und Bausteine)

Kopf: Etappe FA Priorität 7 · Rolle Prüfer und Werkzeugbauer · Modell Haiku (Erweiterung nach Muster), Gegenprüfung Opus · Stufe 2 · Kostenklasse S bis M · kein Quelltext des Produkts, kein Datenschema, kein Server, kein `--pg` · Anforderungen FA-27-15 bis FA-27-17, FA-24, FA-23 · Vorläufer: `pakete/FA-QA-03A.md`, `berichte/FA-QA-03A.md` (Abschnitte „Grenzen“, „Nachbesserung“, „Abnahme“).

## Aufgabe in einem Satz
Schließe die Lücke, die die Abnahme von FA-QA-03A gezeigt hat: `reste.mjs` soll auch Kundentexte finden, die nicht in den vorgerenderten Seiten stehen, weil sie erst im Browser entstehen oder zu Seiten ohne vorgerendertes HTML gehören.

## Anlass
Im Zutritt-Konfigurator stand im Hinweis eines Feldes das Wort „Öffnungszeiten“. Das Werkzeug fand es nicht: Der Text gehört zu einem Baustein, der erst im Browser gezeichnet wird, und steht deshalb in keiner vorgerenderten Seite. Dasselbe gilt für alle mehrstufigen Formulare ab dem zweiten Schritt, für Meldungen und für Seiten wie die Produktseiten, die erst mit Daten entstehen.

## So bauen
1. Neue, vierte Quelle `quelltext` in `reste.mjs`: Zeichenketten und Text zwischen JSX-Elementen aus den Dateien, die Kunden erreichen: `src/app/(site)/**`, `src/components/**`, `src/lib/**` (ohne die Ordner, die die Quelle `code` schon liest, damit nichts doppelt gemeldet wird). Ausgeschlossen: Testdateien (`*.test.*`, `test-hilfen`), `src/app/(payload)/**`, `src/payload/**` (Admin, erreicht keine Kunden), `src/migrations/**`, `src/scripts/**`, Kommentare, Importpfade, Klassenlisten und technische Zeichenketten. Als Text zählt nur, was wie Sprache aussieht: mindestens ein Leerzeichen oder ein deutsches Wort mit Umlaut oder Großbuchstaben am Anfang, mindestens acht Zeichen, keine reine Klassen- oder Pfadangabe. Beschreibe die Regel im Kopf der Datei und im Bericht ehrlich mit ihren Grenzen.
2. Alle fünf Prüfungen (`demo`, `platzhalter`, `alt`, `kontakt`, `erreichbarkeit`) laufen auch über diese Quelle. Für `kontakt` gilt dort zusätzlich: Eine Telefonnummer oder Mailadresse, die fest im Quelltext steht, ist immer ein Fund, auch wenn sie stimmt (Kontaktdaten gehören in die Einstellungen, FA-24); die Meldung sagt das.
3. Zeichenketten, die nur der Entwicklung dienen, sind kein Kundentext und sollen gar nicht erst als Text gelten: Argumente von `console.*`, Fehlermeldungen in `throw new Error(…)`, Schlüssel von Objekten, Werte von `className`, `id`, `href`, `src`, `name`, `type`, `data-*`, `aria-hidden`. Sichtbar und deshalb Text sind dagegen `aria-label`, `title`, `alt`, `placeholder`, `label`, `hint`, `description` und der Inhalt von Elementen.
4. Der Schalter `--quellen <liste>` wählt die Quellen (Standard: alle vier), damit ein schneller Lauf nur über den Quelltext möglich ist.
5. Selbsttest erweitern (`reste.test.mjs`): je Regel ein Fund und ein Nicht-Fund an kleinen erfundenen Dateien in einem vorübergehenden Ordner, darunter genau der Anlass („Montage außerhalb der Öffnungszeiten“ als `hint`), eine Klassenliste, ein `console.error`, ein JSX-Text, eine feste Rufnummer im Baustein, ein Kommentar.
6. Ein Lauf gegen den heutigen Stand (`_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/reste.mjs --md _werkstatt/ausbau/berichte/FA-QA-03B-lauf.md`). Jeder Fund ist ein Befund am Produkt: Du änderst nichts unter `src`, `content`, `scripts` oder `docs` und trägst keine Ausnahme ein (G8); du listest die Funde mit Fundstelle, sagst je Fund, ob du ihn für einen echten Fund oder für einen Fehlfund der Regel hältst, und schlägst für echte Funde einen Wortlaut vor. Gibt es viele Fehlfunde derselben Art, verbessere die Regel aus Punkt 1 oder 3 statt Ausnahmen vorzuschlagen, und wiederhole den Lauf.
7. `LIESMICH.md` der Werkzeuge: die Zeile zu `reste.mjs` ergänzen (neue Quelle, neuer Schalter).

## Schreibrechte
Nur `_werkstatt/ausbau/werkzeuge/reste.mjs`, `reste.test.mjs`, `LIESMICH.md` (die eine Zeile), `_werkstatt/ausbau/protokolle/reste-*.json`, `_werkstatt/ausbau/berichte/FA-QA-03B.md` und `FA-QA-03B-lauf.md`. `reste-ausnahmen.json` und `lib.mjs` nicht ändern. Keine Datei unter `src`, `content`, `scripts`, `docs`.

## Prüfen
`_werkstatt/ausbau/werkzeuge/sicher.sh --json --als-root -- node --test _werkstatt/ausbau/werkzeuge/reste.test.mjs` und der Lauf aus Punkt 6. Die bisherigen 44 Tests bleiben grün und unverändert in ihrer Aussage (G8). Kein Build, kein Server, kein git. Im selben Arbeitsbaum arbeitet ein anderes Paket an `src` (FA-SHOP-02); Funde in gerade geänderten Dateien nennst du mit diesem Hinweis.

## Grenzen
G1 (kein Netz), G4, G8, G13. Texte in Bericht und Ausgabe kurz, ohne Gedankenstriche.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahl der Tests, Zahl der Funde je Prüfung und Quelle) · BEFUNDE AM PRODUKT (je Fund: Prüfung, Fundstelle, Fundstück, echter Fund oder Fehlfund, Vorschlag) · GRENZEN DER REGEL · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-QA-03B · BEREIT ZUR RÜCKGABE ===
