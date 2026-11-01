import React, { useEffect, useState } from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { DISPATCH_ALERTS } from '../data/headlines';
import { playClick } from '../utils/sound';

export default function DispatchToast({ activeAlert, onClose }) {
  if (!activeAlert) return null;

  return (
    <div className="dispatch-toast">
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          backgroundColor: '#fde047',
          border: '2px solid #18181b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0,
        }}
      >
        {activeAlert.flag || '📢'}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#dc2626',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ⚡ {activeAlert.title}
          </span>
          <button
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#1e293b', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
          {activeAlert.text}
        </p>

        <span
          style={{
            display: 'inline-block',
            marginTop: '6px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-hand)',
            color: '#64748b',
          }}
        >
          Transmitted via Pigeon Satellite Net
        </span>
      </div>
    </div>
  );
}

