'use client';

import { useState } from 'react';
import { Button, Input, Badge } from '@guide-de-lyon/ui';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { PlaceFilters, PlaceCategory } from '@/types';
import { lyonDistricts, amenitiesList } from '@/lib/data/places-seed';

interface DirectoryFiltersProps {
  filters: PlaceFilters;
  categories: PlaceCategory[];
  onFiltersChange: (filters: PlaceFilters) => void;
  resultsCount: number;
}

export function DirectoryFilters({ 
  filters, 
  categories, 
  onFiltersChange, 
  resultsCount 
}: DirectoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ 
      ...filters, 
      category: filters.category === category ? undefined : category 
    });
  };

  const handleDistrictChange = (district: number) => {
    const districts = filters.district || [];
    const newDistricts = districts.includes(district)
      ? districts.filter(d => d !== district)
      : [...districts, district];
    
    onFiltersChange({ 
      ...filters, 
      district: newDistricts.length > 0 ? newDistricts : undefined 
    });
  };

  const handlePriceRangeChange = (priceRange: string) => {
    const ranges = filters.priceRange || [];
    const newRanges = ranges.includes(priceRange)
      ? ranges.filter(r => r !== priceRange)
      : [...ranges, priceRange];
    
    onFiltersChange({ 
      ...filters, 
      priceRange: newRanges.length > 0 ? newRanges : undefined 
    });
  };

  const handleAmenityChange = (amenity: string) => {
    const amenities = filters.amenities || [];
    const newAmenities = amenities.includes(amenity)
      ? amenities.filter(a => a !== amenity)
      : [...amenities, amenity];
    
    onFiltersChange({ 
      ...filters, 
      amenities: newAmenities.length > 0 ? newAmenities : undefined 
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    filters.category || 
    filters.district?.length || 
    filters.priceRange?.length || 
    filters.amenities?.length ||
    filters.search
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.district?.length) count += filters.district.length;
    if (filters.priceRange?.length) count += filters.priceRange.length;
    if (filters.amenities?.length) count += filters.amenities.length;
    return count;
  };

  const priceRanges = ['€', '€€', '€€€', '€€€€'];
  const popularAmenities = ['terrasse', 'parking', 'wifi', 'accessible', 'vue', 'traditionnel'];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher un lieu, une spécialité..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-gray-700">Catégories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={filters.category === category.id ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres avancés
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {resultsCount} résultat{resultsCount > 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Districts */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-700">Arrondissements</h3>
            <div className="grid grid-cols-3 gap-2">
              {lyonDistricts.map((district) => (
                <Badge
                  key={district.id}
                  variant={filters.district?.includes(district.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10 justify-center"
                  onClick={() => handleDistrictChange(district.id)}
                >
                  {district.id}e
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-700">Gamme de prix</h3>
            <div className="flex gap-2">
              {priceRanges.map((range) => (
                <Badge
                  key={range}
                  variant={filters.priceRange?.includes(range) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handlePriceRangeChange(range)}
                >
                  {range}
                </Badge>
              ))}
            </div>
          </div>

          {/* Popular Amenities */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-700">Équipements populaires</h3>
            <div className="flex flex-wrap gap-2">
              {popularAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={filters.amenities?.includes(amenity) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleAmenityChange(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(c => c.id === filters.category)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCategoryChange(filters.category!)}
              />
            </Badge>
          )}
          {filters.district?.map(district => (
            <Badge key={district} variant="secondary" className="flex items-center gap-1">
              {district}e arrondissement
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDistrictChange(district)}
              />
            </Badge>
          ))}
          {filters.priceRange?.map(range => (
            <Badge key={range} variant="secondary" className="flex items-center gap-1">
              {range}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handlePriceRangeChange(range)}
              />
            </Badge>
          ))}
          {filters.amenities?.map(amenity => (
            <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
              {amenity}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleAmenityChange(amenity)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}