# E0-KUNDSCHAFTER-01 · Technik und Datenmodell

Stand 2026-11-02, nur gelesen. Pfade ab `src/`, sonst ab Repo-Wurzel. Zugriff: T Team, I Inhaber, P Team-Papierkorb (Endlöschung Inhaber), O öffentlich, F verboten (`payload/access/rollen.ts`).

## GEÄNDERTE DATEIEN
Keine.

## WAS UND WARUM

**1. Sammlungen (18, `payload.config.ts:69-93`). Revalidierung (`payload/hooks/revalidate.ts:41`) bei allen außer vorgaenge, kundendateien, widerrufe, benutzer, interne-dateien, webhook-ereignisse**

| Sammlung (Datei) | r/c/u/d | Hooks, Papierkorb, Versionen, Upload | Feldzeilen, Kernfelder |
|---|---|---|---|
| vorgaenge (`payload/collections/Vorgaenge.ts`) | T/F/T/I (115-118) | Hooks (122-123), Endpunkte (125) | 95: nummer, art (131), status (150), zahlung (501), freigabe (316), vermittlung (344), positionen (381), kontakt (463), mails (562), notizen (604) |
| kundendateien (`Kundendateien.ts`) | T/F/T/I (21-24) | Upload private-uploads (28) | 4: kategorie, vorgang, aufbewahrenBis |
| widerrufe (`Widerrufe.ts`) | T/F/T/I (28-31) | Kundenangaben unveränderlich (6) | 14: name, erklaerung, eingegangenAm, zuordnung |
| produkte (`Produkte.ts`) | T/T/T/P (44-47) | Entwürfe (50), Papierkorb (51), Löschsperre (52) | 27: typ, preis, staffeln, codeMuster, versandklasse |
| fahrzeugmarken (`Fahrzeugmarken.ts`) | T/T/T/P (12) | Entwürfe (13), Papierkorb (14) | 18: name, preisgruppe, modelle (Baujahr, Schlüsselarten) |
| autoschluessel-leistungen (`AutoschluesselLeistungen.ts`) | T/I/T/P (12) | Papierkorb (13) | 5: label, schluesselarten, fahrzeugVorOrt |
| preisregeln (`Preisregeln.ts`) | T/T/T/I (20) | Kennung vorbelegt (23-30) | 7: preisgruppe, leistung, modus, Abweichungen (81-98) |
| preisgruppen (`Preisgruppen.ts`) | T/I/I/I (12) | nur Revalidierung | 2: label, beschreibung |
| sperrtage (`Sperrtage.ts`) | T/T/T/T (12) | nur Revalidierung | 2: datum, grund |
| seiten (`Seiten.ts`) | T/I/T/I (17) | Entwürfe (18) | 10: route, headline, abschnitte, faq |
| leistungsseiten (`Leistungsseiten.ts`) | T/T/T/P (12) | Entwürfe (13), Papierkorb (14) | 6: titel, bereich, prozess, ctaHref |
| ratgeber (`Ratgeber.ts`) | T/T/T/P (11) | Entwürfe mit Zeitplan (12), Papierkorb (13) | 9: titel, thema, abschnitte |
| einsatzgebiete (`Einsatzgebiete.ts`) | T/T/T/P (12) | Entwürfe (13), Papierkorb (14) | 8: stadt, bundesland, lokaleFakten |
| nachweise (`Nachweise.ts`) | T/T/T/P (21) | Papierkorb (22), Foto in interne-dateien (72) | 7: titel, status, gueltigBis, oeffentlich (79-82) |
| medien (`Medien.ts`) | O/T/T/T (23-26) | Upload media (30) | 1: alt |
| benutzer (`Benutzer.ts`) | Team (34), eigener Satz oder Inhaber (38-45) | Login-Schutz (21-23) | 2: name, rollen (58) |
| interne-dateien (`InterneDateien.ts`) | T/T/T/I (21-24) | Upload private-uploads/intern (28) | 1: beschreibung |
| webhook-ereignisse (`WebhookEreignisse.ts`) | I/F/F/I (18) | nur Inhaber sichtbar (15) | 5: ereignisId, typ, vorgang |

**2. Globals (3, `payload.config.ts:95`)**

| Global (Datei) | r/u | Aufbau |
|---|---|---|
| einstellungen (`payload/globals/Einstellungen.ts`) | T/I (162) | Hooks 163, Testmail 130-156. Reiter Firma (170), Öffnungszeiten (252), Termine (267: anzahlung, anzahlungMin, anzahlungMax, terminMinuten), Versand (305), Aufbewahrung (330: fahrzeugschein, schluesselfotos, grundrisse, projektunterlagen), Rechtstexte (343), Anbindungen (354) |
| richtwerte (`Richtwerte.ts`) | T/I (24) | Reiter tuerAbsicherung, serviceEinsatz (Spannen) |
| zylinderkatalog (`Zylinderkatalog.ts`) | T/I (18) | Grundwerte (25), Bauformen (38), Funktionen (77), Extras (101), Hersteller (128), Produktsicherheit (181) |

**3. Migrationen (`src/migrations/`, `index.ts:9-45`)**

Sieben `.ts`, sechs mit `.json`-Schnappschuss (nicht 20260924_042900):
- 20260924_001201_initial (169 Zeilen): Payload-Grundtabellen, benutzer, medien.
- 20260924_004222_datenmodell (1.678): Haupt- und Versionstabellen.
- 20260924_042804_auftraege_und_nachweise (225): Positionen, kundendateien, nachweise, webhook_ereignisse, richtwerte.
- 20260924_042900_sm24_tabellen (29): sm24_zaehler, sm24_ratenbegrenzung.
- 20261024_213449_livegang (227): vorgaenge_mails, widerrufe, interne_dateien, Zustimmungs-, Versand-, Zahlungs-, GPSR- und Firmenspalten.
- 20261025_132045_leitfaden (206): Freigabe- und Vermittlungsspalten, Zylinder-Hersteller, neue Enum-Werte (26-27).
- 20261025_132935_leitfaden_daten (140): idempotente Datenmigration.

Neue Migration: nicht dokumentiert. Payload-Standard `npm run payload -- migrate:create` (`package.json:14`, ungetestet). Anwendung `db:migrate` (`:19`). Auswahlwerte sind DB-Enums, neue Werte brauchen Migrationen (`20261025_132045_leitfaden.ts:26-27`).

**4. Datenpfad und JSON-Fallback**
- `mitDatenbank()` (`lib/umgebung.ts:39`): kein SM24_DATA=json und DATABASE_URL gesetzt. Weiche `lib/data/index.ts:28-29` (JsonFileAdapter oder PayloadAdapter, `payload-adapter.ts:53`).
- JSON: `json-adapter.ts:8-25` liest `content/`. Fehlt eine Datei, greift `lib/data/defaults/` (`:55-58`). Schreiben nur mit beschreibbarem Dateisystem (`:41`).
- content/*.json (Einträge): blocked-days 5, car-key-services 6, cities 1, code-lines 52, cylinder-catalog 10 Schlüssel, guides 8, pricing-groups 4, seo 26, service-pages 17, service-pricing 24, settings 6 Schlüssel, vehicles 12.
- Schnappschuss `content/startwerte/2026-10-25/` (14 Dateien): cities 6, seo 24, cylinder-catalog 9 Schlüssel, dazu nachweise 1 und standard-articles 8.
- Fehlt top-level: standard-articles.json. Seed (`payload/seed.ts:495`) und Notbetrieb nehmen dann `defaults/`. records.json bewusst nicht im Repo (`.gitignore:45`).
- Seed `payload/seed.ts`: Vermerke `sm24:seed-schluessel` und `sm24:seed-stand` (Kopf 1-30), `inhalteUebernehmen` (181), 12 Läufe für 11 Sammlungen (424-577), Globals (411, 416, 582), GLOBAL_ERGAENZUNGEN (598).
- Build (`scripts/build.mjs:151-169`): DB, Migrationen, Seed, Zugang, Livegang-Prüfung, Next-Build.

**5. Vorgänge**
- Arten (`art`, Vorgaenge.ts:131-144): bestellung, anfrage, termin, projekt, partner. Nummern `SM24-B|A|T|P|N-Jahr-0000` (`lib/reference.ts:3-17`), Zähler `sm24_zaehler` in der Vorgangs-Transaktion (`lib/data/index.ts:237-239`).
- Bereiche (9, `payload/fields/gemeinsam.ts:8-18`), Abläufe (4), Status (11, `payload/fields/vorgang-status.ts:8-20`). Backend ohne Übergangsregeln (`Vorgaenge.ts:150-158`).
- Automatisch: neu bei Anlage (`lib/server/create-record.ts:125`); terminiert (`lib/server/termin-verwaltung.ts:79, 144, 192`); in-fertigung nach Zahlung einer freigegebenen Fotoanfrage (`lib/zahlung/uebergaenge.ts:181-183`); storniert, wenn eine Termin-Anzahlung ausbleibt und der Status „neu“ ist (`uebergaenge.ts:228-230`, `abgleich.ts:94-96`). freigegeben nur von Hand (`Vorgaenge.ts:304-313`).
- Jeder Wechsel: interne Notiz (`hooks/vorgang-benachrichtigen.ts:158`), Kundentext nur bei Fotoprüfung (`lib/foto-freigabe.ts:45-63`), Mail nach `STATUS_MIT_MAIL` (`lib/mail/vorlagen/status.ts:15`).
- Bei Bestellungen ändert Zahlung den Status nicht (`uebergaenge.ts:169-175`, Ausnahme Fotoanfrage 181-183). Produktionsliste filtert nach Zahlungsstand (`lib/druckansichten.ts:258-265`).
- Zahlungsstand (`zahlung.status`, Vorgaenge.ts:520-528): offen (`create-record.ts:145`), bezahlt (`uebergaenge.ts:173`), fehlgeschlagen (`uebergaenge.ts:218`, `abgleich.ts:97`), erstattet (`uebergaenge.ts:312`).
- Zahlungslink: `/bestellung/<id>?t=…` (`lib/mail/vorlagen/freigabe.ts:28`). Stripe-Sitzung erst bei „Jetzt bezahlen“ (`lib/actions/zahlung.ts:93`).
- Anzahlung: Berechnung `lib/pricing.ts:63`, Deckel `:141`. Abweichung je Preisregel (`Preisregeln.ts:81-89`), sonst Standard `Einstellungen.ts:277-279`. Werte nicht übernommen.
- Doppelverbuchung: INSERT `webhook_ereignisse` mit ON CONFLICT (`lib/data/index.ts:460-471`).

**6. Integrationen**
- Stripe: Checkout `lib/integrations/stripe.ts:137-181`. Webhook `(site)/api/zahlung/stripe` (Signatur `stripe.ts:229-230`), Abgleich `(site)/api/cron/zahlungen` (03:47 UTC). Schalter `lib/umgebung.ts:177-180`: PAYMENT_PROVIDER, PAYMENT_API_KEY, PAYMENT_WEBHOOK_SECRET, PAYMENT_METHODS.
- Resend: `lib/mail/transport-resend.ts:157`, ohne SDK. Schalter `lib/umgebung.ts:146-158`: MAIL_PROVIDER, MAIL_API_KEY, MAIL_FROM_ADDRESS.
- Auslöser (`lib/server/benachrichtigungen.ts`): Eingang Kunde und Betrieb (93), Zahlung (144), Vertrag (243), Status (262), Widerruf an Kunde und Betrieb (309, 348). Erinnerung per Cron (`lib/server/termin-erinnerungen.ts`), Testmail (`Einstellungen.ts:130-156`). Vorlagen `lib/mail/vorlagen/` (10). Protokoll: `mails` (`Vorgaenge.ts:562-597`).
- S3: `dateiablage()` `lib/umgebung.ts:87-99` (STORAGE_BUCKET, _ACCESS_KEY, _SECRET_KEY, _REGION, _ENDPOINT). SM24_STORAGE=lokal schaltet ab (`:88`). Plugin `payload.config.ts:121-145`.
- GA4: NEXT_PUBLIC_GA_MEASUREMENT_ID (`lib/statistik.ts:9-13`), `(site)/layout.tsx:102-104`. Consent Mode v2, Standard „verweigert“ (`components/statistik/google-analytics.tsx:77`), Laden nur mit Einwilligung (`:70`).

**7. Uploads**
- POST `(site)/api/kunden-upload/route.ts:61-139`: Herkunft (45-54), Rate (74, `lib/server/rate-limit.ts:36`), Größe (83), Magic Bytes (`lib/server/datei-pruefung.ts:73-80`, pruefeDatei 98-126), Name säubern (135-149). Gespeichert wird nur der Schlüssel-Hash (`lib/server/kundendateien.ts:111-135`).
- Maximal 4 MB (`datei-pruefung.ts:36-37`). PDF nur bei fahrzeugschein, grundriss, dokument (`:29`).
- Zuordnung beim Absenden: `verknuepfeKundendateien` (`kundendateien.ts:163-209`, `create-record.ts:476-477`).
- Aufräumen: GET `(site)/api/cron/taeglich/route.ts:22-63` (CRON_SECRET, `lib/server/cron-zugriff.ts:23-37`) ruft `bereinigeKundendateien` (`kundendateien.ts:312-321`). Löschung bei abgelaufener Frist oder nie zugeordnet nach 24 Stunden (`:30`, `:223-258`). Manuell `aufbewahrung:bereinigen` (`package.json:26`).
- Fristen `Einstellungen.ts:330-339`, Zuordnung `kundendateien.ts:35-42`, Mapping `lib/data/payload-mapping.ts:778-783`. Werte nicht übernommen.

**8. PDFs und Druck**
- Keine PDF-Bibliothek in `package.json`. Druckblätter sind HTML, „als PDF speichern“ läuft über den Browser (`Vorgaenge.ts:188`). Vorgangsblatt `lib/druckansichten.ts:117`, Produktionsliste `:313`, Endpunkte `payload/hooks/druckansichten.ts:107-108`.
- Vorgangsblatt für alle Arten. Produktionsliste: bezahlte Bestellungen, nicht versendet, abgeschlossen oder storniert (`lib/druckansichten.ts:258-265`). Nur Team (`druckansichten.ts:46-48`).

**9. Admin**
- Dashboard `payload/components/Kennzahlen.tsx:20` (`payload.config.ts:61`): fünf Kennzahlen (`lib/kennzahlen.ts:32-38`).
- Keine eigenen Admin-Ansichten. Neun Komponenten in `payload/components/`, etwa VorgaengeWerkzeuge (`Vorgaenge.ts:110`) und Anbindungen (`Einstellungen.ts:357`).
- Rollen inhaber, mitarbeiter (`payload/access/rollen.ts:4-7`). Rollenfeld nur Inhaber (`Benutzer.ts:58`). Fünf Fehlversuche sperren 15 Minuten (`Benutzer.ts:21-23`). Keine offene Registrierung (`payload/hooks/benutzer-schutz.ts:34`).

**10. API-Routen (7 `route.ts`, plus Payload)**

| Route | Methoden | Schutz |
|---|---|---|
| `(payload)/api/[...slug]` | GET, POST, PUT, PATCH, DELETE, OPTIONS | Payload-Rechte, CSRF-Liste |
| `(site)/api/cron/taeglich` | GET | CRON_SECRET |
| `(site)/api/cron/zahlungen` | GET | CRON_SECRET |
| `(site)/api/kunden-upload` | POST | Herkunft, Rate, Magic Bytes |
| `(site)/api/zahlung/rueckkehr` | GET | Token, Sitzungsbezug, Rate |
| `(site)/api/zahlung/stripe` | POST | Stripe-Signatur, 512 KB |
| `llms.txt` | GET | statisch, öffentlich |

Payload-Endpunkte (7): Vorgaenge `bestaetigung-senden` (`payload/hooks/bestaetigung-senden.ts:97-99`), `termin-verschieben`, `telefontermin` (`termin-aktionen.ts:118-119`), `export` nur Inhaber (`:120`), `vorgangsblatt`, `produktionsliste` (`druckansichten.ts:107-108`); Global `einstellungen/testmail` nur Inhaber (`Einstellungen.ts:130-137`). Alle prüfen die Rolle selbst.

**11. Tests**
- Unit: 132 Dateien. DB: 15 Dateien. README.md:78-79 nennt 113 und 11: veraltet.
- Testhilfen `src/test/` (3 Dateien), `scripts/build.test.ts`. Keine Tests gestartet.

**12. Abhängigkeiten**
- Installiert: next 16.4.3, payload 3.90.2, react 19.2.4, stripe 22.6.2, framer-motion 12.40.0, tailwindcss 3.4.19, zod 4.6.7.
- Ohne Import im Quelltext: react-hook-form, @hookform/resolvers, framer-motion.
- Doppelt: schema-dts (`package.json:49, 66`). Abweichend: @types/node ^20 bei engines 22.x (`:56, 30`), eslint-config-next 16.2.7 neben next 16.4.3 (`:64, 44`).
- graphql ist Peer von payload (`node_modules/payload/package.json:23-24`). Kein Befund.

**13. Lücken gegen das Gespräch**

| Thema | Stand | Fundstelle |
|---|---|---|
| Fahrzeugkatalog (Marke, Modell, Baujahr) | vorhanden, nur Autoschlüssel | `Fahrzeugmarken.ts:17, 27-80` |
| Versand, Versandschein | teilweise: Versandarten als Daten. Versandschein und Anbindung fehlen | `Einstellungen.ts:305-326`; `Vorgaenge.ts:443-455` |
| Partner, Provision | teilweise: Felder da, keine Abrechnung, CSV ohne Provision | `Vorgaenge.ts:339-374`; `lib/vorgaenge-csv.ts:15-30` |
| Schließplan, Schließmatrix | fehlt als Daten, nur Upload und Grafik | `projekt-konfigurator.tsx:550-551`; `visual/generators/schliessplan.tsx:477-480` |
| Rubriken als Daten | fehlt, Bereiche im Code | `payload/fields/gemeinsam.ts:8-18`; `lib/navigation.ts:35` |
| Hub „Wobei können wir Ihnen helfen?“ | teilweise, Titel ohne „Ihnen“ | `(site)/page.tsx:221` |
| Konfigurator-Kern | vorhanden: Zylinderkatalog, drei Konfiguratoren | `Zylinderkatalog.ts:15`; `lib/pricing.ts:181` |
| Vorgangsblatt | vorhanden | `lib/druckansichten.ts:117` |
| Partner-Modelle | keine eigene Sammlung, Vorgang der Art partner | `Vorgaenge.ts:141` |

## PRÜFUNG UND ERGEBNIS
- 18 Sammlungen, 3 Globals, 7 `route.ts`, 7 Payload-Endpunkte, 7 Migrationen erfasst. `content/`: 12 Dateien, Schnappschuss 14 (jq).
- Keine Datei geändert. Nur Lesebefehle; `node -p` nur für Versionen.

## BELEGE
Jede Angabe trägt Datei und Zeile.

## OFFENE FRAGEN
1. `content/standard-articles.json` fehlt, Schnappschuss hat 8 Einträge. Pflegen?
2. `content/cities.json` hat 1 Eintrag, Schnappschuss 6. Bewusst?
3. Zahlung ändert bei Bestellungen den Status nicht. Gewollt?
4. `modelle.slug` (`Fahrzeugmarken.ts:37`) ohne Prüfmuster.
5. README-Testzahlen veraltet (Abschnitt 11).

=== ENDE E0-KUNDSCHAFTER-01 · BEREIT ZUR RÜCKGABE ===
