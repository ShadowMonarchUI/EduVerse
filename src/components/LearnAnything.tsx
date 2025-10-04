import React, { useState } from 'react'
import { BookOpen, Brain, Zap, Target, Award, Search, Loader } from 'lucide-react'
import { explainConceptStream, generateRelatedSourcesStream } from '../services/geminiService'

const LearnAnything: React.FC = () => {
  const [concept, setConcept] = useState('')
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [explanation, setExplanation] = useState('')
  const [sources, setSources] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const handleLearn = async () => {
    if (!concept.trim()) {
      setError('Please enter a concept to learn about')
      return
    }

    try {
      setLoading(true)
      setIsStreaming(true)
      setError(null)
      setExplanation('')
      setSources('')
      
      // Get explanation and sources simultaneously with streaming
      await Promise.all([
        explainConceptStream(concept, difficulty, (chunk) => {
          setExplanation(prev => prev + chunk)
        }),
        generateRelatedSourcesStream(concept, (chunk) => {
          setSources(prev => prev + chunk)
        })
      ])
    } catch (err) {
      setError('Failed to get explanation. Please try again.')
      console.error('Error getting explanation:', err)
    } finally {
      setLoading(false)
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && concept.trim()) {
      handleLearn()
    }
  }

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Beginner'
      case 'intermediate': return 'Intermediate'
      case 'advanced': return 'Advanced'
      default: return level
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'var(--success-500)'
      case 'intermediate': return 'var(--warning-500)'
      case 'advanced': return 'var(--error-500)'
      default: return 'var(--primary-500)'
    }
  }

  return (
    <div className="card fade-in-up">
      <div className="card-header">
        <h2 className="card-title">
          <Brain size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Learn Anything
        </h2>
        <p className="card-subtitle">Get AI-powered explanations for any concept in 3 difficulty levels</p>
      </div>
      
      <div style={{ padding: '0 30px 30px 30px' }}>
        {/* Search Input */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '25px'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }} />
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a concept you want to learn about..."
              className="form-input form-input-lg"
              style={{ 
                paddingLeft: '45px',
                width: '100%'
              }}
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleLearn}
            disabled={loading || !concept.trim()}
            style={{ padding: '12px 25px' }}
          >
            {loading ? (
              <>
                <Loader size={20} className="loading-spinner" style={{ marginRight: '8px' }} />
                {isStreaming ? 'Streaming...' : 'Learning...'}
              </>
            ) : (
              <>
                <BookOpen size={20} style={{ marginRight: '8px' }} />
                Learn
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="login-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        {/* Difficulty Selector */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '25px'
        }}>
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <button
              key={level}
              className={`btn ${difficulty === level ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDifficulty(level)}
              style={{ 
                flex: 1,
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: `${getDifficultyColor(level)}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {level === 'beginner' && <Target size={20} style={{ color: getDifficultyColor(level) }} />}
                {level === 'intermediate' && <Zap size={20} style={{ color: getDifficultyColor(level) }} />}
                {level === 'advanced' && <Award size={20} style={{ color: getDifficultyColor(level) }} />}
              </div>
              <span>{getDifficultyLabel(level)}</span>
            </button>
          ))}
        </div>
        
        {/* Explanation and Sources */}
        {explanation && (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '25px'
          }}>
            {/* Explanation */}
            <div className="card" style={{ 
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)'
            }}>
              <div style={{ 
                padding: '20px',
                borderBottom: '1px solid var(--border-primary)'
              }}>
                <h3 style={{ 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Brain size={20} style={{ color: getDifficultyColor(difficulty) }} />
                  Explanation ({getDifficultyLabel(difficulty)} Level)
                </h3>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ 
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}>
                  {explanation}
                  {loading && isStreaming && (
                    <span className="streaming-cursor"></span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Related Sources */}
            <div className="card" style={{ 
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)'
            }}>
              <div style={{ 
                padding: '20px',
                borderBottom: '1px solid var(--border-primary)'
              }}>
                <h3 style={{ 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <BookOpen size={20} style={{ color: 'var(--primary-600)' }} />
                  Related Sources
                </h3>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ 
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap'
                }}>
                  {sources}
                  {loading && isStreaming && (
                    <span className="streaming-cursor"></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!explanation && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: 'var(--text-secondary)'
          }}>
            <Brain size={48} style={{ 
              margin: '0 auto 20px', 
              color: 'var(--primary-300)' 
            }} />
            <h3>Learn Any Concept</h3>
            <p>Enter a topic above and choose your difficulty level to get an AI-powered explanation</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LearnAnything