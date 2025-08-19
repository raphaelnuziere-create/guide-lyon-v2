'use client'

import { useState } from 'react'
import { Check, X, Star, Trophy, Crown, Shield, ChevronRight, Building2, TrendingUp, Users, Award } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'GRATUIT',
    price: '0€',
    period: '',
    description: 'Pour découvrir le Guide de Lyon',
    color: 'gray',
    badge: null,
    features: [
      { text: 'Fiche établissement basique', included: true },
      { text: 'Adresse et contact', included: true },
      { text: '1 photo maximum', included: true },
      { text: 'Position standard dans l\'annuaire', included: true },
      { text: 'Statistiques de base', included: false },
      { text: 'Badge vérifié', included: false },
      { text: 'Support prioritaire', included: false },
      { text: 'Mise en avant', included: false },
      { text: 'Événements', included: false },
      { text: 'Newsletter', included: false },
      { text: 'Articles sponsorisés', included: false },
      { text: 'Account manager', included: false }
    ]
  },
  {
    name: 'BASIC',
    price: '29€',
    period: '/mois',
    description: 'Pour les petits commerces',
    color: 'blue',
    badge: 'Vérifié',
    features: [
      { text: 'Tout du plan Gratuit', included: true },
      { text: 'Badge "Établissement Vérifié"', included: true },
      { text: 'Jusqu\'à 10 photos', included: true },
      { text: 'Statistiques détaillées', included: true },
      { text: 'Support prioritaire', included: true },
      { text: '1 événement par mois', included: true },
      { text: 'Mise en avant standard', included: false },
      { text: 'Newsletter mensuelle', included: false },
      { text: 'Articles sponsorisés', included: false },
      { text: 'Position premium', included: false },
      { text: 'Page d\'accueil', included: false },
      { text: 'Account manager', included: false }
    ]
  },
  {
    name: 'PREMIUM',
    price: '79€',
    period: '/mois',
    description: 'Le plus populaire',
    color: 'violet',
    badge: 'Premium',
    popular: true,
    features: [
      { text: 'Tout du plan Basic', included: true },
      { text: 'Badge "Premium" doré', included: true },
      { text: 'Galerie photos illimitée', included: true },
      { text: 'Mise en avant "À la une"', included: true },
      { text: 'Système de réservation', included: true },
      { text: '5 événements par mois', included: true },
      { text: 'Newsletter mensuelle incluse', included: true },
      { text: 'Statistiques avancées', included: true },
      { text: '2 articles sponsorisés/mois', included: true },
      { text: 'Position prioritaire', included: false },
      { text: 'Page d\'accueil (rotation)', included: false },
      { text: 'Account manager', included: false }
    ]
  },
  {
    name: 'ELITE',
    price: '149€',
    period: '/mois',
    description: 'Pour les leaders du marché',
    color: 'gradient',
    badge: 'Elite',
    features: [
      { text: 'Tout du plan Premium', included: true },
      { text: 'Badge "Elite" exclusif', included: true },
      { text: 'Top position garantie', included: true },
      { text: 'Page d\'accueil (rotation)', included: true },
      { text: 'Événements illimités', included: true },
      { text: 'Articles sponsorisés illimités', included: true },
      { text: 'Newsletter hebdomadaire', included: true },
      { text: 'Account manager dédié', included: true },
      { text: 'Accès événements VIP Lyon', included: true },
      { text: 'Rapport mensuel personnalisé', included: true },
      { text: 'Formation marketing digital', included: true },
      { text: 'Support téléphonique 24/7', included: true }
    ]
  }
]

const testimonials = [
  {
    name: 'Restaurant Le Gourmet',
    plan: 'Premium',
    text: 'Depuis que nous sommes passés au plan Premium, notre visibilité a augmenté de 300%. Les réservations en ligne sont un vrai plus !',
    author: 'Marie Dubois',
    role: 'Propriétaire'
  },
  {
    name: 'Boutique Artisanale',
    plan: 'Basic',
    text: 'Le plan Basic nous convient parfaitement. Le badge vérifié rassure nos clients et les statistiques nous aident à mieux comprendre notre audience.',
    author: 'Jean Martin',
    role: 'Gérant'
  },
  {
    name: 'Hôtel Belle Vue',
    plan: 'Elite',
    text: 'L\'account manager dédié fait toute la différence. Notre présence sur la page d\'accueil nous apporte 50% de nos nouveaux clients.',
    author: 'Sophie Laurent',
    role: 'Directrice'
  }
]

export default function ReferencerPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const getPlanColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-50'
      case 'violet': return 'border-primary-500 bg-primary-50'
      case 'gradient': return 'bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600 text-white'
      default: return 'border-gray-300'
    }
  }

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case 'Vérifié': return 'bg-blue-500 text-white'
      case 'Premium': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'Elite': return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec gradient bleu/violet */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Référencez votre établissement
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez plus de 500 établissements lyonnais et boostez votre visibilité
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
                <div className="text-3xl font-bold mb-2">+250%</div>
                <p className="text-blue-100">de visibilité moyenne</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
                <div className="text-3xl font-bold mb-2">45K+</div>
                <p className="text-blue-100">visiteurs mensuels</p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
                <div className="text-3xl font-bold mb-2">98%</div>
                <p className="text-blue-100">de satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toggle Mensuel/Annuel */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center gap-4">
          <span className={billingPeriod === 'monthly' ? 'font-semibold' : 'text-gray-500'}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-16 h-8 bg-gray-300 rounded-full transition-colors duration-300"
          >
            <div className={`absolute top-1 ${billingPeriod === 'monthly' ? 'left-1' : 'left-9'} w-6 h-6 bg-white rounded-full transition-transform duration-300`} />
          </button>
          <span className={billingPeriod === 'yearly' ? 'font-semibold' : 'text-gray-500'}>
            Annuel
            <span className="ml-2 text-green-600 font-semibold">-20%</span>
          </span>
        </div>
      </div>

      {/* Plans de tarification */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-2xl ${
                plan.popular ? 'scale-105 shadow-2xl' : 'shadow-lg'
              } ${plan.color === 'gradient' ? '' : 'bg-white'} overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-bold z-10">
                  Le plus populaire
                </div>
              )}
              
              <div className={`p-6 ${plan.color === 'gradient' ? 'bg-gradient-primary text-white' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-2xl font-bold ${plan.color === 'gradient' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(plan.badge)}`}>
                      {plan.badge}
                    </span>
                  )}
                </div>
                
                <div className="mb-2">
                  <span className={`text-4xl font-bold ${plan.color === 'gradient' ? 'text-white' : 'text-gray-900'}`}>
                    {billingPeriod === 'yearly' && plan.price !== '0€' 
                      ? `${Math.floor(parseInt(plan.price) * 0.8)}€`
                      : plan.price
                    }
                  </span>
                  {plan.period && (
                    <span className={`${plan.color === 'gradient' ? 'text-white/80' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                
                <p className={`text-sm mb-6 ${plan.color === 'gradient' ? 'text-white/90' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.slice(0, 8).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className={`h-5 w-5 mt-0.5 ${plan.color === 'gradient' ? 'text-green-300' : 'text-green-500'}`} />
                      ) : (
                        <X className={`h-5 w-5 mt-0.5 ${plan.color === 'gradient' ? 'text-white/30' : 'text-gray-300'}`} />
                      )}
                      <span className={`text-sm ${
                        feature.included 
                          ? plan.color === 'gradient' ? 'text-white' : 'text-gray-700'
                          : plan.color === 'gradient' ? 'text-white/50' : 'text-gray-400'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/inscription-pro"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition ${
                    plan.color === 'gradient'
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : plan.popular
                      ? 'bg-gradient-primary text-white hover:opacity-90'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price === '0€' ? 'Commencer gratuitement' : 'Choisir ce plan'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Témoignages */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ils nous font confiance</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.author} - {testimonial.role}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                    Plan {testimonial.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à booster votre visibilité ?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Commencez gratuitement et évoluez selon vos besoins
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inscription-pro" className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              Démarrer maintenant
            </Link>
            <Link href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
              Parler à un conseiller
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}