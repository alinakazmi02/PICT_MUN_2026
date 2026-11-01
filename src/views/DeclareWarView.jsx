import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Swords,
  Dice5,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Flame,
  FileText,
  RotateCcw,
} from 'lucide-react';
import CountrySelect from '../components/CountrySelect';
import { COUNTRIES } from '../data/countries';
import {
  CONFLICT_INTENSITIES,
  FUNNY_CONFLICT_NAMES,
  GRIEVANCE_TEMPLATES,
} from '../data/conflicts';
import { playClick, playTrumpet, playBoing } from '../utils/sound';

export default function DeclareWarView({
  userProfile,
  userCountry,
  onWarDeclared,
  onNavigateToDashboard,
  onNavigateToMap,
}) {
  const [targetCountryId, setTargetCountryId] = useState('fr');
  const [conflictName, setConflictName] = useState('The Great Sandwich Dispute');
  const [reason, setReason] = useState(
    'Their state TV claimed their grandmother makes superior pastries. Our national dignity is in tatters.'
  );
  const [selectedIntensity, setSelectedIntensity] = useState('Maximum Diplomatic Chaos');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [declaredData, setDeclaredData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const targetCountry = COUNTRIES.find((c) => c.id === targetCountryId) || COUNTRIES[1];

  const handleRandomizeName = () => {
    playClick();
    const randomName =
      FUNNY_CONFLICT_NAMES[Math.floor(Math.random() * FUNNY_CONFLICT_NAMES.length)];
    setConflictName(randomName);
  };

  const handleSelectTemplate = (template) => {
    playClick();
    setReason(template.text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetCountryId) {
      setErrorMsg('You must choose an opponent country to antagonize.');
      return;
    }
    if (targetCountryId === userCountry.id) {
      setErrorMsg('You cannot declare war against yourself; that is simply called a national budget debate.');
      return;
    }
    if (!conflictName.trim()) {
      setErrorMsg('Every historic dispute needs a gloriously ridiculous name.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please specify why your feelings were so deeply hurt.');
      return;
    }

    setErrorMsg('');
    playTrumpet();

    // Trigger canvas-confetti celebration!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffcad4', '#b5e2fa', '#fde047', '#cbf3d2', '#d8bbff', '#f87171'],
      });
    } catch (e) {
      // ignore
    }

    const newConflict = {
      id: `conf-${Date.now()}`,
      name: conflictName.trim(),
      countryA: userCountry.id,
      countryB: targetCountryId,
      intensity: selectedIntensity,
      reason: reason.trim(),
      declaredDate: 'Just now',
      realCasualties: 0,
      bruisedEgos: Math.floor(Math.random() * 5000) + 1200,
      memosSent: 14,
      status: 'Active Feud',
      supportA: 100,
      supportB: 85,
    };

    setDeclaredData(newConflict);
    setIsSubmitted(true);
    onWarDeclared(newConflict);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Top Tag & Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            className="war-badge"
            style={{
              backgroundColor: 'var(--pastel-coral)',
              color: '#991b1b',
              transform: 'rotate(-1.5deg)',
            }}
          >
            ⚔️ Formal Provocation Chamber
          </span>
          <span className="war-stamp">Zero Consequences Guaranteed</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            margin: '4px 0 8px',
            lineHeight: 1.15,
          }}
        >
          Who Ruined Your Day?
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.45rem',
            color: '#475569',
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          "Choose an opponent, invent a grievance, and make it everyone's problem."
        </p>
      </div>

      {/* Main Content: Form OR Success Decree */}
      {!isSubmitted ? (
        <div
          className="war-card war-card-tilt-right"
          style={{
            backgroundColor: '#ffffff',
            padding: '36px 32px',
            boxShadow: '8px 8px 0px #18181b',
          }}
        >
          <form onSubmit={handleSubmit}>
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '2px solid #dc2626',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#991b1b',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldAlert size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Field: Select Opponent Country */}
            <div style={{ marginBottom: '24px' }}>
              <CountrySelect
                value={targetCountryId}
                onChange={(id) => {
                  playClick();
                  setTargetCountryId(id);
                }}
                label="Target Country (Choose from all 195 Nations)"
                placeholder="Search target nation..."
                excludeCountryId={userCountry.id}
              />

              {targetCountry && (
                <div
                  style={{
                    marginTop: '10px',
                    backgroundColor: 'var(--pastel-pink-soft)',
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
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991b1b' }}>
                      RIVAL INTELLIGENCE REPORT:
                    </span>
                    <div style={{ fontSize: '0.86rem', color: '#18181b', fontWeight: 600 }}>
                      {targetCountry.perk}
                    </div>
                  </div>
                  <span className="war-badge" style={{ backgroundColor: '#fff', fontSize: '0.75rem' }}>
                    Shield: {targetCountry.defenseFood}
                  </span>
                </div>
              )}
            </div>

            {/* Field: Conflict Name */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <label
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#18181b',
                  }}
                >
                  Conflict Name
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
                  <Dice5 size={14} /> 🎲 Generate Ridiculous Name
                </button>
              </div>

              <input
                type="text"
                value={conflictName}
                onChange={(e) => setConflictName(e.target.value)}
                placeholder="e.g. The Great Sandwich Dispute"
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

            {/* Field: Reason for Conflict */}
            <div style={{ marginBottom: '24px' }}>
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
                Reason for Conflict
              </label>

              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State your frivolous grievance with theatrical outrage..."
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

              {/* Grievance templates */}
              <div style={{ marginTop: '8px' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: '#64748b',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Or Select An Approved Trivial Incident:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {GRIEVANCE_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      style={{
                        background: '#f1f5f9',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: '#334155',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'var(--pastel-yellow-warm)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    >
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field: Select Conflict Intensity */}
            <div style={{ marginBottom: '32px' }}>
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
                Select Conflict Intensity
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                }}
              >
                {CONFLICT_INTENSITIES.map((intensity) => {
                  const isSelected = selectedIntensity === intensity.name;
                  return (
                    <div
                      key={intensity.id}
                      onClick={() => {
                        playClick();
                        setSelectedIntensity(intensity.name);
                      }}
                      style={{
                        border: 'var(--border-width) solid var(--border-color)',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        backgroundColor: isSelected ? intensity.color : '#fff',
                        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                        transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                        {intensity.emoji}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#18181b',
                          marginBottom: '2px',
                        }}
                      >
                        {intensity.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.3 }}>
                        {intensity.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="war-btn war-btn-blue war-btn-lg"
              style={{ width: '100%', fontSize: '1.3rem', padding: '18px 24px' }}
            >
              <Swords size={24} />
              <span>CONFIRM MY BAD DECISION</span>
            </button>
          </form>
        </div>
      ) : (
        /* Screen 4 Submission Result Decree */
        <div
          className="war-card war-card-tilt-left"
          style={{
            backgroundColor: '#fffdf5',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '10px 10px 0px #18181b',
            border: '3px solid #18181b',
          }}
        >
          <div style={{ fontSize: '4.5rem', marginBottom: '12px' }}>🎉 🥪 ⚔️</div>

          <div
            className="war-badge"
            style={{
              backgroundColor: 'var(--pastel-pink)',
              color: '#991b1b',
              fontSize: '0.95rem',
              padding: '6px 18px',
              marginBottom: '16px',
            }}
          >
            STRICTLY UNOFFICIAL DECLARATION OF HOSTILITIES
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              marginBottom: '12px',
              lineHeight: 1.2,
            }}
          >
            Congratulations!
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: '1.65rem',
              color: '#b91c1c',
              fontWeight: 700,
              maxWidth: '650px',
              margin: '0 auto 24px',
            }}
          >
            "You've successfully made things unnecessarily complicated."
          </p>

          {/* Official comical decree certificate */}
          <div
            style={{
              backgroundColor: '#fff',
              border: '2.5px solid #18181b',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '580px',
              margin: '0 auto 28px',
              textAlign: 'left',
              boxShadow: '4px 4px 0px #18181b',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                transform: 'rotate(12deg)',
              }}
            >
              <span className="war-stamp" style={{ backgroundColor: '#fecdd3', color: '#991b1b' }}>
                APPROVED BY NO ONE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2.2rem' }}>{userCountry.flag}</span>
              <span style={{ fontWeight: 800, color: '#dc2626' }}>VS</span>
              <span style={{ fontSize: '2.2rem' }}>{targetCountry.flag}</span>
              <div>
                <strong style={{ fontSize: '1.2rem', display: 'block' }}>{declaredData?.name}</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Intensity: {declaredData?.intensity}
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                borderLeft: '4px solid #18181b',
                padding: '10px 14px',
                fontSize: '0.88rem',
                color: '#334155',
                marginBottom: '12px',
              }}
            >
              <strong>Official Casus Belli:</strong> "{declaredData?.reason}"
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>Bruised Egos Incurred: +{declaredData?.bruisedEgos}</span>
              <span>Real Casualties: Exactly 0</span>
            </div>
          </div>

          {/* Post-declaration Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              className="war-btn war-btn-blue war-btn-lg"
              onClick={() => {
                playClick();
                onNavigateToDashboard();
              }}
            >
              <span>View In War Dashboard</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="war-btn war-btn-yellow war-btn-lg"
              onClick={() => {
                playClick();
                onNavigateToMap();
              }}
            >
              <span>Track on Conflict Map</span>
            </button>

            <button
              type="button"
              className="war-btn war-btn-sm"
              onClick={() => {
                playClick();
                setIsSubmitted(false);
                setConflictName('The Battle of Cold Gravy');
              }}
              style={{ backgroundColor: '#fff' }}
            >
              <RotateCcw size={15} /> Declare Another Petty War
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

