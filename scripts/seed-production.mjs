import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'

// Load .env.local (if present) then fallback to .env
if (existsSync('.env.local')) {
  loadEnv({ path: '.env.local' })
} else {
  loadEnv()
}

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

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

async function seed() {
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log('Seeding production Firestore for project:', firebaseConfig.projectId)
    console.log('This will write sample documents to your LIVE Firestore. Run only if you understand the impact.')

    const usersRef = collection(db, 'users')
    const txRef = collection(db, 'transactions')

    const alice = await addDoc(usersRef, {
      name: 'Alice Admin',
      email: 'alice@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    })

    const bob = await addDoc(usersRef, {
      name: 'Bob User',
      email: 'bob@example.com',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    })

    await addDoc(txRef, {
      userId: alice.id,
      amount: 4999,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString()
    })

    await addDoc(txRef, {
      userId: bob.id,
      amount: 1999,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    console.log('Seeding complete. Created Alice:', alice.id, 'Bob:', bob.id)
  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  }
}

seed()
