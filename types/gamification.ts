export type UserLevel = 'explorer' | 'expert' | 'ambassador';
export type BadgeCategory = 'contribution' | 'social' | 'discovery' | 'special';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  points: number;
  condition: {
    type: 'action_count' | 'points_threshold' | 'special_event' | 'streak';
    value: number;
    action?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface UserGamification {
  userId: string;
  userName: string;
  points: number;
  level: UserLevel;
  nextLevelPoints: number;
  badges: Badge[];
  streak: {
    current: number;
    longest: number;
    lastActivity: string;
  };
  stats: {
    reviews: number;
    comments: number;
    favorites: number;
    shares: number;
    placesVisited: number;
    eventsAttended: number;
    helpfulVotes: number;
  };
  achievements: Achievement[];
  rank?: number;
  title?: string; // Titre spécial
  joinedAt: string;
  lastActive: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: string;
  reward: {
    points: number;
    badge?: Badge;
    title?: string;
  };
}

export interface PointAction {
  id: string;
  action: string;
  points: number;
  multiplier?: number;
  dailyLimit?: number;
  description: string;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  users: {
    userId: string;
    userName: string;
    avatar?: string;
    level: UserLevel;
    points: number;
    rank: number;
    change: number; // Position change
    badges: number;
  }[];
  updatedAt: string;
}

export const LEVEL_THRESHOLDS = {
  explorer: 0,
  expert: 200,
  ambassador: 500,
};

export const POINT_ACTIONS: Record<string, PointAction> = {
  review: {
    id: 'review',
    action: 'Écrire un avis',
    points: 10,
    dailyLimit: 3,
    description: 'Partagez votre expérience',
  },
  comment: {
    id: 'comment',
    action: 'Commenter',
    points: 5,
    dailyLimit: 10,
    description: 'Participez aux discussions',
  },
  favorite: {
    id: 'favorite',
    action: 'Ajouter aux favoris',
    points: 2,
    dailyLimit: 20,
    description: 'Sauvegardez vos coups de cœur',
  },
  share: {
    id: 'share',
    action: 'Partager',
    points: 3,
    dailyLimit: 10,
    description: 'Partagez avec vos amis',
  },
  helpful: {
    id: 'helpful',
    action: 'Vote utile',
    points: 1,
    dailyLimit: 20,
    description: 'Aidez la communauté',
  },
  firstReview: {
    id: 'firstReview',
    action: 'Premier avis',
    points: 20,
    description: 'Bonus pour votre premier avis',
  },
  dailyVisit: {
    id: 'dailyVisit',
    action: 'Visite quotidienne',
    points: 5,
    dailyLimit: 1,
    description: 'Connectez-vous chaque jour',
  },
  weekStreak: {
    id: 'weekStreak',
    action: 'Série de 7 jours',
    points: 50,
    description: 'Visitez le site 7 jours consécutifs',
  },
  photo: {
    id: 'photo',
    action: 'Ajouter une photo',
    points: 8,
    dailyLimit: 5,
    description: 'Enrichissez les contenus avec vos photos',
  },
  verified: {
    id: 'verified',
    action: 'Achat vérifié',
    points: 15,
    description: 'Bonus pour les achats vérifiés',
  },
};

export const BADGES_LIST: Badge[] = [
  // Badges de contribution
  {
    id: 'first_review',
    name: 'Première impression',
    description: 'Écrivez votre premier avis',
    icon: '✍️',
    category: 'contribution',
    points: 20,
    condition: { type: 'action_count', value: 1, action: 'review' },
    rarity: 'common',
  },
  {
    id: 'reviewer_10',
    name: 'Critique amateur',
    description: '10 avis publiés',
    icon: '📝',
    category: 'contribution',
    points: 50,
    condition: { type: 'action_count', value: 10, action: 'review' },
    rarity: 'rare',
  },
  {
    id: 'reviewer_50',
    name: 'Critique expert',
    description: '50 avis publiés',
    icon: '🏆',
    category: 'contribution',
    points: 200,
    condition: { type: 'action_count', value: 50, action: 'review' },
    rarity: 'epic',
  },
  // Badges sociaux
  {
    id: 'helpful_user',
    name: 'Membre utile',
    description: '20 votes utiles reçus',
    icon: '👍',
    category: 'social',
    points: 30,
    condition: { type: 'action_count', value: 20, action: 'helpful' },
    rarity: 'common',
  },
  {
    id: 'influencer',
    name: 'Influenceur',
    description: '100 partages effectués',
    icon: '📢',
    category: 'social',
    points: 100,
    condition: { type: 'action_count', value: 100, action: 'share' },
    rarity: 'rare',
  },
  // Badges de découverte
  {
    id: 'explorer_10',
    name: 'Explorateur',
    description: 'Visitez 10 lieux différents',
    icon: '🗺️',
    category: 'discovery',
    points: 40,
    condition: { type: 'action_count', value: 10, action: 'visit' },
    rarity: 'common',
  },
  {
    id: 'gourmet',
    name: 'Gourmet',
    description: '20 restaurants visités',
    icon: '🍽️',
    category: 'discovery',
    points: 60,
    condition: { type: 'action_count', value: 20, action: 'restaurant' },
    rarity: 'rare',
  },
  {
    id: 'night_owl',
    name: 'Noctambule',
    description: '15 sorties nocturnes',
    icon: '🌃',
    category: 'discovery',
    points: 50,
    condition: { type: 'action_count', value: 15, action: 'nightlife' },
    rarity: 'rare',
  },
  // Badges spéciaux
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Membre depuis le lancement',
    icon: '🌅',
    category: 'special',
    points: 100,
    condition: { type: 'special_event', value: 1 },
    rarity: 'legendary',
  },
  {
    id: 'streak_master',
    name: 'Maître de la régularité',
    description: '30 jours consécutifs',
    icon: '🔥',
    category: 'special',
    points: 150,
    condition: { type: 'streak', value: 30 },
    rarity: 'epic',
  },
  {
    id: 'ambassador',
    name: 'Ambassadeur de Lyon',
    description: 'Niveau Ambassador atteint',
    icon: '🎖️',
    category: 'special',
    points: 500,
    condition: { type: 'points_threshold', value: 500 },
    rarity: 'legendary',
  },
];