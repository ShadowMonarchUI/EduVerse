// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getAuth, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         signInAnonymously,
         signOut, 
         onAuthStateChanged } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getDatabase, ref, set, push, onValue, off, update, remove } from 'firebase/database'
import type { User as FirebaseUser } from 'firebase/auth'

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Analytics
const analytics = getAnalytics(app)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Initialize Firebase Realtime Database
const database = getDatabase(app)

export { 
  auth, 
  database,
  analytics,
  getAuth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  ref,
  set,
  push,
  onValue,
  off,
  update,
  remove
}

// Custom User type to match our application needs
export interface User {
  uid: string
  email: string | null
  displayName: string | null
  role: 'student' | 'teacher' | 'professional'
}

// Function to format Firebase user to our User type
export const formatFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    role: 'student' // Default role, will be updated based on user data
  }
}