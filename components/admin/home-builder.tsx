'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@guide-de-lyon/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@guide-de-lyon/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { SortableSection } from './sortable-section';
import { SectionEditor } from './section-editor';
import { HomepagePreview } from './homepage-preview';
import { Save, Eye, Settings, Plus, RotateCcw } from 'lucide-react';
import type { HomepageConfig, SectionConfig } from '@guide-de-lyon/lib/schemas/homepage';

interface HomeBuilderProps {
  initialConfig: HomepageConfig;
  onSave: (config: HomepageConfig) => Promise<void>;
  onPreview: (config: HomepageConfig) => void;
}

const availableSectionTypes = [
  { type: 'hero', name: 'Hero Section', icon: '🖼️' },
  { type: 'news', name: 'News Section', icon: '📰' },
  { type: 'thematic_discoveries', name: 'Thematic Discoveries', icon: '🎯' },
  { type: 'featured_directory', name: 'Featured Directory', icon: '⭐' },
  { type: 'events', name: 'Events Section', icon: '📅' },
  { type: 'merchant_cta', name: 'Merchant CTA', icon: '💼' },
  { type: 'newsletter', name: 'Newsletter', icon: '📧' },
  { type: 'partners', name: 'Partners', icon: '🤝' },
  { type: 'interactive_map', name: 'Interactive Map', icon: '🗺️' },
];

export function HomeBuilder({ initialConfig, onSave, onPreview }: HomeBuilderProps) {
  const t = useTranslations();
  const [config, setConfig] = useState<HomepageConfig>(initialConfig);
  const [editingSection, setEditingSection] = useState<SectionConfig | null>(null);
  const [activeTab, setActiveTab] = useState('sections');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setHasChanges(JSON.stringify(config) !== JSON.stringify(initialConfig));
  }, [config, initialConfig]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setConfig(prev => {
        const sections = [...prev.sections];
        const oldIndex = sections.findIndex(section => section.id === active.id);
        const newIndex = sections.findIndex(section => section.id === over?.id);
        
        const reorderedSections = arrayMove(sections, oldIndex, newIndex).map((section, index) => ({
          ...section,
          order: index,
        }));

        return {
          ...prev,
          sections: reorderedSections,
        };
      });
    }
  };

  const addSection = (type: string) => {
    const newSection: SectionConfig = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: config.sections.length,
      displayMode: 'grid',
      dataMode: 'auto',
      maxItems: 6,
    } as SectionConfig;

    setConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));

    setEditingSection(newSection);
  };

  const updateSection = (sectionId: string, updates: Partial<SectionConfig>) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  const removeSection = (sectionId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
  };

  const duplicateSection = (section: SectionConfig) => {
    const duplicatedSection: SectionConfig = {
      ...section,
      id: `${section.type}-${Date.now()}`,
      order: config.sections.length,
    };

    setConfig(prev => ({
      ...prev,
      sections: [...prev.sections, duplicatedSection],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedConfig = {
        ...config,
        lastModified: new Date(),
        version: config.version + 1,
      };
      await onSave(updatedConfig);
      setConfig(updatedConfig);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save homepage config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    onPreview(config);
  };

  const resetToDefault = () => {
    setConfig(initialConfig);
    setEditingSection(null);
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Left Panel - Sections List */}
      <div className="w-80 bg-background border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Home Builder</h2>
            <div className="flex space-x-2">
              {hasChanges && (
                <Badge variant="secondary">Unsaved</Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                disabled={!hasChanges}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="p-4 space-y-4">
            {/* Add New Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableSectionTypes.map((sectionType) => (
                  <Button
                    key={sectionType.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addSection(sectionType.type)}
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{sectionType.icon}</span>
                    {sectionType.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Existing Sections */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Current Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={config.sections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {config.sections
                        .sort((a, b) => a.order - b.order)
                        .map((section) => (
                          <SortableSection
                            key={section.id}
                            section={section}
                            isEditing={editingSection?.id === section.id}
                            onEdit={setEditingSection}
                            onToggle={(enabled) => updateSection(section.id, { enabled })}
                            onDuplicate={() => duplicateSection(section)}
                            onRemove={() => removeSection(section.id)}
                          />
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Global Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Performance Mode</label>
                  <select 
                    className="w-full mt-1 rounded border"
                    value={config.globalSettings?.performanceMode || 'balanced'}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      globalSettings: {
                        ...prev.globalSettings,
                        performanceMode: e.target.value as any,
                      },
                    }))}
                  >
                    <option value="fast">Fast</option>
                    <option value="balanced">Balanced</option>
                    <option value="rich">Rich</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="lazy-loading"
                    checked={config.globalSettings?.lazyLoading ?? true}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      globalSettings: {
                        ...prev.globalSettings,
                        lazyLoading: e.target.checked,
                      },
                    }))}
                  />
                  <label htmlFor="lazy-loading" className="text-sm">
                    Enable Lazy Loading
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="critical-css"
                    checked={config.globalSettings?.criticalCss ?? true}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      globalSettings: {
                        ...prev.globalSettings,
                        criticalCss: e.target.checked,
                      },
                    }))}
                  />
                  <label htmlFor="critical-css" className="text-sm">
                    Inline Critical CSS
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={config.globalSettings?.analytics ?? true}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      globalSettings: {
                        ...prev.globalSettings,
                        analytics: e.target.checked,
                      },
                    }))}
                  />
                  <label htmlFor="analytics" className="text-sm">
                    Enable Analytics
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Center Panel - Section Editor */}
      <div className="flex-1 flex flex-col">
        {editingSection ? (
          <SectionEditor
            section={editingSection}
            onUpdate={(updates) => {
              updateSection(editingSection.id, updates);
              setEditingSection({ ...editingSection, ...updates });
            }}
            onClose={() => setEditingSection(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a section to edit its configuration</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-80 bg-background border-l">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Live Preview</h3>
        </div>
        <div className="h-full overflow-auto">
          <HomepagePreview config={config} />
        </div>
      </div>
    </div>
  );
}

export default HomeBuilder;