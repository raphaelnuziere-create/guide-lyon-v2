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
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Guide de Lyon
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/annuaire" className="hover:text-blue-600 transition">
                  Annuaire
                </Link>
                <Link href="/evenements" className="hover:text-blue-600 transition">
                  Événements
                </Link>
                <Link href="/restaurants" className="hover:text-blue-600 transition">
                  Restaurants
                </Link>
                <Link href="/blog" className="hover:text-blue-600 transition">
                  Blog
                </Link>
                <Link href="/contact" className="hover:text-blue-600 transition">
                  Contact
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
      </body>
    </html>
  );
}
