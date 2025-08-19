'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface DirectoryFilters {
  category?: string
  location?: string
  search?: string
  priceRange?: number
  rating?: number
  features?: string[]
}

interface DirectoryContextType {
  filters: DirectoryFilters
  setFilters: (filters: DirectoryFilters) => void
  updateFilter: (key: keyof DirectoryFilters, value: any) => void
  clearFilters: () => void
  viewMode: 'list' | 'grid' | 'map'
  setViewMode: (mode: 'list' | 'grid' | 'map') => void
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined)

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<DirectoryFilters>({})
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid')

  const updateFilter = useCallback((key: keyof DirectoryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return (
    <DirectoryContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        viewMode,
        setViewMode
      }}
    >
      {children}
    </DirectoryContext.Provider>
  )
}

export function useDirectory() {
  const context = useContext(DirectoryContext)
  if (context === undefined) {
    throw new Error('useDirectory must be used within a DirectoryProvider')
  }
  return context
}