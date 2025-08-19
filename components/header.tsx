'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@guide-de-lyon/ui';
import { Menu, X, MapPin, Heart, Mail } from 'lucide-react';
import { GlobalSearch } from './global-search';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { key: 'news', label: 'Actualités', href: '/actualites' },
    { key: 'directory', label: 'Annuaire', href: '/annuaire' },
    { key: 'events', label: 'Événements', href: '/evenements' },
    { key: 'calendar', label: 'Calendrier', href: '/calendrier' },
    { key: 'accommodation', label: 'Hébergement', href: '/hebergement' },
    { key: 'restaurants', label: 'Restauration', href: '/restauration' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold">Guide de Lyon</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.key}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <GlobalSearch />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Newsletter Button */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/newsletter">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Newsletter</span>
              </Link>
            </Button>
            
            {/* Favorites Button */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/favoris">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Mes favoris</span>
              </Link>
            </Button>
            
            {/* CTA Button */}
            <Button asChild className="hidden md:inline-flex">
              <Link href="/referencer">Référencer mon établissement</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <GlobalSearch />
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t">
            <nav className="py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile CTA */}
                <div className="px-4 py-2">
                  <Button asChild className="w-full">
                    <Link 
                      href="/referencer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Référencer mon établissement
                    </Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}