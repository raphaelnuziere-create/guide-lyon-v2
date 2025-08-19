export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: {
    actualites: boolean;
    evenements: boolean;
    bonnesAdresses: boolean;
    offresSpeciales: boolean;
  };
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'unsubscribed' | 'pending';
  subscribedAt: string;
  unsubscribedAt?: string;
  lastEmailSent?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'regular' | 'special' | 'welcome' | 'promo';
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: string;
  sentAt?: string;
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  category: 'weekly' | 'event' | 'promo' | 'welcome';
  variables: string[];
  preview?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}