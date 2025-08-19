export const WORDPRESS_REDIRECTS = [
  // Articles populaires avec autorité SEO
  {
    source: '/decouvrir-lyon-guide-complet',
    destination: '/blog/decouvrir-lyon-guide-complet',
    permanent: true,
  },
  {
    source: '/restaurants-lyon-meilleures-adresses',
    destination: '/restauration',
    permanent: true,
  },
  {
    source: '/visiter-lyon-3-jours',
    destination: '/blog/visiter-lyon-3-jours',
    permanent: true,
  },
  {
    source: '/vieux-lyon-quartier-historique',
    destination: '/blog/vieux-lyon-quartier-historique',
    permanent: true,
  },
  {
    source: '/musees-lyon-gratuits',
    destination: '/culture/musees',
    permanent: true,
  },
  {
    source: '/fete-des-lumieres-lyon',
    destination: '/evenements/fete-des-lumieres',
    permanent: true,
  },
  {
    source: '/bouchons-lyonnais-traditionnels',
    destination: '/restauration/bouchons-lyonnais',
    permanent: true,
  },
  {
    source: '/parc-tete-or-lyon',
    destination: '/loisirs/parc-tete-or',
    permanent: true,
  },
  {
    source: '/confluence-quartier-moderne',
    destination: '/quartiers/confluence',
    permanent: true,
  },
  {
    source: '/croix-rousse-quartier-canuts',
    destination: '/quartiers/croix-rousse',
    permanent: true,
  },
  
  // Catégories WordPress
  {
    source: '/category/restaurants',
    destination: '/restauration',
    permanent: true,
  },
  {
    source: '/category/hotels',
    destination: '/hebergement',
    permanent: true,
  },
  {
    source: '/category/culture',
    destination: '/culture',
    permanent: true,
  },
  {
    source: '/category/evenements',
    destination: '/evenements',
    permanent: true,
  },
  {
    source: '/category/tourisme',
    destination: '/tourisme',
    permanent: true,
  },
  {
    source: '/category/vie-nocturne',
    destination: '/vie-nocturne',
    permanent: true,
  },
  {
    source: '/category/shopping',
    destination: '/shopping',
    permanent: true,
  },
  
  // Pages WordPress standards
  {
    source: '/about',
    destination: '/a-propos',
    permanent: true,
  },
  {
    source: '/contact',
    destination: '/contact',
    permanent: true,
  },
  {
    source: '/mentions-legales',
    destination: '/mentions-legales',
    permanent: true,
  },
  {
    source: '/privacy-policy',
    destination: '/politique-de-confidentialite',
    permanent: true,
  },
  {
    source: '/sitemap_index.xml',
    destination: '/sitemap.xml',
    permanent: true,
  },
  
  // Archives WordPress
  {
    source: '/archives/:year/:month',
    destination: '/blog/archives/:year/:month',
    permanent: true,
  },
  {
    source: '/author/:author',
    destination: '/blog/auteur/:author',
    permanent: true,
  },
  {
    source: '/tag/:tag',
    destination: '/blog/tag/:tag',
    permanent: true,
  },
  
  // Patterns WordPress
  {
    source: '/:year(\\d{4})/:month(\\d{2})/:slug',
    destination: '/blog/:slug',
    permanent: true,
  },
  {
    source: '/blog/page/:page',
    destination: '/blog?page=:page',
    permanent: true,
  },
  
  // Media et uploads
  {
    source: '/wp-content/uploads/:path*',
    destination: '/images/:path*',
    permanent: true,
  },
  
  // Pages d'administration (sécurité)
  {
    source: '/wp-admin',
    destination: '/',
    permanent: true,
  },
  {
    source: '/wp-login.php',
    destination: '/auth/login',
    permanent: true,
  },
  {
    source: '/xmlrpc.php',
    destination: '/',
    permanent: true,
  },
]

export const PRESERVED_URLS = [
  '/decouvrir-lyon-guide-complet',
  '/restaurants-lyon-meilleures-adresses',
  '/visiter-lyon-3-jours',
  '/vieux-lyon-quartier-historique',
  '/musees-lyon-gratuits',
  '/fete-des-lumieres-lyon',
  '/bouchons-lyonnais-traditionnels',
  '/parc-tete-or-lyon',
  '/confluence-quartier-moderne',
  '/croix-rousse-quartier-canuts',
]

export function isPreservedURL(path: string): boolean {
  return PRESERVED_URLS.some(url => path.startsWith(url))
}

export function getRedirectForPath(path: string): string | null {
  const redirect = WORDPRESS_REDIRECTS.find(r => {
    if (r.source.includes(':')) {
      const pattern = r.source
        .replace(/:year\(\\d\{4\}\)/g, '\\d{4}')
        .replace(/:month\(\\d\{2\}\)/g, '\\d{2}')
        .replace(/:slug/g, '[^/]+')
        .replace(/:path\*/g, '.*')
        .replace(/:page/g, '\\d+')
        .replace(/:author/g, '[^/]+')
        .replace(/:tag/g, '[^/]+')
      
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(path)
    }
    return r.source === path
  })
  
  return redirect?.destination || null
}