import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjAU10z9IPPfxufiEvbjeb9jRJ-JJtmCA",
  authDomain: "river853-lec-21.firebaseapp.com",
  projectId: "river853-lec-21",
  storageBucket: "river853-lec-21.firebasestorage.app",
  messagingSenderId: "997834163033",
  appId: "1:997834163033:web:92935b27f06759a82dc248"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);