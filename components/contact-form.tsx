'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@guide-de-lyon/ui';

interface ContactFormProps {
  locale: string;
}

export function ContactForm({ locale }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
    establishment: '',
    phone: '',
    consent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      alert('Veuillez accepter la politique de confidentialité');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: 'general',
          message: '',
          establishment: '',
          phone: '',
          consent: false
        });
      }, 5000);
    } catch (error) {
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
        <p className="text-muted-foreground">
          Nous vous répondrons dans les plus brefs délais.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="mt-4"
        >
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Nom complet *</label>
          <input
            id="name"
            type="text"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Jean Dupont"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email *</label>
          <input
            id="email"
            type="email"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="jean.dupont@example.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">Sujet *</label>
          <select
            id="subject"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            disabled={isSubmitting}
          >
            <option value="general">Question générale</option>
            <option value="support-pro">Support professionnel</option>
            <option value="error-report">Signaler une erreur</option>
            <option value="partnership">Partenariat</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Téléphone (optionnel)</label>
          <input
            id="phone"
            type="tel"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="06 12 34 56 78"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="establishment" className="text-sm font-medium">Établissement (optionnel)</label>
        <input
          id="establishment"
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.establishment}
          onChange={(e) => setFormData({...formData, establishment: e.target.value})}
          placeholder="Nom de votre établissement"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">Message *</label>
        <textarea
          id="message"
          required
          className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Décrivez votre demande en détail..."
          rows={6}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-start space-x-2">
        <input
          id="consent"
          type="checkbox"
          required
          className="mt-1"
          checked={formData.consent}
          onChange={(e) => setFormData({...formData, consent: e.target.checked})}
          disabled={isSubmitting}
        />
        <label htmlFor="consent" className="text-sm leading-none cursor-pointer">
          J'accepte que mes données soient traitées conformément à la{' '}
          <a href="/politique-de-confidentialite" className="text-primary hover:underline">
            politique de confidentialité
          </a>{' '}*
        </label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Envoyer le message
          </>
        )}
      </Button>
    </form>
  );
}