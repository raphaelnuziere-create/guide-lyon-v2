'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { fr, en, es, it } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Link as LinkIcon,
  ChevronRight,
  User,
  Tag,
  Heart,
  Bookmark,
  Print,
  ArrowLeft
} from 'lucide-react';
import BlogArticleCard from './blog-article-card';
import BlogBreadcrumbs from './blog-breadcrumbs';
import BlogComments from './blog-comments';
import BlogTableOfContents from './blog-table-of-contents';
import type { BlogArticleProps } from '../../types';

const localeMap = { fr, en, es, it };

export default function BlogArticlePage({
  article,
  relatedArticles,
  category,
  tags,
  author,
  locale,
}: BlogArticleProps) {
  const t = useTranslations('blog.article');
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const title = article.title[locale] || article.title.fr || '';
  const excerpt = article.excerpt[locale] || article.excerpt.fr || '';
  const content = article.content[locale] || article.content.fr || '';
  const slug = article.slug[locale] || article.slug.fr || '';
  
  const publishedDate = article.publishedAt;
  const readingTime = article.metrics.readingTime;
  const views = article.metrics.views;
  const likes = article.metrics.likes;
  
  const formattedDate = publishedDate 
    ? format(publishedDate, 'dd MMMM yyyy', { locale: localeMap[locale] })
    : '';

  const articleUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/blog/${slug}`;
  
  // Share functions
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = `${title} - ${excerpt.substring(0, 100)}...`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      // You might want to show a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const printArticle = () => {
    window.print();
  };

  // Track reading progress
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('article-content');
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const documentHeight = element.offsetHeight;
      
      const scrollTop = Math.max(0, -rect.top);
      const scrollHeight = Math.max(0, documentHeight - windowHeight);
      
      if (scrollHeight > 0) {
        const progress = Math.min(100, (scrollTop / scrollHeight) * 100);
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract headings for table of contents
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    const contentElement = document.getElementById('article-content');
    if (!contentElement) return;

    const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings = Array.from(headingElements).map((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    setHeadings(extractedHeadings);
  }, [content]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Reading progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Back button */}
            <Link
              href={`/${locale}/actualites`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('backToList')}</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={t('actions.like')}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={t('actions.bookmark')}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  title={t('actions.share')}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border py-2 w-48 z-50">
                    <button
                      onClick={shareOnFacebook}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      Twitter
                    </button>
                    <button
                      onClick={shareOnLinkedIn}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      LinkedIn
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-600" />
                      {t('actions.copyLink')}
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={printArticle}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Print className="w-4 h-4 text-gray-600" />
                      {t('actions.print')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main content */}
          <main className="flex-1 max-w-4xl">
            
            {/* Breadcrumbs */}
            <BlogBreadcrumbs
              category={category}
              article={article}
              locale={locale}
            />

            {/* Article header */}
            <header className="mb-8">
              
              {/* Category and featured badge */}
              <div className="flex items-center gap-4 mb-4">
                {category && (
                  <Link
                    href={`/${locale}/actualites?category=${category.id}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                  >
                    {category.name[locale] || category.name.fr}
                  </Link>
                )}
                
                {article.featured.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    ⭐ {t('featured')}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {title}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {excerpt}
                </p>
              )}

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                {publishedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={publishedDate.toISOString()}>
                      {formattedDate}
                    </time>
                  </div>
                )}
                
                {readingTime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t('readingTime', { minutes: readingTime })}
                  </div>
                )}
                
                {views > 0 && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('views', { count: views })}
                  </div>
                )}

                {author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{author.name}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/${locale}/actualites?tags=${tag.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      {tag.name[locale] || tag.name.fr}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Featured image */}
            {article.featuredImage && (
              <div className="mb-8">
                <figure>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={article.featuredImage.url}
                      alt={article.featuredImage.alt[locale] || article.featuredImage.alt.fr || title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 896px"
                    />
                  </div>
                  {article.featuredImage.credits && (
                    <figcaption className="mt-2 text-sm text-gray-500 text-center">
                      {article.featuredImage.credits}
                    </figcaption>
                  )}
                </figure>
              </div>
            )}

            {/* Article content */}
            <div 
              id="article-content"
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Author bio */}
            {author && author.bio && (
              <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-4">
                  {author.avatar && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('aboutAuthor')} {author.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {author.bio[locale] || author.bio.fr}
                    </p>
                    
                    {author.socialLinks && (
                      <div className="flex gap-3">
                        {author.socialLinks.twitter && (
                          <a
                            href={author.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-500"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {author.socialLinks.linkedin && (
                          <a
                            href={author.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-800"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {author.socialLinks.website && (
                          <a
                            href={author.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <LinkIcon className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Comments section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('comments.title')} ({article.metrics.comments})
                </h3>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showComments ? t('comments.hide') : t('comments.show')}
                </button>
              </div>

              {showComments && (
                <BlogComments
                  articleId={article.id}
                  locale={locale}
                />
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="sticky top-24 space-y-6">
              
              {/* Table of contents */}
              {headings.length > 0 && (
                <BlogTableOfContents headings={headings} />
              )}

              {/* Article stats */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('stats.title')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('stats.views')}</span>
                    <span className="font-medium">{views.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('stats.likes')}</span>
                    <span className="font-medium">{likes.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('stats.shares')}</span>
                    <span className="font-medium">{article.metrics.shares.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('stats.readingTime')}</span>
                    <span className="font-medium">{readingTime} min</span>
                  </div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('share.title')}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareOnFacebook}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  
                  <button
                    onClick={shareOnTwitter}
                    className="flex items-center justify-center gap-2 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>
                  
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {t('share.copy')}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('related.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <BlogArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                  locale={locale}
                  viewMode="grid"
                  showExcerpt={false}
                  showMetrics={false}
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                href={`/${locale}/actualites`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('related.viewAll')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}