import { db } from './config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  GeoPoint,
  Timestamp
} from 'firebase/firestore';
import { Place } from '@/types';

interface GetPlacesOptions {
  filters?: {
    category?: string;
    district?: number;
    tags?: string[];
    price?: string;
    features?: string[];
    search?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  };
  sort?: 'relevance' | 'rating' | 'distance' | 'name' | 'recent';
  page?: number;
  limit?: number;
  locale?: string;
  cursor?: DocumentSnapshot;
}

/**
 * Get places with filters and pagination
 */
export async function getPlaces({
  filters = {},
  sort = 'relevance',
  page = 1,
  limit: pageSize = 24,
  locale = 'fr',
  cursor,
}: GetPlacesOptions): Promise<{
  places: Place[];
  total: number;
  hasMore: boolean;
}> {
  try {
    const constraints: QueryConstraint[] = [
      where('status', '==', 'published'),
    ];

    // Apply filters
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters.district) {
      constraints.push(where('address.district', '==', filters.district));
    }

    if (filters.tags && filters.tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', filters.tags));
    }

    if (filters.price) {
      constraints.push(where('priceRange', '==', filters.price));
    }

    if (filters.features && filters.features.length > 0) {
      constraints.push(where('features', 'array-contains-any', filters.features));
    }

    // Apply sorting
    switch (sort) {
      case 'rating':
        constraints.push(orderBy('rating', 'desc'));
        break;
      case 'name':
        constraints.push(orderBy('name', 'asc'));
        break;
      case 'recent':
        constraints.push(orderBy('createdAt', 'desc'));
        break;
      case 'relevance':
      default:
        // Boost featured places first, then by rating
        constraints.push(orderBy('isFeatured', 'desc'));
        constraints.push(orderBy('rating', 'desc'));
        break;
    }

    // Add limit
    constraints.push(limit(pageSize + 1)); // +1 to check if there are more

    // Create query
    let q = query(collection(db, 'places'), ...constraints);

    // Handle pagination
    if (cursor) {
      q = query(q, startAfter(cursor));
    } else if (page > 1) {
      // Skip to the right page
      const skipCount = (page - 1) * pageSize;
      const skipQuery = query(collection(db, 'places'), ...constraints.slice(0, -1), limit(skipCount));
      const skipSnapshot = await getDocs(skipQuery);
      if (skipSnapshot.docs.length > 0) {
        const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
        q = query(q, startAfter(lastDoc));
      }
    }

    // Execute query
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.slice(0, pageSize);
    const hasMore = snapshot.docs.length > pageSize;

    // Process results
    let places = docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Place[];

    // Apply text search filter (client-side for now)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      places = places.filter(place => {
        const name = place.name_i18n?.[locale as keyof typeof place.name_i18n] || place.name;
        const description = place.description_i18n?.[locale as keyof typeof place.description_i18n] || place.description;
        
        return (
          name?.toLowerCase().includes(searchLower) ||
          description?.toLowerCase().includes(searchLower) ||
          place.category?.toLowerCase().includes(searchLower) ||
          place.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply distance filter if location provided
    if (filters.lat && filters.lng && filters.radius) {
      places = places.filter(place => {
        if (!place.address?.lat || !place.address?.lng) return false;
        
        const distance = calculateDistance(
          filters.lat!,
          filters.lng!,
          place.address.lat,
          place.address.lng
        );
        
        return distance <= filters.radius!;
      });

      // Sort by distance if location filter is active
      if (sort === 'distance') {
        places.sort((a, b) => {
          const distA = calculateDistance(
            filters.lat!,
            filters.lng!,
            a.address?.lat || 0,
            a.address?.lng || 0
          );
          const distB = calculateDistance(
            filters.lat!,
            filters.lng!,
            b.address?.lat || 0,
            b.address?.lng || 0
          );
          return distA - distB;
        });
      }
    }

    // Get total count (approximate)
    const totalQuery = query(
      collection(db, 'places'),
      where('status', '==', 'published'),
      ...(filters.category ? [where('category', '==', filters.category)] : [])
    );
    const totalSnapshot = await getDocs(totalQuery);
    const total = totalSnapshot.size;

    return {
      places,
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching places:', error);
    return {
      places: [],
      total: 0,
      hasMore: false,
    };
  }
}

/**
 * Get a single place by slug
 */
export async function getPlaceBySlug(slug: string, locale: string = 'fr'): Promise<Place | null> {
  try {
    const q = query(
      collection(db, 'places'),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Increment view count
    await updateDoc(doc.ref, {
      'metrics.views': (data.metrics?.views || 0) + 1,
      'metrics.lastViewedAt': Timestamp.now(),
    });

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Place;
  } catch (error) {
    console.error('Error fetching place:', error);
    return null;
  }
}

/**
 * Get featured places
 */
export async function getFeaturedPlaces(limit: number = 6): Promise<Place[]> {
  try {
    const q = query(
      collection(db, 'places'),
      where('status', '==', 'published'),
      where('isFeatured', '==', true),
      orderBy('rating', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Place[];
  } catch (error) {
    console.error('Error fetching featured places:', error);
    return [];
  }
}

/**
 * Get popular places
 */
export async function getPopularPlaces(limit: number = 6): Promise<Place[]> {
  try {
    const q = query(
      collection(db, 'places'),
      where('status', '==', 'published'),
      orderBy('metrics.views', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Place[];
  } catch (error) {
    console.error('Error fetching popular places:', error);
    return [];
  }
}

/**
 * Get places by merchant
 */
export async function getPlacesByMerchant(merchantId: string): Promise<Place[]> {
  try {
    const q = query(
      collection(db, 'places'),
      where('merchantId', '==', merchantId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Place[];
  } catch (error) {
    console.error('Error fetching merchant places:', error);
    return [];
  }
}

/**
 * Calculate distance between two coordinates in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Create or update a place
 */
export async function upsertPlace(placeData: Partial<Place>, merchantId: string): Promise<string> {
  try {
    const now = Timestamp.now();
    
    if (placeData.id) {
      // Update existing place
      const placeRef = doc(db, 'places', placeData.id);
      await updateDoc(placeRef, {
        ...placeData,
        merchantId,
        updatedAt: now,
      });
      return placeData.id;
    } else {
      // Create new place
      const placeRef = doc(collection(db, 'places'));
      await setDoc(placeRef, {
        ...placeData,
        merchantId,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        metrics: {
          views: 0,
          clicks: 0,
          favorites: 0,
        },
      });
      return placeRef.id;
    }
  } catch (error) {
    console.error('Error upserting place:', error);
    throw error;
  }
}

/**
 * Delete a place
 */
export async function deletePlace(placeId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'places', placeId));
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
}