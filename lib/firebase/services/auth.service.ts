import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../config';
import { FirebaseUser } from '../models';

const USERS_COLLECTION = 'users';

export class AuthService {
  // Register with email and password
  static async register(
    email: string, 
    password: string, 
    displayName: string,
    role: 'user' | 'pro' = 'user'
  ): Promise<User> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName });

      // Send verification email
      await sendEmailVerification(user);

      // Create user document in Firestore
      const userData: FirebaseUser = {
        uid: user.uid,
        email: user.email!,
        displayName,
        role,
        profile: {
          preferences: {
            newsletter: false,
            notifications: true
          }
        },
        gamification: {
          points: 0,
          level: 1,
          badges: [],
          achievements: []
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(doc(db, USERS_COLLECTION, user.uid), userData);

      return user;
    } catch (error: any) {
      console.error('Error registering user:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
      
      if (!userDoc.exists()) {
        // Create user document for new Google users
        const userData: FirebaseUser = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || 'Utilisateur Google',
          photoURL: user.photoURL || undefined,
          role: 'user',
          profile: {
            preferences: {
              newsletter: false,
              notifications: true
            }
          },
          gamification: {
            points: 0,
            level: 1,
            badges: [],
            achievements: []
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        await setDoc(doc(db, USERS_COLLECTION, user.uid), userData);
      }

      return user;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string, 
    updates: Partial<FirebaseUser>
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      // Update auth profile if display name or photo changed
      const currentUser = auth.currentUser;
      if (currentUser) {
        const profileUpdates: any = {};
        if (updates.displayName) profileUpdates.displayName = updates.displayName;
        if (updates.photoURL) profileUpdates.photoURL = updates.photoURL;
        
        if (Object.keys(profileUpdates).length > 0) {
          await updateProfile(currentUser, profileUpdates);
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user data from Firestore
  static async getUserData(userId: string): Promise<FirebaseUser | null> {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
      if (userDoc.exists()) {
        return userDoc.data() as FirebaseUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Subscribe to auth state changes
  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Check if user is admin
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(userId);
      return userData?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Check if user is pro
  static async isPro(userId: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(userId);
      return userData?.role === 'pro' || userData?.role === 'admin';
    } catch (error) {
      console.error('Error checking pro status:', error);
      return false;
    }
  }

  // Update email
  static async updateUserEmail(newEmail: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateEmail(user, newEmail);
      
      // Update in Firestore
      await updateDoc(doc(db, USERS_COLLECTION, user.uid), {
        email: newEmail,
        updatedAt: Timestamp.now()
      });

      // Send verification email
      await sendEmailVerification(user);
    } catch (error: any) {
      console.error('Error updating email:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update password
  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updatePassword(user, newPassword);
    } catch (error: any) {
      console.error('Error updating password:', error);
      throw this.handleAuthError(error);
    }
  }

  // Handle auth errors
  private static handleAuthError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
      'auth/invalid-email': 'Adresse email invalide.',
      'auth/operation-not-allowed': 'Opération non autorisée.',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
      'auth/user-disabled': 'Ce compte a été désactivé.',
      'auth/user-not-found': 'Aucun compte trouvé avec cette adresse email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/invalid-credential': 'Identifiants invalides.',
      'auth/popup-closed-by-user': 'Connexion annulée.',
      'auth/requires-recent-login': 'Veuillez vous reconnecter pour effectuer cette action.',
      'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.'
    };

    const message = errorMessages[error.code] || 'Une erreur est survenue. Veuillez réessayer.';
    return new Error(message);
  }

  // Upgrade user to pro
  static async upgradeUserToPro(
    userId: string, 
    subscriptionType: 'basic' | 'premium' | 'elite'
  ): Promise<void> {
    try {
      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        role: 'pro',
        subscription: {
          type: subscriptionType,
          startDate: Timestamp.now(),
          autoRenew: true
        },
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error upgrading user to pro:', error);
      throw error;
    }
  }

  // Add gamification points
  static async addPoints(userId: string, points: number, reason?: string): Promise<void> {
    try {
      const userData = await this.getUserData(userId);
      if (!userData) throw new Error('User not found');

      const newPoints = (userData.gamification?.points || 0) + points;
      const newLevel = Math.floor(newPoints / 100) + 1; // 100 points per level

      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        'gamification.points': newPoints,
        'gamification.level': newLevel,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  // Add badge
  static async addBadge(userId: string, badgeId: string): Promise<void> {
    try {
      const userData = await this.getUserData(userId);
      if (!userData) throw new Error('User not found');

      const badges = userData.gamification?.badges || [];
      if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        
        await updateDoc(doc(db, USERS_COLLECTION, userId), {
          'gamification.badges': badges,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error adding badge:', error);
      throw error;
    }
  }
}