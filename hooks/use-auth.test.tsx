import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuth } from './use-auth'
import React from 'react'

// Mock Firebase
vi.mock('@/lib/firebase/client', () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      // Simulate authenticated user
      callback({ uid: 'test-uid', email: 'test@example.com' })
      return () => {} // unsubscribe function
    }),
    signOut: vi.fn(),
  },
  db: {},
}))

// Create a wrapper component for the hook
const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.loading).toBeDefined()
    expect(result.current.user).toBeDefined()
  })

  it('should set user when authenticated', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.user).toEqual({
        uid: 'test-uid',
        email: 'test@example.com',
      })
    })
  })

  it('should handle sign out', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.signOut()
    })
    
    expect(vi.mocked(require('@/lib/firebase/client').auth.signOut)).toHaveBeenCalled()
  })
})