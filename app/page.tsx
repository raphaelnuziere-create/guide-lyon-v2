export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Guide de Lyon
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Découvrez le meilleur de la capitale des Gaules
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
                🍴 Restaurants
              </button>
              <button className="bg-white/20 backdrop-blur text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition">
                🎭 Événements
              </button>
              <button className="bg-white/20 backdrop-blur text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition">
                📍 Lieux
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Explorez Lyon</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Annuaire */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-2">Annuaire</h3>
            <p className="text-gray-600 mb-4">
              Plus de 1000 adresses référencées : restaurants, bars, boutiques, services...
            </p>
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">
              Explorer l&apos;annuaire →
            </a>
          </div>

          {/* Événements */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold mb-2">Événements</h3>
            <p className="text-gray-600 mb-4">
              Agenda complet : concerts, expositions, festivals, spectacles...
            </p>
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">
              Voir l&apos;agenda →
            </a>
          </div>

          {/* Gastronomie */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">Gastronomie</h3>
            <p className="text-gray-600 mb-4">
              Bouchons lyonnais, restaurants étoilés, bistrots authentiques...
            </p>
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">
              Découvrir →
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
            <p className="text-gray-600 mb-8">
              Recevez chaque semaine le meilleur de Lyon dans votre boîte mail
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">© 2024 Guide de Lyon - Tous droits réservés</p>
          <div className="flex gap-6 justify-center text-sm">
            <a href="#" className="hover:text-blue-400">À propos</a>
            <a href="#" className="hover:text-blue-400">Contact</a>
            <a href="#" className="hover:text-blue-400">Mentions légales</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
