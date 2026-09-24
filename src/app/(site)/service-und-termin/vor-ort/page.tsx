import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getCities, getSettings } from '@/lib/data';
import { Alert } from '@/components/ui/alert';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { PageHeader } from '@/components/layout/page-header';
import { Section, SectionHeading } from '@/components/layout/section';

export const metadata: Metadata = {
  title: 'Vor-Ort-Leistungen',
  description:
    'Welche Arbeiten wir direkt bei Ihnen im Objekt oder am Fahrzeug erledigen und was dafür '
    + 'vorbereitet sein muss.',
  alternates: { canonical: '/service-und-termin/vor-ort' },
};

const SERVICES = [
  {
    title: 'Autoschlüssel am Fahrzeug',
    body:
      'Programmieren und Anlernen setzen Zugriff auf das Fahrzeug voraus. Diese Arbeiten lassen '
      + 'sich nicht per Versand erledigen.',
    needs: [
      'Fahrzeug am vereinbarten Ort',
      'Fahrzeugschein im Original',
      'Nachweis, dass Sie über das Fahrzeug verfügen dürfen',
    ],
    href: '/autoschluessel/anfrage',
    cta: 'Termin starten',
  },
  {
    title: 'Zylinder- und Schlosstausch',
    body:
      'Austausch von Zylindern, Einsteckschlössern, Beschlägen und Türzusatzschlössern an der '
      + 'eingebauten Tür.',
    needs: ['Zugang zur Tür', 'Maße oder der ausgebaute Zylinder', 'freier Arbeitsbereich'],
    href: '/tuer-und-schliesstechnik',
    cta: 'Zur Tür- und Schließtechnik',
  },
  {
    title: 'Montage von Schließanlagen',
    body:
      'Einbau der Zylinder nach Schließplan, Beschriftung der Schlüssel und Übergabe der '
      + 'Unterlagen.',
    needs: ['Zugang zu allen Türen der Anlage', 'anwesende verantwortliche Person', 'Schließplan'],
    href: '/schliessanlagen/konfigurator',
    cta: 'Projekt erfassen',
  },
  {
    title: 'Elektronische Zutrittslösungen einrichten',
    body: 'Montage, Einrichtung der Benutzerverwaltung und Einweisung in die Bedienung.',
    needs: ['Strom und, falls nötig, Netzwerk', 'Liste der Nutzer und Berechtigungen'],
    href: '/elektronische-zutrittsloesungen/konfigurator',
    cta: 'Bedarf erfassen',
  },
  {
    title: 'Sicherheitstechnik installieren',
    body:
      'Montage von Kameras, Meldern und Kontakten sowie Einrichtung der Alarmierungswege.',
    needs: ['Zugang zu allen betroffenen Bereichen', 'Internetzugang, falls App-Steuerung gewünscht'],
    href: '/sicherheitstechnik/sicherheitscheck',
    cta: 'Sicherheitscheck starten',
  },
  {
    title: 'Bestandsaufnahme und Beratung',
    body:
      'Wir sehen uns die vorhandene Situation an und sagen Ihnen, was sinnvoll ist — als Grundlage '
      + 'für ein belastbares Angebot.',
    needs: ['Zugang zum Objekt', 'vorhandene Unterlagen, falls verfügbar'],
    href: '/service-und-termin/anfrage',
    cta: 'Beratungstermin anfragen',
  },
];

export default async function VorOrtPage() {
  const [settings, cities] = await Promise.all([getSettings(), getCities()]);

  return (
    <>
      <PageHeader
        eyebrow="Vor Ort"
        title="Was wir direkt bei Ihnen erledigen"
        lead="Nicht jede Arbeit lässt sich per Versand lösen. Hier steht, was vor Ort passiert und was dafür vorbereitet sein sollte."
        crumbs={[
          { href: '/service-und-termin', label: 'Service und Termin' },
          { href: '/service-und-termin/vor-ort', label: 'Vor-Ort-Leistungen' },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div>
            <SectionHeading title="Leistungen im Überblick" />
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {SERVICES.map((service) => (
                <li key={service.title}>
                  <Card className="h-full">
                    <CardBody className="flex h-full flex-col">
                      <p className="text-[15px] font-bold text-foreground">{service.title}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                        {service.body}
                      </p>
                      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                        Bitte vorbereiten
                      </p>
                      <ul className="mt-1.5 flex-1 space-y-1">
                        {service.needs.map((need) => (
                          <li key={need} className="text-[13px] text-foreground-muted">
                            · {need}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={service.href}
                        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline"
                      >
                        {service.cta}
                        <ArrowRight size={14} aria-hidden />
                      </Link>
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ImagePlaceholder
              slot={{
                motif: 'Montagesituation: Zylindertausch an einer Wohnungstür',
                ratio: '4/3',
                note: 'Echtes Foto aus einem abgeschlossenen Auftrag, Persönlichkeitsrechte beachten.',
              }}
            />

            <Alert tone="legal" title="Nachweis der Verfügungsberechtigung" className="mt-6">
              Vor Arbeiten an Fahrzeugen, Türen und Schließanlagen weisen Sie bitte nach, dass Sie
              über das Objekt verfügen dürfen. Das schützt Sie und uns. Welche Nachweise wir
              benötigen, sagen wir Ihnen bei der Terminbestätigung.
            </Alert>

            <div className="mt-6 rounded-lg border border-border bg-surface p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-subtle">
                Einsatzgebiete
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                Vor-Ort-Leistungen erbringen wir in folgenden Regionen. Bestellungen aus dem Shop
                liefern wir deutschlandweit.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {cities.map((city) => (
                  <li key={city.id}>
                    <Link
                      href={`/standorte/${city.slug}`}
                      className="text-[13px] font-semibold text-primary hover:underline"
                    >
                      {city.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-surface-muted p-5">
              <p className="text-[15px] font-bold text-foreground">Terminvorlauf</p>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                Termine für Autoschlüssel bieten wir in der Regel ab etwa{' '}
                {settings.booking.leadTimeDays} Tagen an, damit fahrzeugspezifisches Material sicher
                beschafft und vorbereitet werden kann.
              </p>
              <ButtonLink href="/autoschluessel/anfrage" className="mt-4" size="sm">
                Termin starten
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
