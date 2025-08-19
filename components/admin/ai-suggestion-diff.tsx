'use client';

import { useState, useEffect } from 'react';
import { diffWords, diffSentences } from 'diff';
import { 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Eye,
  EyeOff,
  FileText,
  Lightbulb
} from 'lucide-react';
import type { BlogArticleDraft, BlogArticle } from '../../types';

interface AISuggestionDiffProps {
  originalArticle: BlogArticle;
  suggestedDraft: BlogArticleDraft;
  onAccept: (draftId: string) => void;
  onReject: (draftId: string) => void;
  onClose: () => void;
}

export default function AISuggestionDiff({
  originalArticle,
  suggestedDraft,
  onAccept,
  onReject,
  onClose,
}: AISuggestionDiffProps) {
  const [activeSection, setActiveSection] = useState<string>('content');
  const [showChangesOnly, setShowChangesOnly] = useState(true);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set(['content']));

  const toggleField = (field: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  // Helper function to render diff
  const renderDiff = (original: string, suggested: string, type: 'word' | 'sentence' = 'word') => {
    const diff = type === 'word' ? diffWords(original, suggested) : diffSentences(original, suggested);
    
    return (
      <div className="space-y-2">
        <div className="prose prose-sm max-w-none">
          {diff.map((part, index) => {
            if (part.added) {
              return (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-1 rounded"
                  title="Ajouté par l'IA"
                >
                  {part.value}
                </span>
              );
            } else if (part.removed) {
              return (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-1 rounded line-through"
                  title="Supprimé par l'IA"
                >
                  {part.value}
                </span>
              );
            } else {
              return <span key={index}>{part.value}</span>;
            }
          })}
        </div>
      </div>
    );
  };

  // Helper function to check if a field has changes
  const hasChanges = (field: string): boolean => {
    return suggestedDraft.changes.some(change => change.field === field);
  };

  // Get change summary for a field
  const getChangeSummary = (field: string) => {
    return suggestedDraft.changes.filter(change => change.field === field);
  };

  const sections = [
    {
      id: 'title',
      name: 'Titre',
      hasChanges: hasChanges('title'),
      original: originalArticle.title.fr,
      suggested: suggestedDraft.title.fr,
    },
    {
      id: 'excerpt',
      name: 'Résumé',
      hasChanges: hasChanges('excerpt'),
      original: originalArticle.excerpt.fr,
      suggested: suggestedDraft.excerpt.fr,
    },
    {
      id: 'content',
      name: 'Contenu',
      hasChanges: hasChanges('content'),
      original: originalArticle.content.fr,
      suggested: suggestedDraft.content.fr,
    },
    {
      id: 'seo.metaTitle',
      name: 'Meta Titre',
      hasChanges: hasChanges('seo.metaTitle'),
      original: originalArticle.seo.metaTitle.fr,
      suggested: suggestedDraft.seo.metaTitle.fr,
    },
    {
      id: 'seo.metaDescription',
      name: 'Meta Description',
      hasChanges: hasChanges('seo.metaDescription'),
      original: originalArticle.seo.metaDescription.fr,
      suggested: suggestedDraft.seo.metaDescription.fr,
    },
  ];

  const changedSections = sections.filter(section => section.hasChanges);
  const sectionsToShow = showChangesOnly ? changedSections : sections;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Suggestion d'amélioration IA
                </h2>
                <p className="text-purple-100 text-sm">
                  Générée le {new Date(suggestedDraft.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Metadata */}
          {suggestedDraft.aiMetadata && (
            <div className="mt-4 p-4 bg-white bg-opacity-10 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-1">Raisonnement de l'IA</h3>
                  <p className="text-sm text-purple-100">
                    {suggestedDraft.aiMetadata.suggestions.join(' ')}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-purple-200">
                    <span>Modèle: {suggestedDraft.aiMetadata.model}</span>
                    <span>Confiance: {Math.round(suggestedDraft.aiMetadata.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChangesOnly(!showChangesOnly)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showChangesOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {showChangesOnly ? 'Voir tout' : 'Changements uniquement'}
              </button>
              
              <span className="text-sm text-gray-500">
                {changedSections.length} champ(s) modifié(s)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-2">Légende:</span>
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="w-3 h-3 bg-green-100 rounded"></span>
                Ajouté
              </span>
              <span className="inline-flex items-center gap-1 text-xs">
                <span className="w-3 h-3 bg-red-100 rounded"></span>
                Supprimé
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            
            {sectionsToShow.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun changement détecté
                </h3>
                <p className="text-gray-600">
                  L'IA n'a proposé aucune amélioration pour ce contenu.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sectionsToShow.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg">
                    
                    {/* Section header */}
                    <button
                      onClick={() => toggleField(section.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">
                          {section.name}
                        </h3>
                        {section.hasChanges && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Modifié
                          </span>
                        )}
                      </div>
                      
                      {expandedFields.has(section.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {/* Section content */}
                    {expandedFields.has(section.id) && (
                      <div className="border-t border-gray-200 p-4">
                        {section.hasChanges ? (
                          <div className="space-y-4">
                            
                            {/* Change summary */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <h4 className="text-sm font-medium text-blue-900 mb-2">
                                Résumé des modifications:
                              </h4>
                              <ul className="text-sm text-blue-800 space-y-1">
                                {getChangeSummary(section.id).map((change, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>{change.field}: Mise à jour du contenu</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Diff view */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                                <h4 className="text-sm font-medium text-gray-900">
                                  Comparaison (Original → Suggestion)
                                </h4>
                              </div>
                              <div className="p-4">
                                {section.id === 'content' ? (
                                  renderDiff(section.original, section.suggested, 'sentence')
                                ) : (
                                  renderDiff(section.original, section.suggested, 'word')
                                )}
                              </div>
                            </div>

                            {/* Side-by-side view for shorter content */}
                            {section.id !== 'content' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Original
                                  </h4>
                                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm">
                                    {section.original || <em className="text-gray-500">Vide</em>}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Suggestion
                                  </h4>
                                  <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-sm">
                                    {section.suggested || <em className="text-gray-500">Vide</em>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            Aucun changement proposé pour ce champ.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>
                Cette suggestion a été générée automatiquement.
                <br />
                Vérifiez soigneusement avant d'appliquer les modifications.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => onReject(suggestedDraft.id)}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Rejeter
              </button>
              
              <button
                onClick={() => onAccept(suggestedDraft.id)}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Appliquer les suggestions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}