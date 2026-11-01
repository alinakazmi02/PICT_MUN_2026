import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Flame,
  Globe,
  Radio,
  Sparkles,
  TrendingUp,
  Award,
  RefreshCw,
  LogOut,
  HeartHandshake,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Smile,
  Zap,
} from 'lucide-react';
import ChaosMeter from '../components/ChaosMeter';
import PigeonMascot from '../components/PigeonMascot';
import { DIPLOMATIC_STATUSES, COUNTRIES, NATIONAL_MOODS } from '../data/countries';
import { playClick, playTrumpet, playBoing } from '../utils/sound';

export default function DashboardView({
  userProfile,
  userCountry,
  onUpdateStatus,
  onNavigateToDeclare,
  onNavigateToMap,
  onNavigateToDiplomacy,
  onLogout,
  conflicts,
  onSupportConflict,
  chaosLevel,
  onBumpChaos,
  onCalmChaos,
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [randomConflictIdea, setRandomConflictIdea] = useState(null);

  const currentStatusObj =
    DIPLOMATIC_STATUSES.find((s) => s.id === userProfile.diplomaticStatus) ||
    DIPLOMATIC_STATUSES[2];

  const currentMoodObj =
    NATIONAL_MOODS.find((m) => m.id === userProfile.mood) || NATIONAL_MOODS[1];

  // Sarcastic diplomatic reputations
  const getReputation = (points) => {
    if (points > 3000) return { title: 'Supreme Lord of Inconvenience', stars: '★★★★★', badge: 'Certified Menace' };
    if (points > 2000) return { title: 'Certified Trouble Magnet', stars: '★★★★☆', badge: 'High Drama' };
    if (points > 1000) return { title: 'Passively Aggressive Enigma', stars: '★★★☆☆', badge: 'Active Agitator' };
    return { title: 'Suspiciously Friendly', stars: '★★☆☆☆', badge: 'Novice Pouter' };
  };

  const reputation = getReputation(userProfile.egoPoints || 1250);

  const handleStatusChange = (newStatus) => {
    playClick();
    onUpdateStatus(newStatus);
  };

  const handleGeneratePettyIdea = () => {
    playBoing();
    const otherCountries = COUNTRIES.filter((c) => c.id !== userCountry.id);
    const target = otherCountries[Math.floor(Math.random() * otherCountries.length)];
    const grievances = [
      `Accused our flag colors of clashing with the horizon`,
      `Refused to laugh at our ambassador's joke during the summit opening remarks`,
      `Exported unseasoned soup to our premier restaurant`,
      `Stole the exact blueprint of our national garden bench`,
      `Sneezed during our national anthem without saying excuse me`,
    ];
    const picked = grievances[Math.floor(Math.random() * grievances.length)];
    setRandomConflictIdea({
      target,
      grievance: picked,
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Welcome Banner */}
      <div
        className="war-card war-card-tilt-left"
        style={{
          backgroundColor: '#ffffff',
          padding: '28px',
          marginBottom: '28px',
          boxShadow: '6px 6px 0px #18181b',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Identity & Welcome text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                fontSize: '3.6rem',
                lineHeight: 1,
                filter: 'drop-shadow(2px 2px 0px #18181b)',
              }}
            >
              {userCountry.flag}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  className="war-badge"
                  style={{
                    backgroundColor: currentStatusObj.color,
                    borderColor: currentStatusObj.borderColor,
                    fontWeight: 700,
                  }}
                >
                  {currentStatusObj.badge}
                </span>

                <span
                  className="war-badge"
                  style={{ backgroundColor: currentMoodObj.color }}
                >
                  Mood: {currentMoodObj.emoji} {currentMoodObj.name}
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                  margin: '4px 0',
                  lineHeight: 1.2,
                }}
              >
                Welcome, {userCountry.name}.
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: '1.4rem',
                  color: '#dc2626',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                "Diplomacy has left the chat."
              </p>
            </div>
          </div>

          {/* Quick stats and Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div
              style={{
                textAlign: 'right',
                backgroundColor: 'var(--pastel-yellow-warm)',
                border: '2px solid #18181b',
                borderRadius: '12px',
                padding: '8px 14px',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#854d0e' }}>
                DIPLOMATIC REPUTATION:
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>
                {reputation.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>{reputation.stars}</div>
            </div>

            <button
              type="button"
              className="war-btn war-btn-pink war-btn-sm"
              onClick={() => {
                playClick();
                onLogout();
              }}
              title="Leaving the battlefield? Character development!"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Live Global Statistics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '2px dashed #e2e8f0',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>195 / 195</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
              NATIONS READY
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>
              {conflicts.length} Active
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
              PETTY CONFLICTS
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>0</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
              REAL CASUALTIES
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>
              {userProfile.egoPoints?.toLocaleString() || '1,250'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
              BRUISED EGO POINTS
            </div>
          </div>
        </div>
      </div>

      {/* Global Chaos Meter Component */}
      <div style={{ marginBottom: '28px' }}>
        <ChaosMeter
          chaosLevel={chaosLevel}
          onBumpChaos={onBumpChaos}
          onCalmChaos={onCalmChaos}
        />
      </div>

      {/* Dashboard Main Grid: Cards A, B, C, D */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        {/* Card A: Declare a Conflict */}
        <div
          className="war-card war-card-interactive"
          style={{
            backgroundColor: 'var(--pastel-yellow)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="war-badge" style={{ backgroundColor: '#fff' }}>
                CARD A • ACTION
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Declare a Conflict</h3>
            <p style={{ fontSize: '0.92rem', color: '#18181b', lineHeight: 1.5, marginBottom: '16px' }}>
              Select another fictional participant country from the 195 states, pick an absurd
              grievance (cheese, tea, door etiquette), and start a hilarious international rivalry.
            </p>
          </div>

          <div>
            <button
              type="button"
              className="war-btn war-btn-blue war-btn-lg"
              onClick={() => {
                playTrumpet();
                onNavigateToDeclare();
              }}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              <Swords size={22} />
              <span>OPEN WAR DECLARATION ROOM</span>
            </button>

            <button
              type="button"
              className="war-btn war-btn-sm"
              onClick={handleGeneratePettyIdea}
              style={{ width: '100%', backgroundColor: '#fff' }}
            >
              <Zap size={15} /> Random Grievance Idea Generator
            </button>

            {randomConflictIdea && (
              <div
                style={{
                  marginTop: '10px',
                  backgroundColor: '#fff',
                  border: '2px dashed #18181b',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                }}
              >
                <strong>Target:</strong> {randomConflictIdea.target.flag} {randomConflictIdea.target.name}
                <br />
                <strong>Dispute:</strong> "{randomConflictIdea.grievance}"
              </div>
            )}
          </div>
        </div>

        {/* Card C: Diplomatic Status Switcher */}
        <div
          className="war-card war-card-tilt-right"
          style={{ backgroundColor: 'var(--pastel-lavender)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="war-badge" style={{ backgroundColor: '#fff' }}>
              CARD C • STATUS
            </span>
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Diplomatic Status</h3>
          <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '14px' }}>
            Switch your country's official posture at any moment. The rest of the world will react accordingly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DIPLOMATIC_STATUSES.map((status) => {
              const isActive = userProfile.diplomaticStatus === status.id;
              return (
                <div
                  key={status.id}
                  onClick={() => handleStatusChange(status.id)}
                  style={{
                    backgroundColor: isActive ? status.color : '#fff',
                    border: '2px solid #18181b',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    transform: isActive ? 'translateX(4px)' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{status.badge}</span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.72rem',
                        color: '#64748b',
                        fontFamily: 'var(--font-hand)',
                      }}
                    >
                      {status.desc}
                    </span>
                  </div>
                  {isActive && <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>ACTIVE</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card D: My Country Profile */}
        <div
          className="war-card war-card-tilt-left"
          style={{ backgroundColor: 'var(--pastel-mint)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="war-badge" style={{ backgroundColor: '#fff' }}>
              CARD D • DOSSIER
            </span>
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>My Country Profile</h3>

          <div
            style={{
              backgroundColor: '#fff',
              border: '2px solid #18181b',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2rem' }}>{userCountry.flag}</span>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{userCountry.name}</strong>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Representative: <strong>{userProfile.repName}</strong>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.4, marginBottom: '8px' }}>
              <strong>Fictional History:</strong> {userCountry.fictionalHistory}
            </div>

            <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>
              🛡️ Strategic Perk: {userCountry.perk}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
              🥐 Defense Ration: {userCountry.defenseFood}
            </div>
          </div>

          <button
            type="button"
            className="war-btn war-btn-sm"
            onClick={() => {
              playClick();
              onNavigateToDiplomacy();
            }}
            style={{ width: '100%', backgroundColor: '#fff' }}
          >
            <HeartHandshake size={15} /> Go to Diplomacy & Ceasefire Room
          </button>
        </div>
      </div>

      {/* Card B: Global Situation Feed */}
      <div
        className="war-card"
        style={{
          backgroundColor: '#ffffff',
          border: 'var(--border-width) solid var(--border-color)',
          padding: '28px',
          boxShadow: '6px 6px 0px #18181b',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="war-badge" style={{ backgroundColor: 'var(--pastel-pink)' }}>
                CARD B • LIVE SITUATION
              </span>
              <span className="war-stamp">Satirical Intelligence Feed</span>
            </div>
            <h3 style={{ fontSize: '1.7rem', margin: '4px 0 0' }}>Ongoing Fictional Conflicts</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="war-btn war-btn-blue war-btn-sm"
              onClick={() => {
                playClick();
                onNavigateToMap();
              }}
            >
              <Globe size={15} /> View on Global Map
            </button>
          </div>
        </div>

        {/* Conflicts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {conflicts.map((conf) => {
            const countryA = COUNTRIES.find((c) => c.id === conf.countryA) || COUNTRIES[0];
            const countryB = COUNTRIES.find((c) => c.id === conf.countryB) || COUNTRIES[1];

            return (
              <div
                key={conf.id}
                style={{
                  border: '2px solid #18181b',
                  borderRadius: '16px',
                  padding: '16px',
                  backgroundColor: '#fffdf5',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{countryA.flag}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        color: '#dc2626',
                        fontSize: '1rem',
                      }}
                    >
                      VS
                    </span>
                    <span style={{ fontSize: '1.6rem' }}>{countryB.flag}</span>
                    <div>
                      <strong style={{ fontSize: '1.15rem', color: '#18181b' }}>
                        {conf.name}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                        Declared: {conf.declaredDate || 'Recently'} • {countryA.name} vs{' '}
                        {countryB.name}
                      </span>
                    </div>
                  </div>

                  <span
                    className="war-badge"
                    style={{
                      backgroundColor:
                        conf.intensity === 'Maximum Diplomatic Chaos'
                          ? '#fecdd3'
                          : conf.intensity === 'Twitter-Level Drama'
                          ? '#fef08a'
                          : '#fed7aa',
                      fontSize: '0.75rem',
                    }}
                  >
                    {conf.intensity}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                  "{conf.reason}"
                </p>

                {/* Casualties / Bruised Egos / Support Buttons */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #cbd5e1',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>💀 Real Casualties: <strong>0</strong></span>
                    <span>😤 Bruised Egos: <strong>{(conf.bruisedEgos || 1200).toLocaleString()}</strong></span>
                    <span>✉️ Passive Memos: <strong>{conf.memosSent || 42}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="war-btn war-btn-sm"
                      onClick={() => {
                        playClick();
                        onSupportConflict(conf.id, 'A');
                      }}
                      style={{ backgroundColor: '#fff', fontSize: '0.76rem', padding: '4px 10px' }}
                    >
                      Cheer {countryA.flag} (+1)
                    </button>
                    <button
                      type="button"
                      className="war-btn war-btn-sm"
                      onClick={() => {
                        playClick();
                        onSupportConflict(conf.id, 'B');
                      }}
                      style={{ backgroundColor: '#fff', fontSize: '0.76rem', padding: '4px 10px' }}
                    >
                      Cheer {countryB.flag} (+1)
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sergeant Coo's Strategic Bunker */}
      <div
        className="war-card"
        style={{
          backgroundColor: '#fffdf9',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <span className="war-badge" style={{ backgroundColor: 'var(--pastel-yellow)', marginBottom: '8px' }}>
            🎖️ TACTICAL ADVISORY BUNKER
          </span>
          <h4 style={{ fontSize: '1.3rem', margin: '4px 0' }}>Sergeant Coo's Daily Intelligence</h4>
          <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4 }}>
            Our chief feathered strategist observes all 195 nations from atop high-voltage transmission lines.
            Click Sergeant Coo anytime to receive unhelpful, highly confident military recommendations.
          </p>
        </div>

        <PigeonMascot size="md" />
      </div>
    </div>
  );
}

