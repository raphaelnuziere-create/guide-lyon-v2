'use client';

import Link from 'next/link';
import { Separator } from '@guide-de-lyon/ui';
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from 'lucide-react';
import NewsletterForm from '@/components/newsletter-form';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-lg font-bold">Guide de Lyon</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Découvrez les meilleurs lieux et événements de Lyon.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4">Aide</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recevez nos dernières actualités
            </p>
            <NewsletterForm variant="inline" />
            <p className="text-xs text-muted-foreground mt-3">
              <Link href="/newsletter" className="underline hover:text-foreground">
                En savoir plus
              </Link>
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 Guide de Lyon. Tous droits réservés.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link
              href="/plan-du-site"
              className="hover:text-foreground transition-colors"
            >
              Plan du site
            </Link>
            <Link
              href="/sitemap"
              className="hover:text-foreground transition-colors"
            >
              Sitemap
            </Link>
            <Link
              href="/accessibilite"
              className="hover:text-foreground transition-colors"
            >
              Accessibilité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}