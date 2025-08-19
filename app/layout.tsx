import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guide de Lyon - Le guide complet de la capitale des Gaules",
  description: "Découvrez les meilleurs restaurants, événements, et lieux incontournables de Lyon. Votre guide local pour explorer la ville.",
  keywords: "Lyon, guide, restaurants, événements, tourisme, gastronomie, culture",
  openGraph: {
    title: "Guide de Lyon",
    description: "Le guide complet pour découvrir Lyon",
    url: "https://guide-de-lyon.fr",
    siteName: "Guide de Lyon",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        {/* Navigation Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b-2 border-red-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold text-red-600">
                🦁 Guide de Lyon
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/annuaire" className="hover:text-red-600 transition font-medium">
                  Annuaire
                </Link>
                <Link href="/evenements" className="hover:text-red-600 transition font-medium">
                  Événements
                </Link>
                <Link href="/restaurants" className="hover:text-red-600 transition font-medium">
                  Restaurants
                </Link>
                <Link href="/blog" className="hover:text-red-600 transition font-medium">
                  Blog
                </Link>
                <Link href="/contact" className="hover:text-red-600 transition font-medium">
                  Contact
                </Link>
                <Link href="/dashboard" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                  Espace Pro
                </Link>
              </nav>
              <button className="md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        {children}
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              {/* About */}
              <div>
                <h3 className="text-xl font-bold mb-4">Guide de Lyon</h3>
                <p className="text-gray-400 mb-4">
                  Votre guide local pour découvrir le meilleur de Lyon : restaurants, événements, culture et bien plus.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                    f
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                    i
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                    t
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Découvrir</h4>
                <ul className="space-y-2">
                  <li><Link href="/annuaire" className="text-gray-400 hover:text-white transition">Annuaire</Link></li>
                  <li><Link href="/restaurants" className="text-gray-400 hover:text-white transition">Restaurants</Link></li>
                  <li><Link href="/evenements" className="text-gray-400 hover:text-white transition">Événements</Link></li>
                  <li><Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                </ul>
              </div>
              
              {/* Services */}
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Espace Pro</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Publicité</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Partenariat</a></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                </ul>
              </div>
              
              {/* Newsletter */}
              <div>
                <h4 className="font-semibold mb-4">Newsletter</h4>
                <p className="text-gray-400 mb-4">
                  Recevez les dernières actualités lyonnaises
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:bg-gray-700"
                  />
                  <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                    OK
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div>
                © 2025 Guide de Lyon. Tous droits réservés.
              </div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition">Mentions légales</a>
                <a href="#" className="hover:text-white transition">Confidentialité</a>
                <a href="#" className="hover:text-white transition">CGU</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
