export type UserRole = 'bride' | 'groom' | 'vendor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  weddingId?: string; // If couple
  vendorId?: string; // If vendor
  status?: 'active' | 'banned' | 'pending';
  joinedAt?: string;
}

// --- ADMIN TYPES ---

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface AdminStats {
  totalWeddings: number;
  activeUsers: number;
  totalRevenue: number;
  pendingVendors: number;
  openTickets: number;
  userGrowth: { name: string; users: number }[];
  categoryDistribution: { name: string; value: number }[];
}

// --- GUEST MANAGEMENT TYPES ---

export type Side = 'bride' | 'groom';
export type RsvpStatus = 'pending' | 'attending' | 'declined';
export type GroupType = 'family' | 'friends' | 'colleagues' | 'other';
export type MealPreference = 'meat' | 'fish' | 'vegetarian' | 'vegan' | 'other';

export interface ChildDetail {
  name: string;
  age: number;
}

export interface Guest {
  id: string;
  weddingId: string;
  side: Side;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  relationship?: string; // e.g., "Cousin", "Friend"
  group: GroupType;
  plusOneAllowed: boolean;
  rsvpStatus: RsvpStatus;
  mealPreference?: MealPreference;
  dietaryRestrictions?: string;
  plusOneName?: string;
  childrenCount: number;
  childrenDetails?: ChildDetail[];
  tableId?: string; // Changed from table number to UUID
  rsvpToken: string; // Unique link ID
  updatedAt?: Date;
  // Post Wedding
  giftReceived?: string;
  thankYouSent?: boolean;
}

export interface GuestStats {
  total: number;
  attending: number;
  declined: number;
  pending: number;
  brideSide: { total: number; attending: number };
  groomSide: { total: number; attending: number };
  meals: Record<MealPreference, number>;
  childrenTotal: number;
}

// --- SEATING CHART TYPES ---

export type TableShape = 'round' | 'rectangular' | 'head';

export interface Table {
  id: string;
  name: string;
  shape: TableShape;
  capacity: number;
  x: number;
  y: number;
}

export interface SeatingConflict {
  id: string;
  guest1Id: string;
  guest2Id: string;
  reason: string;
}

// --- VENDOR MARKETPLACE TYPES ---

export type VendorCategory = 'Venue' | 'Catering' | 'Photography' | 'Videography' | 'Flowers' | 'Music' | 'Cake' | 'Makeup' | 'Attire' | 'Transport' | 'Other';

export interface VendorProfile {
  id: string;
  businessName: string;
  category: VendorCategory;
  description: string;
  city: string;
  priceRange: string; // e.g. "5000-10000 TL"
  rating: number;
  reviewCount: number;
  images: string[];
  responseTime: string; // "2 hours"
  features: string[]; // "Wifi", "Parking"
  contactEmail: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected'; // Added for Admin
}

export interface ServiceRequest {
  id: string;
  userId: string;
  category: VendorCategory;
  title: string;
  description: string;
  date: string;
  location: string;
  guestCount: number;
  budget: string;
  status: 'open' | 'closed';
  createdAt: string;
  bidsCount: number;
}

export interface VendorBid {
  id: string;
  requestId: string;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  amount: number;
  currency: string;
  packageName: string;
  description: string; // What's included
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

// --- TIMELINE & TASK TYPES ---

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskAssignee = 'bride' | 'groom' | 'both' | 'family';
export type TaskCategory = 'Venue' | 'Attire' | 'Vendors' | 'Guests' | 'Legal' | 'Other';

export interface Task {
  id: string;
  weddingId: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  assignedTo: TaskAssignee;
  status: TaskStatus;
  description?: string;
  completedAt?: string;
  isCustom?: boolean;
}

export interface WeddingDayEvent {
  id: string;
  weddingId: string;
  time: string; // HH:mm
  endTime?: string; // HH:mm
  title: string;
  location?: string;
  description?: string;
  involvedParties: string[]; // e.g., ['photographer', 'bride']
  icon?: string; // Lucide icon name
  status?: 'upcoming' | 'now' | 'completed'; // Dynamic status
}

// --- CREATIVE STUDIO TYPES ---

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[]; // Hex codes
  tags: string[];
}

export interface MoodBoardItem {
  id: string;
  imageUrl: string;
  category: 'Ceremony' | 'Reception' | 'Attire' | 'Flowers' | 'Cake' | 'Other';
  note?: string;
  likes: number;
}

export type DesignStyle = 'Bohemian' | 'Classic' | 'Modern' | 'Rustic' | 'Luxury' | 'Garden';

export interface AiRenderResult {
  id: string;
  originalUrl: string;
  renderedUrl: string;
  style: DesignStyle;
  paletteName: string;
  createdAt: string;
}

// --- WEDDING WEBSITE TYPES ---

export type WebsitePageType = 'home' | 'story' | 'events' | 'travel' | 'rsvp' | 'faq' | 'photos';

export interface WebsiteTheme {
  id: string;
  name: string;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string; 
  layout: 'classic' | 'modern' | 'minimal' | 'floral';
  backgroundImage?: string;
}

export interface WebsitePage {
  id: string;
  type: WebsitePageType;
  title: string;
  content: string; // Markdown or plain text
  isEnabled: boolean;
  order: number;
  images?: string[]; // For gallery or specific page images
  meta?: Record<string, any>; // Flexible storage for location, dates etc
}

export interface WebsiteFaq {
  id: string;
  question: string;
  answer: string;
}

export interface WeddingWebsite {
  id: string;
  weddingId: string;
  subdomain: string;
  customDomain?: string;
  heroImageUrl: string;
  welcomeMessage: string;
  coupleNames: string;
  weddingDate: string;
  theme: WebsiteTheme;
  pages: WebsitePage[];
  faqs: WebsiteFaq[];
  isPublished: boolean;
  visitCount: number;
}

// --- WEDDING DAY & POST WEDDING TYPES ---

export type CheckinStatus = 'pending' | 'arrived' | 'late' | 'no_show';

export interface VendorCheckin {
  id: string;
  vendorName: string;
  role: string;
  scheduledTime: string; // HH:mm
  actualTime?: string;
  status: CheckinStatus;
  contactPhone: string;
}

export interface EmergencyGuideItem {
  id: string;
  title: string;
  solution: string;
  icon?: string;
}

export interface VendorReview {
  id: string;
  vendorId: string;
  vendorName: string;
  rating: number; // 1-5
  subRatings: { quality: number; punctuality: number; communication: number; value: number };
  text: string;
  date: string;
}

export interface WeddingPhoto {
  id: string;
  url: string;
  type: 'photo' | 'video';
  uploadedBy: 'vendor' | 'guest';
}

// --- AI / ARIA TYPES ---

export interface AiInsight {
  id: string;
  type: 'reminder' | 'anxiety' | 'decision' | 'budget' | 'timeline';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionView?: View; // Navigation target
  isDismissed: boolean;
}

// --- EXISTING TYPES ---

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  priceRange: string;
}

export interface Bid {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  TIMELINE = 'TIMELINE',
  GUESTS = 'GUESTS',
  SEATING = 'SEATING',
  VENDORS = 'VENDORS',
  BUDGET = 'BUDGET',
  DESIGN = 'DESIGN',
  WEBSITE = 'WEBSITE',
  WEDDING_DAY = 'WEDDING_DAY',
  POST_WEDDING = 'POST_WEDDING',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN' // Added
}

export interface WeddingDetails {
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  priorities: string[];
  styles: string[];
  culture: string;
  partnerEmail?: string;
}

export interface VendorOnboardingDetails {
  businessName: string;
  category: string;
  city: string;
  priceRange: string;
  description: string;
}

export interface BudgetCategory {
  id: string;
  name: string; 
  allocated: number;
  spent: number;
  notes?: string;
  isPaid?: boolean;
}

export interface VendorPayment {
  id: string;
  vendorName: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  type: 'deposit' | 'final' | 'installment';
}

export interface BudgetAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
}

export interface ScenarioResult {
  category: string;
  currentCost: number;
  projectedCost: number;
  difference: number;
}