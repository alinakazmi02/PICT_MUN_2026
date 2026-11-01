import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Ticker from './components/Ticker';
import DispatchToast from './components/DispatchToast';
import LeaderboardModal from './components/LeaderboardModal';

import WelcomeView from './views/WelcomeView';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import DeclareWarView from './views/DeclareWarView';
import ConflictMapView from './views/ConflictMapView';
import DiplomacyView from './views/DiplomacyView';
import ExitView from './views/ExitView';

import { COUNTRIES } from './data/countries';
import { DISPATCH_ALERTS } from './data/headlines';
import {
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
  getStoredConflicts,
  saveConflicts,
  addConflict,
  getChaosLevel,
  saveChaosLevel,
  addStoredTreaty,
  DEFAULT_USER,
} from './utils/storage';
import { playClick, playTrumpet, playPeaceChime, setMuted, getMuted } from './utils/sound';

export default function App() {
  // Navigation screen: 'welcome' | 'login' | 'dashboard' | 'declare' | 'map' | 'diplomacy' | 'exit'
  const [activeScreen, setActiveScreen] = useState('welcome');
  const [userProfile, setUserProfile] = useState(() => getUserProfile() || DEFAULT_USER);
  const [conflicts, setConflicts] = useState(() => getStoredConflicts());
  const [chaosLevel, setChaosLevel] = useState(() => getChaosLevel());
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(() => getMuted());
  const [activeAlert, setActiveAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Consulting the imaginary generals...');

  // Derive current user country object (defaults to Italy if not found)
  const userCountry =
    COUNTRIES.find((c) => c.id === userProfile?.countryId) ||
    COUNTRIES.find((c) => c.id === 'it') ||
    COUNTRIES[0];

  // Periodic random satirical world dispatches (every 40 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const randomDispatch =
        DISPATCH_ALERTS[Math.floor(Math.random() * DISPATCH_ALERTS.length)];
      setActiveAlert(randomDispatch);
    }, 38000);

    return () => clearInterval(timer);
  }, []);

  // Brief loading screen helper for extra polish and humor
  const triggerLoading = (message, nextScreen, duration = 400) => {
    setLoadingText(message);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveScreen(nextScreen);
      window.scrollTo(0, 0);
    }, duration);
  };

  // Handlers
  const handleLoginSuccess = (newProfile) => {
    setUserProfile(newProfile);
    if (newProfile.rememberMe) {
      saveUserProfile(newProfile);
    }
    triggerLoading('Consulting the imaginary generals...', 'dashboard', 600);
  };

  const handleQuickStart = (countryId) => {
    const country = COUNTRIES.find((c) => c.id === countryId) || COUNTRIES[0];
    const profile = {
      countryId: country.id,
      repName: country.defaultRep,
      reason: `Historical territorial dispute over ${country.defenseFood}.`,
      mood: 'dramatic',
      rememberMe: true,
      registeredAt: new Date().toISOString(),
      diplomaticStatus: country.status || 'Mildly Offended',
      egoPoints: 1250,
      declaredWarsCount: 1,
      peaceTreatiesCount: 0,
    };
    setUserProfile(profile);
    saveUserProfile(profile);
    triggerLoading(`Deploying honorary envoy for ${country.name}...`, 'dashboard', 500);
  };

  const handleUpdateStatus = (newStatus) => {
    const updated = { ...userProfile, diplomaticStatus: newStatus };
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  const handleWarDeclared = (newConflict) => {
    const updatedConflicts = addConflict(newConflict);
    setConflicts(updatedConflicts);
    // Bump chaos meter slightly
    const nextChaos = saveChaosLevel(chaosLevel + 4);
    setChaosLevel(nextChaos);
    // Add ego points
    const updatedUser = {
      ...userProfile,
      egoPoints: (userProfile.egoPoints || 1250) + 180,
      declaredWarsCount: (userProfile.declaredWarsCount || 1) + 1,
    };
    setUserProfile(updatedUser);
    saveUserProfile(updatedUser);
  };

  const handleTreatySigned = (doc) => {
    addStoredTreaty(doc);
    // Calm chaos slightly
    const nextChaos = saveChaosLevel(chaosLevel - 6);
    setChaosLevel(nextChaos);
    // Update user status
    handleUpdateStatus('Ceasefire-ish');
  };

  const handleSupportConflict = (confId, side) => {
    const updated = conflicts.map((c) => {
      if (c.id === confId) {
        return {
          ...c,
          supportA: side === 'A' ? (c.supportA || 100) + 1 : c.supportA,
          supportB: side === 'B' ? (c.supportB || 100) + 1 : c.supportB,
          bruisedEgos: (c.bruisedEgos || 1000) + 15,
        };
      }
      return c;
    });
    setConflicts(updated);
    saveConflicts(updated);
  };

  const handleBumpChaos = () => {
    const next = saveChaosLevel(chaosLevel + 5);
    setChaosLevel(next);
    // Show urgent dispatch
    const alert = DISPATCH_ALERTS[Math.floor(Math.random() * DISPATCH_ALERTS.length)];
    setActiveAlert(alert);
  };

  const handleCalmChaos = () => {
    const next = saveChaosLevel(chaosLevel - 4);
    setChaosLevel(next);
  };

  const handleLogout = () => {
    triggerLoading('Packing diplomatic suitcases...', 'exit', 400);
  };

  const handleResetData = () => {
    clearUserProfile();
    setUserProfile(DEFAULT_USER);
    setChaosLevel(74);
    saveChaosLevel(74);
    triggerLoading('Restoring international equilibrium...', 'welcome', 500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Satirical Scrolling News Ticker */}
      <Ticker />

      {/* Main Header with Brand and Navigation Tabs */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={(screen) => triggerLoading('Adjusting diplomatic protocols...', screen, 250)}
        userProfile={userProfile}
        userCountry={userCountry}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(255, 253, 249, 0.92)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '4px solid #fde047',
              borderTopColor: '#18181b',
              animation: 'spin 0.7s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: '1.5rem',
              color: '#18181b',
              fontWeight: 700,
            }}
          >
            "{loadingText}"
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <main className="war-app-main" style={{ flex: 1 }}>
        {activeScreen === 'welcome' && (
          <WelcomeView
            onEnterChaos={() => triggerLoading('Accessing War Gate...', userProfile ? 'dashboard' : 'login', 300)}
            onGoHome={() => triggerLoading('Escaping to safe zone...', 'exit', 300)}
            onQuickStart={handleQuickStart}
            userProfile={userProfile}
            chaosLevel={chaosLevel}
          />
        )}

        {activeScreen === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            initialProfile={userProfile}
          />
        )}

        {activeScreen === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            userCountry={userCountry}
            onUpdateStatus={handleUpdateStatus}
            onNavigateToDeclare={() => triggerLoading('Opening Declaration Room...', 'declare', 250)}
            onNavigateToMap={() => triggerLoading('Calibrating satellite dishes...', 'map', 250)}
            onNavigateToDiplomacy={() => triggerLoading('Entering Regrettable Peace Zone...', 'diplomacy', 250)}
            onLogout={handleLogout}
            conflicts={conflicts}
            onSupportConflict={handleSupportConflict}
            chaosLevel={chaosLevel}
            onBumpChaos={handleBumpChaos}
            onCalmChaos={handleCalmChaos}
          />
        )}

        {activeScreen === 'declare' && (
          <DeclareWarView
            userProfile={userProfile}
            userCountry={userCountry}
            onWarDeclared={handleWarDeclared}
            onNavigateToDashboard={() => setActiveScreen('dashboard')}
            onNavigateToMap={() => setActiveScreen('map')}
          />
        )}

        {activeScreen === 'map' && (
          <ConflictMapView
            userCountry={userCountry}
            conflicts={conflicts}
            onTargetCountry={(targetId) => {
              triggerLoading('Drafting formal grievances...', 'declare', 250);
            }}
            onNavigateToDiplomacy={() => setActiveScreen('diplomacy')}
          />
        )}

        {activeScreen === 'diplomacy' && (
          <DiplomacyView
            userCountry={userCountry}
            onTreatySigned={handleTreatySigned}
            onNavigateToDashboard={() => setActiveScreen('dashboard')}
            onGoHome={() => setActiveScreen('exit')}
          />
        )}

        {activeScreen === 'exit' && (
          <ExitView
            onReturnToPortal={() => triggerLoading('Re-entering the chaos...', 'dashboard', 300)}
          />
        )}
      </main>

      {/* Floating Random Diplomatic Dispatch Toast */}
      <DispatchToast
        activeAlert={activeAlert}
        onClose={() => setActiveAlert(null)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        userProfile={userProfile}
      />

      {/* Global Footer */}
      <Footer
        onResetData={handleResetData}
        onGoHome={() => setActiveScreen('exit')}
      />
    </div>
  );
}
