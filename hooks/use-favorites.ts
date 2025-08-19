'use client';

import { useState, useEffect, useCallback } from 'react';

export type FavoriteType = 'place' | 'event' | 'article';

export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
  addedAt: string;
}

const FAVORITES_KEY = 'guideLyon_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarder les favoris dans localStorage
  const saveFavorites = useCallback((newFavorites: FavoriteItem[]) => {
    if (typeof window === 'undefined') {
      setFavorites(newFavorites);
      return;
    }
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, []);

  // Ajouter un favori
  const addFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };
    
    const newFavorites = [...favorites, newFavorite];
    saveFavorites(newFavorites);
    
    return true;
  }, [favorites, saveFavorites]);

  // Retirer un favori
  const removeFavorite = useCallback((id: string, type: FavoriteType) => {
    const newFavorites = favorites.filter(
      fav => !(fav.id === id && fav.type === type)
    );
    saveFavorites(newFavorites);
    
    return true;
  }, [favorites, saveFavorites]);

  // Vérifier si un élément est en favori
  const isFavorite = useCallback((id: string, type: FavoriteType) => {
    return favorites.some(fav => fav.id === id && fav.type === type);
  }, [favorites]);

  // Basculer l'état favori
  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(item.id, item.type)) {
      return removeFavorite(item.id, item.type);
    } else {
      return addFavorite(item);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  // Obtenir les favoris par type
  const getFavoritesByType = useCallback((type: FavoriteType) => {
    return favorites.filter(fav => fav.type === type);
  }, [favorites]);

  // Effacer tous les favoris
  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  // Obtenir le nombre de favoris
  const getFavoritesCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  // Exporter les favoris
  const exportFavorites = useCallback(() => {
    if (typeof window === 'undefined') return;
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `favoris_guide_lyon_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [favorites]);

  // Importer les favoris
  const importFavorites = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const imported = JSON.parse(content);
          
          // Valider la structure
          if (Array.isArray(imported)) {
            const merged = [...favorites];
            
            imported.forEach((item: FavoriteItem) => {
              if (!favorites.some(fav => fav.id === item.id && fav.type === item.type)) {
                merged.push(item);
              }
            });
            
            saveFavorites(merged);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Erreur lors de l\'import:', error);
          resolve(false);
        }
      };
      
      reader.readAsText(file);
    });
  }, [favorites, saveFavorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
    getFavoritesCount,
    exportFavorites,
    importFavorites,
  };
}