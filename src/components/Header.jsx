import React from 'react';
import {
  Swords,
  Globe,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Volume2,
  VolumeX,
  Trophy,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { playClick, getMuted, setMuted } from '../utils/sound';

export default function Header({
  activeScreen,
  setActiveScreen,
  userProfile,
  userCountry,
  onOpenLeaderboard,
  soundMuted,
  setSoundMuted,
}) {
  const handleToggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    setMuted(next);
  };

  const navItems = [
    { id: 'welcome', label: 'Gate', icon: Sparkles },
    { id: 'dashboard', label: 'War Room', icon: LayoutDashboard },
    { id: 'declare', label: 'Declare War', icon: Swords },
    { id: 'map', label: 'Conflict Map', icon: Globe },
    { id: 'diplomacy', label: 'Diplomacy', icon: HeartHandshake },
  ];

  return (
    <header className="war-header">
      <div className="war-header-inner">
        {/* Brand */}
        <div
          className="war-brand"
          onClick={() => {
            playClick();
            setActiveScreen('welcome');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="war-brand-logo">🕊️</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                WAR™
              </span>
              <span
                className="war-badge"
                style={{
                  backgroundColor: 'var(--pastel-pink)',
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                }}
              >
                UNNECESSARY PORTAL
              </span>
            </div>
            <p
              style={{
                fontSize: '0.74rem',
                color: '#64748b',
                fontFamily: 'var(--font-heading)',
                margin: 0,
                marginTop: '-3px',
              }}
            >
              "Because apparently, talking wasn't enough."
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="war-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`war-nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playClick();
                  setActiveScreen(item.id);
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Leaderboard Trigger */}
          <button
            type="button"
            className="war-nav-tab"
            onClick={() => {
              playClick();
              onOpenLeaderboard();
            }}
            title="Hall of Unnecessary Drama"
          >
            <Trophy size={16} color="#d97706" />
            <span>Leaderboard</span>
          </button>
        </nav>

        {/* User Status, Sound, and Exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Active User Country Pill */}
          {userProfile && userCountry ? (
            <div
              className="war-badge"
              onClick={() => {
                playClick();
                setActiveScreen('dashboard');
              }}
              style={{
                backgroundColor: 'var(--pastel-yellow)',
                cursor: 'pointer',
                padding: '6px 12px',
              }}
              title="Your sovereign identity"
            >
              <span style={{ fontSize: '1.1rem' }}>{userCountry.flag}</span>
              <span style={{ fontWeight: 700 }}>{userCountry.name}</span>
            </div>
          ) : (
            <button
              type="button"
              className="war-btn war-btn-yellow war-btn-sm"
              onClick={() => {
                playClick();
                setActiveScreen('login');
              }}
            >
              Register Country
            </button>
          )}

          {/* Audio toggle button */}
          <button
            type="button"
            className="war-btn war-btn-sm"
            onClick={handleToggleSound}
            title={soundMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            style={{ padding: '6px 10px', background: soundMuted ? '#f1f5f9' : '#fff' }}
          >
            {soundMuted ? <VolumeX size={16} color="#64748b" /> : <Volume2 size={16} color="#059669" />}
          </button>

          {/* Exit to Safe Zone */}
          <button
            type="button"
            className="war-btn war-btn-mint war-btn-sm"
            onClick={() => {
              playClick();
              setActiveScreen('exit');
            }}
            title="Safe Zone: The Living Room of Neutrality"
          >
            <Coffee size={15} />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </header>
  );
}

