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

  // Turn / players state
  const [playersCount, setPlayersCount] = useState(1); // 1-4 players
  // players: array of { die1, die2, sum, ap }
  const [players, setPlayers] = useState(() => Array.from({ length: playersCount }, () => ({ die1: null, die2: null, sum: null, ap: null })));
  const [currentPlayer, setCurrentPlayer] = useState(0); // index 0..playersCount-1

  // keep players array in sync when playersCount changes
  const resizePlayers = (count) => {
    setPlayers(prev => {
      const next = prev.slice(0, count);
      while (next.length < count) next.push({ die1: null, die2: null, sum: null, ap: null });
      return next;
    });
    // clamp current player
    setCurrentPlayer(cp => Math.min(cp, Math.max(0, count - 1)));
    setPlayersCount(count);
  };

  const rollD12 = () => Math.floor(Math.random() * 12) + 1;
  const rollTwoD12 = () => {
    // only the active player rolls for themselves
    setPlayers(prev => {
      const next = prev.slice();
      const d1 = rollD12();
      const d2 = rollD12();
      const s = d1 + d2;
      // compute action points based on sum
      let computed = null;
      if (s >= 2 && s <= 6) computed = 4;
      else if (s >= 7 && s <= 14) computed = 5;
      else if (s >= 15 && s <= 19) computed = 6;
      else if (s >= 20 && s <= 24) computed = 8;
      next[currentPlayer] = { die1: d1, die2: d2, sum: s, ap: computed };
      return next;
    });
  };

  const endTurn = () => {
    // advance to next player and keep their current values (do not auto-roll)
    setCurrentPlayer(cp => (cp + 1) % playersCount);
    setSelected(null);
  };

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
      <div style={{ width: '100%', maxWidth: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6em' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <PressableButton onClick={onBack}>Back</PressableButton>
          {/* player count controls */}
          <div style={{ display: 'flex', gap: 6, marginLeft: 6 }}>
            {[1,2,3,4].map(n => (
              <PressableButton
                key={n}
                onClick={() => resizePlayers(n)}
                style={{ padding: '0.3em 0.6em', backgroundColor: playersCount === n ? '#666' : undefined }}
              >
                {n}P
              </PressableButton>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontWeight: '600' }}>
          Hex Crawl — radius {radius}
          <div style={{ fontSize: 12, marginTop: 4, color: '#ddd' }}>
            Current: Player {currentPlayer + 1} / {playersCount}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PressableButton onClick={rollTwoD12} style={{ opacity: 1 }}>{/* roll always affects current player */}Roll 2d12</PressableButton>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            {/* show current player's dice / sum / AP */}
            <div style={{ minWidth: 42, padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', textAlign: 'center' }}>
              D1: {players[currentPlayer]?.die1 ?? '—'}
            </div>
            <div style={{ minWidth: 42, padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', textAlign: 'center' }}>
              D2: {players[currentPlayer]?.die2 ?? '—'}
            </div>
            <div style={{ minWidth: 48, padding: '6px 8px', borderRadius: 6, background: '#222', color: '#ffdd57', textAlign: 'center', fontWeight: 600 }}>
              Sum: {players[currentPlayer]?.sum ?? '—'}
            </div>
            {/* AP (action points) — more prominent */}
            <div style={{ minWidth: 72, padding: '8px 12px', borderRadius: 8, background: '#ffdd57', color: '#222', textAlign: 'center', fontWeight: 800, fontSize: 16 }}>
              AP: {players[currentPlayer]?.ap ?? '—'}
            </div>
          </div>
          <PressableButton onClick={endTurn} style={{ backgroundColor: '#b44', padding: '0.4em 0.8em' }}>END TURN</PressableButton>
        </div>
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
                  style={{
                    cursor: (players[currentPlayer]?.ap ?? 0) > 0 ? 'pointer' : 'not-allowed',
                    opacity: (players[currentPlayer]?.ap ?? 0) > 0 ? 1 : 0.6
                  }}
                  onClick={() => {
                    const playerAP = players[currentPlayer]?.ap ?? 0;
                    // block clicks when current player has no action points
                    if (playerAP <= 0) return;

                    // call App's handleGenerate to get a generated hex type
                    let generatedType = null;
                    if (onGenerate) {
                      generatedType = onGenerate();
                    }

                    // cost: HILL, RIVER, SWAMP cost 2 AP, others cost 1 AP
                    const cost = (generatedType === 'HILL' || generatedType === 'RIVER' || generatedType === 'SWAMP') ? 2 : 1;

                    // consume AP for current player (min 0)
                    setPlayers(prev => {
                      const next = prev.slice();
                      const cur = { ...next[currentPlayer] };
                      cur.ap = Math.max(0, (cur.ap ?? 0) - cost);
                      next[currentPlayer] = cur;
                      return next;
                    });

                    // persist assigned type/color (global board)
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

      {/* Player controls — visible only in multi-player mode */}
      {playersCount > 1 && (
        <div style={{ marginTop: '1em', display: 'flex', flexDirection: 'column', gap: '0.6em', width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9em', color: '#ddd' }}>
            <div>Players:</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Player count selector */}
              <PressableButton onClick={() => resizePlayers(Math.max(1, playersCount - 1))}>-</PressableButton>
              <div style={{ minWidth: 40, textAlign: 'center' }}>{playersCount}</div>
              <PressableButton onClick={() => resizePlayers(Math.min(4, playersCount + 1))}>+</PressableButton>
            </div>
          </div>

          {/* Player states display */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8em', fontSize: '0.9em' }}>
            {players.map((player, index) => (
              <div key={index} style={{
                padding: '0.8em',
                borderRadius: 8,
                background: currentPlayer === index ? 'rgba(255,221,87,0.1)' : 'rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <div style={{ fontWeight: 600, color: currentPlayer === index ? '#ffdd57' : 'white' }}>
                  Player {index + 1}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ minWidth: 42, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    D1: {player.die1 ?? '—'}
                  </div>
                  <div style={{ minWidth: 42, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    D2: {player.die2 ?? '—'}
                  </div>
                  <div style={{ minWidth: 48, padding: '4px 8px', borderRadius: 6, background: '#222', color: '#ffdd57', textAlign: 'center', fontWeight: 600 }}>
                    Sum: {player.sum ?? '—'}
                  </div>
                  {/* AP (action points) */}
                  <div style={{ minWidth: 72, padding: '4px 8px', borderRadius: 8, background: '#ffdd57', color: '#222', textAlign: 'center', fontWeight: 800, fontSize: 14 }}>
                    AP: {player.ap ?? '—'}
                  </div>
                </div>

                {/* Current player indicator */}
                {currentPlayer === index && (
                  <div style={{
                    marginTop: 4,
                    padding: '2px 4px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffdd57',
                    fontSize: 12,
                    fontWeight: 500,
                    textAlign: 'center'
                  }}>
                    Your Turn
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Turn actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9em' }}>
            <PressableButton onClick={endTurn} style={{ flex: 1, marginRight: 8 }}>
              End Turn
            </PressableButton>
            <PressableButton onClick={rollTwoD12} style={{ flex: 1 }}>
              Roll for Me
            </PressableButton>
          </div>
        </div>
      )}
    </div>
  );
}