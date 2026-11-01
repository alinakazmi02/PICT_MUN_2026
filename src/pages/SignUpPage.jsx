import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, BookOpen, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    year: 'Junior (3rd Year)',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'College email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid college email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to campus platform guidelines';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    register(formData);
    showToast(`Welcome to Lost and Found, ${formData.name}!`, 'success');
    navigate('/my-reports');
  };

  return (
    <div style={{ padding: '3.5rem 1rem 5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div
          className="card"
          style={{
            padding: '2.5rem',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-xl)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
              <Logo size="md" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0.25rem 0' }}>
              Create Student Account
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              Join your college lost and found community network
            </p>
          </div>

          {/* Demo disclaimer */}
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
            <strong>Simulated Registration:</strong> Real backend authentication will be attached in future releases. Stored safely in local browser session.
          </div>

          <form onSubmit={handleRegister} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  color="var(--color-text-subtle)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Lee"
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
              {errors.name && <div className="form-error"><AlertCircle size={13} /> {errors.name}</div>}
            </div>

            {/* Email */}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@campus.edu"
                  className={`input-field ${errors.email ? 'input-error' : ''}`}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
              {errors.email && <div className="form-error"><AlertCircle size={13} /> {errors.email}</div>}
            </div>

            {/* Department & Year */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Academic Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="select-field"
                >
                  <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                  <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                  <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                  <option value="Senior (4th Year)">Senior (4th Year)</option>
                  <option value="Graduate Student">Graduate Student</option>
                  <option value="Faculty / Staff">Faculty / Staff</option>
                </select>
              </div>
            </div>

            {/* Password */}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--color-text-subtle)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
              {errors.confirmPassword && <div className="form-error"><AlertCircle size={13} /> {errors.confirmPassword}</div>}
            </div>

            {/* Agreement */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  style={{ marginTop: '2px' }}
                />
                <span>
                  I agree to follow the campus lost &amp; found safety guidelines and verify items before claim.
                </span>
              </label>
              {errors.agreeTerms && <div className="form-error"><AlertCircle size={13} /> {errors.agreeTerms}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1.5rem' }}
            >
              <UserPlus size={18} />
              Complete Registration
            </button>
          </form>

          {/* Sign In Link */}
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
