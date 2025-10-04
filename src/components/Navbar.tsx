import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Brain, LayoutDashboard, Map, BarChart3, Crown, LogIn, LogOut, BookOpen, Sun, Moon, Target, Play, Zap } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const { isAuthenticated, logout } = useAuth()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Navigation structure
  const getNavigation = () => {
    if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
        { name: 'Students', href: '/teacher#students', icon: Crown },
        { name: 'Analytics', href: '/teacher#analytics', icon: BarChart3 },
        { name: 'Content', href: '/teacher#content', icon: BookOpen }
      ]
    } else if (isAuthenticated) {
      // Student navigation - removed Home, Knowledge Map, and AI Tutor
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Progress', href: '/progress', icon: BarChart3 }
      ]
    } else {
      // Public navigation
      return [
        { name: 'Home', href: '/', icon: Brain }
      ]
    }
  }

  const navigation = getNavigation()

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/') return location.pathname.startsWith(path)
    return false
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else if (systemPrefersDark) {
      setTheme('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <Brain size={36} />
            <span>EduVerse</span>
          </Link>
          
          {/* Navigation */}
          {isAuthenticated && (
            <div className="nav-links">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* User Profile and Theme Toggle */}
        <div className="user-profile">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle modern"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {isAuthenticated ? (
            <>
              <div className="user-points">
                <Zap size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {user?.points || 0} XP
              </div>
              <div className="user-level">Lvl {user?.level || 1}</div>
              <div className="user-avatar" title={user?.name}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-icon logout-button"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/" className="btn btn-primary">
              <LogIn size={20} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar