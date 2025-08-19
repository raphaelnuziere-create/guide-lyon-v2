/**
 * Performance monitoring and optimization utilities
 */

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

/**
 * Measures and reports Core Web Vitals
 */
export function measureCoreWebVitals(callback: (metrics: PerformanceMetrics) => void) {
  if (typeof window === 'undefined') return;

  const metrics: PerformanceMetrics = {};

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry;
    metrics.lcp = lastEntry.startTime;
    callback(metrics);
  });
  
  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported
  }

  // First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      metrics.fid = entry.processingStart - entry.startTime;
      callback(metrics);
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported
  }

  // Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const layoutShift = entry as any;
      if (!layoutShift.hadRecentInput) {
        clsValue += layoutShift.value;
      }
    }
    metrics.cls = clsValue;
    callback(metrics);
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // CLS not supported
  }

  // First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      metrics.fcp = entry.startTime;
      callback(metrics);
    });
  });

  try {
    fcpObserver.observe({ entryTypes: ['paint'] });
  } catch (e) {
    // FCP not supported
  }

  // Time to First Byte
  if ('navigation' in performance) {
    const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
    callback(metrics);
  }
}

/**
 * Critical CSS inlining helper
 */
export function inlineCriticalCSS(cssContent: string): void {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = cssContent;
  style.setAttribute('data-critical', 'true');
  document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Resource hints for better performance
 */
export function addResourceHints(resources: Array<{ url: string; type: 'preload' | 'prefetch' | 'preconnect' }>) {
  if (typeof document === 'undefined') return;

  resources.forEach(({ url, type }) => {
    const link = document.createElement('link');
    link.rel = type;
    link.href = url;
    
    if (type === 'preload') {
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function throttledFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px 100px 0px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(imageUrls: string[]) {
  if (typeof document === 'undefined') return;

  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
}

/**
 * Font loading optimization
 */
export function preloadFonts(fontUrls: string[]) {
  if (typeof document === 'undefined') return;

  fontUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Service Worker registration for caching
 */
export function registerServiceWorker(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(null);
  }

  return navigator.serviceWorker
    .register(swPath)
    .then((registration) => {
      console.log('SW registered: ', registration);
      return registration;
    })
    .catch((registrationError) => {
      console.log('SW registration failed: ', registrationError);
      return null;
    });
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage(): any {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }

  return (performance as any).memory;
}

/**
 * Network connection monitoring
 */
export function getNetworkInfo(): any {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return null;
  }

  return (navigator as any).connection;
}

/**
 * Bundle size analyzer helper
 */
export function logBundleSize(chunkName: string, size: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Bundle size for ${chunkName}: ${(size / 1024).toFixed(2)}KB`);
  }
}

/**
 * Critical rendering path optimization
 */
export class CriticalPathOptimizer {
  private criticalResources: Set<string> = new Set();
  
  addCriticalResource(url: string) {
    this.criticalResources.add(url);
  }
  
  preloadCriticalResources() {
    this.criticalResources.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });
  }
}

export const criticalPathOptimizer = new CriticalPathOptimizer();