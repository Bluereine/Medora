import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Check if Firebase is properly configured with real values (not placeholders)
const isPlaceholder = (val) =>
  !val ||
  val === 'your_firebase_api_key_here' ||
  val === 'your_project_id' ||
  val.includes('your_')

export const isFirebaseConfigured = Boolean(
  config.apiKey &&
  config.projectId &&
  !isPlaceholder(config.apiKey) &&
  !isPlaceholder(config.projectId)
)

export const missingFirebaseKeys = Object.entries(config)
  .filter(([_, val]) => isPlaceholder(val))
  .map(([key]) => key)

let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config)
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

export { app, auth, db }
