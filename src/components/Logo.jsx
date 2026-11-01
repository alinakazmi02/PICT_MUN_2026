import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showTagline = false }) {
  const iconSize = size === 'lg' ? 42 : size === 'sm' ? 28 : 34;
  const textSize = size === 'lg' ? '1.5rem' : size === 'sm' ? '1.1rem' : '1.3rem';

  return (
    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Modern Pin & Recovery Searchmark SVG */}
        <svg
          width={iconSize * 0.65}
          height={iconSize * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer search & recovery ring */}
          <circle cx="11" cy="11" r="7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          {/* Magnifying handle */}
          <path d="M16.5 16.5L21 21" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Inner Location Pin Center */}
          <circle cx="11" cy="11" r="2.5" fill="#F59E0B" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: textSize,
            color: 'var(--color-text-main)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}
        >
          Lost and Found
        </span>
        {showTagline ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            Campus Lost &amp; Found Platform
          </span>
        ) : (
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', fontWeight: 500 }}>
            Campus Platform
          </span>
        )}
      </div>
    </Link>
  );
}
