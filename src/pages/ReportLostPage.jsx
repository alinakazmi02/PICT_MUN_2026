import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Shield,
  FileText
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import MatchCard from '../components/MatchCard';
import { itemsService } from '../services/itemsService';
import { matchingService } from '../services/matchingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../data/categories';
import confetti from 'canvas-confetti';

export default function ReportLostPage() {
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
    date: new Date().toISOString().split('T')[0],
    time: 'Afternoon (1:00 PM – 4:00 PM)',
    location: '',
    locationDetails: '',
    referenceDetails: '',
    images: [],
    reporterName: currentUser?.name || '',
    reporterEmail: currentUser?.email || '',
    reporterPhone: currentUser?.phone || '',
    contactPreference: 'In-app Claim & Campus Email'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Item name is required';
    if (!formData.category) errs.category = 'Please select a category';
    if (!formData.description.trim()) {
      errs.description = 'Please describe the item';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Description should be at least 15 characters long';
    }
    if (!formData.date) errs.date = 'Date lost is required';
    if (!formData.location) errs.location = 'Please select the last known location';

    if (!formData.reporterName.trim()) errs.reporterName = 'Your name is required';
    if (!formData.reporterEmail.trim()) {
      errs.reporterEmail = 'College email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporterEmail)) {
      errs.reporterEmail = 'Please provide a valid college email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors before submitting.', 'error');
      // Scroll to top of form
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newReport = itemsService.createLostReport(formData);

      // Trigger Confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Find any immediate matches with found items
      const allItems = itemsService.getAllItems();
      const matches = matchingService.findMatches(newReport, allItems);
      setPossibleMatches(matches);

      setSubmittedReport(newReport);
      showToast(`Report #${newReport.id} successfully created!`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast('Failed to save report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  // If already submitted, display polished Success Screen
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
                backgroundColor: 'var(--color-lost-bg)',
                color: 'var(--color-lost)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div style={{ display: 'inline-block', backgroundColor: 'var(--color-lost-bg)', color: 'var(--color-lost)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Report ID: {submittedReport.id}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
              Lost Item Reported Successfully!
            </h1>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Your report for <strong>"{submittedReport.title}"</strong> has been broadcast across the campus platform. We will alert you if any matching found item is turned in.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center' }}>
              <Link to={`/item/${submittedReport.id}`} className="btn btn-primary btn-lg">
                View My Listing
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

          {/* Immediate Possible Matches if any exist */}
          {possibleMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                  Possible Matches Already Found on Campus!
                </h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Our client-side matching algorithm noticed similarities with previously reported found items:
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
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-lost)', fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <AlertCircle size={14} /> Missing Belongings
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
            Report a Lost Item
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Provide thorough details so fellow students, security desks, and campus staff can identify and return your missing belonging quickly.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Item Information */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={20} color="var(--color-primary)" />
              1. Item Information
            </h2>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">
                Item Name or Identifying Title <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Sony WH-1000XM4 Wireless Headphones, Brown Leather Wallet"
                className={`input-field ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && <div className="form-error"><AlertCircle size={13} /> {errors.title}</div>}
            </div>

            {/* Category & Location Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {/* Category */}
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

              {/* Location */}
              <div className="form-group">
                <label className="form-label">
                  Last Known Location on Campus <span className="required">*</span>
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
                placeholder="e.g. 2nd floor silent study cubicle #14, near water cooler"
                className="input-field"
              />
            </div>

            {/* Date & Time Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Date Lost <span className="required">*</span>
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
                  Approximate Time Lost <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g. Around 2:30 PM, Morning lecture"
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
                  placeholder="e.g. Sony, Apple, Hydro Flask, Casio"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Primary Colour(s) <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g. Matte Black, Cobalt Blue, Silver"
                  className="input-field"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Description <span className="required">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe shape, size, condition, and any contextual information that will help someone recognize it..."
                className={`textarea-field ${errors.description ? 'input-error' : ''}`}
              />
              <div className="form-hint">At least 15 characters. Describe the item accurately.</div>
              {errors.description && <div className="form-error"><AlertCircle size={13} /> {errors.description}</div>}
            </div>

            {/* Distinguishing Features */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Distinguishing Features &amp; Unique Marks <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.distinguishingFeatures}
                onChange={(e) => setFormData({ ...formData, distinguishingFeatures: e.target.value })}
                placeholder="e.g. Anime sticker on inner lid, small scratch on left corner, initials A.R."
                className="input-field"
              />
            </div>
          </div>

          {/* Section 2: Photographs */}
          <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--color-primary)" />
              2. Photographs &amp; Reference Images
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Upload one or more reference photos of your item (or similar model). A placeholder will be shown if none is uploaded.
            </p>
            <ImageUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
              maxImages={5}
            />
          </div>

          {/* Section 3: Reporter Information & Privacy Notice */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Shield size={20} color="var(--color-primary)" />
                3. Reporter Contact Information
              </h2>
              <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
                Privacy Protected
              </span>
            </div>

            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border)', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              <strong>Privacy Guarantee:</strong> Your college email and phone are stored safely for verification and are <strong>never</strong> displayed publicly on the listing.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label">
                  Your Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  placeholder="e.g. Alina Kazmi"
                  className={`input-field ${errors.reporterName ? 'input-error' : ''}`}
                />
                {errors.reporterName && <div className="form-error"><AlertCircle size={13} /> {errors.reporterName}</div>}
              </div>

              {/* College Email */}
              <div className="form-group">
                <label className="form-label">
                  College Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={formData.reporterEmail}
                  onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                  placeholder="e.g. a.kazmi@campus.edu"
                  className={`input-field ${errors.reporterEmail ? 'input-error' : ''}`}
                />
                {errors.reporterEmail && <div className="form-error"><AlertCircle size={13} /> {errors.reporterEmail}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {/* Preferred Contact Method */}
              <div className="form-group">
                <label className="form-label">Preferred Handover Contact</label>
                <select
                  value={formData.contactPreference}
                  onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                  className="select-field"
                >
                  <option value="In-app Claim & Campus Email">In-app Claim &amp; Campus Email</option>
                  <option value="Campus Security Desk Handover">Campus Security Desk Handover</option>
                  <option value="Phone / WhatsApp Coordination">Phone / WhatsApp Coordination</option>
                </select>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">
                  Phone / WhatsApp <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
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
                backgroundColor: 'var(--color-lost)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
              }}
            >
              <AlertCircle size={20} />
              Submit Lost Item Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
