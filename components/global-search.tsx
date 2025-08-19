'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Badge,
  Button,
} from '@guide-de-lyon/ui';
import { Search, MapPin, Calendar, FileText, Loader2 } from 'lucide-react';
import type { SearchResult, GlobalSearchProps } from '../types';

// Mock search function - replace with actual API call
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Basilique Notre-Dame de Fourvière',
    type: 'place',
    description: 'Magnifique basilique surplombant Lyon',
    location: 'Fourvière, Lyon',
  },
  {
    id: '2',
    title: 'Festival des Lumières 2024',
    type: 'event',
    description: 'Le plus grand festival de lumière au monde',
    date: '8-11 Décembre 2024',
  },
  {
    id: '3',
    title: 'Les meilleurs restaurants de Lyon',
    type: 'article',
    description: 'Découvrez la gastronomie lyonnaise',
  },
];

export function GlobalSearch({ className, placeholder, onSelect }: GlobalSearchProps = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      const timeoutId = setTimeout(async () => {
        if (searchQuery.trim().length >= 2) {
          setIsLoading(true);
          try {
            // Mock API call - replace with actual search API
            await new Promise(resolve => setTimeout(resolve, 300));
            const filteredResults = mockSearchResults.filter(result =>
              result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              result.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filteredResults);
          } catch (error) {
            console.error('Search error:', error);
            setResults([]);
          } finally {
            setIsLoading(false);
          }
        } else {
          setResults([]);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    []
  );

  useEffect(() => {
    const cleanup = debouncedSearch(query);
    return cleanup;
  }, [query, debouncedSearch]);

  const handleSelect = (result: SearchResult) => {
    if (onSelect) {
      onSelect(result);
    } else {
      const basePath = result.type === 'place' ? '/places' : 
                      result.type === 'event' ? '/events' : '/articles';
      router.push(`${basePath}/${result.id}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'place':
        return <MapPin className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    const labels = {
      place: 'Lieux',
      event: 'Événements', 
      article: 'Articles'
    };
    return labels[type] || type;
  };

  return (
    <div className={`relative w-full ${className || ''}`}>
      <Command className="rounded-lg border shadow-md" shouldFilter={false}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder={placeholder || 'Rechercher...'}
            value={query}
            onValueChange={setQuery}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // Delay closing to allow for item selection
              setTimeout(() => setIsOpen(false), 200);
            }}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin opacity-50" />
          )}
        </div>

        {isOpen && query.length >= 2 && (
          <CommandList className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="py-6 text-center text-sm">
                Recherche en cours...
              </div>
            ) : results.length === 0 ? (
              <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
            ) : (
              <>
                {['place', 'event', 'article'].map((type) => {
                  const typeResults = results.filter(r => r.type === type);
                  if (typeResults.length === 0) return null;

                  return (
                    <CommandGroup key={type} heading={getTypeLabel(type as SearchResult['type'])}>
                      {typeResults.map((result) => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => handleSelect(result)}
                          className="flex items-start space-x-3 p-3 cursor-pointer"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(result.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium">{result.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {getTypeLabel(result.type)}
                              </Badge>
                            </div>
                            {result.description && (
                              <p className="text-xs text-muted-foreground">
                                {result.description}
                              </p>
                            )}
                            {result.location && (
                              <p className="text-xs text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {result.location}
                              </p>
                            )}
                            {result.date && (
                              <p className="text-xs text-muted-foreground flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {result.date}
                              </p>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })}
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}