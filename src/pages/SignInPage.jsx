import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, switchProfile, demoProfiles } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('a.kazmi@campus.edu');
  const [password, setPassword] = useState('campusDemo2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Campus email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid college email';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!validate()) return;

    login(email, password);
    showToast(`Signed in successfully as ${email}!`, 'success');
    navigate('/my-reports');
  };

  const handleQuickLogin = (profile) => {
    switchProfile(profile.id);
    showToast(`Logged in as demo persona: ${profile.name}`, 'success');
    navigate('/my-reports');
  };

  return (
    <div style={{ padding: '3.5rem 1rem 5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Card */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          {/* Brand header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
              <Logo size="md" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0.25rem 0' }}>
              Campus Sign In
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Sign in with your student or campus email
            </p>
          </div>

          {/* Demo Mode Notice */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-page)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.785rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.45
            }}
          >
            <strong>Simulated Demo Mode:</strong> Passwords are not saved or sent over the internet. You can sign in with any valid college email or select a demo persona below.
          </div>

          <form onSubmit={handleSignIn} noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                Campus Email Address <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--color-text-subtle)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
              {errors.email && <div className="form-error"><AlertCircle size={13} /> {errors.email}</div>}
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="form-group">
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--color-text-subtle)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`input-field ${errors.password ? 'input-error' : ''}`}
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-subtle)',
                    display: 'flex'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <div className="form-error"><AlertCircle size={13} /> {errors.password}</div>}
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1.5rem' }}
            >
              <LogIn size={18} />
              Sign In to Lost and Found
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={14} /> One-Click Demo Personas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {demoProfiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickLogin(p)}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.75rem' }}
                >
                  <img src={p.avatar} alt={p.name} style={{ width: 22, height: 22, borderRadius: '50%' }} />
                  <span>Login as <strong>{p.name}</strong> ({p.department.split('&')[0]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Register Link */}
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Public Browsing Note */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>
          Public browsing is open to everyone.{' '}
          <Link to="/browse" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Browse items without signing in →
          </Link>
        </div>
      </div>
    </div>
  );
}
