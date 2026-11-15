# FA-SEO-01A · Titel und Beschreibungen in den Längen: Rubrik-, Bereichs- und Leistungsseiten (Teil 1 von FA-SEO-01, ohne Datenschema)

Kopf: Etappe FA Priorität 6 · Rolle Texter · Modell Opus · Stufe 3 (Suchergebnis-Texte der Schlüsselseiten) · Kostenklasse M · kein Datenschema, kein `--pg` · Anforderungen FA-25-02, FA-25-03, FA-25-19, FA-25-20, FA-23 (Metadaten), FA-02 (Sprache) · Messung: `berichte/FA-SEO-02-onpage.md` (Titel auf den meisten Seiten zu lang, 47 Beschreibungen außerhalb der Länge), Werkzeug `werkzeuge/onpage.mjs` (lies dort die Regeln für Länge und Zählweise, damit du genauso zählst).

## Aufgabe in einem Satz
Jede Seite, deren Titel und Beschreibung aus `content/seo.json`, `content/service-pages.json` oder den Rückfällen dazu kommt, bekommt einen eindeutigen Titel und eine eindeutige Beschreibung in der verlangten Länge, geschrieben aus dem, was sichtbar auf der Seite steht.

## Vorgabe des Inhabers (wörtlich, Arbeitsanweisung vom 11.11.2026, Abschnitt 25)
„SEO muss von Anfang an technisch mitgedacht werden. Saubere URLs, Seitentitel, Meta Beschreibungen, Überschriftenstruktur, Canonicals, XML Sitemap und robots.txt. […] Seobility für technische und Onpage Kontrolle verwenden.“ Zielwert: bei den wichtigen Seiten möglichst über 95 Prozent; „echte Inhalte, Nutzbarkeit und saubere Technik gehen vor künstlichem Score Tuning.“ Abschnitt 23: Erreichbarkeit überall konsistent, auch in Metadaten. Abschnitt 02: kurze, klare Sätze, nichts Erfundenes.

## So bauen
1. Lies zuerst, wie der sichtbare Titel im Kopf entsteht (Markenzusatz, Vorlage in `src/app/(site)/layout.tsx` und `src/components/seo/**` oder der Metadaten-Hilfe, die die Seiten nutzen) und wie `onpage.mjs` Länge misst. Die Grenze gilt für den fertigen Titel, wie er im Kopf steht: höchstens 60 Zeichen einschließlich Markenzusatz, wenn die Seite ihn anhängt. Der Markenname steht nie doppelt.
2. Titel: sagt in natürlichen Worten, was die Seite bietet, das wichtigste Wort vorn. Keine Gedankenstriche, keine senkrechten Striche als Aufzählung von Suchwörtern, keine Großschreibung zum Schreien, kein Ort, wenn die Leistung bundesweit gilt, und kein „Wetzlar“, wo die Seite nichts Örtliches sagt.
3. Beschreibung: 120 bis 160 Zeichen, ein bis zwei ganze Sätze aus den Fakten der Seite: was der Kunde bekommt und was der nächste Schritt ist. Sie stützt sich auf Sichtbares: Was in der Beschreibung steht, steht sinngleich auch auf der Seite (R1, R8). Keine Preise, keine Zeiten, keine Zusagen wie „schnell“, „zuverlässig“, „günstig“, „sofort“, „24 Stunden“ außer im Wortlaut der Erreichbarkeit des Inhabers dort, wo die Seite ihn zeigt (Kontakt). Keine Gedankenstriche, keine Füllwörter.
4. Eindeutig: kein Titel und keine Beschreibung doppelt über alle Quellen dieses Pakets.
5. Pflichtpunkte:
   - Die 17 Leistungsseiten (`content/service-pages.json`, Rückfall `src/lib/data/defaults/service-pages.ts`): Beschreibung aus dem sichtbaren Kurztext (`summary`) neu fassen. Bei `sicherheit-alarmtechnik` die unbelegte Zusage „zuverlässig erkennen“ streichen. Gedankenstriche in den Beschreibungen von „Profilzylinder und Spezialzylinder“ und „Montage und Anpassung“ entfernen. Der Test in `src/lib/data/defaults/service-pages.test.ts`, der Titel und SEO-Felder auf dem Startwert vom 25.10.2026 festhält, wird auf die neue Regel umgestellt: JSON und Rückfall gleich, Länge in den Grenzen, eindeutig, keine Gedankenstriche, jedes Hauptwort der Beschreibung kommt im sichtbaren Text der Leistung vor oder die Beschreibung ist ein Auszug daraus. Der Test wird nicht gelöscht und nicht schwächer (G8).
   - `content/seo.json` und gleichlautend `src/lib/data/defaults/content.ts`: `seo.title` und `seo.description` aller Routen; sichtbare Felder (`headline`, `subline`, `intro`, `faq`) fasst du nicht an (die sind frisch überarbeitet).
   - `seo.internalLinks`: Der Verweis auf `/autoschluessel/anfrage` heißt überall „Termin anfragen“ (A-031).
   - Rückfalltitel und -beschreibungen in `generateMetadata` der Seiten dieser Routen, wo sie von den Daten abweichen oder Gedankenstriche tragen: an die Daten angleichen. Ausgenommen sind die Ordner `autoschluessel`, `motorradschluessel`, `ratgeber`, `artikel`, `warenkorb` (dort arbeiten gerade andere Pakete).
6. Ein neuer Test (`src/lib/data/seo-laengen.test.ts` oder an passender Stelle) prüft über `content/seo.json` und `content/service-pages.json` samt Rückfällen: Titel höchstens 60 Zeichen in der Zählweise der Seite, Beschreibung 120 bis 160 Zeichen, eindeutig, keine Gedankenstriche, keine der verbotenen Zusagen. Seiten, die `noindex` sind, dürfen kürzere Beschreibungen haben; nenne die Regel im Test.
7. Der Seed gleicht geänderte Startwerte ab (`content/startwerte/`, `src/payload/seed.ts`): Prüfe, dass geänderte SEO-Felder in einer bestehenden Datenbank ankommen, wenn der Betreiber sie nie geändert hat, und nicht überschrieben werden, wenn er sie geändert hat. Ändere am Seed nur, wenn das nicht so ist, und sag es im Bericht.

## Schreibrechte
content/seo.json und src/lib/data/defaults/content.ts (nur `seo.title`, `seo.description`, `seo.internalLinks`-Beschriftungen), content/service-pages.json und src/lib/data/defaults/service-pages.ts (nur SEO-Felder), src/lib/data/defaults/service-pages.test.ts, der neue Längentest, `generateMetadata`-Rückfälle der Seiten unter src/app/(site) außer den ausgenommenen Ordnern; `_werkstatt/ausbau/berichte/FA-SEO-01A.md`.
Nicht anfassen: sichtbare Texte, content/guides.json, Strukturdaten, Sitemap, robots, Navigation, Preise, Rechtstexte, die ausgenommenen Ordner, `werkzeuge/onpage.mjs`.

## Prüfen
- `_werkstatt/ausbau/werkzeuge/sicher.sh --json -- npx vitest run`, `… -- npm run typecheck`, `… -- npm run lint`
- Kein Build, kein Server, kein `--pg`, kein git. Die Onpage-Prüfung über den laufenden Server macht der Orchestrator nach dem nächsten Build.
- Nenne im Bericht eine Tabelle: Route, Titel alt und neu mit Länge, Beschreibung alt und neu mit Länge.
- Im Arbeitsbaum liegen Änderungen anderer, gleichzeitig laufender Pakete (Fahrzeugdatenbank, Ratgeber). Ein roter Test in deren Dateien ist nicht dein Fehler; wiederhole den Lauf und nenne es im Bericht.

## Grenzen
R1, R3, R4, R7, R8, R9 (Erreichbarkeit nur im Wortlaut des Inhabers), G8, G9. Texte kurz, ohne Gedankenstriche. Prettier nicht auf Bestand anwenden.

## Ausgabeformular
GEÄNDERTE DATEIEN · WAS UND WARUM · PRÜFUNG UND ERGEBNIS (Zahlen vorher und nachher) · BELEGE · OFFENE FRAGEN · FÜR MENSCHEN.
Markiere Unsicheres als OFFENE FRAGE statt zu raten, und erfülle nur deinen Auftrag.
=== ENDE FA-SEO-01A · BEREIT ZUR RÜCKGABE ===
