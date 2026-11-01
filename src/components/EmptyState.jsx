import React from 'react';
import { SearchX, PackageOpen, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search terms, removing filters, or checking back later.',
  icon: Icon = SearchX,
  actionLabel,
  onAction,
  actionLink
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px dashed var(--color-border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2rem 0'
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-muted)',
          color: 'var(--color-text-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        <Icon size={28} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
        {title}
      </h3>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', lineHeight: 1.5, marginBottom: '1.5rem' }}>
        {description}
      </p>

      {actionLabel && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary">
            <PlusCircle size={16} />
            {actionLabel}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="btn btn-outline-primary">
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
