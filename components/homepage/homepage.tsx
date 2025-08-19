'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from './hero-section';
import { NewsSection } from './news-section';
import { ThematicDiscoveriesSection } from './thematic-discoveries-section';
import { FeaturedDirectorySection } from './featured-directory-section';
import { EventsSection } from './events-section';
import { MerchantCtaSection } from './merchant-cta-section';
import { NewsletterSection } from './newsletter-section';
import { PartnersSection } from './partners-section';
import { InteractiveMapSection } from './interactive-map-section';
import { measureCoreWebVitals, criticalPathOptimizer } from '../../lib/utils/performance';
import type { HomepageConfig, SectionConfig } from '@guide-de-lyon/lib/schemas/homepage';

interface HomepageProps {
  config: HomepageConfig;
  data: {
    news?: any[];
    places?: any[];
    events?: any[];
  };
  loading?: boolean;
}

export function Homepage({ config, data, loading = false }: HomepageProps) {
  const [performanceMetrics, setPerformanceMetrics] = useState<any>({});

  useEffect(() => {
    // Measure Core Web Vitals
    measureCoreWebVitals((metrics) => {
      setPerformanceMetrics(metrics);
      
      // Send metrics to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'performance',
          event_label: 'homepage',
          value: metrics.lcp || 0,
          custom_parameter_1: metrics.fid || 0,
          custom_parameter_2: metrics.cls || 0,
        });
      }
    });

    // Preload critical resources
    criticalPathOptimizer.preloadCriticalResources();
  }, []);

  // Sort sections by order
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  const renderSection = (section: SectionConfig) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case 'hero':
        return (
          <HeroSection
            key={section.id}
            config={section}
            loading={loading}
          />
        );
      
      case 'news':
        return (
          <NewsSection
            key={section.id}
            config={section}
            articles={data.news || []}
            loading={loading}
          />
        );
      
      case 'thematic_discoveries':
        return (
          <ThematicDiscoveriesSection
            key={section.id}
            config={section}
            loading={loading}
          />
        );
      
      case 'featured_directory':
        return (
          <FeaturedDirectorySection
            key={section.id}
            config={section}
            places={data.places || []}
            loading={loading}
          />
        );
      
      case 'events':
        return (
          <EventsSection
            key={section.id}
            config={section}
            events={data.events || []}
            loading={loading}
          />
        );
      
      case 'merchant_cta':
        return (
          <MerchantCtaSection
            key={section.id}
            config={section}
            loading={loading}
          />
        );
      
      case 'newsletter':
        return (
          <NewsletterSection
            key={section.id}
            config={section}
            loading={loading}
          />
        );
      
      case 'partners':
        return (
          <PartnersSection
            key={section.id}
            config={section}
            loading={loading}
          />
        );
      
      case 'interactive_map':
        return (
          <InteractiveMapSection
            key={section.id}
            config={section}
            loading={loading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <main className="flex flex-col">
      {sortedSections.map(renderSection)}
      
      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
          <h4 className="font-bold mb-2">Performance Metrics</h4>
          {performanceMetrics.lcp && (
            <div>LCP: {Math.round(performanceMetrics.lcp)}ms</div>
          )}
          {performanceMetrics.fid && (
            <div>FID: {Math.round(performanceMetrics.fid)}ms</div>
          )}
          {performanceMetrics.cls && (
            <div>CLS: {performanceMetrics.cls.toFixed(3)}</div>
          )}
          {performanceMetrics.fcp && (
            <div>FCP: {Math.round(performanceMetrics.fcp)}ms</div>
          )}
        </div>
      )}
    </main>
  );
}

export default Homepage;