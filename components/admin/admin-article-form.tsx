'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Calendar, 
  Star, 
  Upload, 
  X,
  Sparkles,
  FileText,
  Tag,
  User,
  Globe,
  Settings,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import TiptapEditor from '../blog/tiptap-editor';
import LoadingSpinner from '../ui/loading-spinner';
import type { 
  BlogArticle, 
  BlogCategory, 
  BlogTag, 
  BlogAuthor, 
  BlogFormData,
  Locale 
} from '../../types';

interface AdminArticleFormProps {
  article: BlogArticle | null;
  categories: BlogCategory[];
  tags: BlogTag[];
  authors: BlogAuthor[];
  locale: Locale;
  mode: 'create' | 'edit';
}

export default function AdminArticleForm({
  article,
  categories,
  tags,
  authors,
  locale,
  mode,
}: AdminArticleFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [selectedTags, setSelectedTags] = useState<string[]>(article?.tagIds || []);
  const [featuredImage, setFeaturedImage] = useState(article?.featuredImage || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState(false);

  // Initialize form with default values
  const defaultValues: BlogFormData = {
    title: {
      fr: article?.title.fr || '',
      en: article?.title.en || '',
      es: article?.title.es || '',
      it: article?.title.it || '',
    },
    slug: {
      fr: article?.slug.fr || '',
      en: article?.slug.en || '',
      es: article?.slug.es || '',
      it: article?.slug.it || '',
    },
    excerpt: {
      fr: article?.excerpt.fr || '',
      en: article?.excerpt.en || '',
      es: article?.excerpt.es || '',
      it: article?.excerpt.it || '',
    },
    content: {
      fr: article?.content.fr || '',
      en: article?.content.en || '',
      es: article?.content.es || '',
      it: article?.content.it || '',
    },
    featuredImage: article?.featuredImage,
    categoryId: article?.categoryId || '',
    tagIds: article?.tagIds || [],
    seo: {
      metaTitle: {
        fr: article?.seo.metaTitle.fr || '',
        en: article?.seo.metaTitle.en || '',
        es: article?.seo.metaTitle.es || '',
        it: article?.seo.metaTitle.it || '',
      },
      metaDescription: {
        fr: article?.seo.metaDescription.fr || '',
        en: article?.seo.metaDescription.en || '',
        es: article?.seo.metaDescription.es || '',
        it: article?.seo.metaDescription.it || '',
      },
      keywords: {
        fr: article?.seo.keywords.fr || '',
        en: article?.seo.keywords.en || '',
        es: article?.seo.keywords.es || '',
        it: article?.seo.keywords.it || '',
      },
      canonicalUrl: {
        fr: article?.seo.canonicalUrl?.fr || '',
        en: article?.seo.canonicalUrl?.en || '',
        es: article?.seo.canonicalUrl?.es || '',
        it: article?.seo.canonicalUrl?.it || '',
      },
      noindex: article?.seo.noindex || false,
    },
    status: article?.status || 'draft',
    scheduledAt: article?.scheduledAt,
    featured: {
      isFeatured: article?.featured.isFeatured || false,
      priority: article?.featured.priority || 0,
    },
  };

  const { 
    register, 
    control, 
    handleSubmit, 
    watch, 
    setValue, 
    formState: { errors, isDirty } 
  } = useForm<BlogFormData>({
    defaultValues,
  });

  const watchedTitle = watch(`title.${locale}`);
  const watchedStatus = watch('status');

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && mode === 'create') {
      const slug = watchedTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue(`slug.${locale}`, slug);
    }
  }, [watchedTitle, setValue, locale, mode]);

  // Auto-generate SEO meta title from title
  useEffect(() => {
    if (watchedTitle) {
      setValue(`seo.metaTitle.${locale}`, `${watchedTitle} | Guide de Lyon`);
    }
  }, [watchedTitle, setValue, locale]);

  // Handle tag selection
  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newTags);
    setValue('tagIds', newTags);
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'featured');

      const response = await fetch('/api/articles/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        const imageData = {
          url: result.data.url,
          alt: {
            fr: watchedTitle || '',
            en: '',
            es: '',
            it: '',
          },
          credits: '',
          width: 1200,
          height: 630,
        };
        
        setFeaturedImage(imageData);
        setValue('featuredImage', imageData);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Show error notification
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle AI suggestion
  const handleAISuggestion = async () => {
    if (!article) return;

    setAiSuggestionLoading(true);
    
    try {
      const response = await fetch('/api/blog/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          type: 'content_improvement',
          locale,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setShowAISuggestion(true);
          // Handle the AI suggestion result
          console.log('AI suggestion created:', result.data);
        }
      }
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    } finally {
      setAiSuggestionLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: BlogFormData) => {
    setSaving(true);
    
    try {
      const url = mode === 'create' 
        ? '/api/articles'
        : `/api/articles/${article!.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const payload = {
        ...data,
        tagIds: selectedTags,
        featuredImage,
        createdBy: 'current-user', // This should come from auth context
        updatedBy: 'current-user',
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Redirect to articles list or continue editing
          if (data.status === 'published') {
            router.push(`/${locale}/admin/articles`);
          } else {
            // Stay on the form for drafts
            if (mode === 'create') {
              router.push(`/${locale}/admin/articles/${result.data.id}`);
            }
          }
        } else {
          throw new Error(result.error || 'Save failed');
        }
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      // Show error notification
    } finally {
      setSaving(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (article && article.slug[locale]) {
      window.open(`/${locale}/blog/${article.slug[locale]}?preview=true`, '_blank');
    }
  };

  const tabs = [
    { id: 'content', name: 'Contenu', icon: FileText },
    { id: 'seo', name: 'SEO', icon: Globe },
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/admin/articles`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Retour aux articles</span>
              </Link>
              
              <div className="hidden sm:block w-px h-6 bg-gray-300" />
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {mode === 'create' ? 'Nouvel Article' : 'Éditer l\'Article'}
                </h1>
                {isDirty && (
                  <p className="text-sm text-orange-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Modifications non sauvegardées
                  </p>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              
              {/* AI Suggestion */}
              {mode === 'edit' && (
                <button
                  onClick={handleAISuggestion}
                  disabled={aiSuggestionLoading}
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors"
                >
                  {aiSuggestionLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Suggestion IA</span>
                </button>
              )}

              {/* Preview */}
              {mode === 'edit' && (
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Aperçu</span>
                </button>
              )}

              {/* Save as draft */}
              <button
                onClick={handleSubmit((data) => onSubmit({ ...data, status: 'draft' }))}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {saving && watchedStatus === 'draft' ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Brouillon</span>
              </button>

              {/* Publish */}
              <button
                onClick={handleSubmit((data) => onSubmit({ ...data, status: 'published' }))}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving && watchedStatus === 'published' ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Publier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main content */}
          <div className="flex-1">
            
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      {...register(`title.${locale}`, { required: 'Le titre est requis' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder="Titre de l'article"
                    />
                    {errors.title?.[locale] && (
                      <p className="mt-1 text-sm text-red-600">{errors.title[locale]?.message}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      {...register(`slug.${locale}`)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="slug-de-larticle"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Résumé
                    </label>
                    <textarea
                      {...register(`excerpt.${locale}`)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Bref résumé de l'article"
                    />
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image mise en avant
                    </label>
                    
                    {featuredImage ? (
                      <div className="relative">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image
                            src={featuredImage.url}
                            alt={featuredImage.alt[locale] || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFeaturedImage(null);
                            setValue('featuredImage', undefined);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <div className="space-y-2">
                            <label className="cursor-pointer">
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                {uploadingImage ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                Choisir une image
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadingImage}
                              />
                            </label>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, WebP jusqu'à 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu de l'article *
                    </label>
                    <Controller
                      name={`content.${locale}`}
                      control={control}
                      rules={{ required: 'Le contenu est requis' }}
                      render={({ field }) => (
                        <TiptapEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Rédigez votre article..."
                          className="min-h-[400px]"
                        />
                      )}
                    />
                    {errors.content?.[locale] && (
                      <p className="mt-1 text-sm text-red-600">{errors.content[locale]?.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Optimisation pour les moteurs de recherche
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta titre
                        </label>
                        <input
                          {...register(`seo.metaTitle.${locale}`)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Titre pour les moteurs de recherche"
                          maxLength={60}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Recommandé: 50-60 caractères
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta description
                        </label>
                        <textarea
                          {...register(`seo.metaDescription.${locale}`)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Description pour les moteurs de recherche"
                          maxLength={160}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Recommandé: 150-160 caractères
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mots-clés
                        </label>
                        <input
                          {...register(`seo.keywords.${locale}`)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="lyon, tourisme, guide"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Séparez les mots-clés par des virgules
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL canonique
                        </label>
                        <input
                          {...register(`seo.canonicalUrl.${locale}`)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/article"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          {...register('seo.noindex')}
                          type="checkbox"
                          className="rounded"
                        />
                        <label className="text-sm text-gray-700">
                          Ne pas indexer cet article (noindex)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Paramètres de publication
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          {...register('categoryId', { required: 'La catégorie est requise' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name.fr}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId && (
                          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {tags.map((tag) => (
                            <label key={tag.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag.id)}
                                onChange={() => handleTagToggle(tag.id)}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-700">
                                {tag.name.fr}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auteur
                        </label>
                        <select
                          {...register('authorId')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner un auteur</option>
                          {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                              {author.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          {...register('featured.isFeatured')}
                          type="checkbox"
                          className="rounded"
                        />
                        <label className="text-sm text-gray-700 flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Mettre en vedette cet article
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Programmer la publication
                        </label>
                        <Controller
                          name="scheduledAt"
                          control={control}
                          render={({ field }) => (
                            <input
                              type="datetime-local"
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-24 space-y-6">
              
              {/* Quick actions */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleSubmit((data) => onSubmit({ ...data, status: 'draft' }))}
                    disabled={saving}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer comme brouillon
                  </button>
                  
                  {mode === 'edit' && (
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4" />
                      Aperçu de l'article
                    </button>
                  )}
                </div>
              </div>

              {/* Article info */}
              {article && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informations
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' :
                        article.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créé:</span>
                      <span>{new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modifié:</span>
                      <span>{new Date(article.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vues:</span>
                      <span>{article.metrics.views}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}