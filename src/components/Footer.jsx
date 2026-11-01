import React from 'react';
import { ShieldAlert, Heart, Coffee, RotateCcw } from 'lucide-react';
import { playClick } from '../utils/sound';

export default function Footer({ onResetData, onGoHome }) {
  return (
    <footer className="war-footer">
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Mandatory Fictional Satire Banner */}
        <div className="war-disclaimer-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldAlert size={18} color="#b91c1c" />
            <strong
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                color: '#991b1b',
              }}
            >
              FICTIONAL SATIRE — CONCEPT PROJECT, NOT A REAL WAR SERVICE.
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
            WAR™ is an interactive parody designed strictly for entertainment and humor. It does not
            facilitate, endorse, encourage, or simulate real-world warfare or political conflict.
            All rivalries are 100% fictional food and etiquette disputes.
          </p>
        </div>

        {/* Small disclaimer badge & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', margin: '14px 0' }}>
          <span className="war-badge" style={{ backgroundColor: 'var(--pastel-yellow)', fontSize: '0.82rem' }}>
            100% Fictional. 0% Peaceful.
          </span>
          <span className="war-stamp">Entry is free. Exit is negotiable.</span>
          <span className="war-badge" style={{ backgroundColor: 'var(--pastel-mint)', fontSize: '0.82rem' }}>
            🕊️ Real Casualties: 0
          </span>
        </div>

        {/* Humorous sub-footer & quick actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '0.84rem',
            color: '#64748b',
            flexWrap: 'wrap',
            marginTop: '12px',
          }}
        >
          <span>WAR™ v2.6.4 (Satire Edition)</span>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              playClick();
              onGoHome();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Safe Zone (Living Room of Neutrality)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all declared wars, chaos meter, and profile back to fresh defaults?')) {
                playClick();
                onResetData();
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCcw size={12} /> Reset Portal Data
          </button>
        </div>

        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '14px', fontFamily: 'var(--font-hand)' }}>
          Dedicated to all the unreturned Tupperware and disputed sandwich recipes worldwide. 🥪✨
        </p>
      </div>
    </footer>
  );
}
