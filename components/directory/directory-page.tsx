'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DirectoryFilters } from './directory-filters';
import { DirectoryList } from './directory-list';
import { DirectoryMap } from './directory-map';
import { DirectoryHeader } from './directory-header';
import { DirectoryPagination } from './directory-pagination';
import { DirectoryExport } from './directory-export';
import { Place } from '@/types';
import { updateQueryString } from '@/lib/utils/url';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useFavorites } from '@/hooks/use-favorites';

interface DirectoryPageProps {
  places: Place[];
  total: number;
  hasMore: boolean;
  currentPage: number;
  view: 'list' | 'grid' | 'map';
  sort: string;
  filters: any;
  locale: string;
  dict: any;
}

export function DirectoryPage({
  places: initialPlaces,
  total,
  hasMore,
  currentPage,
  view: initialView,
  sort: initialSort,
  filters: initialFilters,
  locale,
  dict,
}: DirectoryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [places, setPlaces] = useState(initialPlaces);
  const [view, setView] = useState(initialView);
  const [sort, setSort] = useState(initialSort);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  
  const { location, error: geoError, getLocation } = useGeolocation();
  const { favorites, toggleFavorite } = useFavorites();

  // Update URL when filters change
  const updateUrl = useCallback((newParams: Record<string, any>) => {
    const url = updateQueryString(window.location.href, newParams);
    router.push(url, { scroll: false });
  }, [router]);

  // Handle view change
  const handleViewChange = useCallback((newView: 'list' | 'grid' | 'map') => {
    setView(newView);
    updateUrl({ view: newView });
  }, [updateUrl]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    updateUrl({ sort: newSort, page: '1' });
  }, [updateUrl]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    const filterParams = {
      category: newFilters.category,
      district: newFilters.district?.toString(),
      tags: newFilters.tags?.join(','),
      price: newFilters.price,
      features: newFilters.features?.join(','),
      q: newFilters.search,
      page: '1',
    };
    
    // Remove empty values
    Object.keys(filterParams).forEach(key => {
      if (!filterParams[key]) delete filterParams[key];
    });
    
    updateUrl(filterParams);
  }, [updateUrl]);

  // Handle geolocation search
  const handleNearMe = useCallback(async () => {
    try {
      const coords = await getLocation();
      if (coords) {
        updateUrl({
          lat: coords.latitude.toString(),
          lng: coords.longitude.toString(),
          radius: '5', // 5km default
          page: '1',
        });
      }
    } catch (error) {
      console.error('Geolocation error:', error);
    }
  }, [getLocation, updateUrl]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    updateUrl({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateUrl]);

  // Load more places when filters/sort/page change
  useEffect(() => {
    const loadPlaces = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/places?${searchParams.toString()}`);
        const data = await response.json();
        setPlaces(data.places);
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Skip initial load
    if (searchParams.toString() !== new URLSearchParams(window.location.search).toString()) {
      loadPlaces();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DirectoryHeader
        title={dict.directory.title}
        subtitle={dict.directory.subtitle}
        total={total}
        view={view}
        onViewChange={handleViewChange}
        sort={sort}
        onSortChange={handleSortChange}
        dict={dict}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <DirectoryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onNearMe={handleNearMe}
              locationEnabled={!!location}
              dict={dict}
            />
            
            <DirectoryExport
              filters={filters}
              total={total}
              dict={dict}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {view === 'map' ? (
              <DirectoryMap
                places={places}
                center={location ? [location.latitude, location.longitude] : undefined}
                onPlaceClick={(place) => router.push(`/${locale}/etablissement/${place.slug}`)}
                dict={dict}
              />
            ) : (
              <>
                <DirectoryList
                  places={places}
                  view={view}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  isLoading={isLoading}
                  locale={locale}
                  dict={dict}
                />
                
                <DirectoryPagination
                  currentPage={currentPage}
                  total={total}
                  pageSize={24}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}