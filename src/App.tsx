import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import UserTypeSelection from './pages/UserTypeSelection'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AITutor from './pages/AITutor'
import Progress from './pages/Progress'
import TeacherDashboard from './pages/TeacherDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import { LearningProvider } from './contexts/LearningContext'

// Student pages
import SkillAssessment from './pages/student/SkillAssessment'
import LearnAnythingPage from './pages/student/cards/LearnAnythingPage'
import LearnThroughVideosPage from './pages/student/cards/LearnThroughVideosPage'
import LearnThroughReelsPage from './pages/student/cards/LearnThroughReelsPage'
import AIFriendChatbotPage from './pages/student/cards/AIFriendChatbotPage'
import GroupChatPage from './pages/student/cards/GroupChatPage'
import MockTestPage from './pages/student/cards/MockTestPage'

// Teacher pages
import SimplifiedTeacherDashboard from './pages/teacher/SimplifiedTeacherDashboard'

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <LearningProvider>
          <Router>
            <div className="app-container">
              <Navbar />
              <main className="container">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<UserTypeSelection />} />
                  <Route path="/login/:userType" element={<Login />} />
                  <Route path="/signup/:userType" element={<Signup />} />
                  
                  {/* Student routes */}
                  <Route path="/student/assessment" element={
                    <ProtectedRoute>
                      <SkillAssessment />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/learn-anything" element={
                    <ProtectedRoute>
                      <LearnAnythingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/learn-through-videos" element={
                    <ProtectedRoute>
                      <LearnThroughVideosPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/learn-through-reels" element={
                    <ProtectedRoute>
                      <LearnThroughReelsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/ai-friend-chatbot" element={
                    <ProtectedRoute>
                      <AIFriendChatbotPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/group-chat" element={
                    <ProtectedRoute>
                      <GroupChatPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/student/mock-test" element={
                    <ProtectedRoute>
                      <MockTestPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Shared routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-tutor" element={
                    <ProtectedRoute>
                      <AITutor />
                    </ProtectedRoute>
                  } />
                  <Route path="/progress" element={
                    <ProtectedRoute>
                      <Progress />
                    </ProtectedRoute>
                  } />
                  <Route path="/teacher" element={
                    <ProtectedRoute>
                      <SimplifiedTeacherDashboard />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </Router>
        </LearningProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App