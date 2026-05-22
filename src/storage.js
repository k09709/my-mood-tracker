import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export const getEntries = async (userId) => {
  try {
    const q = query(collection(db, "moods"), where("userId", "==", userId), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
