import Link from 'next/link';

/**
 * Hinweis am Ende unverbindlicher Anfragen und Projekte. Rein informativ:
 * Mit dem Absenden entsteht noch kein Vertrag, deshalb keine Pflicht-Checkbox.
 */
export function AnfrageHinweis() {
  return (
    <p className="text-small leading-relaxed text-foreground-subtle">
      Ihre Anfrage ist unverbindlich. Ein Vertrag kommt erst zustande, wenn Sie unser Angebot annehmen;
      dafür gelten unsere{' '}
      <Link href="/rechtliches/agb" className="font-semibold text-primary hover:underline">
        AGB
      </Link>
      .
    </p>
  );
}
