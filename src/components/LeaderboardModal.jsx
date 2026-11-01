import React from 'react';
import { Trophy, X, Award, Flame, Sparkles } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { playClick } from '../utils/sound';

export default function LeaderboardModal({ isOpen, onClose, userProfile }) {
  if (!isOpen) return null;

  // Sort top 15 most petty nations
  const rankedCountries = [...COUNTRIES]
    .sort((a, b) => b.dramaLevel - a.dramaLevel)
    .slice(0, 15);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 24, 27, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="war-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fffdf5',
          border: '3px solid #18181b',
          boxShadow: '8px 8px 0px #18181b',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
            borderBottom: '2.5px solid #18181b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                backgroundColor: 'var(--pastel-yellow)',
                borderRadius: '12px',
                border: '2px solid #18181b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={22} color="#b45309" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Hall of Unnecessary Drama</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                World Ranking of Most Frivolously Aggressive Nations
              </span>
            </div>
          </div>

          <button
            type="button"
            className="war-btn war-btn-sm"
            onClick={() => {
              playClick();
              onClose();
            }}
            style={{ padding: '6px 10px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rankedCountries.map((country, idx) => {
              const isUser = userProfile?.countryId === country.id;
              const medal =
                idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

              return (
                <div
                  key={country.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '2px solid #18181b',
                    backgroundColor: isUser
                      ? 'var(--pastel-yellow)'
                      : idx < 3
                      ? 'var(--pastel-pink-soft)'
                      : '#ffffff',
                    boxShadow: '2px 2px 0px #18181b',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        width: '32px',
                        textAlign: 'center',
                      }}
                    >
                      {medal}
                    </span>
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{country.flag}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.95rem' }}>{country.name}</strong>
                        {isUser && (
                          <span
                            className="war-badge"
                            style={{
                              backgroundColor: '#60a5fa',
                              fontSize: '0.65rem',
                              padding: '1px 6px',
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          color: '#475569',
                          fontFamily: 'var(--font-hand)',
                        }}
                      >
                        {country.perk.slice(0, 48)}...
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        color: '#b91c1c',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Flame size={14} />
                      {country.dramaLevel} pts
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                      Drama Level
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            paddingTop: '12px',
            borderTop: '2px dashed #18181b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-hand)',
            fontSize: '0.95rem',
            color: '#64748b',
          }}
        >
          <span>🏆 Scores calculated from sigh volumes & passive-aggressive tweets.</span>
          <button
            type="button"
            className="war-btn war-btn-blue war-btn-sm"
            onClick={() => {
              playClick();
              onClose();
            }}
          >
            Acknowledge Superior Petty
          </button>
        </div>
      </div>
    </div>
  );
}

