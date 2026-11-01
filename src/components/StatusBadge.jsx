import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Sparkles, Building2, UserCheck } from 'lucide-react';

export default function StatusBadge({ status, type, handoverStatus }) {
  if (type) {
    const isLost = type.toLowerCase() === 'lost';
    return (
      <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
        {isLost ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
        {isLost ? 'Lost Item' : 'Found Item'}
      </span>
    );
  }

  if (handoverStatus) {
    if (handoverStatus.includes('Submitted to College Office')) {
      return (
        <span className="badge" style={{ backgroundColor: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' }}>
          <Building2 size={12} />
          At College Office
        </span>
      );
    }
    if (handoverStatus.includes('Handed Over to Owner')) {
      return (
        <span className="badge badge-returned">
          <UserCheck size={12} />
          Handed to Owner
        </span>
      );
    }
    return (
      <span className="badge" style={{ backgroundColor: '#F8FAFC', color: '#475569', border: '1px solid #CBD5E1' }}>
        <Clock size={12} />
        With Finder
      </span>
    );
  }

  switch (status?.toLowerCase()) {
    case 'possible match':
      return (
        <span className="badge badge-match">
          <Sparkles size={12} />
          Possible Match
        </span>
      );
    case 'claim pending':
      return (
        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
          <Clock size={12} />
          Claim Pending
        </span>
      );
    case 'returned':
      return (
        <span className="badge badge-returned">
          <CheckCircle2 size={12} />
          Returned
        </span>
      );
    case 'closed':
      return (
        <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>
          Closed
        </span>
      );
    case 'active':
    default:
      return (
        <span className="badge" style={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
          <Clock size={12} />
          Active
        </span>
      );
  }
}
