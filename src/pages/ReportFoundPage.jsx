import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Shield,
  Building2,
  Lock,
  FileText
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import MatchCard from '../components/MatchCard';
import { itemsService } from '../services/itemsService';
import { matchingService } from '../services/matchingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, CAMPUS_LOCATIONS, HANDOVER_LOCATIONS } from '../data/categories';
import confetti from 'canvas-confetti';

export default function ReportFoundPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [submittedReport, setSubmittedReport] = useState(null);
  const [possibleMatches, setPossibleMatches] = useState([]);

  // Form State
  const initialFormState = {
    title: '',
    category: '',
    description: '',
    brand: '',
    color: '',
    distinguishingFeatures: '',
    secretDetail: '',
    date: new Date().toISOString().split('T')[0],
    time: 'Morning (10:00 AM – 12:00 PM)',
    location: '',
    locationDetails: '',
    handoverStatus: 'Currently With Finder',
    handoverLocation: 'With finder on campus (Can meet at Library or Canteen)',
    images: [],
    finderName: currentUser?.name || '',
    finderEmail: currentUser?.email || '',
    contactPreference: 'In-app Claim & College Office'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Item title is required';
    if (!formData.category) errs.category = 'Please select a category';
    if (!formData.description.trim()) {
      errs.description = 'Please describe the found item';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Description should be at least 15 characters long';
    }
    if (!formData.date) errs.date = 'Date found is required';
    if (!formData.location) errs.location = 'Please select the campus location';

    if (!formData.finderName.trim()) errs.finderName = 'Your name is required';
    if (!formData.finderEmail.trim()) {
      errs.finderEmail = 'College email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.finderEmail)) {
      errs.finderEmail = 'Please provide a valid college email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors before submitting.', 'error');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newReport = itemsService.createFoundReport(formData);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Find any matches with lost items
      const allItems = itemsService.getAllItems();
      const matches = matchingService.findMatches(newReport, allItems);
      setPossibleMatches(matches);

      setSubmittedReport(newReport);
      showToast(`Found Item Report #${newReport.id} successfully published!`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast('Failed to save found item report.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  // Success view
  if (submittedReport) {
    return (
      <div style={{ padding: '3.5rem 0 5rem' }}>
        <div className="app-container" style={{ maxWidth: '800px' }}>
          <div
            className="card"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              marginBottom: '2.5rem'
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: 'var(--color-found-bg)',
                color: 'var(--color-found)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div style={{ display: 'inline-block', backgroundColor: 'var(--color-found-bg)', color: 'var(--color-found)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Report ID: {submittedReport.id}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
              Found Item Logged Successfully!
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Thank you for being an awesome member of our campus community! Your report for <strong>"{submittedReport.title}"</strong> will help reconnect the rightful owner.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center' }}>
              <Link to={`/item/${submittedReport.id}`} className="btn btn-primary btn-lg">
                View Published Listing
                <ArrowRight size={18} />
              </Link>
              <Link to="/my-reports" className="btn btn-outline btn-lg">
                Go to My Reports Dashboard
              </Link>
              <button
                type="button"
                onClick={() => { setSubmittedReport(null); setFormData(initialFormState); }}
                className="btn btn-ghost btn-lg"
              >
                Report Another Item
              </button>
            </div>
          </div>

          {/* Matches among lost reports */}
          {possibleMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                  Possible Lost Reports Matching This Item!
                </h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Someone may already be looking for this belonging:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {possibleMatches.map((m) => (
                  <MatchCard key={m.item.id} match={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="app-container" style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-found)', fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <CheckCircle2 size={14} /> Community Good Deed
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
            Report a Found Item
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Found an item on campus? Help return it safely to its rightful owner.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Item Information */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={20} color="var(--color-primary)" />
              1. Item Information
            </h2>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Item Name or Identifying Title <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Set of Keys with Blue Lanyard, Casio Scientific Calculator"
                className={`input-field ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && <div className="form-error"><AlertCircle size={13} /> {errors.title}</div>}
            </div>

            {/* Category & Location Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`select-field ${errors.category ? 'input-error' : ''}`}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <div className="form-error"><AlertCircle size={13} /> {errors.category}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Location Found <span className="required">*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`select-field ${errors.location ? 'input-error' : ''}`}
                >
                  <option value="">Select Campus Location</option>
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.location && <div className="form-error"><AlertCircle size={13} /> {errors.location}</div>}
              </div>
            </div>

            {/* Specific Location Details */}
            <div className="form-group">
              <label className="form-label">
                Specific Location Details <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.locationDetails}
                onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                placeholder="e.g. Bench outside basketball court 2, or near juice counter"
                className="input-field"
              />
            </div>

            {/* Date & Time Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Date Found <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`input-field ${errors.date ? 'input-error' : ''}`}
                />
                {errors.date && <div className="form-error"><AlertCircle size={13} /> {errors.date}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Approximate Time Found <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g. Around 4:30 PM"
                  className="input-field"
                />
              </div>
            </div>

            {/* Brand & Colour */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Brand / Make <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Casio, Yamaha, Nike, Apple"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Colour <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g. Silver, Navy Blue, Red"
                  className="input-field"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="form-group">
              <label className="form-label">
                Public Description <span className="required">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the visible condition and general details..."
                className={`textarea-field ${errors.description ? 'input-error' : ''}`}
              />
              <div className="form-hint">At least 15 characters. Avoid listing private secret identifiers here.</div>
              {errors.description && <div className="form-error"><AlertCircle size={13} /> {errors.description}</div>}
            </div>

            {/* Secret Verification Prompt (Anti-Fraud Feature) */}
            <div
              style={{
                backgroundColor: 'var(--color-accent-light)',
                border: '1px solid var(--color-accent-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400e', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                <Lock size={16} />
                Secret Verification Prompt <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>(Highly Recommended for Safety)</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Ask for a detail that only the real owner would know (e.g. lock screen picture, engraved initials, sticker design, inside contents). The owner must answer this when submitting a claim.
              </p>
              <input
                type="text"
                value={formData.secretDetail}
                onChange={(e) => setFormData({ ...formData, secretDetail: e.target.value })}
                placeholder="e.g. What anime sticker is on the inside case? What novel is inside the front pouch?"
                className="input-field"
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          </div>

          {/* Section 2: Photographs */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--color-primary)" />
              2. Photographs
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Upload clear photographs of the found item.
            </p>
            <ImageUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
              maxImages={5}
            />
          </div>

          {/* Section 3: Item Handover Information */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="var(--color-primary)" />
              3. Item Handover Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Current Custody Status</label>
                <select
                  value={formData.handoverStatus}
                  onChange={(e) => setFormData({ ...formData, handoverStatus: e.target.value })}
                  className="select-field"
                >
                  <option value="Currently With Finder">Currently With Finder</option>
                  <option value="Submitted to College Office">Submitted to College Office / Security</option>
                  <option value="Handed Over to Owner">Already Handed Over to Owner</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current Storage or Pickup Location</label>
                <input
                  type="text"
                  value={formData.handoverLocation}
                  onChange={(e) => setFormData({ ...formData, handoverLocation: e.target.value })}
                  placeholder="e.g. Central Library Reception, Security Gate 1, or With finder"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Finder Information */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Shield size={20} color="var(--color-primary)" />
                4. Finder Contact Information
              </h2>
              <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                Privacy Protected
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Your Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.finderName}
                  onChange={(e) => setFormData({ ...formData, finderName: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className={`input-field ${errors.finderName ? 'input-error' : ''}`}
                />
                {errors.finderName && <div className="form-error"><AlertCircle size={13} /> {errors.finderName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  College Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={formData.finderEmail}
                  onChange={(e) => setFormData({ ...formData, finderEmail: e.target.value })}
                  placeholder="e.g. p.sharma@campus.edu"
                  className={`input-field ${errors.finderEmail ? 'input-error' : ''}`}
                />
                {errors.finderEmail && <div className="form-error"><AlertCircle size={13} /> {errors.finderEmail}</div>}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline"
              >
                <RotateCcw size={16} />
                Reset Form
              </button>
              <button
                type="button"
                onClick={() => navigate('/browse')}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-lg"
              style={{
                backgroundColor: 'var(--color-found)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
              }}
            >
              <CheckCircle2 size={20} />
              Submit Found Item Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
