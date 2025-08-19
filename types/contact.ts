import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.enum([
    'general',
    'support-pro',
    'error-report',
    'partnership',
    'other'
  ], {
    required_error: 'Veuillez sélectionner un sujet'
  }),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000, 'Le message ne peut pas dépasser 5000 caractères'),
  establishment: z.string().optional(),
  phone: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialité'
  })
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactMessage extends ContactFormData {
  id?: string;
  createdAt: Date;
  status: 'new' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
  userAgent?: string;
  locale: string;
}

export const subjectLabels: Record<ContactFormData['subject'], string> = {
  general: 'Question générale',
  'support-pro': 'Support professionnel',
  'error-report': 'Signaler une erreur',
  partnership: 'Partenariat',
  other: 'Autre'
};