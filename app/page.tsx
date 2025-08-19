import { Sparkles, MapPin, Calendar, TrendingUp, Users, Star, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'

// Données temporaires pour la démo
const featuredPlaces = [
  {
    id: 1,
    name: "Les Halles de Lyon Paul Bocuse",
    category: "Marché",
    image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400",
    rating: 4.8,
    address: "102 cours Lafayette, Lyon 3e",
    isFavorite: false
  },
  {
    id: 2,
    name: "Musée des Confluences",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400",
    rating: 4.6,
    address: "86 quai Perrache, Lyon 2e",
    isFavorite: true
  },
  {
    id: 3,
    name: "Parc de la Tête d'Or",
    category: "Loisirs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    rating: 4.7,
    address: "Place Général Leclerc, Lyon 6e",
    isFavorite: false
  },
  {
    id: 4,
    name: "Basilique de Fourvière",
    category: "Patrimoine",
    image: "https://images.unsplash.com/photo-1584285402827-e58334683f84?w=400",
    rating: 4.9,
    address: "8 place de Fourvière, Lyon 5e",
    isFavorite: true
  }
]

const upcomingEvents = [
  {
    id: 1,
    title: "Fête des Lumières 2025",
    date: "5-8 Décembre",
    category: "Festival",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
  },
  {
    id: 2,
    title: "Nuits Sonores",
    date: "28 Mai - 1 Juin",
    category: "Musique",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
  },
  {
    id: 3,
    title: "Biennale de la Danse",
    date: "Septembre 2025",
    category: "Danse",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400"
  }
]

const latestNews = [
  {
    id: 1,
    title: "Nouveau tramway T10 : ouverture de la ligne vers l'aéroport",
    category: "Transport",
    date: "Il y a 2 jours",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400"
  },
  {
    id: 2,
    title: "Lyon élue meilleure destination gastronomique d'Europe",
    category: "Gastronomie",
    date: "Il y a 3 jours",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"
  },
  {
    id: 3,
    title: "Rénovation complète du quartier de la Part-Dieu",
    category: "Urbanisme",
    date: "Il y a 5 jours",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400"
  }
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section avec gradient rouge Lyon */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold">La capitale des Gaules vous accueille</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Guide de Lyon
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-50">
              Découvrez les trésors cachés et les incontournables de Lyon
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/annuaire" className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition">
                Explorer l'annuaire
              </Link>
              <Link href="/evenements" className="px-8 py-4 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition">
                Voir les événements
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Actualités */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Actualités lyonnaises</h2>
              <p className="text-gray-600 mt-2">Les dernières nouvelles de la ville</p>
            </div>
            <Link href="/blog" className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
              Toutes les actualités
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <article key={article.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                <div className="h-48 relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-500">{article.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lieux à découvrir */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Lieux incontournables</h2>
              <p className="text-gray-600 mt-2">Les meilleures adresses sélectionnées pour vous</p>
            </div>
            <Link href="/annuaire" className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
              Voir tout l'annuaire
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group">
                <div className="h-48 relative">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition">
                    <Heart className={`h-5 w-5 ${place.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold">
                    {place.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    {place.address}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{place.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Événements */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Événements à venir</h2>
              <p className="text-gray-600 mt-2">Ne manquez rien de l'agenda lyonnais</p>
            </div>
            <Link href="/evenements" className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
              Tous les événements
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                <div className="h-48 relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-sm font-semibold bg-red-600 px-3 py-1 rounded-full inline-block mb-2">
                      {event.category}
                    </span>
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <p className="text-sm flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Professionnels */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Vous êtes un professionnel ?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Rejoignez le Guide de Lyon et donnez de la visibilité à votre établissement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                Créer mon espace pro
              </Link>
              <Link href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
            <p className="text-xl mb-8 text-red-50">
              Recevez chaque semaine le meilleur de Lyon dans votre boîte mail
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
