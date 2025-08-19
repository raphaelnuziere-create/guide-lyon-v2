import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'europe-west1');

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_PRODUCTION) {
  const EMULATOR_HOST = process.env.FIREBASE_EMULATOR_HOST || 'localhost';
  
  // Note: Les émulateurs nécessitent Java 11+
  // Pour utiliser Firebase en production, ajoutez NEXT_PUBLIC_FIREBASE_PRODUCTION=true dans .env.local
  console.log('⚠️ Mode démo Firebase activé. Pour utiliser un vrai projet Firebase :');
  console.log('1. Créez un projet sur https://console.firebase.google.com');
  console.log('2. Copiez vos clés dans .env.local');
  console.log('3. Ajoutez NEXT_PUBLIC_FIREBASE_PRODUCTION=true dans .env.local');
}

export default app;