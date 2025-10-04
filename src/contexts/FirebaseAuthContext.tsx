import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  formatFirebaseUser,
  type User as CustomUser
} from '../services/firebase'
import type { User as FirebaseUser } from 'firebase/auth'

interface AuthContextType {
  user: CustomUser | null
  loading: boolean
  signup: (email: string, password: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useFirebaseAuth must be used within an FirebaseAuthProvider')
  }
  return context
}

interface FirebaseAuthProviderProps {
  children: ReactNode
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener')
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log('Auth state changed:', !!firebaseUser)
        if (firebaseUser) {
          const customUser = formatFirebaseUser(firebaseUser)
          setUser(customUser)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      })

      // Cleanup subscription on unmount
      return unsubscribe
    } catch (error) {
      console.error('Error setting up auth state listener:', error)
      setLoading(false)
    }
  }, [])

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const customUser = formatFirebaseUser(userCredential.user)
      setUser(customUser)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const customUser = formatFirebaseUser(userCredential.user)
      setUser(customUser)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated
  }

  // Always render children, but show loading indicator while determining auth state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading EduVerse...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}