import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Anbieterkennzeichnung von SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default async function ImpressumPage() {
  const { company } = await getSettings();

  return (
    <>
      <h1 className="text-[1.75rem] font-bold leading-tight md:text-3xl">Impressum</h1>
      <p className="mt-3">Angaben gemäß den gesetzlichen Informationspflichten für Diensteanbieter.</p>

      <h2>Anbieter</h2>
      <p>
        {company.legalName}
        <br />
        {company.street}
        <br />
        {company.postalCode} {company.city}
        <br />
        {company.country}
      </p>

      <h2>Vertreten durch</h2>
      <p>{company.managingDirector}</p>

      <h2>Kontakt</h2>
      <p>
        Telefon: {company.phone}
        <br />
        E-Mail: {company.email}
      </p>

      <h2>Registereintrag</h2>
      <p>
        Registergericht: {company.registerCourt}
        <br />
        Registernummer: {company.registerNumber}
      </p>

      <h2>Umsatzsteuer-Identifikationsnummer</h2>
      <p>{company.vatId}</p>

      <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
      <p>
        [Platzhalter: Falls eine reglementierte Tätigkeit ausgeübt wird, hier Berufsbezeichnung,
        zuständige Kammer, verleihender Staat und die maßgeblichen berufsrechtlichen Regelungen
        mit Fundstelle eintragen. Für Betriebe des Schlüsseldienst- und Sicherheitshandwerks ist
        zu prüfen, welche Eintragungen und Nachweise anzugeben sind.]
      </p>

      <h2>Aufsichtsbehörde</h2>
      <p>[Platzhalter: zuständige Aufsichtsbehörde mit Anschrift, sofern erforderlich.]</p>

      <h2>Verantwortlich für den Inhalt</h2>
      <p>
        [Platzhalter: Name und Anschrift der inhaltlich verantwortlichen Person, sofern von den
        Anbieterangaben abweichend.]
      </p>

      <h2>Streitbeilegung</h2>
      <p>
        [Platzhalter: Angaben zur Teilnahme oder Nichtteilnahme an Streitbeilegungsverfahren vor
        einer Verbraucherschlichtungsstelle sowie der Hinweis auf die Plattform der Europäischen
        Kommission zur Online-Streitbeilegung, soweit die Pflicht besteht. Der genaue Wortlaut ist
        anwaltlich abzustimmen.]
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        [Platzhalter: Haftungshinweise zu eigenen Inhalten und zu verlinkten fremden Inhalten.
        Bitte juristisch prüfen lassen; Standardformulierungen aus dem Netz sind nicht
        ungeprüft zu übernehmen.]
      </p>

      <h2>Urheberrecht</h2>
      <p>[Platzhalter: Hinweise zu Urheber- und Leistungsschutzrechten an den Inhalten dieser Seite.]</p>
    </>
  );
}
