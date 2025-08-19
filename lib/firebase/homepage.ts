import { db } from '@guide-de-lyon/lib';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import type { HomepageConfig, SectionConfig } from '@guide-de-lyon/lib/schemas/homepage';

export class HomepageService {
  private static readonly COLLECTION = 'homepage';
  private static readonly DOC_ID = 'config';

  /**
   * Get the current homepage configuration
   */
  static async getConfig(): Promise<HomepageConfig | null> {
    try {
      const docRef = doc(db, this.COLLECTION, this.DOC_ID);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return docSnap.data() as HomepageConfig;
    } catch (error) {
      console.error('Error fetching homepage config:', error);
      throw error;
    }
  }

  /**
   * Save homepage configuration
   */
  static async saveConfig(config: HomepageConfig): Promise<HomepageConfig> {
    try {
      const updatedConfig = {
        ...config,
        lastModified: new Date(),
        version: (config.version || 0) + 1,
      };

      const docRef = doc(db, this.COLLECTION, this.DOC_ID);
      await setDoc(docRef, updatedConfig);

      return updatedConfig;
    } catch (error) {
      console.error('Error saving homepage config:', error);
      throw error;
    }
  }

  /**
   * Update specific fields in the configuration
   */
  static async updateConfig(updates: Partial<HomepageConfig>): Promise<HomepageConfig> {
    try {
      const docRef = doc(db, this.COLLECTION, this.DOC_ID);
      
      const updatedData = {
        ...updates,
        lastModified: new Date(),
      };

      await updateDoc(docRef, updatedData);

      // Return updated document
      const updatedDoc = await getDoc(docRef);
      return updatedDoc.data() as HomepageConfig;
    } catch (error) {
      console.error('Error updating homepage config:', error);
      throw error;
    }
  }

  /**
   * Publish or unpublish the homepage
   */
  static async setPublished(published: boolean): Promise<HomepageConfig> {
    const updates: any = {
      published,
      lastModified: new Date(),
    };

    if (published) {
      updates.publishedAt = new Date();
    }

    return this.updateConfig(updates);
  }

  /**
   * Get the published configuration (for public display)
   */
  static async getPublishedConfig(): Promise<HomepageConfig | null> {
    const config = await this.getConfig();
    return config?.published ? config : null;
  }

  /**
   * Add a new section to the homepage
   */
  static async addSection(section: SectionConfig): Promise<HomepageConfig> {
    const config = await this.getConfig();
    if (!config) {
      throw new Error('Homepage configuration not found');
    }

    const updatedSections = [...config.sections, section];
    return this.updateConfig({ sections: updatedSections });
  }

  /**
   * Update a specific section
   */
  static async updateSection(sectionId: string, updates: Partial<SectionConfig>): Promise<HomepageConfig> {
    const config = await this.getConfig();
    if (!config) {
      throw new Error('Homepage configuration not found');
    }

    const updatedSections = config.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );

    return this.updateConfig({ sections: updatedSections });
  }

  /**
   * Remove a section from the homepage
   */
  static async removeSection(sectionId: string): Promise<HomepageConfig> {
    const config = await this.getConfig();
    if (!config) {
      throw new Error('Homepage configuration not found');
    }

    const updatedSections = config.sections.filter(section => section.id !== sectionId);
    return this.updateConfig({ sections: updatedSections });
  }

  /**
   * Reorder sections
   */
  static async reorderSections(sectionIds: string[]): Promise<HomepageConfig> {
    const config = await this.getConfig();
    if (!config) {
      throw new Error('Homepage configuration not found');
    }

    const sectionMap = new Map(config.sections.map(section => [section.id, section]));
    const reorderedSections = sectionIds
      .map(id => sectionMap.get(id))
      .filter(Boolean)
      .map((section, index) => ({ ...section!, order: index }));

    return this.updateConfig({ sections: reorderedSections });
  }

  /**
   * Get curated content based on section configuration
   */
  static async getCuratedContent(section: SectionConfig): Promise<any[]> {
    if (section.dataMode !== 'curated' || !section.curatedIds?.length) {
      return [];
    }

    try {
      let collectionName = '';
      switch (section.type) {
        case 'news':
          collectionName = 'news';
          break;
        case 'featured_directory':
          collectionName = 'places';
          break;
        case 'events':
          collectionName = 'events';
          break;
        default:
          return [];
      }

      const promises = section.curatedIds.map(async (id) => {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
      });

      const results = await Promise.all(promises);
      return results.filter(Boolean);
    } catch (error) {
      console.error('Error fetching curated content:', error);
      return [];
    }
  }

  /**
   * Get auto content based on section configuration
   */
  static async getAutoContent(section: SectionConfig): Promise<any[]> {
    if (section.dataMode !== 'auto') {
      return [];
    }

    try {
      let baseQuery;
      
      switch (section.type) {
        case 'news':
          baseQuery = query(
            collection(db, 'news'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc'),
            limit(section.maxItems || 6)
          );
          break;
          
        case 'featured_directory':
          baseQuery = query(
            collection(db, 'places'),
            where('status', '==', 'published'),
            orderBy('metrics.views', 'desc'),
            limit(section.maxItems || 6)
          );
          break;
          
        case 'events':
          baseQuery = query(
            collection(db, 'events'),
            where('status', '==', 'approved'),
            where('startDate', '>=', new Date()),
            orderBy('startDate', 'asc'),
            limit(section.maxItems || 6)
          );
          break;
          
        default:
          return [];
      }

      const snapshot = await getDocs(baseQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching auto content:', error);
      return [];
    }
  }

  /**
   * Get all content for a section (auto + curated)
   */
  static async getSectionContent(section: SectionConfig): Promise<any[]> {
    const [autoContent, curatedContent] = await Promise.all([
      this.getAutoContent(section),
      this.getCuratedContent(section),
    ]);

    // Combine and deduplicate content
    const contentMap = new Map();
    
    // Add auto content first
    autoContent.forEach(item => contentMap.set(item.id, item));
    
    // Add curated content (overrides auto content)
    curatedContent.forEach(item => contentMap.set(item.id, item));

    return Array.from(contentMap.values()).slice(0, section.maxItems || 6);
  }

  /**
   * Create default homepage configuration
   */
  static createDefaultConfig(): HomepageConfig {
    return {
      id: 'homepage',
      version: 1,
      lastModified: new Date(),
      modifiedBy: 'system',
      published: false,
      seo: {
        title: {
          fr: 'Guide de Lyon - Découvrez la capitale des Gaules',
          en: 'Lyon Guide - Discover the capital of Gaul',
          it: 'Guida di Lione - Scopri la capitale della Gallia',
          es: 'Guía de Lyon - Descubre la capital de las Galias',
        },
        description: {
          fr: 'Votre guide complet pour découvrir Lyon : restaurants, culture, événements et bien plus',
          en: 'Your complete guide to discover Lyon: restaurants, culture, events and much more',
          it: 'La tua guida completa per scoprire Lione: ristoranti, cultura, eventi e molto altro',
          es: 'Tu guía completa para descubrir Lyon: restaurantes, cultura, eventos y mucho más',
        },
        keywords: ['lyon', 'guide', 'tourisme', 'restaurants', 'culture', 'événements'],
      },
      sections: [],
      globalSettings: {
        lazyLoading: true,
        criticalCss: true,
        analytics: true,
        performanceMode: 'balanced',
      },
    };
  }
}