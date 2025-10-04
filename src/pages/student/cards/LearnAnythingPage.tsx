import React from 'react'
import { Brain, BookOpen } from 'lucide-react'
import LearnAnything from '../../../components/LearnAnything'

const LearnAnythingPage: React.FC = () => {
  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>
          <Brain size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Learn Anything
        </h1>
        <p>Get AI-powered explanations for any concept in 3 difficulty levels</p>
      </div>
      
      <div className="card fade-in-up" style={{ animationDelay: '0.2s' }}>
        <LearnAnything />
      </div>
    </div>
  )
}

export default LearnAnythingPage