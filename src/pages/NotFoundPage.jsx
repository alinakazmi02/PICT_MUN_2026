import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ padding: '6rem 1rem', textAlign: 'center' }}>
      <div className="app-container" style={{ maxWidth: '520px' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <HelpCircle size={36} />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
          Page Lost in Campus!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Looks like this page took a wrong turn at the lecture hall. Let's get you back to the main lost and found hub.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home size={18} />
            Back to Home
          </Link>
          <Link to="/browse" className="btn btn-outline btn-lg">
            <Search size={18} />
            Browse Items
          </Link>
        </div>
      </div>
    </div>
  );
}
