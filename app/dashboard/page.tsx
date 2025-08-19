'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, Store, Calendar, Users, Star, BarChart3, 
  Settings, Bell, Plus, Edit, Eye, Trash2, TrendingUp, 
  MapPin, Clock, Euro, ChevronRight, Search
} from 'lucide-react'
import Link from 'next/link'

// Données de démonstration
const stats = [
  { label: 'Vues ce mois', value: '12,543', change: '+12%', icon: Eye },
  { label: 'Clients contactés', value: '234', change: '+8%', icon: Users },
  { label: 'Note moyenne', value: '4.8', change: '+0.2', icon: Star },
  { label: 'Chiffre généré', value: '45,678€', change: '+23%', icon: Euro }
]

const recentActivities = [
  { type: 'review', text: 'Nouveau avis 5 étoiles de Marie D.', time: 'Il y a 2h' },
  { type: 'contact', text: 'Demande de réservation pour 8 personnes', time: 'Il y a 4h' },
  { type: 'view', text: 'Votre fiche a été vue 45 fois aujourd\'hui', time: 'Il y a 6h' },
  { type: 'update', text: 'Mise à jour des horaires validée', time: 'Hier' }
]

const establishments = [
  {
    id: 1,
    name: 'Restaurant Le Gourmet',
    type: 'Restaurant',
    address: '15 rue de la République, Lyon 2e',
    status: 'active',
    views: 1234,
    rating: 4.7
  },
  {
    id: 2,
    name: 'Boutique Artisanale',
    type: 'Commerce',
    address: '28 rue des Artisans, Lyon 1er',
    status: 'pending',
    views: 567,
    rating: 4.9
  }
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Espace Pro</h2>
            <p className="text-sm text-gray-600 mt-1">Restaurant Le Gourmet</p>
          </div>
          
          <nav className="px-4 pb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'overview' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Vue d'ensemble
            </button>
            
            <button
              onClick={() => setActiveTab('establishments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'establishments' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <Store className="h-5 w-5" />
              Mes établissements
            </button>
            
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'events' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5" />
              Événements
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'analytics' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Statistiques
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'reviews' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <Star className="h-5 w-5" />
              Avis clients
            </button>
            
            <hr className="my-4" />
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'settings' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              Paramètres
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Tableau de bord'}
                {activeTab === 'establishments' && 'Mes établissements'}
                {activeTab === 'events' && 'Mes événements'}
                {activeTab === 'analytics' && 'Statistiques'}
                {activeTab === 'reviews' && 'Avis clients'}
                {activeTab === 'settings' && 'Paramètres'}
              </h1>
              <p className="text-gray-600 mt-1">Gérez votre présence sur Guide de Lyon</p>
            </div>
            
            <div className="flex gap-3">
              <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Bell className="h-5 w-5" />
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle annonce
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="h-8 w-8 text-red-600" />
                      <span className={`text-sm font-semibold ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Activité récente</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-gray-900">{activity.text}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">Actions rapides</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
                        <span>Mettre à jour les horaires</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
                        <span>Ajouter des photos</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
                        <span>Créer une promotion</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition flex items-center justify-between">
                        <span>Répondre aux avis</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Establishments Tab */}
          {activeTab === 'establishments' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Vos établissements</h2>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Ajouter un établissement
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {establishments.map((establishment) => (
                    <div key={establishment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{establishment.name}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              establishment.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {establishment.status === 'active' ? 'Actif' : 'En attente'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {establishment.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {establishment.views} vues
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              {establishment.rating}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="p-2 border rounded-lg hover:bg-gray-100">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 border rounded-lg hover:bg-gray-100">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 border rounded-lg hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs can be implemented similarly */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Section Événements en construction...</p>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Section Statistiques en construction...</p>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Section Avis clients en construction...</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Section Paramètres en construction...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}