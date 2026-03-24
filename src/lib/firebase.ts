// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBQfzqDltmyDWQ-auz4K76S4WlbWvlh_Sk",
//   authDomain: "todo-app-598d9.firebaseapp.com",
//   projectId: "todo-app-598d9",
//   storageBucket: "todo-app-598d9.firebasestorage.app",
//   messagingSenderId: "403761296064",
//   appId: "1:403761296064:web:55c00069da9c2ef8ceb325",
//   measurementId: "G-3C74MQ1G9X",
// };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase (Prevent duplicate apps in dev mode)
export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics ONLY on the client side (browser)
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const db = getFirestore(app);

export { analytics, db };
