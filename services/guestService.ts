import { Guest, GuestStats, Side, GroupType, MealPreference } from '../types';

// Mock Data
export const MOCK_GUESTS: Guest[] = [
  { 
    id: '1', weddingId: 'w1', side: 'bride', fullName: 'Fatima Yilmaz', group: 'family', 
    relationship: 'Aunt', plusOneAllowed: true, rsvpStatus: 'attending', 
    mealPreference: 'meat', childrenCount: 2, childrenDetails: [{name: 'Ali', age: 5}, {name: 'Ayse', age: 3}],
    email: 'fatima@example.com', rsvpToken: 'abc1' 
  },
  { 
    id: '2', weddingId: 'w1', side: 'groom', fullName: 'John Smith', group: 'friends', 
    relationship: 'College Friend', plusOneAllowed: true, rsvpStatus: 'pending', 
    childrenCount: 0, rsvpToken: 'abc2' 
  },
  { 
    id: '3', weddingId: 'w1', side: 'bride', fullName: 'Mehmet Demir', group: 'colleagues', 
    relationship: 'Boss', plusOneAllowed: false, rsvpStatus: 'declined', 
    childrenCount: 0, rsvpToken: 'abc3' 
  },
  { 
    id: '4', weddingId: 'w1', side: 'groom', fullName: 'Sarah Jones', group: 'family', 
    relationship: 'Cousin', plusOneAllowed: true, rsvpStatus: 'attending', 
    mealPreference: 'vegetarian', childrenCount: 0, plusOneName: 'Mike Jones',
    rsvpToken: 'abc4' 
  },
  { 
    id: '5', weddingId: 'w1', side: 'bride', fullName: 'Elif Kaya', group: 'friends', 
    relationship: 'Best Friend', plusOneAllowed: true, rsvpStatus: 'attending', 
    mealPreference: 'fish', dietaryRestrictions: 'Gluten Free', childrenCount: 0,
    rsvpToken: 'abc5' 
  },
];

export const calculateStats = (guests: Guest[]): GuestStats => {
  const stats: GuestStats = {
    total: guests.length,
    attending: 0,
    declined: 0,
    pending: 0,
    brideSide: { total: 0, attending: 0 },
    groomSide: { total: 0, attending: 0 },
    meals: { meat: 0, fish: 0, vegetarian: 0, vegan: 0, other: 0 },
    childrenTotal: 0
  };

  guests.forEach(g => {
    // Status Counts
    if (g.rsvpStatus === 'attending') stats.attending++;
    else if (g.rsvpStatus === 'declined') stats.declined++;
    else stats.pending++;

    // Side Counts
    if (g.side === 'bride') {
      stats.brideSide.total++;
      if (g.rsvpStatus === 'attending') stats.brideSide.attending++;
    } else {
      stats.groomSide.total++;
      if (g.rsvpStatus === 'attending') stats.groomSide.attending++;
    }

    // Meal Counts (only if attending)
    if (g.rsvpStatus === 'attending' && g.mealPreference) {
      stats.meals[g.mealPreference]++;
      // Add plus one meal if name exists (simple assumption: same meal or default)
      if (g.plusOneName) stats.meals[g.mealPreference]++; 
    }

    // Children
    if (g.rsvpStatus === 'attending') {
      stats.childrenTotal += g.childrenCount;
    }
  });

  return stats;
};

export const parseCSV = async (file: File): Promise<Partial<Guest>[]> => {
  // Simulating CSV parsing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock result of parsed CSV
      resolve([
        { fullName: 'New Guest 1', side: 'bride', group: 'friends', email: 'test1@example.com' },
        { fullName: 'New Guest 2', side: 'groom', group: 'colleagues', email: 'test2@example.com' },
      ]);
    }, 1000);
  });
};

export const generateRSVPLink = (token: string) => {
  return `${window.location.origin}/rsvp/${token}`;
};
