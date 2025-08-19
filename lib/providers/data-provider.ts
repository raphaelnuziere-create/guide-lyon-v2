import { MDXProvider, Article } from './mdx-provider'
// import { FirestoreProvider } from './firestore-provider' // Pour plus tard

export interface IDataProvider {
  getAllArticles(): Promise<Article[]>
  getArticleBySlug(slug: string): Promise<Article | null>
  getArticlesByCategory(category: string): Promise<Article[]>
  getArticlesByTag(tag: string): Promise<Article[]>
  getFeaturedArticles(): Promise<Article[]>
  getLatestArticles(limit?: number): Promise<Article[]>
  searchArticles(query: string): Promise<Article[]>
  getCategories(): Promise<string[]>
  getTags(): Promise<string[]>
}

class DataProvider implements IDataProvider {
  private provider: IDataProvider

  constructor() {
    const dataSource = process.env.DATA_SOURCE || 'mdx'
    
    if (dataSource === 'mdx') {
      this.provider = new MDXProvider()
    } else {
      // Pour plus tard quand on aura Firebase
      // this.provider = new FirestoreProvider()
      this.provider = new MDXProvider() // Fallback to MDX for now
    }
  }

  async getAllArticles() {
    return this.provider.getAllArticles()
  }

  async getArticleBySlug(slug: string) {
    return this.provider.getArticleBySlug(slug)
  }

  async getArticlesByCategory(category: string) {
    return this.provider.getArticlesByCategory(category)
  }

  async getArticlesByTag(tag: string) {
    return this.provider.getArticlesByTag(tag)
  }

  async getFeaturedArticles() {
    return this.provider.getFeaturedArticles()
  }

  async getLatestArticles(limit = 10) {
    return this.provider.getLatestArticles(limit)
  }

  async searchArticles(query: string) {
    return this.provider.searchArticles(query)
  }

  async getCategories() {
    return this.provider.getCategories()
  }

  async getTags() {
    return this.provider.getTags()
  }
}

export const dataProvider = new DataProvider()
export type { Article }