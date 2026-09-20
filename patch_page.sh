#!/bin/bash
# A script to patch src/app/schliessanlagen/page.tsx

cat << 'INNER_EOF' > temp_patch_content.txt
<<<<<<< SEARCH
      {/* Einstieg und Begriffe */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-[15px] leading-relaxed text-foreground-muted md:text-base">
              {page?.intro
                ?? 'Eine Schließanlage regelt, wer welche Tür öffnen darf. Wir erklären die Systeme '
                  + 'in einfacher Sprache und planen Ihre Anlage so, dass sie später erweitert '
                  + 'werden kann.'}
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Der Weg dorthin ist immer derselbe: Sie erfassen Ihr Objekt, Ihre Nutzer und Ihre
              Türen. Daraus entsteht ein Schließplan, den wir gemeinsam mit Ihnen abstimmen. Erst
              danach wird gefertigt.
            </p>
=======
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <EnterpriseROICalculator />
      </div>

      {/* Einstieg und Begriffe */}
      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-[15px] leading-relaxed text-foreground-muted md:text-base">
              Eine Schließanlage regelt, wer welche Tür öffnen darf — und wer nicht. Sie ist das mechanische Rückgrat
              der Gebäudesicherheit. In gewerblichen, öffentlichen oder komplexen privaten Objekten reicht es nicht
              mehr aus, jeder Tür einfach einen Zylinder mit eigenen Schlüsseln zuzuordnen. Dies würde in kürzester
              Zeit zu einem unübersichtlichen Schlüsselbund, hohem Verwaltungsaufwand und vor allem zu massiven
              Sicherheitsrisiken führen. Wir konzipieren und fertigen Schließanlagen, die exakt auf die
              Organisationsstruktur Ihres Gebäudes abgestimmt sind.
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Die architektonische Methodik hinter einer professionellen Schließanlage basiert auf der klaren
              Trennung von Zutrittsberechtigungen. Ob Sie ein Mehrfamilienhaus verwalten, bei dem der Haustürschlüssel
              zwar die Wohnungstür des jeweiligen Mieters öffnet, nicht aber die des Nachbarn (Zentralschlossanlage),
              oder ob Sie ein mehrstöckiges Bürogebäude leiten, in dem Abteilungsleiter Zugang zu ihrer gesamten
              Etage haben, während der Geschäftsführer das komplette Gebäude begehen kann (Generalhauptschlüsselanlage)
              — wir übersetzen Ihre Anforderungen in einen präzisen mechanischen Schließplan.
            </p>

            <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
              Der Weg dorthin folgt einer etablierten Systematik: Sie erfassen zunächst Ihr Objekt, definieren die
              Nutzergruppen und listen die betroffenen Türen auf. Diese dreidimensionale Matrix (Ort, Person, Berechtigung)
              bildet das Fundament. Daraus entwickeln wir einen detaillierten Schließplan, den wir intensiv mit Ihnen
              abstimmen und auf künftige Erweiterungspotenziale prüfen. Erst wenn jede Hierarchiestufe logisch
              geschlossen ist und die Investitionssicherheit gewährleistet ist, gehen wir in die Fertigung.
            </p>
>>>>>>> REPLACE
<<<<<<< SEARCH
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;
  const process = PROCESS_LABELS.projektkonfigurator;

  return (
    <>
      <PageHeader
=======
  const faq = page?.faq?.length ? page.faq : FALLBACK_FAQ;

  // Extend FAQ if it's the fallback
  const extendedFaq = page?.faq?.length ? page.faq : [
    ...FALLBACK_FAQ,
    {
      question: 'Wie verhält es sich mit dem Patentschutz bei Schließanlagen?',
      answer: 'Der Patentschutz ist entscheidend für die Sicherheit Ihrer Anlage. Er garantiert, dass Schlüsselrohlinge nicht frei im Handel erhältlich sind. Nur gegen Vorlage der Sicherungskarte, die Sie mit der Anlage erhalten, dürfen berechtigte Fachhändler Ersatzschlüssel oder weitere Zylinder beim Hersteller bestellen oder selbst anfertigen. Wir empfehlen dringend Systeme mit einer langen Restlaufzeit des Patents.'
    },
    {
      question: 'Können mechanische und elektronische Systeme kombiniert werden?',
      answer: 'Ja, das ist gängige Praxis und oft die wirtschaftlichste Lösung (Mechatronische Schließanlage). Die Außenhülle und sensible Bereiche werden mit elektronischen Zylindern ausgestattet, um bei Schlüsselverlust schnell reagieren zu können. Innentüren mit geringerem Sicherheitsbedarf erhalten kostengünstigere mechanische Zylinder. Moderne Hybridschlüssel vereinen beide Technologien in einem Medium.'
    },
    {
      question: 'Was passiert, wenn ein Generalhauptschlüssel verloren geht?',
      answer: 'Der Verlust eines GHS (Generalhauptschlüssel) ist bei rein mechanischen Anlagen ein "Super-GAU". Um die Sicherheit wiederherzustellen, müssen im schlimmsten Fall alle Zylinder ausgetauscht werden. Die Kosten können immens sein (siehe ROI-Rechner). Genau deshalb empfehlen wir für hochrangige Schlüssel elektronische Lösungen oder strikte organisatorische Maßnahmen zur Verwahrung.'
    },
    {
      question: 'Wie schnell können Nachbestellungen geliefert werden?',
      answer: 'Das hängt vom System ab. Bei Eigenprofilen, die wir in unserer eigenen Werkstatt fräsen und stiften dürfen, können wir Ersatzschlüssel oder Erweiterungszylinder oft innerhalb von 24 bis 48 Stunden liefern. Bei Werksanlagen, die direkt beim Hersteller (z.B. DOM, BKS, EVVA) gefertigt werden müssen, liegt die Lieferzeit typischerweise bei 1 bis 3 Wochen.'
    },
    {
      question: 'Was ist eine Sicherungskarte?',
      answer: 'Die Sicherungskarte (auch Identifikationskarte) ist der "Fahrzeugbrief" Ihrer Schließanlage. Sie weist Sie als rechtmäßigen Eigentümer aus. Ohne diese physische Karte (oder zunehmend auch digitale Authentifizierung) dürfen keine Schlüssel oder Zylinder nachgemacht werden. Sie muss deshalb sicher, idealerweise in einem Tresor, aufbewahrt werden.'
    }
  ];

  const process = PROCESS_LABELS.projektkonfigurator;

  // Add the calculator import
  // (We handle this by replacing the imports block)

  return (
    <>
      <PageHeader
>>>>>>> REPLACE
<<<<<<< SEARCH
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';

import { getPageContent } from '@/lib/data';
=======
import { ArrowRight, Building2, Layers, Users } from 'lucide-react';

import { getPageContent } from '@/lib/data';
import { EnterpriseROICalculator } from '@/components/calculator/enterprise-roi-calculator';
>>>>>>> REPLACE
<<<<<<< SEARCH
      {/* Fragen */}
      <Section>
        <SectionHeading eyebrow="Fragen" title="Häufige Fragen zu Schließanlagen" />
        <div className="mt-8">
          <Accordion items={faq} />
        </div>
      </Section>
=======
      {/* Fragen */}
      <Section>
        <SectionHeading eyebrow="Fragen" title="Häufige Fragen zu Schließanlagen" />
        <div className="mt-8">
          <Accordion items={extendedFaq} />
        </div>
      </Section>
>>>>>>> REPLACE
INNER_EOF

# Apply the patch using default_api:replace_with_git_merge_diff
