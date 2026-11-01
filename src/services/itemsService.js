import { INITIAL_LISTINGS } from '../data/sampleListings';

const STORAGE_KEY = 'lost_and_found_listings_v2';

export const itemsService = {
  // Get all items from localStorage or seed initial data
  getAllItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading from localStorage', e);
    }
    // Initialize with sample listings
    this.saveAllItems(INITIAL_LISTINGS);
    return INITIAL_LISTINGS;
  },

  saveAllItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  },

  // Reset to original demo sample listings
  resetToSampleData() {
    this.saveAllItems(INITIAL_LISTINGS);
    return INITIAL_LISTINGS;
  },

  // Get item by ID
  getItemById(id) {
    const items = this.getAllItems();
    const item = items.find(i => i.id === id);
    if (item) {
      // Increment view count
      item.views = (item.views || 0) + 1;
      this.saveAllItems(items);
      return item;
    }
    return null;
  },

  // Filter and sort listings
  getListings({
    keyword = '',
    type = 'all', // 'all' | 'lost' | 'found'
    category = 'all',
    location = 'all',
    dateRange = 'all', // 'all' | 'today' | '3days' | 'week' | 'month'
    sortBy = 'newest', // 'newest' | 'oldest' | 'most-viewed'
    status = 'all'
  } = {}) {
    let items = this.getAllItems();

    // Type filter (Lost / Found)
    if (type && type !== 'all') {
      items = items.filter(i => i.type.toLowerCase() === type.toLowerCase());
    }

    // Category filter
    if (category && category !== 'all') {
      items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }

    // Location filter
    if (location && location !== 'all') {
      items = items.filter(i => i.location.toLowerCase() === location.toLowerCase());
    }

    // Status filter
    if (status && status !== 'all') {
      items = items.filter(i => i.status.toLowerCase() === status.toLowerCase());
    }

    // Keyword search across title, description, brand, color, location
    if (keyword && keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      items = items.filter(i => {
        return (
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          (i.brand && i.brand.toLowerCase().includes(q)) ||
          (i.color && i.color.toLowerCase().includes(q)) ||
          (i.location && i.location.toLowerCase().includes(q)) ||
          (i.category && i.category.toLowerCase().includes(q)) ||
          (i.distinguishingFeatures && i.distinguishingFeatures.toLowerCase().includes(q))
        );
      });
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date('2026-10-18T16:30:00Z').getTime(); // anchored to current campus date
      items = items.filter(i => {
        const itemDate = new Date(i.date || i.createdAt).getTime();
        const diffHours = (now - itemDate) / (1000 * 60 * 60);

        if (dateRange === 'today') return diffHours <= 24;
        if (dateRange === '3days') return diffHours <= 72;
        if (dateRange === 'week') return diffHours <= 168;
        if (dateRange === 'month') return diffHours <= 720;
        return true;
      });
    }

    // Sorting
    items.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
      }
      if (sortBy === 'most-viewed') {
        return (b.views || 0) - (a.views || 0);
      }
      // default newest
      return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
    });

    return items;
  },

  // Create a new Lost Item report
  createLostReport(reportData) {
    const items = this.getAllItems();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `LF-LOST-2026-${randomSuffix}`;

    const newReport = {
      id: newId,
      type: 'lost',
      title: reportData.title,
      category: reportData.category,
      description: reportData.description,
      brand: reportData.brand || '',
      color: reportData.color || '',
      distinguishingFeatures: reportData.distinguishingFeatures || '',
      date: reportData.date,
      time: reportData.time || 'Not specified',
      location: reportData.location,
      locationDetails: reportData.locationDetails || '',
      referenceDetails: reportData.referenceDetails || '',
      status: 'Active',
      images: reportData.images && reportData.images.length > 0
        ? reportData.images
        : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
      reporter: {
        name: reportData.reporterName,
        email: reportData.reporterEmail,
        contactPreference: reportData.contactPreference || 'In-app Claim',
        phone: reportData.reporterPhone || ''
      },
      createdAt: new Date().toISOString(),
      views: 1,
      isDemoUser: true
    };

    items.unshift(newReport);
    this.saveAllItems(items);
    return newReport;
  },

  // Create a new Found Item report
  createFoundReport(reportData) {
    const items = this.getAllItems();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `LF-FOUND-2026-${randomSuffix}`;

    const newReport = {
      id: newId,
      type: 'found',
      title: reportData.title,
      category: reportData.category,
      description: reportData.description,
      brand: reportData.brand || '',
      color: reportData.color || '',
      distinguishingFeatures: reportData.distinguishingFeatures || '',
      secretDetail: reportData.secretDetail || '',
      date: reportData.date,
      time: reportData.time || 'Not specified',
      location: reportData.location,
      locationDetails: reportData.locationDetails || '',
      status: 'Active',
      handoverStatus: reportData.handoverStatus || 'Currently With Finder',
      handoverLocation: reportData.handoverLocation || 'Held safely by finder on campus',
      images: reportData.images && reportData.images.length > 0
        ? reportData.images
        : ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'],
      finder: {
        name: reportData.finderName,
        email: reportData.finderEmail,
        contactPreference: reportData.contactPreference || 'In-app Claim'
      },
      createdAt: new Date().toISOString(),
      views: 1,
      isDemoUser: true
    };

    items.unshift(newReport);
    this.saveAllItems(items);
    return newReport;
  },

  // Update existing report
  updateReport(id, updatedFields) {
    const items = this.getAllItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      this.saveAllItems(items);
      return items[index];
    }
    return null;
  },

  // Delete report
  deleteReport(id) {
    let items = this.getAllItems();
    const initialLen = items.length;
    items = items.filter(i => i.id !== id);
    if (items.length !== initialLen) {
      this.saveAllItems(items);
      return true;
    }
    return false;
  },

  // Calculate live statistics
  getStats() {
    const items = this.getAllItems();
    const totalReports = items.length;
    const activeListings = items.filter(i => i.status === 'Active' || i.status === 'Possible Match').length;
    const itemsReunited = items.filter(i => i.status === 'Returned' || i.handoverStatus === 'Handed Over to Owner').length;
    const lostCount = items.filter(i => i.type === 'lost').length;
    const foundCount = items.filter(i => i.type === 'found').length;

    return {
      totalReports,
      activeListings,
      itemsReunited,
      lostCount,
      foundCount
    };
  },

  // Get user reports (for current demo user)
  getUserReports(userEmail = 'a.kazmi@campus.edu') {
    const items = this.getAllItems();
    return items.filter(i => {
      if (i.isDemoUser) return true;
      if (i.reporter && i.reporter.email === userEmail) return true;
      if (i.finder && i.finder.email === userEmail) return true;
      return false;
    });
  }
};
