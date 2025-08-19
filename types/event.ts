export interface Event {
  id: string;
  establishmentId: string;
  establishmentName: string;
  establishmentSlug: string;
  establishmentSubscription: 'free' | 'basic' | 'premium' | 'elite';
  
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  
  startDate: string; // ISO date
  endDate: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  
  category: 'concert' | 'exposition' | 'festival' | 'marche' | 'sport' | 'theatre' | 'cinema' | 'conference' | 'atelier' | 'gastronomie' | 'soiree' | 'autre';
  
  location: {
    name: string;
    address: string;
    district: number;
    lat?: number;
    lng?: number;
  };
  
  price?: {
    type: 'gratuit' | 'payant' | 'prix-libre';
    min?: number;
    max?: number;
    details?: string;
  };
  
  capacity?: number;
  currentReservations?: number;
  
  images?: string[];
  tags?: string[];
  
  registration?: {
    required: boolean;
    url?: string;
    email?: string;
    phone?: string;
  };
  
  visibility: {
    homepage: boolean; // Visible sur page d'accueil
    calendar: boolean; // Visible sur calendrier
    featured: boolean; // Mis en avant (Elite only)
  };
  
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Limites par plan
export const EVENT_LIMITS = {
  free: {
    monthlyLimit: 1,
    homepageVisible: false,
    calendarVisible: false,
    canBeFeatured: false,
  },
  basic: {
    monthlyLimit: 1,
    homepageVisible: true,
    calendarVisible: true,
    canBeFeatured: false,
  },
  premium: {
    monthlyLimit: 5,
    homepageVisible: true,
    calendarVisible: true,
    canBeFeatured: false,
  },
  elite: {
    monthlyLimit: 9,
    homepageVisible: true,
    calendarVisible: true,
    canBeFeatured: true, // Apparaît en top de liste
  },
};