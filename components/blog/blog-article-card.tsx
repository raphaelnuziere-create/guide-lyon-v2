'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { fr, en, es, it } from 'date-fns/locale';
import { Calendar, Clock, Eye, User, Tag, Star } from 'lucide-react';
import type { BlogArticle, BlogCategory, BlogTag, Locale } from '../../types';

interface BlogArticleCardProps {
  article: BlogArticle;
  locale: Locale;
  viewMode: 'grid' | 'list';
  category?: BlogCategory;
  tags?: BlogTag[];
  showAuthor?: boolean;
  showExcerpt?: boolean;
  showMetrics?: boolean;
}

const localeMap = { fr, en, es, it };

export default function BlogArticleCard({
  article,
  locale,
  viewMode,
  category,
  tags = [],
  showAuthor = true,
  showExcerpt = true,
  showMetrics = true,
}: BlogArticleCardProps) {
  const t = useTranslations('blog');
  
  const title = article.title[locale] || article.title.fr || '';
  const excerpt = article.excerpt[locale] || article.excerpt.fr || '';
  const slug = article.slug[locale] || article.slug.fr || '';
  const categoryName = category?.name[locale] || category?.name.fr || '';
  
  const publishedDate = article.publishedAt;
  const readingTime = article.metrics.readingTime;
  
  const formattedDate = publishedDate 
    ? format(publishedDate, 'dd MMMM yyyy', { locale: localeMap[locale] })
    : '';

  const articleUrl = `/${locale}/blog/${slug}`;

  if (viewMode === 'list') {
    return (
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          {article.featuredImage && (
            <div className="md:w-80 h-48 md:h-auto relative flex-shrink-0">
              <Link href={articleUrl}>
                <Image
                  src={article.featuredImage.url}
                  alt={article.featuredImage.alt[locale] || article.featuredImage.alt.fr || title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </Link>
              {article.featured.isFeatured && (
                <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {t('card.featured')}
                </div>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              
              {/* Category and Date */}
              <div className="flex items-center gap-4 mb-3">
                {category && (
                  <Link
                    href={`/${locale}/actualites?category=${category.id}`}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                  >
                    {categoryName}
                  </Link>
                )}
                
                {publishedDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formattedDate}
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                <Link href={articleUrl}>
                  {title}
                </Link>
              </h2>

              {/* Excerpt */}
              {showExcerpt && excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {excerpt}
                </p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/${locale}/actualites?tags=${tag.id}`}
                      className="inline-flex items-center text-xs text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.name[locale] || tag.name.fr}
                    </Link>
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{tags.length - 3} {t('card.moreTags')}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  {readingTime > 0 && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {t('card.readingTime', { minutes: readingTime })}
                    </div>
                  )}
                  
                  {showMetrics && article.metrics.views > 0 && (
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.metrics.views}
                    </div>
                  )}
                </div>
                
                <Link
                  href={articleUrl}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {t('card.readMore')} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid view
  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Image */}
      {article.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <Link href={articleUrl}>
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt[locale] || article.featuredImage.alt.fr || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>
          {article.featured.isFeatured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              {t('card.featured')}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          {category && (
            <Link
              href={`/${locale}/actualites?category=${category.id}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white hover:opacity-80 transition-opacity"
              style={{ backgroundColor: category.color || '#3B82F6' }}
            >
              {categoryName}
            </Link>
          )}
          
          {publishedDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {format(publishedDate, 'dd/MM', { locale: localeMap[locale] })}
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={articleUrl}>
            {title}
          </Link>
        </h2>

        {/* Excerpt */}
        {showExcerpt && excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag.id}
                href={`/${locale}/actualites?tags=${tag.id}`}
                className="inline-flex items-center text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name[locale] || tag.name.fr}
              </Link>
            ))}
            {tags.length > 2 && (
              <span className="text-xs text-gray-400">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            {readingTime > 0 && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {readingTime}min
              </div>
            )}
            
            {showMetrics && article.metrics.views > 0 && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {article.metrics.views}
              </div>
            )}
          </div>
          
          <Link
            href={articleUrl}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
          >
            {t('card.readMore')}
          </Link>
        </div>
      </div>
    </article>
  );
}