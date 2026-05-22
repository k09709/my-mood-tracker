import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO0iWbl5p2oTitx9wDGfWKSAOFWRDUM0o",
  authDomain: "mood-tracker-55de1.firebaseapp.com",
  projectId: "mood-tracker-55de1",
  storageBucket: "mood-tracker-55de1.firebasestorage.app",
  messagingSenderId: "632986279253",
  appId: "1:632986279253:web:01637900f268b597b8e3dc",
  measurementId: "G-JGZ7KHXMMW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
