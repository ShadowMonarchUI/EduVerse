import React, { useState } from 'react'
import { Map, Target, BookOpen, Zap, Award, Trophy, Clock, Lock, CheckCircle, Circle } from 'lucide-react'
import { useLearning } from '../contexts/LearningContext'

const KnowledgeMap: React.FC = () => {
  const { skills } = useLearning()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  // Group skills by category for better organization
  const skillsByCategory = skills.reduce((acc: any, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  // Calculate progress statistics
  const completedSkills = skills.filter(skill => skill.status === 'completed').length
  const availableSkills = skills.filter(skill => skill.status === 'available').length
  const lockedSkills = skills.filter(skill => skill.status === 'locked').length
  const totalSkills = skills.length
  const completionRate = Math.round((completedSkills / totalSkills) * 100)

  // Get skill status icon
  const getSkillStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-success-500" />
      case 'available':
        return <Zap size={20} className="text-warning-500" />
      case 'locked':
        return <Lock size={20} className="text-neutral-400" />
      default:
        return <Circle size={20} className="text-neutral-300" />
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header fade-in-up">
        <h1>Knowledge Map</h1>
        <p>Visualize your learning journey and track your progress across different skill areas</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid modern">
        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'var(--success-500)15',
            color: 'var(--success-500)',
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
            <p className="stat-label">Completed</p>
            <p className="stat-value" style={{color: 'var(--success-500)'}}>{completedSkills}</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'var(--warning-500)15',
            color: 'var(--warning-500)',
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
            <p className="stat-label">Available</p>
            <p className="stat-value" style={{color: 'var(--warning-500)'}}>{availableSkills}</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'var(--neutral-300)',
            color: 'var(--neutral-700)',
            borderRadius: 'var(--radius-2xl)',
            padding: '20px',
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={40} />
          </div>
          <div>
            <p className="stat-label">Locked</p>
            <p className="stat-value" style={{color: 'var(--neutral-700)'}}>{lockedSkills}</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="stat-icon" style={{ 
            backgroundColor: 'var(--info-500)15',
            color: 'var(--info-500)',
            borderRadius: 'var(--radius-2xl)',
            padding: '20px',
            width: '72px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={40} />
          </div>
          <div>
            <p className="stat-label">Completion</p>
            <p className="stat-value" style={{color: 'var(--info-500)'}}>{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="card fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="card-header">
          <h2 className="card-title">Learning Path</h2>
          <p className="card-subtitle">Navigate through your personalized knowledge map</p>
        </div>

        <div className="actions-grid modern">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any], categoryIndex) => (
            <div key={category} className="fade-in-up" style={{ animationDelay: `${0.6 + categoryIndex * 0.1}s`, width: '100%' }}>
              <h3 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-bold)', 
                marginBottom: 'var(--space-5)', 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <BookOpen size={24} />
                {category}
              </h3>
              <div className="actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {categorySkills.map((skill: any, skillIndex: number) => (
                  <div 
                    key={skill.id}
                    className={`action-card modern fade-in-up ${selectedSkill === skill.id ? 'selected' : ''}`}
                    style={{ 
                      animationDelay: `${0.7 + (categoryIndex * categorySkills.length + skillIndex) * 0.05}s`,
                      cursor: skill.status !== 'locked' ? 'pointer' : 'not-allowed',
                      opacity: skill.status === 'locked' ? 0.7 : 1,
                      borderLeft: `4px solid ${skill.status === 'completed' ? 'var(--success-500)' : skill.status === 'available' ? 'var(--warning-500)' : 'var(--neutral-300)'}`
                    }}
                    onClick={() => skill.status !== 'locked' && setSelectedSkill(skill.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                      <div className="action-icon" style={{ color: 'var(--primary-600)' }}>
                        <Map size={32} />
                      </div>
                      <div style={{ color: skill.status === 'completed' ? 'var(--success-500)' : skill.status === 'available' ? 'var(--warning-500)' : 'var(--neutral-400)' }}>
                        {getSkillStatusIcon(skill.status)}
                      </div>
                    </div>
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>{skill.name}</h3>
                    <p style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{skill.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={16} />
                        <span style={{ fontSize: 'var(--text-sm)' }}>{skill.points * 2} min</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Award size={16} />
                        <span style={{ fontSize: 'var(--text-sm)' }}>{skill.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeMap