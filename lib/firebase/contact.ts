import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { ContactMessage } from '@/types/contact';

const COLLECTION_NAME = 'contact_messages';

export async function saveContactMessage(
  message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...message,
      createdAt: Timestamp.now(),
      status: 'new'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw new Error('Failed to save contact message');
  }
}

export async function getContactMessages(
  filters?: {
    status?: ContactMessage['status'];
    limit?: number;
  }
): Promise<ContactMessage[]> {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as ContactMessage[];
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

export async function updateMessageStatus(
  messageId: string,
  status: ContactMessage['status']
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, messageId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating message status:', error);
    throw new Error('Failed to update message status');
  }
}

export async function getContactMessage(messageId: string): Promise<ContactMessage | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, messageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate()
      } as ContactMessage;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching contact message:', error);
    return null;
  }
}