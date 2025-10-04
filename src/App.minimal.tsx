import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserTypeSelection from './pages/UserTypeSelection'
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext'
import { FirebaseUserProvider } from './contexts/FirebaseUserContext'
import { LearningProvider } from './contexts/LearningContext'

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught an error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          backgroundColor: '#fee',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#c00'
        }}>
          <div>
            <h1>Error Occurred</h1>
            <p>Something went wrong. Check the console for details.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppMinimal() {
  React.useEffect(() => {
    console.log('AppMinimal component mounted');
  }, []);

  return (
    <ErrorBoundary>
      <FirebaseAuthProvider>
        <FirebaseUserProvider>
          <LearningProvider>
            <Router>
              <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', padding: '20px' }}>
                <h1 style={{ textAlign: 'center', color: '#4f46e5', margin: '20px 0' }}>EduVerse Test</h1>
                <Routes>
                  <Route path="/" element={<UserTypeSelection />} />
                </Routes>
              </div>
            </Router>
          </LearningProvider>
        </FirebaseUserProvider>
      </FirebaseAuthProvider>
    </ErrorBoundary>
  );
}

export default AppMinimal;