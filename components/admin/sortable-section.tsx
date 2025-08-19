'use client';

import { useState } from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@guide-de-lyon/ui';
import { Card, CardContent } from '@guide-de-lyon/ui';
import { Badge } from '@guide-de-lyon/ui';
import { Switch } from '@guide-de-lyon/ui';
import { 
  GripVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@guide-de-lyon/ui';
import type { SectionConfig } from '@guide-de-lyon/lib/schemas/homepage';

interface SortableSectionProps {
  section: SectionConfig;
  isEditing: boolean;
  onEdit: (section: SectionConfig) => void;
  onToggle: (enabled: boolean) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

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

export function SortableSection({
  section,
  isEditing,
  onEdit,
  onToggle,
  onDuplicate,
  onRemove,
}: SortableSectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSectionTitle = () => {
    if (section.title) {
      return section.title.fr || section.title.en || 'Untitled Section';
    }
    return sectionNames[section.type] || section.type;
  };

  const getSectionPreview = () => {
    const details = [];
    
    if (section.displayMode) {
      details.push(`Display: ${section.displayMode}`);
    }
    
    if (section.dataMode) {
      details.push(`Data: ${section.dataMode}`);
    }
    
    if (section.maxItems) {
      details.push(`Items: ${section.maxItems}`);
    }

    return details.join(' • ');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? 'opacity-50' : ''}
        ${isEditing ? 'ring-2 ring-primary' : ''}
      `}
    >
      <Card className={`${!section.enabled ? 'opacity-60' : ''} hover:shadow-md transition-shadow`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            {/* Drag Handle */}
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {/* Section Icon and Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm">{sectionIcons[section.type] || '📄'}</span>
                <span className="font-medium text-sm truncate">
                  {getSectionTitle()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {section.order + 1}
                </Badge>
              </div>
              
              {showDetails && (
                <div className="text-xs text-muted-foreground">
                  {getSectionPreview()}
                </div>
              )}
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={section.enabled}
                onCheckedChange={onToggle}
                size="sm"
              />
              {section.enabled ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(section)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDetails(!showDetails)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onRemove}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}