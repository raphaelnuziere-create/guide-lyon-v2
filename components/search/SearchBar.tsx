'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { debounce } from '@/lib/performance'

interface SearchResult {
  id: string
  title: string
  type: 'article' | 'place' | 'event' | 'page'
  url: string
  description?: string
  image?: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        
        if (!response.ok) throw new Error('Search failed')
        
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    performSearch(query)
  }, [query, performSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && e.ctrlKey) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
      
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setQuery('')
    setIsOpen(false)
    setResults([])
    router.push(result.url)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'article':
        return '📄'
      case 'place':
        return '📍'
      case 'event':
        return '📅'
      case 'page':
        return '📑'
      default:
        return '🔍'
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher... (Ctrl+/)"
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          aria-label="Rechercher"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />
        
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <svg
              className="w-5 h-5 text-gray-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div
          id="search-results"
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
        >
          {results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li
                  key={result.id}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-red-50 text-red-900'
                      : 'hover:bg-gray-50'
                  } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start">
                    <span className="mr-3 text-xl" aria-hidden="true">
                      {getResultIcon(result.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      {result.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 && !isLoading ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h-.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Aucun résultat trouvé</p>
              <p className="mt-1 text-sm">
                Essayez avec d'autres mots-clés
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}