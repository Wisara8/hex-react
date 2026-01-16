import React, { useState } from 'react';
import './App.css';
import Gameboard from './Gameboard';

const BASE = {
  FOREST: 60,
  HILL: 10,
  RIVER: 10,
  SWAMP: 8,
  FLOWER: 6,
  WOOD: 4,
  ESSENCE: 2
};

const COLORS = {
  FOREST: '#2e8b57',
  HILL: '#8b6d4b',
  RIVER: '#1e90ff',
  SWAMP: '#556b2f',
  FLOWER: '#d87093',
  WOOD: '#cd853f',
  ESSENCE: '#9370db',
};

function randomWeighted(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [type, weight] of entries) {
    if (roll < weight) return type;
    roll -= weight;
  }
}

function App() {
  const [hexType, setHexType] = useState(null);
  const [history, setHistory] = useState([]);
  const [encounterResult, setEncounterResult] = useState(null);
  const [view, setView] = useState('main'); // 'main' or 'board'

  // Pressable button component gives the same press animation/feedback to any button.
  function PressableButton({ children, onClick, style = {}, ...props }) {
    const [pressed, setPressed] = useState(false);

    const handleMouseDown = () => setPressed(true);
    const handleMouseUp = () => setPressed(false);
    const handleMouseLeave = () => setPressed(false);
    const handleClick = (e) => {
      // brief visual feedback on click
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
          padding: '0.6em 1em',
          fontSize: '1em',
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

  const handleGenerate = () => {
     const selected = randomWeighted(BASE);
     setHexType(selected);
     setHistory(prev => [selected, ...prev.slice(0, 4)]);
     // return the selected type so callers (e.g. Gameboard) can persist it immediately
     return selected;
   };

  const backgroundColor = hexType ? COLORS[hexType] : '#222';

  const encounterType = (rangeLabel) => {
    const roll = Math.random() * 100;
    let threshold;

    switch (rangeLabel) {
      case '1-2':
        threshold = 75;
        break;
      case '3-4':
        threshold = 50;
        break;
      case '5+':
        threshold = 25;
        break;
      default:
        threshold = 100;
    }

    setEncounterResult(roll > threshold ? 'Rare' : 'Common');
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor,
        transition: 'background-color 0.8s ease',
        minHeight: '100vh',
        margin: 0,
        padding: '2em',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 className="outlined-text">Hexpedition Playtest</h1>
      <div style={{ width: '100%', maxWidth: 800, display: 'flex', justifyContent: 'flex-end', marginBottom: '0.6em' }}>
        <PressableButton onClick={() => setView('board')}>Open Gameboard</PressableButton>
      </div>

      {view === 'board' ? (
        <Gameboard
          onBack={() => setView('main')}
          onGenerate={handleGenerate}
          onEncounter={encounterType}
          hexType={hexType}
          colors={COLORS}
          encounterResult={encounterResult}
          setEncounterResult={setEncounterResult}

        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '2em',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '800px',
          }}
        >
          {/* Generator Column */}
          <div style={{ 
            flex: '1 1 300px', 
            minWidth: '280px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '1em',
            color: 'white',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            }}>
            <PressableButton
              onClick={handleGenerate}
              style={{
                padding: '1em 2em',
                fontSize: '1.5em',
                marginBottom: '1em',
                width: '100%',
              }}
            >
              Hex Generator
            </PressableButton>

            <div
              style={{
                fontSize: '2.5em',
                color: 'white',
                textShadow: '1px 1px 4px black',
                opacity: hexType ? 1 : 0,
                transform: hexType ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.4s ease',
                textAlign: 'center'
              }}
            >
              {hexType ? hexType : 'Click to generate a hex'}
            </div>
          </div>

          {/* Hex Movement Panel */}
          <div
            style={{
              flex: '1 1 300px',
              minWidth: '280px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '1em',
              color: 'white',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{ textAlign: 'center' }}>Hex Movement</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1em' }}>
              <PressableButton onClick={() => encounterType('1-2')}>1-2</PressableButton>
              <PressableButton onClick={() => encounterType('3-4')}>3-4</PressableButton>
              <PressableButton onClick={() => encounterType('5+')}>5+</PressableButton>
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: '2em',
              fontWeight: 'bold',
              marginTop: '1em',
              color: encounterResult === 'Rare' ? '#ffcc00' : '#ffffff',
              transition: 'all 0.3s ease'
            }}>
              {encounterResult ? encounterResult : '—'}
            </div>
          </div>
        </div>
      )}

      {/* Previous Rolls */}
      <div
        style={{
          marginTop: '3em',
          color: 'white',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '1em',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}
      >
        <h3 style={{ marginBottom: '0.5em' }}>Previous Rolls:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {history.map((type, index) => (
            <li
              key={index}
              style={{
                backgroundColor: COLORS[type],
                padding: '0.5em 1em',
                borderRadius: '6px',
                marginBottom: '0.4em',
                color: 'white',
                textShadow: '1px 1px 2px black',
                transition: 'transform 0.3s ease',
              }}
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
