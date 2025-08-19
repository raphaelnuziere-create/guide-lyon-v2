import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

// Email validation
export const emailSchema = z
  .string()
  .email('Email invalide')
  .min(5, 'Email trop court')
  .max(255, 'Email trop long')
  .transform(val => val.toLowerCase().trim())

// Phone validation (French format)
export const phoneSchema = z
  .string()
  .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide')
  .transform(val => val.replace(/[\s.-]/g, ''))

// URL validation
export const urlSchema = z
  .string()
  .url('URL invalide')
  .max(2048, 'URL trop longue')

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(100, 'Le mot de passe est trop long')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial')

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
  .max(30, 'Le nom d\'utilisateur est trop long')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores')

// Generic text validation
export const textSchema = z
  .string()
  .min(1, 'Ce champ est requis')
  .max(1000, 'Texte trop long')
  .transform(val => sanitizeText(val))

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long')
    .transform(val => sanitizeText(val)),
  
  email: emailSchema,
  
  phone: phoneSchema.optional(),
  
  subject: z
    .string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet est trop long')
    .transform(val => sanitizeText(val)),
  
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message est trop long')
    .transform(val => sanitizeText(val)),
  
  consent: z
    .boolean()
    .refine(val => val === true, 'Vous devez accepter les conditions'),
})

// Search query validation
export const searchQuerySchema = z
  .string()
  .min(2, 'La recherche doit contenir au moins 2 caractères')
  .max(100, 'La recherche est trop longue')
  .transform(val => sanitizeSearchQuery(val))

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string(),
  size: z.number().max(10 * 1024 * 1024, 'Le fichier ne doit pas dépasser 10MB'),
  type: z.enum([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'application/pdf',
  ], {
    errorMap: () => ({ message: 'Type de fichier non autorisé' })
  }),
})

// Sanitization functions
export function sanitizeText(text: string): string {
  // Remove any HTML tags and dangerous characters
  const cleaned = DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  })
  
  // Additional cleaning
  return cleaned
    .trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
}

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 
      'ul', 'ol', 'li', 'blockquote', 'h3', 'h4', 'h5', 'h6'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  })
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s\-àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/gi, '') // Keep alphanumeric and French chars
    .replace(/\s+/g, ' ')
    .substring(0, 100)
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255)
}

// XSS Prevention
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  
  return text.replace(/[&<>"'/]/g, char => map[char])
}

// SQL Injection Prevention (for raw queries if needed)
export function escapeSql(value: string): string {
  if (typeof value !== 'string') return value
  
  return value
    .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
      switch (char) {
        case '\0': return '\\0'
        case '\x08': return '\\b'
        case '\x09': return '\\t'
        case '\x1a': return '\\z'
        case '\n': return '\\n'
        case '\r': return '\\r'
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char
        default:
          return char
      }
    })
}

// CSRF Token validation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  
  // Constant-time comparison to prevent timing attacks
  if (token.length !== sessionToken.length) return false
  
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ sessionToken.charCodeAt(i)
  }
  
  return result === 0
}

// Rate limiting helper
export function createRateLimitKey(identifier: string, action: string): string {
  return `rate_limit:${action}:${identifier}`
}

// Input validation middleware
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    const result = schema.safeParse(data)
    
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      
      throw new ValidationError('Validation failed', errors)
    }
    
    return result.data
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Common validation patterns
export const patterns = {
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ipv6: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/,
  base64: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
}

export default {
  emailSchema,
  phoneSchema,
  urlSchema,
  passwordSchema,
  usernameSchema,
  textSchema,
  contactFormSchema,
  searchQuerySchema,
  fileUploadSchema,
  sanitizeText,
  sanitizeHTML,
  sanitizeSearchQuery,
  sanitizeFilename,
  escapeHtml,
  escapeSql,
  generateCSRFToken,
  validateCSRFToken,
  validateInput,
  ValidationError,
  patterns,
}