import type { Event } from '@/types/event';

export const events: Event[] = [
  {
    id: '1',
    establishmentId: '1',
    establishmentName: 'Le Bouchon des Filles',
    establishmentSlug: 'le-bouchon-des-filles',
    establishmentSubscription: 'premium',
    
    title: 'Soirée Jazz & Gastronomie',
    slug: 'soiree-jazz-gastronomie',
    description: 'Une soirée exceptionnelle mêlant jazz live et cuisine lyonnaise revisitée',
    longDescription: 'Rejoignez-nous pour une soirée inoubliable où la musique jazz se marie parfaitement avec notre cuisine lyonnaise moderne. Le quartet Jazz de Lyon vous accompagnera tout au long de votre repas avec des standards revisités.',
    
    startDate: '2024-02-20',
    endDate: '2024-02-20',
    startTime: '19:30',
    endTime: '23:00',
    
    category: 'soiree',
    
    location: {
      name: 'Le Bouchon des Filles',
      address: '20 rue Sergent Blandan',
      district: 1,
    },
    
    price: {
      type: 'payant',
      min: 45,
      max: 65,
      details: 'Menu 3 services + concert',
    },
    
    capacity: 50,
    currentReservations: 32,
    
    tags: ['jazz', 'gastronomie', 'musique live', 'bouchon lyonnais'],
    
    registration: {
      required: true,
      phone: '04 78 30 40 44',
      email: 'contact@bouchondesfilles.fr',
    },
    
    visibility: {
      homepage: true,
      calendar: true,
      featured: false,
    },
    
    status: 'published',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    publishedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '2',
    establishmentId: '4',
    establishmentName: 'Hôtel Villa Florentine',
    establishmentSlug: 'hotel-villa-florentine',
    establishmentSubscription: 'elite',
    
    title: 'Dégustation Prestige : Vins de la Vallée du Rhône',
    slug: 'degustation-prestige-vins-rhone',
    description: 'Soirée dégustation exclusive avec les meilleurs vignerons de la région',
    longDescription: 'L\'Hôtel Villa Florentine vous invite à une dégustation exceptionnelle des plus grands vins de la Vallée du Rhône. Notre sommelier et trois vignerons prestigieux vous guideront à travers une sélection exclusive.',
    
    startDate: '2024-02-25',
    endDate: '2024-02-25',
    startTime: '18:00',
    endTime: '21:00',
    
    category: 'gastronomie',
    
    location: {
      name: 'Villa Florentine - Terrasse Panoramique',
      address: '25 Montée Saint-Barthélémy',
      district: 5,
    },
    
    price: {
      type: 'payant',
      min: 120,
      details: 'Dégustation 8 vins + accompagnements gastronomiques',
    },
    
    capacity: 30,
    currentReservations: 24,
    
    tags: ['vin', 'dégustation', 'luxe', 'gastronomie', 'terrasse'],
    
    registration: {
      required: true,
      email: 'events@villaflorentine.com',
      phone: '04 72 56 56 56',
    },
    
    visibility: {
      homepage: true,
      calendar: true,
      featured: true, // Elite -> en top de liste
    },
    
    status: 'published',
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
    publishedAt: '2024-02-05T10:00:00Z',
  },
  {
    id: '3',
    establishmentId: '6',
    establishmentName: 'Musée des Confluences',
    establishmentSlug: 'musee-confluences',
    establishmentSubscription: 'premium',
    
    title: 'Nuit des Musées : Visite Gratuite',
    slug: 'nuit-musees-visite-gratuite',
    description: 'Découvrez le musée gratuitement lors de la Nuit européenne des musées',
    longDescription: 'À l\'occasion de la Nuit européenne des musées, le Musée des Confluences ouvre ses portes gratuitement. Découvrez nos collections permanentes et l\'exposition temporaire "Origines" avec des animations spéciales.',
    
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    startTime: '19:00',
    endTime: '00:00',
    
    category: 'exposition',
    
    location: {
      name: 'Musée des Confluences',
      address: '86 Quai Perrache',
      district: 2,
    },
    
    price: {
      type: 'gratuit',
    },
    
    capacity: 1000,
    currentReservations: 450,
    
    tags: ['musée', 'culture', 'gratuit', 'nocturne', 'famille'],
    
    registration: {
      required: false,
    },
    
    visibility: {
      homepage: true,
      calendar: true,
      featured: false,
    },
    
    status: 'published',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
    publishedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '4',
    establishmentId: '5',
    establishmentName: 'Le Sucre',
    establishmentSlug: 'le-sucre',
    establishmentSubscription: 'basic',
    
    title: 'Rooftop Électro : DJ Set',
    slug: 'rooftop-electro-dj-set',
    description: 'Soirée électro sur le rooftop avec vue sur Lyon',
    
    startDate: '2024-02-22',
    endDate: '2024-02-23',
    startTime: '22:00',
    endTime: '04:00',
    
    category: 'soiree',
    
    location: {
      name: 'Le Sucre - Rooftop',
      address: '50 Quai Rambaud',
      district: 2,
    },
    
    price: {
      type: 'payant',
      min: 15,
      max: 20,
      details: 'Prévente 15€ / Sur place 20€',
    },
    
    capacity: 300,
    currentReservations: 180,
    
    tags: ['électro', 'musique', 'rooftop', 'soirée'],
    
    registration: {
      required: false,
      url: 'https://www.le-sucre.eu/billetterie',
    },
    
    visibility: {
      homepage: true,
      calendar: true,
      featured: false,
    },
    
    status: 'published',
    createdAt: '2024-02-08T10:00:00Z',
    updatedAt: '2024-02-08T10:00:00Z',
    publishedAt: '2024-02-08T10:00:00Z',
  },
  {
    id: '5',
    establishmentId: '9',
    establishmentName: 'Parc de la Tête d\'Or',
    establishmentSlug: 'parc-tete-or',
    establishmentSubscription: 'free',
    
    title: 'Visite Guidée du Jardin Botanique',
    slug: 'visite-guidee-jardin-botanique',
    description: 'Découverte des serres et collections botaniques avec un guide expert',
    
    startDate: '2024-02-18',
    endDate: '2024-02-18',
    startTime: '14:00',
    endTime: '16:00',
    
    category: 'atelier',
    
    location: {
      name: 'Jardin Botanique - Parc de la Tête d\'Or',
      address: 'Place Général Leclerc',
      district: 6,
    },
    
    price: {
      type: 'gratuit',
    },
    
    capacity: 25,
    currentReservations: 18,
    
    tags: ['nature', 'visite', 'gratuit', 'famille', 'botanique'],
    
    registration: {
      required: true,
      email: 'visites@parcdelatete.fr',
    },
    
    visibility: {
      homepage: false, // Plan gratuit : pas visible en page d'accueil
      calendar: false,
      featured: false,
    },
    
    status: 'published',
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z',
    publishedAt: '2024-02-03T10:00:00Z',
  },
  {
    id: '6',
    establishmentId: '13',
    establishmentName: 'L\'Opéra de Lyon',
    establishmentSlug: 'opera-lyon',
    establishmentSubscription: 'elite',
    
    title: 'Carmen de Bizet - Première',
    slug: 'carmen-bizet-premiere',
    description: 'Première représentation de Carmen dans une nouvelle mise en scène contemporaine',
    longDescription: 'L\'Opéra de Lyon présente Carmen de Georges Bizet dans une mise en scène audacieuse et moderne. L\'orchestre de l\'Opéra de Lyon, sous la direction de Daniele Rustioni, accompagne un casting international exceptionnel.',
    
    startDate: '2024-03-01',
    endDate: '2024-03-01',
    startTime: '20:00',
    endTime: '23:00',
    
    category: 'theatre',
    
    location: {
      name: 'Opéra de Lyon',
      address: '1 Place de la Comédie',
      district: 1,
    },
    
    price: {
      type: 'payant',
      min: 25,
      max: 150,
      details: 'De 25€ à 150€ selon catégorie',
    },
    
    capacity: 1100,
    currentReservations: 850,
    
    tags: ['opéra', 'culture', 'musique classique', 'spectacle'],
    
    registration: {
      required: true,
      url: 'https://www.opera-lyon.com/billetterie',
      phone: '04 69 85 54 54',
    },
    
    visibility: {
      homepage: true,
      calendar: true,
      featured: true, // Elite -> priorité
    },
    
    status: 'published',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    publishedAt: '2024-02-01T10:00:00Z',
  },
];