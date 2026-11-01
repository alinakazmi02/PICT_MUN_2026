import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Sparkles, Check } from 'lucide-react';

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80' },
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' }
];

export default function ImageUploader({ images = [], onChange, maxImages = 5, error = null }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    setUploadError(null);
    const validFiles = [];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files (PNG, JPG, WEBP) are supported.');
        return;
      }
      if (file.size > maxSizeBytes) {
        setUploadError(`File "${file.name}" exceeds 5MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (images.length + validFiles.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed.`);
      return;
    }

    // Convert to Base64 URLs for local persistence & instant preview
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange([...images, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddPreset = (url) => {
    if (images.includes(url)) return;
    if (images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed.`);
      return;
    }
    onChange([...images, url]);
  };

  return (
    <div>
      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--color-primary)' : error ? 'var(--color-danger)' : 'var(--color-border-subtle)'}`,
          backgroundColor: dragOver ? 'var(--color-primary-light)' : '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
          style={{ display: 'none' }}
        />

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}
        >
          <Upload size={24} />
        </div>

        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
          Click to upload or drag &amp; drop photos
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
          Supports PNG, JPG, WEBP up to 5MB each (Max {maxImages} images)
        </div>
      </div>

      {/* Preset Quick Select for Smooth Demo */}
      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.785rem', color: 'var(--color-text-subtle)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <Sparkles size={13} color="var(--color-accent)" />
          Quick demo presets:
        </span>
        {SAMPLE_PHOTO_PRESETS.map((preset) => {
          const isSelected = images.includes(preset.url);
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleAddPreset(preset.url)}
              disabled={isSelected}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: isSelected ? 'var(--color-bg-muted)' : '#ffffff',
                color: isSelected ? 'var(--color-text-subtle)' : 'var(--color-primary)',
                cursor: isSelected ? 'default' : 'pointer'
              }}
            >
              {preset.label} {isSelected && '✓'}
            </button>
          );
        })}
      </div>

      {/* Validation Errors */}
      {(uploadError || error) && (
        <div className="form-error" style={{ marginTop: '0.5rem' }}>
          <AlertCircle size={14} />
          {uploadError || error}
        </div>
      )}

      {/* Previews List */}
      {images.length > 0 && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
            Selected Photos ({images.length}/{maxImages}):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#f1f5f9'
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Upload preview ${idx + 1}`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.15s'
                  }}
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
                {idx === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      backgroundColor: 'rgba(37, 99, 235, 0.9)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
