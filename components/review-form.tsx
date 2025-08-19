'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Camera, X, Loader2 } from 'lucide-react';
import { Button, Input, Textarea, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@guide-de-lyon/ui';
import { useReviews } from '@/hooks/use-reviews';
import type { Review } from '@/types/review';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  targetId: string;
  targetType: 'place' | 'event' | 'article';
  targetName: string;
  userId?: string;
  userName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  targetId,
  targetType,
  targetName,
  userId = 'user-' + Date.now(),
  userName = 'Utilisateur anonyme',
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { addReview, isLoading } = useReviews();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    if (!title.trim()) {
      setError('Veuillez ajouter un titre');
      return;
    }

    if (!content.trim()) {
      setError('Veuillez écrire votre avis');
      return;
    }

    const review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'notHelpful' | 'status'> = {
      userId,
      userName,
      targetId,
      targetType,
      rating,
      title: title.trim(),
      content: content.trim(),
      pros: pros ? pros.split(',').map(p => p.trim()).filter(Boolean) : undefined,
      cons: cons ? cons.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      visitDate: visitDate || undefined,
      verified: false,
    };

    const success = await addReview(review);
    
    if (success) {
      onSuccess?.();
    } else {
      setError('Une erreur est survenue. Vous avez peut-être déjà laissé un avis.');
    }
  };

  const getRatingLabel = (value: number) => {
    switch (value) {
      case 1: return 'Décevant';
      case 2: return 'Moyen';
      case 3: return 'Bien';
      case 4: return 'Très bien';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Note */}
      <div>
        <Label className="block mb-2">Votre note *</Label>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'h-8 w-8 transition-colors',
                    (hoveredRating || rating) >= value
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              </button>
            ))}
          </div>
          <span className="text-sm font-medium">
            {getRatingLabel(hoveredRating || rating)}
          </span>
        </div>
      </div>

      {/* Titre */}
      <div>
        <Label htmlFor="title">Titre de votre avis *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Résumez votre expérience"
          maxLength={100}
          required
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
      </div>

      {/* Avis détaillé */}
      <div>
        <Label htmlFor="content">Votre avis détaillé *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez votre expérience avec d'autres visiteurs..."
          rows={5}
          maxLength={1000}
          required
        />
        <p className="text-xs text-gray-500 mt-1">{content.length}/1000</p>
      </div>

      {/* Points positifs et négatifs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pros" className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-green-600" />
            Points positifs
          </Label>
          <Input
            id="pros"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="Service, qualité, ambiance..."
          />
          <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
        </div>
        
        <div>
          <Label htmlFor="cons" className="flex items-center gap-2">
            <ThumbsDown className="h-4 w-4 text-red-600" />
            Points à améliorer
          </Label>
          <Input
            id="cons"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="Prix, attente, bruit..."
          />
          <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
        </div>
      </div>

      {/* Date de visite */}
      <div>
        <Label htmlFor="visitDate">Date de votre visite</Label>
        <Input
          id="visitDate"
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Publication...
            </>
          ) : (
            'Publier mon avis'
          )}
        </Button>
      </div>

      {/* Informations */}
      <p className="text-xs text-gray-500 text-center">
        En publiant cet avis, vous acceptez nos conditions d'utilisation.
        Les avis sont modérés avant publication.
      </p>
    </form>
  );
}