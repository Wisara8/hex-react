import React from 'react';

export const GAMEPIECES = ['SQUARE', 'CIRCLE', 'TRIANGLE', 'SLASH'];
export const GAMEPIECE_COLORS = ['#ff5f57', '#ffffffff', '#000000ff', '#f0f342ff'];

export function renderGamepieceAt(type, idx, cx, cy, size) {
  const symbolSize = Math.max(8, size * 0.6);
  const half = symbolSize / 2;
  const color = GAMEPIECE_COLORS[idx % GAMEPIECE_COLORS.length];
  const key = `gp-${idx}`;

  if (type === 'SQUARE') {
    return (
      <rect
        key={key}
        x={cx - half}
        y={cy - half}
        width={symbolSize}
        height={symbolSize}
        rx={2}
        fill={color}
        stroke="#222"
        strokeWidth={1}
      />
    );
  } else if (type === 'CIRCLE') {
    return (
      <circle
        key={key}
        cx={cx}
        cy={cy}
        r={half}
        fill={color}
        stroke="#222"
        strokeWidth={1}
      />
    );
  } else if (type === 'TRIANGLE') {
    const tPts = [
      `${cx},${cy - half}`,
      `${cx - half},${cy + half * 0.7}`,
      `${cx + half},${cy + half * 0.7}`
    ].join(' ');
    return (
      <polygon
        key={key}
        points={tPts}
        fill={color}
        stroke="#222"
        strokeWidth={1}
      />
    );
  } else { // SLASH
    return (
      <g key={key} stroke={color} strokeWidth={Math.max(2, symbolSize * 0.18)} strokeLinecap="round">
        <line x1={cx - half} y1={cy - half} x2={cx + half} y2={cy + half} />
      </g>
    );
  }
}

export function renderGamepieceIcon(type, idx, size = 14) {
  const color = GAMEPIECE_COLORS[idx % GAMEPIECE_COLORS.length];
  const half = size / 2;

  if (type === 'SQUARE') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}>
        <rect x={1} y={1} width={size-2} height={size-2} rx={2} fill={color} stroke="#222" strokeWidth={1} />
      </svg>
    );
  } else if (type === 'CIRCLE') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}>
        <circle cx={half} cy={half} r={half-1} fill={color} stroke="#222" strokeWidth={1} />
      </svg>
    );
  } else if (type === 'TRIANGLE') {
    const tPts = `${half},1 ${1},${size-1} ${size-1},${size-1}`;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}>
        <polygon points={tPts} fill={color} stroke="#222" strokeWidth={1} />
      </svg>
    );
  } else {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}>
        <line x1={2} y1={2} x2={size-2} y2={size-2} stroke={color} strokeWidth={Math.max(1, size * 0.12)} strokeLinecap="round" />
      </svg>
    );
  }
}