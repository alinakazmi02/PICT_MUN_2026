import React from 'react';
import { ShieldCheck, MapPin, Eye, AlertCircle } from 'lucide-react';

export default function SafeMeetingBanner({ compact = false }) {
  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.65rem 0.85rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          color: '#1e40af'
        }}
      >
        <ShieldCheck size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Campus Safety:</strong> Arrange handover at well-lit public desks like Central Library Reception or Campus Gate 1 Security Desk.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginTop: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', flex: 1, minWidth: '260px' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <ShieldCheck size={22} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--color-text-main)' }}>
            Safe Campus Verification Protocol
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
            Never share passwords, student portal credentials, or OTPs. Before returning items, verify distinguishing marks, lock screens, or stickers.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', padding: '0.35rem 0.65rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
          <MapPin size={13} color="var(--color-primary)" />
          Meet in public campus areas
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', padding: '0.35rem 0.65rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
          <Eye size={13} color="var(--color-accent)" />
          Verify physical proof first
        </div>
      </div>
    </div>
  );
}
