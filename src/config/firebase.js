import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Your Firebase configuration
// Get these values from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
}

// Initialize Firebase
let app
let auth
let db
let storage
let analytics

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  
  // Analytics only in production
  if (import.meta.env.PROD) {
    analytics = getAnalytics(app)
  }
  
  // If running locally and VITE_USE_FIREBASE_EMULATOR is set to 'true', connect to emulators
  try {
    if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      // Firestore emulator default localhost:8080
      connectFirestoreEmulator(db, 'localhost', 8080)
      // Auth emulator default localhost:9099
      connectAuthEmulator(auth, 'http://localhost:9099')
      console.log('Connected Firebase SDK to local emulators (auth:9099, firestore:8080)')
    }
  } catch (err) {
    console.warn('Could not connect to Firebase emulators:', err)
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
}

export { app, auth, db, storage, analytics }
