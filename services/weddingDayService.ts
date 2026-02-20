import { VendorCheckin, EmergencyGuideItem, WeddingPhoto, VendorReview } from '../types';

export const MOCK_VENDOR_CHECKINS: VendorCheckin[] = [
  { id: 'vc1', vendorName: 'Dreamy Lens Studio', role: 'Photographer', scheduledTime: '09:00', status: 'arrived', actualTime: '08:45', contactPhone: '+90 555 111 2233' },
  { id: 'vc2', vendorName: 'Velvet Petals', role: 'Florist', scheduledTime: '10:00', status: 'pending', contactPhone: '+90 555 444 5566' },
  { id: 'vc3', vendorName: 'Glam Squad', role: 'Makeup Artist', scheduledTime: '08:00', status: 'arrived', actualTime: '08:00', contactPhone: '+90 555 777 8899' },
  { id: 'vc4', vendorName: 'DJ Kaan', role: 'DJ', scheduledTime: '16:00', status: 'pending', contactPhone: '+90 555 999 0000' },
  { id: 'vc5', vendorName: 'Golden Spoon', role: 'Catering', scheduledTime: '14:00', status: 'late', contactPhone: '+90 555 222 3344' },
];

export const EMERGENCY_GUIDE: EmergencyGuideItem[] = [
  { id: 'em1', title: 'Wine Stain on Dress', solution: 'Dab (do not rub) with white cloth. Apply club soda or white wine. Cover with chalk or baby powder if stain persists.' },
  { id: 'em2', title: 'Broken Zipper', solution: 'Rub candle wax or soap on teeth. If stuck, use safety pins from emergency kit to close from inside.' },
  { id: 'em3', title: 'Vendor No-Show', solution: 'Check contract for backup contact. Call the venue coordinator immediately. Check the Quick Contact list for alternatives.' },
  { id: 'em4', title: 'Unexpected Rain', solution: 'Coordinate with Venue Manager to move cocktail hour indoors. Distribute umbrellas from the "Plan B" box.' },
  { id: 'em5', title: 'Guest Feeling Unwell', solution: 'Escort to quiet room. First aid kit is with the Wedding Planner. Nearest hospital: Acibadem Maslak (10 mins).' },
];

export const MOCK_PHOTOS: WeddingPhoto[] = [
  { id: 'ph1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', type: 'photo', uploadedBy: 'vendor' },
  { id: 'ph2', url: 'https://images.unsplash.com/photo-1511285560982-1356c11d4606?auto=format&fit=crop&w=800&q=80', type: 'photo', uploadedBy: 'vendor' },
  { id: 'ph3', url: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=800&q=80', type: 'photo', uploadedBy: 'guest' },
  { id: 'ph4', url: 'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?auto=format&fit=crop&w=800&q=80', type: 'photo', uploadedBy: 'vendor' },
];

export const MOCK_REVIEWS: VendorReview[] = [
  { 
    id: 'rev1', vendorId: 'v1', vendorName: 'Royal Garden Venue', rating: 5, 
    subRatings: { quality: 5, punctuality: 5, communication: 5, value: 4 },
    text: "Absolutely stunning venue. The staff was incredibly helpful throughout the night.",
    date: '2024-09-26' 
  },
  { 
    id: 'rev2', vendorId: 'v3', vendorName: 'Dreamy Lens Studio', rating: 4, 
    subRatings: { quality: 5, punctuality: 4, communication: 4, value: 5 },
    text: "Photos are amazing! They were 15 mins late but made up for it by staying late.",
    date: '2024-09-28' 
  }
];

export const EMERGENCY_KIT_CHECKLIST = [
  "Safety Pins", "Sewing Kit", "Stain Remover Pen", "Double-sided Tape", 
  "Bobby Pins", "Hairspray", "Deodorant", "Mints", "Pain Relievers", 
  "Band-aids", "Tissues", "Phone Charger", "Scissors", "Lint Roller"
];

// Helper to determine event status based on current mock time
export const getEventStatus = (eventTime: string, currentTime: string): 'upcoming' | 'now' | 'completed' => {
  // Simple string comparison for HH:mm format works if 24h
  if (eventTime < currentTime) return 'completed';
  
  // If within 30 mins
  const [h1, m1] = eventTime.split(':').map(Number);
  const [h2, m2] = currentTime.split(':').map(Number);
  const diffMinutes = (h1 * 60 + m1) - (h2 * 60 + m2);
  
  if (diffMinutes >= 0 && diffMinutes <= 30) return 'now';
  return 'upcoming';
};
