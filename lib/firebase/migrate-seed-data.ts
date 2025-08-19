#!/usr/bin/env node

/**
 * Script de migration des données seed vers Firebase Firestore
 * 
 * Usage:
 * 1. Configurez vos clés Firebase dans .env.local
 * 2. Exécutez: npx tsx lib/firebase/migrate-seed-data.ts
 */

// Charger les variables d'environnement
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger le fichier .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('🔧 Configuration Firebase:');
console.log('  Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('  Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

import { collection, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { places } from '../data/places-seed';
import { events } from '../data/events-seed';
import { articles } from '../data/articles-seed';
import { FirebasePlace, FirebaseEvent, FirebaseArticle } from './models';

// Fonction pour créer un slug à partir d'un string
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fonction pour convertir les dates
function convertDate(dateString: string): Timestamp {
  return Timestamp.fromDate(new Date(dateString));
}

// Fonction pour nettoyer les objets des valeurs undefined
function cleanObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  if (obj instanceof Date || obj instanceof Timestamp) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item)).filter(item => item !== undefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      const value = cleanObject(obj[key]);
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  
  return obj;
}

async function migratePlaces() {
  console.log('🏛️ Migration des établissements...');
  const batch = writeBatch(db);
  let count = 0;

  for (const place of places) {
    const placeData: Omit<FirebasePlace, 'id'> = {
      name: place.name,
      slug: place.slug,
      category: place.category as FirebasePlace['category'],
      ...(place.subCategory && { subCategory: place.subCategory }),
      description: place.description,
      ...(place.shortDescription && { shortDescription: place.shortDescription }),
      images: place.images || [],
      ...(place.mainImage && { mainImage: place.mainImage }),
      address: {
        street: place.address.street,
        zipCode: place.address.zipCode,
        city: place.address.city,
        district: place.address.district,
        ...(place.address.coordinates && { coordinates: place.address.coordinates })
      },
      contact: {
        ...(place.contact?.phone && { phone: place.contact.phone }),
        ...(place.contact?.email && { email: place.contact.email }),
        ...(place.contact?.website && { website: place.contact.website }),
        ...(place.contact?.socialMedia && { socialMedia: place.contact.socialMedia })
      },
      ...(place.openingHours && { openingHours: place.openingHours }),
      ...(place.priceRange && { priceRange: place.priceRange as FirebasePlace['priceRange'] }),
      features: place.features || [],
      amenities: place.amenities || [],
      rating: place.rating ? {
        average: place.rating,
        count: Math.floor(Math.random() * 100) + 10
      } : undefined,
      featured: place.featured || false,
      verified: place.verified || false,
      status: 'published',
      statistics: {
        views: Math.floor(Math.random() * 1000),
        favorites: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50)
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: 'system'
    };

    const docRef = doc(collection(db, 'places'));
    const cleanedData = cleanObject(placeData);
    if (cleanedData) {
      batch.set(docRef, cleanedData);
    }
    count++;

    // Commit par batch de 500 (limite Firestore)
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  ✓ ${count} établissements migrés`);
    }
  }

  await batch.commit();
  console.log(`✅ Migration terminée: ${count} établissements migrés`);
}

async function migrateEvents() {
  console.log('📅 Migration des événements...');
  const batch = writeBatch(db);
  let count = 0;

  for (const event of events) {
    const eventData: Omit<FirebaseEvent, 'id'> = {
      title: event.title,
      slug: event.slug,
      description: event.description,
      ...(event.shortDescription && { shortDescription: event.shortDescription }),
      category: event.category as FirebaseEvent['category'],
      images: event.images || [],
      ...(event.mainImage && { mainImage: event.mainImage }),
      startDate: convertDate(event.startDate),
      ...(event.endDate && { endDate: convertDate(event.endDate) }),
      startTime: event.startTime,
      ...(event.endTime && { endTime: event.endTime }),
      ...(event.recurring && { recurring: event.recurring }),
      location: {
        name: event.location.name,
        address: event.location.address,
        district: event.location.district,
        ...(event.location.coordinates && { coordinates: event.location.coordinates })
      },
      organizer: event.organizer,
      ...(event.price && { price: event.price }),
      ...(event.capacity && { capacity: event.capacity }),
      ...(event.currentReservations && { currentReservations: event.currentReservations }),
      requiresRegistration: event.requiresRegistration || false,
      ...(event.registrationUrl && { registrationUrl: event.registrationUrl }),
      tags: event.tags || [],
      featured: event.featured || false,
      status: 'published',
      visibility: event.visibility,
      statistics: {
        views: Math.floor(Math.random() * 500),
        registrations: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 30)
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: 'system'
    };

    const docRef = doc(collection(db, 'events'));
    const cleanedData = cleanObject(eventData);
    if (cleanedData) {
      batch.set(docRef, cleanedData);
    }
    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  ✓ ${count} événements migrés`);
    }
  }

  await batch.commit();
  console.log(`✅ Migration terminée: ${count} événements migrés`);
}

async function migrateArticles() {
  console.log('📰 Migration des articles...');
  const batch = writeBatch(db);
  let count = 0;

  for (const article of articles) {
    const articleData: Omit<FirebaseArticle, 'id'> = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category as FirebaseArticle['category'],
      tags: article.tags,
      author: typeof article.author === 'string' 
        ? {
            id: 'system',
            name: article.author,
            bio: 'Rédacteur Guide de Lyon'
          }
        : article.author,
      images: [],
      ...(article.image && { featuredImage: article.image }),
      featured: article.featured || false,
      status: 'published',
      publishedAt: convertDate(article.publishedAt),
      ...(article.readingTime && { readingTime: article.readingTime }),
      ...(article.seo && { seo: article.seo }),
      statistics: {
        views: Math.floor(Math.random() * 2000),
        likes: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50)
      },
      ...(article.relatedArticles && { relatedArticles: article.relatedArticles }),
      createdAt: convertDate(article.publishedAt),
      updatedAt: Timestamp.now(),
      createdBy: 'system'
    };

    const docRef = doc(collection(db, 'articles'));
    const cleanedData = cleanObject(articleData);
    if (cleanedData) {
      batch.set(docRef, cleanedData);
    }
    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  ✓ ${count} articles migrés`);
    }
  }

  await batch.commit();
  console.log(`✅ Migration terminée: ${count} articles migrés`);
}

async function createSampleUsers() {
  console.log('👥 Création d\'utilisateurs exemples...');
  const batch = writeBatch(db);
  
  const sampleUsers = [
    {
      uid: 'admin-user',
      email: 'admin@guide-de-lyon.fr',
      displayName: 'Administrateur',
      role: 'admin' as const,
      profile: {
        firstName: 'Admin',
        lastName: 'Guide Lyon',
        preferences: {
          newsletter: true,
          notifications: true
        }
      }
    },
    {
      uid: 'pro-user',
      email: 'pro@guide-de-lyon.fr',
      displayName: 'Restaurant Le Bouchon',
      role: 'pro' as const,
      subscription: {
        type: 'premium' as const,
        startDate: Timestamp.now(),
        autoRenew: true
      },
      profile: {
        firstName: 'Jean',
        lastName: 'Dupont',
        phone: '04 78 12 34 56',
        preferences: {
          newsletter: true,
          notifications: true
        }
      }
    },
    {
      uid: 'user-test',
      email: 'user@test.com',
      displayName: 'Utilisateur Test',
      role: 'user' as const,
      profile: {
        firstName: 'Marie',
        lastName: 'Martin',
        preferences: {
          newsletter: true,
          newsletterFrequency: 'weekly' as const,
          notifications: true
        }
      }
    }
  ];

  for (const user of sampleUsers) {
    const userData = {
      ...user,
      gamification: {
        points: Math.floor(Math.random() * 500),
        level: Math.floor(Math.random() * 5) + 1,
        badges: [],
        achievements: []
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = doc(db, 'users', user.uid);
    batch.set(docRef, userData);
  }

  await batch.commit();
  console.log(`✅ ${sampleUsers.length} utilisateurs créés`);
}

async function runMigration() {
  console.log('🚀 Début de la migration des données seed vers Firebase...\n');
  
  try {
    await migratePlaces();
    console.log('');
    
    await migrateEvents();
    console.log('');
    
    await migrateArticles();
    console.log('');
    
    await createSampleUsers();
    console.log('');
    
    console.log('🎉 Migration terminée avec succès !');
    console.log('\n📝 Notes importantes:');
    console.log('- Les utilisateurs exemples ont été créés (admin@guide-de-lyon.fr, pro@guide-de-lyon.fr, user@test.com)');
    console.log('- Vous devrez créer les mots de passe via Firebase Auth ou la fonction de réinitialisation');
    console.log('- Les images sont référencées mais doivent être uploadées séparément dans Firebase Storage');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Vérifier si le script est exécuté directement
if (require.main === module) {
  runMigration();
}

export { migratePlaces, migrateEvents, migrateArticles, createSampleUsers };