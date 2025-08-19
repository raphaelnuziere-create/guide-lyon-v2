'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Place } from '@/types';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Star, 
  ChevronRight,
  Share2,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateQRCode } from '@/lib/utils/qr';
import { formatOpeningHours, isOpenNow } from '@/lib/utils/hours';

interface DirectoryListProps {
  places: Place[];
  view: 'list' | 'grid';
  favorites: string[];
  onToggleFavorite: (placeId: string) => void;
  isLoading?: boolean;
  locale: string;
  dict: any;
}

export function DirectoryList({
  places,
  view,
  favorites,
  onToggleFavorite,
  isLoading,
  locale,
  dict,
}: DirectoryListProps) {
  const [showQR, setShowQR] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className={cn(
        view === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      )}>
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">{dict.directory.noResults}</p>
      </Card>
    );
  }

  const handleShare = async (place: Place) => {
    const url = `${window.location.origin}/${locale}/etablissement/${place.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.shortDescription,
          url,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      // Show toast notification
    }
  };

  const PlaceCard = ({ place }: { place: Place }) => {
    const isOpen = place.openingHours ? isOpenNow(place.openingHours) : null;
    const isFavorite = favorites.includes(place.id);
    const currentLang = locale as 'fr' | 'en' | 'es' | 'it';
    
    // Get localized content
    const name = place.name_i18n?.[currentLang] || place.name_i18n?.fr || place.name;
    const description = place.shortDescription_i18n?.[currentLang] || 
                       place.shortDescription_i18n?.fr || 
                       place.shortDescription;

    const cardContent = (
      <>
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {place.images?.[0] ? (
            <Image
              src={place.images[0].url}
              alt={place.images[0].alt_i18n?.[currentLang] || place.images[0].alt || name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {place.isFeatured && (
              <Badge className="bg-yellow-500 text-white">
                {dict.directory.featured}
              </Badge>
            )}
            {place.isVerified && (
              <Badge className="bg-green-500 text-white">
                {dict.directory.verified}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(place.id);
            }}
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white",
              isFavorite && "text-red-500"
            )}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Category */}
          <div className="mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="outline" className="text-xs">
                {dict.categories[place.category] || place.category}
              </Badge>
              {place.priceRange && (
                <span className="font-medium">{place.priceRange}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>

          {/* Info */}
          <div className="space-y-2 text-sm">
            {/* Address */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">
                {place.address?.street}, {place.address?.district}e
              </span>
            </div>

            {/* Opening Hours */}
            {isOpen !== null && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span className={cn(
                  "font-medium",
                  isOpen ? "text-green-600" : "text-red-600"
                )}>
                  {isOpen ? dict.directory.openNow : dict.directory.closed}
                </span>
              </div>
            )}

            {/* Rating */}
            {place.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="ml-1 font-medium">{place.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">
                  ({place.reviewCount} {dict.directory.reviews})
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            {place.contact?.phone && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${place.contact.phone}`;
                }}
                variant="outline"
                size="sm"
              >
                <Phone className="h-3 w-3" />
              </Button>
            )}
            {place.contact?.website && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(place.contact.website, '_blank');
                }}
                variant="outline"
                size="sm"
              >
                <Globe className="h-3 w-3" />
              </Button>
            )}
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare(place);
              }}
              variant="outline"
              size="sm"
            >
              <Share2 className="h-3 w-3" />
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQR(showQR === place.id ? null : place.id);
              }}
              variant="outline"
              size="sm"
            >
              <QrCode className="h-3 w-3" />
            </Button>
          </div>

          {/* QR Code */}
          {showQR === place.id && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
              <img
                src={generateQRCode(`${window.location.origin}/${locale}/etablissement/${place.slug}`)}
                alt="QR Code"
                className="mx-auto"
                width={150}
                height={150}
              />
              <p className="text-xs text-gray-500 mt-2">{dict.directory.scanToView}</p>
            </div>
          )}
        </div>
      </>
    );

    if (view === 'list') {
      return (
        <Link href={`/${locale}/etablissement/${place.slug}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
            <CardContent className="p-0 flex">
              <div className="relative w-48 h-48 flex-shrink-0">
                {place.images?.[0] ? (
                  <Image
                    src={place.images[0].url}
                    alt={place.images[0].alt_i18n?.[currentLang] || name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {dict.categories[place.category] || place.category}
                    </Badge>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite(place.id);
                    }}
                    variant="ghost"
                    size="icon"
                    className={cn(isFavorite && "text-red-500")}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {place.address?.district}e arr.
                    </span>
                    {place.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        {place.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      );
    }

    return (
      <Link href={`/${locale}/etablissement/${place.slug}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-full">
          <CardContent className="p-0">
            {cardContent}
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className={cn(
      view === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
    )}>
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}