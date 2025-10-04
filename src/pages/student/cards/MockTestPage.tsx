import React, { useState } from 'react'
import { FileText, Upload, Clock, BarChart3, CheckCircle, XCircle, AlertCircle, BookOpen, Download, Filter } from 'lucide-react'

const MockTestPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [testTopic, setTestTopic] = useState('')
  const [testStatus, setTestStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  
  // Mock questions for demonstration
  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of a neural network?",
      options: [
        "To store large amounts of data",
        "To recognize patterns and make predictions",
        "To create visual graphics",
        "To manage database transactions"
      ],
      correctAnswer: "To recognize patterns and make predictions"
    },
    {
      id: 2,
      question: "Which activation function is commonly used in hidden layers of neural networks?",
      options: [
        "Linear",
        "Sigmoid",
        "ReLU (Rectified Linear Unit)",
        "Step function"
      ],
      correctAnswer: "ReLU (Rectified Linear Unit)"
    },
    {
      id: 3,
      question: "What does 'overfitting' mean in machine learning?",
      options: [
        "The model is too simple to capture patterns",
        "The model performs well on training data but poorly on new data",
        "The model has too few parameters",
        "The model is trained for too few epochs"
      ],
      correctAnswer: "The model performs well on training data but poorly on new data"
    }
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const startTest = () => {
    if (testTopic.trim() || uploadedFiles.length > 0) {
      setTestStatus('in-progress')
      setCurrentQuestion(0)
      setSelectedAnswers({})
    }
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitTest = () => {
    setTestStatus('completed')
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  return (
    <div className="container">
      <div className="header fade-in-up">
        <h1>
          <FileText size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Mock Test Generator
        </h1>
        <p>Generate and take practice tests based on your uploaded content</p>
      </div>
      
      {testStatus === 'not-started' && (
        <>
          {/* Upload Section */}
          <div className="card fade-in-up" style={{ animationDelay: '0.1s', marginBottom: '30px' }}>
            <div style={{ padding: '25px' }}>
              <h2 style={{ marginTop: 0 }}>
                <Upload size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Upload Learning Materials
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Upload PDFs, documents, or text content to generate a personalized mock test
              </p>
              
              <div style={{ 
                border: '2px dashed var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 20px',
                textAlign: 'center',
                marginBottom: '25px',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  <Upload size={48} style={{ 
                    color: 'var(--primary-500)', 
                    margin: '0 auto 15px' 
                  }} />
                  <p style={{ 
                    fontSize: '1.1rem', 
                    margin: '0 0 10px' 
                  }}>
                    Click to upload files
                  </p>
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    PDF, DOC, DOCX, TXT files supported
                  </p>
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                  <h3>Uploaded Files:</h3>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={index}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px',
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        <FileText size={20} style={{ color: 'var(--primary-500)' }} />
                        <span style={{ flex: 1 }}>{file.name}</span>
                        <span style={{ 
                          fontSize: '0.9rem', 
                          color: 'var(--text-secondary)' 
                        }}>
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}>
                  Or specify a topic:
                </label>
                <input
                  type="text"
                  value={testTopic}
                  onChange={(e) => setTestTopic(e.target.value)}
                  placeholder="Enter a topic for your mock test (e.g., Neural Networks, Calculus, etc.)"
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={startTest}
                disabled={uploadedFiles.length === 0 && testTopic.trim() === ''}
                style={{ 
                  padding: '14px 28px',
                  fontSize: '1.1rem'
                }}
              >
                <BookOpen size={20} style={{ marginRight: '10px' }} />
                Generate and Start Mock Test
              </button>
            </div>
          </div>
          
          {/* Recent Tests */}
          <div className="card fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div style={{ padding: '25px' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ margin: 0 }}>
                  <BarChart3 size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                  Recent Test Results
                </h2>
                <button className="btn btn-outline">
                  <Filter size={18} style={{ marginRight: '8px' }} />
                  Filter
                </button>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { topic: 'Neural Networks Basics', score: 85, date: '2023-05-15', time: '25 min' },
                  { topic: 'Machine Learning Fundamentals', score: 92, date: '2023-05-10', time: '30 min' },
                  { topic: 'Data Preprocessing', score: 78, date: '2023-05-05', time: '20 min' }
                ].map((test, index) => (
                  <div 
                    key={index}
                    className="card modern"
                    style={{ 
                      border: '1px solid var(--border-primary)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <h3 style={{ margin: 0 }}>{test.topic}</h3>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: test.score >= 80 ? 'var(--success-500)' : 
                               test.score >= 60 ? 'var(--warning-500)' : 'var(--error-500)'
                      }}>
                        {test.score}%
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem'
                    }}>
                      <span>{test.date}</span>
                      <span>
                        <Clock size={14} style={{ marginRight: '5px' }} />
                        {test.time}
                      </span>
                    </div>
                    
                    <div style={{ 
                      marginTop: '15px',
                      height: '8px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      <div 
                        style={{ 
                          height: '100%',
                          width: `${test.score}%`,
                          backgroundColor: test.score >= 80 ? 'var(--success-500)' : 
                                         test.score >= 60 ? 'var(--warning-500)' : 'var(--error-500)',
                          borderRadius: 'var(--radius-full)'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      
      {testStatus === 'in-progress' && (
        <div className="card fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ padding: '25px' }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ margin: 0 }}>Mock Test: {testTopic || 'Custom Content'}</h2>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'var(--text-secondary)'
                }}>
                  <Clock size={18} />
                  <span>25:00</span>
                </div>
                <span style={{ 
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-700)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 'bold'
                }}>
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
            
            <div className="card" style={{ 
              padding: '25px',
              marginBottom: '25px'
            }}>
              <h3 style={{ 
                marginTop: 0,
                fontSize: '1.3rem',
                lineHeight: 1.4
              }}>
                {questions[currentQuestion].question}
              </h3>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginTop: '25px'
              }}>
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`btn ${selectedAnswers[questions[currentQuestion].id] === option ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleAnswerSelect(questions[currentQuestion].id, option)}
                    style={{ 
                      padding: '18px',
                      textAlign: 'left',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <span style={{ 
                      fontWeight: 'bold',
                      marginRight: '15px',
                      minWidth: '25px'
                    }}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <button 
                className="btn btn-outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                style={{ padding: '12px 25px' }}
              >
                Previous
              </button>
              
              {currentQuestion < questions.length - 1 ? (
                <button 
                  className="btn btn-primary"
                  onClick={nextQuestion}
                  style={{ padding: '12px 25px' }}
                >
                  Next Question
                </button>
              ) : (
                <button 
                  className="btn btn-success"
                  onClick={submitTest}
                  style={{ padding: '12px 25px' }}
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {testStatus === 'completed' && (
        <div className="card fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ padding: '25px', textAlign: 'center' }}>
            <div style={{ 
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: calculateScore() >= 80 ? 'var(--success-100)' : 
                              calculateScore() >= 60 ? 'var(--warning-100)' : 'var(--error-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              border: `5px solid ${calculateScore() >= 80 ? 'var(--success-200)' : 
                                  calculateScore() >= 60 ? 'var(--warning-200)' : 'var(--error-200)'}`
            }}>
              <span style={{ 
                fontSize: '2rem',
                fontWeight: 'bold',
                color: calculateScore() >= 80 ? 'var(--success-700)' : 
                       calculateScore() >= 60 ? 'var(--warning-700)' : 'var(--error-700)'
              }}>
                {calculateScore()}%
              </span>
            </div>
            
            <h2 style={{ 
              margin: '0 0 15px',
              color: calculateScore() >= 80 ? 'var(--success-700)' : 
                     calculateScore() >= 60 ? 'var(--warning-700)' : 'var(--error-700)'
            }}>
              {calculateScore() >= 80 ? 'Excellent Work!' : 
               calculateScore() >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            
            <p style={{ 
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              marginBottom: '30px'
            }}>
              You answered {Object.keys(selectedAnswers).filter(key => 
                selectedAnswers[parseInt(key)] === questions.find(q => q.id === parseInt(key))?.correctAnswer
              ).length} out of {questions.length} questions correctly.
            </p>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '25px',
              marginBottom: '30px'
            }}>
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '0 0 15px'
                }}>
                  <CheckCircle size={24} style={{ color: 'var(--success-500)' }} />
                  Correct Answers
                </h3>
                <p style={{ 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: 0,
                  color: 'var(--success-700)'
                }}>
                  {Object.keys(selectedAnswers).filter(key => 
                    selectedAnswers[parseInt(key)] === questions.find(q => q.id === parseInt(key))?.correctAnswer
                  ).length}
                </p>
              </div>
              
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '0 0 15px'
                }}>
                  <XCircle size={24} style={{ color: 'var(--error-500)' }} />
                  Incorrect Answers
                </h3>
                <p style={{ 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: 0,
                  color: 'var(--error-700)'
                }}>
                  {Object.keys(selectedAnswers).filter(key => 
                    selectedAnswers[parseInt(key)] !== questions.find(q => q.id === parseInt(key))?.correctAnswer
                  ).length}
                </p>
              </div>
              
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '0 0 15px'
                }}>
                  <AlertCircle size={24} style={{ color: 'var(--warning-500)' }} />
                  Review Needed
                </h3>
                <p style={{ 
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: 0,
                  color: 'var(--warning-700)'
                }}>
                  {questions.length - Object.keys(selectedAnswers).length}
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setTestStatus('not-started')
                  setTestTopic('')
                  setUploadedFiles([])
                }}
                style={{ padding: '12px 25px' }}
              >
                <Download size={18} style={{ marginRight: '8px' }} />
                Download Results
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setTestStatus('not-started')
                  setTestTopic('')
                  setUploadedFiles([])
                }}
                style={{ padding: '12px 25px' }}
              >
                Take Another Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MockTestPage