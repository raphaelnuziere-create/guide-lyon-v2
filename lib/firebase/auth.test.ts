import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validatePassword, validateEmail, isAdmin, isPro, canManageEstablishment } from './auth'

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

describe('Auth Validation Functions', () => {
  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongP@ss123')).toBe(true)
      expect(validatePassword('MyP@ssw0rd!')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('weak')).toBe(false)
      expect(validatePassword('12345678')).toBe(false)
      expect(validatePassword('password')).toBe(false)
    })

    it('should require minimum length', () => {
      expect(validatePassword('Sh0rt!')).toBe(false)
      expect(validatePassword('L0nger!Pass')).toBe(true)
    })

    it('should require special characters and numbers', () => {
      expect(validatePassword('NoSpecialChar1')).toBe(false)
      expect(validatePassword('NoNumber!')).toBe(false)
      expect(validatePassword('ValidP@ss1')).toBe(true)
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.user@domain.fr')).toBe(true)
      expect(validateEmail('admin+test@guide-de-lyon.fr')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('notanemail')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user @domain.com')).toBe(false)
    })
  })

  describe('Role Checking Functions', () => {
    const adminUser = { role: 'admin', uid: '123' }
    const proUser = { role: 'pro', uid: '456' }
    const proBoostUser = { role: 'pro_boost', uid: '789' }
    const regularUser = { role: 'user', uid: '101' }

    it('should identify admin users', () => {
      expect(isAdmin(adminUser)).toBe(true)
      expect(isAdmin(proUser)).toBe(false)
      expect(isAdmin(regularUser)).toBe(false)
      expect(isAdmin(null)).toBe(false)
    })

    it('should identify pro users', () => {
      expect(isPro(proUser)).toBe(true)
      expect(isPro(proBoostUser)).toBe(true)
      expect(isPro(adminUser)).toBe(false)
      expect(isPro(regularUser)).toBe(false)
      expect(isPro(null)).toBe(false)
    })

    it('should check establishment management permissions', () => {
      const establishment = { ownerId: '456' }
      
      expect(canManageEstablishment(adminUser, establishment)).toBe(true)
      expect(canManageEstablishment(proUser, establishment)).toBe(true)
      expect(canManageEstablishment(regularUser, establishment)).toBe(false)
      expect(canManageEstablishment(null, establishment)).toBe(false)
    })
  })
})

describe('Auth Error Handling', () => {
  it('should handle auth errors gracefully', () => {
    const getErrorMessage = (code: string) => {
      const errors: Record<string, string> = {
        'auth/user-not-found': 'Utilisateur non trouvé',
        'auth/wrong-password': 'Mot de passe incorrect',
        'auth/email-already-in-use': 'Cet email est déjà utilisé',
        'auth/weak-password': 'Mot de passe trop faible',
        'auth/invalid-email': 'Email invalide',
      }
      return errors[code] || 'Erreur inconnue'
    }

    expect(getErrorMessage('auth/user-not-found')).toBe('Utilisateur non trouvé')
    expect(getErrorMessage('auth/wrong-password')).toBe('Mot de passe incorrect')
    expect(getErrorMessage('unknown-error')).toBe('Erreur inconnue')
  })
})