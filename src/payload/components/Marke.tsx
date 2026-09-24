/**
 * Logo und Symbol des Backends. Reines SVG, feste Farben — das Backend hat
 * eigene Farbvariablen und kennt die Bereichsfarben der Seite nicht.
 */

function Schluessel({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#1d5fd1" />
      <circle cx="12" cy="14" r="5.25" fill="none" stroke="#ffffff" strokeWidth="2.25" />
      <circle cx="12" cy="14" r="1.75" fill="#bcd4ff" />
      <path d="M16 17 24.5 25.5M21 22l2.5-2.5M23 24l2.5-2.5" stroke="#ffffff" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

export function Icon() {
  return <Schluessel size={26} />;
}

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <Schluessel size={44} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: '0.01em' }}>
          SCHLÜSSELMACHER<span style={{ color: '#1d5fd1' }}>24</span>
        </span>
        <span style={{ fontSize: 13, opacity: 0.7 }}>Backend für Shop, Termine und Inhalte</span>
      </div>
    </div>
  );
}
