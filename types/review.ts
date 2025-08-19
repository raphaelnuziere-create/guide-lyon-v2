export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel?: 'explorer' | 'expert' | 'ambassador'; // Pour la gamification
  targetId: string; // ID de l'établissement, événement ou article
  targetType: 'place' | 'event' | 'article';
  rating: number; // 1-5 étoiles
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  visitDate?: string;
  photos?: string[];
  helpful: number; // Nombre de "utile"
  notHelpful: number;
  verified: boolean; // Achat/visite vérifiée
  response?: {
    author: string;
    content: string;
    date: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  aspects?: {
    service?: number;
    quality?: number;
    price?: number;
    location?: number;
    atmosphere?: number;
  };
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetId: string;
  targetType: 'article' | 'event' | 'place' | 'review';
  content: string;
  parentId?: string; // Pour les réponses
  likes: number;
  replies?: Comment[];
  status: 'visible' | 'hidden' | 'flagged';
  createdAt: string;
  updatedAt: string;
}