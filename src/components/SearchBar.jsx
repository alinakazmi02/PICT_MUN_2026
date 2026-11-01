import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Layers, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function SearchBar({ onSearch, initialKeyword = '', initialType = 'all', initialCategory = 'all', compact = false }) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState(initialCategory);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, type, category });
    } else {
      // Navigate to browse page with query parameters
      const params = new URLSearchParams();
      if (keyword) params.set('q', keyword);
      if (type && type !== 'all') params.set('type', type);
      if (category && category !== 'all') params.set('category', category);
      navigate(`/browse?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: compact ? '0.5rem' : '0.75rem',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.6rem',
        width: '100%'
      }}
    >
      {/* Keyword Input */}
      <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.4rem 0.75rem' }}>
        <Search size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search items by name, brand, color (e.g. headphones, wallet)..."
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: compact ? '0.9rem' : '1rem',
            color: 'var(--color-text-main)',
            backgroundColor: 'transparent'
          }}
          aria-label="Search items"
        />
      </div>

      <div style={{ height: '32px', width: '1px', backgroundColor: 'var(--color-border)', display: 'none' }} className="search-divider" />

      {/* Category Dropdown */}
      <div style={{ flex: '0 1 180px', minWidth: '140px' }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-muted)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text-main)',
            cursor: 'pointer'
          }}
          aria-label="Filter by Category"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Type Dropdown (All / Lost / Found) */}
      <div style={{ flex: '0 1 140px', minWidth: '120px' }}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-muted)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text-main)',
            cursor: 'pointer'
          }}
          aria-label="Filter by Status"
        >
          <option value="all">All Status</option>
          <option value="lost">Lost Only</option>
          <option value="found">Found Only</option>
        </select>
      </div>

      {/* Submit Search Button */}
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          padding: compact ? '0.65rem 1.25rem' : '0.8rem 1.6rem',
          fontSize: '0.95rem',
          borderRadius: 'var(--radius-lg)',
          flexShrink: 0
        }}
      >
        <Search size={18} />
        Search
      </button>

      <style>{`
        @media (min-width: 640px) {
          .search-divider {
            display: block !important;
          }
        }
      `}</style>
    </form>
  );
}
