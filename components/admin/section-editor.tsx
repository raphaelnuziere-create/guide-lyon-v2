'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@guide-de-lyon/ui';
import { Input } from '@guide-de-lyon/ui';
import { Label } from '@guide-de-lyon/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@guide-de-lyon/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@guide-de-lyon/ui';
import { Switch } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { X, Save, Eye } from 'lucide-react';
import type { SectionConfig, I18nField } from '@guide-de-lyon/lib/schemas/homepage';

interface SectionEditorProps {
  section: SectionConfig;
  onUpdate: (updates: Partial<SectionConfig>) => void;
  onClose: () => void;
}

const displayModes = [
  { value: 'grid', label: 'Grid' },
  { value: 'slider', label: 'Slider' },
  { value: 'list', label: 'List' },
  { value: 'masonry', label: 'Masonry' },
];

const dataModes = [
  { value: 'auto', label: 'Auto (Query)' },
  { value: 'curated', label: 'Curated (Manual)' },
];

export function SectionEditor({ section, onUpdate, onClose }: SectionEditorProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('general');

  const updateI18nField = (field: keyof SectionConfig, locale: string, value: string) => {
    const currentField = section[field] as I18nField | undefined;
    const updatedField: I18nField = {
      fr: currentField?.fr || '',
      en: currentField?.en || '',
      it: currentField?.it || '',
      es: currentField?.es || '',
      [locale]: value,
    };
    onUpdate({ [field]: updatedField });
  };

  const renderI18nInputs = (field: keyof SectionConfig, label: string, placeholder?: string) => {
    const currentField = section[field] as I18nField | undefined;
    const languages = [
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' },
      { code: 'it', name: 'Italiano' },
      { code: 'es', name: 'Español' },
    ];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {languages.map(lang => (
          <div key={lang.code} className="flex items-center space-x-2">
            <Badge variant="outline" className="w-12 text-xs">
              {lang.code.toUpperCase()}
            </Badge>
            <Input
              placeholder={placeholder ? `${placeholder} (${lang.name})` : lang.name}
              value={currentField?.[lang.code as keyof I18nField] || ''}
              onChange={(e) => updateI18nField(field, lang.code, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          checked={section.enabled}
          onCheckedChange={(enabled) => onUpdate({ enabled })}
        />
        <Label>Section Enabled</Label>
      </div>

      {renderI18nInputs('title', 'Section Title', 'Enter section title')}
      {renderI18nInputs('subtitle', 'Section Subtitle', 'Enter section subtitle')}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Display Mode</Label>
          <select
            className="w-full mt-1 rounded border p-2"
            value={section.displayMode}
            onChange={(e) => onUpdate({ displayMode: e.target.value as any })}
          >
            {displayModes.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Data Mode</Label>
          <select
            className="w-full mt-1 rounded border p-2"
            value={section.dataMode}
            onChange={(e) => onUpdate({ dataMode: e.target.value as any })}
          >
            {dataModes.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label>Maximum Items</Label>
        <Input
          type="number"
          min="1"
          max="50"
          value={section.maxItems}
          onChange={(e) => onUpdate({ maxItems: parseInt(e.target.value) || 6 })}
        />
      </div>
    </div>
  );

  const renderSpecificSettings = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={(section as any).autoPlay ?? true}
                onCheckedChange={(autoPlay) => onUpdate({ autoPlay })}
              />
              <Label>Auto Play</Label>
            </div>

            <div>
              <Label>Auto Play Delay (ms)</Label>
              <Input
                type="number"
                min="1000"
                max="10000"
                step="1000"
                value={(section as any).autoPlayDelay || 5000}
                onChange={(e) => onUpdate({ autoPlayDelay: parseInt(e.target.value) || 5000 })}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showDots ?? true}
                  onCheckedChange={(showDots) => onUpdate({ showDots })}
                />
                <Label>Show Dots</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showArrows ?? true}
                  onCheckedChange={(showArrows) => onUpdate({ showArrows })}
                />
                <Label>Show Arrows</Label>
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showExcerpt ?? true}
                  onCheckedChange={(showExcerpt) => onUpdate({ showExcerpt })}
                />
                <Label>Show Excerpt</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showAuthor ?? true}
                  onCheckedChange={(showAuthor) => onUpdate({ showAuthor })}
                />
                <Label>Show Author</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showDate ?? true}
                  onCheckedChange={(showDate) => onUpdate({ showDate })}
                />
                <Label>Show Date</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showCategory ?? true}
                  onCheckedChange={(showCategory) => onUpdate({ showCategory })}
                />
                <Label>Show Category</Label>
              </div>
            </div>
          </div>
        );

      case 'featured_directory':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showRating ?? true}
                  onCheckedChange={(showRating) => onUpdate({ showRating })}
                />
                <Label>Show Rating</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showCategory ?? true}
                  onCheckedChange={(showCategory) => onUpdate({ showCategory })}
                />
                <Label>Show Category</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showDistance ?? false}
                  onCheckedChange={(showDistance) => onUpdate({ showDistance })}
                />
                <Label>Show Distance</Label>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showCalendar ?? true}
                  onCheckedChange={(showCalendar) => onUpdate({ showCalendar })}
                />
                <Label>Show Calendar</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showDate ?? true}
                  onCheckedChange={(showDate) => onUpdate({ showDate })}
                />
                <Label>Show Date</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showLocation ?? true}
                  onCheckedChange={(showLocation) => onUpdate({ showLocation })}
                />
                <Label>Show Location</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showPrice ?? true}
                  onCheckedChange={(showPrice) => onUpdate({ showPrice })}
                />
                <Label>Show Price</Label>
              </div>
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div className="space-y-4">
            <div>
              <Label>Design</Label>
              <select
                className="w-full mt-1 rounded border p-2"
                value={(section as any).design || 'strip'}
                onChange={(e) => onUpdate({ design: e.target.value })}
              >
                <option value="strip">Strip</option>
                <option value="card">Card</option>
                <option value="fullwidth">Fullwidth</option>
              </select>
            </div>

            <div>
              <Label>Background Color</Label>
              <select
                className="w-full mt-1 rounded border p-2"
                value={(section as any).backgroundColor || 'primary'}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              >
                <option value="primary">Primary</option>
                <option value="muted">Muted</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={(section as any).showBenefits ?? true}
                onCheckedChange={(showBenefits) => onUpdate({ showBenefits })}
              />
              <Label>Show Benefits</Label>
            </div>
          </div>
        );

      case 'partners':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={(section as any).showAsCarousel ?? true}
                onCheckedChange={(showAsCarousel) => onUpdate({ showAsCarousel })}
              />
              <Label>Show as Carousel</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={(section as any).grayscale ?? true}
                onCheckedChange={(grayscale) => onUpdate({ grayscale })}
              />
              <Label>Grayscale Effect</Label>
            </div>
          </div>
        );

      case 'interactive_map':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Map Height (px)</Label>
                <Input
                  type="number"
                  min="200"
                  max="800"
                  value={(section as any).height || 400}
                  onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 400 })}
                />
              </div>

              <div>
                <Label>Default Zoom</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={(section as any).defaultZoom || 13}
                  onChange={(e) => onUpdate({ defaultZoom: parseInt(e.target.value) || 13 })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showFilters ?? true}
                  onCheckedChange={(showFilters) => onUpdate({ showFilters })}
                />
                <Label>Show Filters</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={(section as any).showSearch ?? true}
                  onCheckedChange={(showSearch) => onUpdate({ showSearch })}
                />
                <Label>Show Search</Label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-muted-foreground py-8">
            No specific settings available for this section type.
          </div>
        );
    }
  };

  const sectionTypeNames: Record<string, string> = {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            {sectionTypeNames[section.type] || section.type}
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure section settings and content
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="specific">Specific</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {renderGeneralSettings()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specific" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Section-Specific Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSpecificSettings()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex space-x-2">
        <Button variant="outline" className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button className="flex-1" onClick={onClose}>
          <Save className="h-4 w-4 mr-2" />
          Done
        </Button>
      </div>
    </div>
  );
}