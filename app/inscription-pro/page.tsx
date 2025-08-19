'use client'

import { useState } from 'react'
import { Building2, MapPin, Clock, Camera, ChevronRight, ChevronLeft, Check, Info } from 'lucide-react'
import Link from 'next/link'

interface FormData {
  // Étape 1
  establishmentName: string
  category: string
  siret: string
  phone: string
  email: string
  
  // Étape 2
  address: string
  zipCode: string
  city: string
  district: string
  
  // Étape 3
  description: string
  specialties: string[]
  hours: Record<string, { open: string; close: string; closed: boolean }>
  
  // Étape 4
  photos: string[]
  website: string
  facebook: string
  instagram: string
  priceRange: string
}

const categories = [
  'Restaurant', 'Bar', 'Café', 'Boulangerie', 'Boutique', 
  'Salon de coiffure', 'Spa', 'Salle de sport', 'Hôtel', 
  'Musée', 'Théâtre', 'Cinéma', 'Autre'
]

const districts = [
  '1er - Centre', '2e - Confluence', '3e - Part-Dieu',
  '4e - Croix-Rousse', '5e - Vieux Lyon', '6e - Tête d\'Or',
  '7e - Guillotière', '8e - Monplaisir', '9e - Vaise'
]

const specialties = [
  'Cuisine française', 'Cuisine italienne', 'Cuisine asiatique',
  'Végétarien', 'Vegan', 'Bio', 'Local', 'Fait maison',
  'Terrasse', 'Wifi gratuit', 'Accessible PMR', 'Parking'
]

export default function InscriptionProPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    establishmentName: '',
    category: '',
    siret: '',
    phone: '',
    email: '',
    address: '',
    zipCode: '',
    city: 'Lyon',
    district: '',
    description: '',
    specialties: [],
    hours: {
      lundi: { open: '09:00', close: '18:00', closed: false },
      mardi: { open: '09:00', close: '18:00', closed: false },
      mercredi: { open: '09:00', close: '18:00', closed: false },
      jeudi: { open: '09:00', close: '18:00', closed: false },
      vendredi: { open: '09:00', close: '18:00', closed: false },
      samedi: { open: '09:00', close: '18:00', closed: false },
      dimanche: { open: '09:00', close: '18:00', closed: true },
    },
    photos: [],
    website: '',
    facebook: '',
    instagram: '',
    priceRange: '€€'
  })

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    console.log('Inscription soumise:', formData)
    // Ici, envoi vers l'API
    alert('Inscription envoyée ! Nous vous contacterons sous 48h.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Inscription Professionnelle</h1>
          <p className="text-red-100">Référencez votre établissement sur le Guide de Lyon</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${currentStep >= step 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-600'}
                `}>
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-20 h-1 mx-2 ${
                    currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-3xl mx-auto mt-2 text-sm">
            <span className={currentStep >= 1 ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Informations
            </span>
            <span className={currentStep >= 2 ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Localisation
            </span>
            <span className={currentStep >= 3 ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Détails
            </span>
            <span className={currentStep >= 4 ? 'text-red-600 font-medium' : 'text-gray-500'}>
              Photos
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            
            {/* Étape 1: Informations */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Informations de l'établissement</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'établissement *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Restaurant Le Gourmet"
                    value={formData.establishmentName}
                    onChange={(e) => setFormData({...formData, establishmentName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro SIRET
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="123 456 789 00012"
                    value={formData.siret}
                    onChange={(e) => setFormData({...formData, siret: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="04 78 00 00 00"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="contact@restaurant.fr"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2: Localisation */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Localisation</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="15 rue de la République"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="69002"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                      value="Lyon"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arrondissement *
                    </label>
                    <select 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                    >
                      <option value="">Sélectionnez</option>
                      {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Carte de localisation</span>
                </div>
              </div>
            )}

            {/* Étape 3: Détails */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Détails de l'établissement</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="Décrivez votre établissement, son ambiance, ses spécialités..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialités et services
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialties.map(spec => (
                      <label key={spec} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(spec)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, specialties: [...formData.specialties, spec]})
                            } else {
                              setFormData({...formData, specialties: formData.specialties.filter(s => s !== spec)})
                            }
                          }}
                          className="rounded text-red-600"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horaires d'ouverture
                  </label>
                  <div className="space-y-2">
                    {Object.entries(formData.hours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="w-24 text-sm capitalize">{day}</span>
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              hours: {
                                ...formData.hours,
                                [day]: { ...hours, closed: !e.target.checked }
                              }
                            })
                          }}
                        />
                        {!hours.closed && (
                          <>
                            <input
                              type="time"
                              value={hours.open}
                              className="px-2 py-1 border rounded"
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  hours: {
                                    ...formData.hours,
                                    [day]: { ...hours, open: e.target.value }
                                  }
                                })
                              }}
                            />
                            <span>à</span>
                            <input
                              type="time"
                              value={hours.close}
                              className="px-2 py-1 border rounded"
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  hours: {
                                    ...formData.hours,
                                    [day]: { ...hours, close: e.target.value }
                                  }
                                })
                              }}
                            />
                          </>
                        )}
                        {hours.closed && <span className="text-gray-500 text-sm">Fermé</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Étape 4: Photos et finalisation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Photos et réseaux sociaux</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos de l'établissement
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition cursor-pointer">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Cliquez pour ajouter des photos</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG jusqu'à 5MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                    placeholder="https://www.mon-etablissement.fr"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="facebook.com/monpage"
                      value={formData.facebook}
                      onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                      placeholder="@moncompte"
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gamme de prix
                  </label>
                  <div className="flex gap-4">
                    {['€', '€€', '€€€', '€€€€'].map(price => (
                      <button
                        key={price}
                        onClick={() => setFormData({...formData, priceRange: price})}
                        className={`px-6 py-2 rounded-lg border-2 transition ${
                          formData.priceRange === price
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-medium">
                        Validation sous 48h
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Notre équipe vérifiera votre inscription et vous contactera pour finaliser votre compte professionnel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Précédent
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Suivant
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Valider l'inscription
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}