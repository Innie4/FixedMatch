import { 
  doc, 
  collection, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';

// Create a new document
export async function createDocument(collectionName, data) {
  try {
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, collectionName), dataWithTimestamps);
    return { id: docRef.id, ...dataWithTimestamps };
  } catch (error) {
    console.error(`Error creating ${collectionName} document:`, error);
    throw error;
  }
}

// Update an existing document
export async function updateDocument(collectionName, docId, data) {
  try {
    // Add updated timestamp
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, dataWithTimestamp);
    return { id: docId, ...dataWithTimestamp };
  } catch (error) {
    console.error(`Error updating ${collectionName} document:`, error);
    throw error;
  }
}

// Delete a document
export async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${collectionName} document:`, error);
    throw error;
  }
}

// Create or update a document with a specific ID
export async function setDocument(collectionName, docId, data, merge = true) {
  try {
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    // Add createdAt if it's a new document
    if (!merge) {
      dataWithTimestamps.createdAt = serverTimestamp();
    }
    
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, dataWithTimestamps, { merge });
    return { id: docId, ...dataWithTimestamps };
  } catch (error) {
    console.error(`Error setting ${collectionName} document:`, error);
    throw error;
  }
}

// Update a counter field atomically
export async function updateCounter(collectionName, docId, field, increment) {
  try {
    const docRef = doc(db, collectionName, docId);
    
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      
      if (!docSnap.exists()) {
        throw new Error(`Document ${docId} does not exist in ${collectionName}`);
      }
      
      const newValue = (docSnap.data()[field] || 0) + increment;
      transaction.update(docRef, { 
        [field]: newValue,
        updatedAt: serverTimestamp() 
      });
    });
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating counter in ${collectionName}:`, error);
    throw error;
  }
}

// Log activity
export async function logActivity(action, admin, details) {
  try {
    await addDoc(collection(db, 'activityLogs'), {
      action,
      admin,
      details,
      timestamp: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - we don't want to break the app if logging fails
    return { success: false, error: error.message };
  }
}