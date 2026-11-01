import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  PlusCircle,
  User,
  Inbox
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ConfirmationDialog from '../components/ConfirmationDialog';
import EmptyState from '../components/EmptyState';
import { itemsService } from '../services/itemsService';
import { claimsService } from '../services/claimsService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function MyReportsPage() {
  const { currentUser, switchProfile, demoProfiles } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('lost'); // 'lost' | 'found' | 'claims' | 'all'
  const [userReports, setUserReports] = useState([]);
  const [userClaims, setUserClaims] = useState([]);

  // Edit report modal state
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', status: '', handoverLocation: '' });

  // Delete dialog state
  const [deletingId, setDeletingId] = useState(null);

  // Reset sample data dialog
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const loadData = () => {
    const email = currentUser?.email || 'a.kazmi@campus.edu';
    const reports = itemsService.getUserReports(email);
    setUserReports(reports);

    const claims = claimsService.getUserClaims(email);
    setUserClaims(claims);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const lostReports = userReports.filter(r => r.type === 'lost');
  const foundReports = userReports.filter(r => r.type === 'found');

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!deletingId) return;
    itemsService.deleteReport(deletingId);
    setDeletingId(null);
    showToast('Report deleted successfully.', 'info');
    loadData();
  };

  // Handle Edit Submit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    itemsService.updateReport(editingItem.id, editFormData);
    setEditingItem(null);
    showToast('Report updated successfully.', 'success');
    loadData();
  };

  // Handle Reset to Demo
  const handleResetToDemo = () => {
    itemsService.resetToSampleData();
    setIsResetDialogOpen(false);
    showToast('Restored original sample listings and reports!', 'success');
    loadData();
  };

  // Handle Mark as Returned
  const handleMarkReturned = (id) => {
    itemsService.updateReport(id, { status: 'Returned', handoverStatus: 'Handed Over to Owner' });
    showToast('Marked item as safely reunited with owner!', 'success');
    loadData();
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container">
        {/* User Persona Header */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser?.name}
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-border)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                  {currentUser?.name || 'Demo Student Profile'}
                </h1>
                <span className="badge" style={{ backgroundColor: '#eff6ff', color: 'var(--color-primary)', border: '1px solid #bfdbfe' }}>
                  {currentUser?.role || 'Student'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
                {currentUser?.email} • {currentUser?.department} ({currentUser?.year})
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher for demo ease */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Switch Demo Persona:
            </div>
            {demoProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => switchProfile(p.id)}
                className={`btn btn-sm ${currentUser?.id === p.id ? 'btn-primary' : 'btn-outline'}`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
            <button
              onClick={() => setIsResetDialogOpen(true)}
              className="btn btn-ghost btn-sm"
              title="Reset all sample data"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              <RotateCcw size={14} />
              Reset Sample Data
            </button>
          </div>
        </div>

        {/* Dashboard Stat Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
              My Lost Items
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-lost)', fontFamily: 'var(--font-heading)' }}>
              {lostReports.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
              My Found Items
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-found)', fontFamily: 'var(--font-heading)' }}>
              {foundReports.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
              My Claims Submitted
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              {userClaims.length}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
              Items Reunited
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-returned)', fontFamily: 'var(--font-heading)' }}>
              {userReports.filter(r => r.status === 'Returned').length}
            </div>
          </div>
        </div>

        {/* Tabs Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('lost')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: activeTab === 'lost' ? 'var(--color-lost)' : 'var(--color-text-subtle)',
                borderBottom: activeTab === 'lost' ? '3px solid var(--color-lost)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <AlertCircle size={16} />
              My Lost Items ({lostReports.length})
            </button>

            <button
              onClick={() => setActiveTab('found')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: activeTab === 'found' ? 'var(--color-found)' : 'var(--color-text-subtle)',
                borderBottom: activeTab === 'found' ? '3px solid var(--color-found)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <CheckCircle2 size={16} />
              My Found Items ({foundReports.length})
            </button>

            <button
              onClick={() => setActiveTab('claims')}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: activeTab === 'claims' ? 'var(--color-primary)' : 'var(--color-text-subtle)',
                borderBottom: activeTab === 'claims' ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Inbox size={16} />
              My Claims ({userClaims.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Link to="/report-lost" className="btn btn-outline btn-sm">
              <PlusCircle size={14} /> Report Lost
            </Link>
            <Link to="/report-found" className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> Report Found
            </Link>
          </div>
        </div>

        {/* Tab 1: Lost Items List */}
        {activeTab === 'lost' && (
          <div>
            {lostReports.length === 0 ? (
              <EmptyState
                title="No lost items reported yet"
                description="Have you misplaced headphones, a student ID, books, or keys on campus? File a report to alert the student community."
                actionLabel="Report a Lost Item"
                actionLink="/report-lost"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lostReports.map((item) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: '1 1 300px' }}>
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                        alt={item.title}
                        style={{ width: 70, height: 70, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-subtle)' }}>
                            {item.id}
                          </span>
                          <StatusBadge status={item.status} />
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                          <Link to={`/item/${item.id}`} style={{ color: 'var(--color-text-main)' }}>
                            {item.title}
                          </Link>
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                          {item.location} • Lost on {item.date}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {item.status !== 'Returned' && (
                        <button
                          onClick={() => handleMarkReturned(item.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--color-found)', borderColor: 'var(--color-found-border)' }}
                        >
                          <CheckCircle2 size={14} />
                          Mark Reunited
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setEditFormData({
                            title: item.title,
                            description: item.description,
                            status: item.status,
                            handoverLocation: item.handoverLocation || ''
                          });
                        }}
                        className="btn btn-outline btn-sm"
                        title="Edit report"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-danger)' }}
                        title="Delete report"
                      >
                        <Trash2 size={14} />
                      </button>
                      <Link to={`/item/${item.id}`} className="btn btn-outline-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Found Items List */}
        {activeTab === 'found' && (
          <div>
            {foundReports.length === 0 ? (
              <EmptyState
                title="No found items logged yet"
                description="If you come across unattended items on campus, log them here to help reunite them with their owners."
                actionLabel="Report a Found Item"
                actionLink="/report-found"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {foundReports.map((item) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: '1 1 300px' }}>
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=150&q=80'}
                        alt={item.title}
                        style={{ width: 70, height: 70, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-subtle)' }}>
                            {item.id}
                          </span>
                          <StatusBadge status={item.status} />
                          <StatusBadge handoverStatus={item.handoverStatus} />
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                          <Link to={`/item/${item.id}`} style={{ color: 'var(--color-text-main)' }}>
                            {item.title}
                          </Link>
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                          {item.location} • Found on {item.date}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {item.status !== 'Returned' && (
                        <button
                          onClick={() => handleMarkReturned(item.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--color-found)', borderColor: 'var(--color-found-border)' }}
                        >
                          <CheckCircle2 size={14} />
                          Mark Handed to Owner
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setEditFormData({
                            title: item.title,
                            description: item.description,
                            status: item.status,
                            handoverLocation: item.handoverLocation || ''
                          });
                        }}
                        className="btn btn-outline btn-sm"
                        title="Edit report"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-danger)' }}
                        title="Delete report"
                      >
                        <Trash2 size={14} />
                      </button>
                      <Link to={`/item/${item.id}`} className="btn btn-outline-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Claims List */}
        {activeTab === 'claims' && (
          <div>
            {userClaims.length === 0 ? (
              <EmptyState
                title="No active claims submitted"
                description="When you spot an item in Browse that looks like your missing belonging, click 'This Might Be Mine' to submit a claim."
                actionLabel="Browse Found Listings"
                actionLink="/browse?type=found"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-subtle)' }}>
                          Claim: {claim.id}
                        </span>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: claim.status === 'Approved' ? 'var(--color-found-bg)' : '#fef3c7',
                            color: claim.status === 'Approved' ? 'var(--color-found)' : '#b45309',
                            border: `1px solid ${claim.status === 'Approved' ? 'var(--color-found-border)' : '#fde68a'}`
                          }}
                        >
                          {claim.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                        {new Date(claim.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      Item Claimed: {claim.itemTitle}
                    </h4>

                    <div style={{ backgroundColor: 'var(--color-bg-page)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.85rem' }}>
                      <strong>Your Stated Proof:</strong> {claim.ownershipProof}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Link to={`/item/${claim.itemId}`} className="btn btn-outline-primary btn-sm">
                        View Target Item Listing
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Report Modal Dialog */}
        {editingItem && (
          <div className="modal-overlay" onClick={() => setEditingItem(null)} role="dialog">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Edit Report: {editingItem.id}
                </h3>
              </div>
              <form onSubmit={handleSaveEdit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Item Title</label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Report Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="select-field"
                    >
                      <option value="Active">Active</option>
                      <option value="Possible Match">Possible Match</option>
                      <option value="Claim Pending">Claim Pending</option>
                      <option value="Returned">Returned / Reunited</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Handover / Pickup Location</label>
                    <input
                      type="text"
                      value={editFormData.handoverLocation}
                      onChange={(e) => setEditFormData({ ...editFormData, handoverLocation: e.target.value })}
                      placeholder="e.g. Central Library Reception"
                      className="input-field"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={3}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="textarea-field"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setEditingItem(null)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={Boolean(deletingId)}
          title="Delete Report"
          message="Are you sure you want to delete this report? This will remove the listing from local demonstration storage."
          confirmText="Yes, Delete Report"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />

        {/* Reset Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isResetDialogOpen}
          title="Restore Demo Sample Data"
          message="This will reset all reports, sample listings, and claims to the default 14 realistic college sample items."
          confirmText="Reset to Sample Listings"
          confirmVariant="primary"
          onConfirm={handleResetToDemo}
          onCancel={() => setIsResetDialogOpen(false)}
        />
      </div>
    </div>
  );
}
