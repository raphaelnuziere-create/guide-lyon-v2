'use client';

import { useState } from 'react';
import { Button } from '@guide-de-lyon/ui';
import { loadStripe } from '@stripe/stripe-js';

// Charger Stripe (côté client uniquement)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutButtonProps {
  priceId: string;
  planType: 'basic' | 'premium' | 'elite';
  establishmentId?: string;
  userEmail?: string;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
}

export function StripeCheckoutButton({
  priceId,
  planType,
  establishmentId = 'demo-establishment',
  userEmail = 'client@example.com',
  buttonText = 'S\'abonner',
  className,
  variant = 'default',
  size = 'default',
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Créer la session de checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planType,
          establishmentId,
          userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session');
      }

      const { sessionId, url } = await response.json();

      if (url) {
        // Rediriger directement vers Stripe Checkout
        window.location.href = url;
      } else if (sessionId) {
        // Ou utiliser Stripe.js pour rediriger
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe non chargé');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }
    } catch (err) {
      console.error('Erreur checkout:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoading ? 'Chargement...' : buttonText}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}