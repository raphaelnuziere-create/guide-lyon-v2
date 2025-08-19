// Modèles de données Firebase pour Guide de Lyon

import { Timestamp } from 'firebase/firestore';

// User Model
export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'pro' | 'admin';
  subscription?: {
    type: 'free' | 'basic' | 'premium' | 'elite';
    startDate: Timestamp;
    endDate?: Timestamp;
    autoRenew: boolean;
  };
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    preferences?: {
      newsletter: boolean;
      newsletterFrequency?: 'daily' | 'weekly' | 'monthly';
      categories?: string[];
      notifications: boolean;
    };
  };
  gamification?: {
    points: number;
    level: number;
    badges: string[];
    achievements: string[];
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Place Model
export interface FirebasePlace {
  id?: string;
  name: string;
  slug: string;
  category: 'restaurant' | 'hotel' | 'bar' | 'culture' | 'shopping' | 'loisirs' | 'service';
  subCategory?: string;
  description: string;
  shortDescription?: string;
  images: string[];
  mainImage?: string;
  address: {
    street: string;
    zipCode: string;
    city: string;
    district: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  priceRange?: '€' | '€€' | '€€€' | '€€€€';
  features?: string[];
  amenities?: string[];
  rating?: {
    average: number;
    count: number;
  };
  featured: boolean;
  verified: boolean;
  status: 'draft' | 'published' | 'archived';
  ownerId?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  statistics?: {
    views: number;
    favorites: number;
    shares: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy?: string;
}

// Event Model
export interface FirebaseEvent {
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: 'concert' | 'exposition' | 'festival' | 'sport' | 'theatre' | 'conference' | 'autre';
  images: string[];
  mainImage?: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  startTime: string;
  endTime?: string;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    endDate?: Timestamp;
  };
  location: {
    name: string;
    address: string;
    district: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
    placeId?: string; // Référence à un lieu
  };
  organizer: {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  price?: {
    type: 'gratuit' | 'payant' | 'prix-libre';
    amount?: number;
    currency?: string;
    details?: string;
  };
  capacity?: number;
  currentReservations?: number;
  requiresRegistration: boolean;
  registrationUrl?: string;
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'cancelled' | 'postponed';
  visibility: {
    homepage: boolean;
    calendar: boolean;
    featured: boolean;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  statistics?: {
    views: number;
    registrations: number;
    shares: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy?: string;
}

// Article Model
export interface FirebaseArticle {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'actualites' | 'guide' | 'culture' | 'gastronomie' | 'lifestyle' | 'histoire';
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  images: string[];
  featuredImage?: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  publishedAt: Timestamp;
  readingTime?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  statistics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  relatedArticles?: string[];
  relatedPlaces?: string[];
  relatedEvents?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy?: string;
}

// Review Model
export interface FirebaseReview {
  id?: string;
  targetId: string;
  targetType: 'place' | 'event' | 'article';
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  visitDate?: Timestamp;
  verified: boolean;
  helpful: number;
  response?: {
    content: string;
    date: Timestamp;
    authorId: string;
    authorName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Newsletter Subscriber Model
export interface FirebaseSubscriber {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: {
    actualites: boolean;
    evenements: boolean;
    bonnesAdresses: boolean;
    offresSpeciales: boolean;
  };
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: Timestamp;
  unsubscribedAt?: Timestamp;
  lastEmailSent?: Timestamp;
  emailsSent?: number;
  source?: string;
  tags?: string[];
}

// Favorite Model
export interface FirebaseFavorite {
  id?: string;
  userId: string;
  targetId: string;
  targetType: 'place' | 'event' | 'article';
  createdAt: Timestamp;
}

// Contact/Lead Model
export interface FirebaseContact {
  id?: string;
  type: 'contact' | 'business-listing' | 'partnership' | 'other';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved' | 'spam';
  assignedTo?: string;
  notes?: string;
  source?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Analytics Event Model
export interface FirebaseAnalyticsEvent {
  id?: string;
  userId?: string;
  sessionId: string;
  eventType: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  eventValue?: number;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    os?: string;
    browser?: string;
  };
  location?: {
    country?: string;
    city?: string;
  };
  timestamp: Timestamp;
}