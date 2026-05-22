import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const getEntries = async (userId) => {
  try {
    const q = query(collection(db, "moods"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by timestamp descending (newest first) client-side to avoid needing a composite index
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching entries", error);
    return [];
  }
};

export const addEntry = async (userId, entry) => {
  await addDoc(collection(db, "moods"), {
    userId,
    timestamp: Date.now(),
    ...entry
  });
};

export const deleteEntry = async (id) => {
  await deleteDoc(doc(db, "moods", id));
};

export const updateEntry = async (id, updatedData) => {
  await updateDoc(doc(db, "moods", id), updatedData);
};

export const getTodayEntry = async (userId) => {
  const entries = await getEntries(userId);
  const today = new Date().toDateString();
  return entries.find(e => new Date(e.timestamp).toDateString() === today) || null;
};
