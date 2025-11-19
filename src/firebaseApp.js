import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_DEV_FIREBASE_API_KEY || "AIzaSyB3FEVcVgjDnkm10-PCILsfD14fWr5eVAg",
  authDomain: "traceroute-4b41f.firebaseapp.com",
  projectId: "traceroute-4b41f",
  storageBucket: "traceroute-4b41f.firebasestorage.app",
  messagingSenderId: "109585669134",
  appId: "1:109585669134:web:e59251c8328e4650f8f05f"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(firebaseApp);
export { onAuthStateChanged, signInWithPopup, signOut }