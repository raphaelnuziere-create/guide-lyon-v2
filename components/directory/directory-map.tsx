'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '@/types';
import { Button } from '@guide-de-lyon/ui';
import { MapPin, Navigation, X } from 'lucide-react';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DirectoryMapProps {
  places: Place[];
  center?: [number, number];
  onPlaceClick?: (place: Place) => void;
  selectedPlace?: string;
  className?: string;
}

export function DirectoryMap({ places, center, onPlaceClick, selectedPlace, className = "h-96 w-full" }: DirectoryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedPlaceData, setSelectedPlaceData] = useState<Place | null>(null);

  const categoryColors: Record<string, string> = {
    restaurant: '#ef4444',
    bar: '#8b5cf6',
    culture: '#06b6d4',
    hotel: '#10b981',
    shopping: '#f59e0b',
    service: '#6b7280',
  };

  const createCustomIcon = (category: string, isSelected: boolean = false) => {
    const color = categoryColors[category] || '#6b7280';
    const size = isSelected ? 35 : 25;
    
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          background-color: ${color}; 
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          ${isSelected ? 'transform: scale(1.2);' : ''}
          transition: all 0.2s ease;
        ">
          ${category === 'restaurant' ? '🍽️' : 
            category === 'bar' ? '🍷' :
            category === 'culture' ? '🎨' :
            category === 'hotel' ? '🏨' :
            category === 'shopping' ? '🛍️' : '⚙️'}
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: center || [45.764043, 4.835659], // Lyon center
      zoom: center ? 14 : 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [center]);

  // Update markers when places change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    const newMarkers: L.Marker[] = [];
    places.forEach((place) => {
      if (place.address?.lat && place.address?.lng) {
        const isSelected = selectedPlace === place.id;
        const icon = createCustomIcon(place.category, isSelected);
        const marker = L.marker([place.address.lat, place.address.lng], { icon });
        
        marker.on('click', () => {
          setSelectedPlaceData(place);
          if (onPlaceClick) {
            onPlaceClick(place);
          }
        });

        // Add popup
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold">${place.name}</h3>
            <p class="text-sm text-gray-600 capitalize">${place.category}</p>
            <p class="text-xs">${place.address.street}</p>
            ${place.rating ? `<p class="text-xs">⭐ ${place.rating}/5</p>` : ''}
            ${place.priceRange ? `<p class="text-xs">${place.priceRange}</p>` : ''}
          </div>
        `;
        marker.bindPopup(popupContent);

        marker.addTo(mapInstanceRef.current!);
        newMarkers.push(marker);
      }
    });

    markersRef.current = newMarkers;

    // Fit bounds if we have markers
    if (places.length > 0) {
      const group = new L.featureGroup(newMarkers);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [places, selectedPlace, onPlaceClick]);

  // Handle center change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, 14);
    }
  }, [center]);

  return (
    <div className="relative">
      <div ref={mapRef} className={className + " rounded-lg shadow-lg"} />
      
      {/* Selected Place Info */}
      {selectedPlaceData && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[1000] p-4 bg-white shadow-xl rounded-lg border">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{selectedPlaceData.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{selectedPlaceData.category}</p>
              <p className="text-sm mt-1">{selectedPlaceData.address?.street}</p>
              {selectedPlaceData.rating && (
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1 text-sm">{selectedPlaceData.rating.toFixed(1)}/5</span>
                </div>
              )}
              {selectedPlaceData.priceRange && (
                <p className="text-sm text-gray-600 mt-1">{selectedPlaceData.priceRange}</p>
              )}
            </div>
            <Button
              onClick={() => setSelectedPlaceData(null)}
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => onPlaceClick?.(selectedPlaceData)}
              variant="default"
              size="sm"
              className="flex-1"
            >
              Voir les détails
            </Button>
            <Button
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlaceData.address?.lat},${selectedPlaceData.address?.lng}`;
                window.open(url, '_blank');
              }}
              variant="outline"
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Itinéraire
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}