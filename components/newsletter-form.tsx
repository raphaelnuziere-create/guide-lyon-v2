'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2, X } from 'lucide-react';
import { Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@guide-de-lyon/ui';
import { useNewsletter } from '@/hooks/use-newsletter';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  variant?: 'inline' | 'expanded' | 'modal';
  showPreferences?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export default function NewsletterForm({
  variant = 'inline',
  showPreferences = false,
  className,
  title = 'Restez informé',
  description = 'Recevez les dernières actualités de Lyon directement dans votre boîte mail',
}: NewsletterFormProps) {
  const { subscribe, isLoading, error } = useNewsletter();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] = useState({
    actualites: true,
    evenements: true,
    bonnesAdresses: true,
    offresSpeciales: false,
  });
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await subscribe({
      email,
      firstName,
      preferences: showPreferences ? preferences : undefined,
      frequency: showPreferences ? frequency : 'weekly',
    });

    if (result.success) {
      setShowSuccess(true);
      setEmail('');
      setFirstName('');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  if (variant === 'inline') {
    return (
      <div className={cn('relative', className)}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Inscription...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                S'inscrire
              </>
            )}
          </Button>
        </form>
        
        {showSuccess && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-green-700 text-sm">Inscription réussie ! Vérifiez votre email.</span>
          </div>
        )}
        
        {error && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold flex items-center mb-2">
          <Mail className="h-5 w-5 mr-2 text-blue-600" />
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>
      </div>

      {showSuccess ? (
        <div className="flex items-center justify-center py-8 px-6 bg-green-50 rounded-lg">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold text-green-700 mb-1">Inscription réussie !</h4>
            <p className="text-green-600 text-sm">Vérifiez votre email pour confirmer votre inscription.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom (optionnel)</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Jean"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {showPreferences && (
            <>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                {showAdvanced ? 'Masquer' : 'Afficher'} les options
                <span className="ml-1">{showAdvanced ? '↑' : '↓'}</span>
              </button>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="mb-2 block">Je souhaite recevoir :</Label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="actualites"
                          checked={preferences.actualites}
                          onChange={(e) => 
                            setPreferences({...preferences, actualites: e.target.checked})
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="actualites" className="ml-2 cursor-pointer">
                          Les actualités de Lyon
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="evenements"
                          checked={preferences.evenements}
                          onChange={(e) => 
                            setPreferences({...preferences, evenements: e.target.checked})
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="evenements" className="ml-2 cursor-pointer">
                          Les événements à venir
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="bonnesAdresses"
                          checked={preferences.bonnesAdresses}
                          onChange={(e) => 
                            setPreferences({...preferences, bonnesAdresses: e.target.checked})
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="bonnesAdresses" className="ml-2 cursor-pointer">
                          Les bonnes adresses
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="offresSpeciales"
                          checked={preferences.offresSpeciales}
                          onChange={(e) => 
                            setPreferences({...preferences, offresSpeciales: e.target.checked})
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="offresSpeciales" className="ml-2 cursor-pointer">
                          Les offres spéciales
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Fréquence des emails :</Label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="daily"
                          name="frequency"
                          value="daily"
                          checked={frequency === 'daily'}
                          onChange={(e) => setFrequency(e.target.value as any)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="daily" className="ml-2 cursor-pointer">
                          Quotidien
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="weekly"
                          name="frequency"
                          value="weekly"
                          checked={frequency === 'weekly'}
                          onChange={(e) => setFrequency(e.target.value as any)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="weekly" className="ml-2 cursor-pointer">
                          Hebdomadaire
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="monthly"
                          name="frequency"
                          value="monthly"
                          checked={frequency === 'monthly'}
                          onChange={(e) => setFrequency(e.target.value as any)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="monthly" className="ml-2 cursor-pointer">
                          Mensuel
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                S'inscrire à la newsletter
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            En vous inscrivant, vous acceptez notre politique de confidentialité.
            Vous pouvez vous désinscrire à tout moment.
          </p>
        </form>
      )}
    </div>
  );
}