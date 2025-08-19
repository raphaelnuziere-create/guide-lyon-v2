'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button, Card, CardContent } from '@guide-de-lyon/ui';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré:', registration.scope);
          
          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouveau service worker disponible
                  console.log('Nouvelle version disponible');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Erreur Service Worker:', error);
        });
    }

    // Détecter si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Intercepter l'événement d'installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Afficher la bannière après un délai
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallBanner(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Détecter quand l'app est installée
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log('PWA installée');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Afficher le prompt d'installation
    deferredPrompt.prompt();
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Installation acceptée');
    } else {
      console.log('Installation refusée');
    }

    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    // Réafficher dans 7 jours
    const nextShow = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('pwa_banner_next_show', nextShow.toString());
  };

  // Vérifier si on doit afficher la bannière
  useEffect(() => {
    const nextShow = localStorage.getItem('pwa_banner_next_show');
    if (nextShow && Date.now() < parseInt(nextShow)) {
      setShowInstallBanner(false);
    }
  }, []);

  if (!showInstallBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-xl border-2 border-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <Download className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold">Installer l'application</h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Installez Guide de Lyon pour un accès rapide et une expérience optimale, même hors ligne.
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1"
              size="sm"
            >
              Installer
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
            >
              Plus tard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}