'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@guide-de-lyon/ui';
import { Input } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { MapSkeleton } from '../ui/skeleton';
import { useInView } from 'react-intersection-observer';
import { MapPin, Search, Filter, Layers, Navigation } from 'lucide-react';
import type { InteractiveMapSectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface InteractiveMapSectionProps {
  config: InteractiveMapSectionConfig;
  loading?: boolean;
}

interface MapFilter {
  id: string;
  name: string;
  active: boolean;
  count: number;
}

export function InteractiveMapSection({ config, loading = false }: InteractiveMapSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Sample filters based on categories
  const [filters, setFilters] = useState<MapFilter[]>([
    { id: 'restaurant', name: t('categories.restaurants'), active: false, count: 150 },
    { id: 'hotel', name: t('categories.hotels'), active: false, count: 45 },
    { id: 'culture', name: t('categories.culture'), active: false, count: 30 },
    { id: 'shop', name: t('categories.shops'), active: false, count: 200 },
    { id: 'service', name: t('categories.services'), active: false, count: 80 },
    { id: 'sport', name: t('categories.sports'), active: false, count: 25 },
  ]);

  useEffect(() => {
    if (inView && !mapLoaded) {
      // Simulate map loading
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [inView, mapLoaded]);

  if (loading) {
    return <MapSkeleton />;
  }

  if (!config.enabled) {
    return null;
  }

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
    
    setFilters(prev => 
      prev.map(filter => 
        filter.id === filterId 
          ? { ...filter, active: !filter.active }
          : filter
      )
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const MockMap = () => (
    <div 
      className="relative w-full rounded-lg overflow-hidden bg-muted"
      style={{ height: `${config.height}px` }}
    >
      {!mapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">{t('common.loading_map')}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Sample Map Markers */}
          <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="absolute bottom-1/3 left-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="h-4 w-4 text-white" />
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-white">
              <Navigation className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-white">
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-white font-bold">
              +
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-white font-bold">
              −
            </Button>
          </div>

          {/* Location Info Card */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <h4 className="font-semibold mb-1">Vieux Lyon</h4>
            <p className="text-sm text-muted-foreground mb-2">Quartier historique de Lyon</p>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="text-xs">Culture</Badge>
              <Badge variant="secondary" className="text-xs">UNESCO</Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {config.title?.[locale as keyof I18nField] || config.title?.fr || t('homepage.map.title')}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground">
              {config.subtitle[locale as keyof I18nField] || config.subtitle.fr}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            {config.showSearch && (
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t('map.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
            )}

            {/* Filter Toggle */}
            {config.showFilters && (
              <Button variant="outline" className="lg:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                {t('common.filters')}
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            )}
          </div>

          {/* Category Filters */}
          {config.showFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={filter.active ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(filter.id)}
                  className="text-sm"
                >
                  {filter.name}
                  <Badge 
                    variant={filter.active ? "secondary" : "outline"} 
                    className="ml-2"
                  >
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          )}

          {/* Interactive Map */}
          <MockMap />

          {/* Map Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>{t('categories.restaurants')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>{t('categories.hotels')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>{t('categories.culture')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>{t('categories.shops')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span>{t('categories.services')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>{t('categories.sports')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Default configuration for interactive map section
export const defaultInteractiveMapConfig: InteractiveMapSectionConfig = {
  id: 'interactive_map',
  type: 'interactive_map',
  enabled: true,
  order: 8,
  title: {
    fr: 'Explorez Lyon sur la Carte',
    en: 'Explore Lyon on the Map',
    it: 'Esplora Lione sulla Mappa',
    es: 'Explora Lyon en el Mapa',
  },
  subtitle: {
    fr: 'Découvrez tous les lieux remarquables de Lyon en un coup d\'œil',
    en: 'Discover all the remarkable places in Lyon at a glance',
    it: 'Scopri tutti i luoghi notevoli di Lione a colpo d\'occhio',
    es: 'Descubre todos los lugares notables de Lyon de un vistazo',
  },
  defaultCenter: {
    lat: 45.7640,
    lng: 4.8357,
  },
  defaultZoom: 13,
  showFilters: true,
  showSearch: true,
  height: 400,
  categories: ['restaurant', 'hotel', 'culture', 'shop', 'service', 'sport'],
  displayMode: 'grid',
  dataMode: 'auto',
  maxItems: 100,
};