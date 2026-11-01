import React from 'react';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  Calendar,
  MapPin,
  Tag,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CAMPUS_LOCATIONS } from '../data/categories';

export default function FilterControls({
  filters,
  onFilterChange,
  onResetFilters,
  layout,
  onLayoutChange,
  totalResults,
  totalAll
}) {
  const isFiltered =
    Boolean(filters.keyword) ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.sortBy !== 'newest';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem'
      }}
    >
      {/* Top Row: Keyword Search + Type Tabs + Layout Toggle */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        {/* Search input with quick clear icon */}
        <div
          style={{
            flex: '1 1 300px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search
            size={18}
            color="var(--color-text-subtle)"
            style={{ position: 'absolute', left: '0.85rem' }}
          />
          <input
            type="text"
            placeholder="Search keywords, items, colors..."
            value={filters.keyword}
            onChange={(e) => onFilterChange('keyword', e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.4rem', paddingRight: filters.keyword ? '2.4rem' : '1rem' }}
          />
          {filters.keyword && (
            <button
              onClick={() => onFilterChange('keyword', '')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-subtle)',
                display: 'flex'
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Type Toggle Pills (All, Lost, Found) */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-bg-muted)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}
        >
          <button
            onClick={() => onFilterChange('type', 'all')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: filters.type === 'all' ? '#ffffff' : 'transparent',
              color: filters.type === 'all' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: filters.type === 'all' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            All Items
          </button>
          <button
            onClick={() => onFilterChange('type', 'lost')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: filters.type === 'lost' ? 'var(--color-lost-bg)' : 'transparent',
              color: filters.type === 'lost' ? 'var(--color-lost)' : 'var(--color-text-muted)',
              boxShadow: filters.type === 'lost' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Lost Only
          </button>
          <button
            onClick={() => onFilterChange('type', 'found')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: filters.type === 'found' ? 'var(--color-found-bg)' : 'transparent',
              color: filters.type === 'found' ? 'var(--color-found)' : 'var(--color-text-muted)',
              boxShadow: filters.type === 'found' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Found Only
          </button>
        </div>

        {/* View Layout Toggle (Grid vs List) */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--color-bg-muted)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}
        >
          <button
            onClick={() => onLayoutChange('grid')}
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: layout === 'grid' ? '#ffffff' : 'transparent',
              color: layout === 'grid' ? 'var(--color-primary)' : 'var(--color-text-subtle)',
              boxShadow: layout === 'grid' ? 'var(--shadow-sm)' : 'none',
              display: 'flex'
            }}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => onLayoutChange('list')}
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: layout === 'list' ? '#ffffff' : 'transparent',
              color: layout === 'list' ? 'var(--color-primary)' : 'var(--color-text-subtle)',
              boxShadow: layout === 'list' ? 'var(--shadow-sm)' : 'none',
              display: 'flex'
            }}
            title="List View"
            aria-label="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Second Row: Detailed Dropdown Filters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        {/* Category Dropdown */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <Tag size={13} color="var(--color-primary)" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="select-field"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <MapPin size={13} color="var(--color-primary)" />
            Campus Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="select-field"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
          >
            <option value="all">All Campus Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <Calendar size={13} color="var(--color-primary)" />
            Reported Timeline
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="select-field"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
          >
            <option value="all">Any Time</option>
            <option value="today">Today (Past 24 hours)</option>
            <option value="3days">Past 3 Days</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            <ArrowUpDown size={13} color="var(--color-primary)" />
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="select-field"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.75rem' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-viewed">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Meta Footer: Result Count and Reset Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ color: 'var(--color-text-subtle)' }}>
          Showing <strong>{totalResults}</strong> of {totalAll} reported items
          {filters.type !== 'all' && (
            <span> in <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{filters.type}</span></span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCcw size={14} />
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
}
