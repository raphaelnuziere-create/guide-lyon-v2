import { describe, it, expect } from 'vitest'
import { cn, formatPrice, formatDate, slugify, truncate } from './utils'

describe('cn (className utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('base', 'additional')).toBe('base additional')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })

  it('should override Tailwind classes correctly', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['base', 'test'], 'additional')).toBe('base test additional')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })
})

describe('formatPrice', () => {
  it('should format price in euros', () => {
    expect(formatPrice(10)).toBe('10,00 €')
    expect(formatPrice(1234.56)).toBe('1 234,56 €')
    expect(formatPrice(0)).toBe('0,00 €')
  })

  it('should handle negative prices', () => {
    expect(formatPrice(-10)).toBe('-10,00 €')
  })

  it('should handle large numbers', () => {
    expect(formatPrice(1000000)).toBe('1 000 000,00 €')
  })
})

describe('formatDate', () => {
  it('should format date in French locale', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toContain('15')
    expect(formatDate(date)).toContain('janvier')
    expect(formatDate(date)).toContain('2024')
  })

  it('should handle ISO string dates', () => {
    const isoString = '2024-07-14T10:00:00Z'
    const result = formatDate(isoString)
    expect(result).toContain('14')
    expect(result).toContain('juillet')
  })

  it('should handle timestamp', () => {
    const timestamp = new Date('2024-12-25').getTime()
    const result = formatDate(timestamp)
    expect(result).toContain('25')
    expect(result).toContain('décembre')
  })
})

describe('slugify', () => {
  it('should convert text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Lyon & Région')).toBe('lyon-region')
    expect(slugify('Événement Spécial!')).toBe('evenement-special')
  })

  it('should handle French accents', () => {
    expect(slugify('Château de la Tête d\'Or')).toBe('chateau-de-la-tete-dor')
    expect(slugify('Musée des Confluences')).toBe('musee-des-confluences')
  })

  it('should handle multiple spaces and special characters', () => {
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    expect(slugify('Test@#$%^&*()')).toBe('test')
  })

  it('should handle empty string', () => {
    expect(slugify('')).toBe('')
  })
})

describe('truncate', () => {
  it('should truncate long text', () => {
    const longText = 'This is a very long text that needs to be truncated'
    expect(truncate(longText, 20)).toBe('This is a very long...')
  })

  it('should not truncate short text', () => {
    const shortText = 'Short text'
    expect(truncate(shortText, 20)).toBe('Short text')
  })

  it('should handle exact length', () => {
    const text = '12345678901234567890'
    expect(truncate(text, 20)).toBe('12345678901234567890')
  })

  it('should handle custom suffix', () => {
    const text = 'This is a long text'
    expect(truncate(text, 10, '***')).toBe('This is a ***')
  })

  it('should handle empty string', () => {
    expect(truncate('', 10)).toBe('')
  })
})