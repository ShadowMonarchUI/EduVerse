import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, CheckCircle, ArrowRight, BookOpen, Target } from 'lucide-react'

const SkillAssessment: React.FC = () => {
  const navigate = useNavigate()
  
  // Mock quiz questions for skill assessment
  const quizQuestions = [
    {
      id: 1,
      question: "What is 15 + 27?",
      options: ["32", "42", "52", "62"],
      correct: 1
    },
    {
      id: 2,
      question: "Which fraction is equivalent to 1/2?",
      options: ["2/3", "3/6", "4/5", "5/8"],
      correct: 1
    },
    {
      id: 3,
      question: "What is the area of a rectangle with length 8 and width 5?",
      options: ["13", "26", "40", "45"],
      correct: 2
    },
    {
      id: 4,
      question: "Solve for x: 2x + 5 = 15",
      options: ["x = 5", "x = 7.5", "x = 10", "x = 2.5"],
      correct: 0
    },
    {
      id: 5,
      question: "What is 25% of 80?",
      options: ["15", "20", "25", "30"],
      correct: 1
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(quizQuestions.length).fill(-1))
  const [isCompleted, setIsCompleted] = useState(false)

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correct) {
        correct++
      }
    })
    return Math.round((correct / quizQuestions.length) * 100)
  }

  const handleFinish = () => {
    // In a real app, we would save the assessment results
    // For now, we'll just navigate to the knowledge map
    navigate('/knowledge-map')
  }

  if (isCompleted) {
    const score = calculateScore()
    return (
      <div className="container">
        <div className="card fade-in-up">
          <div className="card-header" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 20px', 
              borderRadius: '50%', 
              backgroundColor: score >= 70 ? 'var(--success-100)' : score >= 50 ? 'var(--warning-100)' : 'var(--error-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={48} style={{ 
                color: score >= 70 ? 'var(--success-600)' : score >= 50 ? 'var(--warning-600)' : 'var(--error-600)' 
              }} />
            </div>
            <h2 className="card-title">Assessment Complete!</h2>
            <p className="card-subtitle">Your skill level has been determined</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              margin: '20px 0',
              color: score >= 70 ? 'var(--success-600)' : score >= 50 ? 'var(--warning-600)' : 'var(--error-600)'
            }}>
              {score}%
            </div>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              {score >= 80 
                ? "Excellent! You have a strong foundation in math." 
                : score >= 60 
                ? "Good job! You have a solid understanding with room for improvement." 
                : "Keep practicing! Focus on the fundamentals to build your skills."}
            </p>
            
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '20px', 
              borderRadius: 'var(--radius-lg)',
              marginBottom: '30px'
            }}>
              <h3 style={{ marginTop: 0 }}>Your Personalized Learning Path</h3>
              <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                {score >= 80 ? (
                  <>
                    <li>Advanced algebra concepts</li>
                    <li>Geometry and trigonometry</li>
                    <li>Problem-solving strategies</li>
                  </>
                ) : score >= 60 ? (
                  <>
                    <li>Intermediate arithmetic operations</li>
                    <li>Basic algebra fundamentals</li>
                    <li>Fractions and decimals mastery</li>
                  </>
                ) : (
                  <>
                    <li>Basic addition and subtraction</li>
                    <li>Multiplication tables practice</li>
                    <li>Introduction to fractions</li>
                  </>
                )}
              </ul>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleFinish}
              style={{ padding: '12px 30px' }}
            >
              Continue to Learning Path
              <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <div className="container">
      <div className="card fade-in-up">
        <div className="card-header">
          <h2 className="card-title">
            <Brain size={28} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Skill Assessment Quiz
          </h2>
          <p className="card-subtitle">Answer all questions to determine your baseline skill level</p>
        </div>
        
        <div style={{ padding: '30px' }}>
          {/* Progress bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '30px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '15px',
            borderRadius: 'var(--radius-lg)'
          }}>
            <BookOpen size={24} style={{ marginRight: '10px', color: 'var(--primary-600)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ 
                height: '10px', 
                backgroundColor: 'var(--border-primary)', 
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`, 
                    backgroundColor: 'var(--primary-500)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
            <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>
              {currentQuestion + 1} / {quizQuestions.length}
            </span>
          </div>
          
          {/* Question */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Target size={24} style={{ marginRight: '10px', color: 'var(--primary-600)' }} />
              Question {currentQuestion + 1}
            </h3>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>{question.question}</p>
          </div>
          
          {/* Options */}
          <div style={{ marginBottom: '30px' }}>
            {question.options.map((option, index) => (
              <div 
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding: '15px 20px',
                  margin: '10px 0',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${answers[currentQuestion] === index ? 'var(--primary-500)' : 'var(--border-primary)'}`,
                  backgroundColor: answers[currentQuestion] === index ? 'var(--primary-50)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${answers[currentQuestion] === index ? 'var(--primary-500)' : 'var(--border-primary)'}`,
                  backgroundColor: answers[currentQuestion] === index ? 'var(--primary-500)' : 'transparent',
                  marginRight: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {answers[currentQuestion] === index && (
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: 'white'
                    }} />
                  )}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </div>
          
          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '30px'
          }}>
            <button 
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              style={{ padding: '10px 20px' }}
            >
              Previous
            </button>
            
            <button 
              className="btn btn-primary"
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1}
              style={{ padding: '10px 20px' }}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}
              <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillAssessment