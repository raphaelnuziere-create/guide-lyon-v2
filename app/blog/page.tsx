import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: "Les 10 meilleurs bouchons lyonnais traditionnels",
    excerpt: "Découvrez notre sélection des bouchons qui perpétuent la tradition culinaire lyonnaise avec authenticité et passion.",
    author: "Marie Dubois",
    date: "15 janvier 2025",
    readTime: "5 min",
    category: "Gastronomie",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
    featured: true
  },
  {
    id: 2,
    title: "Guide complet du Vieux Lyon : histoire et bonnes adresses",
    excerpt: "Explorez les traboules secrètes et les trésors cachés du quartier Renaissance le mieux préservé d'Europe.",
    author: "Pierre Martin",
    date: "12 janvier 2025",
    readTime: "8 min",
    category: "Patrimoine",
    image: "https://images.unsplash.com/photo-1584285401690-7d18ecb8e1f9?w=600"
  },
  {
    id: 3,
    title: "Festival des Lumières 2025 : programme et conseils",
    excerpt: "Tout ce qu'il faut savoir pour profiter au maximum de la Fête des Lumières : parcours, œuvres incontournables et astuces.",
    author: "Sophie Laurent",
    date: "10 janvier 2025",
    readTime: "6 min",
    category: "Événements",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600"
  },
  {
    id: 4,
    title: "Les marchés de Lyon : où faire ses courses comme un local",
    excerpt: "Des Halles Paul Bocuse au marché de la Croix-Rousse, découvrez les meilleurs marchés pour des produits frais et locaux.",
    author: "Jean Mercier",
    date: "8 janvier 2025",
    readTime: "4 min",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600"
  },
  {
    id: 5,
    title: "Musées de Lyon : notre top 10 des incontournables",
    excerpt: "Du Musée des Confluences au Musée des Beaux-Arts, parcourez les collections exceptionnelles de la ville.",
    author: "Claire Bonnet",
    date: "5 janvier 2025",
    readTime: "7 min",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600"
  },
  {
    id: 6,
    title: "Balades à vélo : 5 itinéraires pour découvrir Lyon",
    excerpt: "Explorez Lyon à vélo avec nos circuits testés et approuvés, des berges du Rhône au parc de la Tête d'Or.",
    author: "Thomas Durand",
    date: "3 janvier 2025",
    readTime: "5 min",
    category: "Loisirs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
  }
]

const categories = ["Toutes", "Gastronomie", "Culture", "Patrimoine", "Événements", "Lifestyle", "Loisirs"]

export default function BlogPage() {
  const featuredArticle = articles.find(a => a.featured)
  const otherArticles = articles.filter(a => !a.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Blog Guide de Lyon</h1>
          <p className="text-xl opacity-90">Actualités, conseils et découvertes lyonnaises</p>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white rounded-full border hover:border-indigo-500 hover:text-indigo-600 transition whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Article à la une</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-80 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                      {featuredArticle.category}
                    </span>
                    <span className="text-sm text-gray-500">Article vedette</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{featuredArticle.title}</h3>
                  <p className="text-gray-600 mb-6 text-lg">{featuredArticle.excerpt}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredArticle.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredArticle.readTime}
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Lire l'article
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Derniers articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="h-48">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                      Lire →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
          <p className="mb-6 opacity-90">Recevez chaque semaine le meilleur de Lyon dans votre boîte mail</p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-semibold">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}