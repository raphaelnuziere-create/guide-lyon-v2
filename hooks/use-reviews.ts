'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Review, ReviewStats, Comment } from '@/types/review';

const REVIEWS_KEY = 'guideLyon_reviews';
const COMMENTS_KEY = 'guideLyon_comments';

export function useReviews() {
  const [isLoading, setIsLoading] = useState(false);

  // Obtenir les avis pour une cible
  const getReviews = useCallback((targetId: string, targetType: 'place' | 'event' | 'article'): Review[] => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) {
        const reviews = JSON.parse(stored) as Review[];
        return reviews
          .filter(r => r.targetId === targetId && r.targetType === targetType && r.status === 'approved')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    }
    return [];
  }, []);

  // Calculer les statistiques
  const getReviewStats = useCallback((targetId: string, targetType: 'place' | 'event' | 'article'): ReviewStats => {
    const reviews = getReviews(targetId, targetType);
    
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach(review => {
      sum += review.rating;
      distribution[review.rating as keyof typeof distribution]++;
    });

    return {
      average: sum / reviews.length,
      total: reviews.length,
      distribution,
    };
  }, [getReviews]);

  // Ajouter un avis
  const addReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'notHelpful' | 'status'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        helpful: 0,
        notHelpful: 0,
        status: 'approved', // En production, serait 'pending'
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const stored = localStorage.getItem(REVIEWS_KEY);
      const reviews = stored ? JSON.parse(stored) : [];
      
      // Vérifier si l'utilisateur a déjà laissé un avis
      const existingReview = reviews.find((r: Review) => 
        r.userId === review.userId && 
        r.targetId === review.targetId && 
        r.targetType === review.targetType
      );

      if (existingReview) {
        throw new Error('Vous avez déjà laissé un avis');
      }

      reviews.push(newReview);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
      
      // Ajouter des points de gamification
      addGamificationPoints(review.userId, 'review', 10);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Marquer un avis comme utile
  const markHelpful = useCallback((reviewId: string, helpful: boolean) => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) {
        const reviews = JSON.parse(stored) as Review[];
        const review = reviews.find(r => r.id === reviewId);
        
        if (review) {
          if (helpful) {
            review.helpful++;
          } else {
            review.notHelpful++;
          }
          
          localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
        }
      }
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  }, []);

  // Obtenir les commentaires
  const getComments = useCallback((targetId: string, targetType: string): Comment[] => {
    try {
      const stored = localStorage.getItem(COMMENTS_KEY);
      if (stored) {
        const comments = JSON.parse(stored) as Comment[];
        return comments
          .filter(c => c.targetId === targetId && c.targetType === targetType && c.status === 'visible')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
    return [];
  }, []);

  // Ajouter un commentaire
  const addComment = useCallback(async (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'status'>): Promise<boolean> => {
    try {
      const newComment: Comment = {
        ...comment,
        id: Date.now().toString(),
        likes: 0,
        status: 'visible',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const stored = localStorage.getItem(COMMENTS_KEY);
      const comments = stored ? JSON.parse(stored) : [];
      comments.push(newComment);
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
      
      // Ajouter des points de gamification
      addGamificationPoints(comment.userId, 'comment', 5);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      return false;
    }
  }, []);

  // Liker un commentaire
  const likeComment = useCallback((commentId: string) => {
    try {
      const stored = localStorage.getItem(COMMENTS_KEY);
      if (stored) {
        const comments = JSON.parse(stored) as Comment[];
        const comment = comments.find(c => c.id === commentId);
        
        if (comment) {
          comment.likes++;
          localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
        }
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  }, []);

  return {
    isLoading,
    getReviews,
    getReviewStats,
    addReview,
    markHelpful,
    getComments,
    addComment,
    likeComment,
  };
}

// Fonction helper pour la gamification
function addGamificationPoints(userId: string, action: string, points: number) {
  const key = 'guideLyon_gamification';
  try {
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) : {};
    
    if (!data[userId]) {
      data[userId] = {
        points: 0,
        level: 'explorer',
        badges: [],
        actions: [],
      };
    }
    
    data[userId].points += points;
    data[userId].actions.push({
      type: action,
      points,
      date: new Date().toISOString(),
    });
    
    // Mise à jour du niveau
    if (data[userId].points >= 500) {
      data[userId].level = 'ambassador';
    } else if (data[userId].points >= 200) {
      data[userId].level = 'expert';
    }
    
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur gamification:', error);
  }
}