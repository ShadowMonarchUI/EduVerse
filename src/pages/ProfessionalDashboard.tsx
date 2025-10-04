import React from 'react'
import { Target, Map, TrendingUp, BookOpen, Clock, Award, Zap, ChevronRight, Play, User, BarChart3 } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'

const ProfessionalDashboard: React.FC = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  // Mock career progress data
  const careerProgress = {
    goal: 'Data Scientist',
    currentLevel: 3,
    totalLevels: 6,
    completedSkills: 12,
    totalSkills: 24,
    progress: 50,
    nextMilestone: 'Complete Machine Learning module'
  }

  // Mock learning stats
  const learningStats = [
    {
      title: 'Learning Streak',
      value: '7 days',
      icon: Zap,
      color: 'var(--warning-500)'
    },
    {
      title: 'Hours Learned',
      value: '24 hrs',
      icon: Clock,
      color: 'var(--primary-600)'
    },
    {
      title: 'Skills Mastered',
      value: '12',
      icon: Award,
      color: 'var(--success-500)'
    },
    {
      title: 'Career Progress',
      value: '50%',
      icon: TrendingUp,
      color: 'var(--secondary-600)'
    }
  ]

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      title: 'Completed Python Basics',
      description: 'Finished introductory Python course',
      time: '2 hours ago',
      type: 'completed'
    },
    {
      id: 2,
      title: 'Started Data Visualization',
      description: 'Began learning matplotlib and seaborn',
      time: '1 day ago',
      type: 'started'
    },
    {
      id: 3,
      title: 'Joined Data Science Community',
      description: 'Connected with 5 professionals in your field',
      time: '2 days ago',
      type: 'community'
    }
  ]

  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>Professional Development Dashboard</h1>
        <p>AI-powered career guidance and skill development</p>
      </div>

      {/* Welcome Section */}
      <div className="card fade-in-up">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          padding: '30px'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: 'var(--radius-full)', 
            backgroundColor: 'var(--primary-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-600)',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h2 style={{ margin: '0 0 10px 0' }}>Welcome back, {user?.name || 'Professional'}!</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              You're on your way to becoming a {careerProgress.goal}
            </p>
          </div>
          <button 
            className="btn btn-primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => navigate('/professional/reels')}
          >
            <Play size={20} style={{ marginRight: '8px' }} />
            Watch Learning Reels
          </button>
        </div>
      </div>

      {/* Career Progress */}
      <div className="card fade-in-up">
        <div className="card-header">
          <h2 className="card-title">
            <Target size={28} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Career Progress
          </h2>
          <p className="card-subtitle">Track your journey toward your career goal</p>
        </div>
        
        <div style={{ padding: '0 30px 30px 30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{careerProgress.goal}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Level {careerProgress.currentLevel} of {careerProgress.totalLevels}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: 'bold' }}>
                {careerProgress.progress}%
              </p>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {careerProgress.completedSkills} of {careerProgress.totalSkills} skills
              </p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div style={{ 
            height: '20px', 
            backgroundColor: 'var(--border-primary)', 
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${careerProgress.progress}%`, 
                backgroundColor: 'var(--primary-500)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Next milestone: {careerProgress.nextMilestone}
            </p>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/professional/dashboard')}
            >
              View Full Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="stats-grid modern">
        {learningStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div className="stat-card modern fade-in-up" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-icon" style={{ 
                backgroundColor: `${stat.color}20`,
                color: stat.color,
                borderRadius: 'var(--radius-2xl)',
                padding: '20px',
                width: '72px',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={40} />
              </div>
              <div>
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value" style={{color: stat.color}}>{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="actions-grid modern">
        {/* Recent Activities */}
        <div className="card fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <h2 className="card-title">
              <BarChart3 size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Recent Activity
            </h2>
          </div>
          
          <div style={{ padding: '0 20px 20px 20px' }}>
            {recentActivities.map((activity, index) => (
              <div 
                key={activity.id}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: index < recentActivities.length - 1 ? '1px solid var(--border-primary)' : 'none'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: 'var(--radius-full)', 
                  backgroundColor: activity.type === 'completed' ? 'var(--success-100)' : 
                                  activity.type === 'started' ? 'var(--primary-100)' : 
                                  'var(--secondary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  {activity.type === 'completed' && <Zap size={20} style={{ color: 'var(--success-600)' }} />}
                  {activity.type === 'started' && <Play size={20} style={{ color: 'var(--primary-600)' }} />}
                  {activity.type === 'community' && <User size={20} style={{ color: 'var(--secondary-600)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{activity.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activity.description}</p>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="card fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="card-header">
            <h2 className="card-title">
              <Zap size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Quick Actions
            </h2>
          </div>
          
          <div className="actions-grid" style={{ padding: '0 20px 20px 20px', gridTemplateColumns: '1fr' }}>
            <div 
              className="action-card modern"
              onClick={() => navigate('/professional/dashboard')}
              style={{ cursor: 'pointer' }}
            >
              <div className="action-icon" style={{ color: 'var(--primary-600)' }}>
                <Map size={32} />
              </div>
              <h3>Career Roadmap</h3>
              <p>View your personalized career development plan</p>
            </div>
            
            <div 
              className="action-card modern"
              onClick={() => navigate('/professional/reels')}
              style={{ cursor: 'pointer' }}
            >
              <div className="action-icon" style={{ color: 'var(--secondary-600)' }}>
                <Play size={32} />
              </div>
              <h3>Learning Reels</h3>
              <p>Watch short, engaging video lessons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalDashboard