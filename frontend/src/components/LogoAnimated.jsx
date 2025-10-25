import React, { useState, useEffect } from 'react';
import { FaRegHandPeace } from 'react-icons/fa';

export default function LogoAnimated() {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) {
      const audio = new Audio('/snap.mp3');
      audio.volume = 0.6;
      audio.play().catch(() => {});
    }
  }, [hovered]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        top: '20px',
        left: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        zIndex: 1000
      }}
    >
      <span
        style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#00BFFF',
          letterSpacing: '1px',
          textShadow: '0 0 8px rgba(0,191,255,0.6)',
          transition: 'all 0.3s ease'
        }}
      >
        FindAllEasy
      </span>

      <div style={{ position: 'relative' }}>
        <FaRegHandPeace
          size={36}
          color={hovered ? '#FFD700' : '#F6E27F'}
          style={{
            transform: hovered ? 'rotate(-15deg) scale(1.1)' : 'rotate(0deg) scale(1)',
            filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))',
            transition: 'all 0.4s ease'
          }}
        />
        {hovered && Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'gold',
              top: '10px',
              left: '10px',
              animation: `flyStar${i} 1.2s ease-out forwards`,
              opacity: 0.9
            }}
          ></div>
        ))}
      </div>

      <style>{`
        ${Array.from({ length: 10 }).map((_, i) => `
          @keyframes flyStar${i} {
            0% { transform: translate(0,0) scale(1); opacity: 1; }
            100% { transform: translate(${(Math.random()-0.5)*120}px, ${(Math.random()-0.5)*120}px) scale(0.3); opacity: 0; }
          }
        `).join('')}
      `}</style>
    </div>
  );
}