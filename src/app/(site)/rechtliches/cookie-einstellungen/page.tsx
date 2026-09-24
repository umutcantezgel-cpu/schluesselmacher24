import type { Metadata } from 'next';
import { CookieSettings } from './cookie-einstellungen';

export const metadata: Metadata = {
  title: 'Cookie-Einstellungen',
  description: 'Welche Daten diese Website in Ihrem Browser speichert und wie Sie das steuern.',
  robots: { index: false, follow: true },
};

export default function CookieEinstellungenPage() {
  return (
    <>
      <h1 className="text-[1.75rem] font-bold leading-tight md:text-3xl">Cookie-Einstellungen</h1>
      <p className="mt-3">
        Diese Website kommt derzeit ohne Analyse-, Werbe- und Fremddienste aus. Gespeichert wird
        nur, was für den Betrieb nötig ist — und zwar ausschließlich in Ihrem Browser.
      </p>

      <CookieSettings />

      <h2>Was genau gespeichert wird</h2>
      <ul>
        <li>
          <strong>Warenkorb</strong> — damit ausgewählte Artikel beim Wechsel zwischen Seiten
          erhalten bleiben.
        </li>
        <li>
          <strong>Zwischenstand in Formularen und Konfiguratoren</strong> — damit ein langer
          Konfigurator nicht verloren geht, wenn Sie unterbrochen werden.
        </li>
        <li>
          <strong>Ihre Auswahl auf dieser Seite</strong> — damit wir sie beim nächsten Besuch
          berücksichtigen können.
        </li>
      </ul>
      <p>
        Diese Daten werden nicht an uns übertragen, solange Sie einen Vorgang nicht absenden. Sie
        können sie jederzeit über die Schaltfläche oben oder über die Einstellungen Ihres Browsers
        löschen.
      </p>

      <h2>Sobald weitere Dienste hinzukommen</h2>
      <p>
        [Platzhalter: Sobald Analyse-, Karten-, Zahlungs- oder Marketingdienste eingebunden werden,
        müssen sie hier einzeln mit Zweck, Anbieter, Speicherdauer und Rechtsgrundlage aufgeführt
        werden. Die Einwilligung ist dann vor dem Laden dieser Dienste einzuholen; die Umschalter
        auf dieser Seite sind dafür bereits vorgesehen. Die Ausgestaltung ist vor Livegang
        juristisch zu prüfen.]
      </p>
    </>
  );
}
