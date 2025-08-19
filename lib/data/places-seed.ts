import type { Place } from '@/types';

export const places: Place[] = [
  // Restaurants
  {
    id: '1',
    name: 'Le Bouchon des Filles',
    slug: 'le-bouchon-des-filles',
    category: 'restaurant',
    description: 'Bouchon lyonnais authentique tenu par deux sœurs passionnées. Cuisine traditionnelle revisitée avec des produits locaux.',
    address: {
      street: '20 rue Sergent Blandan',
      district: 1,
      postalCode: '69001',
      city: 'Lyon',
      lat: 45.7699,
      lng: 4.8301
    },
    contact: {
      phone: '04 78 30 40 44',
      email: 'contact@bouchondesfilles.fr',
      website: 'https://bouchondesfilles.fr'
    },
    hours: {
      lundi: 'Fermé',
      mardi: '12h00-14h00, 19h00-22h00',
      mercredi: '12h00-14h00, 19h00-22h00',
      jeudi: '12h00-14h00, 19h00-22h00',
      vendredi: '12h00-14h00, 19h00-23h00',
      samedi: '12h00-14h00, 19h00-23h00',
      dimanche: '12h00-14h30'
    },
    priceRange: '€€',
    rating: 4.5,
    images: ['/images/places/bouchon-filles.jpg'],
    amenities: ['Terrasse', 'Wi-Fi', 'Carte bancaire', 'Réservation'],
    featured: true,
    status: 'active'
  },
  {
    id: '2',
    name: 'Brasserie Georges',
    slug: 'brasserie-georges',
    category: 'restaurant',
    description: 'Institution lyonnaise depuis 1836. Immense brasserie Art Déco servant des plats traditionnels et fruits de mer.',
    address: {
      street: '30 Cours de Verdun',
      district: 2,
      postalCode: '69002',
      city: 'Lyon',
      lat: 45.7485,
      lng: 4.8263
    },
    contact: {
      phone: '04 72 56 54 54',
      email: 'info@brasseriegeorges.com',
      website: 'https://www.brasseriegeorges.com'
    },
    hours: {
      lundi: '11h30-23h00',
      mardi: '11h30-23h00',
      mercredi: '11h30-23h00',
      jeudi: '11h30-23h00',
      vendredi: '11h30-00h00',
      samedi: '11h30-00h00',
      dimanche: '11h30-23h00'
    },
    priceRange: '€€€',
    rating: 4.2,
    images: [],
    amenities: ['Groupes', 'Terrasse', 'Parking', 'Carte bancaire'],
    featured: true,
    status: 'active'
  },
  {
    id: '3',
    name: 'Les Halles de Lyon Paul Bocuse',
    slug: 'halles-lyon-paul-bocuse',
    category: 'shopping',
    description: 'Temple de la gastronomie lyonnaise avec 48 commerçants et artisans. Produits d\'exception et restauration sur place.',
    address: {
      street: '102 Cours Lafayette',
      district: 3,
      postalCode: '69003',
      city: 'Lyon',
      lat: 45.7628,
      lng: 4.8506
    },
    contact: {
      phone: '04 78 62 39 33',
      website: 'https://www.halles-de-lyon-paulbocuse.com'
    },
    hours: {
      lundi: 'Fermé',
      mardi: '07h00-19h00',
      mercredi: '07h00-19h00',
      jeudi: '07h00-19h00',
      vendredi: '07h00-19h00',
      samedi: '07h00-19h00',
      dimanche: '07h00-13h00'
    },
    priceRange: '€€€',
    rating: 4.7,
    images: [],
    amenities: ['Parking', 'Carte bancaire', 'Livraison'],
    featured: true,
    status: 'active'
  },
  {
    id: '4',
    name: 'Hôtel Villa Florentine',
    slug: 'hotel-villa-florentine',
    category: 'hotel',
    description: 'Hôtel 5 étoiles dans un ancien couvent Renaissance. Vue panoramique sur Lyon, spa et restaurant gastronomique.',
    address: {
      street: '25 Montée Saint-Barthélémy',
      district: 5,
      postalCode: '69005',
      city: 'Lyon',
      lat: 45.7640,
      lng: 4.8277
    },
    contact: {
      phone: '04 72 56 56 56',
      email: 'florentine@villaflorentine.com',
      website: 'https://www.villaflorentine.com'
    },
    hours: {
      lundi: '24h/24',
      mardi: '24h/24',
      mercredi: '24h/24',
      jeudi: '24h/24',
      vendredi: '24h/24',
      samedi: '24h/24',
      dimanche: '24h/24'
    },
    priceRange: '€€€€',
    rating: 4.8,
    images: [],
    amenities: ['Wi-Fi', 'Parking', 'Spa', 'Restaurant', 'Bar', 'Salle de sport', 'Climatisation'],
    featured: true,
    status: 'active'
  },
  {
    id: '5',
    name: 'Le Sucre',
    slug: 'le-sucre',
    category: 'bar',
    description: 'Club et rooftop sur les Docks. Programmation électro pointue, vue sur le Rhône et cuisine créative.',
    address: {
      street: '50 Quai Rambaud',
      district: 2,
      postalCode: '69002',
      city: 'Lyon',
      lat: 45.7461,
      lng: 4.8181
    },
    contact: {
      phone: '04 78 37 66 96',
      website: 'https://www.le-sucre.eu'
    },
    hours: {
      lundi: 'Fermé',
      mardi: 'Fermé',
      mercredi: '19h00-01h00',
      jeudi: '19h00-01h00',
      vendredi: '19h00-04h00',
      samedi: '19h00-04h00',
      dimanche: '14h00-22h00'
    },
    priceRange: '€€',
    rating: 4.3,
    images: [],
    amenities: ['Terrasse', 'Wi-Fi', 'Carte bancaire', 'DJ'],
    featured: false,
    status: 'active'
  },
  {
    id: '6',
    name: 'Musée des Confluences',
    slug: 'musee-confluences',
    category: 'culture',
    description: 'Musée de sciences et sociétés dans un bâtiment futuriste. Collections exceptionnelles et expositions temporaires.',
    address: {
      street: '86 Quai Perrache',
      district: 2,
      postalCode: '69002',
      city: 'Lyon',
      lat: 45.7327,
      lng: 4.8182
    },
    contact: {
      phone: '04 28 38 12 12',
      website: 'https://www.museedesconfluences.fr'
    },
    hours: {
      lundi: 'Fermé',
      mardi: '10h30-18h30',
      mercredi: '10h30-18h30',
      jeudi: '10h30-18h30',
      vendredi: '10h30-18h30',
      samedi: '10h00-19h00',
      dimanche: '10h00-19h00'
    },
    priceRange: '€',
    rating: 4.6,
    images: [],
    amenities: ['Parking', 'Boutique', 'Restaurant', 'Accessible PMR', 'Wi-Fi'],
    featured: true,
    status: 'active'
  },
  {
    id: '7',
    name: 'Mama Shelter Lyon',
    slug: 'mama-shelter-lyon',
    category: 'hotel',
    description: 'Hôtel design et décontracté avec rooftop, restaurant et ambiance festive. Décoration signée Philippe Starck.',
    address: {
      street: '13 Rue Domer',
      district: 7,
      postalCode: '69007',
      city: 'Lyon',
      lat: 45.7517,
      lng: 4.8423
    },
    contact: {
      phone: '04 78 02 58 58',
      email: 'lyon@mamashelter.com',
      website: 'https://mamashelter.com/lyon'
    },
    hours: {
      lundi: '24h/24',
      mardi: '24h/24',
      mercredi: '24h/24',
      jeudi: '24h/24',
      vendredi: '24h/24',
      samedi: '24h/24',
      dimanche: '24h/24'
    },
    priceRange: '€€',
    rating: 4.2,
    images: [],
    amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Terrasse', 'Salle de sport', 'Parking'],
    featured: false,
    status: 'active'
  },
  {
    id: '8',
    name: 'Le Comptoir de la Bourse',
    slug: 'comptoir-bourse',
    category: 'bar',
    description: 'Bar à cocktails raffiné dans le quartier des affaires. Ambiance feutrée et mixologie créative.',
    address: {
      street: '2 Rue de la Bourse',
      district: 2,
      postalCode: '69002',
      city: 'Lyon',
      lat: 45.7643,
      lng: 4.8366
    },
    contact: {
      phone: '04 78 42 50 05',
      website: 'https://comptoirdelabourse.com'
    },
    hours: {
      lundi: '17h00-01h00',
      mardi: '17h00-01h00',
      mercredi: '17h00-01h00',
      jeudi: '17h00-02h00',
      vendredi: '17h00-02h00',
      samedi: '17h00-02h00',
      dimanche: 'Fermé'
    },
    priceRange: '€€€',
    rating: 4.4,
    images: [],
    amenities: ['Wi-Fi', 'Carte bancaire', 'Cocktails'],
    featured: false,
    status: 'active'
  },
  {
    id: '9',
    name: 'Parc de la Tête d\'Or',
    slug: 'parc-tete-or',
    category: 'culture',
    description: 'Plus grand parc urbain de France avec lac, zoo gratuit, jardin botanique et roseraie internationale.',
    address: {
      street: 'Place Général Leclerc',
      district: 6,
      postalCode: '69006',
      city: 'Lyon',
      lat: 45.7777,
      lng: 4.8547
    },
    contact: {
      phone: '04 72 69 47 60',
      website: 'https://www.lyon.fr/lieu/parcs/parc-de-la-tete-dor'
    },
    hours: {
      lundi: '06h30-22h30',
      mardi: '06h30-22h30',
      mercredi: '06h30-22h30',
      jeudi: '06h30-22h30',
      vendredi: '06h30-22h30',
      samedi: '06h30-22h30',
      dimanche: '06h30-22h30'
    },
    priceRange: 'Gratuit',
    rating: 4.7,
    images: [],
    amenities: ['Parking', 'Aire de jeux', 'Zoo', 'Lac', 'Accessible PMR'],
    featured: true,
    status: 'active'
  },
  {
    id: '10',
    name: 'Galeries Lafayette Lyon',
    slug: 'galeries-lafayette',
    category: 'shopping',
    description: 'Grand magasin emblématique avec mode, beauté et gastronomie. Architecture remarquable et terrasse panoramique.',
    address: {
      street: '6 Place des Cordeliers',
      district: 2,
      postalCode: '69002',
      city: 'Lyon',
      lat: 45.7631,
      lng: 4.8356
    },
    contact: {
      phone: '04 72 61 44 44',
      website: 'https://www.galerieslafayette.com/m/lyon'
    },
    hours: {
      lundi: '10h00-20h00',
      mardi: '10h00-20h00',
      mercredi: '10h00-20h00',
      jeudi: '10h00-20h00',
      vendredi: '10h00-20h00',
      samedi: '10h00-20h00',
      dimanche: '11h00-19h00'
    },
    priceRange: '€€€',
    rating: 4.1,
    images: [],
    amenities: ['Parking', 'Wi-Fi', 'Carte bancaire', 'Click & Collect'],
    featured: false,
    status: 'active'
  },
  // Ajouter plus d'établissements...
  {
    id: '11',
    name: 'Le Kitchen Café',
    slug: 'kitchen-cafe',
    category: 'restaurant',
    description: 'Restaurant branché avec cuisine fusion et brunch populaire. Décoration industrielle et ambiance décontractée.',
    address: {
      street: '34 Rue Chevreul',
      district: 7,
      postalCode: '69007',
      city: 'Lyon',
      lat: 45.7466,
      lng: 4.8423
    },
    contact: {
      phone: '04 78 72 46 58',
      website: 'https://kitchencafe.fr'
    },
    hours: {
      lundi: '08h00-15h00',
      mardi: '08h00-15h00',
      mercredi: '08h00-15h00',
      jeudi: '08h00-22h00',
      vendredi: '08h00-22h00',
      samedi: '09h00-22h00',
      dimanche: '09h00-16h00'
    },
    priceRange: '€€',
    rating: 4.3,
    images: [],
    amenities: ['Terrasse', 'Wi-Fi', 'Brunch', 'Végétarien'],
    featured: false,
    status: 'active'
  },
  {
    id: '12',
    name: 'Ibis Lyon Centre',
    slug: 'ibis-lyon-centre',
    category: 'hotel',
    description: 'Hôtel économique bien situé, proche de la gare et du centre-ville. Confort simple et tarifs attractifs.',
    address: {
      street: '68 Rue de la République',
      district: 2,
      postalCode: '69002',
      city: 'Lyon',
      lat: 45.7596,
      lng: 4.8343
    },
    contact: {
      phone: '04 78 37 42 58',
      website: 'https://all.accor.com'
    },
    hours: {
      lundi: '24h/24',
      mardi: '24h/24',
      mercredi: '24h/24',
      jeudi: '24h/24',
      vendredi: '24h/24',
      samedi: '24h/24',
      dimanche: '24h/24'
    },
    priceRange: '€',
    rating: 3.8,
    images: [],
    amenities: ['Wi-Fi', 'Climatisation', 'Bar', 'Parking'],
    featured: false,
    status: 'active'
  },
  {
    id: '13',
    name: 'L\'Opéra de Lyon',
    slug: 'opera-lyon',
    category: 'culture',
    description: 'Opéra national dans un bâtiment historique rénové par Jean Nouvel. Programmation éclectique : opéra, ballet, concerts.',
    address: {
      street: '1 Place de la Comédie',
      district: 1,
      postalCode: '69001',
      city: 'Lyon',
      lat: 45.7676,
      lng: 4.8362
    },
    contact: {
      phone: '04 69 85 54 54',
      website: 'https://www.opera-lyon.com'
    },
    hours: {
      lundi: 'Selon programmation',
      mardi: 'Selon programmation',
      mercredi: 'Selon programmation',
      jeudi: 'Selon programmation',
      vendredi: 'Selon programmation',
      samedi: 'Selon programmation',
      dimanche: 'Selon programmation'
    },
    priceRange: '€€€',
    rating: 4.7,
    images: [],
    amenities: ['Bar', 'Vestiaire', 'Accessible PMR', 'Boutique'],
    featured: false,
    status: 'active'
  },
  {
    id: '14',
    name: 'Le Ninkasi Gerland',
    slug: 'ninkasi-gerland',
    category: 'bar',
    description: 'Brasserie artisanale avec restaurant, bar et salle de concert. Bières brassées sur place et burgers gourmets.',
    address: {
      street: '267 Rue Marcel Mérieux',
      district: 7,
      postalCode: '69007',
      city: 'Lyon',
      lat: 45.7295,
      lng: 4.8237
    },
    contact: {
      phone: '04 37 28 28 01',
      website: 'https://ninkasi.fr'
    },
    hours: {
      lundi: '11h30-00h00',
      mardi: '11h30-00h00',
      mercredi: '11h30-00h00',
      jeudi: '11h30-01h00',
      vendredi: '11h30-02h00',
      samedi: '11h30-02h00',
      dimanche: '11h30-00h00'
    },
    priceRange: '€€',
    rating: 4.1,
    images: [],
    amenities: ['Terrasse', 'Wi-Fi', 'Concerts', 'Happy Hour'],
    featured: false,
    status: 'active'
  },
  {
    id: '15',
    name: 'Basilique Notre-Dame de Fourvière',
    slug: 'basilique-fourviere',
    category: 'culture',
    description: 'Basilique emblématique surplombant Lyon. Architecture byzantine, mosaïques dorées et vue panoramique exceptionnelle.',
    address: {
      street: '8 Place de Fourvière',
      district: 5,
      postalCode: '69005',
      city: 'Lyon',
      lat: 45.7623,
      lng: 4.8226
    },
    contact: {
      phone: '04 78 25 86 19',
      website: 'https://www.fourviere.org'
    },
    hours: {
      lundi: '07h00-19h00',
      mardi: '07h00-19h00',
      mercredi: '07h00-19h00',
      jeudi: '07h00-19h00',
      vendredi: '07h00-19h00',
      samedi: '07h00-19h00',
      dimanche: '07h00-19h00'
    },
    priceRange: 'Gratuit',
    rating: 4.8,
    images: [],
    amenities: ['Visite guidée', 'Boutique', 'Accessible PMR', 'Vue panoramique'],
    featured: true,
    status: 'active'
  }
];export const lyonDistricts = [
  { value: '1', label: '1er arrondissement' },
  { value: '2', label: '2ème arrondissement' },
  { value: '3', label: '3ème arrondissement' },
  { value: '4', label: '4ème arrondissement' },
  { value: '5', label: '5ème arrondissement' },
  { value: '6', label: '6ème arrondissement' },
  { value: '7', label: '7ème arrondissement' },
  { value: '8', label: '8ème arrondissement' },
  { value: '9', label: '9ème arrondissement' }
];
