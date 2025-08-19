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
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  increment
} from 'firebase/firestore';
import { db } from '../config';
import { FirebasePlace } from '../models';

const COLLECTION_NAME = 'places';

export class PlacesService {
  // Create a new place
  static async create(place: Omit<FirebasePlace, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...place,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        statistics: {
          views: 0,
          favorites: 0,
          shares: 0
        }
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating place:', error);
      throw error;
    }
  }

  // Get a single place by ID
  static async getById(id: string): Promise<FirebasePlace | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Increment view count
        await updateDoc(docRef, {
          'statistics.views': increment(1)
        });
        
        return { id: docSnap.id, ...docSnap.data() } as FirebasePlace;
      }
      return null;
    } catch (error) {
      console.error('Error getting place:', error);
      throw error;
    }
  }

  // Get place by slug
  static async getBySlug(slug: string): Promise<FirebasePlace | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('slug', '==', slug),
        where('status', '==', 'published'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        
        // Increment view count
        await updateDoc(doc.ref, {
          'statistics.views': increment(1)
        });
        
        return { id: doc.id, ...doc.data() } as FirebasePlace;
      }
      return null;
    } catch (error) {
      console.error('Error getting place by slug:', error);
      throw error;
    }
  }

  // Get all places with filters
  static async getAll(filters?: {
    category?: string;
    district?: number;
    featured?: boolean;
    verified?: boolean;
    priceRange?: string;
    lastDoc?: DocumentSnapshot;
    pageSize?: number;
  }): Promise<{ places: FirebasePlace[], lastDoc: DocumentSnapshot | null }> {
    try {
      const constraints: QueryConstraint[] = [
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      ];

      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }
      if (filters?.district) {
        constraints.push(where('address.district', '==', filters.district));
      }
      if (filters?.featured !== undefined) {
        constraints.push(where('featured', '==', filters.featured));
      }
      if (filters?.verified !== undefined) {
        constraints.push(where('verified', '==', filters.verified));
      }
      if (filters?.priceRange) {
        constraints.push(where('priceRange', '==', filters.priceRange));
      }
      if (filters?.lastDoc) {
        constraints.push(startAfter(filters.lastDoc));
      }
      
      constraints.push(limit(filters?.pageSize || 20));

      const q = query(collection(db, COLLECTION_NAME), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const places = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebasePlace));

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { places, lastDoc };
    } catch (error) {
      console.error('Error getting places:', error);
      throw error;
    }
  }

  // Search places
  static async search(searchTerm: string, filters?: {
    category?: string;
    district?: number;
  }): Promise<FirebasePlace[]> {
    try {
      // For simple search, we'll filter on client side
      // In production, consider using Algolia or Elasticsearch
      const { places } = await this.getAll(filters);
      
      const searchLower = searchTerm.toLowerCase();
      return places.filter(place => 
        place.name.toLowerCase().includes(searchLower) ||
        place.description.toLowerCase().includes(searchLower) ||
        place.category.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  // Update a place
  static async update(id: string, updates: Partial<FirebasePlace>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating place:', error);
      throw error;
    }
  }

  // Delete a place (soft delete by changing status)
  static async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'archived',
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting place:', error);
      throw error;
    }
  }

  // Hard delete (permanent)
  static async hardDelete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error permanently deleting place:', error);
      throw error;
    }
  }

  // Get featured places
  static async getFeatured(limit = 6): Promise<FirebasePlace[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'published'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebasePlace));
    } catch (error) {
      console.error('Error getting featured places:', error);
      throw error;
    }
  }

  // Get places by owner
  static async getByOwner(ownerId: string): Promise<FirebasePlace[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirebasePlace));
    } catch (error) {
      console.error('Error getting places by owner:', error);
      throw error;
    }
  }

  // Toggle favorite
  static async toggleFavorite(id: string, increment: boolean): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        'statistics.favorites': increment ? increment(1) : increment(-1)
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  // Increment share count
  static async incrementShare(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        'statistics.shares': increment(1)
      });
    } catch (error) {
      console.error('Error incrementing share:', error);
      throw error;
    }
  }
}