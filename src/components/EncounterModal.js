import React from 'react';
import PressableButton from './PressableButton';

export default function EncounterModal({ open, onClose, encounterResult }) {
  if (!open) return null;

  const options = encounterResult?.options ?? [];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(720px, 92%)',
          background: '#222',
          padding: '1em',
          borderRadius: 10,
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          color: '#fff'
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Encounter</div>

        <div style={{ marginBottom: 12, color: encounterResult ? '#ffcc00' : '#ddd', fontWeight: 600 }}>
          {encounterResult?.scenario ?? 'TBD'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {options.map((opt, idx) => (
            <PressableButton
              key={opt.text ?? idx}
              onClick={() => onClose()}
              style={{ width: '100%', textAlign: 'left', padding: '0.6em 0.8em' }}
            >
              {opt.text}
            </PressableButton>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <PressableButton onClick={onClose} style={{ backgroundColor: '#3a87ff' }}>
            Close
          </PressableButton>
        </div>
      </div>
    </div>
  );
}