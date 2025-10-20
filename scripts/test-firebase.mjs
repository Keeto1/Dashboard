import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'

// Load .env.local first (Vite uses .env.local), then fallback to .env
if (existsSync('.env.local')) {
  loadEnv({ path: '.env.local' })
} else {
  loadEnv()
}
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
}

function missingConfig() {
  return !firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId
}

if (missingConfig()) {
  console.error('Missing Firebase configuration. Copy .env.example to .env.local and fill the values.')
  process.exit(1)
}

try {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  console.log('Firebase initialized with projectId:', firebaseConfig.projectId)

  console.log('Attempting to read the `users` collection (will succeed even if empty)...')
  const snapshot = await getDocs(collection(db, 'users'))
  console.log(`OK — read ${snapshot.size} documents from 'users' collection.`)
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data())
  })
  process.exit(0)
} catch (err) {
  console.error('Error connecting to Firestore:', err)
  process.exit(2)
}
