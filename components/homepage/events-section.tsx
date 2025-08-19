'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { Button } from '@guide-de-lyon/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { EventsSkeleton } from '../ui/skeleton';
import { getOptimizedImageUrl, imagePresets } from '../../lib/utils/image';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Clock, Euro, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { EventsSectionConfig } from '@guide-de-lyon/lib/schemas/homepage';
import type { Event } from '@guide-de-lyon/lib/schemas/event';

interface EventsSectionProps {
  config: EventsSectionConfig;
  events: Event[];
  loading?: boolean;
}

export function EventsSection({ config, events, loading = false }: EventsSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (loading) {
    return <EventsSkeleton />;
  }

  if (!config.enabled || events.length === 0) {
    return null;
  }

  const formatEventDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatEventTime = (timeString: string) => {
    return timeString;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      concert: t('event_categories.concert'),
      expo: t('event_categories.expo'),
      festival: t('event_categories.festival'),
      sport: t('event_categories.sport'),
      theatre: t('event_categories.theatre'),
      conference: t('event_categories.conference'),
      other: t('event_categories.other'),
    };
    return categoryMap[category] || category;
  };

  const formatPrice = (price: any) => {
    if (price.type === 'free') {
      return t('common.free');
    }
    if (price.type === 'donation') {
      return t('common.donation');
    }
    if (price.min && price.max) {
      return `${price.min}€ - ${price.max}€`;
    }
    if (price.min) {
      return `${t('common.from')} ${price.min}€`;
    }
    return t('common.paid');
  };

  const renderMiniCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const hasEvents = events.some(event => 
        new Date(event.startDate).toDateString() === date.toDateString()
      );
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = today.toDateString() === date.toDateString();
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            h-8 w-8 text-sm rounded-lg transition-colors
            ${isSelected ? 'bg-primary text-primary-foreground' : ''}
            ${isToday && !isSelected ? 'bg-muted font-semibold' : ''}
            ${hasEvents ? 'relative ring-2 ring-primary/20' : ''}
            ${!hasEvents && !isSelected && !isToday ? 'hover:bg-muted/50' : ''}
          `}
        >
          {day}
          {hasEvents && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 bg-primary rounded-full"></div>
          )}
        </button>
      );
    }
    
    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            {new Intl.DateTimeFormat(locale, { 
              month: 'long',
              year: 'numeric' 
            }).format(today)}
          </h3>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="h-8 flex items-center justify-center text-xs text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const renderEventCard = (event: Event, index: number) => (
    <Card key={event.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.images[0] ? getOptimizedImageUrl(event.images[0], imagePresets.cardThumbnail) : '/images/placeholder-event.jpg'}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading={index < 4 ? 'eager' : 'lazy'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {event.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-yellow-500 text-yellow-900">
              {t('common.featured')}
            </Badge>
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge variant="secondary">
            {getCategoryLabel(event.category)}
          </Badge>
        </div>
        
        {config.showDate && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium">
              {formatEventDate(new Date(event.startDate))}
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/events/${event.slug}`}>
              {event.title}
            </Link>
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {event.description}
          </p>
        </div>
        
        <div className="space-y-2 text-sm">
          {config.showDate && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {formatEventDate(new Date(event.startDate))} 
                {event.schedule[0] && ` à ${formatEventTime(event.schedule[0].startTime)}`}
              </span>
            </div>
          )}
          
          {config.showLocation && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location.name}</span>
            </div>
          )}
          
          {config.showPrice && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Euro className="h-4 w-4 flex-shrink-0" />
              <span>{formatPrice(event.price)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {event.metrics.views} {t('common.views')}
          </div>
          
          {event.ticketUrl && (
            <Link 
              href={event.ticketUrl}
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {events.slice(0, config.maxItems).map((event, index) => 
        renderEventCard(event, index)
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
        {events.slice(0, config.maxItems).map((event, index) => (
          <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/4">
            {renderEventCard(event, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {config.title?.[locale as keyof any] || config.title?.fr || t('navigation.agenda')}
              </h2>
              {config.subtitle && (
                <p className="text-lg text-muted-foreground">
                  {config.subtitle[locale as keyof any] || config.subtitle.fr}
                </p>
              )}
            </div>

            {config.displayMode === 'grid' && <GridView />}
            {config.displayMode === 'slider' && <SliderView />}

            {events.length > config.maxItems && (
              <div className="text-center mt-8">
                <Link 
                  href="/agenda"
                  className="inline-flex items-center text-primary hover:underline font-medium"
                >
                  {t('common.view_all_events')}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mini calendar sidebar */}
          {config.showCalendar && (
            <div className="lg:w-80">
              {renderMiniCalendar()}
              
              {/* Quick filters */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-sm">{t('common.quick_filters')}</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    {t('common.today')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('common.this_week')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('common.weekend')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('common.free_events')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Default configuration for events section
export const defaultEventsConfig: EventsSectionConfig = {
  id: 'events',
  type: 'events',
  enabled: true,
  order: 4,
  title: {
    fr: 'Événements à Lyon',
    en: 'Events in Lyon',
    it: 'Eventi a Lione',
    es: 'Eventos en Lyon',
  },
  subtitle: {
    fr: 'Ne manquez aucun événement dans la région lyonnaise',
    en: 'Don\'t miss any events in the Lyon region',
    it: 'Non perdere nessun evento nella regione di Lione',
    es: 'No te pierdas ningún evento en la región de Lyon',
  },
  displayMode: 'grid',
  dataMode: 'auto',
  maxItems: 8,
  autoQuery: {
    featured: true,
    dateRange: 'month',
    sortBy: 'startDate',
  },
  curatedIds: [],
  showCalendar: true,
  showDate: true,
  showLocation: true,
  showPrice: true,
};