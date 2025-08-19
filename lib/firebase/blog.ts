import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  getCountFromServer,
  DocumentSnapshot,
  Timestamp,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@guide-de-lyon/lib';
import readingTime from 'reading-time';
import type {
  BlogArticle,
  BlogCategory,
  BlogTag,
  BlogAuthor,
  BlogComment,
  BlogArticleDraft,
  BlogListParams,
  BlogListResponse,
  RelatedArticlesResponse,
  BlogStatsResponse,
  AISuggestionRequest,
  AISuggestionResponse,
  Locale,
} from '../../types';

// Collections
const ARTICLES_COLLECTION = 'articles';
const ARTICLE_DRAFTS_COLLECTION = 'articleDrafts';
const CATEGORIES_COLLECTION = 'blogCategories';
const TAGS_COLLECTION = 'blogTags';
const AUTHORS_COLLECTION = 'blogAuthors';
const COMMENTS_COLLECTION = 'comments';
const METRICS_COLLECTION = 'blogMetrics';

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

// Helper function to prepare data for Firestore
const prepareForFirestore = (data: any) => {
  const prepared = { ...data };
  
  // Convert Date objects to Timestamps
  Object.keys(prepared).forEach(key => {
    if (prepared[key] instanceof Date) {
      prepared[key] = Timestamp.fromDate(prepared[key]);
    }
    if (typeof prepared[key] === 'object' && prepared[key] !== null) {
      Object.keys(prepared[key]).forEach(subKey => {
        if (prepared[key][subKey] instanceof Date) {
          prepared[key][subKey] = Timestamp.fromDate(prepared[key][subKey]);
        }
      });
    }
  });
  
  return prepared;
};

// Helper function to convert Firestore document to typed object
const convertDocument = <T>(doc: DocumentSnapshot): T | null => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  const converted = { ...data, id: doc.id };
  
  // Convert timestamps back to dates
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
    if (typeof converted[key] === 'object' && converted[key] !== null) {
      Object.keys(converted[key]).forEach(subKey => {
        if (converted[key][subKey] instanceof Timestamp) {
          converted[key][subKey] = converted[key][subKey].toDate();
        }
      });
    }
  });
  
  return converted as T;
};

// Article Services
export const articleService = {
  // Get articles with filtering and pagination
  async getArticles(params: BlogListParams): Promise<BlogListResponse> {
    const {
      page = 1,
      limit: pageLimit = 10,
      categoryId,
      tagIds,
      status = 'published',
      featured,
      dateFrom,
      dateTo,
      search,
      locale,
      sort = 'publishedAt',
      order = 'desc'
    } = params;

    let q = query(collection(db, ARTICLES_COLLECTION));

    // Add filters
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    if (status === 'published') {
      q = query(q, where('moderation.status', '==', 'approved'));
    }

    if (categoryId) {
      q = query(q, where('categoryId', '==', categoryId));
    }

    if (tagIds && tagIds.length > 0) {
      q = query(q, where('tagIds', 'array-contains-any', tagIds));
    }

    if (featured !== undefined) {
      q = query(q, where('featured.isFeatured', '==', featured));
    }

    if (dateFrom) {
      q = query(q, where('publishedAt', '>=', Timestamp.fromDate(new Date(dateFrom))));
    }

    if (dateTo) {
      q = query(q, where('publishedAt', '<=', Timestamp.fromDate(new Date(dateTo))));
    }

    // Add ordering
    if (sort === 'publishedAt') {
      q = query(q, orderBy('publishedAt', order as 'asc' | 'desc'));
    } else if (sort === 'views') {
      q = query(q, orderBy('metrics.views', order as 'asc' | 'desc'));
    } else if (sort === 'title') {
      q = query(q, orderBy(`title.${locale || 'fr'}`, order as 'asc' | 'desc'));
    }

    // Add pagination
    const offset = (page - 1) * pageLimit;
    q = query(q, limit(pageLimit));

    if (offset > 0) {
      // For pagination, we'd need to implement cursor-based pagination
      // This is a simplified version
    }

    const [articlesSnapshot, categoriesSnapshot, tagsSnapshot, totalCount] = await Promise.all([
      getDocs(q),
      getDocs(collection(db, CATEGORIES_COLLECTION)),
      getDocs(collection(db, TAGS_COLLECTION)),
      getCountFromServer(query(collection(db, ARTICLES_COLLECTION), where('status', '==', status)))
    ]);

    const articles = articlesSnapshot.docs
      .map(doc => convertDocument<BlogArticle>(doc))
      .filter(Boolean) as BlogArticle[];

    // Apply search filter (client-side for now)
    let filteredArticles = articles;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = articles.filter(article => {
        const currentLocale = locale || 'fr';
        const title = article.title[currentLocale]?.toLowerCase() || '';
        const excerpt = article.excerpt[currentLocale]?.toLowerCase() || '';
        const content = article.content[currentLocale]?.toLowerCase() || '';
        
        return title.includes(searchLower) || 
               excerpt.includes(searchLower) || 
               content.includes(searchLower);
      });
    }

    const categories = categoriesSnapshot.docs
      .map(doc => convertDocument<BlogCategory>(doc))
      .filter(Boolean) as BlogCategory[];

    const tags = tagsSnapshot.docs
      .map(doc => convertDocument<BlogTag>(doc))
      .filter(Boolean) as BlogTag[];

    const total = totalCount.data().count;
    const totalPages = Math.ceil(total / pageLimit);

    return {
      articles: filteredArticles,
      total,
      categories,
      tags,
      pagination: {
        page,
        limit: pageLimit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  // Get single article by slug
  async getArticleBySlug(slug: string, locale: Locale): Promise<BlogArticle | null> {
    const q = query(
      collection(db, ARTICLES_COLLECTION),
      where(`slug.${locale}`, '==', slug),
      where('status', '==', 'published'),
      where('moderation.status', '==', 'approved')
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const article = convertDocument<BlogArticle>(snapshot.docs[0]);
    
    // Increment view count
    if (article) {
      await this.incrementViews(article.id);
    }

    return article;
  },

  // Get article by ID
  async getArticleById(id: string): Promise<BlogArticle | null> {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return convertDocument<BlogArticle>(docSnap);
  },

  // Create new article
  async createArticle(articleData: Omit<BlogArticle, 'id' | 'createdAt' | 'updatedAt' | 'metrics' | 'ai'>): Promise<string> {
    const now = new Date();
    
    // Calculate reading time
    const readingTimeStats = readingTime(Object.values(articleData.content).join(' '));
    
    const article: Omit<BlogArticle, 'id'> = {
      ...articleData,
      metrics: {
        views: 0,
        shares: 0,
        likes: 0,
        comments: 0,
        readingTime: readingTimeStats.minutes,
      },
      ai: {
        hasPendingSuggestion: false,
        suggestionCount: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), prepareForFirestore(article));
    return docRef.id;
  },

  // Update article
  async updateArticle(id: string, updates: Partial<BlogArticle>): Promise<void> {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    
    // Recalculate reading time if content changed
    if (updates.content) {
      const readingTimeStats = readingTime(Object.values(updates.content).join(' '));
      updates.metrics = {
        ...updates.metrics,
        readingTime: readingTimeStats.minutes,
      };
    }
    
    await updateDoc(docRef, prepareForFirestore({
      ...updates,
      updatedAt: new Date(),
    }));
  },

  // Delete article
  async deleteArticle(id: string): Promise<void> {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Get related articles
  async getRelatedArticles(articleId: string, categoryId: string, tagIds: string[], limit = 4): Promise<RelatedArticlesResponse> {
    // Get articles from same category
    let q = query(
      collection(db, ARTICLES_COLLECTION),
      where('categoryId', '==', categoryId),
      where('status', '==', 'published'),
      where('moderation.status', '==', 'approved'),
      orderBy('publishedAt', 'desc'),
      limit(limit + 1) // +1 to account for current article
    );

    const snapshot = await getDocs(q);
    let articles = snapshot.docs
      .map(doc => convertDocument<BlogArticle>(doc))
      .filter(Boolean)
      .filter(article => article!.id !== articleId) as BlogArticle[];

    // If not enough articles, get by tags
    if (articles.length < limit && tagIds.length > 0) {
      const tagQuery = query(
        collection(db, ARTICLES_COLLECTION),
        where('tagIds', 'array-contains-any', tagIds),
        where('status', '==', 'published'),
        where('moderation.status', '==', 'approved'),
        orderBy('publishedAt', 'desc'),
        limit(limit)
      );

      const tagSnapshot = await getDocs(tagQuery);
      const tagArticles = tagSnapshot.docs
        .map(doc => convertDocument<BlogArticle>(doc))
        .filter(Boolean)
        .filter(article => {
          return article!.id !== articleId && 
                 !articles.some(existing => existing.id === article!.id);
        }) as BlogArticle[];

      articles = [...articles, ...tagArticles];
    }

    return {
      articles: articles.slice(0, limit),
      total: articles.length,
    };
  },

  // Increment view count
  async incrementViews(articleId: string): Promise<void> {
    const docRef = doc(db, ARTICLES_COLLECTION, articleId);
    await updateDoc(docRef, {
      'metrics.views': increment(1),
    });
  },

  // Upload image
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, `blog/images/${path}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  // Delete image
  async deleteImage(url: string): Promise<void> {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  },
};

// Category Services
export const categoryService = {
  async getCategories(): Promise<BlogCategory[]> {
    const snapshot = await getDocs(query(collection(db, CATEGORIES_COLLECTION), orderBy('order')));
    return snapshot.docs
      .map(doc => convertDocument<BlogCategory>(doc))
      .filter(Boolean) as BlogCategory[];
  },

  async getCategoryById(id: string): Promise<BlogCategory | null> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return convertDocument<BlogCategory>(docSnap);
  },

  async createCategory(categoryData: Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const category = {
      ...categoryData,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), prepareForFirestore(category));
    return docRef.id;
  },

  async updateCategory(id: string, updates: Partial<BlogCategory>): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, prepareForFirestore({
      ...updates,
      updatedAt: new Date(),
    }));
  },

  async deleteCategory(id: string): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  },
};

// Tag Services
export const tagService = {
  async getTags(): Promise<BlogTag[]> {
    const snapshot = await getDocs(query(collection(db, TAGS_COLLECTION), orderBy('name.fr')));
    return snapshot.docs
      .map(doc => convertDocument<BlogTag>(doc))
      .filter(Boolean) as BlogTag[];
  },

  async getTagById(id: string): Promise<BlogTag | null> {
    const docRef = doc(db, TAGS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return convertDocument<BlogTag>(docSnap);
  },

  async getTagsByIds(ids: string[]): Promise<BlogTag[]> {
    if (ids.length === 0) return [];
    
    const promises = ids.map(id => this.getTagById(id));
    const tags = await Promise.all(promises);
    return tags.filter(Boolean) as BlogTag[];
  },

  async createTag(tagData: Omit<BlogTag, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const tag = {
      ...tagData,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, TAGS_COLLECTION), prepareForFirestore(tag));
    return docRef.id;
  },

  async updateTag(id: string, updates: Partial<BlogTag>): Promise<void> {
    const docRef = doc(db, TAGS_COLLECTION, id);
    await updateDoc(docRef, prepareForFirestore({
      ...updates,
      updatedAt: new Date(),
    }));
  },

  async deleteTag(id: string): Promise<void> {
    const docRef = doc(db, TAGS_COLLECTION, id);
    await deleteDoc(docRef);
  },
};

// Author Services
export const authorService = {
  async getAuthors(): Promise<BlogAuthor[]> {
    const snapshot = await getDocs(query(collection(db, AUTHORS_COLLECTION), orderBy('name')));
    return snapshot.docs
      .map(doc => convertDocument<BlogAuthor>(doc))
      .filter(Boolean) as BlogAuthor[];
  },

  async getAuthorById(id: string): Promise<BlogAuthor | null> {
    const docRef = doc(db, AUTHORS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return convertDocument<BlogAuthor>(docSnap);
  },

  async createAuthor(authorData: Omit<BlogAuthor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const author = {
      ...authorData,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(collection(db, AUTHORS_COLLECTION), prepareForFirestore(author));
    return docRef.id;
  },

  async updateAuthor(id: string, updates: Partial<BlogAuthor>): Promise<void> {
    const docRef = doc(db, AUTHORS_COLLECTION, id);
    await updateDoc(docRef, prepareForFirestore({
      ...updates,
      updatedAt: new Date(),
    }));
  },
};

// Draft Services
export const draftService = {
  async createDraft(draftData: Omit<BlogArticleDraft, 'id' | 'createdAt'>): Promise<string> {
    const draft = {
      ...draftData,
      createdAt: new Date(),
    };
    const docRef = await addDoc(collection(db, ARTICLE_DRAFTS_COLLECTION), prepareForFirestore(draft));
    return docRef.id;
  },

  async getDraftsByArticleId(articleId: string): Promise<BlogArticleDraft[]> {
    const q = query(
      collection(db, ARTICLE_DRAFTS_COLLECTION),
      where('articleId', '==', articleId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => convertDocument<BlogArticleDraft>(doc))
      .filter(Boolean) as BlogArticleDraft[];
  },

  async getDraftById(id: string): Promise<BlogArticleDraft | null> {
    const docRef = doc(db, ARTICLE_DRAFTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return convertDocument<BlogArticleDraft>(docSnap);
  },

  async deleteDraft(id: string): Promise<void> {
    const docRef = doc(db, ARTICLE_DRAFTS_COLLECTION, id);
    await deleteDoc(docRef);
  },
};

// Statistics Services
export const statsService = {
  async getBlogStats(): Promise<BlogStatsResponse> {
    const [
      totalArticlesSnapshot,
      publishedArticlesSnapshot,
      draftArticlesSnapshot,
      scheduledArticlesSnapshot,
      popularArticlesSnapshot,
    ] = await Promise.all([
      getCountFromServer(collection(db, ARTICLES_COLLECTION)),
      getCountFromServer(query(collection(db, ARTICLES_COLLECTION), where('status', '==', 'published'))),
      getCountFromServer(query(collection(db, ARTICLES_COLLECTION), where('status', '==', 'draft'))),
      getCountFromServer(query(collection(db, ARTICLES_COLLECTION), where('status', '==', 'scheduled'))),
      getDocs(query(
        collection(db, ARTICLES_COLLECTION),
        where('status', '==', 'published'),
        orderBy('metrics.views', 'desc'),
        limit(5)
      )),
    ]);

    const popularArticles = popularArticlesSnapshot.docs
      .map(doc => convertDocument<BlogArticle>(doc))
      .filter(Boolean) as BlogArticle[];

    const totalViews = popularArticles.reduce((sum, article) => sum + article.metrics.views, 0);
    const totalShares = popularArticles.reduce((sum, article) => sum + article.metrics.shares, 0);

    return {
      totalArticles: totalArticlesSnapshot.data().count,
      publishedArticles: publishedArticlesSnapshot.data().count,
      draftArticles: draftArticlesSnapshot.data().count,
      scheduledArticles: scheduledArticlesSnapshot.data().count,
      totalViews,
      totalShares,
      popularArticles,
      recentActivity: [], // This would require more complex aggregation
    };
  },
};