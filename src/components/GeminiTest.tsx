import React, { useState } from 'react'
import { generateContent } from '../services/geminiService'

const GeminiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const testGeminiAPI = async () => {
    setIsLoading(true)
    setError(null)
    setTestResult('')
    
    try {
      const result = await generateContent('Say "Hello, EduVerse!" in 5 different languages.')
      setTestResult(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Gemini API Test Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card" style={{ margin: '20px', padding: '20px' }}>
      <h2>Gemini API Test</h2>
      <button 
        className="btn btn-primary" 
        onClick={testGeminiAPI} 
        disabled={isLoading}
        style={{ marginBottom: '20px' }}
      >
        {isLoading ? 'Testing...' : 'Test Gemini API'}
      </button>
      
      {error && (
        <div className="login-error" style={{ marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {testResult && (
        <div className="card" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          padding: '15px',
          whiteSpace: 'pre-wrap'
        }}>
          <h3>API Response:</h3>
          <p>{testResult}</p>
        </div>
      )}
    </div>
  )
}

export default GeminiTest