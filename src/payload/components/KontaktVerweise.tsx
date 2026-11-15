'use client';

import { useFormFields } from '@payloadcms/ui';

import { telefonLink } from '@/lib/telefon';

/** E-Mail-Adresse, die sich gefahrlos in einen `mailto:`-Verweis setzen lässt. */
export function mailtoLink(email: unknown, betreff?: string): string | null {
  if (typeof email !== 'string' || !/^[^\s@<>"?&]+@[^\s@<>"?&]+\.[^\s@<>"?&]+$/.test(email.trim())) return null;
  return `mailto:${email.trim()}${betreff ? `?subject=${encodeURIComponent(betreff)}` : ''}`;
}

/**
 * Verweise am Kontakt eines Vorgangs (FA-KERN-05): E-Mail im eigenen Mailprogramm schreiben und anrufen.
 * Eine Mail aus dem eigenen Programm steht nicht im Mailverlauf; dafür gibt es „Nachricht an den Kunden“.
 */
export function KontaktVerweise() {
  const email = useFormFields(([felder]) => felder['kontakt.email']?.value);
  const telefon = useFormFields(([felder]) => felder['kontakt.telefon']?.value);
  const nummer = useFormFields(([felder]) => felder.nummer?.value);
  const mail = mailtoLink(email, typeof nummer === 'string' ? `Ihr Vorgang ${nummer}` : undefined);
  const tel = typeof telefon === 'string' ? telefonLink(telefon) : null;
  if (!mail && !tel) return null;
  return (
    <div className="field-description" style={{ display: 'flex', gap: 'var(--base)', flexWrap: 'wrap', marginBottom: 'var(--base)' }}>
      {mail && <a href={mail}>E-Mail schreiben (eigenes Mailprogramm)</a>}
      {tel && <a href={tel}>Anrufen: {String(telefon)}</a>}
    </div>
  );
}
