import { MapPin, Search, Filter, Grid, List } from 'lucide-react'

// Données statiques temporaires
const places = [
  {
    id: 1,
    name: "Paul Bocuse",
    category: "Restaurant",
    address: "40 rue de la Plage, 69660 Collonges-au-Mont-d'Or",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
    description: "Restaurant gastronomique 3 étoiles Michelin"
  },
  {
    id: 2,
    name: "Les Halles de Lyon Paul Bocuse",
    category: "Marché",
    address: "102 cours Lafayette, 69003 Lyon",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400",
    description: "Le temple de la gastronomie lyonnaise"
  },
  {
    id: 3,
    name: "Musée des Confluences",
    category: "Culture",
    address: "86 quai Perrache, 69002 Lyon",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400",
    description: "Musée des sciences et de l'anthropologie"
  },
  {
    id: 4,
    name: "Bouchon Daniel et Denise",
    category: "Restaurant",
    address: "156 rue de Créqui, 69003 Lyon",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    description: "Bouchon lyonnais traditionnel"
  },
  {
    id: 5,
    name: "Parc de la Tête d'Or",
    category: "Loisirs",
    address: "Place du Général Leclerc, 69006 Lyon",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    description: "Le plus grand parc urbain de Lyon"
  },
  {
    id: 6,
    name: "Basilique Notre-Dame de Fourvière",
    category: "Patrimoine",
    address: "8 place de Fourvière, 69005 Lyon",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1584285402827-e58334683f84?w=400",
    description: "Monument emblématique de Lyon"
  }
]

const categories = ["Tous", "Restaurant", "Culture", "Loisirs", "Shopping", "Patrimoine", "Marché"]

export default function AnnuairePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Annuaire de Lyon</h1>
          <p className="text-xl opacity-90">Découvrez les meilleures adresses de la ville</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un lieu, un restaurant..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white rounded-full border hover:border-blue-500 hover:text-blue-600 transition whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{places.length} résultats trouvés</p>
          <div className="flex gap-2">
            <button className="p-2 border rounded hover:bg-gray-100">
              <Grid className="h-5 w-5" />
            </button>
            <button className="p-2 border rounded hover:bg-gray-100">
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div key={place.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold">
                  {place.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{place.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  {place.address}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{place.rating}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold">
                    Voir plus →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}