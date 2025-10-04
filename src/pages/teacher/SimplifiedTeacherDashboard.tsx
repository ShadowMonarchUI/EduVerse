import React, { useState } from 'react'
import { BookOpen, MessageSquare, Target, Plus, Upload, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TeacherQuizGenerator from '../../components/TeacherQuizGenerator'

const SimplifiedTeacherDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeCard, setActiveCard] = useState<number | null>(null)

  // Card data for the teacher dashboard
  const teacherCards = [
    {
      id: 1,
      title: 'AI Course Generator',
      description: 'Generate complete courses for specific topics using AI',
      icon: BookOpen,
      color: 'var(--primary-600)',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      action: () => setActiveCard(1)
    },
    {
      id: 2,
      title: 'Group Chat',
      description: 'Communicate with students in real-time',
      icon: MessageSquare,
      color: 'var(--success-500)',
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
      action: () => setActiveCard(2)
    },
    {
      id: 3,
      title: 'Quiz Generator',
      description: 'Create customized quizzes with AI-powered questions',
      icon: Target,
      color: 'var(--accent-500)',
      gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      action: () => setActiveCard(3)
    }
  ]

  // Reset active card to show the dashboard grid again
  const resetActiveCard = () => {
    setActiveCard(null)
  }

  // Render content for each card based on activeCard state
  const renderCardContent = () => {
    switch (activeCard) {
      case 1: // AI Course Generator
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <BookOpen size={28} style={{ color: 'var(--primary-600)' }} />
                  AI Course Generator
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  Generate complete courses for specific topics using AI and the Gemini API
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-secondary)'
            }}>
              <BookOpen size={64} style={{ 
                margin: '0 auto 30px', 
                color: 'var(--primary-300)' 
              }} />
              <h3>AI Course Generator</h3>
              <p style={{ maxWidth: '600px', lineHeight: 1.6 }}>
                This feature will allow you to generate complete courses for specific topics using AI and the Gemini API.
                Enter a topic, and our AI will create a structured curriculum with lessons, activities, and assessments.
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginTop: '30px',
                width: '100%',
                maxWidth: '500px'
              }}>
                <input
                  type="text"
                  placeholder="Enter a topic to generate a course..."
                  className="form-input form-input-lg"
                  style={{ 
                    flex: 1,
                    padding: '12px 20px'
                  }}
                />
                <button 
                  className="btn btn-primary"
                  style={{ 
                    padding: '12px 25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Zap size={20} />
                  Generate
                </button>
              </div>
            </div>
          </div>
        )
      
      case 2: // Group Chat
        return (
          <div className="card fade-in-up" style={{ 
            padding: '30px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--bg-primary)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <div className="card-header" style={{ margin: 0 }}>
                <h2 className="card-title" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: 0
                }}>
                  <MessageSquare size={28} style={{ color: 'var(--success-500)' }} />
                  EduVerse Groups
                </h2>
                <p className="card-subtitle" style={{ 
                  color: 'var(--text-secondary)',
                  margin: '5px 0 0 0'
                }}>
                  Communicate with students in real-time study groups
                </p>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={resetActiveCard}
                style={{ padding: '8px 16px' }}
              >
                Back to Dashboard
              </button>
            </div>
            
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-secondary)'
            }}>
              <MessageSquare size={64} style={{ 
                margin: '0 auto 30px', 
                color: 'var(--success-300)' 
              }} />
              <h3>EduVerse Groups</h3>
              <p style={{ maxWidth: '600px', lineHeight: 1.6 }}>
                This feature will allow you to communicate with students in real-time study groups.
                Create subject-specific groups, share resources, and facilitate discussions.
              </p>
              <button 
                className="btn btn-primary"
                style={{ 
                  marginTop: '30px',
                  padding: '12px 30px'
                }}
              >
                Open Group Chat
              </button>
            </div>
          </div>
        )
      
      case 3: // Quiz Generator
        return <TeacherQuizGenerator />
      
      default:
        return null
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header fade-in-up" style={{ 
        textAlign: 'center',
        marginBottom: '40px',
        padding: '30px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
        border: '1px solid var(--border-primary)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 800,
          margin: '0 0 15px 0',
          background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))',
          WebkitBackgroundClip: 'text' as any,
          WebkitTextFillColor: 'transparent' as any,
          backgroundClip: 'text' as any
        }}>
          Teacher Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Create courses, communicate with students, and generate quizzes with AI-powered tools
        </p>
      </div>

      {/* Show only the active card content or the grid of cards */}
      {activeCard !== null ? (
        // Show only the active card content
        renderCardContent()
      ) : (
        // Main Dashboard Grid - Only show if no card is active
        <div className="actions-grid modern" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          marginTop: '20px'
        }}>
          {teacherCards.map((card) => {
            const Icon = card.icon
            return (
              <div 
                key={card.id}
                className="action-card modern fade-in-up" 
                style={{ 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '30px',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--bg-primary)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(0)'
                }}
                onClick={card.action}
                onMouseEnter={(e) => {
                  // Enhanced hover effects
                  e.currentTarget.style.transform = 'translateY(-10px)'
                  e.currentTarget.style.boxShadow = `0 20px 30px rgba(0, 0, 0, 0.15), 0 0 30px ${card.color}20`
                  
                  // Gradient border effect
                  e.currentTarget.style.borderImage = `${card.gradient} 1`
                  
                  // Icon animation
                  const icon = e.currentTarget.querySelector('.action-icon') as HTMLElement
                  if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)'
                    icon.style.background = card.gradient
                    icon.style.color = 'white'
                  }
                  
                  // Title color change
                  const title = e.currentTarget.querySelector('h3') as HTMLElement
                  if (title) {
                    title.style.background = card.gradient
                    ;(title.style as any).WebkitBackgroundClip = 'text'
                    ;(title.style as any).WebkitTextFillColor = 'transparent'
                    title.style.backgroundClip = 'text'
                  }
                }}
                onMouseLeave={(e) => {
                  // Reset effects
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.borderImage = 'none'
                  e.currentTarget.style.borderColor = 'var(--border-primary)'
                  
                  // Reset icon
                  const icon = e.currentTarget.querySelector('.action-icon') as HTMLElement
                  if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)'
                    icon.style.background = `${card.color}15`
                    icon.style.color = card.color
                  }
                  
                  // Reset title
                  const title = e.currentTarget.querySelector('h3') as HTMLElement
                  if (title) {
                    title.style.background = 'none'
                    title.style.color = 'var(--text-primary)'
                    ;(title.style as any).WebkitBackgroundClip = 'initial'
                    ;(title.style as any).WebkitTextFillColor = 'initial'
                    title.style.backgroundClip = 'initial'
                  }
                }}
              >
                {/* Decorative elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: `${card.color}05`,
                  borderRadius: '50%',
                  zIndex: 0
                }}></div>
                
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '100px',
                  height: '100px',
                  background: `${card.color}03`,
                  borderRadius: '50%',
                  zIndex: 0
                }}></div>
                
                {/* Icon with enhanced styling */}
                <div className="action-icon" style={{ 
                  color: card.color,
                  marginBottom: '25px',
                  backgroundColor: `${card.color}15`,
                  width: '70px',
                  height: '70px',
                  borderRadius: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative',
                  zIndex: 1,
                  border: `2px solid ${card.color}20`
                }}>
                  <Icon size={36} />
                </div>
                
                <h3 style={{ 
                  margin: '0 0 15px 0',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {card.title}
                </h3>
                
                <p style={{ 
                  margin: 0,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {card.description}
                </p>
                
                {/* Animated bottom bar */}
                <div style={{
                  marginTop: 'auto',
                  paddingTop: '20px',
                  width: '100%',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    height: '3px',
                    background: `${card.color}20`,
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: '0%',
                      background: card.gradient,
                      transition: 'width 0.5s ease',
                      borderRadius: 'var(--radius-full)'
                    }}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SimplifiedTeacherDashboard