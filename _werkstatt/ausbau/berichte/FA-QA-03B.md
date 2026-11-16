# FA-QA-03B · Bericht: Prüfwerkzeug reste.mjs, Quelle quelltext

## GEÄNDERTE DATEIEN

- Geändert: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/reste.mjs` (neue Quelle quelltext, Schalter `--quellen`, Regel für Text im Code, Kontakt fest im Quelltext, Verweise `tel:`; Nachbesserung: Feldwerte unter sichtbaren Schlüsseln, Kopf der Quelle, Hinweis bei nicht gewählter Quelle inhalt)
- Geändert: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/reste.test.mjs` (16 neue Tests, die 44 bisherigen unverändert)
- Geändert: `/home/user/schluesselmacher24/_werkstatt/ausbau/werkzeuge/LIESMICH.md` (die Zeile zu reste.mjs)
- Neu: `/home/user/schluesselmacher24/_werkstatt/ausbau/berichte/FA-QA-03B-lauf.md` (Lauf gegen den heutigen Stand, in der Nachbesserung neu erzeugt)
- Neu: `/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/reste-<Zeitstempel>.json` (je Lauf eine Datei, die Läufe vom 16.11.2026)
- Neu: `/home/user/schluesselmacher24/_werkstatt/ausbau/berichte/FA-QA-03B.md` (dieser Bericht)
- Automatisch: `/home/user/schluesselmacher24/_werkstatt/ausbau/protokolle/datenweiche.log` (eine Zeile je Aufruf)

Nicht geändert: `reste-ausnahmen.json`, `lib.mjs`, alles unter `src`, `content`, `scripts`, `docs`. Kein git, kein Build, kein Server.

## WAS UND WARUM

Die Quelle `quelltext` liest die Dateien, die Kunden erreichen, und findet Texte, die erst im Browser entstehen. Die Quelle `ausgeliefert` konnte sie nicht sehen, weil sie nur vorgerenderte Seiten liest.

- Dateien: `src/app/(site)`, `src/components`, `src/lib` ohne die Ordner der Quelle `code` (`src/lib/data/defaults`, `src/lib/mail/vorlagen`, `src/lib/pdf`). Ausgeschlossen sind `*.test.*`, `*.spec.*`, `*.d.ts`, `test-hilfen`, `src/app/(payload)`, `src/payload`, `src/migrations`, `src/scripts`.
- Stelle je Zeichenkette: `jsx` (Text zwischen Elementen), `attribut` (mit Name), `ausdruck` (Zeichenkette in `{…}` zwischen Elementen), `konsole`, `schluessel`, `code`. Importpfade und Kommentare fallen heraus.
- Sichtbar und damit Text sind `jsx`, `ausdruck` und die Attribute `aria-label`, `title`, `alt`, `placeholder`, `label`, `hint`, `description`. Ihr Wert zählt auch kurz, damit ein Platzhalter wie `[PLZ]` im Hinweistext erhalten bleibt. Dasselbe gilt für den Wert eines Objektschlüssels mit diesem Namen, etwa `{ hint: '[PLZ]' }`.
- Zeichenketten im Code zählen nur, wenn sie wie Sprache aussehen (`istSprache`): mindestens acht Zeichen, kein Pfad, keine Klassen- oder Stilangabe, dazu ein Leerzeichen zwischen Wörtern, ein Umlaut oder ein großer Anfang ohne weitere Großbuchstaben.
- Nicht Text: Argumente von `console.*`, Fehlermeldungen in `throw new Error(…)`, Objektschlüssel, technische Attribute (`className`, `id`, `href`, `src`, `name`, `type`, `data-*`, `aria-hidden` u. a.).
- Kontakt: Jede Zeichenkette dieser Quelle wird geprüft, auch die nicht gezählten. Eine Telefonnummer oder Mailadresse, die fest im Quelltext steht, ist immer ein Fund. Die Meldung sagt, dass Kontaktdaten in `content/settings.json` gehören (FA-24).
- Schalter `--quellen <liste>`: Standard sind alle vier Quellen. Eine unbekannte Quelle ergibt Bedienfehler 2. Eine nicht gewählte Quelle erscheint als „nicht gewählt“ und stört nicht, auch nicht bei fehlendem Build und nicht bei ungültigem JSON in `content` (dann nur ein Hinweis).
- Eine Regeländerung außerhalb der neuen Quelle: Verweise `tel:+49…` werden jetzt in allen Quellen gelesen. Vorher verhinderte das Zeichen vor der Nummer den Treffer. Das kann nur Funde hinzufügen, keine entfernen.
- Der Anlass (Öffnungszeiten im Hinweis des Zutritt-Konfigurators) ist im Selbsttest mit einem Fixture nachgestellt. Im heutigen Stand steht dort „Montage außerhalb Ihrer Geschäftszeiten“, der Anlass ist im Produkt also schon behoben. Die Regel bleibt durch den Test abgesichert.
- Gewählt wurde eine eigene Zustandsmaschine statt eines TypeScript-Parsers, damit keine neue Abhängigkeit entsteht (G7). Beim ersten Entwurf erzeugten Typparameter wie `<T>(…)`, Regex-Literale mit `<` und Code in `${…}` Fehlfunde; das ist behoben und mit einem Test abgedeckt.

## PRÜFUNG UND ERGEBNIS

- Selbsttest über die Datenweiche (`sicher.sh --json --als-root -- node --test _werkstatt/ausbau/werkzeuge/reste.test.mjs`): **60 von 60 bestanden** (44 bisherige unverändert, 16 neue). Die neuen Tests decken je Regel einen Fund und einen Nicht-Fund ab: den Anlass als `hint`, Klassenliste, `console.error`, `throw new Error`, Objektschlüssel, Kommentar, Importpfad, JSX-Text, feste Rufnummer und Mail, Ausschlussliste, Typparameter und Regex, `--quellen`. In der Nachbesserung kamen dazu: `{ hint: '[PLZ]' }` ergibt einen Fund, `{ name: '[PLZ]' }` keinen, `{ label: 'Demo' }` ergibt einen Fund, und ungültiges JSON bei nicht gewählter Quelle `inhalt` ist ein Hinweis, kein Bedienfehler.
- Syntaxprüfung `node --check reste.mjs`: ohne Fehler (der Selbsttest lädt das Werkzeug vollständig).
- Lauf gegen den heutigen Stand (`sicher.sh --json --als-root -- node reste.mjs --md …/FA-QA-03B-lauf.md`, Stand 2026-11-16T04:37:31Z): **Exit 1**, also Funde am Produkt. Bedienfehler: keine. Hinweise zu nicht gewählten Quellen: keine. Der Build ist der vom 16.11.2026 03:21 UTC, unverändert.

| Quelle | Status | Dateien | Textstellen |
|---|---|---|---|
| ausgeliefert | ok | 148 Seiten | 4743 |
| inhalt | ok | 18 | 30770 |
| code | ok | 38 | 3514 |
| quelltext | ok | 531 | 8999 |

Funde je Prüfung und Quelle (ohne Ausnahmen):

| Prüfung | ausgeliefert | inhalt | code | quelltext | Summe |
|---|---|---|---|---|---|
| demo | 0 | 0 | 0 | 1 | 1 |
| platzhalter | 0 | 0 | 10 | 12 | 22 |
| alt | 0 | 0 | 0 | 1 | 1 |
| kontakt | 0 | 0 | 0 | 0 | 0 |
| erreichbarkeit | 0 | 0 | 0 | 0 | 0 |

Summe 24 Funde, davon 14 aus der neuen Quelle. Die übrigen 10 sind die Platzhalter des Partnervertrags aus FA-QA-03A (Quelle code). Ausnahmen wirken wie bisher (Datei unverändert), veraltete Ausnahmen: keine, Warnungen: wie bisher (zwei Ausnahmen mit mehreren Stellen).

Gruen: ja. Selbsttest und Werkzeug laufen ohne Fehler durch. Exit 1 heißt Funde am Produkt, nicht Werkzeugfehler; diese Funde sind unten als Befunde aufgeführt.

## BEFUNDE AM PRODUKT

Alle Befunde B1 bis B9 stammen aus der neuen Quelle `quelltext`. Nichts unter `src`, `content`, `scripts`, `docs` ist geändert, und es ist keine Ausnahme eingetragen (G8). Die Einordnung ist meine, die Entscheidung liegt beim Orchestrator oder Menschen.

| # | Prüfung | Fundstelle | Fundstück | Einordnung | Vorschlag |
|---|---|---|---|---|---|
| B1 | demo | `src/app/(site)/artikel/[slug]/artikel-kauf.tsx`, Zeile 205 (ausdruck) | „Zwischensumme (Beispiel)“ | Fehlfund unter Livegang-Bedingungen: Die Kennzeichnung steht nur bei Beispielartikeln, die die öffentliche Seite nicht zeigt (`src/lib/beispiele.ts`). | Ausnahme mit Grund und Feld `ort` „Zeile 205“ prüfen. Entscheidung Orchestrator. |
| B2 | platzhalter | `src/app/(site)/schluessel-nach-vorlage/page.tsx`, Zeile 173 (code) | „[Platzhalter: übliche Bearbeitungsdauer ergänzen]“ in einer FAQ-Antwort | Entwurfsrest im Code, unsichtbar; die Frage zur Dauer fehlt deshalb auf der Seite. | Der Inhaber nennt die Dauer, oder der Klammersatz wird gestrichen. Dann erscheint die Frage mit dem vorhandenen Text (R4). |
| B3 | alt | `src/lib/scheduling.ts`, Zeile 113 (code) | Fundstück „Öffnungszeiten“ (Textstelle „Außerhalb der Öffnungszeiten“) | Interner Text der Terminverwaltung, kein Kundentext. Kunden sehen das Fenster nicht, es wird in der Terminwahl übersprungen (`scheduling.ts`, Zeile 186). | Entwurf: „Außerhalb der angebotenen Terminzeiten“. Stilfrage an den Orchestrator (FA-23). Die Zeiten sind offen (siehe offene Frage 3). |
| B4 | platzhalter | `src/app/(site)/rechtliches/datenschutz/page.tsx` Zeile 32; `rechtliches/impressum/page.tsx` Zeile 23 (zweimal); `src/components/layout/site-footer.tsx` Zeile 91 (zweimal); `service-und-termin/kontakt/page.tsx` Zeile 68 | „Platzhalter“, „Firmendaten sind noch Platzhalter“ u. a. | Gewollte Hinweise an die Redaktion. Impressum und Datenschutz zeigen sie über `RedaktionsHinweis` nur, wenn `pruefhinweiseZeigen()` wahr ist, also außerhalb der Produktion oder im Schaufenster. Fußzeile und Kontaktseite zeigen sie nur im Entwicklungsmodus (`NODE_ENV`). Unter Livegang-Bedingungen sind alle sechs Stellen durchweg Fehlfunde. Im heutigen Stand nicht sichtbar, weil `content/settings.json` `isPlaceholder: false` setzt. | Offene Frage 2. Ausnahme je Stelle nur nach Entscheidung. Der Livegang-Schutz (`pruefhinweiseZeigen`, `NODE_ENV`) bleibt die eigentliche Sperre. |
| B5 | platzhalter | `src/app/(site)/service-und-termin/kontakt/page.tsx`, Zeile 37 (code) | „[Platzhalter: Hinweise zur Anfahrt …]“ (Konstante ANFAHRT_HINWEIS) | Entwurf im Code. Der Text bleibt ungezeigt, solange er den Platzhalter enthält. Fehlfund der Absicht, aber Entwurfsrest im Code. | Hinweis in `content` verlagern, dann prüft die Regel dort. Bis dahin Ausnahme mit Grund. Entscheidung Orchestrator. |
| B6 | platzhalter | `src/lib/livegang-pruefung.ts`, Zeile 39 (code) | Meldung „Der Haken „Noch Platzhalter hinterlegt“ …“ | Fehlfund: interne Meldung der Livegang-Prüfung, kein Kundentext. | Ausnahme mit Grund, Feld `ort` „Zeile 39“. |
| B7 | platzhalter | `src/lib/mail/transport-resend.ts`, Zeile 172 (code) | „[Umgeleitet, an: …]“ | Fehlfund: Betreffpräfix nur bei Umleitung außerhalb der Produktion (G5). | Ausnahme mit Grund, Feld `ort` „Zeile 172“. |
| B8 | platzhalter | `src/lib/mail/versand.ts`, Zeile 76 (code) | „[persönlicher Link, nicht gespeichert]“ | Gewollte Ersatzmarke für geschwärzte Links. Sie steht im Mailtext an Kunden. | Mensch entscheidet, ob die Marke so bleibt. Bei Bleiben Ausnahme mit Grund, Feld `ort` „Zeile 76“. |
| B9 | platzhalter | `src/lib/mail/versand.ts`, Zeile 106 (code) | „[Text gekürzt]“ | Gewollte Kürzungsmarke im Mailtext an Kunden. | Ausnahme mit Grund, Feld `ort` „Zeile 106“. |

Unverändert aus FA-QA-03A, nicht neu: Partnervertrag (Quelle code, 10 Treffer, echter Fund nach R10), Platzhalter in `defaults/settings.ts` und `code-lines.ts`, `[vorgangsblatt]` in `vorschaubilder.ts` und die Anschrift der Aufsichtsbehörde (Quelle ausgeliefert). Sie stehen bereits in `reste-ausnahmen.json` oder sind als Ausnahmen vorgeschlagen.

Der Befund zum Zutritt-Konfigurator (Öffnungszeiten) ist im heutigen Stand nicht mehr offen: Die Zeile heißt jetzt „Geschäftszeiten“ und löst keinen Fund aus.

## GRENZEN DER REGEL

- Heuristik, kein vollständiger Parser. Die Zustandsmaschine kennt Klammern, JSX-Elemente, Regex-Literale und Typparameter der Form `<T>(…)`, `<K extends …>(…)`, `<T,>(…)`. Nicht erkannt: JSX-Text in `script`- und `style`-Elementen, die als Text gelesen würde, und seltene TypeScript-Konstrukte, die Text verschieben können. Die Zeilennummer bleibt dabei richtig.
- Code in `${…}` einer Vorlage wird als Leerzeichen gelesen. Sein Inhalt wird nicht geprüft.
- Zeichenketten im Code unter acht Zeichen oder ohne Sprachform (z. B. „Ja“, „[PLZ]“ im Code) werden nicht geprüft. Sichtbare Stellen und Werte unter Feldern wie `hint` oder `label` gelten auch kurz.
- Attribute außerhalb der Listen zählen als Code und unterliegen der Sprachform-Regel.
- Werte unter Feldern aus der Liste sichtbarer Attribute (`hint: „…“`, `label: „…“`) zählen wie Attribute. Andere Objektwerte (`name: „…“`) gelten als Code und zählen nur bei Sprachform.
- Dateien direkt unter `src/app` (etwa `global-error.tsx`, `manifest.ts`, `src/app/llms.txt/route.ts`) gehören nicht zur Quelle, weil das Paket nur die drei Ordner nennt. `global-error.tsx` enthält den Satz „Die Seite konnte nicht geladen werden.“, der in keiner vorgerenderten Seite steht. Die Lücke ist offen (Frage 9).
- Geprüft werden die Bausteine im Quelltext, nicht Daten aus der Datenbank. Ob ein Wort aus den Daten erscheint, zeigt nur ein Lauf gegen gerenderte Seiten mit Serverdaten (offen aus 03A).
- Client-Bundles (`.next/static`) werden nicht gelesen (offen aus 03A, Frage 7).
- Anschriften im Quelltext werden weiter nur gegen `content/settings.json` abgeglichen, nicht als fest gemeldet. Das Paket nennt nur Telefon und Mail (offene Frage 5).
- Verweise `tel:` werden in allen Quellen gelesen (Regeländerung, nur zusätzliche Funde).
- Ausgabe nennt Zeile und Art, z. B. „Zeile 173 (code)“. Ausnahmen mit Feld `ort` beziehen sich auf diesen Text.

## OFFENE FRAGEN

1. B1: Soll die Kennzeichnung „(Beispiel)“ eine Ausnahme mit Grund werden, weil Beispielartikel nicht öffentlich sind? Oder soll die Regel so bleiben? Entscheidung Orchestrator.
2. B4: Sollen die Redaktionshinweise in Impressum und Datenschutz, die nur außerhalb der Produktion und im Schaufenster erscheinen, als Ausnahme je Stelle geführt werden? Entscheidung Orchestrator.
3. B3: Welche Terminzeiten gelten (Öffnungszeiten in `content/settings.json`, offen aus 03A)? Inhaber.
4. B2: Die Bearbeitungsdauer nennt der Inhaber. Der Entwurf oben ist kein Endtext.
5. Soll eine fest eingetragene Anschrift im Quelltext ebenfalls ein Fund sein, wie Telefon und Mail? Das Paket nennt nur Telefon und Mail. Entscheidung Orchestrator.
6. Soll die Quelle `.next/static` (Client-Bundles) dazukommen? Offen aus 03A, Frage 7. Das ändert den Quellenkatalog des Pakets.
7. Sollen weitere Attribute als sichtbar oder technisch geführt werden (z. B. `value`, `caption`)? Heute zählen sie als Code.
8. Die Mindestlänge von acht Zeichen gilt im Code. Kurze Platzhalter außerhalb sichtbarer Stellen bleiben damit unbeachtet. Soll das so bleiben?
9. Sollen Dateien direkt unter `src/app` (`global-error.tsx`, `manifest.ts`, `llms.txt/route.ts`, `apple-icon.tsx`) in die Quelle `quelltext` aufgenommen werden? Das Paket nennt nur die drei Ordner, der Zweck schließt sie ein. Entscheidung Orchestrator.

Hinweis zu FA-SHOP-02 (gleicher Arbeitsbaum): Ob eine der oben genannten Dateien gerade von FA-SHOP-02 geändert wird, habe ich nicht geprüft, weil kein git benutzt wird. Die Funde stammen vom Stand des Laufs, sein Protokoll liegt unter `_werkstatt/ausbau/protokolle/reste-<Zeitstempel>.json`.

## FÜR MENSCHEN

- Inhaber: Terminzeiten (B3, offene Frage 3), Bearbeitungsdauer (B2), Firmendaten, deren Fehlen die Hinweise in B4 auslöst.
- Orchestrator: Ausnahmen für B1 und B5 bis B9 sind nur vorgeschlagen, nichts ist eingetragen (G8). Entscheidung über die Regel für Beispielartikel und über den Umfang der Quelle (Frage 9).
- Lauf nach jedem neuen Build und nach Änderungen an `src` wiederholen: `sicher.sh --json --als-root -- node _werkstatt/ausbau/werkzeuge/reste.mjs --md <Datei>`.

## NACHBESSERUNG

Die Gegenprüfung hat zehn Befunde gemeldet. Jeder ist am Code geprüft. Ergebnis je Befund:

1. **Behoben.** Zutreffend: Impressum und Datenschutz zeigen den Hinweis über `RedaktionsHinweis` nur, wenn `pruefhinweiseZeigen()` wahr ist (`src/components/recht/redaktions-hinweis.tsx`, Zeile 19; `src/lib/umgebung.ts`, Zeile 73). B4 ist berichtigt, offene Frage 2 ist als Frage zur Ausnahme formuliert, der Punkt Rechtsprüfung in FÜR MENSCHEN ist gestrichen.
2. **Behoben.** Zutreffend: Der Klammersatz führt in `schluessel-nach-vorlage/page.tsx` über `istPlatzhalterAntwort` dazu, dass die ganze Frage „Wie lange dauert die Prüfung?“ fehlt. B2 nennt das jetzt als Einordnung, der Vorschlag wiederholt keinen Satz mehr.
3. **Behoben.** Zutreffend: `scheduling.ts`, Zeile 186, überspringt das Fenster mit Grund `oeffnungszeit` für Kunden. Der Text erscheint nur über `termin-verwaltung.ts`, Zeile 73, in der Betriebsverwaltung. B3 ist als interner Text eingeordnet, offene Frage 3 ist gekürzt.
4. **Behoben.** Zutreffend: Werte unter den sichtbaren Feldnamen zählten nicht. `reste.mjs` zählt sie jetzt als sichtbar, wenn der Schlüssel in `SICHTBARE_ATTRIBUTE` steht. Dazu zwei neue Tests. Der Lauf bringt keinen neuen Fund, die Textstellen steigen von 8777 auf 8999. Die Grenze im Bericht ist angepasst.
5. **Behoben als benannte Lücke.** Zutreffend: `global-error.tsx`, `manifest.ts` und `llms.txt/route.ts` liegen außerhalb der drei Ordner. Die Aufnahme wäre eine Änderung am Umfang, den das Paket festlegt, deshalb ist die Lücke unter GRENZEN benannt und als Frage 9 gestellt. Die Regel ist nicht geändert.
6. **Behoben.** Zutreffend: Der Kopf der Quelle beschrieb `${…}` als ganz gelesen und `<T,>` als JSX. Der Kopf entspricht jetzt dem Code und dem Bericht.
7. **Behoben.** Zutreffend: Der Satz zur Herkunft war widersprüchlich. Er lautet jetzt „Alle Befunde B1 bis B9 stammen aus der neuen Quelle `quelltext`.“ Die Tabelle zählt 14 Funde aus `quelltext`, B1 bis B9 ergeben ebenfalls 14.
8. **Behoben.** Zutreffend: Gleicher Fehler wie 6 im Kopfkommentar, mit derselben Änderung behoben.
9. **Behoben.** Zutreffend: `pruefeAlles` meldete bei ungültigem JSON in `content` einen Bedienfehler (Exit 2), auch wenn `inhalt` nicht gewählt war. Jetzt gilt: Bedienfehler nur bei gewählter Quelle; sonst ein Hinweis „Beispielmuster unvollständig“ im Bericht. `quellen.inhalt.dateien` zählt nur bei gewählter Quelle. Test ergänzt.
10. **Behoben.** Zutreffend: Doppelt zu 7, mit derselben Änderung behoben.

Prüfung nach der Nachbesserung über die Datenweiche: Selbsttest **60 von 60 bestanden** (44 bisherige unverändert, 16 neue). Lauf gegen den heutigen Stand: Exit 1, 24 Funde, davon 14 aus `quelltext`, Bedienfehler 0, Hinweise 0. Die Lauf-Datei `FA-QA-03B-lauf.md` ist aktualisiert.

## ABNAHME (Orchestrator, 16.11.2026)

- **Werkzeug geprüft:** Selbsttest 61 von 61 über die Datenweiche (44 unveränderte, 16 aus dem Paket, 1 neuer zu Verweisen in Markdown). Lauf über alle vier Quellen: 148 vorgerenderte Seiten, 18 Inhaltsdateien, 38 Codedateien, 537 Quelltextdateien mit rund 9.000 Textstellen.
- **Ergebnis:** Auch in den Texten, die erst im Browser entstehen, steht kein Demo-Name, keine alte Anschrift oder Zeit, keine fest eingetragene Rufnummer oder Mailadresse und keine Aussage „geöffnet“. Als echter Fund bleibt wie bisher nur der Vertragstext des Anwalts (zehn Stellen im Partnervertrag, MA-29); der Lauf endet deshalb weiter mit 1.
- **Vom Orchestrator am Werkzeug nachgezogen:** Die Quelle liest jetzt ganz `src/app` (auch `global-error.tsx`, `manifest.ts`, `llms.txt` und die Schnittstellen unter `api`; das Admin bleibt ausgeschlossen). Verweise in Markdown wie „[Kontakt](Adresse)“ gelten nicht mehr als Platzhalter (vier Fehlfunde in `llms.txt`), mit Test.
- **Am Produkt geändert:**
  - B2: Die Frage „Wie lange dauert die Prüfung?“ auf „Schlüssel nach Vorlage“ war unsichtbar, weil in ihrer Antwort ein Platzhalter für die Dauer stand. Der Platzhalter ist gestrichen; die Frage erscheint jetzt mit der Antwort, die stimmt („Die Dauer hängt vom Schlüsseltyp und von der Qualität der Fotos ab. Wir melden uns, sobald die Prüfung abgeschlossen ist.“). Eine übliche Dauer nennt der Inhaber (MA-41).
  - B3: Der Grund in der Terminverwaltung des Teams heißt „Außerhalb der Terminzeiten der Werkstatt“ statt „Außerhalb der Öffnungszeiten“; zwei Hilfetexte im Admin sagen ebenfalls „Terminzeiten der Werkstatt“.
- **Entschiedene Ausnahmen** (zehn neue Einträge, jeder mit Grund): Kennzeichnung „(Beispiel)“ bei Beispielartikeln (B1); Hinweise an die Redaktion bei Platzhalter-Firmendaten, die im Livebetrieb nie erscheinen (B4); der ungezeigte Entwurf des Anfahrtshinweises (B5, dazu MA-52); eine Meldung der Livegang-Prüfung (B6); der Betreffzusatz umgeleiteter Mails außerhalb der Produktion (B7); zwei Marken im gespeicherten Mailverlauf des Admins (B8, B9: In der Mail an den Kunden stehen sie nicht).
- **Entschieden zu den offenen Fragen:** Eine fest eingetragene Anschrift im Quelltext bleibt beim Abgleich (kein eigener Fund); die Client-Bündel kommen nicht dazu, weil der Quelltext dieselben Texte genauer zeigt; die Mindestlänge von acht Zeichen im Code bleibt.

