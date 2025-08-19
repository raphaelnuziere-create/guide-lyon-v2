'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@guide-de-lyon/ui';
import { Card, CardContent } from '@guide-de-lyon/ui';
import { useInView } from 'react-intersection-observer';
import { Star, Quote, TrendingUp, Users, MapPin } from 'lucide-react';
import type { MerchantCtaSectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface MerchantCtaSectionProps {
  config: MerchantCtaSectionConfig;
  loading?: boolean;
}

export function MerchantCtaSection({ config, loading = false }: MerchantCtaSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (loading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-8 bg-muted animate-pulse rounded mb-4"></div>
            <div className="h-4 bg-muted animate-pulse rounded mb-8"></div>
            <div className="h-10 bg-muted animate-pulse rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!config.enabled) {
    return null;
  }

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('merchant_cta.benefits.visibility.title'),
      description: t('merchant_cta.benefits.visibility.description'),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('merchant_cta.benefits.customers.title'),
      description: t('merchant_cta.benefits.customers.description'),
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('merchant_cta.benefits.local.title'),
      description: t('merchant_cta.benefits.local.description'),
    },
  ];

  return (
    <section 
      ref={ref}
      className={`py-16 lg:py-24 ${config.backgroundColor || 'bg-muted/50'}`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {config.ctaText[locale as keyof I18nField] || config.ctaText.fr}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('merchant_cta.subtitle')}
            </p>
            
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href={config.ctaUrl}>
                {t('navigation.list_business')}
              </Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          {config.showTestimonials && config.testimonials.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center mb-8">
                {t('merchant_cta.testimonials.title')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="relative">
                    <CardContent className="p-6">
                      <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      <blockquote className="text-sm italic mb-4">
                        "{testimonial.quote[locale as keyof I18nField] || testimonial.quote.fr}"
                      </blockquote>
                      <div className="flex items-center space-x-3">
                        {testimonial.image && (
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.business}</div>
                        </div>
                      </div>
                      <div className="flex mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">{t('merchant_cta.stats.businesses')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">{t('merchant_cta.stats.monthly_visitors')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-sm text-muted-foreground">{t('merchant_cta.stats.average_rating')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">{t('merchant_cta.stats.satisfaction')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Default configuration for merchant CTA section
export const defaultMerchantCtaConfig: MerchantCtaSectionConfig = {
  id: 'merchant_cta',
  type: 'merchant_cta',
  enabled: true,
  order: 5,
  ctaText: {
    fr: 'Vous êtes un professionnel ?',
    en: 'Are you a professional?',
    it: 'Sei un professionista?',
    es: '¿Eres un profesional?',
  },
  ctaUrl: '/list-business',
  backgroundColor: 'bg-muted/50',
  showTestimonials: false,
  testimonials: [],
  displayMode: 'grid',
  dataMode: 'curated',
  maxItems: 3,
};