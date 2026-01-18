import React, { useState } from 'react';

export default function PressableButton({ children, onClick, style = {}, ...props }) {
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