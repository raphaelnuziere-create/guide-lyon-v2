'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, X, Calendar, Filter } from 'lucide-react';
import type { BlogFiltersProps } from '../../types';

export default function BlogFilters({
  categories,
  tags,
  selectedCategoryId,
  selectedTagIds,
  dateRange,
  onCategoryChange,
  onTagsChange,
  onDateRangeChange,
  onReset,
}: BlogFiltersProps) {
  const t = useTranslations('blog.filters');
  
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: true,
    dates: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTagToggle = (tagId: string) => {
    const newTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    onTagsChange(newTagIds);
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = e.target.value ? new Date(e.target.value) : undefined;
    const toDate = dateRange?.[1];
    
    if (fromDate && toDate) {
      onDateRangeChange([fromDate, toDate]);
    } else if (fromDate) {
      onDateRangeChange([fromDate, new Date()]);
    } else {
      onDateRangeChange(undefined);
    }
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toDate = e.target.value ? new Date(e.target.value) : undefined;
    const fromDate = dateRange?.[0];
    
    if (fromDate && toDate) {
      onDateRangeChange([fromDate, toDate]);
    } else if (toDate) {
      onDateRangeChange([new Date('2020-01-01'), toDate]);
    } else {
      onDateRangeChange(undefined);
    }
  };

  const hasActiveFilters = selectedCategoryId || selectedTagIds.length > 0 || dateRange;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          {t('title')}
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            {t('reset')}
          </button>
        )}
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="space-y-2">
          {selectedCategoryId && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">{t('activeCategory')}:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                {categories.find(c => c.id === selectedCategoryId)?.name.fr}
                <button
                  onClick={() => onCategoryChange(undefined)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
          
          {selectedTagIds.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm text-gray-600">{t('activeTags')}:</span>
              <div className="flex flex-wrap gap-1">
                {selectedTagIds.map(tagId => {
                  const tag = tags.find(t => t.id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      {tag.name.fr}
                      <button
                        onClick={() => handleTagToggle(tagId)}
                        className="hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
          
          {dateRange && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">{t('activeDateRange')}:</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                {dateRange[0].toLocaleDateString()} - {dateRange[1].toLocaleDateString()}
                <button
                  onClick={() => onDateRangeChange(undefined)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Categories Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700"
        >
          {t('categories.title')}
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.categories && (
          <div className="mt-3 space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={!selectedCategoryId}
                onChange={() => onCategoryChange(undefined)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t('categories.all')}</span>
            </label>
            
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategoryId === category.id}
                  onChange={() => onCategoryChange(category.id)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color || '#3B82F6' }}
                />
                <span className="text-sm text-gray-700">
                  {category.name.fr}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tags Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('tags')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700"
        >
          {t('tags.title')}
          {expandedSections.tags ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.tags && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="mr-2 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  {tag.name.fr}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Date Range Filter */}
      <div>
        <button
          onClick={() => toggleSection('dates')}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t('dateRange.title')}
          </div>
          {expandedSections.dates ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {expandedSections.dates && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t('dateRange.from')}
              </label>
              <input
                type="date"
                value={dateRange?.[0]?.toISOString().split('T')[0] || ''}
                onChange={handleDateFromChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t('dateRange.to')}
              </label>
              <input
                type="date"
                value={dateRange?.[1]?.toISOString().split('T')[0] || ''}
                onChange={handleDateToChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Quick date range buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const now = new Date();
                  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  onDateRangeChange([lastWeek, now]);
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {t('dateRange.lastWeek')}
              </button>
              
              <button
                onClick={() => {
                  const now = new Date();
                  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                  onDateRangeChange([lastMonth, now]);
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {t('dateRange.lastMonth')}
              </button>
              
              <button
                onClick={() => {
                  const now = new Date();
                  const lastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                  onDateRangeChange([lastYear, now]);
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {t('dateRange.lastYear')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}