import React, { useState } from 'react';

// lightweight PressableButton same as used in App (keeps consistent feedback)
function PressableButton({ children, onClick, style = {}, ...props }) {
  const [pressed, setPressed] = useState(false);

  const handleMouseDown = () => setPressed(true);
  const handleMouseUp = () => setPressed(false);
  const handleMouseLeave = () => setPressed(false);
  const handleClick = (e) => {
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    if (onClick) onClick(e);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setPressed(true);
      setTimeout(() => setPressed(false), 180);
    }
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        padding: '0.5em 0.8em',
        fontSize: '0.95em',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: pressed ? '#555' : '#444',
        color: 'white',
        transition: 'all 0.18s ease',
        transform: pressed ? 'translateY(1px) scale(0.97)' : 'translateY(0) scale(1)',
        boxShadow: pressed ? 'inset 0 0 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Create axial coords inside radius
function generateHexCoords(radius) {
  const coords = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      coords.push({ q, r });
    }
  }
  return coords;
}

// axial -> pixel for pointy-topped hexes
function axialToPixel(q, r, size) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 1.5 * r;
  return { x, y };
}

function polygonPoints(cx, cy, size) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i - 30); // pointy
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
}

// Accept props from App: onBack, onGenerate, hexType, colors
export default function Gameboard({ onBack, onGenerate, hexType, colors, radius = 12, hexSize = 18 }) {
  const coords = generateHexCoords(radius);
  // compute bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const pixels = coords.map(({ q, r }) => {
    const { x, y } = axialToPixel(q, r, hexSize);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    return { q, r, x, y };
  });

  const pad = hexSize * 2;
  const width = Math.ceil(maxX - minX + pad * 2);
  const height = Math.ceil(maxY - minY + pad * 2);

  const [selected, setSelected] = useState(null);
  // map of "q,r" -> assigned hex type (persists color)
  const [assigned, setAssigned] = useState({});

  return (
    <div style={{
      padding: '1em',
      color: 'white',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: 1000, display: 'flex', justifyContent: 'space-between', marginBottom: '0.6em' }}>
        <PressableButton onClick={onBack}>Back</PressableButton>
        <div style={{ alignSelf: 'center', fontWeight: '600' }}>Hex Crawl — radius {radius}</div>
        <div />{/* spacer */}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10 }}>
        <svg
          width={width}
          height={height}
          viewBox={`${minX - pad} ${minY - pad} ${width} ${height}`}
          style={{ display: 'block', background: 'transparent' }}
        >
          {pixels.map(({ q, r, x, y }) => {
            const cx = x;
            const cy = y;
            const key = `${q},${r}`;
            const isSelected = selected === key;
            // if a hex has been assigned previously, use that color (persistent)
            const assignedType = assigned[key];
            const fill = assignedType && colors
              ? (colors[assignedType] || '#ffcc66')
              : (isSelected && hexType && colors ? (colors[hexType] || '#ffcc66') : '#333');
            const stroke = assignedType ? '#ffaa00' : (isSelected ? '#ffaa00' : '#222');
            const strokeWidth = assignedType ? 2.5 : (isSelected ? 2.5 : 1);

            return (
              <g key={key} transform={`translate(0,0)`}>
                <polygon
                  points={polygonPoints(cx, cy, hexSize)}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    // call App's handleGenerate to get a generated hex type,
                    // persist that mapping locally so the color remains on this tile
                    let generatedType = null;
                    if (onGenerate) {
                      // handleGenerate now returns the selected type
                      generatedType = onGenerate();
                    }
                    if (generatedType) {
                      setAssigned(prev => ({ ...prev, [key]: generatedType }));
                    }
                    setSelected(key);
                  }}
                />
                {/* small coord label */}
                <text x={cx} y={cy + 4} fontSize={8} fill="#eee" textAnchor="middle" pointerEvents="none">
                  {q},{r}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ marginTop: '0.6em', color: '#ddd', fontSize: '0.95em' }}>
        Click a hex to highlight it. Total tiles: {coords.length}
      </div>
    </div>
  );
}