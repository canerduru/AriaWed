import { WeddingWebsite, WebsiteTheme, WebsitePage, WebsiteFaq } from '../types';

export const MOCK_THEMES: WebsiteTheme[] = [
  {
    id: 'theme-modern',
    name: 'Modern Minimal',
    fontHeading: 'Inter, sans-serif',
    fontBody: 'Inter, sans-serif',
    primaryColor: '#1e293b', // Slate 800
    secondaryColor: '#94a3b8', // Slate 400
    backgroundColor: '#ffffff',
    layout: 'minimal'
  },
  {
    id: 'theme-floral',
    name: 'Romantic Floral',
    fontHeading: 'Playfair Display, serif',
    fontBody: 'Lato, sans-serif',
    primaryColor: '#e11d48', // Rose 600
    secondaryColor: '#fecdd3', // Rose 200
    backgroundColor: '#fff1f2',
    layout: 'floral',
    backgroundImage: 'https://img.freepik.com/free-vector/hand-drawn-floral-background_23-2148123566.jpg?w=1380&t=st=1690000000~exp=1690000600~hmac=xyz' // Placeholder
  },
  {
    id: 'theme-rustic',
    name: 'Rustic Barn',
    fontHeading: 'Cinzel, serif',
    fontBody: 'Open Sans, sans-serif',
    primaryColor: '#78350f', // Amber 900
    secondaryColor: '#d97706', // Amber 600
    backgroundColor: '#fffbeb', // Amber 50
    layout: 'classic'
  },
  {
    id: 'theme-classic',
    name: 'Timeless Classic',
    fontHeading: 'Merriweather, serif',
    fontBody: 'Merriweather Sans, sans-serif',
    primaryColor: '#334155', // Slate 700
    secondaryColor: '#cbd5e1', // Slate 300
    backgroundColor: '#f8fafc', // Slate 50
    layout: 'classic'
  }
];

const DEFAULT_PAGES: WebsitePage[] = [
  {
    id: 'page-home',
    type: 'home',
    title: 'Welcome',
    content: 'We are so excited to celebrate our special day with our family and friends.',
    isEnabled: true,
    order: 1
  },
  {
    id: 'page-story',
    type: 'story',
    title: 'Our Story',
    content: 'It all started at a coffee shop in Istanbul...',
    isEnabled: true,
    order: 2,
    images: ['https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'page-events',
    type: 'events',
    title: 'Events',
    content: 'Ceremony and Reception details.',
    isEnabled: true,
    order: 3,
    meta: {
      ceremonyTime: '15:30',
      ceremonyLocation: 'Royal Garden Bosphorus',
      receptionTime: '17:30',
      receptionLocation: 'Royal Garden Ballroom'
    }
  },
  {
    id: 'page-travel',
    type: 'travel',
    title: 'Travel & Stay',
    content: 'For our out-of-town guests, we have reserved a block of rooms.',
    isEnabled: true,
    order: 4
  },
  {
    id: 'page-rsvp',
    type: 'rsvp',
    title: 'RSVP',
    content: 'Please let us know if you can make it.',
    isEnabled: true,
    order: 5
  },
  {
    id: 'page-faq',
    type: 'faq',
    title: 'Q & A',
    content: '',
    isEnabled: true,
    order: 6
  }
];

const DEFAULT_FAQS: WebsiteFaq[] = [
  { id: 'faq-1', question: 'What is the dress code?', answer: 'The dress code is Black Tie Optional.' },
  { id: 'faq-2', question: 'Are kids welcome?', answer: 'We love your kids—we really do. But we want our wedding to be your night off!' },
  { id: 'faq-3', question: 'Is there parking?', answer: 'Yes, valet parking is provided at the venue.' }
];

export const MOCK_WEBSITE: WeddingWebsite = {
  id: 'web-1',
  weddingId: 'w1',
  subdomain: 'sarah-james',
  heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  welcomeMessage: 'We\'re getting married!',
  coupleNames: 'Sarah & James',
  weddingDate: '2024-09-24',
  theme: MOCK_THEMES[1], // Default to Floral
  pages: DEFAULT_PAGES,
  faqs: DEFAULT_FAQS,
  isPublished: false,
  visitCount: 42
};

export const updateWebsite = (
  current: WeddingWebsite, 
  updates: Partial<WeddingWebsite>
): WeddingWebsite => {
  return { ...current, ...updates };
};
