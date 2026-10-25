'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { einwilligungLesen, einwilligungSpeichern, useEinwilligungRoh } from '@/lib/einwilligung';
import { useHydrated } from '@/lib/client-state';
import { Button } from '@/components/ui/button';

/**
 * Frage nach der Einwilligung in die Statistik — nur eingebunden, wenn eine Mess-ID gesetzt ist,
 * und nur solange keine Auswahl gespeichert ist. Beide Wege sind gleich gewichtet; ändern lässt
 * sich die Auswahl jederzeit auf der Seite Cookie-Einstellungen.
 */
export function EinwilligungHinweis() {
  const hydriert = useHydrated();
  const pathname = usePathname();
  const roh = useEinwilligungRoh();
  const [fehler, setFehler] = useState(false);

  // Auf der Einstellungsseite selbst und im Backend nicht doppelt fragen.
  if (!hydriert || einwilligungLesen(roh) || pathname.startsWith('/rechtliches/cookie-einstellungen')) return null;

  function entscheiden(statistik: boolean) {
    // Ohne Speicher (privates Fenster, blockierte Daten) bleibt die Statistik aus; der Hinweis bleibt sichtbar.
    setFehler(!einwilligungSpeichern({ statistik, komfort: false }));
  }

  return (
    <section
      aria-labelledby="einwilligung-titel"
      className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-overlay rounded-lg border border-border bg-surface p-4 shadow-overlay md:inset-x-auto md:bottom-4 md:right-4 md:max-w-md md:p-5"
    >
      <h2 id="einwilligung-titel" className="text-body font-semibold text-foreground">
        Statistik erlauben?
      </h2>
      <p className="mt-1.5 text-small leading-relaxed text-foreground-muted">
        Mit Ihrer Einwilligung messen wir mit Google Analytics, wie die Seite genutzt wird. Dabei
        können Daten in die USA übertragen werden. Ohne Einwilligung bleibt die Statistik aus.
        Mehr in der <Link href="/rechtliches/datenschutz" className="font-semibold text-primary hover:underline">Datenschutzerklärung</Link>{' '}
        und unter{' '}
        <Link href="/rechtliches/cookie-einstellungen" className="font-semibold text-primary hover:underline">
          Cookie-Einstellungen
        </Link>
        .
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => entscheiden(false)}>
          Ablehnen
        </Button>
        <Button variant="outline" onClick={() => entscheiden(true)}>
          Erlauben
        </Button>
      </div>
      {fehler && (
        <p role="status" className="mt-3 text-caption text-foreground-muted">
          Ihre Auswahl konnte nicht gespeichert werden — Ihr Browser blockiert die Speicherung.
        </p>
      )}
    </section>
  );
}
