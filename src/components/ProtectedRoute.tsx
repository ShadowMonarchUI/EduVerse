import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Brain, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // If authenticated, render children
  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoute