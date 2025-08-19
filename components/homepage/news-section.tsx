'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { NewsSkeleton } from '../ui/skeleton';
import { getOptimizedImageUrl, imagePresets } from '../../lib/utils/image';
import { useInView } from 'react-intersection-observer';
import { Calendar, User, Clock } from 'lucide-react';
import type { NewsSectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface NewsArticle {
  id: string;
  slug: string;
  title: I18nField;
  excerpt: I18nField;
  content: I18nField;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: I18nField;
    slug: string;
  };
  tags: string[];
  image: string;
  publishedAt: Date;
  views: number;
  readingTime: number;
  featured: boolean;
}

interface NewsSectionProps {
  config: NewsSectionConfig;
  articles: NewsArticle[];
  loading?: boolean;
}

export function NewsSection({ config, articles, loading = false }: NewsSectionProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  if (loading) {
    return <NewsSkeleton />;
  }

  if (!config.enabled || articles.length === 0) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatReadingTime = (minutes: number) => {
    return t('common.reading_time', { minutes });
  };

  const renderArticleCard = (article: NewsArticle, index: number) => (
    <Card key={article.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={getOptimizedImageUrl(article.image, imagePresets.cardThumbnail)}
          alt={article.title[locale as keyof I18nField] || article.title.fr}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading={index < 3 ? 'eager' : 'lazy'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary">
            {article.category.name[locale as keyof I18nField] || article.category.name.fr}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/news/${article.slug}`}>
            {article.title[locale as keyof I18nField] || article.title.fr}
          </Link>
        </h3>
        
        {config.showExcerpt && (
          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.excerpt[locale as keyof I18nField] || article.excerpt.fr}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {config.showDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            )}
            
            {config.showAuthor && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{article.author.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatReadingTime(article.readingTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.slice(0, config.maxItems).map((article, index) => 
        renderArticleCard(article, index)
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
        {articles.slice(0, config.maxItems).map((article, index) => (
          <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
            {renderArticleCard(article, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );

  const ListView = () => (
    <div className="space-y-4">
      {articles.slice(0, config.maxItems).map((article, index) => (
        <Card key={article.id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative aspect-[16/10] md:aspect-square md:w-48 overflow-hidden">
                <Image
                  src={getOptimizedImageUrl(article.image, imagePresets.cardThumbnail)}
                  alt={article.title[locale as keyof I18nField] || article.title.fr}
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
                      <Badge variant="secondary">
                        {article.category.name[locale as keyof I18nField] || article.category.name.fr}
                      </Badge>
                      {config.showDate && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(article.publishedAt)}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/news/${article.slug}`}>
                        {article.title[locale as keyof I18nField] || article.title.fr}
                      </Link>
                    </h3>
                    
                    {config.showExcerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {article.excerpt[locale as keyof I18nField] || article.excerpt.fr}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    {config.showAuthor && (
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatReadingTime(article.readingTime)}</span>
                    </div>
                  </div>
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
            {config.title?.[locale as keyof I18nField] || config.title?.fr || t('navigation.news')}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-muted-foreground">
              {config.subtitle[locale as keyof I18nField] || config.subtitle.fr}
            </p>
          )}
        </div>

        {config.displayMode === 'grid' && <GridView />}
        {config.displayMode === 'slider' && <SliderView />}
        {config.displayMode === 'list' && <ListView />}

        {articles.length > config.maxItems && (
          <div className="text-center mt-8">
            <Link 
              href="/news"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              {t('common.view_all')}
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

// Default configuration for the news section
export const defaultNewsConfig: NewsSectionConfig = {
  id: 'news',
  type: 'news',
  enabled: true,
  order: 1,
  title: {
    fr: 'Actualités',
    en: 'News',
    it: 'Notizie',
    es: 'Noticias',
  },
  subtitle: {
    fr: 'Découvrez les dernières actualités de Lyon',
    en: 'Discover the latest news from Lyon',
    it: 'Scopri le ultime notizie da Lione',
    es: 'Descubre las últimas noticias de Lyon',
  },
  displayMode: 'grid',
  dataMode: 'auto',
  maxItems: 6,
  autoQuery: {
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  },
  curatedIds: [],
  showExcerpt: true,
  showAuthor: true,
  showDate: true,
  showCategory: true,
};