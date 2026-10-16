# Textvorschläge

Vorschläge für Texte außerhalb der Mikrotexte. Nichts davon ist eingebaut; du entscheidest.

## Startseite (aus der Sichtabnahme E2-L-07)
| Stelle | Heute | Vorschlag | Grund |
|---|---|---|---|
| Unterzeile im Kopf (`content/seo.json` → `subline`, Vorgabe in `src/lib/data/defaults/content.ts`) | „Dazu Schlüssel, Schließanlagen, Zutrittslösungen und Sicherheitstechnik aus einer Hand.“ | „Dazu Schlüssel nach Code und Vorlage, Schließanlagen, Zutrittslösungen und Sicherheitstechnik – in der eigenen Werkstatt geprüft.“ | „aus einer Hand“ ist eine Floskel; die Leitidee verlangt „bemaßt statt behauptet“. |
| Abschnitt 01 (`src/app/(site)/page.tsx`) | „Wobei können wir helfen?“ | „Acht Bereiche, je ein klarer Ablauf“ | Eine Frage als Überschrift wirkt generisch; die Zahl ordnet ein. |

## Modellseite (`/autoschluessel/marken/[make]/[model]`)
- **Doppelte Verweise:** „Andere {Marke}-Modelle“ (Abschluss) und „Alle {Marke}-Modelle“ (Passend dazu) führen auf dieselbe Seite. Vorschlag: den zweiten Verweis streichen oder durch „Autoschlüssel-Leistungen im Überblick“ (`/autoschluessel`) ersetzen.

## Schlüssel nach Vorlage (`/schluessel-nach-vorlage`)
- **Schrittzahl:** Abschnittsüberschrift „Vier Abschnitte“, Fließtext „Der Ablauf hat acht Schritte“, Navigation „Acht Schritte, mobil bedienbar“. Vorschlag: einheitlich „Acht Schritte in vier Abschnitten“ oder die Abschnittsüberschrift „In vier Etappen“.

## Autoschlüssel-Assistent (`/autoschluessel/anfrage`)
- **Absenden oder buchen:** Der Schritt „Termin“ sagt „Danach senden Sie Ihre Anfrage ab“, der Schritt „Anzahlung“ „Erst danach senden Sie die Anfrage ab“, der Knopf heißt „Zahlungspflichtig buchen“. Vorschlag nach rechtlicher Prüfung: einheitlich „Danach buchen Sie den Termin zahlungspflichtig“.
- **Doppelter Hinweis im Terminschritt:** Bei einem nicht mehr freien Zeitfenster erscheinen zwei Warnungen mit ähnlichem Inhalt. Vorschlag: nur „Ihr zuletzt gewähltes Zeitfenster ist nicht mehr frei. Bitte wählen Sie einen anderen Termin.“

