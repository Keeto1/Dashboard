import { v4 as uuidv4 } from 'uuid'
import { config as loadEnv } from 'dotenv'
import { existsSync } from 'fs'

if (existsSync('.env.local')) loadEnv({ path: '.env.local' })
else loadEnv()

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

if (!firebaseConfig.projectId) {
  console.error('Missing Firebase config in .env.local')
  process.exit(1)
}

const DRY_RUN = process.argv.includes('--dry')
const SEED_ID = uuidv4()
const TAG = { seed: true, seedId: SEED_ID, seededAt: new Date().toISOString() }

console.log('Safe seeder runId:', SEED_ID)
console.log('Dry run:', DRY_RUN)

async function seed() {
  if (DRY_RUN) {
    console.log('Dry run — no writes will be made. The following documents would be created:')
    console.log('Collection: dev_seed_users => 2 docs (Alice Admin, Bob User)')
    console.log('Collection: dev_seed_transactions => 2 docs')
    return
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  const usersRef = collection(db, 'dev_seed_users')
  const txRef = collection(db, 'dev_seed_transactions')

  try {
    const a = await addDoc(usersRef, { name: 'Alice Admin', email: 'alice@example.com', role: 'admin', status: 'active', ...TAG })
    const b = await addDoc(usersRef, { name: 'Bob User', email: 'bob@example.com', role: 'user', status: 'active', ...TAG })

    await addDoc(txRef, { userId: a.id, amount: 5000, currency: 'USD', status: 'completed', ...TAG })
    await addDoc(txRef, { userId: b.id, amount: 1999, currency: 'USD', status: 'pending', ...TAG })

    console.log('Seeding complete. SeedId:', SEED_ID)
    console.log('To remove seed data run: node scripts/cleanup-seed.mjs', SEED_ID)
  } catch (err) {
    console.error('Error seeding:', err)
    process.exit(1)
  }
}

seed()
