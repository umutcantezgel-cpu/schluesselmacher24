import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { getGuides } from '@/lib/data';
import { NAV_AREAS } from '@/lib/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { GuideFilter } from '@/components/ratgeber/guide-filter';

export const metadata: Metadata = {
  title: 'Ratgeber',
  description:
    'Antworten auf die häufigsten Fragen rund um Autoschlüssel, Schlüssel, Schließtechnik und '
    + 'Einbruchschutz — jeweils mit einem klaren nächsten Schritt.',
  alternates: { canonical: '/ratgeber' },
};

interface Props {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RatgeberPage({ params, searchParams }: Props) {

  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const query = resolvedSearch.query?.toString().toLowerCase() || '';
  const category = resolvedSearch.category?.toString() || 'all';
  const guides = await getGuides();

  // Nach Themenbereich gruppieren, damit die Übersicht der Navigation folgt.
  const filteredGuides = guides.filter((g) => {
    const matchesQuery = query ? (g.title.toLowerCase().includes(query) || g.excerpt.toLowerCase().includes(query)) : true;
    const matchesCategory = category === 'all' ? true : g.topic === category;
    return matchesQuery && matchesCategory;
  });

  const grouped = NAV_AREAS.map((area) => ({
    area,
    guides: filteredGuides.filter((g) => g.topic === area.key),
  })).filter((group) => group.guides.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Ratgeber"
        title="Antworten auf die häufigsten Fragen"
        lead="Jeder Beitrag beantwortet eine konkrete Frage und sagt Ihnen, was Sie danach tun können."
        crumbs={[{ href: '/ratgeber', label: 'Ratgeber' }]}
      />

      <Section>
        <div className="prose-sm24 max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight mb-6">Umfassendes Expertenwissen für Ihre Sicherheit</h2>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Die Wahl der richtigen Sicherheitstechnik ist eine komplexe Entscheidung, die weitreichende Konsequenzen für den Schutz von Personen und Sachwerten hat. Unser Ratgeber dient als fundierte Wissensbasis, um Ihnen tiefgreifende Einblicke in die architektonische Methodik moderner Sicherheitssysteme zu geben. Wir beleuchten nicht nur die technischen Spezifikationen einzelner Komponenten, sondern analysieren das Zusammenspiel verschiedener Gewerke – von der mechanischen Grundsicherung bis hin zu hochkomplexen, vernetzten Zutrittskontrollsystemen.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Eine Schließanlage ist weit mehr als eine Ansammlung von Zylindern und Schlüsseln. Sie ist das mechanische oder elektronische Rückgrat der Gebäudeorganisation. Die Planung erfordert eine detaillierte Analyse der Organisationsstrukturen und der räumlichen Gegebenheiten. Wir unterscheiden prinzipiell zwischen Zentralschlossanlagen (Z-Anlagen), Hauptschlüsselanlagen (HS-Anlagen) und Generalhauptschlüsselanlagen (GHS-Anlagen).
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Bei der Konzeption einer GHS-Anlage für gewerbliche oder öffentliche Objekte muss beispielsweise das Prinzip der Minimalvergabe angewendet werden: Jeder Nutzer erhält nur exakt die Berechtigungen, die er für seine Aufgaben benötigt. Dies minimiert das Risiko bei Schlüsselverlusten. Zudem ist die Skalierbarkeit ein entscheidender Faktor. Eine professionell geplante Anlage verfügt über ausreichende Reserven im Schließplan, um zukünftige Erweiterungen ohne strukturelle Neukonzeption zu ermöglichen.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Der Trend in der Sicherheitstechnik geht unaufhaltsam in Richtung elektronischer und mechatronischer Systeme. Elektronische Schließzylinder, smarte Türdrücker und Wandleser bieten eine beispiellose Flexibilität. Im Gegensatz zu mechanischen Schlüsseln können elektronische Transponder (z.B. basierend auf MIFARE DESFire EV2/EV3 oder LEGIC Advant) bei Verlust sofort im System gesperrt werden.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Ein weiterer entscheidender Vorteil ist die Protokollierbarkeit von Zutrittsereignissen. In sicherheitskritischen Bereichen lässt sich lückenlos nachvollziehen, wer wann welchen Raum betreten hat. Die Integration in übergeordnete Gebäudemanagementsysteme ermöglicht zudem Synergieeffekte, wie etwa die automatische Steuerung von Beleuchtung und Klimatisierung basierend auf der Raumbelegung. Wir beraten Sie detailliert zu den Unterschieden zwischen Offline-Systemen (Data-on-Card), Funk-Online-Systemen und vollständig verkabelten Online-Systemen.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Trotz aller elektronischen Innovationen bleibt der mechanische Einbruchschutz das unverzichtbare Fundament jeder Sicherheitsarchitektur. Eine Alarmanlage (Gefahrenmeldeanlage) kann einen Einbruch nur melden, aber nicht verhindern. Die Mechanik hingegen setzt dem Angreifer physischen Widerstand entgegen.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Wir richten uns bei der Bewertung von Fenstern und Türen nach den europäischen Prüfnormen DIN EN 1627 bis 1630, welche die Resistance Classes (RC) definieren. Für den privaten Bereich empfehlen wir mindestens RC 2, besser RC 3. Dies erfordert ein abgestimmtes System aus einbruchhemmendem Türblatt, stabiler Zarge, Sicherheitsschließblechen, Mehrfachverriegelungen und geprüften Sicherheitsbeschlägen mit Zylinderabdeckung. Ein Profilzylinder nach DIN EN 1303 mit integriertem Bohr- und Ziehschutz rundet das Sicherheitskonzept ab.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Videoüberwachungssysteme (CCTV) und Einbruchmeldeanlagen (EMA) bilden die nächste Stufe der Sicherheitsarchitektur. Moderne IP-Kamerasysteme bieten hochauflösende Bilder, selbst bei schwierigen Lichtverhältnissen (WDR - Wide Dynamic Range) oder in völliger Dunkelheit durch Infrarot-Illuminatoren.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Entscheidend für die Wirksamkeit ist jedoch die intelligente Videoanalyse (Video Content Analysis - VCA). Algorithmen können Fehlalarme durch Tiere oder Witterungseinflüsse minimieren und das Sicherheitspersonal gezielt auf relevante Vorfälle (z.B. Line Crossing, Intrusion Detection) hinweisen. Bei der Planung von Videoüberwachungssystemen müssen stets die strengen Vorgaben der DSGVO und des Bundesdatenschutzgesetzes beachtet werden.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Moderne elektronische Schließsysteme verwenden hochsichere Verschlüsselungsstandards wie AES-128. Die Kommunikation zwischen Transponder und Zylinder ist kryptografisch abgesichert. Physische Angriffe auf den Zylinder (z.B. Magnetfelder) werden durch spezielle Konstruktionen (sog. Freilauf-Kupplungen) abgewehrt. Absolute Sicherheit gibt es zwar nicht, jedoch ist das Risiko eines erfolgreichen, unbemerkten Hacks bei aktuellen Systemen namhafter Hersteller extrem gering.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Für Gewerbebetriebe und Objekte mit hohen Sachwerten ist eine VdS-Zertifizierung oft von den Versicherern vorgeschrieben. Aber auch im gehobenen Privatbereich bietet die VdS-Anerkennung (Klasse A, B oder C) die Gewissheit, dass die verwendeten Komponenten und die Art der Installation höchsten Qualitäts- und Sicherheitsstandards entsprechen. Sie garantiert zudem, dass bei einer Aufschaltung auf einen Wachdienst die Alarmübertragung zuverlässig funktioniert.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Ja, viele moderne Zutrittskontrollsysteme bieten Schnittstellen (APIs) oder standardisierte Protokolle (wie KNX oder Matter) zur Integration in Smart-Home-Umgebungen. So lässt sich beispielsweise einstellen, dass beim Verlassen des Hauses und Abschließen der Tür (oder Scharfschalten der Alarmanlage) automatisch die Beleuchtung deaktiviert und die Heizung abgesenkt wird. Wir achten bei der Planung jedoch strikt auf die logische Trennung von sicherheitskritischen und komfortorientierten Netzwerken.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Beim &quot;Ziehen&quot; (auch Kernziehen genannt) dreht der Einbrecher eine spezielle Zugschraube in den Schließzylinder und zieht diesen dann mit enormer Kraft mithilfe einer Vorrichtung aus dem Schloss. Ein Ziehschutz verhindert dies. Dieser kann entweder direkt im Zylinder integriert sein (z.B. durch modulare Stahlstege) oder durch einen entsprechenden Sicherheitsbeschlag mit Zylinderabdeckung realisiert werden. Wir empfehlen grundsätzlich die Kombination aus beidem.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Die Batterielebensdauer hängt stark von der Nutzungshäufigkeit und den Umgebungsbedingungen (insbesondere der Temperatur) ab. Im Durchschnitt halten die Lithium-Batterien in elektronischen Zylindern zwischen 40.000 und 80.000 Schließzyklen oder etwa 2 bis 4 Jahre. Die Systeme warnen rechtzeitig mehrstufig (optisch und akustisch), bevor die Batterie leer ist. Im Notfall bieten die meisten Hersteller spezielle Programmiergeräte zur externen Bestromung an.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Die Integration moderner Schließtechnik erfordert eine sorgfältige Analyse der bestehenden Infrastruktur. Oftmals stoßen wir auf historisch gewachsene Systeme, die nicht mehr den aktuellen Sicherheitsstandards entsprechen. Eine schrittweise Migration von mechanischen zu elektronischen Systemen (Mechatronik) kann hierbei ein pragmatischer Ansatz sein, um Investitionen zu schützen und gleichzeitig das Sicherheitsniveau signifikant zu erhöhen. Dabei werden kritische Außentüren mit elektronischen Komponenten ausgestattet, während im Innenbereich weiterhin mechanische Schließzylinder verwendet werden, die jedoch mit demselben Medium (z.B. einem Kombischlüssel mit RFID-Chip) bedient werden können.
          </p>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed mb-4">
            Darüber hinaus spielt die Schulung der Mitarbeiter eine essenzielle Rolle. Die beste Technik ist wertlos, wenn sie nicht korrekt bedient wird oder durch organisatorische Mängel (z.B. Weitergabe von Passwörtern oder Transpondern) kompromittiert wird. Wir bieten daher umfassende Einweisungen und Sensibilisierungsschulungen an, um das Sicherheitsbewusstsein im Unternehmen nachhaltig zu stärken und die ordnungsgemäße Nutzung der implementierten Systeme zu gewährleisten.
          </p>

        </div>

        <GuideFilter />

        <div className="space-y-12" data-params={JSON.stringify(resolvedParams)} data-search={JSON.stringify(resolvedSearch)}>
          {grouped.map((group) => (
            <div key={group.area.key}>
              <h2 className="text-lg font-bold text-foreground">{group.area.label}</h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {group.guides.map((guide) => (
                  <li key={guide.id}>
                    <Link
                      href={`/ratgeber/${guide.slug}`}
                      className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary"
                    >
                      <span className="text-[15px] font-bold text-foreground group-hover:text-primary">
                        {guide.title}
                      </span>
                      <span className="mt-2 flex-1 text-[14px] leading-relaxed text-foreground-muted">
                        {guide.excerpt}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                        Lesen
                        <ArrowRight size={14} aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
