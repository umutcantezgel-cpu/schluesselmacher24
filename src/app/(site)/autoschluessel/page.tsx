import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, KeyRound, Wrench } from 'lucide-react';

import { getPageContent, getSettings, getVehicleMakes } from '@/lib/data';
import type { InfoHint } from '@/lib/types';
import { formatCents } from '@/lib/format';
import { PROCESS_LABELS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Accordion } from '@/components/ui/accordion';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { InfoTip } from '@/components/ui/info-tip';
import { KEY_KIND_HINT, ON_SITE_HINT } from '@/components/autoschluessel/key-kinds';
import { JsonLd, pageGraphSchema } from '@/components/seo/json-ld';
import { LexicalGlossary } from '@/components/glossary/lexical-glossary';


const ROUTE = 'autoschluessel';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent(ROUTE);
  return {
    title: page?.seo.title ?? 'Autoschlüssel — Leistungen im Überblick',
    description:
      page?.seo.description
      ?? 'Autoschlüssel nachmachen, kopieren, programmieren und reparieren. Alle Leistungen, '
        + 'der Ablauf und die passenden Fahrzeugmarken im Überblick.',
    alternates: { canonical: '/autoschluessel' },
  };
}

const TRANSPONDER_HINT: InfoHint = {
  title: 'Transponder und Wegfahrsperre',
  body:
    'Im Schlüssel sitzt ein kleiner Chip, der Transponder. Beim Starten fragt das Fahrzeug diesen '
    + 'Chip ab. Passt die Antwort nicht, bleibt die Wegfahrsperre aktiv und der Motor springt nicht '
    + 'an — auch dann, wenn der mechanische Bart passt und die Tür aufgeht.',
  figure: {
    motif: 'Makroaufnahme: geöffnetes Schlüsselgehäuse mit sichtbarem Transponder',
    ratio: '3/2',
    note: 'Eigene Werkstattaufnahme, Chip deutlich erkennbar.',
  },
};

const BART_HINT: InfoHint = {
  title: 'Was ist der Schlüsselbart?',
  body:
    'Der Bart ist der metallene Teil des Schlüssels, der in das Schloss passt. Er wird nach einer '
    + 'Vorlage oder nach geeigneten Fahrzeugdaten gefräst. Mit der Elektronik im Schlüssel hat er '
    + 'nichts zu tun.',
  figure: {
    motif: 'Messzeichnung: Schlüsselbart mit Einschnitten und Bezeichnung der Positionen',
    ratio: '3/2',
  },
};

const SMART_KEY_HINT: InfoHint = {
  title: 'Smart Key und Keyless',
  body:
    'Bei diesen Systemen erkennt das Fahrzeug den Schlüssel, sobald er sich in der Nähe befindet. '
    + 'Sie öffnen und starten, ohne den Schlüssel in die Hand zu nehmen. Beschaffung und Anlernen '
    + 'sind aufwendiger als bei einem einfachen Funkschlüssel.',
};

interface Topic {
  term: string;
  href: string;
  body: string;
  hint?: InfoHint;
}

interface TopicGroup {
  title: string;
  lead: string;
  icon: typeof KeyRound;
  topics: Topic[];
}

const TOPIC_GROUPS: TopicGroup[] = [
  {
    title: 'Schlüssel anfertigen',
    lead: 'Alles, was einen zusätzlichen oder neuen Schlüssel für Ihr Fahrzeug betrifft.',
    icon: KeyRound,
    topics: [
      {
        term: 'Autoschlüssel nachmachen',
        href: '/autoschluessel/nachmachen',
        body: 'Ein vollständiger weiterer Schlüssel — mechanisch gefertigt und elektronisch angelernt.',
      },
      {
        term: 'Zweitschlüssel',
        href: '/autoschluessel/nachmachen',
        body: 'Ein zusätzlicher Schlüssel, solange mindestens ein funktionierender vorhanden ist.',
      },
      {
        term: 'Ersatzschlüssel nach Verlust',
        href: '/autoschluessel/nachmachen',
        body: 'Kein Schlüssel mehr vorhanden. Umfang und Machbarkeit prüfen wir im Einzelfall.',
      },
      {
        term: 'Autoschlüssel kopieren',
        href: '/autoschluessel/kopieren',
        body: 'Mechanische Kopie nach Vorlage. Ohne Elektronik startet sie das Fahrzeug nicht.',
      },
      {
        term: 'Schlüsselbart fräsen',
        href: '/autoschluessel/schluesselbart-fraesen',
        body: 'Der metallene Teil des Schlüssels — nach Vorlage oder geeigneten Fahrzeugdaten.',
        hint: BART_HINT,
      },
    ],
  },
  {
    title: 'Elektronik und Programmierung',
    lead: 'Damit das Fahrzeug den Schlüssel erkennt und annimmt.',
    icon: Wrench,
    topics: [
      {
        term: 'Programmieren und anlernen',
        href: '/autoschluessel/programmieren',
        body: 'Der Schlüssel wird dem Fahrzeug bekannt gemacht. Dafür ist Zugriff auf das Fahrzeug nötig.',
        hint: ON_SITE_HINT,
      },
      {
        term: 'Transponder und Wegfahrsperre',
        href: '/autoschluessel/programmieren',
        body: 'Der Chip im Schlüssel entscheidet darüber, ob der Motor startet.',
        hint: TRANSPONDER_HINT,
      },
      {
        term: 'Funkschlüssel',
        href: '/autoschluessel/funkschluessel',
        body: 'Fernbedienung zum Ver- und Entriegeln. Funk und Wegfahrsperre sind getrennte Funktionen.',
      },
      {
        term: 'Smart Key und Keyless',
        href: '/autoschluessel/smart-key',
        body: 'Schlüsselloser Zugang und Start. Mehr Vorlauf und mehr Zeit am Fahrzeug einplanen.',
        hint: SMART_KEY_HINT,
      },
    ],
  },
  {
    title: 'Reparatur und Sonderfälle',
    lead: 'Wenn der vorhandene Schlüssel nicht mehr richtig arbeitet oder gar nicht greifbar ist.',
    icon: Car,
    topics: [
      {
        term: 'Gehäuse, Tasten und Batterie',
        href: '/autoschluessel/funkschluessel',
        body: 'Gebrochenes Gehäuse, klemmende Tasten oder schwache Batterie — die Elektronik bleibt erhalten.',
      },
      {
        term: 'Schlüsselverlust',
        href: '/autoschluessel/nachmachen',
        body: 'Die richtige Reihenfolge spart Zeit: erst prüfen, was noch vorhanden ist, dann beauftragen.',
      },
      {
        term: 'Fahrzeugöffnung',
        href: '/autoschluessel/fahrzeugoeffnung',
        body: 'Zerstörungsfreies Öffnen als eigene Leistung. Sie ersetzt keinen Ersatzschlüssel.',
      },
    ],
  },
];

const FAQ = [
  {
    question: 'Muss mein Fahrzeug für einen neuen Autoschlüssel vor Ort sein?',
    answer:
      'Für rein mechanische Arbeiten am Bart in vielen Fällen nicht. Sobald der Schlüssel elektronisch '
      + 'angelernt werden muss, ist Zugriff auf das Fahrzeug erforderlich. Ob das bei Ihrem Fahrzeug '
      + 'der Fall ist, sehen Sie auf der jeweiligen Modellseite und im geführten Ablauf.',
  },
  {
    question: 'Was kostet ein neuer Autoschlüssel?',
    answer:
      'Das hängt vom Fahrzeug und von der Schlüsselart ab. Im geführten Ablauf erhalten Sie nach der '
      + 'Auswahl Ihres Fahrzeugs entweder einen festen Preis, einen Preisrahmen oder den Hinweis, dass '
      + 'wir Ihren Fall zuerst manuell prüfen. Erst danach buchen Sie einen Termin.',
  },
  {
    question: 'Warum brauchen Sie Fotos von meinem Schlüssel?',
    answer:
      'Die Bauform sagt uns, welches Gehäuse, welcher Rohling und welche Elektronik verbaut sind. '
      + 'Drei Aufnahmen aus unterschiedlichen Richtungen reichen in aller Regel aus. Das erspart '
      + 'Rückfragen und verhindert, dass beim Termin etwas fehlt.',
  },
  {
    question: 'Kann ich meinen Schlüssel einschicken?',
    answer:
      'Für mechanische Arbeiten ist ein Versand in vielen Fällen möglich. Muss der Schlüssel am '
      + 'Fahrzeug angelernt werden, hilft ein Versand nicht weiter — dann ist ein Termin mit Fahrzeug '
      + 'der richtige Weg.',
  },
  {
    question: 'Wofür ist die Anzahlung?',
    answer:
      'Die Anzahlung sichert Ihren Termin und die Beschaffung des passenden Schlüssels. Sie wird '
      + 'vollständig auf den Gesamtpreis angerechnet.',
  },
  {
    question: 'Ich habe meinen Schlüssel im Fahrzeug eingeschlossen. Was jetzt?',
    answer:
      'Dafür gibt es die Fahrzeugöffnung als eigene Leistung. Bitte halten Sie einen Nachweis bereit, '
      + 'dass Sie über das Fahrzeug verfügen dürfen.',
  },
];

export default async function AutoschluesselHubPage() {
  const [page, settings, makes] = await Promise.all([
    getPageContent(ROUTE),
    getSettings(),
    getVehicleMakes(),
  ]);

  const deposit = formatCents(settings.booking.depositCents);
  const leadDays = settings.booking.leadTimeDays;
  const modelCount = makes.reduce((sum, make) => sum + make.models.length, 0);

  // Der Ablauf ist überall derselbe; Beträge und Vorlauf kommen aus den Einstellungen.
  const steps = [
    {
      title: 'Fahrzeug wählen',
      body: 'Marke, Modell, Baujahr und Schlüsselart. Wir fragen nur ab, was für Ihr Fahrzeug zählt.',
    },
    {
      title: 'Fotos hochladen',
      body: 'Ihren Schlüssel aus drei Richtungen und den Fahrzeugschein.',
    },
    {
      title: 'Preis oder Prüfung',
      body: 'Sie erhalten einen festen Preis, einen Preisrahmen oder den Hinweis auf eine manuelle Prüfung.',
    },
    {
      title: 'Anzahlung',
      body: `Standard ${deposit}. Der Betrag wird vollständig auf den Gesamtpreis angerechnet.`,
    },
    {
      title: 'Termin buchen',
      body: `Der früheste Termin liegt etwa ${leadDays} Tage in der Zukunft, weil wir Ihren Schlüssel vorher beschaffen.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={pageGraphSchema({
          path: '/autoschluessel',
          name: page?.headline ?? 'Autoschlüssel',
          description: page?.seo.description,
          crumbs: [{ href: '/autoschluessel', label: 'Autoschlüssel' }],
          faq: page?.faq?.length ? page.faq : FAQ,
        })}
      />

      <PageHeader
        eyebrow="Themenwelt Autoschlüssel"
        title={page?.headline ?? 'Autoschlüssel'}
        lead={page?.subline ?? 'Nachmachen, programmieren, reparieren — mit klarem Ablauf und festem Termin.'}
        crumbs={[{ href: '/autoschluessel', label: 'Autoschlüssel' }]}
        actions={
          <ButtonLink href="/autoschluessel/anfrage">
            Fahrzeug auswählen und Termin starten
            <ArrowRight size={17} aria-hidden />
          </ButtonLink>
        }
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Ablauf
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              {PROCESS_LABELS['termin-mit-anzahlung'].label}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Anzahlung
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{deposit}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Vorlauf
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">
              ca. {leadDays} Tage
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
              Erfasste Modelle
            </dt>
            <dd className="mt-1 font-display text-lg font-bold text-foreground">{modelCount}</dd>
          </div>
        </dl>
      </PageHeader>

      {/* Einordnung */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading title="Worum es in diesem Bereich geht" />
            <div className="prose-sm24 mt-5">
              <p>
                {page?.intro
                  ?? 'Wir klären zuerst, was Ihr Fahrzeug braucht, und nennen Ihnen danach Preis oder '
                    + 'Preisrahmen. Erst dann buchen Sie einen Termin.'}
              </p>
              <p>
                Ein Autoschlüssel besteht aus zwei Teilen, die getrennt betrachtet werden: dem
                mechanischen Bart und der Elektronik. Für Ihren Auftrag ist entscheidend, welcher der
                beiden Teile bearbeitet werden muss — davon hängen Aufwand, Termin und Preis ab.
              </p>
              <p>
                Die folgenden Begriffe führen Sie zu der Seite, die Ihren Fall beschreibt. Wenn Sie
                unsicher sind, beginnen Sie mit dem geführten Ablauf: Dort fragen wir Schritt für
                Schritt genau die Angaben ab, die für Ihr Fahrzeug nötig sind.
              </p>
            </div>
          </div>

          <ImagePlaceholder
            slot={{
              motif: 'Werkstattfoto: Arbeitsplatz mit Schlüsselfräse und Diagnosegerät',
              ratio: '4/3',
              note: 'Eigene Aufnahme aus dem Betrieb. Kein Stockfoto.',
            }}
          />
        </div>
      </Section>


      {/* Architektonische Methodik und Glossar (Expansion) */}
      <Section>
        <SectionHeading
          eyebrow="Architektonische Methodik"
          title="Präzision in jedem Schritt: Autoschlüssel als Sicherheitssystem"
          lead="Unser Ansatz zur Fertigung und Programmierung von Autoschlüsseln basiert auf einer präzisen architektonischen Methodik. Jeder Schlüssel, sei es ein mechanischer Bart oder ein komplexer Smart-Key, wird als integriertes System betrachtet."
        />
        <div className="mt-8 prose-sm24 max-w-none space-y-6">
          <p>
            Die Phasen unserer Service-Implementierung sind strikt definiert und garantieren ein Höchstmaß an Zuverlässigkeit und Funktionalität. Wir verstehen, dass ein Autoschlüssel heute nicht mehr nur ein Stück Metall ist, sondern ein hochkomplexer Zugangsberechtigungsträger, der tief in die Fahrzeugelektronik integriert ist.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-8">1. Die Phasen unserer Service-Implementierung</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Initiierung und Bedarfsanalyse:</strong> Wir analysieren die spezifischen Anforderungen Ihres Fahrzeugs. Dies beinhaltet die Identifikation des Transponder-Typs, die Bewertung der mechanischen Eigenschaften des Schließzylinders und die Prüfung der elektronischen Schnittstellen (OBD2).</li>
            <li><strong>Projektierung und Lösungsdesign:</strong> Basierend auf der Analyse wählen wir die optimalen Rohlinge und mechatronischen Komponenten aus. Bei Wegfahrsperren planen wir den präzisen Programmierungsablauf, der je nach Fahrzeuggeneration von einfachen Klonvorgängen bis hin zu komplexen EEPROM-Manipulationen reicht.</li>
            <li><strong>Präzise Fertigung und Vorkonfiguration:</strong> Der mechanische Bart wird mit computergesteuerten CNC-Fräsen (z.B. Silca) mit absoluter Präzision nach Originalmaßen gefertigt. Dies minimiert den Verschleiß im Schloss und garantiert eine leichtgängige Bedienung, die der eines fabrikneuen Schlüssels entspricht.</li>
            <li><strong>Fachgerechte Montage und Integration:</strong> Elektronische Komponenten werden sicher in das Gehäuse integriert. Die Programmierung erfolgt unter Einhaltung strengster Sicherheitsstandards. Wir stellen sicher, dass die Kommunikation zwischen Transponder, Lesespule und Motorsteuergerät (ECU) fehlerfrei abläuft.</li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-8">2. Strukturierte Leistungsstufen und Vergleichsmatrizen</h3>
          <p>
             Wir bieten verschiedene Leistungsstufen an, um den unterschiedlichen Anforderungen, Fahrzeuggenerationen und Budgets unserer Kunden gerecht zu werden. Unsere strukturierte Vergleichsmatrix hilft Ihnen bei der Orientierung und zeigt transparent die technologischen Unterschiede auf:
          </p>
          <div className="table-scroll mt-6">
            <table className="w-full min-w-[40rem] border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-[oklch(0.89_0.008_260/0.55)]">
                  <th className="py-2.5 pr-6 text-left font-semibold text-[oklch(0.16_0.02_260)]">Leistungsstufe</th>
                  <th className="py-2.5 pr-6 text-left font-semibold text-[oklch(0.16_0.02_260)]">System-Beschreibung</th>
                  <th className="py-2.5 pr-6 text-left font-semibold text-[oklch(0.16_0.02_260)]">Mechanische Präzision</th>
                  <th className="py-2.5 pr-6 text-left font-semibold text-[oklch(0.16_0.02_260)]">Elektronische Integration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-6 font-medium">Standard-Kopie (Basic)</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">Präzise mechanische Kopie für einfache Schließsysteme.</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">CNC-gefräst nach Vorlage</td>
                  <td className="py-2.5 text-foreground-muted">Keine bzw. einfacher Festcode-Klon</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-6 font-medium">Erweiterte Prog. (Advanced)</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">Inklusive Anlernen der Wegfahrsperre über Diagnosegeräte.</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">CNC-gefräst nach Herstellercode</td>
                  <td className="py-2.5 text-foreground-muted">OBD2-Programmierung (Krypto-Transponder)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2.5 pr-6 font-medium">Premium Smart-Key (Pro)</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">Vollständige Keyless-Go-Integration und Komfortfunktionen.</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">Laser-gefräst (Innenbahnprofil)</td>
                  <td className="py-2.5 text-foreground-muted">Hochsichere Krypto-Transponder (AES-128)</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-6 font-medium">All-Keys-Lost (Emergency)</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">Wiederherstellung bei komplettem Schlüsselverlust.</td>
                  <td className="py-2.5 pr-6 text-foreground-muted">Nach Schloss-Decodierung gefräst</td>
                  <td className="py-2.5 text-foreground-muted">Direkter EEPROM/MCU Zugriff erforderlich</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-foreground mt-8">3. Häufig gestellte Fragen (FAQ) zur Autoschlüssel-Methodik</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground">Was genau ist eine Wegfahrsperre und wie wird sie elektronisch programmiert?</h4>
              <p className="mt-1">Die Wegfahrsperre (WFS) ist ein kritisches elektronisches Sicherheitssystem, das unbefugtes Starten des Motors verhindert. Im Schlüsselkopf befindet sich ein passiver RFID-Transponder, der bei Annäherung an das Zündschloss von der dortigen Lesespule energetisiert wird. Er sendet daraufhin einen kryptografischen Code an das Motorsteuergerät (ECU) oder das Kombiinstrument. Die Programmierung dieses Codes erfolgt in der Regel über die OBD2-Diagnoseschnittstelle des Fahrzeugs. Hierbei autorisieren wir mit speziellen Diagnosetestern den neuen Transpondercode im Steuergerät, sodass dieser fortan als berechtigt erkannt wird.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Warum kann ich meinen modernen Schlüssel nicht einfach im Baumarkt nachmachen lassen?</h4>
              <p className="mt-1">Moderne Autoschlüssel sind mechatronische Hochsicherheitssysteme. Während herkömmliche Schlüsseldienste oder Baumärkte oft nur in der Lage sind, den rein mechanischen Teil (den Schlüsselbart) zu kopieren, fehlt ihnen die Ausrüstung und das Know-how für die komplexe Elektronik. Ohne die korrekte Programmierung des integrierten Krypto-Transponders (wie z.B. Megamos Crypto, Texas Crypto oder NXP Hitag) wird das Fahrzeug den Startvorgang blockieren. Das Steuergerät erwartet eine spezifische kryptografische Antwort, die ein unprogrammierter Transponder nicht liefern kann.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Was ist das &quot;All Keys Lost&quot; (AKL) Szenario und warum ist es so aufwendig?</h4>
              <p className="mt-1">In einem &quot;All Keys Lost&quot;-Szenario (alle Originalschlüssel sind verloren gegangen) haben wir keinen Master-Schlüssel mehr, von dem wir Daten kopieren oder clonen könnten. Wir müssen daher &quot;von Null&quot; anfangen. Mechanisch bedeutet das, dass wir den Schließzylinder der Fahrertür decodieren müssen, um die Fräsdaten (den Bitting-Code) zu ermitteln. Elektronisch müssen wir oft direkt auf Speicherbausteine (EEPROM oder MCU) im Motorsteuergerät oder im Wegfahrsperren-Modul zugreifen. Dies erfordert das Ausbauen der Steuergeräte, mikroelektronische Eingriffe (Löten) und das Auslesen der Hex-Dumps, um daraus die nötigen Kryptodaten für die Generierung neuer Transponder zu extrahieren.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Wie stellen Sie die absolute Qualität und Passgenauigkeit der gefrästen Schlüsselbärte sicher?</h4>
              <p className="mt-1">Wir verlassen uns nicht auf einfaches &quot;Abpausen&quot; verschlissener Schlüssel. Stattdessen nutzen wir das Verfahren &quot;Fräsen nach Code&quot;. Wenn ein alter Schlüssel stark abgenutzt ist, decodieren wir die noch vorhandenen Einschnitte, ermitteln den originalen Herstellercode und fräsen den neuen Schlüsselbart auf unseren hochpräzisen, computergesteuerten CNC-Maschinen (z.B. von Silca oder Keyline) exakt auf die originalen Werksmaße zurück. So erhalten Sie einen Schlüssel, der mechanisch den Spezifikationen eines fabrikneuen Schlüssels entspricht und hakeliges Schließen verhindert.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Welche technologischen Standards kommen bei modernen Keyless-Go Systemen zum Einsatz?</h4>
              <p className="mt-1">Keyless-Go (Smart Keys) Systeme nutzen eine Kombination aus Niederfrequenz- (LF) und Hochfrequenz- (HF) Kommunikation. Antennen im Fahrzeug senden LF-Signale aus, die den Smart Key in der Nähe wecken. Der Key antwortet über HF (oft 433 MHz oder 868 MHz in Europa) mit einem verschlüsselten Rolling-Code (häufig basierend auf AES-128 oder proprietären Algorithmen), um das Fahrzeug zu entriegeln und den Startknopf (Push-to-Start) freizugeben. Die Programmierung dieser hochsicheren Systeme erfordert nicht nur die Anpassung der Wegfahrsperre, sondern auch die Synchronisation der Komfortelektronik-Module.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Gibt es Risiken für die Fahrzeugelektronik bei der Schlüsselprogrammierung?</h4>
              <p className="mt-1">Wenn die Programmierung von ungeschultem Personal mit minderwertigen Diagnose-Tools durchgeführt wird, besteht ein erhebliches Risiko, Steuergeräte zu &quot;bricken&quot; oder Flash-Speicher zu korrumpieren. Wir verwenden ausschließlich lizensierte, hochprofessionelle Diagnose- und Programmierhardware und verfügen über tiefgreifendes Wissen der fahrzeugspezifischen Bussysteme (CAN-Bus, LIN-Bus). Zudem führen wir vor jedem tiefen Eingriff in die Elektronik Spannungsstabilisierungen durch und sichern, wo möglich, Flash- und EEPROM-Daten, um einen maximalen Sicherheitsstandard zu garantieren.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted" id="glossar">
        <div className="mx-auto max-w-4xl">
          <LexicalGlossary />
        </div>
      </Section>

      {/* Leistungsbegriffe */}
      <Section tone="muted" id="leistungen">
        <SectionHeading
          eyebrow="Leistungen"
          title="Alle Begriffe, sauber getrennt"
          lead="Die Begriffe werden im Alltag oft vermischt. Hier steht, was jeweils gemeint ist und wohin er führt."
        />

        <div className="mt-8 space-y-8">
          {TOPIC_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold text-foreground">{group.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">
                      {group.lead}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.topics.map((topic) => (
                    <li key={topic.term}>
                      <Card className="flex h-full flex-col">
                        <CardBody className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-[15px] font-bold text-foreground">{topic.term}</h4>
                            {topic.hint && <InfoTip hint={topic.hint} className="shrink-0" />}
                          </div>
                          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                            {topic.body}
                          </p>
                          <Link
                            href={topic.href}
                            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                          >
                            Zur Seite
                            <ArrowRight size={15} aria-hidden />
                            <span className="sr-only">{topic.term}</span>
                          </Link>
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Ablauf in fünf Schritten */}
      <Section id="ablauf">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Ablauf"
              title="In fünf Schritten zum Termin"
              lead="Mobil bedienbar. Ihre Eingaben bleiben erhalten, wenn Sie zwischendurch abbrechen."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/autoschluessel/anfrage" size="lg">
                Ablauf starten
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <ButtonLink href="/autoschluessel/marken" size="lg" variant="outline">
                Erst Fahrzeug nachschlagen
              </ButtonLink>
            </div>

            <Alert tone="info" title="Anzahlung und Vorlauf" className="mt-7">
              Die Anzahlung beträgt standardmäßig {deposit} und wird vollständig auf den Gesamtpreis
              angerechnet. Der Vorlauf von etwa {leadDays} Tagen entsteht durch die Beschaffung des
              passenden Schlüssels. Für einzelne Fahrzeuge und Leistungen können abweichende Werte
              gelten — diese sehen Sie im Ablauf, bevor Sie etwas verbindlich buchen.
            </Alert>
          </div>

          <ol className="relative space-y-5 border-l border-border pl-7">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[38px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-display text-xs font-bold text-primary"
                >
                  {index + 1}
                </span>
                <h3 className="text-[15px] font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Fahrzeuge */}
      <Section tone="muted" tight>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Fahrzeuge"
              title="Was für Ihre Marke und Ihr Modell gilt"
              lead={`Zu ${makes.length} Marken und ${modelCount} Modellen haben wir hinterlegt, welche Schlüsselarten vorkommen und ob das Fahrzeug zum Anlernen vor Ort sein muss.`}
            />
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/autoschluessel/marken">
                Alle Marken ansehen
                <ArrowRight size={17} aria-hidden />
              </ButtonLink>
              <InfoTip hint={KEY_KIND_HINT} />
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {makes.slice(0, 9).map((make) => (
              <li key={make.id}>
                <Link
                  href={`/autoschluessel/marken/${make.slug}`}
                  className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {make.name}
                  <ArrowRight size={14} aria-hidden className="shrink-0 text-foreground-subtle" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Fragen */}
      <Section>
        <SectionHeading
          eyebrow="Häufige Fragen"
          title="Was vor dem Auftrag meist offen ist"
          className="max-w-2xl"
        />
        <Accordion items={page?.faq?.length ? page.faq : FAQ} className="mt-8" />
      </Section>

      {/* Weiterführend */}
      <Section tone="muted" tight>
        <SectionHeading
          title="Weiterführende Seiten"
          lead="Passend zum Thema Autoschlüssel."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/autoschluessel/anfrage', label: 'Geführter Ablauf', description: 'Fahrzeug wählen, Preis erhalten, Termin buchen' },
            { href: '/autoschluessel/marken', label: 'Marken und Modelle', description: 'Schlüsselarten je Fahrzeug nachschlagen' },
            { href: '/ratgeber/autoschluessel-verloren-was-tun', label: 'Schlüssel verloren — was tun?', description: 'Die richtige Reihenfolge' },
            { href: '/ratgeber/unterschied-kopie-und-programmierung', label: 'Kopie oder Programmierung?', description: 'Der Unterschied kurz erklärt' },
            { href: '/schluessel-nach-vorlage', label: 'Schlüssel nach Vorlage', description: 'Für Schlüssel ohne Fahrzeugbezug' },
            { href: '/service-und-termin/terminstatus', label: 'Terminstatus', description: 'Stand Ihres Vorgangs abrufen' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full min-h-[44px] flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
              >
                <span className="text-[15px] font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                </span>
                <span className="mt-1 text-[13px] leading-relaxed text-foreground-muted">
                  {link.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
