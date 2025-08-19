import { Sparkles, MapPin, Calendar, TrendingUp, Users, Star, ChevronRight, Heart, Building2, Award, Briefcase } from 'lucide-react'
import Link from 'next/link'
import CalendarWidget from '@/components/calendar/CalendarWidget'

// Données temporaires pour la démo
const featuredPlaces = [
  {
    id: 1,
    name: "Les Halles de Lyon Paul Bocuse",
    category: "Marché",
    image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400",
    rating: 4.8,
    address: "102 cours Lafayette, Lyon 3e",
    isFavorite: false,
    isPremium: true
  },
  {
    id: 2,
    name: "Musée des Confluences",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400",
    rating: 4.6,
    address: "86 quai Perrache, Lyon 2e",
    isFavorite: true,
    isPremium: false
  },
  {
    id: 3,
    name: "Parc de la Tête d'Or",
    category: "Loisirs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    rating: 4.7,
    address: "Place Général Leclerc, Lyon 6e",
    isFavorite: false,
    isPremium: false
  },
  {
    id: 4,
    name: "Basilique de Fourvière",
    category: "Patrimoine",
    image: "https://images.unsplash.com/photo-1584285402827-e58334683f84?w=400",
    rating: 4.9,
    address: "8 place de Fourvière, Lyon 5e",
    isFavorite: true,
    isPremium: true
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

const subscriptionPlans = [
  {
    name: 'Gratuit',
    price: '0€',
    features: ['Fiche basique', 'Horaires et contact', 'Localisation'],
    highlighted: false
  },
  {
    name: 'Pro',
    price: '29€',
    period: '/mois',
    features: ['Tout du plan Gratuit', '2 événements/mois', 'Photos illimitées', 'Statistiques basiques'],
    highlighted: true
  },
  {
    name: 'Boost',
    price: '79€',
    period: '/mois',
    features: ['Tout du plan Pro', '5 événements/mois', 'Newsletter mensuelle', 'Mise en avant', 'Support prioritaire'],
    highlighted: false
  }
]

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section avec gradient rouge Lyon */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <span className="text-yellow-300 font-semibold">La capitale des Gaules vous accueille</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Guide de Lyon
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-red-50">
              Découvrez les trésors cachés et les incontournables de Lyon
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/annuaire" className="px-8 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition">
                Explorer l'annuaire
              </Link>
              <Link href="/dashboard" className="px-8 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition">
                Espace Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Calendrier et Événements - 2 COLONNES */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Agenda Lyonnais</h2>
            <p className="text-gray-600 mt-2">Sélectionnez une date pour voir les événements</p>
          </div>
          
          {/* Le CalendarWidget avec le layout 2 colonnes */}
          <CalendarWidget 
            compact={false}
            showEventsList={true}
          />
        </div>
      </section>

      {/* Actualités */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Actualités lyonnaises</h2>
              <p className="text-gray-600 mt-1">Les dernières nouvelles de la ville</p>
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

      {/* Lieux Premium */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Établissements Premium</h2>
              <p className="text-gray-600 mt-1">Les meilleures adresses partenaires</p>
            </div>
            <Link href="/annuaire" className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1">
              Voir tout l'annuaire
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group relative">
                {place.isPremium && (
                  <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-yellow-400 text-black rounded text-xs font-bold flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Premium
                  </div>
                )}
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

      {/* Plans d'abonnement */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Offres Professionnelles</h2>
            <p className="text-xl text-gray-600">Choisissez l'offre adaptée à votre établissement</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <div key={index} className={`relative rounded-2xl ${
                plan.highlighted 
                  ? 'bg-gradient-to-br from-red-600 to-orange-500 text-white p-[2px]' 
                  : 'border-2 border-gray-200'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-black rounded-full text-sm font-bold">
                    Plus populaire
                  </div>
                )}
                <div className={`${plan.highlighted ? 'bg-white text-gray-900' : ''} rounded-2xl p-6`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.highlighted 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    Choisir ce plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Professionnels */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Building2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Vous êtes un professionnel ?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Rejoignez plus de 500 établissements lyonnais déjà présents sur le Guide
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">+45%</div>
                <p className="text-gray-400">de visibilité en moyenne</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">12K+</div>
                <p className="text-gray-400">visiteurs par mois</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">98%</div>
                <p className="text-gray-400">de satisfaction client</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                Créer mon espace pro
              </Link>
              <Link href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter avec options */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Newsletter personnalisée</h2>
            <p className="text-xl mb-8 text-red-50">
              Choisissez votre rythme : quotidien, hebdomadaire ou mensuel
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <label className="bg-white/20 backdrop-blur rounded-lg p-4 cursor-pointer hover:bg-white/30 transition">
                  <input type="radio" name="frequency" className="mb-2" />
                  <h4 className="font-semibold mb-1">Quotidienne</h4>
                  <p className="text-sm text-red-100">L'actualité du jour</p>
                </label>
                <label className="bg-white/20 backdrop-blur rounded-lg p-4 cursor-pointer hover:bg-white/30 transition">
                  <input type="radio" name="frequency" className="mb-2" defaultChecked />
                  <h4 className="font-semibold mb-1">Hebdomadaire</h4>
                  <p className="text-sm text-red-100">Le condensé du jeudi</p>
                </label>
                <label className="bg-white/20 backdrop-blur rounded-lg p-4 cursor-pointer hover:bg-white/30 transition">
                  <input type="radio" name="frequency" className="mb-2" />
                  <h4 className="font-semibold mb-1">Mensuelle</h4>
                  <p className="text-sm text-red-100">Le dossier du mois</p>
                </label>
              </div>
              
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
        </div>
      </section>
    </main>
  )
}