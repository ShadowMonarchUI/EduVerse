import React, { useState } from 'react'
import { 
  Users, 
  BarChart3, 
  BookOpen, 
  Target, 
  Award, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageSquare, 
  Crown, 
  Brain, 
  Zap, 
  Calendar,
  FileText,
  Upload
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'analytics' | 'content'>('overview')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for students
  const students = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      progress: 85,
      level: 12,
      lastActive: '2 hours ago',
      status: 'active',
      points: 1250,
      streak: 5
    },
    {
      id: 2,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      progress: 92,
      level: 14,
      lastActive: '1 day ago',
      status: 'active',
      points: 1850,
      streak: 12
    },
    {
      id: 3,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      progress: 68,
      level: 8,
      lastActive: '3 days ago',
      status: 'at-risk',
      points: 750,
      streak: 2
    },
    {
      id: 4,
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      progress: 78,
      level: 10,
      lastActive: '5 hours ago',
      status: 'active',
      points: 1100,
      streak: 7
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      progress: 45,
      level: 6,
      lastActive: '1 week ago',
      status: 'inactive',
      points: 420,
      streak: 0
    }
  ]

  // Mock data for class analytics
  const classAnalytics = {
    totalStudents: 24,
    averageProgress: 76,
    completionRate: 68,
    activeStudents: 20,
    atRiskStudents: 3,
    averageScore: 82
  }

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      student: 'Alex Johnson',
      action: 'completed lesson',
      target: 'Fractions Basics',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      student: 'Maria Garcia',
      action: 'achieved streak',
      target: '7-day learning streak',
      time: '5 hours ago',
      type: 'achievement'
    },
    {
      id: 3,
      student: 'James Wilson',
      action: 'struggling with',
      target: 'Multiplication Tables',
      time: '1 day ago',
      type: 'warning'
    },
    {
      id: 4,
      student: 'Sarah Chen',
      action: 'asked question',
      target: 'About fractions',
      time: '1 day ago',
      type: 'question'
    }
  ]

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      active: { backgroundColor: 'var(--success-100)', color: 'var(--success-700)', border: '1px solid var(--success-200)' },
      'at-risk': { backgroundColor: 'var(--warning-100)', color: 'var(--warning-700)', border: '1px solid var(--warning-200)' },
      inactive: { backgroundColor: 'var(--gray-100)', color: 'var(--gray-700)', border: '1px solid var(--gray-200)' }
    }
    
    return (
      <span 
        style={{ 
          ...statusStyles[status as keyof typeof statusStyles], 
          padding: '4px 12px', 
          borderRadius: 'var(--radius-full)', 
          fontSize: '0.8rem', 
          fontWeight: 500 
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ marginBottom: '8px' }}>Teacher Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your students and track their learning progress</p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate('/teacher/quiz-generator')}
          >
            <Plus size={20} />
            AI Quiz Generator
          </button>
        </div>
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
            <Users size={40} />
          </div>
          <div>
            <p className="stat-label">Total Students</p>
            <p className="stat-value" style={{color: 'var(--primary-600)'}}>{classAnalytics.totalStudents}</p>
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
            <TrendingUp size={40} />
          </div>
          <div>
            <p className="stat-label">Avg. Progress</p>
            <p className="stat-value" style={{color: 'var(--success-500)'}}>{classAnalytics.averageProgress}%</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.3s' }}>
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
            <AlertCircle size={40} />
          </div>
          <div>
            <p className="stat-label">At-Risk Students</p>
            <p className="stat-value" style={{color: 'var(--warning-500)'}}>{classAnalytics.atRiskStudents}</p>
          </div>
        </div>

        <div className="stat-card modern fade-in-up" style={{ animationDelay: '0.4s' }}>
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
            <p className="stat-label">Avg. Score</p>
            <p className="stat-value" style={{color: 'var(--secondary-500)'}}>{classAnalytics.averageScore}%</p>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="card fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-primary)',
          marginBottom: '30px'
        }}>
          <button 
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
            style={{ 
              borderRadius: '0',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid var(--primary-500)' : 'none',
              padding: '15px 25px',
              fontWeight: activeTab === 'overview' ? '700' : 'normal'
            }}
          >
            <BarChart3 size={20} style={{ marginRight: '10px' }} />
            Overview
          </button>
          <button 
            className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('students')}
            style={{ 
              borderRadius: '0',
              border: 'none',
              borderBottom: activeTab === 'students' ? '3px solid var(--primary-500)' : 'none',
              padding: '15px 25px',
              fontWeight: activeTab === 'students' ? '700' : 'normal'
            }}
          >
            <Users size={20} style={{ marginRight: '10px' }} />
            Students
          </button>
          <button 
            className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('analytics')}
            style={{ 
              borderRadius: '0',
              border: 'none',
              borderBottom: activeTab === 'analytics' ? '3px solid var(--primary-500)' : 'none',
              padding: '15px 25px',
              fontWeight: activeTab === 'analytics' ? '700' : 'normal'
            }}
          >
            <BarChart3 size={20} style={{ marginRight: '10px' }} />
            Analytics
          </button>
          <button 
            className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('content')}
            style={{ 
              borderRadius: '0',
              border: 'none',
              borderBottom: activeTab === 'content' ? '3px solid var(--primary-500)' : 'none',
              padding: '15px 25px',
              fontWeight: activeTab === 'content' ? '700' : 'normal'
            }}
          >
            <BookOpen size={20} style={{ marginRight: '10px' }} />
            Content
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Class Performance */}
            <div className="actions-grid modern" style={{ marginBottom: '30px' }}>
              <div className="action-card modern fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Target size={24} style={{ color: 'var(--primary-600)' }} />
                  <h3>Class Performance</h3>
                </div>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '20px 0' }}>
                  {[75, 82, 68, 90, 78, 85, 72].map((value, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ 
                        width: '100%', 
                        height: `${value}%`, 
                        backgroundColor: 'var(--primary-500)', 
                        borderRadius: '8px 8px 0 0',
                        position: 'relative'
                      }}>
                        <div style={{ 
                          position: 'absolute', 
                          top: '-25px', 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {value}%
                        </div>
                      </div>
                      <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Week {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="action-card modern fade-in-up" style={{ animationDelay: '0.7s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Brain size={24} style={{ color: 'var(--secondary-500)' }} />
                  <h3>Learning Insights</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: 'var(--radius-full)', 
                      backgroundColor: 'var(--primary-100)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <CheckCircle size={20} style={{ color: 'var(--primary-600)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, margin: 0 }}>High Engagement</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>85% of students are actively participating</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: 'var(--radius-full)', 
                      backgroundColor: 'var(--warning-100)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <AlertCircle size={20} style={{ color: 'var(--warning-600)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, margin: 0 }}>Attention Needed</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>3 students require extra support</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: 'var(--radius-full)', 
                      backgroundColor: 'var(--success-100)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <TrendingUp size={20} style={{ color: 'var(--success-600)' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, margin: 0 }}>Improvement</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Average scores increased by 12%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Recent Activities</h3>
                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} />
                  View All
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recentActivities.map(activity => (
                  <div key={activity.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: 'var(--radius-full)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      ...(activity.type === 'success' && { backgroundColor: 'var(--success-100)', color: 'var(--success-600)' }),
                      ...(activity.type === 'achievement' && { backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-600)' }),
                      ...(activity.type === 'warning' && { backgroundColor: 'var(--warning-100)', color: 'var(--warning-600)' }),
                      ...(activity.type === 'question' && { backgroundColor: 'var(--primary-100)', color: 'var(--primary-600)' })
                    }}>
                      {activity.type === 'success' && <CheckCircle size={20} />}
                      {activity.type === 'achievement' && <Award size={20} />}
                      {activity.type === 'warning' && <AlertCircle size={20} />}
                      {activity.type === 'question' && <MessageSquare size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: 500 }}>
                        <span style={{ color: 'var(--primary-600)' }}>{activity.student}</span> {activity.action} <span style={{ fontWeight: 600 }}>{activity.target}</span>
                      </p>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activity.time}</p>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            {/* Student Search and Filters */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 12px 12px 45px', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid var(--border-primary)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                />
              </div>
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
                <Filter size={20} />
                Filter
              </button>
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
                <Download size={20} />
                Export
              </button>
            </div>

            {/* Students Table */}
            <div className="table-container">
              <table className="data-table modern" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Progress</th>
                    <th>Level</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th>Points</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: 'var(--radius-full)', 
                            backgroundColor: 'var(--primary-100)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: 'var(--primary-600)'
                          }}>
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ margin: '0 0 3px 0', fontWeight: 500 }}>{student.name}</p>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ 
                            width: '100%', 
                            height: '8px', 
                            backgroundColor: 'var(--gray-200)', 
                            borderRadius: 'var(--radius-full)', 
                            overflow: 'hidden'
                          }}>
                            <div 
                              style={{ 
                                height: '100%', 
                                width: `${student.progress}%`, 
                                backgroundColor: student.progress > 70 ? 'var(--success-500)' : student.progress > 40 ? 'var(--warning-500)' : 'var(--error-500)',
                                borderRadius: 'var(--radius-full)'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{student.progress}%</span>
                        </div>
                      </td>
                      <td>{student.level}</td>
                      <td>{student.lastActive}</td>
                      <td><StatusBadge status={student.status} /></td>
                      <td style={{ fontWeight: 600 }}>{student.points.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px 10px' }}>
                            <Eye size={16} />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '6px 10px' }}>
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <BarChart3 size={48} style={{ margin: '0 auto 20px', color: 'var(--primary-500)' }} />
            <h3>Advanced Analytics</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 20px' }}>
              Detailed analytics and insights about your class performance will be available here.
            </p>
            <button className="btn btn-primary">View Reports</button>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <BookOpen size={48} style={{ margin: '0 auto 20px', color: 'var(--primary-500)' }} />
              <h3>Learning Content Management</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 20px' }}>
                Manage assignments, lessons, and curriculum content for your students.
              </p>
            </div>
            
            <div className="actions-grid modern">
              <div 
                className="action-card modern fade-in-up" 
                style={{ animationDelay: '0.1s', cursor: 'pointer' }}
                onClick={() => navigate('/teacher/quiz-generator')}
              >
                <div className="action-icon" style={{ color: 'var(--primary-600)' }}>
                  <FileText size={32} />
                </div>
                <h3>AI Quiz Generator</h3>
                <p>Create customized quizzes with AI-powered question generation</p>
              </div>
              
              <div className="action-card modern fade-in-up" style={{ animationDelay: '0.2s', opacity: 0.6, cursor: 'not-allowed' }}>
                <div className="action-icon" style={{ color: 'var(--secondary-600)' }}>
                  <Upload size={32} />
                </div>
                <h3>Upload Content</h3>
                <p>Upload documents, videos, and other learning materials</p>
              </div>
              
              <div className="action-card modern fade-in-up" style={{ animationDelay: '0.3s', opacity: 0.6, cursor: 'not-allowed' }}>
                <div className="action-icon" style={{ color: 'var(--success-500)' }}>
                  <Zap size={32} />
                </div>
                <h3>AI Lesson Planner</h3>
                <p>Generate lesson plans based on curriculum standards</p>
              </div>
              
              <div className="action-card modern fade-in-up" style={{ animationDelay: '0.4s', opacity: 0.6, cursor: 'not-allowed' }}>
                <div className="action-icon" style={{ color: 'var(--warning-500)' }}>
                  <TrendingUp size={32} />
                </div>
                <h3>Performance Reports</h3>
                <p>Generate detailed student performance reports</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard