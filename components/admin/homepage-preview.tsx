'use client';

import { useState } from 'react';
import { Button } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import type { HomepageConfig, SectionConfig } from '@guide-de-lyon/lib/schemas/homepage';

interface HomepagePreviewProps {
  config: HomepageConfig;
}

const previewModes = [
  { id: 'desktop', icon: Monitor, label: 'Desktop' },
  { id: 'tablet', icon: Tablet, label: 'Tablet' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
];

const sectionIcons: Record<string, string> = {
  hero: '🖼️',
  news: '📰',
  thematic_discoveries: '🎯',
  featured_directory: '⭐',
  events: '📅',
  merchant_cta: '💼',
  newsletter: '📧',
  partners: '🤝',
  interactive_map: '🗺️',
};

const sectionNames: Record<string, string> = {
  hero: 'Hero Section',
  news: 'News Section',
  thematic_discoveries: 'Thematic Discoveries',
  featured_directory: 'Featured Directory',
  events: 'Events Section',
  merchant_cta: 'Merchant CTA',
  newsletter: 'Newsletter',
  partners: 'Partners',
  interactive_map: 'Interactive Map',
};

export function HomepagePreview({ config }: HomepagePreviewProps) {
  const [previewMode, setPreviewMode] = useState('desktop');

  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'w-80';
      case 'tablet':
        return 'w-96';
      default:
        return 'w-full';
    }
  };

  const getSectionTitle = (section: SectionConfig) => {
    if (section.title) {
      return section.title.fr || section.title.en || 'Untitled Section';
    }
    return sectionNames[section.type] || section.type;
  };

  const renderSectionPreview = (section: SectionConfig) => {
    const getSectionHeight = () => {
      switch (section.type) {
        case 'hero':
          return 'h-32';
        case 'newsletter':
          return 'h-16';
        case 'partners':
          return 'h-12';
        default:
          return 'h-24';
      }
    };

    const getSectionColor = () => {
      if (!section.enabled) return 'bg-muted/50 border-dashed';
      
      switch (section.type) {
        case 'hero':
          return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20';
        case 'news':
          return 'bg-gradient-to-r from-green-500/20 to-blue-500/20';
        case 'thematic_discoveries':
          return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20';
        case 'featured_directory':
          return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20';
        case 'events':
          return 'bg-gradient-to-r from-red-500/20 to-orange-500/20';
        case 'merchant_cta':
          return 'bg-gradient-to-r from-indigo-500/20 to-blue-500/20';
        case 'newsletter':
          return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20';
        case 'partners':
          return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20';
        case 'interactive_map':
          return 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20';
        default:
          return 'bg-muted';
      }
    };

    return (
      <div
        key={section.id}
        className={`
          relative border-2 rounded-lg p-3 mb-3 transition-all
          ${getSectionHeight()}
          ${getSectionColor()}
          ${!section.enabled ? 'opacity-60' : ''}
        `}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs">{sectionIcons[section.type] || '📄'}</span>
            <span className="text-xs font-medium truncate">
              {getSectionTitle(section)}
            </span>
            <Badge variant="outline" className="text-xs h-4">
              {section.order + 1}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            {!section.enabled && (
              <Badge variant="secondary" className="text-xs h-4">
                Hidden
              </Badge>
            )}
            <Badge variant="outline" className="text-xs h-4">
              {section.displayMode}
            </Badge>
          </div>
        </div>

        {/* Section Content Preview */}
        <div className="space-y-1">
          {section.title && (
            <div className="h-2 bg-foreground/60 rounded w-1/3"></div>
          )}
          {section.subtitle && (
            <div className="h-1 bg-foreground/40 rounded w-1/2"></div>
          )}
          
          {/* Content blocks based on display mode */}
          <div className="mt-2">
            {section.displayMode === 'grid' && (
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: Math.min(section.maxItems || 6, 6) }).map((_, i) => (
                  <div key={i} className="h-3 bg-foreground/30 rounded"></div>
                ))}
              </div>
            )}
            
            {section.displayMode === 'slider' && (
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(section.maxItems || 3, 3) }).map((_, i) => (
                  <div key={i} className="h-4 bg-foreground/30 rounded flex-1"></div>
                ))}
              </div>
            )}
            
            {section.displayMode === 'list' && (
              <div className="space-y-1">
                {Array.from({ length: Math.min(section.maxItems || 4, 4) }).map((_, i) => (
                  <div key={i} className="h-2 bg-foreground/30 rounded"></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Stats */}
        <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
          {section.maxItems} items
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Preview</span>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
        
        <div className="flex space-x-1">
          {previewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant={previewMode === mode.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode(mode.id)}
                className="flex-1"
              >
                <Icon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{mode.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-3">
        <div className={`mx-auto transition-all ${getPreviewWidth()}`}>
          {/* Homepage Info */}
          <div className="bg-card border rounded-lg p-3 mb-4 text-center">
            <h3 className="font-semibold text-sm mb-1">
              {config.seo?.title?.fr || 'Homepage'}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              {config.seo?.description?.fr || 'Homepage description'}
            </p>
            <div className="flex justify-center space-x-2 text-xs">
              <Badge variant="outline">
                {config.sections.filter(s => s.enabled).length} sections
              </Badge>
              <Badge variant={config.published ? 'default' : 'secondary'}>
                {config.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
          </div>

          {/* Sections Preview */}
          <div className="space-y-1">
            {sortedSections.length > 0 ? (
              sortedSections.map(renderSectionPreview)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm">No sections added yet</p>
                <p className="text-xs">Add sections to see the preview</p>
              </div>
            )}
          </div>

          {/* Performance Indicators */}
          <div className="mt-4 p-3 bg-card border rounded-lg">
            <h4 className="font-medium text-xs mb-2">Performance</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="h-2 bg-green-500 rounded mb-1"></div>
                <div>LCP</div>
              </div>
              <div className="text-center">
                <div className="h-2 bg-yellow-500 rounded mb-1"></div>
                <div>FID</div>
              </div>
              <div className="text-center">
                <div className="h-2 bg-green-500 rounded mb-1"></div>
                <div>CLS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}