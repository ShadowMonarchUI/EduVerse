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

// Test pages
import YouTubeTestPage from './pages/YouTubeTestPage'
import MemeChatGroupTest from './pages/MemeChatGroupTest'
import MemeChatTestPage from './pages/MemeChatTestPage'
import SimpleGroupChatV2Test from './pages/SimpleGroupChatV2Test'
import EduVerseMemeChatTest from './pages/EduVerseMemeChatTest'
import FirebaseTest from './pages/FirebaseTest'
import DatabaseRulesTest from './pages/DatabaseRulesTest'
import SimpleGroupChatFixedTest from './pages/SimpleGroupChatFixedTest'
import FirebaseMessageTest from './pages/FirebaseMessageTest'
import FirebaseRulesTest from './pages/FirebaseRulesTest'
import PublicGroupChatTest from './pages/PublicGroupChatTest'
import EduVerseFirebaseChatTest from './pages/EduVerseFirebaseChatTest'
import FirebaseConnectionTestPage from './pages/FirebaseConnectionTestPage'
import DatabaseRulesTesterPage from './pages/DatabaseRulesTesterPage'
import ThemedFirebaseChatTest from './pages/ThemedFirebaseChatTest'
import EduGroupChatTest from './pages/EduGroupChatTest'

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
                  <Route path="/youtube-test" element={<YouTubeTestPage />} />
                  <Route path="/meme-chat" element={<MemeChatGroupTest />} />
                  <Route path="/meme-chat-test" element={<MemeChatTestPage />} />
                  <Route path="/simple-chat-v2" element={<SimpleGroupChatV2Test />} />
                  <Route path="/edu-meme-chat" element={<EduVerseMemeChatTest />} />
                  <Route path="/firebase-test" element={<FirebaseTest />} />
                  <Route path="/db-rules-test" element={<DatabaseRulesTest />} />
                  <Route path="/simple-chat-fixed" element={<SimpleGroupChatFixedTest />} />
                  <Route path="/firebase-message-test" element={<FirebaseMessageTest />} />
                  <Route path="/firebase-rules-test" element={<FirebaseRulesTest />} />
                  <Route path="/public-chat-test" element={<PublicGroupChatTest />} />
                  <Route path="/edu-firebase-chat" element={<EduVerseFirebaseChatTest />} />
                  <Route path="/firebase-connection-test" element={<FirebaseConnectionTestPage />} />
                  <Route path="/database-rules-test" element={<DatabaseRulesTesterPage />} />
                  <Route path="/themed-firebase-chat" element={<ThemedFirebaseChatTest />} />
                  <Route path="/edu-group-chat" element={<EduGroupChatTest />} />
                  
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
                  
                  {/* Teacher routes */}
                  
                  {/* Shared routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  {/* Removed Knowledge Map route */}
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