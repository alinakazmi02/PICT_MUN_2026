import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { playClick } from '../utils/sound';

export default function CountrySelect({
  value,
  onChange,
  label = 'Select Your Country',
  placeholder = 'Search among all 195 nations...',
  excludeCountryId = null,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedCountry = COUNTRIES.find((c) => c.id === value);

  // Filter countries alphabetically by name or code
  const filteredCountries = COUNTRIES.filter((country) => {
    if (excludeCountryId && country.id === excludeCountryId) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  });

  const handleSelect = (countryId) => {
    playClick();
    onChange(countryId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="country-select-dropdown" ref={dropdownRef}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '6px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#18181b',
          }}
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        className="country-select-trigger"
        onClick={() => {
          if (!disabled) {
            playClick();
            setIsOpen(!isOpen);
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: isOpen ? '#fef08a' : '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {selectedCountry ? (
            <>
              <span style={{ fontSize: '1.45rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
              <span style={{ fontWeight: 600, color: '#18181b' }}>{selectedCountry.name}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: '#e2e8f0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  color: '#475569',
                }}
              >
                {selectedCountry.code}
              </span>
            </>
          ) : (
            <span style={{ color: '#64748b' }}>{placeholder}</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ChevronDown
            size={18}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s ease',
            }}
          />
        </div>
      </div>

      {/* Dropdown Menu with Search and Scroll */}
      {isOpen && (
        <div className="country-select-menu">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                color: '#64748b',
                pointerEvents: 'none',
              }}
            />
            <input
              ref={searchInputRef}
              type="text"
              className="country-search-input"
              style={{ paddingLeft: '38px', paddingRight: '36px' }}
              placeholder="Type country name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#64748b',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>ALL 195 NATIONS (193 UN + 2 OBSERVERS)</span>
            <span>{filteredCountries.length} shown</span>
          </div>

          <div className="country-list-scroll">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = selectedCountry?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className={`country-option-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(c.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>{c.flag}</span>
                      <span style={{ fontWeight: isSelected ? 700 : 500, color: '#18181b' }}>
                        {c.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          fontFamily: 'monospace',
                        }}
                      >
                        {c.code}
                      </span>
                      {isSelected && <Check size={16} color="#059669" strokeWidth={3} />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.9rem',
                }}
              >
                No country found matching "<strong>{searchQuery}</strong>". Did cartographers forget them?
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

