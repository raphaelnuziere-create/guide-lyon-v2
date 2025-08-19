import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export interface ArticleMeta {
  title: string
  title_i18n?: Record<string, string>
  slug: string
  slug_i18n?: Record<string, string>
  excerpt: string
  excerpt_i18n?: Record<string, string>
  category: string
  tags: string[]
  author: string
  publishedAt: string
  updatedAt?: string
  featured: boolean
  image: string
  imageAlt: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

export interface Article extends ArticleMeta {
  content: string
  htmlContent?: string
}

const CONTENT_PATH = path.join(process.cwd(), 'content', 'articles')

export class MDXProvider {
  async getAllArticles(): Promise<Article[]> {
    try {
      const files = await fs.readdir(CONTENT_PATH)
      const mdxFiles = files.filter(file => file.endsWith('.mdx'))
      
      const articles = await Promise.all(
        mdxFiles.map(async (file) => {
          const article = await this.getArticleByFilename(file)
          return article
        })
      )
      
      // Sort by publishedAt date (newest first)
      return articles
        .filter(Boolean)
        .sort((a, b) => {
          const dateA = new Date(a.publishedAt)
          const dateB = new Date(b.publishedAt)
          return dateB.getTime() - dateA.getTime()
        }) as Article[]
    } catch (error) {
      console.error('Error reading articles:', error)
      return []
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const files = await fs.readdir(CONTENT_PATH)
      const mdxFiles = files.filter(file => file.endsWith('.mdx'))
      
      for (const file of mdxFiles) {
        const article = await this.getArticleByFilename(file)
        if (article && (article.slug === slug || 
            article.slug_i18n?.fr === slug ||
            article.slug_i18n?.en === slug ||
            article.slug_i18n?.es === slug ||
            article.slug_i18n?.it === slug)) {
          return article
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting article by slug:', error)
      return null
    }
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    const articles = await this.getAllArticles()
    return articles.filter(article => article.category === category)
  }

  async getArticlesByTag(tag: string): Promise<Article[]> {
    const articles = await this.getAllArticles()
    return articles.filter(article => article.tags.includes(tag))
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const articles = await this.getAllArticles()
    return articles.filter(article => article.featured)
  }

  async getLatestArticles(limit: number = 10): Promise<Article[]> {
    const articles = await this.getAllArticles()
    return articles.slice(0, limit)
  }

  async searchArticles(query: string): Promise<Article[]> {
    const articles = await this.getAllArticles()
    const lowercaseQuery = query.toLowerCase()
    
    return articles.filter(article => {
      const searchableContent = [
        article.title,
        article.excerpt,
        article.content,
        ...article.tags,
        article.category
      ].join(' ').toLowerCase()
      
      return searchableContent.includes(lowercaseQuery)
    })
  }

  private async getArticleByFilename(filename: string): Promise<Article | null> {
    try {
      const filePath = path.join(CONTENT_PATH, filename)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      
      const { data, content } = matter(fileContent)
      
      // Process markdown to HTML
      const processedContent = await remark()
        .use(html)
        .process(content)
      
      return {
        ...data,
        content,
        htmlContent: processedContent.toString(),
      } as Article
    } catch (error) {
      console.error(`Error reading article ${filename}:`, error)
      return null
    }
  }

  async getCategories(): Promise<string[]> {
    const articles = await this.getAllArticles()
    const categories = new Set(articles.map(article => article.category))
    return Array.from(categories).sort()
  }

  async getTags(): Promise<string[]> {
    const articles = await this.getAllArticles()
    const tags = new Set(articles.flatMap(article => article.tags))
    return Array.from(tags).sort()
  }
}

// Singleton instance
export const mdxProvider = new MDXProvider()