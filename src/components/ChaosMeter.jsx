import React from 'react';
import { Flame, Sparkles, AlertTriangle, Coffee } from 'lucide-react';
import { playChaosBump, playBoing } from '../utils/sound';

export default function ChaosMeter({ chaosLevel, onBumpChaos, onCalmChaos }) {
  const getDefconInfo = (level) => {
    if (level < 25) {
      return {
        level: 'DEFCON 5',
        title: 'Lukewarm Chamomile (Suspiciously Quiet)',
        badgeColor: '#bbf7d0',
        textColor: '#15803d',
      };
    }
    if (level < 50) {
      return {
        level: 'DEFCON 4',
        title: 'Passive-Aggressive Email Drafting',
        badgeColor: '#fef08a',
        textColor: '#854d0e',
      };
    }
    if (level < 75) {
      return {
        level: 'DEFCON 3',
        title: 'Microwave Popcorn Burning at Multilateral Summit',
        badgeColor: '#fed7aa',
        textColor: '#9a3412',
      };
    }
    if (level < 90) {
      return {
        level: 'DEFCON 2',
        title: 'Unverified Group-Chat Screenshots Leaked',
        badgeColor: '#fecdd3',
        textColor: '#be123c',
      };
    }
    return {
      level: 'DEFCON 1',
      title: 'MAXIMUM DIPLOMATIC MAYHEM (Bagpipes & Cheese Sanctions)',
      badgeColor: '#fda4af',
      textColor: '#9f1239',
    };
  };

  const defcon = getDefconInfo(chaosLevel);

  const handleProvoke = () => {
    playChaosBump();
    onBumpChaos();
  };

  const handleCalm = () => {
    playBoing();
    onCalmChaos();
  };

  return (
    <div
      className="war-card war-card-tilt-right"
      style={{
        backgroundColor: '#fffdf5',
        border: 'var(--border-width) solid var(--border-color)',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#fee2e2',
              borderRadius: '10px',
              border: '2px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={20} color="#dc2626" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Global Chaos Meter</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              Live Geopolitical Absurdity Index
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="war-badge"
            style={{
              backgroundColor: defcon.badgeColor,
              color: defcon.textColor,
              fontSize: '0.85rem',
            }}
          >
            <AlertTriangle size={14} />
            {defcon.level}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
            }}
          >
            {chaosLevel}%
          </span>
        </div>
      </div>

      {/* Animated Bar */}
      <div className="chaos-meter-bar" style={{ marginBottom: '12px' }}>
        <div
          className="chaos-meter-fill"
          style={{ width: `${Math.min(100, Math.max(8, chaosLevel))}%` }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.15rem',
            color: '#475569',
            fontWeight: 700,
          }}
        >
          Stage: {defcon.title}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="war-btn war-btn-yellow war-btn-sm"
            onClick={handleProvoke}
            title="Spill coffee on the bilateral fax machine"
          >
            <Sparkles size={14} />
            Provoke Global Incident (+5%)
          </button>
          <button
            type="button"
            className="war-btn war-btn-mint war-btn-sm"
            onClick={handleCalm}
            title="Send complimentary pastries"
          >
            <Coffee size={14} />
            Offer Pastries (-4%)
          </button>
        </div>
      </div>
    </div>
  );
}

