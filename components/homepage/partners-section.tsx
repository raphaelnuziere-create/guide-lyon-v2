'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { PartnersSkeleton } from '../ui/skeleton';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import type { PartnersSectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
  enabled: boolean;
  order: number;
}

interface PartnersSectionProps {
  config: PartnersSectionConfig;
  loading?: boolean;
}

export function PartnersSection({ config, loading = false }: PartnersSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [api, setApi] = useState<any>();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (loading) {
    return <PartnersSkeleton />;
  }

  if (!config.enabled || config.partners.length === 0) {
    return null;
  }

  const enabledPartners = config.partners
    .filter(partner => partner.enabled)
    .sort((a, b) => a.order - b.order);

  // Auto-scroll effect for carousel
  useEffect(() => {
    if (!api || !config.showAsCarousel) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api, config.showAsCarousel]);

  const renderPartnerLogo = (partner: Partner, index: number) => {
    const logoElement = (
      <div 
        className={`
          relative h-16 w-32 flex items-center justify-center
          ${config.grayscale ? 'grayscale hover:grayscale-0' : ''}
          transition-all duration-300 hover:scale-105
        `}
      >
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain"
          loading={index < 8 ? 'eager' : 'lazy'}
          sizes="200px"
        />
      </div>
    );

    if (partner.url) {
      return (
        <Link
          key={partner.id}
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {logoElement}
        </Link>
      );
    }

    return (
      <div key={partner.id}>
        {logoElement}
      </div>
    );
  };

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
      {enabledPartners.map((partner, index) => 
        renderPartnerLogo(partner, index)
      )}
    </div>
  );

  const CarouselView = () => (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: true,
        slidesToScroll: 1,
      }}
      className="w-full"
    >
      <CarouselContent>
        {enabledPartners.map((partner, index) => (
          <CarouselItem key={partner.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
            <div className="flex items-center justify-center">
              {renderPartnerLogo(partner, index)}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );

  return (
    <section ref={ref} className="py-16 lg:py-24 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {config.title?.[locale as keyof I18nField] || config.title?.fr || t('homepage.partners.title')}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground">
              {config.subtitle[locale as keyof I18nField] || config.subtitle.fr}
            </p>
          )}
        </div>

        {config.showAsCarousel ? <CarouselView /> : <GridView />}
      </div>
    </section>
  );
}

// Default configuration for partners section
export const defaultPartnersConfig: PartnersSectionConfig = {
  id: 'partners',
  type: 'partners',
  enabled: true,
  order: 7,
  title: {
    fr: 'Nos Partenaires',
    en: 'Our Partners',
    it: 'I Nostri Partner',
    es: 'Nuestros Socios',
  },
  subtitle: {
    fr: 'Ils nous font confiance pour promouvoir Lyon',
    en: 'They trust us to promote Lyon',
    it: 'Si fidano di noi per promuovere Lione',
    es: 'Confían en nosotros para promover Lyon',
  },
  partners: [
    {
      id: 'lyon-metropole',
      name: 'Métropole de Lyon',
      logo: '/images/partners/lyon-metropole.png',
      url: 'https://www.grandlyon.com/',
      enabled: true,
      order: 0,
    },
    {
      id: 'lyon-tourisme',
      name: 'Lyon Tourisme',
      logo: '/images/partners/lyon-tourisme.png',
      url: 'https://www.lyon-france.com/',
      enabled: true,
      order: 1,
    },
    {
      id: 'onlylyon',
      name: 'OnlyLyon',
      logo: '/images/partners/onlylyon.png',
      url: 'https://www.onlylyon.com/',
      enabled: true,
      order: 2,
    },
    {
      id: 'auvergne-rhone-alpes',
      name: 'Région Auvergne-Rhône-Alpes',
      logo: '/images/partners/auvergne-rhone-alpes.png',
      url: 'https://www.auvergnerhonealpes.fr/',
      enabled: true,
      order: 3,
    },
    {
      id: 'credit-lyonnais',
      name: 'Crédit Lyonnais',
      logo: '/images/partners/credit-lyonnais.png',
      url: 'https://www.creditlyonnais.fr/',
      enabled: true,
      order: 4,
    },
    {
      id: 'sytral',
      name: 'SYTRAL',
      logo: '/images/partners/sytral.png',
      url: 'https://www.sytral.fr/',
      enabled: true,
      order: 5,
    },
  ],
  showAsCarousel: true,
  grayscale: true,
  displayMode: 'slider',
  dataMode: 'curated',
  maxItems: 12,
};