'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, Tag } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Event {
  id: string
  title: string
  date: Date
  time: string
  location: string
  category: string
  price?: string
  attendees?: number
  image?: string
  description?: string
  featured?: boolean
}

// Données d'exemple - À remplacer par vos vraies données
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Fête des Lumières 2025',
    date: new Date(2025, 11, 5),
    time: '18:00 - 23:00',
    location: 'Centre-ville de Lyon',
    category: 'Festival',
    price: 'Gratuit',
    attendees: 3000000,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
    description: 'Le rendez-vous incontournable de décembre',
    featured: true
  },
  {
    id: '2',
    title: 'Marché de Noël',
    date: new Date(2025, 11, 10),
    time: '10:00 - 20:00',
    location: 'Place Carnot',
    category: 'Marché',
    price: 'Gratuit',
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400'
  },
  {
    id: '3',
    title: 'Concert Jazz au Théâtre',
    date: new Date(2025, 0, 20),
    time: '20:30',
    location: 'Théâtre de la Croix-Rousse',
    category: 'Concert',
    price: '25€',
    attendees: 300
  },
  {
    id: '4',
    title: 'Exposition Art Contemporain',
    date: new Date(2025, 0, 22),
    time: '10:00 - 18:00',
    location: 'Musée des Confluences',
    category: 'Exposition',
    price: '12€'
  },
  {
    id: '5',
    title: 'Visite guidée du Vieux Lyon',
    date: new Date(2025, 0, 22),
    time: '14:00',
    location: 'Place Saint-Jean',
    category: 'Visite',
    price: '15€',
    attendees: 25
  }
]

interface CalendarWidgetProps {
  compact?: boolean
  showEventsList?: boolean
  onDateSelect?: (date: Date) => void
  events?: Event[]
}

export default function CalendarWidget({ 
  compact = false, 
  showEventsList = true,
  onDateSelect,
  events = sampleEvents 
}: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obtenir le premier jour de la semaine (lundi = 1)
  const startDayOfWeek = monthStart.getDay() || 7
  const emptyDays = Array.from({ length: startDayOfWeek - 1 }, (_, i) => i)

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  // Filtrer les événements pour la date sélectionnée
  const selectedEvents = events.filter(event => 
    isSameDay(event.date, selectedDate)
  )

  // Vérifier si une date a des événements
  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(event.date, date))
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Festival': 'bg-purple-100 text-purple-700',
      'Concert': 'bg-blue-100 text-blue-700',
      'Exposition': 'bg-green-100 text-green-700',
      'Marché': 'bg-orange-100 text-orange-700',
      'Visite': 'bg-yellow-100 text-yellow-700',
      'Sport': 'bg-red-100 text-red-700',
      'Théâtre': 'bg-pink-100 text-pink-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className={`grid ${showEventsList ? 'lg:grid-cols-2' : ''} gap-6`}>
      {/* Calendrier */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-600" />
            Calendrier
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold min-w-[140px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* Jours vides du début */}
          {emptyDays.map(day => (
            <div key={`empty-${day}`} className="h-10" />
          ))}
          
          {/* Jours du mois */}
          {monthDays.map(day => {
            const isSelected = isSameDay(day, selectedDate)
            const hasEvent = hasEvents(day)
            const isCurrentDay = isToday(day)
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  h-10 relative rounded-lg transition-all
                  ${isSelected ? 'bg-red-600 text-white font-semibold' : ''}
                  ${!isSelected && isCurrentDay ? 'bg-red-50 text-red-600 font-semibold' : ''}
                  ${!isSelected && !isCurrentDay ? 'hover:bg-gray-100' : ''}
                  ${!isSelected && !isCurrentDay && hasEvent ? 'font-medium' : ''}
                `}
              >
                {format(day, 'd')}
                {hasEvent && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-red-600 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* Filtres rapides */}
        {!compact && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition">
                Aujourd'hui
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition">
                Cette semaine
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition">
                Weekend
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition">
                Gratuit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des événements */}
      {showEventsList && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">
                Événements du {format(selectedDate, 'd MMMM', { locale: fr })}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedEvents.length} événement{selectedEvents.length > 1 ? 's' : ''} ce jour
              </p>
            </div>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun événement ce jour</p>
              <p className="text-sm text-gray-400 mt-1">
                Sélectionnez une autre date dans le calendrier
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {selectedEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`border rounded-lg p-4 hover:shadow-md transition ${
                    event.featured ? 'border-red-200 bg-red-50/50' : ''
                  }`}
                >
                  {event.image && (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  )}
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      {event.location}
                    </div>
                    {event.price && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-red-600" />
                        {event.price}
                      </div>
                    )}
                    {event.attendees && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-red-600" />
                        {event.attendees.toLocaleString()} participants
                      </div>
                    )}
                  </div>
                  
                  <button className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                    En savoir plus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}