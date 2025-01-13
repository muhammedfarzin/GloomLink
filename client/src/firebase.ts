import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1nIao5b3cYY9Ah5VDuYtUT-sBdkYyRuc",
  authDomain: "gloomlink-5.firebaseapp.com",
  projectId: "gloomlink-5",
  storageBucket: "gloomlink-5.firebasestorage.app",
  messagingSenderId: "40917126178",
  appId: "1:40917126178:web:f3fa4446385cddcc7e0e7b"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
