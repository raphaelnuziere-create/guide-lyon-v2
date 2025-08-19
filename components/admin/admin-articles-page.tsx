'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Copy,
  Calendar,
  User,
  Tag,
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Archive,
} from 'lucide-react';
import LoadingSpinner from '../ui/loading-spinner';
import Pagination from '../ui/pagination';
import type { 
  BlogListResponse, 
  BlogStatsResponse,
  BlogAuthor,
  BlogArticle,
  Locale 
} from '../../types';

interface AdminArticlesPageProps {
  initialData: BlogListResponse;
  stats: BlogStatsResponse;
  authors: BlogAuthor[];
  locale: Locale;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AdminArticlesPage({
  initialData,
  stats,
  authors,
  locale,
  searchParams,
}: AdminArticlesPageProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  const [data, setData] = useState<BlogListResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.search as string || '',
    status: searchParams.status as string || '',
    categoryId: searchParams.category as string || '',
    authorId: searchParams.author as string || '',
    featured: searchParams.featured as string || '',
  });

  // Fetch articles with current filters
  const fetchArticles = useCallback(async (params: any = {}) => {
    setLoading(true);
    
    try {
      const queryParams = new URLSearchParams();
      
      // Add current filters
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.status) queryParams.set('status', filters.status);
      if (filters.categoryId) queryParams.set('categoryId', filters.categoryId);
      if (filters.featured) queryParams.set('featured', filters.featured);
      
      // Add pagination
      queryParams.set('page', (params.page || 1).toString());
      queryParams.set('limit', '20');
      queryParams.set('sort', params.sort || 'updatedAt');
      queryParams.set('order', params.order || 'desc');
      queryParams.set('locale', locale);

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
  }, [filters, locale]);

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

    router.push(`/${locale}/admin/articles?${params.toString()}`, { scroll: false });
  }, [router, locale, urlSearchParams]);

  // Handle search
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    updateURL({ search: query || undefined });
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    updateURL({ [key]: value || undefined });
  };

  // Handle article actions
  const handleDeleteArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchArticles();
        setShowDeleteDialog(null);
      } else {
        console.error('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleDuplicateArticle = async (article: BlogArticle) => {
    try {
      const duplicateData = {
        ...article,
        title: {
          ...article.title,
          fr: `${article.title.fr} (Copie)`,
        },
        slug: {
          ...article.slug,
          fr: `${article.slug.fr}-copie-${Date.now()}`,
        },
        status: 'draft',
        createdBy: 'current-user', // This should come from auth
        updatedBy: 'current-user',
      };

      delete duplicateData.id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData),
      });

      if (response.ok) {
        fetchArticles();
      } else {
        console.error('Failed to duplicate article');
      }
    } catch (error) {
      console.error('Error duplicating article:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des Articles
              </h1>
              <p className="text-gray-600">
                Créez et gérez les articles de votre blog
              </p>
            </div>
            
            <Link
              href={`/${locale}/admin/articles/new`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvel Article
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedArticles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Brouillons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draftArticles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vues Totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher des articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
              <option value="scheduled">Programmé</option>
              <option value="archived">Archivé</option>
            </select>

            {/* Category filter */}
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name.fr}
                </option>
              ))}
            </select>

            {/* Featured filter */}
            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="true">En vedette</option>
              <option value="false">Non mis en vedette</option>
            </select>
          </div>
        </div>

        {/* Articles table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Table header */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedArticles.length === data.articles.length && data.articles.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedArticles(data.articles.map(a => a.id));
                    } else {
                      setSelectedArticles([]);
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  {selectedArticles.length > 0 && `${selectedArticles.length} sélectionné(s)`}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {data.total} article(s) au total
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Articles list */}
          {!loading && (
            <>
              {data.articles.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {data.articles.map((article) => {
                    const category = data.categories.find(c => c.id === article.categoryId);
                    const author = authors.find(a => a.id === article.authorId);
                    
                    return (
                      <div key={article.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedArticles.includes(article.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedArticles(prev => [...prev, article.id]);
                              } else {
                                setSelectedArticles(prev => prev.filter(id => id !== article.id));
                              }
                            }}
                            className="rounded"
                          />

                          {/* Featured image */}
                          {article.featuredImage ? (
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={article.featuredImage.url}
                                alt={article.title.fr}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                          )}

                          {/* Article info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                                {article.title.fr}
                              </h3>
                              
                              {article.featured.isFeatured && (
                                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-1" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {article.excerpt.fr}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {category && (
                                <span className="flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  {category.name.fr}
                                </span>
                              )}
                              
                              {author && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {author.name}
                                </span>
                              )}
                              
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(article.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                              </span>
                              
                              <span className="flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" />
                                {article.metrics.views} vues
                              </span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                              {getStatusIcon(article.status)}
                              {article.status === 'published' ? 'Publié' :
                               article.status === 'draft' ? 'Brouillon' :
                               article.status === 'scheduled' ? 'Programmé' :
                               article.status === 'archived' ? 'Archivé' : article.status}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Link
                              href={`/${locale}/blog/${article.slug.fr}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-gray-600 rounded"
                              title="Voir l'article"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            
                            <Link
                              href={`/${locale}/admin/articles/${article.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 rounded"
                              title="Éditer"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            
                            <button
                              onClick={() => handleDuplicateArticle(article)}
                              className="p-2 text-gray-400 hover:text-green-600 rounded"
                              title="Dupliquer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => setShowDeleteDialog(article.id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun article trouvé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par créer votre premier article
                  </p>
                  <Link
                    href={`/${locale}/admin/articles/new`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Créer un article
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={(page) => fetchArticles({ page })}
                showPrevNext
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Supprimer l'article
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteArticle(showDeleteDialog)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}