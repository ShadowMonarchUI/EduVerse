import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  level: number
  points: number
  badges: string[]
  role: 'student' | 'teacher'
  interests: string[]
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updatePoints: (points: number) => void
  addBadge: (badge: string) => void
  addExperience: (exp: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user: authUser } = useAuth()
  const [user, setUserState] = useState<User | null>(null)

  // Sync user data with auth context
  useEffect(() => {
    if (authUser) {
      // In a real app, you would fetch user data from an API
      // For now, we'll create mock user data based on the auth user
      const mockUser: User = {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        level: 3,
        points: 450, // Experience points
        badges: ['First Steps', 'Quick Learner'],
        role: authUser.role, // Use the role from authUser directly
        interests: ['math', 'science', 'gaming']
      }
      setUserState(mockUser)
    } else {
      setUserState(null)
    }
  }, [authUser])

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
  }

  const updatePoints = (newPoints: number) => {
    if (user) {
      const updatedPoints = user.points + newPoints;
      const newLevel = Math.floor(updatedPoints / 100) + 1;
      const levelIncreased = newLevel > user.level;
      
      setUserState({ 
        ...user, 
        points: updatedPoints,
        level: newLevel
      });
      
      // Notify user of level up
      if (levelIncreased) {
        alert(`Congratulations! You've reached level ${newLevel}!`);
      }
    }
  }

  const addExperience = (exp: number) => {
    updatePoints(exp);
  }

  const addBadge = (badge: string) => {
    if (user && !user.badges.includes(badge)) {
      setUserState({ ...user, badges: [...user.badges, badge] })
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updatePoints, addBadge, addExperience }}>
      {children}
    </UserContext.Provider>
  )
}