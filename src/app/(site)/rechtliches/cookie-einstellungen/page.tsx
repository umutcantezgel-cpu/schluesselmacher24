import type { Metadata } from 'next';
import Link from 'next/link';

import { gaMessId } from '@/lib/statistik';

import { CookieSettings } from './cookie-einstellungen';

export const metadata: Metadata = {
  title: 'Cookie-Einstellungen',
  description: 'Welche Daten diese Website in Ihrem Browser speichert und wie Sie das steuern.',
  robots: { index: false, follow: true },
};

export default function CookieEinstellungenPage() {
  // Google Analytics nur, wenn eine Mess-ID gesetzt ist — sonst bleibt die Seite wie bisher.
  const statistik = Boolean(gaMessId());
  return (
    <>
      <h1 className="text-headline font-bold text-balance">Cookie-Einstellungen</h1>
      {statistik ? (
        <p className="mt-3">
          Diese Website setzt keine Werbe- oder Marketingdienste ein. Für die Reichweitenmessung
          nutzen wir Google Analytics — aber nur, wenn Sie unten in „Statistik“ einwilligen. Alles
          Weitere, was gespeichert wird, ist für die von Ihnen genutzten Funktionen technisch
          notwendig und liegt im lokalen Speicher Ihres Browsers; dafür ist keine Einwilligung
          erforderlich.
        </p>
      ) : (
        <p className="mt-3">
          Diese Website setzt keine Analyse-, Werbe- oder Marketingdienste ein und bindet keine
          Inhalte fremder Anbieter ein. Gespeichert wird nur, was für die von Ihnen genutzten
          Funktionen technisch notwendig ist — und zwar im lokalen Speicher Ihres Browsers. Eine
          Einwilligung ist dafür nicht erforderlich.
        </p>
      )}

      <CookieSettings statistikAktiv={statistik} />

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
        Diese Angaben bleiben in Ihrem Browser, bis Sie einen Vorgang absenden. Sie können sie
        jederzeit über die Schaltfläche oben oder über die Einstellungen Ihres Browsers löschen.
        Fotos und Unterlagen, die Sie in einem Formular auswählen, werden dagegen sofort an uns
        übertragen; Einzelheiten stehen in der{' '}
        <Link href="/rechtliches/datenschutz">Datenschutzerklärung</Link>.
      </p>

      {statistik && (
        <>
          <h2>Statistik mit Google Analytics</h2>
          <p>
            Nur mit Ihrer Einwilligung lädt die Seite Google Analytics 4. Google setzt dann die
            Cookies <code>_ga</code> und <code>_ga_…</code> mit einer zufälligen Kennung (Laufzeit bis
            zu 2 Jahre). Ohne Einwilligung wird das Skript nicht geladen. Widerrufen Sie die
            Einwilligung oben, endet die Messung sofort und die Cookies werden gelöscht. Einzelheiten
            stehen in der <Link href="/rechtliches/datenschutz">Datenschutzerklärung</Link>.
          </p>
        </>
      )}

      <h2>Online-Zahlung</h2>
      <p>
        Für die Online-Zahlung leiten wir Sie auf die Bezahlseite von Stripe weiter. Auf unserer
        Website selbst werden dafür keine Skripte oder Cookies von Stripe geladen. Was Stripe auf
        seiner Bezahlseite speichert, regelt die Datenschutzerklärung von Stripe.
      </p>
    </>
  );
}
