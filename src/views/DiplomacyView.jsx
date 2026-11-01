import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HeartHandshake,
  Sparkles,
  Coffee,
  CheckCircle,
  FileCheck,
  Send,
  RotateCcw,
  Shield,
  Smile,
  ArrowRight,
} from 'lucide-react';
import CountrySelect from '../components/CountrySelect';
import { COUNTRIES } from '../data/countries';
import {
  RIDICULOUS_TREATIES,
  RIDICULOUS_APOLOGIES,
  RIDICULOUS_CONCESSIONS,
} from '../data/treaties';
import { playClick, playPeaceChime, playBoing } from '../utils/sound';

export default function DiplomacyView({
  userCountry,
  onTreatySigned,
  onNavigateToDashboard,
  onGoHome,
}) {
  const [partnerCountryId, setPartnerCountryId] = useState('fr');
  const [selectedTreatyId, setSelectedTreatyId] = useState('treaty-1');
  const [selectedApologyId, setSelectedApologyId] = useState('apol-1');
  const [selectedConcession, setSelectedConcession] = useState(RIDICULOUS_CONCESSIONS[0]);
  const [ceasefireDuration, setCeasefireDuration] = useState('Until someone gets hungry (~2 hours)');
  const [isPeaceMade, setIsPeaceMade] = useState(false);
  const [signedDocument, setSignedDocument] = useState(null);

  const partnerCountry =
    COUNTRIES.find((c) => c.id === partnerCountryId) || COUNTRIES[1];
  const activeTreaty =
    RIDICULOUS_TREATIES.find((t) => t.id === selectedTreatyId) || RIDICULOUS_TREATIES[0];
  const activeApology =
    RIDICULOUS_APOLOGIES.find((a) => a.id === selectedApologyId) || RIDICULOUS_APOLOGIES[0];

  const handleMakePeace = (e) => {
    e.preventDefault();
    playPeaceChime();

    // Trigger peaceful soft confetti
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#cbf3d2', '#b5e2fa', '#e8dff5', '#fef08a', '#ffffff'],
      });
    } catch (err) {
      // ignore
    }

    const doc = {
      id: `treaty-${Date.now()}`,
      name: activeTreaty.name,
      partyA: userCountry,
      partyB: partnerCountry,
      apology: activeApology.text,
      concession: selectedConcession,
      duration: ceasefireDuration,
      signedDate: new Date().toLocaleDateString(),
    };

    setSignedDocument(doc);
    setIsPeaceMade(true);
    onTreatySigned(doc);
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      {/* Top Tag & Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            className="war-badge"
            style={{
              backgroundColor: 'var(--pastel-mint)',
              color: '#065f46',
              transform: 'rotate(-1deg)',
            }}
          >
            🕊️ Screen 6 • The Anti-Climax Lounge
          </span>
          <span className="war-stamp">Zero Ego Retained</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            margin: '4px 0 8px',
            lineHeight: 1.15,
          }}
        >
          Diplomacy & Regrettable Peace
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.45rem',
            color: '#475569',
            maxWidth: '620px',
            margin: '0 auto',
          }}
        >
          "Where international disputes go to die under a pile of lukewarm pastries."
        </p>
      </div>

      {!isPeaceMade ? (
        <form onSubmit={handleMakePeace}>
          {/* Section 1: Choose Rival Country for Peace */}
          <div
            className="war-card war-card-tilt-left"
            style={{
              backgroundColor: '#ffffff',
              padding: '28px',
              marginBottom: '20px',
              boxShadow: '6px 6px 0px #18181b',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>
              1. Who Are You Disappointingly Forgiving?
            </h3>
            <CountrySelect
              value={partnerCountryId}
              onChange={(id) => {
                playClick();
                setPartnerCountryId(id);
              }}
              label="Select Former Adversary (From all 195 Nations)"
              excludeCountryId={userCountry.id}
            />
          </div>

          {/* Section 2: Choose Preset Ridiculous Treaty */}
          <div
            className="war-card"
            style={{
              backgroundColor: '#fffdf9',
              padding: '28px',
              marginBottom: '20px',
              boxShadow: '6px 6px 0px #18181b',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>
              2. Negotiate Ridiculous Treaties
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              {RIDICULOUS_TREATIES.map((treaty) => {
                const isSelected = selectedTreatyId === treaty.id;
                return (
                  <div
                    key={treaty.id}
                    onClick={() => {
                      playClick();
                      setSelectedTreatyId(treaty.id);
                    }}
                    style={{
                      border: 'var(--border-width) solid var(--border-color)',
                      borderRadius: '14px',
                      padding: '14px',
                      backgroundColor: isSelected ? 'var(--pastel-yellow-warm)' : '#ffffff',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <span className="war-badge" style={{ backgroundColor: '#fff', fontSize: '0.72rem', marginBottom: '6px' }}>
                      {treaty.badge}
                    </span>
                    <strong style={{ display: 'block', fontSize: '0.98rem', marginBottom: '4px' }}>
                      {treaty.name}
                    </strong>
                    <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.35, margin: 0 }}>
                      {treaty.summary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Terms of selected treaty */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '12px 16px',
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#047857', display: 'block', marginBottom: '4px' }}>
                FORMAL CLAUSES OF {activeTreaty.name.toUpperCase()}:
              </span>
              <ul style={{ paddingLeft: '18px', fontSize: '0.82rem', color: '#334155' }}>
                {activeTreaty.terms.map((term, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{term}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Ridiculous Apology Generator */}
          <div
            className="war-card war-card-tilt-right"
            style={{
              backgroundColor: '#ffffff',
              padding: '28px',
              marginBottom: '20px',
              boxShadow: '6px 6px 0px #18181b',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>
              3. Apologize to Another Country (With Insincerity)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {RIDICULOUS_APOLOGIES.map((apol) => {
                const isSelected = selectedApologyId === apol.id;
                return (
                  <div
                    key={apol.id}
                    onClick={() => {
                      playClick();
                      setSelectedApologyId(apol.id);
                    }}
                    style={{
                      border: '2px solid #18181b',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      backgroundColor: isSelected ? 'var(--pastel-pink-soft)' : '#fff',
                      boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#18181b' }}>
                        {apol.label}:
                      </span>
                      <p style={{ fontSize: '0.84rem', color: '#334155', margin: '2px 0 0' }}>
                        "{apol.text}"
                      </p>
                    </div>
                    {isSelected && <CheckCircle size={18} color="#dc2626" />}
                  </div>
                );
              })}
            </div>

            {/* Concession selector */}
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Ceremonial Humiliation Concession:
              </label>
              <select
                value={selectedConcession}
                onChange={(e) => setSelectedConcession(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '2px solid #18181b',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  backgroundColor: '#fafafa',
                  outline: 'none',
                }}
              >
                {RIDICULOUS_CONCESSIONS.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Ceasefire Duration */}
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Ceasefire Duration:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  'Until someone gets hungry (~2 hours)',
                  'Until next Monday morning',
                  'Until someone remembers why we started this',
                  'Permanent-ish (subject to pastry supply)',
                ].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      playClick();
                      setCeasefireDuration(dur);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #18181b',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      backgroundColor: ceasefireDuration === dur ? 'var(--pastel-blue)' : '#fff',
                    }}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Big Action Button */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              type="submit"
              className="war-btn war-btn-mint war-btn-lg"
              style={{
                fontSize: '1.35rem',
                padding: '18px 36px',
                minWidth: '320px',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <HeartHandshake size={26} />
              <span>MAKE PEACE (UNFORTUNATELY)</span>
            </button>
          </div>
        </form>
      ) : (
        /* Screen 6 Peace Celebration Display */
        <div
          className="war-card"
          style={{
            backgroundColor: '#ffffff',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '10px 10px 0px #18181b',
            border: '3px solid #18181b',
          }}
        >
          <div style={{ fontSize: '4.5rem', marginBottom: '8px' }}>🕊️ 🏳️ 🥐</div>

          <span
            className="war-badge"
            style={{
              backgroundColor: 'var(--pastel-mint)',
              fontSize: '0.95rem',
              padding: '6px 18px',
              marginBottom: '14px',
            }}
          >
            DISAPPOINTING HARMONY ACHIEVED
          </span>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              marginBottom: '10px',
              lineHeight: 1.2,
            }}
          >
            Congratulations!
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: '1.75rem',
              color: '#059669',
              fontWeight: 700,
              maxWidth: '600px',
              margin: '0 auto 24px',
            }}
          >
            "You've discovered communication."
          </p>

          {/* Signed Peace Certificate */}
          <div
            style={{
              backgroundColor: '#fffdf5',
              border: '2.5px solid #18181b',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '600px',
              margin: '0 auto 28px',
              textAlign: 'left',
              boxShadow: '4px 4px 0px #18181b',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: '14px', right: '14px', transform: 'rotate(-4deg)' }}>
              <span className="war-stamp" style={{ backgroundColor: '#cbf3d2', color: '#065f46' }}>
                ACCORD RATIFIED
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '2.2rem' }}>{signedDocument.partyA.flag}</span>
              <span style={{ fontWeight: 800, color: '#059669' }}>🤝</span>
              <span style={{ fontSize: '2.2rem' }}>{signedDocument.partyB.flag}</span>
              <div>
                <strong style={{ fontSize: '1.2rem', display: 'block' }}>{signedDocument.name}</strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Effective: {signedDocument.duration}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '10px' }}>
              <strong>Official Apology Stated:</strong> "{signedDocument.apology}"
            </div>

            <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '10px' }}>
              <strong>Bilateral Concession:</strong> "{signedDocument.concession}"
            </div>

            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px', fontSize: '0.75rem', color: '#64748b' }}>
              Signed by {userCountry.name} and {partnerCountry.name}. Both sides agree to be mildly civil until lunch.
            </div>
          </div>

          {/* Action buttons */}
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
              <span>Return to War Dashboard</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="war-btn war-btn-yellow war-btn-lg"
              onClick={() => {
                playClick();
                onGoHome();
              }}
            >
              <Coffee size={20} />
              <span>Retire to Safe Zone</span>
            </button>

            <button
              type="button"
              className="war-btn war-btn-sm"
              onClick={() => {
                playClick();
                setIsPeaceMade(false);
              }}
              style={{ backgroundColor: '#fff' }}
            >
              <RotateCcw size={15} /> Negotiate Another Truce
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

