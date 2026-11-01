import React from 'react';
import { Coffee, Heart, ArrowLeft, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { playClick, playPeaceChime } from '../utils/sound';

export default function ExitView({ onReturnToPortal }) {
  return (
    <div style={{ maxWidth: '780px', margin: '40px auto', textAlign: 'center' }}>
      <div
        className="war-card war-card-tilt-left"
        style={{
          backgroundColor: '#fefce8',
          border: '3px solid #18181b',
          padding: '48px 32px',
          boxShadow: '10px 10px 0px #18181b',
        }}
      >
        <div style={{ fontSize: '4.5rem', marginBottom: '14px' }}>☕ 🛋️ 🪴</div>

        <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '16px' }}>
          <span
            className="war-badge"
            style={{
              backgroundColor: 'var(--pastel-mint)',
              color: '#065f46',
              fontSize: '0.88rem',
              padding: '6px 16px',
            }}
          >
            <ShieldCheck size={16} /> SAFE ZONE: THE LIVING ROOM OF NEUTRALITY
          </span>
          <span className="war-stamp" style={{ backgroundColor: '#fed7aa', color: '#9a3412' }}>
            Zero Conflicts Permitted
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            marginBottom: '14px',
            lineHeight: 1.2,
          }}
        >
          Leaving the battlefield?
          <br />
          <span style={{ color: '#059669' }}>Character development!</span>
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#475569',
            maxWidth: '560px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          You have successfully stepped outside the theater of petty geopolitical tension.
          Here, tea is served hot, food containers are always returned with their original lids,
          and nobody is subtweeting the prime minister.
        </p>

        {/* Peaceful Statistics */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          <div
            className="war-badge"
            style={{ backgroundColor: '#fff', padding: '8px 18px', fontSize: '0.88rem' }}
          >
            🍵 Wars Avoided Today: 1
          </div>
          <div
            className="war-badge"
            style={{ backgroundColor: '#fff', padding: '8px 18px', fontSize: '0.88rem' }}
          >
            🧘 Diplomatic Energy Conserved: 100%
          </div>
          <div
            className="war-badge"
            style={{ backgroundColor: '#fff', padding: '8px 18px', fontSize: '0.88rem' }}
          >
            ✨ Internal Peace Restored
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="war-btn war-btn-blue war-btn-lg"
            onClick={() => {
              playClick();
              onReturnToPortal();
            }}
          >
            <ArrowLeft size={20} />
            <span>I Miss The Drama (Return to WAR™)</span>
          </button>

          <button
            type="button"
            className="war-btn war-btn-yellow war-btn-lg"
            onClick={() => {
              playPeaceChime();
              alert('Enjoy your chamomile tea and uninterrupted afternoon!');
            }}
          >
            <Coffee size={20} />
            <span>Stay in Cozy Isolation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

