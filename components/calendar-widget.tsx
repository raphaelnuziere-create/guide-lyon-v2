'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Users, Star } from 'lucide-react';
import { Button, Badge, Card, CardContent, CardHeader, CardTitle } from '@guide-de-lyon/ui';
import Link from 'next/link';
import { events } from '@/lib/data/events-seed';
import type { Event } from '@/types/event';

// Noms des jours et mois en français
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Fonction pour obtenir le nombre de jours dans un mois
const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Fonction pour obtenir le premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
const getFirstDayOfMonth = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  // Ajuster pour que Lundi = 0, Dimanche = 6
  return firstDay === 0 ? 6 : firstDay - 1;
};

// Fonction pour vérifier si deux dates sont le même jour
const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

// Fonction pour formater l'heure
const formatTime = (time: string) => {
  return time.replace(':', 'h');
};

// Fonction pour obtenir les événements d'une date
const getEventsForDate = (date: Date, eventsList: Event[]) => {
  return eventsList.filter(event => {
    const eventDate = new Date(event.startDate);
    return isSameDay(eventDate, date) && (event.visibility.homepage || event.visibility.calendar);
  });
};

interface CalendarWidgetProps {
  showTodayEvents?: boolean;
  compact?: boolean;
  showEventsList?: boolean;
}

export default function CalendarWidget({ showTodayEvents = true, compact = false, showEventsList = true }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Obtenir les jours du mois
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days: (Date | null)[] = [];
    
    // Ajouter les jours vides du début
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentDate]);

  // Événements du mois courant
  const monthEvents = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= startOfMonth && eventDate <= endOfMonth && 
             (event.visibility.homepage || event.visibility.calendar);
    });
  }, [currentDate]);

  // Événements du jour sélectionné
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate, events);
  }, [selectedDate]);

  // Événements d'aujourd'hui
  const todayEvents = useMemo(() => {
    return getEventsForDate(new Date(), events);
  }, []);

  // Navigation du calendrier
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Obtenir le nombre d'événements pour une date
  const getEventCount = (date: Date) => {
    return getEventsForDate(date, events).length;
  };

  // Pour mobile, gérer l'affichage des événements en modal
  const [showMobileEvents, setShowMobileEvents] = useState(false);

  return (
    <div className={compact ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-6'}>
      {/* Calendrier */}
      <Card className={compact ? 'h-fit' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier des événements
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
              >
                {viewMode === 'calendar' ? 'Liste' : 'Calendrier'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? (
            <>
              {/* En-tête du calendrier */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                  >
                    Aujourd'hui
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Grille du calendrier */}
              <div className={`grid grid-cols-7 ${compact ? 'gap-0.5' : 'gap-1'}`}>
                {/* En-tête des jours */}
                {DAYS.map(day => (
                  <div key={day} className={`text-center font-medium text-gray-600 ${compact ? 'text-xs py-1' : 'text-sm py-2'}`}>
                    {compact ? day.substring(0, 1) : day}
                  </div>
                ))}
                
                {/* Jours du mois */}
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }
                  
                  const isToday = isSameDay(date, new Date());
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const eventCount = getEventCount(date);
                  const hasEvents = eventCount > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date);
                        if (compact && window.innerWidth < 1024) {
                          setShowMobileEvents(true);
                        }
                      }}
                      className={`
                        ${compact ? 'aspect-square p-0.5 rounded border' : 'aspect-square p-1 rounded-lg border'}
                        transition-all
                        ${isToday ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}
                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
                        ${hasEvents ? 'font-semibold' : ''}
                        hover:bg-gray-50
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`${compact ? 'text-xs' : 'text-sm'} ${isToday ? 'text-blue-600' : ''}`}>
                          {date.getDate()}
                        </span>
                        {hasEvents && (
                          <div className={`flex ${compact ? 'gap-0' : 'gap-0.5'} ${compact ? 'mt-0' : 'mt-1'}`}>
                            {[...Array(Math.min(eventCount, compact ? 1 : 3))].map((_, i) => (
                              <div
                                key={i}
                                className={`${compact ? 'w-0.5 h-0.5' : 'w-1 h-1'} rounded-full ${
                                  isToday ? 'bg-blue-600' : 'bg-purple-500'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Vue liste */
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {monthEvents.length > 0 ? (
                monthEvents.map(event => {
                  const eventDate = new Date(event.startDate);
                  return (
                    <Link
                      key={event.id}
                      href={`/evenements/${event.slug}`}
                      className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {eventDate.getDate()} {MONTHS[eventDate.getMonth()]}
                            </Badge>
                            {event.visibility.featured && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatTime(event.startTime)}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Aucun événement ce mois-ci
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Événements du jour sélectionné - Desktop en colonne, Mobile en modal */}
      {compact && showEventsList && (
        <>
          {/* Version desktop - colonne à droite */}
          <div className="hidden lg:block">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate ? (
                    <>
                      {isSameDay(selectedDate, new Date()) ? "Aujourd'hui" : 
                       `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`}
                    </>
                  ) : (
                    'Sélectionnez une date'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate && selectedDateEvents.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {selectedDateEvents.map(event => (
                      <Link
                        key={event.id}
                        href={`/evenements/${event.slug}`}
                        className="block p-2 rounded border hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-medium text-sm line-clamp-1">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(event.startTime)}
                          </span>
                          <span className="flex items-center line-clamp-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    {selectedDate ? 'Aucun événement ce jour' : 'Cliquez sur une date pour voir les événements'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Version mobile - modal */}
          {showMobileEvents && selectedDate && (
            <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowMobileEvents(false)}>
              <div className="bg-white rounded-lg w-full max-w-sm max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">
                    {isSameDay(selectedDate, new Date()) ? "Aujourd'hui" : 
                     `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`}
                  </h3>
                  <button
                    onClick={() => setShowMobileEvents(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 overflow-y-auto">
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map(event => (
                        <Link
                          key={event.id}
                          href={`/evenements/${event.slug}`}
                          className="block p-3 rounded-lg border hover:bg-gray-50"
                        >
                          <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(event.startTime)}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Aucun événement ce jour
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Événements du jour sélectionné - Version normale */}
      {!compact && selectedDate && selectedDateEvents.length > 0 && viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isSameDay(selectedDate, new Date()) ? "Aujourd'hui" : 
               `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`}
              {' - '}
              {selectedDateEvents.length} événement{selectedDateEvents.length > 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <Link
                  key={event.id}
                  href={`/evenements/${event.slug}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(event.startTime)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location.district}e arr.
                        </span>
                        {event.price?.type === 'gratuit' && (
                          <Badge variant="secondary" className="text-xs">
                            Gratuit
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Événements du jour (si activé et différent de la date sélectionnée) */}
      {showTodayEvents && todayEvents.length > 0 && 
       (!selectedDate || !isSameDay(selectedDate, new Date())) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Aujourd'hui à Lyon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.map(event => (
                <Link
                  key={event.id}
                  href={`/evenements/${event.slug}`}
                  className="block p-3 bg-white rounded-lg border hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(event.startTime)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location.name}
                        </span>
                        {event.currentReservations && event.capacity && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.currentReservations}/{event.capacity}
                          </span>
                        )}
                      </div>
                    </div>
                    {event.visibility.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
              <Link href="/evenements">
                <Button variant="outline" className="w-full">
                  Voir tous les événements
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}