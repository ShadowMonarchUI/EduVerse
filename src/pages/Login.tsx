import React, { useState } from 'react'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Brain, GraduationCap, User, Briefcase, ArrowRight, Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { userType } = useParams<{ userType: string }>()
  
  const from = location.state?.from?.pathname || '/dashboard'

  // Get user type from URL parameter or default to student
  const getUserType = () => {
    if (userType === 'teacher') return 'teacher'
    return 'student'
  }

  const getUserTypeDisplay = () => {
    const type = getUserType()
    switch (type) {
      case 'teacher': return 'Teacher'
      default: return 'Student'
    }
  }

  const getUserTypeIcon = () => {
    const type = getUserType()
    switch (type) {
      case 'teacher': return <User size={72} />
      default: return <GraduationCap size={72} />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    setLoading(true)
    
    try {
      const success = await login(email, password)
      if (success) {
        setIsSuccess(true)
        // Add a small delay for visual feedback
        setTimeout(() => {
          // Redirect to appropriate dashboard based on user role
          // For testing purposes, we can check if the email contains 'teacher'
          // In a real app, this would be determined by the backend
          if (email.includes('teacher')) {
            navigate('/teacher', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        }, 1000)
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className={`login-card ${isSuccess ? 'success' : ''}`}>
        <div className="login-header">
          <div className="login-icon">
            {getUserTypeIcon()}
          </div>
          <h1>EduVerse</h1>
          <p>AI-Powered Adaptive Learning for {getUserTypeDisplay()}</p>
        </div>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        {isSuccess ? (
          <div className="success-message">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Welcome back!</h3>
            <p>Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={20} />
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input form-input-lg"
                  placeholder={`Enter your ${getUserType()} email`}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={20} />
                Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input form-input-lg"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`login-button btn-lg ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  Sign In as {getUserTypeDisplay()}
                  <ArrowRight className="button-icon" size={24} />
                </>
              )}
            </button>
          </form>
        )}
        
        <div className="login-hints">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <Shield size={20} />
            <p><strong>Secure Login</strong></p>
          </div>
          <p>Any email/password will work for {getUserTypeDisplay().toLowerCase()}</p>
        </div>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to={`/signup/${getUserType()}`} className="login-link">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login