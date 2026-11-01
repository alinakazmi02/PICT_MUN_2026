import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterControls from '../components/FilterControls';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { itemsService } from '../services/itemsService';
import { SearchX, ArrowDownCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL parameters or defaults
  const [filters, setFilters] = useState({
    keyword: searchParams.get('q') || '',
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    location: searchParams.get('location') || 'all',
    dateRange: searchParams.get('dateRange') || 'all',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Load items from service
  const loadData = () => {
    const total = itemsService.getAllItems();
    setAllItems(total);

    const results = itemsService.getListings(filters);
    setFilteredItems(results);
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // Sync state when URL params change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category') || 'all';
    const location = searchParams.get('location') || 'all';

    setFilters(prev => ({
      ...prev,
      keyword: q,
      type,
      category,
      location
    }));
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setVisibleCount(ITEMS_PER_PAGE);

    // Update URL params
    const newParams = new URLSearchParams();
    if (newFilters.keyword) newParams.set('q', newFilters.keyword);
    if (newFilters.type !== 'all') newParams.set('type', newFilters.type);
    if (newFilters.category !== 'all') newParams.set('category', newFilters.category);
    if (newFilters.location !== 'all') newParams.set('location', newFilters.location);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const reset = {
      keyword: '',
      type: 'all',
      category: 'all',
      location: 'all',
      dateRange: 'all',
      sortBy: 'newest'
    };
    setFilters(reset);
    setVisibleCount(ITEMS_PER_PAGE);
    setSearchParams(new URLSearchParams());
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  const currentVisibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="app-container">
        {/* Page Title & Intro */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
            Browse Campus Listings
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Explore reported lost belongings and found items submitted by students and campus departments.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          layout={layout}
          onLayoutChange={setLayout}
          totalResults={filteredItems.length}
          totalAll={allItems.length}
        />

        {/* Listings Display */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title="No matching listings found"
            description="We couldn't find any lost or found items matching your current search criteria. Try removing some filters or searching for broader terms."
            icon={SearchX}
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            {layout === 'grid' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2.5rem'
                }}
              >
                {currentVisibleItems.map(item => (
                  <ItemCard key={item.id} item={item} layout="grid" />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {currentVisibleItems.map(item => (
                  <ItemCard key={item.id} item={item} layout="list" />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="btn btn-outline-primary btn-lg"
                  style={{ minWidth: '220px' }}
                >
                  <ArrowDownCircle size={18} />
                  Load More ({filteredItems.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
