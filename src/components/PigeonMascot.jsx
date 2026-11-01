import React, { useState } from 'react';
import { playPigeonCoo } from '../utils/sound';

const SERGEANT_COO_QUOTES = [
  "My reconnaissance confirms their sandwiches look mediocre. Forward march!",
  "I have pooped on their diplomatic limousine. Tactical victory is ours.",
  "Never negotiate on an empty stomach. Bring bread crumbs.",
  "Warning: The enemy prime minister wore mismatched socks today. Severe breach of decorum.",
  "Diplomacy has left the chat. I'm taking a nap on the radar dish.",
  "According to international law, whoever makes the loudest sigh wins the debate.",
  "I intercepted their secret cables. It was just a recipe for banana bread.",
  "Status report: 0 real casualties, 4,000 bruised egos. Excellent work, general.",
];

export const PigeonMascot = ({
  size = 'md',
  speech = null,
  showSpeech = true,
  onClick = null,
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);

  const handleClick = () => {
    playPigeonCoo();
    setIsWobbling(true);
    setCurrentQuoteIndex((prev) => (prev + 1) % SERGEANT_COO_QUOTES.length);
    setTimeout(() => setIsWobbling(false), 500);
    if (onClick) onClick();
  };

  const dimensions = {
    sm: { width: 80, height: 80, scale: 0.8 },
    md: { width: 120, height: 120, scale: 1.1 },
    lg: { width: 170, height: 170, scale: 1.5 },
    hero: { width: 220, height: 220, scale: 1.9 },
  }[size] || { width: 120, height: 120, scale: 1.1 };

  const displayedSpeech = speech || SERGEANT_COO_QUOTES[currentQuoteIndex];

  return (
    <div className="pigeon-mascot-container" style={{ position: 'relative' }}>
      {showSpeech && (
        <div
          className="pigeon-speech"
          onClick={handleClick}
          title="Click Sergeant Coo for tactical wisdom"
          style={{ cursor: 'pointer' }}
        >
          <span style={{ fontWeight: 700, color: '#047857', display: 'block', fontSize: '0.82rem', marginBottom: '2px' }}>
            🎖️ Sgt. Coo (Chief Pigeon):
          </span>
          "{displayedSpeech}"
        </div>
      )}

      <div
        className={`pigeon-svg ${isWobbling ? 'pigeon-wobble-active' : ''}`}
        onClick={handleClick}
        title="Sergeant Coo – Click me to coo!"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox="0 0 160 160"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow beneath pigeon */}
          <ellipse cx="80" cy="144" rx="46" ry="10" fill="#18181b" opacity="0.18" />

          {/* Pigeon Tail Feathers */}
          <path
            d="M26 102 C16 90 20 118 38 122 Z"
            fill="#94a3b8"
            stroke="#18181b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M20 110 C10 102 16 126 36 128 Z"
            fill="#64748b"
            stroke="#18181b"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Chubby Pigeon Body */}
          <ellipse
            cx="82"
            cy="102"
            rx="46"
            ry="40"
            fill="#cbd5e1"
            stroke="#18181b"
            strokeWidth="3.5"
          />

          {/* Pastel Purple Neck Iridescence */}
          <path
            d="M62 76 C72 68 96 68 106 76 C102 92 66 92 62 76 Z"
            fill="#d8bbff"
            stroke="#18181b"
            strokeWidth="2"
          />

          {/* Wing with feather details */}
          <g>
            <path
              d="M56 94 C64 90 92 90 96 112 C96 126 78 132 62 126 C50 120 48 102 56 94 Z"
              fill="#94a3b8"
              stroke="#18181b"
              strokeWidth="3"
            />
            {/* Wing Feather lines */}
            <path d="M66 106 C74 116 86 118 90 114" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M60 114 C70 122 80 122 84 120" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Pigeon Head */}
          <circle
            cx="98"
            cy="64"
            r="26"
            fill="#cbd5e1"
            stroke="#18181b"
            strokeWidth="3.5"
          />

          {/* Cute Big Cartoon Eye */}
          <circle cx="106" cy="60" r="9" fill="#f8fafc" stroke="#18181b" strokeWidth="2.5" />
          <circle cx="108" cy="60" r="5" fill="#18181b" />
          <circle cx="110" cy="58" r="2" fill="#ffffff" />

          {/* Orange Beak */}
          <polygon
            points="120,62 138,67 120,72"
            fill="#f59e0b"
            stroke="#18181b"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Helmet Chin Strap */}
          <path
            d="M80 56 C82 74 100 84 116 72"
            stroke="#18181b"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Oversized Army Helmet (Green Pastel Brutalist) */}
          <g transform="rotate(-6, 96, 42)">
            {/* Helmet Dome */}
            <path
              d="M66 48 C66 22 126 22 126 48 Z"
              fill="#84cc16"
              stroke="#18181b"
              strokeWidth="3.5"
            />
            {/* Helmet Brim */}
            <path
              d="M60 48 Q96 42 132 48"
              stroke="#18181b"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Camo spot on helmet */}
            <ellipse cx="88" cy="34" rx="8" ry="5" fill="#4d7c0f" />
            <ellipse cx="108" cy="38" rx="6" ry="4" fill="#65a30d" />

            {/* Cute Peace Daisy tucked into helmet */}
            <g transform="translate(116, 26)">
              <circle cx="0" cy="0" r="3.5" fill="#fde047" stroke="#18181b" strokeWidth="1.5" />
              <ellipse cx="-5" cy="0" rx="3" ry="2" fill="#fff" stroke="#18181b" strokeWidth="1.2" />
              <ellipse cx="5" cy="0" rx="3" ry="2" fill="#fff" stroke="#18181b" strokeWidth="1.2" />
              <ellipse cx="0" cy="-5" rx="2" ry="3" fill="#fff" stroke="#18181b" strokeWidth="1.2" />
              <ellipse cx="0" cy="5" rx="2" ry="3" fill="#fff" stroke="#18181b" strokeWidth="1.2" />
            </g>
          </g>

          {/* Little Yellow Feet / Boots */}
          <g>
            <path d="M72 138 L72 144 M68 144 L78 144" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M92 138 L92 144 M88 144 L98 144" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default PigeonMascot;

