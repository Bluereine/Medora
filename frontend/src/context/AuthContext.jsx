import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db, isFirebaseConfigured, missingFirebaseKeys } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Listen for Firebase Auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user && db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setUserProfile(userDoc.data())
          }
        } catch (fetchErr) {
          console.error('Error fetching user profile from Firestore:', fetchErr)
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Register new user with designated role
  const registerUser = async ({ email, password, fullName, role }) => {
    setError(null)
    if (!isFirebaseConfigured || !auth || !db) {
      const err = new Error(
        'Firebase credentials are not yet configured in frontend/.env'
      )
      setError(err.message)
      throw err
    }

    // Role validation
    const validRoles = ['elderly', 'family', 'caretaker']
    if (!validRoles.includes(role)) {
      const err = new Error('Invalid user role selected')
      setError(err.message)
      throw err
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )
      const user = userCredential.user

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: fullName.trim() })

      // Create user document in Cloud Firestore
      const profileData = {
        uid: user.uid,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        role: role,
        createdAt: serverTimestamp()
      }

      await setDoc(doc(db, 'users', user.uid), profileData)
      setUserProfile(profileData)
      return { user, role: profileData.role, profile: profileData }
    } catch (authErr) {
      console.error('Registration error:', authErr)
      setError(authErr.message)
      throw authErr
    }
  }

  // Sign in existing user
  const loginUser = async ({ email, password }) => {
    setError(null)
    if (!isFirebaseConfigured || !auth || !db) {
      const err = new Error(
        'Firebase credentials are not yet configured in frontend/.env'
      )
      setError(err.message)
      throw err
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )
      const user = userCredential.user

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      let profile = null
      let loadedRole = null
      if (userDoc.exists()) {
        profile = userDoc.data()
        loadedRole = profile.role || null
        setUserProfile(profile)
      }
      return { user, role: loadedRole, profile }
    } catch (authErr) {
      console.error('Login error:', authErr)
      setError(authErr.message)
      throw authErr
    }
  }

  // Sign out user
  const logoutUser = async () => {
    setError(null)
    if (auth) {
      await signOut(auth)
    }
    setCurrentUser(null)
    setUserProfile(null)
  }

  const userRole = userProfile?.role || null

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        userRole,
        loading,
        error,
        setError,
        registerUser,
        loginUser,
        logoutUser,
        isConfigured: isFirebaseConfigured,
        missingFirebaseKeys
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
