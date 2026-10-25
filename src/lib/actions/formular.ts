'use server';

import { startSignieren } from '@/lib/server/formular-schutz';

/**
 * Signierter Startzeitpunkt für ein Formular — der Browser holt ihn beim
 * Öffnen und schickt ihn beim Absenden mit (Bot-Schutz).
 */
export async function formularStarten(): Promise<{ start: string }> {
  return { start: startSignieren() };
}
