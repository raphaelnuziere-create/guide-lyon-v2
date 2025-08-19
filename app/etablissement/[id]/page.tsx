import { 
  MapPin, Phone, Globe, Clock, Euro, Star, Heart, Share2, 
  Calendar, ChefHat, Users, Wifi, Car, CreditCard, Award,
  Check, X, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react'
import Link from 'next/link'

// Données de démonstration pour une fiche entreprise
const establishment = {
  id: 1,
  name: "Les Halles de Lyon Paul Bocuse",
  category: "Marché Couvert",
  description: "Temple de la gastronomie lyonnaise depuis 1971, Les Halles de Lyon Paul Bocuse réunissent 48 commerçants de bouche triés sur le volet. Un lieu incontournable pour découvrir les meilleurs produits du terroir lyonnais.",
  images: [
    "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800"
  ],
  address: "102 cours Lafayette, 69003 Lyon",
  phone: "04 78 62 39 33",
  website: "www.halles-de-lyon-paulbocuse.com",
  email: "contact@halles-lyon.fr",
  
  hours: {
    monday: "7h00 - 19h00",
    tuesday: "7h00 - 19h00",
    wednesday: "7h00 - 19h00",
    thursday: "7h00 - 19h00",
    friday: "7h00 - 22h30",
    saturday: "7h00 - 22h30",
    sunday: "7h00 - 16h30"
  },
  
  priceRange: "€€",
  rating: 4.7,
  reviewCount: 2341,
  
  features: [
    { name: "WiFi gratuit", icon: Wifi, available: true },
    { name: "Parking", icon: Car, available: true },
    { name: "Carte bancaire", icon: CreditCard, available: true },
    { name: "Accessible PMR", icon: Users, available: true }
  ],
  
  specialties: [
    "Fromages affinés",
    "Charcuterie lyonnaise",
    "Fruits de mer",
    "Pâtisseries artisanales",
    "Vins régionaux"
  ],
  
  awards: [
    "Meilleur marché de France 2020",
    "Label Qualité Tourisme",
    "Site remarquable du goût"
  ]
}

const reviews = [
  {
    id: 1,
    author: "Marie Dubois",
    rating: 5,
    date: "Il y a 2 jours",
    comment: "Un lieu incontournable pour tous les amateurs de bonne cuisine. Les produits sont d'une qualité exceptionnelle et les commerçants sont très accueillants.",
    helpful: 12
  },
  {
    id: 2,
    author: "Jean Martin",
    rating: 4,
    date: "Il y a 1 semaine",
    comment: "Très beau marché avec des produits de qualité. Un peu cher mais ça vaut le coup pour des occasions spéciales.",
    helpful: 8
  },
  {
    id: 3,
    author: "Sophie Laurent",
    rating: 5,
    date: "Il y a 2 semaines",
    comment: "J'adore venir faire mes courses ici. L'ambiance est unique et on trouve des produits qu'on ne trouve nulle part ailleurs.",
    helpful: 15
  }
]

const similarPlaces = [
  {
    id: 2,
    name: "Marché de la Croix-Rousse",
    category: "Marché",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400",
    rating: 4.5,
    address: "Boulevard de la Croix-Rousse"
  },
  {
    id: 3,
    name: "Marché Quai Saint-Antoine",
    category: "Marché",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    rating: 4.6,
    address: "Quai Saint-Antoine"
  }
]

export default function EstablishmentPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-red-600">Accueil</Link>
            <span className="text-gray-400">/</span>
            <Link href="/annuaire" className="text-gray-600 hover:text-red-600">Annuaire</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{establishment.name}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={establishment.images[0]} 
          alt={establishment.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Gallery Navigation */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition">
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition">
            <Heart className="h-5 w-5" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{establishment.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      {establishment.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{establishment.rating}</span>
                      <span className="text-sm">({establishment.reviewCount} avis)</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Euro className="h-5 w-5" />
                      <span>{establishment.priceRange}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{establishment.description}</p>
              
              {/* Awards */}
              {establishment.awards.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold">Distinctions</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {establishment.awards.map((award, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-sm">
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-red-600" />
                Spécialités
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {establishment.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-red-600" />
                  Avis clients
                </h2>
                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition">
                  Écrire un avis
                </button>
              </div>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{review.author}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <button className="mt-2 text-sm text-gray-500 hover:text-red-600">
                      Utile ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-red-600 hover:text-red-700 font-semibold">
                Voir tous les avis →
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Informations pratiques</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-gray-600">{establishment.address}</p>
                    <button className="text-red-600 text-sm hover:underline">
                      Voir sur la carte
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-600">{establishment.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Site web</p>
                    <a href="#" className="text-red-600 hover:underline">
                      {establishment.website}
                    </a>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                Contacter l'établissement
              </button>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-600" />
                Horaires d'ouverture
              </h3>
              
              <div className="space-y-2">
                {Object.entries(establishment.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="capitalize">{day === 'monday' ? 'Lundi' : 
                                                 day === 'tuesday' ? 'Mardi' :
                                                 day === 'wednesday' ? 'Mercredi' :
                                                 day === 'thursday' ? 'Jeudi' :
                                                 day === 'friday' ? 'Vendredi' :
                                                 day === 'saturday' ? 'Samedi' :
                                                 'Dimanche'}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Services et équipements</h3>
              
              <div className="space-y-2">
                {establishment.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-gray-600" />
                      <span className="text-sm">{feature.name}</span>
                    </div>
                    {feature.available ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Places */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Établissements similaires</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarPlaces.map((place) => (
              <Link key={place.id} href={`/etablissement/${place.id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="h-40">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{place.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{place.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{place.address}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-semibold">{place.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}