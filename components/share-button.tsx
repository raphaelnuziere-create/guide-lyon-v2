'use client';

import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Mail, MessageCircle } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@guide-de-lyon/ui';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  url?: string;
  title: string;
  description?: string;
  variant?: 'icon' | 'button' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ShareButton({
  url,
  title,
  description = '',
  variant = 'icon',
  size = 'md',
  className,
}: ShareButtonProps) {
  const [showCopiedDialog, setShowCopiedDialog] = useState(false);
  
  // Utiliser l'URL actuelle si non fournie
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareOptions = [
    {
      name: 'Facebook',
      icon: <span className="text-lg">📘</span>,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'Twitter',
      icon: <span className="text-lg">🐦</span>,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'LinkedIn',
      icon: <span className="text-lg">💼</span>,
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-4 w-4" />,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: <Mail className="h-4 w-4" />,
      action: () => {
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
      },
    },
    {
      name: 'Copier le lien',
      icon: <LinkIcon className="h-4 w-4" />,
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setShowCopiedDialog(true);
          setTimeout(() => setShowCopiedDialog(false), 2000);
        } catch (err) {
          console.error('Erreur lors de la copie:', err);
        }
      },
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // L'utilisateur a annulé ou erreur
        console.log('Partage annulé ou erreur:', err);
      }
    }
  };

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];

  // Utiliser le partage natif si disponible sur mobile
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const canUseNativeShare = typeof navigator !== 'undefined' && navigator.share;

  if (variant === 'icon') {
    if (isMobile && canUseNativeShare) {
      return (
        <>
          <button
            onClick={handleNativeShare}
            className={cn(
              'p-2 rounded-full transition-all hover:bg-gray-100',
              className
            )}
            aria-label="Partager"
          >
            <Share2 className={cn(iconSize, 'text-gray-600 hover:text-gray-900')} />
          </button>
          
          <Dialog open={showCopiedDialog} onOpenChange={setShowCopiedDialog}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Lien copié !</DialogTitle>
                <DialogDescription>
                  Le lien a été copié dans votre presse-papiers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'p-2 rounded-full transition-all hover:bg-gray-100',
                className
              )}
              aria-label="Partager"
            >
              <Share2 className={cn(iconSize, 'text-gray-600 hover:text-gray-900')} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {shareOptions.map((option) => (
              <DropdownMenuItem
                key={option.name}
                onClick={option.action}
                className="cursor-pointer"
              >
                <span className="mr-2">{option.icon}</span>
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Dialog open={showCopiedDialog} onOpenChange={setShowCopiedDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Lien copié !</DialogTitle>
              <DialogDescription>
                Le lien a été copié dans votre presse-papiers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (variant === 'button') {
    if (isMobile && canUseNativeShare) {
      return (
        <>
          <Button
            variant="outline"
            size={size === 'sm' ? 'sm' : 'default'}
            onClick={handleNativeShare}
            className={className}
          >
            <Share2 className={cn(iconSize, 'mr-2')} />
            Partager
          </Button>
          
          <Dialog open={showCopiedDialog} onOpenChange={setShowCopiedDialog}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Lien copié !</DialogTitle>
                <DialogDescription>
                  Le lien a été copié dans votre presse-papiers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={size === 'sm' ? 'sm' : 'default'}
              className={className}
            >
              <Share2 className={cn(iconSize, 'mr-2')} />
              Partager
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {shareOptions.map((option) => (
              <DropdownMenuItem
                key={option.name}
                onClick={option.action}
                className="cursor-pointer"
              >
                <span className="mr-2">{option.icon}</span>
                {option.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Dialog open={showCopiedDialog} onOpenChange={setShowCopiedDialog}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Lien copié !</DialogTitle>
              <DialogDescription>
                Le lien a été copié dans votre presse-papiers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // variant === 'text'
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'inline-flex items-center gap-1 text-sm transition-colors text-gray-500 hover:text-gray-900',
              className
            )}
          >
            <Share2 className={iconSize} />
            <span>Partager</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {shareOptions.map((option) => (
            <DropdownMenuItem
              key={option.name}
              onClick={option.action}
              className="cursor-pointer"
            >
              <span className="mr-2">{option.icon}</span>
              {option.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showCopiedDialog} onOpenChange={setShowCopiedDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Lien copié !</DialogTitle>
            <DialogDescription>
              Le lien a été copié dans votre presse-papiers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}