'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@guide-de-lyon/ui';
import { Input } from '@guide-de-lyon/ui';
import { Card, CardContent } from '@guide-de-lyon/ui';
import { NewsletterSkeleton } from '../ui/skeleton';
import { useInView } from 'react-intersection-observer';
import { Mail, Check, Gift, Bell, Zap } from 'lucide-react';
import type { NewsletterSectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface NewsletterSectionProps {
  config: NewsletterSectionConfig;
  loading?: boolean;
}

export function NewsletterSection({ config, loading = false }: NewsletterSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (loading) {
    return <NewsletterSkeleton />;
  }

  if (!config.enabled) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultBenefits = [
    {
      icon: <Bell className="h-5 w-5" />,
      text: t('newsletter.benefits.notifications'),
    },
    {
      icon: <Gift className="h-5 w-5" />,
      text: t('newsletter.benefits.exclusive_deals'),
    },
    {
      icon: <Zap className="h-5 w-5" />,
      text: t('newsletter.benefits.first_to_know'),
    },
  ];

  const benefits = config.showBenefits && config.benefits.length > 0
    ? config.benefits.map((benefit, index) => ({
        icon: defaultBenefits[index]?.icon || <Check className="h-5 w-5" />,
        text: benefit[locale as keyof I18nField] || benefit.fr,
      }))
    : defaultBenefits;

  const StripDesign = () => (
    <section 
      ref={ref}
      className={`py-12 ${config.backgroundColor === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold mb-2">
              {config.title?.[locale as keyof I18nField] || config.title?.fr || t('footer.newsletter.title')}
            </h3>
            <p className="text-lg opacity-90">
              {config.subtitle?.[locale as keyof I18nField] || config.subtitle?.fr || t('footer.newsletter.description')}
            </p>
          </div>
          
          <div className="w-full lg:w-auto">
            {isSubscribed ? (
              <div className="flex items-center space-x-2 text-green-600 bg-white rounded-lg px-6 py-3">
                <Check className="h-5 w-5" />
                <span className="font-medium">{t('newsletter.success')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto max-w-md gap-2">
                <Input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/90 backdrop-blur-sm"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    t('footer.newsletter.subscribe')
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const CardDesign = () => (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">
              {config.title?.[locale as keyof I18nField] || config.title?.fr || t('footer.newsletter.title')}
            </h3>
            
            <p className="text-muted-foreground mb-6">
              {config.subtitle?.[locale as keyof I18nField] || config.subtitle?.fr || t('footer.newsletter.description')}
            </p>

            {config.showBenefits && (
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="text-primary">{benefit.icon}</div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            )}

            {isSubscribed ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg px-6 py-3">
                <Check className="h-5 w-5" />
                <span className="font-medium">{t('newsletter.success')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    t('footer.newsletter.subscribe')
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );

  const FullwidthDesign = () => (
    <section 
      ref={ref}
      className={`py-16 lg:py-24 ${config.backgroundColor === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'}`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            {config.title?.[locale as keyof I18nField] || config.title?.fr || t('footer.newsletter.title')}
          </h3>
          
          <p className="text-xl opacity-90 mb-8">
            {config.subtitle?.[locale as keyof I18nField] || config.subtitle?.fr || t('footer.newsletter.description')}
          </p>

          {config.showBenefits && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          )}

          {isSubscribed ? (
            <div className="inline-flex items-center space-x-2 text-green-300 bg-white/20 rounded-lg px-6 py-3">
              <Check className="h-5 w-5" />
              <span className="font-medium">{t('newsletter.success')}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/90 backdrop-blur-sm text-foreground"
                required
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-white text-primary hover:bg-white/90"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  t('footer.newsletter.subscribe')
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );

  if (config.design === 'strip') return <StripDesign />;
  if (config.design === 'fullwidth') return <FullwidthDesign />;
  return <CardDesign />;
}

// Default configuration for newsletter section
export const defaultNewsletterConfig: NewsletterSectionConfig = {
  id: 'newsletter',
  type: 'newsletter',
  enabled: true,
  order: 6,
  title: {
    fr: 'Restez informé',
    en: 'Stay informed',
    it: 'Rimani informato',
    es: 'Mantente informado',
  },
  subtitle: {
    fr: 'Recevez nos dernières actualités et bons plans directement dans votre boîte mail',
    en: 'Receive our latest news and deals directly in your mailbox',
    it: 'Ricevi le nostre ultime notizie e offerte direttamente nella tua casella di posta',
    es: 'Recibe nuestras últimas noticias y ofertas directamente en tu buzón',
  },
  design: 'strip',
  backgroundColor: 'primary',
  showBenefits: true,
  benefits: [],
  displayMode: 'grid',
  dataMode: 'curated',
  maxItems: 1,
};