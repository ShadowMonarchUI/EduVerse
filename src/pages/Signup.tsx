import React, { useState } from 'react'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Brain, GraduationCap, User, Briefcase, ArrowRight, Eye, EyeOff, Mail, Lock, UserCircle } from 'lucide-react'

const Signup: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { userType } = useParams<{ userType: string }>()
  
  const from = location.state?.from?.pathname || '/dashboard'

  // Get user type from URL parameter or default to student
  const getUserType = () => {
    if (userType === 'teacher') return 'teacher'
    if (userType === 'professional') return 'professional'
    return 'student'
  }

  const getUserTypeDisplay = () => {
    const type = getUserType()
    switch (type) {
      case 'teacher': return 'Teacher'
      case 'professional': return 'Working Professional'
      default: return 'Student'
    }
  }

  const getUserTypeIcon = () => {
    const type = getUserType()
    switch (type) {
      case 'teacher': return <User size={72} />
      case 'professional': return <Briefcase size={72} />
      default: return <GraduationCap size={72} />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    setLoading(true)
    
    try {
      const success = await signup(email, password, name)
      if (success) {
        setIsSuccess(true)
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 1500)
      } else {
        setError('Failed to create account. Please try again.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Failed to create account. Please try again.')
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
          <p>Create your account as {getUserTypeDisplay()}</p>
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
            <h3>Welcome to EduVerse, {name}!</h3>
            <p>Account created successfully. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">
                <UserCircle size={20} />
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input form-input-lg"
                  placeholder={`Enter your full name`}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <Mail size={20} />
                Email
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
                  placeholder="Create a password (min. 6 characters)"
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
            
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={20} />
                Confirm Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input form-input-lg"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
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
                  Sign Up as {getUserTypeDisplay()}
                  <ArrowRight className="button-icon" size={24} />
                </>
              )}
            </button>
          </form>
        )}
        
        <div className="login-footer">
          <p>Already have an account? <Link to={`/login/${getUserType()}`} className="login-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Signup