import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { auth } from '../services/firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher'
}

interface AuthContextType {
  user: User | null
  signup: (email: string, password: string, name: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Determine user role based on email
        let role: 'student' | 'teacher' = 'student'
        
        if (firebaseUser.email?.includes('teacher')) {
          role = 'teacher'
        }
        
        const user: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role
        }
        
        setUser(user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's profile with their name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name })
      }
      
      // Set user data in state
      const role: 'student' | 'teacher' = 
        email.includes('teacher') ? 'teacher' : 'student'
      
      const newUser: User = {
        id: userCredential.user.uid,
        name,
        email: userCredential.user.email || '',
        role
      }
      
      setUser(newUser)
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
      
      // Determine user role based on email
      const role: 'student' | 'teacher' = 
        email.includes('teacher') ? 'teacher' : 'student'
      
      // Set user data in state
      const user: User = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || email.split('@')[0] || 'User',
        email: userCredential.user.email || '',
        role
      }
      
      setUser(user)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initializing authentication...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}