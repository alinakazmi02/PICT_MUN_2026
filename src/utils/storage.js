// LocalStorage state management for WAR™

import { INITIAL_CONFLICTS } from '../data/conflicts.js';
import { COUNTRIES } from '../data/countries.js';

const STORAGE_KEYS = {
  USER_PROFILE: 'war_portal_user_profile',
  CONFLICTS: 'war_portal_conflicts',
  TREATIES: 'war_portal_treaties',
  CHAOS_LEVEL: 'war_portal_chaos_level',
  MUTED: 'war_portal_muted',
  DISPATCHES_SEEN: 'war_portal_dispatches_seen',
};

export const DEFAULT_USER = {
  countryId: 'it',
  repName: 'Grand Duke Mario Parmigiano',
  reason: 'France alleged that baguettes are superior to focaccia. This cannot stand.',
  mood: 'dramatic',
  rememberMe: true,
  registeredAt: new Date().toISOString(),
  diplomaticStatus: 'Mildly Offended',
  egoPoints: 1240,
  declaredWarsCount: 1,
  peaceTreatiesCount: 0,
};

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const saveUserProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
};

export const clearUserProfile = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (e) {
    console.error('Failed to clear profile', e);
  }
};

export const getStoredConflicts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFLICTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONFLICTS, JSON.stringify(INITIAL_CONFLICTS));
      return INITIAL_CONFLICTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CONFLICTS;
  }
};

export const saveConflicts = (conflicts) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFLICTS, JSON.stringify(conflicts));
  } catch (e) {
    console.error('Failed to save conflicts', e);
  }
};

export const addConflict = (newConflict) => {
  const current = getStoredConflicts();
  const updated = [newConflict, ...current];
  saveConflicts(updated);
  return updated;
};

export const getChaosLevel = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAOS_LEVEL);
    if (raw === null) return 74;
    return parseInt(raw, 10);
  } catch (e) {
    return 74;
  }
};

export const saveChaosLevel = (level) => {
  try {
    const clamped = Math.min(100, Math.max(12, level));
    localStorage.setItem(STORAGE_KEYS.CHAOS_LEVEL, clamped.toString());
    return clamped;
  } catch (e) {
    return level;
  }
};

export const getStoredTreaties = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TREATIES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const addStoredTreaty = (treaty) => {
  try {
    const current = getStoredTreaties();
    const updated = [treaty, ...current];
    localStorage.setItem(STORAGE_KEYS.TREATIES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getCountryById = (id) => {
  return COUNTRIES.find((c) => c.id === id) || COUNTRIES[0];
};
