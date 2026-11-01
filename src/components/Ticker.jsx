import React from 'react';
import { Radio } from 'lucide-react';
import { SCROLLING_HEADLINES } from '../data/headlines';

export default function Ticker({ customHeadlines = [] }) {
  const headlines = customHeadlines.length > 0 ? customHeadlines : SCROLLING_HEADLINES;

  return (
    <div className="war-ticker-container" aria-label="International Satirical News Ticker">
      <div className="war-ticker-badge">
        <Radio size={14} className="doodle-star" />
        <span>PETTY DISPATCH TICKER</span>
      </div>

      <div className="war-ticker-track">
        {headlines.concat(headlines).map((item, idx) => (
          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {item}
            <span style={{ color: '#18181b', opacity: 0.4, margin: '0 12px' }}>★</span>
          </span>
        ))}
      </div>
    </div>
  );
}

