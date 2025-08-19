'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DirectoryPage } from './directory-page';
import { DirectoryProvider } from './directory-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThematicPageProps {
  type: string;
  title: string;
  subtitle: string;
  editorialContent?: any;
  places: any[];
  total: number;
  hasMore: boolean;
  filters: any;
  locale: string;
  dict: any;
  heroImage?: string;
  categories?: string[];
  features?: Array<{ icon: string; label: string }>;
}

export function ThematicPage({
  type,
  title,
  subtitle,
  editorialContent,
  places,
  total,
  hasMore,
  filters,
  locale,
  dict,
  heroImage,
  categories,
  features,
}: ThematicPageProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const currentLang = locale as 'fr' | 'en' | 'es' | 'it';

  // Get localized editorial content
  const content = editorialContent?.content_i18n?.[currentLang] || editorialContent?.content_i18n?.fr;
  const tips = editorialContent?.tips_i18n?.[currentLang] || editorialContent?.tips_i18n?.fr;
  const highlights = editorialContent?.highlights_i18n?.[currentLang] || editorialContent?.highlights_i18n?.fr;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-b from-gray-900 to-gray-700">
        {heroImage && (
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover opacity-50"
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">{subtitle}</p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold">{total}</div>
                <div className="text-sm opacity-80">{dict.directory.establishments}</div>
              </div>
              {categories && (
                <div>
                  <div className="text-3xl font-bold">{categories.length}</div>
                  <div className="text-sm opacity-80">{dict.directory.categories}</div>
                </div>
              )}
              {features && (
                <div>
                  <div className="text-3xl font-bold">{features.length}+</div>
                  <div className="text-sm opacity-80">{dict.directory.features}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Content */}
      {content && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-6">
              <div
                className={cn(
                  "prose prose-lg max-w-none",
                  !showFullContent && "line-clamp-4"
                )}
                dangerouslySetInnerHTML={{ __html: content }}
              />
              
              {content.length > 300 && (
                <Button
                  onClick={() => setShowFullContent(!showFullContent)}
                  variant="ghost"
                  className="mt-4"
                >
                  {showFullContent ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      {dict.common.showLess}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      {dict.common.showMore}
                    </>
                  )}
                </Button>
              )}

              {/* Tips Section */}
              {tips && tips.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-blue-900">
                    💡 {dict.directory.tips}
                  </h3>
                  <ul className="space-y-2">
                    {tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Highlights */}
              {highlights && highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">
                    ⭐ {dict.directory.highlights}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highlights.map((highlight: any, index: number) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium mb-2">{highlight.title}</h4>
                        <p className="text-sm text-gray-600">{highlight.description}</p>
                        {highlight.link && (
                          <a
                            href={highlight.link}
                            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                          >
                            {dict.common.learnMore} →
                          </a>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Grid */}
              {features && features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">
                    {dict.directory.popularFeatures}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-4 py-2 text-sm"
                      >
                        <span className="mr-2 text-lg">{feature.icon}</span>
                        {feature.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categories && categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">
                    {dict.directory.browseByCategory}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Update filters to show only this category
                          window.location.href = `?category=${category}`;
                        }}
                      >
                        {dict.categories[category] || category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Directory Listing */}
      <DirectoryProvider
        initialPlaces={places}
        initialFilters={filters}
        locale={locale}
        dict={dict}
      >
        <DirectoryPage
          places={places}
          total={total}
          hasMore={hasMore}
          currentPage={parseInt(filters.page || '1')}
          view={filters.view || 'grid'}
          sort={filters.sort || 'relevance'}
          filters={filters}
          locale={locale}
          dict={dict}
        />
      </DirectoryProvider>
    </div>
  );
}