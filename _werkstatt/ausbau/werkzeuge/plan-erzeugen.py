#!/usr/bin/env python3
"""Erzeugt PLAN.json einmalig aus dieser Quelle (E2). Danach ist PLAN.json die Quelle der
Wahrheit; Status, Versuche und Commits setzt nur noch plan.mjs setze.

Aufruf: python3 -I _werkstatt/ausbau/werkzeuge/plan-erzeugen.py [--schreiben]
Ohne --schreiben nur Prüfung und Zählung.
"""
import json, sys, subprocess, datetime, os, collections

WURZEL = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
AUSBAU = os.path.join(WURZEL, '_werkstatt', 'ausbau')

HAIKU, OPUS = 'haiku-5.5', 'opus-5.5'
P_LIST = []

def P(kennung, titel, etappe, welle, rolle, modell, stufe, klasse, schreib, deps=(), anf=(), krit=(),
      art='pflicht', wirkung=3, massstab=None, muster=None, status='offen', grund=None):
    P_LIST.append(dict(kennung=kennung, titel=titel, etappe=etappe, welle=welle, rolle=rolle, modell=modell,
                       stufe=stufe, kostenklasse=klasse, schreibrechte=list(schreib), abhaengigkeiten=list(deps),
                       anforderungen=list(anf), kriterien=list(krit), art=art, wirkung=wirkung,
                       status=status, grund=grund, versuche=0, commit=None, massstab=massstab, muster=muster))

W = '_werkstatt/ausbau/'
MP = W + 'pakete/'          # Paketdateien
MUSTER_PAKET = W + 'pakete/_GEMEINSAM.md'

# ---------------------------------------------------------------- Etappen
ETAPPEN = [
  dict(kennung='E0', ziel='Start, Datenweiche, Werkzeuge, Lagebild, Anforderungs-Spur, Vorher-Stand', eingang='Auftrag', ausgang='LAGEBILD.md, ANFORDERUNGEN.json, Vorher-Protokolle', tor='Bestand belegt grün (E0-PRUEFER-01), Vorher-Stand Prüfstufe B in Protokollen', kriterien=['Z-02', 'Z-20', 'Z-21'], tage=0.5),
  dict(kennung='E1', ziel='Fachwissen und Recherche', eingang='LAGEBILD.md', ausgang='FACHWISSEN.md, QUELLEN.md, WETTBEWERB.md, KARTE.md, KANTEN.md, LAGEBILD Suche', tor='jede Aussage mit Quelle, Gegenprüfung bestanden', kriterien=['Z-17'], tage=0.5),
  dict(kennung='E2', ziel='Plan, KERN v2, Abnahme', eingang='E0, E1', ausgang='KERN.md v2, PLAN.json, ABNAHME.md', tor='plan.mjs pruefen OK; jeder Befund aus E2-PRUEFER-01 und E2-PRUEFER-02 als Planänderung umgesetzt oder in ENTSCHEIDUNGEN.md begründet verworfen; höchstens zwei Runden', kriterien=['Z-01'], tage=0.3),
  dict(kennung='E3', ziel='Fundament: Datenmodelle, Kernlogik, Designsystem, Bewegung, PDF, Versand, Fahrzeuge, Konfigurator-Kern, Partner, Uploads', eingang='PLAN.json', ausgang='Kernsysteme mit Tests', tor='Prüfstufe B, Bestand mindestens wie in E0, Datenweiche belegt', kriterien=['Z-02', 'Z-06', 'Z-07', 'Z-08', 'Z-09', 'Z-12', 'Z-20'], tage=1.5),
  dict(kennung='E4', ziel='Referenz: Startseite mit Intent-Hub, Inszenierung, Navigation G-08, Übergang, Autoschlüssel-Weg', eingang='E3', ausgang='Referenzansichten', tor='Prüfstufe B, Jury Start mindestens 8,5 und Weg mindestens 8, Personas ohne Abbruch, Blind- und Dominanzprobe Start', kriterien=['Z-04', 'Z-05', 'Z-11', 'Z-12', 'Z-14', 'Z-15'], tage=1.0),
  dict(kennung='E5', ziel='Konfiguratoren Sperrschließung und Schließanlage', eingang='E3-Konfigurator-Kern, Referenz', ausgang='Konfiguratoren mit Schließplan-PDF', tor='Prüfstufe B, Tests jeder Regel, Probelauf Hausverwaltung', kriterien=['Z-05', 'Z-06'], tage=1.0),
  dict(kennung='E6', ziel='Übrige Rubriken, gemeinsamer Abschluss, Einsenden und Versand', eingang='Referenz, Versand-Adapter', ausgang='alle Wege nach Abschnitt 11', tor='Prüfstufe B, Probelauf aller neuen Wege', kriterien=['Z-05', 'Z-08', 'Z-19'], tage=1.0),
  dict(kennung='E7', ziel='Partnernetz, Einsatzgebiet, Karte, Stadt-Hub-Vorlage', eingang='Partner-Modelle', ausgang='Partnerwege, Karte', tor='Prüfstufe B, axe Karte, Stadt-Hubs noindex', kriterien=['Z-09', 'Z-10'], tage=1.0),
  dict(kennung='E8', ziel='Inhalte, Suche, KI-Antworten, Agenturnennung, Logo-Konzepte, AUSSEN.md', eingang='KARTE.md, FACHWISSEN.md', ausgang='Schlüsselseiten, Strukturdaten, Texte ohne KI-Spuren', tor='Prüfstufe B, Faktenprüfung, Dominanzprobe Schlüsselseiten', kriterien=['Z-11', 'Z-13', 'Z-16', 'Z-17', 'Z-18'], tage=1.0),
  dict(kennung='E9', ziel='Dashboard, Vorgangsblätter, Livegang-Prüfung, Bögen, Aufbewahrung, Konzepte für später', eingang='alle Wege', ausgang='Werkzeuge des Inhabers', tor='Prüfstufe B, Probelauf im Admin', kriterien=['Z-19', 'Z-20'], tage=0.8),
  dict(kennung='E10', ziel='Kür aus dem Vorrat nach Wirkung', eingang='Pflicht erledigt', ausgang='Kür', tor='Vorrat leer oder LAUFZEIT erreicht (Einstellung: bis Pflicht und Kür erfüllt, also Vorrat leer); Prüfstufe B der Kür', kriterien=['Z-01', 'Z-11'], tage=1.0),
  dict(kennung='EA', ziel='Abschluss: Prüfstufe C, Endjury, Bericht, Archiv, Endprüfer', eingang='E0 bis E10', ausgang='BERICHT.md, Archiv docs/ausbau, Entwurfs-PR', tor='plan.mjs abschluss BEREIT, Endprüfer bestätigt', kriterien=['Z-01', 'Z-02', 'Z-03', 'Z-11', 'Z-13', 'Z-14', 'Z-15', 'Z-20', 'Z-21', 'Z-22'], tage=0.5),
]

# ---------------------------------------------------------------- E0 (weitgehend erledigt)
def hk(kennung, titel, welle, rolle, schreib, anf, krit, klasse='M', deps=(), status='committet', art='pflicht', wirkung=3, stufe=1):
    P(kennung, titel, kennung.split('-')[0], welle, rolle, HAIKU, stufe, klasse, schreib, deps, anf, krit, art, wirkung,
      massstab=MP + kennung + '.md', muster=MUSTER_PAKET, status=status)

P('E0-OPUS-01', 'Arbeitsordner, Auftrag, Leitstand, Wachhund, Herzschlag, Datenweiche mit Selbsttest', 'E0', 1, 'Orchestrator', OPUS, 3, 'M',
  [W + 'AUFTRAG.md', W + 'LEITSTAND.md', W + 'WACHHUND.md', W + 'werkzeuge/sicher.sh', W + 'werkzeuge/sicher.test.sh', 'CLAUDE.md', 'eslint.config.mjs', 'tsconfig.json', 'vitest.config.ts'],
  anf=['K-KT9'], krit=['Z-20', 'Z-21'], status='committet')
hk('E0-PRUEFER-01', 'Einrichtung und Bestandsaufnahme der Prüfwege', 1, 'Prüfer', [W + 'protokolle/einrichtung.md'], [], ['Z-02', 'Z-20'])
for n, t, f in [(1, 'Technik und Datenmodell', 'technik'), (2, 'Rubriken, Wege und Formulare', 'wege'), (3, 'Gestaltung, Bewegung, Icons und KERN 1.19', 'gestaltung'),
                (4, 'Inhalte, Seiten, Metadaten und Index-Steuerung', 'inhalte'), (5, 'Qualität und offene Punkte', 'qualitaet'), (6, 'Fremde Branches', 'branches')]:
    hk(f'E0-KUNDSCHAFTER-0{n}', t, 1, 'Kundschafter', [W + f'berichte/E0-KUNDSCHAFTER-0{n}-{f}.md'], [], ['Z-03'])
for n, t in [(1, 'Leitfaden Zeilen 1 bis 420'), (2, 'Leitfaden Zeilen 421 bis 849'), (3, 'Ergänzender Leitfaden, Menschensachen, Evaluierung')]:
    hk(f'E0-DATENPFLEGER-0{n}', 'Anforderungs-Spur: ' + t, 2, 'Datenpfleger', [W + f'erhebung/anforderungen-{["L1","L2","EL-M-E"][n-1]}.json'], [], ['Z-03'])
hk('E0-PRUEFER-02', 'Übernommene Werkzeuge in Gang setzen', 2, 'Prüfer', [W + 'werkzeuge/LIESMICH.md'], [], ['Z-02'])
hk('E0-PRUEFER-03', 'Werkzeuge Lighthouse, Kontaktbogen, Inventar, Snippet', 3, 'Prüfer', [W + 'werkzeuge/lighthouse.mjs', W + 'werkzeuge/inventar.mjs'], [], ['Z-15', 'Z-16'])
hk('E0-PRUEFER-04', 'Werkzeuge Slop-Scan, Stilprüfer, SVGO, Kontingent', 3, 'Prüfer', [W + 'werkzeuge/slopscan.mjs', W + 'werkzeuge/stil.mjs', W + 'werkzeuge/kontingent.mjs'], [], ['Z-13', 'Z-21'])
hk('E0-PRUEFER-05', 'Planwerkzeug plan.mjs und anforderungen.mjs', 3, 'Prüfer', [W + 'werkzeuge/plan.mjs', W + 'werkzeuge/anforderungen.mjs'], [], ['Z-01', 'Z-03'], klasse='L', stufe=2)
hk('E0-PRUEFER-06', 'Funktionsliste F-01 bis F-19 als Bestandsschutz', 3, 'Prüfer', [W + 'werkzeuge/funktionsliste.mjs'], [], ['Z-02'], stufe=2)
hk('E0-PRUEFER-07', 'Vorher-Stand B1: Bildsatz, axe, Konsole, Bewegung, Kontaktbögen', 4, 'Prüfer', [W + 'bilder/vorher/', W + 'protokolle/E0-vorher-a11y.json'], [], ['Z-04', 'Z-11', 'Z-14'], klasse='L', status='committet')
hk('E0-PRUEFER-08', 'Vorher-Stand B2: Lighthouse, Messung, Inventar, Snippets, Slop, Stil', 5, 'Prüfer', [W + 'SLOP-AUDIT.md', W + 'protokolle/E0-vorher-lighthouse-mobil.json'], [], ['Z-13', 'Z-15', 'Z-16'], klasse='L', deps=['E0-PRUEFER-07'], status='committet')
P('E0-OPUS-02', 'Lagebild, Menschen-Liste, Hauptansichten, Denkprotokolle A-001 bis A-008', 'E0', 4, 'Orchestrator', OPUS, 3, 'M',
  [W + 'LAGEBILD.md', W + 'MENSCHEN.md', W + 'ENTSCHEIDUNGEN.md', W + 'werkzeuge/lib.mjs'], anf=[], krit=['Z-03', 'Z-22'], status='abgenommen')

# ---------------------------------------------------------------- E1
for k, t, f, anf, krit, st in [
    ('E1-FACHKUNDLER-01', 'Schließtechnik: Systeme, Anlagenarten, ABUS und BKS', 'E1-schliesstechnik-systeme.md', ['G-27', 'G-28', 'G-30', 'G-32', 'G-09'], ['Z-06', 'Z-17'], 'committet'),
    ('E1-FACHKUNDLER-02', 'Schließtechnik: Normen, Schutzfunktionen, Bauformen, Messen', 'E1-schliesstechnik-normen.md', ['G-27', 'G-29', 'G-32', 'G-47'], ['Z-06', 'Z-17'], 'committet'),
    ('E1-FACHKUNDLER-03', 'Transponder und Klonbarkeit', 'E1-transponder.md', ['G-17', 'G-18'], ['Z-07'], 'committet'),
    ('E1-RECHERCHEUR-01', 'Fahrzeugdatenquellen mit Lizenz', 'E1-fahrzeugquellen.md', ['G-14', 'G-17'], ['Z-07'], 'committet'),
    ('E1-RECHERCHEUR-02', 'Versandwege für Einsenden und Rückversand', 'E1-versand.md', ['G-24', 'G-25'], ['Z-08'], 'abgenommen'),
    ('E1-RECHERCHEUR-03', 'Wettbewerb: Struktur, Abläufe, Preise', 'E1-wettbewerb.md', ['G-31', 'K-KA1', 'K-KA5'], ['Z-17'], 'offen'),
    ('E1-RECHERCHEUR-04', 'Lagebild Suche und KI-Antworten prüfen', 'E1-lagebild-suche.md', ['K-KT1', 'K-KT3', 'K-KT5', 'K-KL1'], ['Z-16'], 'offen'),
    ('E1-RECHERCHEUR-05', 'Nachfrage, Familien und Ergebnisbilder', 'E1-nachfrage.md', ['G-41', 'G-43'], ['Z-16', 'Z-17'], 'läuft'),
    ('E1-RECHERCHEUR-06', 'Kartendaten Hessen und Videofassade', 'E1-karte-video.md', ['G-42', 'G-44'], ['Z-10', 'Z-18'], 'offen'),
    ('E1-FACHKUNDLER-04', 'Gegenprüfung der Fachrecherchen und Lückenschlüsse', 'E1-gegenpruefung.md', ['G-27', 'G-29', 'G-32'], ['Z-17'], 'läuft')]:
    P(k, t, 'E1', 1 if k != 'E1-FACHKUNDLER-04' else 2, k.split('-')[1].capitalize() if 'FACH' not in k else 'Fachkundler', HAIKU, 1, 'M',
      [W + 'erhebung/' + f, W + 'berichte/' + k + '.md'], deps=(['E1-FACHKUNDLER-03'] if k == 'E1-FACHKUNDLER-04' else []),
      anf=anf, krit=krit, massstab=MP + k + '.md', muster=MUSTER_PAKET, status=st)
P('E1-OPUS-01', 'Verdichten: FACHWISSEN, QUELLEN, WETTBEWERB, KARTE, KANTEN, LAGEBILD Suche', 'E1', 3, 'Orchestrator', OPUS, 3, 'L',
  [W + 'FACHWISSEN.md', W + 'QUELLEN.md', W + 'WETTBEWERB.md', W + 'KARTE.md', W + 'KANTEN.md', W + 'LAGEBILD.md'],
  deps=['E1-FACHKUNDLER-04', 'E1-RECHERCHEUR-01', 'E1-RECHERCHEUR-02', 'E1-RECHERCHEUR-03', 'E1-RECHERCHEUR-04', 'E1-RECHERCHEUR-05', 'E1-RECHERCHEUR-06'],
  anf=['G-32', 'G-31', 'K-KT1', 'K-KT2', 'K-KT3', 'K-KT4', 'K-KT5', 'K-KT6', 'K-KT7', 'K-KT8', 'K-KT9', 'K-KA1', 'K-KA2', 'K-KA3', 'K-KA4', 'K-KA5', 'K-KA6', 'K-KA7', 'K-KA8', 'K-KA9', 'K-KK1', 'K-KK2', 'K-KK3', 'K-KK4', 'K-KK5', 'K-KE1', 'K-KE2', 'K-KE3', 'K-KE4', 'K-KE5', 'K-KE6', 'K-KE7', 'K-KL1', 'K-KL2', 'K-KL3', 'K-KL4'],
  krit=['Z-16', 'Z-17'])
hk('E1-AUTOR-01', 'Inhaber-Interview: 12 bis 20 Fragen je Rubrik für MENSCHEN.md', 3, 'Autor', [W + 'erhebung/E1-interview.md'], ['G-51'], ['Z-17'], deps=['E1-FACHKUNDLER-04'], status='offen')

# ---------------------------------------------------------------- E2
P('E2-OPUS-01', 'Leitidee und Systementscheidungen per Denkprotokoll, KERN.md Version 2', 'E2', 1, 'Orchestrator', OPUS, 3, 'L',
  [W + 'KERN.md', W + 'ENTSCHEIDUNGEN.md'], deps=['E1-FACHKUNDLER-03'], anf=['G-05', 'G-06', 'G-11', 'G-12', 'G-13', 'G-48', 'G-51'], krit=['Z-11', 'Z-12', 'Z-13'])
P('E2-OPUS-02', 'PLAN.json, PLAN.md, ABNAHME.md mit Z-01 bis Z-22 und Ausgangswerten', 'E2', 1, 'Orchestrator', OPUS, 3, 'L',
  [W + 'PLAN.json', W + 'PLAN.md', W + 'ABNAHME.md', W + 'werkzeuge/plan-erzeugen.py'], deps=['E2-OPUS-01', 'E0-PRUEFER-08'], anf=[], krit=['Z-01', 'Z-03', 'Z-22'])
hk('E2-PRUEFER-01', 'L0: plan.mjs pruefen und Checkliste des Plans', 2, 'Prüfer', [W + 'berichte/E2-PRUEFER-01.md'], [], ['Z-01'], deps=['E2-OPUS-02'], status='offen')
hk('E2-PRUEFER-02', 'L0: Vorab-Scheitern „Woran stockt der Lauf am dritten Tag?“', 2, 'Prüfer', [W + 'berichte/E2-PRUEFER-02.md'], [], ['Z-01', 'Z-21'], deps=['E2-OPUS-02'], status='offen')

# ---------------------------------------------------------------- E3 Fundament
def op(kennung, titel, etappe, welle, schreib, deps, anf, krit, klasse='L', art='pflicht', wirkung=4):
    P(kennung, titel, etappe, welle, 'Orchestrator', OPUS, 3, klasse, schreib, deps, anf, krit, art, wirkung)

op('E3-OPUS-01', 'Rubriken-Modell: Sammlung, Migration, content/rubriken.json, Datenweiche, Seed, Tests', 'E3', 1,
   ['src/payload/collections/Rubriken.ts', 'src/payload.config.ts', 'src/migrations/', 'content/rubriken.json', 'src/lib/types.ts', 'src/lib/data/', 'src/payload/seed.ts', 'src/lib/rubriken.ts', 'src/lib/rubriken.test.ts', 'src/payload/fields/gemeinsam.ts'],
   ['E2-PRUEFER-01'], ['G-01', 'G-03', 'G-10', 'G-11', 'G-38'], ['Z-03', 'Z-04'], wirkung=5)
op('E3-OPUS-02', 'Designsystem v2: OKLCH-Tokens mit Abstufungsregel, Typografie für Laien, Tippziele, Leuchten als System, Bereichsfarbe ohne Lila, Schriften lokal', 'E3', 1,
   ['tailwind.config.ts', 'src/app/(site)/globals.css', 'src/lib/visual/area-theme.ts', 'src/lib/visual/area-theme.test.ts', 'src/fonts/', 'src/app/(site)/layout.tsx', 'src/app/(site)/layout.test.ts', 'src/lib/design-tokens.test.ts', 'src/app/global-error.tsx', 'src/app/manifest.ts', 'src/lib/og/bereichsbild.tsx', 'src/lib/og/bereichsbild.test.ts', W + 'werkzeuge/slopscan.mjs', W + 'KERN.md'],
   ['E2-PRUEFER-01'], ['G-05', 'G-06'], ['Z-11', 'Z-13', 'Z-14'], wirkung=5)
op('E3-OPUS-03', 'Bewegungsmodul mit Schalter „Bewegung an oder ruhig“, Inline-Startskript, data-motion-Register, Pause-Baustein', 'E3', 2,
   ['src/lib/bewegung.ts', 'src/lib/bewegung.test.ts', 'src/components/visual/motion/', 'src/components/layout/site-footer.tsx', 'src/components/layout/bewegung-schalter.tsx'],
   ['E3-OPUS-02'], ['G-06'], ['Z-12'], wirkung=4)
op('E3-OPUS-04', 'Vorgangsblatt-System als PDF (pdfkit) mit Anhang an Benachrichtigungen und Abruf im Admin', 'E3', 2,
   ['package.json', 'package-lock.json', 'next.config.ts', 'src/lib/pdf/', 'src/lib/server/benachrichtigungen.ts', 'src/lib/mail/transport-resend.ts', 'src/payload/hooks/druckansichten.ts'],
   ['E2-PRUEFER-01'], ['G-37'], ['Z-19'], wirkung=4)
op('E3-OPUS-05', 'Versand-Adapter: Schnittstelle, Attrappe, Begleitschein-PDF, Anbieter hinter Umgebungsvariablen, Aufpreise aus Einstellungen', 'E3', 3,
   ['src/lib/versand/', 'src/payload/globals/Einstellungen.ts'], ['E3-OPUS-04'], ['G-24', 'G-25'], ['Z-08'], wirkung=4)
op('E3-OPUS-06', 'Fahrzeugkatalog-Modell: Baureihe, Baujahre, Schlüsselarten, Transponder mit Quelle, Klonbarkeit, Gehäuse, Leistungen, Suche mit Tippfehlertoleranz', 'E3', 3,
   ['src/payload/collections/Fahrzeugmarken.ts', 'src/lib/fahrzeuge/', 'content/vehicles.json', 'src/payload.config.ts', 'src/migrations/', 'src/payload-types.ts', 'src/payload/seed.ts'], ['E3-OPUS-01'], ['G-14', 'G-15', 'G-17', 'G-18'], ['Z-07'], wirkung=5)
op('E3-OPUS-07', 'Konfigurator-Kern: Systemdaten, Schließplan, Matrix mit Vorlagen, Preisfunktion über die vorhandenen Preisregeln (Preiswerte unverändert, G9), Maßprüfung, Zwischenstand per Link', 'E3', 4,
   ['src/lib/konfigurator/', 'src/payload/globals/Zylinderkatalog.ts', 'content/cylinder-catalog.json', 'src/payload.config.ts', 'src/migrations/', 'src/payload-types.ts', 'src/payload/seed.ts'], ['E3-OPUS-06'], ['G-27', 'G-28', 'G-29'], ['Z-06'], wirkung=5)
op('E3-OPUS-08', 'Partner-Modelle: Statusautomat Bewerbung, Vermittlungszustände, Abrechnung A und B als reine Funktionen, Zugriffsrechte', 'E3', 5,
   ['src/lib/partner/', 'src/payload/collections/Partner.ts', 'src/payload/access/', 'src/payload.config.ts', 'src/migrations/', 'src/payload-types.ts', 'src/payload/seed.ts'], ['E3-OPUS-07'], ['G-39', 'G-40'], ['Z-09', 'Z-20'], wirkung=4)
op('E3-OPUS-09', 'Uploads: neue Kategorien, Pflicht-Uploads und Nachweise serverseitig je Weg, Fristen je Zweck', 'E3', 3,
   ['src/lib/server/datei-pruefung.ts', 'src/lib/server/kundendateien.ts', 'src/lib/server/unterlagen-pflicht.ts', 'src/lib/actions/records.ts', 'src/lib/actions/orders.ts'],
   ['E3-OPUS-04'], ['G-36'], ['Z-05', 'Z-20'], wirkung=5)
op('E3-OPUS-10', 'Übernahmen aus fremden Branches nach Denkprotokoll (Stripe-API-Version, JSON-LD-Detailseiten); Zahlungsverhalten unverändert, mit Test (G9)', 'E3', 2,
   ['src/lib/integrations/stripe.ts', '.github/dependabot.yml', 'src/app/(site)/sicherheitstechnik/[slug]/page.tsx', 'src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx'],
   ['E2-PRUEFER-01'], [], ['Z-02', 'Z-16'], klasse='M', wirkung=2)
hk('E3-UPGRADE-01', 'Sicherheits- und Minor-Updates (React 19.3, eslint-config-next 16.4, npm audit ohne Major)', 6, 'Prüfer', ['package.json', 'package-lock.json'], [], ['Z-02'], deps=['E3-OPUS-08', 'E3-OPUS-09', 'E3-OPUS-10'], status='offen', stufe=2)
hk('E3-GRAFIKER-01', 'Neue Fach-Icons der Familie: Motorradschlüssel, Gehäuse, Transponder-Kopie, Schlüsselfinder, Vor-Ort, Karte, Video, Pause, Bewegung', 1, 'Grafiker',
   ['src/components/visual/icons/motorradschluessel.tsx', 'src/components/visual/icons/schluesselgehaeuse.tsx', 'src/components/visual/icons/transponder-kopie.tsx', 'src/components/visual/icons/schluesselfinder.tsx', 'src/components/visual/icons/vor-ort.tsx', 'src/components/visual/icons/karte.tsx', 'src/components/visual/icons/video.tsx', 'src/components/visual/glyphen/pause.tsx', 'src/components/visual/glyphen/bewegung.tsx', 'src/components/visual/icons/icons.test.tsx', 'src/components/visual/glyphen/glyphen.test.tsx'],
   ['G-03', 'G-47'], ['Z-11', 'Z-13'], deps=['E2-PRUEFER-01'], status='offen', stufe=2)
hk('E3-DATENPFLEGER-01', 'Fahrzeugdaten-Import aus offenen Quellen mit Quelle je Eintrag und Abdeckungsmessung', 4, 'Datenpfleger', ['scripts/fahrzeuge-import.mjs', 'scripts/fahrzeuge-import.test.ts', 'content/fahrzeugkatalog.json', W + 'protokolle/E3-abdeckung.md'], ['G-14'], ['Z-07'], deps=['E3-OPUS-06'], status='offen', klasse='L', stufe=2)
hk('E3-DATENPFLEGER-02', 'Kartendaten Hessen aufbereiten (Kreise, Gemeinden, Lizenzvermerk) als vereinfachte Formen', 1, 'Datenpfleger', ['scripts/karte-aufbereiten.mjs', 'content/karte/'], ['G-42'], ['Z-10'], deps=['E2-PRUEFER-01', 'E1-RECHERCHEUR-06'], status='offen', stufe=2)
hk('E3-DATENPFLEGER-03', 'Erhebungsbögen PREISE, KLONBAR, SORTIMENT, PRODUKTE, PARTNER als CSV und Druckseite mit Vorschlägen', 1, 'Datenpfleger', [W + 'erhebung/boegen/'], ['G-18', 'G-22', 'G-33', 'G-40'], ['Z-19'], deps=['E2-PRUEFER-01'], status='offen', stufe=2)
hk('E3-PRUEFER-01', 'Prüfstufe B Etappe E3 (Build beide Modi, Tests, Funktionsliste, axe, Bildsatz, Datenweiche)', 7, 'Prüfer', [W + 'berichte/E3-PRUEFER-01.md'], [], ['Z-02', 'Z-20'], deps=['E3-UPGRADE-01', 'E3-DATENPFLEGER-01'], status='offen', klasse='L')

# ---------------------------------------------------------------- E4 Referenz
op('E4-OPUS-01', 'Startseite: Intent-Hub im ersten Bildschirm mit zwölf Kacheln aus den Rubriken, Frage, Satz, Anrufen, Code-Motiv', 'E4', 1,
   ['src/app/(site)/page.tsx', 'src/components/hub/', 'src/components/visual/fach-icon.tsx', 'src/app/(site)/globals.css', 'tailwind.config.ts', 'src/lib/data/defaults/rubriken.ts'], ['E3-PRUEFER-01'], ['G-01', 'G-02', 'G-03', 'G-05', 'G-13', 'G-43'], ['Z-04', 'Z-11'], wirkung=5)
op('E4-OPUS-02', 'Eingangsinszenierung: Autoschlüssel fährt in den Zylinder, Zylinder wird Schließanlage; kürzerer Schlüssel, Dauerschleife mit Pause', 'E4', 2,
   ['src/components/visual/inszenierung/', 'src/components/visual/generators/profilschnitt.tsx', 'src/components/visual/generators/profilschnitt.test.tsx'], ['E4-OPUS-01'], ['G-04', 'G-06', 'G-07'], ['Z-04', 'Z-12'], wirkung=5)
op('E4-OPUS-03', 'Navigation nach G-08 aus den Rubriken (Kopf, Megamenü, Schublade, Fuß), Anrufen und Rückruf in einem Schritt', 'E4', 2,
   ['src/lib/navigation.ts', 'src/lib/navigation.test.ts', 'src/components/layout/site-header.tsx', 'src/components/layout/mobile-action-bar.tsx', 'src/components/layout/site-footer.tsx', 'src/components/layout/site-footer.test.tsx', 'src/app/(site)/layout.tsx'], ['E4-OPUS-01'], ['G-08', 'G-09', 'G-11'], ['Z-04', 'Z-05'], wirkung=5)
op('E4-OPUS-04', 'Übergang Kachel zu Rubrik (gemeinsames Element, Rückfall, Fokus auf h1), Rubrikkopf, „So läuft Ihr Auftrag ab“ aus Daten', 'E4', 3,
   ['src/components/rubrik/', 'src/components/visual/motion/seitenwechsel.tsx', 'src/components/layout/page-header.tsx', 'src/app/(site)/autoschluessel/page.tsx', 'src/app/(site)/schluessel-nach-code/page.tsx', 'src/app/(site)/schluessel-nach-vorlage/page.tsx', 'src/app/(site)/schluessel-einschicken/page.tsx', 'src/app/(site)/gleichschliessende-zylinder/page.tsx', 'src/app/(site)/schliessanlagen/page.tsx', 'src/app/(site)/elektronische-zutrittsloesungen/page.tsx', 'src/app/(site)/sicherheitstechnik/page.tsx', 'src/app/(site)/service-und-termin/vor-ort/page.tsx'], ['E4-OPUS-03'], ['G-04', 'G-10'], ['Z-12'], wirkung=4)
op('E4-OPUS-05', 'Autoschlüssel-Weg auf Zielniveau: Fahrzeugwahl aus dem Katalog, nicht gefunden als Anfrage, Fahrzeugschein, Schlüsselbild, Anzahlung, Termin (Anzahlungs- und Zahlungsverhalten unverändert, mit Test, G9)', 'E4', 3,
   ['src/app/(site)/autoschluessel/', 'src/components/autoschluessel/', W + 'pakete/_MUSTER-REFERENZ.md'], ['E4-OPUS-03'], ['G-14', 'G-15', 'G-16', 'G-17'], ['Z-05', 'Z-07'], wirkung=5)
hk('E4-TEXTER-01', 'Texte Hub, Kacheln, Autoschlüssel-Rubrik nach Muster ohne KI-Spuren, Längen gemessen', 4, 'Texter', ['content/rubriken.json', 'content/seo.json'], ['G-48', 'G-03'], ['Z-13'], deps=['E4-OPUS-05'], status='offen', stufe=2)
hk('E4-PROBENUTZER-01', 'Probelauf Startseite und Autoschlüssel-Weg mit vier Personas, mobil und Desktop', 5, 'Probenutzer', [W + 'berichte/E4-PROBENUTZER-01.md'], [], ['Z-05'], deps=['E4-TEXTER-01'], status='offen')
hk('E4-PRUEFER-01', 'Prüfstufe B Etappe E4 mit Bildfolgen der Inszenierung, Framezeiten, Lighthouse, axe', 5, 'Prüfer', [W + 'berichte/E4-PRUEFER-01.md'], [], ['Z-04', 'Z-12', 'Z-14', 'Z-15'], deps=['E4-TEXTER-01'], status='offen', klasse='L')
P('E4-JURY-01', 'Jury Referenztor (frischer Opus): Studio-Wert Startseite und Autoschlüssel-Weg', 'E4', 6, 'Jury', OPUS, 3, 'L', [W + 'berichte/E4-JURY-01.md'], ['E4-PRUEFER-01', 'E4-PROBENUTZER-01'], [], ['Z-11'], wirkung=4)
hk('E4-DOKUMENTAR-01', 'Unterlagen der Blind- und Dominanzprobe der Startseite: vier neutral benannte Startseitentexte, Faktenblatt, Zuordnung getrennt', 5, 'Dokumentar', [W + 'daten/E4-blind-startseite.md', W + 'daten/E4-blind-schluessel.md', W + 'berichte/E4-DOKUMENTAR-01.md'], [], ['Z-17'], deps=['E4-TEXTER-01'], status='offen')
P('E4-BLIND-01', 'Blind- und Dominanzprobe der Startseite (frischer Opus)', 'E4', 6, 'Jury', OPUS, 3, 'L', [W + 'berichte/E4-BLIND-01.md'], ['E4-PRUEFER-01', 'E4-DOKUMENTAR-01'], [], ['Z-17'], wirkung=3)
# Zweiter Anlauf am Tor E4 (Befunde E4-JURY-01, E4-BLIND-01, E4-PROBENUTZER-01, Sichtabnahme; Auftrag 18: höchstens zwei Anläufe)
op('E4-OPUS-06', 'Zweiter Anlauf Startseite: Hub-Kacheln in der Zeichensprache, Autoschlüssel ab Tablet als Leitkachel (vier je Reihe, G-02), Bühne füllt die rechte Spalte mit Pausenknopf in der Bühne, Floskeln und Gedankenstriche, Berechtigungsnachweis im Ablauf (R13), Gleichschließung von der Schließanlage getrennt', 'E4', 7,
   ['src/app/(site)/page.tsx', 'src/components/hub/', 'src/components/visual/inszenierung/', 'src/components/visual/fach-icon.tsx', 'src/app/(site)/globals.css', 'tailwind.config.ts', 'content/rubriken.json', 'src/lib/data/defaults/rubriken.ts'],
   ['E4-JURY-01', 'E4-BLIND-01'], ['G-02', 'G-03', 'G-04', 'G-05', 'G-48'], ['Z-04', 'Z-11'], wirkung=5)
op('E4-OPUS-07', 'Zweiter Anlauf /autoschluessel: Aufbauzeichnung des Autoschlüssels (Bart, Transponder, Funkteil, Gehäuse) mit Bezug zu den Leistungen statt Begriffsliste und doppelter Typenzeichnungen, Ablauf direkt unter dem Kopf, Überschriften ohne KI-Spur', 'E4', 7,
   ['src/app/(site)/autoschluessel/page.tsx', 'src/components/visual/generators/autoschluessel-aufbau.tsx', 'src/components/visual/generators/autoschluessel-aufbau.test.tsx', 'src/components/rubrik/'],
   ['E4-JURY-01'], ['G-07', 'G-10', 'G-13'], ['Z-04', 'Z-11'], wirkung=5)
op('E4-OPUS-08', 'Zweiter Anlauf Assistent: Etappen statt Schrittzählung, Treffer vorauswählen und Weiter freigeben, Zurück beschriftet, Kopf mobil verdichtet, KBA-Zeile ans Ende; ohne eigene Fotos ohne Abbruch (Anrufen oder Termin zur Sichtprüfung über die vorhandene Anfrage), Pflichtfotos und Zahlverhalten unverändert (G9)', 'E4', 7,
   ['src/app/(site)/autoschluessel/anfrage/', 'src/components/autoschluessel/', 'src/components/flow/', 'src/lib/flow/', 'src/components/layout/page-header.tsx', W + 'testdaten/'],
   ['E4-JURY-01', 'E4-PROBENUTZER-01'], ['G-14', 'G-15', 'G-16'], ['Z-05'], wirkung=5)
hk('E4-PRUEFER-02', 'Prüfung des zweiten Anlaufs: Build beide Modi, ganze Testsuite, Funktionsliste, axe, Hub-Messung, Bildsatz und Referenzbilder der drei Ansichten, Bildfolge B-31', 8, 'Prüfer', [W + 'berichte/E4-PRUEFER-02.md'], [], ['Z-04', 'Z-12', 'Z-14'], deps=['E4-OPUS-06', 'E4-OPUS-07', 'E4-OPUS-08'], status='offen', klasse='L')
hk('E4-PROBENUTZER-02', 'Probelauf zweiter Anlauf: vier Personas mobil und Desktop mit erfundenen Testbildern bis vor die Zahlung, ohne Abbruch', 8, 'Probenutzer', [W + 'berichte/E4-PROBENUTZER-02.md'], [], ['Z-05'], deps=['E4-OPUS-06', 'E4-OPUS-07', 'E4-OPUS-08'], status='offen')
P('E4-JURY-02', 'Jury zweiter Anlauf (frischer Opus, ohne Kenntnis des ersten Urteils)', 'E4', 9, 'Jury', OPUS, 3, 'L', [W + 'berichte/E4-JURY-02.md'], ['E4-PRUEFER-02', 'E4-PROBENUTZER-02'], [], ['Z-11'], wirkung=4)
# Tor E4 nach zwei Anläufen nicht erreicht (A-026): Lücke als offener Punkt, Befunde aus E4-JURY-02 als letzte Runde je Ansicht und Kategorie (Auftrag 16)
op('E5-OPUS-05', 'Referenz-Feinschliff nach E4-JURY-02 (letzte Runde je Ansicht und Kategorie): Bühne mit erkennbarem Autoschlüssel und gefüllter Fläche, Kacheltitel ohne Trennung, Nummern nur bei echten Abfolgen, „Warum wir“ im Autoschlüssel-Abschnitt; Assistent mit einem Zähler, „Vorhandene Schlüssel“, kürzerem Kopf mobil und ruhigerem Fotoschritt', 'E5', 2,
   ['src/app/(site)/page.tsx', 'src/components/hub/', 'src/components/visual/inszenierung/', 'src/app/(site)/autoschluessel/page.tsx', 'src/app/(site)/autoschluessel/anfrage/', 'src/components/flow/flow-shell.tsx', 'src/components/forms/photo-upload.tsx', 'src/components/autoschluessel/optionen.ts', 'content/seo.json', 'src/lib/data/defaults/content.ts'],
   ['E4-JURY-02', 'E5-GRAFIKER-02'], ['G-02', 'G-04', 'G-05', 'G-16'], ['Z-04', 'Z-11'], klasse='M', wirkung=4)
hk('E5-GRAFIKER-02', 'Beispielzeichnungen je Fotoansicht im Autoschlüssel-Fotoschritt (Vorderseite, Rückseite mit Aufdruck, Bart seitlich, Nummer in Nahaufnahme) als SVG nach dem Formsystem', 1, 'Grafiker', ['src/components/visual/generators/schluessel.tsx', 'src/components/visual/generators/schluessel.test.tsx', 'src/components/autoschluessel/optionen.ts'], ['G-16'], ['Z-11'], deps=['E4-JURY-02'], status='offen', stufe=2)

# ---------------------------------------------------------------- E5 Konfiguratoren
op('E5-OPUS-01', 'Schließanlagen-Konfigurator: Zylinder und Schlüssel hinzufügen, Matrix, laufender Gesamtpreis, Liste, Speichern, Kasse oder Projektanfrage', 'E5', 1,
   ['src/app/(site)/schliessanlagen/konfigurator/', 'src/components/konfigurator/', 'src/lib/konfigurator/', 'src/app/(site)/schliessanlagen/page.tsx'], ['E4-JURY-01', 'E4-BLIND-01', 'E1-OPUS-01'], ['G-27', 'G-30', 'G-35'], ['Z-05', 'Z-06'], wirkung=5)
op('E5-OPUS-02', 'Sperrschließung auf demselben Kern: Sets 2 bis 10 (mehr auf Anfrage, Bestand bis 30), jeder Zylinder einzeln, Schlüsselzahl', 'E5', 2,
   ['src/app/(site)/gleichschliessende-zylinder/konfigurator/'], ['E5-OPUS-01'], ['G-28', 'G-09'], ['Z-06'], wirkung=5)
op('E5-OPUS-03', 'Schließplan als PDF und Vorgang mit vollständigem Schnappschuss', 'E5', 2, ['src/lib/pdf/schliessplan.ts', 'src/lib/pdf/schliessplan.test.ts', 'src/lib/konfigurator/vorgang.ts', 'src/lib/konfigurator/vorgang.test.ts', 'src/lib/konfigurator/zwischenstand.ts', 'src/lib/pdf/vorgangsblatt.ts', 'src/lib/actions/records.ts', 'src/lib/actions/security.test.ts', 'src/lib/server/rate-limit.ts', 'src/components/konfigurator/schliessplan-planer.tsx', 'src/app/(site)/schliessanlagen/konfigurator/schliessplan/pdf/'], ['E5-OPUS-01'], ['G-27', 'G-37'], ['Z-06', 'Z-19'], klasse='M')
hk('E5-GRAFIKER-01', 'Messhilfe-Grafik Maß A und B mit Stulpschraube, Beschlag, Überstand (SVG nach Formsystem)', 1, 'Grafiker', ['src/components/visual/generators/zylinder-mass.tsx', 'src/components/visual/generators/zylinder-mass.test.tsx'], ['G-29', 'G-47'], ['Z-06'], deps=['E4-JURY-01'], status='offen', stufe=2)
hk('E5-AUTOR-01', 'Messhilfe-Text, Plausibilitätshinweise, Laienerklärung Sperrschließung gegen Schließanlage mit Beispiel, Empfehlung Privat oder Unternehmen', 3, 'Autor', ['src/lib/konfigurator/masse.ts', 'src/lib/konfigurator/vorlagen.ts', 'src/components/konfigurator/schliessplan-planer.tsx', 'src/components/konfigurator/schliessplan-editor.tsx', 'src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx', '_werkstatt/ausbau/berichte/E5-AUTOR-01.md'], ['G-09', 'G-29', 'G-30'], ['Z-06', 'Z-17'], deps=['E5-OPUS-02'], status='offen', stufe=2)
hk('E5-PROBENUTZER-01', 'Probelauf Konfiguratoren mit Hausverwaltung (20 Türen) und Rentnerin', 4, 'Probenutzer', [W + 'berichte/E5-PROBENUTZER-01.md'], [], ['Z-05', 'Z-06'], deps=['E5-AUTOR-01', 'E5-OPUS-03'], status='offen')
hk('E5-PRUEFER-01', 'Prüfstufe B Etappe E5, Prüfliste G-27 bis G-30', 4, 'Prüfer', [W + 'berichte/E5-PRUEFER-01.md'], [], ['Z-06', 'Z-14'], deps=['E5-AUTOR-01', 'E5-OPUS-03', 'E5-OPUS-04'], status='offen', klasse='L')
# Befund E4-PRUEFER-01: Lighthouse-Budgets mobil verfehlt (LCP 2,5 bis 3,8 s, SEO 92 auf Unterseiten), keine Route schlechter als E0
hk('E5-PRUEFER-02', 'Leistungsdiagnose mobil aus Lighthouse-Spuren: LCP-Element und Zeitanteile, blockierende Ressourcen, JavaScript je Route, Hauptthread beim Seitenaufbau, SEO-Abzug der Unterseiten; Vorschläge mit erwarteter Wirkung', 1, 'Prüfer', [W + 'berichte/E5-PRUEFER-02.md', W + 'werkzeuge/leistung-diagnose.mjs'], ['EL-33'], ['Z-15', 'Z-16'], deps=['E4-PRUEFER-01'], status='offen')
op('E5-OPUS-04', 'Leistungsbudgets: LCP mobil höchstens 2,5 s und Leistung mindestens 90 auf den Hauptansichten, SEO 100, ohne Verlust an Inszenierung und Bestand', 'E5', 3,
   ['next.config.ts', 'src/app/(site)/layout.tsx', 'src/app/(site)/globals.css', 'src/app/(site)/page.tsx', 'src/app/(site)/autoschluessel/', 'src/components/layout/', 'src/components/hub/', 'src/components/visual/inszenierung/', 'src/components/seo/', 'src/fonts/', 'src/lib/konfigurator/zwischenstand.ts'],
   ['E5-PRUEFER-02', 'E5-OPUS-05'], ['EL-33', 'G-06'], ['Z-15', 'Z-16'], klasse='M', wirkung=4)

# ---------------------------------------------------------------- E6 Übrige Rubriken
op('E6-OPUS-01', 'Gemeinsamer Abschluss: Wege-Baukasten aus Rubrikdaten (Ablauf, Formular, Upload mit Fotohilfe, Nachweis, Zusammenfassung, Bestätigung, Vorgangsblatt)', 'E6', 1,
   ['src/components/weg/', 'src/lib/wege/', 'src/lib/actions/orders.ts', 'src/lib/actions/records.ts', 'src/lib/actions/security.test.ts', 'src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx', 'src/app/(site)/schluessel-nach-vorlage/', 'src/app/(site)/service-und-termin/anfrage/', 'content/rubriken.json', 'src/lib/data/defaults/rubriken.ts', 'src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx', 'src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx', 'src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx', 'src/app/(site)/partner-werden/partner-formular.tsx', 'src/components/konfigurator/schliessplan-planer.tsx', 'src/app/(site)/bestellung/[id]/page.tsx', 'src/components/rubrik/rubrik-ablauf.tsx', 'src/app/(site)/schluessel-nach-code/page.tsx', 'src/app/(site)/gleichschliessende-zylinder/page.tsx', 'src/app/(site)/schliessanlagen/page.tsx', 'src/app/(site)/elektronische-zutrittsloesungen/page.tsx', 'src/app/(site)/sicherheitstechnik/page.tsx', 'src/app/(site)/service-und-termin/vor-ort/page.tsx', 'src/app/(site)/autoschluessel/marken/page.tsx', 'src/app/(site)/tuer-und-schliesstechnik/page.tsx'], ['E5-PRUEFER-01', 'E5-PROBENUTZER-01'], ['G-38', 'G-11', 'G-10'], ['Z-05'], wirkung=5)
op('E6-OPUS-02', 'Einsenden: Adresse, versichert oder unversichert, Begleitschein oder Versandmarke, Kreislauf bis Rückversand mit Kundenstatus', 'E6', 2,
   ['src/app/(site)/schluessel-einschicken/', 'src/lib/einsenden/', 'src/app/(site)/bestellung/[id]/', 'src/lib/actions/records.ts', 'src/lib/actions/security.test.ts', 'src/lib/server/rate-limit.ts', 'src/lib/wege/naechste-schritte.ts', 'src/lib/wege/ablauf.test.tsx', 'src/app/sitemap.ts', 'content/seo.json', 'src/app/(site)/schluessel-nach-vorlage/page.tsx', 'src/lib/mail/vorlagen/', 'src/app/(site)/service-und-termin/terminstatus/', 'src/lib/foto-freigabe.ts', 'src/payload/hooks/vorgang-benachrichtigen.ts', 'src/lib/data/payload-mapping.ts', 'src/payload/collections/Vorgaenge.ts', 'src/lib/pdf/vorgangsblatt.ts', 'src/lib/actions/booking.ts'], ['E6-OPUS-01'], ['G-24', 'G-25', 'G-26'], ['Z-08'], wirkung=5)
op('E6-OPUS-03', 'Transponder-Kopie nur für bestätigte Fahrzeuge: Kasse, Einsenden, Rückversand', 'E6', 3, ['src/app/(site)/autoschluessel/transponder-kopie/'], ['E6-OPUS-02'], ['G-18'], ['Z-05', 'Z-07'], klasse='M')
for i, (t, pfad, anf) in enumerate([
    ('Motorradschlüssel-Anfrage mit Transponder-Pflichtfrage', 'motorradschluessel', ['G-19']),
    ('Autoschlüssel-Gehäuse: Anfrage, Angebot mit Zahlungslink, Einsenden', 'autoschluessel/gehaeuse', ['G-20']),
    ('Kontaktformular mit Foto-Upload und Rückruf', 'service-und-termin/kontakt', ['G-36']),
    ('Beratungsanfragen Elektronik, Tür und Schließtechnik, Sicherheitstechnik, Schlüsselaufbewahrung', 'beratung', ['G-33', 'G-34']),
    ('Schlüsseldienst vor Ort: Anfrage mit Ort für die Vermittlung', 'service-und-termin/vor-ort', ['G-40', 'G-41']),
    ('Schlüssel nach Foto: Fotoanleitung mit drei gezeichneten Beispielen, Hinweis „nicht jedes Foto ablesbar“', 'schluessel-nach-vorlage', ['G-23', 'G-45'])], start=1):
    hk(f'E6-BAUMEISTER-0{i}', t, 3 if i < 4 else 4, 'Baumeister', [f'src/app/(site)/{pfad}/'], anf, ['Z-05'], deps=['E6-OPUS-01'], status='offen', stufe=2)
op('E6-OPUS-04', 'Vorgangsblatt für jede neue Vorgangsart, Kundenstatus in einfacher Sprache, Terminstatus erweitert', 'E6', 5, ['src/lib/pdf/blaetter/', 'src/app/(site)/service-und-termin/terminstatus/'], ['E6-BAUMEISTER-06'], ['G-37', 'G-25'], ['Z-19'], klasse='L')
hk('E6-PROBENUTZER-01', 'Probelauf aller Wege aus Abschnitt 11 mit vier Personas', 6, 'Probenutzer', [W + 'berichte/E6-PROBENUTZER-01.md'], [], ['Z-05'], deps=['E6-OPUS-04'], status='offen', klasse='L')
hk('E6-PRUEFER-01', 'Prüfstufe B Etappe E6', 6, 'Prüfer', [W + 'berichte/E6-PRUEFER-01.md'], [], ['Z-02', 'Z-08', 'Z-14'], deps=['E6-OPUS-04'], status='offen', klasse='L')

# ---------------------------------------------------------------- E7 Partner, Karte
op('E7-OPUS-01', 'Partner werden: Bewerbungsdurchlauf mit Status, Nachweise, Vertrag-PDF aus Platzhalter-Vorlage, Unterschrift als Upload, Partner-AGB und Vertrag nur als markierter Entwurf zur Anwaltsprüfung (R10)', 'E7', 1, ['src/app/(site)/partner-werden/', 'src/lib/pdf/partnervertrag.ts'], ['E6-PRUEFER-01', 'E6-PROBENUTZER-01'], ['G-39'], ['Z-09'])
op('E7-OPUS-02', 'Vermittlung und Abrechnung A und B im Admin, Provisionen aus den Einstellungen, B ausgeschaltet', 'E7', 2, ['src/payload/components/Vermittlung.tsx', 'src/payload/collections/Vorgaenge.ts', 'src/payload.config.ts', 'src/migrations/', 'src/payload-types.ts', 'src/payload/seed.ts'], ['E7-OPUS-01'], ['G-40'], ['Z-09'])
op('E7-OPUS-03', 'Interaktive Karte Hessen (Kreise, Städte, Gemeinden, Partnergebiete), selbst gehostet, nachgeladen, Listenansicht mit Tastatur', 'E7', 2, ['src/components/karte/', 'src/app/(site)/standorte/'], ['E7-OPUS-01'], ['G-42'], ['Z-10', 'Z-14'])
hk('E7-BAUMEISTER-01', 'Stadt-Hub-Vorlage mit Stadtteilen als Abschnitten, noindex bis aktiver Partner, Schalter je Stadt', 3, 'Baumeister', ['src/app/(site)/standorte/[city]/'], ['G-41'], ['Z-10'], deps=['E7-OPUS-03'], status='offen', stufe=2)
hk('E7-AUTOR-01', 'Wetzlar, Lahn-Dill-Kreis und Hessen mit eigener Substanz (nur echte Leistungen je Gebiet)', 3, 'Autor', ['content/cities.json'], ['G-41', 'G-43'], ['Z-16', 'Z-17'], deps=['E7-OPUS-03'], status='offen', stufe=2)
hk('E7-PRUEFER-01', 'Prüfstufe B Etappe E7 mit axe der Karte und Zugriffsrechten der Partner', 4, 'Prüfer', [W + 'berichte/E7-PRUEFER-01.md'], [], ['Z-09', 'Z-10', 'Z-14'], deps=['E7-BAUMEISTER-01', 'E7-AUTOR-01', 'E7-OPUS-02'], status='offen', klasse='L')

# ---------------------------------------------------------------- E8 Inhalte, Suche, Nennung, Logo
op('E8-OPUS-01', 'Suche technisch: Strukturdaten-Graph mit festen @id, Service je Rubrik, kein FAQ-Markup, Meta-Robots, Sitemaps mit echtem lastmod, Bild-Sitemap, Markendefinition wortgleich', 'E8', 1,
   ['src/components/seo/', 'src/app/sitemap.ts', 'src/app/robots.ts', 'src/app/(site)/layout.tsx'], ['E7-PRUEFER-01', 'E1-OPUS-01'], ['G-43'], ['Z-16'], wirkung=4)
op('E8-OPUS-02', 'Schlüsselseiten (höchstens 40): Briefe, Titel mit Leitanfrage unter 580 px, Beschreibung, H1, Kurzantwort, Teilfragen nach KARTE.md', 'E8', 2,
   ['content/seo.json', W + 'REGISTER.md'], ['E8-OPUS-01'], ['G-41', 'G-43'], ['Z-16', 'Z-17'], wirkung=5)
for i, (t, s) in enumerate([
    ('Texte ohne KI-Spuren: Codelinien (52) in content/code-lines.json und Generator codelinie-texte', ['content/code-lines.json', 'src/lib/codelinie-texte.ts']),
    ('Texte ohne KI-Spuren: Fahrzeuge, Marken- und Modelltexte', ['content/vehicles.json', 'src/lib/fahrzeug-texte.ts']),
    ('Texte ohne KI-Spuren: Leistungsseiten, Ratgeber-Titel, Seitentexte', ['content/service-pages.json', 'content/guides.json']),
    ('Texte ohne KI-Spuren: Rubrikseiten in src/app/(site) außer Startseite', ['src/app/(site)/tuer-und-schliesstechnik/', 'src/app/(site)/sicherheitstechnik/', 'src/app/(site)/service-und-termin/page.tsx']),
    ('Texte ohne KI-Spuren: Mails, Druck, Bestätigungen, Fehlermeldungen', ['src/lib/mail/vorlagen/', 'src/lib/druckansichten.ts'])], start=1):
    hk(f'E8-TEXTER-0{i}', t, 2 if i <= 3 else 3, 'Texter', s, ['G-48'], ['Z-13'], deps=['E8-OPUS-01'], status='offen', stufe=2)
for i, (t, s, anf) in enumerate([
    ('Ratgeber und Anleitungen mit Informationsgewinn (Seriennummer finden, Schlüssel fotografieren, Einschicken, Zylinder messen), Schritte und Transkript', ['content/guides.json'], ['G-44', 'G-23', 'G-29']),
    ('Über uns nur aus Belegen (Werkstatt Wetzlar, Inhaber, Ablauf), Markendefinition', ['src/app/(site)/ueber-uns/'], ['G-43', 'G-51']),
    ('Glossar Schließtechnik als Seite aus KERN (Laienerklärungen)', ['src/app/(site)/ratgeber/glossar/'], ['G-09', 'G-32'])], start=1):
    hk(f'E8-AUTOR-0{i}', t, 3, 'Autor', s, anf, ['Z-17'], deps=['E8-OPUS-02'], status='offen', stufe=2, art='pflicht' if i < 3 else 'kuer', wirkung=4 if i < 3 else 3)
op('E8-OPUS-03', 'Videofassade mit Schrittanleitung und Transkript, CSP gezielt erweitert, VideoObject nur mit echtem Video', 'E8', 3, ['src/components/video/', 'next.config.ts'], ['E8-OPUS-02'], ['G-44'], ['Z-18'], klasse='M')
op('E8-OPUS-04', 'Agenturnennung nach Abschnitt 15: Fußzeile, nofollow außer Start, Schalter aus, creator im WebSite-Knoten, Test, Textvorschlag für die Zustimmung, LINKREGISTER.md und REFERENZ.md', 'E8', 3, ['src/components/layout/agenturnennung.tsx', 'src/components/layout/agenturnennung.test.tsx', 'src/components/layout/site-footer.tsx', W + 'LINKREGISTER.md', W + 'REFERENZ.md', W + 'MENSCHEN.md'], ['E8-OPUS-02'], [], ['Z-16'], klasse='M', wirkung=2)
op('E8-OPUS-05', 'Drei Logo-Konzepte (Bildmarke, Wortmarke, Favicon ab 16 px, schwarz-weiß und farbig) mit Vergleichsseite', 'E8', 4, [W + 'logo/'], ['E8-OPUS-02'], ['G-12'], ['Z-11'], wirkung=3)
hk('E8-PRUEFER-01', 'R12-Prüfung der Logo-Konzepte und Ähnlichkeit zu Zeichen der Branche', 5, 'Prüfer', [W + 'berichte/E8-PRUEFER-01.md'], ['G-12'], ['Z-11', 'Z-20'], deps=['E8-OPUS-05'], status='offen')
hk('E8-DOKUMENTAR-01', 'AUSSEN.md: Profile, Verzeichnisse, Innung, Herstellerverzeichnisse, Bewertungsbitte, Anschreiben an Partner', 4, 'Dokumentar', [W + 'AUSSEN.md'], ['G-41', 'G-43'], ['Z-22'], deps=['E8-OPUS-02'], status='offen', stufe=2)
hk('E8-DOKUMENTAR-02', 'BILDPROMPTS.md, BILDBEDARF.md, DREHLISTE.md, BILDRECHTE.md', 4, 'Dokumentar', [W + 'BILDPROMPTS.md', W + 'BILDBEDARF.md', W + 'DREHLISTE.md', W + 'BILDRECHTE.md'], ['G-44', 'G-45', 'G-46'], ['Z-18'], deps=['E8-OPUS-02'], status='offen', stufe=2)
hk('E8-FAKTENPRUEFER-01', 'Faktenprüfung aller neuen und geänderten Schlüsselseiten einschließlich Metadaten und Strukturdaten', 5, 'Faktenprüfer', [W + 'REDAKTION.md'], ['G-48'], ['Z-17'], deps=['E8-AUTOR-01', 'E8-AUTOR-02'], status='offen', klasse='L')
P('E8-BLIND-01', 'Blind- und Dominanzprobe der Schlüsselseiten (frische Opus-Blindprüfer, je höchstens 15 Seiten)', 'E8', 6, 'Jury', OPUS, 3, 'L', [W + 'berichte/E8-BLIND-01.md'], ['E8-FAKTENPRUEFER-01'], [], ['Z-17'])
hk('E8-PRUEFER-02', 'Prüfstufe B Etappe E8 mit Inventar, Snippets, Strukturdaten, Stil und Slop', 6, 'Prüfer', [W + 'berichte/E8-PRUEFER-02.md'], [], ['Z-13', 'Z-16'], deps=['E8-FAKTENPRUEFER-01'], status='offen', klasse='L')

# ---------------------------------------------------------------- E9 Werkzeuge des Inhabers
op('E9-OPUS-01', 'Dashboard im Admin: Vorgänge mit Status, Fälligkeiten, Anzahlungen, Umsätze, Anfragen je Rubrik, Partneraufträge', 'E9', 1, ['src/payload/components/Dashboard/', 'src/lib/kennzahlen.ts'], ['E8-PRUEFER-02'], ['G-49'], ['Z-19'])
op('E9-OPUS-02', 'Importskript für ausgefüllte Bögen aus eingang (prüft, bricht bei unbekannten Werten ab) mit Tests', 'E9', 1, ['scripts/boegen-import.mjs', 'scripts/boegen-import.test.ts'], ['E8-PRUEFER-02'], ['G-18', 'G-22', 'G-33', 'G-40'], ['Z-19'], klasse='M')
op('E9-OPUS-03', 'Livegang-Prüfung erweitern: jede neue Einstellung, jeder Schalter, jede Menschensache', 'E9', 2, ['src/lib/livegang-pruefung.ts', 'src/scripts/livegang-pruefen.ts'], ['E9-OPUS-01'], [], ['Z-19', 'Z-02'], klasse='M')
op('E9-OPUS-04', 'Später-Bausteine: G-21 Einzel- und Teileverkauf (Datenmodell, Konzept, Schalter) und G-50 Chat-KI (Konzept, abgeschaltete Schnittstelle)', 'E9', 2, ['src/lib/spaeter/', W + 'KONZEPTE.md'], ['E9-OPUS-01'], ['G-21', 'G-50'], ['Z-03'], klasse='M')
op('E9-OPUS-05', 'Leistung Rest nach E5-OPUS-04: LCP mobil in der Lighthouse-Simulation höchstens 2,5 s auf den Hauptansichten (Schriften vor dem ersten Bild, ungenutzter Code der Kopf- und Leistenbündel, Dokumentgewicht mit RSC-Nutzlast und Inline-SVG, Polyfills nach Entscheidung über Zielbrowser)', 'E9', 2, ['next.config.ts', 'src/app/(site)/layout.tsx', 'src/app/(site)/globals.css', 'src/components/layout/', 'src/fonts/', 'package.json'], ['E5-OPUS-04'], ['EL-33', 'G-06'], ['Z-15', 'Z-16'], klasse='M')
hk('E9-BAUMEISTER-01', 'Aufbewahrung: alle neuen Upload-Zwecke in Fristen und Bereinigung', 2, 'Baumeister', ['src/lib/server/aufbewahrung-zwecke.ts'], ['G-37'], ['Z-19', 'Z-20'], deps=['E9-OPUS-01'], status='offen', stufe=2)
hk('E9-PROBENUTZER-01', 'Probelauf im Admin: Dashboard, Vorgangsblätter, Bögen, Livegang-Prüfung', 3, 'Probenutzer', [W + 'berichte/E9-PROBENUTZER-01.md'], ['G-49'], ['Z-19'], deps=['E9-OPUS-03', 'E9-OPUS-04', 'E9-BAUMEISTER-01'], status='offen')
hk('E9-PRUEFER-01', 'Prüfstufe B Etappe E9', 3, 'Prüfer', [W + 'berichte/E9-PRUEFER-01.md'], [], ['Z-02', 'Z-19', 'Z-20'], deps=['E9-OPUS-03', 'E9-OPUS-04', 'E9-BAUMEISTER-01'], status='offen', klasse='L')

# ---------------------------------------------------------------- E10 Kür (Vorrat)
KUER = [
    ('Signaturmomente vertiefen (Inszenierung, Übergänge) nach Sichtabnahme', 'Orchestrator', 4, ['src/components/visual/inszenierung/', 'src/components/hub/']),
    ('Lade-, Leer- und Erfolgszustände mit Charakter', 'Baumeister', 3, ['src/components/ui/zustaende/']),
    ('Fehlerseite 404 und 500 mit Weg zurück zum Hub', 'Baumeister', 2, ['src/app/(site)/not-found.tsx', 'src/app/(site)/error.tsx']),
    ('Teilen-Bilder je Rubrik aus dem Formsystem', 'Grafiker', 3, ['src/lib/og/']),
    ('Rechner und Vergleiche mit Informationsgewinn (Gleichschließung gegen Schließanlage, Kosten nach Türen)', 'Orchestrator', 4, ['src/components/calculator/']),
    ('Labor-Kanten: llms.txt aus denselben Daten, Händler-Feed für Schlüssel nach Code', 'Baumeister', 2, ['src/app/llms.txt/route.ts', 'src/app/feed/']),
    ('Leistung und Zugänglichkeit über die Budgets hinaus', 'Prüfer', 3, [W + 'protokolle/E10-leistung.md', 'src/app/(site)/layout.tsx']),
    ('Mikrotypografie (Silbentrennung, Ziffern, Anführungszeichen, Abstände)', 'Texter', 2, ['src/app/(site)/globals.css'])]
KUER_VORGAENGER = {1: 'E4-JURY-01', 2: 'E3-OPUS-02', 3: 'E4-OPUS-01', 4: 'E4-OPUS-04', 5: 'E5-OPUS-02', 6: 'E8-OPUS-02', 7: 'E4-PRUEFER-01', 8: 'E3-OPUS-02'}
for i, (t, rolle, w, schreib) in enumerate(KUER, start=1):
    mod = OPUS if rolle == 'Orchestrator' else HAIKU
    P(f'E10-KUER-{i:02d}', t, 'E10', 1, rolle, mod, 3 if mod == OPUS else 2, 'M', schreib, [KUER_VORGAENGER[i]], [], ['Z-01', 'Z-11'], 'kuer', w,
      massstab=(MP + f'E10-KUER-{i:02d}.md' if mod == HAIKU else None), muster=(W + 'pakete/_MUSTER-REFERENZ.md' if mod == HAIKU else None))
hk('E10-PRUEFER-01', 'Prüfstufe B Etappe E10 (Kür)', 2, 'Prüfer', [W + 'berichte/E10-PRUEFER-01.md'], [], ['Z-02', 'Z-11'], deps=[f'E10-KUER-{i:02d}' for i in range(1, 9)], status='offen', klasse='L', art='kuer', wirkung=3)

# ---------------------------------------------------------------- Abschluss
hk('EA-PRUEFER-01', 'Prüfstufe C: alle Ansichten, Inventarvergleich, Personas, Tastatur, Reflow, Zoom, erzwungene Farben, R1 bis R13, Platzhalter, Livegang', 1, 'Prüfer', [W + 'berichte/EA-PRUEFER-01.md'], [], ['Z-02', 'Z-13', 'Z-14', 'Z-15', 'Z-20'], deps=['E9-PRUEFER-01', 'E9-PROBENUTZER-01'], status='offen', klasse='L')
hk('EA-SPOTTER-01', 'Sichtung durch drei Spotter V1 bis V9, Slop-Index nachher', 1, 'Prüfer', [W + 'SLOP-AUDIT.md'], ['G-48'], ['Z-13'], deps=['E9-PRUEFER-01'], status='offen')
P('EA-JURY-01', 'Endjury mit Blindvergleich Vorher und Nachher (frischer Opus)', 'EA', 2, 'Jury', OPUS, 3, 'L', [W + 'berichte/EA-JURY-01.md'], ['EA-PRUEFER-01', 'EA-SPOTTER-01', 'E8-BLIND-01'], [], ['Z-11'])
op('EA-OPUS-01', 'BERICHT.md mit Galerie und Vorführpfad, MESSPLAN.md, Archiv docs/ausbau, Anleitung Zusammenführen und Zurückrollen, Entwurfs-PR', 'EA', 3, ['docs/ausbau/', W + 'BERICHT.md', W + 'MESSPLAN.md'], ['EA-JURY-01'], [], ['Z-22'], klasse='L')
_vorh = sorted(json.load(open(os.path.join(AUSBAU, 'erhebung', 'E2-zuordnung-eingang.json')))['vorhanden'] + ['M-17'],
               key=lambda k: (k.split('-')[0], int(k.split('-')[1])))
_zahl = -(-len(_vorh) // 40)                                     # höchstens 40 je Paket (E2-PRUEFER-02, Szenario 6)
_groesse = -(-len(_vorh) // _zahl)                               # gleich große Teile
_teile = [_vorh[i:i + _groesse] for i in range(0, len(_vorh), _groesse)]
_abgleich = [f'EA-PRUEFER-{n:02d}' for n in range(2, 2 + len(_teile))]
P('EA-ENDPRUEFER-01', 'Endprüfer (frischer Opus): jedes Häkchen, jede Ausnahme, jeder Endstatus gegen Beleg', 'EA', 4, 'Jury', OPUS, 3, 'L', [W + 'berichte/EA-ENDPRUEFER-01.md'], ['EA-OPUS-01'] + _abgleich, [], ['Z-01', 'Z-03', 'Z-22'])

# ---------------------------------------------------------------- Bestandsabgleich (deckt alle „vorhanden“)
for _n, (_kennung, _teil) in enumerate(zip(_abgleich, _teile), start=2):
    hk(_kennung, f'Bestandsabgleich {_teil[0]} bis {_teil[-1]}: jede Anforderung mit Bestand „vorhanden“ am Endstand nachprüfen und mit Beleg auf umgesetzt setzen', 1, 'Prüfer',
       [W + f'erhebung/EA-bestandsabgleich-{_n:02d}.json'], _teil, ['Z-03'], deps=['E9-PRUEFER-01'], status='offen', klasse='M')
hk('E2-DATENPFLEGER-01', 'Zuordnung jeder nicht vorhandenen Anforderung (L, EL, M, E) zu Paketen oder Menschensache', 2, 'Datenpfleger', [W + 'erhebung/E2-zuordnung.json'], [], ['Z-03'], deps=['E2-OPUS-02'], status='offen', stufe=2)

hk('E6-BAUMEISTER-07', 'Schlüssel nach Code: Suche und Filter nach Typ, Codelinie und Hersteller, Codeerkennung in der Suche, kompakte Produktseite', 4, 'Baumeister', ['src/app/(site)/schluessel-nach-code/'], ['L-120', 'E-13', 'E-89', 'E-90'], ['Z-05'], deps=['E6-OPUS-01'], status='offen', stufe=2)
hk('E9-DOKUMENTAR-01', 'Menschensachen fertig vorbereiten: jede Anforderung mit Vorschlag menschensache bekommt einen vollständigen Eintrag in MENSCHEN.md oder AUSSEN.md', 2, 'Dokumentar', [W + 'MENSCHEN.md'], [], ['Z-03', 'Z-22'], deps=['E9-OPUS-01'], status='offen', stufe=2)

def muster_setzen():
    spaet = {'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'EA'}
    for p in P_LIST:
        if p['modell'] == HAIKU and p['etappe'] in spaet:
            p['muster'] = W + 'pakete/_MUSTER-REFERENZ.md'

def status_uebernehmen():
    pfad = os.path.join(AUSBAU, 'PLAN.json')
    if not os.path.exists(pfad):
        return
    alt = {p['kennung']: p for p in json.load(open(pfad))['pakete']}
    for p in P_LIST:
        a = alt.get(p['kennung'])
        if a and a['status'] != 'offen':
            for f in ('status', 'commit', 'versuche', 'grund'):
                p[f] = a[f]

def kritischer_pfad():
    nach = {p['kennung']: p for p in P_LIST}
    memo = {}
    def laenge(k):
        if k in memo: return memo[k]
        deps = [d for d in nach[k]['abhaengigkeiten'] if d in nach]
        best = max((laenge(d) for d in deps), key=len, default=[])
        memo[k] = best + [k]
        return memo[k]
    return max((laenge(k) for k in nach), key=len)

def pruefer_kanten():
    """Prüfstufe B einer Etappe hängt ausdrücklich an allen früheren Wellen derselben Etappe (L0 Runde 2)."""
    for p in P_LIST:
        if p['rolle'] == 'Prüfer' and 'Prüfstufe B' in p['titel']:
            for q in P_LIST:
                if q is p or q['etappe'] != p['etappe'] or q['welle'] >= p['welle']:
                    continue
                if q['kennung'] not in p['abhaengigkeiten']:
                    p['abhaengigkeiten'].append(q['kennung'])

def zuordnung_einlesen():
    pfad = os.path.join(AUSBAU, 'erhebung', 'E2-zuordnung.json')
    if not os.path.exists(pfad):
        return
    z = json.load(open(pfad))['zuordnung']
    nach_kennung = {p['kennung']: p for p in P_LIST}
    sonder = {'L-427': ['E9-DOKUMENTAR-01'], 'EL-78': ['E7-OPUS-02']}
    for e in z:
        k = e['kennung']
        if k in sonder:
            ziele = sonder[k]
        elif e['vorschlag'] == 'menschensache':
            ziele = ['E9-DOKUMENTAR-01']
        elif e['vorschlag'] == 'neu':
            ziele = ['E6-BAUMEISTER-07']
        else:
            ziele = e['pakete']
        for z_ in ziele:
            if z_ in nach_kennung and k not in nach_kennung[z_]['anforderungen']:
                nach_kennung[z_]['anforderungen'].append(k)

# Kanten-Hebel (Auftrag 13) an die Pakete, die sie bauen oder prüfen (KANTEN.md, E1-OPUS-01).
# KL2, KL3 und KL4 sind zurückgestellt (Status „später“ in ANFORDERUNGEN.json) und hängen nur an E1-OPUS-01.
KANTEN_PAKETE = {
    'KT1': ['E8-OPUS-01'], 'KT2': ['E8-PRUEFER-02'], 'KT3': ['E8-OPUS-01'], 'KT4': ['E9-OPUS-03'],
    'KT5': ['E8-OPUS-01', 'E8-DOKUMENTAR-01'], 'KT6': ['E8-OPUS-01'], 'KT7': ['E8-OPUS-01', 'E8-OPUS-05'],
    'KT8': ['E4-PRUEFER-01', 'E8-PRUEFER-02'], 'KT9': ['E8-OPUS-03', 'E9-OPUS-03'],
    'KA1': ['E5-OPUS-01', 'E5-OPUS-02'], 'KA2': ['E8-OPUS-02'], 'KA3': ['E4-OPUS-05', 'E5-OPUS-01', 'E5-GRAFIKER-01'],
    'KA4': ['E4-OPUS-04', 'E8-AUTOR-02'], 'KA5': ['E5-AUTOR-01'], 'KA6': ['E8-OPUS-02'], 'KA7': ['E8-OPUS-01'],
    'KA8': ['E8-FAKTENPRUEFER-01'], 'KA9': ['E8-OPUS-03'],
    'KK1': ['E8-OPUS-02', 'E8-TEXTER-01'], 'KK2': ['E8-OPUS-02'], 'KK3': ['E8-OPUS-02'], 'KK4': ['E8-OPUS-01'],
    'KK5': ['E8-OPUS-01', 'E10-KUER-04'],
    'KE1': ['E8-OPUS-01', 'E8-AUTOR-02'], 'KE2': ['E8-DOKUMENTAR-01'], 'KE3': ['E8-DOKUMENTAR-01'],
    'KE4': ['E8-DOKUMENTAR-01'], 'KE5': ['E4-OPUS-05', 'E5-OPUS-01', 'E5-OPUS-02'], 'KE6': ['E6-OPUS-01'],
    'KE7': ['E10-KUER-06'], 'KL1': ['E10-KUER-06'],
}

def kanten_zuordnen():
    nach_kennung = {p['kennung']: p for p in P_LIST}
    for k, ziele in KANTEN_PAKETE.items():
        for z_ in ziele:
            assert z_ in nach_kennung, f'Kanten-Zuordnung: Paket {z_} fehlt'
            if k not in nach_kennung[z_]['anforderungen']:
                nach_kennung[z_]['anforderungen'].append(k)

def normalisiere():
    for p in P_LIST:
        p['anforderungen'] = [a[2:] if a.startswith('K-') else a for a in p['anforderungen']]

def commits_eintragen():
    for p in P_LIST:
        if p['status'] != 'committet' or p['commit']:
            continue
        kandidaten = [s for s in p['schreibrechte'] if s.startswith(W)] + [W + 'berichte/' + p['kennung']]
        for k in kandidaten:
            try:
                out = subprocess.run(['git', '-C', WURZEL, 'log', '--diff-filter=A', '--format=%h', '--', k + ('*' if not k.endswith(('.md', '.json', '.mjs', '/')) else '')],
                                     capture_output=True, text=True).stdout.split()
            except Exception:
                out = []
            if out:
                p['commit'] = out[-1]
                break

def pruefe_g_deckung():
    anf = json.load(open(os.path.join(AUSBAU, 'ANFORDERUNGEN.json')))['eintraege']
    genannt = collections.Counter(a for p in P_LIST for a in p['anforderungen'])
    fehlend = [e['kennung'] for e in anf if e['quelle'] in ('G', 'K') and e['kennung'] not in genannt]
    return fehlend

def plan():
    normalisiere()
    zuordnung_einlesen()
    kanten_zuordnen()
    muster_setzen()
    pruefer_kanten()
    status_uebernehmen()
    commits_eintragen()
    kl = collections.Counter(p['kostenklasse'] for p in P_LIST)
    # Schätzung E2 (nach E4 neu kalibriert): Haiku-M laufen zu viert parallel (etwa 24 je Tag im Kontingent),
    # L-Pakete (Opus-Kern, Jury, Bildsätze) nacheinander (etwa 6 je Tag); Tage = Summe je Klasse, Puffer 20 %.
    pro_tag = {'S': 36, 'M': 24, 'L': 6}
    tage = sum(kl[k] / pro_tag[k] for k in kl) * 1.2
    # Etappen-Tage an die Kapazität angleichen (E2-PRUEFER-02): Gewichte der Etappen bleiben, die Summe folgt der Rechnung.
    _summe = sum(e['tage'] for e in ETAPPEN)
    for e in ETAPPEN:
        e['tage'] = round(e['tage'] * tage / _summe, 2)
    pflicht = [p for p in P_LIST if p['art'] == 'pflicht']
    doc = {
        'version': 1,
        'stand': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'etappen': ETAPPEN,
        'pakete': P_LIST,
        'mengengeruest': {'pakete': len(P_LIST), 'pflicht': len(pflicht), 'kuer': len(P_LIST) - len(pflicht),
                          'opus': sum(p['modell'] == OPUS for p in P_LIST), 'haiku': sum(p['modell'] == HAIKU for p in P_LIST),
                          'kostenklassen': dict(kl), 'anforderungen': len(json.load(open(os.path.join(AUSBAU, 'ANFORDERUNGEN.json')))['eintraege']), 'kriterien': 22},
        'kapazitaet': {'pakete_pro_tag': pro_tag, 'puffer': 0.2, 'tage': round(tage, 1)},
        'kritischer_pfad': kritischer_pfad(),
        'vorrat': sorted([p['kennung'] for p in P_LIST if p['art'] == 'kuer'], key=lambda k: -next(p['wirkung'] for p in P_LIST if p['kennung'] == k)),
    }
    return doc

if __name__ == '__main__':
    doc = plan()
    ids = [p['kennung'] for p in P_LIST]
    dupl = [k for k, n in collections.Counter(ids).items() if n > 1]
    print('Pakete', len(ids), 'Dubletten', dupl, 'Mengengerüst', doc['mengengeruest'], 'Tage', doc['kapazitaet']['tage'])
    print('Ungedeckte G/K:', pruefe_g_deckung())
    if '--schreiben' in sys.argv:
        ziel = os.path.join(AUSBAU, 'PLAN.json')
        json.dump(doc, open(ziel + '.tmp', 'w'), ensure_ascii=False, indent=1)
        os.replace(ziel + '.tmp', ziel)
        print('geschrieben:', ziel)
