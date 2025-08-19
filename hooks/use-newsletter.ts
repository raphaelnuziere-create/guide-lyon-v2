'use client';

import { useState, useCallback } from 'react';
import type { NewsletterSubscriber } from '@/types/newsletter';

const NEWSLETTER_KEY = 'guideLyon_newsletter';

export function useNewsletter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Vérifier si l'email est déjà inscrit
  const checkSubscription = useCallback((email: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(NEWSLETTER_KEY);
      if (stored) {
        const subscribers = JSON.parse(stored) as NewsletterSubscriber[];
        return subscribers.some(sub => sub.email === email && sub.status === 'active');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
    }
    return false;
  }, []);

  // S'abonner à la newsletter
  const subscribe = useCallback(async (data: {
    email: string;
    firstName?: string;
    lastName?: string;
    preferences?: {
      actualites?: boolean;
      evenements?: boolean;
      bonnesAdresses?: boolean;
      offresSpeciales?: boolean;
    };
    frequency?: 'daily' | 'weekly' | 'monthly';
  }): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Email invalide');
      }

      // Vérifier si déjà inscrit
      if (checkSubscription(data.email)) {
        throw new Error('Cet email est déjà inscrit à la newsletter');
      }

      // Créer le nouvel abonné
      const newSubscriber: NewsletterSubscriber = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        preferences: {
          actualites: data.preferences?.actualites ?? true,
          evenements: data.preferences?.evenements ?? true,
          bonnesAdresses: data.preferences?.bonnesAdresses ?? true,
          offresSpeciales: data.preferences?.offresSpeciales ?? true,
        },
        frequency: data.frequency || 'weekly',
        status: 'active',
        subscribedAt: new Date().toISOString(),
        source: window.location.pathname,
        userAgent: navigator.userAgent,
      };

      // Sauvegarder dans localStorage (en production, appeler une API)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(NEWSLETTER_KEY);
        const subscribers = stored ? JSON.parse(stored) : [];
        subscribers.push(newSubscriber);
        localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers));
      }

      // Simuler l'envoi d'un email de bienvenue
      console.log('Email de bienvenue envoyé à:', data.email);

      setIsSubscribed(true);
      return {
        success: true,
        message: 'Inscription réussie ! Vérifiez votre email pour confirmer.',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkSubscription]);

  // Se désabonner
  const unsubscribe = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(NEWSLETTER_KEY);
        if (stored) {
          const subscribers = JSON.parse(stored) as NewsletterSubscriber[];
          const index = subscribers.findIndex(sub => sub.email === email);
          
          if (index !== -1) {
            subscribers[index].status = 'unsubscribed';
            subscribers[index].unsubscribedAt = new Date().toISOString();
            localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers));
            
            setIsSubscribed(false);
            return {
              success: true,
              message: 'Vous avez été désinscrit de la newsletter.',
            };
          }
        }
      }
      
      throw new Error('Email non trouvé');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la désinscription';
      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour les préférences
  const updatePreferences = useCallback(async (
    email: string,
    preferences: Partial<NewsletterSubscriber['preferences']>
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(NEWSLETTER_KEY);
        if (stored) {
          const subscribers = JSON.parse(stored) as NewsletterSubscriber[];
          const index = subscribers.findIndex(sub => sub.email === email);
          
          if (index !== -1) {
            subscribers[index].preferences = {
              ...subscribers[index].preferences,
              ...preferences,
            };
            localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subscribers));
            
            return {
              success: true,
              message: 'Préférences mises à jour avec succès.',
            };
          }
        }
      }
      
      throw new Error('Email non trouvé');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir les statistiques
  const getStats = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        active: 1250,
        unsubscribed: 0,
        total: 1250,
        rate: 100,
      };
    }
    try {
      const stored = localStorage.getItem(NEWSLETTER_KEY);
      if (stored) {
        const subscribers = JSON.parse(stored) as NewsletterSubscriber[];
        const active = subscribers.filter(sub => sub.status === 'active').length;
        const unsubscribed = subscribers.filter(sub => sub.status === 'unsubscribed').length;
        const total = subscribers.length;
        
        return {
          active,
          unsubscribed,
          total,
          rate: total > 0 ? (active / total) * 100 : 0,
        };
      }
    } catch (error) {
      console.error('Erreur lors du calcul des stats:', error);
    }
    
    return {
      active: 1250,
      unsubscribed: 0,
      total: 1250,
      rate: 100,
    };
  }, []);

  return {
    isLoading,
    error,
    isSubscribed,
    subscribe,
    unsubscribe,
    updatePreferences,
    checkSubscription,
    getStats,
  };
}