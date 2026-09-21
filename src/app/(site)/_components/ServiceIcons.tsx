import React from 'react';

// ─── Screen Printing icon (Traditional Production) ───────────────────────────
export function ScreenPrintIcon() {
  return (
    <svg viewBox="0 0 280 180" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      {/* Frame */}
      <rect x="28" y="22" width="224" height="136" rx="5" stroke="#1a1a1a" strokeWidth="3"/>

      {/* Mesh — horizontals */}
      {[48, 68, 88, 108, 128].map((y) => (
        <line key={y} x1="28" y1={y} x2="252" y2={y} stroke="#d8d8d8" strokeWidth="1"/>
      ))}
      {/* Mesh — verticals */}
      {[72, 116, 160, 204].map((x) => (
        <line key={x} x1={x} y1="22" x2={x} y2="158" stroke="#d8d8d8" strokeWidth="1"/>
      ))}

      {/* Ink wash (yellow, below blade) */}
      <rect x="28" y="98" width="224" height="60" fill="#f2bf00" opacity="0.12"/>

      {/* Squeegee blade */}
      <rect x="28" y="89" width="224" height="14" rx="2" fill="#f2bf00"/>

      {/* Squeegee handle — shaft */}
      <rect x="124" y="22" width="18" height="70" rx="3" fill="#1a1a1a"/>

      {/* Squeegee handle — grip cap */}
      <rect x="112" y="14" width="42" height="14" rx="4" fill="#1a1a1a"/>

      {/* Frame corner brackets (decorative) */}
      <rect x="22" y="16" width="12" height="12" rx="2" fill="#1a1a1a"/>
      <rect x="246" y="16" width="12" height="12" rx="2" fill="#1a1a1a"/>
      <rect x="22" y="152" width="12" height="12" rx="2" fill="#1a1a1a"/>
      <rect x="246" y="152" width="12" height="12" rx="2" fill="#1a1a1a"/>
    </svg>
  );
}

// ─── Transfer Sheets icon (Flexible Merch Production) ────────────────────────
export function TransferSheetsIcon() {
  return (
    <svg viewBox="0 0 280 180" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      {/* Sheet 3 — back */}
      <rect x="80" y="42" width="148" height="112" rx="5" fill="#e8e8e8" stroke="#ccc" strokeWidth="1.5"/>

      {/* Sheet 2 — middle */}
      <rect x="54" y="28" width="148" height="112" rx="5" fill="#f0f0f0" stroke="#ccc" strokeWidth="1.5"/>

      {/* Sheet 1 — front */}
      <rect x="28" y="14" width="148" height="112" rx="5" fill="#fff" stroke="#b0b0b0" strokeWidth="2"/>

      {/* Design on top sheet: asterisk star print */}
      <g transform="translate(102, 70)">
        <line x1="0" y1="-22" x2="0" y2="22"  stroke="#f2bf00" strokeWidth="4" strokeLinecap="round"/>
        <line x1="-22" y1="0"  x2="22" y2="0"  stroke="#f2bf00" strokeWidth="4" strokeLinecap="round"/>
        <line x1="-16" y1="-16" x2="16" y2="16" stroke="#f2bf00" strokeWidth="4" strokeLinecap="round"/>
        <line x1="16" y1="-16" x2="-16" y2="16" stroke="#f2bf00" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="0" cy="0" r="6" fill="#f2bf00"/>
      </g>

      {/* Dotted cut line along right edge of front sheet — shows "transfer" */}
      <line
        x1="176" y1="22"
        x2="176" y2="118"
        stroke="#f2bf00"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />

      {/* Heat press icon (top right) — shows application */}
      <rect x="188" y="18" width="68" height="44" rx="4" fill="#1a1a1a"/>
      <rect x="196" y="36" width="52" height="6" rx="2" fill="#f2bf00" opacity="0.6"/>
      <rect x="196" y="46" width="36" height="4" rx="2" fill="#333"/>
      {/* Heat lines */}
      {[0, 10, 20].map((offset) => (
        <path
          key={offset}
          d={`M ${196 + offset} 68 Q ${201 + offset} 74 ${196 + offset} 80`}
          stroke="#f2bf00"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

// ─── Van icon (Mobile Merch) — alt to photo ──────────────────────────────────
export function VanIcon() {
  return (
    <svg viewBox="0 0 280 180" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      {/* Van body */}
      <rect x="18" y="68" width="220" height="76" rx="6" fill="#1a1a1a"/>

      {/* Cab section (raised) */}
      <path d="M 148 68 L 148 30 Q 148 22 156 22 L 218 22 Q 232 22 238 34 L 238 68 Z"
        fill="#222"/>

      {/* Windshield */}
      <path d="M 155 66 L 155 34 Q 155 28 162 28 L 215 28 Q 226 28 232 38 L 232 66 Z"
        fill="#111" stroke="#333" strokeWidth="1"/>
      {/* Windshield glare */}
      <line x1="165" y1="32" x2="158" y2="62" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Cargo door line */}
      <line x1="148" y1="72" x2="148" y2="138" stroke="#333" strokeWidth="1.5"/>
      {/* Door handle */}
      <rect x="136" y="100" width="8" height="3" rx="1.5" fill="#444"/>

      {/* Side window (cab) */}
      <rect x="152" y="75" width="18" height="30" rx="2" fill="#111" stroke="#333" strokeWidth="1"/>

      {/* Wavy stripe — van's signature motif */}
      <path
        d="M 18 108 Q 45 98 72 108 Q 99 118 126 108 Q 153 98 180 108 Q 207 118 234 108 L 238 108 L 238 118 Q 207 128 180 118 Q 153 108 126 118 Q 99 128 72 118 Q 45 108 18 118 Z"
        fill="#f2bf00"
      />

      {/* Front bumper */}
      <rect x="230" y="124" width="8" height="16" rx="2" fill="#333"/>
      {/* Rear bumper */}
      <rect x="18" y="128" width="8" height="12" rx="2" fill="#333"/>

      {/* Headlight */}
      <rect x="232" y="76" width="12" height="8" rx="2" fill="#f2bf00" opacity="0.8"/>
      {/* Rear light */}
      <rect x="14" y="76" width="8" height="10" rx="2" fill="#c0392b" opacity="0.7"/>

      {/* Wheels */}
      <circle cx="62" cy="144" r="22" fill="#111" stroke="#444" strokeWidth="2"/>
      <circle cx="62" cy="144" r="10" fill="#222" stroke="#555" strokeWidth="1.5"/>
      <circle cx="62" cy="144" r="3" fill="#666"/>

      <circle cx="200" cy="144" r="22" fill="#111" stroke="#444" strokeWidth="2"/>
      <circle cx="200" cy="144" r="10" fill="#222" stroke="#555" strokeWidth="1.5"/>
      <circle cx="200" cy="144" r="3" fill="#666"/>

      {/* Ground shadow */}
      <ellipse cx="140" cy="168" rx="110" ry="5" fill="#000" opacity="0.15"/>
    </svg>
  );
}
