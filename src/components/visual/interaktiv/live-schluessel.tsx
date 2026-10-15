'use client';

import { useEffect, useState } from 'react';

import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { cn } from '@/lib/cn';

export interface LiveSchluesselProps {
  /** Eingegebener Code; leer zeigt ein ruhiges Standardprofil. */
  code: string;
  /** Wartezeit nach der letzten Eingabe, bevor das Profil wechselt (ms). */
  verzoegerung?: number;
  className?: string;
}

/**
 * Großer Moment der Produktseite (B-15): Das Schlüsselprofil folgt dem
 * eingegebenen Code – kurz nach der letzten Eingabe, mit einer schnellen
 * Überblendung. Die Zeichnung leitet das Profil nur ab; sie ist eine
 * Darstellung und keine echte Schließung (das steht auch sichtbar darunter).
 */
export function LiveSchluessel({ code, verzoegerung = 250, className }: LiveSchluesselProps) {
  const [angezeigt, setAngezeigt] = useState(code.trim());
  const [ersterWert] = useState(code.trim());
  const gewechselt = angezeigt !== ersterWert;

  useEffect(() => {
    const ziel = code.trim();
    if (ziel === angezeigt) return;
    const zeit = window.setTimeout(() => setAngezeigt(ziel), verzoegerung);
    return () => window.clearTimeout(zeit);
  }, [code, angezeigt, verzoegerung]);

  return (
    <figure className={cn('rounded-lg border border-border bg-surface p-4 sm:p-6', gewechselt && 'sm24-ruhig', className)}>
      <div key={angezeigt} className={cn(gewechselt && 'animate-schleier-ein')}>
        <SchluesselGrafik
          params={angezeigt ? { typ: 'zylinder', code: angezeigt } : { typ: 'zylinder' }}
          title={angezeigt ? 'Darstellung eines Schlüsselprofils zum eingegebenen Code' : 'Schlüssel in Seitenansicht'}
        />
      </div>
      <figcaption className="mt-3 font-mono text-caption uppercase tracking-label text-foreground-subtle">
        {angezeigt ? 'Darstellung zum Code – keine echte Schließung' : 'Profil erscheint nach Eingabe des Codes'}
      </figcaption>
    </figure>
  );
}
