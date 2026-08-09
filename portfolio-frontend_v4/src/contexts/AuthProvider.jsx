import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import AuthContext from './AuthContext'
import { API_BASE_URL } from '../config/env'

function AuthProviderInner({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const tokenRef = useRef(null)
  useEffect(() => {
    tokenRef.current = accessToken
  }, [accessToken])

  const bridgeToBackend = useCallback(async (fbUser) => {
    const idToken = await fbUser.getIdToken(true)
    const res = await axios.post(
      `${API_BASE_URL}/api/auth/firebase-login`,
      { idToken },
      { withCredentials: true }
    )
    setAccessToken(res.data.data.accessToken)
    setAdmin(res.data.data.admin)
    return res.data.data
  }, [])

  useEffect(() => {
    let unsubscribe = () => {}

    Promise.all([
      import('../firebase/firebase.init'),
      import('firebase/auth'),
    ])
      .then(([{ auth }, { onAuthStateChanged }]) => {
        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          setFirebaseUser(fbUser)
          if (fbUser) {
            try {
              await bridgeToBackend(fbUser)
            } catch (err) {
              console.error('Failed to bridge Firebase session to backend:', err.message)
              setAdmin(null)
              setAccessToken(null)
            }
          } else {
            setAdmin(null)
            setAccessToken(null)
          }
          setLoading(false)
        })
      })
      .catch((err) => {
        console.error('Failed to load authentication:', err.message)
        setLoading(false)
      })

    return () => unsubscribe()
  }, [bridgeToBackend])

  const loginWithEmail = async (email, password) => {
    const [{ auth }, { signInWithEmailAndPassword }] = await Promise.all([
      import('../firebase/firebase.init'),
      import('firebase/auth'),
    ])
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return bridgeToBackend(cred.user)
  }

  const loginWithGoogle = async () => {
    const [{ auth }, { signInWithPopup, GoogleAuthProvider }] = await Promise.all([
      import('../firebase/firebase.init'),
      import('firebase/auth'),
    ])
    const cred = await signInWithPopup(auth, new GoogleAuthProvider())
    return bridgeToBackend(cred.user)
  }

  const forgotPassword = async (email) => {
    const [{ auth }, { sendPasswordResetEmail }] = await Promise.all([
      import('../firebase/firebase.init'),
      import('firebase/auth'),
    ])
    return sendPasswordResetEmail(auth, email)
  }

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
    } catch {
      // best-effort
    }
    const [{ auth }, { signOut }] = await Promise.all([
      import('../firebase/firebase.init'),
      import('firebase/auth'),
    ])
    await signOut(auth)
    setAdmin(null)
    setAccessToken(null)
  }

  const refreshAccessToken = async () => {
    const res = await axios.post(
      `${API_BASE_URL}/api/auth/refresh-token`,
      {},
      { withCredentials: true }
    )
    const newToken = res.data.data.accessToken
    setAccessToken(newToken)
    tokenRef.current = newToken
    return newToken
  }

  const value = {
    firebaseUser,
    admin,
    isAdmin: !!admin,
    accessToken,
    tokenRef,
    authReady: !loading,
    loading,
    loginWithEmail,
    loginWithGoogle,
    forgotPassword,
    logout,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default function AuthProvider({ children }) {
  // Keep a single provider tree so PortfolioProvider / sections do not remount
  // (remounting was wiping Experience/Education before data could paint).
  return <AuthProviderInner>{children}</AuthProviderInner>
}
