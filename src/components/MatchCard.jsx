import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MatchCard({ match }) {
  const { item, score, confidence, reasons } = match;

  const scoreColor =
    score >= 70 ? 'var(--color-found)' : score >= 45 ? 'var(--color-primary)' : 'var(--color-accent)';
  const scoreBg =
    score >= 70 ? 'var(--color-found-bg)' : score >= 45 ? 'var(--color-primary-light)' : 'var(--color-accent-light)';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--color-border)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
    >
      {/* Top Header: Score Badge + Item Type */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <StatusBadge type={item.type} />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: scoreBg,
            color: scoreColor,
            fontWeight: 800,
            fontSize: '0.825rem'
          }}
          title="Calculated via transparent client-side matching algorithm"
        >
          <Sparkles size={13} />
          {score}% Match
        </div>
      </div>

      {/* Item summary */}
      <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '0.85rem' }}>
        <div style={{ width: 68, height: 68, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f1f5f9' }}>
          <img
            src={item.images && item.images[0] ? item.images[0] : ''}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='68' height='68' viewBox='0 0 68 68' fill='%23E2E8F0'%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='9' fill='%2364748B'%3EPhoto%3C/text%3E%3C/svg%3E`;
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: '0.975rem', fontWeight: 700, margin: '0 0 0.25rem 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Link to={`/item/${item.id}`} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>
              {item.title}
            </Link>
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', color: 'var(--color-text-subtle)' }}>
            <MapPin size={13} color="var(--color-primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
            <Calendar size={12} />
            <span>{item.date}</span>
          </div>
        </div>
      </div>

      {/* Match Explainability Reasons Box */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-page)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          Why this is suggested:
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {reasons.slice(0, 3).map((r, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.785rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={12} color="var(--color-found)" />
                {r.text}
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-subtle)' }}>{r.weight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action link */}
      <Link
        to={`/item/${item.id}`}
        className="btn btn-outline-primary btn-sm"
        style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
      >
        View Matched Item
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
