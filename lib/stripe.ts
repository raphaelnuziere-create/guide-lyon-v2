import Stripe from 'stripe';

// Configuration Stripe côté serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Plans de tarification
export const PRICING_PLANS = {
  basic: {
    name: 'Basic',
    price: 29,
    priceId: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
    features: [
      'Badge "Établissement Vérifié"',
      'Fiche détaillée complète',
      'Jusqu\'à 10 photos',
      'Lien vers site web et réseaux',
      'Horaires détaillés par service',
      'Position améliorée dans l\'annuaire',
      'Statistiques de base',
      'Support prioritaire',
    ],
  },
  premium: {
    name: 'Premium',
    price: 79,
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    features: [
      'Tout le plan Basic +',
      'Badge "Premium" doré',
      'Mise en avant "À la une"',
      'Galerie illimitée',
      'Publication d\'événements',
      'Système de réservation',
      'Avis clients avec modération',
      'Statistiques avancées',
      'Widget pour votre site',
      'Newsletter mensuelle incluse',
      'Support téléphonique',
    ],
  },
  elite: {
    name: 'Elite',
    price: 149,
    priceId: process.env.STRIPE_PRICE_ELITE_MONTHLY || '',
    features: [
      'Tout le plan Premium +',
      'Badge "Elite" exclusif',
      'Top position garantie',
      'Page d\'accueil (rotation)',
      'Articles sponsorisés',
      'Campagnes email dédiées',
      'Vidéos et tours virtuels',
      'API pour synchronisation',
      'Account manager dédié',
      'Formation marketing incluse',
      'Rapports personnalisés',
      'Accès événements VIP',
    ],
  },
};