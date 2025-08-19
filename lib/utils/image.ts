import { storage } from '@guide-de-lyon/lib';
import { getDownloadURL, ref } from 'firebase/storage';

export interface ImageConfig {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Generates optimized image URLs from Firebase Storage paths
 */
export function getOptimizedImageUrl(
  storagePath: string,
  config: ImageConfig = {}
): string {
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    fit = 'cover'
  } = config;

  // Build transformation parameters
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('f', format);
  params.append('fit', fit);

  // For Firebase Storage, we'll use a transformation service
  // In production, you might want to use Firebase Extensions like Resize Images
  const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com/o/${encodeURIComponent(storagePath)}`;
  
  return `${baseUrl}?alt=media&${params.toString()}`;
}

/**
 * Generates responsive image sources for different screen sizes
 */
export function getResponsiveImageSources(
  storagePath: string,
  config: Omit<ImageConfig, 'width'> = {}
) {
  return {
    mobile: getOptimizedImageUrl(storagePath, { ...config, width: 640 }),
    tablet: getOptimizedImageUrl(storagePath, { ...config, width: 1024 }),
    desktop: getOptimizedImageUrl(storagePath, { ...config, width: 1920 }),
  };
}

/**
 * Generates srcSet for responsive images
 */
export function generateSrcSet(
  storagePath: string,
  widths: number[] = [640, 1024, 1920],
  config: Omit<ImageConfig, 'width'> = {}
): string {
  return widths
    .map(width => `${getOptimizedImageUrl(storagePath, { ...config, width })} ${width}w`)
    .join(', ');
}

/**
 * Gets Firebase Storage download URL
 */
export async function getFirebaseImageUrl(storagePath: string): Promise<string> {
  try {
    const imageRef = ref(storage, storagePath);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error getting Firebase image URL:', error);
    throw error;
  }
}

/**
 * Placeholder data URLs for different aspect ratios
 */
export const imagePlaceholders = {
  '16:9': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"%3E%3Crect width="16" height="9" fill="%23f1f5f9"/%3E%3C/svg%3E',
  '4:3': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"%3E%3Crect width="4" height="3" fill="%23f1f5f9"/%3E%3C/svg%3E',
  '1:1': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect width="1" height="1" fill="%23f1f5f9"/%3E%3C/svg%3E',
  '3:2': 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"%3E%3Crect width="3" height="2" fill="%23f1f5f9"/%3E%3C/svg%3E',
};

/**
 * Generates a blur placeholder from an image
 */
export function generateBlurPlaceholder(
  color: string = '#f1f5f9',
  width: number = 400,
  height: number = 300
): string {
  return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"%3E%3Crect width="${width}" height="${height}" fill="${encodeURIComponent(color)}"/%3E%3C/svg%3E`;
}

/**
 * Image optimization presets for common use cases
 */
export const imagePresets = {
  heroSlide: {
    width: 1920,
    height: 800,
    quality: 90,
    format: 'webp' as const,
    fit: 'cover' as const,
  },
  cardThumbnail: {
    width: 400,
    height: 300,
    quality: 85,
    format: 'webp' as const,
    fit: 'cover' as const,
  },
  galleryThumb: {
    width: 300,
    height: 200,
    quality: 80,
    format: 'webp' as const,
    fit: 'cover' as const,
  },
  avatar: {
    width: 100,
    height: 100,
    quality: 85,
    format: 'webp' as const,
    fit: 'cover' as const,
  },
  partnerLogo: {
    width: 200,
    height: 100,
    quality: 90,
    format: 'png' as const,
    fit: 'contain' as const,
  },
} as const;

/**
 * Critical images that should be preloaded
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.fetchPriority = priority;
  
  document.head.appendChild(link);
}

/**
 * Lazy loading intersection observer
 */
export function createLazyImageObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions = {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
}