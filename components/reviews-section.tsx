'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, CheckCircle, Filter, ChevronDown } from 'lucide-react';
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@guide-de-lyon/ui';
import { useReviews } from '@/hooks/use-reviews';
import ReviewForm from './review-form';
import type { Review, ReviewStats } from '@/types/review';
import { cn } from '@/lib/utils';

interface ReviewsSectionProps {
  targetId: string;
  targetType: 'place' | 'event' | 'article';
  targetName: string;
}

export default function ReviewsSection({ targetId, targetType, targetName }: ReviewsSectionProps) {
  const { getReviews, getReviewStats, markHelpful } = useReviews();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReviews();
  }, [targetId, targetType, sortBy, filterRating]);

  const loadReviews = () => {
    let reviewsList = getReviews(targetId, targetType);
    const reviewStats = getReviewStats(targetId, targetType);
    
    // Filtrer par note
    if (filterRating !== 'all') {
      reviewsList = reviewsList.filter(r => r.rating === parseInt(filterRating));
    }
    
    // Trier
    switch (sortBy) {
      case 'helpful':
        reviewsList.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'rating':
        reviewsList.sort((a, b) => b.rating - a.rating);
        break;
      default:
        reviewsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    setReviews(reviewsList);
    setStats(reviewStats);
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    loadReviews();
  };

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getRatingPercentage = (rating: number) => {
    if (!stats || stats.total === 0) return 0;
    return (stats.distribution[rating as keyof typeof stats.distribution] / stats.total) * 100;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Note moyenne */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div>
                  <div className="text-4xl font-bold">{stats?.average.toFixed(1) || '0'}</div>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-5 w-5',
                          stats && star <= Math.round(stats.average)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold">
                    {stats?.total || 0} avis
                  </p>
                  <p className="text-sm text-gray-600">
                    {stats && stats.average >= 4 ? 'Excellent' :
                     stats && stats.average >= 3 ? 'Très bien' :
                     stats && stats.average >= 2 ? 'Correct' : 'À améliorer'}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="w-full md:w-auto"
              >
                Écrire un avis
              </Button>
            </div>

            {/* Distribution des notes */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-10 text-right">
                    {stats?.distribution[rating as keyof typeof stats.distribution] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et tri */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="helpful">Plus utiles</SelectItem>
              <SelectItem value="rating">Meilleures notes</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="5">5 étoiles</SelectItem>
              <SelectItem value="4">4 étoiles</SelectItem>
              <SelectItem value="3">3 étoiles</SelectItem>
              <SelectItem value="2">2 étoiles</SelectItem>
              <SelectItem value="1">1 étoile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <p className="text-sm text-gray-600">
          {reviews.length} avis affichés
        </p>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const needsExpansion = review.content.length > 200;
          
          return (
            <Card key={review.id}>
              <CardContent className="p-4">
                {/* En-tête de l'avis */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {review.userName[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  'h-4 w-4',
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {formatDate(review.createdAt)}
                          </span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Titre et contenu */}
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className={cn(
                  "text-gray-700 mb-3",
                  !isExpanded && needsExpansion && "line-clamp-3"
                )}>
                  {review.content}
                </p>
                
                {needsExpansion && (
                  <button
                    onClick={() => toggleExpanded(review.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                )}

                {/* Points positifs/négatifs */}
                {(review.pros || review.cons) && isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {review.pros && review.pros.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-1">Points positifs</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons && review.cons.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-1">Points à améliorer</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Réponse du propriétaire */}
                {review.response && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-semibold mb-1">Réponse du propriétaire</p>
                    <p className="text-sm text-gray-700">{review.response.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(review.response.date)}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <button
                    onClick={() => markHelpful(review.id, true)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Utile ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <MessageCircle className="h-4 w-4" />
                    Commenter
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun avis pour le moment</p>
            <Button onClick={() => setShowReviewForm(true)}>
              Soyez le premier à donner votre avis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulaire d'avis */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Donner votre avis sur {targetName}</DialogTitle>
          </DialogHeader>
          <ReviewForm
            targetId={targetId}
            targetType={targetType}
            targetName={targetName}
            onSuccess={handleReviewSubmit}
            onCancel={() => setShowReviewForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}