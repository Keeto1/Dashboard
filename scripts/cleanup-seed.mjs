import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'

if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
else loadEnv()

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
}

if (!firebaseConfig.projectId) {
  console.error('Missing Firebase config in .env.local')
  process.exit(1)
}

const seedId = process.argv[2]
if (!seedId) {
  console.error('Usage: node scripts/cleanup-seed.mjs <seedId>')
  process.exit(1)
}

async function cleanup() {
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log('Cleaning seed data for seedId:', seedId)

    const collections = ['dev_seed_users', 'dev_seed_transactions']
    for (const col of collections) {
      const q = query(collection(db, col), where('seedId', '==', seedId))
      const snap = await getDocs(q)
      console.log(`Found ${snap.size} documents in ${col}`)
      for (const d of snap.docs) {
        await deleteDoc(doc(db, col, d.id))
        console.log('Deleted', col, d.id)
      }
    }
    console.log('Cleanup complete')
  } catch (err) {
    console.error('Cleanup error:', err)
    process.exit(1)
  }
}

cleanup()
