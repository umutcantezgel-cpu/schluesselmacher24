'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { IconBase } from '@/components/visual/icons/icon-base';
import { VIDEO_RAHMEN_HOST } from '@/lib/tutorials/freigabe';

/* ==========================================================================
   Rahmen der Video-Einbettung (FA-INHALT-01B), einziger Client-Baustein.

   Vor dem Klick: die Fassade aus eigenen Mitteln (vom Server gerendert, als
   `children`) und der Knopf „Video laden“. Es lädt nichts von YouTube, und im
   HTML steht keine Adresse von YouTube: Die Adresse entsteht erst mit dem Klick.
   Nach dem Klick steht im selben Rahmen 16 zu 9 der Player von
   youtube-nocookie.com (keine Verschiebung im Layout), der Fokus geht auf den
   Player (A-077). Gespeichert wird nichts: Der Klick gilt für dieses eine Video.
   ========================================================================== */

/** Text des Knopfs. */
export const VIDEO_LADEN_TEXT = 'Video laden';

/** Adresse des Players im erweiterten Datenschutzmodus; die Kennung ist auf dem Server geprüft. */
export function videoPlayerAdresse(kennung: string): string {
  return `${VIDEO_RAHMEN_HOST}/embed/${encodeURIComponent(kennung)}?autoplay=1`;
}

/**
 * Dreieck „Abspielen“ wie GlyphAbspielen, hier eigens gezeichnet: Ein Import der gemeinsamen Glyphe zöge sie aus
 * dem gemeinsamen Bündel in ein eigenes Modul und machte andere Seiten um einige Byte schwerer (A-076).
 */
function Abspielen() {
  return (
    <IconBase size={18} className="shrink-0">
      <path d="M17 12L35 24L17 36Z" />
    </IconBase>
  );
}

export interface VideoRahmenProps {
  /** Geprüfte elfstellige Kennung. */
  kennung: string;
  /** Titel des Players (`title` des Rahmens). */
  titel: string;
  /** Die Fassade: eigenes Vorschaubild oder gezeichnete Fläche mit Titel und Dauer. */
  children: ReactNode;
}

export function VideoRahmen({ kennung, titel, children }: VideoRahmenProps) {
  const [geladen, setGeladen] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (geladen) player.current?.focus();
  }, [geladen]);

  return (
    <div data-video-rahmen="" className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface-muted">
      {geladen ? (
        <iframe
          ref={player}
          src={videoPlayerAdresse(kennung)}
          title={titel}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          {children}
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-3 sm:p-5">
            <Button type="button" variant="primary" size="md" onClick={() => setGeladen(true)}>
              <Abspielen />
              {VIDEO_LADEN_TEXT}
              <span className="sr-only">: {titel}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
