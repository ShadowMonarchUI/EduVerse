import React, { useState } from 'react'
import { BarChart, LineChart, PieChart, TrendingUp, Target, Award, Clock, Users, BookOpen, Zap, Calendar, ChevronRight, Video, MessageCircle, FileText, Play } from 'lucide-react'
import { useLearning } from '../contexts/LearningContext'
import { useUser } from '../contexts/UserContext'

const Progress: React.FC = () => {
  const { skills, progress } = useLearning()
  const { user } = useUser()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')

  // Mock data for learning history
  const learningHistory = [
    { 
      id: '1', 
      title: 'Introduction to Algebra', 
      type: 'video', 
      duration: 45, 
      points: 50, 
      date: '2023-06-15',
      description: 'Learned basic algebraic concepts and equations'
    },
    { 
      id: '2', 
      title: 'Fractions Quiz', 
      type: 'quiz', 
      duration: 20, 
      points: 30, 
      date: '2023-06-14',
      description: 'Completed fractions assessment with 85% score'
    },
    { 
      id: '3', 
      title: 'Geometry Group Discussion', 
      type: 'discussion', 
      duration: 30, 
      points: 25, 
      date: '2023-06-13',
      description: 'Participated in group chat about geometric shapes'
    },
    { 
      id: '4', 
      title: 'Calculus Basics', 
      type: 'video', 
      duration: 60, 
      points: 75, 
      date: '2023-06-12',
      description: 'Watched comprehensive calculus introduction'
    },
    { 
      id: '5', 
      title: 'Trigonometry Practice', 
      type: 'quiz', 
      duration: 35, 
      points: 40, 
      date: '2023-06-11',
      description: 'Practiced trigonometric functions and identities'
    },
    { 
      id: '6', 
      title: 'Physics Concepts', 
      type: 'video', 
      duration: 50, 
      points: 60, 
      date: '2023-06-10',
      description: 'Explored fundamental physics principles'
    }
  ]

  // Mock data for charts
  const weeklyProgressData = [
    { day: 'Mon', progress: 65 },
    { day: 'Tue', progress: 78 },
    { day: 'Wed', progress: 82 },
    { day: 'Thu', progress: 71 },
    { day: 'Fri', progress: 89 },
    { day: 'Sat', progress: 95 },
    { day: 'Sun', progress: 87 }
  ]

  const categoryProgressData = [
    { category: 'Arithmetic', progress: 85, color: '#3b82f6' },
    { category: 'Fractions', progress: 62, color: '#8b5cf6' },
    { category: 'Geometry', progress: 45, color: '#06b6d4' },
    { category: 'Algebra', progress: 30, color: '#f59e0b' }
  ]

  const skillDistributionData = [
    { name: 'Completed', value: 12, color: '#10b981' },
    { name: 'In Progress', value: 8, color: '#f59e0b' },
    { name: 'Not Started', value: 15, color: '#94a3b8' }
  ]

  // Calculate progress statistics
  const completedSkills = skills.filter(skill => skill.status === 'completed').length
  const totalSkills = skills.length
  const completionRate = Math.round((completedSkills / totalSkills) * 100)
  
  const totalPoints = user?.points || 0
  const currentLevel = user?.level || 1
  const streak = 7 // Current learning streak in days

  // Calculate average daily progress
  const avgDailyProgress = weeklyProgressData.reduce((sum, day) => sum + day.progress, 0) / weeklyProgressData.length

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} />
      case 'quiz': return <FileText size={20} />
      case 'discussion': return <MessageCircle size={20} />
      default: return <Play size={20} />
    }
  }

  // Get color for activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'video': return 'var(--primary-500)'
      case 'quiz': return 'var(--success-500)'
      case 'discussion': return 'var(--accent-500)'
      default: return 'var(--secondary-500)'
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header fade-in-up">
        <h1>Learning Progress</h1>
        <p>Track your learning journey and see how you're improving over time</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid modern">
        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--primary-600)',
            borderRadius: 'var(--radius-2xl)',
            padding: '20px',
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Target size={40} />
          </div>
          <div>
            <p className="stat-label">Completion Rate</p>
            <p className="stat-value" style={{color: 'var(--primary-600)'}}>{completionRate}%</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success-500)',
            borderRadius: 'var(--radius-2xl)',
            padding: '20px',
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={40} />
          </div>
          <div>
            <p className="stat-label">Experience Points</p>
            <p className="stat-value" style={{color: 'var(--success-500)'}}>{totalPoints} XP</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            color: 'var(--secondary-500)',
            borderRadius: 'var(--radius-2xl)',
            padding: '20px',
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={40} />
          </div>
          <div>
            <p className="stat-label">Current Level</p>
            <p className="stat-value" style={{color: 'var(--secondary-500)'}}>Level {currentLevel}</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--warning-500)',
            borderRadius: 'var(--radius-2xl)',
            padding: '20px',
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={40} />
          </div>
          <div>
            <p className="stat-label">Current Streak</p>
            <p className="stat-value" style={{color: 'var(--warning-500)'}}>{streak} days</p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="card fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">Progress Overview</h2>
            <p className="card-subtitle">Detailed analytics of your learning journey</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('week')}
              style={{ padding: '8px 16px' }}
            >
              Week
            </button>
            <button 
              className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('month')}
              style={{ padding: '8px 16px' }}
            >
              Month
            </button>
            <button 
              className={`btn ${timeRange === 'year' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTimeRange('year')}
              style={{ padding: '8px 16px' }}
            >
              Year
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="actions-grid modern">
          {/* Weekly Progress Chart */}
          <div className="action-card modern fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <LineChart size={24} style={{ color: 'var(--primary-600)' }} />
              <h3>Daily Progress</h3>
            </div>
            <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '20px 0' }}>
              {weeklyProgressData.map((day, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${day.progress}%`, 
                    backgroundColor: 'var(--primary-500)', 
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    transition: 'height 0.5s ease'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: '-30px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {day.progress}%
                    </div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {day.day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Progress Chart */}
          <div className="action-card modern fade-in-up" style={{ animationDelay: '0.7s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BarChart size={24} style={{ color: 'var(--secondary-500)' }} />
              <h3>Category Progress</h3>
            </div>
            <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '20px 0' }}>
              {categoryProgressData.map((category, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${category.progress}%`, 
                    backgroundColor: category.color, 
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    transition: 'height 0.5s ease'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: '-30px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: category.color
                    }}>
                      {category.progress}%
                    </div>
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    {category.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Distribution Chart */}
          <div className="action-card modern fade-in-up" style={{ animationDelay: '0.8s', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <PieChart size={24} style={{ color: 'var(--accent-500)' }} />
              <h3>Skill Distribution</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border-primary)" strokeWidth="20" />
                  
                  {/* Skill distribution segments */}
                  {(() => {
                    let cumulativePercentage = 0
                    return skillDistributionData.map((skill, index) => {
                      const percentage = (skill.value / skillDistributionData.reduce((sum, s) => sum + s.value, 0)) * 100
                      const strokeDasharray = `${percentage * 5.65} 565` // 5.65 = (2 * π * 90) / 100
                      const strokeDashoffset = -cumulativePercentage * 5.65
                      cumulativePercentage += percentage
                      
                      return (
                        <circle 
                          key={index}
                          cx="100" 
                          cy="100" 
                          r="90" 
                          fill="none" 
                          stroke={skill.color} 
                          strokeWidth="20" 
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          transform="rotate(-90 100 100)"
                        />
                      )
                    })
                  })()}
                </svg>
                <div style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {skillDistributionData.reduce((sum, skill) => sum + skill.value, 0)}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Skills</div>
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                {skillDistributionData.map((skill, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      backgroundColor: skill.color, 
                      borderRadius: '4px',
                      marginRight: '15px'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{skill.name}</span>
                        <span style={{ fontWeight: 'bold' }}>{skill.value} skills</span>
                      </div>
                      <div style={{ 
                        height: '8px', 
                        backgroundColor: 'var(--border-primary)', 
                        borderRadius: '4px',
                        marginTop: '5px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            backgroundColor: skill.color,
                            width: `${(skill.value / skillDistributionData.reduce((sum, s) => sum + s.value, 0)) * 100}%`,
                            transition: 'width 0.5s ease'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning History */}
      <div className="card fade-in-up" style={{ animationDelay: '0.9s' }}>
        <div className="card-header">
          <h2 className="card-title">Learning History</h2>
          <p className="card-subtitle">Recent activities and achievements</p>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {learningHistory.map((activity, index) => (
            <div 
              key={activity.id} 
              className="achievement-item modern fade-in-up" 
              style={{ 
                animationDelay: `${0.9 + index * 0.1}s`,
                borderBottom: index < learningHistory.length - 1 ? '1px solid var(--border-primary)' : 'none',
                paddingBottom: 'var(--space-4)',
                marginBottom: 'var(--space-4)'
              }}
            >
              <div className="achievement-icon" style={{ 
                backgroundColor: `${getActivityColor(activity.type)}20`,
                color: getActivityColor(activity.type),
                minWidth: '48px',
                minHeight: '48px'
              }}>
                {getActivityIcon(activity.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{activity.title}</h3>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: 'var(--success-50)',
                    color: 'var(--success-600)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    <Zap size={14} style={{ marginRight: '4px' }} />
                    +{activity.points} XP
                  </div>
                </div>
                <p style={{ margin: '4px 0 0 0' }}>{activity.description}</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginTop: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <Clock size={14} style={{ marginRight: '4px' }} />
                  <span>{activity.duration} min</span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>{activity.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card fade-in-up" style={{ animationDelay: '1.0s' }}>
        <div className="card-header">
          <h2 className="card-title">Recent Achievements</h2>
          <p className="card-subtitle">Celebrating your learning milestones</p>
        </div>
        <div className="achievements-list">
          {[
            { 
              name: 'Quick Learner', 
              icon: Zap, 
              color: 'var(--warning-500)',
              description: 'Completed 5 lessons in one day',
              date: '2 days ago',
              points: 50
            },
            { 
              name: 'Perfect Score', 
              icon: Target, 
              color: 'var(--success-500)',
              description: 'Scored 100% on fractions quiz',
              date: '1 week ago',
              points: 100
            },
            { 
              name: 'Streak Master', 
              icon: Calendar, 
              color: 'var(--primary-600)',
              description: '7-day learning streak',
              date: 'Today',
              points: 70
            },
            { 
              name: 'Knowledge Seeker', 
              icon: BookOpen, 
              color: 'var(--accent-500)',
              description: 'Completed 10 lessons',
              date: '2 weeks ago',
              points: 80
            }
          ].map((achievement, index) => {
            const Icon = achievement.icon
            return (
              <div key={index} className="achievement-item modern fade-in-up" style={{ animationDelay: `${1.0 + index * 0.1}s` }}>
                <div className="achievement-icon" style={{ 
                  backgroundColor: `${achievement.color}20`,
                  color: achievement.color
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{achievement.name}</h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      backgroundColor: 'var(--success-50)',
                      color: 'var(--success-600)',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      <Zap size={14} style={{ marginRight: '4px' }} />
                      +{achievement.points} XP
                    </div>
                  </div>
                  <p>{achievement.description}</p>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {achievement.date}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Progress