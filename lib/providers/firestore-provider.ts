import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Article } from './mdx-provider';

export class FirestoreProvider {
  private collectionName = 'articles';

  async getAllArticles(): Promise<Article[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('published', '==', true),
        orderBy('publishedAt', 'desc')
      ];
      
      const q = query(collection(db, this.collectionName), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => this.transformArticle(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching articles from Firestore:', error);
      return [];
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      // Try to find by any locale slug
      const locales = ['fr', 'en', 'es', 'it'];
      
      for (const locale of locales) {
        const q = query(
          collection(db, this.collectionName),
          where('published', '==', true),
          where(`slug_i18n.${locale}`, '==', slug),
          limit(1)
        );
        
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          return this.transformArticle(doc.id, doc.data());
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching article by slug:', error);
      return null;
    }
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('published', '==', true),
        where('categoryId', '==', category),
        orderBy('publishedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.transformArticle(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching articles by category:', error);
      return [];
    }
  }

  async getArticlesByTag(tag: string): Promise<Article[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('published', '==', true),
        where('tags', 'array-contains', tag),
        orderBy('publishedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.transformArticle(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching articles by tag:', error);
      return [];
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('published', '==', true),
        where('featured', '==', true),
        orderBy('publishedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.transformArticle(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return [];
    }
  }

  async getLatestArticles(limitCount: number = 10): Promise<Article[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('published', '==', true),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.transformArticle(doc.id, doc.data()));
    } catch (error) {
      console.error('Error fetching latest articles:', error);
      return [];
    }
  }

  async searchArticles(searchQuery: string): Promise<Article[]> {
    // Note: Full-text search requires Algolia or similar
    // This is a simple implementation that searches in tags
    const lowercaseQuery = searchQuery.toLowerCase();
    const articles = await this.getAllArticles();
    
    return articles.filter(article => {
      const searchableContent = [
        article.title,
        article.excerpt,
        article.content,
        ...article.tags,
        article.category
      ].join(' ').toLowerCase();
      
      return searchableContent.includes(lowercaseQuery);
    });
  }

  async getCategories(): Promise<string[]> {
    const articles = await this.getAllArticles();
    const categories = new Set(articles.map(article => article.category));
    return Array.from(categories).sort();
  }

  async getTags(): Promise<string[]> {
    const articles = await this.getAllArticles();
    const tags = new Set(articles.flatMap(article => article.tags));
    return Array.from(tags).sort();
  }

  private transformArticle(id: string, data: any): Article {
    // Transform Firestore document to Article type
    return {
      title: data.title_i18n?.fr || '',
      title_i18n: data.title_i18n,
      slug: data.slug_i18n?.fr || id,
      slug_i18n: data.slug_i18n,
      excerpt: data.excerpt_i18n?.fr || '',
      excerpt_i18n: data.excerpt_i18n,
      category: data.categoryId || 'general',
      tags: data.tags || [],
      author: data.author || 'Rédaction',
      publishedAt: this.timestampToString(data.publishedAt),
      updatedAt: this.timestampToString(data.updatedAt),
      featured: data.featured || false,
      image: data.coverUrl || '',
      imageAlt: data.coverAlt || '',
      content: data.content_i18n?.fr || '',
      htmlContent: data.content_i18n?.fr || '', // TODO: Process markdown
      seo: data.seo_i18n
    };
  }

  private timestampToString(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toISOString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    return timestamp;
  }
}

export const firestoreProvider = new FirestoreProvider();