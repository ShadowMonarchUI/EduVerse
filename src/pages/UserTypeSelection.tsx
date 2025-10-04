import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, User, Briefcase, Brain, Zap, Target, BookOpen, Sparkles, Globe, Users, Award, Lightbulb, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'

const UserTypeSelection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { user } = useUser()

  // If user is already authenticated, redirect to appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'teacher') {
        navigate('/teacher')
      } else {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleUserTypeSelect = (userType: 'student' | 'teacher') => {
    setSelectedType(userType)
    // Add a small delay for visual feedback
    setTimeout(() => {
      navigate(`/login/${userType}`)
    }, 300)
  }

  const userTypeOptions = [
    {
      id: 'student',
      title: 'Student',
      description: 'Learn new skills with adaptive AI-powered lessons tailored to your pace',
      icon: <GraduationCap size={40} />,
      color: 'var(--primary-600)',
      gradient: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Create engaging content and track your students\' progress effectively',
      icon: <User size={40} />,
      color: 'var(--secondary-600)',
      gradient: 'linear-gradient(135deg, var(--secondary-500), var(--accent-500))'
    }
  ]

  // Features to showcase in the hero section
  const features = [
    {
      icon: <Zap size={40} />,
      title: 'AI-Powered Learning',
      description: 'Adaptive algorithms that personalize your learning experience based on your unique needs and progress'
    },
    {
      icon: <Target size={40} />,
      title: 'Skill Tracking',
      description: 'Monitor your progress with detailed analytics and insights to optimize your learning journey'
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Interactive Content',
      description: 'Engaging lessons designed with multimedia elements to maximize retention and understanding'
    },
    {
      icon: <Sparkles size={40} />,
      title: 'Gamified Experience',
      description: 'Earn points, badges, and rewards as you progress through your learning milestones'
    },
    {
      icon: <Globe size={40} />,
      title: 'Global Community',
      description: 'Connect with learners worldwide and collaborate on projects and challenges'
    },
    {
      icon: <Lightbulb size={40} />,
      title: 'Adaptive Knowledge Map',
      description: 'Visualize your learning path with an interactive map that adapts to your progress'
    }
  ]

  return (
    <div className="login-container">
      <div className="user-type-card">
        {/* Header */}
        <div className="header fade-in-up" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto var(--space-6)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 'var(--radius-2xl)',
            background: 'linear-gradient(135deg, var(--primary-100), var(--secondary-100))',
            color: 'var(--primary-600)'
          }}>
            <Brain size={48} />
          </div>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>Welcome to EduVerse</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            AI-Powered Adaptive Learning Ecosystem
          </p>
        </div>
        
        {/* User Type Selection */}
        <div className="user-type-selection">
          <h2 className="user-type-title fade-in-up" style={{ textAlign: 'center' }}>Who are you?</h2>
          <p className="user-type-description fade-in-up" style={{ textAlign: 'center' }}>Select your role to get started with personalized learning</p>
          
          <div className="user-type-options">
            {userTypeOptions.map((option, index) => (
              <div 
                key={option.id}
                className={`user-type-option modern fade-in-up ${selectedType === option.id ? 'selected' : ''}`}
                onClick={() => handleUserTypeSelect(option.id as 'student' | 'teacher')}
                style={{
                  borderColor: selectedType === option.id ? 'transparent' : 'var(--border-primary)',
                  animationDelay: `${index * 0.1}s`,
                  background: selectedType === option.id ? option.gradient : 'var(--bg-card)',
                  color: selectedType === option.id ? 'white' : 'var(--text-primary)',
                  transform: selectedType === option.id ? 'translateY(-10px)' : 'none',
                  boxShadow: selectedType === option.id ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'var(--shadow)'
                }}
              >
                <div className="icon-container" style={{ 
                  backgroundColor: selectedType === option.id ? 'rgba(255, 255, 255, 0.2)' : `${option.color}15`,
                  border: selectedType === option.id ? '2px solid rgba(255, 255, 255, 0.3)' : `2px solid ${option.color}`,
                  color: selectedType === option.id ? 'white' : option.color
                }}>
                  {React.cloneElement(option.icon, { 
                    style: { 
                      color: selectedType === option.id ? 'white' : option.color,
                      width: '40px', 
                      height: '40px' 
                    } 
                  })}
                </div>
                <h3 style={{ color: selectedType === option.id ? 'white' : 'var(--text-primary)' }}>{option.title}</h3>
                <p style={{ color: selectedType === option.id ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)' }}>{option.description}</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginTop: '20px',
                  padding: '12px 24px',
                  backgroundColor: selectedType === option.id ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 'var(--font-semibold)',
                  transition: 'all var(--transition-fast)'
                }}>
                  Continue as {option.title}
                  <ChevronRight size={20} style={{ marginLeft: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection