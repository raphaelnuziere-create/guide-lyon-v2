import { Calendar, MapPin, Clock, Users, Tag } from 'lucide-react'

const events = [
  {
    id: 1,
    title: "Fête des Lumières 2024",
    date: "5-8 Décembre 2024",
    time: "18h00 - 23h00",
    location: "Centre-ville de Lyon",
    category: "Festival",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
    description: "Le rendez-vous incontournable de décembre",
    attendees: "3M+ visiteurs",
    price: "Gratuit"
  },
  {
    id: 2,
    title: "Nuits Sonores",
    date: "28 Mai - 1 Juin 2025",
    time: "Variable",
    location: "Divers lieux",
    category: "Musique",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    description: "Festival de musiques électroniques et indépendantes",
    attendees: "140 000",
    price: "À partir de 35€"
  },
  {
    id: 3,
    title: "Biennale de la Danse",
    date: "Septembre 2024",
    time: "Variable",
    location: "Divers lieux",
    category: "Danse",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400",
    description: "Festival international de danse contemporaine",
    attendees: "250 000",
    price: "Variable"
  },
  {
    id: 4,
    title: "Jazz à Vienne",
    date: "Juin-Juillet 2025",
    time: "20h00",
    location: "Théâtre Antique de Vienne",
    category: "Musique",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
    description: "Festival de jazz dans un cadre exceptionnel",
    attendees: "200 000",
    price: "30-80€"
  },
  {
    id: 5,
    title: "Quais du Polar",
    date: "Mars 2025",
    time: "Variable",
    location: "Divers lieux",
    category: "Littérature",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    description: "Festival international du roman noir",
    attendees: "75 000",
    price: "Gratuit/Payant"
  },
  {
    id: 6,
    title: "Festival Lumière",
    date: "Octobre 2024",
    time: "Variable",
    location: "Institut Lumière",
    category: "Cinéma",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
    description: "Festival du cinéma classique",
    attendees: "180 000",
    price: "8-15€"
  }
]

const categories = ["Tous", "Festival", "Musique", "Culture", "Sport", "Gastronomie", "Cinéma"]
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

export default function EvenementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Événements à Lyon</h1>
          <p className="text-xl opacity-90">L'agenda complet des sorties lyonnaises</p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500">
              <option>Catégorie</option>
              {categories.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500">
              <option>Mois</option>
              {months.map(month => (
                <option key={month}>{month}</option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500">
              <option>Prix</option>
              <option>Gratuit</option>
              <option>Moins de 20€</option>
              <option>20-50€</option>
              <option>Plus de 50€</option>
            </select>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Appliquer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Événements à venir</h2>
          <p className="text-gray-600">{events.length} événements trouvés</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-sm font-semibold">
                  {event.price}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    {event.attendees}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    En savoir plus
                  </button>
                  <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Charger plus d'événements
          </button>
        </div>
      </div>
    </div>
  )
}