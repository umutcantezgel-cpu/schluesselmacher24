# E3-KUNDSCHAFT · Bestandsaufnahme Welle E3-B

Vier Haiku-Kundschafter (Workflow wf_4063d049-6b3), nur lesend. Zeilennummern zum Stand nach Commit 3c7d83e.

## E3-B-04
### `src/components/autoschluessel/service-article.tsx` · 291 Zeilen · Server
- **exporte:**
  - interface RelatedLink (L24-28): href, label, description?
  - interface ArticlePoint (L30-34): title, body, hint?: InfoHint
  - interface ServiceArticleProps (L36-59): content, fallback, eyebrow, crumbs, image, what, when, need, boundary, faq, next, related?, children?
  - function ServiceArticle({...}: ServiceArticleProps) (L61)
- **verwendet_von:**
  - src/app/(site)/autoschluessel/nachmachen/page.tsx:5
  - src/app/(site)/autoschluessel/programmieren/page.tsx:6
  - src/app/(site)/autoschluessel/kopieren/page.tsx:7
  - src/app/(site)/autoschluessel/funkschluessel/page.tsx:6
  - src/app/(site)/autoschluessel/smart-key/page.tsx:6
  - src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx:5
  - src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx:7
- **lucide:**
  - ArrowRight: Import L3; L97 Primär-Button Kopf (17px, aria-hidden); L235 Primär-Button Schritt (17px, aria-hidden); L267 Pfeil in Link-Liste (16px, aria-hidden, group-hover-Verschiebung)
  - Check: Import L3; L160 im 24px-Kreis L156-159 (14px, Span aria-hidden) bei need.items
  - Minus: Import L3; L197 im Kreis L193-196 (14px, Span aria-hidden) bei boundary.items
- **freie_werte:**
  - text-[11px]: L247 (Überschrift 'Passend dazu')
  - text-[13px]: L262 (Link-Beschreibung)
  - text-[14px]: L137, L167, L201 (Fließtext in Karten und Listen)
  - text-[15px]: L134, L164, L200 (h3), L258 (Link-Label)
  - min-h-[44px]: L255 (Link-Ziel)
  - lg:grid-cols-[1.15fr_1fr]: L104
  - lg:grid-cols-[1fr_1.1fr]: L149
  - lg:grid-cols-[1.1fr_1fr]: L229
  - translate-x-0.5: L270 (group-hover am Pfeil)
  - prose-sm24: L107 (Custom-Klasse, kein Arbitrary-Wert; Definition nicht in dieser Datei)
- **hover_fokus:**
  - L253-256 Link-Ziel: group-hover auf Label L258 (text-primary) und auf Pfeil L270 (translate-x-0.5); in dieser Datei kein focus-Zustand gesetzt
  - L95, L233, L238 ButtonLink: Hover- und Fokuszustand liegen in ui/button, nicht in dieser Datei
- **zugaenglichkeit:**
  - L255 min-h-[44px] am Link-Ziel: Mindestgröße 44 px erfüllt
  - Dekor-Icons aria-hidden: L156 (Span um Check), L193 (Span um Minus), L97, L235, L267
  - L246 nav mit aria-label 'Weiterführende Seiten'; L247 h2 'Passend dazu' innerhalb der nav
  - Überschriftenfolge: h3 in Karten und Listen (L134, L164, L200) ohne h2 in dieser Datei; die Ebene der Überschrift in SectionHeading (src/components/layout/section) ist hier nicht geprüft
  - Keine Alt-Texte in dieser Datei; Bildausgabe läuft über ImagePlaceholder (L121)
- **bewegung:**
  - L270 transition-transform mit group-hover:translate-x-0.5 am Pfeil; keine motion-reduce-Variante in dieser Datei
  - L258 group-hover:text-primary ohne Transition-Klasse
  - Keine Keyframes, keine JS-Animation
- **platzhalter:**
  - L121 ImagePlaceholder slot={image}: Darstellung des Platzhalters liegt in ui/image-placeholder (nicht in dieser Datei)
  - Fallback-Texte fuer fehlenden Inhalt: Prop fallback (L40), Verwendung L76-78; Kommentar L39 'Greift, solange für die Route noch kein Inhalt gepflegt ist'
  - Fest eingetragene Texte in der Datei: 'Hinweis zu Ihren Unterlagen' (L176), 'Häufige Fragen' (L219), 'Was Kundinnen und Kunden uns dazu fragen' (L220), 'Passend dazu' (L248), 'Weiterführende Seiten' (L246)
  - Keine [Platzhalter…]-Strings in dieser Datei
- **tests:**
  - Keine Testdatei unter src/ oder im Repo (ohne node_modules) importiert oder rendert ServiceArticle bzw. service-article; Suche über *.test/*.spec-Dateien nach ServiceArticle und service-article ohne Treffer
  - Die sieben Leistungsseiten haben im Repo (ohne node_modules) keine Testdatei
- **aufbau:** L1-14 Importe (React-Typ, Link, lucide ArrowRight/Check/Minus, Typen, PageHeader, Section, SectionHeading, ButtonLink, Card, CardBody, Alert, Accordion, ImagePlaceholder, InfoTip); L16-21 Kommentar 'Gemeinsamer Aufbau' (feste Reihenfolge: was/wann/brauchen/Abgrenzung/Fragen/Schritt); L23-59 Typen; L61-85 Funktion: Fallback-Werte L76-78, editorialSections und editorialFaq L81-83, faqItems L83, links L85; L89-100 PageHeader mit Primär-Button; L102-123 Abschnitt 'Was ist das' (Titel what.title, Absätze intro, what.paragraphs, editorialSections L112-117, ImagePlaceholder L121); L125-145 Abschnitt 'Wann brauchen Sie das' (muted, Karten when.items, Hinweis-InfoTip L135); L147-182 Abschnitt 'Was wir von Ihnen brauchen' (need.items mit Check-Icon L160, InfoTip L165, Alert need.note L175-178); L184-211 Abschnitt 'Abgrenzung' (muted, outline-Karten, Minus-Icon L197); L213 {children}; L215-225 FAQ-Abschnitt (nur wenn faqItems.length>0, Accordion L223); L227-279 Abschnitt 'Nächster Schritt' (muted, tight, primary L233, secondary L237-241, Liste 'Passend dazu' L245-277 nur wenn links.length>0); L284-291 dedupeLinks (nicht exportiert).
- **logik:** Rein präsentational: keine Hooks, kein State, kein 'use client'. Inhalt: headline, subline, intro aus content, sonst aus fallback (L76-78). content.sections erscheinen nach den festen what.paragraphs (L112-117). FAQ: ist content.faq nicht leer, ersetzt es das faq-Prop vollständig (L82-83), kein Zusammenführen. Links: dedupeLinks([...content.seo.internalLinks, ...related]) (L85); bei gleichem href gewinnt das erste Vorkommen (L284-291). Bedingte Darstellung: item.hint (L135, L165), need.note (L175), next.secondary (L237), faqItems.length>0 (L216), links.length>0 (L245), children (L213). Keys: text.slice(0,40) (L110), section.heading (L113), item.title (L130, L154, L189), link.href (L252). Nicht ohne Prüfung anfassen: Abschnittsreihenfolge (Kommentar L17-20), Vorrang content.faq vor faq-Prop (L83), dedupe-Reihenfolge (L85).

### `src/components/autoschluessel/key-kinds.tsx` · 103 Zeilen · Server
- **exporte:**
  - keyKindLabel(kind: KeyKind | string): string (L40-42)
  - keyKindShortLabel(kind: KeyKind | string): string (L45-47)
  - keyKindDescription(kind: KeyKind | string): string | undefined (L50-52)
  - KEY_KIND_HINT: InfoHint (L55-67)
  - ON_SITE_HINT: InfoHint (L70-76)
  - KeyKindBadges({ kinds: KeyKind[], className?: string }) (L79-103)
  - Nicht exportiert: LABELS (L10-16), SHORT_LABELS (L18-24), DESCRIPTIONS (L26-37)
- **verwendet_von:**
  - src/components/autoschluessel/schluesselarten-reihe.tsx:5 (keyKindDescription, keyKindLabel)
  - src/app/(site)/autoschluessel/page.tsx:17 (KEY_KIND_HINT, ON_SITE_HINT)
  - src/app/(site)/autoschluessel/marken/page.tsx:14 (KeyKindBadges, KEY_KIND_HINT)
  - src/app/(site)/autoschluessel/marken/[make]/page.tsx:15-20 (KeyKindBadges, KEY_KIND_HINT, ON_SITE_HINT, keyKindLabel)
  - src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:17-23 (KeyKindBadges, KEY_KIND_HINT, ON_SITE_HINT, keyKindDescription, keyKindLabel)
  - src/app/(site)/autoschluessel/nachmachen/page.tsx:6 (ON_SITE_HINT)
  - src/app/(site)/autoschluessel/programmieren/page.tsx:7 (ON_SITE_HINT)
  - src/app/(site)/autoschluessel/smart-key/page.tsx:7 (ON_SITE_HINT)
- **lucide:**
  - Keine lucide-Icons (keine Import-Zeile)
- **freie_werte:**
  - text-[13px]: L88 (Platzhalter-Span)
  - L95 Template-String 'flex flex-wrap gap-1.5 ${className}': className wird ohne Prüfung angehängt
- **hover_fokus:**
  - Keine Hover- oder Fokuszustände in dieser Datei; Badge (L98) ohne interaktive Props
- **zugaenglichkeit:**
  - L94-102 Badges als ul/li-Liste
  - L88 Platzhalter ist sichtbarer Text, kein Icon
  - KEY_KIND_HINT.figure (L62-66): Bildbeschreibung als Text in motif; ob ein alt-Text beim Rendern gesetzt wird, liegt bei InfoTip und ist hier nicht geprüft
- **bewegung:**
  - Keine Animationen, Übergänge oder Keyframes
- **platzhalter:**
  - L89 '[Platzhalter: Schlüsselarten noch nicht erfasst]' bei leerem kinds-Array in KeyKindBadges
  - L63 figure.motif 'Vergleichsfoto: mechanischer Schlüssel, Klappschlüssel und Smart Key nebeneinander' und L65 note 'Eigene Aufnahme aus der Werkstatt, alle drei Bauformen im gleichen Maßstab.': beschreiben ein Bild, das in dieser Datei nicht referenziert wird; Existenz und Quelle des Bildes sind nicht geprüft
- **tests:**
  - src/components/autoschluessel/schluesselarten-reihe.test.tsx:8-18 rendert SchluesselartenReihe, die keyKindLabel und keyKindDescription aufruft (schluesselarten-reihe.tsx:40-47). Der Test erwartet die Titel 'Zeichnung: Mechanischer Schlüssel', 'Funkschlüssel', 'Klappschlüssel', 'Smart Key' (Test L17-18) und 'Keyless:' (Test L13). Die Abdeckung ist nur indirekt, weil der Test keine dieser Funktionen direkt aufruft.
  - Keine direkte Testdatei für KeyKindBadges, KEY_KIND_HINT, ON_SITE_HINT, keyKindShortLabel
- **aufbau:** L1-2 Importe (InfoHint, KeyKind; Badge); L4-8 Kommentarblock (nur Anzeigetexte, keine Preise, keine Fahrzeugdaten); L10-16 LABELS als Record<KeyKind,string> (Langform); L18-24 SHORT_LABELS (Kurzform); L26-37 DESCRIPTIONS (ein Satz je Art); L40-52 Lookup-Funktionen keyKindLabel, keyKindShortLabel, keyKindDescription; L55-67 KEY_KIND_HINT (title, body, figure mit motif, ratio '3/2', note); L70-76 ON_SITE_HINT (title, body); L79-103 KeyKindBadges: leeres Array liefert Platzhalter-Span (L86-92), sonst ul mit li und Badge tone outline (L94-102).
- **logik:** Rein präsentational: keine Hooks, kein State, kein 'use client'. Unbekannte Werte: keyKindLabel und keyKindShortLabel geben den Eingabewert unverändert zurück (L41, L46); keyKindDescription gibt undefined (L51). KeyKindBadges: kinds leer führt zu Platzhalter (L86); key={kind} (L97). Die Record-Schlüssel (L10, L18, L26) entsprechen den fünf Werten des Typs KeyKind in src/lib/types.ts:152-157 (mechanisch, funk, klappschluessel, smart-key, keyless). KEY_KIND_HINT und ON_SITE_HINT sind geteilte Konstanten, die auf mehreren Seiten verwendet werden. Nicht ohne Prüfung anfassen: die Werte in LABELS (L11-15), weil der Test sie als Titel erwartet.

### `src/components/autoschluessel/vehicle-facts.tsx` · 28 Zeilen · Server
- **exporte:**
  - formatModelYears(model: Pick<VehicleModel,'yearFrom'|'yearTo'>): string (L11-14)
  - OnSiteBadge({ required: boolean }) (L17-23)
  - onSiteLabel(required: boolean): string (L26-28)
- **verwendet_von:**
  - src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:24 (OnSiteBadge, formatModelYears)
  - src/app/(site)/autoschluessel/marken/[make]/page.tsx:21 (formatModelYears, onSiteLabel)
- **lucide:**
  - Keine lucide-Icons (keine Import-Zeile)
- **freie_werte:**
  - Keine Arbitrary-Werte und keine text-[..]-Klassen in dieser Datei; Badge-Tones primary (L19) und neutral (L21)
- **hover_fokus:**
  - Keine Hover- oder Fokuszustände; Badge ohne Interaktion
- **zugaenglichkeit:**
  - OnSiteBadge (L18-22) trägt die Aussage als Text ('Fahrzeug vor Ort nötig' bzw. 'Ohne Fahrzeug möglich'), nicht nur über Farbe
  - onSiteLabel (L27) liefert 'Ja' oder 'Nein' als Tabellentext, ohne Icon
- **bewegung:**
  - Keine Animationen oder Übergänge
- **platzhalter:**
  - L12 '[Platzhalter: Baujahre noch nicht erfasst]' wenn yearFrom falsy ist
- **tests:**
  - Keine Testdatei importiert oder rendert vehicle-facts; Suche über *.test/*.spec-Dateien nach formatModelYears, OnSiteBadge, onSiteLabel ohne Treffer
- **aufbau:** L1-2 Importe (VehicleModel; Badge); L4-8 Kommentarblock (nichts ergänzen, fehlende Angaben als offen kennzeichnen); L10-14 formatModelYears; L16-23 OnSiteBadge (Badge tone primary bei required, sonst neutral); L25-28 onSiteLabel (Ja/Nein).
- **logik:** Rein präsentational: keine Hooks, kein State. formatModelYears: falsy yearFrom liefert Platzhalter (L12); bei gesetztem yearTo 'von–bis' mit Gedankenstrich U+2013 (L13); sonst 'ab <yearFrom>'. yearFrom ist in src/lib/types.ts:176 als number typisiert, yearTo optional (types.ts:177). OnSiteBadge: required true ergibt primary, false ergibt neutral (L18-22). onSiteLabel: 'Ja' oder 'Nein' (L27).

**Auffälliges:**
- service-article.tsx L110: key={text.slice(0, 40)} kann bei zwei Absätzen mit gleichem 40-Zeichen-Anfang kollidieren. Frage: Ist das bei den gepflegten Texten ausgeschlossen?
- service-article.tsx L113 und L130/L154/L189/L252: Keys über section.heading, item.title und link.href setzen Eindeutigkeit innerhalb einer Seite voraus. Frage: Ist das für alle sieben Seiten sichergestellt?
- service-article.tsx L82-83: Ist gewollt, dass ein nicht leeres content.faq das faq-Prop vollständig ersetzt und nicht ergänzt? Frage.
- service-article.tsx L107: Klasse prose-sm24 ist in dieser Datei nicht definiert; Fundort nicht geprüft. Frage: Wo ist sie definiert?
- service-article.tsx L270: transition-transform ohne motion-reduce-Variante in dieser Datei. Frage: Wird das global abgefangen?
- service-article.tsx: Die Ebene der Überschriften in SectionHeading (h2 oder h3) ist in dieser Datei nicht geprüft. Frage: Ergibt sich in der Seite eine lückenlose Überschriftenfolge mit den h3 aus den Karten?
- Keine Testdatei für ServiceArticle und die sieben Leistungsseiten im Repo gefunden (ohne node_modules). Frage: Gibt es E2E- oder visuelle Prüfungen an anderer Stelle, die hier nicht gesucht wurden?
- Die sieben Leistungsseiten selbst wurden nicht gelesen (nicht im Auftrag). Geprüft wurde nur, dass sie ServiceArticle importieren.
- key-kinds.tsx L63 und L65: Das Vergleichsfoto (figure.motif, figure.note) wird in dieser Datei nicht referenziert. Frage: Existiert das Bild, und wo wird figure gerendert (InfoTip, nicht geprüft)?
- key-kinds.tsx L72-75 (ON_SITE_HINT.body): Technische Aussage im Code, hier nicht bewertet. Frage: Ist sie redaktionell freigegeben?
- key-kinds.tsx L89: Platzhaltertext '[Platzhalter: Schlüsselarten noch nicht erfasst]' ist fest im Code. Frage: Darf er im Live-Stand erscheinen, wenn kinds leer ist?
- vehicle-facts.tsx L12-13: Prüfung auf Falsy (!model.yearFrom, model.yearTo ?) statt auf null oder undefined. Frage: Ist yearFrom mit 0 denkbar? Laut types.ts:176 ist yearFrom als number typisiert.
- vehicle-facts.tsx: Keine Tests für formatModelYears, OnSiteBadge und onSiteLabel. Frage: Ist das so gewollt?

## E3-B-05
### `src/components/autoschluessel/preis-anzeige.tsx` · 159 Zeilen · Client
- **exporte:**
  - PreisAnzeigeProps (interface, Z. 10-12): quote: PriceQuote
  - PreisAnzeige({ quote }: PreisAnzeigeProps) (Z. 39)
- **verwendet_von:**
  - src/app/(site)/autoschluessel/anfrage/assistent.tsx:37 (Import), :1402 (<PreisAnzeige quote={quote} />)
- **lucide:**
  - Car → Z. 3, 129 → Karte Fahrzeug beim Termin → size 18, mt-0.5 shrink-0 text-foreground-subtle, aria-hidden
  - Clock → Z. 3, 117 → Karte Eingeplante Terminlaenge → size 18, mt-0.5 shrink-0 text-foreground-subtle, aria-hidden
  - Info → Z. 3, 154 → Fussnote Endpreise → size 15, mt-0.5 shrink-0, aria-hidden
- **freie_werte:**
  - text-[15px] font-bold text-foreground (Z. 17, Label strong)
  - text-[14px] text-foreground-muted (Z. 17, Label normal)
  - font-display text-lg font-bold text-foreground (Z. 23, Wert strong; font-display ist ein eigener Token)
  - text-[15px] font-semibold text-foreground (Z. 24, Wert normal)
  - text-[11px] font-bold uppercase tracking-wider text-primary (Z. 45, 68)
  - text-[13px] leading-relaxed text-foreground-muted (Z. 56, 85, 120, 143)
  - text-[14px] font-bold text-foreground (Z. 119, 131)
  - text-[13px] leading-relaxed text-foreground-subtle (Z. 153)
  - Standardklassen ohne Sonderwert: space-y-4 (Z. 41), divide-y divide-border (Z. 48, 71), grid gap-3 sm:grid-cols-2 (Z. 114), py-2.5 (Z. 16), flex items-start gap-3 (Z. 116, 128)
- **hover_fokus:**
  - Datei selbst hat keine Hover- oder Fokus-Klassen.
  - Interaktiv ist nur InfoTip (Z. 133-141); dessen Zustaende liegen in src/components/ui/info-tip.tsx und wurden nicht gelesen.
- **zugaenglichkeit:**
  - Kartentitel sind p-Elemente (Z. 45, 68, 119, 131), in dieser Datei keine Ueberschrift-Ebene.
  - Icons sind aria-hidden (Z. 117, 129, 154).
  - InfoTip-Ausloeser (Z. 133): Label und Zielgroesse sind aus dieser Datei nicht ersichtlich.
  - Keine Touch-Ziele mit expliziter Groesse in der Datei.
- **bewegung:**
  - Keine Animationen oder Uebergaenge.
- **platzhalter:**
  - Keine Platzhalter. Fallbacktext 'wird nach Pruefung genannt' (Z. 76), wenn priceFromCents undefined ist.
- **tests:**
  - Keine Testdatei rendert oder importiert PreisAnzeige. Suche nach Dateiname, Komponentenname und Importpfad in allen *.test.*- und *.spec.*-Dateien ohne Treffer.
- **aufbau:** 1: 'use client'
3-8: Imports (lucide Car, Clock, Info; Typ PriceQuote; formatCents, formatDuration; Alert; Card, CardBody; InfoTip)
10-12: Props-Interface
14-31: interne Hilfskomponente Zeile({ label, value, strong }) als dt/dd-Paar
33-38: JSDoc zu PreisAnzeige
39-159: PreisAnzeige, Wurzel div.space-y-4
42-63: Card 'Fester Preis fuer Ihre Angaben' bei mode 'fest' und priceCents !== undefined (Gesamtpreis, Anzahlung, Restbetrag, Hinweistext)
65-92: Card 'Preisrahmen fuer Ihre Angaben' bei mode 'rahmen' (Von-bis bzw. ab, Anzahlung, Hinweistext)
94-106: Alert warning 'Ihr Fall wird vor der verbindlichen Buchung geprueft' bei mode 'pruefung'
108-112: Alert info 'Hinweis zu Ihrem Fall' bei quote.note
114-151: Grid sm:grid-cols-2 mit zwei Karten variant muted: 'Eingeplante Terminlaenge' (Z. 117-125) und 'Fahrzeug beim Termin' mit InfoTip (Z. 127-150)
153-156: Fussnote 'Alle Betraege verstehen sich als Endpreise einschliesslich Umsatzsteuer.'
- **logik:** Keine Hooks, kein State, keine Datenzugriffe; reine Darstellung aus Prop quote.
Verzweigungen: mode === 'fest' && priceCents !== undefined (Z. 42); mode === 'rahmen' (Z. 65); Label-Wahl ueber priceToCents (Z. 73); Wert-Verzweigung Z. 74-80; mode === 'pruefung' (Z. 94); quote.note (Z. 108); requiresVehicleOnSite (Z. 144).
Restbetrag Z. 53: quote.remainderCents ?? Math.max(0, quote.priceCents - quote.depositCents).
Verwendete Felder: mode, priceCents, depositCents, remainderCents, priceFromCents, priceToCents, note, slotMinutes, requiresVehicleOnSite.
Formatierung ueber formatCents und formatDuration aus @/lib/format (Z. 5).

### `src/components/autoschluessel/termin-auswahl.tsx` · 134 Zeilen · Client
- **exporte:**
  - TerminAuswahlProps (interface, Z. 9-24): days: Array<{ date: string; slots: TimeSlot[] }>, loading: boolean, error?: string | null, leadTimeDays: number, slotMinutes: number, requiresVehicleOnSite: boolean, staleSelection?: boolean (Default false), selectedDate: string, selectedTime: string, onSelect(date: string, time: string) => void
  - TerminAuswahl({...}: TerminAuswahlProps) (Z. 27-38)
- **verwendet_von:**
  - src/app/(site)/autoschluessel/anfrage/assistent.tsx:38 (Import), :1500 (<TerminAuswahl>-Aufruf; Props dort nicht geprueft)
- **lucide:**
  - CalendarClock → Z. 3, 113 → Tagesueberschrift → size 17, text-foreground-subtle, aria-hidden
  - Loader2 → Z. 3, 84 → Ladeanzeige → size 17, animate-spin, aria-hidden
- **freie_werte:**
  - text-[15px] text-foreground-muted flex items-center gap-2 (Z. 83, Ladeanzeige)
  - text-[15px] font-bold text-foreground (Z. 112, Tagesueberschrift)
  - animate-spin (Z. 84)
  - Standardklassen: space-y-5 (Z. 40), mt-3 grid gap-2 sm:grid-cols-2 (Z. 116); keine weiteren Sonderwerte
- **hover_fokus:**
  - Datei selbst hat keine Hover- oder Fokus-Klassen.
  - Interaktiv sind die OptionCards (Z. 118-126) mit checked-Zustand (Z. 122: selectedDate === slot.date && selectedTime === slot.time); deren Zustaende liegen in src/components/forms/option-card.tsx und wurden nicht gelesen.
- **zugaenglichkeit:**
  - Tagesueberschriften sind h3 (Z. 112); in dieser Datei kein h2, die Ebene haengt vom Aufrufer ab.
  - Ladezustand ueber role=status (Z. 83). Icons aria-hidden (Z. 84, 113).
  - Abschnitte mit aria-label=formatDate(day.date) (Z. 111).
  - Zielgroessen der OptionCards sind aus dieser Datei nicht ersichtlich.
- **bewegung:**
  - animate-spin an Loader2 (Z. 84), dauerhafte Drehung waehrend loading.
- **platzhalter:**
  - Keine Platzhalter. Alle Texte sind fest im Code.
- **tests:**
  - Keine Testdatei rendert oder importiert TerminAuswahl. Die einzige Testdatei im Ordner src/components/autoschluessel/ (schluesselarten-reihe.test.tsx) enthaelt den Namen nicht.
- **aufbau:** 1: 'use client'
3-7: Imports (lucide CalendarClock, Loader2; Typ TimeSlot; formatDate, formatDuration; Alert; OptionCard)
9-24: Props-Interface mit JSDoc zu staleSelection (Z. 16-19)
27-38: Funktion, Destrukturierung mit Default staleSelection = false
40: Wurzel div.space-y-5
41-47: Alert info 'Frueher Termin nach etwa {leadTimeDays} Tagen'
49-61: Alert warning 'Dieser Termin findet mit Fahrzeug statt' bei requiresVehicleOnSite
63-71: Alert warning 'Bitte Termin erneut waehlen' bei staleSelection && !loading
73-80: Alert warning 'Ihr zuletzt gewaehltes Zeitfenster ist nicht mehr frei' bei staleSelection (ohne loading-Pruefung)
82-87: Ladeanzeige p role=status bei loading
89-93: Alert warning mit error bei !loading && error
95-102: Alert warning 'Im buchbaren Zeitraum ist gerade nichts frei' bei !loading && !error && days.length === 0
104-131: days.map: Filter auf available (Z. 107), Tage ohne freie Slots werden uebersprungen (Z. 108), section aria-label=formatDate (Z. 111), h3 mit CalendarClock (Z. 112-115), grid mit je einer OptionCard pro freiem Slot (Z. 116-128)
- **logik:** Keine Hooks, kein State; props-getrieben. onSelect(date, time) wird in Z. 123 als Callback aufgerufen.
Filter slot.available (Z. 107); return null fuer Tage ohne freie Slots (Z. 108).
Schluessel key=`${slot.date}-${slot.time}` (Z. 119); value=`${slot.date}T${slot.time}` (Z. 121); title=`${slot.time} Uhr` und description=`Dauer ${formatDuration(slot.durationMinutes)}` (Z. 124-125).
Sichtbarkeit: Fehler-Zweig (Z. 89), Leer-Zweig (Z. 95) und Tagesliste (Z. 104) sind ueber !loading bzw. !error gesteuert. Hinweise Z. 63 und 73 haengen an staleSelection.
Formatierung ueber formatDate und formatDuration aus @/lib/format (Z. 5).

### `src/components/autoschluessel/bestaetigung.tsx` · 131 Zeilen · Client
- **exporte:**
  - BestaetigungProps (interface, Z. 12-20): reference: string, appointment: AppointmentInfo, quote: PriceQuote, summary: SummarySection[], notices: string[], redirectUrl?: string
  - Bestaetigung({...}: BestaetigungProps) (Z. 23-30)
- **verwendet_von:**
  - src/app/(site)/autoschluessel/anfrage/assistent.tsx:39 (Import), :817 (<Bestaetigung>-Aufruf; Props dort nicht geprueft)
- **lucide:**
  - CalendarCheck → Z. 4, 57 → Karte Ihr Termin → size 18, mt-0.5 shrink-0 text-foreground-subtle, aria-hidden
  - CheckCircle2 → Z. 4, 35 → Statuszeile Vorgang angelegt → size 16, aria-hidden, Farbe erbt text-success aus p (Z. 34)
  - CreditCard → Z. 4, 75 → Karte Anzahlung → size 18, mt-0.5 shrink-0 text-foreground-subtle, aria-hidden
- **freie_werte:**
  - rounded-lg border border-border bg-surface p-6 (Z. 33)
  - text-[11px] font-bold uppercase tracking-wider text-success (Z. 34)
  - text-xl font-bold text-foreground md:text-2xl (Z. 38)
  - rounded-lg border border-border bg-surface-muted p-5 (Z. 42)
  - font-mono text-2xl font-bold tracking-tight text-foreground (Z. 44)
  - text-[13px] font-semibold text-foreground-muted (Z. 43)
  - text-[13px] leading-relaxed text-foreground-muted (Z. 47, 63, 81, 122, 123-128)
  - text-[14px] font-bold text-foreground (Z. 59, 77)
  - text-[15px] font-semibold text-foreground (Z. 60, 78)
  - text-[15px] font-bold text-foreground (Z. 109)
  - border-t border-border pt-6 sm:flex-row (Z. 113)
  - font-semibold text-primary hover:underline (Z. 124, Link)
- **hover_fokus:**
  - Im Datei nur hover:underline am Link (Z. 124); kein Fokus-Zustand definiert.
  - ButtonLink-Varianten (outline, ghost, size lg) stammen aus src/components/ui/button und wurden nicht gelesen.
- **zugaenglichkeit:**
  - h2 (Z. 38) ohne h1 in dieser Datei; h3 (Z. 109) folgt. Ebenenfolge innerhalb der Datei konsistent.
  - Vorgangsnummer (Z. 45) ist ein p ohne semantische Auszeichnung.
  - Icons aria-hidden (Z. 35, 57, 75).
  - Links mit sichtbarem Text (Z. 92-96, 114-119, 124-126).
  - Zielgroessen der ButtonLinks sind aus dieser Datei nicht ersichtlich.
- **bewegung:**
  - Keine Animationen oder Uebergaenge.
- **platzhalter:**
  - Keine Platzhalter. Festtexte im Code. Zusatztext Z. 84 nur bei mode 'pruefung'; sonst leerer String (Z. 85).
- **tests:**
  - Keine Testdatei rendert oder importiert Bestaetigung. Die Namenssuche (Bestaetigung) ueber das Repo ergab keine Testdatei.
- **aufbau:** 1: 'use client'
3-10: Imports (Link aus next/link; lucide CalendarCheck, CheckCircle2, CreditCard; Typen; formatCents, formatDate, formatDuration; Alert; ButtonLink; Card, CardBody; SummaryList)
12-20: Props-Interface, redirectUrl mit JSDoc (Z. 18)
23-30: Funktion, Destrukturierung
32: Wurzel div.space-y-6
33-52: Kopfbereich 'Vorgang angelegt' (Z. 34-37), h2 'Ihre Anfrage ist bei uns eingegangen' (Z. 38-40), Block Vorgangsnummer mit reference (Z. 42-51)
54-90: Grid sm:grid-cols-2 mit zwei Karten: 'Ihr Termin' (Z. 55-71; Datum, Uhrzeit, Dauer, Ortstext Z. 65-67) und 'Anzahlung' (Z. 73-89; depositCents, Zusatztext Z. 83-85 nur bei mode 'pruefung')
92-96: ButtonLink 'Anzahlung jetzt bezahlen' (size lg), nur bei redirectUrl
98-106: Alert info 'Was Sie noch wissen sollten', nur bei notices.length > 0, ul mit li je Hinweis
108-111: h3 'Das haben Sie uns uebermittelt' und SummaryList sections={summary} (className mt-3)
113-120: Zwei ButtonLinks: /service-und-termin/terminstatus (variant outline) und /autoschluessel (variant ghost)
122-128: Hinweistext mit Link zu /service-und-termin/kontakt
- **logik:** Keine Hooks, kein State, keine Datenzugriffe; reine Darstellung aus Props.
Verzweigungen: appointment.location === 'vor-ort' (Z. 65-67; sonst Text 'Die Arbeiten erfolgen im Fachbetrieb.'); quote.mode === 'pruefung' (Z. 83-85); redirectUrl (Z. 92); notices.length > 0 (Z. 98).
Werte: formatDate(appointment.date), appointment.time, formatDuration(appointment.durationMinutes) (Z. 61, 64); formatCents(quote.depositCents) (Z. 79).
Fest verdrahtete Routen: Z. 114, 117, 124. SummaryList erhaelt sections=summary (Z. 110).

**Auffälliges:**
- termin-auswahl.tsx Z. 63-71 und Z. 73-80: Bei staleSelection erscheinen zwei Warnungen mit aehnlichem Inhalt gleichzeitig (ausser waehrend loading; dort nur die zweite Warnung). Ist das so beabsichtigt?
- termin-auswahl.tsx Z. 73-80: Die zweite Warnung hat keine !loading-Bedingung, die erste (Z. 63) schon. Ist das beabsichtigt?
- termin-auswahl.tsx Z. 95 und Z. 107-108: Der Leer-Hinweis erscheint nur bei days.length === 0. Sind Tage vorhanden, aber alle ohne freie Slots, wird kein Hinweis angezeigt. Ist das beabsichtigt?
- preis-anzeige.tsx Z. 42: Der Fest-Fall wird nur bei priceCents !== undefined gerendert; bei mode 'fest' ohne priceCents erscheint keine Preiskarte. Ist das beabsichtigt? Die Typdefinition PriceQuote (src/lib/types) wurde nicht gelesen.
- preis-anzeige.tsx Z. 45, 68, 119, 131: Kartentitel sind p-Elemente statt Ueberschriften. Ist das bewusst?
- bestaetigung.tsx Z. 102: key={notice} - identische Hinweistexte wuerden doppelte Keys erzeugen. Kann das vorkommen?
- bestaetigung.tsx Z. 92-96: redirectUrl (Zahlungsseite des Anbieters) wird als ButtonLink gerendert. Wie ButtonLink externe URLs behandelt, steht in src/components/ui/button und wurde nicht gelesen.
- Die Treffer in src/app/(site)/kasse/kasse-formular.tsx (Z. 123-617) sind lokale Namen wie bestaetigungsFehler, kein Import der Komponente Bestaetigung.
- Die Dokumente in _werkstatt (u. a. PLAN.md, berichte/) nennen die Komponenten; das ist keine Nutzung im Code und wurde nicht bewertet.
- Keine Testdatei im Repo referenziert diese drei Komponenten oder den Assistenten (src/app/(site)/autoschluessel/anfrage/assistent.tsx), in den sie eingebunden sind. Ist eine Abdeckung an anderer Stelle vorgesehen?

## E3-B-06: Rechner (Serviceeinsatz, Türabsicherung) und Nachweisliste
### `src/components/calculator/rechner-bausteine.tsx` · 136 Zeilen · Server
- **exporte:**
  - RechnerRahmen({ titel: string; einleitung: string; children: ReactNode }) (L11)
  - Auswahlgruppe({ legende: string; hinweis?: string; children: ReactNode }) (L36)
  - Fokusrahmen({ children: ReactNode }) (L58)
  - KEIN_RICHTWERT_TEXT: string (L66)
  - interface RichtwertErgebnisProps { ergebnis; zusammenfassung: AuswahlZeile[]; hinweis: string | null; aufforderung: string; zusatz?: string; anfrageHref: string } (L68)
  - RichtwertErgebnis(RichtwertErgebnisProps) (L83)
- **verwendet_von:**
  - src/components/calculator/service-einsatz-rechner.tsx:10 (Import Auswahlgruppe, Fokusrahmen, RechnerRahmen, RichtwertErgebnis)
  - src/components/calculator/tuer-absicherung-rechner.tsx:8 (Import Auswahlgruppe, Fokusrahmen, RechnerRahmen, RichtwertErgebnis)
  - src/components/calculator/rechner.test.tsx:6 (Import KEIN_RICHTWERT_TEXT, RichtwertErgebnis)
- **lucide:**
  - Calculator (size 20, aria-hidden) in L24 neben Rahmentitel, Icon-Kachel bg-primary-soft
  - ArrowRight (size 18, aria-hidden) in L132 als Zusatz im Knopf 'Anfrage stellen'
- **freie_werte:**
  - L28 text-[14px]
  - L48 text-[13px]
  - L60 has-[:focus-visible]:ring-2 / has-[:focus-visible]:ring-ring / has-[:focus-visible]:ring-offset-2 / has-[:focus-visible]:ring-offset-background (arbitrary variant :has())
  - L95 text-[15px]
  - L106 text-[13px]
  - L111 text-[15px]
  - L116 sm:grid-cols-[8rem_minmax(0,1fr)]
  - L117 text-[13px]
  - L118 text-[14px]
  - L124 text-[13px]
  - Weitere Klassen sind Tokens/Standard: text-lg, text-sm, text-xs, text-3xl, tracking-wider, tabular-nums, z/shadow/duration: keine
- **hover_fokus:**
  - L60 Fokuszustand: Ring am Wrapper, sichtbar nur bei :focus-visible eines Kindelements (Eingabefeld der Auswahlkarte ist versteckt, s. Kommentar L54-57)
  - Hover-Zustände: keine in dieser Datei; ButtonLink (L130) liegt in components/ui/button (nicht gelesen)
- **zugaenglichkeit:**
  - L27 Titel ist fest h3; Überschriftenebene des Rahmens hängt vom Aufrufer ab (Seiten nicht gelesen)
  - L47 legend für fieldset vorhanden
  - L93 aria-live="polite" um den Ergebnisbereich
  - L24, L132 Icons aria-hidden
  - Ziele unter 24/44 px: in dieser Datei nicht prüfbar (ButtonLink nicht gelesen)
- **platzhalter:**
  - Keine Platzhaltertexte oder „[Platzhalter…]“ im Code
  - Kein erfundener Betrag: Ergebnis zeigt nur Spanne, sonst KEIN_RICHTWERT_TEXT oder Aufforderung
- **tests:**
  - src/components/calculator/rechner.test.tsx:31 aria-live="polite" (pruefeVertrag, L30-34)
  - rechner.test.tsx:32-33 keine festen Farben (hex/rgb/oklch), kein NaN/Infinity/undefined/null
  - rechner.test.tsx:38-45 Spanne: 'ca. 120 – 181 €', 'inklusive Umsatzsteuer, einschließlich Anfahrt', Hinweis, dd-Klasse L43, Anfrage-Link
  - rechner.test.tsx:49-56 kein-richtwert: KEIN_RICHTWERT_TEXT, Auswahl sichtbar, kein €
  - rechner.test.tsx:60-65 unvollstaendig: Aufforderung, kein dl, kein €, 'Anfrage stellen'
  - rechner.test.tsx:75-76 Auswahlgruppe: 2 fieldsets, legend-Markup
  - rechner.test.tsx:107 keine fieldset bei leerer Auswahl
  - Nicht geprüft: RechnerRahmen (Titel/Einleitung), Fokusrahmen-Klasse, Hinweistext 'Mehrfachauswahl möglich.'
- **aufbau:** L11-19 RechnerRahmen (Props inline)
L21-31 Rahmen: div mit Kopf (L22) und Icon-Kachel (L23-25), Titel h3 (L27), Einleitung p (L28), children-Container (L31)
L36-52 Auswahlgruppe: fieldset (L46), legend (L47), optionaler Hinweis p (L48), Grid sm:grid-cols-2 (L49)
L58-64 Fokusrahmen: Wrapper-div mit focus-visible-Ring (L60)
L66 Konstante KEIN_RICHTWERT_TEXT
L68-77 Props-Interface RichtwertErgebnisProps
L83-136 RichtwertErgebnis: aria-live-Box (L93); art 'unvollstaendig' -> Aufforderung p (L94-95); sonst: art 'spanne' -> Kennzeile (L100), Betrag h-p text-3xl (L103-105), Zusatzzeile mit filter(Boolean) (L106-108); sonst -> KEIN_RICHTWERT_TEXT (L111); dl Zusammenfassung (L114-121); bei 'spanne' Hinweis (L123-125); ButtonLink 'Anfrage stellen' fullWidth mit ArrowRight (L130-133)
- **logik:** Keine State- oder Hook-Logik. RichtwertErgebnis verzweigt nach ergebnis.art: 'unvollstaendig' (L94), 'spanne' (L98), sonst kein Richtwert. Formatierung über spanneText und orientierungsHinweis aus '@/lib/richtwerte/rechnen' (L4). Nicht anfassen: Verzweigung L94/L98, aria-live L93, Export KEIN_RICHTWERT_TEXT (Test-Abhängigkeit).

### `src/components/calculator/service-einsatz-rechner.tsx` · 93 Zeilen · Client
- **exporte:**
  - interface ServiceEinsatzRechnerProps { werte: ServiceEinsatzWerte; anfrageHref: string } (L12-16)
  - ServiceEinsatzRechner({ werte, anfrageHref }) (L19)
- **verwendet_von:**
  - src/app/(site)/service-und-termin/page.tsx:11 (Import)
  - src/app/(site)/service-und-termin/page.tsx:229 (JSX)
  - src/components/calculator/rechner.test.tsx:7 (Import)
  - src/components/calculator/rechner.test.tsx:85 (JSX in Test)
- **hover_fokus:**
  - Fokusrahmen-Wrapper um jede OptionCard (L44, L55) – Fokusdarstellung in rechner-bausteine.tsx:60
  - OptionCard (L45) und QuantityInput (L64) liefern Hover/Fokus, nicht in dieser Datei
- **zugaenglichkeit:**
  - L42 Auswahlgruppe mit legend und Mehrfachauswahl-Hinweis
  - L59-60 Feldtitel '2. Anzahl Türen' über Field, L66 label 'Anzahl Türen' am QuantityInput (Doppelung zu prüfen, Field nicht gelesen)
  - L30-33 Toggle über OptionCard; Zielgrößen nicht prüfbar
  - Zeile 62 Kommentar: eigener Block, damit das Zählfeld nicht auf volle Breite gezogen wird
- **platzhalter:**
  - Keine Platzhaltertexte im Code
  - Test nutzt PLATZHALTER_RICHTWERTE.serviceEinsatz (rechner.test.tsx:86)
- **tests:**
  - src/components/calculator/rechner.test.tsx:83-97 (describe 'Rechner auf Platzhalter-Richtwerten', Serviceeinsatz)
  - rechner.test.tsx:91 4 checkboxes
  - rechner.test.tsx:92 'je Tür'
  - rechner.test.tsx:93 'pauschal'
  - rechner.test.tsx:94 aria-label="Anzahl Türen"
  - rechner.test.tsx:95 'Wählen Sie mindestens eine Leistung.'
  - rechner.test.tsx:96 kein €
  - Nicht geprüft: Umschalten, Berechnung mit gewählter Leistung, Verhalten bei mitTueren=false
- **aufbau:** L1 'use client'
L5-10 Imports (rechnen, Typen, QuantityInput, Field, OptionCard, Bausteine)
L12-16 Props-Interface
L19-93 Komponente
L20-22 useId, useState leistungen (string[]), anzahlTueren (number, Start 1)
L24-27 auswahl-Objekt, auswaehlbar (L25), mitTueren (L27)
L29-33 umschalten(kennung) (Toggle)
L36-91 RechnerRahmen mit Titel und Einleitung
L40-77 bedingt auswaehlbar: Auswahlgruppe 'Welche Leistungen brauchen Sie?' mit OptionCards (L43-56, meta je Tür/pauschal); bedingt mitTueren: Field '2. Anzahl Türen' mit QuantityInput min 1 max MAX_TUEREN (L59-75)
L79-90 RichtwertErgebnis mit serviceEinsatzBerechnen/Zusammenfassung, zusatz 'einschließlich Anfahrt' (L88), aufforderung je nach auswaehlbar (L83-87)
- **logik:** State: leistungen (L21), anzahlTueren (L22). umschalten (L29-33) toggelt Kennung im Array über Funktionsform. mitTueren (L27) wird aus werte.leistungen (einheit === 'je-tuer') abgeleitet, nicht aus der Auswahl. auswahl-Objekt (L24) wird an serviceEinsatzBerechnen und serviceEinsatzZusammenfassung (L80-81) übergeben. Nicht anfassen: Form der auswahl-Objekte (Vertrag mit rechnen.ts, nicht gelesen).

### `src/components/calculator/tuer-absicherung-rechner.tsx` · 88 Zeilen · Client
- **exporte:**
  - interface TuerAbsicherungRechnerProps { werte: TuerAbsicherungWerte; anfrageHref: string } (L10-14)
  - TuerAbsicherungRechner({ werte, anfrageHref }) (L25)
- **verwendet_von:**
  - src/app/(site)/tuer-und-schliesstechnik/page.tsx:27 (Import)
  - src/app/(site)/tuer-und-schliesstechnik/page.tsx:210 (JSX)
  - src/components/calculator/rechner.test.tsx:8 (Import)
  - src/components/calculator/rechner.test.tsx:72 (JSX in Test)
  - src/components/calculator/rechner.test.tsx:101 (JSX in Test, leere tuerarten)
- **hover_fokus:**
  - Fokusrahmen-Wrapper um OptionCards (L48, L63) – Darstellung in rechner-bausteine.tsx:60
  - OptionCard liefert Hover/Fokus, nicht in dieser Datei
- **zugaenglichkeit:**
  - L46 legend '1. Um welche Tür geht es?' (Einfachauswahl über name=tuerart)
  - L61 legend '2. Welche Maßnahmen kommen infrage?' mit Hinweis (Mehrfachauswahl)
  - Zielgrößen nicht prüfbar (OptionCard nicht gelesen)
- **platzhalter:**
  - Keine Platzhaltertexte im Code
  - Test nutzt PLATZHALTER_RICHTWERTE.tuerAbsicherung (rechner.test.tsx:72)
- **tests:**
  - src/components/calculator/rechner.test.tsx:70-81 (Türabsicherung, Platzhalter)
  - rechner.test.tsx:75 2 fieldsets
  - rechner.test.tsx:76 legend-Markup '1. Um welche Tür geht es?'
  - rechner.test.tsx:77 4 radios
  - rechner.test.tsx:78 5 checkboxes
  - rechner.test.tsx:79 Standardtext 'Wählen Sie eine Tür und mindestens eine Maßnahme.'
  - rechner.test.tsx:80 kein €
  - rechner.test.tsx:99-110 leere tuerarten: keine fieldset, Text 'Den Rahmen für Ihre Tür nennen wir Ihnen nach einer kurzen Anfrage.' (L108), 'Anfrage stellen' (L109)
  - Nicht geprüft: Zweige 'Wählen Sie mindestens eine Maßnahme.' (L19) und 'Wählen Sie noch die Tür.' (L20), Fall massnahmen leer, Umschalten
- **aufbau:** L1 'use client'
L4-8 Imports
L10-14 Props-Interface
L16-22 Hilfsfunktion aufforderung(auswaehlbar, mitTuer, mitMassnahme): string (vier Zweige)
L25-88 Komponente
L26-28 useId, useState tuerart (string | null), massnahmen (string[])
L30-31 auswahl-Objekt, auswaehlbar (beide Listen nicht leer)
L33-37 umschalten(kennung) für Maßnahmen
L40-86 RechnerRahmen mit Titel 'Orientierung für Ihre Türabsicherung'
L44-77 bedingt auswaehlbar: Auswahlgruppe '1. Um welche Tür geht es?' mit OptionCards (Einfachauswahl, L46-59); Auswahlgruppe '2. Welche Maßnahmen kommen infrage?' mit Hinweis 'Mehrfachauswahl möglich.' (L61-75)
L79-85 RichtwertErgebnis mit tuerAbsicherungBerechnen/Zusammenfassung, aufforderung(auswaehlbar, tuerart !== null, massnahmen.length > 0) (L83)
- **logik:** State: tuerart (L27), massnahmen (L28). umschalten (L33-37) toggelt Maßnahmen-Kennung. Einfachauswahl Tür setzt setTuerart direkt (L53). aufforderung (L17-22) bestimmt den Hinweistext über drei Booleans. auswaehlbar (L31) verlangt beide Listen nicht leer. Berechnung L80-81 über tuerAbsicherungBerechnen/Zusammenfassung aus '@/lib/richtwerte/rechnen'. Nicht anfassen: Parameterreihenfolge der Hilfsfunktion aufforderung.

### `src/components/calculator/rechner.test.tsx` · 111 Zeilen · Server
- **platzhalter:**
  - Test-Titel 'Platzhalter-Richtwerte' (L69): Daten aus src/lib/richtwerte/uebersetzung.ts (nicht gelesen)
- **tests:**
  - Testdatei selbst; von keiner anderen Datei importiert (grep) ausser keiner
  - Prüft rechner-bausteine.tsx (RichtwertErgebnis, KEIN_RICHTWERT_TEXT), service-einsatz-rechner.tsx und tuer-absicherung-rechner.tsx
- **aufbau:** L1-8 Imports (renderToStaticMarkup, vitest, Typ RichtwertErgebnis als Ergebnis, PLATZHALTER_RICHTWERTE, Bausteine, Rechner)
L10 ANFRAGE-Konstante
L11-14 zeilen (Türart, Maßnahme)
L16-27 Helfer ergebnis(e, hinweis)
L30-34 Helfer pruefeVertrag(html)
L36-67 describe 'Ergebnisbereich' (Spanne L37-46, kein-richtwert L48-57, unvollstaendig L59-66)
L69-111 describe 'Rechner auf Platzhalter-Richtwerten' (Türabsicherung L70-81, Serviceeinsatz L83-97, leere tuerarten L99-110)
- **logik:** Statisches Rendern mit renderToStaticMarkup, keine Interaktion. Die Helfer prüfen Markup per toContain/toMatch/toHaveLength.

### `src/components/vertrauen/nachweise-liste.tsx` · 67 Zeilen · Server
- **exporte:**
  - interface NachweiseListeProps { nachweise: Nachweis[]; titel?: string; ebene?: 'h2' | 'h3'; className?: string } (L7-15)
  - NachweiseListe({ nachweise, titel = 'Nachweise', ebene: Ueberschrift = 'h2', className }) (L23)
- **verwendet_von:**
  - src/app/(site)/tuer-und-schliesstechnik/page.tsx:28 (Import)
  - src/app/(site)/tuer-und-schliesstechnik/page.tsx:285 (JSX mit titel 'Unsere Nachweise', ebene 'h3', className 'mt-8 max-w-3xl')
  - src/components/vertrauen/nachweise-liste.test.tsx:5 (Import)
- **lucide:**
  - BadgeCheck (size 18, aria-hidden, text-primary, mt-0.5 shrink-0) in L38 als Häkchen je Nachweis
- **freie_werte:**
  - L33 text-lg (Standard)
  - L40 text-[15px]
  - L41 text-[13px]
  - L42 / L46 / L52 gap-1 (Standard)
  - Arbitrary: text-[15px] (L40), text-[13px] (L41); sonst Standardklassen
- **hover_fokus:**
  - Keine interaktiven Elemente, daher keine Hover- oder Fokuszustände
- **zugaenglichkeit:**
  - L33 Überschriftenebene per Prop, Default h2; Seite übergibt h3 (page.tsx:285)
  - L38 Icon aria-hidden
  - L41-60 Angaben als dl mit dt/dd, Labels mit Doppelpunkt (Art:, Ausgestellt von:, Gültig bis:)
  - L56 time mit dateTime für Gültig bis
  - Titel L40 ist ein p, keine Überschrift
- **platzhalter:**
  - Keine Platzhaltertexte im Code
  - Keine Ergänzung fehlender Angaben (L46, L52 bedingt gerendert)
- **tests:**
  - src/components/vertrauen/nachweise-liste.test.tsx:21 leere Liste liefert '' (keine Überschrift)
  - nachweise-liste.test.tsx:26 h2 als Standardebene
  - nachweise-liste.test.tsx:27-29 Titel, Art, Aussteller
  - nachweise-liste.test.tsx:30 time dateTime="2027-03-31" mit 31.03.2027
  - nachweise-liste.test.tsx:31 2 li-Elemente
  - nachweise-liste.test.tsx:36-37 fehlende Aussteller und Gültig-bis werden nicht ergänzt
  - nachweise-liste.test.tsx:44-45 Ebene h3 und Titel 'Qualifikation'
  - Nicht geprüft: Standardtitel 'Nachweise' (Test L24-32 übergibt keinen titel), className-Prop
- **aufbau:** L23-29 Komponente; L29 gibt bei leerer Liste null zurück (ohne Überschrift)
L32 section (className via cn)
L33 Überschrift (dynamische Ebene, Default h2) mit text-lg font-bold
L35 ul divide-y mit Rahmen
L36-63 map über nachweise, key nachweis.id
L37 li mit flex-Zeile
L38 BadgeCheck (size 18, aria-hidden)
L40 Titel p
L41-60 dl mit Zeilen Art (L42-45), Ausgestellt von (L46-51, bedingt), Gültig bis (L52-59, bedingt) mit time dateTime und formatDateShort (L56)
- **logik:** Early Return bei leerer Liste (L29). Datumsformatierung über formatDateShort aus '@/lib/format' (L4, L56, nicht gelesen). cn aus '@/lib/cn' (L5, L32). Filterung nach öffentlich/gültig findet hier nicht statt (Kommentar L8 verweist auf getNachweise). Nicht anfassen: Early Return L29 (Test erwartet leeren String).

### `src/components/vertrauen/nachweise-liste.test.tsx` · 47 Zeilen · Server
- **tests:**
  - Testdatei selbst; von keiner anderen Datei importiert (grep)
  - Prüft nachweise-liste.tsx vollständig (Leer-Fall, Inhalt, fehlende Angaben, Ebene/Titel)
- **aufbau:** L1-5 Imports (renderToStaticMarkup, vitest, Typ Nachweis, NachweiseListe)
L7-17 Fixture NACHWEISE (id 1 vollständig L8-15, id 2 ohne aussteller/gueltigBis L16)
L19-47 describe 'Nachweis-Liste': L20-22 leer, L24-32 Inhalt, L34-38 fehlende Angaben, L40-46 Ebene und Titel
- **logik:** Statisches Rendern mit renderToStaticMarkup, keine Interaktion.

**Auffälliges:**
- rechner.test.tsx:45: ANFRAGE.replace('&', '&amp;') hat keine Wirkung, weil die Konstante in Zeile 10 kein '&' enthält. Ist das als Vorbereitung gedacht?
- service-einsatz-rechner.tsx:27: mitTueren wird aus den Leistungen der Richtwerte abgeleitet, nicht aus der Auswahl. Das Feld 'Anzahl Türen' erscheint daher, sobald irgendeine je-Tür-Leistung existiert, auch wenn nur pauschale Leistungen gewählt sind. Ist das so gewollt?
- service-einsatz-rechner.tsx:22 und :80: anzahlTueren bleibt im Zustand und wird auch dann übergeben, wenn das Feld ausgeblendet ist. Ob rechnen.ts diesen Wert bei rein pauschalen Auswahlen ignoriert, ist aus den gelesenen Dateien nicht erkennbar (rechnen.ts nicht gelesen).
- service-einsatz-rechner.tsx:60 und :66: Das Türen-Feld hat den Feldtitel '2. Anzahl Türen' (Field) und zusätzlich label 'Anzahl Türen' am QuantityInput (Test rechner.test.tsx:94 prüft das aria-label). Gibt es dadurch eine doppelte Ansage? Field und QuantityInput wurden nicht gelesen.
- service-einsatz-rechner.tsx:88 setzt zusatz fest auf 'einschließlich Anfahrt'. tuer-absicherung-rechner.tsx setzt keinen Zusatz; die Anfahrt-Angabe steht also nur im Serviceeinsatz-Rechner.
- rechner-bausteine.tsx:27: Der Rahmentitel ist fest h3. Passt diese Ebene zur Überschriftenstruktur der Seiten tuer-und-schliesstechnik/page.tsx (Zeile 210) und service-und-termin/page.tsx (Zeile 229)? Die Seiten wurden nicht gelesen.
- rechner-bausteine.tsx:60: Der Fokusrahmen nutzt has-[:focus-visible]-Varianten (CSS :has()). Unterstützen die Zielbrowser :has()? In den gelesenen Dateien gibt es keinen Fallback.
- Zielgrößen (24/44 px) von OptionCard, QuantityInput und ButtonLink (rechner-bausteine.tsx:130) sind aus diesen Dateien nicht prüfbar, weil diese Komponenten nicht gelesen wurden.
- tuer-absicherung-rechner.tsx:17-22: Die Hilfsfunktion aufforderung hat vier Zweige. Getestet ist nur der Standardzweig (rechner.test.tsx:79). Nicht getestet sind die Zweige in Zeile 19 und 20 sowie der Fall, dass Maßnahmen leer sind, obwohl Türarten vorhanden sind.
- rechner.test.tsx:75, 77, 78 und 91: Die festen Zählungen (2 fieldsets, 4 radios, 5 checkboxes, 4 checkboxes) hängen an PLATZHALTER_RICHTWERTE aus src/lib/richtwerte/uebersetzung.ts (nicht gelesen). Ist das bewusst? Ändern sich die Platzhalterdaten, brechen diese Tests.
- rechner.test.tsx: Keine Tests für Umschalten der Auswahl, für die Berechnung mit gewählter Leistung oder Maßnahme und für Serviceeinsatz ohne je-Tür-Leistung. Gefunden wurden keine weiteren Testdateien, die diese Komponenten rendern.
- rechner.test.tsx:49: Der Grund 'umfang' wird getestet. Ob er im Typ RichtwertErgebnis (typen.ts:66, nicht gelesen) existiert, ist aus den gelesenen Dateien nicht ersichtlich.
- nachweise-liste.tsx:8: Der Kommentar nennt 'nur öffentliche, gültige Nachweise'. Die Komponente filtert nicht selbst. Wo sitzt die Prüfung auf Gültigkeit? Vermutlich in getNachweise (lib/data/nachweise, nicht gelesen). Bitte bestätigen.
- nachweise-liste.test.tsx:24-32: Der Test ohne titel-Prop prüft nicht, ob der Standardtitel 'Nachweise' (nachweise-liste.tsx:25) erscheint. Die className (nachweise-liste.tsx:32) wird von der Seite gesetzt (tuer-und-schliesstechnik/page.tsx:285) und ist ungetestet.
- nachweise-liste.tsx:56: Das Datumsformat 31.03.2027 hängt an formatDateShort aus '@/lib/format' (nicht gelesen); der Test prüft es nur über die Ausgabe in nachweise-liste.test.tsx:30.
- Keine Platzhaltertexte und keine Bewegungsklassen (transition, animate) in den sechs Dateien gefunden.

## E3-B-07
### `src/app/(site)/autoschluessel/page.tsx` · 514 Zeilen · Server
- **exporte:**
  - default AutoschluesselHubPage(): async, keine Props (Z. 212)
  - generateMetadata(): async, Promise<Metadata>, keine Props (Z. 22; liefert title/description aus CMS mit Fallback, alternates.canonical '/autoschluessel')
- **verwendet_von:**
  - keine: Grep nach 'autoschluessel/page', '(site)/autoschluessel' und 'AutoschluesselHubPage' in src/ findet nur die Datei selbst (Next.js-Routendatei, wird nicht importiert)
- **lucide:**
  - KeyRound: Z. 85 als Gruppen-Icon 'Schluessel anfertigen', gerendert Z. 352 mit size 19, aria-hidden, in Kachel bg-primary-soft
  - Wrench: Z. 118 als Gruppen-Icon 'Elektronik und Programmierung', gerendert Z. 352 mit size 19, aria-hidden
  - Car: Z. 148 als Gruppen-Icon 'Reparatur und Sonderfaelle', gerendert Z. 352 mit size 19, aria-hidden
  - ArrowRight size 17: Z. 267 (PageHeader-Button), Z. 405 (Ablauf-Button), Z. 449 (Fahrzeuge-Button), alle aria-hidden
  - ArrowRight size 15: Z. 379 (Link 'Zur Seite' in Topic-Karten), aria-hidden
  - ArrowRight size 14: Z. 463 (Marken-Links), aria-hidden, shrink-0 text-foreground-subtle
- **freie_werte:**
  - text-[11px] (mit font-bold uppercase tracking-wider): Z. 273, 281, 287, 295 (dt der Kennzahlen)
  - text-[17px]: Z. 355 (Gruppentitel h3)
  - text-[15px]: Z. 368 (Karten-Titel h4), Z. 429 (Schritt-Titel h3), Z. 501 (Link-Label)
  - text-[14px]: Z. 356, 371, 376, 430 (Lead, Kartentext, Kartenlink, Schritttext)
  - text-[13px]: Z. 504 (Link-Beschreibung)
  - min-h-[44px]: Z. 376, 460, 499 (Touchziele)
  - -left-[38px]: Z. 425 (Schrittnummer, absolute Position relativ zu li)
  - Rasterspalten: lg:grid-cols-[1.15fr_1fr] Z. 305; lg:grid-cols-[1fr_1.2fr] Z. 395; lg:grid-cols-[1.1fr_1fr] Z. 439
  - prose-sm24: Z. 308 (projekteigene Klasse, nicht in dieser Datei definiert)
  - text-lg (Standardklasse): Z. 276, 290, 298 (font-display-Kennzahlen)
  - text-xs (Standardklasse): Z. 425 (Schrittnummer)
  - Projekt-Tokens, nicht in dieser Datei definiert: font-display, text-foreground, text-foreground-subtle, text-foreground-muted, text-primary, bg-primary-soft, bg-surface, border-border, hover:border-primary (u. a. Z. 273, 351, 460, 499)
- **hover_fokus:**
  - Z. 376 Link 'Zur Seite': hover:underline; kein Fokusstil in dieser Datei
  - Z. 460 Marken-Link: hover:border-primary, hover:text-primary, transition-colors; kein Fokusstil in dieser Datei
  - Z. 499 Weiterfuehrend-Link: group-hover:text-primary, hover:border-primary, transition-colors; kein Fokusstil in dieser Datei
  - Fehlende Fokuszustaende: Die drei Links (Z. 374, 458, 497) setzen keinen eigenen Fokusstil. Ob ein globaler Standard greift, ist hier nicht geprueft.
  - Z. 369 und Z. 451: InfoTip, Hover/Fokus liegt in der Komponente (nicht in dieser Datei)
- **zugaenglichkeit:**
  - Touchziele: Z. 376, 460, 499 mit min-h-[44px] eingehalten; InfoTip-Groesse (Z. 369, 451) liegt in der Komponente und ist hier nicht pruefbar
  - Z. 374-381: Sichtbarer Text 'Zur Seite' wiederholt sich in 12 Karten; sr-only-Zusatz mit topic.term (Z. 380) macht den Linknamen unterscheidbar
  - Icons aria-hidden: Z. 267, 352, 379, 405, 449, 463; Schrittnummer Z. 423-428 aria-hidden
  - Ueberschriftenfolge im Code: h3 (Z. 355 Gruppen, Z. 429 Schritte), h4 (Z. 368 Karten). Die Ebenen h1/h2 kommen aus PageHeader und SectionHeading und sind hier nicht sichtbar.
  - Schrittliste Z. 420-433 als ol, Nummern nur visuell (aria-hidden), Reihenfolge bleibt ueber die Liste erhalten
  - Mobil: Kennzahlen-Raster grid-cols-2 (Z. 271) und Marken-Raster grid-cols-2 (Z. 455); Umbruch langer Werte nicht pruefbar ohne Rendering
- **bewegung:**
  - Z. 460 und Z. 499: transition-colors fuer Farbwechsel bei Hover
  - Keine Keyframes, keine Animationsklassen, keine Motion-Bibliothek in dieser Datei
- **platzhalter:**
  - Z. 327-333: ImagePlaceholder mit motif 'Werkstattfoto: Arbeitsplatz mit Schluesselfraese und Diagnosegeraet', ratio '4/3', note 'Eigene Aufnahme aus dem Betrieb. Kein Stockfoto.'
  - Z. 40-44 (TRANSPONDER_HINT.figure): motif 'Makroaufnahme: geoeffnetes Schluesselgehaeuse mit sichtbarem Transponder', ratio '3/2', note 'Eigene Werkstattaufnahme, Chip deutlich erkennbar.'
  - Z. 53-56 (BART_HINT.figure): motif 'Messzeichnung: Schluesselbart mit Einschnitten und Bezeichnung der Positionen', ratio '3/2', ohne note
  - Alle Figuren sind Motiv-Beschreibungen ohne Bilddatei oder src in dieser Datei
- **tests:**
  - src/components/ui/image-placeholder.test.tsx:6-8 rendert ImagePlaceholder (wird Z. 327 verwendet) per renderToStaticMarkup, testet nur die Komponente
  - src/lib/format.test.ts:15-38 testet formatCents (verwendet Z. 219)
  - src/lib/navigation.test.ts:7-33 testet istAktiv und aktiverEintrag fuer '/autoschluessel'; PROCESS_LABELS wird dort nicht geprueft
  - Keine Testdatei rendert page.tsx selbst
  - Keine Testdatei rendert PageHeader, Section, SectionHeading, ButtonLink, Card, Alert, Accordion, InfoTip, JsonLd/pageGraphSchema oder key-kinds (KEY_KIND_HINT, ON_SITE_HINT); per Grep in src/ mit --include='*.test.*' geprueft
- **aufbau:** Z. 1-20: Imports, Konstante ROUTE='autoschluessel' (Z. 20)
Z. 22-32: generateMetadata
Z. 34-65: InfoHint-Objekte TRANSPONDER_HINT (34), BART_HINT (47), SMART_KEY_HINT (59)
Z. 67-79: Interfaces Topic, TopicGroup
Z. 81-167: TOPIC_GROUPS, 3 Gruppen mit 5 / 4 / 3 Eintraegen (12 Topics)
Z. 169-210: FAQ-Konstante, 6 Fragen
Z. 212-221: Default-Export, Promise.all aus getPageContent/getSettings/getVehicleMakes; Ableitungen deposit, leadDays, modelCount
Z. 224-245: steps (Inline-Array, 5 Schritte)
Z. 247-257: JsonLd mit pageGraphSchema (FAQ: page.faq oder FAQ)
Z. 259-301: PageHeader (eyebrow, title, lead, Aktions-ButtonLink Z. 264-269, dl mit 4 Kennzahlen Z. 271-300)
Z. 304-335: Section 'Einordnung' (Absaetze Z. 308-324, ImagePlaceholder Z. 327-333)
Z. 338-391: Section id='leistungen' mit 3 Gruppen (Icon-Kachel Z. 350-353, Karten Card/CardBody Z. 365-383, InfoTip Z. 369)
Z. 394-435: Section id='ablauf' (SectionHeading Z. 397-401, 2 ButtonLinks Z. 403-409, Alert Z. 412-417, ol mit 5 Schritten Z. 420-433)
Z. 438-469: Section 'Fahrzeuge' (SectionHeading Z. 441-445, ButtonLink Z. 447, InfoTip Z. 451, ul mit slice(0,9) Marken Z. 455-467)
Z. 472-479: Section mit SectionHeading und Accordion (Z. 478)
Z. 482-511: Section 'Weiterfuehrende Seiten' (6 Links als Inline-Array Z. 489-494)
Z. 512-514: Schluss des Fragments und der Funktion
- **logik:** Daten: Z. 213-217 Promise.all aus getPageContent(ROUTE), getSettings(), getVehicleMakes(); Z. 23 getPageContent in generateMetadata.
Ableitungen: Z. 219 deposit = formatCents(settings.booking.depositCents); Z. 220 leadDays = settings.booking.leadTimeDays; Z. 221 modelCount = Summe der models.length.
Fallbacks mit ??: Z. 25-29 (Metadaten), Z. 252-255 (JSON-LD, page.faq vs. FAQ), Z. 261-262 (Titel, Lead), Z. 310-312 (Einleitung), Z. 478 (Accordion: page.faq vs. FAQ).
Z. 277: PROCESS_LABELS['termin-mit-anzahlung'].label, fester Schluessel aus lib/navigation.
Z. 221, 444: Zaehlungen ueber makes; Z. 456: makes.slice(0, 9).
Z. 346-389: map ueber TOPIC_GROUPS; Icon-Komponente ueber group.icon (Typ typeof KeyRound, Z. 77).
Keys: group.title (Z. 349), topic.term (Z. 364), step.title (Z. 422), make.id (Z. 457), link.href (Z. 496).
Nicht anfassen: Promise.all-Struktur, Fallback-Ketten, Schluessel der TOPIC_GROUPS, JSON-LD-Aufruf Z. 249-256.

**Auffälliges:**
- Frage: Z. 400 sagt 'Mobil bedienbar. Ihre Eingaben bleiben erhalten, wenn Sie zwischendurch abbrechen.' Ist das Speichern von Eingaben im gefuehrten Ablauf (/autoschluessel/anfrage) umgesetzt? In dieser Datei nicht belegt.
- Frage: Z. 43 'Eigene Werkstattaufnahme, Chip deutlich erkennbar.' und Z. 331 'Eigene Aufnahme aus dem Betrieb. Kein Stockfoto.' behaupten vorhandene Fotos. Im Code gibt es nur Motiv-Platzhalter ohne Bilddatei. Existieren diese Aufnahmen?
- Frage: Z. 491-492 verlinken auf /ratgeber/autoschluessel-verloren-was-tun und /ratgeber/unterschied-kopie-und-programmierung. Unter src/app/(site)/ratgeber/ gibt es nur das dynamische Segment [slug]. Ob diese Slugs existieren, ist hier nicht geprueft.
- Frage: Mehrere Karten verlinken auf dieselbe Seite: /autoschluessel/nachmachen in 4 Eintraegen (Z. 89, 94, 99, 157), /autoschluessel/programmieren in 2 (Z. 122, 128), /autoschluessel/funkschluessel in 2 (Z. 134, 152). Ist das so gewollt?
- Frage: Z. 277 greift ueber den festen Schluessel 'termin-mit-anzahlung' auf PROCESS_LABELS zu. Die Existenz dieses Schluessels in lib/navigation ist hier nicht geprueft. Fehlt er, bricht das Rendern der Seite.
- Frage: Z. 425 positioniert die Schrittnummer mit -left-[38px] relativ zum li. Ob sie auf dem Linienrand (border-l, Z. 420) sitzt und auf Phone-Breite ueberlappt, ist ohne Rendering nicht pruefbar.
- Frage: Die Ebenen der Ueberschriften h1 und h2 kommen aus PageHeader und SectionHeading, die nicht in dieser Datei stehen. Ob die Hierarchie zu h3 (Z. 355, 429) und h4 (Z. 368) passt, bleibt offen.
- Hinweis: Keine Testdatei rendert page.tsx selbst. Die Seite hat keine eigene Renderpruefung; die Komponenten darunter sind nur teilweise getestet (siehe tests).
