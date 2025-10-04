import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface SkillNode {
  id: string
  name: string
  status: 'locked' | 'available' | 'completed'
  prerequisites: string[]
  points: number
  description: string
  category: string
}

interface LearningSession {
  id: string
  skillId: string
  content: string
  type: 'video' | 'text' | 'quiz' | 'interactive'
  duration: number
  completed: boolean
}

interface LearningContextType {
  skills: SkillNode[]
  currentSession: LearningSession | null
  progress: Record<string, number>
  updateSkillStatus: (skillId: string, status: SkillNode['status']) => void
  setCurrentSession: (session: LearningSession | null) => void
  updateProgress: (skillId: string, progress: number) => void
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export const useLearning = () => {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}

interface LearningProviderProps {
  children: ReactNode
}

export const LearningProvider: React.FC<LearningProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [skills, setSkills] = useState<SkillNode[]>([])
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})

  // Initialize learning data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setSkills([
        {
          id: 'basic-addition',
          name: 'Addition',
          status: 'completed',
          prerequisites: [],
          points: 10,
          description: 'Learn basic addition with single digits',
          category: 'arithmetic'
        },
        {
          id: 'basic-subtraction',
          name: 'Subtraction',
          status: 'available',
          prerequisites: ['basic-addition'],
          points: 10,
          description: 'Learn basic subtraction with single digits',
          category: 'arithmetic'
        },
        {
          id: 'multiplication',
          name: 'Multiplication',
          status: 'locked',
          prerequisites: ['basic-addition', 'basic-subtraction'],
          points: 15,
          description: 'Learn multiplication tables and concepts',
          category: 'arithmetic'
        },
        {
          id: 'fractions',
          name: 'Fractions',
          status: 'locked',
          prerequisites: ['multiplication'],
          points: 20,
          description: 'Understanding fractions and operations',
          category: 'fractions'
        }
      ])
      
      setProgress({
        'basic-addition': 100,
        'basic-subtraction': 45
      })
    } else {
      // Clear data when user logs out
      setSkills([])
      setCurrentSession(null)
      setProgress({})
    }
  }, [isAuthenticated])

  const updateSkillStatus = (skillId: string, status: SkillNode['status']) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId ? { ...skill, status } : skill
    ))
  }

  const updateProgress = (skillId: string, newProgress: number) => {
    setProgress(prev => ({ ...prev, [skillId]: newProgress }))
  }

  return (
    <LearningContext.Provider value={{
      skills,
      currentSession,
      progress,
      updateSkillStatus,
      setCurrentSession,
      updateProgress
    }}>
      {children}
    </LearningContext.Provider>
  )
}