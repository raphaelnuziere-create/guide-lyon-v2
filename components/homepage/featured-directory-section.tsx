'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { CardSkeleton } from '../ui/skeleton';
import { getOptimizedImageUrl, imagePresets } from '../../lib/utils/image';
import { useInView } from 'react-intersection-observer';
import { MapPin, Star, Clock, Phone, ExternalLink, Zap } from 'lucide-react';
import type { FeaturedDirectorySectionConfig } from '@guide-de-lyon/lib/schemas/homepage';
import type { Place } from '@guide-de-lyon/lib/schemas/place';

interface FeaturedDirectorySectionProps {
  config: FeaturedDirectorySectionConfig;
  places: Place[];
  loading?: boolean;
}

export function FeaturedDirectorySection({ config, places, loading = false }: FeaturedDirectorySectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!config.enabled || places.length === 0) {
    return null;
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      restaurant: t('categories.restaurant'),
      bar: t('categories.bar'),
      hotel: t('categories.hotel'),
      shop: t('categories.shop'),
      service: t('categories.service'),
      culture: t('categories.culture'),
      sport: t('categories.sport'),
    };
    return categoryMap[category] || category;
  };

  const formatHours = (hours: any) => {
    if (!hours || hours.length === 0) return null;
    const today = new Date().getDay();
    const todayHours = hours.find((h: any) => h.day === today);
    if (!todayHours) return null;
    return `${todayHours.open} - ${todayHours.close}`;
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderPlaceCard = (place: Place, index: number) => (
    <Card key={place.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={place.images[0] ? getOptimizedImageUrl(place.images[0], imagePresets.cardThumbnail) : '/images/placeholder-place.jpg'}
          alt={place.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading={index < 6 ? 'eager' : 'lazy'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Boost badge */}
        {place.boost?.active && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
              <Zap className="h-3 w-3 mr-1" />
              {t('common.featured')}
            </Badge>
          </div>
        )}
        
        {/* Category badge */}
        {config.showCategory && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary">
              {getCategoryLabel(place.category)}
            </Badge>
          </div>
        )}
        
        {/* Rating overlay */}
        {config.showRating && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              {renderRating(4.5)} {/* This would come from actual rating data */}
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            <Link href={`/places/${place.slug}`}>
              {place.name}
            </Link>
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {place.description}
          </p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {place.address.street}, {place.address.city}
            </span>
          </div>
          
          {formatHours(place.hours) && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{formatHours(place.hours)}</span>
            </div>
          )}
          
          {place.contact.phone && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{place.contact.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>{place.metrics.views} {t('common.views')}</span>
            {config.showDistance && (
              <span>1.2 km</span> // This would be calculated based on user location
            )}
          </div>
          
          {place.contact.website && (
            <Link 
              href={place.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {places.slice(0, config.maxItems).map((place, index) => 
        renderPlaceCard(place, index)
      )}
    </div>
  );

  const SliderView = () => (
    <Carousel
      opts={{
        align: 'start',
        slidesToScroll: 1,
      }}
      className="w-full"
    >
      <CarouselContent>
        {places.slice(0, config.maxItems).map((place, index) => (
          <CarouselItem key={place.id} className="md:basis-1/2 lg:basis-1/3">
            {renderPlaceCard(place, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

  const ListView = () => (
    <div className="space-y-4">
      {places.slice(0, config.maxItems).map((place, index) => (
        <Card key={place.id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative aspect-[16/10] md:aspect-square md:w-48 overflow-hidden">
                <Image
                  src={place.images[0] ? getOptimizedImageUrl(place.images[0], imagePresets.cardThumbnail) : '/images/placeholder-place.jpg'}
                  alt={place.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
              
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      {config.showCategory && (
                        <Badge variant="secondary">
                          {getCategoryLabel(place.category)}
                        </Badge>
                      )}
                      {place.boost?.active && (
                        <Badge className="bg-yellow-500 text-yellow-900">
                          <Zap className="h-3 w-3 mr-1" />
                          {t('common.featured')}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      <Link href={`/places/${place.slug}`}>
                        {place.name}
                      </Link>
                    </h3>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {place.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{place.address.street}, {place.address.city}</span>
                    </div>
                  </div>
                  
                  {config.showRating && (
                    <div className="ml-4">
                      {renderRating(4.5)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {config.title?.[locale as keyof any] || config.title?.fr || t('homepage.featured_directory.title')}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground">
              {config.subtitle[locale as keyof any] || config.subtitle.fr}
            </p>
          )}
        </div>

        {config.displayMode === 'grid' && <GridView />}
        {config.displayMode === 'slider' && <SliderView />}
        {config.displayMode === 'list' && <ListView />}

        {places.length > config.maxItems && (
          <div className="text-center mt-8">
            <Link 
              href="/directory"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              {t('common.view_all_directory')}
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Default configuration for featured directory section
export const defaultFeaturedDirectoryConfig: FeaturedDirectorySectionConfig = {
  id: 'featured_directory',
  type: 'featured_directory',
  enabled: true,
  order: 3,
  title: {
    fr: 'Lieux en Vedette',
    en: 'Featured Places',
    it: 'Luoghi in Evidenza',
    es: 'Lugares Destacados',
  },
  subtitle: {
    fr: 'Découvrez les meilleurs établissements de Lyon',
    en: 'Discover the best establishments in Lyon',
    it: 'Scopri i migliori locali di Lione',
    es: 'Descubre los mejores establecimientos de Lyon',
  },
  displayMode: 'grid',
  dataMode: 'auto',
  maxItems: 6,
  autoQuery: {
    boosted: true,
    sortBy: 'boost',
  },
  curatedIds: [],
  showRating: true,
  showCategory: true,
  showDistance: false,
};