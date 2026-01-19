import React, { useState, useEffect } from 'react';
import PressableButton from './PressableButton';

export default function EncounterModal({ open, onClose, encounterResult }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedOutcomeIndex, setSelectedOutcomeIndex] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedIndex(null);
      setSelectedOutcomeIndex(null);
      setIsDisabled(false);
    }
  }, [open, encounterResult]);

  if (!open) return null;

  const options = encounterResult?.options ?? [];
  const selectedOption = options[selectedIndex] ?? null;
  const outcomes = selectedOption?.optionOutcomes ?? [];

  function optionButton(idx) {
    setSelectedIndex(idx);
    setIsDisabled(true);
    const opts = options[idx]?.optionOutcomes ?? [];
    if (opts.length) {
      const pick = Math.floor(Math.random() * opts.length);
      setSelectedOutcomeIndex(pick);
    } else {
      setSelectedOutcomeIndex(null);
    }
  }

  function closeModal() {
    setSelectedIndex(null);
    setSelectedOutcomeIndex(null);
    setIsDisabled(false);
    onClose();
  }

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

        <div style={{ marginBottom: 12, color: encounterResult?.type === 'Rare' ? '#ffcc00' : '#ddd', fontWeight: 600 }}>
          {encounterResult?.scenario ?? 'TBD'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {options.map((opt, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <PressableButton
                key={opt.text ?? idx}
                disabled={isDisabled}
                onClick={() => optionButton(idx)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.6em 0.8em',
                  backgroundColor: isSelected ? '#3a87ff' : undefined,
                  color: isSelected ? '#fff' : undefined
                }}
              >
                {opt.text}
              </PressableButton>
            );
          })}
        </div>

        {selectedOption && (
          <div style={{ marginTop: 8, padding: '10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Outcomes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {outcomes.length ? outcomes.map((o, i) => {
                const isPicked = i === selectedOutcomeIndex;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '8px',
                      borderRadius: 6,
                      background: isPicked ? 'linear-gradient(90deg,#2b6cff, #3a87ff)' : 'rgba(0,0,0,0.2)',
                      color: isPicked ? '#fff' : '#ddd',
                      fontWeight: isPicked ? 700 : 400
                    }}
                  >
                    {o.text ?? JSON.stringify(o)}
                  </div>
                );
              }) : (
                <div style={{ color: '#999' }}>No outcomes defined.</div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <PressableButton onClick={closeModal} style={{ backgroundColor: '#3a87ff' }}>
            Close
          </PressableButton>
        </div>
      </div>
    </div>
  );
}