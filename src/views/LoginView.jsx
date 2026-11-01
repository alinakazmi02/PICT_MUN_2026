import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  Dice5,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Flag,
  User,
  MessageSquare,
  Smile,
  Zap,
} from 'lucide-react';
import CountrySelect from '../components/CountrySelect';
import { COUNTRIES, NATIONAL_MOODS } from '../data/countries';
import { playClick, playTrumpet } from '../utils/sound';

const FUNNY_REP_NAMES = [
  'Lord Reginald Crumpet III',
  'Grand Duke Mario Parmigiano',
  'Viscount Pierre Le Sigh',
  'Ambassador McSneak',
  'General Chad Freedom-Eagle',
  'Baroness Von Apfelstrudel',
  'Chief Auntie Supreme',
  'Marshal Min-ho High-Kick',
  'Admiral Sarcastic Sigh',
  'Consul Jordi Tax-Haven',
  'Archon Socrates of Accounting',
  'Captain Bruce Croc-Bait',
];

const PRESET_REASONS = [
  'Someone stole our grandmother\'s recipe for cheese.',
  'Their ambassador did not wave back in the UN revolving door.',
  'Our flag looks noticeably better in their climate.',
  'Our national astrologer advised it during yesterday\'s eclipse.',
  'Honestly just bored on a Tuesday afternoon.',
  'They pronounced our capital city with unacceptable inflection.',
];

export default function LoginView({ onLoginSuccess, initialProfile }) {
  const [countryId, setCountryId] = useState(initialProfile?.countryId || 'it');
  const [repName, setRepName] = useState(
    initialProfile?.repName || 'Grand Duke Mario Parmigiano'
  );
  const [reason, setReason] = useState(
    initialProfile?.reason || 'France alleged that baguettes are superior to focaccia.'
  );
  const [selectedMood, setSelectedMood] = useState(initialProfile?.mood || 'dramatic');
  const [rememberMe, setRememberMe] = useState(
    initialProfile?.rememberMe !== undefined ? initialProfile.rememberMe : true
  );
  const [validationError, setValidationError] = useState('');

  const selectedCountry = COUNTRIES.find((c) => c.id === countryId) || COUNTRIES[0];

  const handleRandomizeName = () => {
    playClick();
    const random = FUNNY_REP_NAMES[Math.floor(Math.random() * FUNNY_REP_NAMES.length)];
    setRepName(random);
  };

  const handleSelectCountry = (newCountryId) => {
    setCountryId(newCountryId);
    const country = COUNTRIES.find((c) => c.id === newCountryId);
    if (country && !repName) {
      setRepName(country.defaultRep);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!countryId) {
      setValidationError('Please choose a sovereign nation from the 195 options.');
      return;
    }
    if (!repName.trim()) {
      setValidationError('Even fictional warmongers need a dignified representative name.');
      return;
    }
    if (!reason.trim()) {
      setValidationError('You cannot enter a fictional war without at least one trivial grievance.');
      return;
    }

    setValidationError('');
    playTrumpet();

    const profile = {
      countryId,
      repName: repName.trim(),
      reason: reason.trim(),
      mood: selectedMood,
      rememberMe,
      registeredAt: new Date().toISOString(),
      diplomaticStatus: selectedCountry.status || 'Mildly Offended',
      egoPoints: 1250,
      declaredWarsCount: 1,
      peaceTreatiesCount: 0,
    };

    onLoginSuccess(profile);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Page Title & Subtitle */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            className="war-badge"
            style={{
              backgroundColor: 'var(--pastel-pink)',
              color: '#991b1b',
              transform: 'rotate(-1deg)',
            }}
          >
            📋 Registration Protocol 2026
          </span>
          <span className="war-stamp">Takes ~45 Seconds</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            marginBottom: '8px',
            lineHeight: 1.15,
          }}
        >
          Welcome, Future Aggressor.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.45rem',
            color: '#475569',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          "New to conflict? Creating an account takes less time than a ceasefire."
        </p>
      </div>

      {/* Main Form Card */}
      <div
        className="war-card war-card-tilt-right"
        style={{
          backgroundColor: '#ffffff',
          padding: '36px 32px',
          boxShadow: '8px 8px 0px #18181b',
        }}
      >
        <form onSubmit={handleSubmit}>
          {validationError && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                border: '2px solid #dc2626',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#991b1b',
                fontWeight: 600,
                fontSize: '0.9rem',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldAlert size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Field 1: Country Dropdown */}
          <div style={{ marginBottom: '26px' }}>
            <CountrySelect
              value={countryId}
              onChange={handleSelectCountry}
              label="1. Select Your Country (All 195 Recognized Nations Available)"
            />
            {selectedCountry && (
              <div
                style={{
                  marginTop: '10px',
                  backgroundColor: 'var(--pastel-yellow-warm)',
                  border: '2px dashed #18181b',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#854d0e', display: 'block' }}>
                    NATIONAL PERK ACTIVATED:
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 600 }}>
                    {selectedCountry.perk}
                  </span>
                </div>
                <span className="war-badge" style={{ backgroundColor: '#fff', fontSize: '0.75rem' }}>
                  🍲 Tactical Ration: {selectedCountry.defenseFood}
                </span>
              </div>
            )}
          </div>

          {/* Field 2: Representative Name */}
          <div style={{ marginBottom: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#18181b',
                }}
              >
                2. Representative Name (Your Comical Alias)
              </label>
              <button
                type="button"
                onClick={handleRandomizeName}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Dice5 size={14} /> Suggest Ridiculous Title
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                placeholder="e.g. Sir Reginald Crumpet III"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: 'var(--border-width) solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                }}
              />
            </div>
            <span style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
              *History will remember this name with mild perplexity.
            </span>
          </div>

          {/* Field 3: Reason for Entering */}
          <div style={{ marginBottom: '26px' }}>
            <label
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#18181b',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              3. Reason for Entering (The Trivial Grievance)
            </label>

            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why your country feels overwhelmingly petty..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                border: 'var(--border-width) solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical',
                backgroundColor: '#fafafa',
              }}
            />

            {/* Quick Pick Reason Chips */}
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Quick-Pick Grievances:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {PRESET_REASONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playClick();
                      setReason(preset);
                    }}
                    style={{
                      background: '#f1f5f9',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      color: '#334155',
                      textAlign: 'left',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--pastel-yellow-warm)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Field 4: Select National Mood */}
          <div style={{ marginBottom: '26px' }}>
            <label
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#18181b',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              4. Select Your National Mood (Emotional Doctrine)
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
              }}
            >
              {NATIONAL_MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <div
                    key={mood.id}
                    onClick={() => {
                      playClick();
                      setSelectedMood(mood.id);
                    }}
                    style={{
                      border: 'var(--border-width) solid var(--border-color)',
                      borderRadius: '14px',
                      padding: '12px 10px',
                      backgroundColor: isSelected ? mood.color : '#fff',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{mood.emoji}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem' }}>
                      {mood.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Field 5: Checkbox "Remember me (history will)" */}
          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => {
                  playClick();
                  setRememberMe(e.target.checked);
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#18181b',
                  cursor: 'pointer',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#18181b',
                }}
              >
                Remember me (history will).
              </span>
            </label>
            <span
              style={{
                display: 'block',
                marginLeft: '30px',
                fontSize: '0.76rem',
                color: '#64748b',
                fontFamily: 'var(--font-hand)',
              }}
            >
              Saves your credentials safely in your browser's local storage vaults.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              className="war-btn war-btn-blue war-btn-lg"
              style={{ flex: 1, minWidth: '220px' }}
            >
              <Zap size={20} />
              <span>DECLARE MY PRESENCE</span>
            </button>

            <button
              type="button"
              className="war-btn war-btn-yellow war-btn-lg"
              onClick={() => {
                playClick();
                setRepName(selectedCountry.defaultRep);
                setReason('We hold sovereign rights to excessive pride and stubbornness.');
              }}
              style={{ minWidth: '200px' }}
            >
              <span>Continue with National Pride</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

