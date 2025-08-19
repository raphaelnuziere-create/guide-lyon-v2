'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { BlogArticle, BlogCategory, Locale } from '../../types';

interface BlogBreadcrumbsProps {
  category?: BlogCategory | null;
  article: BlogArticle;
  locale: Locale;
}

export default function BlogBreadcrumbs({ category, article, locale }: BlogBreadcrumbsProps) {
  const title = article.title[locale] || article.title.fr || '';
  const categoryName = category?.name[locale] || category?.name.fr || '';

  const breadcrumbs = [
    {
      name: 'Accueil',
      href: `/${locale}`,
      icon: Home,
    },
    {
      name: 'Actualités',
      href: `/${locale}/actualites`,
    },
    ...(category ? [{
      name: categoryName,
      href: `/${locale}/actualites?category=${category.id}`,
    }] : []),
    {
      name: title,
      href: null, // Current page
    },
  ];

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href || breadcrumb.name} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            )}
            
            {breadcrumb.href ? (
              <Link
                href={breadcrumb.href}
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                {breadcrumb.icon && <breadcrumb.icon className="w-4 h-4" />}
                {breadcrumb.name}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium line-clamp-1" title={breadcrumb.name}>
                {breadcrumb.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}