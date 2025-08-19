'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { BlogSearchProps } from '../../types';

export default function BlogSearch({
  placeholder = 'Rechercher des articles...',
  onSearch,
  initialQuery = '',
}: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Recherche
      </label>
      
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center border rounded-lg transition-all duration-200 ${
          isFocused ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-300'
        }`}>
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 bg-transparent focus:outline-none text-sm"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
        
        {query && (
          <div className="mt-2 text-xs text-gray-500">
            Recherche en cours pour "{query}"...
          </div>
        )}
      </form>
    </div>
  );
}