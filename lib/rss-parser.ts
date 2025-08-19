import Parser from 'rss-parser';
import type { Article } from '@/types/article';

const parser = new Parser();

// Fonction pour nettoyer le HTML
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Fonction pour générer un slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fonction pour extraire les images d'un contenu HTML
function extractImages(content: string): string[] {
  const images: string[] = [];
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }
  
  return images;
}

// Fonction pour récupérer les articles RSS
export async function fetchRSSArticles(feedUrl: string, sourceName: string, category: string): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    
    return feed.items.slice(0, 10).map((item, index) => {
      const content = item.content || item.contentSnippet || item.summary || '';
      const images = extractImages(content);
      const cleanContent = stripHtml(content);
      
      return {
        id: `rss-${Date.now()}-${index}`,
        slug: generateSlug(item.title || 'article'),
        
        title: item.title || 'Sans titre',
        excerpt: cleanContent.substring(0, 200) + '...',
        content: cleanContent,
        
        source: 'rss' as const,
        sourceUrl: feedUrl,
        sourceName: sourceName,
        originalUrl: item.link,
        
        category: category as any,
        tags: item.categories || [],
        
        featuredImage: images[0] || item.enclosure?.url,
        images: images,
        
        author: item.creator ? {
          name: item.creator,
        } : undefined,
        
        status: 'draft' as const,
        featured: false,
        
        publishedAt: item.pubDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération du flux RSS ${feedUrl}:`, error);
    return [];
  }
}

// Fonction pour reformuler un article avec l'API Claude
export async function reformulateArticle(article: Article): Promise<Article> {
  try {
    const response = await fetch('/api/ai/reformulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la reformulation');
    }

    const data = await response.json();
    
    return {
      ...article,
      title: data.title || article.title,
      content: data.content || article.content,
      excerpt: data.excerpt || article.excerpt,
      source: 'ai-generated' as const,
      status: 'published' as const,
    };
  } catch (error) {
    console.error('Erreur lors de la reformulation:', error);
    return article;
  }
}

// Fonction pour récupérer tous les articles de toutes les sources
export async function fetchAllRSSArticles(sources: any[]): Promise<Article[]> {
  const enabledSources = sources.filter(s => s.enabled);
  const articlesPromises = enabledSources.map(source => 
    fetchRSSArticles(source.url, source.name, source.category)
  );
  
  const articlesArrays = await Promise.all(articlesPromises);
  return articlesArrays.flat();
}