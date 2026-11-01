import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function ReportConcernModal({ item, isOpen, onClose }) {
  const { showToast } = useToast();
  const [reason, setReason] = useState('duplicate');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you for reporting. Campus moderation team has been notified.', 'success');
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Flag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Report a Concern
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                Listing: <strong>{item.title}</strong>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Reason for concern</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="select-field"
              >
                <option value="duplicate">Duplicate listing</option>
                <option value="already-returned">Item has already been returned / resolved</option>
                <option value="inappropriate">Inappropriate or offensive language/photo</option>
                <option value="privacy">Exposes sensitive private personal information</option>
                <option value="spam">Spam or misleading information</option>
                <option value="other">Other issue</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional notes (optional)</label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="textarea-field"
                placeholder="Provide any additional context to assist campus moderators..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-danger">
              <Flag size={15} />
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
