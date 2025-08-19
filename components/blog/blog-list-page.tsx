'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Grid, List, Search, Filter, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import BlogArticleCard from './blog-article-card';
import BlogFilters from './blog-filters';
import BlogSearch from './blog-search';
import BlogSidebar from './blog-sidebar';
import LoadingSpinner from '../ui/loading-spinner';
import Pagination from '../ui/pagination';
import type { 
  BlogListResponse, 
  BlogListParams, 
  Locale,
  BlogArticle 
} from '../../types';

interface BlogListPageProps {
  initialData: BlogListResponse;
  locale: Locale;
  searchParams: { [key: string]: string | string[] | undefined };
}

type ViewMode = 'grid' | 'list';

export default function BlogListPage({ 
  initialData, 
  locale,
  searchParams 
}: BlogListPageProps) {
  const t = useTranslations('blog');
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  const [data, setData] = useState<BlogListResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Current filter state
  const [filters, setFilters] = useState({
    categoryId: searchParams.category as string || '',
    tagIds: searchParams.tags ? (searchParams.tags as string).split(',') : [],
    dateRange: undefined as [Date, Date] | undefined,
    search: searchParams.search as string || '',
  });

  // Current pagination state
  const [pagination, setPagination] = useState({
    page: data.pagination.page,
    limit: data.pagination.limit,
    sort: searchParams.sort as string || 'publishedAt',
    order: (searchParams.order as 'asc' | 'desc') || 'desc',
  });

  // Fetch articles with current filters
  const fetchArticles = useCallback(async (params: Partial<BlogListParams> = {}) => {
    setLoading(true);
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add current filters
      if (filters.categoryId) queryParams.set('categoryId', filters.categoryId);
      if (filters.tagIds.length > 0) queryParams.set('tagIds', filters.tagIds.join(','));
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.dateRange) {
        queryParams.set('dateFrom', filters.dateRange[0].toISOString());
        queryParams.set('dateTo', filters.dateRange[1].toISOString());
      }
      
      // Add pagination
      queryParams.set('page', (params.page || pagination.page).toString());
      queryParams.set('limit', (params.limit || pagination.limit).toString());
      queryParams.set('sort', params.sort || pagination.sort);
      queryParams.set('order', params.order || pagination.order);
      queryParams.set('locale', locale);
      queryParams.set('status', 'published');

      const response = await fetch(`/api/articles?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        console.error('API error:', result.error);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, locale]);

  // Update URL when filters change
  const updateURL = useCallback((newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/${locale}/actualites?${params.toString()}`, { scroll: false });
  }, [router, locale, urlSearchParams]);

  // Handle filter changes
  const handleCategoryChange = (categoryId?: string) => {
    setFilters(prev => ({ ...prev, categoryId: categoryId || '' }));
    updateURL({ category: categoryId });
  };

  const handleTagsChange = (tagIds: string[]) => {
    setFilters(prev => ({ ...prev, tagIds }));
    updateURL({ tags: tagIds.length > 0 ? tagIds.join(',') : undefined });
  };

  const handleDateRangeChange = (range?: [Date, Date]) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
    updateURL({ 
      dateFrom: range?.[0].toISOString(),
      dateTo: range?.[1].toISOString(),
    });
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    updateURL({ search: query || undefined });
  };

  const handleResetFilters = () => {
    setFilters({
      categoryId: '',
      tagIds: [],
      dateRange: undefined,
      search: '',
    });
    router.push(`/${locale}/actualites`);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    updateURL({ page: page.toString() });
    fetchArticles({ page });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort: string, order: 'asc' | 'desc') => {
    setPagination(prev => ({ ...prev, sort, order, page: 1 }));
    updateURL({ sort, order, page: '1' });
    fetchArticles({ sort, order, page: 1 });
  };

  // Handle infinite scroll (optional)
  const [hasInfiniteScroll, setHasInfiniteScroll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreArticles = async () => {
    if (loadingMore || !data.pagination.hasNext) return;
    
    setLoadingMore(true);
    const nextPage = data.pagination.page + 1;
    
    try {
      const queryParams = new URLSearchParams();
      if (filters.categoryId) queryParams.set('categoryId', filters.categoryId);
      if (filters.tagIds.length > 0) queryParams.set('tagIds', filters.tagIds.join(','));
      if (filters.search) queryParams.set('search', filters.search);
      queryParams.set('page', nextPage.toString());
      queryParams.set('limit', pagination.limit.toString());
      queryParams.set('sort', pagination.sort);
      queryParams.set('order', pagination.order);
      queryParams.set('locale', locale);
      queryParams.set('status', 'published');

      const response = await fetch(`/api/articles?${queryParams.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setData(prev => ({
          ...result.data,
          articles: [...prev.articles, ...result.data.articles],
        }));
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Effect to refetch when filters change
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify({
      categoryId: searchParams.category as string || '',
      tagIds: searchParams.tags ? (searchParams.tags as string).split(',') : [],
      dateRange: undefined,
      search: searchParams.search as string || '',
    })) {
      fetchArticles({ page: 1 });
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [filters, fetchArticles, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('list.title')}
              </h1>
              <p className="mt-2 text-gray-600">
                {t('list.description')}
              </p>
            </div>
            
            {/* View toggle and filters button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={t('list.viewMode.grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={t('list.viewMode.list')}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {t('list.filters.toggle')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Filters */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8 space-y-6">
              
              {/* Search */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <BlogSearch
                  placeholder={t('list.search.placeholder')}
                  onSearch={handleSearch}
                  initialQuery={filters.search}
                />
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <BlogFilters
                  categories={data.categories}
                  tags={data.tags}
                  selectedCategoryId={filters.categoryId || undefined}
                  selectedTagIds={filters.tagIds}
                  dateRange={filters.dateRange}
                  onCategoryChange={handleCategoryChange}
                  onTagsChange={handleTagsChange}
                  onDateRangeChange={handleDateRangeChange}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Sidebar */}
              <BlogSidebar
                popularArticles={data.articles.slice(0, 5)} // This should come from API
                categories={data.categories}
                locale={locale}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="text-sm text-gray-600">
                {t('list.results.total', { count: data.total })}
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">
                  {t('list.sort.label')}:
                </label>
                <select
                  value={`${pagination.sort}-${pagination.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    handleSortChange(sort, order as 'asc' | 'desc');
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="publishedAt-desc">{t('list.sort.options.newest')}</option>
                  <option value="publishedAt-asc">{t('list.sort.options.oldest')}</option>
                  <option value="title-asc">{t('list.sort.options.titleAsc')}</option>
                  <option value="title-desc">{t('list.sort.options.titleDesc')}</option>
                  <option value="views-desc">{t('list.sort.options.popular')}</option>
                </select>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Articles grid/list */}
            {!loading && (
              <>
                {data.articles.length > 0 ? (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-6'
                  }>
                    {data.articles.map((article) => (
                      <BlogArticleCard
                        key={article.id}
                        article={article}
                        locale={locale}
                        viewMode={viewMode}
                        category={data.categories.find(c => c.id === article.categoryId)}
                        tags={data.tags.filter(t => article.tagIds.includes(t.id))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('list.noResults.title')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t('list.noResults.description')}
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('list.noResults.resetFilters')}
                    </button>
                  </div>
                )}

                {/* Load more button for infinite scroll */}
                {hasInfiniteScroll && data.pagination.hasNext && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMoreArticles}
                      disabled={loadingMore}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingMore ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        t('list.loadMore')
                      )}
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {!hasInfiniteScroll && data.pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={data.pagination.page}
                      totalPages={data.pagination.totalPages}
                      onPageChange={handlePageChange}
                      showPrevNext
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}