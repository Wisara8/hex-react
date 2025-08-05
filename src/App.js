import React, { useState } from 'react';
import './App.css';

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

  const handleGenerate = () => {
    const selected = randomWeighted(BASE);
    setHexType(selected);
    setHistory(prev => [selected, ...prev.slice(0, 9)]); // Keep last 10
  };

  const backgroundColor = hexType ? COLORS[hexType] : '#222';

  return (
    <div
      className="App"
      style={{
        backgroundColor,
        transition: 'background-color 0.8s ease',
        height: '100vh',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2em',
        boxSizing: 'border-box'
      }}
    >
      <button
        onClick={handleGenerate}
        style={{
          padding: '1em 2em',
          fontSize: '1.5em',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: '#444',
          color: 'white',
          marginBottom: '1em',
          transition: 'background-color 0.3s'
        }}
      >
        Hex Generator
      </button>

      <div
        style={{
          fontSize: '3em',
          color: 'white',
          textShadow: '1px 1px 4px black',
          opacity: hexType ? 1 : 0,
          transform: hexType ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 0.4s ease'
        }}
      >
        {hexType ? hexType : 'Click to generate a hex'}
      </div>

      <div
        style={{
          marginTop: '2em',
          color: 'white',
          textAlign: 'center',
          maxWidth: '500px'
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
