import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Send, Lock } from 'lucide-react';
import { claimsService } from '../services/claimsService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';

export default function ClaimModal({ item, isOpen, onClose, onClaimSuccess }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    ownershipProof: '',
    secretAnswer: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Campus email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid campus email address';
    }
    if (!formData.ownershipProof.trim()) {
      newErrors.ownershipProof = 'Please explain why you believe this item is yours';
    } else if (formData.ownershipProof.trim().length < 15) {
      newErrors.ownershipProof = 'Please provide at least 15 characters describing unique identifiers';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const claim = claimsService.submitClaim({
        itemId: item.id,
        itemTitle: item.title,
        claimantName: formData.name,
        claimantEmail: formData.email,
        claimantPhone: formData.phone,
        ownershipProof: formData.ownershipProof,
        secretAnswer: formData.secretAnswer
      });

      // Confetti burst for positive interaction
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast(`Claim request submitted for "${item.title}". Check "My Reports" to track progress!`, 'success');
      if (onClaimSuccess) onClaimSuccess(claim);
      onClose();
    } catch (err) {
      showToast('Failed to submit claim request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Claim Ownership Request
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                Target Item: <strong>{item.title}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: 'calc(90vh - 140px)', overflowY: 'auto' }}>
            {/* Demo Mode Notice */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-muted)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem'
              }}
            >
              <Lock size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                <strong>Demo Mode:</strong> Claims are processed simulated client-side and saved to your browser session. Your contact details are kept private and never broadcast publicly.
              </div>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">
                Your Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Alina Kazmi"
              />
              {errors.name && <div className="form-error"><AlertCircle size={13} /> {errors.name}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Campus Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. student@campus.edu"
              />
              <div className="form-hint">Used by campus staff or finder to coordinate verification.</div>
              {errors.email && <div className="form-error"><AlertCircle size={13} /> {errors.email}</div>}
            </div>

            {/* Phone (Optional) */}
            <div className="form-group">
              <label className="form-label">
                Phone Number <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>(Optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="e.g. +1 (555) 000-0000"
              />
            </div>

            {/* Proof / Verification Details */}
            <div className="form-group">
              <label className="form-label">
                Detailed Proof of Ownership <span className="required">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.ownershipProof}
                onChange={(e) => setFormData({ ...formData, ownershipProof: e.target.value })}
                className={`textarea-field ${errors.ownershipProof ? 'input-error' : ''}`}
                placeholder="Describe markings, wallpaper, specific items inside, serial number, scratches, or stickers that prove this item is yours..."
              />
              <div className="form-hint">
                Tip: Mention details that are not visible in the public photos.
              </div>
              {errors.ownershipProof && <div className="form-error"><AlertCircle size={13} /> {errors.ownershipProof}</div>}
            </div>

            {/* Secret Verification Question (if finder added one) */}
            {item.secretDetail && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--color-accent-light)',
                  border: '1px solid var(--color-accent-border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', marginBottom: '0.35rem' }}>
                  Finder's Verification Challenge:
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78350f', marginBottom: '0.65rem' }}>
                  "{item.secretDetail}"
                </div>
                <input
                  type="text"
                  value={formData.secretAnswer}
                  onChange={(e) => setFormData({ ...formData, secretAnswer: e.target.value })}
                  className="input-field"
                  placeholder="Your answer to this verification prompt..."
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Send size={16} />
              Submit Claim Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
