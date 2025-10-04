import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useFirebaseAuth } from './FirebaseAuthContext'

interface FirebaseUser {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  points: number
  badges: string[]
  role: 'student' | 'teacher' | 'professional'
  interests: string[]
}

interface UserContextType {
  user: FirebaseUser | null
  setUser: (user: FirebaseUser | null) => void
  updatePoints: (points: number) => void
  addBadge: (badge: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useFirebaseUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useFirebaseUser must be used within a FirebaseUserProvider')
  }
  return context
}

interface FirebaseUserProviderProps {
  children: ReactNode
}

export const FirebaseUserProvider: React.FC<FirebaseUserProviderProps> = ({ children }) => {
  const { user: authUser } = useFirebaseAuth()
  const [user, setUserState] = useState<FirebaseUser | null>(null)

  // Sync user data with auth context
  useEffect(() => {
    if (authUser) {
      // In a real app, you would fetch user data from Firestore
      // For now, we'll create mock user data based on the auth user
      const mockUser: FirebaseUser = {
        id: authUser.uid,
        name: authUser.email ? authUser.email.split('@')[0] : 'User',
        email: authUser.email || '',
        level: 3,
        points: 450,
        badges: ['First Steps', 'Quick Learner'],
        role: 'student', // Default role
        interests: ['math', 'science', 'gaming']
      }
      setUserState(mockUser)
    } else {
      setUserState(null)
    }
  }, [authUser])

  const setUser = (newUser: FirebaseUser | null) => {
    setUserState(newUser)
  }

  const updatePoints = (newPoints: number) => {
    if (user) {
      setUserState({ ...user, points: user.points + newPoints })
    }
  }

  const addBadge = (badge: string) => {
    if (user && !user.badges.includes(badge)) {
      setUserState({ ...user, badges: [...user.badges, badge] })
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updatePoints, addBadge }}>
      {children}
    </UserContext.Provider>
  )
}