// Common types used across the application

export interface SearchResult {
  id: string;
  title: string;
  type: 'place' | 'event' | 'article';
  description?: string;
  location?: string;
  date?: string;
  image?: string;
  score?: number;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
  grouped: {
    places: SearchResult[];
    events: SearchResult[];
    articles: SearchResult[];
  };
}

export interface NavigationItem {
  key: string;
  href: string;
  label: string;
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  url: string;
  label: string;
}

export interface NewsletterSubscription {
  email: string;
  locale?: string;
  timestamp?: Date;
}

// Component prop types
export interface LanguageSwitcherProps {
  className?: string;
}

export interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  onSelect?: (result: SearchResult) => void;
}

export interface HeaderProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

// Form types
export interface NewsletterFormData {
  email: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  q: string;
  type?: SearchResult['type'];
  location?: string;
  date?: string;
}

// Locale types
export type Locale = 'fr' | 'en' | 'es' | 'it';

export interface LocalizedContent {
  [key: string]: {
    [locale in Locale]: string;
  };
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noindex?: boolean;
}

// Event types for analytics
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  statusCode?: number;
  details?: any;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  theme: Theme;
  accentColor?: string;
}

// Accessibility types
export interface A11yConfig {
  reduceMotion?: boolean;
  highContrast?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

// Blog types
export interface BlogCategory {
  id: string;
  name: LocalizedContent;
  slug: LocalizedContent;
  description?: LocalizedContent;
  color?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogTag {
  id: string;
  name: LocalizedContent;
  slug: LocalizedContent;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  bio?: LocalizedContent;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogArticle {
  id: string;
  title: LocalizedContent;
  slug: LocalizedContent;
  excerpt: LocalizedContent;
  content: LocalizedContent;
  featuredImage?: {
    url: string;
    alt: LocalizedContent;
    credits?: string;
    width?: number;
    height?: number;
  };
  categoryId: string;
  tagIds: string[];
  authorId: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date;
  scheduledAt?: Date;
  seo: {
    metaTitle: LocalizedContent;
    metaDescription: LocalizedContent;
    keywords: LocalizedContent;
    canonicalUrl?: LocalizedContent;
    noindex?: boolean;
  };
  metrics: {
    views: number;
    shares: number;
    likes: number;
    comments: number;
    readingTime: number; // in minutes
  };
  moderation: {
    status: 'pending' | 'approved' | 'rejected';
    moderatedAt?: Date;
    moderatedBy?: string;
    notes?: string;
  };
  featured: {
    isFeatured: boolean;
    featuredAt?: Date;
    priority: number;
  };
  ai: {
    lastSuggestionAt?: Date;
    hasPendingSuggestion: boolean;
    suggestionCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface BlogArticleDraft {
  id: string;
  articleId: string;
  title: LocalizedContent;
  slug: LocalizedContent;
  excerpt: LocalizedContent;
  content: LocalizedContent;
  featuredImage?: BlogArticle['featuredImage'];
  categoryId: string;
  tagIds: string[];
  seo: BlogArticle['seo'];
  source: 'manual' | 'ai_suggestion';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  aiMetadata?: {
    prompt: string;
    model: string;
    generatedAt: Date;
    confidence: number;
    suggestions: string[];
  };
  createdAt: Date;
  createdBy: string;
}

export interface BlogComment {
  id: string;
  articleId: string;
  parentId?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
    isVerified: boolean;
  };
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  moderatedAt?: Date;
  moderatedBy?: string;
  likes: number;
  replies: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog API types
export interface BlogListParams extends PaginationParams {
  categoryId?: string;
  tagIds?: string[];
  status?: BlogArticle['status'];
  featured?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  locale?: Locale;
}

export interface BlogListResponse {
  articles: BlogArticle[];
  total: number;
  categories: BlogCategory[];
  tags: BlogTag[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RelatedArticlesResponse {
  articles: BlogArticle[];
  total: number;
}

// Admin blog types
export interface BlogFormData {
  title: LocalizedContent;
  slug: LocalizedContent;
  excerpt: LocalizedContent;
  content: LocalizedContent;
  featuredImage?: BlogArticle['featuredImage'];
  categoryId: string;
  tagIds: string[];
  seo: BlogArticle['seo'];
  status: BlogArticle['status'];
  scheduledAt?: Date;
  featured: {
    isFeatured: boolean;
    priority: number;
  };
}

export interface BlogStatsResponse {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  scheduledArticles: number;
  totalViews: number;
  totalShares: number;
  popularArticles: BlogArticle[];
  recentActivity: {
    date: string;
    articles: number;
    views: number;
  }[];
}

// Component prop types for blog
export interface BlogListProps {
  initialData: BlogListResponse;
  locale: Locale;
}

export interface BlogArticleProps {
  article: BlogArticle;
  relatedArticles: BlogArticle[];
  category: BlogCategory;
  tags: BlogTag[];
  author: BlogAuthor;
  locale: Locale;
}

export interface BlogFiltersProps {
  categories: BlogCategory[];
  tags: BlogTag[];
  selectedCategoryId?: string;
  selectedTagIds: string[];
  dateRange?: [Date, Date];
  onCategoryChange: (categoryId?: string) => void;
  onTagsChange: (tagIds: string[]) => void;
  onDateRangeChange: (range?: [Date, Date]) => void;
  onReset: () => void;
}

export interface BlogSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

// AI suggestion types
export interface AISuggestionRequest {
  articleId: string;
  type: 'content_improvement' | 'seo_optimization' | 'title_suggestions' | 'full_rewrite';
  locale?: Locale;
  context?: string;
}

export interface AISuggestionResponse {
  draftId: string;
  suggestions: {
    title?: string[];
    excerpt?: string;
    content?: string;
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
    };
  };
  confidence: number;
  reasoning: string;
  changes: BlogArticleDraft['changes'];
}

// Directory/Places types
export interface Place {
  id: string;
  name: string;
  slug: string;
  category: 'restaurant' | 'hotel' | 'bar' | 'culture' | 'shopping' | 'service';
  description: string;
  address: {
    street: string;
    district: number; // 1-9 pour les arrondissements de Lyon
    postalCode: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours?: Record<string, string>; // 'monday': '9:00-18:00'
  priceRange?: '€' | '€€' | '€€€' | '€€€€';
  rating?: number; // 0-5
  images?: string[];
  amenities?: string[];
  featured: boolean;
  verified: boolean;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  order: number;
}

export interface PlaceFilters {
  category?: string;
  district?: number[];
  priceRange?: string[];
  rating?: number;
  amenities?: string[];
  search?: string;
}

export interface DirectoryListParams extends PaginationParams {
  category?: string;
  district?: number;
  priceRange?: string;
  rating?: number;
  amenities?: string[];
  search?: string;
  featured?: boolean;
  lat?: number;
  lng?: number;
  radius?: number; // en km
}

export interface DirectoryListResponse {
  places: Place[];
  total: number;
  categories: PlaceCategory[];
  filters: {
    districts: { id: number; name: string; count: number }[];
    priceRanges: { id: string; count: number }[];
    amenities: { id: string; name: string; count: number }[];
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapPlace {
  id: string;
  name: string;
  category: Place['category'];
  lat: number;
  lng: number;
  rating?: number;
  priceRange?: string;
}