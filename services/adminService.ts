import { AdminStats, User, VendorProfile, SupportTicket } from '../types';
import { MOCK_VENDOR_PROFILES } from './vendorService';

export const getAdminStats = (): AdminStats => {
  return {
    totalWeddings: 1240,
    activeUsers: 856,
    totalRevenue: 452000,
    pendingVendors: 5,
    openTickets: 12,
    userGrowth: [
      { name: 'Jan', users: 120 },
      { name: 'Feb', users: 200 },
      { name: 'Mar', users: 350 },
      { name: 'Apr', users: 500 },
      { name: 'May', users: 680 },
      { name: 'Jun', users: 856 },
    ],
    categoryDistribution: [
      { name: 'Venue', value: 35 },
      { name: 'Photo', value: 25 },
      { name: 'Catering', value: 20 },
      { name: 'Music', value: 10 },
      { name: 'Decor', value: 10 },
    ]
  };
};

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah & James', email: 'sarah@example.com', role: 'bride', status: 'active', joinedAt: '2024-01-15' },
  { id: 'u2', name: 'Ahmet & Ayse', email: 'ahmet@example.com', role: 'groom', status: 'active', joinedAt: '2024-02-20' },
  { id: 'u3', name: 'Suspicious User', email: 'spam@bot.com', role: 'vendor', status: 'banned', joinedAt: '2024-05-01' },
  { id: 'u4', name: 'Elif Yilmaz', email: 'elif@gmail.com', role: 'bride', status: 'active', joinedAt: '2024-03-10' },
  { id: 'u5', name: 'Mehmet Demir', email: 'mehmet@yahoo.com', role: 'groom', status: 'active', joinedAt: '2024-04-05' },
];

export const MOCK_PENDING_VENDORS: VendorProfile[] = [
  {
    id: 'pv1',
    businessName: 'Bosphorus Beats DJ',
    category: 'Music',
    description: 'Premier DJ services for Istanbul weddings.',
    city: 'Istanbul',
    priceRange: '15,000 TL',
    rating: 0,
    reviewCount: 0,
    images: ['https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=400&q=80'],
    responseTime: '2 hours',
    features: ['Sound', 'Lighting'],
    contactEmail: 'dj@beats.com',
    verificationStatus: 'pending'
  },
  {
    id: 'pv2',
    businessName: 'Elegant Events Catering',
    category: 'Catering',
    description: 'Luxury catering for large events.',
    city: 'Ankara',
    priceRange: '2,000 TL/head',
    rating: 0,
    reviewCount: 0,
    images: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80'],
    responseTime: '4 hours',
    features: ['Full Service'],
    contactEmail: 'info@elegant.com',
    verificationStatus: 'pending'
  }
];

export const MOCK_TICKETS: SupportTicket[] = [
  { id: 't1', userId: 'u1', userName: 'Sarah', subject: 'Refund Request', description: 'I need to cancel my subscription.', status: 'open', priority: 'high', createdAt: '2024-06-01' },
  { id: 't2', userId: 'v1', userName: 'Royal Garden', subject: 'Profile Update', description: 'Cannot update my cover photo.', status: 'in_progress', priority: 'medium', createdAt: '2024-06-02' },
  { id: 't3', userId: 'u4', userName: 'Elif', subject: 'Guest List Import', description: 'CSV upload is failing.', status: 'resolved', priority: 'low', createdAt: '2024-05-28' },
];
