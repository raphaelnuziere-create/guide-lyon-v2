'use client';

import { Heart } from 'lucide-react';
import { Button } from '@guide-de-lyon/ui';
import { useFavorites, type FavoriteItem } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'addedAt'>;
  variant?: 'icon' | 'button' | 'text';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function FavoriteButton({
  item,
  variant = 'icon',
  className,
  size = 'md',
  showCount = false,
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite, getFavoritesCount } = useFavorites();
  const [isFav, setIsFav] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setIsFav(isFavorite(item.id, item.type));
    if (showCount) {
      setCount(getFavoritesCount());
    }
  }, [item.id, item.type, isFavorite, showCount, getFavoritesCount]);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleFavorite(item);
    setIsFav(!isFav);
    
    if (showCount) {
      setCount(prev => isFav ? prev - 1 : prev + 1);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          'p-2 rounded-full transition-all hover:bg-gray-100',
          isFav && 'bg-red-50 hover:bg-red-100',
          isAnimating && 'scale-125',
          className
        )}
        aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Heart
          className={cn(
            iconSize,
            'transition-all',
            isFav ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'
          )}
        />
        {showCount && count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant={isFav ? 'default' : 'outline'}
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={handleToggle}
        className={cn(
          'transition-all',
          isFav && 'bg-red-500 hover:bg-red-600 border-red-500',
          isAnimating && 'scale-105',
          className
        )}
      >
        <Heart
          className={cn(
            iconSize,
            'mr-2',
            isFav && 'fill-white'
          )}
        />
        {isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        {showCount && count > 0 && (
          <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-sm">
            {count}
          </span>
        )}
      </Button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'inline-flex items-center gap-1 text-sm transition-colors',
        isFav ? 'text-red-500' : 'text-gray-500 hover:text-red-500',
        isAnimating && 'scale-105',
        className
      )}
    >
      <Heart
        className={cn(
          iconSize,
          isFav && 'fill-current'
        )}
      />
      <span>{isFav ? 'Favori' : 'Ajouter'}</span>
      {showCount && count > 0 && (
        <span className="ml-1">({count})</span>
      )}
    </button>
  );
}