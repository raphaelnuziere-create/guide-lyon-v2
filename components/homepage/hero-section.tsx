'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@guide-de-lyon/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselDots, type CarouselApi } from '../ui/carousel';
import { HeroSkeleton } from '../ui/skeleton';
import { getOptimizedImageUrl, imagePresets, preloadImage } from '../../lib/utils/image';
import { useInView } from 'react-intersection-observer';
import type { HeroSectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface HeroSlide {
  id: string;
  image: string;
  title: I18nField;
  subtitle?: I18nField;
  ctaText?: I18nField;
  ctaUrl?: string;
  enabled: boolean;
  order: number;
}

interface HeroSectionProps {
  config: HeroSectionConfig;
  loading?: boolean;
}

export function HeroSection({ config, loading = false }: HeroSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const enabledSlides = config.slides
    .filter(slide => slide.enabled)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api || !config.autoPlay || !inView) return;

    const play = () => {
      autoPlayRef.current = setTimeout(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
        play();
      }, config.autoPlayDelay || 5000);
    };

    play();

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [api, config.autoPlay, config.autoPlayDelay, inView]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!api || !config.autoPlay) return;
    
    const play = () => {
      autoPlayRef.current = setTimeout(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
        play();
      }, config.autoPlayDelay || 5000);
    };
    
    play();
  };

  // Preload critical images
  useEffect(() => {
    if (enabledSlides.length > 0) {
      const firstSlideImage = getOptimizedImageUrl(enabledSlides[0].image, imagePresets.heroSlide);
      preloadImage(firstSlideImage, 'high');
    }
  }, [enabledSlides]);

  if (loading) {
    return <HeroSkeleton />;
  }

  if (!config.enabled || enabledSlides.length === 0) {
    return null;
  }

  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section 
      ref={ref}
      className="relative h-[600px] lg:h-[800px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel 
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="h-full w-full"
      >
        <CarouselContent className="h-full">
          {enabledSlides.map((slide, index) => (
            <CarouselItem key={slide.id} className="h-full">
              <div className="relative h-full w-full">
                {/* Background Image */}
                <Image
                  src={getOptimizedImageUrl(slide.image, imagePresets.heroSlide)}
                  alt={slide.title[locale as keyof I18nField] || slide.title.fr}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center text-white">
                      <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
                        {slide.title[locale as keyof I18nField] || slide.title.fr}
                      </h1>
                      
                      {slide.subtitle && (
                        <p className="text-xl lg:text-2xl mb-8 opacity-90 animate-fade-in-delay">
                          {slide.subtitle[locale as keyof I18nField] || slide.subtitle.fr}
                        </p>
                      )}
                      
                      {slide.ctaText && slide.ctaUrl && (
                        <div className="animate-fade-in-delay-2">
                          <Button asChild size="lg" className="text-lg px-8 py-3">
                            <Link href={slide.ctaUrl}>
                              {slide.ctaText[locale as keyof I18nField] || slide.ctaText.fr}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        {config.showArrows && enabledSlides.length > 1 && (
          <>
            <button
              onClick={() => api?.scrollPrev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
              aria-label="Previous slide"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center text-white"
              aria-label="Next slide"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </Carousel>
      
      {/* Dots Navigation */}
      {config.showDots && enabledSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <CarouselDots
            count={count}
            activeIndex={current - 1}
            onDotClick={handleDotClick}
            className="space-x-3"
          />
        </div>
      )}
    </section>
  );
}

// Default configuration for the hero section
export const defaultHeroConfig: HeroSectionConfig = {
  id: 'hero',
  type: 'hero',
  enabled: true,
  order: 0,
  slides: [
    {
      id: 'slide-1',
      image: '/images/hero/lyon-overview.jpg',
      title: {
        fr: 'Découvrez Lyon',
        en: 'Discover Lyon',
        it: 'Scopri Lione',
        es: 'Descubre Lyon',
      },
      subtitle: {
        fr: 'Votre guide complet de la capitale des Gaules',
        en: 'Your complete guide to the capital of Gaul',
        it: 'La tua guida completa alla capitale della Gallia',
        es: 'Tu guía completa de la capital de las Galias',
      },
      ctaText: {
        fr: 'Explorer maintenant',
        en: 'Explore now',
        it: 'Esplora ora',
        es: 'Explorar ahora',
      },
      ctaUrl: '/directory',
      enabled: true,
      order: 0,
    },
  ],
  autoPlay: true,
  autoPlayDelay: 5000,
  showDots: true,
  showArrows: true,
  displayMode: 'slider',
  dataMode: 'curated',
  maxItems: 5,
};