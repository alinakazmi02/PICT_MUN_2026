import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Users,
  Repeat,
  HeartHandshake,
  Check,
  ChevronRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ItemCard from '../components/ItemCard';
import SafeMeetingBanner from '../components/SafeMeetingBanner';
import { itemsService } from '../services/itemsService';
import { CATEGORIES } from '../data/categories';

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);
  const [stats, setStats] = useState({ totalReports: 0, activeListings: 0, itemsReunited: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent listings and statistics
    const listings = itemsService.getListings({ sortBy: 'newest' });
    setRecentItems(listings.slice(0, 6));
    setStats(itemsService.getStats());
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at 85% 15%, rgba(37, 99, 235, 0.08) 0%, rgba(248, 250, 252, 1) 60%)',
          paddingTop: '3.5rem',
          paddingBottom: '4.5rem',
          borderBottom: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="app-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div style={{ maxWidth: '580px' }}>
              {/* Campus pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  border: '1px solid var(--color-primary-border)'
                }}
              >
                <Sparkles size={14} color="var(--color-accent)" />
                Official Campus Lost &amp; Found Portal
              </div>

              {/* Main Heading & Tagline */}
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                  color: 'var(--color-text-main)'
                }}
              >
                Lost something? <br />
                <span style={{ color: 'var(--color-primary)' }}>Let's bring it back.</span>
              </h1>

              {/* Supporting text */}
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  marginBottom: '2rem'
                }}
              >
                “Your campus community is here to help. Report lost belongings, share items you've found, and help reunite people with what matters to them.”
              </p>

              {/* Two Prominent Action CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <Link
                  to="/report-lost"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: 'var(--color-lost)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                    padding: '0.85rem 1.75rem'
                  }}
                >
                  <AlertCircle size={20} />
                  I Lost Something
                </Link>

                <Link
                  to="/report-found"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: 'var(--color-found)',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                    padding: '0.85rem 1.75rem'
                  }}
                >
                  <CheckCircle2 size={20} />
                  I Found Something
                </Link>
              </div>

              {/* Trust & Safety Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={16} color="var(--color-found)" />
                  Campus-only verified community
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Repeat size={16} color="var(--color-primary)" />
                  Smart matching assistance
                </span>
              </div>
            </div>

            {/* Right Visual Composition featuring Student Belongings */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: '380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Background decorative blob */}
                <div
                  style={{
                    position: 'absolute',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(245,158,11,0.12) 100%)',
                    filter: 'blur(30px)',
                    zIndex: 0
                  }}
                />

                {/* Floating Composite Cards */}
                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}>
                  {/* Card 1: Wireless Headphones */}
                  <div
                    className="card"
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      marginBottom: '1rem',
                      transform: 'rotate(-1.5deg)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80"
                      alt="Headphones"
                      style={{ width: 52, height: 52, borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                        <span className="badge badge-lost" style={{ fontSize: '0.65rem' }}>Lost</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Central Library</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Sony Wireless Headphones</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-found)', fontWeight: 600 }}>1 Possible Match found!</div>
                    </div>
                  </div>

                  {/* Card 2: Student ID Card */}
                  <div
                    className="card"
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      marginBottom: '1rem',
                      marginLeft: '2rem',
                      transform: 'rotate(1.5deg)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=150&q=80"
                      alt="ID Card"
                      style={{ width: 52, height: 52, borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                        <span className="badge badge-found" style={{ fontSize: '0.65rem' }}>Found</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Main Auditorium</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>College Student ID Card</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>Safe at Library Desk</div>
                    </div>
                  </div>

                  {/* Card 3: Water Bottle Reunited */}
                  <div
                    className="card"
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      transform: 'rotate(-0.5deg)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=150&q=80"
                      alt="Water Bottle"
                      style={{ width: 52, height: 52, borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                        <span className="badge badge-returned" style={{ fontSize: '0.65rem' }}>Reunited</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Campus Canteen</span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Cobalt Blue Hydro Flask</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Returned to Owner</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Search Section */}
      <section style={{ marginTop: '-2rem', position: 'relative', zIndex: 10, marginBottom: '3.5rem' }}>
        <div className="app-container">
          <SearchBar />
        </div>
      </section>

      {/* 3. Browse by Popular Categories */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="app-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                Browse by Category
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-subtle)' }}>
                Select a category to filter campus belongings
              </p>
            </div>
            <Link to="/browse" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              View All Categories <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
              gap: '0.85rem'
            }}
          >
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/browse?category=${encodeURIComponent(cat.name)}`)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.1rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-border)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: cat.bg,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-main)', lineHeight: 1.25 }}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Recently Reported Items Grid */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="app-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                <Clock size={14} /> Live Campus Feed
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                Recently Reported Items
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
                Latest missing and found belongings across college grounds
              </p>
            </div>

            <Link to="/browse" className="btn btn-outline-primary">
              Explore All Listings
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works (4 Visually Attractive Steps) */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          padding: '4.5rem 0',
          marginBottom: '4.5rem'
        }}
      >
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 4-Step Process
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
              How Lost and Found Works
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              A straightforward, transparent workflow designed for busy students and campus safety.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
              position: 'relative'
            }}
          >
            {/* Step 1 */}
            <div style={{ textAlign: 'left', padding: '1.5rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border)' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '1.25rem'
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                Report Item
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Submit a lost or found report with photos, location, category, and distinguishing characteristics in under 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ textAlign: 'left', padding: '1.5rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border)' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-match-bg)',
                  color: 'var(--color-match)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '1.25rem'
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                Discover Matches
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Browse existing listings or let our transparent matching algorithm identify possible lost/found pairings by category and location.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ textAlign: 'left', padding: '1.5rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border)' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '1.25rem'
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                Verify Ownership
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Submit an ownership claim explaining secret details, stickers, or lock-screen contents without exposing private info.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ textAlign: 'left', padding: '1.5rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border)' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-found-bg)',
                  color: 'var(--color-found)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '1.25rem'
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                Safe Campus Return
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Meet safely at verified campus safe zones (Library reception, Security Gate 1) and celebrate another recovered item!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Community Statistics */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div className="app-container">
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: 'var(--radius-xl)',
              color: '#ffffff',
              padding: '3rem 2rem',
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.25) 0%, transparent 60%)',
              border: '1px solid #1e293b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <span
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#fcd34d',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Sparkles size={12} />
                  Demo Community Statistics
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.5rem' }}>
                  Impact Across the College Campus
                </h2>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '300px' }}>
                *Calculated dynamically from current simulated demo reports stored in local browser storage.
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {/* Stat 1 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                  {stats.totalReports}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>
                  Total Reports Filed
                </div>
                <div style={{ fontSize: '0.785rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Lost and found submissions
                </div>
              </div>

              {/* Stat 2 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                  {stats.activeListings}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>
                  Active Listings
                </div>
                <div style={{ fontSize: '0.785rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Currently being matched
                </div>
              </div>

              {/* Stat 3 */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                  {stats.itemsReunited}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9' }}>
                  Items Reunited
                </div>
                <div style={{ fontSize: '0.785rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Successfully returned to owners
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Safe Campus Meeting Banner */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="app-container">
          <SafeMeetingBanner />
        </div>
      </section>
    </div>
  );
}
