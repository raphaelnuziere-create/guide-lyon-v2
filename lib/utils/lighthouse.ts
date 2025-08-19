/**
 * Lighthouse optimization utilities
 * Ensures performance scores >= 90
 */

// Critical CSS for above-the-fold content
export const criticalCSS = `
  /* Hero section critical styles */
  .hero-section {
    height: 100vh;
    min-height: 600px;
    position: relative;
    overflow: hidden;
  }

  .hero-content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .hero-image {
    position: absolute;
    inset: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  /* Navigation critical styles */
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Basic layout */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Typography */
  h1, h2, h3 {
    line-height: 1.2;
    font-weight: 700;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 4rem);
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  /* Loading states */
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Animation utilities */
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-fade-in-delay {
    animation: fadeIn 0.6s ease-out 0.3s both;
  }

  .animate-fade-in-delay-2 {
    animation: fadeIn 0.6s ease-out 0.6s both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Performance optimizations */
  img {
    content-visibility: auto;
  }

  .card {
    content-visibility: auto;
    contain-intrinsic-size: 300px;
  }

  /* Reduce layout shift */
  .aspect-16-10 {
    aspect-ratio: 16 / 10;
  }

  .aspect-4-3 {
    aspect-ratio: 4 / 3;
  }

  .aspect-1-1 {
    aspect-ratio: 1 / 1;
  }
`;

/**
 * Resource hints for critical resources
 */
export const resourceHints = [
  { url: '/fonts/inter.woff2', type: 'preload' as const },
  { url: 'https://fonts.googleapis.com', type: 'preconnect' as const },
  { url: 'https://firebasestorage.googleapis.com', type: 'preconnect' as const },
];

/**
 * Preload critical images
 */
export const criticalImages = [
  '/images/hero/lyon-overview.jpg',
  '/images/logo.png',
];

/**
 * Service Worker configuration
 */
export const serviceWorkerConfig = {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
  ],
};

/**
 * Web Vitals thresholds
 */
export const webVitalsThresholds = {
  lcp: 2500, // Largest Contentful Paint
  fid: 100,  // First Input Delay
  cls: 0.1,  // Cumulative Layout Shift
  fcp: 1800, // First Contentful Paint
  ttfb: 800, // Time to First Byte
};

/**
 * Performance budget
 */
export const performanceBudget = {
  javascript: 250 * 1024,    // 250KB
  css: 50 * 1024,           // 50KB
  images: 1024 * 1024,      // 1MB
  fonts: 100 * 1024,        // 100KB
  total: 2 * 1024 * 1024,   // 2MB
};

/**
 * Critical path optimization
 */
export class LighthouseOptimizer {
  static inlineCriticalCSS() {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }

  static preloadCriticalResources() {
    if (typeof document === 'undefined') return;

    // Preload critical images
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });

    // Add resource hints
    resourceHints.forEach(({ url, type }) => {
      const link = document.createElement('link');
      link.rel = type;
      link.href = url;
      if (type === 'preload') {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  static optimizeImages() {
    if (typeof document === 'undefined') return;

    // Add loading="lazy" to below-fold images
    const images = document.querySelectorAll('img');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    images.forEach((img, index) => {
      if (index > 3) { // Lazy load images after the first 3
        observer.observe(img);
      }
    });
  }

  static minimizeLayoutShift() {
    if (typeof document === 'undefined') return;

    // Add explicit dimensions to prevent layout shift
    const style = document.createElement('style');
    style.textContent = `
      .card-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      
      .hero-image {
        width: 100%;
        height: 100vh;
        object-fit: cover;
      }
      
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      
      .partner-logo {
        width: 200px;
        height: 100px;
        object-fit: contain;
      }
    `;
    document.head.appendChild(style);
  }

  static optimizeThirdPartyScripts() {
    if (typeof document === 'undefined') return;

    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script) => {
      if (!script.getAttribute('defer') && !script.getAttribute('async')) {
        script.setAttribute('defer', '');
      }
    });
  }

  static enableServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js').catch(console.error);
  }

  static async measurePerformance() {
    if (typeof window === 'undefined') return null;

    return new Promise((resolve) => {
      const metrics: any = {};

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // First Contentful Paint
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          metrics.fcp = entry.startTime;
        });
      }).observe({ entryTypes: ['paint'] });

      // Time to First Byte
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
      }

      setTimeout(() => resolve(metrics), 5000);
    });
  }

  static initializeOptimizations() {
    if (typeof window === 'undefined') return;

    // Initialize all optimizations
    this.inlineCriticalCSS();
    this.preloadCriticalResources();
    this.optimizeImages();
    this.minimizeLayoutShift();
    this.optimizeThirdPartyScripts();
    this.enableServiceWorker();

    // Measure performance after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.measurePerformance().then((metrics) => {
          if (metrics && window.gtag) {
            window.gtag('event', 'lighthouse_score', {
              event_category: 'performance',
              lcp: metrics.lcp,
              fid: metrics.fid,
              cls: metrics.cls,
              fcp: metrics.fcp,
              ttfb: metrics.ttfb,
            });
          }
        });
      }, 1000);
    });
  }
}