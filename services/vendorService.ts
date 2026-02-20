import { VendorProfile, ServiceRequest, VendorBid, VendorCategory } from '../types';

// Mock Vendors
export const MOCK_VENDOR_PROFILES: VendorProfile[] = [
  {
    id: 'v1',
    businessName: 'Royal Garden Bosphorus',
    category: 'Venue',
    description: 'A stunning waterfront venue with historical architecture and modern amenities. Perfect for luxury weddings.',
    city: 'Istanbul',
    priceRange: '150,000 TL+',
    rating: 4.9,
    reviewCount: 128,
    images: ['https://picsum.photos/400/300?random=101', 'https://picsum.photos/400/300?random=102'],
    responseTime: '1 hour',
    features: ['Waterfront', 'Valet Parking', 'Bridal Suite', 'In-house Catering'],
    contactEmail: 'info@royalgarden.com'
  },
  {
    id: 'v2',
    businessName: 'Golden Spoon Catering',
    category: 'Catering',
    description: 'Award-winning catering service specializing in Ottoman and Mediterranean fusion cuisine.',
    city: 'Istanbul',
    priceRange: '1,500 TL/person',
    rating: 4.8,
    reviewCount: 85,
    images: ['https://picsum.photos/400/300?random=103', 'https://picsum.photos/400/300?random=104'],
    responseTime: '3 hours',
    features: ['Halal Certified', 'Custom Menus', 'Tasting Available'],
    contactEmail: 'hello@goldenspoon.com'
  },
  {
    id: 'v3',
    businessName: 'Dreamy Lens Studio',
    category: 'Photography',
    description: 'Capturing the raw emotions and candid moments of your special day. Cinematic style editing.',
    city: 'Ankara',
    priceRange: '25,000 TL',
    rating: 4.7,
    reviewCount: 42,
    images: ['https://picsum.photos/400/300?random=105', 'https://picsum.photos/400/300?random=106'],
    responseTime: '5 hours',
    features: ['Drone', '2 Shooters', 'Online Gallery', 'Album Included'],
    contactEmail: 'contact@dreamylens.com'
  },
  {
    id: 'v4',
    businessName: 'Velvet Petals Florist',
    category: 'Flowers',
    description: 'Bespoke floral arrangements for weddings and events. We source the freshest seasonal blooms.',
    city: 'Izmir',
    priceRange: '15,000 TL',
    rating: 4.9,
    reviewCount: 64,
    images: ['https://picsum.photos/400/300?random=107', 'https://picsum.photos/400/300?random=108'],
    responseTime: '2 hours',
    features: ['Sustainable Sourcing', 'Setup & Breakdown', 'Mockups'],
    contactEmail: 'bloom@velvetpetals.com'
  },
  {
    id: 'v5',
    businessName: 'DJ Kaan Live',
    category: 'Music',
    description: 'Experienced wedding DJ and MC. I keep the dance floor full all night with a mix of Turkish and International hits.',
    city: 'Istanbul',
    priceRange: '10,000 TL',
    rating: 4.6,
    reviewCount: 110,
    images: ['https://picsum.photos/400/300?random=109'],
    responseTime: '12 hours',
    features: ['Sound System', 'Lighting', 'Custom Playlist'],
    contactEmail: 'djkaan@music.com'
  }
];

// Mock Service Requests (Created by the Couple)
export const MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: 'r1',
    userId: 'u1',
    category: 'Photography',
    title: 'Photographer for Outdoor Wedding',
    description: 'We are looking for a photographer for our garden wedding in September. We prefer candid shots over posed ones. 8 hours of coverage needed.',
    date: '2024-09-24',
    location: 'Istanbul, Sarıyer',
    guestCount: 150,
    budget: '20,000 - 30,000 TL',
    status: 'open',
    createdAt: '2024-05-10',
    bidsCount: 3
  },
  {
    id: 'r2',
    userId: 'u1',
    category: 'Catering',
    title: 'Dinner Service for 150 Guests',
    description: 'Sit-down dinner service. We need a mix of meat and vegetarian options. Appetizers for cocktail hour included.',
    date: '2024-09-24',
    location: 'Istanbul',
    guestCount: 150,
    budget: '200,000 TL',
    status: 'open',
    createdAt: '2024-05-12',
    bidsCount: 1
  }
];

// Mock Bids for Request r1 (Photography)
export const MOCK_BIDS: VendorBid[] = [
  {
    id: 'b1',
    requestId: 'r1',
    vendorId: 'v3',
    vendorName: 'Dreamy Lens Studio',
    vendorRating: 4.7,
    amount: 25000,
    currency: 'TL',
    packageName: 'Gold Wedding Package',
    description: 'Full day coverage (10 hours), 2 photographers, drone shots for venue, 500 edited photos, online gallery within 4 weeks.',
    timeline: '4 weeks',
    status: 'pending',
    submittedAt: '2024-05-11'
  },
  {
    id: 'b2',
    requestId: 'r1',
    vendorId: 'v99',
    vendorName: 'Urban Stories Photo',
    vendorRating: 4.5,
    amount: 22000,
    currency: 'TL',
    packageName: 'Standard Coverage',
    description: '8 hours coverage, 1 photographer + 1 assistant. 400 edited photos on USB drive.',
    timeline: '6 weeks',
    status: 'pending',
    submittedAt: '2024-05-12'
  },
  {
    id: 'b3',
    requestId: 'r1',
    vendorId: 'v98',
    vendorName: 'Lux Weddings TR',
    vendorRating: 4.9,
    amount: 35000,
    currency: 'TL',
    packageName: 'Premium Cinema Package',
    description: '12 hours coverage, 2 photographers, 1 videographer. Highlight reel included. 30x60 Panorama Album.',
    timeline: '3 weeks',
    status: 'pending',
    submittedAt: '2024-05-13'
  }
];

// Helper Functions
export const getVendors = (category?: string, search?: string) => {
  let result = MOCK_VENDOR_PROFILES;
  if (category && category !== 'All') {
    result = result.filter(v => v.category === category);
  }
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(v => 
      v.businessName.toLowerCase().includes(term) || 
      v.description.toLowerCase().includes(term) ||
      v.city.toLowerCase().includes(term)
    );
  }
  return result;
};

export const getBidsForRequest = (requestId: string) => {
  return MOCK_BIDS.filter(b => b.requestId === requestId);
};

export const getRequestById = (id: string) => {
  return MOCK_REQUESTS.find(r => r.id === id);
};
