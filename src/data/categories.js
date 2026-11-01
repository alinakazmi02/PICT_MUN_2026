export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'id-cards', name: 'ID Cards and Documents', icon: 'CreditCard', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'bags-wallets', name: 'Bags and Wallets', icon: 'Briefcase', color: '#D97706', bg: '#FFFBEB' },
  { id: 'books-stationery', name: 'Books and Stationery', icon: 'BookOpen', color: '#059669', bg: '#ECFDF5' },
  { id: 'clothing-accessories', name: 'Clothing and Accessories', icon: 'Shirt', color: '#DB2777', bg: '#FDF2F8' },
  { id: 'keys', name: 'Keys', icon: 'Key', color: '#EA580C', bg: '#FFF7ED' },
  { id: 'bottles-lunchboxes', name: 'Bottles and Lunch Boxes', icon: 'Coffee', color: '#0D9488', bg: '#F0FDFA' },
  { id: 'sports-equipment', name: 'Sports Equipment', icon: 'Trophy', color: '#4F46E5', bg: '#EEF2FF' },
  { id: 'jewellery-watches', name: 'Jewellery and Watches', icon: 'Watch', color: '#CA8A04', bg: '#FEFCE8' },
  { id: 'other', name: 'Other', icon: 'Package', color: '#475569', bg: '#F8FAFC' }
];

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name);

export const CAMPUS_LOCATIONS = [
  'Central Library',
  'Campus Canteen & Cafeteria',
  'Main Administration Building',
  'Sports Complex & Grounds',
  'Science & Engineering Labs',
  'Lecture Hall Complex',
  'Student Common Room',
  'Main Auditorium',
  'Campus Entrance Gate 1',
  'Security Desk Gate 2',
  'Computer & Tech Center',
  'Seminar Hall B'
];

export const HANDOVER_LOCATIONS = [
  'Currently With Finder',
  'Submitted to College Office',
  'Handed Over to Owner',
  'Campus Security Gate 1 Desk',
  'Central Library Reception'
];
