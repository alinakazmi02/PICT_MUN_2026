import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { itemsService } from '../services/itemsService';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [userReportCount, setUserReportCount] = useState(0);

  const { currentUser, logout, switchProfile, demoProfiles } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const reportBtnRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (reportBtnRef.current && !reportBtnRef.current.contains(event.target)) {
        setReportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update user report count
  useEffect(() => {
    const updateCount = () => {
      const reports = itemsService.getUserReports(currentUser?.email);
      setUserReportCount(reports.length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, [currentUser]);

  const navLinkStyle = ({ isActive }) => ({
    padding: '0.5rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.925rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.15s ease'
  });

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
      }}
    >
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            <NavLink to="/" style={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/browse" style={navLinkStyle}>
              Browse Items
            </NavLink>
            <NavLink to="/report-lost" style={navLinkStyle}>
              Report Lost
            </NavLink>
            <NavLink to="/report-found" style={navLinkStyle}>
              Report Found
            </NavLink>
            <NavLink to="/my-reports" style={navLinkStyle}>
              My Reports
              {userReportCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {userReportCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Prominent "Report an Item" Action */}
          <div style={{ position: 'relative' }} ref={reportBtnRef}>
            <button
              onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.1rem', fontSize: '0.9rem' }}
              aria-label="Report an Item"
            >
              <PlusCircle size={18} />
              <span className="hide-on-mobile">Report an Item</span>
              <ChevronDown size={14} style={{ transform: reportDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {reportDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '260px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--color-border)',
                  padding: '0.5rem',
                  zIndex: 200,
                  animation: 'slideUp 0.15s ease'
                }}
              >
                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  What would you like to report?
                </div>
                <button
                  onClick={() => { setReportDropdownOpen(false); navigate('/report-lost'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-lost-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'var(--color-lost-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-lost)' }}>
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>I Lost Something</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Missing keys, tech, bag, ID...</div>
                  </div>
                </button>

                <button
                  onClick={() => { setReportDropdownOpen(false); navigate('/report-found'); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-found-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'var(--color-found-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-found)' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>I Found Something</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Help return item to owner</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Persona Switcher */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            {currentUser ? (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-border)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                aria-label="User profile menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="hide-on-mobile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--color-text-subtle)" />
              </button>
            ) : (
              <Link to="/signin" className="btn btn-outline btn-sm">
                <User size={16} />
                Sign In
              </Link>
            )}

            {/* Profile Dropdown */}
            {profileDropdownOpen && currentUser && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '280px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--color-border)',
                  padding: '0.75rem',
                  zIndex: 200,
                  animation: 'slideUp 0.15s ease'
                }}
              >
                {/* User Info Header */}
                <div style={{ padding: '0.5rem 0.5rem 0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{currentUser.email}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
                    {currentUser.department} • {currentUser.year}
                  </div>
                </div>

                <Link
                  to="/my-reports"
                  onClick={() => setProfileDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-text-main)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FileText size={16} color="var(--color-primary)" />
                  My Reports &amp; Claims
                </Link>

                {/* Persona Switcher for Project Demo */}
                <div style={{ margin: '0.5rem 0', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                  <div style={{ padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Users size={12} />
                    Switch Demo Persona
                  </div>
                  {demoProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { switchProfile(p.id); setProfileDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: currentUser.id === p.id ? 'var(--color-primary-light)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.825rem',
                        fontWeight: currentUser.id === p.id ? 700 : 500,
                        color: currentUser.id === p.id ? 'var(--color-primary)' : 'var(--color-text-main)'
                      }}
                      onMouseEnter={(e) => {
                        if (currentUser.id !== p.id) e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                      }}
                      onMouseLeave={(e) => {
                        if (currentUser.id !== p.id) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{p.name} ({p.role})</span>
                      {currentUser.id === p.id && <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Active</span>}
                    </button>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                  <button
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: 'none',
                      color: 'var(--color-danger)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} />
                    Sign Out (Demo Mode)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem',
              cursor: 'pointer',
              color: 'var(--color-text-main)'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: '#ffffff',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
          className="mobile-drawer"
        >
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/browse" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Browse Items
          </NavLink>
          <NavLink to="/report-lost" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Report Lost Item
          </NavLink>
          <NavLink to="/report-found" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            Report Found Item
          </NavLink>
          <NavLink to="/my-reports" onClick={() => setMobileMenuOpen(false)} style={navLinkStyle}>
            My Reports ({userReportCount})
          </NavLink>
          {!currentUser ? (
            <Link
              to="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline"
              style={{ marginTop: '0.5rem', justifyContent: 'center' }}
            >
              <User size={16} />
              Sign In / Register
            </Link>
          ) : (
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '0.35rem' }}>
                Signed in as <strong>{currentUser.name}</strong>
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'center', color: 'var(--color-danger)' }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Inline styles for responsive header items */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
        @media (max-width: 859px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
