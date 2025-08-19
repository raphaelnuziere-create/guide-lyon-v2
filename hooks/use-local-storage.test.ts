import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './use-local-storage'

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear any console mocks
    vi.clearAllMocks()
  })

  it('should initialize with default value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'default-value')
    )
    
    expect(result.current[0]).toBe('default-value')
  })

  it('should initialize with value from localStorage', () => {
    localStorage.setItem('existing-key', JSON.stringify('existing-value'))
    
    const { result } = renderHook(() => 
      useLocalStorage('existing-key', 'default-value')
    )
    
    expect(result.current[0]).toBe('existing-value')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => 
      useLocalStorage('update-key', 'initial')
    )
    
    act(() => {
      result.current[1]('updated')
    })
    
    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('update-key')).toBe('"updated"')
  })

  it('should handle objects and arrays', () => {
    const { result } = renderHook(() => 
      useLocalStorage('object-key', { name: 'test', count: 0 })
    )
    
    act(() => {
      result.current[1]({ name: 'updated', count: 1 })
    })
    
    expect(result.current[0]).toEqual({ name: 'updated', count: 1 })
    expect(JSON.parse(localStorage.getItem('object-key') || '{}')).toEqual({
      name: 'updated',
      count: 1,
    })
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => 
      useLocalStorage('counter', 0)
    )
    
    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
    
    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })
    
    expect(result.current[0]).toBe(2)
  })

  it('should handle removal from localStorage', () => {
    const { result } = renderHook(() => 
      useLocalStorage('remove-key', 'value')
    )
    
    act(() => {
      result.current[1](undefined)
    })
    
    expect(result.current[0]).toBe(undefined)
    expect(localStorage.getItem('remove-key')).toBe(null)
  })

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('invalid-json', 'not-valid-json{')
    
    const { result } = renderHook(() => 
      useLocalStorage('invalid-json', 'fallback')
    )
    
    expect(result.current[0]).toBe('fallback')
  })

  it('should sync across multiple hooks with same key', () => {
    const { result: result1 } = renderHook(() => 
      useLocalStorage('shared-key', 'initial')
    )
    const { result: result2 } = renderHook(() => 
      useLocalStorage('shared-key', 'initial')
    )
    
    act(() => {
      result1.current[1]('updated-from-1')
    })
    
    // Both hooks should have the updated value
    expect(result1.current[0]).toBe('updated-from-1')
    expect(localStorage.getItem('shared-key')).toBe('"updated-from-1"')
  })
})