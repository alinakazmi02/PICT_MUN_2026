import { INITIAL_CLAIMS } from '../data/sampleListings';
import { itemsService } from './itemsService';

const CLAIMS_STORAGE_KEY = 'lost_and_found_claims_v2';

export const claimsService = {
  getAllClaims() {
    try {
      const stored = localStorage.getItem(CLAIMS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading claims from localStorage', e);
    }
    this.saveAllClaims(INITIAL_CLAIMS);
    return INITIAL_CLAIMS;
  },

  saveAllClaims(claims) {
    try {
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
    } catch (e) {
      console.error('Failed saving claims to localStorage', e);
    }
  },

  getClaimsByItemId(itemId) {
    const claims = this.getAllClaims();
    return claims.filter(c => c.itemId === itemId);
  },

  getUserClaims(userEmail = 'a.kazmi@campus.edu') {
    const claims = this.getAllClaims();
    return claims.filter(c => c.isDemoUser || c.claimantEmail === userEmail);
  },

  submitClaim({
    itemId,
    itemTitle,
    claimantName,
    claimantEmail,
    claimantPhone = '',
    ownershipProof,
    secretAnswer = ''
  }) {
    const claims = this.getAllClaims();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newClaim = {
      id: `CLM-2026-${randomSuffix}`,
      itemId,
      itemTitle,
      claimantName,
      claimantEmail,
      claimantPhone,
      ownershipProof,
      secretAnswer,
      status: 'Pending Review',
      submittedAt: new Date().toISOString(),
      isDemoUser: true
    };

    claims.unshift(newClaim);
    this.saveAllClaims(claims);

    // Update item status to 'Claim Pending' if it was Active
    const item = itemsService.getItemById(itemId);
    if (item && item.status === 'Active') {
      itemsService.updateReport(itemId, { status: 'Claim Pending' });
    }

    return newClaim;
  },

  updateClaimStatus(claimId, newStatus) {
    const claims = this.getAllClaims();
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      claim.status = newStatus;
      this.saveAllClaims(claims);

      // If approved, optionally mark item as Returned
      if (newStatus === 'Approved') {
        itemsService.updateReport(claim.itemId, {
          status: 'Returned',
          handoverStatus: 'Handed Over to Owner'
        });
      }
      return claim;
    }
    return null;
  }
};
