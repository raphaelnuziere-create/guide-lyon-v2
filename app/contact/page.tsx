import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, Briefcase } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-xl opacity-90">Une question, une suggestion ? Nous sommes à votre écoute</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500">
                    <option>Choisir un sujet</option>
                    <option>Question générale</option>
                    <option>Partenariat professionnel</option>
                    <option>Signaler une erreur</option>
                    <option>Suggestion d'amélioration</option>
                    <option>Demande de référencement</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Votre message..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="newsletter" className="rounded" />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    Je souhaite recevoir la newsletter du Guide de Lyon
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
              <div className="space-y-4">
                <details className="border-b pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-green-600">
                    Comment référencer mon établissement ?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Pour référencer votre établissement, utilisez le formulaire de contact en sélectionnant "Demande de référencement" 
                    ou créez directement un compte professionnel depuis notre espace dédié.
                  </p>
                </details>
                <details className="border-b pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-green-600">
                    Comment modifier les informations de mon établissement ?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Connectez-vous à votre espace professionnel pour modifier directement vos informations. 
                    Si vous n'avez pas encore de compte, contactez-nous avec les justificatifs nécessaires.
                  </p>
                </details>
                <details className="border-b pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-green-600">
                    Proposez-vous des espaces publicitaires ?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Oui, nous proposons différentes formules de mise en avant. Contactez notre équipe commerciale 
                    pour recevoir notre plaquette tarifaire et discuter de vos besoins.
                  </p>
                </details>
                <details className="border-b pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-green-600">
                    Comment signaler une erreur ou un contenu inapproprié ?
                  </summary>
                  <p className="mt-3 text-gray-600">
                    Utilisez le formulaire de contact en sélectionnant "Signaler une erreur" et décrivez précisément 
                    le problème rencontré. Notre équipe traitera votre demande dans les plus brefs délais.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">contact@guide-de-lyon.fr</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <p className="text-gray-600">04 78 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p className="text-gray-600">Lyon, France</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold">Horaires</p>
                    <p className="text-gray-600">Lun-Ven: 9h-18h</p>
                    <p className="text-gray-600">Sam: 10h-16h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition">
                  <Users className="h-5 w-5" />
                  <span>Espace professionnel</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition">
                  <Briefcase className="h-5 w-5" />
                  <span>Devenir partenaire</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition">
                  <MessageSquare className="h-5 w-5" />
                  <span>Centre d'aide</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
                  f
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition">
                  i
                </a>
                <a href="#" className="w-10 h-10 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition">
                  t
                </a>
                <a href="#" className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition">
                  y
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}