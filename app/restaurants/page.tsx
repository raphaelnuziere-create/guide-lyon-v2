import { Star, MapPin, Clock, Euro, Award, ChefHat } from 'lucide-react'

const restaurants = [
  {
    id: 1,
    name: "L'Auberge du Pont de Collonges",
    chef: "Paul Bocuse",
    type: "Gastronomie",
    cuisine: "Française",
    rating: 4.9,
    reviews: 2341,
    priceRange: "€€€€",
    michelin: "3 étoiles",
    address: "40 rue de la Plage, Collonges-au-Mont-d'Or",
    hours: "12h-14h, 19h30-21h30",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    description: "Restaurant mythique du chef Paul Bocuse, temple de la gastronomie française"
  },
  {
    id: 2,
    name: "Têtedoie",
    chef: "Christian Têtedoie",
    type: "Gastronomie",
    cuisine: "Créative",
    rating: 4.8,
    reviews: 1523,
    priceRange: "€€€€",
    michelin: "1 étoile",
    address: "4 rue du Professeur Pierre Marion, Lyon 5e",
    hours: "12h-13h30, 19h30-21h30",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400",
    description: "Vue panoramique sur Lyon, cuisine créative et raffinée"
  },
  {
    id: 3,
    name: "Le Bouchon des Filles",
    chef: "Les Filles",
    type: "Bouchon",
    cuisine: "Lyonnaise",
    rating: 4.6,
    reviews: 892,
    priceRange: "€€",
    michelin: "",
    address: "20 rue Sergent-Blandan, Lyon 1er",
    hours: "12h-14h, 19h-22h",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    description: "Bouchon lyonnais tenu par des femmes, ambiance chaleureuse"
  },
  {
    id: 4,
    name: "Les Apothicaires",
    chef: "Tabata & Ludovic Mey",
    type: "Bistronomie",
    cuisine: "Moderne",
    rating: 4.7,
    reviews: 1102,
    priceRange: "€€€",
    michelin: "1 étoile",
    address: "23 rue de Sèze, Lyon 6e",
    hours: "12h-13h30, 19h30-21h30",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    description: "Cuisine créative avec produits locaux de saison"
  },
  {
    id: 5,
    name: "Le Kitchen",
    chef: "Connie Zagora & Laurent Ozan",
    type: "Gastronomie",
    cuisine: "Fusion",
    rating: 4.8,
    reviews: 723,
    priceRange: "€€€",
    michelin: "",
    address: "34 rue Chevreul, Lyon 7e",
    hours: "12h-14h, 19h30-22h",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    description: "Fusion créative entre cuisine française et influences mondiales"
  },
  {
    id: 6,
    name: "Chez Mounier",
    chef: "Famille Mounier",
    type: "Bouchon",
    cuisine: "Lyonnaise",
    rating: 4.5,
    reviews: 1456,
    priceRange: "€€",
    michelin: "",
    address: "3 rue des Marronniers, Lyon 2e",
    hours: "12h-14h30, 19h-22h30",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
    description: "Authentique bouchon lyonnais depuis 1906"
  },
  {
    id: 7,
    name: "Takao Takano",
    chef: "Takao Takano",
    type: "Gastronomie",
    cuisine: "Franco-japonaise",
    rating: 4.9,
    reviews: 567,
    priceRange: "€€€€",
    michelin: "2 étoiles",
    address: "33 rue Malesherbes, Lyon 6e",
    hours: "12h-13h30, 19h30-21h",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400",
    description: "Alliance subtile entre gastronomie française et japonaise"
  },
  {
    id: 8,
    name: "Le Neuvième Art",
    chef: "Christophe Roure",
    type: "Gastronomie",
    cuisine: "Moderne",
    rating: 4.8,
    reviews: 892,
    priceRange: "€€€€",
    michelin: "2 étoiles",
    address: "173 rue Cuvier, Lyon 6e",
    hours: "12h-13h30, 19h30-21h30",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
    description: "Cuisine inventive dans un cadre contemporain épuré"
  }
]

const cuisineTypes = ["Toutes", "Française", "Lyonnaise", "Moderne", "Gastronomie", "Bouchon", "Bistronomie", "Fusion"]
const priceRanges = ["Tous prix", "€", "€€", "€€€", "€€€€"]

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Restaurants à Lyon</h1>
          <p className="text-xl opacity-90">De la gastronomie étoilée aux bouchons traditionnels</p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-5 gap-4">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
              <option>Type de cuisine</option>
              {cuisineTypes.map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
              <option>Gamme de prix</option>
              {priceRanges.map(range => (
                <option key={range}>{range}</option>
              ))}
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
              <option>Étoiles Michelin</option>
              <option>Tous</option>
              <option>1 étoile</option>
              <option>2 étoiles</option>
              <option>3 étoiles</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500">
              <option>Quartier</option>
              <option>Tous</option>
              <option>Presqu'île</option>
              <option>Vieux Lyon</option>
              <option>Croix-Rousse</option>
              <option>Part-Dieu</option>
              <option>Confluence</option>
            </select>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Nos meilleures tables</h2>
          <p className="text-gray-600">{restaurants.length} restaurants sélectionnés</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
              <div className="flex">
                <div className="w-1/3 h-48">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600">Chef: {restaurant.chef}</p>
                    </div>
                    {restaurant.michelin && (
                      <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                        <Award className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">{restaurant.michelin}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                      <span>{restaurant.type} • {restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span>{restaurant.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-orange-600" />
                      <span>{restaurant.priceRange}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({restaurant.reviews} avis)</span>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
            Voir plus de restaurants
          </button>
        </div>
      </div>
    </div>
  )
}