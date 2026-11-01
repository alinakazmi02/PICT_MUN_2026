import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item, layout = 'grid' }) {
  const [imageError, setImageError] = useState(false);
  const isLost = item.type === 'lost';

  // Fallback image generator based on category
  const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260' fill='none'%3E%3Crect width='400' height='260' fill='%23F1F5F9'/%3E%3Ccircle cx='200' cy='120' r='40' fill='%23E2E8F0'/%3E%3Cpath d='M185 120h30M200 105v30' stroke='%2394A3B8' stroke-width='3' stroke-linecap='round'/%3E%3Ctext x='200' y='180' font-family='sans-serif' font-size='14' font-weight='600' fill='%2364748B' text-anchor='middle'%3E${encodeURIComponent(item.category || 'Belonging')}%3C/text%3E%3C/svg%3E`;

  const primaryImage = (!imageError && item.images && item.images[0])
    ? item.images[0]
    : fallbackSvg;

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  if (layout === 'list') {
    return (
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          marginBottom: '1rem',
          transition: 'all 0.2s ease',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ width: '220px', minWidth: '180px', position: 'relative', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
          <img
            src={primaryImage}
            alt={item.title}
            onError={() => setImageError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
            <StatusBadge type={item.type} />
          </div>
        </div>

        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-category">
                <Tag size={12} style={{ marginRight: '3px' }} />
                {item.category}
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {item.status === 'Possible Match' && <StatusBadge status="Possible Match" />}
                {item.handoverStatus && !isLost && <StatusBadge handoverStatus={item.handoverStatus} />}
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              <Link to={`/item/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {item.title}
              </Link>
            </h3>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="var(--color-primary)" />
                {item.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                {formattedDate}
              </span>
            </div>

            <Link to={`/item/${item.id}`} className="btn btn-outline-primary btn-sm">
              View Details
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Image & Badges */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '62%', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
        <img
          src={primaryImage}
          alt={item.title}
          onError={() => setImageError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 2 }}>
          <StatusBadge type={item.type} />
        </div>

        {item.status === 'Possible Match' && (
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
            <span className="badge badge-match">
              <Sparkles size={11} />
              Possible Match
            </span>
          </div>
        )}

        {item.status === 'Returned' && (
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
            <span className="badge badge-returned">
              <ShieldCheck size={11} />
              Reunited
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className="badge badge-category">
            <Tag size={12} style={{ marginRight: '3px' }} />
            {item.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={12} />
            {formattedDate}
          </span>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
          <Link to={`/item/${item.id}`} style={{ color: 'var(--color-text-main)', textDecoration: 'none' }}>
            {item.title}
          </Link>
        </h3>

        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            marginBottom: '1rem',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {item.description}
        </p>

        {/* Footer Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '0.85rem',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-text-subtle)', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <MapPin size={14} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span title={item.location} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.location}
            </span>
          </div>

          <Link to={`/item/${item.id}`} className="btn btn-outline-primary btn-sm">
            View Details
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
