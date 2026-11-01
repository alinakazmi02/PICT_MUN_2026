import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Tag,
  ShieldCheck,
  Flag,
  Share2,
  Sparkles,
  Building2,
  User,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import MatchCard from '../components/MatchCard';
import ItemCard from '../components/ItemCard';
import ClaimModal from '../components/ClaimModal';
import ReportConcernModal from '../components/ReportConcernModal';
import SafeMeetingBanner from '../components/SafeMeetingBanner';
import { itemsService } from '../services/itemsService';
import { matchingService } from '../services/matchingService';
import { useToast } from '../context/ToastContext';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [item, setItem] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [possibleMatches, setPossibleMatches] = useState([]);
  const [similarItems, setSimilarItems] = useState([]);

  // Modals state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
  const [isFoundMatchModalOpen, setIsFoundMatchModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const foundItem = itemsService.getItemById(id);
    if (foundItem) {
      setItem(foundItem);
      setSelectedImageIndex(0);

      // Find possible matches using transparent matching service
      const allItems = itemsService.getAllItems();
      const matches = matchingService.findMatches(foundItem, allItems);
      setPossibleMatches(matches);

      // Similar items in same category (excluding current item)
      const similar = allItems.filter(
        i => i.id !== foundItem.id && i.category === foundItem.category
      ).slice(0, 3);
      setSimilarItems(similar);
    } else {
      setItem(null);
    }
  }, [id]);

  if (!item) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="app-container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Listing Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            The item listing you're looking for (ID: {id}) might have been removed or does not exist.
          </p>
          <Link to="/browse" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Browse
          </Link>
        </div>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const images = item.images && item.images.length > 0
    ? item.images
    : [`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='%23F1F5F9'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2364748B'%3ENo Photo Available%3C/text%3E%3C/svg%3E`];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing URL copied to clipboard!', 'info');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container">
        {/* Navigation Breadcrumb & Back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/browse')}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={15} />
            Back to Browse
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleShare}
              className="btn btn-outline btn-sm"
              title="Share listing"
            >
              <Share2 size={14} />
              Share
            </button>
            <button
              onClick={() => setIsConcernModalOpen(true)}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-text-subtle)' }}
              title="Report concern"
            >
              <Flag size={14} />
              Report Concern
            </button>
          </div>
        </div>

        {/* Main Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
            marginBottom: '3rem'
          }}
        >
          {/* Left Column: Image Gallery */}
          <div>
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                border: '1px solid var(--color-border)',
                aspectRatio: '4/3',
                position: 'relative',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '1rem'
              }}
            >
              <img
                src={images[selectedImageIndex]}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Badges on main image */}
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
                <StatusBadge type={item.type} />
              </div>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                <StatusBadge status={item.status} />
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div>
            {/* Category & ID Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span className="badge badge-category">
                <Tag size={12} style={{ marginRight: '4px' }} />
                {item.category}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>
                ID: {item.id}
              </span>
            </div>

            {/* Main Item Title */}
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.15rem)', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1rem', lineHeight: 1.2 }}>
              {item.title}
            </h1>

            {/* Incident Metadata Grid */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} color="var(--color-primary)" />
                  Campus Location
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                  {item.location}
                </div>
                {item.locationDetails && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                    {item.locationDetails}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={13} color="var(--color-primary)" />
                  Date &amp; Time
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                  {item.date}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                  {item.time || 'Not specified'}
                </div>
              </div>

              {item.brand && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
                    Brand / Manufacturer
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {item.brand}
                  </div>
                </div>
              )}

              {item.color && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
                    Colour
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                    {item.color}
                  </div>
                </div>
              )}
            </div>

            {/* Full Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                Full Description
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {item.description}
              </p>
            </div>

            {/* Distinguishing Characteristics */}
            {item.distinguishingFeatures && (
              <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', marginBottom: '0.25rem' }}>
                  Distinguishing Features:
                </div>
                <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
                  {item.distinguishingFeatures}
                </div>
              </div>
            )}

            {/* Handover Location for Found Items */}
            {!isLost && item.handoverLocation && (
              <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={14} />
                  Current Handover Custody:
                </div>
                <div style={{ fontSize: '0.875rem', color: '#14532d', fontWeight: 600 }}>
                  {item.handoverStatus} — {item.handoverLocation}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.5rem'
              }}
            >
              {isLost ? (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem', color: 'var(--color-text-main)' }}>
                    Did you discover or pick up this missing belonging?
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    Help reconnect this student with their belonging by sending a quick match notification or handing it into campus security.
                  </p>
                  <button
                    onClick={() => setIsFoundMatchModalOpen(true)}
                    className="btn btn-lg"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-found)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    <CheckCircle2 size={18} />
                    I Found This Item / Notify Student
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem', color: 'var(--color-text-main)' }}>
                    Does this found item belong to you?
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    Submit an ownership claim with your identifying proof. The finder or campus desk will verify your details before handing it over.
                  </p>
                  <button
                    onClick={() => setIsClaimModalOpen(true)}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                  >
                    <ShieldCheck size={18} />
                    This Might Be Mine — Submit Claim
                  </button>
                </div>
              )}
            </div>

            {/* Reporter Masked Identity & Safety */}
            <div style={{ fontSize: '0.785rem', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} color="var(--color-primary)" />
              Reported by {isLost ? item.reporter?.name : item.finder?.name} • Student contact protected
            </div>
          </div>
        </div>

        {/* Possible Matches Section (Powered by Matching Algorithm) */}
        {possibleMatches.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                Possible Matches ({possibleMatches.length})
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Our transparent client-side matching algorithm identified listings with matching category, keywords, or campus locations:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {possibleMatches.map((m) => (
                <MatchCard key={m.item.id} match={m} />
              ))}
            </div>
          </div>
        )}

        {/* Similar Items in Same Category */}
        {similarItems.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
              Other Items in {item.category}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {similarItems.map((sItem) => (
                <ItemCard key={sItem.id} item={sItem} />
              ))}
            </div>
          </div>
        )}

        {/* Safety Meeting Banner */}
        <SafeMeetingBanner />

        {/* Claim Modal */}
        <ClaimModal
          item={item}
          isOpen={isClaimModalOpen}
          onClose={() => setIsClaimModalOpen(false)}
          onClaimSuccess={() => {
            // Reload item to see updated status
            const updated = itemsService.getItemById(item.id);
            if (updated) setItem(updated);
          }}
        />

        {/* Report Concern Modal */}
        <ReportConcernModal
          item={item}
          isOpen={isConcernModalOpen}
          onClose={() => setIsConcernModalOpen(false)}
        />

        {/* "I Found This Item" Modal for Lost Items */}
        {isFoundMatchModalOpen && (
          <div className="modal-overlay" onClick={() => setIsFoundMatchModalOpen(false)} role="dialog">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Notify Owner You Found This
                </h3>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Awesome! Did you turn this item into campus security, or are you currently holding it on campus?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      showToast('Owner has been notified in-app that their item was found! Hand it to Central Library or Security.', 'success');
                      setIsFoundMatchModalOpen(false);
                    }}
                    className="btn btn-primary"
                    style={{ justifyContent: 'center' }}
                  >
                    I Have It With Me on Campus
                  </button>
                  <button
                    onClick={() => {
                      showToast('Thank you! Owner has been notified that the item was submitted to Campus Security.', 'success');
                      setIsFoundMatchModalOpen(false);
                    }}
                    className="btn btn-outline"
                    style={{ justifyContent: 'center' }}
                  >
                    I Turned It In to Campus Security / Library
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setIsFoundMatchModalOpen(false)} className="btn btn-ghost">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
