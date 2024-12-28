// Import des modules nécessaires de Firebase
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtyaZSYo68d2zS2XQO6jsuoMJaY87B7iY",
  authDomain: "nomadescape-77796.firebaseapp.com",
  databaseURL: "https://nomadescape-77796-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nomadescape-77796",
  storageBucket: "nomadescape-77796.firebasestorage.app",
  messagingSenderId: "1079669499689",
  appId: "1:1079669499689:web:d69b74e2e3924e2a7a3938",
  measurementId: "G-QS4HL28G62"
};

// Initialisation de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app); // Si vous avez besoin de l'analyse
const auth = getAuth(app); // Authentification
const db = getFirestore(app); // Firestore

// Exportation des modules Firebase
export { app, auth, db, firebaseConfig};
