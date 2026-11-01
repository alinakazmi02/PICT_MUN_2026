import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, DEMO_PROFILES } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const login = (email, password) => {
    const user = authService.login(email, password);
    setCurrentUser(user);
    return user;
  };

  const register = (data) => {
    const user = authService.register(data);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const switchProfile = (profileId) => {
    const profile = authService.switchProfile(profileId);
    setCurrentUser(profile);
    return profile;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, switchProfile, demoProfiles: DEMO_PROFILES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
