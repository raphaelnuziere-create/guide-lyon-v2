'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@guide-de-lyon/ui';
import { ThematicDiscoveriesSkeleton } from '../ui/skeleton';
import { getOptimizedImageUrl, imagePresets } from '../../lib/utils/image';
import { useInView } from 'react-intersection-observer';
import { 
  MapPin, 
  Utensils, 
  Music, 
  Palette, 
  Users, 
  Route,
  Building,
  Coffee,
  Camera,
  Heart
} from 'lucide-react';
import type { ThematicDiscoveriesSectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface ThematicTheme {
  id: string;
  slug: string;
  title: I18nField;
  description: I18nField;
  icon: string;
  image: string;
  enabled: boolean;
  order: number;
  ctaUrl: string;
  count?: number; // Number of items in this category
}

interface ThematicDiscoveriesSectionProps {
  config: ThematicDiscoveriesSectionConfig;
  loading?: boolean;
}

// Icon mapping
const iconMap = {
  'map-pin': MapPin,
  'utensils': Utensils,
  'music': Music,
  'palette': Palette,
  'users': Users,
  'route': Route,
  'building': Building,
  'coffee': Coffee,
  'camera': Camera,
  'heart': Heart,
};

export function ThematicDiscoveriesSection({ config, loading = false }: ThematicDiscoveriesSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (loading) {
    return <ThematicDiscoveriesSkeleton />;
  }

  if (!config.enabled || config.themes.length === 0) {
    return null;
  }

  const enabledThemes = config.themes
    .filter(theme => theme.enabled)
    .sort((a, b) => a.order - b.order);

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || MapPin;
    return IconComponent;
  };

  const renderThemeCard = (theme: ThematicTheme, index: number) => {
    const IconComponent = getIcon(theme.icon);

    return (
      <Link key={theme.id} href={theme.ctaUrl} className="group">
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={getOptimizedImageUrl(theme.image, imagePresets.cardThumbnail)}
              alt={theme.title[locale as keyof I18nField] || theme.title.fr}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading={index < 6 ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center space-x-2 text-white">
                <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {theme.title[locale as keyof I18nField] || theme.title.fr}
                  </h3>
                  {theme.count && (
                    <p className="text-xs opacity-90">
                      {t('common.items_count', { count: theme.count })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              {theme.title[locale as keyof I18nField] || theme.title.fr}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {theme.description[locale as keyof I18nField] || theme.description.fr}
            </p>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const renderThemeIcon = (theme: ThematicTheme, index: number) => {
    const IconComponent = getIcon(theme.icon);

    return (
      <Link key={theme.id} href={theme.ctaUrl} className="group">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110 transform duration-300">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {theme.title[locale as keyof I18nField] || theme.title.fr}
            </h3>
            {theme.count && (
              <p className="text-xs text-muted-foreground">
                {t('common.items_count', { count: theme.count })}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const GridView = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {enabledThemes.slice(0, config.maxItems).map((theme, index) => 
        renderThemeCard(theme, index)
      )}
    </div>
  );

  const IconGridView = () => (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {enabledThemes.slice(0, config.maxItems).map((theme, index) => 
        renderThemeIcon(theme, index)
      )}
    </div>
  );

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {config.title?.[locale as keyof I18nField] || config.title?.fr || t('homepage.thematic_discoveries.title')}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground">
              {config.subtitle[locale as keyof I18nField] || config.subtitle.fr}
            </p>
          )}
        </div>

        {config.displayMode === 'grid' && <GridView />}
        {(config.displayMode === 'list' || !config.displayMode) && <IconGridView />}
      </div>
    </section>
  );
}

// Default configuration for thematic discoveries section
export const defaultThematicDiscoveriesConfig: ThematicDiscoveriesSectionConfig = {
  id: 'thematic_discoveries',
  type: 'thematic_discoveries',
  enabled: true,
  order: 2,
  title: {
    fr: 'Découvertes Thématiques',
    en: 'Thematic Discoveries',
    it: 'Scoperte Tematiche',
    es: 'Descubrimientos Temáticos',
  },
  subtitle: {
    fr: 'Explorez Lyon selon vos passions',
    en: 'Explore Lyon according to your passions',
    it: 'Esplora Lione secondo le tue passioni',
    es: 'Explora Lyon según tus pasiones',
  },
  displayMode: 'list',
  dataMode: 'curated',
  maxItems: 6,
  themes: [
    {
      id: 'accommodation',
      slug: 'accommodation',
      title: {
        fr: 'Hébergement',
        en: 'Accommodation',
        it: 'Alloggio',
        es: 'Alojamiento',
      },
      description: {
        fr: 'Trouvez l\'hébergement parfait pour votre séjour',
        en: 'Find the perfect accommodation for your stay',
        it: 'Trova l\'alloggio perfetto per il tuo soggiorno',
        es: 'Encuentra el alojamiento perfecto para tu estancia',
      },
      icon: 'building',
      image: '/images/themes/accommodation.jpg',
      enabled: true,
      order: 0,
      ctaUrl: '/accommodation',
    },
    {
      id: 'restaurants',
      slug: 'restaurants',
      title: {
        fr: 'Restaurants',
        en: 'Restaurants',
        it: 'Ristoranti',
        es: 'Restaurantes',
      },
      description: {
        fr: 'Découvrez la gastronomie lyonnaise authentique',
        en: 'Discover authentic Lyon cuisine',
        it: 'Scopri l\'autentica cucina lionese',
        es: 'Descubre la auténtica cocina lionesa',
      },
      icon: 'utensils',
      image: '/images/themes/restaurants.jpg',
      enabled: true,
      order: 1,
      ctaUrl: '/restaurants',
    },
    {
      id: 'nightlife',
      slug: 'nightlife',
      title: {
        fr: 'Sorties',
        en: 'Nightlife',
        it: 'Vita Notturna',
        es: 'Vida Nocturna',
      },
      description: {
        fr: 'Bars, clubs et soirées inoubliables',
        en: 'Bars, clubs and unforgettable nights',
        it: 'Bar, club e notti indimenticabili',
        es: 'Bares, clubs y noches inolvidables',
      },
      icon: 'music',
      image: '/images/themes/nightlife.jpg',
      enabled: true,
      order: 2,
      ctaUrl: '/nightlife',
    },
    {
      id: 'culture',
      slug: 'culture',
      title: {
        fr: 'Culture',
        en: 'Culture',
        it: 'Cultura',
        es: 'Cultura',
      },
      description: {
        fr: 'Musées, théâtres et patrimoine lyonnais',
        en: 'Museums, theaters and Lyon heritage',
        it: 'Musei, teatri e patrimonio lionese',
        es: 'Museos, teatros y patrimonio lionés',
      },
      icon: 'palette',
      image: '/images/themes/culture.jpg',
      enabled: true,
      order: 3,
      ctaUrl: '/culture',
    },
    {
      id: 'family',
      slug: 'family',
      title: {
        fr: 'Famille',
        en: 'Family',
        it: 'Famiglia',
        es: 'Familia',
      },
      description: {
        fr: 'Activités parfaites pour toute la famille',
        en: 'Perfect activities for the whole family',
        it: 'Attività perfette per tutta la famiglia',
        es: 'Actividades perfectas para toda la familia',
      },
      icon: 'users',
      image: '/images/themes/family.jpg',
      enabled: true,
      order: 4,
      ctaUrl: '/family',
    },
    {
      id: 'itineraries',
      slug: 'itineraries',
      title: {
        fr: 'Itinéraires',
        en: 'Itineraries',
        it: 'Itinerari',
        es: 'Itinerarios',
      },
      description: {
        fr: 'Parcours guidés pour découvrir Lyon',
        en: 'Guided tours to discover Lyon',
        it: 'Tour guidati per scoprire Lione',
        es: 'Tours guiados para descubrir Lyon',
      },
      icon: 'route',
      image: '/images/themes/itineraries.jpg',
      enabled: true,
      order: 5,
      ctaUrl: '/itineraries',
    },
  ],
};