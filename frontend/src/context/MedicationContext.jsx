import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../services/firebase'
import { useAuth } from './AuthContext'

const MedicationContext = createContext(null)

const STORAGE_KEY = 'medora_local_medications'

const DEFAULT_MEDICATIONS = [
  {
    id: 'med-1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily with meals',
    reminderTime: '08:00 AM',
    instructions: 'Take with food for blood sugar control',
    pill: 'White oval tablet',
    remaining: 14,
    status: 'Normal stock'
  },
  {
    id: 'med-2',
    name: 'Lisinopril',
    dosage: '10 mg',
    frequency: 'Once daily in the morning',
    reminderTime: '08:00 AM',
    instructions: 'Take in morning for blood pressure',
    pill: 'Yellow round tablet',
    remaining: 28,
    status: 'Normal stock'
  },
  {
    id: 'med-3',
    name: 'Atorvastatin',
    dosage: '20 mg',
    frequency: 'Once nightly before bed',
    reminderTime: '09:00 PM',
    instructions: 'Take before bed for cholesterol',
    pill: 'White capsule',
    remaining: 4,
    status: 'Low stock - Refill soon'
  }
]

export function MedicationProvider({ children }) {
  const { currentUser } = useAuth()
  const [medications, setMedications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Error reading local medications:', e)
    }
    return DEFAULT_MEDICATIONS
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Listen to Firestore real-time updates when user is authenticated
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !currentUser) {
      return
    }

    setLoading(true)
    let isInitialSnapshot = true
    const q = query(
      collection(db, 'medications'),
      where('userId', '==', currentUser.uid)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const medsFromDb = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        // If the user has saved medications in Firestore, use them
        if (medsFromDb.length > 0) {
          setMedications(medsFromDb)
        } else if (!isInitialSnapshot) {
          // If the user had medications and deleted all of them, reflect empty state
          setMedications([])
        }
        isInitialSnapshot = false
        setLoading(false)
      },
      (err) => {
        console.error('Firestore medications listener error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentUser])

  // Save to local storage for instant sync across components & offline safety
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medications))
    } catch (e) {
      console.warn('Error caching medications:', e)
    }
  }, [medications])

  // Helper to determine if an ID belongs to a demo/sample seed item
  const isDefaultSeedItem = (id) => {
    return (
      typeof id === 'string' &&
      (id.startsWith('med-') || DEFAULT_MEDICATIONS.some((d) => d.id === id))
    )
  }

  // 1. Add new medication
  const addMedication = async (data) => {
    setError(null)
    const status = Number(data.remaining) <= 5 ? 'Low stock - Refill soon' : 'Normal stock'
    const newMedPayload = {
      name: data.name.trim(),
      dosage: data.dosage.trim(),
      frequency: data.frequency.trim(),
      reminderTime: data.reminderTime.trim(),
      instructions: data.instructions?.trim() || 'Take as prescribed',
      pill: data.pill?.trim() || 'White round tablet',
      remaining: Number(data.remaining) || 30,
      status
    }

    if (isFirebaseConfigured && db && currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'medications'), {
          ...newMedPayload,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        const created = { id: docRef.id, ...newMedPayload, userId: currentUser.uid }
        setMedications((prev) => [created, ...prev.filter((m) => m.id !== created.id)])
        return created
      } catch (err) {
        console.error('Error adding medication to Firestore:', err)
        setError(err.message)
        throw err
      }
    } else {
      // Local fallback for testing / offline
      const localMed = {
        id: `med-${Date.now()}`,
        ...newMedPayload,
        userId: currentUser?.uid || 'guest'
      }
      setMedications((prev) => [localMed, ...prev])
      return localMed
    }
  }

  // 2. Update existing medication (prevents duplicate documents)
  const updateMedication = async (id, data) => {
    setError(null)
    const status = Number(data.remaining) <= 5 ? 'Low stock - Refill soon' : 'Normal stock'
    const updatedPayload = {
      name: data.name.trim(),
      dosage: data.dosage.trim(),
      frequency: data.frequency.trim(),
      reminderTime: data.reminderTime.trim(),
      instructions: data.instructions?.trim() || 'Take as prescribed',
      pill: data.pill?.trim() || 'White round tablet',
      remaining: Number(data.remaining) || 30,
      status
    }

    if (isFirebaseConfigured && db && currentUser) {
      try {
        // If updating a local demo/seed medication that does not yet exist in Firestore,
        // create it as a genuine Firestore document for the authenticated user
        if (isDefaultSeedItem(id)) {
          const docRef = await addDoc(collection(db, 'medications'), {
            ...updatedPayload,
            userId: currentUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          const created = { id: docRef.id, ...updatedPayload, userId: currentUser.uid }
          setMedications((prev) => prev.map((med) => (med.id === id ? created : med)))
          return created
        }

        const medRef = doc(db, 'medications', id)
        await updateDoc(medRef, {
          ...updatedPayload,
          userId: currentUser.uid,
          updatedAt: serverTimestamp()
        })
        setMedications((prev) =>
          prev.map((med) => (med.id === id ? { ...med, ...updatedPayload, userId: currentUser.uid } : med))
        )
      } catch (err) {
        console.error('Error updating medication in Firestore:', err)
        setError(err.message)
        throw err
      }
    } else {
      // Local fallback update
      setMedications((prev) =>
        prev.map((med) => (med.id === id ? { ...med, ...updatedPayload } : med))
      )
    }
  }

  // 3. Delete medication document
  const deleteMedication = async (id) => {
    setError(null)
    if (isFirebaseConfigured && db && currentUser) {
      try {
        // If deleting a local demo/seed medication, remove it from local state directly
        // without issuing a Firestore delete on a non-existent document
        if (isDefaultSeedItem(id)) {
          setMedications((prev) => prev.filter((med) => med.id !== id))
          return
        }

        const medRef = doc(db, 'medications', id)
        await deleteDoc(medRef)
        setMedications((prev) => prev.filter((med) => med.id !== id))
      } catch (err) {
        console.error('Error deleting medication from Firestore:', err)
        setError(err.message)
        throw err
      }
    } else {
      // Local fallback delete
      setMedications((prev) => prev.filter((med) => med.id !== id))
    }
  }

  return (
    <MedicationContext.Provider
      value={{
        medications,
        loading,
        error,
        addMedication,
        updateMedication,
        deleteMedication
      }}
    >
      {children}
    </MedicationContext.Provider>
  )
}

export function useMedications() {
  const context = useContext(MedicationContext)
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider')
  }
  return context
}
