const AUTH_STORAGE_KEY = 'lost_and_found_user_v2';

export const DEMO_PROFILES = [
  {
    id: 'usr_1',
    name: 'Alina Kazmi',
    email: 'a.kazmi@campus.edu',
    department: 'Information Technology',
    role: 'Student',
    year: 'Junior (1st Year)',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr_2',
    name: 'Priya Sharma',
    email: 'p.sharma@campus.edu',
    department: 'Electrical Engineering',
    role: 'Student',
    year: 'Sophomore (2nd Year)',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr_3',
    name: 'Marcus Chen',
    email: 'm.chen@campus.edu',
    department: 'Business & Management',
    role: 'Student',
    year: 'Senior (4th Year)',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading auth state', e);
    }
    // Default logged in demo student
    const defaultUser = DEMO_PROFILES[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  },

  setCurrentUser(user) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error setting auth state', e);
    }
  },

  login(email, _password) {
    // Find matching demo profile or generate simulated session
    const matched = DEMO_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase());
    const user = matched || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      department: 'Campus Member',
      role: 'Student',
      year: 'Active Student',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    this.setCurrentUser(user);
    return user;
  },

  register({ name, email, department, role, year, phone }) {
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      department: department || 'General Studies',
      role: role || 'Student',
      year: year || 'Undergraduate',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    this.setCurrentUser(newUser);
    return newUser;
  },

  logout() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Error logging out', e);
    }
  },

  switchProfile(profileId) {
    const profile = DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0];
    this.setCurrentUser(profile);
    return profile;
  }
};
