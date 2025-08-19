'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { fr, en, es, it } from 'date-fns/locale';
import { TrendingUp, Calendar, Eye, ArrowRight } from 'lucide-react';
import type { BlogArticle, BlogCategory, Locale } from '../../types';

interface BlogSidebarProps {
  popularArticles: BlogArticle[];
  categories: BlogCategory[];
  locale: Locale;
}

const localeMap = { fr, en, es, it };

export default function BlogSidebar({
  popularArticles,
  categories,
  locale,
}: BlogSidebarProps) {
  const t = useTranslations('blog.sidebar');

  return (
    <div className="space-y-6">
      
      {/* Popular Articles */}
      {popularArticles.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            {t('popular.title')}
          </h3>
          
          <div className="space-y-4">
            {popularArticles.map((article, index) => {
              const title = article.title[locale] || article.title.fr || '';
              const slug = article.slug[locale] || article.slug.fr || '';
              const articleUrl = `/${locale}/blog/${slug}`;
              
              return (
                <article key={article.id} className="group">
                  <div className="flex gap-3">
                    
                    {/* Rank */}
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    {/* Image */}
                    {article.featuredImage && (
                      <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden">
                        <Link href={articleUrl}>
                          <Image
                            src={article.featuredImage.url}
                            alt={article.featuredImage.alt[locale] || article.featuredImage.alt.fr || title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="64px"
                          />
                        </Link>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        <Link href={articleUrl}>
                          {title}
                        </Link>
                      </h4>
                      
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        {article.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(article.publishedAt, 'dd/MM', { locale: localeMap[locale] })}
                          </div>
                        )}
                        
                        {article.metrics.views > 0 && (
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.metrics.views}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href={`/${locale}/actualites?sort=views&order=desc`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              {t('popular.viewAll')}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('categories.title')}
          </h3>
          
          <div className="space-y-2">
            {categories.map((category) => {
              const categoryName = category.name[locale] || category.name.fr || '';
              
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/actualites?category=${category.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color || '#3B82F6' }}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {categoryName}
                    </span>
                  </div>
                  
                  {category.icon && (
                    <span className="text-lg">{category.icon}</span>
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href={`/${locale}/actualites`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              {t('categories.viewAll')}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">
          {t('newsletter.title')}
        </h3>
        
        <p className="text-blue-100 text-sm mb-4">
          {t('newsletter.description')}
        </p>
        
        <form className="space-y-3">
          <input
            type="email"
            placeholder={t('newsletter.emailPlaceholder')}
            className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            required
          />
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {t('newsletter.subscribe')}
          </button>
        </form>
        
        <p className="text-xs text-blue-200 mt-3">
          {t('newsletter.privacy')}
        </p>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('social.title')}
        </h3>
        
        <div className="space-y-3">
          <a
            href="https://facebook.com/guidedelyon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">f</span>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Facebook
            </span>
          </a>
          
          <a
            href="https://instagram.com/guidedelyon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">📷</span>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Instagram
            </span>
          </a>
          
          <a
            href="https://twitter.com/guidedelyon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">𝕏</span>
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Twitter / X
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}