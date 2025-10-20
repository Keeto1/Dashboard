import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, connectFirestoreEmulator } from 'firebase/firestore'

// Use a minimal Firebase config for emulator — projectId is taken from env or default
const firebaseConfig = {
  apiKey: 'fake',
  authDomain: 'fake',
  projectId: process.env.FIREBASE_PROJECT || process.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
// If the Firestore emulator is running, connect to it explicitly
// Always connect to the local Firestore emulator on localhost:8080 when seeding.
// This prevents accidental calls to the production Cloud Firestore API.
try {
  console.log('Connecting to Firestore emulator at localhost:8080')
  connectFirestoreEmulator(db, 'localhost', 8080)
} catch (err) {
  console.warn('Could not connect to Firestore emulator:', err)
}

async function seed() {
  try {
    console.log('Seeding emulator data...')

    const usersRef = collection(db, 'users')
    await addDoc(usersRef, {
      name: 'Alice Admin',
      email: 'alice@example.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    await addDoc(usersRef, {
      name: 'Bob User',
      email: 'bob@example.com',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    const txRef = collection(db, 'transactions')
    await addDoc(txRef, {
      amount: 1999,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString()
    })

    console.log('Seeding complete')
  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  }
}

seed()
