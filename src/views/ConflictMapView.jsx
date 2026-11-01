import React, { useState } from 'react';
import {
  Globe,
  Swords,
  HeartHandshake,
  Filter,
  Info,
  MapPin,
  Sparkles,
  Compass,
  X,
} from 'lucide-react';
import { COUNTRIES, DIPLOMATIC_STATUSES } from '../data/countries';
import { playClick, playTrumpet, playPeaceChime } from '../utils/sound';

export default function ConflictMapView({
  userCountry,
  conflicts,
  onTargetCountry,
  onNavigateToDiplomacy,
}) {
  const [selectedCountry, setSelectedCountry] = useState(userCountry);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'conflicts', 'my-conflicts'

  // Filtered conflicts
  const activeConflicts = conflicts.filter((c) => {
    if (filterMode === 'my-conflicts') {
      return c.countryA === userCountry.id || c.countryB === userCountry.id;
    }
    return true;
  });

  // Calculate connection arcs between conflicting countries
  const conflictArcs = activeConflicts
    .map((conf) => {
      const cA = COUNTRIES.find((c) => c.id === conf.countryA);
      const cB = COUNTRIES.find((c) => c.id === conf.countryB);
      if (!cA || !cB) return null;

      const x1 = cA.coordinates.x;
      const y1 = cA.coordinates.y;
      const x2 = cB.coordinates.x;
      const y2 = cB.coordinates.y;

      // Calculate midpoint with arched control point
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 - Math.min(100, Math.abs(x1 - x2) * 0.25 + 30);
      const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

      return {
        id: conf.id,
        name: conf.name,
        cA,
        cB,
        pathD,
        intensity: conf.intensity,
        midX,
        midY,
      };
    })
    .filter(Boolean);

  const getStatusColor = (statusName) => {
    const s = DIPLOMATIC_STATUSES.find((item) => item.id === statusName);
    return s ? s.color : '#e2e8f0';
  };

  const getStatusBorder = (statusName) => {
    const s = DIPLOMATIC_STATUSES.find((item) => item.id === statusName);
    return s ? s.borderColor : '#64748b';
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Title & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="war-badge" style={{ backgroundColor: 'var(--pastel-blue)' }}>
              🌐 Screen 5 • Interactive Theater
            </span>
            <span className="war-stamp">Live Satellite Tracking</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '4px 0 0' }}>
            Global Conflict Map
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
            Click any country pin to inspect their defense pastry, status, and active feuds.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`war-btn war-btn-sm ${filterMode === 'all' ? 'war-btn-yellow' : ''}`}
            onClick={() => {
              playClick();
              setFilterMode('all');
            }}
          >
            All 195 Nations
          </button>
          <button
            type="button"
            className={`war-btn war-btn-sm ${filterMode === 'conflicts' ? 'war-btn-pink' : ''}`}
            onClick={() => {
              playClick();
              setFilterMode('conflicts');
            }}
          >
            Active Rivalries ({conflicts.length})
          </button>
          <button
            type="button"
            className={`war-btn war-btn-sm ${filterMode === 'my-conflicts' ? 'war-btn-blue' : ''}`}
            onClick={() => {
              playClick();
              setFilterMode('my-conflicts');
            }}
          >
            My Battles ({activeConflicts.length})
          </button>
        </div>
      </div>

      {/* Map Board Card */}
      <div
        className="war-card"
        style={{
          backgroundColor: '#f1f8fc',
          padding: '20px',
          boxShadow: '8px 8px 0px #18181b',
          border: '3px solid #18181b',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        {/* Ocean Waves decorative label */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            fontFamily: 'var(--font-hand)',
            fontSize: '1.2rem',
            color: '#93c5fd',
            pointerEvents: 'none',
          }}
        >
          ~ The Fictional Sea of Unnecessary Grudges ~
        </div>

        {/* Compass rose */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            color: '#64748b',
            background: 'rgba(255,255,255,0.8)',
            padding: '4px 10px',
            borderRadius: '10px',
            border: '2px solid #18181b',
          }}
        >
          <Compass size={18} color="#2563eb" />
          <span>TRUE NORTH (MAYBE)</span>
        </div>

        {/* SVG World Map Canvas (1000 x 500 coordinates) */}
        <svg
          viewBox="0 0 1000 500"
          className="conflict-map-svg"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0f2fe" strokeWidth="1" />
            </pattern>
            {/* Marker for conflict arrows */}
            <marker
              id="conflictArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#dc2626" />
            </marker>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="500" fill="url(#mapGrid)" rx="14" />

          {/* Continents Base Contours (Stylized Pastel Landmasses) */}
          <g fill="#fef9ea" stroke="#18181b" strokeWidth="2.5" strokeLinejoin="round">
            {/* North America */}
            <path d="M 80,70 Q 140,40 260,60 Q 320,80 300,160 Q 240,210 200,240 Q 160,200 120,160 Z" />
            {/* South America */}
            <path d="M 240,250 Q 340,270 360,330 Q 340,420 280,470 Q 260,380 230,300 Z" />
            {/* Europe */}
            <path d="M 440,80 Q 560,70 560,150 Q 520,200 450,190 Q 430,130 440,80 Z" />
            {/* Africa */}
            <path d="M 440,200 Q 580,200 600,280 Q 580,390 520,430 Q 450,380 430,270 Z" />
            {/* Asia */}
            <path d="M 570,80 Q 820,70 890,140 Q 880,260 760,280 Q 640,260 580,180 Z" />
            {/* Australia */}
            <path d="M 800,340 Q 910,330 920,400 Q 860,450 790,410 Z" />
            {/* Greenland */}
            <path d="M 330,40 Q 400,35 410,75 Q 360,95 320,65 Z" fill="#f8fafc" />
          </g>

          {/* Animated Connecting Conflict Arcs */}
          {conflictArcs.map((arc) => (
            <g key={arc.id}>
              {/* Pulsing Arc Path */}
              <path
                d={arc.pathD}
                fill="none"
                stroke={arc.intensity === 'Maximum Diplomatic Chaos' ? '#ef4444' : '#f59e0b'}
                strokeWidth="3.5"
                strokeDasharray="8 6"
                style={{
                  animation: 'dash 1.5s linear infinite',
                }}
              />
              {/* Conflict icon in the middle */}
              <circle cx={arc.midX} cy={arc.midY} r="14" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
              <text
                x={arc.midX}
                y={arc.midY + 5}
                fontSize="13"
                textAnchor="middle"
                style={{ userSelect: 'none' }}
              >
                ⚔️
              </text>
            </g>
          ))}

          {/* Country Markers / Pins */}
          {COUNTRIES.map((c) => {
            const isUser = userCountry.id === c.id;
            const isSelected = selectedCountry?.id === c.id;
            const statusColor = getStatusColor(c.status);
            const statusBorder = getStatusBorder(c.status);

            return (
              <g
                key={c.id}
                className="map-country-dot"
                transform={`translate(${c.coordinates.x}, ${c.coordinates.y})`}
                onClick={() => {
                  playClick();
                  setSelectedCountry(c);
                }}
              >
                {/* Outer halo if selected or user */}
                {(isSelected || isUser) && (
                  <circle
                    cx="0"
                    cy="0"
                    r={isUser ? "16" : "13"}
                    fill={isUser ? "var(--pastel-yellow)" : "rgba(255,255,255,0.8)"}
                    stroke="#18181b"
                    strokeWidth="2.5"
                    strokeDasharray={isUser ? "none" : "3 2"}
                  />
                )}

                {/* Country dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={isUser ? "10" : "7.5"}
                  fill={statusColor}
                  stroke="#18181b"
                  strokeWidth="2"
                />

                {/* Pin label on hover / key countries */}
                {(isSelected || isUser) && (
                  <g transform="translate(0, -18)">
                    <rect
                      x="-38"
                      y="-16"
                      width="76"
                      height="20"
                      rx="6"
                      fill="#18181b"
                    />
                    <text
                      x="0"
                      y="-2"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {c.flag} {c.code}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Country Details Card + Map Legend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Selected Country Inspector Card */}
        {selectedCountry && (
          <div
            className="war-card war-card-tilt-left"
            style={{
              backgroundColor: '#ffffff',
              border: '3px solid #18181b',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
                <div>
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{selectedCountry.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    ISO: {selectedCountry.code} • Drama: {selectedCountry.dramaLevel} pts
                  </span>
                </div>
              </div>

              <span
                className="war-badge"
                style={{
                  backgroundColor: getStatusColor(selectedCountry.status),
                  fontSize: '0.8rem',
                }}
              >
                {selectedCountry.status}
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--pastel-yellow-warm)',
                border: '2px solid #18181b',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#854d0e' }}>
                STRATEGIC DEFENSE PERK:
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#18181b' }}>
                {selectedCountry.perk}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                Tactical Ration: <strong>{selectedCountry.defenseFood}</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
              <strong>Fictional Dossier:</strong> {selectedCountry.fictionalHistory}
            </p>

            {/* Actions for this country */}
            {selectedCountry.id !== userCountry.id ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="war-btn war-btn-blue war-btn-sm"
                  onClick={() => {
                    playTrumpet();
                    onTargetCountry(selectedCountry.id);
                  }}
                  style={{ flex: 1 }}
                >
                  <Swords size={16} />
                  <span>Declare War on {selectedCountry.name}</span>
                </button>

                <button
                  type="button"
                  className="war-btn war-btn-mint war-btn-sm"
                  onClick={() => {
                    playPeaceChime();
                    onNavigateToDiplomacy();
                  }}
                >
                  <HeartHandshake size={16} />
                  <span>Offer Peace Pastry</span>
                </button>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--pastel-mint)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                👑 This is your sovereign homeland. Looking majestic today!
              </div>
            )}
          </div>
        )}

        {/* Legend Explaining Status Colors */}
        <div
          className="war-card war-card-tilt-right"
          style={{
            backgroundColor: '#fffdf5',
            border: '2.5px solid #18181b',
            padding: '24px',
          }}
        >
          <h4 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Diplomatic Status Legend</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DIPLOMATIC_STATUSES.map((status) => (
              <div
                key={status.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: status.color,
                    border: '2px solid #18181b',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <strong style={{ fontSize: '0.88rem', color: '#18181b' }}>{status.id}</strong>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.74rem',
                      color: '#64748b',
                      fontFamily: 'var(--font-hand)',
                    }}
                  >
                    {status.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

