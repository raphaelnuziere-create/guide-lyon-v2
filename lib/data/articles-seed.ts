import type { Article } from '@/types/article';

export const articles: Article[] = [
  {
    id: '1',
    slug: 'nouveau-tramway-t10-lyon-venissieux',
    
    title: 'Le nouveau tramway T10 reliera Lyon à Vénissieux dès 2026',
    excerpt: 'La ligne T10 du tramway lyonnais entrera en service en 2026, offrant une nouvelle connexion directe entre Gerland et Vénissieux.',
    content: `
      Le SYTRAL vient d'annoncer officiellement la mise en service du tramway T10 pour le premier trimestre 2026. Cette nouvelle ligne, attendue depuis plusieurs années, révolutionnera les déplacements dans le sud de la métropole lyonnaise.

      La ligne T10 s'étendra sur 7,2 kilomètres et comprendra 11 stations, reliant le quartier de Gerland à Vénissieux en seulement 25 minutes. Ce projet, d'un montant de 250 millions d'euros, permettra de désengorger les lignes de bus actuellement saturées et offrira une alternative écologique aux déplacements en voiture.

      Les travaux, qui ont débuté en 2023, avancent selon le calendrier prévu. La plateforme du tramway est déjà visible sur plusieurs portions du tracé, notamment au niveau de l'avenue Tony Garnier. Les essais techniques commenceront dès l'automne 2025.

      Cette nouvelle ligne desservira des points stratégiques comme le Biodistrict de Gerland, le campus de l'ENS Lyon, et plusieurs zones d'activités économiques. Elle facilitera également l'accès au stade de Gerland et au parc de Parilly.

      Le T10 sera équipé de rames dernière génération, 100% accessibles et climatisées. La fréquence prévue est d'un tramway toutes les 6 minutes en heure de pointe, permettant de transporter jusqu'à 50 000 voyageurs par jour.

      Les riverains et commerçants impactés par les travaux bénéficient d'un accompagnement spécifique avec des indemnisations et des dispositifs de communication renforcés.
    `,
    
    source: 'manual',
    sourceName: 'Guide de Lyon',
    
    category: 'actualite',
    tags: ['transport', 'tramway', 'mobilité', 'urbanisme', 'Gerland', 'Vénissieux'],
    
    featuredImage: '/images/articles/tramway-t10.jpg',
    
    author: {
      name: 'Marie Dubois',
      bio: 'Journaliste spécialisée en urbanisme et mobilité',
    },
    
    views: 1250,
    likes: 89,
    shares: 34,
    
    seo: {
      title: 'Tramway T10 Lyon-Vénissieux : ouverture 2026',
      description: 'Découvrez tout sur la nouvelle ligne de tramway T10 qui reliera Lyon à Vénissieux en 2026.',
      keywords: ['tramway lyon', 'T10', 'transport lyon', 'vénissieux', 'gerland'],
    },
    
    status: 'published',
    featured: true,
    
    publishedAt: '2024-02-15T10:00:00Z',
    createdAt: '2024-02-14T15:00:00Z',
    updatedAt: '2024-02-15T09:30:00Z',
  },
  {
    id: '2',
    slug: 'halles-paul-bocuse-renovation-2024',
    
    title: 'Les Halles Paul Bocuse font peau neuve : découvrez les nouveautés',
    excerpt: 'Le temple de la gastronomie lyonnaise se modernise avec de nouveaux espaces et commerçants tout en préservant son âme.',
    content: `
      Les Halles de Lyon Paul Bocuse, institution gastronomique incontournable de la capitale des Gaules, viennent d'achever une importante phase de rénovation. Ces travaux, qui se sont étalés sur six mois, ont permis de moderniser les infrastructures tout en préservant l'authenticité du lieu.

      Parmi les principales nouveautés, on note l'installation d'un système de climatisation plus performant et écologique, l'amélioration de l'éclairage avec des LED mettant en valeur les étals, et la création d'espaces de dégustation plus conviviaux. 

      Trois nouveaux commerçants ont également rejoint les 48 artisans déjà présents. Un caviste spécialisé dans les vins naturels du Beaujolais et de la Vallée du Rhône, un fromager affineur proposant des créations exclusives, et un chocolatier pâtissier formé chez les plus grands.

      La Mère Richard, fromagère emblématique des Halles, se réjouit : "Ces aménagements vont permettre d'accueillir nos clients dans de meilleures conditions tout en préservant cette ambiance unique qui fait le charme des Halles."

      Les espaces de restauration sur place ont été repensés avec l'installation de comptoirs design permettant de déguster les produits achetés sur place. Une application mobile a également été lancée pour faciliter les commandes et les livraisons.

      Les Halles accueillent désormais des ateliers de cuisine animés par les commerçants eux-mêmes, permettant de transmettre leur savoir-faire et leurs secrets de fabrication.
    `,
    
    source: 'manual',
    sourceName: 'Guide de Lyon',
    
    category: 'gastronomie',
    tags: ['halles paul bocuse', 'gastronomie', 'commerce', 'rénovation', 'tradition'],
    
    author: {
      name: 'Pierre Martin',
      bio: 'Critique gastronomique et passionné de cuisine lyonnaise',
    },
    
    views: 2340,
    likes: 156,
    shares: 78,
    
    status: 'published',
    featured: true,
    
    publishedAt: '2024-02-14T14:00:00Z',
    createdAt: '2024-02-13T10:00:00Z',
    updatedAt: '2024-02-14T13:45:00Z',
  },
  {
    id: '3',
    slug: 'fete-lumieres-2024-programmation',
    
    title: 'Fête des Lumières 2024 : les premières installations dévoilées',
    excerpt: 'La programmation de la Fête des Lumières 2024 se précise avec des artistes internationaux et des créations spectaculaires.',
    content: `
      La Ville de Lyon a dévoilé les premières installations qui illumineront la cité lors de la prochaine Fête des Lumières, du 5 au 8 décembre 2024. Cette édition s'annonce exceptionnelle avec la participation d'artistes de renommée internationale.

      La Place Bellecour accueillera une œuvre monumentale du collectif japonais TeamLab, spécialisé dans les installations numériques immersives. Les visiteurs pourront interagir avec des projections géantes créant un univers onirique en perpétuel mouvement.

      La Cathédrale Saint-Jean sera sublimée par une création du studio français Spectaculaires, qui avait déjà ébloui le public en 2019. Cette année, ils proposeront un voyage dans le temps retraçant l'histoire de Lyon à travers les siècles.

      Le Parc de la Tête d'Or proposera pour la première fois un parcours lumineux familial avec des installations poétiques et interactives spécialement conçues pour les enfants. L'entrée sera gratuite mais sur réservation pour gérer les flux.

      Une nouveauté cette année : la colline de la Croix-Rousse sera mise en lumière avec un parcours artistique reliant les traboules illuminées. Les habitants du quartier ont été associés à la création de certaines œuvres.

      Plus de 30 installations sont prévues dans toute la ville, avec une attention particulière portée à l'éco-responsabilité. Toutes les installations utiliseront des LED basse consommation et certaines seront alimentées par des panneaux solaires.
    `,
    
    source: 'manual',
    sourceName: 'Guide de Lyon',
    
    category: 'culture',
    tags: ['fête des lumières', 'événement', 'culture', 'tourisme', 'décembre'],
    
    views: 4567,
    likes: 234,
    shares: 189,
    
    status: 'published',
    featured: false,
    
    publishedAt: '2024-02-13T09:00:00Z',
    createdAt: '2024-02-12T16:00:00Z',
    updatedAt: '2024-02-13T08:30:00Z',
  },
  {
    id: '4',
    slug: 'nouveau-musee-guignol-lyon',
    
    title: 'Un nouveau musée dédié à Guignol ouvre ses portes dans le Vieux Lyon',
    excerpt: 'Le célèbre personnage lyonnais a désormais son musée interactif dans le quartier historique de Saint-Jean.',
    content: `
      Guignol, figure emblématique de Lyon créée il y a plus de 200 ans, dispose enfin d'un musée à sa hauteur. Situé rue Saint-Jean, au cœur du Vieux Lyon, ce nouvel espace culturel de 800m² propose une expérience immersive dans l'univers de la marionnette lyonnaise.

      Le musée, qui a nécessité trois ans de travaux et un investissement de 2 millions d'euros, présente une collection exceptionnelle de plus de 300 marionnettes historiques, certaines datant du XIXe siècle. Les visiteurs peuvent découvrir l'histoire de Laurent Mourguet, créateur de Guignol, et l'évolution de ce personnage devenu symbole de l'esprit frondeur lyonnais.

      L'expérience se veut résolument moderne avec des installations interactives permettant aux visiteurs de manipuler des marionnettes virtuelles, des ateliers de création, et même un studio d'enregistrement où petits et grands peuvent doubler des scènes cultes.

      Un théâtre de 80 places propose des spectacles quotidiens, alternant représentations traditionnelles et créations contemporaines. Les artistes locaux sont mis à l'honneur avec une programmation renouvelée chaque mois.

      Le musée comprend également un espace pédagogique dédié aux scolaires, une boutique proposant des marionnettes artisanales fabriquées sur place, et un café-restaurant servant des spécialités lyonnaises.

      L'inauguration officielle aura lieu le 1er mars, avec une semaine d'entrée gratuite pour les Lyonnais.
    `,
    
    source: 'manual',
    sourceName: 'Guide de Lyon',
    
    category: 'culture',
    tags: ['musée', 'guignol', 'patrimoine', 'vieux lyon', 'marionnettes'],
    
    views: 1890,
    likes: 145,
    shares: 67,
    
    status: 'published',
    featured: false,
    
    publishedAt: '2024-02-12T11:00:00Z',
    createdAt: '2024-02-11T14:00:00Z',
    updatedAt: '2024-02-12T10:30:00Z',
  },
  {
    id: '5',
    slug: 'parc-blandan-extension-2024',
    
    title: 'Le Parc Blandan s\'agrandit : 3 hectares supplémentaires d\'espaces verts',
    excerpt: 'Le poumon vert du 7e arrondissement s\'étend avec de nouveaux aménagements écologiques et sportifs.',
    content: `
      Le Parc Sergent Blandan, déjà apprécié des habitants du 7e arrondissement, va bénéficier d'une extension majeure de 3 hectares. Ces nouveaux espaces, qui seront ouverts au public dès juin 2024, comprennent des innovations écologiques et des équipements sportifs de dernière génération.

      L'extension comprendra une forêt urbaine de 8000 m² avec des essences locales résistantes au changement climatique, un jardin partagé de 2000 m² géré par les habitants du quartier, et une zone humide artificielle favorisant la biodiversité.

      Les sportifs ne sont pas oubliés avec l'installation d'un parcours de trail urbain de 2 km, d'un mur d'escalade en accès libre de 12 mètres de hauteur, et d'espaces de fitness outdoor équipés d'agrès connectés permettant de suivre ses performances via une application.

      Un amphithéâtre de verdure pouvant accueillir 500 personnes sera créé pour des événements culturels en plein air. La programmation estivale prévoit déjà des concerts, des séances de cinéma en plein air et des spectacles de danse.

      L'ensemble du parc sera équipé d'un éclairage intelligent s'adaptant à la fréquentation et respectueux de la faune nocturne. Des toilettes sèches et des fontaines à eau ont été installées tous les 300 mètres.

      Cette extension s'inscrit dans le plan "Lyon 2030 - Ville Nature" visant à créer un espace vert accessible à moins de 300 mètres pour chaque habitant.
    `,
    
    source: 'manual',
    sourceName: 'Guide de Lyon',
    
    category: 'lifestyle',
    tags: ['parc', 'environnement', 'urbanisme', 'sport', '7e arrondissement'],
    
    views: 1234,
    likes: 98,
    shares: 45,
    
    status: 'published',
    featured: false,
    
    publishedAt: '2024-02-11T08:00:00Z',
    createdAt: '2024-02-10T17:00:00Z',
    updatedAt: '2024-02-11T07:45:00Z',
  },
];