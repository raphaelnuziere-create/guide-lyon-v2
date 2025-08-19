export interface Article {
  id: string;
  slug: string;
  
  // Métadonnées
  title: string;
  excerpt: string;
  content: string;
  
  // Source
  source: 'rss' | 'manual' | 'ai-generated';
  sourceUrl?: string;
  sourceName?: string;
  originalUrl?: string;
  
  // Catégorie
  category: 'actualite' | 'culture' | 'gastronomie' | 'tourisme' | 'economie' | 'sport' | 'lifestyle' | 'guide';
  
  // Tags et mots-clés
  tags: string[];
  
  // Images
  featuredImage?: string;
  images?: string[];
  
  // Auteur
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  
  // Statistiques
  views?: number;
  likes?: number;
  shares?: number;
  
  // SEO
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  
  // État
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  
  // Dates
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
}

// Configuration RSS pour Lyon
export const RSS_SOURCES = [
  {
    name: 'Le Progrès Lyon',
    url: 'https://www.leprogres.fr/lyon-metropole/rss',
    category: 'actualite',
    enabled: true,
  },
  {
    name: 'Lyon Capitale',
    url: 'https://www.lyoncapitale.fr/feed/',
    category: 'actualite',
    enabled: true,
  },
  {
    name: 'Tribune de Lyon',
    url: 'https://tribunedelyon.fr/feed/',
    category: 'actualite',
    enabled: true,
  },
  {
    name: 'Only Lyon Tourisme',
    url: 'https://www.lyon-france.com/rss',
    category: 'tourisme',
    enabled: true,
  },
  {
    name: 'Lyon Mag',
    url: 'https://www.lyonmag.com/rss',
    category: 'actualite',
    enabled: true,
  },
];