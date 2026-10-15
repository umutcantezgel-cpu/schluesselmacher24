# E0-KUNDSCHAFTER-07 · lucide-react-Inventar

Basis: `/home/user/schluesselmacher24`. Pfade sind relativ zu `src/`. Nur gelesen; keine Quelldatei geändert.

## 1. Methode und Abgrenzung

- **Importe:** 62 Dateien mit `lucide-react`, 167 benannte Importe, 60 verschiedene Namen. Mehrzeilige Importe sind berücksichtigt.
- **Erfasst:** alle Code-Vorkommen der 60 Namen außerhalb der Importblöcke, also 240 Fundstellen.
- **Nicht gezählt:** 2 Textvorkommen des Wortes „Smartphone“ in Zeichenketten (`app/(site)/elektronische-zutrittsloesungen/page.tsx:39` und `:218`). Namen in Kommentaren oder Texten aus Dateien ohne lucide-Import wurden ebenfalls nicht gezählt (z. B. „E-Mail“, „Hash“ in Tests).
- **Dynamische Darstellung:** Objekt-Einträge (Feld `icon`, Maps wie `AREA_ICONS`, `SERVICE_ICONS`, `BLOCKS`, `STEPS`, `ITEMS`, `tones`) bilden je Eintrag eine Zeile. Größe und Zusammenhang stammen von der Render-Stelle `<Icon …>`. Die Render-Stellen sind nicht doppelt gezählt. Die zehn Render-Stellen: `app/(site)/page.tsx:169`, `app/(site)/autoschluessel/page.tsx:352`, `app/(site)/elektronische-zutrittsloesungen/page.tsx:427`, `app/(site)/schliessanlagen/page.tsx:333`, `app/(site)/schluessel-nach-vorlage/page.tsx:236`, `app/(site)/service-und-termin/page.tsx:115`, `app/(site)/sicherheitstechnik/page.tsx:182`, `app/(site)/tuer-und-schliesstechnik/page.tsx:236`, `components/layout/mobile-action-bar.tsx:48`, `components/ui/alert.tsx:26`.
- **Typ-Zeilen:** `typeof X` ist eine Typdeklaration ohne eigene Darstellung. Die Zeile nennt Größe und Kategorie des Render-Orts.
- **Größe:** aus `size={…}` am JSX-Tag. Alle 240 Fundstellen haben eine Größe, daher wurde kein Standardwert 24 angenommen. Ausnahme: `ImageOff` mit `size={compact ? 16 : 20}`.
- **Fach-Icons:** 54 Dateien in `components/visual/icons/` (ohne `icon-base` und Tests). „(grob)“ kennzeichnet ein nächstliegendes, aber nicht treffendes Fach-Icon. „kein passendes“ steht, wenn kein Fach-Icon die Bedeutung trifft.
- **Kategorien:** K1 Text/Knopf · K2 Status · K3 Kachel · K4 Steuerung. Grenzfälle stehen in Abschnitt 4.

## 2. Tabelle: jede Verwendung (240 Zeilen)

| Nr | Datei:Zeile | Icon | Größe (px) | Kat. | Zusammenhang / Bedeutung | Fach-Icon (nur K3) |
|---:|---|---|---:|---|---|---|
| 1 | `app/(site)/artikel/[slug]/artikel-kauf.tsx:225` | ShoppingCart | 18 | K1 | Knopf „In den Warenkorb“ (Artikel) | – |
| 2 | `app/(site)/artikel/[slug]/page.tsx:230` | Truck | 18 | K3 | Optionskarte „Versand“ | lieferung.tsx |
| 3 | `app/(site)/artikel/[slug]/page.tsx:275` | ArrowRight | 16 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 4 | `app/(site)/artikel/artikel-liste.tsx:105` | SlidersHorizontal | 17 | K4 | Filter-Knopf, Filter öffnen | – |
| 5 | `app/(site)/artikel/artikel-liste.tsx:137` | Check | 14 | K4 | Markierung eines aktiven Filter-Chips | – |
| 6 | `app/(site)/artikel/artikel-liste.tsx:156` | RotateCcw | 15 | K4 | Knopf „Filter zurücksetzen“ (ghost) | – |
| 7 | `app/(site)/artikel/artikel-liste.tsx:183` | RotateCcw | 16 | K4 | Knopf „Filter zurücksetzen“ (outline) | – |
| 8 | `app/(site)/artikel/artikel-liste.tsx:235` | ArrowRight | 14 | K1 | Link „Ansehen“ auf der Artikelkarte | – |
| 9 | `app/(site)/artikel/page.tsx:147` | ArrowRight | 16 | K1 | ButtonLink „Schlüssel nach Code“ | – |
| 10 | `app/(site)/artikel/page.tsx:172` | PackageOpen | 18 | K3 | Link-Karte „Passende Bereiche“ | versand-paket.tsx (grob) |
| 11 | `app/(site)/artikel/page.tsx:183` | ArrowRight | 16 | K1 | Pfeil in der Link-Karte „Passende Bereiche“ | – |
| 12 | `app/(site)/autoschluessel/anfrage/assistent.tsx:1379` | Loader2 | 17 | K2 | Ladeanzeige während der Angebotsberechnung (`role="status"`) | – |
| 13 | `app/(site)/autoschluessel/anfrage/assistent.tsx:1428` | Loader2 | 17 | K2 | Ladeanzeige „Ihre Angaben werden geprüft …“ | – |
| 14 | `app/(site)/autoschluessel/anfrage/assistent.tsx:1492` | ShieldCheck | 15 | K1 | Sicherheitshinweis im Fließtext unter dem Formular | – |
| 15 | `app/(site)/autoschluessel/anfrage/page.tsx:135` | ArrowRight | 14 | K1 | Link „Ansehen“ auf der Anfrage-Karte | – |
| 16 | `app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:117` | ArrowRight | 17 | K1 | ButtonLink „Mit diesem Fahrzeug starten“ | – |
| 17 | `app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:284` | ArrowRight | 17 | K1 | ButtonLink „{Marke} {Modell} auswählen“ (Anfrage) | – |
| 18 | `app/(site)/autoschluessel/marken/[make]/[model]/page.tsx:322` | ArrowRight | 16 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 19 | `app/(site)/autoschluessel/marken/[make]/page.tsx:84` | ArrowRight | 17 | K1 | Knopf-Link zur Anfrage mit vorbelegter Marke | – |
| 20 | `app/(site)/autoschluessel/marken/[make]/page.tsx:222` | ArrowRight | 14 | K1 | Link „Details“ auf der Modellkarte | – |
| 21 | `app/(site)/autoschluessel/marken/[make]/page.tsx:252` | ArrowRight | 17 | K1 | Knopf-Link zur Anfrage mit vorbelegter Marke (zweiter Abschnitt) | – |
| 22 | `app/(site)/autoschluessel/marken/[make]/page.tsx:278` | ArrowRight | 16 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 23 | `app/(site)/autoschluessel/marken/page.tsx:64` | ArrowRight | 17 | K1 | Knopf-Link zur Autoschlüssel-Anfrage (Kopfbereich) | – |
| 24 | `app/(site)/autoschluessel/marken/page.tsx:130` | ArrowRight | 16 | K1 | Pfeil auf der Markenkarte (Ziel: Marken-Seite) | – |
| 25 | `app/(site)/autoschluessel/marken/page.tsx:168` | ArrowRight | 17 | K1 | Knopf-Link zur Autoschlüssel-Anfrage (Abschluss) | – |
| 26 | `app/(site)/autoschluessel/marken/page.tsx:193` | ArrowRight | 16 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 27 | `app/(site)/autoschluessel/page.tsx:77` | KeyRound | 19 | K3 | Typ des Felds `icon` der Gruppen (Render Z. 352) | schluessel-kopieren.tsx |
| 28 | `app/(site)/autoschluessel/page.tsx:85` | KeyRound | 19 | K3 | Gruppenkachel „Schlüssel anfertigen“ (Render Z. 352) | schluessel-kopieren.tsx |
| 29 | `app/(site)/autoschluessel/page.tsx:118` | Wrench | 19 | K3 | Gruppenkachel „Elektronik und Programmierung“ (Render Z. 352) | schluessel-programmieren.tsx |
| 30 | `app/(site)/autoschluessel/page.tsx:148` | Car | 19 | K3 | Gruppenkachel „Reparatur und Sonderfälle“ (Render Z. 352) | reparatur-austausch.tsx (grob) |
| 31 | `app/(site)/autoschluessel/page.tsx:267` | ArrowRight | 17 | K1 | ButtonLink „Fahrzeug auswählen und Termin starten“ | – |
| 32 | `app/(site)/autoschluessel/page.tsx:379` | ArrowRight | 15 | K1 | Link „Zur Seite“ | – |
| 33 | `app/(site)/autoschluessel/page.tsx:405` | ArrowRight | 17 | K1 | Knopf-Link zur Autoschlüssel-Anfrage (Abschnitt) | – |
| 34 | `app/(site)/autoschluessel/page.tsx:449` | ArrowRight | 17 | K1 | Knopf-Link zur Markenübersicht | – |
| 35 | `app/(site)/autoschluessel/page.tsx:463` | ArrowRight | 14 | K1 | Pfeil auf dem Markeneintrag | – |
| 36 | `app/(site)/bestellung/[id]/page.tsx:367` | ArrowRight | 15 | K1 | Link „Stand des Vorgangs abrufen“ | – |
| 37 | `app/(site)/bestellung/[id]/page.tsx:389` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 38 | `app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx:109` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 39 | `app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx:693` | CheckCircle2 | 22 | K2 | Bestätigung „Ihr Projekt ist eingegangen“ | – |
| 40 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:52` | CreditCard | 19 | K3 | Typ des Felds `icon` der Bausteine (Render Z. 427) | transponder.tsx |
| 41 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:69` | CreditCard | 19 | K3 | Baustein „RFID-Transponder und Zutrittskarten“ (Render Z. 427) | transponder.tsx |
| 42 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:82` | Smartphone | 19 | K3 | Baustein „Smartphone- und App-Steuerung“ (Render Z. 427) | smarte-funktionen.tsx |
| 43 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:95` | Hash | 19 | K3 | Baustein „PIN-Code und Tastatur“ (Render Z. 427) | kein passendes |
| 44 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:108` | Layers | 19 | K3 | Baustein „Digitale Zylinder“ (Render Z. 427) | profilzylinder.tsx (grob) |
| 45 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:121` | DoorClosed | 19 | K3 | Baustein „Elektronische Beschläge und Smart Locks“ (Render Z. 427) | schutzbeschlag.tsx (grob) |
| 46 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:134` | CalendarClock | 19 | K3 | Baustein „Zeitlich begrenzte Zugangsberechtigungen“ (Render Z. 427) | termin.tsx (grob) |
| 47 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:147` | UserCog | 19 | K3 | Baustein „Benutzerverwaltung und Berechtigungsgruppen“ (Render Z. 427) | schliessanlagen.tsx (grob) |
| 48 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:160` | Clock | 19 | K3 | Baustein „Berechtigungen nach Wochentag oder Uhrzeit“ (Render Z. 427) | kein passendes |
| 49 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:173` | Ban | 19 | K3 | Baustein „Verlorene Karten und Transponder schnell sperren“ (Render Z. 427) | kein passendes |
| 50 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:187` | FileText | 19 | K3 | Baustein „Ereignisprotokoll — optional“ (Render Z. 427) | kein passendes |
| 51 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:201` | Blend | 19 | K3 | Baustein „Kombination aus mechanischer und elektronischer Lösung“ (Render Z. 427) | kombinierte-konzepte.tsx |
| 52 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:364` | ArrowRight | 18 | K1 | Knopf-Link im Abschnitt (ROUTE-Ziel) | – |
| 53 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:491` | ArrowRight | 17 | K1 | Link zum Ratgeber „mechanisch oder elektronisch“ | – |
| 54 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:568` | ArrowRight | 18 | K1 | Knopf-Link im Abschnitt (ROUTE-Ziel) | – |
| 55 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:613` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 56 | `app/(site)/elektronische-zutrittsloesungen/page.tsx:625` | Building2 | 14 | K1 | Inline-Symbol vor dem Fließtext „Sie sind unsicher …“ | – |
| 57 | `app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx:454` | Plus | 18 | K4 | Knopf „Weitere Tür hinzufügen“ | – |
| 58 | `app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx:679` | Trash2 | 16 | K4 | Knopf „Entfernen“ (Position) | – |
| 59 | `app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx:75` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 60 | `app/(site)/gleichschliessende-zylinder/page.tsx:135` | ArrowRight | 18 | K1 | Knopf-Link im Abschnitt (ROUTE-Ziel) | – |
| 61 | `app/(site)/gleichschliessende-zylinder/page.tsx:190` | KeyRound | 16 | K3 | Karte eines Anwendungsfalls „Haus- und Wohnungstür mit demselben Schlüssel“ | gleichschliessende-zylinder.tsx |
| 62 | `app/(site)/gleichschliessende-zylinder/page.tsx:365` | Ruler | 15 | K1 | Link „Zylinder richtig ausmessen“ (Ratgeber) | – |
| 63 | `app/(site)/gleichschliessende-zylinder/page.tsx:374` | Layers | 18 | K3 | Karte „Messfigur“ mit Hinweis zum Konfigurator | zylinder-mass.tsx (grob) |
| 64 | `app/(site)/gleichschliessende-zylinder/page.tsx:441` | ArrowRight | 18 | K1 | Knopf-Link im Abschnitt (ROUTE-Ziel) | – |
| 65 | `app/(site)/gleichschliessende-zylinder/page.tsx:505` | ArrowRight | 15 | K1 | Pfeil im Abschnitt (ROUTE-Ziel) | – |
| 66 | `app/(site)/gleichschliessende-zylinder/page.tsx:529` | ArrowRight | 15 | K1 | Link zu Schließanlagen | – |
| 67 | `app/(site)/gleichschliessende-zylinder/page.tsx:561` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 68 | `app/(site)/page.tsx:35` | KeyRound | 19 | K3 | Typ der Map `AREA_ICONS` (Render Z. 169) | autoschluessel.tsx |
| 69 | `app/(site)/page.tsx:36` | KeyRound | 19 | K3 | Startseitenkachel „Autoschlüssel“ (Render Z. 169) | autoschluessel.tsx |
| 70 | `app/(site)/page.tsx:37` | ScanLine | 19 | K3 | Startseitenkachel „Schlüssel nach Vorlage“ (Render Z. 169) | schluessel-nach-vorlage.tsx |
| 71 | `app/(site)/page.tsx:38` | Package | 19 | K3 | Startseitenkachel „Schlüssel nach Code“ (Render Z. 169) | schluessel-nach-code.tsx |
| 72 | `app/(site)/page.tsx:39` | Layers | 19 | K3 | Startseitenkachel „Gleichschließende Zylinder“ (Render Z. 169) | gleichschliessende-zylinder.tsx |
| 73 | `app/(site)/page.tsx:40` | ClipboardList | 19 | K3 | Startseitenkachel „Schließanlagen“ (Render Z. 169) | schliessanlagen.tsx |
| 74 | `app/(site)/page.tsx:41` | ShieldCheck | 19 | K3 | Startseitenkachel „Elektronische Zutrittslösungen“ (Render Z. 169) | elektronische-zutrittsloesungen.tsx |
| 75 | `app/(site)/page.tsx:42` | Wrench | 19 | K3 | Startseitenkachel „Tür- und Schließtechnik“ (Render Z. 169) | tuer-und-schliesstechnik.tsx |
| 76 | `app/(site)/page.tsx:43` | ShieldCheck | 19 | K3 | Startseitenkachel „Sicherheitstechnik“ (Render Z. 169) | sicherheitstechnik.tsx |
| 77 | `app/(site)/page.tsx:44` | CalendarClock | 19 | K3 | Eintrag „Service und Termin“ in der Map, ohne Render (`QUICK_ENTRIES` filtert diesen Bereich heraus) | service-und-termin.tsx |
| 78 | `app/(site)/page.tsx:108` | ArrowRight | 18 | K1 | Hero-Knopf zur Autoschlüssel-Anfrage | – |
| 79 | `app/(site)/page.tsx:161` | KeyRound | 19 | K3 | Fallback `?? KeyRound` für unbekannten Bereichsschlüssel (Render Z. 169; nicht erreicht, alle acht Schlüssel sind abgedeckt) | autoschluessel.tsx |
| 80 | `app/(site)/page.tsx:179` | ArrowRight | 13 | K1 | Pfeil in der Startseitenkachel (Bereich) | – |
| 81 | `app/(site)/page.tsx:262` | ArrowRight | 15 | K1 | Pfeil im Abschnitt „Schlüssel nach Code“ | – |
| 82 | `app/(site)/page.tsx:282` | ArrowRight | 15 | K1 | Pfeil im Abschnitt „Zusammenstellen“ | – |
| 83 | `app/(site)/page.tsx:312` | ArrowRight | 15 | K1 | Pfeil im Link (`area.highlight` oder `area.href`) | – |
| 84 | `app/(site)/page.tsx:334` | ArrowRight | 15 | K1 | Link zur Ratgeber-Übersicht | – |
| 85 | `app/(site)/page.tsx:353` | ArrowRight | 14 | K1 | Pfeil im Ratgeber-Eintrag | – |
| 86 | `app/(site)/ratgeber/[slug]/page.tsx:79` | ArrowRight | 16 | K1 | Link „Ihr nächster Schritt“ | – |
| 87 | `app/(site)/ratgeber/page.tsx:56` | ArrowRight | 14 | K1 | Pfeil im Ratgeber-Eintrag | – |
| 88 | `app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx:131` | Check | 11 | K4 | Haken im Schalter (Cookie-Kategorie aktiv) | – |
| 89 | `app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx:162` | Trash2 | 16 | K4 | Knopf „Gespeicherte Daten löschen“ | – |
| 90 | `app/(site)/schliessanlagen/konfigurator/page.tsx:115` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 91 | `app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:701` | Trash2 | 15 | K4 | Knopf „Entfernen“ (Zeile oder Tür) | – |
| 92 | `app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:1520` | Plus | 17 | K4 | Knopf „Weitere Tür hinzufügen“ | – |
| 93 | `app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:1615` | Plus | 17 | K4 | Knopf „Weitere Gruppe hinzufügen“ | – |
| 94 | `app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:1689` | Plus | 17 | K4 | Knopf „Weitere Zeile hinzufügen“ | – |
| 95 | `app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx:1858` | ArrowRight | 15 | K1 | Link zu `/schliessanlagen#systeme` | – |
| 96 | `app/(site)/schliessanlagen/page.tsx:85` | Layers | 19 | K3 | Zielgruppenkachel „Privat“ (Render Z. 333) | gleichschliessende-zylinder.tsx (grob) |
| 97 | `app/(site)/schliessanlagen/page.tsx:94` | Building2 | 19 | K3 | Zielgruppenkachel „Unternehmen“ (Render Z. 333) | schliessanlagen.tsx (grob) |
| 98 | `app/(site)/schliessanlagen/page.tsx:103` | Users | 19 | K3 | Zielgruppenkachel „Hausverwaltung“ (Render Z. 333) | kein passendes |
| 99 | `app/(site)/schliessanlagen/page.tsx:112` | Building2 | 19 | K3 | Zielgruppenkachel „Öffentliche Einrichtung“ (Render Z. 333) | schliessanlagen.tsx (grob) |
| 100 | `app/(site)/schliessanlagen/page.tsx:121` | Layers | 19 | K3 | Zielgruppenkachel „Mehrere Gebäude“ (Render Z. 333) | schliessanlagen.tsx (grob) |
| 101 | `app/(site)/schliessanlagen/page.tsx:231` | ArrowRight | 18 | K1 | Knopf-Link zum Konfigurator | – |
| 102 | `app/(site)/schliessanlagen/page.tsx:344` | ArrowRight | 15 | K1 | Pfeil im Link der Zielgruppenkachel (`item.href`) | – |
| 103 | `app/(site)/schliessanlagen/page.tsx:442` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 104 | `app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx:177` | Check | 18 | K2 | Gültigkeitshaken im Eingabefeld (Feld ausgefüllt) | – |
| 105 | `app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx:328` | ShoppingCart | 18 | K1 | Knopf „In den Warenkorb“ | – |
| 106 | `app/(site)/schluessel-nach-code/[slug]/page.tsx:109` | MapPin | 13 | K1 | Inline-Symbol in der Bildunterschrift (Ort des Codes) | – |
| 107 | `app/(site)/schluessel-nach-code/[slug]/page.tsx:206` | ArrowRight | 16 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 108 | `app/(site)/schluessel-nach-code/page.tsx:122` | PackageOpen | 18 | K3 | Link-Karte „Passende Bereiche und Erklärungen“ | schluessel-nach-code.tsx (grob) |
| 109 | `app/(site)/schluessel-nach-code/page.tsx:133` | ArrowRight | 16 | K1 | Pfeil in der Link-Karte „Passende Bereiche“ | – |
| 110 | `app/(site)/schluessel-nach-code/shop-liste.tsx:134` | SlidersHorizontal | 17 | K4 | Filter-Knopf (mobil öffnen) | – |
| 111 | `app/(site)/schluessel-nach-code/shop-liste.tsx:212` | RotateCcw | 15 | K4 | Knopf „Filter zurücksetzen“ (ghost) | – |
| 112 | `app/(site)/schluessel-nach-code/shop-liste.tsx:262` | ArrowRight | 14 | K1 | Pfeil zur Produktseite in der Trefferliste | – |
| 113 | `app/(site)/schluessel-nach-code/shop-liste.tsx:289` | RotateCcw | 16 | K4 | Knopf „Filter zurücksetzen“ (outline) | – |
| 114 | `app/(site)/schluessel-nach-code/shop-liste.tsx:294` | ArrowRight | 16 | K1 | Link zur Vorlagen-Anfrage nach der Trefferliste | – |
| 115 | `app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx:390` | CheckCircle2 | 14 | K2 | Erfolgs-Badge „Anfrage eingegangen“ | – |
| 116 | `app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx:470` | ArrowRight | 17 | K1 | Knopf-Link zum Terminstatus | – |
| 117 | `app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx:942` | CheckCircle2 | 15 | K2 | Haken-Listenpunkt bei den Aufnahme-Hinweisen | – |
| 118 | `app/(site)/schluessel-nach-vorlage/page.tsx:77` | Camera | 16 | K3 | Schritt 1 „Fotos hochladen“ (Render Z. 236) | foto-hochladen.tsx |
| 119 | `app/(site)/schluessel-nach-vorlage/page.tsx:84` | Search | 16 | K3 | Schritt 2 „Wir prüfen“ (Render Z. 236) | pruefung.tsx |
| 120 | `app/(site)/schluessel-nach-vorlage/page.tsx:91` | CheckCircle2 | 16 | K3 | Schritt 3 „Machbarkeit und Preis“ (Render Z. 236) | kein passendes |
| 121 | `app/(site)/schluessel-nach-vorlage/page.tsx:98` | Package | 16 | K3 | Schritt 4 „Nur falls nötig: Einsendung“ (Render Z. 236) | versand-paket.tsx |
| 122 | `app/(site)/schluessel-nach-vorlage/page.tsx:190` | ArrowRight | 18 | K1 | Hero-Knopf zur Vorlagen-Anfrage | – |
| 123 | `app/(site)/schluessel-nach-vorlage/page.tsx:219` | ArrowRight | 17 | K1 | Knopf-Link zur Vorlagen-Anfrage (Abschnitt) | – |
| 124 | `app/(site)/schluessel-nach-vorlage/page.tsx:279` | Ruler | 16 | K3 | Überschrift der Karte „Beschriftungen mitfotografieren“ | zylinder-mass.tsx (grob) |
| 125 | `app/(site)/schluessel-nach-vorlage/page.tsx:377` | CheckCircle2 | 16 | K2 | Haken-Listenpunkt „Falls vorhanden: Sicherungskarte“ | – |
| 126 | `app/(site)/schluessel-nach-vorlage/page.tsx:458` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`item.href`) | – |
| 127 | `app/(site)/service-und-termin/anfrage/anfrage-formular.tsx:167` | CheckCircle2 | 26 | K2 | Erfolgsmeldung „Anfrage gesendet“ | – |
| 128 | `app/(site)/service-und-termin/kontakt/page.tsx:50` | MapPin | 19 | K3 | Kontaktkarte „Anschrift“ | standort.tsx |
| 129 | `app/(site)/service-und-termin/kontakt/page.tsx:66` | Phone | 19 | K3 | Kontaktkarte „Telefon“ | beratung-telefon.tsx |
| 130 | `app/(site)/service-und-termin/kontakt/page.tsx:80` | Mail | 19 | K3 | Kontaktkarte „E-Mail“ | kein passendes |
| 131 | `app/(site)/service-und-termin/page.tsx:30` | MessageSquare | 19 | K3 | Leistungskachel „Allgemeine Anfrage“ (Render Z. 115) | kein passendes |
| 132 | `app/(site)/service-und-termin/page.tsx:36` | CalendarSearch | 19 | K3 | Leistungskachel „Terminstatus“ (Render Z. 115) | termin.tsx (grob) |
| 133 | `app/(site)/service-und-termin/page.tsx:42` | MapPin | 19 | K3 | Leistungskachel „Vor-Ort-Leistungen“ (Render Z. 115) | standort.tsx |
| 134 | `app/(site)/service-und-termin/page.tsx:48` | Phone | 19 | K3 | Leistungskachel „Kontakt“ (Render Z. 115) | beratung-telefon.tsx |
| 135 | `app/(site)/service-und-termin/page.tsx:277` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 136 | `app/(site)/service-und-termin/terminstatus/status-formular.tsx:119` | Search | 16 | K1 | Knopf-Symbol „Stand abrufen“ | – |
| 137 | `app/(site)/service-und-termin/vor-ort/page.tsx:122` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`service.href`) | – |
| 138 | `app/(site)/sicherheitstechnik/[slug]/page.tsx:89` | ArrowRight | 18 | K1 | CTA-Knopf (`page.ctaHref`) | – |
| 139 | `app/(site)/sicherheitstechnik/[slug]/page.tsx:107` | Check | 13 | K2 | Haken-Listenpunkt im 20-px-Kreis (Merkmal erfüllt) | – |
| 140 | `app/(site)/sicherheitstechnik/[slug]/page.tsx:185` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (Bereich) | – |
| 141 | `app/(site)/sicherheitstechnik/[slug]/page.tsx:206` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 142 | `app/(site)/sicherheitstechnik/page.tsx:38` | ShieldCheck | 19 | K3 | Typ der Map `SERVICE_ICONS` (Render Z. 182) | sicherheitstechnik.tsx |
| 143 | `app/(site)/sicherheitstechnik/page.tsx:39` | Camera | 19 | K3 | Leistungskachel „Videoüberwachung“ (Render Z. 182) | videoueberwachung.tsx |
| 144 | `app/(site)/sicherheitstechnik/page.tsx:40` | Siren | 19 | K3 | Leistungskachel „Alarmtechnik“ (Render Z. 182) | alarmtechnik.tsx |
| 145 | `app/(site)/sicherheitstechnik/page.tsx:41` | ShieldCheck | 19 | K3 | Leistungskachel „Sicherung der Außenhaut“ (Render Z. 182) | aussenhautsicherung.tsx |
| 146 | `app/(site)/sicherheitstechnik/page.tsx:42` | Lock | 19 | K3 | Leistungskachel „Mechanischer Schutz“ (Render Z. 182) | mechanischer-schutz.tsx |
| 147 | `app/(site)/sicherheitstechnik/page.tsx:43` | Smartphone | 19 | K3 | Leistungskachel „Smarte Funktionen“ (Render Z. 182) | smarte-funktionen.tsx |
| 148 | `app/(site)/sicherheitstechnik/page.tsx:44` | BellRing | 19 | K3 | Leistungskachel „Panik- und Alarmtaster“ (Render Z. 182) | panik-alarmtaster.tsx |
| 149 | `app/(site)/sicherheitstechnik/page.tsx:45` | Layers | 19 | K3 | Leistungskachel „Kombinierte Sicherheitskonzepte“ (Render Z. 182) | kombinierte-konzepte.tsx |
| 150 | `app/(site)/sicherheitstechnik/page.tsx:103` | ArrowRight | 18 | K1 | Hero-Knopf des Bereichs | – |
| 151 | `app/(site)/sicherheitstechnik/page.tsx:129` | ArrowRight | 15 | K1 | Pfeil im Link (`item.href`) | – |
| 152 | `app/(site)/sicherheitstechnik/page.tsx:174` | ShieldCheck | 19 | K3 | Fallback `?? ShieldCheck` für unbekannte Leistung (Render Z. 182; mit den Slugs in `content/service-pages.json` nicht erreicht) | sicherheitstechnik.tsx |
| 153 | `app/(site)/sicherheitstechnik/page.tsx:192` | ArrowRight | 13 | K1 | Pfeil in der Leistungskachel | – |
| 154 | `app/(site)/sicherheitstechnik/page.tsx:275` | ArrowRight | 15 | K1 | Link zu `/tuer-und-schliesstechnik` | – |
| 155 | `app/(site)/sicherheitstechnik/page.tsx:295` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (ROUTE-Ziel) | – |
| 156 | `app/(site)/sicherheitstechnik/page.tsx:314` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 157 | `app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx:84` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 158 | `app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx:606` | CheckCircle2 | 22 | K2 | Erfolgsmeldung des Sicherheitschecks | – |
| 159 | `app/(site)/standorte/[city]/page.tsx:61` | ArrowRight | 16 | K1 | Knopf-Link zur Anfrage (Standort) | – |
| 160 | `app/(site)/standorte/[city]/page.tsx:113` | ArrowRight | 14 | K1 | Pfeil im Verweis-Link (`area.href`) | – |
| 161 | `app/(site)/standorte/page.tsx:44` | MapPin | 16 | K3 | Kopf der Standortkarte (Ortsname) | standort.tsx |
| 162 | `app/(site)/standorte/page.tsx:53` | ArrowRight | 14 | K1 | Pfeil in der Standortkarte | – |
| 163 | `app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx:70` | ArrowRight | 18 | K1 | CTA-Knopf (`page.ctaHref`) | – |
| 164 | `app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx:88` | Check | 13 | K2 | Haken-Listenpunkt im 20-px-Kreis (Merkmal erfüllt) | – |
| 165 | `app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx:137` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (Bereich) | – |
| 166 | `app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx:158` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 167 | `app/(site)/tuer-und-schliesstechnik/page.tsx:45` | KeyRound | 26 | K3 | Typ der Map `SERVICE_ICONS` (Render Z. 236) | profilzylinder.tsx (wie Z. 46) |
| 168 | `app/(site)/tuer-und-schliesstechnik/page.tsx:46` | KeyRound | 26 | K3 | Leistungskachel „Profilzylinder und Spezialzylinder“ (Render Z. 236, strokeWidth 1.5) | profilzylinder.tsx |
| 169 | `app/(site)/tuer-und-schliesstechnik/page.tsx:47` | Lock | 26 | K3 | Leistungskachel „Einsteckschlösser“ (Render Z. 236) | einsteckschloss.tsx |
| 170 | `app/(site)/tuer-und-schliesstechnik/page.tsx:48` | Layers | 26 | K3 | Leistungskachel „Mehrfachverriegelungen“ (Render Z. 236) | mehrfachverriegelung.tsx |
| 171 | `app/(site)/tuer-und-schliesstechnik/page.tsx:49` | ShieldCheck | 26 | K3 | Leistungskachel „Schutzbeschläge“ (Render Z. 236) | schutzbeschlag.tsx |
| 172 | `app/(site)/tuer-und-schliesstechnik/page.tsx:50` | PanelTop | 26 | K3 | Leistungskachel „Türzusatzschlösser“ (Render Z. 236) | tuerzusatzschloss.tsx |
| 173 | `app/(site)/tuer-und-schliesstechnik/page.tsx:51` | DoorClosed | 26 | K3 | Leistungskachel „Türschließer“ (Render Z. 236) | tuerschliesser.tsx |
| 174 | `app/(site)/tuer-und-schliesstechnik/page.tsx:52` | Siren | 26 | K3 | Leistungskachel „Panik- und Fluchttürtechnik“ (Render Z. 236) | panik-fluchttuer.tsx |
| 175 | `app/(site)/tuer-und-schliesstechnik/page.tsx:53` | Wrench | 26 | K3 | Leistungskachel „Reparatur und Austausch“ (Render Z. 236) | reparatur-austausch.tsx |
| 176 | `app/(site)/tuer-und-schliesstechnik/page.tsx:54` | ScanLine | 26 | K3 | Leistungskachel „Technische Beratung“ (Render Z. 236) | technische-beratung.tsx |
| 177 | `app/(site)/tuer-und-schliesstechnik/page.tsx:55` | Wrench | 26 | K3 | Leistungskachel „Montage und Anpassung“ (Render Z. 236) | montage.tsx |
| 178 | `app/(site)/tuer-und-schliesstechnik/page.tsx:141` | ArrowRight | 18 | K1 | Knopf-Link zur Anfrage (Thema) | – |
| 179 | `app/(site)/tuer-und-schliesstechnik/page.tsx:174` | CheckCircle2 | 20 | K2 | Haken-Listenpunkt „Mehrfachverriegelung“ | – |
| 180 | `app/(site)/tuer-und-schliesstechnik/page.tsx:228` | Wrench | 26 | K3 | Fallback `?? Wrench` für unbekannte Leistung (Render Z. 236; mit den Slugs in `content/service-pages.json` nicht erreicht) | werkstatt.tsx (grob) |
| 181 | `app/(site)/tuer-und-schliesstechnik/page.tsx:246` | ArrowRight | 16 | K1 | Pfeil in der Leistungskachel (Link) | – |
| 182 | `app/(site)/tuer-und-schliesstechnik/page.tsx:263` | ShieldCheck | 400 | K3 | Dekor-Wasserzeichen (Deckkraft 5 %) im dunklen Abschnitt „Normen und Brandschutz“ | pruefung.tsx (grob) |
| 183 | `app/(site)/tuer-und-schliesstechnik/page.tsx:279` | ArrowRight | 18 | K1 | Knopf-Pfeil im Abschnitt „Normen und Brandschutz“ | – |
| 184 | `app/(site)/tuer-und-schliesstechnik/page.tsx:323` | ArrowRight | 16 | K1 | Pfeil im Verweis-Link (`area.href`) | – |
| 185 | `app/(site)/tuer-und-schliesstechnik/page.tsx:344` | ArrowRight | 16 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 186 | `app/(site)/warenkorb/page.tsx:65` | ArrowRight | 15 | K1 | Pfeil im Verweis-Link (`link.href`) | – |
| 187 | `app/(site)/warenkorb/warenkorb-ansicht.tsx:294` | Trash2 | 16 | K4 | Knopf „Position entfernen“ | – |
| 188 | `app/(site)/warenkorb/warenkorb-ansicht.tsx:380` | Trash2 | 16 | K4 | Knopf „Position entfernen“ | – |
| 189 | `app/(site)/warenkorb/warenkorb-ansicht.tsx:487` | ArrowRight | 17 | K1 | Knopf-Link „Zur Kasse“ (`/kasse`) | – |
| 190 | `app/(site)/warenkorb/warenkorb-ansicht.tsx:597` | Trash2 | 16 | K4 | Knopf „Position entfernen“ (ghost) | – |
| 191 | `components/autoschluessel/bestaetigung.tsx:35` | CheckCircle2 | 16 | K2 | Erfolgskennzeichen über der Terminbestätigung | – |
| 192 | `components/autoschluessel/bestaetigung.tsx:57` | CalendarCheck | 18 | K3 | Karte „Termin“ in der Bestätigung | termin.tsx |
| 193 | `components/autoschluessel/bestaetigung.tsx:75` | CreditCard | 18 | K3 | Karte „Zahlung“ in der Bestätigung | anzahlung.tsx (grob) |
| 194 | `components/autoschluessel/preis-anzeige.tsx:117` | Clock | 18 | K3 | Karte „Dauer“ in der Preisanzeige | termin.tsx (grob) |
| 195 | `components/autoschluessel/preis-anzeige.tsx:129` | Car | 18 | K3 | Karte „Fahrzeug“ in der Preisanzeige | fahrzeugmarke.tsx (grob) |
| 196 | `components/autoschluessel/preis-anzeige.tsx:154` | Info | 15 | K2 | Hinweis-Symbol vor der Erläuterung des Preises | – |
| 197 | `components/autoschluessel/service-article.tsx:97` | ArrowRight | 17 | K1 | Knopf-Pfeil „nächster Schritt“ (primär) | – |
| 198 | `components/autoschluessel/service-article.tsx:160` | Check | 14 | K2 | Merkmal enthalten (Haken im Kreis) | – |
| 199 | `components/autoschluessel/service-article.tsx:197` | Minus | 14 | K2 | Merkmal nicht enthalten (Minus im Kreis) | – |
| 200 | `components/autoschluessel/service-article.tsx:235` | ArrowRight | 17 | K1 | Knopf-Pfeil „nächster Schritt“ (primär) | – |
| 201 | `components/autoschluessel/service-article.tsx:267` | ArrowRight | 16 | K1 | Pfeil im Link (`next.primary` oder `secondary`) | – |
| 202 | `components/autoschluessel/termin-auswahl.tsx:84` | Loader2 | 17 | K2 | Ladeanzeige „Termine werden geladen“ (`role="status"`) | – |
| 203 | `components/autoschluessel/termin-auswahl.tsx:113` | CalendarClock | 17 | K3 | Überschrift je Terminttag (Abschnitt) | termin.tsx |
| 204 | `components/calculator/rechner-bausteine.tsx:24` | Calculator | 20 | K3 | Kopf-Kachel des Rechner-Bausteins (farbiger 40-px-Kasten) | kein passendes |
| 205 | `components/calculator/rechner-bausteine.tsx:132` | ArrowRight | 18 | K1 | Knopf-Pfeil zur Anfrage (`anfrageHref`) | – |
| 206 | `components/flow/flow-shell.tsx:81` | Check | 12 | K2 | Schritt-Status „erledigt“ in der Fortschrittsanzeige | – |
| 207 | `components/flow/flow-shell.tsx:96` | Save | 14 | K2 | Statushinweis „Ihr Zwischenstand von zuletzt wurde geladen“ | – |
| 208 | `components/flow/flow-shell.tsx:104` | RotateCcw | 14 | K4 | Knopf „Neu beginnen“ | – |
| 209 | `components/flow/flow-shell.tsx:137` | ArrowLeft | 17 | K1 | Knopf „Zurück“ | – |
| 210 | `components/flow/flow-shell.tsx:154` | ArrowRight | 17 | K1 | Knopf „Weiter“ | – |
| 211 | `components/forms/option-card.tsx:74` | Check | 13 | K4 | Auswahlmarke einer Option (Checkbox- oder Radio-Anzeige) | – |
| 212 | `components/forms/photo-upload.tsx:314` | Camera | 17 | K1 | Knopf „Foto aufnehmen“ | – |
| 213 | `components/forms/photo-upload.tsx:322` | ImageUp | 17 | K1 | Knopf „Aus Galerie wählen“ oder „Datei auswählen“ | – |
| 214 | `components/forms/photo-upload.tsx:373` | Trash2 | 14 | K4 | Icon-Knopf „Entfernen“ (hochgeladene Datei) | – |
| 215 | `components/forms/photo-upload.tsx:388` | Loader2 | 13 | K2 | Ladeanzeige „Datei wird hochgeladen“ | – |
| 216 | `components/forms/photo-upload.tsx:394` | Check | 13 | K2 | Statusanzeige „Gespeichert“ (Upload fertig) | – |
| 217 | `components/forms/photo-upload.tsx:407` | RotateCcw | 13 | K4 | Knopf „Erneut versuchen“ | – |
| 218 | `components/layout/breadcrumbs.tsx:23` | ChevronRight | 13 | K1 | Trenner zwischen den Brotkrumen (Text) | – |
| 219 | `components/layout/mobile-action-bar.tsx:9` | KeyRound | 19 | K1 | Tab „Autoschlüssel“ der unteren Leiste (Render Z. 48) | – |
| 220 | `components/layout/mobile-action-bar.tsx:10` | Search | 19 | K1 | Tab „Nach Code“ der unteren Leiste (Render Z. 48) | – |
| 221 | `components/layout/mobile-action-bar.tsx:11` | CalendarClock | 19 | K1 | Tab „Termin“ der unteren Leiste (Render Z. 48) | – |
| 222 | `components/layout/mobile-action-bar.tsx:12` | LifeBuoy | 19 | K1 | Tab „Service“ der unteren Leiste (Render Z. 48) | – |
| 223 | `components/layout/site-header.tsx:74` | ChevronDown | 13 | K4 | Aufklappen des Bereichsmenüs (Desktop) | – |
| 224 | `components/layout/site-header.tsx:88` | ChevronDown | 13 | K4 | Aufklappen des Bereichsmenüs (Desktop, zweite Stelle) | – |
| 225 | `components/layout/site-header.tsx:99` | ShoppingBag | 19 | K1 | Knopf-Link „Warenkorb“ im Kopf (nur Symbol) | – |
| 226 | `components/layout/site-header.tsx:125` | Menu | 21 | K4 | Knopf „Menü öffnen“ (mobil) | – |
| 227 | `components/layout/site-header.tsx:200` | ChevronRight | 14 | K1 | Pfeil hinter „Starten“ im Menüeintrag | – |
| 228 | `components/layout/site-header.tsx:229` | X | 20 | K4 | Knopf „Schließen“ (Menü-Schublade) | – |
| 229 | `components/layout/site-header.tsx:251` | ChevronDown | 18 | K4 | Aufklappen eines Bereichs in der Menü-Schublade | – |
| 230 | `components/ui/accordion.tsx:31` | ChevronDown | 18 | K4 | Aufklappen eines Akkordeon-Eintrags | – |
| 231 | `components/ui/alert.tsx:7` | Info | 18 | K2 | Typ des Felds `icon` der Töne (Render Z. 26) | – |
| 232 | `components/ui/alert.tsx:8` | Info | 18 | K2 | Hinweiston „info“ (Render Z. 26) | – |
| 233 | `components/ui/alert.tsx:9` | CheckCircle2 | 18 | K2 | Hinweiston „success“ (Render Z. 26) | – |
| 234 | `components/ui/alert.tsx:10` | AlertTriangle | 18 | K2 | Hinweiston „warning“ (Render Z. 26) | – |
| 235 | `components/ui/alert.tsx:11` | Scale | 18 | K2 | Hinweiston „legal“ (rechtliche Angaben, Render Z. 26) | – |
| 236 | `components/ui/button.tsx:48` | Loader2 | 16 | K2 | Ladeanzeige im Knopf (`loading`) | – |
| 237 | `components/ui/image-placeholder.tsx:84` | ImageOff | 16 / 20 | K2 | Platzhalter, wenn kein Bild vorliegt (16 kompakt, sonst 20) | – |
| 238 | `components/ui/info-tip.tsx:38` | Info | 15 | K2 | Info-Knopf neben dem Feldlabel (öffnet die Erklärung) | – |
| 239 | `components/ui/info-tip.tsx:58` | X | 15 | K4 | Knopf „Schließen“ der Erklärung | – |
| 240 | `components/vertrauen/nachweise-liste.tsx:38` | BadgeCheck | 18 | K2 | Nachweis als geprüft (Listenzeile) | – |

## 3. Zusammenfassung (Schritt 4)

**Verwendungen je Kategorie** (insgesamt 240):

| Kategorie | Anzahl |
|---|---:|
| K1 Text/Knopf | 103 |
| K2 Status | 30 |
| K3 Kachel | 78 |
| K4 Steuerung | 29 |

Davon sind sechs Zeilen Typdeklarationen (`typeof X`) ohne eigene Darstellung. Sie übernehmen Größe und Kategorie des Render-Orts (Nr. 27, 40, 68, 142, 167 in K3, Nr. 231 in K2).

**Icon-Namen, die nur in K3 vorkommen** (28 Namen): Ban, BellRing, Blend, Calculator, CalendarCheck, CalendarSearch, Car, ClipboardList, Clock, CreditCard, DoorClosed, FileText, Hash, Layers, Lock, Mail, MessageSquare, Package, PackageOpen, PanelTop, Phone, ScanLine, Siren, Smartphone, Truck, UserCog, Users, Wrench.

**Icon-Namen, die in K1, K2 oder K4 vorkommen** (32 Namen; sie brauchen einen kleinen Glyphen). In Klammern stehen die Kategorien, in denen sie auftreten. Namen mit „+ K3“ kommen auch als Kachel vor:
AlertTriangle (K2), ArrowLeft (K1), ArrowRight (K1), BadgeCheck (K2), Building2 (K1 + K3), CalendarClock (K1 + K3), Camera (K1 + K3), Check (K2 + K4), CheckCircle2 (K2 + K3), ChevronDown (K4), ChevronRight (K1), ImageOff (K2), ImageUp (K1), Info (K2), KeyRound (K1 + K3), LifeBuoy (K1), Loader2 (K2), MapPin (K1 + K3), Menu (K4), Minus (K2), Plus (K4), RotateCcw (K4), Ruler (K1 + K3), Save (K2), Scale (K2), Search (K1 + K3), ShieldCheck (K1 + K3), ShoppingBag (K1), ShoppingCart (K1), SlidersHorizontal (K4), Trash2 (K4), X (K4).

Die Summe ist 28 + 32 = 60 Namen.

## 4. Befunde, Grenzfälle und offene Fragen

**Befunde**

1. **Toter Map-Eintrag:** `app/(site)/page.tsx:44` ordnet `service-und-termin` das Icon CalendarClock zu. `QUICK_ENTRIES` in `src/lib/navigation.ts:264` filtert diesen Bereich heraus, daher wird der Eintrag nie gerendert.
2. **Fallbacks ohne Wirkung:** `sicherheitstechnik/page.tsx:174` (ShieldCheck), `tuer-und-schliesstechnik/page.tsx:228` (Wrench) und `page.tsx:161` (KeyRound) greifen mit den Slugs in `content/service-pages.json` und den acht Bereichen in `NAV_AREAS` nicht. Alle 17 Leistungs-Slugs und alle 8 Bereichsschlüssel sind in den Maps abgedeckt. Die Prüfung umfasst nur `content/`; `lib/data/defaults/` wurde nicht auf Slugs geprüft.
3. **Uneinheitliche Größe bei Leistungskacheln:** Die Leistungskacheln von `tuer-und-schliesstechnik` werden mit 26 px und `strokeWidth={1.5}` gerendert. Die anderen Kachelsymbole (Startseite, Service, Sicherheitstechnik, Elektronik, Schließanlagen) nutzen 19 px ohne eigenen Strich. Die Schritt-Symbole in `schluessel-nach-vorlage` nutzen 16 px.
4. **Dekor mit 400 px:** `tuer-und-schliesstechnik/page.tsx:263` rendert ShieldCheck als Wasserzeichen. Die Einzelstelle ist im Inventar als K3 geführt; siehe offene Frage 2.
5. **Keine weiteren Wege:** Es gibt keine Icon-Namen als Zeichenketten, keine `LucideIcon`-Typen und keine Props, die ein Icon weiterreichen, außer den genannten Maps und Render-Stellen. Die dynamischen Zugriffe sind vollständig erfasst.
6. **Fach-Icon-Spalte ist ein Vorschlag:** Die Zuordnung erfolgt nach Dateiname. Die Fach-Icons selbst wurden weder gerendert noch inhaltlich geprüft.

**Grenzfälle bei der Kategorisierung**

- **Schritt-Symbole** (`schluessel-nach-vorlage/page.tsx:77, 84, 91, 98`, 16 px ohne Kasten): als K3 (Abschnittssymbol) geführt. K1 wäre ebenso vertretbar.
- **Mobile Leiste** (`components/layout/mobile-action-bar.tsx`, 4 Tabs mit Beschriftung): als K1 geführt. K4 (Navigation) wäre ebenso vertretbar.
- **Info-Knopf** (`components/ui/info-tip.tsx:38`): als K2 geführt, weil das Symbol „Info“ anzeigt. Es ist ein Knopf und damit auch K1.
- **Warenkorb-Symbol im Kopf** (`site-header.tsx:99`, nur Symbol): als K1 (Knopf) geführt.
- **Nachweisliste** (`nachweise-liste.tsx:38`, BadgeCheck): als K2 (geprüft) geführt. K3 (Eintrag) wäre ebenso vertretbar.
- **Auswahlmarke** (`forms/option-card.tsx:74`, Haken im Kreis): als K4 geführt. K2 ist ebenso vertretbar.
- **Filterchip-Haken** (`artikel/artikel-liste.tsx:137`): als K4 (Filter) geführt.
- **Listenhaken in Kreisen** (13–20 px, z. B. `sicherheitstechnik/[slug]/page.tsx:107`): als K2 geführt.

**OFFENE FRAGEN**

1. Sollen die Mobile-Leiste und das Kopf-Warenkorbsymbol als K1 oder K4 gelten?
2. Sind die Schritt-Symbole (16 px) und das 400-px-Wasserzeichen als K3 zu führen oder als eigene Sonderkategorie?
3. Die mit „(grob)“ oder „kein passendes“ markierten Fach-Icon-Zuordnungen brauchen eine Bestätigung. Das betrifft PIN, Sperren, Protokoll, Berechtigungsprofile, Zeitprofile, Mail, Hausverwaltung und Gleichschließung.
4. Ist der Map-Eintrag `service-und-termin` in `app/(site)/page.tsx:44` gewollt, oder ist er ein Rest?
5. Sollen die Maps in `lib/data/defaults/` ebenfalls auf Slug-Abdeckung geprüft werden?
