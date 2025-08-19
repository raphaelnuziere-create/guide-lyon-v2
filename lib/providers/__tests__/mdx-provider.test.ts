import { describe, it, expect, beforeAll } from 'vitest';
import { MDXProvider } from '../mdx-provider';

describe('MDXProvider', () => {
  let provider: MDXProvider;

  beforeAll(() => {
    provider = new MDXProvider();
  });

  describe('getAllArticles', () => {
    it('should return an array of articles', async () => {
      const articles = await provider.getAllArticles();
      expect(Array.isArray(articles)).toBe(true);
    });

    it('should return articles sorted by date', async () => {
      const articles = await provider.getAllArticles();
      if (articles.length > 1) {
        const dates = articles.map(a => new Date(a.publishedAt).getTime());
        const sortedDates = [...dates].sort((a, b) => b - a);
        expect(dates).toEqual(sortedDates);
      }
    });
  });

  describe('getArticleBySlug', () => {
    it('should return null for non-existent slug', async () => {
      const article = await provider.getArticleBySlug('non-existent-slug-123');
      expect(article).toBeNull();
    });

    it('should return article for valid slug', async () => {
      const articles = await provider.getAllArticles();
      if (articles.length > 0) {
        const firstArticle = articles[0];
        const article = await provider.getArticleBySlug(firstArticle.slug);
        expect(article).toBeDefined();
        expect(article?.slug).toBe(firstArticle.slug);
      }
    });
  });

  describe('getCategories', () => {
    it('should return unique categories', async () => {
      const categories = await provider.getCategories();
      expect(Array.isArray(categories)).toBe(true);
      const uniqueCategories = [...new Set(categories)];
      expect(categories.length).toBe(uniqueCategories.length);
    });
  });

  describe('getTags', () => {
    it('should return unique tags', async () => {
      const tags = await provider.getTags();
      expect(Array.isArray(tags)).toBe(true);
      const uniqueTags = [...new Set(tags)];
      expect(tags.length).toBe(uniqueTags.length);
    });
  });

  describe('searchArticles', () => {
    it('should return empty array for no matches', async () => {
      const results = await provider.searchArticles('xyzxyzxyz123456');
      expect(results).toEqual([]);
    });

    it('should find articles by content', async () => {
      const results = await provider.searchArticles('Lyon');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});