import React from 'react';
import {
  Swords,
  Coffee,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Dice5,
  Heart,
  Globe,
} from 'lucide-react';
import PigeonMascot from '../components/PigeonMascot';
import { playClick, playTrumpet } from '../utils/sound';
import { COUNTRIES } from '../data/countries';

export default function WelcomeView({
  onEnterChaos,
  onGoHome,
  onQuickStart,
  userProfile,
  chaosLevel,
}) {
  const handleEnter = () => {
    playTrumpet();
    onEnterChaos();
  };

  const handleRandomStart = () => {
    playClick();
    const randomIndex = Math.floor(Math.random() * COUNTRIES.length);
    const randomCountry = COUNTRIES[randomIndex];
    onQuickStart(randomCountry.id);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
      {/* Floating hand-drawn doodle stars */}
      <div
        className="doodle-star"
        style={{ position: 'absolute', top: '-10px', left: '6%', fontSize: '2rem', color: '#f59e0b' }}
      >
        ✦
      </div>
      <div
        className="doodle-star"
        style={{ position: 'absolute', top: '40px', right: '8%', fontSize: '2.4rem', color: '#ec4899', animationDelay: '1.2s' }}
      >
        ✧
      </div>
      <div
        className="doodle-star"
        style={{ position: 'absolute', bottom: '60px', left: '4%', fontSize: '1.8rem', color: '#3b82f6', animationDelay: '0.6s' }}
      >
        ★
      </div>

      {/* Hero Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <span
          className="war-badge"
          style={{
            backgroundColor: 'var(--pastel-yellow)',
            padding: '6px 16px',
            fontSize: '0.88rem',
            transform: 'rotate(-1.5deg)',
          }}
        >
          <Sparkles size={16} /> 100% Fictional. 0% Peaceful.
        </span>
        <span
          className="war-stamp"
          style={{
            transform: 'rotate(2deg)',
            fontSize: '0.95rem',
            backgroundColor: 'var(--pastel-pink)',
          }}
        >
          No Real Weapons • 100% Baguette Ballistics
        </span>
      </div>

      {/* Main Branding */}
      <div style={{ marginBottom: '16px' }}>
        <h1
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.8rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            margin: '0 auto',
            color: '#18181b',
            textShadow: '4px 4px 0px #fed7aa',
          }}
        >
          WAR™
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
            color: '#475569',
            marginTop: '8px',
            transform: 'rotate(-0.8deg)',
          }}
        >
          "Because apparently, talking wasn't enough."
        </p>
      </div>

      {/* Mascot Section */}
      <div style={{ margin: '30px auto 26px', display: 'flex', justifyContent: 'center' }}>
        <PigeonMascot
          size="hero"
          speech="Click me! I am Sergeant Coo, supreme coordinator of unnecessary geopolitical squabbles."
        />
      </div>

      {/* Main Heading Call to Action */}
      <div
        className="war-card war-card-tilt-left"
        style={{
          maxWidth: '780px',
          margin: '0 auto 36px',
          backgroundColor: '#fffdf5',
          padding: '36px 28px',
          boxShadow: '8px 8px 0px #18181b',
        }}
      >
        <span
          className="war-badge"
          style={{
            backgroundColor: 'var(--pastel-coral)',
            color: '#9f1239',
            marginBottom: '14px',
            fontSize: '0.85rem',
          }}
        >
          <AlertCircle size={15} /> Official Gateway to Petty Conflict
        </span>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}
        >
          Enter if you want to go to war.
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: '#475569',
            maxWidth: '620px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Select your nation from all 195 recognized states, invent an absurd grievance
          over unreturned food containers or bad coffee, and plunge the fictional world into
          deliciously awkward diplomatic tension.
        </p>

        {/* Primary Action Buttons */}
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
            onClick={handleEnter}
            style={{ minWidth: '220px' }}
          >
            <Swords size={24} />
            <span>ENTER THE CHAOS</span>
          </button>

          <button
            type="button"
            className="war-btn war-btn-yellow war-btn-lg"
            onClick={() => {
              playClick();
              onGoHome();
            }}
            style={{ minWidth: '180px' }}
          >
            <Coffee size={22} />
            <span>Go Home</span>
          </button>
        </div>

        {/* Quick Launch Presets */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '2px dashed #e2e8f0',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.86rem',
              color: '#64748b',
              fontWeight: 700,
              display: 'block',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Or Deploy Instantly As:
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              className="war-btn war-btn-sm"
              onClick={() => {
                playClick();
                onQuickStart('it');
              }}
              style={{ backgroundColor: '#ffedd5' }}
            >
              🇮🇹 Italy (Pasta Defense)
            </button>
            <button
              type="button"
              className="war-btn war-btn-sm"
              onClick={() => {
                playClick();
                onQuickStart('fr');
              }}
              style={{ backgroundColor: '#ffe4e6' }}
            >
              🇫🇷 France (Baguette Ballistics)
            </button>
            <button
              type="button"
              className="war-btn war-btn-sm"
              onClick={() => {
                playClick();
                onQuickStart('ca');
              }}
              style={{ backgroundColor: '#e0f2fe' }}
            >
              🇨🇦 Canada (Polite Fury)
            </button>
            <button
              type="button"
              className="war-btn war-btn-sm"
              onClick={handleRandomStart}
              style={{ backgroundColor: '#fef08a' }}
            >
              <Dice5 size={16} /> Random Rogue State
            </button>
          </div>
        </div>
      </div>

      {/* Live portal statistics pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        <div
          className="war-badge"
          style={{ backgroundColor: 'var(--pastel-mint)', padding: '8px 18px', fontSize: '0.92rem' }}
        >
          <Globe size={16} /> 195 Countries Registered
        </div>
        <div
          className="war-badge"
          style={{ backgroundColor: 'var(--pastel-lavender)', padding: '8px 18px', fontSize: '0.92rem' }}
        >
          🔥 Global Chaos: {chaosLevel}%
        </div>
        <div
          className="war-badge"
          style={{ backgroundColor: 'var(--pastel-pink)', padding: '8px 18px', fontSize: '0.92rem' }}
        >
          ❤️ Real Casualties: 0
        </div>
      </div>
    </div>
  );
}

